import { memoryUsage } from 'process';
import { ENC_MODE } from '../common/constants.js'

const MAX = 10
let period = 10000

export class Metric {
  constructor(manager) {
    this.manager = manager;

    this.metricsPack = {
      remotes: [0],
      channels: [0],
      txBytes: [0],
      rxBytes: [0],
      unixTime: [Math.floor(Date.now() / 1000)],
      period: 0
    }

    this.tickId = setInterval(e => {

      this.metricsPack.remotes.push(this.manager.remotes.size)
      if (this.metricsPack.remotes.length > MAX) this.metricsPack.remotes.shift()

      this.metricsPack.channels.push(this.manager.channel_map.size)
      if (this.metricsPack.channels.length > MAX) this.metricsPack.channels.shift()


      this.metricsPack.txBytes.push(this.manager.txBytes)
      if (this.metricsPack.txBytes.length > MAX) this.metricsPack.txBytes.shift()

      this.metricsPack.rxBytes.push(this.manager.rxBytes)
      if (this.metricsPack.rxBytes.length > MAX) this.metricsPack.rxBytes.shift()

      this.metricsPack.unixTime = Math.floor(Date.now() / 1000)
      this.metricsPack.period = period;
      this.manager.txBytes = 0
      this.manager.rxBytes = 0


    }, 10000)
  }



  oneline(prn) {
    let memoryUse = memoryUsage();
    let memoryInfo = [{
      ...memoryUse
    }]

    if (prn) console.table(memoryInfo, ['rss', 'heapTotal', 'heapUsed', 'external', 'arrayBuffers']);

    let metric = [{
      lastSSID: this.manager.lastSSID,
      remotes: this.manager.remotes.size,
      channels: this.manager.channel_map.size,
      txBytes: this.manager.txBytes,
      rxBytes: this.manager.rxBytes,
    }]

    if (prn) console.table(metric, ['lastSSID', 'remotes', 'channels', 'txBytes', 'rxBytes']);

    return metric[0]
  }

  getRemotes(prn) {
    let remoteList = Array.from(this.manager.remotes.values())
    let remoteStates = remoteList.map(v => {
      return "#" + v.ssid + ":" + v.cid + "(" + v.state + ")"
    })
    if (prn) console.table(remoteStates)
    return remoteStates
  }

  getCIdList(prn) {
    let CIdList = Array.from(this.manager.cid2remote.keys())
    if (prn) console.table(CIdList)
    return CIdList
  }

  getChannelList(prn) {
    let chList = Array.from(this.manager.channel_map.keys())
    if (prn) console.table(chList)
    return chList
  }

  getSubscribers(ch) {
    let list = [];
    if (this.manager.channel_map.has(ch)) {
      let subscribers = this.manager.channel_map.get(ch) //set
      subscribers.forEach(c => {
        list.push(c.cid)
      })
    }
    // console.log(list)
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
        let channels = Array.from(remote.channels.keys())
        let set_memory = Array.from(remote.memory.keys())
        let retain_signal = Array.from(remote.retain_signal.keys())
        return {
          ip: remote.ip,
          uptime: Math.trunc((Date.now() - remote.socket.openTime) / 1000),
          channels: channels,
          set: set_memory,
          retain: retain_signal
        }
      }

    } else {
      return { result: "nop" }
    }

  }


}

