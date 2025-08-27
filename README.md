[ English | [한국어](README.ko.md) ]

# IOSignal

IOSignal enables real-time communication across web browsers, Node.js, and Arduino. It features built-in secure authentication, encrypted communication, and a pre-configured signaling protocol, allowing server deployment without complex programming.

## Install

```shell
$ npm i iosignal
```

## Examples

This project includes several examples in the `examples` directory to demonstrate how to use `iosignal` in different environments.

### Node.js Server Example

A simple signaling server is available in `examples/server`. This server is required for the client examples to communicate with each other.

**To run the server:**
```shell
cd examples/server
npm install
node .
```
The server will start on `localhost:7777` for WebSocket connections.


### React Client Example

A sample React project is available in `examples/react-chat-js`. This example demonstrates how to integrate `iosignal` into a React application for real-time chat functionality.

**Key Concepts:**

-   **`useRef`**: To maintain a stable reference to the `io` instance across component re-renders.
-   **`useEffect`**: To manage the lifecycle of the `io` instance, including initialization and cleanup. Event handlers are set up within this hook.
- To release the `io` instance when the component unmounts, use `io.destroy()`. Event handlers registered during mount are also automatically removed.

**To run the example:**

1.  Make sure the example server is running.
2.  In a new terminal, navigate to the React project directory, install dependencies, and start the development server:
    ```shell
    cd examples/react-chat-js
    npm install
    npm run dev
    ```

**Example Code (`App.jsx`):**

If you open multiple browsers and enter a message, it will be delivered to each other via the server.

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

### Svelte Client Example

A sample Svelte project is available in `examples/svelte-chat-js`. This example shows how to use `iosignal` in a Svelte 5 application with Runes for real-time chat.

**Key Concepts:**

-   **`$state`**: To create reactive state variables for messages, input fields, and connection status.
-   **`$effect`**: To manage the lifecycle of the `io` instance. It runs when the component mounts, and the returned cleanup function (which calls `io.destroy()`) runs when the component unmounts.

**To run the example:**

1.  Make sure the example server is running (see instructions above).
2.  In a new terminal, navigate to the Svelte project directory, install dependencies, and start the development server:
    ```shell
    cd examples/svelte-chat-js
    npm install
    npm run dev
    ```

**Example Code (`+page.svelte`):**

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

### Browser client : ESM

- local file: "dist/io.js"
- CDN: https://cdn.jsdelivr.net/npm/iosignal/dist/io.js

```html
<html>

  <script type="module">
    import IO from "../dist/io.js"

    const io = new IO('wss://io.iosignal.net/ws')
    io.listen('channel#topic', (...args)={
      console.log( args )
    })

    io.on('ready',()=>{
      console.log('ready cid:', io.cid )
    })

  </script>

</html>
```


### Browser Client : UMD(IIFE)
- local file: "dist/io.min.js"
- CDN: https://cdn.jsdelivr.net/npm/iosignal/dist/io.min.js

```html
<html>
  <script src="../dist/io.min.js"></script>
  <script>
    console.log('IO', IO)  // default global variable name is IO

    var io1 = new IO('ws://localhost:7777')
    var io2 = new IO('ws://localhost:7777')
    var io3 = new IO('ws://localhost:7777')

    io1.on('error', errorHandler )
    io2.on('error', errorHandler )
    io3.on('error', errorHandler )

    let channelName = 'io'

    // classic style subsribing
    io1.on('ready',e=>{
      io1.subscribe(channelName)
      io1.on(channelName, (...args)=>{
        // console.log('io1 received', args )
        let msg = '[io1] ' + JSON.stringify( args )
        addMessage(msg)
      })
    })

    // iosignal style subscribing
    io2.listen(channelName, (...args)=>{
      // console.log('io2 receive', args )
      let msg = '[io2] ' + JSON.stringify( args )
        addMessage(msg)
    })

    setInterval(e=>{
      io3.signal(channelName, 'single string')   // single string payload
      io3.signal(channelName, Date.now(), 'a', 2 , {key: 3} ) //multiple payload 
      io3.signal(channelName ) // pure signal without payload.
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




### NodeJS Client
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




## IOSignal Server


```js
import { Server } from "iosignal"

