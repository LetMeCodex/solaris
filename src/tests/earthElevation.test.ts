import { describe, expect, it, vi } from 'vitest';
import { EarthElevation } from '../explorer/Elevation';
import { DemDecoder, Float32Pool, LruCache, TileCache } from '../explorer/TileCache';
import { decodeTerrariumRgba } from '../explorer/demDecode.worker';

interface TestTile {
  heights: Float32Array | null;
  promise: Promise<void>;
  lastUsed: number;
  z?: number;
}

function source() {
  const elevation = new EarthElevation();
  const internals = elevation as unknown as {
    tiles: Map<string, TestTile>;
    load(z: number, x: number, y: number, priority?: number): Promise<void>;
  };
  const tile = (height: number | null, z?: number): TestTile => ({
    heights: height === null ? null : new Float32Array(256 * 256).fill(height),
    promise: Promise.resolve(),
    lastUsed: 0,
    z,
  });
  return { elevation, internals, tile };
}

describe('Earth terrain during streaming', () => {
  it('uses complete coarse coverage instead of making cliffs along partially loaded detail', () => {
    const { elevation, internals, tile } = source();
    internals.tiles.set('0/0/0', tile(2000, 0));
    internals.tiles.set('1/1/1', tile(8000, 1));
    const bounds = { south: -20, west: -20, north: -10, east: 20, z: 1 };
    const sample = elevation.captureSampler(bounds);
    expect(sample(-15, -10, 1)).toBe(2);
    expect(sample(-15, 10, 1)).toBe(2);
    internals.tiles.set('1/0/1', tile(8100, 1));
    const detailed = elevation.captureSampler(bounds);
    expect(detailed(-15, 10, 1)).toBe(8);
    expect(sample(-15, 10, 1)).toBe(2);
  });

  it('holds a patch snapshot stable while a previously queued DEM finishes', () => {
    const { elevation, internals, tile } = source();
    internals.tiles.set('0/0/0', tile(2000, 0));
    const pending = tile(null, 1);
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
    internals.tiles.set('0/0/0', tile(1200, 0));
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
    internals.tiles.set('0/0/0', tile(NaN, 0));
    expect(elevation.heightKm(0, 0, 0)).toBe(0);
    internals.tiles.set('0/0/0', tile(32000, 0));
    expect(elevation.heightKm(0, 0, 0)).toBe(9);
  });

  it('provides synchronous + async sampling with parent-zoom fallback and zero 0m holes', async () => {
    const { elevation, internals, tile } = source();
    // Load only coarse z=0 (4200 m) while z=13 is still missing
    internals.tiles.set('0/0/0', tile(4200, 0));
    const syncSample = elevation.sampleElevation(27.9881, 86.925, 13);
    expect(syncSample.ready).toBe(true);
    expect(syncSample.loadedZoom).toBe(0);
    expect(syncSample.heightKm).toBeCloseTo(4.2, 5);
    expect(syncSample.heightMeters).toBeCloseTo(4200, 2);
    expect(elevation.heightMeters(27.9881, 86.925, 13)).toBeCloseTo(4200, 2);
    expect(elevation.hasCoverage(27.9881, 86.925, 0)).toBe(true);
    expect(elevation.hasCoverage(27.9881, 86.925, 13)).toBe(false);

    // Async sample triggers ensure() and resolves to newly landed z=13 tile
    vi.spyOn(internals, 'load').mockImplementation(async (z, x, y) => {
      if (z === 13) internals.tiles.set(`${z}/${x}/${y}`, tile(8848, 13));
    });
    const asyncSample = await elevation.sampleElevationAsync(27.9881, 86.925, 13, 2000);
    expect(asyncSample.ready).toBe(true);
    expect(asyncSample.loadedZoom).toBe(13);
    expect(asyncSample.heightMeters).toBeCloseTo(8848, 1);
  });

  it('renormalizes bilinear weights around isolated NaN pixels instead of dropping to 0m', () => {
    const { elevation, internals } = source();
    const h = new Float32Array(256 * 256).fill(1500);
    h[128 * 256 + 128] = NaN;
    internals.tiles.set('0/0/0', { heights: h, promise: Promise.resolve(), lastUsed: 0, z: 0 });
    expect(elevation.heightMeters(0, 0, 0)).toBeCloseTo(1500, 1);
  });

  it('prefetches DEM corridor along aircraft velocity vector', async () => {
    const { elevation, internals } = source();
    const load = vi.spyOn(internals, 'load').mockResolvedValue();
    await elevation.prefetchAlong(37.8, -122.4, 0.01, 0.01, 4, 12);
    expect(load.mock.calls.some(([z]) => z === 12)).toBe(true);
  });
});

