import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createThrottle, renderCommand } from '../../devices/shared/command.js'

// A fake clock: setTimeout/clearTimeout and now() driven by advance(ms).
function clock() {
  let time = 1000
  let id = 0
  const timers = new Map()
  return {
    now: () => time,
    timers: {
      setTimeout(fn, ms) { timers.set(++id, { fn, at: time + ms }); return id },
      clearTimeout(handle) { timers.delete(handle) }
    },
    advance(ms) {
      const end = time + ms
      for (;;) {
        const next = [...timers.entries()].sort((a, b) => a[1].at - b[1].at).find(([, t]) => t.at <= end)
        if (!next) break
        timers.delete(next[0])
        time = next[1].at
        next[1].fn()
      }
      time = end
    }
  }
}

function setup(options) {
  const c = clock()
  const sent = []
  const throttle = createThrottle(value => sent.push(value), 150, c.timers, { now: c.now, ...options })
  return { c, sent, throttle }
}

test('renderCommand fills {v}', () => {
  assert.equal(renderCommand('level={v}', 70), 'level=70')
  assert.equal(renderCommand('', 'on'), 'on')
})

test('without answerMs: sends at most every ms, last value wins', () => {
  const { c, sent, throttle } = setup()
  throttle.call(1)
  assert.deepEqual(sent, [1])
  c.advance(50); throttle.call(2)
  c.advance(50); throttle.call(3)
  assert.deepEqual(sent, [1])
  c.advance(50)
  assert.deepEqual(sent, [1, 3])
  throttle.answered() // no effect without answerMs
  c.advance(200)
  assert.deepEqual(sent, [1, 3])
})

test('in flight: waits for the answer before the next value', () => {
  const { c, sent, throttle } = setup({ answerMs: 1000 })
  throttle.call(1)
  assert.deepEqual(sent, [1])
  assert.equal(throttle.inFlight, true)
  c.advance(100); throttle.call(2)
  c.advance(300); throttle.call(3)
  assert.deepEqual(sent, [1], 'nothing while the first command is unanswered')
  throttle.answered()
  assert.deepEqual(sent, [1, 3], 'answer came after the gap: the latest value goes at once')
  assert.equal(throttle.inFlight, true)
})

test('in flight: a fast answer still keeps the minimum gap', () => {
  const { c, sent, throttle } = setup({ answerMs: 1000 })
  throttle.call(1)
  c.advance(20); throttle.call(2)
  c.advance(10); throttle.answered()
  assert.deepEqual(sent, [1])
  c.advance(119)
  assert.deepEqual(sent, [1])
  c.advance(1)
  assert.deepEqual(sent, [1, 2], 'sent 150 ms after the first')
})

test('in flight: no answer → the next value goes after answerMs', () => {
  const { c, sent, throttle } = setup({ answerMs: 1000 })
  throttle.call(1)
  c.advance(200); throttle.call(2)
  c.advance(799)
  assert.deepEqual(sent, [1])
  c.advance(1)
  assert.deepEqual(sent, [1, 2])
  assert.equal(throttle.inFlight, true, 'the timed-out value is in flight again')
})

test('in flight: an answer with nothing pending frees the slot for the next call', () => {
  const { c, sent, throttle } = setup({ answerMs: 1000 })
  throttle.call(1)
  c.advance(400); throttle.answered()
  assert.equal(throttle.inFlight, false)
  throttle.call(2)
  assert.deepEqual(sent, [1, 2])
})

test('flush sends the final value at once, even in flight', () => {
  const { c, sent, throttle } = setup({ answerMs: 1000 })
  throttle.call(1)
  c.advance(50); throttle.call(2)
  throttle.flush(3)
  assert.deepEqual(sent, [1, 3])
  c.advance(2000)
  assert.deepEqual(sent, [1, 3], 'the dropped value 2 is not sent later')
})

test('flush without a value sends the pending one; same value is not repeated', () => {
  const { c, sent, throttle } = setup({ answerMs: 1000 })
  throttle.call(1)
  c.advance(50); throttle.call(2)
  throttle.flush()
  assert.deepEqual(sent, [1, 2])
  throttle.flush(2)
  assert.deepEqual(sent, [1, 2])
})

test('cancel drops the pending value and the answer wait', () => {
  const { c, sent, throttle } = setup({ answerMs: 1000 })
  throttle.call(1)
  c.advance(50); throttle.call(2)
  throttle.cancel()
  assert.equal(throttle.inFlight, false)
  c.advance(2000)
  assert.deepEqual(sent, [1])
})
