// An IOSignal Server (Server.js, unchanged) listening on local://<port> in this page.
import './env/globals.js'
import { Server } from '../server/Server.js'
import { serverOption } from '../server/serverOption.js'

export { Server, serverOption }

/**
 * Creates a Server for clients in this page and in other tabs of this origin.
 * Takes the options of new Server() except those a page cannot provide (httpServer, congPort,
 * dashboard, healthPath: a page has no HTTP server); `port` is the local address (default 7700):
 * clients connect to 'local://7700'.
 * Resolves once it listens; rejects when the address is in use (also by another tab).
 */
export function createBrowserBroker(options = {}, authManager) {
  for (const name of ['httpServer', 'congPort', 'dashboard', 'healthPath']) {
    if (options[name] !== undefined) throw new TypeError(`${name} is not available in the browser`)
  }
  const server = new Server({ port: 7700, ...options, healthPath: false }, authManager)
  server.url = server.wss.url
  return new Promise((resolve, reject) => {
    const onError = error => { server.close(); reject(error) }
    server.once('error', onError)
    server.once('ready', () => {
      server.off('error', onError)
      resolve(server)
    })
  })
}
