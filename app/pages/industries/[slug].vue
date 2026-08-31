<script setup lang="ts">
import { industries, getIndustry } from '~/data/industries'
import { solutions } from '~/data/solutions'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const industry = computed(() => getIndustry(slug.value))

if (!industry.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Industry not found',
    fatal: true,
  })
}

const others = computed(() => industries.filter((i) => i.slug !== slug.value))

useSeoMeta({
  title: () => `${industry.value!.name} | Cipher4 AI & Robotics`,
  description: () => industry.value!.summary,
  ogTitle: () => `${industry.value!.name} operations | Cipher4`,
  ogDescription: () => industry.value!.summary,
})
</script>

<template>
  <div v-if="industry">
    <UiPageHero
      eyebrow="Industries"
      :title="industry.name"
      :lead="industry.summary"
      :breadcrumbs="[
        { label: 'Home', to: '/' },
        { label: 'Industries', to: '/industries' },
      ]"
    >
      <template #actions>
        <NuxtLink to="/contact" class="btn btn--accent">
          Talk to us about {{ industry.name.toLowerCase() }}
        </NuxtLink>
      </template>
    </UiPageHero>

    <!-- Image band -->
    <div v-reveal class="band">
      <div class="container">
        <div class="band__media">
          <NuxtImg
            :src="industry.image"
            :alt="industry.imageAlt"
            width="1920"
            height="1080"
            sizes="100vw lg:1200px"
            format="webp"
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <!-- Challenges -->
    <section class="section">
      <div class="container">
        <UiSectionHeader
          eyebrow="What we hear"
          title="The problems that come up first"
          lead="These are the three things operators in this sector raise before anything else."
        />

        <div v-reveal.stagger class="grid grid--3">
          <div
            v-for="challenge in industry.challenges"
            :key="challenge.title"
            class="card challenge"
          >
            <div class="card__body">
              <h3 class="card__title">{{ challenge.title }}</h3>
              <p class="text-secondary">{{ challenge.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Capabilities -->
    <section class="section section--subtle">
      <div class="container">
        <div class="split">
          <div v-reveal="'left'">
            <p class="eyebrow">What we deploy</p>
            <h2 class="mt-4">Systems built for this sector</h2>
            <p class="lead mt-4">
              Not a generic platform with a sector label on it. These are the
              specific capabilities we deploy into
              {{ industry.name.toLowerCase() }} operations.
            </p>
            <UiCheckList class="mt-6" :items="industry.capabilities" />
          </div>

          <div v-reveal="'right'" class="card context">
            <div class="icon-plate icon-plate--solid">
              <Icon name="lucide:info" size="20" />
            </div>
            <h3 class="card__title mt-4">Operating context</h3>
            <p class="text-secondary">
              The conditions that shape how a system has to be built here.
            </p>
            <ul class="context__list mt-4">
              <li v-for="item in industry.context" :key="item" class="context__item">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Related solutions -->
    <section class="section">
      <div class="container">
        <UiSectionHeader
          eyebrow="Capability groups"
          title="What we would draw on"
        />
        <div v-reveal.stagger class="grid grid--3">
          <UiFeatureCard
            v-for="solution in solutions"
            :key="solution.slug"
            :icon="solution.icon"
            :title="solution.shortTitle"
            :to="`/solutions/${solution.slug}`"
          >
            <p class="text-secondary">{{ solution.teaser }}</p>
          </UiFeatureCard>
        </div>
      </div>
    </section>

    <!-- Other sectors -->
    <section class="section section--subtle">
      <div class="container">
        <UiSectionHeader eyebrow="Other sectors" title="We also work in" />
        <div v-reveal.stagger class="grid grid--3">
          <UiFeatureCard
            v-for="other in others"
            :key="other.slug"
            :icon="other.icon"
            :title="other.name"
            :to="`/industries/${other.slug}`"
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
.band {
  padding-block: var(--space-12);
}

.band__media {
  overflow: hidden;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-default);
}

.band__media :deep(img) {
  width: 100%;
  aspect-ratio: 21 / 9;
  object-fit: cover;
}

.challenge {
  border-block-start: 3px solid var(--c4-signal-500);
}

.context__list {
  display: grid;
  gap: var(--space-4);
}

.context__item {
  padding-inline-start: var(--space-4);
  border-inline-start: 2px solid var(--border-default);
  font-size: var(--fs-sm);
  line-height: var(--lh-body);
  color: var(--text-secondary);
}
</style>
