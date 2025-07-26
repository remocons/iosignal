import { IOCore } from "./IOCore.js"
import { pack, CongRx } from './CongPacket.js'
import net from 'net'


export class IOCongSocket extends IOCore {
  constructor(url) {
    super(url);
    if (url) this.open();
  }

  close() {
    this.socket?.end();
    this.socket = null;
  }

  stop() {
    this.close()
    clearInterval(this.connectionCheckerIntervalID);
    this.connectionCheckerIntervalID = null
  }

  keepAlive() {
    let state = this.socket?.readyState;
    if (!this.socket || !(state === 'open' || state === 'opening')) {
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




