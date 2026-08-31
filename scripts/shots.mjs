/**
 * Visual QA. Screenshots key pages at the breakpoints we commit to, so
 * layout regressions are caught by looking rather than by guessing.
 *
 * Usage: npx serve .output/public -p 3200, then node scripts/shots.mjs
 */

import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.BASE || 'http://localhost:3200'
const OUT = 'C:/Users/HP/AppData/Local/Temp/claude/c--Users-HP-Cipher4/0e7b660b-e12b-4d40-bb40-baefa32fc69e/scratchpad/shots'

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]

const pages = [
  ['home', '/'],
  ['solutions', '/solutions'],
  ['industries', '/industries'],
  ['oil-and-gas', '/industries/oil-and-gas'],
  ['about', '/about'],
  ['credentials', '/credentials'],
  ['contact', '/contact'],
  ['projects', '/projects'],
  ['insights', '/insights'],
  ['article', '/insights/offshore-connectivity-field-systems'],
  ['404', '/does-not-exist'],
]

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch()
const issues = []

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    // Motion off so screenshots are deterministic rather than mid-animation.
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()

  page.on('console', (msg) => {
    if (msg.type() === 'error') issues.push(`[console] ${vp.name} ${msg.text()}`)
  })
  page.on('pageerror', (err) => issues.push(`[pageerror] ${vp.name} ${err.message}`))

  for (const [name, path] of pages) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(250)

    // Horizontal overflow is the single most common responsive defect.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    )
    if (overflow) {
      const culprits = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth
        return [...document.querySelectorAll('*')]
          .filter((el) => el.getBoundingClientRect().right > vw + 1)
          .slice(0, 5)
          .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`)
      })
      issues.push(`[overflow] ${vp.name} ${path} → ${culprits.join(' | ')}`)
    }

    await page.screenshot({
      path: `${OUT}/${name}-${vp.name}.png`,
      fullPage: vp.name === 'desktop' && name === 'home',
    })
  }

  await context.close()
}

await browser.close()

console.log(issues.length ? issues.join('\n') : 'No console errors or overflow detected.')
console.log(`\nScreenshots in ${OUT}`)
