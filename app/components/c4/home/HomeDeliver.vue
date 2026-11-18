<script setup lang="ts">
/**
 * How we deliver (content C8). Desktop: six stages across, joined by an
 * amber track (Home-Desktop). Phones: a vertical timeline (Home-Mobile).
 *
 * Choreography 08 and Motion board 04, the journey (scroll-linked):
 *   desktop  the section holds still while you scroll; the road above the
 *            stages drives forward only while you scroll (useRoadController:
 *            'deliver' roads follow the scroll speed), and each stage lights
 *            as you reach it. The stage text sits below the road, never on it.
 *   phones   no hold and no road; each stage lights as it crosses the screen.
 * Scrolling back up dims them again. Reduced motion: all stages lit, no hold.
 */
import { deliver } from '~/data/home'

const section = useTemplateRef<HTMLElement>('section')
const stagesEl = useTemplateRef<HTMLElement>('stages')
/** Highest stage reached (-1: none yet). Only used while the journey runs. */
const lit = ref(-1)
const journey = ref(false)

useScrollMoment(({ gsap, ScrollTrigger }) => {
  const el = section.value
  if (!el) return
  journey.value = true
  const mm = gsap.matchMedia()

  mm.add('(min-width: 1025px)', () => {
    const n = deliver.stages.length
    // Hold where the stages are in view: from the top if the whole section
    // fits the screen, otherwise once its bottom reaches the screen's.
    const fits = el.offsetHeight <= window.innerHeight
    ScrollTrigger.create({
      trigger: el,
      start: fits ? 'top top' : 'bottom bottom',
      end: `+=${Math.round(window.innerHeight * 0.42 * n)}`,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => { lit.value = Math.min(n - 1, Math.floor(self.progress * n * 0.999 + 0.0001)) },
      onLeave: () => { lit.value = n - 1 },
      onLeaveBack: () => { lit.value = 0 },
    })
    lit.value = 0
  })

  mm.add('(max-width: 1024px)', () => {
    const items = stagesEl.value?.querySelectorAll<HTMLElement>('.hd__stage') ?? []
    items.forEach((it, k) => {
      ScrollTrigger.create({
        trigger: it,
        start: 'top 68%',
        onEnter: () => { lit.value = Math.max(lit.value, k) },
        onLeaveBack: () => { lit.value = Math.min(lit.value, k - 1) },
      })
    })
  })

  return () => { mm.revert(); journey.value = false }
})
</script>

<template>
  <section ref="section" class="hd c4-section c4-section--paper" :class="{ 'm-journey': journey }" aria-labelledby="hd-title">
    <div class="c4-wrap">
      <SectionHeader title-id="hd-title" :eyebrow="deliver.eyebrow" :title="deliver.title" :lead="deliver.lead">
        <template #action>
          <C4Button :to="deliver.link.to" variant="text">{{ deliver.link.label }}</C4Button>
        </template>
      </SectionHeader>

      <!-- The road ahead (desktop): moves only while you scroll. -->
      <div class="hd__road" aria-hidden="true">
        <HyperspeedRoad preset="deliver" />
      </div>

      <ol ref="stages" class="hd__stages">
        <li
          v-for="(s, i) in deliver.stages"
          :key="s.n"
          class="hd__stage"
          :class="{ 'is-lit': !journey || i <= lit, 'is-passed': !journey || i < lit }"
          :aria-current="journey && i === lit ? 'step' : undefined"
        >
          <span class="hd__track" aria-hidden="true">
            <span class="hd__dot" />
            <span v-if="i < deliver.stages.length - 1" class="hd__line" />
          </span>
          <div class="hd__body">
            <C4Icon :name="s.icon" :size="40" :delay="i * 0.2" class="hd__icon" />
            <h3 class="hd__title"><span class="hd__n">{{ s.n }}</span> {{ s.title }}</h3>
            <p class="hd__text">{{ s.text }}</p>
            <p class="hd__receive">
              <span class="hd__label">{{ deliver.receiveLabel }}<span class="c4-sr-only">:</span></span>
              {{ s.receive }}
            </p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.hd__road {
  height: 200px;
  margin: calc(-1 * var(--s-48)) 0 var(--s-32);
}

@media (max-width: 1024px) {
  .hd__road {
    display: none;
  }
}

.hd__stages {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(190px, 100%), 1fr));
  row-gap: var(--s-48);
  list-style: none;
}

.hd__stage {
  display: flex;
  flex-direction: column;
  gap: var(--s-16);
  padding-right: var(--s-24);
}

.hd__track {
  display: flex;
  align-items: center;
}

.hd__dot {
  flex: none;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--amber);
  box-shadow: 0 0 0 5px rgba(245, 165, 36, 0.22);
}

.hd__line {
  flex: 1;
  height: 2px;
  margin-right: calc(-1 * var(--s-24));
  background: var(--amber);
}

.hd__body {
  display: flex;
  flex-direction: column;
  gap: var(--s-16);
}

.hd__title {
  font-size: 20px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.hd__n {
  font-variant-numeric: tabular-nums;
}

.hd__text {
  font-size: 15px;
  line-height: 1.55;
  color: var(--slate);
}

.hd__receive {
  padding-top: var(--s-12);
  border-top: 1px solid var(--line);
  font-size: 14px;
  line-height: 1.5;
  color: var(--ink-2);
}

.hd__label {
  display: block;
  margin-bottom: var(--s-4);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slate);
}

/* Phones: a vertical timeline, dot and line on the left. */
@media (max-width: 767px) {
  .hd__stages {
    display: flex;
    flex-direction: column;
    row-gap: 0;
  }

  .hd__stage {
    display: grid;
    grid-template-columns: 20px 1fr;
    gap: var(--s-16);
    padding-right: 0;
  }

  .hd__track {
    flex-direction: column;
    align-items: center;
  }

  .hd__dot {
    width: 12px;
    height: 12px;
    margin-top: var(--s-4);
    box-shadow: 0 0 0 4px rgba(245, 165, 36, 0.22);
  }

  .hd__line {
    width: 2px;
    height: auto;
    margin-right: 0;
  }

  .hd__body {
    gap: var(--s-8);
    padding-bottom: var(--s-32);
  }

  .hd__icon {
    display: none;
  }

  .hd__title {
    font-size: 19px;
  }

  .hd__receive {
    padding-top: var(--s-8);
  }
}
</style>
