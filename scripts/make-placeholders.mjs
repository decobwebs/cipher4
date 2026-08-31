/**
 * Generates on-brand placeholder images so the site builds and reviews well
 * before the real photography arrives.
 *
 * Each placeholder is a navy field with a cyan hairline and its own filename
 * printed on it, so a reviewer can tell at a glance which slot is still
 * waiting on art. Replace them by dropping the generated JPGs into
 * public/images/ under the same names — see docs/image-brief.md.
 *
 * Run: node scripts/make-placeholders.mjs
 */

import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const OUT = path.resolve('public/images')

/** name, width, height, label */
const slots = [
  ['hero-offshore', 2400, 1029, 'HOME HERO — offshore support vessel at dusk'],
  ['og-default', 1200, 630, 'OPEN GRAPH SHARE IMAGE'],

  ['industry-transport', 1920, 1080, 'INDUSTRY — Transport'],
  ['industry-logistics', 1920, 1080, 'INDUSTRY — Logistics'],
  ['industry-oil-and-gas', 1920, 1080, 'INDUSTRY — Oil & Gas'],
  ['industry-supply-chain', 1920, 1080, 'INDUSTRY — Supply Chain'],

  ['solutions-software-platforms', 1800, 1200, 'SOLUTION — Software Platforms'],
  ['solutions-robotics', 1800, 1200, 'SOLUTION — Field & Offshore Robotics'],
  ['solutions-technology-supply', 1800, 1200, 'SOLUTION — Technology Supply'],

  ['about-team', 1600, 1200, 'ABOUT — engineering team on site'],
  ['about-field', 1600, 1200, 'ABOUT — field engineer offshore'],
  ['careers', 1600, 1200, 'CAREERS — team at work'],
  ['contact-offices', 1600, 1200, 'CONTACT — Abuja office'],
]

const NAVY = '#0B1233'
const NAVY_MID = '#14204F'
const CYAN = '#00A6E0'

/** SVG is XML — labels contain "&" and would otherwise break the parse. */
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function svg(width, height, rawLabel, rawFilename) {
  const label = esc(rawLabel)
  const filename = esc(rawFilename)
  const fs1 = Math.round(Math.min(width, height) * 0.045)
  const fs2 = Math.round(Math.min(width, height) * 0.028)
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${NAVY_MID}"/>
      <stop offset="100%" stop-color="${NAVY}"/>
    </linearGradient>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M80 0H0V80" fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect x="0" y="0" width="${Math.round(width * 0.18)}" height="4" fill="${CYAN}"/>
  <text x="50%" y="47%" text-anchor="middle"
        font-family="Inter Tight, Segoe UI, sans-serif" font-size="${fs1}"
        font-weight="700" fill="#FFFFFF" letter-spacing="-0.5">${label}</text>
  <text x="50%" y="56%" text-anchor="middle"
        font-family="Inter, Segoe UI, sans-serif" font-size="${fs2}"
        fill="${CYAN}">${filename}</text>
  <text x="50%" y="63%" text-anchor="middle"
        font-family="Inter, Segoe UI, sans-serif" font-size="${Math.round(fs2 * 0.8)}"
        fill="rgba(255,255,255,0.45)">placeholder — replace per docs/image-brief.md</text>
</svg>`)
}

await mkdir(OUT, { recursive: true })

for (const [name, w, h, label] of slots) {
  const file = path.join(OUT, `${name}.jpg`)
  await sharp(svg(w, h, label, `${name}.jpg`))
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(file)
  console.log(`  ✓ ${name}.jpg  ${w}×${h}`)
}

// A neutral 1x1 used by the client-logo empty state.
if (!existsSync(path.join(OUT, 'pixel.png'))) {
  await writeFile(
    path.join(OUT, 'pixel.png'),
    Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64',
    ),
  )
}

console.log(`\nGenerated ${slots.length} placeholders in public/images/`)
