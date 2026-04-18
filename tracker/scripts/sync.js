#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const TARGETS = ['notes/', 'exercises/', 'activity.json'];

function run(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function hasChanges() {
  const modified = run(`git status --porcelain ${TARGETS.join(' ')}`);
  return modified.length > 0;
}

if (!hasChanges()) {
  console.log('Nothing to sync — no changes in notes/, exercises/, or activity.json');
  process.exit(0);
}

const changed = run(`git status --porcelain ${TARGETS.join(' ')}`);
const fileCount = changed.split('\n').filter(Boolean).length;

const date = new Date().toLocaleString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric',
  hour: '2-digit', minute: '2-digit',
});

run(`git add ${TARGETS.join(' ')}`);
run(`git commit -m "study: ${fileCount} file${fileCount !== 1 ? 's' : ''} updated — ${date}"`);
run('git push');

console.log(`\n✓ Synced ${fileCount} file${fileCount !== 1 ? 's' : ''} to GitHub`);
console.log('\nChanged files:');
changed.split('\n').filter(Boolean).forEach((line) => console.log(' ', line));
