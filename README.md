# iosignal

[English](https://github.com/remocons/iosignal/blob/main/README.md) | [한국어](https://github.com/remocons/iosignal/blob/main/README.ko.md)

A real-time messaging library for Node.js and browsers, providing WebSocket
client–server communication, tag-based publish/subscribe and RPC services.
Node.js also supports TCP through `IOCongSocket`.

<p align="center">
  <img src="https://raw.githubusercontent.com/remocons/iosignal/main/docs/assets/iosignal-ecosystem.png" alt="Server, CLI, Node.js, Arduino and remote web apps connected through IOSignal" width="720" />
</p>

## Documentation and supported environments

The [official documentation](https://iosignal.net/) covers installation, messaging
concepts and platform guides in Korean. Follow the
[five-minute quick start](https://iosignal.net/docs/start/quickstart/) for an overview,
and use the quick start below for examples targeting the current version.

| Environment / tool | Support | Package / examples |
| --- | --- | --- |
| Node.js | WebSocket/TCP servers and clients, publish/subscribe, RPC | This repository · [npm](https://www.npmjs.com/package/iosignal) |
| Browsers | WebSocket clients and web app integration | `iosignal/io` · [examples](https://github.com/remocons/iosignal-examples) |
| Arduino | Device communication with servers and web apps, authentication and encryption | [iosignal-arduino](https://github.com/remocons/iosignal-arduino) |
| CLI | Run servers and clients and test messaging in a terminal | [iosignal-cli](https://github.com/remocons/iosignal-cli) |

Try messaging in the [browser communication workbench](https://test.iosignal.net/).

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

See the [messaging guide](https://github.com/remocons/iosignal/blob/main/docs/messaging.md) for tag rules and direct-message handling.

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

## Arduino support

[iosignal-arduino](https://github.com/remocons/iosignal-arduino) provides an Arduino
client and examples for boards including ESP32 and ESP8266. Install the library
and its Boho and Crypto dependencies, then configure the network and server in
an example for your board. See the [official Arduino guide](https://iosignal.net/docs/arduino)
and [library README](https://github.com/remocons/iosignal-arduino/blob/main/README.en.md)
for setup and connection instructions.

## CLI support

[iosignal-cli](https://github.com/remocons/iosignal-cli) runs a server or an
interactive client without writing application code. Requires Node.js 22.16.0 or later.

```bash
npm install -g iosignal-cli
io-server -l 8080
```

Connect from another terminal. If the JavaScript server above is already running,
run only the client:

```bash
io-client -c ws://localhost:8080
```

Enter `help`, `sub room` and `pub room hello` in the client to explore messaging.
To also test Arduino over TCP, start the server with
`io-server -l 8080 -L 8888` and connect the device to TCP port 8888.
See the [CLI README](https://github.com/remocons/iosignal-cli/blob/main/README.en.md)
for more options.

## Main APIs

| API | Purpose |
| --- | --- |
| `Server` | Create a WebSocket/TCP server |
| `IO` | Node.js WebSocket client; the browser client when imported from `iosignal/io` |
| `IOCongSocket` | Node.js TCP client |
| `server.attach(name, service)` | Register an RPC service |
| `io.call(service, command, ...args)` | Make an RPC request |
| `io.subscribe(tag)` / `io.unsubscribe(tag)` | Subscribe / unsubscribe |
| `io.signal(tag, ...args)` | Publish or send a direct message |
| `io.on(tag, handler)` | Register an event handler |
| `io.listen(tag, handler)` | Register a handler; remember subscriptions for non-direct tags |
| `io.ping()` | Ping the server; receive the protocol `pong` event |
| `io.stop()` | Stop automatic reconnection and clean up the connection |
| `server.close(callback)` | Shut down the server |
| `BohoAuth` | Server authentication manager |
| `StringKeyProvider`, `FileKeyProvider`, `RedisKeyProvider` | Authentication key providers |

## Authentication and encryption

[Boho](https://github.com/remocons/boho) provides shared-key authentication and
message encryption for JavaScript and Arduino. End-to-end encryption (E2E) uses
a separate data key shared only by the final endpoints. See the
[Boho technical guide](https://github.com/remocons/iosignal/blob/main/docs/boho.md) for key management, the relationship
with TLS, session validation and implementation conditions.

## Detailed guides

- [Signal tags and direct messages](https://github.com/remocons/iosignal/blob/main/docs/messaging.md)
- [Server ping and peer ping](https://github.com/remocons/iosignal/blob/main/docs/ping.md)
- [Boho authentication, encryption and E2E](https://github.com/remocons/iosignal/blob/main/docs/boho.md)
- [Building and verification](https://github.com/remocons/iosignal/blob/main/docs/development.md)

## License

Package license: MIT.
