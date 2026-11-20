/**
 * Makes a section a sheet that slides over the one before it (see
 * utils/sheetStack.ts). Give the section the attribute data-sheet in its
 * template, so the rounded top and shadow are there from the first paint.
 */
import type { Ref } from 'vue'
import { sheetStack } from '~/utils/sheetStack'

export function useSheetStack(el: Ref<HTMLElement | null>) {
  useScrollMoment(({ gsap, ScrollTrigger }) => {
    if (!el.value) return
    return sheetStack(gsap, ScrollTrigger, el.value)
  })
}
