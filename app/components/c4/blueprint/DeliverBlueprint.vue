<script setup lang="ts">
/**
 * DeliverBlueprint: the drawing for How we deliver (owner, 20 Nov 2026).
 * A system drawn on blueprint paper that builds itself, one step per stage:
 *
 *   1 Discovery    the survey grid draws; measurement points appear
 *   2 Design       construction lines draw the plan: modules as outlined
 *                  boxes, connections as dashed lines
 *   3 Pilot        one module (the core) fills solid indigo
 *   4 Deployment   every module fills; the connections turn solid
 *   5 Training     small people nodes appear around the system
 *   6 Support      a live amber pulse travels round the connections, looping
 *
 * `stage` (0 to 6) is how far it has built. Each step is a class, so moving
 * back removes it and the step reverses. Without motion (reduced motion,
 * no JavaScript) the parent passes 6 and it is simply finished; the pulse
 * then rests as a still amber node.
 */
const props = withDefaults(defineProps<{ stage: number; compact?: boolean }>(), { compact: false })

const classes = computed(() => Array.from({ length: 6 }, (_, k) => (props.stage > k ? `st-${k + 1}` : '')).filter(Boolean))

// The plan. A core module in the middle, four around it.
const modules = [
  { id: 'core', x: 250, y: 170, w: 100, h: 80, label: 'CORE' },
  { id: 'ops', x: 80, y: 70, w: 110, h: 70, label: 'OPERATIONS' },
  { id: 'field', x: 410, y: 70, w: 110, h: 70, label: 'FIELD' },
  { id: 'fin', x: 80, y: 280, w: 110, h: 70, label: 'FINANCE' },
  { id: 'rep', x: 410, y: 280, w: 110, h: 70, label: 'REPORTING' },
]
// Connections: a ring through the four outer modules, and spokes to the core.
const RING = 'M135 105 H465 V315 H135 Z'
const SPOKES = 'M300 170 V105 M300 250 V315 M250 210 H135 M350 210 H465'
const gridX = Array.from({ length: 13 }, (_, i) => 60 + i * 40)
const gridY = Array.from({ length: 9 }, (_, i) => 50 + i * 40)
const points = [[80, 70], [520, 70], [80, 350], [520, 350], [300, 210]] as const
const people = [[40, 210], [560, 210], [200, 400], [400, 400], [200, 22], [400, 22]] as const
const reduced = ref(false)
onMounted(() => { reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches })
</script>

<template>
  <svg class="bp-svg dbp" :class="[...classes, { 'dbp--compact': compact }]" viewBox="0 0 600 420" aria-hidden="true" focusable="false">
    <!-- 1 Discovery: survey grid and measurement points -->
    <g class="dbp__survey">
      <path v-for="(x, i) in gridX" :key="`x${i}`" class="dbp__gl" :style="{ '--i': i }" :d="`M${x} 30 V390`" pathLength="1" />
      <path v-for="(y, i) in gridY" :key="`y${i}`" class="dbp__gl" :style="{ '--i': i + 4 }" :d="`M40 ${y} H560`" pathLength="1" />
      <g v-for="([x, y], i) in points" :key="`p${i}`" class="dbp__pt" :style="{ '--i': i }">
        <path :d="`M${x - 7} ${y} H${x + 7} M${x} ${y - 7} V${y + 7}`" />
        <circle :cx="x" :cy="y" r="3" />
      </g>
      <text class="bp-text dbp__dim" x="300" y="14" font-size="10" text-anchor="middle">SURVEY · 520 × 360</text>
    </g>

    <!-- 2 Design: dashed connections, module outlines -->
    <g class="dbp__plan">
      <path class="dbp__dash" :d="RING" />
      <path class="dbp__dash" :d="SPOKES" />
    </g>
    <!-- 4 Deployment: the connections turn solid -->
    <g class="dbp__live">
      <path class="dbp__solid" :d="RING" pathLength="1" />
      <path class="dbp__solid" :d="SPOKES" pathLength="1" />
    </g>
    <g v-for="(m, i) in modules" :key="m.id" class="dbp__mod" :class="`dbp__mod--${m.id}`" :style="{ '--i': i }">
      <rect class="dbp__paper" :x="m.x" :y="m.y" :width="m.w" :height="m.h" rx="6" />
      <!-- 3 Pilot (core) and 4 Deployment (all): solid indigo -->
      <rect class="dbp__fill" :x="m.x" :y="m.y" :width="m.w" :height="m.h" rx="6" />
      <rect class="dbp__box" :x="m.x" :y="m.y" :width="m.w" :height="m.h" rx="6" pathLength="1" />
      <text class="bp-text dbp__label" :x="m.x + m.w / 2" :y="m.y + m.h + 16" font-size="10" text-anchor="middle">{{ m.label }}</text>
    </g>

    <!-- 5 Training: people around the system -->
    <g v-for="([x, y], i) in people" :key="`h${i}`" class="dbp__person" :style="{ '--i': i }">
      <circle :cx="x" :cy="y - 5" r="4.5" />
      <path :d="`M${x - 8} ${y + 9} C${x - 8} ${y + 1} ${x + 8} ${y + 1} ${x + 8} ${y + 9}`" />
    </g>

    <!-- 6 Support: a live pulse round the connections -->
    <g class="dbp__support">
      <circle v-if="stage >= 6 && !reduced" class="dbp__pulse" r="6">
        <animateMotion dur="4s" repeatCount="indefinite" :path="RING" />
      </circle>
      <!-- Without motion: the pulse rests on a connection, between two modules. -->
      <circle v-else class="dbp__pulse" cx="300" cy="105" r="6" />
    </g>
  </svg>
