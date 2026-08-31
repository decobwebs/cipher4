<script setup lang="ts">
import { primaryNav } from '~/data/navigation'

const route = useRoute()
const mobileOpen = ref(false)
const openDropdown = ref<string | null>(null)
const scrolled = ref(false)

/**
 * The header is a light glass pill in every context.
 *
 * An earlier version flipped it to `.on-dark` while over the hero, which was
 * right when the home hero was a dark full-bleed band. It no longer is — the
 * hero is light, with the dark instrument panel contained inside it — so the
 * flip would have inverted the header against a white background.
 *
 * On inner pages the pill does sit over PageHero's dark band, and a white
 * frosted pill on dark reads correctly there too. One treatment, no branching.
 * `scrolled` now only drives the shadow.
 */
function onScroll() {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))

// Close everything on navigation.
watch(() => route.fullPath, () => {
  mobileOpen.value = false
  openDropdown.value = null
})

// Lock body scroll while the mobile sheet is open.
watch(mobileOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

function isActive(to: string) {
  return route.path === to || (to !== '/' && route.path.startsWith(to))
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    openDropdown.value = null
    mobileOpen.value = false
  }
}
</script>

<template>
  <header
    class="header no-print"
    :class="{ 'header--scrolled': scrolled }"
    @keydown="onKeydown"
  >
    <div class="container container--wide header__outer">
      <!-- GlassSurface rather than the plain `.glass` primitive: the bar
           floats over the hero's liquid shader, which is the one place on the
           page where there is enough behind the glass for refraction to
           actually show. Over flat white it would be invisible and would cost
           an SVG filter for nothing. -->
      <!-- Displacement is deliberately small.
           At -110 the filter shifted the backdrop by up to 110px, which turned
           any text scrolling under the bar into mirrored, colour-fringed
           smears — the per-channel offsets compounding it. A pane this thin
           refracts by a few pixels, not a hundred. This keeps the refraction
           visible at the rim while what passes behind stays readable. -->
      <UiGlassSurface
        :radius="999"
        :level="2"
        :distortion="-26"
        :green-offset="2"
        :blue-offset="5"
        :displace="0.3"
        class="shine header__bar"
      >
        <NuxtLink to="/" class="header__brand" aria-label="Cipher4 AI & Robotics, home">
          <span class="header__logo-plate">
            <img
              src="/images/cipher4-logo.png"
              alt=""
              width="28"
              height="28"
              class="header__logo"
            >
          </span>
          <span class="header__wordmark">
            Cipher4 <span class="header__wordmark-accent">AI &amp; Robotics</span>
          </span>
        </NuxtLink>

        <nav class="header__nav" aria-label="Main">
          <ul class="header__nav-list">
            <li
              v-for="item in primaryNav"
              :key="item.to"
              class="header__nav-item"
              @mouseenter="item.children && (openDropdown = item.to)"
              @mouseleave="item.children && (openDropdown = null)"
            >
              <NuxtLink
                :to="item.to"
                class="header__link"
                :class="{ 'header__link--active': isActive(item.to) }"
                :aria-expanded="item.children ? String(openDropdown === item.to) : undefined"
                @focus="openDropdown = item.children ? item.to : null"
              >
                {{ item.label }}
                <Icon
                  v-if="item.children"
                  name="lucide:chevron-down"
                  class="header__chevron"
                  :class="{ 'header__chevron--open': openDropdown === item.to }"
                />
              </NuxtLink>

              <Transition name="dropdown">
                <div
                  v-if="item.children && openDropdown === item.to"
                  class="glass glass--3 dropdown"
                >
                  <ul class="dropdown__list">
                    <li v-for="child in item.children" :key="child.to">
                      <NuxtLink :to="child.to" class="dropdown__item">
                        <span class="dropdown__item-label">{{ child.label }}</span>
                        <span v-if="child.description" class="dropdown__item-desc">
                          {{ child.description }}
                        </span>
                      </NuxtLink>
                    </li>
                  </ul>
                </div>
              </Transition>
            </li>
          </ul>
        </nav>

        <div class="header__actions">
          <NuxtLink to="/contact" class="btn btn--accent header__cta">
            <span>Book a Consultation</span>
          </NuxtLink>

          <button
            type="button"
            class="header__toggle"
            :aria-expanded="mobileOpen"
            aria-controls="mobile-nav"
            :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
            @click="mobileOpen = !mobileOpen"
          >
            <Icon :name="mobileOpen ? 'lucide:x' : 'lucide:menu'" size="22" />
          </button>
        </div>
      </UiGlassSurface>
    </div>

    <LayoutMobileNav id="mobile-nav" :open="mobileOpen" @close="mobileOpen = false" />
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: var(--z-header);
}

