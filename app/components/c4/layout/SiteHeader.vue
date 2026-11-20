<script setup lang="ts">
/**
 * Floating white pill (Home-Desktop board), with dropdowns for Services,
 * Sectors and Company (content B2).
 *
 * Desktop: fixed at the top; slides away while scrolling down and returns on
 * the way up. Phones: sits at the top of the page and scrolls away; the
 * action dock takes over and the menu button opens the full-screen menu.
 *
 * Dropdowns are disclosure buttons: click, Enter or Space to open; hover
 * opens them too on a mouse. Escape, a click outside or moving focus away
 * closes them. The footer carries every link, so the site still works with
 * JavaScript off.
 */
import { mainNav, primaryCta } from '~/data/site'

const route = useRoute()
const menuOpen = useMenuOpen()
const { y, direction } = useScrollState()

const open = ref<string | null>(null)
const root = ref<HTMLElement | null>(null)
const triggers = ref<Record<string, HTMLButtonElement | null>>({})
let hoverTimer: ReturnType<typeof setTimeout> | undefined
const finePointer = ref(false)

const hidden = computed(() => !open.value && direction.value === 'down' && y.value > 160)

const panelId = (label: string) => `c4-nav-${label.toLowerCase()}`

// On a mouse, hovering opens the panel just before the click lands. That
// click should keep it open, not close it again.
let hoverOpenedAt = 0

function toggle(label: string) {
  if (open.value === label && Date.now() - hoverOpenedAt < 600) return
  open.value = open.value === label ? null : label
}

function close(returnFocus = false) {
  const was = open.value
  open.value = null
  if (returnFocus && was) triggers.value[was]?.focus()
}

function onEnter(label: string) {
  if (!finePointer.value) return
  clearTimeout(hoverTimer)
  if (open.value !== label) hoverOpenedAt = Date.now()
  open.value = label
}

function onLeave() {
  if (!finePointer.value) return
  clearTimeout(hoverTimer)
  hoverTimer = setTimeout(() => { open.value = null }, 160)
}

function onFocusOut(e: FocusEvent) {
  const next = e.relatedTarget as Node | null
  if (next && root.value?.contains(next)) return
  open.value = null
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) close(true)
}

function onDocClick(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) close()
}

onMounted(() => {
  finePointer.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  document.addEventListener('click', onDocClick)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  clearTimeout(hoverTimer)
})

watch(() => route.fullPath, () => { open.value = null })

const isCurrent = (to?: string) => !!to && (route.path === to || route.path.startsWith(`${to}/`))
const groupCurrent = (g: (typeof mainNav)[number]) =>
  isCurrent(g.to) || !!g.items?.some((i) => isCurrent(i.to))
</script>

<template>
  <div class="c4-header" :class="{ 'is-hidden': hidden }">
    <div class="c4-wrap">
      <header ref="root" class="c4-header__pill" @keydown="onKey" @focusout="onFocusOut">
        <NuxtLink to="/" class="c4-header__home">
          <C4Logo variant="inline" class="c4-header__logo" />
        </NuxtLink>

        <nav class="c4-header__nav" aria-label="Main">
          <ul class="c4-header__list">
            <li
              v-for="g in mainNav"
              :key="g.label"
              class="c4-header__item"
              @mouseenter="g.items && onEnter(g.label)"
              @mouseleave="g.items && onLeave()"
            >
              <button
                v-if="g.items"
                :ref="(el) => { triggers[g.label] = el as HTMLButtonElement }"
                type="button"
                class="c4-header__trigger"
                :class="{ 'is-open': open === g.label, 'is-current': groupCurrent(g) }"
                :aria-expanded="open === g.label"
                :aria-controls="panelId(g.label)"
                @click="toggle(g.label)"
              >
                {{ g.label }}
                <C4Glyph name="chevron" :size="12" class="c4-header__chev" />
              </button>
              <NuxtLink
                v-else
                :to="g.to!"
                class="c4-header__trigger"
                :class="{ 'is-current': groupCurrent(g) }"
              >{{ g.label }}</NuxtLink>
            </li>
          </ul>

          <!-- Panels sit under the whole pill, centred, so they never run
               off the edge of a laptop screen. -->
          <template v-for="g in mainNav" :key="`p-${g.label}`">
            <div
              v-if="g.items"
              v-show="open === g.label"
              :id="panelId(g.label)"
              class="c4-header__panel"
              :class="`c4-header__panel--${g.label.toLowerCase()}`"
              @mouseenter="onEnter(g.label)"
              @mouseleave="onLeave"
            >
              <ul class="c4-header__panel-list">
                <li v-for="(it, i) in g.items" :key="it.to">
                  <NuxtLink
                    :to="it.to"
                    class="c4-header__link"
                    :class="{ 'has-icon': it.icon, 'is-current': isCurrent(it.to) }"
                    :aria-current="route.path === it.to ? 'page' : undefined"
                  >
                    <C4Icon v-if="it.icon" :name="it.icon" :size="26" :delay="i * 0.06" />
                    <span class="c4-header__link-text">
                      <span class="c4-header__link-title">{{ it.label }}</span>
                      <span v-if="it.line" class="c4-header__link-line">{{ it.line }}</span>
                    </span>
                  </NuxtLink>
                </li>
              </ul>
              <div v-if="g.all" class="c4-header__panel-foot">
                <C4Button :to="g.all.to" variant="text">{{ g.all.label }}</C4Button>
              </div>
            </div>
          </template>
        </nav>

        <C4Button :to="primaryCta.to" size="sm" class="c4-header__cta">{{ primaryCta.label }}</C4Button>

        <button
          type="button"
          class="c4-header__menu"
          aria-controls="c4-menu"
          :aria-expanded="menuOpen"
          @click="menuOpen = true"
        >
          <C4Glyph name="menu" />
          <span class="c4-sr-only">Open menu</span>
        </button>
      </header>
    </div>
  </div>
