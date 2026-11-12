import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';

/**
 * God rays: the Sun's light streaming through the gaps, drawn from what is really on screen.
 * For each pixel, a march towards the Sun's place on the screen gathers the brightness of open
 * sky along the way (pixels with nothing in the depth buffer), fading with distance; so a
 * mountain, a cloud (darker than the sky round the Sun) or the airframe cuts the beams exactly
 * where it stands. Strongest when the Sun is half hidden; nothing when it is behind the camera.
 */

const vert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const frag = /* glsl */ `
uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform vec2 uSun;
uniform float uK;
uniform vec3 uCol;
uniform float uAspect;
uniform float uThreshold;
varying vec2 vUv;
void main() {
  const int N = 40;
  vec2 d = (uSun - vUv) / float(N);
  float j = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  vec2 p = vUv + d * j;
  float acc = 0.0;
  float decay = 1.0;
  for (int i = 0; i < N; i++) {
    p += d;
    if (p.x < 0.0 || p.y < 0.0 || p.x > 1.0 || p.y > 1.0) break;
    float sky = step(0.9999999, texture2D(tDepth, p).x);
    float l = dot(texture2D(tDiffuse, p).rgb, vec3(0.2126, 0.7152, 0.0722));
    // Only the Sun and the glare right round it feed the beams: a lower cut let every bright
    // cloud and the whole sky pour light in, and the frame drowned in a white veil
    acc += sky * clamp(l - uThreshold, 0.0, 6.0) * decay;
    decay *= 0.955;
  }
  // Fades towards the frame's far side from the Sun
  float r = length((vUv - uSun) * vec2(uAspect, 1.0));
  vec3 rays = uCol * (acc / float(N)) * exp(-r * 2.2) * uK;
  gl_FragColor = vec4(rays, 1.0);
}`;

const addFrag = /* glsl */ `
uniform sampler2D tDiffuse;
uniform sampler2D tRays;
varying vec2 vUv;
void main() {
  vec4 c = texture2D(tDiffuse, vUv);
  gl_FragColor = vec4(c.rgb + texture2D(tRays, vUv).rgb, c.a);
}`;

/** Records the scene's depth right after it is drawn (later passes read buffers without it). */
export class DepthTapPass extends Pass {
  public depth: THREE.Texture | null = null;

  constructor() {
    super();
    this.needsSwap = false;
  }

  public render(_r: THREE.WebGLRenderer, _w: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget): void {
    this.depth = readBuffer.depthTexture;
  }
}

export class GodRaysPass extends Pass {
  public depthSource: () => THREE.Texture | null = () => null;
  private quad: FullScreenQuad;
  private mat: THREE.ShaderMaterial;
  // The rays are marched into their own half-size buffer (they read the scene's depth, which may
  // belong to the very buffer the composer is writing: sampling it there is a feedback loop that
  // blacked the picture out), then added to the picture
  private raysTarget = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: false });
  private addMat: THREE.ShaderMaterial;
  private addQuad: FullScreenQuad;

  constructor() {
    super();
    this.enabled = false;
    this.needsSwap = true;
    this.mat = new THREE.ShaderMaterial({
      uniforms: { tDiffuse: { value: null }, tDepth: { value: null }, uSun: { value: new THREE.Vector2(0.5, 0.5) }, uK: { value: 0 }, uCol: { value: new THREE.Color(1.0, 0.86, 0.66) }, uAspect: { value: 1 }, uThreshold: { value: 2.6 } },
      vertexShader: vert,
      fragmentShader: frag,
      depthTest: false,
      depthWrite: false,
    });
    this.quad = new FullScreenQuad(this.mat);
    this.addMat = new THREE.ShaderMaterial({ uniforms: { tDiffuse: { value: null }, tRays: { value: this.raysTarget.texture } }, vertexShader: vert, fragmentShader: addFrag, depthTest: false, depthWrite: false });
    this.addQuad = new FullScreenQuad(this.addMat);
  }

  public setSize(width: number, height: number): void {
    this.raysTarget.setSize(Math.max(1, Math.round(width / 2)), Math.max(1, Math.round(height / 2)));
  }

  /** The Sun in scene NDC (-1..1), its strength (0 off), the frame's aspect. */
  public set(ndcX: number, ndcY: number, k: number, aspect: number): void {
    this.mat.uniforms.uSun.value.set(ndcX * 0.5 + 0.5, ndcY * 0.5 + 0.5);
    // At full strength the beams washed the whole frame out round a low Sun: a film look keeps
    // them as shafts in the air, not a glow over everything
    this.mat.uniforms.uK.value = k * 0.28;
    this.mat.uniforms.uAspect.value = aspect;
  }

  public render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget): void {
    this.mat.uniforms.tDiffuse.value = readBuffer.texture;
    this.mat.uniforms.tDepth.value = this.depthSource() ?? readBuffer.depthTexture;
    renderer.setRenderTarget(this.raysTarget);
    this.quad.render(renderer);
    this.addMat.uniforms.tDiffuse.value = readBuffer.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.addQuad.render(renderer);
  }

  public dispose(): void {
    this.mat.dispose();
    this.quad.dispose();
    this.addMat.dispose();
    this.addQuad.dispose();
    this.raysTarget.dispose();
  }
}
