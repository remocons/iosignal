import MBP from 'meta-buffer-pack'
import EventEmitter from "eventemitter3";
import { IOMsg, PAYLOAD_TYPE, SIZE_LIMIT, ENC_MODE, STATES } from '../common/constants.js'
import { quotaTable } from '../common/quotaTable.js'
import { getSignalPack } from '../common/payload.js';
import Boho from "boho";

/**
 * @typedef {import('meta-buffer-pack').MBP} MBP
 * @typedef {import('../common/constants.js').IOMsg} IOMsg
 * @typedef {import('../common/constants.js').PAYLOAD_TYPE} PAYLOAD_TYPE
 * @typedef {import('../common/constants.js').SIZE_LIMIT} SIZE_LIMIT
 * @typedef {import('../common/constants.js').ENC_MODE} ENC_MODE
 * @typedef {import('../common/constants.js').STATES} STATES
 * @typedef {import('../common/quotaTable.js').quotaTable} quotaTable
 
 * @typedef {import('boho').Boho} Boho
 * @typedef {import('boho').Buffer} Buffer
 */

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

/**
 * Core class for handling WebSocket communication.
 * @augments {EventEmitter}
 */
export class IOCore extends EventEmitter {
  /**
   * @param {string} url - The WebSocket URL to connect to.
   */
  constructor(url) {
    super();
    /**
     * Client ID received from the server.
     * @type {string}
     */
    this.cid = ""   // get from the server  CID_RES
    /**
     * IP address received from the server.
     * @type {string}
     */
    this.ip = ""    // get from the server  IAM_RES message.
    /**
     * The WebSocket instance.
     * @type {WebSocket | null}
     */
    this.socket = null;
    /**
     * The default server URL.
     * @type {string}
     */
    this.url = url; // init default server url
    /**
     * Current connection state (number).
     * @type {number}
     */
    this.state = STATES.CLOSED;  // Number type
    /**
     * Current connection state (string).
     * @type {string}
     */
    this.stateName = this.getStateName() // String type

    /**
     * Transmitted message counter.
     * @type {number}
     */
    this.txCounter = 0;
    /**
     * Received message counter.
     * @type {number}
     */
    this.rxCounter = 0;
    /**
     * Transmitted bytes counter.
     * @type {number}
     */
    this.txBytes = 0;
    /**
     * Received bytes counter.
     * @type {number}
     */
    this.rxBytes = 0;

    /**
     * Last transmit/receive time.
     * @type {number}
     */
    this.lastTxRxTime = Date.now();
    /**
     * Period for connection checker.
     * @type {number}
     */
    this.connectionCheckerPeriod = SIZE_LIMIT.CONNECTION_CHECKER_PERIOD;
    /**
     * Interval ID for connection checker.
     * @type {NodeJS.Timeout | null}
     */
    this.connectionCheckerIntervalID = null;

    /**
     * Boho instance for encryption/decryption.
     * @type {Boho}
     */
    this.boho = new Boho()
    /**
     * Indicates if the connection is TLS (wss).
     * @type {boolean}
     */
    this.TLS = false // true if protocol is wss(TLS)
    /**
     * Encryption mode.
     * @type {number}
     */
    this.encMode = ENC_MODE.AUTO;
    /**
     * Indicates if authentication is used.
     * @type {boolean}
     */
    this.useAuth = false;

    /**
     * Nickname.
     * @type {string}
     */
    this.nick = "";
    /**
     * Set of subscribed channels.
     * @type {Set<string>}
     */
    this.channels = new Set()
    /**
     * Map of promises for message responses.
     * @type {Map<number, Array<Function>>}
     */
    this.promiseMap = new Map()
    /**
     * Timeout for message promises.
     * @type {number}
     */
    this.promiseTimeOut = SIZE_LIMIT.PROMISE_TIMEOUT
    /**
     * Message ID for promises.
     * @type {number}
     */
    this.mid = 0  // promise message id 

    /**
     * Quota level.
     * @type {number}
     */
    this.level = 3; // also defaultQuotaLevel
    /**
     * Quota table for current level.
     * @type {object}
     */
    this.quota = quotaTable[this.level];
    /**
     * Server settings.
     * @type {object}
     */
    this.serverSet = {}
    /**
     * Map of linked channels.
     * @type {Map<string, Set<string>>}
     */
    this.linkMap = new Map()

    /**
     * Indicates if auto-reconnect is enabled.
     * @type {boolean} 
     * @default true
     * */
    this.autoReconnect = true; // default true  

    /**
   * A flag to prevent duplicate close operations.
   * @type {boolean}
   * @private
   */
    this._closed = false; // 중복 close 방지

    this.on('open', this.onOpen.bind(this))
    this.on('close', this.onClose.bind(this))
    this.on('socket_data', this.onData.bind(this))
  }



