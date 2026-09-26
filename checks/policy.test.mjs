import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { inspect, safeFile, allowed, policy, audit, root } from '../scripts/public-policy.mjs';

test('private references and credentials fail closed', () => {
  for (const text of ["import '../services_private/service.js'", 'src/redis_clients/client.js', '-----BEGIN PRIVATE KEY-----']) {
    assert.throws(() => inspect('fixture.js', text));
  }
  assert.doesNotThrow(() => inspect('fixture.js', "import './src/services/replyService.js'"));
});
test('new files are not implicitly approved', () => {
  assert.equal(allowed.has('src/services/new-service.js'), false);
  assert.equal(policy.sync.includes('index.js'), false);
  assert.equal(policy.sync.some(p => p.startsWith('dist/')), false);
  audit(root, true);
});
test('symlink and traversal cannot bypass file boundaries', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'iosignal-policy-'));
  try {
    fs.writeFileSync(path.join(dir, 'file'), 'fixture');
    fs.symlinkSync(path.join(dir, 'file'), path.join(dir, 'link'));
    assert.throws(() => safeFile(dir, 'link'), /Symlink/);
    assert.throws(() => safeFile(dir, '../file'), /Unsafe/);
    assert.throws(() => safeFile(dir, '/file'), /Unsafe/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('unapproved files and contaminated artifacts fail audit', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'iosignal-audit-'));
  try {
    for (const name of allowed) {
      fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
      fs.copyFileSync(path.join(root, name), path.join(dir, name));
    }
    audit(dir, true);
    fs.mkdirSync(path.join(dir, '.vscode'));
    fs.writeFileSync(path.join(dir, '.vscode/settings.json'), '{}');
    audit(dir, true);
    execFileSync('git', ['init', '--quiet'], { cwd: dir });
    execFileSync('git', ['add', '-f', '.vscode/settings.json'], { cwd: dir });
    assert.throws(() => audit(dir, true), /Unapproved tracked file: \.vscode\/settings\.json/);
    execFileSync('git', ['rm', '--cached', '--quiet', '.vscode/settings.json'], { cwd: dir });
    audit(dir, true);
    const extra = path.join(dir, 'src/services/unapproved.js');
    fs.writeFileSync(extra, 'export const confidential = true;');
    assert.throws(() => audit(dir, true), /Unapproved public file/);
    fs.unlinkSync(extra);
    fs.appendFileSync(path.join(dir, policy.dist[0]), '\n// src/services_private/fixture.js');
    assert.throws(() => audit(dir, true), /Private reference/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
