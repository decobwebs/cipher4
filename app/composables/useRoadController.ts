/**
 * useRoadController: one shared controller for every road on the page.
 *
 * Rules (plan, Phase 2, step 2):
 *  - Only one road animates at a time: the most visible one. The others hold
 *    their last frame.
 *  - A road pauses when it is off screen or the tab is hidden.
 *  - Device tiers:
 *      full    desktop: every road
 *      mobile  phones and tablets: only the page's header road and the
 *              closing road, pixel ratio capped at 1.5
 *      still   reduced motion, Save-Data, 4 cores or fewer, or a measured
 *              frame rate under 40 fps for 2 seconds: still frames only
 *      none    no WebGL: still images only
 *  - The road code loads only after the page has loaded and the browser is
 *    idle, so it never delays the headline.
 *
 * Still frames are images exported from the real road (public/images/road),
 * so a device on the still tier never downloads the 3D code at all.
 */
import type { RoadHandle } from '~/lib/hyperspeed/index'
import type { RoadKind } from '~/lib/hyperspeed/roads'

export type RoadTier = 'full' | 'mobile' | 'still' | 'none'

export interface RoadEntry {
  el: HTMLElement
  kind: RoadKind
  /** Called when the road should start loading (it is near the screen). */
  onNear: () => void
  handle: RoadHandle | null
  baseSpeed: number
  ratio: number
  running: boolean
}

const LOWFPS_KEY = 'c4-road-lowfps'
const PRIORITY: Record<RoadKind, number> = { hero: 5, header: 4, closing: 3, deliver: 2, strip: 1 }

let tier: RoadTier | null = null
const entries = new Set<RoadEntry>()
let visObserver: IntersectionObserver | null = null
let nearObserver: IntersectionObserver | null = null
let libPromise: Promise<typeof import('~/lib/hyperspeed/index')> | null = null
let lastScrollAt = 0
let lastScrollY = 0
let scrollVelocity = 0 // px per second
let scheduleQueued = false
let scrollWired = false
let lastBest: RoadEntry | null = null

// --- Tier ------------------------------------------------------------------

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return !!gl
  } catch {
    return false
  }
}

function readLowFps(): boolean {
  try { return sessionStorage.getItem(LOWFPS_KEY) === '1' } catch { return false }
}

export function getRoadTier(): RoadTier {
  if (tier) return tier
  if (!import.meta.client) return 'none'
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const conn = (navigator as { connection?: { saveData?: boolean } }).connection
  const cores = navigator.hardwareConcurrency || 8
  if (!hasWebGL()) tier = 'none'
  else if (reduce || conn?.saveData || cores <= 4 || readLowFps()) tier = 'still'
  else if (window.matchMedia('(max-width: 1024px), (pointer: coarse)').matches) tier = 'mobile'
  else tier = 'full'
  return tier
}

/** May this kind of road animate on this device? */
export function roadMayAnimate(kind: RoadKind): boolean {
  const t = getRoadTier()
  if (t === 'full') return true
  if (t === 'mobile') return kind === 'hero' || kind === 'header' || kind === 'closing'
  return false
}

// --- Loading ---------------------------------------------------------------

