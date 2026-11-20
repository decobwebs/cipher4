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
 *              frame rate under 40 fps (see the frame-rate check below)
 *      none    no WebGL: still images only
 *  - The road code loads only after the page has loaded and the browser is
 *    idle, so it never delays the headline.
 *
 * Still frames are images exported from the real road (public/images/road),
 * so a device on the still tier never downloads the 3D code at all.
 *
 * Test switch: ?motion=on forces the roads to animate, on /_roads and
 * /_styleguide pages only (see motionForced).
 */
import type { RoadHandle } from '~/lib/hyperspeed/index'
import { getMotionLibs } from '~/composables/useMotion'
import type { RoadKind } from '~/lib/hyperspeed/roads'

export type RoadTier = 'full' | 'mobile' | 'still' | 'none'
export type StillReason = 'reduced-motion' | 'save-data' | 'low-cores' | 'frame-rate' | 'no-webgl'

export interface RoadEntry {
  el: HTMLElement
  kind: RoadKind
  /** Called when the road should start loading (it is near the screen). */
  onNear: () => void
  handle: RoadHandle | null
  baseSpeed: number
  ratio: number
  running: boolean
  /** Spine roads: road speed for a scroll speed in px/s (signed). */
  scrollSpeed?: (pxPerSecond: number) => number
}

// v2: the first version judged during start-up, so its notes are ignored.
const LOWFPS_KEY = 'c4-road-lowfps-v2'
const MOTION_KEY = 'c4-motion-on'
const PRIORITY: Record<RoadKind, number> = { hero: 5, header: 4, closing: 3, deliver: 2, spine: 2, strip: 1 }

// Frame-rate check settings.
const FPS_MIN = 40
const FPS_WINDOW = 2000 // judge the last 2 s of frames
const WARM_UP = 3000 // never judge in the first 3 s after a road starts or the page loads
const RETRY_AFTER = 10000 // after a first failure, try again once after 10 s
const GAP = 250 // a frame gap longer than this means the road was not really on view

/** Live state, for the demos and the style guide. */
export const roadState = reactive({
  tier: 'none' as RoadTier,
  reason: null as StillReason | null,
  cores: 0,
  fps: null as number | null,
  /** Frame-rate failures this page (0, 1 or 2). */
  failures: 0,
  retrying: false,
  forced: false,
})

let base: { tier: 'full' | 'mobile' | 'none'; reason: StillReason | null } | null = null
let fpsStill = false
const entries = new Set<RoadEntry>()
let visObserver: IntersectionObserver | null = null
let nearObserver: IntersectionObserver | null = null
let libPromise: Promise<typeof import('~/lib/hyperspeed/index')> | null = null
let lastScrollAt = 0
let lastScrollY = 0
let scrollVelocity = 0 // px per second
let scrollSigned = 0 // px per second, + down, - up
let scheduleQueued = false
let scrollWired = false
let lastBest: RoadEntry | null = null
let retryTimer: ReturnType<typeof setTimeout> | undefined
let settleTimer: ReturnType<typeof setTimeout> | undefined
let burstUntil = 0
const BURST_MS = 400

function pulse(handle: RoadHandle, ms: number) {
  handle.speedUp(true)
  setTimeout(() => handle.speedUp(false), ms)
}

// --- Test switch: ?motion=on -------------------------------------------------

/**
 * The address as it was before the app started. During start-up the router
 * briefly drops the query string, so reading location.search later can miss
 * it; an inline script in <head> (nuxt.config) keeps a copy.
 */
function initialSearch(): string {
  return (window as unknown as { __c4Search?: string }).__c4Search ?? location.search
}

/** ?motion=on forces animation, on /_roads and /_styleguide pages only. */
export function motionForced(): boolean {
  if (!import.meta.client) return false
  const internal = /^\/(_roads|_styleguide)(\/|$)/.test(location.pathname)
  if (!internal) return false
  const q = new URLSearchParams(initialSearch()).get('motion')
  try {
    if (q === 'on') sessionStorage.setItem(MOTION_KEY, '1')
    if (q === 'off') sessionStorage.removeItem(MOTION_KEY)
    return sessionStorage.getItem(MOTION_KEY) === '1'
  } catch {
    return q === 'on'
  }
}

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

