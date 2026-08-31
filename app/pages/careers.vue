<script setup lang="ts">
import { company } from '~/data/company'

useSeoMeta({
  title: 'Careers | Cipher4 AI & Robotics',
  description:
    'Engineering roles at Cipher4 AI & Robotics. We build systems for transport, logistics, oil and gas, and supply chain operations across Nigeria.',
})

/**
 * TODO(cipher4): add live vacancies here. While the array is empty the page
 * shows an open-application route instead, which is honest and still
 * collects good candidates.
 */
const roles: {
  title: string
  location: string
  type: string
  summary: string
}[] = []

const whatWeLookFor = [
  'Engineers who want to see their systems running in the field, not just in a repository',
  'People who are comfortable saying a plan will not work, and can explain why',
  'Willingness to travel to sites, terminals and offshore installations',
  'Care about the person who inherits the code, or the machine, after you',
]

const whatWeOffer = [
  'Work that ends up deployed on real operations, not in a slide deck',
  'Offshore and field certification paid for, where the role requires it',
  'Small senior team, so the work you do is visible',
  'Offices in Abuja, Lagos and Kaduna',
]
</script>

<template>
  <div>
    <UiPageHero
      eyebrow="Careers"
      title="Engineering that leaves the building"
      lead="We are a small team, and we build things that have to survive salt air, bad connectivity and people who are too busy to read a manual. If that sounds like the kind of constraint you enjoy, we should talk."
    />

    <section class="section">
      <div class="container">
        <div class="split">
          <div v-reveal="'left'">
            <p class="eyebrow">Who fits here</p>
            <h2 class="mt-4">What we look for</h2>
            <UiCheckList class="mt-6" :items="whatWeLookFor" />

            <h2 class="mt-12">What you get</h2>
            <UiCheckList class="mt-6" :items="whatWeOffer" />
          </div>

          <div v-reveal="'right'" class="careers-media">
            <NuxtImg
              src="/images/careers.jpg"
              alt="Cipher4 engineers working together on a deployment"
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

    <section class="section section--subtle">
      <div class="container">
        <UiSectionHeader
          eyebrow="Open roles"
          :title="roles.length ? 'Current vacancies' : 'No advertised vacancies right now'"
          :lead="
            roles.length
              ? 'Apply with a short note on what you have built and why it was hard.'
              : 'We hire when we meet the right person rather than only when a role opens. If your work fits what we do, write to us.'
          "
        />

        <div v-if="roles.length" v-reveal.stagger class="grid grid--2">
          <div v-for="role in roles" :key="role.title" class="card">
            <div class="cluster">
              <span class="pill">{{ role.location }}</span>
              <span class="pill">{{ role.type }}</span>
            </div>
            <h3 class="card__title mt-3">{{ role.title }}</h3>
            <p class="text-secondary">{{ role.summary }}</p>
          </div>
        </div>

        <div v-reveal class="card apply">
          <div class="icon-plate icon-plate--solid">
            <Icon name="lucide:send" size="20" />
          </div>
          <h3 class="card__title mt-4">Open application</h3>
          <p class="text-secondary">
            Send a CV and a short note describing something you built and what
            made it difficult. We read every one, and we reply.
          </p>
          <a
            :href="`mailto:${company.email}?subject=${encodeURIComponent('Open application')}`"
            class="btn btn--primary mt-6"
          >
            <Icon name="lucide:mail" size="18" />
            Apply to {{ company.email }}
          </a>
        </div>
      </div>
    </section>

    <SectionsCtaBand
      title="Not looking for a job, but have a project?"
      lead="The contact page is the right place for that."
      primary-label="Talk to us about a project"
      secondary-label="What we build"
      secondary-to="/solutions"
    />
  </div>
</template>

<style scoped>
.careers-media {
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
}

.careers-media :deep(img) {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.apply {
  align-items: start;
  max-width: 40rem;
  margin-block-start: var(--space-10);
  padding: var(--space-8);
}
</style>
