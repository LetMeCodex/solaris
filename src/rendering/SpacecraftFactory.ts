import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import {
  NASA_EXTRA_ASSETS,
  NasaSpacecraftEntry,
  spacecraftToCelestialDef,
} from '../data/NasaEyesCatalog';
import { CatalogueManager } from '../data/CatalogueManager';
import {
  awaitEntryDyn,
  evaluateSpacecraftSceneState,
  loadDynSegment,
  ParentResolver,
  prefetchEntryDyn,
  SpacecraftSceneEval,
} from '../astronomy/DynamoTrajectory';
import { CelestialBodyDefinition } from '../types/catalogue';
import type { PlanetMeshBundle } from './PlanetFactory';

export interface NormalizedGltfAsset {
  template: THREE.Group;
  /** Half-extents along X, Y, Z in normalized [-1, 1] space (max axis == 1.0). */
  halfExtents: THREE.Vector3;
  boundingRadius: number;
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
  textures: THREE.Texture[];
}

export interface SpacecraftBundle extends PlanetMeshBundle {
  entry: NasaSpacecraftEntry;
  modelRoot: THREE.Group;
  loadedModelPath: string | null;
  halfExtents: THREE.Vector3;
  localVelocityUnitsS: THREE.Vector3;
  lastEval: SpacecraftSceneEval | null;
  lodTier: 1 | 2 | 3;
}

export type ComparisonPropKind = 'none' | 'scientist' | 'school_bus' | 'rose_bowl';

const COMPARISON_METERS: Record<Exclude<ComparisonPropKind, 'none'>, { path: string; spanM: number }> = {
  scientist: { path: NASA_EXTRA_ASSETS.comparisonScientist, spanM: 1.8 },
  school_bus: { path: NASA_EXTRA_ASSETS.comparisonSchoolBus, spanM: 11.0 },
  rose_bowl: { path: NASA_EXTRA_ASSETS.comparisonRoseBowl, spanM: 280.0 },
};

const ICONIC_DEEP_SPACE_IDS = new Set([
  'sc_voyager_1',
  'sc_voyager_2',
  'sc_new_horizons',
  'sc_parker_solar_probe',
  'sc_jwst',
  'sc_juno',
  'sc_cassini',
  'sc_europa_clipper',
  'sc_juice',
  'sc_lucy',
  'sc_psyche',
  'sc_osiris_rex',
  'sc_dart',
  'sc_iss',
  'sc_hubble',
  'sc_artemis_2',
  'sc_mars_2020',
  'sc_rosetta',
  'sc_messenger',
]);

/**
 * Generates an HDR space environment cubemap via PMREMGenerator so metallic thermal foil,
 * brushed titanium, optical mirrors, and solar arrays exhibit realistic crisp solar highlights
 * while keeping shadow sides authentically deep-space contrasty.
 */
export function createSpaceEnvironmentMap(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x020308);

  // Subtle galactic disk warm tint and cool cosmic fill band
  const galacticBand = new THREE.Mesh(
    new THREE.SphereGeometry(20, 24, 16),
    new THREE.MeshBasicMaterial({
      color: 0x0b1220,
      side: THREE.BackSide,
    })
  );
  envScene.add(galacticBand);

  // High-intensity HDR solar glint source (for crisp specular reflection on Kapton & mirrors)
  const sunDisc = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 16, 12),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(12.0, 11.2, 9.5) })
  );
  sunDisc.position.set(14, 7, 8);
  envScene.add(sunDisc);

  // Broad warm bounce lobe around Sun azimuth for realistic soft solar glow on brushed metal
  const sunHalo = new THREE.Mesh(
    new THREE.SphereGeometry(3.4, 16, 12),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(1.4, 1.25, 1.05) })
  );
  sunHalo.position.set(14, 7, 8);
  envScene.add(sunHalo);

  // Subtle cool blue planetshine / starfield counter-lobe so shadow-side struts remain legible
  const earthshineLobe = new THREE.Mesh(
    new THREE.SphereGeometry(5.5, 16, 12),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.22, 0.36, 0.58) })
  );
  earthshineLobe.position.set(-14, -5, -10);
  envScene.add(earthshineLobe);

  const target = pmrem.fromScene(envScene, 0.04);
  galacticBand.geometry.dispose();
  (galacticBand.material as THREE.Material).dispose();
  sunDisc.geometry.dispose();
  (sunDisc.material as THREE.Material).dispose();
  sunHalo.geometry.dispose();
  (sunHalo.material as THREE.Material).dispose();
  earthshineLobe.geometry.dispose();
  (earthshineLobe.material as THREE.Material).dispose();
  pmrem.dispose();

  return target.texture;
}

