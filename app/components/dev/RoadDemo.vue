<script setup lang="ts">
/**
 * Shell for the Phase 2b road experiments (/_roads/...). Internal only:
 * these pages are noindex, blocked in robots.txt and removed at launch.
 *
 * Title, what the idea is, the controls (including a replay button), then
 * the stage. No text ever sits over the road: the stage holds the road, and
 * any copy inside it sits behind the road's fade.
 */
defineProps<{
  n: number
  title: string
  idea: string
  notes?: string[]
}>()

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const ctl = useRoadController()
const tier = ref<string>('…')
onMounted(() => {
  tier.value = ({
    full: 'moving road (desktop)',
    mobile: 'moving road (phone or tablet: header and closing roads only)',
    still: 'still image (reduced motion, Save-Data, low power or low frame rate)',
    none: 'still image (no WebGL)',
  } as const)[ctl.tier()]
})
</script>

<template>
  <div class="demo">
    <div class="c4-wrap demo__head">
      <NuxtLink to="/_roads/demos" class="demo__back">All road experiments</NuxtLink>
      <Eyebrow>Road experiment {{ n }} of 6 · internal</Eyebrow>
      <h1 class="c4-h1">{{ title }}</h1>
      <p class="c4-lead">{{ idea }}</p>
      <div class="demo__controls">
        <slot name="controls" />
      </div>
      <p class="demo__meta">This device shows: <strong>{{ tier }}</strong></p>
      <ul v-if="notes?.length" class="demo__notes">
        <li v-for="x in notes" :key="x">{{ x }}</li>
      </ul>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.demo__head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--s-16);
  padding-top: calc(68px + var(--s-16) + var(--s-64));
  padding-bottom: var(--s-48);
}

.demo__back {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: var(--indigo);
  font-size: 15px;
}

.demo__controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-12);
  margin-top: var(--s-8);
}

.demo__meta,
.demo__notes {
  font-size: 15px;
  line-height: 1.5;
  color: var(--slate);
}

.demo__notes {
  padding-left: var(--s-16);
}
</style>
