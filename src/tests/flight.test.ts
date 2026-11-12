import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  FlightModel, FlightInput, FlightEnv, speedCeiling, speedFloor, throttleTarget, approachSpeed, airDensity,
  localKmPerUnit, resolveSurfaceContact, unitsPerMps, gapKm, MAX_DRIVE_UNITS_PER_S, DRIVE_RATE, FLOOR_MPS, AIR_LIMIT_MPS, G_LIMIT, G_ONSET, COBRA_TIME,
} from '../flight/FlightModel';
import { formatSpeed, formatDistance, formatEta, AIR } from '../flight/worlds';
import { KM_PER_UNIT, UNITS_PER_AU } from '../rendering/Scale';

const input = (o: Partial<FlightInput> = {}): FlightInput => ({ pitch: 0, roll: 0, yaw: 0, throttle: 1, boost: false, assist: true, ...o });
// Near Earth drawn ×30: 6371 km over 72 units
const EARTH_KPU = 6371 / 72;
const space = (altUnits: number, kmPerUnit = KM_PER_UNIT): FlightEnv => ({ altitudeUnits: altUnits, kmPerUnit, airDensity: 0 });

function fly(m: FlightModel, seconds: number, inp: FlightInput, env: FlightEnv | ((m: FlightModel) => FlightEnv), dt = 1 / 60): void {
  for (let t = 0; t < seconds; t += dt) m.step(dt, inp, typeof env === 'function' ? env(m) : env);
}

describe('flight drive', () => {
  it('holds a jet-speed floor near the ground and scales the ceiling with altitude', () => {
    expect(speedFloor(EARTH_KPU) / unitsPerMps(EARTH_KPU)).toBeCloseTo(FLOOR_MPS, 6);
    const low = speedCeiling({ altitudeUnits: 1e-5, kmPerUnit: EARTH_KPU, airDensity: 0 });
    expect(low / unitsPerMps(EARTH_KPU)).toBeCloseTo(FLOOR_MPS, 3);
    const high = speedCeiling(space(1000));
    expect(high).toBeCloseTo(DRIVE_RATE * 1000, 9);
  });

  it('never runs away far from everything: the drive has an absolute limit', () => {
    expect(speedCeiling(space(1e12))).toBe(MAX_DRIVE_UNITS_PER_S);
    expect(speedCeiling(space(1000))).toBeCloseTo(DRIVE_RATE * 1000, 9);
  });

  it('caps speed in air, and the cap opens as the air thins', () => {
    const sea = speedCeiling({ altitudeUnits: 50, kmPerUnit: EARTH_KPU, airDensity: 1 }) / unitsPerMps(EARTH_KPU);
    expect(sea).toBeCloseTo(AIR_LIMIT_MPS, 3);
    const thin = speedCeiling({ altitudeUnits: 50, kmPerUnit: EARTH_KPU, airDensity: 0.01 }) / unitsPerMps(EARTH_KPU);
    expect(thin).toBeCloseTo(AIR_LIMIT_MPS * 10, 3);
  });

  it('in thick air the top speed does not follow the height over the ground', () => {
    // 30 m over a ridge, then 2 km over the valley past it: same air, same throttle, same speed
    const at = (km: number): number => speedCeiling({ altitudeUnits: km / EARTH_KPU, kmPerUnit: EARTH_KPU, airDensity: 0.7 });
    expect(at(0.03)).toBeCloseTo(at(2), 9);
    expect(throttleTarget(0.4, speedFloor(EARTH_KPU), at(0.03))).toBeCloseTo(throttleTarget(0.4, speedFloor(EARTH_KPU), at(2)), 9);
  });

  it('maps the throttle exponentially between floor and ceiling, with idle at zero', () => {
    expect(throttleTarget(0, 1, 1000)).toBe(0);
    expect(throttleTarget(1, 1, 1000)).toBeCloseTo(1000, 9);
    expect(throttleTarget(0.51, 1, 1000)).toBeCloseTo(Math.sqrt(1000), 6);
  });

  it('spools up through orders of magnitude in seconds, not instantly', () => {
    let v = 1;
    const steps: number[] = [];
    for (let i = 0; i < 600; i++) {
      v = approachSpeed(v, 1e6, 1 / 60, 0.01);
      if (i % 60 === 59) steps.push(v);
    }
    expect(steps[0]).toBeLessThan(1e4); // after 1 s, still far below
    expect(steps[9]).toBeGreaterThan(1e5); // after 10 s, nearly there
    for (let i = 1; i < steps.length; i++) expect(steps[i]).toBeGreaterThan(steps[i - 1]);
  });

  it('slows faster than an approaching surface shrinks the ceiling', () => {
    // Dive straight at a world from far out at full drive: never reaches the ground faster than the floor allows
    const m = new FlightModel();
    const R = 72;
    m.position.set(0, 0, R + 50_000);
    m.quaternion.identity(); // nose -Z: straight down at the world
    const env = (mm: FlightModel): FlightEnv => {
      const alt = Math.max(0, mm.position.length() - R);
      return { altitudeUnits: alt, kmPerUnit: localKmPerUnit(alt, R, 6371), airDensity: 0 };
    };
    m.speed = speedCeiling(env(m));
    m.velocity.set(0, 0, -m.speed);
    let worst = 0;
    for (let i = 0; i < 60 * 60; i++) {
      const e = env(m);
      m.step(1 / 60, input(), e);
      worst = Math.max(worst, m.speed / speedCeiling(e));
      if (m.position.length() - R < 0.01) break;
    }
    // The stable bound of the dive equation for SLOW_RATE 3.5, DRIVE_RATE 0.55 is r ≈ 1.24
    expect(worst).toBeLessThan(1.3);
  });

  it('crosses from Earth towards Mars in about a minute at full throttle', () => {
    const m = new FlightModel();
    m.position.set(0, 0, 0);
    const startAlt = 5; // ~440 km over Earth at ×30
    const target = 0.5 * UNITS_PER_AU;
    let t = 0;
    while (m.position.length() < target && t < 300) {
      m.step(1 / 30, input(), space(startAlt + m.position.length()));
      t += 1 / 30;
    }
    expect(t).toBeGreaterThan(15);
    expect(t).toBeLessThan(90);
  });
});

