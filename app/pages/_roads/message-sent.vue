<script setup lang="ts">
/**
 * Experiment 5: message sent. The contact road (deep, slow). On "Send",
 * one bright amber car races down the road into the distance, together with
 * the 400 ms speed burst. Nothing is sent anywhere: the button only plays
 * the effect.
 */
definePageMeta({ layout: 'c4' })
useHead({ title: 'Road experiment: message sent' })

const road = ref<{ launch: () => void } | null>(null)
const sent = ref(0)
function send() {
  road.value?.launch()
  sent.value++
}
</script>

<template>
  <DevRoadDemo
    :n="5"
    title="Message sent"
    idea="Press Send: one bright amber car races down the road into the distance, together with the 400 ms burst of speed. On the real contact page it would play as the thank-you message appears."
    :notes="['This button only plays the effect; nothing is sent.', 'Reduced motion and low-power devices see the still image and no car.']"
  >
    <template #controls>
      <C4Button variant="primary" arrow @click="send">Send enquiry</C4Button>
      <span class="count" aria-live="polite">{{ sent ? `Played ${sent} time${sent === 1 ? '' : 's'}` : '' }}</span>
    </template>

    <section class="stage">
      <HyperspeedRoad ref="road" preset="demo-launch" />
    </section>
  </DevRoadDemo>
</template>

<style scoped>
.count {
  align-self: center;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slate);
}

.stage {
  height: 64vh;
  min-height: 420px;
  margin-bottom: var(--s-96);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
</style>
