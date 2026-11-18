<script setup lang="ts">
/**
 * An Insights article (content H2: the two articles, word for word apart
 * from the listed edits). A reading page: a white header with no road, so
 * nothing moves near the words (plan, Phase 6 rule), then the article at a
 * comfortable line length, the other article, and the closing band.
 */
import { insightsPage, formatDate } from '~/data/insights'

definePageMeta({ layout: 'c4' })

const route = useRoute()
const { data: article } = await useAsyncData(`insight-${route.path}`, () =>
  queryCollection('insights').path(route.path).first(),
)
if (!article.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

const { data: all } = await useAsyncData('insights-all', () =>
  queryCollection('insights').where('draft', '=', false).order('date', 'DESC').all(),
)
const others = computed(() => (all.value || []).filter((a) => a.path !== route.path))

useSeoMeta({
  title: () => `${article.value?.title} | Cipher4 AI & Robotics`,
  description: () => article.value?.description,
  ogTitle: () => article.value?.title,
  ogDescription: () => article.value?.description,
  ogType: 'article',
  articlePublishedTime: () => article.value?.date,
})

const crumbs = computed(() => [
  { label: 'Home', to: '/' },
  { label: insightsPage.eyebrow, to: '/insights' },
  { label: article.value?.sector ?? '' },
])
</script>

<template>
  <div v-if="article">
    <PageHero :crumbs="crumbs" :eyebrow="insightsPage.eyebrow" :title="article.title" :lead="article.description" size="case" :min-height="0" :text-width="880">
      <template #meta>
        <p class="ar-meta">
          <span class="c4-label">{{ article.sector }}</span>
          <span class="ar-meta__dot" aria-hidden="true" />
          <span>{{ article.readingTime }}</span>
          <span class="ar-meta__dot" aria-hidden="true" />
          <time :datetime="article.date">{{ formatDate(article.date) }}</time>
        </p>
      </template>
    </PageHero>

    <section class="c4-section ar-body" aria-label="Article">
      <div class="c4-wrap">
        <ContentRenderer :value="article" class="c4p-prose" />
      </div>
    </section>

    <section v-if="others.length" class="c4-section c4-section--paper ar-more" aria-labelledby="ar-more">
      <div class="c4-wrap">
        <h2 id="ar-more" class="c4-h3 ar-more__title">{{ insightsPage.eyebrow }}</h2>
        <ul class="c4p-grid-2">
          <li v-for="a in others" :key="a.path">
            <NuxtLink :to="a.path" class="c4-card c4p-link-card">
              <span class="c4-label">{{ a.sector }} · {{ a.readingTime }}</span>
              <span class="c4p-link-card__title">{{ a.title }}</span>
              <span class="c4p-arrow">Read<C4Glyph name="arrow" /></span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <ClosingBand />
  </div>
</template>

<style scoped>
.ar-meta {
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

.ar-meta__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--line-2);
}

.ar-body {
  padding-top: var(--s-64);
  border-top: 1px solid var(--line);
}

.ar-more__title {
  margin-bottom: var(--s-32);
}
</style>
