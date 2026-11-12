import * as THREE from 'three';
import { bodyLatLonToLocal } from '../explorer/TileMath';
import type { WeatherKind } from './Weather';
import type { VolumetricCloudPass } from '../rendering/VolumetricClouds';
import { MOON_LIGHT } from '../rendering/AerialPerspective';
import { earthElevation } from '../explorer/Elevation';

/**
 * Real weather, and clouds to fly among, over Google's 3D Earth.
 *
 * LiveWeather asks Open-Meteo (free, no key) for the weather where the jet is now: cloud cover
 * (low and total), what is falling, wind and visibility. It asks again after 10 minutes or 80 km.
 *
 * EarthClouds turns it into a cloud layer for the volumetric cloud pass (rendering/VolumetricClouds):
 * how much of the sky is covered, the base and top (the base always some way above the ground
 * under the jet, so clouds never sit on the hills), cumulus or a flat deck, how dense, the wind's
 * drift, and the light: the Sun's colour through the air at this hour, the sky's and the ground's
 * light, the haze. Storms tower; overcast is a thick, flat deck.
 */

export interface LiveWeather {
  /** 0..1 */
  cover: number;
  coverLow: number;
  kind: WeatherKind;
  strength: number;
  windMps: number;
  windDirDeg: number;
  visibilityKm: number;
  label: string;
}

/** What WMO weather code means for the air the jet flies through. */
export function weatherFromCode(code: number, precipMm: number): { kind: WeatherKind; strength: number; label: string } {
  if (code >= 95) return { kind: 'storm', strength: 0.9, label: 'Thunderstorm' };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { kind: 'snow', strength: Math.min(1, 0.4 + precipMm * 0.3), label: 'Snow' };
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { kind: 'rain', strength: Math.min(1, 0.35 + precipMm * 0.25), label: code >= 80 ? 'Showers' : 'Rain' };
  if (code === 45 || code === 48) return { kind: 'clear', strength: 0, label: 'Fog' };
  if (code === 3) return { kind: 'clear', strength: 0, label: 'Overcast' };
  if (code === 1 || code === 2) return { kind: 'clear', strength: 0, label: 'Partly cloudy' };
  return { kind: 'clear', strength: 0, label: 'Clear' };
}

export class LiveWeatherService {
  public current: LiveWeather | null = null;
  private last: { lat: number; lon: number; t: number } | null = null;
  private busy = false;

