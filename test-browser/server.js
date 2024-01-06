import { Server, serverOption } from 'iosignal'

serverOption.showMetric = 2;
serverOption.showMessage = 'message';
const server = new Server( serverOption )

console.log( 'serverOption:', serverOption )