/* The bar floats rather than spanning the full width — the Sylva reference,
   and it is what lets the nebula read continuously behind it. */
.header__outer {
  padding-block: var(--space-4);
}

.header__bar {
  border-radius: var(--radius-pill);
  transition:
    background-color var(--dur-base) var(--ease-out),
    border-color var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out);
}

/* GlassSurface wraps its slot in .gsurface__content, so the bar's own flex
   layout has to be applied there rather than on the root. */
.header__bar :deep(.gsurface__content) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  min-height: 3.75rem;
  padding: var(--space-2) var(--space-2) var(--space-2) var(--space-4);
}

.header--scrolled .header__bar {
  box-shadow: var(--shadow-3);
}

/* --- Brand -------------------------------------------------------------- */

.header__brand {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

.header__brand:hover { color: inherit; }

.header__logo-plate {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-default);
  background-color: var(--bg-accent-wash);
}

.header__logo {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: contain;
}

.header__wordmark {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: var(--fw-bold);
  letter-spacing: var(--tracking-tight);
  color: var(--text-primary);
  white-space: nowrap;
}

.header__wordmark-accent { color: var(--text-accent); }

/* Below 30rem the wordmark competes with the toggle for space. */
@media (max-width: 30rem) {
  .header__wordmark-accent { display: none; }
}

/* --- Desktop nav -------------------------------------------------------- */

.header__nav { display: none; }

@media (min-width: 64rem) {
  .header__nav { display: block; }
}

.header__nav-list {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.header__nav-item {
  position: relative;
  z-index: 3;
}

/* Nav items are pills rather than underlined text — the same shape language
   as the sector chips and the CTA, so the bar reads as one control group. */
.header__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-pill);
  border: 1px solid transparent;
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  color: var(--text-secondary);
  white-space: nowrap;
  transition:
    color var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.header__link:hover {
  color: var(--text-primary);
  background-color: var(--bg-accent-wash);
}

.header__link--active {
  color: var(--text-primary);
  border-color: var(--border-default);
  background-color: var(--bg-accent-wash);
}

.header__chevron {
  width: 0.875rem;
  height: 0.875rem;
  transition: transform var(--dur-fast) var(--ease-out);
}

.header__chevron--open { transform: rotate(180deg); }

/* --- Dropdown ----------------------------------------------------------- */

.dropdown {
  position: absolute;
  inset-block-start: calc(100% + var(--space-3));
  inset-inline-start: 0;
  min-width: 21rem;
  padding: var(--space-2);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-3);
}

.dropdown__list {
  position: relative;
  z-index: 3;
  display: grid;
  gap: 2px;
}

.dropdown__item {
  display: block;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  transition: background-color var(--dur-fast) var(--ease-out);
}

.dropdown__item:hover {
  background-color: var(--bg-accent-wash);
  color: inherit;
}

.dropdown__item-label {
  display: block;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-primary);
}

.dropdown__item-desc {
  display: block;
  margin-block-start: 2px;
  font-size: var(--fs-xs);
  line-height: var(--lh-snug);
  color: var(--text-secondary);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* --- Actions ------------------------------------------------------------ */

.header__actions {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.header__cta { display: none; }

@media (min-width: 48rem) {
  .header__cta { display: inline-flex; }
}

.header__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 44px — the old mobile toggle was a 32px target */
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--radius-pill);
  color: var(--text-primary);
  transition: background-color var(--dur-fast) var(--ease-out);
}

.header__toggle:hover { background-color: var(--bg-accent-wash); }

@media (min-width: 64rem) {
  .header__toggle { display: none; }
}
</style>
