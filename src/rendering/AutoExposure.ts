import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';

/**
 * A camera's metering and a film's grade, for flight.
 *
 * AutoExposurePass meters the world (it runs before the cockpit is drawn, so the cockpit never
 * counts) the way an action camera does: the log-average brightness of the frame, with the open
 * sky (nothing in the depth buffer) counted at 30% and the lower, ground half a little extra. It
 * eases towards that over about 1.2 s and scales the world by key / average, within 0.6-1.6x:
 * pitch up into a bright sky and the ground and cockpit sink, roll towards the ground and they lift.
 * All on the GPU: a 64 x 64 log-luminance map, its mip chain down to one pixel, and a 1 x 1 target
 * that carries the adapted value from frame to frame.
 *
 * ColorGradeShader runs after the tone curve, in display space: a split tone (shadows towards
 * teal, highlights towards warm orange), a gentle contrast S-curve and a touch of saturation.
 */

const quadVert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const lumFrag = /* glsl */ `
uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(tDiffuse, vUv).rgb;
  float l = max(dot(c, vec3(0.2126, 0.7152, 0.0722)), 1e-4);
  float sky = step(0.9999999, texture2D(tDepth, vUv).x);
  // Weights: sky 30%, the lower half (the ground ahead) a little more
  float w = mix(1.0, 0.3, sky) * (1.0 + 0.3 * step(vUv.y, 0.45));
  gl_FragColor = vec4(log(l) * w, w, 0.0, 1.0);
}`;

const adaptFrag = /* glsl */ `
uniform sampler2D tLum;
uniform sampler2D tPrev;
uniform float uBlend;
uniform float uLevel;
varying vec2 vUv;
void main() {
  vec2 s = textureLod(tLum, vec2(0.5), uLevel).rg;
  float avg = exp(s.x / max(s.y, 1e-4));
  float prev = texture2D(tPrev, vec2(0.5)).r;
  float a = prev > 0.0 ? mix(prev, avg, uBlend) : avg;
  gl_FragColor = vec4(a, 0.0, 0.0, 1.0);
}`;

const applyFrag = /* glsl */ `
uniform sampler2D tDiffuse;
uniform sampler2D tAdapted;
uniform float uKey;
uniform float uMin;
uniform float uMax;
uniform float uAmount;
varying vec2 vUv;
void main() {
  vec4 c = texture2D(tDiffuse, vUv);
  float avg = max(texture2D(tAdapted, vec2(0.5)).r, 1e-4);
  float k = clamp(uKey / avg, uMin, uMax);
  gl_FragColor = vec4(c.rgb * mix(1.0, k, uAmount), c.a);
}`;

