/*
unicast using cid
A,B ready 되면 cidA, cidB에 저장
A는 B에게, B는 A에게 unicast 1:1 시그널 전송

A -> B
B -> A

2. cid 구독, cid 발행
C는 A의 cid를 구독, C가 cid 발행하면 수신.

A cid publish -> C

채널 시그널
유니캐스트 시그널


*/
import { Server , IO, MBP , StringKeyProvider, BohoAuth} from 'iosignal'
const stringKey = 'A.akey.A.3,B.bkey.B.3,C.ckey.C.3'
const authManager = new BohoAuth(new StringKeyProvider(stringKey) )
const tag = 'channel'
const s = new Server({
    port: 0,
    // congPort: 55488,
    // showMessage: 'message'
}, authManager);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


s.on('ready',async ()=>{
    // 서버 listen 포트가 0으로 설정된경우,  자동설정된 값이 s.port 속성으로 확정됨.
    console.log('listening port: ', s.port )

    const A = new IO('ws://localhost:'+ s.port)
    A.on('ready', async ()=>{
        console.log('ready A:', A.cid)
    })
    A.on('message',( tag, ...args )=>{
        console.log('[Am]', tag, ...args)
    })
    A.on('@',( tag, ...args )=>{
        console.log('[A@]',tag, ...args)
    }).auth('A.akey')

    const B = new IO('ws://localhost:'+ s.port)
    .on('ready', async ()=>{
        console.log('ready B:', B.cid)
        B.subscribe('A@news')
    })
    .on('message',( tag, ...args )=>{
        console.log('[Bm]', tag, ...args)
    })
    .on( 'A@news',( tag, ...args )=>{
        console.log('[Bs]', tag, ...args)
    })
    .on('@',( tag, ...args )=>{
        console.log('[B@]', tag, ...args)
    }).auth('B.bkey')


    const C = new IO('ws://localhost:'+ s.port)
    C.on('ready', async ()=>{
        console.log('ready C:', C.cid)
        C.subscribe('A@news')
    })
    C.on( 'A@news',( tag, ...args )=>{
        console.log('[Cs]', tag, ...args)
    })
    C.on('message',( tag, ...args )=>{
        console.log('[Cm]', tag, ...args)
    })
    C.on('@',( tag, ...args )=>{
        console.log('[C@]', tag, ...args)
    }).auth('C.ckey')

    await delay(200)
    // unicast A -> B@
    A.signal( 'B@', 'A -> B@')

    // cid_subscribe  A -> A@ subscirbers
    A.signal( '@news', 'A -> A@news -> B,C')

    // unicast B -> A@
    B.signal( 'A@', 'B -> A@')

    // unicast B -> A@topic
    B.signal( 'A@topic', 'B -> A@topic')
})

await delay(3000)
process.exit()

