import * as THREE from 'three';
import { CoordinateFrames } from '../astronomy/CoordinateFrames';
import { DEFAULT_GALAXY_CONFIG, GALAXY_UNITS_PER_KPC, SUN_HEIGHT_KPC } from './MilkyWayGalaxy';

/** Seeded PRNG (Mulberry32) so the sky looks the same on every load. */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Index of the first CDF entry ≥ target (binary search). */
function sampleCdf(cdf: Float64Array, target: number): number {
  let lo = 0;
  let hi = cdf.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (cdf[mid] < target) lo = mid + 1; else hi = mid;
  }
  return lo;
}

/** Cumulative distribution of per-pixel weights. */
function buildCdf(n: number, weight: (i: number) => number): { cdf: Float64Array; total: number } {
  const cdf = new Float64Array(n);
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += weight(i);
    cdf[i] = total;
  }
  return { cdf, total };
}

type Kind = 'stars' | 'glow' | 'dust';
type Family = 'sky' | 'disk';

interface PointData {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  alphas: Float32Array;
}

interface DrawSpec {
  /** Camera distances (render units) over which nearby sprites fade in. */
  nearFade: [number, number];
  /** On-screen size limits (px). */
  pointClamp: [number, number];
  /** Gaussian falloff of the sprite profile. */
  falloff: number;
  renderOrder: number;
}

interface DiskLayerSpec extends DrawSpec {
  name: string;
  count: number;
  /** World-space sprite size range (render units). */
  size: [number, number];
  /** Exponent on the random number that picks the size (high = most sprites small). */
  sizeSkew: number;
  alpha: number;
  /** Multiplier on the local scale height (young stars and dust sit closer to the mid-plane). */
  heightScale: number;
}

/** A flattened shell of Gaia light: semi-axes in the galactic plane / towards the poles. */
interface SkyShellSpec {
  name: string;
  planeRadius: number;
  poleRadius: number;
  /** Share of the map's light this shell carries (the shells add up to 1). */
  weight: number;
  /** Blur radius in texture u (the far shell keeps the finest dust filaments; nearer shells are softer). */
  blur: number;
  renderOrder: number;
}

/** Stellar colours from hot to cool: blue, blue-white, white, yellow-white, yellow, orange, red. */
const SPECTRAL_COLORS: Array<[number, [number, number, number]]> = [
  [0.10, [0.62, 0.74, 1.0]],
  [0.30, [0.80, 0.87, 1.0]],
  [0.52, [1.0, 1.0, 1.0]],
  [0.68, [1.0, 0.95, 0.84]],
  [0.82, [1.0, 0.86, 0.62]],
  [0.93, [1.0, 0.70, 0.45]],
  [1.01, [1.0, 0.52, 0.38]],
];

function spectralColor(t: number): [number, number, number] {
  for (const [edge, c] of SPECTRAL_COLORS) if (t < edge) return c;
  return SPECTRAL_COLORS[SPECTRAL_COLORS.length - 1][1];
}

/**
 * The Milky Way as a 3D environment, in two families of particles.
 *
 * Sky (around the Solar System): the ESA/Gaia all-sky map is split into depth. Its diffuse light is
 * shared between three nested shells, flattened along the real galactic plane, and 54,000 stars in
 * blue-to-red spectral colours sit at their own distances inside the same slab, denser along the
 * band. From the Sun everything lines up into the Gaia sky (warm bulge, dust filaments, Magellanic
 * Clouds); when the camera moves the shells and stars slide past each other with parallax, so
 * zooming in and out reads as depth.
 *
 * Disk (galactic scale): stars, glow and dust importance-sampled from the face-on disk map the outer
 * galaxy model draws (NASA/JPL-Caltech/ESO, R. Hurt), lifted off the mid-plane with a sech² profile.
 * It uses the galaxy model's scale (1,320 units per kpc) and orientation with the Sun at the origin.
 *
 * Leaving the Solar System, the sky family fades as the camera flies through it and the disk family
 * takes over, until the whole spiral is seen from outside.
 */
