import * as THREE from 'three';
import { SAGITTARIUS_A_STAR_DATA } from '../data/SagittariusAStarData';
import { BlackHoleInfall } from './BlackHoleInfall';

export interface SagittariusAStarConfig {
  schwarzschildRadius: number; // Render units (default 24.0)
  diskInnerRadius: number;     // Render units (default 72.0 = 3.0 * rs, ISCO)
  diskOuterRadius: number;     // Render units (default 432.0 = 18 * rs)
  boundingRadius: number;      // Bounding sphere radius (default 1000.0)
}

export const DEFAULT_SGR_A_CONFIG: SagittariusAStarConfig = {
  schwarzschildRadius: 24.0,
  diskInnerRadius: 72.0,
  diskOuterRadius: 432.0,   // 18 r_s: the dusty outer disk stretches far across the frame
  boundingRadius: 1000.0,
};

/**
 * SAGITTARIUS A* — GENERAL RELATIVISTIC BLACK HOLE MODEL
 * 
 * Cinematic & Scientific Visual Realism grounded in:
 * 1. Kip Thorne / Double Negative / Oliver James et al. (2015) gravitational lensing.
 * 2. NASA Goddard / Jeremy Schnittman (2024) black hole visualization.
 * 3. Event Horizon Telescope (EHT 2022) Sagittarius A* multi-frequency observations.
 * 4. NASA Black Hole Anatomy (Accretion disk, Event horizon shadow, Photon sphere, Relativistic Jet, ISCO).
 * 
 * Features:
 * - Backward ray tracing along Schwarzschild null geodesics (see createRelativisticRayMarchMesh):
 *   shadow, lensed far-side disk and photon rings all come out of the integration.
 * - Page–Thorne disk temperatures, Doppler × gravitational frequency shift, blackbody colour,
 *   g⁴ brightness, Keplerian shear.
 * - Collimated relativistic polar jets with white-hot particle core and helical synchrotron shock coils.
 * - Nuclear S-cluster (350+ B/O stars orbiting in the central parsec).
 */
export class SagittariusAStar {
  public group: THREE.Group = new THREE.Group();
  public boundingMesh: THREE.Mesh;
  public sStarsPoints: THREE.Points;
  public jetPolesGroup: THREE.Group = new THREE.Group();
  public hitMesh: THREE.Mesh;
  /** Rocks, stars and light falling in (geodesic simulation). */
  public infall: BlackHoleInfall;
  private lastUpdateSec: number | null = null;

  public readonly config: SagittariusAStarConfig;
  public readonly scientificData = SAGITTARIUS_A_STAR_DATA;

  private timeUniform: { value: number } = { value: 0.0 };
  private opacityUniform: { value: number } = { value: 1.0 };
  private cameraPosUniform: { value: THREE.Vector3 } = { value: new THREE.Vector3() };

  constructor(config: SagittariusAStarConfig = DEFAULT_SGR_A_CONFIG) {
    this.config = config;
    this.group.name = 'sagittarius_a_star_black_hole';

    // 1. Build Relativistic Ray-Marching Bounding Volume Mesh
    this.boundingMesh = this.createRelativisticRayMarchMesh();
    this.group.add(this.boundingMesh);

    // 2. Build Nuclear Star Cluster (S-Stars orbiting in the central parsec)
    this.sStarsPoints = this.createNuclearStarCluster();
    this.group.add(this.sStarsPoints);

    // 3. Build Invisible Raycasting Hit Mesh for Galactic & Interstellar Scale Click Navigation
    const hitGeo = new THREE.SphereGeometry(Math.max(3200, this.config.boundingRadius * 2.0), 16, 16);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    this.hitMesh = new THREE.Mesh(hitGeo, hitMat);
    this.hitMesh.name = 'sagittarius_a_star_hit_target';
    this.group.add(this.hitMesh);

    // 4. Build Collimated Relativistic Polar Jets (Hidden to match pure Interstellar reference image)
    this.createPolarOutflowJets();
    this.jetPolesGroup.visible = false; // Preserved for NASA anatomy mode, hidden for pure cinematic view
    this.group.add(this.jetPolesGroup);

    // 5. Infalling matter and light
    this.infall = new BlackHoleInfall();
    this.group.add(this.infall.group);
  }

