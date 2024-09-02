import MBP from 'meta-buffer-pack'
import EventEmitter from "eventemitter3";
import { IOMsg, PAYLOAD_TYPE, SIZE_LIMIT, ENC_MODE, STATES } from '../common/constants.js'
import { quotaTable } from '../common/quotaTable.js'
import { getSignalPack } from '../common/payload.js';
import Boho from "boho";

const Buffer = MBP.Buffer;
const encoder = new TextEncoder()
const decoder = new TextDecoder()

function byteToUrl(buffer) {
  //ipv4(4bytes) , port(2bytes)
  if (buffer.byteLength != 6) return
  let address = buffer[0].toString() + "." + buffer[1].toString()
    + "." + buffer[2].toString() + "." + buffer[3].toString();
  let port = (buffer[4] << 8) + buffer[5]
  return address + ':' + port.toString()
}

export class IOCore extends EventEmitter {
  constructor(url) {
    super();
    this.cid = ""   // get from the server  CID_RES
    this.ip = ""    // get from the server  IAM_RES message.
    this.socket = null;
    this.url = url; // init default server url
    this.state = STATES.CLOSED;  // Number type
    this.stateName = this.getStateName() // String type

    this.txCounter = 0;
    this.rxCounter = 0;
    this.txBytes = 0;
    this.rxBytes = 0;

    this.lastTxRxTime = Date.now();
    this.connectionCheckerPeriod = SIZE_LIMIT.CONNECTION_CHECKER_PERIOD;
    this.connectionCheckerIntervalID = null;

    this.boho = new Boho()
    this.TLS = false // true if protocol is wss(TLS)
    this.encMode = ENC_MODE.AUTO;
    this.useAuth = false;

    this.nick = "";
    this.channels = new Set()
    this.promiseMap = new Map()
    this.promiseTimeOut = SIZE_LIMIT.PROMISE_TIMEOUT
    this.mid = 0  // promise message id 

    this.level = 3; // also defaultQuotaLevel
    this.quota = quotaTable[this.level];
    this.serverSet = {}
    this.linkMap = new Map()

    this.on('open', this.onOpen.bind(this))
    this.on('close', this.onClose.bind(this))
    this.on('socket_data', this.onData.bind(this))
  }


  redirect(url2) {
    this.close()
    this.stateChange('redirecting')
    this.createConnection(url2)
  }

  open(url) {
    if (!url && !this.url) return;

    if (url) {
      if (!this.url) { // default host url
        this.url = url
      } else if (url !== this.url) { // default host url change
        this.url = url;
        if (this.socket) {
          this.close()
          return
        }
      }
    }

    this.createConnection(this.url)

    if (!this.connectionCheckerIntervalID) {
      this.connectionCheckerIntervalID = setInterval(this.keepAlive.bind(this), this.connectionCheckerPeriod);
    }
  }

  onOpen() {
    if (this.url.includes("wss://")) {
      this.TLS = true;
    } else {
      this.TLS = false;
    }
    this.stateChange('open')
  }

  onClose() {
    this.boho.isAuthorized = false;
    this.cid = ""
    this.stateChange('closed')
  }

  // manual login
  login(id, key) {
    if (!id && !key) {
      console.log('no id and key.')
      return
    }
    console.log('manual login: ', id)

    if (!key && id.includes('.')) {
      this.boho.set_id_key(id)
    } else if (id && key) {
      this.boho.set_id8(id)
      this.boho.set_key(key)
    } else {
      console.log('no id or key.')
      return
    }
    this.useAuth = true
    let auth_pack = this.boho.auth_req()
    this.send(auth_pack)
  }

  // auto login
  auth(id, key) {
    if (!id && !key) {
      console.log('no id and key.')
      return
    }

    if (!key && id.includes('.')) {
      this.boho.set_id_key(id)
    } else if (id && key) {
      this.boho.set_id8(id)
      this.boho.set_key(key)
    } else {
      console.log('no id or key.')
      return
    }
    this.useAuth = true
  }

