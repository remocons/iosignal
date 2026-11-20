import { test } from 'node:test';
import assert from 'node:assert/strict';
import { imageWidgets, decodeImage } from '../../devices/shared/media.js';
import { validateSchema } from '../../devices/shared/schema.js';
import { readFileSync } from 'node:fs';

const jpeg = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4]);
const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0]);

test('camera.1 validates and has one e2e image widget', () => {
	const raw = JSON.parse(readFileSync(new URL('../../devices/types/camera.1.json', import.meta.url), 'utf8'));
	const { ok, schema, errors } = validateSchema(raw, { requireType: true });
	assert.ok(ok, errors.join('\n'));
	assert.deepEqual(imageWidgets(schema.controls), [{ tag: 'image', e2e: true }]);
});

test('camera-session.1 validates and has one session image widget; e2e takes true or "session" only', () => {
	const raw = JSON.parse(readFileSync(new URL('../../devices/types/camera-session.1.json', import.meta.url), 'utf8'));
	const { ok, schema, errors } = validateSchema(raw, { requireType: true });
	assert.ok(ok, errors.join('\n'));
	assert.deepEqual(imageWidgets(schema.controls), [{ tag: 'image', e2e: 'session' }]);
	assert.equal(validateSchema({ schema: 1, controls: [{ widget: 'image', e2e: 'yes' }] }).ok, false);
});

test('image widget: tag defaults to image, a bad tag is refused', () => {
	assert.equal(validateSchema({ schema: 1, controls: [{ widget: 'image' }] }).schema.controls[0].tag, 'image');
	assert.equal(validateSchema({ schema: 1, controls: [{ widget: 'image', tag: '$state' }] }).ok, false);
	assert.deepEqual(imageWidgets([{ widget: 'section', children: [{ widget: 'image', tag: 'cam' }] }]), [{ tag: 'cam', e2e: false }]);
});

test('decodeImage: plain JPEG, missing key, wrong key, e2e', () => {
	const never = () => { throw new Error('not called'); };
	assert.equal(decodeImage(jpeg, '', never).status, 'plain');
	assert.deepEqual(decodeImage(png, '', never), { bytes: png, type: 'image/png', status: 'plain' });
	const sealed = Uint8Array.from([0xb5, 9, 9, 9]);
	assert.equal(decodeImage(sealed, '', never).status, 'need-key');
	assert.equal(decodeImage(sealed, 'k', () => undefined).status, 'wrong-key');
	assert.equal(decodeImage(sealed, 'k', () => { throw new Error('bad'); }).status, 'wrong-key');
	const opened = decodeImage(sealed, 'k', (data, key) => (key === 'k' ? { data: jpeg } : undefined));
	assert.equal(opened.status, 'e2e');
	assert.equal(opened.bytes, jpeg);
	assert.equal(opened.type, 'image/jpeg');
	assert.equal(decodeImage(new Uint8Array(), '', never).status, 'invalid');
});
