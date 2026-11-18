import {version} from "../../../package.json";
import { IOCore } from "../IOCore.js";
import Boho from 'boho'
import * as constants from '../../common/constants.js'

/**
 * @typedef {typeof import("meta-buffer-pack").default} MBP
 * @typedef {import("boho").Buffer} Buffer
 */

const Buffer = Boho.Buffer

/**
 * Browser WebSocket client extending IOCore.
 * @augments {IOCore}
 */
export default class IO extends IOCore {
  /**
   * The version of the client.
   * @type {string}
   */
  static version = version
  /**
   * The binary type for WebSocket messages.
   * @type {string}
   */
  static binaryType = "arraybuffer"
  /**
   * The Boho library instance.
   * @type {typeof Boho}
   */
  static Boho = Boho;
  /**
   * The MBP (MessagePack-Boho) instance.
   * @type {MBP}
   */
  static MBP = Boho.MBP;
  /**
   * The Buffer class from Boho.
   * @type {typeof import('buffer').Buffer}
   */
  static Buffer = Boho.Buffer;
  /**
   * Constants used by the client.
   * @type {object}
   */
  static constants = constants

  /**
   * The WebSocket class to connect with; null uses the global WebSocket. Set it on IO or on a
   * subclass to connect through something with the browser WebSocket API (readyState,
   * binaryType, onopen/onmessage/onerror/onclose, send, close), e.g. a test double.
   * @type {(new (url: string) => WebSocket) | null}
   */
  static WebSocket = null;

  /**
   * Tracks the number of IO instances created.
   * @type {number}
   */
  static instanceCount = 0;

  /**
   * Tracks the number of WebSocket objects created.
   * @type {number}
   */
  static webSocketCount = 0;



  /**
   * Creates an instance of IO.
   * @param {string} url - The WebSocket URL to connect to.
   */
  constructor(url) {
    super(url);
    IO.instanceCount++;
    this.boundBrowserVisiblePing = this.browserVisiblePing.bind(this)
    document.addEventListener('visibilitychange', this.boundBrowserVisiblePing);
    if (url) this.open();
  }

  /**
   * Pings the server when the browser tab becomes visible.
   */
  browserVisiblePing() {
    if (document.visibilityState === 'visible') {
      this.ping()
    }
  }


  

  /**
   * Permanently stops the connection and cleans up its specific resources.
   * For complete cleanup and to make the instance unusable, use destroy().
   */
  stop() {
    super.stop();
  }

  /**
   * Permanently destroys the instance, cleaning up all resources including global event listeners.
   * The instance will not be usable after this.
   */
  destroy() {
    document.removeEventListener('visibilitychange', this.boundBrowserVisiblePing);
    super.destroy();
  }


  /**
   * Keeps the connection alive by re-connecting if closed.
   */
  keepConnection() {
    if (!this.autoReconnect) return;
    // Reconnect only if the socket is closed and the state reflects that.
    if ((!this.socket || this.socket.readyState === 3) ) { // 3: WebSocket CLOSED
      this.open();
    }
  }



  /**
   * Makes the socket for a connection: new IO.WebSocket(url) (the class set on this client's
   * class), else the global WebSocket. Override it to choose the socket by URL.
   * @param {string} url - The URL to connect to.
   * @returns {WebSocket}
   */
  createWebSocket(url) {
    const SocketClass = /** @type {typeof IO} */ (this.constructor).WebSocket ?? WebSocket;
    return new SocketClass(url);
  }

  /**
   * Creates a new WebSocket connection.
   * @param {string} url - The WebSocket URL to connect to.
   */
  createConnection(url) {
    // Web Browser WebSocket
    IO.webSocketCount++;
    const socket = this.socket = this.createWebSocket(url);
    this._closed = false;
    this.socket.binaryType = IO.binaryType


    this.socket.onopen = () => {

      if (this.socket !== socket) {
        return;
      }

      if (this.socket.binaryType == "arraybuffer") {
        this.socket.onmessage = e => {
          if (this.socket === socket) this.onWebSocketMessage(e);
        };
      } else {  // blob
        this.socket.onmessage = e => {
          if (this.socket === socket) this.onWebSocketMessageBlob(e);
        };
      }
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

  /**
   * Handles incoming WebSocket messages (arraybuffer type).
   * @param {MessageEvent} event - The WebSocket message event.
   */
  onWebSocketMessage(event) {
    // event.data is arrayBuffer  or text_message
    this.rxCounter++;
    this.lastTxRxTime = Date.now();
    let buffer = Buffer.from(event.data)
    this.rxBytes += buffer.byteLength
    this.emit('socket_data', buffer);
  }

  /**
   * Handles incoming WebSocket messages (blob type).
   * @param {MessageEvent} event - The WebSocket message event.
   */
  async onWebSocketMessageBlob(event) {
    const socket = this.socket;
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
    if (this.socket === socket) this.emit('socket_data', buffer);
  }

  /**
   * Sends data over the WebSocket. Data is dropped while the socket is not open.
   * @param {BufferSource} data - The data to send.
   */
  socket_send(data) {
    if (this.socket?.readyState === 1) {
      this.socket.send(data)
      this.txCounter++;
      this.txBytes += data.byteLength
      this.lastTxRxTime = Date.now();
    }
  }

}
