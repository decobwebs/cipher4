<script setup lang="ts">
/**
 * Service page template (Page-Service board, Phone-Screens 03 and 04).
 * One template for all six services (content D2 to D7). Sections the
 * content file does not give a service are left out, not filled.
 *
 * Section headings come from the content file. The board's extra headings
 * and leads (for example "Where it starts", "Often delivered together")
 * are not in the content file, so they are not used.
 */
import {
  serviceBySlug, sectorRows, SERVICE_EYEBROW, PROBLEMS_TITLE, SECTORS_TITLE, RELATED_TITLE,
} from '~/data/services'
import { mainNav } from '~/data/site'
import { clients } from '~/data/home'

definePageMeta({ layout: 'c4' })

const route = useRoute()
const s = serviceBySlug(String(route.params.slug))
if (!s) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
const service = s

useSeoMeta({ title: service.seo.title, description: service.seo.description, ogTitle: service.seo.title, ogDescription: service.seo.description })

// Breadcrumb uses the short name from the navigation (content B2).
const short = mainNav[0]!.items!.find((i) => i.to === `/services/${service.slug}`)?.label ?? service.title
const crumbs = [{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: short }]

// The sections this service has, in board order. Backgrounds alternate.
const order = ['problems', 'build', 'approach', 'includes', 'sectors', 'note', 'fits', 'selected', 'brands', 'related'] as const
type Key = (typeof order)[number]
const present = order.filter((k) => {
  if (k === 'problems' || k === 'build') return true
  if (k === 'related') return !!service.related?.length
  return !!(service as unknown as Record<string, unknown>)[k]
})
const tone = (k: Key) => (present.indexOf(k) % 2 === 0 ? 'c4-section--paper' : 'c4-section--white')

const fourWay = service.build.items.length === 4 && !!service.build.items[0]!.bullets
const openPart = ref<number | null>(0)
const logoFor = (name: string) => clients.logos.find((l) => l.name === name)
</script>

