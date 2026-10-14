import { describe, it, expect } from 'vitest';
import { sunElevationAt, findTimeOfDay, apparentMagnitude, heliocentricState, AU_KM } from '../explorer/SkyAstronomy';
import { transmittance, ATMOSPHERES } from '../explorer/SkyAtmosphere';
import { CatalogueManager } from '../data/CatalogueManager';

const J2000_JD = 2451545.0;
/** Days TDB since J2000 for a UTC date. */
const tdbDays = (iso: string) => (Date.parse(iso) / 86400000 + 2440587.5 - J2000_JD) + 69.184 / 86400;
const toIso = (d: number) => new Date((d + J2000_JD - 69.184 / 86400 - 2440587.5) * 86400000).toISOString();

describe('Surface sky astronomy', () => {
  it('puts the Sun high at local noon and below the horizon at midnight (Greenwich, June solstice)', () => {
    const noon = sunElevationAt('Earth', 51.4779, -0.0015, tdbDays('2026-06-21T12:02:00Z'))!;
    const midnight = sunElevationAt('Earth', 51.4779, -0.0015, tdbDays('2026-06-21T00:02:00Z'))!;
    // 90 − 51.48 + 23.44 = 61.96°
    expect(noon).toBeGreaterThan(61);
    expect(noon).toBeLessThan(63);
    expect(midnight).toBeLessThan(-14);
  });

  it('finds Greenwich sunrise within a few minutes of the almanac (03:43 UTC on 2026-06-21)', () => {
    const d = findTimeOfDay('Earth', 51.4779, -0.0015, tdbDays('2026-06-20T22:00:00Z'), 'sunrise')!;
    const minutes = (Date.parse(toIso(d)) - Date.parse('2026-06-21T03:43:00Z')) / 60000;
    expect(Math.abs(minutes)).toBeLessThan(5);
  });

  it('finds local noon and night on Mars within one sol', () => {
    const d0 = tdbDays('2026-10-14T00:00:00Z');
    const noon = findTimeOfDay('Mars', -5.4, 137.8, d0, 'noon')!;
    const night = findTimeOfDay('Mars', -5.4, 137.8, d0, 'night')!;
    expect(noon - d0).toBeLessThan(1.03);
    expect(sunElevationAt('Mars', -5.4, 137.8, noon)!).toBeGreaterThan(55);
    expect(sunElevationAt('Mars', -5.4, 137.8, night)!).toBeLessThan(-55);
  });

  it('gives plausible apparent magnitudes (Jupiter ≈ −2.5…−2.9 near opposition, Sun −26.7 from Earth)', () => {
    const d = tdbDays('2026-01-10T00:00:00Z'); // Jupiter opposition 2026-01-10
    const earth = heliocentricState(CatalogueManager.getBody('Earth')!, d).pos;
    const jup = heliocentricState(CatalogueManager.getBody('Jupiter')!, d).pos;
    const m = apparentMagnitude('Jupiter', 69911, jup, earth);
    expect(m).toBeGreaterThan(-3.0);
    expect(m).toBeLessThan(-2.4);
    expect(apparentMagnitude('Sun', 695700, [0, 0, 0], [AU_KM, 0, 0])).toBeCloseTo(-26.74, 2);
  });

  it('reddens and dims sunlight towards the horizon (Earth), not at all without air', () => {
    const high = transmittance(ATMOSPHERES.Earth, 60);
    const low = transmittance(ATMOSPHERES.Earth, 2);
    expect(high[0]).toBeGreaterThan(0.8);
    expect(low[2] / low[0]).toBeLessThan(high[2] / high[0]); // bluer light is lost first
    expect(low[0]).toBeLessThan(high[0]);
  });
});
