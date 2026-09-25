import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

// Package self-reference: source ESM in development, built ESM/CJS in a release tree.
const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url)));
const variants = [[pkg.private ? 'source' : 'esm', await import('iosignal')]];
if (!pkg.private) variants.push(['cjs', createRequire(import.meta.url)('iosignal')]);

function event(emitter, name, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => finish(new Error(`Timed out waiting for ${name}`)), 3000);
    const onEvent = (...args) => finish(null, args);
    const onError = error => finish(error instanceof Error ? error : new Error(String(error)));
    const onAbort = () => finish(new Error(`Aborted waiting for ${name}`));
    function finish(error, args) {
      clearTimeout(timer);
      emitter.removeListener(name, onEvent);
      if (name !== 'error') emitter.removeListener('error', onError);
      signal?.removeEventListener('abort', onAbort);
      if (error) reject(error); else resolve(args);
    }
    emitter.once(name, onEvent);
    if (name !== 'error') emitter.once('error', onError);
    signal?.addEventListener('abort', onAbort, { once: true });
    if (signal?.aborted) onAbort();
  });
}

async function fixture(t, api, authenticated = false) {
  const http = createServer();
  const previousMembersOnly = api.serverOption.membersOnly;
  api.serverOption.membersOnly = authenticated;
  const auth = authenticated
    ? new api.BohoAuth(new api.StringKeyProvider('tester.fixture-key.fixture-client.3'))
    : undefined;
  const server = new api.Server({ httpServer: http }, auth);
  const clients = [];
  const errors = [];
  server.attach('reply', api.replyService);
  server.wss.on('error', error => errors.push(error));
  http.on('error', error => errors.push(error));
  t.after(async () => {
    for (const client of clients) {
      const socket = client.socket;
      client.stop();
      socket?.terminate();
    }
    // Also terminate peers on failure so teardown cannot hang on a close handshake.
    for (const peer of server.wss.clients) peer.terminate();
    try {
      await new Promise(resolve => server.close(resolve));
      await new Promise(resolve => http.close(resolve));
    } finally {
      api.serverOption.membersOnly = previousMembersOnly;
    }
    assert.deepEqual(errors, [], 'unexpected transport errors');
  });
  const ready = event(server, 'ready', t.signal);
  http.listen(0, '127.0.0.1');
  await ready;
  const url = `ws://127.0.0.1:${http.address().port}`;
  function client(credentials) {
    const io = new api.IO();
    clients.push(io);
    io.on('error', error => errors.push(error));
    if (credentials) io.auth(...credentials);
    return io;
  }
  async function connect(credentials) {
    const io = client(credentials);
    const ready = event(io, 'ready', t.signal);
    io.open(url);
    await ready;
    assert.ok(io.cid, 'server assigned a client ID');
    return io;
  }
  return { server, url, client, connect };
}

for (const [format, api] of variants) {
  test(`${format}: WebSocket handshake, RPC success and errors`, { timeout: 10000 }, async t => {
    const { server, connect } = await fixture(t, api);
    server.attach('denied', { commands: ['echo'], checkPermission: () => false, echo() { throw Error('must not execute'); } });
    const io = await connect();
    const reply = await io.call('reply', 'echo', 'hello', { count: 2 });
    assert.equal(reply.ok, true);
    assert.deepEqual(reply.body, ['hello', { count: 2 }]);
    await assert.rejects(io.call('reply', 'missing'), error => {
      assert.equal(error.body, 'UNKNOWN_COMMAND');
      return true;
    });
    await assert.rejects(io.call('denied', 'echo'), error => {
      assert.equal(error.body, 'NO_PERMISSION.');
      return true;
    });
  });

  test(`${format}: two-client publish/subscribe, payloads and unsubscribe`, { timeout: 10000 }, async t => {
    const { connect } = await fixture(t, api);
    const subscriber = await connect();
    const publisher = await connect();
    assert.notEqual(subscriber.cid, publisher.cid);
    subscriber.subscribe('room,barrier');
    // RPC is ordered after SUBSCRIBE on the same WebSocket: no timing sleeps.
    await subscriber.call('reply', 'echo', 'subscribed');
    for (const payload of ['hello', { count: 3 }, Buffer.from([0, 1, 255])]) {
      const received = event(subscriber, 'message', t.signal);
      publisher.signal('room', payload);
      const [tag, value] = await received;
      assert.equal(tag, 'room');
      if (Buffer.isBuffer(payload)) assert.deepEqual(Buffer.from(value), payload);
      else assert.deepEqual(value, payload);
    }
    subscriber.unsubscribe('room');
    await subscriber.call('reply', 'echo', 'unsubscribed');
    const received = event(subscriber, 'message', t.signal);
    publisher.signal('room', 'must not arrive');
    publisher.signal('barrier', 'done');
    assert.deepEqual(await received, ['barrier', 'done']);
  });

  test(`${format}: authenticated connection and encrypted RPC`, { timeout: 10000 }, async t => {
    const { connect } = await fixture(t, api, true);
    const io = await connect(['tester', 'fixture-key']);
    assert.equal(io.cid, 'fixture-client');
    assert.equal(io.boho.isAuthorized, true);
    const wireTypes = [];
    io.on('socket_data', data => wireTypes.push(data[0]));
    const reply = await io.call('reply', 'echo', 'authenticated');
    assert.equal(reply.ok, true);
    assert.deepEqual(reply.body, ['authenticated']);
    assert.ok(wireTypes.includes(api.Boho.BohoMsg.ENC_488), 'RPC response traveled in an encrypted frame');
  });

  test(`${format}: stop closes the connection and the client can reopen`, { timeout: 10000 }, async t => {
    const { server, connect, url } = await fixture(t, api);
    const io = await connect();
    const peer = [...server.wss.clients][0];
    const closed = event(peer, 'close', t.signal);
    io.stop();
    await closed;
    assert.equal(server.wss.clients.size, 0);
    assert.equal(io.socket, null);
    assert.equal(io.connectionCheckerIntervalID, null);
    const ready = event(io, 'ready', t.signal);
    io.open(url);
    await ready;
    assert.equal((await io.call('reply', 'echo', 'reopened')).ok, true);
  });

  test(`${format}: incorrect credentials never reach ready`, { timeout: 10000 }, async t => {
    const { client, url } = await fixture(t, api, true);
    const io = client(['tester', 'wrong-fixture-key']);
    let ready = false;
    io.on('ready', () => { ready = true; });
    const rejected = event(io, 'auth_fail', t.signal);
    io.open(url);
    await rejected;
    assert.equal(ready, false);
    assert.equal(io.boho.isAuthorized, false);
  });
}
