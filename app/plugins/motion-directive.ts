/**
 * v-m: a section's entrance (Choreography board).
 *
 *   <section v-m="'deal'">            plays "deal" once, when 25% visible
 *   <section v-m:now="'rise'">        plays as soon as it is on the page
 *
 * The server writes data-m="deal" into the HTML, so the starting state is
 * there from the first paint (only when <html> has .c4-motion, which the
 * head script sets unless reduced motion is on). The client adds .m-in the
 * first time the element is 25% visible, and never takes it away: a
 * section does not replay when you scroll back to it.
 *
 * Children set their own order with style="--i: n" for staggers.
 */
import type { Directive } from 'vue'

let io: IntersectionObserver | null = null

function show(el: Element) {
  el.classList.add('m-in')
}

function observer() {
  io ??= new IntersectionObserver((list) => {
    for (const e of list) {
      if (!e.isIntersecting) continue
      io!.unobserve(e.target)
      show(e.target)
    }
  }, { threshold: 0.25 })
  return io
}

const m: Directive<HTMLElement, string> = {
  // v-m:now also writes data-m-now: the arrival headers run as CSS
  // animations from the first paint (motion.css), without waiting for this.
  getSSRProps(binding) {
    return { 'data-m': binding.value, ...(binding.arg === 'now' ? { 'data-m-now': '' } : {}) }
  },
  mounted(el, binding) {
    el.dataset.m = binding.value
    if (binding.arg === 'now') el.dataset.mNow = ''
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window) || binding.arg === 'now') {
      // Next frame, so the starting state paints once and the movement runs.
      requestAnimationFrame(() => requestAnimationFrame(() => show(el)))
      return
    }
    // A tall section can never be 25% visible on a small screen: count it
    // as in view once its top third is on screen instead.
    if (el.offsetHeight > window.innerHeight * 3) {
      const tall = new IntersectionObserver((list) => {
        if (list.some((e) => e.isIntersecting)) { tall.disconnect(); show(el) }
      }, { rootMargin: '0px 0px -33% 0px' })
      tall.observe(el)
      return
    }
    observer().observe(el)
  },
  beforeUnmount(el) {
    io?.unobserve(el)
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('m', m)
})
