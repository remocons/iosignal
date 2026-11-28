import { performance } from 'node:perf_hooks'
import { isPrivateIP } from '../common/util.js'
import { normalizeIP } from './Remote.js'

const MAX_ADDRESSES = 10000 // tracked public addresses; past windows are forgotten first

const LIMIT_KEYS = ['newPerAddressPerMin', 'failedPerAddressPerMin', 'maxPerAddress', 'windowMs', 'msgPerAddressPerSec', 'bytesPerAddressPerSec']

/**
 * Checks a limits object ({ newPerAddressPerMin, failedPerAddressPerMin, maxPerAddress, windowMs,
 * exempt }) and returns a copy. A count of 0 turns that limit off; windowMs is at least 1000.
 */
export function connectionLimits(given, defaults) {
  if (given === false) return { ...defaults, newPerAddressPerMin: 0, failedPerAddressPerMin: 0, maxPerAddress: 0, msgPerAddressPerSec: 0, bytesPerAddressPerSec: 0, exempt: [] }
  if (given !== undefined && (given === null || typeof given !== 'object')) {
    throw new TypeError('connectionLimits must be an object or false')
  }
  const limits = { ...defaults, ...given }
  for (const key of Object.keys(given ?? {})) {
    if (!LIMIT_KEYS.includes(key) && key !== 'exempt') throw new TypeError(`unknown option connectionLimits.${key}`)
  }
  for (const key of LIMIT_KEYS) {
    const value = limits[key]
    if (!Number.isSafeInteger(value) || value < (key === 'windowMs' ? 1000 : 0)) {
      throw new RangeError(`connectionLimits.${key} must be an integer >= ${key === 'windowMs' ? 1000 : 0}`)
    }
  }
  if (!Array.isArray(limits.exempt) || limits.exempt.some(ip => typeof ip !== 'string')) {
    throw new TypeError('connectionLimits.exempt must be an array of addresses')
  }
  limits.exempt = limits.exempt.map(ip => normalizeIP(ip) ?? ip)
  return limits
}

/**
 * Connections per public address, checked when a socket is accepted, before anything is sent:
 *  - new:    more than newPerAddressPerMin new connections in a window → refused until it ends
 *  - failed: failedPerAddressPerMin connections in a window that ended without a CID (a refused
 *            login, a Boho 2.x client, a broken or scanning client) → refused until it ends
 *  - open:   maxPerAddress connections open at once → further ones refused while they stay
 * Connections already open are never touched. Loopback, private and exempt addresses are not
 * counted (a proxy, a LAN, other servers). A refused connection is closed at once and costs no
 * key lookup; well-behaved clients reconnect later on their own.
 *
 * The limits object is read on every call, so a running server can adjust it.
 */
export class AddressLimiter {
  /**
   * @param {() => object} getLimits returns the limits in force (see connectionLimits)
   * @param {{ onLimit?: (ip: string, reason: 'new' | 'failed' | 'open', count: number, ms: number) => any }} [options]
   *   onLimit: called once when an address starts being limited (ms: for how long; 0 for 'open').
   */
  constructor(getLimits, { onLimit } = {}) {
    this.getLimits = getLimits
    this.onLimit = onLimit ?? null
    this.addresses = new Map() // ip -> { since, created, failed, open, until, reason }
    this.refused = { new: 0, failed: 0, open: 0 } // cumulative
    this.rateLimited = 0 // messages dropped by msgPerAddressPerSec / bytesPerAddressPerSec (takeRate)
  }

