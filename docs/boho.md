# Authentication and encrypted communication with Boho

[README](https://github.com/remocons/iosignal/blob/main/README.md) | [English](https://github.com/remocons/iosignal/blob/main/docs/boho.md) | [한국어](https://github.com/remocons/iosignal/blob/main/docs/boho.ko.md)

IOSignal uses [Boho](https://github.com/remocons/boho) for shared-key authentication
and message encryption. Since IOSignal 10.0.0 (boho 3.0.0), Boho is built on the
standard **Ascon** (NIST SP 800-232) instead of the earlier custom SHA-256
construction. The Arduino implementation is part of
[IOSignal Arduino](https://github.com/remocons/iosignal-arduino) 10.0.0, and the
JavaScript implementation runs in Node.js and browsers, so DIY devices and web apps
use the same approach. IOSignal 9.x clients cannot log in to a 10.0.0 server, and
keys registered on a 9.x server must be registered again.

## Why shared-key Boho?

With Arduino devices, your own web apps and servers under common administration,
you can control both endpoint code and initial key provisioning. Device-specific
keys can be installed over USB/serial during setup, web app users can enter keys
obtained through another channel, and servers can distribute keys through
existing SSH/TLS connections.

When a secure provisioning path already exists, pre-shared symmetric keys can
support authentication and encrypted communication. You can establish peers
without a certificate authority; trust rests on the provisioning path and
endpoint software. Device-specific keys, secure storage, rotation and revocation
are still necessary. Embedding a common secret in a public JavaScript bundle is
not secure key distribution.

Boho puts shared-key authentication and binary packets for this environment on
standard Ascon. Its distinction is **compatible Arduino, JavaScript, Kotlin and
Python implementations integrated with IOSignal connections and message delivery**,
not new cryptography.

## Boho on Ascon

| Purpose | Algorithm |
| --- | --- |
| Message encryption and tamper check | Ascon-AEAD128, 8-byte tag |
| Key string → 16-byte key | Ascon-CXOF128 (`boho/v2/key`) |
| Login → session key and both proofs | Ascon-CXOF128 (`boho/v2/session`) |

The server stores only the 16-byte key made from each key string
(`Boho.deriveKey`), never the key string. A login (`SERVER_TIME_NONCE` 13 B →
`AUTH_REQ` 33 B → `AUTH_RES` 17 B) makes a new session key; logged-in messages are
`ENC` (21-byte header: type, length, clock, tag), E2E routing headers `ENC_E2E`,
and standalone or E2E bodies `ENC_PACK` (29-byte header). See the
[protocol notes](https://github.com/remocons/boho/blob/main/docs/PROTOCOL.md).

## Understanding the relationship with TLS

Typical certificate-based TLS authenticates peers and establishes keys without a
previously shared secret, then uses symmetric encryption for application data.
Even web users who have not logged in can authenticate the server and establish
an encrypted connection, but this does not provide network anonymity. On embedded
devices, certificate, trust-root, clock and renewal management, handshake work
and buffers can be burdensome. Small systems with an existing provisioning path
may be able to omit some of this machinery.

However, TLS supports **PSK-only and PSK with (EC)DHE**, so it does not always
require third-party certificates or public-key exchange.
[TLS 1.3 pre-shared keys](https://www.rfc-editor.org/rfc/rfc8446.html#section-2.2)
This does not mean Boho is faster or uses less memory than every TLS or standard
symmetric implementation; actual comparisons require measurement.

## Connection encryption and E2E data keys

```text
Arduino device ←→ IOSignal server ←→ Browser app
      └──────── Separate E2E data key ────────┘
```

Connection credentials establish each client's right to connect to the server.
To keep a message body confidential from a relay, use `signal_e2e` with a separate
data key held only by the final endpoints, then verify and decrypt it with
`decrypt_e2e` at the receiver. Ordinary connection encryption is not automatically
end-to-end encryption. The server processes routing information for E2E delivery,
and metadata such as traffic sizes remains visible.

The current JavaScript implementation's `AUTO` mode uses Boho connection
encryption when TLS is not used and Boho authentication is complete. E2E body
encryption is separate from connection protection. The unauthenticated local
[quick-start examples](https://github.com/remocons/iosignal/blob/main/README.md#quick-start) do not enable Boho authentication/encryption.

Normal web deployments can serve app code over HTTPS and connect over WSS while
also applying E2E to message bodies. Modified app code can expose keys and
plaintext, so E2E still requires trust in the app code provider. Boho does not
bypass browser mixed content rules.

## Session freshness (since 7.0.0)

The server rejects encrypted session packets outside the configured clock
window or with an already accepted time/counter pair. Both `ENC` (`ENC_488`
before 10.0.0) and the `ENC_E2E` routing envelope share this policy. Rejection terminates the connection
before executing or routing the message.

```js
const server = new Server({
  port: 8080,
  security: {
    maxClockSkewMs: 60000,
    authChallengeMaxAgeMs: 60000,
    maxReplayEntries: 65536
  }
}, authManager);
```

Defaults are a 60-second absolute clock window, a 60-second authentication
challenge lifetime and at most 65,536 remembered packet tuples per connection.
The limits must be positive safe integers. Cache exhaustion also terminates the
connection; still-valid replay evidence is never evicted. The server emits
`security:mismatch(remote, reason)` and records `remote.securityFailure`.

A successfully verified authentication proof consumes its challenge. Reconnect
for reauthentication or if manual login occurs after challenge expiry; calling
`login()` again on an authenticated connection now closes it. AUTH_REQ has no
current device timestamp, so this stage checks challenge age. Device clock skew
is checked on encrypted packets. Plaintext/TLS transport policy is unchanged.

JS clients must have a clock within the configured window. IOSignal Arduino
corrects its clock gradually from authenticated server envelopes; plain
PING/PONG provides no time sample. Inner E2E payload freshness remains an
application concern, separate from the connection envelope.

## Local test logins (localAuth)

Added in 8.1.0. `localAuth` creates a `BohoAuth` with a `LocalKeyProvider`, so
devices can log in without registering keys. Every non-empty ID logs in and
becomes the CID.

| Option | Login | Example |
| --- | --- | --- |
| `'idKey'` or `{ mode: 'idKey' }` | The key equals the ID | `io.auth('dev1', 'dev1')` |
| `{ mode: 'sharedKey', key }` | Any ID with the shared key | `io.auth('dev1', 'lab2026')` |

```js
const server = new Server({
  port: 7777,
  congPort: 8888,
  localAuth: { mode: 'sharedKey', key: 'lab2026' },
  membersOnly: true
});
```

- `role` (default `'device'`) and `quota` (the name of a profile you define in
  `quotas`; none by default, so no limits) apply to every login. Since 9.0 they replace `level`.
- Anonymous connections are still served; `membersOnly: true` drops their signals.
- `duplicateLogin` and `onAuthEvent` work as with any `BohoAuth`. Passing an
  `authManager` together with `localAuth` throws a `TypeError`.
- To build it yourself: `new BohoAuth(new LocalKeyProvider('idKey'))`.
- Anyone who knows the rule can log in under any ID and take over that CID
  (`keepNew` replaces the online connection). With a shared key every device
  holds the same key, so connection encryption does not separate the devices
  from each other. Use it only for local tests on a trusted network.

## Conditions in the current implementation

- Use sufficiently random keys. Key derivation (Ascon-CXOF128) is not a slow password KDF.
- JavaScript uses `crypto.getRandomValues()`; ESP32 and ESP8266 use the chip's random numbers. Boards without one (Arduino Uno) make the login nonce from gathered timing and `setNonceSeed()`: give them a value that changes on every boot.
- Boho itself does not enforce replay rejection or challenge expiry; the IOSignal server does. A valid tag alone does not establish permission to execute a command; check receive policies in the application.
- There is no forward secrecy: a leaked long-term key exposes the traffic it protected.
