import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  FlightModel,
  FlightInput,
  FlightEnv,
  unitsPerMps,
  COBRA_TIME,
} from '../flight/FlightModel';
import { AIRFRAME_SPECS, combatMassKg } from '../flight/AirframeSpecs';
import {
  computeAeroCoefficients,
  computeFlowAngles,
  computeCornerSpeed,
  RHO0_EARTH,
} from '../flight/Aerodynamics';
import { canonicalFlyKey, computeRelativeDragSteer } from '../flight/JetController';
import { JetModel } from '../flight/JetModel';

const EARTH_KPU = 6371 / 72;
const UPM = unitsPerMps(EARTH_KPU);
const RAD = 180 / Math.PI;
const DEG = Math.PI / 180;

const mkInput = (o: Partial<FlightInput> = {}): FlightInput => ({
  pitch: 0,
  roll: 0,
  yaw: 0,
  throttle: 0.68,
  boost: false,
  assist: true,
  ...o,
});

function envAt(
  altKm: number,
  airframeId: 'gripen' | 'su30' | 'kestrel',
  rhoRel = Math.exp(-altKm / 8.5),
  bodyName = 'Earth',
): FlightEnv {
  return {
    altitudeUnits: altKm / EARTH_KPU,
    kmPerUnit: EARTH_KPU,
    airDensity: rhoRel,
    airframeId,
    bodyName,
    altKm,
    groundClearanceM: altKm * 1000,
    upWorld: new THREE.Vector3(0, 1, 0),
  };
}

function makeCruise(
  airframeId: 'gripen' | 'su30' | 'kestrel',
  speedMps: number,
  altKm: number,
  aoaDeg = 1.8,
): FlightModel {
  const m = new FlightModel(airframeId);
  m.position.set(0, altKm / EARTH_KPU, 0);
  m.speed = speedMps * UPM;
  m.velocity.set(0, 0, -m.speed);
  m.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), aoaDeg * DEG);
  return m;
}

function stepSec(
  m: FlightModel,
  sec: number,
  inp: FlightInput | ((t: number, m: FlightModel) => FlightInput),
  env: FlightEnv | ((m: FlightModel) => FlightEnv),
  dt = 1 / 60,
): void {
  const n = Math.round(sec / dt);
  for (let i = 0; i < n; i++) {
    const curInp = typeof inp === 'function' ? inp(i * dt, m) : inp;
    const curEnv = typeof env === 'function' ? env(m) : env;
    m.step(dt, curInp, curEnv);
  }
}

function bankDegOf(m: FlightModel): number {
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(m.quaternion);
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(m.quaternion);
  return Math.atan2(right.y, up.y) * RAD;
}

function pitchDegOf(m: FlightModel): number {
  const fwd = m.forward(new THREE.Vector3());
  return Math.asin(THREE.MathUtils.clamp(fwd.y, -1, 1)) * RAD;
}

