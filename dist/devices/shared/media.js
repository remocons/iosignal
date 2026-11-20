// Pictures for image widgets: which tags a screen shows, and turning a received payload into image bytes.
// A device sends JPEG (or PNG) on <cid>@<tag>, either plain or with signal_e2e (an ENC_PACK only the key opens).

/** Image widgets of a screen, nested ones included: [{ tag, e2e }] (one per tag). e2e: false, true or 'session'. */
export function imageWidgets(controls) {
	const found = new Map();
	const walk = (list) => {
		for (const c of list ?? []) {
			if (c.widget === 'image' && c.tag && !found.has(c.tag)) found.set(c.tag, { tag: c.tag, e2e: c.e2e === 'session' ? 'session' : Boolean(c.e2e) });
			if (c.children) walk(c.children);
		}
	};
	walk(controls);
	return [...found.values()];
}

// The picture format from its first bytes: 'image/jpeg', 'image/png', or '' for anything else.
export function imageType(bytes) {
	if (!(bytes instanceof Uint8Array) || bytes.length < 8) return '';
	if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
	if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
	return '';
}

/**
 * @param {Uint8Array} payload  received binary payload
 * @param {string} key          E2E key, '' when none is set
 * @param {(data: Uint8Array, key: string) => ({ data: Uint8Array } | undefined)} decrypt  remote.decrypt_e2e
 * @returns {{ bytes: Uint8Array | null, type: string, status: 'plain' | 'e2e' | 'need-key' | 'wrong-key' | 'invalid' }}
 */
export function decodeImage(payload, key, decrypt) {
	if (!(payload instanceof Uint8Array) || payload.length === 0) return { bytes: null, type: '', status: 'invalid' };
	const plain = imageType(payload);
	if (plain) return { bytes: payload, type: plain, status: 'plain' };
	if (!key) return { bytes: null, type: '', status: 'need-key' };
	let opened;
	try {
		opened = decrypt(payload, key);
	} catch {
		opened = undefined;
	}
	const data = opened?.data;
	const type = imageType(data);
	if (!type) return { bytes: null, type: '', status: 'wrong-key' };
	return { bytes: data, type, status: 'e2e' };
}

// Keys stay in this browser only, per device and tag. Storage may be blocked: then a key lasts for the page.
const memory = new Map();
const storageKey = (cid, tag) => `iosignal-e2e:${cid}:${tag}`;

export function loadKey(cid, tag) {
	try {
		return localStorage.getItem(storageKey(cid, tag)) ?? memory.get(storageKey(cid, tag)) ?? '';
	} catch {
		return memory.get(storageKey(cid, tag)) ?? '';
	}
}

export function saveKey(cid, tag, key) {
	const name = storageKey(cid, tag);
	if (key) memory.set(name, key);
	else memory.delete(name);
	try {
		if (key) localStorage.setItem(name, key);
		else localStorage.removeItem(name);
	} catch {}
}
