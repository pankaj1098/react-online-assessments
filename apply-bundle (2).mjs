#!/usr/bin/env node
/**
 * Applies a change bundle to the project in the current folder.
 *   node apply-bundle.mjs bundle.txt --dry-run   (show what would happen)
 *   node apply-bundle.mjs bundle.txt             (apply it)
 *
 * Bundle format:
 *   @@@ FILE <path>      ...content...        @@@ END      create or overwrite a file
 *   @@@ PATCH <path>     @@@ FIND ... @@@ REPLACE ... (repeat)   @@@ END
 *   @@@ DELETE <path>                                           delete a file
 */
import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const bundlePath = args.find((arg) => !arg.startsWith('--'))
if (!bundlePath) {
  console.error('Usage: node apply-bundle.mjs <bundle.txt> [--dry-run]')
  process.exit(1)
}

const root = process.cwd()
const lines = fs.readFileSync(bundlePath, 'utf8').replace(/\r\n/g, '\n').split('\n')

function safePath(relative) {
  const full = path.resolve(root, relative)
  if (full !== root && !full.startsWith(root + path.sep)) {
    throw new Error(`Refusing to touch a path outside the project: ${relative}`)
  }
  return full
}

// 1. Parse
const operations = []
let i = 0
while (i < lines.length) {
  const line = lines[i]
  let match
  if ((match = line.match(/^@@@ DELETE (.+)$/))) {
    operations.push({ type: 'delete', file: match[1].trim() })
    i++
  } else if ((match = line.match(/^@@@ FILE (.+)$/))) {
    const body = []
    i++
    while (i < lines.length && lines[i] !== '@@@ END') body.push(lines[i++])
    if (i >= lines.length) throw new Error(`Missing "@@@ END" for ${match[1]}`)
    i++
    operations.push({ type: 'file', file: match[1].trim(), content: body.join('\n') + '\n' })
  } else if ((match = line.match(/^@@@ PATCH (.+)$/))) {
    const edits = []
    i++
    while (i < lines.length && lines[i] !== '@@@ END') {
      if (lines[i] === '@@@ FIND') {
        i++
        const find = []
        while (i < lines.length && lines[i] !== '@@@ REPLACE') find.push(lines[i++])
        i++
        const replace = []
        while (i < lines.length && lines[i] !== '@@@ FIND' && lines[i] !== '@@@ END') {
          replace.push(lines[i++])
        }
        edits.push({ find: find.join('\n'), replace: replace.join('\n') })
      } else {
        i++
      }
    }
    i++
    operations.push({ type: 'patch', file: match[1].trim(), edits })
  } else {
    i++
  }
}

// 2. Validate everything first so a bad bundle changes nothing.
const problems = []
for (const op of operations) {
  safePath(op.file)
  if (op.type === 'patch') {
    const full = safePath(op.file)
    if (!fs.existsSync(full)) {
      problems.push(`${op.file}: file to patch does not exist`)
      continue
    }
    let text = fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n')
    for (const [index, edit] of op.edits.entries()) {
      const count = text.split(edit.find).length - 1
      if (count !== 1) {
        problems.push(`${op.file}: FIND block ${index + 1} matched ${count} times (expected 1)`)
      } else {
        text = text.replace(edit.find, () => edit.replace)
      }
    }
  }
}
if (problems.length) {
  console.error('Nothing was changed. Problems found:')
  for (const problem of problems) console.error('  - ' + problem)
  process.exit(1)
}

// 3. Apply (or just report)
let created = 0
let updated = 0
let deleted = 0
for (const op of operations) {
  const full = safePath(op.file)
  if (op.type === 'delete') {
    const exists = fs.existsSync(full)
    console.log(`${dryRun ? '[dry run] ' : ''}DELETE ${op.file}${exists ? '' : ' (already gone)'}`)
    if (!dryRun && exists) fs.rmSync(full)
    if (exists) deleted++
  } else if (op.type === 'file') {
    const exists = fs.existsSync(full)
    console.log(`${dryRun ? '[dry run] ' : ''}${exists ? 'UPDATE' : 'CREATE'} ${op.file}`)
    if (!dryRun) {
      fs.mkdirSync(path.dirname(full), { recursive: true })
      fs.writeFileSync(full, op.content)
    }
    if (exists) updated++
    else created++
  } else {
    console.log(`${dryRun ? '[dry run] ' : ''}PATCH  ${op.file} (${op.edits.length} edits)`)
    if (!dryRun) {
      let text = fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n')
      for (const edit of op.edits) text = text.replace(edit.find, () => edit.replace)
      fs.writeFileSync(full, text)
    }
    updated++
  }
}
console.log(
  `\n${dryRun ? 'Dry run: ' : ''}${created} created, ${updated} updated, ${deleted} deleted.`,
)
if (dryRun) console.log('Nothing was written. Run again without --dry-run to apply.')
