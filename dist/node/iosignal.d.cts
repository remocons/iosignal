import * as Boho from 'boho';
import Boho__default from 'boho';
export { default as Boho } from 'boho';
import * as buffer from 'buffer';
import { EventEmitter } from 'eventemitter3';
import { Transform } from 'stream';
import EventEmitter$1 from 'events';
export { default as MBP } from 'meta-buffer-pack';

type STATE = {
    CONNECTING: number;
    OPEN: number;
    SERVER_READY: number;
    AUTH_REQ: number;
    AUTH_RES: number;
    AUTH_FAIL: number;
    AUTH_CLEAR: number;
    CID_REQ: number;
    CID_RES: number;
    READY: number;
    CLOSING: number;
    CLOSED: number;
    STOP: number;
    REDIRECTING: number;
};
declare namespace STATE {
    let CONNECTING: number;
    let OPEN: number;
    let SERVER_READY: number;
    let AUTH_REQ: number;
    let AUTH_RES: number;
    let AUTH_FAIL: number;
    let AUTH_CLEAR: number;
    let CID_REQ: number;
    let CID_RES: number;
    let READY: number;
    let CLOSING: number;
    let CLOSED: number;
    let STOP: number;
    let REDIRECTING: number;
}
type ENC_MODE = {
    NO: number;
    YES: number;
    AUTO: number;
};
declare namespace ENC_MODE {
    let NO: number;
    let YES: number;
    let AUTO: number;
}
type SIZE_LIMIT = {
    TAG_LEN1: number;
    TAG_LEN2: number;
    CONNECTION_CHECKER_PERIOD: number;
    CLIENT_PING_PERIOD: number;
    PROMISE_TIMEOUT: number;
    DID: number;
    CID: number;
};
declare namespace SIZE_LIMIT {
    let TAG_LEN1: number;
    let TAG_LEN2: number;
    let CONNECTION_CHECKER_PERIOD: number;
    let CLIENT_PING_PERIOD: number;
    let PROMISE_TIMEOUT: number;
    let DID: number;
    let CID: number;
}
type PAYLOAD_TYPE = {
    EMPTY: number;
    TEXT: number;
    BINARY: number;
    OBJECT: number;
    MJSON: number;
    MBA: number;
};
declare namespace PAYLOAD_TYPE {
    let EMPTY: number;
    let TEXT: number;
    let BINARY: number;
    let OBJECT: number;
    let MJSON: number;
    let MBA: number;
}
type IOMsg = {
    SERVER_READY: number;
    CID_REQ: number;
    CID_RES: number;
    QUOTA_LEVEL: number;
    AUTH_CLEAR: number;
    SERVER_REDIRECT: number;
    LOOP: number;
    ECHO: number;
    PING: number;
    PONG: number;
    CLOSE: number;
    SIGNAL: number;
    SIGNAL_REQ: number;
    SIGNAL_E2E: number;
    SUBSCRIBE: number;
    SUBSCRIBE_REQ: number;
    UNSUBSCRIBE: number;
    SERVER_SIGNAL: number;
    IAM: number;
    IAM_RES: number;
    SET: number;
    RESPONSE_CODE: number;
    RESPONSE_MBP: number;
    CALL: number;
    RESPONSE: number;
    FLOW_MODE: number;
    WAIT: number;
    RESUME: number;
    TIME_OUT: number;
    OVER_SIZE: number;
    OVER_FLOW: number;
};
declare namespace IOMsg {
    let SERVER_READY_1: number;
    export { SERVER_READY_1 as SERVER_READY };
    let CID_REQ_1: number;
    export { CID_REQ_1 as CID_REQ };
    let CID_RES_1: number;
    export { CID_RES_1 as CID_RES };
    export let QUOTA_LEVEL: number;
    let AUTH_CLEAR_1: number;
    export { AUTH_CLEAR_1 as AUTH_CLEAR };
    export let SERVER_REDIRECT: number;
    export let LOOP: number;
    export let ECHO: number;
    export let PING: number;
    export let PONG: number;
    export let CLOSE: number;
    export let SIGNAL: number;
    export let SIGNAL_REQ: number;
    export let SIGNAL_E2E: number;
    export let SUBSCRIBE: number;
    export let SUBSCRIBE_REQ: number;
    export let UNSUBSCRIBE: number;
    export let SERVER_SIGNAL: number;
    export let IAM: number;
    export let IAM_RES: number;
    export let SET: number;
    export let RESPONSE_MBP: number;
    export let CALL: number;
    export let FLOW_MODE: number;
    export let WAIT: number;
    export let RESUME: number;
    export let TIME_OUT: number;
    export let OVER_SIZE: number;
    export let OVER_FLOW: number;
}
type STATUS = {
    OK: number;
    ERROR: number;
};
declare namespace STATUS {
    let OK: number;
    let ERROR: number;
}

