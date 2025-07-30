export function getSignalPack(tag: any, ...args: any[]): Buffer<ArrayBufferLike>;
export function parsePayload(args: any): {
    type: number;
    buffer: Uint8Array<ArrayBufferLike> | Buffer<ArrayBufferLike>;
};
export function getPayloadFromSignalPack(signalPack: any): any;
