<script setup lang="ts">
/**
 * HyperspeedRoad: the light-trail road, wrapped for the site.
 *
 * Give it a named road from lib/hyperspeed/roads.ts; theme, seed, uniforms,
 * speed and mask can override that road's settings. The parent sizes it
 * (it fills its box).
 *
 * What it shows depends on the device (useRoadController):
 *   full / mobile tier, road allowed   the real road, faded in once drawn
 *   mobile tier, road not allowed      nothing
 *   still tier, or no WebGL            a still frame of the same road
 *
 * Nothing loads until the page has loaded and the browser is idle, and only
 * when the road is near the screen. Always decorative: aria-hidden.
 *
 * Exposes speedUp(ms) for a short burst and setSpeed(n) for a base speed.
 */
import { roads, stillSrc, type RoadName, type RoadMask } from '~/lib/hyperspeed/roads'
import type { RoadHandle, RoadOptions } from '~/lib/hyperspeed/index'
import type { RoadEntry } from '~/composables/useRoadController'

const props = defineProps<{
  preset: RoadName
  theme?: 'light' | 'dark'
  seed?: number
  /** Overrides the distortion's uniforms, e.g. { uAmp: [20, 6] }. */
  uniforms?: Record<string, number[]>
  /** Base speed; 1 = the live hero. */
  speed?: number
  mask?: RoadMask
}>()

const road = computed(() => roads[props.preset])
const maskClass = computed(() => `c4-road--${props.mask ?? road.value.mask}`)

const mode = ref<'idle' | 'canvas' | 'still' | 'off'>('idle')
const ready = ref(false)
const root = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const ctl = useRoadController()
let handle: RoadHandle | null = null
let entry: RoadEntry | null = null
let unmounted = false

const stillSet = computed(() =>
  `${stillSrc(props.preset, 'mobile')} 780w, ${stillSrc(props.preset, 'desktop')} 1440w`,
)

function options(): RoadOptions {
  const r = road.value
  const mobile = ctl.tier() === 'mobile'
  const o: RoadOptions = { ...r.options, ...(mobile ? (r as { mobileOptions?: RoadOptions }).mobileOptions : {}) }
  if (mobile) o.maxPixelRatio = Math.min(1.5, (o.maxPixelRatio as number | undefined) ?? 1.5)
  if (props.theme) o.theme = props.theme
  if (props.seed != null) o.seed = props.seed
  if (props.uniforms) o.distortionUniforms = { ...(o.distortionUniforms ?? {}), ...props.uniforms }
  return o
}

async function start() {
  const tier = ctl.tier()
  if (tier === 'still' || tier === 'none') { mode.value = 'still'; return }
  if (!ctl.mayAnimate(road.value.kind)) { mode.value = 'off'; return }

  const lib = await ctl.load()
  if (unmounted) return
  mode.value = 'canvas'
  await nextTick()
  if (!canvas.value || unmounted) return
  handle = lib.mount(canvas.value, options())
  if (!handle.supported) { handle = null; mode.value = 'still'; return }
  ctl.attach(entry!, handle)
  // Fade in once the first frame is on the canvas.
  requestAnimationFrame(() => requestAnimationFrame(() => { ready.value = true }))
}

onMounted(() => {
  if (!root.value) return
  entry = {
    el: root.value,
    kind: road.value.kind,
    onNear: () => { start() },
    handle: null,
    baseSpeed: props.speed ?? (road.value as { speed?: number }).speed ?? 1,
    ratio: 0,
    running: false,
  }
  ctl.register(entry)
})

onBeforeUnmount(() => {
  unmounted = true
  if (entry) ctl.unregister(entry)
  handle?.destroy()
  handle = null
})

watch(() => props.speed, (s) => {
  if (s == null || !entry) return
  entry.baseSpeed = s
  handle?.setSpeed(s)
})

defineExpose({
  /** A short burst of speed (default 400 ms), e.g. when a form is sent. */
  speedUp(ms = 400) {
    if (!handle) return
    handle.speedUp(true)
    setTimeout(() => handle?.speedUp(false), ms)
  },
  setSpeed(n: number) {
    if (entry) entry.baseSpeed = n
    handle?.setSpeed(n)
  },
})
</script>

