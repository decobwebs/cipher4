<script setup lang="ts">
/**
 * Sector page template (Page-Sector board, Phone-Screens 05), for content
 * E2 to E5. Every sector page has the same layout (content E note): hero,
 * three problems, what we build, operating context, services we draw on,
 * related work (or reading), other sectors, closing band.
 *
 * Headings come from the content file; the board's own headings are not in
 * it, so they are not used.
 */
import { sectorBySlug, sectors, relatedReading, SECTOR_EYEBROW, HEADINGS } from '~/data/sectors'
import { mainNav } from '~/data/site'

definePageMeta({ layout: 'c4' })

const route = useRoute()
const found = sectorBySlug(String(route.params.slug))
if (!found) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
const sector = found

useSeoMeta({ title: sector.seo.title, description: sector.seo.description, ogTitle: sector.seo.title, ogDescription: sector.seo.description })

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Sectors', to: '/sectors' }, { label: sector.title }]
const others = sector.others.map((slug) => sectors.find((x) => x.slug === slug)!)
const otherIcon = (slug: string) => mainNav[1]!.items!.find((i) => i.to === `/sectors/${slug}`)?.icon ?? 'maritime'

// Phones: problem cards swipe sideways; a small bar shows where you are.
const track = ref<HTMLElement | null>(null)
const progress = ref(0)
function onTrack() {
  const el = track.value
  if (!el) return
  const max = el.scrollWidth - el.clientWidth
  progress.value = max > 0 ? el.scrollLeft / max : 0
}
</script>

