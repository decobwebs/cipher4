<script setup lang="ts">
/**
 * BlueprintDrawing: one of the Cipher4 icons drawn large as an engineer's
 * drawing (owner, 20 Nov 2026). Construction first (guide circles, centre
 * lines, a 45-degree construction line), then the icon's own lines, then its
 * amber node, then the measurements and the title block.
 *
 *   icon    any icon from lib/icons.ts
 *   code    drawing number for the title block, e.g. "C4-012"
 *   title   the drawing's name in the title block (defaults to the icon's)
 *   now     draw on arrival (page headers) instead of when scrolled into view
 *
 * 1.5 px indigo lines and amber nodes, as the brand rules ask. Decorative:
 * the page's own words carry the meaning.
 */
import { icons, type C4IconName } from '~/lib/icons'

const props = withDefaults(defineProps<{
  icon: C4IconName
  code?: string
  title?: string
  now?: boolean
}>(), { code: 'C4-000', now: false })

const def = computed(() => icons[props.icon])

// The icon sits on a 32 grid; here it is drawn at 9x on a 480 sheet.
const K = 9
const O = 240 - 16 * K // offset that centres it
const STROKE = 1.5 / K

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

const name = computed(() => (props.title ?? def.value.label).toUpperCase())
const node = computed(() => def.value.node)
/** v-m:now draws on arrival; no argument waits until it is on screen. */
const arg = computed(() => (props.now ? 'now' : ''))
</script>

<template>
  <div v-m:[arg]="'blueprint'" class="bpd" aria-hidden="true">
    <svg class="bp-svg bpd__svg" viewBox="0 0 480 480" focusable="false">
      <slot />
      <g class="bpd__guides">
        <circle class="bp-guide bp-fade" style="--i: 0" cx="240" cy="240" r="200" stroke-dasharray="4 6" />
        <circle class="bp-draw" style="--i: 0" cx="240" cy="240" r="150" stroke-width="1" stroke-opacity="0.35" pathLength="1" />
        <path class="bp-guide bp-fade" style="--i: 1" d="M240 20 V460 M20 240 H460" stroke-dasharray="2 6" />
        <path class="bp-draw" style="--i: 1" d="M98 382 L382 98" stroke-width="1" stroke-opacity="0.3" pathLength="1" />
        <rect class="bp-draw" style="--i: 2" :x="O" :y="O" :width="32 * K" :height="32 * K" stroke-width="1" stroke-opacity="0.25" pathLength="1" />
      </g>
      <g :transform="`translate(${O} ${O}) scale(${K})`">
        <path v-for="(d, i) in paths" :key="i" class="bp-draw" :style="{ '--i': 3 + i }" :d="d" :stroke-width="STROKE" pathLength="1" />
        <circle class="bp-node" :style="{ '--i': 4 + paths.length }" :cx="node[0]" :cy="node[1]" :r="node[2]" />
      </g>
      <g class="bp-fade" :style="{ '--i': 5 + paths.length }">
        <!-- Measurements -->
        <path class="bp-guide" :d="`M${O} 452 H${O + 32 * K} M${O} 446 V458 M${O + 32 * K} 446 V458`" stroke-width="1" />
        <text class="bp-text" x="240" y="446" font-size="10" text-anchor="middle">320</text>
        <path class="bp-guide" :d="`M456 ${O} V${O + 32 * K} M450 ${O} H462 M450 ${O + 32 * K} H462`" stroke-width="1" />
        <text class="bp-text" x="470" y="244" font-size="10" text-anchor="middle" transform="rotate(90 470 240)">320</text>
        <text class="bp-text" x="392" y="96" font-size="10">R 150</text>
        <circle cx="240" cy="240" r="3" fill="var(--indigo)" />
      </g>
      <!-- Title block -->
      <g class="bp-fade" :style="{ '--i': 6 + paths.length }" opacity="0.6">
        <path class="bp-guide" d="M300 470 H476 V412 H300 Z M300 440 H476" stroke-width="1" />
        <text class="bp-text" x="310" y="431" font-size="9">{{ name.length > 22 ? name.slice(0, 22) + '…' : name }}</text>
        <text class="bp-text" x="310" y="459" font-size="9">DWG {{ code }}</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.bpd {
  width: 100%;
  aspect-ratio: 1;
}

.bpd__svg {
  width: 100%;
  height: 100%;
}
</style>
