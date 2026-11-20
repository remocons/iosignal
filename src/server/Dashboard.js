import { readFile } from 'node:fs/promises'
import { timingSafeEqual, createHash } from 'node:crypto'
import { ServerStats } from './ServerStats.js'
import { hasRole, ROLES } from '../auth/BohoAuth.js'
import { dashboardPage } from './dashboardPage.js'
import { decodeSignalArgs } from '../common/payload.js'

/** Tags of the dashboard's own host. Viewers send to IN; the host sends to one viewer as '@' + TOPIC. */
export const DASHBOARD = { HOST: 'iosignal.dashboard', IN: 'iosignal.dashboard#in', TOPIC: 'iosignal.dashboard' }
export const DASHBOARD_PANELS = ['server', 'traffic', 'hosts', 'game', 'participants', 'events']

const IO_BUNDLE = new URL('../../dist/browser/iife/io.js', import.meta.url)
const VIEWER_TTL_MS = 15000
const PARTICIPANT_LIMIT = 60
const PANEL_ROWS = 100      // rows of an added panel sent each second
const PANEL_CELL = 200      // characters of one cell
const SAFE_PATH = /^\/[A-Za-z0-9._~\-/#?=&%]*$/
const sha = (s) => createHash('sha256').update(String(s)).digest()

/**
 * The server dashboard: a web page (options.path) that shows the server and its hosts live.
 * It talks to the page through IOSignal itself: viewers send 'hello' to DASHBOARD.IN, a host checks
 * access, and every second it sends the latest sample to each viewer with host.to().
 *
 * options (all optional):
 *   path:           '/dashboard'
 *   access:         'open' | { token: '...' } | { login: { roles: ['admin'], cids: [] } }
 *   panels:         panels shown first (DASHBOARD_PANELS); viewers can switch them
 *   history:        seconds kept for the charts (default 300, 10-3600)
 *   maxViewers:     default 20
 *   showIdentities: show participant CIDs and names (default: true unless access is 'open')
 *   links:          [{ label, href }] links in the page header to other pages of the server, e.g.
 *                   [{ label: 'Devices', href: '/' }]; href is a path on this server
 *   cidHref:        a path with {cid} that a shown CID links to, e.g. '/#{cid}' (needs showIdentities)
 *
 * dashboard.panel(id, { title, columns, rows }) adds a table of the application's own data, such as
 * the processes it runs; rows() is called once a second while someone watches.
 */
export class Dashboard {
  constructor(server, options = {}) {
    if (options === true) options = {}
    if (options === null || typeof options !== 'object') throw new TypeError('dashboard options must be an object or true')
    for (const key of Object.keys(options)) {
      if (!['path', 'access', 'panels', 'history', 'maxViewers', 'showIdentities', 'links', 'cidHref'].includes(key)) {
        throw new TypeError(`unknown dashboard option: ${key}`)
      }
    }
    const path = options.path ?? '/dashboard'
    if (typeof path !== 'string' || !/^\/[A-Za-z0-9._~\-/]*$/.test(path) || path.length > 64) {
      throw new TypeError("dashboard path must start with '/' and use URL-safe characters")
    }
    this.path = path.length > 1 ? path.replace(/\/+$/, '') : path
    this.access = this.#access(options.access ?? 'open')
    const panels = options.panels ?? DASHBOARD_PANELS
    if (!Array.isArray(panels) || panels.some((p) => !DASHBOARD_PANELS.includes(p))) {
      throw new TypeError(`dashboard panels must be some of: ${DASHBOARD_PANELS.join(', ')}`)
    }
    this.panels = [...new Set(panels)]
    this.history = Number.isInteger(options.history) && options.history >= 10 && options.history <= 3600 ? options.history : 300
    if (options.history !== undefined && this.history !== options.history) throw new RangeError('dashboard history: 10-3600 seconds')
    this.maxViewers = options.maxViewers ?? 20
    if (!Number.isInteger(this.maxViewers) || this.maxViewers < 1 || this.maxViewers > 200) throw new RangeError('dashboard maxViewers: 1-200')
    this.showIdentities = options.showIdentities ?? this.access.mode !== 'open'
    const links = options.links ?? []
    if (!Array.isArray(links) || links.length > 8 || links.some((l) => !l || typeof l.label !== 'string' || !l.label ||
        l.label.length > 32 || typeof l.href !== 'string' || l.href.length > 128 || !SAFE_PATH.test(l.href))) {
      throw new TypeError("dashboard links: at most 8 of { label (1-32 characters), href (a path on this server, starting with '/') }")
    }
    this.links = links.map(({ label, href }) => ({ label, href }))
    this.cidHref = options.cidHref ?? null
    if (this.cidHref !== null && (typeof this.cidHref !== 'string' || !this.cidHref.includes('{cid}') ||
        this.cidHref.length > 128 || !SAFE_PATH.test(this.cidHref.replace('{cid}', 'x')))) {
      throw new TypeError("dashboard cidHref: a path on this server with {cid}, such as '/#{cid}'")
    }
    this.custom = new Map()        // id -> { title, columns, rows }

    this.server = server
    this.startedAt = Date.now()
    this.viewers = new Map()       // cid -> { lastAt }
    this.publicSeen = false        // an open dashboard has been viewed from a public address
    this.series = []               // [{ at, ... }] one point a second, at most `history`
    this.lastHostCounters = new Map()
    this.lastJournal = new Map()   // host name -> last journal seq sent
    this.events = []               // recent events for a viewer that just arrived

    this.host = server.host(DASHBOARD.HOST, { inbound: [DASHBOARD.IN], own: ['@' + DASHBOARD.TOPIC] })
    this.host.on('message', (from, tag, msg) => this.#onViewer(from, msg))
    this.host.on('leave', (from) => this.viewers.delete(from.cid))
    this.host.on('error', (error) => console.error('dashboard error:', error))
    this.stats = new ServerStats(server, { onSample: (value) => this.#onSample(value) })
  }

  #access(access) {
    if (access === 'open') return { mode: 'open' }
    if (access && typeof access === 'object' && typeof access.token === 'string') {
      if (access.token.length < 8) throw new RangeError('dashboard token: at least 8 characters')
      return { mode: 'token', hash: sha(access.token) }
    }
    if (access && typeof access === 'object' && access.login && typeof access.login === 'object') {
      const roles = access.login.roles ?? ['admin']
      const cids = access.login.cids ?? []
      if (!Array.isArray(roles) || !Array.isArray(cids)) throw new TypeError('dashboard login: roles and cids are arrays')
      for (const role of roles) if (!ROLES.includes(role)) throw new RangeError(`dashboard login role must be one of: ${ROLES.join(', ')}`)
      return { mode: 'login', roles, cids: new Set(cids) }
    }
    throw new TypeError("dashboard access must be 'open', { token } or { login: { roles, cids } }")
  }

  /** Whether this viewer (the server's view of it) may watch. */
  allowed(from, msg) {
    const a = this.access
    if (a.mode === 'open') return true
    if (a.mode === 'token') return typeof msg?.token === 'string' && timingSafeEqual(sha(msg.token), a.hash)
    if (!from.authorized) return false
    return a.cids.has(from.cid) || a.roles.some((role) => hasRole({ role: from.role, boho: { isAuthorized: true } }, role))
  }

  #onViewer(from, msg) {
    if (msg?.op === 'bye') { this.viewers.delete(from.cid); return }
    if (msg?.op !== 'hello') return
    const known = this.viewers.get(from.cid)
    if (!this.allowed(from, msg)) { this.host.to(from.cid, DASHBOARD.TOPIC, { type: 'denied', mode: this.access.mode }); return }
    if (!known && this.viewers.size >= this.maxViewers) { this.host.to(from.cid, DASHBOARD.TOPIC, { type: 'full' }); return }
    this.viewers.set(from.cid, { lastAt: Date.now() })
    if (!known && this.access.mode === 'open' && !this.publicSeen && this.#fromPublic(from.cid)) {
      // Open access is meant for a LAN: say so once when someone views it from a public address.
      this.publicSeen = true
      console.warn(`dashboard: open access is being viewed from a public address; use a token or login access (dashboard.access) on an Internet-facing server`)
    }
    if (!known) this.host.to(from.cid, DASHBOARD.TOPIC, this.#init())
  }

  #init() {
    return {
      type: 'init', at: Date.now(), startedAt: this.startedAt, panels: this.panels, history: this.history,
      showIdentities: this.showIdentities, server: this.#serverInfo(), series: this.series, events: this.events.slice(-60),
      publicOpen: this.access.mode === 'open' && this.publicSeen, links: this.links,
      cidHref: this.showIdentities ? this.cidHref : null,
      custom: [...this.custom].map(([id, p]) => ({ id, title: p.title, columns: p.columns })),
    }
  }

  /**
   * Adds a table panel of the application's own data; viewers who are watching get it at once.
   * Cells are shown as text.
   * @param {string} id panel id: a-z, 0-9, '-' (not one of DASHBOARD_PANELS)
   * @param {{ title: string, columns: string[], rows: () => any[][] }} panel
   */
  panel(id, { title, columns, rows }) {
    if (typeof id !== 'string' || !/^[a-z][a-z0-9-]{0,31}$/.test(id) || DASHBOARD_PANELS.includes(id)) {
      throw new TypeError(`dashboard panel id: a-z, 0-9 and '-', not one of ${DASHBOARD_PANELS.join(', ')}`)
    }
    if (typeof title !== 'string' || !title || title.length > 64) throw new TypeError('dashboard panel title: 1-64 characters')
    if (!Array.isArray(columns) || !columns.length || columns.length > 12 || columns.some((c) => typeof c !== 'string' || c.length > 32)) {
      throw new TypeError('dashboard panel columns: 1-12 names of at most 32 characters')
    }
    if (typeof rows !== 'function') throw new TypeError('dashboard panel rows must be a function')
    this.custom.set(id, { title, columns: [...columns], rows })
    for (const cid of this.viewers.keys()) this.host.to(cid, DASHBOARD.TOPIC, this.#init())
    return this
  }

  /** Removes a panel added with panel(). */
  removePanel(id) {
    return this.custom.delete(id)
  }

  #customRows() {
    const out = {}
    for (const [id, p] of this.custom) {
      let rows
      try { rows = p.rows() } catch (error) { console.error(`dashboard panel ${id}:`, error); rows = [] }
      out[id] = (Array.isArray(rows) ? rows : []).slice(0, PANEL_ROWS).map((row) => (Array.isArray(row) ? row : [])
        .slice(0, p.columns.length).map((cell) => cell === null || cell === undefined ? '' : String(cell).slice(0, PANEL_CELL)))
    }
    return out
  }

  // The name a connection gives itself on <cid>@$name (rule: the part before the first ':'), or ''.
  #deviceName(cid) {
    const message = this.server.manager.cid2remote?.get(cid)?.retain_signal?.get('$name')
    if (!message) return ''
    try {
      const tagLen = message[1]
      const [text] = decodeSignalArgs(message[2 + tagLen], message.subarray(3 + tagLen)) ?? []
      return typeof text === 'string' ? text.split(':')[0].trim().slice(0, 64) : ''
    } catch { return '' }
  }

  // Whether the connection of this CID came from a public (not loopback or private) address.
  #fromPublic(cid) {
    for (const remote of this.server.manager.remotes) if (remote.cid === cid) return !remote.privateNode
    return false
  }

  #serverInfo() {
    const s = this.server
    return {
      ws: s.port ?? null, tcp: s.congPort ?? null, membersOnly: s.membersOnly, anonymousQuota: s.anonymousQuota,
      quota: s.quotas?.[s.anonymousQuota] ?? null, node: process.version,
    }
  }

  #mask(cid) {
    if (this.showIdentities) return cid
    const s = String(cid ?? '')
    return s.length <= 2 ? '••' : s.slice(0, 2) + '•'.repeat(Math.min(4, s.length - 2))
  }

  #hosts(now) {
    const out = []
    for (const host of this.server.hosts) {
      if (host === this.host || host.closed) continue
      const c = host.counters
      const prev = this.lastHostCounters.get(host) ?? { ...c, at: now - 1000 }
      const sec = Math.max(0.001, (now - prev.at) / 1000)
      const rate = (k) => (c[k] - prev[k]) / sec
      const handled = (c.inbound - prev.inbound) + (c.leaves - prev.leaves)
      this.lastHostCounters.set(host, { ...c, at: now })
      const item = {
        name: host.name, participants: host.participants.size,
        rates: { inbound: rate('inbound'), denied: rate('denied'), rejected: rate('rejected'), published: rate('published'), delivered: rate('delivered'), sent: rate('sent'), errors: rate('errors') },
        totals: { inbound: c.inbound, denied: c.denied, rejected: c.rejected, joins: c.joins, leaves: c.leaves, errors: c.errors },
        handlerAvgMs: handled > 0 ? (c.handlerMs - prev.handlerMs) / handled : 0,
        handlerMaxMs: host.handlerMaxMs,
        loops: host.loopStats(), report: host.reported,
      }
      {
        item.players = host.activity()
          .sort((a, b) => b.lastAt - a.lastAt).slice(0, PARTICIPANT_LIMIT)
          .map(({ from, inputs, firstAt, lastAt }) => ({
            cid: this.#mask(from.cid), nick: this.showIdentities ? from.nick : '', authorized: from.authorized,
            name: this.showIdentities ? this.#deviceName(from.cid) : '',
            inputs, since: now - firstAt, idle: now - lastAt,
          }))
      }
      const after = this.lastJournal.get(host.name) ?? 0
      const fresh = host.journal(after)
      if (fresh.length) this.lastJournal.set(host.name, fresh.at(-1).seq)
      for (const e of fresh) {
        this.events.push({ host: host.name, at: e.at, kind: e.kind, cid: e.cid ? this.#mask(e.cid) : undefined, tag: e.tag, reason: e.reason, message: e.message })
      }
      out.push(item)
    }
    if (this.events.length > 200) this.events.splice(0, this.events.length - 200)
    return out
  }

  #onSample(v) {
    const now = v.at
    for (const [cid, viewer] of this.viewers) if (now - viewer.lastAt > VIEWER_TTL_MS) this.viewers.delete(cid)
    const eventsBefore = this.events.length
    const hosts = this.#hosts(now)
    // The dashboard's own traffic, so it can be told apart from the game's.
    const own = { viewers: this.viewers.size }
    const point = {
      at: now, cpu: v.cpuPercent, elu: v.eventLoopUtilization, eld: v.eventLoopP99Ms, rss: v.rss, heap: v.heapUsed,
      conns: v.total, ws: v.websocket, tcp: v.total - v.websocket, auth: v.authenticated,
      rxMsg: v.rates.rxMessages ?? 0, txMsg: v.rates.txMessages ?? 0, rxB: v.rates.rxBytes ?? 0, txB: v.rates.txBytes ?? 0,
      dropped: (v.rates.rateLimited ?? 0) + (v.rates.oversizeRejected ?? 0),
      hosts: Object.fromEntries(hosts.map((h) => [h.name, { in: h.rates.inbound, denied: h.rates.denied, players: h.participants, step: h.loops[0]?.stepAvg ?? null, gap: h.loops[0]?.gapP99 ?? null }])),
    }
    this.series.push(point)
    if (this.series.length > this.history) this.series.shift()
    if (!this.viewers.size) return
    const frame = {
      type: 'tick', point,
      server: {
        uptime: now - this.startedAt, states: v.states, queuedBytes: v.queuedBytes, maxQueuedBytes: v.maxQueuedBytes,
        txBlockedConnections: v.txBlockedConnections, channels: v.channels, hostTotalBytes: v.hostTotalBytes,
        counters: { rateLimited: v.counters.rateLimited, oversizeRejected: v.counters.oversizeRejected, peerRxLimitSkipped: v.counters.peerRxLimitSkipped },
        own,
      },
      hosts, events: this.events.slice(eventsBefore), custom: this.#customRows(),
    }
    for (const cid of this.viewers.keys()) this.host.to(cid, DASHBOARD.TOPIC, frame)
  }

  /**
   * Serves the page (GET path) and the browser client (path + '/io.js'). Returns true when it
   * answered. A Server with `port` calls it itself; with your own httpServer call it first in
   * your request handler: if (server.dashboard.handle(req, res)) return
   */
  handle(req, res) {
    let pathname
    try { pathname = new URL(req.url || '/', 'http://localhost').pathname } catch { return false }
    const root = this.path === '/' ? '' : this.path
    if (pathname !== this.path && pathname !== root + '/' && pathname !== root + '/io.js') return false
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return true }
    const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' }
    if (pathname === root + '/io.js') {
      readFile(IO_BUNDLE).then((js) => {
        res.writeHead(200, { ...headers, 'Content-Type': 'text/javascript; charset=utf-8' })
        res.end(req.method === 'HEAD' ? undefined : js)
      }, () => { res.writeHead(500); res.end('IOSignal browser bundle not found (build dist first)') })
      return true
    }
    const config = {
      io: root + '/io.js', ws: this.server.wsPath || '/', access: this.access.mode, panels: this.panels,
      history: this.history, tag: DASHBOARD.IN, topic: '@' + DASHBOARD.TOPIC,
    }
    res.writeHead(200, {
      ...headers, 'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' ws: wss:; img-src 'self' data:",
    })
    res.end(req.method === 'HEAD' ? undefined : dashboardPage(config))
    return true
  }

  close() {
    this.stats.dispose()
    this.host.close()
    this.viewers.clear()
  }
}
