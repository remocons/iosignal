import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

// Private source entry in development; package self-reference for public builds.
const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url)));
const variants = [[pkg.private ? 'source' : 'esm', await import(pkg.private ? '../../index.js' : 'iosignal')]];
if (!pkg.private) variants.push(['cjs', createRequire(import.meta.url)('iosignal')]);

function event(emitter, name, signal, ms = 3000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => finish(new Error(`Timed out waiting for ${name}`)), ms);
    const onEvent = (...args) => finish(null, args);
    const onAbort = () => finish(new Error(`Aborted waiting for ${name}`));
    function finish(error, args) {
      clearTimeout(timer);
      emitter.removeListener(name, onEvent);
      signal?.removeEventListener('abort', onAbort);
      if (error) reject(error); else resolve(args);
    }
    emitter.once(name, onEvent);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

// A server on a free port with WebSocket and CongSocket (TCP) listeners.
async function fixture(t, api, options = {}) {
  const http = createServer();
  const server = new api.Server({ httpServer: http, congPort: 0, ...options });
  server.attach('reply', api.replyService);
  const clients = [];
  t.after(async () => {
    for (const client of clients) {
      const socket = client.socket;
      client.stop();
      socket?.terminate?.();
      socket?.destroy?.();
    }
    for (const peer of server.wss.clients) peer.terminate();
    await new Promise(resolve => server.close(resolve));
    await new Promise(resolve => http.close(resolve));
  });
  const ready = event(server, 'ready', t.signal);
  http.listen(0, '127.0.0.1');
  await ready;
  async function connect({ tcp = false, credentials } = {}) {
    const io = tcp ? new api.IOCongSocket() : new api.IO();
    clients.push(io);
    if (credentials) io.auth(...credentials);
    const opened = event(io, 'ready', t.signal);
    io.open(tcp ? `cong://127.0.0.1:${server.congPort}` : `ws://127.0.0.1:${http.address().port}`);
    await opened;
    return io;
  }
  // RPC is answered after everything the client sent before it has been handled.
  const flush = io => io.call('reply', 'echo', 'flush');
  return { server, connect, flush };
}

const OPTIONS = { inbound: ['g#in'], own: ['g#state', 'g#$roster', '@g.fx'] };

