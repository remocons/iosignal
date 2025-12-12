
import { IO } from 'iosignal'
const ch_base = 'ch_'
const url = 'wss://io.remocon.kr/ws'


/*
    시그널 서버 연결된 노드들의 pub/sub 전달 상태 테스트

    2025. Aug 16.
    여러개의 장치가 하나의 채널을 공유한다.
    하나의 채널당 연결된 node 개수는 nodePerChannel
    총 채널의 개수가 channels
    총 노드수는 channels * nodePerChannel

    모든 노드가 수신하는 메시지 수를  rCounter 에 누적하고, 1초마다 출력.
*/
const channels = 20;
const nodePerChannel = 5;

let remotes = [];
let rCounter = 0;


for( let j= 0; j < channels ; j++){
    let ch = ch_base + j;

    console.log( j, ch)
    for(let i = 0; i < nodePerChannel ; i++){

        let io =  new IO(url);   

        let range = 10000; // msec
        let minPeriod = 500; //msec
        let randRange =  Math.ceil(  Math.random() * range );
        if( i == 0){
            setInterval( ()=>{
                io.signal(ch, 'hello')
            }, minPeriod + randRange)
        } 
        io.on('ready',()=>{
            io.subscribe(ch)
        })
        io.on( 'message', (tag, msg )=>{ 
            rCounter++;
        })
        remotes.push(io)
    }

}


console.log('total remotes: ', remotes.length )


setInterval( ()=>{
    console.log('rcounter/sec', rCounter )
    rCounter = 0;
}, 1000)


