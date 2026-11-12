import * as THREE from 'three';

/**
 * Images for the GPU, decoded off the main thread.
 *
 * Handing WebGL an <img> makes the browser convert it on the main thread when it is uploaded
 * (flip it upside down, untouched colour, straight alpha): measured on the fly page, 450 ms for
 * the 8K Earth and 790 ms for the 8K Moon, each a frozen frame, even after img.decode(). An
 * ImageBitmap made with those settings already applied is decoded on a worker thread and uploads
 * about 6x faster (the same 8K Moon: 2,080 ms -> 330 ms measured the same way, with its mipmaps).
 *
 * Drop-in for THREE.TextureLoader: `load` returns the Texture at once and fills it in later, and
 * it reports to the same loading manager (so progress bars still count it). The bitmap is already
 * the right way up, so the texture's own flipY is turned off.
 */
export const canUseBitmaps = typeof createImageBitmap !== 'undefined' && typeof fetch !== 'undefined';

export const BITMAP_OPTIONS: ImageBitmapOptions = { imageOrientation: 'flipY', premultiplyAlpha: 'none', colorSpaceConversion: 'none' };

/** Decode an image file to an upload-ready bitmap (worker thread), or reject. */
export async function decodeBitmap(url: string): Promise<ImageBitmap> {
  const res = await fetch(url, { credentials: 'same-origin' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return createImageBitmap(await res.blob(), BITMAP_OPTIONS);
}

/** Put a decoded bitmap into a texture (already flipped: flipY off). */
export function applyBitmap(texture: THREE.Texture, bitmap: ImageBitmap): void {
  texture.image = bitmap;
  texture.flipY = false;
  texture.needsUpdate = true;
}

export class FastTextureLoader extends THREE.TextureLoader {
  public override load(
    url: string,
    onLoad?: (texture: THREE.Texture) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (err: unknown) => void,
  ): THREE.Texture {
    if (!canUseBitmaps) return super.load(url, onLoad, onProgress, onError);
    const texture = new THREE.Texture();
    // Off until the bitmap arrives too: an empty texture is never uploaded either way
    texture.flipY = false;
    const full = this.manager.resolveURL((this.path ?? '') + url);
    this.manager.itemStart(full);
    decodeBitmap(full)
      .then((bitmap) => {
        applyBitmap(texture, bitmap);
        onLoad?.(texture);
        this.manager.itemEnd(full);
      })
      .catch((err) => {
        onError?.(err);
        this.manager.itemError(full);
        this.manager.itemEnd(full);
      });
    return texture;
  }
}
