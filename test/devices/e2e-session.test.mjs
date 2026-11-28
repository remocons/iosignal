import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createReceiver, helloMessage, sessionFromReady, holderOf, parseChallenge, REASON, toHex } from '../../devices/shared/e2eSession.js';

const subtle = crypto.webcrypto.subtle;
const hex = (s) => Uint8Array.from(Buffer.from(s, 'hex'));

// The same vectors are used by the Arduino example's host test (esp32cam-session).
const V = {
	key: 'test-e2e-key',
	nonce: '000102030405060708090a0b0c0d0e0f',
	aSecret: '0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20',
	aPublic: '07a37cbc142093c8b755dc1b10e86cb426374ad16aa853ed0bdfc0b2b86d1c7c',
	bPublic: '5869aff450549732cbaaed5e5df9b30a6da31cb0e5742bad5ad4a1a768f1a67b',
	helloMac: 'c853e23a00f5d13bec1497b91dbb8c38138f8149bccaeabf99d1dc3c44a8dc5b',
	readyMac: '0dbaca616178d78088898a06b64f33e13ab42f4a4882ea0353782073a0a67c43',
	holder: 'aaa8fff703b50b22',
	sessionKey: 'b9c4d93c1c48b213c1534b88bc7cb141ca9b7d8725dee2d74ed273c0983653ab'
};

const pkcs8 = (raw) => Buffer.concat([Buffer.from('302e020100300506032b656e04220420', 'hex'), Buffer.from(raw)]);

test('the reference vector: hello, ready, holder and session key match the Arduino side', async () => {
	const privateKey = await subtle.importKey('pkcs8', pkcs8(hex(V.aSecret)), { name: 'X25519' }, false, ['deriveBits']);
	const a = hex(V.aPublic);
	const hello = await helloMessage(subtle, V.key, hex(V.nonce), a);
	assert.equal(toHex(hello), '01' + V.aPublic + V.helloMac);
	const ready = hex('01' + V.bPublic + V.readyMac);
	assert.equal(await sessionFromReady(subtle, V.key, hex(V.nonce), a, privateKey, ready), V.sessionKey);
	assert.equal(toHex(await holderOf(subtle, a)), V.holder);
	// Another key, another nonce or a changed byte: not our answer.
	assert.equal(await sessionFromReady(subtle, 'other', hex(V.nonce), a, privateKey, ready), null);
	const nonce2 = hex(V.nonce); nonce2[0] ^= 1;
	assert.equal(await sessionFromReady(subtle, V.key, nonce2, a, privateKey, ready), null);
	const bad = ready.slice(); bad[64] ^= 1;
	assert.equal(await sessionFromReady(subtle, V.key, hex(V.nonce), a, privateKey, bad), null);
	assert.equal(parseChallenge(Uint8Array.of(1, 2)), null);
});

// The camera's side in JS, as the example does it (E2ESession.h and esp32cam-session.ino).
function fakeCamera(key) {
	const cam = { nonce: crypto.randomBytes(16), prev: null, holder: Buffer.alloc(8), key: null, out: [] };
	const hmac = (label, ...parts) => {
		const h = crypto.createHmac('sha256', key); h.update(label); h.update(Buffer.from([1]));
		for (const p of parts) h.update(p);
		return h.digest();
	};
	const challenge = (reason) => cam.out.push(['challenge', Uint8Array.from(Buffer.concat([Buffer.from([1, reason]), cam.nonce, cam.holder]))]);
	cam.challenge = challenge;
	cam.notices = [];
	cam.hello = (bytes) => {
		const b = Buffer.from(bytes);
		if (b.length === 1) return challenge(REASON.request);
		if (b.length === 46) { // keep or release of the holder, signed with the session key, seq rising
			const kind = b[1], to = b.subarray(2, 10), seq = b.readUInt32LE(10);
			const label = kind === 0x52 ? 'e2e-release' : 'e2e-keep';
			const h = crypto.createHmac('sha256', cam.key ?? ''); h.update(label); h.update(Buffer.from([1])); h.update(to); h.update(b.subarray(10, 14));
			const ok = cam.key && to.equals(cam.holder) && seq > (cam.seq ?? 0) && h.digest().equals(b.subarray(14));
			cam.notices.push({ kind: String.fromCharCode(kind), seq, ok });
			if (!ok) return;
			cam.seq = seq;
			if (kind === 0x52) { cam.key = null; cam.holder = Buffer.alloc(8); cam.prev = null; cam.nonce = crypto.randomBytes(16); challenge(REASON.start); }
			return;
		}
		const a = b.subarray(1, 33), mac = b.subarray(33);
		if (!hmac('e2e-hello', cam.nonce, a).equals(mac)) {
			const to = crypto.createHash('sha256').update(a).digest().subarray(0, 8);
			const reason = cam.prev && hmac('e2e-hello', cam.prev, a).equals(mac) ? REASON.busy : REASON.refused;
			return cam.out.push(['challenge', Uint8Array.from(Buffer.concat([Buffer.from([1, reason]), cam.nonce, to]))]);
		}
		const { privateKey, publicKey } = crypto.generateKeyPairSync('x25519');
		const B = publicKey.export({ format: 'der', type: 'spki' }).subarray(-32);
		const peer = crypto.createPublicKey({ key: Buffer.concat([Buffer.from('302a300506032b656e032100', 'hex'), a]), format: 'der', type: 'spki' });
		const shared = crypto.diffieHellman({ privateKey, publicKey: peer });
		cam.key = Buffer.from(crypto.hkdfSync('sha256', shared, Buffer.from(key), Buffer.concat([Buffer.from('iosignal-e2e-session/1'), cam.nonce, a, B]), 32)).toString('hex');
		cam.holder = crypto.createHash('sha256').update(a).digest().subarray(0, 8);
		cam.seq = 0;
		cam.out.push(['ready', Uint8Array.from(Buffer.concat([Buffer.from([1]), B, hmac('e2e-ready', cam.nonce, a, B)]))]);
		cam.prev = cam.nonce;
		cam.nonce = crypto.randomBytes(16);
	};
	return cam;
}

