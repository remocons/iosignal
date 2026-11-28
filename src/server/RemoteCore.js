import { performance } from 'node:perf_hooks'
import MBP from 'meta-buffer-pack'
import Boho from 'boho'
import { serverOption } from './serverOption.js';
import { IOMsg, ENC_MODE, STATE } from '../common/constants.js'

const decoder = new TextDecoder()

// With security.requireEncryption, what a logged-in connection without TLS may not send in plain.
// PING, PONG, CID_REQ, ECHO and CLOSE carry nothing and stay plain, as clients send them.
// Boho 2.x (SHA-256 based) login request code, before Boho 3 (Ascon). Answered with AUTH_FAIL.
const CLASSIC_AUTH_REQ = 0xB1

const PLAINTEXT_REFUSED = new Set([IOMsg.SIGNAL, IOMsg.SIGNAL_E2E, IOMsg.SUBSCRIBE, IOMsg.SUBSCRIBE_REQ,
  IOMsg.UNSUBSCRIBE, IOMsg.CALL, IOMsg.IAM])

const NB = MBP.NB
const MB = MBP.MB

// A one-byte CLOSE reason is a code, not text (Arduino IOSignal::close(uint8_t)): the message
// that made the client close, or its CongPacket reader error state (ReadingState >= 250).
// Its own table, because IOMsg gives 253 another meaning (TIME_OUT).
const CLOSE_REASON = {
  [IOMsg.AUTH_CLEAR]: 'AUTH_CLEAR',
  [IOMsg.SERVER_REDIRECT]: 'SERVER_REDIRECT',
  253: 'CONG_UNKNOWN_TYPE',
  254: 'CONG_OVER_SIZE',
  255: 'CONG_OVER_FLOW'
}

// Readable reason of a CLOSE message, e.g. 'AUTH_CLEAR(0xc4)'; longer reasons are text.
export function closeReason(message) {
  if (message.byteLength < 2) return 'none'
  if (message.byteLength === 2) {
    const code = '0x' + message[1].toString(16).padStart(2, '0')
    return CLOSE_REASON[message[1]] ? `${CLOSE_REASON[message[1]]}(${code})` : code
  }
  return decoder.decode(message.subarray(1))
}


// What retain_signal returns for a connection that has no CID retains yet: one shared, read-only
// empty Map instead of an empty Map per connection (about 185 bytes each, most never used).
class EmptyMap extends Map {
  set() { throw new TypeError('read-only empty map: use RemoteCore.writableRetainSignal()') }
}
const NO_RETAINS = new EmptyMap()

// No limits: the quota of a connection without a profile (the default, see serverOption.quotas).
export const UNLIMITED_QUOTA = Object.freeze({ maxMessageBytes: null, fanout: null, msgPerSec: null, bytesPerSec: null,
  maxConnections: null, maxSubscriptions: null, deliveriesPerSec: null })
function quotaOf(manager, name) {
  return name === null ? UNLIMITED_QUOTA : manager.quotas[name] ?? UNLIMITED_QUOTA
}

