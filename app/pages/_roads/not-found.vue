<script setup lang="ts">
/**
 * Experiment 6: 404 road. The calm 404 road, but fog closes in early so the
 * road fades out into empty space ahead. Copy from content J5. A toggle
 * shows the standard 404 road (Phase 2) for comparison.
 */
definePageMeta({ layout: 'c4' })
useHead({ title: 'Road experiment: 404 road' })

const voidRoad = ref(true)
const run = ref(0)
</script>

<template>
  <DevRoadDemo
    :n="6"
    title="404 road"
    idea="On the 404 page, the road runs calmly and fades out into empty space ahead: there is nowhere further to go on this address."
    :notes="['Reduced motion and low-power devices see the still image.']"
  >
    <template #controls>
      <C4Button variant="primary" size="sm" @click="run++">Replay: restart the road</C4Button>
      <C4Button variant="secondary" size="sm" @click="voidRoad = !voidRoad; run++">
        {{ voidRoad ? 'Compare: the standard 404 road' : 'Back to: fades into empty space' }}
      </C4Button>
    </template>

    <section class="stage">
      <div class="c4-wrap stage__copy">
        <Eyebrow>404</Eyebrow>
        <p class="c4-h1">This page is not here</p>
        <p class="c4-lead">The link may be out of date, or the page may have moved when we rebuilt the site. These will take you where you need to go.</p>
      </div>
      <!-- The road has its own band under the words, so it never needs a side fade. -->
      <div class="stage__road">
        <HyperspeedRoad :key="`${voidRoad}-${run}`" :preset="voidRoad ? 'demo-void' : 'notfound'" mask="none" />
      </div>
    </section>
  </DevRoadDemo>
</template>

<style scoped>
.stage {
  margin-bottom: var(--s-96);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.stage__copy {
  display: flex;
  flex-direction: column;
  gap: var(--s-24);
  padding-block: var(--s-64) var(--s-32);
}

.stage__copy > * {
  max-width: 600px;
}

.stage__road {
  height: 460px;
}

@media (max-width: 900px) {
  .stage__road {
    height: 330px;
  }
}
</style>
