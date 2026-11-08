/**
 * Delivery policy: which senders a device accepts CID unicast ('<cid>@topic') from.
 *
 * The policy belongs to an owned device (one whose login has a uid) and comes with its login
 * (authInfo.rxPolicy from the key provider, JSON text or an object) or later from
 * Manager.setDeliveryPolicy(). A device without an owner uid is never filtered.
 *
 * {
 *   v: 1,
 *   mode: 'open' | 'allowlist' | 'denylist',   // open: everyone (the default)
 *   anonymous: 'allow' | 'deny',                // default: deny for allowlist, allow for denylist
 *   publish: 'all' | 'policy',                  // who gets its CID publications ('@topic', '@$topic'):
 *                                               // 'all' subscribers (default), or only those the policy allows
 *   allow: { cids: [], uids: [] },
 *   deny:  { cids: [], uids: [] }
 * }
 *
 * Decision, first match wins:
 *  1. no owner, no policy, mode open           -> allow
 *  2. the device itself, its owner's uid, or a connection with role 'admin' -> allow
 *  3. sender CID in deny.cids / allow.cids     -> deny / allow
 *  4. sender uid in deny.uids / allow.uids     -> deny / allow
 *  5. anonymous sender (not authenticated, no uid) -> anonymous setting
 *  6. mode default: allowlist denies, denylist allows
 *
 * With publish 'policy', the same decision (subscriber in the sender's place) filters the device's CID
 * publications and the retained ones a new subscriber would get. Its '@state' close notice included.
 *
 * The sender's uid is remote.uid: a device's owner, or the user of a web sign-in on that connection.
 * Only the server's own view of the sender is used, never anything in the message.
 */

export const DELIVERY_POLICY_MODES = Object.freeze(['open', 'allowlist', 'denylist'])
export const DELIVERY_POLICY_MAX_ENTRIES = 200
const ENTRY_MAX_LENGTH = 64
const LISTS = ['cids', 'uids']

function entries(name, value) {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value)) throw new TypeError(`${name} must be an array`)
  if (value.length > DELIVERY_POLICY_MAX_ENTRIES) {
    throw new RangeError(`${name} has more than ${DELIVERY_POLICY_MAX_ENTRIES} entries`)
  }
  for (const entry of value) {
    if (typeof entry !== 'string' || !entry || entry.length > ENTRY_MAX_LENGTH) {
      throw new TypeError(`${name} entries must be non-empty strings of at most ${ENTRY_MAX_LENGTH} characters`)
    }
  }
  return [...new Set(value)]
}

function lists(name, value) {
  if (value === undefined || value === null) return { cids: [], uids: [] }
  if (typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${name} must be an object`)
  for (const key of Object.keys(value)) {
    if (!LISTS.includes(key)) throw new TypeError(`unknown ${name}.${key}`)
  }
  return { cids: entries(`${name}.cids`, value.cids), uids: entries(`${name}.uids`, value.uids) }
}

/**
 * A checked copy of a policy with every field present, or null for "no policy" (null, undefined, '').
 * Accepts JSON text. Throws TypeError/RangeError on an invalid policy.
 */
export function normalizeDeliveryPolicy(raw) {
  if (raw === undefined || raw === null || raw === '') return null
  let policy = raw
  if (typeof raw === 'string') {
    try { policy = JSON.parse(raw) } catch { throw new TypeError('delivery policy is not valid JSON') }
  }
  if (!policy || typeof policy !== 'object' || Array.isArray(policy)) throw new TypeError('delivery policy must be an object')
  for (const key of Object.keys(policy)) {
    if (!['v', 'mode', 'anonymous', 'publish', 'allow', 'deny', 'updatedAt'].includes(key)) throw new TypeError(`unknown delivery policy field ${key}`)
  }
  if (policy.v !== undefined && policy.v !== 1) throw new TypeError('delivery policy version must be 1')
  const mode = policy.mode ?? 'open'
  if (!DELIVERY_POLICY_MODES.includes(mode)) throw new TypeError(`delivery policy mode must be one of: ${DELIVERY_POLICY_MODES.join(', ')}`)
  const anonymous = policy.anonymous ?? (mode === 'allowlist' ? 'deny' : 'allow')
  if (anonymous !== 'allow' && anonymous !== 'deny') throw new TypeError("delivery policy anonymous must be 'allow' or 'deny'")
  const publish = policy.publish ?? 'all'
  if (publish !== 'all' && publish !== 'policy') throw new TypeError("delivery policy publish must be 'all' or 'policy'")
  const normalized = { v: 1, mode, anonymous, publish, allow: lists('allow', policy.allow), deny: lists('deny', policy.deny) }
  if (policy.updatedAt !== undefined) {
    if (!Number.isSafeInteger(policy.updatedAt) || policy.updatedAt < 0) throw new TypeError('delivery policy updatedAt must be a time in ms')
    normalized.updatedAt = policy.updatedAt
  }
  return normalized
}

/**
 * The form Manager checks per message, or null when nothing is filtered (no owner, no policy, open).
 * Never throws: a stored policy that cannot be read only lets the owner's own senders through
 * (fail closed), since ignoring it would deliver what the owner asked to block.
 */
export function compileDeliveryPolicy(raw, ownerUid) {
  if (typeof ownerUid !== 'string' || !ownerUid) return null
  let policy
  try {
    policy = normalizeDeliveryPolicy(raw)
  } catch (error) {
    console.warn(`[iosignal] unreadable delivery policy of uid ${ownerUid}, owner only:`, error.message)
    policy = { mode: 'allowlist', anonymous: 'deny', publish: 'policy', allow: { cids: [], uids: [] }, deny: { cids: [], uids: [] } }
  }
  if (!policy || policy.mode === 'open') return null
  return Object.freeze({
    owner: ownerUid,
    mode: policy.mode,
    defaultAllow: policy.mode === 'denylist',
    anonymousAllow: policy.anonymous === 'allow',
    filterPublish: policy.publish === 'policy',
    allowCids: new Set(policy.allow.cids),
    denyCids: new Set(policy.deny.cids),
    allowUids: new Set(policy.allow.uids),
    denyUids: new Set(policy.deny.uids)
  })
}

/** True if `target` (whose compiled policy is target.rxPolicy) accepts a unicast from `sender`. */
export function deliveryAllowed(target, sender) {
  const policy = target.rxPolicy
  if (!policy) return true
  if (sender === target) return true
  const authorized = sender.boho?.isAuthorized === true
  const uid = typeof sender.uid === 'string' && sender.uid ? sender.uid : null
  if (uid === policy.owner) return true
  if (authorized && sender.role === 'admin') return true
  // An anonymous connection's CID is random per connection, so CID rules are for authenticated ones.
  if (authorized) {
    if (policy.denyCids.has(sender.cid)) return false
    if (policy.allowCids.has(sender.cid)) return true
  }
  if (uid) {
    if (policy.denyUids.has(uid)) return false
    if (policy.allowUids.has(uid)) return true
  }
  if (!authorized && !uid) return policy.anonymousAllow
  return policy.defaultAllow
}
