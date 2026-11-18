<script setup lang="ts">
/**
 * Client strip (content C2). Logos are white artwork on transparent, shown
 * in one grey tone with a CSS filter so they carry equal weight.
 *
 * Desktop: one row, spread across the width (Home-Desktop board).
 * Phones: one strip you swipe sideways. The board's version scrolls by
 * itself in a loop; endless automatic motion would need a pause control
 * (WCAG 2.2.2), so here the visitor moves it.
 */
import { clients } from '~/data/home'

// Display heights from the boards: desktop per logo, phones 34 px each.
const deskH: Record<string, number> = {
  'Reliant Anchor': 44, 'Harbours360': 48, 'Lighthouse Maritime Agency': 46, 'Zeal Global Resources': 46,
  'AA Heritage Navigation': 40, 'Quick Trips': 36, 'Lustre by Kal': 50, 'Reliant Anchor Foundation': 42,
}
</script>

<template>
  <section class="hc" aria-labelledby="hc-label">
    <div class="c4-wrap hc__inner">
      <h2 id="hc-label" class="hc__label">{{ clients.label }}</h2>
      <div class="hc__scroller" role="region" aria-labelledby="hc-label" tabindex="0">
        <ul class="hc__list">
          <li v-for="l in clients.logos" :key="l.name" class="hc__item">
            <img
              :src="l.src"
              :alt="l.name"
              :width="l.w"
              :height="l.h"
              :style="{ '--h': `${deskH[l.name] ?? 44}px` }"
              class="hc__logo"
              loading="lazy"
              decoding="async"
            >
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hc {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: var(--white);
}

.hc__inner {
  display: flex;
  flex-direction: column;
  gap: var(--s-32);
  padding-block: var(--s-48);
}

.hc__label {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--slate);
}

.hc__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-32) var(--s-48);
  list-style: none;
}

.hc__logo {
  height: var(--h);
  width: auto;
  filter: brightness(0);
  opacity: 0.5;
}

.hc__scroller:focus-visible {
  outline-offset: 6px;
}

/* Phones: one swipeable strip, edges softly faded. */
@media (max-width: 767px) {
  .hc__inner {
    padding-inline: 0;
    padding-block: var(--s-32);
    gap: var(--s-24);
  }

  .hc__label {
    padding-inline: var(--gutter);
    font-size: 11px;
  }

  .hc__scroller {
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
    mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  }

  .hc__scroller::-webkit-scrollbar {
    display: none;
  }

  .hc__list {
    flex-wrap: nowrap;
    justify-content: flex-start;
    gap: var(--s-48);
    width: max-content;
    padding-inline: var(--gutter);
  }

  .hc__item {
    scroll-snap-align: center;
  }

  .hc__logo {
    height: 34px;
    opacity: 0.55;
  }
}
</style>
