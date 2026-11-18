<script setup lang="ts">
/**
 * Services (content C4). Desktop: six cards in a grid (Home-Desktop).
 * Phones: the same links as a compact list (Home-Mobile). One set of
 * markup, restyled, so nothing is duplicated for screen readers.
 */
import { services } from '~/data/home'

// Choreography 04: one stack deals out six (six capabilities, one partner).
const grid = useTemplateRef<HTMLElement>('grid')
useDeal(grid)
</script>

<template>
  <section class="hs c4-section c4-section--paper" aria-labelledby="hs-title">
    <div class="c4-wrap">
      <SectionHeader
        layout="split"
        title-id="hs-title"
        :eyebrow="services.eyebrow"
        :title="services.title"
        :lead="services.lead"
      />

      <ul ref="grid" v-m="'deal'" class="hs__grid">
        <li v-for="(s, i) in services.items" :key="s.to" class="m-card" :style="{ '--i': i }">
          <NuxtLink :to="s.to" class="hs__card">
            <C4Icon :name="s.icon" :size="52" :delay="i * 0.2" class="hs__icon" />
            <span class="hs__n" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="hs__text">
              <span class="hs__title">{{ s.title }}</span>
              <span class="hs__line">{{ s.line }}</span>
            </span>
            <span class="hs__cta" aria-hidden="true">
              <span>{{ services.cta }}</span><C4Glyph name="arrow" class="hs__arrow" />
            </span>
          </NuxtLink>
        </li>
      </ul>

      <C4Button :to="services.all.to" variant="text" class="hs__all">{{ services.all.label }}</C4Button>
    </div>
  </section>
</template>

<style scoped>
.hs__grid {
  display: grid;
  /* Three across on desktop, two on tablets. */
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: var(--s-24);
  list-style: none;
}

.hs__grid > li {
  display: flex;
}

/* Desktop card */
.hs__card {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr auto;
  gap: var(--s-24);
  width: 100%;
  padding: var(--s-32);
  border-radius: var(--radius-card);
  background: var(--white);
  border: 1px solid var(--line);
  transition: border-color var(--dur-ui) var(--ease-out), box-shadow var(--dur-ui) var(--ease-out), transform var(--dur-ui) var(--ease-out);
}

.hs__card:hover {
  border-color: var(--line-2);
  box-shadow: var(--shadow-float);
  transform: translateY(-2px);
}

.hs__icon {
  grid-column: 1;
  grid-row: 1;
}

.hs__n {
  grid-column: 2;
  grid-row: 1;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  color: var(--grey);
}

.hs__text {
  grid-column: 1 / -1;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  gap: var(--s-12);
}

.hs__title {
  font-size: 24px;
  line-height: 1.25;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.hs__line {
  font-size: 16px;
  line-height: 1.6;
  color: var(--slate);
}

.hs__cta {
  grid-column: 1 / -1;
  grid-row: 3;
  display: inline-flex;
  align-items: center;
  gap: var(--s-8);
  font-size: 15px;
  font-weight: 500;
  color: var(--indigo);
}

.hs__arrow {
  color: var(--amber);
  transition: transform var(--dur-ui) var(--ease-out);
}

.hs__card:hover .hs__arrow {
  transform: translateX(3px);
}

/* "All services" appears on phones only (Home-Mobile board). */
.hs__all {
  display: none;
}

/* Phones: compact rows, icon, title and line, arrow. */
@media (max-width: 767px) {
  .hs__grid {
    display: block;
  }

  .hs__card {
    grid-template-columns: 40px 1fr 16px;
    grid-template-rows: auto;
    align-items: center;
    gap: var(--s-16);
    padding: var(--s-16) 0;
    border: 0;
    border-top: 1px solid var(--line);
    border-radius: 0;
    background: none;
  }

  .hs__card:hover {
    box-shadow: none;
    transform: none;
  }

  .hs__icon {
    width: 36px;
    height: 36px;
  }

  .hs__n {
    display: none;
  }

  .hs__text {
    grid-column: 2;
    grid-row: 1;
    gap: var(--s-4);
  }

  .hs__title {
    font-size: 17px;
  }

  .hs__line {
    font-size: 14px;
    line-height: 1.5;
  }

  .hs__cta {
    grid-column: 3;
    grid-row: 1;
  }

  .hs__cta > span {
    display: none;
  }

  .hs__all {
    display: inline-flex;
    margin-top: var(--s-16);
  }
}
</style>
