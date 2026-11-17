<script setup lang="ts">
/**
 * Layout for the redesigned pages. `.c4` scopes the new base styles (see
 * assets/css/base.css). The header floats over the top of the page, so each
 * page's first section allows for it.
 */
</script>

<template>
  <div class="c4">
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
