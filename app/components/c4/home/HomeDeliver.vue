<script setup lang="ts">
/**
 * How we deliver (content C8; Choreography 08; Motion board 04). Rebuilt
 * 19 Nov 2026 to the owner's brief (docs/redesign/DECISIONS.md):
 *
 *   desktop (1025 px and up), motion on
 *     The section pins. Scrolling down moves the six stages sideways: the
 *     row slides left, so you travel through them in reading order. Each
 *     stage lights as it reaches the centre of the screen. The light-speed
 *     road lies across the section beneath the stages (never under the
 *     words) and moves only while you scroll, at the scroll's speed
 *     ('deliver-across' road, useRoadController). After the last stage the
 *     page scrolls on normally; scrolling back up reverses everything.
 *
 *   phones and tablets
 *     No pin and no road: a vertical timeline, each stage lighting as it
 *     crosses the screen (and dimming again on the way back up).
 *
 *   reduced motion, or before the motion code has loaded
 *     The six stages in a row (desktop) or the timeline (phones), all lit.
 */
import { deliver } from '~/data/home'

const n = deliver.stages.length
const section = useTemplateRef<HTMLElement>('section')
const track = useTemplateRef<HTMLElement>('track')
/** Highest stage reached (-1: none yet). Only used while the journey runs. */
const lit = ref(-1)
/** 'across' (desktop, pinned) or 'down' (phones and tablets) while running. */
const mode = ref<'' | 'across' | 'down'>('')

useScrollMoment(({ gsap, ScrollTrigger }) => {
  const el = section.value
  const row = track.value
  if (!el || !row) return
  const mm = gsap.matchMedia()

  mm.add('(min-width: 1025px)', () => {
    mode.value = 'across'
    lit.value = 0
    // Wait one frame for the row layout (is-across) before measuring.
    let st: ReturnType<typeof ScrollTrigger.create> | null = null
    const raf = requestAnimationFrame(() => {
      const stages = [...row.querySelectorAll<HTMLElement>('.hd__stage')]
      const first = stages[0]!
      const last = stages[n - 1]!
      // How far the row travels: from the first stage centred to the last.
      const distance = () => last.offsetLeft - first.offsetLeft
      const tween = gsap.to(row, { x: () => -distance(), ease: 'none' })
      st = ScrollTrigger.create({
        trigger: el,
        start: () => (el.offsetHeight <= window.innerHeight ? 'top top' : 'bottom bottom'),
        end: () => `+=${Math.round(distance() * 1.15)}`,
        pin: true,
        scrub: 0.4,
        animation: tween,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // A stage lights as its centre reaches the screen's centre.
          lit.value = Math.min(n - 1, Math.floor(self.progress * (n - 1) + 0.08))
        },
      })
      ScrollTrigger.refresh()
    })
    return () => { cancelAnimationFrame(raf); st?.kill(); gsap.set(row, { clearProps: 'transform' }); mode.value = '' }
  })

  mm.add('(max-width: 1024px)', () => {
    mode.value = 'down'
    lit.value = -1
    const items = [...row.querySelectorAll<HTMLElement>('.hd__stage')]
    items.forEach((it, k) => {
      ScrollTrigger.create({
        trigger: it,
        start: 'top 68%',
        onEnter: () => { lit.value = Math.max(lit.value, k) },
        onLeaveBack: () => { lit.value = Math.min(lit.value, k - 1) },
      })
    })
    return () => { mode.value = '' }
  })

  return () => mm.revert()
})
</script>

<template>
  <section
    ref="section"
    class="hd c4-section c4-section--paper"
    :class="{ 'm-journey': mode !== '', 'is-across': mode === 'across' }"
    aria-labelledby="hd-title"
  >
    <div class="c4-wrap">
      <!-- Split heading (title left, lead and link right) so the held
           section fits a laptop screen. -->
      <SectionHeader layout="split" title-id="hd-title" :eyebrow="deliver.eyebrow" :title="deliver.title" :lead="deliver.lead" class="hd__head">
        <template #action>
          <C4Button :to="deliver.link.to" variant="text">{{ deliver.link.label }}</C4Button>
        </template>
      </SectionHeader>
    </div>

    <div class="hd__viewport">
      <ol ref="track" class="hd__stages">
        <li
          v-for="(s, i) in deliver.stages"
          :key="s.n"
          class="hd__stage"
          :class="{ 'is-lit': mode === '' || i <= lit, 'is-passed': mode === '' || i < lit }"
          :aria-current="mode !== '' && i === lit ? 'step' : undefined"
        >
          <span class="hd__track" aria-hidden="true">
            <span class="hd__dot" />
            <span v-if="i < n - 1" class="hd__line" />
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

      <!-- The road lies across the section, beneath the stages (desktop).
           The amber tick marks the centre, where each stage lights. -->
      <div class="hd__road" aria-hidden="true">
        <HyperspeedRoad preset="deliver-across" />
        <span class="hd__centre" />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* --- Default (and reduced motion, desktop): six stages in a row ------------- */
.hd__viewport {
  width: 100%;
  max-width: var(--content-max);
  margin-inline: auto;
  padding-inline: var(--gutter);
}

.hd__stages {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
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

/* The road band: shown only in the pinned, across layout. */
.hd__road {
  display: none;
}

/* --- Desktop, motion on: the pinned horizontal journey ------------------------ */
@media (min-width: 1025px) {
  .hd.is-across {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
    padding-block: var(--s-64);
    overflow: hidden;
  }

  .is-across .hd__head {
    margin-bottom: var(--s-48);
  }

  .is-across .hd__viewport {
    max-width: none;
    padding-inline: 0;
  }

  /* One long row. Padding puts the first stage's centre at the screen's
     centre, and lets the last one reach it too. */
  .is-across .hd__stages {
    display: flex;
    width: max-content;
    padding-inline: calc(50vw - 170px);
    will-change: transform;
  }

  .is-across .hd__stage {
    flex: none;
    width: 340px;
    padding-right: var(--s-48);
  }

  .is-across .hd__line {
    margin-right: calc(-1 * var(--s-48));
  }

  .is-across .hd__road {
    position: relative;
    display: block;
    height: clamp(96px, 15vh, 160px);
    margin-top: var(--s-32);
  }

  .hd__centre {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    margin-left: -1px;
    background: linear-gradient(180deg, rgba(245, 165, 36, 0), var(--amber) 30%, var(--amber) 70%, rgba(245, 165, 36, 0));
    opacity: 0.7;
  }
}

/* --- Phones and tablets: a vertical timeline, dot and line on the left -------- */
@media (max-width: 1024px) {
  .hd__stages {
    display: flex;
    flex-direction: column;
    row-gap: 0;
    max-width: 640px;
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
    font-size: 18px;
  }
}
</style>
