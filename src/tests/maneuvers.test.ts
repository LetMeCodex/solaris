import { describe, it, expect } from 'vitest';
import {
  G0_MPS2,
  clamp,
  getFbwAirframeParams,
  createFbwState,
  computeFlapSchedule,
  computeAfterburnerStage,
  stepCobraAndPsmAssist,
  allocateControlMoments,
  stepFbwAndControls,
  toJetSurfaceState,
  detectManeuver,
  toTelemetryManeuver,
  stepGroundContact,
  type FbwStepInput,
} from '../flight/ManeuversAndFBW';

function baseFbwInput(overrides: Partial<FbwStepInput> = {}): FbwStepInput {
  return {
    airframe: getFbwAirframeParams('kestrel'),
    pitch: 0,
    roll: 0,
    yaw: 0,
    speedMps: 250,
    qPa: 0.5 * 1.0 * 250 * 250,
    airDensity: 1.0,
    mach: 250 / 340,
    alphaDeg: 4,
    betaDeg: 0,
    gammaDeg: 0,
    pitchAngleRad: 0,
    rollAngleRad: 0,
    currentRatesB3: [0, 0, 0],
    gravityBodyUp: 1,
    gravityAccelMps2: 0,
    gearDown: false,
    onGround: false,
    assist: true,
    paddleHeld: false,
    psmHeld: false,
    airbrakeHeld: false,
    cobraTriggered: false,
    thrustN: 82000,
    dt: 1 / 60,
    ...overrides,
  };
}

describe('airframe FBW differentiation', () => {
  it('assigns distinct canard, TVC, cant angle, and chute traits across Gripen, Su-30, and Kestrel', () => {
    const gripen = getFbwAirframeParams('gripen');
    const su30 = getFbwAirframeParams('su30');
    const kestrel = getFbwAirframeParams('kestrel');

    expect(gripen.hasCanards).toBe(true);
    expect(gripen.hasTvc).toBe(false);
    expect(gripen.hasDragChute).toBe(false);

    expect(su30.hasCanards).toBe(false);
    expect(su30.hasTvc).toBe(true);
    expect(su30.tvcCantDeg).toBe(32);
    expect(su30.tvcSlewDegPerSec).toBe(30);
    expect(su30.hasDragChute).toBe(true);

    expect(kestrel.hasTvc).toBe(true);
    expect(kestrel.tvcCantDeg).toBe(0);
    expect(kestrel.inertia[1]).toBeGreaterThan(gripen.inertia[1]);
    expect(su30.inertia[1]).toBeGreaterThan(kestrel.inertia[1]);
  });
});

