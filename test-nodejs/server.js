import { Server } from 'iosignal'

const server = new Server(
  {
    port: 7777,     // WebSocket
    congPort: 8888, // CongSocket
    showMetric: 2,
    showMessage: 'message'
  })


// text message handler (No binary message)
// print text message
// then reply.
server.on('text_message', (msg, remote) => {
  console.log('text_message from(cid): ', remote.cid, msg.toString())
  let result = { msg: msg, yourcid: remote.cid, date: new Date().toUTCString() }
  let res = JSON.stringify(result)
  remote.send(res)
})
