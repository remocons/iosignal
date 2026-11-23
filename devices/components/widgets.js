// Control widgets as custom elements. A widget knows nothing about the bus: it gets a spec (from the device
// schema) and a state, and raises a bubbling 'command' event with the command text.
import { renderCommand, createThrottle } from '../shared/command.js'
import { isTruthy } from '../shared/state.js'
import { textCommand } from '../shared/schema.js'
import { base } from './tokens.css.js'

const PENDING_MS = 2500
// Sliders and the color picker send one command at a time: the next value goes after the device's
// $state answer (or ANSWER_MS), and never sooner than the gap, so a slow link is not flooded.
const ANSWER_MS = 1000

class Widget extends HTMLElement {
  #state = {}
  disabled = false
  pendingUntil = 0

  constructor() {
    super()
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [base]
  }

  connectedCallback() {
    if (!this.built) {
      this.built = true
      this.build()
    }
    this.refresh()
  }

  set state(state) {
    this.#state = state ?? {}
    if (this.built) this.refresh()
  }
  get state() { return this.#state }

  value(key = this.spec.key) { return this.#state[key] }
  label() { return this.spec.label ?? this.spec.key ?? '' }
  emit(command) {
    this.dispatchEvent(new CustomEvent('command', { detail: { command }, bubbles: true, composed: true }))
  }
  // Keeps a value the user just set on screen until the device answers.
  hold() { this.pendingUntil = Date.now() + PENDING_MS }
  held() { return Date.now() < this.pendingUntil }
  refresh() {
    for (const element of this.shadowRoot.querySelectorAll('button,input,select')) element.disabled = this.disabled
    this.update()
  }
  update() {}
  html(markup) { this.shadowRoot.innerHTML = markup }
  $(selector) { return this.shadowRoot.querySelector(selector) }
}

const escape = text => String(text ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const define = (name, element) => customElements.get(name) ?? customElements.define(name, element)

define('io-w-button', class extends Widget {
  build() {
    this.html(`<button></button>`)
    this.$('button').textContent = this.spec.label
    this.$('button').onclick = () => this.emit(this.spec.cmd)
  }
})

define('io-w-buttons', class extends Widget {
  build() {
    this.html(`<div class="field">${this.spec.label ? `<span class="label">${escape(this.spec.label)}</span>` : ''}<div class="buttons"></div></div>`)
    for (const option of this.spec.options) {
      const button = document.createElement('button')
      button.textContent = option.label
      button.dataset.value = option.value
      button.onclick = () => this.emit(renderCommand(this.spec.cmd, option.value))
      this.$('.buttons').append(button)
    }
  }
  update() {
    if (!this.spec.key) return
    for (const button of this.shadowRoot.querySelectorAll('button')) {
      button.classList.toggle('active', button.dataset.value === this.value())
    }
  }
})

define('io-w-switch', class extends Widget {
  build() {
    this.html(`<style>
      button { position: relative; width: 46px; min-height: 26px; height: 26px; padding: 0; border-radius: 13px; background: var(--_raised); transition: background .15s; }
      button::after { content: ''; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: var(--_text); transition: left .15s; }
      button[aria-checked=true] { background: var(--_accent); border-color: var(--_accent); }
      button[aria-checked=true]::after { left: 23px; background: var(--_on-accent); }
    </style><div class="field inline"><span class="label"></span><button role="switch" aria-checked="false"></button></div>`)
    this.$('.label').textContent = this.label()
    this.$('button').setAttribute('aria-label', this.label())
    this.$('button').onclick = () => {
      const next = this.$('button').getAttribute('aria-checked') !== 'true'
      this.$('button').setAttribute('aria-checked', next)
      this.hold()
      this.emit(next ? this.spec.cmdOn : this.spec.cmdOff)
    }
  }
  update() {
    if (!this.held()) this.$('button').setAttribute('aria-checked', isTruthy(this.value()))
  }
  set state(state) { this.pendingUntil = 0; super.state = state }
  get state() { return super.state }
})

define('io-w-slider', class extends Widget {
  build() {
    const { min, max, step = 1, unit = '' } = this.spec
    // track: 'hue' draws the color wheel on the track (same as remocon.kr).
    const hue = this.spec.track === 'hue' ? `input { -webkit-appearance: none; appearance: none; height: 22px; border-radius: 11px; border: 1px solid var(--_line);
        background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00); }
      input::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: var(--thumb, #fff); border: 3px solid #fff; box-shadow: 0 0 0 1px rgb(0 0 0 / .5); }` : ''
    this.html(`<style>input { width: 100%; accent-color: var(--_accent); margin: 0; }${hue}</style>
      <label class="field"><span class="label"><span></span><output></output></span>
      <input type="range" min="${min}" max="${max}" step="${step}"></label>`)
    this.$('.label span').textContent = this.label()
    const input = this.$('input')
    const throttle = this.throttle = createThrottle(value => this.emit(renderCommand(this.spec.cmd, value)), 150, globalThis, { answerMs: ANSWER_MS })
    this.paint = value => { if (this.spec.track === 'hue') input.style.setProperty('--thumb', `hsl(${(value - min) / (max - min) * 360} 100% 50%)`) }
    input.oninput = () => {
      this.hold()
      this.paint(input.value)
      this.$('output').textContent = input.value + unit
      throttle.call(input.value)
    }
    input.onchange = () => throttle.flush(input.value)
    this.dragging = false
    input.onpointerdown = () => { this.dragging = true }
    input.onpointerup = () => { this.dragging = false }
  }
  update() {
    if (this.dragging || this.held()) return
    const number = Number(this.value())
    const value = Number.isFinite(number) ? Math.min(this.spec.max, Math.max(this.spec.min, number)) : this.spec.min
    this.$('input').value = value
    this.paint(value)
    this.$('output').textContent = value + (this.spec.unit ?? '')
  }
  set state(state) { this.pendingUntil = 0; super.state = state; this.throttle?.answered() }
  disconnectedCallback() { this.throttle?.cancel() }
  get state() { return super.state }
})

define('io-w-select', class extends Widget {
  build() {
    this.html(`<style>select { min-height: 34px; padding: 0 8px; border: 1px solid var(--_line); border-radius: 8px; background: var(--_bg); }</style>
      <label class="field inline"><span class="label"></span><select></select></label>`)
    this.$('.label').textContent = this.label()
    for (const option of this.spec.options) this.$('select').add(new Option(option.label, option.value))
    this.$('select').onchange = event => {
      this.hold()
      this.emit(renderCommand(this.spec.cmd, event.target.value))
    }
  }
  update() {
    if (!this.held() && this.value() !== undefined) this.$('select').value = this.value()
  }
  set state(state) { this.pendingUntil = 0; super.state = state }
  get state() { return super.state }
})

define('io-w-color', class extends Widget {
  build() {
    this.html(`<style>input { width: 46px; height: 30px; padding: 0; border: 1px solid var(--_line); border-radius: 6px; background: none; }</style>
      <label class="field inline"><span class="label"></span><input type="color"></label>`)
    this.$('.label').textContent = this.label()
    const throttle = this.throttle = createThrottle(value => this.emit(renderCommand(this.spec.cmd, value)), 200, globalThis, { answerMs: ANSWER_MS })
    this.$('input').oninput = event => { this.hold(); throttle.call(event.target.value) }
    this.$('input').onchange = event => throttle.flush(event.target.value)
  }
  update() {
    if (!this.held() && /^#[0-9a-fA-F]{6}$/.test(this.value() ?? '')) this.$('input').value = this.value()
  }
  set state(state) { super.state = state; this.throttle?.answered() }
  get state() { return super.state }
  disconnectedCallback() { this.throttle?.cancel() }
})

define('io-w-value', class extends Widget {
  build() {
    this.html(`<div class="field inline"><span class="label"></span><strong></strong></div>`)
    this.$('.label').textContent = this.label()
  }
  update() {
    const value = this.value()
    this.$('strong').textContent = value === undefined || value === '' ? '—' : value + (this.spec.unit ?? '')
  }
})

define('io-w-gauge', class extends Widget {
  build() {
    this.html(`<style>
      .bar { height: 8px; border-radius: 4px; background: var(--_raised); overflow: hidden; }
      .bar span { display: block; height: 100%; background: var(--_accent); transition: width .3s; }
    </style><div class="field"><span class="label"><span></span><output></output></span>
    <div class="bar" role="meter" aria-valuemin="${this.spec.min}" aria-valuemax="${this.spec.max}"><span></span></div></div>`)
    this.$('.label span').textContent = this.label()
    this.$('.bar').setAttribute('aria-label', this.label())
  }
  update() {
    const number = Number(this.value())
    const known = this.value() !== undefined && this.value() !== '' && Number.isFinite(number)
    const { min, max, unit = '' } = this.spec
    this.$('output').textContent = known ? number + unit : '—'
    this.$('.bar span').style.width = known ? Math.min(100, Math.max(0, (number - min) / (max - min) * 100)) + '%' : 0
    if (known) this.$('.bar').setAttribute('aria-valuenow', number)
  }
})

define('io-w-pad', class extends Widget {
  build() {
    const keys = [['up', '위', '▲'], ['left', '왼쪽', '◀'], ['ok', '확인', '●'], ['right', '오른쪽', '▶'], ['down', '아래', '▼']]
    this.html(`<style>
      .pad { display: grid; grid-template-areas: '. up .' 'left ok right' '. down .'; grid-template-columns: repeat(3, 42px); gap: 4px; justify-content: center; }
      button { width: 42px; height: 42px; padding: 0; }
    </style><div class="field">${this.spec.label ? `<span class="label">${escape(this.spec.label)}</span>` : ''}<div class="pad">
      ${keys.map(([value, label, glyph]) => `<button style="grid-area:${value}" aria-label="${label}" data-value="${value}">${glyph}</button>`).join('')}
    </div></div>`)
    for (const button of this.shadowRoot.querySelectorAll('button')) {
      button.onclick = () => this.emit(renderCommand(this.spec.cmd, button.dataset.value))
    }
  }
})

// A short string such as a target CID. The input shows the device value until the user edits it;
// the send button or Enter sends the command.
define('io-w-text', class extends Widget {
  build() {
    this.html(`<style>
      .row { display: flex; gap: 6px; }
      input { flex: 1; min-width: 0; min-height: 34px; padding: 0 10px; border: 1px solid var(--_line); border-radius: 8px; background: var(--_bg); }
      input[aria-invalid=true] { border-color: #d33; }
      .error { margin: 0; color: #d33; font-size: 12px; }
    </style><form class="field"><label class="label"><span></span><output></output></label>
      <div class="row"><input type="text" autocomplete="off" spellcheck="false"><button type="submit">보내기</button></div>
      <p class="error" role="alert" hidden></p></form>`)
    const input = this.$('input')
    this.$('.label span').textContent = this.label()
    input.setAttribute('aria-label', this.label())
    input.maxLength = this.spec.maxLength
    this.dirty = false
    input.oninput = () => { this.dirty = true; this.showError('') }
    this.$('form').onsubmit = event => {
      event.preventDefault()
      if (this.disabled) return
      const result = textCommand(this.spec, input.value)
      if (!result.ok) return this.showError(result.error)
      input.value = input.value.trim()
      this.$('output').textContent = input.value
      this.dirty = false
      this.hold()
      this.emit(result.command)
    }
  }
  showError(message) {
    this.$('.error').textContent = message
    this.$('.error').hidden = !message
    if (message) this.$('input').setAttribute('aria-invalid', 'true')
    else this.$('input').removeAttribute('aria-invalid')
  }
  update() {
    if (this.held()) return
    const value = this.value() ?? ''
    this.$('output').textContent = value
    if (!this.dirty) this.$('input').value = value
  }
  set state(state) { this.pendingUntil = 0; super.state = state }
  get state() { return super.state }
})

// A picture the device sends on <cid>@<tag>. The card receives and decrypts it and sets .media
// ({ [tag]: { src, status, hasKey } }); this widget only draws it. With e2e it shows a key field and
// raises a bubbling 'media-key' event { tag, key } (an empty key clears it).
const IMAGE_NOTES = {
  waiting: '사진을 기다리는 중입니다.',
  plain: '암호화되지 않은 사진입니다.',
  e2e: 'E2E 키로 해독한 사진입니다.',
  'need-key': '암호화된 사진입니다. 장치에 넣은 E2E 키를 입력하세요.',
  'wrong-key': '키가 맞지 않아 사진을 풀 수 없습니다.',
}
define('io-w-image', class extends Widget {
  #media = {}
  editing = false
  set media(media) { this.#media = media ?? {}; if (this.built) this.refresh() }
  get media() { return this.#media }
  build() {
    this.html(`<style>
      .frame { display: grid; place-items: center; aspect-ratio: 4 / 3; overflow: hidden; border: 1px solid var(--_line); border-radius: 10px; background: var(--_raised); color: var(--_muted); }
      img { width: 100%; height: 100%; object-fit: contain; display: block; }
      [hidden] { display: none !important; }
      .note { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 0; color: var(--_muted); font-size: 12px; }
      .note button { min-height: 0; padding: 0; border: 0; background: none; color: var(--_accent); text-decoration: underline; font-size: 12px; }
      form { display: flex; gap: 6px; }
      form[hidden] { display: none; }
      input { flex: 1; min-width: 0; min-height: 34px; padding: 0 10px; border: 1px solid var(--_line); border-radius: 8px; background: var(--_bg); }
    </style><div class="field"><span class="label"></span><div class="frame"><img alt="" hidden><span class="empty">사진 없음</span></div>
      <p class="note" role="status"><span></span><button type="button" class="edit" hidden></button></p>
      <form hidden><input type="password" autocomplete="off" spellcheck="false" maxlength="64" placeholder="E2E 키" aria-label="E2E 키">
        <button type="submit">저장</button><button type="button" class="cancel">취소</button></form></div>`)
    this.$('.label').textContent = this.label() || '사진'
    this.$('img').alt = this.spec.label || '장치 사진'
    const input = this.$('input')
    input.oninput = () => { this.$('form button[type=submit]').textContent = input.value ? '저장' : '지우기' }
    this.$('.edit').onclick = () => { this.editing = true; this.update(); input.focus() }
    this.$('.cancel').onclick = () => { this.editing = false; input.value = ''; this.update() }
    this.$('form').onsubmit = event => {
      event.preventDefault()
      this.dispatchEvent(new CustomEvent('media-key', { detail: { tag: this.spec.tag, key: input.value }, bubbles: true, composed: true }))
      input.value = ''
      this.editing = false
      this.update()
    }
  }
  update() {
    const item = this.#media[this.spec.tag] ?? { status: 'waiting' }
    const img = this.$('img')
    if (item.src) { if (img.getAttribute('src') !== item.src) img.src = item.src } else img.removeAttribute('src')
    img.hidden = !item.src
    this.$('.empty').hidden = Boolean(item.src)
    this.$('.empty').textContent = item.status === 'need-key' || item.status === 'wrong-key' ? '🔒 잠긴 사진' : '사진 없음'
    // A key typed here only opens pictures; the device must encrypt with it too.
    this.$('.note span').textContent = item.status === 'plain' && item.hasKey ? '암호화되지 않은 사진입니다. 장치가 E2E 키 없이 보내고 있어 넣은 키는 쓰이지 않습니다. 장치에도 같은 키를 넣으세요.' : IMAGE_NOTES[item.status] ?? ''
    const askKey = Boolean(this.spec.e2e) && (this.editing || item.status === 'need-key' || item.status === 'wrong-key')
    this.$('form').hidden = !askKey
    this.$('.cancel').hidden = !this.editing
    this.$('.edit').hidden = !this.spec.e2e || askKey
    this.$('.edit').textContent = item.hasKey ? '키 바꾸기' : '키 입력'
    this.$('form button[type=submit]').textContent = this.$('input').value ? '저장' : '지우기'
  }
})

// Builds the widget tree of a device schema. Set .controls once, then .state on every update.
define('io-controls', class extends HTMLElement {
  #controls = []
  #state = {}
  #disabled = false
  #media = {}
  constructor() {
    super()
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [base]
  }
  // Pictures for image widgets, by tag (see io-w-image).
  set media(media) {
    this.#media = media ?? {}
    for (const widget of this.shadowRoot.querySelectorAll('io-w-image')) widget.media = this.#media
  }
  set controls(controls) {
    this.#controls = controls ?? []
    this.shadowRoot.replaceChildren(styleOf(), ...this.#controls.map(spec => this.element(spec)))
    this.push()
  }
  set state(state) { this.#state = state ?? {}; this.push() }
  set disabled(disabled) { this.#disabled = disabled; this.push() }
  element(spec) {
    if (spec.widget === 'section' && spec.collapsed) {
      const box = document.createElement('details')
      box.append(Object.assign(document.createElement('summary'), { textContent: spec.label || '자세히' }))
      const body = Object.assign(document.createElement('div'), { className: 'details-body' })
      body.append(...spec.children.map(child => this.element(child)))
      box.append(body)
      return box
    }
    if (spec.widget === 'row' || spec.widget === 'section') {
      const box = document.createElement(spec.widget === 'row' ? 'div' : 'fieldset')
      box.className = spec.widget
      if (spec.label) box.append(Object.assign(document.createElement('legend'), { textContent: spec.label }))
      box.append(...spec.children.map(child => this.element(child)))
      return box
    }
    const element = document.createElement(`io-w-${spec.widget}`)
    element.spec = spec
    return element
  }
  push() {
    for (const widget of this.shadowRoot.querySelectorAll('*')) {
      if (!widget.spec) continue
      widget.disabled = this.#disabled
      if (widget.localName === 'io-w-image') widget.media = this.#media
      widget.state = this.#state
    }
  }
})

function styleOf() {
  const style = document.createElement('style')
  style.textContent = `
    :host { display: flex; flex-direction: column; gap: 12px; }
    .row { display: flex; flex-wrap: wrap; gap: 8px; }
    fieldset { display: flex; flex-direction: column; gap: 10px; margin: 0; padding: 10px 12px 12px; border: 1px solid var(--_line); border-radius: 10px; min-width: 0; }
    legend { padding: 0 6px; color: var(--_muted); font-size: 13px; }
    summary { cursor: pointer; color: var(--_muted); font-size: 13px; padding: 4px 0; }
    .details-body { display: flex; flex-direction: column; gap: 12px; padding-top: 8px; }`
  return style
}
