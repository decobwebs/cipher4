<script setup lang="ts">
/**
 * Our work (content F1). No board of its own: the Page-Case header, the
 * home page's work carousel for the three platforms (plan, section 5:
 * WorkCarousel is "for the home page and Work"), then the websites as cards.
 *
 * Filter: All, Platforms, Websites. Without JavaScript both groups show.
 * Images only from the approved set; other cards show the client's logo in
 * one tone, and Kasim Auwal Lawal's card his name only (F1 note).
 *
 * "Visit site" links appear only for cards with an address in
 * data/work.ts. The content file gives none yet (owner question).
 */
import { workIndex as page, platformCards, websiteCards, type WorkFilter } from '~/data/work'

definePageMeta({ layout: 'c4' })
useSeoMeta({ title: page.seo.title, description: page.seo.description, ogTitle: page.seo.title, ogDescription: page.seo.description })

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Our work' }]

/**
 * Logos (owner, 19 Nov 2026): every logo inside the same 160 x 48 box,
 * scaled to fit, never stretched, in solid ink. Sized by area rather than
 * by height, so a tall mark and a long wordmark carry the same visual
 * weight; then capped to the box.
 */
const BOX_W = 160
const BOX_H = 48
const AREA = 3600
function logoBox(l: { w: number; h: number }) {
  const ratio = l.w / l.h
  let w = Math.sqrt(AREA * ratio)
  let h = w / ratio
  if (h > BOX_H) { h = BOX_H; w = h * ratio }
  if (w > BOX_W) { w = BOX_W; h = w / ratio }
  return { width: `${Math.round(w)}px`, height: `${Math.round(h)}px` }
}
const filter = ref<WorkFilter>('all')
const show = (k: Exclude<WorkFilter, 'all'>) => filter.value === 'all' || filter.value === k
</script>

<template>
  <div>
    <PageHero :crumbs="crumbs" :eyebrow="page.eyebrow" :title="page.title" :lead="page.lead" :drawing="{ icon: 'chart', code: 'C4-030' }" :text-width="680">
      <template #below>
        <div class="wk-filter" role="group" aria-label="Show">
          <button
            v-for="f in page.filters"
            :key="f.key"
            type="button"
            class="wk-filter__btn"
            :aria-pressed="filter === f.key"
            @click="filter = f.key"
          >{{ f.label }}</button>
        </div>
      </template>
    </PageHero>

    <section v-show="show('platforms')" class="c4-section c4-section--mist" aria-labelledby="wk-platforms">
      <div class="c4-wrap">
        <SectionHeader title-id="wk-platforms" :title="page.platformsTitle" />
        <WorkCarousel v-m="'zoom'" :items="platformCards" :label="page.platformsTitle" />
      </div>
    </section>

    <section v-show="show('websites')" class="c4-section c4-section--white" aria-labelledby="wk-websites">
      <div class="c4-wrap">
        <SectionHeader title-id="wk-websites" :title="page.websitesTitle" />
        <ul v-m="'cards'" class="wk-sites">
          <li v-for="(w, i) in websiteCards" :key="w.name" class="m-card" :class="{ 'wk-sites__wide': w.image }" :style="{ '--i': i }">
            <article class="c4-card wk-site" :class="{ 'wk-site--image': w.image }">
              <div class="wk-site__body">
                <div class="wk-site__brand">
                  <span v-if="w.logo" class="wk-site__logo-box" aria-hidden="true">
                    <span class="wk-site__logo" :style="{ ...logoBox(w.logo), '--logo': `url(${w.logo.src})` }" />
                  </span>
                  <div>
                    <h3 class="wk-site__name">{{ w.name }}</h3>
                    <p class="c4-label wk-site__field">{{ w.field }}</p>
                  </div>
                </div>
                <p class="wk-site__headline">{{ w.headline }}</p>
                <p class="wk-site__line">{{ w.line }}</p>
                <C4Button v-if="w.url" :href="w.url" variant="text" external>{{ page.visit }}</C4Button>
              </div>
              <div v-if="w.image" class="wk-site__media">
                <img :src="w.image.src" :alt="w.image.alt" :width="w.image.w" :height="w.image.h" loading="lazy">
              </div>
            </article>
          </li>
        </ul>
      </div>
    </section>

    <ClosingBand />
  </div>
