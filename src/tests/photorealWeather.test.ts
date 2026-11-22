import { describe, it, expect, afterEach } from 'vitest';
import * as THREE from 'three';
import { computeAuroraIntensity, geomagneticLatitudeDeg } from '../flight/SpaceWeather';
import { EarthClouds } from '../flight/EarthClouds';
import { VolumetricCloudPass } from '../rendering/VolumetricClouds';
import {
  GROUND_SNOW,
  GROUND_WETNESS,
  SKY_AURORA,
  SKY_CIRRUS,
  SKY_RAINBOW,
  SKY_STORM_TINT,
  VALLEY_FOG,
} from '../rendering/AerialPerspective';
import { earthElevation } from '../explorer/Elevation';
import { getLandmark } from '../explorer/Landmarks';
import { Weather } from '../flight/Weather';

describe('Photorealistic Global Weather, Space Weather & Reference Landmarks', () => {
  const passes: VolumetricCloudPass[] = [];
  const prevDisabled = earthElevation.disabled;

  afterEach(() => {
    earthElevation.disabled = prevDisabled;
    while (passes.length > 0) passes.pop()?.dispose();
  });

  it('computes real geomagnetic auroral oval visibility for Lofoten vs Equator and expands with Kp', () => {
    const lofotenMag = geomagneticLatitudeDeg(67.9325, 13.0886);
    expect(lofotenMag).toBeGreaterThan(64);
    expect(lofotenMag).toBeLessThan(71);

    // Night over Lofoten at moderate Kp=3 produces vibrant aurora curtains
    const lofotenNight = computeAuroraIntensity(67.9325, 13.0886, 3.0, -0.22);
    expect(lofotenNight).toBeGreaterThan(0.5);

    // Daytime over Lofoten has zero aurora (drowned by sunlight)
    expect(computeAuroraIntensity(67.9325, 13.0886, 6.0, 0.25)).toBe(0);

    // Mid-low latitude (New Delhi 28.6°N) has negligible aurora at quiet Kp=3
    expect(computeAuroraIntensity(28.6129, 77.2295, 3.0, -0.25)).toBeLessThan(0.01);

    // Strong geomagnetic storm (Kp=7) expands auroral oval further south (e.g. Scotland 57°N)
    const scotlandQuiet = computeAuroraIntensity(57.2, -3.5, 1.0, -0.25);
    const scotlandStorm = computeAuroraIntensity(57.2, -3.5, 7.0, -0.25);
    expect(scotlandStorm).toBeGreaterThan(scotlandQuiet + 0.35);
  });

  it('drives live snow, PBR rain wetness, double rainbow, storm tint, cirrus, and aurora uniforms cleanly', async () => {
    earthElevation.disabled = true;
    const pass = new VolumetricCloudPass(0.5);
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
    cam.position.set(1 + 1.2 / kmPerUnit, 0, 0);

    // Sunlit rain triggers wetness + physically-based 42°/51° double rainbow immediately on frame 1
    const lowSunDir = new THREE.Vector3(0.32, 0.94, 0).normalize();
    clouds.update(true, surface, centre, cam, 48.2, 1.5, 1.2, kmPerUnit, lowSunDir, 'rain', 0);
    expect(GROUND_WETNESS.value).toBeGreaterThan(0.5);
    expect(SKY_RAINBOW.value).toBeGreaterThan(0.5);
    expect(SKY_CIRRUS.value).toBeGreaterThan(0.1);

    // Snow mode drives slope-masked winter snow cover (reset via hide so new location snaps cleanly)
    clouds.hide();
    clouds.update(true, surface, centre, cam, 46.59, 7.91, 1.2, kmPerUnit, lowSunDir, 'snow', 0);
    expect(GROUND_SNOW.value).toBeGreaterThan(0.5);

    // Storm mode drives supercell teal-green tint + wetness
    clouds.hide();
    clouds.update(true, surface, centre, cam, 48.2, 1.5, 1.2, kmPerUnit, lowSunDir, 'storm', 0.9);
    expect(SKY_STORM_TINT.value).toBeGreaterThan(0.5);

    // Polar night over Reine, Lofoten activates live NOAA Kp aurora curtains
    clouds.hide();
    const nightSunDir = new THREE.Vector3(-0.6, 0.8, 0).normalize();
    clouds.update(true, surface, centre, cam, 67.9325, 13.0886, 1.2, kmPerUnit, nightSunDir, 'clear', 0);
    expect(SKY_AURORA.value).toBeGreaterThan(0.4);

    clouds.hide();
    expect(SKY_AURORA.value).toBe(0);
    expect(SKY_RAINBOW.value).toBe(0);
    expect(SKY_STORM_TINT.value).toBe(0);
    expect(GROUND_SNOW.value).toBe(0);
    expect(GROUND_WETNESS.value).toBe(0);
    expect(VALLEY_FOG.value).toBe(0);
    clouds.dispose();
  });

  it('spawns 3D branching forked lightning bolts during thunderstorm flashes without error', () => {
    const prevDoc = (globalThis as { document?: unknown }).document;
    const grad = { addColorStop: () => {} };
    (globalThis as { document?: unknown }).document = {
      createElement: () => ({
        width: 128,
        height: 128,
        getContext: () => ({
          createRadialGradient: () => grad,
          fillStyle: '',
          fillRect: () => {},
        }),
      }),
    };
    try {
      const wx = new Weather();
      wx.mode = 'storm';
      const cam = new THREE.PerspectiveCamera(60, 16 / 9, 0.1, 1000);
      const up = new THREE.Vector3(0, 1, 0);
      const vel = new THREE.Vector3(0, 0, -220);
      let sawFlash = false;
      for (let i = 0; i < 120; i++) {
        const st = wx.update(0.1, i * 0.1, {
          world: 'Earth',
          latDeg: 48.2,
          lonDeg: 1.5,
          altKm: 1.5,
          airDensity: 0.85,
          daylight: 0.7,
          airVelMps: vel,
          up,
          camera: cam,
          inside: false,
          hourIndex: 14,
        });
        if (st.flash > 0.1) sawFlash = true;
      }
      expect(sawFlash).toBe(true);
      wx.dispose();
    } finally {
      (globalThis as { document?: unknown }).document = prevDoc;
    }
  });

  it('includes iconic global weather & seasonal showcase landmarks (Lofoten, Lauterbrunnen, New Delhi)', () => {
    expect(getLandmark('earth-lofoten')?.name).toContain('Lofoten');
    expect(getLandmark('earth-lauterbrunnen')?.name).toContain('Lauterbrunnen');
    expect(getLandmark('earth-new-delhi')?.name).toContain('New Delhi');
    expect(getLandmark('earth-uluru')).toBeDefined();
    expect(getLandmark('earth-yosemite')).toBeDefined();
    expect(getLandmark('earth-fuji')).toBeDefined();
  });
});
