<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error?.statusCode === 404)

useSeoMeta({
  title: () => (is404.value ? 'Page not found — Cipher4' : 'Something went wrong — Cipher4'),
  robots: 'noindex',
})
</script>

<template>
  <div>
    <NuxtLayout>
      <section class="section err">
        <div class="container">
          <div class="err__body">
            <p class="eyebrow">{{ error?.statusCode || 'Error' }}</p>
            <h1 class="mt-4">
              {{ is404 ? 'That page is not here' : 'Something went wrong' }}
            </h1>
            <p class="lead mt-4">
              <template v-if="is404">
                The link may be out of date, or the page may have moved when we
                rebuilt this site. The sections below cover everything.
              </template>
              <template v-else>
                An unexpected error occurred. Try again, and if it persists
                please tell us what you were doing when it happened.
              </template>
            </p>

            <div class="cluster mt-8">
              <NuxtLink to="/" class="btn btn--primary">Back to home</NuxtLink>
              <NuxtLink to="/contact" class="btn btn--secondary">Contact us</NuxtLink>
            </div>

            <nav class="err__nav" aria-label="Site sections">
              <NuxtLink to="/solutions" class="err__link">
                <Icon name="lucide:layers" size="18" />
                <span><strong>Solutions</strong>What we build</span>
              </NuxtLink>
              <NuxtLink to="/industries" class="err__link">
                <Icon name="lucide:factory" size="18" />
                <span><strong>Industries</strong>Sectors we work in</span>
              </NuxtLink>
              <NuxtLink to="/credentials" class="err__link">
                <Icon name="lucide:badge-check" size="18" />
                <span><strong>Credentials</strong>For procurement</span>
              </NuxtLink>
              <NuxtLink to="/about" class="err__link">
                <Icon name="lucide:building-2" size="18" />
                <span><strong>About</strong>Who we are</span>
              </NuxtLink>
            </nav>
          </div>
        </div>
      </section>
    </NuxtLayout>
  </div>
</template>

<style scoped>
.err {
  padding-block: var(--space-24);
}

.err__body {
  max-width: 44rem;
}

.err__nav {
  display: grid;
  gap: var(--space-2);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  margin-block-start: var(--space-12);
  padding-block-start: var(--space-8);
  border-block-start: 1px solid var(--border-default);
}

.err__link {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-4);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: background-color var(--dur-fast) var(--ease-out);
}

.err__link:hover {
  background-color: var(--bg-subtle);
  color: var(--text-secondary);
}

.err__link :deep(svg) {
  color: var(--text-accent);
}

.err__link strong {
  display: block;
  font-size: var(--fs-sm);
  color: var(--text-primary);
}

.err__link span {
  font-size: var(--fs-xs);
}
</style>