/**
 * Core class for handling WebSocket communication.
 * @augments {EventEmitter}
 */
declare class IOCore extends EventEmitter<string | symbol, any> {
    /**
     * @param {string} url - The WebSocket URL to connect to.
     */
    constructor(url: string);
    /**
     * Client ID received from the server.
     * @type {string}
     */
    cid: string;
    /**
     * IP address received from the server.
     * @type {string}
     */
    ip: string;
    /**
     * The WebSocket instance.
     * @type {WebSocket | null}
     */
    socket: WebSocket | null;
    /**
     * The default server URL.
     * @type {string}
     */
    url: string;
    /**
     * Current connection state (number).
     * @type {number}
     */
    state: number;
    /**
     * Current connection state (string).
     * @type {string}
     */
    stateName: string;
    _stateRevision: number;
    /**
     * Transmitted message counter.
     * @type {number}
     */
    txCounter: number;
    /**
     * Received message counter.
     * @type {number}
     */
    rxCounter: number;
    /**
     * Transmitted bytes counter.
     * @type {number}
     */
    txBytes: number;
    /**
     * Received bytes counter.
     * @type {number}
     */
    rxBytes: number;
    /**
     * Last transmit/receive time.
     * @type {number}
     */
    lastTxRxTime: number;
    /**
     * Period for connection checker.
     * @type {number}
     */
    connectionCheckerPeriod: number;
    /**
     * Interval ID for connection checker.
     * @type {ReturnType<typeof setInterval> | null}
     */
    connectionCheckerIntervalID: ReturnType<typeof setInterval> | null;
    /**
     * Boho instance for encryption/decryption.
     * @type {Boho}
     */
    boho: Boho__default;
    /** @type {import('buffer').Buffer} */
    serverTimeNonce: buffer.Buffer;
    /**
     * Indicates if the connection is TLS (wss).
     * @type {boolean}
     */
    TLS: boolean;
    /**
     * Encryption mode.
     * @type {number}
     */
    encMode: number;
    /**
     * Indicates if authentication is used.
     * @type {boolean}
     */
    useAuth: boolean;
    /**
     * Nickname.
     * @type {string}
     */
    nick: string;
    /**
     * Set of subscribed channels.
     * @type {Set<string>}
     */
    channels: Set<string>;
    /**
     * Map of promises for message responses.
     * @type {Map<number, Array<Function>>}
     */
    promiseMap: Map<number, Array<Function>>;
    /**
     * Timeout for message promises.
     * @type {number}
     */
    promiseTimeOut: number;
    /**
     * Message ID for promises.
     * @type {number}
     */
    mid: number;
    /**
     * Quota level.
     * @type {number}
     */
    level: number;
    /**
     * Quota table for current level.
     * @type {object}
     */
    quota: object;
    /**
     * Server settings.
     * @type {object}
     */
    serverSet: object;
    /**
     * Map of linked channels.
     * @type {Map<string, Set<string>>}
     */
    linkMap: Map<string, Set<string>>;
    /** @private @type {Map<string, Map<string, Set<Function>>>} */
    private _linkHandlers;
    /** @private @type {Set<string>} */
    private _listenTags;
    /** @private @type {Set<string>} */
    private _manualSubscriptions;
    /**
     * Indicates if auto-reconnect is enabled.
     * @type {boolean}
     * @default true
     * */
    autoReconnect: boolean;
    /**
   * A flag to prevent duplicate close operations.
   * @type {boolean}
   * @private
   */
    private _closed;
    /**
     * Performs common cleanup for the connection. It rejects pending RPCs,
     * resets the socket reference, and sets the state to closed.
     * This method is guarded to only run once.
     * If autoReconnect is false, it also clears the keep-alive timer.
     */
    close(): void;
    /**
     * Disables auto-reconnect and closes the current connection.
     * The instance can be re-opened manually later. For complete cleanup, use destroy().
    */
    stop(): void;
    /**
     * Permanently destroys the instance, cleaning up all resources.
     * The instance will not be usable after this.
     */
    destroy(): void;
    /**
     * The core keep-alive logic.
     * The specific logic for checking the socket's state and reconnecting
     * is implemented keepConnection() in the child classes (IOWS, IOCongSocket, etc.).
     */
    keepAlive(): void;
    /**
     * Redirects the connection to a new URL.
     * @param {string} url2 - The new URL to redirect to.
     */
    redirect(url2: string): void;
    /**
     * Opens the WebSocket connection.
     * @param {string} [url] - Optional URL to connect to. If not provided, uses the instance's URL.
     */
    open(url?: string): void;
    /**
     * Handles the 'open' event of the WebSocket. Resets the closed flag and sets the state to open.
     */
    onOpen(): void;
    /**
     * Handles the 'close' event of the WebSocket.
     */
    onClose(): void;
    /**
     * Manually logs in with provided ID and key.
     * @param {string} id - The user ID. or 'id.key'
     * @param {string} key - The user key.
     * @returns {this}
     */
    login(id: string, key: string): this;
    /**
     * Sets up authentication for auto-login.
     * @param {string} id - The user ID. or 'id.Key'
     * @param {string} key - The user key.
     * @returns {this}
     */
    auth(id: string, key: string): this;
    /**
     * Handles incoming data from the WebSocket.
     * @param {Buffer} buffer - The incoming data buffer.
     */
    onData(buffer: Buffer$1): void;
    did: any;
    uid: any;
    /**
     * Sends an IAM (I Am) message to the server.
     * @param {string} [title] - Optional title for the IAM message.
     */
    iam(title?: string): void;
    /**
     * Sends a PING message to the server.
     */
    ping(): void;
    /**
     * Sends a PONG message to the server.
     */
    pong(): void;
    /**
     * Sends an ECHO message to the server.
     * @param {*} [args] - Optional arguments to echo.
     */
    echo(args?: any): void;
    /**
     * Sends binary data.
     * @param {...any} data - Data to send.
     */
    bin(...data: any[]): void;
    /**
     * Sends data over the WebSocket.
     * @param {Buffer} data - The data buffer to send.
     */
    send(data: Buffer$1): void;
    /**
     * Determines if encryption should be used based on current mode and TLS status.
     * @returns {boolean}
     */
    getEncryptionMode(): boolean;
    /**
     * Sends data with encryption based on the encryption mode.
     * @param {Buffer} data - The data buffer to send.
     * @param {boolean} [useEncryption] - Optional. Force encryption or not. If undefined, uses default policy.
     */
    send_enc_mode(data: Buffer$1, useEncryption?: boolean): void;
    /**
     * Sets a message promise for a given message ID.
     * @param {number} mid - The message ID.
     * @returns {Promise<any>}
     */
    setMsgPromise(mid: number): Promise<any>;
    /**
     * Tests and resolves/rejects a promise based on the incoming buffer.
     * @param {Buffer} buffer - The incoming data buffer.
     */
    testPromise(buffer: Buffer$1): void;
    /**
     * alias of signal()
     * Sends a signal with a tag and arguments.
     * @param {string} tag - The signal tag.
     * @param {...any} args - Arguments for the signal.
     */
    publish(tag: string, ...args: any[]): void;
    /**
     * Sends a signal with a tag and arguments.
     * @param {string} tag - The signal tag.
     * @param {...any} args - Arguments for the signal.
     * @throws {TypeError} If tag is not a string.
     */
    signal(tag: string, ...args: any[]): void;
    /**
     * Decrypts E2E data.
     * @param {Buffer} data - The encrypted data.
     * @param {string} key - The decryption key.
     * @returns {Buffer}
     */
    decrypt_e2e(data: Buffer$1, key: string): Buffer$1;
    /**
     * Sends an E2E (End-to-End) encrypted signal.
     * @param {string} tag - The signal tag.
     * @param {Buffer} data - The data to encrypt and send.
     * @param {string} key - The encryption key.
     * @throws {TypeError} If tag is not a string.
     */
    signal_e2e(tag: string, data: Buffer$1, key: string): void;
    /**
     * Sets a value in the store.
     * @param {string} storeName - The name of the store.
     * @param {...any} args - Arguments to set.
     * @returns {Promise<any>}
     */
    set(storeName: string, ...args: any[]): Promise<any>;
    /**
     * Gets a value from the store.
     * @param {string} storeName - The name of the store.
     * @returns {Promise<any>}
     */
    get(storeName: string): Promise<any>;
    /**
     * Sends a request to a target and topic.(remote service call)
     * @param {string} target - The target(service name) of the request.
     * @param {string} topic - The topic(service function name) of the request.
     * @param {...any} args - Optional arguments for the request.
     * @returns {Promise<any>}
     */
    call(target: string, topic: string, ...args: any[]): Promise<any>;
    /**
     * Subscribes to a channel or channels.
     * @param {string} tag - The tag(s) of the channel(s) to subscribe to (comma-separated).
     * @throws {TypeError} If tag is invalid, exceeds the length limit, or contains a direct-receive subscription.
     */
    subscribe(tag: string): void;
    /**
     * Sends subscriptions stored by listen()/link() on each CID-ready transition,
     * including reconnection. This automates subscription setup for simple clients.
     */
    subscribe_channels(): void;
    /**
     * Unsubscribes from a channel or channels.
     * @param {string} [tag=""] - The tag(s) of the channel(s) to unsubscribe from (comma-separated). If empty, unsubscribes from all.
     * @throws {TypeError} If tag is invalid, exceeds the length limit, or contains a direct-receive subscription.
     */
    unsubscribe(tag?: string): void;
    /**
     * Convenience API for simple clients (for example, CLI tools): register a
     * tag handler once and remember its subscription in channels. For subscription
     * tags, register before connection readiness; the CID-ready flow subscribes on initial connection
     * and again after reconnect, without application-level ready/subscribe code.
     * This does not send a subscription immediately, even if already ready.
     * For precise subscription/send ordering or dynamic subscriptions, use
     * on() with subscribe() in a ready handler instead.
     * Direct signals need no subscription: use on/listen('@') for all direct
     * signals, or on/listen('@topic') for an exact topic. Direct handlers can be
     * registered before or after readiness, before the message arrives.
     * Dispatch is synchronous: '@' first, then '@topic' when tag is not '@'.
     * Returning false does not cancel dispatch; a thrown error interrupts it.
     * @param {string} tag - The tag to listen on.
     * @param {Function} handler - The callback function to handle the signal.
     * @throws {TypeError} If tag is not a string, handler is not a function, or tag length is invalid.
     */
    listen(tag: string, handler: Function): void;
    /**
     * Associates handlers with a local component for scoped teardown.
     * Direct tags (@ or @topic) only register local handlers. Other tags also
     * subscribe now and are remembered for reconnection.
     * @param {string} to - The local component identifier, not a server target.
     * @param {string} tag - The exact event tag.
     * @param {Function} handler - The callback receiving (tag, ...args).
     * @throws {TypeError} If the arguments or subscription tags are invalid.
     */
    link(to: string, tag: string, handler: Function): void;
    /**
     * Removes only one local component's handlers for a tag. Direct tags never
     * send an unsubscribe. Shared subscriptions and explicit subscriptions remain.
     * @param {string} to - The local component identifier.
     * @param {string} tag - The exact linked tag.
     * @throws {TypeError} If the arguments are invalid.
     */
    unlink(to: string, tag: string): void;
    /**
     * Removes this local component's links without removing other listeners.
     * @param {string} to - The local component identifier.
     * @throws {TypeError} If the component identifier is not a string.
     */
    unlinkAll(to: string): void;
    /**
     * Gets connection metrics.
     * @returns {{tx: number, rx: number, txb: number, rxb: number, last: number}}
     */
    getMetric(): {
        tx: number;
        rx: number;
        txb: number;
        rxb: number;
        last: number;
    };
    /**
     * Gets the current connection state.
     * @returns {number}
     */
    getState(): number;
    /**
     * Gets the current connection state name.
     * @returns {string}
     */
    getStateName(): string;
    /**
     * Gets security-related information.
     * @returns {{useAuth: boolean, isTLS: boolean, isAuthorized: boolean, encMode: number, usingEncryption: boolean}}
     */
    getSecurity(): {
        useAuth: boolean;
        isTLS: boolean;
        isAuthorized: boolean;
        encMode: number;
        usingEncryption: boolean;
    };
    /**
     * Changes the connection state and emits events.
     * @param {string} state - The new state name (e.g., 'ready', 'closed').
     * @param {string} [emitEventAndMessage] - Optional message to emit with the state change event.
     *
     * 주의.
     * 1. 상태가 변경 될 때만 'change' 이벤트 호출된다.
     * 2. emitEventAndMessage 옵션 값이 지정되야 해당 이벤트 이름이 호출된다.
     *   보통 이벤트 이름과 동일하게 적거나 이벤트 상황 안내문을 넣는다.
     * 3. 두 상태값 갱신 후 change, 개별 이벤트 순서로 호출한다.
     *    콜백에서 다른 상태로 전이하면 이전 상태의 개별 이벤트는 생략한다.
     * @returns {boolean} Whether this transition is still current after callbacks.
     */
    stateChange(state: string, emitEventAndMessage?: string): boolean;
}
type Buffer$1 = Boho.Buffer;

