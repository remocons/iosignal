import fs from 'node:fs';
import path from 'node:path';
import { audit, root, run, policy } from './public-policy.mjs';

audit();
// Only this generated directory is removed, after rejecting unknown files/symlinks.
fs.rmSync(path.join(root, 'dist'), { recursive: true, force: true });
run('npm', ['run', 'build']);
audit(root, true);
run('npm', ['test']);
const packed = JSON.parse(run('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], root, true));
const expected = new Set(['package.json', 'README.md', 'README.ko.md', ...policy.dist]);
for (const f of packed[0].files) {
  if (!expected.delete(f.path)) throw Error(`Unexpected npm package file: ${f.path}`);
}
if (expected.size) throw Error(`Missing npm files: ${[...expected].join(', ')}`);
console.log('Public build, tests and npm package allowlist verified.');
