import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { getBodyFrame, getSynchronousFrame, bodyFixedLongitudeDeg } from '../astronomy/BodyOrientation';
import { KeplerSolver } from '../astronomy/KeplerSolver';
import { CoordinateFrames } from '../astronomy/CoordinateFrames';
import { CatalogueManager } from '../data/CatalogueManager';
import { SimulationClock } from '../simulation/SimulationClock';

type Vec3 = [number, number, number];
const toThree = (v: Vec3): Vec3 => CoordinateFrames.eclipticToThree(v);
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

function tdbDaysFromUtc(iso: string): number {
  return SimulationClock.utcMsToJulianDate(Date.parse(iso)) + SimulationClock.TT_MINUS_UTC_SECONDS / 86400 - 2451545.0;
}

describe('IAU body orientation', () => {
  it('produces orthonormal right-handed frames', () => {
    for (const name of ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Bennu']) {
      const f = getBodyFrame(name, 9000)!;
      expect(f, name).not.toBeNull();
      expect(Math.abs(dot(f.xAxis, f.yAxis))).toBeLessThan(1e-9);
      expect(Math.hypot(...f.yAxis)).toBeCloseTo(1, 9);
      const x = new THREE.Vector3(...f.xAxis);
      const y = new THREE.Vector3(...f.yAxis);
      const z = new THREE.Vector3(...f.zAxis);
      expect(x.clone().cross(y).distanceTo(z)).toBeLessThan(1e-9);
    }
  });

  it("places Earth's north pole 23.44° from ecliptic north, tipped towards ecliptic longitude 90°", () => {
    const f = getBodyFrame('Earth', 0)!;
    const eclNorth = toThree([0, 0, 1]);
    const tilt = (Math.acos(dot(f.yAxis, eclNorth)) * 180) / Math.PI;
    expect(tilt).toBeCloseTo(23.44, 1);
    // Projection of the pole onto the ecliptic points to λ = 90° (the June-solstice direction)
    const lam90 = toThree([0, 1, 0]);
    expect(dot(f.yAxis, lam90)).toBeGreaterThan(0.39);
  });

  it("puts the sub-solar point on Earth at the right longitude (2026-10-13 20:00 UTC ≈ 123.4° W)", () => {
    const d = tdbDaysFromUtc('2026-10-13T20:00:00Z');
    const earth = CatalogueManager.getBody('Earth')!;
    const pos = KeplerSolver.propagate(earth.orbit, d).positionKm;
    const sunDir = toThree([-pos[0], -pos[1], -pos[2]]);
    const lon = bodyFixedLongitudeDeg(getBodyFrame('Earth', d)!, sunDir);
    // Mid-October the equation of time is ≈ +13.5 min (Sun crosses Greenwich ≈ 11:46 UTC),
    // so at 20:00 UTC the sub-solar meridian is (12 h − 20 h − 0.225 h) × 15° ≈ −123.4°
    expect(lon).toBeGreaterThan(-125.5);
    expect(lon).toBeLessThan(-121.5);
  });

  it("aligns Saturn's ring plane edge-on to Earth at the 2025-03-23 ring-plane crossing", () => {
    const d = tdbDaysFromUtc('2025-03-23T12:00:00Z');
    const saturn = KeplerSolver.propagate(CatalogueManager.getBody('Saturn')!.orbit, d).positionKm;
    const earth = KeplerSolver.propagate(CatalogueManager.getBody('Earth')!.orbit, d).positionKm;
    const view = toThree([saturn[0] - earth[0], saturn[1] - earth[1], saturn[2] - earth[2]]);
    const n = Math.hypot(...view);
    const pole = getBodyFrame('Saturn', d)!.yAxis;
    const ringOpeningDeg = (Math.asin(dot(pole, view) / n) * 180) / Math.PI;
    expect(Math.abs(ringOpeningDeg)).toBeLessThan(0.6);
  });

  it('maps texture longitude 0 (u = 0.5) of a SphereGeometry to local +X and east to local −Z', () => {
    const geo = new THREE.SphereGeometry(1, 64, 32);
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    let best = -1;
    let bestU = 0;
    for (let i = 0; i < pos.count; i++) {
      if (Math.abs(pos.getY(i)) > 1e-6) continue; // equator
      if (pos.getX(i) > best) {
        best = pos.getX(i);
        bestU = uv.getX(i);
      }
    }
    expect(bestU).toBeCloseTo(0.5, 6);
    // A vertex slightly east (u > 0.5) on the equator has negative Z
    for (let i = 0; i < pos.count; i++) {
      if (Math.abs(pos.getY(i)) < 1e-6 && Math.abs(uv.getX(i) - 0.5 - 1 / 64) < 1e-6) {
        expect(pos.getZ(i)).toBeLessThan(0);
      }
    }
  });

  it('keeps synchronous moons facing their parent with the pole along the orbit normal', () => {
    const f = getSynchronousFrame([384400, 0, 0], [0, 1.0, 0]);
    expect(bodyFixedLongitudeDeg(f, toThree([-1, 0, 0]))).toBeCloseTo(0, 6);
    expect(dot(f.yAxis, toThree([0, 0, 1]))).toBeCloseTo(1, 9);
  });
});
