<script setup lang="ts">
import { company, telHref } from '~/data/company'

useSeoMeta({
  title: 'Contact | Cipher4 AI & Robotics',
  description:
    'Talk to Cipher4 about transport, logistics, oil and gas or supply chain operations. Offices in Abuja, Lagos and Kaduna.',
})

// Two different conversations, so two different forms.
const tab = ref<'enquiry' | 'quote'>('enquiry')
const tabRefs = ref<HTMLButtonElement[]>([])
const tabs = [
  { id: 'enquiry' as const, label: 'General enquiry' },
  { id: 'quote' as const, label: 'Request a quote' },
]

function onTabKeydown(e: KeyboardEvent, index: number) {
  const last = tabs.length - 1
  let next: number | null = null
  if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1
  else if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1
  if (next !== null) {
    e.preventDefault()
    tab.value = tabs[next]!.id
    tabRefs.value[next]?.focus()
  }
}

const whatsappUrl = computed(
  () =>
    `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(
      'Hello Cipher4, I would like to discuss a project.',
    )}`,
)
</script>

<template>
  <div>
    <UiPageHero
      eyebrow="Contact"
      title="Start with the problem"
      lead="Tell us what is not working in your operation. If we are not the right people for it, we will say so and point you at who is."
    />

    <section class="section">
      <div class="container">
        <div class="contact">
          <!-- Forms -->
          <div>
            <div class="tabs__list" role="tablist" aria-label="Enquiry type">
              <button
                v-for="(t, i) in tabs"
                :key="t.id"
                :ref="(el) => { if (el) tabRefs[i] = el as HTMLButtonElement }"
                type="button"
                role="tab"
                :id="`ct-${t.id}`"
                :aria-selected="tab === t.id"
                :aria-controls="`ctp-${t.id}`"
                :tabindex="tab === t.id ? 0 : -1"
                class="tab"
                :class="{ 'tab--active': tab === t.id }"
                @click="tab = t.id"
                @keydown="onTabKeydown($event, i)"
              >
                {{ t.label }}
              </button>
            </div>

            <div
              v-show="tab === 'enquiry'"
              id="ctp-enquiry"
              role="tabpanel"
              aria-labelledby="ct-enquiry"
            >
              <p class="tab-intro">
                For a conversation about an operational problem, a possible
                project, or whether what you want is even a good idea.
              </p>
              <SectionsContactForm variant="enquiry" />
            </div>

            <div
              v-show="tab === 'quote'"
              id="ctp-quote"
              role="tabpanel"
              aria-labelledby="ct-quote"
            >
              <p class="tab-intro">
                For a defined scope, an RFQ, or a formal tender response. Tell
                us the submission format and the deadline and we will work to
                them.
              </p>
              <SectionsContactForm variant="quote" />
            </div>
          </div>

          <!-- Direct channels -->
          <aside class="contact__side">
            <div class="card">
              <h2 class="card__title">Reach us directly</h2>
              <p class="text-secondary">
                A form is not always the fastest route. These all reach the
                same team.
              </p>

              <div class="direct">
                <a :href="whatsappUrl" class="direct__item" target="_blank" rel="noopener">
                  <div class="icon-plate"><Icon name="lucide:message-circle" size="20" /></div>
                  <div>
                    <span class="direct__label">WhatsApp</span>
                    <span class="direct__value">Chat with the team</span>
                  </div>
                </a>

                <a :href="`mailto:${company.email}`" class="direct__item">
                  <div class="icon-plate"><Icon name="lucide:mail" size="20" /></div>
                  <div>
                    <span class="direct__label">Email</span>
                    <span class="direct__value">{{ company.email }}</span>
                  </div>
                </a>

                <a
                  :href="telHref(company.offices[0]!.phone)"
                  class="direct__item"
                >
                  <div class="icon-plate"><Icon name="lucide:phone" size="20" /></div>
                  <div>
                    <span class="direct__label">Phone</span>
                    <span class="direct__value">{{ company.offices[0]!.phone }}</span>
                  </div>
                </a>
              </div>

              <p class="hours">
                <Icon name="lucide:clock" size="16" />
                {{ company.hours }}
              </p>
            </div>

            <div class="card mt-6">
              <h2 class="card__title">Procurement</h2>
              <p class="text-secondary">
                Registration details, certifications, insurance and policy
                statements are collected on one page for prequalification.
              </p>
              <NuxtLink to="/credentials" class="btn btn--secondary mt-4">
                Credentials &amp; compliance
              </NuxtLink>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- Offices -->
    <section class="section section--subtle">
      <div class="container">
        <UiSectionHeader
          eyebrow="Offices"
          title="Where we are"
          lead="Our engineers travel to site from all three. Visits are by appointment."
        />

        <div v-reveal.stagger class="grid grid--3">
          <div v-for="office in company.offices" :key="office.city" class="card">
            <div class="cluster">
              <h3 class="card__title">{{ office.city }}</h3>
              <span v-if="office.isHeadquarters" class="pill pill--accent">
                Head office
              </span>
            </div>
            <address class="office__address">
              {{ office.street }}<br>
              {{ office.area }}, {{ office.state }}<br>
              {{ office.country }}
            </address>
            <a :href="telHref(office.phone)" class="office__phone">
              <Icon name="lucide:phone" size="16" />
              {{ office.phone }}
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contact {
  display: grid;
  gap: var(--space-12);
}

@media (min-width: 64rem) {
  .contact {
    grid-template-columns: 1.6fr 1fr;
    gap: var(--space-16);
    align-items: start;
  }
}

.tabs__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-block-end: var(--space-6);
}

.tab {
  min-height: 2.75rem;
  padding: var(--space-2) var(--space-5);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-pill);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  color: var(--text-secondary);
  transition: background-color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out);
}

.tab:hover {
  border-color: var(--c4-indigo-800);
  color: var(--text-primary);
}

.tab--active {
  background-color: var(--c4-indigo-800);
  border-color: var(--c4-indigo-800);
  color: var(--c4-white);
}

.tab-intro {
  margin-block-end: var(--space-6);
  color: var(--text-secondary);
  max-width: var(--measure);
}

/* --- Direct channels ----------------------------------------------------- */

.direct {
  display: grid;
  gap: var(--space-2);
  margin-block-start: var(--space-5);
}

.direct__item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-3);
  margin-inline: calc(var(--space-3) * -1);
  border-radius: var(--radius-md);
  transition: background-color var(--dur-fast) var(--ease-out);
}

.direct__item:hover {
  background-color: var(--bg-subtle);
  color: inherit;
}

.direct__label {
  display: block;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--text-secondary);
}

.direct__value {
  display: block;
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  color: var(--text-primary);
}

.hours {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-block-start: var(--space-5);
  padding-block-start: var(--space-4);
  border-block-start: 1px solid var(--border-default);
  font-size: var(--fs-sm);
  color: var(--text-secondary);
}

/* --- Offices ------------------------------------------------------------- */

.office__address {
  margin-block-start: var(--space-3);
  font-style: normal;
  font-size: var(--fs-sm);
  line-height: 1.7;
  color: var(--text-secondary);
}

.office__phone {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-block-start: var(--space-4);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  color: var(--text-accent);
}
</style>
