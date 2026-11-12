import * as THREE from 'three';

/**
 * The pilot's helmet, seen from inside it (the jet's GoPro view, which sits at the eyes): the
 * last thing the picture passes through, because it is the closest thing to the eye.
 *
 * Everything here is a few centimetres from the eye, so nothing of it is ever in focus: the shell
 * and the mask are only soft dark shapes at the edges of the view, and the visor is felt rather
 * than seen, through what it does to the light.
 *
 *   shell        the brow of the helmet across the top (dipping lower at the corners, where the
 *                shell comes round the temples) and its sides at the far left and right: dark
 *                padded lining, with a little of the cockpit's light leaking onto it
 *   mask         the oxygen mask's upper edge, a broad dark rubber mound low in the middle of the
 *                view, its top rim catching the light
 *   visor        a light smoke tint over the whole opening; its lower edge crosses the view above
 *                the mask as a curved line, where the image steps slightly (refraction through the
 *                polished edge) with a faint colour fringe; below it the view is clear
 *   reflections  the visor's inside surface mirrors the bright scene faintly, flipped and blurred
 *                (a ghost of the sky and the displays at the upper corners), and a broad soft arc
 *                of sky sheen runs across its top
 *   smudges      fingerprints and wiped streaks on the visor, invisible in shade, lit up when the
 *                Sun is in front
 */