describe('flight handling', () => {
  it('flight assist turns the velocity onto the nose; with it off the jet drifts', () => {
    const env = space(100);
    const a = new FlightModel();
    a.velocity.set(0, 0, -10);
    a.speed = 10;
    a.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2); // nose now -X
    fly(a, 4, input({ throttle: 0.5 }), env);
    const dirA = a.velocity.clone().normalize();
    expect(dirA.x).toBeLessThan(-0.95);

    const b = new FlightModel();
    b.velocity.set(0, 0, -10);
    b.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    fly(b, 1, input({ throttle: 0, assist: false }), env);
    expect(b.velocity.z).toBeCloseTo(-10, 6);
    expect(b.velocity.x).toBeCloseTo(0, 9);
  });

  it('pitches nose-up for positive pitch input and limits G in air', () => {
    const m = new FlightModel();
    const kpu = EARTH_KPU;
    const v = 300 * unitsPerMps(kpu);
    m.velocity.set(0, 0, -v);
    m.speed = v;
    const env: FlightEnv = { altitudeUnits: 0.2, kmPerUnit: kpu, airDensity: 0.5 };
    // The load builds at the onset limit, so the nose comes up over the first half second
    fly(m, 0.6, input({ pitch: 1, throttle: 0.6 }), env);
    expect(m.forward().y).toBeGreaterThan(0.05);
    const pitchRate = m.rates.x;
    expect(pitchRate * 300).toBeLessThanOrEqual(G_LIMIT * 9.80665 * 1.01);
  });

  it('builds the load no faster than the onset limit', () => {
    const m = new FlightModel();
    const kpu = EARTH_KPU;
    const v = 250 * unitsPerMps(kpu);
    m.velocity.set(0, 0, -v);
    m.speed = v;
    const env: FlightEnv = { altitudeUnits: 0.2, kmPerUnit: kpu, airDensity: 0.8 };
    for (let i = 0; i < 6; i++) m.step(1 / 60, input({ pitch: 1, throttle: 0.6 }), env);
    // 0.1 s at 14 g/s: at most ~1.4 g of turn so far
    expect((m.rates.x * 250) / 9.80665).toBeLessThanOrEqual(G_ONSET * 0.1 * 1.05);
  });

  it('bleeds speed in a sustained hard turn', () => {
    const m = new FlightModel();
    const kpu = EARTH_KPU;
    const v = 260 * unitsPerMps(kpu);
    m.velocity.set(0, 0, -v);
    m.speed = v;
    const env: FlightEnv = { altitudeUnits: 0.2, kmPerUnit: kpu, airDensity: 0.8 };
    fly(m, 6, input({ pitch: 1, throttle: 0.6 }), env);
    expect(m.speed / unitsPerMps(kpu)).toBeLessThan(255);
  });

  it('flies a cobra: the nose past 60 degrees up, then back, shedding speed', () => {
    const m = new FlightModel();
    const kpu = EARTH_KPU;
    const v = 200 * unitsPerMps(kpu);
    m.velocity.set(0, 0, -v);
    m.speed = v;
    const env: FlightEnv = { altitudeUnits: 0.2, kmPerUnit: kpu, airDensity: 0.8 };
    m.step(1 / 60, input({ throttle: 0.6, cobra: true }), env);
    expect(m.cobraT).toBeGreaterThanOrEqual(0);
    fly(m, COBRA_TIME * 0.5, input({ throttle: 0.6 }), env);
    expect(m.forward().y).toBeGreaterThan(Math.sin((60 * Math.PI) / 180));
    fly(m, COBRA_TIME * 0.6, input({ throttle: 0.6 }), env);
    expect(m.cobraT).toBe(-1);
    expect(Math.abs(m.forward().y)).toBeLessThan(0.2);
    expect(m.speed / unitsPerMps(kpu)).toBeLessThan(170);
  });

  it('boost pushes past the ceiling and drains its energy, then recharges', () => {
    const m = new FlightModel();
    const env = space(100);
    m.speed = speedCeiling(env);
    m.velocity.set(0, 0, -m.speed);
    fly(m, 4, input({ boost: true }), env);
    expect(m.speed).toBeGreaterThan(speedCeiling(env) * 1.5);
    expect(m.boostEnergy).toBeLessThan(0.5);
    const e = m.boostEnergy;
    fly(m, 2, input({ boost: false }), env);
    expect(m.boostEnergy).toBeGreaterThan(e);
  });
});

