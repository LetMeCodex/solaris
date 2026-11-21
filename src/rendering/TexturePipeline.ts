import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator';
import { FastTextureLoader, applyBitmap, canUseBitmaps, decodeBitmap } from './FastTextureLoader';
import { perf } from './Performance';

export interface PlanetTextureSet {
  map: THREE.Texture;
  normalMap?: THREE.Texture;
  bumpMap?: THREE.Texture;
  specularMap?: THREE.Texture;
  roughnessMap?: THREE.Texture;
  nightMap?: THREE.Texture;
  cloudsMap?: THREE.Texture;
  ringAlphaMap?: THREE.Texture;
  emissiveMap?: THREE.Texture;
}

export class TexturePipeline {
  private static instance: TexturePipeline;
  // Decoded off the main thread, uploaded without the browser's slow flip (see FastTextureLoader)
  private loader: THREE.TextureLoader = new FastTextureLoader();
  private customLoader: THREE.TextureLoader | null = null;
  private cache: Map<string, THREE.Texture> = new Map();
  private inFlightRequests: Map<string, Promise<THREE.Texture>> = new Map();
  private maxAnisotropy: number = 8;
  private maxCacheSize: number = TexturePipeline.defaultCacheLimit();
  private readonly pinnedKeys: Set<string> = new Set();
  /** When true (e.g. `/fly/` cold start), non-Earth/non-Sun textures stay queued until orbital hydration. */
  private deferNonEssential = false;
  private deferredLoads: Array<{
    canonicalKey: string;
    url: string;
    texture: THREE.Texture;
    isSRGB: boolean;
    fallbackKey?: string;
  }> = [];
  /** When true (live renderer attached), hi-res 4K/8K swaps upload incrementally through the per-frame GPU budget. */
  private budgetedUploads = false;
  private pendingUploads: Array<() => { texture: THREE.Texture; pixels: number } | null> = [];
  private uploadCooldownFrames = 0;
  private baseUrl: string = (
    (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/'
  ).replace(/\/?$/, '/');

  private static defaultCacheLimit(): number {
    return perf.tier === 'low' ? 20 : perf.tier === 'medium' ? 36 : 64;
  }

  private isProtectedKey(canonicalKey: string): boolean {
    if (this.pinnedKeys.has(canonicalKey)) return true;
    return /(?:earth_|2k_sun|milky_way_disk)/i.test(canonicalKey);
  }

  private isFlightEssentialKey(canonicalKey: string): boolean {
    if (this.pinnedKeys.has(canonicalKey)) return true;
    return /(?:2k_earth_|earth_normal_|2k_sun)/i.test(canonicalKey);
  }

  private configureSampling(texture: THREE.Texture, isSRGB: boolean): void {
    texture.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = this.maxAnisotropy;
  }

  private touchCache(canonicalKey: string, texture: THREE.Texture): void {
    this.cache.delete(canonicalKey);
    this.cache.set(canonicalKey, texture);
  }

  private storeCache(canonicalKey: string, texture: THREE.Texture): void {
    this.touchCache(canonicalKey, texture);
    this.evictOverflow();
  }

  private evictOverflow(): void {
    if (this.cache.size <= this.maxCacheSize) return;
    for (const [key, tex] of this.cache) {
      if (this.cache.size <= this.maxCacheSize) break;
      if (this.pinnedKeys.has(key) || this.inFlightRequests.has(key) || this.isProtectedKey(key)) continue;
      this.cache.delete(key);
      // Free GPU texture handle while keeping image reference so active meshes can re-upload if revisited
      tex.dispose();
    }
    // Second pass if unpinned set alone wasn't enough and explicitly non-pinned keys exceeded cap
    if (this.cache.size > this.maxCacheSize) {
      for (const [key, tex] of this.cache) {
        if (this.cache.size <= this.maxCacheSize) break;
        if (this.pinnedKeys.has(key) || this.inFlightRequests.has(key)) continue;
        this.cache.delete(key);
        tex.dispose();
      }
    }
  }

  /** Pin a texture URL so LRU eviction keeps it resident (e.g., active target planet). */
  public pinTexture(url: string): void {
    this.pinnedKeys.add(this.resolveUrl(url));
  }

  /** Set the LRU cache cap (protects 3D tile loading VRAM on low-memory devices). */
  public setMaxCacheSize(limit: number): void {
    this.maxCacheSize = Math.max(4, Math.floor(limit));
    this.evictOverflow();
  }

  private constructor() {}

  /**
   * Normalizes any input path/URL to a deterministic, canonical cache key.
   * Handles leading slashes, relative prefixes, duplicate slashes, and base URLs.
   */
  public resolveUrl(path: string): string {
    if (!path) return '';
    if (
      path.startsWith('http://') ||
      path.startsWith('https://') ||
      path.startsWith('data:') ||
      path.startsWith('blob:')
    ) {
      return path;
    }
    // Strip redundant leading dots and slashes: './textures', '/textures', '///textures' -> 'textures'
    const cleanPath = path
      .replace(/^(\.\/)+/, '')
      .replace(/^\/+/, '')
      .replace(/\/+/g, '/');
    const cleanBase = this.baseUrl.replace(/\/+$/, '/');
    return `${cleanBase}${cleanPath}`;
  }

  public static getInstance(): TexturePipeline {
    if (!TexturePipeline.instance) {
      TexturePipeline.instance = new TexturePipeline();
    }
    return TexturePipeline.instance;
  }

  /**
   * Set custom loader (used in testing or specialized asset pipelines).
   */
  public setLoader(loader: THREE.TextureLoader | null): void {
    this.customLoader = loader;
  }

  /**
   * Override base URL (e.g. during testing or runtime reconfiguration).
   */
  public setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl.replace(/\/?$/, '/');
  }

