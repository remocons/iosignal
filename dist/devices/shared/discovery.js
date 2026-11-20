// Device discovery, shared by the browser components and Node.js hosts. The IOSignal device rules
// (v2, 2026-11-15), in short:
//   1. find     app: #search            device: #notify <id>   (on connecting, and when asked)
//   2. name     <id>$name   = "name" or "name:category" (split at the first ':'; no category is 미분류)
//      ui       <id>$ui     = a button list "on,off,toggle" (the old remocon-arduino form, still the default)
//                           or extended "t=iris.2;p=1;v=1;b=on,off" when the first key is t, p or v:
//                t official type, p=1 sends $panel, v=1 sends $view, b buttons, broker (Desktop).
//      panel    <id>$panel  = JSON { schema: 1, title?, icon?, controls }: the device's own control screen (p=1).
//      view     <id>$view   = JSON { kind, …state key names }: a picture of the device (v=1). Only a scanner
//                made with views: true subscribes to it. A type file can carry a default view too.
//   3. state    <id>$state  = on=1;level=70 (a board on the old form may send any text)
//   4. command  to <id>@ : a button name as it is, on, off, toggle, key=value
//   5. group    an id starting with # is a group: there is no command, the app rewrites #ch$state.
//                A group's $ui must be extended; one with a button list is a legacy2 channel and is not shown.
// $info (2026-11-09 to 11-15) is not read any more.
// A device id is its CID, and its tags are <cid>@$name, <cid>@$ui, <cid>@$state, <cid>@$panel and <cid>@$view.
// Each device's tags are linked under its own scope (<scanner id>/<device id>), so a device that closes
// is forgotten with one unlinkAll: a found device that disconnects stops costing a subscription.
// Known devices (rule 1 skipped) stay followed, to show them again when they come back.
// A search only asks: devices already followed keep their subscriptions. The broker drops what a connection
// sends over its quota (anonymous: 100 messages a second), and re-subscribing every device on each search went
// over it with about ten devices, so a random part of them was missing. A found device still without a name,
// a state or its announced panel (a subscription dropped) is subscribed again when it next answers.
// A group has no owner, so no close comes for it: while one is shown the scanner asks again every
// GROUP_CHECK_MS and forgets a found group that does not answer within GROUP_WAIT_MS (its members are all off).
// Works with any IOSignal client (browser or Node); it needs on/signal/link/unlinkAll.
import { applyCommand } from './simulate.js'
import { parseState, formatState } from './state.js'

// After connecting, one more search this much later, only when a found device is still not shown (see recheck()).
const RESEARCH_MS = 1000
// A found device still not shown after this long is subscribed again on its next #notify.
const RETRY_MS = 500
// A shown group is asked for again this often, and forgotten when it does not answer within the wait.
const GROUP_CHECK_MS = 15000
const GROUP_WAIT_MS = 3000
export const isGroup = id => id.startsWith('#')
const prefix = id => isGroup(id) ? id + '$' : id + '@$'
// The category of a device without one (the part after ':' in $name).
export const UNCATEGORIZED = '미분류'
// What a device needs to be shown. A group whose $ui is an old button list is a legacy2 channel: not shown.
const complete = device => Boolean(device.name && (device.state || device.isGroup)) && !(device.isGroup && device.legacyUi)

export class DeviceScanner {
  // known: ids to follow without being found, such as registered devices (rule 1 is skipped for them).
  // discover: false follows only those, and never sends #search.
  // views: true also follows $view, the picture of a device (only a panel that draws it needs it).
  constructor(io, { id = 'scanner', network = 'local', known = () => [], discover = true, views = false, onChange = () => {}, onSignal = () => {} } = {}) {
    this.io = io
    this.views = views
    this.id = id
    this.network = network
    this.known = known
    this.discover = discover
    this.onChange = onChange
    this.onSignal = onSignal
    this.devices = new Map()
    this.notify = (tag, deviceId) => { onSignal(tag, deviceId); this.found(deviceId) }
    // One search on connecting is enough: IOCore sends its subscriptions before 'ready', so '#notify' is
    // subscribed before the search goes out, and a device that connects at the same moment and misses the search
    // announces itself with '#notify' after subscribing '#search' (one of the two always arrives).
    // The second look only searches again when a subscription was dropped (see recheck()).
    this.onReady = () => {
      this.timers = [setTimeout(() => this.search()), setTimeout(() => this.recheck(), RESEARCH_MS)]
    }
    // A lost connection means nothing is known any more; never offer devices that cannot be reached.
    // A reconnect may be a broker change: every device has a new connection and maybe a new CID.
    this.onLost = () => this.clear()
    io.on('ready', this.onReady)
    io.on('close', this.onLost)
    if (discover) io.link(this.id + ':scan', '#notify', this.notify)
    if (io.getStateName() === 'ready') this.onReady()
  }

