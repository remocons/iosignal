/**
 * RedisAPI <IOSignal API>
 * 
 * iosignal 클라이언트의 redis 질의 요청을 받으면, 
 * redisClient 로 연결된 redis-server 에게 질의 후 결과를 되돌려 준다. 
 * 
 * client ex:  
 * await io.req('redis','hget','user:id' )
 * 
 */
import { STATUS } from './api_constant.js'

const MIN_LEVEL = 200;
const COMMANDS = [
  'GET', 'SET', 'HGETALL', 'HGET', 'HSET', 'SADD', 'SISMEMBER',
  'SMEMBERS', 'EXISTS', 'SREM', 'DEL', 'KEYS', 'SAVE',
  'get', 'set', 'hGetAll', 'hGet', 'hSet', 'sAdd', 'sIsMember',
  'sMembers', 'exists', 'sRem', 'del', 'keys', 'save'
]

export class RedisAPI {
  constructor(redisClient, _minLevel) {
    if (!redisClient) {
      throw new Error("RedisAPI constructor: no redisClient")
    }
    this.redisClient = redisClient
    this.minLevel = _minLevel ? _minLevel : MIN_LEVEL
    this.commands = COMMANDS
  }

  checkPermission(remote, req) {
    return (remote.level >= this.minLevel) ? true : false;
  }

  async request(remote, req) {
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



