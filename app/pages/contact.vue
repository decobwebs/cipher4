<script setup lang="ts">
/**
 * Contact (content J2; Page-Contact board; Phone-Screens 07 and 08).
 * The form on the left; how to reach us and the offices on the right.
 * No closing band on this page (board): the form is the call to action.
 *
 * When a message is sent, the header road plays Message sent: the 400 ms
 * burst and one amber car racing away (kept from the Phase 2b demos).
 */
import { contactPage as page, reach, officesBlock } from '~/data/contact'

definePageMeta({ layout: 'c4' })
useSeoMeta({ title: page.seo.title, description: page.seo.description, ogTitle: page.seo.title, ogDescription: page.seo.description })

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Contact' }]
const hero = ref<{ launch: () => void; speedUp: (ms?: number) => void } | null>(null)
</script>

<template>
  <div>
    <PageHero
      ref="hero"
      :crumbs="crumbs"
      :eyebrow="page.eyebrow"
      :title="page.title"
      :lead="page.lead"
      road="contact"
      :min-height="520"
    />

    <section class="ct c4-section c4-section--paper" aria-label="Send us a message">
      <div class="c4-wrap ct__grid">
        <div class="c4-card ct__form">
          <ContactForm @sending="hero?.speedUp(400)" @sent="hero?.launch()" />
        </div>

        <aside class="ct__aside">
          <section class="c4-card ct__card" aria-labelledby="ct-reach">
            <h2 id="ct-reach" class="ct__title">{{ reach.title }}</h2>
            <ul v-m="'rise'" class="ct__reach">
              <li v-for="(r, i) in reach.items" :key="r.kind">
                <a :href="r.href" class="ct__row" :target="r.external ? '_blank' : undefined" :rel="r.external ? 'noopener' : undefined">
                  <C4Icon :name="r.icon as 'whatsapp' | 'mail' | 'phone'" :size="32" :delay="i * 0.25" />
                  <span class="ct__row-text">
                    <span class="ct__kind">{{ r.kind }}</span>
                    <span class="ct__value">{{ r.text }}</span>
                  </span>
                  <C4Glyph name="arrow" class="ct__arrow" />
                  <span v-if="r.external" class="c4-sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
            <p class="ct__hours">{{ reach.hours }}</p>
          </section>

          <section class="c4-card ct__card" aria-labelledby="ct-offices">
            <div class="ct__offices-head">
              <h2 id="ct-offices" class="ct__title">{{ officesBlock.title }}</h2>
              <p class="ct__note">{{ officesBlock.note }}</p>
            </div>
            <!-- Choreography 22: the head office lights first, then a line
                 reaches out to Lagos and Kaduna. -->
            <ol v-m="'cities'" class="ct__offices m-linked">
              <li v-for="(o, i) in officesBlock.items" :key="o.label" class="ct__office m-item" :class="{ 'is-head': o.head }" :style="{ '--i': i }">
                <span class="ct__pin m-pin" aria-hidden="true" />
                <span class="ct__office-text">
                  <span class="ct__label">{{ o.label }}</span>
                  <span class="ct__address">{{ o.address }}</span>
                  <a :href="`tel:${o.phone.replace(/[^\d+]/g, '')}`" class="ct__phone">{{ o.phone }}</a>
                </span>
              </li>
            </ol>
          </section>
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ct {
  padding-top: var(--s-96);
}

.ct__grid {
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: var(--s-48);
  align-items: start;
}

.ct__form {
  padding: var(--s-48);
  box-shadow: 0 30px 80px rgba(16, 32, 104, 0.08);
}

.ct__aside {
  display: flex;
  flex-direction: column;
  gap: var(--s-24);
}

.ct__card {
  display: flex;
  flex-direction: column;
  gap: var(--s-16);
  padding: var(--s-32);
}

.ct__title {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.ct__reach {
  list-style: none;
}

.ct__row {
  display: grid;
  grid-template-columns: 40px 1fr 16px;
  gap: var(--s-16);
  align-items: center;
  min-height: 76px;
  padding: var(--s-16) 0;
  border-top: 1px solid var(--line);
}

.ct__row-text {
  display: flex;
  flex-direction: column;
  gap: var(--s-4);
}

.ct__kind {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--grey);
}

.ct__value {
  font-size: 17px;
  font-weight: 500;
  overflow-wrap: anywhere;
}

.ct__arrow {
  color: var(--amber);
  transition: transform var(--dur-ui) var(--ease-out);
}

.ct__row:hover .ct__arrow {
  transform: translateX(4px);
}

.ct__hours {
  padding-top: var(--s-16);
  border-top: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--slate);
}

.ct__offices-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--s-8);
}

.ct__note {
  font-size: 14px;
  color: var(--slate);
}

/* Three offices on one line from Abuja (Contact choreography 22). */
.ct__offices {
  position: relative;
  list-style: none;
}

.ct__offices::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 10px;
  bottom: 64px;
  width: 1px;
  background: linear-gradient(180deg, var(--amber), var(--indigo));
}

.ct__office {
  position: relative;
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: var(--s-16);
}

.ct__pin {
  position: relative;
  z-index: 1;
  width: 13px;
  height: 13px;
  margin-top: 3px;
  border-radius: 50%;
  border: 2px solid var(--indigo);
  background: var(--white);
}

.ct__office.is-head .ct__pin {
  border-color: var(--amber);
  background: var(--amber);
}

.ct__office-text {
  display: flex;
  flex-direction: column;
  gap: var(--s-4);
  padding-bottom: var(--s-24);
}

.ct__label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--indigo);
}

.ct__address {
  font-size: 16px;
  line-height: 1.5;
}

.ct__phone {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  min-height: 44px;
  margin-block: -8px;
  font-size: 15px;
  color: var(--slate);
}

.ct__phone:hover {
  color: var(--indigo);
}

@media (max-width: 1100px) {
  .ct__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .ct {
    padding-top: var(--s-48);
  }

  .ct__form {
    padding: var(--s-24);
  }

  .ct__card {
    padding: var(--s-24);
  }

  /* Phone-Screens 08: large one-tap rows. */
  .ct__row {
    grid-template-columns: 44px 1fr 16px;
    padding: 0 var(--s-16);
    margin-bottom: var(--s-12);
    border: 1px solid var(--line);
    border-radius: 18px;
    background: var(--white);
  }
}
</style>