  /** Call often; it fetches only when due (10 min or 80 km since the last answer). */
  public update(lat: number, lon: number): void {
    const now = Date.now();
    if (this.busy || typeof fetch === 'undefined') return;
    if (this.last) {
      const moved = Math.hypot((lat - this.last.lat) * 111, (lon - this.last.lon) * 111 * Math.cos((lat * Math.PI) / 180));
      if (moved < 80 && now - this.last.t < 600000) return;
    }
    this.busy = true;
    this.last = { lat, lon, t: now };
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}` +
      '&current=cloud_cover,cloud_cover_low,weather_code,precipitation,wind_speed_10m,wind_direction_10m,visibility&wind_speed_unit=ms';
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { current?: Record<string, number> } | null) => {
        const c = j?.current;
        if (!c) return;
        const w = weatherFromCode(c.weather_code ?? 0, c.precipitation ?? 0);
        this.current = {
          cover: (c.cloud_cover ?? 0) / 100,
          coverLow: (c.cloud_cover_low ?? 0) / 100,
          kind: w.kind,
          strength: w.strength,
          windMps: c.wind_speed_10m ?? 0,
          windDirDeg: c.wind_direction_10m ?? 0,
          visibilityKm: (c.visibility ?? 24000) / 1000,
          label: w.label,
        };
      })
      .catch(() => undefined)
      .finally(() => {
        this.busy = false;
      });
  }
}

export class EarthClouds {
  public readonly weather = new LiveWeatherService();
  /** 0..1 how deep inside a cloud the camera is (radio call, a light white-out). */
  public inside = 0;
  private groundKm: number | null = null;
  /** The layer as drawn: eased towards the weather's, so nothing pops when an answer arrives. */
  private eased: { cover: number; thick: number; stratus: number; lift: number } | null = null;
  private demAt: { lat: number; lon: number } | null = null;
  private age = 0;
  private wind = new THREE.Vector2();
  private lastT = 0;
  private readonly v1 = new THREE.Vector3();
  private readonly v2 = new THREE.Vector3();
  private readonly q = new THREE.Quaternion();
  private readonly m4 = new THREE.Matrix4();

  /** 0..1 how much town light is below (from the night map, set by the scene). */
  public cityGlow = 0.5;

  constructor(private readonly pass: VolumetricCloudPass) {
    // The cloud noise is built ahead, in idle moments, so the first clouds are there at once
    pass.warm();
  }

  /**
   * The ground the layer is set over: the region's, not the spot under the jet. Read from the
   * terrain heights (a ~30 km patch around the jet, the mean of nine points), or until they are in
   * from the jet's own height over the ground, but only low down where that is measured well.
   * Followed slowly (half a minute), never jumped: a cloud base that leapt by kilometres with each
   * new reading made the clouds appear and vanish.
   */
  private regionalGround(lat: number, lon: number, camKm: number, aglKm: number, dt: number): number | null {
    let target: number | null = null;
    if (!earthElevation.disabled) {
      if (!this.demAt || Math.abs(lat - this.demAt.lat) > 0.1 || Math.abs(lon - this.demAt.lon) > 0.1) {
        this.demAt = { lat, lon };
        void earthElevation.ensure(lat - 0.3, lon - 0.3, lat + 0.3, lon + 0.3, 8);
      }
      let sum = 0;
      let n = 0;
      for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
        const h = earthElevation.heightKm(lat + i * 0.14, lon + j * 0.14, 8);
        if (h !== 0) n++;
        sum += Math.max(0, h);
      }
      if (n > 0) target = sum / 9;
    }
    const fromJet = aglKm < 4 ? THREE.MathUtils.clamp(camKm - aglKm, 0, 8.5) : null;
    this.age += dt;
    if (this.groundKm === null) {
      // The first seconds, while the terrain heights come in (the clouds are still being built):
      // no clouds yet rather than clouds set over the wrong ground (they would leap kilometres)
      if (target !== null) this.groundKm = target;
      else if (this.age > 5 && fromJet !== null) this.groundKm = fromJet;
      else return null;
    }
    target ??= fromJet;
    if (target !== null) this.groundKm += (target - this.groundKm) * (1 - Math.exp(-dt / 30));
    return Math.max(0, this.groundKm);
  }

  public hide(): void {
    this.pass.enabled = false;
    this.inside = 0;
  }

  /**
   * Per frame, before the draw. `surface`: Earth's surface mesh; `lat`/`lon`: under the jet;
   * `aglKm`: the jet's height over the ground; `kmPerUnit`: km per world unit at Earth;
   * `sunDirWorld`: towards the Sun; `visibilityKm`: the air's clarity.
   */
  public update(on: boolean, surface: THREE.Object3D, centre: THREE.Vector3, camera: THREE.PerspectiveCamera, lat: number, lon: number, aglKm: number, kmPerUnit: number, sunDirWorld: THREE.Vector3): void {
    if (!on) {
      this.hide();
      return;
    }
    this.weather.update(lat, lon);
    const w = this.weather.current;
    const now = performance.now() * 0.001;
    const dt = this.lastT ? Math.min(0.2, now - this.lastT) : 0;
    this.lastT = now;
    // Until the live answer arrives, a fair-weather sky; and always fair-weather cumulus about (a
    // cloudless sky over a flight sim reads as empty)
    const coverT = Math.max(0.3, w ? Math.max(w.coverLow, w.cover * 0.75) : 0.4);
    const storm = w?.kind === 'storm';
    const rainy = w?.kind === 'rain' || w?.kind === 'snow';
    const overcastT = coverT > 0.82;
    // Real cloud bases over land are ~0.6-2 km above it (lower in rain), tops by type
    const liftT = storm ? 0.7 : rainy ? 0.6 : overcastT ? 0.9 : 1.1 + 0.7 * (1 - coverT);
    const thickT = storm ? 8.5 : overcastT ? 1.1 : rainy ? 2.2 : 0.8 + 1.6 * coverT;
    const stratusT = overcastT && !storm ? THREE.MathUtils.smoothstep(coverT, 0.82, 0.98) : 0;
    // The weather changes over ~15 s, not in a frame
    // (and the first clouds fade in over a few seconds)
    const e = (this.eased ??= { cover: 0, thick: thickT, stratus: stratusT, lift: liftT });
    const ease = 1 - Math.exp(-dt / (this.age < 20 ? 3 : 15));
    e.cover += ((storm ? Math.max(coverT, 0.6) : coverT) - e.cover) * ease;
    e.thick += (thickT - e.thick) * ease;
    e.stratus += (stratusT - e.stratus) * ease;
    e.lift += (liftT - e.lift) * ease;
    surface.updateWorldMatrix(true, false);
    // Local sea-level radius and the camera's height over it
    const [x, y, z] = bodyLatLonToLocal('Earth', lat, lon);
    const r0 = this.v1.set(x, y, z).applyMatrix4(surface.matrixWorld).distanceTo(centre) * kmPerUnit;
    const camKm = camera.position.distanceTo(centre) * kmPerUnit - r0;
    const ground = this.regionalGround(lat, lon, camKm, aglKm, dt);
    this.pass.enabled = ground !== null && !!this.pass.u.tNoise.value;
    if (ground === null || !this.pass.enabled) {
      e.cover = 0;
      this.inside = 0;
      return;
    }
    const cover = e.cover;
    const overcast = cover > 0.82;
    const baseKm = ground + e.lift;
    const thickKm = e.thick;
    const L = this.pass.layer;
    L.cover = cover;
    L.baseKm = baseKm;
    L.topKm = baseKm + thickKm;
    L.stratus = e.stratus;
    // Extinction per km: real stratus and cumulus are opaque within a few hundred metres
    L.density = storm ? 16 : overcast ? 14 : 9;
    // Drift with the wind (km in Earth's frame), a little brisker than the 10 m wind (clouds ride
    // the faster wind aloft), and the billows themselves churn as they go
    const windKmS = Math.max(5, (w?.windMps ?? 5) * 2.2) / 1000;
    const dir = (((w?.windDirDeg ?? 240) + 180) * Math.PI) / 180;
    this.wind.x += Math.sin(dir) * windKmS * dt;
    this.wind.y += Math.cos(dir) * windKmS * dt;
    L.windKm.copy(this.wind);
    L.evolveKm += dt * 0.006;

    const u = this.pass.u;
    u.uEarthC.value.subVectors(centre, camera.position).multiplyScalar(kmPerUnit);
    u.uKmPerUnit.value = kmPerUnit;
    u.uR0.value = r0;
    surface.matrixWorld.decompose(this.v2, this.q, this.v1);
    u.uEarthRot.value.setFromMatrix4(this.m4.makeRotationFromQuaternion(this.q.invert()));
    u.uSunDir.value.copy(sunDirWorld).normalize();
    // Light at this hour: the Sun's colour through the air, the sky's and the ground's light
    const up = this.v1.subVectors(camera.position, centre).normalize();
    const sunUp = sunDirWorld.dot(up) / Math.max(1e-9, sunDirWorld.length());
    const sunVis = THREE.MathUtils.smoothstep(sunUp, -0.06, 0.04);
    const high = THREE.MathUtils.smoothstep(sunUp, 0.02, 0.35);
    const day = THREE.MathUtils.smoothstep(sunUp, -0.12, 0.12);
    const k = 2.1 * sunVis * (storm ? 0.75 : 1);
    u.uSunCol.value.setRGB(k * (1.0), k * (0.52 + 0.45 * high), k * (0.28 + 0.62 * high));
    const sky = u.uSkyAmb.value;
    sky.setRGB(0.36 + 0.06 * high, 0.42 + 0.14 * high, 0.55 + 0.25 * high).multiplyScalar(0.03 + 0.97 * day);
    sky.r += 0.012; sky.g += 0.016; sky.b += 0.03;
    // By night the Moon lights the clouds from above (its light is set by the scene)
    sky.r += MOON_LIGHT.value.x * 0.7; sky.g += MOON_LIGHT.value.y * 0.7; sky.b += MOON_LIGHT.value.z * 0.7;
    u.uGroundAmb.value.setRGB(0.26, 0.24, 0.21).multiplyScalar(0.02 + 0.98 * day * (overcast ? 0.7 : 1));
    // After dark the cloud base is lit from below by the towns (sodium orange), more over land with light
    const night = 1 - day;
    u.uGroundAmb.value.r += 0.012 + 0.05 * night * this.cityGlow;
    u.uGroundAmb.value.g += 0.009 + 0.028 * night * this.cityGlow;
    u.uGroundAmb.value.b += 0.007 + 0.01 * night * this.cityGlow;
    const haze = u.uHazeCol.value;
    haze.setRGB(0.50 + (0.98 - 0.50) * (1 - high), 0.66 + (0.56 - 0.66) * (1 - high), 0.92 + (0.32 - 0.92) * (1 - high));
    const hz = THREE.MathUtils.smoothstep(sunUp, -0.14, 0.04);
    haze.multiplyScalar(0.85 * (0.35 + 0.65 * day) * hz).add(new THREE.Color(0.012, 0.018, 0.04).multiplyScalar(1 - hz));
    u.uHaze.value = THREE.MathUtils.clamp(30 / Math.max(w?.visibilityKm ?? 30, 0.5), 1, 4.5);
    u.uSteps.value = 64;

    // In the layer, in thick cloud: the radio's "in cloud" and a light white-out
    const inLayer = camKm > baseKm && camKm < baseKm + thickKm ? 1 : 0;
    this.inside = inLayer * THREE.MathUtils.smoothstep(L.cover, 0.6, 0.95);
  }

  public dispose(): void {
    this.hide();
  }
}
