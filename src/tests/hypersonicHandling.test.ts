import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { FlightModel, type FlightEnv, type FlightInput } from '../flight/FlightModel';

/**
 * The stick at Earth's speed tiers (Mach 6 and Mach 25) must answer as it does at jet speed: the
 * pitch rate builds in well under a second, the felt load stays a fighter's, a held pull does not
 * bleed the speed away, the nose does not wander off the flight path, and letting go settles
 * without oscillating.
 */

const KM_PER_UNIT = 1; // 1 unit = 1 km, so 1 m/s = 0.001 units/s
const tiers: Array<{ name: string; mps: number; env: FlightEnv }> = [
  { name: 'hypersonic', mps: 2000, env: { altitudeUnits: 20, kmPerUnit: KM_PER_UNIT, airDensity: 0.25, airLimitMps: 2050, driveFloorMps: 1700, airAccelScale: 12 } },
  { name: 'scramjet', mps: 8500, env: { altitudeUnits: 20, kmPerUnit: KM_PER_UNIT, airDensity: 0.25, airLimitMps: 8600, driveFloorMps: 7500, airAccelScale: 60 } },
];

function jetAt(mps: number): FlightModel {
  const f = new FlightModel();
  const v = (mps / 1000) / KM_PER_UNIT;
  f.velocity.set(0, 0, -v);
  f.speed = v;
  return f;
}

const input = (pitch: number, roll = 0): FlightInput => ({ pitch, roll, yaw: 0, throttle: 1, boost: false, assist: true });

describe('handling at the speed tiers', () => {
  for (const t of tiers) {
    it(`${t.name}: the pull builds fast, stays a fighter's load and keeps the speed`, () => {
      const f = jetAt(t.mps);
      const dt = 1 / 60;
      let timeTo80 = -1;
      let maxRate = 0;
      for (let i = 0; i < 180; i++) {
        f.step(dt, input(1), t.env);
        maxRate = Math.max(maxRate, f.rates.x);
        if (timeTo80 < 0 && f.rates.x >= 0.8 * 0.29) timeTo80 = (i + 1) * dt;
      }
      // A usable rate (>= ~16 deg/s), reached in well under a second
      expect(maxRate).toBeGreaterThan(0.27);
      expect(timeTo80).toBeGreaterThan(0);
      expect(timeTo80).toBeLessThan(0.8);
      // A fighter's load, not hundreds of g
      expect(f.gLoad).toBeLessThan(12);
      // Three seconds of full pull keep nearly all the speed
      const mps = f.velocity.length() * 1000 * KM_PER_UNIT;
      expect(mps).toBeGreaterThan(t.mps * 0.97);
      // The flight path follows the nose
      const fwd = f.forward(new THREE.Vector3());
      const ang = THREE.MathUtils.radToDeg(fwd.angleTo(f.velocity.clone().normalize()));
      expect(ang).toBeLessThan(10);
    });

    it(`${t.name}: letting go settles without oscillating`, () => {
      const f = jetAt(t.mps);
      const dt = 1 / 60;
      for (let i = 0; i < 90; i++) f.step(dt, input(1, 0.6), t.env);
      let minPitch = 0;
      for (let i = 0; i < 120; i++) {
        f.step(dt, input(0, 0), t.env);
        minPitch = Math.min(minPitch, f.rates.x);
      }
      expect(Math.abs(f.rates.x)).toBeLessThan(0.01);
      expect(Math.abs(f.rates.z)).toBeLessThan(0.01);
      expect(minPitch).toBeGreaterThan(-0.01);
    });
  }
});
