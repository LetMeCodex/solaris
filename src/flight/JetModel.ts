import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import type { CockpitLayout } from './CockpitControls';
import { createJetSurfaceState, type JetAirframeId, type JetSurfaceState } from './JetTelemetry';

/** Optional real-time aerodynamic and surface telemetry fed from FlightModel / JetController. */
export interface JetVisualState {
  /** Frame step (s) for surface actuator lag smoothing and vapor advection. */
  dt?: number;
  /** Target aerodynamic surface deflections, airbrake, gear, and iris state. */
  surfaces?: JetSurfaceState;
  /** Angle of attack (deg) driving over-wing/LERX condensation sheet intensity. */
  aoaDeg?: number;
  /** Current Mach number for transonic vapor surge. */
  mach?: number;
  /** Normal load factor (G) driving subtle outboard wing aeroelastic flex. */
  gLoad?: number;
  /** Relative atmospheric density [0..1] (0 in vacuum). */
  airDensity?: number;
  /** Dynamic pressure (Pa). */
  qPa?: number;
  /** Discrete afterburner zone [0..3]. */
  abStage?: 0 | 1 | 2 | 3;
  /** Weight-on-wheels flag for oleo strut compression and taxi light glow. */
  onGround?: boolean;
  /** Forward ground roll speed (m/s). */
  groundSpeedMs?: number;
}

/**
 * The Solaris jet, SX-1 "Kestrel": an original single-seat interceptor built from code, in metres.
 * The nose points down -Z and the canopy up +Y, matching the flight model and a three.js camera.
 *
 * Fuselage and canopy are lofted from superellipse cross-sections (a chined, blended body); wings,
 * fins and stabilators are extruded planforms. One panel-line texture (painted on a canvas, tiled
 * every 4 m) drives the colour variation, roughness and bump of the coating, so the jet catches
 * the Sun and the reflection of the world below like a real airframe.
 */

export const JET_LENGTH_M = 17.2;

interface Station {
  z: number;
  /** Half width. */
  w: number;
  /** Height above / below the centre line. */
  top: number;
  bot: number;
  /** Centre line height. */
  y: number;
  /** Superellipse exponent: 2 is an ellipse, higher is boxier (a chine). */
  n: number;
}

const FUSELAGE: Station[] = [
  { z: -9.0, w: 0.015, top: 0.015, bot: 0.015, y: 0.0, n: 2.0 },
  { z: -8.4, w: 0.24, top: 0.2, bot: 0.15, y: 0.02, n: 2.2 },
  { z: -7.2, w: 0.55, top: 0.44, bot: 0.34, y: 0.05, n: 2.5 },
  { z: -5.6, w: 0.86, top: 0.66, bot: 0.5, y: 0.07, n: 2.7 },
  { z: -3.6, w: 1.08, top: 0.76, bot: 0.6, y: 0.05, n: 2.9 },
  { z: -1.4, w: 1.5, top: 0.7, bot: 0.66, y: 0.0, n: 3.3 },
  { z: 1.4, w: 1.72, top: 0.62, bot: 0.66, y: 0.0, n: 3.5 },
  { z: 4.0, w: 1.58, top: 0.56, bot: 0.6, y: 0.0, n: 3.5 },
  { z: 6.2, w: 1.3, top: 0.48, bot: 0.52, y: 0.0, n: 3.1 },
  { z: 7.5, w: 1.12, top: 0.43, bot: 0.47, y: 0.0, n: 2.9 },
];

const signPow = (v: number, p: number): number => Math.sign(v) * Math.pow(Math.abs(v), p);

/** Loft a closed tube through the stations (capped at the tail). UVs are in metres. */
function loft(stations: Station[], radial = 64): THREE.BufferGeometry {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let s = 0; s < stations.length; s++) {
    const st = stations[s];
    const e = 2 / st.n;
    let arc = 0;
    let px = 0;
    let py = 0;
    for (let i = 0; i <= radial; i++) {
      const a = (i / radial) * Math.PI * 2;
      const c = Math.cos(a);
      const sn = Math.sin(a);
      const x = st.w * signPow(c, e);
      const y = st.y + (sn >= 0 ? st.top : st.bot) * signPow(sn, e);
      if (i > 0) arc += Math.hypot(x - px, y - py);
      px = x;
      py = y;
      pos.push(x, y, st.z);
      uv.push(arc, st.z);
    }
  }
  const row = radial + 1;
  for (let s = 0; s < stations.length - 1; s++) {
    for (let i = 0; i < radial; i++) {
      const a = s * row + i;
      const b = a + row;
      idx.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }
  // Tail cap
  const last = stations[stations.length - 1];
  const centre = pos.length / 3;
  pos.push(0, last.y, last.z);
  uv.push(0, last.z);
  const base = (stations.length - 1) * row;
  for (let i = 0; i < radial; i++) idx.push(base + i, centre, base + i + 1);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** A flat planform (points in x, z) extruded to a thin bevelled panel lying in the XZ plane. */
function planform(points: Array<[number, number]>, thickness: number, bevel: number): THREE.BufferGeometry {
  const shape = new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, z)));
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 4,
  });
  // Shape (x, s) extruded along +depth → (x, -depth, s): the planform lies flat, s becomes z
  g.rotateX(Math.PI / 2);
  g.translate(0, thickness / 2, 0);
  g.computeVertexNormals();
  return g;
}

/** A fin: planform in (z, height), extruded across x, standing up. */
function fin(points: Array<[number, number]>, thickness: number, bevel: number): THREE.BufferGeometry {
  const shape = new THREE.Shape(points.map(([z, h]) => new THREE.Vector2(z, h)));
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 4,
  });
  // (a, b, c) → (-c, b, a): a along z, b up, depth across x
  g.rotateY(-Math.PI / 2);
  g.translate(thickness / 2, 0, 0);
  g.computeVertexNormals();
  return g;
}

/** Panel lines, access hatches and rivets for the coating, one 4 m tile. */
function panelTextures(): { color: THREE.CanvasTexture; rough: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
  const S = 1024;
  const mk = (): [HTMLCanvasElement, CanvasRenderingContext2D] => {
    const c = document.createElement('canvas');
    c.width = c.height = S;
    return [c, c.getContext('2d') as CanvasRenderingContext2D];
  };
  const [cc, cx] = mk();
  const [rc, rx] = mk();
  const [bc, bx] = mk();
  let seed = 7;
  const rnd = (): number => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  cx.fillStyle = '#7f8790';
  cx.fillRect(0, 0, S, S);
  rx.fillStyle = '#8a8a8a';
  rx.fillRect(0, 0, S, S);
  bx.fillStyle = '#808080';
  bx.fillRect(0, 0, S, S);

  // Large panels, each a slightly different shade of the coating
  const cols = 4;
  const rows = 6;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c / cols) * S + (r % 2 ? S / cols / 2 : 0);
      const y = (r / rows) * S;
      const w = S / cols;
      const h = S / rows;
      const tone = 120 + Math.floor((rnd() - 0.5) * 16);
      cx.fillStyle = `rgb(${tone},${tone + 7},${tone + 15})`;
      cx.fillRect(x, y, w, h);
      cx.fillRect(x - S, y, w, h);
      const rt = 125 + Math.floor((rnd() - 0.5) * 40);
      rx.fillStyle = `rgb(${rt},${rt},${rt})`;
      rx.fillRect(x, y, w, h);
      rx.fillRect(x - S, y, w, h);
    }
  }
  // Seams
  const seam = (ctx: CanvasRenderingContext2D, colour: string, width: number): void => {
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    for (let r = 0; r <= rows; r++) {
      const y = (r / rows) * S;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(S, y);
      ctx.stroke();
      for (let c = 0; c <= cols; c++) {
        const x = (c / cols) * S + (r % 2 ? S / cols / 2 : 0);
        ctx.beginPath();
        ctx.moveTo(x % S, y);
        ctx.lineTo(x % S, y + S / rows);
        ctx.stroke();
      }
    }
  };
  seam(cx, 'rgba(40,44,50,0.85)', 2.2);
  seam(rx, 'rgba(230,230,230,1)', 3);
  seam(bx, 'rgba(20,20,20,1)', 3);
  // Hatches and rivet rows
  for (let i = 0; i < 26; i++) {
    const w = 30 + rnd() * 90;
    const h = 24 + rnd() * 70;
    const x = rnd() * (S - w);
    const y = rnd() * (S - h);
    cx.strokeStyle = 'rgba(45,50,56,0.7)';
    cx.lineWidth = 1.5;
    cx.strokeRect(x, y, w, h);
    bx.strokeStyle = 'rgba(40,40,40,1)';
    bx.lineWidth = 2;
    bx.strokeRect(x, y, w, h);
  }
  for (let r = 0; r <= rows; r++) {
    const y = (r / rows) * S + 7;
    for (let x = 4; x < S; x += 11) {
      cx.fillStyle = 'rgba(160,168,176,0.55)';
      cx.fillRect(x, y, 1.6, 1.6);
      bx.fillStyle = 'rgba(200,200,200,1)';
      bx.fillRect(x, y, 2, 2);
    }
  }
  // Wear: a faint mottle so the coating isn't plastic-clean
  for (let i = 0; i < 4000; i++) {
    const a = rnd() * 0.05;
    cx.fillStyle = `rgba(${rnd() > 0.5 ? '255,255,255' : '0,0,0'},${a})`;
    cx.fillRect(rnd() * S, rnd() * S, 2 + rnd() * 9, 2 + rnd() * 9);
  }

  const tex = (c: HTMLCanvasElement, srgb: boolean): THREE.CanvasTexture => {
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1 / 4, 1 / 4); // UVs are metres; one tile is 4 m
    t.anisotropy = 8;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  return { color: tex(cc, true), rough: tex(rc, false), bump: tex(bc, false) };
}

