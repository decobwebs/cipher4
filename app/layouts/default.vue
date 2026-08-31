<template>
  <a href="#main" class="skip-link">Skip to content</a>
  <LayoutAppHeader />
  <main id="main" class="site-main">
    <slot />
  </main>
  <LayoutAppFooter />
</template>

<style scoped>
/* Offsets the fixed header. */
.site-main {
  padding-block-start: 4.5rem;
}
</style>
