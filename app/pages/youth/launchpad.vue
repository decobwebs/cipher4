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
    <PageHero :crumbs="crumbs" :eyebrow="page.eyebrow" :title="page.title" :lead="page.lead" :drawing="{ icon: 'pilot', code: 'C4-071' }" :text-width="680">
      <template #actions>
        <C4Button to="#lp-form" arrow>{{ page.form.title }}</C4Button>
      </template>
    </PageHero>

    <section class="c4-section c4-section--paper" aria-labelledby="lp-how">
      <div class="c4-wrap">
        <SectionHeader title-id="lp-how" :title="page.steps.title" />
        <!-- One route from idea to launch: each step lights as the line reaches it. -->
        <ol v-m="'route'" data-seg class="lp-steps">
          <li v-for="(s, i) in page.steps.items" :key="s.title" class="c4-card lp-step m-card" :style="{ '--i': i }">
            <svg class="m-route lp-route" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 1 H100" pathLength="1" /></svg>
            <span class="m-stop lp-stop" aria-hidden="true" />
            <span class="c4p-n">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="c4p-link-card__title">{{ s.title }}</h3>
            <p class="c4p-link-card__text">{{ s.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="c4-section c4-section--white" aria-labelledby="lp-look">
      <div class="c4-wrap c4p-split">
        <div v-m="'rise'" class="c4p-split__head">
          <h2 id="lp-look" class="c4-h2">{{ page.lookFor.title }}</h2>
        </div>
        <ul v-m="'rise'" class="lp-look">
          <li v-for="(x, i) in page.lookFor.items" :key="x">
            <C4Icon name="check" :size="32" :delay="i * 0.15" />
            <span>{{ x }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section id="lp-form" class="c4-section c4-section--paper" aria-labelledby="lp-form-title">
      <div class="c4-wrap c4p-split">
        <!-- Sticky: the heading and a drawing stay beside the long form. -->
        <div class="c4p-split__head">
          <h2 id="lp-form-title" class="c4-h2">{{ page.form.title }}</h2>
          <div class="lp-form__drawing">
            <BlueprintDrawing icon="design" code="C4-073" :title="page.form.title" />
          </div>
        </div>
        <div v-m="'rise'" class="c4-card lp-form">
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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--s-16);
  padding: var(--s-32);
}

/* The route runs along the top edge of the four steps. */
.lp-route {
  top: -1px;
  width: calc(100% + var(--s-24));
}

.lp-step:last-child .lp-route {
  width: 100%;
}

.lp-stop {
  position: absolute;
  top: -7px;
  left: var(--s-32);
}

@media (max-width: 1100px) {
  .lp-route {
    width: 100%;
  }
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

.lp-form__drawing {
  width: min(360px, 100%);
  margin-top: var(--s-24);
}

@media (max-width: 1100px) {
  .lp-form__drawing {
    display: none;
  }
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