export class RemoteCore {
  constructor(socket, manager) {

    this.socket = socket;
    socket.isAlive = true;
    socket.txCounter = 0;
    socket.rxCounter = 0;
    socket.openTime = Date.now()

    this.boho = new Boho()
    this.security = manager.server.security;
    this._challengeIssuedAt = null;
    this._challengeUsed = false;
    this.authFailures = 0; // failed logins on this connection (BohoAuth)
    this._replayBuckets = null; // Map second → Set of seen (ms, counter); made on the first encrypted packet
    this._replayEntries = 0;
    this._replayExpiredBefore = 0;
    this.securityFailure = null;
    this.closeReason = null; // reason of the client's CLOSE message, see closeReason()
    this.encMode = ENC_MODE.AUTO;
    this.channels = new Set();  //  subscribed tags
    this._retainSignal = null; // CID retains (tag → message), made on the first one; read with retain_signal
    this.retainBytes = 0; // bytes of its CID retains (retain_signal)

    this.ssid = RemoteCore.ssid++;  // ordered index number
    this.manager = manager;

    this.cid = ''; // Client Id
    this.did = ''; // Device Id
    this.uid = ''; // User Id
    this.nick = ''
    this.site = '' // the Origin host of a browser connection, set by Remote

    this.privateNode = false
    this.HOME_CHANNEL = ''
    this.role = 'anonymous'; // set on authentication; see ROLES in BohoAuth
    this.accountUid = null;  // counted in manager.accountConnections while authenticated with a uid
    this.ownerUid = null;    // the device's owner (login uid); a web sign-in later changes uid, not this
    this.rxPolicy = null;    // compiled delivery policy of an owned device, see deliveryPolicy.js
    // Quota profile (a server.quotas entry, read live): the anonymous one until authenticated;
    // no profile (null) is unlimited.
    this.quotaName = manager.anonymousQuota ?? null;
    this.quota = quotaOf(manager, this.quotaName);
    this._rateAt = null; // token buckets of quota msgPerSec / bytesPerSec
    this._msgTokens = 0;
    this._byteTokens = 0;
    // Largest message the peer can receive, if it said so in CID_REQ (e.g. an Arduino RX buffer);
    // larger messages are skipped instead of sent. null: no limit beyond maxPayload.
    this.peerRxLimit = null;
    this.peerRxLimitSkipped = 0;

    this.state;
    this.stateLog = null; // state history, kept only with serverOption.debug.showAuthInfo
    this.setState(STATE.OPEN)

  }

  static ssid = 1;

  /** CID retains (tag → message) for reading; an empty read-only Map while there are none. */
  get retain_signal() {
    return this._retainSignal ?? NO_RETAINS;
  }

  /** CID retains for storing one: made on first use. */
  writableRetainSignal() {
    return this._retainSignal ??= new Map();
  }

  /** Authenticated with role 'admin'. */
  get isAdmin() {
    return this.role === 'admin' && this.boho.isAuthorized === true;
  }

  setState(state) {
    const previous = this.state;
    this.state = state
    if (previous !== state) this.manager.server?.emit('remote:state', this, previous);
    if (serverOption.debug.showAuthInfo) {
      (this.stateLog ??= []).push(  state + ":" + STATE[ state]   )
      if( state == STATE.AUTH_RES){
        console.log('[auth success]', this.cid, this.stateLog.join('>'))
      }else if( state == STATE.AUTH_FAIL){
        console.log('[auth_fail]',this.stateLog.join('>'))
      }
    }
  }

  getState() { // <Number>
    return this.state
  }

  getStateName() { // <String>
    return (STATE[this.state]).toLowerCase()
  }


  // logMessages: one line per received message after decryption: type, routing tag or RPC
  // target, and size. Payloads are never printed; heartbeat PING/PONG are skipped.
  logMessage(msgType, message, encrypted = false) {
    if (msgType === IOMsg.PING || msgType === IOMsg.PONG) return
    let detail = ''
    try {
      if ([IOMsg.SIGNAL, IOMsg.SIGNAL_E2E, IOMsg.SUBSCRIBE, IOMsg.UNSUBSCRIBE].includes(msgType)) {
        detail = decoder.decode(message.subarray(2, 2 + message[1]))
      } else if (msgType === IOMsg.SUBSCRIBE_REQ && message.byteLength >= 5) {
        detail = decoder.decode(message.subarray(5, 5 + message.readUInt16BE(3)))
      } else if (msgType === IOMsg.CALL) {
        const req = MBP.unpack(message)
        if (req) detail = `${req.target}.${req.topic}`
      }
    } catch { /* a malformed message is logged without detail */ }
    const type = msgType === undefined ? 'TEXT'
      : IOMsg[msgType] ?? Boho.BohoMsg[msgType] ?? '0x' + msgType.toString(16)
    const transport = this.socketType === 'websocket' ? 'WS' : 'CS'
    console.log(`[rx] #${this.ssid} ${this.cid || '-'} ${transport} ${type}${encrypted ? '(enc)' : ''}` +
      `${detail ? ' ' + detail : ''} ${message.byteLength}B`)
  }