describe('Normal, High-G Paddle, and PSM FBW control laws', () => {
  it('respects 9G structural cap and 14 G/s onset rate limit in Normal FBW', () => {
    const state = createFbwState();
    const dt = 1 / 60;
    let out = stepFbwAndControls(state, baseFbwInput({ pitch: 1, speedMps: 250, dt }));

    // First 0.1 s (6 ticks) at <= 14 G/s onset -> <= ~1.47 G equivalent pitch rate
    for (let i = 0; i < 5; i++) {
      out = stepFbwAndControls(state, baseFbwInput({ pitch: 1, speedMps: 250, dt }));
    }
    const gAfter01s = (out.targetRatesB3[0] * 250) / G0_MPS2;
    expect(gAfter01s).toBeLessThanOrEqual(14 * 0.1 * 1.05);

    // Steady pull at 300 m/s never exceeds 9.0 G
    for (let i = 0; i < 60; i++) {
      out = stepFbwAndControls(state, baseFbwInput({ pitch: 1, speedMps: 300, dt }));
    }
    expect(out.targetRatesB3[0] * 300).toBeLessThanOrEqual(9.0 * G0_MPS2 * 1.01);
  });

  it('derates structural G when gear is down and enforces deep-stall recovery in NORM', () => {
    const state = createFbwState();
    const dt = 1 / 60;
    let out = stepFbwAndControls(state, baseFbwInput({ pitch: 1, gearDown: true, speedMps: 180, dt }));
    for (let i = 0; i < 40; i++) {
      out = stepFbwAndControls(state, baseFbwInput({ pitch: 1, gearDown: true, speedMps: 180, dt }));
    }
    expect(out.gLimitActivePos).toBeLessThanOrEqual(4.5);
    expect(out.targetRatesB3[0] * 180).toBeLessThanOrEqual(4.5 * G0_MPS2 * 1.01);

    // Deep stall past ~35 deg AoA commands nose-down recovery in NORM law
    const stallState = createFbwState();
    const stallOut = stepFbwAndControls(
      stallState,
      baseFbwInput({
        airframe: getFbwAirframeParams('gripen'),
        pitch: 1,
        alphaDeg: 40,
        speedMps: 150,
      }),
    );
    expect(stallOut.targetRatesB3[0]).toBeLessThan(0);
    expect(stallOut.surfaces.canard).toBeLessThan(0);
  });

  it('provides 1G auto-trim and FPV hold under gravity without unintended climb in zero-g', () => {
    const state = createFbwState();
    const zeroG = stepFbwAndControls(state, baseFbwInput({ gravityAccelMps2: 0 }));
    expect(zeroG.targetRatesB3[0]).toBeCloseTo(0, 6);

    const earthState = createFbwState();
    for (let i = 0; i < 30; i++) {
      stepFbwAndControls(
        earthState,
        baseFbwInput({ gravityAccelMps2: G0_MPS2, speedMps: 250 }),
      );
    }
    const trimOut = stepFbwAndControls(
      earthState,
      baseFbwInput({ gravityAccelMps2: G0_MPS2, speedMps: 250 }),
    );
    expect((trimOut.targetRatesB3[0] * 250) / G0_MPS2).toBeCloseTo(1.0, 1);

    // FPV hold commands climb correction when gamma drops below locked target
    earthState.fpvHoldActive = true;
    earthState.fpvTargetGammaDeg = 5;
    let fpvOut = trimOut;
    for (let i = 0; i < 30; i++) {
      fpvOut = stepFbwAndControls(
        earthState,
        baseFbwInput({ gravityAccelMps2: G0_MPS2, speedMps: 250, gammaDeg: 0 }),
      );
    }
    expect(fpvOut.targetRatesB3[0]).toBeGreaterThan(0.05);
  });

  it('activates Aileron-Rudder Interconnect (ARI) and sideslip damper', () => {
    const state = createFbwState();
    // Positive roll right at positive AoA invokes proverse right yaw (-ry in B3)
    let ariOut = stepFbwAndControls(state, baseFbwInput({ roll: 1, alphaDeg: 18, betaDeg: 0 }));
    for (let i = 0; i < 6; i++) {
      ariOut = stepFbwAndControls(state, baseFbwInput({ roll: 1, alphaDeg: 18, betaDeg: 0 }));
    }
    expect(ariOut.targetRatesB3[1]).toBeLessThan(-0.05);

    // Uncommanded nose-left sideslip (+betaDeg -> wind from right +X) pulls nose into wind (+yaw right -> -ry)
    const dampState = createFbwState();
    let dampOut = stepFbwAndControls(dampState, baseFbwInput({ roll: 0, yaw: 0, betaDeg: 12 }));
    for (let i = 0; i < 6; i++) {
      dampOut = stepFbwAndControls(dampState, baseFbwInput({ roll: 0, yaw: 0, betaDeg: 12 }));
    }
    expect(dampOut.targetRatesB3[1]).toBeLessThan(-0.05);
  });

  it('unlocks High-G Drift turn bite under paddle switch + airbrake', () => {
    const state = createFbwState();
    const normOut = stepFbwAndControls(state, baseFbwInput({ pitch: 1, speedMps: 220 }));
    const paddleState = createFbwState();
    let paddleOut = normOut;
    for (let i = 0; i < 60; i++) {
      paddleOut = stepFbwAndControls(
        paddleState,
        baseFbwInput({ pitch: 1, speedMps: 220, paddleHeld: true, airbrakeHeld: true }),
      );
    }
    expect(paddleOut.effectiveMode).toBe('high-g');
    expect(paddleOut.gLimitActivePos).toBe(11.5);
    expect(paddleOut.highGDriftActive).toBe(true);
    expect(paddleOut.targetRatesB3[0]).toBeGreaterThan(normOut.targetRatesB3[0] * 2);
  });
});

