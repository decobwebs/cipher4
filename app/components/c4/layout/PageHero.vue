<script setup lang="ts">
/**
 * PageHero: the white header of every inner page (plan, section 5;
 * Page-Service, Page-Sector, Page-Case and Page-Contact boards; Phone-
 * Screens 03, 05 and 06).
 *
 * Breadcrumb, eyebrow, H1, lead and buttons on the left; the page's road
 * behind the right-hand side, faded so it never crosses the text column.
 * 1100 px and below: the words first, then the road in its own band.
 *
 * Slots: `actions` (buttons), `meta` (case-study facts), `below` (anything
 * under the lead).
 */
import type { RoadName } from '~/lib/hyperspeed/roads'
import type { C4IconName } from '~/lib/icons'

interface Crumb { label: string; to?: string }

const props = withDefaults(defineProps<{
  crumbs: Crumb[]
  eyebrow?: string
  title: string
  lead?: string
  /** Only the contact page keeps a road (owner, 20 Nov 2026). */
  road?: RoadName
  /**
   * Every other inner page: a large blueprint drawing of the page's icon,
   * with construction lines, guide circles and measurements, drawing itself
   * on arrival (owner, 20 Nov 2026).
   */
  drawing?: { icon: C4IconName; code: string; title?: string }
  /** Width of the text column, which the road keeps clear of. */
  textWidth?: number
  /** 'page' (services, sectors, contact) or 'case' (smaller H1, board). */
  size?: 'page' | 'case'
  /** Board header heights: 640 (service, sector), 660 (case), 520 (contact). */
  minHeight?: number
}>(), {
  textWidth: 640,
  size: 'page',
  minHeight: 640,
})

const roadEl = ref<{ speedUp: (ms?: number) => void; launch: () => void } | null>(null)
defineExpose({
  /** The 400 ms burst, and the amber car where the road has one. */
  launch: () => roadEl.value?.launch(),
  speedUp: (ms?: number) => roadEl.value?.speedUp(ms),
})

const styleVars = computed(() => ({
  '--ph-text': `${props.textWidth}px`,
  '--ph-min': `${props.minHeight}px`,
}))
</script>

<template>
  <!-- Choreography 13: the path types itself, then the headline rises. -->
  <section v-m:now="'path'" class="ph" :class="`ph--${size}`" :style="styleVars" aria-labelledby="ph-title">
    <div v-if="road" class="ph__road">
      <HyperspeedRoad ref="roadEl" :preset="road" />
    </div>
    <div class="c4-wrap ph__inner">
      <div class="ph__copy">
        <Breadcrumb :items="crumbs" />
        <Eyebrow v-if="eyebrow" class="m-after">{{ eyebrow }}</Eyebrow>
        <h1 id="ph-title" class="ph__title"><span class="m-mask"><span class="m-line">{{ title }}</span></span></h1>
        <p v-if="lead" class="ph__lead m-after" style="--i: 1">{{ lead }}</p>
        <div v-if="$slots.meta" class="m-after" style="--i: 2"><slot name="meta" /></div>
        <div v-if="$slots.actions" class="ph__actions m-after" style="--i: 3">
          <slot name="actions" />
        </div>
        <div v-if="$slots.below" class="ph__below m-after" style="--i: 3"><slot name="below" /></div>
      </div>
      <div v-if="drawing && !road" class="ph__drawing">
        <BlueprintDrawing :icon="drawing.icon" :code="drawing.code" :title="drawing.title" now />
      </div>
    </div>
  </section>
</template>

<style scoped>
.ph {
  position: relative;
  overflow: hidden;
  background: var(--white);
}

/* Desktop: the road has its own box, from where the text column ends to
   the right edge of the screen, so the road (which the library always
   centres in its canvas) sits in the open space. Before 19 Nov 2026 the
   box was the full width: the road was centred under the words and the
   mask that keeps it off them hid almost all of it, leaving fragments that
   flickered in and out as it bent (owner: "the road breaks").
   The first 160 px of the box overlap the column's end and fade in. */
.ph__road {
  position: absolute;
  /* Below the floating header bar (68 px + 16 px), so a climbing road
     never runs up behind the menu. */
  top: calc(68px + var(--s-16));
  bottom: 0;
  right: 0;
  left: calc(max(0px, 50% - 660px) + var(--gutter) + var(--ph-text) - 160px);
}

.ph__road :deep(.c4-road--header) {
  -webkit-mask-image:
    linear-gradient(90deg, transparent 0, #000 160px),
    linear-gradient(180deg, #000 58%, transparent 100%);
  mask-image:
    linear-gradient(90deg, transparent 0, #000 160px),
    linear-gradient(180deg, #000 58%, transparent 100%);
}

.ph__inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  min-height: var(--ph-min);
  /* Header (68 + 16), then the board's 72 px (scale: 64). */
  padding-top: calc(68px + var(--s-16) + var(--s-64));
  padding-bottom: var(--s-96);
}

.ph__copy {
  display: flex;
  flex-direction: column;
  gap: var(--s-24);
  max-width: var(--ph-text);
}

.ph__title {
  font-size: clamp(46px, 5.6vw, 80px);
  line-height: 1;
  letter-spacing: -0.045em;
  font-weight: 400;
  text-wrap: balance;
}

.ph--case .ph__title {
  font-size: clamp(42px, 4.4vw, 64px);
}

.ph__lead {
  max-width: 560px;
  font-size: clamp(18px, 1.4vw, 20px);
  line-height: 1.6;
  color: var(--slate);
}

.ph__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-12);
  padding-top: var(--s-4);
}

/* 1100 px and below: the words first, the road in a band under them. */
@media (max-width: 1100px) {
  .ph {
    display: flex;
    flex-direction: column;
  }

  .ph__inner {
    min-height: 0;
    padding-bottom: var(--s-24);
  }

  .ph__road {
    position: relative;
    inset: auto;
    order: 1;
    height: 260px;
  }

  /* Its own band under the words: full width, no side fade needed. */
  .ph__road :deep(.c4-road--header) {
    -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 70%, transparent 100%);
    mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 70%, transparent 100%);
  }
}

@media (max-width: 767px) {
  .ph__inner {
    padding-top: calc(52px + var(--s-12) + var(--s-48));
  }

  .ph__copy {
    gap: var(--s-16);
  }

  .ph__title {
    line-height: 1.04;
  }

  .ph__lead {
    font-size: 16px;
  }

  .ph__actions :deep(.c4-btn--primary) {
    width: 100%;
  }

  .ph__road {
    height: 230px;
  }
}

/* The blueprint drawing: its own column on the right, never under words. */
.ph__inner {
  justify-content: space-between;
  gap: var(--s-48);
}

.ph__drawing {
  flex: 0 0 auto;
  width: min(460px, 34vw);
  margin-right: calc(-1 * var(--s-24));
}

@media (max-width: 1100px) {
  .ph__inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .ph__drawing {
    align-self: center;
    width: min(360px, 80vw);
    margin: 0;
  }
}

@media (max-width: 767px) {
  .ph__drawing {
    width: min(280px, 76vw);
  }
}
</style>
