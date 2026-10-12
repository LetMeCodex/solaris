import { describe, it, expect } from 'vitest';
import { CoordinateFrames } from '../astronomy/CoordinateFrames';

describe('CoordinateFrames — Mathematical Invertibility & Orthogonality', () => {
  it('preserves vector length during Ecliptic <-> ICRF transformations (isometry)', () => {
    const testVectors: Array<[number, number, number]> = [
      [149597870.7, 0, 0],
      [0, 108208000.0, 0],
      [0, 0, 57909050.0],
      [123456.78, 987654.32, -456789.01],
    ];

    for (const v of testVectors) {
      const origLength = Math.hypot(v[0], v[1], v[2]);
      const icrf = CoordinateFrames.eclipticToIcrf(v);
      const icrfLength = Math.hypot(icrf[0], icrf[1], icrf[2]);

      // Relative error should be within machine epsilon (1e-14)
      const relError = Math.abs(icrfLength - origLength) / origLength;
      expect(relError).toBeLessThan(1e-14);
    }
  });

  it('guarantees exact round-trip conversion between Ecliptic and ICRF', () => {
    const original: [number, number, number] = [149597870.7, 45000000.0, -12000000.0];
    const icrf = CoordinateFrames.eclipticToIcrf(original);
    const roundtrip = CoordinateFrames.icrfToEcliptic(icrf);

    expect(roundtrip[0]).toBeCloseTo(original[0], 6);
    expect(roundtrip[1]).toBeCloseTo(original[1], 6);
    expect(roundtrip[2]).toBeCloseTo(original[2], 6);
  });

  it('guarantees exact round-trip conversion between Ecliptic and Three.js coordinates', () => {
    const original: [number, number, number] = [778570000.0, -220000000.0, 15000000.0];
    const threeCoord = CoordinateFrames.eclipticToThree(original);
    const roundtrip = CoordinateFrames.threeToEcliptic(threeCoord);

    expect(roundtrip[0]).toBeCloseTo(original[0], 6);
    expect(roundtrip[1]).toBeCloseTo(original[1], 6);
    expect(roundtrip[2]).toBeCloseTo(original[2], 6);
  });
});
