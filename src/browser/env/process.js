// process (Metrics.snapshot, ServerStats): memory figures of the page when the browser gives them.
export function memoryUsage() {
  const m = globalThis.performance?.memory
  const used = m?.usedJSHeapSize ?? 0
  return { rss: m?.totalJSHeapSize ?? 0, heapUsed: used, heapTotal: m?.totalJSHeapSize ?? 0, external: 0, arrayBuffers: 0 }
}
export function cpuUsage() { return { user: 0, system: 0 } }
export const platform = 'browser'
export const env = {}
export function nextTick(fn, ...args) { queueMicrotask(() => fn(...args)) }
export default { memoryUsage, cpuUsage, platform, env, nextTick }
