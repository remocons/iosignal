import { readFileSync } from 'node:fs';
import { totalmem } from 'node:os';
import { monitorEventLoopDelay, performance } from 'node:perf_hooks';
import { STATE } from '../common/constants.js';

// Live server telemetry, sampled once a second and shared by every reader (the dashboard, the
// monitor service): CPU, event-loop delay and utilisation, memory, connections by transport and
// state, send queues of slow peers, and per-second rates of the manager's counters.
// `value` holds the latest sample. dispose() stops the timer.
export class ServerStats {
  // onSample(value): called after each sample (the dashboard keeps its history from it).
  constructor(server, { onSample = null } = {}) {
    this.server = server;
    this.onSample = onSample;
    // Traffic counters come from the manager's cumulative counters, counted since this service started.
    this.base = { ...server.manager.counters };
    this.counters = { opened: 0, closed: 0, authFailed: 0,
      ...Object.fromEntries(Object.keys(this.base).map(key => [key, 0])) };
    this.onState = (_peer, _previous) => {
      if (_peer.state === STATE.OPEN) this.counters.opened++;
      if (_peer.state === STATE.CLOSED) this.counters.closed++;
      if (_peer.state === STATE.AUTH_FAIL) this.counters.authFailed++;
    };
    server.on('remote:state', this.onState);
    this.delay = monitorEventLoopDelay({ resolution: 20 }); this.delay.enable();
    this.cpu = process.cpuUsage(); this.elu = performance.eventLoopUtilization();
    this.previousAt = performance.now(); this.previous = { ...this.counters };
    this.sample();
    this.timer = setInterval(() => this.sample(), 1000); this.timer.unref();
  }
  sample() {
    const now = performance.now(), elapsed = Math.max(1, now - this.previousAt);
    for (const key in this.base) this.counters[key] = this.server.manager.counters[key] - this.base[key];
    let authenticated = 0, websocket = 0, queuedBytes = 0, maxQueuedBytes = 0;
    let txQueuePeakBytes = 0, txWriteFalseCount = 0, txDrainMaxMs = 0;
    let txBlockedConnections = 0, txBlockedMaxMs = 0;
    const states = {};
    const transports = { websocket: { total: 0, authenticated: 0 }, tcp: { total: 0, authenticated: 0 } };
    for (const peer of this.server.manager.remotes) {
      const transport = transports[peer.socketType === 'websocket' ? 'websocket' : 'tcp']; transport.total++;
      if (peer.boho.isAuthorized) { authenticated++; transport.authenticated++; }
      if (peer.socketType === 'websocket') websocket++;
      const queued = peer.socket.bufferedAmount ?? peer.socket.writableLength ?? 0;
      queuedBytes += queued; maxQueuedBytes = Math.max(maxQueuedBytes, queued);
      txQueuePeakBytes = Math.max(txQueuePeakBytes, peer.txQueuePeakBytes ?? 0);
      txWriteFalseCount += peer.txWriteFalseCount ?? 0;
      txDrainMaxMs = Math.max(txDrainMaxMs, peer.txDrainMaxMs ?? 0);
      if (peer.txBlockedSince != null) {
        txBlockedConnections++;
        txBlockedMaxMs = Math.max(txBlockedMaxMs, now - peer.txBlockedSince);
      }
      const name = peer.getStateName(); states[name] = (states[name] || 0) + 1;
    }
    const rates = Object.fromEntries(Object.entries(this.counters).map(([key, value]) => [key, (value - this.previous[key]) * 1000 / elapsed]));
    const cpu = process.cpuUsage(), elu = performance.eventLoopUtilization();
    const delta = performance.eventLoopUtilization(elu, this.elu);
    const mem = process.memoryUsage(), total = this.server.manager.remotes.size;
    let hostAvailableBytes = null;
    if (process.platform === 'linux') {
      try { const match = readFileSync('/proc/meminfo', 'utf8').match(/^MemAvailable:\s+(\d+) kB/m); if (match) hostAvailableBytes = Number(match[1]) * 1024; }
      catch { /* Optional host telemetry must not interrupt service. */ }
    }
    this.value = { at: Date.now(), total, authenticated, anonymous: total - authenticated, websocket,
      transports, hostAvailableBytes, hostTotalBytes: totalmem(), channels: this.server.manager.channel_map.size, states, queuedBytes, maxQueuedBytes,
      txQueuePeakBytes, txWriteFalseCount, txDrainMaxMs, txBlockedConnections, txBlockedMaxMs,
      counters: { ...this.counters }, rates, rss: mem.rss, heapUsed: mem.heapUsed,
      cpuPercent: ((cpu.user - this.cpu.user) + (cpu.system - this.cpu.system)) / (elapsed * 10),
      eventLoopUtilization: delta.utilization,
      eventLoopP99Ms: this.delay.percentile(99) / 1e6,
      // anonymous: profile name of unauthenticated connections; profiles: the server's quotas now.
      quota: { anonymous: this.server.anonymousQuota, profiles: structuredClone(this.server.quotas) } };
    this.previousAt = now; this.previous = { ...this.counters }; this.cpu = cpu; this.elu = elu; this.delay.reset();
    if (this.onSample) {
      try { this.onSample(this.value); } catch (error) { console.error('server stats reader error:', error); }
    }
  }
  dispose() {
    clearInterval(this.timer); this.delay.disable(); this.server.off('remote:state', this.onState);
  }
}
