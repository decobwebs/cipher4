<script setup lang="ts">
/**
 * Breadcrumb in mono upper case (Choreography 13, "Every page header").
 *
 * The trail types out like a system address, with an amber caret, while the
 * page loads. The words are in the page from the start (screen readers and
 * search engines read them normally); the typing is a clip that uncovers
 * them one character at a time. It finishes within 0.6 seconds.
 */
export interface Crumb {
  label: string
  to?: string
}

const props = defineProps<{ items: Crumb[] }>()

// Characters in the visible trail, separators included, for steps().
const chars = computed(() =>
  props.items.reduce((n, c, i) => n + c.label.length + (i ? 3 : 0), 0),
)
const duration = computed(() => Math.min(600, Math.max(240, chars.value * 22)))

const el = ref<HTMLElement | null>(null)
const { revealed } = useReveal(el, { immediate: true })
</script>

<template>
  <nav
    ref="el"
    class="c4-crumb"
    :class="{ 'is-in': revealed }"
    aria-label="Breadcrumb"
    :style="{ '--n': chars, '--t': `${duration}ms` }"
  >
    <ol class="c4-crumb__list">
      <li v-for="(c, i) in items" :key="i" class="c4-crumb__item">
        <span v-if="i" class="c4-crumb__sep" aria-hidden="true">&nbsp;/&nbsp;</span>
        <NuxtLink v-if="c.to && i < items.length - 1" :to="c.to" class="c4-crumb__link">{{ c.label }}</NuxtLink>
        <span v-else class="c4-crumb__current" aria-current="page">{{ c.label }}</span>
      </li>
    </ol>
    <span class="c4-crumb__caret" aria-hidden="true" />
  </nav>
</template>

<style>
/* Unscoped on purpose: the typing depends on `.c4-js` on <html>. Every
   selector starts with .c4-crumb, so nothing leaks. */
.c4-crumb {
  position: relative;
  display: inline-flex;
  max-width: 100%;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  line-height: 1.4;
}

.c4-crumb__list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
}

.c4-crumb__item {
  display: inline-flex;
  align-items: center;
}

.c4-crumb__sep {
  color: var(--grey);
}

/* Links keep a 44 px tap height without changing the line. */
.c4-crumb__link {
  position: relative;
  color: var(--grey);
  transition: color var(--dur-ui) var(--ease-out);
}

.c4-crumb__link::after {
  content: '';
  position: absolute;
  inset: -16px -4px;
}

.c4-crumb__link:hover {
  color: var(--indigo);
}

.c4-crumb__current {
  color: var(--ink);
}

.c4-crumb__caret {
  display: none;
}

/* Typing: only when JavaScript is running and motion is allowed. */
@media (prefers-reduced-motion: no-preference) {
  .c4-js .c4-crumb__list {
    clip-path: inset(0 100% 0 0);
  }

  .c4-js .c4-crumb.is-in .c4-crumb__list {
    animation: c4-crumb-type var(--t) steps(var(--n), end) forwards;
  }

  .c4-js .c4-crumb__caret {
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 2px;
    background: var(--amber);
    opacity: 0;
  }

  .c4-js .c4-crumb.is-in .c4-crumb__caret {
    animation:
      c4-caret-move var(--t) steps(var(--n), end) forwards,
      c4-caret-fade 900ms linear var(--t) forwards;
  }
}

@keyframes c4-crumb-type {
  to { clip-path: inset(0 0 0 0); }
}

@keyframes c4-caret-move {
  from { left: 0; opacity: 1; }
  to { left: calc(100% + 3px); opacity: 1; }
}

@keyframes c4-caret-fade {
  0%, 30%, 60% { opacity: 1; }
  15%, 45%, 100% { opacity: 0; }
}
</style>