describe('3D thrust-vectoring allocation and surface geometry', () => {
  it('models Su-30 32-deg canted yaw-roll coupling, 30 deg/s slew limit, and zero TVC on Gripen', () => {
    const su30 = getFbwAirframeParams('su30');
    const gripen = getFbwAirframeParams('gripen');
    const suState = createFbwState();
    const grState = createFbwState();

    // Verify 30 deg/s hydraulic rate limit: over 0.1s at 15 deg max -> 3 deg / 15 deg = 0.2 normalized
    const step1 = allocateControlMoments(suState, {
      airframe: su30,
      surfacesCmd: { pitch: 1, roll: 0, yaw: 1 },
      qPa: 2500,
      alphaDeg: 70,
      thrustN: 245160,
      airDensity: 0.9,
      psmActive: true,
      dt: 0.1,
    });
    expect(step1.tvcPitch).toBeCloseTo(0.2, 5);
    expect(step1.tvcYaw).toBeCloseTo(0.2, 5);
    expect(step1.aeroEffectiveness).toBeLessThan(0.35);

    // Advance to steady full deflection (0.5s total)
    let full = step1;
    for (let i = 0; i < 5; i++) {
      full = allocateControlMoments(suState, {
        airframe: su30,
        surfacesCmd: { pitch: 1, roll: 0, yaw: 1 },
        qPa: 2500,
        alphaDeg: 70,
        thrustN: 245160,
        airDensity: 0.9,
        psmActive: true,
        dt: 0.1,
      });
    }
    expect(full.tvcPitch).toBeCloseTo(1.0, 5);
    expect(full.tvcTorqueB3[0]).toBeGreaterThan(300000);
    // 32-deg cant produces both yaw and differential roll moments
    expect(Math.abs(full.tvcTorqueB3[1])).toBeGreaterThan(150000);
    expect(Math.abs(full.tvcTorqueB3[2])).toBeGreaterThan(20000);
    expect(full.axialThrustScale).toBeLessThan(1);

    // Gripen outputs zero TVC torque but maintains stronger canard recovery effectiveness post-stall
    const grAlloc = allocateControlMoments(grState, {
      airframe: gripen,
      surfacesCmd: { pitch: -1, roll: 0, yaw: 0 },
      qPa: 2500,
      alphaDeg: 40,
      thrustN: 80500,
      airDensity: 0.9,
      psmActive: false,
      dt: 0.1,
    });
    expect(grAlloc.tvcTorqueB3).toEqual([0, 0, 0]);
    expect(grAlloc.canardEffectiveness).toBeGreaterThan(grAlloc.aeroEffectiveness);

    // Verify asymmetric Su-30 TVC pitch sign: +tvcYaw => right roll => left nozzle down (-), right nozzle up (+)
    const surf = toJetSurfaceState(
      { ...suState.surfaces, pitch: 0.5, roll: 0.3, yaw: 0.8 },
      { gear: 0, tvcMaxDeg: su30.tvcMaxDeg, tvcCantDeg: su30.tvcCantDeg },
    );
    expect(surf.tvcPitchLeftRad).toBeLessThan(surf.tvcPitchRightRad);
    expect(surf.elevonLeftRad).toBeGreaterThan(surf.elevonRightRad); // right roll -> left TE down (+), right TE up (-)
  });

  it('blends exo-atmospheric RCS authority in near-vacuum', () => {
    const state = createFbwState();
    const vac = allocateControlMoments(state, {
      airframe: getFbwAirframeParams('kestrel'),
      surfacesCmd: { pitch: 0.5, roll: 0, yaw: 0 },
      qPa: 0,
      alphaDeg: 0,
      thrustN: 0,
      airDensity: 0,
      psmActive: false,
      dt: 1 / 60,
    });
    expect(vac.rcsAuthority).toBe(1);

    const sea = allocateControlMoments(state, {
      airframe: getFbwAirframeParams('kestrel'),
      surfacesCmd: { pitch: 0.5, roll: 0, yaw: 0 },
      qPa: 30000,
      alphaDeg: 4,
      thrustN: 80000,
      airDensity: 1.0,
      psmActive: false,
      dt: 1 / 60,
    });
    expect(sea.rcsAuthority).toBe(0);
  });
});

