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
  // Sector headers. Shapes from the plan's table. Each must stay readable,
  // with no loops or folds at any moment: scripts/check-road-folds.mjs
  // traces the road through the camera for five minutes of animation and
  // all four score under 2 px. In each, the up-and-down part of the wave
  // (the last uAmp values) is what folds the road, so that is kept small;
  // the side-to-side sway, which carries each shape's character, stays.
  'sector-maritime': {
    kind: 'header', mask: 'header',
    // Waves. The board's [18, 4, 8, 8] looped and folded (up to 43 px).
    options: { seed: 14, distortion: 'turbulentDistortion', distortionUniforms: { uAmp: [15, 4, 2, 0] } },
  },
  'sector-oil-gas': {
    kind: 'header', mask: 'header',
    // A deep climb. The preset's [10, 20] folded by up to 331 px.
    options: { seed: 15, distortion: 'deepDistortion', distortionUniforms: { uAmp: [10, 3] } },
  },
  'sector-logistics': {
    kind: 'header', mask: 'header',
    // A long straight route. The preset's [35, 10] folded by up to 50 px.
    options: { seed: 16, distortion: 'LongRaceDistortion', distortionUniforms: { uAmp: [35, 1.5] } },
  },
  'sector-supply-chain': {
    kind: 'header', mask: 'header',
    // A gentle chain of bends, at low amplitude. [12, 8] folded by up to 28 px.
    options: { seed: 17, distortion: 'xyDistortion', distortionUniforms: { uAmp: [12, 2] } },
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

  // --- Phase 2b experiments (only on /_roads demo pages) -------------------
  // Day to night: the hero road with the colour blend switched on.
  'demo-daynight': {
    kind: 'hero', mask: 'header',
    options: { seed: 3, themeMix: 0 },
  },
  // Sector road: the four sector shapes in one road, morphing live. Same
  // shapes and settings as the four sector header roads.
  'demo-sectors': {
    kind: 'header', mask: 'none',
    options: {
      seed: 14,
      morph: {
        presets: ['turbulentDistortion', 'deepDistortion', 'LongRaceDistortion', 'xyDistortion'],
        // The same fold-free settings as the four sector header roads.
        uniforms: [{ uAmp: [15, 4, 2, 0] }, { uAmp: [10, 3] }, { uAmp: [35, 1.5] }, { uAmp: [12, 2] }],
        start: 0,
      },
    },
  },
  // Message sent: the contact road with the one-off amber car.
  'demo-launch': {
    kind: 'header', mask: 'none',
    options: { seed: 8, distortion: 'deepDistortion', distortionUniforms: { uAmp: [8, 14] }, launchCar: true },
    speed: 0.45,
  },
  // 404: the road fades into empty space ahead. Fog closes in at 12 to 48
  // units: the deep road's climb all happens within about 50 units. It sits
  // in its own band under the text, so it needs no side fade.
  'demo-void': {
    kind: 'header', mask: 'none',
    options: { seed: 40, distortion: 'deepDistortion', fogNear: 0.03, fogFar: 0.12 },
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
