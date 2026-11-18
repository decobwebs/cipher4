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
</script>

<template>
  <section class="hh" aria-labelledby="hh-title">
    <div class="hh__road">
      <HyperspeedRoad preset="hero" arrival steering />
    </div>
    <div class="c4-wrap hh__inner">
      <div class="hh__copy">
        <Eyebrow>{{ hero.eyebrow }}</Eyebrow>
        <h1 id="hh-title" class="hh__title">
          {{ hero.titleLead }} <span class="c4-accent">{{ hero.titleAccent }}</span>
        </h1>
        <p class="hh__lead">{{ hero.lead }}</p>
        <div class="hh__actions">
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

/* The road fills the hero, header area included (as on the board). */
.hh__road {
  position: absolute;
  inset: 0;
}

.hh__road :deep(.c4-road--hero) {
  --road-text: 680px;
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
}
</style>
