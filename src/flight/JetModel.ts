import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import type { CockpitLayout } from './CockpitControls';

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
    float body = pow(facing, mix(1.6, 3.0, uCore));          // thickest through the middle
    // Turbulence flowing downstream
    float ang = atan(vPos.y, vPos.x);
    float flow = noise(vec2(ang * 2.5, t * 9.0 - uTime * 26.0)) * 0.6 + noise(vec2(ang * 6.0, t * 22.0 - uTime * 55.0)) * 0.4;
    // Mach disks: sharp bright rings at regular spacing, fading downstream (air only)
    float diamonds = 0.0;
    for (int k = 0; k < 6; k++) {
      float x = 0.07 + float(k) * 0.085;
      float d = (t - x) / 0.012;
      diamonds += exp(-d * d) * (1.0 - float(k) / 6.0);
    }
    diamonds *= (1.0 - uVacuum) * (0.35 + 0.65 * uBoost);
    float fade = pow(1.0 - t, mix(mix(1.4, 2.4, uVacuum), 3.5, uCore));
    vec3 white = vec3(1.0, 0.97, 0.92);
    vec3 dry = vec3(0.45, 0.55, 1.0);                         // military power: faint blue-violet
    vec3 ab = mix(vec3(1.0, 0.78, 0.38), vec3(1.0, 0.36, 0.12), smoothstep(0.1, 0.7, t)); // yellow → orange
    vec3 col = mix(dry, ab, uBoost);
    col = mix(white, col, smoothstep(0.0, mix(0.18, 0.5, uCore), t));
    col = mix(col, vec3(0.75, 0.6, 1.0), diamonds * 0.5);    // diamonds glow pink-violet
    float power = (0.12 + 0.88 * uThrottle) * (1.0 + 1.1 * uBoost);
    float a = body * fade * (0.55 + 0.6 * flow) * power + diamonds * body * power * 1.4;
    a *= mix(1.0, 0.4, uVacuum) * mix(1.0, 1.8, uCore);
    gl_FragColor = vec4(col * a * 1.25, 1.0);
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

export class JetModel {
  public readonly root = new THREE.Group();
  public readonly eye = new THREE.Vector3(0, 0.98, -4.55);
  public readonly nozzles = [new THREE.Vector3(-0.56, 0, 8.2), new THREE.Vector3(0.56, 0, 8.2)];
  public readonly wingtips = [new THREE.Vector3(-5.45, -0.02, 4.4), new THREE.Vector3(5.45, -0.02, 4.4)];
  /** Meshes hidden in the cockpit view (the pilot's own helmet). */
  public readonly pilot = new THREE.Group();
  /** The pilot's helmet: hidden when the camera is on it (the helmet-mounted GoPro). */
  public crewHead: THREE.Object3D | null = null;
  private canopyGlass!: THREE.MeshPhysicalMaterial;

  /** The procedural airframe: flown until a loaded model takes over. */
  private body = new THREE.Group();
  /** A loaded airframe model (see loadAirframe), or null. */
  public airframe: THREE.Object3D | null = null;
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

    // Wings: cranked arrow, a little anhedral
    const wingR: Array<[number, number]> = [[1.0, -2.8], [2.6, 0.4], [5.45, 3.7], [5.45, 5.15], [3.0, 5.55], [1.0, 6.0]];
    const wingL = wingR.map(([x, z]) => [-x, z] as [number, number]).reverse();
    const wr = add(planform(wingR, 0.16, 0.05), hull);
    const wl = add(planform(wingL, 0.16, 0.05), hull);
    wr.position.y = -0.08;
    wl.position.y = -0.08;
    wr.rotation.z = -0.035;
    wl.rotation.z = 0.035;
    // Dark leading-edge strips (radar-absorbent treatment)
    const leR: Array<[number, number]> = [[1.0, -2.8], [2.6, 0.4], [5.45, 3.7], [5.45, 3.95], [2.55, 0.75], [1.0, -2.3]];
    const leL = leR.map(([x, z]) => [-x, z] as [number, number]).reverse();
    const ler = add(planform(leR, 0.18, 0.04), edge, false);
    const lel = add(planform(leL, 0.18, 0.04), edge, false);
    ler.position.y = -0.09;
    lel.position.y = -0.09;
    ler.rotation.z = -0.035;
    lel.rotation.z = 0.035;

    // Stabilators
    const stabR: Array<[number, number]> = [[1.25, 5.3], [3.35, 6.9], [3.35, 7.75], [1.25, 7.9]];
    const stabL = stabR.map(([x, z]) => [-x, z] as [number, number]).reverse();
    add(planform(stabR, 0.1, 0.03), darkHull).position.y = 0.02;
    add(planform(stabL, 0.1, 0.03), darkHull).position.y = 0.02;

