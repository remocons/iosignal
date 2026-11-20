// Runs one device file as an IOSignal client, speaking the same protocol as the Arduino and remocon.kr devices:
//   #search -> #notify <id>; @ <command>; publishes <id>$name, <id>$ui and <id>$state. See shared/discovery.js.
//   With channel: '#lab' it is a member of that group: it answers with the channel and follows #lab$state.
// With --inspect it only loads the file and prints its definition, so user code never runs in the host.
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import fs from 'node:fs'
import { formatState, parseState } from '../shared/state.js'
import { applyCommand } from '../shared/simulate.js'
import { validateSchema } from '../shared/schema.js'
import { formatName, formatUi, parseName } from '../shared/discovery.js'

const FUNCTIONS = ['onReady', 'onCommand', 'onTick', 'onStop', 'onInput']
// id.key: the key may contain dots, the ID may not, and an ID has at most 8 characters.
export const AUTH_FORMAT = /^[^.\s]{1,8}\.\S+$/
const NETWORKS = ['local', 'global']

// auth is one id.key for both networks, or { local, global } with either left out.
const authFor = (auth, network) => typeof auth === 'object' ? auth?.[network] : auth

function checkAuth(auth) {
  if (typeof auth === 'object' && auth !== null) {
    return Object.keys(auth).every(network => NETWORKS.includes(network)) && NETWORKS.every(network => auth[network] === undefined || AUTH_FORMAT.test(auth[network]))
  }
  return AUTH_FORMAT.test(auth)
}

