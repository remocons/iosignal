import { performance } from 'node:perf_hooks';
import { isIP, isIPv4, isIPv6 } from 'node:net';
import { pack, CongRx } from '../client/CongPacket.js'
import { RemoteCore } from './RemoteCore.js';
import { serverOption } from './serverOption.js';
import { IOMsg } from '../common/constants.js';
import * as util from '../common/util.js'

const decoder = new TextDecoder()

// Each proxy appends to a forwarding header, so the entry `hops` from the right was
// written by the outermost trusted proxy; anything left of it came from the client.
function forwardedValue(header, hops) {
  if (!hops || typeof header !== 'string') return undefined
  const values = header.split(',').map(v => v.trim()).filter(Boolean)
  return values[Math.max(0, values.length - hops)]
}

// IPv4-mapped addresses as IPv4, '::1' as 127.0.0.1; undefined if not an IP address.
export function normalizeIP(ip) {
  if (typeof ip !== 'string') return undefined
  if (ip.startsWith('::ffff:') && isIPv4(ip.slice(7))) ip = ip.slice(7)
  if (ip === '::1') ip = '127.0.0.1'
  return isIP(ip) ? ip : undefined
}

// Number of reverse proxies whose forwarding headers are trusted (see serverOption.trustProxy).
export function trustedProxyHops(peerIP, trust = serverOption.trustProxy) {
  if (trust === 'private') return peerIP && util.isPrivateIP(peerIP) ? 1 : 0
  if (trust === true) return 1
  return Number.isSafeInteger(trust) && trust > 0 ? trust : 0
}

// Client address and TLS of a WebSocket upgrade request; exported for other servers that
// accept the same proxied connections.
export function getClientAddress(req, trust = serverOption.trustProxy) {
  const peerIP = normalizeIP(req.socket?.remoteAddress)
  const hops = trustedProxyHops(peerIP, trust)
  return {
    ip: normalizeIP(forwardedValue(req.headers['x-forwarded-for'], hops)) ?? peerIP ?? '0.0.0.0',
    // X-Forwarded-Proto: https turns off server-side encryption (ENC_MODE.AUTO), so it is
    // only honored from a trusted proxy, like the client address.
    TLS: forwardedValue(req.headers['x-forwarded-proto'], hops) === 'https'
  }
}

// The site a browser connection came from: the host name of its Origin header ('bayo.tv'),
// without scheme or port. '' when there is none (Node.js, apps, TCP) or it is 'null' (a file
// page). A non-browser client can send any Origin, so this is for display only.
export function originHost(req) {
  const origin = req?.headers?.origin
  if (typeof origin !== 'string' || !origin || origin === 'null' || origin.length > 512) return ''
  try {
    return new URL(origin).hostname.toLowerCase().replace(/^\[|\]$/g, '').slice(0, 253)
  } catch {
    return ''
  }
}

