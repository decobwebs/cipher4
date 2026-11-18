<script setup lang="ts">
/**
 * Floating action bar, phones only (Phone-Screens 01).
 *
 * Appears once the hero has scrolled away, hides while scrolling down and
 * returns on the way up. "Talk to us" and WhatsApp sit where a thumb reaches.
 * Hidden on the contact page, which pins its own send button, and while the
 * menu is open. When hidden it is also out of the tab order.
 */
import { primaryCta, contact } from '~/data/site'

const route = useRoute()
const menuOpen = useMenuOpen()
const { y, direction } = useScrollState()
const vh = ref(800)

onMounted(() => {
  const set = () => { vh.value = window.innerHeight }
  set()
  window.addEventListener('resize', set, { passive: true })
  onBeforeUnmount(() => window.removeEventListener('resize', set))
})

// Tolerant of a trailing slash (a static host may serve /contact/).
const suppressed = computed(() => route.path.replace(/\/$/, '') === '/contact' || menuOpen.value)
const shown = computed(() =>
  !suppressed.value && y.value > vh.value * 0.8 && direction.value === 'up',
)
</script>

<template>
  <div
    class="c4-dock"
    :class="{ 'is-shown': shown }"
    :inert="!shown || undefined"
    :aria-hidden="!shown || undefined"
  >
    <C4Button :to="primaryCta.to" arrow class="c4-dock__cta">{{ primaryCta.label }}</C4Button>
    <a
      :href="contact.whatsapp"
      class="c4-dock__wa"
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp (opens in a new tab)"
    >
      <C4Icon name="whatsapp" :size="26" still />
    </a>
  </div>
</template>

<style scoped>
.c4-dock {
  position: fixed;
  left: var(--s-12);
  right: var(--s-12);
  bottom: calc(var(--s-24) + env(safe-area-inset-bottom));
  z-index: var(--z-dock);
  display: flex;
  gap: var(--s-8);
  padding: var(--s-8);
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid var(--line);
  box-shadow: 0 16px 40px rgba(16, 32, 104, 0.18);
  transform: translateY(calc(100% + var(--s-48)));
  transition: transform 420ms var(--ease-out);
}

.c4-dock.is-shown {
  transform: none;
}

.c4-dock__cta {
  flex: 1;
  height: 50px;
  box-shadow: none;
}

.c4-dock__wa {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--paper);
  border: 1px solid var(--line);
}

@media (min-width: 901px) {
  .c4-dock {
    display: none;
  }
}
</style>
