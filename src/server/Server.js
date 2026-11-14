import net from 'net'
import http from 'http'
import EventEmitter from 'events'
import { WebSocketServer } from 'ws'
import { Manager } from './Manager.js'
import { Host } from './Host.js'
import { Dashboard } from './Dashboard.js'
import { serverOption } from './serverOption.js'
import { STATUS } from '../services/constant.js'
import { BohoAuth, validateDuplicateLogin } from '../auth/BohoAuth.js'
import { LocalKeyProvider } from '../auth/key_providers/LocalKeyProvider.js'

// Removed or renamed in 9.0, as Server options and as serverOption keys ('global': only as a
// serverOption key). An error names the replacement instead of the setting silently doing nothing.
const REMOVED = [
  ['showMessage', 'logMessages: true'],
  ['showMetric', "logStats: <interval ms> (for lists, the sudo service's remotes/channels commands)"],
  ['monitorPeriod', 'logStats: <interval ms>'],
  ['timeout', 'heartbeatInterval'],
  ['pingTimeoutGrace', 'heartbeatGrace'],
  ['retain.isAvailable', 'retain.enabled'],
  ['useQuota', 'quotas: named quota profiles, always enforced (null: unlimited)'],
  ['defaultQuotaIndex', "anonymousQuota: a quotas profile name; logins use their account's quota"],
  ['auth.delay_auth_fail', 'auth.failDelay', 'global'],
  ['adminLevel', "role: 'admin' in the account (key entry)", 'global'],
  ['clientTracking', 'nothing: it was never used', 'global'],
  ...['port', 'congPort', 'httpServer', 'wsPath'].map(name => [name, `new Server({ ${name} })`, 'global'])
]
const lookup = (object, path) => path.split('.').reduce((value, key) => value?.[key], object)

function checkRemoved(options) {
  for (const [path, replacement, scope] of REMOVED) {
    const sources = scope === 'global' ? [['serverOption.', serverOption]] : [['', options], ['serverOption.', serverOption]]
    for (const [prefix, source] of sources) {
      if (lookup(source, path) !== undefined) {
        throw new TypeError(`${prefix}${path} was removed in iosignal 9.0; use ${replacement}`)
      }
    }
  }
}

const MAX_TIMER_MS = 2147483647 // setTimeout limit

function integer(name, value, min, max = Number.MAX_SAFE_INTEGER) {
  if (!Number.isSafeInteger(value) || value < min || value > max) {
    throw new RangeError(`${name} must be an integer from ${min} to ${max}`)
  }
  return value
}
const positive = (name, value) => integer(name, value, 1)
const nonNegative = (name, value) => integer(name, value, 0)
const QUOTA_LIMITS = ['maxMessageBytes', 'fanout', 'msgPerSec', 'bytesPerSec', 'maxConnections']

// This Server's quota profiles: the defaults with each given profile merged over its default
// (a new name starts from no limits). Every limit is a positive integer or null (unlimited).
function quotaProfiles(given) {
  if (given !== undefined && (given === null || typeof given !== 'object')) {
    throw new TypeError('quotas must be an object')
  }
  const profiles = {}
  for (const name of new Set([...Object.keys(serverOption.quotas), ...Object.keys(given ?? {})])) {
    const profile = given?.[name]
    if (profile !== undefined && (profile === null || typeof profile !== 'object')) {
      throw new TypeError(`quotas.${name} must be an object`)
    }
    for (const key of Object.keys(profile ?? {})) {
      if (!QUOTA_LIMITS.includes(key)) throw new TypeError(`unknown option quotas.${name}.${key}`)
    }
    const base = serverOption.quotas[name] ?? Object.fromEntries(QUOTA_LIMITS.map(key => [key, null]))
    profiles[name] = { ...base, ...profile }
    for (const key of QUOTA_LIMITS) {
      if (profiles[name][key] !== null) positive(`quotas.${name}.${key}`, profiles[name][key])
    }
  }
  return profiles
}
function boolean(name, value) {
  if (typeof value !== 'boolean') throw new TypeError(`${name} must be a boolean`)
  return value
}

