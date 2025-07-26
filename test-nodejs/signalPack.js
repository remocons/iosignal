import { parsePayload, getSignalPack, getPayloadFromSignalPack, PAYLOAD_TYPE, MBP } from 'iosignal'

const type0 = []
const type1t = ['a1']
const type1n = [11]
const type2 = [new Uint8Array(5)]
const type3 = [{ name: 'type3' }]
const type4a = ['a2', 222]
const type4b = [{ name: 'a3' }, 333]
const type5 = [{ a: 1 }, Buffer.from('BBBBBB')]

// zero or one argument support: 0:EMPTY, 1:TEXT , 2:BINARY signal payload type
console.log(PAYLOAD_TYPE[parsePayload(type0).type], type0) // empty
console.log(PAYLOAD_TYPE[parsePayload(type1t).type], type1t) // text
console.log(PAYLOAD_TYPE[parsePayload(type1n).type], type1n)  // number text. there is no Number type of signalPaylod.
console.log(PAYLOAD_TYPE[parsePayload(type2).type], type2)  // binary.

// over two arguments support: 3:Object, 4:MJSON and 5:MBA can hold Number item.
console.log(PAYLOAD_TYPE[parsePayload(type3).type], type3)  // Object 
console.log(PAYLOAD_TYPE[parsePayload(type4a).type], type4a) // MJSON
console.log(PAYLOAD_TYPE[parsePayload(type4b).type], type4b) // MJSON
console.log(PAYLOAD_TYPE[parsePayload(type5).type], type5)  // MBA


let signalTag = 'channel'
let signalPack = getSignalPack(signalTag, ...type5)
console.log('signalPack', signalPack)

let payloadBuffer = getPayloadFromSignalPack(signalPack)
let unpack = MBP.unpack(payloadBuffer)
console.log(unpack)



