// http: only the dashboard and the health check make their own HTTP server. A page cannot listen for HTTP
// (createBrowserBroker turns the health check off).
export function createServer() {
  throw new Error('http.createServer is not available in the browser (do not pass `dashboard`)')
}
export default { createServer }
