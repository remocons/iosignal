
import { IO } from "iosignal"

const io = new IO('wss://io.iosignal.net/ws')

// io.auth('id','key')

io.on('ready', () => {
  console.log('ready cid:', io.cid)
  io.signal('#screen', 'playToggle')
});

io.listen('#notify', (...args) => {
  console.log(args)
})

io.on('error', err => {
  console.log('err', err)
})
