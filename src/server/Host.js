import { performance } from 'node:perf_hooks'
import EventEmitter from 'events'
import { IOMsg, SIZE_LIMIT } from '../common/constants.js'
import { getSignalPack, decodeSignalArgs } from '../common/payload.js'

const encoder = new TextEncoder()
const NAME = /^[A-Za-z0-9_.-]{1,64}$/

/**
 * Validates one tag pattern of a host. A trailing '*' makes it a prefix; '*' is allowed nowhere else.
 * Channel patterns (inbound, and own without '@'): global channel tags, so no '@' and no leading
 * '#' (home channels belong to one network) or '$'. Unicast patterns (own, leading '@'): the topic
 * of '<cid>@topic' messages.
 * @returns {{ pattern: string, text: string, prefix: boolean, unicast: boolean }}
 */
function parsePattern(pattern, allowUnicast) {
  if (typeof pattern !== 'string' || pattern.length === 0) throw new TypeError('host tag must be a non-empty string')
  const prefix = pattern.endsWith('*')
  const text = prefix ? pattern.slice(0, -1) : pattern
  if (text.includes('*')) throw new TypeError(`host tag ${pattern}: '*' is allowed only at the end`)
  if (text.includes(',')) throw new TypeError(`host tag ${pattern}: ',' separates tags`)
  if (encoder.encode(text).byteLength > SIZE_LIMIT.TAG_LEN1) throw new TypeError(`host tag ${pattern} exceeds 255 UTF-8 bytes`)
  const unicast = text.startsWith('@')
  if (unicast) {
    if (!allowUnicast) throw new TypeError(`host tag ${pattern}: inbound tags are channel tags (no '@')`)
    if (text.indexOf('@', 1) !== -1) throw new TypeError(`host tag ${pattern}: a unicast topic has one '@'`)
    if (text.length === 1) throw new TypeError(`host tag ${pattern}: empty topic`)
  } else {
    if (text.includes('@')) throw new TypeError(`host tag ${pattern}: channel tags have no '@'`)
    if (text.startsWith('#')) throw new TypeError(`host tag ${pattern}: home channel tags ('#...') cannot be hosted`)
    if (text.startsWith('$')) throw new TypeError(`host tag ${pattern}: '$' prefix is reserved`)
    if (text.length === 0) throw new TypeError(`host tag ${pattern}: empty tag`)
  }
  return { pattern, text, prefix, unicast }
}

function overlaps(a, b) {
  if (a.prefix && b.text.startsWith(a.text)) return true
  if (b.prefix && a.text.startsWith(b.text)) return true
  return a.text === b.text
}

/**
 * The tags all hosts of one server have claimed. Patterns never overlap, so a tag matches at most one.
 */
export class HostTable {
  constructor() {
    this.exact = new Map() // text -> entry
    this.prefixes = []     // entries
    this.hosts = new Map() // name -> Host
  }

  get size() {
    return this.hosts.size
  }

  add(host, entries) {
    if (this.hosts.has(host.name)) throw new Error(`host ${host.name} already exists`)
    const all = [...this.exact.values(), ...this.prefixes]
    entries.forEach((entry, i) => {
      for (const other of [...all, ...entries.slice(0, i)]) {
        if (overlaps(entry, other)) {
          throw new Error(`host tag ${entry.pattern} overlaps ${other.pattern}` +
            (other.host === host ? '' : ` of host ${other.host.name}`))
        }
      }
    })
    for (const entry of entries) {
      if (entry.prefix) this.prefixes.push(entry)
      else this.exact.set(entry.text, entry)
    }
    this.hosts.set(host.name, host)
  }

  remove(host) {
    if (this.hosts.get(host.name) !== host) return
    this.hosts.delete(host.name)
    for (const [text, entry] of this.exact) if (entry.host === host) this.exact.delete(text)
    this.prefixes = this.prefixes.filter(entry => entry.host !== host)
  }

  // tag: a client channel tag, or '@topic' of a unicast. Returns the entry or undefined.
  match(tag) {
    const entry = this.exact.get(tag)
    if (entry) return entry
    for (const p of this.prefixes) if (tag.startsWith(p.text)) return p
    return undefined
  }

