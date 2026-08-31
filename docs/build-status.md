# Cipher4 site — build status and open work

Living handover. Update it as things land; it exists so no context is lost between
sessions and so nobody has to re-derive decisions from the diff.

Last updated: 2026-08-30

---

## Brand palette decision — 2026-08-30

**Approved: indigo + warm signal (amber).** Cyan is out.

### Why

The palette was never derived from the mark. Measured across every opaque pixel:

| | full mark | header mark |
|---|---|---|
| Neutral grey (S < 12%) | 49% | 48% |
| Blue (H 215-245) | 51% | 52% |
| **Cyan (H 170-210)** | **2 px, 0.001%** | **0 px** |

The mark's blue is HSL 228, 78%, 21% — about `#102068`. ΔE76 against what the site was using:

| Token | Was | vs the mark | ΔE76 |
|---|---|---|---|
| `--c4-cyan-500` "the accent" | `#00a6e0` | logo indigo | **61.3** |
| `--c4-navy-800` "matches the logo" | `#14204f` | logo indigo | **16.7** |
| `--c4-graphite` "from the logo's 4" | `#3f4654` | logo grey | **9.4** |

Hue on the navy was right (228 both); saturation was 60% against the mark's 78%. The comments in
`tokens.css` claiming derivation from the logo were false and have been corrected.

### The reasoning behind amber rather than a mark-derived accent

The mark holds two colours, indigo and neutral grey, and neither can serve as an action colour.
So the accent is a brand *extension* under any route — redrawing the logo first would not have
produced one. Amber is the complement of the mark's hue (229 → 49) and is the colour transport,
logistics and oil & gas already read as operational: hi-vis, plant signage, hazard marking. It
also separates Cipher4 from the navy-and-cyan default that every B2B tech company uses.

### Known risk, accepted

Amber is conventionally the *warning* semantic. As the primary action colour it can read as
caution, and it sits only 34 of hue from `--c4-danger`. The separation is carried by lightness
(bright amber vs deep red), not hue. In the operations product this needs watching specifically
where `Urgent` sits next to a destructive control.

### Sequencing decided

Site first, logo later, and they are not the same size of job.

- **Now:** align navy and graphite to the mark's true values, swap the accent ramp. One file,
  reversible, and the indigo survives any later redraw of the mark.
- **Now, separately:** vectorise the mark and produce an on-white version. Production hygiene —
  `cipher4-logo-full.png` is 1.36 MB on a black ground with a baked glow and cannot go on white
  at all.
- **Later, its own engagement:** redraw the mark. Its real problems are structural, not colour —
  it is half neutral grey, the wrench reads as repairs rather than autonomy or control, and it
  does not survive 28px. The palette is that redraw's brief, which is why it goes second.

### One refinement made during the build: accent text is indigo, not amber

Amber dark enough to pass AA on white is `#8a5a00`, and at that value nobody reads it as amber.
It reads as brown. On the hero headline and across six card callouts at once it looked muddy.

So the roles split, which is better discipline anyway: **amber fills, indigo texts.** Buttons,
chips, step markers, focus rings and the hero effect are amber. Accent *text* is
`--c4-indigo-700` at 9.07:1, the brand's own blue rather than a third colour. `--text-on-wash`
is the single exception, for amber text sitting on an amber wash where nothing else works.

An action colour earns its meaning by being reserved for things you can act on. Spending it on
headline emphasis and eyebrows was diluting it.

### Illustration re-grade — `scripts/regrade-illustrations.mjs`

Done. Originals are preserved untouched in `public/images/illustrations/_source/`; the script
reads from there and writes the graded versions out, so it is idempotent and re-runnable the
next time the palette moves. Re-run it with `node scripts/regrade-illustrations.mjs`.

The illustrations were never recoloured to Cipher4 — they ship in the Freepik/vectorjuice house
palette. Measured: the blues already sit at 220-230, near the brand hue. The cyan family did
not, and after the palette change it was the last cool cyan on the site.

**Method: hue-band remap preserving lightness.** Not a swatch lookup table — these files hold
10-16k distinct colours, nearly all antialiasing between a dozen flat fills, and snapping every
intermediate to its nearest swatch would have produced jagged edges. Remapping by hue band while
holding lightness leaves antialiased pixels on the line between their two neighbours, so edges
stay clean with no blending pass.