  #exempt(ip, limits) {
    return typeof ip !== 'string' || !ip || isPrivateIP(ip) || limits.exempt.includes(ip)
  }

  // The entry of an address, its window renewed when it has passed (open connections stay counted).
  #entry(ip, limits, now, create) {
    let entry = this.addresses.get(ip)
    if (entry && now - entry.since >= limits.windowMs) {
      if (!entry.open) { this.addresses.delete(ip); entry = undefined }
      else Object.assign(entry, { since: now, created: 0, failed: 0, until: 0, reason: null, openNoted: false })
    }
    if (!entry && create) {
      if (this.addresses.size >= MAX_ADDRESSES) this.#prune(limits, now)
      entry = { since: now, created: 0, failed: 0, open: 0, until: 0, reason: null, openNoted: false }
      this.addresses.set(ip, entry)
    }
    return entry
  }

  #prune(limits, now) {
    for (const [ip, e] of this.addresses) if (!e.open && now - e.since >= limits.windowMs) this.addresses.delete(ip)
    if (this.addresses.size >= MAX_ADDRESSES) for (const [ip, e] of this.addresses) if (!e.open) this.addresses.delete(ip)
  }

  #limit(ip, entry, reason, count, limits, now) {
    entry.until = entry.since + limits.windowMs
    entry.reason = reason
    this.#notify(ip, reason, count, entry.until - now)
  }

  #notify(ip, reason, count, ms) {
    try { this.onLimit?.(ip, reason, count, Math.max(0, ms)) } catch (error) { console.error('AddressLimiter onLimit error:', error) }
  }

  /**
   * A new connection from ip: true to accept it (it is then counted as open; call closed() when it
   * ends), false to close it at once. Its reason is in lastRefusal.
   */
  admit(ip, now = Date.now()) {
    const limits = this.getLimits()
    if (this.#exempt(ip, limits)) return true
    const entry = this.#entry(ip, limits, now, true)
    if (entry.until > now) return this.#refuse(entry.reason)
    entry.created++
    if (limits.newPerAddressPerMin && entry.created > limits.newPerAddressPerMin) {
      this.#limit(ip, entry, 'new', entry.created - 1, limits, now)
      return this.#refuse('new')
    }
    if (limits.maxPerAddress && entry.open >= limits.maxPerAddress) {
      if (!entry.openNoted) { entry.openNoted = true; this.#notify(ip, 'open', entry.open, 0) }
      return this.#refuse('open')
    }
    entry.open++
    return true
  }

  #refuse(reason) {
    this.refused[reason]++
    this.lastRefusal = reason
    return false
  }

  /**
   * An accepted connection from ip ended. failed: it never got a CID (a refused login, a Boho 2.x
   * client, a broken client); too many of those in a window limit the address.
   */
  closed(ip, failed = false, now = Date.now()) {
    const limits = this.getLimits()
    if (this.#exempt(ip, limits)) return
    const entry = this.#entry(ip, limits, now, failed)
    if (!entry) return
    if (entry.open > 0) entry.open--
    if (entry.open < limits.maxPerAddress) entry.openNoted = false
    if (!failed) return
    entry.failed++
    if (limits.failedPerAddressPerMin && entry.failed >= limits.failedPerAddressPerMin && !(entry.until > now)) {
      this.#limit(ip, entry, 'failed', entry.failed, limits, now)
    }
  }

  /** Addresses limited now: [{ ip, reason, count, until }] (most first, at most limit), and those at maxPerAddress. */
  limited(limit = 100, now = Date.now()) {
    const limits = this.getLimits()
    const list = []
    for (const [ip, e] of this.addresses) {
      if (e.until > now) list.push({ ip, reason: e.reason, count: e.reason === 'failed' ? e.failed : e.created, until: e.until })
      else if (limits.maxPerAddress && e.open >= limits.maxPerAddress) list.push({ ip, reason: 'open', count: e.open, until: null })
    }
    return list.sort((a, b) => b.count - a.count).slice(0, limit)
  }

  /**
   * A message of bytes from an address (anonymous-quota connections only; the caller decides): null when
   * it may pass, else the limit it went over ('msgPerAddressPerSec' | 'bytesPerAddressPerSec'). Token
   * buckets holding one second, kept on the address's entry while it has open connections.
   */
  takeRate(ip, bytes, now = performance.now()) {
    const limits = this.getLimits()
    const msgLimit = limits.msgPerAddressPerSec || 0
    const byteLimit = limits.bytesPerAddressPerSec || 0
    if ((!msgLimit && !byteLimit) || this.#exempt(ip, limits)) return null
    const entry = this.addresses.get(ip)
    if (!entry) return null
    if (entry.rateAt === undefined) {
      entry.msgTokens = msgLimit
      entry.byteTokens = byteLimit
    } else {
      const seconds = Math.max(0, now - entry.rateAt) / 1000
      if (msgLimit) entry.msgTokens = Math.min(msgLimit, entry.msgTokens + seconds * msgLimit)
      if (byteLimit) entry.byteTokens = Math.min(byteLimit, entry.byteTokens + seconds * byteLimit)
    }
    entry.rateAt = now
    if (msgLimit && entry.msgTokens < 1) { this.rateLimited++; return 'msgPerAddressPerSec' }
    if (byteLimit && entry.byteTokens < Math.min(bytes, byteLimit)) { this.rateLimited++; return 'bytesPerAddressPerSec' }
    if (msgLimit) entry.msgTokens -= 1
    if (byteLimit) entry.byteTokens -= bytes
    return null
  }

  /** Open connections counted for an address (0 for an exempt one). */
  openCount(ip) {
    return this.addresses.get(ip)?.open ?? 0
  }
}
