// 선언형 UI 스키마(v1) 검증과 생성.
// 스키마는 데이터일 뿐이며 HTML/스크립트를 담지 않는다. 사용자 등록 스키마도 같은 검증을 통과해야 렌더링된다.
import { parseType } from './typeName.js';
import { renderCommand } from './command.js';

export const SCHEMA_VERSION = 1;
export const PAD_VALUES = ['up', 'down', 'left', 'right', 'ok'];

const LIMITS = { controls: 60, depth: 3, options: 24, label: 40, title: 60, cmd: 64, traits: 12, json: 16 * 1024 };
const KEY = /^[A-Za-z_][\w-]{0,31}$/;
const TRAIT = /^[a-z][a-z0-9-]{0,23}$/;
const ICON = /^[a-z0-9_]{1,40}$/;
// 명령은 한 줄의 출력 가능한 문자만 허용한다. ';'는 상태 구분자라 값 자리 밖에서만 쓴다.
const CMD = /^[^\u0000-\u001f\u007f]{1,64}$/;
// text 위젯이 보내는 값: 한 줄의 출력 가능한 문자, ';' 제외.
export const TEXT_VALUE = /^[^\u0000-\u001f\u007f;]*$/;

export const WIDGET_NAMES = ['button', 'buttons', 'switch', 'slider', 'select', 'color', 'value', 'gauge', 'pad', 'text', 'image', 'row', 'section'];

// Widgets an application adds (registerWidget): name -> normalize(input, { errors, path, out }).
const extraWidgets = new Map();

/**
 * Lets screens use a widget of the application's own, drawn by its custom element io-w-<name>.
 * normalize checks the widget's fields and copies the known ones to out (label is done already).
 * A screen with an unknown widget is still refused, so devices that use one send b= buttons too.
 * @param {string} name a-z, 0-9, '-' (not a widget of these rules)
 * @param {(input: object, ctx: { errors: string[], path: string, out: object }) => void} normalize
 */
export function registerWidget(name, normalize) {
	if (typeof name !== 'string' || !/^[a-z][a-z0-9-]{0,31}$/.test(name) || WIDGET_NAMES.includes(name)) {
		throw new TypeError(`widget name: a-z, 0-9 and '-', not one of ${WIDGET_NAMES.join(', ')}`);
	}
	if (typeof normalize !== 'function') throw new TypeError('registerWidget needs a normalize function');
	extraWidgets.set(name, normalize);
}
const CONTAINERS = new Set(['row', 'section']);

export function parseList(text) {
	if (Array.isArray(text)) return text.map(String).map((s) => s.trim()).filter(Boolean);
	if (typeof text !== 'string') return [];
	return text.split(',').map((s) => s.trim()).filter(Boolean);
}

function str(value, max) {
	return typeof value === 'string' && value.trim() && value.length <= max ? value.trim() : null;
}

