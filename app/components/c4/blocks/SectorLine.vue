<script setup lang="ts">
/**
 * The line across the top of a sector's problem cards (plan, Phase 4):
 * a wave for maritime, a pipeline for oil and gas, a route for logistics,
 * a chain for supply chain. Amber, decorative. Drawn on in Phase 6.
 */
import type { SectorLine } from '~/data/sectors'

defineProps<{ kind: SectorLine }>()
</script>

<template>
  <svg class="sl" viewBox="0 0 300 34" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <!-- Wave (Page-Sector board, exactly) -->
    <path v-if="kind === 'wave'" d="M0 20 C25 8 50 8 75 20 S125 32 150 20 S200 8 225 20 S275 32 300 20" />
    <!-- Pipeline: a straight run with flanged joints -->
    <g v-else-if="kind === 'pipeline'">
      <path d="M0 17 H300" />
      <path d="M60 10 V24 M64 10 V24 M150 10 V24 M154 10 V24 M240 10 V24 M244 10 V24" class="sl__thin" />
    </g>
    <!-- Route: a dashed path between stops -->
    <g v-else-if="kind === 'route'">
      <path d="M0 24 H70 L100 10 H200 L230 24 H300" class="sl__dash" />
      <circle cx="100" cy="10" r="3.5" class="sl__stop" />
      <circle cx="200" cy="10" r="3.5" class="sl__stop" />
    </g>
    <!-- Chain: linked rounded links -->
    <g v-else>
      <rect v-for="k in 6" :key="k" :x="(k - 1) * 50 + 4" y="10" width="42" height="14" rx="7" />
      <path v-for="k in 5" :key="`j${k}`" :d="`M${k * 50 - 6} 17 H${k * 50 + 6}`" />
    </g>
  </svg>
</template>

<style scoped>
.sl {
  display: block;
  width: 100%;
  height: 34px;
  overflow: visible;
  fill: none;
  stroke: var(--amber);
  stroke-width: 2;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.sl path,
.sl rect,
.sl circle {
  vector-effect: non-scaling-stroke;
}

.sl__thin {
  stroke-width: 1.5;
}

.sl__dash {
  stroke-dasharray: 8 6;
}

.sl__stop {
  fill: var(--white);
  stroke-width: 2;
}
</style>
