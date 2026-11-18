/**
 * Checks that a road never loops or folds back on itself on screen.
 *
 * For each road, at every moment from 0 to 120 s (every 0.05 s), it traces
 * the road's centreline exactly as the shader bends it, aims the camera as
 * the road does, and projects the line onto a 1440 × 700 screen. Going away
 * from the camera, a well-behaved road only ever climbs the screen towards
 * the horizon. If it comes back down, it has folded or looped. The worst
 * fold, in screen pixels, is reported for each road.
 *
 * Usage: node scripts/check-road-folds.mjs [roadName ...]
 */
import { PerspectiveCamera, Vector3 } from 'three'
import { presets } from '../app/lib/hyperspeed/presets.js'

// The same values as app/lib/hyperspeed/roads.ts (kept in step by hand).
const ROADS = {
  'sector-maritime': { distortion: 'turbulentDistortion', uniforms: { uAmp: [15, 4, 2, 0] } },
  'sector-oil-gas': { distortion: 'deepDistortion', uniforms: { uAmp: [10, 3] } },
  'sector-logistics': { distortion: 'LongRaceDistortion', uniforms: { uAmp: [35, 1.5] } },
  'sector-supply-chain': { distortion: 'xyDistortion', uniforms: { uAmp: [12, 2] } },
  service: { distortion: 'mountainDistortion', uniforms: { uAmp: [20, 2, 8] } },
  case: { distortion: 'LongRaceDistortion', uniforms: { uAmp: [24, 1.5] } },
  contact: { distortion: 'deepDistortion', uniforms: { uAmp: [8, 3] } },
  strip: { distortion: 'LongRaceDistortion', uniforms: { uAmp: [20, 1.5] } },
  deliver: { distortion: 'turbulentDistortion', uniforms: { uAmp: [14, 3, 2, 0] } },
  closing: { distortion: 'mountainDistortion', uniforms: { uAmp: [22, 2, 8] } },
  notfound: { distortion: 'deepDistortion', uniforms: { uAmp: [10, 3] } },
  // Launch experiment: fixed camera behind the road, pointing up the screen.
  'demo-rise': { distortion: 'LongRaceDistortion', uniforms: { uAmp: [3, 0] }, fixedCamera: { position: [0, 16, -8], target: [0, 0, -46] }, size: [760, 640] },
  // Spine (straight, seen from above) cannot fold: no bends at all.
  // The home hero is exempt (kept exactly as the live road), so not listed.
}
// Allow a candidate as JSON: node check-road-folds.mjs '{"distortion":"turbulentDistortion","uniforms":{"uAmp":[10,2,3,3]}}'

const nsin = (v) => Math.sin(v) * 0.5 + 0.5
const PI = Math.PI

// The road shader's getDistortion(progress), per preset, in JavaScript.
const SHADER = {
  mountainDistortion(p, t, u) {
    const f = u.uFreq, a = u.uAmp, fix = 0.02
    return [
      Math.cos(p * PI * f[0] + t) * a[0] - Math.cos(fix * PI * f[0] + t) * a[0],
      nsin(p * PI * f[1] + t) * a[1] - nsin(fix * PI * f[1] + t) * a[1],
      nsin(p * PI * f[2] + t) * a[2] - nsin(fix * PI * f[2] + t) * a[2],
    ]
  },
  turbulentDistortion(p, t, u) {
    const f = u.uFreq, a = u.uAmp
    const X = (q) => Math.cos(PI * q * f[0] + t) * a[0] + Math.pow(Math.cos(PI * q * f[1] + t * (f[1] / f[0])), 2) * a[1]
    const Y = (q) => -nsin(PI * q * f[2] + t) * a[2] - Math.pow(nsin(PI * q * f[3] + t / (f[2] / f[3])), 5) * a[3]
    return [X(p) - X(0.0125), Y(p) - Y(0.0125), 0]
  },
  xyDistortion(p, t, u) {
    const f = u.uFreq, a = u.uAmp, fix = 0.02
    return [
      Math.cos(p * PI * f[0] + t) * a[0] - Math.cos(fix * PI * f[0] + t) * a[0],
      Math.sin(p * PI * f[1] + PI / 2 + t) * a[1] - Math.sin(fix * PI * f[1] + PI / 2 + t) * a[1],
      0,
    ]
  },
  LongRaceDistortion(p, t, u) {
    const f = u.uFreq, a = u.uAmp, c = 0.0125
    return [
      Math.sin(p * PI * f[0] + t) * a[0] - Math.sin(c * PI * f[0] + t) * a[0],
      Math.sin(p * PI * f[1] + t) * a[1] - Math.sin(c * PI * f[1] + t) * a[1],
      0,
    ]
  },
  deepDistortion(p, t, u) {
    const f = u.uFreq, a = u.uAmp, py = u.uPowY
    const X = (q) => Math.sin(q * PI * f[0] + t) * a[0]
    const Y = (q) => Math.pow(Math.abs(q * py[0]), py[1]) + Math.sin(q * PI * f[1] + t) * a[1]
    return [X(p) - X(0.02), Y(p) - Y(0.02), 0]
  },
}

