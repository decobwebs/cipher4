/**
 * Redirect check (plan, Phase 7, step 7). Every old address in content B1
 * must land on the right new page.
 *
 * 1. The three lists agree: content B1, the routeRules in nuxt.config.ts
 *    (dev server) and vercel.json (live host). Same addresses, same
 *    targets, all 301.
 * 2. Optional, against a built site (DIST=.output/public): each old address
 *    has a page that sends the visitor to its target, and the target page
 *    exists.
 * 3. Optional, against a running server (BASE=http://localhost:3300 with
 *    `npx nuxi dev`): each old address answers 301 with the right Location,
 *    and the target answers 200.
 *
 *   node scripts/check-redirects.mjs
 *   DIST=.output/public node scripts/check-redirects.mjs
 *   BASE=http://localhost:3300 node scripts/check-redirects.mjs
 *
 * Exits with 1 if anything is wrong.
 */
import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'

const problems = []
const fail = (msg) => problems.push(msg)

// --- 1. The three lists ----------------------------------------------------

async function fromContent() {
  const text = await readFile('design-handoff/content/cipher4-website-content-v1.md', 'utf8')
  const start = text.indexOf('Old addresses must redirect permanently')
  if (start < 0) throw new Error('Could not find the redirect note in content B1.')
  const list = new Map()
  for (const line of text.slice(start).split('\n').slice(1)) {
    if (!line.startsWith('- ')) break
    const [from, to] = line.split('→').map((part) => [...part.matchAll(/`([^`]+)`/g)].map((m) => m[1]))
    for (const old of from) list.set(old, to[0])
  }
  return list
}

async function fromNuxtConfig() {
  const text = await readFile('nuxt.config.ts', 'utf8')
  const list = new Map()
  for (const m of text.matchAll(/'(\/[^']*)':\s*\{\s*redirect:\s*\{\s*to:\s*'([^']+)',\s*statusCode:\s*(\d+)/g)) {
    if (m[3] !== '301') fail(`nuxt.config.ts: ${m[1]} uses ${m[3]}, not 301`)
    list.set(m[1], m[2])
  }
  return list
}

async function fromVercel() {
  const json = JSON.parse(await readFile('vercel.json', 'utf8'))
  const list = new Map()
  for (const r of json.redirects || []) {
    if (r.statusCode !== 301 && r.permanent !== true) fail(`vercel.json: ${r.source} is not a 301`)
    list.set(r.source, r.destination)
  }
  return list
}

const content = await fromContent()
const lists = { 'nuxt.config.ts': await fromNuxtConfig(), 'vercel.json': await fromVercel() }

for (const [name, list] of Object.entries(lists)) {
  for (const [old, to] of content) {
    if (!list.has(old)) fail(`${name}: missing ${old} → ${to}`)
    else if (list.get(old) !== to) fail(`${name}: ${old} goes to ${list.get(old)}, content B1 says ${to}`)
  }
  for (const old of list.keys()) {
    if (!content.has(old)) fail(`${name}: ${old} is not in content B1`)
  }
}
console.log(`Content B1 lists ${content.size} old addresses. Compared with nuxt.config.ts and vercel.json.`)

// --- 2. A built site -------------------------------------------------------

const exists = (p) => stat(p).then((s) => s.isFile(), () => false)

if (process.env.DIST) {
  const dist = process.env.DIST
  for (const [old, to] of content) {
    const html = await readFile(join(dist, old, 'index.html'), 'utf8').catch(() => '')
    const target = html.match(/http-equiv="refresh"\s+content="0;\s*url=([^"]+)"/)?.[1]
    if (target !== to) fail(`build: ${old} sends to ${target || 'nothing'}, expected ${to}`)
    if (!(await exists(join(dist, to, 'index.html')))) fail(`build: target page ${to} was not built`)
  }
  console.log(`Checked the built site in ${dist}.`)
}

// --- 3. A running server ---------------------------------------------------

if (process.env.BASE) {
  const base = process.env.BASE.replace(/\/$/, '')
  for (const [old, to] of content) {
    const res = await fetch(base + old, { redirect: 'manual' })
    const location = res.headers.get('location') || ''
    const landed = location.startsWith('http') ? new URL(location).pathname : location
    if (res.status !== 301) fail(`server: ${old} answered ${res.status}, expected 301`)
    if (landed !== to) fail(`server: ${old} sends to ${landed || 'nothing'}, expected ${to}`)
    const page = await fetch(base + to)
    if (page.status !== 200) fail(`server: target ${to} answered ${page.status}`)
  }
  console.log(`Checked the running server at ${base}.`)
}

// ---------------------------------------------------------------------------

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`)
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}
for (const [old, to] of content) console.log(`  ok  ${old.padEnd(32)} → ${to}`)
console.log('\nAll redirects pass.')
