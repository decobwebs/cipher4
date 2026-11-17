/**
 * useReveal: one-time entrances.
 *
 * Marks an element as revealed the first time it is 25% visible, then stops
 * watching it. It never replays on scrolling back (plan, Phase 6). All
 * elements share one IntersectionObserver.
 *
 * Under reduced motion, or where IntersectionObserver is missing, everything
 * counts as revealed straight away, so it appears in its finished state.
 * CSS does the movement; this only flips the flag.
 */
import type { Ref } from 'vue'

type Callback = () => void

let observer: IntersectionObserver | null = null
const callbacks = new WeakMap<Element, Callback>()

function getObserver(): IntersectionObserver {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const cb = callbacks.get(entry.target)
        observer!.unobserve(entry.target)
        callbacks.delete(entry.target)
        cb?.()
      }
    },
    { threshold: 0.25 },
  )
  return observer
}

export function prefersReducedMotion(): boolean {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useReveal(target: Ref<Element | null | undefined>, options: { immediate?: boolean } = {}) {
  const revealed = ref(false)

  onMounted(() => {
    const el = target.value
    if (!el) return
    if (options.immediate || prefersReducedMotion() || !('IntersectionObserver' in window)) {
      // Next frame, so the "before" state paints once and the transition runs.
      requestAnimationFrame(() => { revealed.value = true })
      return
    }
    callbacks.set(el, () => { revealed.value = true })
    getObserver().observe(el)
  })

  onBeforeUnmount(() => {
    const el = target.value
    if (el && observer) {
      observer.unobserve(el)
      callbacks.delete(el)
    }
  })

  return { revealed }
}