/**
 * Shared singleton GLTF / DRACO / KTX2 streaming bank for spacecraft, asteroid nuclei,
 * comets, comparison props, and magnetosphere overlays.
 */
export class GltfModelBank {
  private static gltfLoader: GLTFLoader | null = null;
  private static dracoLoader: DRACOLoader | null = null;
  private static ktx2Loader: KTX2Loader | null = null;
  private static cache = new Map<string, Promise<NormalizedGltfAsset | null>>();
  private static queue: Array<() => void> = [];
  private static activeLoads = 0;
  private static readonly MAX_CONCURRENT = 4;

  public static init(renderer: THREE.WebGLRenderer): void {
    if (this.gltfLoader) return;
    const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');

    const draco = new DRACOLoader();
    draco.setDecoderPath(`${base}draco/`);
    this.dracoLoader = draco;

    const ktx2 = new KTX2Loader();
    ktx2.setTranscoderPath(`${base}basis/`);
    try {
      ktx2.detectSupport(renderer);
    } catch {
      // Safe fallback in software or headless contexts
    }
    this.ktx2Loader = ktx2;

    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);
    loader.setKTX2Loader(ktx2);
    this.gltfLoader = loader;
  }

  private static pumpQueue(): void {
    while (this.activeLoads < this.MAX_CONCURRENT && this.queue.length > 0) {
      const next = this.queue.shift();
      if (next) {
        this.activeLoads++;
        next();
      }
    }
  }

  public static isReady(): boolean {
    return this.gltfLoader !== null;
  }

  public static extractFirstGeometry(asset: NormalizedGltfAsset): THREE.BufferGeometry | null {
    let found: THREE.BufferGeometry | null = null;
    asset.template.updateMatrixWorld(true);
    asset.template.traverse((obj) => {
      if (found) return;
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry) {
        const clone = mesh.geometry.clone();
        clone.applyMatrix4(mesh.matrixWorld);
        if (!clone.attributes.normal) clone.computeVertexNormals();
        found = clone;
      }
    });
    return found;
  }

  public static loadNormalized(
    modelPath: string,
    mode: 'spacecraft' | 'natural' = 'spacecraft',
    priority: boolean = false
  ): Promise<NormalizedGltfAsset | null> {
    if (typeof window === 'undefined' || typeof fetch === 'undefined') {
      return Promise.resolve(null);
    }
    const key = `${mode}:${modelPath}`;
    const existing = this.cache.get(key);
    if (existing) return existing;

    const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
    const url = `${base}nasa/models/${modelPath}`;

    const promise = new Promise<NormalizedGltfAsset | null>((resolve) => {
      const run = () => {
        if (!this.gltfLoader) {
          this.gltfLoader = new GLTFLoader();
        }
        this.gltfLoader
          .loadAsync(url)
          .then((gltf) => {
            const raw = gltf.scene || gltf.scenes?.[0];
            if (!raw) {
              resolve(null);
              return;
            }
            resolve(this.normalizeRoot(raw, mode));
          })
          .catch(() => {
            resolve(null);
          })
          .finally(() => {
            this.activeLoads = Math.max(0, this.activeLoads - 1);
            this.pumpQueue();
          });
      };

      if (priority) {
        this.queue.unshift(run);
      } else {
        this.queue.push(run);
      }
      this.pumpQueue();
    });

    this.cache.set(key, promise);
    return promise;
  }

  private static normalizeRoot(
    raw: THREE.Object3D,
    mode: 'spacecraft' | 'natural'
  ): NormalizedGltfAsset {
    raw.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(raw);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    if (box.isEmpty()) {
      size.set(2, 2, 2);
      center.set(0, 0, 0);
    } else {
      box.getSize(size);
      box.getCenter(center);
    }

    const maxDim = Math.max(1e-5, size.x, size.y, size.z);
    const scale = 2.0 / maxDim;

    const wrapper = new THREE.Group();
    raw.position.sub(center).multiplyScalar(scale);
    raw.scale.multiplyScalar(scale);
    raw.updateMatrixWorld(true);
    wrapper.add(raw);

    const halfExtents = new THREE.Vector3(
      Math.max(0.05, (size.x * scale) * 0.5),
      Math.max(0.05, (size.y * scale) * 0.5),
      Math.max(0.05, (size.z * scale) * 0.5)
    );
    const boundingRadius = halfExtents.length();

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures = new Set<THREE.Texture>();

    wrapper.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = mode === 'spacecraft';
      mesh.receiveShadow = true;
      if (mesh.geometry) {
        geometries.push(mesh.geometry);
        if (!mesh.geometry.attributes.normal) {
          mesh.geometry.computeVertexNormals();
        }
      }

      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        if (!m) continue;
        materials.push(m);
        const std = m as THREE.MeshStandardMaterial;
        if (std.isMeshStandardMaterial || (std as THREE.MeshPhysicalMaterial).isMeshPhysicalMaterial) {
          if (std.map) {
            std.map.colorSpace = THREE.SRGBColorSpace;
            textures.add(std.map);
          }
          if (std.emissiveMap) {
            std.emissiveMap.colorSpace = THREE.SRGBColorSpace;
            textures.add(std.emissiveMap);
          }
          if (mode === 'spacecraft') {
            std.envMapIntensity = std.metalness > 0.5 ? 1.75 : 1.05;
            if (std.roughness < 0.06) std.roughness = 0.06;
          } else {
            // Asteroids / comets / moons: regolith is low-albedo rocky silicate
            std.envMapIntensity = 0.38;
            if (std.roughness < 0.65) std.roughness = 0.85;
            if (std.metalness > 0.25) std.metalness = 0.1;
          }
          std.needsUpdate = true;
        }
      }
    });

    return {
      template: wrapper,
      halfExtents,
      boundingRadius,
      geometries,
      materials,
      textures: [...textures],
    };
  }

  public static instantiate(asset: NormalizedGltfAsset): THREE.Group {
    // Shallow clone shares cached GPU Geometries & Materials across instances for low VRAM
    return asset.template.clone(true);
  }

  public static dispose(): void {
    this.queue = [];
    this.dracoLoader?.dispose();
    this.ktx2Loader?.dispose();
    this.dracoLoader = null;
    this.ktx2Loader = null;
    this.gltfLoader = null;
  }
}

