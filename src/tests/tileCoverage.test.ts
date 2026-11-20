import { describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { installCompileGate } from '../rendering/CompileGate';
import { PhotorealEarth } from '../rendering/PhotorealEarth';

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
});
