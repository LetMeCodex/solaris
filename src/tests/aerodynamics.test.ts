import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { AIRFRAME_SPECS, combatMassKg } from '../flight/AirframeSpecs';
import { sampleAtmosphere } from '../flight/PlanetaryPhysics';
import { FlightModel, unitsPerMps } from '../flight/FlightModel';
import {
  AeroAirframeConfig,
  AeroSurfaceInputs,
  G0_MPS2,
  RHO0_EARTH,
  P0_EARTH,
  A0_EARTH,
  computeAirData,
  computeAeroCoefficients,
  computeAeroForcesAndMoments,
  computeCornerSpeed,
  computeFlowAngles,
  computeTurnPerformance,
  groundEffectFactors,
  inducedDragFactor,
  liftCurveSlope,
  pitotImpactRatio,
  solveEulerAngularAccel,
  specificExcessPowerMps,
  waveDragCoeff,
} from '../flight/Aerodynamics';

const REF_JET: AeroAirframeConfig = {
  wingAreaM2: 30.0,
  spanM: 8.02,
  macM: 4.10,
  effAspectRatio: 3.2,
  sweepDeg: 36,
  thicknessRatio: 0.045,
  gLimitPos: 9.0,
  gLimitNeg: -3.0,
  hasCanards: true,
  hasTvc: false,
  inertia: [11_500, 62_000, 71_000, 1_100],
};

const CLEAN_SURF: AeroSurfaceInputs = {
  elev: 0,
  ail: 0,
  rud: 0,
  flaps: 0,
  slats: 0,
  gear: 0,
  speedbrake: 0,
};

describe('flow angles and coordinate mapping', () => {
  it('computes alpha across 0..180 deg, negative alpha, sideslip, and zero-speed safely', () => {
    // Pure forward flight (-Z)
    const fwd = computeFlowAngles(new THREE.Vector3(0, 0, -200));
    expect(fwd.alphaDeg).toBeCloseTo(0, 6);
    expect(fwd.betaDeg).toBeCloseTo(0, 6);

    // Nose pitched up +15 deg relative to velocity -> relative wind hits bottom (+w -> negative B3.y)
    const rad15 = THREE.MathUtils.degToRad(15);
    const up15 = computeFlowAngles(new THREE.Vector3(0, -200 * Math.sin(rad15), -200 * Math.cos(rad15)));
    expect(up15.alphaDeg).toBeCloseTo(15, 4);

    // Cobra 100 deg: nose pitched past vertical (+Z forward velocity component, -Y upward wind)
    const rad100 = THREE.MathUtils.degToRad(100);
    const cobra = computeFlowAngles(new THREE.Vector3(0, -120 * Math.sin(rad100), -120 * Math.cos(rad100)));
    expect(cobra.alphaDeg).toBeCloseTo(100, 4);

    // Tail-first tailslide 180 deg (+Z velocity in body frame)
    const tail = computeFlowAngles(new THREE.Vector3(0, 0, 50));
    expect(Math.abs(tail.alphaDeg)).toBeCloseTo(180, 4);

    // Negative AoA -10 deg
    const radNeg10 = THREE.MathUtils.degToRad(-10);
    const neg = computeFlowAngles(new THREE.Vector3(0, -200 * Math.sin(radNeg10), -200 * Math.cos(radNeg10)));
    expect(neg.alphaDeg).toBeCloseTo(-10, 4);

    // Sideslip from starboard (+X body velocity)
    const slip = computeFlowAngles(new THREE.Vector3(20, 0, -199));
    expect(slip.betaDeg).toBeCloseTo(THREE.MathUtils.radToDeg(Math.asin(20 / Math.hypot(20, 199))), 4);

    // Zero speed has no NaNs and smoothly yields 0
    const zero = computeFlowAngles(new THREE.Vector3(0, 0, 0));
    expect(Number.isFinite(zero.alphaRad)).toBe(true);
    expect(zero.alphaRad).toBe(0);
    expect(zero.betaRad).toBe(0);
  });
});

