<script setup lang="ts">
/**
 * RoadStrip (Motion board 03, between sections): a thin band of calm road
 * that joins one chapter to the next. It moves only while you scroll
 * through it (useRoadController, 'strip' roads). Two or three per page at
 * most. Desktop only: phones and tablets never load it (device tiers), and
 * with reduced motion it is not shown at all, so it leaves no gap.
 */
</script>

<template>
  <div class="c4-strip" aria-hidden="true">
    <HyperspeedRoad preset="strip" />
  </div>
</template>

<style scoped>
.c4-strip {
  height: 160px; /* board: 150 px; nearest scale value */
  margin-block: calc(-1 * var(--s-64));
  position: relative;
  z-index: 1;
  pointer-events: none;
}

@media (max-width: 1024px), (prefers-reduced-motion: reduce) {
  .c4-strip {
    display: none;
  }
}
</style>
