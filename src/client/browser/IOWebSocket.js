import {version} from "../../../package.json";
import { IOCore } from "../IOCore.js";
import Boho from 'boho'
import * as constants from '../../common/constants.js'

const Buffer = Boho.Buffer

// Browser WebSocket
export default class IO extends IOCore {
  static version = version
  static binaryType = "arraybuffer"
  static Boho = Boho;
  static MBP = Boho.MBP;
  static Buffer = Boho.Buffer;
  static constants = constants

  constructor(url) {
    super(url);
    document.addEventListener('visibilitychange', this.browserVisiblePing.bind(this));
    if (url) this.open();
  }

  browserVisiblePing() {
    if (document.visibilityState === 'visible') {
      this.ping()
    }
  }


  close() {
    if (this.socket) {
      this.socket.onclose = null
      this.socket.onmessage = null
      this.socket.onerror = null
      this.socket.close();
      this.socket = null;
    }
    this.emit('close')
  }


  stop() {
    this.close()
    clearInterval(this.connectionCheckerIntervalID);
    this.connectionCheckerIntervalID = null
  }


  keepAlive() {
    if (!this.socket || this.socket?.readyState === 3) {
      this.open();
    }
  }



  createConnection(url) {
    // Web Browser WebSocket
    this.socket = new WebSocket(url);
    this.socket.binaryType = IO.binaryType

    this.stateChange('opening')

    this.socket.onopen = () => {
      if (this.socket.binaryType == "arraybuffer") {
        this.socket.onmessage = this.onWebSocketMessage.bind(this);
      } else {  // blob
        this.socket.onmessage = this.onWebSocketMessageBlob.bind(this);
      }
      this.emit('open');
    };

    this.socket.onerror = (e) => {
      this.emit('error', e)
    }

    this.socket.onclose = () => {
      this.emit('close');
    }
  }

  onWebSocketMessage(event) {
    // event.data is arrayBuffer  or text_message
    this.rxCounter++;
    this.lastTxRxTime = Date.now();
    let buffer = Buffer.from(event.data)
    this.rxBytes += buffer.byteLength
    this.emit('socket_data', buffer);
  }

  async onWebSocketMessageBlob(event) {
    // event.data is Blob or text_message
    this.rxCounter++;
    this.lastTxRxTime = Date.now();
    let buffer;
    if (event.data instanceof Blob) {
      let ab = await event.data.arrayBuffer()
      buffer = Buffer.from(ab)
    } else {
      buffer = Buffer.from(event.data)
    }
    this.rxBytes += buffer.byteLength
    this.emit('socket_data', buffer);
  }

  socket_send(data) {
    if (this.socket?.readyState === 1) {
      this.socket.send(data)
      this.txCounter++;
      this.txBytes += data.byteLength
      this.lastTxRxTime = Date.now();
    } else {
      console.log('.')
    }
  }

}

