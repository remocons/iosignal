import { Server, Auth_Env } from 'iosignal'

const options = {
  port: 7777,
  showMetric: 2,
  showMessage: 'message'
}
// You can use environment variable BOHO_AUTH

// $ BOHO_AUTH=id1.key1.255,id2.key2.200 node app.js
// process.env.BOHO_AUTH=id1.key1.255,id2.key2.200

// or, as constructor argument.
let authInfo = 'id1.key1.255,id2.key2.200'

let authManager = new Auth_Env(authInfo)
const server = new Server(options, authManager)


