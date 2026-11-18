// Message log of an in-page server: watches the transport (./env/ws.js) around each message
// IOSignal handles and turns what went in and what went out into log entries.
// Only reads; the server's behaviour does not depend on it.
import MBP from 'meta-buffer-pack'
import Boho from 'boho'
import { IOMsg } from '../common/constants.js'
import { decodeSignalArgs } from '../common/payload.js'

const decoder = new TextDecoder()

/**
 * Entry: { at, type, from, tag?, args?, to?, note? }
 *   type: 'connect' | 'cid' | 'subscribe' | 'unsubscribe' | 'signal' | 'host' | 'disconnect' | 'auth' | 'other'
 *   from / to[i]: { ssid, cid, transport }; to[i].tag is the tag as delivered.
 *   'host': signals a server.host() (or the server itself) sent outside a client's message, one
 *   entry per tag and turn of the event loop; from: { host: name } ('server' when unknown).
 * Returns a function that stops the monitor.
 */
export function attachMonitor(server, onEntry, { showPing = false } = {}) {
  const wss = server.wss
  const remotes = new WeakMap()
  const stack = []

  const remoteOf = socket => {
    let remote = remotes.get(socket)
    if (!remote) {
      for (const r of server.manager.remotes) if (r.socket === socket) { remote = r; break }
      if (remote) remotes.set(socket, remote)
    }
    return remote
  }
  const who = socket => {
    const r = remoteOf(socket)
    return { ssid: r?.ssid ?? null, cid: r?.cid || '', transport: socket.transport }
  }
  const emit = entry => onEntry({ at: Date.now(), ...entry })

  // Sends outside any client message (host loops, host.to()): grouped per tag until the turn ends.
  let pending = null
  const flush = () => {
    const batch = pending
    pending = null
    for (const { signal, to } of batch.values()) {
      const entry = server.manager.hosts.size ? server.manager.hosts.match(signal.tag) : null
      emit({ type: 'host', from: { host: entry?.host.name ?? 'server' }, tag: signal.tag, args: signal.args, to })
    }
  }
  const outside = (socket, data) => {
    if (data[0] !== IOMsg.SIGNAL && data[0] !== IOMsg.SIGNAL_E2E) return
    const signal = readSignal(data)
    if (!pending) { pending = new Map(); setTimeout(flush, 0) }
    const key = signal.tag.startsWith('@') ? signal.tag + ' ' + signal.args : signal.tag
    if (!pending.has(key)) pending.set(key, { signal, to: [] })
    pending.get(key).to.push({ ...who(socket), tag: signal.tag })
  }

  const handlers = {
    'local:connection': socket => stack.push({ kind: 'connection', socket, out: [] }),
    'local:connection:end': () => {
      const ctx = stack.pop()
      emit({ type: 'connect', from: who(ctx.socket), note: ctx.socket.transport })
    },
    'local:rx': (socket, data, isBinary) => stack.push({ kind: 'rx', socket, data, isBinary, out: [], from: who(socket) }),
    'local:rx:end': () => {
      const ctx = stack.pop()
      const entry = describeRx(ctx, who, showPing, server)
      if (!entry) return
      const { hostSent, ...first } = entry
      emit(first)
      // What a host sent while handling this input (its publish or to()): its own entries.
      for (const d of hostSent ?? []) emit(d)
    },
    'local:close': (socket, code, reason) => stack.push({ kind: 'close', socket, code, reason, out: [], from: who(socket) }),
    'local:close:end': () => {
      const ctx = stack.pop()
      emit({ type: 'disconnect', from: ctx.from, note: `code ${ctx.code}${ctx.reason ? ' ' + ctx.reason : ''}` })
      // The server tells '<cid>@$state' subscribers that the connection closed.
      for (const d of deliveries(ctx.out, who)) emit({ type: 'signal', from: { ...ctx.from, server: true }, ...d.signal, to: [d.to] })
    },
    'local:tx': (socket, data) => {
      const ctx = stack.at(-1)
      if (ctx) ctx.out.push({ socket, data })
      else outside(socket, data)
    }
  }
  for (const [event, fn] of Object.entries(handlers)) wss.on(event, fn)
  return () => { for (const [event, fn] of Object.entries(handlers)) wss.off(event, fn) }
}

function tagOf(data) {
  return decoder.decode(data.subarray(2, 2 + data[1]))
}

// A SIGNAL message: its tag and a short form of its arguments.
export function readSignal(data) {
  const tag = tagOf(data)
  if (data[0] === IOMsg.SIGNAL_E2E) return { tag, args: '(end-to-end encrypted)' }
  const payloadType = data[2 + data[1]]
  let args
  try {
    const values = decodeSignalArgs(payloadType, data.subarray(3 + data[1]))
    args = values === null ? `(payload type ${payloadType})` : values.map(v => summarize(v)).join(', ')
  } catch {
    args = '(malformed payload)'
  }
  return { tag, args }
}

