<script setup lang="ts">
/**
 * Refracting glass surface.
 *
 * Ported from the React Bits GlassSurface component. The technique is the
 * interesting part and it is unchanged: an SVG filter whose displacement map
 * is a generated gradient is fed into `backdrop-filter`, so whatever sits
 * behind the element is genuinely bent at the edges rather than merely
 * blurred. Splitting the displacement into three channels at slightly
 * different scales produces the chromatic fringing real glass has.
 *
 * WHAT CHANGED FROM THE REFERENCE, AND WHY
 * ----------------------------------------
 * 1. IT IS AN UPGRADE LAYER, NOT A REPLACEMENT.
 *    The reference ships its own fallback that looks nothing like the rest of
 *    this site. Here the element always carries the project's own `.glass`
 *    classes, and the SVG filter is layered on top only where it is
 *    supported. Safari and Firefox — which the reference's own capability
 *    check excludes — keep the tokenised glass rather than getting a
 *    different material. One system, two levels of finish.
 *
 * 2. IT SIZES ITSELF.
 *    The reference requires explicit width/height props, which makes it
 *    unusable for a card in a grid. This fills its container and measures
 *    with a ResizeObserver.
 *
 * 3. `light-dark()` IS GONE.
 *    The reference uses it for theming. This site has an explicit two-context
 *    token system, so the values come from tokens.css and stay consistent
 *    with every other surface.
 *
 * COST — read before using this everywhere
 * ----------------------------------------
 * Each instance owns an SVG filter, a ResizeObserver, and a re-encoded
 * data-URI SVG on every resize. `backdrop-filter` with a displacement map is
 * substantially more expensive than a plain blur. This belongs on a handful
 * of prominent surfaces — the header, hero panels, a CTA — not on every card
 * in a twelve-card grid. The plain `.glass` primitive exists for those.
 */

interface Props {
  /** Corner radius in px. Should match the surrounding radius token. */
  radius?: number
  /** Glass elevation, matching the `.glass` primitive's levels. */
  level?: 1 | 2 | 3
  /** Displacement strength. Negative bends inward, which reads as thickness. */
  distortion?: number
  /** Per-channel offsets — this is what produces the chromatic fringe. */
  redOffset?: number
  greenOffset?: number
  blueOffset?: number
  /** Width of the refracting border band, as a fraction of the short edge. */
  borderWidth?: number
  /** Brightness of the displacement map's inner plate. */
  brightness?: number
  /** Opacity of the displacement map's inner plate. */
  mapOpacity?: number
  /** Blur applied to the displacement map itself — softens the refraction. */
  mapBlur?: number
  /** Output blur. Above 0 this starts to smear content behind the glass. */
  displace?: number
  /** Extra saturation through the glass. */
  saturation?: number
}

const props = withDefaults(defineProps<Props>(), {
  radius: 20,
  level: 1,
  distortion: -140,
  redOffset: 0,
  greenOffset: 8,
  blueOffset: 16,
  borderWidth: 0.07,
  brightness: 52,
  mapOpacity: 0.92,
  mapBlur: 10,
  displace: 0.4,
  saturation: 1.4,
})

// Vue's useId is stable across SSR and client, so the filter reference in the
// markup matches the filter that hydrates. A random id would not.
const uid = useId().replace(/[^a-zA-Z0-9-]/g, '-')
const filterId = `gs-filter-${uid}`
const redGradId = `gs-red-${uid}`
const blueGradId = `gs-blue-${uid}`

const root = ref<HTMLElement | null>(null)
const supported = ref(false)
const mapHref = ref('')

/**
 * Builds the displacement map: a red horizontal ramp and a blue vertical ramp
 * blended together, with a bright plate inset from the edges. Where the map is
 * flat the backdrop passes through untouched; the ramps at the edges are what
 * bend it, so refraction concentrates at the rim exactly as it does in a real
 * bevelled pane.
 */
function buildMap(width: number, height: number) {
  const edge = Math.min(width, height) * (props.borderWidth * 0.5)
  const svg = `
<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#0000"/>
      <stop offset="100%" stop-color="red"/>
    </linearGradient>
    <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0000"/>
      <stop offset="100%" stop-color="blue"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="black"/>
  <rect width="${width}" height="${height}" rx="${props.radius}" fill="url(#${redGradId})"/>
  <rect width="${width}" height="${height}" rx="${props.radius}" fill="url(#${blueGradId})" style="mix-blend-mode:difference"/>
  <rect x="${edge}" y="${edge}" width="${Math.max(0, width - edge * 2)}" height="${Math.max(0, height - edge * 2)}" rx="${props.radius}" fill="hsl(0 0% ${props.brightness}% / ${props.mapOpacity})" style="filter:blur(${props.mapBlur}px)"/>
</svg>`.trim()
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/**
 * The reference's capability check, kept as-is in substance because it is
 * correct: Safari and Firefox both parse `backdrop-filter: url(#id)` without
 * actually applying the filter, so feature detection alone reports a false
 * positive and the surface renders as an unstyled box.
 */
function svgFiltersWork() {
  if (typeof window === 'undefined') return false
  const ua = navigator.userAgent
  const isWebkit = /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua)
  const isFirefox = /Firefox/.test(ua)
  if (isWebkit || isFirefox) return false
  const probe = document.createElement('div')
  probe.style.backdropFilter = `url(#${filterId})`
  return probe.style.backdropFilter !== ''
}