describe('closed-loop Pugachev Cobra, early abort, and Kulbit', () => {
  it('flies a complete Cobra: pitches past 60 deg near mid-maneuver, bleeds below 170 m/s, and recovers level', () => {
    const state = createFbwState();
    const dt = 1 / 60;
    let pitchRad = 0;
    let pitchRate = 0;
    let speedMps = 200;
    let maxPitchDeg = 0;
    let midPitchDeg = 0;
    let cobraT = 0;

    for (let step = 0; step < 160; step++) {
      const t = step * dt;
      const out = stepCobraAndPsmAssist(state.cobra, {
        cobraTriggered: step === 0,
        psmHold: false,
        pitchInput: 0,
        speedMps,
        alphaDeg: pitchRad * (180 / Math.PI),
        pitchAngleRad: pitchRad,
        currentPitchRate: pitchRate,
        airDensity: 0.8,
        hasTvc: true,
        dt,
      });
      cobraT = out.cobraT;
      if (out.active) {
        pitchRate += (out.pitchRateTargetRad - pitchRate) * (1 - Math.exp(-12 * dt));
        pitchRad += pitchRate * dt;
        // Post-stall flat-plate drag bleed against ~0.45 mil thrust recovery
        speedMps = Math.max(70, speedMps - (out.extraDragFactor * 95 - 10) * dt);
      }
      const deg = pitchRad * (180 / Math.PI);
      maxPitchDeg = Math.max(maxPitchDeg, deg);
      if (Math.abs(t - 1.2) < dt * 0.6) midPitchDeg = deg;
      if (t > 2.45 && !out.active) break;
    }

    expect(maxPitchDeg).toBeGreaterThan(75);
    expect(midPitchDeg).toBeGreaterThan(60);
    expect(cobraT).toBe(-1);
    expect(Math.abs(pitchRad)).toBeLessThan(0.2);
    expect(speedMps).toBeLessThan(170);
  });

  it('aborts Cobra smoothly into recovery on decisive nose-down input, and upgrades to 360 Kulbit with TVC + PSM', () => {
    const abortState = createFbwState();
    const dt = 1 / 60;
    stepCobraAndPsmAssist(abortState.cobra, {
      cobraTriggered: true,
      psmHold: false,
      pitchInput: 0,
      speedMps: 200,
      alphaDeg: 5,
      pitchAngleRad: 0.1,
      currentPitchRate: 0,
      airDensity: 0.8,
      hasTvc: true,
      dt,
    });
    expect(abortState.cobra.phase).toBe('PITCH_UP');
    const aborted = stepCobraAndPsmAssist(abortState.cobra, {
      cobraTriggered: false,
      psmHold: false,
      pitchInput: -0.9,
      speedMps: 185,
      alphaDeg: 35,
      pitchAngleRad: 0.6,
      currentPitchRate: 1.5,
      airDensity: 0.8,
      hasTvc: true,
      dt,
    });
    expect(abortState.cobra.phase).toBe('RECOVER');
    expect(aborted.pitchRateTargetRad).toBeLessThan(0);

    // Kulbit continuation when holding PSM + full back stick on Su-30
    const kulbitState = createFbwState();
    let pitchRad = 0;
    let pitchRate = 0;
    let triggeredKulbit = false;
    for (let i = 0; i < 190; i++) {
      const kOut = stepCobraAndPsmAssist(kulbitState.cobra, {
        cobraTriggered: i === 0,
        psmHold: true,
        pitchInput: 1.0,
        speedMps: 150,
        alphaDeg: clamp((pitchRad * 180) / Math.PI, 0, 120),
        pitchAngleRad: pitchRad,
        currentPitchRate: pitchRate,
        airDensity: 0.85,
        hasTvc: true,
        dt,
      });
      if (kulbitState.cobra.kulbitActive) triggeredKulbit = true;
      pitchRate += (kOut.pitchRateTargetRad - pitchRate) * 0.25;
      pitchRad += pitchRate * dt;
    }
    expect(triggeredKulbit).toBe(true);
    expect(pitchRad).toBeGreaterThan(Math.PI * 1.4);
  });
});

