/**
 * Browser WebSocket client extending IOCore.
 * @augments {IOCore}
 */
export default class IO extends IOCore {
    /**
     * The version of the client.
     * @type {string}
     */
    static version: string;
    /**
     * The binary type for WebSocket messages.
     * @type {string}
     */
    static binaryType: string;
    /**
     * The Boho library instance.
     * @type {typeof Boho}
     */
    static Boho: typeof Boho;
    /**
     * The MBP (MessagePack-Boho) instance.
     * @type {MBP}
     */
    static MBP: MBP;
    /**
     * The Buffer class from Boho.
     * @type {typeof import('buffer').Buffer}
     */
    static Buffer: typeof import("buffer").Buffer;
    /**
     * Constants used by the client.
     * @type {object}
     */
    static constants: object;
    /**
     * The WebSocket class to connect with; null uses the global WebSocket. Set it on IO or on a
     * subclass to connect through something with the browser WebSocket API (readyState,
     * binaryType, onopen/onmessage/onerror/onclose, send, close), e.g. a test double.
     * @type {(new (url: string) => WebSocket) | null}
     */
    static WebSocket: (new (url: string) => WebSocket) | null;
    /**
     * Tracks the number of IO instances created.
     * @type {number}
     */
    static instanceCount: number;
    /**
     * Tracks the number of WebSocket objects created.
     * @type {number}
     */
    static webSocketCount: number;
    boundBrowserVisiblePing: () => void;
    /**
     * Pings the server when the browser tab becomes visible.
     */
    browserVisiblePing(): void;
    /**
     * Keeps the connection alive by re-connecting if closed.
     */
    keepConnection(): void;
    /**
     * Makes the socket for a connection: new IO.WebSocket(url) (the class set on this client's
     * class), else the global WebSocket. Override it to choose the socket by URL.
     * @param {string} url - The URL to connect to.
     * @returns {WebSocket}
     */
    createWebSocket(url: string): WebSocket;
    /**
     * Creates a new WebSocket connection.
     * @param {string} url - The WebSocket URL to connect to.
     */
    createConnection(url: string): void;
    /**
     * Handles incoming WebSocket messages (arraybuffer type).
     * @param {MessageEvent} event - The WebSocket message event.
     */
    onWebSocketMessage(event: MessageEvent): void;
    /**
     * Handles incoming WebSocket messages (blob type).
     * @param {MessageEvent} event - The WebSocket message event.
     */
    onWebSocketMessageBlob(event: MessageEvent): Promise<void>;
    /**
     * Sends data over the WebSocket. Data is dropped while the socket is not open.
     * @param {BufferSource} data - The data to send.
     */
    socket_send(data: BufferSource): void;
}
export type MBP = typeof import("meta-buffer-pack").default;
export type Buffer = import("boho").Buffer;
import { IOCore } from "../IOCore.js";
import Boho from 'boho';