declare function pack(payload: any): Buffer<ArrayBufferLike>;
declare class CongRx extends Transform {
    buffer: Buffer<ArrayBuffer>;
    frames: any[];
    rxi: number;
    rxi_zero: number;
    _transform(chunk: any, encoding: any, callback: any): void;
    addData(chunk: any): void;
    parse(): void;
}

declare class IOCongSocket extends IOCore {
    constructor(url: any);
    congRx: CongRx | null | undefined;
    keepConnection(): void;
    createConnection(url: any): void;
    onTCPSocketMessage(data: any): void;
    socket_send(data: any): void;
}

declare class IOWS extends IOCore {
    constructor(url: any);
    keepConnection(): void;
    createConnection(url: any): void;
    onWebSocketMessage(data: any): void;
    socket_send(data: any): void;
}

declare class FileLogger {
    constructor(path: any);
    file: number;
    log(msg: any): void;
}

declare class Metrics {
    constructor(manager: any);
    manager: any;
    metricsPack: {
        remotes: number[];
        channels: number[];
        txBytes: number[];
        rxBytes: number[];
        unixTime: number[];
        period: number;
    };
    tickId: number;
    close(): void;
    oneline(prn: any): {
        lastSSID: any;
        remotes: any;
        channels: any;
        txBytes: any;
        rxBytes: any;
    };
    getRemotes(prn: any): string[];
    getCIdList(prn: any): any[];
    getChannelList(prn: any): any[];
    getSubscribers(ch: any): any[];
    getRemoteByCId(cid: any, mode?: number): {
        ip: any;
        id: any;
        ssid: any;
        cid: any;
        uid: any;
        uptime: number;
        tx: any;
        rx: any;
        txBytes: any;
        rxBytes: any;
        nick?: undefined;
        isSecure?: undefined;
        isAuth?: undefined;
        encMode?: undefined;
        channels?: undefined;
        set?: undefined;
        retain?: undefined;
        result?: undefined;
    } | {
        ip: any;
        uptime: number;
        nick: any;
        ssid: any;
        id?: undefined;
        cid?: undefined;
        uid?: undefined;
        tx?: undefined;
        rx?: undefined;
        txBytes?: undefined;
        rxBytes?: undefined;
        isSecure?: undefined;
        isAuth?: undefined;
        encMode?: undefined;
        channels?: undefined;
        set?: undefined;
        retain?: undefined;
        result?: undefined;
    } | {
        ip: any;
        uptime: number;
        nick: any;
        ssid: any;
        isSecure: any;
        isAuth: any;
        encMode: any;
        id?: undefined;
        cid?: undefined;
        uid?: undefined;
        tx?: undefined;
        rx?: undefined;
        txBytes?: undefined;
        rxBytes?: undefined;
        channels?: undefined;
        set?: undefined;
        retain?: undefined;
        result?: undefined;
    } | {
        ip: any;
        uptime: number;
        channels: any[];
        set: any[];
        retain: any[];
        id?: undefined;
        ssid?: undefined;
        cid?: undefined;
        uid?: undefined;
        tx?: undefined;
        rx?: undefined;
        txBytes?: undefined;
        rxBytes?: undefined;
        nick?: undefined;
        isSecure?: undefined;
        isAuth?: undefined;
        encMode?: undefined;
        result?: undefined;
    } | {
        result: string;
        ip?: undefined;
        id?: undefined;
        ssid?: undefined;
        cid?: undefined;
        uid?: undefined;
        uptime?: undefined;
        tx?: undefined;
        rx?: undefined;
        txBytes?: undefined;
        rxBytes?: undefined;
        nick?: undefined;
        isSecure?: undefined;
        isAuth?: undefined;
        encMode?: undefined;
        channels?: undefined;
        set?: undefined;
        retain?: undefined;
    } | undefined;
}