const server = new Server(
  {
    port: 7777,     
    congPort: 8888, 
    showMetric: 2,  
    showMessage: 'message' // show signal message
  })

```

- port: <Number> IOSignal over WebSocket
- congPort: <Number> IOsignal over CongSocket
- showMetric: 1|2|3 show clients cid(state) info
- showMessage: "none"|"message" show signal buffer message
- timeout <milliseconds> ping period & timeout (min. 1000)

### IOSignal API

IOSignal API examples
- src/api_reply.js  // 'echo', 'date', 'unixtime'
- src/api_sudo.js   // server admin monitoring command
- src/RedisAPI.js   // redis command and response service


To register an API service with the server, use the api() method

`api('api_name', module )`

```js
// node.js
import { Server ,api_reply  } from 'iosignal'
const server = new Server( { port: 7777 }  )
server.api('reply', api_reply) // attach api module
```

Example of a client calling the reply API

```js
  // web browser api client example
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

// result
[ 'hello' ]
Fri, 09 Feb 2024 14:24:37 GMT
1707488677

```


## Features

### Built-in Message Trasport Protocol
- pub/sub multicast by channel name.
- uni-cast: one to one messaging by CID.
- `CID` is a Communication Id
- CID subscribing: subscribe one peer using CID.
- HomeChannel: group by IP address.

### Built-in Security
- Authentication
- Encryption
- E2EE
- thanks to the `Boho` [ [github](https://github.com/remocons/boho) ]

## Connection
 - Web browser use WebSocket.
 - Node.js use WebSocket or CongSocket.
 - Arduino use CongSocket.

## IOSignal Server Architecture
![IOSignal](./docs/iosignal_architecture.png)

## IOSignal repositories.

- Javascript: `iosignal` [ [github](https://github.com/remocons/iosignal) | [npm](https://www.npmjs.com/package/iosignal) ]
    - Node.js server ( WebSocket, CongSocket)
    - Node.js client ( WebSocket, CongSocket)
    - Web Browser client( WebSocket)

- CLI program
    - `iosignal-cli` [ [github](https://github.com/remocons/iosignal-cli) | [npm](https://www.npmjs.com/package/iosignal-cli) ]
    - install: `npm i -g iosignal-cli` or `sudo npm i -g iosignal-cli`
    - support mac, linux and windows.
    - server and client

- Arduino iosignal library and examples:
    - use Arduino Library Manager: `iosignal`
    - or `iosignal-arduino` [ [github](https://github.com/remocons/iosignal-arduino) ]
    - web app : http://test.iosignal.net

- Arduino remocon library and examples:
    - use Arduino Library Manager: `remocon`
    - or `remocon-arduino` [ [github](https://github.com/remocons/remocon-arduino) ]
    - web app : https://remocon.kr
    


### Browser client : ESM

- local file: "dist/io.js"
- CDN: https://cdn.jsdelivr.net/npm/iosignal/dist/io.js

```html
<html>

  <script type="module">
    import IO from "../dist/io.js"

    const io = new IO('wss://io.iosignal.net/ws')
    io.listen('channel#topic', (...args)={
      console.log( args )
    })

    io.on('ready',()=>{
      console.log('ready cid:', io.cid )
    })

  </script>

