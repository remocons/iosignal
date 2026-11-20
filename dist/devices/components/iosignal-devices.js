// <iosignal-devices url="ws://host:19080/ws" types="http://host:19080/types/">: a complete device panel.
// It connects, finds devices and groups, and builds a card of widgets for each one. Usable on any web page.
// Attributes: category="거실" shows one category, ids="a,b" only those devices, login shows an ID and key form
// (for a members-only server), bus-info="off" skips the IOSignal Desktop status (/bus-info).
// A card can also stand alone: <iosignal-device-card cid="1413" url="ws://..." types="/types/"> follows that
// CID on its own connection (shared by the cards of the same URL, iosignal-link.js).
// The card of the CID in the address (/#1413) is scrolled to and marked.
import IO from '../lib/io.js'
import { DeviceScanner, UNCATEGORIZED } from '../shared/discovery.js'
import { pickSchema, validateSchema } from '../shared/schema.js'
import { normalizeType } from '../shared/typeName.js'
import { parseState } from '../shared/state.js'
import { imageWidgets, decodeImage, loadKey, saveKey } from '../shared/media.js'
import { pickView } from '../shared/view.js'
import './widgets.js'
import './vdevice-view.js'
import { base } from './tokens.css.js'
import { useLink, defaultUrl } from './iosignal-link.js'

const cache = new Map()
// Types an application adds (registerType), found before the files under the types root.
const extraTypes = new Map()

/**
 * Adds a device type of the application's own: name '<name>.<major>' and the type file's contents
 * ({ schema: 1, title, controls, view }). Devices that name it in t= get its screen and picture here;
 * other apps do not know it and fall back to the device's b= buttons.
 */
export function registerType(name, file) {
  if (typeof name !== 'string' || !/^[a-z][a-z0-9-]*\.[0-9]+$/.test(name)) throw new TypeError("type name: '<name>.<major>'")
  const checked = validateSchema(file)
  if (!checked.ok) throw new TypeError(`type ${name}: ${checked.errors.join('; ')}`)
  extraTypes.set(name, { ...checked.schema, ...(file?.view && { view: file.view }) })
}

function fetchType(root, type) {
  const own = extraTypes.get(normalizeType(type))
  if (own) return Promise.resolve(own)
  // A board may still send the old name (remocon/fan/v1): the file is fan.1.json.
  const url = new URL(`${normalizeType(type)}.json`, root).href
  if (!cache.has(url)) {
    cache.set(url, fetch(url).then(response => response.ok ? response.json() : null)
      .then(json => json && validateSchema(json).schema).catch(() => null))
  }
  return cache.get(url)
}

const cardStyle = new CSSStyleSheet()
cardStyle.replaceSync(`
  :host { display: block; }
  article { display: flex; flex-direction: column; gap: 12px; height: 100%; padding: 14px; border: 1px solid var(--_line); border-radius: 12px; background: var(--_bg); }
  header { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
  h3 { margin: 0; font-size: 15px; font-weight: 650; overflow-wrap: anywhere; }
  small { color: var(--_muted); font-size: 12px; }
  code { color: var(--_muted); font: 12px ui-monospace, SFMono-Regular, Menlo, monospace; }
  /* The whole CID; it breaks only when it is longer than the space beside the name. */
  header > code { flex: 0 1 auto; min-width: 0; overflow-wrap: anywhere; text-align: right; }
  details { color: var(--_muted); font-size: 12px; }
  .where { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; color: var(--_muted); font-size: 12px; }
  .broker { min-width: 0; overflow-wrap: anywhere; }
  .broker code { color: var(--_text); }
  .network { display: flex; }
  .network[hidden] { display: none; }
  .network button { min-height: 26px; padding: 0 9px; font-size: 12px; border-radius: 0; }
  .network button:first-child { border-radius: 7px 0 0 7px; }
  .network button:last-child { border-radius: 0 7px 7px 0; margin-left: -1px; }
  summary { cursor: pointer; }
  dl { display: grid; grid-template-columns: max-content 1fr; gap: 2px 10px; margin: 6px 0 0; }
  :host([selected]) article { outline: 2px solid var(--_accent, #4f6bed); outline-offset: 2px; }
  dd { margin: 0; overflow-wrap: anywhere; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
`)

