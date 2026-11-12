/**
 * Decoder for Esri LERC version 1 ("CntZImage") rasters: the format Esri's astro ImageServer uses
 * for its elevation tiles (e.g. the Mars HRSC–MOLA blended DEM, see PlanetElevation). A port of the
 * Lerc1 part of Esri's open-source LercDecode.js (Apache-2.0, github.com/Esri/lerc): a run-length
 * coded validity mask, then the image in blocks that are constant, raw float32, or quantised
 * integers bit-stuffed into 32-bit words (value = offset + n × 2 × maxZError).
 */

export interface Lerc1Raster {
  width: number;
  height: number;
  /** Row-major values; NaN where the mask says no data. */
  pixels: Float32Array;
}

interface Block {
  encoding: number;
  offset: number;
  bitsPerPixel: number;
  numValidPixels: number;
  raw?: Float32Array;
  stuffed?: Uint32Array;
}

const IDENT = 'CntZImage ';

export function decodeLerc1(buffer: ArrayBuffer): Lerc1Raster {
  let fp = 0;
  const ident = String.fromCharCode(...new Uint8Array(buffer, 0, IDENT.length));
  if (ident !== IDENT) throw new Error('not a LERC1 raster');
  fp += IDENT.length;
  let view = new DataView(buffer, fp, 24);
  const height = view.getUint32(8, true);
  const width = view.getUint32(12, true);
  const maxZError = view.getFloat64(16, true);
  fp += 24;

  // Validity mask: 1 bit per pixel, run-length coded (int16 count: >0 literal bytes, <0 a repeat)
  view = new DataView(buffer, fp, 16);
  const maskBytes = view.getUint32(8, true);
  const maskMax = view.getFloat32(12, true);
  fp += 16;
  let bitset: Uint8Array | null = null;
  let allInvalid = false;
  if (maskBytes > 0) {
    bitset = new Uint8Array(Math.ceil((width * height) / 8));
    const mv = new DataView(buffer, fp, maskBytes);
    let cnt = mv.getInt16(0, true);
    let ip = 2;
    let op = 0;
    do {
      if (cnt > 0) {
        while (cnt--) bitset[op++] = mv.getUint8(ip++);
      } else {
        const val = mv.getUint8(ip++);
        cnt = -cnt;
        while (cnt--) bitset[op++] = val;
      }
      cnt = mv.getInt16(ip, true);
      ip += 2;
    } while (ip < maskBytes);
    fp += maskBytes;
  } else if (maskMax === 0) {
    allInvalid = true;
  }

  // Pixel blocks
  view = new DataView(buffer, fp, 16);
  const numBlocksY = view.getUint32(0, true);
  const numBlocksX = view.getUint32(4, true);
  const pixBytes = view.getUint32(8, true);
  const maxValue = view.getFloat32(12, true);
  fp += 16;
  const actualY = numBlocksY + (height % numBlocksY > 0 ? 1 : 0);
  const actualX = numBlocksX + (width % numBlocksX > 0 ? 1 : 0);
  const blocks: Block[] = [];
  for (let by = 0; by < actualY; by++) {
    for (let bx = 0; bx < actualX; bx++) {
      const bv = new DataView(buffer, fp, Math.min(10, buffer.byteLength - fp));
      let size = 0;
      let header = bv.getUint8(0);
      size++;
      const block: Block = { encoding: header & 63, offset: 0, bitsPerPixel: 0, numValidPixels: 0 };
      blocks.push(block);
      if (block.encoding > 3) throw new Error('LERC1: bad block encoding');
      if (block.encoding === 2) {
        fp++;
        continue;
      }
      if (header !== 0 && header !== 2) {
        header >>= 6;
        if (header === 2) {
          block.offset = bv.getInt8(1);
          size++;
        } else if (header === 1) {
          block.offset = bv.getInt16(1, true);
          size += 2;
        } else if (header === 0) {
          block.offset = bv.getFloat32(1, true);
          size += 4;
        } else {
          throw new Error('LERC1: bad offset type');
        }
        if (block.encoding === 1) {
          header = bv.getUint8(size);
          size++;
          block.bitsPerPixel = header & 63;
          header >>= 6;
          if (header === 2) {
            block.numValidPixels = bv.getUint8(size);
            size++;
          } else if (header === 1) {
            block.numValidPixels = bv.getUint16(size, true);
            size += 2;
          } else if (header === 0) {
            block.numValidPixels = bv.getUint32(size, true);
            size += 4;
          } else {
            throw new Error('LERC1: bad pixel count type');
          }
        }
      }
      fp += size;
      if (block.encoding === 3) continue;
      if (block.encoding === 0) {
        const n = (pixBytes - 1) / 4;
        const copy = new Uint8Array(n * 4);
        copy.set(new Uint8Array(buffer, fp, n * 4));
        block.raw = new Float32Array(copy.buffer);
        fp += n * 4;
      } else {
        const dataBytes = Math.ceil((block.numValidPixels * block.bitsPerPixel) / 8);
        const words = Math.ceil(dataBytes / 4);
        const copy = new Uint8Array(words * 4);
        copy.set(new Uint8Array(buffer, fp, dataBytes));
        block.stuffed = new Uint32Array(copy.buffer);
        fp += dataBytes;
      }
    }
  }

  const out = new Float32Array(width * height);
  const blockW = Math.floor(width / numBlocksX);
  const blockH = Math.floor(height / numBlocksY);
  const scale = 2 * maxZError;
  const tmp = new Float32Array(blockW * blockH);
  let bi = 0;
  for (let by = 0; by < actualY; by++) {
    const thisH = by !== numBlocksY ? blockH : height % numBlocksY;
    for (let bx = 0; bx < actualX; bx++) {
      const thisW = bx !== numBlocksX ? blockW : width % numBlocksX;
      const block = blocks[bi++];
      let data: Float32Array | null = null;
      let constant = 0;
      if (block.encoding === 0) data = block.raw!;
      else if (block.encoding === 1) data = unstuff(block.stuffed!, block.bitsPerPixel, block.numValidPixels, block.offset, scale, tmp, maxValue);
      else if (block.encoding === 3) constant = block.offset;
      let p = 0;
      for (let y = 0; y < thisH; y++) {
        let o = (by * blockH + y) * width + bx * blockW;
        for (let x = 0; x < thisW; x++, o++) {
          const valid = !allInvalid && (!bitset || (bitset[o >> 3] & (128 >> (o & 7))) !== 0);
          if (!valid) {
            out[o] = NaN;
            continue;
          }
          out[o] = data ? data[p++] : constant;
        }
      }
    }
  }
  return { width, height, pixels: out };
}

function unstuff(src: Uint32Array, bits: number, n: number, offset: number, scale: number, dest: Float32Array, maxValue: number): Float32Array {
  const mask = bits >= 32 ? 0xffffffff : (1 << bits) - 1;
  const nmax = Math.ceil((maxValue - offset) / scale);
  const tailBytes = src.length * 4 - Math.ceil((bits * n) / 8);
  src[src.length - 1] <<= 8 * tailBytes;
  let i = 0;
  let left = 0;
  let buf = 0;
  for (let o = 0; o < n; o++) {
    if (left === 0) {
      buf = src[i++];
      left = 32;
    }
    let v: number;
    if (left >= bits) {
      v = (buf >>> (left - bits)) & mask;
      left -= bits;
    } else {
      const missing = bits - left;
      v = ((buf & mask) << missing) & mask;
      buf = src[i++];
      left = 32 - missing;
      v += buf >>> left;
    }
    dest[o] = v < nmax ? offset + v * scale : maxValue;
  }
  return dest;
}
