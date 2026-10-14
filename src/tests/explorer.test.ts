import { describe, it, expect } from 'vitest';
import {
  matrixSize,
  tileBounds,
  childTiles,
  rootTiles,
  latLonToLocal,
  localToLatLon,
  selectTiles,
  tileExists,
  tileCap,
  wmsBbox,
} from '../explorer/TileMath';
import { BODY_IMAGERY, metresPerPixel, minimumAltitudeKm } from '../explorer/ImageryRegistry';
import { LANDMARKS, searchLandmarks } from '../explorer/Landmarks';
import { SurfaceTileLayer, TileImageLoader } from '../explorer/SurfaceTileLayer';

const trek = BODY_IMAGERY.Moon.provider!;
const gibs = BODY_IMAGERY.Earth.provider!;

describe('Equirectangular tile grids', () => {
  it('matches the Trek capabilities: 2×1 at level 0, doubling each level (256 px, 180° tiles)', () => {
    expect(matrixSize(trek, 0)).toEqual({ cols: 2, rows: 1 });
    expect(matrixSize(trek, 8)).toEqual({ cols: 512, rows: 256 });
    expect(tileBounds(trek, { z: 0, x: 1, y: 0 })).toMatchObject({ west: 0, east: 180, north: 90, south: -90 });
  });

  it('handles GIBS 288° tiles whose edges run past the globe', () => {
    expect(matrixSize(gibs, 0)).toEqual({ cols: 2, rows: 1 });
    const b = tileBounds(gibs, { z: 0, x: 1, y: 0 });
    expect(b.west).toBe(108);
    expect(b.east).toBe(396);
    expect(b.clipEast).toBe(180);
    expect(b.clipSouth).toBe(-90);
    // Level 7: 2.25° tiles → 160 × 80
    expect(matrixSize(gibs, 7)).toEqual({ cols: 160, rows: 80 });
  });

  it('never yields children outside the globe', () => {
    for (const root of rootTiles(gibs)) {
      for (const c of childTiles(gibs, root)) {
        const b = tileBounds(gibs, c);
        expect(b.clipEast).toBeGreaterThan(b.clipWest);
        expect(b.clipNorth).toBeGreaterThan(b.clipSouth);
        expect(tileExists(gibs, c)).toBe(true);
      }
    }
  });

  it('uses the globe texture convention: lon 0 on +X, east towards −Z, north +Y', () => {
    const [x, , z] = latLonToLocal(0, 90);
    expect(x).toBeCloseTo(0, 9);
    expect(z).toBeCloseTo(-1, 9);
    const ll = localToLatLon(...latLonToLocal(-43.31, -11.36));
    expect(ll.lat).toBeCloseTo(-43.31, 9);
    expect(ll.lon).toBeCloseTo(-11.36, 9);
  });

  it('builds WMS bounding boxes in lon,lat order', () => {
    expect(wmsBbox(BODY_IMAGERY.Venus.provider!, { z: 1, x: 3, y: 0 })).toBe('90,0,180,90');
  });
});

describe('Tile selection', () => {
  const camAbove = (lat: number, lon: number, altitudeRadii: number) => {
    const [x, y, z] = latLonToLocal(lat, lon);
    const d = 1 + altitudeRadii;
    return { position: [x * d, y * d, z * d] as [number, number, number], pixelsPerRadian: 1000 / (2 * Math.tan((55 * Math.PI) / 360)) };
  };

  it('stays coarse from far away and refines to the deepest level near the surface', () => {
    const far = selectTiles(trek, camAbove(0, 0, 3));
    expect(Math.max(...far.map((k) => k.z))).toBeLessThanOrEqual(3);
    const near = selectTiles(trek, camAbove(-43.31, -11.36, 0.02));
    expect(Math.max(...near.map((k) => k.z))).toBe(trek.maxLevel);
  });

  it('refines wide GIBS root tiles under a low camera (cap radius covers the whole tile)', () => {
    const cap = tileCap(gibs, { z: 0, x: 0, y: 0 });
    expect(cap.radius).toBeGreaterThan((140 * Math.PI) / 180);
    // 273 km above Everest: must select fine tiles, not nothing
    const sel = selectTiles(gibs, camAbove(27.99, 86.93, 273 / 6371));
    expect(sel.length).toBeGreaterThan(0);
    expect(Math.max(...sel.map((k) => k.z))).toBe(gibs.maxLevel);
  });

  it('only selects tiles on the visible side of the globe, nearest first', () => {
    const sel = selectTiles(trek, camAbove(0, 0, 0.3));
    const first = tileBounds(trek, sel[0]);
    expect(first.clipWest).toBeLessThanOrEqual(0.5);
    expect(first.clipEast).toBeGreaterThanOrEqual(-0.5);
    for (const k of sel) {
      const b = tileBounds(trek, k);
      // Nothing from the far hemisphere (around lon 180)
      expect(b.clipWest > 120 || b.clipEast < -120).toBe(false);
    }
  });
});

