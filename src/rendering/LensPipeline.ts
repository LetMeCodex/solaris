import * as THREE from 'three';
import { perf } from './Performance';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { Pass } from 'three/examples/jsm/postprocessing/Pass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';

/**
 * Ground-truth ambient occlusion for the overlay (the jet and its cockpit): soft darkening where
 * surfaces crowd each other, the contact shading ray tracing would give. Only solid meshes count:
 * glass, flames, sprites and full-screen layers (userData.noAO) are hidden from its depth pass.
 */
class OverlayAOPass extends GTAOPass {
  private hidden: THREE.Object3D[] = [];
  private aoScene: THREE.Scene;

  constructor(scene: THREE.Scene, camera: THREE.Camera, width: number, height: number) {
    super(scene, camera, width, height);
    this.aoScene = scene;
  }

  render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget, deltaTime?: number, maskActive?: boolean): void {
    this.hidden.length = 0;
    this.aoScene.traverseVisible((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if ((o as THREE.Sprite).isSprite || o.userData.noAO || ((o as THREE.Mesh).isMesh && m && (m.transparent || m.blending === THREE.AdditiveBlending))) {
        this.hidden.push(o);
      }
    });
    for (const o of this.hidden) o.visible = false;
    try {
      super.render(renderer, writeBuffer, readBuffer, deltaTime ?? 0, maskActive ?? false);
    } finally {
      for (const o of this.hidden) o.visible = true;
    }
  }
}

/**
 * A second scene drawn over the world before bloom and tone mapping, with its own camera and a
 * fresh depth buffer: the jet in metres beside worlds thousands of km across (see JetController).
 */
class OverlayPass extends Pass {
  public scene: THREE.Scene | null = null;
  public camera: THREE.Camera | null = null;

  constructor() {
    super();
    this.needsSwap = false;
    this.enabled = false;
  }

