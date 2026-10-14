import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

export type LensProfileName = 'cinematic' | 'fisheye' | 'clean';

/**
 * Optical character of the observation camera. Every effect here is a real-camera property:
 *  - distortion:   barrel distortion of a wide lens (k of r_src = r(1 + k r²)/(1 + k))
 *  - fisheyeMask:  radius of a circular image circle (vertical half-heights), 0 = full frame
 *  - chromatic:    lateral chromatic aberration growing with r²
 *  - edgeBlur:     off-axis softness (field curvature), in pixels at the corners
 *  - vignette:     natural light fall-off towards the corners
 *  - grain:        sensor / film grain amplitude in display space
 *  - shutter:      fraction of the frame time the shutter is open (motion blur of camera turns)
 *  - bloom*:       glare from sources brighter than the sensor's white point
 */
export interface LensProfile {
  name: LensProfileName;
  label: string;
  distortion: number;
  fisheyeMask: number;
  chromatic: number;
  edgeBlur: number;
  vignette: number;
  grain: number;
  shutter: number;
  bloomStrength: number;
  bloomRadius: number;
  bloomThreshold: number;
}

export const LENS_PROFILES: Record<LensProfileName, LensProfile> = {
  cinematic: {
    name: 'cinematic',
    label: 'Cinematic',
    distortion: 0.1,
    fisheyeMask: 0,
    chromatic: 0.0035,
    edgeBlur: 2.2,
    vignette: 0.42,
    grain: 0.016,
    shutter: 0,
    bloomStrength: 0.4,
    bloomRadius: 0.55,
    bloomThreshold: 0.9,
  },
  fisheye: {
    name: 'fisheye',
    label: 'Fisheye',
    distortion: 0.55,
    fisheyeMask: 1.12,
    chromatic: 0.007,
    edgeBlur: 4.5,
    vignette: 0.6,
    grain: 0.03,
    shutter: 0,
    bloomStrength: 0.48,
    bloomRadius: 0.6,
    bloomThreshold: 0.88,
  },
  clean: {
    name: 'clean',
    label: 'Clean',
    distortion: 0,
    fisheyeMask: 0,
    chromatic: 0,
    edgeBlur: 0,
    vignette: 0,
    grain: 0,
    shutter: 0,
    bloomStrength: 0,
    bloomRadius: 0,
    bloomThreshold: 1,
  },
};

export const LENS_ORDER: LensProfileName[] = ['cinematic', 'fisheye', 'clean'];

/**
 * Output pixel → source pixel mapping shared by the shader and by click picking.
 * `p` is in "vertical half-height" units: x ∈ [−aspect, aspect], y ∈ [−1, 1].
 */
export function lensSourcePoint(px: number, py: number, aspect: number, k: number): [number, number] {
  if (k === 0) return [px, py];
  const r2 = (px * px + py * py) / (aspect * aspect + 1.0); // 1 at the corners
  const s = (1.0 + k * r2) / (1.0 + k);
  return [px * s, py * s];
}

const LensShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uDistortion: { value: 0 },
    uFisheyeMask: { value: 0 },
    uChromatic: { value: 0 },
    uEdgeBlur: { value: 0 },
    uVignette: { value: 0 },
    uGrain: { value: 0 },
    uShutter: { value: 0 },
    uCurrInvViewProj: { value: new THREE.Matrix4() },
    uPrevViewProj: { value: new THREE.Matrix4() },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uDistortion;
    uniform float uFisheyeMask;
    uniform float uChromatic;
    uniform float uEdgeBlur;
    uniform float uVignette;
    uniform float uGrain;
    uniform float uShutter;
    uniform mat4 uCurrInvViewProj;
    uniform mat4 uPrevViewProj;
    varying vec2 vUv;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    // Lateral chromatic aberration: red focuses slightly outside, blue slightly inside
    vec3 sampleChromatic(vec2 uv, vec2 dir, float amount) {
      float r = texture2D(tDiffuse, uv + dir * amount).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv - dir * amount).b;
      return vec3(r, g, b);
    }

    void main() {
      float aspect = uResolution.x / uResolution.y;
      vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 2.0;
      float r2 = dot(p, p) / (aspect * aspect + 1.0);

      // 1. Barrel distortion (corners stay corners, the centre is magnified)
      vec2 ps = p * (1.0 + uDistortion * r2) / (1.0 + uDistortion);
      vec2 uv = ps / (vec2(aspect, 1.0) * 2.0) + 0.5;

      vec2 radial = (uv - 0.5);
      float ca = uChromatic * r2;

      // 2. Rotational motion blur. Re-project this pixel's view ray with the previous frame's
      //    camera orientation: exact for the distant sky, and a tracked planet (which moves with
      //    the camera) is not smeared.
      vec2 ndc = uv * 2.0 - 1.0;
      vec4 world = uCurrInvViewProj * vec4(ndc, 1.0, 1.0);
      world /= world.w;
      vec4 prevClip = uPrevViewProj * vec4(world.xyz, 1.0);
      vec2 prevUv = (prevClip.w > 0.0) ? (prevClip.xy / prevClip.w) * 0.5 + 0.5 : uv;
      vec2 velocity = (uv - prevUv) * uShutter;
      float vLen = length(velocity);
      if (vLen > 0.08) velocity *= 0.08 / vLen;

      vec3 color;
      if (length(velocity * uResolution) > 0.75) {
        color = vec3(0.0);
        const int STEPS = 10;
        for (int i = 0; i < STEPS; i++) {
          float t = float(i) / float(STEPS - 1) - 0.5;
          color += sampleChromatic(uv + velocity * t, radial, ca);
        }
        color /= float(STEPS);
      } else {
        color = sampleChromatic(uv, radial, ca);
      }

      // 3. Off-axis softness: a small disc blur that grows towards the corners
      float blurPx = uEdgeBlur * smoothstep(0.25, 1.0, r2);
      if (blurPx > 0.3) {
        vec2 texel = blurPx / uResolution;
        vec3 acc = color;
        acc += texture2D(tDiffuse, uv + vec2( 1.0,  0.0) * texel).rgb;
        acc += texture2D(tDiffuse, uv + vec2(-1.0,  0.0) * texel).rgb;
        acc += texture2D(tDiffuse, uv + vec2( 0.0,  1.0) * texel).rgb;
        acc += texture2D(tDiffuse, uv + vec2( 0.0, -1.0) * texel).rgb;
        acc += texture2D(tDiffuse, uv + vec2( 0.7,  0.7) * texel).rgb;
        acc += texture2D(tDiffuse, uv + vec2(-0.7, -0.7) * texel).rgb;
        color = acc / 7.0;
      }

      // Samples outside the rendered frame are black (only reachable with strong distortion)
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) color = vec3(0.0);

      // 4. Natural vignetting (cos^4-like fall-off)
      float vig = 1.0 - uVignette * smoothstep(0.15, 1.05, r2);
      color *= vig;

      // 5. Circular image circle for the fisheye lens
      if (uFisheyeMask > 0.0) {
        float rho = length(p);
        color *= 1.0 - smoothstep(uFisheyeMask - 0.05, uFisheyeMask, rho);
      }

      // 6. Grain, strongest in the mid-tones like film
      float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
      float n = hash(vUv * uResolution + fract(uTime * 37.0) * 91.7) - 0.5;
      color += n * uGrain * (0.35 + 0.65 * (1.0 - abs(luma * 2.0 - 1.0)));

      gl_FragColor = vec4(max(color, 0.0), 1.0);
    }
  `,
};

/**
 * Post-processing chain of the observation camera:
 *   scene (linear HDR) → bloom → tone mapping + sRGB (OutputPass) → lens (display space).
 * The "clean" profile bypasses the chain entirely and renders straight to the screen.
 */
export class LensPipeline {
  public profile: LensProfile = LENS_PROFILES.cinematic;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private composer: EffectComposer;
  private bloomPass: UnrealBloomPass;
  private lensPass: ShaderPass;

  private prevViewProj = new THREE.Matrix4();
  private hasPrev = false;
  private tmpView = new THREE.Matrix4();
  private tmpViewProj = new THREE.Matrix4();
  private reducedMotion = false;

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;

    const size = renderer.getSize(new THREE.Vector2());
    const target = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType });
    this.composer = new EffectComposer(renderer, target);
    this.composer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    this.composer.addPass(new RenderPass(scene, camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.4, 0.5, 0.85);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());
    this.lensPass = new ShaderPass(LensShader);
    this.composer.addPass(this.lensPass);

    if (typeof window !== 'undefined' && window.matchMedia) {
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    this.setSize(size.x, size.y);
    this.setProfile('cinematic');
  }

  /** 0–1: how much of the lens character is applied (fades to a clean view over a map). */
  private effectScale = 1;

  public setEffectScale(k: number): void {
    const v = THREE.MathUtils.clamp(k, 0, 1);
    if (Math.abs(v - this.effectScale) < 1e-3) return;
    this.effectScale = v;
    this.applyProfileUniforms();
  }

  private applyProfileUniforms(): void {
    const k = this.effectScale;
    const u = this.lensPass.uniforms;
    u.uDistortion.value = this.profile.distortion * k;
    u.uFisheyeMask.value = k > 0.5 ? this.profile.fisheyeMask : 0;
    u.uChromatic.value = this.profile.chromatic * k;
    u.uEdgeBlur.value = this.profile.edgeBlur * k;
    u.uVignette.value = this.profile.vignette * (0.35 + 0.65 * k);
    u.uGrain.value = this.profile.grain * k;
    // No glow over a map (bright snow and desert would bloom into haze)
    this.bloomPass.strength = this.profile.bloomStrength * k;
    this.bloomPass.threshold = this.bloomThresholdOverride ?? this.profile.bloomThreshold;
  }

  /** Raise the bloom threshold (e.g. under a bright daytime sky) or null to use the profile's. */
  private bloomThresholdOverride: number | null = null;

  public setBloomThreshold(t: number | null): void {
    if (t === this.bloomThresholdOverride) return;
    this.bloomThresholdOverride = t;
    this.applyProfileUniforms();
  }

  public setProfile(name: LensProfileName): void {
    this.profile = LENS_PROFILES[name];
    const u = this.lensPass.uniforms;
    this.applyProfileUniforms();
    u.uShutter.value = this.reducedMotion ? 0 : this.profile.shutter;
    this.bloomPass.radius = this.profile.bloomRadius;
    this.applyProfileUniforms();
    this.hasPrev = false;
  }

  public cycleProfile(): LensProfileName {
    const next = LENS_ORDER[(LENS_ORDER.indexOf(this.profile.name) + 1) % LENS_ORDER.length];
    this.setProfile(next);
    return next;
  }

  public setSize(width: number, height: number): void {
    this.composer.setSize(width, height);
    const pr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.lensPass.uniforms.uResolution.value.set(width * pr, height * pr);
  }

  /** Map a click in output NDC to the NDC the scene was rendered at (inverse of the lens warp). */
  public outputToSceneNdc(x: number, y: number, aspect: number): [number, number] {
    const [sx, sy] = lensSourcePoint(x * aspect, y, aspect, this.profile.distortion * this.effectScale);
    return [sx / aspect, sy];
  }

  /** The off-screen target the scene itself is rendered into (for shader pre-compilation). */
  public sceneTarget(): THREE.WebGLRenderTarget {
    return this.composer.readBuffer;
  }

  /** True if the output NDC point lies outside the fisheye image circle. */
  public isMasked(x: number, y: number, aspect: number): boolean {
    if (this.profile.fisheyeMask <= 0 || this.effectScale <= 0.5) return false;
    return Math.hypot(x * aspect, y) > this.profile.fisheyeMask;
  }

  public render(timeSec: number): void {
    if (this.profile.name === 'clean') {
      this.renderer.render(this.scene, this.camera);
      this.hasPrev = false;
      return;
    }

    // Rotation-only view-projection (translation removed) for sky re-projection
    this.camera.updateMatrixWorld();
    this.tmpView.copy(this.camera.matrixWorldInverse).setPosition(0, 0, 0);
    this.tmpViewProj.multiplyMatrices(this.camera.projectionMatrix, this.tmpView);

    const u = this.lensPass.uniforms;
    u.uCurrInvViewProj.value.copy(this.tmpViewProj).invert();
    u.uPrevViewProj.value.copy(this.hasPrev ? this.prevViewProj : this.tmpViewProj);
    u.uTime.value = timeSec;

    this.composer.render();

    this.prevViewProj.copy(this.tmpViewProj);
    this.hasPrev = true;
  }

  public dispose(): void {
    this.composer.dispose();
    this.bloomPass.dispose();
    this.lensPass.dispose?.();
  }
}