describe('flight in air, like a real fighter', () => {
  // Low level over Earth drawn ×30: 1 km up, sea-level-ish air
  const low: FlightEnv = { altitudeUnits: 1 / EARTH_KPU, kmPerUnit: EARTH_KPU, airDensity: 0.9 };
  const mps = (m: FlightModel): number => m.speed / unitsPerMps(EARTH_KPU);

  it('tops out near 380 m/s on military power and about 1.6x that on afterburner', () => {
    const dry = new FlightModel();
    fly(dry, 60, input({ throttle: 1 }), low);
    expect(mps(dry)).toBeGreaterThan(330);
    expect(mps(dry)).toBeLessThan(420);
    const ab = new FlightModel();
    ab.speed = dry.speed;
    ab.velocity.copy(dry.velocity);
    fly(ab, 6, input({ throttle: 1, boost: true }), low);
    expect(mps(ab)).toBeGreaterThan(mps(dry) + 50);
    expect(mps(ab)).toBeLessThan(380 * 1.6 * 1.05);
  });

  it('accelerates at real rates in air: tens of seconds, not an instant', () => {
    const m = new FlightModel();
    m.speed = 150 * unitsPerMps(EARTH_KPU);
    m.velocity.set(0, 0, -m.speed);
    fly(m, 5, input({ throttle: 1 }), low);
    const gained = mps(m) - 150;
    expect(gained).toBeGreaterThan(50); // ~14 m/s² dry
    expect(gained).toBeLessThan(90);
  });

  it('keeps the full drive in vacuum', () => {
    const m = new FlightModel();
    expect(m.boostFactor(0)).toBeCloseTo(3.5, 9);
    expect(m.boostFactor(1)).toBeCloseTo(1.6, 9);
  });
});

