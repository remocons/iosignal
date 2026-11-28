// The v2 device rules in devices/shared/discovery.js and view.js: $name, $ui, and the picture.
import test from 'node:test'
import assert from 'node:assert/strict'
import { parseName, parseUi, isExtendedUi, formatName, formatUi, DeviceScanner } from '../../devices/shared/discovery.js'
import { pickView, renderView } from '../../devices/shared/view.js'

test('$name splits at the first colon; no category is left empty (shown as 미분류)', () => {
  assert.deepEqual(parseName('전등1:방1'), { name: '전등1', group: '방1' })
  assert.deepEqual(parseName('무지개:2층:거실'), { name: '무지개', group: '2층:거실' })
  assert.deepEqual(parseName('이름만'), { name: '이름만', group: '' })
  assert.equal(formatName({ name: 'a:b', group: '방' }), 'a b:방')
  assert.equal(formatName({ name: 'x' }), 'x')
})

test('$ui is extended only when its first key is t=, p= or v=; anything else is a button list', () => {
  for (const ui of ['ON,OFF,TOGGLE', 't', 'A,B,C', 'all=1,all=0', 'b=on']) assert.equal(isExtendedUi(ui), false, ui)
  for (const ui of ['t=iris.2;p=1;v=1', 'p=1', ' v=1;b=x']) assert.equal(isExtendedUi(ui), true, ui)
  assert.deepEqual(parseUi('t'), { ui: 't', legacyUi: true })
  assert.deepEqual(parseUi('t=switch4.1;b=all=1,all=0;zz=1'), { type: 'switch4.1', ui: 'all=1,all=0' })
  assert.deepEqual(parseUi('t=x;p;v=0'), { type: 'x' }) // p needs =1
  assert.equal(formatUi({ type: 'light.1', view: true, ui: 'on;off' }), 't=light.1;v=1;b=on off')
  assert.equal(formatUi({ ui: 'on,off' }), 'on,off')
})

test('a scanner reads $name and $ui, and leaves out a group whose $ui is a button list (legacy2)', () => {
  const handlers = {}
  const io = { on() {}, getStateName: () => 'idle', signal() {}, unlinkAll() {}, unlink() {}, link(scope, tag, handler) { handlers[tag] = handler } }
  const scanner = new DeviceScanner(io, { discover: false })
  scanner.track('?a1')
  handlers['?a1@$name']('?a1@$name', '전등:현관')
  handlers['?a1@$ui']('?a1@$ui', 't=light.1')
  handlers['?a1@$state']('?a1@$state', 'on=1')
  scanner.track('#old')
  handlers['#old$name']('#old$name', '사무실')
  handlers['#old$ui']('#old$ui', 'A,B')
  assert.deepEqual(scanner.list().map(d => [d.id, d.name, d.group, d.type]), [['?a1', '전등', '현관', 'light.1']])
  scanner.dispose()
})

test('a scanner keeps the $ui as sent (uiText): keys parseUi leaves out, such as r=1 of a REPL board', () => {
  const handlers = {}
  const io = { on() {}, getStateName: () => 'idle', signal() {}, unlinkAll() {}, unlink() {}, link(scope, tag, handler) { handlers[tag] = handler } }
  const scanner = new DeviceScanner(io, { discover: false })
  scanner.track('?b1')
  handlers['?b1@$ui']('?b1@$ui', 't=light.1;r=1')
  const device = scanner.devices.get('?b1')
  assert.equal(device.type, 'light.1')
  assert.equal(device.uiText, 't=light.1;r=1')
  handlers['?b1@$ui']('?b1@$ui', '')
  assert.equal(device.uiText, '')
  scanner.dispose()
})

test('the picture: the device $view first, then the type default; unknown kinds and bus values are not trusted', () => {
  assert.equal(pickView({ view: { kind: 'fan' }, typeView: { kind: 'bulb' } }).kind, 'fan')
  assert.equal(pickView({ view: { kind: 'rocket' }, typeView: { kind: 'bulb' } }).kind, 'bulb')
  assert.equal(pickView({}), null)
  assert.equal(renderView({ kind: 'rocket' }, {}), '')
  assert.match(renderView({ kind: 'relays', keys: ['<b>'] }, { '<b>': '1' }), /&lt;b&gt;/)
  assert.doesNotMatch(renderView({ kind: 'bulb' }, { on: '1', color: 'red;background:url(x)' }), /url\(x\)/)
})
