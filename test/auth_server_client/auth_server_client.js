import { Server , IO, BohoAuth, StringKeyProvider} from 'iosignal'

// serverOption.showMetric = 2;

const authManager = new BohoAuth( new StringKeyProvider('io.key.io.3,io2.password.io2.3')) 
const s = new Server({
    port: 0,
    // showMetric: 2,
    showMessage: 'message'
}, authManager);
// s.attach('sudo', sudoService );


const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

s.on('ready',async ()=>{
    // 서버 listen 포트가 0으로 설정된경우,  자동설정된 값이 s.port 속성으로 확정됨.
    console.log('listening port: ', s.port )

    let io = new IO('ws://localhost:'+ s.port)
    .on('error',(err)=>{
        console.log(err)
    }).on('change',(name)=>{
        console.log(`<io(${name}:${io.state})`)  
    }).on('ready',()=>{
        console.log('#ready cid:', io.cid )
    })

    let io2 = new IO('ws://localhost:'+ s.port)
    .on('error',(err)=>{
        console.log(err)
    }).on('change',(name)=>{
        console.log(`<io2(${name}:${io2.state})`)  
    }).on('ready',()=>{
        console.log('#ready cid:', io2.cid )
    }).on('auth_fail',()=>{
        console.log('#auth_fail: io2')
    }).auth('io2.password')


})

// await delay(2000)
// process.exit()

