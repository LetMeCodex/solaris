import { describe, expect, it } from 'vitest';
import { detectTier, PerformanceGovernor } from '../rendering/Performance';

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
});
