<script setup lang="ts">
/**
 * How we deliver (content C8). Rebuilt 20 Nov 2026 to the owner's brief
 * (docs/redesign/DECISIONS.md, "D"): a blueprint that builds itself as you
 * scroll. No road.
 *
 *   desktop (1025 px and up), motion on
 *     The section pins. The stage list sits on the left, the drawing on the
 *     right (the text never sits on the drawing). Scrolling moves through the
 *     six stages: the active one is highlighted and the drawing adds its
 *     step (DeliverBlueprint). Scrolling back reverses each step. After the
 *     last stage the page scrolls on.
 *
 *   phones and tablets
 *     No pin: a vertical list. Each stage has its own small drawing beside
 *     its text, showing that stage's step, which builds as the stage
 *     crosses the screen.
 *
 *   reduced motion, or before the motion code has loaded
 *     Every stage shown, the drawing finished.
 */
import { deliver } from '~/data/home'

const n = deliver.stages.length
const section = useTemplateRef<HTMLElement>('section')
const list = useTemplateRef<HTMLElement>('list')
/** How many stages are reached (0 to 6). Only used while the journey runs. */
const reached = ref(0)
const mode = ref<'' | 'pin' | 'down'>('')

/** The drawing's stage: finished unless the journey is running. */
const drawStage = computed(() => (mode.value === '' ? n : reached.value))
const active = computed(() => (mode.value === '' ? -1 : reached.value - 1))

