<script setup lang="ts">
/**
 * Eyebrow, heading and lead for a section.
 *
 * layout  stack   eyebrow, heading, lead in one column (default)
 *         split   heading on the left, lead (and link) on the right,
 *                 as in "Six capabilities. One accountable partner."
 *         center  centred, for bands
 *
 * Sits var(--head-gap) above its content: 88 px on desktop, 56 on phones.
 * The `action` slot holds a link such as "See all our work".
 */
withDefaults(defineProps<{
  eyebrow?: string
  title: string
  lead?: string
  layout?: 'stack' | 'split' | 'center'
  tag?: 'h1' | 'h2' | 'h3'
  /** Drop the bottom gap when the parent sets its own. */
  flush?: boolean
}>(), { layout: 'stack', tag: 'h2', flush: false })
</script>

<template>
  <header
    class="c4-sh"
    :class="[`c4-sh--${layout}`, { 'c4-sh--flush': flush }]"
  >
    <div class="c4-sh__main">
      <Eyebrow v-if="eyebrow">{{ eyebrow }}</Eyebrow>
      <component :is="tag" class="c4-sh__title">
        <slot name="title">{{ title }}</slot>
      </component>
      <p v-if="lead && layout !== 'split'" class="c4-sh__lead">{{ lead }}</p>
    </div>
    <div v-if="(lead && layout === 'split') || $slots.action" class="c4-sh__side">
      <p v-if="lead && layout === 'split'" class="c4-sh__lead">{{ lead }}</p>
      <slot name="action" />
    </div>
  </header>
</template>

<style scoped>
.c4-sh {
  display: flex;
  flex-direction: column;
  gap: var(--s-32);
  margin-bottom: var(--head-gap);
}

.c4-sh--flush {
  margin-bottom: 0;
}

.c4-sh__main {
  display: flex;
  flex-direction: column;
  gap: var(--s-24);
  max-width: 820px;
}

.c4-sh__title {
  font-size: var(--fs-h2);
  line-height: 1.04;
  letter-spacing: -0.035em;
  font-weight: 400;
}

.c4-sh__lead {
  font-size: 18px;
  line-height: 1.6;
  color: var(--slate);
  max-width: 600px;
}

.c4-sh__side {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--s-24);
}

@media (min-width: 900px) {
  .c4-sh--split {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    gap: var(--s-64);
  }

  .c4-sh--split .c4-sh__side {
    max-width: 440px;
  }

  .c4-sh--stack .c4-sh__side {
    margin-top: calc(-1 * var(--s-8));
  }
}

.c4-sh--center {
  align-items: center;
  text-align: center;
}

.c4-sh--center .c4-sh__main {
  align-items: center;
}

.c4-sh--center .c4-sh__side {
  align-items: center;
}
</style>
