<script setup lang="ts">
/**
 * The redrawn Cipher4 mark (Main board, section 01).
 *
 * variant  mark     the symbol alone
 *          inline   symbol + "Cipher4" + "AI & ROBOTICS" (header)
 *          stacked  symbol + "Cipher4" over "AI & ROBOTICS" (footer, documents)
 * tone     light    for white ground (default)
 *          dark     reversed, for the night band only
 * compact  the heavier small-size drawing (16 to 64 px), as in the favicon
 */
const props = withDefaults(defineProps<{
  variant?: 'mark' | 'inline' | 'stacked'
  tone?: 'light' | 'dark'
  size?: number
  compact?: boolean
  /** Hide the "AI & ROBOTICS" descriptor (the header does on phones). */
  hideDescriptor?: boolean
}>(), {
  variant: 'mark',
  tone: 'light',
  size: 32,
  compact: false,
  hideDescriptor: false,
})

const c = computed(() => props.tone === 'dark'
  ? { arc: 'var(--mark-indigo-on-dark)', body: 'var(--white)' }
  : { arc: 'var(--brand)', body: 'var(--mark-ink)' })
</script>

<template>
  <span class="c4-logo" :class="[`c4-logo--${variant}`, `c4-logo--${tone}`]">
    <svg
      class="c4-logo__mark"
      :width="size"
      :height="size"
      viewBox="0 0 120 120"
      :role="variant === 'mark' ? 'img' : undefined"
      :aria-label="variant === 'mark' ? 'Cipher4' : undefined"
      :aria-hidden="variant === 'mark' ? undefined : 'true'"
      focusable="false"
    >
      <template v-if="!compact">
        <!-- m-stroke, m-fill, m-node: the footer signature draw (Choreography 23). -->
        <path class="m-stroke" style="--i: 0" pathLength="1" d="M76.3 26.4 A42 42 0 1 0 76.3 97.6" fill="none" :stroke="c.arc" stroke-width="15" />
        <polygon class="m-fill" style="--i: 1" points="84,52 96,37.3 96,106 84,106" :fill="c.body" />
        <polygon class="m-fill" style="--i: 2" points="62,81 71,70 112,70 112,81" :fill="c.body" />
        <line class="m-stroke" style="--i: 2" pathLength="1" x1="56.5" y1="64.5" x2="88.5" y2="25.5" :stroke="c.body" stroke-width="8" />
        <circle class="m-stroke" style="--i: 3" pathLength="1" cx="52" cy="70" r="7" fill="none" :stroke="c.body" stroke-width="5" />
        <circle class="m-node" cx="93" cy="20" r="8" fill="var(--amber)" />
      </template>
      <template v-else>
        <path d="M76.3 26.4 A42 42 0 1 0 76.3 97.6" fill="none" :stroke="c.arc" stroke-width="16" />
        <polygon points="83,52 97,35 97,106 83,106" :fill="c.body" />
        <polygon points="60,82 70,69 112,69 112,82" :fill="c.body" />
        <line x1="54" y1="66" x2="88.5" y2="25.5" :stroke="c.body" stroke-width="10" />
        <circle cx="51" cy="71" r="10" :fill="c.body" />
        <circle cx="93" cy="20" r="10" fill="var(--amber)" />
      </template>
    </svg>

    <span v-if="variant !== 'mark'" class="c4-logo__words">
      <span class="c4-logo__name">Cipher4</span>
      <span
        v-if="!hideDescriptor"
        class="c4-logo__desc"
      ><span aria-hidden="true">AI &amp; ROBOTICS</span><span class="c4-sr-only">AI and Robotics</span></span>
    </span>
  </span>
</template>

<style scoped>
.c4-logo {
  display: inline-flex;
  align-items: center;
  color: var(--ink);
}

.c4-logo--dark {
  color: var(--on-dark);
}

.c4-logo__mark {
  flex: none;
}

.c4-logo__name {
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1;
}

.c4-logo__desc {
  font-family: var(--font-mono);
  color: var(--slate);
  white-space: nowrap;
}

.c4-logo--dark .c4-logo__desc {
  color: var(--on-dark-2);
}

/* Inline lockup (header): 32 px mark, 19 px name, divider, 10 px mono. */
.c4-logo--inline {
  gap: var(--s-12);
}

.c4-logo--inline .c4-logo__words {
  display: inline-flex;
  align-items: center;
  gap: var(--s-12);
}

.c4-logo--inline .c4-logo__name {
  font-size: 19px;
}

.c4-logo--inline .c4-logo__desc {
  font-size: 10px;
  letter-spacing: 0.24em;
  padding-left: var(--s-12);
  border-left: 1px solid var(--line-2);
}

/* Stacked lockup (footer): 50 px mark, 25 px name over 9 px mono. */
.c4-logo--stacked {
  gap: 14px;
}

.c4-logo--stacked .c4-logo__words {
  display: flex;
  flex-direction: column;
  gap: var(--s-4);
}

.c4-logo--stacked .c4-logo__name {
  font-size: 25px;
  letter-spacing: -0.035em;
}

.c4-logo--stacked .c4-logo__desc {
  font-size: 9px;
  letter-spacing: 0.26em;
}
</style>
