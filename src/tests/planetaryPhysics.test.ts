import { describe, it, expect } from 'vitest';
import { AIR } from '../rendering/AirProfiles';
import {
  A_SEA_EARTH,
  G0,
  P_SEA_EARTH,
  RHO_SEA_EARTH,
  T_SEA_EARTH,
  computeAirData,
  computeGravityAt,
  computeStallSpeedMps,
  computeThrustToWeight,
  hasSubstantialAtmosphere,
  sampleAtmosphere,
} from '../flight/PlanetaryPhysics';
import {
  AIRFRAME_SPECS,
  combatMassKg,
  computeEngineThrust,
  computeFuelBurnRateKgPerS,
  getAirframeSpec,
  maxInternalFuelFraction,
  stepFuelMassKg,
} from '../flight/AirframeSpecs';

describe('PlanetaryPhysics & AirProfiles Thermodynamics', () => {
  it('fixes Neptune relative density and giant-planet speeds of sound in AirProfiles', () => {
    expect(AIR.Neptune.surfaceDensity).toBeCloseTo(0.367, 3);
    expect(AIR.Uranus.soundMps).toBeCloseTo(576, 0);
    expect(AIR.Neptune.soundMps).toBeCloseTo(559, 0);
    expect(AIR.Jupiter.soundMps).toBeCloseTo(942, 0);
    expect(AIR.Saturn.soundMps).toBeCloseTo(863, 0);
    expect(AIR.Earth.scaleHeightKm).toBe(8.5);
    expect(AIR.Earth.topKm).toBe(100);
  });

  it('reproduces US Standard Atmosphere 1976 multi-layer checkpoints on Earth', () => {
    const sl = sampleAtmosphere('Earth', 0);
    expect(sl.tempK).toBeCloseTo(T_SEA_EARTH, 2);
    expect(sl.pressurePa).toBeCloseTo(P_SEA_EARTH, 0);
    expect(sl.densityKgM3).toBeCloseTo(RHO_SEA_EARTH, 3);
    expect(sl.soundSpeedMps).toBeCloseTo(A_SEA_EARTH, 1);
    expect(sl.hasOxygen).toBe(true);
    expect(sl.isVacuum).toBe(false);

    const trop = sampleAtmosphere('Earth', 11);
    expect(trop.tempK).toBeCloseTo(216.65, 2);
    expect(trop.pressurePa).toBeCloseTo(22632, -2); // within 50 Pa
    expect(trop.densityKgM3).toBeCloseTo(0.3639, 3);
    expect(trop.soundSpeedMps).toBeCloseTo(295.07, 1);

    const h20 = sampleAtmosphere('Earth', 20);
    expect(h20.tempK).toBeCloseTo(216.65, 2);
    expect(h20.pressurePa).toBeCloseTo(5474.9, -1);
    expect(h20.densityKgM3).toBeCloseTo(0.0880, 3);

    const h32 = sampleAtmosphere('Earth', 32);
    expect(h32.tempK).toBeCloseTo(228.65, 2);
    expect(h32.pressurePa).toBeCloseTo(868.0, -1);
    expect(h32.densityKgM3).toBeCloseTo(0.01322, 4);

    const h47 = sampleAtmosphere('Earth', 47);
    expect(h47.tempK).toBeCloseTo(270.65, 2);
    expect(h47.pressurePa).toBeCloseTo(110.9, 0);

    const karman = sampleAtmosphere('Earth', 100);
    expect(karman.isVacuum).toBe(true);
    expect(karman.densityKgM3).toBe(0);
    expect(karman.pressurePa).toBe(0);
  });

  it('computes compressible CAS/IAS, EAS, Mach, and dynamic pressure cleanly across regimes', () => {
    const sl = sampleAtmosphere('Earth', 0);
    const sub = computeAirData(250, sl);
    expect(sub.mach).toBeCloseTo(250 / sl.soundSpeedMps, 4);
    expect(sub.easMps).toBeCloseTo(250, 2);
    expect(sub.iasMps).toBeCloseTo(250, 1);
    expect(sub.qPa).toBeCloseTo(0.5 * 1.225 * 250 * 250, 0);

    // Continuity across Mach 1.0 and supersonic Rayleigh pitot inversion at sea level
    const m105 = computeAirData(sl.soundSpeedMps * 1.05, sl);
    expect(m105.mach).toBeCloseTo(1.05, 4);
    expect(m105.iasMps).toBeCloseTo(sl.soundSpeedMps * 1.05, 0);

    const m20 = computeAirData(sl.soundSpeedMps * 2.0, sl);
    expect(m20.mach).toBeCloseTo(2.0, 4);
    expect(m20.iasMps).toBeCloseTo(sl.soundSpeedMps * 2.0, 0);

    // At 11 km Mach 0.85, compressible IAS exceeds EAS (compressibility effect)
    const fl360 = sampleAtmosphere('Earth', 11);
    const cruise = computeAirData(0.85 * fl360.soundSpeedMps, fl360);
    expect(cruise.mach).toBeCloseTo(0.85, 4);
    expect(cruise.easMps).toBeLessThan(cruise.tasMps);
    expect(cruise.iasMps).toBeGreaterThan(cruise.easMps);
    expect(cruise.iasMps).toBeCloseTo(146.0, 0);
  });

  it('models distinct planetary atmospheres for Mars, Venus, Titan, and the gas/ice giants', () => {
    const mars0 = sampleAtmosphere('Mars', 0);
    expect(mars0.densityKgM3).toBeGreaterThan(0.014);
    expect(mars0.densityKgM3).toBeLessThan(0.021);
    expect(mars0.soundSpeedMps).toBeCloseTo(231.5, 0);
    expect(mars0.hasOxygen).toBe(false);

    const venus0 = sampleAtmosphere('Venus', 0);
    expect(venus0.tempK).toBeCloseTo(737, 0);
    expect(venus0.pressurePa).toBeCloseTo(9.21e6, -4);
    expect(venus0.densityKgM3).toBeGreaterThan(63);
    expect(venus0.densityKgM3).toBeLessThan(67);
    expect(venus0.soundSpeedMps).toBeGreaterThan(405);

    const venus50 = sampleAtmosphere('Venus', 50);
    expect(venus50.tempK).toBeCloseTo(350, 1);
    expect(venus50.pressurePa).toBeGreaterThan(95000);
    expect(venus50.pressurePa).toBeLessThan(120000);
    expect(venus50.densityKgM3).toBeGreaterThan(1.4);
    expect(venus50.densityKgM3).toBeLessThan(1.8);

    const titan0 = sampleAtmosphere('Titan', 0);
    expect(titan0.tempK).toBeCloseTo(93.65, 2);
    expect(titan0.densityKgM3).toBeCloseTo(5.39, 1);
    expect(titan0.soundSpeedMps).toBeCloseTo(195.6, 0);
    const titanTrop = sampleAtmosphere('Titan', 44);
    expect(titanTrop.tempK).toBeCloseTo(70.33, 1);

    const jup0 = sampleAtmosphere('Jupiter', 0);
    expect(jup0.soundSpeedMps).toBeCloseTo(942, 0);
    const sat0 = sampleAtmosphere('Saturn', 0);
    expect(sat0.soundSpeedMps).toBeCloseTo(863, 0);
    const ura0 = sampleAtmosphere('Uranus', 0);
    expect(ura0.soundSpeedMps).toBeCloseTo(576, 0);
    const nep0 = sampleAtmosphere('Neptune', 0);
    expect(nep0.soundSpeedMps).toBeCloseTo(559, 0);
    expect(nep0.densityKgM3).toBeCloseTo(0.443, 2);

    // Vacuum bodies
    for (const body of ['Moon', 'Mercury', 'Pluto', 'Ceres', 'Vesta', 'Bennu']) {
      expect(hasSubstantialAtmosphere(body)).toBe(false);
      const atm = sampleAtmosphere(body, 0);
      expect(atm.isVacuum).toBe(true);
      expect(atm.densityKgM3).toBe(0);
    }
  });

  it('computes GM/r^2 gravity, spin centrifugal relief, orbital weightlessness, and minor-body gravity', () => {
    const earthEq = computeGravityAt('Earth', { altKm: 0, latitudeRad: 0 });
    const earthPole = computeGravityAt('Earth', { altKm: 0, latitudeRad: Math.PI / 2 });
    expect(earthEq.gGravMps2).toBeCloseTo(9.80, 1);
    expect(earthEq.gSpinReliefMps2).toBeCloseTo(0.0339, 3);
    expect(earthPole.gSpinReliefMps2).toBeCloseTo(0, 6);
    expect(earthEq.gEffectiveMps2).toBeLessThan(earthPole.gEffectiveMps2);

    // LEO orbital weightlessness at 400 km when flying at orbital speed
    const leoStatic = computeGravityAt('Earth', { altKm: 400 });
    const leoOrbit = computeGravityAt('Earth', {
      altKm: 400,
      frame: 'inertial',
      tangentialSpeedMps: leoStatic.orbitalSpeedMps,
    });
    expect(leoOrbit.orbitalSpeedMps).toBeCloseTo(7669, -1);
    expect(leoOrbit.gEffectiveMps2).toBeCloseTo(0, 4);

    // Saturn rapid equatorial spin relief (~15.5%) brings 10.44 m/s^2 down to ~8.83 m/s^2
    const saturnEq = computeGravityAt('Saturn', { altKm: 0, latitudeRad: 0 });
    const satSpinFraction = saturnEq.gSpinReliefMps2 / saturnEq.gGravMps2;
    expect(satSpinFraction).toBeGreaterThan(0.14);
    expect(satSpinFraction).toBeLessThan(0.17);
    expect(saturnEq.gEffectiveMps2).toBeLessThan(9.1);

    // Minor bodies (Vesta, Bennu, Phobos)
    const vestaEq = computeGravityAt('Vesta', { altKm: 0, latitudeRad: 0 });
    expect(vestaEq.gSpinReliefMps2 / vestaEq.gGravMps2).toBeGreaterThan(0.10);

    const bennuEq = computeGravityAt('Bennu', { altKm: 0, latitudeRad: 0 });
    expect(bennuEq.gSpinReliefMps2 / bennuEq.gGravMps2).toBeGreaterThan(0.30);

    const phobosEq = computeGravityAt('Phobos', { altKm: 0, latitudeRad: 0 });
    expect(phobosEq.escapeSpeedMps).toBeGreaterThan(8);
    expect(phobosEq.escapeSpeedMps).toBeLessThan(15);
  });

  it('produces authentic stall speeds and planetary T/W ratios across Earth, Mars, Titan, Venus, Jupiter, Saturn', () => {
    const gripen = AIRFRAME_SPECS.gripen;
    const combatKg = combatMassKg(gripen); // 8500 kg

    // Earth
    const gEarth = computeGravityAt('Earth').gEffectiveMps2;
    const rhoEarth = sampleAtmosphere('Earth', 0).densityKgM3;
    const vsEarth = computeStallSpeedMps(combatKg, gEarth, rhoEarth, gripen.wingAreaM2, gripen.aero.clMaxClean);
    expect(vsEarth).toBeGreaterThan(50);
    expect(vsEarth).toBeLessThan(65);
    expect(computeThrustToWeight(gripen.wetThrustN, combatKg, gEarth)).toBeCloseTo(0.97, 1);

    // Mars: high T/W (> 2.4) yet supersonic stall speed (> 260 m/s) due to thin CO2
    const gMars = computeGravityAt('Mars').gEffectiveMps2;
    const rhoMars = sampleAtmosphere('Mars', 0).densityKgM3;
    const vsMars = computeStallSpeedMps(combatKg, gMars, rhoMars, gripen.wingAreaM2, gripen.aero.clMaxClean);
    expect(computeThrustToWeight(gripen.wetThrustN, combatKg, gMars)).toBeGreaterThan(2.4);
    expect(vsMars).toBeGreaterThan(260);

    // Titan: insane T/W (~7) and ultralight glider stall speed (< 12 m/s)
    const gTitan = computeGravityAt('Titan').gEffectiveMps2;
    const rhoTitan = sampleAtmosphere('Titan', 0).densityKgM3;
    const vsTitan = computeStallSpeedMps(combatKg, gTitan, rhoTitan, gripen.wingAreaM2, gripen.aero.clMaxClean);
    expect(computeThrustToWeight(gripen.wetThrustN, combatKg, gTitan)).toBeGreaterThan(6.5);
    expect(vsTitan).toBeLessThan(12);

    // Venus: supercritical CO2 -> V_s < 8 m/s at surface
    const gVenus = computeGravityAt('Venus').gEffectiveMps2;
    const rhoVenus = sampleAtmosphere('Venus', 0).densityKgM3;
    const vsVenus = computeStallSpeedMps(combatKg, gVenus, rhoVenus, gripen.wingAreaM2, gripen.aero.clMaxClean);
    expect(vsVenus).toBeLessThan(8);

    // Jupiter: > 2g -> T/W < 0.45 (cannot hover vertically on jet thrust alone)
    const gJupiter = computeGravityAt('Jupiter').gEffectiveMps2;
    expect(computeThrustToWeight(gripen.wetThrustN, combatKg, gJupiter)).toBeLessThan(0.45);

    // Saturn equator: spin relief drops g_eff below 9.1 m/s^2 -> Gripen wet T/W > 1.0!
    const gSaturn = computeGravityAt('Saturn').gEffectiveMps2;
    expect(computeThrustToWeight(gripen.wetThrustN, combatKg, gSaturn)).toBeGreaterThan(1.0);

    // Vacuum stall speed is Infinity
    expect(computeStallSpeedMps(combatKg, gEarth, 0, gripen.wingAreaM2, gripen.aero.clMaxClean)).toBe(Infinity);
  });
});

