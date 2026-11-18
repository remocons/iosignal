// Stands in for the 'ws' package when the shared Server.js runs in a browser.
//
// new Server({ port: 7700 }) makes `new WebSocketServer({ port, path })`; here that listens on
// local://7700 (../transport.js) instead of a TCP port. Each connection is a ServerSocket
// with the parts of the ws WebSocket API that Manager/Remote use: on('message' | 'ping' | 'pong'),
// onclose, send, ping, pong, close, terminate, readyState, bufferedAmount, removeAllListeners.
//
// For the message log (src/server/monitor.js) the server emits 'local:*' events around the
// work it hands to IOSignal, so a monitor can tell which delivery a message caused.
import EventEmitter from 'events'
import { listen } from '../transport.js'

// Connections from this browser look like a private network peer: HOME_CHANNEL 'PRIVATE:'.
const LOCAL_ADDRESS = '127.0.0.1'

export class ServerSocket extends EventEmitter {
  static CONNECTING = 0
  static OPEN = 1
  static CLOSING = 2
  static CLOSED = 3

  constructor(link, wss, info) {
    super()
    this.link = link
    this.wss = wss
    this.transport = info.transport
    this.readyState = 1
    this.bufferedAmount = 0
    this.bytesWritten = 0
    this.bytesRead = 0
    this.onclose = null
    link.onframe = frame => this.frame(frame)
  }

  frame(frame) {
    switch (frame.t) {
      case 'data': {
        if (this.readyState !== 1) return
        const isBinary = typeof frame.d !== 'string'
        const data = isBinary ? Buffer.from(frame.d) : Buffer.from(frame.d, 'utf8')
        this.bytesRead += data.byteLength
        this.wss.around('rx', this, data, isBinary, () => this.emit('message', data, isBinary))
        break
      }
      case 'ping':
        this.link.post({ t: 'pong' })
        this.emit('ping')
        break
      case 'pong':
        this.emit('pong')
        break
      case 'close':
        this.link.dispose()
        this.finish(frame.code ?? 1005, frame.reason ?? '')
        break
    }
  }

  send(data, options, callback) {
    if (typeof options === 'function') { callback = options; options = undefined }
    if (this.readyState !== 1) return
    let d
    if (typeof data === 'string' || options?.binary === false) {
      d = typeof data === 'string' ? data : new TextDecoder().decode(data)
    } else {
      // A copy of exactly these bytes (a Buffer may be a view into a larger pool).
      const view = data instanceof ArrayBuffer ? new Uint8Array(data) : data
      const copy = new Uint8Array(view.byteLength)
      copy.set(view)
      d = copy.buffer
      this.bytesWritten += copy.byteLength
    }
    this.wss.emit('local:tx', this, data)
    this.link.post({ t: 'data', d })
    callback?.()
  }

  ping() { if (this.readyState === 1) this.link.post({ t: 'ping' }) }
  pong() { if (this.readyState === 1) this.link.post({ t: 'pong' }) }

  close(code = 1000, reason = '') {
    if (this.readyState >= 2) return
    this.readyState = 2
    this.link.close(code, reason)
    setTimeout(() => this.finish(code, reason), 0)
  }

  terminate() {
    if (this.readyState === 3) return
    this.readyState = 2
    this.link.close(1006, '')
    setTimeout(() => this.finish(1006, ''), 0)
  }

  finish(code, reason) {
    if (this.readyState === 3) return
    this.readyState = 3
    this.wss.clients.delete(this)
    this.wss.around('close', this, code, reason, () => {
      this.emit('close', code, reason)
      this.onclose?.({ code, reason, target: this })
    })
  }
}

export class WebSocketServer extends EventEmitter {
  constructor(options = {}) {
    super()
    if (options.server) throw new Error('WebSocketServer({ server }) is not available in the browser: use { port }')
    this.options = options
    this.clients = new Set()
    this.stopListening = null
    this.closed = false
    const port = options.port === 0 ? 1 + Math.floor(Math.random() * 65534) : options.port
    this._port = port
    this.address_ = String(port) + (options.path ? '/' + String(options.path).replace(/^\/+|\/+$/g, '') : '')
    listen(this.address_, (link, info) => this.accept(link, info))
      .then(stop => {
        if (this.closed) { stop(); return }
        this.stopListening = stop
        this.emit('listening')
      })
      .catch(error => this.emit('error', error))
  }

  /** The URL clients connect to, e.g. 'local://7700'. */
  get url() {
    return 'local://' + this.address_
  }

  address() {
    return { port: this._port, address: this.url, family: 'local' }
  }

  accept(link, info) {
    const socket = new ServerSocket(link, this, info)
    this.clients.add(socket)
    const req = {
      headers: { origin: globalThis.location?.origin ?? '' },
      socket: { remoteAddress: LOCAL_ADDRESS },
      url: '/' + (this.options.path ?? '')
    }
    this.around('connection', socket, req, info, () => this.emit('connection', socket, req))
  }

  // Runs fn between 'local:<kind>' and 'local:<kind>:end' events (for the monitor).
  around(kind, socket, a, b, fn) {
    this.emit('local:' + kind, socket, a, b)
    try {
      fn()
    } finally {
      this.emit('local:' + kind + ':end', socket)
    }
  }

  close(callback) {
    this.closed = true
    this.stopListening?.()
    this.stopListening = null
    for (const socket of [...this.clients]) socket.terminate()
    setTimeout(() => { this.emit('close'); callback?.() }, 0)
  }
}

export const WebSocket = ServerSocket
export default { WebSocketServer, WebSocket }