class DeviceCard extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [base, cardStyle]
    this.shadowRoot.innerHTML = `<article><header><div><h3></h3><small></small></div><code></code></header>
      <div class="where"><span class="broker">브로커 <code id="broker"></code></span>
        <span class="network" role="group" aria-label="접속 네트워크" hidden>
          <button data-network="local">로컬</button><button data-network="global">글로벌</button>
        </span></div>
      <vdevice-view hidden></vdevice-view>
      <io-controls></io-controls>
      <details><summary>장치 정보</summary><dl><dt>ID</dt><dd id="cid"></dd><dt>화면</dt><dd id="source"></dd><dt>상태</dt><dd id="state"></dd></dl></details></article>`
    for (const button of this.shadowRoot.querySelectorAll('[data-network]')) {
      button.onclick = () => {
        if (button.classList.contains('active')) return
        this.dispatchEvent(new CustomEvent('network-change', {
          detail: { id: this.virtual.id, network: button.dataset.network }, bubbles: true, composed: true,
        }))
      }
    }
    this.controls = this.shadowRoot.querySelector('io-controls')
    this.media = {}
    this.keys = {}
    this.controls.addEventListener('media-key', event => {
      event.stopPropagation()
      const { tag } = event.detail
      const key = String(event.detail.key ?? '').trim()
      saveKey(this.device.id, tag, key)
      this.keys[tag] = key
      // The next picture shows whether the key fits.
      const item = this.media[tag]
      if (item) this.setMedia(tag, item.status === 'plain' ? { ...item, hasKey: Boolean(key) } : { status: 'waiting', hasKey: Boolean(key) })
    })
    this.controls.addEventListener('command', event => {
      event.stopPropagation()
      this.dispatchEvent(new CustomEvent('device-command', {
        detail: { id: this.device.id, network: this.device.network, command: event.detail.command }, bubbles: true, composed: true,
      }))
    })
  }

  // Standalone: a page placed this card with a cid attribute; a panel's cards are 'managed' and get update().
  connectedCallback() {
    if (this.managed || !this.hasAttribute('cid') || this.release) return
    const id = this.getAttribute('cid').trim()
    const url = this.getAttribute('url') || defaultUrl()
    const link = useLink(url)
    const typesRoot = new URL(this.getAttribute('types') ?? '/types/', location.href).href
    this.onCommand = event => {
      event.stopPropagation()
      link.command(event.detail.id, event.detail.command)
    }
    this.addEventListener('device-command', this.onCommand)
    this.waiting(id)
    this.release = link.follow(id, device => {
      if (device) this.update(device, typesRoot, { io: link.io, broker: url })
      else this.waiting(id)
    })
  }

  disconnectedCallback() {
    this.follow(null, '', [], false)
    if (this.release) {
      this.release()
      this.release = null
      this.removeEventListener('device-command', this.onCommand)
    }
  }

  // A standalone card before its device answers, or after it closed.
  waiting(id) {
    const root = this.shadowRoot
    root.querySelector('h3').textContent = id
    root.querySelector('small').textContent = '응답 없음'
    root.querySelector('header > code').textContent = ''
    this.signature = null
    this.controls.controls = []
    root.querySelector('vdevice-view').hidden = true
  }

  setMedia(tag, item) {
    const previous = this.media[tag]?.src
    if (previous && previous !== item.src) URL.revokeObjectURL(previous)
    this.media = { ...this.media, [tag]: item }
    this.controls.media = this.media
  }

  // Pictures for image widgets: subscribe to <cid>@<tag> while the card is shown and the device online.
  // Groups have none. The broker does not keep them, so a new subscription waits for the next picture.
  follow(io, id, tags, online) {
    const signature = io && online && tags.length ? `${id}|${tags.join(',')}` : ''
    if (signature === this.mediaSignature && io === this.mediaIo) return
    if (this.mediaIo && this.mediaScope) this.mediaIo.unlinkAll(this.mediaScope)
    for (const item of Object.values(this.media)) if (item.src) URL.revokeObjectURL(item.src)
    this.media = {}
    this.controls.media = this.media
    this.mediaSignature = signature
    this.mediaIo = io
    this.mediaScope = signature ? `card-image:${this.device.network}:${id}` : ''
    if (!signature) return
    for (const tag of tags) {
      this.keys[tag] = loadKey(id, tag)
      this.setMedia(tag, { status: 'waiting', hasKey: Boolean(this.keys[tag]) })
      io.link(this.mediaScope, `${id}@${tag}`, (_tag, payload) => {
        const { bytes, type, status } = decodeImage(payload instanceof Uint8Array ? payload : null, this.keys[tag] ?? '', (data, key) => io.decrypt_e2e(data, key))
        if (status === 'invalid') return
        this.setMedia(tag, { src: bytes ? URL.createObjectURL(new Blob([bytes], { type })) : undefined, status, hasKey: Boolean(this.keys[tag]) })
      })
    }
  }

  async update(device, typesRoot, { broker, virtual, io } = {}) {
    this.device = device
    this.virtual = virtual
    const root = this.shadowRoot
    root.querySelector('#broker').textContent = broker || '알 수 없음'
    root.querySelector('.network').hidden = !virtual
    for (const button of root.querySelectorAll('[data-network]')) {
      const active = button.dataset.network === device.network
      button.classList.toggle('active', active)
      button.setAttribute('aria-pressed', active)
    }
    root.querySelector('h3').textContent = device.name || '이름 없는 장치'
    root.querySelector('small').textContent = device.group || UNCATEGORIZED
    root.querySelector('header > code').textContent = device.id
    root.querySelector('#cid').textContent = device.id
    root.querySelector('#state').textContent = device.state

    const signature = [device.type, device.ui, JSON.stringify(device.schema)].join('|')
    if (signature !== this.signature) {
      this.signature = signature
      const inline = device.schema && validateSchema(device.schema).schema
      const typeFile = device.type ? await fetchType(typesRoot, device.type) : null
      const typeSchema = inline ?? typeFile
      if (signature !== this.signature) return
      this.typeView = typeFile?.view ?? null
      const { source, schema } = pickSchema({ typeSchema, ui: device.ui })
      root.querySelector('#source').textContent = source === 'type' ? (device.type || 'schema') : `ui ${device.ui}`
      this.controls.controls = schema.controls
      this.imageTags = device.isGroup ? [] : imageWidgets(schema.controls).map(image => image.tag)
    }
    this.follow(io, device.id, this.imageTags ?? [], Boolean(device.state))
    this.controls.state = parseState(device.state)

    // The device's picture ($view, else its type's default view) right above its controls.
    const picture = pickView({ view: device.hasView ? device.view : null, typeView: this.typeView })
    const view = root.querySelector('vdevice-view')
    if (picture) view.show(picture, parseState(device.state))
    else view.hidden = true
  }
}
customElements.get('iosignal-device-card') ?? customElements.define('iosignal-device-card', DeviceCard)


