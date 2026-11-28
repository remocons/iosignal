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
// While it holds the session, the card sends notices on <cid>@e2e-hello (2026-11-27):
//   card   -> <cid>@e2e-hello      [1][kind][holder 8][seq u32 LE][HMAC(S, label 1 holder seq)]   46 bytes
//             kind 'K' keep ("e2e-keep") every KEEP_MS, 'R' release ("e2e-release", seq 0xffffffff) when its page
//             closes. S is the session key as its 64 hex characters, so only the holder can sign; seq only rises.
//   The camera ends a session whose holder released it, or sent no keep for 40 s, and sends a start challenge.

export const VERSION = 1;
export const TAGS = { hello: 'e2e-hello', challenge: 'e2e-challenge', ready: 'e2e-ready' };
export const REASON = { start: 0, request: 1, rotate: 2, refused: 3, busy: 4 };
const NONCE = 16, PUB = 32, MAC = 32, HOLDER = 8;
export const NOTICE = { keep: 0x4b, release: 0x52 }; // 'K', 'R'
export const NOTICE_SIZE = 2 + HOLDER + 4 + MAC; // 46
// The holder sends a keep this often; the camera gives up on a holder after 40 s without one.
export const KEEP_MS = 15000;
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

/** A keep or release notice of the session holder (see the top of this file). */
export async function noticeMessage(subtle, sessionKey, kind, holder, seq) {
	const s = new Uint8Array(4);
	new DataView(s.buffer).setUint32(0, seq >>> 0, true);
	const label = kind === NOTICE.release ? 'e2e-release' : 'e2e-keep';
	return concat(Uint8Array.of(VERSION, kind), holder, s, await hmac(subtle, sessionKey, label, holder, s));
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

// While a session is held: pictures that do not open with it this many times in a row mean the camera has another
// session (one this card missed: a reset, or another card took it while this one was away).
const STRAY_LIMIT = 3;
// While a session is held and the camera says it sends: no picture for max(this, 3 intervals) asks again.
const PICTURE_WAIT_MS = 5000;

/**
 * One card's side. status: need-key | waiting | session | other | wrong-key | no-reply | unsupported.
 * send(bytes) sends to <cid>@e2e-hello; onChange() is called after each status or key change.
 * Call challenge(bytes) and ready(bytes) for the camera's messages and tick() every second or so.
 * For pictures: picture(true) when one opened with sessionKey, picture(false) when one did not, and
 * expect({ sending, intervalMs }) from the camera's $state. A held session that gets no picture it can open is
 * asked for again (resync): the camera answers with its holder, so the card keeps it, renews it, or shows 'other'.
 * pictureAt is the time of the last picture opened in this session (0: none yet).
 */
export function createReceiver({ key, send, onChange = () => {}, subtle = globalThis.crypto?.subtle, now = () => Date.now() }) {
	const r = {
		status: key ? 'waiting' : 'need-key',
		sessionKey: '',
		holder: null,      // ours, while we have the session
		pending: null,     // { nonce, publicKey, privateKey, at } while a hello waits for its ready
		takeover: false,   // the user asked for the session: answer the next challenge whoever has it
		asking: false,     // a request is out and its challenge not answered yet
		askedAt: 0,
		sessionAt: 0,      // when the session was made
		pictureAt: 0,      // the last picture opened with it (0: none yet)
		stray: 0,          // pictures in a row that did not open with it
		sending: false,    // the camera says it sends pictures (expect())
		intervalMs: 1000,
		expectAt: 0,       // when sending last turned on
		resyncs: 0         // resyncs in a row without a picture: each one doubles the next wait (at most 16 times)
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
		r.sessionAt = now();
		r.pictureAt = 0;
		r.stray = 0;
		r.keepAt = now();
		r.keepSeq = 0;
		// Made now: a page that closes has no time to wait for WebCrypto.
		r.releaseMessage = await noticeMessage(subtle, sessionKey, NOTICE.release, r.holder, 0xffffffff);
		if (closed || r.sessionKey !== sessionKey) return;
		set('session');
	};

	// The page or the card goes away: give the session back at once, so another card (or this page reloaded) gets it.
	r.release = () => {
		if (r.status !== 'session' || !r.releaseMessage) return;
		send(r.releaseMessage);
		r.releaseMessage = null;
		r.holder = null;
		set('waiting');
	};

	const keep = async () => {
		const sessionKey = r.sessionKey, holder = r.holder;
		r.keepAt = now();
		const message = await noticeMessage(subtle, sessionKey, NOTICE.keep, holder, ++r.keepSeq);
		if (!closed && r.status === 'session' && r.sessionKey === sessionKey) send(message);
	};

	r.picture = (opened) => {
		if (r.status !== 'session') return;
		if (opened) {
			const first = !r.pictureAt;
			r.pictureAt = now();
			r.stray = 0;
			r.resyncs = 0;
			if (first) onChange();
		} else r.stray++;
	};

	r.expect = ({ sending = false, intervalMs = 1000 } = {}) => {
		if (sending && !r.sending) r.expectAt = now();
		r.sending = Boolean(sending);
		r.intervalMs = Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 1000;
	};

	// Asks the camera again while keeping the holder id: a request challenge that names this card renews it.
	r.resync = () => {
		if (closed || !key || r.status !== 'session') return;
		r.stray = 0;
		r.resyncs++;
		set('waiting');
		ask();
	};

	r.tick = () => {
		if (closed || !key) return;
		if (r.status === 'session') {
			if (now() - r.keepAt >= KEEP_MS) keep();
			const quiet = now() - Math.max(r.sessionAt, r.pictureAt, r.expectAt);
			const wait = Math.max(PICTURE_WAIT_MS, 3 * r.intervalMs) * 2 ** Math.min(r.resyncs, 4);
			if (r.stray >= STRAY_LIMIT || (r.sending && quiet > wait)) r.resync();
			return;
		}
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

// What a session card shows, from its receiver and the camera's $state (parsed: { on, interval, cam }).
// While the session is held: no-camera (cam=0: the camera did not start), paused (on=0), session-wait (no picture
// opened yet), session. Otherwise the receiver's status.
export function sessionDisplay(receiver, state = {}) {
	const status = receiver?.status ?? 'waiting';
	if (status !== 'session') return status;
	if (state.cam === '0') return 'no-camera';
	if (state.on === '0') return 'paused';
	return receiver.pictureAt ? 'session' : 'session-wait';
}

// For receiver.expect(): whether the camera says it sends pictures, and how often.
export function expectOf(state = {}) {
	return { sending: state.on === '1' && state.cam !== '0', intervalMs: Number(state.interval) || 1000 };
}

// The notes a session card shows for each sessionDisplay() value.
export const SESSION_NOTES = {
	waiting: '장치와 세션을 맺는 중입니다.',
	'session-wait': '세션을 맺었습니다. 첫 사진을 기다리는 중입니다.',
	session: '이 브라우저만 열 수 있는 세션 키로 받은 사진입니다.',
	paused: '장치가 사진 전송을 멈췄습니다. 전송 스위치를 켜면 다시 받습니다.',
	'no-camera': '장치의 카메라가 시작되지 않아 사진을 보낼 수 없습니다. 장치가 다시 시도합니다.',
	'need-key': '장치에 넣은 E2E 키를 입력하세요. 장치와 세션을 맺는 데 씁니다.',
	'wrong-key': 'E2E 키가 장치에 넣은 키와 다릅니다.',
	other: '다른 브라우저가 이 카메라의 사진을 받고 있습니다.',
	'no-reply': '장치가 세션 요청에 답하지 않습니다. 잠시 뒤 다시 요청합니다.',
	unsupported: '이 브라우저는 X25519(WebCrypto)를 지원하지 않아 사진을 열 수 없습니다.'
};
