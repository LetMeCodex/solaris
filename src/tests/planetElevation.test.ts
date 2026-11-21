import { describe, expect, it, vi } from 'vitest';
import {
  decodeGrey,
  elevationFor,
  groundHeightMeters,
  planetElevation,
  PlanetElevation,
  RELIEF_BODIES,
  sampleGroundElevation,
} from '../explorer/PlanetElevation';
import { decodeLerc1 } from '../explorer/Lerc1';
import {
  BODY_IMAGERY,
  buildTileUrl,
  effectiveMinLevel,
  gridsCompatible,
  imageryEyeKm,
  isTileKeyInBounds,
  metresPerPixel,
  resolveProviderForTile,
  type TileProvider,
} from '../explorer/ImageryRegistry';
import {
  bodyLatLonToLocal,
  childTiles,
  childUvRect,
  latLonToMercatorTile,
  latToMercatorY,
  matrixSize,
  mercatorYToLat,
  rootTiles,
  selectTiles,
  selectTilesWithPriority,
  tileBounds,
  tileLatAtFraction,
  tileUv,
} from '../explorer/TileMath';
import { LANDMARKS, angularDistanceDeg } from '../explorer/Landmarks';

describe('Planet elevation', () => {
  it('streams real heights for the Moon and Mars only, and Earth through the same seam', () => {
    expect(RELIEF_BODIES.sort()).toEqual(['Mars', 'Moon']);
    expect(planetElevation('Io')).toBeNull();
    expect(elevationFor('Earth')).not.toBeNull();
    expect(planetElevation('Moon')!.datumKm).toBeGreaterThan(9.15); // below the LOLA minimum, −9.15 km
  });

  it('decodes 8-bit Trek heights on their calibrated stretch and smooths the steps', () => {
    // 3 × 1 grey ramp, alpha 0 on the last pixel (no data)
    const px = new Uint8Array([0, 0, 0, 255, 255, 255, 255, 255, 9, 9, 9, 0]);
    const h = decodeGrey(px, 3, 1, -9.15, 19.91 / 255);
    expect(Number.isNaN(h[2])).toBe(true);
    // Two smoothing passes average the two valid samples: (−9.15 + 10.76) / 2
    expect(h[0]).toBeCloseTo(0.805, 2);
    expect(h[1]).toBeCloseTo(0.805, 2);
  });

  it('rejects data that is not LERC1', () => {
    expect(() => decodeLerc1(new TextEncoder().encode('not a raster at all').buffer)).toThrow();
  });

  it('does not turn valid DEM edge samples into zero-height walls beside no-data pixels', () => {
    const elevation = new PlanetElevation('test', [{ url: () => '', format: 'lerc1', tileSize: 2, maxZ: 0, south: -90, north: 90 }], 0);
    const state = elevation as unknown as { tiles: Map<string, unknown> };
    state.tiles.set('0/0/0/0', {
      heights: new Float32Array([2, NaN, 2, NaN]), w: 2, h: 2, corner: true,
      promise: Promise.resolve(), lastUsed: 0,
    });
    expect(elevation.heightKm(90, -180, 0)).toBe(2);
    expect(elevation.heightKm(0, -135, 0)).toBe(2);
    expect(elevation.heightMeters(90, -180, 0)).toBe(2000);
    expect(elevation.sampleElevation(90, -180, 0)).toEqual({
      heightKm: 2,
      heightMeters: 2000,
      loadedZoom: 0,
      ready: true,
    });
  });

  it('briefly caches failed DEM requests instead of retrying a coverage hole on every frame', async () => {
    vi.useFakeTimers();
    const clock = vi.spyOn(performance, 'now').mockImplementation(() => Date.now());
    try {
      const elevation = new PlanetElevation('test', [{ url: () => '', format: 'lerc1', tileSize: 2, maxZ: 0, south: -90, north: 90 }], 0);
      const state = elevation as unknown as { fetchTileOnce: () => Promise<never> };
      const fetch = vi.spyOn(state, 'fetchTileOnce').mockRejectedValue(new Error('offline'));
      const first = elevation.ensure(1, -100, 2, -99, 0);
      await vi.advanceTimersByTimeAsync(650);
      await first;
      expect(fetch).toHaveBeenCalledTimes(2);
      await elevation.ensure(1, -100, 2, -99, 0);
      expect(fetch).toHaveBeenCalledTimes(2);
      await vi.advanceTimersByTimeAsync(20_001);
      const retry = elevation.ensure(1, -100, 2, -99, 0);
      await vi.advanceTimersByTimeAsync(650);
      await retry;
      expect(fetch).toHaveBeenCalledTimes(4);
    } finally {
      clock.mockRestore();
      vi.useRealTimers();
    }
  });

  it('exposes consistent groundHeightMeters and sampleGroundElevation helpers', () => {
    expect(groundHeightMeters('Io', 0, 0)).toBe(0);
    expect(sampleGroundElevation('Io', 0, 0)).toEqual({
      heightKm: 0,
      heightMeters: 0,
      loadedZoom: -1,
      ready: false,
    });
  });
});