  /**
   * Performs common cleanup for the connection. It clears pending promises,
   * resets the socket reference, and sets the state to closed.
   * This method is guarded to only run once.
   * If autoReconnect is false, it also clears the keep-alive timer.
   */
  close() {
    if (this._closed) return;
    this._closed = true;
// console.log('####### IOCOre.js close() called')
    // If auto-reconnect is disabled, we must stop the keep-alive timer.
    if (this.autoReconnect === false) {
      clearInterval(this.connectionCheckerIntervalID);
      this.connectionCheckerIntervalID = null;
    }

    // socket clean
    if (this.socket) {
      // For WebSockets, readyState are: 0-CONNECTING, 1-OPEN, 2-CLOSING, 3-CLOSED
      // Calling close() on a CONNECTING socket will cause a browser error.
      if (this.socket.readyState === 0) { // 0 is WebSocket.CONNECTING
        // To avoid the error, we wait for the connection to open, then immediately close it.
        // We also clear other handlers to prevent any other logic from running.
        const socket = this.socket;
        socket.onopen = () => { if(socket) socket.close(); };
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;
      } else {
        try {
          // For other sockets (like TCP) or other WebSocket states, close directly.
          this.socket.close?.();
        } catch {}
      }
      this.socket = null;
    }
    this.promiseMap.clear();
    this.emit('closed');
    this.stateChange('closed');
  }

  /**
   * Disables auto-reconnect and closes the current connection.
   * The instance can be re-opened manually later. For complete cleanup, use destroy().
   */
  stop() {
    this.autoReconnect = false;
    this.close();
  }

  /**
   * Permanently destroys the instance, cleaning up all resources.
   * The instance will not be usable after this.
   */
  destroy() {
    this.stop();
    this.removeAllListeners();

    this.channels.clear();
    this.linkMap.clear();

    // Help GC
    this.boho = null;
  }  

  /**
   * The core keep-alive logic. It checks if auto-reconnect is enabled.
   * The actual check for the socket's state is implemented in the child classes.
   */
  keepAlive() {
    if (!this.autoReconnect) return;
    // The specific logic for checking the socket's state and reconnecting
    // is implemented in the child classes (IOWS, IOCongSocket, etc.).
  }

  /**
   * Redirects the connection to a new URL.
   * @param {string} url2 - The new URL to redirect to.
   */
  redirect(url2) {
    this.close()
    this.stateChange('redirecting')
    this.createConnection(url2)
  }

  /**
   * Opens the WebSocket connection.
   * @param {string} [url] - Optional URL to connect to. If not provided, uses the instance's URL.
   */
  open(url) {
    // If a connection is already active or in progress, calling open() implies a reconnect.
    // Close the existing socket first to ensure a clean state.
    if (this.socket) {
      this.close();
    }

    if (url) {
      this.url = url;
    }

    if (!this.url) {
      this.emit('error', new Error('URL is not set.'));
      return;
    }

    // The actual connection is created here.
    this.createConnection(this.url);

    // Ensure the keep-alive timer is running.
    if (!this.connectionCheckerIntervalID) {
      this.connectionCheckerIntervalID = setInterval(this.keepAlive.bind(this), this.connectionCheckerPeriod);
    }
  }

  /**
   * Handles the 'open' event of the WebSocket. Resets the closed flag and sets the state to open.
   */
  onOpen() {
    this._closed = false;
    if (this.url.includes("wss://")) {
      this.TLS = true;
    } else {
      this.TLS = false;
    }
    this.stateChange('open')
  }

