/**
 * The motion system, in the browser (Phase 6; Motion board).
 *
 * After the page is up (never before the headline), loads GSAP,
 * ScrollTrigger and Lenis in their own small chunk and connects them:
 *   - Lenis is driven by gsap.ticker (one clock for both, so they never
 *     drift), with GSAP's lag smoothing off
 *   - every Lenis scroll updates ScrollTrigger, so scroll-linked moments
 *     follow the smoothed position
 *   - ScrollTrigger measures again after fonts load, after images and late
 *     content change the page height, and after every page change
 *
 * Also here:
 *   - page transitions: the 400 ms road burst as the next page fades in
 *     (Choreography 24); the new page starts at the top
 *   - section seams: where one section's ground (white, paper, mist) meets a
 *     different one, a soft blend replaces the hard edge. Set once per page;
 *     nothing runs while scrolling.
 *   - the mobile menu pauses smooth scrolling while it is open
 *
 * Reduced motion: none of this loads. The page scrolls natively and every
 * section is already in its finished state.
 */
import { motionAllowed, provideMotionLibs, getMotionLibs } from '~/composables/useMotion'
import { useMenuOpen } from '~/composables/useScrollState'
import { sheetStack } from '~/utils/sheetStack'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const roads = useRoadController()
  const menuOpen = useMenuOpen()

  // Tells the head script's safety timer that entrances will be played.
  ;(window as unknown as { __c4m: boolean }).__c4m = true

  // --- Page changes ---------------------------------------------------------
  router.beforeEach((to, from) => {
    if (to.path !== from.path) roads.burst()
  })
  // After every page change (links, Back, Forward), with or without motion:
  // every road on the new page is checked again from scratch.
  nuxtApp.hook('page:finish', () => {
    requestAnimationFrame(() => requestAnimationFrame(() => roads.recheck()))
  })

  if (!motionAllowed()) return

  // After the page has fully hydrated (layout and page included), so nothing
  // is touched while Vue is still taking over the server's HTML.
  let started = false
  nuxtApp.hook('app:suspense:resolve', () => {
    if (started) return
    started = true
    const go = () => { void boot() }
    const ric = (window as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback
    if (ric) ric(go, { timeout: 1200 })
    else setTimeout(go, 200)
  })

  async function boot() {
    const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('lenis'),
    ])
    gsap.registerPlugin(ScrollTrigger)
    // Measure on resize only when the width changes (a phone's address bar
    // showing and hiding changes the height, and must not re-measure).
    ScrollTrigger.config({ ignoreMobileResize: true })

    // Touch keeps the phone's own scrolling (syncTouch off): nothing to
    // relearn, and swipers and the page never fight.
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, autoRaf: false, anchors: { offset: -112 } })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
    document.documentElement.classList.add('c4-lenis')

    watch(menuOpen, (open) => (open ? lenis.stop() : lenis.start()))

    provideMotionLibs({ gsap, ScrollTrigger, lenis })
    seams()
    inner = innerTransitions(gsap, ScrollTrigger)
    watchHeight(ScrollTrigger, lenis)
  }

  let inner: (() => void) | null = null

  // The new page: start at the top (or at its #anchor), add its seams and
  // measure again.
  nuxtApp.hook('page:finish', () => {
    const l = getMotionLibs()
    // Before boot (the first page) there is nothing to do: boot() does it.
    if (!l) return
    const hash = router.currentRoute.value.hash
    if (hash) l.lenis?.scrollTo(hash, { offset: -112, immediate: true })
    else l.lenis?.scrollTo(0, { immediate: true, force: true })
    requestAnimationFrame(() => {
      seams()
      inner?.()
      inner = innerTransitions(l.gsap, l.ScrollTrigger)
      l.ScrollTrigger.refresh()
    })
  })
})

