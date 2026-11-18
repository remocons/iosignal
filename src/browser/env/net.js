// net: address checks (Remote, util) and the CongSocket (TCP) server. A page cannot listen for TCP,
// so createServer throws: do not pass `congPort`.
const IPV4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/

export function isIPv4(ip) {
  return typeof ip === 'string' && IPV4.test(ip)
}

export function isIPv6(ip) {
  if (typeof ip !== 'string' || !ip.includes(':')) return false
  ip = ip.split('%')[0]
  let tail = ip.slice(ip.lastIndexOf(':') + 1)
  let words = 8
  if (tail.includes('.')) {
    if (!isIPv4(tail)) return false
    ip = ip.slice(0, ip.lastIndexOf(':') + 1) + '0:0'
  }
  if ((ip.match(/::/g) || []).length > 1) return false
  const groups = ip.split('::')
  const parts = groups.flatMap(g => g ? g.split(':') : [])
  if (!parts.every(p => /^[0-9a-fA-F]{1,4}$/.test(p))) return false
  return groups.length === 2 ? parts.length < words : parts.length === words
}

export function isIP(ip) {
  return isIPv4(ip) ? 4 : isIPv6(ip) ? 6 : 0
}

export function createServer() {
  throw new Error('net.createServer is not available in the browser (do not pass `congPort`)')
}

export default { isIP, isIPv4, isIPv6, createServer }
