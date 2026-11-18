<script setup lang="ts">
/**
 * WorkCarousel (plan, section 5; Motion board 06; Choreography 06).
 *
 * A 3D card carousel on a light background. Every project is a card on
 * one stage: the current one in the middle, its neighbours turned away on
 * either side. Cards travel between those places in 3D, and a card leaving
 * the centre breaks into amber and indigo light (the road's colours), drawn
 * on a small canvas only while the light is alive. Small laptops and
 * phones: the current project only, sliding in and out.
 *
 * Drag (mouse), swipe (touch), the arrow buttons, or the left and right
 * arrow keys while the carousel has focus. It never traps the page scroll:
 * the stage lets vertical scrolling through (touch-action: pan-y), a drag
 * only counts when it is clearly sideways, and the wheel is never taken.
 * The caption is announced politely when the project changes.
 *
 * Reduced motion: cards change in place, with no light.
 */
import type { WorkFeature } from '~/data/home'

const props = defineProps<{ items: WorkFeature[]; label: string }>()

const i = ref(0)
const n = computed(() => props.items.length)
const current = computed(() => props.items[i.value]!)
const count = computed(() => `${String(i.value + 1).padStart(2, '0')} / ${String(n.value).padStart(2, '0')}`)

/** Where card k sits relative to the current one: 0 centre, -1 left, 1 right, 2 away. */
function pos(k: number) {
  let d = k - i.value
  const half = n.value / 2
  if (d > half) d -= n.value
  if (d < -half) d += n.value
  return Math.abs(d) > 1 ? (d < 0 ? -2 : 2) : d
}

const stage = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)

function go(step: number) {
  const leaving = stage.value?.querySelector<HTMLElement>('.wc__card[data-pos="0"]')
  if (leaving) burst(leaving, step)
  i.value = (i.value + step + n.value) % n.value
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
  if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
}

// --- Drag and swipe -----------------------------------------------------------
// Pointer events for mouse, pen and touch. A move only becomes a drag once it
// is clearly sideways; until then the browser keeps the vertical scroll.
const drag = ref(0)
let sx = 0
let sy = 0
let tracking = false
let dragging = false
let moved = false

function down(e: PointerEvent) {
  if (e.button !== 0) return
  tracking = true
  dragging = false
  moved = false
  sx = e.clientX
  sy = e.clientY
}
function move(e: PointerEvent) {
  if (!tracking) return
  const dx = e.clientX - sx
  const dy = e.clientY - sy
  if (!dragging) {
    if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { tracking = false; return } // a scroll
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      dragging = true
      ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
    }
  }
  if (dragging) {
    moved = true
    drag.value = Math.max(-160, Math.min(160, dx))
  }
}
function up() {
  if (dragging && Math.abs(drag.value) >= 48) go(drag.value < 0 ? 1 : -1)
  tracking = false
  dragging = false
  drag.value = 0
}
/** A side card is also a shortcut, unless the pointer was dragging. */
function pick(k: number) {
  if (moved) { moved = false; return }
  const p = pos(k)
  if (p === -1 || p === 1) go(p)
}

// --- Light dust ---------------------------------------------------------------
// The card leaving the centre breaks into points of amber and indigo light
// along its trailing edge, which drift the way it travels and fade out.
interface Mote { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number; c: string }
const COLOURS = ['#F5A524', '#F5A524', '#1A3AB5', '#8FA2E4', '#FBC96A']
let motes: Mote[] = []
let raf = 0
let ctx: CanvasRenderingContext2D | null = null
let dpr = 1
const quiet = () => !import.meta.client || window.matchMedia('(prefers-reduced-motion: reduce)').matches

function size() {
  const c = canvas.value
  const s = stage.value
  if (!c || !s) return
  dpr = Math.min(1.5, window.devicePixelRatio || 1)
  c.width = Math.round(s.clientWidth * dpr)
  c.height = Math.round(s.clientHeight * dpr)
  ctx = c.getContext('2d')
}

