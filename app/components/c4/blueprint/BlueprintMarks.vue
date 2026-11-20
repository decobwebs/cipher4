<script setup lang="ts">
/**
 * Construction marks for a section (owner, 20 Nov 2026): thin crosshair
 * registration marks at the corners, a measuring edge of ticks, and a small
 * drawing-sheet label ("SHEET 03 / 12", "DWG C4-0xx") in Geist Mono at 50%.
 * Decorative only.
 */
defineProps<{ sheet?: string; dwg?: string }>()
</script>

<template>
  <div class="bpm" aria-hidden="true">
    <svg v-for="c in ['tl', 'tr', 'bl', 'br']" :key="c" class="bpm__cross" :class="`bpm__cross--${c}`" viewBox="0 0 24 24">
      <path d="M12 0 V24 M0 12 H24" fill="none" stroke="currentColor" stroke-width="1" />
      <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1" />
    </svg>
    <span class="bpm__ruler" />
    <span v-if="sheet || dwg" class="bpm__label">
      <span v-if="dwg">{{ dwg }}</span>
      <span v-if="sheet">{{ sheet }}</span>
    </span>
  </div>
</template>
