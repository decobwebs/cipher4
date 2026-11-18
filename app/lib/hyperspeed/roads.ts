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
 *
 * No loops or folds: every road except the home hero must stay readable at
 * every moment. scripts/check-road-folds.mjs traces each road through the
 * camera for 5 minutes of animation; all must score under 2 px. The hero is
 * kept exactly as the live site's road, loop included (owner's decision).
 */
import type { RoadOptions } from './index'

export type RoadKind = 'hero' | 'header' | 'closing' | 'strip' | 'deliver' | 'spine'
export type RoadMask = 'hero' | 'header' | 'band' | 'strip' | 'deliver' | 'closing' | 'spine' | 'none'

export interface RoadPreset {
  kind: RoadKind
  mask: RoadMask
  options: RoadOptions
  /** Overrides on phones and tablets (the boards use a different seed for some). */
  mobileOptions?: RoadOptions
  /** Base speed. 1 = the live hero. */
  speed?: number
  /** Still-image sizes, when the road is not the usual wide shape. */
  still?: { desktop: [number, number]; mobile: [number, number]; sizes: string }
}

export const roads = {
  // Home hero: the live road, exactly. Seed 3 on desktop, 4 on phones (boards).
  hero: {
    kind: 'hero', mask: 'hero',
    options: { seed: 3 },
    mobileOptions: { seed: 4 },
  },
  // Service page headers: mountain, calmer. No loops or folds (board's
  // [20, 20, 14] folded by up to 159 px; the up-and-down part is reduced).
  service: {
    kind: 'header', mask: 'header',
    options: { seed: 21, distortionUniforms: { uAmp: [20, 2, 8] } },
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
  // Case study headers: a long straight road. ([24, 8] folded by up to 37 px.)
  case: {
    kind: 'header', mask: 'header',
    options: { seed: 31, distortion: 'LongRaceDistortion', distortionUniforms: { uAmp: [24, 1.5] } },
  },
  // Contact header: deep, slow. Speeds up for 400 ms when the form is sent.
  // ([8, 14] folded by up to 258 px.)
  contact: {
    kind: 'header', mask: 'header',
    options: { seed: 8, distortion: 'deepDistortion', distortionUniforms: { uAmp: [8, 3] } },
    speed: 0.45,
  },
  // Thin strip between sections. Moves only while scrolling.
  // ([20, 6] folded by up to 23 px.)
  strip: {
    kind: 'strip', mask: 'strip',
    options: { seed: 5, distortion: 'LongRaceDistortion', distortionUniforms: { uAmp: [20, 1.5] }, maxPixelRatio: 1.5 },
  },
  // How we deliver: speed driven by scroll.
  // ([14, 4, 6, 6] folded by up to 22 px.)
  deliver: {
    kind: 'deliver', mask: 'deliver',
    options: { seed: 9, distortion: 'turbulentDistortion', distortionUniforms: { uAmp: [14, 3, 2, 0] } },
  },
  // Closing band: the night road.
  // ([22, 22, 14] folded by up to 195 px.)
  closing: {
    kind: 'closing', mask: 'closing',
    options: { seed: 7, theme: 'dark', distortionUniforms: { uAmp: [22, 2, 8] } },
  },
  // 404: deep, in a calm loop. The only road that never stops on its own.
  // (The preset's [10, 20] folded by up to 331 px.)
  notfound: {
    kind: 'header', mask: 'header',
    options: { seed: 40, distortion: 'deepDistortion', distortionUniforms: { uAmp: [10, 3] } },
    speed: 0.6,
  },

  // --- Phase 2b experiments (only on /_roads demo pages) -------------------
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
  // Home Sectors section (owner's choice from the Phase 2b demos): a slim
  // band above the four sector cards that morphs to the shape of the card
  // you point at or focus. Desktop only (hidden below 1025 px).
  'home-sectors': {
    kind: 'header', mask: 'strip',
    options: {
      seed: 14,
      morph: {
        presets: ['turbulentDistortion', 'deepDistortion', 'LongRaceDistortion', 'xyDistortion'],
        uniforms: [{ uAmp: [15, 4, 2, 0] }, { uAmp: [10, 3] }, { uAmp: [35, 1.5] }, { uAmp: [12, 2] }],
        start: 0,
      },
    },
  },
  // Message sent: the contact road with the one-off amber car.
  'demo-launch': {
    kind: 'header', mask: 'none',
    options: { seed: 8, distortion: 'deepDistortion', distortionUniforms: { uAmp: [8, 3] }, launchCar: true },
    speed: 0.45,
  },
  // 404: the road fades into empty space ahead. Fog closes in at 12 to 48
  // units: the deep road's climb all happens within about 50 units. It sits
  // in its own band under the text, so it needs no side fade.
  'demo-void': {
    kind: 'header', mask: 'none',
    options: { seed: 40, distortion: 'deepDistortion', distortionUniforms: { uAmp: [10, 3] }, fogNear: 0.03, fogFar: 0.12 },
    speed: 0.6,
  },
  // Spine: looking straight down, so the road runs down the screen as a
  // narrow band. Straight (no bends, so it cannot fold). Both lanes travel
  // the same way. Trails follow the scroll in both directions, at the
  // scroll's speed, and stop when scrolling stops (useRoadController).
  'demo-spine': {
    kind: 'spine', mask: 'spine',
    options: {
      seed: 12,
      distortion: 'LongRaceDistortion',
      distortionUniforms: { uAmp: [0, 0] },
      oneWay: true,
      fixedCamera: { position: [0, 40, -200], target: [0, 0, -200], up: [0, 0, 1], fitWidth: 18 },
      maxPixelRatio: 1.5,
    },
    still: { desktop: [240, 1000], mobile: [96, 800], sizes: '(max-width: 900px) 80px, 220px' },
  },
  // Launch: the road from behind, pointing straight up the screen. Trails
  // rise, build up speed as the section comes into view, then settle to a
  // gentle climb. A slight sway only; checked for folds from this camera.
  'demo-rise': {
    kind: 'header', mask: 'strip',
    options: {
      seed: 23,
      distortion: 'LongRaceDistortion',
      distortionUniforms: { uAmp: [3, 0] },
      oneWay: true,
      // Over the road and low, so the road starts below the frame and runs
      // up to a vanishing point about a third from the top.
      fixedCamera: { position: [0, 16, -8], target: [0, 0, -46] },
    },
    speed: 0.5,
    still: { desktop: [760, 640], mobile: [780, 420], sizes: '(max-width: 900px) 100vw, 50vw' },
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
