/**
 * Exports a still frame of every road to public/images/road/, in two sizes:
 * 1440 × 700 (desktop) and 780 × 600 (phones), as WebP with transparency.
 *
 * These are what the still tier (reduced motion, Save-Data, low-power
 * devices) and devices without WebGL see. They come from the real road
 * through the /_roads tool page, at effect time STILL_TIME (3 s).
 *
 * Usage:
 *   npm run build
 *   node scripts/static-server.mjs          (serves .output/public on :3200)
 *   node scripts/export-road-stills.mjs
 *   npm run build                           (so the output includes them)
 *
 * Run it again whenever a road's settings change in app/lib/hyperspeed/roads.ts.
 */
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const BASE = process.env.BASE || 'http://localhost:3200'
const OUT = 'public/images/road'
const T = 3 // keep in step with STILL_TIME in roads.ts
const QUALITY = 0.82

const ROADS = [
  'hero', 'service', 'sector-maritime', 'sector-oil-gas', 'sector-logistics',
  'sector-supply-chain', 'case', 'contact', 'strip', 'deliver', 'deliver-across', 'closing', 'notfound',
  // Phase 2b experiments
  'home-sectors',
  'demo-sectors', 'demo-launch', 'demo-void', 'demo-spine', 'demo-rise',
]
const SIZES = [
  { key: 'desktop', w: 1440, h: 700 },
  { key: 'mobile', w: 780, h: 600 },
]
// Roads that are not the usual wide shape (keep in step with `still` in roads.ts).
// Page-header roads fill the open area right of the text on desktop (about
// 900 x 720 on a laptop), and a full-width band on phones.
const HEADER = [{ key: 'desktop', w: 900, h: 720 }, { key: 'mobile', w: 780, h: 600 }]
const OWN_SIZES = {
  service: HEADER, 'sector-maritime': HEADER, 'sector-oil-gas': HEADER, 'sector-logistics': HEADER,
  'sector-supply-chain': HEADER, case: HEADER, contact: HEADER,
  'deliver-across': [{ key: 'desktop', w: 1440, h: 160 }, { key: 'mobile', w: 780, h: 120 }],
  'demo-spine': [{ key: 'desktop', w: 240, h: 1000 }, { key: 'mobile', w: 96, h: 800 }],
  'demo-rise': [{ key: 'desktop', w: 760, h: 640 }, { key: 'mobile', w: 780, h: 420 }],
}

async function launch() {
  try { return await chromium.launch() } catch { return chromium.launch({ channel: 'msedge' }) }
}

await mkdir(OUT, { recursive: true })
const browser = await launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 })

const only = process.argv.slice(2)
for (const road of only.length ? only : ROADS) {
  for (const s of OWN_SIZES[road] || SIZES) {
    const url = `${BASE}/_roads?road=${road}&w=${s.w}&h=${s.h}&t=${T}&size=${s.key}`
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForFunction(() => window.__roadReady === true, null, { timeout: 30000 })
    await page.waitForTimeout(150)
    const png = await page.locator('canvas[data-status]').screenshot({ omitBackground: true })
    // Re-encode as WebP, keeping transparency, in the browser.
    const webp = await page.evaluate(async ({ b64, q }) => {
      const img = new Image()
      img.src = `data:image/png;base64,${b64}`
      await img.decode()
      const c = document.createElement('canvas')
      c.width = img.naturalWidth
      c.height = img.naturalHeight
      c.getContext('2d').drawImage(img, 0, 0)
      return c.toDataURL('image/webp', q).split(',')[1]
    }, { b64: png.toString('base64'), q: QUALITY })
    const file = `${OUT}/${road}-${s.key}.webp`
    const buf = Buffer.from(webp, 'base64')
    await writeFile(file, buf)
    console.log(`${file}  ${(buf.length / 1024).toFixed(1)} KB`)
  }
}

await browser.close()
