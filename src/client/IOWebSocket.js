import { IOCore } from "./IOCore.js";
import { Buffer } from 'meta-buffer-pack'
export { Boho, RAND, BohoMsg, Meta, MetaSize, sha256, MBP, Buffer } from 'boho'
export * from '../common/constants.js'

// Browser WebSocket
export class IO extends IOCore {
  static binaryType = "arraybuffer"

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
    if (!this.socket || this.socket?.readyState === 3) { //closed
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
    // event.data is arrayBuffer
    this.rxCounter++;
    this.lastTxRxTime = Date.now();
    let buffer = Buffer.from(event.data)
    this.rxBytes += buffer.byteLength
    this.emit('socket_data', buffer);
  }

  async onWebSocketMessageBlob(event) {
    // event.data is Blob
    this.rxCounter++;
    this.lastTxRxTime = Date.now();
    let ab = await event.data.arrayBuffer()
    let buffer = Buffer.from(ab)
    this.rxBytes += buffer.byteLength
    this.emit('socket_data', buffer);
  }

  socket_send(data) {
    if (this.socket?.readyState === 1) { //open
      // console.log('websocket send', data)
      this.socket.send(data)
      this.txCounter++;
      this.txBytes += data.byteLength
      this.lastTxRxTime = Date.now();
    } else {
      console.log('.')
    }
  }

}

