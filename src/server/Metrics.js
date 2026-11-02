import { memoryUsage } from 'process';
import { performance } from 'node:perf_hooks';
import { ENC_MODE } from '../common/constants.js'

const KIB = 1024, MIB = 1024 * 1024

function bytes(n) {
  if (n >= MIB) return (n / MIB).toFixed(1) + 'MB'
  if (n >= KIB) return (n / KIB).toFixed(1) + 'KB'
  return Math.round(n) + 'B'
}

// Read-only views of the manager for logStats, Server.stats() and the sudo service.
// Nothing here runs on a timer or resets the manager's counters.
export class Metrics {
  constructor(manager) {
    this.manager = manager;
    this.previous = null; // last summaryLine() sample, for rates
  }

  close() {
    this.previous = null;
  }

  // Current state; counters are cumulative since the server started. Enumerates connections once.
  snapshot() {
    const manager = this.manager
    let authenticated = 0, websocket = 0
    for (const remote of manager.remotes) {
      if (remote.boho.isAuthorized) authenticated++
      if (remote.socketType === 'websocket') websocket++
    }
    const total = manager.remotes.size
    const memory = memoryUsage()
    return {
      at: Date.now(),
      connections: { total, authenticated, anonymous: total - authenticated, websocket, tcp: total - websocket },
      channels: manager.channel_map.size,
      retained: { channel: manager.retain_messages.size, bytes: manager.retainBytes },
      counters: { ...manager.counters },
      memory: { rss: memory.rss, heapUsed: memory.heapUsed }
    }
  }

  // One logStats line; rates are per second since the previous line.
  summaryLine(now = performance.now()) {
    const s = this.snapshot(), previous = this.previous
    const rate = key => previous ? (s.counters[key] - previous.counters[key]) * 1000 / Math.max(1, now - previous.time) : 0
    this.previous = { time: now, counters: s.counters }
    const c = s.connections
    return `[iosignal] conn ${c.total} (auth ${c.authenticated}, anon ${c.anonymous}, ws ${c.websocket}, tcp ${c.tcp})` +
      ` ch ${s.channels} retained ${s.retained.channel}/${bytes(s.retained.bytes)}` +
      ` | rx ${rate('rxMessages').toFixed(1)}/s ${bytes(rate('rxBytes'))}/s` +
      ` tx ${rate('txMessages').toFixed(1)}/s ${bytes(rate('txBytes'))}/s pub ${rate('publishes').toFixed(1)}/s` +
      ` | rss ${bytes(s.memory.rss)} heap ${bytes(s.memory.heapUsed)}`
  }

  // Compact summary for metrics reports ('@$metrics'); byte counters are cumulative.
  oneline() {
    return {
      lastSSID: this.manager.lastSSID,
      remotes: this.manager.remotes.size,
      channels: this.manager.channel_map.size,
      txBytes: this.manager.counters.txBytes,
      rxBytes: this.manager.counters.rxBytes,
    }
  }

  getRemotes() {
    return Array.from(this.manager.remotes, v => "#" + v.ssid + ":" + v.cid + "(" + v.getStateName() + ")")
  }

  getCIdList() {
    return Array.from(this.manager.cid2remote.keys())
  }

  getChannelList() {
    return Array.from(this.manager.channel_map.keys())
  }

  getSubscribers(ch) {
    let list = [];
    if (this.manager.channel_map.has(ch)) {
      let subscribers = this.manager.channel_map.get(ch) //set
      subscribers.forEach(c => {
        list.push(c.cid)
      })
    }
    return list
  }

  getRemoteByCId(cid, mode = 1) {

    if (this.manager.cid2remote.has(cid)) {
      let remote = this.manager.cid2remote.get(cid)
      if (mode == 1) {
        return {
          ip: remote.ip,
          id: remote.cid,
          ssid: remote.ssid,
          cid: remote.cid,
          uid: remote.uid,
          uptime: Math.trunc((Date.now() - remote.socket.openTime) / 1000),
          tx: remote.socket.txCounter,
          rx: remote.socket.rxCounter,
          txBytes: remote.socket.bytesWritten || remote.socket._socket?.bytesWritten,
          rxBytes: remote.socket.bytesRead || remote.socket._socket?.bytesRead
        }
      } else if (mode == 2) {
        return {
          ip: remote.ip,
          uptime: Math.trunc((Date.now() - remote.socket.openTime) / 1000),
          nick: remote.nick,
          ssid: remote.ssid
        }
      } else if (mode == 3) {
        return {
          ip: remote.ip,
          uptime: Math.trunc((Date.now() - remote.socket.openTime) / 1000),
          nick: remote.nick,
          ssid: remote.ssid,
          isSecure: remote.TLS,
          isAuth: remote.boho.isAuthorized,
          encMode: ENC_MODE[remote.encMode]
        }
      } else if (mode == 4) {
        return {
          ip: remote.ip,
          uptime: Math.trunc((Date.now() - remote.socket.openTime) / 1000),
          channels: Array.from(remote.channels.keys()),
          retain: Array.from(remote.retain_signal.keys())
        }
      }

    } else {
      return { result: "nop" }
    }

  }


}
