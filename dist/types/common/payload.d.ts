export function getSignalPack(tag: any, ...args: any[]): import("buffer").Buffer;
export function parsePayload(args: any): {
    type: number;
    buffer: Uint8Array<ArrayBuffer> | import("buffer").Buffer | null | undefined;
};
export function getPayloadFromSignalPack(signalPack: any): any;
/**
 * Arguments of a SIGNAL payload, as IO emits them after the tag: EMPTY [], TEXT [string] (the
 * trailing NUL that C/C++ senders add is removed), BINARY [the buffer itself], OBJECT [value],
 * MJSON [...values], MBA [...args]. null for an unknown payload type. Throws on malformed JSON/MBA.
 * @param {number} payloadType
 * @param {Uint8Array} payloadBuffer
 * @returns {any[] | null}
 */
export function decodeSignalArgs(payloadType: number, payloadBuffer: Uint8Array): any[] | null;
