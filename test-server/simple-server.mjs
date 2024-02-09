import { Server  } from '../index.js'

const server = new Server({
  port: 7777 ,
  congPort: 8888,
  showMessage: 'message'
} )

server.on('text_message', (data, client)=>{
  console.log( 'text_message', data ,'from', client.cid )
  client.send('from server. your cid is '+ client.cid + ".")
})