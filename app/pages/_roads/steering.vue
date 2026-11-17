<script setup lang="ts">
/**
 * Experiment 4: steering. On a desktop with a mouse or trackpad, the camera
 * leans up to about 3 degrees towards the pointer, easing gently. Off on
 * touch devices and with reduced motion.
 */
definePageMeta({ layout: 'c4' })
useHead({ title: 'Road experiment: steering' })

const on = ref<boolean | null>(null)
onMounted(() => {
  on.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

// Replay: a slow sweep of a pretend pointer, left, right, back to centre,
// so the lean can be seen without moving the mouse.
function replay() {
  const t0 = performance.now()
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / 5000)
    const x = Math.sin(k * Math.PI * 2) * 0.95
    window.dispatchEvent(new PointerEvent('pointermove', {
      pointerType: 'mouse',
      clientX: ((x + 1) / 2) * window.innerWidth,
      clientY: window.innerHeight * 0.5,
    }))
    if (k < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
</script>

<template>
  <DevRoadDemo
    :n="4"
    title="Steering"
    idea="Move the mouse across the page: the camera leans a few degrees towards it, easing in gently, as if the road looks where you look. Desktop only."
    :notes="[
      on === null ? 'Checking this device…' : on ? 'Steering is on for this device.' : 'Steering is off on this device (touch screen or reduced motion), as intended.',
    ]"
  >
    <template #controls>
      <C4Button variant="primary" size="sm" @click="replay">Replay: sweep left and right</C4Button>
    </template>

    <section class="stage">
      <HyperspeedRoad preset="hero" mask="none" steering />
    </section>
  </DevRoadDemo>
</template>

<style scoped>
.stage {
  height: 70vh;
  min-height: 460px;
  margin-bottom: var(--s-96);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
</style>
