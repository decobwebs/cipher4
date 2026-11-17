// Distortion presets.
//
// GLSL and camera maths are copied verbatim from the live port
// (original/app/components/ui/HyperspeedField.vue) where it implements them,
// and from the React Bits reference it was ported from
// (reference/Hyperspeed.react-bits-1b252c1.jsx) for the rest.
//
// `source` records which file each preset came from:
//   'live'            implemented in HyperspeedField.vue
//   'react-bits'      named in HyperspeedField.vue's props, but the live port
//                     does NOT implement it; it silently falls back to
//                     turbulentDistortion there. Taken from the reference.
//   'react-bits-only' present in the reference, not named in the live port.

export const presets = {
  mountainDistortion: {
    source: 'live',
    uniforms: { uFreq: [3, 6, 10], uAmp: [30, 30, 20] },
    lookAtAmp: [2, 2, 2],
    lookAtOffset: [0, 0, -5],
    glsl: `
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
    js(p, t, u) {
      const fix = 0.02, f = u.uFreq, a = u.uAmp
      const nsin = (v) => Math.sin(v) * 0.5 + 0.5
      return [
        Math.cos(p * Math.PI * f[0] + t) * a[0] - Math.cos(fix * Math.PI * f[0] + t) * a[0],
        nsin(p * Math.PI * f[1] + t) * a[1] - nsin(fix * Math.PI * f[1] + t) * a[1],
        nsin(p * Math.PI * f[2] + t) * a[2] - nsin(fix * Math.PI * f[2] + t) * a[2],
      ]
    },
  },

  turbulentDistortion: {
    source: 'live',
    uniforms: { uFreq: [4, 8, 8, 1], uAmp: [25, 5, 10, 10] },
    lookAtAmp: [-2, -5, 0],
    lookAtOffset: [0, 0, -10],
    glsl: `
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
    js(p, t, u) {
      const f = u.uFreq, a = u.uAmp
      const nsin = (v) => Math.sin(v) * 0.5 + 0.5
      const gx = (q) => Math.cos(Math.PI * q * f[0] + t) * a[0] + Math.pow(Math.cos(Math.PI * q * f[1] + t * (f[1] / f[0])), 2) * a[1]
      const gy = (q) => -nsin(Math.PI * q * f[2] + t) * a[2] - Math.pow(nsin(Math.PI * q * f[3] + t / (f[2] / f[3])), 5) * a[3]
      return [gx(p) - gx(p + 0.007), gy(p) - gy(p + 0.007), 0]
    },
  },

  xyDistortion: {
    source: 'react-bits',
    uniforms: { uFreq: [5, 2], uAmp: [25, 15] },
    lookAtAmp: [2, 0.4, 1],
    lookAtOffset: [0, 0, -3],
    glsl: `
      uniform vec2 uFreq;
      uniform vec2 uAmp;
      #define PI 3.14159265358979
      vec3 getDistortion(float progress){
        float movementProgressFix = 0.02;
        return vec3(
          cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
          sin(progress * PI * uFreq.y + PI/2. + uTime) * uAmp.y - sin(movementProgressFix * PI * uFreq.y + PI/2. + uTime) * uAmp.y,
          0.
        );
      }
    `,
    js(p, t, u) {
      const fix = 0.02, f = u.uFreq, a = u.uAmp
      return [
        Math.cos(p * Math.PI * f[0] + t) * a[0] - Math.cos(fix * Math.PI * f[0] + t) * a[0],
        Math.sin(p * Math.PI * f[1] + t + Math.PI / 2) * a[1] - Math.sin(fix * Math.PI * f[1] + t + Math.PI / 2) * a[1],
        0,
      ]
    },
  },

  LongRaceDistortion: {
    source: 'react-bits',
    uniforms: { uFreq: [2, 3], uAmp: [35, 10] },
    lookAtAmp: [1, 1, 0],
    lookAtOffset: [0, 0, -5],
    glsl: `
      uniform vec2 uFreq;
      uniform vec2 uAmp;
      #define PI 3.14159265358979
      vec3 getDistortion(float progress){
        float camProgress = 0.0125;
        return vec3(
          sin(progress * PI * uFreq.x + uTime) * uAmp.x - sin(camProgress * PI * uFreq.x + uTime) * uAmp.x,
          sin(progress * PI * uFreq.y + uTime) * uAmp.y - sin(camProgress * PI * uFreq.y + uTime) * uAmp.y,
          0.
        );
      }
    `,
    js(p, t, u) {
      const c = 0.0125, f = u.uFreq, a = u.uAmp
      return [
        Math.sin(p * Math.PI * f[0] + t) * a[0] - Math.sin(c * Math.PI * f[0] + t) * a[0],
        Math.sin(p * Math.PI * f[1] + t) * a[1] - Math.sin(c * Math.PI * f[1] + t) * a[1],
        0,
      ]
    },
  },

  deepDistortion: {
    source: 'react-bits',
    uniforms: { uFreq: [4, 8], uAmp: [10, 20], uPowY: [20, 2] },
    lookAtAmp: [-2, -4, 0],
    lookAtOffset: [0, 0, -10],
    // The reference declares uFreq/uAmp as vec4 while feeding 2-component
    // values; kept as written. Only .x and .y are read.
    glsl: `
      uniform vec4 uFreq;
      uniform vec4 uAmp;
      uniform vec2 uPowY;
      float nsin(float val){ return sin(val) * 0.5 + 0.5; }
      #define PI 3.14159265358979
      float getDistortionX(float progress){
        return ( sin(progress * PI * uFreq.x + uTime) * uAmp.x );
      }
      float getDistortionY(float progress){
        return ( pow(abs(progress * uPowY.x), uPowY.y) + sin(progress * PI * uFreq.y + uTime) * uAmp.y );
      }
      vec3 getDistortion(float progress){
        return vec3(
          getDistortionX(progress) - getDistortionX(0.02),
          getDistortionY(progress) - getDistortionY(0.02),
          0.
        );
      }
    `,
    js(p, t, u) {
      const f = u.uFreq, a = u.uAmp, py = u.uPowY
      const gx = (q) => Math.sin(q * Math.PI * f[0] + t) * a[0]
      const gy = (q) => Math.pow(q * py[0], py[1]) + Math.sin(q * Math.PI * f[1] + t) * a[1]
      return [gx(p) - gx(p + 0.01), gy(p) - gy(p + 0.01), 0]
    },
  },

  turbulentDistortionStill: {
    source: 'react-bits-only',
    uniforms: { uFreq: [4, 8, 8, 1], uAmp: [25, 5, 10, 10] },
    lookAtAmp: null, // no camera function in the reference: camera is not steered
    lookAtOffset: null,
    glsl: `
      uniform vec4 uFreq;
      uniform vec4 uAmp;
      float nsin(float val){ return sin(val) * 0.5 + 0.5; }
      #define PI 3.14159265358979
      float getDistortionX(float progress){
        return (
          cos(PI * progress * uFreq.r) * uAmp.r +
          pow(cos(PI * progress * uFreq.g * (uFreq.g / uFreq.r)), 2. ) * uAmp.g
        );
      }
      float getDistortionY(float progress){
        return (
          -nsin(PI * progress * uFreq.b) * uAmp.b +
          -pow(nsin(PI * progress * uFreq.a / (uFreq.b / uFreq.a)), 5.) * uAmp.a
        );
      }
      vec3 getDistortion(float progress){
        return vec3(
          getDistortionX(progress) - getDistortionX(0.02),
          getDistortionY(progress) - getDistortionY(0.02),
          0.
        );
      }
    `,
    js: null,
  },

  deepDistortionStill: {
    source: 'react-bits-only',
    uniforms: { uFreq: [4, 8], uAmp: [10, 20], uPowY: [20, 2] },
    lookAtAmp: null,
    lookAtOffset: null,
    glsl: `
      uniform vec4 uFreq;
      uniform vec4 uAmp;
      uniform vec2 uPowY;
      float nsin(float val){ return sin(val) * 0.5 + 0.5; }
      #define PI 3.14159265358979
      float getDistortionX(float progress){
        return ( sin(progress * PI * uFreq.x) * uAmp.x * 2. );
      }
      float getDistortionY(float progress){
        return ( pow(abs(progress * uPowY.x), uPowY.y) + sin(progress * PI * uFreq.y) * uAmp.y );
      }
      vec3 getDistortion(float progress){
        return vec3(
          getDistortionX(progress) - getDistortionX(0.02),
          getDistortionY(progress) - getDistortionY(0.05),
          0.
        );
      }
    `,
    js: null,
  },
}