declare class Manager {
    constructor(server: any, authManager: any);
    server: any;
    pingPeriod: number;
    pingGrace: number;
    txBytes: number;
    rxBytes: number;
    authManager: any;
    connectionLogger: FileLogger | undefined;
    attackLogger: FileLogger | undefined;
    remotes: Set<any>;
    cid2remote: Map<any, any>;
    retain_messages: Map<any, any>;
    channel_map: Map<any, any>;
    CHANNEL_PREFIX: string;
    CID_PREFIX: string;
    metrics: Metrics;
    lastSSID: number;
    pingGroups: Set<any>[];
    nextPingGroup: number;
    pingGroupCursor: number;
    heartbeatPending: Map<any, any>;
    pingTickMs: number;
    heartbeatStopped: boolean;
    pingIntervalID: NodeJS.Timeout;
    monitIntervalID: number | undefined;
    heartbeatTick(): void;
    addRemote(socket: any, req: any): void;
    removeRemote(remote: any): void;
    serverSignal(obj: any): void;
    getSignalTag(buffer: any): string;
    getNewSignalTagMessage(buffer: any, newTag: any): Buffer<ArrayBuffer> | null;
    deligateSignal(remote: any, tag: any, ...args: any[]): void;
    adminSignal(cid: any, message: any): "no cid" | undefined;
    serverSignalTo(tag: any, ...args: any[]): "no cid" | undefined;
    sender(tag: any, remote: any, message: any): (string | number)[];
    subscribe(chArr: any, remote: any): any;
    unsubscribe(chArr: any, remote: any): void;
    monitor(): void;
    closeRemoteByCId(cid: any): 0 | 1;
    close(): void;
}

