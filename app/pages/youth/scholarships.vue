<script setup lang="ts">
/**
 * Scholarships (content I3). The header, then one status block. When
 * scholarships open, that one block is replaced by four sections (who can
 * apply, what is covered, how to apply, key dates) and nothing else on the
 * page changes: set `status.state` in data/youth.ts and fill the block.
 */
import { scholarshipsPage as page } from '~/data/youth'

definePageMeta({ layout: 'c4' })
useSeoMeta({ title: page.seo.title, description: page.seo.description, ogTitle: page.seo.title, ogDescription: page.seo.description })

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Youth and skills', to: '/youth' }, { label: 'Scholarships' }]
</script>

<template>
  <div>
    <PageHero :crumbs="crumbs" :eyebrow="page.eyebrow" :title="page.title" :lead="page.lead" :drawing="{ icon: 'training', code: 'C4-072' }" :text-width="640" />

    <!-- The status block (one content block, I3 note) -->
    <section v-if="page.status.state === 'coming-soon'" class="c4-section c4-section--paper" aria-labelledby="sc-status">
      <div class="c4-wrap">
        <div v-m="'rise'" class="c4-card sc-status">
          <div class="sc-status__copy">
            <h2 id="sc-status" class="c4-h3">{{ page.status.title }}</h2>
            <p class="c4-lead">{{ page.status.text }}</p>
          </div>
          <InterestForm class="sc-status__form" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sc-status {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: var(--s-64);
  align-items: start;
  padding: var(--s-64);
}

.sc-status__copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--s-16);
}

@media (max-width: 1100px) {
  .sc-status {
    grid-template-columns: 1fr;
    gap: var(--s-32);
    padding: var(--s-48);
  }
}

@media (max-width: 767px) {
  .sc-status {
    padding: var(--s-24);
  }
}
</style>
