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
  // Drop signals from connections that are not authenticated.
  membersOnly: false,
  // Observability. logMessages: log each received message (type and tag, never the payload).
  // logStats: print a one-line summary every N ms (0 = off).
  logMessages: false,
  logStats: 0,

  // Nested groups: a Server merges its own options over these.
  // Packet layouts remain unchanged.
  security: {
    maxClockSkewMs: 60000,
    authChallengeMaxAgeMs: 60000,
    maxReplayEntries: 65536
  },
  // Named quota profiles. A connection uses one: an anonymous connection the Server's
  // anonymousQuota, an authenticated one the profile its account resolves to (see BohoAuth
  // resolveQuota). null is unlimited. A Server merges its quotas option over these per profile
  // and may add profiles; a running server's profiles can be adjusted (server.quotas.basic.fanout = 50).
  //   maxMessageBytes: largest message the connection may send (larger: OVER_SIZE, dropped)
  //   fanout:          most subscribers one channel publish is delivered to
  //   msgPerSec, bytesPerSec: sustained receive rate (token bucket, 1 s burst); over: dropped
  //   maxConnections:  connections of one account (uid) at a time; over: the login fails
  quotas: {
    anonymous: { maxMessageBytes: 256 * 1024, fanout: 1000, msgPerSec: 100, bytesPerSec: 2 * 1024 * 1024, maxConnections: null },
    basic: { maxMessageBytes: 1024 * 1024, fanout: 1000, msgPerSec: 200, bytesPerSec: 4 * 1024 * 1024, maxConnections: 20 },
    pro: { maxMessageBytes: 4 * 1024 * 1024, fanout: 10000, msgPerSec: 1000, bytesPerSec: 16 * 1024 * 1024, maxConnections: 200 },
    unlimited: { maxMessageBytes: null, fanout: null, msgPerSec: null, bytesPerSec: null, maxConnections: null }
  },
  anonymousQuota: 'anonymous', // profile of a connection that has not authenticated

  retain: {
    enabled: true,
    limitSize: 100000,      // a retained message must be smaller than this many bytes
    limitCounter: 1000,     // channel retain tags per server, and CID retain tags per connection
    // A channel retain belongs to its last writer: an authenticated account (CID, shared by its
    // connections) or a live anonymous connection. Each owner holds at most tagsPerOwner tags and
    // bytesPerOwner bytes. An account's values stay until restart; a closed anonymous connection's
    // move to its network's grace pool (same budget) and are removed after anonymousGraceMs.
    tagsPerOwner: 32,
    bytesPerOwner: 1024 * 1024,
    anonymousGraceMs: 60 * 60 * 1000,
    // CID retains of one connection (removed with it), and all retained messages of the server.
    // A value over budget is not stored, and removes the value it would have replaced.
    bytesPerConnection: 1024 * 1024,
    bytesTotal: 256 * 1024 * 1024
  },

  // --- Process-wide: read directly where used, not per Server ---

  fileLogger: {
    connection: {
      use: false,
      path: 'connection.log'
    },
    auth: {
      use: false,
      path: 'auth.log'
    },
    attack: {
      use: false,
      path: 'attack.log'
    }
  },

  auth: {
    failDelay: 600, // ms before AUTH_FAIL is sent
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