  render(renderer: THREE.WebGLRenderer, _writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget): void {
    if (!this.scene || !this.camera) return;
    const autoClear = renderer.autoClear;
    renderer.autoClear = false;
    renderer.setRenderTarget(this.renderToScreen ? null : readBuffer);
    renderer.clearDepth();
    renderer.render(this.scene, this.camera);
    renderer.autoClear = autoClear;
  }
}

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
    uProj: { value: 0 },
    uProjK: { value: 1 },
    uProjR0: { value: 0.6 },
    uProjA: { value: 0 },
    uSrcTan: { value: 1 },
    uGrey: { value: 0 },
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
    uniform float uProj;
    uniform float uProjK;
    uniform float uProjR0;
    uniform float uProjA;
    uniform float uSrcTan;
    uniform float uGrey;
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

      // 1. Projection. Either a barrel distortion (corners stay corners, the centre magnified), or
      //    an action camera's: rectilinear through the middle (straight lines, true proportions
      //    over the panel and the view ahead), then an angle-per-pixel that grows towards the
      //    edges, so the horizon bows harder and harder the further out it runs. The angle off
      //    axis is theta(rho) = atan(k rho) + a max(rho - r0, 0)^2; the scene was rendered
      //    rectilinear and wider, so its point for that angle is tan(theta) / tan(half fov).
      vec2 ps;
      if (uProj > 0.5) {
        float rho = length(p);
        float th = min(atan(uProjK * rho) + uProjA * pow(max(rho - uProjR0, 0.0), 2.0), 1.53);
        ps = rho > 1e-5 ? p * (tan(th) / (uSrcTan * rho)) : p * (uProjK / uSrcTan);
      } else {
        ps = p * (1.0 + uDistortion * r2) / (1.0 + uDistortion);
      }
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
      // Long true-scale flights swing the view fast: keep the smear short, or the taps separate
      // into visible copies (the dark Milky Way lanes turned into stepped blocks)
      if (vLen > 0.035) velocity *= 0.035 / vLen;

      vec3 color;
      if (length(velocity * uResolution) > 0.75) {
        color = vec3(0.0);
        const int STEPS = 14;
        // Per-pixel dither of the tap positions turns residual banding into fine grain
        float jitter = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
        for (int i = 0; i < STEPS; i++) {
          float t = (float(i) + 0.5 + jitter) / float(STEPS) - 0.5;
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

      // The pilot's eyes under G: grey-out creeps in from the edges (colour first, then light),
      //    and the view tunnels towards a clear centre, always a soft gradient
      if (uGrey > 0.001) {
        float rr = length(p) / aspect;
        float edge = smoothstep(mix(1.2, 0.18, uGrey), mix(1.6, 0.85, uGrey), rr);
        float l0 = dot(color, vec3(0.2126, 0.7152, 0.0722));
        color = mix(color, vec3(l0), clamp(edge * 1.6, 0.0, 1.0));
        color *= 1.0 - edge * smoothstep(0.35, 1.0, uGrey);
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

/**
 * Speed blur: a radial smear away from where the camera is heading, growing towards the edges of
 * the frame, as a fast-moving camera records the ground sweeping past (jet mode only).
 */
const SpeedBlurShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uCenter: { value: new THREE.Vector2(0.5, 0.5) },
    uStrength: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uCenter;
    uniform float uStrength;
    varying vec2 vUv;
    void main() {
      vec2 d = vUv - uCenter;
      float k = uStrength * smoothstep(0.06, 0.7, length(d));
      vec4 acc = vec4(0.0);
      float w = 0.0;
      for (int i = 0; i < 12; i++) {
        float t = float(i) / 11.0;
        float wi = 1.0 - t * 0.6;
        acc += texture2D(tDiffuse, vUv - d * k * t) * wi;
        w += wi;
      }
      gl_FragColor = acc / w;
    }
  `,
};

/**
 * The look of an action camera (the jet's GoPro view): a vivid profile (strong mid-tone contrast,
 * richer colour), the crisp edges of in-camera sharpening, and rolling-shutter "jello": a small
 * sideways shear down the frame, because a CMOS sensor reads its rows one after another while the
 * airframe vibrates. Runs on the display-referred image, after tone mapping.
 */
const ActionCamShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uVibration: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uVibration;
    varying vec2 vUv;
    void main() {
      // Rolling shutter: each row was read a little later, so vibration shears the frame
      vec2 uv = vUv;
      uv.x += uVibration * 0.0022 * sin(uv.y * 14.0 + uTime * 61.0) * sin(uTime * 23.0);
      vec2 px = 1.0 / uResolution;
      vec3 c = texture2D(tDiffuse, uv).rgb;
      // In-camera sharpening (unsharp mask)
      vec3 blur = (texture2D(tDiffuse, uv + vec2(px.x, 0.0)).rgb + texture2D(tDiffuse, uv - vec2(px.x, 0.0)).rgb +
                   texture2D(tDiffuse, uv + vec2(0.0, px.y)).rgb + texture2D(tDiffuse, uv - vec2(0.0, px.y)).rgb) * 0.25;
      c += (c - blur) * 0.55;
      // Vivid profile: S-curve contrast and saturation, slightly cool shadows and warm highlights
      c = clamp(c, 0.0, 1.0);
      c = c * c * (3.0 - 2.0 * c) * 0.55 + c * 0.45;
      float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
      c = mix(vec3(l), c, 1.22);
      c += vec3(-0.012, 0.0, 0.016) * (1.0 - l) + vec3(0.02, 0.008, -0.012) * l;
      gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
    }
  `,
};

/**
 * Sunlight on the canopy, seen from inside. Real transparencies carry fine polishing scratches:
 * a groove scatters light only across itself, so around the Sun the ones lying tangential to it
 * light up as thin concentric arcs, bright within ~10 degrees and fading out past 30. Dust and
 * smudges scatter forward too: a soft warm haze around the Sun. Runs on the world before the
 * cockpit overlay, so the panel, the frame and the pilot are in front of the glass, as they are.
 */
const CanopyShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uSun: { value: new THREE.Vector3(0.5, 0.5, 0) }, // uv, strength
    uAspect: { value: 1 },
    uSeed: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec3 uSun;
    uniform float uAspect;
    uniform float uSeed;
    varying vec2 vUv;
    float h1(float n) { return fract(sin(n * 127.1 + uSeed) * 43758.5453); }
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      if (uSun.z < 0.002) { gl_FragColor = c; return; }
      vec2 d = (vUv - uSun.xy) * vec2(uAspect, 1.0);
      float r = length(d);
      float ang = atan(d.y, d.x);
      float arcs = 0.0;
      // Two families of grooves at different spacings
      for (int k = 0; k < 2; k++) {
        float freq = k == 0 ? 140.0 : 61.0;
        float band = floor(r * freq);
        float f = fract(r * freq);
        float line = 1.0 - smoothstep(0.0, 0.11, abs(f - 0.5));
        float on = step(0.72, h1(band + float(k) * 91.0));
        float centre = h1(band * 3.7 + 11.0 + float(k)) * 6.2831;
        float halfLen = 0.15 + 0.55 * h1(band * 7.1 + 5.0);
        float da = abs(mod(ang - centre + 3.14159, 6.28318) - 3.14159);
        float seg = 1.0 - smoothstep(halfLen * 0.7, halfLen, da);
        arcs += line * on * seg * (0.55 + 0.45 * h1(band + 3.0));
      }
      float near = exp(-r * 7.0) + 0.25 * exp(-r * 2.2);
      float haze = exp(-r * 4.0) * 0.06 + exp(-r * 14.0) * 0.12;
      vec3 add = vec3(1.0, 0.96, 0.9) * (arcs * near * 0.18 + haze) * uSun.z;
      gl_FragColor = vec4(c.rgb + add, c.a);
    }
  `,
};

/**
 * Keeps the HDR picture finite before bloom. The scene renders into a half-float buffer (largest
 * value ~65,000): enough stacked additive light (the Sun, a solar flare, its glow and halo) can
 * overflow it to infinity, and bloom's blur turns one such pixel into NaN that spreads over the
 * whole frame, a black screen. Here NaN becomes 0 and anything brighter than 30,000 is clamped.
 */
const FiniteShader = {
  uniforms: { tDiffuse: { value: null as THREE.Texture | null } },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      // isnan (GLSL ES 3.0): a compiler may fold the classic (c != c) test away
      c = mix(c, vec4(0.0, 0.0, 0.0, 1.0), vec4(isnan(c)));
      gl_FragColor = clamp(c, 0.0, 30000.0);
    }
  `,
};

