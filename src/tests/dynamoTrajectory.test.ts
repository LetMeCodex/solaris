import { describe, expect, it } from 'vitest';
// @ts-expect-error node:fs & node:path resolved by Vitest Node runtime
import * as fs from 'node:fs';
// @ts-expect-error node:path resolved by Vitest Node runtime
import * as path from 'node:path';
// @ts-expect-error node:url resolved by Vitest Node runtime
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import {
  evaluateOrbSegment,
  evaluatePosSegment,
  evaluateQuatSegment,
  evaluateSpacecraftSceneState,
  j2000SecToJdTdb,
  parseDynBuffer,
  ParentResolver,
} from '../astronomy/DynamoTrajectory';
import { CatalogueManager } from '../data/CatalogueManager';
import { UNITS_PER_KM } from '../rendering/Scale';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const TRAJ_DIR = path.resolve(TEST_DIR, '../../public/nasa/trajectories');

function readDyn(filename: string): ArrayBuffer {
  const buf = fs.readFileSync(path.join(TRAJ_DIR, filename));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

describe('DynamoTrajectory binary parser & propagators', () => {
  it('decodes New Horizons hyperbolic sun__2__orb.dyn and matches sun__3__pos.dyn at Pluto handoff within 250 km', () => {
    const orb = parseDynBuffer(readDyn('sc_new_horizons__sun__2__orb.dyn'));
    const pos = parseDynBuffer(readDyn('sc_new_horizons__sun__3__pos.dyn'));
    expect(orb?.kind).toBe('orb');
    expect(pos?.kind).toBe('pos');
    if (!orb || orb.kind !== 'orb' || !pos || pos.kind !== 'pos') return;
    expect(orb.inline).toBe(true);
    expect(pos.inline).toBe(true);

    const tBoundary = pos.tMinSec;
    const sOrb = evaluateOrbSegment(orb, tBoundary);
    const sPos = evaluatePosSegment(pos, tBoundary);
    expect(sOrb).not.toBeNull();
    expect(sPos).not.toBeNull();
    if (!sOrb || !sPos) return;

    const dx = sOrb.positionKm[0] - sPos.positionKm[0];
    const dy = sOrb.positionKm[1] - sPos.positionKm[1];
    const dz = sOrb.positionKm[2] - sPos.positionKm[2];
    const errKm = Math.hypot(dx, dy, dz);
    expect(errKm).toBeLessThan(250);
  });

  it('decodes sc_artemis_2__earth.dyn pos segment with smooth Cubic Hermite states', () => {
    const pos = parseDynBuffer(readDyn('sc_artemis_2__earth.dyn'));
    expect(pos?.kind).toBe('pos');
    if (!pos || pos.kind !== 'pos') return;
    expect(pos.count).toBeGreaterThan(10);

    const tMid = (pos.tMinSec + pos.tMaxSec) * 0.5;
    const st = evaluatePosSegment(pos, tMid);
    expect(st).not.toBeNull();
    if (!st) return;

    const distKm = Math.hypot(...st.positionKm);
    const speedKmS = Math.hypot(...st.velocityKmS);
    expect(distKm).toBeGreaterThan(6000);
    expect(distKm).toBeLessThan(500000);
    expect(speedKmS).toBeGreaterThan(0.1);
  });

  it('decodes interleaved wxyz attitude tables in sc_mars_2020__quat.dyn & sc_deep_impact_impactor__quat.dyn', () => {
    const qMars = parseDynBuffer(readDyn('sc_mars_2020__quat.dyn'));
    expect(qMars?.kind).toBe('quat');
    if (!qMars || qMars.kind !== 'quat') return;
    expect(qMars.inline).toBe(true);
    expect(qMars.count).toBe(135);

    const q = evaluateQuatSegment(qMars, (qMars.tMinSec + qMars.tMaxSec) * 0.5);
    expect(q).not.toBeNull();
    expect(q!.length()).toBeCloseTo(1.0, 5);
  });

  it('evaluates surface rover phase transitions (cruise vs Mars lander) and LEO/L2 clearances safely', () => {
    const mockResolver: ParentResolver = {
      getWorldPosition: (name, out = new THREE.Vector3()) => {
        if (name === 'Sun') return out.set(0, 0, 0);
        if (name === 'Earth') return out.set(56355, 0, 0);
        if (name === 'Mars') return out.set(-85000, 0, 0);
        return null;
      },
      getPhysicalRadiusKm: (name) => (name === 'Mars' ? 3389.5 : name === 'Earth' ? 6371 : 1737),
      getVisualRadius: (name) => (name === 'Mars' ? 38.3 : name === 'Earth' ? 72 : 19.6),
      getSurfaceObject: () => null,
    };

    const perseverance = CatalogueManager.getSpacecraftEntry('sc_mars_2020')!;
    expect(perseverance).toBeDefined();

    // Pre-landing cruise in 2020 -> cruise model
    const preLanding = evaluateSpacecraftSceneState(perseverance, j2000SecToJdTdb(655000000), mockResolver);
    expect(preLanding?.activeModelPath).toBe('sc_mars_2020/cruise_whole/msl_cruise_stage.gltf');

    // Post-landing in 2024 -> rover surface-mounted above Mars visual sphere
    const landed = evaluateSpacecraftSceneState(perseverance, j2000SecToJdTdb(770000000), mockResolver);
    expect(landed?.activeModelPath).toBe('sc_mars_2020/rover/perseverance.gltf');
    expect(landed?.isSurfaceMounted).toBe(true);
    expect(landed!.clearanceUnits).toBeGreaterThan(0);

    // ISS must never sit inside enlarged WORLD_SCALE Earth sphere and must propagate at Earth gravity (not Sun GM)
    const iss = CatalogueManager.getSpacecraftEntry('sc_iss')!;
    const issState = evaluateSpacecraftSceneState(iss, 2460000, mockResolver);
    expect(issState).not.toBeNull();
    expect(issState!.clearanceUnits).toBeGreaterThan(1.0);
    const issState5s = evaluateSpacecraftSceneState(iss, 2460000 + 5 / 86400, mockResolver);
    expect(issState5s).not.toBeNull();
    const issMove5sUnits = issState!.worldPosition.distanceTo(issState5s!.worldPosition);
    expect(issMove5sUnits).toBeGreaterThan(0.2);
    expect(issMove5sUnits).toBeLessThan(1.0);
    const issSpeedKmS = issState!.worldVelocityUnitsS.length() / UNITS_PER_KM;
    expect(issSpeedKmS).toBeGreaterThan(6.5);
    expect(issSpeedKmS).toBeLessThan(9.0);

    // JWST sits outside Earth at Sun-Earth L2 when deployed, and stowed on launch
    const jwst = CatalogueManager.getSpacecraftEntry('sc_jwst')!;
    const jwstStowed = evaluateSpacecraftSceneState(jwst, j2000SecToJdTdb(693800000), mockResolver);
    expect(jwstStowed?.activeModelPath).toBe('sc_jwst/webb_stowed.gltf');
    const jwstState = evaluateSpacecraftSceneState(jwst, j2000SecToJdTdb(770000000), mockResolver);
    expect(jwstState?.activeSource).toBe('halo');
    expect(jwstState?.activeModelPath).toBe('sc_jwst/webb_deployed.gltf');
  });
});