  // A connection closed. ownsCid: it still owned its CID (no newer connection took it over).
  remoteClosed(remote, ownsCid) {
    if (!ownsCid || !remote.cid) return
    for (const host of this.hosts.values()) host._remoteClosed(remote)
  }
}

/**
 * Game logic (or any server-side logic) inside the server process. Created by server.host().
 *
 * Events:
 *   'message' (from, tag, ...args)  a client signal to one of the inbound tags. from is the
 *                                   server's view of the sender (never anything in the payload).
 *   'leave' (from, reason)          a participant's connection closed (it no longer has its CID)
 *   'error' (error)                 a 'message' or 'leave' handler threw
 *   'close' ()                      the host was closed
 */
export class Host extends EventEmitter {

  constructor(manager, name, options = {}) {
    super()
    if (typeof name !== 'string' || !NAME.test(name)) {
      throw new TypeError('host name: 1-64 characters of A-Z a-z 0-9 _ . -')
    }
    if (options === null || typeof options !== 'object') throw new TypeError('host options must be an object')
    for (const key of Object.keys(options)) {
      if (!['inbound', 'own', 'fanout', 'retain'].includes(key)) throw new TypeError(`unknown host option: ${key}`)
    }
    const list = (key) => {
      const value = options[key] ?? []
      if (!Array.isArray(value)) throw new TypeError(`host option ${key} must be an array of tags`)
      return value
    }
    /** @type {Host} */
    const host = this
    const inbound = list('inbound').map(p => ({ ...parsePattern(p, false), kind: 'inbound', host }))
    const own = list('own').map(p => ({ ...parsePattern(p, true), kind: 'own', host }))
    if (inbound.length === 0) throw new TypeError('host needs at least one inbound tag')

    const fanout = options.fanout ?? null
    if (fanout !== null && !(Number.isSafeInteger(fanout) && fanout > 0)) {
      throw new RangeError('host fanout must be null or a positive integer')
    }
    const retain = options.retain ?? {}
    for (const key of ['tags', 'bytes']) {
      if (retain[key] !== undefined && !(Number.isSafeInteger(retain[key]) && retain[key] > 0)) {
        throw new RangeError(`host retain.${key} must be a positive integer`)
      }
    }

    this.name = name
    this.manager = manager
    this.fanout = fanout
    this.retainTags = retain.tags ?? null   // null: the server's retain.tagsPerOwner
    this.retainBytes = retain.bytes ?? null // null: the server's retain.bytesPerOwner
    this.retainOwnerKey = 'host:' + name
    this.ownChannels = own.filter(e => !e.unicast)
    this.closed = false
    /** @type {Map<string, Readonly<object>>} cid -> from, connections that sent to this host */
    this._participants = new Map()
    /** cid -> { inputs, firstAt, lastAt }: activity of each participant, for the dashboard */
    this._activity = new Map()
    // Cumulative since the host opened; readers compute rates from deltas (see Dashboard).
    this.counters = {
      inbound: 0,     // inputs handed to 'message'
      rejected: 0,    // inputs to an inbound tag that were not handed over (E2E, unreadable payload)
      denied: 0,      // client messages to a tag this host owns, dropped
      published: 0, delivered: 0, // publish() calls and the connections they reached
      sent: 0,        // to() messages sent
      joins: 0, leaves: 0, errors: 0,
      handlerMs: 0,   // time spent in 'message' and 'leave' handlers
    }
    this.handlerMaxMs = 0
    this.reported = {}  // last host.report() values
    this._journal = []  // recent notable events (join, leave, denied, error), oldest first
    this._journalSeq = 0
    this._loops = new Set()

    manager.hosts.add(this, [...inbound, ...own])
    // Values a client retained on these tags before the host claimed them are not the host's.
    for (const tag of [...manager.retain_messages.keys()]) {
      if (!tag.startsWith(manager.CHANNEL_PREFIX)) continue
      const entry = manager.hosts.match(tag.slice(manager.CHANNEL_PREFIX.length))
      if (entry?.host === this) manager.dropChannelRetain(tag)
    }
  }

  /** Connections that have sent to this host and are still online: cid -> from. */
  get participants() {
    return this._participants
  }