/** What the device is, and why it would get still frames (worked out once). */
function deviceBase() {
  if (base) return base
  const cores = navigator.hardwareConcurrency || 8
  roadState.cores = cores
  const conn = (navigator as { connection?: { saveData?: boolean } }).connection
  let reason: StillReason | null = null
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) reason = 'reduced-motion'
  else if (conn?.saveData) reason = 'save-data'
  else if (cores <= 4) reason = 'low-cores'
  else if (readLowFps()) { reason = 'frame-rate'; roadState.failures = 2 }
  const tier = !hasWebGL()
    ? 'none'
    : window.matchMedia('(max-width: 1024px), (pointer: coarse)').matches ? 'mobile' : 'full'
  if (tier === 'none') reason = 'no-webgl'
  base = { tier, reason }
  return base
}

export function getRoadTier(): RoadTier {
  if (!import.meta.client) return 'none'
  const b = deviceBase()
  const forced = motionForced()
  let t: RoadTier
  let reason: StillReason | null
  if (b.tier === 'none') { t = 'none'; reason = 'no-webgl' }
  else if (forced) { t = b.tier; reason = null }
  else if (b.reason) { t = 'still'; reason = b.reason }
  else if (fpsStill) { t = 'still'; reason = 'frame-rate' }
  else { t = b.tier; reason = null }
  roadState.tier = t
  roadState.reason = reason
  roadState.forced = forced
  return t
}

/** May this kind of road animate on this device right now? */
export function roadMayAnimate(kind: RoadKind): boolean {
  const t = getRoadTier()
  if (t === 'full') return true
  if (t === 'mobile') return kind === 'hero' || kind === 'header' || kind === 'closing'
  return false
}

/** One plain sentence about what this device shows, and why. */
export function describeRoadState(): string {
  const s = roadState
  const cores = s.cores
  if (s.tier === 'none') return 'Still image: this browser cannot draw WebGL.'
  if (s.forced) return `Moving road, forced on by the ?motion=on test switch (${s.tier === 'mobile' ? 'phone or tablet' : 'desktop'}).`
  if (s.tier === 'full') return `Moving road (desktop)${s.fps ? `, ${s.fps} fps` : ''}.`
  if (s.tier === 'mobile') return 'Moving road (phone or tablet: header and closing roads only).'
  switch (s.reason) {
    case 'reduced-motion': return 'Still image: this device asks for reduced motion (on Windows: Settings, Accessibility, Visual effects, Animation effects).'
    case 'save-data': return 'Still image: the browser has Data Saver (Save-Data) turned on.'
    case 'low-cores': return `Still image: this device reports ${cores} processor cores, and the rule is 4 or fewer.`
    case 'frame-rate':
      if (s.retrying) return `Still image for now: the road measured ${s.fps} fps (under ${FPS_MIN}). Trying again in 10 seconds.`
      return `Still image: the road measured ${s.fps ?? 'under ' + FPS_MIN} fps twice (under ${FPS_MIN}). It stays still for the rest of this visit.`
    default: return 'Still image.'
  }
}

// --- Loading ---------------------------------------------------------------

/** The road module, loaded once: on the visitor's first move, touch,
 *  scroll or key, or about 2 s after the page has fully loaded and the
 *  browser is idle, whichever comes first (utils/engaged.ts, Phase 8). */
export function loadRoadLib() {
  libPromise ??= whenEngaged(2000).then(() => import('~/lib/hyperspeed/index'))
  return libPromise
}

// --- Visibility and scheduling ----------------------------------------------

