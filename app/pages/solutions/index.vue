<script setup lang="ts">
import { solutions } from '~/data/solutions'
import { engagementModels, supportTiers, processSteps } from '~/data/process'

useSeoMeta({
  title: 'Solutions | Cipher4 AI & Robotics',
  description:
    'Software platforms, field and offshore robotics, and enterprise technology supply for transport, logistics, oil and gas, and supply chain operations.',
})
</script>

<template>
  <div>
    <UiPageHero
      eyebrow="Solutions"
      title="What we build, and how we deliver it"
      lead="Three capability groups. Most engagements draw on one; many end up drawing on two. Everything below is work we do ourselves, with our own engineers."
    >
      <template #actions>
        <NuxtLink to="/contact" class="btn btn--accent">Book a consultation</NuxtLink>
        <a href="#process" class="btn btn--secondary">How an engagement runs</a>
      </template>
    </UiPageHero>

    <!-- Capability groups -->
    <section class="section">
      <div class="container">
        <div class="stack stack--gap-lg">
          <article
            v-for="(solution, i) in solutions"
            :key="solution.slug"
            v-reveal
            class="split"
            :class="i % 2 === 1 ? 'split--media-first' : ''"
          >
            <div class="solution-intro">
              <div class="icon-plate icon-plate--lg">
                <Icon :name="solution.icon" size="26" />
              </div>
              <h2 class="mt-6">{{ solution.title }}</h2>
              <p class="lead mt-4">{{ solution.summary }}</p>

              <div class="cluster mt-8">
                <NuxtLink :to="`/solutions/${solution.slug}`" class="btn btn--primary">
                  {{ solution.shortTitle }} in detail
                </NuxtLink>
              </div>
            </div>

            <!-- The column that used to hold a photograph.
                 It held a placeholder slab with a filename printed on it, and
                 the brief for the real photograph is still unfilled. Putting
                 the home page's illustration here instead would have made the
                 duplication worse rather than better: this page already
                 repeats the home page's three capabilities and their summary
                 copy verbatim, so it would have shown the same picture under
                 the same paragraph a second time.

                 What it carries now is the one thing this page has that the
                 home page does not — a level of detail. No new asset, and the
                 column finally earns its width. -->
            <div class="glass solution-contents">
              <h3 class="solution-contents__title">What this includes</h3>
              <ul class="solution-contents__list">
                <li v-for="group in solution.whatWeBuild" :key="group.title">
                  <p class="solution-contents__name">{{ group.title }}</p>
                  <p class="solution-contents__desc">{{ group.description }}</p>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Process -->
    <section id="process" class="section section--subtle">
      <div class="container">
        <UiSectionHeader
          eyebrow="How an engagement runs"
          title="Six steps, with what you get at the end of each"
          lead="We would rather set expectations precisely and be held to them than describe our process in adjectives."
        />

        <ol v-reveal.stagger class="timeline">
          <li v-for="step in processSteps" :key="step.number" class="timeline__item">
            <div class="timeline__marker">{{ step.number }}</div>
            <div class="timeline__body">
              <div class="cluster">
                <h3 class="timeline__title">{{ step.title }}</h3>
                <span class="pill">{{ step.duration }}</span>
              </div>
              <p class="timeline__desc">{{ step.description }}</p>
              <p class="timeline__deliverable">
                <strong>You receive:</strong> {{ step.deliverable }}
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- Engagement models -->
    <section class="section">
      <div class="container">
        <UiSectionHeader
          eyebrow="Engagement models"
          title="Four ways to work with us"
          lead="Most clients recognise themselves in one of these on first reading."
        />

        <div v-reveal.stagger class="grid grid--4">
          <div v-for="model in engagementModels" :key="model.title" class="card">
            <div class="icon-plate">
              <Icon :name="model.icon" size="20" />
            </div>
            <div class="card__body mt-4">
              <h3 class="card__title">{{ model.title }}</h3>
              <p class="text-secondary">{{ model.description }}</p>
            </div>
            <p class="model__best">
              <span class="model__best-label">Best for</span>
              {{ model.bestFor }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Support tiers -->
    <section class="section section--inverse on-dark">
      <div class="container">
        <UiSectionHeader
          eyebrow="Support"
          title="Response times, written down"
          lead="Support is a contract with numbers in it. These are the tiers, and these are the numbers we hold ourselves to."
        />

        <div v-reveal.stagger class="grid grid--3">
          <div v-for="tier in supportTiers" :key="tier.name" class="card tier">
            <h3 class="tier__name">{{ tier.name }}</h3>

            <dl class="tier__specs">
              <div class="tier__spec">
                <dt>Response</dt>
                <dd>{{ tier.response }}</dd>
              </div>
              <div class="tier__spec">
                <dt>Coverage</dt>
                <dd>{{ tier.coverage }}</dd>
              </div>
              <div class="tier__spec">
                <dt>On-site</dt>
                <dd>{{ tier.onSite }}</dd>
              </div>
            </dl>

            <UiCheckList class="mt-6" :items="tier.includes" dense />
          </div>
        </div>
      </div>
    </section>

    <SectionsCtaBand />
  </div>
</template>

<style scoped>
/* The intro column is short and the contents panel is tall, so the two are
   top-aligned rather than centred — centring left the icon plate floating in
   the middle of the row with nothing above it. */
.solution-intro {
  align-self: start;
}

.solution-contents {
  padding: var(--space-6);
  border-radius: var(--radius-lg);
}

.solution-contents__title {
  position: relative;
  z-index: 3;
  font-size: var(--fs-eyebrow);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--text-accent);
}

