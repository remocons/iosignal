// Dashboard.js serves a status page over HTTP and reads the client bundle from disk; neither exists
// in a page. Server.js imports it, so the browser build uses this instead: passing `dashboard` throws.
export const DASHBOARD = { HOST: 'iosignal.dashboard', IN: 'iosignal.dashboard#in', TOPIC: 'iosignal.dashboard' }
export const DASHBOARD_PANELS = ['server', 'traffic', 'hosts', 'game', 'participants', 'events']
export class Dashboard {
  constructor() {
    throw new Error('dashboard is not available in the browser')
  }
}
