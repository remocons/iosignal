// Entry of the browser bundle (dist/browser/esm/broker.js): an IOSignal server that runs in a web
// page and clients that reach it through local:// URLs. The build maps the Node.js modules the
// server imports (ws, net, fs, ...) to ./env.
export { createBrowserBroker, Server, serverOption } from './broker.js'
export { attachMonitor, readSignal, summarize } from './monitor.js'
export { LocalIO, LocalWebSocket, IO } from './LocalIO.js'
