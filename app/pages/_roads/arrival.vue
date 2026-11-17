<script setup lang="ts">
/**
 * Experiment 1: arrival. On the first visit of a session, the hero road
 * starts at full speed with a stretched view and settles to its cruising
 * speed over 1.2 s. The headline is plain HTML and is on screen from the
 * first paint; the road arrives whenever it is ready (after load and idle),
 * so the headline never waits for it.
 */
definePageMeta({ layout: 'c4' })
useHead({ title: 'Road experiment: arrival' })

const road = ref<{ replayArrival: () => void } | null>(null)
const playedBefore = ref<boolean | null>(null)

onMounted(() => {
  try { playedBefore.value = sessionStorage.getItem('c4-road-arrived') === '1' } catch { playedBefore.value = null }
})

function firstVisit() {
  try { sessionStorage.removeItem('c4-road-arrived') } catch { /* private mode */ }
  location.reload()
}
</script>

<template>
  <DevRoadDemo
    :n="1"
    title="Arrival"
    idea="On the first visit, the hero road starts at full speed with a stretched view and slows to its normal cruising speed over about 1.2 seconds. It plays once per visit. The headline is on screen from the first moment; the road arrives when it is ready."
    :notes="[
      playedBefore === null ? 'Checking this visit…' : playedBefore ? 'This visit had already played the arrival when the page opened, so it did not play again. Use the buttons to see it.' : 'This was the first time this visit: the arrival played.',
      'Reduced motion and low-power devices see the still image and no arrival.',
    ]"
  >
    <template #controls>
      <C4Button variant="primary" size="sm" @click="road?.replayArrival()">Replay the arrival</C4Button>
      <C4Button variant="secondary" size="sm" @click="firstVisit">Reload as a first visit</C4Button>
    </template>

    <section class="stage">
      <div class="stage__road"><HyperspeedRoad ref="road" preset="hero" arrival /></div>
      <div class="c4-wrap stage__copy">
        <Eyebrow>Maritime · Oil and gas · Logistics · Supply chain</Eyebrow>
        <p class="c4-display">Intelligence for <span class="c4-accent">critical operations.</span></p>
        <p class="c4-lead">We engineer the software, AI and connected systems that let complex operations sense what is happening, decide what comes next and prove what was done.</p>
      </div>
    </section>
  </DevRoadDemo>
</template>

<style scoped>
.stage {
  position: relative;
  min-height: 760px;
  display: flex;
  align-items: center;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  overflow: hidden;
}

.stage__road {
  position: absolute;
  inset: 0;
}

.stage__copy {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--s-32);
  padding-block: var(--s-96);
}

.stage__copy > * {
  max-width: 620px;
}

@media (max-width: 900px) {
  .stage {
    min-height: 0;
    flex-direction: column-reverse;
  }

  .stage__road {
    position: relative;
    inset: auto;
    width: 100%;
    height: 330px;
  }
}
</style>
