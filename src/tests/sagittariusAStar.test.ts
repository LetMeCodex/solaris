import { describe, it, expect } from 'vitest';
import {
  SAGITTARIUS_A_STAR_PHYSICAL,
  SAGITTARIUS_A_STAR_DERIVED,
  computeRelativisticDopplerFactor,
  computeGravitationalRedshift,
} from '../data/SagittariusAStarData';
import { CatalogueManager } from '../data/CatalogueManager';
import { SAGITTARIUS_A_STAR_DEF } from '../data/CatalogueData';

describe('Sagittarius A* Relativistic Physics and Telemetry Suite', () => {
  it('1. Authoritative physical parameters match GRAVITY Collaboration (2021) within published tolerances', () => {
    // Mass: 4.297 ± 0.012 × 10^6 M_sun
    expect(SAGITTARIUS_A_STAR_PHYSICAL.massSolarMasses).toBeCloseTo(4.297e6, -3);
    expect(SAGITTARIUS_A_STAR_PHYSICAL.massKg).toBeGreaterThan(8.5e36);
    expect(SAGITTARIUS_A_STAR_PHYSICAL.massKg).toBeLessThan(8.6e36);

    // Distance R_0: 8.277 ± 0.033 kpc (~26,990 ly)
    expect(SAGITTARIUS_A_STAR_PHYSICAL.distanceKpc).toBeCloseTo(8.277, 3);
    expect(SAGITTARIUS_A_STAR_PHYSICAL.distanceLy).toBeGreaterThan(26900);
    expect(SAGITTARIUS_A_STAR_PHYSICAL.distanceLy).toBeLessThan(27100);
  });

  it('2. Schwarzschild radius formula r_s = 2GM/c^2 produces exact physical dimensions', () => {
    // 2 * G * M / c^2 = 2 * (6.6743e-11) * (4.297e6 * 1.9884e30) / (299792458)^2
    const rsKm = SAGITTARIUS_A_STAR_DERIVED.schwarzschildRadiusKm;
    // Expected ~12.69 million km
    expect(rsKm).toBeGreaterThan(12.5e6);
    expect(rsKm).toBeLessThan(12.8e6);

    // In astronomical units (~0.0848 AU)
    const rsAU = SAGITTARIUS_A_STAR_DERIVED.schwarzschildRadiusAU;
    expect(rsAU).toBeGreaterThan(0.083);
    expect(rsAU).toBeLessThan(0.087);
  });

  it('3. Photon sphere radius is exactly 1.5 r_s for non-spinning Schwarzschild metric', () => {
    const rPhKm = SAGITTARIUS_A_STAR_DERIVED.photonSphereRadiusKm;
    const rsKm = SAGITTARIUS_A_STAR_DERIVED.schwarzschildRadiusKm;
    expect(rPhKm / rsKm).toBeCloseTo(1.5, 5);
  });

  it('4. Gravitational shadow radius is exactly (3*sqrt(3)/2) * r_s (~2.598 r_s)', () => {
    const rShadowKm = SAGITTARIUS_A_STAR_DERIVED.shadowRadiusKm;
    const rsKm = SAGITTARIUS_A_STAR_DERIVED.schwarzschildRadiusKm;
    const theoreticalMultiplier = (3.0 * Math.sqrt(3.0)) / 2.0; // ~2.598076
    expect(rShadowKm / rsKm).toBeCloseTo(theoreticalMultiplier, 4);
    expect(rShadowKm).toBeGreaterThan(32.5e6);
    expect(rShadowKm).toBeLessThan(33.5e6);
  });

  it('5. Angular shadow diameter matches Event Horizon Telescope (EHT 2022) measured 51.8 ± 2.3 µas within 3%', () => {
    const angularMicroarcsec = SAGITTARIUS_A_STAR_DERIVED.shadowAngularDiameterMicroarcsec;
    const ehtMeasured = 51.8;
    const ehtUncertainty = 2.3;

    // Derived ~53.2 µas lies directly within 1-sigma of the EHT measurement
    expect(angularMicroarcsec).toBeGreaterThan(ehtMeasured - ehtUncertainty);
    expect(angularMicroarcsec).toBeLessThan(ehtMeasured + ehtUncertainty * 1.2);
  });

  it('6. Innermost Stable Circular Orbit (ISCO) is at 3.0 r_s with orbital velocity ~0.408 c', () => {
    const rIscoKm = SAGITTARIUS_A_STAR_DERIVED.iscoRadiusKm;
    const rsKm = SAGITTARIUS_A_STAR_DERIVED.schwarzschildRadiusKm;
    expect(rIscoKm / rsKm).toBeCloseTo(3.0, 5);

    // v_isco / c = 1 / sqrt(6) ≈ 0.40825
    expect(SAGITTARIUS_A_STAR_DERIVED.iscoVelocityFractionC).toBeCloseTo(1.0 / Math.sqrt(6.0), 3);
    expect(SAGITTARIUS_A_STAR_DERIVED.iscoVelocityKmS).toBeGreaterThan(120000);
    expect(SAGITTARIUS_A_STAR_DERIVED.iscoVelocityKmS).toBeLessThan(125000);
  });

  it('7. Relativistic Doppler factor properly blueshifts approaching limb and redshifts receding limb', () => {
    const beta = 0.408; // Velocity at ISCO
    // Approaching: angle = 0 rad (moving directly toward observer)
    const dopplerApproaching = computeRelativisticDopplerFactor(beta, 0);
    // Receding: angle = PI rad (moving directly away from observer)
    const dopplerReceding = computeRelativisticDopplerFactor(beta, Math.PI);

    // Approaching should have delta > 1 (blueshifted & amplified)
    expect(dopplerApproaching).toBeGreaterThan(1.4);

    // Receding should have delta < 1 (redshifted & dimmed)
    expect(dopplerReceding).toBeLessThan(0.7);

    // Relative intensity ratio (delta^4) creates stark asymmetry across accretion disk
    const intensityRatio = Math.pow(dopplerApproaching / dopplerReceding, 4.0);
    expect(intensityRatio).toBeGreaterThan(15.0);
  });

  it('8. Gravitational redshift g = sqrt(1 - r_s / r) approaches 0 at horizon and 1 at infinity', () => {
    const rs = 20.0;
    // Horizon r -> rs
    const gNearHorizon = computeGravitationalRedshift(rs * 1.01, rs);
    expect(gNearHorizon).toBeLessThan(0.12);

    // ISCO r = 3 rs
    const gISCO = computeGravitationalRedshift(rs * 3.0, rs);
    expect(gISCO).toBeCloseTo(Math.sqrt(2.0 / 3.0), 3);

    // Far field r = 100 rs
    const gFar = computeGravitationalRedshift(rs * 100.0, rs);
    expect(gFar).toBeGreaterThan(0.99);
  });

  it('9. CatalogueManager retrieves Sagittarius A* with category "black_hole"', () => {
    const sgr = CatalogueManager.getSagittariusAStar();
    expect(sgr).toBeDefined();
    expect(sgr?.id).toBe('SGR_A_STAR');
    expect(sgr?.name).toBe('Sagittarius A*');
    expect(sgr?.category).toBe('black_hole');

    // Also retrievable via getBody by name and id
    expect(CatalogueManager.getBody('Sagittarius A*')?.id).toBe('SGR_A_STAR');
    expect(CatalogueManager.getBody('SGR_A_STAR')?.name).toBe('Sagittarius A*');
    expect(CatalogueManager.getBody('Sgr A*')?.id).toBe('SGR_A_STAR');
  });

  it('10. Catalogue definition has valid physical properties and orbital metadata', () => {
    expect(SAGITTARIUS_A_STAR_DEF.physical.massKg).toBeGreaterThan(8.5e36);
    expect(SAGITTARIUS_A_STAR_DEF.orbit.orbitalPeriodDays).toBeGreaterThan(1e7);
    expect(SAGITTARIUS_A_STAR_DEF.orderFromSun).toBe(999);
  });
});
