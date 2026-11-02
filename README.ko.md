# iosignal

[English](https://github.com/remocons/iosignal/blob/main/README.md) | [한국어](https://github.com/remocons/iosignal/blob/main/README.ko.md)

Node.js와 브라우저를 위한 실시간 메시징 라이브러리입니다. WebSocket 기반
클라이언트·서버 통신, 태그 기반 발행/구독, RPC 서비스를 제공합니다.
Node.js에서는 TCP 기반 `IOCongSocket`도 사용할 수 있습니다.

<p align="center">
  <img src="https://raw.githubusercontent.com/remocons/iosignal/main/docs/assets/iosignal-ecosystem.png" alt="IOSignal로 연결되는 서버, CLI, Node.js, Arduino와 원격 제어 웹앱" width="720" />
</p>

## 문서와 지원 환경

[공식 문서](https://iosignal.net/)에서 설치, 메시징 개념과 환경별 가이드를 확인할 수 있습니다.
[5분 빠른 시작](https://iosignal.net/docs/start/quickstart/)으로 전체 흐름을 익히고,
현재 버전의 실행 예제는 아래 빠른 시작을 참고하세요.

| 환경 / 도구 | 지원 내용 | 패키지 / 예제 |
| --- | --- | --- |
| Node.js | WebSocket·TCP 서버와 클라이언트, 발행/구독, RPC | 이 저장소 · [npm](https://www.npmjs.com/package/iosignal) |
| 브라우저 | WebSocket 클라이언트, 웹앱 연동 | `iosignal/io` · [예제](https://github.com/remocons/iosignal-examples) |
| Arduino | 장치와 서버·웹앱 간 통신, 인증과 암호화 | [iosignal-arduino](https://github.com/remocons/iosignal-arduino) |
| CLI | 터미널에서 서버·클라이언트 실행과 통신 시험 | [iosignal-cli](https://github.com/remocons/iosignal-cli) |

[브라우저 통신 워크벤치](https://test.iosignal.net/)에서도 통신을 시험할 수 있습니다.

## 설치

```bash
npm install iosignal
```

아래 Node.js 예제는 ESM 형식입니다. `.mjs` 파일로 저장하거나 프로젝트의
`package.json`에 `"type": "module"`을 설정하세요.

## 빠른 시작

### 서버

다음을 `server.mjs`로 저장하고 `node server.mjs`로 실행합니다.

```js
import { Server, replyService } from 'iosignal';

const server = new Server({ port: 8080 });
server.attach('reply', replyService);

server.on('ready', () => {
  console.log(`Listening on port ${server.port}`);
});

process.once('SIGINT', () => server.close());
```

이 예제는 인증 없는 로컬 개발용 서버입니다.

### Node.js 클라이언트

서버 실행 후 다음을 `client.mjs`로 저장하고 `node client.mjs`로 실행합니다.

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

CommonJS에서도 공개 API를 사용할 수 있습니다.

```js
const { IO, Server, replyService } = require('iosignal');
```

## 발행과 구독

연결이 준비되면 `subscribe()`로 태그를 구독하고 `signal()`로 메시지를 보냅니다.
다음 클라이언트는 메시지를 계속 수신합니다.

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

`signal(tag, ...args)`는 문자열, 바이너리, 객체 및 여러 인자를 지원합니다.
`unsubscribe(tag)`로 구독을 해제할 수 있습니다.

태그 규칙과 직접 메시지 수신 방법은 [메시징 가이드](https://github.com/remocons/iosignal/blob/main/docs/messaging.ko.md)를 참고하세요.

## 브라우저

번들러를 사용하는 브라우저 프로젝트에서는 브라우저 전용 진입점을 가져옵니다.

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

브라우저 예제도 위 서버에 연결합니다. HTTPS 페이지에서는 TLS가 구성된
`wss://` 서버 주소를 사용하세요. 사용이 끝나면 `io.stop()`으로 연결과 자동 재연결을 중단합니다.

## Arduino 지원

[iosignal-arduino](https://github.com/remocons/iosignal-arduino)는 Arduino 클라이언트와
ESP32·ESP8266 등의 예제를 제공합니다. 라이브러리와 Boho·Crypto 의존성을 설치하고,
보드에 맞는 예제에서 네트워크·서버 설정을 변경해 사용하세요.
설치와 연결 방법은 [Arduino 공식 가이드](https://iosignal.net/docs/arduino)와
[라이브러리 README](https://github.com/remocons/iosignal-arduino#readme)를 참고하세요.

## CLI 지원

[iosignal-cli](https://github.com/remocons/iosignal-cli)로 코드 작성 없이 서버와
대화형 클라이언트를 실행할 수 있습니다. Node.js 22.16.0 이상이 필요합니다.

```bash
npm install -g iosignal-cli
io-server -l 8080
```

다른 터미널에서 위 서버에 연결합니다. 앞의 JavaScript 서버가 실행 중이면
서버를 추가로 실행하지 않고 클라이언트만 연결하세요.

```bash
io-client -c ws://localhost:8080
```

클라이언트에서 `help`, `sub room`, `pub room hello`를 입력해 사용법과 통신을
확인할 수 있습니다. Arduino와 TCP 통신도 함께 시험하려면 서버 실행 시
`io-server -l 8080 -L 8888`로 두 포트를 열고 장치를 TCP 포트 8888에 연결하세요.
자세한 옵션은 [CLI README](https://github.com/remocons/iosignal-cli#readme)를 참고하세요.

## 주요 API

| API | 용도 |
| --- | --- |
| `Server` | WebSocket/TCP 서버 생성 |
| `IO` | Node.js WebSocket 클라이언트; `iosignal/io`에서는 브라우저 클라이언트 |
| `IOCongSocket` | Node.js TCP 클라이언트 |
| `server.attach(name, service)` | RPC 서비스 등록 |
| `io.call(service, command, ...args)` | RPC 요청 |
| `io.subscribe(tag)` / `io.unsubscribe(tag)` | 태그 구독 / 해제 |
| `io.signal(tag, ...args)` | 메시지 발행 또는 직접 송신 |
| `io.on(tag, handler)` | 이벤트 핸들러 등록 |
| `io.listen(tag, handler)` | 핸들러 등록; 직접 태그 이외에는 자동 구독 설정 |
| `io.ping()` | 서버 ping; 프로토콜 `pong` 이벤트로 응답 수신 |
| `io.stop()` | 자동 재연결 중단 및 연결 정리 |
| `server.close(callback)` | 서버 종료 |
| `BohoAuth` | 서버 인증 관리자 |
| `StringKeyProvider`, `FileKeyProvider`, `RedisKeyProvider` | 인증 키 공급자 |
| `LocalKeyProvider` | 로컬 테스트용 키 목록 없는 로그인 (`localAuth` 서버 옵션) |
| `ROLES`, `hasRole(remote, role)` | 서비스 권한 검사용 연결 역할 |
| `server.stats()` | 연결·채널·retain·트래픽 집계 |

## 인증과 암호화

[Boho](https://github.com/remocons/boho)는 JavaScript와 Arduino에서 공유 키 인증과
메시지 암호화를 제공합니다. 종단간 암호화(E2E)는 최종 송수신자만 공유하는 별도
데이터 키로 설정합니다. 키 관리, TLS와의 관계, 세션 검증 및 구현의 적용 조건은
[Boho 기술 가이드](https://github.com/remocons/iosignal/blob/main/docs/boho.ko.md)를 참고하세요.

로컬 테스트에서는 `localAuth` 서버 옵션으로 키 목록 없이 인증을 켤 수 있습니다.
로그인 ID가 CID가 됩니다. 규칙을 아는 누구나 임의 ID로 로그인할 수 있으므로
신뢰하는 로컬 네트워크에서만 사용하세요. 8.1.0부터 지원합니다.

```js
new Server({ port: 7777, localAuth: 'idKey' })                                // io.auth('dev1', 'dev1')
new Server({ port: 7777, localAuth: { mode: 'sharedKey', key: 'lab2026' } })  // io.auth('dev1', 'lab2026')
```

익명 연결의 시그널을 막으려면 `membersOnly: true`를 함께 지정합니다.
[로컬 테스트 로그인](https://github.com/remocons/iosignal/blob/main/docs/boho.ko.md#로컬-테스트-로그인-localauth)을 참고하세요.

## 역할과 쿼터

연결의 **역할**은 무엇을 할 수 있는지, **쿼터 프로필**은 얼마나 보낼 수 있는지를 정합니다.
둘은 서로 독립입니다.

- 역할(낮은 것부터): `anonymous`(미로그인), `device`(로그인 기본값), `service`, `admin`.
  키 항목 `id.key.cid[.role[.quota]]`로 지정합니다. 예: `'dev1.k1.dev1'`, `'cli.k2.cli.admin'`.
  서비스는 `hasRole(remote, 'admin')`으로 검사합니다. `sudoService`는 `admin`이 필요하고,
  `RedisService(client, minRole)`의 기본값은 `service`입니다.
- 쿼터 프로필은 `quotas` 서버 옵션에 이름으로 정의한 제한 묶음입니다.
  `maxMessageBytes`, `fanout`(발행 한 건이 전달되는 구독자 수), `msgPerSec`, `bytesPerSec`,
  계정별 `maxConnections`를 지정하며 `null`은 무제한입니다. 서버가 항상 적용합니다.
  미로그인 연결은 `anonymousQuota`를, 로그인은 키 항목의 quota 또는
  `BohoAuth`의 `resolveQuota(authInfo, role)` 옵션 결과를 사용합니다.
- 내장 프로필(`serverOption.quotas`의 `anonymous`, `basic`, `pro`, `unlimited`)은 운영자가
  조정하기 위한 시작값이며 보장된 값이 아닙니다. 클라이언트는 `ready` 이후
  `io.quota.maxMessageBytes`를 읽습니다.

```js
const server = new Server({
  port: 7777,
  quotas: { anonymous: { maxMessageBytes: 64 * 1024 }, basic: { fanout: 200 } },
  anonymousQuota: 'anonymous'
}, new BohoAuth(new StringKeyProvider('dev1.k1.dev1,cli.k2.cli.admin')));
```

## 8.x에서 업그레이드

9.0은 쿼터 레벨 표를 없애고 설정을 호환 계층 없이 바꿨습니다.
옛 설정 이름을 쓰면 대신 쓸 이름을 알려주는 오류가 발생합니다.

- 키 항목은 레벨 대신 역할과 쿼터 이름을 씁니다. `id.key.cid.255`는 `id.key.cid.admin`,
  `id.key.cid.3`은 `id.key.cid`가 됩니다. `addAuth(id, key, cid, role, quota)`와 파일 항목
  `[id, key, cid, role, quota]`도 같은 순서입니다. 레벨은 더 이상 읽지 않습니다.
- 삭제: `quotaTable`, `serverOption.useQuota`, `defaultQuotaIndex`, `adminLevel`,
  `remote.level`, `io.level`, `QUOTA_LEVEL` 메시지, `RedisService`의 `minLevel`/`requireAuth` 인자.
- 모든 설정은 서버별이며 `serverOption`은 서버가 바꾸지 않는 기본값만 담습니다.
  이름 변경: `timeout` → `heartbeatInterval`, `pingTimeoutGrace` → `heartbeatGrace`,
  `retain.isAvailable` → `retain.enabled`, `auth.delay_auth_fail` → `auth.failDelay`.
  `showMessage`, `showMetric`, `monitorPeriod`는 삭제했으며 `logMessages`, `logStats`,
  `server.stats()`를 사용합니다.
- 새 서버 옵션: `maxPayload`, `maxBufferedBytes`, `trustProxy`, 서버별 `membersOnly`·
  `duplicateLogin`, `retain`의 소유자별 저장 예산.
- 쿼터는 새 `QUOTA` 메시지로 전달됩니다. 이전 클라이언트는 이를 무시하고 기존
  로컬 크기 제한을 유지합니다.

## 상세 문서

- [시그널 태그와 직접 메시지](https://github.com/remocons/iosignal/blob/main/docs/messaging.ko.md)
- [서버 ping과 peer ping](https://github.com/remocons/iosignal/blob/main/docs/ping.ko.md)
- [Boho 인증·암호화와 E2E](https://github.com/remocons/iosignal/blob/main/docs/boho.ko.md)
- [소스 빌드 및 검증](https://github.com/remocons/iosignal/blob/main/docs/development.ko.md)

## 라이선스

패키지 라이선스: MIT.
