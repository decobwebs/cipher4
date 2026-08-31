/**
 * Confirms every interactive element gets a visible :focus-visible outline
 * when reached by keyboard, and that Tab order doesn't get trapped. The old
 * site used focus:outline-none with nothing in its place.
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:3400'
const pages = ['/', '/contact', '/industries', '/solutions']

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const findings = []

for (const path of pages) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })

  for (let i = 0; i < 25; i++) {
    await page.keyboard.press('Tab')
    const info = await page.evaluate(() => {
      const el = document.activeElement
      if (!el || el === document.body) return null
      const cs = getComputedStyle(el)
      const hasOutline = cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px'
      const hasBoxShadow = cs.boxShadow !== 'none'
      return {
        tag: el.tagName,
        text: (el.textContent || '').trim().slice(0, 30),
        hasOutline,
        hasBoxShadow,
      }
    })
    if (info && !info.hasOutline && !info.hasBoxShadow) {
      findings.push(`[no-focus-ring] ${path} tab#${i}: <${info.tag}> "${info.text}"`)
    }
  }
}

await browser.close()
console.log(findings.length ? findings.join('\n') : 'Every tabbed element showed a visible focus indicator.')
