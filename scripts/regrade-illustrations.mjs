/**
 * Re-grade the stock illustrations onto the Cipher4 palette.
 *
 * The illustrations are Freepik/vectorjuice pieces shipping in that set's house
 * palette: a blue family plus a bright cyan accent, plus the odd stray pink.
 * The blues are already close to the brand hue. The cyan is not, and after the
 * palette moved to indigo + amber it was the only cool-cyan left on the site.
 *
 * WHY A HUE-BAND REMAP AND NOT A SWATCH TABLE
 * -------------------------------------------
 * These files have ~10k-16k distinct colours, almost all of which are
 * antialiasing between a dozen flat fills. A nearest-swatch lookup table would
 * snap every one of those intermediates to a hard edge and the art would come
 * out jagged. Remapping by hue band while PRESERVING LIGHTNESS leaves the
 * antialiased pixels on the line between their two neighbours, so edges stay
 * smooth without any blending pass.
 *
 * WHY NOT A CSS FILTER
 * --------------------
 * `filter: hue-rotate()` is global. Rotating cyan (195deg) onto the brand hue
 * (228deg) would drag the blues that are ALREADY correct round to 260deg and
 * turn the whole illustration purple. The two bands have to move
 * independently, which a filter cannot do.
 *
 * THE ACCENT RULE
 * ---------------
 * First attempt sent the set's bright cyan to amber on the theory that bright
 * cyan was its accent slot. It is not — the set uses it for browser chrome and
 * panel framing, so the software illustration came back with every screen
 * header amber. About a fifth of the image in the action colour, and a UI
 * rendered in what reads as a warning colour.
 *
 * So the whole cyan family folds into the indigo ramp at its original
 * lightness, which preserves the header-against-panel contrast the artist
 * drew, and amber is reserved for the stray magenta path — a few percent, and
 * genuinely the one element the eye is meant to follow.
 *
 * That rule is right for the software illustration, where cyan is browser
 * chrome and panel fill. It is WRONG for the robotics one, where cyan is the
 * person — shirt #6dcff3, face and hands #bbe9fa. Folding that into indigo put
 * the figure at the same hue and lightness as the leaf behind them and the
 * head disappeared into the background.
 *
 * Which is the honest limit of doing this over pixels: collapsing two hue
 * families into one destroys whatever separation the artist was using them
 * for, and only looking at the picture tells you what that was. So the cyan
 * decision is per-image, declared in PLAN below, rather than global.
 *
 * WHAT IS DELIBERATELY LEFT ALONE
 * -------------------------------
 * Only three bands are touched: cyan, blue and magenta. Everything from 0-174
 * and 256-299 is passed through untouched, which is what keeps skin tones —
 * they sit near 25deg, close enough to amber that a careless rule would turn a
 * face bright orange.
 *
 * Sources live in _source/ and are never written to, so this is idempotent and
 * re-runnable when the palette next moves.
 *
 *   node scripts/regrade-illustrations.mjs
 */
import { readdir, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const SRC = 'public/images/illustrations/_source'
const OUT = 'public/images/illustrations'

const BRAND_HUE = 228          // measured from the logo
const ACCENT_HUE = 38          // --c4-signal-500
const ACCENT_SAT = 91

/**
 * What the set's cyan family means in each illustration, and therefore where
 * it should go. `indigo` folds it into the brand ramp; `accent` sends it to
 * amber, which is right only where cyan carries the subject rather than the
 * furniture.
 */
const PLAN = {
  // Cyan is browser chrome and panel fill — furniture. Fold it in.
  'solution-software-platforms.png': { cyan: 'indigo' },
  // Cyan is the person. Amber keeps them separated from the blue scene and
  // makes the human the focal point, which is what the row is about.
  'solution-robotics.png': { cyan: 'accent' },
}
const DEFAULT_PLAN = { cyan: 'indigo' }

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn
  let h = 0
  if (d) {
    if (mx === r) h = ((g - b) / d) % 6
    else if (mx === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  const l = (mx + mn) / 2
  const s = d ? d / (1 - Math.abs(2 * l - 1)) : 0
  return [h, s, l]
}

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ]
}

function regrade(h, s, l, plan) {
  // Neutrals carry the paper and the line work. Leave them.
  if (s < 0.08) return null

  // Cyan. Lightness is preserved either way, so the artist's internal contrast
  // survives whichever hue it lands on.
  if (h >= 175 && h < 206) {
    if (plan.cyan === 'accent') {
      // Pulled slightly darker as it warms: amber at the source lightness
      // reads washed out where cyan read saturated.
      return [ACCENT_HUE, Math.min(s * 0.95, 0.92), Math.min(l * 0.93, 0.82)]
    }
    // Saturation only lightly pulled back — taking too much off turned the
    // panels a dead lavender-grey.
    return [BRAND_HUE - 4, Math.min(s * 0.9, 0.88), l]
  }

  // Blues. Already near the brand hue, so compress toward it rather than
  // flattening — the set's internal hue variation is what gives the art depth.
  if (h >= 206 && h <= 255) {
    return [BRAND_HUE + (h - BRAND_HUE) * 0.35, Math.min(s * 1.08, 0.95), l]
  }

  // Stray pink/rose path — off-palette in the source, and there is little of
  // it. The band stops at 5deg rather than running on into orange, which is
  // what keeps any real skin tone (nearer 25deg) out of it.
  if (h >= 295 || h < 5) {
    return [ACCENT_HUE, ACCENT_SAT / 100, Math.min(l, 0.68)]
  }

  return null
}

const files = (await readdir(SRC)).filter((f) => f.endsWith('.png'))
await mkdir(OUT, { recursive: true })

for (const file of files) {
  const plan = PLAN[file] ?? DEFAULT_PLAN
  const img = sharp(join(SRC, file))
  const { data, info } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  let changed = 0
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue
    const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2])
    const next = regrade(h, s, l, plan)
    if (!next) continue
    const [r, g, b] = hslToRgb(next[0], next[1], next[2])
    data[i] = r; data[i + 1] = g; data[i + 2] = b
    changed++
  }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9, palette: true })
    .toFile(join(OUT, file))

  const pct = ((100 * changed) / (info.width * info.height)).toFixed(1)
  console.log(`${file}  ${info.width}x${info.height}  cyan->${plan.cyan}  ${pct}% remapped`)
}