function ensureObservers() {
  if (visObserver) return
  // Enough steps to pick the most visible road; each step costs work on
  // every scroll frame, so not more.
  const thresholds = [0, 0.1, 0.25, 0.5, 0.75, 1]
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

/**
 * The scroll position, without asking the page for it when Lenis is running
 * (Lenis keeps its own number). Reading window.scrollY straight after the
 * page has changed makes the browser finish style and layout on the spot,
 * which is what made scrolling stutter (owner's review, 19 Nov 2026).
 */
function scrollPos(): number {
  const lenis = getMotionLibs()?.lenis as { animatedScroll?: number } | null | undefined
  return typeof lenis?.animatedScroll === 'number' ? lenis.animatedScroll : window.scrollY
}

let lastFrameT = 0
/** Speed of the scroll since the last frame. Called once per frame, in run(). */
function measureScroll() {
  const now = performance.now()
  const y = scrollPos()
  const dyS = y - lastScrollY
  const dt = Math.max(16, now - lastFrameT)
  scrollVelocity = (Math.abs(dyS) / dt) * 1000
  scrollSigned = (dyS / dt) * 1000
  lastScrollY = y
  lastFrameT = now
}

function wireScroll() {
  if (scrollWired) return
  scrollWired = true
  lastScrollY = scrollPos()
  lastFrameT = performance.now()
  // The listener only notes that a scroll happened; the position is read
  // once per frame, in run().
  window.addEventListener('scroll', () => {
    lastScrollAt = performance.now()
    schedule()
    // Settle: one more pass after scrolling stops, to pause scroll-driven
    // roads. One timer, pushed back while scrolling continues.
    clearTimeout(settleTimer)
    settleTimer = setTimeout(schedule, 200)
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
  if (scrollWired) measureScroll()
  // The one road allowed to move: most visible, then by priority.
  let best: RoadEntry | null = null
  for (const e of entries) {
    if (!e.handle || e.ratio <= 0 || !roadMayAnimate(e.kind)) continue
    // Scroll-driven roads are only candidates while the page is scrolling.
    if ((e.kind === 'strip' || e.kind === 'deliver' || e.kind === 'spine') && !scrolling()) continue
    if (!best || e.ratio > best.ratio + 0.05 || (Math.abs(e.ratio - best.ratio) <= 0.05 && PRIORITY[e.kind] > PRIORITY[best.kind])) {
      best = e
    }
  }
  if (document.hidden) best = null
  // A different road taking over (or a new one being set up) stutters for a
  // moment while its shaders compile: the frame-rate check starts afresh,
  // with its full warm-up.
  if (best !== lastBest) {
    // A different road taking over stutters for a moment while it starts:
    // skip a short settle, but keep counting (owner's review, 19 Nov 2026:
    // restarting the full warm-up at every handover meant the check never
    // judged on the home page, which hands over between five roads).
    lastBest = best
    settleFps()
  }

  for (const e of entries) {
    if (!e.handle) continue
    const go = e === best
    if (go && (e.kind === 'strip' || e.kind === 'deliver')) {
      // Faster scrolling, faster road: 0.4x to 2.5x.
      e.handle.setSpeed(Math.min(2.5, Math.max(0.4, scrollVelocity / 900)))
    }
    if (go && e.kind === 'spine') {
      // The trails move with the page: down while scrolling down, up while
      // scrolling up, at the scroll's own speed.
      e.handle.setVelocity(e.scrollSpeed ? e.scrollSpeed(scrollSigned) : scrollSigned / 900)
    }
    if (go && !e.running) { e.handle.resume(); e.running = true }
    if (!go && e.running) { e.handle.pause(); e.running = false }
  }
  fpsMonitor(!!best)
}

// --- Frame-rate check ----------------------------------------------------------
// Counts frames only while a road is moving on screen in a visible tab
// (the monitor runs only while the scheduler has a road running, and any
// gap of more than 250 ms between frames, such as a hidden tab or a
// minimised window, restarts the count).
//
// Never judges during the first 3 s after the first road starts, nor until
// 3 s after the page finished loading. When another road takes over, or a
// new one sets up, the next 600 ms are skipped (start-up stutter) and the
// count carries on. Judges the last 2 s of frames: under 40 fps is
// a failure. A first failure shows the still frame and tries again after
// 10 s. Only a second failure keeps the still frames, for the rest of the
// visit. The ?motion=on test switch turns the check off.

let fpsRaf = 0
let fpsFrames: number[] = []
let fpsReadyAt = 0
const SWITCH_SETTLE = 600 // ms skipped after a road takes over or sets up
let fpsWarmed = false

/** Skip the next 600 ms of frames (a road starting up), keep the rest. */
function settleFps() {
  fpsReadyAt = Math.max(fpsReadyAt, performance.now() + SWITCH_SETTLE)
  fpsFrames = []
}

function pageLoadedAt(): number | null {
  if (document.readyState !== 'complete') return null
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  return nav && nav.loadEventEnd > 0 ? nav.loadEventEnd : 0
}

function fpsMonitor(active: boolean) {
  const off = !active || fpsStill || motionForced() || getRoadTier() === 'still' || getRoadTier() === 'none'
  if (off) {
    if (fpsRaf) cancelAnimationFrame(fpsRaf)
    fpsRaf = 0
    fpsFrames = []
    return
  }
  if (fpsRaf) return
  fpsFrames = []
  // The full warm-up once per visit; later restarts only settle briefly.
  fpsReadyAt = Math.max(fpsReadyAt, performance.now() + (fpsWarmed ? SWITCH_SETTLE : WARM_UP))
  fpsWarmed = true
  let last = 0
  const tick = (t: number) => {
    fpsRaf = requestAnimationFrame(tick)
    // A long gap: the road was not really on view. Start the count again.
    if (last && t - last > GAP) fpsFrames = []
    last = t
    const loaded = pageLoadedAt()
    if (loaded === null || t < loaded + WARM_UP || t < fpsReadyAt) return
    fpsFrames.push(t)
    while (fpsFrames.length && t - fpsFrames[0]! > FPS_WINDOW) fpsFrames.shift()
    const span = t - fpsFrames[0]!
    if (span < FPS_WINDOW - 100) return // only judge a full window
    const fps = ((fpsFrames.length - 1) / span) * 1000
    roadState.fps = Math.round(fps)
    if (fps < FPS_MIN) frameRateFailed()
  }
  fpsRaf = requestAnimationFrame(tick)
}

function frameRateFailed() {
  roadState.failures++
  fpsStill = true
  fpsMonitor(false)
  if (roadState.failures === 1) {
    // First failure: still frame now, one more try after 10 s.
    roadState.retrying = true
    clearTimeout(retryTimer)
    retryTimer = setTimeout(() => {
      roadState.retrying = false
      fpsStill = false
      lastBest = null // the next run counts as a fresh start, with warm-up
      schedule()
    }, RETRY_AFTER)
  } else {
    // Second failure: still frames for the rest of the visit.
    roadState.retrying = false
    try { sessionStorage.setItem(LOWFPS_KEY, '1') } catch { /* private mode */ }
  }
  schedule()
}

/** For checks: window.__c4Road shows the tier, reason, fps and which roads run. */
const debug = {
  state: roadState,
  tier: () => getRoadTier(),
  reason: () => roadState.reason,
  get fps() { return roadState.fps },
  get degraded() { return fpsStill },
  running: () => [...entries].filter((e) => e.running).map((e) => e.kind),
  mounted: () => [...entries].filter((e) => e.handle).length,
}

// --- Public ------------------------------------------------------------------

export function useRoadController() {
  // A small read-only readout for checks (tier, reason, fps, which roads run).
  if (import.meta.client) (window as unknown as { __c4Road: typeof debug }).__c4Road = debug

  return {
    tier: getRoadTier,
    mayAnimate: roadMayAnimate,
    forced: motionForced,
    state: roadState,
    describe: describeRoadState,
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
      // Set-up stutter is not a slow device: a short settle, not a restart.
      settleFps()
      handle.setSpeed(entry.baseSpeed)
      handle.pause()
      entry.running = false
      // A road arriving during a page change starts with the burst too.
      if (performance.now() < burstUntil) pulse(handle, BURST_MS)
      schedule()
    },

    /**
     * After a page change (owner, 20 Nov 2026: "some roads only start after
     * a refresh"): look at every road again from scratch. Each one is
     * re-observed, so its visibility and nearness are measured afresh on the
     * new page, and a road that is near but not yet set up starts.
     */
    recheck() {
      if (!visObserver || !nearObserver) return
      for (const e of entries) {
        visObserver.unobserve(e.el)
        visObserver.observe(e.el)
        if (!e.handle) {
          nearObserver.unobserve(e.el)
          nearObserver.observe(e.el)
        }
      }
      lastBest = null
      schedule()
    },

    /**
     * Choreography 24, between pages: the road on screen stretches its light
     * trails for 400 ms while the next page fades in. A road that arrives on
     * the new page within the next second starts with the same burst.
     */
    burst() {
      burstUntil = performance.now() + 1000
      if (getRoadTier() === 'still' || getRoadTier() === 'none') return
      for (const e of entries) if (e.running && e.handle) pulse(e.handle, BURST_MS)
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