function burst(card: HTMLElement, step: number) {
  if (quiet() || !stage.value) return
  if (!ctx) size()
  if (!ctx) return
  const sb = stage.value.getBoundingClientRect()
  const r = card.getBoundingClientRect()
  // The card moves away from the step's direction: its trailing edge sheds light.
  const dir = step > 0 ? -1 : 1
  const edge = dir < 0 ? r.left - sb.left : r.right - sb.left
  const count = window.innerWidth < 768 ? 46 : 90
  for (let k = 0; k < count; k++) {
    const y = r.top - sb.top + Math.random() * r.height
    const x = edge + (Math.random() * 0.22) * r.width * -dir + (Math.random() - 0.5) * 8
    motes.push({
      x, y,
      vx: dir * (40 + Math.random() * 160),
      vy: (Math.random() - 0.5) * 50,
      r: 0.8 + Math.random() * 2.2,
      life: 0,
      max: 0.6 + Math.random() * 0.7,
      c: COLOURS[k % COLOURS.length]!,
    })
  }
  if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick) }
}

let last = 0
function tick(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now
  const c = ctx
  if (!c || !canvas.value) { raf = 0; return }
  c.clearRect(0, 0, canvas.value.width, canvas.value.height)
  motes = motes.filter((m) => (m.life += dt) < m.max)
  for (const m of motes) {
    m.x += m.vx * dt
    m.y += m.vy * dt
    m.vx *= 0.985
    const k = 1 - m.life / m.max
    c.globalAlpha = k * k
    c.fillStyle = m.c
    c.beginPath()
    c.arc(m.x * dpr, m.y * dpr, m.r * dpr * (0.6 + k * 0.4), 0, Math.PI * 2)
    c.fill()
  }
  c.globalAlpha = 1
  raf = motes.length ? requestAnimationFrame(tick) : 0
}

let ro: ResizeObserver | null = null
onMounted(() => {
  ro = new ResizeObserver(() => { ctx = null })
  if (stage.value) ro.observe(stage.value)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
})
</script>

<template>
  <div
    class="wc"
    role="region"
    aria-roledescription="carousel"
    :aria-label="label"
    @keydown="onKey"
  >
    <div
      ref="stage"
      class="wc__stage"
      :class="{ 'is-dragging': drag !== 0 }"
      :style="{ '--drag': `${drag}px` }"
      @pointerdown="down"
      @pointermove="move"
      @pointerup="up"
      @pointercancel="up"
      @lostpointercapture="up"
    >
      <!-- Holds the stage's height: the size of the centre card. -->
      <div class="wc__sizer" aria-hidden="true" />
      <div class="wc__dust wc__dust--prev" aria-hidden="true" />
      <div class="wc__dust wc__dust--next" aria-hidden="true" />

      <div
        v-for="(it, k) in items"
        :key="it.name"
        class="wc__card"
        :data-pos="pos(k)"
        :aria-hidden="pos(k) === 0 ? undefined : 'true'"
        @click="pick(k)"
      >
        <div class="wc__frame">
          <img
            :src="it.image.src"
            :alt="pos(k) === 0 ? it.image.alt : ''"
            :width="it.image.w"
            :height="it.image.h"
            :loading="k === 0 ? 'eager' : 'lazy'"
            decoding="async"
            draggable="false"
            class="wc__img"
          >
        </div>
      </div>

      <canvas ref="canvas" class="wc__light" aria-hidden="true" />
    </div>

    <div class="wc__foot">
      <div class="wc__caption" aria-live="polite" aria-atomic="true">
        <p class="wc__meta">
          <span class="c4-sr-only">Project </span>{{ count }} · {{ current.name }} · {{ current.field }}
        </p>
        <h3 class="wc__line">{{ current.line }}</h3>
        <C4Button :to="current.link.to" variant="text" class="wc__link">
          {{ current.link.label }}<span class="c4-sr-only">: {{ current.name }}</span>
        </C4Button>
      </div>
      <div class="wc__arrows">
        <button type="button" class="wc__btn" aria-label="Previous project" @click="go(-1)">
          <C4Glyph name="arrow" :size="18" class="wc__flip" />
        </button>
        <button type="button" class="wc__btn wc__btn--next" aria-label="Next project" @click="go(1)">
          <C4Glyph name="arrow" :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wc {
  display: flex;
  flex-direction: column;
  gap: var(--s-48);
}

