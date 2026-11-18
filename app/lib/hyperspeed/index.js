/*!
 * C4Hyperspeed: portable build of the Cipher4 home-page hero effect.
 * Scene, shaders and defaults from Cipher4's HyperspeedField.vue, which is a
 * port of the React Bits "Hyperspeed" component by David Haz
 * (MIT + Commons Clause; see LICENSE-REACT-BITS.md next to this file).
 *
 * Source of this copy: C:\Users\HP\cipher4-hyperspeed\build\src (v1.0.0).
 * Cipher4 site changes, all marked "C4 site:":
 *   - an ES module export instead of the window.C4Hyperspeed global;
 *   - handle.setTime(t), to draw a still frame at an exact effect time.
 *   - Phase 2b experiments, each off unless asked for: arrive() (fast start
 *     that settles, optionally after a run-up), morph (several road shapes
 *     blended live), setSteer() (camera leans to the pointer), launchCar
 *     (one bright car that races away), fixedCamera (a set viewpoint, such
 *     as looking straight down), oneWay (both lanes travel the same way)
 *     and setVelocity() (speed that may run backwards).
 * Licence: for use on Cipher4's own site. Never publish or sell this code as
 * a separate package (plan, section 8).
 */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Fog, Color, Vector2, Vector3, Vector4,
  LineCurve3, TubeGeometry, InstancedBufferGeometry, InstancedBufferAttribute,
  ShaderMaterial, Mesh, PlaneGeometry, ShaderChunk, DoubleSide,
} from 'three'
import {
  EffectComposer, RenderPass, EffectPass, BloomEffect, SMAAEffect, SMAAPreset,
} from 'postprocessing'
import { presets as PRESETS } from './presets.js'

// ------------------------------------------------------------------ palettes
// Exact values from HyperspeedField.vue.
const THEMES = {
  light: {
    bloom: false, // live: bloom only in the dark theme
    colors: {
      background: '#ffffff',
      roadColor: '#dde6f0',
      islandColor: '#d0dbe8',
      shoulderLines: '#a9b7c7',
      brokenLines: '#bcc9d8',
      leftCars: ['#f5a524', '#f8b542', '#fbc96a'],
      rightCars: ['#1a3ab5', '#152e8e', '#102068'],
      sticks: '#f5a524',
    },
  },
  dark: {
    bloom: true,
    colors: {
      background: '#060a1c',
      roadColor: '#0a1030',
      islandColor: '#102068',
      shoulderLines: '#2a4fd0',
      brokenLines: '#2a4fd0',
      leftCars: ['#f8b542', '#f5a524', '#fbc96a'],
      rightCars: ['#f4f7ff', '#d8e2f7', '#b9c4de'],
      sticks: '#f5a524',
    },
  },
}

const clone = (o) => JSON.parse(JSON.stringify(o))

// The live hero: <UiHyperspeedField theme="light" distortion="mountainDistortion" />
const DEFAULTS = {
  theme: 'light',
  distortion: 'mountainDistortion',
  distortionUniforms: null, // e.g. { uFreq: [3,6,10], uAmp: [30,30,20] } to override the preset's

  length: 400,
  roadWidth: 6,
  islandWidth: 2,
  lanesPerRoad: 3,
  fov: 90,
  fovSpeedUp: 150, // not in the live port (no interaction there); React Bits default
  speedUp: 1.2, // set in the live port but unused there; used here by speedUp()/hold
  carLightsFade: 0.55,
  totalSideLightSticks: 16,
  lightPairsPerRoadWay: 34,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [50, 70],
  movingCloserSpeed: [-90, -120],
  carLightsLength: [12, 36],
  carLightsRadius: [0.05, 0.12],
  carWidthPercentage: [0.3, 0.45],
  carShiftX: [-0.25, 0.25],
  carFloorSeparation: [0.05, 0.8],
  colors: clone(THEMES.light.colors),

  cameraPosition: [0, 8, -5],
  fogNear: 0.2, // x length
  fogFar: 500, // x length

  // Canvas clear colour. The live canvas is transparent (alpha renderer,
  // clear alpha 0); the white you see on the site is the page behind it.
  background: 'transparent',
  bloom: null, // null = follow theme (light: off, dark: on)
  bloomOptions: { luminanceThreshold: 0.2, luminanceSmoothing: 0, resolutionScale: 1 },
  smaa: true,
  maxPixelRatio: 1.75, // the live cap (its comment says 2; the code says 1.75)

  holdToSpeedUp: false, // live hero has no pointer interaction
  reducedMotion: 'still', // 'still' | 'off' (= live: draw nothing) | 'animate'
  saveData: 'ignore', // 'ignore' | 'off' (= live: draw nothing when Save-Data is on)
  pauseOffscreen: true,
  seed: null, // number = repeatable layout; null = Math.random like live
}

