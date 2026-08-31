/**
 * Lightweight accessibility + contrast audit against the served build.
 * Not a replacement for a full axe run, but catches the categories of bug
 * that mattered most here: unreadable text, missing focus rings, and
 * images without alt text.
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:3400'
const pages = [
  '/', '/solutions', '/solutions/robotics', '/industries',
  '/industries/oil-and-gas', '/about', '/credentials', '/contact',
  '/projects', '/insights', '/insights/offshore-connectivity-field-systems',
  '/careers', '/privacy', '/terms',
]

function relLuminance([r, g, b]) {
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
}
function contrastRatio(fg, bg) {
  const l1 = relLuminance(fg) + 0.05
  const l2 = relLuminance(bg) + 0.05
  return l1 > l2 ? l1 / l2 : l2 / l1
}
function parseColor(str) {
  const m = str.match(/rgba?\(([^)]+)\)/)
  if (!m) return null
  const parts = m[1].split(',').map((s) => parseFloat(s.trim()))
  return { rgb: parts.slice(0, 3), a: parts[3] ?? 1 }
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const findings = []

for (const path of pages) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })

  // 1. Images missing alt attributes entirely (empty alt="" is valid for
  //    decorative images — only a MISSING attribute is a defect).
  const missingAlt = await page.evaluate(() =>
    [...document.querySelectorAll('img')].filter((img) => !img.hasAttribute('alt')).length,
  )
  if (missingAlt) findings.push(`[alt] ${path}: ${missingAlt} <img> missing alt attribute`)

  // 2. Heading order — flag if h3 appears with no h2 before it in the DOM,
  //    a common symptom of skipped levels.
  const headingIssue = await page.evaluate(() => {
    const heads = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) =>
      Number(h.tagName[1]),
    )
    for (let i = 1; i < heads.length; i++) {
      if (heads[i] - heads[i - 1] > 1) return `jump from h${heads[i - 1]} to h${heads[i]}`
    }
    return null
  })
  if (headingIssue) findings.push(`[headings] ${path}: ${headingIssue}`)

  // 3. Text contrast — sample real text nodes against their resolved
  //    background (walking up until a non-transparent bg is found).
  const contrastIssues = await page.evaluate(() => {
    // Sections styled with a gradient `background` shorthand report an
    // empty backgroundColor, so a naive walk-up sees "white" behind white
    // text and misfires constantly. Detect the known dark-surface classes
    // and use the darkest stop in that gradient — the worst case within it,
    // so a pass here is a pass everywhere the gradient actually renders.
    const DARK_BG = 'rgb(11,18,51)' // --c4-indigo-900, the darkest gradient stop
    // NOTE: `.hero` is deliberately NOT in this list. In v1 the home hero was
    // a dark full-bleed band; in v2 it is a white section with the shader
    // compositing onto it, so treating it as dark reported every line of hero
    // copy as failing against a navy that is no longer there.
    const darkAncestorSelector =
      '.on-dark, .section--inverse, .section--abyss, .page-hero, .cta'

    // The list above is a short-circuit for gradient-backed bands, and a
    // short-circuit that ignores reality goes stale the moment a band changes
    // material. `footer` and `.node__card` were both on it; both are light
    // now, and the script went on reporting ~580 failures against a navy that
    // had been deleted. So the short-circuit only fires when the matched
    // element genuinely has no paintable backgroundColor of its own, which is
    // exactly the gradient case it was written for.
    function isGradientBacked(el) {
      const bg = getComputedStyle(el).backgroundColor
      return !bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent'
    }

    function darkAncestorOf(el) {
      let node = el.closest(darkAncestorSelector)
      while (node) {
        if (isGradientBacked(node)) return node
        node = node.parentElement?.closest(darkAncestorSelector) ?? null
      }
      return null
    }

    // Buttons carry their own gradient background regardless of the section
    // they sit in, and CSS gradients don't populate backgroundColor at all —
    // so both need an explicit resolved value rather than a DOM walk.
    // Each is the WORST-CASE (lowest-contrast) stop within that gradient:
    // if text passes against this, it passes everywhere the gradient renders.
    // `.btn--accent` still carries its own cyan gradient in every context, so
    // one worst-case value covers it.
    const BTN_ACCENT_BG = 'rgb(251,201,106)'  // --grad-accent lightest stop

    // `.btn--primary` changed material in v2: it is glass now, so what sits
    // behind it depends on the context it is in. White frost on a light
    // section, navy tint inside `.on-dark`. A single hardcoded value reported
    // every light-context primary button as failing against a navy fill it no
    // longer has.
    const BTN_PRIMARY_BG_LIGHT = 'rgb(255,255,255)'
    const BTN_PRIMARY_BG_DARK = 'rgb(18,28,62)'

    function bgOf(el) {
      const btn = el.closest('.btn')
      if (btn?.classList.contains('btn--accent')) return BTN_ACCENT_BG
      if (btn?.classList.contains('btn--primary')) {
        return darkAncestorOf(btn) ? BTN_PRIMARY_BG_DARK : BTN_PRIMARY_BG_LIGHT
      }
      if (darkAncestorOf(el)) return DARK_BG
      let node = el
      while (node) {
        const bg = getComputedStyle(node).backgroundColor
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg
        node = node.parentElement
      }
      return 'rgb(255,255,255)'
    }
    const results = []
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let n
    let count = 0
    while ((n = walker.nextNode()) && count < 4000) {
      count++
      const text = n.textContent?.trim()
      if (!text || text.length < 3) continue
      const el = n.parentElement
      if (!el || el.closest('script,style,noscript')) continue
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) continue
      const style = getComputedStyle(el)
      const fontSize = parseFloat(style.fontSize)
      const bold = parseInt(style.fontWeight, 10) >= 700
      results.push({
        text: text.slice(0, 40),
        fg: style.color,
        bg: bgOf(el),
        large: fontSize >= 24 || (fontSize >= 18.66 && bold),
      })
    }
    return results
  })

  for (const r of contrastIssues) {
    const fg = parseColor(r.fg)
    const bg = parseColor(r.bg)
    if (!fg || !bg || fg.a < 0.5) continue
    const ratio = contrastRatio(fg.rgb, bg.rgb)
    const threshold = r.large ? 3 : 4.5
    if (ratio < threshold) {
      findings.push(
        `[contrast ${ratio.toFixed(2)}<${threshold}] ${path}: "${r.text}" fg=${r.fg} bg=${r.bg}`,
      )
    }
  }

  // 4. Interactive elements with no visible focus indicator when tabbed to.
  const tabTargets = await page.evaluate(() =>
    document.querySelectorAll('a, button, input, textarea, select').length,
  )
  if (tabTargets === 0) findings.push(`[focus] ${path}: no focusable elements found`)
}

await browser.close()

const unique = [...new Set(findings)]
console.log(unique.length ? unique.join('\n') : 'No issues found.')
console.log(`\n${unique.length} finding(s) across ${pages.length} pages.`)
