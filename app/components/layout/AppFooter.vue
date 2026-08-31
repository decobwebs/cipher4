<script setup lang="ts">
import { footerNav } from '~/data/navigation'
import { company, telHref } from '~/data/company'

const year = new Date().getFullYear()

// Only render social icons that have a real URL. The old footer shipped
// three icons all pointing at "#", which reads as an unfinished site.
const socials = computed(() =>
  [
    { name: 'LinkedIn', icon: 'lucide:linkedin', url: company.social.linkedin },
    { name: 'X', icon: 'lucide:twitter', url: company.social.x },
    { name: 'YouTube', icon: 'lucide:youtube', url: company.social.youtube },
  ].filter((s) => s.url),
)
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand">
          <NuxtLink to="/" class="footer__logo-link" aria-label="Cipher4, home">
            <img
              src="/images/cipher4-logo.png"
              alt=""
              width="40"
              height="40"
              class="footer__logo"
            >
            <span class="footer__wordmark">Cipher4</span>
          </NuxtLink>

          <p class="footer__blurb">
            We build the software and robotic systems that keep cargo, energy
            and crews moving across road, sea and air.
          </p>

          <ul v-if="socials.length" class="footer__socials">
            <li v-for="s in socials" :key="s.name">
              <a
                :href="s.url"
                class="footer__social"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="sr-only">{{ s.name }}</span>
                <Icon :name="s.icon" size="20" />
              </a>
            </li>
          </ul>
        </div>

        <nav
          v-for="group in footerNav"
          :key="group.title"
          class="footer__group"
          :aria-label="group.title"
        >
          <h2 class="footer__group-title">{{ group.title }}</h2>
          <ul class="footer__group-list">
            <li v-for="item in group.items" :key="item.to">
              <NuxtLink :to="item.to" class="footer__link">{{ item.label }}</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <div class="footer__offices">
        <div v-for="office in company.offices" :key="office.city" class="footer__office">
          <h3 class="footer__office-city">
            {{ office.city }}
            <span v-if="office.isHeadquarters" class="footer__hq">Head Office</span>
          </h3>
          <address class="footer__address">
            {{ office.street }}<br>
            {{ office.area }}, {{ office.state }}<br>
            <a :href="telHref(office.phone)" class="footer__link">{{ office.phone }}</a>
          </address>
        </div>

        <div class="footer__office">
          <h3 class="footer__office-city">Enquiries</h3>
          <address class="footer__address">
            <a :href="`mailto:${company.email}`" class="footer__link">{{ company.email }}</a><br>
            {{ company.hours }}
          </address>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__legal">
          © {{ year }} {{ company.legalName }}.
          <template v-if="company.rcNumber">RC {{ company.rcNumber }}.</template>
          All rights reserved.
        </p>
        <p class="footer__built">
          Registered in Nigeria. Serving transport, logistics, oil &amp; gas and
          supply chain operators.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Light. The footer used to be a navy slab carrying `.on-dark`, which was
   correct when the site was dark-first and is now the only thing on the page
   still working from that palette. White with a hairline, so it reads as the
   end of the document rather than a separate object. The CTA band directly
   above it stays dark on purpose — with everything else light, that band is
   now the single point of emphasis before the footer. */
.footer {
  padding-block: var(--space-16) var(--space-8);
  background-color: var(--bg-page);
  border-block-start: 1px solid var(--border-default);
}

.footer__top {
  display: grid;
  gap: var(--space-10);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
}

@media (min-width: 64rem) {
  .footer__top {
    grid-template-columns: 1.6fr repeat(4, 1fr);
    gap: var(--space-8);
  }
}

/* --- Brand column ------------------------------------------------------- */

.footer__brand {
  display: grid;
  gap: var(--space-4);
  align-content: start;
  max-width: 24rem;
}

.footer__logo-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.footer__logo {
  width: 2.5rem;
  height: 2.5rem;
  object-fit: contain;
}

.footer__wordmark {
  font-family: var(--font-heading);
  font-size: 1.375rem;
  font-weight: var(--fw-bold);
  letter-spacing: var(--tracking-tight);
  color: var(--text-primary);
}

.footer__blurb {
  font-size: var(--fs-sm);
  line-height: var(--lh-body);
  color: var(--text-secondary);
}

.footer__socials {
  display: flex;
  gap: var(--space-2);
}

.footer__social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  transition: color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out);
}

.footer__social:hover {
  color: var(--text-accent);
  border-color: var(--border-accent);
  background-color: var(--bg-accent-wash);
}

/* --- Link groups -------------------------------------------------------- */

.footer__group-title {
  font-size: var(--fs-eyebrow);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--text-primary);
  margin-block-end: var(--space-4);
}

.footer__group-list {
  display: grid;
  gap: var(--space-3);
}

.footer__link {
  font-size: var(--fs-sm);
  color: var(--text-secondary);
  transition: color var(--dur-fast) var(--ease-out);
}

.footer__link:hover {
  color: var(--text-accent);
  text-decoration: underline;
}

/* --- Offices ------------------------------------------------------------ */

.footer__offices {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  margin-block-start: var(--space-12);
  padding-block-start: var(--space-8);
  border-block-start: 1px solid var(--border-default);
}

.footer__office-city {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-primary);
  margin-block-end: var(--space-2);
}

.footer__hq {
  padding: 0.125rem var(--space-2);
  border-radius: var(--radius-pill);
  background-color: var(--bg-accent-wash);
  color: var(--text-accent);
  font-size: 0.6875rem;
  font-weight: var(--fw-medium);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.footer__address {
  font-style: normal;
  font-size: var(--fs-sm);
  line-height: 1.7;
  color: var(--text-secondary);
}

/* --- Bottom bar --------------------------------------------------------- */

.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-block-start: var(--space-10);
  padding-block-start: var(--space-6);
  border-block-start: 1px solid var(--border-default);
}

.footer__legal,
.footer__built {
  font-size: var(--fs-xs);
  color: var(--text-secondary);
}
</style>
