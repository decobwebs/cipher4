<script setup lang="ts">
/** Youth band, slim (content C11). */
import { youth } from '~/data/home'
</script>

<template>
  <!-- Choreography 11: lines grow up into a light. -->
  <section v-m="'grow'" class="hyo" aria-label="Community">
    <div class="c4-wrap hyo__inner">
      <div class="m-grow hyo__grow" aria-hidden="true">
        <span v-for="(h, k) in [40, 64, 52, 80, 58]" :key="k" :style="{ '--h': `${h}px`, '--i': k }" />
      </div>
      <div class="hyo__copy m-item" style="--i: 1">
        <Eyebrow>{{ youth.eyebrow }}</Eyebrow>
        <p class="hyo__text">
          <strong>{{ youth.strong }}</strong> <span class="hyo__rest">{{ youth.rest }}</span>
        </p>
      </div>
      <C4Button :to="youth.link.to" variant="text" class="m-item" style="--i: 3">{{ youth.link.label }}</C4Button>
    </div>
  </section>
</template>

<style scoped>
.hyo {
  background: var(--white);
  border-top: 1px solid var(--line);
}

.hyo__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--s-32);
  padding-block: var(--s-48);
}

.hyo__grow {
  flex: none;
}

.hyo__copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--s-12);
  max-width: 760px;
}

.hyo__text {
  font-size: clamp(19px, 2vw, 25px);
  line-height: 1.4;
  letter-spacing: -0.02em;
}

.hyo__text strong {
  font-weight: 600;
}

.hyo__rest {
  color: var(--slate);
}

@media (max-width: 767px) {
  .hyo__inner {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--s-12);
  }
}
</style>
