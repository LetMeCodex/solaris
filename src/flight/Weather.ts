import * as THREE from 'three';
import { glowTexture } from './JetModel';

/**
 * Weather in the air the jet flies through.
 *
 * What falls and blows depends on the world and, on Earth, on latitude, altitude and the hour,
 * following each world's climate:
 *  - Earth: clouds between 1 and 9 km; rain and thunderstorms likeliest in the tropics (the ITCZ),
 *    rain or snow in mid-latitudes, snow towards the poles and high up (freezing level ~4 km in
 *    the tropics, near the ground at the poles).
 *  - Mars: dust: from a light haze to dust storms (the global storms of southern summer).
 *  - Titan: methane drizzle below ~20 km, under its orange smog.
 *  - Venus: sulphuric-acid cloud deck from ~48 to 70 km, virga beneath it.
 *  - Jupiter, Saturn, Uranus, Neptune: turbulence in the cloud tops, lightning on Jupiter and Saturn.
 * The pilot can also pick the weather. Everything here lives in the jet's metre-scale overlay.
 */

export type WeatherKind = 'clear' | 'rain' | 'snow' | 'storm' | 'dust' | 'methane' | 'acid' | 'turbulence';
export type WeatherMode = 'auto' | 'clear' | 'rain' | 'snow' | 'storm';

export interface WeatherState {
  kind: WeatherKind;
  /** 0..1 how strong it is here. */
  strength: number;
  /** 0..1 how deep in cloud (a white-out) the jet is. */
  cloud: number;
  /** A lightning flash now (0..1). */
  flash: number;
  /** Gusts: extra camera shake. */
  shake: number;
  label: string;
}

const N = 1400;
const BOX = 60; // m

