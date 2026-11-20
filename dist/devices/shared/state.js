// 장치 상태(<id>$state) 형식: "on=1;level=70". 원문은 '_' 키로 함께 준다.
const KEY_PATTERN = /^[A-Za-z_][\w-]{0,31}$/;

export function parseState(raw) {
	if (raw == null) return {};
	if (typeof raw === 'object' && !Array.isArray(raw) && !(raw instanceof Uint8Array)) {
		const state = {};
		for (const [key, value] of Object.entries(raw)) {
			if (KEY_PATTERN.test(key) && value != null && typeof value !== 'object') state[key] = String(value);
		}
		return state;
	}
	const text = String(raw).trim();
	if (!text) return {};
	const state = { _: text };
	for (const part of text.split(';')) {
		const index = part.indexOf('=');
		if (index <= 0) continue;
		const key = part.slice(0, index).trim();
		if (KEY_PATTERN.test(key)) state[key] = part.slice(index + 1).trim();
	}
	return state;
}

export function formatState(state) {
	return Object.entries(state)
		.filter(([key]) => key !== '_' && KEY_PATTERN.test(key))
		.map(([key, value]) => `${key}=${value}`)
		.join(';');
}

export function isTruthy(value) {
	return ['1', 'on', 'true'].includes(String(value ?? '').toLowerCase());
}