  /**
   * Handles the 'close' event of the WebSocket.
   */
  onClose() {
    this.boho.isAuthorized = false;
    this.cid = ""
    this.stateChange('closed')
  }

  /**
   * Manually logs in with provided ID and key.
   * @param {string} id - The user ID.
   * @param {string} key - The user key.
   * @returns {boolean}
   */
  login(id, key) {
    if (!this.auth(id, key)) return false;

    this.useAuth = true
    let auth_pack = this.boho.auth_req()
    this.send(auth_pack)
    return true
  }

  /**
   * Sets up authentication for auto-login.
   * @param {string} id - The user ID.
   * @param {string} key - The user key.
   * @returns {boolean}
   */
  auth(id, key) {
    if (!id && !key) {
      this.emit('error', new Error('auth failed. no id and key.'))
      return false
    }

    if (!key && id.includes('.')) {
      this.boho.set_id_key(id)
    } else if (id && key) {
      this.boho.set_id8(id)
      this.boho.set_key(key)
    } else {
      this.emit('error', new Error('auth failed. no id or key.'))
      return false
    }
    this.useAuth = true
    return true
  }

  /**
   * Handles incoming data from the WebSocket.
   * @param {Buffer} buffer - The incoming data buffer.
   */
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

      case IOMsg.ECHO:
        try {
          let str = decoder.decode(buffer.subarray(1))
          
          this.emit('echo', str)
        } catch (error) {
          this.emit('error', new Error('ECHO data error'))
        }
        break;
        
      case IOMsg.IAM_RES:
        try {
          let str = decoder.decode(buffer.subarray(1))
          let jsonInfo = JSON.parse(str)
          if (jsonInfo.ip) { this.ip = jsonInfo.ip; }
          if (jsonInfo.nick) { this.nick = jsonInfo.nick; }
          if (jsonInfo.did) { this.did = jsonInfo.did; }
          if (jsonInfo.uid) { this.uid = jsonInfo.uid; }
          this.emit('iam_res', str )
        } catch (error) {
          this.emit('error', new Error('IAM_RES data error'))
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
        console.log('[QUOTA_LEVEL]', JSON.stringify(this.quota))
        break;

      case IOMsg.SERVER_CLEAR_AUTH:
        this.useAuth = false;
        this.boho.clearAuth();
        this.stop();
        console.log('[SERVER_CLEAR_AUTH] io stop.')
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
          this.emit('error', new Error('SERVER_SIGNAL parsing error'))
        }
        break;

