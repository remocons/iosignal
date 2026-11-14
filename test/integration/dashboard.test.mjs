import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

// Private source entry in development; package self-reference for public builds.
const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url)));
const variants = [[pkg.private ? 'source' : 'esm', await import(pkg.private ? '../../index.js' : 'iosignal')]];
if (!pkg.private) variants.push(['cjs', createRequire(import.meta.url)('iosignal')]);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(fn, ms = 4000) {
  const end = Date.now() + ms;
  while (Date.now() < end) { const v = fn(); if (v) return v; await wait(20); }
  throw new Error('timeout');
}
const DASH_IN = 'iosignal.dashboard#in', DASH_TOPIC = '@iosignal.dashboard';

async function start(t, api, options) {
  const server = new api.Server({ port: 0, ...options });
  const clients = [];
  t.after(async () => {
    for (const c of clients) { c.autoReconnect = false; c.stop?.(); c.socket?.terminate?.(); }
    await new Promise((r) => server.close(r));
  });
  await new Promise((r) => server.on('ready', r));
  const connect = async (credentials) => {
    const io = new api.IO();
    clients.push(io);
    if (credentials) io.auth(...credentials);
    io.open(`ws://127.0.0.1:${server.port}`);
    await until(() => io.stateName === 'ready');
    return io;
  };
  // A dashboard viewer: says hello and collects what the dashboard host sends it.
  const viewer = async (hello = {}, credentials) => {
    const io = await connect(credentials);
    const got = [];
    io.on(DASH_TOPIC, (_tag, m) => got.push(m));
    io.signal(DASH_IN, { op: 'hello', ...hello });
    return { io, got };
  };
  return { server, connect, viewer, base: `http://127.0.0.1:${server.port}` };
}

