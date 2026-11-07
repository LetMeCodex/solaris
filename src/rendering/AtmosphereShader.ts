import * as THREE from 'three';
import { SUN_WORLD } from './RenderOrigin';
import { AIR, AirProfile } from './AirProfiles';

/**
 * Atmospheres from real air.
 *
 * Each world with an atmosphere gets a shell reaching to the top of its air (Earth: 100 km). For
 * every pixel the shell covers, the fragment shader follows the view ray through a spherical
 * atmosphere (single scattering: Rayleigh + Mie with Henyey–Greenstein phase, plus absorption),
 * stopping at the ground, and composites the result over what is already drawn:
 *
 *     out = in-scattered sunlight + background × transmittance        (blend ONE, SRC_ALPHA)
 *
 * so the limb glows where the ray grazes the most air and fades smoothly to nothing at the top
 * (no edge, no outline), sunlight reddens through the long paths at the terminator, the night side
 * scatters nothing, and the world beneath is hazed by the air in front of it. Distances are in km
 * on the world's own scale (worlds may be drawn larger than life; the air is scaled with them).
 *
 * The same shell serves from inside the air (flying low, or the explorer close to the ground):
 * it switches to its back faces and draws over the ground with depth testing off, the ray march
 * itself finding where each pixel's ray meets the ground.
 */

/** Atmospheres exist for these worlds (the measured air in AirProfiles). */
export const ATMOSPHERE_CONFIGS: Record<string, AirProfile> = AIR;

/** Shell radius relative to the world's radius: the top of the air. */
export function atmosphereShellScale(name: string, radiusKm: number): number {
  const air = AIR[name];
  if (!air || !(radiusKm > 0)) return 1;
  return 1 + air.topKm / radiusKm;
}

/** Sunlight scale for the scattering (matches the brightness the worlds are lit at). */
export const ATMOSPHERE_SUN_POWER = 13;

