// A device's picture ($view, or the default view of its type file), drawn from its state (device rules, "그림 $view").
//   { kind: 'bulb' | 'fan' | 'relays' | 'thermo' | 'blind' | 'text', …names of the state keys to read }
// Both the picture and the state come from the bus: every value is escaped or checked before it is drawn.
// renderView() returns markup for an element styled with VIEW_CSS, or '' for a kind it does not know.
import { isTruthy } from './state.js';

export const VIEW_KINDS = ['bulb', 'fan', 'relays', 'thermo', 'blind', 'text'];

// Colors come from custom properties the page sets: --view-bg, --view-line, --view-muted, --view-accent.
export const VIEW_CSS = `
.view-stage { display: grid; place-items: center; height: 132px; border-radius: 10px; background: var(--view-raised, rgba(127,127,127,.12)); overflow: hidden; }
.view-stage svg { display: block; height: 112px; width: auto; max-width: 100%; overflow: visible; }
.bulb-glass { transition: fill .2s, opacity .2s, filter .2s; }
.blades { transform-origin: 60px 54px; animation: view-spin var(--spin, 1s) linear infinite; animation-play-state: var(--play, paused); }
@keyframes view-spin { to { transform: rotate(360deg); } }
.slats { transition: height .2s linear; }
.relays { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; padding: 8px; }
.relay { display: flex; flex-direction: column; align-items: center; gap: 6px; font: 12px ui-monospace, Menlo, monospace; color: var(--view-muted, #888); }
.relay i { width: 26px; height: 26px; border-radius: 50%; border: 2px solid var(--view-line, #ccc); background: var(--view-bg, transparent); transition: background .15s, box-shadow .15s; }
.relay.on i { background: var(--view-accent, #0b7a6b); border-color: var(--view-accent, #0b7a6b); box-shadow: 0 0 12px var(--view-accent, #0b7a6b); }
.reading { display: flex; gap: 22px; }
.reading div { text-align: center; }
.reading b { display: block; font-size: 30px; font-weight: 600; font-variant-numeric: tabular-nums; }
.reading span { color: var(--view-muted, #888); font-size: 12px; }
.view-text { padding: 8px 12px; font-size: 22px; font-weight: 600; text-align: center; overflow-wrap: anywhere; }
@media (prefers-reduced-motion: reduce) { .blades { animation: none; } }
`;

