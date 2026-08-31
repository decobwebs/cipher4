<script setup lang="ts">
/**
 * Ray-marched nebula background.
 *
 * Ported from the React reference implementation. The GLSL is unchanged — the
 * look is exactly the reference. Everything around it was rewritten, because
 * the reference is a demo and this has to survive a mid-range Android phone on
 * a bad connection, which is most of this site's audience.
 *
 * WHAT CHANGED FROM THE REFERENCE, AND WHY
 * ----------------------------------------
 * 1. DEVICE PIXEL RATIO IS CAPPED.
 *    The reference calls `setPixelRatio(window.devicePixelRatio)`. This is a
 *    per-pixel ray-marcher: six marching steps, each with sin/log calls, for
 *    every fragment. On a 3× phone that is nine times the fragment work of a
 *    1× render, for a diffuse cloud where nobody can see the difference. The
 *    cap is the single most important line in this file.
 *
 * 2. THE LOOP STOPS WHEN THE HERO IS OFF SCREEN.
 *    `setAnimationLoop` in the reference runs forever. Scrolled past the hero,
 *    that is a GPU-saturating animation nobody is looking at, draining battery
 *    for the whole visit. An IntersectionObserver pauses and resumes it.
 *
 * 3. THREE IS LOADED DYNAMICALLY.
 *    A static import puts ~150KB gzip of Three into the entry bundle, on every
 *    page, including the ones with no shader. The dynamic import gives it its
 *    own chunk that is fetched only when this component decides it will
 *    actually render — after the capability gate below has passed.
 *
 * 4. THERE IS A CAPABILITY GATE AND A REAL FALLBACK.
 *    No WebGL, reduced motion, or Save-Data means the canvas never mounts and
 *    Three is never downloaded. The CSS gradient underneath is not a
 *    degraded state — it is the design, and the shader is an enhancement on
 *    top of it. This is what keeps the hero honest on a weak device.
 *
 * 5. `iMouse` IS ACTUALLY USED.
 *    The reference declares the uniform, wires a mousemove listener, and then
 *    never reads it in the fragment shader — the "interactive" in its name was
 *    aspirational. Here it applies a small parallax to the sample coordinate,
 *    so the nebula drifts against the pointer. Desktop only; it is skipped
 *    entirely where there is no fine pointer.
 */

interface Props {
  /**
   * signal — navy through cyan. The brand reading and the default.
   * deep   — the same palette held back, for quieter bands.
   * ember  — the one warm variant. Not used on the hero; kept for a future
   *          alert or incident context where warm actually means something.
   */
  variant?: 'signal' | 'deep' | 'ember'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'signal',
})

const container = ref<HTMLElement | null>(null)
const active = ref(false)

let cleanup: (() => void) | null = null

