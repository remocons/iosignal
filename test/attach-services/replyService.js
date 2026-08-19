
import { IO, Server, replyService } from "iosignal"

const server = new Server({ 
    port: 0, 
    // showMessage: 'message'
 })
server.attach('reply', replyService)

server.on('ready', () => {
  console.log('server is ready', server.port)

  const io = new IO('ws://localhost:' + server.port)
  io.on('ready', async () => {
    console.log('ready cid', io.cid)

    let result;
    try {
      result = await io.call('reply', 'echo', 'hello')
      if (result.ok) console.log('[echo respose] ', result.body)

      result = await io.call('reply', 'date')
      if (result.ok) console.log('[date respose] ', result.body)

      result = await io.call('reply', 'unixtime')
      if (result.ok) console.log('[unixtime respose] ', result.body)
    } catch (error) {
      console.log('error:', error)
    }

    // UNKNOWN_COMMAND ERROR
    try {
      result = await io.call('reply', 'Unknown_command')
      if (result.ok) console.log(result.body)
    } catch (error) {
      console.log('error:', error)
    }

    server.close()
    setTimeout(() => {
      process.exit();
    }, 1000)
  })


})
