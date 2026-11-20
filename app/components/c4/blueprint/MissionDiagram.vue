<script setup lang="ts">
/**
 * The mission as a blueprint diagram (owner, 20 Nov 2026): the three verbs
 * of the mission paragraph, Sense → Decide → Prove, as three nodes on grid
 * paper joined by lines, each with a small mono label. The phrases under
 * the labels are the paragraph's own words ("sense what is happening,
 * decide what comes next and prove what was done").
 *
 * The nodes light up in order as it enters. Decorative: the paragraph
 * beside it says the same in full.
 */
const steps = [
  { n: '01', verb: 'SENSE', phrase: 'what is happening', x: 90 },
  { n: '02', verb: 'DECIDE', phrase: 'what comes next', x: 320 },
  { n: '03', verb: 'PROVE', phrase: 'what was done', x: 550 },
]
</script>

<template>
  <div v-m="'blueprint'" class="md" aria-hidden="true">
    <svg class="bp-svg md__svg" viewBox="0 0 640 210" focusable="false">
      <!-- Its own patch of grid paper -->
      <defs>
        <pattern id="md-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0 H0 V24" fill="none" stroke="var(--indigo)" stroke-opacity="0.09" stroke-width="1" />
        </pattern>
        <radialGradient id="md-fade" cx="50%" cy="50%" r="60%">
          <stop offset="55%" stop-color="#fff" />
          <stop offset="100%" stop-color="#fff" stop-opacity="0" />
        </radialGradient>
        <mask id="md-mask"><rect width="640" height="210" fill="url(#md-fade)" /></mask>
      </defs>
      <rect class="bp-fade" style="--i: 0" width="640" height="210" fill="url(#md-grid)" mask="url(#md-mask)" />

      <!-- Joining lines, with an arrowhead each -->
      <g v-for="(s, k) in steps.slice(0, 2)" :key="`l${k}`">
        <path class="bp-draw" :style="{ '--i': 2 + k * 4 }" :d="`M${s.x + 26} 80 H${steps[k + 1]!.x - 26}`" stroke-width="1.5" pathLength="1" />
        <path class="bp-fade" :style="{ '--i': 3 + k * 4 }" :d="`M${steps[k + 1]!.x - 34} 74 L${steps[k + 1]!.x - 26} 80 L${steps[k + 1]!.x - 34} 86`" fill="none" stroke="var(--indigo)" stroke-width="1.5" />
      </g>

      <!-- The three nodes, lighting in order -->
      <g v-for="(s, k) in steps" :key="s.verb">
        <circle class="bp-draw" :style="{ '--i': k * 4 }" :cx="s.x" cy="80" r="20" stroke-width="1.5" pathLength="1" />
        <circle class="bp-guide bp-fade" :style="{ '--i': k * 4 }" :cx="s.x" cy="80" r="32" stroke-dasharray="3 5" />
        <circle class="bp-node" :style="{ '--i': 1 + k * 4 }" :cx="s.x" cy="80" r="7" />
        <text class="bp-text bp-fade" :style="{ '--i': 1 + k * 4 }" :x="s.x" y="142" font-size="13" text-anchor="middle">{{ s.n }} · {{ s.verb }}</text>
        <text class="bp-text bp-fade md__phrase" :style="{ '--i': 1 + k * 4 }" :x="s.x" y="164" font-size="11" text-anchor="middle">{{ s.phrase }}</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.md {
  width: 100%;
  max-width: 640px;
}

.md__svg {
  width: 100%;
  height: auto;
}

.md__phrase {
  fill: var(--slate);
  letter-spacing: 0.04em;
}

/* Phones: the drawing is about half size, so its words are set larger
   (in drawing units) to stay readable, about 10 to 11 px on screen. */
@media (max-width: 767px) {
  .md__svg :deep(text) {
    font-size: 22px;
    letter-spacing: 0.04em;
  }

  .md__phrase {
    font-size: 16px;
    letter-spacing: 0;
  }
}
</style>