    // Twin canted fins with the tail art
    const finShape: Array<[number, number]> = [[3.2, 0], [5.9, 2.35], [7.15, 2.35], [7.4, 0]];
    const decal = tailDecal();
    this.disposables.push(decal);
    const decalMat = new THREE.MeshStandardMaterial({ map: decal, transparent: true, roughness: 0.6, metalness: 0.2, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    this.disposables.push(decalMat);
    for (const side of [-1, 1]) {
      const f = add(fin(finShape, 0.12, 0.035), hull);
      f.position.set(side * 0.95, 0.42, 0);
      f.rotation.z = -side * 0.4;
      const plane = new THREE.PlaneGeometry(2.2, 1.1);
      this.disposables.push(plane);
      const d = new THREE.Mesh(plane, decalMat);
      d.position.set(side * 0.1, 1.2, 6.05);
      d.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
      f.add(d);
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

    // Nozzles: titanium petals with heat tint, and a glowing turbine face inside
    this.nozzleGlowMat = new THREE.MeshBasicMaterial({ color: 0xff7a2a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    this.disposables.push(this.nozzleGlowMat);
    for (const n of this.nozzles) {
      const prof = [
        new THREE.Vector2(0.5, 0), new THREE.Vector2(0.53, 0.35), new THREE.Vector2(0.5, 0.75),
        new THREE.Vector2(0.43, 1.05), new THREE.Vector2(0.4, 1.06), new THREE.Vector2(0.44, 0.7), new THREE.Vector2(0.45, 0.1),
      ];
      const lathe = new THREE.LatheGeometry(prof, 18);
      lathe.rotateX(Math.PI / 2);
      const nz = add(lathe, titanium);
      nz.position.set(n.x, n.y, n.z - 1.05);
      const faceGeo = new THREE.CircleGeometry(0.42, 24);
      this.disposables.push(faceGeo);
      const face = new THREE.Mesh(faceGeo, this.nozzleGlowMat);
      face.position.set(n.x, n.y, n.z - 0.7);
      this.root.add(face);
      this.nozzleFaces.push(face);
    }

    // Exhaust: an outer flame and a short white-hot core per nozzle, sharing one set of uniforms
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
    for (const n of this.nozzles) {
      const g = new THREE.CylinderGeometry(0.36, 0.22, 9, 28, 48, true);
      g.rotateX(-Math.PI / 2); // along +Z
      g.translate(0, 0, 4.5);
      const gc = new THREE.CylinderGeometry(0.26, 0.05, 9, 20, 24, true);
      gc.rotateX(-Math.PI / 2);
      gc.translate(0, 0, 4.5);
      this.disposables.push(g, gc);
      const p = new THREE.Mesh(g, this.plumeMat);
      const c = new THREE.Mesh(gc, coreMat);
      c.scale.set(1, 1, 0.38);
      p.add(c);
      p.position.copy(n);
      p.renderOrder = 5;
      c.renderOrder = 6;
      p.frustumCulled = false;
      c.frustumCulled = false;
      this.root.add(p);
      this.plumes.push(p);
    }

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
    this.body.visible = false;
    this.root.visible = true;
    this.hasInterior = anchors.hasInterior;
    this.length = anchors.lengthM;
    this.plumeScale = anchors.nozzleRadiusM / 0.36;

    this.eye.copy(anchors.eye);
    anchors.nozzles.forEach((n, i) => this.nozzles[i]?.copy(n));
    // One engine: both exhaust slots on the one nozzle, the second flame and glow put away
    const single = anchors.nozzles.length === 1;
    if (single) this.nozzles[1]?.copy(anchors.nozzles[0]);
    anchors.wingtips.forEach((w, i) => this.wingtips[i]?.copy(w));
    this.plumes.forEach((p, i) => {
      p.position.copy(this.nozzles[i]);
      if (single && i > 0) p.visible = false;
    });
    this.nozzleFaces.forEach((f, i) => {
      f.position.copy(this.nozzles[i]).add(new THREE.Vector3(0, 0, -anchors.nozzleRadiusM * 0.6));
      f.scale.setScalar(anchors.nozzleRadiusM / 0.42);
      if (single && i > 0) f.visible = false;
    });
    // Port red, starboard green, tail white; strobes on the fin tips
    this.navLights[0]?.position.copy(this.wingtips[0]).add(new THREE.Vector3(-0.05, 0, 0));
    this.navLights[1]?.position.copy(this.wingtips[1]).add(new THREE.Vector3(0.05, 0, 0));
    this.navLights[2]?.position.copy(anchors.tailLight);
    anchors.finTips.forEach((p, i) => this.strobes[i]?.position.copy(p));
    this.goproMount.copy(anchors.goproMount);
    this.hud = { centre: anchors.hudCentre.clone(), widthM: anchors.hudWidthM };
    this.buildCrew();
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
    this.body.visible = true;
    this.root.visible = true;
  }

  /** Engines, exhaust and lights for this frame. */
  public update(timeSec: number, throttle: number, boost: number, vacuum: number): void {
    const u = this.plumeMat.uniforms;
    u.uThrottle.value = throttle;
    u.uBoost.value = boost;
    u.uVacuum.value = vacuum;
    u.uTime.value = timeSec;
    // Visible flame: a few metres dry, ~8–10 m on afterburner (longer, fainter in vacuum)
    const len = 1.2 + throttle * 2.2 + boost * 3.4 + vacuum * 2.5;
    // uLength stays the geometry length (9); the mesh scale sets how long the flame is
    // Under-expanded in vacuum: a little wider, never a balloon
    const widen = 1 + vacuum * 0.45 * (0.3 + throttle);
    const r = widen * (1 + boost * 0.25) * this.plumeScale;
    for (const p of this.plumes) p.scale.set(r, r, (len / 9) * Math.sqrt(this.plumeScale));
    this.nozzleGlowMat.opacity = 0.25 + 0.6 * throttle + 0.6 * boost;
    this.nozzleGlowMat.color.setRGB(1, 0.42 + 0.25 * boost, 0.16 + 0.1 * boost);
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
    for (const d of this.disposables) d.dispose();
    this.disposables = [];
  }
}
