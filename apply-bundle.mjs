#!/usr/bin/env node
/**
 * Applies bundle .txt files to a project: creates or overwrites every file found in them, and removes
 * every file listed on a "===== DELETE: path =====" line (files that moved somewhere else).
 *
 * Usage (run from the project root, the folder with package.json):
 *   node apply-bundle.mjs users-actions-bundle.txt
 *   node apply-bundle.mjs --dry-run users-actions-bundle.txt     (only shows what would change)
 *   node apply-bundle.mjs bundle-a.txt bundle-b.txt              (several bundles, applied in this order)
 *
 * Safety: only files inside the project's "src" folder are written or deleted. A bundle that asks for any other
 * path (for example "../" or an absolute path) is refused before anything is written.
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const bundlePaths = args.filter((arg) => !arg.startsWith('--'));

if (bundlePaths.length === 0) {
  console.error('Give at least one bundle file. Example: node apply-bundle.mjs users-actions-bundle.txt');
  process.exit(1);
}

const projectRoot = process.cwd();
if (!existsSync(resolve(projectRoot, 'package.json'))) {
  console.error('Run this from the project root (the folder that has package.json).');
  process.exit(1);
}

const srcRoot = resolve(projectRoot, 'src');
const fileBlock = /\r?\n===== FILE: (.+?) =====\r?\n([\s\S]*?)===== END FILE: \1 =====\r?\n/g;
const deleteLine = /^===== DELETE: (.+?) =====\r?$/gm;

/** A path is safe only when it is a relative path that stays inside the src folder. */
function resolveInsideSrc(relativePath) {
  const target = resolve(projectRoot, relativePath);
  const insideSrc = !isAbsolute(relativePath) && target.startsWith(srcRoot + sep);
  if (!insideSrc) {
    console.error(`Refused: "${relativePath}" is not inside the src folder. Nothing was changed.`);
    process.exit(1);
  }
  return target;
}

/** Collect every file first, so a bad bundle stops everything before any file is written. */
const files = [];
const deletions = [];
for (const bundlePath of bundlePaths) {
  // Windows tools can save the bundle with CRLF line endings. The project uses LF (see .prettierrc), so
  // everything is converted to LF before it is written.
  const text = readFileSync(bundlePath, 'utf8').replace(/\r\n/g, '\n');
  const before = files.length;
  for (const match of text.matchAll(fileBlock)) {
    const [, relativePath, content] = match;
    files.push({ relativePath, target: resolveInsideSrc(relativePath), content });
  }
  for (const match of text.matchAll(deleteLine)) {
    deletions.push({ relativePath: match[1], target: resolveInsideSrc(match[1]) });
  }
  if (files.length === before) {
    console.error(`No files found in ${bundlePath}. Is it the right bundle file?`);
    process.exit(1);
  }
}

let deleted = 0;
let created = 0;
let updated = 0;
let unchanged = 0;

for (const { relativePath, target, content } of files) {
  const exists = existsSync(target);
  if (exists && readFileSync(target, 'utf8') === content) {
    unchanged += 1;
    continue;
  }
  if (exists) updated += 1;
  else created += 1;
  console.log(`${dryRun ? 'would ' : ''}${exists ? 'update' : 'create'}  ${relative(projectRoot, target)}`);
  if (!dryRun) {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content, 'utf8');
  }
}

for (const { target } of deletions) {
  if (!existsSync(target)) continue;
  deleted += 1;
  console.log(`${dryRun ? 'would ' : ''}delete  ${relative(projectRoot, target)}`);
  if (!dryRun) rmSync(target);
}

console.log(
  `\n${dryRun ? 'Dry run: nothing was written. ' : ''}${created} created, ${updated} updated, ${deleted} deleted, ${unchanged} already up to date.`,
);
if (!dryRun) console.log('Next: npm run typecheck && npm run lint && npm run build');
