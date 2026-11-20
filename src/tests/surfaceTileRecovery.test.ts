import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { SurfaceTileLayer, type TileImageLoader } from '../explorer/SurfaceTileLayer';
import { BODY_IMAGERY } from '../explorer/ImageryRegistry';
import type { ElevationSource } from '../explorer/PlanetElevation';

class Images implements TileImageLoader {
  urls: string[] = [];
  pending: Array<() => void> = [];
  load(url: string, onLoad: (image: HTMLImageElement) => void): HTMLImageElement {
    this.urls.push(url);
    const image = { src: url, width: 256, height: 256, naturalWidth: 256, naturalHeight: 256, complete: true } as HTMLImageElement;
    this.pending.push(() => onLoad(image));
    return image;
  }
}

const camera = { position: [0, 0, -1.0001] as [number, number, number], pixelsPerRadian: 900 };

describe('Surface tile recovery', () => {
  it('does not compete with photogrammetry for deep imagery while acting as an underlay', () => {
    const images = new Images();
    const layer = new SurfaceTileLayer(BODY_IMAGERY.Moon.provider!, images);
    layer.setUnderlay(true);
    layer.update(camera);
    expect(images.urls.length).toBeGreaterThan(0);
    expect(images.urls.every(url => Number(url.split('/').at(-3)) <= 7)).toBe(true);
    layer.dispose();
  });
  it('requests a global ancestor first even when arriving directly at a deep zoom', () => {
    const images = new Images();
    const layer = new SurfaceTileLayer(BODY_IMAGERY.Moon.provider!, images);
    layer.update(camera);
    const zooms = images.urls.map(url => Number(url.split('/').at(-3)));
    expect(Math.min(...zooms)).toBe(0);
    expect(zooms[0]).toBe(0);
    layer.dispose();
  });

  it('keeps cached imagery visible while recovered DEM data prepares a replacement mesh', async () => {
    const images = new Images();
    const layer = new SurfaceTileLayer(BODY_IMAGERY.Moon.provider!, images);
    let finish!: () => void;
    const elevation: ElevationSource = {
      disabled: true, zoomFor: () => 3, heightKm: () => 2,
      ensure: () => new Promise<void>(resolve => { finish = resolve; }),
    };
    layer.elevation = elevation;
    layer.radiusKm = 1737.4;
    layer.update(camera);
    images.pending.shift()!();
    layer.update(camera);
    const old = layer.group.children.find(mesh => mesh.visible) as THREE.Mesh;
    expect(old).toBeDefined();
    const urlsBefore = [...images.urls];
    elevation.disabled = false;
    layer.update(camera);
    expect(old.visible).toBe(true);
    expect(layer.group.children).toContain(old);
    expect(images.urls).toEqual(urlsBefore);
    finish();
    await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    expect(layer.group.children).not.toContain(old);
    const replacement = layer.group.children.find(mesh => mesh.visible) as THREE.Mesh;
    expect(replacement).toBeDefined();
    expect((replacement.material as THREE.ShaderMaterial).uniforms.map.value).toBe((old.material as THREE.ShaderMaterial).uniforms.map.value);
    layer.dispose();
  });

  it('keeps height-grid strides stable through a provider cooldown and rejects nonfinite heights', async () => {
    const images = new Images();
    const layer = new SurfaceTileLayer(BODY_IMAGERY.Moon.provider!, images);
    const elevation: ElevationSource = {
      disabled: false, zoomFor: () => 3, heightKm: () => NaN, ensure: () => Promise.resolve(),
    };
    layer.elevation = elevation;
    layer.radiusKm = 1737.4;
    layer.update(camera);
    images.pending.shift()!();
    await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    elevation.disabled = true;
    layer.update(camera);
    const mesh = layer.group.children.find(child => child.visible) as THREE.Mesh;
    expect(mesh).toBeDefined();
    const positions = mesh.geometry.attributes.position.array;
    expect([...positions].every(Number.isFinite)).toBe(true);
    // Stored relief is a 32 × 32 grid on the default high test tier, not a new flat 48 × 48 grid.
    expect(mesh.geometry.index!.array.every(i => i < mesh.geometry.attributes.position.count)).toBe(true);
    layer.dispose();
  });
});