  /** Stop tracking a participant; no 'leave' is emitted for it (until it sends again). */
  forget(cid) {
    this._activity.delete(cid)
    return this._participants.delete(cid)
  }

  /**
   * Publish to one of the host's own channel tags. A tag with '$' is also retained, owned by the
   * host. Returns the number of connections it was delivered to.
   */
  publish(tag, ...args) {
    this._open()
    if (typeof tag !== 'string') throw new TypeError('tag should be string.')
    const entry = this.manager.hosts.match(tag)
    if (tag.startsWith('@') || entry?.host !== this || entry.kind !== 'own') {
      throw new Error(`host ${this.name} does not own channel tag ${tag}`)
    }
    const message = getSignalPack(tag, ...args)
    const n = this.manager.hostPublish(this, this.manager.CHANNEL_PREFIX + tag, message)
    this.counters.published++
    this.counters.delivered += n
    return n
  }

  /**
   * Send to one connection. It receives '@' + topic. Returns false when the CID is not online
   * or its receive buffer is too small for the message.
   */
  to(cid, topic, ...args) {
    this._open()
    if (typeof topic !== 'string' || topic.length === 0 || topic.includes('@')) {
      throw new TypeError('topic must be a non-empty string without @')
    }
    const remote = this.manager.cid2remote.get(cid)
    const message = getSignalPack('@' + topic, ...args)
    if (!remote || remote._closing) return false
    const skipped = remote.peerRxLimitSkipped
    remote.send_enc_mode(message)
    if (remote.peerRxLimitSkipped !== skipped) return false
    this.counters.sent++
    return true
  }

  /**
   * Values to show on the server dashboard ("game" panel), e.g. { round: 3, players: 8 }.
   * Merged into the last report; a key set to null is removed. Numbers, short strings and booleans,
   * at most 20 keys.
   */
  report(values) {
    if (values === null || typeof values !== 'object') throw new TypeError('report() takes an object')
    for (const [key, value] of Object.entries(values)) {
      if (value === null || value === undefined) { delete this.reported[key]; continue }
      if (!['number', 'string', 'boolean'].includes(typeof value)) throw new TypeError(`report value ${key} must be a number, string or boolean`)
      if (!(key in this.reported) && Object.keys(this.reported).length >= 20) continue
      this.reported[String(key).slice(0, 32)] = typeof value === 'string' ? value.slice(0, 64) : value
    }
    return this
  }

  /**
   * Run fn(now) every intervalMs, like setInterval, and measure it for the dashboard: the gap between
   * ticks and how long each tick took. A throwing tick is reported as an 'error' and the loop goes on.
   * Returns a stop function; close() stops every loop.
   */
  loop(intervalMs, fn) {
    this._open()
    if (!(Number.isFinite(intervalMs) && intervalMs >= 1)) throw new RangeError('loop interval must be at least 1 ms')
    if (typeof fn !== 'function') throw new TypeError('loop needs a function')
    const stats = { intervalMs, ticks: 0, gaps: [], steps: [], last: 0 }
    const timer = setInterval(() => {
      const t0 = performance.now()
      if (stats.last) { stats.gaps.push(t0 - stats.last); if (stats.gaps.length > 200) stats.gaps.shift() }
      stats.last = t0
      try { fn(Date.now()) } catch (error) { this._failed(error) }
      stats.steps.push(performance.now() - t0); if (stats.steps.length > 200) stats.steps.shift()
      stats.ticks++
    }, intervalMs)
    const entry = { timer, stats }
    this._loops.add(entry)
    return () => { clearInterval(timer); this._loops.delete(entry) }
  }