for (const [format, api] of variants) {
  test(`${format}: host counters, report(), loop(), activity and journal`, { timeout: 10000 }, async (t) => {
    const { server, connect } = await start(t, api, {});
    const host = server.host('g', { inbound: ['g#in'], own: ['g#state'] });
    const got = [];
    host.on('message', (from, tag, v) => { got.push(v); if (v === 'boom') throw new Error('bad input'); });
    host.on('error', () => {});
    const a = await connect();
    a.signal('g#in', 'one');
    a.signal('g#in', 'boom');
    a.signal('g#state', 'forged');
    await until(() => got.length === 2 && host.counters.denied === 1);
    assert.equal(host.counters.inbound, 2);
    assert.equal(host.counters.joins, 1);
    assert.equal(host.counters.errors, 1);
    assert.deepEqual(host.journal().map((e) => e.kind), ['join', 'error', 'denied']);
    assert.equal(host.journal(2).length, 1);
    assert.equal(host.activity()[0].inputs, 2);
    assert.ok(host.counters.handlerMs >= 0);

    assert.equal(host.publish('g#state', 1), 0);
    assert.equal(host.counters.published, 1);
    assert.equal(host.to(a.cid, 'g.fx', 'x'), true);
    assert.equal(host.counters.sent, 1);

    host.report({ round: 2, phase: 'play', ok: true });
    host.report({ phase: null, round: 3 });
    assert.deepEqual(host.reported, { round: 3, ok: true });
    assert.throws(() => host.report({ bad: {} }), TypeError);

    let ticks = 0;
    const stop = host.loop(10, () => { ticks++; if (ticks === 3) throw new Error('tick failed'); });
    await until(() => ticks >= 8);
    const [stats] = host.loopStats();
    assert.equal(stats.intervalMs, 10);
    assert.ok(stats.ticks >= 8 && stats.gapP50 > 0 && stats.stepMax >= 0);
    assert.equal(host.counters.errors, 2, 'a throwing tick is reported, the loop goes on');
    stop();
    assert.equal(host.loopStats().length, 0);
    assert.throws(() => host.loop(0, () => {}), RangeError);
    host.loop(10, () => {});
    host.close();
    assert.equal(host.loopStats().length, 0, 'close() stops loops');
  });

  test(`${format}: dashboard page, its client bundle and other paths (port mode)`, { timeout: 10000 }, async (t) => {
    const { base } = await start(t, api, { dashboard: true });
    const page = await fetch(`${base}/dashboard`);
    assert.equal(page.status, 200);
    assert.match(page.headers.get('content-type'), /text\/html/);
    assert.match(page.headers.get('content-security-policy'), /default-src 'self'/);
    const html = await page.text();
    assert.match(html, /IOSignal Dashboard/);
    assert.match(html, /"access":"open"/);
    assert.match(html, /<script src="\/dashboard\/io\.js">/);
    const js = await fetch(`${base}/dashboard/io.js`);
    assert.equal(js.status, 200);
    assert.ok((await js.text()).length > 1000);
    assert.equal((await fetch(`${base}/dashboard/`)).status, 200);
    assert.equal((await fetch(`${base}/other`)).status, 404);
    assert.equal((await fetch(`${base}/dashboard`, { method: 'POST' })).status, 405);
  });

  test(`${format}: open dashboard sends init and live samples; CIDs are hidden by default`, { timeout: 10000 }, async (t) => {
    const { server, connect, viewer } = await start(t, api, { dashboard: { panels: ['hosts', 'events'], history: 30 } });
    const host = server.host('game', { inbound: ['game#in'], own: ['game#state'] });
    host.report({ round: 1 });
    const p = await connect();
    p.signal('game#in', 'hello');
    p.signal('game#state', 'forged');
    const { got } = await viewer();
    await until(() => got.some((m) => m.type === 'tick' && m.hosts.length === 1 && m.hosts[0].players.length === 1), 5000);
    const init = got.find((m) => m.type === 'init');
    assert.deepEqual(init.panels, ['hosts', 'events']);
    assert.equal(init.history, 30);
    assert.equal(init.showIdentities, false);
    const tick = got.filter((m) => m.type === 'tick').at(-1);
    assert.equal(tick.hosts.length, 1, 'the dashboard host itself is not listed');
    const h = tick.hosts[0];
    assert.equal(h.name, 'game');
    assert.deepEqual(h.report, { round: 1 });
    assert.notEqual(h.players[0].cid, p.cid);
    assert.match(h.players[0].cid, /•/);
    assert.ok(typeof tick.point.cpu === 'number' && tick.point.conns >= 2);
    const allEvents = [...init.events, ...got.filter((m) => m.type === 'tick').flatMap((m) => m.events)];
    assert.ok(allEvents.some((e) => e.kind === 'denied' && e.tag === 'game#state'));
    assert.ok(allEvents.some((e) => e.kind === 'join'));
    assert.ok(server.dashboard.series.length >= 1);
  });

  test(`${format}: token access`, { timeout: 10000 }, async (t) => {
    const { viewer } = await start(t, api, { dashboard: { access: { token: 'let-me-see-1' } } });
    const none = await viewer();
    const wrong = await viewer({ token: 'nope-nope-nope' });
    const right = await viewer({ token: 'let-me-see-1' });
    await until(() => right.got.some((m) => m.type === 'init'));
    await until(() => none.got.length && wrong.got.length);
    assert.equal(none.got[0].type, 'denied');
    assert.equal(wrong.got[0].type, 'denied');
    assert.equal(wrong.got.some((m) => m.type === 'init' || m.type === 'tick'), false);
    assert.throws(() => new api.Server({ port: 0, dashboard: { access: { token: 'short' } } }), RangeError);
  });

  test(`${format}: login access by role or CID; identities shown`, { timeout: 10000 }, async (t) => {
    const { viewer } = await start(t, api, {
      localAuth: 'idKey',
      dashboard: { access: { login: { roles: ['admin'], cids: ['watcher'] } } },
    });
    const anon = await viewer();
    const device = await viewer({}, ['player1', 'player1']);   // logged in, but neither admin nor listed
    const listed = await viewer({}, ['watcher', 'watcher']);
    await until(() => anon.got.length && device.got.length && listed.got.length);
    assert.equal(anon.got[0].type, 'denied');
    assert.equal(device.got[0].type, 'denied');
    assert.equal(listed.got[0].type, 'init');
    assert.equal(listed.got[0].showIdentities, true);
    assert.throws(() => new api.Server({ port: 0, dashboard: { access: { login: { roles: ['boss'] } } } }), RangeError);
  });

  test(`${format}: clients cannot forge dashboard frames; viewer limit`, { timeout: 10000 }, async (t) => {
    const { server, connect, viewer } = await start(t, api, { dashboard: { maxViewers: 1 } });
    const first = await viewer();
    await until(() => first.got.some((m) => m.type === 'init'));
    const second = await viewer();
    await until(() => second.got.length);
    assert.equal(second.got[0].type, 'full');
    const forger = await connect();
    forger.signal(`${first.io.cid}${DASH_TOPIC}`, { type: 'init', fake: true });
    await wait(200);
    assert.equal(first.got.some((m) => m.fake), false);
    assert.equal(server.stats().counters.hostDenied, 1);
    first.io.signal(DASH_IN, { op: 'bye' });
    await until(() => server.dashboard.viewers.size === 0);
  });

  test(`${format}: dashboard on your own HTTP server`, { timeout: 10000 }, async (t) => {
    const http = createServer((req, res) => {
      if (server.dashboard.handle(req, res)) return;
      res.writeHead(200); res.end('app');
    });
    const server = new api.Server({ httpServer: http, dashboard: { path: '/ops/status' } });
    t.after(async () => { await new Promise((r) => server.close(r)); await new Promise((r) => http.close(r)); });
    const ready = new Promise((r) => server.on('ready', r));
    http.listen(0, '127.0.0.1');
    await ready;
    const base = `http://127.0.0.1:${http.address().port}`;
    assert.equal((await fetch(`${base}/ops/status`)).status, 200);
    assert.equal((await fetch(`${base}/ops/status/io.js`)).status, 200);
    assert.equal(await (await fetch(`${base}/dashboard`)).text(), 'app');
  });

  test(`${format}: dashboard options are checked; off by default; close frees the port`, { timeout: 10000 }, async (t) => {
    for (const [options, pattern] of [
      [{ path: 'no-slash' }, /path/], [{ panels: ['server', 'nope'] }, /panels/], [{ history: 5 }, /history/],
      [{ maxViewers: 0 }, /maxViewers/], [{ access: 'everyone' }, /access/], [{ extra: 1 }, /unknown dashboard option/],
    ]) {
      assert.throws(() => new api.Server({ port: 0, dashboard: options }), pattern);
    }
    const plain = new api.Server({ port: 0 });
    await new Promise((r) => plain.on('ready', r));
    assert.equal(plain.dashboard, null);
    await new Promise((r) => plain.close(r));

    const s = new api.Server({ port: 0, dashboard: true });
    await new Promise((r) => s.on('ready', r));
    const port = s.port;
    await new Promise((r) => s.close(r));
    assert.equal(s.ownHttp.listening, false);
    const again = new api.Server({ port, dashboard: true });
    await new Promise((r) => again.on('ready', r));
    await new Promise((r) => again.close(r));
  });
}