// A nested option group: this Server's own copy of the serverOption defaults with its options
// applied. Unknown keys are errors, so a typo does not silently do nothing.
function group(name, given, checks) {
  if (given !== undefined && (given === null || typeof given !== 'object')) {
    throw new TypeError(`${name} must be an object`)
  }
  for (const key of Object.keys(given ?? {})) {
    if (!(key in checks)) throw new TypeError(`unknown option ${name}.${key}`)
  }
  const merged = { ...serverOption[name], ...given }
  for (const [key, check] of Object.entries(checks)) check(`${name}.${key}`, merged[key])
  return merged
}

function resolveLogStats(value) {
  if (value === 0 || value === false) return 0
  return integer('logStats', value, 1000, MAX_TIMER_MS)
}

export class Server extends EventEmitter {

  /**
   * @param {object} options Server configuration.
   *   options.localAuth: login without a key list, for local testing. 'idKey' (key = ID) or
   *   { mode: 'idKey' | 'sharedKey', key, role, quota } (see LocalKeyProvider); the CID is the ID.
   *   Cannot be combined with authManager.
   *   Every other setting is this Server's own: given here, else the serverOption default, which is
   *   never modified. Nested groups (security, retain, quotas) are merged over their defaults;
   *   unknown or removed names are errors.
   *   options.heartbeatInterval: ms between liveness checks (default 50000).
   *   options.heartbeatGrace: extra ms a peer has to answer before it is closed (default 5000).
   *   options.trustProxy: when X-Forwarded-For/-Proto are used. 'private' (default) only from a
   *   loopback/private peer, true always, false never, or N trusted proxy hops.
   *   options.maxPayload: largest WebSocket message and CongSocket frame in bytes (default 32 MiB).
   *   options.maxBufferedBytes: close a peer whose unsent data exceeds this (default 64 MiB).
   *   options.membersOnly: drop signals from connections that are not authenticated.
   *   options.logMessages: log each received message after decryption: type and tag, never the payload.
   *   options.logStats: print a one-line summary every N ms (>= 1000; 0 = off); see stats().
   *   options.security: { maxClockSkewMs, authChallengeMaxAgeMs, maxReplayEntries }.
   *   options.retain: retained message limits, see serverOption.retain; adjustable later on server.retain.
   *   options.quotas: named quota profiles { name: { maxMessageBytes, fanout, msgPerSec, bytesPerSec,
   *   maxConnections } }, merged over serverOption.quotas; always enforced, null is unlimited.
   *   Adjustable later on server.quotas. The client is told its maxMessageBytes.
   *   options.anonymousQuota: profile of a connection that has not authenticated (default 'anonymous').
   *   options.duplicateLogin: 'keepOld' | 'keepNew' for this Server's connections; overrides the auth
   *   manager's own policy without changing it, so an auth manager can be shared between servers.
   *   options.dashboard: true or { path, access, panels, history, maxViewers, showIdentities } shows a live
   *   status page of the server and its hosts (see Dashboard.js); off by default. With `port` the Server
   *   serves it itself; with your own httpServer call server.dashboard.handle(req, res) in its handler.
   *   A failed listen (e.g. EADDRINUSE) is emitted as 'error'.
   * @param {any} [authManager] Optional authentication manager.
   */
  constructor(options, authManager) {
    super();
    if (options.localAuth !== undefined && options.localAuth !== null) {
      if (authManager) throw new TypeError('localAuth cannot be combined with an authManager')
      authManager = new BohoAuth(new LocalKeyProvider(options.localAuth))
    }
    // Each Server resolves its settings once, here: serverOption only supplies the defaults and is
    // never written, so servers in one process do not affect each other.
    checkRemoved(options);
    this.security = Object.freeze(group('security', options.security,
      { maxClockSkewMs: positive, authChallengeMaxAgeMs: positive, maxReplayEntries: positive }));
    // retain and quotas may be adjusted on a running server, e.g. server.quotas.basic.fanout = 50.
    this.retain = group('retain', options.retain, {
      enabled: boolean, limitSize: positive, limitCounter: positive, tagsPerOwner: positive,
      bytesPerOwner: positive, anonymousGraceMs: nonNegative, bytesPerConnection: positive, bytesTotal: positive });
    this.quotas = quotaProfiles(options.quotas);
    this.anonymousQuota = options.anonymousQuota ?? serverOption.anonymousQuota;
    if (!Object.hasOwn(this.quotas, this.anonymousQuota)) {
      throw new RangeError(`anonymousQuota must be one of the quotas: ${Object.keys(this.quotas).join(', ')}`)
    }
    this.heartbeatInterval = integer('heartbeatInterval',
      options.heartbeatInterval ?? serverOption.heartbeatInterval, 1, MAX_TIMER_MS);
    this.heartbeatGrace = integer('heartbeatGrace', options.heartbeatGrace ?? serverOption.heartbeatGrace, 0, MAX_TIMER_MS);
    this.maxPayload = positive('maxPayload', options.maxPayload ?? serverOption.maxPayload);
    this.maxBufferedBytes = positive('maxBufferedBytes', options.maxBufferedBytes ?? serverOption.maxBufferedBytes);
    this.logMessages = boolean('logMessages', options.logMessages ?? serverOption.logMessages);
    this.logStats = resolveLogStats(options.logStats ?? serverOption.logStats);
    this.trustProxy = options.trustProxy ?? serverOption.trustProxy;
    if (![true, false, 'private'].includes(this.trustProxy) &&
        !(Number.isSafeInteger(this.trustProxy) && this.trustProxy > 0)) {
      throw new RangeError("trustProxy must be true, false, 'private' or a positive integer");
    }
    this.membersOnly = boolean('membersOnly', options.membersOnly ?? serverOption.membersOnly);
    this.serviceNames = new Set()
    this.services = new Map()   // name -> service module (for lifecycle hooks)
    this.hosts = new Set()      // open hosts (server.host)
    // Stays null for a CongSocket-only server, so close() does not wait on a WebSocket server.
    this.wss = null;
    this.port = null;
    this.congPort = null;

    // Read by the auth manager for this server's connections; the auth manager itself is not
    // changed, since it may be shared. null: the auth manager's own policy.
    this.duplicateLogin = null;
    if (options.duplicateLogin !== undefined) {
      this.duplicateLogin = validateDuplicateLogin(options.duplicateLogin)
      if (authManager && !('duplicateLogin' in authManager)) {
        throw new TypeError('duplicateLogin: the auth manager does not support this option')
      }
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
    // The status page; null when off.
    this.dashboard = null
    if (options.dashboard) {
      try {
        this.dashboard = new Dashboard(this, options.dashboard)
      } catch (error) {
        this.manager.close() // a bad dashboard option must not leave the heartbeat timer running
        throw error
      }
    }

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
    if ((this.port || this.port == 0) && this.dashboard) {
      // The WebSocket server alone answers plain HTTP with 426; the dashboard needs pages too.
      this.ownHttp = http.createServer((req, res) => {
        if (!this.dashboard.handle(req, res)) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found') }
      })
      this.ownHttp.on('error', (err) => this.onListenerError('ws', err))
      this.wss = new WebSocketServer({ server: this.ownHttp, path: this.wsPath, maxPayload: this.maxPayload })
      this.ownHttp.listen(this.port)
    } else if (this.port || this.port == 0) {
      this.wss = new WebSocketServer({ port: this.port , path: this.wsPath, maxPayload: this.maxPayload })
    } else if (this.httpServer ) {
      this.wss = new WebSocketServer({ server: this.httpServer, path: this.wsPath, maxPayload: this.maxPayload })
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
    this.wss.on('error', (err) => this.onListenerError('ws', err))

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
      // Signals are small frames; send each immediately instead of waiting on Nagle.
      socket.setNoDelay(true)
      this.manager.addRemote(socket)
    })
      .on('error', (err) => this.onListenerError('cong', err))
      .on('close', () => {
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

  // A failed listen (e.g. EADDRINUSE) is the application's to handle: emitted as 'error',
  // which, like any EventEmitter, throws when nothing listens. Other errors are logged.
  onListenerError(name, err) {
    console.error(`### ${name} server error:`, err.message)
    if (err.syscall === 'listen') this.emit('error', err)
  }

  /**
   * Current server state, for monitoring. counters are cumulative since the server started
   * (rates are the reader's to compute from two snapshots). Enumerates connections once.
   * @returns {{ at: number, connections: { total: number, authenticated: number, anonymous: number,
   *   websocket: number, tcp: number }, channels: number, retained: { channel: number, bytes: number },
   *   counters: { rxMessages: number, rxBytes: number, txMessages: number, txBytes: number,
   *   publishes: number, deliveryAttempts: number, quotaExcluded: number, peerRxLimitSkipped: number },
   *   memory: { rss: number, heapUsed: number } }}
   */
  stats() {
    return this.manager.metrics.snapshot()
  }

  /**
   * Server-side logic (a game, a room) in this process. Signals clients send to the inbound tags go
   * to the host only, with the server's view of the sender; clients cannot send to the tags it owns.
   * @param {string} name 1-64 characters of A-Z a-z 0-9 _ . -
   * @param {{ inbound: string[], own?: string[], fanout?: number|null,
   *   retain?: { tags?: number, bytes?: number } }} options
   *   inbound: channel tags clients send to the host (a trailing '*' is a prefix). Not relayed.
   *   own: channel tags only the host publishes, and '@topic' unicast topics only the host sends.
   *   fanout: most subscribers one publish reaches (default null: all).
   *   retain: budget of the host's retained ('$') values (default: retain.tagsPerOwner/bytesPerOwner).
   * @returns {Host}
   */
  host(name, options) {
    const host = new Host(this.manager, name, options)
    host.once('close', () => this.hosts.delete(host))
    this.hosts.add(host)
    return host
  }

/**
 * RPC service register.
 * service: service_name <string>
 * service_module <function module|class instance>
 * return this
 */
  attach(service, service_module) {

    if( typeof service !== 'string'){
      throw new Error(`attach service name is not a string.`)
    }
    if (!service_module.checkPermission || typeof service_module.checkPermission != 'function') {
      throw new Error(`Service ${service} : no checkPermission or not a function.`)
    }
    if(!service_module.commands || !Array.isArray(service_module.commands) ){
      throw new Error(`Service ${service} : no commands or !Array.`)
    }
    
    const handleError = (remote, req, error) => {
      console.error(`Unhandled Service Error in service [${service}]:`, error);
      if (remote._closing) return;
      // A disconnected transport can also fail while reporting the service error.
      try {
        remote.response(req.mid, STATUS.ERROR, "INTERNAL_SERVER_ERROR");
      } catch (responseError) {
        console.error(`Service error response failed [${service}]:`, responseError);
      }
    };
    const useCall = typeof service_module.call === 'function';
    this.on(service, (remote, req) => {
      try {
        if (!service_module.checkPermission(remote, req)) {
          remote.response(req.mid, STATUS.ERROR, "NO_PERMISSION.");
          return;
        }
        if (!service_module.commands.includes(req.topic)) {
          remote.response(req.mid, STATUS.ERROR, "UNKNOWN_COMMAND");
          return;
        }
        // Keep synchronous invocation and the service receiver; also observe async failures.
        const result = useCall
          ? service_module.call(remote, req)
          : service_module[req.topic](remote, req);
        Promise.resolve(result).catch(error => handleError(remote, req, error));
      } catch (error) {
        handleError(remote, req, error);
      }
    });
    this.serviceNames.add(service)
    this.services.set(service, service_module)
    // console.log(`[Service attached: ${service} ] accept commands: ${service_module.commands}`)
    return this
  }

  /**
   * @param {() => void} [callback] Called when the server has closed.
   */
  close(callback) {
    console.log('closing iosignal server...')
    if (this.dashboard) this.dashboard.close()
    for (const host of [...this.hosts]) host.close()
    if (this.manager) {
      this.manager.close()
    }

    this.serviceNames.forEach(v => this.removeAllListeners(v))
    this.serviceNames.clear()
    // this.services is kept so onRemoteClose cleanup still runs for sockets that close later.

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
        if (!this.ownHttp) return onClosed()
        // The HTTP server this Server made for the dashboard closes with it.
        this.ownHttp.close(() => onClosed())
        this.ownHttp.closeAllConnections?.()
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