      case IOMsg.SET:
        try {
          let setPack = MBP.unpack(buffer)
          if (setPack) {
            this.emit(setPack.topic, ...setPack.args)
          }
        } catch (error) {
          this.emit('error', new Error('SET parsing error'))
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
              if (tag.indexOf('@') === 0) this.emit('@', tag, null)
              else {
                this.emit(tag, tag, null)
                this.emit('message', tag, null )
              }
              break;

            case PAYLOAD_TYPE.TEXT:
              // !! Must remove null char before decode in JS.
              // string payload contains null char for the c/cpp devices.
              let payloadStringWithoutNull = payloadBuffer
              if (payloadBuffer[payloadBuffer.byteLength - 1] === 0) {
                payloadStringWithoutNull = payloadBuffer.subarray(0, payloadBuffer.byteLength - 1)
              }
              let oneString = decoder.decode(payloadStringWithoutNull)
              if (tag.indexOf('@') === 0) this.emit('@', tag, oneString)
              if (tag !== '@'){
                this.emit(tag, tag, oneString)
                this.emit('message', tag, oneString)
              }
              break;

            case PAYLOAD_TYPE.BINARY:
              if (tag.indexOf('@') === 0) this.emit('@', tag, payloadBuffer)
              if (tag !== '@'){
                this.emit(tag, tag, payloadBuffer)
                this.emit('message', tag, payloadBuffer)
              } 
              break;

            case PAYLOAD_TYPE.OBJECT:
              let oneObjectBuffer = decoder.decode(payloadBuffer)
              let oneJSONObject = JSON.parse(oneObjectBuffer)
              if (tag.indexOf('@') === 0) this.emit('@', tag, oneJSONObject)
              if (tag !== '@'){
                this.emit(tag, tag, oneJSONObject)
                this.emit('message', tag, oneJSONObject)
              } 
              break;

            case PAYLOAD_TYPE.MJSON:
              let mjsonBuffer = decoder.decode(payloadBuffer)
              let mjson = JSON.parse(mjsonBuffer)
              if (tag.indexOf('@') === 0) this.emit('@', tag, ...mjson)
              if (tag !== '@'){
                this.emit(tag, tag, ...mjson)
                this.emit('message', tag, ...mjson)
              } 
              break;

            case PAYLOAD_TYPE.MBA:
              let mbaObject = MBP.unpack(payloadBuffer)
              if (tag.indexOf('@') === 0) this.emit('@', tag, ...mbaObject.args)
              if (tag !== '@'){
                this.emit(tag, tag, ...mbaObject.args)
                this.emit('message', tag, ...mbaObject.args )
              } 
              break;

            default:
            // console.log('## Unkown payloadtype', payloadType)
          }

        } catch (err) {
          this.emit('error', new Error('signal parse err'))
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

  /**
   * Sends an IAM (I Am) message to the server.
   * @param {string} [title] - Optional title for the IAM message.
   */
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


  /**
   * Sends a PING message to the server.
   */
  ping() {
    this.send(Buffer.from([IOMsg.PING]))
  }

  /**
   * Sends a PONG message to the server.
   */
  pong() {
    this.send(Buffer.from([IOMsg.PONG]))
  }


  /**
   * Sends an ECHO message to the server.
   * @param {*} [args] - Optional arguments to echo.
   */
  echo(args) {
    if (args) {
      // console.log('send echo args:', args)
      this.send_enc_mode(MBP.pack(
        MBP.MB('#MsgType', '8', IOMsg.ECHO),
        MBP.MB('#msg', args)
      ))
    } else {
      // # do not encrypt blank echo #
      this.send(Buffer.from([IOMsg.ECHO]))
    }
  }


  /**
   * Sends binary data.
   * @param {...any} data - Data to send.
   */
  bin(...data) {
    this.send(MBP.U8pack(...data))
  }

  /**
   * Sends data over the WebSocket.
   * @param {Buffer} data - The data buffer to send.
   */
  send(data) {
    if (data.byteLength > this.quota.signalSize) {
      this.emit('over_size')
      console.log('## QUOTA LIMIT OVER!! \nsignal message.byteLength: ', data.byteLength)
      console.log('## your maximum signalSize(bytes) is:', this.quota.signalSize)
      return
    }
    this.socket_send(data);
  }

  /**
   * Determines if encryption should be used based on current mode and TLS status.
   * @returns {boolean}
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

  /**
   * Sends data with encryption based on the encryption mode.
   * @param {Buffer} data - The data buffer to send.
   * @param {boolean} [useEncryption] - Optional. Force encryption or not. If undefined, uses default policy.
   */
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


  /**
   * Sets a message promise for a given message ID.
   * @param {number} mid - The message ID.
   * @returns {Promise<any>}
   */
  setMsgPromise(mid) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(e => {
        if (this.promiseMap.has(mid)) {
          reject('timeout');
          this.promiseMap.delete(mid)
        }
      }, this.promiseTimeOut);
      this.promiseMap.set(mid, [resolve, reject, timeoutId]);
    })
  }

  /**
   * Tests and resolves/rejects a promise based on the incoming buffer.
   * @param {Buffer} buffer - The incoming data buffer.
   */
  testPromise(buffer) {

    let res = MBP.unpack(buffer)
    if (!res) return

    if (this.promiseMap.has(res.mid)) {
      let [resolve, reject, timeoutId] = this.promiseMap.get(res.mid)
      clearTimeout(timeoutId)
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


  /**
   * Publishes a signal.
   * @param {...any} args - Arguments for the signal.
   */
  publish(...args) {
    this.signal(...args)
  }


  /**
   * Sends a signal with a tag and arguments.
   * @param {string} tag - The signal tag.
   * @param {...any} args - Arguments for the signal.
   * @throws {TypeError} If tag is not a string.
   */
  signal(tag, ...args) {
    if (typeof tag !== 'string') throw TypeError('tag should be string.')

    let signalPack = getSignalPack(tag, ...args)
    this.send_enc_mode(signalPack)
  }

  /**
   * Decrypts E2E data.
   * @param {Buffer} data - The encrypted data.
   * @param {string} key - The decryption key.
   * @returns {Buffer}
   */
  decrypt_e2e(data, key) {
    return this.boho.decrypt_e2e(data, key)
  }

  /**
   * Sends an E2E (End-to-End) encrypted signal.
   * @param {string} tag - The signal tag.
   * @param {Buffer} data - The data to encrypt and send.
   * @param {string} key - The encryption key.
   * @throws {TypeError} If tag is not a string.
   */
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



  /**
   * Sets a value in the store.
   * @param {string} storeName - The name of the store.
   * @param {...any} args - Arguments to set.
   * @returns {Promise<any>}
   */
  set(storeName, ...args) {
    if (!storeName || args.length == 0) {
      return Promise.reject(new Error('set need storeName and value)'))
    }
    return this.req('store', 'set', storeName, ...args)
  }

  /**
   * Gets a value from the store.
   * @param {string} storeName - The name of the store.
   * @returns {Promise<any>}
   */
  async get(storeName) {
    if (!storeName) {
      return Promise.reject(new Error('store get need storeName)'))
    }
    let pack = await this.req('store', 'get', storeName)
    let { $ } = MBP.unpack(pack.body)
    return $
  }


  /**
   * Sends a request to a target and topic.(remote api call)
   * @param {string} target - The target(api name) of the request.
   * @param {string} topic - The topic(api function name) of the request.
   * @param {...any} args - Optional arguments for the request.
   * @returns {Promise<any>}
   */
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


  /**
   * Subscribes to a channel or channels.
   * @param {string} tag - The tag(s) of the channel(s) to subscribe to (comma-separated).
   * @throws {TypeError} If tag is not a string or exceeds length limit.
   */
  subscribe(tag) {
    if (typeof tag !== 'string') throw TypeError('tag should be string.')
      if (tag.length > SIZE_LIMIT.TAG_LEN1) throw TypeError('please check tag string length limit:' + SIZE_LIMIT.TAG_LEN1)
    if (this.state !== STATES.READY) return

    // subscribe 사용시,  사용 'ready' 이벤트시 메뉴얼 등록되므로 여기에 등록하면 2중 호출된다.
    // 즉, channels 등록은 listen 같은 자동화 구독시만 사용. 
    // let tagList = tag.split(',')
    // tagList.forEach(tag => {
    //   this.channels.add(tag)
    // })

    try {  
      let tagEncoded = encoder.encode(tag)
      this.send_enc_mode(
        Buffer.concat([
          MBP.NB('8', IOMsg.SUBSCRIBE),
          MBP.NB('8', tagEncoded.byteLength),
          tagEncoded]))
    } catch (error) { }
  }

  /**
   * Subscribes to a channel or channels with a promise.
   * @param {string} tag - The tag(s) of the channel(s) to subscribe to (comma-separated).
   * @returns {Promise<any>}
   * @throws {TypeError} If tag is not a string or exceeds length limit.
   */
  subscribe_promise(tag) {
    if (typeof tag !== 'string') throw TypeError('tag should be string.')
    if (tag.length > SIZE_LIMIT.TAG_LEN2) throw TypeError('please check tag string length limit:' + SIZE_LIMIT.TAG_LEN2)

    if (this.state !== STATES.READY) {
      return Promise.reject('subscribe_promise:: connection is not ready')
    }

    try {
      let tagEncoded = encoder.encode(tag)      
      this.send_enc_mode(
        Buffer.concat([
          MBP.NB('8', IOMsg.SUBSCRIBE_REQ),
          MBP.NB('16', ++this.mid),
          MBP.NB('16', tagEncoded.byteLength),
          tagEncoded]))
      return this.setMsgPromise(this.mid)
    } catch (error) { }
  }

  /**
   * Subscribes to channels stored in memory (local cache).
   */
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

  /**
   * Unsubscribes from a channel or channels.
   * @param {string} [tag=""] - The tag(s) of the channel(s) to unsubscribe from (comma-separated). If empty, unsubscribes from all.
   * @throws {TypeError} If tag is not a string or exceeds length limit.
   */
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


  /**
   * Listens for signals on a specific tag.
   * @param {string} tag - The tag to listen on.
   * @param {Function} handler - The callback function to handle the signal.
   * @throws {TypeError} If tag is not a string, handler is not a function, or tag length is invalid.
   */
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



  /**
   * Links a local target to a remote tag and sets up a handler.
   * @param {string} to - The local link target.
   * @param {string} tag - The remote tag.
   * @param {Function} handler - The callback function to handle the signal.
   * @throws {TypeError} If 'to' or 'tag' are not strings, handler is not a function, or tag length is invalid.
   */
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


  /**
   * Unlinks a specific tag from a local target.
   * @param {string} to - The local link target.
   * @param {string} tag - The tag to unlink.
   * @throws {TypeError} If 'to' or 'tag' are not strings or tag length is invalid.
   */
  unlink(to, tag) {
    if (typeof to !== 'string') throw TypeError('to(local link target) is not a string.')
    if (typeof tag !== 'string') throw TypeError('tag is not a string.')
    if (tag.length > 255 || tag.length == 0) throw TypeError('tag string length range: 1~255')

    const linkSet = this.linkMap.get(to);
    if (!linkSet || !linkSet.has(tag)) return;

    this.unsubscribe(tag);
    this.removeAllListeners(tag);
    linkSet.delete(tag);

    if (linkSet.size === 0) {
      this.linkMap.delete(to);
    }
  }

  /**
   * Unlinks all tags from a local target.
   * @param {string} to - The local link target.
   * @throws {TypeError} If 'to' is not a string.
   */
  unlinkAll(to) {
    if (typeof to !== 'string') throw TypeError('to(local link target) is not a string.')

    const linkSet = this.linkMap.get(to);
    if (!linkSet) return;

    for (const tag of linkSet) {
      this.unsubscribe(tag);
      this.removeAllListeners(tag);
    }

    this.linkMap.delete(to);
  }



  /**
   * Gets connection metrics.
   * @returns {{tx: number, rx: number, txb: number, rxb: number, last: number}}
   */
  getMetric() {
    return {
      tx: this.txCounter,
      rx: this.rxCounter,
      txb: this.txBytes,
      rxb: this.rxBytes,
      last: (Date.now() - this.lastTxRxTime) / 1000
    }

  }

  /**
   * Gets the current connection state.
   * @returns {number}
   */
  getState() {
    return this.state
  }

  /**
   * Gets the current connection state name.
   * @returns {string}
   */
  getStateName() {
    //state <number>
    //value of constant STATES.NAME < number >
    //type of constant STATES.NAME name < string uppercase >
    //stateName,eventName <string lowercase>
    return (STATES[this.state]).toLowerCase()
  }

  /**
   * Gets security-related information.
   * @returns {{useAuth: boolean, isTLS: boolean, isAuthorized: boolean, encMode: number, usingEncryption: boolean}}
   */
  getSecurity() {
    return {
      useAuth: this.useAuth,
      isTLS: this.TLS,
      isAuthorized: this.boho.isAuthorized,
      encMode: this.encMode,
      usingEncryption: this.getEncryptionMode()
    }
  }

  /**
   * Changes the connection state and emits events.
   * @param {string} state - The new state name (e.g., 'ready', 'closed').
   * @param {string} [emitEventAndMessage] - Optional message to emit with the state change event.
   * 
   * 주의. 
   * 1. 상태가 변경 될 때만 'change' 이벤트 호출된다.
   * 2. emitEventAndMessage 옵션 값이 지정되야 해당 이벤트 이름이 호출된다.
   *   보통 이벤트 이름과 동일하게 적거나 이벤트 상황 안내문을 넣는다.
   */
  stateChange(state, emitEventAndMessage) {
    // STATES constant name <string> upperCase
    // eventName and .stateName <string> lowerCase
    // .state <number>
    // console.log('### stateChange reason:', emitEventAndMessage )
    let eventName = state.toLowerCase()
    this.state = STATES[state.toUpperCase()] // state: number

    if (emitEventAndMessage){
      this.emit(eventName, emitEventAndMessage)
    }

    if (this.stateName !== eventName) {
      this.stateName = eventName
      this.emit('change', eventName)
    }
  }

}




