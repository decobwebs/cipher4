<script setup lang="ts">
/**
 * DriftWall — columns of tiles drifting past a tilted 3D plane.
 *
 * Ported from the React Bits component. The motion model is the reference's:
 * each column scrolls at its own speed, alternating direction, with the whole
 * plane tilted in perspective and following the pointer.
 *
 * WHAT CHANGED FROM THE REFERENCE
 * -------------------------------
 * 1. DECORATIVE TILES ARE NOT FOCUSABLE. The reference gives every tile
 *    `tabIndex={0}` and `role="button"` even when it has no link — with 15
 *    items over several copies that is dozens of fake buttons a keyboard user
 *    must tab through, each announcing itself as actionable and doing
 *    nothing. Here a tile is a link only when it has an href; otherwise it is
 *    an inert image. Duplicated copies are always inert and aria-hidden,
 *    because they are the same content repeated to fill the loop.
 *
 * 2. THE LOOP STOPS WHEN OFF SCREEN. The reference's rAF runs for the life of
 *    the page. An IntersectionObserver pauses it, and `visibilitychange`
 *    stops it in a background tab.
 *
 * 3. REDUCED MOTION IS A FIRST-CLASS STATE, not a speed of zero. The wall
 *    renders as a static, evenly-offset grid — still a composition, just not
 *    a moving one.
 *
 * 4. IMAGES ARE LAZY AND SIZED. The reference emits bare <img> tags; a wall
 *    of twenty full-size photographs is a large payload on a page that is
 *    otherwise carefully budgeted.
 */

export interface DriftItem {
  image: string
  title?: string
  href?: string
}

interface Props {
  items: DriftItem[]
  columns?: number
  tileWidth?: number
  tileHeight?: number
  gap?: number
  radius?: number
  /** Perspective pitch of the wall, in degrees. */
  tilt?: number
  /** Perspective yaw, in degrees. */
  turn?: number
  /** Perspective distance in px — smaller is more dramatic. */
  perspective?: number
  /** How far the wall sits back from the viewer, in px. */
  depth?: number
  /** Base drift speed in px per second. */
  speed?: number
  direction?: 'up' | 'down'
  /** How much column speeds differ from one another, 0–1. */
  variance?: number
  /** Pointer-follow strength. 0 disables it. */
  parallax?: number
  /** How far a hovered tile lifts toward the viewer, in px. */
  lift?: number
  /** Strength of the edge dissolve, 0–1. */
  fade?: number
  /** Resting opacity of unhovered tiles. */
  dim?: number
  /** Fewest columns the wall will narrow to before it stops dropping them. */
  minColumns?: number
  /** Floor for the responsive shrink, as a fraction of the authored size. */
  minScale?: number
}

const props = withDefaults(defineProps<Props>(), {
  columns: 5,
  tileWidth: 220,
  tileHeight: 145,
  gap: 18,
  radius: 14,
  tilt: 16,
  turn: -14,
  perspective: 1200,
  depth: 120,
  speed: 34,
  direction: 'up',
  variance: 0.45,
  parallax: 0.6,
  lift: 56,
  fade: 0.6,
  dim: 0.55,
  minColumns: 3,
  minScale: 0.42,
})

const root = ref<HTMLElement | null>(null)
const plane = ref<HTMLElement | null>(null)
const tracks = ref<HTMLElement[]>([])
const containerHeight = ref(560)
const containerWidth = ref(1200)
const reduced = ref(false)

/** Deterministic per-column speed spread — golden-ratio stepping, so the
 *  columns never fall into visible lockstep. */
function columnFactor(index: number) {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1
  return 1 + props.variance * pseudo
}

/* RESPONSIVE SIZING
 * ------------------
 * The reference wall is a fixed 220px-tile grid, which on a phone shows about
 * one and a half columns — the composition reads as a broken crop rather than
 * a field. The tile size cannot be handed to a media query, because it is set
 * as inline custom properties (inline styles win) and because the rAF loop
 * needs the same pixel values to compute its seamless copy height. So the wall
 * measures itself and derives one uniform scale instead.
 *
 * Perspective and depth are scaled by the same factor as the tiles, which makes
 * the shrink a true similarity transform: the wall looks identical at every
 * size, just smaller. Speed scales too, so small tiles do not appear to drift
 * proportionally faster than large ones.
 */

/** How wide the tilted, scaled plane draws relative to its flat width. */
const projection = computed(() => 1.18 * Math.cos((props.turn * Math.PI) / 180))

/** Columns are dropped before tiles are shrunk past legibility. */
const effColumns = computed(() => {
  const floor = Math.min(props.minColumns, props.columns)
  const ideal = Math.round(containerWidth.value / 260)
  return Math.max(floor, Math.min(props.columns, ideal))
})

const scale = computed(() => {
  const flat = effColumns.value * (props.tileWidth + props.gap) * projection.value
  if (!flat) return 1
  // 1.06 keeps the wall bleeding a little past the frame rather than sitting
  // neatly inside it — the edge mask exists to imply it continues.
  const fit = (containerWidth.value * 1.06) / flat
  // Never enlarge: the authored size is the ceiling.
  return Math.min(1, Math.max(props.minScale, fit))
})