// --- Measuring again ------------------------------------------------------------
// Fonts arriving, lazy images loading and content expanding all move things
// down the page. ScrollTrigger must measure again when that happens, or pins
// and scroll-linked moments fire in the wrong place. One debounced refresh
// whenever the page's height really changes.
function watchHeight(
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger,
  lenis: { resize: () => void },
) {
  let last = document.documentElement.scrollHeight
  let timer: ReturnType<typeof setTimeout> | undefined
  const refresh = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      lenis.resize()
      ScrollTrigger.refresh()
      last = document.documentElement.scrollHeight
    }, 200)
  }
  document.fonts?.ready.then(refresh)
  if (document.readyState !== 'complete') window.addEventListener('load', refresh, { once: true })
  const main = document.getElementById('main')
  if (!main) return
  new ResizeObserver(() => {
    // Pins add their own spacing when ScrollTrigger measures; only a real
    // change in content height asks for another measure.
    const h = document.documentElement.scrollHeight
    if (Math.abs(h - last) > 2) refresh()
  }).observe(main)
}

// --- Section seams ----------------------------------------------------------------
// Where a section's ground differs from the one above it, it gets
// data-seam="<the colour above>"; motion.css then blends that colour into its
// own over its first 96 px (inside its padding, so it never touches words).
// Static: set once per page, costs nothing while scrolling. A data
// attribute, not a class, because Vue owns the class list.

const GROUNDS: Record<string, 'white' | 'paper' | 'mist'> = {
  'rgb(255, 255, 255)': 'white',
  'rgb(245, 247, 252)': 'paper',
  'rgb(238, 241, 248)': 'mist',
}

function seams() {
  let page = document.querySelector('#main > div')
  if (!page) return
  // Pages built from one template component (case studies, legal pages)
  // wrap their sections in one more element: look inside it.
  while (page.children.length === 1 && page.firstElementChild?.tagName === 'DIV') page = page.firstElementChild
  let above: string | null = null
  for (const el of page.children) {
    if (!(el instanceof HTMLElement)) continue
    const own = GROUNDS[getComputedStyle(el).backgroundColor]
    if (!own) continue // a road strip or other see-through block
    if (above && above !== own) el.dataset.seam = above
    above = own
  }
}

// --- Inner pages: section transitions (owner, 20 Nov 2026) -----------------------
// The home page sets its own, section by section. On every other page:
//   - the first section after the page header is a sheet that slides up
//     over the header (sheet stack)
//   - paper and mist sections draw their texture in as they enter, by turns
//     the grid drawing in from the left edge, and a colour wash
// Returns a function that undoes it all (called on the next page change).
function innerTransitions(
  gsap: typeof import('gsap').gsap,
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger,
): () => void {
  let page = document.querySelector('#main > div')
  if (!page) return () => {}
  while (page.children.length === 1 && page.firstElementChild?.tagName === 'DIV') page = page.firstElementChild
  const blocks = [...page.children].filter((el): el is HTMLElement => el instanceof HTMLElement)
  if (!blocks[0]?.classList.contains('ph')) return () => {}
  const undo: (() => void)[] = []

  // Its shape (rounded top, shadow) is in the CSS from the first paint
  // (.ph + section, motion.css); this only adds the movement.
  const sheet = blocks[1]
  if (sheet && sheet.tagName === 'SECTION') undo.push(sheetStack(gsap, ScrollTrigger, sheet))

  let turn = 0
  const io = new IntersectionObserver((list) => {
    for (const e of list) {
      if (!e.isIntersecting) continue
      ;(e.target as HTMLElement).setAttribute('data-bp-in', '')
      io.unobserve(e.target)
    }
  }, { rootMargin: '0px 0px -8% 0px' })
  for (const el of blocks.slice(1)) {
    if (!el.matches('.c4-section--paper:not(.bp-host), .c4-section--mist:not(.bp-host)')) continue
    el.setAttribute('data-bp-enter', turn++ % 2 ? 'wash' : 'grid')
    io.observe(el)
  }
  undo.push(() => io.disconnect())
  return () => { for (const u of undo) u() }
}
