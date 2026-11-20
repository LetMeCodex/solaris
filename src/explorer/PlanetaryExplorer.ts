import * as THREE from 'three';
import { elevationFor, groundHeightKm } from './PlanetElevation';
import { BodyImagery, getBodyImagery, minimumAltitudeKm } from './ImageryRegistry';
import { SurfaceTileLayer, LayerStatus, TileImageLoader } from './SurfaceTileLayer';
import { bodyLatLonToLocal, bodyLocalToLatLon } from './TileMath';
import { getLandmark, Landmark, landmarksFor } from './Landmarks';
import { ScreenLabelItem } from './ScreenLabels';
import { TILE_LEVEL_LIFT, TILE_SHELL } from './SurfaceTileLayer';
import { CameraRig, OBSERVATION_FOV_DEG } from '../navigation/CameraRig';
import { PhotorealEarth } from '../rendering/PhotorealEarth';

/** What the explorer needs to know about a rendered body. */
export interface ExplorerBody {
  name: string;
  bodyGroup: THREE.Object3D;
  surfaceMesh: THREE.Mesh;
  cloudMesh?: THREE.Mesh;
  /** The orbit-scale atmosphere shell (drawn without depth: it knows nothing of the terrain). */
  atmosphereMesh?: THREE.Mesh;
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
const STREAM_BELOW_ALTITUDE = 1.35; // covers all orbital landmark arrivals (~1.03 radii at Mercury Caloris) while keeping full globes crisp
/** Ride along with the body's rotation below this altitude (body radii). */
const CO_ROTATE_BELOW_ALTITUDE = 1.5;
/** Imagery fades in over the globe map between these altitudes (body radii). */
const FADE_IN_FROM = 0.85;
const FADE_IN_TO = 0.5;
/** 'auto' lighting evens the imagery out between these altitudes (body radii), like a web map. */
const EVEN_LIGHT_FROM = 0.15; // arrival shots sit at ~0.5 radii and keep real sunlight
const EVEN_LIGHT_TO = 0.03;
/** Earth's cloud deck fades out between these altitudes so the ground stays visible. */
const CLOUDS_FADE_FROM = 1.0;
const CLOUDS_FADE_TO = 0.3;
const MAX_LIVE_LAYERS = 2;

function localBodyRadius(body: ExplorerBody, latDeg: number): number {
  if (body.name !== 'Earth') return body.visualRadius;
  const latRad = (latDeg * Math.PI) / 180;
  const ps = 0.996647; // 1 - Earth's flattening (0.003353)
  return body.visualRadius * Math.sqrt(Math.cos(latRad) ** 2 + (ps * Math.sin(latRad)) ** 2);
}

/** Max radial elevation envelope (km) for displaced-terrain bodies so steep peaks/craters aren't frustum-culled. */
function maxReliefEnvelopeKm(bodyName: string): number {
  if (bodyName === 'Earth') return 10.5;
  if (bodyName === 'Moon') return 22.0; // SLDEM/LOLA datum 9.2 km + ~11 km highlands
  if (bodyName === 'Mars') return 32.0; // HRSC/MOLA datum 8.3 km + ~21.2 km Olympus Mons
  return 0;
}

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
  private lastLayerBody: string | null = null;
  private landmark: Landmark | null = null;
  private lighting: LightingMode = 'auto';
  private daylightFactor = 0;
  /** Extra hooks while the surface observer is active. */
  public groundHaze: { color: THREE.Color; density: number } | null = null;
  /** Hide the surface imagery (a deep-time scene draws its own landscape). */
  public hideGround = false;
  /** Google's photorealistic 3D Earth is on screen: Earth's imagery tiles step aside for it. */
  public photorealEarth = false;
  /** ProceduralTerrain owns Earth's low-altitude surface below ~45 km; inset imagery tiles under it. */
  public proceduralGround = false;
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
    body.surfaceMesh.updateWorldMatrix(true, false);
    const camLocal = body.surfaceMesh.worldToLocal(this.tmpV.copy(camera.position));
    const dLocal = camLocal.length();
    const altitudeRadii = Math.max(0, dLocal - 1);
    const sub = bodyLocalToLatLon(body.name, camLocal.x, camLocal.y, camLocal.z);
    const groundKm = groundHeightKm(body.name, sub.lat, sub.lon);
    const altitudeKm = Math.max(0.05, altitudeRadii * body.radiusKm - groundKm);
    const minAltKm = this.minAltitudeKmFor(body, imagery, camera.fov);
    const kmPerUnit = body.radiusKm / body.visualRadius;
    const localR = localBodyRadius(body, sub.lat);
    this.rig.focusedRadius = localR;
    this.rig.surfaceMinAltitude = (groundKm + minAltKm) / kmPerUnit;