function presetsPublic() {
  const out = {}
  for (const [k, p] of Object.entries(PRESETS)) {
    out[k] = {
      source: p.source,
      uniforms: clone(p.uniforms),
      lookAtAmp: p.lookAtAmp && p.lookAtAmp.slice(),
      lookAtOffset: p.lookAtOffset && p.lookAtOffset.slice(),
      glsl: p.glsl,
    }
  }
  return out
}

function deepMerge(target, src) {
  for (const k of Object.keys(src || {})) {
    const v = src[k]
    if (v && typeof v === 'object' && !Array.isArray(v) && target[k] && typeof target[k] === 'object' && !Array.isArray(target[k])) {
      deepMerge(target[k], v)
    } else {
      target[k] = Array.isArray(v) ? v.slice() : v && typeof v === 'object' ? clone(v) : v
    }
  }
  return target
}

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function vec(arr) {
  if (arr.length === 2) return new Vector2(arr[0], arr[1])
  if (arr.length === 3) return new Vector3(arr[0], arr[1], arr[2])
  return new Vector4(arr[0], arr[1], arr[2], arr[3])
}

// Resolve user options against defaults + theme.
function resolve(user) {
  const theme = THEMES[user.theme] ? user.theme : DEFAULTS.theme
  const o = deepMerge(clone(DEFAULTS), { colors: THEMES[theme].colors })
  deepMerge(o, user)
  o.theme = theme
  if (o.bloom == null) o.bloom = THEMES[theme].bloom
  if (!PRESETS[o.distortion]) o.distortion = DEFAULTS.distortion
  return o
}

function lerp(current, target, speed = 0.1, limit = 0.001) {
  let change = (target - current) * speed
  if (Math.abs(change) < limit) change = target - current
  return change
}

// --------------------------------------------------------------- shaders
const carLightsVertex = (d) => `
  #define USE_FOG;
  ${ShaderChunk.fog_pars_vertex}
  attribute vec3 aOffset;
  attribute vec3 aMetrics;
  attribute vec3 aColor;
  uniform float uTravelLength;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vColor;
  ${d}
  void main() {
    vec3 transformed = position.xyz;
    float radius = aMetrics.r;
    float myLength = aMetrics.g;
    float speed = aMetrics.b;
    transformed.xy *= radius;
    transformed.z *= myLength;
    transformed.z += myLength - mod(uTime * speed + aOffset.z, uTravelLength);
    transformed.xy += aOffset.xy;
    float progress = abs(transformed.z / uTravelLength);
    transformed.xyz += getDistortion(progress);
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
    vColor = aColor;
    ${ShaderChunk.fog_vertex}
  }
`
const carLightsFragment = `
  #define USE_FOG;
  ${ShaderChunk.fog_pars_fragment}
  varying vec3 vColor;
  varying vec2 vUv;
  uniform vec2 uFade;
  void main() {
    vec3 color = vec3(vColor);
    float alpha = smoothstep(uFade.x, uFade.y, vUv.x);
    gl_FragColor = vec4(color, alpha);
    if (gl_FragColor.a < 0.0001) discard;
    ${ShaderChunk.fog_fragment}
  }
`
const sticksVertex = (d) => `
  #define USE_FOG;
  ${ShaderChunk.fog_pars_vertex}
  attribute float aOffset;
  attribute vec3 aColor;
  attribute vec2 aMetrics;
  uniform float uTravelLength;
  uniform float uTime;
  varying vec3 vColor;
  mat4 rotationY(in float angle) {
    return mat4(cos(angle), 0, sin(angle), 0, 0, 1.0, 0, 0, -sin(angle), 0, cos(angle), 0, 0, 0, 0, 1);
  }
  ${d}
  void main(){
    vec3 transformed = position.xyz;
    float width = aMetrics.x;
    float height = aMetrics.y;
    transformed.xy *= vec2(width, height);
    float time = mod(uTime * 60. * 2. + aOffset, uTravelLength);
    transformed = (rotationY(3.14/2.) * vec4(transformed,1.)).xyz;
    transformed.z += -uTravelLength + time;
    float progress = abs(transformed.z / uTravelLength);
    transformed.xyz += getDistortion(progress);
    transformed.y += height / 2.;
    transformed.x += -width / 2.;
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vColor = aColor;
    ${ShaderChunk.fog_vertex}
  }
`
const sticksFragment = `
  #define USE_FOG;
  ${ShaderChunk.fog_pars_fragment}
  varying vec3 vColor;
  void main(){
    gl_FragColor = vec4(vec3(vColor), 1.);
    ${ShaderChunk.fog_fragment}
  }
`
const roadVertex = (d) => `
  #define USE_FOG;
  uniform float uTime;
  ${ShaderChunk.fog_pars_vertex}
  uniform float uTravelLength;
  varying vec2 vUv;
  ${d}
  void main() {
    vec3 transformed = position.xyz;
    vec3 distortion = getDistortion((transformed.y + uTravelLength / 2.) / uTravelLength);
    transformed.x += distortion.x;
    transformed.z += distortion.y;
    transformed.y += -1. * distortion.z;
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
    ${ShaderChunk.fog_vertex}
  }
`
const roadMarkingsVars = `
  uniform float uLanes;
  uniform vec3 uBrokenLinesColor;
  uniform vec3 uShoulderLinesColor;
  uniform float uShoulderLinesWidthPercentage;
  uniform float uBrokenLinesWidthPercentage;
  uniform float uBrokenLinesLengthPercentage;
`
const roadMarkingsFragment = `
  uv.y = mod(uv.y + uTime * 0.05, 1.);
  float laneWidth = 1.0 / uLanes;
  float brokenLineWidth = laneWidth * uBrokenLinesWidthPercentage;
  float laneEmptySpace = 1. - uBrokenLinesLengthPercentage;
  float brokenLines = step(1.0 - brokenLineWidth, fract(uv.x * 2.0)) * step(laneEmptySpace, fract(uv.y * 10.0));
  float sideLines = step(1.0 - brokenLineWidth, fract((uv.x - laneWidth * (uLanes - 1.0)) * 2.0)) + step(brokenLineWidth, uv.x);
  brokenLines = mix(brokenLines, sideLines, uv.x);
  color = mix(color, uBrokenLinesColor, brokenLines);
`
const roadBase = (vars, frag) => `
  #define USE_FOG;
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uTime;
  ${vars}
  ${ShaderChunk.fog_pars_fragment}
  void main() {
    vec2 uv = vUv;
    vec3 color = vec3(uColor);
    ${frag}
    gl_FragColor = vec4(color, 1.);
    ${ShaderChunk.fog_fragment}
  }
`

