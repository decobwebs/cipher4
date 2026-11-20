/**
 * Phase 8 (speed). The heavy parts (the 3D road and the scroll-motion
 * libraries) start once the visitor first engages with the page (moves the
 * mouse, touches, scrolls, uses the wheel or presses a key) or, if nobody
 * does, a set time after the page has fully loaded and the browser is idle,
 * whichever comes first.
 *
 *   road            whenEngaged(2000): many people look at the first screen
 *                   of a phone without touching it (owner, 20 Nov 2026)
 *   motion library  whenEngaged(7000): nothing it does shows before a scroll
 *
 * The headline never waits for either: the text, layout and the header
 * entrances (pure CSS) are all there from the first paint.
 */
const EVENTS = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'keydown', 'scroll'] as const

type Ric = (cb: () => void, o?: { timeout: number }) => void

let interaction: Promise<void> | null = null
let loaded: Promise<void> | null = null

/** The visitor's first move, touch, scroll, wheel or key. */
function firstInteraction(): Promise<void> {
  interaction ??= new Promise((resolve) => {
    const go = () => {
      for (const e of EVENTS) window.removeEventListener(e, go, true)
      resolve()
    }
    for (const e of EVENTS) window.addEventListener(e, go, { capture: true, passive: true })
  })
  return interaction
}

/** The page's load event (already passed, or still to come). */
function pageLoaded(): Promise<void> {
  loaded ??= new Promise((resolve) => {
    if (document.readyState === 'complete') resolve()
    else window.addEventListener('load', () => resolve(), { once: true })
  })
  return loaded
}

/** `ms` after the page has fully loaded, then the browser's next idle moment. */
function afterLoadAndIdle(ms: number): Promise<void> {
  return pageLoaded().then(() => new Promise<void>((resolve) => {
    setTimeout(() => {
      const ric = (window as { requestIdleCallback?: Ric }).requestIdleCallback
      if (ric) ric(() => resolve(), { timeout: 1000 })
      else resolve()
    }, ms)
  }))
}

export function whenEngaged(stillMs = 7000): Promise<void> {
  if (import.meta.server) return Promise.resolve()
  return Promise.race([firstInteraction(), afterLoadAndIdle(stillMs)])
}
