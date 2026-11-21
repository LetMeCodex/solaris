import { describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { detectTier, PerformanceGovernor } from '../rendering/Performance';
import { installCompileGate } from '../rendering/CompileGate';
import { SmallBodies } from '../rendering/SmallBodies';
import { resolveGltfModelPath } from '../rendering/SpacecraftFactory';

const desktop = { coarsePointer: false, shortSide: 1080, cores: 12, memoryGb: 16, gpu: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4050 Laptop GPU Direct3D11)' };

describe('quality tier detection', () => {
  it('gives a discrete GPU the high tier', () => {
    expect(detectTier(desktop)).toBe('high');
  });

  it('puts old integrated and software GPUs on the low tier', () => {
    expect(detectTier({ ...desktop, gpu: 'ANGLE (Intel, Intel(R) HD Graphics 620 Direct3D11)' })).toBe('low');
    expect(detectTier({ ...desktop, gpu: 'Google SwiftShader' })).toBe('low');
  });

  it('puts newer integrated GPUs on the medium tier', () => {
    expect(detectTier({ ...desktop, gpu: 'ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11)' })).toBe('medium');
  });

  it('treats a small phone with little memory as low, a strong one as medium', () => {
    const phone = { coarsePointer: true, shortSide: 390, cores: 8, memoryGb: 4, gpu: 'Adreno (TM) 740' };
    expect(detectTier(phone)).toBe('low');
    expect(detectTier({ ...phone, memoryGb: 8 })).toBe('medium');
  });

  it('treats a dual-core laptop as low whatever its GPU says', () => {
    expect(detectTier({ ...desktop, cores: 2 })).toBe('low');
  });
});

describe('adaptive resolution', () => {
  it('respects the framebuffer pixel budget even on an 8K screen', () => {
    const g = new PerformanceGovernor('low');
    const ratio = g.pixelRatio(2, 7680, 4320);
    expect(7680 * 4320 * ratio ** 2).toBeLessThanOrEqual(1_250_000);
    expect(ratio).toBeGreaterThan(0);
  });

  it('does not poison frame-time adaptation with invalid samples', () => {
    const g = new PerformanceGovernor('low');
    for (const value of [NaN, Infinity, -30, 0]) g.frame(value);
    expect(Number.isFinite(g.frameMs)).toBe(true);
    for (let i = 0; i < 1000; i++) g.frame(40);
    expect(g.scale).toBeLessThan(0.8);
  });

  it('steps the resolution down when frames run long, not below the tier floor', () => {
    const g = new PerformanceGovernor('high');
    let changes = 0;
    g.onChange(() => changes++);
    for (let i = 0; i < 2000; i++) g.frame(40);
    expect(changes).toBeGreaterThan(0);
    expect(g.scale).toBeLessThan(1);
    expect(g.scale).toBeGreaterThanOrEqual(g.settings.minScale);
  });

  it('climbs back up when there is headroom', () => {
    const g = new PerformanceGovernor('low');
    const start = g.scale;
    // 60 fps for over a minute (past the 30 s ceiling after a drop)
    for (let i = 0; i < 4000; i++) g.frame(16.7);
    expect(g.scale).toBeGreaterThan(start);
    expect(g.scale).toBeLessThanOrEqual(1);
  });

  it('ignores single stalls (a tab switch, a shader compile)', () => {
    const g = new PerformanceGovernor('high');
    for (let i = 0; i < 200; i++) g.frame(16.7);
    g.frame(2000);
    for (let i = 0; i < 200; i++) g.frame(16.7);
    expect(g.scale).toBe(1);
  });

  it('turns the costly features off on the low tier', () => {
    const low = new PerformanceGovernor('low').settings;
    expect(low.ao).toBe(false);
    expect(low.shadowMap).toBe(0);
    expect(low.hiRes8k).toBe(false);
    expect(low.maxDpr).toBe(1);
  });

  it('sheds GTAO before crushing dynamic resolution scale to minScale', () => {
    const g = new PerformanceGovernor('high');
    expect(g.aoEnabled).toBe(true);
    g.scale = 0.78;
    expect(g.aoEnabled).toBe(false);
    expect(g.smaaEnabled).toBe(true);
    expect(g.settings.minScale).toBeGreaterThanOrEqual(0.7);
  });
});

describe('asset streaming, compile gate & 404 elimination', () => {
  it('aliases legacy comet 67P model path to the verified on-disk glTF file (zero 404)', () => {
    expect(resolveGltfModelPath('67p_churyumov_gerasimenko/comet_67p.gltf')).toBe(
      '67p_churyumov_gerasimenko/67p_churyumov_gerasimenko.gltf',
    );
    expect(resolveGltfModelPath('/103p_hartley_2/hartley_2.gltf')).toBe('103p_hartley_2/hartley_2.gltf');
  });

  it('defers small-bodies catalogue fetch when deferLoad is enabled and suppresses visibility on surfaces', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 503,
    } as Response);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const bodies = new SmallBodies({ deferLoad: true });
      expect(fetchSpy).not.toHaveBeenCalled();

      bodies.setSurfaceSuppressed(true);
      expect(bodies.mesh.visible).toBe(false);
      expect(bodies.isVisible()).toBe(true);

      bodies.setSurfaceSuppressed(false);
      expect(bodies.mesh.visible).toBe(true);

      bodies.ensureLoaded();
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      bodies.dispose();
    } finally {
      fetchSpy.mockRestore();
      warnSpy.mockRestore();
    }
  });

  it('budgets per-frame GPU texture uploads by count and pixel cap inside CompileGate', () => {
    const initTexture = vi.fn();
    const mockRenderer = {
      render: vi.fn(),
      compile: vi.fn(),
      initTexture,
      dispose: vi.fn(),
      getContext: () => ({ isContextLost: () => false }),
      getRenderTarget: () => null,
      shadowMap: { enabled: false },
      toneMapping: THREE.ACESFilmicToneMapping,
      outputColorSpace: THREE.SRGBColorSpace,
      extensions: { has: () => true },
      properties: new WeakMap(),
    } as unknown as THREE.WebGLRenderer;

    const gate = installCompileGate(mockRenderer);
    gate.mode = 'hide';
    gate.beginFrame(50, 2, 4_500_000);

    const texA = new THREE.Texture({ width: 2048, height: 1024 } as unknown as HTMLImageElement);
    const texB = new THREE.Texture({ width: 2048, height: 1024 } as unknown as HTMLImageElement);
    const texC = new THREE.Texture({ width: 2048, height: 1024 } as unknown as HTMLImageElement);

    expect(gate.tryUploadTexture(texA)).toBe(true);
    expect(gate.tryUploadTexture(texB)).toBe(true);
    // Exceeds maxUploads = 2 and maxPixels = 4.5M
    expect(gate.tryUploadTexture(texC)).toBe(false);
    expect(initTexture).toHaveBeenCalledTimes(2);

    // Large 8K texture still uploads as the sole texture of a fresh frame without starving
    gate.beginFrame(50, 2, 4_500_000);
    const tex8k = new THREE.Texture({ width: 8192, height: 4096 } as unknown as HTMLImageElement);
    expect(gate.tryUploadTexture(tex8k)).toBe(true);
    expect(gate.tryUploadTexture(texC)).toBe(false);
    expect(initTexture).toHaveBeenCalledTimes(3);
  });

  it('guards against undefined program entries in CompileGate.programsReady without throwing', () => {
    const mat = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
    const scene = new THREE.Scene();
    scene.add(mesh);
    const camera = new THREE.PerspectiveCamera();
    const props = new WeakMap<object, unknown>();
    props.set(mat, { programs: new Map<string, unknown>([['broken', undefined], ['partial', {}]]) });

    const mockRenderer = {
      render: vi.fn(),
      compile: vi.fn(),
      initTexture: vi.fn(),
      dispose: vi.fn(),
      getContext: () => ({ isContextLost: () => false }),
      getRenderTarget: () => null,
      shadowMap: { enabled: false },
      toneMapping: THREE.ACESFilmicToneMapping,
      outputColorSpace: THREE.SRGBColorSpace,
      extensions: { has: () => true },
      properties: props,
    } as unknown as THREE.WebGLRenderer;

    const gate = installCompileGate(mockRenderer);
    gate.mode = 'hide';
    gate.beginFrame(2.5);

    expect(() => mockRenderer.render(scene, camera)).not.toThrow();
    mesh.geometry.dispose();
    mat.dispose();
  });
});