describe('maneuver telemetry classification', () => {
  it('classifies Cobra, Kulbit, Herbst, Falling Leaf, Hammerhead, Tailslide, Snap Roll, Barrel Roll, High-G Drift, Flat Spin, Flare, and Supercruise', () => {
    const dt = 1 / 60;
    const check = (
      patch: Partial<Parameters<typeof detectManeuver>[1]>,
      expected: string,
      telExpected: string,
    ) => {
      const s = createFbwState();
      const got = detectManeuver(s, {
        alphaDeg: 5,
        betaDeg: 0,
        pitchDeg: 5,
        speedMps: 220,
        forwardSpeedMps: 220,
        mach: 0.65,
        gLoad: 1,
        abStage: 0,
        airbrake: 0,
        onGround: false,
        ratesB3: [0, 0, 0],
        fbwMode: 'norm',
        cobraPhase: 'IDLE',
        kulbitSweepRad: 0,
        dt,
        ...patch,
      });
      expect(got).toBe(expected);
      expect(toTelemetryManeuver(got)).toBe(telExpected);
    };

    check({ cobraPhase: 'PITCH_UP', alphaDeg: 75, pitchDeg: 72 }, 'cobra', 'cobra');
    check({ kulbitSweepRad: 3.1, alphaDeg: 110, ratesB3: [1.8, 0, 0], speedMps: 120 }, 'kulbit', 'kulbit');
    check({ alphaDeg: 55, speedMps: 130, ratesB3: [0.3, -1.1, 0.8], fbwMode: 'psm' }, 'herbst', 'herbst');
    check({ alphaDeg: 45, speedMps: 90, betaDeg: 22, ratesB3: [0, 0.5, 0.6] }, 'falling-leaf', 'spin');
    check({ alphaDeg: 62, speedMps: 80, ratesB3: [0.1, 1.5, 0.4] }, 'flat-spin', 'spin');
    check({ pitchDeg: 80, speedMps: 45, ratesB3: [0, 0.8, 0] }, 'hammerhead', 'none');
    check({ pitchDeg: 78, forwardSpeedMps: -12, speedMps: 15 }, 'tailslide', 'none');
    check({ alphaDeg: 24, betaDeg: 7, ratesB3: [0.6, 0.2, 4.2] }, 'snap-roll', 'none');
    check({ alphaDeg: 10, gLoad: 3.2, ratesB3: [0.2, 0, 2.8] }, 'barrel-roll', 'none');
    check({ alphaDeg: 18, gLoad: 8.4 }, 'high-g-drift', 'high-g-drift');
    check({ gearDown: true, altitudeAglM: 12, speedMps: 76, alphaDeg: 13 }, 'flare', 'flare');
    check({ mach: 1.45, abStage: 0, alphaDeg: 3 }, 'supercruise', 'none');
  });
});

