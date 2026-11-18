<script setup lang="ts">
/**
 * Sectors overview (content E1). No board of its own: built from the
 * Page-Sector header and the home page's sector cards, at a larger size
 * (E1: "four large panels: image, title, line, link"). The panel lines
 * are the home page lines (C5), from data/home.ts.
 *
 * The images are placeholders until the AI images are approved (plan,
 * section 9). Their aspect ratio is fixed, so nothing moves when they land.
 */
import { sectors as home } from '~/data/home'
import { sectorsOverview as page } from '~/data/sectors'

definePageMeta({ layout: 'c4' })
useSeoMeta({ title: page.seo.title, description: page.seo.description, ogTitle: page.seo.title, ogDescription: page.seo.description })

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Sectors' }]
</script>

<template>
  <div>
    <PageHero :crumbs="crumbs" :eyebrow="page.eyebrow" :title="page.title" :lead="page.lead" road="sector-maritime" :text-width="680" />

    <section class="c4-section c4-section--paper" aria-labelledby="sx-list">
      <div class="c4-wrap">
        <h2 id="sx-list" class="c4-sr-only">{{ page.eyebrow }}</h2>
        <!-- One route joins four industries (the meaning of Choreography 05). -->
        <ul v-m="'route'" data-seg class="sx-panels">
          <li v-for="(s, i) in home.items" :key="s.to" class="m-card" :style="{ '--i': i }">
            <NuxtLink :to="s.to" class="c4-card sx-panel">
              <span class="sx-panel__img" :class="`sx-panel__img--${s.tint}`" aria-hidden="true" />
              <span class="sx-panel__body">
                <svg class="m-route sx-route" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 1 H100" pathLength="1" /></svg>
                <span class="m-stop sx-stop" aria-hidden="true" />
                <C4Icon :name="s.icon" :size="48" :delay="i * 0.2" />
                <span class="sx-panel__title">{{ s.title }}</span>
                <span class="sx-panel__line">{{ s.line }}</span>
                <span class="c4p-arrow">Explore<C4Glyph name="arrow" /></span>
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <section class="c4-section c4-section--white" aria-labelledby="sx-beyond">
      <div class="c4-wrap c4p-split">
        <div class="c4p-split__head">
          <h2 id="sx-beyond" class="c4-h2">{{ page.beyond.title }}</h2>
        </div>
        <div v-m="'rise'" class="sx-beyond">
          <p class="sx-beyond__text">{{ page.beyond.text }}</p>
          <C4Button :to="page.beyond.link.to" variant="text">{{ page.beyond.link.label }}</C4Button>
        </div>
      </div>
    </section>

    <ClosingBand />
  </div>
</template>

<style scoped>
.sx-panels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-24);
  list-style: none;
}

.sx-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  transition: border-color var(--dur-ui) var(--ease-out), box-shadow var(--dur-ui) var(--ease-out);
}

.sx-panel:hover {
  border-color: var(--line-2);
  box-shadow: var(--shadow-float);
}

/* Fixed 16:9, so the approved images drop in without a shift. */
.sx-panel__img {
  display: block;
  aspect-ratio: 16 / 9;
}

.sx-panel__img--a { background: linear-gradient(160deg, #DCE3F6, #C9D3EF); }
.sx-panel__img--b { background: linear-gradient(200deg, #F7E6C8, #DCE3F6); }
.sx-panel__img--c { background: linear-gradient(140deg, #D5DDF4, #EEF1FA); }
.sx-panel__img--d { background: linear-gradient(220deg, #EEF1FA, #F4E3C2); }

.sx-route {
  top: -1px;
}

.sx-stop {
  position: absolute;
  top: -7px;
  left: var(--s-48);
}

.sx-panel__body {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--s-16);
  padding: var(--s-32) var(--s-48) var(--s-48);
}

.sx-panel__title {
  font-size: 32px;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.sx-panel__line {
  max-width: 46ch;
  padding-bottom: var(--s-16);
  font-size: 18px;
  line-height: 1.55;
  color: var(--slate);
}

.sx-panel:hover .c4p-arrow :deep(svg) {
  transform: translateX(4px);
}

.sx-beyond {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--s-24);
}

.sx-beyond__text {
  font-size: 21px;
  line-height: 1.6;
  color: var(--ink-2);
}

@media (max-width: 767px) {
  .sx-panels {
    grid-template-columns: 1fr;
    gap: var(--s-16);
  }

  .sx-panel__body {
    padding: var(--s-24);
  }

  .sx-stop {
    left: var(--s-24);
  }

  .sx-panel__title {
    font-size: 24px;
  }

  .sx-panel__line {
    font-size: 16px;
  }

  .sx-beyond__text {
    font-size: 18px;
  }
}
</style>
