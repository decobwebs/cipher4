<script setup lang="ts">
/**
 * Experiment 3: sector road. One road carries all four sector shapes and
 * blends between them over 800 ms when a sector is chosen. Same shapes and
 * settings as the four sector header roads.
 */
import type { Distortion } from '~/lib/hyperspeed/index'
import type { C4IconName } from '~/lib/icons'

definePageMeta({ layout: 'c4' })
useHead({ title: 'Road experiment: sector road' })

const road = ref<{ morphTo: (n: Distortion, ms?: number) => void } | null>(null)
const sectors: { label: string; shape: Distortion; icon: C4IconName; note: string }[] = [
  { label: 'Maritime', shape: 'turbulentDistortion', icon: 'maritime', note: 'waves' },
  { label: 'Oil and gas', shape: 'deepDistortion', icon: 'oil-gas', note: 'a deep climb' },
  { label: 'Logistics', shape: 'LongRaceDistortion', icon: 'logistics', note: 'a long straight route' },
  { label: 'Supply chain', shape: 'xyDistortion', icon: 'supply-chain', note: 'a gentle chain of bends' },
]
const current = ref(0)

function choose(i: number) {
  current.value = i
  road.value?.morphTo(sectors[i]!.shape, 800)
}

// Replay: tour all four, 2.4 s each.
let tour: ReturnType<typeof setTimeout> | undefined
function replay() {
  clearTimeout(tour)
  let i = 0
  const next = () => {
    choose(i)
    i++
    if (i < sectors.length) tour = setTimeout(next, 2400)
  }
  next()
}
onBeforeUnmount(() => clearTimeout(tour))
</script>

<template>
  <DevRoadDemo
    :n="3"
    title="Sector road"
    idea="Choose a sector and the road changes shape live to that sector's road, over about 800 ms, with no jump. The four shapes are the same as the four sector page headers."
    :notes="['Reduced motion and low-power devices see a still image, and the buttons do nothing to it.']"
  >
    <template #controls>
      <div class="pick" role="group" aria-label="Sector">
        <button
          v-for="(s, i) in sectors"
          :key="s.label"
          type="button"
          class="pick__btn"
          :aria-pressed="current === i"
          @click="choose(i)"
        >
          <C4Icon :name="s.icon" :size="24" still />
          <span>{{ s.label }}</span>
        </button>
      </div>
      <C4Button variant="secondary" size="sm" @click="replay">Replay: tour all four</C4Button>
    </template>

    <section class="stage">
      <HyperspeedRoad ref="road" preset="demo-sectors" />
    </section>
    <p class="c4-wrap caption">{{ sectors[current]!.label }}: {{ sectors[current]!.note }}</p>
  </DevRoadDemo>
</template>

<style scoped>
.pick {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-8);
}

.pick__btn {
  display: inline-flex;
  align-items: center;
  gap: var(--s-8);
  min-height: 48px;
  padding: 0 var(--s-16);
  border-radius: var(--radius-pill);
  border: 1px solid var(--line-2);
  background: var(--white);
  font-size: 15px;
  color: var(--ink);
}

.pick__btn[aria-pressed='true'] {
  border-color: var(--indigo);
  background: var(--paper);
  box-shadow: inset 0 0 0 1px var(--indigo);
}

.stage {
  height: 64vh;
  min-height: 420px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.caption {
  padding-block: var(--s-24) var(--s-96);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slate);
}
</style>
