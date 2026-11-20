// Types for the portable road (index.js). Only what the site uses.

export type Distortion =
  | 'mountainDistortion'
  | 'turbulentDistortion'
  | 'xyDistortion'
  | 'LongRaceDistortion'
  | 'deepDistortion'

export interface RoadOptions {
  theme?: 'light' | 'dark'
  distortion?: Distortion
  distortionUniforms?: Record<string, number[]> | null
  seed?: number | null
  maxPixelRatio?: number
  pauseOffscreen?: boolean
  reducedMotion?: 'still' | 'off' | 'animate'
  /** Phase 2b: a set viewpoint instead of the road-following camera.
      fitWidth sets the height so that many road units span the canvas. */
  fixedCamera?: { position: [number, number, number]; target: [number, number, number]; up?: [number, number, number]; fitWidth?: number; fitHeight?: number }
  /** Phase 2b: both lanes travel the same way. */
  oneWay?: boolean
  /** Phase 2b: several shapes in one road, blended live by morphTo(). */
  morph?: { presets: Distortion[]; uniforms?: Record<string, number[]>[]; start?: number }
  /** Phase 2b: one bright car that races away on launchCar(). */
  launchCar?: boolean | { color?: string; speed?: number; length?: number; radius?: number }
  fogNear?: number
  fogFar?: number
  [key: string]: unknown
}

export interface RoadHandle {
  supported: boolean
  reason?: string
  /** Resolves once the shaders have compiled and the first frame is drawn. */
  ready?: Promise<void>
  setOptions(partial: RoadOptions): void
  getOptions(): RoadOptions
  /** Hold-style: true speeds up, false returns to normal. */
  speedUp(on: boolean): void
  /** 1 = normal, 0 = frozen frame. */
  setSpeed(n: number): void
  /** Ease the view to this field of view (degrees); null returns to normal. */
  setFov(deg: number | null): void
  /** Draw the frame at effect time t (seconds). */
  setTime(t: number): void
  /** Phase 2b: start fast (or build up over rampMs first) and settle over ms. */
  arrive(ms?: number, boost?: number, rampMs?: number, stretch?: boolean): void
  /** Like setSpeed, but negative runs the road backwards. */
  setVelocity(n: number): void
  morphTo(name: Distortion, ms?: number): void
  /** Pointer position, -1 to 1 on each axis. */
  setSteer(x: number, y: number): void
  launchCar(): void
  pause(): void
  resume(): void
  destroy(): void
}

export function mount(canvas: HTMLCanvasElement, options?: RoadOptions): RoadHandle

declare const api: {
  version: string
  mount: typeof mount
  readonly defaults: RoadOptions
}
export default api
