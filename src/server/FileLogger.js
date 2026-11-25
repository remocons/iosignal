import fs from 'fs'

const MIB = 1024 * 1024
const RETRY_MS = 60 * 1000 // after a write error, lines are dropped this long before trying again

/**
 * Appends lines to a file, with size-based rotation. A write error never throws: it is reported
 * once, lines are dropped for a minute, then writing is tried again (a full disk may recover).
 *
 * Rotation: when the file reaches maxBytes it becomes `path.1` (`.1` → `.2` …, at most keep old
 * files) and a new file is started. maxBytes 0 turns rotation off. Another process may rotate the
 * same path (or logrotate may move it): the logger then reopens the path instead of rotating again.
 * With logrotate, `copytruncate` also works (writes append at the current end).
 */
export class FileLogger {
  /**
   * @param {string} path
   * @param {{ maxBytes?: number, keep?: number }} [options] defaults: 10 MiB, 5 old files
   */
  constructor(path, { maxBytes = 10 * MIB, keep = 5 } = {}) {
    this.path = path
    this.maxBytes = Number.isFinite(maxBytes) && maxBytes > 0 ? maxBytes : 0
    this.keep = Number.isInteger(keep) && keep > 0 ? keep : 1
    this.file = -1      // file descriptor; -1 while closed
    this.ino = 0
    this.size = 0       // bytes in the file, as far as this logger knows
    this.retryAt = 0    // after a write error: when to try again
    this.dropped = 0    // lines dropped since the last error
    this.#open()
  }

  #open() {
    try {
      this.file = fs.openSync(this.path, 'a')
      const stat = fs.fstatSync(this.file)
      this.ino = stat.ino
      this.size = stat.size
      return true
    } catch (error) {
      this.file = -1
      this.#failed(error)
      return false
    }
  }

  #failed(error) {
    if (!this.retryAt) console.error(`FileLogger ${this.path}: ${error?.code ?? error?.message ?? error}; lines are dropped for ${RETRY_MS / 1000}s`)
    this.retryAt = Date.now() + RETRY_MS
  }

  #closeFile() {
    if (this.file < 0) return
    try { fs.closeSync(this.file) } catch { }
    this.file = -1
  }

  // Before a write that would pass maxBytes: rotate, or follow a rotation done elsewhere.
  #rotateIfNeeded(adding) {
    if (!this.maxBytes || this.size + adding <= this.maxBytes) return
    let stat = null
    try { stat = fs.statSync(this.path) } catch { }
    if (!stat || stat.ino !== this.ino) { // moved or rotated by another writer: start on the new file
      this.#closeFile()
      this.#open()
      if (this.size + adding <= this.maxBytes) return
    } else if (stat.size + adding <= this.maxBytes) { // truncated elsewhere (copytruncate)
      this.size = stat.size
      return
    }
    this.#closeFile()
    try {
      for (let i = this.keep - 1; i >= 1; i--) {
        if (fs.existsSync(`${this.path}.${i}`)) fs.renameSync(`${this.path}.${i}`, `${this.path}.${i + 1}`)
      }
      fs.renameSync(this.path, `${this.path}.1`)
    } catch (error) {
      console.error(`FileLogger ${this.path}: rotation failed: ${error?.code ?? error?.message ?? error}`)
    }
    this.#open()
  }

  /** Appends one line (a newline is added). Returns false when the line was dropped. */
  writeLine(line) {
    const text = String(line).replace(/[\r\n]+/g, ' ') + '\n'
    if (this.retryAt) {
      if (Date.now() < this.retryAt) { this.dropped++; return false }
      this.retryAt = 0
      if (this.file < 0 && !this.#open()) { this.dropped++; return false }
    }
    if (this.file < 0) { this.dropped++; return false }
    const bytes = Buffer.byteLength(text)
    try {
      this.#rotateIfNeeded(bytes)
      if (this.file < 0) { this.dropped++; return false }
      if (this.dropped) {
        const note = `${new Date().toISOString()} [FileLogger] ${this.dropped} lines dropped after a write error\n`
        this.dropped = 0
        this.size += fs.writeSync(this.file, note)
      }
      this.size += fs.writeSync(this.file, text)
      return true
    } catch (error) {
      this.dropped++
      this.#failed(error)
      return false
    }
  }

  /** Appends a text line, prefixed with the time (ISO 8601, UTC). */
  log(msg) {
    return this.writeLine(`${new Date().toISOString()} ${msg}`)
  }

  /** Opens the path again, e.g. after logrotate moved the file without copytruncate. */
  reopen() {
    this.#closeFile()
    this.retryAt = 0
    this.#open()
  }

  close() {
    this.#closeFile()
  }
}

/**
 * One JSON object per line ({"at": ISO time, ...record}), for jq and fail2ban. log(text) writes
 * {"at", "event": "note", "text"} so text callers keep working.
 */
export class JsonLinesLogger extends FileLogger {
  write(record) {
    let line
    try {
      line = JSON.stringify({ at: new Date().toISOString(), ...record })
    } catch (error) {
      line = JSON.stringify({ at: new Date().toISOString(), event: 'unserializable', error: String(error?.message ?? error) })
    }
    return this.writeLine(line)
  }

  log(msg) {
    return this.write({ event: 'note', text: String(msg) })
  }
}