// C4 site: one-off car. Same as the car-light vertex shader, but it moves by
// uRun (seconds since launch) instead of looping with uTime, so it races
// away once. uTime still drives the road's bend, so it stays on the road.
const launchVertex = (d) => carLightsVertex(d)
  .replace('uniform float uTime;', 'uniform float uTime;\n  uniform float uRun;')
  .replace('transformed.z += myLength - mod(uTime * speed + aOffset.z, uTravelLength);', 'transformed.z += myLength - uRun * speed + aOffset.z;')

// C4 site: shape morph. Up to four distortions in one shader, each with its
// names suffixed (_0 to _3), blended by the weights in uW. The camera blends
// the same way, so changing shape never jumps.
const MORPH_IDS = ['getDistortionX', 'getDistortionY', 'getDistortion', 'uFreq', 'uAmp', 'uPowY', 'nsin']
function buildMorph(m) {
  const names = m.presets.slice(0, 4)
  let glsl = '#define PI 3.14159265358979\nuniform vec4 uW;\n'
  const uniforms = {}
  const parts = []
  names.forEach((name, i) => {
    const p = PRESETS[name]
    let g = p.glsl.replace(/#define PI[^\n]*\n/g, '\n')
    for (const id of MORPH_IDS) g = g.replace(new RegExp('\\b' + id + '\\b', 'g'), id + '_' + i)
    glsl += g
    const uvals = Object.assign(clone(p.uniforms), (m.uniforms && m.uniforms[i]) || {})
    for (const k of Object.keys(uvals)) uniforms[k + '_' + i] = { value: vec(uvals[k]) }
    parts.push({ p, uvals })
  })
  const terms = names.map((_, i) => 'uW.' + 'xyzw'[i] + ' * getDistortion_' + i + '(progress)').join(' + ')
  glsl += '\nvec3 getDistortion(float progress){ return ' + terms + '; }\n'
  const w = [0, 0, 0, 0]
  w[Math.min(names.length - 1, m.start || 0)] = 1
  uniforms.uW = { value: new Vector4(w[0], w[1], w[2], w[3]) }
  const preset = {
    glsl,
    lookAtAmp: [1, 1, 1],
    lookAtOffset: [0, 0, 0],
    // Weighted camera target; each part keeps its own amp and offset.
    js(prog, t) {
      const out = [0, 0, 0]
      parts.forEach(({ p, uvals }, i) => {
        if (!w[i]) return
        const d = p.js(prog, t, uvals)
        for (let k = 0; k < 3; k++) out[k] += w[i] * (d[k] * p.lookAtAmp[k] + p.lookAtOffset[k])
      })
      return out
    },
  }
  return { preset, uvals: {}, uniforms, w, names, tween: null }
}

// ------------------------------------------------------------------ mount
function supportsWebGL() {
  try {
    const c = new OffscreenCanvas(1, 1)
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    if (gl) { const e = gl.getExtension('WEBGL_lose_context'); e && e.loseContext() }
    return !!gl
  } catch (e) {
    // OffscreenCanvas missing: assume yes and let the renderer constructor decide.
    return typeof WebGLRenderingContext !== 'undefined'
  }
}

function mount(canvas, userOptions) {
  if (!canvas || canvas.tagName !== 'CANVAS') throw new Error('C4Hyperspeed.mount: pass a <canvas> element')

  let user = clone(userOptions || {})
  let o = resolve(user)

  const mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
  const reduce = () => !!(mqReduce && mqReduce.matches) && o.reducedMotion !== 'animate'
  const saveData = () => !!(navigator.connection && navigator.connection.saveData) && o.saveData === 'off'

  const inert = {
    supported: false, reason: '', setOptions() {}, speedUp() {}, setSpeed() {}, setFov() {}, pause() {}, resume() {}, destroy() {},
    getOptions: () => clone(o),
  }
  if (reduce() && o.reducedMotion === 'off') return Object.assign(inert, { reason: 'reduced-motion' })
  if (saveData()) return Object.assign(inert, { reason: 'save-data' })
  if (!supportsWebGL()) return Object.assign(inert, { reason: 'no-webgl' })

  let renderer
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true })
  } catch (e) {
    return Object.assign(inert, { reason: 'no-webgl' })
  }

  const camera = new PerspectiveCamera(o.fov, 1, 0.1, 10000)
  let scene, composer, built // built = { cars:[], sticks, roadTime, distortion, disposables }
  // Same maths as THREE.Clock.getDelta() (which three r185 marks deprecated).
  const clock = { last: 0, getDelta() { const n = performance.now(); const d = this.last ? (n - this.last) / 1000 : 0; this.last = n; return d } }
  let elapsed = 0 // scaled seconds; equals clock.elapsedTime on the live site at speed 1
  let timeOffset = 0
  let speedUpCur = 0
  let speedUpTarget = 0
  let fovTarget = o.fov
  let speed = 1

  // C4 site: Phase 2b state.
  let arrival = null // { t, dur, boost }
  const steer = { x: 0, y: 0, tx: 0, ty: 0 }

  let userPaused = false
  let onScreen = true
  let tabVisible = !document.hidden
  let running = false
  let destroyed = false

  function applyClear() {
    if (o.background === 'transparent' || o.background == null) renderer.setClearColor(0x000000, 0)
    else renderer.setClearColor(new Color(o.background), 1)
  }

  function build() {
    teardownScene()
    const rand = o.seed == null ? Math.random : mulberry32(o.seed)
    const random = (b) => (Array.isArray(b) ? rand() * (b[1] - b[0]) + b[0] : rand() * b)
    const pick = (a) => (Array.isArray(a) ? a[Math.floor(rand() * a.length)] : a)
    const disposables = []
    const c = o.colors

    scene = new Scene()
    scene.background = null
    const fog = new Fog(new Color(c.background), o.length * o.fogNear, o.length * o.fogFar)
    scene.fog = fog
    const fogUniforms = { fogColor: { value: fog.color }, fogNear: { value: fog.near }, fogFar: { value: fog.far } }

    // C4 site: o.morph carries several shapes at once (see buildMorph).
    const distortion = o.morph ? buildMorph(o.morph) : (() => {
      const pr = PRESETS[o.distortion]
      const uv = Object.assign(clone(pr.uniforms), o.distortionUniforms || {})
      const du = {}
      for (const k of Object.keys(uv)) du[k] = { value: vec(uv[k]) }
      return { preset: pr, uvals: uv, uniforms: du }
    })()
    const preset = distortion.preset
    const dUniforms = distortion.uniforms

    camera.fov = o.fov
    camera.position.set(o.cameraPosition[0], o.cameraPosition[1], o.cameraPosition[2])
    camera.rotation.set(0, 0, 0)
    camera.up.set(0, 1, 0)
    // C4 site: fixedCamera, a set viewpoint instead of the road-following
    // camera: { position, target, up, fitWidth }. With fitWidth the camera
    // height is set on every resize so that many road units span the canvas
    // width (used looking straight down).
    if (o.fixedCamera) {
      const fc = o.fixedCamera
      camera.position.set(fc.position[0], fc.position[1], fc.position[2])
      if (fc.up) camera.up.set(fc.up[0], fc.up[1], fc.up[2])
    }

    // car lights
    function makeCarLights(colors, spd, fade, xPos, side) {
      const curve = new LineCurve3(new Vector3(0, 0, 0), new Vector3(0, 0, -1))
      const geometry = new TubeGeometry(curve, 40, 1, 8, false)
      const inst = new InstancedBufferGeometry().copy(geometry)
      inst.instanceCount = o.lightPairsPerRoadWay * 2
      const laneWidth = o.roadWidth / o.lanesPerRoad
      const aOffset = [], aMetrics = [], aColor = []
      const idxs = [] // C4 site: palette index per car
      const cols = (Array.isArray(colors) ? colors : [colors]).map((x) => new Color(x))
      for (let i = 0; i < o.lightPairsPerRoadWay; i++) {
        const radius = random(o.carLightsRadius)
        const length = random(o.carLightsLength)
        const sp = random(spd)
        const carLane = i % o.lanesPerRoad
        let laneX = carLane * laneWidth - o.roadWidth / 2 + laneWidth / 2
        const carWidth = random(o.carWidthPercentage) * laneWidth
        laneX += random(o.carShiftX) * laneWidth
        const offsetY = random(o.carFloorSeparation) + radius * 1.3
        const offsetZ = -random(o.length)
        aOffset.push(laneX - carWidth / 2, offsetY, offsetZ, laneX + carWidth / 2, offsetY, offsetZ)
        aMetrics.push(radius, length, sp, radius, length, sp)
        // C4 site: the same draw from rand() as pick(), so layouts are unchanged.
        const ix = Math.floor(rand() * cols.length)
        const col = cols[ix]
        idxs.push(ix)
        aColor.push(col.r, col.g, col.b, col.r, col.g, col.b)
      }
      inst.setAttribute('aOffset', new InstancedBufferAttribute(new Float32Array(aOffset), 3, false))
      inst.setAttribute('aMetrics', new InstancedBufferAttribute(new Float32Array(aMetrics), 3, false))
      inst.setAttribute('aColor', new InstancedBufferAttribute(new Float32Array(aColor), 3, false))
      const material = new ShaderMaterial({
        fragmentShader: carLightsFragment,
        vertexShader: carLightsVertex(preset.glsl),
        transparent: true,
        uniforms: Object.assign({ uTime: { value: 0 }, uTravelLength: { value: o.length }, uFade: { value: fade } }, fogUniforms, dUniforms),
      })
      const mesh = new Mesh(inst, material)
      mesh.frustumCulled = false
      mesh.position.setX(xPos)
      scene.add(mesh)
      disposables.push(inst, material, geometry)
      material.userData.c4 = { inst, idxs, side }
      return material
    }
    const left = makeCarLights(c.leftCars, o.movingAwaySpeed, new Vector2(0, 1 - o.carLightsFade), -o.roadWidth / 2 - o.islandWidth / 2, 'leftCars')
    // C4 site: oneWay sends the right-hand lane the same way as the left.
    const right = o.oneWay
      ? makeCarLights(c.rightCars, o.movingAwaySpeed, new Vector2(0, 1 - o.carLightsFade), o.roadWidth / 2 + o.islandWidth / 2, 'rightCars')
      : makeCarLights(c.rightCars, o.movingCloserSpeed, new Vector2(1, o.carLightsFade), o.roadWidth / 2 + o.islandWidth / 2, 'rightCars')

    // C4 site: one-off car (launchCar option), hidden until launched.
    let launch = null
    if (o.launchCar) {
      const lc = o.launchCar === true ? {} : o.launchCar
      // Owner's review: brighter and slightly longer, to read on the light
      // road. Thicker than the trails and a little slower, so the eye can
      // follow it from the camera into the distance (about 2.8 s).
      const radius = lc.radius ?? 0.5
      const length = lc.length ?? 96
      const sp = lc.speed ?? 140
      const startZ = lc.startZ ?? -14 // just ahead of the camera, so it is seen at once
      const curve = new LineCurve3(new Vector3(0, 0, 0), new Vector3(0, 0, -1))
      const geometry = new TubeGeometry(curve, 40, 1, 8, false)
      const inst = new InstancedBufferGeometry().copy(geometry)
      inst.instanceCount = 2
      const laneWidth = o.roadWidth / o.lanesPerRoad
      const carWidth = 0.42 * laneWidth
      const y = 0.35 + radius * 1.3
      const col = new Color(lc.color || '#ff8a00') // a deeper amber than the trails
      inst.setAttribute('aOffset', new InstancedBufferAttribute(new Float32Array([-carWidth / 2, y, startZ, carWidth / 2, y, startZ]), 3, false))
      inst.setAttribute('aMetrics', new InstancedBufferAttribute(new Float32Array([radius, length, sp, radius, length, sp]), 3, false))
      inst.setAttribute('aColor', new InstancedBufferAttribute(new Float32Array([col.r, col.g, col.b, col.r, col.g, col.b]), 3, false))
      const material = new ShaderMaterial({
        fragmentShader: carLightsFragment,
        vertexShader: launchVertex(preset.glsl),
        transparent: true,
        // Solid for most of its length; only the last quarter fades.
        uniforms: Object.assign({ uTime: { value: 0 }, uRun: { value: 0 }, uTravelLength: { value: o.length }, uFade: { value: new Vector2(0, 0.25) } }, fogUniforms, dUniforms),
      })
      const mesh = new Mesh(inst, material)
      mesh.frustumCulled = false
      mesh.visible = false
      mesh.position.setX(-o.roadWidth / 2 - o.islandWidth / 2)
      scene.add(mesh)
      disposables.push(inst, material, geometry)
      launch = { mesh, material, run: 0, active: false, dist: o.length + length + 20, sp }
    }

    // sticks
    const stickGeo = new PlaneGeometry(1, 1)
    const stickInst = new InstancedBufferGeometry().copy(stickGeo)
    const total = o.totalSideLightSticks
    stickInst.instanceCount = total
    {
      const so = o.length / (total - 1)
      const aOffset = [], aColor = [], aMetrics = []
      const sc = new Color(c.sticks)
      for (let i = 0; i < total; i++) {
        aOffset.push((i - 1) * so * 2 + so * rand())
        aColor.push(sc.r, sc.g, sc.b)
        aMetrics.push(random(o.lightStickWidth), random(o.lightStickHeight))
      }
      stickInst.setAttribute('aOffset', new InstancedBufferAttribute(new Float32Array(aOffset), 1, false))
      stickInst.setAttribute('aColor', new InstancedBufferAttribute(new Float32Array(aColor), 3, false))
      stickInst.setAttribute('aMetrics', new InstancedBufferAttribute(new Float32Array(aMetrics), 2, false))
    }
    const stickMat = new ShaderMaterial({
      fragmentShader: sticksFragment,
      vertexShader: sticksVertex(preset.glsl),
      side: DoubleSide,
      uniforms: Object.assign({ uTravelLength: { value: o.length }, uTime: { value: 0 } }, fogUniforms, dUniforms),
    })
    const stickMesh = new Mesh(stickInst, stickMat)
    stickMesh.frustumCulled = false
    stickMesh.position.setX(-(o.roadWidth + o.islandWidth / 2))
    scene.add(stickMesh)
    disposables.push(stickGeo, stickInst, stickMat)

    // road + island
    const roadTime = { value: 0 }
    const roadFrag = roadBase(roadMarkingsVars, roadMarkingsFragment)
    const islandFrag = roadBase('', '')
    function plane(side, isRoad) {
      const geometry = new PlaneGeometry(isRoad ? o.roadWidth : o.islandWidth, o.length, 20, 100)
      let uniforms = {
        uTravelLength: { value: o.length },
        uColor: { value: new Color(isRoad ? c.roadColor : c.islandColor) },
        uTime: roadTime,
      }
      if (isRoad) {
        uniforms = Object.assign(uniforms, {
          uLanes: { value: o.lanesPerRoad },
          uBrokenLinesColor: { value: new Color(c.brokenLines) },
          uShoulderLinesColor: { value: new Color(c.shoulderLines) },
          uShoulderLinesWidthPercentage: { value: o.shoulderLinesWidthPercentage },
          uBrokenLinesLengthPercentage: { value: o.brokenLinesLengthPercentage },
          uBrokenLinesWidthPercentage: { value: o.brokenLinesWidthPercentage },
        })
      }
      const material = new ShaderMaterial({
        fragmentShader: isRoad ? roadFrag : islandFrag,
        vertexShader: roadVertex(preset.glsl),
        side: DoubleSide,
        uniforms: Object.assign(uniforms, fogUniforms, dUniforms),
      })
      const mesh = new Mesh(geometry, material)
      mesh.rotation.x = -Math.PI / 2
      mesh.position.z = -o.length / 2
      mesh.position.x += (o.islandWidth / 2 + o.roadWidth / 2) * side
      scene.add(mesh)
      disposables.push(geometry, material)
    }
    plane(-1, true)
    plane(1, true)
    plane(0, false)

    // post-processing: same pass order as live
    composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    if (o.bloom) composer.addPass(new EffectPass(camera, new BloomEffect(o.bloomOptions)))
    if (o.smaa) composer.addPass(new EffectPass(camera, new SMAAEffect({ preset: SMAAPreset.MEDIUM })))

    applyClear()
    built = { left, right, stickMat, roadTime, distortion, disposables, launch }
    resize()
  }

  function teardownScene() {
    if (!built) return
    scene.clear()
    for (const d of built.disposables) d.dispose()
    composer.dispose()
    built = null
  }

  function setTime(t) {
    if (built.launch) built.launch.material.uniforms.uTime.value = t
    built.left.uniforms.uTime.value = t
    built.right.uniforms.uTime.value = t
    built.stickMat.uniforms.uTime.value = t
    built.roadTime.value = t
    const p = built.distortion.preset
    if (o.fixedCamera) {
      const tg = o.fixedCamera.target
      camera.lookAt(tg[0], tg[1], tg[2])
    } else if (p.js) {
      const d = p.js(0.025, t, built.distortion.uvals)
      const amp = p.lookAtAmp, off = p.lookAtOffset
      camera.lookAt(
        camera.position.x + d[0] * amp[0] + off[0],
        camera.position.y + d[1] * amp[1] + off[1],
        camera.position.z + d[2] * amp[2] + off[2],
      )
    }
    // C4 site: steering, a small lean after the road's own camera aim.
    if (steer.x || steer.y) {
      camera.rotateY(-steer.x * 0.06) // about 3.4 degrees at full lean
      camera.rotateX(-steer.y * 0.035) // about 2 degrees
    }
    camera.updateProjectionMatrix()
  }

  function frame() {
    const delta = clock.getDelta()
    const dt = delta * speed
    // React Bits speed-up model. With speedUpTarget 0 (always, on the live
    // site) speedUpCur stays 0 and time === elapsed, i.e. the live clock.
    const lp = Math.exp(-(-60 * Math.log2(1 - 0.1)) * delta)
    if (arrival) {
      // C4 site: arrival. Start fast with a stretched view, settle to the
      // cruising speed and the normal view, easing out over arrival.dur.
      arrival.t += delta
      let k // 0 = cruising, 1 = full boost
      if (arrival.t < arrival.ramp) {
        const r = arrival.t / arrival.ramp
        k = r * r // ease in: speeding up
      } else {
        const pr = Math.min(1, (arrival.t - arrival.ramp) / arrival.dur)
        k = Math.pow(1 - pr, 3) // ease out: settling
      }
      speedUpCur = arrival.boost * k
      if (arrival.stretch) camera.fov = o.fov + (o.fovSpeedUp - o.fov) * k
      if (arrival.t >= arrival.ramp + arrival.dur) { arrival = null; speedUpCur = 0; camera.fov = o.fov }
    } else {
      speedUpCur += lerp(speedUpCur, speedUpTarget, lp, 0.00001)
    }
    timeOffset += speedUpCur * dt
    elapsed += dt
    if (!arrival) {
      const fc = lerp(camera.fov, fovTarget, lp)
      if (fc !== 0) camera.fov += fc * delta * 6
    }
    // C4 site: steering eases towards its target.
    const ks = 1 - Math.exp(-delta * 3)
    steer.x += (steer.tx - steer.x) * ks
    steer.y += (steer.ty - steer.y) * ks
    // C4 site: shape morph tween (in-out cubic).
    const dm = built.distortion
    if (dm.tween) {
      dm.tween.t += delta
      const pr = Math.min(1, dm.tween.t / dm.tween.dur)
      const e = pr < 0.5 ? 4 * pr * pr * pr : 1 - Math.pow(-2 * pr + 2, 3) / 2
      for (let i = 0; i < 4; i++) dm.w[i] = dm.tween.from[i] + (dm.tween.to[i] - dm.tween.from[i]) * e
      dm.uniforms.uW.value.set(dm.w[0], dm.w[1], dm.w[2], dm.w[3])
      if (pr >= 1) dm.tween = null
    }
    // C4 site: one-off car.
    const lc = built.launch
    if (lc && lc.active) {
      lc.run += delta
      lc.material.uniforms.uRun.value = lc.run
      if (lc.run * lc.sp > lc.dist) { lc.active = false; lc.mesh.visible = false }
    }
    setTime(elapsed + timeOffset)
    composer.render(delta)
  }

  function renderStill() {
    if (!built) return
    setTime(elapsed + timeOffset)
    composer.render(0)
  }

  function shouldRun() {
    return !destroyed && !userPaused && tabVisible && (onScreen || !o.pauseOffscreen) && !reduce()
  }
  function sync() {
    if (shouldRun()) {
      if (!running) { running = true; clock.getDelta(); renderer.setAnimationLoop(frame) }
    } else {
      if (running) { running = false; renderer.setAnimationLoop(null) }
    }
  }

  function resize() {
    const cw = canvas.clientWidth, ch = canvas.clientHeight
    if (!cw || !ch) return
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, o.maxPixelRatio))
    renderer.setSize(cw, ch, false)
    camera.aspect = cw / ch
    // C4 site: fixedCamera.fitWidth, the camera height that fits that many
    // road units across the canvas (straight-down view).
    if (o.fixedCamera && o.fixedCamera.fitWidth) {
      const half = Math.tan((camera.fov * Math.PI) / 360)
      camera.position.y = o.fixedCamera.fitWidth / (2 * half * camera.aspect)
    }
    camera.updateProjectionMatrix()
    if (composer) composer.setSize(cw, ch)
    if (!running) renderStill()
  }

  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  const io = new IntersectionObserver(([e]) => { onScreen = !!(e && e.isIntersecting); sync() }, { rootMargin: '0px 0px -10% 0px' })
  io.observe(canvas)
  const onVis = () => { tabVisible = !document.hidden; sync() }
  document.addEventListener('visibilitychange', onVis)
  const onMq = () => { sync(); if (!running) renderStill() }
  if (mqReduce) mqReduce.addEventListener ? mqReduce.addEventListener('change', onMq) : mqReduce.addListener(onMq)

  // pointer hold (React Bits behaviour), only when holdToSpeedUp is on
  const down = () => { fovTarget = o.fovSpeedUp; speedUpTarget = o.speedUp }
  const up = () => { fovTarget = o.fov; speedUpTarget = 0 }
  const ctx = (e) => e.preventDefault()
  let listening = false
  function wirePointer() {
    const want = !!o.holdToSpeedUp
    if (want === listening) return
    const m = want ? 'addEventListener' : 'removeEventListener'
    canvas[m]('mousedown', down)
    canvas[m]('mouseup', up)
    canvas[m]('mouseout', up)
    canvas[m]('touchstart', down, { passive: true })
    canvas[m]('touchend', up, { passive: true })
    canvas[m]('touchcancel', up, { passive: true })
    canvas[m]('contextmenu', ctx)
    listening = want
  }

  build()
  wirePointer()
  sync()
  if (!running) renderStill()

  return {
    supported: true,
    canvas,
    setOptions(partial) {
      if (destroyed || !partial) return
      partial = clone(partial)
      // Switching theme resets colours and bloom to that theme's, unless the
      // same call sets them too.
      if (partial.theme && partial.theme !== o.theme) {
        if (!partial.colors) delete user.colors
        if (!('bloom' in partial)) delete user.bloom
      }
      if (partial.distortion && partial.distortion !== o.distortion && !('distortionUniforms' in partial)) delete user.distortionUniforms
      deepMerge(user, partial)
      const prevFov = o.fov
      o = resolve(user)
      if (fovTarget === prevFov) fovTarget = o.fov
      build()
      wirePointer()
      sync()
      if (!running) renderStill()
    },
    getOptions: () => clone(o),
    speedUp(on) {
      if (on) down(); else up()
    },
    setSpeed(n) {
      speed = Math.max(0, Number(n) || 0)
    },
    // C4 site: widen or narrow the view. The camera eases towards it each
    // frame (no rebuild), so it can follow the scroll. null = back to normal.
    setFov(deg) {
      fovTarget = deg == null ? o.fov : Math.max(30, Math.min(160, Number(deg) || o.fov))
    },
    // C4 site: like setSpeed, but negative runs the road backwards (trails
    // flow the other way). For roads that follow the scroll in both directions.
    setVelocity(n) {
      speed = Number(n) || 0
    },
    // C4 site: arrival. Starts fast with a stretched view and settles over ms.
    // rampMs: build up to the boost first (a launch), then settle.
    // stretch: widen the view at the fast part (the home arrival does).
    arrive(ms = 1200, boost = 4, rampMs = 0, stretch = true) {
      if (destroyed || !built) return
      arrival = { t: 0, dur: Math.max(0.1, ms / 1000), boost, ramp: Math.max(0, rampMs / 1000), stretch }
      speedUpCur = rampMs > 0 ? 0 : boost
      if (stretch && !rampMs) camera.fov = o.fovSpeedUp
    },
    // C4 site: morph to one of the shapes in the morph option, over ms.
    morphTo(name, ms = 800) {
      const dm = built && built.distortion
      if (destroyed || !dm || !dm.names) return
      const i = dm.names.indexOf(name)
      if (i < 0) return
      const to = [0, 0, 0, 0]
      to[i] = 1
      dm.tween = { t: 0, dur: Math.max(0.05, ms / 1000), from: dm.w.slice(), to }
      if (!running) {
        for (let k = 0; k < 4; k++) dm.w[k] = to[k]
        dm.uniforms.uW.value.set(to[0], to[1], to[2], to[3])
        dm.tween = null
        renderStill()
      }
    },
    // C4 site: steering target, x and y from -1 to 1 (pointer position).
    setSteer(x, y) {
      steer.tx = Math.max(-1, Math.min(1, Number(x) || 0))
      steer.ty = Math.max(-1, Math.min(1, Number(y) || 0))
    },
    // C4 site: send the one-off car (needs the launchCar option).
    launchCar() {
      const lc = built && built.launch
      if (destroyed || !lc) return
      lc.run = 0
      lc.material.uniforms.uRun.value = 0
      lc.active = true
      lc.mesh.visible = true
    },
    // C4 site: draw the frame at effect time t (seconds). For still frames
    // and for side-by-side checks against the old hero.
    setTime(t) {
      if (destroyed) return
      elapsed = Math.max(0, Number(t) || 0)
      timeOffset = 0
      renderStill()
    },
    pause() { userPaused = true; sync() },
    resume() { userPaused = false; sync() },
    destroy() {
      if (destroyed) return
      destroyed = true
      sync()
      io.disconnect(); ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      if (mqReduce) mqReduce.removeEventListener ? mqReduce.removeEventListener('change', onMq) : mqReduce.removeListener(onMq)
      o.holdToSpeedUp = false; wirePointer()
      teardownScene()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}

// C4 site: exported, not attached to window.
const api = {
  version: '1.0.0',
  mount,
  get defaults() { return clone(DEFAULTS) },
  get themes() { return clone(THEMES) },
  get presets() { return presetsPublic() },
}

export { mount }
export default api
