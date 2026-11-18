<script setup lang="ts">
/**
 * The 404 page (content J5), and the fallback for any other error.
 *
 * Unknown addresses return status 404: Nuxt sets it on the server, and the
 * static build writes 404.html, which the host serves with a 404 status.
 * Never indexed.
 *
 * The road runs in its own band under the words, in a calm loop, and fades
 * out into empty space ahead (Phase 2b "404 road", owner's choice). It is
 * the one road that never stops on its own: there is nothing to read here
 * but the heading (J5 note).
 */
import type { NuxtError } from '#app'
import { notFoundPage as page } from '~/data/legal'

const props = defineProps<{ error: NuxtError }>()
const is404 = computed(() => (props.error?.statusCode ?? 404) === 404)

useSeoMeta({
  title: () => (is404.value ? page.title : 'Cipher4 AI & Robotics'),
  robots: 'noindex',
})
</script>

<template>
  <NuxtLayout name="c4">
    <section class="nf" aria-labelledby="nf-title">
      <div v-m:now="'lines'" class="c4-wrap nf__copy">
        <Eyebrow class="m-after" style="--i: -2">{{ is404 ? page.eyebrow : error?.statusCode }}</Eyebrow>
        <h1 id="nf-title" class="nf__title"><span class="m-mask"><span class="m-line">{{ page.heading }}</span></span></h1>
        <p v-if="is404" class="c4-lead m-after">{{ page.lead }}</p>
        <div class="nf__actions m-after" style="--i: 1">
          <C4Button :to="page.primary.to" arrow>{{ page.primary.label }}</C4Button>
          <C4Button :to="page.secondary.to" variant="secondary">{{ page.secondary.label }}</C4Button>
        </div>
        <nav class="nf__links m-after" style="--i: 2" aria-label="Site sections">
          <NuxtLink v-for="l in page.links" :key="l.to" :to="l.to" class="nf__link">
            {{ l.label }}<C4Glyph name="arrow" />
          </NuxtLink>
        </nav>
      </div>
      <div class="nf__road">
        <HyperspeedRoad preset="notfound" />
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.nf {
  background: var(--white);
}

.nf__copy {
  display: flex;
  flex-direction: column;
  gap: var(--s-24);
  padding-top: calc(68px + var(--s-16) + var(--s-64));
  padding-bottom: var(--s-48);
}

.nf__copy > * {
  max-width: 680px;
}

.nf__title {
  font-size: clamp(46px, 5.6vw, 80px);
  line-height: 1;
  letter-spacing: -0.045em;
  font-weight: 400;
}

.nf__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-12);
}

.nf__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0 var(--s-32);
  padding-top: var(--s-8);
}

.nf__link {
  display: inline-flex;
  align-items: center;
  gap: var(--s-8);
  min-height: 44px;
  font-size: 16px;
  font-weight: 500;
  color: var(--indigo);
}

.nf__link .c4-glyph {
  color: var(--amber);
  transition: transform var(--dur-ui) var(--ease-out);
}

.nf__link:hover .c4-glyph {
  transform: translateX(4px);
}

.nf__road {
  height: 460px;
  border-top: 1px solid var(--line);
}

@media (max-width: 900px) {
  .nf__road {
    height: 330px;
  }
}

@media (max-width: 767px) {
  .nf__copy {
    padding-top: calc(52px + var(--s-12) + var(--s-48));
  }

  .nf__actions :deep(.c4-btn--primary) {
    width: 100%;
  }
}
</style>
