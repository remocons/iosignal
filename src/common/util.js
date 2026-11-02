import { networkInterfaces } from 'os';
import { isIPv4, isIPv6 } from 'net';

// 16 address bytes of an IPv6 string (with '::', an embedded IPv4 tail or a %zone), else null.
function ipv6Bytes(ip) {
  if (!isIPv6(ip)) return null
  ip = ip.split('%')[0]
  const tailStart = ip.lastIndexOf(':') + 1
  const tail = ip.slice(tailStart)
  if (isIPv4(tail)) {
    const [a, b, c, d] = tail.split('.').map(Number)
    ip = ip.slice(0, tailStart) + ((a << 8) | b).toString(16) + ':' + ((c << 8) | d).toString(16)
  }
  const words = s => s ? s.split(':').map(h => parseInt(h, 16)) : []
  const [head, rest] = ip.split('::')
  const left = words(head), right = words(rest)
  const all = [...left, ...new Array(8 - left.length - right.length).fill(0), ...right]
  const bytes = Buffer.alloc(16)
  all.forEach((word, i) => bytes.writeUInt16BE(word, i * 2))
  return bytes
}

function isPrivateIPv4(ip) {
  const [a, b] = ip.split('.').map(Number)
  return a === 0 || a === 127 || a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
}

// Unspecified, loopback, RFC 1918, IPv6 unique-local (fc00::/7) and link-local (fe80::/10).
export function isPrivateIP(ip) {
  if (isIPv4(ip)) return isPrivateIPv4(ip)
  const bytes = ipv6Bytes(ip)
  if (!bytes) return false
  if (bytes.subarray(0, 15).every(v => v === 0) && bytes[15] <= 1) return true // :: and ::1
  if (bytes.subarray(0, 10).every(v => v === 0) && bytes[10] === 0xff && bytes[11] === 0xff) {
    return isPrivateIPv4(bytes.subarray(12).join('.')) // IPv4-mapped
  }
  return (bytes[0] & 0xfe) === 0xfc || (bytes[0] === 0xfe && (bytes[1] & 0xc0) === 0x80)
}

// Hosts on one IPv6 network share the /64 prefix, not the address: hex of those 8 bytes.
export function getIPv6PrefixHexString(ip) {
  return ipv6Bytes(ip)?.subarray(0, 8).toString('hex') ?? null
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


export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));