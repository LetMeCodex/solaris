import { describe, it, expect, afterEach } from 'vitest';
import everestMeta from '../../public/data/everest/everest_meta.json';
import { getLandmark, landmarksFor } from '../explorer/Landmarks';
import { earthElevation } from '../explorer/Elevation';
import {
  EverestProceduralRegion,
  EVEREST_PROCEDURAL_ID,
  EVEREST_CENTER_LAT,
  EVEREST_CENTER_LON,
  EVEREST_ACTIVE_RADIUS_KM,
  EVEREST_VANTAGES,
} from '../explorer/EverestProceduralRegion';

describe('Mount Everest 1:1 Zero-API Procedural Region', () => {
  afterEach(() => {
    earthElevation.suppressedBox = null;
  });

  it('adds earth-everest-procedural as a brand-new landmark without touching original earth-everest', () => {
    const original = getLandmark('earth-everest');
    const procedural = getLandmark(EVEREST_PROCEDURAL_ID);

    expect(original).toBeDefined();
    expect(original!.name).toBe('Mount Everest');
    expect(original!.body).toBe('Earth');
    expect(original!.lat).toBeCloseTo(27.9881, 3);
    expect(original!.lon).toBeCloseTo(86.9253, 3);

    expect(procedural).toBeDefined();
    expect(procedural!.id).toBe('earth-everest-procedural');
    expect(procedural!.body).toBe('Earth');
    expect(procedural!.name).toContain('Procedural');

    const earthLandmarks = landmarksFor('Earth');
    const origIdx = earthLandmarks.findIndex((l) => l.id === 'earth-everest');
    const procIdx = earthLandmarks.findIndex((l) => l.id === EVEREST_PROCEDURAL_ID);
    expect(origIdx).toBeGreaterThanOrEqual(0);
    expect(procIdx).toBe(origIdx + 1);
  });

  it('ships valid opaque 1:1 baked Everest DEM metadata calibrated to 8,849 m summit', () => {
    expect(everestMeta.encoding.opaqueAlpha).toBe(true);
    expect(everestMeta.summit.elevM).toBeGreaterThanOrEqual(8830);
    expect(everestMeta.summit.elevM).toBeLessThanOrEqual(8870);
    expect(everestMeta.core.cellM).toBeLessThan(20);
    expect(everestMeta.region.size).toBe(1024);
    expect(everestMeta.core.size).toBe(1024);
  });

  it('defines 6 canonical research vantage presets safely inside the active procedural radius', () => {
    expect(EVEREST_VANTAGES.length).toBe(6);
    for (const v of EVEREST_VANTAGES) {
      const distKm = EverestProceduralRegion.distanceFromSummitKm(v.lat, v.lon);
      expect(distKm, `vantage ${v.id} outside active radius`).toBeLessThan(EVEREST_ACTIVE_RADIUS_KM);
      expect(v.mslKm).toBeGreaterThan(5.4);
      expect(v.mslKm).toBeLessThan(15);
    }
    expect(EverestProceduralRegion.distanceFromSummitKm(EVEREST_CENTER_LAT, EVEREST_CENTER_LON)).toBeCloseTo(0, 6);
  });

  it('suppresses external S3 DEM tile fetches inside the Everest box when suppressedBox is set', async () => {
    earthElevation.suppressedBox = { south: 27.3, west: 86.2, north: 28.7, east: 87.7 };
    const beforeCount = earthElevation.loadedCount;
    await earthElevation.ensure(27.9, 86.8, 28.1, 87.0, 12);
    expect(earthElevation.loadedCount).toBe(beforeCount);
  });
});
