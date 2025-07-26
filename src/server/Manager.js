import MBP from 'meta-buffer-pack'
import { Remote } from './Remote.js'
import { serverOption } from './serverOption.js'
import { IOMsg, CLIENT_STATE } from '../common/constants.js'
import { getSignalPack } from '../common/payload.js';
import { FileLogger } from './FileLogger.js'
import { Metric } from './Metric.js'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export class Manager {

  constructor(server, authManager) {
    this.server = server;
    this.txBytes = 0;
    this.rxBytes = 0;

    this.authManager = authManager;

    this.connectionLogger;
    if (serverOption.fileLogger.connection.use) {
      this.connectionLogger = new FileLogger(serverOption.fileLogger.connection.path)
      // console.log('Manager: begin file logger [connection]')
    }

    this.attackLogger;
    if (serverOption.fileLogger.attack.use) {
      this.attackLogger = new FileLogger(serverOption.fileLogger.attack.path)
      // console.log('Manager: begin file logger.[attack]')
    }

    this.remotes = new Set();         // total remotes
    this.cid2remote = new Map();      // key: cid -> value: remote
    this.retain_messages = new Map()  // key: tag, data: signalMessage
    this.channel_map = new Map()      // key: channelName -> value: < remote : Set >
    this.CHANNEL_PREFIX = 'CH:'
    this.CID_PREFIX = 'CID:'
    this.metric = new Metric(this)
    this.lastSSID = 0;

    this.pingIntervalID = setInterval(e => {
      this.remotes.forEach(function each(remo) {
        let socket = remo.socket;
        if (socket.isAlive === false) {
          console.log('## timeout. cid:', remo.cid)
          remo.close();
        }

        socket.txCounter++;
        socket.isAlive = false;
        if (remo.socketType === 'websocket') {
          socket.ping();
        } else {
          remo.ping()
        }

      });
    }, serverOption.timeout);

    if (serverOption.showMetric) {
      this.monitIntervalID = setInterval((e) => {
        this.monitor()
      }, serverOption.monitorPeriod);
    }


  }


  addRemote(socket, req) {
    socket.isAlive = true;
    let remote = new Remote(socket, req, this)
    this.remotes.add(remote)
    remote.send(Buffer.from([IOMsg.SERVER_READY]))
    remote.setState(CLIENT_STATE.SENT_SERVER_READY)
    this.lastSSID = remote.ssid;
    let connectionInfo = `+ IP:${remote.ip} #${remote.ssid} ${socket.socketType === 'websocket' ? "WS" : "CS"} `;
    // console.log( connectionInfo)
    if (this.connectionLogger) this.connectionLogger.log(connectionInfo)
  };


  removeRemote(remote) {

    let remoteInfo = `- IP:${remote.ip} #${remote.ssid} cid:${remote.cid} ${remote?.socket.socketType === 'websocket' ? "WS" : "CS"} `
    if (this.connectionLogger) this.connectionLogger.log(remoteInfo)
    this.deligateSignal(remote, '@state', 'close')
    this.deligateSignal(remote, '@$state', 'close')

    // remove subscriber 
    for (let ch of remote.channels.keys()) {
      if (this.channel_map.has(ch)) {
        const remotes = this.channel_map.get(ch)
        // console.log(`-- channel [ ${ch} ] removes subscriber id: ${remote.cid} `)
        remotes.delete(remote)
        if (remotes.size == 0) this.channel_map.delete(ch)
      } else {
        // console.log('no such a ch: ', ch )
      }
    }

    // retain message policy
    // type 1. ( isAuthorizedUser) ? keep : delete.
    if (remote.boho.isAuthorized) {
      //keep retain signal.
    } else {
      // anonymouse: remove the cid publish channel
      for (let ch of remote.retain_signal.keys()) {
        // console.log('cid retain_signal.keys:', ch )
        ch = this.CID_PREFIX + remote.cid + '@' + ch
        if (this.channel_map.has(ch)) {
          this.channel_map.delete(ch)
          // console.log(`-- deleted cid pub ch [ ${ch} ]. cid publisher id: ${remote.cid} `)
        } else {
          // console.log('no such a retain_signal tag: ', ch )
        }
      }
    }


    if (remote.uid && this.server.apiNames.has('account')) {
      let req = { topic: 'detachUserRemote' }
      req.args = ['caller:manager.removeRemote']
      this.server.emit('account', remote, req)
    }

    this.remotes.delete(remote)
    this.cid2remote.delete(remote.cid)
    remote = null

  }


  // it's like unix wall command.
  serverSignal(obj) {
    let sigPack = MBP.pack(
      MBP.MB('#MsgType', '8', IOMsg.SERVER_SIGNAL),
      MBP.MB('#signalObject', obj)
    )

    this.remotes.forEach(remote => {
      remote.send_enc_mode(sigPack)
    })
  }

  getSignalTag(buffer) {
    let tagLen = buffer.readUint8(1)
    let tagBuf = buffer.subarray(2, 2 + tagLen)
    let tag = decoder.decode(tagBuf)
    return tag
  }

  getNewSignalTagMessage(buffer, newTag) {
    let msgType = buffer[0]
    let tagLen = buffer.readUint8(1)
    let newTagBuf = encoder.encode(newTag)
    let newTagLen = newTagBuf.byteLength;
    let payloadCunk = buffer.subarray(2 + tagLen)
    let newBuffer = Buffer.concat([Buffer.from([msgType, newTagLen]), newTagBuf, payloadCunk])
    return newBuffer
  }


  // signaling to the cid subscribers.
  // example.  sending cid close signal.
  deligateSignal(remote, tag, ...args) {
    let sigPack = getSignalPack(tag, ...args)
    this.sender(tag, remote, sigPack)
  }

  adminSignal(cid, message) {
    if (this.cid2remote.has(cid)) {
      this.cid2remote.get(cid).send_enc_mode(message)
      return
    } else {
      return "no cid"
    }
  }

  serverSignalTo(tag, ...args) {
    let cid = tag.split('@')[0]
    let topic = tag.split('@')[1]
    let sigPack = getSignalPack('@' + topic, ...args)
    if (cid && this.cid2remote.has(cid)) {
      let targetRemote = this.cid2remote.get(cid)
      console.log('target', targetRemote.state, targetRemote.cid)
      targetRemote.send_enc_mode(sigPack)
      return
    } else {
      return "no cid"
    }
  }

  sender(tag, remote, message) {
    if (serverOption.memberOnly && !remote.boho.isAuthorized) {
      // console.log("## MemberOnly, reject unAuthorized remote." )
      remote.send(Buffer.from([IOMsg.SERVER_CLEAR_AUTH]))
      remote.close()
      return ['err', 'not autrized']
    }

    if (tag.indexOf('$') == 0) return ['err', 'prefix $ is reserved for userSet tag.']

    let cidIndex = tag.indexOf('@');
    if (cidIndex === 0) {
      // ** CID_PUB multi-cast
      // [cid_pub]  @topic ,  @$retainTopic
      // modify signalpack with cid_appneded tag.
      tag = remote.cid + tag;
      message = this.getNewSignalTagMessage(message, tag)

    } else if (cidIndex > 0) {
      // uni-cast.  
      let targetCId = tag.split('@')[0];
      if (this.cid2remote.has(targetCId)) {
        //rm cid from tag.
        let ommitCIdTag = '@' + tag.split('@')[1]
        // console.log('uni-cast tag change from', tag, 'to' , ommitCIdTag )
        message = this.getNewSignalTagMessage(message, ommitCIdTag)
        // console.log(`origin tag: ${tag} omitTag: ${this.getSignalTag(message)}`)
        this.cid2remote.get(targetCId).send_enc_mode(message)
        return ['ok', 1]
      }
      return ['err', 'Invalid cid']
    } else {
      // console.log('ch_pub tag:', tag)
      //else channel publish message
    }


    /**
     * multi-cast: 
     * channel_publish 
     * or cid_publish
     */

    // HOME_CHANNEL substitution.
    // (blank)#topic  ->  home_channel#topic. 
    if (tag.indexOf('#') === 0) {
      tag = remote.HOME_CHANNEL + tag;
    } else if (tag.includes('@')) {
      tag = this.CID_PREFIX + tag;
    } else {
      tag = this.CHANNEL_PREFIX + tag;
    }

    // retain signal message
    if (tag.includes('$')
      // && remote.boho.isAuthorized
      && serverOption.retain.isAvailable
      && serverOption.retain.limitCounter > this.retain_messages.size
      && serverOption.retain.limitSize > message.byteLength
    ) {
      // cid retain signal
      if (tag.includes('@')) {
        // cid retain signal stored inside remote.
        let retainTag = tag.split('@')[1]
        remote.retain_signal.set(retainTag, message)
      } else {
        // channel retain signal stored inside manager.
        this.retain_messages.set(tag, message)
      }

    } else {
      // console.log('no retain. serverOption.retain:', serverOption.retain )
    }

    let sentCounter = 0;
    if (this.channel_map.has(tag)) {
      // console.log('raw channel_map matched tag:', tag)
      let remotes = this.channel_map.get(tag);
      if (remotes.size >= 1) {
        let limit;
        if (serverOption.useQuota.publishCounter) {
          limit = Math.min(remote.quota.publishCounter, remotes.size)
        } else {
          limit = remotes.size;
        }
        let peers = remotes.values();
        while (sentCounter < limit) {
          let c = peers.next().value
          if (!c) {
            // console.log('## null remote' )
            break;
          }
          if (c !== remote) {
            c.send_enc_mode(message);
            sentCounter++;
          }
        }

        if (serverOption.useQuota.publishCounter) {
          // console.log(`pub >> [${tag}] sent: ${sentCounter} [use quota limit: ${remote.quota.publishCounter }] total: ${remotes.size} subscribers. ` )
        } else {
          // console.log(`pub >> [${tag}] sent: ${sentCounter} [no quota limit] total: ${remotes.size} subscribers. ` )
        }
        return ['ok', sentCounter]
      }
    }
    // console.log('-- No subscriber. ch: ' , tag )
    return ['err', 'No subscriber.']
  }



  subscribe(chArr, remote) {
    chArr.forEach(tag => {
      if (tag.indexOf('#') === 0) {
        tag = remote.HOME_CHANNEL + tag
      } else if (tag.includes('@')) {
        tag = this.CID_PREFIX + tag;
      } else {
        tag = this.CHANNEL_PREFIX + tag
      }

      // 1. set channel map
      if (this.channel_map.has(tag)) {
        this.channel_map.get(tag).add(remote)
      } else {
        this.channel_map.set(tag, new Set([remote]))
      }

      // 2.add to remote channels.
      remote.channels.add(tag)

      // 3. send retain message if available.
      if (tag.includes('$')
        && serverOption.retain.isAvailable
      ) {
        let retainMessage;
        if (tag.includes('@')) {
          let cid = tag.split('@')[0]
          cid = cid.split(this.CID_PREFIX)[1]
          let retainTag = tag.split('@')[1]
          if (this.cid2remote.has(cid)) {
            retainMessage = this.cid2remote.get(cid).retain_signal.get(retainTag)
          } else {
            // console.log('cid subscribe is rejected. not online:', cid)
            return;
          }

        } else if (this.retain_messages.has(tag)) {
          retainMessage = this.retain_messages.get(tag)
        }
        if (retainMessage) remote.send_enc_mode(retainMessage)

      }

    })
    return remote.channels.size;
  }

  unsubscribe(chArr, remote) {
    //unsubscribe all channels of the remote.
    if (chArr.length == 1 && chArr[0] == "") {

      remote.channels.forEach(ch => {
        if (this.channel_map.has(ch)) {
          let remotes = this.channel_map.get(ch)
          remotes.delete(remote)
          if (remotes.size == 0) this.channel_map.delete(ch)
        }
      })
      remote.channels.clear();

    } else {
      // unsubscribe each channels.
      chArr.forEach(ch => {
        // substitution home_channel
        if (ch.indexOf('#') === 0) {
          ch = remote.HOME_CHANNEL + ch;
        } else if (ch.includes('@')) {
          ch = this.CID_PREFIX + ch;
        } else {
          ch = this.CHANNEL_PREFIX + ch;
        }
        // console.log('-- Manager::unsubscribe:', ch )

        // delete manager map.
        if (this.channel_map.has(ch)) {
          let remotes = this.channel_map.get(ch)
          remotes.delete(remote)
          if (remotes.size == 0) this.channel_map.delete(ch)
        } else {
          // console.log('##no such a ch', ch )
        }
        remote.channels.delete(ch)
      })
    }

    // console.log( '-- result unsub:', remote.channels )

  }


  monitor() {
    if (process.stdout.isTTY) {
      process.stdout.cursorTo(0, 0)
      process.stdout.clearScreenDown()
    }

    if (serverOption.showChannel > 0) {
      this.metric.channels(serverOption.showChannel);
    }
    let mode = parseInt(serverOption.showMetric)
    switch (mode) {
      case 1:
        this.metric.oneline(true);
        break;
      case 2:
        this.metric.getRemotes(true);
        break;
      case 3:
        this.metric.getChannelList(true);
        break;
      default:
    }

  }


  closeRemoteByCId(cid) {
    if (this.cid2remote.has(cid)) {
      this.cid2remote.get(cid).close()
      return 1
    } else {
      return 0
    }
  }


}
