/**
 * 64x64x64 tileable 3D Perlin + Worley noise generator ported from CloudSea (cloud-noise).
 *
 * Channels (RGBA Uint8):
 *  - R: 4-octave domain-warped 3D Perlin / gradient FBM
 *  - G: 3D Worley F1 cellular noise (4^3 grid)
 *  - B: 3D Worley F1 cellular noise (8^3 grid)
 *  - A: 3D Worley F1 cellular noise (16^3 grid)
 */

export const CLOUD_NOISE_SIZE = 64;

const clamp01Byte = (v: number): number => Math.round(Math.min(1, Math.max(0, v)) * 255);

function hash3(x: number, y: number, z: number, seed: number): number {
  let h = (x * 374761393 + y * 668265263 + z * 2147483647 + seed) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0);
}

const GRADS: readonly [number, number, number][] = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
];

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function perlinFbm3D(
  size: number,
  octaves: number,
  baseFreq: number,
  warpStrength: number,
  state: { calls: number },
): Float32Array {
  const out = new Float32Array(size * size * size);
  const warp =
    warpStrength > 0
      ? [
          perlinFbm3D(size, 2, baseFreq, 0, state),
          perlinFbm3D(size, 2, baseFreq, 0, state),
          perlinFbm3D(size, 2, baseFreq, 0, state),
        ]
      : null;

  state.calls += 1;
  const callSalt = state.calls * 7919;

  const gradDot = (ix: number, iy: number, iz: number, period: number, seed: number, dx: number, dy: number, dz: number): number => {
    const px = ((ix % period) + period) % period;
    const py = ((iy % period) + period) % period;
    const pz = ((iz % period) + period) % period;
    const g = GRADS[hash3(px, py, pz, seed + callSalt) % 12];
    return g[0] * dx + g[1] * dy + g[2] * dz;
  };

  let amp = 1;
  let ampSum = 0;
  let freq = baseFreq;

  for (let o = 0; o < octaves; o++) {
    const seed = 1013 * (o + 1);
    for (let z = 0; z < size; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const idx = (z * size + y) * size + x;
          const wx = warp ? (warp[0][idx] - 0.5) * warpStrength : 0;
          const wy = warp ? (warp[1][idx] - 0.5) * warpStrength : 0;
          const wz = warp ? (warp[2][idx] - 0.5) * warpStrength : 0;

          const sx = (x / size + wx) * freq;
          const sy = (y / size + wy) * freq;
          const sz = (z / size + wz) * freq;

          const ix = Math.floor(sx);
          const iy = Math.floor(sy);
          const iz = Math.floor(sz);

          const dx = sx - ix;
          const dy = sy - iy;
          const dz = sz - iz;

          const fx = fade(dx);
          const fy = fade(dy);
          const fz = fade(dz);

          const n000 = gradDot(ix, iy, iz, freq, seed, dx, dy, dz);
          const n100 = gradDot(ix + 1, iy, iz, freq, seed, dx - 1, dy, dz);
          const n010 = gradDot(ix, iy + 1, iz, freq, seed, dx, dy - 1, dz);
          const n110 = gradDot(ix + 1, iy + 1, iz, freq, seed, dx - 1, dy - 1, dz);
          const n001 = gradDot(ix, iy, iz + 1, freq, seed, dx, dy, dz - 1);
          const n101 = gradDot(ix + 1, iy, iz + 1, freq, seed, dx - 1, dy, dz - 1);
          const n011 = gradDot(ix, iy + 1, iz + 1, freq, seed, dx, dy - 1, dz - 1);
          const n111 = gradDot(ix + 1, iy + 1, iz + 1, freq, seed, dx - 1, dy - 1, dz - 1);

          const val = lerp(
            lerp(lerp(n000, n100, fx), lerp(n010, n110, fx), fy),
            lerp(lerp(n001, n101, fx), lerp(n011, n111, fx), fy),
            fz,
          );
          out[idx] += val * amp;
        }
      }
    }
    ampSum += amp;
    amp *= 0.5;
    freq *= 2;
  }

  for (let i = 0; i < out.length; i++) {
    out[i] = Math.min(1, Math.max(0, 0.5 + (out[i] / ampSum) * 0.75));
  }
  return out;
}

function worley3D(size: number, cells: number): Float32Array {
  const out = new Float32Array(size * size * size);
  const pts = new Float32Array(cells * cells * cells * 3);

  for (let z = 0; z < cells; z++) {
    for (let y = 0; y < cells; y++) {
      for (let x = 0; x < cells; x++) {
        const k = ((z * cells + y) * cells + x) * 3;
        pts[k] = x + hash3(x, y, z, 7 * cells) / 4294967296;
        pts[k + 1] = y + hash3(x, y, z, 11 * cells) / 4294967296;
        pts[k + 2] = z + hash3(x, y, z, 13 * cells) / 4294967296;
      }
    }
  }

  for (let z = 0; z < size; z++) {
    const fz = (z / size) * cells;
    const iz = Math.floor(fz);
    for (let y = 0; y < size; y++) {
      const fy = (y / size) * cells;
      const iy = Math.floor(fy);
      for (let x = 0; x < size; x++) {
        const fx = (x / size) * cells;
        const ix = Math.floor(fx);
        let minSq = 1e9;

        for (let dz = -1; dz <= 1; dz++) {
          const cz = iz + dz;
          const wz = ((cz % cells) + cells) % cells;
          for (let dy = -1; dy <= 1; dy++) {
            const cy = iy + dy;
            const wy = ((cy % cells) + cells) % cells;
            for (let dx = -1; dx <= 1; dx++) {
              const cx = ix + dx;
              const wx = ((cx % cells) + cells) % cells;
              const k = ((wz * cells + wy) * cells + wx) * 3;
              const px = pts[k] - wx + cx - fx;
              const py = pts[k + 1] - wy + cy - fy;
              const pz = pts[k + 2] - wz + cz - fz;
              const dSq = px * px + py * py + pz * pz;
              if (dSq < minSq) minSq = dSq;
            }
          }
        }
        out[(z * size + y) * size + x] = Math.max(0, 1 - Math.sqrt(minSq));
      }
    }
  }

  return out;
}

export function generateCloudNoise(size = CLOUD_NOISE_SIZE): { data: Uint8Array; mean: number } {
  const total = size * size * size;
  const data = new Uint8Array(total * 4);
  const state = { calls: 0 };
  const r = perlinFbm3D(size, 4, 2, 1.8, state);
  const g = worley3D(size, 4);
  const b = worley3D(size, 8);
  const a = worley3D(size, 16);

  let sum = 0;
  for (let i = 0; i < total; i++) {
    data[i * 4] = clamp01Byte(r[i]);
    sum += r[i];
    data[i * 4 + 1] = clamp01Byte(g[i]);
    data[i * 4 + 2] = clamp01Byte(b[i]);
    data[i * 4 + 3] = clamp01Byte(a[i]);
  }
  return { data, mean: sum / total };
}
