// <vdevice-view>: draws a device's picture (its $view, or its type's default view) from its state.
// The drawing and every check on the values are in ../shared/view.js, shared with remocon.kr.
// show() returns false and hides the element for a picture it does not draw (an unknown kind).
import { renderView, VIEW_CSS } from '../shared/view.js'
import { base } from './tokens.css.js'

const style = new CSSStyleSheet()
style.replaceSync(`
  :host { display: block; --view-bg: var(--_bg); --view-raised: var(--_raised); --view-line: var(--_line); --view-muted: var(--_muted); --view-accent: var(--_accent); }
  :host([hidden]) { display: none; }
  ${VIEW_CSS}
`)

class VDeviceView extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [base, style]
    this.shadowRoot.innerHTML = '<div class="view-stage"></div>'
  }
  // Updates the existing nodes when the markup has the same shape, so CSS transitions and spin keep running.
  show(view, state = {}) {
    const markup = renderView(view, state)
    this.hidden = !markup
    if (!markup) return false
    const kind = view.kind
    const stage = this.shadowRoot.querySelector('.view-stage')
    if (this.markup === markup) return true
    this.markup = markup
    const next = document.createElement('div')
    next.innerHTML = markup
    const current = stage.firstElementChild
    const fresh = next.firstElementChild
    if (current && this.kind === kind && morph(current, fresh)) return true
    this.kind = kind
    stage.replaceChildren(fresh)
    return true
  }
}

function morph(from, to) {
  if (from.nodeName !== to.nodeName || from.childNodes.length !== to.childNodes.length) return false
  for (const { name, value } of [...to.attributes]) if (from.getAttribute(name) !== value) from.setAttribute(name, value)
  for (let i = 0; i < to.childNodes.length; i++) {
    const a = from.childNodes[i]
    const b = to.childNodes[i]
    if (a.nodeType === Node.TEXT_NODE) {
      if (a.textContent !== b.textContent) a.textContent = b.textContent
    } else if (a.nodeType === Node.ELEMENT_NODE && !morph(a, b)) return false
  }
  return true
}

customElements.get('vdevice-view') ?? customElements.define('vdevice-view', VDeviceView)
