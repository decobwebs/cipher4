<script setup lang="ts">
/**
 * Case study template (Page-Case board, Phone-Screens 06), used for
 * /work/reliant-anchor and /work/harbours360 (content F2, F3) and, with the
 * "Product" label, for /products/lucidhr (F4).
 *
 * The board shows the screenshots in a frame with browser dots; content F1
 * and the Main board say no browser chrome, so the frame is plain.
 * The board's intro sentence under the H1 is not in the content file, so
 * case studies have no lead (LucidHR has its own, from F4).
 */
import { caseBySlug, CASE_LABELS, type Case } from '~/data/work'
import type { C4IconName } from '~/lib/icons'

const props = defineProps<{ item: Case }>()
const c = computed(() => props.item)
const next = computed(() => (c.value.next ? caseBySlug(c.value.next) : undefined))

useSeoMeta({
  title: () => c.value.seo.title,
  description: () => c.value.seo.description,
  ogTitle: () => c.value.seo.title,
  ogDescription: () => c.value.seo.description,
})

// Header drawing (owner, 20 Nov 2026): the platform's kind of work.
const DRAWINGS: Record<string, { icon: C4IconName; code: string }> = {
  'reliant-anchor': { icon: 'job-control', code: 'C4-031' },
  harbours360: { icon: 'digital-platforms', code: 'C4-032' },
  lucidhr: { icon: 'ai-automation', code: 'C4-033' },
}
const drawing = computed(() => DRAWINGS[c.value.slug] ?? { icon: 'operational-platforms' as C4IconName, code: 'C4-039' })

const crumbs = computed(() => c.value.kind === 'product'
  ? [{ label: 'Home', to: '/' }, { label: 'Work', to: '/work' }, { label: 'LucidHR' }]
  : [{ label: 'Home', to: '/' }, { label: 'Work', to: '/work' }, { label: c.value.facts?.[0]?.value ?? c.value.title }])

const steps = computed(() => {
  const out: { n: string; label: string; key: 'challenge' | 'solution' | 'result' }[] = []
  if (c.value.challenge) out.push({ n: '01', label: CASE_LABELS.challenge, key: 'challenge' })
  if (c.value.solution) out.push({ n: '02', label: CASE_LABELS.solution, key: 'solution' })
  if (c.value.result) out.push({ n: '03', label: CASE_LABELS.result, key: 'result' })
  return out
})

// Choreography 20: the result's key words, one marker per word, so the
// amber sweep runs along every line.
const hlWords = computed(() => c.value.result?.highlight.split(' ') ?? [])

// Choreography 19, the screen opens up: the product image starts as a
// small window and opens out to the page's full width as you scroll to it
// (scrubbed, so scrolling back closes it again).
const imageBox = useTemplateRef<HTMLElement>('imageBox')
const frame = useTemplateRef<HTMLElement>('frame')
useScrollMoment(({ gsap }) => {
  if (!frame.value || !imageBox.value) return
  gsap.fromTo(frame.value, { scale: 0.62, y: 40 }, {
    scale: 1,
    y: 0,
    ease: 'none',
    scrollTrigger: { trigger: imageBox.value, start: 'top 95%', end: 'top 15%', scrub: 0.5 },
  })
})
</script>

