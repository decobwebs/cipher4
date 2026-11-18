<script setup lang="ts">
/**
 * WorkCarousel (plan, section 5; Home-Desktop and Home-Mobile boards).
 *
 * Desktop: the current project in the middle, the previous and next ones
 * turned away on either side in 3D, with a scatter of amber and indigo
 * light dust. Phones: the current project only.
 *
 * Works with the arrow buttons, with a swipe on the picture, and with the
 * left and right arrow keys while the carousel has focus. It never traps
 * the page scroll: a swipe only counts when it is clearly sideways, and the
 * picture area lets vertical scrolling through (touch-action: pan-y).
 * The caption is announced politely when the project changes.
 */
import type { WorkFeature } from '~/data/home'

const props = defineProps<{ items: WorkFeature[]; label: string }>()

const i = ref(0)
const n = computed(() => props.items.length)
const at = (k: number) => props.items[(k + n.value) % n.value]!
const current = computed(() => at(i.value))
const prev = computed(() => at(i.value - 1))
const next = computed(() => at(i.value + 1))
const count = computed(() => `${String(i.value + 1).padStart(2, '0')} / ${String(n.value).padStart(2, '0')}`)

function go(step: number) {
  i.value = (i.value + step + n.value) % n.value
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
  if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
}

// Swipe: only a clearly sideways move of 48 px or more. The last finger
// position is tracked while it moves, because the browser may end the touch
// with a cancel rather than a normal lift.
let sx = 0
let sy = 0
let lx = 0
let ly = 0
let tracking = false
function down(e: PointerEvent) {
  if (e.pointerType === 'mouse') return
  tracking = true
  sx = lx = e.clientX
  sy = ly = e.clientY
}
function move(e: PointerEvent) {
  if (!tracking) return
  lx = e.clientX
  ly = e.clientY
}
function up() {
  if (!tracking) return
  tracking = false
  const dx = lx - sx
  const dy = ly - sy
  if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1)
}
</script>

<template>
  <div
    class="wc"
    role="region"
    aria-roledescription="carousel"
    :aria-label="label"
    @keydown="onKey"
  >
    <div class="wc__stage" @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="up">
      <!-- Side cards: decorative previews, also a pointer shortcut. -->
      <div class="wc__side wc__side--prev" aria-hidden="true" @click="go(-1)">
        <div class="wc__side-frame">
          <img :src="prev.image.src" alt="" :width="prev.image.w" :height="prev.image.h" loading="lazy" decoding="async">
        </div>
        <span class="wc__dust wc__dust--prev" />
      </div>

      <div class="wc__main">
        <div class="wc__frame">
          <img
            v-for="(it, k) in items"
            :key="it.name"
            :src="it.image.src"
            :alt="k === i ? it.image.alt : ''"
            :aria-hidden="k === i ? undefined : 'true'"
            :width="it.image.w"
            :height="it.image.h"
            :loading="k === 0 ? 'eager' : 'lazy'"
            decoding="async"
            class="wc__img"
            :class="{ 'is-on': k === i }"
          >
        </div>
      </div>

      <div class="wc__side wc__side--next" aria-hidden="true" @click="go(1)">
        <div class="wc__side-frame">
          <img :src="next.image.src" alt="" :width="next.image.w" :height="next.image.h" loading="lazy" decoding="async">
        </div>
        <span class="wc__dust wc__dust--next" />
      </div>
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

.wc__stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--s-32);
  min-height: 500px;
  perspective: 1600px;
  touch-action: pan-y;
}

.wc__main {
  position: relative;
  z-index: 1;
  flex: 0 1 760px;
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

.wc__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  transform: scale(1.02);
  transition: opacity 500ms var(--ease-out), transform 700ms var(--ease-out);
}

.wc__img.is-on {
  opacity: 1;
  transform: none;
}

.wc__side {
  position: relative;
  flex: 0 0 26%;
  cursor: pointer;
  transition: opacity var(--dur-ui) var(--ease-out);
}

.wc__side:hover {
  opacity: 0.85;
}

.wc__side--prev {
  transform: rotateY(40deg) translateZ(-140px);
  transform-origin: right center;
}

.wc__side--next {
  transform: rotateY(-40deg) translateZ(-140px);
  transform-origin: left center;
}

.wc__side-frame {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--line-2);
}

.wc__side-frame img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top;
}

.wc__side--prev .wc__side-frame {
  -webkit-mask-image: radial-gradient(120% 120% at 100% 50%, #000 40%, transparent 80%);
  mask-image: radial-gradient(120% 120% at 100% 50%, #000 40%, transparent 80%);
}

.wc__side--next .wc__side-frame {
  -webkit-mask-image: radial-gradient(120% 120% at 0% 50%, #000 40%, transparent 80%);
  mask-image: radial-gradient(120% 120% at 0% 50%, #000 40%, transparent 80%);
}

/* Light dust (Home board): small amber and indigo points breaking off. */
.wc__dust {
  position: absolute;
  top: 22%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
}

.wc__dust--prev {
  left: 8%;
  background: var(--amber);
  box-shadow: -18px 14px 0 var(--indigo), -34px -10px 0 var(--amber), -52px 26px 0 #8FA2E4, -22px 60px 0 var(--indigo), -70px 70px 0 var(--amber), -44px 110px 0 #8FA2E4, -90px 30px 0 var(--indigo), -12px 140px 0 var(--amber), -64px 160px 0 var(--indigo);
}

.wc__dust--next {
  right: 8%;
  background: var(--indigo);
  box-shadow: 18px 14px 0 var(--amber), 34px -10px 0 var(--indigo), 52px 26px 0 #8FA2E4, 22px 60px 0 var(--amber), 70px 70px 0 var(--indigo), 44px 110px 0 #8FA2E4, 90px 30px 0 var(--amber), 12px 140px 0 var(--indigo), 64px 160px 0 var(--amber);
}

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

@media (prefers-reduced-motion: reduce) {
  .wc__img {
    transition: none;
    transform: none;
  }
}

/* Small laptops and below: the current project only. */
@media (max-width: 1024px) {
  .wc__side {
    display: none;
  }

  .wc__stage {
    min-height: 0;
  }

  .wc__main {
    flex: 1 1 auto;
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