  onData(buffer) {
    let msgType = buffer[0];
    let decoded;

    if (msgType === Boho.BohoMsg.ENC_488) {
      decoded = this.boho.decrypt_488(buffer)
      if (decoded) {
        msgType = decoded[0]
        buffer = decoded
      } else {
        // console.log('DEC_FAIL', buffer.byteLength)
      }
    } else if (msgType === Boho.BohoMsg.ENC_E2E) {

      try {
        decoded = this.boho.decrypt_488(buffer)
        if (decoded) {
          // console.log( 'ENC_E2E decoded ', decoded )
          msgType = decoded[0]
          // decoded has msg_header only. 
          buffer.set(decoded, Boho.MetaSize.ENC_488) // set decoded signal_e2e headaer.
          buffer = buffer.subarray(Boho.MetaSize.ENC_488) // reset offset.
          // console.log('DECODED MsgType:', IOMsg[ msgType ] )
        } else {
          // console.log('488 DEC_FAIL', buffer)
          return
        }

      } catch (err) {
        // console.log('E2E DEC_FAIL decryption error', err)
        return
      }

    }

    let type = IOMsg[msgType]
    if (!type) type = Boho.BohoMsg[msgType]

    // console.log( "MsgType: ", type , " LEN ", buffer.byteLength)

    switch (msgType) {
      case IOMsg.OVER_SIZE:
        console.log('## server sent: over_size event.')
        this.emit('over_size', 'over_size')
        break;
      case IOMsg.PING:
        this.pong();
        break;

      case IOMsg.PONG:
        break;

      case IOMsg.IAM_RES:
        try {
          let str = decoder.decode(buffer.subarray(1))
          let jsonInfo = JSON.parse(str)
          if (jsonInfo.ip) {
            this.ip = jsonInfo.ip;
          }
          console.log('<IAM_RES>', JSON.stringify(jsonInfo))
          // console.log('<IAM_RES>', JSON.stringify(jsonInfo,null,2))
        } catch (error) {
          // console.log('<IAM_RES> data error')
        }
        break;

      case IOMsg.CID_RES:
        let cidStr = decoder.decode(buffer.subarray(1))
        this.cid = cidStr;

        // **IMPORTANT** change state before subscribe.
        this.stateChange('ready', 'cid_ready')
        this.subscribe_memory_channels()
        break;

      case IOMsg.QUOTA_LEVEL:
        let quotaLevel = buffer[1]
        this.level = quotaLevel;
        this.quota = quotaTable[quotaLevel];
        console.log('## QUOTA:', quotaLevel, JSON.stringify(this.quota))
        break;

      case IOMsg.SERVER_CLEAR_AUTH:
        this.useAuth = false;
        this.boho.clearAuth();
        this.stop();
        break;

      case IOMsg.SERVER_REDIRECT:
        let host_port;
        let url;
        let protocol;
        let addressType;
        if (buffer.byteLength == 7) { // ipv4 ,port
          addressType = 'IPV4:PORT'
          host_port = byteToUrl(buffer.subarray(1))
          protocol = 'cong://'
        } else { // domain url
          addressType = 'URL'
          host_port = decoder.decode(buffer.subarray(1))
          protocol = ''
        }

        url = protocol + host_port
        this.redirect(url)
        break;

      case IOMsg.SERVER_READY:
        this.stateChange('server_ready', 'server_ready')
        if (this.useAuth) {
          this.send(this.boho.auth_req())
          // CID_REQ will be called, after auth_ack.
        } else {
          // CID_REQ here, if not using auth.
          this.send(Buffer.from([IOMsg.CID_REQ]))
        }
        break;

      case IOMsg.SERVER_SIGNAL:
        try {
          let str = decoder.decode(buffer.subarray(1))
          let ss = JSON.parse(str)

          if (ss.event && ss.data) {
            this.serverSet = ss.data;
            this.emit(ss.event, ss.data)
          }

        } catch (error) {
          // console.log('<SERVER_SIGNAL> parsing error')
        }
        break;

      case IOMsg.SET:
        try {
          let setPack = MBP.unpack(buffer)
          if (setPack) {
            this.emit(setPack.topic, ...setPack.args)
          }
        } catch (error) {
          // console.log('<SET> parsing error')
        }
        break;

      case IOMsg.SIGNAL_E2E:
      case IOMsg.SIGNAL:
        try {
          let tagLen = buffer.readUint8(1)
          let tagBuf = buffer.subarray(2, 2 + tagLen)
          let tag = decoder.decode(tagBuf)

          let payloadType = buffer.readUint8(2 + tagLen)
          let payloadBuffer = buffer.subarray(3 + tagLen)

          /* three types of signal message.
            > unicast message to me:  tag includes @, no cid: '@*'
            > cid_sub message:  tag includes cid and @ both : 'cid@*'
            > ch_sub message:  else.
          */
          switch (payloadType) {

            case PAYLOAD_TYPE.EMPTY:
              if (tag.indexOf('@') === 0) this.emit('@', null, tag)
              else this.emit(tag, null, tag)
              break;

            case PAYLOAD_TYPE.TEXT:
              // !! Must remove null char before decode in JS.
              // string payload contains null char for the c/cpp devices.
              let payloadStringWithoutNull = payloadBuffer.subarray(0, payloadBuffer.byteLength - 1)
              let oneString = decoder.decode(payloadStringWithoutNull)
              if (tag.indexOf('@') === 0) this.emit('@', oneString, tag)
              if (tag !== '@') this.emit(tag, oneString, tag)
              break;

            case PAYLOAD_TYPE.BINARY:
              if (tag.indexOf('@') === 0) this.emit('@', payloadBuffer, tag)
              if (tag !== '@') this.emit(tag, payloadBuffer, tag)
              break;

            case PAYLOAD_TYPE.OBJECT:
              let oneObjectBuffer = decoder.decode(payloadBuffer)
              let oneJSONObject = JSON.parse(oneObjectBuffer)
              if (tag.indexOf('@') === 0) this.emit('@', oneJSONObject, tag)
              if (tag !== '@') this.emit(tag, oneJSONObject, tag)
              break;

            case PAYLOAD_TYPE.MJSON:
              let mjsonBuffer = decoder.decode(payloadBuffer)
              let mjson = JSON.parse(mjsonBuffer)
              if (tag.indexOf('@') === 0) this.emit('@', ...mjson, tag)
              if (tag !== '@') this.emit(tag, ...mjson, tag)
              break;

            case PAYLOAD_TYPE.MBA:
              let mbaObject = MBP.unpack(payloadBuffer)
              if (tag.indexOf('@') === 0) this.emit('@', ...mbaObject.args, tag)
              if (tag !== '@') this.emit(tag, ...mbaObject.args, tag)
              break;

            default:
            // console.log('## Unkown payloadtype', payloadType)
          }

        } catch (err) {
          // console.log('## signal parse err', err)
        }
        break;

      case IOMsg.RESPONSE_MBP:
        this.testPromise(buffer)
        break;

      case Boho.BohoMsg.AUTH_NONCE:
        let auth_hmac = this.boho.auth_hmac(buffer)
        if (auth_hmac) {
          this.send(auth_hmac)
        } else {
          this.stateChange('auth_fail', 'Invalid local auth_hmac.')
        }
        break;

      case Boho.BohoMsg.AUTH_FAIL:
        this.stateChange('auth_fail', 'server reject auth.')
        break;

      case Boho.BohoMsg.AUTH_ACK:
        if (this.boho.check_auth_ack_hmac(buffer)) {
          this.stateChange('auth_ready', 'server sent auth_ack')
          this.send(Buffer.from([IOMsg.CID_REQ]))
        } else {
          this.stateChange('auth_fail', 'invalid server_hmac')
        }
        break;

      default:
        try {
          decoded = decoder.decode(buffer)
          // console.log('text message:', decoded)
          this.emit('text_message', decoded)
        } catch (error) {

        }

        break;

    }
  }