  // Asks for devices without forgetting the ones followed: a closed device is forgotten by its $state close.
  // Only a device followed because it was known, and no longer is, is dropped.
  search() {
    const known = new Set(this.known())
    for (const [id, device] of this.devices) if (device.known && !device.found && !known.has(id)) this.forget(id)
    for (const id of known) {
      this.track(id)
      const device = this.devices.get(id)
      if (device) device.known = true
    }
    if (this.discover) {
      this.io.signal('#search')
      this.checkGroups()
    }
  }

  // Groups found by search (not known ones) that do not answer the search just sent are forgotten, and while any
  // is left it is asked again later. Every answer counts, so a search from anywhere keeps a live group.
  checkGroups() {
    const askedAt = Date.now()
    clearTimeout(this.groupTimer)
    this.groupTimer = setTimeout(() => {
      const known = new Set(this.known())
      for (const [id, device] of this.devices) {
        if (device.isGroup && !known.has(id) && (device.answeredAt ?? 0) < askedAt) this.forget(id)
      }
      this.scheduleGroups()
    }, GROUP_WAIT_MS)
  }

  scheduleGroups() {
    clearTimeout(this.groupTimer)
    this.groupTimer = null
    const known = new Set(this.known())
    if (![...this.devices.values()].some(device => device.isGroup && !known.has(device.id))) return
    this.groupTimer = setTimeout(() => {
      this.groupTimer = null
      if (this.io.getStateName() !== 'ready') return
      this.io.signal('#search')
      this.checkGroups()
    }, GROUP_CHECK_MS - GROUP_WAIT_MS)
  }

  // A device answered #search or announced itself.
  found(id) {
    const device = this.devices.get(id)
    const missing = device && (!complete(device) || (device.hasPanel && !device.schema))
    if (missing && Date.now() - device.trackedAt >= RETRY_MS) this.untrack(id)
    this.track(id)
    const tracked = this.devices.get(id)
    if (tracked) {
      tracked.found = true
      tracked.answeredAt = Date.now()
      if (tracked.isGroup && this.discover && !this.groupTimer) this.scheduleGroups()
    }
  }

  // A found device still without its name, state or announced panel lost a subscription to the broker's quota:
  // it is subscribed again when it next answers, so ask once more. Nothing is sent when every device is shown.
  // A legacy2 group is never shown and does not count.
  recheck() {
    const waiting = [...this.devices.values()].some(device =>
      device.found && !(device.isGroup && device.legacyUi) && (!complete(device) || (device.hasPanel && !device.schema)))
    if (waiting) this.sweep()
  }

  // Asks again without forgetting anything; known devices are ignored by track().
  sweep() {
    if (this.discover && this.io.getStateName() === 'ready') this.io.signal('#search')
  }

  // The link scope of one device's tags.
  scope(id) {
    return this.id + '/' + id
  }

  clear() {
    for (const id of this.devices.keys()) this.io.unlinkAll(this.scope(id))
    this.io.unlinkAll(this.id)
    this.devices.clear()
    this.onChange()
  }

  // A found device that closed: drop it and its subscriptions. It is found again by #notify if it returns.
  forget(id) {
    if (!this.devices.has(id) || this.known().includes(id)) return
    this.untrack(id)
    this.onChange()
  }

  untrack(id) {
    this.io.unlinkAll(this.scope(id))
    this.devices.delete(id)
  }

  // Called with each $name and $ui; a subclass can react to them without subscribing to the tags again.
  described(device) {}

  track(id) {
    if (typeof id !== 'string' || !id || this.devices.has(id)) return
    const device = {
      id, isGroup: isGroup(id), network: this.network, name: '', group: '', type: '', ui: '', legacyUi: false,
      schema: null, view: null, broker: '', hasPanel: false, hasView: false, state: '', seenAt: Date.now(), trackedAt: Date.now(),
    }
    this.devices.set(id, device)
    const link = (field, handler) => this.io.link(this.scope(id), prefix(id) + field, (tag, value, extra) => {
      this.onSignal(tag, value)
      if (this.devices.get(id) !== device) return
      handler(value, extra)
      device.seenAt = Date.now()
      this.onChange(device)
    })
    // Parts on tags of their own, announced in $ui: the panel (device.schema) and the picture (device.view).
    // They are kept apart from $ui: a later $ui resets the fields it carries, not these.
    const parts = { schema: { tag: '', value: null }, view: { tag: '', value: null } }
    const follow = (key, field) => {
      const part = parts[key]
      if (part.tag !== field) {
        if (part.tag) this.io.unlink(this.scope(id), prefix(id) + part.tag)
        Object.assign(part, { tag: field, value: null })
        if (field) link(field, value => {
          part.value = parseObject(value)
          device[key] = part.value
        })
      }
      if (field && part.value) device[key] = part.value
    }
    link('name', value => {
      Object.assign(device, parseName(value))
      this.described(device)
    })
    link('ui', value => {
      Object.assign(device, { type: '', ui: '', legacyUi: false, schema: null, view: null, broker: '', hasPanel: false, hasView: false }, parseUi(value))
      follow('schema', device.hasPanel ? 'panel' : '')
      follow('view', device.hasView && this.views ? 'view' : '')
      this.described(device)
    })
    // extra: an optional object after the state, such as the video on a player.
    link('state', (value, extra) => {
      if (typeof value !== 'string') return
      if (value === 'close' && !device.isGroup) {
        device.state = ''
        // A known device stays followed: it counts as found (on this network) again only when it answers #notify.
        device.found = false
        // After this handler's onChange: the device is shown offline once, then forgotten.
        queueMicrotask(() => this.devices.get(id) === device && this.forget(id))
      } else device.state = value
      if (extra && typeof extra === 'object') device.media = extra
    })
    this.onChange(device)
  }

