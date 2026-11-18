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
  gsap.fromTo(words, { opacity: 0.28 }, {
    opacity: 1,
    ease: 'none',
    stagger: 0.12,
    scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 42%', scrub: 0.4 },
  })
})
</script>

<template>
  <section class="hm c4-section" aria-labelledby="hm-eyebrow">
    <div class="c4-wrap hm__inner">
      <Eyebrow id="hm-eyebrow">{{ mission.eyebrow }}</Eyebrow>
      <p ref="statement" class="hm__statement">
        <span class="hm__quiet"><template v-for="(w, k) in quiet" :key="`q${k}`"><span class="hm__w">{{ w }}</span>{{ k < quiet.length - 1 ? ' ' : '' }}</template></span>
        {{ ' ' }}<span class="hm__strong"><template v-for="(w, k) in strong" :key="`s${k}`"><span class="hm__w">{{ w }}</span>{{ k < strong.length - 1 ? ' ' : '' }}</template></span><span class="c4-sr-only">.</span><span class="hm__node" aria-hidden="true" />
      </p>
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

.hm__inner {
  display: flex;
  flex-direction: column;
  gap: var(--s-48);
}

.hm__statement {
  max-width: 1180px;
  font-size: clamp(36px, 5.4vw, 78px);
  line-height: 1.06;
  letter-spacing: -0.04em;
  text-wrap: balance;
}

/* Grey on white is 3.1:1, passing for large text (this is 36 px or more). */
.hm__quiet {
  color: var(--grey);
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
  align-self: flex-end;
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

@media (max-width: 767px) {
  .hm__inner {
    gap: var(--s-24);
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
