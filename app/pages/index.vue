<script setup lang="ts">
import { company } from '~/data/company'

useSeoMeta({
  title: 'Cipher4 AI & Robotics | Intelligence for critical operations',
  description:
    'Cipher4 builds software platforms and robotic systems for transport, logistics, oil and gas, and supply chain operations in Nigeria and West Africa. Fleet and asset intelligence, offshore inspection robotics, and enterprise technology deployment.',
  ogTitle: 'Cipher4 AI & Robotics | Intelligence for critical operations',
  ogDescription:
    'Software platforms and robotic systems that keep cargo, energy and crews moving across road, sea and air.',
  ogType: 'website',
})

const { data: articles } = await useAsyncData('home-insights', () =>
  queryCollection('insights')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .limit(3)
    .all(),
)

/**
 * The work wall.
 *
 * REAL PROJECT SCREENSHOTS. These are derivatives, not the files as supplied —
 * see scripts/ and public/images/work/. What was removed and why:
 *
 *   - the browser chrome, which carried the live and staging URLs
 *   - the named users ("Kasim Auwal Lawal", "Sadiq") shown as logged in
 *   - the operation record's commercial detail: product, volume, counterparty
 *     depot, route and currency for a live client transaction
 *
 * They were removed by cropping and downscaling to tile resolution rather than
 * by masking, so nothing is recoverable from the shipped file.
 *
 * STILL OUTSTANDING: the client's name is legible in the sidebar. projects.ts
 * requires written permission before any client is named on this site. If that
 * permission does not exist, mask the sidebar identity block before launch.
 *
 * Deliberately no `href` on any tile: they are atmosphere, not navigation.
 * Giving them links would put a dozen duplicate destinations in the tab order
 * for no gain — see the note in DriftWall.vue about the reference making every
 * tile focusable.
 */
const environmentTiles = [
  { image: '/images/work/work-quicktrips-home.jpg', title: 'Quick Trips travel platform — booking home page' },
  { image: '/images/work/work-command-centre.jpg', title: 'Operations command centre' },
  { image: '/images/work/work-heritage-navigation.jpg', title: 'Heritage Navigation — maritime and energy logistics site' },
  { image: '/images/work/work-quicktrips-services.jpg', title: 'Quick Trips — visa, reservation and ground-support services' },
  { image: '/images/work/work-harbours360-demo.jpg', title: 'Harbours360 — guided demo booking flow' },
  { image: '/images/work/work-harbours360-listings.jpg', title: 'Harbours360 — marine equipment listings' },
  { image: '/images/work/work-maritime-signin.jpg', title: 'Maritime profile sign-in' },
  { image: '/images/work/work-operation-record.jpg', title: 'Operation record and status timeline' },
  { image: '/images/work/work-quicktrips-home.jpg', title: 'Quick Trips travel platform — booking home page' },
  { image: '/images/work/work-harbours360-listings.jpg', title: 'Harbours360 — marine equipment listings' },
]

const differentiators = [
  {
    icon: 'lucide:map-pin',
    title: 'We go to site',
    body: 'Our engineers mobilise to terminals, yards, vessels and offshore installations. Systems designed from a Lagos office and never seen in the field fail in predictable ways.',
  },
  {
    icon: 'lucide:plug',
    title: 'We integrate rather than replace',
    body: 'You already run an ERP, a maintenance system and a set of spreadsheets that work. We connect to what exists instead of asking you to abandon it.',
  },
  {
    icon: 'lucide:cloud-off',
    title: 'We assume the connection will drop',
    body: 'Offshore bandwidth is expensive and intermittent. Our field systems capture locally and sync when the link returns, rather than failing when it does not.',
  },
  {
    icon: 'lucide:flag',
    title: 'Nigerian company, Nigerian engineers',
    body: 'Local capability is a scored criterion under the NOGICD Act, and a practical one. Our people are a drive away, not a visa away.',
  },
]
</script>

