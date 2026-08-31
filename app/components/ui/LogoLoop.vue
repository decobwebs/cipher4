<script setup lang="ts">
/**
 * LogoLoop — a continuous marquee of client logos.
 *
 * Ported from the React Bits component. The animation model is the
 * reference's: a track translated by an accumulating offset, wrapped modulo
 * one sequence width, with the velocity eased toward its target so hovering
 * decelerates rather than stopping dead.
 *
 * WHAT CHANGED FROM THE REFERENCE
 * -------------------------------
 * 1. IT PAUSES ON KEYBOARD FOCUS. The reference pauses on mouseenter only. A
 *    keyboard user tabbing into a moving strip of links gets a target that is
 *    sliding away from them. `ui-ux-pro-max`'s pattern for this sector is
 *    explicit that a logo carousel must stop on focus as well as hover.
 *
 * 2. REDUCED MOTION ACTUALLY STOPS IT. The reference pins the transform in
 *    CSS with `!important` but leaves the rAF loop running every frame,
 *    recomputing an offset nothing can see. Here the loop never starts.
 *
 * 3. IT STOPS WHEN OFF SCREEN. A marquee below the fold has no reason to run.
 *
 * 4. NO DUPLICATE LINKS IN THE TAB ORDER. Copies after the first are
 *    `aria-hidden` AND `tabindex="-1"`; the reference hides them from the
 *    accessibility tree but leaves their anchors focusable, so a keyboard
 *    user tabs through the same logos three times.
 */

export interface LogoItem {
  src: string
  alt: string
  href?: string
}

interface Props {
  logos: LogoItem[]
  /** Pixels per second. */
  speed?: number
  direction?: 'left' | 'right'
  logoHeight?: number
  gap?: number
  /** Speed while hovered or focused. 0 pauses. */
  hoverSpeed?: number
  /** Fade the strip out at both edges, into the page colour. */
  fadeOut?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  speed: 46,
  direction: 'left',
  logoHeight: 34,
  gap: 64,
  hoverSpeed: 0,
  fadeOut: true,
})

const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const seq = ref<HTMLElement | null>(null)

const copies = ref(2)
const seqWidth = ref(0)
const paused = ref(false)
const reduced = ref(false)

/**
 * The props set BASE values, not the values the CSS uses.
 *
 * An inline style beats any scoped rule that is not !important, so writing
 * --ll-gap directly here made the component impossible to make responsive
 * from CSS. On a 390px screen a 128px gap between 56px marks left one and a
 * half logos on screen with a hole either side. The stylesheet now derives
 * the used values from these, clamping them down on small viewports without
 * any viewport JavaScript — which also keeps it safe through SSR hydration.
 */
const cssVars = computed(() => ({
  '--ll-gap-base': `${props.gap}px`,
  '--ll-h-base': `${props.logoHeight}px`,
}))

let frame = 0
let last = 0
let offset = 0
let velocity = 0
let ro: ResizeObserver | null = null
let io: IntersectionObserver | null = null

const targetVelocity = () => props.speed * (props.direction === 'left' ? 1 : -1)

function measure() {
  const rootEl = root.value
  const seqEl = seq.value
  if (!rootEl || !seqEl) return
  const w = Math.ceil(seqEl.getBoundingClientRect().width)
  if (w <= 0) return
  seqWidth.value = w
  // Enough copies to cover the viewport plus headroom, so the wrap point is
  // never visible as a gap at the trailing edge.
  copies.value = Math.max(2, Math.ceil(rootEl.clientWidth / w) + 2)
}

function tick(ts: number) {
  if (!last) last = ts
  const dt = Math.min(0.05, Math.max(0, ts - last) / 1000)
  last = ts

  const target = paused.value ? props.hoverSpeed : targetVelocity()
  // Exponential easing toward the target: hovering decelerates the strip
  // instead of halting it, which is far less jarring mid-scan.
  velocity += (target - velocity) * (1 - Math.exp(-dt / 0.25))

  const w = seqWidth.value
  if (w > 0) {
    offset = (((offset + velocity * dt) % w) + w) % w
    if (track.value) track.value.style.transform = `translate3d(${-offset}px, 0, 0)`
  }

  frame = requestAnimationFrame(tick)
}

function start() {
  if (frame || reduced.value) return
  last = 0
  frame = requestAnimationFrame(tick)
}
function stop() {
  if (frame) cancelAnimationFrame(frame)
  frame = 0
}

