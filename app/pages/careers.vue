<script setup lang="ts">
/**
 * Careers (content J1). No board of its own: the case header, what we look
 * for and what you get side by side, then open roles with the open
 * application, and the "have a project?" line.
 */
import { careersPage as page } from '~/data/legal'

definePageMeta({ layout: 'c4' })
useSeoMeta({ title: page.seo.title, description: page.seo.description, ogTitle: page.seo.title, ogDescription: page.seo.description })

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Careers' }]
</script>

<template>
  <div>
    <PageHero :crumbs="crumbs" :eyebrow="page.eyebrow" :title="page.title" :lead="page.lead" :drawing="{ icon: 'one-partner', code: 'C4-080' }" :text-width="680" />

    <section class="c4-section c4-section--paper" aria-label="What we look for and what you get">
      <div v-m="'cards'" class="c4-wrap c4p-grid-2">
        <div class="c4-card ca-list m-card" style="--i: 0">
          <h2 class="c4-h3">{{ page.lookFor.title }}</h2>
          <ul class="c4p-dots">
            <li v-for="x in page.lookFor.items" :key="x">{{ x }}</li>
          </ul>
        </div>
        <div class="c4-card ca-list m-card" style="--i: 1">
          <h2 class="c4-h3">{{ page.get.title }}</h2>
          <ul class="c4p-dots">
            <li v-for="x in page.get.items" :key="x">{{ x }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="c4-section c4-section--white" aria-labelledby="ca-roles">
      <div class="c4-wrap c4p-split">
        <div v-m="'rise'" class="c4p-split__head">
          <h2 id="ca-roles" class="c4-h2">{{ page.roles.title }}</h2>
        </div>
        <div v-m="'rise'" class="ca-roles">
          <div class="ca-none">
            <p class="ca-none__title">{{ page.roles.none }}</p>
            <p class="c4p-row-text">{{ page.roles.noneText }}</p>
          </div>
          <div class="c4-card ca-open">
            <h3 class="c4p-link-card__title">{{ page.roles.open.title }}</h3>
            <p class="c4p-link-card__text">{{ page.roles.open.text }}</p>
            <div>
              <C4Button :href="page.roles.open.cta.href" arrow>{{ page.roles.open.cta.label }}</C4Button>
            </div>
          </div>
          <p class="ca-project">
            {{ page.project.text }}
            <C4Button :to="page.project.link.to" variant="text">{{ page.project.link.label }}</C4Button>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ca-list {
  display: flex;
  flex-direction: column;
  gap: var(--s-32);
  padding: var(--s-48);
}

.ca-roles {
  display: flex;
  flex-direction: column;
  gap: var(--s-32);
}

.ca-none {
  display: flex;
  flex-direction: column;
  gap: var(--s-12);
  padding-bottom: var(--s-32);
  border-bottom: 1px solid var(--line);
}

.ca-none__title {
  font-size: 23px;
  line-height: 1.35;
  letter-spacing: -0.015em;
}

.ca-open {
  display: flex;
  flex-direction: column;
  gap: var(--s-16);
  padding: var(--s-48);
  background: var(--paper);
}

.ca-project {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-8) var(--s-16);
  font-size: 17px;
  color: var(--ink-2);
}

@media (max-width: 767px) {
  .ca-list,
  .ca-open {
    padding: var(--s-24);
  }

  .ca-none__title {
    font-size: 19px;
  }
}
</style>
