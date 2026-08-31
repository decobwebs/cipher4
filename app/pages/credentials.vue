<script setup lang="ts">
import {
  credentialGroups,
  publishableCredentials,
  hasPublishableCredentials,
  publishablePartners,
  policies,
} from '~/data/credentials'
import { company } from '~/data/company'

useSeoMeta({
  title: 'Credentials & Compliance | Cipher4 AI & Robotics',
  description:
    'Corporate registration, sector registrations, management system certifications, insurance and policy positions for Cipher4 AI & Robotics Ltd.',
})

const anyCredentials = hasPublishableCredentials()
const partners = publishablePartners()

/** True only in `nuxt dev`. Compiled out of the production build entirely. */
const isDev = import.meta.dev
</script>

<template>
  <div>
    <UiPageHero
      eyebrow="Credentials &amp; compliance"
      title="Everything a procurement team asks for, in one place"
      lead="Registration details, certifications, insurance and the policy positions we work to. If you need documentation for a prequalification pack, ask and we will send it the same day."
    >
      <template #actions>
        <NuxtLink to="/contact" class="btn btn--accent">
          Request documentation
        </NuxtLink>
      </template>
    </UiPageHero>

    <!-- Registrations -->
    <section class="section">
      <div class="container">
        <div v-if="anyCredentials" class="stack stack--gap-lg">
          <div
            v-for="group in credentialGroups"
            :key="group.title"
            v-reveal
          >
            <template v-if="publishableCredentials(group).length">
              <div class="cluster">
                <div class="icon-plate">
                  <Icon :name="group.icon" size="20" />
                </div>
                <h2>{{ group.title }}</h2>
              </div>
              <p class="lead mt-3">{{ group.intro }}</p>

              <div class="grid grid--2 mt-6">
                <div
                  v-for="item in publishableCredentials(group)"
                  :key="item.name"
                  class="card cred"
                >
                  <div class="cred__head">
                    <h3 class="card__title">{{ item.name }}</h3>
                    <span
                      class="pill"
                      :class="item.status === 'held' ? 'pill--accent' : ''"
                    >
                      {{ item.status === 'held' ? 'Held' : 'In progress' }}
                    </span>
                  </div>

                  <p class="text-secondary">{{ item.description }}</p>

                  <dl v-if="item.status === 'held'" class="cred__meta">
                    <div v-if="item.reference">
                      <dt>Reference</dt>
                      <dd>{{ item.reference }}</dd>
                    </div>
                    <div v-if="item.issuer">
                      <dt>Issued by</dt>
                      <dd>{{ item.issuer }}</dd>
                    </div>
                  </dl>

                  <p class="cred__relevance">{{ item.relevance }}</p>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Honest empty state. Better than inventing certifications. -->
        <div v-else v-reveal class="card empty">
          <div class="icon-plate icon-plate--lg">
            <Icon name="lucide:file-text" size="26" />
          </div>
          <h2 class="mt-4">Documentation on request</h2>
          <p class="lead mt-3">
            Our corporate registration, tax documentation, insurance
            certificates and sector registrations are provided directly for
            prequalification and tender submissions.
          </p>
          <p class="mt-4 text-secondary measure">
            Email
            <a :href="`mailto:${company.email}`">{{ company.email }}</a>
            with the documents your process requires and we will return them
            the same working day.
          </p>
          <NuxtLink to="/contact" class="btn btn--primary mt-6">
            Request documentation
          </NuxtLink>

          <!-- Development-only note.
               This claimed to be invisible in production but had no guard, so
               it shipped: a message addressed to Cipher4, naming a source file
               path, rendering on the public page procurement teams read first.
               `import.meta.dev` is compiled out of the production bundle. -->
          <p v-if="isDev" class="empty__note">
            <Icon name="lucide:wrench" size="15" />
            <span>
              <strong>Cipher4:</strong> this section fills itself in as soon as
              you set each item's status in
              <code>app/data/credentials.ts</code>. Nothing publishes until you
              confirm it. Deliberately.
            </span>
          </p>
        </div>
      </div>
    </section>

    <!-- Partners -->
    <section v-if="partners.length" class="section section--subtle">
      <div class="container">
        <UiSectionHeader
          eyebrow="Vendor authorisations"
          title="Who we are authorised to supply"
          lead="Relevant to hardware procurement, warranty terms and licensing."
        />
        <div v-reveal.stagger class="grid grid--4">
          <div v-for="partner in partners" :key="partner.name" class="card">
            <h3 class="card__title">{{ partner.name }}</h3>
            <p v-if="partner.tier" class="text-accent">{{ partner.tier }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Policies -->
    <section id="policies" class="section section--inverse on-dark">
      <div class="container">
        <UiSectionHeader
          eyebrow="Policy positions"
          title="How we operate on your sites and in your systems"
          lead="These apply regardless of certification status, and we will accept them as contract terms."
        />

        <div v-reveal.stagger class="grid grid--2">
          <div v-for="policy in policies" :key="policy.title" class="card">
            <div class="icon-plate">
              <Icon :name="policy.icon" size="20" />
            </div>
            <div class="card__body mt-4">
              <h3 class="card__title">{{ policy.title }}</h3>
              <p v-for="para in policy.body" :key="para" class="text-secondary">
                {{ para }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- References -->
    <section class="section">
      <div class="container">
        <div v-reveal class="card refs">
          <div class="icon-plate icon-plate--solid">
            <Icon name="lucide:users" size="20" />
          </div>
          <h2 class="mt-4">References</h2>
          <p class="lead mt-3">
            Client references are available on request, subject to that
            client's consent. Tell us the sector and scope you are evaluating
            and we will put you in touch with the closest comparable
            engagement.
          </p>
          <NuxtLink to="/contact" class="btn btn--primary mt-6">
            Request references
          </NuxtLink>
        </div>
      </div>
    </section>

    <SectionsCtaBand
      title="Need something specific for a submission?"
      lead="Send us the prequalification checklist and we will tell you honestly which items we can satisfy today and which we cannot."
      primary-label="Send us your checklist"
      secondary-label="About Cipher4"
      secondary-to="/about"
    />
  </div>
</template>

<style scoped>
.cred__head {
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  justify-content: space-between;
  gap: var(--space-3);
  margin-block-end: var(--space-3);
}

.cred__meta {
  display: grid;
  gap: var(--space-2);
  margin-block-start: var(--space-4);
  padding-block-start: var(--space-4);
  border-block-start: 1px solid var(--border-default);
  font-size: var(--fs-sm);
}

.cred__meta > div {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
}

.cred__meta dt {
  color: var(--text-secondary);
}

.cred__meta dd {
  font-weight: var(--fw-semibold);
  text-align: right;
}

.cred__relevance {
  margin-block-start: var(--space-4);
  font-size: var(--fs-xs);
  line-height: var(--lh-snug);
  color: var(--text-secondary);
  font-style: italic;
}

/* --- Empty state --------------------------------------------------------- */

.empty {
  align-items: start;
  padding: var(--space-10);
  max-width: 44rem;
}

/* Scoped to plain inline links only — .btn already sets its own text
   colour, and this rule was previously overriding it (the "Request
   documentation" button was rendering in accent-on-accent, near-invisible). */
.empty p a {
  color: var(--text-accent);
  text-decoration: underline;
}

.empty__note {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-3);
  align-items: start;
  margin-block-start: var(--space-8);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background-color: var(--c4-amber-050);
  font-size: var(--fs-xs);
  line-height: var(--lh-snug);
  color: var(--c4-graphite);
}

.empty__note code {
  font-family: var(--font-mono);
  font-size: 0.95em;
}

.refs {
  align-items: start;
  padding: var(--space-10);
  max-width: 44rem;
}
</style>