describe('compressible air data (Saint-Venant & Rayleigh Pitot)', () => {
  it('is C1-continuous across Mach 1 and matches sea-level IAS/EAS/TAS', () => {
    const below = pitotImpactRatio(1 - 1e-5);
    const atOne = pitotImpactRatio(1);
    const above = pitotImpactRatio(1 + 1e-5);
    expect(atOne).toBeCloseTo(0.892929, 5);
    const leftSlope = (atOne - below) / 1e-5;
    const rightSlope = (above - atOne) / 1e-5;
    expect(leftSlope).toBeCloseTo(2.208, 2);
    expect(rightSlope).toBeCloseTo(leftSlope, 2);

    const slSub = computeAirData(0.85 * A0_EARTH, RHO0_EARTH, P0_EARTH, A0_EARTH);
    expect(slSub.mach).toBeCloseTo(0.85, 6);
    expect(slSub.easMps).toBeCloseTo(slSub.tasMps, 4);
    expect(slSub.iasMps).toBeCloseTo(slSub.tasMps, 2);

    const slSup = computeAirData(1.4 * A0_EARTH, RHO0_EARTH, P0_EARTH, A0_EARTH);
    expect(slSup.iasMps).toBeCloseTo(slSup.tasMps, 2);

    // At 11 km altitude (rho = 0.3639, p = 22632, a = 295.1): TAS > IAS > EAS for M > 0.5
    const hi = computeAirData(1.4 * 295.1, 0.3639, 22_632, 295.1);
    expect(hi.tasMps).toBeGreaterThan(hi.iasMps);
    expect(hi.iasMps).toBeGreaterThan(hi.easMps);
    expect(hi.qPa).toBeCloseTo(0.5 * 0.3639 * (1.4 * 295.1) ** 2, 1);
  });
});

