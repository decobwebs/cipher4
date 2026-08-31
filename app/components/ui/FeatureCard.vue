<script setup lang="ts">
/**
 * The one card used for capabilities, sectors, differentiators and services.
 * Replaces six visually different card treatments from the old build.
 */
withDefaults(
  defineProps<{
    icon?: string
    title: string
    to?: string
    /** Renders the icon plate in solid navy rather than the cyan wash. */
    solid?: boolean
  }>(),
  { solid: false },
)
</script>

<template>
  <component
    :is="to ? 'div' : 'div'"
    class="card"
    :class="{ 'card--interactive card--link': to }"
  >
    <div v-if="icon" class="icon-plate" :class="{ 'icon-plate--solid': solid }">
      <Icon :name="icon" size="22" />
    </div>

    <div class="card__body">
      <h3 class="card__title">
        <NuxtLink v-if="to" :to="to" class="card__stretch">{{ title }}</NuxtLink>
        <template v-else>{{ title }}</template>
      </h3>
      <slot />
    </div>

    <p v-if="to" class="card__cue" aria-hidden="true">
      <span>Learn more</span>
      <Icon name="lucide:arrow-right" size="16" />
    </p>
  </component>
</template>

<style scoped>
.card {
  gap: var(--space-4);
}

.card__title :deep(a) {
  color: inherit;
}

.card__cue {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-block-start: var(--space-5);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-accent);
}

.card__cue :deep(svg) {
  transition: transform var(--dur-base) var(--ease-out);
}

.card--interactive:hover .card__cue :deep(svg) {
  transform: translateX(4px);
}
</style>
