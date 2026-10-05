import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

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

async function fixture(t, api, authenticated = false, tcp = false, security = {}) {
  const http = createServer();
  const previousMembersOnly = api.serverOption.membersOnly;
  api.serverOption.membersOnly = authenticated;
  const auth = authenticated
    ? new api.BohoAuth(new api.StringKeyProvider('tester.fixture-key.fixture-client.3'))
    : undefined;
  const server = new api.Server({ httpServer: http, security, ...(tcp ? { congPort: 0 } : {}) }, auth);
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
      [`${receiver.cid}@value`, '@value', ['@']],
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

  test(`${format}: keeping the old login revokes authorization on the rejected peer`, { timeout: 10000 }, async t => {
    const { server, connect, client, url } = await fixture(t, api, true);
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
    const { server, connect, client, url } = await fixture(t, api, true, true);
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