export class Remote extends RemoteCore {
  constructor(socket, req, manager) {
    super(socket, manager);
    this.txQueuePeakBytes = 0;
    this.txWriteFalseCount = 0;
    this.txBlockedSince = null;
    this.txDrainMaxMs = 0;
    this.socketType = socket.socketType

    if (this.socketType === 'websocket') {
      const { ip, TLS } = getClientAddress(req, this.manager.server?.trustProxy);
      this.ip = ip;
      this.TLS = TLS;
      this.site = originHost(req);
    } else {
      this.TLS = false;
      this.ip = normalizeIP(socket.remoteAddress) ?? '0.0.0.0'
    }


    if (util.isPrivateIP(this.ip)) {
      // connection from local or private network has default private channel.
      this.HOME_CHANNEL = 'PRIVATE:'
      this.privateNode = true
    } else if (isIPv6(this.ip)) {
      // An IPv6 network is its /64 prefix; each host there has its own address.
      this.HOME_CHANNEL = 'IP6:' + util.getIPv6PrefixHexString(this.ip)
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
      socket.on('drain', () => {
        if (this.txBlockedSince === null) return;
        this.txDrainMaxMs = Math.max(this.txDrainMaxMs, performance.now() - this.txBlockedSince);
        this.txBlockedSince = null;
      });
      this.congRx = new CongRx({ maxFrameSize: this.rxFrameLimit() });
      socket.on('data', data => { this.congRx.write(data) })

      this.congRx.on('wrong', this.onWrongCongPacketMessage.bind(this))
      this.congRx.on('oversize', this.onOversizeCongPacket.bind(this))
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


  // Largest CongSocket frame the parser buffers: maxPayload (as for WebSocket), or the quota's
  // maxMessageBytes when smaller. A frame payload is the message rxQuotaChecker measures, so a
  // larger frame would be rejected after buffering anyway.
  rxFrameLimit() {
    const maxPayload = this.manager.server?.maxPayload ?? serverOption.maxPayload;
    const maxMessageBytes = this.quota?.maxMessageBytes ?? null;
    return maxMessageBytes === null ? maxPayload : Math.min(maxPayload, maxMessageBytes);
  }

  // Called after the quota changes (e.g. on successful auth).
  refreshRxFrameLimit() {
    if (this.congRx) this.congRx.maxFrameSize = this.rxFrameLimit();
  }

  // The frame was skipped unbuffered; same response as rxQuotaChecker, except that a
  // connection without a CID is treated like a wrong packet (see onWrongCongPacketMessage).
  onOversizeCongPacket(payloadSize) {
    if (this._closing) return;
    if (!this.cid) {
      this.manager.attackLogger?.log(`> ${this.ssid} ${this.ip} OVERSIZE ${payloadSize}`)
      this.close(true);
      return;
    }
    this.manager.counters.oversizeRejected++;
    this.send(Buffer.from([IOMsg.OVER_SIZE]))
  }

  // any type of received messages:  message, ping, pong
  receiveMonitor() {
    this.socket.rxCounter++
    if (this.socket.isAlive === false) this.manager.heartbeatPending.delete(this);
    this.socket.isAlive = true;
  }

  // Number of reverse proxies whose forwarding headers this server trusts.
  trustedProxyHops(peerIP) {
    return trustedProxyHops(peerIP, this.manager.server?.trustProxy)
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
    return { tx, txb, rx, rxb }
  }

  close(terminateNow = false) {
    this._closing = true;
    if (this.socketType === 'websocket') {
      if (terminateNow) this.socket.terminate();
      else this.socket.close();
    } else {
      if (terminateNow) this.socket.destroy();
      else this.socket.end();
    }
  }

  // A peer that stops reading would otherwise grow its send queue without limit.
  recordTxQueue() {
    const queued = this.socket.bufferedAmount ?? this.socket.writableLength ?? 0;
    if (queued > this.txQueuePeakBytes) this.txQueuePeakBytes = queued;
    const limit = this.manager.server?.maxBufferedBytes ?? serverOption.maxBufferedBytes;
    if (queued > limit) {
      console.log(`slow peer #${this.ssid} cid:${this.cid} has ${queued} unsent bytes: closing`)
      this.close(true);
    }
  }

  // node.js server side remote.
  send(message, isBinary) {
    // Sending to a closing peer can only fail; skip instead of logging each attempt.
    if (this._closing) return;
    // The peer cannot receive it (see peerRxLimit); a CongSocket Arduino would have to discard it.
    if (this.peerRxLimit !== null && message.byteLength > this.peerRxLimit) {
      this.peerRxLimitSkipped++;
      this.manager.counters.peerRxLimitSkipped++;
      return;
    }
    // console.log(`<-S [${IOMsg[ message[0]]}]`)
    this.manager.counters.txBytes += message.byteLength;
    this.manager.counters.txMessages++;
    this.socket.txCounter++;
    if (this.socketType === 'websocket') {
      if (this.socket.readyState === 1) {
        if (isBinary != undefined) {
          this.socket.send(message, { binary: isBinary });
        } else {
          this.socket.send(message);
        }
        this.recordTxQueue();
      } else {
        console.log('server(ws)Remote.send() called. not open state. current readyState:', this.socket.readyState )
        this.close(true)
      }
      
    } else { //CongSocket
      if (this.socket.readyState == 'open') {
        const writable = this.socket.write(pack(message));
        this.recordTxQueue();
        if (!writable) {
          this.txWriteFalseCount++;
          if (this.txBlockedSince === null) this.txBlockedSince = performance.now();
        }
      } else {
        console.log('server(cong)Remote.send() called. not open state. current readyState:', this.socket.readyState )
        this.close(true)
      }
    }

  }

}
