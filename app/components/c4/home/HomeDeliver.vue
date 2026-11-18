<script setup lang="ts">
/**
 * How we deliver (content C8). Desktop: six stages across, joined by an
 * amber track (Home-Desktop). Phones: a vertical timeline (Home-Mobile).
 *
 * Shown in its finished state. The scroll-linked version (the section
 * holding while the road drives forward and each stage lights up) is a
 * Phase 6 animation.
 */
import { deliver } from '~/data/home'
</script>

<template>
  <section class="hd c4-section c4-section--paper" aria-labelledby="hd-title">
    <div class="c4-wrap">
      <SectionHeader title-id="hd-title" :eyebrow="deliver.eyebrow" :title="deliver.title" :lead="deliver.lead">
        <template #action>
          <C4Button :to="deliver.link.to" variant="text">{{ deliver.link.label }}</C4Button>
        </template>
      </SectionHeader>

      <ol class="hd__stages">
        <li v-for="(s, i) in deliver.stages" :key="s.n" class="hd__stage">
          <span class="hd__track" aria-hidden="true">
            <span class="hd__dot" />
            <span v-if="i < deliver.stages.length - 1" class="hd__line" />
          </span>
          <div class="hd__body">
            <C4Icon :name="s.icon" :size="40" :delay="i * 0.2" class="hd__icon" />
            <h3 class="hd__title"><span class="hd__n">{{ s.n }}</span> {{ s.title }}</h3>
            <p class="hd__text">{{ s.text }}</p>
            <p class="hd__receive">
              <span class="hd__label">{{ deliver.receiveLabel }}<span class="c4-sr-only">:</span></span>
              {{ s.receive }}
            </p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.hd__stages {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(190px, 100%), 1fr));
  row-gap: var(--s-48);
  list-style: none;
}

.hd__stage {
  display: flex;
  flex-direction: column;
  gap: var(--s-16);
  padding-right: var(--s-24);
}

.hd__track {
  display: flex;
  align-items: center;
}

.hd__dot {
  flex: none;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--amber);
  box-shadow: 0 0 0 5px rgba(245, 165, 36, 0.22);
}

.hd__line {
  flex: 1;
  height: 2px;
  margin-right: calc(-1 * var(--s-24));
  background: var(--amber);
}

.hd__body {
  display: flex;
  flex-direction: column;
  gap: var(--s-16);
}

.hd__title {
  font-size: 20px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.hd__n {
  font-variant-numeric: tabular-nums;
}

.hd__text {
  font-size: 15px;
  line-height: 1.55;
  color: var(--slate);
}

.hd__receive {
  padding-top: var(--s-12);
  border-top: 1px solid var(--line);
  font-size: 14px;
  line-height: 1.5;
  color: var(--ink-2);
}

.hd__label {
  display: block;
  margin-bottom: var(--s-4);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slate);
}

/* Phones: a vertical timeline, dot and line on the left. */
@media (max-width: 767px) {
  .hd__stages {
    display: flex;
    flex-direction: column;
    row-gap: 0;
  }

  .hd__stage {
    display: grid;
    grid-template-columns: 20px 1fr;
    gap: var(--s-16);
    padding-right: 0;
  }

  .hd__track {
    flex-direction: column;
    align-items: center;
  }

  .hd__dot {
    width: 12px;
    height: 12px;
    margin-top: var(--s-4);
    box-shadow: 0 0 0 4px rgba(245, 165, 36, 0.22);
  }

  .hd__line {
    width: 2px;
    height: auto;
    margin-right: 0;
  }

  .hd__body {
    gap: var(--s-8);
    padding-bottom: var(--s-32);
  }

  .hd__icon {
    display: none;
  }

  .hd__title {
    font-size: 19px;
  }

  .hd__receive {
    padding-top: var(--s-8);
  }
}
</style>
