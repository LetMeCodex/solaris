import * as THREE from 'three';
import { KeplerSolver } from '../astronomy/KeplerSolver';
import { RenderSpaceTransform } from './RenderSpaceTransform';
import { CelestialBodyDefinition } from '../types/catalogue';

export class OrbitalTrails {
  /**
   * Generate an accurate 3D Keplerian elliptical orbit line for a heliocentric body.
   */
  public static createOrbitLine(
    body: CelestialBodyDefinition,
    transform: RenderSpaceTransform,
    segments: number = 180
  ): THREE.Line | null {
    if (body.orderFromSun === 0 || body.orbit.semiMajorAxisKm <= 0) {
      return null;
    }

    // Sample true physical Keplerian ellipse in heliocentric ecliptic space
    const physicalPoints = KeplerSolver.sampleOrbitPath(body.orbit, segments);

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
    segments: number = 96
  ): THREE.Line | null {
    if (moon.orbit.semiMajorAxisKm <= 0) return null;

    const physicalPoints = KeplerSolver.sampleOrbitPath(moon.orbit, segments);

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
