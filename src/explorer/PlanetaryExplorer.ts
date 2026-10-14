import * as THREE from 'three';
import { BodyImagery, getBodyImagery, minimumAltitudeKm } from './ImageryRegistry';
import { SurfaceTileLayer, LayerStatus, TileImageLoader } from './SurfaceTileLayer';
import { latLonToLocal, localToLatLon } from './TileMath';
import { getLandmark, Landmark, landmarksFor } from './Landmarks';
import { ScreenLabelItem } from './ScreenLabels';
import { TILE_SHELL } from './SurfaceTileLayer';
import { CameraRig, OBSERVATION_FOV_DEG } from '../navigation/CameraRig';

/** What the explorer needs to know about a rendered body. */
export interface ExplorerBody {
  name: string;
  bodyGroup: THREE.Object3D;
  surfaceMesh: THREE.Mesh;
  cloudMesh?: THREE.Mesh;
  /** The bundled global colour map (used to tint greyscale imagery). */
  baseMap?: THREE.Texture | null;
  visualRadius: number;
  radiusKm: number;
}

export type LightingMode = 'auto' | 'sun';

export interface ExplorerStatus {
  body: string | null;
  imagery: Pick<BodyImagery, 'title' | 'source' | 'sourceUrl' | 'attribution' | 'kind' | 'coverage' | 'note' | 'bestMetresPerPixel'> | null;
  streaming: boolean;
  layer: LayerStatus | null;
  maxLevel: number;
  altitudeKm: number;
  /** Altitude above the surface in body radii (Infinity when nothing is focused). */
  altitudeRadii: number;
  minAltitudeKm: number;
  atZoomLimit: boolean;
  subCamera: { lat: number; lon: number } | null;
  /** Sun elevation (degrees) above the local horizon at the point below the camera. */
  sunElevationDeg: number | null;
  /** Lighting of the streamed imagery: 'auto' evens it out near the ground, 'sun' keeps real sunlight. */
  lighting: LightingMode;
  daylight: boolean;
  landmark: Landmark | null;
}

/** Tiles are streamed only below this altitude (body radii); above it the globe map is sharper than needed. */
const STREAM_BELOW_ALTITUDE = 2.5;
/** Ride along with the body's rotation below this altitude (body radii). */
const CO_ROTATE_BELOW_ALTITUDE = 1.5;
/** Imagery fades in over the globe map between these altitudes (body radii). */
const FADE_IN_FROM = 2.4;
const FADE_IN_TO = 1.6;
/** 'auto' lighting evens the imagery out between these altitudes (body radii), like a web map. */
const EVEN_LIGHT_FROM = 1.4;
const EVEN_LIGHT_TO = 0.35;
/** Earth's cloud deck fades out between these altitudes so the ground stays visible. */
const CLOUDS_FADE_FROM = 1.0;
const CLOUDS_FADE_TO = 0.3;
const MAX_LIVE_LAYERS = 2;

/**
 * Planetary Explorer — Google Maps–style descent from the whole globe to the finest verified
 * imagery of a body. Owns one streaming tile layer per explored body (bounded), the data-driven
 * zoom floor, co-rotation with the surface, and landmark fly-to.
 */
export class PlanetaryExplorer {
  private rig: CameraRig;
  private getBody: (name: string) => ExplorerBody | null;
  private loader?: TileImageLoader;
  private layers = new Map<string, SurfaceTileLayer>();
  private layerOrder: string[] = [];
  private activeBody: string | null = null;
  private prevSurfaceQuat = new THREE.Quaternion();
  private prevSurfaceBody: string | null = null;
  private frustum = new THREE.Frustum();
  private projView = new THREE.Matrix4();
  private tmpV = new THREE.Vector3();
  private tmpS = new THREE.Sphere();
  private tmpColor = new THREE.Color(0, 0, 0);
  private frameCounter = 0;
  private landmark: Landmark | null = null;
  private lighting: LightingMode = 'auto';
  private daylightFactor = 0;
  /** Extra hooks while the surface observer is active. */
  public groundHaze: { color: THREE.Color; density: number } | null = null;
  /** Surface view: real sunlight with this tint and sky ambient (null in space). */
  public groundLight: { sunTint: [number, number, number]; ambient: number } | null = null;
  private maxAnisotropy = 8;
  private lastViewportPx = 1000;
  private status: ExplorerStatus = PlanetaryExplorer.emptyStatus();