describe('3D lift, LEX vortex, post-stall 0..180 deg, sideslip, ground effect & config', () => {
  const atAlpha = (deg: number, betaDeg = 0, mach = 0.3, altM = 1000, surf = CLEAN_SURF) => {
    const a = THREE.MathUtils.degToRad(deg);
    const b = THREE.MathUtils.degToRad(betaDeg);
    const flow = {
      speedMps: 150,
      uMps: 150 * Math.cos(a) * Math.cos(b),
      vMps: 150 * Math.sin(b),
      wMps: 150 * Math.sin(a) * Math.cos(b),
      alphaRad: a,
      alphaDeg: deg,
      betaRad: b,
      betaDeg,
    };
    return computeAeroCoefficients(flow, mach, altM, surf, REF_JET);
  };

  it('produces asymmetric pre-stall, LEX vortex peak, and 0..180 deg post-stall behavior', () => {
    const a0 = atAlpha(0);
    const a10 = atAlpha(10);
    const a25 = atAlpha(25);
    const a50 = atAlpha(50);
    const a90 = atAlpha(90);
    const a135 = atAlpha(135);
    const a180 = atAlpha(180);
    const aNeg18 = atAlpha(-18);

    expect(a0.cl).toBeGreaterThan(0);
    expect(a10.cl).toBeGreaterThan(0.65);
    expect(a25.cl).toBeGreaterThan(1.42); // Polhamus vortex lift carries past 20 deg
    expect(a25.cl).toBeGreaterThan(Math.abs(aNeg18.cl)); // asymmetric positive vs negative camber/stall
    expect(a50.cl).toBeGreaterThan(0.75); // deep stall still generates flat-plate lift
    expect(Math.abs(a90.cl)).toBeLessThan(0.05);
    expect(a90.cd).toBeGreaterThan(1.35); // perpendicular bluff drag peak
    expect(a135.cl).toBeLessThan(-0.7); // tailslide negative lift
    expect(Math.abs(a180.cl)).toBeLessThan(0.05);
    expect(a180.cd).toBeGreaterThan(a0.cd * 10); // blunt tail drag > nose-first C_D0
  });

  it('models sideslip stability, post-stall weathercock degradation, and lift cosine drop', () => {
    const clean = atAlpha(12, 0);
    const slipped = atAlpha(12, 20);
    expect(slipped.cl).toBeLessThan(clean.cl);
    expect(slipped.cy).toBeLessThan(-0.2); // positive beta -> negative (leftward) restoring force
    expect(slipped.clRoll).toBeLessThan(0); // negative dihedral effect (rolls away from sideslip)
    expect(slipped.cnYaw).toBeGreaterThan(0); // weathercock positive at normal alpha

    // Deep post-stall vertical fin blanking erodes weathercock Cn_beta
    const highAlphaSlip = atAlpha(46, 15);
    expect(highAlphaSlip.cnYaw).toBeLessThanOrEqual(0);
  });

  it('captures Hoerner ground effect near terrain and gates it at high AoA', () => {
    const cla = liftCurveSlope(0.25, REF_JET.effAspectRatio, REF_JET.sweepDeg);
    const low = groundEffectFactors(0.1, REF_JET.spanM, REF_JET.effAspectRatio, cla, 0.1);
    const high = groundEffectFactors(50, REF_JET.spanM, REF_JET.effAspectRatio, cla, 0.1);
    const vert = groundEffectFactors(0.1, REF_JET.spanM, REF_JET.effAspectRatio, cla, Math.PI / 2);

    expect(low.sigmaGe).toBeLessThan(0.7);
    expect(low.kGeLift).toBeGreaterThan(1.07);
    expect(high.sigmaGe).toBe(1);
    expect(high.kGeLift).toBe(1);
    expect(vert.kGeLift).toBeCloseTo(1, 6);
  });

  it('applies flaps, slats, landing gear, and speedbrake increments properly', () => {
    const clean = atAlpha(12, 0, 0.25, 500, CLEAN_SURF);
    const landing = atAlpha(12, 0, 0.25, 500, { ...CLEAN_SURF, flaps: 1, slats: 1, gear: 1 });
    const braked = atAlpha(12, 0, 0.25, 500, { ...CLEAN_SURF, speedbrake: 1 });

    expect(landing.cl).toBeGreaterThan(clean.cl + 0.45);
    expect(landing.clMaxEffective).toBeGreaterThan(clean.clMaxEffective + 0.4);
    expect(landing.cd0Total).toBeGreaterThan(clean.cd0Total + 0.045);
    expect(braked.cd0Total).toBeGreaterThan(clean.cd0Total + 0.055);
  });
});

