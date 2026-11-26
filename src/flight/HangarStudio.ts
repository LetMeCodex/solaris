import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { AIR } from '../rendering/AirProfiles';
import { perf } from '../rendering/Performance';
import {
  AIRFRAMES,
  AIRFRAME_KEY,
  GRIPEN_ANCHORS,
  SU30_ANCHORS,
  JetModel,
  type AirframeAnchors,
  type JetVisualState,
} from './JetModel';
import {
  JET_SKIN_BY_ID,
  chosenAirshowSmoke,
  chosenCanopyTint,
  chosenHoloAura,
  chosenJetSkin,
  setChosenAirshowSmoke,
  setChosenCanopyTint,
  setChosenHoloAura,
  setChosenJetSkin,
  type AirshowSmokeId,
  type CanopyTintId,
  type JetSkinId,
} from './JetSkins';
import { createJetSurfaceState } from './JetTelemetry';

export type HangarLightingPreset = 'hero' | 'studio';

export type HangarCameraPreset =
  | 'three_quarter'
  | 'top_planform'
  | 'tails'
  | 'nozzle'
  | 'cockpit'
  | 'orbit';

export interface HangarWorldSpec {
  id: string;
  label: string;
  subtitle: string;
  badge: string;
}

export const HANGAR_WORLDS: ReadonlyArray<HangarWorldSpec> = [
  { id: 'Earth', label: 'Earth', subtitle: 'Orbital Blue Limb · Clouds & Rayleigh Scatter', badge: 'TERRESTRIAL' },
  { id: 'Mars', label: 'Mars', subtitle: 'Rust Ochre Horizon · Thin Dust Haze', badge: 'ARID WORLD' },
  { id: 'Venus', label: 'Venus', subtitle: 'Dense Sulfuric Gold · Amber Cloud Deck', badge: 'SUPER-ROTATING' },
  { id: 'Titan', label: 'Titan', subtitle: 'Nitrogen Smog Haze · Burnt Saffron Limb', badge: 'SATURNIAN MOON' },
  { id: 'Saturn', label: 'Saturn', subtitle: 'Golden Gas Giant · Translucent Ring System', badge: 'RINGED GIANT' },
  { id: 'Jupiter', label: 'Jupiter', subtitle: 'Banded Ammonia Belts · Great Storm Limb', badge: 'GAS GIANT' },
  { id: 'Uranus', label: 'Uranus', subtitle: 'Cyan Methane Shell · Tilted Ice World', badge: 'ICE GIANT' },
  { id: 'Neptune', label: 'Neptune', subtitle: 'Deep Cobalt Methane · Supersonic High Clouds', badge: 'ICE GIANT' },
  { id: 'Observatory', label: 'Observatory', subtitle: 'Deep Space · Milky Way & Starlight', badge: 'DEEP SPACE' },
];

export interface HangarState {
  active: boolean;
  world: string;
  airframe: 'su30' | 'gripen';
  skin: JetSkinId;
  canopyTint: CanopyTintId;
  smoke: AirshowSmokeId;
  holoAura: boolean;
  lighting: HangarLightingPreset;
  cameraPreset: HangarCameraPreset;
  afterburner: number;
  gLoad: number;
  loading: boolean;
}

interface WorldMood {
  rimColor: THREE.Color;
  mistColor: THREE.Color;
  accentColor: THREE.Color;
  floorTint: THREE.Color;
  mistOpacity: number;
  rimIntensity: number;
}

interface CameraTargetPose {
  theta: number;
  phi: number;
  dist: number;
  target: THREE.Vector3;
  fov: number;
}