// Delivers queued messages until nothing moves: the camera's to every card, the cards' to the camera.
async function run(cam, cards) {
	for (let i = 0; i < 20; i++) {
		await new Promise((r) => setTimeout(r, 5));
		const msgs = cam.out.splice(0);
		const hellos = cards.flatMap((c) => c.sent.splice(0));
		if (!msgs.length && !hellos.length) return;
		for (const h of hellos) cam.hello(h);
		for (const [kind, bytes] of msgs) for (const c of cards) await c.r[kind](bytes);
	}
}

function card(key) {
	const c = { sent: [] };
	c.r = createReceiver({ key, send: (b) => c.sent.push(b), subtle });
	return c;
}

test('a card gets a session; a second card sees it is taken and can take it over', async () => {
	const cam = fakeCamera('k1');
	const one = card('k1'), two = card('k1');
	await one.r.start();
	await run(cam, [one, two]);
	assert.equal(one.r.status, 'session');
	assert.equal(one.r.sessionKey, cam.key);
	assert.equal(two.r.status, 'waiting'); // it heard a ready that was not for it, but had not asked

	await two.r.start();
	await run(cam, [one, two]);
	assert.equal(two.r.status, 'other');
	assert.equal(one.r.status, 'session');

	two.r.takeOver();
	await run(cam, [one, two]);
	assert.equal(two.r.status, 'session');
	assert.equal(two.r.sessionKey, cam.key);
	assert.equal(one.r.status, 'other');
	assert.equal(one.r.sessionKey, '');
});

test('rotation: only the holder answers and gets a new key', async () => {
	const cam = fakeCamera('k1');
	const one = card('k1'), two = card('k1');
	await one.r.start();
	await run(cam, [one, two]);
	await two.r.start();
	await run(cam, [one, two]);
	const first = one.r.sessionKey;
	cam.challenge(REASON.rotate);
	await run(cam, [one, two]);
	assert.equal(one.r.status, 'session');
	assert.notEqual(one.r.sessionKey, first);
	assert.equal(one.r.sessionKey, cam.key);
	assert.equal(two.r.status, 'other');
});

test('a camera restart (start) lets a card in the other state compete again', async () => {
	const cam = fakeCamera('k1');
	const one = card('k1');
	one.r.status = 'other';
	cam.challenge(REASON.start);
	await run(cam, [one]);
	assert.equal(one.r.status, 'session');
});

test('a start reaches every card: one wins, the late one is busy, a wrong key is refused, each only for its own hello', async () => {
	const cam = fakeCamera('k1');
	const one = card('k1'), two = card('k1'), wrong = card('k2');
	cam.challenge(REASON.start);
	await run(cam, [one, two, wrong]);
	assert.equal(one.r.status, 'session');
	assert.equal(two.r.status, 'other');
	assert.equal(wrong.r.status, 'wrong-key');
	assert.equal(one.r.sessionKey, cam.key);
});

test('a wrong key is refused; no key or no X25519 says so', async () => {
	const cam = fakeCamera('k1');
	const wrong = card('k2');
	await wrong.r.start();
	await run(cam, [wrong]);
	assert.equal(wrong.r.status, 'wrong-key');
	assert.equal(cam.key, null);

	const none = card('');
	await none.r.start();
	assert.equal(none.r.status, 'need-key');

	const old = createReceiver({ key: 'k1', send: () => {}, subtle: { generateKey: async () => { throw new Error('no'); } } });
	await old.start();
	assert.equal(old.status, 'unsupported');
});

test('no ready within 5 s is no-reply, and the card asks again later', async () => {
	let t = 0;
	const sent = [];
	const r = createReceiver({ key: 'k1', send: (b) => sent.push(b), subtle, now: () => t });
	await r.start();
	await r.challenge(Uint8Array.from([1, REASON.request, ...new Uint8Array(16), ...new Uint8Array(8)]));
	assert.equal(sent.length, 2); // request, hello
	t = 6000; r.tick();
	assert.equal(r.status, 'no-reply');
	t = 11000; r.tick();
	assert.equal(sent.length, 3); // asked again
});