**A CSS filter cannot do this.** `hue-rotate()` is global: rotating cyan (195) onto the brand hue
(228) drags the blues that are already correct round to 260 and the whole thing goes purple. The
two bands have to move independently.

**The cyan decision is per-image, and that is the honest limit of the technique.** Collapsing two
hue families into one destroys whatever separation the artist was using them for, and only
looking at the picture tells you what that was:

- *Software platforms* — cyan is browser chrome and panel fill. Folds into indigo. First attempt
  sent it to amber on the theory that bright cyan was the accent slot; it came back with every
  screen header amber, about a fifth of the image in the action colour, and a UI rendered in what
  reads as a warning colour.
- *Robotics* — cyan is the person: shirt `#6dcff3`, face and hands `#bbe9fa`. Folding that into
  indigo put the figure at the same hue and lightness as the leaf behind them and the head
  vanished into the background. It goes to amber instead, which separates the human from the blue
  scene and makes them the focal point.

Only three bands are touched — cyan, blue, and the rose/magenta path. Everything from 5 to 174
passes through untouched, which is what keeps real skin tones safe; they sit near 25, close
enough to amber that a careless rule turns a face orange.

Side effect: the graded PNGs are 86 KB and 62 KB against 241 KB and 193 KB before, because flat
art quantises well.

### Still worth doing properly

**Get the vector sources from Freepik.** You have the premium subscription, and vectorjuice ships
these as AI/EPS with flat named swatches. Recolouring at source takes minutes per file, gives
exact control over which *shape* takes the accent rather than which colour band, and ships as SVG
— smaller than the PNG and sharp at any size. Pixel re-grading is a good stopgap, not the
finished answer. Pull all three at once, including the missing Technology Supply piece.

### /solutions: the media column now carries information, not a picture

The page was shipping three navy placeholder slabs with the filenames printed on them. The fix
was not to drop the illustrations in, because the page's real problem is that it repeats the
home page: same three capabilities, same alternating split, same summary copy word for word.
The same picture under the same paragraph a second time would have made that worse.

The column now lists each capability's `whatWeBuild` groups, which is the one thing this page has
that the home page does not. No new asset, and the page becomes the index into the detail pages
rather than a second copy of the home page's summary.

### LogoLoop is responsive

The props were writing `--ll-gap` and `--ll-h` as inline styles, which beat any scoped rule that
is not `!important`, so the component could not be made responsive from CSS. On a 390px screen a
128px gap between 56px marks left one and a half logos on screen with a hole either side.

The props now set `--ll-gap-base` / `--ll-h-base` and the stylesheet derives the used values with
`min()`, clamping down at 48rem and again at 30rem. No viewport JavaScript, so nothing to go
wrong through SSR hydration, and a caller already passing small values is left alone rather than
scaled up. At 390px: 5 marks visible instead of 2, panel height 103px instead of ~180px.

### Follow-up this change creates
- `scripts/audit.mjs` hardcodes the accent gradient's lightest stop for button contrast; it has
  to move with the ramp.

---

## Current state

Build passes: 113 routes prerendered, exit 0.

All three verification gates pass against the static build:

| Gate | Command | Result |
|---|---|---|
| Contrast + alt text | `BASE=http://localhost:3400 node scripts/audit.mjs` | 0 findings, 14 pages |
| Keyboard | `BASE=http://localhost:3400 node scripts/keyboard-check.mjs` | every tabbed element has a visible ring |
| Horizontal overflow | `BASE=http://localhost:3400 node scripts/overflow-sweep.mjs` | clean at 360/390/768/1024/1440/1920, 9 pages |

To reproduce: `npm run build`, then `PORT=3400 node scripts/static-server.mjs`, then the three
commands above.

---

## Done this session

### Process section rebuilt light — `app/components/sections/ProcessFlow.vue`

Two separate faults, one rewrite.

1. **Half the cards did not paint.** Each card ran its own `backdrop-filter` over a
   `z-index: -1` aura inside an `overflow: hidden` section, while the reveal directive held
   `will-change: opacity, transform` on the parent. Chrome intermittently failed to raster
   that stack, so the left grid column came up blank while the right column rendered. The
   elements were present and at `opacity: 1` the whole time, which is why it never showed up
   in a headless probe. Fixed by dropping the whole stack in favour of the `.glass` primitive
   over a plain background, not by tuning it.
