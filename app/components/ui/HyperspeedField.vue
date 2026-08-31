<script setup lang="ts">
/**
 * Hyperspeed — light trails down a distorted road.
 *
 * Ported from the React Bits component. The effect, the distortion presets and
 * the shaders are the reference's; the lifecycle around them is not, for the
 * same reasons the liquid shader needed rewriting.
 *
 * WHAT CHANGED FROM THE REFERENCE
 * -------------------------------
 * 1. DEVICE PIXEL RATIO IS CAPPED. The reference calls
 *    `setPixelRatio(window.devicePixelRatio)`. This scene runs bloom and SMAA
 *    over a full-screen composer; at 3x that is nine times the fragment work
 *    of a 1x render. `ui-ux-pro-max --stack threejs` flags the uncapped call
 *    as a High-severity defect and specifies a cap of 2.
 *
 * 2. THE LOOP STOPS WHEN OFF SCREEN. The reference's `tick` runs forever via
 *    requestAnimationFrame. An IntersectionObserver pauses it once the hero
 *    scrolls away, and `visibilitychange` stops it in a background tab.
 *
 * 3. DEPENDENCIES LOAD DYNAMICALLY. `three` plus `postprocessing` is a large
 *    payload; both are fetched only after the capability gate passes, so a
 *    device that will not run the effect never downloads it.
 *
 * 4. CAPABILITY GATE AND FALLBACK. No WebGL, reduced motion, or Save-Data
 *    means the canvas never mounts and the CSS gradient beneath stands alone.
 *
 * 5. NO GLOBAL RESIZE LISTENER. The reference listens on `window`; this uses a
 *    ResizeObserver on its own element, so the hero reflowing for any reason
 *    (font swap, content change) is handled too.
 *
 * 6. BRAND COLOURS. The reference ships magenta and purple car lights. Those
 *    are the exact "AI gradient" palette the sector pattern lists as an
 *    anti-pattern. Cyan tail lights against white head lights is both on-brand
 *    and closer to what a real road looks like at night.
 */

interface Props {
  /** Which distortion preset drives the road and camera. */
  distortion?:
    | 'turbulentDistortion'
    | 'mountainDistortion'
    | 'xyDistortion'
    | 'LongRaceDistortion'
    | 'deepDistortion'
  /** Held below the reference's 90 so the road reads calmer behind text. */
  fov?: number
  /**
   * 'light' inverts the whole scene for a white page: white fog and road with
   * navy and cyan trails. 'dark' is the reference's night road.
   */
  theme?: 'light' | 'dark'
}

const props = withDefaults(defineProps<Props>(), {
  distortion: 'mountainDistortion',
  fov: 90,
  theme: 'light',
})

const container = ref<HTMLElement | null>(null)
const active = ref(false)
let cleanup: (() => void) | null = null

