import { EquirectGrid } from './ImageryRegistry';

/** A tile of an equirectangular (plate carrée) pyramid whose origin is (−180°, +90°). */
export interface TileKey {
  z: number;
  x: number; // column, west → east
  y: number; // row, north → south
}

export interface TileBounds {
  /** Full nominal extent of the tile image (may run past ±180° / ±90° on GIBS grids). */
  west: number;
  east: number;
  north: number;
  south: number;
  /** Extent clipped to the globe — the part that is drawn. */
  clipWest: number;
  clipEast: number;
  clipNorth: number;
  clipSouth: number;
}

export const tileId = (k: TileKey) => `${k.z}/${k.y}/${k.x}`;

export function tileDeg(grid: EquirectGrid, z: number): number {
  return grid.level0TileDeg / Math.pow(2, z);
}

/** Number of columns / rows that exist at a level (partial tiles at the east / south edges count). */
export function matrixSize(grid: EquirectGrid, z: number): { cols: number; rows: number } {
  const d = tileDeg(grid, z);
  return { cols: Math.ceil(360 / d - 1e-9), rows: Math.ceil(180 / d - 1e-9) };
}

export function tileBounds(grid: EquirectGrid, k: TileKey): TileBounds {
  const d = tileDeg(grid, k.z);
  const west = -180 + k.x * d;
  const north = 90 - k.y * d;
  const east = west + d;
  const south = north - d;
  return {
    west, east, north, south,
    clipWest: Math.max(-180, west),
    clipEast: Math.min(180, east),
    clipNorth: Math.min(90, north),
    clipSouth: Math.max(-90, south),
  };
}

export function tileExists(grid: EquirectGrid, k: TileKey): boolean {
  if (k.z < grid.minLevel || k.z > grid.maxLevel) return false;
  const { cols, rows } = matrixSize(grid, k.z);
  return k.x >= 0 && k.y >= 0 && k.x < cols && k.y < rows;
}

export function rootTiles(grid: EquirectGrid): TileKey[] {
  const { cols, rows } = matrixSize(grid, grid.minLevel);
  const out: TileKey[] = [];
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) out.push({ z: grid.minLevel, x, y });
  return out;
}

export function childTiles(grid: EquirectGrid, k: TileKey): TileKey[] {
  const out: TileKey[] = [];
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 2; i++) {
      const c = { z: k.z + 1, x: k.x * 2 + i, y: k.y * 2 + j };
      if (tileExists(grid, c) && hasArea(grid, c)) out.push(c);
    }
  }
  return out;
}

export function parentTile(k: TileKey): TileKey | null {
  if (k.z === 0) return null;
  return { z: k.z - 1, x: Math.floor(k.x / 2), y: Math.floor(k.y / 2) };
}

/** True when the tile's clipped extent overlaps the grid's valid latitude band and has non-zero area. */
function hasArea(grid: EquirectGrid, k: TileKey): boolean {
  const b = tileBounds(grid, k);
  if (b.clipEast <= b.clipWest || b.clipNorth <= b.clipSouth) return false;
  const minLat = grid.minLat ?? -90;
  const maxLat = grid.maxLat ?? 90;
  return Math.min(b.clipNorth, maxLat) > Math.max(b.clipSouth, minLat);
}

const DEG = Math.PI / 180;

/**
 * Body-fixed unit vector for (lat, lon) in the globe mesh's local frame. Three.js SphereGeometry
 * places texture longitude 0 on local +X with east towards local −Z and north on +Y; tiles must
 * use the same convention so they line up with the base globe map.
 */
export function latLonToLocal(latDeg: number, lonDeg: number): [number, number, number] {
  const lat = latDeg * DEG;
  const lon = lonDeg * DEG;
  return [Math.cos(lat) * Math.cos(lon), Math.sin(lat), -Math.cos(lat) * Math.sin(lon)];
}

/** Earth's flattening (WGS84). */
export const EARTH_FLATTENING = 1 / 298.257223563;