  // Switches to a server.quotas profile; tell: send it to the client (QUOTA: its maxMessageBytes).
  setQuota(name, tell) {
    this.quotaName = name ?? null;
    this.quota = quotaOf(this.manager, this.quotaName);
    this._quotaNoticed = null; // a new profile: its limits may be told once again (noticeQuota)
    // The CongSocket frame ceiling follows maxMessageBytes.
    this.refreshRxFrameLimit?.();
    if (tell) {
      const packet = Buffer.alloc(5);
      packet[0] = IOMsg.QUOTA;
      packet.writeUInt32LE(this.quota.maxMessageBytes ?? 0, 1); // 0: unlimited
      this.send(packet);
    }
  }

  // Quota msgPerSec / bytesPerSec: token buckets holding one second. A message larger than the
  // byte bucket passes when the bucket is full and leaves a debt.
  takeRateTokens(bytes) {
    const { msgPerSec, bytesPerSec } = this.quota;
    if (msgPerSec === null && bytesPerSec === null) return true;
    const now = performance.now();
    if (this._rateAt === null) {
      this._msgTokens = msgPerSec ?? 0;
      this._byteTokens = bytesPerSec ?? 0;
    } else {
      const seconds = (now - this._rateAt) / 1000;
      if (msgPerSec !== null) this._msgTokens = Math.min(msgPerSec, this._msgTokens + seconds * msgPerSec);
      if (bytesPerSec !== null) this._byteTokens = Math.min(bytesPerSec, this._byteTokens + seconds * bytesPerSec);
    }
    this._rateAt = now;
    if (msgPerSec !== null && this._msgTokens < 1) { this.rateLimitedBy = 'msgPerSec'; return false; }
    if (bytesPerSec !== null && this._byteTokens < Math.min(bytes, bytesPerSec)) { this.rateLimitedBy = 'bytesPerSec'; return false; }
    if (msgPerSec !== null) this._msgTokens -= 1;
    if (bytesPerSec !== null) this._byteTokens -= bytes;
    return true;
  }

  rxQuotaChecker(message) {
    let rxBytes = message.byteLength
    this.manager.counters.rxBytes += rxBytes;
    this.manager.counters.rxMessages++;

    const maxMessageBytes = this.quota.maxMessageBytes;
    if (maxMessageBytes !== null && rxBytes > maxMessageBytes) {
      this.manager.counters.oversizeRejected++;
      this.send(Buffer.from([IOMsg.OVER_SIZE]))
      return false;
    }
    if (!this.takeRateTokens(rxBytes)) {
      this.manager.counters.rateLimited++;
      this.noticeQuota(this.rateLimitedBy, this.quota[this.rateLimitedBy]);
      return false;
    }
    // All the anonymous connections of one address together (connectionLimits msg/bytesPerAddressPerSec).
    const limitIp = this.socket?._limitIp;
    if (limitIp !== undefined && !this.boho?.isAuthorized) {
      const over = this.manager.addressLimiter?.takeRate(limitIp, rxBytes);
      if (over) {
        this.manager.counters.addressRateLimited++;
        this.noticeQuota(over, this.manager.server?.connectionLimits?.[over] ?? null);
        return false;
      }
    }
    return true;
  }

  /**
   * Subscribers this connection's publish may reach now (quota deliveriesPerSec: a token bucket holding
   * one second), at most wanted; the tokens are taken. Unlimited: wanted.
   */
  takeDeliveries(wanted) {
    const perSec = this.quota?.deliveriesPerSec ?? null;
    if (perSec === null || wanted <= 0) return wanted;
    const now = performance.now();
    if (this._deliveryAt === undefined) this._deliveryTokens = perSec;
    else this._deliveryTokens = Math.min(perSec, this._deliveryTokens + (now - this._deliveryAt) / 1000 * perSec);
    this._deliveryAt = now;
    const allowed = Math.max(0, Math.min(wanted, Math.floor(this._deliveryTokens)));
    this._deliveryTokens -= allowed;
    return allowed;
  }

