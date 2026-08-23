export function getSignalPack(tag: any, ...args: any[]): Buffer<ArrayBufferLike>;
export function parsePayload(args: any): {
    type: number;
    buffer: Uint8Array<ArrayBuffer> | Buffer<ArrayBufferLike> | null | undefined;
};
export function getPayloadFromSignalPack(signalPack: any): any;
