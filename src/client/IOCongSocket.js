import { IOCore } from "./IOCore.js"
import { STATES } from "../common/constants.js";
import { pack, CongRx } from './CongPacket.js'
import net from 'net'


export class IOCongSocket extends IOCore {
  constructor(url) {
    super(url);
    if (url) this.open();
  }

  /**
   * Closes TCP socket and cleans resources.
   */
  close() {
    if (this.socket) {
      if (this.congRx) {
        this.socket.unpipe(this.congRx);
        this.congRx.destroy(); // Use destroy() for complete stream cleanup
        this.congRx = null;
      }
      this.socket.removeAllListeners();
      if (!this.socket.destroyed) {
        this.socket.destroy(); // destroy() is sufficient for forceful closing
      }
    }
    super.close();
  }



  keepAlive() {
    if (!this.autoReconnect) return;
    // Reconnect only if the socket is fully destroyed and the state is closed.
    if ((!this.socket || this.socket.destroyed) && this.state === STATES.CLOSED) {
      this.open();
    }
  }


  createConnection(url) {
    // TCP Socket
    let urlObj = new URL(url)
    if (urlObj.protocol != "cong:") {
      urlObj = new URL('cong://' + url)
    }
    this.socket = net.createConnection(urlObj.port, urlObj.hostname)
    this.stateChange('opening')

    this.socket.on('connect', () => {
      this.congRx = new CongRx();
      this.socket.pipe(this.congRx)
      this.congRx.on("data", this.onTCPSocketMessage.bind(this));
      this.emit('open')
    })

    this.socket.on('error', e => {
      this.emit('error', e)
    })

    this.socket.on('close', () => {
      this.emit('close');
    })

  }

  onTCPSocketMessage(data) {
    this.rxCounter++;
    this.rxBytes += data.byteLength
    this.lastTxRxTime = Date.now();
    this.emit('socket_data', data);

  }

  socket_send(data) {
    if (this.socket?.readyState === 'open') {
      let packData = pack(data);
      this.socket.write(packData)
      this.txCounter++;
      this.txBytes += packData.byteLength;
      this.lastTxRxTime = Date.now();
    } else {
      console.log('.')
    }
  }

}




