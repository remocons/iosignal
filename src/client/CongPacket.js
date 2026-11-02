import { Transform } from 'stream'
import MBP from 'meta-buffer-pack'

export const CongType = {
  TYPE_LEN1: 1,
  TYPE_LEN2: 2,
  TYPE_LEN3: 3,
  TYPE_LEN4: 4
}

// support LittleEndian system.
export function pack(payload) {

  if( payload.byteLength == undefined ) payload = Buffer.from(payload)
  
  if (payload.byteLength < 256) { //one byte len
    return MBP.pack(
      MBP.MB('#type', '8', CongType.TYPE_LEN1),
      MBP.MB('#payloadLen1', '8', payload.byteLength),
      MBP.MB('#payload', payload)
    )

  } else if (payload.byteLength < 65536) {  // 2bytes len
    return MBP.pack(
      MBP.MB('#type', '8', CongType.TYPE_LEN2),
      MBP.MB('#payloadLen2', '16L', payload.byteLength),
      MBP.MB('#payload', payload)
    )

  } else if (payload.byteLength < 2 ** 24) {  // 3bytes len
    let len4Buffer = Buffer.alloc(4)
    len4Buffer.writeUint32LE(payload.byteLength)
    let cropLen3 = len4Buffer.subarray(0, 3)
    return MBP.pack(
      MBP.MB('#type', '8', CongType.TYPE_LEN3),
      MBP.MB('#payloadLen3', cropLen3),
      MBP.MB('#payload', payload)
    )

  } else { //use 4 bytes.
    return MBP.pack(
      MBP.MB('#type', '8', CongType.TYPE_LEN4),
      MBP.MB('#payloadLen4', '32L', payload.byteLength),
      MBP.MB('#payload', payload)
    )
  }

}

export class CongRx extends Transform {
  /**
   * @param {import('stream').TransformOptions & { maxFrameSize?: number }} [options] Stream options.
   *   maxFrameSize: largest payload to buffer (default unlimited). A larger frame is
   *   skipped without buffering and reported by an 'oversize' event (payloadSize).
   */
  constructor(options = {}) {
    const { maxFrameSize = Infinity, ...streamOptions } = options
    super(streamOptions)
    this.buffer = Buffer.alloc(0)
    this.frames = []
    this.rxi = 0;
    this.rxi_zero = 0;
    this.maxFrameSize = maxFrameSize;
    this.skipBytes = 0; // remaining payload bytes of an oversized frame to discard
  }



  _transform(chunk, encoding, callback) {
    this.addData(chunk)
    if (this.frames.length > 0) {
      this.frames.forEach(frame => {
        this.push(frame)
      })
      this.frames = []
    }
    callback()
  }


  addData(chunk) {
    let c = chunk.byteLength;
    let i = 0;
    while (c--) {
      this.rxi++
      if (chunk[i++] == 0) {
        this.rxi_zero++
      }
    }

    if (this.skipBytes > 0) {
      if (chunk.byteLength <= this.skipBytes) {
        this.skipBytes -= chunk.byteLength;
        return;
      }
      chunk = chunk.subarray(this.skipBytes);
      this.skipBytes = 0;
    }

    if (this.buffer.byteLength > 0) {
      this.buffer = Buffer.concat([this.buffer, chunk])
    } else {
      this.buffer = chunk
    }
    this.parse()
  }


  parse() {
    while (this.buffer.byteLength > 0) {
      const head = this.buffer[0];
      let headerLen;
      let payloadSize;

      if (head === CongType.TYPE_LEN1) {
        headerLen = 2;
        if (this.buffer.byteLength < headerLen) return;
        payloadSize = this.buffer.readUint8(1);
      } else if (head === CongType.TYPE_LEN2) {
        headerLen = 3;
        if (this.buffer.byteLength < headerLen) return;
        payloadSize = this.buffer.readUint16LE(1);
      } else if (head === CongType.TYPE_LEN3) {
        headerLen = 4;
        if (this.buffer.byteLength < headerLen) return;
        payloadSize = this.buffer.readUint16LE(1) + this.buffer.readUint8(3) * 65536;
      } else if (head === CongType.TYPE_LEN4) {
        headerLen = 5;
        if (this.buffer.byteLength < headerLen) return;
        payloadSize = this.buffer.readUint32LE(1);
      } else {
        this.emit('wrong', this.buffer);
        this.buffer = Buffer.alloc(0);
        return;
      }

      // Decide as soon as the length is known: the header can advertise up to 4 GiB.
      // Skipping keeps frame boundaries, so later frames still parse.
      if (payloadSize > this.maxFrameSize) {
        this.emit('oversize', payloadSize);
        const available = this.buffer.byteLength - headerLen;
        if (available < payloadSize) {
          this.skipBytes = payloadSize - available;
          this.buffer = Buffer.alloc(0);
          return;
        }
        this.buffer = this.buffer.subarray(headerLen + payloadSize);
        continue;
      }

      const frameSize = headerLen + payloadSize;
      if (this.buffer.byteLength < frameSize) return;

      this.frames.push(this.buffer.subarray(headerLen, frameSize));
      if (this.buffer.byteLength === frameSize) {
        this.buffer = Buffer.alloc(0);
        return;
      }
      // Consume each complete frame without growing the call stack.
      this.buffer = this.buffer.subarray(frameSize);
    }
  }
}
