<script setup lang="ts">
/**
 * Technologies (content F5). No board of its own: the service header,
 * then one row per group (group name left, names right), as tags like the
 * home page's technologies. Names, not company logos (owner decision).
 */
import { technologiesPage as page } from '~/data/technologies'

definePageMeta({ layout: 'c4' })
useSeoMeta({ title: page.seo.title, description: page.seo.description, ogTitle: page.seo.title, ogDescription: page.seo.description })

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Technologies' }]
</script>

<template>
  <div>
    <PageHero :crumbs="crumbs" :eyebrow="page.eyebrow" :title="page.title" :lead="page.lead" road="service" :text-width="680" />

    <section class="c4-section c4-section--paper" aria-labelledby="tx-list">
      <div class="c4-wrap">
        <h2 id="tx-list" class="c4-sr-only">{{ page.title }}</h2>
        <ul class="c4p-rows">
          <li v-for="(g, i) in page.groups" :key="g.title" class="tx-group">
            <h3 class="tx-group__title">
              <span class="c4p-n">{{ String(i + 1).padStart(2, '0') }}</span>
              {{ g.title }}
            </h3>
            <ul class="c4p-pills">
              <li v-for="t in g.items" :key="t">{{ t }}</li>
            </ul>
          </li>
        </ul>
      </div>
    </section>

    <section class="c4-section c4-section--white tx-close" aria-label="Our standards">
      <div class="c4-wrap">
        <p class="c4p-statement">{{ page.closing }}</p>
      </div>
    </section>

    <ClosingBand />
  </div>
</template>

<style scoped>
.tx-group {
  display: grid;
  grid-template-columns: 4fr 8fr;
  gap: var(--s-48);
  align-items: start;
}

.tx-group__title {
  display: flex;
  align-items: baseline;
  gap: var(--s-16);
  padding-top: var(--s-12);
  font-size: 23px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.tx-close {
  padding-bottom: var(--s-96);
}

@media (max-width: 900px) {
  .tx-group {
    grid-template-columns: 1fr;
    gap: var(--s-16);
  }

  .tx-group__title {
    padding-top: 0;
    font-size: 19px;
  }
}
</style>
