<script setup lang="ts">
import { industries } from '~/data/industries'

/**
 * Where we work — a ScrollStack.
 *
 * Each sector pins, then the next rides up over it, scaling and blurring the
 * one beneath. Image and copy live in the same card, so they always arrive
 * together — which was the point of moving off the earlier scrolling rows,
 * where you could be reading one sector while still looking at the previous
 * sector's photograph.
 *
 * NO VISIBLE CARDS, BUT STILL CARDS
 * ---------------------------------
 * The brief is no cards, no borders. Stacking only works because each card
 * occludes the one behind it, so a transparent surface would let the pinned
 * blocks show through each other and read as a rendering fault.
 *
 * So the card is opaque but invisible: filled with the page colour, no border,
 * no radius, no shadow. It occludes correctly and reads as open space. The
 * images carry no radius and no frame either.
 */

/** First three capabilities per sector. The full list lives on the sector
 *  page; this is the teaser, and four bullets is already too many here. */
function highlights(slug: string) {
  return industries.find((i) => i.slug === slug)?.capabilities.slice(0, 3) ?? []
}
</script>

<template>
  <section class="section where">
    <div class="container">
      <UiSectionHeader
        eyebrow="Where we work"
        title="The sectors we know deepest"
        lead="These four share the same hard problems: high-value assets, difficult access, unforgiving compliance. Depth in them is what makes the systems survive contact with the field."
      />
    </div>

    <div class="container container--wide where__stack">
      <UiScrollStack
        :item-distance="140"
        :item-scale="0.03"
        :item-stack-distance="24"
        stack-position="16%"
        scale-end-position="6%"
        :base-scale="0.9"
        :blur-amount="2.5"
      >
        <article
          v-for="industry in industries"
          :key="industry.slug"
          class="stack__card where__block"
        >
          <div class="where__media">
            <!-- width/height MUST match the source's real aspect (1672x941).
                 They were 1200x900 — a 4:3 box — so the image pipeline
                 generated a 4:3 crop of a 16:9 photograph at build time, and
                 no amount of object-fit in CSS could undo it. That build-time
                 crop was cutting through the feathered edges. -->
            <NuxtImg
              :src="industry.image"
              :alt="industry.imageAlt"
              width="1672"
              height="941"
              sizes="100vw md:56vw"
              format="webp"
              loading="lazy"
              class="where__img"
            />
          </div>

          <div class="where__body">
            <p class="eyebrow">{{ industry.name }}</p>
            <h3 class="where__title">{{ industry.teaser }}</h3>
            <p class="where__summary">{{ industry.summary }}</p>

            <ul class="where__list">
              <li v-for="item in highlights(industry.slug)" :key="item" class="where__item">
                <Icon name="lucide:check" size="16" class="where__tick" />
                <span>{{ item }}</span>
              </li>
            </ul>

            <NuxtLink :to="`/industries/${industry.slug}`" class="btn btn--secondary where__cta">
              <span>{{ industry.name }} in detail</span>
              <Icon name="lucide:arrow-right" size="16" />
            </NuxtLink>
          </div>
        </article>
      </UiScrollStack>
    </div>
  </section>
</template>

<style scoped>
.where__stack {
  margin-block-start: var(--space-16);
  /* The card surface. Page colour, so it occludes the card beneath without
     ever reading as a panel. */
  --stack-card-bg: var(--bg-page);
}

.where__block {
  display: grid;
  /* The photograph carries more weight than the copy here, so it gets the
     larger share rather than an even split. */
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  /* Wide gutter between image and copy — the space is the structure here,
     since there is no card edge doing that job. */
  gap: clamp(2.5rem, 1rem + 6vw, 6.5rem);
  align-items: center;
  /* Vertical breathing room INSIDE the card, so the occluding surface extends
     past the content and the stack edge never clips a descender. */
  padding-block: var(--space-10);
}

@media (max-width: 60rem) {
  .where__block {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-8);
    padding-block: var(--space-6);
  }
}

/* --- Media --------------------------------------------------------------
   No border, no radius, no shadow. Just the photograph.
   ---------------------------------------------------------------------- */

.where__media {
  position: relative;
  /* No fixed aspect-ratio and no overflow clip.
     The sector photographs carry soft feathered white edges that dissolve
     into the page. Forcing them into a 16:9 box and using `object-fit: cover`
     cropped straight through that fade, converting a soft edge into a hard
     line on one or more sides — which is where the visible edges were coming
     from. The frame now takes its height from the image itself, so every
     pixel of the supplied frame is shown and the fade survives intact. */
  background: transparent;
}

.where__img {
  display: block;
  width: 100%;
  height: auto;
  /* `contain` rather than `cover`: nothing is cropped. With the box sized by
     the image there is nothing to letterbox either. */
  object-fit: contain;
}

/* --- Body --------------------------------------------------------------- */

.where__body {
  display: grid;
  gap: var(--space-5);
  align-content: center;
  justify-items: start;
}

.where__title {
  font-size: var(--fs-h2);
  font-weight: var(--fw-semibold);
  line-height: var(--lh-heading);
  letter-spacing: var(--tracking-tight);
  max-width: 18ch;
}

.where__summary {
  color: var(--text-secondary);
  line-height: var(--lh-body);
  max-width: var(--measure);
}

.where__list {
  display: grid;
  gap: var(--space-3);
}

.where__item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  font-size: var(--fs-sm);
  line-height: var(--lh-snug);
  color: var(--text-secondary);
}

.where__tick {
  flex-shrink: 0;
  margin-block-start: 2px;
  color: var(--c4-signal-500);
}

.where__cta {
  margin-block-start: var(--space-2);
}
</style>
