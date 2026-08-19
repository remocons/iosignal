import { Server , IO, MBP } from 'iosignal'

const tag = 'aaaaaaaa'
const s = new Server({
    port:0,
    showMessage: 'message'
});
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

s.on('ready',async ()=>{
    // 서버 listen 포트가 0으로 설정된경우,  자동설정된 값이 s.port 속성으로 확정됨.
    console.log('listening port: ', s.port )

    const io = new IO('ws://localhost:'+ s.port)
    io.on('change',(name)=>{
        console.log(`(${name}:${io.state})`)  
    })

    io.on('ready',()=>{
        console.log('ready cid:', io.cid )
        io.subscribe(tag)
        io.signal(tag, io.cid + ' is ready.')
    })
    io.on('message',( tag, msg )=>{
        console.log('rx tag, message', tag,  msg)
    })


    await delay(200)
    io.signal(tag, 'hello')
})

await delay(1000)
process.exit()

