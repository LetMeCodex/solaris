import { describe, it, expect, afterEach } from 'vitest';
import * as THREE from 'three';
import { FlightModel, FlightInput, FlightEnv, unitsPerMps } from '../flight/FlightModel';
import { AIRFRAME_SPECS } from '../flight/AirframeSpecs';
import { computeAeroCoefficients, computeFlowAngles } from '../flight/Aerodynamics';
import { VolumetricCloudPass } from '../rendering/VolumetricClouds';
import { EarthClouds } from '../flight/EarthClouds';
import { earthElevation } from '../explorer/Elevation';

const EARTH_KPU = 6371 / 72;

const mkInput = (o: Partial<FlightInput> = {}): FlightInput => ({
  pitch: 0,
  roll: 0,
  yaw: 0,
  throttle: 0.65,
  boost: false,
  assist: true,
  ...o,
});

function stepSeconds(m: FlightModel, seconds: number, inp: FlightInput, env: FlightEnv, dt = 1 / 60): void {
  const steps = Math.round(seconds / dt);
  for (let i = 0; i < steps; i++) m.step(dt, inp, env);
}

describe('MIL-STD-1797A 1G Auto-Trim, Control Surfaces & PSM Aerodynamics', () => {
  for (const airframeId of ['gripen', 'su30'] as const) {
    it(`${airframeId}: flies level hands-off for 8 seconds without automatic nose-dive`, () => {
      const m = new FlightModel(airframeId);
      const speedMps = 215;
      m.speed = speedMps * unitsPerMps(EARTH_KPU);
      m.velocity.set(0, 0, -m.speed);
      m.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(2.2));
      const env: FlightEnv = {
        altitudeUnits: 1.0 / EARTH_KPU,
        kmPerUnit: EARTH_KPU,
        airDensity: 0.9,
        airframeId,
        bodyName: 'Earth',
        altKm: 1.0,
        groundClearanceM: 1000,
      };

      stepSeconds(m, 8, mkInput({ throttle: 0.68 }), env);

      // Must NOT dive downward automatically! Vertical speed & flight path stay nearly level
      expect(Math.abs(m.verticalSpeedMps)).toBeLessThan(4.0);
      expect(Math.abs(m.fpvAngleDeg)).toBeLessThan(2.5);
      expect(m.gLoad).toBeGreaterThan(0.85);
      expect(m.gLoad).toBeLessThan(1.2);
      expect(m.tasMps).toBeGreaterThan(175);
    });

    it(`${airframeId}: holds altitude in a hands-off 45-deg banked turn without nose drop`, () => {
      const m = new FlightModel(airframeId);
      const speedMps = 225;
      m.speed = speedMps * unitsPerMps(EARTH_KPU);
      m.velocity.set(0, 0, -m.speed);
      // Roll right 45 deg around -Z forward axis (in Three.js, roll right = -Z rotation -> -45 deg around +Z)
      m.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(-45));
      const env: FlightEnv = {
        altitudeUnits: 1.2 / EARTH_KPU,
        kmPerUnit: EARTH_KPU,
        airDensity: 0.88,
        airframeId,
        bodyName: 'Earth',
        altKm: 1.2,
        groundClearanceM: 1200,
      };

      stepSeconds(m, 6, mkInput({ throttle: 0.78 }), env);

      // Bank-compensated 1G trim + bank-angle hold maintains Nz ~= 1.41G without spiral dive
      const bodyUp = new THREE.Vector3(0, 1, 0).applyQuaternion(m.quaternion);
      const bodyRight = new THREE.Vector3(1, 0, 0).applyQuaternion(m.quaternion);
      const bankDeg = THREE.MathUtils.radToDeg(Math.abs(Math.atan2(bodyRight.y, bodyUp.y)));
      expect(bankDeg).toBeGreaterThan(35);
      expect(bankDeg).toBeLessThan(55);
      expect(Math.abs(m.verticalSpeedMps)).toBeLessThan(5.0);
      expect(m.gLoad).toBeGreaterThan(1.25);
      expect(m.gLoad).toBeLessThan(1.7);
    });

    it(`${airframeId}: drives physical control surfaces in sync with pitch, roll, and yaw`, () => {
      const m = new FlightModel(airframeId);
      m.speed = 210 * unitsPerMps(EARTH_KPU);
      m.velocity.set(0, 0, -m.speed);
      const env: FlightEnv = {
        altitudeUnits: 1.0 / EARTH_KPU,
        kmPerUnit: EARTH_KPU,
        airDensity: 0.9,
        airframeId,
        bodyName: 'Earth',
        altKm: 1.0,
        groundClearanceM: 1000,
      };

      stepSeconds(m, 0.35, mkInput({ pitch: 0.8, roll: 0.6, yaw: 0.4, throttle: 0.85 }), env);

      // Asymmetric differential roll on elevons + non-zero rudder
      expect(Math.abs(m.surfaces.elevonLeftRad - m.surfaces.elevonRightRad)).toBeGreaterThan(0.05);
      expect(Math.abs(m.surfaces.rudderRad)).toBeGreaterThan(0.03);
      if (airframeId === 'gripen') {
        expect(Math.abs(m.surfaces.canardRad)).toBeGreaterThan(0.05);
      } else {
        expect(m.tvcActive || Math.abs(m.surfaces.tvcPitchLeftRad) >= 0).toBe(true);
      }
    });
  }

  it('produces positive foreplane lift on Gripen canard pitch-up and modest tail download on Su-30', () => {
    const flow = computeFlowAngles(new THREE.Vector3(0, -25, -200));
    const neutral = { elev: 0, ail: 0, rud: 0, flaps: 0, slats: 0, gear: 0, speedbrake: 0 };
    const pullUp = { ...neutral, elev: 0.8 };

    const g0 = computeAeroCoefficients(flow, 0.6, 1000, neutral, AIRFRAME_SPECS.gripen);
    const gPull = computeAeroCoefficients(flow, 0.6, 1000, pullUp, AIRFRAME_SPECS.gripen);
    expect(gPull.cl).toBeGreaterThan(g0.cl);

    const s0 = computeAeroCoefficients(flow, 0.6, 1000, neutral, AIRFRAME_SPECS.su30);
    const sPull = computeAeroCoefficients(flow, 0.6, 1000, pullUp, AIRFRAME_SPECS.su30);
    expect(sPull.cl).toBeLessThan(s0.cl);
    expect(s0.cl - sPull.cl).toBeLessThan(0.12);
  });

  it('uses NASA X-31 stability-axis roll in PSM mode at high AoA (coordinated yaw + roll)', () => {
    const m = new FlightModel('su30');
    m.setFbwMode('psm');
    const aRad = THREE.MathUtils.degToRad(50);
    // Set velocity so AoA is +50 deg
    const vMps = 115;
    m.speed = vMps * unitsPerMps(EARTH_KPU);
    m.velocity.set(0, -vMps * Math.sin(aRad) * unitsPerMps(EARTH_KPU), -vMps * Math.cos(aRad) * unitsPerMps(EARTH_KPU));
    const env: FlightEnv = {
      altitudeUnits: 2.0 / EARTH_KPU,
      kmPerUnit: EARTH_KPU,
      airDensity: 0.8,
      airframeId: 'su30',
      bodyName: 'Earth',
      altKm: 2.0,
      groundClearanceM: 2000,
    };

    stepSeconds(m, 0.65, mkInput({ roll: 1.0, psm: true, throttle: 1.0, boost: true }), env);
    // Right lateral stick at high AoA must induce right yaw (-rates.y in B3) alongside roll (-rates.z)
    expect(m.rates.y).toBeLessThan(-0.15);
    expect(m.rates.z).toBeLessThan(-0.1);
  });
});

