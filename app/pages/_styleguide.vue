<script setup lang="ts">
/**
 * /_styleguide: every token, colour, type style, icon and component of the
 * redesign on one page, for checking against the Main and Icons boards.
 * Internal only: noindex, blocked in robots.txt, linked from nowhere, and
 * removed at launch (plan, Phase 9).
 */
import { icons, type C4IconName } from '~/lib/icons'

definePageMeta({ layout: 'c4' })

useHead({
  title: 'Style guide',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

// --- Colour ---------------------------------------------------------------
const swatches = [
  { name: 'White', token: '--white', hex: '#FFFFFF', use: 'Main background' },
  { name: 'Paper', token: '--paper', hex: '#F5F7FC', use: 'Alternate sections' },
  { name: 'Mist', token: '--mist', hex: '#EEF1F8', use: 'Work showcase' },
  { name: 'Ink', token: '--ink', hex: '#0E1222', use: 'Headings and body' },
  { name: 'Ink 2', token: '--ink-2', hex: '#2A3146', use: 'Navigation, footer links' },
  { name: 'Slate', token: '--slate', hex: '#4A5268', use: 'Secondary text' },
  { name: 'Grey', token: '--grey', hex: '#8A92A6', use: 'Supporting, large text only' },
  { name: 'Line', token: '--line', hex: '#E3E7F0', use: 'Borders, dividers' },
  { name: 'Line 2', token: '--line-2', hex: '#D5DBE8', use: 'Stronger hairlines, fields' },
  { name: 'Cipher Indigo', token: '--indigo', hex: '#1A3AB5', use: 'Links, accent words' },
  { name: 'Brand Indigo', token: '--brand', hex: '#102068', use: 'Logo, deep accents' },
  { name: 'Signal Amber', token: '--amber', hex: '#F5A524', use: 'Buttons, nodes' },
]

const gradients = [
  { name: 'Amber gradient', token: '--amber-grad', use: 'Primary buttons' },
  { name: 'Night band', token: '--night', use: 'The closing band' },
]

function luminance(hex: string) {
  const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * v[0]! + 0.7152 * v[1]! + 0.0722 * v[2]!
}
function ratio(a: string, b: string) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (l1! + 0.05) / (l2! + 0.05)
}

// The text pairs the design actually uses. AA: 4.5 for body text, 3 for
// large text (24 px, or 19 px bold) and UI parts.
const pairs = [
  { fg: '#0E1222', bg: '#FFFFFF', label: 'Ink on white', need: 4.5 },
  { fg: '#2A3146', bg: '#FFFFFF', label: 'Ink 2 on white', need: 4.5 },
  { fg: '#4A5268', bg: '#FFFFFF', label: 'Slate on white', need: 4.5 },
  { fg: '#4A5268', bg: '#F5F7FC', label: 'Slate on paper', need: 4.5 },
  { fg: '#4A5268', bg: '#EEF1F8', label: 'Slate on mist', need: 4.5 },
  { fg: '#1A3AB5', bg: '#FFFFFF', label: 'Indigo on white', need: 4.5 },
  { fg: '#1A3AB5', bg: '#F5F7FC', label: 'Indigo on paper', need: 4.5 },
  { fg: '#8A92A6', bg: '#FFFFFF', label: 'Grey on white (large text, labels)', need: 3 },
  { fg: '#0A0E1F', bg: '#F5A524', label: 'Button text on amber', need: 4.5 },
  { fg: '#F4F6FF', bg: '#101A44', label: 'Text on the night band', need: 4.5 },
  { fg: '#C4C9DD', bg: '#1A2A63', label: 'Lead on the night band (78%), lightest point', need: 4.5 },
  { fg: '#AAB1CA', bg: '#1A2A63', label: 'Mono line on the night band (66%), lightest point', need: 4.5 },
  { fg: '#1A3AB5', bg: '#FFFFFF', label: 'Focus ring on white (UI part)', need: 3 },
  { fg: '#F4F6FF', bg: '#1A2A63', label: 'Focus ring on the night band (UI part)', need: 3 },
].map((p) => ({ ...p, r: ratio(p.fg, p.bg) }))

// --- Type -----------------------------------------------------------------
const typeRows = [
  { role: 'Display', spec: '92 / 0.98 · 400 · −4.5%', cls: 'c4-display', text: 'Intelligence for critical operations.' },
  { role: 'Heading 1', spec: '60 / 1.02 · 400 · −4%', cls: 'c4-h1', text: 'One system for the whole operation' },
  { role: 'Heading 2', spec: '58 / 1.04 · 400 · −3.5%', cls: 'c4-h2', text: 'Trusted with the systems that matter' },
  { role: 'Heading 3', spec: '24 / 1.3 · 600 · −2%', cls: 'c4-h3', text: 'Approvals and accountability' },
  { role: 'Lead', spec: '21 / 1.5 · 400 · slate', cls: 'c4-lead', text: 'We engineer the software, AI and connected systems that let complex operations sense what is happening, decide what comes next and prove what was done.' },
  { role: 'Body', spec: '17 / 1.65 · 400 · max 66ch', cls: 'c4-body', text: 'Every job as one record, moving through defined stages, with the right people notified at each step.' },
  { role: 'Label', spec: '12 · mono · +16% · caps', cls: 'c4-label', text: 'Maritime · Oil and gas · Logistics · Supply chain' },
]

// --- Space ----------------------------------------------------------------
const scale = [
  [4, 'Icon to label, hairline offsets'],
  [8, 'Inside buttons and chips'],
  [12, 'Eyebrow to its dot, list items'],
  [16, 'Title to its sentence'],
  [24, 'Eyebrow to headline, card groups'],
  [32, 'Headline to lead paragraph'],
  [48, 'Card padding, columns of text'],
  [64, 'Page side margins, footer blocks'],
  [96, 'Between columns, section padding on phones'],
  [128, 'Section padding on laptops'],
  [160, 'Section padding on large screens'],
] as const

// --- Icons ----------------------------------------------------------------
const groups = [
  { key: 'services', label: 'Services' },
  { key: 'sectors', label: 'Sectors' },
  { key: 'delivery', label: 'How we deliver' },
  { key: 'why', label: 'Why Cipher4' },
  { key: 'contact', label: 'Contact (from Phone-Screens, not part of the 20)' },
] as const
const iconNames = Object.keys(icons) as C4IconName[]
const byGroup = (g: string) => iconNames.filter((n) => icons[n].group === g)
const coreCount = iconNames.filter((n) => icons[n].group !== 'contact').length

// Remounting replays the draw-on.
const replay = ref(0)

const crumbs = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Operational platforms' },
]
</script>