const L = 400 // road length
let W = 1440, H = 700

export function worstFold(def, { tMax = 120, dt = 0.05, times = null } = {}) {
  const preset = presets[def.distortion]
  const u = { ...JSON.parse(JSON.stringify(preset.uniforms)), ...(def.uniforms || {}) }
  if (def.size) { W = def.size[0]; H = def.size[1] }
  const cam = new PerspectiveCamera(90, W / H, 0.1, 10000)
  // A road with a fixed camera (fixedCamera in roads.ts) is checked from it.
  const fc = def.fixedCamera
  const pos = fc ? new Vector3(...fc.position) : new Vector3(0, 8, -5)
  const v = new Vector3()
  let worst = { px: 0, t: 0 }
  const ts = times || Array.from({ length: Math.floor(tMax / dt) + 1 }, (_, i) => i * dt)
  for (const t of ts) {
    // Aim the camera exactly as the road does.
    cam.position.copy(pos)
    cam.rotation.set(0, 0, 0)
    if (fc) {
      cam.lookAt(...fc.target)
    } else {
      const d = preset.js(0.025, t, u)
      cam.lookAt(
        pos.x + d[0] * preset.lookAtAmp[0] + preset.lookAtOffset[0],
        pos.y + d[1] * preset.lookAtAmp[1] + preset.lookAtOffset[1],
        pos.z + d[2] * preset.lookAtAmp[2] + preset.lookAtOffset[2],
      )
    }
    cam.updateMatrixWorld()
    cam.updateProjectionMatrix()
    // Walk the centreline away from the camera; track how far it ever drops
    // back below the highest point it has reached on screen.
    let top = -Infinity
    for (let p = 0; p <= 1; p += 0.002) {
      const s = SHADER[def.distortion](p, t, u)
      v.set(s[0], s[1], -p * L + s[2])
      const camSpace = v.clone().applyMatrix4(cam.matrixWorldInverse)
      if (camSpace.z > -1) continue // behind or right at the camera
      v.project(cam)
      if (Math.abs(v.x) > 1.3 || v.y < -1.3) { continue } // off screen
      const y = (v.y + 1) * 0.5 * H // pixels up from the bottom
      if (y > top) top = y
      const drop = top - y
      if (drop > worst.px && top <= H * 1.15) worst = { px: drop, t }
    }
  }
  return worst
}

if (process.argv[1] && process.argv[1].endsWith('check-road-folds.mjs')) {
  const args = process.argv.slice(2)
  const jobs = args.length
    ? args.map((a) => (a.startsWith('{') ? ['candidate', JSON.parse(a)] : [a, ROADS[a]]))
    : Object.entries(ROADS)
  for (const [name, def] of jobs) {
    const w = worstFold(def)
    const verdict = w.px <= 2 ? 'no folds' : `FOLDS: up to ${w.px.toFixed(0)} px (at ${w.t.toFixed(2)} s)`
    console.log(`${name.padEnd(20)} ${verdict}`)
  }
}
