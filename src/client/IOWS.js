import { IOCore } from "./IOCore.js";
import { SIZE_LIMIT } from "../common/constants.js";
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
      // Closing a connecting ws can emit an asynchronous error after detachment.
      this.socket.on('error', () => {});
      if (this.socket.readyState !== WebSocket.CLOSED) {
        this.socket.close();
      }
    }
    super.close();
  }

  keepConnection() {
    if (!this.autoReconnect) return;
    // Reconnect only if the socket is closed and the state reflects that.
    if ((!this.socket || this.socket.readyState === WebSocket.CLOSED) ) {
      this.open();
    }
  }



  createConnection(url) {
    // node WebSocket
    const socket = this.socket = new WebSocket(url);
    this._closed = false;

    this.socket.onopen = () => {
      if (this.socket !== socket) return;
      socket.on('message', data => {
        if (this.socket === socket) this.onWebSocketMessage(data);
      });
      this.emit('open');
    };

    this.socket.onerror = (e) => {
      if (this.socket !== socket) return;
      this.emit('error', e)
    }

    this.socket.onclose = () => {
      if (this.socket !== socket) return;
      this.emit('close');
    }
    this.stateChange('connecting','connecting')
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



