import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import {
  createFacadeMaterials,
  createTimesSquareBillboards,
  createTimesSquareGroundMaterial,
} from './TimesSquareTextures';
import { buildTimesSquareArchitecture, type ColliderBox } from './TimesSquareHeroLandmarks';
import { buildTimesSquareLivingWorld, TimesSquareAudio } from './TimesSquareLivingWorld';

export type WalkTimePreset = 'midnight' | 'bluehour' | 'golden' | 'daylight';
export type WalkWeatherPreset = 'wet' | 'rain' | 'clear' | 'snow';

export interface WalkViewpoint {
  id: number;
  label: string;
  subtitle: string;
  x: number;
  z: number;
  yaw: number;   // 0 = looking South (+Z toward One Times Square), PI = looking North (-Z toward Duffy Sq / 2 TSQ)
  pitch: number; // radians (+ up, - down)
}

export const TIMES_SQUARE_VIEWPOINTS: WalkViewpoint[] = [
  {
    id: 1,
    label: 'Duffy Square Plaza',
    subtitle: '46th St & Broadway · Looking South to One Times Square',
    x: -16.8,
    z: -142.8,
    yaw: 0.08,
    pitch: 0.11,
  },
  {
    id: 2,
    label: 'Top of Red TKTS Stairs',
    subtitle: '27th Glass Step · Iconic Bowtie Panorama',
    x: -20.5,
    z: -176.2,
    yaw: 0.14,
    pitch: -0.01,
  },
  {
    id: 3,
    label: 'Broadway & 45th Plaza',
    subtitle: 'Marriott Marquis 330ft Screen & 1540 Broadway',
    x: -15.2,
    z: -66.0,
    yaw: 0.14,
    pitch: 0.12,
  },
  {
    id: 4,
    label: '43rd St · NASDAQ & One TSQ',
    subtitle: '7-Story NASDAQ Cylinder, Armed Forces Pavilion & One TSQ',
    x: -2.5,
    z: 76.0,
    yaw: 0.28,
    pitch: 0.14,
  },
  {
    id: 5,
    label: '47th & 7th · TKTS & 2 TSQ',
    subtitle: 'Translucent Red Glass TKTS Stairs & Coca-Cola 2 Times Square',
    x: 3.5,
    z: -140.0,
    yaw: -2.46,
    pitch: 0.14,
  },
];

export interface WalkTelemetry {
  fps: number;
  x: number;
  y: number;
  z: number;
  lat: number;
  lon: number;
  timePreset: WalkTimePreset;
  weatherPreset: WalkWeatherPreset;
  locked: boolean;
  muted: boolean;
  streetLabel: string;
  drawCalls: number;
}

const TIME_ORDER: WalkTimePreset[] = ['midnight', 'bluehour', 'golden', 'daylight'];
const WEATHER_ORDER: WalkWeatherPreset[] = ['wet', 'rain', 'clear', 'snow'];

const TIME_CONFIGS: Record<
  WalkTimePreset,
  {
    night: number;
    skyZenith: string;
    skyHorizon: string;
    skyGlow: string;
    fogColor: string;
    fogDensity: number;
    sunColor: string;
    sunIntensity: number;
    sunPos: [number, number, number];
    hemiSky: string;
    hemiGround: string;
    hemiInt: number;
    bloomStrength: number;
    exposure: number;
  }
> = {
  midnight: {
    night: 1.0,
    skyZenith: '#060a18',
    skyHorizon: '#1c213c',
    skyGlow: '#422254',
    fogColor: '#0c1022',
    fogDensity: 0.0018,
    sunColor: '#a6c0ff',
    sunIntensity: 0.42,
    sunPos: [-60, 120, -90],
    hemiSky: '#3b426b',
    hemiGround: '#3d2238',
    hemiInt: 0.92,
    bloomStrength: 0.28,
    exposure: 0.98,
  },
  bluehour: {
    night: 0.68,
    skyZenith: '#0c1e4a',
    skyHorizon: '#423d68',
    skyGlow: '#b85450',
    fogColor: '#1b1f38',
    fogDensity: 0.0016,
    sunColor: '#ff8e5e',
    sunIntensity: 1.25,
    sunPos: [-160, 34, 60],
    hemiSky: '#5674b8',
    hemiGround: '#342638',
    hemiInt: 1.08,
    bloomStrength: 0.24,
    exposure: 0.98,
  },
  golden: {
    night: 0.0,
    skyZenith: '#244a8c',
    skyHorizon: '#ff9244',
    skyGlow: '#ffb468',
    fogColor: '#b88264',
    fogDensity: 0.0011,
    sunColor: '#ff9c42',
    sunIntensity: 6.4,
    // Slicing diagonally down the Broadway/45th-46th Bowtie gap so Duffy Square gets blazing sunlit granite + razor-crisp building & monument shadows!
    sunPos: [-92, 86, 138],
    hemiSky: '#a89288',
    hemiGround: '#3e2d22',
    hemiInt: 0.68,
    bloomStrength: 0.16,
    exposure: 1.05,
  },
  daylight: {
    night: 0.0,
    skyZenith: '#2868c2',
    skyHorizon: '#bdd8f2',
    skyGlow: '#deebf8',
    fogColor: '#94adc8',
    fogDensity: 0.0011,
    sunColor: '#fff6e8',
    sunIntensity: 3.8,
    sunPos: [95, 160, 75],
    hemiSky: '#c4ddf8',
    hemiGround: '#606670',
    hemiInt: 1.55,
    bloomStrength: 0.10,
    exposure: 1.02,
  },
};

const FilmicWalkShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uExposure: { value: 1.08 },
    uVignette: { value: 0.36 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uExposure;
    uniform float uVignette;
    varying vec2 vUv;

    // Float-safe Dave Hoskins PCG hash (ZERO diagonal ANGLE/D3D11 banding stripes!)
    float hash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    // Subtle corner chromatic aberration + crisp filmic contrast + banding-free cinema micro-grain
    void main() {
      vec2 dc = vUv - 0.5;
      float r2 = dot(dc, dc);
      vec2 caOff = dc * r2 * 0.0040;
      float cr = texture2D(tDiffuse, vUv + caOff).r;
      float cg = texture2D(tDiffuse, vUv).g;
      float cb = texture2D(tDiffuse, vUv - caOff).b;
      vec3 col = vec3(cr, cg, cb) * uExposure;

      // Highlight-protected vibrance + crisp S-curve contrast
      float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
      float maxC = max(col.r, max(col.g, col.b));
      float sat = maxC > 1e-4 ? (maxC - min(col.r, min(col.g, col.b))) / maxC : 0.0;
      float vib = 1.0 + 0.16 * (1.0 - sat * 0.65);
      col = mix(vec3(lum), col, vib);

      // Gentle optical vignette
      float vig = 1.0 - smoothstep(0.22, 0.92, r2 * 2.4) * uVignette;
      col *= vig;

      // Banding-free cinema sensor grain & anti-quantization dithering
      float grain = hash12(gl_FragCoord.xy + vec2(fract(uTime * 1.37) * 512.0, fract(uTime * 2.13) * 512.0)) - 0.5;
      col += grain * 0.0095;

      gl_FragColor = vec4(max(col, 0.0), 1.0);
    }
  `,
};

export class TimesSquareScene {
  private readonly container: HTMLElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly reflCamera: THREE.PerspectiveCamera;
  private readonly reflTarget: THREE.WebGLRenderTarget;
  private readonly reflClipPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.02);
  private readonly envNightRT: THREE.WebGLRenderTarget;
  private readonly envDayRT: THREE.WebGLRenderTarget;
  private readonly groundMesh: THREE.Mesh;
  private readonly composer: EffectComposer;
  private readonly bloomPass: UnrealBloomPass;
  private readonly gradePass: ShaderPass;
  private readonly skyMat: THREE.ShaderMaterial;
  private readonly sunLight: THREE.DirectionalLight;
  private readonly hemiLight: THREE.HemisphereLight;
  private readonly neonLights: Array<{ light: THREE.PointLight; baseInt: number; phase: number }> = [];

  private readonly facades: ReturnType<typeof createFacadeMaterials>;
  private readonly billboards: ReturnType<typeof createTimesSquareBillboards>;
  private readonly ground: ReturnType<typeof createTimesSquareGroundMaterial>;
  private readonly arch: ReturnType<typeof buildTimesSquareArchitecture>;
  private readonly living: ReturnType<typeof buildTimesSquareLivingWorld>;
  private readonly audio = new TimesSquareAudio();

  private timePreset: WalkTimePreset = 'midnight';
  private weatherPreset: WalkWeatherPreset = 'wet';
  private muted = false;
  private locked = false;
  private started = false;

  // Player FPS state (eye height = 1.72 m above ground / TKTS step)
  private pos = new THREE.Vector3(-16.2, 1.72, -151.0);
  private yaw = 0.08; // +Z South = 0; look dir = (sin(yaw), 0, cos(yaw))
  private pitch = 0.09;
  private targetYaw = 0.08;
  private targetPitch = 0.09;
  private bobPhase = 0;
  private velY = 0;
  private readonly keys = new Set<string>();
  private dragging = false;
  private lastDragX = 0;
  private lastDragY = 0;

  private rafId = 0;
  private lastT = 0;
  private elapsed = 0;
  private fpsFrames = 0;
  private fpsAccum = 0;
  private fps = 60;
  private frameIndex = 0;
  private forceReflNext = true;
  private lastHudPush = 0;
  private disposed = false;

  // Scratch vectors & matrices (zero GC in animation loop!)
  private readonly _fwd = new THREE.Vector3();
  private readonly _right = new THREE.Vector3();
  private readonly _move = new THREE.Vector3();
  private readonly _lookTarget = new THREE.Vector3();
  private readonly _reflLookTarget = new THREE.Vector3();
  private readonly _reflMatrix = new THREE.Matrix4();

  private onTelemetry?: (t: WalkTelemetry) => void;

  constructor(container: HTMLElement, onTelemetry?: (t: WalkTelemetry) => void) {
    this.container = container;
    this.onTelemetry = onTelemetry;

    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);

    this.renderer = new THREE.WebGLRenderer({
      antialias: false, // Post-processing active
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    this.renderer.setSize(w, h);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2('#0b0e1d', 0.0021);

    this.camera = new THREE.PerspectiveCamera(62, w / h, 0.15, 1100);
    this.reflCamera = new THREE.PerspectiveCamera(62, w / h, 0.15, 950);
    // Layer 1 ONLY for reflection pass — excludes 300+ pedestrians, bollards, rain & furniture for silky 60+ FPS!
    this.reflCamera.layers.set(1);
    this.reflTarget = new THREE.WebGLRenderTarget(320, 200, {
      type: THREE.HalfFloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true,
      stencilBuffer: false,
    });

    // Build atmospheric banding-free Manhattan sky dome (4-octave FBM clouds + Mie sun halo + blue-noise dithering)
    this.skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uZenith: { value: new THREE.Color('#060a18') },
        uHorizon: { value: new THREE.Color('#1c213c') },
        uGlow: { value: new THREE.Color('#422254') },
        uSunDir: { value: new THREE.Vector3(-0.6, 0.3, 0.4).normalize() },
        uTime: { value: 0 },
        uNight: { value: 1.0 },
      },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uZenith;
        uniform vec3 uHorizon;
        uniform vec3 uGlow;
        uniform vec3 uSunDir;
        uniform float uTime;
        uniform float uNight;
        varying vec3 vDir;

        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }
        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
          for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p = m * p * 2.02 + vec2(5.1, 9.7);
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec3 d = normalize(vDir);
          float h = clamp(d.y, 0.0, 1.0);
          vec3 col = mix(uHorizon, uZenith, pow(h, 0.50));

          // Midtown Manhattan urban light-pollution glow + warm golden solar Mie scatter
          float glowBand = exp(-h * 4.2);
          col += uGlow * glowBand * (0.48 + 0.32 * uNight);

          float sunAmt = max(dot(d, normalize(uSunDir)), 0.0);
          float day = 1.0 - uNight;
          col += vec3(1.0, 0.72, 0.42) * pow(sunAmt, 10.0) * 0.55 * day;
          col += vec3(1.0, 0.92, 0.78) * pow(sunAmt, 140.0) * 1.15 * day;

          // Smooth high-altitude Manhattan clouds catching Times Square city glow or Golden Hour sun
          if (h > 0.04) {
            vec2 cuv = d.xz / (h + 0.28) * 1.15 + vec2(uTime * 0.006, uTime * 0.003);
            float cl = fbm(cuv * 1.85);
            float cm = smoothstep(0.42, 0.78, cl) * smoothstep(0.04, 0.26, h);
            vec3 cDay = mix(vec3(0.95, 0.88, 0.80), vec3(1.0, 0.78, 0.55), pow(sunAmt, 2.0));
            vec3 cNight = uGlow * 0.58 + vec3(0.11, 0.13, 0.24);
            vec3 cLit = mix(cDay, cNight, uNight);
            col = mix(col, cLit, cm * mix(0.44, 0.30, uNight));
          }

          // Float-safe PCG dithering — completely eliminates 8-bit sky banding with ZERO diagonal stripes!
          vec3 dp3 = fract(vec3(gl_FragCoord.xyx) * 0.1031);
          dp3 += dot(dp3, dp3.yzx + 33.33);
          float dither = fract((dp3.x + dp3.y) * dp3.z);
          col += (dither - 0.5) / 145.0;

          gl_FragColor = vec4(max(col, 0.0), 1.0);
        }
      `,
    });
    const skyDome = new THREE.Mesh(new THREE.SphereGeometry(900, 40, 24), this.skyMat);
    skyDome.frustumCulled = false;
    skyDome.layers.enable(1);
    this.scene.add(skyDome);

    // Dual Procedural PMREM City Reflection Maps (Midnight Neon + Warm Manhattanhenge Golden Hour!)
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const buildEnv = (bgHex: string, panels: Array<[string, number, number, number]>) => {
      const es = new THREE.Scene();
      es.background = new THREE.Color(bgHex);
      const pg = new THREE.PlaneGeometry(9, 7);
      const mats: THREE.Material[] = [];
      for (const [hex, x, y, z] of panels) {
        const mat = new THREE.MeshBasicMaterial({ color: hex, side: THREE.DoubleSide });
        mats.push(mat);
        const m = new THREE.Mesh(pg, mat);
        m.position.set(x, y, z);
        m.lookAt(0, 0, 0);
        es.add(m);
      }
      const rt = pmrem.fromScene(es, 0.05);
      pg.dispose();
      for (const mat of mats) mat.dispose();
      return rt;
    };
    this.envNightRT = buildEnv('#101830', [
      ['#ff2288', -8, 4, 0], ['#00c8ff', 8, 5, 4], ['#ffae22', 0, 4, 10],
      ['#ff1e2e', 0, 5, -10], ['#3366ff', 6, 6, -6], ['#304878', 0, 12, 0],
    ]);
    // Full 360-degree continuous Golden Hour Manhattan sky dome PMREM so EVERY skyscraper glass pane gleams warm amber & twilight cobalt!
    const dayEnvScene = new THREE.Scene();
    const dayEnvMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      vertexShader: `varying vec3 vD; void main() { vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `varying vec3 vD; void main() {
        vec3 d = normalize(vD);
        float h = clamp(d.y * 0.5 + 0.5, 0.0, 1.0);
        vec3 col = mix(vec3(0.42, 0.34, 0.32), mix(vec3(1.15, 0.68, 0.38), vec3(0.32, 0.56, 0.96), smoothstep(0.45, 0.92, h)), smoothstep(0.28, 0.52, h));
        float sunDot = max(dot(d, normalize(vec3(-0.52, 0.45, 0.72))), 0.0);
        col += vec3(1.4, 0.92, 0.48) * pow(sunDot, 5.0);
        gl_FragColor = vec4(col, 1.0);
      }`,
    });
    const dayEnvGeo = new THREE.SphereGeometry(20, 24, 16);
    dayEnvScene.add(new THREE.Mesh(dayEnvGeo, dayEnvMat));
    this.envDayRT = pmrem.fromScene(dayEnvScene, 0.02);
    dayEnvGeo.dispose();
    dayEnvMat.dispose();
    this.scene.environment = this.envNightRT.texture;
    pmrem.dispose();

    // Primary Sun / Moon Key Light + Hemisphere Fill
    this.hemiLight = new THREE.HemisphereLight('#243054', '#1a1428', 0.65);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight('#9eb8ff', 0.35);
    this.sunLight.position.set(-60, 120, -90);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.camera.left = -135;
    this.sunLight.shadow.camera.right = 135;
    this.sunLight.shadow.camera.top = 205;
    this.sunLight.shadow.camera.bottom = -205;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 420;
    this.sunLight.shadow.bias = -0.0004;
    this.sunLight.shadow.normalBias = 0.04;
    this.scene.add(this.sunLight);

    // Dynamic Times Square Billboard Area Bounce Lights (calibrated for rich color wash without clipping!)
    const lightSpecs: Array<{ x: number; y: number; z: number; hex: string; intensity: number; dist: number }> = [
      { x: -20, y: 10, z: -162, hex: '#cc0820', intensity: 24, dist: 42 },  // TKTS Deep Ruby glow (preserves crimson glass!)
      { x: -16, y: 24, z: -135, hex: '#ff52aa', intensity: 88, dist: 72 },  // Duffy Square plaza spill
      { x: 10, y: 26, z: -160, hex: '#ff2b88', intensity: 95, dist: 72 },   // TSX Broadway glow
      { x: -16, y: 28, z: -68, hex: '#ff7048', intensity: 115, dist: 85 },  // Marriott Marquis 330ft screen
      { x: 8, y: 26, z: -66, hex: '#b833ff', intensity: 110, dist: 82 },    // 1540 Broadway magenta/cyan
      { x: -8, y: 24, z: 12, hex: '#ffad2b', intensity: 105, dist: 80 },    // 1515 Broadway / Lion King warm gold
      { x: 26, y: 22, z: 92, hex: '#ffbe30', intensity: 95, dist: 74 },     // 1500 Broadway ABC GMA amber
      { x: 32, y: 26, z: 136, hex: '#00aaff', intensity: 115, dist: 82 },   // NASDAQ 7-Story electric blue
      { x: 18, y: 38, z: 146, hex: '#00d8ff', intensity: 125, dist: 92 },   // One Times Square north spill
      { x: -10, y: 26, z: 154, hex: '#00f0c8', intensity: 95, dist: 76 },   // 3 Times Square cyan glow
      { x: -24, y: 28, z: -198, hex: '#ff2030', intensity: 95, dist: 72 },  // 2 Times Square Coca-Cola red
    ];
    for (let i = 0; i < lightSpecs.length; i++) {
      const s = lightSpecs[i];
      const pt = new THREE.PointLight(s.hex, s.intensity, s.dist, 1.75);
      pt.position.set(s.x, s.y, s.z);
      this.scene.add(pt);
      this.neonLights.push({ light: pt, baseInt: s.intensity, phase: i * 1.37 });
    }

    // Build Ground (Custom GLSL Wet Asphalt + Snøhetta Granite + True Planar Mirror Neon Puddles)
    this.ground = createTimesSquareGroundMaterial();
    this.groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(760, 760), this.ground.material);
    this.groundMesh.rotation.x = -Math.PI / 2;
    this.groundMesh.receiveShadow = true;
    this.scene.add(this.groundMesh);

    // Build Facades, Animated Billboards, 264 Real OSM Buildings + Hero Landmarks + Living NYC World
    this.facades = createFacadeMaterials();
    this.billboards = createTimesSquareBillboards();
    this.arch = buildTimesSquareArchitecture(this.facades, this.billboards.boards);
    this.scene.add(this.arch.group);

    this.living = buildTimesSquareLivingWorld();
    this.scene.add(this.living.group);

    // Post-processing Composer (Render -> Strictly Thresholded UnrealBloom 1.22 -> Filmic Grade -> Output)
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.30, 0.42, 1.22);
    this.composer.addPass(this.bloomPass);
    this.gradePass = new ShaderPass(FilmicWalkShader);
    this.composer.addPass(this.gradePass);
    this.composer.addPass(new OutputPass());

    // Apply initial presets & default Duffy Square viewpoint
    this.applyAtmosphere();
    this.jumpToViewpoint(1);

    // Bind events
    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
    document.addEventListener('mousemove', this.onMouseMove);
    this.renderer.domElement.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);

    // Expose clean diagnostic/QA bridge
    (window as unknown as Record<string, unknown>).__SOLARIS_WALK__ = {
      jumpToViewpoint: (id: number) => this.jumpToViewpoint(id),
      setTimePreset: (t: WalkTimePreset) => this.setTimePreset(t),
      setWeatherPreset: (w: WalkWeatherPreset) => this.setWeatherPreset(w),
      setPose: (x: number, z: number, yaw: number, pitch: number) => {
        this.pos.x = x;
        this.pos.z = z;
        this.pos.y = this.arch.getWalkHeight(x, z) + 1.72;
        this.yaw = this.targetYaw = yaw;
        this.pitch = this.targetPitch = pitch;
      },
      getTelemetry: () => this.snapshotTelemetry(),
      startWalking: () => this.startWalking(false),
    };

    this.lastT = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  public startWalking(requestLock = true): void {
    this.started = true;
    this.audio.start();
    if (requestLock && document.pointerLockElement !== this.renderer.domElement) {
      try {
        const res = this.renderer.domElement.requestPointerLock() as unknown as Promise<void> | undefined;
        if (res && typeof res.catch === 'function') res.catch(() => {});
      } catch {
        // Fallback drag-look works smoothly if Pointer Lock is unavailable
      }
    }
    this.pushTelemetry();
  }

  public jumpToViewpoint(id: number): void {
    const vp = TIMES_SQUARE_VIEWPOINTS.find((v) => v.id === id) ?? TIMES_SQUARE_VIEWPOINTS[0];
    this.pos.x = vp.x;
    this.pos.z = vp.z;
    this.pos.y = this.arch.getWalkHeight(vp.x, vp.z) + 1.72;
    this.yaw = this.targetYaw = vp.yaw;
    this.pitch = this.targetPitch = vp.pitch;
    this.velY = 0;
    this.forceReflNext = true;
    this.pushTelemetry();
  }

  public setTimePreset(t: WalkTimePreset): void {
    this.timePreset = t;
    this.forceReflNext = true;
    this.applyAtmosphere();
    this.pushTelemetry();
  }

  public cycleTimePreset(): WalkTimePreset {
    const next = TIME_ORDER[(TIME_ORDER.indexOf(this.timePreset) + 1) % TIME_ORDER.length];
    this.setTimePreset(next);
    return next;
  }

  public setWeatherPreset(w: WalkWeatherPreset): void {
    this.weatherPreset = w;
    this.forceReflNext = true;
    this.applyAtmosphere();
    this.pushTelemetry();
  }

  public cycleWeatherPreset(): WalkWeatherPreset {
    const next = WEATHER_ORDER[(WEATHER_ORDER.indexOf(this.weatherPreset) + 1) % WEATHER_ORDER.length];
    this.setWeatherPreset(next);
    return next;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    this.audio.setMuted(this.muted);
    this.pushTelemetry();
    return this.muted;
  }

  private applyAtmosphere(): void {
    const tc = TIME_CONFIGS[this.timePreset];
    const isRain = this.weatherPreset === 'rain';
    const isWet = this.weatherPreset === 'wet' || isRain;
    const isSnow = this.weatherPreset === 'snow';

    this.skyMat.uniforms.uZenith.value.set(tc.skyZenith);
    this.skyMat.uniforms.uHorizon.value.set(tc.skyHorizon);
    this.skyMat.uniforms.uGlow.value.set(tc.skyGlow);
    this.skyMat.uniforms.uSunDir.value.set(...tc.sunPos).normalize();
    this.skyMat.uniforms.uNight.value = tc.night;

    // Swap PMREM environment & daylight architectural facades dynamically!
    this.scene.environment = tc.night > 0.45 ? this.envNightRT.texture : this.envDayRT.texture;
    this.facades.setDaylightMode(1 - tc.night);

    const fogMult = isRain ? 1.55 : isSnow ? 1.7 : 1.0;
    const fog = this.scene.fog as THREE.FogExp2;
    fog.color.set(tc.fogColor);
    fog.density = tc.fogDensity * fogMult;

    this.sunLight.color.set(tc.sunColor);
    this.sunLight.intensity = tc.sunIntensity * (isRain ? 0.55 : isSnow ? 0.72 : 1.0);
    this.sunLight.position.set(...tc.sunPos);
    this.hemiLight.color.set(tc.hemiSky);
    this.hemiLight.groundColor.set(tc.hemiGround);
    this.hemiLight.intensity = tc.hemiInt;

    // Ground shader uniforms
    const gu = this.ground.uniforms;
    gu.uWetness.value = isRain ? 1.0 : isWet ? 0.84 : 0.08;
    gu.uRain.value = isRain ? 1.0 : 0.0;
    gu.uSnow.value = isSnow ? 0.92 : 0.0;
    gu.uNight.value = tc.night;
    gu.uSunDir.value.set(...tc.sunPos).normalize();
    gu.uSkyColor.value.set(tc.skyHorizon);
    gu.uFogColor.value.set(tc.fogColor);
    gu.uFogDensity.value = fog.density;

    // Building window emission strictly dark in Golden Hour / Daylight (0.04) and warmly lit at Dusk/Midnight!
    const winEmit = 0.02 + 1.05 * Math.pow(tc.night, 1.4);
    this.facades.glassDark.emissiveIntensity = winEmit;
    this.facades.glassBlue.emissiveIntensity = winEmit;
    this.facades.limestone.emissiveIntensity = winEmit * 0.9;
    this.facades.redBrick.emissiveIntensity = winEmit * 0.85;
    this.facades.brutalist.emissiveIntensity = winEmit * 0.9;
    this.facades.storefront.emissiveIntensity = 0.25 + 0.80 * tc.night;

    // Bloom & exposure calibration
    this.bloomPass.strength = tc.bloomStrength * (isRain ? 1.08 : 1.0);
    this.gradePass.uniforms.uExposure.value = tc.exposure;
  }

  private resolveStreetLabel(): string {
    const z = this.pos.z;
    const x = this.pos.x;
    if (z < -158 && x < -12) return 'TKTS Red Stairs · Duffy Square';
    if (z < -112) return 'Duffy Square · Broadway & 46th–47th St';
    if (z < -35) return 'Times Square Center · 45th–46th St';
    if (z < 55) return 'Broadway Plaza · 44th–45th St';
    if (z < 135) return 'South Bowtie · 43rd–44th St';
    return 'One Times Square · 42nd St & 7th Ave';
  }

  private snapshotTelemetry(): WalkTelemetry {
    // Inverse Manhattan Grid (N 28.9° E) back to exact real-world GPS lat/lon!
    const rad = (28.9 * Math.PI) / 180;
    const gx = this.pos.x;
    const gn = -this.pos.z;
    const eastM = gx * Math.cos(rad) + gn * Math.sin(rad);
    const northM = -gx * Math.sin(rad) + gn * Math.cos(rad);
    const lat = 40.75773 + northM / 111132.95;
    const lon = -73.98570 + eastM / (111319.49 * Math.cos((40.75773 * Math.PI) / 180));
    return {
      fps: Math.round(this.fps),
      x: Number(this.pos.x.toFixed(1)),
      y: Number(this.pos.y.toFixed(2)),
      z: Number(this.pos.z.toFixed(1)),
      lat: Number(lat.toFixed(5)),
      lon: Number(lon.toFixed(5)),
      timePreset: this.timePreset,
      weatherPreset: this.weatherPreset,
      locked: this.locked,
      muted: this.muted,
      streetLabel: this.resolveStreetLabel(),
      drawCalls: this.renderer.info.render.calls,
    };
  }

  private pushTelemetry(): void {
    this.onTelemetry?.(this.snapshotTelemetry());
  }

  private collides(x: number, z: number): boolean {
    // World boundary fence keeping player within Times Square Bowtie (41st–48th St)
    if (x < -90 || x > 95 || z < -225 || z > 225) return true;
    const cols: ColliderBox[] = this.arch.colliders;
    const r = 0.55;
    for (let i = 0; i < cols.length; i++) {
      const c = cols[i];
      if (x + r > c.minX && x - r < c.maxX && z + r > c.minZ && z - r < c.maxZ) return true;
    }
    return false;
  }

  private readonly onResize = (): void => {
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.reflCamera.aspect = w / h;
    this.reflCamera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
    this.bloomPass.setSize(w, h);
  };

  private readonly onPointerLockChange = (): void => {
    this.locked = document.pointerLockElement === this.renderer.domElement;
    this.pushTelemetry();
  };

  private readonly onMouseDown = (e: MouseEvent): void => {
    if (!this.started) return;
    if (!this.locked) {
      this.dragging = true;
      this.lastDragX = e.clientX;
      this.lastDragY = e.clientY;
    }
  };

  private readonly onMouseUp = (): void => {
    this.dragging = false;
  };

  private readonly onMouseMove = (e: MouseEvent): void => {
    if (this.locked) {
      this.targetYaw -= e.movementX * 0.0022;
      this.targetPitch = THREE.MathUtils.clamp(this.targetPitch - e.movementY * 0.0020, -1.15, 1.38);
    } else if (this.dragging) {
      const dx = e.clientX - this.lastDragX;
      const dy = e.clientY - this.lastDragY;
      this.lastDragX = e.clientX;
      this.lastDragY = e.clientY;
      this.targetYaw -= dx * 0.004;
      this.targetPitch = THREE.MathUtils.clamp(this.targetPitch - dy * 0.0035, -1.15, 1.38);
    }
  };

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    this.keys.add(e.code);
    if (e.code === 'KeyT') this.cycleTimePreset();
    else if (e.code === 'KeyR') this.cycleWeatherPreset();
    else if (e.code === 'KeyM') this.toggleMute();
    else if (e.code === 'Digit1') this.jumpToViewpoint(1);
    else if (e.code === 'Digit2') this.jumpToViewpoint(2);
    else if (e.code === 'Digit3') this.jumpToViewpoint(3);
    else if (e.code === 'Digit4') this.jumpToViewpoint(4);
    else if (e.code === 'Digit5') this.jumpToViewpoint(5);
  };

  private readonly onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
  };

  private readonly tick = (nowMs: number): void => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.tick);

    const dt = Math.min(0.05, Math.max(0.001, (nowMs - this.lastT) * 0.001));
    this.lastT = nowMs;
    this.elapsed += dt;

    // FPS meter
    this.fpsFrames++;
    this.fpsAccum += dt;
    if (this.fpsAccum >= 0.4) {
      this.fps = this.fpsFrames / this.fpsAccum;
      this.fpsFrames = 0;
      this.fpsAccum = 0;
    }

    // Smooth camera spring rotation (webgl-3d-taste rule: never harsh-snap mouse!)
    const rotSmooth = 1 - Math.exp(-dt * 18);
    this.yaw += (this.targetYaw - this.yaw) * rotSmooth;
    this.pitch += (this.targetPitch - this.pitch) * rotSmooth;

    // Subtle atmospheric idle camera drift before clicking START WALKING
    const viewYaw = this.started ? this.yaw : this.yaw + Math.sin(this.elapsed * 0.18) * 0.06;
    const viewPitch = this.started ? this.pitch : this.pitch + Math.sin(this.elapsed * 0.13) * 0.015;

    // First-Person Movement (WASD / Arrows + Shift Sprint + Collision + TKTS Stairs Elevation!)
    let moveSpeed = 0;
    if (this.started) {
      const fwdIn = (this.keys.has('KeyW') || this.keys.has('ArrowUp') ? 1 : 0) - (this.keys.has('KeyS') || this.keys.has('ArrowDown') ? 1 : 0);
      const strafeIn = (this.keys.has('KeyD') || this.keys.has('ArrowRight') ? 1 : 0) - (this.keys.has('KeyA') || this.keys.has('ArrowLeft') ? 1 : 0);
      const sprint = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');
      const speed = sprint ? 11.5 : 4.6;

      this._fwd.set(Math.sin(this.yaw), 0, Math.cos(this.yaw));
      this._right.set(-Math.cos(this.yaw), 0, Math.sin(this.yaw));
      this._move.set(0, 0, 0).addScaledVector(this._fwd, fwdIn).addScaledVector(this._right, strafeIn);
      if (this._move.lengthSq() > 1e-4) {
        this._move.normalize().multiplyScalar(speed * dt);
        const nx = this.pos.x + this._move.x;
        const nz = this.pos.z + this._move.z;
        if (!this.collides(nx, this.pos.z)) this.pos.x = nx;
        if (!this.collides(this.pos.x, nz)) this.pos.z = nz;
        moveSpeed = speed;
        this.bobPhase += dt * (sprint ? 12.5 : 8.2);
      }

      const groundY = this.arch.getWalkHeight(this.pos.x, this.pos.z);
      const targetEyeY = groundY + 1.72;
      if (this.keys.has('Space') && this.pos.y <= targetEyeY + 0.05) {
        this.velY = 4.2;
      }
      this.velY -= 12.0 * dt;
      this.pos.y += this.velY * dt;
      if (this.pos.y <= targetEyeY) {
        this.pos.y = targetEyeY;
        this.velY = 0;
      }
    }

    const headBobY = moveSpeed > 0.2 ? Math.sin(this.bobPhase) * 0.045 : 0;
    this.camera.position.set(this.pos.x, this.pos.y + headBobY, this.pos.z);
    const cosP = Math.cos(viewPitch);
    this._lookTarget.set(
      this.camera.position.x + Math.sin(viewYaw) * cosP * 10,
      this.camera.position.y + Math.sin(viewPitch) * 10,
      this.camera.position.z + Math.cos(viewYaw) * cosP * 10,
    );
    this.camera.lookAt(this._lookTarget);

    // Update animated billboards, sky, ground puddles, steam, NYE ball, traffic & crowd
    const tc = TIME_CONFIGS[this.timePreset];
    const rainAmt = this.weatherPreset === 'rain' ? 1 : 0;
    const snowAmt = this.weatherPreset === 'snow' ? 1 : 0;
    const wetAmt = this.weatherPreset === 'wet' || rainAmt > 0 ? 1 : 0;

    this.billboards.update(this.elapsed);
    this.skyMat.uniforms.uTime.value = this.elapsed;
    this.ground.uniforms.uTime.value = this.elapsed;
    this.gradePass.uniforms.uTime.value = this.elapsed;
    this.arch.update(this.elapsed, tc.night);
    this.living.update(this.elapsed, dt, this.camera.position, rainAmt, snowAmt, tc.night);
    this.audio.update(dt, moveSpeed, rainAmt, wetAmt);

    // Subtle organic neon pulse on area bounce lights (simulating video wall color shifts!)
    const neonScale = 0.20 + 0.95 * tc.night;
    for (let i = 0; i < this.neonLights.length; i++) {
      const nl = this.neonLights[i];
      nl.light.intensity = nl.baseInt * neonScale * (0.86 + 0.14 * Math.sin(this.elapsed * 1.4 + nl.phase));
    }

    // Real-time Layer-1 Planar Mirror Reflection pass (half-rate refresh for locked 60+ FPS across ALL viewpoints!)
    this.frameIndex++;
    const gu = this.ground.uniforms;
    if (gu.uWetness.value > 0.12 && gu.uSnow.value < 0.75) {
      if (this.forceReflNext || (this.frameIndex & 1) === 0) {
        this.forceReflNext = false;
        this.reflCamera.position.set(this.camera.position.x, -this.camera.position.y, this.camera.position.z);
        this._reflLookTarget.set(this._lookTarget.x, -this._lookTarget.y, this._lookTarget.z);
        this.reflCamera.up.set(0, 1, 0);
        this.reflCamera.lookAt(this._reflLookTarget);
        this.reflCamera.updateMatrixWorld(true);
        this._reflMatrix.multiplyMatrices(this.reflCamera.projectionMatrix, this.reflCamera.matrixWorldInverse);
        gu.uReflMatrix.value.copy(this._reflMatrix);
        gu.uReflMap.value = this.reflTarget.texture;
        gu.uHasRefl.value = 1;

        const prevShadowAuto = this.renderer.shadowMap.autoUpdate;
        this.renderer.shadowMap.autoUpdate = false;
        this.groundMesh.visible = false;
        this.renderer.clippingPlanes = [this.reflClipPlane];
        this.renderer.setRenderTarget(this.reflTarget);
        this.renderer.clear();
        this.renderer.render(this.scene, this.reflCamera);
        this.renderer.setRenderTarget(null);
        this.renderer.clippingPlanes = [];
        this.groundMesh.visible = true;
        this.renderer.shadowMap.autoUpdate = prevShadowAuto;
      }
    } else {
      gu.uHasRefl.value = 0;
    }

    // Bind live directional sun shadow map into our custom wet/granite ground shader for crisp Golden Hour shadows!
    if (tc.night < 0.5 && this.sunLight.shadow.map) {
      gu.uShadowMap.value = this.sunLight.shadow.map.texture;
      gu.uShadowMatrix.value.copy(this.sunLight.shadow.matrix);
      gu.uHasShadow.value = 1;
    } else {
      gu.uHasShadow.value = 0;
    }

    this.composer.render();

    if (nowMs - this.lastHudPush > 350) {
      this.lastHudPush = nowMs;
      this.pushTelemetry();
    }
  };

  public dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    document.removeEventListener('mousemove', this.onMouseMove);
    this.renderer.domElement.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.audio.dispose();
    this.arch.dispose();
    this.living.dispose();
    this.billboards.dispose();
    this.facades.dispose();
    this.groundMesh.geometry.dispose();
    this.ground.material.dispose();
    this.reflTarget.dispose();
    this.envNightRT.dispose();
    this.envDayRT.dispose();
    this.skyMat.dispose();
    this.composer.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