const tileW = computed(() => props.tileWidth * scale.value)
const tileH = computed(() => props.tileHeight * scale.value)
const gapPx = computed(() => props.gap * scale.value)

const columnItems = computed(() => {
  const n = effColumns.value
  const cols: DriftItem[][] = Array.from({ length: n }, () => [])
  props.items.forEach((item, i) => cols[i % n]!.push(item))
  return cols.map((c) => (c.length ? c : props.items.slice(0, 1)))
})

const columnMeta = computed(() =>
  columnItems.value.map((col) => {
    const unit = tileH.value + gapPx.value
    const copyHeight = Math.max(unit, col.length * unit)
    const copies = Math.max(2, Math.ceil((containerHeight.value * 1.6) / copyHeight) + 1)
    return { copyHeight, copies }
  }),
)

const cssVars = computed(() => ({
  '--dw-tile-w': `${tileW.value}px`,
  '--dw-tile-h': `${tileH.value}px`,
  '--dw-gap': `${gapPx.value}px`,
  '--dw-radius': `${props.radius * scale.value}px`,
  '--dw-perspective': `${props.perspective * scale.value}px`,
  '--dw-lift': `${props.lift * scale.value}px`,
  '--dw-dim': String(props.dim),
  '--dw-edge': `${Math.max(0, (1 - props.fade) * 100)}%`,
}))

let frame = 0
let last = 0
const offsets: number[] = []
const velocities: number[] = []
let hoveredCol = -1
const pointer = { x: 0, y: 0 }
const damped = { x: 0, y: 0 }
let ro: ResizeObserver | null = null
let io: IntersectionObserver | null = null

function applyPlane(px: number, py: number) {
  const el = plane.value
  if (!el) return
  el.style.transform =
    `translate(-50%, -50%) scale(1.18) ` +
    `rotateX(${props.tilt + py}deg) rotateY(${props.turn + px}deg) ` +
    `translateZ(${-props.depth * scale.value}px)`
}