  public setMaxAnisotropy(anisotropy: number): void {
    const clamped = Math.min(8, Math.max(1, Math.floor(anisotropy || 1)));
    this.maxAnisotropy = clamped;
    for (const texture of this.cache.values()) {
      texture.anisotropy = clamped;
      texture.needsUpdate = true;
    }
  }

  public getMaxAnisotropy(): number {
    return this.maxAnisotropy;
  }

  /**
   * Defer non-Earth/non-Sun planetary textures during `/fly/` cold start so Earth + jet assets
   * load with zero network/decode contention, then stream deferred planets in place after take-off.
   */
  public setDeferredNonEssential(deferred: boolean): void {
    this.deferNonEssential = deferred;
    if (deferred || this.deferredLoads.length === 0) return;
    const queued = this.deferredLoads.splice(0, this.deferredLoads.length);
    for (const item of queued) {
      if (this.cache.get(item.canonicalKey) !== item.texture) continue;
      this.hydrateDeferredTexture(item);
    }
  }

  public isDeferredNonEssential(): boolean {
    return this.deferNonEssential;
  }

  /** Enable per-frame budgeted GPU uploads for hi-res & deferred texture swaps. */
  public setBudgetedUploads(enabled: boolean): void {
    this.budgetedUploads = enabled;
    if (!enabled && this.pendingUploads.length > 0) {
      const rest = this.pendingUploads.splice(0, this.pendingUploads.length);
      for (const task of rest) task();
    }
  }