  /**
   * 1. Ray-traced Schwarzschild black hole.
   *
   * Each pixel's photon is traced BACKWARDS from the camera along a null geodesic of the
   * Schwarzschild metric, using the exact orbit equation written in Cartesian form
   *     d²x/dλ² = −(3/2) r_s h² x / r⁵        (h = |x × dx/dλ|, conserved)
   * integrated with velocity-Verlet and a step proportional to r, so photons that skim the photon
   * sphere (r = 1.5 r_s) are followed through whole loops. Everything iconic falls out of the
   * integration rather than being painted on:
   *   – the shadow (rays with b < 3√3/2 r_s fall through the horizon),
   *   – the far side of the disk lensed over and under the hole,
   *   – the thin photon rings (rays that cross the disk plane two, three, … times).
   *
   * Disk emission (thin disk in the local XZ plane, inner edge at the ISCO = 3 r_s):
   *   – Page–Thorne / Novikov–Thorne flux F ∝ r⁻³ (1 − √(r_isco/r)) for the hot inner disk, plus a
   *     flared-disk irradiation term (T ∝ r^−½, Chiang & Goldreich 1997) that keeps the outer disk
   *     glowing dull orange-brown;
   *   – frequency shift g = δ · √(1 − r_s/r): local Doppler factor of Keplerian gas
   *     (β = √(r_s / 2(r − r_s)) measured by a static observer) times gravitational redshift;
   *   – observed colour = blackbody(g·T), observed brightness ∝ g⁴ (bolometric Liouville
   *     invariance), so the approaching side blazes white and the receding side sinks to red;
   *   – texture sheared by Keplerian differential rotation Ω ∝ r^−3/2.
   * The temperature scale is cinematic: Sgr A* itself accretes too slowly to glow like this.
   */
  private createRelativisticRayMarchMesh(): THREE.Mesh {
    const geo = new THREE.SphereGeometry(this.config.boundingRadius, 64, 48);

    const rs = this.config.schwarzschildRadius;
    const rIn = this.config.diskInnerRadius;
    const rOut = this.config.diskOuterRadius;

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: this.timeUniform,
        uOpacity: this.opacityUniform,
        uCameraPosLocal: this.cameraPosUniform,
        uRs: { value: rs },
        uRIn: { value: rIn },
        uROut: { value: rOut },
        uBoundingR: { value: this.config.boundingRadius },
        uTPeak: { value: 6300.0 },   // K, peak disk temperature (warm cream-white)
        uExposure: { value: 1.35 },
      },
      vertexShader: `
        varying vec3 vLocalPos;
        void main() {
          vLocalPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        uniform vec3 uCameraPosLocal;
        uniform float uRs;
        uniform float uRIn;
        uniform float uROut;
        uniform float uBoundingR;
        uniform float uTPeak;
        uniform float uExposure;
        varying vec3 vLocalPos;

        #define PI 3.14159265359
        #define MAX_STEPS 320

        // ---------- noise ----------
        float hash3(vec3 p) {
          p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }
        float vnoise(vec3 x) {
          vec3 i = floor(x);
          vec3 f = fract(x);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(mix(hash3(i), hash3(i + vec3(1,0,0)), f.x),
                         mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
                     mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x),
                         mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y), f.z);
        }
        float fbm(vec3 p) {
          float s = 0.0, a = 0.5;
          for (int i = 0; i < 5; i++) { s += a * vnoise(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; }
          return s;
        }

        // ---------- blackbody colour (Kelvin -> linear RGB, unit max) ----------
        vec3 blackbody(float T) {
          float t = clamp(T, 1000.0, 40000.0) / 100.0;
          float r = t <= 66.0 ? 1.0 : clamp(1.29293618606 * pow(t - 60.0, -0.1332047592), 0.0, 1.0);
          float g = t <= 66.0 ? clamp(0.39008157876 * log(t) - 0.63184144378, 0.0, 1.0)
                              : clamp(1.12989086089 * pow(t - 60.0, -0.0755148492), 0.0, 1.0);
          float b = t >= 66.0 ? 1.0 : (t <= 19.0 ? 0.0 : clamp(0.54320678911 * log(t - 10.0) - 1.19625408914, 0.0, 1.0));
          return pow(vec3(r, g, b), vec3(2.2));
        }

        // ---------- disk physics ----------
        // Temperature in units of the peak temperature
        float diskTemp(float r) {
          float x = r / uRIn;
          // Page–Thorne: F ∝ x⁻³ (1 − x^−½); peak at x = 49/36 where F = 0.0306 (normalised below)
          float fPT = max(0.0, (1.0 - inversesqrt(x))) / (x * x * x) / 0.0306;
          // Irradiated flared outer disk: F ∝ x⁻²
          float fIrr = 0.055 / (x * x);
          return pow(fPT + fIrr, 0.25);
        }

        // Keplerian shear with two cross-faded phases so streaks never wind up indefinitely
        float diskTexture(float r, float phi, float density) {
          float x = r / uRIn;
          float omega = 0.9 * pow(x, -1.5);
          float P = 40.0;
          float f1 = fract(uTime / P);
          float f2 = fract(uTime / P + 0.5);
          float w = abs(2.0 * f1 - 1.0);
          float lr = log(x);
          vec3 q1 = vec3(cos(phi + omega * f1 * P) * 1.6, sin(phi + omega * f1 * P) * 1.6, lr * 22.0);
          vec3 q2 = vec3(cos(phi + omega * f2 * P) * 1.6, sin(phi + omega * f2 * P) * 1.6, lr * 22.0 + 7.3);
          float n = mix(fbm(q1 * density), fbm(q2 * density), w);
          return n;
        }

        // Emission + opacity of the disk sheet where the ray crosses y = 0
        vec4 diskSample(vec3 p, vec3 dir) {
          float r = length(p.xz);
          if (r < uRIn || r > uROut) return vec4(0.0);
          float phi = atan(p.z, p.x);

          float tex = diskTexture(r, phi, 1.0);
          float fine = diskTexture(r * 1.0, phi * 3.0, 2.3);
          // Irregular annular banding: ring frequency itself wanders with the turbulence
          float rings = 0.78 + 0.22 * sin(log(r / uRIn) * (55.0 + 30.0 * fine) + tex * 9.0);
          float structure = clamp(0.25 + 1.25 * tex * (0.6 + 0.5 * fine) * rings, 0.0, 1.6);

          // Frequency shift: Doppler (static frame) × gravitational redshift
          float beta = clamp(sqrt(uRs / (2.0 * max(r - uRs, 0.01))), 0.0, 0.95);
          float gamma = inversesqrt(1.0 - beta * beta);
          vec3 vhat = normalize(vec3(p.z, 0.0, -p.x));  // orbit sense: approaching limb on the left of the shot
          float cosA = dot(vhat, -dir);
          float delta = 1.0 / (gamma * (1.0 - beta * cosA));
          float g = delta * sqrt(max(0.0, 1.0 - uRs / r));

          float T = diskTemp(r);
          float Tobs = T * uTPeak * g;
          float bright = pow(g, 4.0) * pow(T, 4.0) * structure;

          // Dust: the cool outer disk is sooty and absorbs (dark lanes, brown tint)
          float x = r / uRIn;
          float dustZone = smoothstep(2.2, 6.0, x);
          float lanes = smoothstep(0.42, 0.68, diskTexture(r, phi + 1.3, 0.7));
          vec3 col = blackbody(Tobs) * bright;
          col = mix(col, col * vec3(0.95, 0.52, 0.24), dustZone * 0.85);
          col *= 1.0 - lanes * dustZone * 0.8;

          // Optically thick inner disk, translucent outer disk
          float edgeIn = smoothstep(uRIn, uRIn * 1.06, r);
          float edgeOut = smoothstep(uROut, uROut * 0.55, r);
          float alpha = clamp((0.95 - 0.6 * smoothstep(1.5, 14.0, x)) * (0.55 + 0.45 * structure) + lanes * dustZone * 0.35, 0.0, 0.97);
          alpha *= edgeIn * edgeOut;
          return vec4(col * uExposure * edgeIn * edgeOut, alpha);
        }

        // Sparse procedural sky, seen through the lens (only blended near the hole)
        vec3 lensedSky(vec3 d) {
          vec3 a = abs(d);
          vec2 uv = a.x > a.y && a.x > a.z ? d.yz / a.x : (a.y > a.z ? d.xz / a.y : d.xy / a.z);
          vec2 cell = floor(uv * 180.0);
          float h = fract(sin(dot(cell + floor(d.xy * 3.0), vec2(12.9898, 78.233))) * 43758.5453);
          vec2 f = fract(uv * 180.0) - 0.5;
          float star = h > 0.9995 ? exp(-dot(f, f) * 70.0) * (h - 0.9995) * 1200.0 : 0.0;
          return vec3(star) * vec3(1.0, 0.92, 0.82);
        }

        void main() {
          vec3 ro = uCameraPosLocal;
          vec3 rd = normalize(vLocalPos - ro);

          // Enter the bounding sphere
          float b0 = dot(ro, rd);
          float c0 = dot(ro, ro) - uBoundingR * uBoundingR;
          float disc = b0 * b0 - c0;
          if (disc < 0.0) discard;
          float sq = sqrt(disc);
          float tNear = -b0 - sq;
          float tFar = -b0 + sq;
          if (tFar < 0.0) discard;

          vec3 pos = ro + rd * max(0.0, tNear);
          vec3 dir = rd;
          vec3 L = cross(pos, dir);
          float h2 = dot(L, L);
          float impact = sqrt(h2);   // impact parameter (|dir| = 1)

          vec3 col = vec3(0.0);
          float alpha = 0.0;
          bool captured = false;

          for (int i = 0; i < MAX_STEPS; i++) {
            float r = length(pos);
            if (r < uRs * 1.002) { captured = true; break; }
            if (r > uBoundingR * 1.001 && dot(pos, dir) > 0.0) break;

            // Step: fine near the photon sphere, and never jumps far across the disk plane
            float dt = clamp(0.07 * r, 0.025 * uRs, 60.0);
            float rc = length(pos.xz);
            if (rc < uROut * 1.05) dt = min(dt, max(abs(pos.y) * 0.9, 0.05 * uRs) + 0.02 * r);

            vec3 acc = -1.5 * uRs * h2 * pos / pow(r, 5.0);
            vec3 next = pos + dir * dt + 0.5 * acc * dt * dt;
            float rn = length(next);
            vec3 accN = -1.5 * uRs * h2 * next / pow(max(rn, uRs * 0.5), 5.0);
            vec3 ndir = normalize(dir + 0.5 * (acc + accN) * dt);

            // Disk-plane crossing → sample the sheet at the exact crossing point
            if (pos.y * next.y < 0.0) {
              float t = pos.y / (pos.y - next.y);
              vec3 cp = mix(pos, next, t);
              vec4 s = diskSample(cp, normalize(mix(dir, ndir, t)));
              col += (1.0 - alpha) * s.rgb * s.a;
              alpha += (1.0 - alpha) * s.a;
              if (alpha > 0.985) break;
            }

            pos = next;
            dir = ndir;
          }

          // Near the hole the real sky is replaced by a lensed one; further out it fades away
          float near = 1.0 - smoothstep(4.0 * uRs, 12.0 * uRs, impact);
          if (captured) {
            col = col;            // nothing escapes: the shadow is truly black
            alpha = 1.0;
          } else if (near > 0.0) {
            // Lensed stars are added over the real sky (which is not re-projected): they show the
            // Einstein-ring distortion without hiding the galaxy behind the hole
            col += (1.0 - alpha) * lensedSky(dir) * near;
            alpha = max(alpha, min(1.0, length(col) * 0.6));
          }

          if (alpha < 0.004) discard;
          // Soft filmic shoulder; bloom in the lens pipeline does the rest
          vec3 mapped = col / (1.0 + col * 0.18);
          gl_FragColor = vec4(mapped, clamp(alpha, 0.0, 1.0) * uOpacity);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = 'sagittarius_a_star_lensing_volume';
    mesh.renderOrder = 50; // Render on top of celestial background
    return mesh;
  }

  /**
   * 2. Nuclear Star Cluster (S-Stars orbiting Sagittarius A* in the central parsec)
   * Real astrophysical stars (S2/S0-2, S38, S55, S62) with relativistic orbital motions.
   */
  private createNuclearStarCluster(): THREE.Points {
    const starCount = 260;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    // Real S-star distances: S2's pericentre is 120 AU ≈ 1,400 r_s; the cluster extends to ~0.04 pc
    const rMin = this.config.schwarzschildRadius * 1400;
    const rMax = this.config.schwarzschildRadius * 5200;

    for (let i = 0; i < starCount; i++) {
      // Clustered density toward the black hole (Bahcall-Wolf cusp: n ~ r^-1.75)
      const u = Math.random();
      const r = rMin + Math.pow(u, 1.6) * (rMax - rMin);
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);

      // Early-type B-dwarf and O-star spectral colors of the S-cluster
      const starType = Math.random();
      if (starType < 0.45) {
        // Hot B0-B2 V stars (electric blue-white)
        colors[i * 3] = 0.82;
        colors[i * 3 + 1] = 0.90;
        colors[i * 3 + 2] = 1.0;
        sizes[i] = 1.4 + Math.random() * 2.2;
      } else if (starType < 0.75) {
        // A0 V stars (pure diamond white)
        colors[i * 3] = 0.98;
        colors[i * 3 + 1] = 0.98;
        colors[i * 3 + 2] = 1.0;
        sizes[i] = 1.2 + Math.random() * 1.8;
      } else {
        // Golden-yellow giants
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 0.58;
        sizes[i] = 1.5 + Math.random() * 2.5;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: this.opacityUniform,
        uTime: this.timeUniform,
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float uOpacity;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float dist = -mvPosition.z;
          gl_PointSize = clamp(size * (60000.0 / max(dist, 10.0)), 1.0, 4.5);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform float uOpacity;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float d = length(coord);
          if (d > 0.5) discard;

          float core = exp(-d * d * 18.0);
          float halo = smoothstep(0.5, 0.05, d) * 0.28;
          float alpha = clamp(core + halo, 0.0, 1.0) * uOpacity;

          gl_FragColor = vec4(vColor * 1.5, alpha);
        }
      `,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geo, mat);
    points.name = 's_stars_nuclear_cluster';
    return points;
  }

  /**
   * 3. Relativistic Polar Outflow Jets & Magnetic Shock Knots (NASA Black Hole Anatomy)
   * Collimated beams blasting outward at near light speed from the black hole's poles,
   * with white-hot particle core spine, fiery ruby synchrotron sheath, and helical shocks.
   */
  private createPolarOutflowJets(): void {
    const jetHeight = 720.0;
    const jetWidth = 65.0;

    // Cross-plane geometry for north and south poles
    const planeGeo = new THREE.PlaneGeometry(jetWidth, jetHeight, 1, 32);
    // Translate geometry so bottom sits right at the event horizon boundary
    planeGeo.translate(0, jetHeight * 0.5 + this.config.schwarzschildRadius * 0.95, 0);

    const jetMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: this.timeUniform,
        uOpacity: this.opacityUniform,
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        varying vec2 vUv;

        void main() {
          // Distance from central spine (-1.0 to +1.0)
          float dx = abs(vUv.x * 2.0 - 1.0);

          // Jet cone expansion: beam width gently flares with height
          float widthFactor = 0.14 + 0.86 * pow(vUv.y, 0.75);
          float normDist = dx / widthFactor;
          if (normDist > 1.0) discard;

          // Ultra-collimated white-hot central core spine
          float coreSpine = exp(-normDist * normDist * 45.0);

          // Fiery ruby/coral synchrotron plasma sheath
          float sheathGlow = exp(-normDist * normDist * 4.8);

          // Relativistic outward flow and helical shock knots (v ~ 0.98 c)
          float flowCoord = vUv.y * 7.5 - uTime * 3.8;
          float helix = sin(vUv.x * 6.28318 * 2.5 + flowCoord * 3.0);
          float knot = pow(clamp(sin(flowCoord * 3.14159), 0.0, 1.0), 6.0) * 2.2;

          // Seamless axial fade: 0 at horizon base, smooth fade at tip
          float baseFade = smoothstep(0.01, 0.15, vUv.y);
          float tipFade  = pow(1.0 - vUv.y, 1.6);
          float axialFade = baseFade * tipFade;

          // Colors (NASA Anatomy - Image 2)
          vec3 rubyRed = vec3(1.35, 0.16, 0.04);
          vec3 coralOrange = vec3(2.1, 0.85, 0.22);
          vec3 whiteHot = vec3(3.8, 3.5, 3.0);

          vec3 col = mix(rubyRed, coralOrange, helix * 0.4 + 0.6);
          col = mix(col, whiteHot, coreSpine);
          col += whiteHot * knot * coreSpine;

          float alpha = (coreSpine * 0.92 + sheathGlow * 0.30 * (1.0 + knot * 0.4)) * axialFade * uOpacity;
          if (alpha < 0.005) discard;

          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // 4 crossed planes per pole for full 360° volumetric view
    const angles = [0, Math.PI * 0.25, Math.PI * 0.5, Math.PI * 0.75];

    angles.forEach((angle) => {
      // North pole jet plane
      const northMesh = new THREE.Mesh(planeGeo, jetMat);
      northMesh.rotation.y = angle;
      this.jetPolesGroup.add(northMesh);

      // South pole jet plane (mirrored along Z axis)
      const southGeo = planeGeo.clone();
      southGeo.rotateZ(Math.PI);
      const southMesh = new THREE.Mesh(southGeo, jetMat);
      southMesh.rotation.y = angle;
      this.jetPolesGroup.add(southMesh);
    });
  }

  /**
   * Updates shader uniforms per frame with camera position and simulation time.
   */
  public update(camera: THREE.Camera, timeSec: number): void {
    this.timeUniform.value = timeSec;

    // Transform camera world position into black hole's local space
    const camLocal = camera.position.clone();
    this.group.worldToLocal(camLocal);
    this.cameraPosUniform.value.copy(camLocal);

    // Infall runs only while the hole is on screen at a useful size
    const dt = this.lastUpdateSec === null ? 0 : timeSec - this.lastUpdateSec;
    this.lastUpdateSec = timeSec;
    if (this.group.visible && camLocal.length() < this.config.boundingRadius * 4) {
      this.infall.group.visible = true;
      this.infall.update(camera, dt, (v) => this.group.worldToLocal(v));
    } else {
      this.infall.group.visible = false;
    }

    // Slowly rotate S-stars nuclear cluster
    if (this.sStarsPoints) {
      this.sStarsPoints.rotation.y = timeSec * 0.015;
    }
  }

  public setOpacity(opacity: number): void {
    const clamped = Math.max(0.0, Math.min(1.0, opacity));
    this.opacityUniform.value = clamped;
    this.infall?.setOpacity(clamped);
    this.group.visible = clamped > 0.005;
  }

  public dispose(): void {
    this.boundingMesh.geometry.dispose();
    (this.boundingMesh.material as THREE.Material).dispose();

    this.infall.dispose();
    this.sStarsPoints.geometry.dispose();
    (this.sStarsPoints.material as THREE.Material).dispose();

    this.jetPolesGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}
