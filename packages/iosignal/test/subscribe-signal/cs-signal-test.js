import { Server , IO, MBP ,delay } from 'iosignal'

const tag = 'ch1'
const tag2 = 'ch2'

const s = new Server({port:0, showMessage: 'message'});

s.on('ready',async ()=>{
    // 서버 listen 포트가 0으로 설정된경우,  자동설정된 값이 s.port 속성으로 확정됨.
    console.log('listening port: ', s.port )

    const io = new IO('ws://localhost:'+ s.port)

    io.on('message',( tag, ...args )=>{
        console.log('io message: ', tag, ...args)
    })
    
    io.on('ready',()=>{
        io.subscribe(tag + ',' + tag2 )
    })

    await delay(1000)
    io.signal(tag, 'text', 'hello')
    io.signal(tag) //empty
    io.signal(tag, 'number', 123)
    io.signal(tag, 'object', {key:'str value', key2: 123 })
    io.signal(tag, 'buffer', Buffer.from('aaaaa'))
    io.signal(tag, 'buffer,str,number', Buffer.from('aaaaa'),'hello', 123)
    let u8 = new Uint8Array(4)
    u8[0] = 1;
    let u32 = new Uint32Array(4)
    u32[0] = 1;
    u32[1] = 2;
    io.signal(tag, 'uit8,uint32', u8, u32 )
    
    let mbp = MBP.pack( 
        MBP.MB('name8','8', 200),
        MBP.MB('name32', '32', 256 + 200)
    )
    io.signal(tag2 , mbp )

    io.signal(tag , '1k',Buffer.alloc(1000))
})


await delay(3000)
process.exit()