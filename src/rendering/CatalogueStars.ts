import * as THREE from 'three';
import { CoordinateFrames } from '../astronomy/CoordinateFrames';

/**
 * The real night sky: every Hipparcos star in public/data/stars.json (≈12,600, to V ≈ 7), drawn
 * from its measured brightness and colour.
 *
 * – Colour: B−V → effective temperature (Ballesteros 2012,
 *     T = 4600 K · (1/(0.92·BV + 1.7) + 1/(0.92·BV + 0.62)) ) → blackbody RGB, with a gentle
 *   saturation lift so O/B blue, G gold and M red read the way the eye sees them in a telescope.
 * – Brightness and size: Pogson's law, flux ∝ 10^(−0.4 m). Faint stars are single pin-pricks; brighter
 *   ones grow a soft Airy-like glow; the very brightest (m < 1.5) carry diffraction spikes and a halo.
 * – Scintillation: none in vacuum (stars do not twinkle without air), a faint sensor shimmer only;
 *   standing on a world with an atmosphere they twinkle, with colour flicker for the bright ones.
 * – Travel: at speed the sky shows relativistic aberration and Doppler shift. Directions crowd
 *   towards the heading, cos θ' = (cos θ + β)/(1 + β cos θ), and each star's light is shifted by
 *   δ = 1/(γ(1 − β cos θ')): bluer and brighter ahead, redder and dimmer behind. β is a visual
 *   "warp" derived from the camera's speed (our flights are far faster than light).
 * – Exposure: the sky dims when a sunlit world fills the frame, as a real camera's would.
 */

type StarRow = [number, number, number, number, number, number | null, number | null, string | null, string];

const CLASS_TEMP: Record<string, number> = { O: 35000, B: 15000, A: 9000, F: 6800, G: 5600, K: 4400, M: 3300 };

/** Ballesteros (2012) B−V → effective temperature, K. */
export function bvToKelvin(bv: number): number {
  return 4600 * (1 / (0.92 * bv + 1.7) + 1 / (0.92 * bv + 0.62));
}

export class CatalogueStars {
  public points: THREE.Points;
  private uniforms: Record<string, THREE.IUniform>;
  private smoothedBeta = 0;
  private velDir = new THREE.Vector3(0, 0, -1);

