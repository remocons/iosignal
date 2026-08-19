import {MBP} from 'iosignal'

export const Meta = {

  SERVER_TIME_NONCE: MBP.meta(  // 13
    MBP.MB('header','8', 0),
    MBP.MB('unixTime','32L', 0),
    MBP.MB('milTime','32L', 0 ),
    MBP.MB('nonce', Buffer.alloc(4))
  ),

  AUTH_REQ: MBP.meta( // 45
    MBP.MB('header','8', 0),
    MBP.MB('id8',Buffer.alloc(8)),
    MBP.MB('nonce', Buffer.alloc(4)),
    MBP.MB('hmac32', Buffer.alloc(32))
  ),

  AUTH_RES: MBP.meta( // 33
    MBP.MB('header','8', 0),
    MBP.MB('hmac32', Buffer.alloc(32))
  ),


  ENC_PACK: MBP.meta(  //25 + payload
    MBP.MB('type','8',0),
    MBP.MB('len','32L',0),  // pure xdata size.
    MBP.MB('salt12', Buffer.alloc(12)),  // sec,mil,rand
    MBP.MB('hmac',8,0)
    // MBP.MB( 'xdata', encData )
    ),


  ENC_488: MBP.meta(   // 21 + payload
    MBP.MB('type','8', 0 ),
    MBP.MB('len','32L', 0 ),
    MBP.MB('otpSrc8', Buffer.alloc(8) ),
    MBP.MB('hmac8', Buffer.alloc(8) )
    // MBP.MB('xdata', encData )
    )

  }

console.log( Meta.ENC_488 )

const MB = MBP.MB;

  let mbPack = MBP.pack(
MB('a','8',120),
MB('b','16',64000),
MB('c', Buffer.alloc(1000) ),
MB('c2', 1000, 0)  //c와 동일한 역활.
)

let mbObj = MBP.unpack( mbPack)
let a = mbObj.a
console.log('a', a)

let metaDetail = MBP.getMeta(mbPack ,true)

console.log(metaDetail)