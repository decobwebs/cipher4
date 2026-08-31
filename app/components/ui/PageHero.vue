<script setup lang="ts">
/**
 * Interior page hero. Sits on the navy band so every non-home page opens
 * with the same weight, and the header's transition into it is consistent.
 */
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    lead?: string
    /** Optional breadcrumb trail: [{ label, to }] */
    breadcrumbs?: { label: string; to: string }[]
  }>(),
  {},
)
</script>

<template>
  <section class="page-hero on-dark">
    <div class="page-hero__bg" aria-hidden="true">
      <div class="page-hero__grid" />
      <div class="page-hero__aura" />
    </div>

    <div class="container">
      <nav v-if="breadcrumbs?.length" class="crumbs" aria-label="Breadcrumb">
        <ol class="crumbs__list">
          <li v-for="crumb in breadcrumbs" :key="crumb.to" class="crumbs__item">
            <NuxtLink :to="crumb.to" class="crumbs__link">{{ crumb.label }}</NuxtLink>
            <Icon name="lucide:chevron-right" size="14" class="crumbs__sep" />
          </li>
          <li class="crumbs__item crumbs__item--current" aria-current="page">
            {{ title }}
          </li>
        </ol>
      </nav>

      <div v-reveal class="page-hero__body">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h1 class="page-hero__title">{{ title }}</h1>
        <p v-if="lead" class="lead page-hero__lead">{{ lead }}</p>
        <div v-if="$slots.actions" class="cluster mt-6">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-hero {
  position: relative;
  /* Asymmetric on purpose: generous above so it clears the fixed header,
     tighter below so the hero does not leave a dead band before the
     first section. */
  padding-block: var(--space-16) clamp(3rem, 2rem + 4vw, 5rem);
  background: var(--grad-abyss);
  overflow: hidden;
  isolation: isolate;
}

/* A hairline of accent light where the hero meets the page below. */
.page-hero::after {
  content: '';
  position: absolute;
  inset-block-end: 0;
  inset-inline: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(245, 165, 36, 0.6) 25%,
    rgba(245, 165, 36, 0.6) 75%,
    transparent
  );
  pointer-events: none;
}

.page-hero__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.page-hero__grid {
  position: absolute;
  inset: 0;
  background-image: var(--pattern-grid-dark);
  background-size: var(--pattern-grid-size);
  mask-image: radial-gradient(90% 80% at 20% 0%, #000 5%, transparent 90%);
}

.page-hero__aura {
  position: absolute;
  inset-block-end: -55%;
  inset-inline-end: -12%;
  width: 46rem;
  height: 46rem;
  border-radius: 50%;
  filter: blur(60px);
  background: radial-gradient(circle, rgba(245, 165, 36, 0.24) 0%, transparent 65%);
}

.page-hero__body {
  position: relative;
  display: grid;
  gap: var(--space-4);
  max-width: 44rem;
}

.page-hero__title {
  font-size: var(--fs-h1);
}

.page-hero__lead {
  color: var(--text-on-dark-muted);
}

/* --- Breadcrumbs -------------------------------------------------------- */

.crumbs {
  margin-block-end: var(--space-8);
}

.crumbs__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-xs);
}

.crumbs__item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-secondary);
}

.crumbs__link:hover {
  color: var(--c4-signal-400);
}

.crumbs__sep {
  opacity: 0.5;
}

.crumbs__item--current {
  color: var(--text-on-dark);
}
</style>
