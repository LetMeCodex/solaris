/**
 * Web Worker for off-main-thread DEM decoding:
 * - Earth AWS Terrarium 24-bit RGB PNGs -> Float32Array (metres)
 * - Mars Esri LERC1 float32 rasters -> Float32Array (scaled km)
 * - Moon NASA Trek 8-bit greyscale PNGs -> smoothed Float32Array (km)
 *
 * Uses zero-copy Transferable ArrayBuffers in both directions so PNG decompression,
 * OffscreenCanvas rasterization, and pixel loops never block the render thread.
 */
import { decodeLerc1 } from './Lerc1';

export type DemDecodeRequest =
  | { id: number; kind: 'terrarium'; buffer: ArrayBuffer }
  | { id: number; kind: 'lerc1'; buffer: ArrayBuffer; scaleDivisor?: number }
  | { id: number; kind: 'trek8'; buffer: ArrayBuffer; a: number; b: number };

export type DemDecodeResponse =
  | { id: number; ok: true; width: number; height: number; heights: Float32Array }
  | { id: number; ok: false; error: string; fallbackMainThread?: boolean };

/** Decode Terrarium RGBA pixels into elevation metres (NaN where alpha === 0). */
export function decodeTerrariumRgba(
  rgba: Uint8ClampedArray | Uint8Array,
  w: number,
  h: number,
  out?: Float32Array
): Float32Array {
  const count = w * h;
  if (count <= 0) return new Float32Array(0);
  const heights = out && out.length === count ? out : new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const o = i * 4;
    if (rgba[o + 3] === 0) {
      heights[i] = NaN;
    } else {
      heights[i] = rgba[o] * 256 + rgba[o + 1] + rgba[o + 2] / 256 - 32768;
    }
  }
  return heights;
}

/** Decode 8-bit Trek greyscale RGBA pixels (alpha 0 = NaN) with 2-pass 3×3 NaN-aware smoothing. */
export function decodeTrek8Rgba(
  rgba: Uint8ClampedArray | Uint8Array,
  w: number,
  h: number,
  a: number,
  b: number
): Float32Array {
  const count = w * h;
  if (w <= 0 || h <= 0) return new Float32Array(0);
  let cur = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const o = i * 4;
    cur[i] = rgba[o + 3] === 0 ? NaN : a + b * rgba[o];
  }
  let next = new Float32Array(count);
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 0; y < h; y++) {
      const yMin = y > 0 ? y - 1 : 0;
      const yMax = y + 1 < h ? y + 1 : h - 1;
      for (let x = 0; x < w; x++) {
        const idx = y * w + x;
        const c = cur[idx];
        if (Number.isNaN(c)) {
          next[idx] = NaN;
          continue;
        }
        let s = 0;
        let n = 0;
        const xMin = x > 0 ? x - 1 : 0;
        const xMax = x + 1 < w ? x + 1 : w - 1;
        for (let yy = yMin; yy <= yMax; yy++) {
          const row = yy * w;
          for (let xx = xMin; xx <= xMax; xx++) {
            const v = cur[row + xx];
            if (!Number.isNaN(v)) {
              s += v;
              n++;
            }
          }
        }
        next[idx] = n > 0 ? s / n : NaN;
      }
    }
    const swap = cur;
    cur = next;
    next = swap;
  }
  return cur;
}

interface WorkerGlobalLike {
  onmessage: ((ev: MessageEvent<DemDecodeRequest>) => void) | null;
  postMessage(message: DemDecodeResponse, transfer?: Transferable[]): void;
}

const isWorkerContext =
  typeof self !== 'undefined' &&
  typeof document === 'undefined' &&
  typeof (globalThis as { process?: unknown }).process === 'undefined' &&
  typeof (self as unknown as { postMessage?: unknown }).postMessage === 'function';

if (isWorkerContext) {
  const scope = self as unknown as WorkerGlobalLike;
  let canvas: OffscreenCanvas | null = null;
  let ctx: OffscreenCanvasRenderingContext2D | null = null;

  const getContext = (w: number, h: number): OffscreenCanvasRenderingContext2D | null => {
    if (typeof OffscreenCanvas === 'undefined') return null;
    if (!canvas) {
      canvas = new OffscreenCanvas(w, h);
      ctx = canvas.getContext('2d', { willReadFrequently: true });
    } else if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    return ctx;
  };

  scope.onmessage = async (ev: MessageEvent<DemDecodeRequest>) => {
    const msg = ev.data;
    if (!msg) return;
    try {
      if (msg.kind === 'lerc1') {
        const raster = decodeLerc1(msg.buffer);
        const div = msg.scaleDivisor ?? 1;
        if (div !== 1) {
          const p = raster.pixels;
          for (let i = 0; i < p.length; i++) p[i] /= div;
        }
        scope.postMessage(
          { id: msg.id, ok: true, width: raster.width, height: raster.height, heights: raster.pixels },
          [raster.pixels.buffer]
        );
        return;
      }

      if (typeof createImageBitmap !== 'function' || typeof OffscreenCanvas === 'undefined') {
        scope.postMessage({ id: msg.id, ok: false, error: 'offscreen-unavailable', fallbackMainThread: true });
        return;
      }

      const blob = new Blob([msg.buffer], { type: 'image/png' });
      const bitmap = await createImageBitmap(blob);
      try {
        const w = bitmap.width;
        const h = bitmap.height;
        if (w <= 0 || h <= 0) {
          scope.postMessage({ id: msg.id, ok: false, error: 'empty-image' });
          return;
        }
        const c = getContext(w, h);
        if (!c) {
          scope.postMessage({ id: msg.id, ok: false, error: 'offscreen-2d-unavailable', fallbackMainThread: true });
          return;
        }
        c.clearRect(0, 0, w, h);
        c.drawImage(bitmap, 0, 0, w, h);
        const rgba = c.getImageData(0, 0, w, h).data;
        const heights =
          msg.kind === 'terrarium'
            ? decodeTerrariumRgba(rgba, w, h)
            : decodeTrek8Rgba(rgba, w, h, msg.a, msg.b);
        scope.postMessage({ id: msg.id, ok: true, width: w, height: h, heights }, [heights.buffer]);
      } finally {
        bitmap.close();
      }
    } catch (err) {
      scope.postMessage({
        id: msg.id,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };
}
