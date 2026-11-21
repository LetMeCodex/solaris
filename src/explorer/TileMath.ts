import { MAX_MERCATOR_LAT, type EquirectGrid, type TileGrid } from './ImageryRegistry';

export { MAX_MERCATOR_LAT };

/** A tile of an equirectangular or Web Mercator pyramid whose origin is west-north (−180°, north). */
export interface TileKey {
  z: number;
  x: number; // column, west → east
  y: number; // row, north → south
}

export interface TileBounds {
  /** Full nominal extent of the tile image (may run past ±180° / ±90° on GIBS 4326 grids). */
  west: number;
  east: number;
  north: number;
  south: number;
  /** Extent clipped to the globe — the part that is drawn. */
  clipWest: number;
  clipEast: number;
  clipNorth: number;
  clipSouth: number;
  /** Web Mercator normalized Y bounds in [0..1] (0 = +85.0511°, 1 = −85.0511°), present for mercator grids. */
  mercNorth?: number;
  mercSouth?: number;
}

const DEG = Math.PI / 180;

export const tileId = (k: TileKey) => `${k.z}/${k.y}/${k.x}`;

/** True when the grid uses Web Mercator (EPSG:3857) projection rather than plate carrée. */
export function isMercatorGrid(grid: TileGrid): boolean {
  return grid.projection === 'mercator';
}

