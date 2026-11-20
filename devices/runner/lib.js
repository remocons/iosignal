// Shared by the supervised Node processes.
export const config = JSON.parse(process.env.IOSD_CONFIG || '{}')

export const report = (t, data) => process.send?.({ t, ...data })
export const ready = () => report('ready')
export const meta = data => report('meta', { data })
export function fatal(error) {
  report('fatal', { error: String(error?.message ?? error) })
  console.error(error)
  setTimeout(() => process.exit(1), 50)
}

// Exit with the supervisor, and shut down cleanly when it asks.
export function onShutdown(close) {
  let closing = false
  const stop = async () => {
    if (closing) return
    closing = true
    setTimeout(() => process.exit(0), 2000).unref()
    try { await close?.() } finally { process.exit(0) }
  }
  process.once('SIGTERM', stop)
  process.once('SIGINT', stop)
  process.once('disconnect', stop)
}