export const HelmetShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uAspect: { value: 1 },
    uOn: { value: 0 },
    uSun: { value: new THREE.Vector3(0.5, 0.5, 0) },
    uTime: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uAspect;
    uniform float uOn;
    uniform vec3 uSun;
    uniform float uTime;
    varying vec2 vUv;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
    }
    float fbm(vec2 p) { return noise(p) * 0.55 + noise(p * 2.1 + 3.7) * 0.3 + noise(p * 4.3 + 9.1) * 0.15; }
    vec3 blurAt(vec2 uv, float r) {
      vec3 c = vec3(0.0);
      c += texture2D(tDiffuse, uv).rgb;
      c += texture2D(tDiffuse, uv + vec2(r, 0.0)).rgb;
      c += texture2D(tDiffuse, uv - vec2(r, 0.0)).rgb;
      c += texture2D(tDiffuse, uv + vec2(0.0, r)).rgb;
      c += texture2D(tDiffuse, uv - vec2(0.0, r)).rgb;
      c += texture2D(tDiffuse, uv + vec2(r, r) * 0.7).rgb;
      c += texture2D(tDiffuse, uv - vec2(r, r) * 0.7).rgb;
      c += texture2D(tDiffuse, uv + vec2(r, -r) * 0.7).rgb;
      c += texture2D(tDiffuse, uv - vec2(r, -r) * 0.7).rgb;
      return c / 9.0;
    }

    void main() {
      vec3 scene = texture2D(tDiffuse, vUv).rgb;
      if (uOn < 0.001) { gl_FragColor = vec4(scene, 1.0); return; }
      // Centred, height 1 (y -0.5..0.5), x scaled by the aspect
      vec2 p = vUv - 0.5;
      p.x *= uAspect;
      float halfW = 0.5 * uAspect;
      float xn = p.x / halfW; // -1..1 across

      // How bright the world is, roughly (the lining and mask are lit by it)
      // (three taps: the same for every pixel, so kept cheap)
      vec3 amb = (texture2D(tDiffuse, vec2(0.5, 0.62)).rgb + texture2D(tDiffuse, vec2(0.25, 0.5)).rgb + texture2D(tDiffuse, vec2(0.75, 0.5)).rgb) / 3.0;
      float ambL = dot(amb, vec3(0.2126, 0.7152, 0.0722));

      // --- The visor's lower edge: a gentle curve across the lower view, rising at the sides
      // (a few centimetres from the eye: never a crisp line, a soft step in the light)
      float edgeY = -0.37 + 0.06 * xn * xn;
      float dEdge = p.y - edgeY;
      float aboveEdge = smoothstep(-0.016, 0.016, dEdge);
      // Refraction at the polished edge: the image steps up a little just above it, with fringes
      float lens = exp(-abs(dEdge) * 55.0);
      vec2 off = vec2(0.0, 0.004 * lens * sign(dEdge));
      vec3 col;
      col.r = texture2D(tDiffuse, vUv + off * 1.25).r;
      col.g = texture2D(tDiffuse, vUv + off).g;
      col.b = texture2D(tDiffuse, vUv + off * 0.75).b;
      // The edge itself: a thin bright line of polished polycarbonate, brighter where it is lit
      float edgeLine = exp(-pow(dEdge / 0.009, 2.0));
      col += edgeLine * (0.008 + 0.05 * ambL) * vec3(0.9, 0.95, 1.0);

      // Visor tint (light smoke, a touch cool) over everything above the edge
      col = mix(col, col * vec3(0.84, 0.87, 0.9), aboveEdge);

      // Inner-surface reflection: the bright scene, flipped and blurred, faint, strongest at the
      // upper corners where the visor curves round
      float reflMask = aboveEdge * smoothstep(0.05, 0.75, abs(xn)) * smoothstep(-0.1, 0.4, p.y);
      if (reflMask > 0.01) {
        vec2 ruv = vec2(1.0 - vUv.x, 1.15 - vUv.y * 0.6);
        col += blurAt(clamp(ruv, 0.0, 1.0), 0.03) * 0.06 * reflMask;
      }
      // Sky sheen: a broad soft arc across the visor's top
      float arc = length(vec2(p.x * 0.55, p.y + 0.55)) - 0.92;
      col += vec3(0.75, 0.85, 1.0) * exp(-arc * arc / 0.004) * 0.035 * (0.3 + ambL) * aboveEdge;

      // Smudges and wiped streaks, lit only when the Sun is in front
      if (uSun.z > 0.002) {
        vec2 sp = (uSun.xy - 0.5) * vec2(uAspect, 1.0);
        float r = length(p - sp);
        float smudge = smoothstep(0.55, 0.85, fbm(p * 6.0 + 4.3)) + 0.5 * smoothstep(0.6, 0.9, fbm(vec2(p.x * 22.0 + p.y * 9.0, p.y * 3.0)));
        col += vec3(1.0, 0.95, 0.86) * smudge * uSun.z * exp(-r * 3.2) * 0.22 * aboveEdge;
        // Haze round the Sun from the visor coating
        col += vec3(1.0, 0.94, 0.84) * uSun.z * exp(-r * 4.0) * 0.06 * aboveEdge;
      }

      // --- The helmet shell: brow across the top, dipping at the corners; sides at the far edges
      float n = fbm(vec2(xn * 3.0, p.y * 3.0) + 1.3);
      float browY = 0.485 - 0.15 * pow(abs(xn), 2.4) + 0.01 * (n - 0.5);
      float brow = smoothstep(browY - 0.06, browY + 0.03, p.y);
      // The cheek pads: the shell's sides only come into view low at the corners
      float sideX = 1.0 - 0.04 - 0.16 * pow(max(0.0, -p.y - 0.05) * 2.2, 1.6);
      float sides = smoothstep(sideX - 0.07, sideX + 0.05, abs(xn)) * smoothstep(0.05, -0.2, p.y);
      // The mask: a broad rounded mound low in the middle
      float moundY = -0.5 + 0.15 * exp(-pow(xn / 0.36, 2.0)) + 0.008 * (n - 0.5);
      float mask = 1.0 - smoothstep(moundY - 0.05, moundY + 0.04, p.y);
      // Lit lining and rubber: dark, warm-grey, with the world's light leaking in
      vec3 lining = vec3(0.022, 0.021, 0.02) + amb * 0.05 + vec3(0.012, 0.01, 0.008) * n;
      // Olive-grey rubber with its moulded grain
      vec3 rubber = vec3(0.03, 0.033, 0.028) * (0.85 + 0.3 * fbm(p * 40.0)) + amb * 0.045;
      // The mask's top rim catches the light: a soft highlight just under its edge
      float rimHi = exp(-pow((p.y - (moundY - 0.025)) / 0.02, 2.0)) * exp(-pow(xn / 0.5, 2.0));
      rubber += rimHi * (0.04 + 0.2 * ambL) * vec3(0.9, 0.95, 1.0);
      // Out of focus: the world bleeds a little into the near edges
      vec3 bleed = brow + sides + mask > 0.01 ? blurAt(vUv, 0.025) * 0.12 : vec3(0.0);
      // The visor's housing under the brow: a defocused, faintly lit band (the shell's edge)
      float housing = exp(-pow((p.y - (browY - 0.045)) / 0.016, 2.0)) * (1.0 - brow);
      col += housing * (0.02 + 0.07 * ambL) * vec3(0.85, 0.9, 0.95) * uOn;
      // Long curved glints on the visor's outside: it bends round the face, so bright sky
      // reflects as soft streaks near its upper corners
      for (int i = 0; i < 2; i++) {
        float sgn = i == 0 ? -1.0 : 1.0;
        vec2 q = vec2(p.x * sgn, p.y);
        float arcD = abs(length((q - vec2(halfW * 0.15, -0.65)) * vec2(0.8, 1.0)) - 1.02);
        float along = smoothstep(halfW * 0.25, halfW * 0.55, q.x) * smoothstep(halfW * 0.98, halfW * 0.7, q.x);
        col += vec3(0.85, 0.92, 1.0) * exp(-arcD * arcD / 0.00006) * along * (0.025 + 0.09 * ambL) * (i == 0 ? 1.0 : 0.55) * aboveEdge * uOn;
      }
      float shell = max(brow, sides);
      col = mix(col, lining + bleed * 0.6, shell * uOn);
      col = mix(col, rubber + bleed * 0.4, mask * uOn);
      // A soft falloff from the helmet's edge inward (its shadow on the eye's field)
      float near = max(max(smoothstep(browY - 0.2, browY, p.y), smoothstep(sideX - 0.32, sideX, abs(xn))), 1.0 - smoothstep(moundY, moundY + 0.12, p.y));
      col *= 1.0 - 0.18 * near * (1.0 - max(shell, mask)) * uOn;

      gl_FragColor = vec4(mix(scene, col, uOn), 1.0);
    }
  `,
};
