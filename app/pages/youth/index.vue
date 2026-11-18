<script setup lang="ts">
/**
 * Youth and skills (content I1). A community commitment, never an
 * "academy". No board of its own: the service header, the focus areas as
 * a six-card grid, how we help as numbered rows, and the two ways in as
 * link cards. No Foundation trustee photos (CLAUDE.md).
 */
import { youthPage as page } from '~/data/youth'

definePageMeta({ layout: 'c4' })
useSeoMeta({ title: page.seo.title, description: page.seo.description, ogTitle: page.seo.title, ogDescription: page.seo.description })

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Youth and skills' }]
</script>

<template>
  <div>
    <PageHero :crumbs="crumbs" :eyebrow="page.eyebrow" :title="page.title" :lead="page.lead" road="service" :text-width="720" />

    <section class="c4-section c4-section--paper" aria-labelledby="yo-focus">
      <div class="c4-wrap">
        <SectionHeader title-id="yo-focus" :title="page.focus.title" />
        <ul class="c4p-grid-3">
          <li v-for="(x, i) in page.focus.items" :key="x.title" class="c4-card yo-focus">
            <span class="c4p-n">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="c4p-link-card__title">{{ x.title }}</h3>
            <p class="c4p-link-card__text">{{ x.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="c4-section c4-section--white" aria-labelledby="yo-help">
      <div class="c4-wrap c4p-split">
        <div class="c4p-split__head">
          <h2 id="yo-help" class="c4-h2">{{ page.help.title }}</h2>
        </div>
        <ul class="c4p-rows">
          <li v-for="(h, i) in page.help.items" :key="h.title" class="yo-help">
            <C4Icon :name="h.icon" :size="44" :delay="i * 0.2" />
            <div class="yo-help__body">
              <h3 class="c4p-row-title">{{ h.title }}</h3>
              <p class="c4p-row-text">{{ h.text }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="c4-section c4-section--paper yo-ways" aria-labelledby="yo-ways">
      <div class="c4-wrap">
        <SectionHeader title-id="yo-ways" :title="page.ways.title" />
        <ul class="c4p-grid-2">
          <li v-for="w in page.ways.items" :key="w.to">
            <NuxtLink :to="w.to" class="c4-card c4p-link-card yo-way">
              <span class="yo-way__title">{{ w.title }}</span>
              <span class="c4p-link-card__text">{{ w.text }}</span>
              <span class="c4p-arrow"><span class="c4-sr-only">{{ w.title }}</span><C4Glyph name="arrow" :size="20" /></span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.yo-focus {
  display: flex;
  flex-direction: column;
  gap: var(--s-16);
  height: 100%;
  padding: var(--s-32);
}

.yo-help {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: var(--s-24);
  align-items: start;
}

.yo-help__body {
  display: flex;
  flex-direction: column;
  gap: var(--s-12);
}

.yo-way {
  min-height: 280px;
  padding: var(--s-48);
}

.yo-way__title {
  font-size: clamp(32px, 3.4vw, 48px);
  line-height: 1.05;
  letter-spacing: -0.035em;
}

@media (max-width: 767px) {
  .yo-focus {
    padding: var(--s-24);
  }

  .yo-help {
    grid-template-columns: 44px 1fr;
    gap: var(--s-16);
  }

  .yo-way {
    min-height: 200px;
    padding: var(--s-24);
  }
}
</style>
