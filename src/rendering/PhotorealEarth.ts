import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { TilesRenderer } from '3d-tiles-renderer';
import { GoogleCloudAuthPlugin, GLTFExtensionsPlugin } from '3d-tiles-renderer/plugins';
import { SUN_WORLD } from './RenderOrigin';
import { perf } from './Performance';

/**
 * Google Photorealistic 3D Tiles on Solaris's Earth: real cities, mountains and coasts in 3D,
 * streamed as you come close (the same data as Google Earth).
 *
 * The tiles are in Earth-centred, Earth-fixed metres (WGS84). They are hung under Earth's surface
 * mesh, which is a unit sphere in the body's own frame (squashed at the poles by Earth's real
 * flattening), so they turn with the planet and sit exactly on the drawn globe:
 *  - axes: ECEF (x, y, z) is local (x, z, -y) (see latLonToLocal in TileMath)
 *  - scale: 1 / equatorial radius, with the polar axis pre-stretched to undo the mesh's squash
 *    (the tiles are already the real ellipsoid)
 *
 * The photographs are unlit (their light is baked in, at whatever hour they were flown), so the
 * real Sun's day and night are laid over them in their shader: a soft terminator, dark night side.
 *
 * Needs a Google Maps Platform key with the Map Tiles API enabled (VITE_GOOGLE_MAPS_API_KEY in
 * .env.local). Google's attribution is shown while tiles are on screen, as its terms require.
 */

const WGS84_A = 6378137;

/** Raycasts and the standing eye treat these meshes as the finest ground (their name parses as z 99). */
export const PHOTOREAL_TILE_NAME = 'tile_99/photoreal';

export class PhotorealEarth {
  /** The layer currently in use (one Earth), for the ground raycasts of the surface view and the jet. */
  public static current: PhotorealEarth | null = null;

  public readonly tiles: TilesRenderer;
  private readonly holder = new THREE.Group();
  private readonly earthCentre = { value: new THREE.Vector3() };
  private readonly sunTint = { value: new THREE.Vector3(1, 1, 1) };
  private attributionEl: HTMLDivElement | null = null;
  private lastAttribution = 0;
  private enabled = false;
  private dracoLoader: DRACOLoader;
  private surface: THREE.Object3D | null = null;

  constructor(apiKey: string, container: HTMLElement | null) {
    this.tiles = new TilesRenderer();
    this.tiles.registerPlugin(new GoogleCloudAuthPlugin({ apiToken: apiKey, autoRefreshToken: true }));
    this.dracoLoader = new DRACOLoader().setDecoderPath(`${import.meta.env.BASE_URL}draco/`);
    this.tiles.registerPlugin(new GLTFExtensionsPlugin({ dracoLoader: this.dracoLoader }));
    // Detail against cost: weak devices take coarser tiles and keep fewer in memory
    const tier = perf.tier;
    this.tiles.errorTarget = tier === 'high' ? 16 : tier === 'medium' ? 24 : 40;
    this.tiles.lruCache.minSize = tier === 'low' ? 300 : 900;
    this.tiles.lruCache.maxSize = tier === 'low' ? 600 : 1600;
    this.tiles.downloadQueue.maxJobs = tier === 'low' ? 6 : 12;
    this.tiles.parseQueue.maxJobs = tier === 'low' ? 1 : 3;

    // ECEF metres -> the surface mesh's unit frame
    const s = 1 / WGS84_A;
    const m = new THREE.Matrix4().set(
      s, 0, 0, 0,
      0, 0, s, 0,
      0, -s, 0, 0,
      0, 0, 0, 1
    );
    this.holder.matrixAutoUpdate = false;
    this.holder.matrix.copy(m);
    this.holder.name = 'photoreal_earth';
    this.holder.add(this.tiles.group);
    this.holder.visible = false;

    this.tiles.addEventListener('load-model', ({ scene }) => this.prepareModel(scene));

    if (container) {
      const el = document.createElement('div');
      el.className = 'photoreal-attribution';
      el.style.cssText =
        'position:absolute;right:8px;bottom:3px;z-index:60;pointer-events:none;max-width:60vw;text-align:right;' +
        'font:500 9px/1.3 Roboto,Arial,sans-serif;color:rgba(255,255,255,0.85);text-shadow:0 0 3px #000,0 0 6px #000;display:none;';
      container.appendChild(el);
      this.attributionEl = el;
    }
    PhotorealEarth.current = this;
  }

