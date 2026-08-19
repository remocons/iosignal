import MBP from 'meta-buffer-pack'
import { PAYLOAD_TYPE, IOMsg } from "./constants.js";
const encoder = new TextEncoder()


export function getSignalPack(tag, ...args) {
  if (typeof tag !== 'string') throw TypeError('tag should be string.')
  let tagEncoded = encoder.encode(tag)
  let payload = parsePayload(args)

  let sigPack;
  if (payload.type == PAYLOAD_TYPE.EMPTY) {
    sigPack = MBP.pack(
      MBP.MB('#MsgType', '8', IOMsg.SIGNAL),
      MBP.MB('#tagLen', '8', tagEncoded.byteLength),
      MBP.MB('#tag', tagEncoded),
      MBP.MB('#payloadType', '8', payload.type)
    )
  } else if (payload.type == PAYLOAD_TYPE.MBA) {
    let mbaBuffer = MBP.pack(MBP.MBA(...args))
    sigPack = MBP.pack(
      MBP.MB('#MsgType', '8', IOMsg.SIGNAL),
      MBP.MB('#tagLen', '8', tagEncoded.byteLength),
      MBP.MB('#tag', tagEncoded),
      MBP.MB('#payloadType', '8', payload.type),
      MBP.MB('#mbaBuffer', mbaBuffer)
    )
  } else {
    sigPack = MBP.pack(
      MBP.MB('#MsgType', '8', IOMsg.SIGNAL),
      MBP.MB('#tagLen', '8', tagEncoded.byteLength),
      MBP.MB('#tag', tagEncoded),
      MBP.MB('#payloadType', '8', payload.type),
      MBP.MB('#payload', payload.buffer)
    )
  }
  return sigPack
}


export function parsePayload(args) {
  let type, pack;
  if (args.length == 0) {
    type = PAYLOAD_TYPE.EMPTY
    pack = null
  } else if (args.length == 1) {
    if (typeof args[0] === 'string' || typeof args[0] === 'number') {
      type = PAYLOAD_TYPE.TEXT
      pack = encoder.encode(args[0] + ".") // add null byte area.
      pack[pack.byteLength - 1] = 0 // set byte-zero : '\0'  in C/C++

    } else if (ArrayBuffer.isView(args[0]) || args[0] instanceof ArrayBuffer) {
      type = PAYLOAD_TYPE.BINARY
      pack = MBP.B8(args[0])
    } else if (typeof args[0] === 'object') {
      type = PAYLOAD_TYPE.OBJECT
      pack = encoder.encode(JSON.stringify(args[0]))
    } else {
      throw new Error('unknown payload arguments')
    }
  } else { // two or more arguments.
    let containsBuffer = false
    args.forEach(item => {
      if (ArrayBuffer.isView(item) || item instanceof ArrayBuffer) containsBuffer = true;
    })

    if (containsBuffer) {
      type = PAYLOAD_TYPE.MBA;
    } else {
      type = PAYLOAD_TYPE.MJSON;
      pack = encoder.encode(JSON.stringify(args))
    }

  }

  return { type: type, buffer: pack }
}

export function getPayloadFromSignalPack(signalPack) {
  let tagLen = signalPack.readUint8(1)
  return signalPack.subarray(3 + tagLen)
}