    // Ride along with the rotating surface when close, so the ground stays under the camera.
    // Use |sin(theta/2)| = hypot(x,y,z) instead of (1 - |w| ≈ theta^2/8), which underflows past 1e-12
    // at 60+ Hz 1x Earth spin and previously discarded the entire frame's rotation on every tick.
    const q = body.surfaceMesh.getWorldQuaternion(new THREE.Quaternion());
    if (this.prevSurfaceBody === body.name && altitudeRadii < CO_ROTATE_BELOW_ALTITUDE) {
      const delta = q.clone().multiply(this.prevSurfaceQuat.clone().invert());
      if (Math.hypot(delta.x, delta.y, delta.z) > 1e-9) {
        this.rig.applyFrameRotation(delta);
        this.prevSurfaceQuat.copy(q);
      }
    } else {
      this.prevSurfaceQuat.copy(q);
    }
    this.prevSurfaceBody = body.name;

    // Earth's clouds fade out close to the ground so the surface imagery shows
    if (body.cloudMesh) {
      const fade = THREE.MathUtils.smoothstep(altitudeRadii, CLOUDS_FADE_TO, CLOUDS_FADE_FROM);
      const mat = body.cloudMesh.material as THREE.ShaderMaterial;
      if (mat.uniforms?.uFade) mat.uniforms.uFade.value = fade;
      body.cloudMesh.visible = fade > 0.01;
    }
    this.daylightFactor = this.lighting === 'sun' || this.groundLight ? 0 : 1 - THREE.MathUtils.smoothstep(altitudeRadii, EVEN_LIGHT_TO, EVEN_LIGHT_FROM);
    if (body.name === 'Earth' && PhotorealEarth.current) {
      PhotorealEarth.current.setDaylight(this.daylightFactor);
    }

