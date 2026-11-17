<script setup lang="ts">
/** Mono upper-case label with the amber signal node (Main board, 05). */
withDefaults(defineProps<{
  tag?: string
  onDark?: boolean
}>(), { tag: 'p', onDark: false })
</script>

<template>
  <component :is="tag" class="c4-eyebrow" :class="{ 'c4-eyebrow--dark': onDark }">
    <span class="c4-eyebrow__node" aria-hidden="true" />
    <span><slot /></span>
  </component>
</template>

<style scoped>
.c4-eyebrow {
  display: flex;
  align-items: center;
  gap: var(--s-12);
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  line-height: 1.4;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--indigo);
}

.c4-eyebrow__node {
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--amber);
}

.c4-eyebrow--dark {
  color: var(--on-dark-2);
}
</style>