function timedCard(key, clock) {
	const c = { sent: [] };
	c.r = createReceiver({ key, send: (b) => c.sent.push(b), subtle, now: () => clock.t });
	return c;
}

test('a session taken while this card was away: pictures that do not open make it ask again and show other', async () => {
	const clock = { t: 0 };
	const cam = fakeCamera('k1');
	const one = timedCard('k1', clock), two = timedCard('k1', clock);
	await one.r.start();
	await run(cam, [one, two]);
	assert.equal(one.r.status, 'session');
	two.r.takeOver();
	await run(cam, [two]); // one misses the ready
	assert.equal(two.r.status, 'session');
	assert.equal(one.r.status, 'session');
	for (let i = 0; i < 3; i++) one.r.picture(false);
	one.r.tick();
	assert.equal(one.r.status, 'waiting');
	await run(cam, [one, two]);
	assert.equal(one.r.status, 'other');
	assert.equal(two.r.status, 'session');
});

test('a camera restart this card missed: no picture while the camera sends makes it ask again and get a new session', async () => {
	const clock = { t: 0 };
	let cam = fakeCamera('k1');
	const one = timedCard('k1', clock);
	await one.r.start();
	await run(cam, [one]);
	one.r.expect({ sending: true, intervalMs: 1000 });
	one.r.picture(true);
	const old = one.r.sessionKey;
	cam = fakeCamera('k1'); // restarted: nobody holds it, the start challenge was missed
	clock.t = 4000; one.r.tick();
	assert.equal(one.r.status, 'session', 'not before max(5 s, 3 intervals)');
	clock.t = 5100; one.r.tick();
	assert.equal(one.r.status, 'waiting');
	await run(cam, [one]);
	assert.equal(one.r.status, 'session');
	assert.notEqual(one.r.sessionKey, old);
	assert.equal(one.r.sessionKey, cam.key);
});

test('a held session is not asked again while the camera does not send, and waits longer after each fruitless resync', async () => {
	const clock = { t: 0 };
	const cam = fakeCamera('k1');
	const one = timedCard('k1', clock);
	await one.r.start();
	await run(cam, [one]);
	one.r.expect({ sending: false, intervalMs: 1000 });
	clock.t = 60000; one.r.tick();
	assert.equal(one.r.status, 'session');
	assert.equal(one.r.pictureAt, 0);

	one.r.expect({ sending: true, intervalMs: 1000 }); // expectAt = 60000
	clock.t = 65100; one.r.tick();
	assert.equal(one.r.status, 'waiting');
	await run(cam, [one]); // renewed (sessionAt = 65100), still no picture
	assert.equal(one.r.status, 'session');
	clock.t = 65100 + 6000; one.r.tick();
	assert.equal(one.r.status, 'session', 'the second wait is 10 s');
	clock.t = 65100 + 10100; one.r.tick();
	assert.equal(one.r.status, 'waiting');
	await run(cam, [one]);
	one.r.picture(true);
	assert.equal(one.r.resyncs, 0);
});

test('the holder sends a signed keep every 15 s; a replayed one is refused', async () => {
	const clock = { t: 0 };
	const cam = fakeCamera('k1');
	const one = timedCard('k1', clock);
	await one.r.start();
	await run(cam, [one]);
	clock.t = 14000; one.r.tick();
	await run(cam, [one]);
	assert.deepEqual(cam.notices, []);
	clock.t = 15000; one.r.tick();
	await new Promise((r) => setTimeout(r, 20));
	const keep = one.sent.at(-1);
	await run(cam, [one]);
	assert.deepEqual(cam.notices, [{ kind: 'K', seq: 1, ok: true }]);
	cam.hello(keep); // the same keep again
	assert.deepEqual(cam.notices.at(-1), { kind: 'K', seq: 1, ok: false });
});

test('release when the page closes: the camera starts again and another card gets the session at once', async () => {
	const cam = fakeCamera('k1');
	const one = card('k1'), two = card('k1');
	await one.r.start();
	await run(cam, [one, two]);
	await two.r.start();
	await run(cam, [one, two]);
	assert.equal(two.r.status, 'other');
	one.r.release();
	one.r.close();
	await run(cam, [one, two]);
	assert.deepEqual(cam.notices, [{ kind: 'R', seq: 0xffffffff, ok: true }]);
	assert.equal(two.r.status, 'session');
	assert.equal(two.r.sessionKey, cam.key);
});

test('a release from a card that does not hold the session is refused', async () => {
	const cam = fakeCamera('k1');
	const one = card('k1'), two = card('k1');
	await one.r.start();
	await run(cam, [one, two]);
	two.r.takeOver();
	await run(cam, [two]); // one missed it and still thinks it holds the session
	one.r.release();
	await run(cam, [two]);
	cam.hello(one.sent.at(-1));
	assert.equal(cam.notices.at(-1).ok, false);
	assert.equal(two.r.sessionKey, cam.key);
});
