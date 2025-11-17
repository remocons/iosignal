
# IOSignal

IOSignal은 웹 브라우저, Node.js, 아두이노 간의 실시간 통신을 지원합니다. 또한 안전한 인증 및 암호화된 통신을 제공합니다. 시그널링 프로토콜이 내장되어 있어 프로그래밍 없이 서버를 사용할 수 있습니다.

## JS examples

JS iosignal-examples 저장소 [[github](https://github.com/remocons/iosignal-examples)]

### react-chat

- vite react & iosignal server
- react client app

  [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remocons/iosignal-examples/tree/main/iosignal_react-chat)

### svelte5-chat
- vite svelte & iosignal server
- svelte5 client app

  [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remocons/iosignal-examples/tree/main/iosignal_svelte-chat)


### vanilla-chat
- vite & iosignal server
- vanilla js client app

  [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remocons/iosignal-examples/tree/main/iosignal_vanilla-chat)

## 기능

### 내장 메시지 전송 프로토콜
- 채널 이름을 통한 pub/sub 멀티캐스트.
- 유니캐스트: CID를 통한 일대일 메시징.
- `CID`는 통신 ID입니다.
- CID 구독: CID를 사용하여 하나의 피어 구독.
- HomeChannel: IP 주소별 그룹화.

### 내장 보안
- 인증
- 암호화 (대칭키)
- E2EE (대칭키)
- `Boho`  [ [github](https://github.com/remocons/boho) ]

## 연결
 - 웹 브라우저는 WebSocket을 사용합니다.
 - Node.js는 WebSocket 또는 CongSocket을 사용합니다.
 - 아두이노는 CongSocket을 사용합니다.



## IOSignal 저장소

- JS: `iosignal-examples` 저장소 [[github](https://github.com/remocons/iosignal-examples)]

- JS: `iosignal` [ [github](https://github.com/remocons/iosignal) | [npm](https://www.npmjs.com/package/iosignal) ]
    - Node.js 서버 (WebSocket, CongSocket)
    - Node.js 클라이언트 (WebSocket, CongSocket)
    - 웹 브라우저 클라이언트 (WebSocket)

- CLI 프로그램
    - `iosignal-cli` [ [github](https://github.com/remocons/iosignal-cli) | [npm](https://www.npmjs.com/package/iosignal-cli) ]
    - 설치: `npm i -g iosignal-cli` 또는 `sudo npm i -g iosignal-cli`
    - Mac, Linux, Windows 지원.
    - 서버 및 클라이언트

- 아두이노 iosignal 라이브러리 및 예시:
    - 아두이노 라이브러리 관리자 사용: `iosignal`
    - 또는 `iosignal-arduino` [ [github](https://github.com/remocons/iosignal-arduino) ]
    - 웹 앱 : http://test.iosignal.net

- 아두이노 remocon 라이브러리 및 예시:
    - 아두이노 라이브러리 관리자 사용: `remocon`
    - 또는 `remocon-arduino` [ [github](https://github.com/remocons/remocon-arduino) ]
    - 웹 앱 : https://remocon.kr

## 라이선스

이 코드는 MIT 라이선스에 따라 배포됩니다.

## IOSignal 서버 아키텍처
![IOSignal](./docs/iosignal_architecture.png)