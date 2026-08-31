<script setup lang="ts">
/** Bulleted capability lists. Uses a real icon rather than a "•" character
    span, so it aligns properly at every text size. */
defineProps<{ items: readonly string[]; dense?: boolean }>()
</script>

<template>
  <ul class="checklist" :class="{ 'checklist--dense': dense }">
    <li v-for="item in items" :key="item" class="checklist__item">
      <Icon name="lucide:check" size="16" class="checklist__icon" />
      <span>{{ item }}</span>
    </li>
  </ul>
</template>

<style scoped>
.checklist {
  display: grid;
  gap: var(--space-3);
}

.checklist--dense {
  gap: var(--space-2);
}

.checklist__item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-3);
  align-items: start;
  font-size: var(--fs-sm);
  line-height: var(--lh-snug);
  color: var(--text-secondary);
}

.checklist__icon {
  margin-block-start: 0.15em;
  color: var(--text-accent);
  flex-shrink: 0;
}
</style>