export class MilkyWayVolume {
  public group: THREE.Group = new THREE.Group();
  private layers: THREE.Points[] = [];
  private shells: THREE.Mesh[] = [];
  private textures: THREE.Texture[] = [];

  // Shared by all layers
  private skyOpacity = { value: 1.0 };
  private diskOpacity = { value: 0.0 };
  private camLocalUniform = { value: new THREE.Vector3() };
  private pixelScaleUniform = { value: 1000.0 };
  /** > 0 in surface views: every particle is drawn on a sky shell of this radius around the camera. */
  private skyDistUniform = { value: 0.0 };

  private groundMode = false;
  private tmpCam = new THREE.Vector3();

  private static readonly DISK_SAMPLE = 512;
  private static readonly SKY_W = 1024;
  private static readonly SKY_H = 512;

  /** Crossfade distances from the Sun (render units). */
  private static readonly SKY_FADE: [number, number] = [4000, 15000];
  private static readonly DISK_FADE: [number, number] = [2500, 12000];

  // --- Sky family (Gaia map) ---

  private static readonly SKY_SHELLS: SkyShellSpec[] = [
    { name: 'milky_way_sky_far', planeRadius: 13000, poleRadius: 2600, weight: 0.5, blur: 0.0003, renderOrder: -13 },
    { name: 'milky_way_sky_mid', planeRadius: 7000, poleRadius: 2000, weight: 0.3, blur: 0.0012, renderOrder: -12 },
    { name: 'milky_way_sky_near', planeRadius: 3200, poleRadius: 1500, weight: 0.2, blur: 0.003, renderOrder: -11 },
  ];
  /** Overall brightness of the Gaia light (linear). */
  private static readonly SKY_GAIN = 0.9;
  /** Linear black level removed from the map (Gaia's high-latitude count noise). */
  private static readonly SKY_BLACK = 0.035;

  private static readonly SKY_STARS: DrawSpec & { count: number; uniform: number } = {
    count: 45000,
    uniform: 9000,
    nearFade: [40, 160],
    pointClamp: [1.0, 3.4],
    falloff: 14.0,
    renderOrder: -10,
  };

  // --- Disk family (face-on galaxy map) ---

  private static readonly DISK_STARS: DiskLayerSpec = {
    name: 'milky_way_disk_stars',
    count: 140000,
    size: [9, 40],
    sizeSkew: 6.0,
    alpha: 0.42,
    heightScale: 1.0,
    nearFade: [1200, 3500],
    pointClamp: [1.0, 2.6],
    falloff: 14.0,
    renderOrder: -10,
  };

  private static readonly DISK_GLOW: DiskLayerSpec = {
    name: 'milky_way_disk_glow',
    count: 6000,
    size: [900, 2300],
    sizeSkew: 1.0,
    alpha: 0.013,
    heightScale: 0.8,
    nearFade: [2500, 7000],
    pointClamp: [1.0, 360.0],
    falloff: 16.0,
    renderOrder: -11,
  };

  private static readonly DISK_DUST: DiskLayerSpec = {
    name: 'milky_way_disk_dust',
    count: 16000,
    size: [220, 600],
    sizeSkew: 1.0,
    alpha: 0.035,
    heightScale: 0.3,
    nearFade: [2500, 7000],
    pointClamp: [1.0, 160.0],
    falloff: 30.0,
    renderOrder: -9,
  };

  constructor() {
    this.group.name = 'milky_way_volume';

    // Same frame as MilkyWayGalaxy: local +X → −ŷ_gal, +Y → ẑ_gal (north galactic pole),
    // +Z → −x̂_gal, so the Galactic Centre lies towards local −Z from the Sun.
    const gal = CoordinateFrames.galacticBasisThree();
    const basis = new THREE.Matrix4().makeBasis(
      new THREE.Vector3(...gal.y).negate(),
      new THREE.Vector3(...gal.z),
      new THREE.Vector3(...gal.x).negate()
    );
    this.group.quaternion.setFromRotationMatrix(basis);

    this.load();
  }

