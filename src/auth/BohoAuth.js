import MBP from 'meta-buffer-pack'
import Boho from 'boho'
import { serverOption } from '../server/serverOption.js'
import { IOMsg, STATE } from '../common/constants.js'
import { JsonLinesLogger } from '../server/FileLogger.js'
import { compileDeliveryPolicy } from '../server/deliveryPolicy.js'
import { getSignalPack } from '../common/payload.js'
import { isPrivateIP } from '../common/util.js'

// The stored key: base64 of Boho.deriveKey(key string), 16 bytes. 44 characters: a Boho 2.x hash.
const STORED_KEY = /^[A-Za-z0-9+/]{22}==$/
const CLASSIC_HASH_LENGTH = 44
const decoder = new TextDecoder()
const DUPLICATE_LOGIN_POLICIES = ['keepOld', 'keepNew']
// Only WebSocket remotes carry socketType; CongSocket remotes leave it unset.
const transportOf = remote => remote.socketType === 'websocket' ? 'websocket' : 'congsocket'

// Kind of a failed login, from its reason (which may carry the login ID): the summary and event key.
// Summary-only kinds: 'bad_packet' (an AUTH_REQ of the wrong size), 'boho2_client' (a Boho 2.x
// login request: an IOSignal 9.x client), 'blocked' (an address with too many wrong logins, closed
// unchecked), 'unavailable' (key store).
const FAIL_KINDS = [
  ['NO ID', 'no_id'], ['NO KEY', 'no_key'], ['BOHO 2.x KEY', 'boho2_key'], ['hmac', 'wrong_key'],
  ['unknown auth.role', 'unknown_role'], ['unknown quota', 'unknown_quota'],
  ['too many connections', 'too_many_connections'], ['duplicate login', 'duplicate'], ['unpack', 'bad_packet']
]
export function authFailKind(reason) {
  const text = String(reason ?? '')
  for (const [prefix, kind] of FAIL_KINDS) if (text.startsWith(prefix)) return kind
  return 'error'
}
// A login ID as received (any 8 bytes): printable ASCII only, for logs.
const cleanId = id => String(id ?? '').slice(0, 8).replace(/[^\x21-\x7e]/g, '?')
const MAX_SUMMARY_KEYS = 1000 // distinct addresses or IDs kept per window; the rest count as 'other'
const TOP = 5
const RECENT = 12 // reported summaries kept for monitors (two hours at the default window)

/**
 * Failed logins in a time window: counts by kind, address and login ID, reported once when the
 * window ends. Nothing runs while no login fails (the window starts with its first failure).
 */
export class AuthFailureSummary {
  /** @param {{ windowMs: () => number, onSummary: (summary: object) => any }} options */
  constructor({ windowMs, onSummary }) {
    this.windowMs = windowMs
    this.onSummary = onSummary
    this.last = null // the last reported summary
    this.recent = [] // reported summaries, newest first (at most RECENT)
    this.seq = 0 // number of the last reported summary (1, 2, ...): tells windows apart
    this.#reset()
  }

  // The window's figures so far (a summary without until), or null before its first failure.
  #figures() {
    if (!this.since) return null
    const top = map => [...map].sort((a, b) => b[1] - a[1]).slice(0, TOP)
    return {
      since: this.since, total: this.total,
      kinds: Object.fromEntries([...this.kinds].sort((a, b) => b[1] - a[1])),
      ips: this.ips.size + (this.otherIps ? 1 : 0), topIps: top(this.ips),
      ids: this.ids.size + (this.otherIds ? 1 : 0), topIds: top(this.ids)
    }
  }

  /** The window in progress, as a summary without until; null while no login has failed in it. */
  current() {
    return this.#figures()
  }

  #reset() {
    this.since = 0
    this.total = 0
    this.kinds = new Map()
    this.ips = new Map()
    this.ids = new Map()
    this.otherIps = 0
    this.otherIds = 0
    if (this.timer) clearTimeout(this.timer)
    this.timer = null
  }

  #count(map, key, overflow) {
    if (map.has(key)) map.set(key, map.get(key) + 1)
    else if (map.size < MAX_SUMMARY_KEYS) map.set(key, 1)
    else this[overflow]++
  }

  add(kind, ip, id) {
    const windowMs = this.windowMs()
    if (!(windowMs > 0)) return
    if (!this.since) {
      this.since = Date.now()
      this.timer = setTimeout(() => this.flush(), windowMs)
      this.timer.unref?.()
    }
    this.total++
    this.kinds.set(kind, (this.kinds.get(kind) ?? 0) + 1)
    if (ip) this.#count(this.ips, ip, 'otherIps')
    if (id !== undefined && id !== null) this.#count(this.ids, cleanId(id), 'otherIds')
  }

  /** Ends the window now: returns its summary (null when nothing failed) and reports it. */
  flush() {
    const figures = this.#figures()
    if (!figures) return null
    const { since, ...rest } = figures
    const summary = { seq: ++this.seq, since, until: Date.now(), ...rest }
    this.#reset()
    this.last = summary
    this.recent = [summary, ...this.recent].slice(0, RECENT)
    try {
      Promise.resolve(this.onSummary?.(summary)).catch(error => console.error('onAuthSummary error:', error))
    } catch (error) {
      console.error('onAuthSummary error:', error)
    }
    return summary
  }

  close() {
    this.#reset()
  }
}

