import { Server , IO, MBP } from 'iosignal'

let mbaPack = MBP.pack( 
    MBP.MBA(
        'name', 'hong', 
        'age', 33,
        Buffer.alloc(10000),
        Buffer.alloc(10000),
    ) 
)

let mbaMeta = MBP.getMetaDetail( mbaPack)
console.log('mbaMeta', mbaMeta )
// console.log('unpackMba', MBP.unpack( mbaPack ))
console.log('size', mbaPack.byteLength)