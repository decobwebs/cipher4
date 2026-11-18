<script setup lang="ts">
/** Insights (content C10). Two article cards; on phones they swipe sideways. */
import { insights } from '~/data/home'
</script>

<template>
  <section class="hi c4-section c4-section--paper" aria-labelledby="hi-title">
    <div class="c4-wrap">
      <SectionHeader title-id="hi-title" :eyebrow="insights.eyebrow" :title="insights.title">
        <template #action>
          <C4Button :to="insights.link.to" variant="text">{{ insights.link.label }}</C4Button>
        </template>
      </SectionHeader>
      <ul class="hi__list">
        <li v-for="a in insights.items" :key="a.to" class="hi__item">
          <NuxtLink :to="a.to" class="hi__card">
            <span class="hi__meta"><span>{{ a.sector }}</span><span>{{ a.read }}</span></span>
            <span class="hi__bottom">
              <span class="hi__title">{{ a.title }}</span>
              <span class="hi__date">{{ a.date }}</span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.hi__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(460px, 100%), 1fr));
  gap: var(--s-24);
  list-style: none;
}

.hi__item {
  display: flex;
}

.hi__card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--s-64);
  width: 100%;
  min-height: 320px;
  padding: var(--s-48);
  border-radius: var(--radius-card);
  background: var(--white);
  border: 1px solid var(--line);
  transition: border-color var(--dur-ui) var(--ease-out), box-shadow var(--dur-ui) var(--ease-out);
}

.hi__card:hover {
  border-color: var(--line-2);
  box-shadow: var(--shadow-float);
}

.hi__meta {
  display: flex;
  justify-content: space-between;
  gap: var(--s-16);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slate);
}

.hi__bottom {
  display: flex;
  flex-direction: column;
  gap: var(--s-16);
}

.hi__title {
  max-width: 480px;
  font-size: clamp(24px, 2.3vw, 32px);
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: var(--ink);
}

.hi__date {
  font-size: 15px;
  color: var(--slate);
}

@media (max-width: 767px) {
  .hi__list {
    display: flex;
    gap: var(--s-12);
    margin-inline: calc(-1 * var(--gutter));
    padding: 0 var(--gutter);
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--gutter);
    scrollbar-width: none;
  }

  .hi__list::-webkit-scrollbar {
    display: none;
  }

  .hi__item {
    flex: 0 0 300px;
    scroll-snap-align: start;
  }

  .hi__card {
    gap: var(--s-48);
    min-height: 0;
    padding: var(--s-24);
  }

  .hi__meta {
    font-size: 11px;
  }

  .hi__title {
    font-size: 23px;
    line-height: 1.18;
  }
}
</style>