export class AutoExposurePass extends Pass {
  /** 0 off .. 1 full metering. */
  public amount = 1;
  /** Brightness the meter aims the average at (scene-referred). */
  public key = 0.28;
  /**
   * The most the meter may brighten: 1.6 by day and in space; more at night low over Earth, as
   * the eye adapts to the dark (set by the scene).
   */
  public maxGain = 1.6;
  /** Where the scene's depth is this frame, when an earlier pass has moved on from its buffer. */
  public depthSource: () => THREE.Texture | null = () => null;
  private lumTarget = new THREE.WebGLRenderTarget(64, 64, { type: THREE.HalfFloatType, depthBuffer: false, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
  private adapt = [
    new THREE.WebGLRenderTarget(1, 1, { type: THREE.FloatType, depthBuffer: false }),
    new THREE.WebGLRenderTarget(1, 1, { type: THREE.FloatType, depthBuffer: false }),
  ];
  private ping = 0;
  private lumQuad: FullScreenQuad;
  private adaptQuad: FullScreenQuad;
  private applyQuad: FullScreenQuad;
  private lumMat: THREE.ShaderMaterial;
  private adaptMat: THREE.ShaderMaterial;
  private applyMat: THREE.ShaderMaterial;
  private last = 0;

  constructor() {
    super();
    this.enabled = false;
    this.needsSwap = true;
    this.lumMat = new THREE.ShaderMaterial({ uniforms: { tDiffuse: { value: null }, tDepth: { value: null } }, vertexShader: quadVert, fragmentShader: lumFrag, depthTest: false, depthWrite: false });
    this.adaptMat = new THREE.ShaderMaterial({ uniforms: { tLum: { value: this.lumTarget.texture }, tPrev: { value: null }, uBlend: { value: 1 }, uLevel: { value: 6 } }, vertexShader: quadVert, fragmentShader: adaptFrag, depthTest: false, depthWrite: false });
    this.applyMat = new THREE.ShaderMaterial({ uniforms: { tDiffuse: { value: null }, tAdapted: { value: null }, uKey: { value: this.key }, uMin: { value: 0.6 }, uMax: { value: 1.6 }, uAmount: { value: 1 } }, vertexShader: quadVert, fragmentShader: applyFrag, depthTest: false, depthWrite: false });
    this.lumQuad = new FullScreenQuad(this.lumMat);
    this.adaptQuad = new FullScreenQuad(this.adaptMat);
    this.applyQuad = new FullScreenQuad(this.applyMat);
  }

  public render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget): void {
    const now = performance.now();
    const dt = this.last ? Math.min(0.25, (now - this.last) / 1000) : 1;
    this.last = now;
    const prev = renderer.getRenderTarget();
    // 1. Log-luminance map of the world
    this.lumMat.uniforms.tDiffuse.value = readBuffer.texture;
    this.lumMat.uniforms.tDepth.value = this.depthSource() ?? readBuffer.depthTexture;
    renderer.setRenderTarget(this.lumTarget);
    this.lumQuad.render(renderer);
    // 2. Adapt towards its average (the 1 x 1 mip), over ~1.2 s
    const src = this.adapt[this.ping];
    const dst = this.adapt[1 - this.ping];
    this.adaptMat.uniforms.tPrev.value = src.texture;
    this.adaptMat.uniforms.uBlend.value = 1 - Math.exp(-dt / 1.2);
    renderer.setRenderTarget(dst);
    this.adaptQuad.render(renderer);
    this.ping = 1 - this.ping;
    // 3. Expose the world
    this.applyMat.uniforms.tDiffuse.value = readBuffer.texture;
    this.applyMat.uniforms.tAdapted.value = dst.texture;
    this.applyMat.uniforms.uKey.value = this.key;
    this.applyMat.uniforms.uAmount.value = this.amount;
    this.applyMat.uniforms.uMax.value = this.maxGain;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.applyQuad.render(renderer);
    renderer.setRenderTarget(prev);
  }

  public dispose(): void {
    this.lumTarget.dispose();
    for (const t of this.adapt) t.dispose();
    this.lumMat.dispose();
    this.adaptMat.dispose();
    this.applyMat.dispose();
  }
}

/**
 * The grade, in display space after the tone curve: a film look. Shadows lean teal and
 * highlights warm (more so with a low Sun, uWarm), an S-curve with deep but not crushed blacks,
 * the colour a touch richer, a soft vignette that draws the eye to the middle, and a fine film
 * grain that moves (it hides banding in the sky and makes the picture read as photographed).
 * First, contrast-adaptive sharpening (after AMD's CAS): each pixel against its four neighbours,
 * sharpened most where the local contrast is low and least on edges that are already hard, so the
 * photographed ground and the buildings read crisp without halos.
 */
export const ColorGradeShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uAmount: { value: 1 },
    uShadows: { value: new THREE.Vector3(-0.012, 0.004, 0.022) },
    uHighlights: { value: new THREE.Vector3(0.034, 0.012, -0.03) },
    uContrast: { value: 0.2 },
    uSaturation: { value: 1.1 },
    uWarm: { value: 0 },
    uVignette: { value: 0.3 },
    uGrain: { value: 0.022 },
    uTime: { value: 0 },
    uSharpen: { value: 0.45 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uAmount;
    uniform float uSharpen;
    uniform vec3 uShadows;
    uniform vec3 uHighlights;
    uniform float uContrast;
    uniform float uSaturation;
    uniform float uWarm;
    uniform float uVignette;
    uniform float uGrain;
    uniform float uTime;
    varying vec2 vUv;
    float gHash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      vec3 col = c.rgb;
      if (uSharpen > 0.0) {
        vec2 px = 1.0 / vec2(textureSize(tDiffuse, 0));
        vec3 n = texture2D(tDiffuse, vUv + vec2(0.0, px.y)).rgb;
        vec3 s = texture2D(tDiffuse, vUv - vec2(0.0, px.y)).rgb;
        vec3 e = texture2D(tDiffuse, vUv + vec2(px.x, 0.0)).rgb;
        vec3 w = texture2D(tDiffuse, vUv - vec2(px.x, 0.0)).rgb;
        vec3 mn = min(min(min(n, s), min(e, w)), col);
        vec3 mx = max(max(max(n, s), max(e, w)), col);
        vec3 amp = sqrt(clamp(min(mn, 1.0 - mx) / max(mx, vec3(1e-4)), 0.0, 1.0));
        vec3 wt = amp * (-1.0 / mix(8.0, 5.0, uSharpen));
        col = clamp((col + (n + s + e + w) * wt) / (1.0 + 4.0 * wt), 0.0, 1.0);
      }
      float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
      // Split tone: shadows lean teal, highlights warm; a low Sun warms the light further
      vec3 hi = uHighlights + vec3(0.05, 0.018, -0.04) * uWarm;
      // (the shadow tint grows with the brightness: added flat, it turned dark forest cyan)
      col += uShadows * smoothstep(0.0, 0.18, l) * (1.0 - smoothstep(0.18, 0.55, l)) + hi * smoothstep(0.4, 1.0, l);
      // S-curve round mid-grey, the blacks held just off zero (film never goes fully black)
      col = mix(col, col * col * (3.0 - 2.0 * col), uContrast);
      col = col * 0.985 + 0.012;
      // A touch more colour
      float l2 = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(l2), col, uSaturation);
      // Vignette: the corners a little darker
      vec2 d = vUv - 0.5;
      col *= 1.0 - uVignette * smoothstep(0.25, 0.85, dot(d, d) * 2.0);
      // Grain: finer in the brights, a new pattern each frame
      float n = gHash(gl_FragCoord.xy + fract(uTime * 7.31) * 1000.0) - 0.5;
      col += n * uGrain * (0.6 + 0.4 * (1.0 - l2));
      gl_FragColor = vec4(mix(c.rgb, clamp(col, 0.0, 1.0), uAmount), c.a);
    }`,
};
