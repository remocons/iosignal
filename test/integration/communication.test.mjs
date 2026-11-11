import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import net from 'node:net';
import { createHash } from 'node:crypto';
import { networkInterfaces } from 'node:os';
import { WebSocket } from 'ws';

// Private source entry in development; package self-reference for public builds.
const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url)));
const variants = [[pkg.private ? 'source' : 'esm', await import(pkg.private ? '../../index.js' : 'iosignal')]];
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

// options.authManager: use this auth manager (e.g. one shared between servers) instead of the fixture's.
async function fixture(t, api, authenticated = false, tcp = false, security = {}, { authManager, ...options } = {}) {
  const http = createServer();
  const previousMembersOnly = api.serverOption.membersOnly;
  api.serverOption.membersOnly = authenticated;
  const auth = authManager ?? (authenticated
    ? new api.BohoAuth(new api.StringKeyProvider('tester.fixture-key.fixture-client'))
    : undefined);
  const server = new api.Server({ httpServer: http, security, ...(tcp ? { congPort: 0 } : {}), ...options }, auth);
  const clients = [];
  const errors = [];
  server.attach('reply', api.replyService);
  server.wss.on('error', error => errors.push(error));
  http.on('error', error => errors.push(error));
  t.after(async () => {
    for (const client of clients) {
      const socket = client.socket;
      client.stop();
      socket?.terminate?.();
      socket?.destroy?.();
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
  const url = tcp ? `cong://127.0.0.1:${server.congPort}` : `ws://127.0.0.1:${http.address().port}`;
  function client(credentials) {
    const io = tcp ? new api.IOCongSocket() : new api.IO();
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
  return { server, auth, url, client, connect };
}

for (const [format, api] of variants) {
  for (const tcp of [false, true]) {
    test(`${format}: ${tcp ? 'TCP' : 'WS'} server PONG event is separate from peer @pong`, async t => {
      const { connect } = await fixture(t, api, false, tcp);
      const a = await connect(), b = await connect();
      const serverPong = event(a, 'pong', t.signal);
      a.ping();
      assert.deepEqual(await serverPong, []);
      let protocolPongs = 0;
      a.on('pong', () => protocolPongs++);
      b.on('@', (tag, sender) => {
        if (tag === '@ping') b.signal(`${sender}@pong`, b.cid);
      });
      const peerPong = event(a, '@', t.signal);
      a.signal(`${b.cid}@ping`, a.cid);
      assert.deepEqual(await peerPong, ['@pong', b.cid]);
      assert.equal(protocolPongs, 0);
    });
  }

  test(`${format}: invalid heartbeat settings are rejected without changing defaults`, () => {
    for (const value of [-1, 1.5, NaN, Infinity, -Infinity, '1000', '', false, {}, 2 ** 31]) {
      assert.throws(() => new api.Server({ port: 0, heartbeatInterval: 2000, heartbeatGrace: value }),
        { name: 'RangeError', message: 'heartbeatGrace must be an integer from 0 to 2147483647' });
      assert.throws(() => new api.Server({ port: 0, heartbeatInterval: value === -1 ? 0 : value }),
        { name: 'RangeError', message: 'heartbeatInterval must be an integer from 1 to 2147483647' });
    }
    assert.deepEqual([api.serverOption.heartbeatInterval, api.serverOption.heartbeatGrace], [50000, 5000]);
  });

  for (const tcp of [false, true]) {
    for (const grace of [undefined, 0, 1234]) {
      test(`${format}: ${tcp ? 'TCP' : 'WS'} heartbeat deadline with grace ${grace ?? 'default'}`, async t => {
        const options = grace === undefined ? {} : { heartbeatInterval: 2000, heartbeatGrace: grace };
        const { server, connect } = await fixture(t, api, false, tcp, {}, options);
        const manager = server.manager;
        clearTimeout(manager.pingIntervalID);
        manager.heartbeatStopped = true;
        const io = await connect();
        io.autoReconnect = false;
        const remote = manager.cid2remote.get(io.cid);
        const ping = t.mock.method(remote, 'ping');
        const close = t.mock.method(remote, 'close');
        let now = 100;
        t.mock.method(performance, 'now', () => now);
        const period = grace === undefined ? 50000 : 2000;
        const expectedGrace = grace ?? 5000;
        assert.equal(manager.pingPeriod, period);
        assert.equal(manager.pingGrace, expectedGrace);
        assert.equal(api.serverOption.heartbeatGrace, 5000, 'the default is not changed');
        manager.pingGroupCursor = remote.pingGroup;
        manager.heartbeatTick();
        const deadline = 100 + period + expectedGrace;
        assert.equal(manager.heartbeatPending.get(remote), deadline);
        assert.equal(ping.mock.callCount(), 1);
        assert.equal(remote.socket.isAlive, false);
        now = deadline - 0.5;
        manager.heartbeatTick();
        assert.equal(close.mock.callCount(), 0);
        assert.equal(manager.heartbeatPending.get(remote), deadline);
        now = deadline;
        manager.heartbeatTick();
        assert.equal(close.mock.callCount(), 1);
        assert.deepEqual(close.mock.calls[0].arguments, [true]);
        assert.equal(manager.heartbeatPending.has(remote), false);
      });
    }
  }

  for (const tcp of [false, true]) {
    test(`${format}: ${tcp ? 'TCP' : 'WS'} RPC IDs wrap through zero with and without arguments`, async t => {
      const { server, connect } = await fixture(t, api, false, tcp);
      server.attach('ids', { commands: ['inspect'], checkPermission: () => true,
        inspect(remote, req) { remote.response(req.mid, 0, { id: req.mid, args: req.args || [] }); } });
      const io = await connect();
      for (const args of [[], ['value']]) {
        io.mid = 65534;
        for (const id of [65535, 0, 1]) {
          const reply = await io.call('ids', 'inspect', ...args);
          assert.equal(io.mid, id);
          assert.equal(reply.mid, id);
          assert.deepEqual(reply.body, { id, args });
          assert.equal(io.promiseMap.size, 0);
        }
      }
    });
  }

  for (const tcp of [false, true]) {
    for (const how of ['stop', 'destroy', 'remote']) {
      test(`${format}: ${tcp ? 'TCP' : 'WS'} ${how} rejects all pending RPCs and clears timers`, { timeout: 4000 }, async t => {
        const { server, connect, url } = await fixture(t, api, false, tcp);
        let received = 0, acknowledge;
        const arrived = new Promise(resolve => { acknowledge = resolve; });
        server.attach('pending', { commands: ['wait'], checkPermission: () => true, wait() {
          if (++received === 3) acknowledge();
        } });
        const io = await connect();
        io.autoReconnect = false;
        io.promiseTimeOut = 30000; // Closure must settle requests well before their timeout.
        const requests = Array.from({ length: 3 }, () => assert.rejects(io.call('pending', 'wait'), error => {
          assert.equal(error.code, 'CONNECTION_CLOSED');
          assert.equal(error.message, 'Connection closed');
          return true;
        }));
        await arrived; // Close after requests arrive, without a response, avoiding unread TCP data resets.
        const timers = [...io.promiseMap.values()].map(entry => entry[2]);
        const clear = t.mock.method(globalThis, 'clearTimeout');
        if (how === 'remote') {
          const closed = event(io, 'closed', t.signal);
          server.manager.cid2remote.get(io.cid).close(true);
          await closed;
        } else {
          io[how]();
        }
        await Promise.all(requests);
        assert.equal(io.promiseMap.size, 0);
        for (const timer of timers) assert.ok(clear.mock.calls.some(call => call.arguments[0] === timer));
        io.close(); // Repeated cleanup must be harmless.
        if (how !== 'destroy') {
          const ready = event(io, 'ready', t.signal);
          io.open(url);
          await ready;
          assert.deepEqual((await io.call('reply', 'echo', 'new connection')).body, ['new connection']);
        }
      });
    }
  }

  for (const tcp of [false, true]) {
    test(`${format}: ${tcp ? 'TCP' : 'WS'} service exceptions respond without disrupting other RPCs`, async t => {
      const { server, connect } = await fixture(t, api, false, tcp);
      const first = await connect(), second = await connect();
      first.promiseTimeOut = 500;
      let release;
      const gate = new Promise(resolve => { release = resolve; });
      t.after(() => release());
      const methods = {
        commands: ['syncFail', 'asyncFail', 'delayedFail', 'ok'],
        checkPermission: () => true,
        syncFail() { throw Error('private synchronous detail'); },
        async asyncFail() { await Promise.resolve(); throw Error('private asynchronous detail'); },
        async delayedFail() { await gate; throw Error('private delayed detail'); },
        marker: 'receiver preserved',
        ok(remote, req) { remote.response(req.mid, 0, this.marker); },
      };
      server.attach('methods', methods);
      server.attach('dispatcher', { ...methods, call(remote, req) { return this[req.topic](remote, req); } });
      for (const service of ['methods', 'dispatcher']) {
        for (const topic of ['syncFail', 'asyncFail']) {
          await assert.rejects(first.call(service, topic), error => {
            assert.equal(error.body, 'INTERNAL_SERVER_ERROR');
            assert.equal(error.ok, false);
            return true;
          });
          assert.equal((await second.call(service, 'ok')).body, 'receiver preserved');
        }
      }
      const failure = assert.rejects(first.call('methods', 'delayedFail'), error => error.body === 'INTERNAL_SERVER_ERROR');
      // A pending service must not serialize or block an unrelated client's request.
      assert.deepEqual((await second.call('reply', 'echo', 'still serving')).body, ['still serving']);
      release();
      await failure;
      assert.deepEqual((await first.call('reply', 'echo', 'after failure')).body, ['after failure']);
    });
  }

  test(`${format}: tag limits use UTF-8 bytes and reject before mutation`, () => {
    const io = new api.IO();
    const sent = [];
    io.send_enc_mode = packet => sent.push(packet);
    const boundary = '가'.repeat(85); // 255 bytes, 85 JS characters.
    const overflow = boundary + 'x';
    assert.equal(api.getSignalPack(boundary)[1], 255);
    assert.throws(() => api.getSignalPack(overflow), /255/);
    assert.throws(() => api.getSignalPack('😀'.repeat(64)), /255/);
    io.state = api.STATE.READY; // subscribe() sends at once only on a ready connection
    io.subscribe(boundary);
    assert.equal(sent[0][1], 255);
    assert.throws(() => io.subscribe(overflow), /255/);
    assert.throws(() => io.signal(overflow), /255/);
    assert.throws(() => io.signal_e2e(overflow, Buffer.from([1]), 'test-key'), /255/);
    assert.throws(() => io.listen(overflow, () => {}), /255/);
    assert.throws(() => io.link('local', overflow, () => {}), /255/);
    assert.equal(io.channels.size, 0);
    assert.equal(io.linkMap.size, 0);
    assert.equal(io.listenerCount(overflow), 0);
    io.channels.add('keep');
    assert.throws(() => io.unsubscribe('keep,' + overflow), /255/);
    assert.equal(io.channels.has('keep'), true);
    io.cid = 'A';
    io.signal('@' + 'x'.repeat(253)); // 255 bytes after CID prefix.
    assert.throws(() => io.signal('@' + 'x'.repeat(254)), /255/);
    assert.throws(() => io.signal_e2e('@' + 'x'.repeat(254), Buffer.from([1]), 'key'), /255/);
    assert.equal(sent.length, 2);
    io.channels.add(overflow);
    io.state = api.STATE.READY;
    assert.throws(() => io.subscribe_channels(), /255/);
    assert.equal(sent.length, 2, 'validate all stored tags before sending any batch');
    io.destroy();
  });

  test(`${format}: automatic subscriptions split on tag boundaries and reconnect`, { timeout: 10000 }, async t => {
    const { server, client, connect, url } = await fixture(t, api);
    const io = client();
    const tags = ['가'.repeat(85), '😀'.repeat(63), 'tail'];
    for (const tag of tags) io.listen(tag, () => {});
    const packets = [];
    const send = io.send_enc_mode.bind(io);
    io.send_enc_mode = packet => {
      if (packet[0] === api.IOMsg.SUBSCRIBE) packets.push(Buffer.from(packet));
      send(packet);
    };
    const sender = await connect();
    for (let round = 0; round < 2; round++) {
      const ready = event(io, 'ready', t.signal);
      io.open(url);
      await ready;
      await io.call('reply', 'echo', 'subscriptions processed');
      const batch = packets.splice(0);
      assert.ok(batch.length > 1);
      assert.deepEqual(batch.flatMap(p => {
        assert.equal(p[1], p.length - 2);
        assert.ok(p[1] <= 255);
        return p.subarray(2).toString().split(',');
      }), tags);
      for (const tag of tags) {
        const received = event(io, 'message', t.signal);
        sender.signal(tag, 'ok');
        assert.deepEqual(await received, [tag, 'ok']);
      }
      const closed = event(server.manager.cid2remote.get(io.cid).socket, 'close', t.signal);
      io.stop();
      await closed;
    }
  });

  test(`${format}: stored subscriptions are sent before ready, so a ready handler's signal is answered`, { timeout: 10000 }, async t => {
    const { server, client, url } = await fixture(t, api);
    const io = client();
    const received = [];
    io.listen('self', (tag, text) => received.push(text));
    io.on('ready', () => io.signal('self', `round ${received.length}`));
    for (let round = 0; round < 2; round++) {
      const message = event(io, 'self', t.signal);
      io.open(url);
      await message;
      assert.deepEqual(received, Array.from({ length: round + 1 }, (_, i) => `round ${i}`));
      const closed = event(server.manager.cid2remote.get(io.cid).socket, 'close', t.signal);
      io.stop();
      await closed;
    }
  });

  test(`${format}: listen() inside a ready handler throws, for any tag`, { timeout: 10000 }, async t => {
    const { client, url } = await fixture(t, api);
    const io = client();
    const outcomes = [];
    io.on('ready', () => {
      assert.throws(() => io.listen('late', () => {}), /inside a ready handler/);
      outcomes.push('subscription tag');
      // A direct tag needs no subscription, but a handler added on every connect would run
      // once more after each reconnect: listen() and the ready handler are not mixed.
      assert.throws(() => io.listen('@direct', () => {}), /inside a ready handler/);
      outcomes.push('direct tag');
      io.on('@direct', () => {}); // on() stays the ready handler's way to add a handler
    });
    const ready = event(io, 'ready', t.signal);
    io.open(url);
    await ready;
    assert.deepEqual(outcomes, ['subscription tag', 'direct tag']);
    assert.equal(io.channels.has('late'), false);
    assert.equal(io.listenerCount('@direct'), 1);
    io.listen('after', () => {}); // outside the handler, listen() is unchanged
    assert.equal(io.channels.has('after'), true);
  });

  test(`${format}: link() waits for a ready connection; subscribe() before it throws`, { timeout: 10000 }, async t => {
    const { server, client, connect, url } = await fixture(t, api);
    const sender = await connect();
    sender.signal('room$x', 'kept');
    await sender.call('reply', 'echo', 'retained stored');

    const io = client();
    const packets = [];
    const send = io.send_enc_mode.bind(io);
    io.send_enc_mode = packet => {
      if (packet[0] === api.IOMsg.SUBSCRIBE) packets.push({ state: io.stateName, tags: Buffer.from(packet.subarray(2)).toString().split(',') });
      send(packet);
    };
    let retained = 0;
    io.link('page', 'room$x', () => retained++);
    assert.throws(() => io.subscribe('manual'), /needs a ready connection/);
    assert.throws(() => io.subscribe('@direct'), TypeError, 'an invalid tag is still a TypeError');
    // Between the socket opening and the CID: the old client sent these at once, unencrypted.
    const early = [];
    let first = true;
    io.on('change', state => {
      if (state !== 'server_ready' || !first) return;
      first = false;
      io.link('page', 'early', () => {});
      try { io.subscribe('early-manual'); } catch (error) { early.push(error.message); }
    });
    const ready = event(io, 'ready', t.signal);
    io.open(url);
    await ready;
    await io.call('reply', 'echo', 'subscriptions processed');
    assert.equal(early.length, 1);
    assert.match(early[0], /needs a ready connection \(state: server_ready\)/);
    assert.ok(packets.every(p => p.state === 'ready'), 'nothing is sent before the connection is ready');
    assert.deepEqual(packets.flatMap(p => p.tags).sort(), ['early', 'room$x']);
    assert.equal(retained, 1, 'the retained value arrives once');
    assert.equal(io.channels.has('manual'), false);

    // Ready now: both send at once.
    packets.length = 0;
    io.link('page', 'later', () => {});
    io.subscribe('later-manual');
    assert.deepEqual(packets.map(p => p.tags), [['later'], ['later-manual']]);

    // subscribe() lasts one connection; link() is sent again after a reconnect.
    packets.length = 0;
    const closed = event(server.manager.cid2remote.get(io.cid).socket, 'close', t.signal);
    io.stop();
    await closed;
    assert.throws(() => io.subscribe('offline'), /needs a ready connection \(state: stop\)/);
    const again = event(io, 'ready', t.signal);
    io.open(url);
    await again;
    await io.call('reply', 'echo', 'subscriptions processed');
    assert.deepEqual(packets.flatMap(p => p.tags).sort(), ['early', 'later', 'room$x']);
  });

  test(`${format}: server rejects oversized CID rewrites without sending`, { timeout: 10000 }, async t => {
    const { server, connect } = await fixture(t, api);
    const sender = await connect();
    const receiver = await connect();
    const manager = server.manager;
    const remote = manager.cid2remote.get(sender.cid);
    const valid = '@' + 'x'.repeat(255 - Buffer.byteLength(sender.cid) - 1);
    const oversized = valid + 'x'; // Raw tag fits, rewritten tag does not.
    receiver.subscribe(sender.cid + valid);
    await receiver.call('reply', 'echo', 'subscribed');
    assert.deepEqual(manager.sender(oversized, remote, api.getSignalPack(oversized)),
      ['err', 'CID-prefixed tag exceeds 255 UTF-8 bytes']);
    assert.equal(manager.getNewSignalTagMessage(api.getSignalPack('@'), '가'.repeat(86)), null);
    const received = event(receiver, 'message', t.signal);
    sender.signal(valid, 'valid');
    assert.deepEqual(await received, [sender.cid + valid, 'valid']);
  });

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

  test(`${format}: EMPTY omits payload arguments while OBJECT null preserves one`, { timeout: 10000 }, async t => {
    const { connect } = await fixture(t, api);
    const receiver = await connect();
    const sender = await connect();
    const cidTag = `${sender.cid}@value`;
    receiver.subscribe(`empty-room,${cidTag}`);
    await receiver.call('reply', 'echo', 'subscribed');
    for (const [sendTag, receiveTag, events] of [
      ['empty-room', 'empty-room', ['empty-room', 'message']],
      ['@value', cidTag, [cidTag, 'message']],
      [`${receiver.cid}@value`, '@value', ['@', '@value']],
    ]) {
      for (const payloadArgs of [[], [null]]) {
        const pending = events.map(name => event(receiver, name, t.signal));
        sender.signal(sendTag, ...payloadArgs);
        for (const args of await Promise.all(pending)) {
          assert.deepEqual(args, [receiveTag, ...payloadArgs]);
          assert.equal(args.length, payloadArgs.length + 1);
          assert.equal(args[1], payloadArgs.length ? null : undefined);
        }
      }
    }
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

for (const [format, api] of variants) {
  test(`${format}: duplicate login can replace the old connection without losing the new CID`, { timeout: 10000 }, async t => {
    const { server, auth, connect } = await fixture(t, api, true);
    auth.keepOldConnection = false;
    const old = await connect(['tester', 'fixture-key']);
    old.autoReconnect = false;
    const oldRemote = server.manager.cid2remote.get(old.cid);
    const closed = event(oldRemote.socket, 'close', t.signal);
    const replacement = await connect(['tester', 'fixture-key']);
    await closed;
    const mapped = server.manager.cid2remote.get(replacement.cid);
    assert.ok(mapped);
    assert.notEqual(mapped, oldRemote);
    assert.equal(mapped.boho.isAuthorized, true);
    assert.equal(old.boho.isAuthorized, false);
    assert.deepEqual((await replacement.call('reply', 'echo', 'replacement')).body, ['replacement']);
  });

  test(`${format}: duplicate login policy defaults to keepNew and validates overrides`, () => {
    const provider = new api.StringKeyProvider('tester.fixture-key.fixture-client');
    assert.equal(api.serverOption.auth.duplicateLogin, 'keepNew');
    const auth = new api.BohoAuth(provider);
    assert.deepEqual([auth.duplicateLogin, auth.keepOldConnection], ['keepNew', false]);
    assert.equal(new api.BohoAuth(provider, { duplicateLogin: 'keepOld' }).duplicateLogin, 'keepOld');
    auth.keepOldConnection = true;
    assert.equal(auth.duplicateLogin, 'keepOld');
    auth.duplicateLogin = null;
    assert.equal(auth.duplicateLogin, 'keepNew');
    for (const value of [true, 'keepold', '', 1]) {
      assert.throws(() => new api.BohoAuth(provider, { duplicateLogin: value }), RangeError);
      assert.throws(() => new api.Server({ port: 0, duplicateLogin: value }, auth), RangeError);
    }
    assert.equal(auth.duplicateLogin, 'keepNew');
  });

  test(`${format}: default duplicateLogin replaces the old login`, { timeout: 10000 }, async t => {
    const { server, auth, connect } = await fixture(t, api, true);
    assert.equal(auth.duplicateLogin, 'keepNew');
    const old = await connect(['tester', 'fixture-key']);
    old.autoReconnect = false;
    const oldRemote = server.manager.cid2remote.get(old.cid);
    const closed = event(oldRemote.socket, 'close', t.signal);
    const replacement = await connect(['tester', 'fixture-key']);
    await closed;
    assert.notEqual(server.manager.cid2remote.get(replacement.cid), oldRemote);
    assert.deepEqual((await replacement.call('reply', 'echo', 'new')).body, ['new']);
  });

  test(`${format}: replaced duplicate login does not publish close for the online CID`, { timeout: 10000 }, async t => {
    const { server, auth, connect } = await fixture(t, api, true);
    auth.keepOldConnection = false;
    const old = await connect(['tester', 'fixture-key']);
    old.autoReconnect = false;
    const cid = old.cid;
    const oldRemote = server.manager.cid2remote.get(cid);
    const watcher = await connect();
    const states = [];
    watcher.on(`${cid}@state`, (tag, state) => states.push([tag, state]));
    watcher.on(`${cid}@$state`, (tag, state) => states.push([tag, state]));
    watcher.subscribe(`${cid}@state,${cid}@$state`);
    await watcher.call('reply', 'echo', 'subscribed');

    const closed = event(oldRemote.socket, 'close', t.signal);
    const replacement = await connect(['tester', 'fixture-key']);
    await closed;
    // Signals from the removed remote would arrive before this response.
    await watcher.call('reply', 'echo', 'flush');
    assert.equal(replacement.cid, cid);
    assert.deepEqual(states, []);

    const realClose = event(watcher, `${cid}@state`, t.signal);
    replacement.stop();
    assert.deepEqual(await realClose, [`${cid}@state`, 'close']);
  });

  test(`${format}: keeping the old login revokes authorization on the rejected peer`, { timeout: 10000 }, async t => {
    const { server, connect, client, url } = await fixture(t, api, true, false, {}, { duplicateLogin: 'keepOld' });
    const old = await connect(['tester', 'fixture-key']);
    const remote = server.manager.cid2remote.get(old.cid);
    const duplicate = client(['tester', 'fixture-key']);
    duplicate.autoReconnect = false;
    const rejected = event(duplicate, 'auth_fail', t.signal);
    duplicate.open(url);
    await rejected;
    assert.equal(server.manager.cid2remote.get(old.cid), remote);
    for (const peer of server.manager.remotes) {
      if (peer !== remote) assert.equal(peer.boho.isAuthorized, false);
    }
    assert.deepEqual((await old.call('reply', 'echo', 'kept')).body, ['kept']);
  });

  test(`${format}: Server duplicateLogin applies to its own connections and leaves a shared auth manager unchanged`, { timeout: 10000 }, async t => {
    const auth = new api.BohoAuth(new api.StringKeyProvider('tester.fixture-key.fixture-client'));
    // Created first: a policy written into the shared auth manager would be overwritten by the next server.
    const keepOld = await fixture(t, api, false, false, {}, { authManager: auth, duplicateLogin: 'keepOld' });
    const keepNew = await fixture(t, api, false, false, {}, { authManager: auth, duplicateLogin: 'keepNew' });
    const followsAuth = await fixture(t, api, false, false, {}, { authManager: auth });
    assert.deepEqual([keepOld.server.duplicateLogin, keepNew.server.duplicateLogin, followsAuth.server.duplicateLogin],
      ['keepOld', 'keepNew', null]);
    assert.equal(auth.duplicateLogin, api.serverOption.auth.duplicateLogin);

    const kept = await keepOld.connect(['tester', 'fixture-key']);
    const keptRemote = keepOld.server.manager.cid2remote.get(kept.cid);
    const duplicate = keepOld.client(['tester', 'fixture-key']);
    duplicate.autoReconnect = false;
    const rejected = event(duplicate, 'auth_fail', t.signal);
    duplicate.open(keepOld.url);
    await rejected;
    assert.equal(keepOld.server.manager.cid2remote.get(kept.cid), keptRemote);

    const old = await keepNew.connect(['tester', 'fixture-key']);
    old.autoReconnect = false;
    const oldRemote = keepNew.server.manager.cid2remote.get(old.cid);
    const closed = event(oldRemote.socket, 'close', t.signal);
    const replacement = await keepNew.connect(['tester', 'fixture-key']);
    await closed;
    assert.notEqual(keepNew.server.manager.cid2remote.get(replacement.cid), oldRemote);

    // Without the option a server follows the auth manager, now set to keepOld.
    auth.duplicateLogin = 'keepOld';
    const first = await followsAuth.connect(['tester', 'fixture-key']);
    const second = followsAuth.client(['tester', 'fixture-key']);
    second.autoReconnect = false;
    const refused = event(second, 'auth_fail', t.signal);
    second.open(followsAuth.url);
    await refused;
    assert.ok(followsAuth.server.manager.cid2remote.get(first.cid));
    assert.equal(auth.duplicateLogin, 'keepOld');
  });
}

for (const [format, api] of variants) {
  test(`${format}: state callbacks see consistent values and can stop reentrantly`, () => {
    for (const stopEvent of ['ready', 'change']) {
      const io = new api.IO();
      const changes = [];
      let readyEvents = 0;
      io.on('change', name => {
        changes.push(name);
        assert.equal(io.state, api.STATE[name.toUpperCase()]);
        assert.equal(io.stateName, name);
        assert.equal(io.getStateName(), name);
        if (stopEvent === 'change' && name === 'ready') io.stop();
      });
      io.on('ready', () => {
        readyEvents++;
        assert.equal(io.stateName, 'ready');
        if (stopEvent === 'ready') io.stop();
      });
      io.stateChange('ready', 'cid_ready');
      assert.equal(io.state, api.STATE.STOP);
      assert.equal(io.stateName, 'stop');
      assert.deepEqual(changes, ['ready', 'closed', 'stop']);
      assert.equal(readyEvents, stopEvent === 'ready' ? 1 : 0);
      io.destroy();
    }
  });

  test(`${format}: stop in server_ready prevents authentication from continuing`, () => {
    const io = new api.IO();
    io.auth('tester', 'fixture-key');
    const sent = [];
    io.send = bytes => sent.push(bytes);
    io.on('server_ready', () => io.stop());
    io.onData(new api.Boho().server_time_nonce());
    assert.equal(io.stateName, 'stop');
    assert.deepEqual(sent, []);
    io.destroy();
  });

  for (const tcp of [false, true]) {
    test(`${format}: ${tcp ? 'TCP' : 'WS'} explicit close clears identity before notification and can reconnect`, { timeout: 10000 }, async t => {
      const { server, connect, url } = await fixture(t, api, true, tcp);
      const io = await connect(['tester', 'fixture-key']);
      const oldRemote = server.manager.cid2remote.get(io.cid);
      const removed = event(oldRemote.socket, 'close', t.signal);
      let notifications = 0;
      io.once('closed', () => {
        notifications++;
        assert.equal(io.stateName, 'closed');
        assert.equal(io.cid, '');
        assert.equal(io.boho.isAuthorized, false);
      });
      io.close();
      assert.equal(notifications, 1);
      await removed;
      assert.equal(oldRemote.state, api.STATE.CLOSED);
      const ready = event(io, 'ready', t.signal);
      io.open(url);
      await ready;
      assert.equal(io.stateName, 'ready');
      assert.equal(io.boho.isAuthorized, true);
    });

    test(`${format}: ${tcp ? 'TCP' : 'WS'} stop during connecting leaves no reconnect timer`, { timeout: 10000 }, async t => {
      const { client, url } = await fixture(t, api, false, tcp);
      const io = client();
      io.on('connecting', () => io.stop());
      io.open(url);
      await new Promise(resolve => setImmediate(resolve));
      assert.equal(io.socket, null);
      assert.equal(io.stateName, 'stop');
      assert.equal(io.connectionCheckerIntervalID, null);
    });
  }

  test(`${format}: manual login works; reused challenge closes; reconnect authenticates`, { timeout: 10000 }, async t => {
    const { server, connect, url } = await fixture(t, api, true);
    const io = await connect();
    io.autoReconnect = false;
    const remote = server.manager.cid2remote.get(io.cid);
    const ready = event(io, 'ready', t.signal);
    io.login('tester', 'fixture-key');
    await ready;
    assert.equal(io.cid, 'fixture-client');
    assert.equal(remote.state, api.STATE.CID_RES);
    assert.deepEqual((await io.call('reply', 'echo', 'login')).body, ['login']);
    const closed = event(remote.socket, 'close', t.signal);
    const clientClosed = event(io, 'close', t.signal);
    io.login('tester', 'fixture-key');
    await Promise.all([closed, clientClosed]);
    assert.equal(remote.securityFailure, 'AUTH_CHALLENGE_REUSED');
    assert.equal(remote.boho.isAuthorized, false);
    const reopened = event(io, 'ready', t.signal);
    io.open(url);
    await reopened;
    assert.notEqual(server.manager.cid2remote.get(io.cid), remote);
    assert.deepEqual((await io.call('reply', 'echo', 'reconnected')).body, ['reconnected']);
  });

  test(`${format}: TCP duplicate rejection records failure before close`, { timeout: 10000 }, async t => {
    const { server, connect, client, url } = await fixture(t, api, true, true, {}, { duplicateLogin: 'keepOld' });
    const old = await connect(['tester', 'fixture-key']);
    const original = server.manager.cid2remote.get(old.cid);
    const observed = [];
    const remove = server.manager.removeRemote.bind(server.manager);
    server.manager.removeRemote = remote => {
      if (remote !== original) observed.push(remote.state);
      remove(remote);
    };
    const duplicate = client(['tester', 'fixture-key']);
    duplicate.autoReconnect = false;
    const closed = event(duplicate, 'close', t.signal);
    duplicate.open(url);
    await closed;
    // Wait for the server-side FIN completion as well.
    for (const peer of server.manager.remotes) {
      if (peer !== original) await event(peer.socket, 'close', t.signal);
    }
    assert.deepEqual(observed, [api.STATE.AUTH_FAIL]);
    assert.equal(server.manager.cid2remote.get(old.cid), original);
  });

  test(`${format}: invalid protocol state closes without continuing request processing`, { timeout: 10000 }, async t => {
    const { server, connect, auth } = await fixture(t, api, true);
    for (const code of [api.IOMsg.CID_REQ, api.Boho.BohoMsg.AUTH_REQ]) {
      const io = await connect();
      const remote = server.manager.cid2remote.get(io.cid);
      remote.setState(api.STATE.OPEN);
      let sends = 0, authCalls = 0;
      remote.send_enc_mode = () => sends++;
      auth.verify_auth_req = async () => { authCalls++; };
      const closed = event(remote.socket, 'close', t.signal);
      remote.onSocketMessage(Buffer.from([code]));
      assert.equal(sends, 0);
      assert.equal(authCalls, 0);
      await closed;
      assert.equal(remote.state, api.STATE.CLOSED);
    }
  });

  test(`${format}: delayed credential lookup cannot revive a closed connection`, { timeout: 10000 }, async t => {
    const { server, connect, auth } = await fixture(t, api, true);
    const io = await connect();
    io.autoReconnect = false;
    const remote = server.manager.cid2remote.get(io.cid);
    let release;
    let started;
    const lookupStarted = new Promise(resolve => { started = resolve; });
    const getAuth = auth.keyProvider.getAuth.bind(auth.keyProvider);
    auth.keyProvider.getAuth = async id => {
      started();
      await new Promise(resolve => { release = resolve; });
      return getAuth(id);
    };
    const verify = auth.verify_auth_req.bind(auth);
    let pending;
    auth.verify_auth_req = (...args) => (pending = verify(...args));
    io.login('tester', 'fixture-key');
    await lookupStarted;
    const closed = event(remote.socket, 'close', t.signal);
    io.stop();
    await closed;
    release();
    await pending;
    assert.equal(remote.state, api.STATE.CLOSED);
    assert.equal(server.manager.cid2remote.has('fixture-client'), false);
  });
}

// Build correctly authenticated test packets with explicit wire clocks, without
// changing the process clock or the production JS/Arduino senders.
function packetWithClock(io, timeMs, counter, plain) {
  const setClock = io.boho.set_clock_nonce;
  io.boho.set_clock_nonce = function (nonce) {
    const salt = Buffer.alloc(12);
    salt.writeUInt32LE(Math.floor(timeMs / 1000), 0);
    salt.writeUInt16LE(timeMs % 1000, 4);
    salt.writeUInt16LE(counter, 6);
    salt.set(nonce, 8);
    this.set_salt12(salt);
  };
  try { return Buffer.from(io.boho.encrypt_488(plain)); }
  finally { io.boho.set_clock_nonce = setClock; }
}

for (const [format, api] of variants) {
  for (const tcp of [false, true]) {
    test(`${format}: ${tcp ? 'TCP' : 'WS'} encrypted RPC replay disconnects before a second execution`, { timeout: 10000 }, async t => {
      const { server, connect } = await fixture(t, api, true, tcp);
      const io = await connect(['tester', 'fixture-key']);
      io.autoReconnect = false;
      const remote = server.manager.cid2remote.get(io.cid);
      let calls = 0;
      server.on('reply', () => calls++);
      let captured;
      const send = io.socket_send.bind(io);
      io.socket_send = data => { captured = Buffer.from(data); send(data); };
      assert.deepEqual((await io.call('reply', 'echo', 'once')).body, ['once']);
      assert.equal(captured[0], api.Boho.BohoMsg.ENC_488);
      const closed = event(remote.socket, 'close', t.signal);
      const failure = event(server, 'security:mismatch', t.signal);
      io.send(captured);
      const [failedRemote, reason] = await failure;
      await closed;
      assert.equal(failedRemote, remote);
      assert.equal(reason, 'REPLAY_DETECTED');
      assert.equal(calls, 1);
      assert.equal(remote.boho.isAuthorized, false);
      assert.equal(remote.state, api.STATE.CLOSED);
    });
  }

  for (const delta of [-60001, 60001]) {
    test(`${format}: authentic encrypted timestamp outside window (${delta}) closes`, { timeout: 10000 }, async t => {
      const { server, connect } = await fixture(t, api, true);
      const io = await connect(['tester', 'fixture-key']);
      io.autoReconnect = false;
      const remote = server.manager.cid2remote.get(io.cid);
      const now = Date.now();
      const packet = packetWithClock(io, now + delta, 1, Buffer.from([api.IOMsg.ECHO]));
      let deliveries = 0;
      remote.send = packet => { if (packet[0] === api.IOMsg.ECHO) deliveries++; };
      const closed = event(remote.socket, 'close', t.signal);
      remote.onSocketMessage(packet, true, now);
      await closed;
      assert.equal(remote.securityFailure, 'TIME_MISMATCH');
      assert.equal(deliveries, 0);
    });
  }

  test(`${format}: clock boundaries, counter wrap and backward correction allow unique tuples`, { timeout: 10000 }, async t => {
    const { server, connect } = await fixture(t, api, true);
    const io = await connect(['tester', 'fixture-key']);
    io.autoReconnect = false;
    const remote = server.manager.cid2remote.get(io.cid);
    const now = Date.now();
    let deliveries = 0;
    remote.send = packet => { if (packet[0] === api.IOMsg.ECHO) deliveries++; };
    for (const [time, counter] of [[now - 60000, 12], [now + 60000, 12],
      [now, 65535], [now, 0], [now, 1], [now - 10, 1]]) {
      remote.onSocketMessage(packetWithClock(io, time, counter, Buffer.from([api.IOMsg.ECHO])), true, now);
    }
    assert.equal(deliveries, 6);
    assert.equal(remote.securityFailure, null);
    const closed = event(remote.socket, 'close', t.signal);
    remote.onSocketMessage(packetWithClock(io, now, 0, Buffer.from([api.IOMsg.ECHO, 99])), true, now);
    await closed;
    assert.equal(remote.securityFailure, 'REPLAY_DETECTED', 'different payload cannot reuse a tuple');
    assert.equal(deliveries, 6);
  });

  test(`${format}: ENC_E2E shares replay history with ENC_488 before routing`, { timeout: 10000 }, async t => {
    const { server, connect } = await fixture(t, api, true);
    const io = await connect(['tester', 'fixture-key']);
    io.autoReconnect = false;
    const remote = server.manager.cid2remote.get(io.cid);
    const now = Date.now();
    const routing = Buffer.from([api.IOMsg.SIGNAL_E2E, 1, 120, api.PAYLOAD_TYPE.BINARY]);
    const header = packetWithClock(io, now, 77, routing);
    const wire = Buffer.concat([header, io.boho.encrypt_e2e('opaque-body', 'e2e-fixture-key')]);
    wire[0] = api.Boho.BohoMsg.ENC_E2E;
    let routed = 0;
    server.manager.sender = tag => { if (tag === 'x') routed++; };
    remote.onSocketMessage(Buffer.from(wire), true, now);
    assert.equal(routed, 1);
    assert.equal(remote.securityFailure, null);
    const closed = event(remote.socket, 'close', t.signal);
    remote.onSocketMessage(header, true, now);
    await closed;
    assert.equal(remote.securityFailure, 'REPLAY_DETECTED');
    assert.equal(routed, 1);
  });

  test(`${format}: forged clock fails integrity and never executes`, { timeout: 10000 }, async t => {
    const { server, connect } = await fixture(t, api, true);
    const io = await connect(['tester', 'fixture-key']);
    io.autoReconnect = false;
    const remote = server.manager.cid2remote.get(io.cid);
    const packet = packetWithClock(io, Date.now(), 10, Buffer.from([api.IOMsg.ECHO]));
    packet[5] ^= 1;
    let deliveries = 0;
    remote.send = packet => { if (packet[0] === api.IOMsg.ECHO) deliveries++; };
    const closed = event(remote.socket, 'close', t.signal);
    remote.onSocketMessage(packet);
    await closed;
    assert.equal(remote.securityFailure, 'INVALID_ENCRYPTED_PACKET');
    assert.equal(deliveries, 0);
    assert.equal(remote._replayEntries, 0);
  });

  test(`${format}: expired challenge closes before key lookup`, { timeout: 10000 }, async t => {
    const { server, connect, auth } = await fixture(t, api, true);
    const io = await connect();
    io.autoReconnect = false;
    const remote = server.manager.cid2remote.get(io.cid);
    remote._challengeIssuedAt -= server.security.authChallengeMaxAgeMs + 1;
    let lookups = 0;
    auth.keyProvider.getAuth = async () => { lookups++; };
    const closed = event(remote.socket, 'close', t.signal);
    io.login('tester', 'fixture-key');
    await closed;
    assert.equal(remote.securityFailure, 'AUTH_CHALLENGE_EXPIRED');
    assert.equal(lookups, 0);
  });

  test(`${format}: challenge expiry during key lookup cannot authorize`, { timeout: 10000 }, async t => {
    const { server, connect, auth } = await fixture(t, api, true);
    const io = await connect();
    io.autoReconnect = false;
    const remote = server.manager.cid2remote.get(io.cid);
    const lookup = auth.keyProvider.getAuth.bind(auth.keyProvider);
    auth.keyProvider.getAuth = async id => {
      remote._challengeIssuedAt -= server.security.authChallengeMaxAgeMs + 1;
      return lookup(id);
    };
    const closed = event(remote.socket, 'close', t.signal);
    io.login('tester', 'fixture-key');
    await closed;
    assert.equal(remote.securityFailure, 'AUTH_CHALLENGE_EXPIRED');
    assert.equal(remote.boho.isAuthorized, false);
    assert.equal(server.manager.cid2remote.has('fixture-client'), false);
  });

  test(`${format}: replay storage is bounded without evicting valid evidence`, { timeout: 10000 }, async t => {
    const { server, connect } = await fixture(t, api, true, false, { maxReplayEntries: 2 });
    const io = await connect(['tester', 'fixture-key']);
    io.autoReconnect = false;
    const remote = server.manager.cid2remote.get(io.cid);
    let deliveries = 0;
    remote.send = packet => { if (packet[0] === api.IOMsg.ECHO) deliveries++; };
    const now = Date.now();
    const closed = event(remote.socket, 'close', t.signal);
    for (let i = 0; i < 3; i++) {
      remote.onSocketMessage(packetWithClock(io, now, i, Buffer.from([api.IOMsg.ECHO])), true, now);
    }
    await closed;
    assert.equal(deliveries, 2);
    assert.equal(remote.securityFailure, 'REPLAY_CAPACITY_EXCEEDED');
  });

  test(`${format}: expired replay buckets retire; clock rollback cannot reopen them`, { timeout: 10000 }, async t => {
    const { server, connect } = await fixture(t, api, true, false, { maxReplayEntries: 2, maxClockSkewMs: 1000 });
    const io = await connect(['tester', 'fixture-key']);
    io.autoReconnect = false;
    const remote = server.manager.cid2remote.get(io.cid);
    remote.send = () => {};
    const now = Math.floor(Date.now() / 1000) * 1000;
    const old = packetWithClock(io, now, 1, Buffer.from([api.IOMsg.ECHO]));
    remote.onSocketMessage(old, true, now);
    remote.onSocketMessage(packetWithClock(io, now + 3000, 2, Buffer.from([api.IOMsg.ECHO])), true, now + 3000);
    assert.equal(remote._replayEntries, 1);
    assert.equal(remote.securityFailure, null);
    const closed = event(remote.socket, 'close', t.signal);
    remote.onSocketMessage(old, true, now);
    await closed;
    assert.equal(remote.securityFailure, 'TIME_MISMATCH');
  });

  test(`${format}: invalid security options fail before opening sockets`, () => {
    for (const name of ['maxClockSkewMs', 'authChallengeMaxAgeMs', 'maxReplayEntries']) {
      for (const value of [0, -1, NaN, Infinity, 1.5, '60000']) {
        assert.throws(() => new api.Server({ port: 0, security: { [name]: value } }), RangeError);
      }
    }
  });
}

for (const [format, api] of variants) {
  test(`${format}: direct tags reject subscription atomically and component links are local`, t => {
    const io = new api.IO(); t.after(() => io.destroy());
    const sent = []; io.send_enc_mode = p => sent.push(p);
    for (const invalid of ['@', '@offer', 'room,@offer', '@offer,room']) {
      assert.throws(() => io.subscribe(invalid), /no subscription/);
      assert.throws(() => io.unsubscribe(invalid), /no subscription/);
    }
    assert.throws(() => io.listen('room,@offer', () => {}), /no subscription/);
    assert.throws(() => io.link('view', 'room,@offer', () => {}), /no subscription/);
    assert.equal(io.channels.size, 0); assert.equal(io.linkMap.size, 0);
    let shared = 0, standalone = 0;
    const callback = () => shared++;
    io.listen('@offer', () => standalone++);
    io.link('view-a', '@offer', callback);
    io.link('view-b', '@offer', callback);
    io.unlinkAll('view-a');
    io.emit('@offer', '@offer', 'msg');
    assert.equal(shared, 1); assert.equal(standalone, 1);
    io.unlink('view-b', '@offer');
    io.emit('@offer', '@offer', 'msg');
    assert.equal(shared, 1); assert.equal(standalone, 2);
    assert.equal(sent.length, 0); assert.equal(io.channels.size, 0);
    io.channels.add('room'); io.channels.add('@offer'); io.state = api.STATE.READY;
    assert.throws(() => io.subscribe_channels(), /no subscription/);
    assert.equal(sent.length, 0, 'validate all saved subscriptions before any send');
  });

  test(`${format}: unlink preserves shared, listen and explicit subscription ownership`, t => {
    const io = new api.IO(); t.after(() => io.destroy());
    const sent = []; io.send_enc_mode = p => sent.push(p);
    io.state = api.STATE.READY; // subscribe() needs a ready connection
    const unsubs = () => sent.filter(p => p[0] === api.IOMsg.UNSUBSCRIBE).map(p => Buffer.from(p.subarray(2)).toString());
    io.link('a', 'room', () => {}); io.link('b', 'room', () => {});
    io.unlinkAll('a'); assert.deepEqual(unsubs(), []); assert.ok(io.channels.has('room'));
    io.unlinkAll('b'); assert.deepEqual(unsubs(), ['room']); assert.ok(!io.channels.has('room'));
    sent.length = 0;
    io.link('a', 'shared', () => {}); io.listen('shared', () => {});
    io.unlinkAll('a'); assert.deepEqual(unsubs(), []); assert.ok(io.channels.has('shared'));
    io.subscribe('manual'); io.link('a', 'manual', () => {});
    io.unlinkAll('a'); assert.deepEqual(unsubs(), []); assert.ok(!io.channels.has('manual'));
    io.link('a', 'late-manual', () => {}); io.subscribe('late-manual');
    io.unlinkAll('a'); assert.deepEqual(unsubs(), []);
    io.link('a', 'one,two', () => {}); io.link('b', 'one', () => {});
    io.unlinkAll('a'); assert.deepEqual(unsubs(), ['two']);
    io.unlinkAll('b'); assert.deepEqual(unsubs(), ['two', 'one']);
    sent.length = 0;
    io.subscribe('released'); io.unsubscribe('released');
    io.link('a', 'released', () => {}); io.unlinkAll('a');
    assert.deepEqual(unsubs(), ['released', 'released'], 'explicit unsubscribe releases ownership');
    sent.length = 0;
    io.listen('released-listen', () => {}); io.unsubscribe('released-listen');
    io.link('a', 'released-listen', () => {}); io.unlinkAll('a');
    assert.deepEqual(unsubs(), ['released-listen', 'released-listen']);
  });

  for (const tcp of [false, true]) {
    test(`${format}: ${tcp ? 'TCP' : 'WS'} direct dual events preserve payloads without subscriptions`, async t => {
      const { connect } = await fixture(t, api, false, tcp);
      const a = await connect(), b = await connect();
      const events = [], sent = [];
      const send = b.send_enc_mode.bind(b);
      b.send_enc_mode = p => { sent.push(p[0]); return send(p); };
      // Register exact-topic first to verify dispatch order is independent of registration order.
      b.listen('@offer', (...args) => events.push(['@offer', args]));
      b.on('@', (...args) => events.push(['@', args]));
      b.on('message', (...args) => events.push(['message', args]));
      b.link('view', '@offer', () => {});
      assert.ok(!sent.includes(api.IOMsg.SUBSCRIBE));
      const payloads = [[], ['msg'], [Buffer.from([0, 255])], [{ n: 1 }], [null], ['a', 42], ['a', Buffer.from([7]), 42]];
      const normalize = value => ArrayBuffer.isView(value) ? Buffer.from(value) : value;
      for (const tag of ['@offer', '@']) for (const payload of payloads) {
        events.length = 0;
        const received = event(b, tag === '@' ? '@' : '@offer', t.signal);
        a.signal(b.cid + tag, ...payload);
        await received;
        // A reply round trip from b observes completion of synchronous packet dispatch.
        await b.call('reply', 'echo', 'barrier');
        assert.deepEqual(events.map(([name]) => name), tag === '@' ? ['@'] : ['@', '@offer']);
        for (const [, args] of events) assert.deepEqual(args.map(normalize), [tag, ...payload].map(normalize));
      }
      b.unlinkAll('view');
      assert.ok(!sent.includes(api.IOMsg.UNSUBSCRIBE));
    });

    test(`${format}: ${tcp ? 'TCP' : 'WS'} linked subscription survives component teardown and reconnect`, async t => {
      const { connect, server, url } = await fixture(t, api, false, tcp);
      const a = await connect(), b = await connect();
      let first = 0, second = 0;
      b.link('view-a', 'shared-room', () => first++);
      b.link('view-b', 'shared-room', () => second++);
      await b.call('reply', 'echo', 'subscribed');
      b.unlinkAll('view-a');
      let received = event(b, 'shared-room', t.signal);
      a.signal('shared-room', 'one'); await received;
      assert.equal(first, 0); assert.equal(second, 1);
      const closed = event(server.manager.cid2remote.get(b.cid).socket, 'close', t.signal);
      b.stop(); await closed;
      const ready = event(b, 'ready', t.signal); b.open(url); await ready;
      await b.call('reply', 'echo', 'resubscribed');
      received = event(b, 'shared-room', t.signal);
      a.signal('shared-room', 'two'); await received;
      assert.equal(first, 0); assert.equal(second, 2);
      b.unlinkAll('view-b');
      await b.call('reply', 'echo', 'unsubscribed');
      assert.equal(server.manager.cid2remote.get(b.cid).channels.size, 0);
    });
  }

  for (const tcp of [false, true]) {
    test(`${format}: ${tcp ? 'TCP' : 'WS'} sends after stop or destroy are dropped without throwing or logging`, async t => {
      const { connect } = await fixture(t, api, true, tcp);
      const io = await connect(['tester', 'fixture-key']);
      const logged = [];
      t.mock.method(console, 'log', (...args) => logged.push(args));
      io.stop();
      io.signal('room', 'stopped');
      io.destroy();
      // A game loop timer that outlives its client must not crash the process.
      await new Promise((resolve, reject) => setTimeout(() => {
        try {
          io.signal('room', 'late');
          io.publish('room', { late: true });
          io.signal('#room', 'late');
          io.signal_e2e('room', Buffer.from([1]), 'e2e-key');
          io.subscribe('room');
          io.unsubscribe('room');
          io.ping();
          resolve();
        } catch (error) { reject(error); }
      }, 0));
      assert.deepEqual(logged, []);
      assert.equal(io.getSecurity().isAuthorized, false);
      await assert.rejects(io.call('reply', 'echo', 'late'), { code: 'CONNECTION_CLOSED' });
      assert.equal(io.promiseMap.size, 0);
    });
  }

  test(`${format}: TCP client and server sockets disable Nagle`, async t => {
    const calls = [];
    const setNoDelay = net.Socket.prototype.setNoDelay;
    t.mock.method(net.Socket.prototype, 'setNoDelay', function (...args) {
      calls.push([this, ...args]);
      return setNoDelay.apply(this, args);
    });
    const { connect, server } = await fixture(t, api, false, true);
    const io = await connect();
    const remoteSocket = server.manager.cid2remote.get(io.cid).socket;
    assert.ok(calls.some(([socket, noDelay]) => socket === io.socket && noDelay === true), 'client socket');
    assert.ok(calls.some(([socket, noDelay]) => socket === remoteSocket && noDelay === true), 'server socket');
  });

  test(`${format}: CongSocket-only server serves TCP and closes with its callback`, { timeout: 10000 }, async t => {
    const server = new api.Server({ congPort: 0 });
    let closed = false;
    t.after(() => { if (!closed) server.congServer?.close(); });
    await event(server, 'ready', t.signal);
    assert.equal(server.wss, null);
    const io = new api.IOCongSocket();
    const ready = event(io, 'ready', t.signal);
    io.open(`cong://127.0.0.1:${server.congPort}`);
    await ready;
    io.stop();
    await new Promise(resolve => server.close(resolve));
    closed = true;
  });

  test(`${format}: CongSocket closes a connection without a CID that announces an oversized frame`, { timeout: 10000 }, async t => {
    const server = new api.Server({ congPort: 0 });
    t.after(() => new Promise(resolve => server.close(resolve)));
    await event(server, 'ready', t.signal);
    const accepted = event(server.congServer, 'connection', t.signal);
    const socket = net.connect(server.congPort, '127.0.0.1');
    socket.on('error', () => {}); // the server may reset while we write
    t.after(() => socket.destroy());
    const [serverSocket] = await accepted;
    const remote = [...server.manager.remotes].find(r => r.socket === serverSocket);
    const removed = event(serverSocket, 'close', t.signal);
    // The length header advertises 4 GiB; nothing of it may be buffered.
    socket.write(Buffer.concat([Buffer.from([4, 0xff, 0xff, 0xff, 0xff]), Buffer.alloc(1024)]));
    await removed;
    assert.equal(remote.congRx.buffer.byteLength, 0);
    assert.equal(server.manager.remotes.has(remote), false);
  });

  test(`${format}: CongSocket CLOSE closes with or without a reason and names reason codes`, { timeout: 10000 }, async t => {
    const server = new api.Server({ congPort: 0 });
    t.after(() => new Promise(resolve => server.close(resolve)));
    await event(server, 'ready', t.signal);
    // As the Arduino library sends it: [CLOSE, reason], each in a CongSocket frame.
    async function closeWith(...frames) {
      const accepted = event(server.congServer, 'connection', t.signal);
      const socket = net.connect(server.congPort, '127.0.0.1');
      socket.on('error', () => {});
      socket.resume(); // read to the server's FIN, so the client side ends too
      t.after(() => socket.destroy());
      const [serverSocket] = await accepted;
      const remote = [...server.manager.remotes].find(r => r.socket === serverSocket);
      const closed = event(serverSocket, 'close', t.signal);
      for (const frame of frames) socket.write(api.pack(Buffer.from(frame)));
      await closed;
      return remote.closeReason;
    }
    const { CLOSE, AUTH_CLEAR, SERVER_REDIRECT } = api.IOMsg;
    assert.equal(await closeWith([CLOSE, AUTH_CLEAR]), 'AUTH_CLEAR(0xc4)');
    assert.equal(await closeWith([CLOSE, SERVER_REDIRECT]), 'SERVER_REDIRECT(0xc5)');
    assert.equal(await closeWith([CLOSE, 253]), 'CONG_UNKNOWN_TYPE(0xfd)');
    assert.equal(await closeWith([CLOSE, 0x10]), '0x10');
    assert.equal(await closeWith([CLOSE, ...Buffer.from('bye')]), 'bye');
    // The reason is optional: a bare CLOSE closes too.
    assert.equal(await closeWith([CLOSE]), 'none');
  });

  test(`${format}: CongSocket skips an oversized frame and keeps the connection`, { timeout: 10000 }, async t => {
    assert.throws(() => new api.Server({ port: 0, maxPayload: 0 }), RangeError);
    const { server, connect } = await fixture(t, api, false, true, {}, { maxPayload: 1024 });
    assert.equal(server.wss.options.maxPayload, 1024);
    assert.equal(api.serverOption.maxPayload, 32 * 1024 * 1024, 'the default is not changed');
    const subscriber = await connect(), publisher = await connect();
    const messages = [];
    subscriber.on('message', (tag, value) => messages.push([tag, value]));
    subscriber.subscribe('room');
    await subscriber.call('reply', 'echo', 'subscribed');
    const overSize = event(publisher, 'over_size', t.signal);
    publisher.signal('room', 'x'.repeat(4096));
    await overSize;
    const received = event(subscriber, 'message', t.signal);
    publisher.signal('room', 'small');
    await received;
    assert.deepEqual(messages, [['room', 'small']]);
  });

  test(`${format}: a port in use is reported as an 'error' event instead of exiting`, { timeout: 10000 }, async t => {
    const first = new api.Server({ port: 0, congPort: 0 });
    t.after(() => new Promise(resolve => first.close(resolve)));
    await event(first, 'ready', t.signal);
    for (const options of [{ port: first.port }, { congPort: first.congPort }]) {
      const second = new api.Server(options);
      const [error] = await event(second, 'error', t.signal);
      assert.equal(error.code, 'EADDRINUSE');
      await new Promise(resolve => second.close(resolve));
    }
  });

  // Raw WebSocket so the test can send proxy headers; resolves to the server-side Remote.
  async function remoteWithHeaders(t, server, url, headers) {
    const accepted = event(server.wss, 'connection', t.signal);
    const ws = new WebSocket(url, { headers });
    ws.on('error', () => {});
    t.after(() => ws.terminate());
    const [socket] = await accepted;
    return [...server.manager.remotes].find(remote => remote.socket === socket);
  }

  test(`${format}: forwarding headers are trusted only from a private proxy, rightmost entry first`, { timeout: 10000 }, async t => {
    assert.throws(() => new api.Server({ port: 0, trustProxy: 'yes' }), RangeError);
    const { server, url } = await fixture(t, api);
    assert.equal(server.trustProxy, 'private');
    // A client-supplied entry left of the proxy's own is ignored.
    const proxied = await remoteWithHeaders(t, server, url,
      { 'x-forwarded-for': '10.9.9.9, 203.0.113.7', 'x-forwarded-proto': 'https' });
    assert.equal(proxied.ip, '203.0.113.7');
    assert.equal(proxied.HOME_CHANNEL, 'IP:cb007107');
    assert.equal(proxied.TLS, true);
    assert.equal(proxied.privateNode, false);
    // Only a loopback/private peer counts as a proxy.
    assert.equal(proxied.trustedProxyHops('127.0.0.1'), 1);
    assert.equal(proxied.trustedProxyHops('203.0.113.7'), 0);
    const invalid = await remoteWithHeaders(t, server, url, { 'x-forwarded-for': 'unknown' });
    assert.equal(invalid.ip, '127.0.0.1');
    assert.equal(invalid.HOME_CHANNEL, 'PRIVATE:');
  });

  test(`${format}: trustProxy false ignores and a hop count selects forwarding headers`, { timeout: 10000 }, async t => {
    const headers = { 'x-forwarded-for': '198.51.100.1, 203.0.113.7, 10.0.0.2', 'x-forwarded-proto': 'https' };
    const direct = await fixture(t, api, false, false, {}, { trustProxy: false });
    const ignored = await remoteWithHeaders(t, direct.server, direct.url, headers);
    assert.deepEqual([ignored.ip, ignored.TLS, ignored.HOME_CHANNEL], ['127.0.0.1', false, 'PRIVATE:']);
    const chain = await fixture(t, api, false, false, {}, { trustProxy: 2 });
    const second = await remoteWithHeaders(t, chain.server, chain.url, headers);
    assert.equal(second.ip, '203.0.113.7');
  });

  test(`${format}: IPv6 clients get a home channel per /64 network`, { timeout: 10000 }, async t => {
    assert.equal(api.isPrivateIP('fd00::1'), true);
    assert.equal(api.isPrivateIP('fe80::1%en0'), true);
    assert.equal(api.isPrivateIP('::ffff:192.168.1.2'), true);
    assert.equal(api.isPrivateIP('2001:db8::1'), false);
    assert.equal(api.getIPv6PrefixHexString('2001:db8:1:2::5'), '20010db800010002');
    const { server, url } = await fixture(t, api);
    const homes = [];
    for (const ip of ['2001:db8:1:2::5', '2001:db8:1:2:aaaa:bbbb:cccc:dddd', '2001:db8:1:3::5']) {
      homes.push((await remoteWithHeaders(t, server, url, { 'x-forwarded-for': ip })).HOME_CHANNEL);
    }
    assert.deepEqual(homes, ['IP6:20010db800010002', 'IP6:20010db800010002', 'IP6:20010db800010003']);
  });

  for (const tcp of [false, true]) {
    test(`${format}: ${tcp ? 'TCP' : 'WS'} closes a peer whose unsent data exceeds maxBufferedBytes`, { timeout: 10000 }, async t => {
      assert.throws(() => new api.Server({ port: 0, maxBufferedBytes: 0 }), RangeError);
      const { server, connect } = await fixture(t, api, false, tcp, {}, { maxBufferedBytes: 4096 });
      const slow = await connect(), publisher = await connect();
      slow.subscribe('room');
      await slow.call('reply', 'echo', 'subscribed');
      const remote = server.manager.cid2remote.get(slow.cid);
      // As if the peer stopped reading: the transport reports a queue over the limit.
      Object.defineProperty(remote.socket, tcp ? 'writableLength' : 'bufferedAmount', { configurable: true, get: () => 4097 });
      const closed = event(remote.socket, 'close', t.signal);
      publisher.signal('room', 'x');
      await closed;
      assert.equal(server.manager.cid2remote.has(slow.cid), false);
      assert.ok(server.manager.cid2remote.has(publisher.cid), 'other peers are unaffected');
    });
  }

  function captureLog(t) {
    const lines = [];
    t.mock.method(console, 'log', (...args) => {
      lines.push(args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' '));
    });
    return lines;
  }

  test(`${format}: logMessages logs decrypted message types and tags, never payloads`, { timeout: 10000 }, async t => {
    const { connect } = await fixture(t, api, true, false, {}, { logMessages: true });
    const lines = captureLog(t);
    const io = await connect(['tester', 'fixture-key']);
    io.subscribe('room');
    io.signal('room', 'secret-payload');
    io.ping();
    await io.call('reply', 'echo', 'done');
    const rx = lines.filter(line => line.startsWith('[rx] '));
    // The authenticated connection is encrypted; the log shows what was inside.
    assert.ok(rx.some(line => /^\[rx\] #\d+ fixture-client WS SIGNAL\(enc\) room \d+B$/.test(line)), rx.join('\n'));
    assert.ok(rx.some(line => / SUBSCRIBE(_REQ)?\(enc\) room /.test(line)), rx.join('\n'));
    assert.ok(rx.some(line => / CALL\(enc\) reply\.echo /.test(line)), rx.join('\n'));
    assert.equal(rx.some(line => / PING| PONG/.test(line)), false, 'heartbeat is not logged');
    assert.equal(lines.some(line => line.includes('secret-payload') || line.includes('done')), false);
  });

  test(`${format}: logMessages/logStats are per server; removed showMessage/showMetric/monitorPeriod name them`, { timeout: 10000 }, async t => {
    assert.throws(() => new api.Server({ port: 0, logStats: 500 }), RangeError);
    assert.throws(() => new api.Server({ port: 0, logMessages: 'yes' }), TypeError);
    for (const [name, value, replacement] of [['showMessage', 'message', /logMessages: true/],
      ['showMetric', 1, /logStats/], ['monitorPeriod', 5000, /logStats/]]) {
      assert.throws(() => new api.Server({ port: 0, [name]: value }),
        error => error instanceof TypeError && error.message.includes(name) && replacement.test(error.message));
    }
    for (const name of ['showMessage', 'showMetric', 'monitorPeriod']) assert.equal(name in api.serverOption, false);
    t.mock.method(console, 'log', () => {});
    const logging = new api.Server({ port: 0, logMessages: true, logStats: 2000 });
    const plain = new api.Server({ port: 0 });
    t.after(() => Promise.all([logging, plain].map(server => new Promise(resolve => server.close(resolve)))));
    await Promise.all([logging, plain].map(server => event(server, 'ready', t.signal)));
    assert.deepEqual([logging.logMessages, logging.logStats], [true, 2000]);
    assert.deepEqual([plain.logMessages, plain.logStats], [false, 0], 'another server is not affected');
  });

  test(`${format}: stats() and logStats report cumulative counters and per-second rates`, { timeout: 10000 }, async t => {
    t.mock.method(console, 'log', () => {});
    const { server, connect } = await fixture(t, api, false, false, {}, { localAuth: 'idKey', logStats: 60000 });
    assert.ok(server.manager.statsIntervalID, 'the summary timer runs');
    const member = await connect(['dev1', 'dev1']), anonymous = await connect();
    anonymous.subscribe('room');
    await anonymous.call('reply', 'echo', 'subscribed');
    const before = server.stats();
    assert.deepEqual(before.connections, { total: 2, authenticated: 1, anonymous: 1, websocket: 2, tcp: 0 });
    const received = event(anonymous, 'message', t.signal);
    member.signal('room', 'x');
    await received;
    const after = server.stats();
    assert.equal(after.counters.publishes - before.counters.publishes, 1);
    assert.equal(after.counters.deliveryAttempts - before.counters.deliveryAttempts, 1);
    assert.ok(after.counters.rxMessages > before.counters.rxMessages && after.counters.txBytes > before.counters.txBytes);
    assert.ok(after.memory.rss > 0 && after.channels >= 1);
    const metrics = server.manager.metrics;
    metrics.summaryLine(0);
    const line = metrics.summaryLine(1000);
    assert.match(line, /^\[iosignal\] conn 2 \(auth 1, anon 1, ws 2, tcp 0\) ch \d+ retained 0\/0B \| rx [\d.]+\/s \S+\/s tx [\d.]+\/s \S+\/s pub [\d.]+\/s \| rss \S+ heap \S+$/);
    // The sudo views still work: state names, and mode 4 no longer throws.
    assert.match(metrics.getRemotes()[0], /^#\d+:\S+\([a-z_]+\)$/);
    assert.deepEqual(metrics.getRemoteByCId(anonymous.cid, 4).channels, ['CH:room']);
    assert.equal(metrics.oneline().remotes, 2);
  });

  test(`${format}: showAuthInfo never logs the key`, { timeout: 10000 }, async t => {
    const showAuthInfo = api.serverOption.debug.showAuthInfo;
    t.after(() => { api.serverOption.debug.showAuthInfo = showAuthInfo; });
    api.serverOption.debug.showAuthInfo = true;
    const { connect } = await fixture(t, api, true);
    const lines = captureLog(t);
    await connect(['tester', 'fixture-key']);
    assert.ok(lines.some(line => line.startsWith('[debug]showAuthInfo') && line.includes('fixture-client')), lines.join('\n'));
    // The stored hash is the authentication key itself, so it must not appear either.
    const storedKey = Buffer.from(api.Boho.sha256.hash('fixture-key')).toString('base64');
    for (const secret of ['fixture-key', storedKey, '"key"']) {
      assert.equal(lines.some(line => line.includes(secret)), false, secret);
    }
  });

  test(`${format}: every server keeps its own settings; serverOption is never modified`, { timeout: 10000 }, async t => {
    const defaults = JSON.stringify(api.serverOption);
    const servers = [
      new api.Server({ port: 0, heartbeatInterval: 2000, heartbeatGrace: 0, maxPayload: 1024,
        retain: { limitSize: 50 }, quotas: { basic: { fanout: 5 } }, security: { maxReplayEntries: 10 } }),
      new api.Server({ port: 0 })
    ];
    t.after(() => Promise.all(servers.map(server => new Promise(resolve => server.close(resolve)))));
    await Promise.all(servers.map(server => event(server, 'ready', t.signal)));
    const [custom, plain] = servers;
    assert.deepEqual([custom.manager.pingPeriod, custom.manager.pingGrace, custom.wss.options.maxPayload], [2000, 0, 1024]);
    assert.deepEqual([plain.manager.pingPeriod, plain.manager.pingGrace, plain.wss.options.maxPayload], [50000, 5000, 32 * 1024 * 1024]);
    assert.deepEqual([custom.retain.limitSize, custom.retain.limitCounter, plain.retain.limitSize], [50, 1000, 100000]);
    assert.deepEqual([custom.quotas.basic.fanout, custom.quotas.basic.maxMessageBytes, plain.quotas.basic.fanout], [5, 1024 * 1024, 1000]);
    assert.equal(custom.manager.retainOptions, custom.retain);
    // A running server's retain/quotas can be adjusted without touching others or the defaults.
    plain.retain.bytesTotal = 1;
    plain.quotas.basic.fanout = 1;
    assert.deepEqual([custom.retain.bytesTotal, custom.quotas.basic.fanout], [256 * 1024 * 1024, 5]);
    assert.equal(Object.isFrozen(custom.security), true);
    assert.equal(JSON.stringify(api.serverOption), defaults);
  });

  test(`${format}: removed, renamed and unknown settings are errors that name the replacement`, t => {
    for (const [options, pattern] of [
      [{ timeout: 2000 }, /^timeout was removed in iosignal 9\.0; use heartbeatInterval$/],
      [{ pingTimeoutGrace: 0 }, /^pingTimeoutGrace .* use heartbeatGrace$/],
      [{ retain: { isAvailable: false } }, /^retain\.isAvailable .* use retain\.enabled$/],
      [{ useQuota: { publishCounter: true } }, /^useQuota was removed in iosignal 9\.0; use quotas: /],
      [{ retain: { limitSise: 1 } }, /^unknown option retain\.limitSise$/],
      [{ retain: 5 }, /^retain must be an object$/],
      [{ quotas: { basic: { fanuot: 1 } } }, /^unknown option quotas\.basic\.fanuot$/],
      [{ quotas: { basic: 5 } }, /^quotas\.basic must be an object$/],
      [{ membersOnly: 1 }, /^membersOnly must be a boolean$/],
    ]) {
      assert.throws(() => new api.Server({ port: 0, ...options }), error => error instanceof TypeError && pattern.test(error.message),
        JSON.stringify(options));
    }
    assert.throws(() => new api.Server({ port: 0, retain: { limitSize: 0 } }), RangeError);
    // Old global keys, e.g. set by older tools, fail too instead of silently doing nothing.
    for (const [path, replacement] of [['timeout', 'heartbeatInterval'], ['port', 'new Server({ port })'],
      ['auth.delay_auth_fail', 'auth.failDelay'], ['retain.isAvailable', 'retain.enabled']]) {
      const [group, key] = path.includes('.') ? path.split('.') : [null, path];
      const target = group ? api.serverOption[group] : api.serverOption;
      target[key] = 1;
      t.after(() => { delete target[key]; });
      assert.throws(() => new api.Server({ port: 0 }), { name: 'TypeError', message: `serverOption.${path} was removed in iosignal 9.0; use ${replacement}` });
      delete target[key];
    }
  });

  test(`${format}: localAuth logins are devices unless a role is given`, { timeout: 10000 }, async t => {
    for (const [localAuth, role] of [['idKey', 'device'], [{ mode: 'idKey', role: 'admin' }, 'admin']]) {
      const { server, connect } = await fixture(t, api, false, false, {}, { localAuth });
      const io = await connect(['dev1', 'dev1']);
      const remote = server.manager.cid2remote.get(io.cid);
      assert.deepEqual([remote.role, remote.isAdmin], [role, role === 'admin']);
    }
    assert.throws(() => new api.LocalKeyProvider({ mode: 'idKey', role: 'anonymous' }), RangeError);
  });

  test(`${format}: membersOnly is per server and can be turned off`, { timeout: 10000 }, async t => {
    const servers = [{ membersOnly: true }, { membersOnly: false }, {}].map(options => new api.Server({ port: 0, ...options }));
    t.after(() => Promise.all(servers.map(server => new Promise(resolve => server.close(resolve)))));
    await Promise.all(servers.map(server => event(server, 'ready', t.signal)));
    assert.deepEqual(servers.map(server => server.membersOnly), [true, false, false]);
    assert.equal(api.serverOption.membersOnly, false, 'the default is not changed');
  });

  // Retain limits are given per Server, or adjusted on the running server's server.retain.
  async function disconnect(t, server, io) {
    const remote = server.manager.cid2remote.get(io.cid);
    const closed = event(remote.socket, 'close', t.signal);
    io.stop();
    await closed;
    return remote;
  }
  const retainedKeys = manager => [...manager.retain_messages.keys()].sort();

  test(`${format}: a closed anonymous writer's channel retains expire after a grace period, an account's stay`, { timeout: 10000 }, async t => {
    const { server, connect } = await fixture(t, api, false, false, {}, { localAuth: 'idKey' });
    const manager = server.manager;
    const a = await connect(), b = await connect(), member = await connect(['dev1', 'dev1']);
    a.signal('room$a', 'from a');
    a.signal('room$shared', 'from a');
    b.signal('room$shared', 'from b'); // the last writer owns the tag
    member.signal('room$member', 'kept');
    for (const io of [a, b, member]) await io.call('reply', 'echo', 'published');
    await disconnect(t, server, a);
    // Within the grace period a later subscriber still gets a's value.
    const late = await connect();
    const received = [];
    late.on('message', (tag, value) => received.push([tag, value]));
    late.subscribe('room$a,room$shared');
    await late.call('reply', 'echo', 'subscribed');
    assert.deepEqual(received, [['room$a', 'from a'], ['room$shared', 'from b']]);
    assert.deepEqual([...manager.retainOwners.get('net:PRIVATE:').tags], ['CH:room$a']);
    const afterGrace = () => performance.now() + server.retain.anonymousGraceMs + 1;
    // The heartbeat tick sweeps expired values.
    manager.retainExpiry.set('CH:room$a', performance.now() - 1);
    manager.heartbeatTick();
    assert.deepEqual(retainedKeys(manager), ['CH:room$member', 'CH:room$shared']);
    await disconnect(t, server, b);
    await disconnect(t, server, member);
    manager.expireChannelRetains(afterGrace());
    assert.deepEqual(retainedKeys(manager), ['CH:room$member']);
    assert.deepEqual([...manager.retainOwners.keys()], ['cid:dev1'], 'no closed connection stays referenced');
    // anonymousGraceMs 0 removes them as the connection closes.
    server.retain.anonymousGraceMs = 0;
    const c = await connect();
    c.signal('room$c', 'gone');
    await c.call('reply', 'echo', 'published');
    await disconnect(t, server, c);
    assert.deepEqual(retainedKeys(manager), ['CH:room$member']);
  });

  test(`${format}: retained messages are exact-size copies within byte budgets, never stale`, { timeout: 10000 }, async t => {
    const { server, connect } = await fixture(t, api);
    const manager = server.manager;
    const barrier = io => io.call('reply', 'echo', 'barrier');
    const a = await connect(), b = await connect();
    const remoteA = manager.cid2remote.get(a.cid);
    const ownerA = () => manager.retainOwners.get('conn:' + remoteA.ssid);
    a.signal('m$s', 'x');
    a.signal('@$m', 'y');
    await barrier(a);
    // Own memory: not a slice of a socket chunk or of the shared 8 KiB pool.
    const channel = manager.retain_messages.get('CH:m$s'), cid = remoteA.retain_signal.get('$m');
    for (const message of [channel, cid]) assert.equal(message.buffer.byteLength, message.byteLength);
    assert.equal(remoteA.retainBytes, cid.byteLength);
    assert.equal(ownerA().bytes, channel.byteLength);
    assert.equal(manager.retainBytes, channel.byteLength + cid.byteLength);

    // Per owner: room for exactly one more message of this size.
    const payload = 'x'.repeat(100);
    a.signal('b1$s', payload);
    await barrier(a);
    const size = manager.retain_messages.get('CH:b1$s').byteLength;
    server.retain.bytesPerOwner = ownerA().bytes + size;
    a.signal('b2$s', payload);
    a.signal('b3$s', payload); // over the owner budget
    a.signal('b1$s', payload + payload); // a larger update over budget drops the old value
    await barrier(a);
    assert.deepEqual(retainedKeys(manager), ['CH:b2$s', 'CH:m$s']);
    b.signal('b4$s', payload); // another connection has its own budget
    await barrier(b);
    assert.ok(retainedKeys(manager).includes('CH:b4$s'));

    // CID retains have a per-connection budget of their own.
    server.retain.bytesPerConnection = remoteA.retainBytes;
    a.signal('@$m2', 'over');
    a.signal('@$m', 'yy'); // a larger update over budget drops the old value
    await barrier(a);
    assert.deepEqual([...remoteA.retain_signal.keys()], []);

    // Server-wide: full, so a new tag is refused while a same-size update fits.
    server.retain.bytesTotal = manager.retainBytes;
    b.signal('b5$s', payload);
    b.signal('b4$s', payload.replace('x', 'y'));
    await barrier(b);
    assert.equal(retainedKeys(manager).includes('CH:b5$s'), false);
    const late = await connect();
    const updated = event(late, 'message', t.signal);
    late.subscribe('b4$s');
    assert.deepEqual(await updated, ['b4$s', payload.replace('x', 'y')]);

    // A message over limitSize also drops the value it would replace.
    server.retain.limitSize = 50;
    a.signal('m$s', payload);
    await barrier(a);
    assert.equal(retainedKeys(manager).includes('CH:m$s'), false);

    for (const io of [a, b]) await disconnect(t, server, io);
    manager.expireChannelRetains(performance.now() + server.retain.anonymousGraceMs + 1);
    assert.equal(manager.retain_messages.size, 0);
    assert.equal(manager.retainBytes, 0, 'all bytes are released');
  });

  test(`${format}: no owner takes the whole channel retain store, even by reconnecting`, { timeout: 10000 }, async t => {
    const { server, connect } = await fixture(t, api, false, false, {}, { localAuth: 'idKey', retain: { tagsPerOwner: 2 } });
    const manager = server.manager;
    const a = await connect(), b = await connect();
    for (const [tag, value] of [['t1$s', 'a'], ['t2$s', 'a'], ['t3$s', 'over'], ['t1$s', 'updated']]) a.signal(tag, value);
    b.signal('t4$s', 'b');
    await a.call('reply', 'echo', 'published');
    await b.call('reply', 'echo', 'published');
    assert.deepEqual(retainedKeys(manager), ['CH:t1$s', 'CH:t2$s', 'CH:t4$s']);
    const late = await connect();
    const received = event(late, 'message', t.signal);
    late.subscribe('t1$s');
    assert.deepEqual(await received, ['t1$s', 'updated']);

    // Closed anonymous connections share their network's grace pool and its budget: when b's
    // value joins, the value closest to expiry goes, a's (closed first) least recently written.
    await disconnect(t, server, a);
    await disconnect(t, server, b);
    assert.deepEqual(retainedKeys(manager), ['CH:t1$s', 'CH:t4$s']);

    // An account keeps one budget across its connections.
    let member = await connect(['dev1', 'dev1']);
    member.signal('m1$s', '1');
    member.signal('m2$s', '2');
    await member.call('reply', 'echo', 'published');
    await disconnect(t, server, member);
    member = await connect(['dev1', 'dev1']);
    member.signal('m3$s', 'over');
    member.signal('m1$s', 'updated');
    await member.call('reply', 'echo', 'published');
    assert.deepEqual(retainedKeys(manager), ['CH:m1$s', 'CH:m2$s', 'CH:t1$s', 'CH:t4$s']);
    assert.equal(manager.retainOwners.get('cid:dev1').tags.size, 2);
  });

  test(`${format}: a full retain store still replaces stored tags and counts CID tags per publisher`, { timeout: 10000 }, async t => {
    const { connect } = await fixture(t, api, false, false, {}, { retain: { limitCounter: 2 } });
    const publisher = await connect(), other = await connect();
    for (const [tag, value] of [['r1$s', 'old'], ['r2$s', 'kept'], ['r1$s', 'new'], ['r3$s', 'over'],
      ['@$c1', 'old'], ['@$c2', 'kept'], ['@$c1', 'new'], ['@$c3', 'over']]) publisher.signal(tag, value);
    other.signal('@$c1', 'other'); // another publisher's CID store is not full
    await publisher.call('reply', 'echo', 'published'); // ordered after the signals
    await other.call('reply', 'echo', 'published');
    const subscriber = await connect();
    const received = [];
    subscriber.on('message', (tag, value) => received.push([tag, value]));
    const p = publisher.cid;
    subscriber.subscribe(`r1$s,r2$s,r3$s,${p}@$c1,${p}@$c2,${p}@$c3,${other.cid}@$c1`);
    await subscriber.call('reply', 'echo', 'subscribed'); // retained replies precede it
    assert.deepEqual(received, [['r1$s', 'new'], ['r2$s', 'kept'],
      [`${p}@$c1`, 'new'], [`${p}@$c2`, 'kept'], [`${other.cid}@$c1`, 'other']]);
  });
}

for (const [format, api] of variants) {
  test(`${format}: attached services receive onRemoteClose once per closed remote`, { timeout: 10000 }, async t => {
    const { server, connect } = await fixture(t, api);
    const closedRemotes = [];
    const service = { commands: [], checkPermission: () => false, onRemoteClose: remote => closedRemotes.push(remote) };
    server.attach('lifecycle', service).attach('lifecycle-alias', service);
    const io = await connect();
    const remote = server.manager.cid2remote.get(io.cid);
    const closed = event(remote.socket, 'close', t.signal);
    io.stop();
    await closed;
    assert.deepEqual(closedRemotes, [remote]);
  });
}

for (const [format, api] of variants) {
  for (const [policy, tcp] of [['keepNew', false], ['keepOld', false], ['keepNew', true], ['keepOld', true]]) {
    test(`${format}: onAuthEvent reports ${policy} duplicate logins over ${tcp ? 'TCP' : 'WS'} and cannot break auth`, { timeout: 10000 }, async t => {
      const { server, auth, connect, client, url } = await fixture(t, api, true, tcp, {}, { duplicateLogin: policy });
      const events = [];
      let reported;
      const seen = new Promise(resolve => { reported = resolve; });
      auth.onAuthEvent = event => { events.push(event); reported(); throw new Error('hook failure is ignored'); };
      const old = await connect(['tester', 'fixture-key']);
      old.autoReconnect = false;
      const oldRemote = server.manager.cid2remote.get(old.cid);
      if (policy === 'keepNew') {
        const closed = event(oldRemote.socket, 'close', t.signal);
        await connect(['tester', 'fixture-key']);
        await closed;
      } else {
        const duplicate = client(['tester', 'fixture-key']);
        duplicate.autoReconnect = false;
        // WebSocket gets AUTH_FAIL; CongSocket is closed without a message.
        const rejected = tcp ? Promise.resolve() : event(duplicate, 'auth_fail', t.signal);
        duplicate.open(url);
        await rejected;
      }
      await seen;
      assert.equal(events.length, 1);
      const [e] = events;
      assert.deepEqual([e.type, e.did, e.cid, e.uid, e.reason, e.ip, e.oldIp],
        [policy === 'keepNew' ? 'replaced' : 'duplicate_rejected', 'tester', 'fixture-client', null,
          'duplicate login', '127.0.0.1', '127.0.0.1']);
      assert.ok(Number.isFinite(e.at));
      const transport = tcp ? 'congsocket' : 'websocket';
      assert.deepEqual([e.socketType, e.oldSocketType], [transport, transport]);
    });
  }
}

for (const [format, api] of variants) {
  test(`${format}: anonymous CIDs never reuse an online CID`, { timeout: 10000 }, async t => {
    const { server, connect } = await fixture(t, api);
    const manager = server.manager;
    const taken = {};
    manager.cid2remote.set('?0000', taken);
    // Lowercase Crockford base32 from the low 5 bits: 0x00 -> '0', 0xff -> 'z', 0x31 -> 'h'.
    const draws = [0x00, 0x00, 0xff];
    manager.anonymousCidRandom = size => Buffer.alloc(size, draws.length ? draws.shift() : 0x11);
    const io = await connect();
    assert.equal(io.cid, '?zzzz');
    assert.equal(manager.cid2remote.get('?0000'), taken);
    assert.equal(manager.cid2remote.get('?zzzz'), manager.cid2remote.get(io.cid));

    // The short space keeps colliding: fall back to 8 characters, then give up.
    manager.anonymousCidRandom = size => Buffer.alloc(size, 0x31);
    manager.cid2remote.set('?hhhh', taken);
    assert.equal(manager.issueAnonymousCid(), '?hhhhhhhh');
    manager.cid2remote.set('?hhhhhhhh', taken);
    assert.equal(manager.issueAnonymousCid(), null);
    for (const cid of ['?0000', '?hhhh', '?hhhhhhhh']) manager.cid2remote.delete(cid);

    // Every character comes from the alphabet, so no i, l, o, u, upper case, '-' or '_'.
    manager.anonymousCidRandom = size => globalThis.crypto.getRandomValues(Buffer.alloc(size));
    for (let i = 0; i < 200; i++) assert.match(manager.issueAnonymousCid(), /^\?[0-9abcdefghjkmnpqrstvwxyz]{4}$/);
  });
}

for (const [format, api] of variants) {
  for (const tcp of [false, true]) {
    test(`${format}: ${tcp ? 'TCP' : 'WS'} localAuth idKey logs in when the key equals the ID`, { timeout: 10000 }, async t => {
      const { server, connect } = await fixture(t, api, false, tcp, {}, { localAuth: 'idKey' });
      const io = await connect(['dev1', 'dev1']);
      assert.equal(io.cid, 'dev1');
      assert.equal(io.boho.isAuthorized, true);
      const remote = server.manager.cid2remote.get('dev1');
      assert.deepEqual([remote.did, remote.role, remote.quotaName], ['dev1', 'device', 'basic']);
      // Anonymous clients are still served unless membersOnly is set.
      assert.match((await connect()).cid, /^\?/);
    });

    test(`${format}: ${tcp ? 'TCP' : 'WS'} localAuth sharedKey logs in any ID with the shared key`, { timeout: 10000 }, async t => {
      // 44 characters: the length of a stored base64 hash, which must still be read as a plain key.
      const key = 'k'.repeat(44);
      const { server, connect } = await fixture(t, api, false, tcp, {}, { localAuth: { mode: 'sharedKey', key, quota: 'pro' } });
      const [a, b] = [await connect(['devA', key]), await connect(['devB', key])];
      assert.deepEqual([a.cid, b.cid], ['devA', 'devB']);
      assert.equal(a.boho.isAuthorized && b.boho.isAuthorized, true);
      assert.equal(server.manager.cid2remote.get('devA').quotaName, 'pro');
      // Authenticated CIDs work as unicast addresses.
      const got = event(b, '@', t.signal);
      a.signal('devB@hello', 'hi');
      assert.deepEqual(await got, ['@hello', 'hi']);
    });
  }

  for (const [localAuth, credentials] of [['idKey', ['dev1', 'not-dev1']], [{ mode: 'sharedKey', key: 'lab' }, ['dev1', 'dev1']]]) {
    test(`${format}: localAuth ${localAuth.mode ?? localAuth} rejects a wrong key`, { timeout: 10000 }, async t => {
      const { client, url } = await fixture(t, api, false, false, {}, { localAuth });
      const io = client(credentials);
      let ready = false;
      io.on('ready', () => { ready = true; });
      const rejected = event(io, 'auth_fail', t.signal);
      io.open(url);
      await rejected;
      assert.equal(ready, false);
    });
  }

  test(`${format}: localAuth options are validated`, () => {
    const auth = new api.BohoAuth(new api.LocalKeyProvider('idKey'));
    assert.throws(() => new api.Server({ port: 0, localAuth: 'idKey' }, auth), { name: 'TypeError', message: /authManager/ });
    for (const localAuth of ['shared', { mode: 'sharedKey' }, { mode: 'sharedKey', key: '' }]) {
      assert.throws(() => new api.Server({ port: 0, localAuth }), TypeError);
    }
    assert.throws(() => new api.LocalKeyProvider({ mode: 'idKey', role: 'root' }), RangeError);
    assert.throws(() => new api.LocalKeyProvider({ mode: 'idKey', quota: 3 }), TypeError);
  });
}

// The AUTH_FAIL delay (600 ms by default) for one test: tests that expect a failed login need not wait.
function quickAuthFail(t, api) {
  const failDelay = api.serverOption.auth.failDelay;
  api.serverOption.auth.failDelay = 10;
  t.after(() => { api.serverOption.auth.failDelay = failDelay; });
}

for (const [format, api] of variants) {
  const quotaKey = createHash('sha256').update('quota-key').digest('base64');
  // Logins 'q1'... with the given account fields; every account belongs to uid 'u1'.
  const quotaAuth = (fields = {}, options) => new api.BohoAuth({
    async getAuth(id) { return /^q\d$/.test(id) ? { key: quotaKey, cid: id + '-client', uid: 'u1', ...fields } : undefined }
  }, options);

  for (const tcp of [false, true]) {
    test(`${format}: ${tcp ? 'TCP' : 'WS'} anonymous connections use anonymousQuota and are told maxMessageBytes`, { timeout: 10000 }, async t => {
      const { server, connect } = await fixture(t, api, false, tcp, {}, { anonymousQuota: 'tiny', quotas: { tiny: { maxMessageBytes: 2000 } } });
      const subscriber = await connect(), publisher = await connect();
      const remote = server.manager.cid2remote.get(publisher.cid);
      assert.deepEqual([remote.role, remote.quotaName, remote.quota], ['anonymous', 'tiny', server.quotas.tiny]);
      assert.deepEqual(server.quotas.tiny, { maxMessageBytes: 2000, fanout: null, msgPerSec: null, bytesPerSec: null, maxConnections: null });
      // QUOTA is sent before CID_RES, so the client knows its limit once ready.
      assert.deepEqual(publisher.quota, { maxMessageBytes: 2000 });
      if (tcp) assert.equal(remote.congRx.maxFrameSize, 2000);

      subscriber.subscribe('room,barrier');
      await subscriber.call('reply', 'echo', 'subscribed');
      // The client refuses to send over its limit...
      const refused = event(publisher, 'over_size', t.signal);
      publisher.signal('room', 'x'.repeat(3000));
      await refused;
      // ...and the server rejects it when a client sends it anyway.
      publisher.quota = { maxMessageBytes: null };
      const before = server.stats().counters.oversizeRejected;
      const rejected = event(publisher, 'over_size', t.signal);
      const received = event(subscriber, 'message', t.signal);
      publisher.signal('room', 'x'.repeat(3000));
      await rejected;
      publisher.signal('barrier', 'small');
      assert.deepEqual(await received, ['barrier', 'small']);
      assert.equal(server.stats().counters.oversizeRejected - before, 1);
    });
  }

  for (const [label, fields, options, expected] of [
    ['a device defaults to basic', {}, undefined, ['device', 'basic', 1024 * 1024]],
    ['an admin defaults to unlimited', { role: 'admin' }, undefined, ['admin', 'unlimited', null]],
    ["the account's quota", { quota: 'pro' }, undefined, ['device', 'pro', 4 * 1024 * 1024]],
    ['an async resolveQuota', {}, { resolveQuota: async (authInfo, role) => role === 'device' ? 'pro' : 'basic' }, ['device', 'pro', 4 * 1024 * 1024]],
  ]) {
    test(`${format}: login quota: ${label}`, { timeout: 10000 }, async t => {
      const { server, connect } = await fixture(t, api, false, false, {}, { authManager: quotaAuth(fields, options) });
      const io = await connect(['q1', 'quota-key']);
      const remote = server.manager.cid2remote.get('q1-client');
      const [role, quotaName, maxMessageBytes] = expected;
      assert.deepEqual([remote.role, remote.quotaName, remote.quota], [role, quotaName, server.quotas[quotaName]]);
      assert.deepEqual(io.quota, { maxMessageBytes });
    });
  }

  test(`${format}: a login with an unknown quota fails without replacing the online login`, { timeout: 10000 }, async t => {
    quickAuthFail(t, api);
    let quota = 'basic';
    const authManager = new api.BohoAuth({ async getAuth(id) { return id === 'q1' ? { key: quotaKey, cid: 'q1-client', quota } : undefined } });
    const { server, connect, client, url } = await fixture(t, api, false, false, {}, { authManager });
    const online = await connect(['q1', 'quota-key']);
    const onlineRemote = server.manager.cid2remote.get('q1-client');
    quota = 'gold';
    const bad = client(['q1', 'quota-key']);
    bad.autoReconnect = false;
    const failed = event(bad, 'auth_fail', t.signal);
    bad.open(url);
    await failed;
    assert.equal(server.manager.cid2remote.get('q1-client'), onlineRemote);
    assert.deepEqual((await online.call('reply', 'echo', 'still')).body, ['still']);
  });

  test(`${format}: fanout limits the subscribers a publish reaches`, { timeout: 10000 }, async t => {
    const { server, connect } = await fixture(t, api, false, false, {}, { quotas: { anonymous: { fanout: 2 } } });
    const subscribers = [await connect(), await connect(), await connect()];
    for (const io of subscribers) {
      io.subscribe('room');
      await io.call('reply', 'echo', 'subscribed');
    }
    const publisher = await connect();
    const before = server.stats().counters;
    assert.deepEqual(publisher.signal('room', 'hi') ?? null, null);
    await publisher.call('reply', 'echo', 'published');
    const after = server.stats().counters;
    assert.deepEqual([after.deliveryAttempts - before.deliveryAttempts, after.quotaExcluded - before.quotaExcluded], [2, 1]);
    server.quotas.anonymous.fanout = null; // adjustable on a running server
    const received = Promise.all(subscribers.map(io => event(io, 'message', t.signal)));
    publisher.signal('room', 'all');
    assert.equal((await received).length, 3);
  });

  test(`${format}: msgPerSec drops messages over the rate`, { timeout: 10000 }, async t => {
    const { server, connect } = await fixture(t, api, false, false, {}, { quotas: { anonymous: { msgPerSec: 5 } } });
    const subscriber = await connect();
    subscriber.subscribe('room');
    await subscriber.call('reply', 'echo', 'subscribed');
    const publisher = await connect();
    let received = 0;
    subscriber.on('message', () => received++);
    const before = server.stats().counters.rateLimited;
    for (let i = 0; i < 30; i++) publisher.signal('room', i);
    // 5/s refills one token per 200 ms; then a message that must pass.
    await new Promise(resolve => setTimeout(resolve, 300));
    const last = event(subscriber, 'message', t.signal);
    publisher.signal('room', 'last');
    await last;
    const limited = server.stats().counters.rateLimited - before;
    assert.ok(limited >= 15 && received - 1 + limited === 30, `received ${received}, limited ${limited}`);
  });

  test(`${format}: maxConnections limits an account's connections and frees them on close`, { timeout: 10000 }, async t => {
    quickAuthFail(t, api);
    const { server, connect, client, url } = await fixture(t, api, false, false, {},
      { authManager: quotaAuth(), quotas: { basic: { maxConnections: 2 } } });
    const first = await connect(['q1', 'quota-key']);
    await connect(['q2', 'quota-key']);
    assert.equal(server.manager.accountConnections('u1'), 2);
    const third = client(['q3', 'quota-key']);
    third.autoReconnect = false;
    const refused = event(third, 'auth_fail', t.signal);
    third.open(url);
    await refused;
    // A duplicate login that replaces (keepNew) an account connection takes its place.
    const firstRemote = server.manager.cid2remote.get('q1-client');
    const replaced = event(firstRemote.socket, 'close', t.signal);
    first.autoReconnect = false;
    await connect(['q1', 'quota-key']);
    await replaced;
    assert.equal(server.manager.accountConnections('u1'), 2);
  });

  test(`${format}: quota options are validated`, () => {
    for (const quotas of [{ basic: { fanout: 0 } }, { basic: { maxMessageBytes: 1.5 } }, { basic: { msgPerSec: '5' } }]) {
      assert.throws(() => new api.Server({ port: 0, quotas }), RangeError, JSON.stringify(quotas));
    }
    assert.throws(() => new api.Server({ port: 0, anonymousQuota: 'gold' }), /anonymousQuota must be one of the quotas/);
    assert.throws(() => new api.Server({ port: 0, quotas: 5 }), /quotas must be an object/);
    assert.deepEqual(Object.keys(api.serverOption.quotas), ['anonymous', 'basic', 'pro', 'unlimited']);
  });
}

for (const [format, api] of variants) {
  for (const tcp of [false, true]) {
    test(`${format}: ${tcp ? 'TCP' : 'WS'} messages over the RX size advertised in CID_REQ are not sent`, { timeout: 10000 }, async t => {
      const { server, client, connect, url } = await fixture(t, api, false, tcp);
      // An Arduino sends CID_REQ followed by its RX buffer size (uint32 little endian).
      const small = client();
      const send = small.send.bind(small);
      small.send = data => send(data.length === 1 && data[0] === api.IOMsg.CID_REQ
        ? Buffer.from([api.IOMsg.CID_REQ, 160, 0, 0, 0]) : data);
      const ready = event(small, 'ready', t.signal);
      small.open(url);
      await ready;
      const publisher = await connect();
      const smallRemote = server.manager.cid2remote.get(small.cid);
      assert.deepEqual([smallRemote.peerRxLimit, server.manager.cid2remote.get(publisher.cid).peerRxLimit], [160, null]);

      small.subscribe('room,barrier');
      await small.call('reply', 'echo', 'subscribed');
      const before = server.stats().counters.peerRxLimitSkipped;
      const received = event(small, 'message', t.signal);
      publisher.signal('room', 'x'.repeat(400));
      publisher.signal('barrier', 'fits');
      assert.deepEqual(await received, ['barrier', 'fits']);
      assert.equal(server.stats().counters.peerRxLimitSkipped - before, 1);
      assert.equal(smallRemote.peerRxLimitSkipped, 1);
    });
  }
}

const hasIPv6Loopback = Object.values(networkInterfaces()).flat().some(entry => entry?.address === '::1');

for (const [format, api] of variants) {
  test(`${format}: TCP client connects to an IPv6 literal URL`, { timeout: 10000, skip: !hasIPv6Loopback && 'no IPv6 loopback' }, async t => {
    const { server, client } = await fixture(t, api, false, true);
    const io = client();
    const ready = event(io, 'ready', t.signal);
    io.open(`cong://[::1]:${server.congPort}`);
    await ready;
    assert.equal(io.socket.remoteAddress, '::1');
    assert.ok(server.manager.cid2remote.get(io.cid));
  });
}

for (const [format, api] of variants) {
  const key = createHash('sha256').update('role-key').digest('base64');
  const providerWith = info => ({ async getAuth(id) { return id === 'rl' ? { key, cid: 'rl-client', ...info } : undefined } });

  for (const [label, info, role] of [
    ['admin', { role: 'admin' }, 'admin'],
    ['service', { role: 'service' }, 'service'],
    ['device', { role: 'device' }, 'device'],
    ['no role is a device', {}, 'device'],
    ['an unlimited quota does not make an admin', { quota: 'unlimited' }, 'device'],
  ]) {
    test(`${format}: login role: ${label}`, { timeout: 10000 }, async t => {
      const { server, connect } = await fixture(t, api, false, false, {}, { authManager: new api.BohoAuth(providerWith(info)) });
      server.attach('sudo', api.sudoService);
      const io = await connect(['rl', 'role-key']);
      const remote = server.manager.cid2remote.get('rl-client');
      assert.deepEqual([remote.role, remote.isAdmin], [role, role === 'admin']);
      // sudo needs role 'admin'; the quota does not matter.
      assert.equal((await io.call('sudo', 'cid').then(() => true, () => false)), role === 'admin');
    });
  }

  test(`${format}: an unknown role fails the login; anonymous connections have no role rights`, { timeout: 10000 }, async t => {
    quickAuthFail(t, api);
    const { server, connect, client, url } = await fixture(t, api, false, false, {}, { authManager: new api.BohoAuth(providerWith({ role: 'root' })) });
    const bad = client(['rl', 'role-key']);
    bad.autoReconnect = false;
    const failed = event(bad, 'auth_fail', t.signal);
    bad.open(url);
    await failed;
    server.attach('sudo', api.sudoService);
    const anon = await connect();
    const remote = server.manager.cid2remote.get(anon.cid);
    assert.equal(remote.role, 'anonymous');
    remote.role = 'admin'; // without authentication this grants nothing
    assert.equal(remote.isAdmin, false);
    assert.equal(await anon.call('sudo', 'cid').then(() => true, () => false), false);
  });

  test(`${format}: StringKeyProvider role and quota fields; adminLevel and RedisService minLevel are gone`, async () => {
    const provider = new api.StringKeyProvider('a.k.ca.device.pro,b.k.cb.admin,c.k.cc');
    const entries = await Promise.all(['a', 'b', 'c'].map(id => provider.getAuth(id)));
    assert.deepEqual(entries.map(({ role, quota }) => [role, quota]), [['device', 'pro'], ['admin', undefined], [undefined, undefined]]);
    for (const authInfo of ['d.k.cd.root', 'd.k.cd.3', 'd.k', 'd.k.cd.device.pro.x']) {
      assert.throws(() => new api.StringKeyProvider(authInfo), TypeError, authInfo);
    }
    api.serverOption.adminLevel = 255;
    try {
      assert.throws(() => new api.Server({ port: 0 }), /serverOption.adminLevel was removed in iosignal 9.0; use role: 'admin' in the account/);
    } finally {
      delete api.serverOption.adminLevel;
    }
    for (const minRole of [200, -1, 'root']) assert.throws(() => new api.RedisService({}, minRole), RangeError);
    assert.equal(new api.RedisService({}).minRole, 'service');
  });
}
