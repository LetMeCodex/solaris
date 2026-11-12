import { describe, expect, it } from 'vitest';
import { greatCircleKm, planTransit, slerpUnit, SPEED_TIERS, transitAt } from '../flight/EarthTransit';
import { speedCeiling, unitsPerMps } from '../flight/FlightModel';

describe('Earth transit', () => {
  it('measures Paris to Delhi as about 6,600 km', () => {
    expect(greatCircleKm(48.8566, 2.3522, 28.6139, 77.209)).toBeGreaterThan(6500);
    expect(greatCircleKm(48.8566, 2.3522, 28.6139, 77.209)).toBeLessThan(6650);
  });

  it('crosses continents in minutes, peaking near 300,000 km/h', () => {
    const plan = planTransit(6600, 1);
    expect(plan.durationS).toBeLessThan(200);
    // Peak speed along the route: twice the average for the (1 - cos) profile
    const peakKmh = ((plan.distanceKm / plan.durationS) * 2) * 3600;
    expect(peakKmh).toBeGreaterThan(200_000);
    expect(peakKmh).toBeLessThan(320_000);
  });

  it('climbs, cruises and comes down to the hand-over height', () => {
    const plan = planTransit(3000, 0.5);
    expect(transitAt(plan, 0).heightKm).toBeCloseTo(0.5, 5);
    expect(transitAt(plan, plan.durationS / 2).heightKm).toBeCloseTo(plan.cruiseKm, 5);
    const end = transitAt(plan, plan.durationS);
    expect(end.heightKm).toBeCloseTo(plan.endKm, 5);
    expect(end.along).toBeCloseTo(1, 5);
    expect(end.done).toBe(true);
  });

  it('moves along the route without going backwards', () => {
    const plan = planTransit(1000, 1);
    let last = -1;
    for (let t = 0; t <= plan.durationS; t += plan.durationS / 50) {
      const a = transitAt(plan, t).along;
      expect(a).toBeGreaterThanOrEqual(last - 1e-12);
      last = a;
    }
  });

  it('stays on the unit sphere along the great circle', () => {
    const p = slerpUnit([1, 0, 0], [0, 1, 0], 0.5);
    expect(Math.hypot(...p)).toBeCloseTo(1, 9);
    expect(p[0]).toBeCloseTo(Math.SQRT1_2, 9);
  });
});

describe('speed tiers', () => {
  it('lift the air limit and the low-level drive', () => {
    const kmPerUnit = 2.65;
    const env = { altitudeUnits: 0.3 / kmPerUnit, kmPerUnit, airDensity: 1 };
    const jet = speedCeiling(env) / unitsPerMps(kmPerUnit);
    const scram = SPEED_TIERS[2];
    const fast = speedCeiling({ ...env, airLimitMps: scram.airLimitMps, driveFloorMps: scram.driveFloorMps }) / unitsPerMps(kmPerUnit);
    expect(jet).toBeLessThan(400);
    expect(fast).toBeGreaterThan(7000);
  });
});
