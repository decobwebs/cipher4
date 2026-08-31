<script setup lang="ts">
/**
 * SplashCursor — a fluid simulation that trails the pointer.
 *
 * Ported from the React Bits component. The simulation is the reference's,
 * unchanged: advection, curl, vorticity, a Jacobi pressure solve, and a
 * gradient subtract, run over ping-ponged framebuffers.
 *
 * WHAT CHANGED, AND WHY IT MATTERS HERE
 * -------------------------------------
 * This is the most expensive thing on the site by a wide margin — a full
 * Navier-Stokes solve every frame, forever, on every page. The reference's
 * defaults are built for a demo page, not a company site with a performance
 * budget, so the gating is not optional decoration:
 *
 * 1. DESKTOP ONLY. It never initialises without a fine pointer. On a phone
 *    there is no cursor to trail, so the entire cost would buy nothing.
 *
 * 2. RESOLUTION IS CUT HARD. The reference dyes at 1440 and simulates at 128.
 *    At 1440 the dye texture alone is ~8MB of GPU memory and the fill cost
 *    dominates. 512 / 96 is visually indistinguishable for a soft trail.
 *
 * 3. IT STOPS WHEN THE TAB IS HIDDEN. The reference's rAF runs regardless.
 *
 * 4. NO RAINBOW. `RAINBOW_MODE` defaults to true upstream, cycling random
 *    hues — which is both off-brand and precisely the "AI gradient" look the
 *    sector pattern lists as an anti-pattern. This uses Signal Cyan with a
 *    small hue jitter so repeated strokes are not flat.
 *
 * 5. IT SITS BELOW THE HEADER. The reference pins itself at z-index 50, the
 *    same layer as this site's header, so the two would fight. It renders
 *    beneath all chrome and is `pointer-events: none` throughout.
 *
 * 6. REDUCED MOTION AND SAVE-DATA DISABLE IT ENTIRELY.
 */

interface Props {
  /** Base colour of the trail. Defaults to Signal Cyan. */
  color?: string
  simResolution?: number
  dyeResolution?: number
  densityDissipation?: number
  velocityDissipation?: number
  pressure?: number
  pressureIterations?: number
  curl?: number
  splatRadius?: number
  splatForce?: number
}

const props = withDefaults(defineProps<Props>(), {
  color: '#f5a524',
  simResolution: 96,
  dyeResolution: 512,
  densityDissipation: 3.8,
  velocityDissipation: 2.2,
  pressure: 0.1,
  pressureIterations: 16,
  curl: 2.4,
  splatRadius: 0.18,
  splatForce: 5200,
})

const canvas = ref<HTMLCanvasElement | null>(null)
let cleanup: (() => void) | null = null