describe('transonic wave drag bump, forces/moments, and Boyd E-M metrics', () => {
  it('models transonic wave drag bump across Mach 0.85..1.35 and induced drag transition', () => {
    expect(waveDragCoeff(0.7, 0.15, 36, 0.045)).toBe(0);
    const m085 = waveDragCoeff(0.85, 0.15, 36, 0.045);
    const m105 = waveDragCoeff(1.05, 0.15, 36, 0.045);
    const m135 = waveDragCoeff(1.35, 0.15, 36, 0.045);
    const m200 = waveDragCoeff(2.0, 0.15, 36, 0.045);

    expect(m085).toBeGreaterThan(0);
    expect(m105).toBeGreaterThan(0.02);
    expect(m105).toBeGreaterThan(m135);
    expect(m135).toBeGreaterThan(m200);

    expect(inducedDragFactor(1.35, 3.2, 0.76)).toBeGreaterThan(inducedDragFactor(0.7, 3.2, 0.76));
  });

  it('projects lift perpendicular and drag opposite to relative velocity in 3D, with I_xz coupling', () => {
    const vBody = new THREE.Vector3(15, -45, -180);
    const flow = computeFlowAngles(vBody);
    const air = computeAirData(flow.speedMps, RHO0_EARTH, P0_EARTH, A0_EARTH);
    const res = computeAeroForcesAndMoments(
      {
        flow,
        air,
        rhoKgM3: RHO0_EARTH,
        altAboveGroundM: 500,
        ratesB3: new THREE.Vector3(0.3, -0.1, 0.4),
        surfaces: CLEAN_SURF,
      },
      REF_JET
    );

    // Dot product of aerodynamic force with unit velocity equals -Drag exactly
    const vHat = vBody.clone().normalize();
    expect(res.forceB3.dot(vHat)).toBeCloseTo(-res.dragN, 3);
    expect(res.liftN).toBeGreaterThan(0);
    expect(res.dragN).toBeGreaterThan(0);

    // Zero speed yields zero forces/moments without NaN
    const zeroFlow = computeFlowAngles(new THREE.Vector3());
    const zeroAir = computeAirData(0, RHO0_EARTH, P0_EARTH, A0_EARTH);
    const zeroRes = computeAeroForcesAndMoments(
      {
        flow: zeroFlow,
        air: zeroAir,
        rhoKgM3: RHO0_EARTH,
        altAboveGroundM: 5,
        ratesB3: new THREE.Vector3(1, 1, 1),
        surfaces: CLEAN_SURF,
      },
      REF_JET
    );
    expect(zeroRes.forceB3.length()).toBe(0);
    expect(zeroRes.momentB3.length()).toBe(0);

    // Euler coupling: pure roll moment with non-zero I_xz produces non-zero yaw acceleration
    const alphaDot = solveEulerAngularAccel(
      new THREE.Vector3(0, 0, -50_000),
      new THREE.Vector3(0, 0, 0),
      REF_JET.inertia
    );
    expect(Math.abs(alphaDot.z)).toBeGreaterThan(1);
    expect(Math.abs(alphaDot.y)).toBeGreaterThan(0.01);
  });

  it('computes corner speed, instantaneous vs sustained turn, and specific excess power Ps', () => {
    const mass = 13_500;
    const clMax = 1.62;
    const { easMps, tasMps } = computeCornerSpeed(mass, 30, clMax, 9.0, RHO0_EARTH);
    expect(easMps).toBeCloseTo(200.07, 1);
    expect(tasMps).toBeCloseTo(easMps, 4);

    // Below corner speed is CLmax limited; above corner speed is G limited; peak rate is at Vc
    const atLow = computeTurnPerformance(140, 0.5 * RHO0_EARTH * 140 ** 2, mass, G0_MPS2, 30, clMax, 9, 122_000, 0.019, 0.125);
    const atVc = computeTurnPerformance(easMps, 0.5 * RHO0_EARTH * easMps ** 2, mass, G0_MPS2, 30, clMax, 9, 122_000, 0.019, 0.125);
    const atHi = computeTurnPerformance(320, 0.5 * RHO0_EARTH * 320 ** 2, mass, G0_MPS2, 30, clMax, 9, 122_000, 0.032, 0.145);

    expect(atLow.nInst).toBeLessThan(9);
    expect(atVc.nInst).toBeCloseTo(9, 1);
    expect(atVc.instTurnRateRadS).toBeGreaterThan(atLow.instTurnRateRadS);
    expect(atVc.instTurnRateRadS).toBeGreaterThan(atHi.instTurnRateRadS);
    expect(atVc.sustTurnRateRadS).toBeLessThanOrEqual(atVc.instTurnRateRadS);

    expect(specificExcessPowerMps(120_000, 40_000, mass, 250, G0_MPS2)).toBeGreaterThan(140);
    expect(specificExcessPowerMps(40_000, 90_000, mass, 350, G0_MPS2)).toBeLessThan(-100);
  });

  it('integrates directly with AirframeSpec (gripen, su30, kestrel) and PlanetaryPhysics atmospheres', () => {
    const earth11km = sampleAtmosphere('Earth', 11);
    const marsSL = sampleAtmosphere('Mars', 0);

    const flow = computeFlowAngles(new THREE.Vector3(0, -30, -260));
    const airEarth = computeAirData(flow.speedMps, earth11km);
    const airMars = computeAirData(flow.speedMps, marsSL);
    expect(airEarth.tasMps).toBeGreaterThan(airEarth.iasMps);
    expect(airMars.qPa).toBeLessThan(airEarth.qPa * 0.15);

    const gRes = computeAeroForcesAndMoments(
      { flow, air: airEarth, rhoKgM3: earth11km.densityKgM3, altAboveGroundM: 11_000, ratesB3: new THREE.Vector3(), surfaces: CLEAN_SURF },
      AIRFRAME_SPECS.gripen
    );
    const sRes = computeAeroForcesAndMoments(
      { flow, air: airEarth, rhoKgM3: earth11km.densityKgM3, altAboveGroundM: 11_000, ratesB3: new THREE.Vector3(), surfaces: CLEAN_SURF },
      AIRFRAME_SPECS.su30
    );
    const kRes = computeAeroForcesAndMoments(
      { flow, air: airEarth, rhoKgM3: earth11km.densityKgM3, altAboveGroundM: 11_000, ratesB3: new THREE.Vector3(), surfaces: CLEAN_SURF },
      AIRFRAME_SPECS.kestrel
    );

    expect(gRes.coeffs.clMaxEffective).toBeCloseTo(AIRFRAME_SPECS.gripen.aero.clMaxClean, 1);
    expect(sRes.liftN).toBeGreaterThan(gRes.liftN); // Su-30 has 62 m^2 vs Gripen 30 m^2
    expect(kRes.liftN).toBeGreaterThan(gRes.liftN); // Kestrel 38 m^2 > Gripen 30 m^2
    expect(combatMassKg(AIRFRAME_SPECS.su30)).toBeGreaterThan(combatMassKg(AIRFRAME_SPECS.gripen));

    // Control surface moment sign verification in B3 (+elev = nose up +Mx, +ail = roll right -Mz, +rud = yaw right -My)
    const zeroRates = new THREE.Vector3();
    const mZero = computeAeroForcesAndMoments(
      { flow, air: airEarth, rhoKgM3: earth11km.densityKgM3, altAboveGroundM: 11_000, ratesB3: zeroRates, surfaces: CLEAN_SURF },
      AIRFRAME_SPECS.kestrel
    ).momentB3.clone();
    const mPull = computeAeroForcesAndMoments(
      { flow, air: airEarth, rhoKgM3: earth11km.densityKgM3, altAboveGroundM: 11_000, ratesB3: zeroRates, surfaces: { ...CLEAN_SURF, elev: 1 } },
      AIRFRAME_SPECS.kestrel
    ).momentB3;
    const mRollR = computeAeroForcesAndMoments(
      { flow, air: airEarth, rhoKgM3: earth11km.densityKgM3, altAboveGroundM: 11_000, ratesB3: zeroRates, surfaces: { ...CLEAN_SURF, ail: 1 } },
      AIRFRAME_SPECS.kestrel
    ).momentB3;
    const mYawR = computeAeroForcesAndMoments(
      { flow, air: airEarth, rhoKgM3: earth11km.densityKgM3, altAboveGroundM: 11_000, ratesB3: zeroRates, surfaces: { ...CLEAN_SURF, rud: 1 } },
      AIRFRAME_SPECS.kestrel
    ).momentB3;
    expect(mPull.x).toBeGreaterThan(mZero.x);
    expect(mRollR.z).toBeLessThan(mZero.z);
    expect(mYawR.y).toBeLessThan(mZero.y);
  });

  it('runs FlightModel 6-DOF physics with real airframes, planetary gravity/upWorld, fuel burn, and ground rollout', () => {
    // 1. Airframe differentiation & fuel burn
    const gripen = new FlightModel('gripen');
    const su30 = new FlightModel('su30');
    expect(su30.massKg).toBeGreaterThan(gripen.massKg * 2);

    const kpu = 0.01;
    const upm = unitsPerMps(kpu);
    gripen.velocity.set(0, 0, -250 * upm);
    su30.velocity.set(0, 0, -250 * upm);
    const initialFuel = su30.fuelKg;
    const earthEnv = {
      altitudeUnits: 1 / kpu,
      kmPerUnit: kpu,
      airDensity: 0.9,
      bodyName: 'Earth',
      altKm: 1.0,
      upWorld: new THREE.Vector3(0, 1, 0),
    };

    for (let i = 0; i < 120; i++) {
      su30.step(1 / 60, { pitch: 0.4, roll: 0, yaw: 0, throttle: 1, boost: true, assist: true }, earthEnv);
    }
    expect(su30.fuelKg).toBeLessThan(initialFuel);
    expect(su30.abStage).toBe(3);
    expect(su30.mach).toBeGreaterThan(0.5);
    expect(su30.gLoad).toBeGreaterThan(1.5);
    expect(su30.cornerSpeedMps).toBeGreaterThan(120);
    expect(su30.stallSpeedMps).toBeGreaterThan(40);
    expect(su30.surfaces.nozzleIris).toBeGreaterThan(0.7);

    // 2. High-G vs NORM FBW & exosphere transition safety + vacuum aerodynamic surface zeroing
    const exosphere = new FlightModel('su30');
    exosphere.velocity.set(0, 0, -180 * upm);
    // Deploy combat flaps + pitch/yaw/TVC in low air first
    for (let i = 0; i < 20; i++) {
      exosphere.step(1 / 60, { pitch: 0.7, roll: 0, yaw: 0.4, throttle: 0.8, boost: false, assist: true, flapMode: 'combat', psm: true }, {
        altitudeUnits: 2,
        kmPerUnit: kpu,
        airDensity: 0.9,
        bodyName: 'Earth',
        altKm: 1,
      });
    }
    expect(exosphere.fbwState.surfaces.teFlap).toBeGreaterThan(0.1);
    for (const rho of [0.05, 0.02, 0.01, 0.001, 0]) {
      exosphere.step(1 / 60, { pitch: 0.5, roll: 0, yaw: 0.3, throttle: 0.8, boost: false, assist: true, highG: true, flapMode: 'combat' }, {
        altitudeUnits: 200,
        kmPerUnit: kpu,
        airDensity: rho,
        bodyName: 'Earth',
        altKm: rho === 0 ? 450 : 50,
      });
      expect(Number.isFinite(exosphere.speed)).toBe(true);
      expect(Number.isFinite(exosphere.gLoad)).toBe(true);
    }
    expect(exosphere.fbwState.surfaces.teFlap).toBe(0);
    expect(exosphere.fbwState.surfaces.leFlap).toBe(0);
    expect(exosphere.fbwState.surfaces.canard).toBe(0);
    expect(exosphere.fbwState.surfaces.tvcPitch).toBe(0);
    expect(exosphere.fbwState.surfaces.tvcYaw).toBe(0);
    expect(exosphere.surfaces.flapLeftRad).toBe(0);
    expect(exosphere.surfaces.flapRightRad).toBe(0);
    expect(exosphere.surfaces.slat).toBe(0);
    expect(exosphere.surfaces.canardRad).toBe(0);
    expect(exosphere.surfaces.tvcPitchLeftRad).toBe(0);
    expect(exosphere.surfaces.tvcYawLeftRad).toBe(0);

    // 3. Runway ground rollout: Gripen snowplow canards & Su-30 drag chute + ABS wheel brakes
    const grLand = new FlightModel('gripen');
    const suLand = new FlightModel('su30');
    grLand.velocity.set(0, 0, -70 * upm);
    suLand.velocity.set(0, 0, -70 * upm);
    const groundEnv = {
      altitudeUnits: 0,
      kmPerUnit: kpu,
      airDensity: 1.0,
      bodyName: 'Earth',
      altKm: 0,
      groundClearanceM: 0,
      onGround: true,
    };
    const landInp = { pitch: 0, roll: 0, yaw: 0, throttle: 0, boost: false, assist: true, gearDown: true, airbrake: true, wheelBrake: true };
    for (let i = 0; i < 60; i++) {
      grLand.step(1 / 60, landInp, groundEnv);
      suLand.step(1 / 60, landInp, groundEnv);
    }
    expect(grLand.velocity.length() / upm).toBeLessThan(65);
    expect(suLand.velocity.length() / upm).toBeLessThan(65);
    expect(grLand.fbwState.surfaces.canard).toBeLessThan(-0.5);
    expect(suLand.fbwState.surfaces.dragChute).toBeGreaterThan(0.5);
  });
});
