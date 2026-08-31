<script setup lang="ts">
const route = useRoute()

const { data: article } = await useAsyncData(`insight-${route.path}`, () =>
  queryCollection('insights').path(route.path).first(),
)

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article not found',
    fatal: true,
  })
}

const { data: related } = await useAsyncData(`related-${route.path}`, () =>
  queryCollection('insights')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .limit(3)
    .all(),
)

const others = computed(() =>
  (related.value || []).filter((a) => a.path !== route.path).slice(0, 2),
)

useSeoMeta({
  title: () => `${article.value?.title} | Cipher4 Insights`,
  description: () => article.value?.description,
  ogTitle: () => article.value?.title,
  ogDescription: () => article.value?.description,
  ogType: 'article',
  articlePublishedTime: () => article.value?.date,
  articleAuthor: () => [article.value?.author].filter(Boolean) as string[],
})

function formatDate(date?: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div v-if="article">
    <UiPageHero
      eyebrow="Insights"
      :title="article.title"
      :lead="article.description"
      :breadcrumbs="[
        { label: 'Home', to: '/' },
        { label: 'Insights', to: '/insights' },
      ]"
    />

    <section class="section">
      <div class="container">
        <div class="layout">
          <article>
            <p class="meta">
              <time :datetime="article.date">{{ formatDate(article.date) }}</time>
              <span aria-hidden="true">·</span>
              <span>{{ article.author }}</span>
              <span v-if="article.readingTime" aria-hidden="true">·</span>
              <span v-if="article.readingTime">{{ article.readingTime }}</span>
            </p>

            <div class="prose mt-8">
              <ContentRenderer :value="article" />
            </div>
          </article>

          <aside class="aside">
            <div class="card">
              <p class="eyebrow">Talk to us</p>
              <h2 class="card__title mt-3">Working on this?</h2>
              <p class="text-secondary">
                If this matches something you are dealing with, we are happy to
                talk it through.
              </p>
              <NuxtLink to="/contact" class="btn btn--primary mt-5">
                Start a conversation
              </NuxtLink>
            </div>

            <div v-if="others.length" class="card mt-6">
              <p class="eyebrow">More</p>
              <ul class="related mt-3">
                <li v-for="other in others" :key="other.path">
                  <NuxtLink :to="other.path" class="related__link">
                    {{ other.title }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  gap: var(--space-12);
}

@media (min-width: 64rem) {
  .layout {
    grid-template-columns: minmax(0, 1fr) 20rem;
    gap: var(--space-16);
    align-items: start;
  }
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding-block-end: var(--space-5);
  border-block-end: 1px solid var(--border-default);
  font-size: var(--fs-sm);
  color: var(--text-secondary);
}

@media (min-width: 64rem) {
  .aside {
    position: sticky;
    top: 6rem;
  }
}

.related {
  display: grid;
  gap: var(--space-3);
}

.related__link {
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  color: var(--text-primary);
  line-height: var(--lh-snug);
}

.related__link:hover {
  color: var(--text-accent);
}
</style>
