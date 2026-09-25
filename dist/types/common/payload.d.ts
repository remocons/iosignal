export function getSignalPack(tag: any, ...args: any[]): import("buffer").Buffer;
export function parsePayload(args: any): {
    type: number;
    buffer: Uint8Array<ArrayBuffer> | import("buffer").Buffer | null | undefined;
};
export function getPayloadFromSignalPack(signalPack: any): any;
