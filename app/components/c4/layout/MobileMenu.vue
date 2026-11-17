<script setup lang="ts">
/**
 * Full-screen phone menu (Phone-Screens 02, content B2).
 *
 * Large links you can hit without aiming. Services, Sectors and Company open
 * in place (Services and Sectors with their icons). "Talk to us" and the
 * contact details stay pinned at the bottom.
 *
 * A modal dialog: focus moves in and is kept inside, Escape closes it, the
 * page behind can't scroll, and focus returns to the menu button on close.
 */
import { mainNav, primaryCta, contact, telHref } from '~/data/site'

const openState = useMenuOpen()
const route = useRoute()
const panel = ref<HTMLElement | null>(null)
const closeBtn = ref<HTMLButtonElement | null>(null)
const expanded = ref<string | null>('Services')
let opener: HTMLElement | null = null

const groupId = (label: string) => `c4-menu-${label.toLowerCase()}`

function close() {
  openState.value = false
}

function focusables(): HTMLElement[] {
  if (!panel.value) return []
  return Array.from(panel.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )).filter((el) => el.offsetParent !== null)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
    return
  }
  if (e.key !== 'Tab') return
  const items = focusables()
  if (!items.length) return
  const first = items[0]!
  const last = items[items.length - 1]!
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

watch(openState, async (isOpen) => {
  if (!import.meta.client) return
  if (isOpen) {
    opener = document.activeElement as HTMLElement | null
    document.documentElement.style.overflow = 'hidden'
    await nextTick()
    closeBtn.value?.focus()
  } else {
    document.documentElement.style.overflow = ''
    opener?.focus()
    opener = null
  }
})

watch(() => route.fullPath, () => { openState.value = false })

// A phone turned to a laptop-sized window: the menu has no place there.
onMounted(() => {
  const mq = window.matchMedia('(min-width: 901px)')
  const onChange = () => { if (mq.matches) openState.value = false }
  mq.addEventListener('change', onChange)
  onBeforeUnmount(() => mq.removeEventListener('change', onChange))
})

onBeforeUnmount(() => {
  if (import.meta.client) document.documentElement.style.overflow = ''
})
</script>

<template>
  <div
    v-show="openState"
    id="c4-menu"
    ref="panel"
    class="c4-menu"
    role="dialog"
    aria-modal="true"
    aria-label="Menu"
    @keydown="onKey"
  >
    <div class="c4-menu__top">
      <div class="c4-menu__bar">
        <NuxtLink to="/" class="c4-menu__home" aria-label="Cipher4, home">
          <C4Logo variant="inline" hide-descriptor :size="26" class="c4-menu__logo" />
        </NuxtLink>
        <button ref="closeBtn" type="button" class="c4-menu__close" @click="close">
          <C4Glyph name="close" />
          <span class="c4-sr-only">Close menu</span>
        </button>
      </div>
    </div>

    <nav class="c4-menu__nav" aria-label="Main">
      <ul class="c4-menu__groups">
        <li v-for="g in mainNav" :key="g.label" class="c4-menu__group">
          <template v-if="g.items">
            <button
              type="button"
              class="c4-menu__row"
              :aria-expanded="expanded === g.label"
              :aria-controls="groupId(g.label)"
              @click="expanded = expanded === g.label ? null : g.label"
            >
              <span>{{ g.label }}</span>
              <C4Glyph :name="expanded === g.label ? 'minus' : 'plus'" class="c4-menu__sign" />
            </button>
            <ul v-show="expanded === g.label" :id="groupId(g.label)" class="c4-menu__sub">
              <li v-for="(it, i) in g.items" :key="it.to">
                <NuxtLink
                  :to="it.to"
                  class="c4-menu__link"
                  :aria-current="route.path === it.to ? 'page' : undefined"
                >
                  <C4Icon v-if="it.icon" :name="it.icon" :size="26" :delay="i * 0.06" />
                  <span>{{ it.label }}</span>
                </NuxtLink>
              </li>
              <li v-if="g.all">
                <NuxtLink :to="g.all.to" class="c4-menu__link c4-menu__link--all">
                  <span>{{ g.all.label }}</span>
                  <C4Glyph name="arrow" class="c4-menu__all-arrow" />
                </NuxtLink>
              </li>
            </ul>
          </template>
          <NuxtLink
            v-else
            :to="g.to!"
            class="c4-menu__row"
            :aria-current="route.path === g.to ? 'page' : undefined"
          >{{ g.label }}</NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="c4-menu__foot">
      <C4Button :to="primaryCta.to" block arrow>{{ primaryCta.label }}</C4Button>
      <div class="c4-menu__contact">
        <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
        <a :href="telHref(contact.phone)">{{ contact.phone }}</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c4-menu {
  position: fixed;
  inset: 0;
  z-index: var(--z-menu);
  display: flex;
  flex-direction: column;
  background: var(--white);
  overscroll-behavior: contain;
  animation: c4-menu-in 320ms var(--ease-out);
}

@keyframes c4-menu-in {
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: none; }
}

.c4-menu__top {
  flex: none;
  padding: var(--s-12) var(--gutter) 0;
}

.c4-menu__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 58px;
  padding: 0 var(--s-4) 0 var(--s-16);
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-float);
}

.c4-menu__home {
  display: flex;
  align-items: center;
  min-height: 44px;
}

.c4-menu__logo :deep(.c4-logo__name) {
  font-size: 17px;
}

.c4-menu__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--ink);
  color: var(--white);
}

.c4-menu__nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--s-24) var(--gutter) var(--s-32);
}

.c4-menu__groups {
  list-style: none;
}

.c4-menu__group {
  border-top: 1px solid var(--line);
}

.c4-menu__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 64px;
  font-size: 28px;
  letter-spacing: -0.03em;
  line-height: 1.2;
  color: var(--ink);
  text-align: left;
}

.c4-menu__sign {
  color: var(--indigo);
}

.c4-menu__sub {
  display: flex;
  flex-direction: column;
  padding: 0 0 var(--s-12) 2px;
  list-style: none;
}

.c4-menu__link {
  display: flex;
  align-items: center;
  gap: var(--s-16);
  min-height: 48px;
  font-size: 16px;
  color: var(--ink);
}

.c4-menu__link--all {
  gap: 10px;
  color: var(--indigo);
  font-weight: 500;
}

.c4-menu__all-arrow {
  color: var(--amber);
}

.c4-menu__foot {
  flex: none;
  display: flex;
  flex-direction: column;
  gap: var(--s-12);
  padding: var(--s-24) var(--gutter) calc(var(--s-24) + env(safe-area-inset-bottom));
  background: var(--paper);
  border-top: 1px solid var(--line);
}

.c4-menu__contact {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0 var(--s-16);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--slate);
}

.c4-menu__contact a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}

@media (prefers-reduced-motion: reduce) {
  .c4-menu {
    animation: none;
  }
}
</style>
