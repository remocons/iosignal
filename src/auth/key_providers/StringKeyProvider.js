/**
 * StringKeyProvider.js
 * 
 * authInfo <String>
 *  id: max 8chars
 *  key: ~44 base64 chars recomended
 *  cid: 
 *  level: range: 0~255
 *  separator: ',' for multiple devices.
 * 
 * example => authInfo = 'id1.key1.cid1.255,id2.key2.cid2.200'
 */

import Boho from 'boho'

export class StringKeyProvider {
  constructor(authInfo) {

    if (!authInfo) {
      throw TypeError("StringKeyProvider constructor() missing authInfo.")
    }

    let id_keys = authInfo.split(',')

    this.AUTH = new Map();

    if (id_keys.length >= 1) {
      id_keys.forEach(v => {
        let [ did, key, cid, level ]  = v.split('.')
        level = parseInt(level)
        if (did && key && cid && typeof level == 'number') {
          this.addAuth(did, key, cid, level)
        } else {
          throw TypeError("StringKeyProvider invalid authInfo.")
        }
      })
    } else {
      throw TypeError("StringKeyProvider invalid authInfo.")
    }

  }

  async getAuth(id) {
    return this.AUTH.get(id)
  }
  async getAuthIdList() {
    return Array.from(this.AUTH.keys())
  }

  addAuth(id, keyStr, cid, level = 0) {
    let Base64hashKey = Buffer.from(Boho.sha256.hash(keyStr)).toString('base64')
    this.AUTH.set(id, { key: Base64hashKey, cid: cid, level: level })
  }
}
