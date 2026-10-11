# Authentication and encrypted communication with Boho

[README](https://github.com/remocons/iosignal/blob/main/README.md) | [English](https://github.com/remocons/iosignal/blob/main/docs/boho.md) | [한국어](https://github.com/remocons/iosignal/blob/main/docs/boho.ko.md)

IOSignal uses [Boho](https://github.com/remocons/boho) for shared-key authentication
and message encryption. Boho has an
[Arduino implementation](https://github.com/remocons/boho-arduino) and a JavaScript
implementation for Node.js and browsers, allowing DIY devices and web apps to use
the same approach.

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

Boho combines a SHA-256-based keystream, XOR encryption, shared-key authentication
and binary packets for this environment. Its distinction is **compatible Arduino
and JavaScript implementations integrated with IOSignal connections and message
delivery**, rather than novelty in the cryptographic operations themselves.

## XOR and a hash-based “virtual OTP”

XOR is a simple operation that restores the original value when applied twice
with the same value.

```text
Encryption: ciphertext = plaintext XOR keystream
Decryption: plaintext  = ciphertext XOR keystream
```

A true one-time pad (OTP) uses a uniformly random pad independent of the
plaintext, as long as the data, kept secret and used only once. This provides
perfect secrecy, but requires supplying both endpoints with a new 1 MB secret
pad for every 1 MB of data. Reusing a pad exposes `C1 XOR C2 = P1 XOR P2`, revealing
a relationship between plaintexts.

Instead of storing a pad as large as the data, Boho generates a SHA-256 keystream
from a secret key and message-specific values. The usual `set_key` path is:

```text
K   = SHA256(input key)
B   = SHA256(K || salt12)
S_i = SHA256(B || LE32(i))       // i = 1, 2, 3, …
keystream = S_1 || S_2 || …     // use only the plaintext length
```

`||` means byte concatenation; `LE32` is a four-byte little-endian integer. Each
hash output is 32 bytes. `salt12` contains time, counter and nonce values, and
the receiver reproduces the stream using the same values and key.

“Virtual OTP” describes this pseudorandom stream, not the perfect secrecy of a
true OTP. **Public random values alone can be hashed by anyone, so a shared secret
key is required.** Repeating the same key and `salt12` must also be avoided. XOR
alone does not detect tampering, so Boho data packets include the first eight
bytes of `SHA256(K || salt12 || plaintext)` as a tag. Despite legacy names in the
code, this tag is not standard HMAC.

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

## Session freshness in 7.0.0

The server now rejects encrypted session packets outside the configured clock
window or with an already accepted time/counter pair. Both `ENC_488` and the
`ENC_E2E` routing envelope share this policy. Rejection terminates the connection
before executing or routing the message. Wire formats remain unchanged.

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

JS clients must have a clock within the configured window. Boho Arduino 1.0.0
adds gradual clock correction from authenticated server envelopes; plain
PING/PONG provides no time sample. Inner E2E payload freshness remains an
application concern, separate from the connection envelope.

## Conditions in the current implementation

- Use sufficiently random keys. A single SHA-256 in `set_key` is not a slow password KDF.
- JavaScript uses `crypto.getRandomValues()`, but current Arduino standalone-packet nonces and the authentication client nonce use `micros()`. This is not cryptographic randomness; consider repeated key/`salt12` combinations across restarts, devices and communication directions.
- Boho itself does not enforce replay rejection or challenge expiry. A valid tag alone does not establish freshness or permission to execute a command; check receive policies in the caller and application layer.
- Boho is a custom SHA-256-based protocol. Do not assume standard AEAD/TLS guarantees or forward secrecy protecting past traffic after a long-term key leak.
