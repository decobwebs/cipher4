/**
 * Sheet stack (owner, 20 Nov 2026, section transitions): the next section
 * slides up over the previous one like a sheet of drawing paper. The new
 * section has 32 px rounded top corners and a soft shadow (CSS,
 * [data-sheet] in motion.css, so there is never a straight edge even
 * without motion). On desktop the previous section holds at its bottom edge
 * while the new one slides over it, and scales to 0.97 and dims slightly as
 * it is covered. Scrolling back reverses it.
 *
 * Only transform and opacity move: the previous section's scale, and the
 * opacity of its dimming layer (.bpg-dim, from BlueprintGround, if it has one).
 * Returns a function that undoes everything.
 */
type Gsap = typeof import('gsap').gsap
type ST = typeof import('gsap/ScrollTrigger').ScrollTrigger

export function sheetStack(gsap: Gsap, ScrollTrigger: ST, sheet: HTMLElement): () => void {
  const prev = sheet.previousElementSibling as HTMLElement | null
  if (!prev || window.innerWidth < 768) return () => {}
  // A section that pins itself (How we deliver) is never held underneath.
  if (prev.querySelector('.pin-spacer') || prev.closest('.pin-spacer')) return () => {}

  const hold = ScrollTrigger.create({
    trigger: prev,
    // Hold once the section's bottom edge reaches the bottom of the screen:
    // all of it has been seen (its buttons included) before the next sheet
    // starts to cover it.
    start: 'bottom bottom',
    endTrigger: sheet,
    end: 'top top',
    pin: true,
    pinSpacing: false,
    invalidateOnRefresh: true,
  })
  const dim = prev.querySelector<HTMLElement>(':scope > .bpg-dim')
  const tl = gsap.timeline({
    scrollTrigger: { trigger: sheet, start: 'top bottom', end: 'top top', scrub: 0.3, invalidateOnRefresh: true },
  })
  tl.to(prev, { scale: 0.97, transformOrigin: '50% 100%', ease: 'none' }, 0)
  if (dim) tl.to(dim, { opacity: 0.08, ease: 'none' }, 0)
  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    hold.kill()
    gsap.set(prev, { clearProps: 'transform' })
    if (dim) gsap.set(dim, { clearProps: 'opacity' })
  }
}
