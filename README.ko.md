# iosignal

[English](README.md) | [한국어](README.ko.md)

Node.js와 브라우저를 위한 실시간 메시징 라이브러리입니다. WebSocket 기반
클라이언트·서버 통신, 태그 기반 발행/구독, RPC 서비스를 제공합니다.
Node.js에서는 TCP 기반 `IOCongSocket`도 사용할 수 있습니다.

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

### 시그널 태그 요약

| 통신 방식 | 송신 | 구독 | 수신 tag |
| --- | --- | --- | --- |
| 채널 | `room#topic` | `room#topic` | `room#topic` |
| 홈채널 | `#topic` | `#topic` | `#topic` |
| B에게 직접 송신 | `B@topic` | 불필요 | `@topic` |
| A의 CID 발행 | A가 `@topic` 송신 | `A@topic` | `A@topic` |

직접 시그널은 `on('message', ...)`가 아닌 `on('@', ...)`로 받습니다.

```js
io.on('@', (tag, ...args) => {
  if (tag === '@topic') console.log(...args);
});
```

리테인 발행은 `room#$state`나 `@$state`처럼 `$`를 포함한 태그를 사용합니다.
보관 정책과 제한은 서버·서비스 설정 및 인증 유형에 따라 달라집니다.
자세한 내용은 [시그널 태그](https://iosignal.net/docs/core/signal_tags)와
[시그널 유형](https://iosignal.net/docs/core/signal_types)을 참고하세요.

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

## 주요 API

| API | 용도 |
| --- | --- |
| `Server` | WebSocket/TCP 서버 생성 |
| `IO` | Node.js WebSocket 클라이언트; `iosignal/io`에서는 브라우저 클라이언트 |
| `IOCongSocket` | Node.js TCP 클라이언트 |
| `server.attach(name, service)` | RPC 서비스 등록 |
| `io.call(service, command, ...args)` | RPC 요청 |
| `io.subscribe(tag)` / `io.unsubscribe(tag)` | 태그 구독 / 해제 |
| `io.signal(tag, ...args)` | 메시지 발행 |
| `io.stop()` | 자동 재연결 중단 및 연결 정리 |
| `server.close(callback)` | 서버 종료 |
| `BohoAuth` | 서버 인증 관리자 |
| `StringKeyProvider`, `FileKeyProvider`, `RedisKeyProvider` | 인증 키 공급자 |

## boho를 이용한 인증과 암호통신

IOSignal은 [boho](https://github.com/remocons/boho)를 사용하여 공유 키 기반
인증과 메시지 암호화를 제공합니다. boho에는
[Arduino 구현](https://github.com/remocons/boho-arduino)과 Node.js·브라우저용
JavaScript 구현이 있어, 직접 만든 장치와 웹앱을 같은 방식으로 연결할 수 있습니다.

### 왜 공유 키 기반의 boho인가요?

Arduino 장치와 직접 개발한 웹앱, 관리 주체가 같은 서버에서는 양쪽 코드와
최초 키 설정을 직접 관리할 수 있습니다. 제작 시 USB·직렬 연결로 장치별 키를
기록하거나, 웹앱 사용자가 별도 경로로 받은 키를 입력하거나, 서버 사이에서
기존 SSH·TLS 연결로 키를 배포할 수 있습니다.

이처럼 안전한 키 설정 경로가 이미 있다면 사전 공유 대칭키로도 인증과 암호통신을
설계할 수 있습니다. 인증기관 없이 통신할 상대를 정할 수 있으며, 이때 신뢰의
기반은 키 설정 경로와 양쪽 프로그램입니다. 장치별 키, 안전한 보관과 교체·폐기
방법은 여전히 필요합니다. 웹앱의 공개 JavaScript 번들에 공통 비밀 키를 넣는
것은 안전한 키 배포가 아닙니다.

boho는 이 환경을 위해 SHA-256 기반 키스트림, XOR 암호화, 공유 키 인증과
바이너리 패킷을 묶습니다. 차별점은 암호 연산 자체의 새로움보다 **Arduino와
JavaScript의 호환 구현을 IOSignal의 연결·메시지 전달에 활용할 수 있다는 점**입니다.

### XOR와 해시 기반 ‘가상 OTP’

XOR는 같은 값으로 두 번 연산하면 원래 값으로 돌아오는 단순한 연산입니다.

```text
암호화: 암호문 = 평문 XOR 키스트림
복호화: 평문   = 암호문 XOR 키스트림
```

진짜 일회용 패드(One-Time Pad, OTP)는 평문과 독립적인 완전한 무작위 패드를
데이터 길이만큼 준비하고, 비밀로 유지하며 한 번만 사용합니다. 이 조건에서는
완전한 비밀성을 얻지만, 1MB 데이터마다 새로운 1MB 비밀 패드를 양쪽에 공급해야
합니다. 같은 패드를 재사용하면 `C1 XOR C2 = P1 XOR P2`로 평문 사이의 관계가
노출됩니다.

boho는 데이터 길이만큼 패드를 저장하는 대신, 비밀 키와 메시지별 값에서
SHA-256으로 키스트림을 생성합니다. 일반적인 `set_key` 경로는 다음과 같습니다.

```text
K   = SHA256(입력 키)
B   = SHA256(K || salt12)
S_i = SHA256(B || LE32(i))       // i = 1, 2, 3, …
키스트림 = S_1 || S_2 || …      // 평문 길이만큼 사용
```

`||`는 바이트열 연결이고, `LE32`는 4바이트 little-endian 정수입니다.
각 해시 출력은 32바이트입니다. `salt12`는 시각·카운터·nonce로 구성되며,
수신자도 같은 값과 키를 사용해 키스트림을 재현합니다.

‘가상 OTP’는 이 의사난수 키스트림을 설명하는 표현이며 진짜 OTP의 완전한
비밀성을 뜻하지 않습니다. **공개된 랜덤 값만 해시하면 누구나 같은 출력을
계산할 수 있으므로 공유 비밀 키가 필요합니다.** 같은 키와 `salt12`의 중복도
피해야 합니다. XOR만으로 변조를 검출할 수 없어 boho는 데이터 패킷에
`SHA256(K || salt12 || 평문)`의 앞 8바이트로 계산한 태그도 포함합니다.
이 태그는 기존 코드의 명칭과 달리 표준 HMAC이 아닙니다.

### TLS와 함께 이해하기

일반적인 인증서 기반 TLS는 사전에 비밀을 공유하지 않은 상대와 인증·키 합의를
수행하고 실제 데이터에는 대칭키를 사용합니다. 로그인하지 않은 웹 사용자도
서버를 인증하고 암호화 연결을 만들 수 있지만, 네트워크 익명성을 제공하는 것은
아닙니다. 임베디드 환경에서는 인증서·신뢰 루트·시각·갱신 관리와 핸드셰이크
연산 및 버퍼가 부담이 될 수 있습니다. 키 설정 경로가 이미 있는 작은 시스템은
이런 구성 중 일부를 줄일 수 있습니다.

다만 TLS도 **PSK-only와 PSK+(EC)DHE**를 지원하므로 항상 제3자 인증서나 공개키
교환이 필요한 것은 아닙니다.
[TLS 1.3의 PSK 방식](https://www.rfc-editor.org/rfc/rfc8446.html#section-2.2)
boho가 모든 환경에서 TLS나 표준 대칭키 구현보다 빠르거나 메모리를 덜 사용한다는
뜻은 아니며 실제 비교에는 측정이 필요합니다.

### 연결 암호화와 E2E 데이터 키

```text
Arduino 장치 ←→ IOSignal 서버 ←→ 브라우저 웹앱
     └──────── 별도 E2E 데이터 키 ────────┘
```

연결 인증용 키는 각 클라이언트의 서버 접속 자격을 확인하는 데 사용합니다.
중계 서버가 메시지 본문을 읽지 못하게 하려면 최종 송수신자만 공유하는 별도
데이터 키로 `signal_e2e`를 사용하고, 수신 측에서 `decrypt_e2e`로 검증·복호화합니다.
일반 연결 암호화만으로 종단간 암호화가 되는 것은 아닙니다. 서버는 E2E 메시지의
전달에 필요한 라우팅 정보를 처리하며 트래픽 크기 등의 메타데이터도 남습니다.

현재 JavaScript 구현의 `AUTO` 모드는 TLS를 사용하지 않고 boho 인증이 완료된
경우 boho 연결 암호화를 사용합니다. E2E 본문 암호화는 연결 보호 여부와 별도입니다.
위 빠른 시작의 인증 없는 로컬 예제는 boho 인증·암호화를 활성화한 예제가 아닙니다.

일반 웹 배포에서는 HTTPS로 웹앱을 제공하고 WSS로 연결하면서 본문에 E2E를
적용할 수 있습니다. 앱 코드가 변조되면 키와 평문도 노출될 수 있어 E2E에서도
웹앱 코드 제공자에 대한 신뢰가 필요합니다. boho는 브라우저의 mixed content
정책을 우회하지 않습니다.

### 7.0.0 세션 시간·재사용 검증

서버는 허용 시간 차이를 벗어나거나 이미 허용한 시간·카운터 조합을 다시
사용한 암호 패킷을 거부하고, 명령 실행·중계 전에 연결을 종료합니다.
`ENC_488`과 `ENC_E2E` 라우팅 암호 헤더에 같은 정책을 적용하며 패킷 형식은 유지합니다.

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

기본값은 절대 시간 차이 60초, 인증 challenge 유효기간 60초, 연결별 저장 한도
65,536개입니다. 설정은 양의 안전 정수여야 합니다. 저장 한도 초과도 연결을
종료하며 아직 유효한 재사용 기록을 임의로 지우지 않습니다.
`security:mismatch(remote, reason)` 이벤트와 `remote.securityFailure`로 사유를 확인합니다.

정상 검증된 인증 증명은 challenge를 소진합니다. 재인증 또는 challenge 만료 후
수동 로그인은 재연결해야 합니다. 인증된 연결에서 다시 `login()`하면 연결이
종료됩니다. AUTH_REQ에는 현재 장치 시각이 없으므로 초기에는 challenge 경과시간을,
이후 암호 패킷에서는 장치 시각과 서버 시각의 차이를 검사합니다.
평문·TLS 전송 정책은 변경하지 않습니다.

JS 클라이언트 시계는 허용 범위 안에 있어야 합니다. Boho Arduino 1.0.0은 검증된
서버 암호 헤더로 시계를 점진 보정하며 평문 PING/PONG은 시간 보정에 사용하지 않습니다.
내부 E2E 본문의 재사용 방지는 연결 암호 헤더 검증과 별도로 응용 계층에서 처리합니다.

### 현재 구현의 적용 조건

- 충분히 무작위인 키를 사용하세요. `set_key`의 SHA-256 한 번은 비밀번호용 느린 KDF가 아닙니다.
- JavaScript는 `crypto.getRandomValues()`를 사용하지만 현재 Arduino 구현의 독립 패킷과 인증 요청의 클라이언트 nonce는 `micros()`에 기반합니다. 이는 암호학적 난수가 아니므로 재시작·장치·통신 방향을 포함해 같은 키와 `salt12`가 반복되지 않는지 검토해야 합니다.
- boho 자체는 재전송 거부나 challenge 만료를 강제하지 않습니다. 유효한 태그만으로 메시지의 신선도나 명령 실행 권한이 보장되지 않으므로 호출 측과 응용 계층의 수신 정책을 확인해야 합니다.
- boho는 SHA-256을 조합한 자체 프로토콜입니다. 표준 AEAD/TLS와 동일한 보안 보장이나 장기 키 유출 후 과거 통신을 보호하는 순방향 비밀성을 제공한다고 취급해서는 안 됩니다.

## 소스 빌드 및 검증

이 저장소의 개발·검증 환경은 Node.js 22와 npm 10을 사용합니다.

```bash
npm ci
npm run verify
```

`verify`는 공개 파일 정책을 검사하고, `dist`를 삭제한 뒤 번들과 타입 선언을
재생성합니다. 이어서 자동 테스트와 npm 패키지 포함 파일 검사를 수행합니다.

빌드만 실행하려면 `npm run build`, 이미 빌드된 결과의 자동 테스트만 실행하려면
`npm test`를 사용합니다.

### 통신 자동 테스트

```bash
npm run build
npm run test:integration
```

`test/integration/`은 공개 ESM·CommonJS 빌드 각각에 대해 실제 WebSocket 통신을 검사합니다.
로컬 루프백(`127.0.0.1`)의 임시 포트를 사용하므로 외부 서버, Redis, 실제 인증키가 필요하지 않습니다.

- 연결과 RPC 응답, 없는 명령 및 권한 거부
- 두 클라이언트 간 문자열·객체·바이너리 발행/구독과 구독 해제
- 인증 성공 및 암호화된 RPC 응답, 잘못된 인증 거부
- 연결 종료 후 클라이언트 재사용과 서버 자원 정리

`npm test`와 `npm run verify`에도 통신 검사가 포함됩니다. 테스트별 시간 제한과
전체 테스트 파일 시간 제한을 두며, 종료 시 서버와 클라이언트를 정리합니다.
실제 브라우저, TLS, TCP 전송 및 Redis 연동 검증은 이 통신 테스트 범위에 포함되지 않습니다.

기존 `test/attach-services/`, `test/auth_server_client/`, `test/pubsub-counter/`,
`test/subscribe-signal/`은 수동 예제입니다. 자동 실행하지 않으며, 일부는 별도 서버나 Redis가 필요합니다.

## 라이선스

패키지 라이선스: MIT.