/** One log line for a summary: `[auth] fail 2026-11-25T10:00:00Z +10m 45: no_id 42, ... | ip ... | id ...` */
export function formatAuthSummary(s) {
  const pairs = list => list.map(([k, n]) => `${k}×${n}`).join(' ')
  const minutes = Math.max(1, Math.round((s.until - s.since) / 60000))
  return `[auth] fail ${new Date(s.since).toISOString().slice(0, 19)}Z +${minutes}m ${s.total}: ` +
    Object.entries(s.kinds).map(([k, n]) => `${k} ${n}`).join(', ') +
    ` | ip(${s.ips}) ${pairs(s.topIps)} | id(${s.ids}) ${pairs(s.topIds)}`
}

export function validateDuplicateLogin(policy) {
  if (!DUPLICATE_LOGIN_POLICIES.includes(policy)) {
    throw new RangeError(`duplicateLogin must be one of: ${DUPLICATE_LOGIN_POLICIES.join(', ')}`)
  }
  return policy
}

// Connection roles, lowest to highest: what a connection may do. Its quota is separate.
// 'anonymous' is the role of every connection until it authenticates.
export const ROLES = ['anonymous', 'device', 'service', 'admin']

/** Role of a login: the account's role, 'device' when it has none; undefined if unknown. */
export function resolveRole(role) {
  if (role === undefined || role === null || role === '') return 'device'
  return ROLES.includes(role) && role !== 'anonymous' ? role : undefined
}

/** True if the remote is authenticated with this role or a higher one ('anonymous': always). */
export function hasRole(remote, role) {
  const wanted = ROLES.indexOf(role)
  if (wanted < 0) throw new RangeError(`role must be one of: ${ROLES.join(', ')}`)
  if (wanted === 0) return true
  return remote?.boho?.isAuthorized === true && ROLES.indexOf(remote.role) >= wanted
}

/** Default quota profile of a login: the account's quota, else 'basic' for a device, 'unlimited' otherwise. */
export function defaultQuota(authInfo, role) {
  return authInfo.quota || (role === 'device' ? 'basic' : 'unlimited')
}

