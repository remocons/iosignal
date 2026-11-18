// A browser WebSocket look-alike for local:// URLs: what the iosignal/io client uses from
// WebSocket (readyState, binaryType, onopen/onmessage/onerror/onclose, send, close and the
// state constants), carried by the in-browser transport (./transport.js).
import { addressOf, connect } from './transport.js'

export class LocalWebSocket extends EventTarget {
  static CONNECTING = 0
  static OPEN = 1
  static CLOSING = 2
  static CLOSED = 3

  constructor(url) {
    super()
    this.url = String(url)
    this.readyState = 0
    this.binaryType = 'blob'
    this.bufferedAmount = 0
    this.protocol = ''
    this.extensions = ''
    this.onopen = this.onmessage = this.onerror = this.onclose = null
    this.link = null
    connect(addressOf(this.url)).then(
      link => {
        if (this.readyState !== 0) { link.close(1000, 'closed while connecting'); return }
        this.link = link
        link.onframe = frame => this.frame(frame)
        this.readyState = 1
        this.dispatch('open', new Event('open'))
      },
      error => {
        if (this.readyState === 3) return
        this.dispatch('error', Object.assign(new Event('error'), { error }))
        this.finish(1006, error.message)
      })
  }

  get CONNECTING() { return 0 }
  get OPEN() { return 1 }
  get CLOSING() { return 2 }
  get CLOSED() { return 3 }

  frame(frame) {
    switch (frame.t) {
      case 'data': {
        if (this.readyState !== 1) return
        let data = frame.d
        if (data instanceof ArrayBuffer && this.binaryType === 'blob') data = new Blob([data])
        this.dispatch('message', new MessageEvent('message', { data }))
        break
      }
      case 'ping':
        // Browsers answer WebSocket ping frames themselves; so does this socket.
        this.link.post({ t: 'pong' })
        break
      case 'close':
        this.link.dispose()
        this.finish(frame.code ?? 1005, frame.reason ?? '')
        break
    }
  }

  send(data) {
    if (this.readyState === 0) throw new DOMException('Still in CONNECTING state.', 'InvalidStateError')
    if (this.readyState !== 1) return
    let d
    if (typeof data === 'string') d = data
    else {
      const view = data instanceof ArrayBuffer ? new Uint8Array(data)
        : new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
      d = view.slice().buffer
    }
    this.link.post({ t: 'data', d })
  }

  close(code = 1000, reason = '') {
    if (this.readyState >= 2) return
    const link = this.link
    this.readyState = 2
    if (link) link.close(code, reason)
    setTimeout(() => this.finish(code, reason), 0)
  }

  finish(code, reason) {
    if (this.readyState === 3) return
    this.readyState = 3
    this.dispatch('close', Object.assign(new Event('close'), { code, reason, wasClean: code === 1000 }))
  }

  dispatch(type, event) {
    this[`on${type}`]?.(event)
    this.dispatchEvent(event)
  }
}