for (const [format, api] of variants) {
  test(`${format}: host receives every payload type with the sender the server knows, over WS and TCP`, { timeout: 10000 }, async t => {
    const { server, connect, flush } = await fixture(t, api);
    const host = server.host('g', OPTIONS);
    const got = [];
    host.on('message', (from, tag, ...args) => got.push({ from, tag, args }));
    const ws = await connect();
    const tcp = await connect({ tcp: true });

    // The payload's claimed CID is just data: from.cid is the real sender.
    ws.signal('g#in', `${tcp.cid},U`);
    ws.signal('g#in', { op: 'D' });
    ws.signal('g#in', 1, 'two');
    ws.signal('g#in', Buffer.from([1, 2, 3]));
    ws.signal('g#in', 'x', Buffer.from([9]));
    ws.signal('g#in');
    tcp.signal('g#in', 'L'); // TEXT from a C-style sender carries a trailing NUL
    await flush(ws);
    await flush(tcp);

    assert.equal(got.length, 7);
    for (const m of got.slice(0, 6)) {
      assert.equal(m.from.cid, ws.cid);
      assert.equal(m.tag, 'g#in');
    }
    assert.deepEqual(got[0].args, [`${tcp.cid},U`]);
    assert.deepEqual(got[1].args, [{ op: 'D' }]);
    assert.deepEqual(got[2].args, [1, 'two']);
    assert.deepEqual(Buffer.from(got[3].args[0]), Buffer.from([1, 2, 3]));
    assert.equal(got[4].args[0], 'x');
    assert.deepEqual(Buffer.from(got[4].args[1]), Buffer.from([9]));
    assert.deepEqual(got[5].args, []);
    assert.equal(got[6].from.cid, tcp.cid);
    assert.deepEqual(got[6].args, ['L']);
    assert.equal(got[0].from.authorized, false);
    assert.equal(got[0].from.role, 'anonymous');
    assert.ok(Object.isFrozen(got[0].from));
    assert.ok(host.participants.has(ws.cid) && host.participants.has(tcp.cid));
    assert.equal(server.stats().counters.hostInbound, 7);
  });

  test(`${format}: inbound signals are not relayed to subscribers`, { timeout: 10000 }, async t => {
    const { server, connect, flush } = await fixture(t, api);
    server.host('g', OPTIONS);
    const subscriber = await connect();
    const sender = await connect();
    subscriber.subscribe('g#in,barrier');
    await flush(subscriber);
    const received = event(subscriber, 'message', t.signal);
    sender.signal('g#in', 'secret');
    sender.signal('barrier', 'done');
    assert.deepEqual(await received, ['barrier', 'done']);
  });

  test(`${format}: clients cannot send to tags a host owns`, { timeout: 10000 }, async t => {
    const { server, connect, flush } = await fixture(t, api);
    const host = server.host('g', OPTIONS);
    const denied = [];
    server.on('host:denied', (remote, tag, name) => denied.push([remote.cid, tag, name]));
    const player = await connect();
    const forger = await connect();
    player.subscribe('g#state,g#$roster,barrier');
    await flush(player);
    assert.equal(host.publish('g#$roster', { players: 1 }), 1);

    const seen = [];
    player.on('message', (tag, value) => seen.push([tag, value]));
    player.on('@', (tag, value) => seen.push([tag, value]));
    forger.signal('g#state', 'fake');
    forger.signal('g#$roster', { players: 99 });
    forger.signal(`${player.cid}@g.fx`, 'fake');
    const barrier = event(player, 'barrier', t.signal);
    forger.signal('barrier', 'done');
    await barrier;
    assert.deepEqual(seen, [['g#$roster', { players: 1 }], ['barrier', 'done']]);
    assert.deepEqual(denied, [
      [forger.cid, 'g#state', 'g'],
      [forger.cid, 'g#$roster', 'g'],
      [forger.cid, `${player.cid}@g.fx`, 'g']
    ]);
    assert.equal(server.stats().counters.hostDenied, 3);

    // The retained value is still the host's.
    const late = await connect();
    const retained = event(late, 'message', t.signal);
    late.subscribe('g#$roster');
    assert.deepEqual(await retained, ['g#$roster', { players: 1 }]);

    // A CID publication names its sender, so it is never blocked.
    late.subscribe(`${forger.cid}@g.fx`);
    await flush(late);
    const own = event(late, 'message', t.signal);
    forger.signal('@g.fx', 'mine');
    assert.deepEqual(await own, [`${forger.cid}@g.fx`, 'mine']);
  });

  test(`${format}: host publish, retain and unicast`, { timeout: 10000 }, async t => {
    const { server, connect, flush } = await fixture(t, api);
    const host = server.host('g', OPTIONS);
    const a = await connect();
    const b = await connect({ tcp: true });
    assert.equal(host.publish('g#state', { tick: 0 }), 0);
    a.subscribe('g#state');
    b.subscribe('g#state');
    await flush(a);
    await flush(b);
    const ra = event(a, 'message', t.signal), rb = event(b, 'message', t.signal);
    assert.equal(host.publish('g#state', { tick: 1 }), 2);
    assert.deepEqual(await ra, ['g#state', { tick: 1 }]);
    assert.deepEqual(await rb, ['g#state', { tick: 1 }]);

    const fx = event(a, '@g.fx', t.signal);
    assert.equal(host.to(a.cid, 'g.fx', 'coin'), true);
    assert.deepEqual(await fx, ['@g.fx', 'coin']);
    assert.equal(host.to('?none', 'g.fx', 'coin'), false);
    assert.throws(() => host.to(a.cid, '@g.fx', 'x'), TypeError);

    // Only the host's own channel tags.
    assert.throws(() => host.publish('g#in', 1), /does not own/);
    assert.throws(() => host.publish('other', 1), /does not own/);
    assert.throws(() => host.publish('@g.fx', 1), /does not own/);
  });

  test(`${format}: unicast larger than the receiver's buffer is reported as not sent`, { timeout: 10000 }, async t => {
    const { server, connect } = await fixture(t, api);
    const host = server.host('g', OPTIONS);
    const io = await connect({ tcp: true });
    server.manager.cid2remote.get(io.cid).peerRxLimit = 80;
    assert.equal(host.to(io.cid, 'g.fx', 'x'.repeat(200)), false);
    assert.equal(host.to(io.cid, 'g.fx', 'ok'), true);
  });

  test(`${format}: leave follows the CID, not a replaced connection; forget stops it`, { timeout: 10000 }, async t => {
    const { server, connect, flush } = await fixture(t, api, { localAuth: 'idKey' });
    const host = server.host('g', OPTIONS);
    const left = [];
    host.on('leave', (from, reason) => left.push([from.cid, reason]));

    const first = await connect({ credentials: ['p1', 'p1'] });
    first.autoReconnect = false;
    first.signal('g#in', 'J');
    await flush(first);
    assert.equal(host.participants.get('p1').authorized, true);
    assert.equal(host.participants.get('p1').role, 'device');

    // Same account logs in again (keepNew): the old connection closes, the CID stays online.
    const oldRemote = server.manager.cid2remote.get('p1');
    const closed = event(oldRemote.socket, 'close', t.signal);
    const second = await connect({ credentials: ['p1', 'p1'] });
    second.autoReconnect = false;
    await closed;
    await flush(second);
    assert.deepEqual(left, []);
    assert.ok(host.participants.has('p1'));

    const leave = event(host, 'leave', t.signal);
    second.stop();
    await leave;
    assert.deepEqual(left, [['p1', 'close']]);
    assert.equal(host.participants.has('p1'), false);

    const quiet = await connect();
    quiet.autoReconnect = false;
    quiet.signal('g#in', 'J');
    await flush(quiet);
    assert.equal(host.forget(quiet.cid), true);
    const remote = server.manager.cid2remote.get(quiet.cid);
    const gone = event(remote.socket, 'close', t.signal);
    quiet.stop();
    await gone;
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(left.length, 1);
  });

  test(`${format}: E2E and malformed signals to a host are rejected`, { timeout: 10000 }, async t => {
    const { server, connect, flush } = await fixture(t, api, { localAuth: 'idKey' });
    const host = server.host('g', OPTIONS);
    let count = 0;
    host.on('message', () => count++);
    const io = await connect({ credentials: ['p2', 'p2'] });
    io.signal_e2e('g#in', Buffer.from('hidden'), 'shared-key');
    await flush(io);
    // OBJECT payload that is not JSON.
    const remote = server.manager.cid2remote.get(io.cid);
    const bad = Buffer.from([api.IOMsg.SIGNAL, 4, ...Buffer.from('g#in'), api.PAYLOAD_TYPE.OBJECT, ...Buffer.from('{no')]);
    assert.deepEqual(server.manager.sender('g#in', remote, bad), ['err', 'Not accepted by the host']);
    assert.equal(count, 0);
    assert.equal(server.stats().counters.hostRejected, 2);
  });

  test(`${format}: a throwing handler is reported and the server keeps going`, { timeout: 10000 }, async t => {
    const { server, connect, flush } = await fixture(t, api);
    const host = server.host('g', OPTIONS);
    host.on('message', (from, tag, value) => { if (value === 'boom') throw new Error('boom'); });
    const errors = [];
    host.on('error', error => errors.push(error.message));
    const io = await connect();
    io.signal('g#in', 'boom');
    io.signal('g#in', 'fine');
    await flush(io);
    assert.deepEqual(errors, ['boom']);
    assert.equal(server.stats().counters.hostInbound, 2);
  });

  test(`${format}: host registration checks tags; close releases them`, { timeout: 10000 }, async t => {
    const { server, connect, flush } = await fixture(t, api);
    for (const [options, pattern] of [
      [{}, /at least one inbound/],
      [{ inbound: ['#home'] }, /home channel/],
      [{ inbound: ['a*b'] }, /only at the end/],
      [{ inbound: ['*'] }, /empty tag/],
      [{ inbound: ['x'], own: ['@*'] }, /empty topic/],
      [{ inbound: ['@x'] }, /no '@'/],
      [{ inbound: ['a,b'] }, /separates/],
      [{ inbound: ['x'], own: ['x'] }, /overlaps/],
      [{ inbound: ['room:*'], own: ['room:1#state'] }, /overlaps/],
      [{ inbound: ['x'], extra: 1 }, /unknown host option/],
      [{ inbound: ['x'], fanout: 0 }, /fanout/],
    ]) {
      assert.throws(() => server.host('bad', options), pattern);
    }
    assert.throws(() => server.host('bad name', { inbound: ['x'] }), /host name/);

    // A client retained a value on the tag before the host claimed it: it is not the host's.
    const early = await connect();
    early.signal('g#$roster', 'client value');
    await flush(early);
    const host = server.host('g', OPTIONS);
    assert.throws(() => server.host('g', { inbound: ['other'] }), /already exists/);
    assert.throws(() => server.host('h', { inbound: ['g#state'] }), /overlaps .* of host g/);
    const probe = await connect();
    probe.subscribe('g#$roster');
    await flush(probe);
    let retained = 0;
    probe.on('message', () => retained++);
    await flush(probe);
    assert.equal(retained, 0);

    host.publish('g#$roster', 'host value');
    host.close();
    assert.equal(server.manager.retain_messages.has('CH:g#$roster'), false);
    assert.throws(() => host.publish('g#state', 1), /closed/);
    // The tags are ordinary channels again.
    const sub = await connect();
    sub.subscribe('g#in');
    await flush(sub);
    const relayed = event(sub, 'message', t.signal);
    early.signal('g#in', 'relayed');
    assert.deepEqual(await relayed, ['g#in', 'relayed']);
    // The name can be used again.
    server.host('g', OPTIONS).close();
  });

  test(`${format}: prefix tags serve many rooms`, { timeout: 10000 }, async t => {
    const { server, connect, flush } = await fixture(t, api);
    const host = server.host('rooms', { inbound: ['room:*'], own: [] });
    const got = [];
    host.on('message', (from, tag, v) => got.push([tag, v]));
    const io = await connect();
    io.signal('room:1#in', 'a');
    io.signal('room:22#in', 'b');
    io.signal('lobby', 'c');
    await flush(io);
    assert.deepEqual(got, [['room:1#in', 'a'], ['room:22#in', 'b']]);
  });
}
