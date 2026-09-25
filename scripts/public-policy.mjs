import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const policy = JSON.parse(fs.readFileSync(path.join(root, 'scripts/public-files.json')));
export const controls = [
  '.gitignore', '.npmignore', 'index.js', 'package.json', 'package-lock.json',
  'rollup.config.js', 'tsconfig.json', 'AGENTS.md', 'RELEASING.md',
  '.github/workflows/verify.yml', 'scripts/public-files.json',
  'scripts/public-policy.mjs', 'scripts/verify.mjs',
  'checks/release.test.mjs', 'checks/policy.test.mjs',
];
export const allowed = new Set([...controls, ...policy.sync, ...policy.dist]);
export function safeFile(base, name) {
  if (!name || path.isAbsolute(name) || name.split('/').some(p => !p || p === '..' || p === '.')) throw Error(`Unsafe path: ${name}`);
  let current = base;
  for (const part of name.split('/')) {
    current = path.join(current, part);
    if (fs.lstatSync(current).isSymbolicLink()) throw Error(`Symlink rejected: ${name}`);
  }
  if (!fs.statSync(current).isFile()) throw Error(`Not a regular file: ${name}`);
  return current;
}
export function inspect(name, data) {
  if (/(?:[\w.-]*_private|_private[\w.-]*|redis_clients|google-auth-library|serialport)/i.test(data)) throw Error(`Private reference detected: ${name}`);
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:ghp_|github_pat_|AKIA)[A-Za-z0-9_]{16,}/.test(data)) throw Error(`Possible credential detected: ${name}`);
}
export function walk(base, prefix = '') {
  return fs.readdirSync(path.join(base, prefix), { withFileTypes: true }).flatMap(e => {
    const name = prefix ? `${prefix}/${e.name}` : e.name;
    if (!prefix && ['.git', 'node_modules'].includes(e.name)) return [];
    if (e.isSymbolicLink()) throw Error(`Symlink rejected: ${name}`);
    return e.isDirectory() ? walk(base, name) : [name];
  });
}
export function audit(base = root, artifacts = false) {
  if (fs.existsSync(path.join(base, '.git'))) {
    for (const name of run('git', ['ls-files', '-z'], base, true).split('\0').filter(Boolean)) {
      if (!allowed.has(name)) throw Error(`Unapproved tracked file: ${name}`);
    }
  }
  for (const name of walk(base)) {
    if (!allowed.has(name)) throw Error(`Unapproved public file: ${name}`);
    safeFile(base, name);
    if (['index.js', 'package-lock.json'].includes(name) || /^(src|test|dist)\//.test(name)) inspect(name, fs.readFileSync(path.join(base, name), 'utf8'));
  }
  for (const name of [...controls, ...policy.sync, ...(artifacts ? policy.dist : [])]) safeFile(base, name);
  const pkg = JSON.parse(fs.readFileSync(path.join(base, 'package.json')));
  if (pkg.private || pkg.license !== 'MIT' || pkg.exports['.'].import !== './dist/node/iosignal.js') throw Error('Invalid public package metadata');
  if (JSON.stringify(pkg.files) !== JSON.stringify(policy.dist)) throw Error('npm files must match the exact artifact allowlist');
  inspect('package.json', JSON.stringify({ dependencies: pkg.dependencies, devDependencies: pkg.devDependencies, optionalDependencies: pkg.optionalDependencies }));
}
export function run(command, args, cwd = root, capture = false) {
  return execFileSync(command, args, { cwd, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit', timeout: 180000 });
}
// Reject imports of local files outside the public allowlist, including symlink escapes.
export function publicBoundary() {
  return { name: 'public-boundary', load(id) {
    if (id.startsWith('\0') || !path.isAbsolute(id)) return null;
    const relative = path.relative(root, id).split(path.sep).join('/');
    const dependencies = fs.realpathSync(path.join(root, 'node_modules'));
    if (fs.existsSync(id) && fs.realpathSync(id).startsWith(dependencies + path.sep)) return null;
    if (!allowed.has(relative) || relative.startsWith('dist/')) throw Error(`Non-public build input: ${relative}`);
    safeFile(root, relative);
    return null;
  }};
}
