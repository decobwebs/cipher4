<script setup lang="ts">
/**
 * Services overview (content D1). No board of its own: built from the
 * Page-Service template (header, cards, split sections) and the home
 * page's services cards.
 *
 * The sector selector changes the line on every service card. "All" shows
 * each service's general line. The words live once, in data/services.ts
 * (the same lines as each service page's hero and "In your sector").
 */
import {
  services, sectorRows, servicesOverview as page, serviceNames, delivery, waysToWork, support,
  type SectorKey,
} from '~/data/services'

definePageMeta({ layout: 'c4' })
useSeoMeta({ title: page.seo.title, description: page.seo.description, ogTitle: page.seo.title, ogDescription: page.seo.description })

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Services' }]

const tabs: { key: SectorKey | 'all'; label: string }[] = [
  { key: 'all', label: page.selector.all },
  ...sectorRows.map((r) => ({ key: r.key, label: r.title })),
]
const sector = ref<SectorKey | 'all'>('all')

// One stack deals out six (as on the home page: six capabilities, one partner).
const cards = useTemplateRef<HTMLElement>('cards')
useDeal(cards)

const lineFor = (s: (typeof services)[number]) =>
  sector.value === 'all' ? s.lead : s.sectors?.[sector.value] ?? s.lead
</script>

<template>
  <div>
    <PageHero :crumbs="crumbs" :eyebrow="page.eyebrow" :title="page.title" :lead="page.lead" road="service" :text-width="680">
      <template #actions>
        <C4Button :to="page.primary.to" arrow>{{ page.primary.label }}</C4Button>
        <C4Button :to="page.secondary.to" variant="secondary">{{ page.secondary.label }}</C4Button>
      </template>
    </PageHero>

    <!-- The six services, with the sector selector -->
    <section class="c4-section c4-section--paper" aria-labelledby="so-list">
      <div class="c4-wrap">
        <h2 id="so-list" class="c4-sr-only">{{ page.eyebrow }}</h2>
        <div v-m="'rise'" class="so-select" role="group" :aria-label="page.selector.label">
          <span class="so-select__label" aria-hidden="true">{{ page.selector.label }}</span>
          <div class="so-select__tabs">
            <button
              v-for="t in tabs"
              :key="t.key"
              type="button"
              class="so-tab"
              :aria-pressed="sector === t.key"
              @click="sector = t.key"
            >{{ t.label }}</button>
          </div>
        </div>

        <ul ref="cards" v-m="'deal'" class="so-cards">
          <li v-for="(s, i) in services" :key="s.slug" class="m-card" :style="{ '--i': i }">
            <NuxtLink :to="`/services/${s.slug}`" class="c4-card c4p-link-card so-card">
              <C4Icon :name="s.icon" :size="52" :delay="i * 0.15" />
              <span class="so-card__head">
                <span class="c4p-link-card__title">{{ serviceNames[s.slug] }}</span>
                <span class="so-card__short">{{ s.title }}</span>
              </span>
              <span class="c4p-link-card__text so-card__line" aria-live="polite">{{ lineFor(s) }}</span>
              <span class="c4p-arrow">Explore<C4Glyph name="arrow" /></span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <RoadStrip />

    <!-- How we deliver: each stage checked off like a manifest. -->
    <section id="delivery" class="c4-section c4-section--white so-delivery" aria-labelledby="so-delivery">
      <div class="c4-wrap">
        <SectionHeader title-id="so-delivery" :eyebrow="delivery.eyebrow" :title="delivery.title" :lead="delivery.lead" />
        <table v-m="'manifest'" class="so-table">
          <thead>
            <tr>
              <th scope="col"><span class="c4-sr-only">Stage</span></th>
              <th scope="col">{{ delivery.columns.duration }}</th>
              <th scope="col">{{ delivery.columns.happens }}</th>
              <th scope="col">{{ delivery.columns.receive }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(st, i) in delivery.stages" :key="st.n" class="m-row" :style="{ '--i': i }">
              <th scope="row">
                <span class="so-stage">
                  <C4Icon :name="st.icon" :size="40" :delay="i * 0.12" class="so-stage__icon" />
                  <span class="c4p-n">{{ st.n }}</span>
                  <span class="so-stage__title">{{ st.title }}</span>
                </span>
              </th>
              <td :data-label="delivery.columns.duration" class="so-dur">{{ st.duration }}</td>
              <td :data-label="delivery.columns.happens">{{ st.happens }}</td>
              <td :data-label="delivery.columns.receive" class="so-receive">{{ st.receive }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Ways to work with us -->
    <section class="c4-section c4-section--paper" aria-labelledby="so-ways">
      <div class="c4-wrap">
        <SectionHeader title-id="so-ways" :title="waysToWork.title" />
        <ul v-m="'cards'" class="c4p-grid-2">
          <li v-for="(w, i) in waysToWork.items" :key="w.title" class="c4-card so-way m-card" :style="{ '--i': i }">
            <span class="c4p-n">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="c4p-link-card__title">{{ w.title }}</h3>
            <p class="c4p-link-card__text">{{ w.text }}</p>
            <p class="so-way__best"><span class="so-way__label">{{ waysToWork.bestFor }}</span> {{ w.best }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- Support -->
    <section class="c4-section c4-section--white" aria-labelledby="so-support">
      <div class="c4-wrap c4p-split">
        <div v-m="'rise'" class="c4p-split__head">
          <h2 id="so-support" class="c4-h2">{{ support.title }}</h2>
          <p class="c4-lead">{{ support.lead }}</p>
        </div>
        <ul v-m="'rise'" class="so-tiers">
          <li v-for="t in support.tiers" :key="t.name" class="c4-card so-tier">
            <h3 class="so-tier__name">{{ t.name }}</h3>
            <dl class="so-tier__terms">
              <div><dt>{{ support.labels.response }}</dt><dd>{{ t.response }}</dd></div>
              <div><dt>{{ support.labels.cover }}</dt><dd>{{ t.cover }}</dd></div>
              <div><dt>{{ support.labels.onSite }}</dt><dd>{{ t.onSite }}</dd></div>
            </dl>
            <ul class="c4p-dots">
              <li v-for="x in t.items" :key="x">{{ x }}</li>
            </ul>
          </li>
        </ul>
      </div>
    </section>

    <ClosingBand />
  </div>
</template>

<style scoped>
/* Sector selector */
.so-select {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-16) var(--s-24);
  margin-bottom: var(--s-48);
}

.so-select__label {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--slate);
}

.so-select__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-4);
  padding: var(--s-4);
  border-radius: var(--radius-pill);
  background: var(--mist);
}