.wc:focus-visible {
  outline-offset: 8px;
}

/* --- The stage ------------------------------------------------------------- */
.wc__stage {
  --card: min(760px, 58%);
  position: relative;
  perspective: 1600px;
  perspective-origin: 50% 45%;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
}

.wc__sizer {
  width: var(--card);
  margin-inline: auto;
  aspect-ratio: 16 / 10;
}

.wc__card {
  position: absolute;
  top: 0;
  left: 50%;
  width: var(--card);
  margin-left: calc(var(--card) / -2);
  transform-style: preserve-3d;
  transition:
    transform 900ms var(--ease-out),
    opacity 700ms var(--ease-out);
  will-change: transform;
}

.wc__stage.is-dragging .wc__card {
  transition-duration: 0ms;
}

/* The places on the stage. --drag follows a sideways drag. */
.wc__card[data-pos='0'] {
  z-index: 3;
  transform: translateX(calc(var(--drag, 0px) * 0.6)) rotateY(calc(var(--drag, 0px) * -0.04deg));
}

.wc__card[data-pos='-1'] {
  z-index: 2;
  transform: translateX(calc(-78% + var(--drag, 0px) * 0.3)) translateZ(-260px) rotateY(40deg);
  opacity: 0.9;
  cursor: pointer;
}

.wc__card[data-pos='1'] {
  z-index: 2;
  transform: translateX(calc(78% + var(--drag, 0px) * 0.3)) translateZ(-260px) rotateY(-40deg);
  opacity: 0.9;
  cursor: pointer;
}

.wc__card[data-pos='-2'] {
  z-index: 1;
  transform: translateX(-120%) translateZ(-520px) rotateY(55deg);
  opacity: 0;
  pointer-events: none;
}

.wc__card[data-pos='2'] {
  z-index: 1;
  transform: translateX(120%) translateZ(-520px) rotateY(-55deg);
  opacity: 0;
  pointer-events: none;
}

/* A fixed 16:10 frame, so pictures of different shapes never move the page. */
.wc__frame {
  position: relative;
  aspect-ratio: 16 / 10;
  border-radius: 16px;
  overflow: hidden;
  background: var(--white);
  border: 1px solid var(--line-2);
  box-shadow: 0 40px 90px rgba(16, 32, 104, 0.18);
}

.wc__card:not([data-pos='0']) .wc__frame {
  box-shadow: 0 20px 50px rgba(16, 32, 104, 0.1);
}

.wc__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

.wc__card:not([data-pos='0']) .wc__img {
  object-fit: cover;
  object-position: top;
}

/* The light: a canvas over the stage, empty unless a card is breaking up. */
.wc__light {
  position: absolute;
  inset: 0;
  z-index: 4;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* Light dust resting by the side cards (Home board). */
.wc__dust {
  position: absolute;
  z-index: 0;
  top: 18%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  pointer-events: none;
}

.wc__dust--prev {
  left: 4%;
  background: var(--amber);
  box-shadow: -18px 14px 0 var(--indigo), -34px -10px 0 var(--amber), -52px 26px 0 #8FA2E4, -22px 60px 0 var(--indigo), -70px 70px 0 var(--amber), -44px 110px 0 #8FA2E4, -90px 30px 0 var(--indigo), -12px 140px 0 var(--amber), -64px 160px 0 var(--indigo);
}

.wc__dust--next {
  right: 4%;
  background: var(--indigo);
  box-shadow: 18px 14px 0 var(--amber), 34px -10px 0 var(--indigo), 52px 26px 0 #8FA2E4, 22px 60px 0 var(--amber), 70px 70px 0 var(--indigo), 44px 110px 0 #8FA2E4, 90px 30px 0 var(--amber), 12px 140px 0 var(--indigo), 64px 160px 0 var(--amber);
}

/* --- Caption and arrows ------------------------------------------------------- */
.wc__foot {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: var(--s-32);
  width: 100%;
  max-width: 760px;
  margin-inline: auto;
}

.wc__caption {
  display: flex;
  flex-direction: column;
  gap: var(--s-12);
  max-width: 520px;
}

.wc__meta {
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.6;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slate);
}

