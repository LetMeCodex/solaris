import * as THREE from 'three';
import { bodyLatLonToLocal } from '../explorer/TileMath';
import type { WeatherKind, WeatherMode } from './Weather';
import type { VolumetricCloudPass } from '../rendering/VolumetricClouds';
import {
  GROUND_SNOW,
  GROUND_WETNESS,
  MOON_LIGHT,
  SKY_AURORA,
  SKY_CIRRUS,
  SKY_RAINBOW,
  SKY_STORM_TINT,
  SKY_TIME,
  VALLEY_FOG,
} from '../rendering/AerialPerspective';
import { LiveSpaceWeatherService } from './SpaceWeather';
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
  coverMid: number;
  coverHigh: number;
  kind: WeatherKind;
  strength: number;
  windMps: number;
  windDirDeg: number;
  visibilityKm: number;
  tempC: number;
  humidityPct: number;
  rainMm: number;
  snowfallCm: number;
  snowDepthM: number;
  isFog: boolean;
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

const NIGHT_SKY_BASE = new THREE.Color(0.0014, 0.0022, 0.0052);
const NIGHT_BOUNCE_BASE = new THREE.Color(0.0008, 0.0013, 0.0032);
const NIGHT_HORIZON_BASE = new THREE.Color(0.0022, 0.0036, 0.0085);

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
      '&current=temperature_2m,relative_humidity_2m,rain,snowfall,snow_depth,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,weather_code,precipitation,wind_speed_10m,wind_direction_10m,visibility&wind_speed_unit=ms';
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { current?: Record<string, number> } | null) => {
        const c = j?.current;
        if (!c) return;
        const code = c.weather_code ?? 0;
        const w = weatherFromCode(code, c.precipitation ?? 0);
        this.current = {
          cover: (c.cloud_cover ?? 0) / 100,
          coverLow: (c.cloud_cover_low ?? 0) / 100,
          coverMid: (c.cloud_cover_mid ?? 0) / 100,
          coverHigh: (c.cloud_cover_high ?? 0) / 100,
          kind: w.kind,
          strength: w.strength,
          windMps: c.wind_speed_10m ?? 0,
          windDirDeg: c.wind_direction_10m ?? 0,
          visibilityKm: (c.visibility ?? 24000) / 1000,
          tempC: c.temperature_2m ?? 15,
          humidityPct: c.relative_humidity_2m ?? 50,
          rainMm: c.rain ?? 0,
          snowfallCm: c.snowfall ?? 0,
          snowDepthM: c.snow_depth ?? 0,
          isFog: code === 45 || code === 48,
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
  public readonly spaceWeather = new LiveSpaceWeatherService();
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
  private wxInitialized = false;

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
    let teleported = false;
    if (!earthElevation.disabled) {
      if (!this.demAt || Math.abs(lat - this.demAt.lat) > 0.1 || Math.abs(lon - this.demAt.lon) > 0.1) {
        teleported = !this.demAt || Math.abs(lat - this.demAt.lat) > 0.4 || Math.abs(lon - this.demAt.lon) > 0.4;
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
    if (this.groundKm === null || teleported) {
      this.groundKm = immediate;
    } else if (target !== null || fromJet !== null) {
      // Climb rapidly over rising terrain/plateaus so cloud decks stay safely clear; ease down gently.
      const tau = immediate > this.groundKm ? 1.2 : 14;
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
    this.wxInitialized = false;
    SKY_AURORA.value = 0;
    SKY_RAINBOW.value = 0;
    SKY_STORM_TINT.value = 0;
    GROUND_SNOW.value = 0;
    GROUND_WETNESS.value = 0;
    VALLEY_FOG.value = 0;
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

    // Continuous solar elevation & live NOAA Kp aurora computed early so clear polar nights
    // and clear starry skies open up completely (zero chunky clouds blocking the Aurora!).
    const upPre = this.v1.subVectors(camera.position, centre).normalize();
    const sunUpPre = sunDirWorld.dot(upPre) / Math.max(1e-9, sunDirWorld.length());
    const nightPre = 1 - THREE.MathUtils.smoothstep(sunUpPre, -0.10, 0.02);
    const auroraPre = this.spaceWeather.auroraAt(lat, lon, sunUpPre);
    const clearStarryNight = (manualClear && nightPre > 0.35) || (auroraPre > 0.22 && !storm && !rainy);

    const liveCover = w ? Math.max(w.coverLow, w.cover * 0.82) : 0.45;
    const coverT = clearStarryNight
      ? 0.0
      : manualClear
        ? 0.16
        : storm
          ? 0.84
          : rainy
            ? 0.62
            : THREE.MathUtils.lerp(0.32, 0.54, liveCover) * (1 - nightPre * 0.35);

    const overcastT = rainy;
    // Calibrated volumetric cumulus deck: Clear starry nights & Aurora skies open up completely (0.0);
    // snow/rain show dramatic sculpted alpine clouds with crisp visibility; storm builds towering dark anvil decks.
    const deckT = clearStarryNight
      ? 0.0
      : manualClear
        ? 0.04
        : storm
          ? 0.58
          : rainy
            ? 0.36
            : THREE.MathUtils.lerp(0.22, 0.44, liveCover) * (1 - nightPre * 0.45);

    // Authentic ISA Lifting Condensation Level (LCL) clearance: fair-weather cumulus bases float
    // ~1.85-2.15 km above low-to-mid terrain/rooftops (e.g. Sao Paulo 0.76 km -> ~2.6 km MSL),
    // and cap at real lower-tropospheric LCL (~3.8-4.2 km MSL) over towering mountain ranges so
    // Himalayan giants like Mount Everest (8,849 m) pierce dramatically ABOVE the cloud sea!
    const liftT = manualClear ? 2.15 : storm ? 1.55 : rainy ? 1.75 : 1.85;
    const minMslKm = manualClear ? 2.2 : storm ? 1.65 : rainy ? 1.85 : 1.9;
    const maxBaseMslKm = manualClear ? 3.85 : storm ? 4.8 : rainy ? 4.45 : 4.15;
    const thickT = manualClear ? 1.65 : storm ? 4.5 : rainy ? 2.6 : 1.95 + 0.45 * coverT;
    const stratusT = overcastT && !storm ? THREE.MathUtils.smoothstep(coverT, 0.76, 0.96) : 0;
    const densityT = manualClear ? 1.22 : storm ? 1.72 : rainy ? 1.44 : 1.38;

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

    const baseKm = THREE.MathUtils.clamp(ground + e.lift, minMslKm, maxBaseMslKm);
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
    const stormScale = storm ? 0.30 : 1.0;

    // Interpolate sun light (soft velvet moonlight at night -> golden amber dawn/dusk -> CloudSea day)
    this.cSun.setRGB(MOON_LIGHT.value.x * 0.38, MOON_LIGHT.value.y * 0.40, MOON_LIGHT.value.z * 0.48);
    this.cSun.lerp(GOLD_SUN, goldBlend).lerp(DAY_SUN, dayBlend).multiplyScalar(stormScale);
    u.uSunCol.value.copy(this.cSun);

    // Sky top ambient light (subtly tinted emerald when under active polar aurora curtains;
    // brooding dark storm-slate during thunderstorms so lightning bolts pop dramatically!)
    const aurGlow = SKY_AURORA.value * nightMix;
    this.cSky.copy(NIGHT_SKY_BASE);
    this.cSky.r += MOON_LIGHT.value.x * 0.24 + aurGlow * 0.004;
    this.cSky.g += MOON_LIGHT.value.y * 0.26 + aurGlow * 0.026;
    this.cSky.b += MOON_LIGHT.value.z * 0.30 + aurGlow * 0.014;
    this.cSky.lerp(GOLD_SKY, goldBlend).lerp(DAY_SKY, dayBlend).multiplyScalar(storm ? 0.42 : 1.0);
    u.uSkyAmb.value.copy(this.cSky);

    // Under-cloud ground bounce light + warm night city glow underneath
    this.cBounce.copy(NIGHT_BOUNCE_BASE);
    this.cBounce.r += 0.018 * nightMix * this.cityGlow + aurGlow * 0.002;
    this.cBounce.g += 0.010 * nightMix * this.cityGlow + aurGlow * 0.012;
    this.cBounce.b += 0.004 * nightMix * this.cityGlow + aurGlow * 0.006;
    this.cBounce.lerp(GOLD_BOUNCE, goldBlend).lerp(DAY_BOUNCE, dayBlend).multiplyScalar(storm ? 0.34 : 1.0);
    u.uGroundAmb.value.copy(this.cBounce);

    // Horizon extinction color matching SkyAtmosphere + CloudSea (deep slate-blue in storms)
    this.cHaze.copy(NIGHT_HORIZON_BASE);
    this.cHaze.r += MOON_LIGHT.value.x * 0.14;
    this.cHaze.g += MOON_LIGHT.value.y * 0.15;
    this.cHaze.b += MOON_LIGHT.value.z * 0.18;
    this.cHaze.lerp(GOLD_HORIZON, goldBlend).lerp(DAY_HORIZON, dayBlend);
    if (storm) this.cHaze.multiplyScalar(0.36);
    u.uHazeCol.value.copy(this.cHaze);

    u.uHaze.value = THREE.MathUtils.clamp(30 / Math.max(w?.visibilityKm ?? 30, 0.5), 1, 4.5);

    // Trigger cockpit frost/mist only inside the dense lower deck carpet or active precip/storm core
    const deckTopKm = baseKm + thickKm * (storm || rainy ? 0.85 : 0.28);
    const inDeck = camKm > baseKm + thickKm * 0.04 && camKm < deckTopKm ? 1 : 0;
    this.inside = inDeck * THREE.MathUtils.smoothstep(Math.max(L.cover, L.deck), 0.55, 0.92);

    // Sync real-time global atmosphere & surface weather uniforms (Zero extra draw calls!):
    //  - Live high-altitude cirrus wisps (Open-Meteo `cloud_cover_high` + scenic baseline)
    //  - Live NOAA SWPC geomagnetic Aurora Borealis & Australis oval
    //  - Physically-based 42°/51° double rainbow when sun meets rain/showers/moisture
    //  - Live temperature/snow_depth slope-masked snow accumulation, PBR rain wetness & valley fog
    SKY_TIME.value = this.evolveS;
    const cirrusTarget = manualClear
      ? 0.22
      : storm
        ? 0.65
        : w
          ? THREE.MathUtils.clamp(0.18 + w.coverHigh * 0.82, 0.16, 1.0)
          : 0.34;
    const auroraTarget = this.spaceWeather.auroraAt(lat, lon, sunUp);
    const sunForRainbow = THREE.MathUtils.smoothstep(sunUp, 0.02, 0.12) * (1 - THREE.MathUtils.smoothstep(sunUp, 0.56, 0.72));
    const moistureForRainbow =
      weatherMode === 'rain'
        ? 0.92
        : weatherMode === 'storm'
          ? 0.45
          : w && (w.kind === 'rain' || w.rainMm > 0.1 || (w.humidityPct > 78 && w.cover > 0.2 && w.cover < 0.85))
            ? 0.85
            : 0;
    const rainbowTarget = sunForRainbow * moistureForRainbow;
    const stormTintTarget = storm ? 0.85 : 0;

    const snowTarget =
      weatherMode === 'snow'
        ? 0.92
        : weatherMode === 'clear'
          ? 0
          : w
            ? THREE.MathUtils.clamp(
                Math.max(
                  w.snowDepthM > 0.01 ? Math.min(1, 0.35 + w.snowDepthM * 2.5) : 0,
                  w.snowfallCm > 0.05 ? Math.min(1, 0.45 + w.snowfallCm * 0.4) : 0,
                  w.tempC <= 0.5 && w.kind === 'snow' ? 0.75 : 0,
                ),
                0,
                1,
              )
            : 0;
    const wetnessTarget =
      weatherMode === 'storm'
        ? 0.95
        : weatherMode === 'rain'
          ? 0.85
          : weatherMode === 'clear'
            ? 0
            : w
              ? THREE.MathUtils.clamp(
                  Math.max(
                    w.rainMm > 0.05 ? Math.min(1, 0.45 + w.rainMm * 0.35) : 0,
                    w.kind === 'rain' || w.kind === 'storm' ? 0.78 : 0,
                    w.humidityPct > 88 ? (w.humidityPct - 88) / 24 : 0,
                  ),
                  0,
                  1,
                )
              : 0;
    const valleyFogTarget =
      manualClear
        ? 0.05
        : w
          ? THREE.MathUtils.clamp(
              Math.max(
                w.isFog ? 0.88 : 0,
                w.visibilityKm < 8 ? (8 - w.visibilityKm) / 8 : 0,
                w.humidityPct > 80 && w.windMps < 5 ? ((w.humidityPct - 80) / 20) * 0.45 : 0,
              ),
              0,
              0.92,
            )
          : rainy
            ? 0.32
            : 0.08;

    const wxEase = this.wxInitialized ? 1 - Math.exp(-dt * 2.2) : 1;
    this.wxInitialized = true;
    SKY_CIRRUS.value += (cirrusTarget - SKY_CIRRUS.value) * wxEase;
    SKY_AURORA.value += (auroraTarget - SKY_AURORA.value) * wxEase;
    SKY_RAINBOW.value += (rainbowTarget - SKY_RAINBOW.value) * wxEase;
    SKY_STORM_TINT.value += (stormTintTarget - SKY_STORM_TINT.value) * wxEase;
    GROUND_SNOW.value += (snowTarget - GROUND_SNOW.value) * wxEase;
    GROUND_WETNESS.value += (wetnessTarget - GROUND_WETNESS.value) * wxEase;
    VALLEY_FOG.value += (valleyFogTarget - VALLEY_FOG.value) * wxEase;
  }

  public dispose(): void {
    this.hide();
  }
}
