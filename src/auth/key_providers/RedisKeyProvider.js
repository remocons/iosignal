import Boho from 'boho'
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
  async getAuth(id) {
    try {
      let result = await this.redis.hGetAll(DEVICE_PREFIX + id)
      if (result && result.key) return result
      else return null;
    } catch (error) {
      console.log('getAuth', error)
    }
  }

  //sudoService call
  async getAuthIdList() {
    let result = await this.redis.keys(DEVICE_PREFIX + '*')
    result = result.map(v => {
      return v.split(':')[1]
    })
    if (result) return result
  }

  // add device auth info
  // role and quota are optional (see StringKeyProvider); an omitted one is not stored.
  async addAuth(id, keyStr, cid = '', role, quota) {
    let Base64hashKey = Buffer.from(Boho.sha256.hash(keyStr)).toString('base64')
    const fields = { 'key': Base64hashKey, 'cid': cid }
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
