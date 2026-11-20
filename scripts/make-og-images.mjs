/**
 * Makes the share images (Open Graph) in public/og/, 1200 x 630 PNG, one
 * per card in app/data/og.ts plus the default, by photographing the
 * internal /_og page.
 *
 * Usage (against a built site, served as static files):
 *   C4_OUTPUT_DIR=.output-test npx nuxi build
 *   ROOT=.output-test/public node scripts/static-server.mjs
 *   node scripts/make-og-images.mjs
 * Then build again, so the images are in the output.
 *
 * Run it again whenever a page title in the data files changes.
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.BASE || 'http://localhost:3200'
const OUT = 'public/og'

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'msedge' })
// Reduced motion: every drawing is shown finished.
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })

// Keep in step with app/data/og.ts. A name that is not in that list fails
// (the page would show the default card, and the wait below catches it).
const names = (process.env.CARDS || '').split(',').filter(Boolean)
const list = names.length ? names : [
  'default', 'home',
  'service-operational-platforms', 'service-ai-automation', 'service-iot-robotics',
  'service-digital-platforms', 'service-it-infrastructure', 'service-education-technology',
  'sector-maritime-and-ports', 'sector-oil-and-gas', 'sector-logistics-and-transport', 'sector-supply-chain-and-procurement',
  'case-reliant-anchor', 'case-harbours360', 'case-lucidhr',
  'contact', 'youth', 'youth-launchpad', 'youth-scholarships',
]

for (const file of list) {
  await page.goto(`${BASE}/_og?file=${file}`, { waitUntil: 'networkidle' })
  await page.waitForFunction((f) => document.querySelector('.og')?.getAttribute('data-file') === f, file, { timeout: 15000 })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)
  await page.locator('.og').screenshot({ path: `${OUT}/${file}.png` })
  console.log(`${OUT}/${file}.png`)
}
await browser.close()
