// Copies the device rules (devices/: rules, components, runner, types, examples) into dist/devices, as they are:
// plain ES modules and JSON that hosts serve to browsers and run in Node. Only the allowlisted files are copied.
import fs from 'node:fs';
import path from 'node:path';
import { root, policy, safeFile, safeTarget } from './public-policy.mjs';

let copied = 0;
for (const name of policy.sync.filter(file => file.startsWith('devices/'))) {
  const target = safeTarget(root, `dist/${name}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(safeFile(root, name), target);
  copied++;
}
console.log(`dist/devices: ${copied} files`);