describe('flight environment', () => {
  it('thins the air exponentially and ends it at the top', () => {
    const p = AIR.Earth;
    expect(airDensity(0, p.scaleHeightKm, p.topKm)).toBeCloseTo(1, 9);
    expect(airDensity(p.scaleHeightKm, p.scaleHeightKm, p.topKm)).toBeCloseTo(Math.exp(-1), 9);
    expect(airDensity(p.topKm, p.scaleHeightKm, p.topKm)).toBe(0);
    expect(airDensity(10, 0, 100)).toBe(0);
  });

  it('uses the world scale close in and the true scale far out', () => {
    expect(localKmPerUnit(1, 72, 6371)).toBeCloseTo(6371 / 72, 6);
    expect(localKmPerUnit(72 * 100, 72, 6371)).toBeCloseTo(KM_PER_UNIT, 6);
    const mid = localKmPerUnit(72 * 20, 72, 6371);
    expect(mid).toBeGreaterThan(6371 / 72);
    expect(mid).toBeLessThan(KM_PER_UNIT);
  });

  it('measures the gap to a world on its own scale close in and the true scale far out', () => {
    // Moon drawn ×30 (radius 1737 km over 19.6 units); Earth–Moon centre distance is true
    const R = 19.6;
    expect(gapKm(R + 0.1, R, 1737)).toBeCloseTo(0.1 * (1737 / R), 6);
    const earthMoonUnits = 384_400 / KM_PER_UNIT;
    expect(gapKm(earthMoonUnits, R, 1737)).toBeCloseTo(384_400 - 1737, 0);
  });

  it('keeps the jet above a surface and kills only the inward velocity', () => {
    const pos = new THREE.Vector3(0, 9, 0);
    const vel = new THREE.Vector3(3, -4, 0);
    const hit = resolveSurfaceContact(pos, vel, new THREE.Vector3(), 10, 0.5);
    expect(hit).toBeCloseTo(4, 9);
    expect(pos.y).toBeCloseTo(10.5, 9);
    expect(vel.x).toBeCloseTo(3, 9);
    expect(vel.y).toBeCloseTo(0, 9);
    expect(resolveSurfaceContact(new THREE.Vector3(0, 20, 0), vel, new THREE.Vector3(), 10, 0.5)).toBe(0);
  });
});

describe('flight readouts', () => {
  it('writes speeds in m/s, km/s and c', () => {
    expect(formatSpeed(245)).toBe('245 m/s');
    expect(formatSpeed(7660)).toBe('7.66 km/s');
    expect(formatSpeed(29_800)).toBe('29.8 km/s');
    expect(formatSpeed(0.37 * 299_792_458)).toBe('0.37 c');
    expect(formatSpeed(48.2 * 299_792_458)).toBe('48.2 c');
  });

  it('writes distances in m, km, million km and AU', () => {
    expect(formatDistance(0.35)).toBe('350 m');
    expect(formatDistance(12.34)).toBe('12.3 km');
    expect(formatDistance(384_400)).toBe('384,400 km');
    expect(formatDistance(5.5e6)).toBe('5.50 M km');
    expect(formatDistance(1.52 * 149_597_870.7)).toBe('1.52 AU');
    expect(formatDistance(26_000 * 9.4607e12)).toBe('26,000 ly');
  });

  it('writes arrival times', () => {
    expect(formatEta(42)).toBe('42 s');
    expect(formatEta(600)).toBe('10 min');
    expect(formatEta(Infinity)).toBe('—');
  });
});
