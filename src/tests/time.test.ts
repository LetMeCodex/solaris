import { describe, it, expect } from 'vitest';
import { SimulationClock } from '../simulation/SimulationClock';

describe('SimulationClock — Epochs & Julian Date Precision', () => {
  it('correctly maps standard J2000.0 epoch to Julian Date 2451545.0', () => {
    // J2000.0 = 2000-01-01T12:00:00.000Z
    const j2000Ms = Date.parse('2000-01-01T12:00:00.000Z');
    const jd = SimulationClock.utcMsToJulianDate(j2000Ms);
    expect(jd).toBeCloseTo(2451545.0, 6);
  });

  it('correctly maps Unix epoch 1970-01-01T00:00:00.000Z to JD 2440587.5', () => {
    const unixEpochMs = 0;
    const jd = SimulationClock.utcMsToJulianDate(unixEpochMs);
    expect(jd).toBeCloseTo(2440587.5, 6);
  });

  it('performs exact round-trip conversion between UTC milliseconds and Julian Date', () => {
    const testTimes = [
      Date.parse('1969-07-20T20:17:40Z'), // Apollo 11 touchdown
      Date.parse('2000-01-01T12:00:00Z'), // J2000.0
      Date.parse('2026-10-12T18:00:00Z'), // Modern epoch
      Date.parse('2080-06-12T00:00:00Z'), // DE441 baseline snapshot
    ];

    for (const utcMs of testTimes) {
      const jd = SimulationClock.utcMsToJulianDate(utcMs);
      const recoveredMs = SimulationClock.julianDateToUtcMs(jd);
      expect(recoveredMs).toBeCloseTo(utcMs, 1);
    }
  });

  it('verifies Julian Centuries T = 0 at J2000 and T = 1 at J2100', () => {
    const clock = new SimulationClock(SimulationClock.J2000_UTC_MS);
    expect(clock.getJulianCenturiesJ2000()).toBeCloseTo(0.0, 8);

    // Advance 36,525 days (exactly 1 Julian Century)
    const j2100Ms = SimulationClock.J2000_UTC_MS + (36525 * 86400000);
    clock.setUtcMs(j2100Ms);
    expect(clock.getJulianCenturiesJ2000()).toBeCloseTo(1.0, 8);
  });
});
