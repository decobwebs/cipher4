<script setup lang="ts">
/**
 * ScrollStack — cards that pin and pile as the page scrolls.
 *
 * Ported from the React Bits component, using lenis as the reference does.
 * The transform model is unchanged: for each card, a trigger range is derived
 * from its offset, progress through that range drives a scale toward
 * `baseScale + i * itemScale`, and while pinned the card is translated to hold
 * its position at the stack offset.
 *
 * A NOTE ON THE CARDS
 * -------------------
 * Cipher4 asked for no visible cards and no borders. Stacking, however, only
 * works because each card occludes the one behind it — with a transparent
 * surface the pinned blocks show through one another and the effect reads as a
 * rendering fault.
 *
 * The resolution is a card that is opaque but invisible: filled with the page
 * colour, with no border, radius or shadow. It occludes correctly and reads as
 * open space. That is set by the consumer via --stack-card-bg, so this
 * component stays neutral.
 *
 * WHAT CHANGED FROM THE REFERENCE
 * -------------------------------
 * 1. The lenis instance and the rAF loop are torn down on unmount, and the
 *    loop is not started at all under `prefers-reduced-motion` — the cards
 *    then simply flow, which is the correct reduced-motion behaviour for a
 *    scroll-driven pin.
 * 2. Transforms are only written when they have actually changed, which the
 *    reference does too, but the epsilon is applied before the write rather
 *    than after, so a static page performs no style writes at all.
 */

interface Props {
  itemDistance?: number
  itemScale?: number
  itemStackDistance?: number
  stackPosition?: string
  scaleEndPosition?: string
  baseScale?: number
  rotationAmount?: number
  blurAmount?: number
}

const props = withDefaults(defineProps<Props>(), {
  itemDistance: 120,
  itemScale: 0.03,
  itemStackDistance: 26,
  stackPosition: '18%',
  scaleEndPosition: '8%',
  baseScale: 0.88,
  rotationAmount: 0,
  blurAmount: 0,
})

const root = ref<HTMLElement | null>(null)
let cards: HTMLElement[] = []
let lenis: { destroy: () => void; raf: (t: number) => void; on: (e: string, cb: () => void) => void } | null = null
let raf = 0
let resizeObserver: ResizeObserver | null = null
const lastTransforms = new Map<number, { y: number; s: number; r: number; b: number; o: number }>()

const pct = (value: string, containerHeight: number) =>
  value.includes('%') ? (parseFloat(value) / 100) * containerHeight : parseFloat(value)

const progress = (scrollTop: number, start: number, end: number) => {
  if (scrollTop < start) return 0
  if (scrollTop > end) return 1
  return (scrollTop - start) / (end - start)
}

/**
 * Document offsets, measured ONCE from layout.
 *
 * This must not use getBoundingClientRect(): the rect reflects the transform
 * already applied to the card, so reading it back each frame feeds the card's
 * own displacement into the next frame's pin calculation. The cards then
 * half-move instead of pinning — which is exactly how this first presented,
 * with the stack visibly scrolling past instead of holding.
 *
 * offsetTop walks the offsetParent chain and is a layout value, unaffected by
 * transforms, so it stays stable while the card is being moved.
 */
let cardTops: number[] = []
let endTopCached = 0

