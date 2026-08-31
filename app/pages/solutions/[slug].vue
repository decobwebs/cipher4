<script setup lang="ts">
import { solutions, getSolution } from '~/data/solutions'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const solution = computed(() => getSolution(slug.value))

// A missing slug is a real 404, not a blank page.
if (!solution.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Solution not found',
    fatal: true,
  })
}

const others = computed(() => solutions.filter((s) => s.slug !== slug.value))

useSeoMeta({
  title: () => `${solution.value!.shortTitle} | Cipher4 AI & Robotics`,
  description: () => solution.value!.summary,
  ogTitle: () => solution.value!.title,
  ogDescription: () => solution.value!.summary,
})
</script>

<template>
  <div v-if="solution">
    <UiPageHero
      eyebrow="Solutions"
      :title="solution.title"
      :lead="solution.summary"
      :breadcrumbs="[
        { label: 'Home', to: '/' },
        { label: 'Solutions', to: '/solutions' },
      ]"
    >
      <template #actions>
        <NuxtLink to="/contact" class="btn btn--accent">Discuss this</NuxtLink>
      </template>
    </UiPageHero>

    <!-- The problem, stated in the client's words -->
    <section class="section">
      <div class="container">
        <div class="split">
          <div v-reveal="'left'">
            <p class="eyebrow">The situation</p>
            <h2 class="mt-4">What usually brings people to us</h2>
            <ul class="problems mt-6">
              <li v-for="p in solution.problem" :key="p" class="problem">
                <Icon name="lucide:alert-circle" size="18" class="problem__icon" />
                <span>{{ p }}</span>
              </li>
            </ul>
          </div>

          <div v-reveal="'right'" class="hero-media">
            <NuxtImg
              :src="solution.image"
              :alt="solution.imageAlt"
              width="1800"
              height="1200"
              sizes="100vw md:50vw"
              format="webp"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- What we build -->
    <section class="section section--subtle">
      <div class="container">
        <UiSectionHeader eyebrow="What we build" title="The components" />

        <div v-reveal.stagger class="grid grid--2">
          <div v-for="block in solution.whatWeBuild" :key="block.title" class="card component">
            <div class="card__body">
              <h3 class="card__title">{{ block.title }}</h3>
              <p class="component__desc">{{ block.description }}</p>
              <!-- A rule between the description and the list. Without it the
                   prose and the items ran together as one grey block, which is
                   what made these cards read as undifferentiated. -->
              <hr class="rule component__rule">
              <UiCheckList :items="block.items" dense />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Integration and deployment -->
    <section class="section">
      <div class="container">
        <div class="split">
          <div v-reveal="'left'">
            <p class="eyebrow">Integration</p>
            <h2 class="mt-4">What it connects to</h2>
            <p class="lead mt-4">
              You already run systems that work. We connect to them rather than
              asking you to replace them.
            </p>
            <UiCheckList class="mt-6" :items="solution.integrations" />
          </div>

          <div v-reveal="'right'" class="deploy card">
            <div class="icon-plate icon-plate--solid">
              <Icon name="lucide:ship" size="20" />
            </div>
            <h3 class="card__title mt-4">Deployment</h3>
            <p class="text-secondary">{{ solution.deployment }}</p>

            <div class="deploy__note">
              <Icon name="lucide:shield-check" size="18" />
              <p>
                Read our security and data-ownership position on the
                <NuxtLink to="/credentials#policies">credentials page</NuxtLink>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Other solutions -->
    <section class="section section--subtle">
      <div class="container">
        <UiSectionHeader eyebrow="Also from Cipher4" title="Other capability groups" />
        <div v-reveal.stagger class="grid grid--2">
          <UiFeatureCard
            v-for="other in others"
            :key="other.slug"
            :icon="other.icon"
            :title="other.shortTitle"
            :to="`/solutions/${other.slug}`"
          >
            <p class="text-secondary">{{ other.teaser }}</p>
          </UiFeatureCard>
        </div>
      </div>
    </section>

    <SectionsCtaBand />
  </div>
</template>

<style scoped>
/* --- "The components" cards --------------------------------------------- */

.component__desc {
  color: var(--text-secondary);
  line-height: var(--lh-compact);
  /* Holds the description to a comfortable line count in a half-width card.
     Without it the text runs the full card width and the list below reads as
     a continuation of the paragraph rather than a separate register. */
  max-width: 34ch;
}

.component__rule {
  margin-block: var(--space-1) var(--space-2);
}

.problems {
  display: grid;
  gap: var(--space-4);
  max-width: var(--measure);
}

.problem {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-3);
  align-items: start;
  padding: var(--space-4);
  border-inline-start: 3px solid var(--border-strong);
  background-color: var(--bg-subtle);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  color: var(--text-secondary);
  font-size: var(--fs-sm);
  line-height: var(--lh-body);
}

.problem__icon {
  margin-block-start: 0.15em;
  color: var(--c4-graphite-light);
  flex-shrink: 0;
}

.hero-media {
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
}

.hero-media :deep(img) {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
}

.deploy__note {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-3);
  align-items: start;
  margin-block-start: var(--space-6);
  padding-block-start: var(--space-5);
  border-block-start: 1px solid var(--border-default);
  font-size: var(--fs-sm);
  color: var(--text-secondary);
}

.deploy__note :deep(svg) {
  color: var(--text-accent);
  margin-block-start: 0.1em;
}

.deploy__note a {
  color: var(--text-accent);
  text-decoration: underline;
}
</style>
