import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { SurfaceTileLayer, TILE_LEVEL_LIFT, TILE_SHELL, type TileImageLoader } from '../explorer/SurfaceTileLayer';
import { bodyLatLonToLocal, selectTiles, tileId } from '../explorer/TileMath';
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

  it('streams and displays the nearest detailed tile while siblings are pending', async () => {
    const images = new Images();
    const provider = BODY_IMAGERY.Moon.provider!;
    const layer = new SurfaceTileLayer(provider, images);
    const pendingDem: Array<() => void> = [];
    layer.elevation = {
      disabled: false, zoomFor: () => 3, heightKm: () => 2,
      ensure: () => new Promise<void>(resolve => pendingDem.push(resolve)),
    };
    layer.radiusKm = 1737.4;
    const nearest = selectTiles(provider, camera, 1.3, 160)[0];
    layer.update(camera);
    expect(images.urls[1]).toContain(`/${nearest.z}/${nearest.y}/${nearest.x}.`);
    images.pending[0]();
    pendingDem.shift()!();
    await Promise.resolve(); await Promise.resolve();
    images.pending[1]();
    layer.update(camera);
    const visible = () => layer.group.children.filter(mesh => mesh.visible).map(mesh => mesh.name);
    const leaf = `tile_${tileId(nearest)}`;
    expect(visible().length).toBeGreaterThan(0);
    expect(visible()).not.toContain(leaf);
    pendingDem.shift()!();
    await Promise.resolve(); await Promise.resolve();
    layer.update(camera);
    expect(visible()).toContain(leaf);
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

  it('anchors tiles to exact 1.0 + elevKm / radiusKm with FrontSide polygonOffset and non-protruding skirts', async () => {
    expect(TILE_SHELL).toBe(1.0);
    expect(TILE_LEVEL_LIFT).toBe(0);
    const images = new Images();
    const layer = new SurfaceTileLayer(BODY_IMAGERY.Earth.provider!, images);
    const elevKm = 4.2;
    layer.bodyName = 'Earth';
    layer.radiusKm = 6371;
    layer.elevation = {
      disabled: false,
      zoomFor: () => 8,
      heightKm: () => elevKm,
      ensure: () => Promise.resolve(),
    };
    const [sx, sy, sz] = bodyLatLonToLocal('Earth', 27.9883, 86.9253);
    const cam = { position: [sx * 1.003, sy * 1.003, sz * 1.003] as [number, number, number], pixelsPerRadian: 900, bodyName: 'Earth' };
    layer.update(cam);
    images.pending.shift()!();
    await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    layer.update(cam);

    const mesh = layer.group.children.find(child => child.visible) as THREE.Mesh;
    expect(mesh).toBeDefined();
    const mat = mesh.material as THREE.ShaderMaterial;
    expect(mat.side).toBe(THREE.FrontSide);
    expect(mat.polygonOffset).toBe(true);

    const expectedR = 1.0 + elevKm / 6371;
    const pos = mesh.geometry.attributes.position as THREE.BufferAttribute;
    let maxR = 0;
    let minTopR = Infinity;
    let minSkirtR = Infinity;
    // Mercator relief tile is 33×33 surface vertices; remaining vertices are radially dropped skirts (<= 120 m)
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i) + mesh.position.x;
      const vy = pos.getY(i) + mesh.position.y;
      const vz = pos.getZ(i) + mesh.position.z;
      const r = Math.hypot(vx, vy, vz);
      maxR = Math.max(maxR, r);
      if (i < 33 * 33) minTopR = Math.min(minTopR, r);
      else minSkirtR = Math.min(minSkirtR, r);
    }
    // Every surface vertex sits at exact 1.0 + elevKm / radiusKm (never floating +637 m above globe!)
    expect(Math.abs(maxR - expectedR) * 6371_000).toBeLessThan(1.0);
    expect(Math.abs(minTopR - expectedR) * 6371_000).toBeLessThan(1.0);
    // Skirts drop strictly downward by <= 120 m (never hanging multi-km curtains!)
    expect((expectedR - minSkirtR) * 6371_000).toBeGreaterThanOrEqual(3.5);
    expect((expectedR - minSkirtR) * 6371_000).toBeLessThanOrEqual(125);
    layer.dispose();
  });

  it('renders parent-cropped UV fallback immediately on relief tiles and hot-swaps native texture on arrival', async () => {
    const images = new Images();
    const provider = BODY_IMAGERY.Earth.provider!;
    const layer = new SurfaceTileLayer(provider, images);
    layer.bodyName = 'Earth';
    layer.radiusKm = 6371;
    layer.elevation = {
      disabled: false,
      zoomFor: () => 8,
      heightKm: () => 1.5,
      hasCoverage: () => true,
      ensure: () => Promise.resolve(),
    };
    const [sx, sy, sz] = bodyLatLonToLocal('Earth', 37.8199, -122.4783);
    const cam = { position: [sx * 1.001, sy * 1.001, sz * 1.001] as [number, number, number], pixelsPerRadian: 900, bodyName: 'Earth' };
    layer.update(cam);
    // Resolve ONLY the z=0 global anchor image; leaf imagery stays pending
    images.pending[0]();
    await Promise.resolve(); await Promise.resolve();
    layer.update(cam);

    const visibleMeshes = layer.group.children.filter(c => c.visible) as THREE.Mesh[];
    expect(visibleMeshes.length).toBeGreaterThan(0);
    const croppedLeaf = visibleMeshes.find(m => {
      const rect = (m.material as THREE.ShaderMaterial).uniforms.uUvRect.value as THREE.Vector4;
      return rect.z < 1 || rect.w < 1;
    });
    expect(croppedLeaf).toBeDefined();
    const croppedTexBefore = (croppedLeaf!.material as THREE.ShaderMaterial).uniforms.map.value;

    // Now finish the leaf's own image request (index 1) and verify zero-rebuild hot-swap to uUvRect=(0,0,1,1)
    const leafUrlIdx = images.urls.findIndex(u => u.includes(`/${croppedLeaf!.name.replace('tile_', '')}`));
    if (leafUrlIdx >= 0 && images.pending[leafUrlIdx]) {
      images.pending[leafUrlIdx]();
      await Promise.resolve(); await Promise.resolve();
      layer.update(cam);
      const rectAfter = (croppedLeaf!.material as THREE.ShaderMaterial).uniforms.uUvRect.value as THREE.Vector4;
      expect(rectAfter.x).toBe(0);
      expect(rectAfter.y).toBe(0);
      expect(rectAfter.z).toBe(1);
      expect(rectAfter.w).toBe(1);
      expect((croppedLeaf!.material as THREE.ShaderMaterial).uniforms.map.value).not.toBe(croppedTexBefore);
    }
    layer.dispose();
  });
});
