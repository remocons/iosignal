import { IOCore } from "./IOCore.js";
import { STATE } from "../common/constants.js";
import { WebSocket } from "ws";

//  Node.js 'ws' websocket
export class IOWS extends IOCore {
  constructor(url) {
    super(url);
    if (url) this.open();
  }



  /**
   * Closes ws WebSocket and cleans resources.
   */
  close() {
    if (this.socket) {
      this.socket.removeAllListeners();
      if (this.socket.readyState !== WebSocket.CLOSED) {
        this.socket.close();
      }
    }
    super.close();
  }


  keepAlive() {
    if (!this.autoReconnect) return;
    // Reconnect only if the socket is closed and the state reflects that.
    if ((!this.socket || this.socket.readyState === WebSocket.CLOSED) ) {
      this.open();
    }else{
      this.ping();
    }
  }

  createConnection(url) {
    // node WebSocket
    this.socket = new WebSocket(url);
    this.stateChange('connecting','connecting')

    this.socket.onopen = () => {
      this.socket.on('message', this.onWebSocketMessage.bind(this));
      this.emit('open');
    };

    this.socket.onerror = (e) => {
      this.emit('error', e)
    }

    this.socket.onclose = () => {
      this.emit('close');
    }
  }

  onWebSocketMessage(data) {
    this.rxCounter++;
    this.lastTxRxTime = Date.now();
    this.rxBytes += data.byteLength
    this.emit('socket_data', data);
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