/**
 * A point on a body's surface in its mesh's local frame, for a geodetic latitude. Earth is drawn
 * as a unit sphere squashed at the poles by its flattening f, so a point placed at angle beta on
 * the sphere lands, after the squash, at geodetic latitude phi where tan(beta) = (1 - f) tan(phi)
 * (the parametric latitude). Earth's maps, heights, landmarks and Google's 3D tiles all use
 * geodetic latitude; placing by it directly put things up to ~10 km (0.1 degree) off. Other
 * bodies keep the plain mapping (their data use planetocentric latitude).
 */
export function bodyLatLonToLocal(body: string, latDeg: number, lonDeg: number): [number, number, number] {
  if (body !== 'Earth') return latLonToLocal(latDeg, lonDeg);
  const beta = Math.atan((1 - EARTH_FLATTENING) * Math.tan(latDeg * DEG)) / DEG;
  return latLonToLocal(Math.abs(latDeg) >= 90 ? latDeg : beta, lonDeg);
}

export function localToLatLon(x: number, y: number, z: number): { lat: number; lon: number } {
  const r = Math.hypot(x, y, z) || 1;
  return { lat: Math.asin(Math.max(-1, Math.min(1, y / r))) / DEG, lon: Math.atan2(-z, x) / DEG };
}

/**
 * Inverts bodyLatLonToLocal: given a point on/near a body's surface in its mesh's local frame,
 * returns the body's true geodetic latitude (inverted WGS84 flattening for Earth) and longitude.
 */
export function bodyLocalToLatLon(body: string, x: number, y: number, z: number): { lat: number; lon: number } {
  const s = localToLatLon(x, y, z);
  if (body !== 'Earth' || Math.abs(s.lat) >= 89.999) return s;
  const beta = s.lat * DEG;
  const phi = Math.atan(Math.tan(beta) / (1 - EARTH_FLATTENING)) / DEG;
  return { lat: phi, lon: s.lon };
}

/** Centre direction and angular radius (radians) of the drawn part of a tile. */
export function tileCap(grid: EquirectGrid, k: TileKey, bodyName: string = ''): { centre: [number, number, number]; radius: number } {
  const b = tileBounds(grid, k);
  const lat = (b.clipNorth + b.clipSouth) / 2;
  const lon = (b.clipWest + b.clipEast) / 2;
  const centre = bodyLatLonToLocal(bodyName, lat, lon);
  // Largest angular distance from the centre to a corner
  let radius = 0;
  // Corners, edge midpoints and — for tiles spanning the equator — the equatorial edge points,
  // where wide tiles (e.g. GIBS 288° roots) reach furthest from their centre.
  const pts: Array<[number, number]> = [
    [b.clipNorth, b.clipWest], [b.clipNorth, b.clipEast], [b.clipSouth, b.clipWest], [b.clipSouth, b.clipEast],
    [b.clipNorth, lon], [b.clipSouth, lon], [lat, b.clipWest], [lat, b.clipEast],
  ];
  if (b.clipNorth > 0 && b.clipSouth < 0) pts.push([0, b.clipWest], [0, b.clipEast]);
  for (const [la, lo] of pts) {
    const p = bodyLatLonToLocal(bodyName, la, lo);
    const d = Math.acos(Math.max(-1, Math.min(1, p[0] * centre[0] + p[1] * centre[1] + p[2] * centre[2])));
    radius = Math.max(radius, d);
  }
  return { centre, radius: Math.min(Math.PI, radius) };
}

/** Angular size (radians) of one source pixel of a tile at the equator. */
export function texelAngle(grid: EquirectGrid, z: number): number {
  return (tileDeg(grid, z) / grid.tileSize) * DEG;
}

export interface SelectionCamera {
  /** Camera position in the globe's local frame, in body radii (|p| = 1 on the surface). */
  position: [number, number, number];
  /** Screen pixels per radian at the view centre. */
  pixelsPerRadian: number;
  /** Optional extra culling (e.g. frustum) on a tile cap in local coordinates. */
  isCapVisible?: (centre: [number, number, number], radius: number) => boolean;
  /**
   * Height of the real ground around the camera, in body radii (raised terrain). Detail is chosen
   * by the distance to that ground, not to the sea-level sphere; the horizon stays the sea-level
   * one, so distant peaks are still drawn.
   */
  groundLift?: number;
  /** Optional body name for geodetic cap geometry (WGS84 flattening on Earth). */
  bodyName?: string;
}

