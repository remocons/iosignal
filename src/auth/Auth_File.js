import { BohoAuth } from './BohoAuth.js';
import { readFileSync } from 'fs'
import Boho from 'boho'
import path from 'path'

export class Auth_File extends BohoAuth {
  constructor(_path) {
    super()
    this.AUTH = new Map();
    let pathObj = path.parse(_path)
    this.path = path.resolve(_path)
    console.log('auth from file path:', this.path)
    let ext = pathObj.ext;
    if (ext.toLowerCase() == '.js') {
      // Read auth data from file
      console.log("#JS path:", this.path);
      this.loadAuthInfoFile_JS(this.path)
    } else if (ext.toLowerCase() == '.json') {
      console.log("#JSON path:", this.path);
      this.loadAuthInfoFile_JSON(this.path)
    } else {
      console.log('no authinfofile path.')
    }
  }


  async getAuth(id) {
    return this.AUTH.get(id)
  }

  async getAuthIdList() {
    return Array.from(this.AUTH.keys())
  }

  //loaded when server start.
  loadAuthInfoFile_JS(path) {

    import(path).then((file) => {

      console.log(file.authInfo);
      file.authInfo.forEach(item => {
        this.addAuth(...item)
      })
      console.log('total AUTH INFO size: ', this.AUTH.size)
    }).catch(e => {
      console.log(e)
    })


  }

  loadAuthInfoFile_JSON(path) {
    let file = readFileSync(path)
    file = new TextDecoder().decode(file)
    let list = JSON.parse(file)
    list.forEach(item => {
      this.addAuth(...item)
    })
    console.log('total AUTH INFO size: ', this.AUTH.size)

  }

  addAuth(id, keyStr, cid, level = 0) {
    let Base64hashKey = Buffer.from(Boho.sha256.hash(keyStr)).toString('base64')
    this.AUTH.set(id, { key: Base64hashKey, cid: cid, level: level })
  }



}

