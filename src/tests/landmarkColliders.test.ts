import { describe, it, expect } from 'vitest';
import {
  geoDistanceKm,
  getLandmarkSolidElevationKm,
  getNearestSolidCollider,
  SOLID_LANDMARKS,
} from '../flight/LandmarkColliders';

describe('LandmarkColliders & Solid Physics Hulls', () => {
  it('correctly calculates spherical distance between coordinates', () => {
    // Distance from Eiffel Tower (48.8584, 2.2945) to itself is 0
    expect(geoDistanceKm(48.8584, 2.2945, 48.8584, 2.2945)).toBeCloseTo(0, 5);
    // Distance across 1 degree of latitude is ~111 km
    expect(geoDistanceKm(0, 0, 1, 0)).toBeCloseTo(111.19, 1);
  });

  it('guarantees solid physical elevation for Mount Everest peak at 8,848 m', () => {
    const everest = SOLID_LANDMARKS.find((l) => l.name === 'Mount Everest')!;
    expect(everest).toBeDefined();

    // At exact summit coordinates
    const summitElev = getLandmarkSolidElevationKm(everest.lat, everest.lon);
    expect(summitElev).toBeCloseTo(8.848, 2);

    // 1 km away from summit along ridge
    const ridgeElev = getLandmarkSolidElevationKm(everest.lat + 0.008, everest.lon);
    expect(ridgeElev).toBeGreaterThan(7.5);
    expect(ridgeElev).toBeLessThanOrEqual(8.848);

    // Far away (>10 km) should be 0
    expect(getLandmarkSolidElevationKm(everest.lat + 0.5, everest.lon)).toBe(0);
  });

  it('guarantees solid physical collider for Eiffel Tower at 330 m + ground', () => {
    const eiffel = SOLID_LANDMARKS.find((l) => l.name.includes('Eiffel Tower'))!;
    expect(eiffel).toBeDefined();

    // Center of Eiffel Tower should be ~365 m (0.365 km)
    const towerElev = getLandmarkSolidElevationKm(eiffel.lat, eiffel.lon);
    expect(towerElev).toBeCloseTo(0.365, 2);

    // 40 metres away (on tower leg footprint)
    const legElev = getLandmarkSolidElevationKm(eiffel.lat + 0.00035, eiffel.lon);
    expect(legElev).toBeGreaterThan(0.2);

    // 500 metres away should be 0 (collider is localized to the monument)
    expect(getLandmarkSolidElevationKm(eiffel.lat + 0.01, eiffel.lon)).toBe(0);
  });

  it('guarantees solid physical collider for Burj Khalifa (828 m spire)', () => {
    const burj = SOLID_LANDMARKS.find((l) => l.name.includes('Burj Khalifa'))!;
    expect(burj).toBeDefined();

    const spireElev = getLandmarkSolidElevationKm(burj.lat, burj.lon);
    expect(spireElev).toBeCloseTo(0.838, 2);
  });

  it('guarantees solid rim elevation for Grand Canyon at 2,150 m', () => {
    const canyon = SOLID_LANDMARKS.find((l) => l.name.includes('Grand Canyon'))!;
    expect(canyon).toBeDefined();

    const rimElev = getLandmarkSolidElevationKm(canyon.lat, canyon.lon);
    expect(rimElev).toBeCloseTo(2.150, 2);
  });

  it('finds nearest solid collider metadata within range', () => {
    const hit = getNearestSolidCollider(48.8584, 2.2945);
    expect(hit).not.toBeNull();
    expect(hit!.collider.name).toContain('Eiffel Tower');
    expect(hit!.distKm).toBeCloseTo(0, 3);
    expect(hit!.heightKm).toBeCloseTo(0.365, 2);
  });
});
