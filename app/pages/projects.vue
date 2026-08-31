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

/**
 * The first project is rendered as a full feature, the rest as cards.
 *
 * A single case study in a two-up card grid reads as a page with one item
 * missing, and the card only showed title, client and summary anyway — the
 * challenge, built and outcome fields were carried in the data and never
 * rendered anywhere. The feature block is where they finally appear.
 *
 * The sector filter only makes sense once there is more than one thing to
 * filter, so it is gated on the remainder rather than shown with a single
 * card behind it.
 */
const featured = computed(() => all[0])
const rest = computed(() => all.slice(1))

const filter = ref<(typeof sectors)[number]>('All')
const visible = computed(() =>
  filter.value === 'All'
    ? rest.value
    : rest.value.filter((p) => p.sector === filter.value),
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
        <!-- Featured project. The image leads at full container width and
             stands alone: it is the product, and a reader recognises a
             screenshot faster than they read a summary. Everything structured
             sits underneath it. -->
        <article v-if="featured" class="feature">
          <div v-reveal class="feature__media">
            <NuxtImg
              :src="featured.image"
              :alt="featured.imageAlt || ''"
              width="1800"
              height="1800"
              sizes="100vw lg:1100px"
              format="webp"
              preload
              class="feature__img"
            />
          </div>

          <div v-reveal class="feature__intro">
            <div class="cluster">
              <span class="pill pill--accent">{{ featured.sector }}</span>
              <span class="pill">{{ featured.year }}</span>
              <span class="pill">{{ featured.client }}</span>
            </div>
            <h2 class="feature__title mt-5">{{ featured.title }}</h2>
            <p class="lead mt-4 measure">{{ featured.summary }}</p>

            <!-- The live product is the strongest evidence on this page, so
                 it gets a real link rather than a mention in the copy. -->
            <a
              v-if="featured.url"
              :href="featured.url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn--accent mt-6"
            >
              <span>Visit {{ featured.client }}</span>
              <Icon name="lucide:arrow-up-right" size="18" />
            </a>
          </div>

          <div class="feature__detail">
            <section v-if="featured.challenge.length" v-reveal class="feature__col">
              <h3 class="feature__label">The problem</h3>
              <ul class="feature__list">
                <li v-for="line in featured.challenge" :key="line">{{ line }}</li>
              </ul>
            </section>

            <section v-if="featured.built.length" v-reveal class="feature__col">
              <h3 class="feature__label">What we built</h3>
              <ul class="feature__list feature__list--checked">
                <li v-for="line in featured.built" :key="line">
                  <Icon name="lucide:check" size="17" />
                  <span>{{ line }}</span>
                </li>
              </ul>
            </section>
          </div>

        </article>

        <template v-if="rest.length">
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
        <div v-else-if="!featured" v-reveal class="empty card">
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
/* --- Featured project ---------------------------------------------------- */

.feature {
  display: grid;
  gap: var(--space-10);
}

/* The image carries the section, so it gets the full container width and a
   frame rather than being cropped into a card. `contain` because the source
   is a square render on its own ground: cropping it to a banner would cut the
   laptop. */
.feature__media {
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-default);
  background: var(--surface-sunken);
  overflow: hidden;
}

.feature__img {
  width: 100%;
  height: auto;
  display: block;
}

.feature__title {
  font-size: var(--fs-h1);
  max-width: 22ch;
}

/* Two columns from 62rem. Below that they stack, which keeps the problem
   directly above the response rather than side by side in 30ch gutters. */
.feature__detail {
  display: grid;
  gap: var(--space-8);
}

@media (min-width: 62rem) {
  .feature__detail {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-12);
  }
}

.feature__label {
  font-size: var(--fs-eyebrow);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--text-accent);
  padding-block-end: var(--space-4);
  border-block-end: 1px solid var(--border-default);
}

.feature__list {
  display: grid;
  gap: var(--space-4);
  margin-block-start: var(--space-5);
  color: var(--text-secondary);
  line-height: var(--lh-body);
  max-width: var(--measure);
}

.feature__list--checked > li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-3);
  align-items: start;
}

.feature__list--checked :deep(svg) {
  margin-block-start: 0.28em;
  color: var(--c4-signal-600);
}

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