export class LensPipeline {
  public profile: LensProfile = LENS_PROFILES.cinematic;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private composer: EffectComposer;
  private bloomPass: UnrealBloomPass;
  private lensPass: ShaderPass;
  private overlayPass = new OverlayPass();
  private fxaaPass = new ShaderPass(FXAAShader);
  /** Edge smoothing for the jet overlay: SMAA keeps single-pixel stars crisp, where FXAA smeared them. */
  private smaaPass: SMAAPass;
  private aoPass: OverlayAOPass | null = null;
  private actionCamPass = new ShaderPass(ActionCamShader);
  private speedBlurPass = new ShaderPass(SpeedBlurShader);
  private canopyPass = new ShaderPass(CanopyShader);

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
    this.composer.setPixelRatio(perf.pixelRatio(1.5));

    this.composer.addPass(new RenderPass(scene, camera));
    // Speed blur smears the world only: it runs before the overlay (the jet stays sharp)
    this.speedBlurPass.enabled = false;
    this.composer.addPass(this.speedBlurPass);
    this.canopyPass.enabled = false;
    this.composer.addPass(this.canopyPass);
    this.composer.addPass(this.overlayPass);
    this.composer.addPass(new ShaderPass(FiniteShader));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.4, 0.5, 0.85);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());
    this.actionCamPass.enabled = false;
    this.composer.addPass(this.actionCamPass);
    this.fxaaPass.enabled = false;
    this.composer.addPass(this.fxaaPass);
    this.smaaPass = new SMAAPass(size.x, size.y);
    this.smaaPass.enabled = false;
    this.composer.addPass(this.smaaPass);
    this.lensPass = new ShaderPass(LensShader);
    this.composer.addPass(this.lensPass);

    if (typeof window !== 'undefined' && window.matchMedia) {
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    this.setSize(size.x, size.y);
    // First visit: the clean lens. Afterwards, whatever the viewer chose last time.
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LensPipeline.STORAGE_KEY);
    } catch {
      /* storage blocked */
    }
    this.setProfile(saved && saved in LENS_PROFILES ? (saved as LensProfileName) : 'clean');
  }

  /** Remembers the viewer's lens between visits. */
  public static readonly STORAGE_KEY = 'solaris.lens';

  /** 0–1: how much of the lens character is applied (fades to a clean view over a map). */
  private effectScale = 1;

  public setEffectScale(k: number): void {
    const v = THREE.MathUtils.clamp(k, 0, 1);
    if (Math.abs(v - this.effectScale) < 1e-3) return;
    this.effectScale = v;
    this.applyProfileUniforms();
  }

  /** Optical values for a camera that brings its own lens (jet mode's GoPro), or null. */
  private override: Partial<Pick<LensProfile, 'distortion' | 'fisheyeMask' | 'chromatic' | 'edgeBlur' | 'vignette' | 'grain'>> | null = null;

  /** The profile's optics with any camera override applied. */
  private optics(): LensProfile {
    return this.override ? { ...this.profile, ...this.override } : this.profile;
  }

  /**
   * Fit a different lens for a while (null puts the chosen profile back). The composer runs
   * while an overlay is drawn, so this works with the clean profile too.
   */
  public setLensOverride(o: Partial<Pick<LensProfile, 'distortion' | 'fisheyeMask' | 'chromatic' | 'edgeBlur' | 'vignette' | 'grain'>> | null): void {
    const same = JSON.stringify(o) === JSON.stringify(this.override);
    if (same) return;
    this.override = o;
    this.applyProfileUniforms();
    this.hasPrev = false;
  }

  private applyProfileUniforms(): void {
    const k = this.effectScale;
    const u = this.lensPass.uniforms;
    u.uDistortion.value = this.optics().distortion * k;
    u.uFisheyeMask.value = k > 0.5 ? this.optics().fisheyeMask : 0;
    u.uChromatic.value = this.optics().chromatic * k;
    u.uEdgeBlur.value = this.optics().edgeBlur * k;
    u.uVignette.value = this.optics().vignette * (0.35 + 0.65 * k);
    u.uGrain.value = this.optics().grain * k;
    // No glow over a map (bright snow and desert would bloom into haze)
    this.bloomPass.strength = this.profile.bloomStrength * k * this.bloomGain;
    this.bloomPass.threshold = this.bloomThresholdOverride ?? this.profile.bloomThreshold;
    // With an overlay (jet mode) even the clean lens keeps a little glow for engines and lights
    if (this.overlayPass.enabled && this.profile.name === 'clean') {
      this.bloomPass.strength = 0.2 * this.bloomGain;
      this.bloomPass.radius = 0.35;
      this.bloomPass.threshold = 1.0;
    }
  }

  /** User bloom control: multiplier on the profile's bloom strength (0 = off, 1 = as designed). */
  private bloomGain = 1;

  public setBloomGain(gain: number): void {
    const g = THREE.MathUtils.clamp(gain, 0, 3);
    if (g === this.bloomGain) return;
    this.bloomGain = g;
    this.applyProfileUniforms();
  }

  public getBloomGain(): number {
    return this.bloomGain;
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
    const pr = this.composerRatio();
    this.lensPass.uniforms.uResolution.value.set(width * pr, height * pr);
    this.fxaaPass.uniforms.resolution.value.set(1 / Math.max(1, width * pr), 1 / Math.max(1, height * pr));
    this.aoPass?.setSize(width * pr, height * pr);
  }

  /** Resolution of the composer's targets: the full screen while flying, a little less otherwise. */
  private composerRatio(): number {
    return this.overlayPass.enabled ? perf.pixelRatio(2) : perf.pixelRatio(1.5);
  }

  /** Re-apply the resolution (the performance governor changed its scale). */
  public refreshResolution(): void {
    this.composer.setPixelRatio(this.composerRatio());
    const size = this.renderer.getSize(new THREE.Vector2());
    this.setSize(size.x, size.y);
  }

  /** Map a click in output NDC to the NDC the scene was rendered at (inverse of the lens warp). */
  public outputToSceneNdc(x: number, y: number, aspect: number): [number, number] {
    const [sx, sy] = lensSourcePoint(x * aspect, y, aspect, this.optics().distortion * this.effectScale);
    return [sx / aspect, sy];
  }

  /** Where a point rendered at scene NDC appears on screen after the lens warp (for HUD markers). */
  public sceneToOutputNdc(x: number, y: number, aspect: number): [number, number] {
    const k = this.optics().distortion * this.effectScale;
    if (k === 0) return [x, y];
    // Invert the radial warp by fixed-point iteration (it is smooth and close to identity)
    let ox = x * aspect, oy = y;
    for (let i = 0; i < 6; i++) {
      const [sx, sy] = lensSourcePoint(ox, oy, aspect, k);
      ox += x * aspect - sx;
      oy += y - sy;
    }
    return [ox / aspect, oy];
  }

  /** The off-screen target the scene itself is rendered into (for shader pre-compilation). */
  public sceneTarget(): THREE.WebGLRenderTarget {
    return this.composer.readBuffer;
  }

  /** True if the output NDC point lies outside the fisheye image circle. */
  public isMasked(x: number, y: number, aspect: number): boolean {
    if (this.optics().fisheyeMask <= 0 || this.effectScale <= 0.5) return false;
    return Math.hypot(x * aspect, y) > this.optics().fisheyeMask;
  }

  /**
   * Draw `scene` through `camera` over the world each frame (null to stop). While it is on, an
   * FXAA pass smooths the overlay's edges (the composer's targets can't be multisampled: the
   * bloom pass leaves a stale viewport on an MSAA target and blacks out part of the frame).
   */
  public setOverlay(scene: THREE.Scene | null, camera: THREE.Camera | null): void {
    const on = !!scene && !!camera;
    this.overlayPass.scene = scene;
    this.overlayPass.camera = camera;
    // Ambient occlusion on the jet: only where the GPU has room for it
    if (on && scene && camera && !this.aoPass && perf.settings.ao) {
      const size = this.renderer.getSize(new THREE.Vector2());
      const pr = perf.pixelRatio(1.5);
      this.aoPass = new OverlayAOPass(scene, camera, size.x * pr, size.y * pr);
      this.aoPass.updateGtaoMaterial({ radius: 0.35, distanceExponent: 1.2, thickness: 1.2, scale: 1.1, samples: 12 });
      this.aoPass.updatePdMaterial({ radius: 6, rings: 2, samples: 12 });
      this.aoPass.blendIntensity = 0.9;
      this.composer.insertPass(this.aoPass, this.composer.passes.indexOf(this.overlayPass) + 1);
    }
    if (on === this.overlayPass.enabled) return;
    this.overlayPass.enabled = on;
    if (this.aoPass) this.aoPass.enabled = on;
    this.smaaPass.enabled = on && perf.settings.smaa;
    // Flying, the sky is drawn at the screen's full sharpness (as the clean lens draws it), not the
    // 1.5x the observatory's lens effects run at
    this.composer.setPixelRatio(this.composerRatio());
    const size = this.renderer.getSize(new THREE.Vector2());
    this.setSize(size.x, size.y);
    if (!on) {
      this.speedBlurPass.enabled = false;
      this.canopyPass.enabled = false;
      this.lensPass.uniforms.uProj.value = 0;
      this.lensPass.uniforms.uGrey.value = 0;
    }
    if (this.profile.name === 'clean') this.bloomPass.radius = this.profile.bloomRadius;
    this.applyProfileUniforms();
    this.hasPrev = false;
  }

  /**
   * Radial speed blur while flying (0 = off), centred on the heading in output NDC (-1..1).
   * Respects reduced-motion preferences.
   */
  /** The action-camera look (GoPro view) on or off; vibration 0..1 drives the rolling-shutter shear. */
  public setActionCam(on: boolean, vibration: number, timeSec: number): void {
    this.actionCamPass.enabled = on && this.overlayPass.enabled;
    const u = this.actionCamPass.uniforms;
    u.uVibration.value = this.reducedMotion ? 0 : vibration;
    u.uTime.value = timeSec;
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    u.uResolution.value.copy(size);
  }

  /**
   * The action-camera projection (null: off, the barrel distortion applies). `aspect` is the
   * frame's, `srcHalfFovDeg` the rendering camera's vertical half angle (it must render wider
   * than the output shows at its edges).
   */
  public setProjection(on: boolean, aspect = 1, srcHalfFovDeg = 60): void {
    const u = this.lensPass.uniforms;
    u.uProj.value = on ? 1 : 0;
    if (!on) return;
    const d = THREE.MathUtils.degToRad;
    const srcTan = Math.tan(d(srcHalfFovDeg));
    // Rectilinear core: 40 degrees at the top edge's height; the bending starts 0.6 half-heights out
    const k = Math.tan(d(40));
    const r0 = 0.6;
    const side = aspect;
    const corner = Math.hypot(aspect, 1);
    const srcSide = Math.atan(side * srcTan);
    const srcCorner = Math.atan(corner * srcTan);
    // Wide at the sides (the horizon's ends), never past what was rendered
    let a = Math.max(0, (Math.min(d(70), srcSide - d(2)) - Math.atan(k * side)) / Math.max(1e-3, (side - r0) ** 2));
    const thCorner = Math.atan(k * corner) + a * (corner - r0) ** 2;
    if (thCorner > srcCorner - d(1)) a = Math.max(0, (srcCorner - d(1) - Math.atan(k * corner)) / Math.max(1e-3, (corner - r0) ** 2));
    u.uProjK.value = k;
    u.uProjR0.value = r0;
    u.uProjA.value = a;
    u.uSrcTan.value = srcTan;
  }

  /** Grey-out / tunnel vision of the pilot's eyes under G, 0..1. */
  public setGrey(level: number): void {
    this.lensPass.uniforms.uGrey.value = this.reducedMotion ? Math.min(level, 0.5) : level;
  }

  /** Sunlight on the canopy (from inside): the Sun's position (output NDC) and strength 0..1 (0 off). */
  public setCanopySun(ndcX: number, ndcY: number, strength: number): void {
    this.canopyPass.enabled = this.overlayPass.enabled && strength > 0.002;
    const u = this.canopyPass.uniforms;
    u.uSun.value.set(ndcX * 0.5 + 0.5, ndcY * 0.5 + 0.5, strength);
    const size = this.renderer.getSize(new THREE.Vector2());
    u.uAspect.value = size.x / Math.max(1, size.y);
  }

  public setSpeedBlur(strength: number, ndcX: number, ndcY: number): void {
    const k = this.reducedMotion ? 0 : THREE.MathUtils.clamp(strength, 0, 0.12);
    this.speedBlurPass.enabled = this.overlayPass.enabled && k > 0.002;
    this.speedBlurPass.uniforms.uStrength.value = k;
    this.speedBlurPass.uniforms.uCenter.value.set(ndcX * 0.5 + 0.5, ndcY * 0.5 + 0.5);
  }

  public render(timeSec: number): void {
    if (this.profile.name === 'clean' && !this.overlayPass.enabled) {
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