onMounted(async () => {
  const el = container.value
  if (!el) return

  // --- Capability gate --------------------------------------------------
  // Any failure here is a normal outcome, not an error. The gradient stays.

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // Save-Data is an explicit request not to spend the user's money on
  // decoration. A 150KB shader library is exactly that.
  const conn = (navigator as { connection?: { saveData?: boolean } }).connection
  if (conn?.saveData) return

  // A cheap probe, disposed immediately. Creating the real renderer just to
  // discover WebGL is missing would already have cost the download.
  const probe = document.createElement('canvas')
  const gl = probe.getContext('webgl2') || probe.getContext('webgl')
  if (!gl) return
  gl.getExtension('WEBGL_lose_context')?.loseContext()

  let THREE: typeof import('three')
  try {
    THREE = await import('three')
  } catch {
    // Chunk failed to load — offline, blocked, or a bad cache. The gradient
    // is already on screen, so there is nothing to report to the user.
    return
  }

  // The component may have unmounted during the await.
  if (!container.value) return

  // --- Renderer ---------------------------------------------------------

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })

  // The cap. 1.75 keeps the cloud smooth on a high-density display while
  // holding fragment work to roughly a third of what an uncapped 3× would
  // cost. Antialiasing is off for the same reason — there are no edges in a
  // diffuse nebula for it to smooth.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  // Fully transparent clear, so only the cloud is drawn.
  renderer.setClearColor(0x000000, 0)
  renderer.domElement.setAttribute('aria-hidden', 'true')
  el.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const clock = new THREE.Clock()

  const vertexShader = /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `

  const fragmentShader = /* glsl */ `
    precision mediump float;
    uniform vec2  iResolution;
    uniform float iTime;
    uniform vec2  iMouse;
    uniform vec2  uFocus;
    uniform float uIntensity;
    uniform float uAlpha;
    uniform float uEdge;
    uniform float uContrast;
    uniform float uPivot;
    uniform int   uVariant;
    varying vec2 vUv;

    // ---------------------------------------------------------------------
    // This is the reference shader's ray-march, unchanged in structure and
    // unchanged in palette. Three things were added, all of them about
    // definition rather than colour:
    //
    //   uEdge      how tightly density falls off at a surface. The reference
    //              uses 2.5, which is a wide, soft falloff — that softness is
    //              what reads as haze. Lower values pull the boundary in and
    //              the cloud gains form.
    //   uContrast  an S-curve on the accumulated colour, so midtones separate
    //              instead of averaging toward flat grey.
    //   uAlpha     the cloud composites onto the white page rather than
    //              painting its own black ground.
    //
    // Deliberately NOT added: extra octaves, higher march counts, or any
    // sharpening that works by adding detail. Detail is what made the
    // previous attempt read as noise and hurt to look at. Definition here
    // comes from contrast between broad shapes, which is restful.
    // ---------------------------------------------------------------------

    #define t iTime

    mat2 m(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

    float map(vec3 p) {
      p.xz *= m(t * 0.4);
      p.xy *= m(t * 0.3);
      vec3 q = p * 2.0 + t;
      return length(p + vec3(sin(t * 0.7))) * log(length(p) + 1.0)
           + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
    }

    void main() {
      float minRes = min(iResolution.x, iResolution.y);
      vec2 fragCoord = vUv * iResolution;
      vec2 uv = fragCoord / minRes - (iResolution * uFocus) / minRes;

      uv += iMouse * 0.05;

      vec3 col = vec3(0.0);
      float d = 2.5;

      for (int i = 0; i <= 5; i++) {
        vec3 p = vec3(0.0, 0.0, 5.0) + normalize(vec3(uv, -1.0)) * d;
        float rz = map(p);
        float f = clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);

        // The reference palettes, exactly as written.
        vec3 base;
        if (uVariant == 1) {
          base = vec3(0.05, 0.2, 0.5) + vec3(4.0, 2.0, 5.0) * f;
        } else if (uVariant == 2) {
          base = vec3(0.05, 0.3, 0.1) + vec3(2.0, 5.0, 1.0) * f;
        } else {
          base = vec3(0.1, 0.3, 0.4) + vec3(5.0, 2.5, 3.0) * f;
        }

        // uEdge replaces the reference's fixed 2.5. This one number is the
        // difference between haze and form.
        col = col * base + smoothstep(uEdge, 0.0, rz) * 0.7 * base;
        d += min(rz, 1.0);
      }

      col *= uIntensity;

      // Roll off the highlights so the densest cores do not clip to flat
      // white, which would erase exactly the structure we just sharpened.
      col = col / (col + vec3(0.9));

      // Separate the midtones. The pivot has to sit near where the cloud's
      // values actually land, not at the middle of the range — the marched
      // result is mostly dark, so pivoting at 0.5 pushes almost all of it
      // below zero and the clamp erases the cloud entirely.
      col = clamp((col - uPivot) * uContrast + uPivot, 0.0, 1.0);

      // Composite onto the page instead of painting a ground: luminance
      // becomes alpha, so the white shows through the thin parts and the
      // cloud has real edges against it.
      float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
      float a = clamp(lum * 1.7, 0.0, 1.0) * uAlpha;

      // Falls off toward the frame edge so there is never a hard canvas seam.
      float vignette = smoothstep(1.45, 0.2, length(uv * vec2(0.8, 1.0)));

      gl_FragColor = vec4(col, a * vignette);
    }
  `

  const variantIndex = { signal: 0, deep: 1, ember: 2 }[props.variant] ?? 0

  const uniforms = {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector2() },
    iMouse: { value: new THREE.Vector2() },
    // Where the cloud sits, as a fraction of the element. Set per aspect
    // ratio in resize() below.
    uFocus: { value: new THREE.Vector2(0.5, 0.5) },
    // Overall exposure.
    uIntensity: { value: 2.9 },
    // Opacity ceiling. A contrast control, not a style one — raising it past
    // ~0.8 starts eating into text legibility on the white page.
    uAlpha: { value: 0.82 },
    // Density falloff width. The reference is 2.5 (soft haze); lower is
    // sharper. Below about 0.8 the cloud starts to band.
    uEdge: { value: 1.25 },
    // Midtone separation. 1.0 is the reference's flat response.
    uContrast: { value: 1.5 },
    // Where the S-curve pivots. Near the cloud's own mean, not mid-grey.
    uPivot: { value: 0.26 },
    uVariant: { value: variantIndex },
  }

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    // The shader writes alpha now, so the page shows through the cloud.
    transparent: true,
  })
  const geometry = new THREE.PlaneGeometry(2, 2)
  scene.add(new THREE.Mesh(geometry, material))

  // --- Sizing -----------------------------------------------------------
  // ResizeObserver rather than a window listener: the hero can change height
  // without the window doing so — the panel cluster reflowing, a font
  // swapping in — and a window listener misses all of it.

  const resize = () => {
    const w = el.clientWidth
    const h = el.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    uniforms.iResolution.value.set(w, h)

    // Landscape: the hero is a two-column layout with copy on the left, so
    // push the lobe right into the open space behind the glass panels.
    // Portrait: the layout stacks and there is no open side — recentre, and
    // sit it slightly high so it reads behind the headline rather than under
    // the buttons.
    const landscape = w / h > 1.1
    uniforms.uFocus.value.set(landscape ? 0.68 : 0.5, landscape ? 0.5 : 0.42)
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(el)
  resize()

  // --- Pointer parallax (desktop only) ----------------------------------

  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  let onPointerMove: ((e: PointerEvent) => void) | null = null

  if (fine) {
    onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const rect = el.getBoundingClientRect()
      // Normalised to roughly -0.5..0.5 across the element, so the parallax
      // is symmetric about the centre regardless of hero size.
      uniforms.iMouse.value.set(
        (e.clientX - rect.left) / rect.width - 0.5,
        0.5 - (e.clientY - rect.top) / rect.height,
      )
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
  }

  // --- Render loop, gated on visibility ---------------------------------

  const render = () => {
    uniforms.iTime.value = clock.getElapsedTime()
    renderer.render(scene, camera)
  }

  const visibility = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        renderer.setAnimationLoop(render)
      } else {
        renderer.setAnimationLoop(null)
      }
    },
    // A small negative margin so the loop stops just after the hero leaves,
    // not while a sliver is still visible at the top of the viewport.
    { rootMargin: '0px 0px -10% 0px' },
  )
  visibility.observe(el)

  // Tab in the background: the browser throttles rAF, but not on every
  // platform and not immediately. Stopping explicitly is free.
  const onVisibilityChange = () => {
    if (document.hidden) renderer.setAnimationLoop(null)
    else renderer.setAnimationLoop(render)
  }
  document.addEventListener('visibilitychange', onVisibilityChange)

  active.value = true

  cleanup = () => {
    visibility.disconnect()
    resizeObserver.disconnect()
    document.removeEventListener('visibilitychange', onVisibilityChange)
    if (onPointerMove) window.removeEventListener('pointermove', onPointerMove)
    renderer.setAnimationLoop(null)
    geometry.dispose()
    material.dispose()
    renderer.dispose()
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
    class="nebula"
    :class="{ 'nebula--active': active }"
    aria-hidden="true"
  />
</template>

<style scoped>
.nebula {
  position: absolute;
  inset: 0;
  overflow: hidden;
  /* The fallback is the design, not a placeholder. If the shader never mounts
     — no WebGL, reduced motion, Save-Data, a failed chunk — this is what is
     left, and it has to look finished on its own.
     A soft cyan wash in the same place the ink would drift, so the composition
     holds and only the movement is missing. */
  background:
    radial-gradient(55rem 40rem at 72% 42%, rgba(245, 165, 36, 0.16), transparent 62%),
    radial-gradient(40rem 34rem at 88% 78%, rgba(29, 44, 107, 0.12), transparent 65%);
}

.nebula :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
  /* Fades in once the first frame is on screen, so there is no hard cut from
     gradient to shader. */
  opacity: 0;
  transition: opacity var(--dur-slow) var(--ease-out);
}

.nebula--active :deep(canvas) {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .nebula :deep(canvas) { transition: none; }
}
</style>
