[ [English](README.md) | 한국어 ]


# IOSignal

IOSignal은 웹 브라우저, Node.js, 아두이노 간의 실시간 통신을 지원합니다. 또한 안전한 인증 및 암호화된 통신을 제공합니다. 시그널링 프로토콜이 내장되어 있어 프로그래밍 없이 서버를 사용할 수 있습니다.

## 설치

```shell
$ npm i iosignal
```

## 예제

이 프로젝트는 다양한 환경에서 `iosignal`을 사용하는 방법을 보여주는 여러 예제를 `examples` 디렉토리에 포함하고 있습니다.

### Node.js 서버 예제

`examples/server`에서 간단한 시그널링 서버를 사용할 수 있습니다. 이 서버는 클라이언트 예제들이 서로 통신하는 데 필요합니다.

**서버 실행 방법:**
```shell
cd examples/server
npm install
node .
```
서버는 WebSocket 연결을 위해 `localhost:7777`에서 시작됩니다.

### React 클라이언트 예제

`examples/react-chat-js`에서 샘플 React 프로젝트를 확인할 수 있습니다. 이 예제는 실시간 채팅 기능을 위해 `iosignal`을 React 애플리케이션에 통합하는 방법을 보여줍니다.

**주요 개념:**

-   **`useRef`**: 컴포넌트가 리렌더링되어도 `io` 인스턴스에 대한 안정적인 참조를 유지합니다.
-   **`useEffect`**: `io` 인스턴스의 생명주기를 관리하며, 초기화 및 정리 작업을 포함합니다. 이벤트 핸들러는 이 훅 내에서 설정됩니다.

**예제 실행 방법:**

1.  예제 서버가 실행 중인지 확인하세요 (위의 설명 참조).
2.  새 터미널에서 React 프로젝트 디렉토리로 이동하여 종속성을 설치하고 개발 서버를 시작합니다:
    ```shell
    cd examples/react-chat-js
    npm install
    npm run dev
    ```

**예제 코드 (`App.jsx`):**

여러 브라우저를 열고 메시지를 입력하면 서버를 통해 서로에게 전달됩니다.

```javascript
import { useState, useEffect, useRef } from 'react';
import './App.css';
import IO from 'iosignal/io.js';

const url = 'ws://localhost:7777';
const channel_tag = 'channel#topic';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('Hello, World!');
  const [ioState, setIoState] = useState(null);
  const [cid, setCid] = useState(null);
  const [counts, setCounts] = useState({ instances: 0, websockets: 0 });
  const ioRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    ioRef.current = new IO(url);
    setCounts({ instances: IO.instanceCount, websockets: IO.webSocketCount });

    const handleReady = () => {
      console.log('ready cid:', ioRef.current.cid);
      setCid(ioRef.current.cid);
      ioRef.current.subscribe(channel_tag);
    };

    const handleChange = (state) => {
      setIoState(state);
      setCounts({ instances: IO.instanceCount, websockets: IO.webSocketCount });
    };

    const handleChannelMessage = (msgObj, tag) => {
      console.log('Received message in App:', msgObj, tag);
      if (typeof msgObj === 'string') {
        msgObj = { text: msgObj, cid: 'cli unknown' };
      }
      setMessages((prevMessages) => [...prevMessages, `${msgObj.cid} : ${msgObj.text}`]);
    };

    const handleError = (error) => {
      console.error('IO Error in App:', error);
      setIoState(`Error: ${error.message}`);
    };

    ioRef.current.on('ready', handleReady);
    ioRef.current.on('change', handleChange);
    ioRef.current.on(channel_tag, handleChannelMessage);
    ioRef.current.on('error', handleError);

    return () => {
      ioRef.current.destroy();
      console.log('IO instance destroyed.');
      ioRef.current = null;
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const msgObj = { text: input, cid: ioRef.current.cid };
      ioRef.current.signal(channel_tag, msgObj);
      setInput('date' + Date.now());
    }
  };

  const ioStateStyle = {
    color: ioState === 'ready' ? 'green' : 'red',
    fontWeight: 'bold',
  };

  return (
    <div className="App">
      <h1>React Chat Example</h1>
      <div>URL: {url}</div>
      <div>Channel: {channel_tag}</div>
      <div>IO State: <span style={ioStateStyle}>{ioState}</span></div>
      <div>Client ID: {cid}</div>
      <div>IO Instances: {counts.instances}</div>
      <div>WebSockets Created: {counts.websockets}</div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
          disabled={ioState !== 'ready'}
        />
        <button onClick={sendMessage} disabled={ioState !== 'ready'}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
```

### Svelte 클라이언트 예제