export function summarize(value, max = 80) {
  let text
  if (value instanceof Uint8Array || value instanceof ArrayBuffer) return `<${value.byteLength} bytes>`
  if (typeof value === 'string') text = JSON.stringify(value)
  else {
    try { text = JSON.stringify(value) } catch { text = String(value) }
  }
  return text.length > max ? text.slice(0, max - 1) + '…' : text
}

// Signals the server sent while handling one message: to whom, with which tag.
function deliveries(out, who) {
  return out
    .filter(({ data }) => data[0] === IOMsg.SIGNAL || data[0] === IOMsg.SIGNAL_E2E)
    .map(({ socket, data }) => {
      const signal = readSignal(data)
      return { signal, to: { ...who(socket), tag: signal.tag } }
    })
}

function describeRx(ctx, who, showPing, server) {
  const { data, isBinary, from, out } = ctx
  if (!isBinary) return { type: 'other', from, note: 'text message ' + summarize(decoder.decode(data)) }
  const type = data[0]
  switch (type) {
    case IOMsg.PING:
    case IOMsg.PONG:
      return showPing ? { type: 'other', from, note: IOMsg[type] } : null
    case IOMsg.CID_REQ: {
      const res = out.find(o => o.data[0] === IOMsg.CID_RES)
      // CID_RES: the type byte, then the CID as text.
      const cid = res ? decoder.decode(res.data.subarray(1)) : ''
      return { type: 'cid', from: { ...from, cid: cid || from.cid }, note: cid ? `CID ${cid}` : 'no CID' }
    }
    case IOMsg.SIGNAL:
    case IOMsg.SIGNAL_E2E: {
      const { tag, args } = readSignal(data)
      const sent = deliveries(out, who)
      let note = ''
      const hosted = server.manager.hosts.size && tag.indexOf('@') !== 0
        ? server.manager.hosts.match(tag.includes('@') ? tag.slice(tag.indexOf('@')) : tag) : null
      if (hosted?.kind === 'inbound') {
        const byTag = new Map()
        for (const d of sent) {
          if (!byTag.has(d.signal.tag)) byTag.set(d.signal.tag, { type: 'host', from: { host: hosted.host.name }, tag: d.signal.tag, args: d.signal.args, to: [] })
          byTag.get(d.signal.tag).to.push(d.to)
        }
        return { type: 'signal', from, tag, args, to: [], note: `→ host ${hosted.host.name}`, hostSent: [...byTag.values()] }
      }
      if (hosted) {
        note = `denied: owned by host ${hosted.host.name}`
      } else if (sent.length === 0) {
        const at = tag.indexOf('@')
        note = at > 0 ? 'no such CID (or not allowed)' : 'no subscriber'
      }
      if (tag.includes('$')) note = (note ? note + ', ' : '') + 'retained'
      return { type: 'signal', from, tag, args, to: sent.map(d => d.to), note }
    }
    case IOMsg.SUBSCRIBE:
    case IOMsg.SUBSCRIBE_REQ:
    case IOMsg.UNSUBSCRIBE: {
      const tag = type === IOMsg.SUBSCRIBE_REQ
        ? decoder.decode(data.subarray(5, 5 + data.readUInt16BE(3)))
        : tagOf(data)
      if (type === IOMsg.UNSUBSCRIBE) return { type: 'unsubscribe', from, tag: tag || '(all)' }
      const retained = deliveries(out, who)
      return {
        type: 'subscribe', from, tag,
        note: retained.length ? 'retained: ' + retained.map(d => `${d.signal.tag}=${d.signal.args}`).join('; ') : ''
      }
    }
    case IOMsg.IAM:
      return { type: 'other', from, note: 'IAM' }
    case IOMsg.CLOSE:
      return { type: 'other', from, note: 'CLOSE' }
    case IOMsg.CALL: {
      const req = MBP.unpack(data)
      return { type: 'other', from, note: `CALL ${req?.target}.${req?.topic}` }
    }
    case Boho.BohoMsg.AUTH_REQ:
      return { type: 'auth', from, note: 'login request' }
    case Boho.BohoMsg.ENC_488:
    case Boho.BohoMsg.ENC_E2E:
      return { type: 'other', from, note: `encrypted message (${data.byteLength} bytes)` }
    default:
      return { type: 'other', from, note: IOMsg[type] ?? Boho.BohoMsg[type] ?? `type 0x${type.toString(16)}` }
  }
}
