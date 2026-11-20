<script setup lang="ts">
/**
 * Why Cipher4 (content C7): heading on the left, four promises on the right.
 *
 * Owner, 20 Nov 2026: the left column is sticky, with the heading and a
 * large blueprint drawing. As each promise reaches the middle of the screen
 * the drawing crossfades to that promise's icon, drawn large in blueprint
 * style (it draws itself the first time it appears). Without motion the
 * first promise's drawing is shown.
 */
import { why } from '~/data/home'
import { DRAWING_CODES } from '~/utils/drawings'

const active = ref(0)
/** Drawings mount (and so draw themselves) the first time they are needed. */
const seen = ref(new Set([0]))
const list = useTemplateRef<HTMLElement>('list')

function show(k: number) {
  active.value = k
  if (!seen.value.has(k)) seen.value = new Set([...seen.value, k])
}

useScrollMoment(({ ScrollTrigger }) => {
  const items = [...(list.value?.querySelectorAll<HTMLElement>('.hy__item') ?? [])]
  items.forEach((it, k) => {
    ScrollTrigger.create({
      trigger: it,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => { if (self.isActive) show(k) },
    })
  })
})

const sheet = useTemplateRef<HTMLElement>('sheet')
useSheetStack(sheet)
</script>

<template>
  <!-- Sheet stack: slides up over Our work. -->
  <section ref="sheet" class="hy c4-section bp-host" data-sheet aria-labelledby="hy-title">
    <BlueprintGround kind="none" marks sheet="SHEET 04 / 09" dwg="DWG C4-004" />
    <div class="c4-wrap hy__grid">
      <div class="hy__head">
        <Eyebrow>{{ why.eyebrow }}</Eyebrow>
        <h2 id="hy-title" class="c4-h2 hy__title">{{ why.title }}</h2>
        <!-- The promise in view, drawn large. Crossfades as you read on. -->
        <div class="hy__drawings" aria-hidden="true">
          <div v-for="(w, k) in why.items" :key="w.icon" class="hy__drawing" :class="{ 'is-on': active === k }">
            <BlueprintDrawing v-if="seen.has(k)" :icon="w.icon" :code="DRAWING_CODES.why[k]!" :title="w.title" now />
          </div>
        </div>
      </div>
      <!-- Choreography 07: each promise gets signed off. -->
      <ul ref="list" v-m="'sign'" class="hy__list">
        <li v-for="(w, i) in why.items" :key="w.title" class="hy__item m-item" :style="{ '--i': i }">
          <C4Icon :name="w.icon" :size="44" :delay="i * 0.3" />
          <div class="hy__text">
            <h3 class="hy__name">{{ w.title }}<CheckTick class="hy__tick" /></h3>
            <p class="hy__body">{{ w.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.hy {
  background: var(--white);
}

.hy__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(420px, 100%), 1fr));
  gap: var(--s-64);
}

.hy__head {
  position: sticky;
  top: 112px;
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: var(--s-24);
}

.hy__drawings {
  position: relative;
  width: min(440px, 100%);
  aspect-ratio: 1;
  margin-top: var(--s-16);
}

.hy__drawing {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 500ms var(--ease-out);
}

.hy__drawing.is-on {
  opacity: 1;
}

/* Phones and tablets: the heading over the list; one drawing, not sticky. */
@media (max-width: 899px) {
  .hy__head {
    position: static;
  }

  .hy__drawings {
    width: min(280px, 70vw);
    align-self: center;
  }
}

.hy__title {
  max-width: 480px;
}

.hy__list {
  list-style: none;
}

.hy__item {
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: var(--s-24);
  padding: var(--s-32) 0;
  border-top: 1px solid var(--line);
}

.hy__item:last-child {
  border-bottom: 1px solid var(--line);
}

.hy__text {
  display: flex;
  flex-direction: column;
  gap: var(--s-12);
}

.hy__name {
  display: flex;
  align-items: center;
  gap: var(--s-12);
  font-size: 23px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.hy__tick {
  width: 24px;
  height: 24px;
}

.hy__body {
  max-width: 520px;
  font-size: 17px;
  line-height: 1.6;
  color: var(--slate);
}

@media (max-width: 767px) {
  .hy__grid {
    gap: var(--s-32);
  }

  .hy__item {
    grid-template-columns: 44px 1fr;
    gap: var(--s-16);
    padding: var(--s-24) 0;
  }

  .hy__name {
    font-size: 19px;
  }

  .hy__body {
    font-size: 15px;
  }
}
</style>
