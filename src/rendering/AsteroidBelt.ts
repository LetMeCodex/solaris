import * as THREE from 'three';
import { RenderSpaceTransform } from './RenderSpaceTransform';

interface AsteroidOrbitalElement {
  semiMajorAxisAU: number;
  eccentricity: number;
  inclinationRad: number;
  longNodeRad: number;
  argPeriRad: number;
  meanAnomalyEpochRad: number;
  meanMotionRadPerDay: number;
  scale: number;
}

// Deterministic 32-bit pseudo-random number generator (Mulberry32)
export function createSeededRng(seed: number = 19890825): () => number {
  let s = seed >>> 0;
  return function (): number {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class AsteroidBelt {
  public mesh: THREE.InstancedMesh;
  private count: number = 3200;
  private elements: AsteroidOrbitalElement[] = [];
  private dummy: THREE.Object3D = new THREE.Object3D();
  private transform: RenderSpaceTransform;
  private seed: number;

  constructor(transform: RenderSpaceTransform, seed: number = 19890825) {
    this.transform = transform;
    this.seed = seed;

    // Create irregular low-poly asteroid rock geometry
    const baseGeo = new THREE.DodecahedronGeometry(0.35, 1);
    // Perturb vertices slightly for individual ruggedness
    const pos = baseGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const noise = 1.0 + 0.22 * Math.sin(vx * 5.0) * Math.cos(vy * 5.0 + vz * 3.0);
      pos.setXYZ(i, vx * noise, vy * noise, vz * noise);
    }
    baseGeo.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      roughness: 0.88,
      metalness: 0.12,
      vertexColors: true,
    });

    this.mesh = new THREE.InstancedMesh(baseGeo, material, this.count);
    this.mesh.name = 'asteroid_belt_instanced';
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;

    this.generateElements();
    this.updatePositions(0);
  }

  /**
   * Synthesize real Main Belt distribution (2.1 to 3.3 AU) with Kirkwood Resonance Gaps.
   * Deterministic and reproducible across reloads via seeded PRNG.
   */
  private generateElements(): void {
    const rng = createSeededRng(this.seed);
    const kirkwoodGaps = [
      { au: 2.50, width: 0.045 }, // 3:1 resonance with Jupiter
      { au: 2.82, width: 0.040 }, // 5:2 resonance
      { au: 2.96, width: 0.035 }, // 7:3 resonance
      { au: 3.27, width: 0.050 }, // 2:1 resonance (Hecuba gap)
    ];

    const colors: THREE.Color[] = [];
    let generated = 0;

    while (generated < this.count) {
      // Semi-major axis between 2.12 and 3.28 AU
      const a = 2.12 + rng() * 1.16;

      // Kirkwood gap rejection check
      let inGap = false;
      for (const gap of kirkwoodGaps) {
        if (Math.abs(a - gap.au) < gap.width) {
          // 88% depletion probability inside resonance gap
          if (rng() < 0.88) {
            inGap = true;
            break;
          }
        }
      }
      if (inGap) continue;

      const e = 0.03 + rng() * 0.19; // Eccentricity
      const iDeg = (rng() * rng()) * 18.0; // Inclination concentrated near ecliptic
      const incRad = THREE.MathUtils.degToRad(iDeg);
      const longNodeRad = rng() * Math.PI * 2;
      const argPeriRad = rng() * Math.PI * 2;
      const m0Rad = rng() * Math.PI * 2;

      // Kepler's Third Law: period in years = a^(1.5), days = a^(1.5) * 365.25
      const periodDays = Math.pow(a, 1.5) * 365.25;
      const meanMotion = (Math.PI * 2) / periodDays;

      // Visual scale variance (small pebbles to large kilometer boulders)
      const scale = 0.45 + rng() * 0.9;

      this.elements.push({
        semiMajorAxisAU: a,
        eccentricity: e,
        inclinationRad: incRad,
        longNodeRad,
        argPeriRad,
        meanAnomalyEpochRad: m0Rad,
        meanMotionRadPerDay: meanMotion,
        scale,
      });

      // Rock color: C-type carbonaceous (dark grey/brown), S-type stony, M-type metallic
      const type = rng();
      if (type < 0.70) {
        // C-type (70% of belt)
        const v = 0.28 + rng() * 0.18;
        colors.push(new THREE.Color(v * 0.95, v * 0.92, v * 0.88));
      } else if (type < 0.90) {
        // S-type (20% of belt)
        const v = 0.45 + rng() * 0.22;
        colors.push(new THREE.Color(v * 1.05, v * 0.95, v * 0.80));
      } else {
        // M-type (10% metallic)
        const v = 0.55 + rng() * 0.25;
        colors.push(new THREE.Color(v, v * 0.95, v * 0.90));
      }

      generated++;
    }

    // Set instance colors
    for (let idx = 0; idx < colors.length; idx++) {
      this.mesh.setColorAt(idx, colors[idx]);
    }
    if (this.mesh.instanceColor) {
      this.mesh.instanceColor.needsUpdate = true;
    }
  }

  /**
   * Update 3D orbital positions for all asteroids at a given elapsed simulation day count.
   */
  public updatePositions(elapsedDaysSinceJ2000: number): void {
    const isScientific = this.transform.mode === 'scientific';

    for (let i = 0; i < this.elements.length; i++) {
      const el = this.elements[i];

      // Mean anomaly at time t
      const M = (el.meanAnomalyEpochRad + el.meanMotionRadPerDay * elapsedDaysSinceJ2000) % (Math.PI * 2);

      // Low-eccentricity approximation for True Anomaly: nu ≈ M + 2e*sin(M)
      const nu = M + 2.0 * el.eccentricity * Math.sin(M);

      // Orbital radius in AU
      const rAU = el.semiMajorAxisAU * (1.0 - el.eccentricity * el.eccentricity) / (1.0 + el.eccentricity * Math.cos(nu));

      // Rotate into 3D inclined orbital plane
      const u = nu + el.argPeriRad;
      const cosU = Math.cos(u);
      const sinU = Math.sin(u);
      const cosNode = Math.cos(el.longNodeRad);
      const sinNode = Math.sin(el.longNodeRad);
      const cosInc = Math.cos(el.inclinationRad);
      const sinInc = Math.sin(el.inclinationRad);

      const r = rAU;
      const xEcl = r * (cosNode * cosU - sinNode * sinU * cosInc);
      const yEcl = r * (sinNode * cosU + cosNode * sinU * cosInc);
      const zEcl = r * (sinU * sinInc);

      let xThree: number, yThree: number, zThree: number;

      if (isScientific) {
        // AU to km (1 AU = 149,597,870.7 km), 1 unit = 1,000,000 km
        const scale = RenderSpaceTransform.AU_KM / RenderSpaceTransform.SCIENTIFIC_KM_PER_UNIT;
        xThree = xEcl * scale;
        yThree = zEcl * scale;
        zThree = -yEcl * scale;
      } else {
        // Exploration compressed distance: 30 + sqrt(AU) * 65
        const visualDist = 30.0 + Math.sqrt(rAU) * 65.0;
        const norm = Math.sqrt(xEcl * xEcl + yEcl * yEcl + zEcl * zEcl);
        xThree = (xEcl / norm) * visualDist;
        yThree = (zEcl / norm) * visualDist;
        zThree = -(yEcl / norm) * visualDist;
      }

      this.dummy.position.set(xThree, yThree, zThree);
      const s = el.scale * (isScientific ? 0.15 : 1.0);
      this.dummy.scale.set(s, s, s);
      // Small tumbling spin
      this.dummy.rotation.set(M * 2.0, M * 3.5, M * 1.5);
      this.dummy.updateMatrix();

      this.mesh.setMatrixAt(i, this.dummy.matrix);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
  }

  public setVisible(visible: boolean): void {
    this.mesh.visible = visible;
  }

  public isVisible(): boolean {
    return this.mesh.visible;
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