<template>
  <div>
    <SectionsHomeHero />

    <!-- ==================================================================
         PROOF
         Directly after the hero, per the sector pattern from ui-ux-pro-max:
         legal standing and capability get checked before anyone reads a
         value proposition. Everything in here is gated on real data and
         renders nothing when the data is absent.
         ================================================================== -->
    <SectionsProofStrip />

    <!-- ==================================================================
         WHERE WE WORK
         Alternating rows rather than a four-tile grid: each sector gets room
         to name a real operational constraint, which is the buyer's actual
         question. See SectionsWhereWeWork.
         ================================================================== -->
    <SectionsWhereWeWork />

    <!-- ==================================================================
         WHAT WE DO
         Alternating illustrated rows rather than a three-tile grid — each
         capability gets the room its summary needs. See SectionsWhatWeDo.
         ================================================================== -->
    <SectionsWhatWeDo />


    <!-- ==================================================================
         DIFFERENTIATORS
         ================================================================== -->
    <section class="section">
      <div class="container">
        <div class="split">
          <div v-reveal="'left'">
            <p class="eyebrow">Why Cipher4</p>
            <h2 class="mt-4">Built by people who have been on the boat</h2>
            <p class="lead mt-4">
              There is a category of technology company that produces very good
              demonstrations and very poor field results. The difference is
              almost always whether anyone involved has worked in the
              conditions the system has to survive.
            </p>
            <div class="cluster mt-8">
              <NuxtLink to="/about" class="btn btn--primary">About Cipher4</NuxtLink>
              <NuxtLink to="/credentials" class="btn btn--secondary">
                Credentials &amp; compliance
              </NuxtLink>
            </div>
          </div>

          <div v-reveal.stagger="'right'" class="diff-grid">
            <div v-for="item in differentiators" :key="item.title" class="diff">
              <div class="icon-plate">
                <Icon :name="item.icon" size="20" />
              </div>
              <div>
                <h3 class="diff__title">{{ item.title }}</h3>
                <p class="diff__body">{{ item.body }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <SectionsProcessFlow />

    <!-- ==================================================================
         THE ENVIRONMENT
         A visual break between the process detail above and the closing CTA
         below — the places these systems actually run, rather than another
         block of prose. Full-bleed so the wall reads as a field continuing
         past the frame.
         ================================================================== -->
    <section class="section section--subtle environment">
      <div class="container">
        <UiSectionHeader
          eyebrow="Systems in production"
          title="Built, commissioned, and running"
          lead="Marine bunkering and anchor operations, run end to end: operation records, vessel and truck movement, naval clearances, proof of delivery and the finance trail behind them."
        />
      </div>

      <div class="environment__wall">
        <UiDriftWall :items="environmentTiles" :columns="5" />
      </div>
    </section>

    <!-- ==================================================================
         PROOF — three concrete ways to verify us, which is more useful to a
         buyer than a wall of logos and is honest while case studies are
         still going through client approval.
         ================================================================== -->
    <section class="section">
      <div class="container">
        <UiSectionHeader
          eyebrow="Proof of work"
          title="Three ways to check us before you commit"
          lead="Every vendor says they are reliable. These are the things you can actually do to find out whether we are."
        />

        <div v-reveal.stagger class="grid grid--3">
          <div class="card proof">
            <div class="icon-plate icon-plate--solid">
              <Icon name="lucide:phone-call" size="20" />
            </div>
            <div class="card__body mt-4">
              <h3 class="card__title">Ask for a reference call</h3>
              <p class="text-secondary">
                Tell us the sector and scope you are evaluating and we will
                put you in touch with the closest comparable client, subject
                to their consent.
              </p>
            </div>
            <p class="card__footer">
              <NuxtLink to="/contact" class="proof__link">
                Request a reference
                <Icon name="lucide:arrow-right" size="16" />
              </NuxtLink>
            </p>
          </div>

          <div class="card proof">
            <div class="icon-plate icon-plate--solid">
              <Icon name="lucide:flask-conical" size="20" />
            </div>
            <div class="card__body mt-4">
              <h3 class="card__title">Start with a pilot</h3>
              <p class="text-secondary">
                One site, one route, one asset class. Small enough that being
                wrong is cheap, real enough to prove whether the thing works
                in your conditions.
              </p>
            </div>
            <p class="card__footer">
              <NuxtLink to="/solutions#process" class="proof__link">
                How a pilot runs
                <Icon name="lucide:arrow-right" size="16" />
              </NuxtLink>
            </p>
          </div>

          <div class="card proof">
            <div class="icon-plate icon-plate--solid">
              <Icon name="lucide:file-check-2" size="20" />
            </div>
            <div class="card__body mt-4">
              <h3 class="card__title">Read the paperwork</h3>
              <p class="text-secondary">
                Registrations, insurance, HSE position, security posture and
                data-ownership terms, collected in one place for
                prequalification.
              </p>
            </div>
            <p class="card__footer">
              <NuxtLink to="/credentials" class="proof__link">
                Credentials &amp; compliance
                <Icon name="lucide:arrow-right" size="16" />
              </NuxtLink>
            </p>
          </div>
        </div>

        <div v-reveal class="proof__note">
          <Icon name="lucide:folder-open" size="20" />
          <p>
            Case studies are being written up. Each one goes to the client for
            approval before we publish it, which is why the
            <NuxtLink to="/projects">projects page</NuxtLink> is short.
          </p>
        </div>
      </div>
    </section>

    <!-- ==================================================================
         INSIGHTS
         ================================================================== -->
    <section v-if="articles?.length" class="section section--subtle">
      <div class="container">
        <UiSectionHeader
          eyebrow="Insights"
          title="Notes from the work"
          lead="Written by the engineers doing it, about problems we keep running into."
        />

        <div v-reveal.stagger class="grid grid--3">
          <article
            v-for="article in articles"
            :key="article.path"
            class="card card--interactive card--link"
          >
            <div class="cluster">
              <span v-if="article.sector" class="pill pill--accent">
                {{ article.sector }}
              </span>
              <span v-if="article.readingTime" class="pill">
                {{ article.readingTime }}
              </span>
            </div>
            <h3 class="card__title mt-3">
              <NuxtLink :to="article.path" class="card__stretch">
                {{ article.title }}
              </NuxtLink>
            </h3>
            <p class="text-secondary">{{ article.description }}</p>
          </article>
        </div>

        <div v-reveal class="mt-10">
          <NuxtLink to="/insights" class="btn btn--secondary">
            All insights
          </NuxtLink>
        </div>
      </div>
    </section>

    <SectionsCtaBand
      title="Tell us what you are trying to fix"
      :lead="`Most conversations start with an operational problem rather than a technology. Describe yours and we will tell you honestly whether we are the right people for it. ${company.responseTime}`"
    />
  </div>
</template>

<style scoped>
/* --- The environment wall ------------------------------------------------
   Full-bleed and fixed-height. The wall masks its own edges, so it needs no
   container and no border — it simply dissolves into the section.
   ---------------------------------------------------------------------- */

.environment__wall {
  margin-block-start: var(--space-12);
  height: 34rem;
}

@media (max-width: 48rem) {
  .environment__wall { height: 24rem; }
}



.sector__cue :deep(svg) {
  transition: transform var(--dur-base) var(--ease-out);
}

.sector:hover .sector__cue :deep(svg) {
  transform: translateX(5px);
}

/* --- Differentiators ----------------------------------------------------- */

.diff-grid {
  display: grid;
  gap: var(--space-6);
}

.diff {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-4);
  align-items: start;
}

.diff__title {
  font-size: var(--fs-h4);
  font-weight: var(--fw-semibold);
}

.diff__body {
  margin-block-start: var(--space-2);
  font-size: var(--fs-sm);
  line-height: var(--lh-body);
  color: var(--text-secondary);
}

/* --- Proof --------------------------------------------------------------- */

.proof__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-accent);
}

.proof__link :deep(svg) {
  transition: transform var(--dur-base) var(--ease-out);
}

.proof:hover .proof__link :deep(svg) {
  transform: translateX(4px);
}

.proof__note {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-4);
  align-items: start;
  max-width: 46rem;
  margin-block-start: var(--space-10);
  padding: var(--space-5);
  border-radius: var(--radius-md);
  background-color: var(--bg-subtle);
  font-size: var(--fs-sm);
  line-height: var(--lh-body);
  color: var(--text-secondary);
}

.proof__note :deep(svg) {
  color: var(--text-accent);
  margin-block-start: 0.15em;
}

.proof__note a {
  color: var(--text-accent);
  text-decoration: underline;
}

</style>
