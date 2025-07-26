import { STATUS } from './api_constant.js'

const MIN_LEVEL = 200;
const COMMANDS = [
  'GET', 'SET',
  'HGETALL', 'HGET',
  'HSET', 'SADD',
  'SISMEMBER', 'SMEMBERS',
  'EXISTS', 'SREM',
  'DEL', 'KEYS',
  'SAVE'
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
    console.log('checkPermission', remote.level, 'vs', this.minLevel)
    if (remote.level >= this.minLevel) {
      return true
    } else {
      return false
    }
  }


  async request(remote, req) {

    let result;
    let status = STATUS.OK;
    try {
      let cmd = req.topic
      cmd = cmd.toUpperCase()
      if (COMMANDS.includes(cmd)) {
        console.log('RedisAPI call:', cmd, req.args)

        if (req.args.length > 0) {
          result = await this.redisClient[cmd](...req.args)
        } else {
          result = await this.redisClient[cmd]()
        }


      } else {
        status = STATUS.ERROR;
      }
      remote.response(req.mid, status, result)
    } catch (e) {
      remote.response(req.mid, STATUS.ERROR, e.message)
    }

  }

}



