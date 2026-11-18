// The browser client (iosignal/io), unchanged, for a server inside the browser: local:// URLs
// get a LocalWebSocket through IO's createWebSocket() hook. Other URLs (ws://, wss://) use the
// browser WebSocket as with IO itself, so one class can reach both.
import IO from '../client/browser/IOWebSocket.js'
import { LocalWebSocket } from './LocalWebSocket.js'
import { SCHEME } from './transport.js'

export class LocalIO extends IO {
  createWebSocket(url) {
    return String(url).startsWith(SCHEME) ? new LocalWebSocket(url) : super.createWebSocket(url)
  }
}

export { IO, LocalWebSocket }
export default LocalIO
