/**
 * Specular shine — the signature interaction.
 *
 * A soft highlight tracks the pointer across any glass surface, the way light
 * moves across a real pane as you turn it. The look lives entirely in CSS
 * (see `.shine` in components.css); this file does one job, which is to tell
 * CSS where the pointer is, as `--mx` / `--my` on the hovered element.
 *
 * Design notes, since the obvious implementations are all worse:
 *
 *  - ONE delegated listener on the document, not a directive per element.
 *    Every card, button and panel on the site is a shine surface; registering
 *    a listener on each would mean hundreds of them, and a directive would
 *    need mount/unmount bookkeeping on every page transition. Delegation has
 *    neither problem and costs one `closest()` per frame.
 *
 *  - Writes are batched into a single rAF. `pointermove` fires far more often
 *    than the screen refreshes, and each write invalidates paint on the
 *    element's pseudo-element. Coalescing to one write per frame is the
 *    difference between a smooth sweep and a busy main thread.
 *
 *  - Only custom properties are written — never a style that could trigger
 *    layout. The pseudo-element repaints; nothing reflows.
 *
 *  - Nothing runs on touch. `(hover: none)` already hides the highlight in
 *    CSS, so tracking a pointer there would be pure cost for no pixels. The
 *    check is a media query rather than a touch-capability sniff, because
 *    hybrid laptops have both and should get the effect from the mouse.
 *
 * Like reveal.ts, this is deliberately NOT a `.client` plugin — a client-only
 * plugin is fine here, but keeping both reveal and shine registered on both
 * sides means the server half is a no-op and there is one less asymmetry to
 * reason about when something renders differently in SSR.
 */

/** Everything that reacts to pointer position. Kept in one place so the CSS
 *  and the JS cannot drift apart. */
const SHINE_SELECTOR = '.shine, .card--interactive, .card--link, .btn'

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // No pointer, no point. Also covers the reduced-motion case, where the
  // highlight is still shown but does not need to animate toward the cursor.
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  let frame = 0
  let pending: { el: HTMLElement; x: number; y: number; w: number; h: number } | null = null

  const flush = () => {
    frame = 0
    if (!pending) return
    const { el, x, y, w, h } = pending
    pending = null

    // --mx / --my: the hot core, in element pixels.
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)

    // --px: where the angled reflection band sits, as a percentage of width.
    // The band is drawn with calc() offsets around this, so a percentage is
    // the only unit that keeps its shoulders proportional at any card size.
    el.style.setProperty('--px', `${(x / w) * 100}%`)

    // --pa: which edge the rim lights up, as a CSS gradient angle.
    //
    // A CSS gradient angle points TOWARD its 100% end, so to put the bright
    // 0% stop on the side nearest the pointer the line has to point away from
    // it — hence the +180. Without this the lit edge stays pinned to one
    // corner no matter where the pointer is, which is what gives a static
    // gradient away as fake.
    const dx = x - w / 2
    const dy = y - h / 2
    const deg = (Math.atan2(dx, -dy) * 180) / Math.PI + 180
    el.style.setProperty('--pa', `${deg.toFixed(1)}deg`)
  }

  const onPointerMove = (event: PointerEvent) => {
    // Synthetic pointer events from a touch still reach here on hybrids;
    // they should not drive the highlight.
    if (event.pointerType === 'touch') return

    const target = event.target as Element | null
    const el = target?.closest?.(SHINE_SELECTOR) as HTMLElement | null
    if (!el) return

    // Position relative to the element, which is the coordinate space the
    // radial-gradient in CSS is resolved against.
    const rect = el.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    pending = {
      el,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      w: rect.width,
      h: rect.height,
    }

    if (!frame) frame = requestAnimationFrame(flush)
  }

  document.addEventListener('pointermove', onPointerMove, { passive: true })
})
