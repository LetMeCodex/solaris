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

  it('enforces crisp anisotropy up to 8x and trilinear mipmaps across cached textures', () => {
    const pipeline = TexturePipeline.getInstance();
    pipeline.resetForTesting();
    vi.stubGlobal('document', {});
    pipeline.setLoader({
      load: (_url: string, onLoad?: (t: THREE.Texture) => void) => {
        const tex = new THREE.Texture();
        onLoad?.(tex);
        return tex;
      },
    } as unknown as THREE.TextureLoader);

    pipeline.setMaxAnisotropy(16);
    expect(pipeline.getMaxAnisotropy()).toBe(8);

    const earthTex = pipeline.loadTexture('/textures/2k_earth_daymap.jpg');
    expect(earthTex.anisotropy).toBe(8);
    expect(earthTex.generateMipmaps).toBe(true);
    expect(earthTex.minFilter).toBe(THREE.LinearMipmapLinearFilter);

    pipeline.setMaxAnisotropy(4);
    expect(earthTex.anisotropy).toBe(4);
    pipeline.resetForTesting();
  });

  it('defers non-Earth/non-Sun textures during /fly/ cold start and hydrates them lazily in place', () => {
    const pipeline = TexturePipeline.getInstance();
    pipeline.resetForTesting();
    vi.stubGlobal('document', {});
    const loadedUrls: string[] = [];
    pipeline.setLoader({
      load: (url: string, onLoad?: (t: THREE.Texture) => void) => {
        loadedUrls.push(url);
        const tex = new THREE.Texture({ width: 512, height: 256 } as unknown as HTMLImageElement);
        onLoad?.(tex);
        return tex;
      },
    } as unknown as THREE.TextureLoader);

    pipeline.setDeferredNonEssential(true);
    const earthTex = pipeline.loadTexture('/textures/2k_earth_daymap.jpg');
    const marsTex = pipeline.loadTexture('/textures/2k_mars.jpg');

    expect(loadedUrls).toEqual([pipeline.resolveUrl('/textures/2k_earth_daymap.jpg')]);
    expect(earthTex.image).toBeTruthy();
    expect(marsTex.image).toBeNull();

    // Hydrate lazily after orbital climb: Mars populates the exact same Texture object in place
    pipeline.setDeferredNonEssential(false);
    expect(loadedUrls).toEqual([
      pipeline.resolveUrl('/textures/2k_earth_daymap.jpg'),
      pipeline.resolveUrl('/textures/2k_mars.jpg'),
    ]);
    expect(marsTex.image).toBeTruthy();
    pipeline.resetForTesting();
  });

  it('budgets queued hi-res texture uploads across frames with cooldown spacing', async () => {
    const pipeline = TexturePipeline.getInstance();
    pipeline.resetForTesting();
    class FakeImage {
      src = ''; crossOrigin = ''; decoding = '';
      width = 4096; height = 2048;
      decode() { return Promise.resolve(); }
    }
    vi.stubGlobal('document', {});
    vi.stubGlobal('Image', FakeImage);
    vi.stubGlobal('HTMLImageElement', FakeImage);
    pipeline.setLoader({
      load: () => new THREE.Texture({ width: 1024, height: 512 } as unknown as HTMLImageElement),
    } as unknown as THREE.TextureLoader);

    pipeline.setMaxTextureSize(8192);
    pipeline.setBudgetedUploads(true);
    pipeline.loadTexture('/textures/2k_earth_nightmap.jpg');
    pipeline.loadTexture('/textures/2k_earth_clouds.jpg');
    pipeline.upgradeToHiRes('Earth');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(pipeline.getPendingUploadCount()).toBe(2);

    const uploaded: THREE.Texture[] = [];
    const mockRenderer = { initTexture: vi.fn((t: THREE.Texture) => uploaded.push(t)) } as unknown as THREE.WebGLRenderer;

    // Frame 1 uploads first 4K texture and sets 2-frame cooldown (>=8M px)
    expect(pipeline.flushPendingUploads(mockRenderer)).toBe(1);
    expect(pipeline.flushPendingUploads(mockRenderer)).toBe(0);
    expect(pipeline.flushPendingUploads(mockRenderer)).toBe(0);
    // Frame 4 uploads the second 4K texture
    expect(pipeline.flushPendingUploads(mockRenderer)).toBe(1);
    expect(uploaded.length).toBe(2);
    expect(pipeline.getPendingUploadCount()).toBe(0);
    pipeline.resetForTesting();
  });
});