  /** Hang the tiles under Earth's surface mesh (unit sphere, scaled y by `polarScale`). */
  public attach(surfaceMesh: THREE.Object3D, polarScale: number): void {
    // Undo the mesh's polar squash: the tiles are the real ellipsoid already
    const unsquash = new THREE.Matrix4().makeScale(1, 1 / polarScale, 1);
    this.holder.matrix.premultiply(unsquash);
    surfaceMesh.add(this.holder);
    this.surface = surfaceMesh;
  }

  /** Whether the photoreal Earth is drawn (and the imagery tiles should step aside). */
  public get showing(): boolean {
    return this.enabled && this.tiles.visibleTiles.size > 0;
  }

  /**
   * Per frame, before the draw (world coordinates unshifted): stream and select tiles for the
   * camera when `enabled`, else hide and stop loading.
   */
  public update(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, enabled: boolean): void {
    this.enabled = enabled;
    this.holder.visible = enabled;
    if (enabled) {
      if (!this.tiles.hasCamera(camera)) this.tiles.setCamera(camera);
      this.tiles.setResolutionFromRenderer(camera, renderer);
      this.surface?.updateMatrixWorld();
      camera.updateMatrixWorld();
      this.tiles.update();
    }
    this.updateAttribution();
  }

  /** The tiles as one raycast target (the renderer walks its own tile hierarchy). */
  public raycastTarget(): THREE.Object3D | null {
    return this.showing ? this.tiles.group : null;
  }

  private prepareModel(scene: THREE.Object3D): void {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.name = PHOTOREAL_TILE_NAME;
      // Drawn after the atmosphere shell when close (it has no depth test, and would lay the haze
      // of the whole path to the horizon over nearby ground); see PlanetaryExplorer
      mesh.renderOrder = 1.2;
      mesh.onBeforeRender = () => {
        if (this.surface) this.earthCentre.value.setFromMatrixPosition(this.surface.matrixWorld);
      };
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of mats) this.lightMaterial(mat);
    });
  }

  /** The real Sun over the baked photographs: day side as photographed, night side dark. */
  private lightMaterial(mat: THREE.Material): void {
    mat.transparent = true;
    mat.depthWrite = true;
    const centre = this.earthCentre;
    const tint = this.sunTint;
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uEarthC = centre;
      shader.uniforms.uSunW = SUN_WORLD;
      shader.uniforms.uSunTint = tint;
      shader.vertexShader = shader.vertexShader
        .replace('void main() {', 'varying vec3 vPhotoWorld;\nvoid main() {')
        .replace('#include <project_vertex>', '#include <project_vertex>\n  vPhotoWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      shader.fragmentShader = shader.fragmentShader
        .replace('void main() {', 'uniform vec3 uEarthC;\nuniform vec3 uSunW;\nuniform vec3 uSunTint;\nvarying vec3 vPhotoWorld;\nvoid main() {')
        .replace(
          '#include <opaque_fragment>',
          [
            '{',
            '  vec3 upW = normalize(vPhotoWorld - uEarthC);',
            '  float sunUp = dot(upW, normalize(uSunW - uEarthC));',
            '  float day = smoothstep(-0.1, 0.18, sunUp);',
            // A warm low Sun near the terminator, deep blue night with a little skylight
            '  vec3 low = vec3(1.0, 0.62, 0.42);',
            '  vec3 sunCol = mix(low, uSunTint, smoothstep(0.0, 0.35, sunUp));',
            '  outgoingLight *= mix(vec3(0.018, 0.024, 0.045), sunCol, day);',
            '}',
            '#include <opaque_fragment>',
          ].join('\n')
        );
    };
    mat.needsUpdate = true;
  }

  private updateAttribution(): void {
    const el = this.attributionEl;
    if (!el) return;
    const now = performance.now();
    if (now - this.lastAttribution < 1000) return;
    this.lastAttribution = now;
    if (!this.showing) {
      el.style.display = 'none';
      return;
    }
    const parts = this.tiles.getAttributions().filter((a) => a.type === 'string').map((a) => String(a.value)).filter(Boolean);
    el.textContent = `Google${parts.length ? ` · ${parts.join(' · ')}` : ''}`;
    el.style.display = 'block';
  }

  public dispose(): void {
    this.holder.removeFromParent();
    this.tiles.dispose();
    this.dracoLoader.dispose();
    this.attributionEl?.remove();
    if (PhotorealEarth.current === this) PhotorealEarth.current = null;
  }
}
