# IOSignal

[En] iosignal supports real-time communication between web browsers, node.js, and arduino. It also provides secure authentication and encrypted communication.
The signaling protocol is built-in, so the server can be used without programming.

[Kr] iosignal 은 웹브라우저, node.js ,  arduino 간의 실시간 통신을 지원합니다.  또한 보안 인증과 암호통신 기능도 제공됩니다.
시그널링 프로토콜이 내장되어 있어서 서버는 프로그래밍 없이 사용 가능합니다.

## Install

```shell
$ npm i iosignal
```

## IOSignal Server

### ESM
```js
import { Server } from "iosignal"
const server = new Server( { port: 7777 } )
```

### CJS
```js
let { Server } = require('iosignal')
const server = new Server( { port: 7777 } )
```

### server options


```js
let { Server } = require('iosignal')

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


## IOSignal Client

### NodeJS Client
```js
  // ESM
  import { IO } from "iosignal"

  // CJS
  // const { IO } = require('iosignal')

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

### Browser Client : UMD(IIFE)
- local file: "./dist/io.min.js"
- CDN: https://cdn.jsdelivr.net/npm/iosignal@2.2.0/dist/io.min.js
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

### Browser client : ESM

- local file: "./dist/io.js"
- CDN: https://cdn.jsdelivr.net/npm/iosignal@2.2.0/dist/io.js

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

![IOSignal](./img/iosignal_stack.png)

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