    let layerStatus: LayerStatus | null = null;
    // Use actual PhotorealEarth visibility flag so Earth imagery tiles act as fallback whenever 3D tiles are absent or disabled
    const hasPhotorealEarth = body.name === 'Earth' && (this.photorealEarth || this.proceduralGround);
    // A visible Google root tile does not imply local coverage. Continue refining the
    // imagery underneath it so failed, distant and still-coarse 3D branches have a fallback.
    if (imagery.provider) {
      const layer = this.ensureLayer(body, imagery);
      layer.setUnderlay(hasPhotorealEarth);
      layer.setDaylight(this.daylightFactor);
      layer.setOpacity(this.hideGround ? 0 : 1 - THREE.MathUtils.smoothstep(altitudeRadii, FADE_IN_TO, FADE_IN_FROM));
      if (body.atmosphereMesh) {
        const relief = !!layer.elevation && !layer.elevation.disabled && !this.hideGround && altitudeKm < 60;
        body.atmosphereMesh.renderOrder = relief ? 0.95 : 3;
      }
      if (this.groundHaze) layer.setHaze(this.groundHaze.color, this.groundHaze.density);
      else layer.setHaze(this.tmpColor, 0);
      if (this.groundLight) layer.setLighting(this.groundLight.sunTint, this.groundLight.ambient);
      else layer.setLighting([1, 1, 1], 0.07);
      if (altitudeRadii < STREAM_BELOW_ALTITUDE) {
        // Update every frame close to the ground (surface view / low flight) or on body switch so foreground tiles never lag
        const needUpdate = altitudeRadii < 0.05 || this.lastLayerBody !== body.name || this.frameCounter % 2 === 0;
        if (needUpdate) {
          this.lastLayerBody = body.name;
          this.projView.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
          this.frustum.setFromProjectionMatrix(this.projView);
          const surface = body.surfaceMesh;
          const hasRelief = !!layer.elevation && !layer.elevation.disabled;
          const lift = hasRelief ? Math.max(0, layer.elevation!.heightKm(sub.lat, sub.lon, 11)) / body.radiusKm : 0;
          const rMin = body.name === 'Earth' && hasRelief ? Math.max(0.99, 1 - 0.5 / body.radiusKm) : 1.0;
          const rMax = TILE_SHELL + (hasRelief ? Math.max(lift, maxReliefEnvelopeKm(body.name) / body.radiusKm) + 20 * TILE_LEVEL_LIFT : 14 * TILE_LEVEL_LIFT);
          const rMid = 0.5 * (rMin + rMax);
          const halfH = 0.5 * (rMax - rMin);
          // Guard against dLocal <= 1 (e.g. sea level / Dead Sea depression) where selectTiles returns []
          const safeScale = dLocal <= TILE_SHELL + 1e-6 ? (TILE_SHELL + 1e-6) / Math.max(dLocal, 1e-9) : 1;
          const camPos: [number, number, number] = [camLocal.x * safeScale, camLocal.y * safeScale, camLocal.z * safeScale];
          layer.update({
            position: camPos,
            groundLift: lift,
            pixelsPerRadian: viewportHeightPx / (2 * Math.tan((camera.fov * Math.PI) / 360)),
            isCapVisible: (centre, radius) => {
              if (radius < Math.PI / 2) {
                surface.localToWorld(this.tmpS.center.set(centre[0] * rMid, centre[1] * rMid, centre[2] * rMid));
                this.tmpS.radius = (2 * rMax * Math.sin(radius * 0.5) + halfH) * body.visualRadius * 1.04;
              } else {
                surface.localToWorld(this.tmpS.center.set(0, 0, 0));
                this.tmpS.radius = rMax * body.visualRadius * 1.04;
              }
              return this.frustum.intersectsSphere(this.tmpS);
            },
          });
        }
      } else {
        layer.hide();
        this.lastLayerBody = null;
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
      imagery: hasPhotorealEarth
        ? {
            title: 'Google Photorealistic 3D Tiles',
            source: 'Google Maps Platform · 3D Tiles',
            sourceUrl: 'https://developers.google.com/maps/documentation/tile/3d-tiles',
            attribution: 'Google · 3D Cities & Terrain',
            kind: 'visible',
            coverage: 'Global 3D photogrammetry & terrain',
            note: 'Real 3D cities, monuments, buildings, trees and mountains across Earth.',
            bestMetresPerPixel: 0.3,
          }
        : {
            title: imagery.title, source: imagery.source, sourceUrl: imagery.sourceUrl, attribution: imagery.attribution,
            kind: imagery.kind, coverage: imagery.coverage, note: imagery.note, bestMetresPerPixel: imagery.bestMetresPerPixel,
          },
      streaming: (!!imagery.provider || hasPhotorealEarth) && altitudeRadii < STREAM_BELOW_ALTITUDE,
      layer: layerStatus,
      maxLevel: hasPhotorealEarth ? 20 : imagery.provider?.maxLevel ?? 0,
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

  /** Data-driven zoom floor (km above the local ground) for a body at a given field of view. */
  private minAltitudeKmFor(body: ExplorerBody, imagery: BodyImagery, fovDeg: number): number {
    if (body.name === 'Earth' && PhotorealEarth.current) {
      // Photorealistic 3D Tiles resolve down to street/building level (~120 m above ground)
      return 0.12;
    }
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
      const [x, y, z] = bodyLatLonToLocal(s.body, lm.lat, lm.lon);
      const lift = groundHeightKm(s.body, lm.lat, lm.lon, 9) / body.radiusKm;
      const r = (this.photorealEarth || this.proceduralGround ? 1 : TILE_SHELL) + lift;
      const p = body.surfaceMesh.localToWorld(new THREE.Vector3(x * r, y * r, z * r));
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
    const [x, y, z] = bodyLatLonToLocal(body.name, latDeg, lonDeg);
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
    const targetLat = lm.vantageLat ?? lm.lat;
    const targetLon = lm.vantageLon ?? lm.lon;
    const dir = this.surfaceDirection(body, targetLat, targetLon);
    // Start fetching the ground heights there now: orbital landmarks warm coarse z=3 so Trek DEM doesn't starve imagery
    const warmZ = lm.viewAltitudeKm > 30 ? 3 : 6;
    void elevationFor(lm.body)?.ensure(targetLat - 0.3, targetLon - 0.3, targetLat + 0.3, targetLon + 0.3, warmZ);
    const groundKm = groundHeightKm(lm.body, targetLat, targetLon);
    const localR = localBodyRadius(body, targetLat);
    this.rig.focusedRadius = localR;
    // Set the target body's zoom floor now: the previous focus (possibly a giant planet) still
    // owns it until the next frame, and the flight's end distance is clamped against it
    const imagery = getBodyImagery(lm.body, body.radiusKm);
    if (imagery) {
      const minAltKm = this.minAltitudeKmFor(body, imagery, OBSERVATION_FOV_DEG);
      this.rig.surfaceMinAltitude = (groundKm + minAltKm) / kmPerUnit;
    }
    this.rig.focusedPhysicalRadiusKm = body.radiusKm;
    const viewAltKm = lm.body === 'Earth' && PhotorealEarth.current
      ? Math.max(0.2, lm.viewAltitudeKm)
      : lm.viewAltitudeKm;
    this.rig.focusSurfacePoint(body.bodyGroup, localR, dir, (groundKm + viewAltKm) / kmPerUnit);
    this.landmark = lm;
    return lm;
  }

  public getLandmark(): Landmark | null {
    return this.landmark;
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
      // Ground in real 3D where a world has elevation data (Earth, the Moon, Mars): mountains,
      // crater walls and canyons from real heights (src/explorer/PlanetElevation)
      layer.bodyName = body.name;
      layer.radiusKm = body.radiusKm;
      const relief = elevationFor(body.name);
      if (relief) {
        layer.elevation = relief;
      }
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