<template>
  <div class="sg">
    <section class="sg-hero">
      <div class="c4-wrap sg-stack-24">
        <Eyebrow>Internal · not indexed · removed at launch</Eyebrow>
        <h1 class="c4-display">Style guide</h1>
        <p class="c4-lead">
          Every token, colour, type style, icon and component of the redesign, for checking against the
          Main and Icons boards. The header, menu, action bar and footer on this page are the live components.
        </p>
      </div>
    </section>

    <!-- COLOUR -->
    <section class="c4-section sg-sec" aria-labelledby="sg-colour">
      <div class="c4-wrap">
        <SectionHeader eyebrow="01 · Colour" title="Colour" lead="White comes first. The night gradient appears once per page, in the closing band." />
        <div class="sg-swatches">
          <div v-for="s in swatches" :key="s.token" class="sg-swatch">
            <div class="sg-swatch__chip" :style="{ background: `var(${s.token})` }" />
            <p class="sg-swatch__name">{{ s.name }}</p>
            <p class="sg-mono">{{ s.token }} · {{ s.hex }}</p>
            <p class="sg-note">{{ s.use }}</p>
          </div>
          <div v-for="g in gradients" :key="g.token" class="sg-swatch">
            <div class="sg-swatch__chip" :style="{ background: `var(${g.token})` }" />
            <p class="sg-swatch__name">{{ g.name }}</p>
            <p class="sg-mono">{{ g.token }}</p>
            <p class="sg-note">{{ g.use }}</p>
          </div>
        </div>

        <h3 class="c4-h3 sg-subhead">Contrast of every text pair in use</h3>
        <table class="sg-table">
          <thead>
            <tr><th scope="col">Pair</th><th scope="col">Sample</th><th scope="col">Ratio</th><th scope="col">AA needs</th><th scope="col">Result</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in pairs" :key="p.label">
              <td>{{ p.label }}</td>
              <td><span class="sg-sample" :style="{ color: p.fg, background: p.bg }">Aa</span></td>
              <td class="sg-mono">{{ p.r.toFixed(2) }} : 1</td>
              <td class="sg-mono">{{ p.need }} : 1</td>
              <td class="sg-mono" :class="p.r >= p.need ? 'sg-pass' : 'sg-fail'">{{ p.r >= p.need ? 'Pass' : 'Fail' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- TYPE -->
    <section class="c4-section c4-section--paper sg-sec" aria-labelledby="sg-type">
      <div class="c4-wrap">
        <SectionHeader eyebrow="02 · Typography" title="Geist and Geist Mono" lead="Geist 400 for display and headings with tight negative spacing. Geist Mono only for small upper-case labels and numbers." />
        <div class="sg-type">
          <div v-for="t in typeRows" :key="t.role" class="sg-type__row">
            <p class="sg-mono">{{ t.role }}</p>
            <p :class="t.cls">{{ t.text }}</p>
            <p class="sg-mono">{{ t.spec }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SPACE -->
    <section class="c4-section sg-sec">
      <div class="c4-wrap">
        <SectionHeader eyebrow="03 · Space" title="The spacing scale" lead="Every gap comes from this scale. Sections: 160 on large screens, 128 on laptops, 112 on tablets, 96 on phones. Heading to content: 88, or 56 on phones. Content stays inside 1320 px." />
        <div class="sg-scale">
          <div v-for="[v, use] in scale" :key="v" class="sg-scale__row">
            <span class="sg-mono">{{ v }}</span>
            <span class="sg-scale__bar" :style="{ width: `${v}px` }" />
            <span class="sg-note">{{ use }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- LOGO -->
    <section class="c4-section c4-section--paper sg-sec">
      <div class="c4-wrap">
        <SectionHeader eyebrow="04 · The mark" title="C4Logo" lead="Full colour by default. Reversed on the night band only. The compact drawing (heavier strokes, solid lower node) is for 64 px and below, as in the favicon." />
        <div class="sg-grid-2">
          <div class="c4-card sg-logo-tile">
            <C4Logo :size="220" />
            <p class="sg-mono sg-corner">Full colour · the default</p>
          </div>
          <div class="sg-logo-tile sg-logo-tile--dark on-dark">
            <C4Logo :size="220" tone="dark" />
            <p class="sg-mono sg-corner sg-corner--dark">Reversed · on the dark band only</p>
          </div>
          <div class="c4-card sg-pad sg-stack-32">
            <C4Logo variant="stacked" :size="50" />
            <C4Logo variant="inline" :size="32" />
            <p class="sg-mono">Lockups · stacked (footer) and inline (header)</p>
          </div>
          <div class="c4-card sg-pad sg-stack-32">
            <div class="sg-row-end">
              <C4Logo :size="64" compact />
              <C4Logo :size="32" compact />
              <C4Logo :size="16" compact />
              <img src="/favicon.svg" width="16" height="16" alt="">
            </div>
            <p class="sg-mono">Compact · 64, 32, 16 px, and the favicon file</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ICONS -->
    <section class="c4-section sg-sec">
      <div class="c4-wrap">
        <SectionHeader :eyebrow="`05 · Icons · ${coreCount} custom icons`" title="Drawn in light, one node each" lead="32 px grid, 1.5 px stroke, round ends, ink lines and one amber node. Each icon draws itself once as it scrolls into view (600 ms), then the node lights up. Hover a tile: the node pulses once.">
          <template #action>
            <C4Button variant="secondary" size="sm" @click="replay++">Replay the drawing</C4Button>
          </template>
        </SectionHeader>
        <div :key="replay" class="sg-stack-48">
          <div v-for="g in groups" :key="g.key" class="sg-stack-24">
            <p class="sg-mono">{{ g.label }}</p>
            <div class="sg-icons">
              <div v-for="(n, i) in byGroup(g.key)" :key="n" class="c4-card sg-icon">
                <C4Icon :name="n" :size="64" :delay="i * 0.15" />
                <p class="sg-icon__name">{{ icons[n].label }}</p>
                <p class="sg-mono">{{ n }}</p>
              </div>
            </div>
          </div>
          <div class="sg-stack-24">
            <p class="sg-mono">On the dark band: white lines, amber node</p>
            <div class="sg-icons sg-icons--dark on-dark">
              <div v-for="(n, i) in byGroup('services')" :key="n" class="sg-icon sg-icon--dark">
                <C4Icon :name="n" :size="48" tone="light" :delay="i * 0.1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BUTTONS -->
    <section class="c4-section c4-section--paper sg-sec">
      <div class="c4-wrap">
        <SectionHeader eyebrow="06 · Components" title="Buttons and links" lead="Amber for the one thing to press. White with a hairline for the second choice. Indigo text links with an amber arrow. Every tap target is at least 44 px." />
        <div class="sg-grid-2">
          <div class="c4-card sg-pad sg-stack-32">
            <p class="sg-mono">On white</p>
            <div class="sg-row">
              <C4Button to="/contact" arrow>Talk to us</C4Button>
              <C4Button to="/work" variant="secondary">See our work</C4Button>
              <C4Button to="/work/reliant-anchor" variant="text">Read the case study</C4Button>
            </div>
            <div class="sg-row">
              <C4Button to="/contact" size="sm">Talk to us</C4Button>
              <C4Button to="/contact" size="lg" arrow>Talk to us</C4Button>
            </div>
            <p class="sg-note">Sizes: 48 (header), 54 (default), 58 (closing band).</p>
          </div>
          <div class="sg-pad sg-dark-card on-dark sg-stack-32">
            <p class="sg-mono sg-mono--dark">On the night band</p>
            <div class="sg-row">
              <C4Button to="/contact" size="lg" arrow>Talk to us</C4Button>
              <C4Button to="/work" size="lg" variant="secondary" on-dark>See our work</C4Button>
            </div>
            <div class="sg-row">
              <C4Button to="/about" variant="text" on-dark>About Cipher4</C4Button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- LABELS AND HEADERS -->
    <section class="c4-section sg-sec">
      <div class="c4-wrap sg-stack-64">
        <div class="sg-stack-24">
          <p class="sg-mono">Eyebrow</p>
          <Eyebrow>Maritime · Oil and gas · Logistics · Supply chain</Eyebrow>
        </div>

        <div class="sg-stack-24">
          <div class="sg-row-between">
            <p class="sg-mono">Breadcrumb · types out once, like a system address</p>
            <C4Button variant="secondary" size="sm" @click="replay++">Replay</C4Button>
          </div>
          <Breadcrumb :key="`crumb-${replay}`" :items="crumbs" />
        </div>

        <div class="sg-stack-24">
          <p class="sg-mono">SectionHeader · stack</p>
          <div class="sg-frame">
            <SectionHeader eyebrow="Where we work" title="Built for industries where failure is expensive" lead="Our work is concentrated in four sectors that share the same demands: high-value assets, strict regulation and no tolerance for poor records." flush />
          </div>
        </div>

        <div class="sg-stack-24">
          <p class="sg-mono">SectionHeader · split, with a link</p>
          <div class="sg-frame">
            <SectionHeader layout="split" eyebrow="What we do" title="Six capabilities. One accountable partner." lead="From the platform an operation runs on to the devices in every office, we design, build and support the technology critical industries depend on." flush />
          </div>
          <div class="sg-frame">
            <SectionHeader eyebrow="Our work" title="Trusted with the systems that matter" flush>
              <template #action>
                <C4Button to="/work" variant="text">See all our work</C4Button>
              </template>
            </SectionHeader>
          </div>
        </div>

        <div class="sg-stack-24">
          <p class="sg-mono">Header, menu and action bar</p>
          <p class="c4-body">
            The header at the top of this page is the live component: hover or click Services, Sectors and Company.
            On a phone, the menu button opens the full-screen menu, and the action bar appears at the bottom once you
            have scrolled past the first screen and start scrolling back up.
          </p>
        </div>
      </div>
    </section>

    <ClosingBand />
  </div>
</template>

<style scoped>
.sg-hero {
  padding-top: calc(68px + var(--s-16) + var(--s-96));
  padding-bottom: var(--s-96);
  background: linear-gradient(180deg, var(--white), var(--paper));
  border-bottom: 1px solid var(--line);
}

.sg-sec {
  border-bottom: 1px solid var(--line);
}

.sg-mono {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slate);
}

.sg-mono--dark {
  color: var(--on-dark-2);
}

.sg-note {
  font-size: 14px;
  line-height: 1.5;
  color: var(--slate);
}

.sg-stack-24 { display: flex; flex-direction: column; gap: var(--s-24); }
.sg-stack-32 { display: flex; flex-direction: column; gap: var(--s-32); }
.sg-stack-48 { display: flex; flex-direction: column; gap: var(--s-48); }
.sg-stack-64 { display: flex; flex-direction: column; gap: var(--s-64); }
.sg-row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-12); }
.sg-row-end { display: flex; align-items: flex-end; gap: var(--s-32); }
.sg-row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--s-16); flex-wrap: wrap; }
.sg-pad { padding: var(--s-48); }
.sg-subhead { margin: var(--s-64) 0 var(--s-24); }

