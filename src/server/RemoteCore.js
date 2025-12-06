import MBP from 'meta-buffer-pack'
import Boho from 'boho'
import { serverOption } from './serverOption.js';
import { IOMsg, ENC_MODE, STATE } from '../common/constants.js'
import { quotaTable } from '../common/quotaTable.js'

const decoder = new TextDecoder()

const NB = MBP.NB
const MB = MBP.MB


export class RemoteCore {
  constructor(socket, manager) {

    this.socket = socket;
    socket.isAlive = true;
    socket.txCounter = 0;
    socket.rxCounter = 0;
    socket.openTime = Date.now()

    this.boho = new Boho()
    this.encMode = ENC_MODE.AUTO;
    this.channels = new Set();  //  subscribed tags
    this.retain_signal = new Map();

    this.ssid = RemoteCore.ssid++;  // ordered index number
    this.manager = manager;

    this.cid = ''; // Client Id
    this.did = ''; // Device Id
    this.uid = ''; // User Id
    this.nick = ''

    this.privateNode = false
    this.HOME_CHANNEL = ''
    this.level = serverOption.defaultQuotaIndex;
    this.quota = quotaTable[this.level];
    this.isAdmin = false;

    this.state;
    this.stateLog = [];
    this.setState(STATE.OPEN)

  }

  static ssid = 1;

  setState(state) {
    this.state = state
    if (serverOption.debug.showAuthInfo) {
      this.stateLog.push(  state + ":" + STATE[ state]   )
      if( state == STATE.AUTH_RES){
        console.log('[auth success]', this.cid, this.stateLog.join('>'))
      }else if( state == STATE.AUTH_FAIL){
        console.log('[auth_fail]',this.stateLog.join('>'))
      }
    }
  }

  getState() { // <Number>
    return this.state
  }

  getStateName() { // <String>
    return (STATE[this.state]).toLowerCase()
  }


  showMessageLog(message, isBinary) {
    let h = '->S '
    let from = this.boho.isAuthorized ? ` did: ${this.did} cid: ${this.cid}` : ` cid: ${this.cid}`
    let prnLimit = 20
    if (isBinary) {
      let msgTypeName = IOMsg[message[0]]
      if (!msgTypeName) msgTypeName = Boho.BohoMsg[message[0]]

      msgTypeName = '[' + msgTypeName + ']';
      let size = message.byteLength;
      if (size < prnLimit) {
        console.log( h + msgTypeName + from +` [${size}]`, message);
      } else {
        let elseLen = size - prnLimit
        let some = message.subarray(0,prnLimit)
        console.log( h + msgTypeName + from +` [${size}]` , some , ' ... else: ', elseLen);
      }

    } else {
      console.log( h + ' [TEXT] %s' + from, message);
    }
  }

  rxQuotaChecker(message) {
    let rxBytes = message.byteLength
    this.manager.rxBytes += rxBytes;

    if (serverOption.useQuota.signalSize && (rxBytes > this.quota.signalSize)) {
      console.log('## quota: size over')
      this.send(Buffer.from([IOMsg.OVER_SIZE]))
      if (serverOption.useQuota.disconnect) this.close();
      return false;
    }

    // todo:
    // traffic rate :  
    return true;
  }

  onTimeDelayMessage(message, isBinary = true) {
    setTimeout(() => {
      this.onSocketMessage(message, isBinary)
    }
      , serverOption.debug.delay)
  }