declare class Server extends EventEmitter$1<[never]> {
    /**
     * @param {object} options Server configuration.
     * @param {any} [authManager] Optional authentication manager.
     */
    constructor(options: object, authManager?: any);
    security: any;
    serviceNames: Set<any>;
    wss: {};
    port: number | null;
    congPort: number | null;
    httpServer: any;
    wsPath: any;
    manager: Manager;
    serverCountToListen: number;
    listeningServerCount: number;
    startWSServer(): void;
    startCongServer(): void;
    congServer: any;
    /**
     * RPC service register.
     * service: service_name <string>
     * service_module <function module|class instance>
     * return this
     */
    attach(service: any, service_module: any): this;
    /**
     * @param {() => void} [callback] Called when the server has closed.
     */
    close(callback?: () => void): void;
}

declare namespace serverOption {
    export let clientTracking: boolean;
    export let port: null;
    export let congPort: null;
    export let httpServer: null;
    export let wsPath: null;
    export let timeout: number;
    export let pingTimeoutGrace: number;
    export let showMessage: string;
    export let showMetric: number;
    export let showChannel: number;
    export let monitorPeriod: number;
    export namespace fileLogger {
        namespace connection {
            let use: boolean;
            let path: string;
        }
        namespace auth {
            let use_1: boolean;
            export { use_1 as use };
            let path_1: string;
            export { path_1 as path };
        }
        namespace attack {
            let use_2: boolean;
            export { use_2 as use };
            let path_2: string;
            export { path_2 as path };
        }
    }
    export namespace useQuota {
        let signalSize: boolean;
        let publishCounter: boolean;
        let trafficRate: boolean;
        let disconnect: boolean;
    }
    export let defaultQuotaIndex: number;
    export let adminLevel: number;
    export namespace debug {
        let slow: boolean;
        let delay: number;
        let showAuthInfo: boolean;
    }
    export namespace retain {
        let isAvailable: boolean;
        let limitSize: number;
        let limitCounter: number;
    }
    export namespace security {
        let maxClockSkewMs: number;
        let authChallengeMaxAgeMs: number;
        let maxReplayEntries: number;
    }
    export namespace auth_1 {
        let delay_auth_fail: number;
    }
    export { auth_1 as auth };
    export let membersOnly: boolean;
}

