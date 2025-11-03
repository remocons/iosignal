[ English | [한국어](./README.md) ]

# IOSignal

IOSignal enables real-time communication across web browsers, Node.js, and Arduino. It features built-in secure authentication, encrypted communication, and a pre-configured signaling protocol, allowing server deployment without complex programming.


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