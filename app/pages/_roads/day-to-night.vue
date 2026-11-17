<script setup lang="ts">
/**
 * Experiment 2: day to night. A tall page with the road held in place while
 * you scroll. The road's colours blend from the light theme to the night
 * theme as you go, and the page behind it darkens with it, ending at the
 * closing band. The section labels sit on their own cards, clear of the
 * road, so they stay readable at every point of the blend.
 */
definePageMeta({ layout: 'c4' })
useHead({ title: 'Road experiment: day to night' })

const road = ref<{ themeMix: (t: number) => void } | null>(null)
const tall = ref<HTMLElement | null>(null)
const p = ref(0)
const sections = ['Hero', 'What we do', 'Where we work', 'Our work', 'How we deliver', 'Closing band']
const active = computed(() => Math.min(sections.length - 1, Math.floor(p.value * sections.length)))

// White to the night road's fog colour, so the distance blends cleanly.
const mixHex = (t: number) => {
  const a = [255, 255, 255], b = [6, 10, 28]
  return `rgb(${a.map((v, i) => Math.round(v + (b[i]! - v) * t)).join(',')})`
}
const bg = computed(() => mixHex(p.value))
const dark = computed(() => p.value > 0.5)

let raf = 0
function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    const el = tall.value
    if (!el) return
    const top = el.getBoundingClientRect().top
    const span = el.offsetHeight - window.innerHeight
    p.value = Math.min(1, Math.max(0, -top / span))
    road.value?.themeMix(p.value)
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

// Replay: back to the top, then scroll down through it in about 7 seconds.
function replay() {
  const el = tall.value
  if (!el) return
  const start = el.offsetTop
  const end = start + el.offsetHeight - window.innerHeight
  window.scrollTo({ top: start, behavior: 'instant' as ScrollBehavior })
  const t0 = performance.now()
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / 7000)
    window.scrollTo({ top: start + (end - start) * (0.5 - Math.cos(Math.PI * k) / 2), behavior: 'instant' as ScrollBehavior })
    if (k < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
</script>

<template>
  <DevRoadDemo
    :n="2"
    title="Day to night"
    idea="As the page scrolls, the road's colours blend from the light theme to the night theme, and the page behind it darkens with it, ending at the closing band. Scroll down slowly, or press replay."
    :notes="['Reduced motion and low-power devices see the light still image; the page colour still changes, as it is not movement.']"
  >
    <template #controls>
      <C4Button variant="primary" size="sm" @click="replay">Replay: scroll through it</C4Button>
    </template>

    <div ref="tall" class="tall">
      <div class="sticky" :style="{ background: bg }">
        <div class="sticky__road"><HyperspeedRoad ref="road" preset="demo-daynight" /></div>
        <div class="c4-wrap sticky__labels">
          <ol class="labels" :class="{ 'labels--dark': dark }">
            <li v-for="(s, i) in sections" :key="s" :class="{ 'is-on': i === active }">
              <span class="labels__n">{{ String(i + 1).padStart(2, '0') }}</span>{{ s }}
            </li>
          </ol>
          <p class="readout" :class="{ 'labels--dark': dark }">Blend {{ Math.round(p * 100) }}%</p>
        </div>
      </div>
    </div>

    <ClosingBand />
  </DevRoadDemo>
</template>

<style scoped>
.tall {
  position: relative;
  height: 500vh;
}

.sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}

.sticky__road {
  position: absolute;
  inset: 0;
}

.sticky__labels {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--s-16);
  height: 100%;
}

.labels {
  display: flex;
  flex-direction: column;
  gap: var(--s-8);
  width: min(320px, 100%);
  padding: var(--s-16);
  border-radius: var(--radius-card);
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid var(--line);
  list-style: none;
  font-size: 16px;
  color: var(--slate);
  transition: background-color 300ms var(--ease-out), color 300ms var(--ease-out);
}

.labels li {
  display: flex;
  align-items: center;
  gap: var(--s-12);
  min-height: 36px;
}

.labels li.is-on {
  color: var(--ink);
  font-weight: 600;
}

.labels__n {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  color: var(--indigo);
}

.labels--dark {
  background: rgba(16, 26, 68, 0.94);
  border-color: var(--on-dark-line);
  color: var(--on-dark-2);
}

.labels--dark li.is-on {
  color: var(--on-dark);
}

.labels--dark .labels__n {
  color: var(--amber);
}

.readout {
  align-self: flex-start;
  padding: var(--s-8) var(--s-16);
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.94);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slate);
}

.readout.labels--dark {
  background: rgba(16, 26, 68, 0.94);
  color: var(--on-dark-2);
}
</style>
