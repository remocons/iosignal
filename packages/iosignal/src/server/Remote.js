import { pack, CongRx } from '../client/CongPacket.js'
import { RemoteCore } from './RemoteCore.js';
import { serverOption } from './serverOption.js';
import { IOMsg } from '../common/constants.js';
import * as util from '../common/util.js'

const decoder = new TextDecoder()

export class Remote extends RemoteCore {
  constructor(socket, req, manager) {
    super(socket, manager);
    this.socketType = socket.socketType

    if (this.socketType === 'websocket') {
      this.TLS = req.headers["x-forwarded-proto"] === 'https' ? true : false;
      this.ip = this.getRemoteIP(req);
    } else {
      this.TLS = false;
      this.ip = this.getRemoteIP(socket.remoteAddress)
    }


    if (util.isPrivateIP(this.ip)) {
      // connection from local or private network has default private channel.
      this.HOME_CHANNEL = 'PRIVATE:'
      this.privateNode = true
    } else {
      // The HOME_CHANNEL is defined by the global IP address value.
      this.HOME_CHANNEL = 'IP:' + util.getIPv4HexString(this.ip)
    }


    if (this.socketType === 'websocket') {
      if (serverOption.debug.slow) {
        socket.on("message", this.onTimeDelayMessage.bind(this));
      } else {
        socket.on("message", this.onSocketMessage.bind(this));
      }
      socket.on("pong", this.receiveMonitor.bind(this));
      socket.on("ping", this.receiveMonitor.bind(this));
      socket.on("error", (e) => { console.log('Websocket error', e, e.code) });
      socket.onclose = (e) => {
        // Clean up all listeners on the socket to prevent leaks
        socket.removeAllListeners();
        this.manager.removeRemote(this);
      };
    } else { // TCP else
      this.congRx = new CongRx();
      socket.on('data', data => { this.congRx.write(data) })

      this.congRx.on('wrong', this.onWrongCongPacketMessage.bind(this))
      // readable.pipe( destination )
      // tcpSocket -> congRx(parser) -> onMessage
      // socket.pipe( this.congRx )

      if (serverOption.debug.slow) {
        this.congRx.on('data', this.onTimeDelayMessage.bind(this))
      } else {
        this.congRx.on('data', this.onSocketMessage.bind(this))
      }

      socket.on('error', e => { console.log('TCP Socket error', e) })
      socket.on('close', e => {
        // Clean up listeners on both the socket and the parser
        socket.removeAllListeners();
        this.congRx.removeAllListeners();
        this.manager.removeRemote(this);
      })

    }
  }

  onWrongCongPacketMessage(message) {
    /*
      * three category CongSocket connection.
      1. anonymouse, tcp connection.
        > no cid_req, no auth_req
        > It's attacker. close it.
      2. not authorized but cid ready connnection.
        > anonymouse remote client.
        > allowed some wrong(broken) message. small quota.
      3. authorized remote connection.
        > allowed some wrong(broken) message. large quota.
    */
    if (this.cid) { // category  2 and 3.
      // temporary broken message.
      // console.log('wrong congpack from user:', Date(), this.ip, this.ssid, this.cid)
    } else {
      // attacker
      let msg = ""
      try {
        msg = decoder.decode(message)
      } catch (error) {
        msg += 'Len: ' + message.byteLength
      }

      // console.log('attacker message:', attackMsg)
      if (this.manager.attackLogger) {
        let attackMsg = `> ${this.ssid} ${this.ip} ${msg}`
        this.manager.attackLogger.log(attackMsg)
      }

      this.close(true);
    }
  }


  permissionChecker() {
    // type1.
    // accept some traffic before authorize.
    const limitBytes = 100

    let txBytes = this.socket.bytesWritten || this.socket._socket?.bytesWritten
    let rxBytes = this.socket.bytesRead || this.socket._socket?.bytesRead

    if (txBytes == undefined) txBytes = 0
    if (rxBytes == undefined) rxBytes = 0

  }


  // any type of received messages:  message, ping, pong
  receiveMonitor() {
    this.socket.rxCounter++
    this.socket.isAlive = true;
  }

  isConnectionHTTPS(req) {
    //In case of reverse proxy environment.  i.e. using nginx proxy_pass.
    return req.headers["x-forwarded-proto"];   //https or undefined
  }

  getRemoteIP(req) { //req or ip string
    let ip;
    if (req && req.headers) {
      ip = req.headers["x-forwarded-for"];
      if (ip == undefined) ip = req.socket.remoteAddress;
    } else {
      ip = req;
    }

    if (ip) {
      if (ip.indexOf("::ffff:") == 0) ip = ip.substring(7);
      if (ip == "::1") ip = "127.0.0.1";
    } else {
      ip = "0.0.0.0";
    }
    return ip;
  }

  ping() {
    if (this.socketType === 'websocket') {
      this.socket.ping()
      this.socket.txCounter++
    } else {
      this.send(Buffer.from([IOMsg.PING]))
    }
  }

  pong() {
    if (this.socketType === 'websocket') {
      this.socket.pong()
      this.socket.txCounter++
    } else {
      this.send(Buffer.from([IOMsg.PONG]))
    }
  }

  getTraffic() {
    let txb = this.socket.bytesWritten || this.socket._socket?.bytesWritten
    let rxb = this.socket.bytesRead || this.socket._socket?.bytesRead
    let tx = this.socket.txCounter
    let rx = this.socket.rxCounter
    let traffic = { tx, txb, rx, rxb }
  }

  close(terminateNow = false) {
    this.getTraffic()
    if (this.socketType === 'websocket') {
      if (terminateNow) this.socket.terminate();
      else this.socket.close();
    } else {
      if (terminateNow) this.socket.destroy();
      else this.socket.end();
    }
  }

  // node.js server side remote.
  send(message, isBinary) {
    // console.log(`<-S [${IOMsg[ message[0]]}]`)
    this.manager.txBytes += message.byteLength;
    this.socket.txCounter++;
    if (this.socketType === 'websocket') {
      if (this.socket.readyState === 1) {
        if (isBinary != undefined) {
          this.socket.send(message, { binary: isBinary });
        } else {
          this.socket.send(message);
        }
      } else {
        console.log('server(ws)Remote.send() called. not open state. current readyState:', this.socket.readyState )
        this.close(true)
      }
      
    } else { //CongSocket
      if (this.socket.readyState == 'open') {
        this.socket.write(pack(message))
      } else {
        console.log('server(cong)Remote.send() called. not open state. current readyState:', this.socket.readyState )
        this.close(true)
      }
    }

  }

}
