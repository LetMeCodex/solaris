import { afterEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
vi.mock('../rendering/FastTextureLoader', () => ({
  FastTextureLoader: THREE.TextureLoader,
  canUseBitmaps: false,
  applyBitmap: vi.fn(),
  decodeBitmap: vi.fn(),
}));
import { TexturePipeline } from '../rendering/TexturePipeline';

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('high resolution texture recovery', () => {
  it('keeps the base texture after failure and retries only after cooldown', async () => {
    const pipeline = TexturePipeline.getInstance();
    pipeline.resetForTesting();
    let attempts = 0;
    class TestImage {
      src = ''; crossOrigin = ''; decoding = '';
      decode() { return ++attempts === 1 ? Promise.reject(new Error('offline')) : Promise.resolve(); }
    }
    vi.stubGlobal('document', {});
    vi.stubGlobal('Image', TestImage);
    vi.stubGlobal('HTMLImageElement', TestImage);
    const clock = vi.spyOn(Date, 'now').mockReturnValue(1000);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    pipeline.setLoader({ load: () => new THREE.Texture({ width: 1024, height: 512 } as unknown as HTMLImageElement) } as unknown as THREE.TextureLoader);
    const base = pipeline.loadTexture('/textures/2k_sun.jpg');
    const original = base.image;
    pipeline.upgradeToHiRes('Sun');
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(base.image).toBe(original);
    pipeline.upgradeToHiRes('Sun');
    expect(attempts).toBe(1);
    clock.mockReturnValue(32000);
    pipeline.upgradeToHiRes('Sun');
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(base.image).toBeInstanceOf(TestImage);
    pipeline.upgradeToHiRes('Sun');
    expect(attempts).toBe(2);
    pipeline.resetForTesting();
  });
});