useScrollMoment(({ gsap, ScrollTrigger }) => {
  const el = section.value
  if (!el) return
  const mm = gsap.matchMedia()

  mm.add('(min-width: 1025px)', () => {
    mode.value = 'pin'
    reached.value = 0
    const st = ScrollTrigger.create({
      trigger: el,
      start: () => (el.offsetHeight <= window.innerHeight ? 'top top' : 'bottom bottom'),
      end: () => `+=${Math.round(window.innerHeight * 0.55 * n)}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // The first stage arrives as the pin begins; the last one with a
        // little scroll to spare, so its step can be seen.
        reached.value = Math.min(n, Math.floor(self.progress * n * 1.04) + 1)
      },
      onLeaveBack: () => { reached.value = 0 },
    })
    return () => { st.kill(); mode.value = '' }
  })

  mm.add('(max-width: 1024px)', () => {
    mode.value = 'down'
    reached.value = 0
    const items = [...(list.value?.querySelectorAll<HTMLElement>('.hd__stage') ?? [])]
    items.forEach((it, k) => {
      ScrollTrigger.create({
        trigger: it,
        start: 'top 72%',
        onEnter: () => { reached.value = Math.max(reached.value, k + 1) },
        onLeaveBack: () => { reached.value = Math.min(reached.value, k) },
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
    class="hd c4-section bp-host"
    :class="{ 'is-pinned': mode === 'pin', 'is-running': mode !== '' }"
    aria-labelledby="hd-title"
  >
    <BlueprintGround kind="dots" marks sheet="SHEET 06 / 09" dwg="DWG C4-008" />
    <div class="c4-wrap">
      <SectionHeader layout="split" title-id="hd-title" :eyebrow="deliver.eyebrow" :title="deliver.title" :lead="deliver.lead" class="hd__head">
        <template #action>
          <C4Button :to="deliver.link.to" variant="text">{{ deliver.link.label }}</C4Button>
        </template>
      </SectionHeader>

      <div class="hd__body">
        <ol ref="list" class="hd__stages">
          <li
            v-for="(s, i) in deliver.stages"
            :key="s.n"
            class="hd__stage"
            :class="{ 'is-active': i === active, 'is-reached': mode === '' || i < reached }"
            :aria-current="i === active ? 'step' : undefined"
          >
            <!-- Phones and tablets: this stage's own step, beside its text. -->
            <div class="hd__mini" aria-hidden="true">
              <DeliverBlueprint :stage="mode === '' || reached > i ? i + 1 : i" compact />
            </div>
            <div class="hd__text-col">
              <h3 class="hd__title"><span class="hd__n">{{ s.n }}</span> {{ s.title }}</h3>
              <p class="hd__text">{{ s.text }}</p>
              <p class="hd__receive">
                <span class="hd__label">{{ deliver.receiveLabel }}<span class="c4-sr-only">:</span></span>
                {{ s.receive }}
              </p>
            </div>
          </li>
        </ol>

        <!-- Desktop: one drawing that builds as you go. -->
        <div class="hd__drawing" aria-hidden="true">
          <DeliverBlueprint :stage="drawStage" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hd {
  background: var(--paper);
}

.hd__body {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: var(--s-64);
  align-items: center;
}

.hd__stages {
  display: flex;
  flex-direction: column;
  list-style: none;
  border-left: 1px solid var(--line-2);
}

.hd__stage {
  position: relative;
  padding: var(--s-12) 0 var(--s-12) var(--s-24);
}

/* The active stage: an amber bar on the line, the text at full strength. */
.hd__stage::before {
  content: '';
  position: absolute;
  left: -2px;
  top: var(--s-12);
  bottom: var(--s-12);
  width: 3px;
  border-radius: 2px;
  background: var(--amber);
  transform: scaleY(0);
  transition: transform 400ms var(--ease-out);
}

.hd__stage.is-active::before {
  transform: none;
}

.is-running .hd__stage:not(.is-active) .hd__text-col {
  opacity: 0.5;
}

.hd__text-col {
  display: flex;
  flex-direction: column;
  gap: var(--s-4);
  transition: opacity 400ms var(--ease-out);
}

.hd__title {
  font-size: 18px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.015em;
}

.hd__n {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 400;
  color: var(--indigo);
}

.hd__text {
  font-size: 15px;
  line-height: 1.5;
  color: var(--slate);
}

.hd__receive {
  font-size: 13px;
  line-height: 1.45;
  color: var(--ink-2);
}

.hd__label {
  margin-right: var(--s-4);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slate);
}

.hd__mini {
  display: none;
}

.hd__drawing {
  padding: var(--s-24);
  border-radius: var(--radius-card);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--line);
}

/* Desktop, pinned: fit the screen. */
@media (min-width: 1025px) {
  .hd.is-pinned {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
    padding-block: var(--s-64);
  }

  .is-pinned .hd__head {
    margin-bottom: var(--s-48);
  }

  /* While held, the stages not in focus show their titles only and the
     active one opens, so the whole section fits the screen. The folded
     text stays in the page for screen readers (visually tucked away, not
     removed), and shows again on phones and without motion. */
  .is-pinned .hd__stage:not(.is-active) :is(.hd__text, .hd__receive) {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .is-pinned .hd__stage.is-active :is(.hd__text, .hd__receive) {
    animation: hd-open 400ms var(--ease-out) both;
  }
}

@keyframes hd-open {
  from { opacity: 0; transform: translateY(6px); }
}

/* Phones and tablets: a vertical list, each stage with its own drawing. */
@media (max-width: 1024px) {
  .hd__body {
    grid-template-columns: 1fr;
  }

  .hd__drawing {
    display: none;
  }

  .hd__stages {
    gap: var(--s-24);
    border-left: 0;
  }

  .hd__stage {
    display: grid;
    grid-template-columns: 128px 1fr;
    gap: var(--s-16);
    align-items: center;
    padding: 0;
  }

  .hd__stage::before {
    display: none;
  }

  .hd__mini {
    display: block;
    padding: var(--s-8);
    border-radius: 12px;
    background: var(--white);
    border: 1px solid var(--line);
  }

  .is-running .hd__stage:not(.is-reached) .hd__text-col {
    opacity: 0.5;
  }

  .is-running .hd__stage.is-reached .hd__text-col {
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .hd__stage {
    grid-template-columns: 104px 1fr;
    gap: var(--s-12);
  }
}
</style>
