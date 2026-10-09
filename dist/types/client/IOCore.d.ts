/**
 * Core class for handling WebSocket communication.
 * @augments {EventEmitter}
 */
export class IOCore extends EventEmitter<string | symbol, any> {
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
    boho: Boho;
    /** @type {import('buffer').Buffer} */
    serverTimeNonce: import("buffer").Buffer;
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
    onData(buffer: Buffer): void;
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
    send(data: Buffer): void;
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
    send_enc_mode(data: Buffer, useEncryption?: boolean): void;
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
    testPromise(buffer: Buffer): void;
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
    decrypt_e2e(data: Buffer, key: string): Buffer;
    /**
     * Sends an E2E (End-to-End) encrypted signal.
     * @param {string} tag - The signal tag.
     * @param {Buffer} data - The data to encrypt and send.
     * @param {string} key - The encryption key.
     * @throws {TypeError} If tag is not a string.
     */
    signal_e2e(tag: string, data: Buffer, key: string): void;
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
export type IOMsg = import("../common/constants.js").IOMsg;
export type PAYLOAD_TYPE = import("../common/constants.js").PAYLOAD_TYPE;
export type SIZE_LIMIT = import("../common/constants.js").SIZE_LIMIT;
export type ENC_MODE = import("../common/constants.js").ENC_MODE;
export type STATE = import("../common/constants.js").STATE;
export type quotaTable = any;
export type Buffer = import("boho").Buffer;
import { EventEmitter } from "eventemitter3";
import Boho from "boho";