declare function isPrivateIP(ip: any): boolean;
declare function numberWithCommas(x: any): any;
declare function getIPv4HexString(ipStr: any): string;
declare function getLocalAddress(): string;
declare function delay(ms: any): Promise<any>;

declare class BohoAuth {
    constructor(keyProvider: any);
    keyProvider: any;
    keepOldConnection: boolean;
    authLogger: FileLogger | undefined;
    send_auth_fail(peer: any, reason: any): void;
    verify_auth_req(auth_req: any, peer: any): Promise<any>;
    getAuth(id: any): Promise<any>;
    getAuthIdList(): Promise<any>;
    addAuth(id: any, keyStr: any, cid: any, level?: number): Promise<any>;
    delAuth(id: any): Promise<any>;
    save(): Promise<any>;
}

declare class FileKeyProvider {
    constructor(_path: any);
    AUTH: Map<any, any>;
    path: string;
    loadAuthInfoFile_JS(path: any): void;
    loadAuthInfoFile_JSON(path: any): void;
    getAuth(id: any): Promise<any>;
    getAuthIdList(): Promise<any[]>;
    addAuth(id: any, keyStr: any, cid: any, level?: number): void;
}

declare class RedisKeyProvider {
    constructor(redisClient: any);
    redis: any;
    getAuth(id: any): Promise<any>;
    getAuthIdList(): Promise<any>;
    addAuth(id: any, keyStr: any, cid?: string, level?: number): Promise<any>;
    delAuth(id: any): Promise<any>;
    save(id: any): Promise<any>;
}

