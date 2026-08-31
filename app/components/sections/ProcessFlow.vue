<script setup lang="ts">
import { processSteps } from '~/data/process'

/**
 * Engagement flow.
 *
 * Rebuilt light. Two things were wrong with the dark version:
 *
 *  1. It was a navy band in a white site. With the footer going light there
 *     was nothing left for it to belong to.
 *  2. Half the cards did not paint. Each card ran its own `backdrop-filter`
 *     over a `z-index: -1` aura inside an `overflow: hidden` section, while
 *     the reveal directive held `will-change: opacity, transform` on the
 *     parent. Chrome intermittently failed to raster that stack, which is why
 *     the left column came up blank while the right column rendered. Using
 *     the `.glass` primitive over a plain background removes the whole stack
 *     rather than tuning it.
 *
 * The sequence used to be carried by an oversized ghost numeral at 4.5%
 * opacity, which is below the threshold at which anyone reads it as a number.
 * It is now a solid chip, so the order is legible at a glance and the rail
 * is only needed in the single-column layout where it actually connects
 * anything.
 */
</script>

<template>
  <section class="flow section section--subtle section--seam">
    <div class="container">
      <UiSectionHeader
        eyebrow="How we work"
        title="Six steps, and you know what each one gives you"
        lead="Engagements run to a defined sequence. You will know what happens next, roughly how long it takes, and what lands in your hands at the end of it."
      />

      <ol class="rail">
        <li
          v-for="step in processSteps"
          :key="step.number"
          v-reveal
          class="node"
        >
          <div class="glass shine node__card">
            <div class="node__head">
              <!-- The chip is the step label, not a decoration beside one. An
                   earlier pass had it aria-hidden with a "Step 01" eyebrow
                   repeating it in text, which said the same thing twice on
                   screen. The word now lives in the accessible name only. -->
              <span class="node__num">
                <span class="sr-only">Step </span>{{ step.number }}
              </span>
              <span class="node__duration">
                <Icon name="lucide:clock" size="13" />
                {{ step.duration }}
              </span>
            </div>

            <h3 class="node__title">{{ step.title }}</h3>
            <p class="node__desc">{{ step.description }}</p>

            <p class="node__deliverable">
              <Icon name="lucide:package-check" size="16" />
              <span>{{ step.deliverable }}</span>
            </p>
          </div>
        </li>
      </ol>

      <div v-reveal class="flow__cta">
        <NuxtLink to="/solutions#process" class="btn btn--accent">
          Engagement models and support tiers
          <Icon name="lucide:arrow-right" size="18" />
        </NuxtLink>
        <NuxtLink to="/contact" class="btn btn--secondary">
          Start at step one
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* --- The grid ------------------------------------------------------------ */

.rail {
  display: grid;
  gap: var(--space-5);
  margin-block-start: var(--space-12);
}

@media (min-width: 48rem) {
  .rail { grid-template-columns: repeat(2, 1fr); }
}

/* Three across, so six steps land as two clean rows with no orphan cell. */
@media (min-width: 72rem) {
  .rail {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
  }
}

.node {
  display: flex;
  position: relative;
}

/* The rail line, single column only. Above 48rem the grid wraps and a
   vertical line would connect cards that do not follow each other. */
.node::before {
  content: '';
  position: absolute;
  inset-block-start: 3.25rem;
  inset-inline-start: 1.6875rem;
  width: 2px;
  height: calc(100% + var(--space-5));
  background: linear-gradient(
    to bottom,
    var(--c4-signal-500),
    var(--border-default)
  );
  opacity: 0.4;
}

.node:last-child::before,
.node:only-child::before {
  display: none;
}

@media (min-width: 48rem) {
  .node::before { display: none; }
}

/* --- The card ------------------------------------------------------------ */

.node__card {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  transition:
    transform var(--dur-base) var(--ease-out),
    border-color var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out);
}

.node__card:hover {
  transform: translateY(-3px);
  border-color: var(--border-accent);
  box-shadow: var(--shadow-3);
}

.node__head {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-block-end: var(--space-4);
}

/* The step number, stated rather than implied. The old ghost numeral sat at
   4.5% opacity behind the text, which is not a number anyone reads. */
.node__num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 3.375rem;
  height: 3.375rem;
  border-radius: var(--radius-md);
  background: var(--grad-accent, var(--c4-signal-500));
  color: var(--text-on-accent);
  font-family: var(--font-heading);
  font-size: 1.375rem;
  font-weight: var(--fw-bold);
  font-variant-numeric: tabular-nums;
  letter-spacing: var(--tracking-tight);
}

.node__duration {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 0.125rem var(--space-3);
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-default);
  background: var(--surface-sunken);
  font-size: var(--fs-xs);
  color: var(--text-secondary);
  white-space: nowrap;
}

.node__title {
  position: relative;
  z-index: 3;
  font-size: var(--fs-h4);
  font-weight: var(--fw-semibold);
}

.node__desc {
  position: relative;
  z-index: 3;
  margin-block-start: var(--space-3);
  margin-block-end: var(--space-5);
  font-size: var(--fs-sm);
  line-height: var(--lh-compact);
  color: var(--text-secondary);
}

/* Pushed to the bottom so the deliverable line sits on one baseline across a
   row of cards whose descriptions run to different lengths. */
.node__deliverable {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-3);
  align-items: start;
  margin-block-start: auto;
  padding-block-start: var(--space-4);
  border-block-start: 1px solid var(--border-default);
  font-size: var(--fs-sm);
  line-height: var(--lh-snug);
  color: var(--text-accent);
}

.node__deliverable > :first-child { margin-block-start: 0.15em; }

.flow__cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-block-start: var(--space-10);
}
</style>
