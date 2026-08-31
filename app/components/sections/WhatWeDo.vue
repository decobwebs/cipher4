<script setup lang="ts">
import { solutions } from '~/data/solutions'

/**
 * What we do — three alternating rows.
 *
 * Replaces the three-card grid. A card gives each capability a title and one
 * line; these are the three things Cipher4 sells, and a buyer's question is
 * "which of these is my problem". An alternating row has room for the summary
 * that answers it, and the illustration does the work a 48px icon cannot.
 *
 * THE MISSING THIRD ILLUSTRATION
 * ------------------------------
 * Two of the three illustrations exist and match each other — same set, same
 * illustrator, recoloured onto the brand palette. The third is still to come.
 *
 * Rather than leave a hole or drop in a mismatched stand-in, a row without an
 * illustration composes one: the capability's own icon on the same tinted disc,
 * at the same size and in the same position. It reads as a deliberate variant
 * rather than a gap, and it disappears the moment `illustration` is set in
 * solutions.ts — no template change.
 *
 * Mixing illustration styles was the specific thing to avoid here. The image
 * brief records it as what made the old site read as assembled rather than
 * designed, and a stand-in from a different set would have reintroduced it.
 */
</script>

<template>
  <section class="section section--subtle whatwedo">
    <div class="container">
      <UiSectionHeader
        eyebrow="What we do"
        title="Three things, done properly"
        lead="Most of our work is one of these. Many engagements end up being two."
      />

      <div class="whatwedo__rows">
        <article
          v-for="(solution, i) in solutions"
          :key="solution.slug"
          class="whatwedo__row"
          :class="{ 'whatwedo__row--flip': i % 2 === 1 }"
        >
          <div v-reveal="i % 2 === 1 ? 'right' : 'left'" class="whatwedo__media">
            <NuxtImg
              v-if="solution.illustration"
              :src="solution.illustration"
              alt=""
              width="1100"
              height="1100"
              sizes="100vw md:44vw"
              format="webp"
              loading="lazy"
              data-float
              class="whatwedo__art"
            />

            <!-- Composed fallback: same disc, same footprint, same rhythm. -->
            <span v-else class="whatwedo__art whatwedo__art--composed" aria-hidden="true">
              <span class="whatwedo__disc" />
              <Icon :name="solution.icon" class="whatwedo__glyph" />
            </span>
          </div>

          <div v-reveal="i % 2 === 1 ? 'left' : 'right'" class="whatwedo__body">
            <p class="eyebrow">{{ solution.shortTitle }}</p>
            <h3 class="whatwedo__title">{{ solution.teaser }}</h3>
            <p class="whatwedo__summary">{{ solution.summary }}</p>

            <NuxtLink :to="`/solutions/${solution.slug}`" class="btn btn--secondary whatwedo__cta">
              <span>{{ solution.shortTitle }} in detail</span>
              <Icon name="lucide:arrow-right" size="16" />
            </NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.whatwedo__rows {
  display: grid;
  /* Generous, and larger than the gap inside a row — so the eye groups each
     illustration with its own copy rather than with the row below it. */
  gap: clamp(4rem, 2rem + 7vw, 9rem);
  margin-block-start: var(--space-16);
}

.whatwedo__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(2.5rem, 1rem + 6vw, 7rem);
  align-items: center;
}

/* The alternation. `order` on the media only, so the DOM keeps illustration
   before copy and a screen reader always hears them in the same sequence
   regardless of which side the picture is on. */
.whatwedo__row--flip .whatwedo__media {
  order: 2;
}

@media (max-width: 60rem) {
  .whatwedo__row {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-6);
  }

  /* Stacked, the illustration always leads. Alternating a single column
     destroys the rhythm rather than creating it. */
  .whatwedo__row--flip .whatwedo__media {
    order: 0;
  }
}

/* --- Media -------------------------------------------------------------- */

.whatwedo__media {
  display: flex;
  justify-content: center;
}

.whatwedo__art {
  display: block;
  width: 100%;
  max-width: 30rem;
  height: auto;
}

/* Composed fallback for a capability with no illustration yet. */
.whatwedo__art--composed {
  position: relative;
  aspect-ratio: 1 / 1;
  display: grid;
  place-items: center;
}

.whatwedo__disc {
  position: absolute;
  inset: 12%;
  border-radius: 50%;
  /* The same pale blue disc the illustrations sit on, built from tokens. */
  background:
    radial-gradient(circle at 38% 32%, rgba(245, 165, 36, 0.12), transparent 62%),
    var(--c4-indigo-100);
}

.whatwedo__glyph {
  position: relative;
  width: 34%;
  height: 34%;
  color: var(--c4-indigo-700);
}

/* --- Body --------------------------------------------------------------- */

.whatwedo__body {
  display: grid;
  gap: var(--space-5);
  align-content: center;
  justify-items: start;
}

.whatwedo__title {
  font-size: var(--fs-h2);
  font-weight: var(--fw-semibold);
  line-height: var(--lh-heading);
  letter-spacing: var(--tracking-tight);
  max-width: 20ch;
}

.whatwedo__summary {
  color: var(--text-secondary);
  line-height: var(--lh-body);
  max-width: var(--measure);
}

.whatwedo__cta {
  margin-block-start: var(--space-2);
}

/* --- Motion --------------------------------------------------------------
   The illustration drifts slowly against the scroll while its copy stays put.
   Scroll-driven, so it runs on the compositor with no JavaScript, and it is
   additive: `data-float` only moves something already visible, so a browser
   without scroll timelines simply gets a still illustration.
   ---------------------------------------------------------------------- */

@keyframes whatwedo-float {
  from { transform: translate3d(0, 2.2rem, 0); }
  to   { transform: translate3d(0, -2.2rem, 0); }
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    [data-float] {
      animation: whatwedo-float linear both;
      animation-timeline: view();
      animation-range: cover 0% cover 100%;
      will-change: transform;
    }
  }
}
</style>