`examples/svelte-chat-js`에서 샘플 Svelte 프로젝트를 확인할 수 있습니다. 이 예제는 실시간 채팅 기능을 위해 Svelte 5와 Runes를 사용하는 애플리케이션에 `iosignal`을 통합하는 방법을 보여줍니다.

**주요 개념:**

-   **`$state`**: 메시지, 입력 필드, 연결 상태 등을 위한 반응형 상태 변수를 생성합니다.
-   **`$effect`**: `io` 인스턴스의 생명주기를 관리합니다. 컴포넌트가 마운트될 때 실행되고, 반환된 정리(cleanup) 함수(`io.destroy()`를 호출하는)는 컴포넌트가 언마운트될 때 실행됩니다.

**예제 실행 방법:**

1.  예제 서버가 실행 중인지 확인하세요 (위의 설명 참조).
2.  새 터미널에서 Svelte 프로젝트 디렉토리로 이동하여 종속성을 설치하고 개발 서버를 시작합니다:
    ```shell
    cd examples/svelte-chat-js
    npm install
    npm run dev
    ```

**예제 코드 (`+page.svelte`):**

```svelte
<script>
  import { dev, browser } from "$app/environment";
  import IO from "iosignal/io.js";

  // const url = 'ws://192.168.0.15:7777';
  const url = "ws://localhost:7777";
  const channel_tag = "channel#topic";

  let messages = $state([]);
  let input = $state("Hello, World!");
  let ioState = $state(null);
  let cid = $state(null);
  let counts = $state({ instances: 0, websockets: 0 });
  let io = null;
  let messagesEnd;

  const scrollToBottom = () => {
    messagesEnd?.scrollIntoView({ behavior: "smooth" });
  };

  if (browser) {
    io = new IO(url);
    if (dev)
      console.log("new io:", IO.version, IO.instanceCount, IO.webSocketCount);

    counts = { instances: IO.instanceCount, websockets: IO.webSocketCount };

    const handleReady = () => {
      console.log("ready cid:", io.cid);
      cid = io.cid;
      io.subscribe(channel_tag);
    };

    const handleChange = (state) => {
      ioState = state;
      counts = { instances: IO.instanceCount, websockets: IO.webSocketCount };
    };

    const handleChannelMessage = (msgObj, tag) => {
      console.log("Received message in App:", msgObj, tag);
      messages = [...messages, `${msgObj.cid} : ${msgObj.text}`];
      scrollToBottom();
    };

    const handleError = (error) => {
      console.error("IO Error in App:", error);
      ioState = `Error: ${error.message}`;
    };

    io.on("ready", handleReady);
    io.on("change", handleChange);
    io.on(channel_tag, handleChannelMessage);
    io.on("error", handleError);

    $effect(() => {
      return () => {
        io.destroy();
        io = null;
      };
    });
  }

  const sendMessage = () => {
    if (input.trim()) {
      // console.log('Sending message:', input);
      const msgObj = { text: input, cid: io.cid };
      // console.log('Sending message object:', msgObj);
      io.signal(channel_tag, msgObj);
      input = "date" + Date.now();
    }
  };

  let ioStateStyle = $derived(
    `color: ${ioState === "ready" ? "green" : "red"}; font-weight: bold;`,
  );
</script>

<div class="App">
  <h1>Svelte 5 Chat Example</h1>
  <div>URL: {url}</div>
  <div>Channel: {channel_tag}</div>
  <div>IO State: <span style={ioStateStyle}>{ioState}</span></div>
  <div>Client ID: {cid}</div>
  <div>IO Instances: {counts.instances}</div>
  <div>WebSockets Created: {counts.websockets}</div>
  <div class="messages">
    {#each messages as msg, index (index)}
      <div>{msg}</div>
    {/each}
    <div bind:this={messagesEnd}></div>
  </div>
  <div class="input-area">
    <input
      type="text"
      bind:value={input}
      onkeyup={(e) => e.key === "Enter" && sendMessage()}
      disabled={ioState !== "ready"}
    />
    <button onclick={sendMessage} disabled={ioState !== "ready"}> Send </button>
  </div>
</div>

<style>
  .App {
    height: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-sizing: border-box;
  }

  h1 {
    margin-top: 0;
    color: #333;
  }

  .messages {
    flex-grow: 1;
    border: 1px solid #ccc;
    padding: 10px;
    overflow-y: auto;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .messages div {
    background-color: #f0f0f0;
    padding: 8px;
    margin-bottom: 5px;
    border-radius: 5px;
    text-align: left;
  }

  .input-area {
    display: flex;
    gap: 10px;
    margin-top: auto;
  }

  .input-area input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .input-area button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .input-area button:hover {
    background-color: #0056b3;
  }
</style>
```

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
![IOSignal](./docs/iosignal_architecture.png)

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