<script setup lang="ts">
/**
 * The single section-heading pattern. Every section on the site opens with
 * this, which is what gives the pages a consistent vertical rhythm — the old
 * build had six different heading treatments with ad-hoc margins.
 */
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    lead?: string
    align?: 'start' | 'center'
    /** Renders as h1 on hero-level sections, h2 everywhere else. */
    level?: 1 | 2
  }>(),
  { align: 'start', level: 2 },
)
</script>

<template>
  <div v-reveal class="section-header" :class="`section-header--${align}`">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>

    <component :is="level === 1 ? 'h1' : 'h2'" class="section-header__title">
      {{ title }}
    </component>

    <p v-if="lead" class="lead section-header__lead">{{ lead }}</p>

    <slot />
  </div>
</template>

<style scoped>
.section-header {
  display: grid;
  gap: var(--space-4);
  margin-block-end: var(--space-12);
}

.section-header--center {
  justify-items: center;
  text-align: center;
  max-width: 46rem;
  margin-inline: auto;
}

.section-header__title {
  max-width: 22ch;
}

.section-header--center .section-header__title {
  max-width: 24ch;
}

.section-header__lead {
  max-width: var(--measure);
}
</style>
