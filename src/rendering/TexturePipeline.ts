import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator';
import { FastTextureLoader, applyBitmap, canUseBitmaps, decodeBitmap } from './FastTextureLoader';

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
  private baseUrl: string = (
    (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/'
  ).replace(/\/?$/, '/');

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
    this.maxAnisotropy = Math.max(1, anisotropy);
    for (const texture of this.cache.values()) {
      texture.anisotropy = this.maxAnisotropy;
      texture.needsUpdate = true;
    }
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
  }

  /**
   * Reset testing state (used in unit test suites).
   */
  public resetForTesting(): void {
    this.clearCache(false);
    this.customLoader = null;
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

    // 1. Cache hit check with canonical key
    const cached = this.cache.get(canonicalKey);
    if (cached) return cached;

    // 2. Headless test environment guard when no mock loader is provided
    if (typeof document === 'undefined' && !this.customLoader) {
      const dummyTex = new THREE.Texture();
      dummyTex.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      this.cache.set(canonicalKey, dummyTex);
      return dummyTex;
    }

    // 3. Initiate texture loading using active loader
    const activeLoader = this.customLoader || this.loader;
    let hasFailed = false;
    let targetTex: THREE.Texture | null = null;

    const texture = activeLoader.load(
      canonicalKey,
      (tex) => {
        tex.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.NoColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = this.maxAnisotropy;
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
          targetTex.needsUpdate = true;
        }
      } catch (e) {
        console.warn('[TexturePipeline] Fallback generation error:', e);
      }
    }

    texture.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = this.maxAnisotropy;

    // 4. Store in cache under canonical key if not already failed
    if (!hasFailed) {
      this.cache.set(canonicalKey, texture);
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

    // Cache hit
    const cached = this.cache.get(canonicalKey);
    if (cached) return Promise.resolve(cached);

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

          this.cache.set(canonicalKey, tex);
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
  private maxTextureSize = 4096;

  /** The GPU's limit: 8K maps are only used where they fit. */
  public setMaxTextureSize(size: number): void {
    this.maxTextureSize = size;
  }

  /** Whether a world has sharper maps to swap in. */
  public hasHiRes(bodyName: string): boolean {
    return bodyName in TexturePipeline.HIRES;
  }

  /** Swap a world's maps for the sharper ones (once; later calls do nothing). */
  public upgradeToHiRes(bodyName: string): void {
    const pairs = TexturePipeline.HIRES[bodyName];
    if (!pairs || this.upgraded.has(bodyName) || typeof document === 'undefined') return;
    this.upgraded.add(bodyName);
    for (const [low, high] of pairs) {
      const tex = this.cache.get(this.resolveUrl(low));
      if (!tex) continue;
      const wants8k = high.includes('_8k');
      if (wants8k && this.maxTextureSize < 8192) continue;
      // The GPU copy was allocated at the old size and is immutable (texStorage2D): free it
      // first, so the next draw allocates fresh storage at the new size. Writing the bigger
      // image into the old storage fails and leaves the map garbled.
      const swap = (image: HTMLImageElement | ImageBitmap, flipY: boolean): void => {
        tex.dispose();
        if (image instanceof HTMLImageElement) {
          tex.image = image;
          tex.flipY = flipY;
          tex.needsUpdate = true;
        } else {
          applyBitmap(tex, image);
        }
      };
      const fail = (err: unknown): void => console.warn(`[TexturePipeline] Sharper map unavailable for ${bodyName}: ${high}`, err);
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
