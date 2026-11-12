import { describe, expect, it } from 'vitest';
import { decodeGrey, elevationFor, planetElevation, RELIEF_BODIES } from '../explorer/PlanetElevation';
import { decodeLerc1 } from '../explorer/Lerc1';
import { BODY_IMAGERY, imageryEyeKm } from '../explorer/ImageryRegistry';
import { LANDMARKS, angularDistanceDeg } from '../explorer/Landmarks';

describe('Planet elevation', () => {
  it('streams real heights for the Moon and Mars only, and Earth through the same seam', () => {
    expect(RELIEF_BODIES.sort()).toEqual(['Mars', 'Moon']);
    expect(planetElevation('Io')).toBeNull();
    expect(elevationFor('Earth')).not.toBeNull();
    expect(planetElevation('Moon')!.datumKm).toBeGreaterThan(9.15); // below the LOLA minimum, −9.15 km
  });

  it('decodes 8-bit Trek heights on their calibrated stretch and smooths the steps', () => {
    // 3 × 1 grey ramp, alpha 0 on the last pixel (no data)
    const px = new Uint8Array([0, 0, 0, 255, 255, 255, 255, 255, 9, 9, 9, 0]);
    const h = decodeGrey(px, 3, 1, -9.15, 19.91 / 255);
    expect(Number.isNaN(h[2])).toBe(true);
    // Two smoothing passes average the two valid samples: (−9.15 + 10.76) / 2
    expect(h[0]).toBeCloseTo(0.805, 2);
    expect(h[1]).toBeCloseTo(0.805, 2);
  });

  it('rejects data that is not LERC1', () => {
    expect(() => decodeLerc1(new TextEncoder().encode('not a raster at all').buffer)).toThrow();
  });
});

describe('Landing views on other worlds', () => {
  it('stands high over flat imagery, lower over real relief, and under the haze on Titan', () => {
    expect(imageryEyeKm(BODY_IMAGERY.Moon, true)).toBeLessThan(1);
    expect(imageryEyeKm(BODY_IMAGERY.Io, false)).toBeGreaterThan(20);
    expect(imageryEyeKm(BODY_IMAGERY.Titan, false)).toBeLessThanOrEqual(1.5);
  });

  it('steps back from features on flat worlds so a downward look lands on them', () => {
    const loki = LANDMARKS.find((l) => l.id === 'io-loki')!;
    expect(loki.vantageLat).toBeDefined();
    expect(loki.viewPitchDeg).toBeLessThan(0);
    const backDeg = angularDistanceDeg(loki.lat, loki.lon, loki.vantageLat!, loki.vantageLon!);
    expect(backDeg).toBeGreaterThan(1); // ~160 km on Io, a few degrees
    expect(backDeg).toBeLessThan(10);
  });

  it('never lands at a pole, where the equirectangular tiles break down', () => {
    for (const l of LANDMARKS) if (l.body !== 'Earth') expect(Math.abs(l.vantageLat ?? l.lat), l.id).toBeLessThan(85);
  });
});
