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

    this.wss.on('close', () => {
      console.log('### WS server is closed.')
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
        console.log('### congsocket server is closed.')
      }).listen(this.congPort, () => {
        this.congPort = this.congServer.address().port;
        console.log('congsocket server bound port:', this.congPort );
        this.listeningServerCount++;
        if (this.listeningServerCount === this.serverCountToListen) {
          this.emit('ready');
        }
      });
  }

/**
 * API register.
 * target:  api_name <string>
 * api: api_module <function module|class instance>
 * return this
 */
  api(target, api) {

    if( typeof target !== 'string'){
      throw new Error(`api( target ,api ) target name is not a string.`)
    }
    if (!api.checkPermission || typeof api.checkPermission != 'function') {
      throw new Error(`API ${target} : no checkPermission or not a function.`)
    }
    if(!api.commands || !Array.isArray(api.commands) ){
      throw new Error(`API ${target} : no commands or !Array.`)
    }
    
    // API TYPE 1. single request() function.
    if ( api.request && typeof api.request == 'function' ) {
      this.on(target, async (remote, req) => {
        try {
          if (!api.checkPermission(remote, req)) {
            remote.response(req.mid, STATUS.ERROR, "NO_PERMISSION.")
            return
          }
          if( api.commands.includes( req.topic )){
            console.log('server api req', req )
            await api.request(remote, req)
          }else{
            remote.response(req.mid, STATUS.ERROR, "UNKNOWN_COMMAND");
          }
        } catch (error) {
          console.error(`Unhandled API Error in target [${target}]:`, error);
          remote.response(req.mid, STATUS.ERROR, "INTERNAL_SERVER_ERROR");
        }
      })
    } else {
      // API TYPE 2. multiple functions.
      this.on(target, async (remote, req) => {
        try {
          if (!api.checkPermission(remote, req)) {
            remote.response(req.mid, STATUS.ERROR, "NO_PERMISSION.")
            return
          }
          if( api.commands.includes( req.topic )){
            await api[req.topic](remote, req)
          }else{
            remote.response(req.mid, STATUS.ERROR, "UNKNOWN_COMMAND");
          }
        } catch (error) {
          console.error(`Unhandled API Error in target [${target}]:`, error);
          remote.response(req.mid, STATUS.ERROR, "INTERNAL_SERVER_ERROR");
        }
      })
    }
    this.apiNames.add(target)
    console.log(`[API registed: ${target} ] accept commands: ${api.commands}`)
    return this
  }

  close(callback) {
    console.log('closing iosignal server...')
    if (this.manager) {
      this.manager.close()
    }

    this.apiNames.forEach(v => this.removeAllListeners(v))
    this.apiNames.clear()

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
        if (err) console.error('congServer close error', err)
        // console.log('cong server closed.')
        onClosed()
      })
    }
  }

}