onMounted(async () => {
  const el = container.value
  if (!el) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const conn = (navigator as { connection?: { saveData?: boolean } }).connection
  if (conn?.saveData) return

  const probe = document.createElement('canvas')
  const glProbe = probe.getContext('webgl2') || probe.getContext('webgl')
  if (!glProbe) return
  glProbe.getExtension('WEBGL_lose_context')?.loseContext()

  let THREE: typeof import('three')
  let PP: typeof import('postprocessing')
  try {
    ;[THREE, PP] = await Promise.all([import('three'), import('postprocessing')])
  } catch {
    return
  }
  if (!container.value) return

  // ---------------------------------------------------------------- palette
  //
  // The reference is a night road: black fog, near-black tarmac, emissive
  // magenta and cyan trails. That only works on a dark page — on white the
  // road becomes a black slab and the trails stop reading as light.
  //
  // The light theme inverts the whole scene. Fog and road go white so the
  // geometry dissolves into the page instead of ending at a hard edge, and
  // the trails become navy and cyan, reading as coloured streaks drawn on
  // paper rather than lights in the dark.
  const isLight = props.theme === 'light'

  // PALETTE FOR A WHITE PAGE.
  //
  // Hyperspeed was authored for a dark environment, where white lines read as
  // emitted light. On white, white roads vanish, pale blue vanishes, and the
  // whole thing goes muddy — swapping only `background` to 0xffffff is the
  // usual mistake and it does not work.
  //
  // Instead every element is re-pitched against white: the tarmac becomes a
  // cool grey rather than near-black, the markings become mid greys with
  // enough separation to stay visible, and the two carriageways take the
  // brand blue and a darker blue so they read as ink rather than as light.
  const colors = isLight
    ? {
        background: 0xffffff,
        // Half a step darker than the first pass. At 0xe9eef4 on 0xffffff
        // the tarmac was within a couple of levels of the page and the road
        // had no readable shape at all — only the car lights showed, low in
        // the frame. These still read as "cool grey paper", not asphalt.
        roadColor: 0xdde6f0,
        islandColor: 0xd0dbe8,
        shoulderLines: 0xa9b7c7,
        brokenLines: 0xbcc9d8,
        // The near carriageway carries the accent, so it moved with it. On
        // white, amber trails read as light in a way the old cyan did not —
        // cyan at these values sat close to the cool grey tarmac and washed
        // out. The far carriageway stays indigo, which is the brand ground.
        leftCars: [0xf5a524, 0xf8b542, 0xfbc96a],
        rightCars: [0x1a3ab5, 0x152e8e, 0x102068],
        sticks: 0xf5a524,
      }
    : {
        roadColor: 0x0a1030,
        islandColor: 0x102068,
        background: 0x060a1c,
        shoulderLines: 0x2a4fd0,
        brokenLines: 0x2a4fd0,
        leftCars: [0xf8b542, 0xf5a524, 0xfbc96a],
        rightCars: [0xf4f7ff, 0xd8e2f7, 0xb9c4de],
        sticks: 0xf5a524,
      }

  const options = {
    length: 400,
    // Narrower road, fewer lanes, fewer lights, slower traffic. At the
    // reference's density this reads as busy; the point here is ambient
    // intelligence behind the copy, not a set piece competing with it.
    roadWidth: 6,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: props.fov,
    speedUp: 1.2,
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
    colors,
  }

  // ------------------------------------------------------------- distortion
  //
  // Two presets. `mountainDistortion` rolls the road in a long vertical swell
  // and is the calmer of the two — the right register behind body copy.
  // `turbulentDistortion` is the reference default and is busier.
  const nsin = (v: number) => Math.sin(v) * 0.5 + 0.5

  const mountainUniforms = {
    uFreq: { value: new THREE.Vector3(3, 6, 10) },
    uAmp: { value: new THREE.Vector3(30, 30, 20) },
  }

  const turbulentUniforms = {
    uFreq: { value: new THREE.Vector4(4, 8, 8, 1) },
    uAmp: { value: new THREE.Vector4(25, 5, 10, 10) },
  }

  const mountainDistortion = {
    uniforms: mountainUniforms,
    getDistortion: /* glsl */ `
      uniform vec3 uAmp;
      uniform vec3 uFreq;
      #define PI 3.14159265358979
      float nsin(float val){ return sin(val) * 0.5 + 0.5; }
      vec3 getDistortion(float progress){
        float movementProgressFix = 0.02;
        return vec3(
          cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
          nsin(progress * PI * uFreq.y + uTime) * uAmp.y - nsin(movementProgressFix * PI * uFreq.y + uTime) * uAmp.y,
          nsin(progress * PI * uFreq.z + uTime) * uAmp.z - nsin(movementProgressFix * PI * uFreq.z + uTime) * uAmp.z
        );
      }
    `,
    getJS: (progress: number, time: number) => {
      const fix = 0.02
      const f = mountainUniforms.uFreq.value
      const a = mountainUniforms.uAmp.value
      return new THREE.Vector3(
        Math.cos(progress * Math.PI * f.x + time) * a.x - Math.cos(fix * Math.PI * f.x + time) * a.x,
        nsin(progress * Math.PI * f.y + time) * a.y - nsin(fix * Math.PI * f.y + time) * a.y,
        nsin(progress * Math.PI * f.z + time) * a.z - nsin(fix * Math.PI * f.z + time) * a.z,
      )
        .multiply(new THREE.Vector3(2, 2, 2))
        .add(new THREE.Vector3(0, 0, -5))
    },
  }

  const turbulentDistortion = {
    uniforms: turbulentUniforms,
    getDistortion: /* glsl */ `
      uniform vec4 uFreq;
      uniform vec4 uAmp;
      float nsin(float val){ return sin(val) * 0.5 + 0.5; }
      #define PI 3.14159265358979
      float getDistortionX(float progress){
        return (
          cos(PI * progress * uFreq.r + uTime) * uAmp.r +
          pow(cos(PI * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2.) * uAmp.g
        );
      }
      float getDistortionY(float progress){
        return (
          -nsin(PI * progress * uFreq.b + uTime) * uAmp.b +
          -pow(nsin(PI * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.) * uAmp.a
        );
      }
      vec3 getDistortion(float progress){
        return vec3(
          getDistortionX(progress) - getDistortionX(0.0125),
          getDistortionY(progress) - getDistortionY(0.0125),
          0.
        );
      }
    `,
    getJS: (progress: number, time: number) => {
      const f = turbulentUniforms.uFreq.value
      const a = turbulentUniforms.uAmp.value
      const getX = (p: number) =>
        Math.cos(Math.PI * p * f.x + time) * a.x +
        Math.pow(Math.cos(Math.PI * p * f.y + time * (f.y / f.x)), 2) * a.y
      const getY = (p: number) =>
        -nsin(Math.PI * p * f.z + time) * a.z -
        Math.pow(nsin(Math.PI * p * f.w + time / (f.z / f.w)), 5) * a.w
      return new THREE.Vector3(
        getX(progress) - getX(progress + 0.007),
        getY(progress) - getY(progress + 0.007),
        0,
      )
        .multiply(new THREE.Vector3(-2, -5, 0))
        .add(new THREE.Vector3(0, 0, -10))
    },
  }

  const distortion =
    props.distortion === 'mountainDistortion' ? mountainDistortion : turbulentDistortion

  const random = (base: number | number[]) =>
    Array.isArray(base) ? Math.random() * (base[1]! - base[0]!) + base[0]! : Math.random() * base
  const pickRandom = <T,>(arr: T[] | T): T =>
    Array.isArray(arr) ? arr[Math.floor(Math.random() * arr.length)]! : arr

  // ----------------------------------------------------------------- setup
  const w = Math.max(1, el.clientWidth)
  const h = Math.max(1, el.clientHeight)

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
  // THE CAP. See note 1 at the top of this file.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.setSize(w, h, false)
  renderer.setClearColor(0x000000, 0)
  renderer.domElement.setAttribute('aria-hidden', 'true')
  el.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  scene.background = null
  const camera = new THREE.PerspectiveCamera(options.fov, w / h, 0.1, 10000)
  camera.position.set(0, 8, -5)

  const fog = new THREE.Fog(colors.background, options.length * 0.2, options.length * 500)
  scene.fog = fog
  const fogUniforms = {
    fogColor: { value: fog.color },
    fogNear: { value: fog.near },
    fogFar: { value: fog.far },
  }

  const composer = new PP.EffectComposer(renderer)
  composer.addPass(new PP.RenderPass(scene, camera))
  // Bloom only in the dark theme. On a white scene almost every pixel clears
  // a 0.2 luminance threshold, so bloom blows the whole frame out to flat
  // white — the effect disappears into the page rather than sitting on it.
  if (!isLight) {
    composer.addPass(
      new PP.EffectPass(
        camera,
        new PP.BloomEffect({ luminanceThreshold: 0.2, luminanceSmoothing: 0, resolutionScale: 1 }),
      ),
    )
  }
  composer.addPass(
    new PP.EffectPass(camera, new PP.SMAAEffect({ preset: PP.SMAAPreset.MEDIUM })),
  )

  const disposables: { dispose: () => void }[] = []

  const patch = (mat: import('three').ShaderMaterial) => {
    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        '#include <getDistortion_vertex>',
        distortion.getDistortion,
      )
    }
  }

  // ------------------------------------------------------------- car lights
  const carLightsVertex = /* glsl */ `
    #define USE_FOG;
    ${THREE.ShaderChunk.fog_pars_vertex}
    attribute vec3 aOffset;
    attribute vec3 aMetrics;
    attribute vec3 aColor;
    uniform float uTravelLength;
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vColor;
    #include <getDistortion_vertex>
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
      ${THREE.ShaderChunk.fog_vertex}
    }
  `

  const carLightsFragment = /* glsl */ `
    #define USE_FOG;
    ${THREE.ShaderChunk.fog_pars_fragment}
    varying vec3 vColor;
    varying vec2 vUv;
    uniform vec2 uFade;
    void main() {
      vec3 color = vec3(vColor);
      float alpha = smoothstep(uFade.x, uFade.y, vUv.x);
      gl_FragColor = vec4(color, alpha);
      if (gl_FragColor.a < 0.0001) discard;
      ${THREE.ShaderChunk.fog_fragment}
    }
  `

  function makeCarLights(carColors: number[], speed: number[], fade: InstanceType<typeof THREE.Vector2>, xPos: number) {
    const curve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1))
    const geometry = new THREE.TubeGeometry(curve, 40, 1, 8, false)
    const instanced = new THREE.InstancedBufferGeometry().copy(geometry as never)
    instanced.instanceCount = options.lightPairsPerRoadWay * 2

    const laneWidth = options.roadWidth / options.lanesPerRoad
    const aOffset: number[] = []
    const aMetrics: number[] = []
    const aColor: number[] = []
    const cols = carColors.map((c) => new THREE.Color(c))

    for (let i = 0; i < options.lightPairsPerRoadWay; i++) {
      const radius = random(options.carLightsRadius)
      const length = random(options.carLightsLength)
      const spd = random(speed)
      const carLane = i % options.lanesPerRoad
      let laneX = carLane * laneWidth - options.roadWidth / 2 + laneWidth / 2
      const carWidth = random(options.carWidthPercentage) * laneWidth
      laneX += random(options.carShiftX) * laneWidth
      const offsetY = random(options.carFloorSeparation) + radius * 1.3
      const offsetZ = -random(options.length)

      aOffset.push(laneX - carWidth / 2, offsetY, offsetZ)
      aOffset.push(laneX + carWidth / 2, offsetY, offsetZ)
      aMetrics.push(radius, length, spd, radius, length, spd)
      const c = pickRandom(cols)
      aColor.push(c.r, c.g, c.b, c.r, c.g, c.b)
    }

    instanced.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false))
    instanced.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3, false))
    instanced.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false))

    const material = new THREE.ShaderMaterial({
      fragmentShader: carLightsFragment,
      vertexShader: carLightsVertex,
      transparent: true,
      uniforms: Object.assign(
        { uTime: { value: 0 }, uTravelLength: { value: options.length }, uFade: { value: fade } },
        fogUniforms,
        distortion.uniforms,
      ),
    })
    patch(material)

    const mesh = new THREE.Mesh(instanced, material)
    mesh.frustumCulled = false
    mesh.position.setX(xPos)
    scene.add(mesh)
    disposables.push(instanced, material, geometry)
    return material
  }

  const leftLights = makeCarLights(
    colors.leftCars,
    options.movingAwaySpeed,
    new THREE.Vector2(0, 1 - options.carLightsFade),
    -options.roadWidth / 2 - options.islandWidth / 2,
  )
  const rightLights = makeCarLights(
    colors.rightCars,
    options.movingCloserSpeed,
    new THREE.Vector2(1, options.carLightsFade),
    options.roadWidth / 2 + options.islandWidth / 2,
  )

  // ----------------------------------------------------------------- sticks
  const sticksVertex = /* glsl */ `
    #define USE_FOG;
    ${THREE.ShaderChunk.fog_pars_vertex}
    attribute float aOffset;
    attribute vec3 aColor;
    attribute vec2 aMetrics;
    uniform float uTravelLength;
    uniform float uTime;
    varying vec3 vColor;
    mat4 rotationY(in float angle) {
      return mat4(cos(angle), 0, sin(angle), 0, 0, 1.0, 0, 0, -sin(angle), 0, cos(angle), 0, 0, 0, 0, 1);
    }
    #include <getDistortion_vertex>
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
      ${THREE.ShaderChunk.fog_vertex}
    }
  `

  const sticksFragment = /* glsl */ `
    #define USE_FOG;
    ${THREE.ShaderChunk.fog_pars_fragment}
    varying vec3 vColor;
    void main(){
      gl_FragColor = vec4(vec3(vColor), 1.);
      ${THREE.ShaderChunk.fog_fragment}
    }
  `

  const stickGeo = new THREE.PlaneGeometry(1, 1)
  const stickInstanced = new THREE.InstancedBufferGeometry().copy(stickGeo as never)
  const totalSticks = options.totalSideLightSticks
  stickInstanced.instanceCount = totalSticks
  {
    const stickoffset = options.length / (totalSticks - 1)
    const aOffset: number[] = []
    const aColor: number[] = []
    const aMetrics: number[] = []
    const stickColor = new THREE.Color(colors.sticks)
    for (let i = 0; i < totalSticks; i++) {
      aOffset.push((i - 1) * stickoffset * 2 + stickoffset * Math.random())
      aColor.push(stickColor.r, stickColor.g, stickColor.b)
      aMetrics.push(random(options.lightStickWidth), random(options.lightStickHeight))
    }
    stickInstanced.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 1, false))
    stickInstanced.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false))
    stickInstanced.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 2, false))
  }
  const stickMat = new THREE.ShaderMaterial({
    fragmentShader: sticksFragment,
    vertexShader: sticksVertex,
    side: THREE.DoubleSide,
    uniforms: Object.assign(
      { uTravelLength: { value: options.length }, uTime: { value: 0 } },
      fogUniforms,
      distortion.uniforms,
    ),
  })
  patch(stickMat)
  const stickMesh = new THREE.Mesh(stickInstanced, stickMat)
  stickMesh.frustumCulled = false
  stickMesh.position.setX(-(options.roadWidth + options.islandWidth / 2))
  scene.add(stickMesh)
  disposables.push(stickGeo, stickInstanced, stickMat)

  // ------------------------------------------------------------------- road
  const roadVertex = /* glsl */ `
    #define USE_FOG;
    uniform float uTime;
    ${THREE.ShaderChunk.fog_pars_vertex}
    uniform float uTravelLength;
    varying vec2 vUv;
    #include <getDistortion_vertex>
    void main() {
      vec3 transformed = position.xyz;
      vec3 distortion = getDistortion((transformed.y + uTravelLength / 2.) / uTravelLength);
      transformed.x += distortion.x;
      transformed.z += distortion.y;
      transformed.y += -1. * distortion.z;
      vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
      gl_Position = projectionMatrix * mvPosition;
      vUv = uv;
      ${THREE.ShaderChunk.fog_vertex}
    }
  `

  const roadMarkingsVars = /* glsl */ `
    uniform float uLanes;
    uniform vec3 uBrokenLinesColor;
    uniform vec3 uShoulderLinesColor;
    uniform float uShoulderLinesWidthPercentage;
    uniform float uBrokenLinesWidthPercentage;
    uniform float uBrokenLinesLengthPercentage;
  `

  const roadMarkingsFragment = /* glsl */ `
    uv.y = mod(uv.y + uTime * 0.05, 1.);
    float laneWidth = 1.0 / uLanes;
    float brokenLineWidth = laneWidth * uBrokenLinesWidthPercentage;
    float laneEmptySpace = 1. - uBrokenLinesLengthPercentage;
    float brokenLines = step(1.0 - brokenLineWidth, fract(uv.x * 2.0)) * step(laneEmptySpace, fract(uv.y * 10.0));
    float sideLines = step(1.0 - brokenLineWidth, fract((uv.x - laneWidth * (uLanes - 1.0)) * 2.0)) + step(brokenLineWidth, uv.x);
    brokenLines = mix(brokenLines, sideLines, uv.x);
    color = mix(color, uBrokenLinesColor, brokenLines);
  `

  const roadBase = /* glsl */ `
    #define USE_FOG;
    varying vec2 vUv;
    uniform vec3 uColor;
    uniform float uTime;
    #include <roadMarkings_vars>
    ${THREE.ShaderChunk.fog_pars_fragment}
    void main() {
      vec2 uv = vUv;
      vec3 color = vec3(uColor);
      #include <roadMarkings_fragment>
      gl_FragColor = vec4(color, 1.);
      ${THREE.ShaderChunk.fog_fragment}
    }
  `

  const roadFragment = roadBase
    .replace('#include <roadMarkings_fragment>', roadMarkingsFragment)
    .replace('#include <roadMarkings_vars>', roadMarkingsVars)
  const islandFragment = roadBase
    .replace('#include <roadMarkings_fragment>', '')
    .replace('#include <roadMarkings_vars>', '')

  const roadUTime = { value: 0 }

  function createPlane(side: number, isRoad: boolean) {
    const geometry = new THREE.PlaneGeometry(
      isRoad ? options.roadWidth : options.islandWidth,
      options.length,
      20,
      100,
    )
    let uniforms: Record<string, unknown> = {
      uTravelLength: { value: options.length },
      uColor: { value: new THREE.Color(isRoad ? colors.roadColor : colors.islandColor) },
      uTime: roadUTime,
    }
    if (isRoad) {
      uniforms = Object.assign(uniforms, {
        uLanes: { value: options.lanesPerRoad },
        uBrokenLinesColor: { value: new THREE.Color(colors.brokenLines) },
        uShoulderLinesColor: { value: new THREE.Color(colors.shoulderLines) },
        uShoulderLinesWidthPercentage: { value: options.shoulderLinesWidthPercentage },
        uBrokenLinesLengthPercentage: { value: options.brokenLinesLengthPercentage },
        uBrokenLinesWidthPercentage: { value: options.brokenLinesWidthPercentage },
      })
    }
    const material = new THREE.ShaderMaterial({
      fragmentShader: isRoad ? roadFragment : islandFragment,
      vertexShader: roadVertex,
      side: THREE.DoubleSide,
      uniforms: Object.assign(uniforms, fogUniforms, distortion.uniforms) as never,
    })
    patch(material)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.z = -options.length / 2
    mesh.position.x += (options.islandWidth / 2 + options.roadWidth / 2) * side
    scene.add(mesh)
    disposables.push(geometry, material)
  }

  createPlane(-1, true)
  createPlane(1, true)
  createPlane(0, false)

  // ------------------------------------------------------------------ loop
  const clock = new THREE.Clock()

  const render = () => {
    const delta = clock.getDelta()
    const time = clock.elapsedTime

    leftLights.uniforms.uTime!.value = time
    rightLights.uniforms.uTime!.value = time
    stickMat.uniforms.uTime!.value = time
    roadUTime.value = time

    const d = distortion.getJS(0.025, time)
    camera.lookAt(camera.position.x + d.x, camera.position.y + d.y, camera.position.z + d.z)
    camera.updateProjectionMatrix()

    composer.render(delta)
  }

  let running = false
  const start = () => {
    if (running) return
    running = true
    renderer.setAnimationLoop(render)
  }
  const stop = () => {
    running = false
    renderer.setAnimationLoop(null)
  }

  const resize = () => {
    const cw = el.clientWidth
    const ch = el.clientHeight
    if (!cw || !ch) return
    renderer.setSize(cw, ch, false)
    camera.aspect = cw / ch
    camera.updateProjectionMatrix()
    composer.setSize(cw, ch)
  }
  const ro = new ResizeObserver(resize)
  ro.observe(el)
  resize()

  const io = new IntersectionObserver(
    ([entry]) => (entry?.isIntersecting ? start() : stop()),
    { rootMargin: '0px 0px -10% 0px' },
  )
  io.observe(el)

  const onVisibility = () => (document.hidden ? stop() : start())
  document.addEventListener('visibilitychange', onVisibility)

  active.value = true

  cleanup = () => {
    io.disconnect()
    ro.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    stop()
    scene.clear()
    for (const d of disposables) d.dispose()
    composer.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.domElement.remove()
  }
})

onBeforeUnmount(() => {
  cleanup?.()
  cleanup = null
})
</script>

<template>
  <div
    ref="container"
    class="hyper"
    :class="{ 'hyper--active': active, 'hyper--dark': theme === 'dark' }"
    aria-hidden="true"
  />
</template>

<style scoped>
.hyper {
  position: absolute;
  inset: 0;
  overflow: hidden;
  /* The fallback is the design, not a placeholder: if the effect never mounts
     the hero keeps a soft cyan wash where the road would have been, so the
     composition holds and only the movement is missing. */
  background: transparent;
}

.hyper--dark {
  background: var(--grad-abyss);
}

.hyper :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity var(--dur-slow) var(--ease-out);
}

.hyper--active :deep(canvas) {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .hyper :deep(canvas) { transition: none; }
}
</style>