function tick(ts: number) {
  if (!last) last = ts
  const dt = Math.min(0.05, Math.max(0, ts - last) / 1000)
  last = ts

  const maxTilt = props.parallax * 8
  const targetX = pointer.x * maxTilt
  const targetY = -pointer.y * maxTilt
  const damp = 1 - Math.exp(-dt / 0.12)
  damped.x += (targetX - damped.x) * damp
  damped.y += (targetY - damped.y) * damp
  applyPlane(damped.x, damped.y)

  if (!reduced.value) {
    const dirSign = props.direction === 'up' ? 1 : -1
    for (let c = 0; c < tracks.value.length; c++) {
      const meta = columnMeta.value[c]
      if (!meta) continue
      const altSign = c % 2 === 0 ? 1 : -1
      const base = props.speed * scale.value * columnFactor(c) * dirSign * altSign
      const target = hoveredCol === c ? 0 : base
      const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28))
      velocities[c] = (velocities[c] ?? 0) + (target - (velocities[c] ?? 0)) * ease
      let next = (offsets[c] ?? 0) + velocities[c]! * dt
      next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight
      offsets[c] = next
      const el = tracks.value[c]
      if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`
    }
  }

  frame = requestAnimationFrame(tick)
}

function start() {
  if (frame) return
  last = 0
  frame = requestAnimationFrame(tick)
}
function stop() {
  if (frame) cancelAnimationFrame(frame)
  frame = 0
}

function onPointerMove(e: PointerEvent) {
  if (e.pointerType === 'touch' || props.parallax <= 0 || reduced.value) return
  const rect = root.value?.getBoundingClientRect()
  if (!rect) return
  pointer.x = (e.clientX - rect.left) / rect.width - 0.5
  pointer.y = (e.clientY - rect.top) / rect.height - 0.5
}

function onLeave() {
  pointer.x = 0
  pointer.y = 0
  hoveredCol = -1
}

onMounted(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced.value = mq.matches
  const onChange = (e: MediaQueryListEvent) => (reduced.value = e.matches)
  mq.addEventListener('change', onChange)

  // Stagger the columns so the wall does not start as a single aligned row.
  columnMeta.value.forEach((meta, c) => {
    offsets[c] = meta.copyHeight * ((c * 0.37) % 1)
    velocities[c] = 0
  })

  if (root.value) {
    // Measure once synchronously so the first painted frame is already at the
    // right size, rather than rendering desktop tiles and snapping on the
    // observer's first callback.
    containerWidth.value = root.value.clientWidth || containerWidth.value
    containerHeight.value = root.value.clientHeight || containerHeight.value

    ro = new ResizeObserver(([entry]) => {
      const box = entry?.contentRect
      if (!box) return
      containerHeight.value = box.height || 560
      containerWidth.value = box.width || containerWidth.value
    })
    ro.observe(root.value)

    io = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? start() : stop()), {
      rootMargin: '10% 0px',
    })
    io.observe(root.value)
  }

  const onVisibility = () => (document.hidden ? stop() : start())
  document.addEventListener('visibilitychange', onVisibility)

  onBeforeUnmount(() => {
    mq.removeEventListener('change', onChange)
    document.removeEventListener('visibilitychange', onVisibility)
    ro?.disconnect()
    io?.disconnect()
    stop()
  })
})

function setTrack(el: Element | ComponentPublicInstance | null, i: number) {
  if (el instanceof HTMLElement) tracks.value[i] = el
}

// Dropping a column unmounts its track; without this the ref array keeps the
// detached element and the loop keeps writing transforms to it.
watch(effColumns, (n) => {
  tracks.value.length = n
  offsets.length = n
  velocities.length = n
  if (hoveredCol >= n) hoveredCol = -1
})
</script>

<template>
  <div
    ref="root"
    class="drift"
    :class="{ 'drift--reduced': reduced }"
    :style="cssVars"
    @pointermove="onPointerMove"
    @pointerleave="onLeave"
  >
    <div ref="plane" class="drift__plane">
      <div
        v-for="(col, c) in columnItems"
        :key="`col-${c}`"
        class="drift__col"
        @pointerenter="hoveredCol = c"
      >
        <div :ref="(el) => setTrack(el, c)" class="drift__track">
          <template v-for="copy in (columnMeta[c]?.copies ?? 2)" :key="`copy-${copy}`">
            <component
              :is="item.href && copy === 1 ? 'a' : 'span'"
              v-for="(item, i) in col"
              :key="`${c}-${copy}-${i}`"
              class="drift__tile"
              :href="item.href && copy === 1 ? item.href : undefined"
              :aria-hidden="copy === 1 ? undefined : 'true'"
            >
              <span class="drift__inner">
                <NuxtImg
                  :src="item.image"
                  :alt="copy === 1 ? (item.title ?? '') : ''"
                  :width="tileWidth * 2"
                  :height="tileHeight * 2"
                  format="webp"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />
              </span>
            </component>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drift {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  perspective: var(--dw-perspective);
  perspective-origin: 50% 50%;
  /* Dissolves the wall at its edges so it has no hard rectangle boundary and
     reads as a field continuing past the frame. */
  -webkit-mask-image:
    radial-gradient(ellipse 78% 82% at 50% 46%, #000 var(--dw-edge), transparent 100%),
    linear-gradient(to top, #000 var(--dw-edge), transparent 100%);
  -webkit-mask-composite: source-in;
  mask-image:
    radial-gradient(ellipse 78% 82% at 50% 46%, #000 var(--dw-edge), transparent 100%),
    linear-gradient(to top, #000 var(--dw-edge), transparent 100%);
  mask-composite: intersect;
}

.drift__plane {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  display: flex;
  transform-style: preserve-3d;
  transform-origin: 50% 50%;
  will-change: transform;
}

.drift__col {
  position: relative;
  width: calc(var(--dw-tile-w) + var(--dw-gap));
  transform-style: preserve-3d;
}

.drift__track {
  display: flex;
  flex-direction: column;
  will-change: transform;
  transform-style: preserve-3d;
}

.drift__tile {
  position: relative;
  display: block;
  width: 100%;
  height: calc(var(--dw-tile-h) + var(--dw-gap));
  flex: 0 0 auto;
  transform-style: preserve-3d;
}

.drift__inner {
  position: absolute;
  inset: calc(var(--dw-gap) / 2);
  display: block;
  border-radius: var(--dw-radius);
  overflow: hidden;
  background: var(--bg-subtle);
  border: 1px solid var(--border-default);
  opacity: var(--dw-dim);
  transform: translateZ(0);
  transition:
    transform var(--dur-slow) var(--ease-out),
    opacity var(--dur-slow) var(--ease-out),
    box-shadow var(--dur-slow) var(--ease-out);
}

.drift__tile :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: saturate(0.9);
  transition: filter var(--dur-slow) var(--ease-out);
  user-select: none;
  -webkit-user-drag: none;
}

.drift__tile:hover .drift__inner,
.drift__tile:focus-visible .drift__inner {
  opacity: 1;
  transform: translateZ(var(--dw-lift));
  box-shadow: var(--shadow-3);
}

.drift__tile:hover :deep(img),
.drift__tile:focus-visible :deep(img) {
  filter: saturate(1.02);
}

/* Hover is what lifts a tile out of its resting dim, and touch devices never
   get it — without this the wall stays permanently at 55% on a phone, which is
   where it is already smallest and hardest to read. */
@media (hover: none) {
  .drift__inner { opacity: calc(var(--dw-dim) + 0.35); }
  .drift__tile :deep(img) { filter: saturate(1); }
}

@media (prefers-reduced-motion: reduce) {
  .drift__plane,
  .drift__track { will-change: auto; }
  .drift__inner,
  .drift__tile :deep(img) { transition: none; }
  .drift__tile:hover .drift__inner { transform: none; }
}
</style>
