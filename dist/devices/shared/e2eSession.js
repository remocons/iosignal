// Session keys for pictures from camera-session.1 devices (the Arduino example esp32cam-session).
// The card and the camera agree on a key for this card only (X25519), each side proving the device's E2E key
// with HMAC-SHA256; HKDF-SHA256 turns the shared secret into the session key, given to decrypt_e2e() as 64 hex
// characters. The card's X25519 secret is a non-extractable CryptoKey kept only for one exchange, so a key read
// from the device or this browser later does not open pictures recorded before.
// The same steps are in the example's E2ESession.h:
//   card   -> <cid>@e2e-hello      [1]                         ask for a challenge
//   camera -> <cid>@e2e-challenge  [1][reason][nonce 16][holder 8]   (holder: SHA-256(A) of the session's card,
//             or for refused / busy that of the hello being answered)
//   card   -> <cid>@e2e-hello      [1][A 32][HMAC(K, "e2e-hello" 1 nonce A)]
//   camera -> <cid>@e2e-ready      [1][B 32][HMAC(K, "e2e-ready" 1 nonce A B)]
//   key = HKDF-SHA256(ikm = X25519(a, B), salt = K, info = "iosignal-e2e-session/1" nonce A B, 32 bytes)

export const VERSION = 1;
export const TAGS = { hello: 'e2e-hello', challenge: 'e2e-challenge', ready: 'e2e-ready' };
export const REASON = { start: 0, request: 1, rotate: 2, refused: 3, busy: 4 };
const NONCE = 16, PUB = 32, MAC = 32, HOLDER = 8;
const encoder = new TextEncoder();
const INFO_LABEL = encoder.encode('iosignal-e2e-session/1');

const concat = (...parts) => {
	const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
	let at = 0;
	for (const p of parts) { out.set(p, at); at += p.length; }
	return out;
};
const equal = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
export const toHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

/** Whether this browser has X25519 in WebCrypto. */
export async function supported(subtle = globalThis.crypto?.subtle) {
	if (!subtle) return false;
	try {
		await subtle.generateKey({ name: 'X25519' }, false, ['deriveBits']);
		return true;
	} catch {
		return false;
	}
}

/** [1][reason][nonce 16][holder 8] → { reason, nonce, holder }, null for anything else. */
export function parseChallenge(bytes) {
	if (!(bytes instanceof Uint8Array) || bytes.length !== 2 + NONCE + HOLDER || bytes[0] !== VERSION) return null;
	return { reason: bytes[1], nonce: bytes.slice(2, 2 + NONCE), holder: bytes.slice(2 + NONCE) };
}

