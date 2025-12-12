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
     * @type {Boho}
     */
    static Boho: Boho;
    /**
     * The MBP (MessagePack-Boho) instance.
     * @type {MBP}
     */
    static MBP: MBP;
    /**
     * The Buffer class from Boho.
     * @type {Buffer}
     */
    static Buffer: Buffer;
    /**
     * Constants used by the client.
     * @type {object}
     */
    static constants: object;
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
    boundBrowserVisiblePing: any;
    /**
     * Pings the server when the browser tab becomes visible.
     */
    browserVisiblePing(): void;
    /**
     * Keeps the connection alive by re-connecting if closed.
     */
    keepConnection(): void;
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
     * Sends data over the WebSocket.
     * @param {BufferSource} data - The data to send.
     */
    socket_send(data: BufferSource): void;
}
export type Boho = import("boho").Boho;
export type MBP = typeof import("meta-buffer-pack");
export type Buffer = import("boho").Buffer;
import { IOCore } from "../IOCore.js";
