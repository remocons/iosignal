// In-browser transport: a "link" is one connection between a client socket and the server.
//
//  - Same page (same JavaScript realm): a MessageChannel. The client finds the server in a
//    registry on globalThis and hands it one port.
//  - Another tab or window of the same origin: BroadcastChannel. The client asks on the
//    server's lobby channel, then both ends talk on a channel named after the connection.
//
// Frames are small objects:
//   { t: 'open' }                         server -> client: accepted
//   { t: 'data', d: ArrayBuffer|string }  either way: one WebSocket-like message
//   { t: 'ping' } / { t: 'pong' }         control frames (like WebSocket ping/pong)
//   { t: 'close', code, reason }          either way: the connection is over

export const SCHEME = 'local:'
const PREFIX = 'iosignal-local:'
const REGISTRY = Symbol.for('iosignal-local.servers')
const OPEN_TIMEOUT_MS = 1500

/** Servers listening in this realm: address -> { accept(link, info) }. */
export function registry() {
  return globalThis[REGISTRY] ??= new Map()
}

/** 'local://7700' or 'local://7700/path' -> '7700' or '7700/path' (a '?query' is not part of it). */
export function addressOf(url) {
  const text = String(url)
  if (!text.startsWith(SCHEME + '//')) throw new TypeError(`not a ${SCHEME}// URL: ${text}`)
  return text.slice(SCHEME.length + 2).split('?')[0].replace(/\/+$/, '')
}

/**
 * Connection options in the URL query: 'local://7700?ip=203.0.113.20' connects as if from that
 * address, which decides the connection's home channel ('#' tags). Without it, 127.0.0.1.
 */
export function optionsOf(url) {
  const query = String(url).split('?')[1] ?? ''
  const ip = new URLSearchParams(query).get('ip')
  return ip && ip.length <= 64 ? { ip } : {}
}

export function lobbyName(address) {
  return PREFIX + address
}

// Every open link, so a closing page can tell the other ends (pagehide).
const openLinks = new Set()
if (typeof addEventListener === 'function' && typeof window !== 'undefined') {
  addEventListener('pagehide', () => {
    for (const link of [...openLinks]) link.close(1001, 'page closed')
  })
}

class Link {
  constructor(kind) {
    this.kind = kind      // 'MessageChannel' | 'BroadcastChannel'
    this.onframe = null
    this.closed = false
    openLinks.add(this)
  }

  receive(frame) {
    if (this.closed || !frame || typeof frame.t !== 'string') return
    this.onframe?.(frame)
  }

  /** Sends a close frame and stops; the local side is told by its own caller. */
  close(code = 1000, reason = '') {
    if (this.closed) return
    this.post({ t: 'close', code, reason })
    this.dispose()
  }

  dispose() {
    this.closed = true
    openLinks.delete(this)
  }
}

export class PortLink extends Link {
  constructor(port) {
    super('MessageChannel')
    this.port = port
    port.onmessage = e => this.receive(e.data)
  }

  post(frame) {
    if (this.closed) return
    const transfer = frame.d instanceof ArrayBuffer ? [frame.d] : []
    this.port.postMessage(frame, transfer)
  }

  dispose() {
    if (this.closed) return
    super.dispose()
    this.port.onmessage = null
    // Frames already posted (the close frame) are on their way; close the port after them.
    setTimeout(() => this.port.close(), 0)
  }
}

export class ChannelLink extends Link {
  // side: 'c' (client) or 's' (server). Both ends listen on one channel, so each frame says
  // who sent it and an end ignores its own kind (a BroadcastChannel never echoes to itself,
  // but a second listener of the same side could exist after a reload).
  constructor(name, side) {
    super('BroadcastChannel')
    this.side = side
    this.channel = new BroadcastChannel(name)
    this.channel.onmessage = e => {
      if (e.data?.from !== this.side) this.receive(e.data)
    }
  }

  post(frame) {
    if (this.closed) return
    this.channel.postMessage({ ...frame, from: this.side })
  }

  dispose() {
    if (this.closed) return
    super.dispose()
    this.channel.onmessage = null
    this.channel.close()
  }
}

/**
 * Client side: connects to the server at `address`. Resolves with a link once the server has
 * accepted it, rejects when no server answers.
 */
export function connect(address, { ip } = {}) {
  const server = registry().get(address)
  if (server) {
    const { port1, port2 } = new MessageChannel()
    const link = new PortLink(port1)
    // Accept on a later task, as a network connection would open.
    setTimeout(() => server.accept(new PortLink(port2), { transport: 'MessageChannel', ip }), 0)
    return awaitOpen(link)
  }
  if (typeof BroadcastChannel !== 'function') {
    return Promise.reject(new Error(`no server at ${SCHEME}//${address}`))
  }
  const id = globalThis.crypto.randomUUID()
  const link = new ChannelLink(`${lobbyName(address)}:${id}`, 'c')
  const lobby = new BroadcastChannel(lobbyName(address))
  lobby.postMessage({ t: 'connect', id, ip })
  lobby.close()
  return awaitOpen(link)
}

function awaitOpen(link) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      link.onframe = null
      link.dispose()
      reject(new Error('no server answered'))
    }, OPEN_TIMEOUT_MS)
    link.onframe = frame => {
      if (frame.t !== 'open') return
      clearTimeout(timer)
      link.onframe = null
      resolve(link)
    }
  })
}

/**
 * Server side: accepts connections at `address` from this page (MessageChannel) and from other
 * tabs (BroadcastChannel). onLink(link, info) is called for each new connection.
 * Resolves with a stop() function; rejects with an EADDRINUSE error when another server, in this
 * page or another tab, already uses the address.
 */
export async function listen(address, onLink) {
  const servers = registry()
  if (servers.has(address)) throw addressInUse(address)

  // One server per address across tabs (Web Locks, when available).
  let releaseLock = null
  if (globalThis.navigator?.locks) {
    releaseLock = await new Promise((resolve, reject) => {
      globalThis.navigator.locks.request(lobbyName(address), { ifAvailable: true }, lock => {
        if (!lock) { reject(addressInUse(address)); return }
        return new Promise(release => resolve(release))
      }).catch(reject)
    })
  }
  if (servers.has(address)) { releaseLock?.(); throw addressInUse(address) }

  const accept = (link, info) => {
    link.post({ t: 'open' })
    onLink(link, info)
  }
  servers.set(address, { accept })

  let lobby = null
  if (typeof BroadcastChannel === 'function') {
    lobby = new BroadcastChannel(lobbyName(address))
    lobby.onmessage = e => {
      const { t, id, ip } = e.data ?? {}
      if (t !== 'connect' || typeof id !== 'string' || id.length > 64) return
      const from = typeof ip === 'string' && ip.length <= 64 ? ip : undefined
      accept(new ChannelLink(`${lobbyName(address)}:${id}`, 's'), { transport: 'BroadcastChannel', ip: from })
    }
  }

  return function stop() {
    if (servers.get(address)?.accept === accept) servers.delete(address)
    if (lobby) { lobby.onmessage = null; lobby.close() }
    releaseLock?.()
  }
}

function addressInUse(address) {
  const error = new Error(`listen EADDRINUSE: ${SCHEME}//${address}`)
  error.code = 'EADDRINUSE'
  error.syscall = 'listen'
  return error
}