function hash(a: number, b: number, c: number): number {
  let h = (a * 374761393 + b * 668265263 + c * 1274126177) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

export class Weather {
  public readonly group = new THREE.Group();
  public mode: WeatherMode = 'auto';
  /** Live weather where the jet is (Earth, Open-Meteo): used in 'auto' mode in place of the climate guess. */
  public live: { kind: WeatherKind; strength: number; label: string } | null = null;
  /** 0..1 inside one of the drawn clouds (EarthClouds): a white-out. */
  public cloudInside = 0;
  public state: WeatherState = { kind: 'clear', strength: 0, cloud: 0, flash: 0, shake: 0, label: 'Clear' };

  private pts = new Float32Array(N * 3);
  private positions = new Float32Array(N * 6);
  private colors = new Float32Array(N * 6);
  private streaks: THREE.LineSegments;
  private streakMat: THREE.LineBasicMaterial;
  private flakes: THREE.Points;
  private flakePos = new Float32Array(N * 3);
  private flakeMat: THREE.PointsMaterial;
  private veil: THREE.Mesh;
  private veilMat: THREE.ShaderMaterial;
  private drops: THREE.Points;
  private dropPos = new Float32Array(240 * 3);
  private dropAge = new Float32Array(240);
  private dropMat: THREE.PointsMaterial;
  private flashT = 0;
  private dropTex: THREE.Texture;
  private flakeTex: THREE.Texture;
  private nextFlash = 3;
  private seed = 1;
  /** Fired with each lightning strike (thunder follows). */
  public onLightning: ((distanceKm: number) => void) | null = null;

  constructor() {
    for (let i = 0; i < N; i++) {
      this.pts[i * 3] = (this.rand() - 0.5) * BOX * 2;
      this.pts[i * 3 + 1] = (this.rand() - 0.5) * BOX * 2;
      this.pts[i * 3 + 2] = (this.rand() - 0.5) * BOX * 2;
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage));
    sg.setAttribute('color', new THREE.BufferAttribute(this.colors, 3).setUsage(THREE.DynamicDrawUsage));
    this.streakMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    this.streaks = new THREE.LineSegments(sg, this.streakMat);
    this.streaks.frustumCulled = false;
    this.streaks.renderOrder = 9;

    const fg = new THREE.BufferGeometry();
    fg.setAttribute('position', new THREE.BufferAttribute(this.flakePos, 3).setUsage(THREE.DynamicDrawUsage));
    this.flakeTex = glowTexture();
    this.flakeMat = new THREE.PointsMaterial({ color: 0xffffff, map: this.flakeTex, size: 0.09, sizeAttenuation: true, transparent: true, opacity: 0.85, depthWrite: false, alphaTest: 0.02 });
    this.flakes = new THREE.Points(fg, this.flakeMat);
    this.flakes.frustumCulled = false;
    this.flakes.renderOrder = 9;

    // Cloud / dust / haze white-out: a full-screen veil drawn under the jet, over the world
    this.veilMat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(1, 1, 1) }, uAmount: { value: 0 }, uTime: { value: 0 }, uFlash: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: `
        uniform vec3 uColor; uniform float uAmount; uniform float uTime; uniform float uFlash; varying vec2 vUv;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
          return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
        void main(){
          // Billowing density so passing through cloud reads as cloud, not a flat fog
          float n = noise(vUv * 3.0 + uTime * 0.35) * 0.6 + noise(vUv * 7.0 - uTime * 0.6) * 0.4;
          float a = clamp(uAmount * (0.75 + 0.5 * n), 0.0, 0.97);
          vec3 col = uColor * (0.85 + 0.25 * n) + vec3(uFlash * 1.5);
          gl_FragColor = vec4(col, max(a, uFlash * 0.5));
        }`,
      // Opaque-listed with custom blending so it draws first (under the jet), not after it
      transparent: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      depthTest: false,
      depthWrite: false,
    });
    this.veil = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.veilMat);
    this.veil.frustumCulled = false;
    this.veil.renderOrder = -50;
    this.veil.userData.noAO = true;

    // Drops on the canopy (cockpit and GoPro views): beads that run back with the airflow
    const dg = new THREE.BufferGeometry();
    dg.setAttribute('position', new THREE.BufferAttribute(this.dropPos, 3).setUsage(THREE.DynamicDrawUsage));
    // Round, soft beads (a point is square without a texture)
    this.dropTex = glowTexture();
    this.dropMat = new THREE.PointsMaterial({ color: 0xe6f0ff, map: this.dropTex, size: 0.009, sizeAttenuation: true, transparent: true, opacity: 0.45, depthWrite: false, alphaTest: 0.02 });
    this.drops = new THREE.Points(dg, this.dropMat);
    this.drops.frustumCulled = false;
    this.drops.renderOrder = 30;
    this.dropAge.fill(99);

    this.group.add(this.veil, this.streaks, this.flakes, this.drops);
  }

  private rand(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  }

  /** The weather a world's climate gives here and now (deterministic per region and hour). */
  public static climate(world: string, latDeg: number, lonDeg: number, altKm: number, hourIndex: number): { kind: WeatherKind; strength: number } {
    const cell = hash(Math.floor((latDeg + 90) / 6), Math.floor((lonDeg + 180) / 6), hourIndex);
    const alat = Math.abs(latDeg);
    switch (world) {
      case 'Earth': {
        // Chance of precipitation by latitude band (ITCZ wet, subtropics dry, mid-latitude storm tracks)
        const wet = alat < 12 ? 0.55 : alat < 30 ? 0.18 : alat < 62 ? 0.42 : 0.3;
        if (cell > wet) return { kind: 'clear', strength: 0 };
        const freezingKm = Math.max(0, 4.8 * Math.cos((alat * Math.PI) / 180) ** 2 - 0.4);
        const strength = 0.45 + 0.55 * hash(hourIndex, Math.floor(latDeg), 7);
        if (altKm > freezingKm || alat > 62) return { kind: 'snow', strength };
        return { kind: alat < 25 && cell < wet * 0.35 ? 'storm' : 'rain', strength };
      }
      case 'Mars':
        return { kind: 'dust', strength: cell < 0.35 ? 0.6 + 0.4 * cell / 0.35 : 0.15 };
      case 'Titan':
        return altKm < 20 && cell < 0.45 ? { kind: 'methane', strength: 0.6 } : { kind: 'clear', strength: 0 };
      case 'Venus':
        return { kind: 'acid', strength: 1 };
      case 'Jupiter':
      case 'Saturn':
      case 'Uranus':
      case 'Neptune':
        return { kind: 'turbulence', strength: 0.7 };
      default:
        return { kind: 'clear', strength: 0 };
    }
  }

  /**
   * @param ctx where the jet is and how it moves (air-relative velocity in m/s, world axes)
   */
  public update(
    dt: number,
    timeSec: number,
    ctx: { world: string; latDeg: number; lonDeg: number; altKm: number; airDensity: number; daylight: number; airVelMps: THREE.Vector3; up: THREE.Vector3; camera: THREE.Camera; inside: boolean; hourIndex: number }
  ): WeatherState {
    const st = this.state;
    if (ctx.airDensity <= 0.002) {
      st.kind = 'clear';
      st.strength = st.cloud = st.flash = st.shake = 0;
      st.label = 'Clear';
      this.group.visible = false;
      return st;
    }
    this.group.visible = true;
    let { kind, strength } = Weather.climate(ctx.world, ctx.latDeg, ctx.lonDeg, ctx.altKm, ctx.hourIndex);
    if (this.mode === 'auto' && ctx.world === 'Earth' && this.live) {
      kind = this.live.kind;
      strength = this.live.strength;
      // Above the weather nothing falls: rain and snow come from clouds a few km up at most
      if (ctx.altKm > (kind === 'storm' ? 11 : 6)) kind = 'clear';
      else if (kind === 'rain' && ctx.altKm > 4) kind = 'snow';
    }
    if (this.mode !== 'auto' && ctx.world === 'Earth') {
      kind = this.mode === 'clear' ? 'clear' : this.mode;
      strength = this.mode === 'clear' ? 0 : 0.85;
      if (kind === 'rain' && ctx.altKm > 5) kind = 'snow';
    }
    st.kind = kind;
    st.strength = strength;
    st.label = { clear: 'Clear', rain: 'Rain', snow: 'Snow', storm: 'Thunderstorm', dust: strength > 0.5 ? 'Dust storm' : 'Dust haze', methane: 'Methane drizzle', acid: 'Sulphuric acid haze', turbulence: 'Storm turbulence' }[kind];
    if (this.mode === 'auto' && ctx.world === 'Earth' && this.live) st.label = this.live.label;

    // Cloud: on Earth the deck where it is raining (1–9 km); dust and haze fill the air on Mars/Venus
    // Over Earth with the live weather the volumetric clouds are drawn in the scene itself
    const volumetric = ctx.world === 'Earth' && this.live !== null && this.mode === 'auto';
    const inDeck = ctx.world === 'Earth' && kind !== 'clear' && !volumetric ? THREE.MathUtils.smoothstep(ctx.altKm, 0.8, 1.6) * (1 - THREE.MathUtils.smoothstep(ctx.altKm, 7.5, 9.5)) : 0;
    const puffs = 0.55 + 0.45 * Math.sin(timeSec * 0.9 + ctx.lonDeg * 40) * Math.sin(timeSec * 0.37 + ctx.latDeg * 31);
    let cloud = Math.max(inDeck * puffs * (kind === 'storm' ? 0.95 : 0.8), ctx.world === 'Earth' ? this.cloudInside : 0);
    const veilColor = this.veilMat.uniforms.uColor.value as THREE.Color;
    const light = 0.25 + 0.75 * ctx.daylight;
    if (kind === 'dust') {
      cloud = Math.max(cloud, strength * 0.55 * Math.min(1, ctx.airDensity * 60));
      veilColor.setRGB(0.72 * light, 0.48 * light, 0.3 * light);
    } else if (kind === 'acid') {
      cloud = Math.max(cloud, THREE.MathUtils.smoothstep(ctx.altKm, 45, 52) * (1 - THREE.MathUtils.smoothstep(ctx.altKm, 66, 72)) * 0.9);
      veilColor.setRGB(0.9 * light, 0.8 * light, 0.5 * light);
    } else if (kind === 'methane') {
      cloud = Math.max(cloud, 0.35);
      veilColor.setRGB(0.75 * light, 0.5 * light, 0.25 * light);
    } else if (kind === 'turbulence') {
      cloud = 0.1 + 0.16 * puffs;
      veilColor.setRGB(0.85 * light, 0.8 * light, 0.72 * light);
    } else {
      const grey = kind === 'storm' ? 0.28 : 0.8;
      veilColor.setRGB(grey * light, grey * light, (grey + 0.04) * light);
    }
    // Under the deck while it rains or snows: an overcast grey sky, not a clear one
    if (ctx.world === 'Earth' && kind !== 'clear' && !volumetric && ctx.altKm < 1.6) cloud = Math.max(cloud, (kind === 'storm' ? 0.42 : 0.28) * strength);
    st.cloud = cloud;

    // Lightning: thunderstorms, and the deep storms of Jupiter and Saturn
    const lightningWorld = kind === 'storm' || (kind === 'turbulence' && (ctx.world === 'Jupiter' || ctx.world === 'Saturn'));
    if (lightningWorld) {
      this.nextFlash -= dt;
      if (this.nextFlash <= 0) {
        this.flashT = 1;
        this.nextFlash = 2.5 + this.rand() * 7;
        this.onLightning?.(0.5 + this.rand() * 8);
      }
    }
    this.flashT = Math.max(0, this.flashT - dt * 5);
    st.flash = this.flashT > 0 ? this.flashT * (0.6 + 0.4 * Math.sin(this.flashT * 40)) : 0;
    st.shake = kind === 'storm' ? 0.35 : kind === 'turbulence' ? 0.4 : kind === 'dust' ? 0.15 * strength : kind === 'rain' ? 0.08 : 0;
    this.veilMat.uniforms.uAmount.value = cloud;
    this.veilMat.uniforms.uTime.value = timeSec;
    this.veilMat.uniforms.uFlash.value = st.flash;

    // Falling things, seen from a jet flying through them: the fall plus the air rushing past
    const falls = kind === 'rain' || kind === 'storm' || kind === 'methane';
    const snowing = kind === 'snow';
    const dusty = kind === 'dust';
    const fallMps = kind === 'methane' ? 1.6 : snowing ? 1.2 : dusty ? 0 : 9;
    const rel = this.tmp.copy(ctx.airVelMps).negate().addScaledVector(ctx.up, -fallMps);
    const shown = Math.min(rel.length(), 900);
    if (rel.lengthSq() > 0) rel.setLength(shown);
    const active = Math.round(N * strength * (kind === 'storm' ? 1 : 0.7));
    const stretch = falls ? 0.045 : 0.02;
    const tint = dusty ? [0.75, 0.5, 0.32] : kind === 'methane' ? [0.8, 0.6, 0.4] : [0.7, 0.78, 0.9];
    const base = (falls ? (kind === 'storm' ? 0.95 : 0.7) : dusty ? 0.35 : 0) * (0.35 + 0.65 * light);
    for (let i = 0; i < N; i++) {
      let x = this.pts[i * 3] + rel.x * dt;
      let y = this.pts[i * 3 + 1] + rel.y * dt;
      let z = this.pts[i * 3 + 2] + rel.z * dt;
      if (x < -BOX) x += BOX * 2; else if (x > BOX) x -= BOX * 2;
      if (y < -BOX) y += BOX * 2; else if (y > BOX) y -= BOX * 2;
      if (z < -BOX) z += BOX * 2; else if (z > BOX) z -= BOX * 2;
      this.pts[i * 3] = x;
      this.pts[i * 3 + 1] = y;
      this.pts[i * 3 + 2] = z;
      const o = i * 6;
      this.positions[o] = x;
      this.positions[o + 1] = y;
      this.positions[o + 2] = z;
      this.positions[o + 3] = x - rel.x * stretch;
      this.positions[o + 4] = y - rel.y * stretch;
      this.positions[o + 5] = z - rel.z * stretch;
      const a = i < active && (falls || dusty) ? base * (0.4 + 0.6 * ((i * 7919) % 97) / 97) : 0;
      this.colors[o] = this.colors[o + 1] = this.colors[o + 2] = 0;
      this.colors[o + 3] = tint[0] * a;
      this.colors[o + 4] = tint[1] * a;
      this.colors[o + 5] = tint[2] * a;
      this.flakePos[i * 3] = x;
      this.flakePos[i * 3 + 1] = y;
      this.flakePos[i * 3 + 2] = i < active && snowing ? z : 1e5;
    }
    this.streaks.geometry.attributes.position.needsUpdate = true;
    this.streaks.geometry.attributes.color.needsUpdate = true;
    this.flakes.geometry.attributes.position.needsUpdate = true;
    this.flakes.visible = snowing;
    this.flakeMat.opacity = 0.9 * light;

    // Canopy drops: beads appear and run back over the glass; only seen from inside
    const wet = ctx.inside && (falls || (snowing && ctx.altKm < 2)) ? strength : 0;
    const speed = ctx.airVelMps.length();
    for (let i = 0; i < this.dropAge.length; i++) {
      this.dropAge[i] += dt;
      if (this.dropAge[i] > 1.2 && this.rand() < wet * dt * 3) {
        this.dropAge[i] = 0;
        this.dropPos[i * 3] = (this.rand() - 0.5) * 0.9;
        this.dropPos[i * 3 + 1] = (this.rand() - 0.2) * 0.5;
        this.dropPos[i * 3 + 2] = -0.55;
      }
      if (this.dropAge[i] < 1.2) {
        // Airflow drags them up and out across the glass, faster at speed
        const run = Math.min(1.5, speed / 200) * dt * 0.35;
        this.dropPos[i * 3 + 1] += run;
        this.dropPos[i * 3] *= 1 + run * 0.8;
      } else {
        this.dropPos[i * 3 + 2] = 10;
      }
    }
    this.drops.position.set(0, 0, 0);
    this.drops.quaternion.copy(ctx.camera.quaternion);
    this.drops.geometry.attributes.position.needsUpdate = true;
    this.drops.visible = wet > 0;
    return st;
  }
  private tmp = new THREE.Vector3();

  public dispose(): void {
    this.streaks.geometry.dispose();
    this.streakMat.dispose();
    this.flakes.geometry.dispose();
    this.flakeMat.dispose();
    this.veil.geometry.dispose();
    this.veilMat.dispose();
    this.drops.geometry.dispose();
    this.dropMat.dispose();
    this.dropTex.dispose();
    this.flakeTex.dispose();
  }
}