</template>

<style scoped>
.dbp {
  width: 100%;
  height: auto;
}

/* Survey grid lines and points */
.dbp__gl {
  fill: none;
  stroke: var(--indigo);
  stroke-opacity: 0.22;
  stroke-width: 1;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 700ms var(--ease-line);
  transition-delay: calc(var(--i, 0) * 30ms);
}

.dbp__pt {
  fill: none;
  stroke: var(--indigo);
  stroke-width: 1.5;
  opacity: 0;
  transform: scale(0.4);
  transform-box: fill-box;
  transform-origin: center;
  transition: opacity 400ms var(--ease-out), transform 500ms var(--ease-pop);
  transition-delay: calc(400ms + var(--i, 0) * 90ms);
}

.dbp__pt circle {
  fill: var(--amber);
  stroke: none;
}

.dbp__dim {
  opacity: 0;
  transition: opacity 500ms var(--ease-out) 300ms;
}

.st-1 .dbp__gl { stroke-dashoffset: 0; }
.st-1 .dbp__pt { opacity: 1; transform: none; }
.st-1 .dbp__dim { opacity: 0.6; }

/* Plan: modules outlined, connections dashed */
.dbp__dash {
  fill: none;
  stroke: var(--indigo);
  stroke-width: 1.5;
  stroke-dasharray: 6 6;
  opacity: 0;
  transition: opacity 600ms var(--ease-out) 300ms;
}

.dbp__paper {
  fill: var(--white);
  opacity: 0;
  transition: opacity 400ms var(--ease-out);
}

.dbp__box {
  fill: none;
  stroke: var(--indigo);
  stroke-width: 1.5;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 700ms var(--ease-line);
  transition-delay: calc(var(--i, 0) * 110ms);
}

.dbp__label {
  opacity: 0;
  transition: opacity 500ms var(--ease-out);
  transition-delay: calc(300ms + var(--i, 0) * 110ms);
}

.st-2 .dbp__dash { opacity: 0.7; }
.st-2 .dbp__paper { opacity: 1; }
.st-2 .dbp__box { stroke-dashoffset: 0; }
.st-2 .dbp__label { opacity: 1; }

/* Pilot and deployment: modules fill solid indigo */
.dbp__fill {
  fill: var(--indigo);
  opacity: 0;
  transition: opacity 600ms var(--ease-out);
  transition-delay: calc(var(--i, 0) * 90ms);
}

.st-3 .dbp__mod--core .dbp__fill { opacity: 1; }
.st-4 .dbp__fill { opacity: 1; }

/* Deployment: connections turn solid */
.dbp__solid {
  fill: none;
  stroke: var(--indigo);
  stroke-width: 1.5;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 900ms var(--ease-line);
}

.st-4 .dbp__solid { stroke-dashoffset: 0; }
.st-4 .dbp__dash { opacity: 0; }

/* Training: people nodes */
.dbp__person {
  fill: none;
  stroke: var(--indigo);
  stroke-width: 1.5;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 400ms var(--ease-out), transform 500ms var(--ease-out);
  transition-delay: calc(var(--i, 0) * 80ms);
}

.dbp__person circle {
  fill: var(--amber);
  stroke: none;
}

.st-5 .dbp__person { opacity: 1; transform: none; }

/* Support: the live amber pulse */
.dbp__pulse {
  fill: var(--amber);
  opacity: 0;
  transition: opacity 400ms var(--ease-out);
}

.st-6 .dbp__pulse { opacity: 1; }

/* Phones: a smaller drawing, the same steps; thinner survey. */
.dbp--compact .dbp__gl { stroke-opacity: 0.16; }
.dbp--compact .dbp__label,
.dbp--compact .dbp__dim { display: none; }
</style>
