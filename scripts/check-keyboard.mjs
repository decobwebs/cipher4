/**
 * Keyboard check (Phase 8/9): on every page in the sitemap, plus the 404
 * page, at desktop (1280 px) and phone (390 px) width. The first Tab stop
 * is the skip link and it moves focus to <main>; then Tab through the
 * whole page and check each stop: a visible focus ring, on screen, not
 * covered, never inside something hidden.
 *
 *   ROOT=.output/public node scripts/static-server.mjs     (port 3200)
 *   DIST=.output/public node scripts/check-keyboard.mjs [paths...]
 *
 * Exits with 1 on any problem.
 */
import { chromium } from 'playwright'
import { readFile } from 'node:fs/promises'
const BASE = (process.env.BASE || 'http://localhost:3200').replace(/\/$/, '')
const sitemap = await readFile(`${process.env.DIST || '.output/public'}/sitemap.xml`, 'utf8')
let paths = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1] || '/')
paths.push('/no-such-page')
if (process.argv[2]) paths = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'msedge' })
const problems = []
const summary = []
for (const vp of [{ width: 1280, height: 900, name: 'desktop' }, { width: 390, height: 844, name: 'phone' }]) {
  const ctx = await browser.newContext({ viewport: vp, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  for (const p of paths) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    // 1. Skip link first, and it moves focus to <main>.
    await page.keyboard.press('Tab')
    const first = await page.evaluate(() => ({ cls: document.activeElement?.className || '', text: document.activeElement?.textContent?.trim().slice(0, 30) }))
    if (!String(first.cls).includes('c4-skip')) problems.push(`${vp.name} ${p}: first Tab stop is not the skip link (${first.text})`)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(150)
    const afterSkip = await page.evaluate(() => document.activeElement?.id)
    if (afterSkip !== 'main') problems.push(`${vp.name} ${p}: skip link did not move focus to main (${afterSkip})`)
    // 2. Tab through everything after main.
    const seen = []
    let loops = 0
    for (let i = 0; i < 260; i++) {
      await page.keyboard.press('Tab')
      const probe = () => page.evaluate(() => {
        const e = document.activeElement
        if (!e || e === document.body) return { body: true }
        const r = e.getBoundingClientRect()
        const cs = getComputedStyle(e)
        const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none')
        const cx = Math.min(Math.max(r.left + r.width / 2, 0), innerWidth - 1), cy = Math.min(Math.max(r.top + Math.min(r.height, 40) / 2, 0), innerHeight - 1)
        const top = document.elementFromPoint(cx, cy)
        const covered = top && !e.contains(top) && !top.contains(e) ? (top.closest('header,[class*="dock"],[class*="bar"]')?.className || top.tagName) : null
        const hidden = !!e.closest('[aria-hidden="true"],[inert]')
        const onScreen = r.bottom > 0 && r.top < innerHeight && r.width > 0 && r.height > 0
        const label = (e.getAttribute('aria-label') || e.textContent || e.getAttribute('name') || e.id || '').trim().replace(/\s+/g, ' ').slice(0, 40)
        return { key: e.tagName + '|' + label + '|' + Math.round(r.top + scrollY), tag: e.tagName.toLowerCase(), label, ring, covered, hidden, onScreen }
      })
      let s = await probe()
      // Give a header sliding back in, or a scroll to the field, a moment.
      if (!s.body && (!s.onScreen || s.covered)) { await page.waitForTimeout(400); s = await probe() }
      if (s.body) { loops++; if (loops > 1) break; continue }
      if (seen.length && s.key === seen[0].key) break
      seen.push(s)
      if (!s.ring) problems.push(`${vp.name} ${p}: no visible focus ring on ${s.tag} "${s.label}"`)
      if (!s.onScreen) problems.push(`${vp.name} ${p}: focused ${s.tag} "${s.label}" is off screen`)
      if (s.covered) problems.push(`${vp.name} ${p}: focused ${s.tag} "${s.label}" is covered by ${String(s.covered).slice(0, 40)}`)
      if (s.hidden) problems.push(`${vp.name} ${p}: focus went into a hidden element: ${s.tag} "${s.label}"`)
    }
    summary.push(`${vp.name.padEnd(7)} ${p.padEnd(48)} ${seen.length} stops`)
  }
  await ctx.close()
}
await browser.close()
console.log(summary.join('\n'))
console.log(problems.length ? `\n${problems.length} problem(s):\n` + [...new Set(problems)].join('\n') : '\nNo keyboard problems.')
process.exit(problems.length ? 1 : 0)
