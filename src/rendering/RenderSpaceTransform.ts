import { CoordinateFrames } from '../astronomy/CoordinateFrames';
import { CelestialBodyDefinition } from '../types/catalogue';
import { UNITS_PER_KM, trueRadius } from './Scale';

/**
 * Physical → render space. Everything is to true scale (see Scale.ts): heliocentric ecliptic km
 * are converted linearly and rotated into the Three.js frame (+Y = ecliptic north). Bodies are
 * never moved or resized to make them easier to see; the HUD marks the ones too small to see.
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
    parentRenderPos: [number, number, number]
  ): [number, number, number] {
    const rel = this.toRenderPosition(moonRelPhysicalKm);
    return [parentRenderPos[0] + rel[0], parentRenderPos[1] + rel[1], parentRenderPos[2] + rel[2]];
  }

  /** Globe radius in render units: the true radius. */
  public getVisualRadius(body: CelestialBodyDefinition): number {
    return trueRadius(body);
  }
}
