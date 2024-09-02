
const { IOWS } = require('iosignal')

const io = new IOWS('ws://localhost:7777')

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
