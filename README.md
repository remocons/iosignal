# iosignal

[English](README.md) | [한국어](README.ko.md)

A real-time messaging library for Node.js and browsers, providing WebSocket
client–server communication, tag-based publish/subscribe and RPC services.
Node.js also supports TCP through `IOCongSocket`.

## Installation

```bash
npm install iosignal
```

The Node.js examples below use ESM. Save them as `.mjs` files or set
`"type": "module"` in your project's `package.json`.

## Quick start

### Server

Save the following as `server.mjs` and run `node server.mjs`.

```js
import { Server, replyService } from 'iosignal';

const server = new Server({ port: 8080 });
server.attach('reply', replyService);

server.on('ready', () => {
  console.log(`Listening on port ${server.port}`);
});

process.once('SIGINT', () => server.close());
```

This is a local development server without authentication.

### Node.js client

After starting the server, save the following as `client.mjs` and run
`node client.mjs`.

```js
import { IO } from 'iosignal';

const io = new IO('ws://localhost:8080');
io.on('error', console.error);

io.on('ready', async () => {
  try {
    const response = await io.call('reply', 'echo', 'Hello, iosignal!');
    console.log(response.body);
  } catch (error) {
    console.error(error);
  } finally {
    io.stop();
  }
});
```

The public API is also available from CommonJS.

```js
const { IO, Server, replyService } = require('iosignal');
```

## Publish and subscribe

Once connected, use `subscribe()` to subscribe to a tag and `signal()` to send
messages. The following client keeps receiving messages.

```js
import { IO } from 'iosignal';

const io = new IO('ws://localhost:8080');
io.on('error', console.error);
io.on('message', (tag, message) => {
  console.log(tag, message);
});
io.on('ready', () => {
  io.subscribe('room');
  io.signal('room', 'Hello, subscribers!');
});

process.once('SIGINT', () => io.stop());
```

`signal(tag, ...args)` supports strings, binary data, objects and multiple
arguments. Use `unsubscribe(tag)` to unsubscribe.

## Browsers

For browser projects using a bundler, import the browser-specific entry point.

```js
import IO from 'iosignal/io';

const io = new IO('ws://localhost:8080');
io.on('error', console.error);
io.on('message', (tag, message) => console.log(tag, message));
io.on('ready', () => {
  io.subscribe('room');
  io.signal('room', 'Hello from the browser!');
});
```

This browser example connects to the same server above. From an HTTPS page,
use a `wss://` server URL with TLS configured. When finished, call `io.stop()`
to close the connection and stop automatic reconnection.

## Main APIs

| API | Purpose |
| --- | --- |
| `Server` | Create a WebSocket/TCP server |
| `IO` | Node.js WebSocket client; the browser client when imported from `iosignal/io` |
| `IOCongSocket` | Node.js TCP client |
| `server.attach(name, service)` | Register an RPC service |
| `io.call(service, command, ...args)` | Make an RPC request |
| `io.subscribe(tag)` / `io.unsubscribe(tag)` | Subscribe / unsubscribe |
| `io.signal(tag, ...args)` | Publish a message |
| `io.stop()` | Stop automatic reconnection and clean up the connection |
| `server.close(callback)` | Shut down the server |
| `BohoAuth` | Server authentication manager |
| `StringKeyProvider`, `FileKeyProvider`, `RedisKeyProvider` | Authentication key providers |

## Authentication and encrypted communication with Boho

IOSignal uses [Boho](https://github.com/remocons/boho) for shared-key authentication
and message encryption. Boho has an
[Arduino implementation](https://github.com/remocons/boho-arduino) and a JavaScript
implementation for Node.js and browsers, allowing DIY devices and web apps to use
the same approach.

### Why shared-key Boho?

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

### XOR and a hash-based “virtual OTP”

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

### Understanding the relationship with TLS

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

### Connection encryption and E2E data keys

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
quick-start examples above do not enable Boho authentication/encryption.

Normal web deployments can serve app code over HTTPS and connect over WSS while
also applying E2E to message bodies. Modified app code can expose keys and
plaintext, so E2E still requires trust in the app code provider. Boho does not
bypass browser mixed content rules.

### Conditions in the current implementation

- Use sufficiently random keys. A single SHA-256 in `set_key` is not a slow password KDF.
- JavaScript uses `crypto.getRandomValues()`, but current Arduino standalone-packet nonces and the authentication client nonce use `micros()`. This is not cryptographic randomness; consider repeated key/`salt12` combinations across restarts, devices and communication directions.
- Boho itself does not enforce replay rejection or challenge expiry. A valid tag alone does not establish freshness or permission to execute a command; check receive policies in the caller and application layer.
- Boho is a custom SHA-256-based protocol. Do not assume standard AEAD/TLS guarantees or forward secrecy protecting past traffic after a long-term key leak.

## Building and verification

This repository uses Node.js 22 and npm 10 for development and verification.

```bash
npm ci
npm run verify
```

`verify` checks the public-file policy, removes `dist` and rebuilds bundles and
type declarations. It then runs automated tests and checks the npm package file
list.

Use `npm run build` to build only, or `npm test` to test an existing build.

### Automated communication tests

```bash
npm run build
npm run test:integration
```

`test/integration/` tests actual WebSocket communication for both public ESM and
CommonJS builds. It uses temporary ports on local loopback (`127.0.0.1`), so it
requires no external server, Redis instance or real authentication credentials.

- Connections, RPC responses, unknown commands and permission denial
- String, object and binary publish/subscribe between two clients, including unsubscribe
- Successful authentication and encrypted RPC responses, plus rejection of invalid authentication
- Client reuse and server resource cleanup after disconnection

These communication checks are included in `npm test` and `npm run verify`.
Individual tests and test files have time limits, and connections and servers
are cleaned up on completion. Actual browsers, TLS, TCP transport and Redis
integration are outside their scope.

Existing `test/attach-services/`, `test/auth_server_client/`,
`test/pubsub-counter/` and `test/subscribe-signal/` are manual examples. They are
not run automatically, and some require a separate server or Redis.

## License

Package license: MIT.
