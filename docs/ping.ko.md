# 서버 ping

[README](https://github.com/remocons/iosignal/blob/main/README.ko.md) | [English](https://github.com/remocons/iosignal/blob/main/docs/ping.md) | [한국어](https://github.com/remocons/iosignal/blob/main/docs/ping.ko.md)

`io.ping()`은 서버에 프로토콜 PING을 전송합니다. 서버는 프로토콜 PONG으로
응답하고 클라이언트는 `pong` 이벤트를 발생시킵니다. 핸들러를 먼저 등록하고
연결이 ready인 상태에서 `ping()`을 호출하세요.

```js
io.on('pong', () => console.log('서버 PONG'));
io.ping();
```

WebSocket 자체 heartbeat 프레임은 별개입니다.

앱 태그 `@pong`을 직접 메시지로 받아도 프로토콜 `pong` 이벤트는 발생하지 않습니다.
두 기기 사이의 응답은 직접 메시지(`<cid>@topic`)로 앱이 정한 방식으로 확인하세요.
직접 메시지에는 서버가 확인한 송신자 정보가 붙지 않으므로, 메시지 내용에 적힌 CID로 자동 응답하지 마세요.
예전 문서의 peer ping(`@ping`/`@pong`) 관례와 Arduino `peer_ping_pong` 예제,
CLI의 `ping <cid>`는 2026-11-16에 없앴습니다.