/**
 * The spacecraft are drawn on a layer of their own, which only the main view's camera sees: the
 * jet's reflection cube, the cockpit displays and the mirrors render the whole scene from other
 * cameras, and drawing every satellite round the planet there (each a speck at best) cost draw
 * calls and pulled their textures back onto the GPU as soon as they had been released.
 */
export const SPACECRAFT_LAYER = 5;

export function computeSpacecraftVisualRadius(entry: NasaSpacecraftEntry): number {
  // Logarithmic/bounded size scaling keeps giant stations & tiny landers cleanly inspectable in 3D
  const spanM = Math.max(1.2, entry.physicalSpanM);
  return Math.max(0.055, Math.min(0.42, 0.045 + Math.log10(spanM) * 0.145));
}

/**
 * Manages the full fleet of NASA Eyes spacecraft, 3-tier LOD streaming, photorealistic
 * close-up key + planet-albedo lighting, comparison props, magnetosphere overlays, and
 * decluttered cyan diamond reticles.
 */
export class SpacecraftLayerManager {
  private scene: THREE.Scene;
  private container: HTMLElement | null;
  private bundles: SpacecraftBundle[] = [];
  private bundleByKey = new Map<string, SpacecraftBundle>();
  private loadingModel = new Set<string>();

  // Close-range studio PBR lighting for focused/flyby spacecraft
  private keyLight: THREE.PointLight;
  private fillLight: THREE.PointLight;

  // Comparison & contextual science overlays
  private comparisonKind: ComparisonPropKind = 'none';
  private comparisonGroup: THREE.Group | null = null;
  private overlaysVisible = false;
  private heliosphereGroup: THREE.Group | null = null;
  private magnetosphereGroup: THREE.Group | null = null;

  // Dedicated pooled clickable diamond reticles
  private reticleRoot: HTMLDivElement | null = null;
  private reticlePool: HTMLButtonElement[] = [];
  private onPick: ((name: string) => void) | null = null;

  private tmpCam = new THREE.Vector3();
  private tmpProj = new THREE.Vector3();
  private tmpSun = new THREE.Vector3(0, 0, 0);
  private tmpParent = new THREE.Vector3();
  private frameCounter = 0;
  /**
   * GPU memory: when each loaded model was last on screen, and the ones whose geometry and
   * textures have been released from the GPU (three.js uploads them again by itself the next
   * time they are drawn; the decoded images stay in memory). Without this, every craft ever
   * loaded stayed resident: flying near Earth loaded every satellite in orbit, gigabytes of
   * textures on a 6 GB card, and the frame rate collapsed as the GPU paged them in and out.
   */
  private lastShown = new Map<SpacecraftBundle, number>();
  private evicted = new Set<SpacecraftBundle>();
  private frustum = new THREE.Frustum();
  private frustumMat = new THREE.Matrix4();
  private frustumSphere = new THREE.Sphere();
  private static readonly EVICT_AFTER_MS = 20000;