</template>

<style scoped>
.wk-filter {
  display: inline-flex;
  align-self: flex-start;
  gap: var(--s-4);
  margin-top: var(--s-8);
  padding: var(--s-4);
  border-radius: var(--radius-pill);
  background: var(--mist);
}

.wk-filter__btn {
  min-height: 44px;
  padding: 0 var(--s-24);
  border-radius: var(--radius-pill);
  font-size: 15px;
  color: var(--slate);
  transition: background-color var(--dur-ui) var(--ease-out), color var(--dur-ui) var(--ease-out);
}

.wk-filter__btn:hover {
  color: var(--ink);
}

.wk-filter__btn[aria-pressed='true'] {
  background: var(--white);
  box-shadow: 0 2px 8px rgba(16, 32, 104, 0.1);
  font-weight: 600;
  color: var(--ink);
}

/* Without JavaScript the filter cannot work, so it is not shown. */
html:not(.c4-js) .wk-filter {
  display: none;
}

.wk-sites {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--s-24);
  list-style: none;
}

.wk-sites > li {
  display: flex;
}

.wk-sites__wide {
  grid-column: 1 / -1;
}

.wk-site {
  display: flex;
  width: 100%;
  overflow: hidden;
}

.wk-site--image {
  display: grid;
  grid-template-columns: 5fr 7fr;
}

.wk-site__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--s-16);
  padding: var(--s-32);
}

.wk-site--image .wk-site__body {
  padding: var(--s-48);
}

.wk-site__brand {
  display: flex;
  flex-direction: column;
  gap: var(--s-24);
  margin-bottom: var(--s-8);
}

/* Logos (owner, 19 Nov 2026): the same 160 x 48 box for every logo, the
   logo scaled to fit inside it, in solid ink. The files are white on
   transparent, so the logo's own shape is used as a mask over an ink fill:
   exact #0E1222, never grey, never stretched, never blurred. */
.wk-site__logo-box {
  display: flex;
  align-items: center;
  width: 160px;
  height: 48px;
}

.wk-site__logo {
  display: block;
  background: var(--ink);
  -webkit-mask: var(--logo) center / contain no-repeat;
  mask: var(--logo) center / contain no-repeat;
}

.wk-site__name {
  font-size: 21px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.015em;
}

.wk-site__field {
  margin-top: var(--s-8);
  color: var(--slate);
}

.wk-site__headline {
  font-size: 19px;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: var(--ink);
}

.wk-site__line {
  font-size: 16px;
  line-height: 1.6;
  color: var(--slate);
}

.wk-site__media {
  display: flex;
  padding: var(--s-32) 0 0 var(--s-32);
  background: var(--mist);
}

.wk-site__media img {
  width: 100%;
  height: 100%;
  min-height: 280px;
  object-fit: cover;
  object-position: left top;
  border-radius: 12px 0 0 0;
  border: 1px solid var(--line-2);
  border-right: 0;
  border-bottom: 0;
}

@media (max-width: 1100px) {
  .wk-sites {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .wk-filter {
    display: flex;
    align-self: stretch;
  }

  .wk-filter__btn {
    flex: 1;
    padding: 0 var(--s-12);
  }

  .wk-sites {
    grid-template-columns: 1fr;
    gap: var(--s-16);
  }

  .wk-site--image {
    grid-template-columns: 1fr;
  }

  .wk-site__body,
  .wk-site--image .wk-site__body {
    padding: var(--s-24);
  }

  .wk-site__media {
    padding: var(--s-24) 0 0 var(--s-24);
  }

  .wk-site__media img {
    min-height: 180px;
  }
}
</style>
