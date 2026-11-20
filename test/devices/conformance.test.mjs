// The JavaScript rules answer every case of devices/conformance/device-rules.json (Kotlin and C++ read the same file).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseName, formatName, isExtendedUi, parseUi, formatUi } from '../../devices/shared/discovery.js';
import { parseState } from '../../devices/shared/state.js';
import { parseList } from '../../devices/shared/schema.js';

const cases = JSON.parse(fs.readFileSync(new URL('../../devices/conformance/device-rules.json', import.meta.url), 'utf8'));

test('$name: parse and format', () => {
  for (const { input, name, group } of cases.name.cases) assert.deepEqual(parseName(input), { name, group }, JSON.stringify(input));
  for (const { input, output } of cases.formatName.cases) assert.equal(formatName(input), output, JSON.stringify(input));
});

test('$ui: extended or button list, parse and format', () => {
  for (const { input, extended, parsed } of cases.ui.cases) {
    assert.equal(isExtendedUi(input), extended, JSON.stringify(input));
    assert.deepEqual(parseUi(input), parsed, JSON.stringify(input));
  }
  for (const { input, buttons } of cases.ui.cases) assert.deepEqual(parseList(parseUi(input).ui ?? ''), buttons, JSON.stringify(input));
  for (const { input, output } of cases.formatUi.cases) assert.equal(formatUi(input), output, JSON.stringify(input));
});

test('$state: key=value pairs', () => {
  for (const { input, fields } of cases.state.cases) {
    const { _, ...parsed } = parseState(input);
    assert.deepEqual(parsed, fields, JSON.stringify(input));
  }
});