<template>
  <div>
    <PageHero
      :crumbs="crumbs"
      :eyebrow="SERVICE_EYEBROW"
      :title="service.title"
      :lead="service.lead"
      road="service"
    >
      <template #actions>
        <C4Button :to="service.cta.to" arrow>{{ service.cta.label }}</C4Button>
      </template>
    </PageHero>

    <!-- What usually brings people to us -->
    <section class="c4-section sp-problems" :class="tone('problems')" aria-labelledby="sp-problems">
      <div class="c4-wrap sp-split">
        <div class="sp-split__head">
          <h2 id="sp-problems" class="c4-h2">{{ PROBLEMS_TITLE }}</h2>
        </div>
        <!-- Choreography 14: problems fall into line. -->
        <ol v-m="'straighten'" class="sp-problems__list">
          <li v-for="(p, i) in service.problems" :key="i" class="c4-card sp-problem m-card" :style="{ '--i': i }">
            <span class="sp-n">{{ String(i + 1).padStart(2, '0') }}</span>
            <p class="sp-problem__text">{{ p }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- What we build / what we do -->
    <section class="c4-section" :class="tone('build')" aria-labelledby="sp-build">
      <div class="c4-wrap">
        <SectionHeader
          v-if="service.build.title"
          title-id="sp-build"
          :eyebrow="service.build.label"
          :title="service.build.title"
        />
        <SectionHeader v-else title-id="sp-build" :title="service.build.label" />
        <!-- Choreography 15 (four parts): four parts join one record. -->
        <div v-m="fourWay ? 'join' : 'cards'" class="sp-build" :class="{ 'sp-build--three': service.build.items.length === 3, 'sp-build--four': fourWay }">
          <template v-if="fourWay">
            <span class="m-join m-join--t sp-joins" style="--i: 0" aria-hidden="true" />
            <span class="m-join m-join--r sp-joins" style="--i: 1" aria-hidden="true" />
            <span class="m-join m-join--b sp-joins" style="--i: 2" aria-hidden="true" />
            <span class="m-join m-join--l sp-joins" style="--i: 3" aria-hidden="true" />
          </template>
          <article v-for="(b, i) in service.build.items" :key="b.title" class="c4-card sp-part m-card" :class="{ 'is-open': openPart === i }" :style="{ '--i': i }">
            <C4Icon v-if="b.icon" :name="b.icon" :size="52" :delay="i * 0.25" class="sp-part__icon" />
            <h3 class="sp-part__title">
              <!-- Phones: the parts fold, one open at a time (Phone-Screens 04). -->
              <button
                type="button"
                class="sp-part__toggle"
                :aria-expanded="openPart === i"
                :aria-controls="`sp-part-${i}`"
                @click="openPart = openPart === i ? null : i"
              >
                <C4Icon v-if="b.icon" :name="b.icon" :size="28" still class="sp-part__mini" />
                <span>{{ b.title }}</span>
                <C4Glyph :name="openPart === i ? 'minus' : 'plus'" class="sp-part__sign" />
              </button>
              <span class="sp-part__label">{{ b.title }}</span>
            </h3>
            <div :id="`sp-part-${i}`" class="sp-part__body">
              <p v-if="b.text" class="sp-part__text">{{ b.text }}</p>
              <ul v-if="b.bullets" class="sp-dots">
                <li v-for="x in b.bullets" :key="x">{{ x }}</li>
              </ul>
            </div>
          </article>
          <!-- Four parts on one shared record: the mark at the centre. -->
          <div v-if="fourWay" class="sp-hub m-seal" aria-hidden="true">
            <C4Logo :size="44" />
          </div>
        </div>
      </div>
    </section>

    <!-- How we approach AI (D3) -->
    <section v-if="service.approach" class="c4-section" :class="tone('approach')" aria-labelledby="sp-approach">
      <div class="c4-wrap">
        <SectionHeader title-id="sp-approach" :title="service.approach.title" />
        <ul v-m="'cards'" class="sp-columns">
          <li v-for="(a, i) in service.approach.items" :key="a.title" class="sp-column m-card" :style="{ '--i': i }">
            <h3 class="sp-column__title">{{ a.title }}</h3>
            <p>{{ a.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- What every project includes (D5) -->
    <section v-if="service.includes" class="c4-section" :class="tone('includes')" aria-labelledby="sp-includes">
      <div class="c4-wrap sp-split">
        <div class="sp-split__head">
          <h2 id="sp-includes" class="c4-h2">{{ service.includes.title }}</h2>
        </div>
        <ul v-m="'rise'" class="sp-checks">
          <li v-for="(x, i) in service.includes.items" :key="x">
            <C4Icon name="check" :size="32" :delay="i * 0.15" />
            <span>{{ x }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- In your sector -->
    <section v-if="service.sectors" class="c4-section" :class="tone('sectors')" aria-labelledby="sp-sectors">
      <div class="c4-wrap">
        <SectionHeader title-id="sp-sectors" :title="SECTORS_TITLE" />
        <!-- Each sector accounted for, row by row. -->
        <ul v-m="'manifest'" class="sp-rows">
          <li v-for="(r, i) in sectorRows" :key="r.key" class="m-row" :style="{ '--i': i }">
            <NuxtLink :to="r.to" class="sp-row">
              <C4Icon :name="r.icon" :size="44" :delay="i * 0.2" class="sp-row__icon" />
              <span class="sp-row__title">{{ r.title }}</span>
              <span class="sp-row__line">{{ service.sectors[r.key] }}</span>
              <C4Glyph name="arrow" class="sp-row__arrow" />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- For organisations too (D7) -->
    <section v-if="service.note" class="c4-section" :class="tone('note')" aria-labelledby="sp-note">
      <div class="c4-wrap sp-split">
        <div class="sp-split__head">
          <h2 id="sp-note" class="c4-h2">{{ service.note.title }}</h2>
        </div>
        <p v-m="'rise'" class="sp-note__text"><span>{{ service.note.text }}</span></p>
      </div>
    </section>

    <!-- Fits what you already run (D2) -->
    <section v-if="service.fits" class="c4-section" :class="tone('fits')" aria-labelledby="sp-fits">
      <div class="c4-wrap sp-fits">
        <div class="sp-fits__copy">
          <h2 id="sp-fits" class="c4-h2">{{ service.fits.title }}</h2>
          <p class="c4-lead">{{ service.fits.text }}</p>
          <div class="c4-card sp-deploy">
            <p class="c4-label">{{ service.fits.deployment.label }}</p>
            <p>{{ service.fits.deployment.text }}</p>
          </div>
        </div>
        <!-- Choreography 16: your systems plug in. -->
        <div v-m="'plug'" class="sp-fits__diagram">
          <ul class="sp-systems">
            <li v-for="(x, i) in service.fits.items" :key="x" class="sp-system m-item" :style="{ '--i': i }"><span class="sp-system__dot" aria-hidden="true" />{{ x }}</li>
          </ul>
          <svg class="sp-wires" viewBox="0 0 140 328" preserveAspectRatio="none" aria-hidden="true">
            <path v-for="k in 5" :key="k" class="m-wire" pathLength="1" :style="{ '--i': k - 1 }" :d="`M0 ${28 + (k - 1) * 68} C70 ${28 + (k - 1) * 68} 70 164 140 164`" />
          </svg>
          <div class="sp-target m-target" aria-hidden="true">
            <C4Logo :size="56" />
          </div>
        </div>
      </div>
    </section>

    <!-- Selected websites (D5) -->
    <section v-if="service.selected" class="c4-section" :class="tone('selected')" aria-labelledby="sp-selected">
      <div class="c4-wrap">
        <SectionHeader title-id="sp-selected" :title="service.selected.title" />
        <ul v-m="'snap'" class="sp-logos">
          <li v-for="(n, i) in service.selected.items" :key="n" class="m-chip" :style="scatter(i)">
            <NuxtLink :to="service.selected.to" class="c4-card sp-logo">
              <img v-if="logoFor(n)" :src="logoFor(n)!.src" alt="" :width="logoFor(n)!.w" :height="logoFor(n)!.h" loading="lazy" class="sp-logo__img">
              <span class="sp-logo__name">{{ n }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- Brands we supply and support (D6) -->
    <section v-if="service.brands" class="c4-section" :class="tone('brands')" aria-labelledby="sp-brands">
      <div class="c4-wrap">
        <SectionHeader title-id="sp-brands" :title="service.brands.title" />
        <ul v-m="'snap'" class="sp-brands">
          <li v-for="(b, i) in service.brands.items" :key="b" class="m-chip" :style="scatter(i)">{{ b }}</li>
        </ul>
      </div>
    </section>

    <!-- Related -->
    <section v-if="service.related?.length" class="c4-section" :class="tone('related')" aria-labelledby="sp-related">
      <div class="c4-wrap">
        <SectionHeader title-id="sp-related" :title="RELATED_TITLE" />
        <ul v-m="'cards'" class="sp-related">
          <li v-for="(r, i) in service.related" :key="r.to" class="m-card" :class="{ 'sp-related__wide': r.image }" :style="{ '--i': i }">
            <NuxtLink :to="r.to" class="c4-card sp-rel" :class="{ 'sp-rel--image': r.image }">
              <span class="sp-rel__body">
                <C4Icon v-if="r.icon" :name="r.icon" :size="52" :delay="i * 0.3" />
                <span v-else-if="r.kind !== 'service'" class="c4-label">{{ r.kind === 'case' ? 'Case study' : r.kind === 'product' ? 'Product' : 'Community' }}</span>
                <span class="sp-rel__text">
                  <span class="sp-rel__title">{{ r.title }}</span>
                  <span class="sp-rel__line">{{ r.line }}</span>
                </span>
              </span>
              <span v-if="r.image" class="sp-rel__media">
                <img :src="r.image.src" alt="" :width="r.image.w" :height="r.image.h" loading="lazy">
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <ClosingBand />
  </div>
</template>

<style scoped>
.c4-section--white {
  background: var(--white);
}

.sp-n {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.14em;
  color: var(--indigo);
}

/* Heading on the left (sticky on desktop), content on the right. */
.sp-split {
  display: grid;
  grid-template-columns: 5fr 6fr;
  gap: var(--s-96);
  align-items: start;
}

.sp-split__head {
  position: sticky;
  top: 120px;
}

/* Problems */
.sp-problems__list {
  display: flex;
  flex-direction: column;
  gap: var(--s-24);
  list-style: none;
}

.sp-problem {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: var(--s-24);
  align-items: baseline;
  padding: var(--s-32) var(--s-48);
}

.sp-problem__text {
  font-size: 23px;
  line-height: 1.45;
  letter-spacing: -0.015em;
}

/* What we build */
.sp-build {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-24);
}

.sp-build--three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.sp-part {
  display: flex;
  flex-direction: column;
  gap: var(--s-24);
  padding: var(--s-48);
}

.sp-part__body {
  display: flex;
  flex-direction: column;
  gap: var(--s-24);
}

.sp-part__toggle {
  display: none;
}

.sp-part__title {
  font-size: 26px;
  line-height: 1.25;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.sp-part__text {
  max-width: 460px;
  font-size: 17px;
  line-height: 1.6;
  color: var(--slate);
}

.sp-dots {
  display: flex;
  flex-direction: column;
  gap: var(--s-12);
  padding-top: var(--s-24);
  border-top: 1px solid var(--line);
  list-style: none;
}

.sp-dots li {
  position: relative;
  padding-left: var(--s-24);
  font-size: 16px;
  line-height: 1.55;
  color: var(--ink-2);
}

.sp-dots li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.65em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--amber);
}

.sp-joins {
  z-index: 0;
}

.sp-build--four .sp-part {
  position: relative;
  z-index: 1;
}

.sp-hub {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  background: var(--white);
  border: 1px solid var(--line-2);
  box-shadow: 0 0 0 12px var(--white), 0 20px 50px rgba(16, 32, 104, 0.14);
  transform: translate(-50%, -50%);
}

/* Approach: three columns with a top rule */
.sp-columns {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--s-48);
  list-style: none;
}

.sp-column {
  display: flex;
  flex-direction: column;
  gap: var(--s-12);
  padding-top: var(--s-24);
  border-top: 2px solid var(--line-2);
  font-size: 17px;
  line-height: 1.6;
  color: var(--slate);
}

.sp-column:first-child {
  border-top-color: var(--amber);
}

.sp-column__title {
  font-size: 21px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.015em;
}

/* Includes */
.sp-checks {
  list-style: none;
}

.sp-checks li {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: var(--s-16);
  align-items: center;
  padding: var(--s-24) 0;
  border-top: 1px solid var(--line);
  font-size: 19px;
  line-height: 1.45;
}

.sp-checks li:last-child {
  border-bottom: 1px solid var(--line);
}

/* In your sector */
.sp-rows {
  list-style: none;
}

.sp-row {
  display: grid;
  grid-template-columns: 56px 300px 1fr 24px;
  gap: var(--s-24);
  align-items: center;
  padding: var(--s-32) 0;
  border-top: 1px solid var(--line);
  transition: background-color var(--dur-ui) var(--ease-out);
}

.sp-rows li:last-child .sp-row {
  border-bottom: 1px solid var(--line);
}

.sp-row__title {
  font-size: 23px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.sp-row__line {
  font-size: 17px;
  line-height: 1.55;
  color: var(--slate);
}

.sp-row__arrow {
  color: var(--amber);
  transition: transform var(--dur-ui) var(--ease-out);
}

.sp-row:hover .sp-row__arrow {
  transform: translateX(4px);
}

/* Note */
.sp-note__text {
  font-size: 21px;
  line-height: 1.6;
  color: var(--ink-2);
}

/* Fits what you already run */
.sp-fits {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: var(--s-96);
  align-items: center;
}

.sp-fits__copy {
  display: flex;
  flex-direction: column;
  gap: var(--s-24);
}

.sp-deploy {
  display: flex;
  flex-direction: column;
  gap: var(--s-8);
  margin-top: var(--s-12);
  padding: var(--s-24) var(--s-32);
  font-size: 16px;
  line-height: 1.6;
  color: var(--ink-2);
}

.sp-fits__diagram {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 140px 200px;
  align-items: center;
}

.sp-systems {
  display: flex;
  flex-direction: column;
  gap: var(--s-12);
  list-style: none;
}

.sp-system {
  display: flex;
  align-items: center;
  gap: var(--s-12);
  min-height: 56px;
  padding: 0 var(--s-16);
  border-radius: 14px;
  background: var(--white);
  border: 1px solid var(--line-2);
  font-size: 16px;
  color: var(--ink-2);
}

.sp-system__dot {
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--indigo);
}

.sp-wires {
  width: 140px;
  height: 328px;
  fill: none;
  stroke: var(--line-2);
  stroke-width: 1.5;
}

.sp-wires path:nth-child(3) {
  stroke: var(--amber);
}

.sp-target {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  border-radius: var(--radius-card);
  background: var(--white);
  border: 1px solid var(--line-2);
  box-shadow: var(--shadow-float);
}

/* Selected websites */
.sp-logos {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--s-24);
  list-style: none;
}

.sp-logo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--s-32);
  min-height: 200px;
  padding: var(--s-32);
}