function num(value, fallback) {
	return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalizeOptions(options, errors, path) {
	if (!Array.isArray(options) || options.length === 0) {
		errors.push(`${path}.options: 하나 이상의 선택지가 필요합니다.`);
		return [];
	}
	if (options.length > LIMITS.options) errors.push(`${path}.options: 최대 ${LIMITS.options}개입니다.`);
	return options.slice(0, LIMITS.options).map((option, i) => {
		const raw = typeof option === 'string' ? { label: option, value: option } : option;
		const value = raw && (typeof raw.value === 'string' || typeof raw.value === 'number') ? String(raw.value) : null;
		const label = raw && str(raw.label ?? value, LIMITS.label);
		if (value == null || !label || value.length > LIMITS.cmd) errors.push(`${path}.options[${i}]: label/value가 올바르지 않습니다.`);
		return { label: label || String(value ?? ''), value: value ?? '' };
	});
}

function normalizeCmd(value, fallback, errors, path) {
	const cmd = value === undefined ? fallback : value;
	if (typeof cmd !== 'string' || !CMD.test(cmd)) {
		errors.push(`${path}: 명령은 1~${LIMITS.cmd}자의 한 줄 문자열이어야 합니다.`);
		return fallback || '{v}';
	}
	return cmd;
}

function normalizeKey(value, fallback, errors, path) {
	const key = value === undefined ? fallback : value;
	if (typeof key !== 'string' || !KEY.test(key)) {
		errors.push(`${path}.key: 영문/숫자/_/- 로 된 상태 키가 필요합니다.`);
		return fallback || '_';
	}
	return key;
}

function normalizeControl(input, errors, path, depth, counter) {
	if (!input || typeof input !== 'object' || Array.isArray(input)) {
		errors.push(`${path}: 객체여야 합니다.`);
		return null;
	}
	const widget = input.widget;
	if (!WIDGET_NAMES.includes(widget) && !extraWidgets.has(widget)) {
		errors.push(`${path}.widget: 지원하지 않는 위젯입니다 (${[...WIDGET_NAMES, ...extraWidgets.keys()].join(', ')}).`);
		return null;
	}
	if (++counter.count > LIMITS.controls) {
		if (counter.count === LIMITS.controls + 1) errors.push(`컨트롤은 최대 ${LIMITS.controls}개입니다.`);
		return null;
	}
	const out = { widget };
	const label = input.label === undefined ? null : str(input.label, LIMITS.label);
	if (input.label !== undefined && !label) errors.push(`${path}.label: 1~${LIMITS.label}자 문자열이어야 합니다.`);
	if (label) out.label = label;

	if (extraWidgets.has(widget)) {
		try {
			extraWidgets.get(widget)(input, { errors, path, out });
		} catch (error) {
			errors.push(`${path}: ${error?.message ?? error}`);
		}
		return out;
	}
	switch (widget) {
		case 'button':
			out.cmd = normalizeCmd(input.cmd, undefined, errors, `${path}.cmd`);
			if (!out.label) out.label = out.cmd;
			break;
		case 'buttons':
			out.options = normalizeOptions(input.options, errors, path);
			out.cmd = normalizeCmd(input.cmd, '{v}', errors, `${path}.cmd`);
			if (input.key !== undefined) out.key = normalizeKey(input.key, undefined, errors, path);
			break;
		case 'switch':
			out.key = normalizeKey(input.key, 'on', errors, path);
			out.cmdOn = normalizeCmd(input.cmdOn, 'on', errors, `${path}.cmdOn`);
			out.cmdOff = normalizeCmd(input.cmdOff, 'off', errors, `${path}.cmdOff`);
			break;
		case 'slider':
		case 'gauge': {
			out.key = normalizeKey(input.key, undefined, errors, path);
			out.min = num(input.min, 0);
			out.max = num(input.max, 100);
			if (out.max <= out.min) errors.push(`${path}: max는 min보다 커야 합니다.`);
			if (widget === 'slider') {
				out.step = num(input.step, 1);
				if (out.step <= 0) errors.push(`${path}.step: 0보다 커야 합니다.`);
				out.cmd = normalizeCmd(input.cmd, `${out.key}={v}`, errors, `${path}.cmd`);
				// track: 'hue' draws the color wheel on the track (0-360 = red → red). Other values are ignored.
				if (input.track === 'hue') out.track = 'hue';
			}
			const unit = input.unit === undefined ? null : str(input.unit, 8);
			if (unit) out.unit = unit;
			break;
		}
		case 'select':
			out.key = normalizeKey(input.key, undefined, errors, path);
			out.options = normalizeOptions(input.options, errors, path);
			out.cmd = normalizeCmd(input.cmd, `${out.key}={v}`, errors, `${path}.cmd`);
			break;
		case 'color':
			out.key = normalizeKey(input.key, 'color', errors, path);
			out.cmd = normalizeCmd(input.cmd, `${out.key}={v}`, errors, `${path}.cmd`);
			break;
		case 'value': {
			out.key = normalizeKey(input.key, undefined, errors, path);
			const unit = input.unit === undefined ? null : str(input.unit, 8);
			if (unit) out.unit = unit;
			break;
		}
		case 'pad':
			out.cmd = normalizeCmd(input.cmd, '{v}', errors, `${path}.cmd`);
			break;
		case 'text': {
			out.key = normalizeKey(input.key, undefined, errors, path);
			out.cmd = normalizeCmd(input.cmd, `${out.key}={v}`, errors, `${path}.cmd`);
			if (!out.cmd.includes('{v}')) errors.push(`${path}.cmd: 입력값 자리 {v}가 필요합니다.`);
			out.maxLength = LIMITS.cmd;
			if (input.maxLength !== undefined) {
				if (Number.isInteger(input.maxLength) && input.maxLength >= 1 && input.maxLength <= LIMITS.cmd) out.maxLength = input.maxLength;
				else errors.push(`${path}.maxLength: 1~${LIMITS.cmd} 정수여야 합니다.`);
			}
			break;
		}
		case 'image':
			// A picture the device sends as binary JPEG on <cid>@<tag> (not retained, no '$').
			// e2e: true, the app may need a key to decrypt it (signal_e2e); plain JPEG is shown as it is.
			// e2e: 'session', pictures only this card can open: a session key agreed with the device (e2eSession.js).
			out.tag = normalizeKey(input.tag, 'image', errors, path);
			if (input.e2e === true || input.e2e === 'session') out.e2e = input.e2e;
			else if (input.e2e !== undefined && input.e2e !== false) errors.push(`${path}.e2e: true 또는 "session"이어야 합니다.`);
			break;
		case 'row':
		case 'section':
			// collapsed: a section that starts folded behind a details toggle (section only).
			if (widget === 'section' && input.collapsed === true) out.collapsed = true;
			if (depth >= LIMITS.depth) {
				errors.push(`${path}: 중첩은 최대 ${LIMITS.depth}단계입니다.`);
				out.children = [];
				break;
			}
			if (!Array.isArray(input.children)) errors.push(`${path}.children: 배열이 필요합니다.`);
			out.children = (Array.isArray(input.children) ? input.children : [])
				.map((child, i) => normalizeControl(child, errors, `${path}.children[${i}]`, depth + 1, counter))
				.filter(Boolean);
			break;
	}
	return out;
}

/**
 * 스키마를 검증하고 알려진 필드만 남긴 사본을 돌려준다.
 * @param {unknown} input
 * @param {{requireType?: boolean}} [options]
 */
export function validateSchema(input, { requireType = false } = {}) {
	const errors = [];
	if (typeof input === 'string') {
		if (input.length > LIMITS.json) return { ok: false, errors: [`스키마는 ${LIMITS.json / 1024}KB 이하여야 합니다.`], schema: null };
		try {
			input = JSON.parse(input);
		} catch (e) {
			return { ok: false, errors: ['JSON 형식이 올바르지 않습니다: ' + e.message], schema: null };
		}
	}
	if (!input || typeof input !== 'object' || Array.isArray(input)) {
		return { ok: false, errors: ['스키마는 JSON 객체여야 합니다.'], schema: null };
	}
	if (input.schema !== SCHEMA_VERSION) errors.push(`schema: ${SCHEMA_VERSION} 이어야 합니다.`);

	const schema = { schema: SCHEMA_VERSION };
	if (input.type !== undefined || requireType) {
		const parsed = parseType(input.type);
		if (!parsed) errors.push('type: <이름>.<major> 형식이어야 합니다. 예) dimmer.1');
		else schema.type = parsed.type;
	}
	if (input.rev !== undefined) {
		if (Number.isInteger(input.rev) && input.rev >= 0) schema.rev = input.rev;
		else errors.push('rev: 0 이상의 정수여야 합니다.');
	}
	if (input.title !== undefined) {
		const title = str(input.title, LIMITS.title);
		if (title) schema.title = title;
		else errors.push(`title: 1~${LIMITS.title}자 문자열이어야 합니다.`);
	}
	if (input.icon !== undefined) {
		if (typeof input.icon === 'string' && ICON.test(input.icon)) schema.icon = input.icon;
		else errors.push('icon: Material Symbols 이름(영문 소문자, 숫자, _)이어야 합니다.');
	}
	if (input.traits !== undefined) {
		if (!Array.isArray(input.traits) || input.traits.length > LIMITS.traits || !input.traits.every((t) => typeof t === 'string' && TRAIT.test(t))) {
			errors.push(`traits: 최대 ${LIMITS.traits}개의 소문자 기능 이름 배열이어야 합니다.`);
		} else {
			schema.traits = [...new Set(input.traits)];
		}
	}
	if (input.view !== undefined) {
		// The device's picture (view.js): kept as it is when it names a kind; the drawing checks every value.
		if (input.view && typeof input.view === 'object' && !Array.isArray(input.view) && typeof input.view.kind === 'string' && JSON.stringify(input.view).length <= 512) {
			schema.view = input.view;
		} else errors.push('view: kind가 있는 512바이트 이하의 객체여야 합니다.');
	}
	if (!Array.isArray(input.controls) || input.controls.length === 0) {
		errors.push('controls: 하나 이상의 컨트롤 배열이 필요합니다.');
		schema.controls = [];
	} else {
		const counter = { count: 0 };
		schema.controls = input.controls
			.map((control, i) => normalizeControl(control, errors, `controls[${i}]`, 1, counter))
			.filter(Boolean);
	}
	return { ok: errors.length === 0, errors, schema: errors.length === 0 ? schema : null };
}

/**
 * text 위젯 입력을 검사하고 보낼 명령을 만든다.
 * @returns {{ok: true, command: string} | {ok: false, error: string}}
 */
export function textCommand(spec, input) {
	const value = typeof input === 'string' ? input.trim() : '';
	const max = spec.maxLength ?? LIMITS.cmd;
	if (!value) return { ok: false, error: '값을 입력하세요.' };
	if (value.length > max) return { ok: false, error: `최대 ${max}자입니다.` };
	if (!TEXT_VALUE.test(value)) return { ok: false, error: "한 줄 문자만 쓸 수 있고 ';'는 쓸 수 없습니다." };
	const command = renderCommand(spec.cmd, value);
	if (command.length > LIMITS.cmd) return { ok: false, error: `명령이 ${LIMITS.cmd}자를 넘습니다.` };
	return { ok: true, command };
}

/** info.ui("on,off,toggle")를 버튼 스키마로 바꾼다. */
export function schemaFromUi(ui) {
	const buttons = parseList(ui);
	const controls = [];
	if (buttons.length) controls.push({ widget: 'buttons', options: buttons.slice(0, LIMITS.options).map((b) => ({ label: b, value: b })), cmd: '{v}' });
	controls.push({ widget: 'value', label: '현재 상태', key: '_' });
	return { schema: SCHEMA_VERSION, controls };
}

/** 사용할 스키마를 고른다. 우선순위: 장치의 schema 또는 type → ui */
export function pickSchema({ typeSchema, ui }) {
	if (typeSchema) return { source: 'type', schema: typeSchema };
	return { source: 'ui', schema: schemaFromUi(ui) };
}
