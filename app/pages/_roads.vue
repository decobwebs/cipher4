<script setup lang="ts">
/**
 * /_roads: internal tool, not a page of the site. Draws one road at an exact
 * size and effect time, on a transparent page, for:
 *   - scripts/export-road-stills.mjs (the still frames in public/images/road)
 *   - the side-by-side check against the old hero
 *
 *   /_roads?road=hero&w=1440&h=700&t=3&size=desktop
 *
 * noindex, blocked in robots.txt, removed at launch with /_styleguide.
 */
import { roads, STILL_TIME, type RoadName } from '~/lib/hyperspeed/roads'
import type { RoadOptions } from '~/lib/hyperspeed/index'

definePageMeta({ layout: false })
useHead({
  title: 'Road tool',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  style: [{ innerHTML: 'html,body{background:transparent!important;margin:0}' }],
})

// Read from the address itself. During start-up the router briefly
// replaces the address with the bare path and then restores the query, and
// mounting can land in that gap, so wait until the query is back.
const q = ref(new URLSearchParams())
const w = computed(() => Number(q.value.get('w')) || 1440)
const h = computed(() => Number(q.value.get('h')) || 700)
const el = ref<HTMLCanvasElement | null>(null)
const status = ref('loading')

onMounted(async () => {
  for (let i = 0; i < 100 && !location.search; i++) await new Promise((r) => setTimeout(r, 20))
  q.value = new URLSearchParams(location.search)
  await nextTick()
  const name = (q.value.get('road') || 'hero') as RoadName
  const r = roads[name]
  if (!r || !el.value) { status.value = 'unknown road'; return }
  const mobile = q.value.get('size') === 'mobile'
  const o: RoadOptions = {
    ...r.options,
    ...(mobile ? (r as { mobileOptions?: RoadOptions }).mobileOptions : {}),
    pauseOffscreen: false,
    reducedMotion: 'animate',
    maxPixelRatio: 1,
  }
  const lib = await import('~/lib/hyperspeed/index')
  const handle = lib.mount(el.value, o)
  if (!handle.supported) { status.value = `unsupported: ${handle.reason}`; return }
  handle.pause()
  handle.setTime(Number(q.value.get('t') ?? STILL_TIME))
  const win = window as unknown as { __road: unknown; __roadReady: boolean }
  win.__road = handle
  win.__roadReady = true
  status.value = 'ready'
})
</script>

<template>
  <canvas
    ref="el"
    :data-status="status"
    :style="{ width: `${w}px`, height: `${h}px`, display: 'block' }"
  />
</template>
