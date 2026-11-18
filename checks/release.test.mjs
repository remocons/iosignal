import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import * as esm from '../dist/node/iosignal.js';
import * as source from '../index.js';
const cjs = createRequire(import.meta.url)('../dist/node/iosignal.cjs');

test('ESM and CommonJS packages expose the public API only', () => {
  for (const api of [esm, cjs]) {
    assert.deepEqual(Object.keys(api).sort(), Object.keys(source).sort());
    assert.equal(typeof api.Server, 'function');
    assert.equal(typeof api.IO, 'function');
    assert.equal(api.version, source.version);
  }
});
for (const [format, api] of [['esm', esm], ['cjs', cjs]]) {
  test(`${format}: signal payload round trips`, () => {
    const packet = api.getSignalPack('한글', { ok: true }, Buffer.from('hello'));
    const values = api.MBP.unpack(api.getPayloadFromSignalPack(packet));
    assert.deepEqual(values[0], { ok: true });
    assert.equal(Buffer.from(values[1]).toString(), 'hello');
    assert.equal(api.parsePayload([]).type, api.PAYLOAD_TYPE.EMPTY);
    assert.throws(() => api.getSignalPack(42), TypeError);
  });
  test(`${format}: fragmented and joined TCP frames`, () => {
    const values = [Buffer.from('hello'), Buffer.alloc(300, 42), Buffer.alloc(66000, 13)];
    const bytes = Buffer.concat(values.map(api.pack));
    const rx = new api.CongRx();
    const result = [];
    rx.on('data', frame => result.push(frame));
    for (let offset = 0; offset < bytes.length; offset += 37) rx.write(bytes.subarray(offset, offset + 37));
    rx.end();
    assert.deepEqual(result, values);
  });
}

test('dist/browser/esm/broker.js: clients in one page relay through the in-page server', async () => {
  // The browser client listens for page visibility; Node.js has no document.
  globalThis.document ??= Object.assign(new EventTarget(), { visibilityState: 'visible' });
  const { createBrowserBroker, LocalIO, attachMonitor } = await import('../dist/browser/esm/broker.js');
  const server = await createBrowserBroker({ port: 7901 });
  const log = [];
  attachMonitor(server, entry => log.push(entry));
  const ready = io => new Promise(resolve => io.once('ready', resolve));
  const a = new LocalIO(server.url), b = new LocalIO(server.url);
  try {
    await Promise.all([ready(a), ready(b)]);
    assert.match(a.cid, /^\?[0-9a-z]{4}$/);
    b.subscribe('room');
    await new Promise(resolve => setTimeout(resolve, 20));
    const got = new Promise(resolve => b.once('room', (tag, ...args) => resolve(args)));
    a.signal('room', 'hello', 7);
    assert.deepEqual(await got, ['hello', 7]);
    const direct = new Promise(resolve => b.once('@hi', (tag, value) => resolve(value)));
    a.signal(`${b.cid}@hi`, { ok: true });
    assert.deepEqual(await direct, { ok: true });
    assert.ok(log.some(e => e.type === 'signal' && e.tag === 'room' && e.to[0].cid === b.cid));
    await assert.rejects(createBrowserBroker({ port: 7901 }), { code: 'EADDRINUSE' });
  } finally {
    a.destroy();
    b.destroy();
    await new Promise(resolve => server.close(resolve));
  }
});