function layoutTop(el: HTMLElement) {
  let y = 0
  let node: HTMLElement | null = el
  while (node) {
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return y
}

function measure() {
  cardTops = cards.map((c) => layoutTop(c))
  const endEl = root.value?.querySelector('.stack__end') as HTMLElement | null
  endTopCached = endEl ? layoutTop(endEl) : 0
}

function update() {
  if (!cards.length) return

  const scrollTop = window.scrollY
  const containerHeight = window.innerHeight
  const stackPx = pct(props.stackPosition, containerHeight)
  const scaleEndPx = pct(props.scaleEndPosition, containerHeight)
  const endTop = endTopCached
  const pinEnd = endTop - containerHeight / 2

  // PASS 1 — geometry.
  //
  // translateY and scale are resolved for every card before anything is
  // written, because a card's recession depends on where the NEXT card
  // actually is on screen, and that is not known until its own translate has
  // been computed.
  const geo = cards.map((_, i) => {
    const cardTop = cardTops[i] ?? 0
    const pin = stackPx + props.itemStackDistance * i
    const triggerStart = cardTop - pin
    const triggerEnd = cardTop - scaleEndPx

    const p = progress(scrollTop, triggerStart, triggerEnd)
    const targetScale = props.baseScale + i * props.itemScale
    const scale = 1 - p * (1 - targetScale)

    let translateY = 0
    if (scrollTop >= triggerStart && scrollTop <= pinEnd) translateY = scrollTop - cardTop + pin
    else if (scrollTop > pinEnd) translateY = pinEnd - cardTop + pin

    // Where the card's top edge actually sits in the viewport right now.
    const viewportTop = cardTop + translateY - scrollTop
    return { cardTop, pin, p, scale, translateY, viewportTop }
  })

  // PASS 2 — depth, then write.
  cards.forEach((card, i) => {
    const g = geo[i]!
    let depth = 0

    // Coverage by every card in front: 0 when the next card is still at the
    // bottom of the viewport, 1 once it has reached its pinned position and is
    // sitting fully over this one.
    //
    // Keying off coverage rather than off the scale trigger is the fix for the
    // original defect: the incoming card begins overlapping as soon as it
    // enters the viewport, which is long before its scale range starts, so a
    // trigger-based depth left the card underneath fully sharp while its copy
    // was already being sliced by the incoming edge.
    for (let j = i + 1; j < cards.length; j++) {
      const gj = geo[j]!
      const span = containerHeight - gj.pin
      if (span <= 0) continue
      const covered = (containerHeight - gj.viewportTop) / span
      depth += Math.min(1, Math.max(0, covered))
    }

    const blur = props.blurAmount ? depth * props.blurAmount : 0
    const rotation = props.rotationAmount ? i * props.rotationAmount * g.p : 0
    // Floored so a deep card stays a shape behind the stack rather than
    // vanishing and leaving a hole in the page.
    const opacity = Math.max(0.3, 1 - depth * 0.42)

    const next = {
      y: Math.round(g.translateY * 100) / 100,
      s: Math.round(g.scale * 1000) / 1000,
      r: Math.round(rotation * 100) / 100,
      b: Math.round(blur * 100) / 100,
      o: Math.round(opacity * 100) / 100,
    }

    const prev = lastTransforms.get(i)
    const changed =
      !prev ||
      Math.abs(prev.y - next.y) > 0.1 ||
      Math.abs(prev.s - next.s) > 0.001 ||
      Math.abs(prev.r - next.r) > 0.1 ||
      Math.abs(prev.b - next.b) > 0.05 ||
      Math.abs(prev.o - next.o) > 0.01

    if (changed) {
      card.style.transform = `translate3d(0, ${next.y}px, 0) scale(${next.s}) rotate(${next.r}deg)`
      card.style.filter = next.b > 0.02 ? `blur(${next.b}px)` : ''
      card.style.opacity = String(next.o)
      lastTransforms.set(i, next)
    }
  })
}

onMounted(async () => {
  const el = root.value
  if (!el) return

  cards = Array.from(el.querySelectorAll('.stack__card')) as HTMLElement[]
  cards.forEach((card, i) => {
    if (i < cards.length - 1) card.style.marginBottom = `${props.itemDistance}px`
    card.style.willChange = 'transform, filter, opacity'
    card.style.transformOrigin = 'top center'
    card.style.backfaceVisibility = 'hidden'
  })

  await nextTick()
  measure()

  // Layout changes — a font swap, an image landing, a viewport resize — move
  // every card, and a stale offset means a stack that pins to the wrong place.
  const ro = new ResizeObserver(() => {
    measure()
    lastTransforms.clear()
    update()
  })
  ro.observe(el)
  resizeObserver = ro

  // Reduced motion: no pin, no lenis, no loop. The cards flow normally.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const { default: Lenis } = await import('lenis')
  if (!root.value) return

  lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2,
    wheelMultiplier: 1,
    lerp: 0.1,
    syncTouch: true,
    syncTouchLerp: 0.075,
  }) as never

  lenis!.on('scroll', update)

  const loop = (time: number) => {
    lenis?.raf(time)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)

  update()
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
  lenis?.destroy()
  lenis = null
  resizeObserver?.disconnect()
  resizeObserver = null
  cards = []
  lastTransforms.clear()
})
</script>

<template>
  <div ref="root" class="stack">
    <slot />
    <!-- Release space so the final pin can let go cleanly. -->
    <div class="stack__end" aria-hidden="true" />
  </div>
</template>

<style scoped>
.stack {
  position: relative;
  width: 100%;
}

.stack__end {
  width: 100%;
  height: 1px;
}

/* The card surface is set by the consumer. Defaults to the page colour so a
   stack is invisible-but-occluding unless told otherwise — see the note at the
   top of this file about why a transparent card cannot work. */
.stack :deep(.stack__card) {
  position: relative;
  background: var(--stack-card-bg, var(--bg-page));
}
</style>
