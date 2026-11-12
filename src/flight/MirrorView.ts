import * as THREE from 'three';

/**
 * Live rear-view mirrors for the cockpit.
 *
 * A camera at the pilot's eye looks backwards over the tail and draws the real scene (Google's
 * Earth, the sky, the other worlds) into a small picture every other frame. Each mirror surface
 * looks that picture up by its own reflection direction (the view ray bounced off the mirror's
 * normal), so a mirror of any shape, tilted any way, shows what is really behind it, sharp and
 * live, instead of the coarse environment cube that lights the airframe (256 px, refreshed every
 * dozen frames).
 */
export class MirrorView {
  public readonly target: THREE.WebGLRenderTarget;
  public readonly camera = new THREE.PerspectiveCamera(80, 2, 1e-5, 2.4e8);
  private readonly viewProj = { value: new THREE.Matrix4() };
  private readonly texture: { value: THREE.Texture };
  private readonly strength = { value: 0 };
  private frame = 0;
  private patched = new WeakSet<THREE.Material>();

  constructor(width = 640, height = 320) {
    this.target = new THREE.WebGLRenderTarget(width, height, { type: THREE.HalfFloatType });
    this.texture = { value: this.target.texture };
  }

  /** Give the mirror materials of a model their live picture (call once the model has loaded). */
  public attach(root: THREE.Object3D, isMirror: (m: THREE.Material) => boolean): number {
    let n = 0;
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || !mesh.visible) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        if (!isMirror(m) || this.patched.has(m)) continue;
        this.patch(m as THREE.MeshStandardMaterial);
        this.patched.add(m);
        n++;
      }
    });
    return n;
  }

  private patch(m: THREE.MeshStandardMaterial): void {
    const prev = m.onBeforeCompile;
    m.onBeforeCompile = (shader, renderer) => {
      prev?.call(m, shader, renderer);
      shader.uniforms.uMirrorTex = this.texture;
      shader.uniforms.uMirrorVP = this.viewProj;
      shader.uniforms.uMirrorOn = this.strength;
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform sampler2D uMirrorTex;\nuniform mat4 uMirrorVP;\nuniform float uMirrorOn;')
        .replace(
          '#include <opaque_fragment>',
          `{
  // The view ray off the mirror, in world directions, looked up in the rear camera's picture
  vec3 rv = reflect(normalize(-vViewPosition), normalize(normal));
  vec3 rw = inverseTransformDirection(rv, viewMatrix);
  vec4 clip = uMirrorVP * vec4(rw, 0.0);
  if (uMirrorOn > 0.0 && clip.w > 0.0) {
    vec2 uv = clip.xy / clip.w * 0.5 + 0.5;
    if (all(greaterThan(uv, vec2(0.0))) && all(lessThan(uv, vec2(1.0)))) {
      vec3 seen = texture2D(uMirrorTex, uv).rgb;
      // Silvered glass: ~90% reflectance, a touch of the glass's own sheen kept
      outgoingLight = mix(outgoingLight, seen * 0.9, uMirrorOn);
    }
  }
}
#include <opaque_fragment>`,
        );
    };
    m.customProgramCacheKey = () => 'solaris-mirror';
    m.needsUpdate = true;
  }

  /**
   * Draw what is behind (inside the floating-origin draw: the eye is at the origin). `forward`
   * is the jet's nose, `up` its roof, in world directions; `near` follows the height.
   */
  public render(renderer: THREE.WebGLRenderer, scene: THREE.Scene, forward: THREE.Vector3, up: THREE.Vector3, near: number, on: boolean): void {
    this.strength.value = on ? 1 : 0;
    if (!on || this.frame++ % 2 !== 0) return;
    const cam = this.camera;
    cam.position.set(0, 0, 0);
    cam.up.copy(up);
    cam.lookAt(-forward.x, -forward.y, -forward.z);
    cam.near = near;
    cam.far = 2.4e8;
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld(true);
    // Directions only: the rotation part of the view, then the projection
    const rot = new THREE.Matrix4().extractRotation(cam.matrixWorldInverse);
    this.viewProj.value.multiplyMatrices(cam.projectionMatrix, rot);
    const target = renderer.getRenderTarget();
    const autoClear = renderer.autoClear;
    try {
      renderer.autoClear = true;
      renderer.setRenderTarget(this.target);
      renderer.render(scene, cam);
    } finally {
      renderer.setRenderTarget(target);
      renderer.autoClear = autoClear;
    }
  }

  public dispose(): void {
    this.target.dispose();
  }
}