.solution-contents__list {
  position: relative;
  z-index: 3;
  display: grid;
  gap: var(--space-5);
  margin-block-start: var(--space-5);
}

/* A hairline between entries rather than around each one. Four bordered
   boxes inside a bordered panel is three levels of container for two levels
   of content. */
.solution-contents__list > li + li {
  padding-block-start: var(--space-5);
  border-block-start: 1px solid var(--border-default);
}

.solution-contents__name {
  font-family: var(--font-heading);
  font-size: var(--fs-h4);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--tracking-snug);
  color: var(--text-primary);
}

.solution-contents__desc {
  margin-block-start: var(--space-2);
  font-size: var(--fs-sm);
  line-height: var(--lh-compact);
  color: var(--text-secondary);
}

/* --- Timeline ------------------------------------------------------------ */

.timeline {
  display: grid;
  gap: var(--space-8);
  max-width: 52rem;
}

.timeline__item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-5);
  position: relative;
}

.timeline__marker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-pill);
  background-color: var(--c4-indigo-800);
  color: var(--c4-white);
  font-family: var(--font-heading);
  font-size: var(--fs-sm);
  font-weight: var(--fw-bold);
  flex-shrink: 0;
}

/* Connector line between markers */
.timeline__item:not(:last-child)::before {
  content: '';
  position: absolute;
  inset-block-start: 3rem;
  inset-inline-start: 1.5rem;
  width: 2px;
  height: calc(100% + var(--space-8) - 3rem);
  background-color: var(--border-default);
}

.timeline__title {
  font-size: var(--fs-h3);
}

.timeline__desc {
  margin-block-start: var(--space-3);
  color: var(--text-secondary);
  max-width: var(--measure);
}

.timeline__deliverable {
  margin-block-start: var(--space-3);
  font-size: var(--fs-sm);
  color: var(--text-secondary);
}

.timeline__deliverable strong {
  color: var(--text-accent);
  font-weight: var(--fw-semibold);
}

/* --- Engagement models --------------------------------------------------- */

.model__best {
  margin-block-start: var(--space-5);
  padding-block-start: var(--space-4);
  border-block-start: 1px solid var(--border-default);
  font-size: var(--fs-sm);
  color: var(--text-secondary);
}

.model__best-label {
  display: block;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--text-accent);
  margin-block-end: var(--space-1);
}

/* --- Support tiers ------------------------------------------------------- */

.tier__name {
  font-size: var(--fs-h3);
  padding-block-end: var(--space-4);
  border-block-end: 1px solid var(--border-default);
}

.tier__specs {
  display: grid;
  gap: var(--space-3);
  margin-block-start: var(--space-4);
}

.tier__spec {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  font-size: var(--fs-sm);
}

.tier__spec dt {
  color: var(--text-secondary);
}

.tier__spec dd {
  font-weight: var(--fw-semibold);
  text-align: right;
}
</style>