</template>

<style scoped>
.c4-header {
  position: absolute;
  inset: 0 0 auto;
  z-index: var(--z-header);
  padding-top: var(--s-12);
  transition: transform 420ms var(--ease-out);
}

.c4-header__pill {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-16);
  height: 52px;
  padding: 0 var(--s-4) 0 var(--s-16);
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-float);
}

.c4-header__home {
  display: flex;
  align-items: center;
  min-height: 44px;
  border-radius: var(--radius-pill);
}

.c4-header__logo :deep(.c4-logo__mark) {
  width: 26px;
  height: 26px;
}

.c4-header__logo :deep(.c4-logo__name) {
  font-size: 17px;
}

.c4-header__logo :deep(.c4-logo__desc),
.c4-header__nav,
.c4-header__cta {
  display: none;
}

.c4-header__menu {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--paper);
  border: 1px solid var(--line);
  color: var(--ink);
}

/* --- Desktop ---------------------------------------------------------- */
@media (min-width: 901px) {
  .c4-header {
    position: fixed;
    padding-top: var(--s-16);
  }

  .c4-header.is-hidden:not(:focus-within) {
    transform: translateY(calc(-100% - var(--s-16)));
  }

  .c4-header__pill {
    height: 68px;
    padding: 0 var(--s-8) 0 var(--s-24);
    background: rgba(255, 255, 255, 0.86);
  }

  .c4-header__logo :deep(.c4-logo__mark) {
    width: 32px;
    height: 32px;
  }

  .c4-header__logo :deep(.c4-logo__name) {
    font-size: 19px;
  }

  .c4-header__logo :deep(.c4-logo__desc) {
    display: inline;
  }

  .c4-header__nav {
    display: block;
  }

  .c4-header__cta {
    display: inline-flex;
  }

  .c4-header__menu {
    display: none;
  }
}

/* The descriptor crowds the nav on small laptops. */
@media (min-width: 901px) and (max-width: 1100px) {
  .c4-header__logo :deep(.c4-logo__desc) {
    display: none;
  }
}

.c4-header__list {
  display: flex;
  align-items: center;
  gap: var(--s-8);
  list-style: none;
}

.c4-header__trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 var(--s-12);
  border-radius: var(--radius-pill);
  font-size: 15px;
  color: var(--ink-2);
  transition: color var(--dur-ui) var(--ease-out), background-color var(--dur-ui) var(--ease-out);
}

.c4-header__trigger:hover,
.c4-header__trigger.is-open {
  color: var(--ink);
  background: var(--paper);
}

.c4-header__trigger.is-current {
  color: var(--ink);
}

/* The signal node marks the open item, or the section you are in. */
.c4-header__trigger::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 4px;
  width: 5px;
  height: 5px;
  margin-left: -2.5px;
  border-radius: 50%;
  background: var(--amber);
  transform: scale(0);
  transition: transform var(--dur-ui) var(--ease-out);
}

.c4-header__trigger.is-open::after,
.c4-header__trigger.is-current::after {
  transform: scale(1);
}

.c4-header__chev {
  color: var(--grey);
  transition: transform var(--dur-ui) var(--ease-out);
}

.c4-header__trigger.is-open .c4-header__chev {
  transform: rotate(180deg);
}

/* --- Panels ------------------------------------------------------------ */
.c4-header__panel {
  position: absolute;
  top: calc(100% + var(--s-12));
  left: 50%;
  width: min(380px, 100%);
  transform: translateX(-50%);
  padding: var(--s-16);
  border-radius: var(--radius-card);
  background: var(--white);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-panel);
  animation: c4-panel-in 260ms var(--ease-out);
}

.c4-header__panel--services {
  width: min(680px, 100%);
}

@keyframes c4-panel-in {
  from { opacity: 0; transform: translate(-50%, -8px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

.c4-header__panel-list {
  display: grid;
  gap: var(--s-4);
  list-style: none;
}

.c4-header__panel--services .c4-header__panel-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.c4-header__link {
  display: flex;
  align-items: center;
  gap: var(--s-16);
  min-height: 48px;
  padding: var(--s-12) var(--s-16);
  border-radius: var(--s-12);
  transition: background-color var(--dur-ui) var(--ease-out);
}

.c4-header__link:hover,
.c4-header__link.is-current {
  background: var(--paper);
}

.c4-header__link-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.c4-header__link-title {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.35;
  color: var(--ink);
}

.c4-header__link-line {
  font-size: 14px;
  line-height: 1.4;
  color: var(--slate);
}

.c4-header__panel-foot {
  margin-top: var(--s-8);
  padding: var(--s-8) var(--s-16) 0;
  border-top: 1px solid var(--line);
}

@media (prefers-reduced-motion: reduce) {
  .c4-header__panel {
    animation: none;
  }
}
</style>
