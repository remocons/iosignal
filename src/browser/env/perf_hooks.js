// node:perf_hooks: the browser has performance; event loop measurements are not available.
export const performance = globalThis.performance
export function monitorEventLoopDelay() {
  return { enable() {}, disable() {}, reset() {}, percentile: () => 0, mean: 0, max: 0, min: 0 }
}
export default { performance, monitorEventLoopDelay }
