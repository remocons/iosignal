import MBP from 'meta-buffer-pack'

// CongSocket framing without Node.js streams: pack() and the frame parser. The server's Remote
// uses CongParser directly; CongRx (CongPacket.js) wraps the same parser in a stream Transform.

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

/**
 * Adds a received chunk to a parser state and parses the complete frames into state.frames.
 * state: { buffer, frames, rxi, rxi_zero, maxFrameSize, skipBytes } (a CongParser or CongRx).
 * emit(event, value): 'wrong' (the unparsable buffer) or 'oversize' (payload size; the frame is
 * skipped without buffering). Shared by CongParser and CongRx so both parse alike.
 */
export function addCongData(state, chunk, emit) {
  let c = chunk.byteLength;
  let i = 0;
  while (c--) {
    state.rxi++
    if (chunk[i++] == 0) {
      state.rxi_zero++
    }
  }

  if (state.skipBytes > 0) {
    if (chunk.byteLength <= state.skipBytes) {
      state.skipBytes -= chunk.byteLength;
      return;
    }
    chunk = chunk.subarray(state.skipBytes);
    state.skipBytes = 0;
  }

  if (state.buffer.byteLength > 0) {
    state.buffer = Buffer.concat([state.buffer, chunk])
  } else {
    state.buffer = chunk
  }
  parseCongFrames(state, emit)
}

function parseCongFrames(state, emit) {
  while (state.buffer.byteLength > 0) {
    const head = state.buffer[0];
    let headerLen;
    let payloadSize;

    if (head === CongType.TYPE_LEN1) {
      headerLen = 2;
      if (state.buffer.byteLength < headerLen) return;
      payloadSize = state.buffer.readUint8(1);
    } else if (head === CongType.TYPE_LEN2) {
      headerLen = 3;
      if (state.buffer.byteLength < headerLen) return;
      payloadSize = state.buffer.readUint16LE(1);
    } else if (head === CongType.TYPE_LEN3) {
      headerLen = 4;
      if (state.buffer.byteLength < headerLen) return;
      payloadSize = state.buffer.readUint16LE(1) + state.buffer.readUint8(3) * 65536;
    } else if (head === CongType.TYPE_LEN4) {
      headerLen = 5;
      if (state.buffer.byteLength < headerLen) return;
      payloadSize = state.buffer.readUint32LE(1);
    } else {
      emit('wrong', state.buffer);
      state.buffer = Buffer.alloc(0);
      return;
    }

    // Decide as soon as the length is known: the header can advertise up to 4 GiB.
    // Skipping keeps frame boundaries, so later frames still parse.
    if (payloadSize > state.maxFrameSize) {
      emit('oversize', payloadSize);
      const available = state.buffer.byteLength - headerLen;
      if (available < payloadSize) {
        state.skipBytes = payloadSize - available;
        state.buffer = Buffer.alloc(0);
        return;
      }
      state.buffer = state.buffer.subarray(headerLen + payloadSize);
      continue;
    }

    const frameSize = headerLen + payloadSize;
    if (state.buffer.byteLength < frameSize) return;

    state.frames.push(state.buffer.subarray(headerLen, frameSize));
    if (state.buffer.byteLength === frameSize) {
      state.buffer = Buffer.alloc(0);
      return;
    }
    // Consume each complete frame without growing the call stack.
    state.buffer = state.buffer.subarray(frameSize);
  }
}

/**
 * CongSocket frame parser without streams: write(chunk) calls onFrame(payload) for each complete
 * frame, onWrong(buffer) for an unparsable stream and onOversize(payloadSize) for a frame larger
 * than maxFrameSize (skipped without buffering).
 */
export class CongParser {
  constructor({ maxFrameSize = Infinity, onFrame = null, onWrong = null, onOversize = null } = {}) {
    this.buffer = Buffer.alloc(0)
    this.frames = []
    this.rxi = 0;
    this.rxi_zero = 0;
    this.maxFrameSize = maxFrameSize;
    this.skipBytes = 0; // remaining payload bytes of an oversized frame to discard
    this.onFrame = onFrame
    this.onWrong = onWrong
    this.onOversize = onOversize
  }

  write(chunk) {
    addCongData(this, chunk, (event, value) => {
      if (event === 'wrong') this.onWrong?.(value)
      else this.onOversize?.(value)
    })
    const frames = this.frames
    this.frames = []
    for (const frame of frames) this.onFrame?.(frame)
  }

  /** Stops calling the handlers (the connection closed). */
  clear() {
    this.onFrame = this.onWrong = this.onOversize = null
    this.buffer = Buffer.alloc(0)
    this.frames = []
  }
}
