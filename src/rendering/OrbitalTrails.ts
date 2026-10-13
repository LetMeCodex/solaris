import * as THREE from 'three';
import { KeplerSolver } from '../astronomy/KeplerSolver';
import { RenderSpaceTransform } from './RenderSpaceTransform';
import { CelestialBodyDefinition } from '../types/catalogue';

export class OrbitalTrails {
  /**
   * Generate the osculating 3D Keplerian ellipse of a heliocentric body at the given date.
   */
  public static createOrbitLine(
    body: CelestialBodyDefinition,
    transform: RenderSpaceTransform,
    elapsedDaysSinceJ2000: number = 0,
    segments: number = 180
  ): THREE.Line | null {
    if (body.orderFromSun === 0 || body.orbit.semiMajorAxisKm <= 0) {
      return null;
    }

    // Sample true physical Keplerian ellipse in heliocentric ecliptic space
    const physicalPoints = KeplerSolver.sampleOrbitPath(body.orbit, segments, elapsedDaysSinceJ2000);

    // Transform points to Three.js render coordinates
    const renderVectors: THREE.Vector3[] = physicalPoints.map((pt) => {
      const renderPt = transform.toRenderPosition(pt, body);
      return new THREE.Vector3(renderPt[0], renderPt[1], renderPt[2]);
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(renderVectors);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(body.physical.colorHex || '#555566'),
      transparent: true,
      opacity: body.category === 'planet' ? 0.30 : 0.18,
      linewidth: 1,
    });

    const line = new THREE.Line(geometry, material);
    line.name = `kepler_orbit_${body.name}`;
    return line;
  }

  /**
   * Generate an accurate 3D Keplerian orbit line for a natural satellite (moon) around its parent.
   */
  public static createMoonOrbitLine(
    moon: CelestialBodyDefinition,
    parent: CelestialBodyDefinition,
    transform: RenderSpaceTransform,
    elapsedDaysSinceJ2000: number = 0,
    segments: number = 96
  ): THREE.Line | null {
    if (moon.orbit.semiMajorAxisKm <= 0) return null;

    const physicalPoints = KeplerSolver.sampleOrbitPath(moon.orbit, segments, elapsedDaysSinceJ2000);

    const renderVectors: THREE.Vector3[] = physicalPoints.map((pt) => {
      const renderPt = transform.toMoonRenderPosition(pt, moon, [0, 0, 0], parent);
      return new THREE.Vector3(renderPt[0], renderPt[1], renderPt[2]);
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(renderVectors);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(moon.physical.colorHex || '#778899'),
      transparent: true,
      opacity: 0.20,
      linewidth: 1,
    });

    const line = new THREE.Line(geometry, material);
    line.name = `kepler_moon_orbit_${moon.name}`;
    return line;
  }
}
