<script setup lang="ts">
import { industries } from '~/data/industries'

/**
 * The hero — three layers over white.
 *
 *   white page
 *     -> soft radial glow
 *     -> Hyperspeed, held back to ~28% and colour-corrected
 *     -> white wash overlay, transparent at centre, opaque at the edges
 *     -> text
 *
 * The naive approach is to set the effect's background to 0xffffff and stop.
 * That does not work: Hyperspeed was authored for a dark environment where
 * white lines read as emitted light, so on white the road disappears, the
 * pale blues disappear, and the result is muddy rather than subtle.
 *
 * COPY
 * ----
 * The headline is a benefit in plain verbs, not a category label. "Intelligence
 * for operations that cannot stop" was an abstraction — true, but nobody says
 * it out loud and it leaves the reader guessing what we sell.
 *
 * The lead follows the same structure a good enterprise hero uses: what it is,
 * what it concretely covers, and the objection removed. The earlier site copy
 * carried the right nouns (the four sectors, autonomous maritime systems,
 * procurement, fleet intelligence) wrapped in "fuses artificial intelligence,
 * robotics and data intelligence to power the world's most critical
 * operational sectors" — buzzword stacking, which is the thing that stops a
 * reader understanding. The nouns were kept; the stacking was dropped.
 *
 * THE VISUAL LAYER
 * ----------------
 * The effect runs full-bleed and NOTHING sits on top of it except the copy.
 *
 * Earlier versions stacked a radial wash and a masked, part-width container
 * over it. Each was individually soft, but together they drew a visible
 * boundary where the masked layer ended — which read as a stray card edge
 * across the hero, exactly the thing it was meant to avoid. Three subtractive
 * layers is one too many.
 *
 * Legibility is handled inside the effect instead: HyperspeedField's light
 * palette puts a near-white road and fog on a white page, so only the blue
 * light trails carry any weight, and dark copy sits on it cleanly. That is
 * verified by scripts/audit.mjs rather than assumed.
 */
</script>

<template>
  <section class="hero">
    <!-- The effect, full-bleed. Nothing is layered over it but the copy. -->
    <div class="hero__bg" aria-hidden="true">
      <UiHyperspeedField theme="light" distortion="mountainDistortion" />
    </div>

    <div class="container container--wide hero__content">
      <div class="hero__body">
        <p class="eyebrow hero__anim" style="--d: 0ms">
          Transport &middot; Logistics &middot; Oil &amp; Gas &middot; Supply Chain
        </p>

        <h1 class="display hero__title hero__anim" style="--d: 80ms">
          See your whole operation.
          <span class="hero__title-accent">Act on it in real time.</span>
        </h1>

        <p class="lead hero__anim" style="--d: 160ms">
          AI, robotics and field systems for transport, logistics, oil and gas
          and supply chain. Autonomous maritime inspection, fleet and asset
          tracking, procurement that survives an audit. Built to keep working
          where access is hard and the connection drops.
        </p>

        <div class="hero__actions hero__anim" style="--d: 240ms">
          <NuxtLink to="/solutions" class="btn btn--accent btn--lg">
            <span>Explore our solutions</span>
            <Icon name="lucide:arrow-right" size="18" />
          </NuxtLink>
          <NuxtLink to="/contact" class="btn btn--secondary btn--lg">
            <span>Book a consultation</span>
          </NuxtLink>
        </div>

        <ul class="hero__sectors hero__anim" style="--d: 320ms">
          <li v-for="industry in industries" :key="industry.slug">
            <NuxtLink :to="`/industries/${industry.slug}`" class="sector">
              <Icon :name="industry.icon" size="16" />
              {{ industry.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: var(--bg-page);
  /* Clears the floating header (1rem + 3.75rem + 1rem), then opens up. */
  padding-block: calc(5.75rem + var(--space-16)) var(--section-y);
  min-height: min(48rem, 92vh);
}



/* Layer 2 — the effect. Held right back and colour-corrected: brightened and
   de-contrasted so it sits under white rather than punching through it.
   Constrained to the right so the copy column stays calm. */
.hero__bg {
  position: absolute;
  /* Full-bleed. No part-width container, so there is no edge to see. */
  inset: 0;
  z-index: 0;
  opacity: 0.85;
  pointer-events: none;

  /* BOTTOM FADE ONLY.
     The hero clips `overflow: hidden`, and the near field of the road is at
     its widest and most opaque right where the section ends — so with no
     falloff it was cut off flat, drawing a hard horizontal line between the
     hero and the section below.

     This is a single-axis linear fade, deliberately not the radial mask that
     was here before. That one faded toward a centre point, which put a curved
     edge through the middle of the hero and read as a card boundary. A
     top-to-bottom ramp has no side edges and no centre — the road simply
     dissolves into the page over the last third, so there is no division to
     see. The fade lives on the effect layer itself; nothing is stacked over
     it. */
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 58%, rgba(0, 0, 0, 0.55) 80%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 0%, #000 58%, rgba(0, 0, 0, 0.55) 80%, transparent 100%);
}

@media (max-width: 64rem) {
  /* Stacked: the copy runs full width over the effect, so it is pulled back
     to keep the lead paragraph comfortable. */
  .hero__bg { opacity: 0.5; }
}



.hero__content {
  position: relative;
  z-index: 2;
}

.hero__body {
  display: grid;
  gap: var(--space-6);
  max-width: 40rem;
}

.hero__title {
  /* The display clamp tops out at 4.75rem, which is sized for a three-word
     headline. This copy is longer, and at that size in a 40rem column it
     broke across four lines and pushed the CTAs below the fold. Capping the
     hero's own size — rather than shrinking --fs-display globally — keeps the
     scale intact everywhere else. */
  font-size: clamp(2.5rem, 1.6rem + 3.4vw, 3.9rem);
  max-width: 18ch;
}

.hero__title-accent {
  display: block;
  color: var(--text-accent);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-block-start: var(--space-2);
}

.hero__sectors {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-block-start: var(--space-4);
  padding-block-start: var(--space-8);
  /* No divider rule here.
     It was the only hard-edged element in the hero, and because the effect
     runs behind the copy column it cut a straight white line straight across
     the road — reading as a stray card edge rather than a divider. The gap
     above already separates the chips from the buttons; nothing needs to sit
     over the animation. */
}

/* --- Entrance sequence -------------------------------------------------- */

.hero__anim {
  animation: hero-in var(--dur-slow) var(--ease-reveal) both;
  animation-delay: var(--d, 0ms);
}

@keyframes hero-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__anim { animation: none; }
}
</style>
