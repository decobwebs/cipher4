<script setup lang="ts">
/**
 * Insights index (content H1). No board of its own: the service header,
 * then the article cards in the home page's Insights style (sector, read
 * time, date, title, summary), and H1's own closing words in the closing
 * band. The articles come from content/insights/*.md.
 */
import { insightsPage as page, formatDate } from '~/data/insights'

definePageMeta({ layout: 'c4' })
useSeoMeta({ title: page.seo.title, description: page.seo.description, ogTitle: page.seo.title, ogDescription: page.seo.description })

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Insights' }]

const { data: articles } = await useAsyncData('insights-index', () =>
  queryCollection('insights').where('draft', '=', false).order('date', 'DESC').all(),
)
</script>

<template>
  <div>
    <PageHero :crumbs="crumbs" :eyebrow="page.eyebrow" :title="page.title" :lead="page.lead" road="service" :text-width="680" />

    <section class="c4-section c4-section--paper" aria-labelledby="in-list">
      <div class="c4-wrap">
        <h2 id="in-list" class="c4-sr-only">{{ page.eyebrow }}</h2>
        <ul class="c4p-grid-2">
          <li v-for="a in articles" :key="a.path">
            <NuxtLink :to="a.path" class="c4-card c4p-link-card in-card">
              <span class="in-card__meta">
                <span class="c4-label">{{ a.sector }}</span>
                <span class="in-card__dot" aria-hidden="true" />
                <span>{{ a.readingTime }}</span>
                <span class="in-card__dot" aria-hidden="true" />
                <time :datetime="a.date">{{ formatDate(a.date) }}</time>
              </span>
              <span class="in-card__title">{{ a.title }}</span>
              <span class="c4p-link-card__text">{{ a.description }}</span>
              <span class="c4p-arrow">Read<C4Glyph name="arrow" /></span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <ClosingBand
      :title="page.closing.title"
      :lead="page.closing.lead"
      :primary="page.closing.cta"
      :secondary="null"
      :promise="null"
    />
  </div>
</template>

<style scoped>
.in-card {
  gap: var(--s-24);
  min-height: 420px;
  padding: var(--s-48);
}

.in-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-8) var(--s-12);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--slate);
}

.in-card__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--line-2);
}

.in-card__title {
  font-size: clamp(26px, 2.4vw, 34px);
  line-height: 1.15;
  letter-spacing: -0.03em;
  text-wrap: balance;
}

@media (max-width: 767px) {
  .in-card {
    min-height: 0;
    padding: var(--s-24);
  }
}
</style>
