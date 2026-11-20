/**
 * Accessibility check (Phase 8/9): axe-core on every page in the sitemap,
 * plus the 404 page, at phone (412 px) and desktop (1280 px) width, with
 * motion on and with reduced motion. WCAG 2.2 A/AA and axe best practice.
 * Scrolls each page first so every section has played its entrance.
 *
 *   ROOT=.output/public node scripts/static-server.mjs     (port 3200)
 *   DIST=.output/public node scripts/check-a11y.mjs
 *
 * BASE (default http://localhost:3200) is the running build; DIST is the
 * same build's folder, to read sitemap.xml. Exits with 1 on any violation.
 */
import { chromium } from 'playwright'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const axeSrc = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8')
const BASE = (process.env.BASE || 'http://localhost:3200').replace(/\/$/, '')
const DIST = process.env.DIST || '.output/public'

const sitemap = await readFile(`${DIST}/sitemap.xml`, 'utf8')
const paths = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1] || '/')
paths.push('/no-such-page')

const browser = await chromium.launch({ channel: 'msedge' })
let total = 0
for (const motion of ['no-preference', 'reduce']) {
  for (const vp of [{ width: 412, height: 823, name: 'phone' }, { width: 1280, height: 900, name: 'desktop' }]) {
    const ctx = await browser.newContext({ viewport: vp, reducedMotion: motion, isMobile: vp.name === 'phone', hasTouch: vp.name === 'phone' })
    const page = await ctx.newPage()
    for (const p of paths) {
      await page.goto(BASE + p, { waitUntil: 'networkidle' })
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) }
        window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 1500))
      })
      await page.addScriptTag({ content: axeSrc })
      const res = await page.evaluate(async () => {
        const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })
        return r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.slice(0, 5).map((n) => n.target.join(' ') + ' :: ' + (n.failureSummary || '').replace(/\s+/g, ' ').slice(0, 200)) }))
      })
      for (const v of res) {
        total++
        console.log(`${motion === 'reduce' ? 'reduced ' : ''}${vp.name} ${p} [${v.impact}] ${v.id}`)
        for (const n of v.nodes) console.log('     ' + n)
      }
    }
    await ctx.close()
  }
}
await browser.close()
console.log(total ? `\n${total} violation group(s).` : `\nNo accessibility violations on ${paths.length} pages (phone and desktop, motion on and reduced).`)
process.exit(total ? 1 : 0)
