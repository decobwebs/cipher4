/**
 * Choreography 04, "one stack deals out six": measures how far each card
 * (.m-card) in a grid sits from the grid's centre and stores it as --dx and
 * --dy, with a slight turn (--r), so the cards can start stacked in the
 * middle and deal out to their places (motion.css, data-m="deal").
 * Measured again on resize until the deal has played.
 */
import type { Ref } from 'vue'

export function useDeal(list: Ref<HTMLElement | null>) {
  if (!import.meta.client) return
  let ro: ResizeObserver | null = null

  function measure() {
    const el = list.value
    if (!el) return
    if (el.closest('.m-in')) { ro?.disconnect(); return }
    const box = el.getBoundingClientRect()
    const cx = box.left + box.width / 2
    const cy = box.top + Math.min(box.height, 420) / 2
    const cards = el.querySelectorAll<HTMLElement>('.m-card')
    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect()
      c.style.setProperty('--dx', `${Math.round(cx - (r.left + r.width / 2))}px`)
      c.style.setProperty('--dy', `${Math.round(cy - (r.top + r.height / 2))}px`)
      c.style.setProperty('--r', `${(i % 2 ? 1 : -1) * (1.5 + i * 0.6)}deg`)
      // The first card ends up on top of the stack.
      c.style.zIndex = String(cards.length - i)
    })
  }

  onMounted(() => {
    measure()
    ro = new ResizeObserver(() => measure())
    if (list.value) ro.observe(list.value)
  })
  onBeforeUnmount(() => ro?.disconnect())
}