  constructor(rig: CameraRig, getBody: (name: string) => ExplorerBody | null, loader?: TileImageLoader) {
    this.rig = rig;
    this.getBody = getBody;
    this.loader = loader;
  }

  private static emptyStatus(): ExplorerStatus {
    return {
      body: null, imagery: null, streaming: false, layer: null, maxLevel: 0,
      altitudeKm: 0, altitudeRadii: Infinity, minAltitudeKm: 0, atZoomLimit: false, subCamera: null, sunElevationDeg: null, lighting: 'auto', daylight: false, landmark: null,
    };
  }

  public getStatus(): ExplorerStatus {
    return this.status;
  }

  /**
   * Per-frame update. `focusedBody` is the selected body (null for overview / Sgr A*),
   * `viewportHeightPx` the drawing-buffer height used for the screen-space error.
   */
  public update(focusedBody: string | null, camera: THREE.PerspectiveCamera, viewportHeightPx: number): void {
    this.frameCounter++;
    const body = focusedBody ? this.getBody(focusedBody) : null;
    const imagery = focusedBody && body ? getBodyImagery(focusedBody, body.radiusKm) : null;

    if (this.activeBody && this.activeBody !== focusedBody) {
      this.layers.get(this.activeBody)?.hide();
      this.restoreClouds(this.activeBody);
      if (this.landmark && this.landmark.body !== focusedBody) this.landmark = null;
    }
    this.activeBody = focusedBody;

    if (!body || !imagery) {
      this.rig.surfaceMinAltitude = null;
      this.prevSurfaceBody = null;
      this.status = PlanetaryExplorer.emptyStatus();
      return;
    }

    this.lastViewportPx = viewportHeightPx;
    const minAltKm = this.minAltitudeKmFor(body, imagery, camera.fov);
    this.rig.surfaceMinAltitude = minAltKm / (body.radiusKm / body.visualRadius);

    body.surfaceMesh.updateWorldMatrix(true, false);
    const camLocal = body.surfaceMesh.worldToLocal(this.tmpV.copy(camera.position));
    const dLocal = camLocal.length();
    const altitudeRadii = Math.max(0, dLocal - 1);
    const altitudeKm = altitudeRadii * body.radiusKm;
    const sub = localToLatLon(camLocal.x, camLocal.y, camLocal.z);

    // Ride along with the rotating surface when close, so the ground stays under the camera
    const q = body.surfaceMesh.getWorldQuaternion(new THREE.Quaternion());
    if (this.prevSurfaceBody === body.name && altitudeRadii < CO_ROTATE_BELOW_ALTITUDE) {
      const delta = q.clone().multiply(this.prevSurfaceQuat.clone().invert());
      if (1 - Math.abs(delta.w) > 1e-12) this.rig.applyFrameRotation(delta);
    }
    this.prevSurfaceQuat.copy(q);
    this.prevSurfaceBody = body.name;

    // Earth's clouds fade out close to the ground so the surface imagery shows
    if (body.cloudMesh) {
      const fade = THREE.MathUtils.smoothstep(altitudeRadii, CLOUDS_FADE_TO, CLOUDS_FADE_FROM);
      const mat = body.cloudMesh.material as THREE.ShaderMaterial;
      if (mat.uniforms?.uFade) mat.uniforms.uFade.value = fade;
      body.cloudMesh.visible = fade > 0.01;
    }
    this.daylightFactor = this.lighting === 'sun' || this.groundLight ? 0 : 1 - THREE.MathUtils.smoothstep(altitudeRadii, EVEN_LIGHT_TO, EVEN_LIGHT_FROM);

    let layerStatus: LayerStatus | null = null;
    if (imagery.provider) {
      const layer = this.ensureLayer(body, imagery);
      layer.setDaylight(this.daylightFactor);
      layer.setOpacity(1 - THREE.MathUtils.smoothstep(altitudeRadii, FADE_IN_TO, FADE_IN_FROM));
      if (this.groundHaze) layer.setHaze(this.groundHaze.color, this.groundHaze.density);
      else layer.setHaze(this.tmpColor, 0);
      if (this.groundLight) layer.setLighting(this.groundLight.sunTint, this.groundLight.ambient);
      else layer.setLighting([1, 1, 1], 0.07);
      if (altitudeRadii < STREAM_BELOW_ALTITUDE) {
        // Selection is cheap but not free — run it every other frame
        if (this.frameCounter % 2 === 0) {
          this.projView.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
          this.frustum.setFromProjectionMatrix(this.projView);
          const surface = body.surfaceMesh;
          const scale = body.visualRadius;
          layer.update({
            position: [camLocal.x, camLocal.y, camLocal.z],
            pixelsPerRadian: viewportHeightPx / (2 * Math.tan((camera.fov * Math.PI) / 360)),
            isCapVisible: (centre, radius) => {
              // Tight bounding sphere of a spherical cap: centred on the cap's base plane below
              // 90°, otherwise the whole globe (a small chord sphere would miss parts of big caps).
              if (radius < Math.PI / 2) {
                const k = Math.cos(radius);
                surface.localToWorld(this.tmpS.center.set(centre[0] * k, centre[1] * k, centre[2] * k));
                this.tmpS.radius = Math.sin(radius) * scale * 1.02 + (1 - k) * scale;
              } else {
                surface.localToWorld(this.tmpS.center.set(0, 0, 0));
                this.tmpS.radius = scale * 1.02;
              }
              return this.frustum.intersectsSphere(this.tmpS);
            },
          });
        }
      } else {
        layer.hide();
      }
      layerStatus = layer.getStatus();
    }

    // Sun elevation at the sub-camera point (the Sun sits at the scene origin)
    const centre = body.bodyGroup.getWorldPosition(new THREE.Vector3());
    const up = camera.position.clone().sub(centre).normalize();
    const sunDir = centre.clone().negate().normalize();
    const sunElevationDeg = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(up.dot(sunDir), -1, 1)));

    const minDist = this.rig.minimumDistance();
    this.status = {
      body: body.name,
      imagery: {
        title: imagery.title, source: imagery.source, sourceUrl: imagery.sourceUrl, attribution: imagery.attribution,
        kind: imagery.kind, coverage: imagery.coverage, note: imagery.note, bestMetresPerPixel: imagery.bestMetresPerPixel,
      },
      streaming: !!imagery.provider && altitudeRadii < STREAM_BELOW_ALTITUDE,
      layer: layerStatus,
      maxLevel: imagery.provider?.maxLevel ?? 0,
      altitudeKm,
      altitudeRadii,
      minAltitudeKm: minAltKm,
      atZoomLimit: camera.position.distanceTo(centre) <= minDist * 1.01,
      subCamera: { lat: sub.lat, lon: sub.lon },
      sunElevationDeg,
      lighting: this.lighting,
      daylight: this.daylightFactor > 0.5,
      landmark: this.landmark,
    };
  }

  /** Data-driven zoom floor (km above the surface) for a body at a given field of view. */
  private minAltitudeKmFor(body: ExplorerBody, imagery: BodyImagery, fovDeg: number): number {
    const km = minimumAltitudeKm(imagery, fovDeg, this.lastViewportPx);
    // Bodies with only a global map: don't forbid the observation shot itself
    return imagery.provider ? km : Math.min(km, 0.5 * body.radiusKm);
  }

  /**
   * Place-name labels for the focused body's landmarks on the side facing the camera, shown once
   * the globe fills the view (web-map style).
   */
  public featureLabels(camera: THREE.PerspectiveCamera): ScreenLabelItem[] {
    const s = this.status;
    if (!s.body || !(s.altitudeRadii < 1.6)) return [];
    const body = this.getBody(s.body);
    if (!body) return [];
    body.surfaceMesh.updateWorldMatrix(true, false);
    const centre = body.bodyGroup.getWorldPosition(new THREE.Vector3());
    const out: ScreenLabelItem[] = [];
    for (const lm of landmarksFor(s.body)) {
      const [x, y, z] = latLonToLocal(lm.lat, lm.lon);
      const p = body.surfaceMesh.localToWorld(new THREE.Vector3(x * TILE_SHELL, y * TILE_SHELL, z * TILE_SHELL));
      const n = p.clone().sub(centre).normalize();
      const toCam = camera.position.clone().sub(p).normalize();
      if (n.dot(toCam) < 0.08) continue; // beyond the limb
      out.push({ id: lm.id, text: lm.name, world: p, kind: 'feature' });
    }
    return out;
  }

  /** World-space unit direction from a body's centre to a surface point. */
  public surfaceDirection(body: ExplorerBody, latDeg: number, lonDeg: number): THREE.Vector3 {
    body.surfaceMesh.updateWorldMatrix(true, false);
    const centre = body.bodyGroup.getWorldPosition(new THREE.Vector3());
    const [x, y, z] = latLonToLocal(latDeg, lonDeg);
    const p = body.surfaceMesh.localToWorld(new THREE.Vector3(x, y, z));
    return p.sub(centre).normalize();
  }

  /** Fly to a landmark; returns false if its body is not rendered. */
  public flyToLandmark(id: string): Landmark | null {
    const lm = getLandmark(id);
    if (!lm) return null;
    const body = this.getBody(lm.body);
    if (!body) return null;
    const kmPerUnit = body.radiusKm / body.visualRadius;
    const dir = this.surfaceDirection(body, lm.lat, lm.lon);
    // Set the target body's zoom floor now: the previous focus (possibly a giant planet) still
    // owns it until the next frame, and the flight's end distance is clamped against it
    const imagery = getBodyImagery(lm.body, body.radiusKm);
    if (imagery) this.rig.surfaceMinAltitude = this.minAltitudeKmFor(body, imagery, OBSERVATION_FOV_DEG) / kmPerUnit;
    this.rig.focusedPhysicalRadiusKm = body.radiusKm;
    this.rig.focusSurfacePoint(body.bodyGroup, body.visualRadius, dir, lm.viewAltitudeKm / kmPerUnit);
    this.landmark = lm;
    return lm;
  }

  /** 'auto': imagery is evenly lit close to the ground (web-map style); 'sun': real sunlight only. */
  public setLighting(mode: LightingMode): void {
    this.lighting = mode;
  }

  /** Kept for the panel/API: true → auto (even near the ground), false → real sunlight. */
  public setDaylight(on: boolean): void {
    this.setLighting(on ? 'auto' : 'sun');
  }

  public setMaxAnisotropy(n: number): void {
    this.maxAnisotropy = n;
    for (const l of this.layers.values()) l.setMaxAnisotropy(n);
  }

  public clearLandmark(): void {
    this.landmark = null;
  }

  private ensureLayer(body: ExplorerBody, imagery: BodyImagery): SurfaceTileLayer {
    let layer = this.layers.get(body.name);
    if (!layer) {
      layer = new SurfaceTileLayer(imagery.provider!, this.loader);
      layer.setMaxAnisotropy(this.maxAnisotropy);
      layer.setBaseMap(body.baseMap ?? null);
      body.surfaceMesh.add(layer.group);
      this.layers.set(body.name, layer);
    }
    // Most-recently-used ordering; dispose layers beyond the budget
    this.layerOrder = [body.name, ...this.layerOrder.filter((n) => n !== body.name)];
    while (this.layerOrder.length > MAX_LIVE_LAYERS) {
      const old = this.layerOrder.pop()!;
      const l = this.layers.get(old);
      if (l) {
        l.group.parent?.remove(l.group);
        l.dispose();
        this.layers.delete(old);
      }
    }
    return layer;
  }

  private restoreClouds(name: string): void {
    const b = this.getBody(name);
    if (b?.cloudMesh) {
      b.cloudMesh.visible = true;
      const mat = b.cloudMesh.material as THREE.ShaderMaterial;
      if (mat.uniforms?.uFade) mat.uniforms.uFade.value = 1;
    }
  }

  public dispose(): void {
    for (const l of this.layers.values()) {
      l.group.parent?.remove(l.group);
      l.dispose();
    }
    this.layers.clear();
  }
}
