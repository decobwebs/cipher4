/**
 * The motion system, in the browser (Phase 6; Motion board).
 *
 * After the page is up (never before the headline), loads GSAP,
 * ScrollTrigger and Lenis in their own small chunk and connects them:
 * Lenis smooths the wheel, and every Lenis scroll updates ScrollTrigger, so
 * scroll-linked moments follow the smoothed position. One clock drives both
 * (gsap.ticker), so they never drift.
 *
 * Also here:
 *   - page transitions: the 400 ms road burst as the next page fades in
 *     (Choreography 24); the new page starts at the top
 *   - the section tone: the page's background eases between white, paper
 *     and mist as sections arrive, so no section change is a hard cut
 *   - the mobile menu pauses smooth scrolling while it is open
 *
 * Reduced motion: none of this loads. The page scrolls natively and every
 * section is already in its finished state.
 */
import { motionAllowed, provideMotionLibs, getMotionLibs } from '~/composables/useMotion'
import { useMenuOpen } from '~/composables/useScrollState'

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

  if (!motionAllowed()) return

  let tone: ReturnType<typeof setupTone> | null = null

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

    // Touch keeps the phone's own scrolling (syncTouch off): nothing to
    // relearn, and swipers and the page never fight.
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, autoRaf: false, anchors: { offset: -112 } })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
    document.documentElement.classList.add('c4-lenis')

    watch(menuOpen, (open) => (open ? lenis.stop() : lenis.start()))

    provideMotionLibs({ gsap, ScrollTrigger, lenis })
    tone = setupTone(gsap, ScrollTrigger)
    tone.scan()
  }

  // The new page: start at the top (or at its #anchor), measure again, and
  // set up its section tones.
  nuxtApp.hook('page:finish', () => {
    const l = getMotionLibs()
    // Before boot (the first page) there is nothing to do: boot() scans it.
    if (!l) return
    const hash = router.currentRoute.value.hash
    if (hash) l.lenis?.scrollTo(hash, { offset: -112, immediate: true })
    else l.lenis?.scrollTo(0, { immediate: true, force: true })
    requestAnimationFrame(() => {
      tone?.scan()
      l.ScrollTrigger.refresh()
    })
  })
})

// --- Section tone -------------------------------------------------------------
// Each top-level section on a page has a ground: white, paper or mist. With
// motion on, those grounds are lifted onto one fixed layer behind the page,
// which cross-fades (opacity only) to the ground of whichever section holds
// the middle of the screen. A section change becomes a 600 ms ease instead
// of a hard edge. The section's own colour stays in the CSS, so without
// JavaScript or with reduced motion nothing changes.

const TONES: Record<string, 'white' | 'paper' | 'mist'> = {
  'rgb(255, 255, 255)': 'white',
  'rgb(245, 247, 252)': 'paper',
  'rgb(238, 241, 248)': 'mist',
}

function setupTone(gsap: typeof import('gsap').gsap, ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger) {
  let layer = document.querySelector<HTMLElement>('.c4-tone')
  let triggers: { kill: () => void }[] = []
  let current = 'white'

  function set(name: string) {
    if (!layer || name === current) return
    current = name
    for (const el of layer.children) {
      gsap.to(el, { opacity: (el as HTMLElement).dataset.tone === name ? 1 : 0, duration: 0.6, ease: 'power2.out', overwrite: true })
    }
  }

  function scan() {
    layer = document.querySelector<HTMLElement>('.c4-tone')
    for (const t of triggers) t.kill()
    triggers = []
    if (!layer) return
    let page = document.querySelector('#main > div')
    if (!page) return
    // Pages built from one template component (case studies, legal pages)
    // wrap their sections in one more element: look inside it.
    while (page.children.length === 1 && page.firstElementChild?.tagName === 'DIV') page = page.firstElementChild
    document.documentElement.classList.add('c4-tone-on')
    // The page's top-level blocks, in order (sections and road strips).
    const blocks = [...page.children].filter((el): el is HTMLElement => el instanceof HTMLElement)
    for (const el of blocks) {
      const own = el.dataset.toneOf ?? TONES[getComputedStyle(el).backgroundColor]
      if (!own) continue
      // A data attribute, not a class: Vue owns the class list.
      el.dataset.toneOf = own
      triggers.push(ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => { if (self.isActive) set(own) },
      }))
    }
    // Land on the right tone straight away (no fade on arrival).
    current = ''
    const first = blocks.find((el) => {
      const r = el.getBoundingClientRect()
      return el.dataset.toneOf && r.top <= innerHeight * 0.55 && r.bottom > innerHeight * 0.55
    })
    const name = first?.dataset.toneOf ?? 'white'
    for (const el of layer.children) gsap.set(el, { opacity: (el as HTMLElement).dataset.tone === name ? 1 : 0 })
    current = name
  }

  return { scan }
}
