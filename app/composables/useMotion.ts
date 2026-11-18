/**
 * The motion system's shared state (Phase 6; Motion and Choreography boards).
 *
 * Three layers, lightest first:
 *   1. Entrances (v-m directive + assets/css/motion.css). Each section plays
 *      its own movement once, the first time it is 25% visible. CSS does
 *      the movement; an IntersectionObserver only flips `.m-in`.
 *   2. Lenis smooth scrolling, connected to GSAP ScrollTrigger. Loaded after
 *      the page is up (plugins/motion.client.ts), never before the headline.
 *   3. Scroll-linked moments (useScrollMoment), built on ScrollTrigger:
 *      leaving the hero, the mission words, How we deliver, the case study
 *      screen, and the tone that eases between sections.
 *
 * Reduced motion turns all three off: every section is shown finished,
 * Lenis never starts, and no scroll-linked moment is built.
 */
import type { default as LenisType } from 'lenis'

type Gsap = typeof import('gsap').gsap
type ST = typeof import('gsap/ScrollTrigger').ScrollTrigger

export interface MotionLibs {
  gsap: Gsap
  ScrollTrigger: ST
  lenis: LenisType | null
}

let libs: MotionLibs | null = null
const waiting: ((l: MotionLibs) => void)[] = []

/** True when the device has not asked for reduced motion. */
export function motionAllowed(): boolean {
  if (!import.meta.client) return false
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Called once by the motion plugin when GSAP, ScrollTrigger and Lenis are up. */
export function provideMotionLibs(l: MotionLibs) {
  libs = l
  for (const cb of waiting.splice(0)) cb(l)
}

export function getMotionLibs(): MotionLibs | null {
  return libs
}

/** Runs `cb` as soon as the motion libraries are loaded (or now, if they are). */
export function whenMotionReady(cb: (l: MotionLibs) => void) {
  if (libs) cb(libs)
  else waiting.push(cb)
}

/**
 * A scroll-linked moment, built when the libraries are ready and torn down
 * with the component. Everything made inside `setup` (tweens and
 * ScrollTriggers) is collected by a gsap.context and reverted on unmount.
 * `setup` may return a clean-up function for anything else.
 * Never runs with reduced motion.
 */
export function useScrollMoment(setup: (l: MotionLibs) => void | (() => void)) {
  let ctx: { revert: () => void } | null = null
  let extra: void | (() => void)
  let alive = true

  onMounted(() => {
    if (!motionAllowed()) return
    whenMotionReady((l) => {
      if (!alive) return
      ctx = l.gsap.context(() => { extra = setup(l) })
      // Positions changed: let every trigger measure again.
      requestAnimationFrame(() => l.ScrollTrigger.refresh())
    })
  })

  onBeforeUnmount(() => {
    alive = false
    if (typeof extra === 'function') extra()
    ctx?.revert()
  })
}
