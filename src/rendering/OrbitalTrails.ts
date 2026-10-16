import * as THREE from 'three';
import { KeplerSolver } from '../astronomy/KeplerSolver';
import { RenderSpaceTransform } from './RenderSpaceTransform';
import { CelestialBodyDefinition } from '../types/catalogue';
import { UNITS_PER_KM, moonDistanceKm } from './Scale';
import { CatalogueManager } from '../data/CatalogueManager';

/**
 * Orbit guide lines at true scale.
 *
 * A polyline is only an approximation of the ellipse: at true scale Neptune's orbit is 10 million
 * units round, so even 1,024 chords sag a few units away from the real path. Each line therefore
 * fades out close to the camera (where the sag would show next to a globe) and moon orbits fade out
 * when the camera is far from their planet (where hundreds of them would merge into a blot).
 */
const vertexShader = `
  uniform vec2 uNearFade;
  uniform vec2 uFarFade;
  varying float vFade;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float d = length(mv.xyz);
    float near = smoothstep(uNearFade.x, uNearFade.y, d);
    float far = 1.0;
    if (uFarFade.y > 0.0) {
      // Distance from the camera to this line's centre (the parent planet)
      float c = length((modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz);
      far = 1.0 - smoothstep(uFarFade.x, uFarFade.y, c);
    }
    vFade = near * far;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vFade;
  void main() {
    float a = uOpacity * vFade;
    if (a < 0.003) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

function lineMaterial(color: THREE.ColorRepresentation, opacity: number, near: [number, number], far: [number, number]): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uNearFade: { value: new THREE.Vector2(...near) },
      uFarFade: { value: new THREE.Vector2(...far) },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
  });
}

export class OrbitalTrails {
  /**
   * The osculating Keplerian ellipse of a heliocentric body at the given date.
   */
  public static createOrbitLine(
    body: CelestialBodyDefinition,
    transform: RenderSpaceTransform,
    elapsedDaysSinceJ2000: number = 0,
    segments: number = 1024
  ): THREE.Line | null {
    if (body.orderFromSun === 0 || body.orbit.semiMajorAxisKm <= 0) {
      return null;
    }
    const physicalPoints = KeplerSolver.sampleOrbitPath(body.orbit, segments, elapsedDaysSinceJ2000);
    const renderVectors = physicalPoints.map((pt) => new THREE.Vector3(...transform.toRenderPosition(pt)));
    const geometry = new THREE.BufferGeometry().setFromPoints(renderVectors);
    // Fade out within ~0.3% of the orbit's radius of the camera (Earth: ~170 units, 70 Earth radii)
    const a = body.orbit.semiMajorAxisKm * UNITS_PER_KM;
    const material = lineMaterial(body.physical.colorHex || '#555566', body.category === 'planet' ? 0.34 : 0.2, [a * 0.0008, a * 0.003], [0, 0]);
    const line = new THREE.Line(geometry, material);
    line.name = `kepler_orbit_${body.name}`;
    line.frustumCulled = false;
    return line;
  }

  /**
   * A satellite's orbit around its planet (the line is positioned at the planet every frame).
   */
  public static createMoonOrbitLine(
    moon: CelestialBodyDefinition,
    transform: RenderSpaceTransform,
    elapsedDaysSinceJ2000: number = 0,
    segments: number = 256,
    opacity: number = 0.22
  ): THREE.Line | null {
    if (moon.orbit.semiMajorAxisKm <= 0) return null;
    const physicalPoints = KeplerSolver.sampleOrbitPath(moon.orbit, segments, elapsedDaysSinceJ2000);
    // Drawn where the moon is drawn: pushed out with its enlarged planet
    const parentKm = CatalogueManager.getBody(moon.parentName ?? '')?.physical.meanRadiusKm ?? 0;
    const renderVectors = physicalPoints.map((pt) => new THREE.Vector3(...transform.toRenderPosition(transform.moonOffsetKm(pt as [number, number, number], parentKm))));
    const geometry = new THREE.BufferGeometry().setFromPoints(renderVectors);
    const a = moonDistanceKm(moon.orbit.semiMajorAxisKm, parentKm) * UNITS_PER_KM;
    const material = lineMaterial(moon.physical.colorHex || '#778899', opacity, [a * 0.004, a * 0.015], [a * 40, a * 160]);
    const line = new THREE.Line(geometry, material);
    line.name = `kepler_moon_orbit_${moon.name}`;
    line.frustumCulled = false;
    return line;
  }

  /** Brighten the orbit of the focused body (and dim the rest a little). */
  public static setEmphasis(line: THREE.Line, emphasised: boolean, base: number): void {
    const u = (line.material as THREE.ShaderMaterial).uniforms;
    if (u?.uOpacity) u.uOpacity.value = emphasised ? Math.min(0.8, base * 2.2) : base;
  }
}
