#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const TRACKER = path.join(ROOT, 'tracker');

// All files/dirs that capture study activity + progress state
const TARGETS = [
  'notes/',
  'exercises/',
  'activity.json',
  'course-meta.json',
  'tracker/src/data/roadmaps/ai-engineering/progress.json',
];

function run(cmd, cwd = ROOT) {
  return execSync(cmd, { cwd, encoding: 'utf8' }).trim();
}

function hasChanges() {
  const modified = run(`git status --porcelain ${TARGETS.join(' ')}`);
  return modified.length > 0;
}

if (!hasChanges()) {
  console.log('Nothing to sync — no changes in study files or progress.json');
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

// Rebuild static site so the live deployment reflects latest notes, exercises, and progress
console.log('\nRebuilding dist for live deployment...');
run('npm run build', TRACKER);

const distStatus = run('git status --porcelain tracker/dist/');
if (distStatus) {
  run('git add tracker/dist/');
  run(`git commit -m "build: update dist — ${date}"`);
}

run('git push');

console.log(`\n✓ Synced ${fileCount} file${fileCount !== 1 ? 's' : ''} to GitHub`);
console.log('\nChanged files:');
changed.split('\n').filter(Boolean).forEach((line) => console.log(' ', line));
