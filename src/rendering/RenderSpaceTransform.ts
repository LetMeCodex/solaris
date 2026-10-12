import { CoordinateFrames } from '../astronomy/CoordinateFrames';
import { CelestialBodyDefinition } from '../types/catalogue';

export type ScaleMode = 'exploration' | 'scientific';

export class RenderSpaceTransform {
  // Current active mode
  public mode: ScaleMode = 'exploration';

  // Linear scale for 1:1 Scientific Mode: 1 Three.js unit = 1,000,000 km
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
      // 1:1 Scientific Linear Scale
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

    // Distance in AU
    const rAU = rKm / RenderSpaceTransform.AU_KM;
    // Compressed visual radius: 30 + sqrt(AU) * 65
    const visualDistance = 30.0 + Math.sqrt(rAU) * 65.0;

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
    _moonDef: CelestialBodyDefinition,
    parentRenderPos: [number, number, number],
    parentDef: CelestialBodyDefinition
  ): [number, number, number] {
    if (this.mode === 'scientific') {
      // Linear 1:1 addition
      const scale = 1.0 / RenderSpaceTransform.SCIENTIFIC_KM_PER_UNIT;
      const scaledEcliptic: [number, number, number] = [
        moonRelPhysicalKm[0] * scale,
        moonRelPhysicalKm[1] * scale,
        moonRelPhysicalKm[2] * scale,
      ];
      const relThree = CoordinateFrames.eclipticToThree(scaledEcliptic);
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
    // Satellites span from ~1.5x parent radius to ~5x parent radius
    const scaledOrbitDist = parentRadius * (1.6 + 1.2 * Math.log10(1.0 + relDistKm / 50000.0));

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
      // Clamped to a minimal visible threshold (0.015 units) so planets and moons don't completely vanish in 1:1 mode
      const rawRadiusUnits = body.physical.meanRadiusKm / RenderSpaceTransform.SCIENTIFIC_KM_PER_UNIT;
      return Math.max(0.015, rawRadiusUnits * 4.0);
    }

    // Exploration Mode: Power-scaled radius for comfortable inspection
    if (body.category === 'star') return 14.0;
    
    if (body.category === 'moon') {
      const km = body.physical.meanRadiusKm;
      if (km < 100) return 0.22;
      if (km < 600) return 0.45;
      if (km < 1500) return 0.70;
      return 0.95; // Large moons (Ganymede, Titan, Callisto, Io, Moon, Europa, Triton)
    }

    if (body.category === 'dwarf_planet') {
      return body.name === 'Pluto' ? 1.1 : 0.75;
    }

    if (body.category === 'asteroid') {
      const km = body.physical.meanRadiusKm;
      if (km < 5) return 0.20;
      if (km < 50) return 0.30;
      return 0.55; // Ceres, Vesta, Pallas, Hygiea
    }

    // Major planets
    const km = body.physical.meanRadiusKm;
    if (km < 3000) return 1.6;
    if (km < 7000) return 2.8;
    if (km < 30000) return 5.5;
    return 8.2;
  }
}
