# Server ping and peer ping

[README](https://github.com/remocons/iosignal/blob/main/README.md) | [English](https://github.com/remocons/iosignal/blob/main/docs/ping.md) | [한국어](https://github.com/remocons/iosignal/blob/main/docs/ping.ko.md)

`io.ping()` sends a protocol PING to the server. The server replies with a
protocol PONG and the client emits `pong`. Register the handler before sending
and call `ping()` after the connection is ready:

```js
io.on('pong', () => console.log('Server PONG'));
io.ping();
```

Native WebSocket heartbeat frames remain separate.

Peer ping uses ordinary direct signals, with **one TEXT argument** carrying the
sender CID. Register an application responder before sending:

```js
io.on('@ping', (tag, senderCid) => {
  io.signal(`${senderCid}@pong`, io.cid);
});
io.listen('@pong', (tag, senderCid) => {
  console.log(`Peer pong (${senderCid})`);
});

// Send after the connection is ready, using the peer's actual CID.
io.signal(`${targetCid}@ping`, io.cid);
```

Both peer handlers can use `on()` or `listen()` without subscribing. An `@`
handler can also receive and distinguish `@ping` and `@pong` by the `tag`
argument; choose one handling approach to avoid duplicate replies.
Peer responses do not emit the protocol `pong` event. CLI clients implement
replies, and Arduino's `peer_ping_pong` example implements them in user code.


[Related example: Arduino peer_ping_pong](https://github.com/remocons/iosignal-arduino/tree/main/examples/peer_ping_pong)