  /**
   * Commit at most one pending hi-res / deferred texture swap per frame within the GPU upload budget
   * so 4K/8K texture uploads and mipmap generation never trigger 260ms frame spikes.
   */
  public flushPendingUploads(
    renderer: THREE.WebGLRenderer,
    tryUpload?: (texture: THREE.Texture) => boolean,
  ): number {
    if (this.uploadCooldownFrames > 0) {
      this.uploadCooldownFrames--;
      return 0;
    }
    if (this.pendingUploads.length === 0) return 0;
    const next = this.pendingUploads.shift();
    if (!next) return 0;
    const result = next();
    if (!result) return 0;
    const { texture, pixels } = result;
    if (tryUpload) {
      if (!tryUpload(texture)) {
        // Still uploaded lazily by Three.js when drawn; space out further heavy swaps
        this.uploadCooldownFrames = pixels >= 8_000_000 ? 2 : 1;
        return 1;
      }
    } else {
      renderer.initTexture(texture);
    }
    // Give ANGLE/D3D11 a quiet frame after a large 4K/8K upload + mipmap build
    if (pixels >= 8_000_000) this.uploadCooldownFrames = 2;
    else if (pixels >= 2_000_000) this.uploadCooldownFrames = 1;
    return 1;
  }

  public getPendingUploadCount(): number {
    return this.pendingUploads.length;
  }

  private hydrateDeferredTexture(item: {
    canonicalKey: string;
    url: string;
    texture: THREE.Texture;
    isSRGB: boolean;
    fallbackKey?: string;
  }): void {
    const { canonicalKey, url, texture, isSRGB, fallbackKey } = item;
    if (typeof document === 'undefined' && !this.customLoader) return;
    const applyLoaded = (image: HTMLImageElement | ImageBitmap, flipY: boolean): void => {
      const commit = (): { texture: THREE.Texture; pixels: number } | null => {
        if (this.cache.get(canonicalKey) !== texture) {
          if ('close' in image) image.close();
          return null;
        }
        if (image instanceof HTMLImageElement) {
          texture.image = image;
          texture.flipY = flipY;
        } else {
          applyBitmap(texture, image);
        }
        this.configureSampling(texture, isSRGB);
        texture.needsUpdate = true;
        const w = (image as { width?: number }).width ?? 1024;
        const h = (image as { height?: number }).height ?? 512;
        return { texture, pixels: w * h };
      };
      if (this.budgetedUploads) this.pendingUploads.push(commit);
      else commit();
    };
    const onFail = (err: unknown): void => {
      console.warn(`[TexturePipeline] Deferred fallback activated for ${url} (${canonicalKey}):`, err);
      if (fallbackKey && this.cache.get(canonicalKey) === texture) {
        try {
          const fallbackTex = TextureGenerator.getTexture(fallbackKey);
          if (fallbackTex && fallbackTex.image) {
            texture.image = fallbackTex.image;
            texture.flipY = fallbackTex.flipY;
            this.configureSampling(texture, isSRGB);
            texture.needsUpdate = true;
          }
        } catch (e) {
          console.warn('[TexturePipeline] Fallback generation error:', e);
        }
      }
    };
    if (!this.customLoader && canUseBitmaps) {
      decodeBitmap(canonicalKey, false)
        .then((bmp) => applyLoaded(bmp, false))
        .catch(onFail);
      return;
    }
    const activeLoader = this.customLoader || this.loader;
    activeLoader.load(
      canonicalKey,
      (loaded) => {
        if (this.cache.get(canonicalKey) !== texture) return;
        texture.image = loaded.image;
        texture.flipY = loaded.flipY;
        this.configureSampling(texture, isSRGB);
        texture.needsUpdate = true;
      },
      undefined,
      onFail,
    );
  }

  /**
   * Check if a canonical URL is currently cached.
   */
  public isCached(url: string): boolean {
    const canonicalKey = this.resolveUrl(url);
    return this.cache.has(canonicalKey);
  }

  /**
   * Get the total number of cached textures.
   */
  public getCacheSize(): number {
    return this.cache.size;
  }

  /**
   * Remove a texture from cache.
   * By default, does NOT call tex.dispose() to prevent invalidating textures
   * currently bound to active scene materials. Pass forceDispose=true only
   * when tearing down the entire renderer.
   */
  public evictFromCache(url: string, forceDispose: boolean = false): boolean {
    const canonicalKey = this.resolveUrl(url);
    const tex = this.cache.get(canonicalKey);
    if (!tex) return false;
    this.cache.delete(canonicalKey);
    this.inFlightRequests.delete(canonicalKey);
    if (forceDispose) {
      tex.dispose();
    }
    return true;
  }

