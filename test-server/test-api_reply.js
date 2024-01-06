import { Server, serverOption ,api_reply  } from 'iosignal'
serverOption.showMessage = 'message';

// no authManager
serverOption.port = 7777
const rs = new Server( serverOption  )
// api  response module
rs.api('reply', api_reply)

// console.log( 'serverOption:', serverOption )