const VERT = /* glsl */ `
  varying vec3 vWorldPosition;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPosition = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uSunWorld;
  uniform vec3 uCenter;        // the world's centre, render units (frame being drawn)
  uniform float uKmPerUnit;    // km per render unit on this world's scale
  uniform float uRadius;       // ground, km
  uniform float uTop;          // top of the air above the ground, km
  uniform float uHR;
  uniform float uHM;
  uniform vec3 uBetaR;
  uniform float uBetaM;
  uniform vec3 uMieTint;
  uniform float uMieG;
  uniform vec3 uAbsorb;
  uniform float uSunPower;
  varying vec3 vWorldPosition;

  vec2 sphere(vec3 o, vec3 d, float r) {
    float b = dot(o, d);
    float c = dot(o, o) - r * r;
    float h = b * b - c;
    if (h < 0.0) return vec2(1e9, -1e9);
    h = sqrt(h);
    return vec2(-b - h, -b + h);
  }

  // Optical depth (Rayleigh, Mie) from p to the Sun; blocked = the world is in the way
  vec2 sunDepth(vec3 p, vec3 sunDir, out float lit) {
    vec2 g = sphere(p, sunDir, uRadius);
    // Soft terminator: the Sun is a disc, not a point
    float b = dot(p, sunDir);
    float closest = sqrt(max(0.0, dot(p, p) - b * b));
    lit = (b > 0.0) ? 1.0 : smoothstep(uRadius * 0.995, uRadius * 1.004, closest);
    float far = sphere(p, sunDir, uRadius + uTop).y;
    float ds = max(far, 0.0) / 4.0;
    vec2 od = vec2(0.0);
    for (int i = 0; i < 4; i++) {
      vec3 q = p + sunDir * ds * (float(i) + 0.5);
      float h = max(0.0, length(q) - uRadius);
      od += vec2(exp(-h / uHR), exp(-h / uHM)) * ds;
    }
    return od;
  }

  void main() {
    vec3 ro = (cameraPosition - uCenter) * uKmPerUnit;
    vec3 rd = normalize(vWorldPosition - cameraPosition);
    vec3 sunDir = normalize(uSunWorld - uCenter);
    float rTop = uRadius + uTop;
    vec2 a = sphere(ro, rd, rTop);
    if (a.y <= 0.0) discard;
    float t0 = max(0.0, a.x);
    float t1 = a.y;
    vec2 gnd = sphere(ro, rd, uRadius);
    bool hitsGround = gnd.x > 0.0;
    if (hitsGround) t1 = min(t1, gnd.x);
    if (t1 <= t0) discard;

    const int STEPS = 12;
    float ds = (t1 - t0) / float(STEPS);
    vec3 sumR = vec3(0.0);
    vec3 sumM = vec3(0.0);
    vec2 odView = vec2(0.0);
    for (int i = 0; i < STEPS; i++) {
      vec3 p = ro + rd * (t0 + ds * (float(i) + 0.5));
      float h = max(0.0, length(p) - uRadius);
      vec2 dens = vec2(exp(-h / uHR), exp(-h / uHM)) * ds;
      odView += dens * 0.5;
      float lit;
      vec2 odSun = sunDepth(p, sunDir, lit);
      vec3 tau = uBetaR * (odView.x + odSun.x) + uBetaM * 1.1 * (odView.y + odSun.y) + uAbsorb * (odView.x + odSun.x);
      vec3 att = exp(-tau) * lit;
      sumR += att * dens.x;
      sumM += att * dens.y;
      odView += dens * 0.5;
    }
    float mu = dot(rd, sunDir);
    float phaseR = 3.0 / (16.0 * 3.14159265) * (1.0 + mu * mu);
    float g = uMieG;
    float phaseM = 3.0 / (8.0 * 3.14159265) * ((1.0 - g * g) * (1.0 + mu * mu)) / ((2.0 + g * g) * pow(1.0 + g * g - 2.0 * g * mu, 1.5));
    vec3 inscatter = uSunPower * (sumR * uBetaR * phaseR + sumM * uBetaM * uMieTint * phaseM);

    vec3 trans = exp(-(uBetaR * odView.x + uBetaM * 1.1 * odView.y + uAbsorb * odView.x));
    float T = dot(trans, vec3(0.2126, 0.7152, 0.0722));
    // Seen from under a daylit sky, the stars drown: the sky is far brighter than they are
    if (!hitsGround) T *= exp(-dot(inscatter, vec3(0.2126, 0.7152, 0.0722)) * 14.0);
    gl_FragColor = vec4(inscatter, T);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export class AtmosphereShader {
  /**
   * The atmosphere material for a world, or null if it has no air.
   * @param radiusKm the world's mean radius (the ground of the scattering)
   */
  public static createAtmosphereMaterial(planetName: string, radiusKm = 6371): THREE.ShaderMaterial | null {
    const air = AIR[planetName];
    if (!air) return null;
    return new THREE.ShaderMaterial({
      uniforms: {
        uSunWorld: SUN_WORLD,
        uCenter: { value: new THREE.Vector3() },
        uKmPerUnit: { value: 1 },
        uRadius: { value: radiusKm },
        uTop: { value: air.topKm },
        uHR: { value: air.scaleHeightKm },
        uHM: { value: air.mieScaleHeightKm },
        uBetaR: { value: new THREE.Vector3(...air.rayleigh) },
        uBetaM: { value: air.mie },
        uMieTint: { value: new THREE.Vector3(...air.mieTint) },
        uMieG: { value: air.mieG },
        uAbsorb: { value: new THREE.Vector3(...air.absorption) },
        uSunPower: { value: ATMOSPHERE_SUN_POWER },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.SrcAlphaFactor,
      blendSrcAlpha: THREE.ZeroFactor,
      blendDstAlpha: THREE.OneFactor,
    });
  }

  /**
   * Keep a shell's centre and scale current every draw, and switch it to the inside view (back
   * faces, drawn over the ground) when the camera is within the air.
   * @param shellScale shell radius over the world's drawn radius
   */
  public static attach(mesh: THREE.Mesh, visualRadius: number, radiusKm: number, shellScale: number, polarScale = 1): void {
    const mat = mesh.material as THREE.ShaderMaterial;
    const centre = new THREE.Vector3();
    const camPos = new THREE.Vector3();
    const local = new THREE.Vector3();
    const q = new THREE.Quaternion();
    mat.uniforms.uKmPerUnit.value = radiusKm / visualRadius;
    mesh.onBeforeRender = (_r, _s, camera) => {
      centre.setFromMatrixPosition(mesh.matrixWorld);
      mat.uniforms.uCenter.value.copy(centre);
      camPos.setFromMatrixPosition(camera.matrixWorld);
      // The world is drawn oblate (its spin axis is this mesh's local Y): the scattering's ground
      // follows the surface under the camera, or close to the ground the eye would sit "below" a
      // spherical ground and every ray would run through solid air (a black screen)
      if (polarScale !== 1) {
        mesh.getWorldQuaternion(q);
        local.subVectors(camPos, centre).applyQuaternion(q.invert()).normalize();
        const r = 1 / Math.sqrt(local.x * local.x + local.z * local.z + (local.y * local.y) / (polarScale * polarScale));
        mat.uniforms.uRadius.value = radiusKm * r;
      }
      const inside = camPos.distanceTo(centre) < visualRadius * shellScale * 1.0005;
      const side = inside ? THREE.BackSide : THREE.FrontSide;
      if (mat.side !== side) {
        mat.side = side;
        mat.depthTest = !inside;
      }
    };
  }
}