/** Normalized Web Mercator Y in [0..1] (0 at +85.0511°, 0.5 at equator, 1 at −85.0511°). */
export function latToMercatorY(latDeg: number): number {
  const clamped = Math.max(-MAX_MERCATOR_LAT, Math.min(MAX_MERCATOR_LAT, latDeg));
  const rad = clamped * DEG;
  return (1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2;
}

/** Inverse Web Mercator: normalized Y in [0..1] → geodetic latitude in degrees. */
export function mercatorYToLat(normY: number): number {
  const clamped = Math.max(0, Math.min(1, normY));
  return Math.atan(Math.sinh(Math.PI * (1 - 2 * clamped))) / DEG;
}

/** Convert (lat, lon) to integer + fractional Web Mercator tile coordinates at zoom `z`. */
export function latLonToMercatorTile(
  latDeg: number,
  lonDeg: number,
  z: number
): { x: number; y: number; fx: number; fy: number } {
  const n = Math.pow(2, z);
  const lon = ((((lonDeg + 180) % 360) + 360) % 360) - 180;
  const fx = ((lon + 180) / 360) * n;
  const fy = latToMercatorY(latDeg) * n;
  const x = Math.max(0, Math.min(n - 1, Math.floor(fx)));
  const y = Math.max(0, Math.min(n - 1, Math.floor(fy)));
  return { x, y, fx, fy };
}

export function tileDeg(grid: EquirectGrid, z: number): number {
  const base = isMercatorGrid(grid) ? 360 : grid.level0TileDeg;
  return base / Math.pow(2, z);
}

/** Number of columns / rows that exist at a level (partial tiles at the east / south edges count). */
export function matrixSize(grid: EquirectGrid, z: number): { cols: number; rows: number } {
  if (isMercatorGrid(grid)) {
    const n = Math.pow(2, z);
    return { cols: n, rows: n };
  }
  const d = tileDeg(grid, z);
  return { cols: Math.ceil(360 / d - 1e-9), rows: Math.ceil(180 / d - 1e-9) };
}

export function tileBounds(grid: EquirectGrid, k: TileKey): TileBounds {
  if (isMercatorGrid(grid)) {
    const n = Math.pow(2, k.z);
    const west = -180 + (k.x / n) * 360;
    const east = -180 + ((k.x + 1) / n) * 360;
    const mercNorth = k.y / n;
    const mercSouth = (k.y + 1) / n;
    const north = mercatorYToLat(mercNorth);
    const south = mercatorYToLat(mercSouth);
    return {
      west,
      east,
      north,
      south,
      clipWest: Math.max(-180, west),
      clipEast: Math.min(180, east),
      clipNorth: Math.min(MAX_MERCATOR_LAT, north),
      clipSouth: Math.max(-MAX_MERCATOR_LAT, south),
      mercNorth,
      mercSouth,
    };
  }
  const d = tileDeg(grid, k.z);
  const west = -180 + k.x * d;
  const north = 90 - k.y * d;
  const east = west + d;
  const south = north - d;
  return {
    west,
    east,
    north,
    south,
    clipWest: Math.max(-180, west),
    clipEast: Math.min(180, east),
    clipNorth: Math.min(90, north),
    clipSouth: Math.max(-90, south),
  };
}

/**
 * Exact Three.js texture UV `[u, v]` (`v = 1` at north edge, `v = 0` at south edge) for a
 * geographic point inside a tile. Uses Mercator-Y interpolation for `'mercator'` grids and linear
 * latitude interpolation for `'equirect'` grids so textures never warp at any zoom level.
 */
export function tileUv(grid: TileGrid, bounds: TileBounds, latDeg: number, lonDeg: number): [number, number] {
  const u = (lonDeg - bounds.west) / Math.max(1e-12, bounds.east - bounds.west);
  if (isMercatorGrid(grid)) {
    const mN = bounds.mercNorth ?? latToMercatorY(bounds.north);
    const mS = bounds.mercSouth ?? latToMercatorY(bounds.south);
    const mY = latToMercatorY(latDeg);
    const fracNorth = (mY - mN) / Math.max(1e-12, mS - mN);
    return [u, 1 - fracNorth];
  }
  return [u, (latDeg - bounds.south) / Math.max(1e-12, bounds.north - bounds.south)];
}

/**
 * Latitude for vertex row fraction `fracNorthToSouth` in `[0..1]` (`0` = `clipNorth`, `1` = `clipSouth`).
 * On `'mercator'` grids vertices step uniformly in Mercator Y so `v = 1 - fracNorthToSouth` is exact.
 */
export function tileLatAtFraction(grid: TileGrid, bounds: TileBounds, fracNorthToSouth: number): number {
  if (isMercatorGrid(grid)) {
    const mN = bounds.mercNorth ?? latToMercatorY(bounds.clipNorth);
    const mS = bounds.mercSouth ?? latToMercatorY(bounds.clipSouth);
    return mercatorYToLat(mN + (mS - mN) * fracNorthToSouth);
  }
  return bounds.clipNorth + (bounds.clipSouth - bounds.clipNorth) * fracNorthToSouth;
}

/**
 * UV sub-rectangle `{ u0, v0, u1, v1 }` of `child` inside an ancestor `parent` tile (Three.js
 * `flipY = true` convention: `v = 1` north, `v = 0` south). Works identically for both `'equirect'`
 * and `'mercator'` quadtrees because subdivision is exact power-of-two in tile/Mercator space.
 * Returns `null` if `child` is not a descendant of `parent`.
 */
export function childUvRect(
  parent: TileKey,
  child: TileKey
): { u0: number; v0: number; u1: number; v1: number } | null {
  const dz = child.z - parent.z;
  if (dz < 0) return null;
  if (dz === 0) {
    return child.x === parent.x && child.y === parent.y ? { u0: 0, v0: 0, u1: 1, v1: 1 } : null;
  }
  const n = Math.pow(2, dz);
  const ix = child.x - parent.x * n;
  const iy = child.y - parent.y * n;
  if (ix < 0 || ix >= n || iy < 0 || iy >= n) return null;
  return {
    u0: ix / n,
    u1: (ix + 1) / n,
    v0: 1 - (iy + 1) / n,
    v1: 1 - iy / n,
  };
}

export function tileExists(grid: EquirectGrid, k: TileKey): boolean {
  if (!Number.isInteger(k.z) || !Number.isInteger(k.x) || !Number.isInteger(k.y)) return false;
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
  const minLat = grid.minLat ?? (isMercatorGrid(grid) ? -MAX_MERCATOR_LAT : -90);
  const maxLat = grid.maxLat ?? (isMercatorGrid(grid) ? MAX_MERCATOR_LAT : 90);
  return Math.min(b.clipNorth, maxLat) > Math.max(b.clipSouth, minLat);
}

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

/** Exact float64 angular separation (radians) between two unit vectors (accurate down to sub-millimetre scale). */
function unitAngle(a: [number, number, number], b: [number, number, number]): number {
  const ch = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  return 2 * Math.asin(Math.min(1, ch * 0.5));
}

/** Numerically stable distance (body radii) from radius `d` to surface radius `g` at angular separation `angle`. */
function surfaceDist(d: number, g: number, angle: number): number {
  const dr = d - g;
  const s = Math.sin(angle * 0.5);
  return Math.sqrt(Math.max(1e-16, dr * dr + 4 * d * g * s * s));
}

/** Centre direction and angular radius (radians) of the drawn part of a tile. */
export function tileCap(
  grid: EquirectGrid,
  k: TileKey,
  bodyName: string = ''
): { centre: [number, number, number]; radius: number } {
  const b = tileBounds(grid, k);
  const lat = (b.clipNorth + b.clipSouth) / 2;
  const lon = (b.clipWest + b.clipEast) / 2;
  const centre = bodyLatLonToLocal(bodyName, lat, lon);
  if (b.clipEast - b.clipWest >= 359.9) {
    return { centre, radius: Math.PI };
  }
  // Largest angular distance from the centre to a corner
  let radius = 0;
  // Corners, edge midpoints and — for tiles spanning the equator — the equatorial edge points,
  // where wide tiles (e.g. GIBS 288° roots or Mercator z=0/1) reach furthest from their centre.
  const pts: Array<[number, number]> = [
    [b.clipNorth, b.clipWest], [b.clipNorth, b.clipEast], [b.clipSouth, b.clipWest], [b.clipSouth, b.clipEast],
    [b.clipNorth, lon], [b.clipSouth, lon], [lat, b.clipWest], [lat, b.clipEast],
  ];
  if (b.clipNorth > 0 && b.clipSouth < 0) pts.push([0, b.clipWest], [0, b.clipEast]);
  for (const [la, lo] of pts) {
    const p = bodyLatLonToLocal(bodyName, la, lo);
    const d = unitAngle(p, centre);
    radius = Math.max(radius, d);
  }
  return { centre, radius: Math.min(Math.PI, radius) };
}

/** Angular size (radians) of one source pixel of a tile at `latDeg` (equator by default). */
export function texelAngle(grid: EquirectGrid, z: number, latDeg = 0): number {
  if (isMercatorGrid(grid)) {
    const clamped = Math.max(-MAX_MERCATOR_LAT, Math.min(MAX_MERCATOR_LAT, latDeg));
    return (360 / Math.pow(2, z) / grid.tileSize) * DEG * Math.max(0.08, Math.cos(clamped * DEG));
  }
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
  /**
   * Optional camera/aircraft velocity in body-local radii per second for velocity-predictive
   * tile refinement & lookahead prefetching.
   */
  velocity?: [number, number, number];
  /** Optional lookahead horizon in seconds (default 3.0s when `velocity` is provided). */
  lookaheadSec?: number;
}

export interface SelectedTile {
  key: TileKey;
  /** Distance from camera to nearest point on tile cap (body radii). */
  dist: number;
  /** Screen pixels per source texel at this tile. */
  pxPerTexel: number;
  /** Lower = higher streaming priority (foreground & flight-path tiles first). */
  priority: number;
  /** True when tile is outside the current frustum but along the predicted velocity path. */
  lookahead: boolean;
}

interface CandidateNode {
  k: TileKey;
  dist: number;
  pxPerTexel: number;
  priority: number;
  lookahead: boolean;
}

/**
 * Best-first screen-space-error quadtree selection with priority metadata and optional
 * velocity-predictive lookahead. Highest-error visible tiles refine first, guaranteeing
 * foreground/near-camera tiles are never starved behind distant branches.
 */
export function selectTilesWithPriority(
  grid: EquirectGrid,
  cam: SelectionCamera,
  maxPixelsPerTexel: number = 1.3,
  maxTiles: number = 160
): SelectedTile[] {
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
  const mercator = isMercatorGrid(grid);

  // Optional velocity-predictive lookahead point (projected safely above surface)
  let hasLookahead = false;
  let aheadD = d;
  let aheadDir: [number, number, number] = dir;
  let aheadHorizon = horizon;
  let aheadMaxDist = 0;
  if (cam.velocity) {
    const [vx, vy, vz] = cam.velocity;
    const speed = Math.hypot(vx, vy, vz);
    if (Number.isFinite(speed) && speed > 1e-7) {
      const dt = Math.max(0.25, Math.min(10, cam.lookaheadSec ?? 3.0));
      let ax = px + vx * dt;
      let ay = py + vy * dt;
      let az = pz + vz * dt;
      let ad = Math.hypot(ax, ay, az);
      const minR = g + 1e-5;
      if (ad > 1e-9 && ad < minR) {
        const s = minR / ad;
        ax *= s;
        ay *= s;
        az *= s;
        ad = minR;
      }
      if (ad > 1) {
        hasLookahead = true;
        aheadD = ad;
        aheadDir = [ax / ad, ay / ad, az / ad];
        aheadHorizon =
          Math.acos(Math.min(1, 1 / ad)) +
          (groundLift > 0 ? Math.min(0.08, Math.sqrt(2 * groundLift) + 0.03) : 0.02);
        aheadMaxDist = Math.max((d - g) * 2.2, speed * dt * 0.75, 0.002);
      }
    }
  }

  const evaluate = (k: TileKey): CandidateNode | null => {
    const { centre, radius } = tileCap(grid, k, bodyName);
    const angle = unitAngle(centre, dir);
    const behindHorizon = angle - radius > horizon;
    const inFrustum = !behindHorizon && (!cam.isCapVisible || cam.isCapVisible(centre, radius));

    let lookahead = false;
    let dist: number;
    let priorityDist: number;

    if (inFrustum) {
      const nearest = Math.max(0, angle - radius);
      dist = surfaceDist(d, g, nearest);
      priorityDist = dist;
      if (hasLookahead) {
        const aAngle = unitAngle(centre, aheadDir);
        const aNearest = Math.max(0, aAngle - radius);
        const aDist = surfaceDist(aheadD, g, aNearest);
        // Boost tiles lying directly along the jet's predicted path
        if (aDist < dist) {
          dist = Math.min(dist, aDist * 1.12);
          priorityDist = Math.min(priorityDist, aDist * 0.92);
        }
      }
    } else if (hasLookahead) {
      const aAngle = unitAngle(centre, aheadDir);
      if (aAngle - radius > aheadHorizon) return null;
      const aNearest = Math.max(0, aAngle - radius);
      const aDist = surfaceDist(aheadD, g, aNearest);
      if (aDist > aheadMaxDist) return null;
      lookahead = true;
      dist = aDist * 1.25;
      // Keep off-frustum lookahead strictly behind visible foreground tiles in download priority
      priorityDist = aDist * 1.5 + 0.002;
    } else {
      return null;
    }

    const lat = mercator ? (tileBounds(grid, k).clipNorth + tileBounds(grid, k).clipSouth) / 2 : 0;
    const pxPerTexel = (texelAngle(grid, k.z, lat) / Math.max(1e-7, dist)) * cam.pixelsPerRadian;
    return { k, dist, pxPerTexel, priority: priorityDist, lookahead };
  };

  const active: CandidateNode[] = [];
  const leaves: CandidateNode[] = [];
  for (const rk of rootTiles(grid)) {
    if (!hasArea(grid, rk)) continue;
    const node = evaluate(rk);
    if (node) active.push(node);
  }

  const alt = Math.max(1e-6, d - g);
  while (active.length > 0) {
    let bestIdx = -1;
    let bestErr = -1;
    for (let i = 0; i < active.length; i++) {
      const c = active[i];
      if (c.pxPerTexel <= maxPixelsPerTexel || c.k.z >= grid.maxLevel) continue;
      // Favor immediate foreground tiles so near-camera ground hits full z17–18 before mid-ground rings exhaust maxTiles
      const nearBoost = 1 + 0.65 * (alt / Math.max(alt, c.dist));
      // Slightly discount off-frustum lookahead error so visible tiles never lose budget to prefetch
      const score = c.pxPerTexel * (c.lookahead ? 0.6 : nearBoost);
      if (score > bestErr) {
        bestErr = score;
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

  leaves.sort((a, b) => a.priority - b.priority);
  return leaves.slice(0, maxTiles).map((l) => ({
    key: l.k,
    dist: l.dist,
    pxPerTexel: l.pxPerTexel,
    priority: l.priority,
    lookahead: l.lookahead,
  }));
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
  return selectTilesWithPriority(grid, cam, maxPixelsPerTexel, maxTiles).map((s) => s.key);
}

/** WMS GetMap bbox (minLon,minLat,maxLon,maxLat) for a tile's nominal extent. */
export function wmsBbox(grid: EquirectGrid, k: TileKey): string {
  const b = tileBounds(grid, k);
  return `${b.west},${b.south},${b.east},${b.north}`;
}
