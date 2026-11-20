import { describe, expect, it, vi } from 'vitest';
import { EarthElevation } from '../explorer/Elevation';

interface TestTile { heights: Float32Array | null; promise: Promise<void>; lastUsed: number }
function source() {
  const elevation = new EarthElevation();
  const internals = elevation as unknown as { tiles: Map<string, TestTile>; load(z: number, x: number, y: number): Promise<void> };
  const tile = (height: number | null): TestTile => ({ heights: height === null ? null : new Float32Array(256 * 256).fill(height), promise: Promise.resolve(), lastUsed: 0 });
  return { elevation, internals, tile };
}

describe('Earth terrain during streaming', () => {
  it('uses complete coarse coverage instead of making cliffs along partially loaded detail', () => {
    const { elevation, internals, tile } = source();
    internals.tiles.set('0/0/0', tile(2000));
    internals.tiles.set('1/1/1', tile(8000));
    const bounds = { south: -20, west: -20, north: -10, east: 20, z: 1 };
    const sample = elevation.captureSampler(bounds);
    expect(sample(-15, -10, 1)).toBe(2);
    expect(sample(-15, 10, 1)).toBe(2);
    internals.tiles.set('1/0/1', tile(8100));
    const detailed = elevation.captureSampler(bounds);
    expect(detailed(-15, 10, 1)).toBe(8);
    expect(sample(-15, 10, 1)).toBe(2);
  });
  it('holds a patch snapshot stable while a previously queued DEM finishes', () => {
    const { elevation, internals, tile } = source();
    internals.tiles.set('0/0/0', tile(2000));
    const pending = tile(null);
    internals.tiles.set('1/1/1', pending);
    const sample = elevation.captureSampler();
    expect(sample(-20, 20, 1)).toBe(2);
    pending.heights = new Float32Array(256 * 256).fill(8000);
    expect(elevation.heightKm(-20, 20, 1)).toBe(8);
    expect(sample(-20, 20, 1)).toBe(2);
    expect(elevation.captureSampler()(-20, 20, 1)).toBe(8);
  });

  it('retains sampled heights even if the live LRU evicts their tile', () => {
    const { elevation, internals, tile } = source();
    internals.tiles.set('0/0/0', tile(1200));
    const sample = elevation.captureSampler();
    internals.tiles.clear();
    expect(sample(0, 0, 0)).toBeCloseTo(1.2);
    expect(elevation.heightKm(0, 0, 0)).toBe(0);
  });

  it('requests broad coverage before expensive detail', async () => {
    const { elevation, internals } = source();
    const load = vi.spyOn(internals, 'load').mockResolvedValue();
    await elevation.ensure(41.8, 12.4, 41.81, 12.41, 13);
    expect(load.mock.calls[0][0]).toBe(3);
    expect(load.mock.calls.some(([z]) => z === 13)).toBe(true);
  });

  it('rejects invalid view bounds and prevents invalid DEM heights entering geometry', async () => {
    const { elevation, internals, tile } = source();
    const load = vi.spyOn(internals, 'load').mockResolvedValue();
    await elevation.ensure(0, Infinity, 1, Infinity, 13);
    expect(load).not.toHaveBeenCalled();
    internals.tiles.set('0/0/0', tile(NaN));
    expect(elevation.heightKm(0, 0, 0)).toBe(0);
    internals.tiles.set('0/0/0', tile(32000));
    expect(elevation.heightKm(0, 0, 0)).toBe(9);
  });
});
