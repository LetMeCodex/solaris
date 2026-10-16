import { CoordinateFrames } from '../astronomy/CoordinateFrames';
import { CelestialBodyDefinition } from '../types/catalogue';
import { UNITS_PER_KM, drawnRadius, moonDistanceKm } from './Scale';

/**
 * Physical → render space. Everything is to true scale (see Scale.ts): heliocentric ecliptic km
 * are converted linearly and rotated into the Three.js frame (+Y = ecliptic north). Globes are drawn
 * WORLD_SCALE times larger than life, and moons are pushed out with their enlarged planets.
 */
export class RenderSpaceTransform {
  /**
   * Heliocentric ecliptic position (km) → render coordinates. Does not mutate the input.
   */
  public toRenderPosition(physicalKm: [number, number, number]): [number, number, number] {
    return CoordinateFrames.eclipticToThree([
      physicalKm[0] * UNITS_PER_KM,
      physicalKm[1] * UNITS_PER_KM,
      physicalKm[2] * UNITS_PER_KM,
    ]);
  }

  /** Parent-relative moon position (km) → render coordinates around the parent's render position. */
  public toMoonRenderPosition(
    moonRelPhysicalKm: [number, number, number],
    parentRenderPos: [number, number, number],
    parentRadiusKm: number = 0
  ): [number, number, number] {
    const rel = this.toRenderPosition(this.moonOffsetKm(moonRelPhysicalKm, parentRadiusKm));
    return [parentRenderPos[0] + rel[0], parentRenderPos[1] + rel[1], parentRenderPos[2] + rel[2]];
  }

  /** A moon's planet-relative offset (km) as drawn: pushed out with the enlarged planet. */
  public moonOffsetKm(relKm: [number, number, number], parentRadiusKm: number): [number, number, number] {
    const d = Math.hypot(relKm[0], relKm[1], relKm[2]);
    if (d <= 0 || parentRadiusKm <= 0) return relKm;
    const k = moonDistanceKm(d, parentRadiusKm) / d;
    return [relKm[0] * k, relKm[1] * k, relKm[2] * k];
  }

  /** Globe radius in render units, as drawn (see WORLD_SCALE). */
  public getVisualRadius(body: CelestialBodyDefinition): number {
    return drawnRadius(body);
  }
}