<template>
  <div>
    <PageHero
      :crumbs="crumbs"
      :eyebrow="c.eyebrow"
      :title="c.title"
      :lead="c.lead"
      :drawing="drawing"
      size="case"
      :text-width="720"
      :min-height="660"
    >
      <template v-if="c.facts" #meta>
        <dl class="cs-facts">
          <div v-for="f in c.facts" :key="f.label" class="cs-fact">
            <dt>{{ f.label }}</dt>
            <dd>{{ f.value }}</dd>
          </div>
        </dl>
      </template>
      <template v-if="c.kind === 'product'" #actions>
        <C4Button v-for="a in c.actions" :key="a.label" :to="a.to" :href="a.href" :variant="a.variant" :arrow="a.variant === 'primary'">{{ a.label }}</C4Button>
      </template>
    </PageHero>

    <!-- The product image: white above, mist below (board). -->
    <section ref="imageBox" class="cs-image" aria-label="Screenshot">
      <div class="c4-wrap">
        <div ref="frame" class="cs-frame m-open">
          <img :src="c.image.src" :alt="c.image.alt" :width="c.image.w" :height="c.image.h" fetchpriority="high">
        </div>
      </div>
    </section>

    <!-- LucidHR: who it is for (F4) -->
    <section v-if="c.audiences" class="c4-section" aria-label="Who LucidHR is for">
      <div class="c4-wrap cs-audiences">
        <article v-for="(a, i) in c.audiences" :key="a.title" v-m="'rise'" class="c4-card cs-audience" :style="{ '--i': i }">
          <h2 class="cs-audience__title">{{ a.title }}</h2>
          <p class="cs-audience__text">{{ a.text }}</p>
        </article>
      </div>
    </section>

    <!-- Challenge, solution, result -->
    <section
      v-for="st in steps"
      :key="st.key"
      class="c4-section cs-step"
      :class="{ 'cs-step--result': st.key === 'result', 'cs-step--tight': st.key === 'solution' }"
      :aria-labelledby="`cs-${st.key}`"
    >
      <div class="c4-wrap cs-step__grid">
        <div class="cs-step__label">
          <span class="cs-step__n" aria-hidden="true">{{ st.n }}</span>
          <h2 :id="`cs-${st.key}`" class="cs-step__name">{{ st.label }}</h2>
        </div>
        <div class="cs-step__body">
          <p v-if="st.key === 'challenge'" v-m="'rise'" class="cs-challenge"><span>{{ c.challenge }}</span></p>
          <template v-else-if="st.key === 'solution' && c.solution">
            <p class="cs-solution">{{ c.solution.text }}</p>
            <ul v-m="'rise'" class="cs-points">
              <li v-for="(p, i) in c.solution.points" :key="p">
                <C4Icon name="check" :size="32" :delay="i * 0.2" />
                <span>{{ p }}</span>
              </li>
            </ul>
          </template>
          <template v-else-if="st.key === 'result' && c.result">
            <!-- Choreography 20: the outcome gets underlined. -->
            <p v-m="'underline'" class="cs-result">{{ c.result.before }}<span class="cs-hl"><template v-for="(w, k) in hlWords" :key="k"><span class="m-hl" :style="{ '--i': k }">{{ w }}</span>{{ k < hlWords.length - 1 ? ' ' : '' }}</template></span></p>
            <div class="cs-actions">
              <C4Button v-for="a in c.actions" :key="a.label" :to="a.to" :href="a.href" :external="!!a.href" :variant="a.variant" :arrow="a.variant === 'primary'">{{ a.label }}</C4Button>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Next -->
    <section v-if="next" class="c4-section" aria-label="Next">
      <div class="c4-wrap">
        <NuxtLink v-m="'rise'" :to="next.path" class="c4-card cs-next">
          <span class="cs-next__copy">
            <span class="c4-label">{{ next.kind === 'case' ? CASE_LABELS.nextCase : CASE_LABELS.next }}</span>
            <span class="cs-next__text">
              <span class="cs-next__name">{{ next.facts?.[0]?.value ?? 'LucidHR' }}</span>
              <span class="cs-next__line">{{ next.title }}</span>
            </span>
            <span class="cs-next__more">{{ next.kind === 'product' ? 'Learn more' : 'Read the case study' }}<C4Glyph name="arrow" class="cs-next__arrow" /></span>
          </span>
          <span class="cs-next__media">
            <img :src="next.image.src" alt="" :width="next.image.w" :height="next.image.h" loading="lazy">
          </span>
        </NuxtLink>
      </div>
    </section>

    <ClosingBand />
  </div>
</template>

<style scoped>
/* Facts under the H1 */
.cs-facts {
  display: grid;
  grid-template-columns: repeat(3, auto);
  justify-content: start;
  gap: var(--s-48);
  margin: 0;
  padding-top: var(--s-24);
  border-top: 1px solid var(--line);
}

.cs-fact {
  display: flex;
  flex-direction: column;
  gap: var(--s-8);
}

.cs-fact dt {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--grey);
}

.cs-fact dd {
  margin: 0;
  font-size: 17px;
  font-weight: 500;
}

/* Image */
.cs-image {
  padding-bottom: var(--section-y);
  background: linear-gradient(180deg, var(--white) 0%, var(--white) 30%, var(--mist) 30%, var(--mist) 100%);
}

.cs-frame {
  overflow: hidden;
  border-radius: 16px;
  background: var(--white);
  border: 1px solid var(--line-2);
  box-shadow: 0 40px 90px rgba(16, 32, 104, 0.16);
}

.cs-frame img {
  width: 100%;
  height: auto;
}

/* LucidHR audiences */
.cs-audiences {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-24);
}

.cs-audience {
  display: flex;
  flex-direction: column;
  gap: var(--s-16);
  padding: var(--s-48);
}

