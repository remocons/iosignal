/**
 * api/RediService.js 테스트
 * 
 * 사전준비. 
 * localhost 에 redis-server 운영
 * some sample data 저장.
 */
import { RedisService, Server , IO } from 'iosignal'
import { createClient } from 'redis'

const redisClient = createClient()  // default redis. localhost:6379
redisClient.connect();

redisClient.on('error', (err)=>{
    console.log('redisCleint err: ', err)
})
redisClient.on('ready', ()=>{
    console.log('redisClient is ready.')
})
redisClient.on('end', ()=>{
    console.log('redisClient is end.')
})

const server = new Server({port:0, showMessage: 'message'})
                    .attach('redis', new RedisService( redisClient , -1))

server.on('ready',()=>{
    let io = new IO('ws://localhost:'+server.port)
    io.on('ready', async ()=>{
        console.log('io ready. cid: ', io.cid )
        let apiResult;
        try {            
            apiResult = await io.call('redis','hGetAll','device:one')
            console.log(apiResult)
            apiResult = await io.call('redis','HGETALL','device:one')
            console.log(apiResult)
            apiResult = await io.call('redis','save')
            console.log(apiResult)
        } catch (error) {
            console.log('io api req err', error)
        }
    })
    io.on('error',(err)=>{
        console.log('io client error: ', err)
    })
})