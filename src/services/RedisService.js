/**
 * RedisService <IOSignal RPC Service>
 * 
 * iosignal 클라이언트의 redis 질의 요청을 받으면, 
 * redisClient 로 연결된 redis-server 에게 질의 후 결과를 되돌려 준다. 
 * 
 * client ex:  
 * await io.call('redis','hget','user:id' )
 * 
 */
import { STATUS } from './constant.js'
import { ROLES, hasRole } from '../auth/BohoAuth.js'

// KEYS stays for older clients; new ones list keys with SCAN (RedisKeyProvider.scanKeys).
const COMMANDS = [
  'GET', 'SET', 'HGETALL', 'HGET', 'HSET', 'SADD', 'SISMEMBER',
  'SMEMBERS', 'EXISTS', 'SREM', 'DEL', 'KEYS', 'SCAN', 'SAVE',
  'LPUSH', 'LTRIM', 'LRANGE', 'LINDEX', 'LSET', 'EXPIRE',
  'get', 'set', 'hGetAll', 'hGet', 'hSet', 'sAdd', 'sIsMember',
  'sMembers', 'exists', 'sRem', 'del', 'keys', 'scan', 'save',
  'lPush', 'lTrim', 'lRange', 'lIndex', 'lSet', 'expire'
]

export class RedisService {
  /**
   * @param {object} redisClient
   * @param {'anonymous' | 'device' | 'service' | 'admin'} [minRole='service'] lowest role allowed;
   *   'anonymous' allows every connection.
   */
  constructor(redisClient, minRole = 'service') {
    if (!redisClient) {
      throw new Error("RedisService constructor: no redisClient")
    }
    if (!ROLES.includes(minRole)) throw new RangeError(`minRole must be one of: ${ROLES.join(', ')}`)
    this.redisClient = redisClient
    this.minRole = minRole
    this.commands = COMMANDS
  }

  checkPermission(remote, req) {
    return hasRole(remote, this.minRole);
  }

  async call(remote, req) {
    let result;
    try {
      let cmd = req.topic
      if (req.args?.length > 0) {
        result = await this.redisClient[cmd](...req.args)
      } else {
        result = await this.redisClient[cmd]()
      }
      remote.response(req.mid, STATUS.OK, result)
    } catch (e) {
      remote.response(req.mid, STATUS.ERROR, e.message)
    }
  }

}



