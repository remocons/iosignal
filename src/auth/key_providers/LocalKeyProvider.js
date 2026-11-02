/**
 * LocalKeyProvider.js
 *
 * Key provider for local testing: no key list, every non-empty ID logs in with its own ID as CID.
 *
 *  mode 'idKey':     the key equals the ID, e.g. io.auth('dev1', 'dev1').
 *  mode 'sharedKey': any ID with the one shared key, e.g. io.auth('dev1', 'lab2026').
 *  role:  role of every login, default 'device' ('service' or 'admin' must be asked for).
 *  quota: Server quotas profile of every login, default from BohoAuth resolveQuota.
 *
 * example => new BohoAuth(new LocalKeyProvider({ mode: 'sharedKey', key: 'lab2026' }))
 *
 * Anyone who knows the rule logs in under any ID, so use it only on a trusted local network.
 */

import Boho from 'boho'
import { ROLES } from '../BohoAuth.js'

const MODES = ['idKey', 'sharedKey']
const hashKey = keyStr => Buffer.from(Boho.sha256.hash(keyStr)).toString('base64')

export class LocalKeyProvider {
  /**
   * @param {'idKey' | { mode: 'idKey' | 'sharedKey', key?: string,
   *   role?: 'device' | 'service' | 'admin', quota?: string }} options
   *   A string is the mode alone.
   */
  constructor(options) {
    const { mode, key, role = 'device', quota } = typeof options === 'string' ? { mode: options } : (options ?? {})
    if (!MODES.includes(mode)) {
      throw new TypeError(`LocalKeyProvider mode must be one of: ${MODES.join(', ')}`)
    }
    if (mode === 'sharedKey' && (typeof key !== 'string' || key.length === 0)) {
      throw new TypeError("LocalKeyProvider mode 'sharedKey' needs a non-empty key")
    }
    if (quota !== undefined && (typeof quota !== 'string' || !quota)) {
      throw new TypeError('LocalKeyProvider quota must be a quotas profile name')
    }
    if (!ROLES.includes(role) || role === 'anonymous') {
      throw new RangeError(`LocalKeyProvider role must be one of: ${ROLES.slice(1).join(', ')}`)
    }
    this.mode = mode
    this.role = role
    this.quota = quota
    // Hashed like StringKeyProvider, so a 44-character shared key is not mistaken for a stored hash.
    this.sharedKeyHash = mode === 'sharedKey' ? hashKey(key) : null
  }

  async getAuth(id) {
    if (!id) return undefined
    return {
      key: this.sharedKeyHash ?? hashKey(id),
      cid: id,
      role: this.role,
      ...(this.quota && { quota: this.quota })
    }
  }
}
