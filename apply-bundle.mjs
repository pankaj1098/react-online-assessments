#!/usr/bin/env node
/**
 * Applies bundle .txt files to a project: creates or overwrites every file found in them,
 * and deletes the files a bundle lists as removed.
 *
 * Usage (run from the project root, the folder with package.json):
 *   node apply-bundle.mjs bundle.txt
 *   node apply-bundle.mjs bundle-1-shared-and-apps.txt bundle-2-catalogs-data-and-tables.txt
 *   node apply-bundle.mjs --dry-run bundle.txt     (only shows what would change)
 *
 * Bundle format:
 *   ===== FILE: src/path/to/file.tsx =====
 *   ...the whole file...
 *   ===== END FILE: src/path/to/file.tsx =====
 *
 *   ===== DELETE: src/path/to/old-file.tsx =====      (one line: the file is removed)
 *
 * Safety: only files inside the project's "src" folder are written or deleted. A bundle that asks for
 * any other path (for example "../" or an absolute path) is refused before anything is changed.
 * A path can't be both written and deleted in the same run.
 */
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const bundlePaths = args.filter((arg) => !arg.startsWith('--'));

if (bundlePaths.length === 0) {
  console.error('Give at least one bundle file. Example: node apply-bundle.mjs bundle.txt');
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

/** Stops everything when a path points outside the src folder. */
function checkInsideSrc(relativePath) {
  const target = resolve(projectRoot, relativePath);
  const insideSrc = !isAbsolute(relativePath) && target.startsWith(srcRoot + sep);
  if (!insideSrc) {
    console.error(`Refused: "${relativePath}" is not inside the src folder. Nothing was changed.`);
    process.exit(1);
  }
  return target;
}

/** Collect every file and delete first, so a bad bundle stops everything before anything is changed. */
const files = [];
const deletions = [];
for (const bundlePath of bundlePaths) {
  const text = readFileSync(bundlePath, 'utf8');
  const before = files.length + deletions.length;
  for (const match of text.matchAll(fileBlock)) {
    const [, relativePath, content] = match;
    files.push({ relativePath, target: checkInsideSrc(relativePath), content });
  }
  for (const match of text.matchAll(deleteLine)) {
    const [, relativePath] = match;
    deletions.push({ relativePath, target: checkInsideSrc(relativePath) });
  }
  if (files.length + deletions.length === before) {
    console.error(`No files found in ${bundlePath}. Is it the right bundle file?`);
    process.exit(1);
  }
}

const written = new Set(files.map((file) => file.target));
const conflict = deletions.find((entry) => written.has(entry.target));
if (conflict) {
  console.error(`Refused: "${conflict.relativePath}" is both written and deleted. Nothing was changed.`);
  process.exit(1);
}

let created = 0;
let updated = 0;
let unchanged = 0;
let deleted = 0;
let alreadyGone = 0;

for (const { target, content } of files) {
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

for (const { relativePath, target } of deletions) {
  if (!existsSync(target)) {
    alreadyGone += 1;
    continue;
  }
  if (!statSync(target).isFile()) {
    console.error(`Skipped: "${relativePath}" is a folder, not a file. Only single files are deleted.`);
    continue;
  }
  deleted += 1;
  console.log(`${dryRun ? 'would ' : ''}delete  ${relative(projectRoot, target)}`);
  if (!dryRun) rmSync(target);
}

console.log(
  `\n${dryRun ? 'Dry run: nothing was changed. ' : ''}${created} created, ${updated} updated, ${unchanged} already up to date, ` +
    `${deleted} deleted, ${alreadyGone} already deleted.`,
);
if (!dryRun) console.log('Next: npm run typecheck && npm run lint && npm run build');
