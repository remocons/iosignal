# 시그널 태그와 직접 메시지

[README](https://github.com/remocons/iosignal/blob/main/README.ko.md) | [English](https://github.com/remocons/iosignal/blob/main/docs/messaging.md) | [한국어](https://github.com/remocons/iosignal/blob/main/docs/messaging.ko.md)

## 시그널 태그 요약

| 통신 방식 | 송신 | 구독 | 수신 tag |
| --- | --- | --- | --- |
| 채널 | `room#topic` | `room#topic` | `room#topic` |
| 홈채널 | `#topic` | `#topic` | `#topic` |
| B에게 직접 송신 | `B@topic` | 불필요 | `@topic` |
| A의 CID 발행 | A가 `@topic` 송신 | `A@topic` | `A@topic` |

리테인 발행은 `room#$state`나 `@$state`처럼 `$`를 포함한 태그를 사용합니다.
보관 정책과 제한은 서버·서비스 설정 및 인증 유형에 따라 달라집니다.
자세한 내용은 [시그널 태그](https://iosignal.net/docs/core/signal_tags)와
[시그널 유형](https://iosignal.net/docs/core/signal_types)을 참고하세요.

**특수문자 사용 권고:** 특수문자로 시작하는 태그는 특수기능 용도로 사용될 수 있습니다.
일반 용도의 태그는 문자나 숫자로 시작하고, `#`, `@` 등 문서에 정의된 특수문자는 명시된 위치와 용법에 따라 사용하세요.
`$aaaa`, `/bbb`처럼 사용법이 명시되지 않은 특수문자로 시작하는 태그는 사용하지 않는 것을 권장합니다.
사용법이 정의되지 않은 특수문자는 태그 내부에서도 사용하지 않는 것을 권장합니다.
이 권고는 새로운 오류 처리나 입력 제한을 추가하지 않으며, 기존 태그 처리 규칙은 그대로 적용됩니다.

## 직접 메시지 수신

7.2.0부터 `B@topic`으로 보낸 직접 메시지는 B에서 `@`와 `@topic` 이벤트를
모두 발생시킵니다. 두 이벤트 이름 모두 `on()`과 `listen()`에 사용할 수 있습니다.

| 이벤트 이름 | `on()` | `listen()` | 수신 범위 |
| --- | --- | --- | --- |
| `@` | `io.on('@', handler)` | `io.listen('@', handler)` | 모든 직접 메시지 |
| `@topic` | `io.on('@topic', handler)` | `io.listen('@topic', handler)` | 정확히 일치하는 토픽의 직접 메시지 |

```js
function handler(tag, ...args) {
  console.log(tag, ...args);
}

// 이 핸들러의 등록 방식 중 하나를 선택합니다.
io.on('@topic', handler);
// io.listen('@topic', handler);
// io.on('@', handler);
// io.listen('@', handler);
```

두 이벤트의 인자는 모두 `(tag, ...args)`이며, `tag`에서 수신자 CID가 제거됩니다.
`@`를 먼저 발생시키고 정확한 토픽 이벤트를 뒤에 발생시킵니다. `B@`처럼 토픽이
없으면 `@`를 한 번만 발생시킵니다. 직접 메시지는 `message` 이벤트에 전달하지 않습니다.

`listen()`을 사용하는 경우에도 직접 수신용 서버 구독은 필요하지 않습니다.
`subscribe('@topic')`와 `unsubscribe('@topic')`는 `TypeError`를 발생시키며,
`on()` 또는 `listen()`으로 등록한 핸들러는 `off(eventName, handler)`로 해제합니다.
두 이벤트에 같은 업무를 등록하거나 `@`에서 `emit(tag, ...)`로 수동 전달하면
중복 처리될 수 있습니다.