/** Tail art: the Solaris mark and the aircraft number, on a transparent decal. */
function tailDecal(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const x = c.getContext('2d') as CanvasRenderingContext2D;
  x.clearRect(0, 0, 512, 256);
  // A low-visibility sun disc with a single orbit line
  x.strokeStyle = 'rgba(52,58,66,0.9)';
  x.lineWidth = 5;
  x.beginPath();
  x.ellipse(150, 118, 92, 34, -0.35, 0, Math.PI * 2);
  x.stroke();
  x.fillStyle = 'rgba(52,58,66,0.9)';
  x.beginPath();
  x.arc(150, 118, 30, 0, Math.PI * 2);
  x.fill();
  x.fillStyle = 'rgba(214,150,64,0.95)';
  x.beginPath();
  x.arc(222, 92, 7, 0, Math.PI * 2);
  x.fill();
  x.font = '600 44px "Inter", "Segoe UI", sans-serif';
  x.fillStyle = 'rgba(52,58,66,0.92)';
  x.fillText('SX-01', 270, 140);
  x.font = '500 22px "Inter", "Segoe UI", sans-serif';
  x.fillText('SOLARIS', 274, 176);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** A soft round glow, for lights and the engine faces. */
export function glowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d') as CanvasRenderingContext2D;
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.18, 'rgba(255,255,255,0.75)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.18)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

const PLUME_VERT = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  void main() {
    vPos = position;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormalV = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

/**
 * Exhaust: an additive volume along +Z behind the nozzle. Shock diamonds in air; in vacuum the
 * under-expanded jet balloons out and fades, as real exhaust does with no air to hold it in.
 */
const PLUME_FRAG = /* glsl */ `
  uniform float uThrottle;
  uniform float uBoost;
  uniform float uVacuum;
  uniform float uTime;
  uniform float uLength;
  uniform float uCore;      // 1: the short white-hot core, 0: the flame around it
  varying vec3 vPos;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  void main() {
    float t = clamp(vPos.z / uLength, 0.0, 1.0);           // 0 at the nozzle, 1 at the tail
    float facing = abs(dot(normalize(vNormalV), normalize(vViewDir)));
    float body = pow(facing, mix(1.9, 3.2, uCore));          // smooth feathered silhouette, thickest along core
    float lipFade = smoothstep(0.0, 0.055, t);               // soft entry from nozzle lip (no hard ring)
    // Turbulence flowing downstream
    float ang = atan(vPos.y, vPos.x);
    float flow = noise(vec2(ang * 2.5, t * 9.0 - uTime * 26.0)) * 0.6 + noise(vec2(ang * 6.0, t * 22.0 - uTime * 55.0)) * 0.4;
    // Mach disks: crisp shock diamonds at regular spacing, prominent under afterburner (air only)
    float diamonds = 0.0;
    for (int k = 0; k < 6; k++) {
      float x = 0.075 + float(k) * 0.085;
      float d = (t - x) / 0.013;
      diamonds += exp(-d * d) * (1.0 - float(k) / 6.0);
    }
    diamonds *= (1.0 - uVacuum) * (0.14 + 0.86 * uBoost) * lipFade;
    float fade = pow(1.0 - t, mix(mix(1.5, 2.4, uVacuum), 3.4, uCore)) * lipFade;
    vec3 white = vec3(1.0, 0.96, 0.88);
    vec3 dry = vec3(0.36, 0.56, 0.86);                       // military power: subtle realistic turbine heat-blue
    vec3 ab = mix(vec3(1.0, 0.76, 0.34), vec3(1.0, 0.34, 0.10), smoothstep(0.10, 0.72, t)); // amber -> orange
    vec3 col = mix(dry, ab, uBoost);
    col = mix(white, col, smoothstep(0.0, mix(0.20, 0.50, uCore), t));
    col = mix(col, vec3(0.92, 0.94, 1.0), diamonds * 0.55);  // hot shock diamonds glow pale blue-white
    float power = (0.10 + 0.75 * uThrottle) * (0.65 + 1.45 * uBoost);
    float a = body * fade * (0.52 + 0.55 * flow) * power + diamonds * body * power * 1.25;
    a *= mix(1.0, 0.4, uVacuum) * mix(1.0, 1.75, uCore);
    gl_FragColor = vec4(col * a * 1.15, 1.0);
  }
`;

/** Where things are on a loaded airframe, metres, in the jet frame (nose -Z, canopy +Y). */
export interface AirframeAnchors {
  /** Shown in the HUD. */
  name: string;
  /** Attribution (CC BY): title, author, link. */
  credit: { title: string; author: string; url: string };
  /** The model file has its nose along +Z (turned round on load). */
  noseAlongPositiveZ: boolean;
  /** The model file has its nose along +X (turned a quarter round on load). */
  noseAlongPositiveX?: boolean;
  /** Extra scale on load, so the airframe is its real size in metres. */
  modelScale?: number;
  /** Materials (name prefixes) not drawn: battle damage and baked effects the jet does itself. */
  hideMaterials?: string[];
  /** Parts (mesh names in the file) left out, e.g. a canopy bow that blocks the pilot's view. */
  hideMeshes?: string[];
  /**
   * From inside (cockpit and GoPro views) the canopy is one clear sweep of glass: these frame and
   * rim meshes are hidden, and `insideClip` cuts the canopy frame out of the fuselage mesh it is
   * merged into (a box in the airframe's frame, metres, nose -Z). Outside they are all there.
   */
  insideHideMeshes?: string[];
  insideClip?: Array<{ material: string; min: [number, number, number]; max: [number, number, number] }>;
  /** The canopy's glass bubble (mesh name): from inside it is drawn as real glass (see insideGlass). */
  insideGlassMesh?: string;
  /**
   * The canopy's shape, measured from the model's glass, for one seamless bubble drawn from inside
   * (the model's own glass is two pieces with a gap where the bow was). Stations along the jet:
   * z (m, nose -Z), the sill height, the crown height and the half-width.
   */
  canopyProfile?: Array<[number, number, number, number]>;
  /** Fixes for materials the model ships untextured (plain white): colour, finish, glass. */
  materialTweaks?: Record<string, { color?: number; roughness?: number; metalness?: number; opacity?: number; emissive?: number }>;
  lengthM: number;
  eye: THREE.Vector3;
  /** Exhaust exits, port then starboard. */
  nozzles: THREE.Vector3[];
  nozzleRadiusM: number;
  wingtips: THREE.Vector3[];
  finTips: THREE.Vector3[];
  tailLight: THREE.Vector3;
  hasInterior: boolean;
  /** Where a GoPro sits (rear cockpit, looking over the pilot), if there is room for one. */
  goproMount: THREE.Vector3;
  /** Name prefix of the canopy glass material (for the scratch glints). */
  canopyMaterial: string;
  /** The HUD combiner glass: centre and width, metres. */
  hudCentre: THREE.Vector3;
  hudWidthM: number;
  /** Where the moving stick and throttle are, and room on the console for added controls. */
  cockpit?: CockpitLayout;
  /** Airframe archetype identifier driving articulated surface & vapor geometry. */
  airframeId?: JetAirframeId;
  /** Canard/LERX strake vortex shedding anchor points, port then starboard (jet frame). */
  strakeVortex?: [THREE.Vector3, THREE.Vector3];
  /** Extended landing gear contact centres (nose, port main, stbd main) and strut stroke. */
  wheelAnchors?: { nose: THREE.Vector3; mainL: THREE.Vector3; mainR: THREE.Vector3; bayY: number };
}

/**
 * "Su-30MKK with Kh-59M" by Jeyhun1985 (Sketchfab), CC BY 4.0, optimised (see ASSETS.md).
 * Anchors measured from the model's own parts (nozzle pair, wingtip rails, fins, front cockpit).
 */
export const SU30_URL = 'models/su30mkk.glb';
export const SU30_ANCHORS: AirframeAnchors = {
  name: 'SU-30MKK',
  credit: { title: 'Su-30MKK with Kh-59M', author: 'Jeyhun1985', url: 'https://sketchfab.com/3d-models/su-30mkk-with-kh-59m-da768c092b0f49b6b8bcb9e917e1e6a0' },
  noseAlongPositiveZ: true,
  lengthM: 22.6,
  eye: new THREE.Vector3(0, 1.15, -7.8), // front seat: 0.6 m behind the HUD glass, above the coaming
  nozzles: [new THREE.Vector3(-1.2, -0.51, 6.84), new THREE.Vector3(1.2, -0.51, 6.84)],
  nozzleRadiusM: 0.55,
  wingtips: [new THREE.Vector3(-7.4, -0.11, 2.32), new THREE.Vector3(7.4, -0.11, 2.32)],
  finTips: [new THREE.Vector3(-2.15, 3.8, 6.2), new THREE.Vector3(2.15, 3.8, 6.2)],
  tailLight: new THREE.Vector3(0, 0.3, 8.75),
  hasInterior: true,
  // Right behind the front pilot's helmet, a little high and to the right, as in helmet-cam footage
  goproMount: new THREE.Vector3(0.04, 1.27, -7.74),
  canopyMaterial: 'e961',
  hudCentre: new THREE.Vector3(0, 1.13, -8.44),
  hudWidthM: 0.24,
  // Measured by ray scans: the centre stick rises to 0.64 m at z -8.30; the throttle grip stands
  // 18 cm proud of the left console at x -0.35, z -8.08; the console is flat at 0.42 m behind it
  cockpit: {
    stickBox: new THREE.Box3(new THREE.Vector3(-0.065, 0.2, -8.37), new THREE.Vector3(0.065, 0.7, -8.2)),
    stickPivot: new THREE.Vector3(0, 0.2, -8.29),
    throttleBox: new THREE.Box3(new THREE.Vector3(-0.395, 0.455, -8.15), new THREE.Vector3(-0.295, 0.7, -8.0)),
    throttlePivot: new THREE.Vector3(-0.345, 0.44, -8.075),
    console: new THREE.Vector3(-0.35, 0.425, -7.74),
  },
  airframeId: 'su30',
  strakeVortex: [new THREE.Vector3(-2.05, 0.22, -2.55), new THREE.Vector3(2.05, 0.22, -2.55)],
  wheelAnchors: {
    nose: new THREE.Vector3(0, -2.25, -7.65),
    mainL: new THREE.Vector3(-2.05, -2.25, 0.85),
    mainR: new THREE.Vector3(2.05, -2.25, 0.85),
    bayY: -1.18,
  },
};

/**
 * "SAAB Jas 39A Gripen (Detailed Cockpit)" by ngkoret (Sketchfab), CC BY 4.0, optimised (see
 * ASSETS.md): the airframe simplified, the cockpit kept at full detail with its 4K texture.
 * Anchors in the turned frame (nose -Z, metres), from the model's own parts: the seat, the sight,
 * the nozzle petals, the wingtip rails and the fin.
 */
export const GRIPEN_URL = 'models/gripen.glb';
export const GRIPEN_ANCHORS: AirframeAnchors = {
  name: 'JAS 39 GRIPEN',
  credit: { title: 'SAAB Jas 39A Gripen (Detailed Cockpit)', author: 'ngkoret', url: 'https://sketchfab.com/3d-models/saab-jas-39a-gripen-detailed-cockpit-f4646ccf489341c28c4118de38feface' },
  noseAlongPositiveZ: false,
  noseAlongPositiveX: true,
  // The export is 1.093x its source; the real aircraft is 14.1 m nose to pitot
  modelScale: 0.8533,
  hideMaterials: ['bullet_glass_holes', 'bulletholes', 'damaged_gauges', 'gunfire', 'jet_flame_diamonds'],
  // The canopy bow with its three rear-view mirrors and their housings, and the thick inner rim:
  // they arched across the top of the view. The canopy is one clear sweep of glass instead
  hideMeshes: ['Object_17', 'Object_65', 'Object_66', 'Object_72'],
  // The rest of the frame: its outer skin, the inner rails and the rear bow
  // and the glass layers themselves (their edges cut across the view): the glass is drawn in
  // screen space instead (LensPipeline's CanopyShader)
  insideHideMeshes: ['Object_11', 'Object_43', 'Object_75', 'Object_78', 'Object_13', 'Object_15', 'Object_18'],
  canopyProfile: [
    [-5.22, 0.238, 0.26, 0.335],
    [-5.15, 0.24, 0.52, 0.35],
    [-5.08, 0.241, 0.69, 0.358],
    [-4.87, 0.256, 0.776, 0.367],
    [-4.66, 0.309, 0.804, 0.372],
    [-4.45, 0.322, 0.81, 0.371],
    [-4.23, 0.342, 0.813, 0.367],
    [-4.02, 0.361, 0.809, 0.36],
    [-3.81, 0.386, 0.794, 0.346],
    [-3.59, 0.409, 0.772, 0.33],
    [-3.38, 0.422, 0.757, 0.318],
  ],
  // The windscreen arch and canopy rails, part of the fuselage mesh: above the sill, pilot's bay
  insideClip: [
    { material: 'saab_jas39a_aircraft_normal_detail', min: [-0.66, 0.4, -5.38], max: [0.66, 1.6, -2.85] },
    // The canopy's clips and the mirror mount, in the cockpit mesh (the panel and HUD sit lower)
    { material: 'saab_jas39a_cockpit', min: [-0.7, 0.62, -5.38], max: [0.7, 1.6, -2.85] },
    // The canopy's front supports (two rods left standing in the air once the bow was gone)
    { material: 'saab_jas39a_cockpit', min: [-0.42, 0.345, -5.32], max: [-0.14, 0.62, -4.82] },
    { material: 'saab_jas39a_cockpit', min: [0.14, 0.345, -5.32], max: [0.42, 0.62, -4.82] },
    // The HUD's two bare posts above the up-front panel (the combiner glass and its symbols stay)
    { material: 'sw_sight_saab_39c', min: [-0.3, 0.36, -5.3], max: [0.3, 1.2, -4.7] },
  ],
  materialTweaks: {
    // The canopy's reflection layer: a whisper of glass, not a white veil
    dynamic_glass_chrome: { opacity: 0.035, roughness: 0.04 },
    empty_glass: { opacity: 0.08, roughness: 0.03 },
    dynamic_mirror: { color: 0xd8dadc, metalness: 1, roughness: 0.05 },
    // Multi-function displays: dark screens with a faint live glow
    dynamic_mfd: { color: 0x0a0f0d, roughness: 0.12, emissive: 0x0b2416 },
    saab_jas39a_interior: { color: 0x202326, roughness: 0.75 },
    saab_jas39a_inside: { color: 0x2c3034, roughness: 0.8 },
    saab_jas39a_lables_1: { color: 0x1c1d1f, roughness: 0.7 },
    sw_gauge_rpm_jas39a: { color: 0x17181a, roughness: 0.5 },
    sw_gauge_exhaust_temperature_jas39a: { color: 0x17181a, roughness: 0.5 },
    lau_7: { color: 0x8d9296, roughness: 0.55 },
    lavett_71: { color: 0x8d9296, roughness: 0.55 },
    bol_451_container: { color: 0x7d8288, roughness: 0.6 },
    mesh1: { color: 0x6f7378, roughness: 0.6 },
  },
  lengthM: 14.1,
  eye: new THREE.Vector3(0, 0.56, -4.62),
  nozzles: [new THREE.Vector3(0, 0, 5.46)],
  nozzleRadiusM: 0.41,
  wingtips: [new THREE.Vector3(-4.01, -0.19, 2.61), new THREE.Vector3(4.01, -0.19, 2.61)],
  finTips: [new THREE.Vector3(-0.05, 2.47, 4.57), new THREE.Vector3(0.05, 2.47, 4.57)],
  tailLight: new THREE.Vector3(0, 2.05, 4.94),
  hasInterior: true,
  // On the canopy frame behind the right shoulder: over-the-shoulder, clear of the glass
  goproMount: new THREE.Vector3(0.04, 0.68, -4.56),
  canopyMaterial: 'empty_glass',
  hudCentre: new THREE.Vector3(0, 0.47, -5.18),
  hudWidthM: 0.2,
  cockpit: {
    stickBox: new THREE.Box3(new THREE.Vector3(-0.06, -0.03, -5.02), new THREE.Vector3(0.05, 0.22, -4.87)),
    stickPivot: new THREE.Vector3(-0.008, -0.02, -4.95),
    throttleBox: new THREE.Box3(new THREE.Vector3(-0.425, 0.02, -4.92), new THREE.Vector3(-0.315, 0.18, -4.68)),
    throttlePivot: new THREE.Vector3(-0.37, 0.0, -4.78),
    console: new THREE.Vector3(-0.31, 0.045, -4.55),
    consoleScale: 0.78,
  },
  airframeId: 'gripen',
  strakeVortex: [new THREE.Vector3(-2.14, 0.2, -1.68), new THREE.Vector3(2.14, 0.2, -1.68)],
  wheelAnchors: {
    nose: new THREE.Vector3(0, -1.55, -4.35),
    mainL: new THREE.Vector3(-1.15, -1.55, 0.85),
    mainR: new THREE.Vector3(1.15, -1.55, 0.85),
    bayY: -0.62,
  },
};

/** The airframes there are to fly, and the one chosen (a setting kept in the browser). */
export const AIRFRAMES = {
  gripen: { url: GRIPEN_URL, anchors: GRIPEN_ANCHORS },
  su30: { url: SU30_URL, anchors: SU30_ANCHORS },
} as const;
export type AirframeId = keyof typeof AIRFRAMES;
export const AIRFRAME_KEY = 'solaris.jet';
export function chosenAirframe(): AirframeId {
  try {
    const v = globalThis.localStorage?.getItem(AIRFRAME_KEY);
    return v === 'su30' || v === 'gripen' ? v : 'gripen';
  } catch {
    return 'gripen';
  }
}

/** The canopy bubble's cross-section at `z` (jet frame): [sill height, crown height, half-width]. */
function bubbleStation(profile: Array<[number, number, number, number]>, z: number): [number, number, number] {
  if (z <= profile[0][0]) return [profile[0][1], profile[0][2], profile[0][3]];
  for (let i = 1; i < profile.length; i++) {
    const [z1, s1, c1, w1] = profile[i];
    const [z0, s0, c0, w0] = profile[i - 1];
    if (z <= z1) {
      const f = (z - z0) / (z1 - z0);
      const e = f * f * (3 - 2 * f);
      return [s0 + (s1 - s0) * f, c0 + (c1 - c0) * e, w0 + (w1 - w0) * f];
    }
  }
  const last = profile[profile.length - 1];
  return [last[1], last[2], last[3]];
}

/** A point on the bubble's arch at angle t (0 left sill .. pi right sill): superellipse, exponent 2.6. */
function archPoint(sill: number, crown: number, half: number, t: number, z: number, out: THREE.Vector3): THREE.Vector3 {
  const c = Math.cos(t);
  const sn = Math.sin(t);
  return out.set(-Math.sign(c) * Math.pow(Math.abs(c), 2 / 2.6) * half * 1.012, sill + Math.pow(sn, 2 / 2.6) * (crown - sill) * 1.008 + 0.004, z);
}

/**
 * Sweeps a closed cross-section along a path: at each station the section's (a, b) map to
 * point + a * across + b * up. Each edge of the section is its own strip, so the faces keep hard
 * edges across the profile while staying smooth along the path.
 */
function sweep(stations: Array<{ p: THREE.Vector3; across: THREE.Vector3; up: THREE.Vector3 }>, section: Array<[number, number]>): THREE.BufferGeometry {
  const pos: number[] = [];
  const idx: number[] = [];
  const v = new THREE.Vector3();
  for (let k = 0; k < section.length; k++) {
    const s0 = section[k];
    const s1 = section[(k + 1) % section.length];
    const base = pos.length / 3;
    for (const st of stations) {
      for (const [a, b] of [s0, s1]) {
        v.copy(st.p).addScaledVector(st.across, a).addScaledVector(st.up, b);
        pos.push(v.x, v.y, v.z);
      }
    }
    for (let i = 0; i < stations.length - 1; i++) {
      const q = base + i * 2;
      idx.push(q, q + 2, q + 1, q + 1, q + 2, q + 3);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Half-space plane separating a movable control surface from stationary structure (`normal·p >= dist`). */
interface ClipPlane {
  normal: THREE.Vector3;
  dist: number;
}

interface TriVert {
  p: THREE.Vector3;
  n: THREE.Vector3;
  u: THREE.Vector2;
}

interface SlicePartSpec {
  id: string;
  pivot: THREE.Vector3;
  planes: ClipPlane[];
  materialPrefixes?: string[];
  bounds?: THREE.Box3;
  addHingeSpar?: { start: THREE.Vector3; end: THREE.Vector3; radius: number };
}

interface CarvedPart {
  id: string;
  group: THREE.Group;
  triangleCount: number;
}

/** Clip convex polygon `poly` against half-space `plane`, outputting `inside` (`>=0`) and `outside` (`<=0`). */
function splitPolygonHalfSpace(poly: TriVert[], plane: ClipPlane): { inside: TriVert[]; outside: TriVert[] } {
  const inside: TriVert[] = [];
  const outside: TriVert[] = [];
  const eps = 1e-5;
  const dists = poly.map((v) => plane.normal.dot(v.p) - plane.dist);

  for (let i = 0; i < poly.length; i++) {
    const j = (i + 1) % poly.length;
    const a = poly[i];
    const b = poly[j];
    const da = dists[i];
    const db = dists[j];
    const aIn = da >= -eps;
    const bIn = db >= -eps;
    const aOut = da <= eps;
    const bOut = db <= eps;

    if (aIn) inside.push(a);
    if (aOut) outside.push(a);

    if ((da > eps && db < -eps) || (da < -eps && db > eps)) {
      const t = THREE.MathUtils.clamp(da / (da - db), 0, 1);
      const mid: TriVert = {
        p: new THREE.Vector3().lerpVectors(a.p, b.p, t),
        n: new THREE.Vector3().lerpVectors(a.n, b.n, t).normalize(),
        u: new THREE.Vector2().lerpVectors(a.u, b.u, t),
      };
      inside.push(mid);
      outside.push({ p: mid.p.clone(), n: mid.n.clone(), u: mid.u.clone() });
    } else if (aIn && !bIn && Math.abs(da) <= eps && !aOut) {
      outside.push({ p: a.p.clone(), n: a.n.clone(), u: a.u.clone() });
    } else if (!aIn && bIn && Math.abs(db) <= eps && !bOut) {
      outside.push({ p: b.p.clone(), n: b.n.clone(), u: b.u.clone() });
    }
  }
  return { inside: inside.length >= 3 ? inside : [], outside: outside.length >= 3 ? outside : [] };
}

/** Emit non-degenerate triangle fan vertices from a convex polygon into `out`. */
function pushPolygonFan(poly: TriVert[], out: TriVert[][]): void {
  if (poly.length < 3) return;
  const e1 = new THREE.Vector3();
  const e2 = new THREE.Vector3();
  const cr = new THREE.Vector3();
  for (let k = 1; k < poly.length - 1; k++) {
    e1.subVectors(poly[k].p, poly[0].p);
    e2.subVectors(poly[k + 1].p, poly[0].p);
    if (cr.crossVectors(e1, e2).lengthSq() < 1e-12) continue;
    out.push([poly[0], poly[k], poly[k + 1]]);
  }
}

/** Build a convex clip half-space from a hinge segment `(start -> end)` and an in-surface direction point. */
function makeClipPlaneFromPoints(a: THREE.Vector3, b: THREE.Vector3, upApprox: THREE.Vector3, insideSample: THREE.Vector3): ClipPlane {
  const edge = new THREE.Vector3().subVectors(b, a);
  const normal = new THREE.Vector3().crossVectors(edge, upApprox).normalize();
  if (normal.dot(new THREE.Vector3().subVectors(insideSample, a)) < 0) normal.negate();
  return { normal, dist: normal.dot(a) };
}

function makeAxisPlane(axis: 'x' | 'y' | 'z', value: number, keepGreater: boolean): ClipPlane {
  const s = keepGreater ? 1 : -1;
  const normal = new THREE.Vector3(axis === 'x' ? s : 0, axis === 'y' ? s : 0, axis === 'z' ? s : 0);
  return { normal, dist: value * s };
}

const VAPOR_VERT = /* glsl */ `
  varying vec2 vUv;
  varying float vViewGrazing;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 nV = normalize(normalMatrix * normal);
    vec3 vDir = normalize(-mv.xyz);
    vViewGrazing = mix(0.65, 1.25, pow(1.0 - abs(dot(nV, vDir)), 1.5));
    gl_Position = projectionMatrix * mv;
  }
`;

const VAPOR_FRAG = /* glsl */ `
  uniform float uIntensity;
  uniform float uTime;
  varying vec2 vUv;
  varying float vViewGrazing;

  float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise2(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash2(i), hash2(i + vec2(1.0, 0.0)), f.x), mix(hash2(i + vec2(0.0, 1.0)), hash2(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm2(vec2 p) {
    return noise2(p) * 0.62 + noise2(p * 2.13 + vec2(3.7, 1.9)) * 0.38;
  }

  void main() {
    if (uIntensity < 0.005) discard;
    // vUv.x: spanwise [0..1] (root -> tip); vUv.y: chordwise [0..1] (LE -> TE)
    float spanMask = smoothstep(0.0, 0.22, vUv.x) * (1.0 - smoothstep(0.76, 1.0, vUv.x));
    float chordMask = smoothstep(0.03, 0.24, vUv.y) * (1.0 - smoothstep(0.62, 1.0, vUv.y));
    float flow = fbm2(vec2(vUv.x * 7.5 + sin(vUv.y * 5.0) * 0.35, vUv.y * 4.5 - uTime * 9.5));
    float streaks = smoothstep(0.28, 0.84, flow);
    float alpha = clamp(spanMask * chordMask * streaks * uIntensity * vViewGrazing * 0.62, 0.0, 0.78);
    if (alpha < 0.005) discard;
    gl_FragColor = vec4(vec3(0.92, 0.96, 1.0), alpha);
  }
`;

interface HingeSurface {
  group: THREE.Group;
  axis: THREE.Vector3;
  sign: number;
}

interface AirbrakeUnit {
  pivot: THREE.Group;
  axis: THREE.Vector3;
  maxRad: number;
  piston?: { mesh: THREE.Mesh; baseLen: number };
}

interface GearLegRig {
  strut: THREE.Group;
  doors: THREE.Group[];
  doorAxis: THREE.Vector3;
  doorSigns: number[];
  piston: THREE.Group;
  pistonBaseY: number;
  wheelAnchor: THREE.Vector3;
  retractAxis: THREE.Vector3;
  retractRad: number;
  isNose: boolean;
}

interface ArticulatedRig {
  canards: [HingeSurface | null, HingeSurface | null];
  flaps: [HingeSurface | null, HingeSurface | null];
  ailerons: [HingeSurface | null, HingeSurface | null];
  slats: [HingeSurface | null, HingeSurface | null];
  stabs: [HingeSurface | null, HingeSurface | null];
  rudders: HingeSurface[];
  wingFlex: [THREE.Group | null, THREE.Group | null];
  tvcPivots: THREE.Group[];
  irisPetals: THREE.Group[][];
  airbrakes: AirbrakeUnit[];
  gear: GearLegRig[];
  taxiLight: THREE.Sprite | null;
  vaporMat: THREE.ShaderMaterial | null;
  smooth: JetSurfaceState;
  smoothFlexRad: number;
  smoothOleoM: number;
}

export class JetModel {
  public readonly root = new THREE.Group();
  public readonly eye = new THREE.Vector3(0, 0.98, -4.55);
  public readonly nozzles = [new THREE.Vector3(-0.56, 0, 8.2), new THREE.Vector3(0.56, 0, 8.2)];
  public readonly wingtips = [new THREE.Vector3(-5.45, -0.02, 4.4), new THREE.Vector3(5.45, -0.02, 4.4)];
  /** LERX / canard-strake vortex shedding anchors, port then starboard (jet frame). */
  public readonly strakes = [new THREE.Vector3(-1.35, 0.08, -2.4), new THREE.Vector3(1.35, 0.08, -2.4)];
  /** Extended landing gear contact centres: [nose, port main, starboard main] in jet frame. */
  public readonly wheels = [
    new THREE.Vector3(0, -1.62, -4.4),
    new THREE.Vector3(-1.55, -1.62, 1.35),
    new THREE.Vector3(1.55, -1.62, 1.35),
  ];
  /** Active airframe identifier (`kestrel`, `gripen`, or `su30`). */
  public airframeId: JetAirframeId = 'kestrel';
  /** Smoothed surface/iris/gear state applied this frame. */
  public readonly surfaceState: JetSurfaceState = createJetSurfaceState();
  /** Meshes hidden in the cockpit view (the pilot's own helmet). */
  public readonly pilot = new THREE.Group();
  /** The pilot's helmet: hidden when the camera is on it (the helmet-mounted GoPro). */
  public crewHead: THREE.Object3D | null = null;
  private canopyGlass!: THREE.MeshPhysicalMaterial;

  /** The procedural airframe: flown until a loaded model takes over. */
  private body = new THREE.Group();
  /** A loaded airframe model (see loadAirframe), or null. */
  public airframe: THREE.Object3D | null = null;
  private insideMeshes: THREE.Object3D[] = [];
  private readonly clipU = {
    uClipOn: { value: 0 },
    uRootInv: { value: new THREE.Matrix4() },
  };
  private insideOn = false;
  private glassInside: THREE.MeshStandardMaterial | null = null;
  /** The Sun's direction in view space, and how much it lights the canopy (0 shade .. 1). */
  private glassSun = { value: new THREE.Vector3(0, 0, -1) };
  private glassSunK = { value: 0 };
  /** The eye in the jet's frame (metres), and the jet frame's rotation to world: for the pilot's reflection. */
  private glassEye = { value: new THREE.Vector3(0, 0.6, -4.6) };
  private glassToWorld = { value: new THREE.Matrix3() };
  private glassTmp = new THREE.Vector3();
  private glassMat4 = new THREE.Matrix4();

  /** Where the eye is (world position, in the scene the cockpit is drawn in): the canopy mirrors the pilot. */
  public setGlassEye(eyeWorld: THREE.Vector3): void {
    this.root.updateMatrixWorld();
    this.glassEye.value.copy(this.root.worldToLocal(this.glassTmp.copy(eyeWorld)));
    this.glassToWorld.value.setFromMatrix4(this.glassMat4.extractRotation(this.root.matrixWorld));
  }

  /** The Sun on the canopy glass: its direction in the overlay camera's view, and strength. */
  public setGlassSun(viewDir: THREE.Vector3, k: number): void {
    this.glassSun.value.copy(viewDir).normalize();
    this.glassSunK.value = k;
  }

  /**
   * The canopy reflects this: the lit cockpit captured from the pilot's eye, with the world outside
   * round it. Sampled as it is, sharp, by the glass's own shader: near-mirror glass needs no
   * prefiltered (blurred) copy, whose making every few frames cost the GPU 40-60 ms
   */
  public setGlassReflection(map: THREE.CubeTexture | THREE.Texture | null): void {
    this.glassEnv.value = map;
    this.glassEnvK.value = map ? 1 : 0;
  }
  private glassEnv: { value: THREE.Texture | null } = { value: null };
  private glassEnvK = { value: 0 };

  /** The canopy bubble (hidden while the cockpit is captured for its own reflection). */
  public get canopyBubble(): THREE.Mesh | null {
    return this.bubble;
  }
  private bubble: THREE.Mesh | null = null;

  /**
   * One continuous canopy bubble through the measured stations: at each, an arch from sill to sill
   * over the crown (a superellipse, flatter at the top as real canopies are), drawn a few mm
   * outside the model's own glass. No pieces, no seams, so the glass reads as one sweep round you.
   */
  private buildBubble(profile: Array<[number, number, number, number]>): THREE.Mesh {
    const nz = 64;
    const na = 56;
    const pos: number[] = [];
    const uvs: number[] = [];
    const idx: number[] = [];
    const at = (z: number): [number, number, number] => {
      if (z <= profile[0][0]) return [profile[0][1], profile[0][2], profile[0][3]];
      for (let i = 1; i < profile.length; i++) {
        const [z1, s1, c1, w1] = profile[i];
        const [z0, s0, c0, w0] = profile[i - 1];
        if (z <= z1) {
          const f = (z - z0) / (z1 - z0);
          const e = f * f * (3 - 2 * f);
          return [s0 + (s1 - s0) * f, c0 + (c1 - c0) * e, w0 + (w1 - w0) * f];
        }
      }
      const last = profile[profile.length - 1];
      return [last[1], last[2], last[3]];
    };
    const z0 = profile[0][0];
    const z1 = profile[profile.length - 1][0];
    for (let i = 0; i <= nz; i++) {
      const z = z0 + ((z1 - z0) * i) / nz;
      const [sill, crown, half] = at(z);
      for (let j = 0; j <= na; j++) {
        const t = (j / na) * Math.PI;
        const c = Math.cos(t);
        const sn = Math.sin(t);
        // Superellipse arch (exponent 2.6): sides near vertical, a broad rounded top
        const x = -Math.sign(c) * Math.pow(Math.abs(c), 2 / 2.6) * half * 1.012;
        const y = sill + Math.pow(sn, 2 / 2.6) * (crown - sill) * 1.008 + 0.004;
        pos.push(x, y, z);
        uvs.push(j / na, i / nz);
      }
    }
    for (let i = 0; i < nz; i++) {
      for (let j = 0; j < na; j++) {
        const a = i * (na + 1) + j;
        const b = a + na + 1;
        idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    // Round the arch (0 left sill .. 1 right sill) and along it (0 nose .. 1 rear bow)
    g.setAttribute('aGlassUv', new THREE.Float32BufferAttribute(uvs, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    this.disposables.push(g);
    const mesh = new THREE.Mesh(g, this.insideGlass());
    mesh.name = 'canopy_bubble';
    mesh.renderOrder = 30;
    mesh.frustumCulled = false;
    mesh.userData.noAO = true;
    mesh.visible = false;
    return mesh;
  }

  /** The canopy's frame seen from inside: the sill rails with their seals, and the rear bow. */
  private canopyFrame: THREE.Group | null = null;

  /**
   * The frame the bubble sits in, built on the bubble's own shape so glass and frame meet exactly:
   * along each side a sill rail (a painted, chamfered extrusion with the glass seated in a black
   * rubber seal, bolt heads along its top), and behind the head the rear bow, an arch of the same
   * section. No bow in front: the canopy is one long oval of clear acrylic from the nose back, as
   * in a single-piece bubble canopy. It is what makes the glass's shape legible from inside.
   */
  private buildCanopyFrame(profile: Array<[number, number, number, number]>): THREE.Group {
    const group = new THREE.Group();
    group.name = 'canopy_frame';
    // The cockpit's own grey (the Gripen's interior), a little worn; flush fasteners, not studs
    const paint = new THREE.MeshStandardMaterial({ color: 0x3b4148, roughness: 0.62, metalness: 0.25 });
    const seal = new THREE.MeshStandardMaterial({ color: 0x08090a, roughness: 0.88, metalness: 0 });
    const steel = new THREE.MeshStandardMaterial({ color: 0x4d535a, roughness: 0.5, metalness: 0.6 });
    this.disposables.push(paint, seal, steel);
    const z0 = profile[0][0];
    const z1 = profile[profile.length - 1][0];
    // Rail and seal sections: a = towards the cockpit's middle (m), b = up (m), glass edge at 0,0
    const rail: Array<[number, number]> = [[-0.014, -0.034], [0.062, -0.034], [0.074, -0.012], [0.068, 0.006], [0.03, 0.016], [-0.014, 0.016]];
    const bead: Array<[number, number]> = [[0.001, 0.015], [0.018, 0.015], [0.016, 0.026], [0.009, 0.031], [0.003, 0.027]];
    const tmp = new THREE.Vector3();
    const n = 72;
    for (const side of [-1, 1]) {
      const st: Array<{ p: THREE.Vector3; across: THREE.Vector3; up: THREE.Vector3 }> = [];
      // The rails start a little behind the nose, where the bubble is tall enough to have a side
      const za = z0 + (z1 - z0) * 0.06;
      for (let i = 0; i <= n; i++) {
        const z = za + ((z1 + 0.03 - za) * i) / n;
        const [sill, crown, half] = bubbleStation(profile, Math.min(z, z1));
        archPoint(sill, crown, half, side < 0 ? 0 : Math.PI, z, tmp);
        st.push({ p: tmp.clone(), across: new THREE.Vector3(-Math.sign(tmp.x), 0, 0), up: new THREE.Vector3(0, 1, 0) });
      }
      for (const [sec, mat] of [[rail, paint], [bead, seal]] as const) {
        const g = sweep(st, sec as Array<[number, number]>);
        this.disposables.push(g);
        const m = new THREE.Mesh(g, mat);
        m.renderOrder = 29;
        group.add(m);
      }
      // Bolt heads along the rail's top
      const boltGeo = new THREE.CylinderGeometry(0.0035, 0.004, 0.0015, 10);
      this.disposables.push(boltGeo);
      const count = Math.floor((z1 - za) / 0.11);
      const bolts = new THREE.InstancedMesh(boltGeo, steel, count);
      const mtx = new THREE.Matrix4();
      for (let i = 0; i < count; i++) {
        const z = za + 0.06 + i * 0.11;
        const [sill, crown, half] = bubbleStation(profile, z);
        archPoint(sill, crown, half, side < 0 ? 0 : Math.PI, z, tmp);
        mtx.makeTranslation(tmp.x - Math.sign(tmp.x) * 0.045, tmp.y + 0.013, z);
        bolts.setMatrixAt(i, mtx);
      }
      group.add(bolts);
    }
    // The rear bow: the arch of the last station, the same section turned to face forward
    {
      const [sill, crown, half] = bubbleStation(profile, z1);
      const st: Array<{ p: THREE.Vector3; across: THREE.Vector3; up: THREE.Vector3 }> = [];
      const centre = new THREE.Vector3(0, sill, z1);
      const na = 64;
      for (let j = 0; j <= na; j++) {
        const t = (j / na) * Math.PI;
        const p = archPoint(sill, crown, half, t, z1 + 0.012, new THREE.Vector3());
        // Inward: towards the arch's middle, in the arch's plane
        const across = new THREE.Vector3(centre.x - p.x, (centre.y + (crown - sill) * 0.25) - p.y, 0).normalize();
        st.push({ p, across, up: new THREE.Vector3(0, 0, 1) });
      }
      const bow: Array<[number, number]> = [[-0.012, -0.02], [0.05, -0.02], [0.06, 0.0], [0.055, 0.055], [-0.012, 0.065]];
      const bowSeal: Array<[number, number]> = [[0.0, -0.032], [0.016, -0.032], [0.014, -0.02], [0.002, -0.02]];
      for (const [sec, mat] of [[bow, paint], [bowSeal, seal]] as const) {
        const g = sweep(st, sec as Array<[number, number]>);
        this.disposables.push(g);
        const m = new THREE.Mesh(g, mat);
        m.renderOrder = 29;
        group.add(m);
      }
    }
    group.visible = false;
    return group;
  }

  /**
   * The canopy from inside, as glass: almost clear looking straight through, a mirror of the sky
   * at grazing angles (Fresnel), so the bubble is felt all round you, with the Sun's glint on it.
   * No diffuse colour (glass does not scatter), only reflection of the environment cube (the real
   * scene from where the jet is) and the Sun; the opacity follows the Fresnel term, so the
   * reflection shows where real glass reflects and nowhere else.
   */
  private insideGlass(): THREE.MeshStandardMaterial {
    if (this.glassInside) return this.glassInside;
    const m = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0, roughness: 0.03, transparent: true, depthWrite: false, side: THREE.DoubleSide,
      // Glass adds its reflection to what is seen through it and takes away only a little (its tint,
      // its dust): colour + background x (1 - alpha), the colour already weighted by the Fresnel term
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uGlassSun = this.glassSun;
      shader.uniforms.uGlassSunK = this.glassSunK;
      shader.uniforms.uGlassEnv = this.glassEnv;
      shader.uniforms.uGlassEnvK = this.glassEnvK;
      shader.uniforms.uGlassEye = this.glassEye;
      shader.uniforms.uGlassToWorld = this.glassToWorld;
      // Dust and wiped smears fixed to the glass itself (they shift with the head, as on a real canopy)
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vGlassLocal;\nattribute vec2 aGlassUv;\nvarying vec2 vGlassUv;\nvarying vec3 vGlassNrm;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvGlassLocal = position;\nvGlassUv = aGlassUv;\nvGlassNrm = objectNormal;');
      // Only the environment is reflected (the real scene from the jet, the Sun in it once, where
      // it is): the cockpit's own lamps made a row of false highlights slide across the bubble
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <lights_fragment_end>',
        `#include <lights_fragment_end>
reflectedLight.directSpecular = vec3(0.0);
reflectedLight.directDiffuse = vec3(0.0);
// The scene's blurred environment too: the glass reflects its own sharp capture (uGlassEnv)
reflectedLight.indirectSpecular = vec3(0.0);
reflectedLight.indirectDiffuse = vec3(0.0);`,
      );
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>
uniform vec3 uGlassSun;
uniform float uGlassSunK;
uniform samplerCube uGlassEnv;
uniform float uGlassEnvK;
varying vec3 vGlassLocal;
varying vec2 vGlassUv;
varying vec3 vGlassNrm;
uniform vec3 uGlassEye;
uniform mat3 uGlassToWorld;
// Ray against an ellipsoid (centre c, radii r): distance along the ray, or -1
float gEllipsoid(vec3 o, vec3 d, vec3 c, vec3 r) {
  vec3 oc = (o - c) / r;
  vec3 dd = d / r;
  float a = dot(dd, dd);
  float b = dot(oc, dd);
  float h = b * b - a * (dot(oc, oc) - 1.0);
  if (h < 0.0) return -1.0;
  float t = (-b - sqrt(h)) / a;
  return t > 0.0 ? t : -1.0;
}
float gH(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float gSpecks(vec3 p, float scale) {
  vec3 q = p * scale;
  vec3 c = floor(q);
  vec3 f = fract(q) - 0.5;
  float r = 0.06 + 0.16 * gH(c + 3.1);
  return step(0.82, gH(c)) * smoothstep(r, r * 0.3, length(f));
}`)
        .replace(
        '#include <opaque_fragment>',
        `{
  vec3 V = normalize(vViewPosition);
  float nv = abs(dot(normalize(normal), V));
  float fres = pow(1.0 - nv, 3.5);
  // The glass: a faint film everywhere (a cool coating) and the reflection of the cockpit and the
  // world round it, ~4% head-on per surface (Schlick), rising towards grazing angles; a canopy
  // shows ~8% from its two faces, so the bright things, the displays, the sky, the Sun, are seen
  // in it from any angle
  vec3 reflDir = inverseTransformDirection(reflect(-V, normalize(normal)), viewMatrix);
  // ~8% head-on (two faces at ~4%), rising to ~45% at grazing angles (a coated canopy reflects
  // less than bare glass's mirror at the edge)
  float reflK = mix(0.08, 0.45, pow(1.0 - nv, 4.0));
  vec3 mirrored = textureCube(uGlassEnv, reflDir).rgb;
  // The pilot in the glass: the cube is captured from the eye, inside the helmet, so it can never
  // see the pilot; the helmet and the shoulders are traced here instead, as the glass mirrors
  // them back (looking sideways you see your own helmet faintly in the canopy, as in real footage)
  {
    vec3 Vl = normalize(vGlassLocal - uGlassEye);
    vec3 Rl = reflect(Vl, normalize(vGlassNrm));
    vec3 headC = uGlassEye + vec3(0.0, 0.025, 0.075);
    float tHead = gEllipsoid(vGlassLocal, Rl, headC, vec3(0.145, 0.16, 0.16));
    vec3 shC = uGlassEye + vec3(0.0, -0.31, 0.13);
    float tSh = gEllipsoid(vGlassLocal, Rl, shC, vec3(0.27, 0.11, 0.14));
    if (tHead > 0.0 || tSh > 0.0) {
      bool head = tHead > 0.0 && (tSh < 0.0 || tHead < tSh);
      vec3 H = vGlassLocal + Rl * (head ? tHead : tSh);
      vec3 hn = normalize(head ? (H - headC) / vec3(0.145, 0.16, 0.16) : (H - shC) / vec3(0.27, 0.11, 0.14));
      vec3 nW = normalize(uGlassToWorld * hn);
      // Lit by the world round it: the environment in the surface's own direction and from above
      vec3 upW = normalize(uGlassToWorld * vec3(0.0, 1.0, 0.0));
      vec3 amb = (textureCube(uGlassEnv, nW).rgb + textureCube(uGlassEnv, upW).rgb) * 0.5;
      vec3 obj;
      if (head) {
        // The visor across the face: dark, gold-coated, a mirror itself; the shell a light grey
        bool visor = hn.z < -0.2 && hn.y > -0.45 && hn.y < 0.38;
        vec3 vr = textureCube(uGlassEnv, reflect(nW, upW)).rgb;
        obj = visor ? vec3(0.05, 0.04, 0.022) + vr * vec3(0.32, 0.26, 0.14) : vec3(0.58, 0.6, 0.62) * amb * (0.65 + 0.35 * max(hn.y, 0.0));
      } else {
        // Shoulders: olive flight suit under the harness straps
        float strap = step(abs(abs(hn.x) - 0.45), 0.08);
        obj = mix(vec3(0.21, 0.22, 0.16), vec3(0.06, 0.06, 0.055), strap) * amb;
      }
      mirrored = obj;
    }
  }
  outgoingLight = mirrored * reflK * uGlassEnvK;
  float a = 0.035 + 0.22 * fres;
  outgoingLight += vec3(0.006, 0.009, 0.014);
  // Near the frame the acrylic is thick and seen edge-on: a green-blue tint deepening into the
  // seal and a brighter mirror (this is what makes the bubble's outline readable from inside)
  float toSill = min(vGlassUv.x, 1.0 - vGlassUv.x);
  float toEnd = min(vGlassUv.y * 1.6, 1.0 - vGlassUv.y);
  float rim = 1.0 - smoothstep(0.0, 0.07, min(toSill, toEnd * 0.6));
  outgoingLight += vec3(0.010, 0.032, 0.030) * rim + textureCube(uGlassEnv, reflDir).rgb * 0.18 * rim * rim * uGlassEnvK;
  a += 0.10 * rim + 0.18 * rim * rim * rim;
  // The Sun on the curved glass: a sharp glint drawn out along the curve, and its soft sheen
  vec3 sunV = normalize(uGlassSun);
  float sAlign = max(dot(reflect(-V, normalize(normal)), sunV), 0.0);
  float glint = pow(sAlign, 900.0) * 6.0 + pow(sAlign, 60.0) * 0.12;
  outgoingLight += vec3(1.0, 0.96, 0.88) * glint * uGlassSunK;
  a += min(0.5, glint * 0.2) * uGlassSunK;
  // Dust and smears: dull in shade, lit up when the Sun is behind them
  float dust = gSpecks(vGlassLocal, 140.0) + 0.7 * gSpecks(vGlassLocal + 3.7, 310.0);
  float smear = 0.0;
  float toward = pow(max(dot(-V, uGlassSun), 0.0), 6.0) * uGlassSunK;
  outgoingLight += vec3(1.0, 0.95, 0.85) * (dust * (0.04 + 2.4 * toward) + smear * 0.12 * toward);
  a += dust * (0.05 + 0.4 * toward) + smear * 0.05 * toward;
  diffuseColor.a = clamp(a, 0.0, 0.9);
}
#include <opaque_fragment>`,
      );
    };
    m.customProgramCacheKey = () => 'solaris-canopy-glass';
    this.glassInside = m;
    this.disposables.push(m);
    return m;
  }

  /** Cockpit or GoPro view: hide the canopy frame (see AirframeAnchors.insideHideMeshes). */
  public setInsideView(on: boolean): void {
    if (on) this.clipU.uRootInv.value.copy(this.root.matrixWorld).invert();
    if (on === this.insideOn) return;
    this.insideOn = on;
    for (const m of this.insideMeshes) m.visible = !on;
    this.clipU.uClipOn.value = on ? 1 : 0;
    if (this.bubble) this.bubble.visible = on;
    if (this.canopyFrame) this.canopyFrame.visible = on;
  }

  private addInsideClip(m: THREE.MeshStandardMaterial, min: [number, number, number], max: [number, number, number]): void {
    const prev = m.onBeforeCompile;
    const box = { uClipMin: { value: new THREE.Vector3(...min) }, uClipMax: { value: new THREE.Vector3(...max) } };
    m.onBeforeCompile = (shader, renderer) => {
      prev?.call(m, shader, renderer);
      Object.assign(shader.uniforms, this.clipU, box);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>
uniform mat4 uRootInv;
varying vec3 vRootPos;`)
        .replace('#include <project_vertex>', `#include <project_vertex>
vRootPos = (uRootInv * modelMatrix * vec4(transformed, 1.0)).xyz;`);
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>
uniform float uClipOn;
uniform vec3 uClipMin;
uniform vec3 uClipMax;
varying vec3 vRootPos;`)
        .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
if (uClipOn > 0.5 && all(greaterThan(vRootPos, uClipMin)) && all(lessThan(vRootPos, uClipMax))) discard;`);
    };
    m.customProgramCacheKey = () => 'solaris-canopy-clip';
    m.needsUpdate = true;
  }

  /** True when the loaded model has its own cockpit interior. */
  public hasInterior = false;
  /** The canopy glass of the loaded model (for scratch glints), if found. */
  public canopyMesh: THREE.Mesh | null = null;
  /** The HUD combiner, if the loaded airframe has one. */
  public hud: { centre: THREE.Vector3; widthM: number } | null = null;
  /** GoPro mount position, jet frame. */
  public readonly goproMount = new THREE.Vector3(0.12, 1.1, -3.6);
  /** The pilot seen from outside and from the GoPro (helmet and shoulders). */
  public readonly crew = new THREE.Group();
  /** Length of the airframe flown, metres (sets the chase distance). */
  public length = JET_LENGTH_M;
  private plumeScale = 1;
  private nozzleFaces: THREE.Mesh[] = [];
  private plumes: THREE.Mesh[] = [];
  private plumeMat: THREE.ShaderMaterial;
  private nozzleGlowMat: THREE.MeshBasicMaterial;
  private strobes: THREE.Sprite[] = [];
  private navLights: THREE.Sprite[] = [];
  private disposables: Array<{ dispose(): void }> = [];
  private readonly tvcAnchors: [THREE.Group, THREE.Group] = [new THREE.Group(), new THREE.Group()];
  private readonly kestrelExtras = new THREE.Group();
  private readonly loadedExtras = new THREE.Group();
  private kestrelRig!: ArticulatedRig;
  private rig!: ArticulatedRig;
  private readonly rigQuat = new THREE.Quaternion();
  private readonly tmpVecA = new THREE.Vector3();
  private readonly tmpVecB = new THREE.Vector3();

  private createEmptyRig(): ArticulatedRig {
    return {
      canards: [null, null],
      flaps: [null, null],
      ailerons: [null, null],
      slats: [null, null],
      stabs: [null, null],
      rudders: [],
      wingFlex: [null, null],
      tvcPivots: [...this.tvcAnchors],
      irisPetals: [[], []],
      airbrakes: [],
      gear: [],
      taxiLight: null,
      vaporMat: null,
      smooth: createJetSurfaceState(),
      smoothFlexRad: 0,
      smoothOleoM: 0,
    };
  }

  constructor() {
    this.root.add(this.body);
    // Nothing shows until the real airframe arrives (no stand-in jet for the first seconds)
    this.root.visible = false;
    const tex = panelTextures();
    this.disposables.push(tex.color, tex.rough, tex.bump);

    const hull = new THREE.MeshPhysicalMaterial({
      color: 0xb4bcc6,
      map: tex.color,
      roughness: 0.62,
      roughnessMap: tex.rough,
      metalness: 0.32,
      bumpMap: tex.bump,
      bumpScale: 0.6,
      clearcoat: 0.25,
      clearcoatRoughness: 0.5,
      envMapIntensity: 1.0,
    });
    const darkHull = hull.clone();
    darkHull.color.set(0x5a626c);
    const edge = new THREE.MeshPhysicalMaterial({ color: 0x2b3036, roughness: 0.45, metalness: 0.4, clearcoat: 0.4 });
    const titanium = new THREE.MeshPhysicalMaterial({
      color: 0x6f6a72, roughness: 0.32, metalness: 1.0, iridescence: 0.55, iridescenceIOR: 1.6,
      iridescenceThicknessRange: [250, 700],
    });
    const intakeDark = new THREE.MeshStandardMaterial({ color: 0x050607, roughness: 0.9, metalness: 0 });
    // Thin, nearly clear glass with a faint gold film: reflections show only as Fresnel glints
    // (a mirror-bright canopy reflecting the low-resolution sky cube looked like boxes)
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x9c8f70, roughness: 0.02, metalness: 0, transparent: true, opacity: 0.2,
      iridescence: 0.25, iridescenceIOR: 1.5, iridescenceThicknessRange: [300, 500],
      envMapIntensity: 0.8, side: THREE.DoubleSide, depthWrite: false,
    });
    this.canopyGlass = glass;
    this.disposables.push(hull, darkHull, edge, titanium, intakeDark, glass);

    const add = (g: THREE.BufferGeometry, m: THREE.Material, cast = true): THREE.Mesh => {
      const mesh = new THREE.Mesh(g, m);
      mesh.castShadow = cast;
      mesh.receiveShadow = true;
      this.body.add(mesh);
      this.disposables.push(g);
      return mesh;
    };

    // Fuselage
    add(loft(FUSELAGE, 72), hull);

    this.kestrelRig = this.createEmptyRig();
    this.rig = this.kestrelRig;
    this.body.add(this.kestrelExtras);
    this.root.add(this.loadedExtras);

    // Wings: cranked arrow, a little anhedral, with articulated trailing-edge flaperons
    const wingR: Array<[number, number]> = [[1.0, -2.8], [2.6, 0.4], [5.45, 3.7], [5.45, 4.9], [3.0, 5.25], [1.0, 5.65]];
    const wingL = wingR.map(([x, z]) => [-x, z] as [number, number]).reverse();
    const wr = add(planform(wingR, 0.16, 0.05), hull);
    const wl = add(planform(wingL, 0.16, 0.05), hull);
    wr.position.y = -0.08;
    wl.position.y = -0.08;
    wr.rotation.z = -0.035;
    wl.rotation.z = 0.035;

    for (const side of [-1, 1] as const) {
      const flapPts: Array<[number, number]> =
        side > 0
          ? [[1.15, 0], [5.25, -0.58], [5.25, 0.05], [1.15, 0.52]]
          : [[-5.25, -0.58], [-1.15, 0], [-1.15, 0.52], [-5.25, 0.05]];
      const fpGeo = planform(flapPts, 0.09, 0.025);
      this.disposables.push(fpGeo);
      const mount = new THREE.Group();
      mount.position.set(0, -0.08, 5.45);
      mount.rotation.z = -side * 0.035;
      const piv = new THREE.Group();
      const fp = new THREE.Mesh(fpGeo, darkHull);
      fp.castShadow = fp.receiveShadow = true;
      piv.add(fp);
      mount.add(piv);
      this.body.add(mount);
      this.kestrelRig.ailerons[side < 0 ? 0 : 1] = {
        group: piv,
        axis: new THREE.Vector3(1, 0, -side * 0.14).normalize(),
        sign: 1,
      };
    }

    // Dark leading-edge strips (radar-absorbent treatment)
    const leR: Array<[number, number]> = [[1.0, -2.8], [2.6, 0.4], [5.45, 3.7], [5.45, 3.95], [2.55, 0.75], [1.0, -2.3]];
    const leL = leR.map(([x, z]) => [-x, z] as [number, number]).reverse();
    const ler = add(planform(leR, 0.18, 0.04), edge, false);
    const lel = add(planform(leL, 0.18, 0.04), edge, false);
    ler.position.y = -0.09;
    lel.position.y = -0.09;
    ler.rotation.z = -0.035;
    lel.rotation.z = 0.035;

    // All-moving differential stabilators
    for (const side of [-1, 1] as const) {
      const zSpindle = 6.55;
      const stPts: Array<[number, number]> =
        side > 0
          ? [[1.25, 5.3 - zSpindle], [3.35, 6.9 - zSpindle], [3.35, 7.75 - zSpindle], [1.25, 7.9 - zSpindle]]
          : [[-3.35, 6.9 - zSpindle], [-1.25, 5.3 - zSpindle], [-1.25, 7.9 - zSpindle], [-3.35, 7.75 - zSpindle]];
      const stGeo = planform(stPts, 0.1, 0.03);
      this.disposables.push(stGeo);
      const piv = new THREE.Group();
      piv.position.set(0, 0.02, zSpindle);
      const sm = new THREE.Mesh(stGeo, darkHull);
      sm.castShadow = sm.receiveShadow = true;
      piv.add(sm);
      this.body.add(piv);
      this.kestrelRig.stabs[side < 0 ? 0 : 1] = { group: piv, axis: new THREE.Vector3(1, 0, 0), sign: 1 };
    }

    // Twin canted fins with the tail art + articulated rudder trailing edges
    const finShape: Array<[number, number]> = [[3.2, 0], [5.9, 2.35], [6.65, 2.35], [6.88, 0]];
    const decal = tailDecal();
    this.disposables.push(decal);
    const decalMat = new THREE.MeshStandardMaterial({ map: decal, transparent: true, roughness: 0.6, metalness: 0.2, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    this.disposables.push(decalMat);
    for (const side of [-1, 1] as const) {
      const f = add(fin(finShape, 0.12, 0.035), hull);
      f.position.set(side * 0.95, 0.42, 0);
      f.rotation.z = -side * 0.4;
      const plane = new THREE.PlaneGeometry(2.2, 1.1);
      this.disposables.push(plane);
      const d = new THREE.Mesh(plane, decalMat);
      d.position.set(side * 0.1, 1.2, 5.8);
      d.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
      f.add(d);

      const rudPts: Array<[number, number]> = [[0, 0.1], [-0.08, 2.25], [0.48, 2.25], [0.58, 0.1]];
      const rudGeo = fin(rudPts, 0.085, 0.02);
      this.disposables.push(rudGeo);
      const rpiv = new THREE.Group();
      rpiv.position.set(0, 0, 6.82);
      const rm = new THREE.Mesh(rudGeo, darkHull);
      rm.castShadow = rm.receiveShadow = true;
      rpiv.add(rm);
      f.add(rpiv);
      this.kestrelRig.rudders.push({ group: rpiv, axis: new THREE.Vector3(0, 1, 0.04).normalize(), sign: 1 });
    }

    // Intakes: chined boxes under the wing roots, with dark mouths
    for (const side of [-1, 1]) {
      const st: Station[] = [
        { z: -2.4, w: 0.36, top: 0.34, bot: 0.34, y: 0, n: 4 },
        { z: -1.0, w: 0.46, top: 0.42, bot: 0.42, y: 0, n: 4 },
        { z: 2.2, w: 0.44, top: 0.4, bot: 0.4, y: 0, n: 4 },
      ];
      const m = add(loft(st, 32), darkHull);
      m.position.set(side * 1.42, -0.32, 0);
      const mouthGeo = new THREE.PlaneGeometry(0.66, 0.6);
      this.disposables.push(mouthGeo);
      const mouth = new THREE.Mesh(mouthGeo, intakeDark);
      mouth.position.set(side * 1.42, -0.32, -2.38);
      mouth.rotation.y = Math.PI;
      this.body.add(mouth);
    }

    // Nozzles inside TVC pivots: titanium shroud, 14-petal iris, turbine face & vectored plume
    this.nozzleGlowMat = new THREE.MeshBasicMaterial({ color: 0xff7a2a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    this.disposables.push(this.nozzleGlowMat);
    const plumeUniforms = {
      uThrottle: { value: 0.5 }, uBoost: { value: 0 }, uVacuum: { value: 1 }, uTime: { value: 0 }, uLength: { value: 9 },
    };
    const plumeMaterial = (core: number): THREE.ShaderMaterial =>
      new THREE.ShaderMaterial({
        uniforms: { ...plumeUniforms, uCore: { value: core } },
        vertexShader: PLUME_VERT,
        fragmentShader: PLUME_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
    this.plumeMat = plumeMaterial(0);
    const coreMat = plumeMaterial(1);
    this.disposables.push(this.plumeMat, coreMat);

    this.nozzles.forEach((n, i) => {
      const anchor = this.tvcAnchors[i];
      anchor.position.set(n.x, n.y, n.z - 1.05);
      this.root.add(anchor);

      const prof = [
        new THREE.Vector2(0.5, 0), new THREE.Vector2(0.53, 0.35), new THREE.Vector2(0.5, 0.75),
        new THREE.Vector2(0.43, 1.05), new THREE.Vector2(0.4, 1.06), new THREE.Vector2(0.44, 0.7), new THREE.Vector2(0.45, 0.1),
      ];
      const lathe = new THREE.LatheGeometry(prof, 18);
      lathe.rotateX(Math.PI / 2);
      this.disposables.push(lathe);
      const nz = new THREE.Mesh(lathe, titanium);
      nz.castShadow = nz.receiveShadow = true;
      nz.name = `kestrel_nozzle_${i}`;
      anchor.add(nz);
      this.kestrelRig.irisPetals[i] = this.buildNozzleIris(anchor, 0.44, 0.55, 0.42, titanium);

      const faceGeo = new THREE.CircleGeometry(0.42, 48);
      this.disposables.push(faceGeo);
      const face = new THREE.Mesh(faceGeo, this.nozzleGlowMat);
      face.position.set(0, 0, 0.35);
      anchor.add(face);
      this.nozzleFaces.push(face);

      const g = new THREE.CylinderGeometry(0.36, 0.22, 9, 48, 48, true);
      g.rotateX(-Math.PI / 2); // along +Z
      g.translate(0, 0, 4.5);
      const gc = new THREE.CylinderGeometry(0.26, 0.05, 9, 36, 24, true);
      gc.rotateX(-Math.PI / 2);
      gc.translate(0, 0, 4.5);
      this.disposables.push(g, gc);
      const p = new THREE.Mesh(g, this.plumeMat);
      const c = new THREE.Mesh(gc, coreMat);
      c.scale.set(1, 1, 0.38);
      p.add(c);
      p.position.set(0, 0, 1.05);
      p.renderOrder = 5;
      c.renderOrder = 6;
      p.frustumCulled = false;
      c.frustumCulled = false;
      anchor.add(p);
      this.plumes.push(p);
    });

    // Kestrel dorsal airbrake, retractable oleo landing gear, and over-wing condensation vapor
    this.buildAirbrakeUnits(this.kestrelRig, this.kestrelExtras, [
      { pos: new THREE.Vector3(0, 0.64, -2.0), size: new THREE.Vector3(0.82, 0.05, 1.65), axis: new THREE.Vector3(1, 0, 0), maxRad: -0.92, bayColor: 0x101318, flapColor: 0x626b76 },
    ]);
    this.buildGearRig(this.kestrelRig, this.kestrelExtras, {
      nose: new THREE.Vector3(0, -1.62, -4.4),
      mainL: new THREE.Vector3(-1.55, -1.62, 1.35),
      mainR: new THREE.Vector3(1.55, -1.62, 1.35),
      bayY: -0.58,
    });
    this.kestrelRig.vaporMat = this.buildWingVapor(this.kestrelExtras, [
      new THREE.Vector3(1.05, 0.08, -2.2),
      new THREE.Vector3(5.25, -0.1, 3.85),
      new THREE.Vector3(5.25, -0.1, 5.15),
      new THREE.Vector3(1.1, 0.08, 5.3),
    ]);

    // Canopy (gold-film glass) and the pilot
    const canopyGeo = new THREE.SphereGeometry(1, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2);
    canopyGeo.scale(0.56, 0.5, 2.05);
    this.disposables.push(canopyGeo);
    const canopy = new THREE.Mesh(canopyGeo, glass);
    canopy.position.set(0, 0.62, -4.35);
    canopy.renderOrder = 4;
    this.body.add(canopy);
    const frameGeo = new THREE.TorusGeometry(0.53, 0.035, 8, 40, Math.PI);
    this.disposables.push(frameGeo);
    for (const z of [-3.0, -5.15]) {
      const fr = new THREE.Mesh(frameGeo, edge);
      fr.position.set(0, 0.63, z);
      fr.scale.set(z < -4 ? 0.82 : 1, 0.95, 1);
      this.body.add(fr);
    }
    const helmetGeo = new THREE.SphereGeometry(0.15, 24, 16);
    const visorGeo = new THREE.SphereGeometry(0.152, 24, 12, -Math.PI * 0.42, Math.PI * 0.84, Math.PI * 0.32, Math.PI * 0.3);
    const seatGeo = new THREE.BoxGeometry(0.42, 0.6, 0.12);
    this.disposables.push(helmetGeo, visorGeo, seatGeo);
    const helmetMat = new THREE.MeshPhysicalMaterial({ color: 0xe9ecef, roughness: 0.35, clearcoat: 0.8 });
    const visorMat = new THREE.MeshPhysicalMaterial({ color: 0x8a6a2a, roughness: 0.05, metalness: 1, iridescence: 1, iridescenceIOR: 2 });
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x1a1d21, roughness: 0.8 });
    this.disposables.push(helmetMat, visorMat, seatMat);
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.set(0, 0.98, -4.4);
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.rotation.y = Math.PI;
    helmet.add(visor);
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.set(0, 0.86, -4.1);
    this.pilot.add(helmet, seat);
    this.body.add(this.pilot);

    // Lights: red port, green starboard, white tail; white strobes on the fins
    const glow = glowTexture();
    this.disposables.push(glow);
    const light = (color: number, p: THREE.Vector3, size: number, list: THREE.Sprite[]): void => {
      const m = new THREE.SpriteMaterial({ map: glow, color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
      this.disposables.push(m);
      const s = new THREE.Sprite(m);
      s.position.copy(p);
      s.scale.setScalar(size);
      s.renderOrder = 6;
      this.root.add(s);
      list.push(s);
    };
    light(0xff2a1a, new THREE.Vector3(-5.5, -0.04, 4.45), 0.55, this.navLights);
    light(0x22ff66, new THREE.Vector3(5.5, -0.04, 4.45), 0.55, this.navLights);
    light(0xffffff, new THREE.Vector3(0, 0.1, 7.7), 0.4, this.navLights);
    light(0xffffff, new THREE.Vector3(-1.9, 2.55, 7.0), 1.4, this.strobes);
    light(0xffffff, new THREE.Vector3(1.9, 2.55, 7.0), 1.4, this.strobes);
    // Formation strips: pale electroluminescent panels
    const stripGeo = new THREE.PlaneGeometry(0.06, 0.9);
    this.disposables.push(stripGeo);
    const stripMat = new THREE.MeshBasicMaterial({ color: 0x9dffc8, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    this.disposables.push(stripMat);
    for (const side of [-1, 1]) {
      const s = new THREE.Mesh(stripGeo, stripMat);
      s.position.set(side * 1.0, 0.62, -1.6);
      s.rotation.set(-Math.PI / 2, 0, side * 0.5);
      this.body.add(s);
    }

    this.root.traverse((o) => {
      o.frustumCulled = false;
    });
  }

  /**
   * Fly a loaded airframe instead of the procedural one: a glTF model in metres (meshopt
   * compression supported), turned so its nose points down -Z. The exhaust, nozzle glow, lights
   * and the pilot's eye move to the model's own positions (`anchors`, in the turned frame).
   */
  public async loadAirframe(url: string, anchors: AirframeAnchors): Promise<void> {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    const gltf = await loader.loadAsync(url);
    const model = gltf.scene;
    if (anchors.noseAlongPositiveZ) model.rotation.y = Math.PI;
    if (anchors.noseAlongPositiveX) model.rotation.y = Math.PI / 2;
    if (anchors.modelScale) model.scale.setScalar(anchors.modelScale);
    const hidden = anchors.hideMaterials ?? [];
    model.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = false;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      if (hidden.some((h) => mats[0]?.name?.startsWith(h))) mesh.visible = false;
      if (anchors.hideMeshes?.includes(mesh.name)) mesh.visible = false;
      if (anchors.insideHideMeshes?.includes(mesh.name)) this.insideMeshes.push(mesh);

      for (const clip of anchors.insideClip ?? []) {
        for (const mat of mats) {
          if (mat.name !== clip.material || mat.userData.canopyClip) continue;
          mat.userData.canopyClip = true;
          this.addInsideClip(mat as THREE.MeshStandardMaterial, clip.min, clip.max);
        }
      }
      if (mats[0]?.name?.startsWith(anchors.canopyMaterial)) this.canopyMesh = mesh;
      for (const m of mats) {
        const sm = m as THREE.MeshStandardMaterial;
        if (sm.transparent) sm.depthWrite = false;
        // Sketchfab exports fake reflections with emissive maps (mirrors glowing white, glass
        // glowing grey); here real light and the environment cube do that job
        if (sm.emissive) {
          if (sm.transparent) sm.emissive.setScalar(0);
          else if (sm.metalness >= 0.95 && sm.emissiveMap && sm.emissive.r > 0.9) {
            // Mirrors and chrome: no painted-on glow, a cleaner surface reflecting the real surroundings
            sm.emissiveIntensity = 0;
            sm.roughness = Math.min(sm.roughness, 0.25);
          }
        }
        if ('envMapIntensity' in sm) sm.envMapIntensity = 1;
        const tw = anchors.materialTweaks?.[sm.name];
        if (tw) {
          if (tw.color !== undefined) sm.color?.setHex(tw.color);
          if (tw.roughness !== undefined) sm.roughness = tw.roughness;
          if (tw.metalness !== undefined) sm.metalness = tw.metalness;
          if (tw.opacity !== undefined) sm.opacity = tw.opacity;
          if (tw.emissive !== undefined) {
            sm.emissive?.setHex(tw.emissive);
            sm.emissiveIntensity = 1;
          }
        }
        this.disposables.push(sm);
        for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap'] as const) {
          const t = sm[key] as THREE.Texture | null | undefined;
          if (t) {
            t.anisotropy = 8;
            this.disposables.push(t);
          }
        }
      }
      this.disposables.push(mesh.geometry);
    });
    this.root.add(model);
    this.airframe = model;
    if (anchors.canopyProfile) {
      this.bubble = this.buildBubble(anchors.canopyProfile);
      this.root.add(this.bubble);
      this.canopyFrame = this.buildCanopyFrame(anchors.canopyProfile);
      this.root.add(this.canopyFrame);
    }
    this.body.visible = false;
    this.root.visible = true;
    this.airframeId = anchors.airframeId ?? (anchors.nozzles.length === 1 ? 'gripen' : 'su30');
    this.hasInterior = anchors.hasInterior;
    this.length = anchors.lengthM;
    this.plumeScale = anchors.nozzleRadiusM / 0.36;

    this.eye.copy(anchors.eye);
    anchors.nozzles.forEach((n, i) => this.nozzles[i]?.copy(n));
    const single = anchors.nozzles.length === 1;
    if (single) this.nozzles[1]?.copy(anchors.nozzles[0]);
    anchors.wingtips.forEach((w, i) => this.wingtips[i]?.copy(w));
    if (anchors.strakeVortex) {
      this.strakes[0].copy(anchors.strakeVortex[0]);
      this.strakes[1].copy(anchors.strakeVortex[1]);
    }
    if (anchors.wheelAnchors) {
      this.wheels[0].copy(anchors.wheelAnchors.nose);
      this.wheels[1].copy(anchors.wheelAnchors.mainL);
      this.wheels[2].copy(anchors.wheelAnchors.mainR);
    }

    // Port red, starboard green, tail white; strobes on the fin tips
    this.navLights[0]?.position.copy(this.wingtips[0]).add(new THREE.Vector3(-0.05, 0, 0));
    this.navLights[1]?.position.copy(this.wingtips[1]).add(new THREE.Vector3(0.05, 0, 0));
    this.navLights[2]?.position.copy(anchors.tailLight);
    anchors.finTips.forEach((p, i) => this.strobes[i]?.position.copy(p));
    this.goproMount.copy(anchors.goproMount);
    this.hud = { centre: anchors.hudCentre.clone(), widthM: anchors.hudWidthM };
    this.buildCrew();
    this.setupLoadedRig(model, anchors);
  }

  /**
   * The pilot in the front seat, built to read as a person in a GoPro shot: a flight helmet (a
   * shell longer than it is wide, the visor housing on top, a gold-tinted visor down), an oxygen
   * mask with its hose running to the chest, a sage flight suit, survival-vest harness straps over
   * the shoulders, and the arms reaching down to the stick and throttle. Jet frame: nose -Z.
   */
  private buildCrew(): void {
    this.crew.clear();
    const mat = <T extends THREE.Material>(m: T): T => {
      this.disposables.push(m);
      return m;
    };
    const geo = <T extends THREE.BufferGeometry>(g: T): T => {
      this.disposables.push(g);
      return g;
    };
    const suit = mat(new THREE.MeshStandardMaterial({ color: 0x5b6150, roughness: 0.92 }));
    const vest = mat(new THREE.MeshStandardMaterial({ color: 0x3d4234, roughness: 0.85 }));
    const strap = mat(new THREE.MeshStandardMaterial({ color: 0x23251f, roughness: 0.7 }));
    const glove = mat(new THREE.MeshStandardMaterial({ color: 0x2a2622, roughness: 0.8 }));
    // Matte grey-green shell, scuffed rather than glossy
    // A worn shell: mottled paint, scuffs and small scratches (a canvas texture, no file)
    const wear = (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 512;
      const x = c.getContext('2d') as CanvasRenderingContext2D;
      x.fillStyle = '#7a7e72';
      x.fillRect(0, 0, 512, 512);
      let seed = 7;
      const rnd = (): number => {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
      };
      for (let i = 0; i < 900; i++) {
        const v = 100 + Math.floor(rnd() * 40);
        x.fillStyle = `rgba(${v},${v + 4},${v - 6},0.08)`;
        x.beginPath();
        x.arc(rnd() * 512, rnd() * 512, 4 + rnd() * 26, 0, Math.PI * 2);
        x.fill();
      }
      x.lineCap = 'round';
      for (let i = 0; i < 140; i++) {
        const px = rnd() * 512;
        const py = rnd() * 512;
        const a = rnd() * Math.PI;
        const l = 4 + rnd() * 30;
        x.strokeStyle = rnd() < 0.5 ? 'rgba(190,192,182,0.35)' : 'rgba(40,42,36,0.3)';
        x.lineWidth = 0.6 + rnd() * 1.2;
        x.beginPath();
        x.moveTo(px, py);
        x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l);
        x.stroke();
      }
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      this.disposables.push(t);
      return t;
    })();
    const shell = mat(new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: wear, roughness: 0.66, clearcoat: 0.1, clearcoatRoughness: 0.55 }));
    const housing = mat(new THREE.MeshStandardMaterial({ color: 0x5c6056, roughness: 0.55 }));
    const visor = mat(new THREE.MeshPhysicalMaterial({ color: 0x2b1e05, roughness: 0.04, metalness: 0.95, iridescence: 0.7, iridescenceIOR: 1.9, envMapIntensity: 1.4 }));
    const rubber = mat(new THREE.MeshStandardMaterial({ color: 0x2c2f31, roughness: 0.75 }));
    const metal = mat(new THREE.MeshStandardMaterial({ color: 0x9a9ea2, roughness: 0.35, metalness: 0.8 }));

    const head = new THREE.Group();
    this.crewHead = head;
    head.position.copy(this.eye).add(new THREE.Vector3(0, 0.06, 0.06));
    // Shell: taller and longer than wide, flattened a little at the sides
    const shellMesh = new THREE.Mesh(geo(new THREE.SphereGeometry(0.15, 40, 28)), shell);
    shellMesh.scale.set(0.9, 1.0, 1.1);
    // Visor housing: a raised cover over the brow
    const housingMesh = new THREE.Mesh(geo(new THREE.SphereGeometry(0.157, 40, 14, Math.PI * 1.18, Math.PI * 0.64, Math.PI * 0.12, Math.PI * 0.26)), housing);
    housingMesh.scale.copy(shellMesh.scale);
    // Visor down: a gold-tinted mirror over the eyes
    const visorMesh = new THREE.Mesh(geo(new THREE.SphereGeometry(0.16, 40, 14, Math.PI * 1.15, Math.PI * 0.7, Math.PI * 0.36, Math.PI * 0.2)), visor);
    visorMesh.scale.copy(shellMesh.scale);
    // Ear cups and the visor's side pivots
    const cupGeo = geo(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 20));
    const pivotGeo = geo(new THREE.CylinderGeometry(0.014, 0.014, 0.012, 12));
    for (const s of [-1, 1]) {
      const cup = new THREE.Mesh(cupGeo, housing);
      cup.rotation.z = Math.PI / 2;
      cup.position.set(s * 0.13, -0.03, 0.01);
      const pivot = new THREE.Mesh(pivotGeo, metal);
      pivot.rotation.z = Math.PI / 2;
      pivot.position.set(s * 0.142, 0.02, -0.04);
      head.add(cup, pivot);
    }
    // Oxygen mask: a rubber cup over nose and mouth with the bayonet clips
    const mask = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.03, 0.058, 0.1, 22)), rubber);
    mask.rotation.x = Math.PI / 2 + 0.35;
    mask.position.set(0, -0.085, -0.145);
    const valve = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.022, 0.022, 0.02, 16)), metal);
    valve.rotation.x = Math.PI / 2 + 0.35;
    valve.position.set(0, -0.1, -0.195);
    // The details that make it read as a flight helmet from behind: the rubber edge roll, a strip of
    // reflective tape over the crown, and the chin-strap buckles
    const rim = new THREE.Mesh(geo(new THREE.TorusGeometry(0.142, 0.011, 8, 48)), rubber);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = -0.07;
    rim.scale.set(0.92, 1.12, 1);
    const tape = new THREE.Mesh(geo(new THREE.TorusGeometry(0.151, 0.007, 6, 40, Math.PI * 0.62)), mat(new THREE.MeshStandardMaterial({ color: 0xcfcabb, roughness: 0.35, metalness: 0.2 })));
    tape.rotation.set(0, Math.PI / 2, Math.PI * 0.42);
    tape.scale.set(1.1, 1.0, 0.9);
    const buckleGeo = geo(new THREE.BoxGeometry(0.012, 0.03, 0.02));
    for (const sx of [-1, 1]) {
      const b = new THREE.Mesh(buckleGeo, metal);
      b.position.set(sx * 0.115, -0.11, -0.04);
      head.add(b);
    }
    head.add(shellMesh, housingMesh, visorMesh, mask, valve, rim, tape);

    // Hose: from the mask down to the connector on the left of the chest
    const hp = (x: number, y: number, z: number): THREE.Vector3 => head.position.clone().add(new THREE.Vector3(x, y, z));
    const hose = new THREE.Mesh(
      geo(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([hp(0, -0.13, -0.17), hp(-0.03, -0.24, -0.15), hp(-0.1, -0.34, -0.07), hp(-0.13, -0.44, 0.0)]), 28, 0.016, 10)),
      rubber
    );

    // Neck, torso, survival vest, harness
    const torsoAt = this.eye.clone().add(new THREE.Vector3(0, -0.42, 0.14));
    const neck = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.055, 0.065, 0.12, 16)), suit);
    neck.position.copy(this.eye).add(new THREE.Vector3(0, -0.13, 0.08));
    const torso = new THREE.Mesh(geo(new THREE.CapsuleGeometry(0.16, 0.26, 8, 20)), suit);
    torso.scale.set(1.3, 1, 0.72);
    torso.position.copy(torsoAt);
    const vestMesh = new THREE.Mesh(geo(new THREE.CapsuleGeometry(0.165, 0.18, 8, 20)), vest);
    vestMesh.scale.set(1.3, 1, 0.76);
    vestMesh.position.copy(torsoAt).add(new THREE.Vector3(0, 0.02, 0));
    const strapGeo = geo(new THREE.BoxGeometry(0.045, 0.42, 0.012));
    const straps: THREE.Mesh[] = [];
    for (const s of [-1, 1]) {
      const st = new THREE.Mesh(strapGeo, strap);
      st.position.copy(torsoAt).add(new THREE.Vector3(s * 0.09, 0.08, -0.13));
      st.rotation.x = -0.12;
      const back = new THREE.Mesh(strapGeo, strap);
      back.position.copy(torsoAt).add(new THREE.Vector3(s * 0.09, 0.14, 0.1));
      back.rotation.x = 0.5;
      straps.push(st, back);
    }

    // Arms: upper arm down from the shoulder, forearm forward to the stick (right) and throttle (left)
    const limb = (from: THREE.Vector3, to: THREE.Vector3, r: number, m: THREE.Material): THREE.Mesh => {
      const len = from.distanceTo(to);
      const mesh = new THREE.Mesh(geo(new THREE.CapsuleGeometry(r, Math.max(0.01, len - 2 * r), 6, 14)), m);
      mesh.position.copy(from).add(to).multiplyScalar(0.5);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
      return mesh;
    };
    const e = this.eye;
    const arms: THREE.Mesh[] = [];
    for (const s of [-1, 1]) {
      const shoulder = e.clone().add(new THREE.Vector3(s * 0.2, -0.3, 0.12));
      const elbow = e.clone().add(new THREE.Vector3(s * 0.24, -0.55, -0.06));
      const hand = e.clone().add(new THREE.Vector3(s * (s > 0 ? 0.06 : 0.22), -0.58, -0.36));
      arms.push(limb(shoulder, elbow, 0.055, suit), limb(elbow, hand, 0.047, suit));
      const fist = new THREE.Mesh(geo(new THREE.SphereGeometry(0.045, 16, 12)), glove);
      fist.scale.set(1, 0.85, 1.25);
      fist.position.copy(hand);
      arms.push(fist);
    }

    this.crew.add(head, hose, neck, torso, vestMesh, ...straps, ...arms);
    this.crew.traverse((o) => {
      o.castShadow = true;
      o.receiveShadow = true;
      o.frustumCulled = false;
    });
    this.root.add(this.crew);
  }

  private readonly rigAxisZ = new THREE.Vector3(0, 0, 1);

  private readonly baseWingtips: [THREE.Vector3, THREE.Vector3] = [
    new THREE.Vector3(-5.45, -0.02, 4.4),
    new THREE.Vector3(5.45, -0.02, 4.4),
  ];

  /** World position of landing gear contact [0 = nose, 1 = port main, 2 = stbd main]. */
  public getWheelWorld(index: 0 | 1 | 2, out = new THREE.Vector3()): THREE.Vector3 {
    return out.copy(this.wheels[index]).applyMatrix4(this.root.matrixWorld);
  }

  /** Build 14 overlapping titanium iris petals (convergent-divergent AB nozzle). */
  private buildNozzleIris(
    parent: THREE.Group,
    innerR: number,
    lengthM: number,
    hingeZ: number,
    mat?: THREE.Material,
  ): THREE.Group[] {
    const petalMat =
      mat ??
      new THREE.MeshPhysicalMaterial({
        color: 0x2c2f36,
        roughness: 0.44,
        metalness: 0.88,
        iridescence: 0.14,
        iridescenceIOR: 1.4,
        iridescenceThicknessRange: [180, 320],
        side: THREE.DoubleSide,
      });
    if (!mat) this.disposables.push(petalMat);

    const petalCount = 20;
    const petalLen = Math.max(0.28, lengthM * 0.72);
    const petalW = ((Math.PI * 2 * innerR) / petalCount) * 1.28;
    const petalGeo = new THREE.BoxGeometry(petalW, 0.016, petalLen);
    petalGeo.translate(0, 0, petalLen * 0.5);
    this.disposables.push(petalGeo);

    const petals: THREE.Group[] = [];
    const ring = new THREE.Group();
    ring.position.set(0, 0, hingeZ);
    parent.add(ring);

    for (let k = 0; k < petalCount; k++) {
      const ang = (k / petalCount) * Math.PI * 2;
      const radialR = innerR * (k % 2 === 0 ? 1.0 : 0.975);
      const carrier = new THREE.Group();
      carrier.position.set(Math.cos(ang) * radialR, Math.sin(ang) * radialR, 0);
      // Local +Y of carrier points radially outward; +X is tangential clockwise.
      carrier.rotation.z = ang - Math.PI / 2;
      const pivot = new THREE.Group();
      const mesh = new THREE.Mesh(petalGeo, petalMat);
      mesh.castShadow = false;
      mesh.receiveShadow = true;
      pivot.add(mesh);
      carrier.add(pivot);
      ring.add(carrier);
      petals.push(pivot);
    }
    return petals;
  }

  /** Build conformal dorsal or fuselage airbrakes with dark hydraulic bays and telescoping struts. */
  private buildAirbrakeUnits(
    rig: ArticulatedRig,
    parent: THREE.Group,
    specs: Array<{
      pos: THREE.Vector3;
      size: THREE.Vector3;
      axis: THREE.Vector3;
      maxRad: number;
      bayColor: number;
      flapColor: number;
      tiltY?: number;
      tiltZ?: number;
    }>,
  ): void {
    const bayMat = new THREE.MeshStandardMaterial({ color: specs[0]?.bayColor ?? 0x101318, roughness: 0.85, metalness: 0.35 });
    const pistonMat = new THREE.MeshStandardMaterial({ color: 0xb8c0c8, roughness: 0.25, metalness: 0.9 });
    this.disposables.push(bayMat, pistonMat);

    for (const sp of specs) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: sp.flapColor,
        roughness: 0.55,
        metalness: 0.38,
        clearcoat: 0.25,
      });
      this.disposables.push(mat);

      const mount = new THREE.Group();
      mount.position.copy(sp.pos);
      if (sp.tiltY) mount.rotation.y = sp.tiltY;
      if (sp.tiltZ) mount.rotation.z = sp.tiltZ;
      parent.add(mount);

      const bayGeo = new THREE.BoxGeometry(sp.size.x * 0.92, sp.size.y * 0.55, sp.size.z * 0.94);
      bayGeo.translate(0, -sp.size.y * 0.45, sp.size.z * 0.5);
      const flapGeo = new THREE.BoxGeometry(sp.size.x, sp.size.y, sp.size.z);
      flapGeo.translate(0, 0, sp.size.z * 0.5);
      const baseLen = sp.size.z * 0.45;
      const rodGeo = new THREE.CylinderGeometry(0.022, 0.026, baseLen, 8);
      rodGeo.rotateX(Math.PI / 2);
      rodGeo.translate(0, 0, baseLen * 0.5);
      this.disposables.push(bayGeo, flapGeo, rodGeo);

      const bay = new THREE.Mesh(bayGeo, bayMat);
      bay.receiveShadow = true;
      mount.add(bay);

      const pivot = new THREE.Group();
      const flap = new THREE.Mesh(flapGeo, mat);
      flap.castShadow = flap.receiveShadow = true;
      pivot.add(flap);
      mount.add(pivot);

      const piston = new THREE.Mesh(rodGeo, pistonMat);
      piston.position.set(0, 0.01, sp.size.z * 0.14);
      mount.add(piston);

      rig.airbrakes.push({ pivot, axis: sp.axis.clone().normalize(), maxRad: sp.maxRad, piston: { mesh: piston, baseLen } });
    }
  }

  /** Build 3-strut retractable oleo-pneumatic landing gear with articulated doors and nose taxi light. */
  private buildGearRig(
    rig: ArticulatedRig,
    parent: THREE.Group,
    cfg: { nose: THREE.Vector3; mainL: THREE.Vector3; mainR: THREE.Vector3; bayY: number },
  ): void {
    const legMat = new THREE.MeshStandardMaterial({ color: 0xc2c8ce, roughness: 0.48, metalness: 0.55 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe6ecf2, roughness: 0.14, metalness: 0.95 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x16181c, roughness: 0.92, metalness: 0.05 });
    const hubMat = new THREE.MeshStandardMaterial({ color: 0xd0d4da, roughness: 0.42, metalness: 0.65 });
    const bayMat = new THREE.MeshStandardMaterial({ color: 0x12151a, roughness: 0.85, metalness: 0.25 });
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x626b75, roughness: 0.6, metalness: 0.35 });
    this.disposables.push(legMat, chromeMat, tireMat, hubMat, bayMat, doorMat);

    const legs = [
      { pos: cfg.nose, isNose: true, retractAxis: new THREE.Vector3(1, 0, 0), retractRad: 1.52 },
      { pos: cfg.mainL, isNose: false, retractAxis: new THREE.Vector3(0, 0, 1), retractRad: 1.48 },
      { pos: cfg.mainR, isNose: false, retractAxis: new THREE.Vector3(0, 0, 1), retractRad: -1.48 },
    ];

    for (const lg of legs) {
      const lengthM = Math.max(0.55, cfg.bayY - lg.pos.y);
      const wheelR = lg.isNose ? 0.22 : 0.34;
      const wheelW = lg.isNose ? 0.13 : 0.22;
      const mount = new THREE.Group();
      mount.position.set(lg.pos.x, cfg.bayY, lg.pos.z);
      parent.add(mount);

      const bayGeo = new THREE.BoxGeometry(lg.isNose ? 0.44 : 0.56, 0.04, lg.isNose ? 0.95 : 1.05);
      this.disposables.push(bayGeo);
      const bay = new THREE.Mesh(bayGeo, bayMat);
      bay.position.y = 0.01;
      mount.add(bay);

      const doorGeo = new THREE.BoxGeometry(lg.isNose ? 0.21 : 0.27, 0.025, lg.isNose ? 0.92 : 1.02);
      this.disposables.push(doorGeo);
      const doors: THREE.Group[] = [];
      const doorSigns = [-1, 1];
      for (const s of doorSigns) {
        const dp = new THREE.Group();
        dp.position.set(s * (lg.isNose ? 0.21 : 0.27), -0.01, 0);
        const dm = new THREE.Mesh(doorGeo, doorMat);
        dm.position.x = -s * (lg.isNose ? 0.105 : 0.135);
        dp.add(dm);
        mount.add(dp);
        doors.push(dp);
      }

      const strut = new THREE.Group();
      mount.add(strut);
      const upperLen = Math.max(0.28, lengthM - wheelR - 0.24);
      const upperGeo = new THREE.CylinderGeometry(lg.isNose ? 0.045 : 0.06, lg.isNose ? 0.05 : 0.065, upperLen, 10);
      upperGeo.translate(0, -upperLen * 0.5, 0);
      const braceGeo = new THREE.CylinderGeometry(0.022, 0.022, upperLen * 0.9, 8);
      braceGeo.translate(0, -upperLen * 0.45, 0);
      const brace = new THREE.Mesh(braceGeo, legMat);
      brace.position.set(0, -0.02, lg.isNose ? -0.18 : 0.18);
      brace.rotation.x = lg.isNose ? -0.42 : 0.42;
      strut.add(new THREE.Mesh(upperGeo, legMat), brace);
      this.disposables.push(upperGeo, braceGeo);

      const piston = new THREE.Group();
      piston.position.y = -upperLen;
      strut.add(piston);
      const oleoGeo = new THREE.CylinderGeometry(lg.isNose ? 0.032 : 0.044, lg.isNose ? 0.032 : 0.044, 0.34, 10);
      oleoGeo.translate(0, -0.12, 0);
      const tireGeo = new THREE.CylinderGeometry(wheelR, wheelR, wheelW, 18);
      tireGeo.rotateZ(Math.PI / 2);
      const hubGeo = new THREE.CylinderGeometry(wheelR * 0.56, wheelR * 0.56, wheelW * 1.04, 12);
      hubGeo.rotateZ(Math.PI / 2);
      this.disposables.push(oleoGeo, tireGeo, hubGeo);
      piston.add(new THREE.Mesh(oleoGeo, chromeMat));

      const offsets = lg.isNose ? [-0.1, 0.1] : [0];
      for (const ox of offsets) {
        const w = new THREE.Mesh(tireGeo, tireMat);
        const h = new THREE.Mesh(hubGeo, hubMat);
        w.position.set(ox, -(lengthM - upperLen - wheelR), 0);
        h.position.copy(w.position);
        w.castShadow = true;
        piston.add(w, h);
      }

      if (lg.isNose) {
        const lampGlow = glowTexture();
        this.disposables.push(lampGlow);
        const sm = new THREE.SpriteMaterial({
          map: lampGlow,
          color: 0xf7fbff,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        });
        this.disposables.push(sm);
        const taxi = new THREE.Sprite(sm);
        taxi.position.set(0, -0.22, -0.12);
        taxi.scale.setScalar(0.52);
        strut.add(taxi);
        rig.taxiLight = taxi;
      }

      rig.gear.push({
        strut,
        doors,
        doorAxis: new THREE.Vector3(0, 0, 1),
        doorSigns,
        piston,
        pistonBaseY: -upperLen,
        wheelAnchor: lg.pos.clone(),
        retractAxis: lg.retractAxis,
        retractRad: lg.retractRad,
        isNose: lg.isNose,
      });
    }
  }

  /** Build symmetrical conformal upper-wing / LERX condensation vapor sheets driven by AoA, q and Mach. */
  private buildWingVapor(
    parent: THREE.Group,
    quadR: [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3],
  ): THREE.ShaderMaterial {
    const segU = 12;
    const segV = 12;
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];
    const [rLE, tLE, tTE, rTE] = quadR;
    const pA = new THREE.Vector3();
    const pB = new THREE.Vector3();
    const pC = new THREE.Vector3();

    for (const side of [-1, 1]) {
      const base = pos.length / 3;
      for (let j = 0; j <= segV; j++) {
        const v = j / segV;
        pA.lerpVectors(rLE, rTE, v);
        pB.lerpVectors(tLE, tTE, v);
        for (let i = 0; i <= segU; i++) {
          const u = i / segU;
          pC.lerpVectors(pA, pB, u);
          // Slight aerodynamic suction bow along middle chord
          const arch = Math.sin(v * Math.PI) * (1 - u * 0.45) * 0.14;
          pos.push(pC.x * side, pC.y + arch, pC.z);
          uv.push(u, v);
        }
      }
      for (let j = 0; j < segV; j++) {
        for (let i = 0; i < segU; i++) {
          const a = base + j * (segU + 1) + i;
          const b = a + 1;
          const c = a + segU + 1;
          const d = c + 1;
          idx.push(a, c, b, b, c, d);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const mat = new THREE.ShaderMaterial({
      uniforms: { uIntensity: { value: 0 }, uTime: { value: 0 } },
      vertexShader: VAPOR_VERT,
      fragmentShader: VAPOR_FRAG,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.disposables.push(geo, mat);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = 4;
    mesh.frustumCulled = false;
    parent.add(mesh);
    return mat;
  }

  /**
   * Partition straddling & interior triangles of merged GLB meshes along exact convex hinge planes
   * into independent pivoted `THREE.Group` parts without holes or jagged borders.
   */
  private carveAirframeParts(
    model: THREE.Object3D,
    specs: SlicePartSpec[],
    targetParent: THREE.Group,
  ): Map<string, CarvedPart> {
    const out = new Map<string, CarvedPart>();
    if (!specs.length) return out;
    this.root.updateMatrixWorld(true);
    const toJet = new THREE.Matrix4().copy(this.root.matrixWorld).invert();
    const meshes: THREE.Mesh[] = [];
    model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.visible) meshes.push(m);
    });

    const states = new Map<
      THREE.Mesh,
      {
        tris: TriVert[][];
        dirty: boolean;
        invM: THREE.Matrix4;
        invNormalM: THREE.Matrix3;
        matName: string;
        mat: THREE.Material | THREE.Material[];
      }
    >();

    for (const spec of specs) {
      const g = new THREE.Group();
      g.position.copy(spec.pivot);
      targetParent.add(g);
      if (spec.addHingeSpar) {
        const s = spec.addHingeSpar;
        const len = s.start.distanceTo(s.end);
        const sparGeo = new THREE.CylinderGeometry(s.radius, s.radius, len, 8);
        const sparMat = new THREE.MeshStandardMaterial({ color: 0x1a1e24, roughness: 0.78, metalness: 0.5 });
        this.disposables.push(sparGeo, sparMat);
        const spar = new THREE.Mesh(sparGeo, sparMat);
        const mid = new THREE.Vector3().addVectors(s.start, s.end).multiplyScalar(0.5).sub(spec.pivot);
        const dir = new THREE.Vector3().subVectors(s.end, s.start).normalize();
        spar.position.copy(mid);
        spar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        g.add(spar);
      }
      out.set(spec.id, { id: spec.id, group: g, triangleCount: 0 });
    }

    const triBox = new THREE.Box3();
    for (const mesh of meshes) {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const matName = mats[0]?.name ?? '';
      const relevant = specs.filter((sp) => !sp.materialPrefixes || sp.materialPrefixes.some((p) => matName.startsWith(p)));
      if (!relevant.length) continue;

      const geo = mesh.geometry;
      const pos = geo.attributes.position;
      if (!pos) continue;
      const nor = geo.attributes.normal;
      const uv = geo.attributes.uv;
      const idx = geo.index;

      const m = new THREE.Matrix4().multiplyMatrices(toJet, mesh.matrixWorld);
      const normalM = new THREE.Matrix3().getNormalMatrix(m);
      const invM = new THREE.Matrix4().copy(m).invert();
      const invNormalM = new THREE.Matrix3().getNormalMatrix(invM);

      // Quick mesh AABB reject in jet space
      if (!geo.boundingBox) geo.computeBoundingBox();
      const meshJetBox = geo.boundingBox!.clone().applyMatrix4(m);
      const activeSpecs = relevant.filter((sp) => !sp.bounds || meshJetBox.intersectsBox(sp.bounds));
      if (!activeSpecs.length) continue;

      const cnt = idx ? idx.count : pos.count;
      const tris: TriVert[][] = [];
      for (let t = 0; t < cnt; t += 3) {
        const tri: TriVert[] = [];
        for (let k = 0; k < 3; k++) {
          const vi = idx ? idx.getX(t + k) : t + k;
          tri.push({
            p: new THREE.Vector3().fromBufferAttribute(pos, vi).applyMatrix4(m),
            n: nor
              ? new THREE.Vector3().fromBufferAttribute(nor, vi).applyMatrix3(normalM).normalize()
              : new THREE.Vector3(0, 1, 0),
            u: uv ? new THREE.Vector2(uv.getX(vi), uv.getY(vi)) : new THREE.Vector2(),
          });
        }
        tris.push(tri);
      }

      const st = { tris, dirty: false, invM, invNormalM, matName, mat: mesh.material };
      states.set(mesh, st);

      for (const spec of activeSpecs) {
        const entry = out.get(spec.id)!;
        const captured: TriVert[][] = [];
        const remainder: TriVert[][] = [];

        for (const tri of st.tris) {
          if (spec.bounds) {
            triBox.makeEmpty();
            triBox.expandByPoint(tri[0].p).expandByPoint(tri[1].p).expandByPoint(tri[2].p);
            if (!triBox.intersectsBox(spec.bounds)) {
              remainder.push(tri);
              continue;
            }
          }

          let allOut = false;
          let allIn = true;
          for (const pl of spec.planes) {
            let anyIn = false;
            for (let k = 0; k < 3; k++) {
              const d = pl.normal.dot(tri[k].p) - pl.dist;
              if (d >= -1e-5) anyIn = true;
              if (d < 1e-5) allIn = false;
            }
            if (!anyIn) {
              allOut = true;
              break;
            }
          }

          if (allOut) {
            remainder.push(tri);
            continue;
          }
          if (allIn) {
            captured.push(tri);
            continue;
          }

          // Straddler: sequential convex half-space partition cleanly into captured vs remainder
          let cur: TriVert[][] = [tri];
          for (const pl of spec.planes) {
            const nextCur: TriVert[][] = [];
            for (const sub of cur) {
              const { inside, outside } = splitPolygonHalfSpace(sub, pl);
              if (outside.length >= 3) pushPolygonFan(outside, remainder);
              if (inside.length >= 3) pushPolygonFan(inside, nextCur);
            }
            cur = nextCur;
            if (!cur.length) break;
          }
          for (const c of cur) captured.push(c);
        }

        if (captured.length) {
          st.tris = remainder;
          st.dirty = true;
          const outP: number[] = [];
          const outN: number[] = [];
          const outU: number[] = [];
          for (const tri of captured) {
            for (let k = 0; k < 3; k++) {
              outP.push(tri[k].p.x - spec.pivot.x, tri[k].p.y - spec.pivot.y, tri[k].p.z - spec.pivot.z);
              outN.push(tri[k].n.x, tri[k].n.y, tri[k].n.z);
              outU.push(tri[k].u.x, tri[k].u.y);
            }
          }
          const partGeo = new THREE.BufferGeometry();
          partGeo.setAttribute('position', new THREE.Float32BufferAttribute(outP, 3));
          partGeo.setAttribute('normal', new THREE.Float32BufferAttribute(outN, 3));
          partGeo.setAttribute('uv', new THREE.Float32BufferAttribute(outU, 2));
          if (!nor) partGeo.computeVertexNormals();
          const pm = new THREE.Mesh(partGeo, mesh.material);
          pm.castShadow = pm.receiveShadow = true;
          pm.frustumCulled = false;
          entry.group.add(pm);
          entry.triangleCount += captured.length;
          this.disposables.push(partGeo);
        }
      }
    }

    // Write back compacted remainder geometries once per touched source mesh
    for (const [mesh, st] of states) {
      if (!st.dirty) continue;
      const outP: number[] = [];
      const outN: number[] = [];
      const outU: number[] = [];
      const lp = new THREE.Vector3();
      const ln = new THREE.Vector3();
      for (const tri of st.tris) {
        for (let k = 0; k < 3; k++) {
          lp.copy(tri[k].p).applyMatrix4(st.invM);
          ln.copy(tri[k].n).applyMatrix3(st.invNormalM).normalize();
          outP.push(lp.x, lp.y, lp.z);
          outN.push(ln.x, ln.y, ln.z);
          outU.push(tri[k].u.x, tri[k].u.y);
        }
      }
      const nextGeo = new THREE.BufferGeometry();
      nextGeo.setAttribute('position', new THREE.Float32BufferAttribute(outP, 3));
      nextGeo.setAttribute('normal', new THREE.Float32BufferAttribute(outN, 3));
      nextGeo.setAttribute('uv', new THREE.Float32BufferAttribute(outU, 2));
      mesh.geometry.dispose();
      mesh.geometry = nextGeo;
      this.disposables.push(nextGeo);
    }
    return out;
  }

  /** Build a flush 3-screen `dynamic_mfd` cluster & bezel frames inside the Su-30MKK front cockpit. */
  private buildSu30MfdCluster(parent: THREE.Group): void {
    const pos: number[] = [];
    const nor: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];

    const bezelMat = new THREE.MeshStandardMaterial({ color: 0x11151b, roughness: 0.65, metalness: 0.45 });
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x0a0f0d,
      roughness: 0.12,
      emissive: 0x0b2416,
      emissiveIntensity: 1,
    });
    screenMat.name = 'dynamic_mfd';
    this.disposables.push(bezelMat, screenMat);

    // Exact atlas rectangles matching MfdDisplays.ts SLOT_RECTS (1024x1024 top-left -> Three.js bottom-left V = 1 - y/1024)
    const slots = [
      {
        cx: -0.215,
        cy: 0.785,
        cz: -8.47,
        w: 0.156,
        h: 0.1195,
        rx: -0.18,
        ry: 0.1,
        u0: 8 / 1024,
        u1: 504 / 1024,
        vTop: 1 - 66 / 1024,
        vBot: 1 - 446 / 1024,
      },
      {
        cx: 0.0,
        cy: 0.835,
        cz: -8.296,
        w: 0.128,
        h: 0.166,
        rx: -0.17,
        ry: 0.0,
        u0: 66 / 1024,
        u1: 450 / 1024,
        vTop: 1 - 520 / 1024,
        vBot: 1 - 1020 / 1024,
      },
      {
        cx: 0.215,
        cy: 0.785,
        cz: -8.47,
        w: 0.156,
        h: 0.1195,
        rx: -0.18,
        ry: -0.1,
        u0: 520 / 1024,
        u1: 1016 / 1024,
        vTop: 1 - 578 / 1024,
        vBot: 1 - 958 / 1024,
      },
    ];

    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const n = new THREE.Vector3();

    for (const s of slots) {
      euler.set(s.rx, s.ry, 0, 'YXZ');
      q.setFromEuler(euler);
      n.set(0, 0, 1).applyQuaternion(q).normalize();

      // Matte anodized bezel backing behind the glass
      const bGeo = new THREE.BoxGeometry(s.w + 0.016, s.h + 0.016, 0.014);
      this.disposables.push(bGeo);
      const bezel = new THREE.Mesh(bGeo, bezelMat);
      bezel.quaternion.copy(q);
      bezel.position.set(s.cx, s.cy, s.cz).addScaledVector(n, -0.008);
      parent.add(bezel);

      const hw = s.w * 0.5;
      const hh = s.h * 0.5;
      const base = pos.length / 3;
      const corners: Array<[number, number, number, number]> = [
        [-hw, hh, s.u0, s.vTop],
        [hw, hh, s.u1, s.vTop],
        [-hw, -hh, s.u0, s.vBot],
        [hw, -hh, s.u1, s.vBot],
      ];
      for (const [lx, ly, cu, cv] of corners) {
        p.set(lx, ly, 0).applyQuaternion(q).add(new THREE.Vector3(s.cx, s.cy, s.cz));
        pos.push(p.x, p.y, p.z);
        nor.push(n.x, n.y, n.z);
        uv.push(cu, cv);
      }
      // CCW winding facing +Z (pilot)
      idx.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
    }

    const screenGeo = new THREE.BufferGeometry();
    screenGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    screenGeo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    screenGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    screenGeo.setIndex(idx);
    this.disposables.push(screenGeo);

    const mesh = new THREE.Mesh(screenGeo, screenMat);
    mesh.name = 'Su30DynamicMfd';
    mesh.frustumCulled = false;
    mesh.renderOrder = 2;
    parent.add(mesh);
  }

  /** Slice articulated GLB control surfaces, wire TVC/iris, airbrakes, landing gear, and vapor sheets. */
  private setupLoadedRig(model: THREE.Object3D, anchors: AirframeAnchors): void {
    this.loadedExtras.clear();
    const rig = this.createEmptyRig();
    const id = this.airframeId;
    const single = anchors.nozzles.length === 1;

    // Position TVC anchors & move plumes/faces cleanly under them so exhaust gimbal tracks nozzles
    const tvcPivotsZ = id === 'gripen' ? 4.86 : 5.82;
    this.nozzles.forEach((n, i) => {
      const anchor = this.tvcAnchors[i];
      const kestrelNz = anchor.getObjectByName(`kestrel_nozzle_${i}`);
      if (kestrelNz) kestrelNz.visible = false;
      anchor.position.set(n.x, n.y, tvcPivotsZ);
      anchor.quaternion.identity();
      const active = !(single && i > 0);
      anchor.visible = active;
      const dz = n.z - tvcPivotsZ;
      const p = this.plumes[i];
      if (p) {
        p.position.set(0, 0, dz);
        p.visible = active;
      }
      const f = this.nozzleFaces[i];
      if (f) {
        f.position.set(0, 0, dz - anchors.nozzleRadiusM * 0.6);
        f.scale.setScalar(anchors.nozzleRadiusM / 0.42);
        f.visible = active;
      }
    });

    const specs: SlicePartSpec[] = [];
    const pass2Specs: SlicePartSpec[] = [];
    const up = new THREE.Vector3(0, 1, 0);
    const axisBind = new Map<string, { role: 'canard' | 'flap' | 'aileron' | 'slat' | 'stab' | 'rudder' | 'tvc' | 'flex'; side: 0 | 1; axis: THREE.Vector3; sign: number }>();

    if (id === 'gripen') {
      const gMat = ['saab_jas39a_aircraft_normal_detail'];
      for (const side of [0, 1] as const) {
        const s = side === 0 ? -1 : 1;
        const canId = `canard_${side}`;
        specs.push({
          id: canId,
          pivot: new THREE.Vector3(s * 0.74, 0.21, -2.62),
          planes: [makeAxisPlane('x', s * 0.735, s > 0)],
          materialPrefixes: gMat,
          bounds: new THREE.Box3(
            new THREE.Vector3(s > 0 ? 0.72 : -2.25, -0.08, -4.18),
            new THREE.Vector3(s > 0 ? 2.25 : -0.72, 0.44, -1.42),
          ),
        });
        axisBind.set(canId, { role: 'canard', side, axis: new THREE.Vector3(1, 0, 0), sign: 1 });

        const fA = new THREE.Vector3(s * 0.85, -0.14, 1.82);
        const fB = new THREE.Vector3(s * 2.02, -0.15, 1.88);
        const flapId = `flap_${side}`;
        specs.push({
          id: flapId,
          pivot: fA.clone().lerp(fB, 0.5),
          planes: [
            makeClipPlaneFromPoints(fA, fB, up, new THREE.Vector3(s * 1.4, -0.15, 2.45)),
            makeAxisPlane('x', s > 0 ? 0.85 : -2.02, true),
            makeAxisPlane('x', s > 0 ? 2.02 : -0.85, false),
            makeAxisPlane('y', -0.37, true),
            makeAxisPlane('y', 0.08, false),
          ],
          materialPrefixes: gMat,
          bounds: new THREE.Box3(
            new THREE.Vector3(s > 0 ? 0.82 : -2.06, -0.4, 1.7),
            new THREE.Vector3(s > 0 ? 2.06 : -0.82, 0.12, 2.68),
          ),
          addHingeSpar: { start: fA, end: fB, radius: 0.018 },
        });
        const fAxis = new THREE.Vector3().subVectors(side === 1 ? fB : fA, side === 1 ? fA : fB).normalize();
        axisBind.set(flapId, { role: 'flap', side, axis: fAxis, sign: 1 });

        const aA = new THREE.Vector3(s * 2.04, -0.16, 1.88);
        const aB = new THREE.Vector3(s * 3.48, -0.18, 2.02);
        const ailId = `aileron_${side}`;
        specs.push({
          id: ailId,
          pivot: aA.clone().lerp(aB, 0.5),
          planes: [
            makeClipPlaneFromPoints(aA, aB, up, new THREE.Vector3(s * 2.75, -0.17, 2.55)),
            makeAxisPlane('x', s > 0 ? 2.04 : -3.48, true),
            makeAxisPlane('x', s > 0 ? 3.48 : -2.04, false),
            makeAxisPlane('y', -0.38, true),
            makeAxisPlane('y', 0.06, false),
          ],
          materialPrefixes: gMat,
          bounds: new THREE.Box3(
            new THREE.Vector3(s > 0 ? 2.01 : -3.52, -0.42, 1.75),
            new THREE.Vector3(s > 0 ? 3.52 : -2.01, 0.1, 2.68),
          ),
          addHingeSpar: { start: aA, end: aB, radius: 0.016 },
        });
        const aAxis = new THREE.Vector3().subVectors(side === 1 ? aB : aA, side === 1 ? aA : aB).normalize();
        axisBind.set(ailId, { role: 'aileron', side, axis: aAxis, sign: 1 });

        pass2Specs.push({
          id: `flex_${side}`,
          pivot: new THREE.Vector3(s * 2.04, -0.16, 1.3),
          planes: [makeAxisPlane('x', s * 2.04, s > 0)],
          materialPrefixes: ['saab_jas39a_aircraft_normal_detail', 'lau_7', 'bol_451_container'],
          bounds: new THREE.Box3(
            new THREE.Vector3(s > 0 ? 2.0 : -4.15, -0.78, -0.8),
            new THREE.Vector3(s > 0 ? 4.15 : -2.0, 0.22, 3.72),
          ),
        });
      }

      const rA = new THREE.Vector3(0, 1.02, 3.74);
      const rB = new THREE.Vector3(0, 2.52, 4.18);
      specs.push({
        id: 'rudder_0',
        pivot: rA.clone().lerp(rB, 0.5),
        planes: [
          makeClipPlaneFromPoints(rA, rB, new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1.8, 4.5)),
          makeAxisPlane('y', 1.02, true),
          makeAxisPlane('y', 2.54, false),
          makeAxisPlane('x', -0.14, true),
          makeAxisPlane('x', 0.14, false),
        ],
        materialPrefixes: gMat,
        bounds: new THREE.Box3(new THREE.Vector3(-0.16, 0.98, 3.68), new THREE.Vector3(0.16, 2.58, 4.75)),
        addHingeSpar: { start: rA, end: rB, radius: 0.018 },
      });
      axisBind.set('rudder_0', { role: 'rudder', side: 0, axis: new THREE.Vector3().subVectors(rB, rA).normalize(), sign: 1 });

      specs.push({
        id: 'tvc_0',
        pivot: new THREE.Vector3(0, 0, tvcPivotsZ),
        planes: [makeAxisPlane('z', tvcPivotsZ, true)],
        materialPrefixes: gMat,
        bounds: new THREE.Box3(new THREE.Vector3(-0.48, -0.48, tvcPivotsZ - 0.05), new THREE.Vector3(0.48, 0.48, 5.55)),
      });
    } else {
      // Su-30MKK
      const sMat = ['0c5b', '1718', 'a04b'];
      for (const side of [0, 1] as const) {
        const s = side === 0 ? -1 : 1;
        const fA = new THREE.Vector3(s * 2.35, -0.01, 2.28);
        const fB = new THREE.Vector3(s * 4.82, -0.02, 2.66);
        const flapId = `flap_${side}`;
        specs.push({
          id: flapId,
          pivot: fA.clone().lerp(fB, 0.5),
          planes: [
            makeClipPlaneFromPoints(fA, fB, up, new THREE.Vector3(s * 3.5, -0.02, 3.2)),
            makeAxisPlane('x', s > 0 ? 2.35 : -4.82, true),
            makeAxisPlane('x', s > 0 ? 4.82 : -2.35, false),
            makeAxisPlane('y', -0.24, true),
            makeAxisPlane('y', 0.2, false),
          ],
          materialPrefixes: sMat,
          bounds: new THREE.Box3(
            new THREE.Vector3(s > 0 ? 2.3 : -4.88, -0.28, 2.0),
            new THREE.Vector3(s > 0 ? 4.88 : -2.3, 0.25, 3.6),
          ),
          addHingeSpar: { start: fA, end: fB, radius: 0.022 },
        });
        axisBind.set(flapId, {
          role: 'flap',
          side,
          axis: new THREE.Vector3().subVectors(side === 1 ? fB : fA, side === 1 ? fA : fB).normalize(),
          sign: 1,
        });

        const aA = new THREE.Vector3(s * 5.18, -0.02, 2.75);
        const aB = new THREE.Vector3(s * 7.18, -0.01, 3.38);
        const ailId = `aileron_${side}`;
        specs.push({
          id: ailId,
          pivot: aA.clone().lerp(aB, 0.5),
          planes: [
            makeClipPlaneFromPoints(aA, aB, up, new THREE.Vector3(s * 6.2, -0.02, 3.8)),
            makeAxisPlane('x', s > 0 ? 5.18 : -7.22, true),
            makeAxisPlane('x', s > 0 ? 7.22 : -5.18, false),
            makeAxisPlane('y', -0.24, true),
            makeAxisPlane('y', 0.2, false),
          ],
          materialPrefixes: sMat,
          bounds: new THREE.Box3(
            new THREE.Vector3(s > 0 ? 5.14 : -7.28, -0.28, 2.55),
            new THREE.Vector3(s > 0 ? 7.28 : -5.14, 0.25, 4.25),
          ),
          addHingeSpar: { start: aA, end: aB, radius: 0.02 },
        });
        axisBind.set(ailId, {
          role: 'aileron',
          side,
          axis: new THREE.Vector3().subVectors(side === 1 ? aB : aA, side === 1 ? aA : aB).normalize(),
          sign: 1,
        });

        const slA = new THREE.Vector3(s * 2.65, 0.0, -1.35);
        const slB = new THREE.Vector3(s * 5.12, -0.01, 0.9);
        const slatId = `slat_${side}`;
        specs.push({
          id: slatId,
          pivot: slA.clone().lerp(slB, 0.5),
          planes: [
            makeClipPlaneFromPoints(slA, slB, up, new THREE.Vector3(s * 4.0, 0.0, -0.8)),
            makeAxisPlane('x', s > 0 ? 2.65 : -5.12, true),
            makeAxisPlane('x', s > 0 ? 5.12 : -2.65, false),
            makeAxisPlane('y', -0.2, true),
            makeAxisPlane('y', 0.22, false),
          ],
          materialPrefixes: sMat,
          bounds: new THREE.Box3(
            new THREE.Vector3(s > 0 ? 2.6 : -5.18, -0.24, -1.8),
            new THREE.Vector3(s > 0 ? 5.18 : -2.6, 0.25, 1.4),
          ),
        });
        axisBind.set(slatId, {
          role: 'slat',
          side,
          axis: new THREE.Vector3().subVectors(side === 1 ? slB : slA, side === 1 ? slA : slB).normalize(),
          sign: 1,
        });

        const stabId = `stab_${side}`;
        specs.push({
          id: stabId,
          pivot: new THREE.Vector3(s * 2.15, -0.46, 5.6),
          planes: [makeAxisPlane('x', s * 2.06, s > 0), makeAxisPlane('z', 4.2, true)],
          materialPrefixes: ['0c5b', 'a04b'],
          bounds: new THREE.Box3(
            new THREE.Vector3(s > 0 ? 2.04 : -5.08, -0.82, 4.18),
            new THREE.Vector3(s > 0 ? 5.08 : -2.04, 0.14, 7.42),
          ),
        });
        axisBind.set(stabId, { role: 'stab', side, axis: new THREE.Vector3(1, 0, 0), sign: 1 });

        const rA = new THREE.Vector3(s * 2.18, 1.65, 4.9);
        const rB = new THREE.Vector3(s * 2.18, 3.85, 5.38);
        const rudId = `rudder_${side}`;
        specs.push({
          id: rudId,
          pivot: rA.clone().lerp(rB, 0.5),
          planes: [
            makeClipPlaneFromPoints(rA, rB, new THREE.Vector3(1, 0, 0), new THREE.Vector3(s * 2.18, 2.8, 5.6)),
            makeAxisPlane('x', s * 2.18 - 0.26, true),
            makeAxisPlane('x', s * 2.18 + 0.26, false),
            makeAxisPlane('y', 1.65, true),
            makeAxisPlane('y', 3.9, false),
          ],
          materialPrefixes: ['0c5b', 'a04b'],
          bounds: new THREE.Box3(
            new THREE.Vector3(s * 2.18 - 0.3, 1.6, 4.75),
            new THREE.Vector3(s * 2.18 + 0.3, 3.95, 5.8),
          ),
          addHingeSpar: { start: rA, end: rB, radius: 0.02 },
        });
        axisBind.set(rudId, { role: 'rudder', side, axis: new THREE.Vector3().subVectors(rB, rA).normalize(), sign: 1 });

        specs.push({
          id: `tvc_${side}`,
          pivot: new THREE.Vector3(s * 1.22, -0.51, tvcPivotsZ),
          planes: [makeAxisPlane('z', tvcPivotsZ, true)],
          materialPrefixes: ['0c5b', 'a04b'],
          bounds: new THREE.Box3(
            new THREE.Vector3(s > 0 ? 0.55 : -1.88, -1.16, tvcPivotsZ - 0.05),
            new THREE.Vector3(s > 0 ? 1.88 : -0.55, 0.1, 6.92),
          ),
        });

        pass2Specs.push({
          id: `flex_${side}`,
          pivot: new THREE.Vector3(s * 5.16, -0.02, 2.15),
          planes: [makeAxisPlane('x', s * 5.16, s > 0)],
          bounds: new THREE.Box3(
            new THREE.Vector3(s > 0 ? 5.12 : -7.5, -0.45, -0.4),
            new THREE.Vector3(s > 0 ? 7.5 : -5.12, 0.25, 4.4),
          ),
        });
      }
    }

    const parts = this.carveAirframeParts(model, specs, this.loadedExtras);
    const flexParts = this.carveAirframeParts(model, pass2Specs, this.loadedExtras);

    for (const side of [0, 1] as const) {
      const fp = flexParts.get(`flex_${side}`);
      if (fp && fp.triangleCount > 0) rig.wingFlex[side] = fp.group;
    }

    for (const [partId, info] of axisBind) {
      const carved = parts.get(partId);
      if (!carved || carved.triangleCount === 0) continue;
      const hs: HingeSurface = { group: carved.group, axis: info.axis, sign: info.sign };
      if (info.role === 'canard') rig.canards[info.side] = hs;
      else if (info.role === 'flap') rig.flaps[info.side] = hs;
      else if (info.role === 'aileron') {
        const wf = rig.wingFlex[info.side];
        if (wf) {
          carved.group.position.sub(wf.position);
          wf.add(carved.group);
        }
        rig.ailerons[info.side] = hs;
      } else if (info.role === 'slat') rig.slats[info.side] = hs;
      else if (info.role === 'stab') rig.stabs[info.side] = hs;
      else if (info.role === 'rudder') rig.rudders.push(hs);
    }

    const activeCount = single ? 1 : 2;
    for (let i = 0; i < activeCount; i++) {
      const tvc = parts.get(`tvc_${i}`);
      if (tvc && tvc.triangleCount > 0) {
        tvc.group.position.set(0, 0, 0);
        this.tvcAnchors[i].add(tvc.group);
      }
      const dz = this.nozzles[i].z - tvcPivotsZ;
      rig.irisPetals[i] = this.buildNozzleIris(
        this.tvcAnchors[i],
        anchors.nozzleRadiusM * 0.96,
        anchors.nozzleRadiusM * 1.1,
        Math.max(0.08, dz - anchors.nozzleRadiusM * 0.62),
      );
    }

    // Airbrakes, retractable gear, and over-wing condensation vapor
    if (id === 'gripen') {
      this.buildAirbrakeUnits(rig, this.loadedExtras, [
        { pos: new THREE.Vector3(-0.44, 0.04, 3.72), size: new THREE.Vector3(0.32, 0.04, 0.85), axis: new THREE.Vector3(0, 1, 0), maxRad: -0.68, bayColor: 0x101318, flapColor: 0x6c727a, tiltZ: 0.42 },
        { pos: new THREE.Vector3(0.44, 0.04, 3.72), size: new THREE.Vector3(0.32, 0.04, 0.85), axis: new THREE.Vector3(0, 1, 0), maxRad: 0.68, bayColor: 0x101318, flapColor: 0x6c727a, tiltZ: -0.42 },
      ]);
      rig.vaporMat = this.buildWingVapor(this.loadedExtras, [
        new THREE.Vector3(0.82, 0.04, -2.0),
        new THREE.Vector3(3.75, -0.1, 1.95),
        new THREE.Vector3(3.75, -0.1, 2.55),
        new THREE.Vector3(0.85, 0.04, 2.38),
      ]);
    } else {
      this.buildAirbrakeUnits(rig, this.loadedExtras, [
        { pos: new THREE.Vector3(0, 1.46, -4.3), size: new THREE.Vector3(0.96, 0.055, 1.75), axis: new THREE.Vector3(1, 0, 0), maxRad: -0.92, bayColor: 0x10141b, flapColor: 0x627488 },
      ]);
      rig.vaporMat = this.buildWingVapor(this.loadedExtras, [
        new THREE.Vector3(1.55, 0.22, -4.2),
        new THREE.Vector3(7.05, 0.04, 2.45),
        new THREE.Vector3(7.05, 0.04, 3.95),
        new THREE.Vector3(2.2, 0.12, 3.15),
      ]);
      if (id === 'su30') {
        this.buildSu30MfdCluster(this.loadedExtras);
      }
    }

    if (anchors.wheelAnchors) {
      this.buildGearRig(rig, this.loadedExtras, anchors.wheelAnchors);
    }

    this.baseWingtips[0].copy(this.wingtips[0]);
    this.baseWingtips[1].copy(this.wingtips[1]);
    this.rig = rig;
  }

  /** Smoothly animate all articulated surfaces, TVC nozzles, iris petals, airbrakes, gear and vapor. */
  private applyRigAnimation(dt: number, timeSec: number, visual?: JetVisualState): void {
    const rig = this.rig;
    const target = visual?.surfaces;
    const sm = rig.smooth;
    const kSurf = dt > 0 ? 1 - Math.exp(-16 * dt) : 1;
    const kSlow = dt > 0 ? 1 - Math.exp(-8 * dt) : 1;
    const damp = (cur: number, dst: number, k = kSurf): number => cur + (dst - cur) * k;

    sm.canardRad = damp(sm.canardRad, target?.canardRad ?? 0);
    sm.elevonLeftRad = damp(sm.elevonLeftRad, target?.elevonLeftRad ?? 0);
    sm.elevonRightRad = damp(sm.elevonRightRad, target?.elevonRightRad ?? 0);
    sm.flapLeftRad = damp(sm.flapLeftRad, target?.flapLeftRad ?? 0);
    sm.flapRightRad = damp(sm.flapRightRad, target?.flapRightRad ?? 0);
    sm.rudderRad = damp(sm.rudderRad, target?.rudderRad ?? 0);
    sm.tvcPitchLeftRad = damp(sm.tvcPitchLeftRad, target?.tvcPitchLeftRad ?? 0);
    sm.tvcPitchRightRad = damp(sm.tvcPitchRightRad, target?.tvcPitchRightRad ?? 0);
    sm.tvcYawLeftRad = damp(sm.tvcYawLeftRad, target?.tvcYawLeftRad ?? 0);
    sm.tvcYawRightRad = damp(sm.tvcYawRightRad, target?.tvcYawRightRad ?? 0);
    sm.slat = damp(sm.slat, target?.slat ?? 0, kSlow);
    sm.airbrake = damp(sm.airbrake, target?.airbrake ?? 0, kSlow);
    sm.gear = damp(sm.gear, target?.gear ?? 0, kSlow);
    sm.nozzleIris = damp(sm.nozzleIris, target?.nozzleIris ?? 0, kSlow);

    const gLoad = visual?.gLoad ?? 1;
    const flexTarget = THREE.MathUtils.clamp((gLoad - 1) * (this.airframeId === 'gripen' ? 0.0045 : 0.0075), -0.025, 0.07);
    rig.smoothFlexRad = damp(rig.smoothFlexRad, flexTarget, kSlow);
    const oleoTarget = visual?.onGround && sm.gear > 0.85 ? 0.06 : 0;
    rig.smoothOleoM = damp(rig.smoothOleoM, oleoTarget, kSurf);

    const rotHinge = (hs: HingeSurface | null, rad: number): void => {
      if (!hs) return;
      hs.group.quaternion.setFromAxisAngle(hs.axis, rad * hs.sign);
    };

    rotHinge(rig.canards[0], sm.canardRad);
    rotHinge(rig.canards[1], sm.canardRad);
    rotHinge(rig.flaps[0], sm.flapLeftRad);
    rotHinge(rig.flaps[1], sm.flapRightRad);
    rotHinge(rig.ailerons[0], sm.elevonLeftRad);
    rotHinge(rig.ailerons[1], sm.elevonRightRad);
    rotHinge(rig.stabs[0], sm.elevonLeftRad);
    rotHinge(rig.stabs[1], sm.elevonRightRad);
    rotHinge(rig.slats[0], -sm.slat * 0.34);
    rotHinge(rig.slats[1], -sm.slat * 0.34);
    for (const r of rig.rudders) rotHinge(r, sm.rudderRad);

    for (const side of [0, 1] as const) {
      const wf = rig.wingFlex[side];
      if (wf) wf.rotation.z = (side === 0 ? -1 : 1) * rig.smoothFlexRad;
      const tipShiftY = Math.sin(rig.smoothFlexRad) * (this.airframeId === 'gripen' ? 1.95 : 2.25);
      this.wingtips[side].copy(this.baseWingtips[side]);
      this.wingtips[side].y += tipShiftY;
      this.navLights[side]?.position.set(this.wingtips[side].x + (side === 0 ? -0.05 : 0.05), this.wingtips[side].y, this.wingtips[side].z);
    }

    // TVC nozzle 3D gimbal & 14-petal variable titanium iris
    const tvcP = [sm.tvcPitchLeftRad, sm.tvcPitchRightRad];
    const tvcY = [sm.tvcYawLeftRad, sm.tvcYawRightRad];
    const irisAng = THREE.MathUtils.lerp(0.24, -0.08, THREE.MathUtils.clamp(sm.nozzleIris, 0, 1));
    for (let i = 0; i < 2; i++) {
      const anch = rig.tvcPivots[i];
      if (!anch || !anch.visible) continue;
      // Rotate Y (+tvcYaw = right) then X (-tvcPitch = up)
      anch.rotation.order = 'YXZ';
      anch.rotation.set(-tvcP[i], tvcY[i], 0);
      for (const petal of rig.irisPetals[i]) petal.rotation.x = irisAng;
    }

    // Airbrake panels & telescoping hydraulic actuators
    for (const ab of rig.airbrakes) {
      const ang = ab.maxRad * sm.airbrake;
      ab.pivot.quaternion.setFromAxisAngle(ab.axis, ang);
      if (ab.piston) {
        this.tmpVecA.set(0, 0.02, ab.piston.baseLen * 1.1).applyQuaternion(ab.pivot.quaternion);
        const start = this.tmpVecB.copy(ab.piston.mesh.position);
        const dir = this.tmpVecA.sub(start);
        const dist = Math.max(0.05, dir.length());
        ab.piston.mesh.scale.set(1, 1, dist / ab.piston.baseLen);
        if (dist > 1e-4) {
          this.rigQuat.setFromUnitVectors(this.rigAxisZ, dir.normalize());
          ab.piston.mesh.quaternion.copy(this.rigQuat);
        }
      }
    }

    // Landing gear doors (0..0.35), strut deployment (0.15..1.0), oleo compression, nosewheel steering
    const doorOpen = THREE.MathUtils.smoothstep(sm.gear, 0.0, 0.35);
    const strutOut = THREE.MathUtils.smoothstep(sm.gear, 0.15, 1.0);
    for (const lg of rig.gear) {
      lg.strut.visible = sm.gear > 0.02;
      lg.strut.quaternion.setFromAxisAngle(lg.retractAxis, lg.retractRad * (1 - strutOut));
      lg.piston.position.y = lg.pistonBaseY + rig.smoothOleoM;
      for (let d = 0; d < lg.doors.length; d++) {
        lg.doors[d].quaternion.setFromAxisAngle(lg.doorAxis, lg.doorSigns[d] * doorOpen * 1.48);
      }
      if (lg.isNose) lg.piston.rotation.y = sm.rudderRad * 0.45 * strutOut;
    }
    if (rig.taxiLight) rig.taxiLight.visible = sm.gear > 0.7;

    // Expose smoothed control deflections for telemetry/verification
    Object.assign(this.surfaceState, sm);

    // Over-wing/LERX condensation sheet driven by |AoA|, dynamic pressure qPa, density and Mach
    if (rig.vaporMat) {
      const absAoa = Math.abs(visual?.aoaDeg ?? 0);
      const rho = visual?.airDensity ?? 1;
      const qPa = visual?.qPa ?? 0;
      const mach = visual?.mach ?? 0;
      const aoaK = THREE.MathUtils.smoothstep(absAoa, 7.5, 21.0);
      const qK = THREE.MathUtils.clamp((qPa - 3200) / 14000, 0, 1);
      const transonic = 1 + 0.55 * Math.exp(-Math.pow((mach - 0.96) / 0.12, 2));
      rig.vaporMat.uniforms.uIntensity.value = THREE.MathUtils.clamp(aoaK * qK * rho * transonic, 0, 1);
      rig.vaporMat.uniforms.uTime.value = timeSec;
    }
  }

  /**
   * Cut a moving part (a stick, a throttle grip) out of the loaded airframe's merged meshes: every
   * triangle lying inside `box` (jet frame) moves into a new mesh hung from a pivot at `pivot`,
   * and is removed from the original. Returns the pivot to rotate, or null if nothing was found.
   */
  public extractPart(box: THREE.Box3, pivot: THREE.Vector3): THREE.Group | null {
    if (!this.airframe) return null;
    this.root.updateMatrixWorld(true);
    const toJet = new THREE.Matrix4().copy(this.root.matrixWorld).invert();
    const group = new THREE.Group();
    group.position.copy(pivot);
    const v = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    const meshes: THREE.Mesh[] = [];
    this.airframe.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
    });
    for (const mesh of meshes) {
      const geo = mesh.geometry;
      const index = geo.index;
      const pos = geo.attributes.position;
      if (!index || !pos) continue;
      const m = new THREE.Matrix4().multiplyMatrices(toJet, mesh.matrixWorld);
      const normalM = new THREE.Matrix3().getNormalMatrix(m);
      const nor = geo.attributes.normal;
      const uv = geo.attributes.uv;
      const outP: number[] = [];
      const outN: number[] = [];
      const outU: number[] = [];
      for (let t = 0; t < index.count; t += 3) {
        let inside = true;
        for (let k = 0; k < 3; k++) {
          v[k].fromBufferAttribute(pos, index.getX(t + k)).applyMatrix4(m);
          if (!box.containsPoint(v[k])) inside = false;
        }
        if (!inside) continue;
        for (let k = 0; k < 3; k++) {
          const i = index.getX(t + k);
          outP.push(v[k].x - pivot.x, v[k].y - pivot.y, v[k].z - pivot.z);
          if (nor) {
            const n = new THREE.Vector3().fromBufferAttribute(nor, i).applyMatrix3(normalM).normalize();
            outN.push(n.x, n.y, n.z);
          }
          if (uv) outU.push(uv.getX(i), uv.getY(i));
        }
        // Collapse the triangle in the original (degenerate: drawn as nothing)
        const a = index.getX(t);
        index.setX(t + 1, a);
        index.setX(t + 2, a);
      }
      if (!outP.length) continue;
      index.needsUpdate = true;
      const part = new THREE.BufferGeometry();
      part.setAttribute('position', new THREE.Float32BufferAttribute(outP, 3));
      if (outN.length) part.setAttribute('normal', new THREE.Float32BufferAttribute(outN, 3));
      else part.computeVertexNormals();
      if (outU.length) part.setAttribute('uv', new THREE.Float32BufferAttribute(outU, 2));
      const pm = new THREE.Mesh(part, mesh.material);
      pm.castShadow = pm.receiveShadow = true;
      pm.frustumCulled = false;
      group.add(pm);
      this.disposables.push(part);
    }
    if (!group.children.length) return null;
    this.root.add(group);
    return group;
  }

  /** The model could not load: fly the built-in airframe instead. */
  public showBuiltIn(): void {
    this.airframeId = 'kestrel';
    this.body.visible = true;
    this.root.visible = true;
    this.rig = this.kestrelRig;
    this.loadedExtras.clear();
    this.nozzles.forEach((n, i) => {
      const anchor = this.tvcAnchors[i];
      anchor.visible = true;
      anchor.position.set(n.x, n.y, n.z - 1.05);
      anchor.rotation.set(0, 0, 0);
      const kestrelNz = anchor.getObjectByName(`kestrel_nozzle_${i}`);
      if (kestrelNz) kestrelNz.visible = true;
      this.plumes[i]?.position.set(0, 0, 1.05);
      if (this.plumes[i]) this.plumes[i].visible = true;
      this.nozzleFaces[i]?.position.set(0, 0, 0.35);
      if (this.nozzleFaces[i]) this.nozzleFaces[i].visible = true;
    });
    this.baseWingtips[0].set(-5.45, -0.02, 4.4);
    this.baseWingtips[1].set(5.45, -0.02, 4.4);
  }

  /** Engines, exhaust, lights, and articulated surfaces/gear/vapor for this frame. */
  public update(timeSec: number, throttle: number, boost: number, vacuum: number, visual?: JetVisualState): void {
    const abBoost = visual?.abStage !== undefined ? Math.max(boost, visual.abStage / 3) : boost;
    const u = this.plumeMat.uniforms;
    u.uThrottle.value = throttle;
    u.uBoost.value = abBoost;
    u.uVacuum.value = vacuum;
    u.uTime.value = timeSec;
    // Visible flame: a few metres dry, ~8–10 m on zone-3 afterburner (wider & fainter in vacuum)
    const len = 1.2 + throttle * 2.2 + abBoost * 3.8 + vacuum * 2.5;
    // uLength stays the geometry length (9); the mesh scale sets how long the flame is
    // Under-expanded in vacuum: a little wider, never a balloon
    const widen = 1 + vacuum * 0.45 * (0.3 + throttle);
    const r = widen * (1 + abBoost * 0.28) * this.plumeScale;
    for (const p of this.plumes) p.scale.set(r, r, (len / 9) * Math.sqrt(this.plumeScale));
    this.nozzleGlowMat.opacity = 0.25 + 0.6 * throttle + 0.65 * abBoost;
    this.nozzleGlowMat.color.setRGB(1, 0.42 + 0.28 * abBoost, 0.16 + 0.14 * abBoost);

    const dt = THREE.MathUtils.clamp(visual?.dt ?? 1 / 60, 0, 0.1);
    this.applyRigAnimation(dt, timeSec, visual);

    // Anti-collision strobes: a double flash every 1.4 s
    const ph = timeSec % 1.4;
    const on = ph < 0.05 || (ph > 0.16 && ph < 0.21);
    for (const s of this.strobes) s.visible = on;
    for (const s of this.navLights) (s.material as THREE.SpriteMaterial).opacity = 0.9;
  }

  public setPilotVisible(v: boolean): void {
    this.pilot.visible = v;
    // From inside, the canopy is all but invisible: just the glints
    this.canopyGlass.opacity = v ? 0.2 : 0.06;
    this.canopyGlass.envMapIntensity = v ? 0.8 : 0.35;
  }

  public dispose(): void {
    this.loadedExtras.clear();
    this.kestrelExtras.clear();
    for (const d of this.disposables) d.dispose();
    this.disposables = [];
  }
}