export const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
// A state key named by the picture, or its default. Only a plain key name is used.
const keyOf = (view, field, fallback) => (typeof view[field] === 'string' && /^[A-Za-z_][\w-]{0,31}$/.test(view[field]) ? view[field] : fallback);
const number = (value, min, max, fallback) => {
	const n = Number(value);
	return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

const scenes = {
	bulb: (view, state) => {
		const on = isTruthy(state[keyOf(view, 'on', 'on')]);
		const level = number(state[keyOf(view, 'level', 'level')] ?? 100, 0, 100, 100);
		const raw = state[keyOf(view, 'color', 'color')];
		const color = /^#[0-9a-f]{6}$/i.test(raw ?? '') ? raw : '#ffc94d';
		const opacity = 0.3 + (level / 100) * 0.7;
		return `<svg viewBox="0 0 120 120" role="img" aria-label="전구 ${on ? `켜짐 ${level}%` : '꺼짐'}">
      <path class="bulb-glass" d="M60 10a36 36 0 0 0-22 64c5 4 8 9 8 14h28c0-5 3-10 8-14a36 36 0 0 0-22-64z"
        style="fill:${on ? color : 'var(--view-bg, transparent)'};opacity:${on ? opacity : 1};${on ? `filter:drop-shadow(0 0 ${6 + level / 6}px ${color})` : ''}" stroke="var(--view-muted, #888)" stroke-width="2"/>
      <rect x="47" y="92" width="26" height="6" rx="2" fill="var(--view-muted, #888)"/><rect x="50" y="101" width="20" height="6" rx="2" fill="var(--view-muted, #888)"/></svg>`;
	},
	fan: (view, state) => {
		const on = isTruthy(state[keyOf(view, 'on', 'on')]);
		const speed = number(state[keyOf(view, 'speed', 'speed')] ?? 1, 0, 10, 0);
		const blade = (angle) => `<path transform="rotate(${angle} 60 54)" d="M60 54c-4-16 2-34 12-38 8 8 2 28-12 38z" fill="var(--view-accent, #0b7a6b)"/>`;
		return `<svg viewBox="0 0 120 120" role="img" aria-label="선풍기 ${on ? `${speed}단` : '꺼짐'}" style="--spin:${1.2 / Math.max(speed, 1)}s;--play:${on ? 'running' : 'paused'}">
      <rect x="56" y="60" width="8" height="46" fill="var(--view-muted, #888)"/><rect x="36" y="104" width="48" height="7" rx="3" fill="var(--view-muted, #888)"/>
      <circle cx="60" cy="54" r="44" fill="none" stroke="var(--view-line, #ccc)" stroke-width="3"/>
      <g class="blades">${blade(0)}${blade(120)}${blade(240)}</g><circle cx="60" cy="54" r="7" fill="var(--view-muted, #888)"/></svg>`;
	},
	relays: (view, state) => {
		const keys = (Array.isArray(view.keys) ? view.keys : Object.keys(state)).filter((key) => typeof key === 'string' && key !== '_').slice(0, 16);
		return `<div class="relays">${keys.map((key) => `<div class="relay${isTruthy(state[key]) ? ' on' : ''}"><i></i>${escapeHtml(key)}</div>`).join('')}</div>`;
	},
	thermo: (view, state) => `<div class="reading">
    <div><b>${escapeHtml(state[keyOf(view, 'temp', 'temp')] ?? '—')}°</b><span>온도</span></div>
    <div><b>${escapeHtml(state[keyOf(view, 'hum', 'hum')] ?? '—')}%</b><span>습도</span></div></div>`,
	blind: (view, state) => {
		const position = number(state[keyOf(view, 'position', 'position')] ?? 0, 0, 100, 0);
		const height = 86 * (1 - position / 100);
		return `<svg viewBox="0 0 120 120" role="img" aria-label="블라인드 ${position}% 열림">
      <rect x="16" y="14" width="88" height="92" rx="3" fill="var(--view-bg, transparent)" stroke="var(--view-muted, #888)" stroke-width="2"/>
      <circle cx="84" cy="34" r="9" fill="#ffc94d"/>
      <defs><pattern id="slat" width="10" height="8" patternUnits="userSpaceOnUse"><rect width="10" height="6.5" fill="var(--view-muted, #888)"/></pattern></defs>
      <rect class="slats" x="18" y="16" width="84" height="${height}" fill="url(#slat)"/></svg>`;
	},
	text: (view, state) => {
		const key = keyOf(view, 'key', '_');
		return `<div class="view-text">${escapeHtml(state[key] ?? state._ ?? '')}</div>`;
	},
};

// Kinds an application adds (registerView): kind -> render(view, state) returning markup.
const extraScenes = new Map();
const known = kind => VIEW_KINDS.includes(kind) || extraScenes.has(kind);

/**
 * Lets an application draw a picture kind of its own. render gets the $view object and the parsed state and
 * returns markup; everything in them came from the bus, so it must escape what it shows (see escapeHtml).
 * Apps without it skip the picture, as the rules say for an unknown kind.
 * @param {string} kind a-z, 0-9, '-' (not a kind of these rules)
 * @param {(view: object, state: object) => string} render
 */
export function registerView(kind, render) {
	if (typeof kind !== 'string' || !/^[a-z][a-z0-9-]{0,31}$/.test(kind) || VIEW_KINDS.includes(kind)) {
		throw new TypeError(`view kind: a-z, 0-9 and '-', not one of ${VIEW_KINDS.join(', ')}`);
	}
	if (typeof render !== 'function') throw new TypeError('registerView needs a render function');
	extraScenes.set(kind, render);
}

/** The picture to draw: the device's own $view, or the default view of its type file, or null. */
export function pickView({ view, typeView } = {}) {
	for (const candidate of [view, typeView]) {
		if (candidate && typeof candidate === 'object' && known(candidate.kind)) return candidate;
	}
	return null;
}

/** Markup for a picture and a parsed state ({ key: value }), or '' for a kind this app does not draw. */
export function renderView(view, state = {}) {
	if (!view || typeof view !== 'object' || !known(view.kind)) return '';
	const parsed = state && typeof state === 'object' ? state : {};
	if (extraScenes.has(view.kind)) {
		try { return String(extraScenes.get(view.kind)(view, parsed) ?? ''); } catch { return ''; }
	}
	return scenes[view.kind](view, parsed);
}
