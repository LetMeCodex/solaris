import * as THREE from 'three';
import { CLOUD_NOISE_SIZE, generateCloudNoise } from './cloudNoiseGenerator';

function createData3DTexture(data: Uint8Array, size: number): THREE.Data3DTexture {
  const tex = new THREE.Data3DTexture(data, size, size, size);
  tex.format = THREE.RGBAFormat;
  tex.type = THREE.UnsignedByteType;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.wrapR = THREE.RepeatWrapping;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.unpackAlignment = 1;
  tex.needsUpdate = true;
  return tex;
}

/** 1x1x1 neutral placeholder texture before the 64^3 worker volume arrives. */
export function createCloudNoiseFallback(): THREE.Data3DTexture {
  return createData3DTexture(new Uint8Array([128, 128, 128, 128]), 1);
}

/**
 * Generates the 64x64x64 RGBA cloud volume off the main thread when Workers exist, falling back to
 * main-thread generation asynchronously in Node / constrained environments. Returns a cancel fn.
 */
export function loadCloudNoiseTexture(onReady: (tex: THREE.Data3DTexture) => void, size = CLOUD_NOISE_SIZE): () => void {
  let cancelled = false;

  if (typeof Worker !== 'undefined') {
    try {
      const worker = new Worker(new URL('./cloudNoise.worker.ts', import.meta.url), { type: 'module' });
      const finish = (data: Uint8Array): void => {
        worker.terminate();
        if (cancelled) return;
        onReady(createData3DTexture(data, size));
      };
      worker.onmessage = (e: MessageEvent<Uint8Array>) => finish(e.data);
      worker.onerror = () => {
        worker.terminate();
        if (cancelled) return;
        onReady(createData3DTexture(generateCloudNoise(size).data, size));
      };
      worker.postMessage(size);
      return () => {
        cancelled = true;
        worker.terminate();
      };
    } catch {
      // Fall through to async main-thread generation
    }
  }

  const timer = setTimeout(() => {
    if (cancelled) return;
    onReady(createData3DTexture(generateCloudNoise(size).data, size));
  }, 0);

  return () => {
    cancelled = true;
    clearTimeout(timer);
  };
}