interface CandidateNode {
  k: TileKey;
  dist: number;
  pxPerTexel: number;
}

/**
 * Best-first screen-space-error quadtree selection. Highest-error (nearest / most under-sampled)
 * visible tiles refine first, guaranteeing foreground/near-camera tiles are never starved behind
 * distant branches. Returns visible leaves ordered nearest first.
 */
export function selectTiles(
  grid: EquirectGrid,
  cam: SelectionCamera,
  maxPixelsPerTexel: number = 1.3,
  maxTiles: number = 160
): TileKey[] {
  const [px, py, pz] = cam.position;
  const d = Math.hypot(px, py, pz);
  if (d <= 1) return [];
  const dir: [number, number, number] = [px / d, py / d, pz / d];
  const groundLift = Math.max(0, cam.groundLift ?? 0);
  const g = 1 + groundLift;
  const horizon =
    Math.acos(Math.min(1, 1 / d)) +
    (groundLift > 0 ? Math.min(0.08, Math.sqrt(2 * groundLift) + 0.03) : 0.02);
  const bodyName = cam.bodyName ?? '';

  const evaluate = (k: TileKey): CandidateNode | null => {
    const { centre, radius } = tileCap(grid, k, bodyName);
    const angle = Math.acos(Math.max(-1, Math.min(1, centre[0] * dir[0] + centre[1] * dir[1] + centre[2] * dir[2])));
    if (angle - radius > horizon) return null; // entirely behind the horizon
    if (cam.isCapVisible && !cam.isCapVisible(centre, radius)) return null;
    const nearest = Math.max(0, angle - radius);
    const dist = Math.sqrt(Math.max(1e-12, d * d + g * g - 2 * d * g * Math.cos(nearest)));
    const pxPerTexel = (texelAngle(grid, k.z) / Math.max(1e-6, dist)) * cam.pixelsPerRadian;
    return { k, dist, pxPerTexel };
  };

  const active: CandidateNode[] = [];
  const leaves: CandidateNode[] = [];
  for (const rk of rootTiles(grid)) {
    if (!hasArea(grid, rk)) continue;
    const node = evaluate(rk);
    if (node) active.push(node);
  }

  while (active.length > 0) {
    let bestIdx = -1;
    let bestErr = -1;
    for (let i = 0; i < active.length; i++) {
      const c = active[i];
      if (c.pxPerTexel <= maxPixelsPerTexel || c.k.z >= grid.maxLevel) continue;
      if (c.pxPerTexel > bestErr) {
        bestErr = c.pxPerTexel;
        bestIdx = i;
      }
    }
    if (bestIdx < 0) {
      leaves.push(...active);
      break;
    }
    const node = active.splice(bestIdx, 1)[0];
    const children: CandidateNode[] = [];
    for (const ck of childTiles(grid, node.k)) {
      const child = evaluate(ck);
      if (child) children.push(child);
    }
    if (children.length === 0) continue;
    if (leaves.length + active.length + children.length > maxTiles) {
      // Keep this coarser tile whole so the view stays covered within the tile budget
      leaves.push(node);
      continue;
    }
    for (const ch of children) {
      if (ch.pxPerTexel > maxPixelsPerTexel && ch.k.z < grid.maxLevel) active.push(ch);
      else leaves.push(ch);
    }
  }

  leaves.sort((a, b) => a.dist - b.dist);
  return leaves.slice(0, maxTiles).map((l) => l.k);
}

/** WMS GetMap bbox (minLon,minLat,maxLon,maxLat) for a tile's nominal extent. */
export function wmsBbox(grid: EquirectGrid, k: TileKey): string {
  const b = tileBounds(grid, k);
  return `${b.west},${b.south},${b.east},${b.north}`;
}
