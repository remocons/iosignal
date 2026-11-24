import Boho from 'boho'
// The stored key: Boho.deriveKey of the key string (Ascon, 16 bytes), base64. Never the key string.
const storedKey = keyStr => Buffer.from(Boho.deriveKey(keyStr)).toString('base64')
import { checkLoginId } from '../../common/util.js'
const DEVICE_PREFIX = "device:"
// Every device CID in use. The account service picks new CIDs outside it, so a device added here
// is listed too and no member can be given its CID.
const CID_SET = "sets_cid"

export class RedisKeyProvider {
  constructor(redisClient) {
    if (!redisClient) {
      throw new Error("RedisKeyProvider constructor: no redisClient")
    }
    this.redis = redisClient
  }

  // get device key from DB. (for Boho auth.)
  // null: no such device. A Redis failure throws, so BohoAuth closes the connection (the client
  // connects again) instead of answering AUTH_FAIL as if the ID were unknown.
  async getAuth(id) {
    let result = await this.redis.hGetAll(DEVICE_PREFIX + id)
    if (result && result.key) return result
    else return null;
  }

  //sudoService call
  async getAuthIdList() {
    const keys = await this.scanKeys(DEVICE_PREFIX + '*')
    return keys.map(key => key.slice(DEVICE_PREFIX.length))
  }

  // Keys matching pattern, by SCAN: KEYS blocks Redis until it has walked every key.
  // Falls back to KEYS for a client without scan, or a redis-service from before 2026-11-17 that refuses it
  // (RemoteRedisClient throws on a refused command; an undefined reply is treated the same).
  async scanKeys(pattern) {
    if (typeof this.redis.scan === 'function') {
      const keys = new Set() // SCAN may return a key more than once
      let cursor = '0'
      do {
        let reply
        try {
          reply = await this.redis.scan(cursor, { MATCH: pattern, COUNT: 1000 })
        } catch {
          break
        }
        if (!reply || !Array.isArray(reply.keys)) break
        for (const key of reply.keys) keys.add(key)
        cursor = String(reply.cursor)
        if (cursor === '0') return [...keys]
      } while (true)
    }
    return (await this.redis.keys(pattern)) ?? []
  }

  // add device auth info
  // role and quota are optional (see StringKeyProvider); an omitted one is not stored.
  async addAuth(id, keyStr, cid = '', role, quota) {
    checkLoginId(id)
    const fields = { 'key': storedKey(keyStr), 'cid': cid }
    if (role) fields.role = role
    if (quota) fields.quota = quota
    const old = await this.redis.hGet(DEVICE_PREFIX + id, 'cid')
    const result = await this.redis.hSet(DEVICE_PREFIX + id, fields)
    if (old && old !== cid) await this.redis.sRem(CID_SET, old)
    if (cid) await this.redis.sAdd(CID_SET, cid)
    return result
  }

  //sudoService call
  async delAuth(id) {
    const cid = await this.redis.hGet(DEVICE_PREFIX + id, 'cid')
    if (cid) await this.redis.sRem(CID_SET, cid)
    return this.redis.del(DEVICE_PREFIX + id)
  }

  async save(id) {
    return this.redis.save()
  }
}
