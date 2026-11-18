<script setup lang="ts">
/**
 * Layout for every page. `.c4` scopes the base styles (assets/css/base.css).
 * The header floats over the top of the page, so each page's first section
 * allows for it.
 *
 * .c4-tone is the fixed ground behind the page (Phase 6): with motion on,
 * the sections' own grounds are lifted onto it and it eases between white,
 * paper and mist as you scroll (plugins/motion.client.ts).
 */
</script>

<template>
  <div class="c4">
    <div class="c4-tone" aria-hidden="true">
      <i data-tone="white" />
      <i data-tone="paper" />
      <i data-tone="mist" />
    </div>
    <a href="#main" class="c4-skip">Skip to content</a>
    <SiteHeader />
    <main id="main" tabindex="-1" class="c4-main">
      <slot />
    </main>
    <SiteFooter />
    <ActionDock />
    <MobileMenu />
  </div>
</template>

<style scoped>
.c4-main:focus {
  outline: none;
}
</style>
