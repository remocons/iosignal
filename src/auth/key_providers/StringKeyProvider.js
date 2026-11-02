/**
 * StringKeyProvider.js
 *
 * authInfo <String>: entries 'id.key.cid[.role[.quota]]' separated by ','.
 *  id:    max 8 chars
 *  key:   ~44 base64 chars recommended
 *  cid:   client ID
 *  role:  'device' (default) | 'service' | 'admin'
 *  quota: a Server quotas profile name (default: BohoAuth resolveQuota)
 *
 * example => authInfo = 'id1.key1.cid1.admin,id2.key2.cid2.device.pro'
 */

import Boho from 'boho'
import { ROLES } from '../BohoAuth.js'

const ACCOUNT_ROLES = ROLES.filter(role => role !== 'anonymous')

/** Parses one 'id.key.cid[.role[.quota]]' entry; a malformed one is a TypeError (naming only the id). */
export function parseKeyEntry(entry) {
  const [id, key, cid, role, quota, ...rest] = entry.split('.')
  if (!id || !key || !cid || rest.length > 0 || (role && !ACCOUNT_ROLES.includes(role))) {
    throw new TypeError(`invalid key entry 'id.key.cid[.role[.quota]]' for id: ${id ?? ''}`)
  }
  return { id, key, cid, role: role || undefined, quota: quota || undefined }
}

export class StringKeyProvider {
  constructor(authInfo) {
    if (!authInfo) {
      throw TypeError("StringKeyProvider constructor() missing authInfo.")
    }
    this.AUTH = new Map();
    for (const entry of authInfo.split(',')) {
      const { id, key, cid, role, quota } = parseKeyEntry(entry)
      this.addAuth(id, key, cid, role, quota)
    }
  }

  async getAuth(id) {
    return this.AUTH.get(id)
  }
  async getAuthIdList() {
    return Array.from(this.AUTH.keys())
  }

  addAuth(id, keyStr, cid, role, quota) {
    let Base64hashKey = Buffer.from(Boho.sha256.hash(keyStr)).toString('base64')
    this.AUTH.set(id, { key: Base64hashKey, cid, ...(role && { role }), ...(quota && { quota }) })
  }
}
