import MBP from 'meta-buffer-pack'
import Boho from 'boho'
import { serverOption } from '../server/serverOption.js'
import { IOMsg, STATE } from '../common/constants.js'
import { FileLogger } from '../server/FileLogger.js'

const decoder = new TextDecoder()
const DUPLICATE_LOGIN_POLICIES = ['keepOld', 'keepNew']
// Only WebSocket remotes carry socketType; CongSocket remotes leave it unset.
const transportOf = remote => remote.socketType === 'websocket' ? 'websocket' : 'congsocket'

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
   *   resolveQuota?: (authInfo: object, role: string) => string | Promise<string> }} [options]
   *   duplicateLogin: unset follows serverOption.auth.duplicateLogin (default 'keepNew').
   *   A Server's duplicateLogin option takes precedence for that Server's connections.
   *   onAuthEvent: called with { type, did, cid, uid, ip, oldIp, socketType, oldSocketType, reason, at }
   *   for 'replaced' (keepNew evicted the old connection) and 'duplicate_rejected' (keepOld).
   *   socketType/oldSocketType are 'websocket' or 'congsocket'.
   *   Errors and rejected promises are logged and never affect authentication.
   *   resolveQuota: name of the Server quota profile for a login (default: defaultQuota), e.g. from
   *   the account owner's plan. An unknown name fails the login.
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
    this.authLogger;
    if (serverOption.fileLogger.auth.use) {
      this.authLogger = new FileLogger(serverOption.fileLogger.auth.path)
      console.log('Auth: begin file logger.[auth]')
    }
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

  send_auth_fail(peer, reason) {
    if (peer._closing || peer.state === STATE.CLOSED) return;
    peer.boho.isAuthorized = false;
    if (this.authLogger) {
      let peerInfo = `FAIL #${peer.ssid} reason:${reason} `
      this.authLogger.log(peerInfo)
    }
    // console.log('##### AUTH_FAIL reason: ', reason)
    peer.setState(STATE.AUTH_FAIL)
    // add some delay time.
    setTimeout(e => {
      if (!peer._closing && peer.state === STATE.AUTH_FAIL) {
        peer.send(Buffer.from([Boho.BohoMsg.AUTH_FAIL]))
      }
    }, serverOption.auth.failDelay)
  }


  async verify_auth_req(auth_req, peer) {
    try {
      if (!peer.checkAuthChallenge()) return;
      if (!(auth_req instanceof Uint8Array) || auth_req.length !== Boho.MetaSize.AUTH_REQ ||
          auth_req[0] !== Boho.BohoMsg.AUTH_REQ) {
        peer.securityMismatch('INVALID_AUTH_PACKET');
        return;
      }
      //1. unpack 
      let infoPack = MBP.unpack(auth_req, Boho.Meta.AUTH_REQ)
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

      //2. get key of id from DB
      let authInfo = await this.keyProvider.getAuth(id)
      if (!peer.checkAuthChallenge()) return;
      if (!authInfo) {
        this.send_auth_fail(peer, 'NO ID:' + id);
        return
      }

      // Never the key: debug output ends up in shared logs.
      if (serverOption.debug.showAuthInfo) {
        console.log('[debug]showAuthInfo', { id, cid: authInfo.cid, uid: authInfo.uid, role: authInfo.role, quota: authInfo.quota })
      }

      peer.boho.copy_id8(infoPack.id8)
      // type of key
      let authKey;
      const SHA256_HASH_BASE64_LEN = 44
      if (authInfo.key.length == SHA256_HASH_BASE64_LEN) {
        // hashed key
        authKey = Buffer.from(authInfo.key, 'base64')
        peer.boho.copy_key(authKey)
      } else {
        // plain key
        peer.boho.set_key(authInfo.key)
      }

      //3. check hmac
      let auth_res = peer.boho.verify_auth_req(infoPack)
      if (!auth_res) {
        this.send_auth_fail(peer, 'hmac dismatched');
        return
      }

      // A valid proof consumes this challenge even if account policy rejects it.
      // Reauthentication requires a new connection, never a replay-state reset.
      peer._challengeUsed = true;

      //4. role and quota. Checked before a duplicate login replaces the old connection.
      const role = resolveRole(authInfo.role);
      if (role === undefined) {
        this.send_auth_fail(peer, 'unknown auth.role: ' + authInfo.role);
        return
      }
      const quotaName = await this.resolveQuota(authInfo, role);
      const quota = Object.hasOwn(peer.manager.quotas, quotaName) ? peer.manager.quotas[quotaName] : undefined;
      if (!quota) {
        this.send_auth_fail(peer, 'unknown quota: ' + quotaName);
        return
      }
      if (peer._closing) return; // closed while resolving
      const uid = authInfo.uid || null;
      if (uid && quota.maxConnections !== null) {
        // A connection this login replaces (keepNew) frees its place.
        const old = peer.manager.cid2remote.get(authInfo.cid);
        const replaced = old && old !== peer && old.accountUid === uid && this.duplicateLoginFor(peer) === 'keepNew' ? 1 : 0;
        if (peer.manager.accountConnections(uid) - replaced >= quota.maxConnections) {
          this.send_auth_fail(peer, 'too many connections');
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
            this.send_auth_fail(peer, 'duplicate login')
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
      if (peer.cid) {
        // console.log('if peer has cid', peer.cid)
        peer.manager.cid2remote.delete(peer.cid)
      }

      //7. setting info.
      peer.did = id
      peer.cid = authInfo.cid
      peer.nick = authInfo.cid // temporary: nick as cid
      if (authInfo.uid) peer.uid = authInfo.uid

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
      if (this.authLogger) {
        let peerInfo = `OK #${peer.ssid} cid: ${peer.cid} did:${peer.did}`
        if (peer.isAdmin) peerInfo = "#ADMIN# " + peerInfo
        this.authLogger.log(peerInfo)
      }
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
