import { chromium } from 'playwright'
const BASE = process.env.BASE || 'http://localhost:3400'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 360, height: 900 } })
for (const path of ['/about', '/industries/oil-and-gas']) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  const culprits = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth
    return [...document.querySelectorAll('*')]
      .filter(el => el.getBoundingClientRect().right > vw + 0.5)
      .map(el => ({
        sel: el.tagName.toLowerCase() + (el.className && typeof el.className==='string' ? '.' + el.className.split(' ').filter(Boolean).join('.') : ''),
        right: Math.round(el.getBoundingClientRect().right),
        width: Math.round(el.getBoundingClientRect().width),
      }))
      .slice(0, 8)
  })
  console.log(path, JSON.stringify(culprits, null, 2))
}
await browser.close()
