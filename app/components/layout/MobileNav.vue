<script setup lang="ts">
import { primaryNav } from '~/data/navigation'
import { company, telHref, headquarters } from '~/data/company'

defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()

const route = useRoute()
const expanded = ref<string | null>(null)

function toggle(to: string) {
  expanded.value = expanded.value === to ? null : to
}

function isActive(to: string) {
  return route.path === to || (to !== '/' && route.path.startsWith(to))
}
</script>

<template>
  <Transition name="sheet">
    <div v-if="open" class="glass glass--3 sheet">
      <nav class="sheet__nav" aria-label="Mobile">
        <ul class="sheet__list">
          <li v-for="item in primaryNav" :key="item.to" class="sheet__item">
            <div class="sheet__row">
              <NuxtLink
                :to="item.to"
                class="sheet__link"
                :class="{ 'sheet__link--active': isActive(item.to) }"
                @click="$emit('close')"
              >
                {{ item.label }}
              </NuxtLink>

              <button
                v-if="item.children"
                type="button"
                class="sheet__expand"
                :aria-expanded="expanded === item.to"
                :aria-label="`Show ${item.label} pages`"
                @click="toggle(item.to)"
              >
                <Icon
                  name="lucide:chevron-down"
                  size="20"
                  :class="{ 'sheet__chevron--open': expanded === item.to }"
                />
              </button>
            </div>

            <ul v-if="item.children && expanded === item.to" class="sheet__sublist">
              <li v-for="child in item.children" :key="child.to">
                <NuxtLink :to="child.to" class="sheet__sublink" @click="$emit('close')">
                  {{ child.label }}
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <div class="sheet__footer">
        <NuxtLink to="/contact" class="btn btn--accent btn--block" @click="$emit('close')">
          Book a Consultation
        </NuxtLink>

        <div class="sheet__contact">
          <a :href="`mailto:${company.email}`" class="sheet__contact-link">
            <Icon name="lucide:mail" size="18" />
            {{ company.email }}
          </a>
          <a :href="telHref(headquarters.phone)" class="sheet__contact-link">
            <Icon name="lucide:phone" size="18" />
            {{ headquarters.phone }}
          </a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.sheet {
  position: fixed;
  /* Clears the floating header bar: 1rem outer padding + 3.75rem bar + 1rem.
     The header no longer spans the full width, so this cannot be derived from
     a border — it has to match the bar's own metrics. */
  inset-block-start: 5.75rem;
  inset-inline: var(--gutter);
  inset-block-end: var(--space-4);
  z-index: var(--z-overlay);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-6);
  padding: var(--space-6) var(--space-6) var(--space-8);
  border-radius: var(--radius-xl);
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* The sheet's own content sits above the glass rim and shine layers. */
.sheet > * {
  position: relative;
  z-index: 3;
}

@media (min-width: 64rem) {
  .sheet {
    display: none;
  }
}

.sheet__list {
  display: grid;
  gap: var(--space-1);
}

.sheet__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  border-block-end: 1px solid var(--border-default);
}

.sheet__link {
  flex: 1;
  /* 44px minimum tap target */
  padding-block: var(--space-4);
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: var(--fw-semibold);
  letter-spacing: var(--tracking-tight);
  color: var(--text-primary);
}

.sheet__link--active {
  color: var(--text-accent);
}

.sheet__expand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
}

.sheet__chevron--open {
  transform: rotate(180deg);
}

.sheet__sublist {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-2) 0 var(--space-3) var(--space-4);
  border-inline-start: 2px solid var(--border-default);
  margin-inline-start: var(--space-1);
}

.sheet__sublink {
  display: block;
  padding-block: var(--space-3);
  font-size: var(--fs-body);
  color: var(--text-secondary);
}

.sheet__footer {
  display: grid;
  gap: var(--space-5);
}

.sheet__contact {
  display: grid;
  gap: var(--space-3);
}

.sheet__contact-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: 2.75rem;
  font-size: var(--fs-sm);
  color: var(--text-secondary);
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity var(--dur-base) var(--ease-out),
    transform var(--dur-base) var(--ease-out);
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