declare class StringKeyProvider {
    constructor(authInfo: any);
    AUTH: Map<any, any>;
    getAuth(id: any): Promise<any>;
    getAuthIdList(): Promise<any[]>;
    addAuth(id: any, keyStr: any, cid: any, level?: number): void;
}

declare function checkPermission$1(remote: any): boolean;
/**
 * client api call example:  await io.call('reply','echo','hello')
 */
declare function echo(remote: any, req: any): Promise<void>;
/**
 * client api call example:  await io.call('reply','date')
 */
declare function date(remote: any, req: any): Promise<void>;
/**
 * client api call example:  await io.call('reply','unixtime')
 */
declare function unixtime(remote: any, req: any): Promise<void>;
declare const commands$1: string[];

declare const replyService_date: typeof date;
declare const replyService_echo: typeof echo;
declare const replyService_unixtime: typeof unixtime;
declare namespace replyService {
  export {
    checkPermission$1 as checkPermission,
    commands$1 as commands,
    replyService_date as date,
    replyService_echo as echo,
    replyService_unixtime as unixtime,
  };
}

declare function checkPermission(remote: any): boolean;
declare function call(remote: any, req: any): Promise<void>;
declare const commands: string[];

declare const sudoService_call: typeof call;
declare const sudoService_checkPermission: typeof checkPermission;
declare const sudoService_commands: typeof commands;
declare namespace sudoService {
  export {
    sudoService_call as call,
    sudoService_checkPermission as checkPermission,
    sudoService_commands as commands,
  };
}

declare class RedisService {
    constructor(redisClient: any, _minLevel: any);
    redisClient: any;
    minLevel: any;
    commands: string[];
    checkPermission(remote: any, req: any): boolean;
    call(remote: any, req: any): Promise<void>;
}

declare function getSignalPack(tag: any, ...args: any[]): Buffer<ArrayBufferLike>;
declare function parsePayload(args: any): {
    type: number;
    buffer: Uint8Array<ArrayBuffer> | Buffer<ArrayBufferLike> | null | undefined;
};
declare function getPayloadFromSignalPack(signalPack: any): any;

declare const version: string;

export { BohoAuth, CongRx, ENC_MODE, FileKeyProvider, FileLogger, IOWS as IO, IOCongSocket, IOMsg, PAYLOAD_TYPE, RedisKeyProvider, RedisService, SIZE_LIMIT, STATE, STATUS, Server, StringKeyProvider, delay, getIPv4HexString, getLocalAddress, getPayloadFromSignalPack, getSignalPack, isPrivateIP, numberWithCommas, pack, parsePayload, replyService, serverOption, sudoService, version };
