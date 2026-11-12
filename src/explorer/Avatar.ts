import * as THREE from 'three';

/**
 * You, standing there: a person a few steps ahead of the eye in the look-up view (the third-person
 * shot of a place: someone in front of the Eiffel Tower at sunset), seen from behind, at real size
 * (1.72 m), on the ground the view stands on, turning with the view so they stay in front.
 *
 * Built from simple solids (no model to download): shoes, jeans, a jacket, arms, neck, head and
 * hair to the shoulders, in clothes' colours; lit by the real Sun (the scene's light) and the sky
 * (a sky light added to the material, as on the planted trees), with a slight breathing sway.
 *
 * It lives in Earth's surface frame (a unit sphere), placed each frame from the eye; the figure's
 * own geometry is in metres, scaled down by its parent group.
 */
const METRE = 1 / 6378137;

export class Avatar {
  public readonly group = new THREE.Group();
  private readonly figure = new THREE.Group();
  private readonly sky = { value: new THREE.Color(0.3, 0.34, 0.42) };
  private readonly tmp = { up: new THREE.Vector3(), fwd: new THREE.Vector3(), right: new THREE.Vector3(), m: new THREE.Matrix4(), inv: new THREE.Matrix4() };

  constructor() {
    const mat = (hex: number, rough = 0.85): THREE.MeshStandardMaterial => {
      const m = new THREE.MeshStandardMaterial({ color: hex, roughness: rough, metalness: 0 });
      const sky = this.sky;
      m.onBeforeCompile = (shader) => {
        shader.uniforms.uAvatarSky = sky;
        shader.fragmentShader = shader.fragmentShader
          .replace('#include <common>', '#include <common>\nuniform vec3 uAvatarSky;')
          .replace(
            '#include <lights_fragment_end>',
            '#include <lights_fragment_end>\n  reflectedLight.indirectDiffuse += diffuseColor.rgb * uAvatarSky * (0.6 + 0.4 * normal.y);',
          );
      };
      m.customProgramCacheKey = () => 'solaris-avatar';
      return m;
    };
    const jeans = mat(0x46597a);
    const jacket = mat(0x8c8f96);
    const skin = mat(0xc89478, 0.6);
    const hair = mat(0x4a3324, 0.55);
    const shoe = mat(0x1a1a1c, 0.5);
    const add = (geo: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number, rx = 0, rz = 0, sx = 1, sy = 1, sz = 1): void => {
      const mesh = new THREE.Mesh(geo, m);
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, 0, rz);
      mesh.scale.set(sx, sy, sz);
      mesh.castShadow = true;
      mesh.frustumCulled = false;
      this.figure.add(mesh);
    };
    // Facing -Z: the eye, behind, sees the back
    for (const s of [-1, 1]) {
      add(new THREE.BoxGeometry(0.11, 0.08, 0.27), shoe, s * 0.1, 0.04, -0.03);
      add(new THREE.CapsuleGeometry(0.07, 0.74, 4, 10), jeans, s * 0.095, 0.5, 0, 0, s * 0.02);
      add(new THREE.CapsuleGeometry(0.048, 0.5, 4, 8), jacket, s * 0.235, 1.13, 0.01, 0.06, s * 0.09);
      add(new THREE.SphereGeometry(0.046, 10, 8), skin, s * 0.262, 0.83, 0.0);
    }
    add(new THREE.CapsuleGeometry(0.15, 0.2, 4, 12), jeans, 0, 0.93, 0, 0, Math.PI / 2, 1, 1, 0.75);
    add(new THREE.CapsuleGeometry(0.165, 0.4, 6, 14), jacket, 0, 1.2, 0, 0, 0, 1, 1, 0.66);
    add(new THREE.CylinderGeometry(0.05, 0.055, 0.1, 10), skin, 0, 1.47, 0);
    add(new THREE.SphereGeometry(0.105, 16, 12), skin, 0, 1.6, -0.01, 0, 0, 0.92, 1.12, 1);
    // Hair: over the crown and the back of the head, falling to the shoulders
    add(new THREE.SphereGeometry(0.116, 16, 12), hair, 0, 1.625, 0.012, 0, 0, 0.98, 1.1, 1.02);
    add(new THREE.CapsuleGeometry(0.1, 0.2, 4, 12), hair, 0, 1.44, 0.05, -0.12, 0, 1.05, 1, 0.55);
    this.group.add(this.figure);
    this.group.scale.setScalar(METRE);
    this.group.name = 'avatar';
    this.group.visible = false;
  }

  /**
   * Each frame. `surface`: Earth's surface mesh (unit sphere frame); `eyeWorld`/`lookWorld`: the
   * eye and its view direction (world); `eyeHeightKm`: over the ground; `sunUp`: the Sun's height
   * (sine), for the sky's light; `timeSec` for the breathing.
   */
  public update(on: boolean, surface: THREE.Object3D, eyeWorld: THREE.Vector3, lookWorld: THREE.Vector3, eyeHeightKm: number, sunUp: number, timeSec: number): void {
    this.group.visible = on;
    if (!on) return;
    if (this.group.parent !== surface) surface.add(this.group);
    const t = this.tmp;
    surface.updateWorldMatrix(true, false);
    t.inv.copy(surface.matrixWorld).invert();
    const eye = eyeWorld.clone().applyMatrix4(t.inv);
    t.up.copy(eye).normalize();
    t.fwd.copy(lookWorld).transformDirection(t.inv);
    t.fwd.addScaledVector(t.up, -t.fwd.dot(t.up));
    if (t.fwd.lengthSq() < 1e-12) t.fwd.set(1, 0, 0).addScaledVector(t.up, -t.up.x);
    t.fwd.normalize();
    t.right.crossVectors(t.fwd, t.up).normalize();
    // Feet on the ground the eye stands on, 8 m ahead (the whole figure in the frame) and a little to the side
    const feet = eye.addScaledVector(t.up, -eyeHeightKm / 6378.137).addScaledVector(t.fwd, 8 * METRE).addScaledVector(t.right, 0.6 * METRE);
    this.group.position.copy(feet);
    // Local axes: Y up, -Z ahead (the figure faces the way the view looks)
    t.m.makeBasis(t.right, t.up, t.fwd.clone().negate());
    this.group.quaternion.setFromRotationMatrix(t.m);
    // A slow breath and a slight shift of weight
    const b = Math.sin(timeSec * 1.4);
    this.figure.scale.set(1, 1 + 0.006 * b, 1);
    this.figure.rotation.z = 0.012 * Math.sin(timeSec * 0.35);
    const day = THREE.MathUtils.smoothstep(sunUp, -0.12, 0.05);
    const high = THREE.MathUtils.smoothstep(sunUp, 0.02, 0.3);
    this.sky.value.setRGB(0.55 + (0.36 - 0.55) * high, 0.45 + (0.46 - 0.45) * high, 0.42 + (0.62 - 0.42) * high).multiplyScalar(0.1 + 0.95 * day);
  }

  public dispose(): void {
    this.figure.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      }
    });
    this.group.removeFromParent();
  }
}