let observer: ResizeObserver | null = null

onMounted(() => {
  // Reduced transparency means the user has asked not to look through
  // surfaces. Refraction is the most aggressive form of exactly that.
  if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) return

  supported.value = svgFiltersWork()
  if (!supported.value || !root.value) return

  const measure = () => {
    const el = root.value
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) return
    mapHref.value = buildMap(Math.round(r.width), Math.round(r.height))
  }

  observer = new ResizeObserver(measure)
  observer.observe(root.value)
  measure()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

const scales = computed(() => ({
  r: props.distortion + props.redOffset,
  g: props.distortion + props.greenOffset,
  b: props.distortion + props.blueOffset,
}))
</script>

<template>
  <div
    ref="root"
    class="glass gsurface"
    :class="[
      level === 2 ? 'glass--2' : level === 3 ? 'glass--3' : '',
      { 'gsurface--refracting': supported && mapHref },
    ]"
    :style="{
      borderRadius: `${radius}px`,
      '--gs-filter': `url(#${filterId})`,
      '--gs-saturation': String(saturation),
    }"
  >
    <svg v-if="supported" class="gsurface__defs" aria-hidden="true" focusable="false">
      <defs>
        <filter :id="filterId" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">
          <feImage :href="mapHref" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />

          <!-- Three displacements at slightly different scales, recombined.
               The scale difference between channels is the chromatic fringe. -->
          <feDisplacementMap in="SourceGraphic" in2="map" :scale="scales.r" xChannelSelector="R" yChannelSelector="G" result="dispR" />
          <feColorMatrix in="dispR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />

          <feDisplacementMap in="SourceGraphic" in2="map" :scale="scales.g" xChannelSelector="R" yChannelSelector="G" result="dispG" />
          <feColorMatrix in="dispG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />

          <feDisplacementMap in="SourceGraphic" in2="map" :scale="scales.b" xChannelSelector="R" yChannelSelector="G" result="dispB" />
          <feColorMatrix in="dispB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />

          <feBlend in="red" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blue" mode="screen" result="rgb" />
          <feGaussianBlur in="rgb" :stdDeviation="displace" />
        </filter>
      </defs>
    </svg>

    <div class="gsurface__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.gsurface {
  position: relative;
  isolation: isolate;
}

/* Zero-size, zero-opacity: the filter has to be in the document to be
   referenced, but it must never occupy layout or paint. */
.gsurface__defs {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

/* Only applied where the filter genuinely works. Everywhere else the element
   keeps the `.glass` treatment it already has, so the fallback is the site's
   own material rather than a different one. */
/* REFRACTION IS ADDITIVE, NOT A REPLACEMENT.
   This rule used to swap the blur out for the displacement map and then drop
   the tint to 55% on the theory that a flat fill would hide the refraction.
   The result was a pane with no frost and barely any tint: page content read
   straight through the header, and the displacement pulled a mirrored copy of
   whatever sat behind it into the top edge, so the only thing the effect
   contributed was a doubled ghost of the text underneath.

   Displacement first, then blur. Filters apply left to right, so the blur
   lands on the already-displaced backdrop and softens the seam the
   displacement creates at the element's edge. The tint override is gone;
   whichever `.glass` level the caller asked for supplies it. */
.gsurface--refracting {
  -webkit-backdrop-filter: var(--gs-filter) blur(var(--gs-blur, 14px))
    saturate(var(--gs-saturation));
  backdrop-filter: var(--gs-filter) blur(var(--gs-blur, 14px))
    saturate(var(--gs-saturation));
}

.gsurface--refracting.glass--2 {
  background-color: color-mix(in srgb, var(--glass-2-tint) 55%, transparent);
}

.gsurface--refracting.glass--3 {
  background-color: color-mix(in srgb, var(--glass-3-tint) 60%, transparent);
}

.gsurface__content {
  position: relative;
  z-index: 3;
  border-radius: inherit;
}
</style>
