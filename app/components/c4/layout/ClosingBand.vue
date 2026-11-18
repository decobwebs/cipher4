<script setup lang="ts">
/**
 * The closing band (content B4, Home-Desktop board): the one dark moment on
 * every page. The night road runs low in the band, beneath the call to
 * action. Pages can swap it through the `road` slot. The space it needs
 * is reserved in the layout, so nothing shifts when it fades in.
 */
import { closingBand as copy } from '~/data/site'

interface BandLink { label: string; to?: string; href?: string }

const props = withDefaults(defineProps<{
  title?: string
  lead?: string
  /** A page's own closing words (Insights, Credentials) bring their own buttons. */
  primary?: BandLink
  /** `null` drops the second button. */
  secondary?: BandLink | null
  /** `null` drops the reply promise (it belongs to the B4 band). */
  promise?: string | null
}>(), {})

const first = computed(() => props.primary ?? copy.primary)
const second = computed(() => (props.secondary === null ? null : props.secondary ?? copy.secondary))
const note = computed(() => (props.promise === null ? null : props.promise ?? copy.promise))
</script>

<template>
  <!-- Choreography 12: the night road arrives below. -->
  <section v-m="'night'" class="c4-close" aria-labelledby="c4-close-title">
    <div class="c4-close__band on-dark">
      <div class="c4-close__road" aria-hidden="true">
        <slot name="road">
          <HyperspeedRoad preset="closing" />
        </slot>
      </div>
      <div class="c4-wrap c4-close__inner">
        <h2 id="c4-close-title" class="c4-close__title">{{ title ?? copy.title }}</h2>
        <p class="c4-close__lead">{{ lead ?? copy.lead }}</p>
        <div class="c4-close__actions">
          <C4Button :to="first.to" :href="first.href" size="lg" arrow>{{ first.label }}</C4Button>
          <C4Button v-if="second" :to="second.to" :href="second.href" size="lg" variant="secondary" on-dark>{{ second.label }}</C4Button>
        </div>
        <p v-if="note" class="c4-close__promise">{{ note }}</p>
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
  /* Room for the road under the buttons (board: 220 to 300 px). The road's
     mask reads the same value, so it never rises into the text. */
  --close-pad: clamp(224px, 20vw, 288px);
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-band);
  background:
    radial-gradient(600px 300px at 12% 0%, rgba(245, 165, 36, 0.18), rgba(245, 165, 36, 0) 70%),
    var(--night);
  color: var(--on-dark);
}

/* The road fills the band; its own mask (closing) clears the top half, so
   it never runs behind the words. On phones it is the bottom 300 px only. */
.c4-close__road {
  position: absolute;
  inset: 0;
}

@media (max-width: 767px) {
  .c4-close__road {
    top: auto;
    height: 300px;
  }
}

.c4-close__inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-32);
  padding-top: var(--section-y);
  padding-bottom: var(--close-pad);
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
