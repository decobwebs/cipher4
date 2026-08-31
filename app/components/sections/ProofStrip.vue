<script setup lang="ts">
import { publishedClients } from '~/data/projects'

/**
 * The client band.
 *
 * This used to also carry a four-up "facts" panel: 3 offices, 1 hour 24/7,
 * 4 sectors, since 2023. It was removed, and the reasoning is worth keeping
 * because it is easy to re-add by reflex:
 *
 *   - "3 offices" is not a differentiator. Every company has offices.
 *   - "Since 2023" is actively negative to a buyer assessing delivery risk.
 *   - "4 sectors" restated the eyebrow sitting directly above it.
 *   - "1 hour, 24/7" is the only one with weight, and it belongs where
 *     someone is comparing support tiers, not next to the hero.
 *
 * What remains is the one thing that does the work at this position: other
 * organisations' marks. Gated on permissionGranted, so nothing appears here
 * without a recorded decision.
 */

/** Renders only clients with written permission on file. */
const clients = computed(() => publishedClients())
</script>

<template>
  <section class="section section--sm proof">
    <div class="container container--wide">
      <!-- Client logos. A moving loop rather than a static grid — the sector
           pattern allows it provided it is pausable, keyboard-operable and
           stopped under reduced motion, all of which UiLogoLoop implements.
           Renders only where permissionGranted is true, so this is empty
           until logos and written permission both exist. -->
      <template v-if="clients.length">
        <!-- The label sits OUTSIDE the panel. Inside, at eyebrow weight, it
             read as a caption on the glass; out here it is a statement the
             logos then evidence.

             Wording set by Cipher4. -->
        <p v-reveal class="proof__clients-label">
          Trusted by industry leaders
        </p>

        <div v-reveal class="glass shine proof__clients">
          <UiLogoLoop
            :logos="clients.map((c) => ({ src: c.logo, alt: c.name }))"
            :logo-height="56"
            :gap="128"
            :speed="30"
            class="proof__loop"
          />
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.proof {
  position: relative;
  padding-block: var(--section-y-sm);
}

/* --- Client logos ------------------------------------------------------- */

.proof__clients {
  position: relative;
  /* space-8 all round left the panel taller than the row of marks inside it
     on a phone, so it read as an empty box with something small in the
     middle. It scales with the viewport now. */
  padding: var(--space-5) 0;
  border-radius: var(--radius-lg);
  text-align: center;
}

@media (min-width: 48rem) {
  .proof__clients {
    padding: var(--space-8) 0;
    border-radius: var(--radius-xl);
  }
}

/* Glass content sits above the rim and specular layers. */
.proof__clients > * {
  position: relative;
  z-index: 3;
}

.proof__clients-label {
  /* A statement, not a caption. Sentence case at heading weight rather than
     tracked-out uppercase micro-type — it has to carry on its own now that it
     is no longer sitting on the panel. */
  margin-block-end: var(--space-6);
  font-family: var(--font-heading);
  font-size: var(--fs-h3);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--tracking-tight);
  line-height: var(--lh-heading);
  color: var(--text-primary);
  text-align: center;
}

.proof__loop {
  margin-block-start: var(--space-6);
  /* The loop sits ON the glass panel, so its edge fade has to dissolve
     into the glass tint rather than the page behind it — fading to page white
     would leave two visible pale bands inside the panel. */
  --ll-fade: transparent;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}
</style>