const EPOXY_REFLECTOR_SHADER = {
  name: 'SolarisHangarEpoxyReflector',
  uniforms: {
    color: { value: new THREE.Color(0x9cb4cf) },
    tDiffuse: { value: null as THREE.Texture | null },
    textureMatrix: { value: new THREE.Matrix4() },
    uFloorBase: { value: new THREE.Color(0x070a10) },
    uWorldTint: { value: new THREE.Color(0x4ea8ff) },
    uSkinAccent: { value: new THREE.Color(0xff6218) },
    uFresnelMin: { value: 0.24 },
    uFresnelMax: { value: 0.70 },
    uStudioBoost: { value: 0.0 },
    uBlurRadius: { value: 0.0022 },
    uTime: { value: 0 },
    uAfterburner: { value: 0 },
    uGLoad: { value: 1 },
    uPulseAge: { value: 99 },
    uPulseOriginXZ: { value: new THREE.Vector2(0, 0) },
  },
  vertexShader: /* glsl */ `
    uniform mat4 textureMatrix;
    varying vec4 vProjUv;
    varying vec3 vWorldPos;
    varying vec3 vLocalPos;
    void main() {
      vLocalPos = position;
      vec4 wp = modelMatrix * vec4(position, 1.0);
      vWorldPos = wp.xyz;
      vProjUv = textureMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec3 color;
    uniform vec3 uFloorBase;
    uniform vec3 uWorldTint;
    uniform vec3 uSkinAccent;
    uniform float uFresnelMin;
    uniform float uFresnelMax;
    uniform float uStudioBoost;
    uniform float uBlurRadius;
    uniform float uTime;
    uniform float uAfterburner;
    uniform float uGLoad;
    uniform float uPulseAge;
    uniform vec2 uPulseOriginXZ;
    varying vec4 vProjUv;
    varying vec3 vWorldPos;
    varying vec3 vLocalPos;

    vec3 sampleClean(vec4 pUv, vec2 offset) {
      vec4 q = pUv;
      q.xy += offset * pUv.w;
      vec3 c = texture2DProj(tDiffuse, q).rgb;
      return clamp(vec3(
        c.r >= 0.0 ? c.r : 0.0,
        c.g >= 0.0 ? c.g : 0.0,
        c.b >= 0.0 ? c.b : 0.0
      ), 0.0, 24.0);
    }

    void main() {
      vec3 refl = sampleClean(vProjUv, vec2(0.0)) * 0.36;
      refl += sampleClean(vProjUv, vec2( uBlurRadius,  uBlurRadius * 0.6)) * 0.16;
      refl += sampleClean(vProjUv, vec2(-uBlurRadius,  uBlurRadius * 0.6)) * 0.16;
      refl += sampleClean(vProjUv, vec2( uBlurRadius * 0.6, -uBlurRadius)) * 0.16;
      refl += sampleClean(vProjUv, vec2(-uBlurRadius * 0.6, -uBlurRadius)) * 0.16;

      vec3 V = normalize(cameraPosition - vWorldPos);
      float ndv = clamp(abs(V.y), 0.0, 1.0);
      float fresnel = mix(uFresnelMin, uFresnelMax, pow(1.0 - ndv, 2.0));

      float r = length(vLocalPos.xy);
      float poolGlow = exp(-(r * r) / (11.5 * 11.5));
      float turntableBand = smoothstep(11.35, 11.0, r);
      float outerFade = 1.0 - smoothstep(15.2, 18.0, r);

      // Reactive turntable perimeter ring harmonic + aft jet-blast thermal ripple + radial shockwave
      float gNorm = clamp((uGLoad - 1.0) / 8.0, 0.0, 1.0);
      float ringHarmonic = exp(-pow((r - 11.12) / 0.36, 2.0)) * (0.35 + 0.45 * sin(uTime * 2.4 - atan(vLocalPos.y, vLocalPos.x) * 3.0) * 0.5 + 0.65 * uAfterburner + 0.45 * gNorm);
      float jetBlastWave = smoothstep(4.5, 13.5, vWorldPos.z) * exp(-(vWorldPos.x * vWorldPos.x) / 9.5) * uAfterburner * (0.65 + 0.35 * sin(vWorldPos.z * 2.2 - uTime * 14.0));
      float dPulse = length(vWorldPos.xz - uPulseOriginXZ) - uPulseAge * 20.0;
      float pulseRing = exp(-dPulse * dPulse * 1.4) * exp(-uPulseAge * 1.25) * step(uPulseAge, 3.2);

      vec3 base = uFloorBase * (0.62 + 0.52 * poolGlow + 0.42 * uStudioBoost);
      base += uWorldTint * (0.018 + 0.025 * poolGlow) * turntableBand;
      base += mix(uWorldTint, uSkinAccent, 0.72) * (ringHarmonic * 0.14 + jetBlastWave * 0.32 + pulseRing * 0.52);

      vec3 col = base + refl * fresnel * color * mix(0.96, 1.12, uStudioBoost);
      col *= mix(0.76, 1.0, outerFade);
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

const WORLD_PALETTE_ACCENT: Record<string, { hex: number; mist: number; mistOp: number; rim: number }> = {
  Earth: { hex: 0x62b6ff, mist: 0x3b86d6, mistOp: 0.14, rim: 2.6 },
  Mars: { hex: 0xff8d52, mist: 0xd96b38, mistOp: 0.18, rim: 2.5 },
  Venus: { hex: 0xffd070, mist: 0xe8af4a, mistOp: 0.22, rim: 2.7 },
  Titan: { hex: 0xff9a38, mist: 0xd97324, mistOp: 0.24, rim: 2.5 },
  Saturn: { hex: 0xf7d794, mist: 0xd9b873, mistOp: 0.13, rim: 2.4 },
  Jupiter: { hex: 0xf0ad78, mist: 0xc98455, mistOp: 0.14, rim: 2.5 },
  Uranus: { hex: 0x72ebe4, mist: 0x4bc2bd, mistOp: 0.16, rim: 2.5 },
  Neptune: { hex: 0x5292ff, mist: 0x346cd6, mistOp: 0.16, rim: 2.6 },
  Observatory: { hex: 0x99b8ff, mist: 0x2a3b68, mistOp: 0.03, rim: 2.1 },
};

function computeWorldMood(worldId: string): WorldMood {
  const pal = WORLD_PALETTE_ACCENT[worldId] ?? WORLD_PALETTE_ACCENT.Earth;
  const air = AIR[worldId];
  const rim = new THREE.Color(pal.hex);
  if (air) {
    // Blend measured Rayleigh/Mie chromaticity from AirProfiles into the palette rim
    const rSum = air.rayleigh[0] + air.rayleigh[1] + air.rayleigh[2];
    const rayCol =
      rSum > 1e-6
        ? new THREE.Color(air.rayleigh[0] / rSum, air.rayleigh[1] / rSum, air.rayleigh[2] / rSum).multiplyScalar(1.6)
        : new THREE.Color(pal.hex);
    const mieCol = new THREE.Color(air.mieTint[0], air.mieTint[1], air.mieTint[2]);
    const atmoCol = rayCol.lerp(mieCol, 0.55);
    rim.lerp(atmoCol, 0.35);
  }
  const mist = new THREE.Color(pal.mist);
  const accent = rim.clone().lerp(new THREE.Color(0xffffff), 0.18);
  const floorTint = rim.clone().lerp(new THREE.Color(0x8bb6e8), 0.35);
  return {
    rimColor: rim,
    mistColor: mist,
    accentColor: accent,
    floorTint,
    mistOpacity: pal.mistOp,
    rimIntensity: pal.rim,
  };
}

function initialHangarAirframe(): 'su30' | 'gripen' {
  try {
    const v = globalThis.localStorage?.getItem(AIRFRAME_KEY);
    if (v === 'gripen' || v === 'su30') return v;
  } catch {
    /* ignore storage error */
  }
  return 'su30';
}

export function resolveHangarWorld(name?: string | null): string {
  if (!name) return 'Earth';
  const low = name.trim().toLowerCase();
  const hit = HANGAR_WORLDS.find((w) => w.id.toLowerCase() === low);
  return hit ? hit.id : 'Earth';
}

/**
 * Dedicated 3D Aerospace Hangar Studio rendered through LensPipeline's overlay pass while the
 * live 3D Solaris world shines outside the panoramic airlock behind the jet.
 */
export class HangarStudio {
  public readonly scene = new THREE.Scene();
  public readonly camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 200);

  private state: HangarState = {
    active: false,
    world: 'Earth',
    airframe: initialHangarAirframe(),
    skin: chosenJetSkin(),
    canopyTint: chosenCanopyTint(),
    smoke: chosenAirshowSmoke(),
    holoAura: chosenHoloAura(),
    lighting: 'hero',
    cameraPreset: 'three_quarter',
    afterburner: 0,
    gLoad: 1,
    loading: false,
  };

  private listeners = new Set<(s: HangarState) => void>();
  private disposables: Array<{ dispose(): void }> = [];
  private disposed = false;

  // Aircraft & ground rigs
  private jetMount = new THREE.Group();
  private chockRigGroup = new THREE.Group();
  private modelCache: Partial<Record<'su30' | 'gripen', JetModel>> = {};
  private activeModel: JetModel | null = null;
  private loadToken = 0;
  private snapGearOnNextUpdate = false;
  private groundShadowMat!: THREE.MeshBasicMaterial;
  private groundShadowMesh!: THREE.Mesh;

  // Hangar architecture groups
  private reflector!: Reflector;
  private reflectionBackdrop!: THREE.Mesh;
  private reflectionBackdropMat!: THREE.MeshBasicMaterial;
  private overheadRoofGroup = new THREE.Group();
  private softboxMats: THREE.MeshBasicMaterial[] = [];
  private worldAccentMats: THREE.MeshBasicMaterial[] = [];
  private airlockTrimMats: THREE.MeshBasicMaterial[] = [];
  private deckMistMat!: THREE.MeshBasicMaterial;
  private airlockGlassMat!: THREE.MeshPhysicalMaterial;

  // Studio Lights & Per-World PMREM Reflections
  private keyLight!: THREE.DirectionalLight;
  private rimLight!: THREE.DirectionalLight;
  private fillHemi!: THREE.HemisphereLight;
  private underFillL!: THREE.PointLight;
  private underFillR!: THREE.PointLight;
  private abGlowLight!: THREE.PointLight;
  private worldEnvCache = new Map<string, THREE.WebGLRenderTarget>();
  private floorPulseAge = 99;
  private readonly raycaster = new THREE.Raycaster();
  private readonly ptrNdc = new THREE.Vector2();
  private pointerDownClient = new Map<number, { x: number; y: number }>();

  // Camera & pointer interaction state
  private dom: HTMLElement | null = null;
  private activePointers = new Map<number, { x: number; y: number }>();
  private pinchDist = 0;
  private curTheta = -Math.PI * 0.85;
  private curPhi = THREE.MathUtils.degToRad(84.5);
  private curDist = 16.6;
  private curTarget = new THREE.Vector3(0, 2.3, -1.0);
  private curFov = 42;
  private targetTheta = -Math.PI * 0.85;
  private targetPhi = THREE.MathUtils.degToRad(84.5);
  private targetDist = 16.6;
  private targetAim = new THREE.Vector3(0, 2.3, -1.0);
  private targetFov = 42;
  private readonly surfacesScratch = createJetSurfaceState();
  private readonly rendererRef: THREE.WebGLRenderer | null;
  private eqChockMat!: THREE.MeshStandardMaterial;
  private eqRubberMat!: THREE.MeshStandardMaterial;
  private eqSteelMat!: THREE.MeshStandardMaterial;
  private eqCartMat!: THREE.MeshStandardMaterial;
  private eqScreenMat!: THREE.MeshBasicMaterial;

  constructor(renderer?: THREE.WebGLRenderer) {
    this.rendererRef = renderer ?? null;
    this.scene.add(this.jetMount);
    this.scene.add(this.chockRigGroup);
    this.buildLights();
    this.buildArchitecture();
    this.applyWorldMood(this.state.world);
    this.applyLightingPreset(this.state.lighting);
    this.snapCameraToPreset('three_quarter', true);
  }

  // ------------------------------------------------------------------ public API

  public getState(): HangarState {
    return { ...this.state };
  }

  public subscribe(fn: (s: HangarState) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit(): void {
    const snapshot = this.getState();
    for (const fn of this.listeners) fn(snapshot);
  }

  public isActive(): boolean {
    return this.state.active;
  }

  public ensureEnvironment(renderer: THREE.WebGLRenderer, worldId = this.state.world, lighting = this.state.lighting): void {
    const key = `${worldId}|${lighting}`;
    const existing = this.worldEnvCache.get(key);
    if (existing) {
      this.scene.environment = existing.texture;
      return;
    }

    const mood = computeWorldMood(worldId);
    const hero = lighting === 'hero';
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    const es = new THREE.Scene();
    const bgCol = hero
      ? new THREE.Color(0x05070c).lerp(mood.mistColor, 0.08)
      : new THREE.Color(0x222630).lerp(mood.mistColor, 0.05);
    es.background = bgCol;

    const domeGeo = new THREE.SphereGeometry(24, 24, 16);
    const domeMat = new THREE.MeshBasicMaterial({
      color: bgCol.clone().multiplyScalar(hero ? 1.35 : 1.75),
      side: THREE.BackSide,
    });
    es.add(new THREE.Mesh(domeGeo, domeMat));

    const stripGeo = new THREE.PlaneGeometry(20, 2.2);
    const stripMat = new THREE.MeshBasicMaterial({
      color: hero
        ? new THREE.Color(1.55, 1.58, 1.64)
        : new THREE.Color(1.75, 1.78, 1.84),
      side: THREE.DoubleSide,
    });
    for (const sx of [-6.5, 0, 6.5]) {
      const s = new THREE.Mesh(stripGeo, stripMat);
      s.position.set(sx, 11.8, 0);
      s.rotation.x = Math.PI / 2;
      es.add(s);
    }

    const sidePanelGeo = new THREE.PlaneGeometry(18, 4.6);
    const sideMat = new THREE.MeshBasicMaterial({
      color: hero
        ? new THREE.Color(0.32, 0.36, 0.44).lerp(mood.rimColor, 0.25)
        : new THREE.Color(1.15, 1.18, 1.24).lerp(mood.accentColor, 0.10),
      side: THREE.DoubleSide,
    });
    for (const sx of [-16, 16]) {
      const p = new THREE.Mesh(sidePanelGeo, sideMat);
      p.position.set(sx, 4.0, 0);
      p.rotation.y = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
      es.add(p);
    }

    // World atmosphere planetary arc reflected cleanly down the fuselage & wings
    const backMat = new THREE.MeshBasicMaterial({
      color: hero
        ? mood.rimColor.clone().multiplyScalar(0.78)
        : mood.rimColor.clone().lerp(new THREE.Color(0xffffff), 0.30).multiplyScalar(0.72),
      side: THREE.DoubleSide,
    });
    const back = new THREE.Mesh(new THREE.PlaneGeometry(26, 10), backMat);
    back.position.set(0, 5.2, 16);
    back.rotation.y = Math.PI;
    es.add(back);

    const rt = pmrem.fromScene(es, 0.042);
    domeGeo.dispose();
    domeMat.dispose();
    stripGeo.dispose();
    stripMat.dispose();
    sidePanelGeo.dispose();
    sideMat.dispose();
    back.geometry.dispose();
    backMat.dispose();
    pmrem.dispose();

    this.worldEnvCache.set(key, rt);
    this.scene.environment = rt.texture;
  }

  public enter(dom: HTMLElement, worldName?: string): void {
    const resolvedWorld = resolveHangarWorld(worldName ?? this.state.world);
    this.state.active = true;
    this.state.world = resolvedWorld;
    // Sync persisted cosmetics cleanly on entry
    this.state.skin = chosenJetSkin();
    this.state.canopyTint = chosenCanopyTint();
    this.state.smoke = chosenAirshowSmoke();
    this.state.holoAura = chosenHoloAura();

    this.applyWorldMood(resolvedWorld);
    this.applyLightingPreset(this.state.lighting);
    if (this.rendererRef) this.ensureEnvironment(this.rendererRef, resolvedWorld, this.state.lighting);
    this.attachDom(dom);
    this.resize(dom.clientWidth || window.innerWidth, dom.clientHeight || window.innerHeight);
    this.snapCameraToPreset(this.state.cameraPreset, true);
    void this.ensureAirframe(this.state.airframe);
    this.emit();
  }

  public exit(): void {
    if (!this.state.active) return;
    this.state.active = false;
    this.detachDom();
    this.emit();
  }

  public setWorld(worldName: string): void {
    const w = resolveHangarWorld(worldName);
    if (w === this.state.world) return;
    this.state.world = w;
    this.applyWorldMood(w);
    this.triggerPulse();
    this.emit();
  }

  public setAirframe(airframe: 'su30' | 'gripen'): void {
    if (airframe !== 'su30' && airframe !== 'gripen') return;
    if (this.state.airframe === airframe && this.activeModel) return;
    this.state.airframe = airframe;
    try {
      globalThis.localStorage?.setItem(AIRFRAME_KEY, airframe);
    } catch {
      /* ignore storage errors */
    }
    this.snapCameraToPreset(this.state.cameraPreset, false);
    void this.ensureAirframe(airframe);
    this.emit();
  }

  public setSkin(skin: JetSkinId): void {
    this.state.skin = skin;
    setChosenJetSkin(skin);
    this.activeModel?.setSkin(skin);
    this.syncReflectorAccent();
    this.triggerPulse();
    this.emit();
  }

  public setHoloAura(on: boolean): void {
    this.state.holoAura = on;
    setChosenHoloAura(on);
    this.activeModel?.setHoloAuraEnabled(on);
    if (on) this.triggerPulse();
    this.emit();
  }

  public triggerPulse(worldPoint?: THREE.Vector3): void {
    this.floorPulseAge = 0;
    const reflMat = this.reflector.material as THREE.ShaderMaterial;
    if (reflMat.uniforms?.uPulseOriginXZ) {
      reflMat.uniforms.uPulseOriginXZ.value.set(worldPoint?.x ?? 0, worldPoint?.z ?? -1.5);
    }
    this.activeModel?.triggerSkinPulse(worldPoint, Boolean(worldPoint));
  }

  private syncReflectorAccent(): void {
    const spec = JET_SKIN_BY_ID[this.state.skin] ?? JET_SKIN_BY_ID.flame_phantom;
    const reflMat = this.reflector.material as THREE.ShaderMaterial;
    if (reflMat.uniforms?.uSkinAccent) {
      reflMat.uniforms.uSkinAccent.value.setHex(spec.accentHex);
    }
  }

  public setCanopyTint(tint: CanopyTintId): void {
    this.state.canopyTint = tint;
    setChosenCanopyTint(tint);
    this.activeModel?.setCanopyTint(tint);
    this.emit();
  }

  public setSmoke(smoke: AirshowSmokeId): void {
    this.state.smoke = smoke;
    setChosenAirshowSmoke(smoke);
    this.triggerPulse();
    this.emit();
  }

  public setLighting(lighting: HangarLightingPreset): void {
    if (lighting !== 'hero' && lighting !== 'studio') return;
    this.state.lighting = lighting;
    this.applyLightingPreset(lighting);
    this.emit();
  }

  public setCameraPreset(preset: HangarCameraPreset): void {
    this.state.cameraPreset = preset;
    this.snapCameraToPreset(preset, false);
    this.emit();
  }

  public setAfterburner(ab: number): void {
    const prev = this.state.afterburner;
    const next = THREE.MathUtils.clamp(Number.isFinite(ab) ? ab : 0, 0, 1);
    this.state.afterburner = next;
    if (next >= 0.5 && prev < 0.5) this.triggerPulse();
    this.emit();
  }

  public setGLoad(g: number): void {
    const prev = this.state.gLoad;
    const next = THREE.MathUtils.clamp(Number.isFinite(g) ? g : 1, 1, 9);
    this.state.gLoad = next;
    if (next >= 6.0 && prev < 6.0) this.triggerPulse();
    this.emit();
  }

  public resize(width: number, height: number): void {
    const w = Math.max(1, width);
    const h = Math.max(1, height);
    const aspect = w / h;
    if (Math.abs(this.camera.aspect - aspect) > 1e-4) {
      this.camera.aspect = aspect;
      this.camera.updateProjectionMatrix();
    }
  }

  public update(dt: number, timeSec: number): void {
    if (!this.state.active) return;
    const clampedDt = Math.min(Math.max(dt, 0), 0.1);
    if (this.floorPulseAge < 50) this.floorPulseAge += clampedDt;

    // Gentle orbit motion when Orbit preset is active and user isn't dragging
    if (this.state.cameraPreset === 'orbit' && this.activePointers.size === 0) {
      this.targetTheta += clampedDt * 0.18;
    }

    const damp = 1 - Math.exp(-8.5 * clampedDt);
    this.curTheta += (this.targetTheta - this.curTheta) * damp;
    this.curPhi += (this.targetPhi - this.curPhi) * damp;
    this.curDist += (this.targetDist - this.curDist) * damp;
    this.curTarget.lerp(this.targetAim, damp);
    this.curFov += (this.targetFov - this.curFov) * damp;

    const sinPhi = Math.sin(this.curPhi);
    const cosPhi = Math.cos(this.curPhi);
    const camX = this.curTarget.x + this.curDist * sinPhi * Math.sin(this.curTheta);
    const camY = Math.max(0.42, this.curTarget.y + this.curDist * cosPhi);
    const camZ = this.curTarget.z + this.curDist * sinPhi * Math.cos(this.curTheta);

    this.camera.position.set(camX, camY, camZ);
    this.camera.lookAt(this.curTarget);
    if (Math.abs(this.camera.fov - this.curFov) > 0.02) {
      this.camera.fov = this.curFov;
      this.camera.updateProjectionMatrix();
    }
    this.camera.updateMatrixWorld();

    // Hide overhead ceiling baffles during high overhead top-planform inspection
    this.overheadRoofGroup.visible = camY < 13.0;

    // Subtle animated specular sweep + ceiling highlight pulse so glossy clearcoat feels alive continuously!
    const sweepWave = Math.sin(timeSec * 0.48);
    const baseKeyX = this.state.lighting === 'hero' ? -12 : -8;
    this.keyLight.position.x = baseKeyX + sweepWave * 3.4;
    for (let i = 0; i < this.softboxMats.length; i++) {
      const stripPulse = 0.86 + 0.14 * Math.sin(timeSec * 1.1 - i * 0.85);
      const baseMul = this.state.lighting === 'hero' ? 2.0 : 2.35;
      this.softboxMats[i].color.setRGB(baseMul * stripPulse, (baseMul + 0.1) * stripPulse, (baseMul + 0.25) * stripPulse);
    }

    // Update live aircraft preview + epoxy reflector deck uniforms
    const ab = this.state.afterburner;
    const g = this.state.gLoad;
    const mood = computeWorldMood(this.state.world);
    const reflMat = this.reflector.material as THREE.ShaderMaterial;
    if (reflMat.uniforms) {
      reflMat.uniforms.uTime.value = timeSec;
      reflMat.uniforms.uAfterburner.value = ab;
      reflMat.uniforms.uGLoad.value = g;
      reflMat.uniforms.uPulseAge.value = this.floorPulseAge;
    }

    this.abGlowLight.intensity = ab > 0.02 ? 2.5 + ab * 26.0 : 0.25;
    this.abGlowLight.color.setRGB(1.0, 0.42 + 0.34 * ab, 0.1 + 0.25 * ab);
    const abPosZ = this.state.airframe === 'su30' ? 8.2 : 6.4;
    this.abGlowLight.position.set(0, this.state.airframe === 'su30' ? 1.7 : 1.4, abPosZ);

    if (this.activeModel) {
      const s = this.surfacesScratch;
      s.gear = 1;
      s.nozzleIris = 0.16 + 0.84 * ab;
      s.flapLeftRad = 0.08 + ab * 0.03 * Math.sin(timeSec * 3.2);
      s.flapRightRad = 0.08 + ab * 0.03 * Math.sin(timeSec * 3.2);
      s.elevonLeftRad = 0.04;
      s.elevonRightRad = 0.04;
      s.canardRad = -0.05;
      s.slat = 0.15;
      s.airbrake = 0;

      const throttle = ab > 0.01 ? 0.28 + 0.72 * ab : 0.06;
      const airspeedMps = 210 * (0.28 + 0.72 * ab) + (g - 1) * 32;
      this.activeModel.setSkinCameraWorld(this.camera.position);
      this.activeModel.setWorldTint(mood.rimColor);
      const visual: JetVisualState = {
        dt: this.snapGearOnNextUpdate ? 0 : clampedDt,
        surfaces: s,
        aoaDeg: 0,
        mach: 0.32 + 1.15 * ab,
        gLoad: g,
        airDensity: 1,
        qPa: 0,
        abStage: ab >= 0.75 ? 3 : ab >= 0.4 ? 2 : ab >= 0.12 ? 1 : 0,
        boost: ab,
        airspeedMps,
        ambientDarkness: this.state.lighting === 'hero' ? 0.52 : 0.15,
        maneuverJerk: ab * 0.35 + Math.max(0, g - 1) * 0.08,
        onGround: true,
        groundSpeedMs: 0,
      };
      this.snapGearOnNextUpdate = false;
      this.activeModel.update(timeSec, throttle, ab, 0, visual);
      this.activeModel.setInsideView(false);
      this.activeModel.setPilotVisible(true);
      this.activeModel.crew.visible = false;
      if (this.activeModel.crewHead) this.activeModel.crewHead.visible = false;
    }
  }

  // ------------------------------------------------------------------ airframe & chocks

  private async ensureAirframe(id: 'su30' | 'gripen'): Promise<void> {
    const token = ++this.loadToken;
    const anchors: AirframeAnchors = id === 'su30' ? SU30_ANCHORS : GRIPEN_ANCHORS;
    const cached = this.modelCache[id];
    if (cached) {
      this.activateModel(id, cached, anchors);
      this.state.loading = false;
      this.emit();
      return;
    }

    this.state.loading = true;
    this.emit();

    const model = new JetModel();
    model.setSkin(this.state.skin);
    model.setCanopyTint(this.state.canopyTint);
    model.setHoloAuraEnabled(this.state.holoAura);

    const url = import.meta.env.BASE_URL + AIRFRAMES[id].url;
    try {
      await model.loadAirframe(url, anchors);
    } catch (err) {
      console.warn('[Solaris Hangar] airframe load failed, using built-in fallback:', err);
      model.showBuiltIn();
    }

    if (this.disposed) {
      model.dispose();
      return;
    }

    this.modelCache[id] = model;
    if (token !== this.loadToken) return;

    this.activateModel(id, model, anchors);
    this.state.loading = false;
    this.emit();
  }

  private activateModel(id: 'su30' | 'gripen', model: JetModel, anchors: AirframeAnchors): void {
    for (const [key, m] of Object.entries(this.modelCache)) {
      if (m && key !== id) m.root.visible = false;
    }
    if (model.root.parent !== this.jetMount) {
      this.jetMount.add(model.root);
    }
    model.root.visible = true;
    model.setSkin(this.state.skin);
    model.setCanopyTint(this.state.canopyTint);
    model.setHoloAuraEnabled(this.state.holoAura);
    model.setInsideView(false);
    model.setPilotVisible(true);
    model.crew.visible = false;
    this.syncReflectorAccent();

    // Ground the extended wheels + 0.06 m oleo squat flush onto y = 0 turntable
    const wheelY = anchors.wheelAnchors?.nose.y ?? -2.25;
    this.jetMount.position.set(0, -wheelY - 0.06, 0);
    this.jetMount.updateMatrixWorld(true);

    // Fit ambient grounding shadow footprint to the airframe
    if (id === 'su30') {
      this.groundShadowMesh.scale.set(16.2, 22.8, 1);
      this.groundShadowMesh.position.set(0, 0.006, 0.3);
    } else {
      this.groundShadowMesh.scale.set(9.4, 15.0, 1);
      this.groundShadowMesh.position.set(0, 0.006, 0.5);
    }

    this.rebuildGroundEquipment(id, anchors);
    this.activeModel = model;
    this.snapGearOnNextUpdate = true;
  }

  private rebuildGroundEquipment(id: 'su30' | 'gripen', anchors: AirframeAnchors): void {
    while (this.chockRigGroup.children.length > 0) {
      const ch = this.chockRigGroup.children[0];
      this.chockRigGroup.remove(ch);
      ch.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          (o as THREE.Mesh).geometry.dispose();
        }
      });
    }

    const chockMat = this.eqChockMat;
    const rubberMat = this.eqRubberMat;
    const steelMat = this.eqSteelMat;
    const cartMat = this.eqCartMat;
    const screenMat = this.eqScreenMat;

    const wa = anchors.wheelAnchors;
    if (wa) {
      const wheelSpots: Array<{ pos: THREE.Vector3; rad: number; width: number }> = [
        { pos: wa.nose, rad: 0.22, width: 0.32 },
        { pos: wa.mainL, rad: 0.34, width: 0.36 },
        { pos: wa.mainR, rad: 0.34, width: 0.36 },
      ];
      for (const ws of wheelSpots) {
        for (const dir of [-1, 1] as const) {
          const wedge = new THREE.Mesh(new THREE.BoxGeometry(ws.width, 0.14, 0.2), chockMat);
          wedge.position.set(ws.pos.x, 0.07, ws.pos.z + dir * (ws.rad + 0.09));
          wedge.rotation.x = dir * -0.22;
          wedge.castShadow = true;
          wedge.receiveShadow = true;
          this.chockRigGroup.add(wedge);

          const pad = new THREE.Mesh(new THREE.BoxGeometry(ws.width * 1.04, 0.03, 0.24), rubberMat);
          pad.position.set(ws.pos.x, 0.015, ws.pos.z + dir * (ws.rad + 0.1));
          this.chockRigGroup.add(pad);
        }
      }
    }

    // Ground Power Unit (GPU) + service cart parked off the 11.45 m turntable on the starboard-forward perimeter apron
    const cartX = id === 'su30' ? 13.8 : 11.8;
    const cartZ = id === 'su30' ? -11.5 : -9.0;
    const cart = new THREE.Group();
    cart.position.set(cartX, 0, cartZ);
    cart.rotation.y = -0.52;

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.92, 2.3), cartMat);
    body.position.y = 0.64;
    body.castShadow = true;
    body.receiveShadow = true;
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.12, 2.42), steelMat);
    bumper.position.y = 0.22;
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.26), screenMat);
    panel.position.set(-0.785, 0.78, 0.35);
    panel.rotation.y = -Math.PI / 2;
    panel.userData.noAO = true;
    cart.add(body, bumper, panel);

    for (const wx of [-0.65, 0.65]) {
      for (const wz of [-0.75, 0.75]) {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 14), rubberMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.18, wz);
        wheel.castShadow = true;
        cart.add(wheel);
      }
    }
    this.chockRigGroup.add(cart);

    // Compact dark aerospace maintenance stand parked off the 11.45 m turntable on the port-forward perimeter apron
    const standX = id === 'su30' ? -13.6 : -11.6;
    const standZ = id === 'su30' ? -10.5 : -8.5;
    const stand = new THREE.Group();
    stand.position.set(standX, 0, standZ);
    stand.rotation.y = 0.48;
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 1.75), steelMat);
    base.position.y = 0.08;
    const deck = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.06, 1.18), cartMat);
    deck.position.set(0, 1.28, -0.15);
    deck.castShadow = true;
    const deckRim = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.03, 1.22), steelMat);
    deckRim.position.set(0, 1.24, -0.15);
    stand.add(base, deck, deckRim);
    for (const sx of [-0.45, 0.45]) {
      for (const sz of [-0.66, 0.36]) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 1.24, 8), steelMat);
        post.position.set(sx, 0.68, sz);
        post.castShadow = true;
        stand.add(post);
      }
    }
    this.chockRigGroup.add(stand);
  }

  // ------------------------------------------------------------------ 3D Hangar architecture

  private buildLights(): void {
    this.keyLight = new THREE.DirectionalLight(0xf6f9ff, 2.7);
    this.keyLight.position.set(-11, 16, -12);
    this.keyLight.castShadow = perf.settings.shadowMap > 0;
    const sm = Math.max(512, perf.settings.shadowMap || 1024);
    this.keyLight.shadow.mapSize.set(sm, sm);
    const sc = this.keyLight.shadow.camera;
    sc.left = -15;
    sc.right = 15;
    sc.top = 15;
    sc.bottom = -15;
    sc.near = 2;
    sc.far = 48;
    sc.updateProjectionMatrix();
    this.keyLight.shadow.bias = -0.0002;
    this.keyLight.shadow.normalBias = 0.035;
    this.keyLight.shadow.radius = 2.4;
    this.scene.add(this.keyLight);

    this.rimLight = new THREE.DirectionalLight(0x62b6ff, 1.6);
    this.rimLight.position.set(10, 12, 24);
    this.scene.add(this.rimLight);

    this.fillHemi = new THREE.HemisphereLight(0xa3c2e0, 0x161c26, 0.9);
    this.scene.add(this.fillHemi);

    this.underFillL = new THREE.PointLight(0xd9e8ff, 1.6, 26, 1.2);
    this.underFillL.position.set(-5.2, 0.65, 0.2);
    this.underFillR = new THREE.PointLight(0xd9e8ff, 1.6, 26, 1.2);
    this.underFillR.position.set(5.2, 0.65, 0.2);
    this.abGlowLight = new THREE.PointLight(0xff7a2a, 0.25, 22, 1.5);
    this.abGlowLight.position.set(0, 1.7, 8.2);
    this.scene.add(this.underFillL, this.underFillR, this.abGlowLight);
  }

  private buildArchitecture(): void {
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x141922, roughness: 0.62, metalness: 0.62 });
    const ribMat = new THREE.MeshStandardMaterial({ color: 0x1d2431, roughness: 0.45, metalness: 0.78 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x2a3342, roughness: 0.42, metalness: 0.75 });
    const cautionMat = new THREE.MeshStandardMaterial({ color: 0xd49626, roughness: 0.48, metalness: 0.25 });
    const grilleMat = new THREE.MeshStandardMaterial({ color: 0x090c11, roughness: 0.78, metalness: 0.45 });
    this.eqChockMat = new THREE.MeshStandardMaterial({ color: 0xe29a1e, roughness: 0.45, metalness: 0.2 });
    this.eqRubberMat = new THREE.MeshStandardMaterial({ color: 0x15181d, roughness: 0.9, metalness: 0.05 });
    this.eqSteelMat = new THREE.MeshStandardMaterial({ color: 0x3b424d, roughness: 0.48, metalness: 0.72 });
    this.eqCartMat = new THREE.MeshStandardMaterial({ color: 0x1c222c, roughness: 0.55, metalness: 0.58 });
    this.eqScreenMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.25, 1.5, 2.2) });
    this.disposables.push(
      wallMat,
      ribMat,
      trimMat,
      cautionMat,
      grilleMat,
      this.eqChockMat,
      this.eqRubberMat,
      this.eqSteelMat,
      this.eqCartMat,
      this.eqScreenMat,
    );

    const track = <T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(obj: T): T => {
      this.disposables.push(obj);
      return obj;
    };

    // 1. Outer structural deck floor (below reflector outer perimeter)
    const outerDeck = new THREE.Mesh(track(new THREE.BoxGeometry(52, 0.2, 54)), wallMat);
    outerDeck.position.set(0, -0.125, 0);
    outerDeck.receiveShadow = true;
    this.scene.add(outerDeck);

    // 2. Wet-Epoxy Reflective Circular Turntable
    const reflRes = perf.tier === 'high' ? 1024 : perf.tier === 'medium' ? 768 : 512;
    const reflGeo = track(new THREE.CircleGeometry(18.0, 96));
    this.reflector = new Reflector(reflGeo, {
      textureWidth: reflRes,
      textureHeight: reflRes,
      clipBias: 0.003,
      color: 0xb2c6de,
      multisample: 0,
      shader: EPOXY_REFLECTOR_SHADER,
    });
    this.reflector.rotation.x = -Math.PI / 2;
    this.reflector.position.set(0, 0, -0.5);
    this.reflector.userData.noAO = true;
    this.scene.add(this.reflector);

    // Hidden world-glow strip rendered ONLY inside Reflector pass so outside planet atmosphere mirrors onto epoxy floor
    this.reflectionBackdropMat = track(
      new THREE.MeshBasicMaterial({ color: 0x5599dd, side: THREE.DoubleSide }),
    );
    this.reflectionBackdrop = new THREE.Mesh(
      track(new THREE.PlaneGeometry(42, 16)),
      this.reflectionBackdropMat,
    );
    this.reflectionBackdrop.position.set(0, 6.2, 27.5);
    this.reflectionBackdrop.visible = false;
    this.reflectionBackdrop.userData.noAO = true;
    this.scene.add(this.reflectionBackdrop);

    const origBeforeRender = this.reflector.onBeforeRender;
    this.reflector.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
      if (scene.overrideMaterial) return;
      this.reflectionBackdrop.visible = true;
      try {
        origBeforeRender.call(this.reflector, renderer, scene, camera, geometry, material, group);
      } finally {
        this.reflectionBackdrop.visible = false;
      }
    };

    // 3. Tactical Turntable Markings Texture Overlay
    const deckTex = track(this.createTurntableDeckTexture());
    const deckOverlay = new THREE.Mesh(
      track(new THREE.CircleGeometry(18.0, 96)),
      track(
        new THREE.MeshBasicMaterial({
          map: deckTex,
          transparent: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -1,
        }),
      ),
    );
    deckOverlay.rotation.x = -Math.PI / 2;
    deckOverlay.position.set(0, 0.004, -0.5);
    deckOverlay.userData.noAO = true;
    this.scene.add(deckOverlay);

    // 4. Soft Ambient Contact Grounding Shadow Disc beneath aircraft
    const shadowTex = track(this.createShadowDiscTexture());
    this.groundShadowMat = track(
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.56,
        depthWrite: false,
      }),
    );
    this.groundShadowMesh = new THREE.Mesh(track(new THREE.PlaneGeometry(1, 1)), this.groundShadowMat);
    this.groundShadowMesh.rotation.x = -Math.PI / 2;
    this.groundShadowMesh.position.set(0, 0.006, 0.3);
    this.groundShadowMesh.userData.noAO = true;
    this.scene.add(this.groundShadowMesh);

    // 5. Recessed Turntable Perimeter Curb Ring & 12 Flush Deck LED Pucks
    const curbRing = new THREE.Mesh(track(new THREE.RingGeometry(11.15, 11.45, 96)), trimMat);
    curbRing.rotation.x = -Math.PI / 2;
    curbRing.position.set(0, 0.008, -0.5);
    curbRing.userData.noAO = true;
    this.scene.add(curbRing);

    const ledPuckGeo = track(new THREE.BoxGeometry(0.48, 0.025, 0.14));
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const mat = track(new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5, 1.5, 2.5) }));
      this.worldAccentMats.push(mat);
      const puck = new THREE.Mesh(ledPuckGeo, mat);
      puck.position.set(Math.sin(a) * 11.3, 0.014, -0.5 + Math.cos(a) * 11.3);
      puck.rotation.y = a;
      puck.userData.noAO = true;
      this.scene.add(puck);
    }

    // 6. Aft Exhaust Blast Trench Grate behind tail nozzles (+Z)
    const trenchGroup = new THREE.Group();
    trenchGroup.position.set(0, 0.005, 13.6);
    const trenchBed = new THREE.Mesh(track(new THREE.BoxGeometry(6.6, 0.02, 7.2)), grilleMat);
    trenchGroup.add(trenchBed);
    const louverGeo = track(new THREE.BoxGeometry(6.2, 0.045, 0.12));
    for (let i = -14; i <= 14; i++) {
      const louver = new THREE.Mesh(louverGeo, ribMat);
      louver.position.set(0, 0.015, i * 0.24);
      louver.rotation.x = -0.35;
      trenchGroup.add(louver);
    }
    for (const sx of [-3.35, 3.35]) {
      const rail = new THREE.Mesh(track(new THREE.BoxGeometry(0.16, 0.03, 7.4)), cautionMat);
      rail.position.set(sx, 0.012, 0);
      trenchGroup.add(rail);
    }
    this.scene.add(trenchGroup);

    // 7. Vaulted Aerospace Rib Trusses, Side Acoustic Walls & Recessed Vent Grilles
    const bayHalfW = 24.5;
    const zStations = [-20, -13.5, -7, -0.5, 6, 12.5, 19];
    const colGeo = track(new THREE.BoxGeometry(0.95, 8.6, 0.9));
    const haunchGeo = track(new THREE.BoxGeometry(0.82, 7.8, 0.8));
    const topBeamGeo = track(new THREE.BoxGeometry(22.5, 0.78, 0.82));

    for (const z of zStations) {
      for (const side of [-1, 1] as const) {
        const col = new THREE.Mesh(colGeo, ribMat);
        col.position.set(side * (bayHalfW - 0.5), 4.3, z);
        col.receiveShadow = true;
        this.scene.add(col);

        const haunch = new THREE.Mesh(haunchGeo, ribMat);
        haunch.position.set(side * (bayHalfW - 3.8), 11.4, z);
        haunch.rotation.z = side * 0.68;
        this.scene.add(haunch);
      }
      // Overhead cross-span beam (hidden automatically when viewing top_planform)
      const beam = new THREE.Mesh(topBeamGeo, ribMat);
      beam.position.set(0, 14.5, z);
      this.overheadRoofGroup.add(beam);
    }

    // Side knee-walls, upper wall cladding & recessed ventilation grilles
    const lowerWallGeo = track(new THREE.BoxGeometry(0.6, 2.2, 49));
    const upperWallGeo = track(new THREE.BoxGeometry(0.55, 6.8, 49));
    const stripeGeo = track(new THREE.BoxGeometry(0.68, 0.16, 49));
    const ventFrameGeo = track(new THREE.BoxGeometry(0.3, 2.1, 4.6));
    const ventSlatGeo = track(new THREE.BoxGeometry(0.36, 0.08, 4.3));

    for (const side of [-1, 1] as const) {
      const xWall = side * bayHalfW;
      const lw = new THREE.Mesh(lowerWallGeo, wallMat);
      lw.position.set(xWall, 1.1, 0);
      lw.receiveShadow = true;
      const uw = new THREE.Mesh(upperWallGeo, wallMat);
      uw.position.set(xWall, 5.6, 0);
      const stripe = new THREE.Mesh(stripeGeo, cautionMat);
      stripe.position.set(xWall - side * 0.06, 2.25, 0);
      this.scene.add(lw, uw, stripe);

      // Side longitudinal purlin beams
      const purlin = new THREE.Mesh(track(new THREE.BoxGeometry(0.7, 0.55, 49)), trimMat);
      purlin.position.set(xWall - side * 0.6, 9.0, 0);
      this.scene.add(purlin);

      // Recessed backlit ventilation grilles along each bay
      for (const vz of [-10.2, 2.8, 15.8]) {
        const ventBg = new THREE.Mesh(ventFrameGeo, grilleMat);
        ventBg.position.set(xWall - side * 0.25, 4.4, vz);
        this.scene.add(ventBg);

        const glowMat = track(new THREE.MeshBasicMaterial({ color: new THREE.Color(0.35, 0.9, 1.5) }));
        this.worldAccentMats.push(glowMat);
        const ventStrip = new THREE.Mesh(track(new THREE.BoxGeometry(0.12, 0.09, 4.3)), glowMat);
        ventStrip.position.set(xWall - side * 0.34, 5.55, vz);
        ventStrip.userData.noAO = true;
        this.scene.add(ventStrip);

        for (let k = -3; k <= 3; k++) {
          const slat = new THREE.Mesh(ventSlatGeo, trimMat);
          slat.position.set(xWall - side * 0.35, 4.4 + k * 0.24, vz);
          slat.rotation.z = side * 0.32;
          this.scene.add(slat);
        }
      }
    }

    // Side roof haunch baffles + overhead Linear LED Softbox Strips
    const sideRoofGeo = track(new THREE.BoxGeometry(11.2, 0.35, 49));
    for (const side of [-1, 1] as const) {
      const sr = new THREE.Mesh(sideRoofGeo, wallMat);
      sr.position.set(side * 18.0, 12.4, 0);
      sr.rotation.z = side * 0.58;
      this.scene.add(sr);
    }

    const centerBaffle = new THREE.Mesh(track(new THREE.BoxGeometry(22, 0.35, 49)), wallMat);
    centerBaffle.position.set(0, 14.9, 0);
    this.overheadRoofGroup.add(centerBaffle);

    // Parallel Overhead Linear LED Softbox Light Fixtures (mirrored vividly on turntable floor!)
    const housingGeo = track(new THREE.BoxGeometry(0.75, 0.26, 26));
    const diffuserGeo = track(new THREE.PlaneGeometry(0.58, 25.4));
    for (const sx of [-9.2, -4.6, 0, 4.6, 9.2]) {
      const housing = new THREE.Mesh(housingGeo, trimMat);
      housing.position.set(sx, 12.8, -0.5);
      const sm = track(new THREE.MeshBasicMaterial({ color: new THREE.Color(2.9, 3.1, 3.4) }));
      this.softboxMats.push(sm);
      const diffuser = new THREE.Mesh(diffuserGeo, sm);
      diffuser.rotation.x = Math.PI / 2;
      diffuser.position.set(sx, 12.66, -0.5);
      diffuser.userData.noAO = true;
      if (Math.abs(sx) < 6.0) {
        this.overheadRoofGroup.add(housing, diffuser);
      } else {
        this.scene.add(housing, diffuser);
      }
    }
    this.scene.add(this.overheadRoofGroup);

    // 8. Massive Panoramic Airlock Aperture at +Z (z = +24.8 m)
    const aftZ = 24.8;
    const pierGeo = track(new THREE.BoxGeometry(3.4, 13.6, 2.0));
    for (const side of [-1, 1] as const) {
      const pier = new THREE.Mesh(pierGeo, ribMat);
      pier.position.set(side * 23.0, 6.8, aftZ);
      this.scene.add(pier);

      // Angled armoured corner gusset mullions at outer viewport frame
      const strut = new THREE.Mesh(track(new THREE.BoxGeometry(0.55, 6.8, 0.9)), trimMat);
      strut.position.set(side * 19.6, 10.6, aftZ);
      strut.rotation.z = side * 0.68;
      this.scene.add(strut);

      // Recessed architectural airlock perimeter accent strip (kept subtle so it never blooms into a vertical pole)
      const airlockLedMat = track(new THREE.MeshBasicMaterial({ color: new THREE.Color(0.24, 0.48, 0.78) }));
      this.airlockTrimMats.push(airlockLedMat);
      const ledBar = new THREE.Mesh(track(new THREE.BoxGeometry(0.06, 11.4, 0.08)), airlockLedMat);
      ledBar.position.set(side * 21.38, 6.2, aftZ - 0.55);
      ledBar.userData.noAO = true;
      this.scene.add(ledBar);
    }
    const aftSill = new THREE.Mesh(track(new THREE.BoxGeometry(44, 0.56, 1.8)), ribMat);
    aftSill.position.set(0, 0.28, aftZ);
    const aftLintel = new THREE.Mesh(track(new THREE.BoxGeometry(48, 2.4, 2.2)), ribMat);
    aftLintel.position.set(0, 14.2, aftZ);
    this.scene.add(aftSill, aftLintel);

    // Subtle energy/armoured glass pane across the panoramic airlock (lets live planet shine right through)
    this.airlockGlassMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xaad4ff,
        transparent: true,
        opacity: 0.04,
        roughness: 0.06,
        metalness: 0.1,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    const glassPane = new THREE.Mesh(track(new THREE.PlaneGeometry(43.0, 12.8)), this.airlockGlassMat);
    glassPane.position.set(0, 6.8, aftZ);
    glassPane.userData.noAO = true;
    glassPane.renderOrder = 2;
    this.scene.add(glassPane);

    // 9. Forward Launch Aperture at -Z (z = -24.8 m) with retracted blast-gate leaves
    const fwdZ = -24.8;
    const leafGeo = track(new THREE.BoxGeometry(7.2, 12.4, 1.8));
    for (const side of [-1, 1] as const) {
      const leaf = new THREE.Mesh(leafGeo, wallMat);
      leaf.position.set(side * 21.0, 6.2, fwdZ);
      this.scene.add(leaf);

      const stripMat = track(new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5, 1.5, 2.4) }));
      this.worldAccentMats.push(stripMat);
      const gateGlow = new THREE.Mesh(track(new THREE.BoxGeometry(0.14, 10.8, 0.14)), stripMat);
      gateGlow.position.set(side * 17.3, 5.8, fwdZ + 0.9);
      gateGlow.userData.noAO = true;
      this.scene.add(gateGlow);
    }
    const fwdLintel = new THREE.Mesh(track(new THREE.BoxGeometry(48, 2.6, 2.2)), ribMat);
    fwdLintel.position.set(0, 14.2, fwdZ);
    this.scene.add(fwdLintel);

    // 10. World-Adaptive Atmospheric Deck Mist Ring
    const mistTex = track(this.createMistRingTexture());
    this.deckMistMat = track(
      new THREE.MeshBasicMaterial({
        map: mistTex,
        color: 0x3b86d6,
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    const mistRing = new THREE.Mesh(track(new THREE.PlaneGeometry(40, 40)), this.deckMistMat);
    mistRing.rotation.x = -Math.PI / 2;
    mistRing.position.set(0, 0.03, 1.5);
    mistRing.userData.noAO = true;
    this.scene.add(mistRing);
  }

  private createTurntableDeckTexture(): THREE.CanvasTexture {
    const S = 2048;
    const c = document.createElement('canvas');
    c.width = c.height = S;
    const ctx = c.getContext('2d') as CanvasRenderingContext2D;
    const cx = S / 2;
    const cy = S / 2;
    const pxPerM = S / 36; // 18 m radius => 36 m diameter
    ctx.clearRect(0, 0, S, S);

    // Subtle radial seam rings
    const ring = (rM: number, stroke: string, widthPx: number, dash: number[] = []): void => {
      ctx.save();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = widthPx;
      ctx.setLineDash(dash);
      ctx.beginPath();
      ctx.arc(cx, cy, rM * pxPerM, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    ring(11.12, 'rgba(226, 158, 42, 0.72)', 5);
    ring(10.85, 'rgba(116, 198, 255, 0.34)', 2.5, [28, 18]);
    ring(8.2, 'rgba(255, 255, 255, 0.14)', 2, [16, 22]);
    ring(5.2, 'rgba(116, 198, 255, 0.16)', 1.5);

    // Degree tick marks around outer turntable ring
    for (let deg = 0; deg < 360; deg += 5) {
      const a = (deg * Math.PI) / 180;
      const major = deg % 30 === 0;
      const mid = deg % 15 === 0;
      const r0 = (major ? 10.35 : mid ? 10.58 : 10.72) * pxPerM;
      const r1 = 10.95 * pxPerM;
      ctx.strokeStyle = major ? 'rgba(245, 248, 255, 0.65)' : 'rgba(160, 190, 220, 0.32)';
      ctx.lineWidth = major ? 3 : 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.sin(a) * r0, cy + Math.cos(a) * r0);
      ctx.lineTo(cx + Math.sin(a) * r1, cy + Math.cos(a) * r1);
      ctx.stroke();
    }

    // Nose-to-tail tactical alignment axis (note canvas Y down corresponds to +Z on rotated floor)
    ctx.strokeStyle = 'rgba(226, 158, 42, 0.55)';
    ctx.lineWidth = 4;
    ctx.setLineDash([26, 18]);
    ctx.beginPath();
    ctx.moveTo(cx, cy - 10.4 * pxPerM);
    ctx.lineTo(cx, cy + 10.4 * pxPerM);
    ctx.stroke();
    ctx.setLineDash([]);

    // Forward nose alignment chevron (-Z => -Y in canvas)
    ctx.strokeStyle = 'rgba(116, 198, 255, 0.65)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 0.85 * pxPerM, cy - 7.8 * pxPerM);
    ctx.lineTo(cx, cy - 9.0 * pxPerM);
    ctx.lineTo(cx + 0.85 * pxPerM, cy - 7.8 * pxPerM);
    ctx.stroke();

    // Aft jet-blast danger arc (+Z => +Y in canvas)
    ctx.save();
    ctx.strokeStyle = 'rgba(232, 92, 46, 0.68)';
    ctx.lineWidth = 6;
    ctx.setLineDash([18, 14]);
    ctx.beginPath();
    ctx.arc(cx, cy, 9.6 * pxPerM, Math.PI * 0.28, Math.PI * 0.72);
    ctx.stroke();
    ctx.restore();

    // Crisp bay callouts
    ctx.fillStyle = 'rgba(225, 234, 246, 0.44)';
    ctx.font = '700 24px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SOLARIS HANGAR · BAY 01', cx, cy - 9.45 * pxPerM);
    ctx.fillStyle = 'rgba(232, 162, 54, 0.56)';
    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.fillText('CAUTION · JET BLAST CORRIDOR', cx, cy + 9.25 * pxPerM);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }

  private createShadowDiscTexture(): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d') as CanvasRenderingContext2D;
    const g = ctx.createRadialGradient(128, 128, 18, 128, 128, 124);
    g.addColorStop(0, 'rgba(0, 0, 0, 0.82)');
    g.addColorStop(0.42, 'rgba(0, 0, 0, 0.52)');
    g.addColorStop(0.75, 'rgba(0, 0, 0, 0.16)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }

  private createMistRingTexture(): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d') as CanvasRenderingContext2D;
    const g = ctx.createRadialGradient(128, 128, 42, 128, 128, 126);
    g.addColorStop(0, 'rgba(255, 255, 255, 0)');
    g.addColorStop(0.55, 'rgba(255, 255, 255, 0.35)');
    g.addColorStop(0.82, 'rgba(255, 255, 255, 0.72)');
    g.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }

  // ------------------------------------------------------------------ mood & lighting

  private applyWorldMood(worldId: string): void {
    const mood = computeWorldMood(worldId);
    this.rimLight.color.copy(mood.rimColor);
    this.rimLight.intensity =
      this.state.lighting === 'hero' ? mood.rimIntensity : mood.rimIntensity * 0.75;

    this.deckMistMat.color.copy(mood.mistColor);
    this.deckMistMat.opacity =
      this.state.lighting === 'hero' ? mood.mistOpacity : mood.mistOpacity * 0.5;

    this.airlockGlassMat.color.copy(mood.accentColor);
    this.reflectionBackdropMat.color.copy(mood.rimColor).multiplyScalar(0.85);

    for (const m of this.worldAccentMats) {
      m.color.copy(mood.accentColor).multiplyScalar(1.15);
    }
    for (const m of this.airlockTrimMats) {
      m.color.copy(mood.accentColor).multiplyScalar(0.45);
    }

    const reflMat = this.reflector.material as THREE.ShaderMaterial;
    if (reflMat.uniforms?.uWorldTint) {
      reflMat.uniforms.uWorldTint.value.copy(mood.floorTint);
    }
    this.syncReflectorAccent();
    this.activeModel?.setWorldTint(mood.rimColor);
    if (this.rendererRef && this.state.active) {
      this.ensureEnvironment(this.rendererRef, worldId, this.state.lighting);
    }
    this.applyLightingPreset(this.state.lighting);
  }

  private applyLightingPreset(preset: HangarLightingPreset): void {
    const mood = computeWorldMood(this.state.world);
    const reflMat = this.reflector.material as THREE.ShaderMaterial;
    if (preset === 'hero') {
      this.keyLight.position.set(-12, 13.5, -13);
      this.keyLight.color.setHex(0xf4f8ff);
      this.keyLight.intensity = 1.45;
      this.rimLight.intensity = mood.rimIntensity * 0.34;
      this.fillHemi.color.copy(mood.rimColor).lerp(new THREE.Color(0x9fbce0), 0.55);
      this.fillHemi.groundColor.setHex(0x161b25);
      this.fillHemi.intensity = 0.68;
      this.underFillL.intensity = 0.95;
      this.underFillR.intensity = 0.95;
      for (const sm of this.softboxMats) sm.color.setRGB(1.9, 2.0, 2.15);
      if (reflMat.uniforms?.uStudioBoost) reflMat.uniforms.uStudioBoost.value = 0.0;
    } else {
      this.keyLight.position.set(-8, 17, -11);
      this.keyLight.color.setHex(0xffffff);
      this.keyLight.intensity = 1.68;
      this.rimLight.intensity = mood.rimIntensity * 0.30;
      this.fillHemi.color.setHex(0xf4f8ff);
      this.fillHemi.groundColor.setHex(0x465062);
      this.fillHemi.intensity = 1.15;
      this.underFillL.intensity = 1.48;
      this.underFillR.intensity = 1.48;
      for (const sm of this.softboxMats) sm.color.setRGB(2.15, 2.25, 2.38);
      if (reflMat.uniforms?.uStudioBoost) reflMat.uniforms.uStudioBoost.value = 1.0;
    }
    if (this.rendererRef && this.state.active) {
      this.ensureEnvironment(this.rendererRef, this.state.world, preset);
    }
  }

  // ------------------------------------------------------------------ camera presets & pointer controls

  private presetPose(preset: HangarCameraPreset): CameraTargetPose {
    const su = this.state.airframe === 'su30';
    switch (preset) {
      case 'top_planform':
        return {
          theta: -Math.PI * 0.5,
          phi: 0.04,
          dist: su ? 26.2 : 18.4,
          target: new THREE.Vector3(0, su ? 1.85 : 1.35, su ? -1.7 : -0.1),
          fov: 48,
        };
      case 'tails':
        return {
          theta: Math.PI * 0.24,
          phi: THREE.MathUtils.degToRad(72),
          dist: su ? 14.4 : 10.6,
          target: new THREE.Vector3(0, su ? 2.45 : 1.8, su ? 3.2 : 2.1),
          fov: 42,
        };
      case 'nozzle':
        return {
          theta: -Math.PI * 0.14,
          phi: THREE.MathUtils.degToRad(82),
          dist: su ? 7.8 : 6.0,
          target: new THREE.Vector3(0, su ? 1.75 : 1.4, su ? 6.1 : 4.7),
          fov: 44,
        };
      case 'cockpit':
        return {
          theta: -Math.PI * 0.78,
          phi: THREE.MathUtils.degToRad(81),
          dist: su ? 6.9 : 5.4,
          target: new THREE.Vector3(0, su ? 2.55 : 1.85, su ? -6.4 : -4.4),
          fov: 38,
        };
      case 'orbit':
        return {
          theta: this.curTheta,
          phi: THREE.MathUtils.degToRad(83.5),
          dist: su ? 18.4 : 13.4,
          target: new THREE.Vector3(0, su ? 1.75 : 1.4, su ? -1.8 : -0.4),
          fov: 43,
        };
      case 'three_quarter':
      default:
        return {
          theta: -Math.PI * 0.84,
          phi: THREE.MathUtils.degToRad(84.5),
          dist: su ? 18.8 : 13.6,
          target: new THREE.Vector3(su ? -0.5 : -0.3, su ? 1.45 : 1.25, su ? -2.8 : -1.2),
          fov: 43,
        };
    }
  }

  private snapCameraToPreset(preset: HangarCameraPreset, immediate: boolean): void {
    const p = this.presetPose(preset);
    this.targetTheta = p.theta;
    this.targetPhi = p.phi;
    this.targetDist = p.dist;
    this.targetAim.copy(p.target);
    this.targetFov = p.fov;
    if (immediate) {
      this.curTheta = p.theta;
      this.curPhi = p.phi;
      this.curDist = p.dist;
      this.curTarget.copy(p.target);
      this.curFov = p.fov;
      this.camera.fov = p.fov;
      this.camera.updateProjectionMatrix();
    }
  }

  private isCanvasHit(target: EventTarget | null): boolean {
    if (!target || !this.dom) return false;
    return target === this.dom || (target instanceof HTMLCanvasElement && this.dom.contains(target));
  }

  private attachDom(dom: HTMLElement): void {
    if (this.dom === dom) return;
    this.detachDom();
    this.dom = dom;
    dom.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
    dom.addEventListener('wheel', this.onWheel, { passive: false });
  }

  private detachDom(): void {
    if (!this.dom) return;
    this.dom.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
    this.dom.removeEventListener('wheel', this.onWheel);
    this.activePointers.clear();
    this.pointerDownClient.clear();
    this.pinchDist = 0;
    this.dom = null;
  }

  private onPointerDown = (e: PointerEvent): void => {
    if (!this.state.active || !this.isCanvasHit(e.target)) return;
    if (e.button !== 0 && e.button !== 2 && e.pointerType === 'mouse') return;
    this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    this.pointerDownClient.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.activePointers.size === 2) {
      const pts = Array.from(this.activePointers.values());
      this.pinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    }
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (!this.state.active || !this.activePointers.has(e.pointerId)) return;
    const prev = this.activePointers.get(e.pointerId)!;
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    prev.x = e.clientX;
    prev.y = e.clientY;

    if (this.activePointers.size === 1) {
      this.targetTheta -= dx * 0.0065;
      this.targetPhi = THREE.MathUtils.clamp(this.targetPhi - dy * 0.0055, 0.035, Math.PI * 0.478);
    } else if (this.activePointers.size >= 2) {
      const pts = Array.from(this.activePointers.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (this.pinchDist > 8 && dist > 8) {
        this.targetDist = THREE.MathUtils.clamp(this.targetDist * (this.pinchDist / dist), 4.2, 22.0);
      }
      this.pinchDist = dist;
    }
  };

  private onPointerUp = (e: PointerEvent): void => {
    const start = this.pointerDownClient.get(e.pointerId);
    this.pointerDownClient.delete(e.pointerId);
    this.activePointers.delete(e.pointerId);
    if (this.activePointers.size < 2) this.pinchDist = 0;

    // Clean click on aircraft triggers an interactive 3D radial shockwave from that exact hit point!
    if (start && this.dom && this.activeModel && e.button === 0) {
      const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y);
      if (moved < 6) {
        const rect = this.dom.getBoundingClientRect();
        this.ptrNdc.set(
          ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1,
          -(((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1),
        );
        this.raycaster.setFromCamera(this.ptrNdc, this.camera);
        const hits = this.raycaster.intersectObject(this.jetMount, true);
        if (hits.length > 0) {
          this.triggerPulse(hits[0].point);
        } else {
          this.triggerPulse();
        }
      }
    }
  };

  private onWheel = (e: WheelEvent): void => {
    if (!this.state.active) return;
    e.preventDefault();
    this.targetDist = THREE.MathUtils.clamp(this.targetDist * Math.exp(e.deltaY * 0.001), 4.2, 22.0);
  };

  public dispose(): void {
    this.disposed = true;
    this.detachDom();
    this.reflector.dispose();
    for (const m of Object.values(this.modelCache)) {
      m?.dispose();
    }
    this.modelCache = {};
    this.activeModel = null;
    for (const rt of this.worldEnvCache.values()) {
      rt.dispose();
    }
    this.worldEnvCache.clear();
    for (const d of this.disposables) d.dispose();
    this.disposables = [];
    this.listeners.clear();
  }
}
