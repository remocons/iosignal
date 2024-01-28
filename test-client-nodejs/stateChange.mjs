
import { IO } from "iosignal"

const io = new IO('ws://localhost:7777')

io.on('ready', ()=>{
  console.log('ready cid:', io.cid)
});

io.on('change', ( evt )=>{
  console.log('change event:', evt  )
  console.log('io.state<Number>', io.state  )
  console.log('io.stateName<String>:', io.stateName )
});


io.on('error',err=>{
    console.log('err', err)
})
