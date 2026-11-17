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
  [key: string]: unknown
}

export interface RoadHandle {
  supported: boolean
  reason?: string
  setOptions(partial: RoadOptions): void
  getOptions(): RoadOptions
  /** Hold-style: true speeds up, false returns to normal. */
  speedUp(on: boolean): void
  /** 1 = normal, 0 = frozen frame. */
  setSpeed(n: number): void
  /** Draw the frame at effect time t (seconds). */
  setTime(t: number): void
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
