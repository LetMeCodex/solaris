import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator';

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
  private loader: THREE.TextureLoader = new THREE.TextureLoader();
  private cache: Map<string, THREE.Texture> = new Map();
  private maxAnisotropy: number = 8;
  private baseUrl: string = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');

  private constructor() {}

  private resolveUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const clean = path.startsWith('/') ? path.slice(1) : path;
    return `${this.baseUrl}${clean}`;
  }

  public static getInstance(): TexturePipeline {
    if (!TexturePipeline.instance) {
      TexturePipeline.instance = new TexturePipeline();
    }
    return TexturePipeline.instance;
  }

  public setMaxAnisotropy(anisotropy: number): void {
    this.maxAnisotropy = Math.max(1, anisotropy);
    for (const texture of this.cache.values()) {
      texture.anisotropy = this.maxAnisotropy;
      texture.needsUpdate = true;
    }
  }

  /**
   * Loads or returns a cached texture with proper color-space and mipmapping.
   * If offline or file fails, falls back gracefully to TextureGenerator procedural canvas.
   */
  public loadTexture(
    url: string,
    isSRGB: boolean = true,
    fallbackKey?: string
  ): THREE.Texture {
    const fullUrl = this.resolveUrl(url);
    const cached = this.cache.get(fullUrl);
    if (cached) return cached;

    // Guard for headless / Node unit test environments without DOM
    if (typeof document === 'undefined') {
      const dummyTex = new THREE.Texture();
      this.cache.set(fullUrl, dummyTex);
      return dummyTex;
    }

    // Create texture instance
    const texture = this.loader.load(
      fullUrl,
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
        console.warn(`[TexturePipeline] Fallback activated for ${url}:`, err);
        if (fallbackKey) {
          const fallbackTex = TextureGenerator.getTexture(fallbackKey);
          texture.image = fallbackTex.image;
          texture.needsUpdate = true;
        }
      }
    );

    texture.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = this.maxAnisotropy;

    this.cache.set(url, texture);
    return texture;
  }

  /**
   * Retrieves photographic texture sets for any body in the solar system.
   */
  public getPlanetTextures(bodyName: string): PlanetTextureSet {
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

      default:
        // Moons, dwarf planets, asteroids: Use procedural procedural texture generator
        return {
          map: TextureGenerator.getTexture(bodyName),
        };
    }
  }

  /**
   * Deep photographic Milky Way panorama
   */
  public getMilkyWayTexture(): THREE.Texture {
    return this.loadTexture('/textures/8k_stars_milky_way.jpg', true);
  }
}
