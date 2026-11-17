/**
 * Every road on the site, by name. Settings come from the Motion board and
 * the page boards (their HS.mount calls), and from the plan's preset table
 * (BUILD-PLAN.md, Phase 2, step 4). Where the boards give no exact values,
 * the plan's distortion is used with its own default shape.
 *
 * kind     decides when a road may animate (see useRoadController):
 *          hero, header  the page's header road; runs on every device tier
 *          closing       the night road in the closing band; every tier
 *          strip         thin band between sections; moves only while you scroll
 *          deliver       "How we deliver"; speed follows the scroll
 * mask     the fade that keeps the road away from the words (HyperspeedRoad.vue)
 */
import type { RoadOptions } from './index'

export type RoadKind = 'hero' | 'header' | 'closing' | 'strip' | 'deliver'
export type RoadMask = 'hero' | 'header' | 'band' | 'strip' | 'deliver' | 'closing' | 'none'

export interface RoadPreset {
  kind: RoadKind
  mask: RoadMask
  options: RoadOptions
  /** Overrides on phones and tablets (the boards use a different seed for some). */
  mobileOptions?: RoadOptions
  /** Base speed. 1 = the live hero. */
  speed?: number
}

export const roads = {
  // Home hero: the live road, exactly. Seed 3 on desktop, 4 on phones (boards).
  hero: {
    kind: 'hero', mask: 'hero',
    options: { seed: 3 },
    mobileOptions: { seed: 4 },
  },
  // Service page headers: mountain, calmer.
  service: {
    kind: 'header', mask: 'header',
    options: { seed: 21, distortionUniforms: { uAmp: [20, 20, 14] } },
  },
  // Sector headers. Maritime from the Page-Sector board; the other three
  // follow the plan's table (no board values exist for them).
  'sector-maritime': {
    kind: 'header', mask: 'header',
    options: { seed: 14, distortion: 'turbulentDistortion', distortionUniforms: { uAmp: [18, 4, 8, 8] } },
  },
  'sector-oil-gas': {
    kind: 'header', mask: 'header',
    options: { seed: 15, distortion: 'deepDistortion' },
  },
  'sector-logistics': {
    kind: 'header', mask: 'header',
    options: { seed: 16, distortion: 'LongRaceDistortion' },
  },
  'sector-supply-chain': {
    kind: 'header', mask: 'header',
    // "xyDistortion with low amplitude": half the preset's [25, 15].
    options: { seed: 17, distortion: 'xyDistortion', distortionUniforms: { uAmp: [12, 8] } },
  },
  // Case study headers: a long straight road.
  case: {
    kind: 'header', mask: 'header',
    options: { seed: 31, distortion: 'LongRaceDistortion', distortionUniforms: { uAmp: [24, 8] } },
  },
  // Contact header: deep, slow. Speeds up for 400 ms when the form is sent.
  contact: {
    kind: 'header', mask: 'header',
    options: { seed: 8, distortion: 'deepDistortion', distortionUniforms: { uAmp: [8, 14] } },
    speed: 0.45,
  },
  // Thin strip between sections. Moves only while scrolling.
  strip: {
    kind: 'strip', mask: 'strip',
    options: { seed: 5, distortion: 'LongRaceDistortion', distortionUniforms: { uAmp: [20, 6] }, maxPixelRatio: 1.5 },
  },
  // How we deliver: speed driven by scroll.
  deliver: {
    kind: 'deliver', mask: 'deliver',
    options: { seed: 9, distortion: 'turbulentDistortion', distortionUniforms: { uAmp: [14, 4, 6, 6] } },
  },
  // Closing band: the night road.
  closing: {
    kind: 'closing', mask: 'closing',
    options: { seed: 7, theme: 'dark', distortionUniforms: { uAmp: [22, 22, 14] } },
  },
  // 404: deep, in a calm loop. The only road that never stops on its own.
  notfound: {
    kind: 'header', mask: 'header',
    options: { seed: 40, distortion: 'deepDistortion' },
    speed: 0.6,
  },
} satisfies Record<string, RoadPreset>

export type RoadName = keyof typeof roads

/** Still-frame files in /public/images/road/, made by scripts/export-road-stills.mjs. */
export const stillSizes = [
  { key: 'desktop', w: 1440, h: 700 },
  { key: 'mobile', w: 780, h: 600 },
] as const

export const stillSrc = (name: RoadName, key: 'desktop' | 'mobile') => `/images/road/${name}-${key}.webp`

/** Effect time (seconds) shown in still frames: mid-curve, cars spread out. */
export const STILL_TIME = 3