</html>
```


### Browser Client : UMD(IIFE)
- local file: "dist/io.min.js"
- CDN: https://cdn.jsdelivr.net/npm/iosignal/dist/io.min.js

```html
<html>
  <script src="../dist/io.min.js"></script>
  <script>
    console.log('IO', IO)  // default global variable name is IO

    var io1 = new IO('ws://localhost:7777')
    var io2 = new IO('ws://localhost:7777')
    var io3 = new IO('ws://localhost:7777')

    io1.on('error', errorHandler )
    io2.on('error', errorHandler )
    io3.on('error', errorHandler )

    let channelName = 'io'

    // classic style subsribing
    io1.on('ready',e=>{
      io1.subscribe(channelName)
      io1.on(channelName, (...args)=>{
        // console.log('io1 received', args )
        let msg = '[io1] ' + JSON.stringify( args )
        addMessage(msg)
      })
    })

    // iosignal style subscribing
    io2.listen(channelName, (...args)=>{
      // console.log('io2 receive', args )
      let msg = '[io2] ' + JSON.stringify( args )
        addMessage(msg)
    })

    setInterval(e=>{
      io3.signal(channelName, 'single string')   // single string payload
      io3.signal(channelName, Date.now(), 'a', 2 , {key: 3} ) //multiple payload 
      io3.signal(channelName ) // pure signal without payload.
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




### NodeJS Client
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




## IOSignal Server


```js
import { Server } from "iosignal"

const server = new Server(
  {
    port: 7777,     
    congPort: 8888, 
    showMetric: 2,  
    showMessage: 'message' // show signal message
  })

```

- port: <Number> IOSignal over WebSocket
- congPort: <Number> IOsignal over CongSocket
- showMetric: 1|2|3 show clients cid(state) info
- showMessage: "none"|"message" show signal buffer message
- timeout <milliseconds> ping period & timeout (min. 1000)

### IOSignal API

IOSignal API examples
- src/api_reply.js  // 'echo', 'date', 'unixtime'
- src/api_sudo.js   // server admin monitoring command
- src/RedisAPI.js   // redis command and response service


To register an API service with the server, use the api() method

`api('api_name', module )`

```js
// node.js
import { Server ,api_reply  } from 'iosignal'
const server = new Server( { port: 7777 }  )
server.api('reply', api_reply) // attach api module
```

Example of a client calling the reply API

```js
  // web browser api client example
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

// result
[ 'hello' ]
Fri, 09 Feb 2024 14:24:37 GMT
1707488677

```


## Features

### Built-in Message Trasport Protocol
- pub/sub multicast by channel name.
- uni-cast: one to one messaging by CID.
- `CID` is a Communication Id
- CID subscribing: subscribe one peer using CID.
- HomeChannel: group by IP address.

### Built-in Security
- Authentication
- Encryption
- E2EE
- thanks to the `Boho` [ [github](https://github.com/remocons/boho) ]

## Connection
 - Web browser use WebSocket.
 - Node.js use WebSocket or CongSocket.
 - Arduino use CongSocket.

## IOSignal Server Architecture
![IOSignal](./docs/iosignal_architecture.png)

## IOSignal repositories.

- Javascript: `iosignal` [ [github](https://github.com/remocons/iosignal) | [npm](https://www.npmjs.com/package/iosignal) ]
    - Node.js server ( WebSocket, CongSocket)
    - Node.js client ( WebSocket, CongSocket)
    - Web Browser client( WebSocket)

- CLI program
    - `iosignal-cli` [ [github](https://github.com/remocons/iosignal-cli) | [npm](https://www.npmjs.com/package/iosignal-cli) ]
    - install: `npm i -g iosignal-cli` or `sudo npm i -g iosignal-cli`
    - support mac, linux and windows.
    - server and client

- Arduino iosignal library and examples:
    - use Arduino Library Manager: `iosignal`
    - or `iosignal-arduino` [ [github](https://github.com/remocons/iosignal-arduino) ]
    - web app : http://test.iosignal.net

- Arduino remocon library and examples:
    - use Arduino Library Manager: `remocon`
    - or `remocon-arduino` [ [github](https://github.com/remocons/remocon-arduino) ]
    - web app : https://remocon.kr
    
## License

This code is released under the MIT License.