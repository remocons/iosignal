// The device rules folder (devices/): files that load in Node, the official types, the example devices,
// and the places where an application adds widgets, pictures and types of its own.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as rules from '../../devices/shared/index.js';
import { validateSchema, registerWidget, WIDGET_NAMES } from '../../devices/shared/schema.js';
import { registerView, renderView, pickView, VIEW_KINDS, escapeHtml } from '../../devices/shared/view.js';

const devices = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'devices');
const files = dir => fs.readdirSync(path.join(devices, dir)).sort();

test('the rules load in Node from one entry', () => {
  for (const name of ['DeviceScanner', 'parseName', 'parseUi', 'formatName', 'formatUi', 'isExtendedUi', 'validateSchema',
    'pickSchema', 'renderView', 'pickView', 'parseState', 'formatState', 'applyCommand', 'imageWidgets', 'decodeImage', 'e2eSession']) {
    assert.ok(name in rules, name);
  }
});

test('components and the runner parse; they import only files of this folder and the host client', () => {
  for (const dir of ['components', 'runner']) {
    for (const file of files(dir)) {
      execFileSync(process.execPath, ['--check', path.join(devices, dir, file)]);
      const text = fs.readFileSync(path.join(devices, dir, file), 'utf8');
      for (const [, spec] of text.matchAll(/(?:\bfrom\s*|\bimport\s*\(?\s*)['"]([^'"]+)['"]/g)) {
        if (!spec.startsWith('.')) { assert.ok(spec.startsWith('node:'), `${file}: ${spec}`); continue; }
        if (spec === '../lib/io.js') continue; // the IOSignal browser client, served by the host
        assert.ok(fs.existsSync(path.join(devices, dir, spec)), `${file}: ${spec}`);
      }
    }
  }
});

test('every official type file is a valid screen and is listed in index.json', () => {
  const index = JSON.parse(fs.readFileSync(path.join(devices, 'types', 'index.json'), 'utf8'));
  const listed = new Set(JSON.stringify(index).match(/[a-z][a-z0-9-]*\.\d+/g));
  for (const file of files('types').filter(name => name !== 'index.json')) {
    const checked = validateSchema(JSON.parse(fs.readFileSync(path.join(devices, 'types', file), 'utf8')), { requireType: true });
    assert.equal(checked.ok, true, `${file}: ${checked.errors?.join('; ')}`);
    assert.ok(listed.has(file.replace(/\.json$/, '')), `${file} is not in index.json`);
  }
});

test('the example devices are valid device files', () => {
  for (const file of files('examples')) {
    const out = execFileSync(process.execPath, [path.join(devices, 'runner', 'device-runner.js'), '--inspect', path.join(devices, 'examples', file)], { encoding: 'utf8' });
    assert.equal(JSON.parse(out).ok, true, `${file}: ${out}`);
  }
});

test('an application can add a widget and a picture kind; unknown ones are still refused', () => {
  const screen = { schema: 1, title: 'Mixer', controls: [{ widget: 'knob-x', label: 'Gain', key: 'gain', max: 11 }] };
  assert.equal(validateSchema(screen).ok, false);
  registerWidget('knob-x', (input, { errors, path, out }) => {
    if (typeof input.key !== 'string') errors.push(`${path}.key: needed`);
    else out.key = input.key;
    if (Number.isInteger(input.max)) out.max = input.max;
  });
  const checked = validateSchema(screen);
  assert.equal(checked.ok, true, checked.errors?.join('; '));
  assert.deepEqual(checked.schema.controls[0], { widget: 'knob-x', label: 'Gain', key: 'gain', max: 11 });
  assert.equal(validateSchema({ ...screen, controls: [{ widget: 'knob-x', label: 'x' }] }).ok, false);
  assert.throws(() => registerWidget('switch', () => {}), /widget name/);
  assert.throws(() => registerWidget('Bad', () => {}), /widget name/);
  assert.ok(!WIDGET_NAMES.includes('knob-x'), 'the rules list stays the official one');

  const view = { kind: 'meter-x', key: 'level' };
  assert.equal(pickView({ view }), null);
  assert.equal(renderView(view, { level: '5' }), '');
  registerView('meter-x', (v, state) => `<b>${escapeHtml(state[v.key])}</b>`);
  assert.equal(pickView({ view }), view);
  assert.equal(renderView(view, { level: '<5>' }), '<b>&lt;5&gt;</b>');
  registerView('broken-x', () => { throw new Error('bad') });
  assert.equal(renderView({ kind: 'broken-x' }, {}), '', 'a failing picture draws nothing');
  assert.throws(() => registerView('bulb', () => ''), /view kind/);
  assert.ok(!VIEW_KINDS.includes('meter-x'));
});

test('public device files never import the private folder', () => {
  for (const dir of ['shared', 'components', 'runner']) {
    for (const file of files(dir)) {
      const text = fs.readFileSync(path.join(devices, dir, file), 'utf8');
      assert.doesNotMatch(text, /(?:from|import)\s*\(?\s*['"][^'"]*\/private\//, `${dir}/${file}`);
    }
  }
});

test('the private folder is never in the public allowlist', { skip: !fs.existsSync(path.join(devices, '..', '..', 'iosignal', 'scripts', 'public-files.json')) && 'the public repository is not checked out beside this one' }, () => {
  const policy = JSON.parse(fs.readFileSync(path.join(devices, '..', '..', 'iosignal', 'scripts', 'public-files.json'), 'utf8'));
  for (const name of [...policy.sync, ...policy.dist]) assert.ok(!/(^|\/)devices\/private\//.test(name), name);
});


test('public device files and tests name no private repository or path', () => {
  const pattern = new RegExp(['_iosig' + 'nal', 'agent-' + 'work', 'remocon' + '_kr', 'mon_' + 'remocon', '/Us' + 'ers/'].join('|'));
  const tests = path.join(devices, '..', 'test', 'devices');
  const checked = [
    ...['shared', 'components', 'runner', 'examples', 'types', 'conformance'].flatMap(dir => files(dir).map(file => path.join(devices, dir, file))),
    ...fs.readdirSync(tests).map(file => path.join(tests, file)),
  ];
  for (const file of checked) assert.doesNotMatch(fs.readFileSync(file, 'utf8'), pattern, file);
});

test('applyCommand: ? changes nothing (state check)', async () => {
  const { applyCommand } = await import('../../devices/shared/simulate.js')
  assert.deepEqual(applyCommand({ on: '1' }, '?'), { state: { on: '1' }, changed: false })
})
