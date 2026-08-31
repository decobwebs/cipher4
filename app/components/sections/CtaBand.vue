<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    lead?: string
    primaryLabel?: string
    primaryTo?: string
    secondaryLabel?: string
    secondaryTo?: string
  }>(),
  {
    title: 'Tell us what you are trying to fix',
    lead: 'Most conversations start with an operational problem rather than a technology. Describe yours and we will tell you honestly whether we are the right people for it.',
    primaryLabel: 'Book a consultation',
    primaryTo: '/contact',
    secondaryLabel: 'See our credentials',
    secondaryTo: '/credentials',
  },
)
</script>

<template>
  <section class="cta on-dark">
    <div class="cta__bg" aria-hidden="true" />
    <div class="container">
      <div v-reveal class="cta__inner">
        <div class="cta__body">
          <h2 class="cta__title">{{ title }}</h2>
          <p class="cta__lead">{{ lead }}</p>
        </div>
        <div class="cta__actions">
          <NuxtLink :to="primaryTo" class="btn btn--accent btn--lg">
            {{ primaryLabel }}
          </NuxtLink>
          <NuxtLink :to="secondaryTo" class="btn btn--secondary btn--lg">
            {{ secondaryLabel }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  position: relative;
  padding-block: var(--section-y);
  background: var(--grad-abyss);
  overflow: hidden;
  isolation: isolate;
}

/* Node field plus a bright edge, so the closing band feels like an arrival
   rather than another navy rectangle. */
.cta__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: var(--pattern-nodes-dark);
  background-size: var(--pattern-nodes-size);
  mask-image: radial-gradient(65% 70% at 15% 50%, #000, transparent 78%);
  pointer-events: none;
}

.cta::before {
  content: '';
  position: absolute;
  inset-block-start: 0;
  inset-inline: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(245, 165, 36, 0.65) 30%,
    rgba(245, 165, 36, 0.65) 70%,
    transparent
  );
}

.cta__inner {
  display: grid;
  gap: var(--space-8);
  align-items: center;
}

@media (min-width: 62rem) {
  .cta__inner {
    /* `auto` rather than a 1fr share: a fixed fraction gave the actions a
       column too narrow for two large buttons, so they wrapped into a stack
       and the band read as unbalanced. Sizing to content keeps them on one
       row and hands the remaining width to the copy. */
    grid-template-columns: minmax(0, 1fr) auto;
    gap: var(--space-12);
  }
}

.cta__title {
  font-size: var(--fs-h2);
  max-width: 18ch;
}

.cta__lead {
  margin-block-start: var(--space-4);
  font-size: var(--fs-body-lg);
  line-height: var(--lh-body);
  color: var(--text-on-dark-muted);
  max-width: var(--measure);
}

.cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

@media (min-width: 62rem) {
  .cta__actions {
    justify-content: flex-end;
  }
}
</style>