.wc__line {
  font-size: 28px;
  line-height: 1.15;
  font-weight: 500;
  letter-spacing: -0.025em;
}

.wc__link {
  align-self: flex-start;
}

.wc__arrows {
  display: flex;
  gap: var(--s-8);
}

.wc__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--white);
  border: 1px solid var(--line-2);
  color: var(--ink);
  transition: border-color var(--dur-ui) var(--ease-out), transform var(--dur-ui) var(--ease-out);
}

.wc__btn:hover {
  border-color: var(--slate);
}

.wc__btn--next {
  border: 0;
  background: var(--amber-grad);
  color: var(--on-amber);
}

.wc__btn--next:hover {
  transform: translateY(-1px);
}

.wc__flip {
  transform: scaleX(-1);
}

/* --- Small laptops and below: the current project only, sliding through ------- */
@media (max-width: 1024px) {
  .wc__stage {
    --card: 100%;
    perspective: none;
  }

  .wc__card[data-pos='-1'],
  .wc__card[data-pos='-2'] {
    transform: translateX(-108%);
    opacity: 0;
    pointer-events: none;
  }

  .wc__card[data-pos='1'],
  .wc__card[data-pos='2'] {
    transform: translateX(108%);
    opacity: 0;
    pointer-events: none;
  }

  .wc__dust {
    display: none;
  }
}

@media (max-width: 767px) {
  .wc {
    gap: var(--s-24);
  }

  .wc__frame {
    box-shadow: 0 24px 50px rgba(16, 32, 104, 0.16);
  }

  .wc__foot {
    flex-direction: column;
    align-items: stretch;
    gap: var(--s-12);
  }

  .wc__meta {
    font-size: 10px;
  }

  .wc__line {
    font-size: 23px;
    line-height: 1.2;
  }

  .wc__arrows {
    align-self: flex-end;
  }

  .wc__btn {
    width: 48px;
    height: 48px;
  }
}
</style>

<style>
/* Choreography 06, zoom-through from depth: the featured project flies
   forward out of the distance; its neighbours swing in at an angle.
   Unscoped: it depends on .c4-motion on <html> and v-m on the section. */
.c4-motion [data-m='zoom']:not(.m-in) .wc__card[data-pos='0'] {
  opacity: 0;
  transform: translateZ(-900px) scale(0.6);
}

.c4-motion [data-m='zoom']:not(.m-in) .wc__card[data-pos='-1'] {
  opacity: 0;
  transform: translateX(-140%) translateZ(-260px) rotateY(70deg);
}

.c4-motion [data-m='zoom']:not(.m-in) .wc__card[data-pos='1'] {
  opacity: 0;
  transform: translateX(140%) translateZ(-260px) rotateY(-70deg);
}

.c4-motion [data-m='zoom'] .wc__card[data-pos='-1'],
.c4-motion [data-m='zoom'] .wc__card[data-pos='1'] {
  transition-delay: 0ms;
}

.c4-motion [data-m='zoom']:not(.m-in) .wc__dust {
  opacity: 0;
}

.c4-motion [data-m='zoom'] .wc__dust {
  transition: opacity 900ms var(--ease-out) 500ms;
}

@media (max-width: 1024px) {
  .c4-motion [data-m='zoom']:not(.m-in) .wc__card[data-pos='0'] {
    transform: scale(0.7);
  }
}
</style>
