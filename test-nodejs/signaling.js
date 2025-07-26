import { IO, Server } from 'iosignal'

let url = 'ws://localhost:5555'
let server = new Server({
  port: 5555
  //  ,showMessage: 'message'
})
let done = false;

let tx = new IO(url)
tx.on('ready', () => {
  console.log('tx ready', tx.cid)
})


let rx = new IO(url)
rx.on('ready', () => {
  console.log('rx ready', rx.cid)
})

rx.listen('@', (...args) => {
  console.log('uni-cast rxi', args)
})

rx.listen('channel', (...args) => {
  console.log('multi-cast rxi', args)
})

function sendSignals() {
  // uni-casting: tag is receiver CID@.
  let tag = rx.cid + '@topic'
  tx.signal(tag, ...arg1)
  tx.signal(tag, ...arg2)
  tx.signal(tag, ...arg3)
  tx.signal(tag, ...arg4)
  tx.signal(tag, ...arg5)

  // multi-casting: tag is channel name.
  tag = 'channel'
  tx.signal(tag, ...arg1)
  tx.signal(tag, ...arg2)
  tx.signal(tag, ...arg3)
  tx.signal(tag, ...arg4)
  tx.signal(tag, ...arg5)
}


const arg1 = ['a1']
const arg2 = ['a2', 222]
const arg3 = [{ name: 'a3' }, 333]
const arg4 = [{ a: 1 }, Buffer.from('KKKKK')]
const arg5 = [new Uint8Array(20)]


setTimeout(() => {
  sendSignals();
}, 1000)

setTimeout(() => {
  process.exit()
}, 2000)