.sg-grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(420px, 100%), 1fr));
  gap: var(--s-24);
}

/* Colour */
.sg-swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--s-24) var(--s-16);
}

.sg-swatch {
  display: flex;
  flex-direction: column;
  gap: var(--s-8);
}

.sg-swatch__chip {
  height: 112px;
  border-radius: 14px;
  border: 1px solid var(--line);
}

.sg-swatch__name {
  font-weight: 600;
}

.sg-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}

.sg-table th,
.sg-table td {
  padding: var(--s-12) var(--s-12) var(--s-12) 0;
  border-bottom: 1px solid var(--line);
  text-align: left;
  vertical-align: middle;
}

.sg-table th {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slate);
}

.sg-sample {
  display: inline-block;
  padding: var(--s-4) var(--s-12);
  border-radius: var(--s-8);
  border: 1px solid var(--line);
  font-weight: 500;
}

.sg-pass { color: #146C2E; }
.sg-fail { color: #B42318; }

/* Type */
.sg-type__row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--s-8);
  padding: var(--s-24) 0;
  border-top: 1px solid var(--line);
}

@media (min-width: 900px) {
  .sg-type__row {
    grid-template-columns: 160px 1fr 220px;
    gap: var(--s-24);
    align-items: baseline;
  }
}