.cs-audience__title {
  font-size: 26px;
  line-height: 1.25;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.cs-audience__text {
  font-size: 18px;
  line-height: 1.6;
  color: var(--slate);
}

/* Steps */
.cs-step {
  background: var(--white);
}

.cs-step--tight {
  padding-top: 0;
}

.cs-step--result {
  background: var(--paper);
}

.cs-step__grid {
  display: grid;
  grid-template-columns: 3fr 9fr;
  gap: var(--s-96);
  align-items: start;
}

.cs-step__label {
  position: sticky;
  top: 120px;
  display: flex;
  flex-direction: column;
  gap: var(--s-12);
}

/* Large outlined numerals, like a drafting stencil, so the step's column
   carries weight beside its text (owner, 20 Nov 2026: no empty columns).
   Decorative (aria-hidden); the step's name is the heading. */
.cs-step__n {
  position: relative;
  padding-left: var(--s-24);
  font-family: var(--font-sans);
  font-size: clamp(88px, 9vw, 144px);
  line-height: 0.9;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1.5px var(--indigo);
}

/* A measuring tick down its left side. */
.cs-step__n::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8%;
  bottom: 8%;
  width: 9px;
  border-top: 1px solid var(--line-2);
  border-bottom: 1px solid var(--line-2);
  background: linear-gradient(var(--line-2), var(--line-2)) center / 1px 100% no-repeat;
}

.cs-step__name {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--indigo);
}

.cs-step__body {
  max-width: 900px;
}

.cs-challenge {
  font-size: clamp(24px, 2.3vw, 32px);
  line-height: 1.45;
  letter-spacing: -0.02em;
}

.cs-solution {
  margin-bottom: var(--s-48);
  font-size: 21px;
  line-height: 1.6;
  color: var(--ink-2);
}

.cs-points {
  list-style: none;
}

.cs-points li {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: var(--s-16);
  align-items: center;
  padding: var(--s-24) 0;
  border-top: 1px solid var(--line);
  font-size: 19px;
  line-height: 1.45;
}

.cs-points li:last-child {
  border-bottom: 1px solid var(--line);
}

.cs-result {
  font-size: clamp(32px, 3.6vw, 52px);
  line-height: 1.18;
  letter-spacing: -0.035em;
}

/* The outcome underlined in amber (finished state; drawn in Phase 6). */
/* The amber marker under each word is .m-hl (assets/css/motion.css): shown
   finished without motion, swept in word by word with it. */
.cs-hl {
  color: var(--ink);
}

.cs-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-12);
  margin-top: var(--s-48);
}

/* Next */
.cs-next {
  display: grid;
  grid-template-columns: 5fr 7fr;
  overflow: hidden;
  transition: border-color var(--dur-ui) var(--ease-out), box-shadow var(--dur-ui) var(--ease-out);
}

.cs-next:hover {
  border-color: var(--line-2);
  box-shadow: var(--shadow-float);
}

.cs-next__copy {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--s-48);
  padding: var(--s-48);
}

.cs-next__text {
  display: flex;
  flex-direction: column;
  gap: var(--s-16);
}

.cs-next__name {
  font-size: 48px;
  line-height: 1;
  letter-spacing: -0.04em;
}

.cs-next__line {
  max-width: 380px;
  font-size: 18px;
  line-height: 1.55;
  color: var(--slate);
}

.cs-next__more {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 500;
  color: var(--indigo);
}

.cs-next__arrow {
  color: var(--amber);
  transition: transform var(--dur-ui) var(--ease-out);
}

.cs-next:hover .cs-next__arrow {
  transform: translateX(4px);
}

.cs-next__media {
  display: flex;
  padding: var(--s-48) 0 0 var(--s-48);
  background: var(--mist);
}

.cs-next__media img {
  width: 100%;
  height: 100%;
  min-height: 280px;
  object-fit: cover;
  object-position: left top;
  border-radius: 14px 0 0 0;
  border: 1px solid var(--line-2);
  border-right: 0;
  border-bottom: 0;
  box-shadow: 0 30px 70px rgba(16, 32, 104, 0.14);
}

/* --- Tablets and phones ------------------------------------------------------ */
@media (max-width: 1100px) {
  .cs-step__grid {
    grid-template-columns: 1fr;
    gap: var(--s-32);
  }

  .cs-step__label {
    position: static;
    flex-direction: row;
    align-items: baseline;
    gap: var(--s-16);
  }

  .cs-step__n {
    font-size: 56px;
  }
}

@media (max-width: 900px) {
  .cs-audiences,
  .cs-next {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .cs-facts {
    grid-template-columns: 1fr 1fr;
    gap: var(--s-16) var(--s-24);
  }

  .cs-frame {
    border-radius: 12px;
    box-shadow: 0 24px 50px rgba(16, 32, 104, 0.14);
  }

  .cs-audience {
    padding: var(--s-24);
  }

  .cs-audience__title {
    font-size: 21px;
  }

  .cs-audience__text,
  .cs-solution {
    font-size: 17px;
  }

  .cs-points li {
    font-size: 16px;
  }

  .cs-next__copy {
    padding: var(--s-24);
    gap: var(--s-32);
  }

  .cs-next__name {
    font-size: 36px;
  }

  .cs-next__media {
    padding: var(--s-24) 0 0 var(--s-24);
  }

  .cs-next__media img {
    min-height: 180px;
  }
}
</style>
