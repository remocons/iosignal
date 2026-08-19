import { Server , IO, MBP ,delay } from 'iosignal'

const tag = 'channel1'
const s = new Server({
    port:0,
    showMessage: 'message'
});

s.on('ready',async ()=>{
    // 서버 listen 포트가 0으로 설정된경우,  자동설정된 값이 s.port 속성으로 확정됨.
    console.log('listening port: ', s.port )

    const io = new IO('ws://localhost:'+ s.port)
    io.on('change',(name)=>{
        console.log(`(${name}:${io.state})`)  
    })

    io.on('ready',()=>{
        console.log('io is ready. cid:', io.cid )
        io.subscribe(tag)
        io.signal(tag, 'hi')
    })
    io.on('message',( tag, ...args )=>{
        console.log('io message: ', tag, ...args)
    })
    io.listen(tag,( tag, ...args )=>{
        console.log('io listen tag h1: ', tag, ...args)
    })
    io.listen(tag,( tag, ...args )=>{
        console.log('io listen tag h2: ', tag, ...args)
    })

    console.log('listeners',  io.listeners( tag ) )
    await delay(200)
    io.signal(tag, 'hello')
})

await delay(1000)
process.exit()

