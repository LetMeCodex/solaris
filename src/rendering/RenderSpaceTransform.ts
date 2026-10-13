import { CoordinateFrames } from '../astronomy/CoordinateFrames';
import { CelestialBodyDefinition } from '../types/catalogue';
import { explorationDistanceFromAU, explorationRadius } from './ExplorationScale';

export type ScaleMode = 'exploration' | 'scientific';

export class RenderSpaceTransform {
  // Current active mode
  public mode: ScaleMode = 'exploration';

  // "True distances" (scientific) mode: linear distances, 1 Three.js unit = 1,000,000 km.
  // Globe radii are NOT to scale in this mode (×4, minimum 0.015 units) — see getVisualRadius.
  public static readonly SCIENTIFIC_KM_PER_UNIT = 1000000.0;
  public static readonly AU_KM = 149597870.7;

  /**
   * Convert physical heliocentric position (km) to Three.js render coordinates.
   * Invariant: Does NOT mutate the input position vector.
   *
   * @param physicalKm 3D position vector in kilometers (Heliocentric Ecliptic frame).
   * @param body Celestial body metadata for exploration scale mapping.
   * @returns 3D vector in Three.js coordinates [x, y, z].
   */
  public toRenderPosition(
    physicalKm: [number, number, number],
    body?: CelestialBodyDefinition
  ): [number, number, number] {
    if (this.mode === 'scientific') {
      // Linear (true-distance) scale
      const scale = 1.0 / RenderSpaceTransform.SCIENTIFIC_KM_PER_UNIT;
      const scaledEcliptic: [number, number, number] = [
        physicalKm[0] * scale,
        physicalKm[1] * scale,
        physicalKm[2] * scale,
      ];
      return CoordinateFrames.eclipticToThree(scaledEcliptic);
    }

    // Exploration Scale: Logarithmic distance compression
    const rKm = Math.sqrt(
      physicalKm[0] * physicalKm[0] +
      physicalKm[1] * physicalKm[1] +
      physicalKm[2] * physicalKm[2]
    );

    if (rKm < 1000 || !body || body.orderFromSun === 0) {
      // Sun remains at center
      return [0, 0, 0];
    }

    // Distance in AU, compressed with the shared exploration scale: 50 + 65 · AU^0.58
    const rAU = rKm / RenderSpaceTransform.AU_KM;
    const visualDistance = explorationDistanceFromAU(rAU);

    // Unit direction in Ecliptic plane
    const dirX = physicalKm[0] / rKm;
    const dirY = physicalKm[1] / rKm;
    const dirZ = physicalKm[2] / rKm;

    const compressedEcliptic: [number, number, number] = [
      dirX * visualDistance,
      dirY * visualDistance,
      dirZ * visualDistance,
    ];

    return CoordinateFrames.eclipticToThree(compressedEcliptic);
  }

  /**
   * Convert parent-relative moon position to render space.
   */
  public toMoonRenderPosition(
    moonRelPhysicalKm: [number, number, number],
    moonDef: CelestialBodyDefinition,
    parentRenderPos: [number, number, number],
    parentDef: CelestialBodyDefinition
  ): [number, number, number] {
    if (this.mode === 'scientific') {
      // Linear true-distance offset from the parent
      const scale = 1.0 / RenderSpaceTransform.SCIENTIFIC_KM_PER_UNIT;
      const scaledEcliptic: [number, number, number] = [
        moonRelPhysicalKm[0] * scale,
        moonRelPhysicalKm[1] * scale,
        moonRelPhysicalKm[2] * scale,
      ];
      const relThree = CoordinateFrames.eclipticToThree(scaledEcliptic);
      // Globes are enlarged 4× in this mode, which would swallow very close moons (Phobos orbits at
      // 2.8 Mars radii). Push such moons just outside the enlarged parent, keeping their direction.
      const relLen = Math.hypot(relThree[0], relThree[1], relThree[2]);
      const minLen = this.getVisualRadius(parentDef) * 1.25 + this.getVisualRadius(moonDef);
      if (relLen > 0 && relLen < minLen) {
        const k = minLen / relLen;
        relThree[0] *= k;
        relThree[1] *= k;
        relThree[2] *= k;
      }
      return [
        parentRenderPos[0] + relThree[0],
        parentRenderPos[1] + relThree[1],
        parentRenderPos[2] + relThree[2],
      ];
    }

    // Exploration Scale: Scale moon distance comfortably around parent
    const relDistKm = Math.sqrt(
      moonRelPhysicalKm[0] * moonRelPhysicalKm[0] +
      moonRelPhysicalKm[1] * moonRelPhysicalKm[1] +
      moonRelPhysicalKm[2] * moonRelPhysicalKm[2]
    );

    if (relDistKm < 1) {
      return parentRenderPos;
    }

    const dirX = moonRelPhysicalKm[0] / relDistKm;
    const dirY = moonRelPhysicalKm[1] / relDistKm;
    const dirZ = moonRelPhysicalKm[2] / relDistKm;

    const relThreeDir = CoordinateFrames.eclipticToThree([dirX, dirY, dirZ]);

    // Visual distance based on parent visual radius
    const parentRadius = this.getVisualRadius(parentDef);
    // Logarithmic scaling of orbital radius so all moons are distinct and outside parent globe
    const scaledOrbitDist = parentRadius * (1.35 + 1.25 * Math.log10(1.0 + relDistKm / 40000.0));

    return [
      parentRenderPos[0] + relThreeDir[0] * scaledOrbitDist,
      parentRenderPos[1] + relThreeDir[1] * scaledOrbitDist,
      parentRenderPos[2] + relThreeDir[2] * scaledOrbitDist,
    ];
  }

  /**
   * Get visual radius for a celestial body in the active scale mode.
   */
  public getVisualRadius(body: CelestialBodyDefinition): number {
    if (this.mode === 'scientific') {
      // Physical radius in units (e.g. Earth: 6371 km -> 0.006371 units)
      // Clamped to a minimal visible threshold (0.015 units) so planets and moons stay visible at true distances
      const rawRadiusUnits = body.physical.meanRadiusKm / RenderSpaceTransform.SCIENTIFIC_KM_PER_UNIT;
      return Math.max(0.015, rawRadiusUnits * 4.0);
    }

    return explorationRadius(body);
  }
}