  private load(): void {
    if (typeof document === 'undefined') return;
    const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
    const loader = new THREE.ImageLoader();
    loader.load(`${baseUrl}textures/gaia_sky.webp`, (image) => {
      this.buildSkyShells(image);
      const px = MilkyWayVolume.readPixels(image, MilkyWayVolume.SKY_W, MilkyWayVolume.SKY_H);
      if (px) this.buildSkyStars(px);
    });
    loader.load(`${baseUrl}textures/milky_way_disk.webp`, (image) => {
      const px = MilkyWayVolume.readPixels(image, MilkyWayVolume.DISK_SAMPLE, MilkyWayVolume.DISK_SAMPLE);
      if (px) this.buildDisk(px);
    });
  }

  private static readPixels(image: HTMLImageElement, w: number, h: number): Uint8ClampedArray | null {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(image, 0, 0, w, h);
    return ctx.getImageData(0, 0, w, h).data;
  }

  // ---------------------------------------------------------------------------------------------
  // Sky family
  // ---------------------------------------------------------------------------------------------

  /**
   * Diffuse Gaia light on three nested, flattened shells. Each fragment looks up the map in its own
   * direction from the Sun, so the shells coincide from there and separate with parallax elsewhere.
   */
  private buildSkyShells(image: HTMLImageElement): void {
    const tex = new THREE.Texture(image);
    tex.colorSpace = THREE.SRGBColorSpace;
    // Per-fragment longitude wraps at l = 180°: no mipmaps, so the seam has no derivative artefact
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    this.textures.push(tex);

    for (const spec of MilkyWayVolume.SKY_SHELLS) {
      const geo = new THREE.SphereGeometry(1, 128, 64);
      // Local +Y is the north galactic pole
      geo.scale(spec.planeRadius, spec.poleRadius, spec.planeRadius);
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: tex },
          uWeight: { value: spec.weight * MilkyWayVolume.SKY_GAIN },
          uBlur: { value: spec.blur },
          uBlack: { value: MilkyWayVolume.SKY_BLACK },
          uOpacity: this.skyOpacity,
          uCamLocal: this.camLocalUniform,
          uSkyDist: this.skyDistUniform,
        },
        vertexShader: `
          uniform vec3 uCamLocal;
          uniform float uSkyDist;
          varying vec3 vDir;
          void main() {
            vDir = position;
            vec3 p = uSkyDist > 0.0 ? uCamLocal + normalize(position) * uSkyDist : position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uMap;
          uniform float uWeight;
          uniform float uBlur;
          uniform float uBlack;
          uniform float uOpacity;
          varying vec3 vDir;

          void main() {
            // Local frame → galactic: x̂ (to the centre) = −Z, ŷ (l = 90°) = −X, ẑ (NGP) = +Y
            vec3 d = normalize(vDir);
            float l = atan(-d.x, -d.z);
            float b = asin(clamp(d.y, -1.0, 1.0));
            // Gaia panorama: l = 0 at the centre increasing to the left, b = +90° at the top
            vec2 uv = vec2(fract(0.5 - l / 6.2831853), 0.5 + b / 3.1415927);
            vec2 o = vec2(uBlur, uBlur * 2.0);
            vec3 c = texture2D(uMap, uv).rgb * 0.4;
            c += texture2D(uMap, uv + vec2(o.x, 0.0)).rgb * 0.15;
            c += texture2D(uMap, uv - vec2(o.x, 0.0)).rgb * 0.15;
            c += texture2D(uMap, clamp(uv + vec2(0.0, o.y), 0.0, 1.0)).rgb * 0.15;
            c += texture2D(uMap, clamp(uv - vec2(0.0, o.y), 0.0, 1.0)).rgb * 0.15;
            // Black point above the high-latitude count noise, then a gentle toe so the band's
            // edges fall off into a deep sky
            c = max(c - uBlack, 0.0) / (1.0 - uBlack);
            c *= smoothstep(0.0, 0.08, dot(c, vec3(0.2126, 0.7152, 0.0722)));
            gl_FragColor = vec4(c * (uWeight * uOpacity), 1.0);
          }
        `,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneFactor,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.name = spec.name;
      mesh.renderOrder = spec.renderOrder;
      mesh.frustumCulled = false;
      mesh.userData.family = 'sky';
      this.shells.push(mesh);
      this.group.add(mesh);
    }
  }

  private buildSkyStars(px: Uint8ClampedArray): void {
    const W = MilkyWayVolume.SKY_W;
    const H = MilkyWayVolume.SKY_H;
    const n = W * H;
    const toLinear = (v: number) => Math.pow(v / 255, 2.2);

    // Linear brightness above the map's black level, and the pixel's solid angle (∝ cos b)
    const BLACK = MilkyWayVolume.SKY_BLACK;
    const f = new Float32Array(n);
    const cosB = new Float32Array(H);
    for (let y = 0; y < H; y++) cosB[y] = Math.cos((0.5 - (y + 0.5) / H) * Math.PI);
    for (let i = 0; i < n; i++) {
      const lum = 0.2126 * toLinear(px[i * 4]) + 0.7152 * toLinear(px[i * 4 + 1]) + 0.0722 * toLinear(px[i * 4 + 2]);
      f[i] = Math.max(0, lum - BLACK);
    }
    // Panorama convention: l = 0 at the centre, increasing to the left; b = +90° at the top.
    // Directions are built in the render frame, then expressed in this group's local frame.
    const gal = CoordinateFrames.galacticBasisThree();
    const qInv = this.group.quaternion.clone().invert();
    const dir = new THREE.Vector3();
    const rand = mulberry32(0x9a1a5);

    /** Random direction inside pixel idx; returns sin b of that direction. */
    const pixelDirection = (idx: number): number => {
      const x = idx % W;
      const y = (idx / W) | 0;
      const l = (0.5 - (x + rand()) / W) * 2 * Math.PI;
      const b = (0.5 - (y + rand()) / H) * Math.PI;
      const cx = Math.cos(b) * Math.cos(l);
      const cy = Math.cos(b) * Math.sin(l);
      const cz = Math.sin(b);
      dir.set(
        gal.x[0] * cx + gal.y[0] * cy + gal.z[0] * cz,
        gal.x[1] * cx + gal.y[1] * cy + gal.z[1] * cz,
        gal.x[2] * cx + gal.y[2] * cy + gal.z[2] * cz
      ).applyQuaternion(qInv);
      return cz;
    };

    /** Distance inside [near, far], kept within a slab of half-thickness `slab` about the plane. */
    const slabDistance = (sinB: number, near: number, far: number, slab: number, skew: number): number => {
      const r = near + (far - near) * Math.pow(rand(), skew);
      return Math.max(near, Math.min(r, slab / Math.max(Math.abs(sinB), 1e-3)));
    };

    /** Map colour of pixel idx as linear chromaticity (unit luminance). */
    const chroma = (idx: number, out: Float32Array, o: number) => {
      const r = toLinear(px[idx * 4]);
      const g = toLinear(px[idx * 4 + 1]);
      const b = toLinear(px[idx * 4 + 2]);
      const lum = Math.max(0.2126 * r + 0.7152 * g + 0.0722 * b, 1e-4);
      out[o] = r / lum;
      out[o + 1] = g / lum;
      out[o + 2] = b / lum;
    };

    // Stars: denser along the band but present everywhere, plus an isotropic field. Colours follow a
    // spectral mix (blue O/B to red M), nudged by the map's local tint.
    const S = MilkyWayVolume.SKY_STARS;
    const total = S.count + S.uniform;
    const { cdf, total: starTotal } = buildCdf(n, (i) => Math.pow(f[i] + 0.002, 0.45) * cosB[(i / W) | 0]);
    const data = MilkyWayVolume.allocate(total);
    const tint = new Float32Array(3);
    for (let k = 0; k < total; k++) {
      let sinB: number;
      let idx = -1;
      if (k < S.count) {
        idx = sampleCdf(cdf, rand() * starTotal);
        sinB = pixelDirection(idx);
      } else {
        const z = rand() * 2 - 1;
        const a = rand() * 2 * Math.PI;
        const s = Math.sqrt(1 - z * z);
        dir.set(s * Math.cos(a), z, s * Math.sin(a));
        sinB = dir.y; // local +Y is the north galactic pole
      }
      // Many nearby stars give strong parallax; the band's stars sit further out
      const r = slabDistance(sinB, 1300, 14000, 1500, 1.6);
      data.positions[k * 3] = dir.x * r;
      data.positions[k * 3 + 1] = dir.y * r;
      data.positions[k * 3 + 2] = dir.z * r;

      const c = spectralColor(rand());
      let tr = 1;
      let tg = 1;
      let tb = 1;
      if (idx >= 0) {
        chroma(idx, tint, 0);
        const m = Math.max(tint[0], tint[1], tint[2]);
        tr = 0.85 + 0.15 * tint[0] / m;
        tg = 0.85 + 0.15 * tint[1] / m;
        tb = 0.85 + 0.15 * tint[2] / m;
      }
      data.colors[k * 3] = c[0] * tr;
      data.colors[k * 3 + 1] = c[1] * tg;
      data.colors[k * 3 + 2] = c[2] * tb;

      // Steep luminosity function: most stars faint, a few bright
      const bright = Math.pow(rand(), 4.0);
      // A fine unresolved texture under the real catalogue stars (CatalogueStars), not a second
      // sky of bright points: kept small and faint so the measured stars lead
      data.sizes[k] = 10 + bright * 38;
      data.alphas[k] = 0.06 + bright * 0.42;
    }
    this.addLayer('milky_way_sky_stars', data, 'stars', 'sky', S);
  }

  // ---------------------------------------------------------------------------------------------
  // Disk family
  // ---------------------------------------------------------------------------------------------

  private buildDisk(px: Uint8ClampedArray): void {
    const N = MilkyWayVolume.DISK_SAMPLE;
    const half = DEFAULT_GALAXY_CONFIG.radius; // half-width of the disk artwork
    const radial = (i: number) =>
      Math.hypot(((i % N) + 0.5) / N - 0.5, (((i / N) | 0) + 0.5) / N - 0.5) * 2.0;
    const rgb = (i: number) => [px[i * 4] / 255, px[i * 4 + 1] / 255, px[i * 4 + 2] / 255];

    // Leave the innermost ~0.4 kpc to the Sagittarius A* model
    const stars = buildCdf(N * N, (i) => {
      if (radial(i) <= 0.02) return 0;
      const [r, g, b] = rgb(i);
      return (px[i * 4 + 3] / 255) * Math.pow(0.2126 * r + 0.7152 * g + 0.0722 * b, 1.4);
    });
    // Dark lanes: reddish, low-blue texels (same test as the galaxy model's extinction sheet)
    const dust = buildCdf(N * N, (i) => {
      const rad = radial(i);
      if (rad <= 0.06 || rad >= 0.8) return 0;
      const [r, , b] = rgb(i);
      return (px[i * 4 + 3] / 255) * THREE.MathUtils.clamp((r * 1.1 - b) * 1.8, 0, 1) * (1 - b * 0.6);
    });
    if (stars.total <= 0) return;

    const rand = mulberry32(0x6a1a7);
    const sunZ = DEFAULT_GALAXY_CONFIG.sunDistance;
    const sunY = SUN_HEIGHT_KPC * GALAXY_UNITS_PER_KPC;

    const makeLayer = (spec: DiskLayerSpec, cdf: Float64Array, total: number, kind: Kind) => {
      if (total <= 0) return;
      const data = MilkyWayVolume.allocate(spec.count);
      for (let k = 0; k < spec.count; k++) {
        const idx = sampleCdf(cdf, rand() * total);
        // Disk artwork: image right = local +X, image down = local +Z (the Sun is below the centre)
        const lx = (((idx % N) + rand()) / N - 0.5) * 2 * half;
        const lz = ((((idx / N) | 0) + rand()) / N - 0.5) * 2 * half;
        const [r, g, b] = rgb(idx);

        // sech² vertical profile; thin disk ~0.16 kpc flaring outwards, ~0.7 kpc in the bulge
        const rKpc = Math.hypot(lx, lz) / GALAXY_UNITS_PER_KPC;
        let hKpc = 0.16 + 0.012 * rKpc + 0.55 * Math.exp(-((rKpc / 1.8) ** 2));
        if (kind === 'stars' && b > r * 1.05) hKpc *= 0.6; // young blue populations hug the plane
        const u = THREE.MathUtils.clamp(rand(), 0.002, 0.998);
        const ly = hKpc * spec.heightScale * GALAXY_UNITS_PER_KPC * Math.atanh(2 * u - 1);

        // Sun at the local origin
        data.positions[k * 3] = lx;
        data.positions[k * 3 + 1] = ly - sunY;
        data.positions[k * 3 + 2] = lz - sunZ;

        if (kind === 'dust') {
          data.colors.set([0.025, 0.018, 0.014], k * 3);
        } else {
          const mx = Math.max(r, g, b, 1e-3);
          // Resolved stars are whiter than the integrated, dust-reddened light of the map
          const w = kind === 'stars' ? 0.5 : 0.15;
          let cr = (r / mx) * (1 - w) + w;
          let cg = (g / mx) * (1 - w) + w;
          let cb = (b / mx) * (1 - w) + w;
          if (kind === 'stars') {
            const c = spectralColor(rand());
            cr *= c[0];
            cg *= c[1];
            cb *= c[2];
          }
          data.colors.set([cr, cg, cb], k * 3);
        }

        data.sizes[k] = spec.size[0] + Math.pow(rand(), spec.sizeSkew) * (spec.size[1] - spec.size[0]);
        // The map's saturated bulge would otherwise burn out the sky towards Sagittarius
        const bulgeDim = kind === 'dust' ? 1.0 : 0.3 + 0.7 * THREE.MathUtils.smoothstep(rKpc, 0.5, 4.0);
        data.alphas[k] = spec.alpha * bulgeDim * (kind === 'stars' ? 0.55 + rand() * 0.45 : 0.6 + rand() * 0.4);
      }
      this.addLayer(spec.name, data, kind, 'disk', spec);
    };

    makeLayer(MilkyWayVolume.DISK_GLOW, stars.cdf, stars.total, 'glow');
    makeLayer(MilkyWayVolume.DISK_STARS, stars.cdf, stars.total, 'stars');
    makeLayer(MilkyWayVolume.DISK_DUST, dust.cdf, dust.total, 'dust');
  }

  // ---------------------------------------------------------------------------------------------

  private static allocate(count: number): PointData {
    return {
      positions: new Float32Array(count * 3),
      colors: new Float32Array(count * 3),
      sizes: new Float32Array(count),
      alphas: new Float32Array(count),
    };
  }

  private addLayer(name: string, data: PointData, kind: Kind, family: Family, spec: DrawSpec): void {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(data.colors, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(data.sizes, 1));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(data.alphas, 1));
    // The camera is usually inside the volume: never frustum-cull it as a whole
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), Infinity);

    const points = new THREE.Points(geo, this.createMaterial(kind, family, spec));
    points.name = name;
    points.renderOrder = spec.renderOrder;
    points.frustumCulled = false;
    points.userData.family = family;
    this.layers.push(points);
    this.group.add(points);
  }

  private createMaterial(kind: Kind, family: Family, spec: DrawSpec): THREE.ShaderMaterial {
    const soften = kind === 'stars' ? '' : ' * (1.0 - smoothstep(0.12, 0.25, d))';
    // Additive layers write premultiplied colour, so bright sprites are not limited by alpha ≤ 1
    const output = kind === 'dust'
      ? 'gl_FragColor = vec4(vColor, a * vAlpha * uOpacity);'
      : 'gl_FragColor = vec4(vColor * (a * vAlpha * uOpacity), 1.0);';

    return new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: family === 'sky' ? this.skyOpacity : this.diskOpacity,
        uCamLocal: this.camLocalUniform,
        uPixelScale: this.pixelScaleUniform,
        uSkyDist: this.skyDistUniform,
        uNearFade: { value: new THREE.Vector2(...spec.nearFade) },
        uPointClamp: { value: new THREE.Vector2(...spec.pointClamp) },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aAlpha;
        uniform vec3 uCamLocal;
        uniform float uPixelScale;
        uniform float uSkyDist;
        uniform float uOpacity;
        uniform vec2 uNearFade;
        uniform vec2 uPointClamp;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec3 rel = position - uCamLocal;
          float dist = max(length(rel), 1.0);
          float s = aSize * uPixelScale / dist;
          float px = clamp(s, uPointClamp.x, uPointClamp.y);
          // Below the minimum sprite size keep the flux (alpha ∝ area), so surface brightness does
          // not change with distance; sprites very close to the camera fade instead of growing
          vAlpha = aAlpha * min(1.0, (s * s) / (px * px)) * smoothstep(uNearFade.x, uNearFade.y, dist);
          vColor = color;
          // Surface views: same directions as seen from the Sun, pulled onto a sky shell
          vec3 p = uSkyDist > 0.0 ? uCamLocal + rel / dist * uSkyDist : position;
          gl_PointSize = px;
          bool hidden = vAlpha * uOpacity < 0.0005;
          gl_Position = hidden ? vec4(2.0, 2.0, 2.0, 1.0) : projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = dot(c, c);
          if (d > 0.25) discard;
          float a = exp(-d * ${spec.falloff.toFixed(1)})${soften};
          ${output}
        }
      `,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: kind === 'dust' ? THREE.NormalBlending : THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
    });
  }

  /** Surface view: draw the sky as seen from the Sun on a shell inside the short far plane. */
  public setGroundMode(on: boolean, skyRadius: number = 3): void {
    this.groundMode = on;
    this.skyDistUniform.value = on ? skyRadius * 0.9 : 0.0;
    if (!on) this.group.position.set(0, 0, 0);
  }

  public update(camera: THREE.Camera, viewportHeightPx: number): void {
    if (this.groundMode) this.group.position.copy(camera.position);
    this.group.updateMatrixWorld();
    this.tmpCam.copy(camera.position);
    this.camLocalUniform.value.copy(this.group.worldToLocal(this.tmpCam));
    const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 45;
    this.pixelScaleUniform.value = viewportHeightPx / (2 * Math.tan(THREE.MathUtils.degToRad(fov) * 0.5));

    // Inside the Solar System the Gaia sky is the environment; flying out, the galaxy disk takes over
    const distToSun = this.groundMode ? 0 : camera.position.length();
    const [s0, s1] = MilkyWayVolume.SKY_FADE;
    const [d0, d1] = MilkyWayVolume.DISK_FADE;
    this.skyOpacity.value = 1.0 - THREE.MathUtils.smoothstep(distToSun, s0, s1);
    this.diskOpacity.value = THREE.MathUtils.smoothstep(distToSun, d0, d1);
    // Skip fully transparent layers: ~140k disk stars need no drawing inside the Solar System
    // (their shaders are still compiled up front by SolarSystemScene.warmUp)
    for (const o of [...this.layers, ...this.shells]) {
      o.visible = (o.userData.family === 'disk' ? this.diskOpacity.value : this.skyOpacity.value) > 0.001;
    }
  }

  public dispose(): void {
    for (const o of [...this.layers, ...this.shells]) {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
    for (const t of this.textures) t.dispose();
    this.layers = [];
    this.shells = [];
    this.textures = [];
  }
}
