<script setup lang="ts">
/**
 * Launchpad (content I2). No board of its own: the case header (a long
 * straight road: an idea heading for launch), the four steps as numbered
 * cards, what we look for, then the form beside its heading.
 */
import { launchpadPage as page } from '~/data/youth'

definePageMeta({ layout: 'c4' })
useSeoMeta({ title: page.seo.title, description: page.seo.description, ogTitle: page.seo.title, ogDescription: page.seo.description })

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Youth and skills', to: '/youth' }, { label: 'Launchpad' }]
</script>

<template>
  <div>
    <PageHero :crumbs="crumbs" :eyebrow="page.eyebrow" :title="page.title" :lead="page.lead" road="case" :text-width="680">
      <template #actions>
        <C4Button to="#lp-form" arrow>{{ page.form.title }}</C4Button>
      </template>
    </PageHero>

    <section class="c4-section c4-section--paper" aria-labelledby="lp-how">
      <div class="c4-wrap">
        <SectionHeader title-id="lp-how" :title="page.steps.title" />
        <ol class="lp-steps">
          <li v-for="(s, i) in page.steps.items" :key="s.title" class="c4-card lp-step">
            <span class="c4p-n">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="c4p-link-card__title">{{ s.title }}</h3>
            <p class="c4p-link-card__text">{{ s.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="c4-section c4-section--white" aria-labelledby="lp-look">
      <div class="c4-wrap c4p-split">
        <div class="c4p-split__head">
          <h2 id="lp-look" class="c4-h2">{{ page.lookFor.title }}</h2>
        </div>
        <ul class="lp-look">
          <li v-for="(x, i) in page.lookFor.items" :key="x">
            <C4Icon name="check" :size="32" :delay="i * 0.15" />
            <span>{{ x }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section id="lp-form" class="c4-section c4-section--paper" aria-labelledby="lp-form-title">
      <div class="c4-wrap c4p-split">
        <div class="c4p-split__head">
          <h2 id="lp-form-title" class="c4-h2">{{ page.form.title }}</h2>
        </div>
        <div class="c4-card lp-form">
          <LaunchpadForm />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.lp-steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--s-24);
  list-style: none;
}

.lp-step {
  display: flex;
  flex-direction: column;
  gap: var(--s-16);
  padding: var(--s-32);
}

.lp-look {
  list-style: none;
}

.lp-look li {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: var(--s-16);
  align-items: center;
  padding: var(--s-24) 0;
  border-top: 1px solid var(--line);
  font-size: 21px;
  line-height: 1.45;
}

.lp-look li:last-child {
  border-bottom: 1px solid var(--line);
}

.lp-form {
  padding: var(--s-48);
}

@media (max-width: 1100px) {
  .lp-steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .lp-steps {
    grid-template-columns: 1fr;
    gap: var(--s-16);
  }

  .lp-step {
    padding: var(--s-24);
  }

  .lp-look li {
    font-size: 17px;
  }

  .lp-form {
    padding: var(--s-24) var(--s-16);
    border: 0;
    background: none;
  }
}
</style>
