# iosignal

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
