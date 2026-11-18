<script setup lang="ts">
/**
 * Credentials and compliance (content G2). No board of its own: the case
 * header, then registration as a table, the four policy groups as cards,
 * references, and "Preparing a submission?" as the closing band (it is the
 * page's last word and carries its own button).
 *
 * Only what Cipher4 holds is shown. The RC number row stays hidden until
 * the number is supplied (data/site.ts, company.rcNumber).
 */
import { credentialsPage as page } from '~/data/compliance'

definePageMeta({ layout: 'c4' })
useSeoMeta({ title: page.seo.title, description: page.seo.description, ogTitle: page.seo.title, ogDescription: page.seo.description })

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Credentials' }]
</script>

<template>
  <div>
    <PageHero :crumbs="crumbs" :eyebrow="page.eyebrow" :title="page.title" :lead="page.lead" road="case" :text-width="680">
      <template #actions>
        <C4Button :to="page.cta.to" arrow>{{ page.cta.label }}</C4Button>
      </template>
    </PageHero>

    <!-- Registration -->
    <section class="c4-section c4-section--paper" aria-labelledby="cr-reg">
      <div class="c4-wrap c4p-split">
        <div class="c4p-split__head">
          <h2 id="cr-reg" class="c4-h2">{{ page.registration.title }}</h2>
        </div>
        <dl class="c4p-facts">
          <template v-for="r in page.registration.rows" :key="r.label">
            <dt>{{ r.label }}</dt>
            <dd>{{ r.value }}</dd>
          </template>
        </dl>
      </div>
    </section>

    <!-- Policy positions -->
    <section class="c4-section c4-section--white" aria-labelledby="cr-policy">
      <div class="c4-wrap">
        <SectionHeader title-id="cr-policy" :eyebrow="page.policies.label" :title="page.policies.title" :lead="page.policies.lead" />
        <ul class="c4p-grid-2">
          <li v-for="(g, i) in page.policies.groups" :key="g.title" class="c4-card cr-policy">
            <C4Icon :name="g.icon" :size="44" :delay="i * 0.2" />
            <h3 class="c4p-link-card__title">{{ g.title }}</h3>
            <ul class="c4p-dots">
              <li v-for="x in g.items" :key="x">{{ x }}</li>
            </ul>
          </li>
        </ul>
      </div>
    </section>

    <!-- References -->
    <section class="c4-section c4-section--paper cr-refs" aria-labelledby="cr-refs">
      <div class="c4-wrap c4p-split">
        <div class="c4p-split__head">
          <h2 id="cr-refs" class="c4-h2">{{ page.references.title }}</h2>
        </div>
        <div class="cr-refs__body">
          <p class="cr-refs__text">{{ page.references.text }}</p>
          <C4Button :to="page.references.cta.to" variant="secondary" arrow>{{ page.references.cta.label }}</C4Button>
        </div>
      </div>
    </section>

    <ClosingBand
      :title="page.submission.title"
      :lead="page.submission.text"
      :primary="page.submission.cta"
      :secondary="null"
      :promise="null"
    />
  </div>
</template>

<style scoped>
.cr-policy {
  display: flex;
  flex-direction: column;
  gap: var(--s-24);
  height: 100%;
  padding: var(--s-48);
}

.cr-policy .c4p-dots {
  padding-top: var(--s-24);
  border-top: 1px solid var(--line);
}

.cr-refs {
  padding-bottom: var(--s-128);
}

.cr-refs__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--s-32);
}

.cr-refs__text {
  font-size: 21px;
  line-height: 1.6;
  color: var(--ink-2);
}

@media (max-width: 767px) {
  .cr-policy {
    padding: var(--s-24);
  }

  .cr-refs {
    padding-bottom: var(--s-96);
  }

  .cr-refs__text {
    font-size: 18px;
  }
}
</style>