onMounted(() => {
  const el = canvas.value
  if (!el) return

  // --- Gates. Any failure is a normal outcome; the page simply has no trail.
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const conn = (navigator as { connection?: { saveData?: boolean } }).connection
  if (conn?.saveData) return

  const params = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
  }
  const gl2 = el.getContext('webgl2', params) as WebGL2RenderingContext | null
  const gl = (gl2 ?? el.getContext('webgl', params)) as WebGLRenderingContext | null
  if (!gl) return
  const isWebGL2 = !!gl2

  let halfFloat: OES_texture_half_float | null = null
  let supportLinearFiltering: unknown = null
  if (isWebGL2) {
    gl.getExtension('EXT_color_buffer_float')
    supportLinearFiltering = gl.getExtension('OES_texture_float_linear')
  } else {
    halfFloat = gl.getExtension('OES_texture_half_float')
    supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear')
  }
  gl.clearColor(0, 0, 0, 0)

  const g = gl as unknown as Record<string, number> & WebGL2RenderingContext
  const halfFloatTexType = isWebGL2 ? g.HALF_FLOAT : halfFloat?.HALF_FLOAT_OES

  function supportRenderTextureFormat(internalFormat: number, format: number, type: number) {
    const tex = gl!.createTexture()
    gl!.bindTexture(gl!.TEXTURE_2D, tex)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.NEAREST)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.NEAREST)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
    gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null)
    const fbo = gl!.createFramebuffer()
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo)
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0)
    return gl!.checkFramebufferStatus(gl!.FRAMEBUFFER) === gl!.FRAMEBUFFER_COMPLETE
  }

  function getSupportedFormat(internalFormat: number, format: number, type: number): { internalFormat: number; format: number } | null {
    if (!supportRenderTextureFormat(internalFormat, format, type)) {
      if (internalFormat === g.R16F) return getSupportedFormat(g.RG16F, g.RG, type)
      if (internalFormat === g.RG16F) return getSupportedFormat(g.RGBA16F, gl!.RGBA, type)
      return null
    }
    return { internalFormat, format }
  }

  const formatRGBA = isWebGL2
    ? getSupportedFormat(g.RGBA16F, gl.RGBA, halfFloatTexType!)
    : getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType!)
  const formatRG = isWebGL2
    ? getSupportedFormat(g.RG16F, g.RG, halfFloatTexType!)
    : getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType!)
  const formatR = isWebGL2
    ? getSupportedFormat(g.R16F, g.RED, halfFloatTexType!)
    : getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType!)

  if (!formatRGBA || !formatRG || !formatR) return

  // --- shaders ----------------------------------------------------------
  function compile(type: number, source: string, keywords?: string[]) {
    let src = source
    if (keywords) src = keywords.map((k) => `#define ${k}\n`).join('') + source
    const sh = gl!.createShader(type)!
    gl!.shaderSource(sh, src)
    gl!.compileShader(sh)
    return sh
  }

  const baseVertex = compile(gl.VERTEX_SHADER, `
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
    uniform vec2 texelSize;
    void main () {
      vUv = aPosition * 0.5 + 0.5;
      vL = vUv - vec2(texelSize.x, 0.0);
      vR = vUv + vec2(texelSize.x, 0.0);
      vT = vUv + vec2(0.0, texelSize.y);
      vB = vUv - vec2(0.0, texelSize.y);
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `)

  const copyFrag = compile(gl.FRAGMENT_SHADER, `
    precision mediump float; precision mediump sampler2D;
    varying highp vec2 vUv; uniform sampler2D uTexture;
    void main () { gl_FragColor = texture2D(uTexture, vUv); }
  `)

  const clearFrag = compile(gl.FRAGMENT_SHADER, `
    precision mediump float; precision mediump sampler2D;
    varying highp vec2 vUv; uniform sampler2D uTexture; uniform float value;
    void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
  `)

  const displayFrag = compile(gl.FRAGMENT_SHADER, `
    precision highp float; precision highp sampler2D;
    varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
    uniform sampler2D uTexture; uniform vec2 texelSize;
    void main () {
      vec3 c = texture2D(uTexture, vUv).rgb;
      vec3 lc = texture2D(uTexture, vL).rgb;
      vec3 rc = texture2D(uTexture, vR).rgb;
      vec3 tc = texture2D(uTexture, vT).rgb;
      vec3 bc = texture2D(uTexture, vB).rgb;
      float dx = length(rc) - length(lc);
      float dy = length(tc) - length(bc);
      vec3 n = normalize(vec3(dx, dy, length(texelSize)));
      float diffuse = clamp(dot(n, vec3(0.0, 0.0, 1.0)) + 0.7, 0.7, 1.0);
      c *= diffuse;
      float a = max(c.r, max(c.g, c.b));
      gl_FragColor = vec4(c, a);
    }
  `)

  const splatFrag = compile(gl.FRAGMENT_SHADER, `
    precision highp float; precision highp sampler2D;
    varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio;
    uniform vec3 color; uniform vec2 point; uniform float radius;
    void main () {
      vec2 p = vUv - point.xy; p.x *= aspectRatio;
      vec3 splat = exp(-dot(p, p) / radius) * color;
      gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + splat, 1.0);
    }
  `)

  const advectionFrag = compile(gl.FRAGMENT_SHADER, `
    precision highp float; precision highp sampler2D;
    varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource;
    uniform vec2 texelSize; uniform vec2 dyeTexelSize; uniform float dt; uniform float dissipation;
    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
      vec2 st = uv / tsize - 0.5; vec2 iuv = floor(st); vec2 fuv = fract(st);
      vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
      vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
      vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
      vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
      return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
    }
    void main () {
      #ifdef MANUAL_FILTERING
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        vec4 result = bilerp(uSource, coord, dyeTexelSize);
      #else
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
      #endif
      gl_FragColor = result / (1.0 + dissipation * dt);
    }
  `, supportLinearFiltering ? undefined : ['MANUAL_FILTERING'])

  const divergenceFrag = compile(gl.FRAGMENT_SHADER, `
    precision mediump float; precision mediump sampler2D;
    varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
    uniform sampler2D uVelocity;
    void main () {
      float L = texture2D(uVelocity, vL).x; float R = texture2D(uVelocity, vR).x;
      float T = texture2D(uVelocity, vT).y; float B = texture2D(uVelocity, vB).y;
      vec2 C = texture2D(uVelocity, vUv).xy;
      if (vL.x < 0.0) { L = -C.x; } if (vR.x > 1.0) { R = -C.x; }
      if (vT.y > 1.0) { T = -C.y; } if (vB.y < 0.0) { B = -C.y; }
      gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
    }
  `)

  const curlFrag = compile(gl.FRAGMENT_SHADER, `
    precision mediump float; precision mediump sampler2D;
    varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
    uniform sampler2D uVelocity;
    void main () {
      float L = texture2D(uVelocity, vL).y; float R = texture2D(uVelocity, vR).y;
      float T = texture2D(uVelocity, vT).x; float B = texture2D(uVelocity, vB).x;
      gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
    }
  `)

  const vorticityFrag = compile(gl.FRAGMENT_SHADER, `
    precision highp float; precision highp sampler2D;
    varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
    uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
    void main () {
      float L = texture2D(uCurl, vL).x; float R = texture2D(uCurl, vR).x;
      float T = texture2D(uCurl, vT).x; float B = texture2D(uCurl, vB).x;
      float C = texture2D(uCurl, vUv).x;
      vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
      force /= length(force) + 0.0001; force *= curl * C; force.y *= -1.0;
      vec2 velocity = texture2D(uVelocity, vUv).xy + force * dt;
      gl_FragColor = vec4(min(max(velocity, -1000.0), 1000.0), 0.0, 1.0);
    }
  `)

  const pressureFrag = compile(gl.FRAGMENT_SHADER, `
    precision mediump float; precision mediump sampler2D;
    varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
    uniform sampler2D uPressure; uniform sampler2D uDivergence;
    void main () {
      float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
      float divergence = texture2D(uDivergence, vUv).x;
      gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
    }
  `)

  const gradientFrag = compile(gl.FRAGMENT_SHADER, `
    precision mediump float; precision mediump sampler2D;
    varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
    uniform sampler2D uPressure; uniform sampler2D uVelocity;
    void main () {
      float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
      vec2 velocity = texture2D(uVelocity, vUv).xy - vec2(R - L, T - B);
      gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
  `)

  type Uniforms = Record<string, WebGLUniformLocation | null>
  function createProgram(vs: WebGLShader, fs: WebGLShader) {
    const program = gl!.createProgram()!
    gl!.attachShader(program, vs)
    gl!.attachShader(program, fs)
    gl!.linkProgram(program)
    const uniforms: Uniforms = {}
    const count = gl!.getProgramParameter(program, gl!.ACTIVE_UNIFORMS)
    for (let i = 0; i < count; i++) {
      const name = gl!.getActiveUniform(program, i)!.name
      uniforms[name] = gl!.getUniformLocation(program, name)
    }
    return { program, uniforms, bind: () => gl!.useProgram(program) }
  }

  const copyP = createProgram(baseVertex, copyFrag)
  const clearP = createProgram(baseVertex, clearFrag)
  const splatP = createProgram(baseVertex, splatFrag)
  const advectionP = createProgram(baseVertex, advectionFrag)
  const divergenceP = createProgram(baseVertex, divergenceFrag)
  const curlP = createProgram(baseVertex, curlFrag)
  const vorticityP = createProgram(baseVertex, vorticityFrag)
  const pressureP = createProgram(baseVertex, pressureFrag)
  const gradientP = createProgram(baseVertex, gradientFrag)
  const displayP = createProgram(baseVertex, displayFrag)

  const quadBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)
  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(0)

  type FBO = ReturnType<typeof createFBO>
  function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
    gl!.activeTexture(gl!.TEXTURE0)
    const texture = gl!.createTexture()!
    gl!.bindTexture(gl!.TEXTURE_2D, texture)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, param)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, param)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
    gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)
    const fbo = gl!.createFramebuffer()!
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo)
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0)
    gl!.viewport(0, 0, w, h)
    gl!.clear(gl!.COLOR_BUFFER_BIT)
    return {
      texture, fbo, width: w, height: h,
      texelSizeX: 1 / w, texelSizeY: 1 / h,
      attach(id: number) {
        gl!.activeTexture(gl!.TEXTURE0 + id)
        gl!.bindTexture(gl!.TEXTURE_2D, texture)
        return id
      },
    }
  }

  function createDoubleFBO(w: number, h: number, iF: number, f: number, t: number, p: number) {
    let fbo1 = createFBO(w, h, iF, f, t, p)
    let fbo2 = createFBO(w, h, iF, f, t, p)
    return {
      width: w, height: h, texelSizeX: fbo1.texelSizeX, texelSizeY: fbo1.texelSizeY,
      get read() { return fbo1 }, set read(v: FBO) { fbo1 = v },
      get write() { return fbo2 }, set write(v: FBO) { fbo2 = v },
      swap() { const t2 = fbo1; fbo1 = fbo2; fbo2 = t2 },
    }
  }

  function blit(target: FBO | null) {
    if (!target) {
      gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight)
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null)
    } else {
      gl!.viewport(0, 0, target.width, target.height)
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo)
    }
    gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0)
  }

  function getResolution(resolution: number) {
    let aspect = gl!.drawingBufferWidth / gl!.drawingBufferHeight
    if (aspect < 1) aspect = 1 / aspect
    const min = Math.round(resolution)
    const max = Math.round(resolution * aspect)
    return gl!.drawingBufferWidth > gl!.drawingBufferHeight
      ? { width: max, height: min }
      : { width: min, height: max }
  }

  let dye: ReturnType<typeof createDoubleFBO>
  let velocity: ReturnType<typeof createDoubleFBO>
  let divergence: FBO, curlFBO: FBO, pressureFBO: ReturnType<typeof createDoubleFBO>

  function initFramebuffers() {
    const simRes = getResolution(props.simResolution)
    const dyeRes = getResolution(props.dyeResolution)
    const filtering = supportLinearFiltering ? gl!.LINEAR : gl!.NEAREST
    gl!.disable(gl!.BLEND)
    dye = createDoubleFBO(dyeRes.width, dyeRes.height, formatRGBA!.internalFormat, formatRGBA!.format, halfFloatTexType!, filtering)
    velocity = createDoubleFBO(simRes.width, simRes.height, formatRG!.internalFormat, formatRG!.format, halfFloatTexType!, filtering)
    divergence = createFBO(simRes.width, simRes.height, formatR!.internalFormat, formatR!.format, halfFloatTexType!, gl!.NEAREST)
    curlFBO = createFBO(simRes.width, simRes.height, formatR!.internalFormat, formatR!.format, halfFloatTexType!, gl!.NEAREST)
    pressureFBO = createDoubleFBO(simRes.width, simRes.height, formatR!.internalFormat, formatR!.format, halfFloatTexType!, gl!.NEAREST)
  }

  // Brand colour with a small hue jitter, so repeated strokes are not flat.
  // Upstream cycles random hues; that is off-brand and reads as noise.
  function hexToRgb(hex: string) {
    const v = hex.replace('#', '')
    return {
      r: parseInt(v.slice(0, 2), 16) / 255,
      g: parseInt(v.slice(2, 4), 16) / 255,
      b: parseInt(v.slice(4, 6), 16) / 255,
    }
  }
  const base = hexToRgb(props.color)
  function trailColor() {
    const j = 0.85 + Math.random() * 0.3
    return { r: base.r * 0.16 * j, g: base.g * 0.16 * j, b: base.b * 0.16 * j }
  }

  const pointer = {
    texcoordX: 0, texcoordY: 0, prevX: 0, prevY: 0,
    deltaX: 0, deltaY: 0, moved: false, color: trailColor(),
  }

  function resizeCanvas() {
    // DPR capped at 1.5: this is a full-screen fill-bound effect and every
    // extra pixel is another full simulation sample.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const w = Math.floor(el!.clientWidth * dpr)
    const h = Math.floor(el!.clientHeight * dpr)
    if (el!.width !== w || el!.height !== h) {
      el!.width = w
      el!.height = h
      return true
    }
    return false
  }

  function splat(x: number, y: number, dx: number, dy: number, color: { r: number; g: number; b: number }) {
    splatP.bind()
    gl!.uniform1i(splatP.uniforms.uTarget!, velocity.read.attach(0))
    gl!.uniform1f(splatP.uniforms.aspectRatio!, el!.width / el!.height)
    gl!.uniform2f(splatP.uniforms.point!, x, y)
    gl!.uniform3f(splatP.uniforms.color!, dx, dy, 0)
    let radius = props.splatRadius / 100
    const aspect = el!.width / el!.height
    if (aspect > 1) radius *= aspect
    gl!.uniform1f(splatP.uniforms.radius!, radius)
    blit(velocity.write)
    velocity.swap()

    gl!.uniform1i(splatP.uniforms.uTarget!, dye.read.attach(0))
    gl!.uniform3f(splatP.uniforms.color!, color.r, color.g, color.b)
    blit(dye.write)
    dye.swap()
  }

  function step(dt: number) {
    gl!.disable(gl!.BLEND)

    curlP.bind()
    gl!.uniform2f(curlP.uniforms.texelSize!, velocity.texelSizeX, velocity.texelSizeY)
    gl!.uniform1i(curlP.uniforms.uVelocity!, velocity.read.attach(0))
    blit(curlFBO)

    vorticityP.bind()
    gl!.uniform2f(vorticityP.uniforms.texelSize!, velocity.texelSizeX, velocity.texelSizeY)
    gl!.uniform1i(vorticityP.uniforms.uVelocity!, velocity.read.attach(0))
    gl!.uniform1i(vorticityP.uniforms.uCurl!, curlFBO.attach(1))
    gl!.uniform1f(vorticityP.uniforms.curl!, props.curl)
    gl!.uniform1f(vorticityP.uniforms.dt!, dt)
    blit(velocity.write); velocity.swap()

    divergenceP.bind()
    gl!.uniform2f(divergenceP.uniforms.texelSize!, velocity.texelSizeX, velocity.texelSizeY)
    gl!.uniform1i(divergenceP.uniforms.uVelocity!, velocity.read.attach(0))
    blit(divergence)

    clearP.bind()
    gl!.uniform1i(clearP.uniforms.uTexture!, pressureFBO.read.attach(0))
    gl!.uniform1f(clearP.uniforms.value!, props.pressure)
    blit(pressureFBO.write); pressureFBO.swap()

    pressureP.bind()
    gl!.uniform2f(pressureP.uniforms.texelSize!, velocity.texelSizeX, velocity.texelSizeY)
    gl!.uniform1i(pressureP.uniforms.uDivergence!, divergence.attach(0))
    for (let i = 0; i < props.pressureIterations; i++) {
      gl!.uniform1i(pressureP.uniforms.uPressure!, pressureFBO.read.attach(1))
      blit(pressureFBO.write); pressureFBO.swap()
    }

    gradientP.bind()
    gl!.uniform2f(gradientP.uniforms.texelSize!, velocity.texelSizeX, velocity.texelSizeY)
    gl!.uniform1i(gradientP.uniforms.uPressure!, pressureFBO.read.attach(0))
    gl!.uniform1i(gradientP.uniforms.uVelocity!, velocity.read.attach(1))
    blit(velocity.write); velocity.swap()

    advectionP.bind()
    gl!.uniform2f(advectionP.uniforms.texelSize!, velocity.texelSizeX, velocity.texelSizeY)
    if (!supportLinearFiltering) gl!.uniform2f(advectionP.uniforms.dyeTexelSize!, velocity.texelSizeX, velocity.texelSizeY)
    const vId = velocity.read.attach(0)
    gl!.uniform1i(advectionP.uniforms.uVelocity!, vId)
    gl!.uniform1i(advectionP.uniforms.uSource!, vId)
    gl!.uniform1f(advectionP.uniforms.dt!, dt)
    gl!.uniform1f(advectionP.uniforms.dissipation!, props.velocityDissipation)
    blit(velocity.write); velocity.swap()

    if (!supportLinearFiltering) gl!.uniform2f(advectionP.uniforms.dyeTexelSize!, dye.texelSizeX, dye.texelSizeY)
    gl!.uniform1i(advectionP.uniforms.uVelocity!, velocity.read.attach(0))
    gl!.uniform1i(advectionP.uniforms.uSource!, dye.read.attach(1))
    gl!.uniform1f(advectionP.uniforms.dissipation!, props.densityDissipation)
    blit(dye.write); dye.swap()
  }

  function render() {
    gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA)
    gl!.enable(gl!.BLEND)
    displayP.bind()
    gl!.uniform2f(displayP.uniforms.texelSize!, 1 / gl!.drawingBufferWidth, 1 / gl!.drawingBufferHeight)
    gl!.uniform1i(displayP.uniforms.uTexture!, dye.read.attach(0))
    blit(null)
  }

  resizeCanvas()
  initFramebuffers()

  let last = Date.now()
  let raf = 0
  let running = false

  function frame() {
    const now = Date.now()
    const dt = Math.min((now - last) / 1000, 0.016666)
    last = now
    if (resizeCanvas()) initFramebuffers()
    if (pointer.moved) {
      pointer.moved = false
      splat(pointer.texcoordX, pointer.texcoordY, pointer.deltaX * props.splatForce, pointer.deltaY * props.splatForce, pointer.color)
    }
    step(dt)
    render()
    raf = requestAnimationFrame(frame)
  }

  function start() { if (running) return; running = true; last = Date.now(); raf = requestAnimationFrame(frame) }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0 }

  function onPointerMove(e: PointerEvent) {
    if (e.pointerType === 'touch') return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const x = e.clientX * dpr
    const y = e.clientY * dpr
    pointer.prevX = pointer.texcoordX
    pointer.prevY = pointer.texcoordY
    pointer.texcoordX = x / el!.width
    pointer.texcoordY = 1 - y / el!.height
    let dx = pointer.texcoordX - pointer.prevX
    let dy = pointer.texcoordY - pointer.prevY
    const aspect = el!.width / el!.height
    if (aspect < 1) dx *= aspect
    if (aspect > 1) dy /= aspect
    pointer.deltaX = dx
    pointer.deltaY = dy
    pointer.moved = Math.abs(dx) > 0 || Math.abs(dy) > 0
    pointer.color = trailColor()
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  const onVisibility = () => (document.hidden ? stop() : start())
  document.addEventListener('visibilitychange', onVisibility)
  start()

  cleanup = () => {
    stop()
    window.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('visibilitychange', onVisibility)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
})

onBeforeUnmount(() => {
  cleanup?.()
  cleanup = null
})
</script>

<template>
  <div class="splash no-print" aria-hidden="true">
    <canvas ref="canvas" class="splash__canvas" />
  </div>
</template>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  /* BELOW the header and every overlay. The reference pins itself at z-index
     50, which is this site's header layer — the two would fight for stacking
     and the trail would paint over the navigation. */
  z-index: 1;
  pointer-events: none;
}

.splash__canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* Belt and braces: even if the component somehow mounts, the effect is never
   shown to a user who has asked for less motion. */
@media (prefers-reduced-motion: reduce) {
  .splash { display: none; }
}
</style>