/* Space */
.sg-scale {
  display: flex;
  flex-direction: column;
}

.sg-scale__row {
  display: grid;
  grid-template-columns: 48px minmax(0, 160px) 1fr;
  gap: var(--s-24);
  align-items: center;
  min-height: 48px;
  border-top: 1px solid var(--line);
}

.sg-scale__bar {
  max-width: 100%;
  height: 8px;
  border-radius: var(--radius-pill);
  background: linear-gradient(90deg, var(--indigo), #4D6BE0);
}

/* Logo */
.sg-logo-tile {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  border-radius: var(--radius-card);
}

.sg-logo-tile--dark,
.sg-dark-card {
  border-radius: var(--radius-card);
  background: var(--night);
}

.sg-corner {
  position: absolute;
  left: var(--s-24);
  bottom: var(--s-24);
}

.sg-corner--dark {
  color: var(--on-dark-2);
}

/* Icons */
.sg-icons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(176px, 1fr));
  gap: var(--s-16);
}

.sg-icon {
  display: flex;
  flex-direction: column;
  gap: var(--s-12);
  padding: var(--s-24);
}

.sg-icon__name {
  margin-top: var(--s-4);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.35;
}

.sg-icons--dark {
  padding: var(--s-32);
  border-radius: var(--radius-card);
  background: var(--night);
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
}

.sg-icon--dark {
  align-items: center;
  padding: var(--s-16);
}

.sg-frame {
  padding: var(--s-48);
  border: 1px dashed var(--line-2);
  border-radius: var(--radius-card);
}

@media (max-width: 767px) {
  .sg-pad,
  .sg-frame {
    padding: var(--s-24);
  }

  .sg-logo-tile {
    min-height: 280px;
  }

  .sg-logo-tile :deep(svg) {
    width: 160px;
    height: 160px;
  }

  .sg-table {
    font-size: 14px;
  }
}
</style>
