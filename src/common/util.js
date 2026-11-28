import { networkInterfaces } from 'os';
import { isIPv4 } from 'net';

function isPrivateIPv4(ip) {
  const [a, b] = ip.split('.').map(Number)
  return a === 0 || a === 127 || a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
}

// IPv6 is not supported (connections from IPv6 addresses are refused, see Remote.isSupportedIP):
// only IPv4 addresses are private. '::1' and IPv4-mapped '::ffff:a.b.c.d' are read as IPv4.
// Unspecified, loopback and RFC 1918.
export function isPrivateIP(ip) {
  if (typeof ip !== 'string') return false
  if (ip === '::1') return true
  if (ip.startsWith('::ffff:')) ip = ip.slice(7)
  return isIPv4(ip) && isPrivateIPv4(ip)
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function getIPv4HexString(ipStr) {
  let ipv4 = ipStr.split('.')
  return Buffer.from(ipv4).toString('hex')
}

export function getLocalAddress() {
  const nets = networkInterfaces();
  // console.log(nets)
  const results = Object.create(null); // Or just '{}', an empty object
  let localAddress = ''
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
      if (net.family === familyV4Value && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
        localAddress = net.address
      }
    }
  }

  // console.log('localAddress:', localAddress)
  return localAddress
}


// A login ID travels as 8 bytes (Boho id8): a longer one would be cut and could never match, or
// match another entry. Key providers refuse it when it is added.
export function checkLoginId(id) {
  if (typeof id !== 'string' || !id || new TextEncoder().encode(id).byteLength > 8) {
    throw new RangeError(`login ID must be 1-8 bytes: ${typeof id === 'string' ? id : typeof id}`)
  }
  return id
}

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));