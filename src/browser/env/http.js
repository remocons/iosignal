// http: only the dashboard makes its own HTTP server. A page cannot listen for HTTP.
export function createServer() {
  throw new Error('http.createServer is not available in the browser (do not pass `dashboard`)')
}
export default { createServer }
