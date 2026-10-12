import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { TexturePipeline } from '../rendering/TexturePipeline';
import { TextureGenerator } from '../rendering/TextureGenerator';

describe('TexturePipeline Canonical Cache & Loader Suite', () => {
  let pipeline: TexturePipeline;

  beforeEach(() => {
    pipeline = TexturePipeline.getInstance();
    pipeline.resetForTesting();
    pipeline.setBaseUrl('/solaris/');
  });

  it('1. First request loads and caches a texture', () => {
    let loadCount = 0;
    const mockLoader = {
      load: vi.fn((_url: string, onLoad?: (tex: THREE.Texture) => void) => {
        loadCount++;
        const tex = new THREE.Texture();
        if (onLoad) onLoad(tex);
        return tex;
      }),
    } as unknown as THREE.TextureLoader;

    pipeline.setLoader(mockLoader);

    const tex = pipeline.loadTexture('/textures/2k_earth_daymap.jpg');
    expect(tex).toBeDefined();
    expect(loadCount).toBe(1);
    expect(pipeline.isCached('/textures/2k_earth_daymap.jpg')).toBe(true);
    expect(pipeline.isCached('textures/2k_earth_daymap.jpg')).toBe(true);
    expect(pipeline.getCacheSize()).toBe(1);
  });

  it('2. Repeated request for the same canonical URL reuses the cached texture', () => {
    let loadCount = 0;
    const mockLoader = {
      load: vi.fn((_url: string, onLoad?: (tex: THREE.Texture) => void) => {
        loadCount++;
        const tex = new THREE.Texture();
        if (onLoad) onLoad(tex);
        return tex;
      }),
    } as unknown as THREE.TextureLoader;

    pipeline.setLoader(mockLoader);

    // Request with leading slash
    const tex1 = pipeline.loadTexture('/textures/2k_earth_daymap.jpg');
    // Request without leading slash (different raw string, same canonical asset)
    const tex2 = pipeline.loadTexture('textures/2k_earth_daymap.jpg');
    // Request with relative dot slash
    const tex3 = pipeline.loadTexture('./textures/2k_earth_daymap.jpg');

    expect(tex1).toBe(tex2);
    expect(tex2).toBe(tex3);
    expect(loadCount).toBe(1); // Only loaded once!
  });

  it('3. Concurrent requests do not trigger duplicate loads (deduplication)', async () => {
    let loadCalls = 0;
    const mockLoader = {
      load: vi.fn((
        _url: string,
        onLoad?: (tex: THREE.Texture) => void
      ) => {
        loadCalls++;
        const tex = new THREE.Texture();
        setTimeout(() => {
          if (onLoad) onLoad(tex);
        }, 10);
        return tex;
      }),
    } as unknown as THREE.TextureLoader;

    pipeline.setLoader(mockLoader);

    // Trigger two simultaneous async requests
    const promise1 = pipeline.loadTextureAsync('/textures/2k_jupiter.jpg');
    const promise2 = pipeline.loadTextureAsync('/textures/2k_jupiter.jpg');

    const [tex1, tex2] = await Promise.all([promise1, promise2]);

    expect(tex1).toBe(tex2);
    expect(loadCalls).toBe(1);
  });

  it('4. A failed request can be retried and does not permanently poison the cache', () => {
    let shouldFail = true;
    let loadCount = 0;

    const mockLoader = {
      load: vi.fn((
        _url: string,
        onLoad?: (tex: THREE.Texture) => void,
        _onProgress?: unknown,
        onError?: (err: unknown) => void
      ) => {
        loadCount++;
        const tex = new THREE.Texture();
        if (shouldFail) {
          if (onError) onError(new Error('Simulated network timeout'));
        } else {
          if (onLoad) onLoad(tex);
        }
        return tex;
      }),
    } as unknown as THREE.TextureLoader;

    pipeline.setLoader(mockLoader);

    // Initial request fails
    const failedTex = pipeline.loadTexture('/textures/transient_fail.jpg');
    expect(loadCount).toBe(1);
    // Key must NOT be stuck in cache
    expect(pipeline.isCached('/textures/transient_fail.jpg')).toBe(false);
    expect(pipeline.getCacheSize()).toBe(0);

    // Retry request with network restored
    shouldFail = false;
    const retriedTex = pipeline.loadTexture('/textures/transient_fail.jpg');
    expect(loadCount).toBe(2);
    expect(pipeline.isCached('/textures/transient_fail.jpg')).toBe(true);
    expect(retriedTex).toBeDefined();
    expect(retriedTex).not.toBe(failedTex);
  });

  it('5. Distinct URLs do not accidentally resolve to the same cache entry', () => {
    const urls = [
      '/textures/2k_earth_daymap.jpg',
      '/textures/2k_mars.jpg',
      '/textures/2k_jupiter.jpg',
      '/textures/2k_saturn.jpg',
    ];

    const textures = urls.map((url) => pipeline.loadTexture(url));

    expect(pipeline.getCacheSize()).toBe(4);

    const set = new Set(textures);
    expect(set.size).toBe(4); // All 4 textures must be distinct instances
  });

  it('6. Existing fallback behavior still works on load failure', () => {
    const mockLoader = {
      load: vi.fn((
        _url: string,
        _onLoad?: (tex: THREE.Texture) => void,
        _onProgress?: unknown,
        onError?: (err: unknown) => void
      ) => {
        const tex = new THREE.Texture();
        if (onError) onError(new Error('404 Not Found'));
        return tex;
      }),
    } as unknown as THREE.TextureLoader;

    pipeline.setLoader(mockLoader);

    const dummyFallbackTex = new THREE.Texture();
    dummyFallbackTex.image = { width: 512, height: 256 };
    const fallbackSpy = vi
      .spyOn(TextureGenerator, 'getTexture')
      .mockReturnValue(dummyFallbackTex as unknown as THREE.CanvasTexture);

    const tex = pipeline.loadTexture('/textures/missing_planet.jpg', true, 'Sun');
    expect(fallbackSpy).toHaveBeenCalledWith('Sun');
    expect(tex).toBeDefined();
    expect(tex.image).toBe(dummyFallbackTex.image);

    fallbackSpy.mockRestore();
  });
});
