/**
 * LocalKeyProvider.js
 *
 * Key provider for local testing: no key list, every non-empty ID logs in with its own ID as CID.
 *
 *  mode 'idKey':     the key equals the ID, e.g. io.auth('dev1', 'dev1').
 *  mode 'sharedKey': any ID with the one shared key, e.g. io.auth('dev1', 'lab2026').
 *  level: quota level of every login (a quotaTable index), default serverOption.defaultQuotaIndex.
 *
 * example => new BohoAuth(new LocalKeyProvider({ mode: 'sharedKey', key: 'lab2026' }))
 *
 * Anyone who knows the rule logs in under any ID, so use it only on a trusted local network.
 */

import Boho from 'boho'
import { serverOption } from '../../server/serverOption.js'
import { quotaTable } from '../../common/quotaTable.js'

const MODES = ['idKey', 'sharedKey']
const hashKey = keyStr => Buffer.from(Boho.sha256.hash(keyStr)).toString('base64')

export class LocalKeyProvider {
  /**
   * @param {'idKey' | { mode: 'idKey' | 'sharedKey', key?: string, level?: number }} options
   *   A string is the mode alone.
   */
  constructor(options) {
    const { mode, key, level } = typeof options === 'string' ? { mode: options } : (options ?? {})
    if (!MODES.includes(mode)) {
      throw new TypeError(`LocalKeyProvider mode must be one of: ${MODES.join(', ')}`)
    }
    if (mode === 'sharedKey' && (typeof key !== 'string' || key.length === 0)) {
      throw new TypeError("LocalKeyProvider mode 'sharedKey' needs a non-empty key")
    }
    // BohoAuth fails every login whose level has no quotaTable entry, so reject it here instead.
    if (level !== undefined && !(Number.isInteger(level) && quotaTable[level])) {
      throw new RangeError(`LocalKeyProvider level must be a quotaTable index: ${Object.keys(quotaTable).join(', ')}`)
    }
    this.mode = mode
    this.level = level
    // Hashed like StringKeyProvider, so a 44-character shared key is not mistaken for a stored hash.
    this.sharedKeyHash = mode === 'sharedKey' ? hashKey(key) : null
  }

  async getAuth(id) {
    if (!id) return undefined
    return {
      key: this.sharedKeyHash ?? hashKey(id),
      cid: id,
      level: this.level ?? serverOption.defaultQuotaIndex
    }
  }
}
