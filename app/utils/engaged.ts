/**
 * Phase 8 (speed). The heavy parts (the 3D road and the scroll-motion
 * libraries) start once the visitor first engages with the page: moves the
 * mouse, touches, scrolls, uses the wheel or presses a key. If nobody does,
 * they start after a few still seconds anyway.
 *
 * Until then the phone only has to show the page: the text, layout and the
 * header entrances (pure CSS) are all there from the first paint. Starting
 * the road and the motion libraries during loading was what made a
 * mid-range phone unresponsive for several seconds.
 */
let engaged: Promise<void> | null = null

const EVENTS = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'keydown', 'scroll'] as const

export function whenEngaged(stillMs = 7000): Promise<void> {
  if (import.meta.server) return Promise.resolve()
  engaged ??= new Promise((resolve) => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const go = () => {
      for (const e of EVENTS) window.removeEventListener(e, go, true)
      clearTimeout(timer)
      resolve()
    }
    for (const e of EVENTS) window.addEventListener(e, go, { capture: true, passive: true })
    const startTimer = () => { timer = setTimeout(go, stillMs) }
    if (document.readyState === 'complete') startTimer()
    else window.addEventListener('load', startTimer, { once: true })
  })
  return engaged
}
