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

## 인증과 암호화

[Boho](https://github.com/remocons/boho)는 JavaScript와 Arduino에서 공유 키 인증과
메시지 암호화를 제공합니다. 종단간 암호화(E2E)는 최종 송수신자만 공유하는 별도
데이터 키로 설정합니다. 키 관리, TLS와의 관계, 세션 검증 및 구현의 적용 조건은
[Boho 기술 가이드](https://github.com/remocons/iosignal/blob/main/docs/boho.ko.md)를 참고하세요.

## 상세 문서

- [시그널 태그와 직접 메시지](https://github.com/remocons/iosignal/blob/main/docs/messaging.ko.md)
- [서버 ping과 peer ping](https://github.com/remocons/iosignal/blob/main/docs/ping.ko.md)
- [Boho 인증·암호화와 E2E](https://github.com/remocons/iosignal/blob/main/docs/boho.ko.md)
- [소스 빌드 및 검증](https://github.com/remocons/iosignal/blob/main/docs/development.ko.md)

## 라이선스

패키지 라이선스: MIT.