export class BohoAuth {
  /**
   * @param {object} keyProvider
   * @param {{ duplicateLogin?: 'keepOld' | 'keepNew', onAuthEvent?: (event: object) => any,
   *   onAuthSummary?: (summary: object) => any, summaryMs?: number,
   *   fileLog?: false | { path?: string, level?: 'normal' | 'all', maxBytes?: number, keep?: number },
   *   resolveQuota?: (authInfo: object, role: string) => string | Promise<string> }} [options]
   *   duplicateLogin: unset follows serverOption.auth.duplicateLogin (default 'keepNew').
   *   A Server's duplicateLogin option takes precedence for that Server's connections.
   *   onAuthEvent: called with { type, did, cid, uid, ip, oldIp, socketType, oldSocketType, reason, at }
   *   for 'replaced' (keepNew evicted the old connection) and 'duplicate_rejected' (keepOld), and
   *   { type: 'auth_fail', did, cid, uid, ip, socketType, reason: kind, at } for a failed login of an
   *   ID that has an owner (authInfo.uid; kind from authFailKind, e.g. 'wrong_key'). An unknown ID
   *   has no event: it is only counted in the summary.
   *   socketType/oldSocketType are 'websocket' or 'congsocket'.
   *   Errors and rejected promises are logged and never affect authentication.
   *   resolveQuota: name of the Server quota profile for a login (default: defaultQuota), e.g. from
   *   the account owner's plan. An unknown name fails the login.
   *   onAuthSummary: called with each failed-login summary { seq, since, until, total, kinds, ips, topIps,
   *   ids, topIds } (default: one console line, formatAuthSummary). summaryMs: its window, default
   *   serverOption.auth.summaryMs; 0 turns it off.
   *   fileLog: the auth file log of this instance, JSON Lines with { at, event, ... }: 'ok' (login,
   *   with id, cid, role, uid), 'fail' (kind, id, cid when known), 'block' (an address blocked),
   *   'summary', 'unavailable'; at level 'all' also 'fail' for unknown IDs and bad packets and
   *   'blocked' (an attempt from a blocked address). Never a key. Without it,
   *   serverOption.fileLogger.auth applies when its use is true; false turns it off here.
   */
  constructor(keyProvider, options = {}) {
    if (!keyProvider) {
      throw new Error('BohoAuth must be initialized with a keyProvider.');
    }
    this.keyProvider = keyProvider;
    this._duplicateLogin = null;
    if (options.duplicateLogin !== undefined) this.duplicateLogin = options.duplicateLogin;
    this.onAuthEvent = options.onAuthEvent ?? null;
    this.resolveQuota = options.resolveQuota ?? defaultQuota;
    this.addressFailures = new Map(); // public address -> { count, since } of wrong logins
    // Failed logins per window (serverOption.auth.summaryMs, or options.summaryMs). Reported to
    // options.onAuthSummary(summary), else as one console line; the last one is failureSummary.last.
    this.onAuthSummary = options.onAuthSummary ?? (summary => console.log(formatAuthSummary(summary)));
    this.failureSummary = new AuthFailureSummary({
      windowMs: () => options.summaryMs ?? serverOption.auth.summaryMs,
      onSummary: summary => {
        this.#fileLog({ event: 'summary', ...summary })
        this.onAuthSummary?.(summary)
      }
    });
    // Auth file log (JSON Lines): options.fileLog { path, level, maxBytes, keep }, false for none;
    // without it serverOption.fileLogger.auth when its use is true.
    const fileLog = options.fileLog !== undefined ? options.fileLog
      : serverOption.fileLogger.auth.use ? serverOption.fileLogger.auth : null;
    this.authLogLevel = fileLog?.level === 'all' ? 'all' : 'normal';
    this.authLogger;
    if (fileLog) {
      this.authLogger = new JsonLinesLogger(fileLog.path ?? 'auth.log', fileLog)
      console.log(`Auth: file log ${this.authLogger.path} (${this.authLogLevel})`)
    }
  }

