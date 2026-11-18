// node:crypto, used only by the dashboard (access tokens). Not available in the browser.
const unavailable = name => () => { throw new Error(`crypto.${name} is not available in the browser`) }
export const timingSafeEqual = unavailable('timingSafeEqual')
export const createHash = unavailable('createHash')
export default { timingSafeEqual, createHash }
