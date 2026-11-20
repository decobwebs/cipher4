<script setup lang="ts">
/**
 * About (content G1). No board of its own: the service header, then the
 * mission and vision as large statements (the home mission's style), the
 * values as a card grid, the three commitments as numbered rows, and the
 * company facts as a table.
 */
import { aboutPage as page } from '~/data/about'

definePageMeta({ layout: 'c4' })
useSeoMeta({ title: page.seo.title, description: page.seo.description, ogTitle: page.seo.title, ogDescription: page.seo.description })

const crumbs = [{ label: 'Home', to: '/' }, { label: 'About' }]
</script>

<template>
  <div>
    <PageHero :crumbs="crumbs" :eyebrow="page.eyebrow" :title="page.title" :lead="page.lead" :drawing="{ icon: 'accountability', code: 'C4-050' }" :text-width="720" />

    <!-- Mission and vision -->
    <section class="c4-section c4-section--paper" aria-labelledby="ab-mission">
      <div class="c4-wrap ab-mv">
        <!-- The mission and vision rise from behind a clean edge, like the hero. -->
        <div class="ab-mv__row">
        <div v-m="'lines'" class="ab-mv__block">
          <Eyebrow class="m-after" style="--i: -3">{{ page.mission.label }}</Eyebrow>
          <h2 id="ab-mission" class="c4p-statement"><span class="m-mask"><span class="m-line">{{ page.mission.statement }}</span></span></h2>
          <p class="c4-lead m-after">{{ page.mission.text }}</p>
        </div>
        <MissionDiagram class="ab-mv__diagram" />
        </div>
        <div v-m="'lines'" class="ab-mv__block ab-mv__block--vision">
          <Eyebrow class="m-after" style="--i: -3">{{ page.vision.label }}</Eyebrow>
          <p class="ab-vision"><span class="m-mask"><span class="m-line">{{ page.vision.statement }}</span></span></p>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="c4-section c4-section--white" aria-labelledby="ab-values">
      <div class="c4-wrap">
        <SectionHeader title-id="ab-values" :eyebrow="page.values.label" :title="page.values.title" />
        <ul v-m="'cards'" class="c4p-grid-3">
          <li v-for="(v, i) in page.values.items" :key="v.title" class="c4-card ab-value m-card" :style="{ '--i': i }">
            <span class="c4p-n">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="c4p-link-card__title">{{ v.title }}</h3>
            <p class="c4p-link-card__text">{{ v.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- How we work -->
    <section class="c4-section c4-section--paper" aria-labelledby="ab-how">
      <div class="c4-wrap c4p-split">
        <div v-m="'rise'" class="c4p-split__head">
          <Eyebrow>{{ page.how.label }}</Eyebrow>
          <h2 id="ab-how" class="c4-h2">{{ page.how.title }}</h2>
        </div>
        <!-- Three commitments, each signed off (the meaning of Choreography 07). -->
        <ol v-m="'sign'" class="c4p-rows">
          <li v-for="(h, i) in page.how.items" :key="h.title" class="ab-commit m-item" :style="{ '--i': i }">
            <span class="c4p-n">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="ab-commit__body">
              <h3 class="c4p-row-title ab-commit__title">{{ h.title }}<CheckTick /></h3>
              <p class="c4p-row-text">{{ h.text }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- In-house and facts -->
    <section class="c4-section c4-section--white" aria-labelledby="ab-inhouse">
      <div v-m="'rise'" class="c4-wrap ab-two">
        <div class="ab-two__col">
          <h2 id="ab-inhouse" class="c4-h3 ab-two__title">{{ page.inHouse.title }}</h2>
          <ul class="c4p-pills">
            <li v-for="x in page.inHouse.items" :key="x">{{ x }}</li>
          </ul>
        </div>
        <div class="ab-two__col">
          <h2 class="c4-h3 ab-two__title">{{ page.facts.title }}</h2>
          <dl class="c4p-facts">
            <template v-for="r in page.facts.rows" :key="r.label">
              <dt>{{ r.label }}</dt>
              <dd>{{ r.value }}</dd>
            </template>
          </dl>
        </div>
      </div>
    </section>

    <!-- Community -->
    <section class="c4-section c4-section--paper ab-community" aria-labelledby="ab-community">
      <div class="c4-wrap">
        <!-- Lines grow up into a light (the meaning of Choreography 11). -->
        <div v-m="'grow'" class="c4-card ab-community__card">
          <div class="m-grow" aria-hidden="true">
            <span v-for="(h, k) in [36, 60, 48, 72]" :key="k" :style="{ '--h': `${h}px`, '--i': k }" />
          </div>
          <div class="ab-community__copy m-item" style="--i: 1">
            <Eyebrow>{{ page.community.title }}</Eyebrow>
            <p id="ab-community" class="ab-community__text">{{ page.community.text }}</p>
          </div>
          <C4Button :to="page.community.link.to" variant="secondary" arrow class="m-item" style="--i: 2">{{ page.community.link.label }}</C4Button>
        </div>
      </div>
    </section>

    <ClosingBand />
  </div>
</template>

<style scoped>
.ab-mv {
  display: flex;
  flex-direction: column;
  gap: var(--s-96);
}

/* Mission on the left, its diagram on the right (no empty column). */
.ab-mv__row {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: var(--s-64);
  align-items: center;
}

@media (max-width: 1024px) {
  .ab-mv__row {
    grid-template-columns: 1fr;
    gap: var(--s-32);
  }
}

.ab-mv__block {
  display: flex;
  flex-direction: column;
  gap: var(--s-24);
}

.ab-mv__block--vision {
  padding-top: var(--s-64);
  border-top: 1px solid var(--line-2);
}

.ab-vision {
  max-width: 920px;
  font-size: clamp(26px, 2.8vw, 40px);
  line-height: 1.2;
  letter-spacing: -0.03em;
  color: var(--indigo);
  text-wrap: balance;
}

.ab-value {
  display: flex;
  flex-direction: column;
  gap: var(--s-16);
  height: 100%;
  padding: var(--s-32);
}

.ab-commit {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: var(--s-24);
  align-items: baseline;
}

.ab-commit__title {
  display: flex;
  align-items: center;
  gap: var(--s-12);
}

.ab-commit__body {
  display: flex;
  flex-direction: column;
  gap: var(--s-12);
}

.ab-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s-96);
  align-items: start;
}

.ab-two__title {
  margin-bottom: var(--s-32);
}

.ab-community {
  padding-bottom: var(--s-96);
}

.ab-community__card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-48);
  padding: var(--s-48);
}

.ab-community__copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--s-16);
  max-width: 760px;
}

.ab-community__text {
  font-size: 23px;
  line-height: 1.45;
  letter-spacing: -0.015em;
}

@media (max-width: 1100px) {
  .ab-two {
    grid-template-columns: 1fr;
    gap: var(--s-64);
  }
}

@media (max-width: 767px) {
  .ab-mv {
    gap: var(--s-64);
  }

  .ab-mv__block--vision {
    padding-top: var(--s-48);
  }

  .ab-value {
    padding: var(--s-24);
  }

  .ab-commit {
    grid-template-columns: 40px 1fr;
    gap: var(--s-12);
  }

  .ab-community__card {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--s-24);
    padding: var(--s-24);
  }

  .ab-community__text {
    font-size: 19px;
  }
}
</style>
