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

/** True when the tile's clipped extent is non-empty (GIBS edge tiles can fall entirely outside). */
function hasArea(grid: EquirectGrid, k: TileKey): boolean {
  const b = tileBounds(grid, k);
  return b.clipEast > b.clipWest && b.clipNorth > b.clipSouth;
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

export function localToLatLon(x: number, y: number, z: number): { lat: number; lon: number } {
  const r = Math.hypot(x, y, z) || 1;
  return { lat: Math.asin(Math.max(-1, Math.min(1, y / r))) / DEG, lon: Math.atan2(-z, x) / DEG };
}

/** Centre direction and angular radius (radians) of the drawn part of a tile. */
export function tileCap(grid: EquirectGrid, k: TileKey): { centre: [number, number, number]; radius: number } {
  const b = tileBounds(grid, k);
  const lat = (b.clipNorth + b.clipSouth) / 2;
  const lon = (b.clipWest + b.clipEast) / 2;
  const centre = latLonToLocal(lat, lon);
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
    const p = latLonToLocal(la, lo);
    const d = Math.acos(Math.max(-1, Math.min(1, p[0] * centre[0] + p[1] * centre[1] + p[2] * centre[2])));
    radius = Math.max(radius, d);
  }
  return { centre, radius };
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
}

/**
 * Screen-space-error quadtree selection. A tile is refined while one of its source pixels would
 * cover more than `maxPixelsPerTexel` screen pixels at its nearest visible point. Tiles beyond the
 * horizon or outside the view are dropped. Returns leaves ordered nearest first.
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
  const horizon = Math.acos(Math.min(1, 1 / d)); // angle from the sub-camera point to the horizon

  const leaves: Array<{ k: TileKey; dist: number }> = [];
  const stack: TileKey[] = rootTiles(grid).filter((k) => hasArea(grid, k));

  while (stack.length > 0) {
    const k = stack.pop()!;
    const { centre, radius } = tileCap(grid, k);
    const angle = Math.acos(Math.max(-1, Math.min(1, centre[0] * dir[0] + centre[1] * dir[1] + centre[2] * dir[2])));
    if (angle - radius > horizon + 0.02) continue; // entirely behind the horizon
    if (cam.isCapVisible && !cam.isCapVisible(centre, radius)) continue;

    // Distance from the camera to the nearest point of the tile on the sphere
    const nearest = Math.max(0, angle - radius);
    const dist = Math.sqrt(Math.max(1e-12, d * d + 1 - 2 * d * Math.cos(nearest)));
    const pxPerTexel = (texelAngle(grid, k.z) / dist) * cam.pixelsPerRadian;

    const children = k.z < grid.maxLevel ? childTiles(grid, k) : [];
    if (pxPerTexel > maxPixelsPerTexel && children.length > 0 && leaves.length + stack.length < maxTiles * 4) {
      stack.push(...children);
    } else {
      leaves.push({ k, dist });
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