class Devices extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [base]
    this.shadowRoot.innerHTML = `<style>
      :host { display: block; }
      .bar { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; color: var(--_muted); font-size: 13px; }
      .bar span { flex: 1; }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr)); gap: 12px; }
      .empty { padding: 40px 12px; text-align: center; color: var(--_muted); border: 1px dashed var(--_line); border-radius: 12px; }
      .login { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 14px; }
      .login[hidden] { display: none; }
      .login input { min-width: 0; flex: 1 1 120px; }
      #loginError { color: var(--_danger, #e5484d); font-size: 13px; }
    </style>
    <div class="bar" part="bar"><span role="status" id="status">연결 중</span><button id="search">다시 검색</button></div>
    <form class="login" id="login" part="login" hidden><input id="loginId" placeholder="ID" autocomplete="username" required>
      <input id="loginKey" type="password" placeholder="키" autocomplete="current-password" required><button>로그인</button>
      <span id="loginError" role="alert"></span></form>
    <div class="grid" id="grid"></div>`
    this.cards = new Map()
    this.links = new Map()
    this.info = {}
    this.shadowRoot.querySelector('#search').onclick = () => {
      for (const { scanner } of this.links.values()) scanner.search()
    }
    this.addEventListener('device-command', ({ detail }) => this.links.get(detail.network)?.scanner.command(detail.id, detail.command))
    this.shadowRoot.querySelector('#login').onsubmit = event => {
      event.preventDefault()
      this.shadowRoot.querySelector('#loginError').textContent = ''
      this.removeLink('local')
      // The ID and key stay in this page only (also for reconnecting).
      this.addLink('local', this.url, [this.shadowRoot.querySelector('#loginId').value.trim(), this.shadowRoot.querySelector('#loginKey').value])
      const io = this.links.get('local').io
      const form = this.shadowRoot.querySelector('#login')
      io.on('ready', () => { form.hidden = true })
      io.on('auth_fail', () => {
        this.removeLink('local')
        form.hidden = false
        this.shadowRoot.querySelector('#loginError').textContent = '로그인하지 못했습니다'
        this.render()
      })
      this.render()
    }
    this.onHash = () => { this.selected = null; this.render() }
  }

  connectedCallback() {
    const url = this.getAttribute('url') ?? `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`
    this.typesRoot = new URL(this.getAttribute('types') ?? '/types/', location.href).href
    this.url = url
    if (this.hasAttribute('login')) this.shadowRoot.querySelector('#login').hidden = false
    else this.addLink('local', url)
    if (this.getAttribute('bus-info') !== 'off') {
      this.poll()
      this.pollTimer = setInterval(() => this.poll(), 3000)
    }
    addEventListener('hashchange', this.onHash)
    this.render()
  }

  disconnectedCallback() {
    removeEventListener('hashchange', this.onHash)
    clearInterval(this.pollTimer)
    for (const network of [...this.links.keys()]) this.removeLink(network)
  }

  // login: [id, key] connects logged in from the start. A members-only server answers an anonymous
  // connection's first signal (#search) by clearing it, so the login page never connects anonymously.
  addLink(network, url, login = null) {
    const io = login ? new IO() : new IO(url)
    if (login) {
      io.auth(...login)
      io.open(url)
    }
    io.on('error', () => {})
    io.on('change', () => this.render())
    io.on('ready', () => io.iam('device-panel')) // the name monitors show for this connection
    this.links.set(network, { io, url, scanner: new DeviceScanner(io, { id: `panel-${network}`, network, views: true, onChange: () => this.schedule() }) })
  }

  removeLink(network) {
    const link = this.links.get(network)
    link?.scanner.dispose()
    link?.io.destroy()
    this.links.delete(network)
  }

  // The second connection exists only while one of our devices is on the public broker.
  async poll() {
    try {
      const info = await fetch(new URL('/bus-info', this.typesRoot)).then(response => response.json())
      this.info = info
      if (!info.global.devices.length) this.removeLink('global')
      else {
        if (this.links.get('global')?.url !== info.global.url) {
          this.removeLink('global')
          this.addLink('global', info.global.url)
        }
        for (const id of info.global.devices) this.links.get('global').scanner.track(id)
      }
      this.schedule()
    } catch {
      // A page opened from a file or another host may have no /bus-info: local discovery still works.
    }
  }

  schedule() {
    if (this.pending) return
    this.pending = requestAnimationFrame(() => {
      this.pending = null
      this.render()
    })
  }

  render() {
    const grid = this.shadowRoot.querySelector('#grid')
    const scanners = [...this.links.values()].map(link => link.scanner)
    const category = this.getAttribute('category')
    const ids = this.getAttribute('ids')?.split(',').map(id => id.trim()).filter(Boolean)
    const devices = scanners.flatMap(scanner => scanner.list())
      .filter(device => (category === null || (device.group || UNCATEGORIZED) === category) && (!ids || ids.includes(device.id)))
      .sort((a, b) => a.name.localeCompare(b.name, 'ko'))
    const entries = devices.map(device => ({ key: `${device.network}:${device.id}`, data: device }))
    const keys = new Set(entries.map(entry => entry.key))
    for (const [key, card] of this.cards) {
      if (!keys.has(key)) {
        card.remove()
        this.cards.delete(key)
      }
    }
    const local = this.links.get('local')?.io.getStateName() ?? (this.hasAttribute('login') ? '로그인 필요' : 'stop')
    const global = this.links.get('global')?.io.getStateName()
    this.shadowRoot.querySelector('#status').textContent = (local === 'ready'
      ? `장치 ${devices.length}대` : `연결: ${local}`) + (global ? ` · 글로벌 ${global}` : '')
    grid.querySelector('.empty')?.remove()
    if (!entries.length) grid.insertAdjacentHTML('beforeend', '<div class="empty">응답한 장치가 없습니다.</div>')
    let previous = null
    for (const { key, data } of entries) {
      let card = this.cards.get(key)
      if (!card) {
        card = document.createElement('iosignal-device-card')
        card.managed = true
        this.cards.set(key, card)
      }
      if (card.previousElementSibling !== previous || card.parentNode !== grid) {
        if (previous) previous.after(card)
        else grid.prepend(card)
      }
      const broker = data.broker || (data.network === 'local' ? this.info.localBroker : this.links.get('global')?.url)
      card.update(data, this.typesRoot, { broker, virtual: this.virtualDevice?.(data), io: this.links.get(data.network)?.io })
      previous = card
    }
    // The card of the CID in the address (/#1413): scrolled to once, marked while the address names it.
    const wanted = decodeURIComponent(location.hash.slice(1))
    for (const [key, card] of this.cards) {
      const match = Boolean(wanted) && key.endsWith(':' + wanted)
      card.toggleAttribute('selected', match)
      if (match && this.selected !== key) {
        this.selected = key
        card.scrollIntoView({ block: 'center' })
      }
    }
  }
}
customElements.get('iosignal-devices') ?? customElements.define('iosignal-devices', Devices)
