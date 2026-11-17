<script setup lang="ts">
/**
 * Buttons and links (Main board, section 05).
 *
 * primary    amber pill, the one thing to press
 * secondary  white pill with a hairline (or a light outline on the night band)
 * text       indigo link with an underline and an amber arrow
 *
 * Renders a NuxtLink when given `to`, a plain link for `href`, otherwise a
 * <button>. Every size keeps a tap target of at least 44 px.
 */
const props = withDefaults(defineProps<{
  to?: string
  href?: string
  variant?: 'primary' | 'secondary' | 'text'
  size?: 'sm' | 'md' | 'lg'
  /** Arrow after the label. Text links always have one. */
  arrow?: boolean
  /** For the night band. */
  onDark?: boolean
  /** Full width (phones, menus). */
  block?: boolean
  type?: 'button' | 'submit'
  /** Opens in a new tab, with a screen-reader note. */
  external?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  arrow: false,
  onDark: false,
  block: false,
  type: 'button',
  external: false,
})

const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : props.href ? 'a' : 'button'))
const showArrow = computed(() => props.variant === 'text' || props.arrow)

const attrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) {
    return props.external
      ? { href: props.href, target: '_blank', rel: 'noopener' }
      : { href: props.href }
  }
  return { type: props.type }
})
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    class="c4-btn"
    :class="[
      `c4-btn--${variant}`,
      `c4-btn--${size}`,
      { 'c4-btn--dark': onDark, 'c4-btn--block': block },
    ]"
  >
    <span class="c4-btn__label"><slot /></span>
    <C4Glyph v-if="showArrow" name="arrow" class="c4-btn__arrow" />
    <span v-if="external" class="c4-sr-only"> (opens in a new tab)</span>
  </component>
</template>

<style scoped>
.c4-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--s-12);
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-weight: 500;
  line-height: 1.2;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
    transform var(--dur-ui) var(--ease-out),
    box-shadow var(--dur-ui) var(--ease-out),
    background-color var(--dur-ui) var(--ease-out),
    border-color var(--dur-ui) var(--ease-out);
}

.c4-btn--block {
  display: flex;
  width: 100%;
}

/* Sizes. Heights from the boards: header 48, default 54, closing band 58. */
.c4-btn--sm { height: 48px; padding: 0 22px; font-size: 15px; }
.c4-btn--md { height: 54px; padding: 0 28px; font-size: 16px; }
.c4-btn--lg { height: 58px; padding: 0 32px; font-size: 17px; }

/* Primary: amber gradient, near-black label. */
.c4-btn--primary {
  background: var(--amber-grad);
  color: var(--on-amber);
  font-weight: 600;
  box-shadow: var(--shadow-amber);
}

.c4-btn--primary.c4-btn--sm {
  box-shadow: none;
}

.c4-btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(245, 165, 36, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

/* Secondary: white with a hairline. */
.c4-btn--secondary {
  background: var(--white);
  border: 1px solid var(--line-2);
  color: var(--ink);
}

.c4-btn--secondary:hover {
  border-color: var(--slate);
}

.c4-btn--secondary.c4-btn--dark {
  background: transparent;
  border-color: var(--on-dark-line);
  color: var(--on-dark);
}

.c4-btn--secondary.c4-btn--dark:hover {
  border-color: var(--on-dark);
}

/* Text link: indigo, underline, amber arrow. The 44 px target is the link
   box; the underline sits on the label only. */
.c4-btn--text {
  height: auto;
  min-height: 44px;
  padding: 0;
  gap: 10px;
  color: var(--indigo);
  font-size: 16px;
}

.c4-btn--text .c4-btn__label {
  padding-bottom: var(--s-4);
  border-bottom: 1px solid rgba(26, 58, 181, 0.35);
  transition: border-color var(--dur-ui) var(--ease-out);
}

.c4-btn--text:hover .c4-btn__label {
  border-bottom-color: var(--indigo);
}

.c4-btn--text .c4-btn__arrow {
  color: var(--amber);
  transition: transform var(--dur-ui) var(--ease-out);
}

.c4-btn--text:hover .c4-btn__arrow {
  transform: translateX(3px);
}

.c4-btn--text.c4-btn--dark {
  color: var(--on-dark);
}

.c4-btn--text.c4-btn--dark .c4-btn__label {
  border-bottom-color: var(--on-dark-line);
}
</style>
