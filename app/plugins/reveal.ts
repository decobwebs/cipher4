/**
 * Reveal-on-scroll.
 *
 * Replaces the ~65 lines of IntersectionObserver logic that were copy-pasted
 * into both index.html and about.html. Differences from that implementation:
 *
 *  - Content is only hidden once JS has confirmed it can run (`.js-reveal` on
 *    <html>). Previously elements were hidden by CSS at parse time, so a
 *    failed script or a no-JS visitor got a blank page.
 *  - Elements are unobserved after revealing. The old code kept observing and
 *    re-animated things on scroll-back, which read as jitter.
 *  - A single shared observer, not one per element.
 *  - Respects prefers-reduced-motion by never hiding anything at all.
 *
 * This plugin is deliberately NOT `.client` — a client-only directive is
 * unresolved during SSR, and Vue's server renderer throws on that
 * ("Cannot read properties of undefined (reading 'getSSRProps')"). It is
 * registered on both sides; the server half is a no-op.
 *
 * Usage:
 *   <div v-reveal>             fade + rise
 *   <div v-reveal="'left'">    slide in from the left
 *   <div v-reveal.stagger>     stagger the direct children
 */

export default defineNuxtPlugin((nuxtApp) => {
  // --- Server: register a no-op so SSR can resolve the directive ----------
  if (import.meta.server) {
    nuxtApp.vueApp.directive('reveal', {
      getSSRProps: () => ({}),
    })
    return
  }

  // --- Client -------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  // Opt in to the hiding styles only when we can guarantee we will undo them.
  if (!prefersReducedMotion) {
    document.documentElement.classList.add('js-reveal')
  }

  let observer: IntersectionObserver | null = null

  const getObserver = () => {
    if (observer) return observer

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-revealed')
          observer?.unobserve(entry.target)
        }
      },
      {
        // Fire slightly before the element is fully in view, so the motion
        // has finished by the time the reader's eye arrives.
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1,
      },
    )

    return observer
  }

  nuxtApp.vueApp.directive('reveal', {
    getSSRProps: () => ({}),

    mounted(el: HTMLElement, binding) {
      if (prefersReducedMotion) {
        el.classList.add('is-revealed')
        return
      }

      const direction = typeof binding.value === 'string' ? binding.value : 'up'
      el.setAttribute('data-reveal', direction)

      if (binding.modifiers.stagger) {
        el.setAttribute('data-reveal-stagger', '')
        Array.from(el.children).forEach((child, i) => {
          ;(child as HTMLElement).style.setProperty('--i', String(i))
        })
      }

      if (typeof binding.value === 'number') {
        el.style.setProperty('--reveal-delay', `${binding.value}ms`)
      }

      // Anything already in view on load reveals immediately rather than
      // waiting for a scroll that may never come.
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        requestAnimationFrame(() => el.classList.add('is-revealed'))
        return
      }

      getObserver().observe(el)
    },

    unmounted(el: HTMLElement) {
      observer?.unobserve(el)
    },
  })
})
