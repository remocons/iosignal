
/**
 * simple IOSignal API example.
 */

import { STATUS } from './api_constant.js'
export const commands = ['echo', 'date', 'unixtime'];

const MIN_LEVEL = 0;
export function checkPermission(remote) {
  return (remote.level >= MIN_LEVEL) ? true : false;
}

/**
 * client api call example:  await io.req('reply','echo','hello')
 */
export async function echo(remote, req) {
  if (!req.args)
    remote.response(req.mid, STATUS.ERROR, 'no message to echo')
  else
    remote.response(req.mid, STATUS.OK, req.args)
}

/**
 * client api call example:  await io.req('reply','date')
 */
export async function date(remote, req) {
  let r = new Date().toUTCString()
  remote.response(req.mid, STATUS.OK, r)
}

/**
 * client api call example:  await io.req('reply','unixtime')
 */
export async function unixtime(remote, req) {
  let r = Math.floor(Date.now() / 1000)
  remote.response(req.mid, STATUS.OK, r)
}