<template>
  <div>
    <PageHero
      :crumbs="crumbs"
      :eyebrow="SECTOR_EYEBROW"
      :title="sector.title"
      :lead="sector.lead"
      :drawing="{ icon: sector.icon, code: `C4-02${['M', 'O', 'L', 'S'].indexOf(sector.code[0]!) + 1}` }"
    >
      <template #actions>
        <C4Button :to="sector.cta.to" arrow>{{ sector.cta.label }}</C4Button>
      </template>
    </PageHero>

    <!-- What we hear first -->
    <section class="c4-section c4-section--paper" aria-labelledby="sc-problems">
      <div class="c4-wrap">
        <SectionHeader title-id="sc-problems" :title="HEADINGS.problems" />
        <!-- Choreography 17: the sector's own line runs across each card. -->
        <ol ref="track" v-m="'tide'" class="sc-problems" @scroll.passive="onTrack">
          <li v-for="(p, i) in sector.problems" :key="p.title" class="c4-card sc-problem m-card" :style="{ '--i': i }">
            <SectorLine :kind="sector.line" class="sc-problem__line" />
            <span class="sc-n">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="sc-problem__title">{{ p.title }}</h3>
            <p class="sc-problem__text">{{ p.text }}</p>
          </li>
        </ol>
        <div class="sc-progress" aria-hidden="true">
          <span :style="{ transform: `translateX(${progress * 200}%)` }" />
        </div>
      </div>
    </section>

    <!-- What we build -->
    <section class="c4-section" aria-labelledby="sc-build">
      <div class="c4-wrap sc-build">
        <div class="sc-build__head">
          <h2 id="sc-build" class="c4-h2">{{ HEADINGS.build }}</h2>
          <C4Button :to="sector.cta.to" variant="text">{{ sector.cta.label }}</C4Button>
        </div>
        <!-- Choreography 18: checked off like a manifest. -->
        <ol v-m="'manifest'" class="sc-list">
          <li v-for="(b, i) in sector.build" :key="b" class="sc-list__item m-row" :style="{ '--i': i }">
            <span class="sc-code">{{ sector.code }}-{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="sc-list__text">{{ b }}</span>
            <span class="sc-list__bar" :style="{ width: `${40 + i * 12}px` }" aria-hidden="true" />
          </li>
        </ol>
      </div>
    </section>

    <!-- Operating context -->
    <section class="c4-section c4-section--mist" aria-labelledby="sc-context">
      <div class="c4-wrap">
        <SectionHeader title-id="sc-context" :title="HEADINGS.context" />
        <ul v-m="'rise'" class="sc-context">
          <li v-for="c in sector.context" :key="c">{{ c }}</li>
        </ul>
      </div>
    </section>

    <!-- Services we draw on -->
    <section class="c4-section sc-services" aria-labelledby="sc-services">
      <div class="c4-wrap">
        <SectionHeader title-id="sc-services" :title="HEADINGS.services" />
        <ul v-m="'snap'" class="sc-chips">
          <li v-for="(sv, i) in sector.services" :key="sv.to" class="m-chip" :style="scatter(i)">
            <NuxtLink :to="sv.to" class="c4-card sc-chip">
              <C4Icon :name="sv.icon" :size="40" :delay="i * 0.2" />
              <span class="sc-chip__title">{{ sv.title }}</span>
              <C4Glyph name="arrow" class="sc-arrow" />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- Related work, or related reading (E5) -->
    <section class="c4-section" aria-labelledby="sc-related">
      <div class="c4-wrap">
        <SectionHeader title-id="sc-related" :title="sector.related.title" />
        <ul v-if="sector.related.items.length" v-m="'cards'" class="sc-work">
          <li v-for="(w, i) in sector.related.items" :key="w.name" class="m-card" :style="{ '--i': i }">
            <NuxtLink :to="w.to" class="c4-card sc-work__card">
              <span class="sc-work__media">
                <img v-if="w.image" :src="w.image.src" alt="" :width="w.image.w" :height="w.image.h" loading="lazy" class="sc-work__shot">
                <img v-else-if="w.logo" :src="w.logo" alt="" loading="lazy" class="sc-work__logo">
              </span>
              <span class="sc-work__body">
                <span class="c4-label">{{ w.kind }}</span>
                <span class="sc-work__name">{{ w.name }}</span>
                <span class="sc-work__line">{{ w.line }}</span>
              </span>
            </NuxtLink>
          </li>
        </ul>
        <NuxtLink v-else v-m="'rise'" :to="relatedReading.to" class="c4-card sc-reading">
          <span class="sc-reading__meta"><span>{{ relatedReading.sector }}</span><span>{{ relatedReading.read }}</span></span>
          <span class="sc-reading__title">{{ relatedReading.title }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Other sectors -->
    <section class="c4-section c4-section--paper" aria-labelledby="sc-others">
      <div class="c4-wrap">
        <SectionHeader title-id="sc-others" :title="HEADINGS.others" />
        <ul v-m="'cards'" class="sc-others">
          <li v-for="(o, i) in others" :key="o.slug" class="m-card" :style="{ '--i': i }">
            <NuxtLink :to="`/sectors/${o.slug}`" class="sc-other">
              <C4Icon :name="otherIcon(o.slug)" :size="48" :delay="i * 0.25" />
              <span class="sc-other__name">{{ o.title }}<C4Glyph name="arrow" class="sc-arrow" /></span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <ClosingBand />
  </div>
</template>

<style scoped>
.sc-n {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.14em;
  color: var(--indigo);
}

.sc-arrow {
  color: var(--amber);
  transition: transform var(--dur-ui) var(--ease-out);
}

a:hover .sc-arrow {
  transform: translateX(4px);
}

/* Problems */
.sc-problems {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--s-24);
  list-style: none;
}

.sc-problem {
  display: flex;
  flex-direction: column;
  gap: var(--s-24);
  padding: 0 var(--s-32) var(--s-48);
  overflow: hidden;
}

.sc-problem__line {
  margin: 0 calc(-1 * var(--s-32));
  width: calc(100% + 2 * var(--s-32));
}

.sc-problem__title {
  font-size: 25px;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.sc-problem__text {
  font-size: 17px;
  line-height: 1.6;
  color: var(--slate);
}

.sc-progress {
  display: none;
}

/* What we build */
.sc-build {
  display: grid;
  grid-template-columns: 4fr 8fr;
  gap: var(--s-96);
  align-items: start;
}

.sc-build__head {
  position: sticky;
  top: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--s-24);
}

.sc-list {
  list-style: none;
}

.sc-list__item {
  display: grid;
  grid-template-columns: 96px 1fr 120px;
  gap: var(--s-24);
  align-items: center;
  padding: var(--s-24) 0;
  border-top: 1px solid var(--line);
}

.sc-list__item:last-child {
  border-bottom: 1px solid var(--line);
}

.sc-code {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.14em;
  color: var(--grey);
}

.sc-list__text {
  font-size: 22px;
  line-height: 1.4;
  letter-spacing: -0.015em;
}

.sc-list__bar {
  justify-self: end;
  height: 2px;
  background: linear-gradient(90deg, var(--line-2), var(--amber));
}

/* Operating context: three columns with a top rule, the first amber. */
.sc-context {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--s-48);
  list-style: none;
}

.sc-context li {
  padding-top: var(--s-24);
  border-top: 2px solid var(--line-2);
  font-size: 19px;
  line-height: 1.55;
  color: var(--ink-2);
}

.sc-context li:first-child {
  border-top-color: var(--amber);
}

/* Services we draw on */
.sc-services {
  padding-bottom: 0;
}

.sc-chips {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--s-24);
  list-style: none;
}

.sc-chips > li {
  display: flex;
}