  constructor(stars: StarRow[], radius: number) {
    const n = stars.length;
    const pos = new Float32Array(n * 3);
    const temp = new Float32Array(n);
    const mag = new Float32Array(n);
    const seed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const s = stars[i];
      const p = CoordinateFrames.icrfToThree([s[1], s[2], s[3]]);
      pos[i * 3] = p[0] * radius;
      pos[i * 3 + 1] = p[1] * radius;
      pos[i * 3 + 2] = p[2] * radius;
      temp[i] = s[5] !== null ? THREE.MathUtils.clamp(bvToKelvin(s[5]), 2400, 40000) : CLASS_TEMP[s[8]] ?? 5800;
      mag[i] = s[4];
      seed[i] = ((s[0] * 2654435761) % 1000) / 1000;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aTemp', new THREE.BufferAttribute(temp, 1));
    geo.setAttribute('aMag', new THREE.BufferAttribute(mag, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), Infinity);

    this.uniforms = {
      uTime: { value: 0 },
      uDpr: { value: Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1) },
      uBeta: { value: 0 },
      uVelDir: { value: new THREE.Vector3(0, 0, -1) },
      uTwinkle: { value: 0.06 },
      uExposure: { value: 1 },
      uRadius: { value: radius },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        attribute float aTemp;
        attribute float aMag;
        attribute float aSeed;
        uniform float uTime;
        uniform float uDpr;
        uniform float uBeta;
        uniform vec3 uVelDir;
        uniform float uTwinkle;
        uniform float uExposure;
        uniform float uRadius;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vSpikes;
        varying float vHalo;

        vec3 blackbody(float T) {
          float t = clamp(T, 1000.0, 40000.0) / 100.0;
          float r = t <= 66.0 ? 1.0 : clamp(1.29293618606 * pow(t - 60.0, -0.1332047592), 0.0, 1.0);
          float g = t <= 66.0 ? clamp(0.39008157876 * log(t) - 0.63184144378, 0.0, 1.0)
                              : clamp(1.12989086089 * pow(t - 60.0, -0.0755148492), 0.0, 1.0);
          float b = t >= 66.0 ? 1.0 : (t <= 19.0 ? 0.0 : clamp(0.54320678911 * log(t - 10.0) - 1.19625408914, 0.0, 1.0));
          return vec3(r, g, b);
        }

        void main() {
          // Relativistic aberration: tilt the star's direction towards the heading
          vec3 d = normalize(position);
          float doppler = 1.0;
          if (uBeta > 0.001) {
            float c = dot(d, uVelDir);
            float c2 = (c + uBeta) / (1.0 + uBeta * c);
            vec3 perp = d - c * uVelDir;
            float pl = length(perp);
            if (pl > 1e-5) d = normalize(uVelDir * c2 + perp / pl * sqrt(max(0.0, 1.0 - c2 * c2)));
            float gamma = inversesqrt(1.0 - uBeta * uBeta);
            doppler = 1.0 / (gamma * (1.0 - uBeta * c2));
          }
          vec3 p = d * uRadius;

          // Pogson: relative flux of the star (m = 0 → 1)
          float flux = pow(10.0, -0.4 * aMag) * pow(doppler, 3.0) * uExposure;

          // Scintillation (stronger and multi-frequency when there is air above us)
          float tw = 1.0 + uTwinkle * (
            sin(uTime * (3.1 + aSeed * 5.0) + aSeed * 40.0) * 0.6 +
            sin(uTime * (7.7 + aSeed * 11.0) + aSeed * 13.0) * 0.4);
          flux *= max(0.0, tw);

          // Colour: blackbody at the Doppler-shifted temperature, saturation lifted a little
          vec3 col = blackbody(aTemp * doppler);
          float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
          col = mix(vec3(l), col, 2.5); // legibility lift: hues true, saturation exaggerated as in astrophotography
          // Bright stars flicker in colour through an atmosphere
          col *= 1.0 + uTwinkle * 0.5 * vec3(sin(uTime * 9.0 + aSeed * 21.0), sin(uTime * 11.0 + aSeed * 7.0), sin(uTime * 13.0 + aSeed * 3.0)) * step(aMag, 2.0);
          vColor = max(col, vec3(0.0));

          // Size from brightness: pin-pricks for the faint, a glow for the bright
          float size = 1.2 + 6.0 * pow(flux, 0.42);
          vSpikes = smoothstep(1.5, -0.6, aMag + 2.5 * log(1.0 / max(doppler, 0.05)) / log(10.0)) * uExposure;
          vHalo = smoothstep(3.0, 0.0, aMag);
          size *= 1.0 + vSpikes * 2.6;
          vAlpha = clamp(pow(flux, 0.5) * 3.2, 0.05, 1.6);

          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp(size, 1.0, 44.0) * uDpr;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        varying float vSpikes;
        varying float vHalo;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float r = length(c);
          if (r > 0.5) discard;
          // Airy-like core with a faint first ring for the brighter stars
          float core = exp(-r * r * mix(60.0, 140.0, vSpikes));
          float ring = exp(-pow((r - 0.17) / 0.035, 2.0)) * 0.09 * vHalo;
          float halo = exp(-r * r * 9.0) * 0.22 * vHalo;
          // Four diffraction spikes (the classic secondary-mirror vanes), only on the brightest
          float spikes = 0.0;
          if (vSpikes > 0.01) {
            float sx = exp(-abs(c.y) * 160.0) * (1.0 - smoothstep(0.0, 0.5, abs(c.x)));
            float sy = exp(-abs(c.x) * 160.0) * (1.0 - smoothstep(0.0, 0.5, abs(c.y)));
            spikes = (sx + sy) * 0.55 * vSpikes;
          }
          float a = (core + ring + halo + spikes) * vAlpha;
          if (a < 0.004) discard;
          // Additive: alpha is applied once, here (not again by the blend)
          gl_FragColor = vec4(vColor * a, 1.0);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(geo, mat);
    this.points.name = 'hipparcos_stars';
    this.points.frustumCulled = false;
    this.points.renderOrder = 0;
  }

  /** Twinkle strength: 0.06 in vacuum (sensor shimmer), ~0.5 under an atmosphere. */
  public setScintillation(level: number): void {
    this.uniforms.uTwinkle.value = level;
  }

  /** 0..1 sky exposure (dimmed when a sunlit world fills the frame). */
  public setExposure(e: number): void {
    const u = this.uniforms.uExposure;
    u.value += (e - u.value) * 0.06;
  }

  /**
   * Per frame. `velocity` is the camera's perceived velocity (scaled to the view, see
   * SolarSystemScene); the visual warp β
   * rises smoothly with it and relaxes when the flight ends.
   */
  public update(timeSec: number, velocity: THREE.Vector3, enabled: boolean): void {
    this.uniforms.uTime.value = timeSec;
    const speed = velocity.length();
    const target = enabled ? 0.62 * THREE.MathUtils.smoothstep(speed, 25, 600) : 0;
    this.smoothedBeta += (target - this.smoothedBeta) * 0.05;
    if (speed > 1e-3) this.velDir.lerp(velocity.clone().normalize(), 0.1).normalize();
    this.uniforms.uBeta.value = this.smoothedBeta;
    (this.uniforms.uVelDir.value as THREE.Vector3).copy(this.velDir);
  }

  public dispose(): void {
    this.points.geometry.dispose();
    (this.points.material as THREE.Material).dispose();
  }
}
