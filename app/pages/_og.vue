<script setup lang="ts">
/**
 * /_og: internal tool, not a page of the site. Draws one share image card
 * (1200 x 630) for scripts/make-og-images.mjs to photograph:
 *
 *   /_og?file=service-ai-automation
 *
 * Brand style (owner, 20 Nov 2026): white, the blueprint grid, the Cipher4
 * logo, the page title, and the page's own blueprint drawing. noindex,
 * blocked in robots.txt, removed at launch with /_roads and /_styleguide.
 */
import { shareCards, defaultCard } from '~/data/og'

definePageMeta({ layout: false })
useHead({
  title: 'Share card',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  style: [{ innerHTML: 'html,body{margin:0;background:#fff}' }],
})

// The query can be briefly missing at start-up (see nuxt.config head
// script), so read the copy kept from the first load too.
const route = useRoute()
const file = computed(() => {
  const fromQuery = String(route.query.file ?? '')
  if (fromQuery) return fromQuery
  if (import.meta.client) return new URLSearchParams((window as unknown as { __c4Search?: string }).__c4Search ?? '').get('file') ?? ''
  return ''
})
const card = computed(() => shareCards.find((c) => c.file === file.value) ?? defaultCard)
</script>

<template>
  <div class="c4">
    <div class="og" :data-file="card.file">
      <div class="og__grid" aria-hidden="true" />
      <BlueprintMarks sheet="SHEET 01 / 01" :dwg="`DWG C4-OG-${card.file.length.toString().padStart(2, '0')}`" />
      <div class="og__copy">
        <C4Logo variant="inline" :size="52" />
        <p class="og__kind">{{ card.kind }}</p>
        <p class="og__title">{{ card.title }}</p>
        <p class="og__url">cipherfourai.com</p>
      </div>
      <div class="og__drawing">
        <BlueprintDrawing :icon="card.icon" code="C4-OG" :title="card.kind" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.og {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 440px;
  align-items: center;
  gap: 32px;
  width: 1200px;
  height: 630px;
  padding: 72px 64px 64px 80px;
  overflow: hidden;
  isolation: isolate;
  background: #fff;
  box-sizing: border-box;
}

.og__grid {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image:
    linear-gradient(to right, rgba(26, 58, 181, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(26, 58, 181, 0.08) 1px, transparent 1px);
  background-size: 48px 48px;
  -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, #000 45%, transparent 100%);
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, #000 45%, transparent 100%);
}

.og__copy {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-self: stretch;
  justify-content: center;
}

.og__kind {
  margin-top: 24px;
  font-family: var(--font-mono);
  font-size: 18px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--indigo);
}

.og__title {
  font-size: 64px;
  line-height: 1.04;
  letter-spacing: -0.04em;
  color: var(--ink);
  text-wrap: balance;
}

.og__url {
  margin-top: auto;
  font-family: var(--font-mono);
  font-size: 16px;
  letter-spacing: 0.12em;
  color: var(--slate);
}

.og__drawing {
  width: 440px;
}
</style>
