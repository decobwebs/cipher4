<script setup lang="ts">
import {
  publishedProjects,
  publishedClients,
  publishedTestimonials,
  sectors,
} from '~/data/projects'
import { solutions } from '~/data/solutions'

useSeoMeta({
  title: 'Projects & Clients | Cipher4 AI & Robotics',
  description:
    'Systems Cipher4 has built and deployed for transport, logistics, oil and gas, and supply chain operators, and what changed as a result.',
})

const all = publishedProjects()

/**
 * The lead has to match what is actually on the page.
 *
 * It was hardcoded to "Each write-up below covers the operational problem…",
 * which reads as a promise. With `projects` empty that promise sat directly
 * above "Case studies in preparation" — the page told the reader to look at
 * something that was not there. A visitor notices that immediately, and on a
 * page whose whole job is credibility it costs more than an empty state does.
 */
const clients = publishedClients()
const quotes = publishedTestimonials()

const heroLead = computed(() =>
  all.length
    ? 'Each write-up below covers the operational problem, what we deployed against it, and the result, approved by the client before publication.'
    : 'We publish a case study only once the client has approved the write-up, so this page grows slowly. If you are evaluating us now, we will arrange a reference call with a comparable client instead.',
)

const filter = ref<(typeof sectors)[number]>('All')
const visible = computed(() =>
  filter.value === 'All' ? all : all.filter((p) => p.sector === filter.value),
)
</script>

<template>
  <div>
    <UiPageHero
      eyebrow="Projects &amp; clients"
      title="What we have built, and what changed because of it"
      :lead="heroLead"
    />

    <!-- Client logos -->
    <section v-if="clients.length" class="section section--sm">
      <div class="container">
        <p class="eyebrow">Organisations we work with</p>
        <ul v-reveal.stagger class="logos mt-6">
          <li v-for="client in clients" :key="client.name" class="logos__item">
            <img
              :src="client.logo"
              :alt="client.name"
              width="160"
              height="48"
              loading="lazy"
            >
          </li>
        </ul>
      </div>
    </section>

    <!-- Projects -->
    <section class="section">
      <div class="container">
        <template v-if="all.length">
          <div class="filters" role="group" aria-label="Filter projects by sector">
            <button
              v-for="sector in sectors"
              :key="sector"
              type="button"
              class="tab"
              :class="{ 'tab--active': filter === sector }"
              :aria-pressed="filter === sector"
              @click="filter = sector"
            >
              {{ sector }}
            </button>
          </div>

          <div v-reveal.stagger class="grid grid--2 mt-10">
            <article
              v-for="project in visible"
              :key="project.slug"
              class="card card--flush card--interactive"
            >
              <div v-if="project.image" class="card__media">
                <NuxtImg
                  :src="project.image"
                  :alt="project.imageAlt || ''"
                  width="1200"
                  height="800"
                  sizes="100vw md:50vw"
                  format="webp"
                  loading="lazy"
                />
              </div>
              <div class="card__body">
                <div class="cluster">
                  <span class="pill pill--accent">{{ project.sector }}</span>
                  <span class="pill">{{ project.year }}</span>
                </div>
                <h2 class="card__title mt-3">{{ project.title }}</h2>
                <p class="text-secondary">{{ project.client }}</p>
                <p class="text-secondary">{{ project.summary }}</p>
              </div>
            </article>
          </div>
        </template>

        <!-- Honest empty state. We do not ship invented case studies. -->
        <div v-else v-reveal class="empty card">
          <div class="icon-plate icon-plate--lg">
            <Icon name="lucide:folder-open" size="26" />
          </div>
          <h2 class="mt-4">Case studies in preparation</h2>
          <p class="lead mt-3">
            We are writing up completed deployments from the systems
            themselves. Every one is reviewed by the client and published only
            with their approval, so this page fills up slowly and honestly
            rather than quickly.
          </p>
          <p class="mt-4 text-secondary measure">
            If you are evaluating us now and want to speak to a comparable
            client, tell us the sector and scope and we will arrange a
            reference call.
          </p>
          <div class="cluster mt-8">
            <NuxtLink to="/contact" class="btn btn--primary">
              Request a reference call
            </NuxtLink>
            <NuxtLink to="/solutions" class="btn btn--secondary">
              See what we build
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section v-if="quotes.length" class="section section--subtle">
      <div class="container">
        <UiSectionHeader eyebrow="In their words" title="What clients say" />
        <div v-reveal.stagger class="grid grid--2">
          <figure v-for="quote in quotes" :key="quote.name" class="card quote">
            <Icon name="lucide:quote" size="28" class="quote__mark" />
            <blockquote class="quote__text">{{ quote.quote }}</blockquote>
            <figcaption class="quote__by">
              <strong>{{ quote.name }}</strong>
              <span>{{ quote.role }}, {{ quote.company }}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- What we build -->
    <section class="section">
      <div class="container">
        <UiSectionHeader
          eyebrow="Capabilities"
          title="The work these projects draw on"
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

    <SectionsCtaBand />
  </div>
</template>

<style scoped>
.logos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-10);
}

.logos__item img {
  height: 2.5rem;
  width: auto;
  object-fit: contain;
  /* Greyscale at rest keeps a row of mismatched brand colours from
     fighting the page; colour on hover rewards attention. */
  filter: grayscale(1);
  opacity: 0.65;
  transition: filter var(--dur-base) var(--ease-out),
    opacity var(--dur-base) var(--ease-out);
}

.logos__item:hover img {
  filter: none;
  opacity: 1;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.tab {
  min-height: 2.75rem;
  padding: var(--space-2) var(--space-5);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-pill);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  color: var(--text-secondary);
  transition: background-color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out);
}

.tab:hover {
  border-color: var(--c4-indigo-800);
  color: var(--text-primary);
}

.tab--active {
  background-color: var(--c4-indigo-800);
  border-color: var(--c4-indigo-800);
  color: var(--c4-white);
}

.empty {
  align-items: start;
  padding: var(--space-10);
  max-width: 46rem;
}

/* --- Testimonials -------------------------------------------------------- */

.quote__mark {
  color: var(--c4-signal-500);
}

.quote__text {
  margin-block-start: var(--space-4);
  font-size: var(--fs-body-lg);
  line-height: var(--lh-body);
  color: var(--text-primary);
}

.quote__by {
  display: grid;
  gap: 2px;
  margin-block-start: var(--space-5);
  padding-block-start: var(--space-4);
  border-block-start: 1px solid var(--border-default);
  font-size: var(--fs-sm);
  color: var(--text-secondary);
}

.quote__by strong {
  color: var(--text-primary);
}
</style>