.sp-logo__img {
  height: 44px;
  width: auto;
  filter: brightness(0);
  opacity: 0.5;
}

.sp-logo__name {
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -0.015em;
}

/* Brands */
.sp-brands {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-12);
  list-style: none;
}

.sp-brands li {
  display: inline-flex;
  align-items: center;
  height: 56px;
  padding: 0 var(--s-24);
  border-radius: var(--radius-pill);
  background: var(--white);
  border: 1px solid var(--line-2);
  font-size: 18px;
  font-weight: 500;
  color: var(--ink-2);
}

/* Related */
.sp-related {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: var(--s-24);
  list-style: none;
}

.sp-related > li {
  display: flex;
}

.sp-rel {
  display: flex;
  width: 100%;
  overflow: hidden;
  transition: border-color var(--dur-ui) var(--ease-out), box-shadow var(--dur-ui) var(--ease-out);
}

.sp-rel:hover {
  border-color: var(--line-2);
  box-shadow: var(--shadow-float);
}

.sp-rel__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--s-48);
  padding: var(--s-32);
}

.sp-rel__text {
  display: flex;
  flex-direction: column;
  gap: var(--s-8);
}

.sp-rel__title {
  font-size: 23px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.sp-rel__line {
  font-size: 16px;
  line-height: 1.55;
  color: var(--slate);
}

.sp-rel--image {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
}

.sp-rel__media {
  display: flex;
  padding: var(--s-24) 0 0 var(--s-24);
  background: var(--mist);
}

.sp-rel__media img {
  width: 100%;
  height: 100%;
  min-height: 200px;
  object-fit: cover;
  object-position: left top;
  border-radius: 12px 0 0 0;
  border: 1px solid var(--line-2);
  border-right: 0;
  border-bottom: 0;
}

/* --- Tablets and phones ------------------------------------------------------ */
@media (max-width: 1100px) {
  .sp-split,
  .sp-fits {
    grid-template-columns: 1fr;
    gap: var(--s-48);
  }

  .sp-split__head {
    position: static;
  }

  .sp-row {
    grid-template-columns: 48px 220px 1fr 24px;
  }

  .sp-logos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sp-related {
    grid-template-columns: 1fr 1fr;
  }

  .sp-related__wide {
    grid-column: 1 / -1;
  }
}

@media (max-width: 900px) {
  .sp-build,
  .sp-build--three,
  .sp-columns {
    grid-template-columns: 1fr;
  }

  .sp-hub,
  .sp-joins {
    display: none;
  }
}

@media (max-width: 767px) {
  /* The parts fold into a list; one open at a time. */
  .sp-build,
  .sp-build--three {
    gap: 0;
  }

  .sp-part {
    gap: 0;
    padding: 0;
    border: 0;
    border-top: 1px solid var(--line);
    border-radius: 0;
    background: none;
  }

  .sp-build .sp-part:last-of-type {
    border-bottom: 1px solid var(--line);
  }

  .sp-part__icon,
  .sp-part__label {
    display: none;
  }

  .sp-part__toggle {
    display: grid;
    grid-template-columns: 28px 1fr 16px;
    gap: var(--s-16);
    align-items: center;
    width: 100%;
    min-height: 64px;
    padding: var(--s-12) 0;
    text-align: left;
    font-size: 17px;
    font-weight: 600;
    color: var(--ink);
  }

  .sp-part:not(:has(.sp-part__mini)) .sp-part__toggle {
    grid-template-columns: 1fr 16px;
  }

  .sp-part__sign {
    color: var(--indigo);
  }

  .sp-part__body {
    gap: var(--s-16);
    padding: 0 0 var(--s-24) var(--s-48);
  }

  .sp-part:not(:has(.sp-part__mini)) .sp-part__body {
    padding-left: 0;
  }

  .sp-dots {
    padding-top: 0;
    border-top: 0;
  }

  .sp-problem {
    grid-template-columns: 40px 1fr;
    gap: var(--s-12);
    padding: var(--s-24);
  }

  .sp-problem__text {
    font-size: 18px;
  }

  .sp-part {
    gap: var(--s-16);
    padding: var(--s-24);
  }

  .sp-part__title {
    font-size: 21px;
  }

  .sp-part__text {
    font-size: 16px;
  }

  .sp-row {
    grid-template-columns: 40px 1fr 16px;
    gap: var(--s-8) var(--s-16);
    padding: var(--s-24) 0;
  }

  .sp-row__icon {
    grid-row: span 2;
    width: 36px;
    height: 36px;
  }

  .sp-row__title {
    font-size: 18px;
  }

  .sp-row__line {
    grid-column: 2;
    font-size: 15px;
  }

  .sp-row__arrow {
    grid-column: 3;
    grid-row: 1;
  }

  .sp-checks li {
    font-size: 17px;
  }

  .sp-note__text {
    font-size: 18px;
  }

  .sp-fits__diagram {
    grid-template-columns: 1fr;
  }

  .sp-wires,
  .sp-target {
    display: none;
  }

  .sp-logos,
  .sp-related {
    grid-template-columns: 1fr;
  }

  .sp-rel--image {
    grid-template-columns: 1fr;
  }

  .sp-rel__media img {
    min-height: 160px;
  }
}
</style>

<style>
/* Phones: closed parts are hidden only when JavaScript can open them. */
@media (max-width: 767px) {
  .c4-js .sp-part:not(.is-open) .sp-part__body {
    display: none;
  }
}
</style>
