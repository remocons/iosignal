let { Server } = require('iosignal')

const server = new Server(
  {
    port: 7777,     // WebSocket
    congPort: 8888, // CongSocket
    showMetric: 2,  // show clients cid(state) info
    showMessage: 'message' // show raw signal buffer
  })