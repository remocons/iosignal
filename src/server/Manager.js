import MBP from 'meta-buffer-pack'
import { performance } from 'node:perf_hooks';
import { Remote } from './Remote.js'
import { serverOption } from './serverOption.js'
import { IOMsg, STATE, SIZE_LIMIT } from '../common/constants.js'
import { getSignalPack } from '../common/payload.js';
import { FileLogger } from './FileLogger.js'
import { Metrics } from './Metrics.js'
import { compileDeliveryPolicy, deliveryAllowed, normalizeDeliveryPolicy } from './deliveryPolicy.js'
import { HostTable } from './Host.js'

// Characters of an anonymous CID after its '?': lowercase Crockford base32, easy to read aloud and type.
export const ANONYMOUS_CID_ALPHABET = '0123456789abcdefghjkmnpqrstvwxyz'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export class Manager {

  constructor(server, authManager) {
    this.server = server;
    // This server's settings; a Manager made without a Server (tests, checks) uses the defaults.
    this.pingPeriod = server?.heartbeatInterval ?? serverOption.heartbeatInterval;
    this.pingGrace = server?.heartbeatGrace ?? serverOption.heartbeatGrace;
    if (!Number.isFinite(this.pingPeriod) || this.pingPeriod <= 0 ||
        !Number.isFinite(this.pingGrace) || this.pingGrace < 0) {
      throw new RangeError('Invalid heartbeat period or grace');
    }
    // Cumulative since the server started; never reset (readers compute rates from deltas).
    this.counters = { rxMessages: 0, rxBytes: 0, txMessages: 0, txBytes: 0,
      publishes: 0, deliveryAttempts: 0, quotaExcluded: 0, oversizeRejected: 0, rateLimited: 0,
      peerRxLimitSkipped: 0, // messages not sent: larger than the peer's advertised RX buffer
      policyDenied: 0,       // unicasts and CID publications a device's delivery policy kept back
      hostInbound: 0,        // client signals handed to a host (server.host)
      hostRejected: 0,       // signals to a host tag that were not handed over (E2E, malformed payload)
      hostDenied: 0 };       // client signals to a tag a host owns, dropped

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
    this.accountConnectionCounts = new Map(); // uid -> authenticated connections
    this.retain_messages = new Map()  // key: tag, data: signalMessage
    this.retain_owner = new Map()     // key: channel retain tag -> its owner record (see retainOwner)
    this.retainOwners = new Map()     // key: 'cid:<cid>' | 'conn:<ssid>' | 'net:<HOME_CHANNEL>' -> owner
    this.retainExpiry = new Map()     // key: channel retain tag in a grace pool -> expiry time
    this.retainBytes = 0              // all retained messages, channel and CID
    this.channel_map = new Map()      // key: channelName -> value: < remote : Set >
    this.hosts = new HostTable()      // tags claimed by server.host() hosts
    this.CHANNEL_PREFIX = 'CH:'
    this.CID_PREFIX = 'CID:'
    this.metrics = new Metrics(this)
    this.lastSSID = 0;

    const groups = Math.min(50, Math.max(1, Math.floor(this.pingPeriod / 1000)));
    this.pingGroups = Array.from({ length: groups }, () => new Set());
    this.nextPingGroup = 0;
    this.pingGroupCursor = 0;
    // Same timeout for all entries: insertion order is also deadline order.
    this.heartbeatPending = new Map();
    this.pingTickMs = this.pingPeriod / groups;
    this.heartbeatStopped = false;
    const tick = () => {
      if (this.heartbeatStopped) return;
      this.heartbeatTick();
      if (!this.heartbeatStopped) this.pingIntervalID = setTimeout(tick, this.pingTickMs);
    };
    this.pingIntervalID = setTimeout(tick, this.pingTickMs);

    // logStats: one summary line per interval; it never clears the terminal, so other logs stay.
    if (server.logStats) {
      this.statsIntervalID = setInterval(() => console.log(this.metrics.summaryLine()), server.logStats);
    }


  }


  get retainOptions() {
    return this.server?.retain ?? serverOption.retain
  }

  get quotas() {
    return this.server?.quotas ?? serverOption.quotas
  }

  get anonymousQuota() {
    return this.server?.anonymousQuota ?? serverOption.anonymousQuota
  }

  // Authenticated connections per account (uid), for the quota's maxConnections.
  accountConnections(uid) {
    return this.accountConnectionCounts.get(uid) ?? 0
  }

  addAccountConnection(remote, uid) {
    remote.accountUid = uid
    this.accountConnectionCounts.set(uid, this.accountConnections(uid) + 1)
  }

  /**
   * Replace the delivery policy of the connected, owned device with this CID (see deliveryPolicy.js);
   * the next unicast to it already uses the new one. A new login reads the stored policy again.
   * Returns false when no such connection is here or it has no owner (never filtered).
   * Throws on an invalid policy, so a caller cannot install one by mistake.
   */
  setDeliveryPolicy(cid, policy) {
    const remote = this.cid2remote.get(cid)
    if (!remote?.boho.isAuthorized || !remote.ownerUid) return false
    normalizeDeliveryPolicy(policy)
    remote.rxPolicy = compileDeliveryPolicy(policy, remote.ownerUid)
    return true
  }

  /**
   * Count a message a delivery policy kept from `other` (unicast from it, or a publication to it) and,
   * when someone listens, emit 'delivery:denied' on the server with what the server knows of both:
   * { kind: 'unicast' | 'publish', cid, did, owner, other: { cid, uid, ip, authenticated }, at }.
   * An anonymous connection's CID is not reported (random per connection).
   */
  deliveryDenied(device, other, kind) {
    this.counters.policyDenied++
    if (!this.server?.listenerCount?.('delivery:denied')) return
    const authenticated = other.boho?.isAuthorized === true
    this.server.emit('delivery:denied', {
      kind, cid: device.cid, did: device.did, owner: device.ownerUid,
      other: { cid: authenticated ? other.cid : null, uid: other.uid || null, ip: other.ip ?? null, authenticated },
      at: Date.now()
    })
  }

  removeAccountConnection(remote) {
    const uid = remote.accountUid
    if (!uid) return
    remote.accountUid = null
    const count = this.accountConnections(uid) - 1
    if (count > 0) this.accountConnectionCounts.set(uid, count)
    else this.accountConnectionCounts.delete(uid)
  }

  heartbeatTick() {
    const now = performance.now();
    if (this.retainExpiry.size) this.expireChannelRetains(now);
    // Process only expired requests, not every connected peer.
    for (const [remote, deadline] of this.heartbeatPending) {
      if (deadline > now) break;
      this.heartbeatPending.delete(remote);
      if (!remote._closing && remote.socket.isAlive === false) remote.close(true);
    }
    // The single timer schedules its next tick after this work; missed groups are not replayed.
    const group = this.pingGroups[this.pingGroupCursor];
    this.pingGroupCursor = (this.pingGroupCursor + 1) % this.pingGroups.length;
    for (const remote of group) {
      if (remote._closing || this.heartbeatPending.has(remote)) continue;
      remote.socket.isAlive = false;
      this.heartbeatPending.set(remote, performance.now() + this.pingPeriod + this.pingGrace);
      try {
        remote.ping();
      } catch {
        this.heartbeatPending.delete(remote);
        remote.close(true);
      }
    }
  }

  addRemote(socket, req) {
    socket.isAlive = true;
    let remote = new Remote(socket, req, this)
    this.remotes.add(remote)
    remote.pingGroup = this.nextPingGroup;
    this.pingGroups[remote.pingGroup].add(remote);
    this.nextPingGroup = (this.nextPingGroup + 1) % this.pingGroups.length;
    remote.send(remote.issueAuthChallenge())
    remote.send( Buffer.from([ IOMsg.SERVER_READY]) )
    remote.setState(STATE.SERVER_READY)
    this.lastSSID = remote.ssid;
    let connectionInfo = `+ IP:${remote.ip} #${remote.ssid} ${socket.socketType === 'websocket' ? "WS" : "CS"} `;
    // console.log( connectionInfo)
    if (this.connectionLogger) this.connectionLogger.log(connectionInfo)
  };


  removeRemote(remote) {

    remote._closing = true;
    this.removeAccountConnection(remote);
    this.pingGroups[remote.pingGroup]?.delete(remote);
    this.heartbeatPending.delete(remote);
    remote.setState(STATE.CLOSED);

    let remoteInfo = `- IP:${remote.ip} #${remote.ssid} cid:${remote.cid} ${remote?.socket.socketType === 'websocket' ? "WS" : "CS"} `
    if (this.connectionLogger) this.connectionLogger.log(remoteInfo)
    // A replaced duplicate login no longer owns its CID; the new connection is still online.
    const cidOwner = this.cid2remote.get(remote.cid)
    const ownsCid = !remote.cid || !cidOwner || cidOwner === remote
    if (ownsCid) {
      this.deligateSignal(remote, '@state', 'close')
      this.deligateSignal(remote, '@$state', 'close')
    }
    if (this.hosts.size) this.hosts.remoteClosed(remote, ownsCid)

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
    // Channel retains: an authenticated writer's belong to its account and stay; an anonymous
    // connection's move to its network's grace pool and expire there.
    this.orphanChannelRetains(remote)

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
    // CID retains live in the remote and go with it (after the '@$state' close above).
    for (const message of remote.retain_signal.values()) this.retainBytes -= message.byteLength
    remote.retain_signal.clear()
    remote.retainBytes = 0


    // Service lifecycle hook. Called directly: RPC permission/command checks do not apply to cleanup.
    for (const service of new Set(this.server.services?.values() ?? [])) {
      if (typeof service.onRemoteClose !== 'function') continue
      try {
        service.onRemoteClose(remote)
      } catch (error) {
        console.error('service onRemoteClose error:', error)
      }
    }

    this.remotes.delete(remote)
    if (this.cid2remote.get(remote.cid) === remote) this.cid2remote.delete(remote.cid)
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
    if (newTagLen > SIZE_LIMIT.TAG_LEN1) return null;
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
    if (cid && this.cid2remote.has(cid)) {
      let sigPack = getSignalPack('@' + topic, ...args)
      this.cid2remote.get(cid).send_enc_mode(sigPack)
      return
    } else {
      return "no cid"
    }
  }

  sender(tag, remote, message) {
    if (encoder.encode(tag).byteLength > SIZE_LIMIT.TAG_LEN1) return ['err', 'Tag exceeds 255 UTF-8 bytes']
    if ((this.server?.membersOnly ?? serverOption.membersOnly) && !remote.boho.isAuthorized) {
      // console.log("### server reject client signal reason: [membersOnly]" ,tag, remote.cid  )
      remote.send(Buffer.from([IOMsg.AUTH_CLEAR]))
      remote.close()
      return ['err', 'unAuthorized']
    }

    if (tag.indexOf('$') == 0) return ['err', 'prefix $ is reserved for userSet tag.']

    let cidIndex = tag.indexOf('@');

    // Hosts (server.host): a signal to an inbound tag goes to the host only, with its sender; a
    // client may not send to a tag a host owns. CID publications ('@topic') name their sender and
    // are never hosted.
    if (this.hosts.size && cidIndex !== 0) {
      const entry = this.hosts.match(cidIndex > 0 ? tag.slice(cidIndex) : tag)
      if (entry?.kind === 'inbound') {
        if (entry.host._receive(remote, tag, message)) {
          this.counters.hostInbound++
          return ['ok', 1]
        }
        this.counters.hostRejected++
        return ['err', 'Not accepted by the host']
      }
      if (entry) {
        this.counters.hostDenied++
        if (this.server?.listenerCount?.('host:denied')) this.server.emit('host:denied', remote, tag, entry.host.name)
        return ['err', 'Tag is reserved by a host']
      }
    }
    // A device whose policy also covers its publications: each subscriber is checked (see deliveryPolicy.js).
    const publisher = cidIndex === 0 && remote.rxPolicy?.filterPublish ? remote : null
    if (cidIndex === 0) {
      // ** CID_PUB multi-cast
      // [cid_pub]  @topic ,  @$retainTopic
      // modify signalpack with cid_appneded tag.
      tag = remote.cid + tag;
      message = this.getNewSignalTagMessage(message, tag)
      if (!message) return ['err', 'CID-prefixed tag exceeds 255 UTF-8 bytes']

    } else if (cidIndex > 0) {
      // uni-cast.  
      let targetCId = tag.split('@')[0];
      const target = this.cid2remote.get(targetCId)
      if (target && !deliveryAllowed(target, remote)) {
        // Same answer as an offline CID: a sender cannot tell it is blocked, or probe the policy.
        this.deliveryDenied(target, remote, 'unicast')
        return ['err', 'Invalid cid']
      }
      if (target) {
        //rm cid from tag.
        let ommitCIdTag = '@' + tag.split('@')[1]
        // console.log('uni-cast tag change from', tag, 'to' , ommitCIdTag )
        message = this.getNewSignalTagMessage(message, ommitCIdTag)
        if (!message) return ['err', 'Tag exceeds 255 UTF-8 bytes']
        // console.log(`origin tag: ${tag} omitTag: ${this.getSignalTag(message)}`)
        target.send_enc_mode(message)
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
      && this.retainOptions.enabled
    ) {
      if (tag.includes('@')) {
        // cid retain signal stored inside remote, counted per remote.
        this.storeCidRetain(tag.split('@')[1], message, remote)
      } else {
        // channel retain signal stored inside manager.
        this.storeChannelRetain(tag, message, remote)
      }
    }

    this.counters.publishes++;
    const sent = this.deliver(tag, message, remote.quota.fanout, publisher)
    if (sent === null) return ['err', 'No subscriber.']
    return ['ok', sent]
  }

  // Sends a SIGNAL to the subscribers of a full channel key ('CH:…', 'CID:…', home channel), at
  // most fanout (null: all). publisher: a device whose delivery policy filters its publications.
  // Returns the number sent, or null when the channel has no subscribers.
  deliver(tag, message, fanout, publisher = null) {
    const remotes = this.channel_map.get(tag)
    if (!remotes || remotes.size === 0) return null
    const limit = fanout === null ? remotes.size : Math.min(fanout, remotes.size);
    this.counters.quotaExcluded += remotes.size - limit;
    let sentCounter = 0;
    for (const c of remotes) {
      if (sentCounter >= limit) break;
      if (publisher && !deliveryAllowed(publisher, c)) {
        this.deliveryDenied(publisher, c, 'publish')
        continue
      }
      // change: from v4.x allow receiveSelfMessages.
      c.send_enc_mode(message);
      sentCounter++;
    }
    this.counters.deliveryAttempts += sentCounter;
    return sentCounter
  }

  // A host's publication (Host.publish): full channel key, already packed.
  hostPublish(host, tag, message) {
    if (tag.includes('$') && this.retainOptions.enabled) this.storeChannelRetain(tag, message, null, host)
    this.counters.publishes++;
    return this.deliver(tag, message, host.fanout) ?? 0
  }



  // Retained messages are stored as exact-size copies (a subarray would keep a whole socket chunk
  // or 8 KiB Buffer pool slab alive), within an owner's budget and bytesTotal server-wide. A value
  // that cannot be stored (size, count or budget) also removes the value it would replace, so a
  // later subscriber never gets a stale one.
  retainFits(message, freed, ownerBytes, budget) {
    return this.retainOptions.limitSize > message.byteLength &&
      ownerBytes + message.byteLength <= budget &&
      this.retainBytes + message.byteLength - freed <= this.retainOptions.bytesTotal
  }

  retainCopy(message) {
    const copy = Buffer.allocUnsafeSlow(message.byteLength)
    copy.set(message)
    this.retainBytes += copy.byteLength
    return copy
  }

  // A connection's CID retains go with it: within bytesPerConnection; limitCounter caps new tags.
  storeCidRetain(key, message, remote) {
    const map = remote.retain_signal
    const old = map.get(key)
    const freed = old?.byteLength ?? 0
    if ((old || map.size < this.retainOptions.limitCounter) &&
        this.retainFits(message, freed, remote.retainBytes - freed, this.retainOptions.bytesPerConnection)) {
      map.set(key, this.retainCopy(message))
      this.retainBytes -= freed
      remote.retainBytes += message.byteLength - freed
    } else if (old) {
      map.delete(key)
      this.retainBytes -= freed
      remote.retainBytes -= freed
    }
  }

  // Channel retain owner: the last writer's account (an authenticated CID, shared by its
  // connections, so reconnecting does not reset its budget) or an anonymous writer's connection.
  // Each owner holds at most tagsPerOwner tags and bytesPerOwner bytes.
  retainOwner(key) {
    let owner = this.retainOwners.get(key)
    if (!owner) this.retainOwners.set(key, owner = { key, bytes: 0, tags: new Set() })
    return owner
  }

  // host: a Host (server.host) writing its own tag, with its own budget; remote is then null.
  storeChannelRetain(tag, message, remote, host = null) {
    const owner = this.retainOwner(host ? host.retainOwnerKey
      : remote.boho.isAuthorized ? 'cid:' + remote.cid : 'conn:' + remote.ssid)
    const tagsPerOwner = host?.retainTags ?? this.retainOptions.tagsPerOwner
    const bytesPerOwner = host?.retainBytes ?? this.retainOptions.bytesPerOwner
    const old = this.retain_messages.get(tag)
    const freed = old?.byteLength ?? 0
    const room = old || (this.retain_messages.size < this.retainOptions.limitCounter &&
      owner.tags.size < tagsPerOwner)
    const ownerBytes = owner.bytes - (this.retain_owner.get(tag) === owner ? freed : 0)
    if (room && this.retainFits(message, freed, ownerBytes, bytesPerOwner)) {
      if (old) this.releaseChannelRetain(tag, freed)
      this.retain_messages.set(tag, this.retainCopy(message))
      owner.bytes += message.byteLength
      owner.tags.add(tag)
      this.retain_owner.set(tag, owner)
      this.retainOwners.set(owner.key, owner) // releasing may have removed it when it emptied
    } else if (old) {
      this.dropChannelRetain(tag)
    }
    if (owner.tags.size === 0) this.retainOwners.delete(owner.key)
  }

  // A closed anonymous connection's channel retains stay anonymousGraceMs in its network's pool
  // (by HOME_CHANNEL), which has the same owner budget: reconnecting cannot pile values up, and
  // when the pool is over budget the values closest to expiry go first, least recently written
  // first among equals (an update moves its tag to the end of the owner's set).
  orphanChannelRetains(remote) {
    const conn = this.retainOwners.get('conn:' + remote.ssid)
    if (!conn) return
    const grace = this.retainOptions.anonymousGraceMs
    if (!(grace > 0)) {
      for (const tag of [...conn.tags]) this.dropChannelRetain(tag)
      return
    }
    this.retainOwners.delete(conn.key)
    const pool = this.retainOwner('net:' + remote.HOME_CHANNEL)
    const expires = performance.now() + grace
    for (const tag of conn.tags) {
      pool.tags.add(tag)
      pool.bytes += this.retain_messages.get(tag).byteLength
      this.retain_owner.set(tag, pool)
      this.retainExpiry.set(tag, expires)
    }
    while (pool.bytes > this.retainOptions.bytesPerOwner || pool.tags.size > this.retainOptions.tagsPerOwner) {
      let first
      for (const tag of pool.tags) {
        if (first === undefined || this.retainExpiry.get(tag) < this.retainExpiry.get(first)) first = tag
      }
      this.dropChannelRetain(first)
    }
  }

  expireChannelRetains(now = performance.now()) {
    for (const [tag, expires] of this.retainExpiry) {
      if (expires <= now) this.dropChannelRetain(tag)
    }
  }

  dropChannelRetain(tag) {
    const old = this.retain_messages.get(tag)
    if (!old) return
    this.releaseChannelRetain(tag, old.byteLength)
    this.retain_messages.delete(tag)
  }

  releaseChannelRetain(tag, size) {
    const owner = this.retain_owner.get(tag)
    this.retain_owner.delete(tag)
    this.retainExpiry.delete(tag)
    this.retainBytes -= size
    if (!owner) return
    owner.tags.delete(tag)
    owner.bytes -= size
    if (owner.tags.size === 0) this.retainOwners.delete(owner.key)
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
        && this.retainOptions.enabled
      ) {
        let retainMessage;
        if (tag.includes('@')) {
          let cid = tag.split('@')[0]
          cid = cid.split(this.CID_PREFIX)[1]
          let retainTag = tag.split('@')[1]
          const owner = this.cid2remote.get(cid)
          if (owner) {
            if (owner.rxPolicy?.filterPublish && !deliveryAllowed(owner, remote)) {
              this.deliveryDenied(owner, remote, 'publish')
              return;
            }
            retainMessage = owner.retain_signal.get(retainTag)
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


  // One random byte per CID character.
  anonymousCidRandom(size) {
    return globalThis.crypto.getRandomValues(Buffer.alloc(size))
  }

  // '?' + lowercase Crockford base32 (ANONYMOUS_CID_ALPHABET: no i, l, o, u), never one that is
  // online. Check and set run in the same synchronous turn (CID_REQ handler), so concurrent
  // requests cannot take the same CID. 4 characters normally; 8 if the short space keeps colliding.
  issueAnonymousCid() {
    for (const [size, tries] of [[4, 8], [8, 8]]) {
      for (let i = 0; i < tries; i++) {
        let cid = '?'
        // 32 divides 256, so the low 5 bits of a random byte are uniform.
        for (const byte of this.anonymousCidRandom(size)) cid += ANONYMOUS_CID_ALPHABET[byte & 31]
        if (!this.cid2remote.has(cid)) return cid
      }
    }
    return null
  }

  closeRemoteByCId(cid) {
    if (this.cid2remote.has(cid)) {
      this.cid2remote.get(cid).close()
      return 1
    } else {
      return 0
    }
  }

  close() {
    this.metrics.close();
    this.heartbeatStopped = true;
    clearTimeout(this.pingIntervalID);
    this.heartbeatPending.clear();
    for (const group of this.pingGroups) group.clear();
    if (this.statsIntervalID) {
      clearInterval(this.statsIntervalID);
    }

    this.remotes.forEach(remote => {
      remote.close();
    });

    this.remotes.clear();
    this.cid2remote.clear();
    this.retain_messages.clear();
    this.retain_owner.clear();
    this.retainOwners.clear();
    this.retainExpiry.clear();
    this.retainBytes = 0;
    this.channel_map.clear();

  }
}