  // One auth log record (never a key). 'all' records are written only at level 'all'.
  #fileLog(record, all = false) {
    if (!this.authLogger || (all && this.authLogLevel !== 'all')) return
    this.authLogger.write(record)
  }

  // Who a record is about: connection number, address, transport.
  #peerOf(peer) {
    return { ssid: peer.ssid, ip: peer.ip, transport: transportOf(peer) }
  }

  /** Effective duplicate login policy: this instance's setting, else serverOption.auth.duplicateLogin. */
  get duplicateLogin() {
    return this._duplicateLogin ?? serverOption.auth.duplicateLogin;
  }

  /** @param {'keepOld' | 'keepNew' | null} policy  null returns to the serverOption default. */
  set duplicateLogin(policy) {
    this._duplicateLogin = policy === null ? null : validateDuplicateLogin(policy);
  }

  /** Policy for a connection: its Server's duplicateLogin option, else this instance's policy. */
  duplicateLoginFor(peer) {
    return peer.manager?.server?.duplicateLogin ?? this.duplicateLogin;
  }

  // Backward-compatible boolean form of duplicateLogin.
  get keepOldConnection() {
    return this.duplicateLogin === 'keepOld';
  }

  set keepOldConnection(keepOld) {
    this.duplicateLogin = keepOld ? 'keepOld' : 'keepNew';
  }

  emitAuthEvent(event) {
    if (typeof this.onAuthEvent !== 'function') return;
    try {
      Promise.resolve(this.onAuthEvent(event)).catch(error => console.error('onAuthEvent error:', error));
    } catch (error) {
      console.error('onAuthEvent error:', error);
    }
  }

  // Wrong logins of a public address in the current window (see serverOption.auth).
  #addressEntry(ip, now = Date.now()) {
    if (typeof ip !== 'string' || !ip || isPrivateIP(ip)) return null
    let entry = this.addressFailures.get(ip)
    if (entry && now - entry.since >= serverOption.auth.failureWindowMs) {
      this.addressFailures.delete(ip)
      entry = undefined
    }
    return entry ?? { count: 0, since: now, fresh: true }
  }

  /** Addresses blocked now: [{ ip, count, until }], most wrong logins first (at most limit). */
  blockedAddresses(limit = 100, now = Date.now()) {
    const list = []
    for (const [ip, entry] of this.addressFailures) {
      const until = entry.since + serverOption.auth.failureWindowMs
      if (until > now && entry.count >= serverOption.auth.maxFailuresPerAddress) list.push({ ip, count: entry.count, until })
    }
    return list.sort((a, b) => b.count - a.count).slice(0, limit)
  }

  /** True while this address has too many wrong logins: its logins are closed without a check. */
  addressBlocked(ip) {
    const entry = this.#addressEntry(ip)
    return !!entry && entry.count >= serverOption.auth.maxFailuresPerAddress
  }

  #countFailure(peer) {
    peer.authFailures = (peer.authFailures ?? 0) + 1
    const entry = this.#addressEntry(peer.ip)
    if (!entry) return
    if (entry.fresh) {
      delete entry.fresh
      // Bounded: forget windows that have passed before adding another address.
      if (this.addressFailures.size >= 10000) {
        const now = Date.now()
        for (const [ip, e] of this.addressFailures) if (now - e.since >= serverOption.auth.failureWindowMs) this.addressFailures.delete(ip)
        if (this.addressFailures.size >= 10000) this.addressFailures.clear()
      }
      this.addressFailures.set(peer.ip, entry)
    }
    entry.count++
    if (entry.count === serverOption.auth.maxFailuresPerAddress) {
      const seconds = Math.round((entry.since + serverOption.auth.failureWindowMs - Date.now()) / 1000)
      console.log(`[auth] ${peer.ip} blocked for ${Math.max(0, seconds)}s: ${entry.count} wrong logins`)
      this.#fileLog({ event: 'block', ip: peer.ip, count: entry.count, seconds: Math.max(0, seconds) })
    }
  }

  // countFailure: a wrong ID or key (not a refusal of a valid key, such as a duplicate login).
  // login: { id, authInfo } when known. The failure is counted in the summary, and for an ID with
  // an owner (authInfo.uid) reported as an 'auth_fail' event (a duplicate login has its own event).
  send_auth_fail(peer, reason, countFailure = false, login = null) {
    if (peer._closing || peer.state === STATE.CLOSED) return;
    peer.boho.isAuthorized = false;
    if (countFailure) this.#countFailure(peer)
    const kind = authFailKind(reason)
    this.failureSummary.add(kind, peer.ip, login?.id)
    const authInfo = login?.authInfo
    if (authInfo?.uid && kind !== 'duplicate') {
      this.emitAuthEvent({
        type: 'auth_fail', did: login.id, cid: authInfo.cid, uid: authInfo.uid,
        ip: peer.ip, socketType: transportOf(peer), reason: kind, at: Date.now()
      })
    }
    const lastTry = countFailure && peer.authFailures >= serverOption.auth.maxFailuresPerConnection
    // A known ID always (someone has or guesses a real ID); an unknown one only at level 'all'.
    const failRecord = { event: 'fail', kind, ...this.#peerOf(peer) }
    if (login?.id !== undefined) failRecord.id = cleanId(login.id)
    if (authInfo?.cid) failRecord.cid = authInfo.cid
    this.#fileLog(failRecord, !authInfo)
    // console.log('##### AUTH_FAIL reason: ', reason)
    peer.setState(STATE.AUTH_FAIL)
    if (!lastTry) this.#closeLater(peer)
    // add some delay time.
    setTimeout(e => {
      if (!peer._closing && peer.state === STATE.AUTH_FAIL) {
        peer.send(Buffer.from([Boho.BohoMsg.AUTH_FAIL]))
        // Too many wrong logins on this connection: it has to connect again to go on.
        if (lastTry) peer.close()
      }
    }, serverOption.auth.failDelay)
  }


  // A refused connection left without a CID is closed after serverOption.auth.failCloseMs, unless
  // it logs in or goes on anonymously meanwhile (its state is then no longer AUTH_FAIL).
  #closeLater(peer) {
    const ms = serverOption.auth.failCloseMs
    if (!(ms > 0)) return
    clearTimeout(peer._authFailCloseTimer)
    peer._authFailCloseTimer = setTimeout(() => {
      peer._authFailCloseTimer = null
      if (!peer._closing && peer.state === STATE.AUTH_FAIL) peer.close()
    }, ms)
    peer._authFailCloseTimer.unref?.()
  }

  /**
   * A Boho 2.x login request (an IOSignal 9.x client): answered with AUTH_FAIL, counted in the
   * summary as 'boho2_client' and closed after failCloseMs like any refused login.
   */
  refuseClassic(peer) {
    if (peer._closing || peer.state === STATE.CLOSED) return;
    peer.boho.isAuthorized = false;
    this.failureSummary.add('boho2_client', peer.ip)
    this.#fileLog({ event: 'fail', kind: 'boho2_client', ...this.#peerOf(peer) }, true)
    peer.setState(STATE.AUTH_FAIL)
    peer.send(Buffer.from([Boho.BohoMsg.AUTH_FAIL]))
    this.#closeLater(peer)
  }

  // The login could not be checked (key store unreachable): not an answer about the key. The
  // connection is closed, so the client connects and logs in again, instead of AUTH_FAIL, which
  // clients take as "wrong key" and do not retry.
  close_unavailable(peer, reason) {
    if (peer._closing || peer.state === STATE.CLOSED) return;
    console.error('BohoAuth: login not checked, closing the connection:', reason)
    this.failureSummary.add('unavailable', peer.ip)
    this.#fileLog({ event: 'unavailable', ...this.#peerOf(peer), reason: String(reason).slice(0, 200) })
    peer.boho.isAuthorized = false;
    peer.close();
  }

  /**
   * Hook for a subclass: decide where a verified login belongs before it is accepted.
   * Called after the key and role checks, before quotas and the duplicate login check.
   * Return null to accept the login here, or a message (e.g. SERVER_REDIRECT) that is sent to the
   * client instead of AUTH_RES before the connection is closed. The default accepts every login.
   * @param {object} peer the connection
   * @param {object} authInfo the key provider's entry for the login ID (cid, uid, role, quota, ...)
   * @param {string} role resolved role
   * @param {string} id login ID
   * @returns {Promise<Uint8Array | null> | Uint8Array | null}
   */
  beforeAccept(peer, authInfo, role, id) {
    return null
  }

  // An error in the hook accepts the login: placement must never lock clients out.
  async #beforeAcceptSafe(peer, authInfo, role, id) {
    try {
      const result = await this.beforeAccept(peer, authInfo, role, id)
      return result instanceof Uint8Array && result.byteLength > 0 ? result : null
    } catch (error) {
      console.error('BohoAuth.beforeAccept error:', error)
      return null
    }
  }

  async verify_auth_req(auth_req, peer) {
    try {
      if (!peer.checkAuthChallenge()) return;
      if (!(auth_req instanceof Uint8Array) || auth_req.length !== Boho.MetaSize.AUTH_REQ ||
          auth_req[0] !== Boho.BohoMsg.AUTH_REQ) {
        this.failureSummary.add('bad_packet', peer.ip)
        this.#fileLog({ event: 'fail', kind: 'bad_packet', ...this.#peerOf(peer) }, true)
        peer.securityMismatch('INVALID_AUTH_PACKET');
        return;
      }
      //1. the login ID: bytes 1..8
      let infoPack = { id8: auth_req.subarray(1, 9) }
      if (!infoPack) {
        this.send_auth_fail(peer, 'unpack auth_pack fail');
        return
      }

      let id = ""
      if (infoPack.id8.includes(0)) {
        id = decoder.decode(infoPack.id8.subarray(0, infoPack.id8.indexOf(0)));
      } else {
        id = decoder.decode(infoPack.id8);
      }

      // Too many wrong logins from this address: not checked until its window has passed.
      // Counted in the summary only: no line per attempt (its start is logged once, #countFailure).
      if (this.addressBlocked(peer.ip)) {
        this.failureSummary.add('blocked', peer.ip, id)
        this.#fileLog({ event: 'blocked', ...this.#peerOf(peer), id: cleanId(id) }, true)
        peer.boho.isAuthorized = false;
        peer.close();
        return
      }

      //2. get key of id from DB
      let authInfo
      try {
        authInfo = await this.keyProvider.getAuth(id)
      } catch (error) {
        this.close_unavailable(peer, 'key provider: ' + (error?.message ?? error))
        return
      }
      if (!peer.checkAuthChallenge()) return;
      if (!authInfo) {
        this.send_auth_fail(peer, 'NO ID:' + id, true, { id, authInfo });
        return
      }

      // Never the key: debug output ends up in shared logs.
      if (serverOption.debug.showAuthInfo) {
        console.log('[debug]showAuthInfo', { id, cid: authInfo.cid, uid: authInfo.uid, role: authInfo.role, quota: authInfo.quota })
      }

      //3. check the proof with the stored key (Boho 3, Ascon)
      const key = authInfo.key
      if (typeof key !== 'string' || !key) {
        this.send_auth_fail(peer, 'NO KEY:' + id, true, { id, authInfo });
        return
      }
      if (key.length === CLASSIC_HASH_LENGTH) {
        // A Boho 2.x (SHA-256) key hash: the ID was registered before Boho 3 and its key must be set again.
        this.send_auth_fail(peer, 'BOHO 2.x KEY, SET IT AGAIN:' + id, true, { id, authInfo });
        return
      }
      if (STORED_KEY.test(key)) peer.boho.copy_key(Buffer.from(key, 'base64'))
      else peer.boho.set_key(key) // a provider that keeps the plain key
      let auth_res = peer.boho.verify_auth_req(auth_req)
      if (!auth_res) {
        this.send_auth_fail(peer, 'hmac dismatched', true, { id, authInfo });
        return
      }

      // A valid proof consumes this challenge even if account policy rejects it.
      // Reauthentication requires a new connection, never a replay-state reset.
      peer._challengeUsed = true;

      //4. role and quota. Checked before a duplicate login replaces the old connection.
      const role = resolveRole(authInfo.role);
      if (role === undefined) {
        this.send_auth_fail(peer, 'unknown auth.role: ' + authInfo.role, false, { id, authInfo });
        return
      }
      // A login another server should take (beforeAccept) goes there before it is counted here or
      // replaces a connection here.
      const redirect = await this.#beforeAcceptSafe(peer, authInfo, role, id);
      if (peer._closing) return; // closed while deciding
      if (redirect) {
        peer.boho.isAuthorized = false;
        peer.send(redirect);
        peer.close();
        return
      }
      let quotaName
      try {
        quotaName = await this.resolveQuota(authInfo, role);
      } catch (error) {
        this.close_unavailable(peer, 'quota: ' + (error?.message ?? error))
        return
      }
      const quota = Object.hasOwn(peer.manager.quotas, quotaName) ? peer.manager.quotas[quotaName] : undefined;
      if (!quota) {
        this.send_auth_fail(peer, 'unknown quota: ' + quotaName, false, { id, authInfo });
        return
      }
      if (peer._closing) return; // closed while resolving
      const uid = authInfo.uid || null;
      if (uid && quota.maxConnections !== null) {
        // A connection this login replaces (keepNew) frees its place.
        const old = peer.manager.cid2remote.get(authInfo.cid);
        const replaced = old && old !== peer && old.accountUid === uid && this.duplicateLoginFor(peer) === 'keepNew' ? 1 : 0;
        if (peer.manager.accountConnections(uid) - replaced >= quota.maxConnections) {
          this.send_auth_fail(peer, 'too many connections', false, { id, authInfo });
          return
        }
      }

      //5. check duplicate login.
      if (peer.manager.cid2remote.has(authInfo.cid) && peer.manager.cid2remote.get(authInfo.cid) !== peer) {
        let old = peer.manager.cid2remote.get(authInfo.cid)
        console.log('[WARN]DUPLICATE_LOGIN detected.', old.cid)
        old.ping(); // check the connection.

        let authClearSignal = MBP.pack(
          MBP.MB('#MsgType', '8', IOMsg.AUTH_CLEAR),
          MBP.MB('#reason', 'duplicate login.')
        )
        const keepOld = this.duplicateLoginFor(peer) === 'keepOld'
        if (keepOld) {
          peer.boho.isAuthorized = false;
          // keep old connection. reject new connection by sending auth_fail signal.
          // peer.send(authClearSignal)
          if( peer.socketType == 'websocket'){
            this.send_auth_fail(peer, 'duplicate login', false, { id })
          }else{
            peer.setState(STATE.AUTH_FAIL);
            peer.close(); //arduino 
          }
        } else {
          // accept new connection. stop the old connection by sending auth_clear signal.
          old.send(authClearSignal)
          old.close()
        }
        this.emitAuthEvent({
          type: keepOld ? 'duplicate_rejected' : 'replaced',
          did: id, cid: authInfo.cid, uid: authInfo.uid || null,
          ip: peer.ip, oldIp: old.ip,
          socketType: transportOf(peer), oldSocketType: transportOf(old),
          reason: 'duplicate login', at: Date.now()
        })
        if (keepOld) return
      }

      //6. delete current (or anonymouse)cid if exist.
      if (peer.cid && peer.cid !== authInfo.cid) {
        // Subscribers of the CID it had (an anonymous one, before login()) are told it is gone, as when
        // a connection closes. Sent to them only: nothing is retained under the new CID.
        const manager = peer.manager
        for (const topic of ['@state', '@$state']) {
          const tag = peer.cid + topic
          manager.deliver(manager.CID_PREFIX + tag, getSignalPack(tag, 'close'), null)
        }
        // What it retained carries the old CID in its tag: dropped, the device publishes again when ready.
        for (const message of peer.retain_signal.values()) manager.retainBytes -= message.byteLength
        peer.retain_signal.clear()
        peer.retainBytes = 0
        manager.cid2remote.delete(peer.cid)
      }

      //7. setting info.
      peer.did = id
      peer.cid = authInfo.cid
      if (authInfo.uid) peer.uid = authInfo.uid
      // Delivery policy of an owned device, in place before the CID is reachable (step 9).
      peer.ownerUid = uid
      peer.rxPolicy = compileDeliveryPolicy(authInfo.rxPolicy, uid)

      //8. role and quota; the client is told its quota.
      peer.role = role;
      if (role === 'admin') console.log('## LOGIN ADMIN CID:', peer.cid)
      if (uid) peer.manager.addAccountConnection(peer, uid);
      peer.setQuota(quotaName, true);

      //9. set cid2remote
      peer.manager.cid2remote.set(peer.cid, peer)
      //10. send ack.
      peer.send(auth_res)
      peer.setState(STATE.AUTH_RES)
      this.#fileLog({ event: 'ok', ...this.#peerOf(peer), id: cleanId(id), cid: peer.cid, role, ...(uid && { uid }) })
      return authInfo
    } catch (error) {
      console.log('verify_auth_req error', error)
      this.send_auth_fail(peer, '[BohoAuth]caught: unknown error:' + error);
    }
  }

  async getAuth(id) {
    return this.keyProvider.getAuth(id);
  }

  async getAuthIdList() {
    if (typeof this.keyProvider.getAuthIdList === 'function') {
      return this.keyProvider.getAuthIdList();
    }
  }

  async addAuth(id, keyStr, cid, role, quota) {
    if (typeof this.keyProvider.addAuth === 'function') {
      return this.keyProvider.addAuth(id, keyStr, cid, role, quota);
    }
  }

  async delAuth(id) {
    if (typeof this.keyProvider.delAuth === 'function') {
      return this.keyProvider.delAuth(id);
    }
  }

  async save() {
    if (typeof this.keyProvider.save === 'function') {
      return this.keyProvider.save();
    }
  }


}
