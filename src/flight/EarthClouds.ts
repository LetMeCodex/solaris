import * as THREE from 'three';
import { bodyLatLonToLocal } from '../explorer/TileMath';
import type { WeatherKind, WeatherMode } from './Weather';
import type { VolumetricCloudPass } from '../rendering/VolumetricClouds';
import { MOON_LIGHT } from '../rendering/AerialPerspective';
import { earthElevation } from '../explorer/Elevation';
import { perf } from '../rendering/Performance';

/**
 * Real weather + CloudSea-grade volumetric clouds over Earth in jet flight mode.
 *
 * LiveWeather asks Open-Meteo (free, no key) for local weather at the jet's lat/lon, while
 * EarthClouds bridges it into CloudSea's 4-channel Perlin-Worley raymarcher (`VolumetricCloudPass`)
 * with an Earth-anchored horizontal tangent frame, immediate ground-level estimation, and continuous
 * Dawn/Dusk/Day/Night solar lighting matching CloudSea's palettes.
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

// CloudSea reference lighting palettes calibrated for Solaris ACESFilmic + AutoExposure HDR
const DAY_SUN = new THREE.Color('#fffaf2').multiplyScalar(3.35);
const DAY_SKY = new THREE.Color('#86b5f2').multiplyScalar(1.45);
const DAY_BOUNCE = new THREE.Color('#b6cce8').multiplyScalar(1.05);
const DAY_HORIZON = new THREE.Color('#9ec8f5').multiplyScalar(1.30);

const GOLD_SUN = new THREE.Color('#ffaa74').multiplyScalar(4.0);
const GOLD_SKY = new THREE.Color('#b49ee0').multiplyScalar(1.12);
const GOLD_BOUNCE = new THREE.Color('#c88aa6').multiplyScalar(0.85);
const GOLD_HORIZON = new THREE.Color('#eb966c').multiplyScalar(1.25);

const NIGHT_SKY_BASE = new THREE.Color(0.015, 0.022, 0.045);
const NIGHT_BOUNCE_BASE = new THREE.Color(0.01, 0.013, 0.026);
const NIGHT_HORIZON_BASE = new THREE.Color(0.012, 0.018, 0.04);

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
  /** The layer as drawn: eased smoothly towards the target weather. */
  private eased: { cover: number; deck: number; thick: number; stratus: number; lift: number; density: number } | null = null;
  private demAt: { lat: number; lon: number } | null = null;
  private wind = new THREE.Vector2();
  private drift = new THREE.Vector2();
  private evolveS = 0;
  private lastT = 0;

  // Earth-anchored horizontal tangent basis so CloudSea slabs curve cleanly over any lat/lon
  private patchUp: THREE.Vector3 | null = null;
  private readonly patchEast = new THREE.Vector3(1, 0, 0);
  private readonly patchNorth = new THREE.Vector3(0, 0, 1);

  private readonly v1 = new THREE.Vector3();
  private readonly v2 = new THREE.Vector3();
  private readonly refVec = new THREE.Vector3();
  private readonly q = new THREE.Quaternion();
  private readonly m4 = new THREE.Matrix4();
  private readonly cSun = new THREE.Color();
  private readonly cSky = new THREE.Color();
  private readonly cBounce = new THREE.Color();
  private readonly cHaze = new THREE.Color();

  /** 0..1 how much town light is below (from the night map, set by the scene). */
  public cityGlow = 0.5;

  constructor(private readonly pass: VolumetricCloudPass) {
    // Warm the 64^3 RGBA Perlin-Worley worker immediately so clouds are ready right after launch
    pass.warm();
  }

  private regionalGround(lat: number, lon: number, camKm: number, aglKm: number, dt: number): number {
    let target: number | null = null;
    if (!earthElevation.disabled) {
      if (!this.demAt || Math.abs(lat - this.demAt.lat) > 0.1 || Math.abs(lon - this.demAt.lon) > 0.1) {
        this.demAt = { lat, lon };
        void earthElevation.ensure(lat - 0.3, lon - 0.3, lat + 0.3, lon + 0.3, 8);
      }
      const centerH = Math.max(0, earthElevation.heightKm(lat, lon, 11));
      let sum = 0;
      let maxH = centerH;
      let n = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const h = earthElevation.heightKm(lat + i * 0.12, lon + j * 0.12, 8);
          if (h !== 0) n++;
          const clamped = Math.max(0, h);
          sum += clamped;
          if (clamped > maxH) maxH = clamped;
        }
      }
      if (n > 0 || centerH > 0) {
        // Protect elevated urban plateaus (e.g. Sao Paulo 760m near coast, Denver 1600m) from
        // being averaged down by adjacent ocean/valleys so clouds never slice through rooftops.
        const avgH = sum / 9;
        target = Math.max(centerH, avgH * 0.4 + maxH * 0.6);
      }
    }
    const fromJet = aglKm < 12 ? THREE.MathUtils.clamp(camKm - aglKm, 0, 8.85) : null;
    const immediate = Math.max(target ?? 0, fromJet ?? 0);
    if (this.groundKm === null) {
      this.groundKm = immediate;
    } else if (target !== null || fromJet !== null) {
      // Climb rapidly over rising terrain/plateaus so cloud decks stay safely clear; ease down gently.
      const tau = immediate > this.groundKm ? 2.5 : 14;
      this.groundKm += (immediate - this.groundKm) * (1 - Math.exp(-dt / tau));
    }
    return Math.max(0, this.groundKm);
  }

  private syncTangentBasis(camLocalUp: THREE.Vector3): void {
    if (!this.patchUp || camLocalUp.dot(this.patchUp) < 0.88) {
      this.patchUp ??= new THREE.Vector3();
      this.patchUp.copy(camLocalUp).normalize();
      if (Math.abs(this.patchUp.y) > 0.9) this.refVec.set(1, 0, 0);
      else this.refVec.set(0, 1, 0);
      this.patchEast.crossVectors(this.refVec, this.patchUp).normalize();
      this.patchNorth.crossVectors(this.patchUp, this.patchEast).normalize();
    }
  }

  public hide(): void {
    this.pass.enabled = false;
    this.inside = 0;
  }

  /**
   * Per frame, before the draw.
   */
  public update(
    on: boolean,
    surface: THREE.Object3D,
    centre: THREE.Vector3,
    camera: THREE.PerspectiveCamera,
    lat: number,
    lon: number,
    aglKm: number,
    kmPerUnit: number,
    sunDirWorld: THREE.Vector3,
    weatherMode: WeatherMode = 'auto',
    lightningFlash = 0,
  ): void {
    if (!on) {
      this.hide();
      return;
    }
    this.weather.update(lat, lon);
    const w = this.weather.current;
    const now = performance.now() * 0.001;
    const dt = this.lastT ? Math.min(0.2, Math.max(0, now - this.lastT)) : 0.016;
    this.lastT = now;

    // Resolve weather targets (honors pilot `Y` override cleanly while keeping CloudSea lush by default)
    const manualClear = weatherMode === 'clear';
    const storm = weatherMode === 'storm' || (weatherMode === 'auto' && w?.kind === 'storm');
    const rainy = weatherMode === 'rain' || weatherMode === 'snow' || (weatherMode === 'auto' && (w?.kind === 'rain' || w?.kind === 'snow'));

    const liveCover = w ? Math.max(w.coverLow, w.cover * 0.82) : 0.58;
    const coverT = manualClear
      ? 0.40
      : storm
        ? 0.88
        : rainy
          ? 0.78
          : THREE.MathUtils.lerp(0.48, 0.64, liveCover);

    const overcastT = rainy;
    const deckT = manualClear
      ? 0.56
      : storm
        ? 0.90
        : rainy
          ? 0.87
          : THREE.MathUtils.lerp(0.76, 0.845, liveCover);

    // Authentic ISA Lifting Condensation Level (LCL) clearance: fair-weather cumulus bases float
    // ~1.85-2.2 km above local terrain/rooftops, while storm/rain bases hold at least 1.25-1.35 km AGL.
    const liftT = manualClear ? 2.15 : storm ? 1.25 : rainy ? 1.35 : 1.85;
    const minMslKm = manualClear ? 2.2 : storm ? 1.35 : rainy ? 1.45 : 1.9;
    const thickT = manualClear ? 2.1 : storm ? 5.2 : rainy ? 3.2 : 2.45 + 0.55 * coverT;
    const stratusT = overcastT && !storm ? THREE.MathUtils.smoothstep(coverT, 0.76, 0.96) : 0;
    const densityT = manualClear ? 1.35 : storm ? 1.85 : rainy ? 1.65 : 1.48;

    const e = (this.eased ??= {
      cover: coverT,
      deck: deckT,
      thick: thickT,
      stratus: stratusT,
      lift: liftT,
      density: densityT,
    });
    const ease = 1 - Math.exp(-dt / 4);
    e.cover += (coverT - e.cover) * ease;
    e.deck += (deckT - e.deck) * ease;
    e.thick += (thickT - e.thick) * ease;
    e.stratus += (stratusT - e.stratus) * ease;
    e.lift += (liftT - e.lift) * ease;
    e.density += (densityT - e.density) * ease;

    surface.updateWorldMatrix(true, false);
    const [x, y, z] = bodyLatLonToLocal('Earth', lat, lon);
    const r0 = this.v1.set(x, y, z).applyMatrix4(surface.matrixWorld).distanceTo(centre) * kmPerUnit;
    const camKm = camera.position.distanceTo(centre) * kmPerUnit - r0;
    const ground = this.regionalGround(lat, lon, camKm, aglKm, dt);

    // Wait only until the 64^3 worker noise texture arrives (~25-40ms off-thread)
    this.pass.warm();
    this.pass.enabled = this.pass.isNoiseReady();
    if (!this.pass.enabled) {
      this.inside = 0;
      return;
    }

    const baseKm = Math.max(minMslKm, ground + e.lift);
    const thickKm = e.thick;
    const unitKm = Math.max(0.16, thickKm / 15.0);

    // Wind + CloudSea drift (`drift.x += dt * 0.35`, `drift.z += dt * 0.12`)
    const windKmS = Math.max(5, (w?.windMps ?? 5) * 2.2) / 1000;
    const dir = (((w?.windDirDeg ?? 240) + 180) * Math.PI) / 180;
    this.wind.x += Math.sin(dir) * windKmS * dt;
    this.wind.y += Math.cos(dir) * windKmS * dt;
    this.drift.x += dt * 0.35 + (Math.sin(dir) * windKmS * dt) / unitKm;
    this.drift.y += dt * 0.12 + (Math.cos(dir) * windKmS * dt) / unitKm;
    this.evolveS += dt;

    const L = this.pass.layer;
    L.cover = e.cover;
    L.deck = e.deck;
    L.baseKm = baseKm;
    L.topKm = baseKm + thickKm;
    L.stratus = e.stratus;
    L.density = e.density;
    L.unitKm = unitKm;
    L.reachKm = 160;
    L.windKm.copy(this.wind);
    L.drift.copy(this.drift);
    L.evolveKm = this.evolveS;

    const u = this.pass.u;
    u.uEarthC.value.subVectors(centre, camera.position).multiplyScalar(kmPerUnit);
    u.uKmPerUnit.value = kmPerUnit;
    u.uR0.value = r0;
    surface.matrixWorld.decompose(this.v2, this.q, this.v1);
    const invQ = this.q.clone().invert();
    u.uEarthRot.value.setFromMatrix4(this.m4.makeRotationFromQuaternion(invQ));

    // Update Earth-locked tangent axes cleanly at this flight location
    const camLocalUp = this.v1.subVectors(camera.position, centre).applyQuaternion(invQ).normalize();
    this.syncTangentBasis(camLocalUp);
    u.uPatchEast.value.copy(this.patchEast);
    u.uPatchNorth.value.copy(this.patchNorth);

    u.uSunDir.value.copy(sunDirWorld).normalize();
    // Temporal reprojection accumulates 6-8 frames of IGN-jittered samples smoothly, allowing
    // crisp anti-aliased clouds at 36-52 steps/frame with zero pixelation or framerate penalty.
    u.uSteps.value = perf.tier === 'high' ? 52 : perf.tier === 'medium' ? 44 : 34;
    u.uSunSteps.value = perf.tier === 'low' ? 3 : 4;
    u.uDetail.value = perf.tier === 'low' ? 0 : 1;
    u.uFlash.value = lightningFlash;

    // Continuous solar elevation lighting matching CloudSea Day / Dawn-Dusk / Night palettes
    const up = this.v1.subVectors(camera.position, centre).normalize();
    const sunUp = sunDirWorld.dot(up) / Math.max(1e-9, sunDirWorld.length());
    const goldBlend = THREE.MathUtils.smoothstep(sunUp, -0.10, 0.02);
    const dayBlend = THREE.MathUtils.smoothstep(sunUp, 0.02, 0.30);
    const nightMix = 1 - goldBlend;
    const stormScale = storm ? 0.65 : 1.0;

    // Interpolate sun light (moonlight at night -> golden amber dawn/dusk -> CloudSea #fff1dc day)
    this.cSun.setRGB(MOON_LIGHT.value.x * 1.25, MOON_LIGHT.value.y * 1.25, MOON_LIGHT.value.z * 1.25);
    this.cSun.lerp(GOLD_SUN, goldBlend).lerp(DAY_SUN, dayBlend).multiplyScalar(stormScale);
    u.uSunCol.value.copy(this.cSun);

    // Sky top ambient light
    this.cSky.copy(NIGHT_SKY_BASE);
    this.cSky.r += MOON_LIGHT.value.x * 0.7;
    this.cSky.g += MOON_LIGHT.value.y * 0.7;
    this.cSky.b += MOON_LIGHT.value.z * 0.7;
    this.cSky.lerp(GOLD_SKY, goldBlend).lerp(DAY_SKY, dayBlend).multiplyScalar(storm ? 0.72 : 1.0);
    u.uSkyAmb.value.copy(this.cSky);

    // Under-cloud ground bounce light + warm night city glow underneath
    this.cBounce.copy(NIGHT_BOUNCE_BASE);
    this.cBounce.r += 0.05 * nightMix * this.cityGlow;
    this.cBounce.g += 0.028 * nightMix * this.cityGlow;
    this.cBounce.b += 0.01 * nightMix * this.cityGlow;
    this.cBounce.lerp(GOLD_BOUNCE, goldBlend).lerp(DAY_BOUNCE, dayBlend).multiplyScalar(storm ? 0.55 : 1.0);
    u.uGroundAmb.value.copy(this.cBounce);

    // Horizon extinction color matching SkyAtmosphere + CloudSea
    this.cHaze.copy(NIGHT_HORIZON_BASE);
    this.cHaze.r += MOON_LIGHT.value.x * 0.35;
    this.cHaze.g += MOON_LIGHT.value.y * 0.35;
    this.cHaze.b += MOON_LIGHT.value.z * 0.35;
    this.cHaze.lerp(GOLD_HORIZON, goldBlend).lerp(DAY_HORIZON, dayBlend);
    if (storm) this.cHaze.multiplyScalar(0.68);
    u.uHazeCol.value.copy(this.cHaze);

    u.uHaze.value = THREE.MathUtils.clamp(30 / Math.max(w?.visibilityKm ?? 30, 0.5), 1, 4.5);

    // Trigger cockpit frost/mist only inside the dense lower deck carpet or active precip/storm core
    const deckTopKm = baseKm + thickKm * (storm || rainy ? 0.85 : 0.28);
    const inDeck = camKm > baseKm + thickKm * 0.04 && camKm < deckTopKm ? 1 : 0;
    this.inside = inDeck * THREE.MathUtils.smoothstep(Math.max(L.cover, L.deck), 0.55, 0.92);
  }

  public dispose(): void {
    this.hide();
  }
}
