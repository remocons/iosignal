# 서버 ping과 peer ping

[README](https://github.com/remocons/iosignal/blob/main/README.ko.md) | [English](https://github.com/remocons/iosignal/blob/main/docs/ping.md) | [한국어](https://github.com/remocons/iosignal/blob/main/docs/ping.ko.md)

`io.ping()`은 서버에 프로토콜 PING을 전송합니다. 서버는 프로토콜 PONG으로
응답하고 클라이언트는 `pong` 이벤트를 발생시킵니다. 핸들러를 먼저 등록하고
연결이 ready인 상태에서 `ping()`을 호출하세요.

```js
io.on('pong', () => console.log('서버 PONG'));
io.ping();
```

WebSocket 자체 heartbeat 프레임은 별개입니다.

Peer ping은 일반 직접 시그널을 사용하며, **TEXT 인자 하나**에 송신자 CID를
담습니다. 송신 전에 응용 프로그램의 응답 핸들러를 등록하세요.

```js
io.on('@ping', (tag, senderCid) => {
  io.signal(`${senderCid}@pong`, io.cid);
});
io.listen('@pong', (tag, senderCid) => {
  console.log(`Peer pong (${senderCid})`);
});

// 연결이 ready인 상태에서 상대의 실제 CID를 사용합니다.
io.signal(`${targetCid}@ping`, io.cid);
```

두 peer 핸들러 모두 서버 구독 없이 `on()` 또는 `listen()`으로 등록할 수 있습니다.
`@` 핸들러에서 `tag` 인자로 `@ping`과 `@pong`을 구분하는 방식도 가능합니다.
중복 응답을 피하려면 처리 방식 하나를 선택하세요. Peer 응답은 프로토콜 `pong`
이벤트를 발생시키지 않습니다. CLI는 peer 응답을 구현하며, Arduino의
`peer_ping_pong` 예제는 사용자 코드에서 응답을 구현합니다.


[관련 예제: Arduino peer_ping_pong](https://github.com/remocons/iosignal-arduino/tree/main/examples/peer_ping_pong)
