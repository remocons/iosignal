[ [en](../README.md) | kr ]

# IOSignal

IOSignal은 웹 브라우저, Node.js, 아두이노 간의 실시간 통신을 지원합니다. 또한 안전한 인증 및 암호화된 통신을 제공합니다. 시그널링 프로토콜이 내장되어 있어 프로그래밍 없이 서버를 사용할 수 있습니다.

## 설치

```shell
$ npm i iosignal
```

## IOSignal 클라이언트

### 브라우저 클라이언트 : ESM

- 로컬 파일: "dist/io.js"
- CDN: https://cdn.jsdelivr.net/npm/iosignal/dist/io.js

```html
<html>

  <script type="module">
    import IO from "../dist/io.js"

    const io = new IO('wss://io.iosignal.net/ws')
    io.listen('channel#topic', (...args)=>{
      console.log( args )
    })

    io.on('ready',()=>{
      console.log('ready cid:', io.cid )
    })

  </script>

</html>
```

### 브라우저 클라이언트 : UMD(IIFE)
- 로컬 파일: "dist/io.min.js"
- CDN: https://cdn.jsdelivr.net/npm/iosignal/dist/io.min.js

```html
<html>
  <script src="../dist/io.min.js"></script>
  <script>
    console.log('IO', IO)  // 기본 전역 변수 이름은 IO

    var io1 = new IO('ws://localhost:7777')
    var io2 = new IO('ws://localhost:7777')
    var io3 = new IO('ws://localhost:7777')

    io1.on('error', errorHandler )
    io2.on('error', errorHandler )
    io3.on('error', errorHandler )

    let channelName = 'io'

    // 고전적인 스타일의 구독
    io1.on('ready',e=>{
      io1.subscribe(channelName)
      io1.on(channelName, (...args)=>{
        // console.log('io1 received', args )
        let msg = '[io1] ' + JSON.stringify( args )
        addMessage(msg)
      })
    })

    // iosignal 스타일의 구독
    io2.listen(channelName, (...args)=>{
      // console.log('io2 receive', args )
      let msg = '[io2] ' + JSON.stringify( args )
        addMessage(msg)
    })

    setInterval(e=>{
      io3.signal(channelName, 'single string')   // 단일 문자열 페이로드
      io3.signal(channelName, Date.now(), 'a', 2 , {key: 3} ) // 다중 페이로드
      io3.signal(channelName ) // 페이로드 없는 순수 시그널
    },3000)

    function addMessage(msg){
      // ...
    }

    function errorHandler(e){
      // ...
    }
  </script>

</html>
```

### NodeJS 클라이언트
```js
  import { IO } from "iosignal"

  const io = new IO('wss://io.iosignal.net/ws')

  io.on('ready', ()=>{
    console.log('ready cid:', io.cid)
    io.signal('#screen','playToggle')
  });

  io.listen('#notify', (...args)=>{
    console.log( args )
  })

  io.on('error',err=>{
      console.log('err', err)
  })

```

## IOSignal 서버

```js
import { Server } from "iosignal"

const server = new Server(
  {
    port: 7777,
    congPort: 8888,
    showMetric: 2,
    showMessage: 'message' // 시그널 메시지 표시
  })

```

- port: <Number> WebSocket을 통한 IOSignal
- congPort: <Number> CongSocket을 통한 IOSignal
- showMetric: 1|2|3 클라이언트 CID(상태) 정보 표시
- showMessage: "none"|"message" 시그널 버퍼 메시지 표시
- timeout <milliseconds> 핑 주기 및 타임아웃 (최소 1000)

### IOSignal API

IOSignal API 예시
- src/api_reply.js  // 'echo', 'date', 'unixtime'
- src/api_sudo.js   // 서버 관리자 모니터링 명령어
- src/RedisAPI.js   // Redis 명령어 및 응답 서비스


서버에 API 서비스를 등록하려면 api() 메서드를 사용합니다.

`api('api_name', module )`

```js
// node.js
import { Server ,api_reply  } from 'iosignal'
const server = new Server( { port: 7777 }  )
server.api('reply', api_reply) // API 모듈 연결
```

클라이언트가 reply API를 호출하는 예시

```js
  // 웹 브라우저 API 클라이언트 예시
  <script src="../dist/io.min.js"></script>
  <script>
      const io = new IO('ws://localhost:7777')

      io.on('ready', async ()=>{
        let res_echo = await io.req('reply', 'echo', 'hello' )
        let res_date = await io.req('reply', 'date' )
        let res_unixtime = await io.req('reply', 'unixtime' )

        if( res_echo.ok ) console.log( res_echo.body  )
        if( res_date.ok ) console.log( res_date.body  )
        if( res_unixtime.ok ) console.log( res_unixtime.body  )
      });
  </script>

// 결과
[ 'hello' ]
Fri, 09 Feb 2024 14:24:37 GMT
1707488677

```

## 기능

### 내장 메시지 전송 프로토콜
- 채널 이름을 통한 pub/sub 멀티캐스트.
- 유니캐스트: CID를 통한 일대일 메시징.
- `CID`는 통신 ID입니다.
- CID 구독: CID를 사용하여 하나의 피어 구독.
- HomeChannel: IP 주소별 그룹화.

### 내장 보안
- 인증
- 암호화
- E2EE
- `Boho` 덕분입니다 [ [github](https://github.com/remocons/boho) ]

## 연결
 - 웹 브라우저는 WebSocket을 사용합니다.
 - Node.js는 WebSocket 또는 CongSocket을 사용합니다.
 - 아두이노는 CongSocket을 사용합니다.

## IOSignal 서버 아키텍처
![IOSignal](./iosignal_architecture.png)

## IOSignal 저장소

- Javascript: `iosignal` [ [github](https://github.com/remocons/iosignal) | [npm](https://www.npmjs.com/package/iosignal) ]
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