  /**
   * Tells this connection, once per kind, that a quota left something out: a SERVER_SIGNAL
   * { event: 'quota_exceeded', data: { kind, limit, quota } } (the JS client emits 'quota_exceeded').
   * Nothing is held back or retried: what went over is still dropped, as before. Only to WebSocket
   * connections (web apps); TCP devices (Arduino) do not read it and have small receive buffers.
   * kind: 'msgPerSec' | 'bytesPerSec' | 'maxSubscriptions' | 'fanout' | 'deliveriesPerSec' |
   * 'msgPerAddressPerSec' | 'bytesPerAddressPerSec' (all anonymous connections of the address together).
   */
  noticeQuota(kind, limit) {
    if (this.socketType !== 'websocket' || !kind) return;
    this._quotaNoticed ??= new Set();
    if (this._quotaNoticed.has(kind)) return;
    this._quotaNoticed.add(kind);
    this.manager.counters.quotaNotices++;
    this.send_enc_mode(MBP.pack(
      MBP.MB('#MsgType', '8', IOMsg.SERVER_SIGNAL),
      MBP.MB('#signalObject', { event: 'quota_exceeded', data: { kind, limit: limit ?? null, quota: this.quotaName ?? null } })
    ));
  }

  issueAuthChallenge() {
    const packet = this.boho.server_time_nonce(); // kept by this.boho for verify_auth_req
    this._challengeIssuedAt = performance.now();
    return packet;
  }

  securityMismatch(reason) {
    if (this._closing || this.state === STATE.CLOSED) return false;
    this.securityFailure = reason;
    this.boho.clearAuth();
    this.role = 'anonymous';
    this._replayBuckets = null;
    this._replayEntries = 0;
    this.close(true);
    this.manager.attackLogger?.log(`SECURITY #${this.ssid} reason:${reason}`);
    this.manager.server.emit('security:mismatch', this, reason);
    return false;
  }

  checkAuthChallenge() {
    if (this._closing || this.state === STATE.CLOSED) return false;
    if (this._challengeUsed) return this.securityMismatch('AUTH_CHALLENGE_REUSED');
    if (this._challengeIssuedAt === null ||
        performance.now() - this._challengeIssuedAt > this.security.authChallengeMaxAgeMs) {
      return this.securityMismatch('AUTH_CHALLENGE_EXPIRED');
    }
    return true;
  }

  // Called only after Boho has authenticated the packet's clock and payload.
  acceptEncryptedClock(message, receivedAtMs) {
    const seconds = message.readUInt32LE(5);
    const milliseconds = message.readUInt16LE(9);
    const counter = message.readUInt16LE(11);
    const packetTime = seconds * 1000 + milliseconds;
    const earliest = receivedAtMs - this.security.maxClockSkewMs;
    if (milliseconds >= 1000 || Math.abs(receivedAtMs - packetTime) > this.security.maxClockSkewMs ||
        packetTime < this._replayExpiredBefore) {
      return this.securityMismatch('TIME_MISMATCH');
    }
    // Never reopen an expired timestamp range after the server clock moves back.
    this._replayExpiredBefore = Math.max(this._replayExpiredBefore, earliest);
    const buckets = this._replayBuckets ??= new Map();
    for (const [second, values] of buckets) {
      if ((second + 1) * 1000 <= this._replayExpiredBefore) {
        this._replayEntries -= values.size;
        buckets.delete(second);
      }
    }
    let bucket = buckets.get(seconds);
    const value = milliseconds * 65536 + counter;
    if (bucket?.has(value)) return this.securityMismatch('REPLAY_DETECTED');
    // Fail closed instead of evicting still-valid replay evidence under load.
    if (this._replayEntries >= this.security.maxReplayEntries) {
      return this.securityMismatch('REPLAY_CAPACITY_EXCEEDED');
    }
    if (!bucket) buckets.set(seconds, bucket = new Set());
    bucket.add(value);
    this._replayEntries++;
    return true;
  }