function whenIdle(): Promise<void> {
  return new Promise((resolve) => {
    const idle = () => {
      const ric = (window as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback
      if (ric) ric(() => resolve(), { timeout: 2500 })
      else setTimeout(resolve, 300)
    }
    if (document.readyState === 'complete') idle()
    else window.addEventListener('load', idle, { once: true })
  })
}

/** The road module, loaded once, after load + idle. */
export function loadRoadLib() {
  libPromise ??= whenIdle().then(() => import('~/lib/hyperspeed/index'))
  return libPromise
}

// --- Visibility and scheduling ----------------------------------------------

function ensureObservers() {
  if (visObserver) return
  const thresholds = Array.from({ length: 21 }, (_, i) => i / 20)
  visObserver = new IntersectionObserver((list) => {
    for (const e of list) {
      const entry = [...entries].find((x) => x.el === e.target)
      if (entry) entry.ratio = e.isIntersecting ? e.intersectionRatio : 0
    }
    schedule()
  }, { threshold: thresholds })

  // Start loading a road when it is within half a screen of the viewport.
  nearObserver = new IntersectionObserver((list) => {
    for (const e of list) {
      if (!e.isIntersecting) continue
      const entry = [...entries].find((x) => x.el === e.target)
      if (!entry) continue
      nearObserver!.unobserve(e.target)
      entry.onNear()
    }
  }, { rootMargin: '50% 0px 50% 0px' })

  document.addEventListener('visibilitychange', schedule)
}

function wireScroll() {
  if (scrollWired) return
  scrollWired = true
  lastScrollY = window.scrollY
  let lastT = performance.now()
  window.addEventListener('scroll', () => {
    const now = performance.now()
    const dy = Math.abs(window.scrollY - lastScrollY)
    const dt = Math.max(16, now - lastT)
    scrollVelocity = (dy / dt) * 1000
    lastScrollY = window.scrollY
    lastT = now
    lastScrollAt = now
    schedule()
    // Settle: one more pass after scrolling stops, to pause scroll-driven roads.
    setTimeout(schedule, 200)
  }, { passive: true })
}

function scrolling() {
  return performance.now() - lastScrollAt < 180
}

function schedule() {
  if (scheduleQueued) return
  scheduleQueued = true
  requestAnimationFrame(() => {
    scheduleQueued = false
    run()
  })
}

function run() {
  const hidden = document.hidden
  // The one road allowed to move: most visible, then by priority.
  let best: RoadEntry | null = null
  for (const e of entries) {
    if (!e.handle || e.ratio <= 0 || !roadMayAnimate(e.kind)) continue
    // Scroll-driven roads are only candidates while the page is scrolling.
    if ((e.kind === 'strip' || e.kind === 'deliver') && !scrolling()) continue
    if (!best || e.ratio > best.ratio + 0.05 || (Math.abs(e.ratio - best.ratio) <= 0.05 && PRIORITY[e.kind] > PRIORITY[best.kind])) {
      best = e
    }
  }
  if (hidden) best = null
  // A different road taking over (or a new one being set up) stutters for a
  // moment while its shaders compile. Start the frame-rate check afresh, so
  // that stutter is never mistaken for a slow device.
  if (best !== lastBest) {
    lastBest = best
    fpsMonitor(false)
  }

  for (const e of entries) {
    if (!e.handle) continue
    const go = e === best
    if (go && (e.kind === 'strip' || e.kind === 'deliver')) {
      // Faster scrolling, faster road: 0.4x to 2.5x.
      e.handle.setSpeed(Math.min(2.5, Math.max(0.4, scrollVelocity / 900)))
    }
    if (go && !e.running) { e.handle.resume(); e.running = true }
    if (!go && e.running) { e.handle.pause(); e.running = false }
  }
  fpsMonitor(!!best)
}

// --- Frame-rate check ----------------------------------------------------------
// While a road animates, count frames. After a 1 s warm-up, if the average
// over a 2 s window is under 40 fps, drop to still frames for the session.

let fpsRaf = 0
let fpsFrames: number[] = []
let fpsStart = 0

function fpsMonitor(active: boolean) {
  if (!active || tier === 'still' || tier === 'none') {
    if (fpsRaf) cancelAnimationFrame(fpsRaf)
    fpsRaf = 0
    fpsFrames = []
    return
  }
  if (fpsRaf) return
  fpsStart = performance.now()
  fpsFrames = []
  const tick = (t: number) => {
    fpsRaf = requestAnimationFrame(tick)
    if (t - fpsStart < 1000) return
    fpsFrames.push(t)
    while (fpsFrames.length && t - fpsFrames[0]! > 2000) fpsFrames.shift()
    // Only judge a full window, without gaps (a gap means the tab was hidden).
    if (t - fpsStart < 3000) return
    const span = t - fpsFrames[0]!
    if (span < 1900) return
    const fps = ((fpsFrames.length - 1) / span) * 1000
    debug.fps = Math.round(fps)
    if (fps < 40) degradeToStill()
  }
  fpsRaf = requestAnimationFrame(tick)
}

function degradeToStill() {
  tier = 'still'
  debug.degraded = true
  try { sessionStorage.setItem(LOWFPS_KEY, '1') } catch { /* private mode */ }
  for (const e of entries) {
    if (e.handle && e.running) { e.handle.pause(); e.running = false }
  }
  fpsMonitor(false)
}

/** For checks: window.__c4Road shows the tier, measured fps and which roads run. */
const debug: {
  fps: number | null
  degraded: boolean
  tier: () => RoadTier
  running: () => RoadKind[]
  mounted: () => number
} = {
  fps: null,
  degraded: false,
  tier: () => getRoadTier(),
  running: () => [...entries].filter((e) => e.running).map((e) => e.kind),
  mounted: () => [...entries].filter((e) => e.handle).length,
}

// --- Public ------------------------------------------------------------------

export function useRoadController() {
  // A small read-only readout for checks (tier, fps, which roads run).
  if (import.meta.client) (window as unknown as { __c4Road: typeof debug }).__c4Road = debug

  return {
    tier: getRoadTier,
    mayAnimate: roadMayAnimate,
    load: loadRoadLib,

    register(entry: RoadEntry) {
      ensureObservers()
      wireScroll()
      entries.add(entry)
      visObserver!.observe(entry.el)
      nearObserver!.observe(entry.el)
    },

    /** The road has mounted; let the scheduler decide whether it runs. */
    attach(entry: RoadEntry, handle: RoadHandle) {
      entry.handle = handle
      fpsMonitor(false) // set-up stutter is not a slow device
      handle.setSpeed(entry.baseSpeed)
      handle.pause()
      entry.running = false
      schedule()
    },

    unregister(entry: RoadEntry) {
      visObserver?.unobserve(entry.el)
      nearObserver?.unobserve(entry.el)
      entries.delete(entry)
      schedule()
    },

    /** A 400 ms burst of speed on whichever road is moving (form sent, page change). */
    burst(ms = 400) {
      for (const e of entries) {
        if (e.handle && e.running) {
          e.handle.speedUp(true)
          setTimeout(() => e.handle?.speedUp(false), ms)
        }
      }
    },
  }
}
