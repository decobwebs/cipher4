<script setup lang="ts">
useSeoMeta({
  title: 'Insights | Cipher4 AI & Robotics',
  description:
    'Practitioner notes on building operational systems for transport, logistics, oil and gas, and supply chain: offshore connectivity, procurement auditability, asset intelligence.',
})

const { data: articles } = await useAsyncData('insights-index', () =>
  queryCollection('insights')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all(),
)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div>
    <UiPageHero
      eyebrow="Insights"
      title="Notes from the work"
      lead="Written by the engineers doing it, about problems we keep running into. No product announcements, no industry-trends filler."
    />

    <section class="section">
      <div class="container">
        <div v-if="articles?.length" v-reveal.stagger class="articles">
          <article
            v-for="article in articles"
            :key="article.path"
            class="card card--interactive card--link article"
          >
            <div class="cluster">
              <span v-if="article.sector" class="pill pill--accent">
                {{ article.sector }}
              </span>
              <span v-if="article.readingTime" class="pill">
                {{ article.readingTime }}
              </span>
            </div>

            <h2 class="article__title">
              <NuxtLink :to="article.path" class="card__stretch">
                {{ article.title }}
              </NuxtLink>
            </h2>

            <p class="article__desc">{{ article.description }}</p>

            <p class="article__meta">
              <time :datetime="article.date">{{ formatDate(article.date) }}</time>
              <span aria-hidden="true">·</span>
              <span>{{ article.author }}</span>
            </p>
          </article>
        </div>

        <div v-else class="card empty">
          <h2>Nothing published yet</h2>
          <p class="lead mt-3">The first articles are being written.</p>
        </div>
      </div>
    </section>

    <SectionsCtaBand
      title="Working on something similar?"
      lead="If one of these matches a problem you have, we are happy to talk it through without it becoming a sales conversation."
      primary-label="Start a conversation"
      secondary-label="What we build"
      secondary-to="/solutions"
    />
  </div>
</template>

<style scoped>
.articles {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
}

.article {
  gap: var(--space-3);
}

.article__title {
  font-size: var(--fs-h3);
}

.article__title :deep(a) {
  color: inherit;
}

.article__desc {
  flex: 1;
  color: var(--text-secondary);
}

.article__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-block-start: var(--space-4);
  padding-block-start: var(--space-4);
  border-block-start: 1px solid var(--border-default);
  font-size: var(--fs-xs);
  color: var(--text-secondary);
}

.empty {
  align-items: start;
  padding: var(--space-10);
  max-width: 40rem;
}
</style>
