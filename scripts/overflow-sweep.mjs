import { chromium } from 'playwright'
const BASE = process.env.BASE || 'http://localhost:3400'
const widths = [360, 390, 768, 1024, 1440, 1920]
const pages = ['/', '/solutions', '/industries', '/industries/oil-and-gas', '/about', '/credentials', '/contact', '/projects', '/insights/offshore-connectivity-field-systems']
const browser = await chromium.launch()
const findings = []
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  for (const path of pages) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    if (overflow > 1) findings.push(`[overflow +${overflow}px] ${width}px ${path}`)
  }
  await page.close()
}
await browser.close()
console.log(findings.length ? findings.join('\n') : `No horizontal overflow at any of ${widths.join(', ')}px across ${pages.length} pages.`)
