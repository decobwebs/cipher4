<script setup lang="ts">
/**
 * One component for the Cipher4 icon set (Icons board).
 *
 * The first time an icon is 25% visible its lines draw on (600 ms), then the
 * amber node lights up. It plays once. On hover of the icon, or of the link,
 * button or card around it, the node pulses once with a soft amber ring.
 *
 * With JavaScript off, or reduced motion on, the icon is simply drawn.
 * Icons are decorative: the visible text next to them carries the meaning.
 */
import { icons, type C4IconName } from '~/lib/icons'

const props = withDefaults(defineProps<{
  name: C4IconName
  size?: number
  /** Seconds to wait before drawing, for staggering a row of icons. */
  delay?: number
  /** `light`: white lines for the night band. */
  tone?: 'ink' | 'light'
  /** Skip the draw-on and show the finished icon. */
  still?: boolean
}>(), {
  size: 32,
  delay: 0,
  tone: 'ink',
  still: false,
})

const def = computed(() => icons[props.name])

// Circles and rectangles become paths: `pathLength` is unreliable on basic
// shapes in older Safari, which would leave the icon dashed.
const circlePath = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`
const rectPath = (x: number, y: number, w: number, h: number, rx: number) =>
  `M${x + rx} ${y} H${x + w - rx} A${rx} ${rx} 0 0 1 ${x + w} ${y + rx} V${y + h - rx} ` +
  `A${rx} ${rx} 0 0 1 ${x + w - rx} ${y + h} H${x + rx} A${rx} ${rx} 0 0 1 ${x} ${y + h - rx} ` +
  `V${y + rx} A${rx} ${rx} 0 0 1 ${x + rx} ${y} Z`

const paths = computed(() => def.value.lines.map((l) => {
  if ('circle' in l) return circlePath(...l.circle)
  if ('rect' in l) return rectPath(...l.rect)
  return l.d
}))

const el = ref<SVGSVGElement | null>(null)
const { revealed } = useReveal(el)
</script>

<template>
  <svg
    ref="el"
    class="c4-icon"
    :class="{ 'is-in': revealed || still, 'is-still': still, 'is-light': tone === 'light' }"
    :width="size"
    :height="size"
    viewBox="0 0 32 32"
    :style="{ '--d': `${delay}s` }"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(d, i) in paths" :key="i" class="d" :d="d" pathLength="1" />
    <circle class="ring" :cx="def.node[0]" :cy="def.node[1]" :r="def.node[2]" />
    <circle class="n" :cx="def.node[0]" :cy="def.node[1]" :r="def.node[2]" />
  </svg>
</template>

<style>
/* Unscoped on purpose: these rules depend on `.c4-js` on <html> and on the
   hover of a parent link or card, which scoped styles cannot express. Every
   selector is under .c4-icon, so nothing leaks. */
.c4-icon {
  flex: none;
  overflow: visible;
  fill: none;
  stroke: var(--ink);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.c4-icon.is-light {
  stroke: var(--white);
}

/* Dash 1, gap 2: at offset 1 the whole line sits in the gap. A gap of
   exactly 1 would leave a zero-length dash, which round ends paint as a dot. */
.c4-icon .d {
  stroke-dasharray: 1 2;
  stroke-dashoffset: 0;
  transition: stroke-dashoffset var(--dur-draw) var(--ease-line) var(--d, 0s);
}

.c4-icon .n {
  fill: var(--amber);
  stroke: none;
  transform-box: fill-box;
  transform-origin: center;
}

.c4-icon .ring {
  fill: none;
  stroke: var(--amber);
  stroke-width: 1;
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}

/* Waiting to be revealed: only once we know JavaScript will reveal it. */
.c4-js .c4-icon:not(.is-in) .d {
  stroke-dashoffset: 1;
  transition: none;
}

.c4-js .c4-icon:not(.is-in) .n {
  transform: scale(0);
}

/* The node lights up as the lines finish. */
.c4-icon.is-in:not(.is-still) .n {
  animation: c4-icon-node 520ms var(--ease-pop) calc(var(--d, 0s) + 450ms) both;
}

@keyframes c4-icon-node {
  0% { transform: scale(0); }
  55% { transform: scale(1.5); }
  100% { transform: scale(1); }
}

/* Hover: one soft amber pulse. The lines never change colour. */
.c4-icon:hover .ring,
:is(a, button, .c4-card):hover .c4-icon .ring {
  animation: c4-icon-ring 900ms var(--ease-out) 1;
}

@keyframes c4-icon-ring {
  0% { opacity: 0.7; transform: scale(1); }
  100% { opacity: 0; transform: scale(3.2); }
}

@media (prefers-reduced-motion: reduce) {
  .c4-js .c4-icon .d,
  .c4-icon .d {
    stroke-dashoffset: 0;
    transition: none;
  }

  .c4-js .c4-icon .n,
  .c4-icon .n {
    transform: none;
    animation: none;
  }

  .c4-icon .ring {
    animation: none !important;
  }
}
</style>