  iam(title) {
    // console.log('iam', title)
    if (title) {
      this.send_enc_mode(MBP.pack(
        MBP.MB('#MsgType', '8', IOMsg.IAM),
        MBP.MB('#', title)
      ))
    } else {
      this.send_enc_mode(MBP.pack(
        MBP.MB('#MsgType', '8', IOMsg.IAM)
      ))
    }
  }


  ping() {
    this.send(Buffer.from([IOMsg.PING]))
  }

  pong() {
    this.send(Buffer.from([IOMsg.PONG]))
  }


  // application level ping tool.  
  // simple message sending and reply.
  echo(args) {
    if (args) {
      console.log('echo args:', args)
      this.send_enc_mode(MBP.pack(
        MBP.MB('#MsgType', '8', IOMsg.ECHO),
        MBP.MB('#msg', args)
      ))
    } else {
      // # do not encrypt blank echo #
      this.send(Buffer.from([IOMsg.ECHO]))
    }
  }


  bin(...data) {
    this.send(MBP.U8pack(...data))
  }

  send(data) {
    if (data.byteLength > this.quota.signalSize) {
      this.emit('over_size')
      console.log('## QUOTA LIMIT OVER!! \nsignal message.byteLength: ', data.byteLength)
      console.log('## your maximum signalSize(bytes) is:', this.quota.signalSize)
      return
    }
    this.socket_send(data);
  }