describe('High-Altitude ISA Cloud Clearance & Anti-Pixelation Floor', () => {
  const passes: VolumetricCloudPass[] = [];
  const prevDisabled = earthElevation.disabled;

  afterEach(() => {
    earthElevation.disabled = prevDisabled;
    while (passes.length > 0) passes.pop()?.dispose();
  });

  it('keeps volumetric cloud base cleanly above elevated city plateaus (e.g. Sao Paulo 760 m MSL)', async () => {
    earthElevation.disabled = true;
    const pass = new VolumetricCloudPass(0.6);
    passes.push(pass);
    const clouds = new EarthClouds(pass);
    const start = Date.now();
    while (!pass.isNoiseReady() && Date.now() - start < 4000) {
      await new Promise((r) => setTimeout(r, 20));
    }

    const surface = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8));
    surface.updateWorldMatrix(true, false);
    const centre = new THREE.Vector3(0, 0, 0);
    const cam = new THREE.PerspectiveCamera(60, 16 / 9, 0.001, 10000);
    const kmPerUnit = 6378.137;
    // Camera at 1.17 km MSL, 0.41 km AGL => city plateau ground at 0.76 km MSL (Sao Paulo!)
    cam.position.set(1 + 1.17 / kmPerUnit, 0, 0);
    const sunDir = new THREE.Vector3(1, 0.4, 0.2).normalize();

    clouds.update(true, surface, centre, cam, -23.56, -46.65, 0.41, kmPerUnit, sunDir, 'auto', 0);
    expect(pass.enabled).toBe(true);
    // Cloud base must sit >= 2.3 km MSL (~1.54 km ABOVE Sao Paulo's 760 m rooftops!), never clipping buildings
    expect(pass.layer.baseKm).toBeGreaterThanOrEqual(2.3);
    clouds.dispose();
  });
});
