import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  observationDistanceRatio,
  angularRadiusDeg,
  CameraRig,
  OBSERVATION_FOV_DEG,
  REFERENCE_ALTITUDE_EARTH_RADII,
} from '../navigation/CameraRig';
import { lensSourcePoint, LENS_PROFILES } from '../rendering/LensPipeline';

describe('Observation camera framing', () => {
  it('reproduces the reference altitude over Earth (13,517 km ≈ 2.12 R⊕)', () => {
    const k = observationDistanceRatio(6371);
    expect(k).toBeCloseTo(1 + REFERENCE_ALTITUDE_EARTH_RADII, 6);
    expect((k - 1) * 6371).toBeCloseTo(13506, -2);
    // Earth then spans ~37° of a 55° vertical lens — about two-thirds of the frame height
    expect(2 * angularRadiusDeg(k) / OBSERVATION_FOV_DEG).toBeGreaterThan(0.6);
  });

  it('keeps the NASA size ordering on screen: bigger bodies subtend bigger angles', () => {
    const radiiKm: Record<string, number> = { Jupiter: 69911, Neptune: 24622, Earth: 6371, Mars: 3389.5, Moon: 1737.4, Phobos: 11.27 };
    const angles = Object.entries(radiiKm).map(([n, r]) => [n, angularRadiusDeg(observationDistanceRatio(r))] as const);
    for (let i = 1; i < angles.length; i++) {
      expect(angles[i - 1][1], `${angles[i - 1][0]} vs ${angles[i][0]}`).toBeGreaterThan(angles[i][1]);
    }
    // Jupiter overfills the frame height, the Moon is clearly smaller than Earth
    expect(2 * angularRadiusDeg(observationDistanceRatio(69911))).toBeGreaterThan(OBSERVATION_FOV_DEG);
  });

  it('honours a minimum distance ratio (ring clearance)', () => {
    expect(observationDistanceRatio(58232, 2.9)).toBe(2.9);
  });

  it('chooses a sunlit vantage ~55° from the Sun direction', () => {
    const toSun = new THREE.Vector3(-1, 0, 0.3).normalize();
    const dir = CameraRig.chooseObservationVantage(toSun, -0.34);
    expect(dir.length()).toBeCloseTo(1, 6);
    expect(THREE.MathUtils.radToDeg(dir.angleTo(toSun))).toBeCloseTo(55, 0);
  });
});

describe('Lens warp', () => {
  it('is the identity without distortion', () => {
    expect(lensSourcePoint(0.4, -0.3, 16 / 9, 0)).toEqual([0.4, -0.3]);
  });

  it('keeps the corners fixed and magnifies the centre (barrel)', () => {
    const a = 16 / 9;
    const k = LENS_PROFILES.cinematic.distortion;
    const [cx, cy] = lensSourcePoint(a, 1, a, k);
    expect(cx).toBeCloseTo(a, 9);
    expect(cy).toBeCloseTo(1, 9);
    const [sx] = lensSourcePoint(0.1, 0, a, k);
    expect(sx).toBeLessThan(0.1); // a small output offset samples an even smaller source offset
  });
});
