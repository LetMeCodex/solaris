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
    // Calibrated power scaling: 50 + AU^0.58 * 65
    const visualDistance = 50.0 + Math.pow(rAU, 0.58) * 65.0;

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
      // Clamped to a minimal visible threshold (0.015 units) so planets and moons don't completely vanish in 1:1 mode
      const rawRadiusUnits = body.physical.meanRadiusKm / RenderSpaceTransform.SCIENTIFIC_KM_PER_UNIT;
      return Math.max(0.015, rawRadiusUnits * 4.0);
    }

    // Exploration Mode: NASA dimension-grounded proportional scaling
    if (body.category === 'star') return 48.0;

    switch (body.name) {
      case 'Jupiter': return 26.90; // 11.2x Earth
      case 'Saturn':  return 22.68; // 9.46x Earth
      case 'Uranus':  return 9.62;  // 4.01x Earth
      case 'Neptune': return 9.32;  // 3.88x Earth
      case 'Earth':   return 2.40;  // Terrestrial baseline
      case 'Venus':   return 2.28;  // 0.95x Earth
      case 'Mars':    return 1.28;  // 0.53x Earth
      case 'Mercury': return 0.92;  // 0.38x Earth
      case 'Pluto':   return 0.45;  // 0.19x Earth
      default:
        break;
    }

    if (body.category === 'moon') {
      const km = body.physical.meanRadiusKm;
      if (km < 100) return 0.18;
      if (km < 500) return 0.32;
      if (km < 1200) return 0.48;
      if (km < 2000) return 0.65; // Europa (0.59), Moon (0.65), Io (0.69)
      return 0.95; // Ganymede (0.99), Titan (0.97), Callisto (0.91)
    }

    if (body.category === 'dwarf_planet') {
      return 0.45;
    }

    if (body.category === 'asteroid') {
      const km = body.physical.meanRadiusKm;
      if (km < 10) return 0.18;
      if (km < 100) return 0.25;
      return 0.38; // Ceres, Vesta, Pallas, Hygiea
    }

    // Proportional fallback from physical radius
    return Math.max(0.18, (body.physical.meanRadiusKm / 6371.0) * 2.40);
  }
}
