import { STATUS } from './constant.js'
import { hasRole } from '../auth/BohoAuth.js'

export const commands = [
  'cid', 'remotes', 'clients',
  'channels', 'subscribers',
  'remote', 'client', 'close',
  'addauth', 'getauth', 'delauth',
  'getauthidlist', 'getdevicelist',
  'adddevice', 'getdevice', 'deldevice'
]

// Only a connection authenticated with role 'admin'.
export function checkPermission(remote) {
  return hasRole(remote, 'admin');
}

export async function call(remote, req) {
  let result;
  let status = 0;
  try {
    let cmd = req.topic;
    cmd = cmd.toLowerCase()
    if (cmd == 'cid') {
      result = remote.manager.metrics.getCIdList()
    } else if (cmd == 'remotes' || cmd == 'clients') {
      result = remote.manager.metrics.getRemotes()
    } else if (cmd == 'channels') {
      result = remote.manager.metrics.getChannelList()
    } else if (cmd == 'subscribers') {
      let ch = req.$[0]
      if (ch) result = remote.manager.metrics.getSubscribers(ch)
    } else if (cmd == 'remote' || cmd == 'client') {
      let cid = req.$[0]
      let mode = req.$[1]
      if (cid) result = remote.manager.metrics.getRemoteByCId(cid, mode)

    } else if (cmd == 'close') {
      if (req.$[0]) result = remote.manager.closeRemoteByCId(req.$[0])

    } else if (cmd == 'addauth' || cmd == 'adddevice') {
      // did, key, cid[, role[, quota]]
      if (remote.manager.authManager && req.$.length >= 3 && req.$.length <= 5) {
        if (remote.manager.authManager.addAuth) {
          const [did, dkey, cid, role, quota] = req.$
          result = await remote.manager.authManager.addAuth(did, dkey, cid, role, quota)
        }

      }
    } else if (cmd == 'delauth' || cmd == 'deldevice') {
      if (remote.manager.authManager && req.$.length == 1) {
        if (remote.manager.authManager.delAuth) {
          let did = req.$[0]
          result = await remote.manager.authManager.delAuth(did)
        }
      }
    } else if (cmd == 'getauth' || cmd == 'getdevice') {
      if (remote.manager.authManager && req.$.length == 1) {
        if (remote.manager.authManager.getAuth) {
          let did = req.$[0]
          result = await remote.manager.authManager.getAuth(did)
        }
      }
    } else if (cmd == 'getauthidlist' || cmd == 'getdevicelist') {
      if (remote.manager.authManager) {
        if (remote.manager.authManager.getAuthIdList) {
          result = await remote.manager.authManager.getAuthIdList()
        }
      }
    } else {
      status = STATUS.ERROR;
      result = "service sudo: no such a cmd: " + cmd
    }

    remote.response(req.mid, status, result)

  } catch (e) {
    remote.response(req.mid, STATUS.ERROR, e.message)
  }

}