onMounted(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced.value = mq.matches
  const onChange = (e: MediaQueryListEvent) => {
    reduced.value = e.matches
    if (e.matches) stop()
    else start()
  }
  mq.addEventListener('change', onChange)

  nextTick(measure)

  if (root.value) {
    ro = new ResizeObserver(measure)
    ro.observe(root.value)
    if (seq.value) ro.observe(seq.value)

    io = new IntersectionObserver(([e]) => (e?.isIntersecting ? start() : stop()), {
      rootMargin: '10% 0px',
    })
    io.observe(root.value)
  }

  // Logos are lazy images; the sequence has no final width until they land.
  const imgs = seq.value?.querySelectorAll('img') ?? []
  imgs.forEach((img) => {
    if (!img.complete) img.addEventListener('load', measure, { once: true })
  })

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
</script>

<template>
  <div
    ref="root"
    class="ll"
    :class="{ 'll--fade': fadeOut }"
    :style="cssVars"
    role="region"
    aria-label="Selected clients"
    @pointerenter="paused = true"
    @pointerleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <div ref="track" class="ll__track">
      <ul
        v-for="copy in copies"
        :key="`copy-${copy}`"
        :ref="copy === 1 ? (el) => { seq = (el as HTMLElement) } : undefined"
        class="ll__list"
        :aria-hidden="copy > 1 ? 'true' : undefined"
      >
        <li v-for="(logo, i) in logos" :key="`${copy}-${i}`" class="ll__item">
          <component
            :is="logo.href && copy === 1 ? 'a' : 'span'"
            :href="logo.href && copy === 1 ? logo.href : undefined"
            :target="logo.href && copy === 1 ? '_blank' : undefined"
            :rel="logo.href && copy === 1 ? 'noreferrer noopener' : undefined"
            :tabindex="copy > 1 ? -1 : undefined"
            class="ll__link"
          >
            <img
              :src="logo.src"
              :alt="copy === 1 ? logo.alt : ''"
              loading="lazy"
              decoding="async"
              draggable="false"
            >
          </component>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.ll {
  position: relative;
  width: 100%;
  overflow: hidden;

  --ll-gap: var(--ll-gap-base, 64px);
  --ll-h: var(--ll-h-base, 34px);
}

/* Below 48rem the caller's desktop spacing is far too wide for the viewport.
   `min()` takes whichever is smaller, so a caller that already passes small
   values is left alone rather than being scaled up. */
@media (max-width: 48rem) {
  .ll {
    --ll-gap: min(var(--ll-gap-base, 64px), 3rem);
    --ll-h: min(var(--ll-h-base, 34px), 2.25rem);
  }
}

@media (max-width: 30rem) {
  .ll {
    --ll-gap: min(var(--ll-gap-base, 64px), 2.25rem);
    --ll-h: min(var(--ll-h-base, 34px), 1.875rem);
  }
}

.ll__track {
  display: flex;
  width: max-content;
  will-change: transform;
  user-select: none;
}

.ll__list {
  display: flex;
  align-items: center;
}

.ll__item {
  flex: 0 0 auto;
  margin-inline-end: var(--ll-gap);
}

.ll__link {
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-sm);
}

.ll__item img {
  height: var(--ll-h);
  width: auto;
  display: block;
  object-fit: contain;
  /* Desaturated at rest so a wall of competing brand colours does not fight
     the page. Opacity as well as greyscale, so light-on-dark marks do not
     disappear against white. */
  filter: grayscale(1) contrast(1.05);
  opacity: 0.66;
  transition:
    filter var(--dur-base) var(--ease-out),
    opacity var(--dur-base) var(--ease-out);
  -webkit-user-drag: none;
}

.ll__link:hover img,
.ll__link:focus-visible img {
  filter: grayscale(0);
  opacity: 1;
}

/* Edges dissolve into the page rather than ending at a hard crop.
   --ll-fade lets the placing section declare its own surface colour; without
   that the fade is hardcoded to one background and shows as a pale smear the
   moment the band is moved onto a different one. */
.ll--fade::before,
.ll--fade::after {
  content: '';
  position: absolute;
  inset-block: 0;
  width: clamp(2rem, 10%, 9rem);
  pointer-events: none;
  z-index: 2;
}

.ll--fade::before {
  inset-inline-start: 0;
  background: linear-gradient(to right, var(--ll-fade, var(--bg-page)), transparent);
}

.ll--fade::after {
  inset-inline-end: 0;
  background: linear-gradient(to left, var(--ll-fade, var(--bg-page)), transparent);
}

@media (prefers-reduced-motion: reduce) {
  .ll__item img { transition: none; }
}
</style>
