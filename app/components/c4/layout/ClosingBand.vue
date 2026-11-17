<script setup lang="ts">
/**
 * The closing band (content B4, Home-Desktop board): the one dark moment on
 * every page. The night road runs low in the band, beneath the call to
 * action; it arrives in Phase 2 through the `road` slot. Until then the
 * space it will occupy is already reserved, so nothing shifts later.
 */
import { closingBand as copy } from '~/data/site'

withDefaults(defineProps<{
  title?: string
  lead?: string
}>(), {})
</script>

<template>
  <section class="c4-close" aria-labelledby="c4-close-title">
    <div class="c4-close__band on-dark">
      <div class="c4-close__road" aria-hidden="true">
        <slot name="road" />
      </div>
      <div class="c4-wrap c4-close__inner">
        <h2 id="c4-close-title" class="c4-close__title">{{ title ?? copy.title }}</h2>
        <p class="c4-close__lead">{{ lead ?? copy.lead }}</p>
        <div class="c4-close__actions">
          <C4Button :to="copy.primary.to" size="lg" arrow>{{ copy.primary.label }}</C4Button>
          <C4Button :to="copy.secondary.to" size="lg" variant="secondary" on-dark>{{ copy.secondary.label }}</C4Button>
        </div>
        <p class="c4-close__promise">{{ copy.promise }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.c4-close {
  padding: 0 var(--s-12) var(--s-12);
  background: var(--white);
}

@media (min-width: 768px) {
  .c4-close {
    padding: 0 var(--s-24) var(--s-24);
  }
}

.c4-close__band {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-band);
  background:
    radial-gradient(600px 300px at 12% 0%, rgba(245, 165, 36, 0.18), rgba(245, 165, 36, 0) 70%),
    var(--night);
  color: var(--on-dark);
}

/* The road sits in the lower part of the band, faded in from above, so it
   never runs behind the words. */
.c4-close__road {
  position: absolute;
  inset: 0;
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, transparent 52%, #000 80%);
  mask-image: linear-gradient(180deg, transparent 0%, transparent 52%, #000 80%);
}

.c4-close__inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-32);
  padding-top: var(--section-y);
  /* Room for the road under the buttons (board: 220 to 300 px). */
  padding-bottom: clamp(224px, 20vw, 288px);
  text-align: center;
}

.c4-close__title {
  max-width: 960px;
  font-size: clamp(40px, 5.6vw, 84px);
  line-height: 1;
  letter-spacing: -0.045em;
  font-weight: 400;
  color: var(--on-dark);
}

.c4-close__lead {
  max-width: 600px;
  font-size: 19px;
  line-height: 1.55;
  color: var(--on-dark-2);
}

.c4-close__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--s-12);
}

.c4-close__promise {
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.6;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--on-dark-3);
}

@media (max-width: 767px) {
  .c4-close__actions {
    flex-direction: column;
    align-self: stretch;
  }

  .c4-close__lead {
    font-size: 17px;
  }
}
</style>