describe('flap scheduling and afterburner staging', () => {
  it('schedules landing/combat flaps subsonically and blows back above Mach 0.96', () => {
    const land = computeFlapSchedule({ flapMode: 'land', gearDown: true, mach: 0.22, alphaDeg: 11, iasMps: 75 });
    expect(land.teFlap).toBeGreaterThan(0.85);
    expect(land.leFlap).toBeGreaterThan(0.8);
    expect(land.clDelta).toBeGreaterThan(0.4);

    const combat = computeFlapSchedule({ flapMode: 'combat', gearDown: false, mach: 0.65, alphaDeg: 14, iasMps: 210 });
    expect(combat.teFlap).toBeGreaterThan(0.25);
    expect(combat.leFlap).toBeGreaterThan(0.5);

    const supersonic = computeFlapSchedule({ flapMode: 'combat', gearDown: false, mach: 1.35, alphaDeg: 4, iasMps: 380 });
    expect(supersonic.teFlap).toBe(0);
    expect(supersonic.leFlap).toBe(0);
  });

  it('keeps throttle=1, boost=false strictly in Dry Military Power (abStage=0) and steps AB stages 1..3 on boost', () => {
    const gripen = getFbwAirframeParams('gripen');
    let spool = 0.75;
    for (let i = 0; i < 60; i++) {
      const res = computeAfterburnerStage({
        throttle: 1,
        boost: false,
        airDensity: 0.9,
        fuelFrac: 0.8,
        spoolState: spool,
        dt: 0.1,
        airframe: gripen,
      });
      spool = res.spoolState;
      expect(res.abStage).toBe(0);
    }
    const milSteady = computeAfterburnerStage({
      throttle: 1,
      boost: false,
      airDensity: 0.9,
      fuelFrac: 0.8,
      spoolState: spool,
      dt: 0.1,
      airframe: gripen,
    });
    expect(milSteady.thrustFraction).toBeCloseTo(1.0, 3);
    expect(milSteady.thrustN).toBeCloseTo(gripen.dryThrustN, 0);
    expect(milSteady.nozzleIris).toBeLessThan(0.15); // tightly pinched mil throat
    expect(milSteady.supercruiseCandidate).toBe(true);

    // Stage 3 full afterburner
    let abSpool = spool;
    for (let i = 0; i < 40; i++) {
      abSpool = computeAfterburnerStage({
        throttle: 1,
        boost: true,
        airDensity: 0.9,
        fuelFrac: 0.8,
        spoolState: abSpool,
        dt: 0.1,
        airframe: gripen,
      }).spoolState;
    }
    const maxAb = computeAfterburnerStage({
      throttle: 1,
      boost: true,
      airDensity: 0.9,
      fuelFrac: 0.8,
      spoolState: abSpool,
      dt: 0.1,
      airframe: gripen,
    });
    expect(maxAb.abStage).toBe(3);
    expect(maxAb.thrustN).toBeCloseTo(gripen.wetThrustN, 0);
    expect(maxAb.fuelBurnMultiplier).toBeGreaterThan(3.5);
    expect(maxAb.nozzleIris).toBeCloseTo(1.0, 2);

    // Mid-throttle boost (throttle=0.5, boost=true) engages AB Stage 2 with actual wet thrust (> dry mil)
    let midSpool = 0.4;
    let midAb = maxAb;
    for (let i = 0; i < 40; i++) {
      midAb = computeAfterburnerStage({
        throttle: 0.5,
        boost: true,
        airDensity: 0.9,
        fuelFrac: 0.8,
        spoolState: midSpool,
        dt: 0.1,
        airframe: gripen,
      });
      midSpool = midAb.spoolState;
    }
    expect(midAb.abStage).toBe(2);
    expect(midAb.thrustFraction).toBeGreaterThan(1.1);
    expect(midAb.fuelBurnMultiplier).toBeGreaterThan(2.5);

    // Fuel starvation cuts thrust immediately
    const dryOut = computeAfterburnerStage({
      throttle: 1,
      boost: true,
      airDensity: 0.9,
      fuelFrac: 0,
      spoolState: abSpool,
      dt: 0.1,
      airframe: gripen,
    });
    expect(dryOut.thrustN).toBe(0);
    expect(dryOut.abStage).toBe(0);
  });
});