  // CongSocket or WebSocket
  onSocketMessage(message, isBinary = true) {

    this.receiveMonitor() // rx-data, ping/pong and timeout check
    if (!this.rxQuotaChecker(message)) return

    if (serverOption.showMessage === 'message') this.showMessageLog(message, isBinary)

    let msgType, decoded

    if (isBinary) {
      msgType = message[0]

      if (msgType === Boho.BohoMsg.ENC_488) {

        try {
          decoded = this.boho.decrypt_488(message)
        } catch (err) {
          console.log('-- E488 DEC_FAIL', err)
          return
        }

        if (decoded) {
          msgType = decoded[0]
          message = decoded
        } else {
          return
        }

      } else if (msgType === Boho.BohoMsg.ENC_E2E) { // symetric E2EE Signal
        try {
          decoded = this.boho.decrypt_488(message)
        } catch (err) {
          // console.log('-- E2E DEC_FAIL', err)
          return
        }
        // console.log('e2e unpack:', decoded )
        if (decoded) {
          msgType = decoded[0]
          message.set(decoded, Boho.MetaSize.ENC_488) // set decoded signal_e2e headaer.
          message = message.subarray(Boho.MetaSize.ENC_488) // reset offset.
        } else {
          return
        }

      } else {
        // console.log( `[P] ${ IOMsg[ msgType] || Boho.BohoMsg[cmd]}  LEN: ${message.byteLength}` )
      }

      switch (msgType) {
        case IOMsg.PING:
          this.pong();
          break;

        case IOMsg.PONG:
          break;

        case IOMsg.CID_REQ:
          if (this.state < STATE.SERVER_READY) {
            // Protocol violation: CID_REQ was sent before receiving the SERVER_READY signal.
            console.log('CID_REQ before SERVER_READY')
            this.close()
          }

          if (!this.cid) {
            this.cid = '?' + globalThis.crypto.getRandomValues(Buffer.alloc(3)).toString('base64url')
            this.manager.cid2remote.set(this.cid, this)
          }

          // console.log('<< SENDING CID_RES:', this.cid)
          this.send_enc_mode(MBP.pack(
            MB('#cid_ack', '8', IOMsg.CID_RES),
            MB('#cid', this.cid)
          ))

          this.setState(STATE.CID_RES)
          break;

        case IOMsg.ECHO:
          if( message.byteLength < 30) {      
            this.send(message, isBinary)
          }
          break;

        case IOMsg.IAM:
          if (message.byteLength > 1 && message.byteLength < 30) {            
              // if iam request has a text message then reset the nick property.
              this.nick = decoder.decode(message.subarray(1))
          }
          this.iamResponse()
          break;

        case IOMsg.SIGNAL_E2E:
        case IOMsg.SIGNAL:
          if (message.byteLength >= 3) {
            let tagLen = message.readUInt8(1)
            if (message.byteLength >= tagLen + 2) {
              let tag = message.subarray(2, 2 + tagLen)
              tag = decoder.decode(tag)
              this.manager.sender(tag, this, message)
            }
          }
          break;



        case IOMsg.UNSUBSCRIBE:
          if (message.byteLength == 2) {
            this.manager.unsubscribe([''], this)
          } else if (message.byteLength >= 3) {
            let tagLen = message.readUInt8(1)

            if (message.byteLength == tagLen + 2) {
              let tag = message.subarray(2, 2 + tagLen)
              tag = decoder.decode(tag)
              let tagList = tag.split(',')
              this.manager.unsubscribe(tagList, this)
            }
          }
          break;


        case IOMsg.SUBSCRIBE: // 1byte tagLen
          if (message.byteLength >= 3) {
            let tagLen = message.readUInt8(1)
            if (message.byteLength == tagLen + 2) {
              let tag = message.subarray(2, 2 + tagLen)
              tag = decoder.decode(tag)
              let tagList = tag.split(',')
              this.manager.subscribe(tagList, this)
            }
          }
          break;

        case IOMsg.SUBSCRIBE_REQ:  // 2bytes tagLen
          if (message.byteLength >= 6) {
            let msgID = message.readUInt16BE(1)
            let tagLen = message.readUInt16BE(3)
            if (message.byteLength == tagLen + 5) {
              let tag = message.subarray(5, 5 + tagLen)
              tag = decoder.decode(tag)
              let tagList = tag.split(',')
              // console.log('>> SUBSCRIBE_REQ from:', this.cid, tagList)
              this.manager.subscribe(tagList, this)
              this.response(msgID, 0)
            } else {
              this.response(msgID, 255)
            }
          }
          break;


        case IOMsg.CALL: //service request
          try {
            let req = MBP.unpack(message)
            if (req) {
              if (!req.target || !req.topic) return
              if (this.manager.server.serviceNames.has(req.target)) {
                this.manager.server.emit(req.target, this, req)
              } else {
                // console.log('UnKnown Service call: ', req.target)
              }
            }
          } catch (e) {
            console.log('request catch error', e)
          }
          break;


        case IOMsg.CLOSE:
          if (message.byteLength > 1) {
            let reason = decoder.decode(message.subarray(1))
            console.log('>> CLOSE reason:', reason)
            this.close();
          }
          break;


        // client's auth requst
        case Boho.BohoMsg.AUTH_REQ:
          if (!this.manager.authManager) return
          if (this.state < STATE.SERVER_READY) {
            console.log('protocol error. must called auth_req after server_ready')
            this.close();
          }
          this.setState(STATE.AUTH_REQ)
          //async
          this.manager.authManager.verify_auth_req(message, this)
            .then(authInfo => {
              if (authInfo?.name) {
                this.manager.deligateSignal(this, '@$name', authInfo.name)
                // console.log('device login success authInfo', authInfo)
                // this.manager.sender('@$name', authInfo.name )
              }

              // console.log('[VERIFY AUTH_REQ] SubClass of BohoAuth return authInfo:', authInfo )
            })
            .catch(e => {
              console.log('authInfo return fail.', e )
            })

          return;

        default:
        // console.log('unknown MsgType:',msgType,' from:', this.ip, this.ssid, this.cid )

      }

    } else {
      // TEXT FRAME
      try {
        let textMessage = decoder.decode(message)
        // console.log('text buffer:',textMessage )
        // console.log('text buffer:',message.toString('hex') )
        this.manager.server.emit('text_message', textMessage, this)
      } catch (error) {

      }
    }

  }


