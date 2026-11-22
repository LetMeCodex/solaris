import { describe, it, expect, afterEach } from 'vitest';
import * as THREE from 'three';
import { generateCloudNoise } from '../rendering/cloudNoiseGenerator';
import { VolumetricCloudPass } from '../rendering/VolumetricClouds';
import { EarthClouds } from '../flight/EarthClouds';
import { earthElevation } from '../explorer/Elevation';

async function waitForNoise(pass: VolumetricCloudPass, timeoutMs = 4000): Promise<void> {
  const start = Date.now();
  while (!pass.isNoiseReady() && Date.now() - start < timeoutMs) {
    await new Promise((r) => setTimeout(r, 25));
  }
}

describe('CloudSea volumetric clouds port', () => {
  const passes: VolumetricCloudPass[] = [];
  const prevDisabled = earthElevation.disabled;

  afterEach(() => {
    earthElevation.disabled = prevDisabled;
    while (passes.length > 0) passes.pop()?.dispose();
  });

  it('generates deterministic 4-channel 3D Perlin + multi-octave Worley noise', () => {
    const a = generateCloudNoise(16);
    const b = generateCloudNoise(16);
    expect(a.data.length).toBe(16 * 16 * 16 * 4);
    expect(a.mean).toBeGreaterThan(0.35);
    expect(a.mean).toBeLessThan(0.65);
    expect(a.data).toEqual(b.data);

    const stats = [0, 1, 2, 3].map((ch) => {
      let min = 255;
      let max = 0;
      for (let i = ch; i < a.data.length; i += 4) {
        if (a.data[i] < min) min = a.data[i];
        if (a.data[i] > max) max = a.data[i];
      }
      return max - min;
    });
    for (const span of stats) expect(span).toBeGreaterThan(80);
  });

  it('configures VolumetricCloudPass with CloudSea uniforms and warms noise texture asynchronously', async () => {
    const pass = new VolumetricCloudPass(0.5);
    passes.push(pass);
    expect(pass.u.uDeck.value).toBeCloseTo(0.84, 2);
    expect(pass.u.tNoise.value).toBeInstanceOf(THREE.Data3DTexture);
    expect(pass.isNoiseReady()).toBe(false);

    pass.warm();
    await waitForNoise(pass);
    expect(pass.isNoiseReady()).toBe(true);
    expect(pass.u.tNoise.value.image.width).toBe(64);
  });

  it('drives CloudSea tangent basis and weather presets immediately via EarthClouds', async () => {
    earthElevation.disabled = true;
    const pass = new VolumetricCloudPass(0.5);
    passes.push(pass);
    const clouds = new EarthClouds(pass);
    await waitForNoise(pass);

    const surface = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8));
    surface.updateWorldMatrix(true, false);
    const centre = new THREE.Vector3(0, 0, 0);
    const cam = new THREE.PerspectiveCamera(60, 16 / 9, 0.001, 10000);
    const kmPerUnit = 6378.137;
    cam.position.set(1 + 2 / kmPerUnit, 0, 0);
    const sunDir = new THREE.Vector3(1, 0.4, 0.2).normalize();

    clouds.update(true, surface, centre, cam, 0, 0, 2, kmPerUnit, sunDir, 'auto', 0);
    expect(pass.enabled).toBe(true);
    // Sculpted cumulus deck in fair/auto weather keeps landmarks visible below (0.2..0.55)
    expect(pass.layer.deck).toBeGreaterThan(0.2);
    expect(pass.layer.deck).toBeLessThan(0.6);
    expect(pass.layer.topKm).toBeGreaterThan(pass.layer.baseKm + 1.5);
    expect(Math.abs(pass.u.uPatchEast.value.dot(pass.u.uPatchNorth.value))).toBeLessThan(1e-5);

    clouds.update(true, surface, centre, cam, 0, 0, 2, kmPerUnit, sunDir, 'storm', 0.8);
    expect(pass.u.uFlash.value).toBeCloseTo(0.8, 3);

    clouds.update(false, surface, centre, cam, 0, 0, 2, kmPerUnit, sunDir);
    expect(pass.enabled).toBe(false);
    clouds.dispose();
  });
});