  /*
   Policy. Should message do encrypt?

   if encMode == auto
     NO. if connection using TLS line.
        // ex. wss://url connection.
     YES. if no TLS line.
        // ex. ws://url connection.

   if encMode == YES
     YES. encrypt the message.

   if encMode == NO
     NO. do not ecnrypt message.

  */
  getEncryptionMode() {
    if (this.encMode === ENC_MODE.YES ||
      this.encMode === ENC_MODE.AUTO &&
      !this.TLS && this.boho.isAuthorized
    ) {
      return true;
    } else {
      return false
    }
  }

  send_enc_mode(data, useEncryption) {

    // use default policy.
    if (useEncryption === undefined) {
      useEncryption = this.getEncryptionMode()
    }

    if (data[0] == IOMsg.SIGNAL_E2E && useEncryption) {
      // input data:  signal_header + e2ePayload
      // encrypt signal_header area only. payload is encrypted with e2e key already.
      let tagLen = data[1]
      let encHeader = this.boho.encrypt_488(data.subarray(0, 3 + tagLen))
      encHeader[0] = Boho.BohoMsg.ENC_E2E
      this.send(Buffer.concat([encHeader, data.subarray(3 + tagLen)]))
      // console.log('<< send_enc_mode [ ENC_E2E ]')

    } else if (useEncryption) {
      // console.log('<< send_enc_mode [ ENC_488 ]')
      let encPack = this.boho.encrypt_488(data)
      this.send(encPack)
    } else {
      // console.log('<< send_enc_mode  [ PLAIN ]' )
      this.send(data)
    }

  }


  setMsgPromise(mid) {
    return new Promise((resolve, reject) => {
      this.promiseMap.set(mid, [resolve, reject])
      setTimeout(e => {
        if (this.promiseMap.has(mid)) {
          reject('timeout');
          this.promiseMap.delete(mid)
        }
      }, this.promiseTimeOut);
    })
  }

  testPromise(buffer) {

    let res = MBP.unpack(buffer)
    if (!res) return

    if (this.promiseMap.has(res.mid)) {
      let [resolve, reject] = this.promiseMap.get(res.mid)
      this.promiseMap.delete(res.mid)

      if (res.status < 128) {
        res.ok = true;
        resolve(res)
      } else {
        res.ok = false;
        reject(res)
      }


    } else {
      console.log('no promise id')
    }
  }


  publish(...args) {
    this.signal(...args)
  }


  signal(tag, ...args) {
    if (typeof tag !== 'string') throw TypeError('tag should be string.')

    let signalPack = getSignalPack(tag, ...args)
    this.send_enc_mode(signalPack)
  }

  decrypt_e2e(data, key) {
    return this.boho.decrypt_e2e(data, key)
  }