2. **It was a navy band in a white site.** Now `.section--subtle`, light glass cards, three
   across at 72rem so six steps land as two clean rows with no orphan cell.

Also: the step number was an oversized ghost numeral at 4.5% opacity, which nobody reads as a
number. It is a solid chip now, and the redundant "STEP 01" eyebrow beside it is gone — the
word lives in the accessible name via `.sr-only`.

One real bug fixed on the way: `.node__desc + .node__deliverable { margin-block-start: space-5 }`
was more specific than the `margin-block-start: auto` that pins the deliverable to the bottom of
the card, so it silently cancelled it and the divider sat at a different height in every card of
a row. Spacing is a margin-bottom on the description now, leaving `auto` free to do its job.

### Footer turned white — `app/components/layout/AppFooter.vue`

Dropped `.on-dark`, white ground with a hairline top border. Token swaps: `--text-on-dark` →
`--text-primary`, `--border-on-dark` → `--border-default`, and every `--c4-cyan-400` hover →
`--text-accent` (cyan-700). Cyan-400 is a dark-context accent and measures about 2.4:1 on white,
so leaving it would have reintroduced AA failures in the link hovers.

### `scripts/audit.mjs` de-staled again

The script short-circuits contrast lookups for gradient-backed dark bands by matching a
hardcoded selector list, and `footer` and `.node__card` were both on it. Once both went light
the script reported ~580 failures against a navy that had been deleted. The short-circuit now
only fires when the matched element genuinely has no paintable `backgroundColor` of its own,
which is the gradient case it was written for, so it self-heals the next time a band changes
material.

This is the second time this file has gone stale against the design (the first was `.hero` and
`.btn--primary`). Worth remembering when a band changes colour.

---

## Open questions for the client

- **The CTA band above the footer is still dark** (`app/components/sections/CtaBand.vue`,
  `--grad-abyss`). Left deliberately: with everything else light it is now the single point of
  emphasis before the footer, and it reads as a closing punch rather than a leftover. Say the
  word and it goes light too.
- **The four "components" cards leave a hole** — four cards in a three-column grid puts one
  alone on row two with two empty cells beside it. 2×2, or let the fourth span two columns?

## Blocked on assets or information from Cipher4

| Item | Needed | Effect while missing |
|---|---|---|
| Third illustration, Technology Supply | One from the same vectorjuice Freepik set. Suggested searches: "IT infrastructure abstract concept", "server room abstract concept", "network engineer abstract concept" | Composed icon fallback renders in its place |
| CAC / RC number | The number, for `company.rcNumber` in `app/data/company.ts` (currently `''`) | Proof strip and footer omit it silently |
| `cipher4-logo.png` | An SVG, or an optimisation pass | 1.36 MB loads in the header on every page |
| "Reliant Anchor" legible in work screenshots | Confirm permission to show the name, or it gets masked | Screenshot ships with a client name visible |
| Supply-chain image, four recognisable faces | Decision: replace or accept | Breaks rule 6 of `docs/image-brief.md` |
| 10 remaining generated images | Per `docs/image-brief.md` v3 (light grade) | Navy placeholders with filenames printed on them |

## Still to do

- **Content pass across the remaining routes.** Only `/credentials` and `/projects` have been
  through it. The standing brief: clear, plainly written, nothing that reads as AI-written, and
  no em-dashes anywhere in copy.
- **Remaining dark surfaces**, if the site is going fully light: `PageHero.vue`, and the
  `section--inverse` blocks in `app/pages/about.vue`, `app/pages/credentials.vue`,
  `app/pages/solutions/index.vue`.

---

## Standing constraints

- Nuxt 4.5 / Vue 3.5, SSR plus static prerender. Not React, not Tailwind.
- Token-based CSS only: `tokens.css` → `components.css` → `utilities.css` → `base.css`. No raw
  hex, no raw pixel font sizes, no one-off durations in a component.
- Glass tints sit at 72–92% opacity, not the 15–30% the style guidance suggests. Our panels
  carry text; the tint is what guarantees AA, and blur is only a finish.
- WCAG AA is a gate, not a goal. `scripts/audit.mjs` must read 0 before anything ships.
- No em-dashes in user-facing copy.
- Never invent a fact, a metric or a client. Flag the gap instead.