  /** Timing of the loops started with loop(): target, ticks, gap p50/p99 and step average/max (ms). */
  loopStats() {
    const pct = (a, p) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p / 100 * s.length))] }
    return [...this._loops].map(({ stats: s }) => ({
      intervalMs: s.intervalMs, ticks: s.ticks,
      gapP50: pct(s.gaps, 50), gapP99: pct(s.gaps, 99), gapMax: s.gaps.length ? Math.max(...s.gaps) : 0,
      stepAvg: s.steps.length ? s.steps.reduce((a, b) => a + b, 0) / s.steps.length : 0,
      stepMax: s.steps.length ? Math.max(...s.steps) : 0,
    }))
  }

  /** Participants with their activity: [{ from, inputs, firstAt, lastAt }]. */
  activity() {
    return [...this._participants.values()].map((from) => ({ from, ...(this._activity.get(from.cid) ?? { inputs: 0, firstAt: 0, lastAt: 0 }) }))
  }

  /** Notable events after sequence `after`: [{ seq, at, kind: 'join'|'leave'|'denied'|'error', ... }]. */
  journal(after = 0) {
    return this._journal.filter((e) => e.seq > after)
  }

  _note(kind, data) {
    this._journal.push({ seq: ++this._journalSeq, at: Date.now(), kind, ...data })
    if (this._journal.length > 200) this._journal.shift()
  }

  // A client sent to a tag this host owns (Manager.sender dropped it).
  _denied(remote, tag) {
    this.counters.denied++
    this._note('denied', { cid: remote.cid, tag })
  }

  _failed(error) {
    this.counters.errors++
    this._note('error', { message: String(error?.message ?? error).slice(0, 200) })
    if (this.listenerCount('error')) this.emit('error', error)
    else console.error(`host ${this.name} error:`, error)
  }

  /** Release the tags (they become ordinary channels again) and the host's retained values. */
  close() {
    if (this.closed) return
    this.closed = true
    for (const { timer } of this._loops) clearInterval(timer)
    this._loops.clear()
    this.manager.hosts.remove(this)
    const owner = this.manager.retainOwners.get(this.retainOwnerKey)
    if (owner) for (const tag of [...owner.tags]) this.manager.dropChannelRetain(tag)
    this._participants.clear()
    this._activity.clear()
    this.emit('close')
  }

  _open() {
    if (this.closed) throw new Error(`host ${this.name} is closed`)
  }

  // The server's view of a sender; reused while nothing in it changes.
  static from(remote) {
    const authorized = remote.boho?.isAuthorized === true
    const f = remote._hostFrom
    if (f && f.cid === remote.cid && f.uid === remote.uid && f.role === remote.role &&
        f.nick === remote.nick && f.authorized === authorized) return f
    return remote._hostFrom = Object.freeze({
      cid: remote.cid, uid: remote.uid || null, role: remote.role, authorized,
      nick: remote.nick || '', ssid: remote.ssid
    })
  }

  // A SIGNAL from a client to one of the inbound tags. Returns false if it was not delivered.
  _receive(remote, tag, message) {
    if (message[0] !== IOMsg.SIGNAL || !remote.cid) return false
    const tagLen = message[1]
    if (message.byteLength < tagLen + 3) return false
    let args
    try {
      args = decodeSignalArgs(message[2 + tagLen], message.subarray(3 + tagLen))
    } catch {
      return false
    }
    if (!args) return false
    const from = Host.from(remote)
    const now = Date.now()
    let act = this._activity.get(from.cid)
    if (!act) {
      act = { inputs: 0, firstAt: now, lastAt: now }
      this._activity.set(from.cid, act)
      this.counters.joins++
      this._note('join', { cid: from.cid, nick: from.nick, authorized: from.authorized })
    }
    act.inputs++
    act.lastAt = now
    this._participants.set(from.cid, from)
    this.counters.inbound++
    this._emitSafely('message', from, tag, ...args)
    return true
  }

  _remoteClosed(remote) {
    const from = this._participants.get(remote.cid)
    if (!from) return
    this._participants.delete(remote.cid)
    this._activity.delete(remote.cid)
    this.counters.leaves++
    this._note('leave', { cid: remote.cid, reason: remote.closeReason ?? 'close' })
    this._emitSafely('leave', Host.from(remote), remote.closeReason ?? 'close')
  }

  _emitSafely(name, ...args) {
    const t0 = performance.now()
    try {
      this.emit(name, ...args)
    } catch (error) {
      this._failed(error)
    }
    const ms = performance.now() - t0
    this.counters.handlerMs += ms
    if (ms > this.handlerMaxMs) this.handlerMaxMs = ms
  }
}
