import MBP from 'meta-buffer-pack'
import Boho from 'boho'
import { quotaTable } from '../common/quotaTable.js'
import { serverOption } from '../server/serverOption.js'
import { IOMsg, STATE } from '../common/constants.js'
import { FileLogger } from '../server/FileLogger.js'

const decoder = new TextDecoder()
export class BohoAuth {
  constructor(keyProvider) {
    if (!keyProvider) {
      throw new Error('BohoAuth must be initialized with a keyProvider.');
    }
    this.keyProvider = keyProvider;
    this.keepOldConnection = true;
    this.authLogger;
    if (serverOption.fileLogger.auth.use) {
      this.authLogger = new FileLogger(serverOption.fileLogger.auth.path)
      console.log('Auth: begin file logger.[auth]')
    }
  }

  send_auth_fail(peer, reason) {
    if (this.authLogger) {
      let peerInfo = `FAIL #${peer.ssid} reason:${reason} `
      this.authLogger.log(peerInfo)
    }
    // console.log('##### AUTH_FAIL reason: ', reason)
    peer.setState(STATE.AUTH_FAIL)
    // add some delay time.
    setTimeout(e => {
      peer.send(Buffer.from([Boho.BohoMsg.AUTH_FAIL]))
    }, serverOption.auth.delay_auth_fail)
  }


  async verify_auth_hmac(auth_hmac, peer) {
    try {
      //1. unpack 
      let infoPack = MBP.unpack(auth_hmac, Boho.Meta.AUTH_HMAC)
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
      if (!authInfo) {
        this.send_auth_fail(peer, 'NO ID:' + id);
        return
      }

      if (serverOption.debug.showAuthInfo) {
        console.log('[debug]showAuthInfo', authInfo)
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
      let auth_ack = peer.boho.check_auth_hmac(infoPack)
      if (!auth_ack) {
        this.send_auth_fail(peer, 'hmac dismatched');
        return
      }

      //4. get info

      //5. check duplicate login.
      if (peer.manager.cid2remote.has(authInfo.cid)) {
        let old = peer.manager.cid2remote.get(authInfo.cid)
        console.log('[WARN]DUPLICATE_LOGIN detected.', old.cid)
        old.ping(); // check the connection.
        if (old == peer) {
          console.log('## trying to RELOGIN after login.')
          return
        }

        let authClearSignal = MBP.pack(
          MBP.MB('#MsgType', '8', IOMsg.AUTH_CLEAR),
          MBP.MB('#reason', 'duplicate login.')
        )
        if (this.keepOldConnection) { // default true
          // keep old connection. reject new connection by sending auth_fail signal.
          this.send_auth_fail(peer, 'duplicate login')
          // peer.send(authClearSignal)
        } else {
          // accept new connection. stop the old connection by sending auth_clear signal.
          old.send(authClearSignal)
          peer.close()
        }
        return
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

      //8. setting quota level. 
      let quotaLevel = serverOption.defaultQuotaIndex;
      if (authInfo.level) quotaLevel = authInfo.level;
      quotaLevel = parseInt(quotaLevel)
      let newQuota = quotaTable[quotaLevel];
      if (!newQuota) {
        let err = 'no index quotaTable for auth.level: ' + quotaLevel
        this.send_auth_fail(peer, err);
        return
      } else {
        peer.level = quotaLevel;
        peer.quota = newQuota;
      }

      if (peer.level === serverOption.adminLevel) {
        console.log('## LOGIN ADMIN CID:', peer.cid)
        peer.isAdmin = true;
      }
      // send quota.level
      peer.send(Buffer.from([IOMsg.QUOTA_LEVEL, quotaLevel]))

      //9. set cid2remote
      peer.manager.cid2remote.set(peer.cid, peer)
      //10. send ack.
      peer.send(auth_ack)
      peer.setState(STATE.AUTH_ACK)
      if (this.authLogger) {
        let peerInfo = `OK #${peer.ssid} cid: ${peer.cid} did:${peer.did}`
        if (peer.isAdmin) peerInfo = "#ADMIN# " + peerInfo
        this.authLogger.log(peerInfo)
      }
      return authInfo
    } catch (error) {
      console.log('verify_auth_hmac error', error)
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

  async addAuth(id, keyStr, cid, level = 0) {
    if (typeof this.keyProvider.addAuth === 'function') {
      return this.keyProvider.addAuth(id, keyStr, cid, level);
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

