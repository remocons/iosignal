// fs, fs/promises: file loggers (serverOption.fileLogger) and the dashboard page read files.
// Neither is available in a page; keep fileLogger off and do not pass `dashboard`.
const unavailable = name => () => { throw new Error(`fs.${name} is not available in the browser`) }
export const openSync = unavailable('openSync')
export const write = unavailable('write')
export const readFileSync = unavailable('readFileSync')
export const readFile = async () => unavailable('readFile')()
export default { openSync, write, readFileSync, readFile }
