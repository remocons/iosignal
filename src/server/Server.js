import net from 'net'
import EventEmitter from 'events'
import { WebSocketServer } from 'ws'
import { Manager } from './Manager.js'
import { serverOption } from './serverOption.js'
import { STATUS } from '../api/api_constant.js'

export class Server extends EventEmitter {

  constructor(options, authManager) {
    super();
    this.apiNames = new Set()
    this.wss = {};
    this.port = null;
    this.congPort = null;

    if (options.timeout) {
      let pingT = parseInt(options.timeout)
      if (pingT && pingT >= 1000) serverOption.timeout = pingT
    }

    if (options.monitorPeriod) {
      let monitorT = parseInt(options.monitorPeriod)
      if (monitorT && monitorT >= 1000) serverOption.monitorPeriod = monitorT
    }


    if (options.showMessage) {
      serverOption.showMessage = options.showMessage
    }

    if (options.showMetric) {
      serverOption.showMetric = options.showMetric
    }

    if (options.port || options.port == 0) {
      this.port = parseInt(options.port)
    }

    if (options.httpServer) {
      this.httpServer = options.httpServer
    }

    if (options.congPort || options.congPort == 0) {
      this.congPort = parseInt(options.congPort)
    }

    this.manager = new Manager(this, authManager)

    this.serverCountToListen = 0;
    this.listeningServerCount = 0;
    if (this.port || this.port == 0 || this.httpServer) this.serverCountToListen++;
    if (this.congPort || this.congPort == 0) this.serverCountToListen++;

    if (this.serverCountToListen === 0) {
      process.nextTick(() => this.emit('ready'));
    } else {
      if (this.port || this.port == 0 || this.httpServer) this.startWSServer();
      if (this.congPort || this.congPort == 0) this.startCongServer();
    }

  }


  startWSServer() {

    // console.log('optoins', options )
    if (this.port || this.port == 0) {
      console.log('opening WebSocket Server port:', this.port)
      this.wss = new WebSocketServer({ port: this.port })
    } else if (this.httpServer) {
      console.log('opening WebSocket Server external httpServer:')
      this.wss = new WebSocketServer({ server: this.httpServer })
    } else {
      throw new TypeError(
        'One and only one of the "port", "httpServer"' +
        'must be specified'
      );
    }


    this.wss.once('listening', () => {
      this.port = this.wss.address().port;
      console.log('wss server bound port:',  this.port );
      this.listeningServerCount++;
      if (this.listeningServerCount === this.serverCountToListen) {
        this.emit('ready');
      }
    });

    // this.wss.setMaxListeners(0)

    this.wss.on('error', (err) => {
      console.error('### ws server error:', err.message)
      if (err.code == 'EADDRINUSE') {
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

  startCongServer() {
    console.log('opening CongSocket Server port:', this.congPort)

    this.congServer = net.createServer((socket) => {
      this.manager.addRemote(socket)
    })
      .on('error', (err) => {
        console.log('### cong server error:', err.message)
        if (err.code == 'EADDRINUSE') {
          process.exit()
        }
      }).on('close', () => {
        console.log('### cong server closed.')
      }).listen(this.congPort, () => {
        this.congPort = this.congServer.address().port;
        console.log('congsocket server bound port:', this.congPort );
        this.listeningServerCount++;
        if (this.listeningServerCount === this.serverCountToListen) {
          this.emit('ready');
        }
      });
  }



  api(target, api) {

    this.apiNames.add(target)

    if (!api.checkPermission || typeof api.checkPermission != 'function') {
      throw new Error('wrong api interface. no checkPermission function.')
    }


    if (typeof api.request == 'function' && Array.isArray(api.commands)) {
      console.log(`API TYPE1. A Class with one request function. target: ${target} list: ${api.commands}`)

      this.on(target, (remote, req) => {
        if (api.checkPermission(remote, req)) {
          api.request(remote, req)
        } else {
          remote.response(req.mid, STATUS.ERROR, "NO_PERMISSION.")
        }
      })

    } else {
      let apiList = []
      Object.keys(api).forEach(v => {
        if (typeof api[v] === 'function') apiList.push(v)
        console.log('api list', typeof api[v], v)
      })

      console.log(`API TYPE2. Multiple function list.  target: ${target} list:${apiList}`)

      this.on(target, (remote, req) => {
        let r;
        if (!api.checkPermission(remote, req)) {
          r = "NO_PERMISSION."
        } else {
          if (api[req.topic]) {
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

  close(callback) {
    console.log('closing io-signal server...')
    if (this.manager) {
      this.manager.close()
    }

    let serverCount = 0;
    if (this.wss) serverCount++;
    if (this.congServer) serverCount++;

    if (serverCount === 0) {
      if (callback) process.nextTick(callback);
      return;
    }

    let closedCount = 0;
    const onClosed = () => {
      closedCount++;
      if (closedCount === serverCount) {
        console.log('io-signal server closed.')
        if (callback) callback();
      }
    }

    if (this.wss) {
      this.wss.close(() => {
        console.log('wss server closed.')
        onClosed()
      })
    }

    if (this.congServer) {
      this.congServer.close((err) => {
        if (err) console.error('congServer close error', err)
        console.log('cong server closed.')
        onClosed()
      })
    }
  }

}
