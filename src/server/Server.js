import net from 'net'
import EventEmitter from 'events'
import { WebSocketServer } from 'ws'
import { Manager } from './Manager.js'
import { serverOption } from './serverOption.js'
import { STATUS } from '../api/api_constant.js'

export class Server extends EventEmitter {

  constructor(options, authManager , remoteManager) {
    super();
    this.apiNames = new Set()

    if (options.timeout) {
      let pingT = parseInt(options.timeout)
      if (pingT && pingT >= 1000) serverOption.timeout = pingT
    }

    if (options.monitorPeriod) {
      let monitorT = parseInt(options.monitorPeriod)
      if (monitorT && monitorT >= 1000) serverOption.monitorPeriod = monitorT
    }

    if (options.fileLogger) {
      serverOption.fileLogger.connection.use = true;
      serverOption.fileLogger.auth.use = true;
      serverOption.fileLogger.attack.use = true;
    }

    if (options.showMessage) {
      serverOption.showMessage = options.showMessage
    }

    if (options.showMetric) {
      serverOption.showMetric = options.showMetric
    }

    if (options.timeout) {
      serverOption.timeout = options.timeout
    }

    if (options.port) {
      serverOption.port = parseInt(options.port)
    }
    
    if (options.congPort) {
      serverOption.congPort = parseInt(options.congPort)
    }
    
    this.manager = new Manager(this, authManager, remoteManager)
    if (serverOption.port) this.startWSServer(serverOption.port)
    if( serverOption.congPort) this.startCongServer(serverOption.congPort)
    
    // console.log('serverOption:', serverOption)
  }


  startWSServer(port) {

    console.log('opening WebSocket Server:', port)
    this.wss = new WebSocketServer({ port })
    // this.wss.setMaxListeners(0)

    this.wss.on('error', (err) => {
      console.error('### ws server error:', err.message)
      if(err.code == 'EADDRINUSE'){
        process.exit()
      }
    })

    this.wss.on('close', (err) => {
      console.log('### WS server closed.', err)
    })

    this.wss.on('connection', (ws, req) => {
      ws.socketType = 'websocket'
      this.manager.addRemote(ws, req)
    })


  }

  startCongServer( congPort ) {
    console.log('opening CongSocket Server:', congPort)

    this.congServer = net.createServer((socket) => {
      this.manager.addRemote(socket)
    })
      .on('error', (err) => {
        console.log('### cong server error:', err.message)
        if(err.code == 'EADDRINUSE'){
          process.exit()
        }
      }).listen( congPort, () => {
        // console.log('congsocket server bound' );
      });
  }



  api(target, api) {
   
    this.apiNames.add(target)

    // common checkPermission
    if (!api.checkPermission || typeof api.checkPermission != 'function') {
      throw new Error('wrong api interface. no checkPermission function.')
    }


    if(typeof api.request == 'function' && Array.isArray( api.commands )){
      console.log(`API TYPE1. A Class with one request function. target: ${target} list: ${api.commands}` )

      this.on(target, (remote, req) => {
        if (api.checkPermission(remote, req)) {
          api.request(remote, req)
        } else {
          remote.response(req.mid, STATUS.ERROR, "NO_PERMISSION.")
        }
      })

    }else{
      let apiList = []
      Object.keys(api).forEach(v => {
        if (typeof api[v] === 'function') apiList.push(v)
        console.log('api list',typeof api[v] ,v )
      })

      console.log(`API TYPE2. Multiple function list.  target: ${target} list:${apiList}`)

      this.on(target, (remote, req) => {
        let r;
        if (!api.checkPermission(remote, req)) {
          r = "NO_PERMISSION."
        } else {
          // if (apiList.includes(req.topic)) {
          if ( api[req.topic] ) {
        console.log(`API TYPE2. request target: ${target}  has topic:${req.topic}`)
            api[req.topic](remote, req)
            return
          } else {
            r = `target: ${req.target} has not topic name: ${req.topic}`
          }
        }

        remote.response(req.mid, STATUS.ERROR, r)
      })
    }

    return this
  }

}
