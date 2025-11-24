import net from 'net'
import EventEmitter from 'events'
import { WebSocketServer } from 'ws'
import { Manager } from './Manager.js'
import { serverOption } from './serverOption.js'
import { STATUS } from '../services/constant.js'

export class Server extends EventEmitter {

  constructor(options, authManager) {
    super();
    this.serviceNames = new Set()
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
    if (options.membersOnly) {
      serverOption.membersOnly = options.membersOnly
    }


    if (options.port || options.port == 0) {
      this.port = parseInt(options.port)
    }

    if (options.httpServer) {
      this.httpServer = options.httpServer
    }

    if (options.wsPath) {
      this.wsPath = options.wsPath
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
      throw new Error('Cannot create Server: At least one of "port", "httpServer", or "congPort" must be specified.');
    } else {
      if (this.port || this.port == 0 || this.httpServer) this.startWSServer();
      if (this.congPort || this.congPort == 0) this.startCongServer();
    }

  }


  startWSServer() {
    // console.log('optoins', options )
    if (this.port || this.port == 0) {
      this.wss = new WebSocketServer({ port: this.port , path: this.wsPath })
    } else if (this.httpServer ) {
      this.wss = new WebSocketServer({ server: this.httpServer, path: this.wsPath })
    } else {
      throw new TypeError(
        'One and only one of the "port", "httpServer"' +
        'must be specified'
      );
    }

    this.wss.once('listening', () => {
      this.port = this.wss.address().port;
      // console.log('wss server bound port:',  this.port );
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

    this.wss.on('close', () => {
      // console.log('### WS server is closed.')
    })

    this.wss.on('connection', (ws, req) => {
      ws.socketType = 'websocket'
      this.manager.addRemote(ws, req)
    })


  }

  startCongServer() {
    this.congServer = net.createServer((socket) => {
      this.manager.addRemote(socket)
    })
      .on('error', (err) => {
        console.log('### cong server error:', err.message)
        if (err.code == 'EADDRINUSE') {
          process.exit()
        }
      }).on('close', () => {
        // console.log('### congsocket server is closed.')
      }).listen(this.congPort, () => {
        this.congPort = this.congServer.address().port;
        // console.log('congsocket server bound port:', this.congPort );
        this.listeningServerCount++;
        if (this.listeningServerCount === this.serverCountToListen) {
          this.emit('ready');
        }
      });
  }

/**
 * RPC service register.
 * target:  service_name <string>
 * service: service_module <function module|class instance>
 * return this
 */
  attach(target, service_module) {

    if( typeof target !== 'string'){
      throw new Error(`service( target ,service ) target name is not a string.`)
    }
    if (!service_module.checkPermission || typeof service_module.checkPermission != 'function') {
      throw new Error(`Service ${target} : no checkPermission or not a function.`)
    }
    if(!service_module.commands || !Array.isArray(service_module.commands) ){
      throw new Error(`Service ${target} : no commands or !Array.`)
    }
    
    // Service TYPE 1. single call() function.
    if ( service_module.call && typeof service_module.call == 'function' ) {
      this.on(target, (remote, req) => {
        try {
          if (!service_module.checkPermission(remote, req)) {
            remote.response(req.mid, STATUS.ERROR, "NO_PERMISSION.")
            return
          }
          if( service_module.commands.includes( req.topic )){
            // console.log('server service_module req', req )
            service_module.call(remote, req)
          }else{
            remote.response(req.mid, STATUS.ERROR, "UNKNOWN_COMMAND");
          }
        } catch (error) {
          console.error(`Unhandled Service Error in target [${target}]:`, error);
          remote.response(req.mid, STATUS.ERROR, "INTERNAL_SERVER_ERROR");
        }
      })
    } else {
      // Service TYPE 2. multiple functions.
      this.on(target, (remote, req) => {
        try {
          if (!service_module.checkPermission(remote, req)) {
            remote.response(req.mid, STATUS.ERROR, "NO_PERMISSION.")
            return
          }
          if( service_module.commands.includes( req.topic )){
            service_module[req.topic](remote, req)
          }else{
            remote.response(req.mid, STATUS.ERROR, "UNKNOWN_COMMAND");
          }
        } catch (error) {
          console.error(`Unhandled Service Error in target [${target}]:`, error);
          remote.response(req.mid, STATUS.ERROR, "INTERNAL_SERVER_ERROR");
        }
      })
    }
    this.serviceNames.add(target)
    // console.log(`[Service attached: ${target} ] accept commands: ${service_module.commands}`)
    return this
  }

  close(callback) {
    console.log('closing iosignal server...')
    if (this.manager) {
      this.manager.close()
    }

    this.serviceNames.forEach(v => this.removeAllListeners(v))
    this.serviceNames.clear()

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
        console.log('IOSignal server is closed.')
        if (callback) callback();
      }
    }

    if (this.wss) {
      this.wss.close(() => {
        // console.log('wss server closed.')
        onClosed()
      })
    }

    if (this.congServer) {
      this.congServer.close((err) => {
        // if (err) console.error('congServer close error', err)
        // console.log('cong server closed.')
        onClosed()
      })
    }
  }

}