describe('Terrarium & DEM off-thread decoder fallback', () => {
  it('decodes Terrarium RGB pixels to exact metres and marks transparent pixels NaN', () => {
    // 0 m => 32768 => R=128, G=0, B=0
    // 8848.5 m => 41616.5 => R=162, G=144, B=128 (162*256 + 144 + 0.5 - 32768 = 8848.5)
    const rgba = new Uint8Array([
      128, 0, 0, 255,
      162, 144, 128, 255,
      0, 0, 0, 0,
    ]);
    const heights = decodeTerrariumRgba(rgba, 3, 1);
    expect(heights[0]).toBeCloseTo(0, 4);
    expect(heights[1]).toBeCloseTo(8848.5, 4);
    expect(Number.isNaN(heights[2])).toBe(true);
  });

  it('gracefully falls back to main-thread LERC1 decoding when Worker is unavailable', async () => {
    const decoder = new DemDecoder();
    const bad = new TextEncoder().encode('invalid-lerc-bytes').buffer;
    expect(await decoder.decodeLerc1(bad)).toBeNull();
    decoder.dispose();
  });
});

describe('TileCache deduplication, concurrency, hysteresis & pooling', () => {
  it('coalesces parallel identical tile requests into a single network fetch', async () => {
    let calls = 0;
    let releaseFetch!: () => void;
    const gate = new Promise<void>((r) => { releaseFetch = r; });
    const mockFetch = vi.fn(async () => {
      calls++;
      await gate;
      return new Response(new Uint8Array([1, 2, 3, 4]), { status: 200 });
    }) as unknown as typeof fetch;

    const cache = new TileCache({ fetchImpl: mockFetch, disablePersistence: true });
    const url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/100/200';
    const p1 = cache.fetchBuffer('img:14/100/200', url, { priority: 50, z: 14 });
    const p2 = cache.fetchBuffer('img:14/100/200', url, { priority: 10, z: 14 });
    const p3 = cache.fetchBuffer('img:14/100/200', url, { priority: 25, z: 14 });

    releaseFetch();
    const [r1, r2, r3] = await Promise.all([p1, p2, p3]);
    expect(calls).toBe(1);
    expect(r1.status).toBe('ok');
    expect(r2.status).toBe('ok');
    expect(r3.status).toBe('ok');
    expect(cache.getStats().coalesced).toBe(2);
  });

  it('enforces per-host concurrency limits and dispatches queued tiles by priority', async () => {
    const started: string[] = [];
    const resolvers = new Map<string, () => void>();
    let active = 0;
    let peakActive = 0;

    const mockFetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      started.push(url);
      active++;
      peakActive = Math.max(peakActive, active);
      await new Promise<void>((r) => resolvers.set(url, r));
      active--;
      return new Response(new Uint8Array([9, 9]), { status: 200 });
    }) as unknown as typeof fetch;

    const cache = new TileCache({ fetchImpl: mockFetch, disablePersistence: true });
    const base = 'https://tiles.maps.eox.at/tile/';
    const pA = cache.fetchBuffer('a', `${base}a`, { priority: 100, hostLimit: 2, z: 10 });
    const pB = cache.fetchBuffer('b', `${base}b`, { priority: 90, hostLimit: 2, z: 10 });
    const pLow = cache.fetchBuffer('low', `${base}low`, { priority: 500, hostLimit: 2, z: 10 });
    const pHigh = cache.fetchBuffer('high', `${base}high`, { priority: 5, hostLimit: 2, z: 10 });

    await Promise.resolve();
    expect(peakActive).toBe(2);
    expect(started).toEqual([`${base}a`, `${base}b`]);

    // Finish 'a'; 'high' (priority 5) MUST dispatch before 'low' (priority 500)
    resolvers.get(`${base}a`)!();
    await pA;
    await Promise.resolve();
    expect(started[2]).toBe(`${base}high`);

    resolvers.get(`${base}b`)!();
    resolvers.get(`${base}high`)!();
    await Promise.all([pB, pHigh]);
    await Promise.resolve();
    resolvers.get(`${base}low`)!();
    await pLow;
    expect(peakActive).toBe(2);
  });

  it('uses hysteresis-safe aborting to avoid ERR_ABORTED thrashing on camera jitter', async () => {
    vi.useFakeTimers();
    try {
      let abortedCount = 0;
      const resolvers: Array<() => void> = [];
      const mockFetch = vi.fn(async (_url: RequestInfo | URL, init?: RequestInit) => {
        return await new Promise<Response>((resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            abortedCount++;
            reject(new DOMException('Aborted', 'AbortError'));
          });
          resolvers.push(() => resolve(new Response(new Uint8Array([7, 7, 7]), { status: 200 })));
        });
      }) as unknown as typeof fetch;

      const cache = new TileCache({ fetchImpl: mockFetch, disablePersistence: true });
      const pJitter = cache.fetchBuffer('img:jitter', 'https://tiles.maps.eox.at/10/1/1.jpg', {
        z: 10,
        hysteresisMs: 400,
      });
      const pAnchor = cache.fetchBuffer('img:anchor', 'https://tiles.maps.eox.at/2/0/0.jpg', {
        z: 2,
        hysteresisMs: 100,
      });

      // Camera jitters away for 200 ms, then returns: must NOT abort!
      cache.markUnwanted('img:jitter', 400);
      cache.markUnwanted('img:anchor', 100);
      await vi.advanceTimersByTimeAsync(200);
      cache.updatePriority('img:jitter', 1);
      await vi.advanceTimersByTimeAsync(400);
      expect(abortedCount).toBe(0);

      // Anchor tile (z <= 3) stays protected even when unwanted past hysteresis window
      resolvers.forEach((r) => r());
      const [rj, ra] = await Promise.all([pJitter, pAnchor]);
      expect(rj.status).toBe('ok');
      expect(ra.status).toBe('ok');

      // Now verify genuine sustained departure past hysteresis DOES abort a high-z tile
      const pDepart = cache.fetchBuffer('img:depart', 'https://tiles.maps.eox.at/14/9/9.jpg', {
        z: 14,
        hysteresisMs: 300,
      });
      cache.markUnwanted('img:depart', 300);
      await vi.advanceTimersByTimeAsync(350);
      const rd = await pDepart;
      expect(rd.status).toBe('aborted');
      expect(abortedCount).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('detects Esri World Imagery ocean "Map data not yet available" placeholder as nodata', async () => {
    const mockFetch = vi.fn(async () => {
      return new Response(new Uint8Array(2521), {
        status: 200,
        headers: { etag: '"vvvvvvvvvvvvf"', 'content-length': '2521' },
      });
    }) as unknown as typeof fetch;

    const cache = new TileCache({ fetchImpl: mockFetch, disablePersistence: true });
    const res = await cache.fetchBuffer(
      'img:ocean16',
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/32768/5461',
      { z: 16 }
    );
    expect(res.status).toBe('nodata');
    expect(res.data).toBeNull();
  });

  it('pools Float32Arrays and enforces LRU limits with eviction hooks and pinning', () => {
    const pool = new Float32Pool(1024 * 1024, 4);
    const a = pool.acquire(256);
    a[0] = 42;
    pool.release(a);
    const b = pool.acquire(256, true);
    expect(b).toBe(a);
    expect(b[0]).toBe(0);
    expect(pool.stats().hits).toBe(1);

    const evicted: string[] = [];
    const lru = new LruCache<number>({
      maxEntries: 2,
      minAgeMs: 0,
      onEvict: (k) => evicted.push(k),
    });
    lru.set('anchor', 1, 100, 1);
    lru.pin('anchor');
    lru.set('b', 2, 100, 2);
    lru.set('c', 3, 100, 3);
    expect(lru.has('anchor')).toBe(true);
    expect(evicted).toEqual(['b']);
  });
});
