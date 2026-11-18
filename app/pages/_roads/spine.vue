<script setup lang="ts">
/**
 * Experiment: Spine, shown as the home page's "How we deliver" section
 * (content C8). The road is seen from straight above, so it runs down the
 * left as a narrow band. Its trails move with the page: down while you
 * scroll down, up while you scroll up, at the scroll's own speed, and they
 * stop when you stop. Nothing is pinned: the page scrolls normally, and the
 * road window simply stays in view beside the stages while they pass.
 *
 * Each stage lights up when it reaches the trail's reading line (55% of the
 * screen height), and dims again if you scroll back above it.
 */
import type { C4IconName } from '~/lib/icons'

definePageMeta({ layout: 'c4' })
useHead({ title: 'Road experiment: spine' })

const stages: { n: string; title: string; text: string; receive: string; icon: C4IconName }[] = [
  { n: '01', title: 'Discovery', text: 'We learn how your operation really works.', receive: 'findings and a written scope.', icon: 'discovery' },
  { n: '02', title: 'Design', text: 'Architecture, integrations and a delivery plan, agreed before anything is built.', receive: 'a design document and a fixed price.', icon: 'design' },
  { n: '03', title: 'Pilot', text: 'One site, one team or one process, to prove the system in real conditions.', receive: 'a working system on a limited scope.', icon: 'pilot' },
  { n: '04', title: 'Deployment', text: 'Rollout across the operation, integrated with what you already run.', receive: 'a commissioned, accepted system.', icon: 'deployment' },
  { n: '05', title: 'Training and handover', text: 'Users and administrators trained separately, with documentation for whoever looks after it next.', receive: 'trained teams and a handover pack.', icon: 'training' },
  { n: '06', title: 'Support', text: 'Defined response times, named contacts and scheduled maintenance.', receive: 'a signed support agreement.', icon: 'support' },
]

const stops = ref<HTMLElement[]>([])
const lit = ref<boolean[]>(stages.map(() => false))
let raf = 0
function update() {
  raf = 0
  const line = window.innerHeight * 0.55
  lit.value = stops.value.map((el) => el.getBoundingClientRect().top + 24 < line)
}
function onScroll() { if (!raf) raf = requestAnimationFrame(update) }
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  update()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

// Replay: back to the start of the stages, then scroll through them and
// back up again, so both directions can be seen.
const section = ref<HTMLElement | null>(null)
function replay() {
  const el = section.value
  if (!el) return
  const top = el.offsetTop - 80
  const bottom = el.offsetTop + el.offsetHeight - window.innerHeight
  window.scrollTo({ top, behavior: 'instant' as ScrollBehavior })
  const glide = (from: number, to: number, ms: number) => new Promise<void>((res) => {
    const t0 = performance.now()
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms)
      window.scrollTo({ top: from + (to - from) * (0.5 - Math.cos(Math.PI * k) / 2), behavior: 'instant' as ScrollBehavior })
      if (k < 1) requestAnimationFrame(step); else res()
    }
    requestAnimationFrame(step)
  })
  glide(top, bottom, 7000).then(() => new Promise((r) => setTimeout(r, 900))).then(() => glide(bottom, top + (bottom - top) * 0.4, 2600))
}
</script>

<template>
  <DevRoadDemo
    :n="7"
    title="Spine"
    idea="The road seen from straight above, running down the left of the How we deliver section as a narrow band. Its light trails move with the page: down while you scroll down, up while you scroll up, at your scrolling speed, and they stop when you stop. Each stage lights up as the trail reaches it. Nothing is pinned; the page scrolls normally."
    :notes="['On phones the band is 80 px wide and the layout is the same. Following the road rules, phones show the band as a still image (only header and closing roads move on phones).', 'Reduced motion and slow devices see the still image.']"
  >
    <template #controls>
      <C4Button variant="primary" size="sm" @click="replay">Replay: scroll down, then back up</C4Button>
    </template>

    <section ref="section" class="deliver c4-section c4-section--paper">
      <div class="c4-wrap">
        <SectionHeader
          eyebrow="How we deliver"
          title="Six stages, and you know what each one gives you"
          lead="Every engagement follows the same sequence, so you always know what happens next and what lands in your hands at the end of each stage."
        />
        <div class="deliver__grid">
          <div class="deliver__band">
            <div class="deliver__road"><HyperspeedRoad preset="demo-spine" /></div>
          </div>
          <ol class="deliver__stops">
            <li
              v-for="(s, i) in stages"
              :key="s.n"
              ref="stops"
              class="stop"
              :class="{ 'is-lit': lit[i] }"
            >
              <span class="stop__tick" aria-hidden="true" />
              <div class="stop__head">
                <span class="stop__n">{{ s.n }}</span>
                <C4Icon :name="s.icon" :size="32" />
              </div>
              <h3 class="c4-h3">{{ s.title }}</h3>
              <p class="stop__text">{{ s.text }}</p>
              <p class="stop__receive"><span>You receive:</span> {{ s.receive }}</p>
            </li>
          </ol>
        </div>
      </div>
    </section>
    <div class="after" />
  </DevRoadDemo>
</template>

<style scoped>
.deliver__grid {
  --band: 220px;
  display: grid;
  grid-template-columns: var(--band) minmax(0, 1fr);
  gap: var(--s-64);
}

/* The band runs the full height of the stages. The road window inside it
   stays in view while the stages pass; the page itself is never pinned. */
.deliver__band {
  position: relative;
  border-radius: var(--radius-card);
  background: var(--white);
  border: 1px solid var(--line);
}

.deliver__road {
  position: sticky;
  top: 0;
  height: 100vh;
  max-height: 100%;
}

.deliver__stops {
  display: flex;
  flex-direction: column;
  list-style: none;
}

.stop {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--s-12);
  min-height: 56vh;
  padding-block: var(--s-48);
  border-top: 1px solid var(--line);
  color: var(--slate);
  transition: color 400ms var(--ease-out);
}

/* A short line from the band to the stage, amber once lit. */
.stop__tick {
  position: absolute;
  top: calc(var(--s-48) + 14px);
  left: calc(-1 * var(--s-64));
  width: var(--s-48);
  height: 2px;
  background: var(--line-2);
  transform-origin: left center;
  transition: background-color 400ms var(--ease-out);
}

.stop.is-lit .stop__tick {
  background: var(--amber);
}

.stop__head {
  display: flex;
  align-items: center;
  gap: var(--s-16);
}

.stop__n {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.16em;
  color: var(--grey);
  transition: color 400ms var(--ease-out);
}

.stop.is-lit .stop__n {
  color: var(--indigo);
}

.stop .c4-h3 {
  color: var(--slate);
  transition: color 400ms var(--ease-out);
}

.stop.is-lit .c4-h3 {
  color: var(--ink);
}

.stop__text {
  max-width: 56ch;
}

.stop__receive {
  max-width: 56ch;
  color: var(--ink-2);
}

.stop__receive span {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--indigo);
}

.after {
  height: 60vh;
}

@media (max-width: 900px) {
  .deliver__grid {
    --band: 80px;
    gap: var(--s-24);
  }

  .stop {
    min-height: 48vh;
    padding-block: var(--s-32);
  }

  .stop__tick {
    top: calc(var(--s-32) + 14px);
    left: calc(-1 * var(--s-24));
    width: var(--s-16);
  }
}
</style>