  decryptSessionPacket(message, receivedAtMs) {
    let decoded;
    try {
      decoded = this.boho.decrypt_session(message);
    } catch {
      this.securityMismatch('INVALID_ENCRYPTED_PACKET');
      return;
    }
    if (!decoded) {
      this.securityMismatch('INVALID_ENCRYPTED_PACKET');
      return;
    }
    if (this.acceptEncryptedClock(message, receivedAtMs)) return decoded;
  }

  onTimeDelayMessage(message, isBinary = true) {
    const receivedAtMs = Date.now();
    setTimeout(() => {
      this.onSocketMessage(message, isBinary, receivedAtMs)
    }
      , serverOption.debug.delay)
  }

  // CongSocket or WebSocket
  onSocketMessage(message, isBinary = true, receivedAtMs = Date.now()) {

    if (this._closing || this.state === STATE.CLOSED) return;

    this.receiveMonitor() // rx-data, ping/pong and timeout check
    if (!this.rxQuotaChecker(message)) return

    const logMessages = this.manager.server?.logMessages
    let msgType, decoded, encrypted = false

    if (isBinary) {
      msgType = message[0]

      if (msgType === Boho.BohoMsg.ENC) {

        decoded = this.decryptSessionPacket(message, receivedAtMs);

        if (decoded) {
          msgType = decoded[0]
          message = decoded
          encrypted = true
        } else {
          return
        }

      } else if (msgType === Boho.BohoMsg.ENC_E2E) { // symetric E2EE Signal
        decoded = this.decryptSessionPacket(message, receivedAtMs);
        // console.log('e2e unpack:', decoded )
        if (decoded) {
          msgType = decoded[0]
          message.set(decoded, Boho.MetaSize.ENC) // set decoded signal_e2e headaer.
          message = message.subarray(Boho.MetaSize.ENC) // reset offset.
          encrypted = true
        } else {
          return
        }

      } else {
        // console.log( `[P] ${ IOMsg[ msgType] || Boho.BohoMsg[cmd]}  LEN: ${message.byteLength}` )
      }
      if (!encrypted && this.security.requireEncryption && this.boho.isAuthorized && !this.TLS &&
          PLAINTEXT_REFUSED.has(msgType)) {
        this.securityMismatch('PLAINTEXT_AFTER_LOGIN');
        return;
      }
      if (logMessages) this.logMessage(msgType, message, encrypted)

      switch (msgType) {
        case IOMsg.PING:
          // Reply in the IOSignal protocol; browser JS cannot observe WS control PONG.
          this.send(Buffer.from([IOMsg.PONG]));
          break;

        case IOMsg.PONG:
          break;

        case IOMsg.CID_REQ:
          if (![STATE.SERVER_READY, STATE.AUTH_RES, STATE.AUTH_FAIL, STATE.CID_RES].includes(this.state)) {
            // Protocol violation: CID_REQ was sent before receiving the SERVER_READY signal.
            console.log('CID_REQ before SERVER_READY')
            this.close()
            return;
          }

          // Optional uint32 little endian after the type: the peer's RX buffer size. Set before
          // anything else is sent, so CID_RES, retained messages and signals respect it.
          if (message.byteLength >= 5) {
            const size = (message[1] | message[2] << 8 | message[3] << 16) + message[4] * 0x1000000
            if (size > 0) this.peerRxLimit = size
          }

          if (!this.cid) {
            const cid = this.manager.issueAnonymousCid()
            if (!cid) {
              console.log('anonymous CID space exhausted')
              this.close()
              return;
            }
            this.cid = cid
            this.manager.cid2remote.set(this.cid, this)
            // The client limits its own sends to its quota (an authenticated one is sent on AUTH).
            this.setQuota(this.quotaName, true)
          }

          // console.log('<< SENDING CID_RES:', this.cid)
          this.send_enc_mode(MBP.pack(
            MB('#cid_ack', '8', IOMsg.CID_RES),
            MB('#cid', this.cid)
          ))

          this.setState(STATE.CID_RES)
          break;

        case IOMsg.ECHO:
          if( message.byteLength < 30) {      
            this.send(message, isBinary)
          }
          break;

        case IOMsg.IAM:
          if (message.byteLength > 1 && message.byteLength < 30) {            
              // if iam request has a text message then reset the nick property.
              this.nick = decoder.decode(message.subarray(1))
          }
          this.iamResponse()
          break;

        case IOMsg.SIGNAL_E2E:
        case IOMsg.SIGNAL:
          if (message.byteLength >= 3) {
            let tagLen = message.readUInt8(1)
            if (message.byteLength >= tagLen + 2) {
              let tag = message.subarray(2, 2 + tagLen)
              tag = decoder.decode(tag)
              this.manager.sender(tag, this, message)
            }
          }
          break;



        case IOMsg.UNSUBSCRIBE:
          if (message.byteLength == 2) {
            this.manager.unsubscribe([''], this)
          } else if (message.byteLength >= 3) {
            let tagLen = message.readUInt8(1)

            if (message.byteLength == tagLen + 2) {
              let tag = message.subarray(2, 2 + tagLen)
              tag = decoder.decode(tag)
              let tagList = tag.split(',')
              this.manager.unsubscribe(tagList, this)
            }
          }
          break;


        case IOMsg.SUBSCRIBE: // 1byte tagLen
          if (message.byteLength >= 3) {
            let tagLen = message.readUInt8(1)
            if (message.byteLength == tagLen + 2) {
              let tag = message.subarray(2, 2 + tagLen)
              tag = decoder.decode(tag)
              let tagList = tag.split(',')
              this.manager.subscribe(tagList, this)
            }
          }
          break;

        case IOMsg.SUBSCRIBE_REQ:  // 2bytes tagLen
          if (message.byteLength >= 6) {
            let msgID = message.readUInt16BE(1)
            let tagLen = message.readUInt16BE(3)
            if (message.byteLength == tagLen + 5) {
              let tag = message.subarray(5, 5 + tagLen)
              tag = decoder.decode(tag)
              let tagList = tag.split(',')
              // console.log('>> SUBSCRIBE_REQ from:', this.cid, tagList)
              const rejected = this.subscriptionsRejected ?? 0
              if (this.manager.subscribe(tagList, this) === false) return
              // 255: some tags were over the quota's maxSubscriptions and were not subscribed.
              this.response(msgID, (this.subscriptionsRejected ?? 0) > rejected ? 255 : 0)
            } else {
              this.response(msgID, 255)
            }
          }
          break;


        case IOMsg.CALL: //service request
          try {
            let req = MBP.unpack(message)
            if (req) {
              if (!req.target || !req.topic) return
              if (this.manager.server.serviceNames.has(req.target)) {
                this.manager.server.emit(req.target, this, req)
              } else {
                // console.log('UnKnown Service call: ', req.target)
              }
            }
          } catch (e) {
            console.log('request catch error', e)
          }
          break;


        case IOMsg.CLOSE:
          // The reason is only logged, so a CLOSE without one still closes.
          this.closeReason = closeReason(message)
          console.log(`>> CLOSE #${this.ssid} cid:${this.cid} reason: ${this.closeReason}`)
          this.close();
          break;


        // A Boho 2.x client: told AUTH_FAIL instead of being left waiting.
        case CLASSIC_AUTH_REQ:
          if (typeof this.manager.authManager?.refuseClassic === 'function') this.manager.authManager.refuseClassic(this)
          else this.send(Buffer.from([Boho.BohoMsg.AUTH_FAIL]))
          return

        // client's auth requst
        case Boho.BohoMsg.AUTH_REQ:
          // No login on this server: say so, or the client would wait in auth_req forever.
          if (!this.manager.authManager) {
            this.send(Buffer.from([Boho.BohoMsg.AUTH_FAIL]))
            return
          }
          // A second request while verification is pending must not restart auth.
          if (this.state === STATE.AUTH_REQ) {
            this.securityMismatch('AUTH_IN_PROGRESS');
            return;
          }
          if (![STATE.SERVER_READY, STATE.AUTH_RES, STATE.AUTH_FAIL, STATE.CID_RES].includes(this.state)) {
            console.log('protocol error. must called auth_req after server_ready')
            this.close();
            return;
          }
          if (!this.checkAuthChallenge()) return;
          this.setState(STATE.AUTH_REQ)
          //async
          this.manager.authManager.verify_auth_req(message, this)
            .then(authInfo => {
              if (authInfo?.name) {
                this.manager.deligateSignal(this, '@$name', authInfo.name)
                // console.log('device login success authInfo', authInfo)
                // this.manager.sender('@$name', authInfo.name )
              }

              // console.log('[VERIFY AUTH_REQ] SubClass of BohoAuth return authInfo:', authInfo )
            })
            .catch(e => {
              console.log('authInfo return fail.', e )
            })

          return;

        default:
        // console.log('unknown MsgType:',msgType,' from:', this.ip, this.ssid, this.cid )

      }

    } else {
      // TEXT FRAME
      if (logMessages) this.logMessage(undefined, message)
      try {
        let textMessage = decoder.decode(message)
        // console.log('text buffer:',textMessage )
        // console.log('text buffer:',message.toString('hex') )
        this.manager.server.emit('text_message', textMessage, this)
      } catch (error) {

      }
    }

  }