.so-tab {
  min-height: 44px;
  padding: 0 var(--s-16);
  border-radius: var(--radius-pill);
  font-size: 15px;
  color: var(--slate);
  transition: background-color var(--dur-ui) var(--ease-out), color var(--dur-ui) var(--ease-out);
}

.so-tab:hover {
  color: var(--ink);
}

.so-tab[aria-pressed='true'] {
  background: var(--white);
  box-shadow: 0 2px 8px rgba(16, 32, 104, 0.1);
  font-weight: 600;
  color: var(--ink);
}

/* Service cards */
.so-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--s-24);
  list-style: none;
}

.so-card {
  min-height: 420px;
}

.so-card__head {
  display: flex;
  flex-direction: column;
  gap: var(--s-8);
}

.so-card__short {
  font-size: 17px;
  line-height: 1.45;
  color: var(--indigo);
}

.so-card__line {
  padding-top: var(--s-24);
  border-top: 1px solid var(--line);
}

/* Delivery table */
.so-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.so-table thead th {
  padding: 0 var(--s-24) var(--s-16) 0;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slate);
}

.so-table tbody tr {
  border-top: 1px solid var(--line);
}

.so-table tbody tr:last-child {
  border-bottom: 1px solid var(--line);
}

.so-table td,
.so-table tbody th {
  padding: var(--s-32) var(--s-24) var(--s-32) 0;
  vertical-align: top;
  font-size: 17px;
  line-height: 1.6;
  color: var(--slate);
}

.so-table th:first-child {
  width: 26%;
}

.so-table th:nth-child(2) {
  width: 15%;
}

.so-stage {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: var(--s-4) var(--s-16);
  align-items: center;
  font-weight: 400;
}

.so-stage__icon {
  grid-row: span 2;
}

.so-stage__title {
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--ink);
}

.so-dur {
  font-family: var(--font-mono);
  font-size: 14px !important;
  letter-spacing: 0.04em;
  color: var(--ink-2) !important;
}

.so-receive {
  color: var(--ink-2) !important;
}

/* Ways to work */
.so-way {
  display: flex;
  flex-direction: column;
  gap: var(--s-16);
  padding: var(--s-48);
}

.so-way__best {
  margin-top: auto;
  padding-top: var(--s-24);
  border-top: 1px solid var(--line);
  font-size: 16px;
  line-height: 1.6;
  color: var(--ink-2);
}

.so-way__label {
  font-weight: 600;
}

/* Support tiers */
.so-tiers {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-24);
  list-style: none;
}

.so-tier {
  display: flex;
  flex-direction: column;
  gap: var(--s-24);
  padding: var(--s-32);
  background: var(--paper);
}

.so-tier__name {
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.so-tier__terms {
  display: flex;
  flex-direction: column;
  gap: var(--s-12);
  padding-bottom: var(--s-24);
  border-bottom: 1px solid var(--line-2);
}

.so-tier__terms dt {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slate);
}

.so-tier__terms dd {
  margin-top: var(--s-4);
  font-size: 17px;
  line-height: 1.45;
  color: var(--ink);
}

.so-tier__terms dd::first-letter {
  text-transform: uppercase;
}

@media (max-width: 1100px) {
  .so-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Tablets and phones: the table becomes one card per stage. */
@media (max-width: 900px) {
  .so-table thead {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  .so-table,
  .so-table tbody,
  .so-table tr,
  .so-table td,
  .so-table tbody th {
    display: block;
    width: auto !important;
  }

  .so-table tbody tr {
    padding: var(--s-24) 0;
  }

  .so-table td,
  .so-table tbody th {
    padding: 0 0 var(--s-12);
  }

  .so-table td::before {
    content: attr(data-label);
    display: block;
    margin-bottom: var(--s-4);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--grey);
  }

  .so-stage {
    margin-bottom: var(--s-12);
  }

  .so-tiers {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .so-select {
    margin-bottom: var(--s-32);
  }

  /* The tabs scroll sideways instead of wrapping into a block. */
  .so-select__tabs {
    flex-wrap: nowrap;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .so-tab {
    flex: none;
  }

  .so-cards {
    grid-template-columns: 1fr;
    gap: var(--s-16);
  }

  .so-card {
    min-height: 0;
  }

  .so-table td,
  .so-table tbody th {
    font-size: 16px;
  }

  .so-way {
    padding: var(--s-24);
  }

  .so-tier {
    padding: var(--s-24);
  }
}
</style>
