<script setup lang="ts">
import { company } from '~/data/company'
import { policies } from '~/data/credentials'

useSeoMeta({
  title: 'About | Cipher4 AI & Robotics',
  description:
    'Cipher4 AI & Robotics Ltd is a Nigerian technology company building software platforms and robotic systems for transport, logistics, oil and gas, and supply chain operations.',
})

/**
 * TODO(cipher4): Leadership.
 * Send names, roles, one line of relevant background, and a photograph for
 * each. B2B buyers buy a team — the old site had not one human on it. This
 * section does not render until the array is filled.
 */
const leadership: {
  name: string
  role: string
  bio: string
  image?: string
}[] = []

const disciplines = [
  'Robotics and mechatronics',
  'Embedded and firmware',
  'Backend and platform engineering',
  'Data engineering and analytics',
  'Field and commissioning engineering',
  'Network and infrastructure',
]
</script>

<template>
  <div>
    <UiPageHero
      eyebrow="About"
      title="A Nigerian engineering company, working where the conditions are hard"
      lead="Cipher4 AI & Robotics Ltd builds software platforms and robotic systems for operations that cannot afford to stop. We are based in Abuja, with offices in Lagos and Kaduna, and our engineers go to site."
    />

    <!-- What we do and don't -->
    <section class="section">
      <div class="container">
        <div class="split">
          <div v-reveal="'left'">
            <p class="eyebrow">Focus</p>
            <h2 class="mt-4">Four sectors, and we say no to the rest</h2>
            <p class="lead mt-4">
              Transport, logistics, oil and gas, and supply chain. That is the
              whole list. They share the same hard problems: high-value assets
              in difficult places, restricted access, and compliance regimes
              that punish poor records. Depth in them is worth more to a client
              than a longer list of industries.
            </p>
            <p class="mt-4 text-secondary measure">
              We turn down work outside those four. Not out of principle, but
              because the value we bring comes from having seen the same
              problem before, and outside these sectors we have not.
            </p>
          </div>

          <div v-reveal="'right'" class="about-media">
            <NuxtImg
              src="/images/about-team.jpg"
              alt="Cipher4 engineers reviewing system deployment on site"
              width="1600"
              height="1200"
              sizes="100vw md:50vw"
              format="webp"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- How we work -->
    <section class="section section--subtle">
      <div class="container">
        <UiSectionHeader
          eyebrow="How we work"
          title="Three commitments we will be held to"
        />

        <div v-reveal.stagger class="grid grid--3">
          <div class="card">
            <div class="icon-plate icon-plate--solid">
              <Icon name="lucide:eye" size="20" />
            </div>
            <div class="card__body mt-4">
              <h3 class="card__title">We look before we quote</h3>
              <p class="text-secondary">
                Every engagement starts with our engineers walking the
                operation. A scope written from a meeting room is a scope that
                gets revised twice at your cost.
              </p>
            </div>
          </div>

          <div class="card">
            <div class="icon-plate icon-plate--solid">
              <Icon name="lucide:message-square-warning" size="20" />
            </div>
            <div class="card__body mt-4">
              <h3 class="card__title">We tell you when you are wrong</h3>
              <p class="text-secondary">
                If a client asks for something we think will not work, we put
                the objection in writing. Occasionally that costs us the job.
                It has never cost us a client.
              </p>
            </div>
          </div>

          <div class="card">
            <div class="icon-plate icon-plate--solid">
              <Icon name="lucide:hand-heart" size="20" />
            </div>
            <div class="card__body mt-4">
              <h3 class="card__title">We stay after handover</h3>
              <p class="text-secondary">
                Systems that get abandoned were usually handed over badly. We
                train the people who will live with it and document it for the
                engineer who inherits it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Capability -->
    <section class="section">
      <div class="container">
        <div class="split split--media-first">
          <div v-reveal="'left'" class="about-media">
            <NuxtImg
              src="/images/about-field.jpg"
              alt="Cipher4 field engineer working on an offshore installation"
              width="1600"
              height="1200"
              sizes="100vw md:50vw"
              format="webp"
              loading="lazy"
            />
          </div>

          <div v-reveal="'right'">
            <p class="eyebrow">The team</p>
            <h2 class="mt-4">Engineers who mobilise</h2>
            <p class="lead mt-4">
              The difference between a good demonstration and a system that
              survives a year offshore is almost always whether anyone on the
              build team has worked in those conditions. Ours have.
            </p>

            <h3 class="mt-8">Disciplines in-house</h3>
            <UiCheckList class="mt-4" :items="disciplines" />

            <p class="mt-6 text-secondary measure">
              Personnel deployed offshore hold current BOSIET or equivalent
              certification and valid offshore medicals. We do not mobilise
              anyone who does not.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Leadership: renders only when real people are added -->
    <section v-if="leadership.length" class="section section--subtle">
      <div class="container">
        <UiSectionHeader eyebrow="Leadership" title="Who you will be working with" />
        <div v-reveal.stagger class="grid grid--3">
          <div v-for="person in leadership" :key="person.name" class="card card--flush">
            <div v-if="person.image" class="card__media">
              <NuxtImg :src="person.image" :alt="person.name" width="800" height="800" />
            </div>
            <div class="card__body">
              <h3 class="card__title">{{ person.name }}</h3>
              <p class="text-accent">{{ person.role }}</p>
              <p class="text-secondary">{{ person.bio }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Policies -->
    <section id="policies" class="section section--inverse on-dark">
      <div class="container">
        <UiSectionHeader
          eyebrow="How we conduct ourselves"
          title="Policy positions, stated plainly"
          lead="These hold whether or not a certificate is on the wall. Formal certification status is on the credentials page."
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

        <div v-reveal class="mt-12">
          <NuxtLink to="/credentials" class="btn btn--accent">
            Registrations, certifications and insurance
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Offices -->
    <section class="section">
      <div class="container">
        <UiSectionHeader eyebrow="Presence" title="Three offices, one team" />
        <div v-reveal.stagger class="grid grid--3">
          <div v-for="office in company.offices" :key="office.city" class="card">
            <div class="cluster">
              <h3 class="card__title">{{ office.city }}</h3>
              <span v-if="office.isHeadquarters" class="pill pill--accent">
                Head office
              </span>
            </div>
            <address class="office__address">
              {{ office.street }}<br>{{ office.area }}, {{ office.state }}
            </address>
          </div>
        </div>
      </div>
    </section>

    <SectionsCtaBand
      title="Come and see whether we fit"
      lead="The first conversation costs nothing and usually clarifies the problem even when it does not lead to a project."
    />
  </div>
</template>

<style scoped>
.about-media {
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
}

.about-media :deep(img) {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.office__address {
  margin-block-start: var(--space-3);
  font-style: normal;
  font-size: var(--fs-sm);
  line-height: 1.7;
  color: var(--text-secondary);
}
</style>
