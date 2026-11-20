# Server ping

[README](https://github.com/remocons/iosignal/blob/main/README.md) | [English](https://github.com/remocons/iosignal/blob/main/docs/ping.md) | [한국어](https://github.com/remocons/iosignal/blob/main/docs/ping.ko.md)

`io.ping()` sends a protocol PING to the server. The server replies with a
protocol PONG and the client emits `pong`. Register the handler before sending
and call `ping()` after the connection is ready:

```js
io.on('pong', () => console.log('Server PONG'));
io.ping();
```

To measure the round trip, use `pingServer()` (9.23). It resolves with the
milliseconds until a PONG and rejects with an error code: `NOT_READY`, `BUSY`
(one measurement at a time), `TIMEOUT` or `CONNECTION_CLOSED`:

```js
const ms = await io.pingServer({ timeoutMs: 3000 });
```

Native WebSocket heartbeat frames remain separate.

An application `@pong` tag received as a direct message never emits the
protocol `pong` event. Check a round trip between two devices with direct
messages (`<cid>@topic`) your application defines. A direct message carries no
sender verified by the server, so do not reply automatically to a CID written in
the message. The earlier peer ping
convention (`@ping`/`@pong`), the Arduino `peer_ping_pong` example and the CLI
`ping <cid>` were removed on 2026-11-16.
