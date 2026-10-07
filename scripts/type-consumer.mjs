import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { root, run } from './public-policy.mjs';

// Check the shipped archive from outside the repository, with its own dependencies.
const consumer = fs.mkdtempSync(path.join(os.tmpdir(), 'iosignal-consumer-'));
try {
  fs.writeFileSync(path.join(consumer, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
  // verify is already running; invoking prepack here would recurse.
  const [archive] = JSON.parse(run('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', consumer], root, true));
  const nodeTypes = JSON.parse(fs.readFileSync(path.join(root, 'node_modules/@types/node/package.json'))).version;
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--omit=optional', path.join(consumer, archive.filename), `@types/node@${nodeTypes}`], consumer);
  const require = createRequire(path.join(consumer, 'package.json'));
  const names = Object.keys(require('iosignal')).sort();
  const nodeSource = `
import { ${names.join(', ')} } from 'iosignal';
import * as api from 'iosignal';
void [${names.join(', ')}];
const server = new Server({ port: 0 }, undefined);
server.on('listening', () => {});
const io = new IO('ws://localhost');
io.on('ready', () => {});
const tcp = new IOCongSocket('cong://localhost');
tcp.on('ready', () => {});
const packet: Uint8Array = getSignalPack('test', { ok: true });
const release: string = version;
MBP.pack(MBP.MB('value', 1));
const boho = new Boho();
// @ts-expect-error Root has named exports only.
api.default;
// @ts-expect-error Unknown exports must not silently become any.
api.UnknownExport;
// @ts-expect-error Server must be constructed.
Server({ port: 0 });
// @ts-expect-error version is a string.
const invalid: number = version;
void [packet, release, boho];
`;
  fs.writeFileSync(path.join(consumer, 'node.mts'), nodeSource);
  fs.writeFileSync(path.join(consumer, 'node.cts'), nodeSource);
  fs.writeFileSync(path.join(consumer, 'browser.ts'), `
import IO from 'iosignal/io';
import IOAlias from 'iosignal/io.js';
const io = new IO('ws://localhost');
const alias: IOAlias = io;
io.on('ready', () => {});
io.once('ready', () => {});
io.off('ready');
IO.MBP.pack(IO.MBP.MB('value', 1));
const bytes: Uint8Array = IO.Buffer.alloc(4);
// @ts-expect-error Browser entry has no server API.
import { Server } from 'iosignal/io';
// @ts-expect-error Browser consumers do not need Node globals.
process.cwd();
void [alias, bytes];
`);
  const tsc = path.join(root, 'node_modules/typescript/bin/tsc');
  for (const [name, module, resolution, files, types] of [
    ['node', 'NodeNext', 'NodeNext', ['node.mts', 'node.cts'], ['node']],
    ['browser', 'ESNext', 'Bundler', ['browser.ts'], []],
    ['browser-next', 'NodeNext', 'NodeNext', ['browser.ts'], []],
    ['legacy', 'ESNext', 'Node10', ['node.mts'], ['node']],
  ]) {
    fs.writeFileSync(path.join(consumer, `${name}.json`), JSON.stringify({
      compilerOptions: { noEmit: true, strict: true, module, moduleResolution: resolution,
        target: 'ES2020', lib: ['ES2020', 'DOM'], types,
        ...(resolution === 'Node10' ? { ignoreDeprecations: '6.0' } : {}) }, files,
    }));
    run('node', [tsc, '-p', `${name}.json`], consumer);
  }
  console.log('Packed ESM/CJS, legacy Node and browser types verified; browser checks exclude Node globals.');
} finally {
  fs.rmSync(consumer, { recursive: true, force: true });
}