  signal_e2e(tag, data, key) {

    if (typeof tag !== 'string') throw TypeError('tag should be string.')
    let tagEncoded = encoder.encode(tag)
    let dataPack = MBP.B8(data)

    //encrypt payload area with key
    let sercretPack = this.boho.encrypt_e2e(dataPack, key)

    //change signal MsgType header into SIGNAL_E2E
    let signalPack = MBP.pack(
      MBP.MB('#MsgType', '8', IOMsg.SIGNAL_E2E),
      MBP.MB('#tagLen', '8', tagEncoded.byteLength),
      MBP.MB('#tag', tagEncoded),
      MBP.MB('#payloadType', '8', PAYLOAD_TYPE.BINARY),
      MBP.MB('#payload', sercretPack)
    )

    this.send_enc_mode(signalPack)
  }



  set(storeName, ...args) {
    if (!storeName || args.length == 0) {
      return Promise.reject(new Error('set need storeName and value)'))
    }
    return this.req('store', 'set', storeName, ...args)
  }

  async get(storeName) {
    if (!storeName) {
      return Promise.reject(new Error('store get need storeName)'))
    }
    let pack = await this.req('store', 'get', storeName)
    let { $ } = MBP.unpack(pack.body)
    return $
  }


  req(target, topic, ...args) {
    if (!target || !topic)
      return Promise.reject(new Error('request need target and topic)'))
    let sigPack;
    if (args.length > 0) {
      sigPack = MBP.pack(
        MBP.MB('#MsgType', '8', IOMsg.REQUEST),
        MBP.MB('mid', '16', ++this.mid),
        MBP.MB('target', target),
        MBP.MB('topic', topic),
        MBP.MBA(...args)
      )
    } else {
      sigPack = MBP.pack(
        MBP.MB('#MsgType', '8', IOMsg.REQUEST),
        MBP.MB('mid', '16', ++this.mid),
        MBP.MB('target', target),
        MBP.MB('topic', topic)
      )
    }
    this.send_enc_mode(sigPack)
    return this.setMsgPromise(this.mid)
  }


  subscribe(tag) {
    if (typeof tag !== 'string') throw TypeError('tag should be string.')
    if (this.state !== STATES.READY) return

    let tagList = tag.split(',')
    tagList.forEach(tag => {
      this.channels.add(tag)
    })

    let tagEncoded = encoder.encode(tag)
    if (tagEncoded.byteLength > SIZE_LIMIT.TAG_LEN1) throw TypeError('please use tag string bytelength below:' + SIZE_LIMIT.TAG_LEN1)

    this.send_enc_mode(
      Buffer.concat([
        MBP.NB('8', IOMsg.SUBSCRIBE),
        MBP.NB('8', tagEncoded.byteLength),
        tagEncoded]))
  }

  subscribe_promise(tag) {
    if (typeof tag !== 'string') throw TypeError('tag should be string.')
    if (this.state !== STATES.READY) {
      return Promise.reject('subscribe_promise:: connection is not ready')
    }

    let tagEncoded = encoder.encode(tag)
    if (tagEncoded.byteLength > SIZE_LIMIT.TAG_LEN2) throw TypeError('please use tag string bytelength: ' + SIZE_LIMIT.TAG_LEN2)

    this.send_enc_mode(
      Buffer.concat([
        MBP.NB('8', IOMsg.SUBSCRIBE_REQ),
        MBP.NB('16', ++this.mid),
        MBP.NB('16', tagEncoded.byteLength),
        tagEncoded]))
    return this.setMsgPromise(this.mid)
  }

  subscribe_memory_channels() { //local cache . auto_resubscribe
    if (this.channels.size == 0) return
    let chList = Array.from(this.channels).join(',')

    this.subscribe_promise(chList)
      .then((res) => {
        // console.log('>> SUBSCRIBE_REQ result', res ) // return code == map.size
      }).catch((e) => {
        console.log('>> SUBSCRIBE FAIL:', e)
      })

  }

