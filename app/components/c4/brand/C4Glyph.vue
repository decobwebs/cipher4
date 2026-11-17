<script setup lang="ts">
/**
 * Small interface glyphs from the boards (16 px grid, 1.6 px stroke):
 * the button arrow, accordion plus and minus, close, menu and chevron.
 * Decorative only; the control around them carries the label.
 */
const props = withDefaults(defineProps<{
  name: 'arrow' | 'plus' | 'minus' | 'close' | 'menu' | 'chevron' | 'external'
  size?: number
}>(), { size: 16 })

const d: Record<typeof props.name, string> = {
  arrow: 'M3 8h10M9 4l4 4-4 4',
  plus: 'M3 8h10M8 3v10',
  minus: 'M3 8h10',
  close: 'M3 3l10 10M13 3L3 13',
  menu: 'M0 5.5h16M0 10.5h16',
  chevron: 'M4 6l4 4 4-4',
  external: 'M6 3h7v7M13 3L4 12',
}
</script>

<template>
  <svg
    class="c4-glyph"
    :width="size"
    :height="size"
    viewBox="0 0 16 16"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="d[name]" fill="none" stroke="currentColor" stroke-width="1.6" />
  </svg>
</template>

<style scoped>
.c4-glyph {
  flex: none;
}
</style>
