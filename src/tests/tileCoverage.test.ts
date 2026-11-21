import { describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { installCompileGate } from '../rendering/CompileGate';
import { PhotorealEarth } from '../rendering/PhotorealEarth';
import { SurfaceTileLayer, type TileImageLoader } from '../explorer/SurfaceTileLayer';
import { BODY_IMAGERY } from '../explorer/ImageryRegistry';
import { bodyLatLonToLocal } from '../explorer/TileMath';

describe('terrain coverage during streaming', () => {
  it('does not call continent-scale Google meshes a ready 3D city', () => {
    const earth = Object.create(PhotorealEarth.prototype) as PhotorealEarth;
    const tiles = new Set([{ geometricError: 4109 }, { geometricError: 1027 }, { geometricError: 16 }, { geometricError: 8 }, { geometricError: NaN }]);
    Object.assign(earth, { enabled: true, disposed: false, authFailed: false, tiles: { visibleTiles: tiles } });
    expect(earth.detailedTilesVisible).toBe(2);
    Object.assign(earth, { enabled: false });
    expect(earth.detailedTilesVisible).toBe(0);
  });
  it('keeps replacement terrain visible while its shader is being prepared', () => {
    const drawn: THREE.Object3D[] = [];
    const renderer = {
      render: (scene: THREE.Object3D) => scene.traverseVisible(o => drawn.push(o)),
      extensions: { has: () => true },
      domElement: { addEventListener: vi.fn(), removeEventListener: vi.fn() },
      dispose: vi.fn(),
      getRenderTarget: () => null,
      getContext: () => ({ isContextLost: () => false }),
      properties: { get: () => ({ programs: new Map([['pending', { isReady: () => false }]]) }) },
      compile: vi.fn(),
      shadowMap: { enabled: false },
    } as unknown as THREE.WebGLRenderer;
    const gate = installCompileGate(renderer);
    gate.mode = 'hide';
    gate.beginFrame();
    const scene = new THREE.Scene();
    const terrain = new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.MeshBasicMaterial());
    terrain.userData.solarisKeepCoverage = true;
    const decoration = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
    scene.add(terrain, decoration);
    renderer.render(scene, new THREE.PerspectiveCamera());
    expect(drawn).toContain(terrain);
    expect(drawn).not.toContain(decoration);
    expect(terrain.visible).toBe(true);
    expect(decoration.visible).toBe(true);
    renderer.dispose();
  });

  it('retains cached Earth tiles during a request cooldown but hides them on exit', () => {
    // No network or WebGL is needed to test the visibility contract used by fallback terrain.
    const earth = Object.create(PhotorealEarth.prototype) as PhotorealEarth;
    Object.assign(earth, {
      enabled: true, disposed: false, authFailed: false,
      cooldownUntil: performance.now() + 60000,
      tiles: { visibleTiles: new Set([{}]) },
    });
    expect(earth.showing).toBe(true);
    expect(earth.isDegraded).toBe(true);
    Object.assign(earth, { enabled: false });
    expect(earth.showing).toBe(false);
    Object.assign(earth, { enabled: true, tiles: { visibleTiles: new Set() } });
    expect(earth.showing).toBe(false);
  });

  it('budgets individual textures and propagates upload failures without stranding later jobs', async () => {
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
    try {
      const earth = Object.create(PhotorealEarth.prototype) as PhotorealEarth;
      const upload = vi.fn().mockImplementationOnce(() => { throw new Error('GPU upload failed'); });
      const queue: Array<() => void> = [];
      Object.assign(earth, {
        disposed: false, maxAnisotropy: 2, uploadQueue: queue, uploadPump: 0,
        renderer: { initTexture: upload, getContext: () => ({ isContextLost: () => false }) },
      });
      const a = new THREE.DataTexture(new Uint8Array(4), 1, 1);
      const b = new THREE.DataTexture(new Uint8Array(4), 1, 1);
      const scene = new THREE.Group();
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(), [
        new THREE.MeshBasicMaterial({ map: a }), new THREE.MeshBasicMaterial({ map: a }),
        new THREE.MeshBasicMaterial({ map: b }),
      ]));
      const promise = (earth as unknown as { uploadInTurn(s: THREE.Object3D): Promise<void> }).uploadInTurn(scene);
      const rejected = expect(promise).rejects.toThrow('GPU upload failed');
      expect(queue).toHaveLength(2);
      while (queue.length) expect(() => queue.shift()!()).not.toThrow();
      await rejected;
      expect(upload).toHaveBeenCalledTimes(2);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('prefetches lookahead tiles along velocity vector without starving visible foreground tiles', () => {
    const requested: string[] = [];
    const loader: TileImageLoader = {
      load(url, onLoad) {
        requested.push(url);
        const img = { src: url, width: 256, height: 256, naturalWidth: 256, naturalHeight: 256, complete: true } as HTMLImageElement;
        onLoad(img);
        return img;
      },
    };
    const layer = new SurfaceTileLayer(BODY_IMAGERY.Earth.provider!, loader);
    layer.bodyName = 'Earth';
    layer.radiusKm = 6371;
    const [x, y, z] = bodyLatLonToLocal('Earth', 37.82, -122.48);
    // Moving East along the tangent at ~250 m/s (~4e-5 Earth radii/s)
    const camStatic = {
      position: [x * 1.0005, y * 1.0005, z * 1.0005] as [number, number, number],
      pixelsPerRadian: 900,
      bodyName: 'Earth',
      isCapVisible: (c: [number, number, number]) => c[0] * x + c[1] * y + c[2] * z > 0.9995,
    };
    const layerStatic = new SurfaceTileLayer(BODY_IMAGERY.Earth.provider!, {
      load(url, onLoad) {
        const img = { src: url, width: 256, height: 256, naturalWidth: 256, naturalHeight: 256, complete: true } as HTMLImageElement;
        onLoad(img);
        return img;
      },
    });
    layerStatic.bodyName = 'Earth';
    layerStatic.radiusKm = 6371;
    layerStatic.update(camStatic);

    // East vector at (x, y, z)
    const ex = -z, ez = x;
    const el = Math.hypot(ex, ez) || 1;
    layer.update({
      ...camStatic,
      velocity: [(ex / el) * 8e-5, 0, (ez / el) * 8e-5],
      lookaheadSec: 4.0,
    });
    expect(layer.getStatus().cached).toBeGreaterThanOrEqual(layerStatic.getStatus().cached);
    expect(layer.getStatus().drawn).toBeGreaterThan(0);
    expect(requested.length).toBeGreaterThan(0);
    layer.dispose();
    layerStatic.dispose();
  });

  it('distinguishes local mountain/city PhotorealEarth coverage from coarse continent shells and hides Earth underlay strips', () => {
    const earth = Object.create(PhotorealEarth.prototype) as PhotorealEarth;
    Object.assign(earth, {
      enabled: true,
      disposed: false,
      authFailed: false,
      tiles: { visibleTiles: new Set([{ geometricError: 4109 }, { geometricError: 2500 }]) },
    });
    expect(earth.hasLocalCoverage).toBe(false);
    Object.assign(earth, {
      tiles: { visibleTiles: new Set([{ geometricError: 4109 }, { geometricError: 512 }]) },
    });
    expect(earth.hasLocalCoverage).toBe(true);

    const layer = new SurfaceTileLayer(BODY_IMAGERY.Earth.provider!, {
      load: (url) => ({ src: url } as HTMLImageElement),
    });
    layer.bodyName = 'Earth';
    layer.setOpacity(1);
    layer.setUnderlay(true);
    expect(layer.group.visible).toBe(false);
    layer.setUnderlay(false);
    expect(layer.group.visible).toBe(true);
    layer.dispose();
  });
});