  unsubscribe(tag = "") {
    if (typeof tag !== 'string') throw TypeError('tag should be string.')

    if (tag == "") { // blank tag means unsubscribe all
      this.channels.clear();
    } else {
      let tagList = tag.split(',')
      tagList.forEach(tag => {
        this.channels.delete(tag)
      })
    }

    let tagEncoded = encoder.encode(tag)
    if (tagEncoded.byteLength > SIZE_LIMIT.TAG_LEN1) throw TypeError('please use tag string bytelength below:' + SIZE_LIMIT.TAG_LEN1)

    this.send_enc_mode(Buffer.concat([
      MBP.NB('8', IOMsg.UNSUBSCRIBE),
      MBP.NB('8', tagEncoded.byteLength),
      tagEncoded]))
  }


  listen(tag, handler) {
    if (typeof tag !== 'string') throw TypeError('tag should be string.')
    if (tag.length > 255 || tag.length == 0) throw TypeError('tag string length range: 1~255')
    if (typeof handler !== 'function') throw TypeError('handler is not a function.')

    if (tag.indexOf('@') !== 0) {
      this.channels.add(tag)
    }
    this.on(tag, handler)
    // do not subscribe now.
    // will subscribe when receive CID_RES signal from server.

  }



  link(to, tag, handler) {
    if (typeof to !== 'string') throw TypeError('to(local link target) is not a string.')
    if (typeof tag !== 'string') throw TypeError('tag is not a string.')
    if (tag.length > 255 || tag.length == 0) throw TypeError('tag string length range: 1~255')
    if (typeof handler !== 'function') throw TypeError('handler is not a function.')

    if (tag.indexOf('@') !== 0) {
      this.channels.add(tag)
    }

    let linkSet;
    if (this.linkMap.has(to)) {
      linkSet = this.linkMap.get(to)
    } else {
      linkSet = new Set()
    }

    linkSet.add(tag)
    this.linkMap.set(to, linkSet)
    this.on(tag, handler)
    this.subscribe(tag)

  }


  unlink(to, tag) {
    if (typeof to !== 'string') throw TypeError('to(local link target) is not a string.')
    if (typeof tag !== 'string') throw TypeError('tag is not a string.')
    if (tag.length > 255 || tag.length == 0) throw TypeError('tag string length range: 1~255')

    if (!this.linkMap.has(to)) return;

    let linkSet = this.linkMap.get(to)
    let tags = Array.from(linkSet)
    for (let i = 0; i < tags.length; i++) {
      if (tags[i] == tag) {
        this.unsubscribe(tag)
        this.removeAllListeners(tag)
        linkSet.delete(tag)
        this.linkMap.set(to, linkSet)
        break;
      }
    }

  }

  unlinkAll(to) {
    if (typeof to !== 'string') throw TypeError('to(local link target) is not a string.')
    if (!this.linkMap.has(to)) return;

    let linkSet = this.linkMap.get(to)
    let tags = Array.from(linkSet)
    for (let i = 0; i < tags.length; i++) {
      this.unsubscribe(tags[i])
      this.removeAllListeners(tags[i])
      linkSet.delete(tags[i])
    }
    this.linkMap.delete(to)

  }



  getMetric() {
    return {
      tx: this.txCounter,
      rx: this.rxCounter,
      txb: this.txBytes,
      rxb: this.rxBytes,
      last: (Date.now() - this.lastTxRxTime) / 1000
    }

  }

  getState() {
    return this.state
  }

  getStateName() {
    //state <number>
    //value of constant STATES.NAME < number >
    //type of constant STATES.NAME name < string uppercase >
    //stateName,eventName <string lowercase>
    return (STATES[this.state]).toLowerCase()
  }

  getSecurity() {
    return {
      useAuth: this.useAuth,
      isTLS: this.TLS,
      isAuthorized: this.boho.isAuthorized,
      encMode: this.encMode,
      usingEncryption: this.getEncryptionMode()
    }
  }

  stateChange(state, emitEventAndMessage) {
    // STATES constant name : string upperCase
    // eventName, .stateName : string lowerCase
    // .state : number
    let eventName = state.toLowerCase()
    this.state = STATES[state.toUpperCase()] // state: number
    if (emitEventAndMessage) this.emit(eventName, emitEventAndMessage)

    if (this.stateName !== eventName) {
      this.stateName = eventName
      this.emit('change', eventName)
    }
  }

}




