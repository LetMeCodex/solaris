import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { CoordinateFrames } from '../astronomy/CoordinateFrames';
import { getBodyFrame } from '../astronomy/BodyOrientation';
import { MilkyWayGalaxy, DEFAULT_GALAXY_CONFIG, GALAXY_UNITS_PER_KPC, SUN_GALACTOCENTRIC_KPC } from '../rendering/MilkyWayGalaxy';

type Vec3 = [number, number, number];
const angleDeg = (a: Vec3, b: Vec3) =>
  (Math.acos(Math.min(1, (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (Math.hypot(...a) * Math.hypot(...b)))) * 180) / Math.PI;

/** Ecliptic (λ, β) in degrees → Three.js render direction. */
const eclToThree = (lDeg: number, bDeg: number): Vec3 => {
  const l = (lDeg * Math.PI) / 180;
  const b = (bDeg * Math.PI) / 180;
  return CoordinateFrames.eclipticToThree([Math.cos(b) * Math.cos(l), Math.cos(b) * Math.sin(l), Math.sin(b)]);
};

describe('Celestial sphere reference frame', () => {
  it('places Polaris within 1° of Earth\'s north celestial pole', () => {
    // Polaris, ICRF unit vector from RA 37.95°, Dec +89.26°
    const polaris = CoordinateFrames.icrfToThree(CoordinateFrames.raDecToIcrf(37.9546, 89.2641));
    const pole = getBodyFrame('Earth', 0)!.yAxis;
    expect(angleDeg(polaris, pole)).toBeLessThan(1.0);
  });

  it('puts Regulus (on the ecliptic) within 0.5° of the ecliptic plane', () => {
    // Regulus: RA 152.0930°, Dec +11.9672° — ecliptic latitude +0.46°
    const regulus = CoordinateFrames.icrfToThree(CoordinateFrames.raDecToIcrf(152.093, 11.9672));
    const eclipticNorth = CoordinateFrames.eclipticToThree([0, 0, 1]);
    expect(Math.abs(90 - angleDeg(regulus, eclipticNorth))).toBeLessThan(0.5);
  });

  it('orients the galactic frame: centre at ecliptic (266.84°, −5.54°), NGP at (180.02°, +29.81°)', () => {
    const g = CoordinateFrames.galacticBasisThree();
    expect(angleDeg(g.x, eclToThree(266.84, -5.54))).toBeLessThan(0.1);
    expect(angleDeg(g.z, eclToThree(180.02, 29.81))).toBeLessThan(0.1);
  });

  it('places the 3D galaxy centre towards Sagittarius at R0 with the Sun at the origin', () => {
    const galaxy = new MilkyWayGalaxy(DEFAULT_GALAXY_CONFIG);
    const gc = galaxy.getGalacticCenterWorldPosition(new THREE.Vector3());
    const g = CoordinateFrames.galacticBasisThree();
    expect(angleDeg([gc.x, gc.y, gc.z], g.x)).toBeLessThan(0.5);
    expect(gc.length()).toBeCloseTo(SUN_GALACTOCENTRIC_KPC * GALAXY_UNITS_PER_KPC, -1);
    // Galactic disk normal (local +Y) points at the north galactic pole
    const n = new THREE.Vector3(0, 1, 0).applyQuaternion(galaxy.group.quaternion);
    expect(angleDeg([n.x, n.y, n.z], g.z)).toBeLessThan(1e-6);
    galaxy.dispose();
  });
});