describe('Earth high-res Web Mercator imagery and zero GIBS 400 bounds', () => {
  it('routes orbital zooms to EOX/BlueMarble 3857 and close-up zooms to ArcGIS World Imagery up to z18', () => {
    const earth = BODY_IMAGERY.Earth.provider!;
    expect(earth.projection).toBe('mercator');
    expect(earth.minLevel).toBe(6);
    expect(earth.maxLevel).toBe(18);
    expect(effectiveMinLevel(earth)).toBe(0);
    expect(BODY_IMAGERY.Earth.bestMetresPerPixel).toBeCloseTo(0.6, 1);
    expect(metresPerPixel(earth, 18, 6371, 40.71)).toBeLessThan(0.5);

    // Orbital z=3: primary -> EOX 3857, fallback step 1 -> NASA GIBS BlueMarble 3857
    const z3Primary = buildTileUrl(earth, { z: 3, x: 2, y: 3 }, 0);
    const z3Fallback = buildTileUrl(earth, { z: 3, x: 2, y: 3 }, 1);
    expect(z3Primary).toContain('s2cloudless-2021_3857');
    expect(z3Fallback).toContain('GoogleMapsCompatible_Level8/3/3/2.jpeg');

    // City z=18 NYC: primary -> ArcGIS World Imagery, fallback step 1 -> null (no invalid z=18 EOX/GIBS call)
    const nyc = latLonToMercatorTile(40.7128, -74.006, 18);
    const z18Url = buildTileUrl(earth, { z: 18, x: nyc.x, y: nyc.y }, 0);
    expect(z18Url).toBe(
      `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/${nyc.y}/${nyc.x}`
    );
    expect(buildTileUrl(earth, { z: 18, x: nyc.x, y: nyc.y }, 1)).toBeNull();

    // Regional z=10: primary -> ArcGIS, fallback step 1 -> EOX 3857, step 2 -> null (GIBS maxLevel is 8)
    expect(buildTileUrl(earth, { z: 10, x: 300, y: 380 }, 0)).toContain('arcgisonline.com');
    expect(buildTileUrl(earth, { z: 10, x: 300, y: 380 }, 1)).toContain('s2cloudless-2021_3857');
    expect(buildTileUrl(earth, { z: 10, x: 300, y: 380 }, 2)).toBeNull();
  });

  it('guarantees zero NASA GIBS HTTP 400s from out-of-bounds or mismatched tile matrices', () => {
    const legacyGibs4326: TileProvider = {
      kind: 'wmts',
      projection: 'equirect',
      template: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_NextGeneration/default/500m/{z}/{y}/{x}.jpeg',
      tileSize: 512,
      level0TileDeg: 288,
      minLevel: 0,
      maxLevel: 7,
    };
    const eox4326: TileProvider = {
      kind: 'wmts',
      projection: 'equirect',
      template: 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless/default/WGS84/{z}/{y}/{x}.jpg',
      tileSize: 256,
      level0TileDeg: 180,
      minLevel: 0,
      maxLevel: 13,
      fallback: legacyGibs4326,
    };

    // Previously failing live-playtest GIBS 400 coordinates must ALL be rejected cleanly
    const badGibsKeys = [
      { z: 5, y: 11, x: 47 },
      { z: 6, y: 22, x: 94 },
      { z: 6, y: 22, x: 95 },
      { z: 7, y: 44, x: 189 },
    ];
    expect(gridsCompatible(eox4326, legacyGibs4326)).toBe(false);
    for (const k of badGibsKeys) {
      expect(isTileKeyInBounds(legacyGibs4326, k)).toBe(false);
      expect(buildTileUrl(legacyGibs4326, k)).toBeNull();
      expect(resolveProviderForTile(eox4326, k, true)).toBeNull();
    }

    // New Earth GIBS EPSG:3857 fallback is grid-compatible and strictly clamped to z=0..8
    const earth = BODY_IMAGERY.Earth.provider!;
    const gibs3857 = earth.fallback!.fallback!;
    expect(gridsCompatible(earth, gibs3857)).toBe(true);
    expect(isTileKeyInBounds(gibs3857, { z: 8, x: 255, y: 255 })).toBe(true);
    expect(isTileKeyInBounds(gibs3857, { z: 8, x: 256, y: 255 })).toBe(false);
    expect(isTileKeyInBounds(gibs3857, { z: 9, x: 0, y: 0 })).toBe(false);
  });

  it('computes exact Web Mercator math, distortion-free UVs, child UV crops, and velocity lookahead', () => {
    const earth = { ...BODY_IMAGERY.Earth.provider!, minLevel: 0 };
    expect(matrixSize(earth, 0)).toEqual({ cols: 1, rows: 1 });
    expect(matrixSize(earth, 18)).toEqual({ cols: 262144, rows: 262144 });
    expect(rootTiles(earth)).toEqual([{ z: 0, x: 0, y: 0 }]);
    expect(childTiles(earth, { z: 0, x: 0, y: 0 })).toHaveLength(4);

    // Round-trip Mercator latitude conversion
    for (const lat of [-80, -45, 0, 27.9881, 48.8584, 80]) {
      expect(mercatorYToLat(latToMercatorY(lat))).toBeCloseTo(lat, 6);
    }

    // Distortion-free UV identity at z=0 and z=16
    for (const k of [{ z: 0, x: 0, y: 0 }, { z: 16, x: 19297, y: 24649 }]) {
      const b = tileBounds(earth, k);
      for (const frac of [0, 0.25, 0.5, 0.75, 1]) {
        const lat = tileLatAtFraction(earth, b, frac);
        const [, v] = tileUv(earth, b, lat, (b.west + b.east) / 2);
        expect(v).toBeCloseTo(1 - frac, 6);
      }
    }

    // Parent->child UV crop rectangles (Three.js flipY=true: v=1 north, v=0 south)
    expect(childUvRect({ z: 0, x: 0, y: 0 }, { z: 1, x: 0, y: 0 })).toEqual({ u0: 0, u1: 0.5, v0: 0.5, v1: 1 });
    expect(childUvRect({ z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })).toEqual({ u0: 0.5, u1: 1, v0: 0, v1: 0.5 });
    expect(childUvRect({ z: 10, x: 5, y: 5 }, { z: 12, x: 20, y: 20 })).toEqual({ u0: 0, u1: 0.25, v0: 0.75, v1: 1 });
    expect(childUvRect({ z: 10, x: 5, y: 5 }, { z: 11, x: 99, y: 99 })).toBeNull();

    // Close-up NYC camera selects z=18 ArcGIS tiles
    const [cx, cy, cz] = bodyLatLonToLocal('Earth', 40.7128, -74.006);
    const d = 1 + 0.15 / 6371; // 150 m altitude
    const sel = selectTiles(earth, {
      position: [cx * d, cy * d, cz * d],
      pixelsPerRadian: 1080 / (2 * Math.tan((55 * Math.PI) / 360)),
      bodyName: 'Earth',
    });
    expect(sel.length).toBeGreaterThan(0);
    expect(Math.max(...sel.map((k) => k.z))).toBe(18);

    // Velocity lookahead selects prioritized tiles along travel vector
    const withVel = selectTilesWithPriority(earth, {
      position: [cx * d, cy * d, cz * d],
      velocity: [0, 0.0001, 0],
      lookaheadSec: 3,
      pixelsPerRadian: 1080 / (2 * Math.tan((55 * Math.PI) / 360)),
      bodyName: 'Earth',
    });
    expect(withVel.length).toBeGreaterThan(0);
    expect(withVel[0].priority).toBeLessThanOrEqual(withVel[withVel.length - 1].priority);
  });
});

describe('Landing views on other worlds', () => {
  it('stands high over flat imagery, lower over real relief, and under the haze on Titan', () => {
    expect(imageryEyeKm(BODY_IMAGERY.Moon, true)).toBeLessThan(1);
    expect(imageryEyeKm(BODY_IMAGERY.Io, false)).toBeGreaterThan(20);
    expect(imageryEyeKm(BODY_IMAGERY.Titan, false)).toBeLessThanOrEqual(1.5);
  });

  it('steps back from features on flat worlds so a downward look lands on them', () => {
    const loki = LANDMARKS.find((l) => l.id === 'io-loki')!;
    expect(loki.vantageLat).toBeDefined();
    expect(loki.viewPitchDeg).toBeLessThan(0);
    const backDeg = angularDistanceDeg(loki.lat, loki.lon, loki.vantageLat!, loki.vantageLon!);
    expect(backDeg).toBeGreaterThan(1); // ~160 km on Io, a few degrees
    expect(backDeg).toBeLessThan(10);
  });

  it('never lands at a pole, where the equirectangular tiles break down', () => {
    for (const l of LANDMARKS) if (l.body !== 'Earth') expect(Math.abs(l.vantageLat ?? l.lat), l.id).toBeLessThan(85);
  });
});
