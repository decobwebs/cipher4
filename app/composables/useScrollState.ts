/**
 * Shared scroll position and direction, for the header and the action dock.
 * One passive listener, throttled to animation frames, for the whole app.
 *
 * `direction` only changes after 8 px of travel in the new direction, so a
 * trembling thumb doesn't make the bars flicker.
 */
const y = ref(0)
const direction = ref<'up' | 'down'>('up')
let users = 0
let lastY = 0
let ticking = false

function read() {
  ticking = false
  const now = window.scrollY
  const delta = now - lastY
  if (Math.abs(delta) >= 8) {
    direction.value = delta > 0 ? 'down' : 'up'
    lastY = now
  }
  y.value = now
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(read)
}

export function useScrollState() {
  onMounted(() => {
    if (users++ === 0) {
      lastY = window.scrollY
      y.value = lastY
      window.addEventListener('scroll', onScroll, { passive: true })
    }
  })
  onBeforeUnmount(() => {
    if (--users === 0) window.removeEventListener('scroll', onScroll)
  })
  return { y: readonly(y), direction: readonly(direction) }
}

/** Open state of the phone menu, shared by the header, menu and dock. */
export const useMenuOpen = () => useState('c4-menu-open', () => false)