  response(msgId, statusCode, body) {
    // console.log('response body', body)
    if (body) {
      this.send_enc_mode(MBP.pack(
        MB('#type', '8', IOMsg.RESPONSE_MBP),
        MB('status', '8', statusCode),
        MB('mid', '16', msgId),
        MB('body', body)
      ))
    } else {
      this.send_enc_mode(MBP.pack(
        MB('#type', '8', IOMsg.RESPONSE_MBP),
        MB('status', '8', statusCode),
        MB('mid', '16', msgId)
      ))
    }
  }


  send_enc_mode(data, useEncryption = false) {

    if (this.encMode === ENC_MODE.YES ||
      this.encMode === ENC_MODE.AUTO &&
      !this.TLS && this.boho.isAuthorized
    ) useEncryption = true;

    // console.log('svr useEnc',  useEncryption, data )

    if (useEncryption && data[0] == IOMsg.SIGNAL_E2E) {
      // When the server delivers end-to-end encrypted messages, 
      // it should only encrypt the header part and pass the data part as is.
      let tagLen = data[1];

      // let tagInfo = decoder.decode( data.subarray( 2, 2 + tagLen) )
      // console.log('server bypass E2E signal taginfo:', tagInfo )

      let encHeader = this.boho.encrypt_488(data.subarray(0, 3 + tagLen))
      encHeader[0] = Boho.BohoMsg.ENC_E2E
      let newEncBuffer = Buffer.concat([encHeader, data.subarray(3 + tagLen)])
      this.send(newEncBuffer)

    } else if (useEncryption) {
      let encPack = this.boho.encrypt_488(data)
      if (encPack) {
        this.send(encPack)
      } else {
        // console.log('encryption FAIL: NO DATA TRANSIT')
      }
    } else {
      // console.log('send -N-')
      this.send(data)

    }

  }



  iamResponse(info = '') {

    if (info == '') {
      let channels = []
      for (let tag of this.channels.keys()) {
        channels.push(tag)
      }

      info = {
        "ssid": this.ssid,
        "cid": this.cid,
        "did": this.did,
        "uid": this.uid,
        "level": this.level,
        "nick": this.nick,
        "ip": this.ip
        , 'tag': channels
      }
    }

    // console.log( 'iam res info', info )
    let pack = MBP.pack(
      MB('#MsgType', '8', IOMsg.IAM_RES),
      MB('#info', info)
    )
    this.send_enc_mode(pack)
  }


}

