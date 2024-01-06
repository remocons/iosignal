import { Server, serverOption ,api_sudo , Auth_Env } from 'iosignal'
serverOption.showMessage = 'message';

//  authManager
serverOption.port = 7777
let authManager = new Auth_Env('admin.adminkey.255')
const rs = new Server( serverOption ,authManager )
// api  response module
rs.api('sudo', api_sudo )

// console.log( 'serverOption:', serverOption )