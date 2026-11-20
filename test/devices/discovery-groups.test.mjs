// A group has no owner, so no close comes for it: the scanner forgets one that stops answering #search.
import test from 'node:test'
import assert from 'node:assert/strict'
import { DeviceScanner } from '../../devices/shared/discovery.js'

function fakeIo() {
  const handlers = {}
  const sent = []
  return {
    handlers, sent,
    on() {}, removeListener() {}, getStateName: () => 'ready', unlinkAll() {}, unlink() {},
    signal(tag) { sent.push(tag) },
    link(scope, tag, handler) { handlers[tag] = handler },
  }
}

test('a found group that no longer answers #search is forgotten; one that answers stays', t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] })
  const io = fakeIo()
  const scanner = new DeviceScanner(io, { known: () => ['#mine'] })
  // In small steps, as time passes: one large tick runs the timers it creates out of order.
  const wait = ms => { for (let left = ms; left > 0; left -= 500) t.mock.timers.tick(Math.min(500, left)) }
  try {
    t.mock.timers.tick(1)
    io.handlers['#notify']('#notify', '#lab')
    io.handlers['#notify']('#notify', '#live')
    scanner.track('#mine')
    assert.deepEqual([...scanner.devices.keys()].sort(), ['#lab', '#live', '#mine'])

    // Asked again later: only #live answers.
    const before = io.sent.filter(tag => tag === '#search').length
    wait(15000)
    assert.ok(io.sent.filter(tag => tag === '#search').length > before)
    io.handlers['#notify']('#notify', '#live')
    wait(3000)
    assert.deepEqual([...scanner.devices.keys()].sort(), ['#live', '#mine']) // a known group stays

    // A search a person makes checks the same way.
    scanner.search()
    wait(3000)
    assert.deepEqual([...scanner.devices.keys()], ['#mine'])
  } finally {
    scanner.dispose()
  }
})
