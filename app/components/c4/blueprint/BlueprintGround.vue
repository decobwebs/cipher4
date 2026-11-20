<script setup lang="ts">
/**
 * BlueprintGround: the paper a section is drawn on (owner, 20 Nov 2026).
 * Put it as the first child of a section with the class `bp-host`.
 *
 *   kind   grid (grid paper), dots (dot grid), wash (paper to mist)
 *   draw   grid draw-in: the lines draw in from this edge as the section
 *          enters, before its content (left, right, top)
 *   fade   colour wash: the ground fades up as the section enters
 *   marks  construction marks: corner crosshairs, a measuring edge and the
 *          drawing-sheet label (`sheet`, `dwg`)
 *
 * Decorative only (aria-hidden). Plays once; with reduced motion or no
 * JavaScript the ground is simply there.
 */
const props = withDefaults(defineProps<{
  kind?: 'grid' | 'dots' | 'wash' | 'none'
  draw?: 'left' | 'right' | 'top'
  fade?: boolean
  marks?: boolean
  sheet?: string
  dwg?: string
}>(), { kind: 'grid', fade: false, marks: false })

const el = ref<HTMLElement | null>(null)
const shown = ref(false)
let io: IntersectionObserver | null = null
onBeforeUnmount(() => io?.disconnect())

onMounted(() => {
  if (!props.draw && !props.fade) return
  if (!el.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { shown.value = true; return }
  // Early: the ground draws as the section's top edge comes in, so it is in
  // place before the content (which waits until it is 25% visible).
  io = new IntersectionObserver((list) => {
    if (list.some((e) => e.isIntersecting)) { shown.value = true; io?.disconnect() }
  }, { rootMargin: '0px 0px -8% 0px' })
  io.observe(el.value)
})
</script>

<template>
  <div
    v-if="kind !== 'none'"
    ref="el"
    class="bpg"
    :class="[`bpg--${kind}`, { 'is-in': shown }]"
    :data-draw="draw"
    :data-fade="fade ? '' : undefined"
    aria-hidden="true"
  />
  <BlueprintMarks v-if="marks" :sheet="sheet" :dwg="dwg" />
  <div class="bpg-dim" aria-hidden="true" />
</template>
