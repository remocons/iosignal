import MBP from 'meta-buffer-pack'
import { PAYLOAD_TYPE, IOMsg, SIZE_LIMIT } from "./constants.js";
const encoder = new TextEncoder()


export function getSignalPack(tag, ...args) {
  if (typeof tag !== 'string') throw TypeError('tag should be string.')
  let tagEncoded = encoder.encode(tag)
  if (tagEncoded.byteLength > SIZE_LIMIT.TAG_LEN1) throw TypeError('tag UTF-8 byte length exceeds 255')
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
const decoder = new TextDecoder()

/**
 * Arguments of a SIGNAL payload, as IO emits them after the tag: EMPTY [], TEXT [string] (the
 * trailing NUL that C/C++ senders add is removed), BINARY [the buffer itself], OBJECT [value],
 * MJSON [...values], MBA [...args]. null for an unknown payload type. Throws on malformed JSON/MBA.
 * @param {number} payloadType
 * @param {Uint8Array} payloadBuffer
 * @returns {any[] | null}
 */
export function decodeSignalArgs(payloadType, payloadBuffer) {
  switch (payloadType) {
    case PAYLOAD_TYPE.EMPTY:
      return []
    case PAYLOAD_TYPE.TEXT: {
      const end = payloadBuffer[payloadBuffer.byteLength - 1] === 0 ? payloadBuffer.byteLength - 1 : payloadBuffer.byteLength
      return [decoder.decode(payloadBuffer.subarray(0, end))]
    }
    case PAYLOAD_TYPE.BINARY:
      return [payloadBuffer]
    case PAYLOAD_TYPE.OBJECT:
      return [JSON.parse(decoder.decode(payloadBuffer))]
    case PAYLOAD_TYPE.MJSON: {
      const values = JSON.parse(decoder.decode(payloadBuffer))
      if (!Array.isArray(values)) throw new TypeError('MJSON payload is not an array')
      return values
    }
    case PAYLOAD_TYPE.MBA: {
      const mba = MBP.unpack(payloadBuffer)
      if (!mba) throw new TypeError('malformed MBA payload')
      return mba.args
    }
    default:
      return null
  }
}