  private releaseGpu(b: SpacecraftBundle): void {
    b.modelRoot.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.geometry?.dispose();
      for (const m of ([] as THREE.Material[]).concat(mesh.material ?? [])) {
        for (const v of Object.values(m)) if ((v as THREE.Texture | null)?.isTexture) (v as THREE.Texture).dispose();
      }
    });
    this.evicted.add(b);
  }

  constructor(opts: {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    container?: HTMLElement | null;
    onPickSpacecraft?: (name: string) => void;
  }) {
    this.scene = opts.scene;
    this.container = opts.container ?? null;
    this.onPick = opts.onPickSpacecraft ?? null;

    GltfModelBank.init(opts.renderer);

    // Local short-range HDR spacecraft key + albedo rim fill (zero impact on distant planets)
    this.keyLight = new THREE.PointLight(0xfff5e4, 0, 18, 1.4);
    this.fillLight = new THREE.PointLight(0x6da6ff, 0, 14, 1.6);
    this.scene.add(this.keyLight);
    this.scene.add(this.fillLight);

    if (this.container) {
      const root = document.createElement('div');
      root.className = 'sol-markers sol-sc-markers';
      this.container.appendChild(root);
      this.reticleRoot = root;
    }

    this.initCatalogEntries();
  }

  private initCatalogEntries(): void {
    const catalog = CatalogueManager.getSpacecraftCatalog();
    for (const entry of catalog) {
      const def: CelestialBodyDefinition = spacecraftToCelestialDef(entry);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = `sc_${entry.name}`;
      bodyGroup.visible = false;

      const modelRoot = new THREE.Group();
      modelRoot.name = 'model_root';
      bodyGroup.add(modelRoot);

      const visualRadius = computeSpacecraftVisualRadius(entry);
      // Lightweight invisible pick proxy until full GLTF is streamed in
      const proxy = new THREE.Mesh(
        new THREE.OctahedronGeometry(visualRadius * 0.45, 0),
        new THREE.MeshBasicMaterial({
          color: entry.colorHex,
          transparent: true,
          opacity: 0.0,
          depthWrite: false,
        })
      );
      proxy.name = 'lod_proxy';
      bodyGroup.add(proxy);
      bodyGroup.traverse((o) => o.layers.set(SPACECRAFT_LAYER));

      this.scene.add(bodyGroup);

      const bundle: SpacecraftBundle = {
        definition: def,
        bodyGroup,
        surfaceMesh: proxy,
        visualRadius,
        entry,
        modelRoot,
        loadedModelPath: null,
        halfExtents: new THREE.Vector3(visualRadius, visualRadius, visualRadius),
        localVelocityUnitsS: new THREE.Vector3(),
        lastEval: null,
        lodTier: 3,
      };

      this.bundles.push(bundle);
      this.bundleByKey.set(entry.id.toLowerCase(), bundle);
      this.bundleByKey.set(entry.name.toLowerCase(), bundle);
      if (!this.bundleByKey.has(entry.shortName.toLowerCase())) {
        this.bundleByKey.set(entry.shortName.toLowerCase(), bundle);
      }
    }
  }

  public getBundles(): SpacecraftBundle[] {
    return this.bundles;
  }

  public getBundle(idOrName: string): SpacecraftBundle | undefined {
    return this.bundleByKey.get(idOrName.toLowerCase());
  }

  public getSpacecraftWorldPosition(idOrName: string, out = new THREE.Vector3()): THREE.Vector3 | null {
    const b = this.getBundle(idOrName);
    if (!b || !b.lastEval) return null;
    return out.copy(b.bodyGroup.position);
  }

  /** Sets active NASA Eyes real-world scale comparison prop beside the focused spacecraft. */
  public setComparisonProp(kind: ComparisonPropKind): void {
    if (this.comparisonKind === kind) return;
    this.comparisonKind = kind;
    if (this.comparisonGroup) {
      this.comparisonGroup.removeFromParent();
      this.comparisonGroup = null;
    }
    if (kind === 'none') return;

    const spec = COMPARISON_METERS[kind];
    GltfModelBank.loadNormalized(spec.path, 'spacecraft').then((asset) => {
      if (!asset || this.comparisonKind !== kind) return;
      const g = GltfModelBank.instantiate(asset);
      g.name = `comparison_${kind}`;
      this.comparisonGroup = g;
      this.scene.add(g);
    });
  }

  public getComparisonProp(): ComparisonPropKind {
    return this.comparisonKind;
  }

  /** Toggles Saturn Magnetosphere & Voyager Heliosphere volumetric NASA Eyes overlays. */
  public setScienceOverlaysVisible(visible: boolean): void {
    this.overlaysVisible = visible;
    if (this.heliosphereGroup) this.heliosphereGroup.visible = visible;
    if (this.magnetosphereGroup) this.magnetosphereGroup.visible = visible;
    if (!visible) return;

    if (!this.heliosphereGroup) {
      GltfModelBank.loadNormalized(NASA_EXTRA_ASSETS.heliosphere, 'spacecraft').then((asset) => {
        if (!asset) return;
        const g = GltfModelBank.instantiate(asset);
        // Scale ~120 AU heliopause envelope around Sun
        g.scale.setScalar(120 * 149597870.7 * (2.4 / 6371));
        g.traverse((o) => {
          const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
          if (m) {
            m.transparent = true;
            m.opacity = 0.22;
            m.depthWrite = false;
            m.side = THREE.DoubleSide;
          }
        });
        g.visible = this.overlaysVisible;
        this.heliosphereGroup = g;
        this.scene.add(g);
      });
    }

    if (!this.magnetosphereGroup) {
      GltfModelBank.loadNormalized(NASA_EXTRA_ASSETS.saturnMagnetosphere, 'spacecraft').then((asset) => {
        if (!asset) return;
        const g = GltfModelBank.instantiate(asset);
        g.scale.setScalar(260);
        g.traverse((o) => {
          const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
          if (m) {
            m.transparent = true;
            m.opacity = 0.26;
            m.depthWrite = false;
            m.side = THREE.DoubleSide;
          }
        });
        g.visible = this.overlaysVisible;
        this.magnetosphereGroup = g;
        this.scene.add(g);
      });
    }
  }

  public getScienceOverlaysVisible(): boolean {
    return this.overlaysVisible;
  }

  private ensureModelLoaded(bundle: SpacecraftBundle, modelPath: string, priority: boolean = false): void {
    const token = `${bundle.entry.id}:${modelPath}`;
    if (bundle.loadedModelPath === modelPath || this.loadingModel.has(token)) return;
    this.loadingModel.add(token);

    GltfModelBank.loadNormalized(modelPath, 'spacecraft', priority)
      .then((asset) => {
        if (!asset) return;
        // Clear old variant if transitioning cruise <-> rover or stowed <-> deployed
        while (bundle.modelRoot.children.length > 0) {
          bundle.modelRoot.remove(bundle.modelRoot.children[0]);
        }
        const instance = GltfModelBank.instantiate(asset);
        instance.traverse((o) => o.layers.set(SPACECRAFT_LAYER));
        instance.scale.setScalar(bundle.visualRadius);
        bundle.modelRoot.add(instance);
        bundle.loadedModelPath = modelPath;
        bundle.halfExtents.copy(asset.halfExtents).multiplyScalar(bundle.visualRadius);
        // Hide wireframe proxy once high-res PBR mesh is mounted
        if (bundle.surfaceMesh && bundle.surfaceMesh.name === 'lod_proxy') {
          bundle.surfaceMesh.visible = false;
        }
      })
      .finally(() => {
        this.loadingModel.delete(token);
      });
  }

  /**
   * Synchronously evaluates a spacecraft's live orbital/.dyn state and queues priority
   * GLTF + .dyn loading so Jet Mode can immediately warp beside it with a crisp hull.
   */
  public ensureTargetPrepared(
    idOrName: string,
    jdTDB: number,
    resolver: ParentResolver
  ): SpacecraftBundle | undefined {
    const b = this.getBundle(idOrName);
    if (!b) return undefined;
    const fullResolver: ParentResolver = {
      ...resolver,
      getSpacecraftWorldPosition: (id, out) => this.getSpacecraftWorldPosition(id, out),
    };
    prefetchEntryDyn(b.entry);
    const ev = evaluateSpacecraftSceneState(b.entry, jdTDB, fullResolver, (dynFile) => {
      void loadDynSegment(dynFile);
    });
    if (ev) {
      b.lastEval = ev;
      b.bodyGroup.position.copy(ev.worldPosition);
      b.localVelocityUnitsS.copy(ev.worldVelocityUnitsS);
      if (ev.attitude) b.bodyGroup.quaternion.copy(ev.attitude);
      b.lodTier = 1;
      b.bodyGroup.visible = true;
      this.ensureModelLoaded(b, ev.activeModelPath, true);
    }
    return b;
  }

  /**
   * Awaits any uncached active `.dyn` trajectory or attitude binary segments for `idOrName`,
   * then re-evaluates its exact scene position/attitude so formation rendezvous stays synced.
   */
  public async awaitTargetPrepared(
    idOrName: string,
    jdTDB: number,
    resolver: ParentResolver
  ): Promise<SpacecraftBundle | undefined> {
    const b = this.getBundle(idOrName);
    if (!b) return undefined;
    const fetched = await awaitEntryDyn(b.entry, jdTDB);
    if (!fetched) return undefined;
    return this.ensureTargetPrepared(b.entry.id, jdTDB, resolver);
  }

  /**
   * Advances orbital/trajectory positions and drives 3-tier distance LOD streaming,
   * close-range lighting, comparison props, and crisp diamond reticles.
   */
  public update(params: {
    jdTDB: number;
    camera: THREE.PerspectiveCamera;
    resolver: ParentResolver;
    focusedName: string | null;
    jetLockedName: string | null;
    jetActive: boolean;
    hudSelectorsReady?: boolean;
    deltaSec: number;
    projectWorldToScreen?: (world: THREE.Vector3) => { x: number; y: number } | null;
  }): void {
    this.frameCounter++;
    const { jdTDB, camera, resolver, focusedName, jetLockedName, projectWorldToScreen } = params;
    camera.getWorldPosition(this.tmpCam);
    const fullResolver: ParentResolver = {
      ...resolver,
      getSpacecraftWorldPosition: (id, out) => this.getSpacecraftWorldPosition(id, out),
    };

    const focusedLower = focusedName?.toLowerCase() ?? null;
    const lockedLower = jetLockedName?.toLowerCase() ?? null;

    // Position Saturn magnetosphere if active
    if (this.overlaysVisible && this.magnetosphereGroup) {
      const satPos = resolver.getWorldPosition('Saturn', this.tmpParent);
      if (satPos) this.magnetosphereGroup.position.copy(satPos);
    }

    let focusedBundle: SpacecraftBundle | null = null;
    let lockedBundle: SpacecraftBundle | null = null;
    let closestVisibleBundle: SpacecraftBundle | null = null;
    let closestVisibleDist = Infinity;

    for (let i = 0; i < this.bundles.length; i++) {
      const b = this.bundles[i];
      const isFocused =
        focusedLower !== null &&
        (b.entry.name.toLowerCase() === focusedLower ||
          b.entry.id.toLowerCase() === focusedLower ||
          b.entry.shortName.toLowerCase() === focusedLower);
      const isLocked =
        lockedLower !== null &&
        (b.entry.name.toLowerCase() === lockedLower ||
          b.entry.id.toLowerCase() === lockedLower ||
          b.entry.shortName.toLowerCase() === lockedLower);
      const hostMatchesFocus =
        focusedLower !== null && b.entry.hostBody.toLowerCase().includes(focusedLower);

      const isIconic = ICONIC_DEEP_SPACE_IDS.has(b.entry.id);

      // Stagger updates for distant non-priority craft after frame 1 so idle CPU cost stays negligible
      if (this.frameCounter > 1 && !isFocused && !isLocked && !hostMatchesFocus && !isIconic && b.lodTier === 3) {
        if ((i + this.frameCounter) % 6 !== 0 && b.lastEval) continue;
      }

      const ev = evaluateSpacecraftSceneState(b.entry, jdTDB, fullResolver, (dynFile) => {
        if (isFocused || isLocked || hostMatchesFocus || isIconic || b.lodTier <= 2) {
          void loadDynSegment(dynFile);
        }
      });

      if (!ev) {
        b.bodyGroup.visible = false;
        continue;
      }

      b.lastEval = ev;
      b.bodyGroup.position.copy(ev.worldPosition);
      b.localVelocityUnitsS.copy(ev.worldVelocityUnitsS);
      if (ev.attitude) {
        b.bodyGroup.quaternion.copy(ev.attitude);
      }

      const camDist = this.tmpCam.distanceTo(ev.worldPosition);
      // How big the craft is on screen (radius, px): a model is only worth loading, and drawing,
      // once it is more than a speck. By distance alone (420 units, ~37,000 km near Earth) every
      // satellite in orbit loaded the moment the jet was over Earth, each a fraction of a pixel
      const screenH = typeof window !== 'undefined' ? window.innerHeight : 1080;
      const pxRadius = (b.visualRadius / Math.max(camDist, 1e-6)) * (screenH / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      const nearInspect = camDist < 120 && pxRadius > 2.5;
      const nearPrefetch = camDist < 420 && pxRadius > 1;

      if (isFocused || isLocked || nearInspect) {
        b.lodTier = 1;
        b.bodyGroup.visible = true;
        this.ensureModelLoaded(b, ev.activeModelPath, isFocused || isLocked);
        if (isFocused) focusedBundle = b;
        if (isLocked) lockedBundle = b;
        if (camDist < closestVisibleDist) {
          closestVisibleDist = camDist;
          closestVisibleBundle = b;
        }
      } else if (nearPrefetch || hostMatchesFocus) {
        b.lodTier = 2;
        b.bodyGroup.visible = nearPrefetch;
        if (nearPrefetch || (hostMatchesFocus && camDist < 900)) {
          this.ensureModelLoaded(b, ev.activeModelPath, false);
          prefetchEntryDyn(b.entry);
        }
        if (camDist < closestVisibleDist && b.bodyGroup.visible) {
          closestVisibleDist = camDist;
          closestVisibleBundle = b;
        }
      } else {
        b.lodTier = 3;
        b.bodyGroup.visible = false;
      }
    }

    // Release the GPU memory of models off screen for a while (re-uploaded on their next draw).
    // On screen means in the camera's view: craft scattered round a planet are mostly behind
    // the camera or beside it, and those held their textures for nothing
    const nowMs = performance.now();
    camera.updateMatrixWorld();
    this.frustum.setFromProjectionMatrix(this.frustumMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
    for (const b of this.bundles) {
      if (!b.loadedModelPath) continue;
      const inView = b.bodyGroup.visible && this.frustum.intersectsSphere(this.frustumSphere.set(b.bodyGroup.position, b.visualRadius * 2));
      if (inView) {
        this.lastShown.set(b, nowMs);
        this.evicted.delete(b);
      } else if (!this.evicted.has(b) && nowMs - (this.lastShown.get(b) ?? nowMs) > SpacecraftLayerManager.EVICT_AFTER_MS) {
        this.releaseGpu(b);
      } else if (!this.lastShown.has(b)) {
        this.lastShown.set(b, nowMs);
      }
    }

    // Update close-up PBR lighting rig (sunward key + planet-albedo rim fill)
    const studioTarget = focusedBundle ?? lockedBundle ?? (closestVisibleDist < 42 ? closestVisibleBundle : null);
    if (studioTarget && studioTarget.lastEval) {
      const targetPos = studioTarget.bodyGroup.position;
      const sunPos = resolver.getWorldPosition('Sun', this.tmpSun) ?? this.tmpSun.set(0, 0, 0);
      const toSun = sunPos.clone().sub(targetPos).normalize();
      const offset = Math.max(2.5, studioTarget.visualRadius * 10);

      this.keyLight.position.copy(targetPos).addScaledVector(toSun, offset);
      this.keyLight.intensity = 18.0 * studioTarget.visualRadius + 1.4;
      this.keyLight.distance = offset * 3.5;

      const parentPos = resolver.getWorldPosition(studioTarget.lastEval.parentName, this.tmpParent);
      if (parentPos && studioTarget.lastEval.parentName !== 'Sun') {
        const toParent = parentPos.clone().sub(targetPos).normalize();
        const parentBody = CatalogueManager.resolveAnyBody(studioTarget.lastEval.parentName);
        this.fillLight.color.set(parentBody?.physical.colorHex ?? '#6da6ff');
        this.fillLight.position.copy(targetPos).addScaledVector(toParent, offset * 0.85);
        this.fillLight.intensity = 6.5 * studioTarget.visualRadius + 0.35;
        this.fillLight.distance = offset * 3.0;
      } else {
        this.fillLight.intensity = 0;
      }

      // Position scale comparison prop next to focused spacecraft
      if (this.comparisonGroup && this.comparisonKind !== 'none' && focusedBundle) {
        const spec = COMPARISON_METERS[this.comparisonKind];
        const metersPerUnit = (focusedBundle.entry.physicalSpanM * 0.5) / focusedBundle.visualRadius;
        const propHalfUnits = (spec.spanM * 0.5) / Math.max(0.01, metersPerUnit);
        this.comparisonGroup.visible = true;
        this.comparisonGroup.scale.setScalar(propHalfUnits);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        this.comparisonGroup.position
          .copy(focusedBundle.bodyGroup.position)
          .addScaledVector(right, focusedBundle.visualRadius * 1.45 + propHalfUnits * 1.25);
        this.comparisonGroup.quaternion.copy(focusedBundle.bodyGroup.quaternion);
      } else if (this.comparisonGroup) {
        this.comparisonGroup.visible = false;
      }
    } else {
      this.keyLight.intensity = 0;
      this.fillLight.intensity = 0;
      if (this.comparisonGroup) this.comparisonGroup.visible = false;
    }

    this.updateReticles(camera, focusedLower, lockedLower, resolver, projectWorldToScreen);
  }

  private updateReticles(
    camera: THREE.PerspectiveCamera,
    focusedLower: string | null,
    lockedLower: string | null,
    resolver: ParentResolver,
    projectWorldToScreen?: (world: THREE.Vector3) => { x: number; y: number } | null
  ): void {
    if (!this.reticleRoot) return;
    const width = this.container?.clientWidth ?? window.innerWidth;
    const height = this.container?.clientHeight ?? window.innerHeight;
    if (width <= 0 || height <= 0) return;

    interface Candidate {
      bundle: SpacecraftBundle;
      sx: number;
      sy: number;
      prio: number;
      isFocus: boolean;
    }

    const candidates: Candidate[] = [];
    const camRight = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const toTarget = new THREE.Vector3();

    for (const b of this.bundles) {
      if (!b.lastEval) continue;
      const nm = b.entry.name.toLowerCase();
      const idl = b.entry.id.toLowerCase();
      const isFocus = focusedLower === nm || focusedLower === idl || lockedLower === nm || lockedLower === idl;
      const isHostFocused = focusedLower !== null && b.entry.hostBody.toLowerCase().includes(focusedLower);
      const isIconic = ICONIC_DEEP_SPACE_IDS.has(b.entry.id);

      const d = this.tmpCam.distanceTo(b.lastEval.worldPosition);
      // Show marker if focused, near host of focused world, close to camera, or iconic deep-space mission
      if (!isFocus && !isHostFocused && d > 900 && !isIconic) continue;

      // Hide label once 3D mesh subtends large fraction of screen (> 44px) unless locked/focused
      const pxRadius = b.visualRadius * (height / Math.max(0.01, d));
      if (pxRadius > 55 && !isFocus) continue;

      toTarget.copy(b.lastEval.worldPosition).sub(this.tmpCam);
      if (toTarget.dot(camRight) <= 0) continue;

      // Also skip if behind parent planet globe
      if (!isFocus && b.lastEval.parentName !== 'Sun') {
        const pPos = resolver.getWorldPosition(b.lastEval.parentName, this.tmpParent);
        const pRad = resolver.getVisualRadius(b.lastEval.parentName);
        if (pPos && pRad > 0) {
          const camToPlanet = pPos.clone().sub(this.tmpCam);
          const distPlanet = camToPlanet.length();
          if (d > distPlanet) {
            const rayDir = toTarget.clone().normalize();
            const closest = camToPlanet.dot(rayDir);
            if (closest > 0 && camToPlanet.distanceToSquared(rayDir.multiplyScalar(closest)) < pRad * pRad * 0.94) {
              continue;
            }
          }
        }
      }

      let sx: number;
      let sy: number;
      if (projectWorldToScreen) {
        const pt = projectWorldToScreen(b.lastEval.worldPosition);
        if (!pt) continue;
        sx = pt.x;
        sy = pt.y;
      } else {
        this.tmpProj.copy(b.lastEval.worldPosition).project(camera);
        if (this.tmpProj.z < -1 || this.tmpProj.z > 1) continue;
        sx = (this.tmpProj.x * 0.5 + 0.5) * width;
        sy = (-this.tmpProj.y * 0.5 + 0.5) * height;
      }
      if (sx < 16 || sx > width - 16 || sy < 48 || sy > height - 64) continue;

      const prio = (isFocus ? 1000 : 0) + (isHostFocused ? 200 : 0) + (isIconic ? 80 : 0) - Math.min(60, d * 0.01);
      candidates.push({ bundle: b, sx, sy, prio, isFocus });
    }

    candidates.sort((a, b) => b.prio - a.prio);

    const MAX_RETICLES = 24;
    const placed: Array<{ x: number; y: number }> = [];
    let used = 0;

    for (const c of candidates) {
      if (used >= MAX_RETICLES) break;
      let overlaps = false;
      if (!c.isFocus) {
        for (const p of placed) {
          if (Math.abs(c.sx - p.x) < 76 && Math.abs(c.sy - p.y) < 22) {
            overlaps = true;
            break;
          }
        }
      }
      if (overlaps) continue;
      placed.push({ x: c.sx, y: c.sy });

      let btn = this.reticlePool[used];
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sol-marker is-spacecraft';
        btn.innerHTML = '<i></i><span></span>';
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const name = btn!.dataset.name;
          if (name && this.onPick) this.onPick(name);
        });
        this.reticleRoot.appendChild(btn);
        this.reticlePool.push(btn);
      }

      btn.dataset.name = c.bundle.entry.name;
      btn.style.display = '';
      btn.style.transform = `translate3d(${c.sx.toFixed(1)}px, ${c.sy.toFixed(1)}px, 0)`;
      btn.style.setProperty('--c', c.bundle.entry.colorHex);
      btn.classList.toggle('is-focus', c.isFocus);
      const span = btn.querySelector('span');
      if (span) span.textContent = c.bundle.entry.shortName;
      used++;
    }

    for (let i = used; i < this.reticlePool.length; i++) {
      this.reticlePool[i].style.display = 'none';
    }
  }

  public dispose(): void {
    this.reticleRoot?.remove();
    this.keyLight.removeFromParent();
    this.fillLight.removeFromParent();
    this.comparisonGroup?.removeFromParent();
    this.heliosphereGroup?.removeFromParent();
    this.magnetosphereGroup?.removeFromParent();
    for (const b of this.bundles) {
      b.bodyGroup.removeFromParent();
    }
    this.bundles = [];
    this.bundleByKey.clear();
  }
}