export async function loadDevice(file) {
  const definition = file.endsWith('.json')
    ? JSON.parse(fs.readFileSync(file, 'utf8'))
    : (await import(pathToFileURL(file).href + `?t=${fs.statSync(file).mtimeMs}`)).default
  const errors = []
  if (!definition || typeof definition !== 'object') errors.push('default export must be an object')
  else {
    if (typeof definition.name !== 'string' || !definition.name) errors.push('name is required')
    if (definition.channel !== undefined && !/^#[\w-]{1,32}$/.test(definition.channel)) errors.push('channel must look like #lab')
    // A group's $ui must be the extended form (t=, p=1 or v=1): a plain button list on a channel is legacy2.
    if (definition.channel !== undefined && !definition.type && !definition.schema && !definition.view) errors.push('a group (channel) needs a type, a schema or a view')
    if (definition.state !== undefined && typeof definition.state !== 'object') errors.push('state must be an object of key: value')
    if (definition.schema) {
      const checked = validateSchema(definition.schema)
      if (!checked.ok) errors.push(...checked.errors.map(error => `schema ${error}`))
    }
    if (definition.auth !== undefined && !checkAuth(definition.auth)) errors.push('auth must be id.key or { local, global }, with an ID of 8 characters or fewer')
    for (const key of FUNCTIONS) {
      if (definition[key] !== undefined && typeof definition[key] !== 'function') errors.push(`${key} must be a function`)
    }
  }
  if (errors.length) throw new Error(errors.join('; '))
  return definition
}

async function inspect(file) {
  try {
    const { name, type, ui, state, view, autostart, every, schema, auth, channel } = await loadDevice(file)
    // Login IDs only: keys must not travel in device lists.
    const authId = Object.fromEntries(NETWORKS.map(network => [network, authFor(auth, network)?.split('.')[0] ?? null]))
    console.log(JSON.stringify({ ok: true, definition: { name, type, ui, state, view, autostart, every, schema: schema ?? null, authId, channel: channel ?? null } }))
  } catch (error) {
    console.log(JSON.stringify({ ok: false, error: error.message }))
  }
}

async function run(file) {
  const { config, ready, meta, fatal, onShutdown } = await import('./lib.js')
  // The client library comes from the host: IOSignal Desktop passes its own build, io-server the npm package.
  const { IO, IOCongSocket, IOMsg, MBP, PAYLOAD_TYPE } = await import(config.module ?? 'iosignal')

  let definition
  try {
    definition = await loadDevice(file)
  } catch (error) {
    return fatal(error)
  }

  const url = definition.url ?? config.url
  const io = url.startsWith('cong://') ? new IOCongSocket(url) : new IO(url)
  // A key set on the card wins over the one in the file. With neither, the device stays anonymous.
  const login = config.auth ?? authFor(definition.auth, config.network)
  if (login) io.auth(login)
  const recent = []
  let e2eKey = config.e2eKey ?? ''  // set on the card (vdevice_e2e); the host may change it while running
  const { channel } = definition
  let state = { ...(definition.state ?? {}) }
  const deviceId = () => channel ?? io.cid
  const tag = field => channel ? `${channel}$${field}` : `@$${field}`
  // After a switcher redirect the socket holds the broker itself, not the switcher's address.
  const brokerUrl = () => (io.socket?.url ?? url).replace(/\/$/, '')
  const report = extra => meta({
    id: deviceId(), cid: io.cid, link: io.getStateName(), broker: io.getStateName() === 'ready' ? brokerUrl() : null,
    state, recent: recent.slice(-8), ...extra,
  })

  const device = {
    get state() { return state },
    get cid() { return io.cid },
    get e2eKey() { return e2eKey },
    io,
    set(patch) {
      state = { ...state, ...patch }
      device.publish()
    },
    publish() {
      if (io.getStateName() === 'ready') io.signal(tag('state'), formatState(state))
      report()
    },
    signal: (tag, ...args) => io.signal(tag, ...args),
    // Binary data encrypted end to end with key (Boho ENC_PACK); only a receiver with the key opens it.
    // Built here because the client's signal_e2e needs a login, while boards also send it anonymously.
    signalE2E(tag, data, key) {
      if (io.getStateName() !== 'ready' || !key) return false
      const tagBytes = Buffer.from(tag)
      const sealed = io.boho.encrypt_e2e(MBP.B8(data), key)
      io.send_enc_mode(MBP.pack(MBP.MB('#MsgType', '8', IOMsg.SIGNAL_E2E), MBP.MB('#tagLen', '8', tagBytes.length),
        MBP.MB('#tag', tagBytes), MBP.MB('#payloadType', '8', PAYLOAD_TYPE.BINARY), MBP.MB('#payload', sealed)))
      return true
    },
    listen: (tag, handler) => io.listen(tag, handler),
    log: (...args) => console.log(...args),
  }

  io.on('auth_fail', () => {
    console.log('login failed for', login.split('.')[0])
    report({ authFailed: true })
  })
  io.on('error', error => console.log('io:', error?.message ?? error?.type ?? 'connection error'))
  io.on('change', () => report())
  io.listen('#search', () => io.signal('#notify', deviceId()))
  // A group member reads the shared state; the app writes it.
  if (channel) {
    io.listen(tag('state'), (signalTag, text) => {
      if (typeof text !== 'string') return
      const { _, ...shared } = parseState(text)
      state = { ...state, ...shared }
      report()
    })
  }
  io.listen('@', async (tag, command) => {
    // '@' also fires for every '@topic' direct message; only '<cid>@' is a command (rule 4).
    if (tag !== '@') return
    const text = typeof command === 'string' ? command : JSON.stringify(command)
    recent.push({ at: Date.now(), command: text })
    console.log('command:', text)
    let handled
    try {
      handled = await definition.onCommand?.(text, device)
    } catch (error) {
      console.error('onCommand:', error)
    }
    if (handled !== true) state = applyCommand(state, text).state
    // Answer even when nothing changed, so a control UI drops its pending value.
    device.publish()
  })
  io.on('ready', () => {
    io.iam('virtual-device') // the name monitors show for this connection
    const { type, ui, schema, view } = definition
    // $name is "name:category", $ui the buttons or t=…;p=1;v=1;b=…. The screen and the picture nest, so they go
    // on tags of their own, sent first so that p=1 and v=1 point at values already kept on the broker.
    if (schema) io.signal(tag('panel'), JSON.stringify(schema))
    if (view) io.signal(tag('view'), JSON.stringify(view))
    io.signal(tag('name'), formatName(parseName(definition.name)))
    io.signal(tag('ui'), formatUi({ type, ui, panel: Boolean(schema), view: Boolean(view), broker: brokerUrl() }))
    // The shared state of a group is left alone on boot: a new member must not reset it.
    if (!channel) io.signal(tag('state'), formatState(state))
    io.signal('#notify', deviceId())
    definition.onReady?.(device)
    console.log('ready cid:', io.cid)
    report()
  })

  // Data from the host (vdevice_input), such as a webcam picture for a camera.
  process.on('message', message => {
    if (message?.t === 'e2e') {
      e2eKey = String(message.key ?? '')
      console.log(e2eKey ? 'E2E key set' : 'E2E key cleared')
      return
    }
    if (message?.t !== 'input' || !definition.onInput) return
    const { kind, type, data } = message.input ?? {}
    try {
      definition.onInput({ kind, type, data: Buffer.from(String(data ?? ''), 'base64') }, device)
    } catch (error) {
      console.error('onInput:', error)
    }
  })

  const ticker = definition.onTick && setInterval(() => {
    try {
      definition.onTick(device)
    } catch (error) {
      console.error('onTick:', error)
    }
  }, definition.every ?? 2000)

  ready()
  onShutdown(async () => {
    clearInterval(ticker)
    await definition.onStop?.(device)
    io.destroy()
  })
}

const args = process.argv.slice(2)
if (args[0] === '--inspect') await inspect(path.resolve(args[1]))
else if (args[0]) await run(path.resolve(args[0]))