  command(id, command) {
    const device = this.devices.get(id)
    if (!device?.isGroup) return this.io.signal(id + '@', command)
    this.io.signal(id + '$state', formatState(applyCommand(parseState(device.state), command).state))
  }

  list() {
    return [...this.devices.values()].filter(complete)
  }

  dispose() {
    for (const timer of this.timers ?? []) clearTimeout(timer)
    clearTimeout(this.groupTimer)
    this.io.removeListener?.('ready', this.onReady)
    this.io.removeListener?.('close', this.onLost)
    for (const id of this.devices.keys()) this.io.unlinkAll(this.scope(id))
    this.io.unlinkAll(this.id)
    this.io.unlinkAll(this.id + ':scan')
  }
}

// Data from the bus: only these fields, with the expected types.

// $name: "name" or "name:category", split at the first ':'. A missing category is '' (shown as 미분류).
// parseName("무지개조명:2층 거실") is { name: '무지개조명', group: '2층 거실' }.
export function parseName(text) {
  const value = typeof text === 'string' ? text.slice(0, NAME_MAX).replace(/[\r\n]+/g, ' ') : ''
  const at = value.indexOf(':')
  return at < 0 ? { name: value.trim(), group: '' } : { name: value.slice(0, at).trim(), group: value.slice(at + 1).trim() }
}

// Whether $ui is the extended form: its first ';' piece starts with t=, p= or v=. Anything else is a button list.
export function isExtendedUi(text) {
  return typeof text === 'string' && /^(t|p|v)=/.test(text.trim().split(';')[0])
}

// $ui: { ui (buttons, comma list), type, hasPanel, hasView, broker, legacyUi }.
// "on,off,toggle" is { ui: 'on,off,toggle', legacyUi: true }; "t=iris.2;p=1;v=1;b=on,off" is
// { type: 'iris.2', hasPanel: true, hasView: true, ui: 'on,off' }. Unknown keys are left out.
export function parseUi(text) {
  if (typeof text !== 'string' || !text.trim()) return {}
  const value = text.slice(0, UI_MAX).replace(/[\r\n]+/g, ' ').trim()
  if (!isExtendedUi(value)) return { ui: value, legacyUi: true }
  const fields = parseState(value)
  const out = {}
  if (fields.t) out.type = fields.t
  if (fields.b) out.ui = fields.b
  if (fields.broker) out.broker = fields.broker
  if (fields.p === '1') out.hasPanel = true
  if (fields.v === '1') out.hasView = true
  return out
}

// $name text: the name with ':' and line breaks made spaces, then ':' and the category when there is one.
// formatName({ name: 'Lamp', group: 'Home' }) is "Lamp:Home".
export function formatName({ name = '', group = '' } = {}) {
  const clean = String(name ?? '').replace(/[:\r\n]/g, ' ').trim()
  const category = String(group ?? '').replace(/[\r\n]/g, ' ').trim()
  return category ? `${clean}:${category}` : clean
}

// $ui text. With a type, panel or picture it is the extended form (t first, then p, v, b, broker);
// otherwise the plain button list. ';' and line breaks in a value become spaces.
// formatUi({ type: 'light.1', view: true }) is "t=light.1;v=1"; formatUi({ ui: 'on,off' }) is "on,off".
export function formatUi({ type = '', ui = '', panel = false, view = false, broker = '' } = {}) {
  const clean = value => String(value ?? '').replace(/[;\r\n]/g, ' ').trim()
  if (!type && !panel && !view) return clean(ui)
  return [
    type && `t=${clean(type)}`, panel && 'p=1', view && 'v=1', ui && `b=${clean(ui)}`, broker && `broker=${clean(broker)}`,
  ].filter(Boolean).join(';')
}

// What the app reads of a $name and a $ui at most (the rules recommend 64 and 128 bytes).
const NAME_MAX = 128
const UI_MAX = 512

// A $panel or $view value: a JSON object, or null. The card validates what is inside.
export function parseObject(text) {
  try {
    const value = typeof text === 'string' ? JSON.parse(text) : text
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null
  } catch {
    return null
  }
}