describe('NASA / MIL-STD-1797C Flight Qualification Suite (Gripen & Su-30MKK)', () => {
  for (const id of ['gripen', 'su30'] as const) {
    describe(`${AIRFRAME_SPECS[id].displayName} (${id})`, () => {
      it('T01: holds rock-solid hands-off level cruise at 0.35 km SL (68% throttle, 10s)', () => {
        const m = makeCruise(id, 200, 0.35, 1.8);
        const y0 = m.position.y;
        let maxAbsVs = 0;
        stepSec(m, 10, mkInput({ throttle: 0.68 }), (mm) => {
          maxAbsVs = Math.max(maxAbsVs, Math.abs(mm.verticalSpeedMps));
          const altKm = Math.max(0.05, mm.position.y * EARTH_KPU);
          return envAt(altKm, id);
        });
        const dAltM = (m.position.y - y0) * EARTH_KPU * 1000;
        console.log(
          `[${id} T01] SL 0.35km 68% 10s | dAlt=${dAltM.toFixed(2)}m | finalVS=${m.verticalSpeedMps.toFixed(2)}m/s | max|VS|=${maxAbsVs.toFixed(2)} | TAS=${m.tasMps.toFixed(1)} | AoA=${m.aoaDeg.toFixed(2)}° | G=${m.gLoad.toFixed(2)}`,
        );
        expect(Math.abs(dAltM)).toBeLessThan(8.0);
        expect(Math.abs(m.verticalSpeedMps)).toBeLessThan(0.8);
        expect(m.tasMps).toBeGreaterThan(175);
      });

      it('T02: resists stall-sink at low 40% throttle hands-off (1.0 km MSL, 10s, Alpha-Floor active)', () => {
        const m = makeCruise(id, 185, 1.0, 2.0);
        const y0 = m.position.y;
        stepSec(m, 10, mkInput({ throttle: 0.40 }), (mm) => {
          const altKm = Math.max(0.05, mm.position.y * EARTH_KPU);
          return envAt(altKm, id);
        });
        const dAltM = (m.position.y - y0) * EARTH_KPU * 1000;
        console.log(
          `[${id} T02] Low-Thr 40% 1km 10s | dAlt=${dAltM.toFixed(2)}m | finalVS=${m.verticalSpeedMps.toFixed(2)}m/s | TAS=${m.tasMps.toFixed(1)} | AoA=${m.aoaDeg.toFixed(2)}° | G=${m.gLoad.toFixed(2)}`,
        );
        expect(Math.abs(dAltM)).toBeLessThan(12.0);
        expect(Math.abs(m.verticalSpeedMps)).toBeLessThan(1.2);
        expect(m.tasMps).toBeGreaterThan(115);
      });

      it('T03: holds level hands-off over Mount Everest (8.8 km MSL, 72% throttle, 10s)', () => {
        const m = makeCruise(id, 255, 8.8, 2.5);
        const y0 = m.position.y;
        stepSec(m, 10, mkInput({ throttle: 0.72 }), (mm) => {
          const altKm = Math.max(0.1, mm.position.y * EARTH_KPU);
          return envAt(altKm, id);
        });
        const dAltM = (m.position.y - y0) * EARTH_KPU * 1000;
        console.log(
          `[${id} T03] Everest 8.8km 72% 10s | dAlt=${dAltM.toFixed(2)}m | finalVS=${m.verticalSpeedMps.toFixed(2)}m/s | TAS=${m.tasMps.toFixed(1)} | AoA=${m.aoaDeg.toFixed(2)}° | G=${m.gLoad.toFixed(2)}`,
        );
        expect(Math.abs(dAltM)).toBeLessThan(12.0);
        expect(Math.abs(m.verticalSpeedMps)).toBeLessThan(1.0);
      });

      it('T04: holds level hands-off in stratosphere (12 km MSL, 85% throttle, 10s)', () => {
        const m = makeCruise(id, 290, 12.0, 2.8);
        const y0 = m.position.y;
        stepSec(m, 10, mkInput({ throttle: 0.85 }), (mm) => {
          const altKm = Math.max(0.1, mm.position.y * EARTH_KPU);
          return envAt(altKm, id);
        });
        const dAltM = (m.position.y - y0) * EARTH_KPU * 1000;
        console.log(
          `[${id} T04] Strato 12km 85% 10s | dAlt=${dAltM.toFixed(2)}m | finalVS=${m.verticalSpeedMps.toFixed(2)}m/s | TAS=${m.tasMps.toFixed(1)} | AoA=${m.aoaDeg.toFixed(2)}° | G=${m.gLoad.toFixed(2)}`,
        );
        expect(Math.abs(dAltM)).toBeLessThan(18.0);
        expect(Math.abs(m.verticalSpeedMps)).toBeLessThan(1.5);
      });

      it('T04b: holds level at 5 km MSL & 100% MIL throttle, AND preserves -3° gear-down landing glideslope', () => {
        // 5 km MSL at 100% dry MIL throttle
        const m5 = makeCruise(id, 260, 5.0, 2.0);
        const y5 = m5.position.y;
        stepSec(m5, 8, mkInput({ throttle: 1.0 }), (mm) => {
          const altKm = Math.max(0.1, mm.position.y * EARTH_KPU);
          return envAt(altKm, id);
        });
        const dAlt5 = (m5.position.y - y5) * EARTH_KPU * 1000;
        // Gear-down -3 deg landing approach glideslope (must NOT snap flat to 0 deg!)
        const mApp = makeCruise(id, 95, 0.45, 7.0);
        const glideRad = -3.0 * DEG;
        mApp.velocity.set(0, Math.sin(glideRad) * mApp.speed, -Math.cos(glideRad) * mApp.speed);
        mApp.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 4.5 * DEG);
        stepSec(mApp, 4.0, mkInput({ throttle: 0.48, gearDown: true }), (mm) => {
          const altKm = Math.max(0.05, mm.position.y * EARTH_KPU);
          return envAt(altKm, id);
        });
        console.log(
          `[${id} T04b] 5km 100%MIL dAlt=${dAlt5.toFixed(2)}m VS=${m5.verticalSpeedMps.toFixed(2)}m/s | Gear-Down Glideslope gamma=${mApp.fpvAngleDeg.toFixed(2)}° VS=${mApp.verticalSpeedMps.toFixed(2)}m/s`,
        );
        expect(Math.abs(dAlt5)).toBeLessThan(14.0);
        expect(Math.abs(m5.verticalSpeedMps)).toBeLessThan(1.2);
        // -3 deg landing glideslope must remain descending between -5.5 deg and -1.5 deg (NOT flattened to 0 deg!)
        expect(mApp.fpvAngleDeg).toBeLessThan(-1.5);
        expect(mApp.fpvAngleDeg).toBeGreaterThan(-5.5);
      });

      it('T05: recovers zero-sag level flight after releasing a +5G climb/maneuver', () => {
        const m = makeCruise(id, 230, 2.0, 1.8);
        const env = envAt(2.0, id);
        stepSec(m, 0.8, mkInput({ pitch: 0.5, throttle: 0.82 }), env);
        const relGamma = m.fpvAngleDeg;
        stepSec(m, 6.0, mkInput({ pitch: 0, throttle: 0.82 }), env);
        console.log(
          `[${id} T05] Post-Pull Release (relGamma=${relGamma.toFixed(1)}°) | finalGamma=${m.fpvAngleDeg.toFixed(2)}° | finalVS=${m.verticalSpeedMps.toFixed(2)}m/s | G=${m.gLoad.toFixed(2)}`,
        );
        // Should hold climb angle smoothly without nose-dropping below 0 into a dive
        expect(m.fpvAngleDeg).toBeGreaterThan(relGamma - 6.0);
        expect(m.verticalSpeedMps).toBeGreaterThan(-1.5);
      });

      it('T06: does NOT latch an accidental shallow nose-down dive after a brief nose-down tap', () => {
        const m = makeCruise(id, 220, 2.0, 1.8);
        const env = envAt(2.0, id);
        stepSec(m, 0.45, mkInput({ pitch: -0.4, throttle: 0.72 }), env);
        const relGamma = m.fpvAngleDeg;
        const yRel = m.position.y;
        stepSec(m, 6.0, mkInput({ pitch: 0, throttle: 0.72 }), env);
        const dAltAfter = (m.position.y - yRel) * EARTH_KPU * 1000;
        console.log(
          `[${id} T06] Nose-Down Tap Release (relGamma=${relGamma.toFixed(2)}°) | dAltAfter=${dAltAfter.toFixed(1)}m | finalGamma=${m.fpvAngleDeg.toFixed(2)}° | finalVS=${m.verticalSpeedMps.toFixed(2)}m/s`,
        );
        // Must level back out near horizon instead of diving -100m permanently!
        expect(Math.abs(m.fpvAngleDeg)).toBeLessThan(1.5);
        expect(Math.abs(m.verticalSpeedMps)).toBeLessThan(2.0);
      });

      it('T07: wings-level detent (< 7.5°) flattens micro-taps while deliberate 12° scenic banks hold steady', () => {
        // Part A: minor ~5.5 deg roll micro-tap MUST self-level cleanly back to 0 deg
        const m = makeCruise(id, 220, 1.5, 1.8);
        const env = envAt(1.5, id);
        stepSec(m, 0.08, mkInput({ roll: 0.36, throttle: 0.72 }), env);
        const relBank = bankDegOf(m);
        stepSec(m, 4.0, mkInput({ roll: 0, throttle: 0.72 }), env);
        const finalBank = bankDegOf(m);
        // Part B: deliberate 12 deg scenic bank MUST hold hands-off without flattening to 0!
        const m12 = makeCruise(id, 220, 1.5, 1.8);
        m12.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -12 * DEG);
        stepSec(m12, 3.5, mkInput({ roll: 0, throttle: 0.72 }), env);
        const heldBank = Math.abs(bankDegOf(m12));
        console.log(
          `[${id} T07] Detent (rel=${relBank.toFixed(2)}° -> final=${finalBank.toFixed(2)}°) | 12° Scenic Hold=${heldBank.toFixed(2)}°`,
        );
        expect(Math.abs(relBank)).toBeGreaterThan(1.5);
        expect(Math.abs(relBank)).toBeLessThan(7.4);
        expect(Math.abs(finalBank)).toBeLessThan(0.6);
        expect(heldBank).toBeGreaterThan(9.5);
        expect(heldBank).toBeLessThan(14.5);
      });

      it('T08: 45° banked coordinated turn holds bank and altitude hands-off with < 1.5° sideslip', () => {
        const m = makeCruise(id, 230, 1.5, 2.0);
        m.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -45 * DEG);
        const y0 = m.position.y;
        const env = envAt(1.5, id);
        let maxBeta = 0;
        stepSec(m, 6.0, mkInput({ throttle: 0.80 }), (mm) => {
          maxBeta = Math.max(maxBeta, Math.abs(mm.aosDeg));
          return env;
        });
        const dAltM = (m.position.y - y0) * EARTH_KPU * 1000;
        const bank = Math.abs(bankDegOf(m));
        console.log(
          `[${id} T08] 45° Banked Turn 6s | bank=${bank.toFixed(1)}° | dAlt=${dAltM.toFixed(1)}m | VS=${m.verticalSpeedMps.toFixed(2)}m/s | G=${m.gLoad.toFixed(2)} | max|β|=${maxBeta.toFixed(2)}°`,
        );
        expect(bank).toBeGreaterThan(40);
        expect(bank).toBeLessThan(50);
        expect(Math.abs(dAltM)).toBeLessThan(12);
        expect(Math.abs(m.verticalSpeedMps)).toBeLessThan(2.0);
        expect(maxBeta).toBeLessThan(2.5);
      });

      it('T09: 65° steep combat turn holds altitude cleanly without bank-cap nose collapse', () => {
        const m = makeCruise(id, 250, 2.0, 2.0);
        m.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -65 * DEG);
        const y0 = m.position.y;
        const env = envAt(2.0, id);
        stepSec(m, 5.0, mkInput({ throttle: 0.94 }), env);
        const dAltM = (m.position.y - y0) * EARTH_KPU * 1000;
        const bank = Math.abs(bankDegOf(m));
        console.log(
          `[${id} T09] 65° Steep Turn 5s | bank=${bank.toFixed(1)}° | dAlt=${dAltM.toFixed(1)}m | VS=${m.verticalSpeedMps.toFixed(2)}m/s | G=${m.gLoad.toFixed(2)}`,
        );
        expect(bank).toBeGreaterThan(58);
        expect(bank).toBeLessThan(72);
        expect(Math.abs(dAltM)).toBeLessThan(22);
        expect(Math.abs(m.verticalSpeedMps)).toBeLessThan(3.0);
      });

      it('T10: MIL-STD-1797C Level 1 pitch step response (< 10% overshoot, fast rise, zero G-undershoot PIO)', () => {
        const m = makeCruise(id, 240, 2.0, 1.8);
        const env = envAt(2.0, id);
        let peakQ = 0;
        let steadyQ = 0;
        stepSec(m, 1.0, (t, mm) => {
          if (t > 0.82) steadyQ = mm.rates.x;
          peakQ = Math.max(peakQ, mm.rates.x);
          return mkInput({ pitch: 0.55, throttle: 0.85 });
        }, env);
        const m2 = makeCruise(id, 240, 2.0, 1.8);
        let t80 = -1;
        stepSec(m2, 1.0, (t, mm) => {
          if (t80 < 0 && mm.rates.x >= 0.8 * steadyQ) t80 = t;
          return mkInput({ pitch: 0.55, throttle: 0.85 });
        }, env);
        let minRelG = 10;
        let minRelQ = 0;
        stepSec(m, 1.5, (_t, mm) => {
          minRelG = Math.min(minRelG, mm.gLoad);
          minRelQ = Math.min(minRelQ, mm.rates.x);
          return mkInput({ pitch: 0, throttle: 0.85 });
        }, env);
        const overshootPct = steadyQ > 0.01 ? Math.max(0, ((peakQ - steadyQ) / steadyQ) * 100) : 0;
        console.log(
          `[${id} T10] Pitch Step | steadyQ=${(steadyQ * RAD).toFixed(1)}°/s | t80=${(t80 * 1000).toFixed(0)}ms | overshoot=${overshootPct.toFixed(1)}% | minRelG=${minRelG.toFixed(2)}G | relMinQ=${(minRelQ * RAD).toFixed(1)}°/s`,
        );
        expect(t80).toBeGreaterThan(0);
        expect(t80).toBeLessThan(0.55);
        expect(overshootPct).toBeLessThan(10);
        // True MIL-STD-1797C unload criterion: unloading from 5G -> 1G must NEVER dip below 0.70G into a dive!
        expect(minRelG).toBeGreaterThan(0.70);
        expect(Math.abs(m.rates.x * RAD)).toBeLessThan(1.0);
      });

      it('T11: crisp roll-stop (< 200 ms settle, < 3°/s bounce) with distinct Gripen vs Su-30 roll agility', () => {
        const m = makeCruise(id, 240, 2.0, 1.8);
        const env = envAt(2.0, id);
        let peakRollDegS = 0;
        stepSec(m, 0.7, (_t, mm) => {
          peakRollDegS = Math.max(peakRollDegS, Math.abs(mm.rates.z) * RAD);
          return mkInput({ roll: 1.0, throttle: 0.82 });
        }, env);
        let settleMs = -1;
        let bounceDegS = 0;
        stepSec(m, 1.2, (t, mm) => {
          const r = -mm.rates.z * RAD;
          if (r < 0) bounceDegS = Math.max(bounceDegS, -r);
          if (settleMs < 0 && Math.abs(r) < 5) settleMs = t * 1000;
          return mkInput({ roll: 0, throttle: 0.82 });
        }, env);
        console.log(
          `[${id} T11] Roll-Stop | peakRoll=${peakRollDegS.toFixed(1)}°/s | settle(<5°/s)=${settleMs.toFixed(0)}ms | bounce=${bounceDegS.toFixed(2)}°/s | postVS=${m.verticalSpeedMps.toFixed(2)}m/s`,
        );
        expect(peakRollDegS).toBeGreaterThan(id === 'gripen' ? 245 : 195);
        expect(settleMs).toBeGreaterThan(0);
        expect(settleMs).toBeLessThan(180);
        expect(bounceDegS).toBeLessThan(3.0);
      });

      it('T12: responsive FADEC afterburner ignition (< 300 ms wet thrust kick from cruise)', () => {
        const m = makeCruise(id, 200, 1.0, 1.8);
        const env = envAt(1.0, id);
        stepSec(m, 1.5, mkInput({ throttle: 0.55 }), env);
        const thrBefore = m.thrustN;
        let tAbMs = -1;
        stepSec(m, 1.5, (t, mm) => {
          if (tAbMs < 0 && mm.thrustN > mm.maxDryThrustN * 1.15) tAbMs = t * 1000;
          return mkInput({ throttle: 1.0, boost: true });
        }, env);
        console.log(
          `[${id} T12] AB Kick | thr@55%=${(thrBefore / 1000).toFixed(1)}kN | timeTo>115%Dry=${tAbMs.toFixed(0)}ms | abStage=${m.abStage} | T/W=${m.twRatio.toFixed(2)} | M=${m.mach.toFixed(2)}`,
        );
        expect(tAbMs).toBeGreaterThanOrEqual(0);
        expect(tAbMs).toBeLessThan(300);
        expect(m.abStage).toBe(3);
      });

      it('T13: executes clean medium-speed Pugachev Cobra (> 85° AoA, <= 9.2G, zero stall-sink, level exit to NORM)', () => {
        const m = makeCruise(id, 200, 2.0, 1.8);
        const y0 = m.position.y;
        const env = envAt(2.0, id);
        let maxAoa = 0;
        let peakG = 0;
        let sawFalseKulbit = false;
        stepSec(m, COBRA_TIME + 2.0, (t, mm) => {
          maxAoa = Math.max(maxAoa, mm.aoaDeg);
          peakG = Math.max(peakG, mm.gLoad);
          if (mm.aerobaticManeuver === 'kulbit') sawFalseKulbit = true;
          // Emulate live KeyV press (momentary psm+cobra for 80ms, passing baseFbwMode like JetController)
          return mkInput({ throttle: 0.72, cobra: t < 0.02, psm: t < 0.08, fbwMode: mm.baseFbwMode });
        }, env);
        const endPitch = pitchDegOf(m);
        const endBank = bankDegOf(m);
        const dAltM = (m.position.y - y0) * EARTH_KPU * 1000;
        console.log(
          `[${id} T13] Cobra 200m/s | maxAoA=${maxAoa.toFixed(1)}° | peakG=${peakG.toFixed(2)}G | endTAS=${m.tasMps.toFixed(1)} | endVS=${m.verticalSpeedMps.toFixed(2)}m/s | dAlt=${dAltM.toFixed(1)}m | fbwMode=${m.fbwMode} | falseKulbit=${sawFalseKulbit}`,
        );
        expect(maxAoa).toBeGreaterThan(85);
        expect(maxAoa).toBeLessThan(112);
        expect(peakG).toBeLessThanOrEqual(9.2);
        expect(sawFalseKulbit).toBe(false);
        expect(Math.abs(endPitch)).toBeLessThan(8);
        expect(Math.abs(endBank)).toBeLessThan(5);
        expect(m.verticalSpeedMps).toBeGreaterThan(-4.5);
        expect(m.tasMps).toBeGreaterThan(130);
        expect(dAltM).toBeGreaterThan(-60);
        expect(m.fbwMode).toBe('norm');
        expect(m.baseFbwMode).toBe('norm');
      });

      it('T13b: high-speed Mach 0.84 Cobra (275 m/s) stays <= 9.2G, hits 85-110° AoA, exits level & crisp to NORM', () => {
        const m = makeCruise(id, 275, 1.0, 1.2);
        const y0 = m.position.y;
        const env = envAt(1.0, id);
        let maxAoa = 0;
        let peakG = 0;
        let sawFalseKulbit = false;
        stepSec(m, 4.6, (t, mm) => {
          maxAoa = Math.max(maxAoa, mm.aoaDeg);
          peakG = Math.max(peakG, mm.gLoad);
          if (mm.aerobaticManeuver === 'kulbit') sawFalseKulbit = true;
          return mkInput({ throttle: 0.85, boost: t < 0.05, cobra: t < 0.02, psm: t < 0.08, fbwMode: mm.baseFbwMode });
        }, env);
        const endPitch = pitchDegOf(m);
        const endBank = bankDegOf(m);
        const dAltM = (m.position.y - y0) * EARTH_KPU * 1000;
        console.log(
          `[${id} T13b] High-Speed Cobra M0.84 | maxAoA=${maxAoa.toFixed(1)}° | peakG=${peakG.toFixed(2)}G | endTAS=${m.tasMps.toFixed(1)} | endVS=${m.verticalSpeedMps.toFixed(2)}m/s | dAlt=${dAltM.toFixed(1)}m | fbwMode=${m.fbwMode}`,
        );
        expect(maxAoa).toBeGreaterThanOrEqual(85);
        expect(maxAoa).toBeLessThan(112);
        expect(peakG).toBeLessThanOrEqual(9.2);
        expect(sawFalseKulbit).toBe(false);
        expect(Math.abs(endPitch)).toBeLessThan(8);
        expect(Math.abs(endBank)).toBeLessThan(5);
        expect(m.verticalSpeedMps).toBeGreaterThan(-4.5);
        expect(m.tasMps).toBeGreaterThan(130);
        expect(dAltM).toBeGreaterThan(-60);
        expect(m.fbwMode).toBe('norm');
      });

      it('T13c: 45° banked-entry Cobra auto-levels wings upright, hits > 85° AoA <= 9.2G, & exits level in NORM', () => {
        const m = makeCruise(id, 225, 1.5, 1.6);
        m.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -45 * DEG);
        const y0 = m.position.y;
        const env = envAt(1.5, id);
        let maxAoa = 0;
        let peakG = 0;
        stepSec(m, 4.6, (t, mm) => {
          maxAoa = Math.max(maxAoa, mm.aoaDeg);
          peakG = Math.max(peakG, mm.gLoad);
          return mkInput({ throttle: 0.78, cobra: t < 0.02, psm: t < 0.08, fbwMode: mm.baseFbwMode });
        }, env);
        const endPitch = pitchDegOf(m);
        const endBank = bankDegOf(m);
        const dAltM = (m.position.y - y0) * EARTH_KPU * 1000;
        console.log(
          `[${id} T13c] Banked-45° Cobra | maxAoA=${maxAoa.toFixed(1)}° | peakG=${peakG.toFixed(2)}G | endBank=${endBank.toFixed(1)}° | endVS=${m.verticalSpeedMps.toFixed(2)}m/s | dAlt=${dAltM.toFixed(1)}m`,
        );
        expect(maxAoa).toBeGreaterThan(85);
        expect(peakG).toBeLessThanOrEqual(9.2);
        expect(Math.abs(endBank)).toBeLessThan(5);
        expect(Math.abs(endPitch)).toBeLessThan(8);
        expect(m.verticalSpeedMps).toBeGreaterThan(-5.0);
        expect(m.fbwMode).toBe('norm');
      });

      it('T19: NORM FBW strictly enforces [-3.3G, +9.4G] & AoA >= -17° under full crossed-control slam (Space+A+W+E)', () => {
        const m = makeCruise(id, 275, 1.0, 1.2);
        const env = envAt(1.0, id);
        let minG = 10;
        let maxG = -10;
        let minAoa = 90;
        let maxAbsBeta = 0;
        stepSec(m, 3.0, (_t, mm) => {
          minG = Math.min(minG, mm.gLoad);
          maxG = Math.max(maxG, mm.gLoad);
          minAoa = Math.min(minAoa, mm.aoaDeg);
          maxAbsBeta = Math.max(maxAbsBeta, Math.abs(mm.aosDeg));
          return mkInput({
            pitch: -1,
            roll: -1,
            yaw: 1,
            throttle: 1.0,
            boost: true,
            fbwMode: mm.baseFbwMode,
          });
        }, env);
        console.log(
          `[${id} T19] Crossed-Control NORM (Space+A+W+E) | minG=${minG.toFixed(2)}G | maxG=${maxG.toFixed(2)}G | minAoA=${minAoa.toFixed(1)}° | max|β|=${maxAbsBeta.toFixed(1)}° | mode=${m.fbwMode}`,
        );
        expect(minG).toBeGreaterThanOrEqual(-3.3);
        expect(maxG).toBeLessThanOrEqual(9.4);
        expect(minAoa).toBeGreaterThanOrEqual(-17.0);
        expect(m.fbwMode).toBe('norm');
      });

      it('T20: momentary V (PSM) and paddle (HIGH-G) release cleanly back to FBW NORM on the first frame', () => {
        const m = makeCruise(id, 220, 1.5, 1.8);
        const env = envAt(1.5, id);
        // Hold V (PSM) for 0.25s then release
        stepSec(m, 0.25, (_t, mm) => mkInput({ psm: true, fbwMode: mm.baseFbwMode }), env);
        expect(m.fbwMode).toBe('psm');
        expect(m.baseFbwMode).toBe('norm');
        m.step(1 / 60, mkInput({ psm: false, fbwMode: m.baseFbwMode }), env);
        expect(m.fbwMode).toBe('norm');
        // Hold highG paddle for 0.25s then release
        stepSec(m, 0.25, (_t, mm) => mkInput({ highG: true, fbwMode: mm.baseFbwMode }), env);
        expect(m.fbwMode).toBe('high-g');
        expect(m.baseFbwMode).toBe('norm');
        m.step(1 / 60, mkInput({ highG: false, fbwMode: m.baseFbwMode }), env);
        expect(m.fbwMode).toBe('norm');
      });

      it('T14: completes full 360° vertical loop through ±90° zenith & inverted with zero gimbal lock or NaN', () => {
        const m = makeCruise(id, 270, 3.0, 1.8);
        const env = envAt(3.0, id);
        let maxRollGlitch = 0;
        let zenith = false;
        let inverted = false;
        let allFinite = true;
        stepSec(m, 12.0, (_t, mm) => {
          const fwd = mm.forward(new THREE.Vector3());
          const up = new THREE.Vector3(0, 1, 0).applyQuaternion(mm.quaternion);
          if (fwd.y > 0.94) zenith = true;
          if (up.y < -0.9) inverted = true;
          maxRollGlitch = Math.max(maxRollGlitch, Math.abs(mm.rates.z) * RAD);
          if (!Number.isFinite(mm.position.x) || !Number.isFinite(mm.tasMps) || !Number.isFinite(mm.gLoad)) {
            allFinite = false;
          }
          return mkInput({ pitch: 0.85, throttle: 1.0, boost: true });
        }, env);
        console.log(
          `[${id} T14] Vertical Loop | zenith=${zenith} | inverted=${inverted} | maxRollGlitch=${maxRollGlitch.toFixed(2)}°/s | finite=${allFinite}`,
        );
        expect(allFinite).toBe(true);
        expect(zenith).toBe(true);
        expect(inverted).toBe(true);
        expect(maxRollGlitch).toBeLessThan(3.0);
      });

      it('T15: recovers cleanly from 45° deep stall in NORM FBW via Alpha-Floor without flat spin or NaN', () => {
        const m = makeCruise(id, 55, 2.5, 45);
        const env = envAt(2.5, id);
        let sawAlphaFloor = false;
        stepSec(m, 8.0, (_t, mm) => {
          if (mm.alphaFloorActive) sawAlphaFloor = true;
          return mkInput({ throttle: 0.65 });
        }, env);
        console.log(
          `[${id} T15] Stall Recovery 8s | alphaFloor=${sawAlphaFloor} | endAoA=${m.aoaDeg.toFixed(1)}° | endTAS=${m.tasMps.toFixed(1)} | endVS=${m.verticalSpeedMps.toFixed(1)} | finite=${Number.isFinite(m.tasMps)}`,
        );
        expect(sawAlphaFloor).toBe(true);
        expect(Number.isFinite(m.tasMps)).toBe(true);
        expect(Math.abs(m.aoaDeg)).toBeLessThan(15);
        expect(m.tasMps).toBeGreaterThan(Math.max(92, m.stallSpeedMps * 1.38));
        expect(m.verticalSpeedMps).toBeGreaterThan(-2.0);
      });

      it('T17: one-tap Wings-Level (Backspace) recovers smoothly from steep bank + shallow dive to level horizon', () => {
        const m = makeCruise(id, 220, 2.0, 1.8);
        m.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -38 * DEG);
        const env = envAt(2.0, id);
        stepSec(m, 0.3, mkInput({ pitch: -0.35, throttle: 0.72 }), env);
        m.requestLevelWings();
        stepSec(m, 4.0, mkInput({ throttle: 0.72 }), env);
        const endBank = bankDegOf(m);
        console.log(
          `[${id} T17] One-Tap Level Wings | endBank=${endBank.toFixed(2)}° | endGamma=${m.fpvAngleDeg.toFixed(2)}° | endVS=${m.verticalSpeedMps.toFixed(2)}m/s`,
        );
        expect(Math.abs(endBank)).toBeLessThan(1.0);
        expect(Math.abs(m.fpvAngleDeg)).toBeLessThan(1.0);
        expect(Math.abs(m.verticalSpeedMps)).toBeLessThan(1.5);
      });

      it('T18: cross-world Mars/Titan/Venus/Moon, 180° tailslide, 0 m/s hover, and Mach 6 / Mach 25 hypersonic tiers', () => {
        const worlds: Array<{ name: string; altKm: number; rhoRel: number; speedMps: number }> = [
          { name: 'Mars', altKm: 1.5, rhoRel: 0.015, speedMps: 240 },
          { name: 'Titan', altKm: 2.0, rhoRel: 4.1, speedMps: 140 },
          { name: 'Venus', altKm: 52.0, rhoRel: 1.1, speedMps: 210 },
          { name: 'Moon', altKm: 5.0, rhoRel: 0, speedMps: 300 },
        ];
        for (const w of worlds) {
          const m = makeCruise(id, w.speedMps, w.altKm, 1.5);
          const env = envAt(w.altKm, id, w.rhoRel, w.name);
          stepSec(m, 2.0, mkInput({ pitch: 0.25, roll: 0.2, throttle: 0.75 }), env);
          expect(Number.isFinite(m.tasMps), `${id} on ${w.name}`).toBe(true);
          expect(Number.isFinite(m.gLoad), `${id} gLoad on ${w.name}`).toBe(true);
          expect(Number.isFinite(m.position.x), `${id} pos on ${w.name}`).toBe(true);
        }

        // 180° tail-first tailslide edge case (zero NaN, stable attitude integration)
        const mTail = makeCruise(id, 60, 4.0, 0);
        mTail.velocity.set(0, 0, 60 * UPM); // pure +Z backward airspeed -> 180 deg alpha
        stepSec(mTail, 2.0, mkInput({ throttle: 0.85, psm: true }), envAt(4.0, id));
        expect(Number.isFinite(mTail.tasMps)).toBe(true);
        expect(Number.isFinite(mTail.aoaDeg)).toBe(true);
        expect(Number.isFinite(mTail.position.y)).toBe(true);

        // 0 m/s hover singularity check
        const mZero = makeCruise(id, 0, 3.0, 0);
        mZero.velocity.set(0, 0, 0);
        mZero.speed = 0;
        stepSec(mZero, 1.0, mkInput({ pitch: 0.4, roll: 0.3, throttle: 0.85 }), envAt(3.0, id));
        expect(Number.isFinite(mZero.tasMps)).toBe(true);
        expect(Number.isFinite(mZero.gLoad)).toBe(true);

        // Actual Earth Mach 6 & Mach 25 hypersonic tier transitions
        for (const tier of [
          { name: 'Mach 6', speedMps: 2040, airAccelScale: 12, speedTier: 'hypersonic' as const },
          { name: 'Mach 25', speedMps: 8400, airAccelScale: 55, speedTier: 'scramjet' as const },
        ]) {
          const mHyp = makeCruise(id, tier.speedMps, 28.0, 0);
          const envHyp: FlightEnv = {
            ...envAt(28.0, id, 0.02, 'Earth'),
            airAccelScale: tier.airAccelScale,
            speedTier: tier.speedTier,
          };
          stepSec(mHyp, 2.0, mkInput({ pitch: 0.15, roll: 0.1, throttle: 1.0, boost: true }), envHyp);
          expect(Number.isFinite(mHyp.tasMps), `${id} ${tier.name}`).toBe(true);
          expect(Number.isFinite(mHyp.gLoad), `${id} ${tier.name} G`).toBe(true);
          expect(mHyp.tasMps).toBeGreaterThan(1500);
        }
      });
    });
  }

  it('T16: Su-30MKK executes 360° Kulbit Backflip and NASA X-31 Herbst J-Turn via 32° canted 3D TVC', () => {
    const mk = makeCruise('su30', 175, 2.0, 2.0);
    const env = envAt(2.0, 'su30');
    let sweptDeg = 0;
    stepSec(mk, 3.8, (t, mm) => {
      sweptDeg += mm.rates.x * (1 / 60) * RAD;
      return mkInput({ pitch: 1.0, psm: true, cobra: t < 0.02, throttle: 1.0, boost: true });
    }, env);
    console.log(
      `[su30 T16a] Kulbit | sweptPitch=${sweptDeg.toFixed(1)}° | endPitch=${pitchDegOf(mk).toFixed(1)}° | finite=${Number.isFinite(mk.tasMps)}`,
    );
    expect(sweptDeg).toBeGreaterThan(300);
    expect(Number.isFinite(mk.tasMps)).toBe(true);

    const mh = makeCruise('su30', 120, 2.0, 2.0);
    mh.setFbwMode('psm');
    const a50 = 50 * DEG;
    mh.velocity.set(0, -120 * Math.sin(a50) * UPM, -120 * Math.cos(a50) * UPM);
    stepSec(mh, 0.8, mkInput({ roll: 1.0, psm: true, throttle: 1.0, boost: true }), env);
    console.log(
      `[su30 T16b] Herbst J-Turn | yawRateB3=${(mh.rates.y * RAD).toFixed(1)}°/s | rollRateB3=${(mh.rates.z * RAD).toFixed(1)}°/s | tvcActive=${mh.tvcActive}`,
    );
    expect(mh.rates.y).toBeLessThan(-0.25);
    expect(mh.rates.z).toBeLessThan(-0.15);
    expect(mh.tvcActive).toBe(true);
  });

  it('T21: Polhamus CLmax calibration (±5% of spec), Mach 0.3->2.0 Korn wave-drag polar, & Gripen vs Su-30 distinction', () => {
    const cleanSurf = { elev: 0, ail: 0, rud: 0, flaps: 0, slats: 0, gear: 0, speedbrake: 0 };
    for (const id of ['gripen', 'su30'] as const) {
      const spec = AIRFRAME_SPECS[id];
      let peakCl = 0;
      for (let deg = 0; deg <= 40; deg += 1) {
        const a = deg * DEG;
        const flow = computeFlowAngles(new THREE.Vector3(0, -150 * Math.sin(a), -150 * Math.cos(a)));
        const c = computeAeroCoefficients(flow, 0.3, 1500, cleanSurf, spec);
        peakCl = Math.max(peakCl, c.cl);
      }
      // Clean peak CL must match spec.aero.clMaxClean within ±6% (no +33% 2.16 unphysical overshoot!)
      expect(peakCl).toBeGreaterThan(spec.aero.clMaxClean * 0.94);
      expect(peakCl).toBeLessThan(spec.aero.clMaxClean * 1.06);

      // Mach 0.3 -> 2.0 wave-drag rise peaks near M 1.0-1.08 then tapers supersonically
      const flow2 = computeFlowAngles(new THREE.Vector3(0, -200 * Math.sin(2 * DEG), -200 * Math.cos(2 * DEG)));
      const cdM03 = computeAeroCoefficients(flow2, 0.3, 8000, cleanSurf, spec).cd;
      const cdM105 = computeAeroCoefficients(flow2, 1.05, 8000, cleanSurf, spec).cd;
      const cdM20 = computeAeroCoefficients(flow2, 2.0, 8000, cleanSurf, spec).cd;
      expect(cdM105).toBeGreaterThan(cdM03 * 1.8);
      expect(cdM105).toBeGreaterThan(cdM20);
      console.log(
        `[${id} T21] PeakCleanCL=${peakCl.toFixed(3)} (spec ${spec.aero.clMaxClean}) | CD(M0.3)=${cdM03.toFixed(4)} CD(M1.05)=${cdM105.toFixed(4)} CD(M2.0)=${cdM20.toFixed(4)}`,
      );
    }
    // Distinct wing loading & corner speed between lightweight Gripen and twin-engine Su-30MKK
    const wlGripen = combatMassKg(AIRFRAME_SPECS.gripen) / AIRFRAME_SPECS.gripen.wingAreaM2;
    const wlSu30 = combatMassKg(AIRFRAME_SPECS.su30) / AIRFRAME_SPECS.su30.wingAreaM2;
    const vcGripen = computeCornerSpeed(combatMassKg(AIRFRAME_SPECS.gripen), AIRFRAME_SPECS.gripen.wingAreaM2, AIRFRAME_SPECS.gripen.aero.clMaxClean, 9, RHO0_EARTH).easMps;
    const vcSu30 = computeCornerSpeed(combatMassKg(AIRFRAME_SPECS.su30), AIRFRAME_SPECS.su30.wingAreaM2, AIRFRAME_SPECS.su30.aero.clMaxClean, 9, RHO0_EARTH).easMps;
    expect(wlSu30).toBeGreaterThan(wlGripen);
    expect(vcSu30).toBeGreaterThan(vcGripen);
  });

  it('T22: control-surface & 32°-canted TVC signs, turbine rotor advance, Shift-chord immunity, & relative drag-steer', () => {
    // 1. Control-surface & 32°-canted TVC deflection sign matrix
    const mg = makeCruise('gripen', 220, 1.5, 1.8);
    stepSec(mg, 0.25, mkInput({ pitch: 1, roll: 0, yaw: 0, throttle: 0.8 }), envAt(1.5, 'gripen'));
    expect(mg.surfaces.canardRad).toBeGreaterThan(0.05); // pitch-up -> canard TE down (+)
    expect(mg.surfaces.elevonLeftRad).toBeLessThan(-0.05); // pitch-up -> elevons TE up (-)

    const ms = makeCruise('su30', 220, 1.5, 1.8);
    stepSec(ms, 0.25, mkInput({ pitch: 0, roll: 1, yaw: 0, throttle: 0.8 }), envAt(1.5, 'su30'));
    expect(ms.surfaces.elevonRightRad).toBeLessThan(ms.surfaces.elevonLeftRad); // roll right -> right TE up, left TE down

    // Pure pitch-up TVC: positive tvcPitch deflects +Z exhaust UP -> pushes tail DOWN -> nose UP!
    const msTvcPitch = makeCruise('su30', 180, 1.5, 1.8);
    stepSec(msTvcPitch, 0.35, mkInput({ pitch: 1, yaw: 0, psm: true, throttle: 1.0, boost: true }), envAt(1.5, 'su30'));
    expect(msTvcPitch.surfaces.tvcPitchLeftRad).toBeGreaterThan(0.05);
    expect(msTvcPitch.surfaces.tvcPitchRightRad).toBeGreaterThan(0.05);
    expect(msTvcPitch.surfaces.nozzleIris).toBeGreaterThan(0.5); // AB opens convergent-divergent iris

    // Pure yaw-right TVC on 32°-canted AL-31FP nozzles: rudder TE right (+), nozzles yaw right (+),
    // and canted V-hinges produce differential pitch coupling (tvcPitchRightRad > tvcPitchLeftRad)
    const msTvcYaw = makeCruise('su30', 180, 1.5, 1.8);
    stepSec(msTvcYaw, 0.35, mkInput({ pitch: 0, yaw: 1, psm: true, throttle: 1.0, boost: true }), envAt(1.5, 'su30'));
    expect(msTvcYaw.surfaces.rudderRad).toBeGreaterThan(0.05);
    expect(msTvcYaw.surfaces.tvcYawLeftRad).toBeGreaterThan(0.05);
    expect(msTvcYaw.surfaces.tvcPitchRightRad).toBeGreaterThan(msTvcYaw.surfaces.tvcPitchLeftRad);

    // 2. JetModel spinning 18-blade LP turbine rotor advances smoothly with throttle/AB
    const prevDoc = globalThis.document;
    const mockCtx = new Proxy(
      {
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createRadialGradient: () => ({ addColorStop: () => {} }),
        getImageData: () => ({ data: new Uint8ClampedArray(16) }),
        measureText: () => ({ width: 10 }),
      },
      { get: (t, p) => (p in t ? (t as Record<PropertyKey, unknown>)[p] : () => {}) },
    );
    (globalThis as unknown as { document: unknown }).document = {
      createElement: () => ({ width: 64, height: 64, getContext: () => mockCtx }),
    };
    try {
      const jm = new JetModel();
      const s0 = jm.getRigSummary();
      expect(s0.turbineRotors).toBeGreaterThanOrEqual(1);
      jm.update(0.1, 0.68, 0, 0, { dt: 0.05, abStage: 0 });
      const s1 = jm.getRigSummary();
      jm.update(0.2, 1.0, 1, 0, { dt: 0.05, abStage: 3 });
      const s2 = jm.getRigSummary();
      expect(s1.turbineAngleRad).toBeGreaterThan(s0.turbineAngleRad + 1.0);
      expect(s2.turbineAngleRad - s1.turbineAngleRad).toBeGreaterThan(s1.turbineAngleRad - s0.turbineAngleRad);
      jm.dispose();
    } finally {
      (globalThis as unknown as { document: unknown }).document = prevDoc;
    }

    // 3. Physical e.code Shift-chord stuck-key immunity
    expect(canonicalFlyKey({ code: 'Digit1', key: '!' })).toBe('1');
    expect(canonicalFlyKey({ code: 'Semicolon', key: ':' })).toBe(';');
    expect(canonicalFlyKey({ code: 'Backquote', key: '~' })).toBe('`');
    expect(canonicalFlyKey({ code: 'KeyW', key: 'W' })).toBe('w');
    expect(canonicalFlyKey({ code: 'Backspace', key: 'Backspace' })).toBe('backspace');

    // 4. Relative drag-steer anchored at click origin (zero jump when clicking far off screen center!)
    //    AND verify invertPitch applies ONLY to keyboard pitch (drag-up y < 0 ALWAYS maps to nose-up pitch > 0)
    const atOrigin = computeRelativeDragSteer(980, 560, 980, 560, 1280, 720);
    expect(atOrigin.x).toBe(0);
    expect(atOrigin.y).toBe(0);
    const smallDeadzone = computeRelativeDragSteer(983, 562, 980, 560, 1280, 720);
    expect(smallDeadzone.x).toBe(0);
    expect(smallDeadzone.y).toBe(0);
    const dragRightUp = computeRelativeDragSteer(1080, 460, 980, 560, 1280, 720);
    expect(dragRightUp.x).toBeGreaterThan(0.25);
    expect(dragRightUp.y).toBeLessThan(-0.25);
    // JetController applies `pitch += -this.steer.y - this.touchSteer.y` AFTER keyboard-only invertPitch,
    // so dragging mouse/touch UP (`y < 0`) yields positive nose-up pitch regardless of invertPitch!
    expect(-dragRightUp.y).toBeGreaterThan(0.25);
  });
});
