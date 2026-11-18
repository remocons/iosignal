import { Transform } from 'stream'
import { CongType, pack, addCongData } from './CongFrame.js'

// pack() and the parser live in CongFrame.js (no Node.js streams), so the server does not need
// 'stream' to parse CongSocket frames. CongRx is the same parser as a stream Transform.
export { CongType, pack }

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
    addCongData(this, chunk, (event, value) => this.emit(event, value))
  }
}