.sc-chip {
  display: flex;
  align-items: center;
  gap: var(--s-16);
  width: 100%;
  padding: var(--s-24);
  transition: border-color var(--dur-ui) var(--ease-out), box-shadow var(--dur-ui) var(--ease-out);
}

.sc-chip:hover {
  border-color: var(--line-2);
  box-shadow: var(--shadow-float);
}

.sc-chip__title {
  flex: 1;
  font-size: 18px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.015em;
}

/* Related work */
.sc-work {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--s-24);
  list-style: none;
}

.sc-work > li {
  display: flex;
}

.sc-work__card {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  transition: border-color var(--dur-ui) var(--ease-out), box-shadow var(--dur-ui) var(--ease-out);
}

.sc-work__card:hover {
  border-color: var(--line-2);
  box-shadow: var(--shadow-float);
}

.sc-work__media {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  aspect-ratio: 16 / 10;
  padding: var(--s-24) var(--s-24) 0;
  background: var(--mist);
}

.sc-work__shot {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: left top;
  border-radius: 10px 10px 0 0;
  border: 1px solid var(--line-2);
  border-bottom: 0;
}

.sc-work__logo {
  align-self: center;
  height: 56px;
  width: auto;
  margin-bottom: var(--s-24);
  filter: brightness(0);
  opacity: 0.5;
}

.sc-work__body {
  display: flex;
  flex-direction: column;
  gap: var(--s-8);
  padding: var(--s-24) var(--s-24) var(--s-32);
}

.sc-work__name {
  font-size: 22px;
  line-height: 1.25;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.sc-work__line {
  font-size: 15px;
  line-height: 1.55;
  color: var(--slate);
}

.sc-reading {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--s-64);
  max-width: 640px;
  padding: var(--s-48);
}

.sc-reading__meta {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slate);
}

.sc-reading__title {
  font-size: clamp(24px, 2.3vw, 32px);
  line-height: 1.15;
  letter-spacing: -0.03em;
}

/* Other sectors */
.sc-others {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--s-48);
  list-style: none;
}

.sc-other {
  display: flex;
  flex-direction: column;
  gap: var(--s-48);
  padding-top: var(--s-32);
  border-top: 1px solid var(--line-2);
}

.sc-other__name {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--s-16);
  font-size: 28px;
  line-height: 1.2;
  letter-spacing: -0.03em;
}

/* --- Tablets and phones ------------------------------------------------------ */
@media (max-width: 1100px) {
  .sc-build {
    grid-template-columns: 1fr;
    gap: var(--s-48);
  }

  .sc-build__head {
    position: static;
  }

  .sc-chips,
  .sc-work {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .sc-context,
  .sc-others {
    grid-template-columns: 1fr;
    gap: var(--s-32);
  }
}

@media (max-width: 767px) {
  /* Problems swipe sideways (Phone-Screens 05). */
  .sc-problems {
    display: flex;
    gap: var(--s-12);
    margin-inline: calc(-1 * var(--gutter));
    padding: 0 var(--gutter);
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--gutter);
    scrollbar-width: none;
  }

  .sc-problems::-webkit-scrollbar {
    display: none;
  }

  .sc-problem {
    flex: 0 0 82%;
    scroll-snap-align: start;
    gap: var(--s-16);
    padding: 0 var(--s-24) var(--s-32);
  }

  .sc-problem__line {
    margin: 0 calc(-1 * var(--s-24));
    width: calc(100% + 2 * var(--s-24));
  }

  .sc-problem__title {
    font-size: 21px;
  }

  .sc-problem__text {
    font-size: 15px;
  }

  .sc-progress {
    display: block;
    position: relative;
    width: 48px;
    height: 3px;
    margin-top: var(--s-16);
    border-radius: 2px;
    background: var(--line-2);
    overflow: hidden;
  }

  .sc-progress span {
    position: absolute;
    left: 0;
    top: 0;
    width: 33.4%;
    height: 100%;
    border-radius: 2px;
    background: var(--amber);
    transition: transform 120ms linear;
  }

  .sc-list__item {
    grid-template-columns: 56px 1fr;
    gap: var(--s-12);
    padding: var(--s-16) 0;
  }

  .sc-list__text {
    font-size: 17px;
  }

  .sc-list__bar {
    display: none;
  }

  .sc-context li {
    font-size: 17px;
  }

  .sc-chips,
  .sc-work {
    grid-template-columns: 1fr;
  }

  .sc-other {
    flex-direction: row;
    align-items: center;
    gap: var(--s-16);
    padding: var(--s-16) 0;
  }

  .sc-other__name {
    flex: 1;
    font-size: 21px;
  }

  .sc-reading {
    padding: var(--s-24);
    gap: var(--s-48);
  }
}
</style>
