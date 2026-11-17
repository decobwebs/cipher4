<script setup lang="ts">
/**
 * Footer (content B3, Home-Desktop and Home-Mobile boards).
 *
 * Desktop: logo and tagline, then Services, Sectors and Company columns,
 * the three offices and enquiries, and a mono legal line.
 * Phones: the link groups fold up (one opens at a time). With JavaScript
 * off they stay open, so every link is always reachable.
 */
import { footerColumns, legalLinks, offices, contact, company, telHref } from '~/data/site'

const year = new Date().getFullYear()
const open = ref<string | null>(null)
const colId = (label: string) => `c4-foot-${label.toLowerCase()}`
const legalLine = computed(() =>
  `© ${year} ${company.legalName}. All rights reserved. Registered in Nigeria${company.rcNumber ? `, RC ${company.rcNumber}` : ''}.`,
)
</script>

<template>
  <footer class="c4-foot">
    <div class="c4-wrap c4-foot__inner">
      <div class="c4-foot__top">
        <div class="c4-foot__brand">
          <NuxtLink to="/" class="c4-foot__home" aria-label="Cipher4, home">
            <C4Logo variant="stacked" :size="50" />
          </NuxtLink>
          <p class="c4-foot__tagline">{{ company.tagline }}</p>
        </div>

        <nav class="c4-foot__cols" aria-label="Footer">
          <div v-for="col in footerColumns" :key="col.label" class="c4-foot__col">
            <h2 class="c4-foot__head">
              <button
                type="button"
                class="c4-foot__toggle"
                :aria-expanded="open === col.label"
                :aria-controls="colId(col.label)"
                @click="open = open === col.label ? null : col.label"
              >
                <span>{{ col.label }}</span>
                <C4Glyph :name="open === col.label ? 'minus' : 'plus'" class="c4-foot__sign" />
              </button>
              <span class="c4-foot__label">{{ col.label }}</span>
            </h2>
            <ul
              :id="colId(col.label)"
              class="c4-foot__list"
              :class="{ 'is-open': open === col.label }"
            >
              <li v-for="it in col.items" :key="it.to">
                <NuxtLink :to="it.to" class="c4-foot__link">{{ it.label }}</NuxtLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div class="c4-foot__offices">
        <div
          v-for="(o, i) in offices"
          :key="o.city"
          class="c4-foot__office"
          :class="{ 'c4-foot__office--more': i > 0 }"
        >
          <p class="c4-foot__label">{{ o.label }}</p>
          <p>{{ o.address }}</p>
          <p><a :href="telHref(o.phone)" class="c4-foot__inline">{{ o.phone }}</a></p>
        </div>
        <div class="c4-foot__office">
          <p class="c4-foot__label">Enquiries</p>
          <p><a :href="`mailto:${contact.email}`" class="c4-foot__inline">{{ contact.email }}</a></p>
          <p>{{ contact.hours }}</p>
          <p v-if="contact.linkedin">
            <a :href="contact.linkedin" class="c4-foot__inline" target="_blank" rel="noopener">LinkedIn<span class="c4-sr-only"> (opens in a new tab)</span></a>
          </p>
        </div>
      </div>

      <div class="c4-foot__legal">
        <p>{{ legalLine }}</p>
        <ul class="c4-foot__legal-links">
          <li v-for="l in legalLinks" :key="l.to">
            <NuxtLink :to="l.to">{{ l.label }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.c4-foot {
  background: var(--white);
}

.c4-foot__inner {
  display: flex;
  flex-direction: column;
  gap: var(--s-32);
  padding-top: var(--s-48);
  /* Clear the action dock on phones. */
  padding-bottom: calc(var(--s-96) + env(safe-area-inset-bottom));
}

.c4-foot__top {
  display: flex;
  flex-direction: column;
  gap: var(--s-32);
}

.c4-foot__brand {
  display: flex;
  flex-direction: column;
  gap: var(--s-16);
}

.c4-foot__home {
  align-self: flex-start;
  display: flex;
  min-height: 44px;
}

.c4-foot__tagline {
  max-width: 240px;
  font-size: 16px;
  line-height: 1.5;
  color: var(--slate);
}

.c4-foot__label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--grey);
}

.c4-foot__head {
  font-size: inherit;
  font-weight: 400;
}

/* --- Phones: folded groups --------------------------------------------- */
.c4-foot__cols {
  border-bottom: 1px solid var(--line);
}

.c4-foot__col {
  border-top: 1px solid var(--line);
}

.c4-foot__head .c4-foot__label {
  display: none;
}

.c4-foot__toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 56px;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.c4-foot__sign {
  color: var(--indigo);
}

.c4-foot__list {
  display: flex;
  flex-direction: column;
  padding-bottom: var(--s-16);
  list-style: none;
}

.c4-foot__link {
  display: flex;
  align-items: center;
  min-height: 44px;
  font-size: 15px;
  color: var(--ink-2);
  transition: color var(--dur-ui) var(--ease-out);
}

.c4-foot__link:hover {
  color: var(--indigo);
}

.c4-foot__offices {
  display: grid;
  gap: var(--s-24);
  padding-top: var(--s-24);
  font-size: 15px;
  line-height: 1.5;
  color: var(--slate);
}

.c4-foot__office {
  display: flex;
  flex-direction: column;
  gap: var(--s-8);
}

/* Phones show the head office and enquiries only (Home-Mobile board). */
.c4-foot__office--more {
  display: none;
}

.c4-foot__inline {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  margin-block: -12px;
  transition: color var(--dur-ui) var(--ease-out);
}

.c4-foot__inline:hover {
  color: var(--indigo);
}

.c4-foot__legal {
  display: flex;
  flex-direction: column;
  gap: var(--s-8);
  font-family: var(--font-mono);
  font-size: 10px;
  line-height: 1.7;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--grey);
}

.c4-foot__legal-links {
  display: flex;
  gap: var(--s-24);
  list-style: none;
}

.c4-foot__legal-links a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  transition: color var(--dur-ui) var(--ease-out);
}

.c4-foot__legal-links a:hover {
  color: var(--indigo);
}

/* --- Tablet and up: columns, always open ------------------------------- */
@media (min-width: 768px) {
  .c4-foot__inner {
    gap: var(--s-64);
    padding-top: var(--s-64);
    padding-bottom: var(--s-48);
  }

  .c4-foot__top {
    display: grid;
    grid-template-columns: minmax(200px, 1fr) 3fr;
    gap: var(--s-48);
  }

  .c4-foot__cols {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--s-48);
    border: 0;
  }

  .c4-foot__col {
    display: flex;
    flex-direction: column;
    gap: var(--s-8);
    border: 0;
  }

  .c4-foot__toggle {
    display: none;
  }

  .c4-foot__head .c4-foot__label {
    display: block;
  }

  .c4-foot__list {
    display: flex;
    padding-bottom: 0;
  }

  .c4-foot__offices {
    grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
    gap: var(--s-32);
    padding-top: var(--s-32);
    border-top: 1px solid var(--line);
  }

  .c4-foot__office--more {
    display: flex;
  }

  .c4-foot__legal {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--s-24);
    font-size: 11px;
  }
}
</style>

<style>
/* Folded only when JavaScript can unfold it (phones). Unscoped because it
   depends on `.c4-js` on <html>. */
.c4-js .c4-foot__list:not(.is-open) {
  display: none;
}

@media (min-width: 768px) {
  .c4-js .c4-foot__list:not(.is-open) {
    display: flex;
  }
}
</style>