describe('hypersonic & scramjet critical damping (zero overshoot)', () => {
  it('damps cleanly without oscillating at Mach 6 and Mach 25 when releasing controls', () => {
    for (const [speedMps, scale] of [[2000, 12], [8500, 60]] as const) {
      const state = createFbwState();
      const dt = 1 / 60;
      for (let i = 0; i < 90; i++) {
        stepFbwAndControls(state, baseFbwInput({ pitch: 1, roll: 0.6, speedMps, airDensity: 0.25, airAccelScale: scale, dt }));
      }
      let minPitch = 0;
      let lastRates: [number, number, number] = [0, 0, 0];
      for (let i = 0; i < 120; i++) {
        const out = stepFbwAndControls(state, baseFbwInput({ pitch: 0, roll: 0, speedMps, airDensity: 0.25, airAccelScale: scale, dt }));
        lastRates = out.targetRatesB3;
        minPitch = Math.min(minPitch, lastRates[0]);
      }
      expect(Math.abs(lastRates[0])).toBeLessThan(0.01);
      expect(Math.abs(lastRates[2])).toBeLessThan(0.01);
      expect(minPitch).toBeGreaterThan(-0.001);
    }
  });
});

describe('ground contact, oleo struts, snowplow, and drag chute', () => {
  it('absorbs greased landings, deploys Gripen snowplow canards and Su-30 drag chute cleanly', () => {
    const gripen = getFbwAirframeParams('gripen');
    const su30 = getFbwAirframeParams('su30');
    const grState = createFbwState();

    const soft = stepGroundContact(grState, {
      airframe: gripen,
      onGround: true,
      gearDown: true,
      sinkRateMps: 2.2,
      groundSpeedMps: 65,
      brakesHeld: true,
      airbrakeHeld: false,
      yawInput: 0.4,
      throttle: 0,
      massKg: 8500,
      gravityMps2: G0_MPS2,
      dt: 1 / 60,
    });
    expect(soft.touchdownImpulse).toBe(0);
    expect(soft.canardSnowplow).toBeLessThan(-0.5);
    expect(soft.decelMps2).toBeGreaterThan(5);
    expect(soft.yawRateB3Rad).toBeLessThan(0);

    const hard = stepGroundContact(grState, {
      airframe: gripen,
      onGround: true,
      gearDown: true,
      sinkRateMps: 7.0,
      groundSpeedMps: 65,
      brakesHeld: true,
      airbrakeHeld: false,
      yawInput: 0,
      throttle: 0,
      massKg: 8500,
      gravityMps2: G0_MPS2,
      dt: 1 / 60,
    });
    expect(hard.touchdownImpulse).toBeGreaterThan(2.0);

    // Su-30 chute deploys >32 m/s on brakes and cuts below 14 m/s or on touch-and-go throttle
    const suState = createFbwState();
    for (let i = 0; i < 40; i++) {
      stepGroundContact(suState, {
        airframe: su30,
        onGround: true,
        gearDown: true,
        sinkRateMps: 1.5,
        groundSpeedMps: 70,
        brakesHeld: true,
        airbrakeHeld: true,
        yawInput: 0,
        throttle: 0.1,
        massKg: 24000,
        gravityMps2: G0_MPS2,
        dt: 0.05,
      });
    }
    expect(suState.dragChuteDeployed).toBe(true);
    expect(suState.surfaces.dragChute).toBeGreaterThan(0.8);

    // Touch-and-go cuts chute cleanly
    stepGroundContact(suState, {
      airframe: su30,
      onGround: true,
      gearDown: true,
      sinkRateMps: 0,
      groundSpeedMps: 50,
      brakesHeld: false,
      airbrakeHeld: false,
      yawInput: 0,
      throttle: 0.9,
      massKg: 24000,
      gravityMps2: G0_MPS2,
      dt: 0.05,
    });
    expect(suState.dragChuteDeployed).toBe(false);
  });
});
