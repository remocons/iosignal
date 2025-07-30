import {version} from "../../../package.json";
import { IOCore } from "../IOCore.js";
import Boho from 'boho'
import * as constants from '../../common/constants.js'

/**
 * @typedef {import("boho").Boho} Boho
 * @typedef {import("boho").MBP} MBP
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
   * @type {Boho}
   */
  static Boho = Boho;
  /**
   * The MBP (MessagePack-Boho) instance.
   * @type {MBP}
   */
  static MBP = Boho.MBP;
  /**
   * The Buffer class from Boho.
   * @type {Buffer}
   */
  static Buffer = Boho.Buffer;
  /**
   * Constants used by the client.
   * @type {object}
   */
  static constants = constants

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
   * Closes the WebSocket connection and cleans up its event handlers.
   * This is intended for temporary disconnections, and the connection might be re-established by keepAlive.
   */
  close() {
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onclose = null;
      this.socket.onmessage = null;
      this.socket.onerror = null;
      if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
        this.socket.close();
      }
    }
    super.close();
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
   * Keeps the connection alive by re-opening if closed.
   */
  keepAlive() {
    if (!this.autoReconnect) return;
    // Reconnect only if the socket is closed and the state reflects that.
    if ((!this.socket || this.socket.readyState === WebSocket.CLOSED) && this.state === IO.constants.STATES.CLOSED) {
      this.open();
    }
  }



  /**
   * Creates a new WebSocket connection.
   * @param {string} url - The WebSocket URL to connect to.
   */
  createConnection(url) {
    // Web Browser WebSocket
    IO.webSocketCount++;
    this.socket = new WebSocket(url);
    this.socket.binaryType = IO.binaryType

    this.stateChange('opening')

    this.socket.onopen = () => {

      if (!this.socket) {
        return;
      }

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

  /**
   * Sends data over the WebSocket.
   * @param {BufferSource} data - The data to send.
   */
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

