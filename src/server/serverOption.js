// Defaults, read when a Server is created; a Server never modifies them. Change one before
// creating servers to change the default for all of them, or pass the setting to new Server().

export const serverOption = {

  // --- Per Server: each of these can be given to new Server({ ... }) ---

  heartbeatInterval: 50000, // ms between liveness checks
  heartbeatGrace: 5000,     // extra ms a peer has to answer before it is closed
  // Max bytes for a single WebSocket message and CongSocket frame. Bounds pre-auth memory use per
  // connection (ws defaults to 100 MiB); see Remote.rxFrameLimit().
  maxPayload: 32 * 1024 * 1024,
  // When to use X-Forwarded-For / X-Forwarded-Proto of a WebSocket request:
  // 'private' only if the connecting peer is a loopback/private address, e.g. a reverse proxy on
  // the same host or network; true always; false never; a number N trusts N proxy hops. The entry
  // appended by the last trusted proxy is used; earlier entries can be forged by the client.
  trustProxy: 'private',
  // A peer whose unsent data exceeds this many bytes (it stopped reading) is closed instead of
  // letting its send queue grow without limit.
  maxBufferedBytes: 64 * 1024 * 1024,
  // Only authenticated connections may send signals or subscribe; an anonymous one that tries
  // gets AUTH_CLEAR and is closed.
  membersOnly: false,
  // Connections per public address, checked when a socket is accepted (see AddressLimiter):
  // newPerAddressPerMin new connections, failedPerAddressPerMin connections that ended without a
  // CID (refused logins, Boho 2.x and broken clients) in windowMs, and maxPerAddress open at once.
  // Over a rate limit the address's new connections are closed at once until the window ends; open
  // ones are never touched. 0 turns a limit off. Loopback, private and exempt addresses are not
  // counted. A Server's connectionLimits option is merged over this (false: all off).
  // msgPerAddressPerSec, bytesPerAddressPerSec: what all the anonymous connections of one address may
  // send together (token bucket, 1 s burst); over: dropped and told once (quota_exceeded).
  // All off by default (2026-11-29): an operator turns on what the deployment needs.
  connectionLimits: {
    newPerAddressPerMin: 0,
    failedPerAddressPerMin: 0,
    maxPerAddress: 0,
    msgPerAddressPerSec: 0,
    bytesPerAddressPerSec: 0,
    windowMs: 60000,
    exempt: []
  },
  // Observability. logMessages: log each received message (type and tag, never the payload).
  // logStats: print a one-line summary every N ms (0 = off).
  logMessages: false,
  logStats: 0,

  // Nested groups: a Server merges its own options over these.
  // Packet layouts remain unchanged.
  security: {
    maxClockSkewMs: 60000,
    authChallengeMaxAgeMs: 60000,
    maxReplayEntries: 65536,
    // true: a logged-in connection without TLS must send its signals, subscriptions and calls
    // encrypted (as clients do in ENC_MODE.AUTO); a plain one closes it (PLAINTEXT_AFTER_LOGIN).
    // Off by default: a client with encMode NO would be closed.
    requireEncryption: false
  },
  // Quota profiles: none by default, so every connection is unlimited (2026-11-29). An operator who
  // wants limits names its own profiles in the Server's quotas option and picks one with
  // anonymousQuota (connections that have not authenticated) and BohoAuth resolveQuota or a key
  // entry's quota (logins). null is unlimited; a running server's profiles can be adjusted
  // (server.quotas.<name>.fanout = 50).
  //   maxMessageBytes: largest message the connection may send (larger: OVER_SIZE, dropped)
  //   fanout:          most subscribers one channel publish is delivered to
  //   msgPerSec, bytesPerSec: sustained receive rate (token bucket, 1 s burst); over: dropped
  //   maxConnections:  connections of one account (uid) at a time; over: the login fails
  //   maxSubscriptions: tags one connection may be subscribed to at a time; over: the tag is left out
  //   deliveriesPerSec: subscribers the connection's publishes reach per second in all (token bucket,
  //                    1 s burst; msgPerSec × fanout without it); over: a publish reaches fewer, like fanout
  quotas: {},
  anonymousQuota: null, // profile of a connection that has not authenticated (null: unlimited)

  // Delivery policy of an owned device (its login has a uid) that has none stored: null lets everyone
  // reach it ('open'). An operator may give a mode ('home', 'allowlist', 'denylist') or a whole
  // policy, see deliveryPolicy.js. Devices without an owner are never filtered.
  deliveryPolicy: null,

  retain: {
    enabled: true,
    // Budgets, null (unlimited) by default (2026-11-29); an operator sets what memory allows.
    limitSize: null,        // a retained message must be smaller than this many bytes
    limitCounter: null,     // channel retain tags per server, and CID retain tags per connection
    // A channel retain belongs to its last writer: an authenticated account (CID, shared by its
    // connections) or a live anonymous connection. Each owner holds at most tagsPerOwner tags and
    // bytesPerOwner bytes. An account's values stay until restart; a closed anonymous connection's
    // move to its network's grace pool (same budget) and are removed after anonymousGraceMs.
    tagsPerOwner: null,
    bytesPerOwner: null,
    anonymousGraceMs: 60 * 60 * 1000,
    // CID retains of one connection (removed with it), and all retained messages of the server.
    // A value over budget is not stored, and removes the value it would have replaced.
    bytesPerConnection: null,
    bytesTotal: null
  },

  // --- Process-wide: read directly where used, not per Server ---

  // File logs, off by default. Each file is rotated at maxBytes into path.1 … path.<keep>
  // (maxBytes 0: never). A write error is reported once and never stops the server.
  // connection, attack: text lines with an ISO time. auth: JSON Lines (one object per line), see
  // BohoAuth; level 'normal' writes logins, failed logins of known IDs, address blocks and the
  // failure summaries; 'all' also every failed attempt (unknown IDs, blocked addresses, bad packets).
  // A BohoAuth's fileLog option overrides auth for that instance.
  fileLogger: {
    connection: {
      use: false,
      path: 'connection.log',
      maxBytes: 10 * 1024 * 1024,
      keep: 5
    },
    auth: {
      use: false,
      path: 'auth.log',
      level: 'normal',
      maxBytes: 10 * 1024 * 1024,
      keep: 5
    },
    attack: {
      use: false,
      path: 'attack.log',
      maxBytes: 10 * 1024 * 1024,
      keep: 5
    }
  },

  auth: {
    failDelay: 600, // ms before AUTH_FAIL is sent
    // A refused connection has no CID: it is closed this long after AUTH_FAIL unless it logs in or
    // goes on anonymously (CID_REQ) meanwhile, so the client reconnects and tries again on its own
    // schedule instead of staying online unseen. 0 keeps it open.
    failCloseMs: 30000,
    // Wrong logins: a connection is closed after maxFailuresPerConnection; a public address with
    // maxFailuresPerAddress in failureWindowMs gets its next logins closed unchecked until the window
    // has passed (closed, not AUTH_FAIL, so a device with the right key there connects again).
    // Loopback and private addresses are not counted (a proxy, a LAN, tests).
    maxFailuresPerConnection: 5,
    maxFailuresPerAddress: 30,
    failureWindowMs: 60000,
    // Failed logins are counted by kind, address and login ID, and reported as one summary per
    // window (console line, or BohoAuth's onAuthSummary option). Nothing is written while no login
    // fails. 0 turns the summary off.
    summaryMs: 10 * 60 * 1000,
    // Default for BohoAuth, when the same authenticated CID is already online:
    // 'keepNew' replaces the old connection, 'keepOld' rejects the new login.
    // Override per BohoAuth with its duplicateLogin option, and per Server with options.duplicateLogin
    // (which wins, and applies only to that Server's connections).
    duplicateLogin: 'keepNew'
  },

  // Development aids.
  debug: {
    slow: false,    // delay handling of every received message by `delay` ms
    delay: 500,
    showAuthInfo: false // log auth results and state traces (never keys)
  }
}