describe('Imagery registry', () => {
  it('derives the finest ground sample from verified maximum levels', () => {
    expect(metresPerPixel(trek, 8, 1737.4)).toBeCloseTo(83.3, 0); // LRO WAC 303 ppd ≈ 100 m/px nominal
    expect(BODY_IMAGERY.Earth.bestMetresPerPixel).toBeCloseTo(489, -1); // GIBS 500m set
    expect(BODY_IMAGERY.Jupiter.provider).toBeNull();
  });

  it('limits zoom by data resolution: finer imagery allows lower altitudes', () => {
    const moon = minimumAltitudeKm(BODY_IMAGERY.Moon, 55);
    const earth = minimumAltitudeKm(BODY_IMAGERY.Earth, 55);
    expect(moon).toBeLessThan(earth);
    expect(moon).toBeGreaterThan(10);
  });

  it('labels Venus as radar and the giants as cloud tops', () => {
    expect(BODY_IMAGERY.Venus.kind).toBe('radar');
    for (const g of ['Jupiter', 'Saturn', 'Uranus', 'Neptune']) expect(BODY_IMAGERY[g].kind).toBe('atmosphere');
  });

  it('has landmarks with sane coordinates and a source for each', () => {
    for (const l of LANDMARKS) {
      expect(Math.abs(l.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(l.lon)).toBeLessThanOrEqual(180);
      expect(l.source.length).toBeGreaterThan(5);
    }
    expect(searchLandmarks('olympus')[0].body).toBe('Mars');
  });
});

describe('SurfaceTileLayer streaming', () => {
  class FakeLoader implements TileImageLoader {
    requested: string[] = [];
    pending: Array<{ url: string; ok: () => void; fail: () => void }> = [];
    load(url: string, onLoad: (img: HTMLImageElement) => void, onError: () => void): HTMLImageElement {
      this.requested.push(url);
      const img = { src: url, onload: null, onerror: null } as unknown as HTMLImageElement;
      this.pending.push({ url, ok: () => onLoad(img), fail: onError });
      return img;
    }
  }

  const cam = { position: [0, 0, -1.05] as [number, number, number], pixelsPerRadian: 900 };

  it('limits concurrent requests, fills them in order and never requests a tile twice', () => {
    const loader = new FakeLoader();
    const layer = new SurfaceTileLayer(trek, loader);
    layer.update(cam);
    expect(loader.requested.length).toBeLessThanOrEqual(6);
    const firstBatch = [...loader.requested];
    loader.pending.splice(0).forEach((p) => p.ok());
    layer.update(cam);
    expect(new Set(loader.requested).size).toBe(loader.requested.length);
    expect(loader.requested.slice(0, firstBatch.length)).toEqual(firstBatch);
    expect(layer.getStatus().cached).toBeGreaterThan(0);
    layer.dispose();
  });

  it('marks the source unavailable after repeated failures instead of hammering it', () => {
    const loader = new FakeLoader();
    const layer = new SurfaceTileLayer(trek, loader);
    for (let i = 0; i < 12; i++) {
      layer.update(cam);
      loader.pending.splice(0).forEach((p) => p.fail());
    }
    layer.update(cam);
    expect(layer.getStatus().state).toBe('unavailable');
    const count = loader.requested.length;
    layer.update(cam);
    expect(loader.requested.length).toBe(count);
    layer.dispose();
  });
});
