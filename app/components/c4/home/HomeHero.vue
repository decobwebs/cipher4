<script setup lang="ts">
/**
 * Home hero (content C1, Home-Desktop and Home-Mobile boards).
 *
 * Above 1100 px: the live road behind the hero, faded so it never crosses
 * the text column. 1100 px and below (phones, tablets, small laptops): the
 * road sits in its own band under the buttons. Between 900 and 1100 px the
 * text column left only a thin strip for the road (owner's review).
 * The headline is plain HTML on screen from the first paint; the road
 * arrives later (after load and idle) and never delays it.
 *
 * Kept from the Phase 2b experiments: Arrival (fast start that settles,
 * once per visit) and Steering (desktop with a mouse only).
 */
import { hero } from '~/data/home'

// Motion board 02, leaving the hero: as you scroll out, the road speeds up
// and the view widens, like pulling onto a motorway, then it fades as the
// mission arrives. Scrolling back up reverses it (scrubbed to the scroll).
const heroEl = useTemplateRef<HTMLElement>('heroSection')
const roadBox = useTemplateRef<HTMLElement>('roadBox')
const road = useTemplateRef<{ setSpeed: (n: number) => void; setFov: (d: number | null) => void }>('road')

useScrollMoment(({ ScrollTrigger }) => {
  if (!heroEl.value) return
  let last = -1
  ScrollTrigger.create({
    trigger: heroEl.value,
    start: 'top top',
    end: 'bottom top',
    onUpdate: (self) => {
      const p = Math.round(self.progress * 100) / 100
      if (p === last) return
      last = p
      road.value?.setSpeed(1 + p * 2.6)
      road.value?.setFov(p > 0 ? 90 + p * 45 : null)
      if (roadBox.value) roadBox.value.style.opacity = String(1 - Math.max(0, (p - 0.45) / 0.55))
    },
  })
  return () => { road.value?.setSpeed(1); road.value?.setFov(null) }
})
</script>

<template>
  <!-- Choreography 01: lines rise into place while the road already runs. -->
  <section ref="heroSection" v-m:now="'lines'" class="hh" aria-labelledby="hh-title">
    <div ref="roadBox" class="hh__road">
      <HyperspeedRoad ref="road" preset="hero" arrival steering />
    </div>
    <div class="c4-wrap hh__inner">
      <div class="hh__copy">
        <Eyebrow class="m-after" style="--i: -2">{{ hero.eyebrow }}</Eyebrow>
        <h1 id="hh-title" class="hh__title">
          <span class="m-mask"><span class="m-line">{{ hero.titleLead }}</span></span>
          {{ ' ' }}<span class="m-mask"><span class="m-line c4-accent" style="--i: 1">{{ hero.titleAccent }}</span></span>
        </h1>
        <p class="hh__lead m-after" style="--i: 1">{{ hero.lead }}</p>
        <div class="hh__actions m-after" style="--i: 2">
          <C4Button :to="hero.primary.to" arrow>{{ hero.primary.label }}</C4Button>
          <C4Button :to="hero.secondary.to" variant="secondary">{{ hero.secondary.label }}</C4Button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hh {
  position: relative;
  overflow: hidden;
  background: var(--white);
}

/* The road has its own area on the right half of the hero (owner, 20 Nov
   2026): from just before the end of the text column to the right edge, so
   the whole road shows, amber and indigo sides, and it never sits behind
   the words. The library centres the road in its canvas, so it sits in the
   middle of this area. Only the area's first 120 px fade in, inside the
   gap between the words and the road. */
.hh__road {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: calc(max(0px, 50% - 660px) + var(--gutter) + 680px + var(--s-24));
}

.hh__road :deep(.c4-road--hero) {
  opacity: 1;
  -webkit-mask-image:
    linear-gradient(90deg, transparent 0, #000 120px),
    linear-gradient(180deg, #000 70%, transparent 100%);
  mask-image:
    linear-gradient(90deg, transparent 0, #000 120px),
    linear-gradient(180deg, #000 70%, transparent 100%);
}

.hh__inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  /* Header (68 px pill + 16 px offset), then the board's 72 px. */
  min-height: 860px;
  padding-top: calc(68px + var(--s-16) + var(--s-64));
  padding-bottom: var(--s-128);
}

.hh__copy {
  display: flex;
  flex-direction: column;
  gap: var(--s-32);
  /* 680 lets "Intelligence for" sit on one line at 92 px, as on the board. */
  max-width: 680px;
}

.hh__title {
  font-size: clamp(50px, 6.4vw, 92px);
  line-height: 0.98;
  letter-spacing: -0.045em;
  font-weight: 400;
}

.hh__lead {
  max-width: 540px;
  font-size: clamp(18px, 1.45vw, 21px);
  line-height: 1.6;
  color: var(--slate);
}

.hh__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-12);
}

/* 1100 px and below: words first, the road in its own band below. */
@media (max-width: 1100px) {
  .hh {
    display: flex;
    flex-direction: column;
  }

  .hh__inner {
    order: 0;
    min-height: 0;
    padding-top: calc(52px + var(--s-12) + var(--s-48));
    padding-bottom: var(--s-32);
  }

  .hh__copy {
    gap: var(--s-24);
  }

  .hh__lead {
    font-size: 17px;
    line-height: 1.5;
  }

  .hh__actions {
    flex-direction: column;
    gap: var(--s-12);
  }

  .hh__actions :deep(.c4-btn) {
    width: 100%;
  }

  .hh__road {
    position: relative;
    inset: auto;
    order: 1;
    height: 330px;
    margin-top: calc(-1 * var(--s-8));
  }

  /* Its own band under the words: full width, a soft fade top and bottom. */
  .hh__road :deep(.c4-road--hero) {
    -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 70%, transparent 100%);
    mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 70%, transparent 100%);
  }
}
</style>
