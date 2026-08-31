<script setup lang="ts">
import { industries } from '~/data/industries'

useSeoMeta({
  title: 'Industries | Cipher4 AI & Robotics',
  description:
    'Cipher4 works in four sectors: transport, logistics, oil and gas, and supply chain. Sector-specific systems for operations in Nigeria and West Africa.',
})

/**
 * Tabbed sector switcher.
 *
 * Replaces the old carousel, which had no keyboard support, no aria-live,
 * and a six-second auto-rotation that a keyboard user could not pause.
 * This is a real tablist: arrow keys move between tabs, Home/End jump to
 * the ends, and nothing moves on its own.
 */
const active = ref(0)
const tabRefs = ref<HTMLButtonElement[]>([])

function onTabKeydown(e: KeyboardEvent, index: number) {
  const last = industries.length - 1
  let next: number | null = null

  if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1
  else if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1
  else if (e.key === 'Home') next = 0
  else if (e.key === 'End') next = last

  if (next !== null) {
    e.preventDefault()
    active.value = next
    tabRefs.value[next]?.focus()
  }
}
</script>

<template>
  <div>
    <UiPageHero
      eyebrow="Industries"
      title="Four sectors we know properly"
      lead="We do not serve every industry. These four share the same hard problems: high-value assets, difficult access, unforgiving compliance. Depth in them is worth more to you than breadth."
    />

    <!-- Sector switcher -->
    <section class="section">
      <div class="container">
        <div class="tabs">
          <div class="tabs__list" role="tablist" aria-label="Industry sectors">
            <button
              v-for="(industry, i) in industries"
              :key="industry.slug"
              :ref="(el) => { if (el) tabRefs[i] = el as HTMLButtonElement }"
              type="button"
              role="tab"
              :id="`tab-${industry.slug}`"
              :aria-selected="active === i"
              :aria-controls="`panel-${industry.slug}`"
              :tabindex="active === i ? 0 : -1"
              class="tab"
              :class="{ 'tab--active': active === i }"
              @click="active = i"
              @keydown="onTabKeydown($event, i)"
            >
              <Icon :name="industry.icon" size="18" />
              {{ industry.name }}
            </button>
          </div>

          <div
            v-for="(industry, i) in industries"
            v-show="active === i"
            :key="industry.slug"
            :id="`panel-${industry.slug}`"
            role="tabpanel"
            :aria-labelledby="`tab-${industry.slug}`"
            tabindex="0"
            class="panel"
          >
            <div class="split">
              <div>
                <h2>{{ industry.name }}</h2>
                <p class="lead mt-4">{{ industry.summary }}</p>

                <h3 class="mt-8">What we deploy here</h3>
                <UiCheckList class="mt-4" :items="industry.capabilities" />

                <div class="cluster mt-8">
                  <NuxtLink
                    :to="`/industries/${industry.slug}`"
                    class="btn btn--primary"
                  >
                    {{ industry.name }} in detail
                  </NuxtLink>
                </div>
              </div>

              <div class="panel__media">
                <NuxtImg
                  :src="industry.image"
                  :alt="industry.imageAlt"
                  width="1920"
                  height="1080"
                  sizes="100vw md:50vw"
                  format="webp"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- All sectors -->
    <section class="section section--subtle">
      <div class="container">
        <UiSectionHeader
          eyebrow="Sector pages"
          title="Go straight to yours"
          lead="Each page covers the operational problems specific to that sector, what we deploy against them, and the regulatory context we work inside."
        />

        <div v-reveal.stagger class="grid grid--2">
          <UiFeatureCard
            v-for="industry in industries"
            :key="industry.slug"
            :icon="industry.icon"
            :title="industry.name"
            :to="`/industries/${industry.slug}`"
          >
            <p class="text-secondary">{{ industry.summary }}</p>
          </UiFeatureCard>
        </div>
      </div>
    </section>

    <SectionsCtaBand />
  </div>
</template>

<style scoped>
.tabs__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding-block-end: var(--space-6);
  border-block-end: 1px solid var(--border-default);
  margin-block-end: var(--space-10);
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  /* 44px tap target */
  min-height: 2.75rem;
  padding: var(--space-2) var(--space-5);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-pill);
  background-color: var(--bg-page);
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

.panel {
  animation: panel-in var(--dur-base) var(--ease-out);
}

.panel:focus-visible {
  outline-offset: 8px;
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .panel {
    animation: none;
  }
}

.panel__media {
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
}

.panel__media :deep(img) {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}
</style>