  response(msgId, statusCode, body) {
    // console.log('response body', body)
    if (body) {
      this.send_enc_mode(MBP.pack(
        MB('#type', '8', IOMsg.RESPONSE_MBP),
        MB('status', '8', statusCode),
        MB('mid', '16', msgId),
        MB('body', body)
      ))
    } else {
      this.send_enc_mode(MBP.pack(
        MB('#type', '8', IOMsg.RESPONSE_MBP),
        MB('status', '8', statusCode),
        MB('mid', '16', msgId)
      ))
    }
  }


  send_enc_mode(data, useEncryption = false) {

    if (this.encMode === ENC_MODE.YES ||
      this.encMode === ENC_MODE.AUTO &&
      !this.TLS && this.boho.isAuthorized
    ) useEncryption = true;

    // console.log('svr useEnc',  useEncryption, data )

    if (useEncryption && data[0] == IOMsg.SIGNAL_E2E) {
      // When the server delivers end-to-end encrypted messages, 
      // it should only encrypt the header part and pass the data part as is.
      let tagLen = data[1];

      // let tagInfo = decoder.decode( data.subarray( 2, 2 + tagLen) )
      // console.log('server bypass E2E signal taginfo:', tagInfo )

      let encHeader = this.boho.encrypt_session(data.subarray(0, 3 + tagLen), Boho.BohoMsg.ENC_E2E)
      let newEncBuffer = Buffer.concat([encHeader, data.subarray(3 + tagLen)])
      this.send(newEncBuffer)

    } else if (useEncryption) {
      let encPack = this.boho.encrypt_session(data)
      if (encPack) {
        this.send(encPack)
      } else {
        // console.log('encryption FAIL: NO DATA TRANSIT')
      }
    } else {
      // console.log('send -N-')
      this.send(data)

    }

  }



  iamResponse(info = '') {

    if (info == '') {
      let channels = []
      for (let tag of this.channels.keys()) {
        channels.push(tag)
      }

      info = {
        "ssid": this.ssid,
        "cid": this.cid,
        "did": this.did,
        "uid": this.uid,
        "role": this.role,
        "quota": this.quotaName,
        "nick": this.nick,
        "ip": this.ip
        , 'tag': channels
      }
    }

    // console.log( 'iam res info', info )
    let pack = MBP.pack(
      MB('#MsgType', '8', IOMsg.IAM_RES),
      MB('#info', info)
    )
    this.send_enc_mode(pack)
  }


}
