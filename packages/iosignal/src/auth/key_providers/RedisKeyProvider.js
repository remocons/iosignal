import Boho from 'boho'
const DEVICE_PREFIX = "device:"

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
  async addAuth(id, keyStr, cid = '', level = 0) {
    let Base64hashKey = Buffer.from(Boho.sha256.hash(keyStr)).toString('base64')
    return this.redis.hSet(DEVICE_PREFIX + id, { 'key': Base64hashKey, 'cid': cid, 'level': level })
  }

  //sudoService call
  async delAuth(id) {
    return this.redis.del(DEVICE_PREFIX + id)
  }

  async save(id) {
    return this.redis.save()
  }
}