<template>
  <div ref="root" class="c4-road" :class="[maskClass, { 'is-ready': ready }]" aria-hidden="true">
    <canvas v-if="mode === 'canvas'" ref="canvas" class="c4-road__canvas" />
    <img
      v-else-if="mode === 'still'"
      class="c4-road__still"
      :src="stillSrc(preset, 'desktop')"
      :srcset="stillSet"
      sizes="100vw"
      alt=""
      decoding="async"
      @load="ready = true"
    >
  </div>
</template>

<style scoped>
.c4-road {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.c4-road__canvas,
.c4-road__still {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  opacity: 0;
  /* The live hero's fade-in: 420 ms. */
  transition: opacity 420ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.c4-road.is-ready .c4-road__canvas,
.c4-road.is-ready .c4-road__still {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .c4-road__canvas,
  .c4-road__still {
    transition: none;
  }
}

/* --- Masks: the road never crosses words (Motion board, rule 1) --------- */

/* Hero and inner page headers. The board fades the road in at fixed
   percentages (hero 34% to 56%, headers 38% to 62%), but the swinging road
   can then reach the end of the headline on a laptop. Here the road stays
   fully clear up to where the text column ends, wherever that is on the
   screen, and fades in over the next 160 px.

   Text column end = content edge (centred 1320 px box) + side margin +
   column width (--road-text). These masks assume a full-width road. */
.c4-road--hero,
.c4-road--header {
  --road-text: 620px;
  --road-clear: calc(max(0px, 50% - 660px) + var(--gutter) + var(--road-text));
  opacity: 0.9;
  -webkit-mask-image:
    linear-gradient(90deg, transparent 0, transparent var(--road-clear), #000 calc(var(--road-clear) + 160px)),
    linear-gradient(180deg, #000 62%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-image:
    linear-gradient(90deg, transparent 0, transparent var(--road-clear), #000 calc(var(--road-clear) + 160px)),
    linear-gradient(180deg, #000 62%, transparent 100%);
  mask-composite: intersect;
}

/* Inner page headers: 0.85 opacity and a slightly earlier bottom fade
   (Page boards). Pages can set --road-text to their own column width. */
.c4-road--header {
  --road-text: 640px;
  opacity: 0.85;
  -webkit-mask-image:
    linear-gradient(90deg, transparent 0, transparent var(--road-clear), #000 calc(var(--road-clear) + 160px)),
    linear-gradient(180deg, #000 58%, transparent 100%);
  mask-image:
    linear-gradient(90deg, transparent 0, transparent var(--road-clear), #000 calc(var(--road-clear) + 160px)),
    linear-gradient(180deg, #000 58%, transparent 100%);
}

/* Phones: header roads sit below the headline in their own band. */
.c4-road--band {
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 70%, transparent 100%);
  mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 70%, transparent 100%);
}

@media (max-width: 900px) {
  .c4-road--hero,
  .c4-road--header {
    opacity: 1;
    -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 70%, transparent 100%);
    -webkit-mask-composite: source-over;
    mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 70%, transparent 100%);
    mask-composite: add;
  }
}

/* Strip between sections: faded at all four edges. */
.c4-road--strip {
  -webkit-mask-image:
    linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent),
    linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent);
  -webkit-mask-composite: source-in;
  mask-image:
    linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent),
    linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent);
  mask-composite: intersect;
}

/* How we deliver: faded top and bottom; the stage text sits below it. */
.c4-road--deliver {
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 30%, #000 75%, transparent 100%);
  mask-image: linear-gradient(180deg, transparent 0%, #000 30%, #000 75%, transparent 100%);
}

/* Closing band: only the lower part, under the call to action. The board
   fades in from 52% of the band's height, which reaches the buttons and the
   reply line when the band is tall. Here the road stays clear down to the
   band's bottom padding (the space reserved for it, set in ClosingBand as
   --close-pad), then fades in over 96 px. The road is bottom-aligned with
   the band on every screen size, so one rule fits all. */
.c4-road--closing {
  --road-top: calc(100% - var(--close-pad, 256px) + 24px);
  -webkit-mask-image: linear-gradient(180deg, transparent 0, transparent var(--road-top), #000 calc(var(--road-top) + 96px));
  mask-image: linear-gradient(180deg, transparent 0, transparent var(--road-top), #000 calc(var(--road-top) + 96px));
}
</style>
