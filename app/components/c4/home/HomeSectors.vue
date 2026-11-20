<script setup lang="ts">
/**
 * Sectors (content C5). Desktop: four cards in a row (Home-Desktop), with
 * the sector road in its own box to the right of the heading. It changes
 * shape, over 800 ms, to the sector you point at or tab to (kept from the
 * Phase 2b demos; desktop only). A wide, short band was tried first, but a
 * road narrows towards the horizon, so it shrank to a small shape there.
 * Phones and tablets: the cards swipe sideways (Home-Mobile), no road.
 * The heading stacks (eyebrow, title, lead) at every size, so it can sit
 * beside the road on desktop.
 *
 * The images are placeholders until the AI images are approved (plan,
 * section 9). Their size is fixed, so nothing moves when the real images
 * arrive.
 */
import { sectors } from '~/data/home'

// The Sector road was removed (owner, 20 Nov 2026: the road appears only
// where it means an operation in motion). The heading now uses the split
// layout, so no column sits empty beside it.
const current = ref(0)
function pick(i: number) { current.value = i }

const sheet = useTemplateRef<HTMLElement>('sheet')
useSheetStack(sheet)
</script>

<template>
  <!-- Sheet stack: slides up over Services like a sheet of drawing paper. -->
  <section ref="sheet" class="hse c4-section bp-host" data-sheet aria-labelledby="hse-title">
    <BlueprintGround kind="dots" marks sheet="SHEET 02 / 09" dwg="DWG C4-002" />
    <div class="c4-wrap">
      <SectionHeader
        layout="split"
        title-id="hse-title"
        :eyebrow="sectors.eyebrow"
        :title="sectors.title"
        :lead="sectors.lead"
      />

      <!-- Choreography 05: one route joins four industries. -->
      <ul v-m="'route'" data-seg class="hse__list">
        <li v-for="(s, i) in sectors.items" :key="s.to" class="hse__item m-card" :style="{ '--i': i }">
          <svg class="m-route hse__route" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 1 H100" pathLength="1" /></svg>
          <span class="m-stop hse__stop" aria-hidden="true" />
          <NuxtLink
            :to="s.to"
            class="hse__card"
            :class="{ 'is-current': current === i }"
            @mouseenter="pick(i)"
            @focus="pick(i)"
          >
            <span class="hse__img" :class="`hse__img--${s.tint}`" aria-hidden="true" />
            <span class="hse__body">
              <span class="hse__head">
                <C4Icon :name="s.icon" :size="36" :delay="i * 0.2" />
                <span class="hse__title">{{ s.title }}</span>
              </span>
              <span class="hse__line">{{ s.line }}</span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.hse {
  background: var(--white);
}

.hse__list {
  display: grid;
  /* Four across on desktop; two by two on tablets (never three and one). */
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-24);
  list-style: none;
}

@media (min-width: 1100px) {
  .hse__list {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.hse__item {
  display: flex;
}

.hse__card {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  border-radius: var(--radius-card);
  background: var(--white);
  border: 1px solid var(--line);
  transition: border-color var(--dur-ui) var(--ease-out), box-shadow var(--dur-ui) var(--ease-out);
}

.hse__card:hover,
.hse__card.is-current:hover {
  border-color: var(--line-2);
  box-shadow: var(--shadow-float);
}

/* Placeholder images: the board's soft gradients, fixed height. */
.hse__img {
  display: block;
  height: 300px;
}

.hse__img--a { background: linear-gradient(160deg, #DCE3F6, #C9D3EF); }
.hse__img--b { background: linear-gradient(200deg, #F7E6C8, #DCE3F6); }
.hse__img--c { background: linear-gradient(140deg, #D5DDF4, #EEF1FA); }
.hse__img--d { background: linear-gradient(220deg, #EEF1FA, #F4E3C2); }

.hse__body {
  display: flex;
  flex-direction: column;
  gap: var(--s-12);
  padding: var(--s-24);
}

.hse__head {
  display: flex;
  align-items: center;
  gap: var(--s-12);
}

.hse__title {
  font-size: 22px;
  line-height: 1.25;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.hse__line {
  font-size: 15px;
  line-height: 1.55;
  color: var(--slate);
}

/* Phones: swipe sideways; the next card peeks in so it is clear there is more. */
@media (max-width: 767px) {
  .hse__list {
    display: flex;
    gap: var(--s-12);
    margin-inline: calc(-1 * var(--gutter));
    padding: 0 var(--gutter) var(--s-8);
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--gutter);
    scrollbar-width: none;
  }

  .hse__list::-webkit-scrollbar {
    display: none;
  }

  .hse__item {
    flex: 0 0 280px;
    scroll-snap-align: start;
  }

  .hse__img {
    height: 190px;
  }

  .hse__body {
    gap: var(--s-8);
    padding: var(--s-16) var(--s-24) var(--s-24);
  }

  .hse__title {
    font-size: 19px;
  }
}

/* The route (Choreography 05): one segment per card, on the line between
   picture and words, reaching across the gap to the next card. */
.hse__item {
  position: relative;
}

.hse__route {
  top: 299px;
  z-index: 2;
  width: calc(100% + var(--s-24));
}

.hse__item:last-child .hse__route {
  width: 100%;
}

.hse__stop {
  position: absolute;
  z-index: 3;
  left: var(--s-24);
  top: 294px;
}

@media (max-width: 767px) {
  .hse__route {
    top: 189px;
    width: calc(100% + var(--s-12));
  }

  .hse__stop {
    top: 184px;
  }
}
</style>