async function hmac(subtle, key, label, ...parts) {
	const k = await subtle.importKey('raw', encoder.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
	return new Uint8Array(await subtle.sign('HMAC', k, concat(encoder.encode(label), Uint8Array.of(VERSION), ...parts)));
}

export async function holderOf(subtle, publicKey) {
	return new Uint8Array(await subtle.digest('SHA-256', publicKey)).slice(0, HOLDER);
}

/** The hello for a challenge nonce: [1][A][mac]. */
export async function helloMessage(subtle, key, nonce, publicKey) {
	return concat(Uint8Array.of(VERSION), publicKey, await hmac(subtle, key, 'e2e-hello', nonce, publicKey));
}

/**
 * Checks the camera's ready message and derives the session key (hex), or null when it is not the answer to
 * this hello (another card's, or a camera with another key).
 */
export async function sessionFromReady(subtle, key, nonce, publicKey, privateKey, ready) {
	if (!(ready instanceof Uint8Array) || ready.length !== 1 + PUB + MAC || ready[0] !== VERSION) return null;
	const b = ready.slice(1, 1 + PUB);
	if (!equal(await hmac(subtle, key, 'e2e-ready', nonce, publicKey, b), ready.slice(1 + PUB))) return null;
	const peer = await subtle.importKey('raw', b, { name: 'X25519' }, false, []);
	const shared = await subtle.deriveBits({ name: 'X25519', public: peer }, privateKey, 256);
	const ikm = await subtle.importKey('raw', shared, 'HKDF', false, ['deriveBits']);
	const bits = await subtle.deriveBits(
		{ name: 'HKDF', hash: 'SHA-256', salt: encoder.encode(key), info: concat(INFO_LABEL, nonce, publicKey, b) },
		ikm,
		256
	);
	return toHex(new Uint8Array(bits));
}

/**
 * One card's side. status: need-key | waiting | session | other | wrong-key | no-reply | unsupported.
 * send(bytes) sends to <cid>@e2e-hello; onChange() is called after each status or key change.
 * Call challenge(bytes) and ready(bytes) for the camera's messages and tick() every second or so.
 */
export function createReceiver({ key, send, onChange = () => {}, subtle = globalThis.crypto?.subtle, now = () => Date.now() }) {
	const r = {
		status: key ? 'waiting' : 'need-key',
		sessionKey: '',
		holder: null,      // ours, while we have the session
		pending: null,     // { nonce, publicKey, privateKey, at } while a hello waits for its ready
		takeover: false,   // the user asked for the session: answer the next challenge whoever has it
		asking: false,     // a request is out and its challenge not answered yet
		askedAt: 0
	};
	let closed = false;
	const set = (status) => {
		r.status = status;
		if (status !== 'session') r.sessionKey = '';
		onChange();
	};
	const ask = () => {
		r.asking = true;
		r.askedAt = now();
		send(Uint8Array.of(VERSION));
	};

	async function answer(nonce) {
		const pair = await subtle.generateKey({ name: 'X25519' }, false, ['deriveBits']);
		const publicKey = new Uint8Array(await subtle.exportKey('raw', pair.publicKey));
		if (closed) return;
		r.pending = { nonce, publicKey, privateKey: pair.privateKey, id: await holderOf(subtle, publicKey), at: now() };
		send(await helloMessage(subtle, key, nonce, publicKey));
	}

	r.start = async () => {
		if (!key) return set('need-key');
		if (!(await supported(subtle))) return set('unsupported');
		if (closed) return;
		set('waiting');
		ask();
	};

	r.takeOver = () => {
		if (!key || r.status === 'unsupported') return;
		r.takeover = true;
		set('waiting');
		ask();
	};

	r.challenge = async (bytes) => {
		const c = parseChallenge(bytes);
		if (!c || !key || closed || r.status === 'unsupported') return;
		const mine = r.holder && equal(c.holder, r.holder);
		// Refused and busy name the hello they answer.
		if (c.reason === REASON.refused || c.reason === REASON.busy) {
			if (r.pending && equal(c.holder, r.pending.id)) {
				r.pending = null;
				set(c.reason === REASON.refused ? 'wrong-key' : 'other');
			}
			return;
		}
		const asked = r.asking && now() - r.askedAt < 5000;
		const free = c.holder.every((v) => v === 0);
		// start: nobody has it (any card may answer); rotate: the holder renews; request: the card that asked.
		const go = r.takeover || (c.reason === REASON.start && r.status !== 'wrong-key') ||
			(c.reason === REASON.rotate && mine) || (c.reason === REASON.request && asked && (free || mine));
		if (c.reason === REASON.request && asked) r.asking = false;
		if (go) {
			r.takeover = false;
			await answer(c.nonce);
		} else if (c.reason === REASON.request && asked && !free && !mine) {
			set('other');
		} else if (c.reason === REASON.rotate && r.status === 'session' && !mine) {
			set('other');
		}
	};

	r.ready = async (bytes) => {
		if (closed) return;
		const p = r.pending;
		if (!p) {
			// Another card's session: ours (if any) has ended.
			if (r.status === 'session') { r.holder = null; set('other'); }
			return;
		}
		const sessionKey = await sessionFromReady(subtle, key, p.nonce, p.publicKey, p.privateKey, bytes);
		if (closed || r.pending !== p) return;
		if (!sessionKey) return; // not the answer to our hello; refused or busy comes for ours
		r.pending = null;
		r.holder = await holderOf(subtle, p.publicKey);
		r.sessionKey = sessionKey;
		set('session');
	};

	r.tick = () => {
		if (closed || !key) return;
		if (r.pending && now() - r.pending.at > 5000) { r.pending = null; set('no-reply'); }
		else if ((r.status === 'waiting' || r.status === 'no-reply') && !r.pending && now() - r.askedAt > 10000) ask();
	};

	r.close = () => {
		closed = true;
		r.pending = null;
		r.sessionKey = '';
	};
	return r;
}
