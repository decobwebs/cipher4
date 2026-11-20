<script setup lang="ts">
/**
 * Mission statement (content C3, with the G1 mission paragraph that the
 * Home board places beside it). The full stop is drawn as the amber
 * signal node; screen readers still get the full stop.
 */
import { mission } from '~/data/home'

// Choreography 03, words light up as you read: the statement starts in soft
// grey (still readable) and darkens word by word as you scroll through it.
// You set the pace. Scrubbed to the scroll, both ways.
const quiet = mission.quiet.split(' ')
const strong = mission.strong.split(' ')
const statement = useTemplateRef<HTMLElement>('statement')

useScrollMoment(({ gsap }) => {
  const el = statement.value
  if (!el) return
  const words = el.querySelectorAll('.hm__w')
  // From 62%: still AA for this large text (3:1) at the start of the effect.
  gsap.fromTo(words, { opacity: 0.62 }, {
    opacity: 1,
    ease: 'none',
    stagger: 0.12,
    // Fully dark by the time the statement reaches the middle of the screen,
    // where it is read (owner's review: the last words stayed grey).
    scrollTrigger: { trigger: el, start: 'top 90%', end: 'bottom 75%', scrub: 0.3 },
  })
})
</script>

<template>
  <section class="hm c4-section bp-host" aria-labelledby="hm-eyebrow">
    <BlueprintGround kind="grid" draw="left" marks sheet="SHEET 01 / 09" dwg="DWG C4-001" />
    <div class="c4-wrap hm__inner">
      <Eyebrow id="hm-eyebrow" class="hm__eyebrow">{{ mission.eyebrow }}</Eyebrow>
      <p ref="statement" class="hm__statement">
        <span class="hm__quiet"><template v-for="(w, k) in quiet" :key="`q${k}`"><span class="hm__w">{{ w }}</span>{{ k < quiet.length - 1 ? ' ' : '' }}</template></span>
        {{ ' ' }}<span class="hm__strong"><template v-for="(w, k) in strong" :key="`s${k}`"><span class="hm__w">{{ w }}</span>{{ k < strong.length - 1 ? ' ' : '' }}</template></span><span class="c4-sr-only">.</span><span class="hm__node" aria-hidden="true" />
      </p>
      <!-- Under the sentence, on the left: the mission as a diagram. -->
      <MissionDiagram class="hm__diagram" />
      <div v-m="'rise'" class="hm__side">
        <p class="hm__support">{{ mission.support }}</p>
        <C4Button :to="mission.link.to" variant="text">{{ mission.link.label }}</C4Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hm {
  background: var(--white);
}

/* The sentence across the top; under it, the diagram on the left and the
   paragraph on the right, so neither column sits empty. */
.hm__inner {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  grid-template-areas:
    'eyebrow eyebrow'
    'statement statement'
    'diagram side';
  column-gap: var(--s-96);
  row-gap: var(--s-48);
  align-items: end;
}

.hm__eyebrow { grid-area: eyebrow; }
.hm__statement { grid-area: statement; }
.hm__diagram { grid-area: diagram; }
.hm__side { grid-area: side; }

.hm__statement {
  max-width: 1180px;
  font-size: clamp(36px, 5.4vw, 78px);
  line-height: 1.06;
  letter-spacing: -0.04em;
  text-wrap: balance;
}

/* Slate (4.9:1) rather than grey: the words start at 62% while you read
   (the scroll effect), which must still pass AA for large text (3:1). */
.hm__quiet {
  color: var(--slate);
}

.hm__strong {
  color: var(--ink);
}

.hm__node {
  display: inline-block;
  width: 0.2em;
  height: 0.2em;
  margin-left: 0.06em;
  border-radius: 50%;
  background: var(--amber);
  box-shadow: 0 0 0 0.14em rgba(245, 165, 36, 0.18);
}

.hm__side {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--s-24);
  max-width: 460px;
}

.hm__support {
  font-size: 18px;
  line-height: 1.6;
  color: var(--slate);
}

@media (max-width: 1024px) {
  .hm__inner {
    grid-template-columns: 1fr;
    grid-template-areas: 'eyebrow' 'statement' 'side' 'diagram';
    row-gap: var(--s-32);
  }
}

@media (max-width: 767px) {
  .hm__inner {
    row-gap: var(--s-24);
  }

  .hm__statement {
    line-height: 1.08;
  }

  .hm__side {
    align-self: stretch;
    gap: var(--s-8);
  }

  .hm__support {
    font-size: 16px;
  }
}
</style>