  /**
   * Clears the texture cache.
   * By default does not dispose active textures to protect active scene materials.
   */
  public clearCache(forceDispose: boolean = false): void {
    if (forceDispose) {
      for (const tex of this.cache.values()) {
        tex.dispose();
      }
    }
    this.cache.clear();
    this.inFlightRequests.clear();
    this.pinnedKeys.clear();
    this.upgraded.clear();
    this.upgrading.clear();
    this.upgradeRetryAt.clear();
    this.deferredLoads.length = 0;
    this.pendingUploads.length = 0;
    this.uploadCooldownFrames = 0;
  }

  /**
   * Reset testing state (used in unit test suites).
   */
  public resetForTesting(): void {
    this.clearCache(false);
    this.customLoader = null;
    this.deferNonEssential = false;
    this.budgetedUploads = false;
    this.maxCacheSize = TexturePipeline.defaultCacheLimit();
    this.maxAnisotropy = 8;
    this.baseUrl = (
      (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/'
    ).replace(/\/?$/, '/');
  }

  /**
   * Loads or returns a cached texture with proper color-space and mipmapping.
   * If offline or file fails, falls back gracefully to TextureGenerator procedural canvas.
   *
   * Ensures deterministic canonical cache keys for lookup, insertion, and deduplication.
   * If a load fails, removes the failed key from the cache to allow retries.
   */
  public loadTexture(
    url: string,
    isSRGB: boolean = true,
    fallbackKey?: string
  ): THREE.Texture {
    const canonicalKey = this.resolveUrl(url);

    // 1. Cache hit check with canonical key (refresh LRU recency)
    const cached = this.cache.get(canonicalKey);
    if (cached) {
      this.touchCache(canonicalKey, cached);
      return cached;
    }

    // 2. Headless test environment guard when no mock loader is provided
    if (typeof document === 'undefined' && !this.customLoader) {
      const dummyTex = new THREE.Texture();
      this.configureSampling(dummyTex, isSRGB);
      this.storeCache(canonicalKey, dummyTex);
      return dummyTex;
    }

    // 2b. During `/fly/` cold start, defer non-Earth/non-Sun textures so Earth + jet assets stream first
    if (this.deferNonEssential && !this.isFlightEssentialKey(canonicalKey)) {
      const deferredTex = new THREE.Texture();
      this.configureSampling(deferredTex, isSRGB);
      this.storeCache(canonicalKey, deferredTex);
      this.deferredLoads.push({ canonicalKey, url, texture: deferredTex, isSRGB, fallbackKey });
      return deferredTex;
    }

    // 3. Initiate texture loading using active loader
    const activeLoader = this.customLoader || this.loader;
    let hasFailed = false;
    let targetTex: THREE.Texture | null = null;

    const texture = activeLoader.load(
      canonicalKey,
      (tex) => {
        this.configureSampling(tex, isSRGB);
        tex.needsUpdate = true;
      },
      undefined,
      (err) => {
        hasFailed = true;
        console.warn(`[TexturePipeline] Fallback activated for ${url} (${canonicalKey}):`, err);

        // DO NOT permanently poison the cache with a failed texture!
        // Evict key from cache so subsequent requests can retry network load.
        this.cache.delete(canonicalKey);
        this.inFlightRequests.delete(canonicalKey);

        if (fallbackKey && targetTex) {
          try {
            const fallbackTex = TextureGenerator.getTexture(fallbackKey);
            if (fallbackTex && fallbackTex.image) {
              targetTex.image = fallbackTex.image;
              targetTex.flipY = fallbackTex.flipY;
              this.configureSampling(targetTex, isSRGB);
              targetTex.needsUpdate = true;
            }
          } catch (e) {
            console.warn('[TexturePipeline] Fallback generation error:', e);
          }
        }
      }
    );

    targetTex = texture;

    // If load failed synchronously, apply fallback now that targetTex is available
    if (hasFailed && fallbackKey) {
      try {
        const fallbackTex = TextureGenerator.getTexture(fallbackKey);
        if (fallbackTex && fallbackTex.image) {
          targetTex.image = fallbackTex.image;
          targetTex.flipY = fallbackTex.flipY;
          this.configureSampling(targetTex, isSRGB);
          targetTex.needsUpdate = true;
        }
      } catch (e) {
        console.warn('[TexturePipeline] Fallback generation error:', e);
      }
    }

    this.configureSampling(texture, isSRGB);

    // 4. Store in LRU cache under canonical key if not already failed
    if (!hasFailed) {
      this.storeCache(canonicalKey, texture);
    }
    return texture;
  }

  /**
   * Asynchronous variant that resolves once the texture has loaded or fallback applied.
   * Deduplicates concurrent asynchronous requests to the same URL.
   */
  public loadTextureAsync(
    url: string,
    isSRGB: boolean = true,
    fallbackKey?: string
  ): Promise<THREE.Texture> {
    const canonicalKey = this.resolveUrl(url);

    // Cache hit (refresh LRU recency)
    const cached = this.cache.get(canonicalKey);
    if (cached) {
      this.touchCache(canonicalKey, cached);
      return Promise.resolve(cached);
    }

    // In-flight deduplication
    const inFlight = this.inFlightRequests.get(canonicalKey);
    if (inFlight) return inFlight;

    if (typeof document === 'undefined' && !this.customLoader) {
      const dummyTex = this.loadTexture(url, isSRGB, fallbackKey);
      return Promise.resolve(dummyTex);
    }

    const promise = new Promise<THREE.Texture>((resolve, reject) => {
      const activeLoader = this.customLoader || this.loader;

      activeLoader.load(
        canonicalKey,
        (tex) => {
          tex.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.NoColorSpace;
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.anisotropy = this.maxAnisotropy;
          tex.needsUpdate = true;

          this.storeCache(canonicalKey, tex);
          this.inFlightRequests.delete(canonicalKey);
          resolve(tex);
        },
        undefined,
        (err) => {
          this.cache.delete(canonicalKey);
          this.inFlightRequests.delete(canonicalKey);

          if (fallbackKey) {
            console.warn(`[TexturePipeline] Fallback activated for ${url}:`, err);
            const fallbackTex = TextureGenerator.getTexture(fallbackKey);
            resolve(fallbackTex);
          } else {
            reject(err);
          }
        }
      );
    });

    this.inFlightRequests.set(canonicalKey, promise);
    return promise;
  }

  /**
   * Retrieves photographic texture sets for any body in the solar system.
   */
  /** Moons with a real (spacecraft) global map bundled. */
  private static readonly MOON_MAPS = new Set([
    'Io', 'Europa', 'Ganymede', 'Callisto', 'Mimas', 'Enceladus', 'Tethys', 'Dione', 'Rhea', 'Iapetus',
    'Miranda', 'Ariel', 'Umbriel', 'Titania', 'Oberon', 'Triton', 'Phobos',
  ]);

  public getPlanetTextures(bodyName: string, minorKind?: 'dark' | 'grey' | 'icy' | 'red'): PlanetTextureSet {
    // The hundreds of small moons without maps share a few procedural regoliths (with relief)
    if (minorKind) {
      return { map: TextureGenerator.getTexture(`minor:${minorKind}`), normalMap: TextureGenerator.getTexture(`minor-n:${minorKind}`) };
    }
    // Real global maps of the larger moons (see public/textures/moons/SOURCES.md), with relief
    if (TexturePipeline.MOON_MAPS.has(bodyName)) {
      const f = bodyName.toLowerCase();
      return {
        map: this.loadTexture(`/textures/moons/${f}.jpg`, true, bodyName),
        normalMap: this.loadTexture(`/textures/moons/${f}_normal.jpg`, false),
      };
    }
    switch (bodyName) {
      case 'Sun':
        return {
          map: this.loadTexture('/textures/2k_sun.jpg', true, 'Sun'),
          emissiveMap: this.loadTexture('/textures/2k_sun.jpg', true, 'Sun'),
        };

      case 'Mercury':
        return {
          map: this.loadTexture('/textures/2k_mercury.jpg', true, 'Mercury'),
        };

      case 'Venus':
        return {
          map: this.loadTexture('/textures/2k_venus_atmosphere.jpg', true, 'Venus'),
        };

      case 'Earth':
        return {
          map: this.loadTexture('/textures/2k_earth_daymap.jpg', true, 'Earth'),
          normalMap: this.loadTexture('/textures/earth_normal_2048.jpg', false),
          nightMap: this.loadTexture('/textures/2k_earth_nightmap.jpg', true),
          cloudsMap: this.loadTexture('/textures/2k_earth_clouds.jpg', true, 'EarthClouds'),
        };

      case 'Moon':
        return {
          map: this.loadTexture('/textures/2k_moon.jpg', true, 'Moon'),
        };

      case 'Mars':
        return {
          map: this.loadTexture('/textures/2k_mars.jpg', true, 'Mars'),
        };

      case 'Jupiter':
        return {
          map: this.loadTexture('/textures/2k_jupiter.jpg', true, 'Jupiter'),
        };

      case 'Saturn':
        return {
          map: this.loadTexture('/textures/2k_saturn.jpg', true, 'Saturn'),
          ringAlphaMap: this.loadTexture('/textures/2k_saturn_ring_alpha.png', false, 'SaturnRings'),
        };

      case 'Uranus':
        return {
          map: this.loadTexture('/textures/2k_uranus.jpg', true, 'Uranus'),
        };

      case 'Neptune':
        return {
          map: this.loadTexture('/textures/2k_neptune.jpg', true, 'Neptune'),
        };

      case 'Pluto':
        // NASA/JHUAPL/SwRI New Horizons global colour mosaic (public domain); the south, in polar
        // night during the 2015 flyby, is a muted fill (see ASSETS.md)
        return {
          map: this.loadTexture('/textures/2k_pluto.jpg', true, 'Pluto'),
        };

      case 'Charon':
        // New Horizons Charon basemap relief (public domain) with Mordor Macula's tholin cap
        return {
          map: this.loadTexture('/textures/2k_charon.jpg', true, 'Charon'),
        };

      default:
        // Moons, dwarf planets, asteroids: Use procedural texture generator
        return {
          map: TextureGenerator.getTexture(bodyName),
        };
    }
  }

  /**
   * Sharper maps (Solar System Scope, CC BY 4.0; see ASSETS.md), swapped in place of the 2K ones
   * when you come close to a world: the same Texture objects get the bigger image, so every
   * material using them sharpens without a rebuild. Only the worlds you visit pay the memory.
   */
  private static readonly HIRES: Record<string, Array<[string, string]>> = {
    Sun: [['/textures/2k_sun.jpg', '/textures/hires/sun_4k.webp']],
    Mercury: [['/textures/2k_mercury.jpg', '/textures/hires/mercury_8k.webp']],
    Earth: [
      ['/textures/2k_earth_daymap.jpg', '/textures/hires/earth_day_8k.webp'],
      ['/textures/2k_earth_nightmap.jpg', '/textures/hires/earth_night_4k.webp'],
      ['/textures/2k_earth_clouds.jpg', '/textures/hires/earth_clouds_4k.webp'],
    ],
    Moon: [['/textures/2k_moon.jpg', '/textures/hires/moon_8k.webp']],
    Mars: [['/textures/2k_mars.jpg', '/textures/hires/mars_8k.webp']],
    Jupiter: [['/textures/2k_jupiter.jpg', '/textures/hires/jupiter_4k.webp']],
    Saturn: [
      ['/textures/2k_saturn.jpg', '/textures/hires/saturn_4k.webp'],
      ['/textures/2k_saturn_ring_alpha.png', '/textures/hires/saturn_ring_alpha_8k.png'],
    ],
  };
  private upgraded = new Set<string>();
  private upgrading = new Set<string>();
  private upgradeRetryAt = new Map<string, number>();
  private maxTextureSize = 4096;

  /** The GPU's limit: 8K maps are only used where they fit. */
  public setMaxTextureSize(size: number): void {
    this.maxTextureSize = size;
  }

  /** Whether a world has sharper maps to swap in. */
  public hasHiRes(bodyName: string): boolean {
    return bodyName in TexturePipeline.HIRES;
  }

  /** Swap a world's maps for the sharper ones (once; skipped on low tier to protect 3D tile VRAM). */
  public upgradeToHiRes(bodyName: string): void {
    const pairs = TexturePipeline.HIRES[bodyName];
    if (!pairs || typeof document === 'undefined') return;
    // Low-VRAM devices stay on crisp 2K maps so 3D Tiles and SurfaceTileLayer keep GPU memory headroom
    if (perf.tier === 'low') return;
    for (const [low, high] of pairs) {
      if (this.upgraded.has(high) || this.upgrading.has(high) || Date.now() < (this.upgradeRetryAt.get(high) ?? 0)) continue;
      const lowKey = this.resolveUrl(low);
      const tex = this.cache.get(lowKey);
      if (!tex) continue;
      this.touchCache(lowKey, tex);
      const wants8k = high.includes('_8k');
      if (wants8k && (!perf.settings.hiRes8k || this.maxTextureSize < 8192)) continue;
      this.upgrading.add(high);
      // The GPU copy was allocated at the old size and is immutable (texStorage2D): free it
      // first, so the next draw allocates fresh storage at the new size. Writing the bigger
      // image into the old storage fails and leaves the map garbled.
      const swap = (image: HTMLImageElement | ImageBitmap, flipY: boolean): void => {
        const commit = (): { texture: THREE.Texture; pixels: number } | null => {
          if (this.cache.get(lowKey) !== tex) {
            if ('close' in image) image.close();
            this.upgrading.delete(high);
            return null;
          }
          tex.dispose();
          if (image instanceof HTMLImageElement) {
            tex.image = image;
            tex.flipY = flipY;
            tex.needsUpdate = true;
          } else {
            applyBitmap(tex, image);
          }
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.anisotropy = this.maxAnisotropy;
          this.upgrading.delete(high);
          this.upgraded.add(high);
          this.upgradeRetryAt.delete(high);
          const w = (image as { width?: number }).width ?? 4096;
          const h = (image as { height?: number }).height ?? 2048;
          return { texture: tex, pixels: w * h };
        };
        if (this.budgetedUploads) this.pendingUploads.push(commit);
        else commit();
      };
      const fail = (err: unknown): void => {
        this.upgrading.delete(high);
        this.upgradeRetryAt.set(high, Date.now() + 30_000);
        console.warn(`[TexturePipeline] Sharper map unavailable for ${bodyName}: ${high}`, err);
      };
      if (canUseBitmaps) {
        // An 8K <img> froze the page for 0.45-0.8 s on upload; a bitmap decoded off the main
        // thread costs a fraction of that (see FastTextureLoader)
        decodeBitmap(this.resolveUrl(high)).then((bmp) => swap(bmp, false)).catch(fail);
      } else {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.decoding = 'async';
        img.src = this.resolveUrl(high);
        img.decode().then(() => swap(img, true)).catch(fail);
      }
    }
  }

  /**
   * Face-on Milky Way disk artwork (NASA/JPL-Caltech/ESO/R. Hurt), with alpha.
   * The GPU texture is only created once the galaxy view is reached (see MilkyWayGalaxy); the image
   * itself is already in the HTTP cache, because MilkyWayVolume samples it at startup.
   */
  public getMilkyWayDiskTexture(): THREE.Texture {
    return this.loadTexture('/textures/milky_way_disk.webp', true);
  }
}