describe('AirframeSpecs Propulsion, Thrust Lapse & Fuel Burn', () => {
  it('exposes locked specs for gripen, su30, and kestrel fallback', () => {
    const gripen = getAirframeSpec('gripen');
    expect(combatMassKg(gripen)).toBe(8500);
    expect(maxInternalFuelFraction(gripen)).toBeCloseTo(2400 / 9200, 4);
    expect(gripen.hasCanards).toBe(true);
    expect(gripen.hasTvc).toBe(false);

    const su30 = getAirframeSpec('su30');
    expect(combatMassKg(su30)).toBe(25000);
    expect(su30.hasTvc).toBe(true);
    expect(su30.tvcCantDeg).toBe(32);
    expect(computeThrustToWeight(su30.wetThrustN, 25000, G0)).toBeCloseTo(1.0, 2);

    const kestrel = getAirframeSpec('unknown-id');
    expect(kestrel.id).toBe('kestrel');
    expect(combatMassKg(kestrel)).toBe(13500);
    expect(kestrel.hasTvc).toBe(true);
  });

  it('models MIL vs AB thrust lapse, airbreathing O2 gating, solaris mode, and Mach 6/25 tiers', () => {
    const su30 = AIRFRAME_SPECS.su30;
    const earthSL = sampleAtmosphere('Earth', 0);
    const earth11 = sampleAtmosphere('Earth', 11);
    const mars0 = sampleAtmosphere('Mars', 0);

    const slStaticMil = computeEngineThrust(su30, {
      throttle: 1.0,
      afterburner: false,
      mach: 0,
      pressurePa: earthSL.pressurePa,
      tempK: earthSL.tempK,
      gamma: earthSL.gamma,
      hasOxygen: true,
    });
    expect(slStaticMil.thrustN).toBeCloseTo(su30.dryThrustN, -1);

    const slStaticWet = computeEngineThrust(su30, {
      throttle: 1.0,
      afterburner: true,
      mach: 0,
      pressurePa: earthSL.pressurePa,
      tempK: earthSL.tempK,
      gamma: earthSL.gamma,
      hasOxygen: true,
    });
    expect(slStaticWet.thrustN).toBeCloseTo(su30.wetThrustN, -1);
    // Wet AB fuel flow is > 3.5x MIL flow
    expect(slStaticWet.fuelFlowKgPerS).toBeGreaterThan(slStaticMil.fuelFlowKgPerS * 3.5);

    // At 11 km M=2.0, afterburner delivers meaningful fraction (~40-65%) while dry turbine core drops off harder
    const cruiseWet = computeEngineThrust(su30, {
      throttle: 1.0,
      afterburner: true,
      mach: 2.0,
      pressurePa: earth11.pressurePa,
      tempK: earth11.tempK,
      gamma: earth11.gamma,
      hasOxygen: true,
    });
    expect(cruiseWet.wetLapse).toBeGreaterThan(0.35);
    expect(cruiseWet.wetLapse).toBeLessThan(0.75);
    expect(cruiseWet.dryLapse).toBeLessThan(cruiseWet.wetLapse * 0.45);

    // Pure airbreathing mode produces 0 thrust without O2, whereas solaris dual-mode produces rated Mars T/W
    const marsAir = computeEngineThrust(su30, {
      throttle: 1.0,
      afterburner: true,
      mach: 0,
      pressurePa: mars0.pressurePa,
      tempK: mars0.tempK,
      gamma: mars0.gamma,
      hasOxygen: mars0.hasOxygen,
      mode: 'airbreathing',
    });
    expect(marsAir.thrustN).toBe(0);

    const marsSolaris = computeEngineThrust(su30, {
      throttle: 1.0,
      afterburner: true,
      mach: 0,
      pressurePa: mars0.pressurePa,
      tempK: mars0.tempK,
      gamma: mars0.gamma,
      hasOxygen: mars0.hasOxygen,
      surfacePressurePa: mars0.surfacePressurePa,
      surfaceTempK: mars0.surfaceTempK,
      gEffMps2: computeGravityAt('Mars').gEffectiveMps2,
      mode: 'solaris',
    });
    expect(marsSolaris.thrustN).toBeCloseTo(su30.wetThrustN, -1);
    expect(marsSolaris.thrustToWeight).toBeGreaterThan(2.5);

    // Hypersonic / Scramjet speed tier scales thrust cleanly
    const scram = computeEngineThrust(su30, {
      throttle: 1.0,
      afterburner: true,
      mach: 15,
      pressurePa: earth11.pressurePa,
      tempK: earth11.tempK,
      speedTier: 'scramjet',
      airAccelScale: 60,
    });
    expect(scram.thrustN).toBeGreaterThan(su30.wetThrustN * 10);

    // Mid-throttle boost engages Zone 2 AB (> MIL thrust) and honors explicit abFraction
    const midBoost = computeEngineThrust(su30, {
      throttle: 0.5,
      afterburner: true,
      mach: 0,
      pressurePa: earthSL.pressurePa,
      tempK: earthSL.tempK,
      gamma: earthSL.gamma,
      hasOxygen: true,
    });
    expect(midBoost.abFraction).toBeCloseTo(0.68, 2);
    expect(midBoost.thrustN).toBeGreaterThan(su30.dryThrustN);
    expect(midBoost.thrustN).toBeLessThan(su30.wetThrustN);

    const customAb = computeEngineThrust(su30, {
      throttle: 0.4,
      afterburner: false,
      abFraction: 0.5,
      mach: 0,
      pressurePa: earthSL.pressurePa,
      tempK: earthSL.tempK,
      gamma: earthSL.gamma,
      hasOxygen: true,
    });
    expect(customAb.abFraction).toBe(0.5);
    expect(customAb.thrustN).toBeCloseTo(0.5 * (su30.dryThrustN + su30.wetThrustN), -1);
  });

  it('tracks fuel burn rate and reserve floor cleanly', () => {
    const gripen = AIRFRAME_SPECS.gripen;
    const milFlow = computeFuelBurnRateKgPerS(gripen, {
      throttle: 1,
      afterburner: false,
      thrustN: gripen.dryThrustN,
    });
    expect(milFlow).toBeCloseTo(1.193, 2);

    const wetFlow = computeFuelBurnRateKgPerS(gripen, {
      throttle: 1,
      afterburner: true,
      thrustN: gripen.wetThrustN,
    });
    expect(wetFlow).toBeCloseTo(4.331, 2);

    const after100s = stepFuelMassKg(gripen, gripen.initialFuelKg, wetFlow, 100);
    expect(after100s).toBeCloseTo(1700 - wetFlow * 100, 3);

    // Default reserve floor prevents full lockout unless allowFullDepletion is true
    const reserved = stepFuelMassKg(gripen, 100, 20, 60, false);
    expect(reserved).toBeCloseTo(gripen.maxFuelKg * 0.02, 4);
    expect(stepFuelMassKg(gripen, 100, 20, 60, true)).toBe(0);
  });
});
