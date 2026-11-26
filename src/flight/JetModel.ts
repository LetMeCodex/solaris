import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import type { CockpitLayout } from './CockpitControls';
import { createJetSurfaceState, type JetAirframeId, type JetSurfaceState } from './JetTelemetry';
import {
  JET_SKIN_BY_ID,
  chosenCanopyTint,
  chosenHoloAura,
  chosenJetSkin,
  type CanopyTintId,
  type JetSkinId,
} from './JetSkins';

/** Optional real-time aerodynamic and surface telemetry fed from FlightModel / JetController. */
export interface JetVisualState {
  /** Frame step (s) for surface actuator lag smoothing and vapor advection. */
  dt?: number;
  /** Target aerodynamic surface deflections, airbrake, gear, and iris state. */
  surfaces?: JetSurfaceState;
  /** Angle of attack (deg) driving over-wing/LERX condensation sheet intensity. */
  aoaDeg?: number;
  /** True airspeed (m/s) driving airflow advection & reactive skin animation. */
  airspeedMps?: number;
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
  /** Normalized boost / afterburner surge [0..1]. */
  boost?: number;
  /** Ambient darkness factor [0..1] boosting emissive skin details at night. */
  ambientDarkness?: number;
  /** Angular maneuver jerk [0..1+] exciting living flame turbulence. */
  maneuverJerk?: number;
  /** Live environment bounce tint hex driving world-reactive clearcoat/nebula highlights. */
  worldTintHex?: number;
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
  varying float vAxialView;
  void main() {
    vPos = position;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormalV = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    // 1.0 when looking straight down the tailpipe (chase view), 0.0 from side profile
    vec3 axisV = normalize((modelViewMatrix * vec4(0.0, 0.0, 1.0, 0.0)).xyz);
    vAxialView = abs(dot(axisV, vViewDir));
    gl_Position = projectionMatrix * mv;
  }
`;

/**
 * Exhaust: an additive volume along +Z behind the nozzle. View-angle compensated so both
 * dead-astern chase view and 3/4 side view display a vivid translucent flame cone + 6 crisp
 * supersonic Mach shock diamonds in daylight without washing out to flat white.
 */
const PLUME_FRAG = /* glsl */ `
  uniform float uThrottle;
  uniform float uBoost;
  uniform float uVacuum;
  uniform float uTime;
  uniform float uLength;
  uniform float uCore;      // 1: the inner Mach shock-diamond core, 0: translucent outer flame sheath
  varying vec3 vPos;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  varying float vAxialView;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  void main() {
    float t = clamp(vPos.z / uLength, 0.0, 1.0);           // 0 at the nozzle, 1 at the tail
    float facing = abs(dot(normalize(vNormalV), normalize(vViewDir)));
    float lipFade = smoothstep(0.0, 0.045, t);             // soft entry from nozzle lip (no hard ring)
    // Turbulence flowing downstream
    float ang = atan(vPos.y, vPos.x);
    float flow = noise(vec2(ang * 2.5, t * 9.0 - uTime * 28.0)) * 0.6 + noise(vec2(ang * 6.0, t * 22.0 - uTime * 58.0)) * 0.4;
    // Supersonic Mach shock diamonds: 6 crisp glowing nodes separated by dark expansion troughs
    float diamonds = 0.0;
    float diamondHalo = 0.0;
    for (int k = 0; k < 6; k++) {
      float x = 0.085 + float(k) * 0.145;
      float dCore = (t - x) / 0.025;
      float dHalo = (t - x) / 0.052;
      float w = pow(1.0 - float(k) / 6.6, 0.78);
      diamonds += exp(-dCore * dCore) * w;
      diamondHalo += exp(-dHalo * dHalo) * w;
    }
    float airMask = (1.0 - uVacuum) * (0.04 + 0.96 * smoothstep(0.05, 0.55, uBoost)) * lipFade;
    diamonds *= airMask;
    diamondHalo *= airMask;

    // View-angle compensated volumetric body: stays vividly visible from dead-astern chase view!
    float axialBoost = smoothstep(0.54, 0.93, vAxialView);
    float cellWave = 0.76 + 0.24 * cos((t - 0.085) * 43.3);
    float bodyOuter = mix(pow(facing, 1.35), 0.78, axialBoost);
    float bodyCore = mix(pow(facing, 1.95), 0.92, axialBoost);
    float fadeOuter = pow(1.0 - t, mix(1.35, 2.2, uVacuum)) * lipFade;
    float fadeCore = pow(1.0 - t, 1.2) * lipFade;

    vec3 dryCol = vec3(0.28, 0.54, 0.96);                  // military dry power: crisp translucent heat-blue
    vec3 blueCollar = vec3(0.36, 0.58, 1.0);               // stoichiometric blue-violet combustion collar at lip
    vec3 abOuter = mix(vec3(1.0, 0.54, 0.12), vec3(1.0, 0.24, 0.03), smoothstep(0.10, 0.80, t));
    vec3 abCol = mix(blueCollar, abOuter, smoothstep(0.02, 0.18, t));
    vec3 envCol = mix(dryCol, abCol, smoothstep(0.05, 0.35, uBoost));
    vec3 diamondCol = mix(vec3(1.0, 0.78, 0.38), vec3(0.94, 0.97, 1.0), smoothstep(0.22, 0.90, diamonds));

    float pwrDry = 0.05 + 0.28 * uThrottle;
    float pwrAb = 1.15 + 1.55 * uBoost;
    float pwr = mix(pwrDry, pwrAb, smoothstep(0.04, 0.35, uBoost));

    // Outer translucent shear cone (uCore == 0) frames the flame clearly in daylight without whiteout
    float aOuter = bodyOuter * fadeOuter * cellWave * (0.42 + 0.38 * flow) * pwr * 0.56;
    // Inner Mach shock-diamond train (uCore == 1): dark inter-shock troughs + blazing pale-blue-gold diamonds
    float aCore = bodyCore * fadeCore * (0.08 * pwr + diamondHalo * 0.52 * pwr + diamonds * 1.75 * pwr);

    vec3 outRgb = mix(envCol * aOuter, mix(abOuter, diamondCol, clamp(diamonds * 1.25 + 0.22, 0.0, 1.0)) * aCore, uCore);
    outRgb *= mix(1.0, 0.45, uVacuum);
    gl_FragColor = vec4(outRgb, 1.0);
  }
`;

const SHOCK_DISC_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** Cross-axial supersonic Mach shock disk nodes: guarantees unmistakable shock diamonds from chase & 3/4 views. */
const SHOCK_DISC_FRAG = /* glsl */ `
  uniform float uBoost;
  uniform float uVacuum;
  uniform float uTime;
  uniform float uWeight;
  varying vec2 vUv;
  void main() {
    float r = length(vUv * 2.0 - 1.0);
    float core = exp(-r * r * 6.5);
    float halo = exp(-r * r * 2.2);
    float pulse = 0.90 + 0.10 * sin(uTime * 54.0 + uWeight * 12.0);
    float vis = (1.0 - uVacuum) * smoothstep(0.08, 0.55, uBoost) * uWeight * pulse;
    vec3 col = mix(vec3(1.0, 0.52, 0.12), vec3(0.95, 0.96, 1.0), core);
    float intensity = (halo * 0.45 + core * 1.45) * vis * (0.75 + 0.85 * uBoost);
    gl_FragColor = vec4(col * intensity, 1.0);
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
  materialTweaks?: Record<string, { color?: number; roughness?: number; metalness?: number; opacity?: number; emissive?: number; envMapIntensity?: number }>;
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
  materialTweaks: {
    // Anti-glare cockpit interior & glareshield finish so noon sunlight never washes out the panel
    '3305ca56-f56e-4f85-ad2d-32863f146ae0': { color: 0x8d97a2, roughness: 0.88, metalness: 0.12, envMapIntensity: 0.32 },
    'ffeddf5a-6eb4-4326-a840-bd26797b18c6': { color: 0x383d44, roughness: 0.86, metalness: 0.15, envMapIntensity: 0.3 },
    '3324ca19-059f-4f68-9c3d-7a7f86712c55': { color: 0x161a1f, roughness: 0.82, metalness: 0.18, envMapIntensity: 0.28 },
    'ff5a8533-2b31-4c3e-a6d1-db2b4d924566': { color: 0x7c848e, roughness: 0.86, metalness: 0.14, envMapIntensity: 0.34 },
  },
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
    // Lower side bow stubs along the forward windscreen arch (z: -4.94..-4.80)
    { material: 'saab_jas39a_aircraft_normal_detail', min: [-0.45, 0.34, -5.05], max: [0.45, 0.42, -4.75] },
    // The canopy's clips and the mirror mount, in the cockpit mesh (the panel and HUD sit lower)
    { material: 'saab_jas39a_cockpit', min: [-0.7, 0.62, -5.38], max: [0.7, 1.6, -2.85] },
    // Two floating black canopy-bow latch brackets at (±0.355, 0.421, -4.831) left behind when bow is hidden
    { material: 'saab_jas39a_cockpit', min: [-0.46, 0.345, -5.06], max: [-0.27, 0.62, -4.72] },
    { material: 'saab_jas39a_cockpit', min: [0.27, 0.345, -5.06], max: [0.46, 0.62, -4.72] },
    // The HUD's two bare posts above the up-front panel (the combiner glass and its symbols stay)
    { material: 'sw_sight_saab_39c', min: [-0.3, 0.36, -5.3], max: [0.3, 1.2, -4.7] },
  ],
  materialTweaks: {
    // The canopy's reflection layer: a whisper of glass, not a white veil
    dynamic_glass_chrome: { opacity: 0.035, roughness: 0.04, envMapIntensity: 0.65 },
    empty_glass: { opacity: 0.08, roughness: 0.03, envMapIntensity: 0.65 },
    dynamic_mirror: { color: 0xd8dadc, metalness: 1, roughness: 0.05 },
    // Multi-function displays: deep matte anti-glare OLED backing (replaced at runtime by MfdDisplays)
    dynamic_mfd: { color: 0x050a08, roughness: 0.14, emissive: 0x071a11, envMapIntensity: 0.12 },
    // Military Nextel matte charcoal cockpit coaming & HUD housing: eliminates sunlit white washout
    saab_jas39a_cockpit: { color: 0x9298a0, roughness: 0.89, metalness: 0.08, envMapIntensity: 0.30 },
    sw_sight_saab_39c: { color: 0x4b5058, roughness: 0.92, metalness: 0.12, envMapIntensity: 0.24 },
    sw_gauge_mfd_jas39a: { color: 0x5c626b, roughness: 0.86, metalness: 0.14, envMapIntensity: 0.28 },
    saab_jas39a_lables: { color: 0xb0b7bf, roughness: 0.85, metalness: 0.05, envMapIntensity: 0.32 },
    seat_saab_jas39: { color: 0x989ea5, roughness: 0.87, metalness: 0.08, envMapIntensity: 0.34 },
    saab_jas39a_interior: { color: 0x1a1d21, roughness: 0.88, envMapIntensity: 0.28 },
    saab_jas39a_inside: { color: 0x22262b, roughness: 0.9, envMapIntensity: 0.28 },
    saab_jas39a_lables_1: { color: 0x191b1e, roughness: 0.82, envMapIntensity: 0.3 },
    sw_gauge_rpm_jas39a: { color: 0x15171a, roughness: 0.6, envMapIntensity: 0.25 },
    sw_gauge_exhaust_temperature_jas39a: { color: 0x15171a, roughness: 0.6, envMapIntensity: 0.25 },
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
  rp: THREE.Vector3;
  rn: THREE.Vector3;
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
        rp: new THREE.Vector3().lerpVectors(a.rp, b.rp, t),
        rn: new THREE.Vector3().lerpVectors(a.rn, b.rn, t).normalize(),
      };
      inside.push(mid);
      outside.push({
        p: mid.p.clone(),
        n: mid.n.clone(),
        u: mid.u.clone(),
        rp: mid.rp.clone(),
        rn: mid.rn.clone(),
      });
    } else if (aIn && !bIn && Math.abs(da) <= eps && !aOut) {
      outside.push({
        p: a.p.clone(),
        n: a.n.clone(),
        u: a.u.clone(),
        rp: a.rp.clone(),
        rn: a.rn.clone(),
      });
    } else if (!aIn && bIn && Math.abs(db) <= eps && !bOut) {
      outside.push({
        p: b.p.clone(),
        n: b.n.clone(),
        u: b.u.clone(),
        rp: b.rp.clone(),
        rn: b.rn.clone(),
      });
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
  mount: THREE.Group;
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
  turbineRotors: THREE.Group[];
  flameholderMats: THREE.MeshStandardMaterial[];
  turbineAngleRad: number;
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

  private skinId: JetSkinId = chosenJetSkin();
  private canopyTint: CanopyTintId = chosenCanopyTint();
  private holoAuraEnabled: boolean = chosenHoloAura();
  private hullSkinMats: THREE.MeshPhysicalMaterial[] = [];
  private canopyMats: THREE.MeshPhysicalMaterial[] = [];
  private markingsTex: THREE.CanvasTexture | null = null;
  private airframeDisposables: Array<{ dispose(): void }> = [];
  private loadToken = 0;
  private readonly skinTmpV = new THREE.Vector3();
  private readonly skinTmpM = new THREE.Matrix4();
  private readonly skinU = {
    uSkinMode: { value: 1 },
    uAirframeType: { value: 0 },
    uSkinTime: { value: 0 },
    uSkinAirspeed: { value: 0 },
    uSkinMach: { value: 0 },
    uSkinGLoad: { value: 1 },
    uSkinAB: { value: 0 },
    uSkinDarkness: { value: 0 },
    uSkinJerk: { value: 0 },
    uSkinLightSweep: { value: 0 },
    uSkinPulseAge: { value: 99 },
    uSkinPulseOrigin: { value: new THREE.Vector3(0, 0.25, -8.5) },
    uSkinCamLocal: { value: new THREE.Vector3(-8, 3.5, -14) },
    uWorldTint: { value: new THREE.Color(0x62b6ff) },
    uCanopyMode: { value: 0 },
    uSkinInside: { value: 0 },
    uMarkingsTex: { value: null as THREE.Texture | null },
  };
  private holoAuraGroup: THREE.Group | null = null;
  private holoAuraQuads: THREE.Mesh[] = [];
  private holoAuraMat: THREE.ShaderMaterial | null = null;
  private emberPoints: THREE.Points | null = null;
  private emberMat: THREE.ShaderMaterial | null = null;
  private emberState: {
    pos: Float32Array;
    vel: Float32Array;
    age: Float32Array;
    life: Float32Array;
    seed: Float32Array;
    size: Float32Array;
    rng: number;
  } | null = null;

  /** Set the active 3D livery (`'flame_phantom'`, `'plasma_ion'`, `'nebula_prism'`, `'aurora_jade'`, or `'stock'`) without shader recompilation. */
  public setSkin(skinId: JetSkinId): void {
    const prevMode = this.skinU.uSkinMode.value;
    this.skinId = skinId;
    const spec = JET_SKIN_BY_ID[skinId] ?? JET_SKIN_BY_ID.flame_phantom;
    this.skinU.uSkinMode.value = spec.shaderMode;
    this.applySkinMaterialProps();
    this.syncSkinFXPalette();
    if (spec.shaderMode !== prevMode && spec.shaderMode > 0) {
      this.triggerSkinPulse();
    }
  }

  public getSkin(): JetSkinId {
    return this.skinId;
  }

  /** Enable or disable floating 3D wing/tail holographic tactical crest rings. */
  public setHoloAuraEnabled(enabled: boolean): void {
    this.holoAuraEnabled = enabled;
    if (this.holoAuraGroup) {
      this.holoAuraGroup.visible = enabled && this.skinId !== 'stock' && !this.insideOn;
    }
  }

  public getHoloAuraEnabled(): boolean {
    return this.holoAuraEnabled;
  }

  /** Set the ambient planet/sky rim color reflected cleanly through thin-film clearcoat and nebula depth. */
  public setWorldTint(color: THREE.ColorRepresentation): void {
    this.skinU.uWorldTint.value.set(color);
  }

  /** Update camera position in jet local rest-pose space for crisp 3D wing parallax depth. */
  public setSkinCameraWorld(camWorld: THREE.Vector3): void {
    this.root.updateMatrixWorld();
    this.skinTmpV.copy(camWorld).applyMatrix4(this.skinTmpM.copy(this.root.matrixWorld).invert());
    this.skinU.uSkinCamLocal.value.copy(this.skinTmpV);
  }

  /** Trigger a radial energy shockwave sweeping across the 3D skin (on click, AB light-off, Mach cone, or world switch). */
  public triggerSkinPulse(pos?: THREE.Vector3, isWorldSpace = false): void {
    if (pos) {
      if (isWorldSpace) {
        this.root.updateMatrixWorld();
        this.skinTmpV.copy(pos).applyMatrix4(this.skinTmpM.copy(this.root.matrixWorld).invert());
        this.skinU.uSkinPulseOrigin.value.copy(this.skinTmpV);
      } else {
        this.skinU.uSkinPulseOrigin.value.copy(pos);
      }
    } else {
      const zNose = this.airframeId === 'gripen' ? -5.6 : this.airframeId === 'su30' ? -9.8 : -7.5;
      this.skinU.uSkinPulseOrigin.value.set(0, 0.2, zNose);
    }
    this.skinU.uSkinPulseAge.value = 0;
  }

  /** Set exterior canopy film tint (`'clear'`, `'smoked'`, or `'gold'`) without obscuring cockpit view. */
  public setCanopyTint(tint: CanopyTintId): void {
    this.canopyTint = tint;
    this.skinU.uCanopyMode.value = tint === 'gold' ? 2 : tint === 'smoked' ? 1 : 0;
    this.applyCanopyMaterialProps();
  }

  public getCanopyTint(): CanopyTintId {
    return this.canopyTint;
  }

  private getMarkingsTexture(): THREE.CanvasTexture {
    if (this.markingsTex) return this.markingsTex;
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 256;
    const ctx = c.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, c.width, c.height);
    // Crisp high-contrast stencil 'SB-143' matching SU-30MKI Flame Phantom nose lettering
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '800 172px "Bahnschrift", "DIN Condensed", "Arial Narrow", "Inter", sans-serif';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 8;
    ctx.strokeStyle = 'rgba(245, 247, 250, 0.35)';
    ctx.strokeText('SB-143', 512, 132);
    ctx.fillStyle = '#181c22';
    ctx.fillText('SB-143', 512, 132);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    this.markingsTex = t;
    this.skinU.uMarkingsTex.value = t;
    this.disposables.push(t);
    return t;
  }

  private applySkinMaterialProps(): void {
    const mode = this.skinU.uSkinMode.value;
    const isCustom = mode > 0.5;
    for (const mat of this.hullSkinMats) {
      const stock = mat.userData.stockProps as
        | {
            color: THREE.Color;
            roughness: number;
            metalness: number;
            emissive: THREE.Color;
            emissiveIntensity: number;
            clearcoat: number;
            clearcoatRoughness: number;
            envMapIntensity: number;
            aoMapIntensity: number;
            normalScale: THREE.Vector2;
            iridescence?: number;
            iridescenceIOR?: number;
          }
        | undefined;
      if (isCustom) {
        const isRivet = !!mat.userData.isRivetLayer;
        mat.color.setHex(0xffffff);
        mat.roughness = 1.0;
        mat.metalness = 1.0;
        mat.emissive.setHex(0xffffff);
        mat.emissiveIntensity = 1.0;
        mat.clearcoat = isRivet ? 0.20 : 0.82;
        mat.clearcoatRoughness = isRivet ? 0.32 : 0.085;
        mat.envMapIntensity = 0.92;
        mat.aoMapIntensity = 0.05;
        mat.iridescence = isRivet ? 0.15 : mode === 4 ? 0.85 : mode >= 2 ? 0.55 : 0.35;
        mat.iridescenceIOR = mode === 2 ? 1.62 : mode === 3 ? 1.82 : mode === 4 ? 1.72 : 1.48;
        mat.iridescenceThicknessRange = mode === 4 ? [220, 560] : mode === 3 ? [260, 620] : [180, 480];
        mat.normalScale?.set(0.45, 0.45);
      } else if (stock) {
        mat.color.copy(stock.color);
        mat.roughness = stock.roughness;
        mat.metalness = stock.metalness;
        mat.emissive.copy(stock.emissive);
        mat.emissiveIntensity = stock.emissiveIntensity;
        mat.clearcoat = stock.clearcoat;
        mat.clearcoatRoughness = stock.clearcoatRoughness;
        mat.envMapIntensity = stock.envMapIntensity;
        mat.aoMapIntensity = stock.aoMapIntensity;
        mat.iridescence = stock.iridescence ?? 0.001;
        mat.iridescenceIOR = stock.iridescenceIOR ?? 1.35;
        if (stock.normalScale) mat.normalScale?.copy(stock.normalScale);
      }
    }
  }

  private applyCanopyMaterialProps(): void {
    const inside = this.insideOn;
    const tint = this.canopyTint;
    for (const mat of this.canopyMats) {
      const stock = mat.userData.stockProps as
        | {
            color: THREE.Color;
            roughness: number;
            metalness: number;
            opacity: number;
            envMapIntensity: number;
            iridescence: number;
            iridescenceIOR: number;
          }
        | undefined;
      if (inside) {
        mat.color.setHex(0xb8c4cc);
        mat.roughness = 0.025;
        mat.metalness = 0.0;
        mat.opacity = mat === this.canopyGlass ? 0.06 : 0.055;
        mat.envMapIntensity = 0.35;
        mat.iridescence = 0.05;
      } else if (tint === 'gold') {
        mat.color.setHex(0xc88b22);
        mat.roughness = 0.04;
        mat.metalness = 0.38;
        mat.opacity = 0.68;
        mat.envMapIntensity = 1.75;
        mat.iridescence = 1.0;
        mat.iridescenceIOR = 1.85;
        mat.iridescenceThicknessRange = [280, 560];
        mat.clearcoat = 1.0;
        mat.clearcoatRoughness = 0.04;
      } else if (tint === 'smoked') {
        mat.color.setHex(0x0c0e13);
        mat.roughness = 0.03;
        mat.metalness = 0.12;
        mat.opacity = 0.62;
        mat.envMapIntensity = 1.35;
        mat.iridescence = 0.12;
        mat.iridescenceIOR = 1.45;
        mat.clearcoat = 1.0;
        mat.clearcoatRoughness = 0.04;
      } else if (stock) {
        mat.color.copy(stock.color);
        mat.roughness = stock.roughness;
        mat.metalness = stock.metalness;
        mat.opacity = stock.opacity;
        mat.envMapIntensity = stock.envMapIntensity;
        mat.iridescence = stock.iridescence;
        mat.iridescenceIOR = stock.iridescenceIOR;
        mat.clearcoat = 0.35;
        mat.clearcoatRoughness = 0.06;
      }
    }
  }

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
    // Anti-glare anodized military charcoal canopy rail (matches the Gripen/Su-30 cockpit coaming)
    const paint = new THREE.MeshStandardMaterial({ color: 0x262b31, roughness: 0.78, metalness: 0.2, envMapIntensity: 0.42 });
    const seal = new THREE.MeshStandardMaterial({ color: 0x070809, roughness: 0.9, metalness: 0, envMapIntensity: 0.25 });
    const steel = new THREE.MeshStandardMaterial({ color: 0x454b52, roughness: 0.52, metalness: 0.58, envMapIntensity: 0.5 });
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
  return step(0.84, gH(c)) * smoothstep(r, r * 0.3, length(f));
}
// Fine acrylic canopy micro-scratches / cleaning hairline arcs (visible only under direct sunlight)
float gMicroScratch(vec2 uv) {
  vec2 p = uv * vec2(18.0, 26.0);
  vec2 cell = floor(p);
  vec2 f = fract(p) - 0.5;
  float h = gH(vec3(cell, 7.3));
  if (h < 0.72) return 0.0;
  float ang = (h - 0.72) * 22.0;
  float cs = cos(ang), sn = sin(ang);
  vec2 r = vec2(f.x * cs - f.y * sn, f.x * sn + f.y * cs);
  float len = 0.26 + 0.18 * fract(h * 19.7);
  float line = smoothstep(0.014, 0.002, abs(r.y)) * smoothstep(len, len * 0.4, abs(r.x));
  return line;
}`)
        .replace(
        '#include <opaque_fragment>',
        `{
  vec3 V = normalize(vViewPosition);
  float nv = abs(dot(normalize(normal), V));
  float fres = pow(1.0 - nv, 3.8);
  // Coated fighter acrylic canopy: crisp ~5% head-on reflection (crystal-clear forward sightline),
  // smoothly building to ~38% grazing sky/cockpit reflection so the bubble reads without milky haze
  vec3 reflDir = inverseTransformDirection(reflect(-V, normalize(normal)), viewMatrix);
  float reflK = mix(0.05, 0.38, pow(1.0 - nv, 4.2));
  vec3 mirrored = textureCube(uGlassEnv, reflDir).rgb;
  // Softly compress HDR reflection spikes so direct bright clouds never wash the canopy milky white
  mirrored = mirrored / (vec3(1.0) + mirrored * 0.38);
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
  float a = 0.022 + 0.19 * fres;
  // Subtle laminated fighter canopy cool-emerald coating tint
  outgoingLight += vec3(0.004, 0.009, 0.011);
  // Near the frame the acrylic is thick and seen edge-on: green-teal laminated edge rim deepening
  // into the rubber seal so the bubble outline stays crisp from inside
  float toSill = min(vGlassUv.x, 1.0 - vGlassUv.x);
  float toEnd = min(vGlassUv.y * 1.6, 1.0 - vGlassUv.y);
  float rim = 1.0 - smoothstep(0.0, 0.068, min(toSill, toEnd * 0.6));
  outgoingLight += vec3(0.010, 0.038, 0.034) * rim + mirrored * 0.20 * rim * rim * uGlassEnvK;
  a += 0.11 * rim + 0.20 * rim * rim * rim;
  // Warm solar specular glint drawn crisply along the bubble curve
  vec3 sunV = normalize(uGlassSun);
  float sAlign = max(dot(reflect(-V, normalize(normal)), sunV), 0.0);
  float glint = pow(sAlign, 1100.0) * 5.2 + pow(sAlign, 72.0) * 0.10;
  outgoingLight += vec3(1.0, 0.94, 0.82) * glint * uGlassSunK;
  a += min(0.45, glint * 0.18) * uGlassSunK;
  // Micro-dust and fine acrylic hairline scratches: invisible in shade, catching warm fire toward the Sun
  float dust = gSpecks(vGlassLocal, 145.0) + 0.65 * gSpecks(vGlassLocal + 3.7, 320.0);
  float scratch = gMicroScratch(vGlassUv) + 0.6 * gMicroScratch(vGlassUv * 1.63 + vec2(0.31, 0.19));
  float toward = pow(max(dot(-V, uGlassSun), 0.0), 5.5) * uGlassSunK;
  outgoingLight += vec3(1.0, 0.94, 0.80) * (dust * (0.025 + 1.9 * toward) + scratch * (0.008 + 0.42 * toward));
  a += dust * (0.035 + 0.32 * toward) + scratch * (0.01 + 0.12 * toward);
  diffuseColor.a = clamp(a, 0.0, 0.88);
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
    this.skinU.uSkinInside.value = on ? 1 : 0;
    this.applyCanopyMaterialProps();
    for (const m of this.insideMeshes) m.visible = !on;
    this.clipU.uClipOn.value = on ? 1 : 0;
    if (this.bubble) this.bubble.visible = on;
    if (this.canopyFrame) this.canopyFrame.visible = on;
    const fxVisible = this.skinId !== 'stock' && !on;
    if (this.holoAuraGroup) this.holoAuraGroup.visible = fxVisible && this.holoAuraEnabled;
    if (this.emberPoints) this.emberPoints.visible = fxVisible;
  }

  private addInsideClip(
    m: THREE.MeshStandardMaterial,
    boxes: Array<{ min: [number, number, number]; max: [number, number, number] }>,
  ): void {
    const MAX_BOXES = 4;
    const count = Math.min(boxes.length, MAX_BOXES);
    if (count === 0) return;
    const mins: THREE.Vector3[] = [];
    const maxs: THREE.Vector3[] = [];
    for (let i = 0; i < MAX_BOXES; i++) {
      const b = boxes[Math.min(i, count - 1)];
      mins.push(new THREE.Vector3(...b.min));
      maxs.push(new THREE.Vector3(...b.max));
    }
    const prev = m.onBeforeCompile;
    const prevKey = m.customProgramCacheKey;
    const uniforms = {
      uClipCount: { value: count },
      uClipMin: { value: mins },
      uClipMax: { value: maxs },
    };
    m.onBeforeCompile = (shader, renderer) => {
      prev?.call(m, shader, renderer);
      Object.assign(shader.uniforms, this.clipU, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>
uniform mat4 uRootInv;
varying vec3 vRootPos;`)
        .replace('#include <project_vertex>', `#include <project_vertex>
vRootPos = (uRootInv * modelMatrix * vec4(transformed, 1.0)).xyz;`);
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>
uniform float uClipOn;
uniform int uClipCount;
uniform vec3 uClipMin[${MAX_BOXES}];
uniform vec3 uClipMax[${MAX_BOXES}];
varying vec3 vRootPos;`)
        .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
if (uClipOn > 0.5) {
  for (int i = 0; i < ${MAX_BOXES}; i++) {
    if (i < uClipCount && all(greaterThan(vRootPos, uClipMin[i])) && all(lessThan(vRootPos, uClipMax[i]))) discard;
  }
}`);
    };
    m.customProgramCacheKey = () => `${prevKey ? `${prevKey.call(m)}|` : ''}solaris-canopy-clip-${MAX_BOXES}`;
    m.needsUpdate = true;
  }

  /** Upgrade any MeshStandardMaterial to MeshPhysicalMaterial while preserving PBR maps & stock defaults. */
  private upgradeToPhysical(src: THREE.Material): THREE.MeshPhysicalMaterial {
    const sm = src as THREE.MeshStandardMaterial;
    const pm =
      src instanceof THREE.MeshPhysicalMaterial
        ? src
        : new THREE.MeshPhysicalMaterial({
            name: sm.name,
            color: sm.color?.clone(),
            map: sm.map,
            normalMap: sm.normalMap,
            normalScale: sm.normalScale?.clone(),
            roughnessMap: sm.roughnessMap,
            roughness: sm.roughness,
            metalnessMap: sm.metalnessMap,
            metalness: sm.metalness,
            aoMap: sm.aoMap,
            aoMapIntensity: sm.aoMapIntensity,
            bumpMap: sm.bumpMap,
            bumpScale: sm.bumpScale,
            emissive: sm.emissive?.clone(),
            emissiveMap: sm.emissiveMap,
            emissiveIntensity: sm.emissiveIntensity,
            transparent: sm.transparent,
            opacity: sm.opacity,
            alphaTest: sm.alphaTest,
            side: sm.side,
            depthWrite: sm.depthWrite,
            envMapIntensity: sm.envMapIntensity,
          });
    pm.name = sm.name;
    pm.userData = { ...sm.userData };
    pm.userData.stockProps = {
      color: pm.color.clone(),
      roughness: pm.roughness,
      metalness: pm.metalness,
      emissive: pm.emissive.clone(),
      emissiveIntensity: pm.emissiveIntensity,
      clearcoat: pm.clearcoat || 0.001,
      clearcoatRoughness: pm.clearcoatRoughness || 0.12,
      envMapIntensity: pm.envMapIntensity ?? 1.0,
      aoMapIntensity: pm.aoMapIntensity ?? 1.0,
      normalScale: pm.normalScale ? pm.normalScale.clone() : new THREE.Vector2(1, 1),
      opacity: pm.opacity,
      iridescence: pm.iridescence || 0.001,
      iridescenceIOR: pm.iridescenceIOR || 1.35,
    };
    if (pm.clearcoat === 0) pm.clearcoat = 0.001;
    if (pm.iridescence === 0) pm.iridescence = 0.001;
    return pm;
  }

  /** Stamp jet-local rest-pose `aRestPos` & `aRestNormal` attributes onto exterior meshes. */
  private stampRestPose(targetObj: THREE.Object3D): void {
    this.root.updateMatrixWorld(true);
    const toJet = new THREE.Matrix4().copy(this.root.matrixWorld).invert();
    const m = new THREE.Matrix4();
    const nm = new THREE.Matrix3();
    const p = new THREE.Vector3();
    const n = new THREE.Vector3();
    targetObj.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const geo = mesh.geometry;
      const pos = geo.attributes.position;
      if (!pos || geo.attributes.aRestPos) return;
      m.multiplyMatrices(toJet, mesh.matrixWorld);
      nm.getNormalMatrix(m);
      const nor = geo.attributes.normal;
      const rp = new Float32Array(pos.count * 3);
      const rn = new Float32Array(pos.count * 3);
      for (let i = 0; i < pos.count; i++) {
        p.fromBufferAttribute(pos, i).applyMatrix4(m);
        rp[i * 3] = p.x;
        rp[i * 3 + 1] = p.y;
        rp[i * 3 + 2] = p.z;
        if (nor) n.fromBufferAttribute(nor, i).applyMatrix3(nm).normalize();
        else n.set(0, 1, 0);
        rn[i * 3] = n.x;
        rn[i * 3 + 1] = n.y;
        rn[i * 3 + 2] = n.z;
      }
      geo.setAttribute('aRestPos', new THREE.BufferAttribute(rp, 3));
      geo.setAttribute('aRestNormal', new THREE.BufferAttribute(rn, 3));
    });
  }

  /** Attach the rest-pose 3D Flame Phantom livery shader onto an exterior hull PhysicalMaterial. */
  private patchHullSkinMaterial(mat: THREE.MeshPhysicalMaterial, isRivetLayer = false): void {
    if (mat.userData.solarisSkinPatched) return;
    mat.userData.solarisSkinPatched = true;
    mat.userData.isRivetLayer = isRivetLayer;
    this.getMarkingsTexture();
    const prev = mat.onBeforeCompile;
    const prevKey = mat.customProgramCacheKey;
    const isRivetU = { value: isRivetLayer ? 1 : 0 };

    mat.onBeforeCompile = (shader, renderer) => {
      prev?.call(mat, shader, renderer);
      Object.assign(shader.uniforms, this.skinU, { uIsRivetOverlay: isRivetU });
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
attribute vec3 aRestPos;
attribute vec3 aRestNormal;
varying vec3 vRestPos;
varying vec3 vRestNormal;`,
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
vRestPos = aRestPos;
vRestNormal = aRestNormal;`,
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
uniform float uSkinMode;
uniform float uAirframeType;
uniform float uSkinTime;
uniform float uSkinAirspeed;
uniform float uSkinMach;
uniform float uSkinGLoad;
uniform float uSkinAB;
uniform float uSkinDarkness;
uniform float uSkinJerk;
uniform float uSkinLightSweep;
uniform float uSkinPulseAge;
uniform vec3 uSkinPulseOrigin;
uniform vec3 uSkinCamLocal;
uniform vec3 uWorldTint;
uniform float uIsRivetOverlay;
uniform sampler2D uMarkingsTex;
varying vec3 vRestPos;
varying vec3 vRestNormal;

struct FpSkinEval {
  vec3 color;
  float roughness;
  float metalness;
  float clearcoatMul;
  vec3 emissive;
  float skinWeight;
};

float fpHash2(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float fpHash3(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}
float fpNoise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(fpHash2(i), fpHash2(i + vec2(1.0, 0.0)), f.x),
    mix(fpHash2(i + vec2(0.0, 1.0)), fpHash2(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}
float fpFbm2(vec2 p) {
  return fpNoise2(p) * 0.56 + fpNoise2(p * 2.17 + vec2(3.1, 1.7)) * 0.29 + fpNoise2(p * 4.43 - vec2(1.9, 5.3)) * 0.15;
}
// Ridged organic energy veins (magma cracks / plasma arcs / cosmic filaments)
float fpVeinRidge(vec2 p) {
  float a = abs(fpFbm2(p) - 0.5) * 2.0;
  float b = abs(fpFbm2(p * 1.9 + vec2(5.2, -3.7)) - 0.5) * 2.0;
  return pow(1.0 - clamp(min(a, b * 1.15), 0.0, 1.0), 5.5);
}
// Optical thin-film interference spectral iridescence
vec3 fpThinFilm(float ndv, float phase) {
  return 0.5 + 0.5 * cos(6.28318 * (ndv * 1.38 + phase + vec3(0.0, 0.33, 0.67)));
}
// Individual sculpted asymmetrical S-curved flame tongue
float fpTongue(float s, float center, float width, float zOff, float lean) {
  float d = (s - center - lean * zOff) / width;
  float env = max(0.0, 1.0 - d * d);
  return pow(env, 1.65);
}
// Sharp (-Z) pointed flame cusps with broad (+Z) rounded obsidian bays
float fpFlameCusps(float u, float skew, float freq2, float phase2) {
  float s1 = abs(sin((u + skew) * 0.5));
  float tip1 = 1.0 - pow(clamp(s1, 0.0, 1.0), 0.50);
  float s2 = abs(sin(u * freq2 + phase2));
  float tip2 = 1.0 - pow(clamp(s2, 0.0, 1.0), 0.58);
  return tip1 * 0.74 + tip2 * 0.26;
}
// Crisp rest-pose aerospace panel lines, hatches & rivet rows (zero stock camo/decal bleed)
float fpPanelGrooves(vec3 mp) {
  float ax = abs(mp.x);
  float seamZ = smoothstep(0.015, 0.003, abs(fract(mp.z * 0.62) - 0.5));
  float seamX = smoothstep(0.015, 0.003, abs(fract(ax * 0.74) - 0.5));
  float swept = smoothstep(0.014, 0.003, abs(fract((mp.z - ax * 0.56) * 0.72) - 0.5)) * step(1.6, ax);
  vec2 cell = floor(vec2(ax * 0.74, mp.z * 0.62));
  float cellTone = (fpHash2(cell) - 0.5) * 0.06;
  float rivetZ = smoothstep(0.010, 0.003, abs(fract(mp.z * 0.62 + 0.03) - 0.5))
               * smoothstep(0.18, 0.05, abs(fract(ax * 6.5) - 0.5));
  float lines = max(max(seamZ, seamX), swept);
  return clamp(lines * 0.65 + rivetZ * 0.28 + max(cellTone, 0.0), 0.0, 0.85);
}
// Animated parallax starfield & prismatic metal flakes
float fpParallaxStars(vec2 uv, float t, float scale) {
  vec2 g = uv * scale;
  vec2 id = floor(g);
  vec2 lv = fract(g) - 0.5;
  float h = fpHash2(id);
  vec2 jitter = (vec2(fract(h * 19.3), fract(h * 41.7)) - 0.5) * 0.62;
  float d = length(lv - jitter);
  float twinkle = 0.45 + 0.55 * sin(t * (2.2 + fract(h * 11.1) * 4.5) + h * 42.0);
  return step(0.84, h) * smoothstep(0.13, 0.02, d) * twinkle;
}
// Indian Air Force tricolor roundel (saffron outer, white middle, green center + crisp edge)
vec4 fpIafRoundel(vec2 delta, float r, float aa) {
  float d = length(delta) / r;
  float alpha = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, d);
  vec3 saffron = vec3(1.0, 0.36, 0.03);
  vec3 white = vec3(0.94, 0.95, 0.97);
  vec3 green = vec3(0.015, 0.42, 0.022);
  vec3 rim = vec3(0.04, 0.045, 0.055);
  vec3 col = mix(white, saffron, smoothstep(0.66 - aa, 0.66 + aa, d));
  col = mix(green, col, smoothstep(0.34 - aa, 0.34 + aa, d));
  col = mix(col, rim, smoothstep(0.93 - aa, 0.97 + aa, d));
  return vec4(col, alpha * step(0.005, alpha));
}
// IAF rectangular tricolor fin flash (left-to-right nose->tail: Saffron | White | Green)
vec4 fpIafFinFlash(vec2 uv, float aa) {
  vec2 d2 = max(abs(uv - 0.5) - 0.5, vec2(0.0));
  float box = length(d2);
  float mask = (1.0 - smoothstep(0.0, aa, box)) * step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  vec3 saffron = vec3(1.0, 0.38, 0.03);
  vec3 white = vec3(0.96, 0.97, 0.99);
  vec3 green = vec3(0.018, 0.48, 0.028);
  vec3 col = mix(saffron, white, smoothstep(0.333 - aa, 0.333 + aa, uv.x));
  col = mix(col, green, smoothstep(0.666 - aa, 0.666 + aa, uv.x));
  float border = 1.0 - smoothstep(0.0, 0.055, min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)));
  col = mix(col, vec3(0.03, 0.035, 0.045), border * 0.75);
  return vec4(col, mask * step(0.005, mask));
}

FpSkinEval fpEvalSkin(vec3 rp, vec3 rnRaw, vec3 baseTex) {
  FpSkinEval res;
  res.color = baseTex;
  res.roughness = 0.5;
  res.metalness = 0.1;
  res.clearcoatMul = 1.0;
  res.emissive = vec3(0.0);
  res.skinWeight = 0.0;

  vec3 rn = normalize(rnRaw);
  float isGripen = step(0.5, uAirframeType) * (1.0 - step(1.5, uAirframeType));
  float isKestrel = step(1.5, uAirframeType);
  float isSu30 = 1.0 - step(0.5, uAirframeType);
  float ax = abs(rp.x);

  // Compute view-space / decal coords BEFORE any conditional branch to guarantee clean derivative evaluation
  vec3 camOffset = uSkinCamLocal - rp;
  vec3 viewDir = normalize(length(camOffset) > 0.05 ? camOffset : vec3(-0.4, 0.35, -0.85));
  float ndv = clamp(abs(dot(rn, viewDir)), 0.0, 1.0);
  float fresnel = pow(1.0 - ndv, 2.75);

  vec2 wCenter = isSu30 > 0.5 ? vec2(5.15, 2.38) : (isGripen > 0.5 ? vec2(2.75, 1.72) : vec2(3.65, 3.65));
  float wRad = isSu30 > 0.5 ? 0.50 : (isGripen > 0.5 ? 0.38 : 0.42);
  float aaWingRnd = max(fwidth(length(vec2(ax - wCenter.x, rp.z - wCenter.y)) / wRad), 0.015);
  vec2 rCheekPos = isSu30 > 0.5 ? vec2(-10.44, 0.02) : (isGripen > 0.5 ? vec2(-6.12, -0.05) : vec2(-6.35, 0.02));
  float rCheekRad = isSu30 > 0.5 ? 0.165 : 0.125;
  float aaCheekRnd = max(fwidth(length(rp.zy - rCheekPos) / rCheekRad), 0.015);
  float z0Fin = isSu30 > 0.5 ? 4.18 : (isGripen > 0.5 ? 3.40 : 5.30);
  float z1Fin = isSu30 > 0.5 ? 4.94 : (isGripen > 0.5 ? 4.08 : 6.10);
  float y0Fin = isSu30 > 0.5 ? 2.20 : (isGripen > 0.5 ? 1.48 : 1.40);
  float y1Fin = isSu30 > 0.5 ? 2.66 : (isGripen > 0.5 ? 1.84 : 1.80);
  vec2 fUv = vec2((rp.z - z0Fin) / (z1Fin - z0Fin), (rp.y - y0Fin) / (y1Fin - y0Fin));
  float aaFin = max(fwidth(fUv.x) + fwidth(fUv.y), 0.015);
  float zFront = isSu30 > 0.5 ? -10.14 : (isGripen > 0.5 ? -5.88 : -6.10);
  float zBack  = isSu30 > 0.5 ? -8.72  : (isGripen > 0.5 ? -4.92 : -5.05);
  float yBot   = isSu30 > 0.5 ? -0.15  : (isGripen > 0.5 ? -0.18 : -0.12);
  float yTop   = isSu30 > 0.5 ?  0.21  : (isGripen > 0.5 ?  0.08 :  0.14);
  float uSB = rp.x < 0.0 ? (rp.z - zFront) / (zBack - zFront) : (zBack - rp.z) / (zBack - zFront);
  float vSB = (rp.y - yBot) / (yTop - yBot);
  vec4 sbSample = texture2D(uMarkingsTex, clamp(vec2(uSB, vSB), 0.0, 1.0));

  if (uSkinMode < 0.5) return res;

  // 1. Engine nozzles untouched (heat-tinted titanium & bronze petals)
  float nozzleMask = 0.0;
  float shroudCollar = 0.0;
  if (isSu30 > 0.5) {
    float rNoz = length(vec2(ax - 1.22, rp.y + 0.51));
    nozzleMask = smoothstep(5.58, 5.74, rp.z) * (1.0 - smoothstep(0.61, 0.72, rNoz));
    shroudCollar = smoothstep(5.16, 5.34, rp.z) * (1.0 - smoothstep(5.58, 5.74, rp.z)) * (1.0 - smoothstep(0.58, 0.68, rNoz));
  } else if (isGripen > 0.5) {
    float rNoz = length(rp.xy);
    nozzleMask = smoothstep(4.78, 4.92, rp.z) * (1.0 - smoothstep(0.41, 0.50, rNoz));
    shroudCollar = smoothstep(4.52, 4.66, rp.z) * (1.0 - smoothstep(4.78, 4.92, rp.z)) * (1.0 - smoothstep(0.41, 0.50, rNoz));
  } else {
    float rNoz = length(vec2(ax - 0.56, rp.y));
    nozzleMask = smoothstep(7.05, 7.25, rp.z) * (1.0 - smoothstep(0.46, 0.56, rNoz));
  }
  res.skinWeight = clamp(1.0 - nozzleMask, 0.0, 1.0);
  if (uIsRivetOverlay > 0.5) {
    res.skinWeight *= 0.85;
  }

  // Map Gripen & Kestrel cleanly into Su-30 metric silhouette space for consistent proportions
  vec3 mp = rp;
  if (isGripen > 0.5) {
    mp = vec3(rp.x * (7.35 / 4.02), rp.y * 1.48 + 0.25, (rp.z + 8.63) * (22.6 / 14.10) - 13.80);
  } else if (isKestrel > 0.5) {
    mp = vec3(rp.x * (7.35 / 5.45), rp.y * 1.35 + 0.15, (rp.z + 9.0) * (22.6 / 16.50) - 13.80);
  }
  float maxX = abs(mp.x);

  // 2. Matte cool slate grey radome nose cone (no flames on radome)
  float radomeZ = -11.00 - mp.y * 0.14;
  float radomeMask = 1.0 - smoothstep(radomeZ - 0.025, radomeZ + 0.025, rp.z);
  if (isGripen > 0.5) {
    float gRadZ = -6.48 - rp.y * 0.12;
    radomeMask = 1.0 - smoothstep(gRadZ - 0.025, gRadZ + 0.025, rp.z);
  } else if (isKestrel > 0.5) {
    radomeMask = 1.0 - smoothstep(-6.75, -6.70, rp.z);
  }
  float radomeSeam = isSu30 > 0.5
    ? exp(-pow((rp.z - radomeZ) / 0.022, 2.0))
    : (isGripen > 0.5 ? exp(-pow((rp.z + 6.48 + rp.y * 0.12) / 0.02, 2.0)) : exp(-pow((rp.z + 6.72) / 0.02, 2.0)));

  // 3. Clean aerospace panel seams & micro-rivets + forged carbon geometric micro-weave
  float groove = fpPanelGrooves(mp);
  float weave = sin((mp.x + mp.z) * 44.0) * sin((mp.x - mp.z) * 44.0) * 0.5 + 0.5;

  // 4. Swept Flame Boundary with genuine billowing airflow curls & plasma ripples!
  float gNorm = clamp((uSkinGLoad - 1.0) / 8.0, 0.0, 1.0);
  float flowRate = 2.4 + uSkinAirspeed * 5.4 + uSkinAB * 6.2 + gNorm * 3.0 + uSkinJerk * 2.2;
  float advZ = mp.z - uSkinTime * flowRate;
  vec2 warp = vec2(
    fpNoise2(vec2(maxX * 1.4 - uSkinTime * 0.9, advZ * 0.45)) - 0.5,
    fpNoise2(vec2(maxX * 1.1 + mp.y * 0.9, advZ * 0.52 + 7.3)) - 0.5
  );
  float nMacro = fpFbm2(vec2(maxX * 0.92 + mp.y * 0.65, advZ * 0.58) + warp * 0.65) - 0.5;
  float nFine = fpNoise2(vec2(maxX * 3.2 - mp.y * 1.9, advZ * 2.3)) - 0.5;
  float rollWave = sin(advZ * 1.35 + maxX * 1.85) * 0.095;
  float liveWiggle = nMacro * (0.28 + 0.22 * uSkinAB + 0.16 * gNorm) + nFine * (0.09 + 0.10 * uSkinAB) + rollWave * (0.75 + 0.85 * uSkinAB);

  // Zone weights
  float finZone = isSu30 > 0.5
    ? smoothstep(1.80, 2.02, ax) * smoothstep(0.68, 0.92, rp.y)
    : (isGripen > 0.5 ? (1.0 - smoothstep(0.20, 0.42, ax)) * smoothstep(0.55, 0.82, rp.y) * smoothstep(0.8, 1.15, rp.z)
                       : smoothstep(0.65, 1.0, ax) * smoothstep(0.40, 0.72, rp.y) * smoothstep(2.8, 3.2, rp.z));
  float stabZone = isSu30 > 0.5
    ? smoothstep(1.90, 2.12, ax) * smoothstep(3.98, 4.22, rp.z) * (1.0 - smoothstep(0.18, 0.45, rp.y))
    : 0.0;
  float wingZone = smoothstep(1.62, 1.95, maxX) * (1.0 - finZone) * (1.0 - stabZone);

  // A) Twin / Center Vertical Fin Flame Contour
  float zFinLE = isSu30 > 0.5 ? (1.65 + max(0.0, rp.y - 0.80) * 0.98)
               : (isGripen > 0.5 ? (0.85 + max(0.0, rp.y - 0.60) * 1.18) : (3.1 + max(0.0, rp.y - 0.4) * 1.15));
  float fyFin = isSu30 > 0.5 ? clamp((rp.y - 0.85) / 2.75, 0.0, 1.0) : clamp((rp.y - 0.62) / 1.85, 0.0, 1.0);
  float finZBase = zFinLE + (isSu30 > 0.5 ? mix(0.68, 0.46, fyFin) : mix(0.42, 0.26, fyFin));
  float finOff = rp.z - finZBase;
  float finT1 = fpTongue(fyFin, 0.22, 0.14, finOff, 0.08 + 0.04 * sin(uSkinTime * 2.1));
  float finT2 = fpTongue(fyFin, 0.56, 0.13, finOff, 0.09 + 0.04 * cos(uSkinTime * 2.6 + 1.1));
  float finT3 = fpTongue(fyFin, 0.86, 0.11, finOff, 0.07 + 0.03 * sin(uSkinTime * 3.1 + 2.3));
  float finTongues = (isSu30 > 0.5 ? 0.54 : 0.38) * max(finT1, max(finT2, finT3));
  float dFin = finOff + finTongues + liveWiggle * 0.52;

  // B) Horizontal Stabilator Flame Contour
  float sStab = clamp((ax - 2.0) / 2.85, 0.0, 1.0);
  float zStabLE = 4.05 + max(0.0, ax - 2.0) * 0.76;
  float stabBase = zStabLE + 0.42;
  float stabOff = rp.z - stabBase;
  float st1 = fpTongue(sStab, 0.20, 0.19, stabOff, 0.10 + 0.04 * sin(uSkinTime * 2.2));
  float st2 = fpTongue(sStab, 0.58, 0.18, stabOff, 0.11 + 0.04 * cos(uSkinTime * 2.7 + 0.9));
  float st3 = fpTongue(sStab, 0.88, 0.14, stabOff, 0.08 + 0.04 * sin(uSkinTime * 3.0 + 1.8));
  float stabTongues = 0.44 * max(st1, max(st2, st3));
  float dStab = stabOff + stabTongues + liveWiggle * 0.45;

  // C) Main Wing TOP & BOTTOM Flame Contours (4 asymmetrical animated S-curved tongues)
  float isTop = smoothstep(-0.20, 0.15, rn.y);
  float sWing = clamp((maxX - 1.85) / 5.55, 0.0, 1.0);
  float zWingTopBase = -0.58 + (maxX - 2.0) * 0.58;
  float wTopOff = mp.z - zWingTopBase;
  float wt1 = 1.44 * fpTongue(sWing, 0.06, 0.13, wTopOff, -0.05 + 0.05 * sin(uSkinTime * 2.1));
  float wt2 = 1.18 * fpTongue(sWing, 0.30, 0.12, wTopOff,  0.07 + 0.06 * cos(uSkinTime * 2.5 + 1.2));
  float wt3 = 1.00 * fpTongue(sWing, 0.56, 0.115, wTopOff, 0.08 + 0.06 * sin(uSkinTime * 2.9 + 2.4));
  float wt4 = 0.84 * fpTongue(sWing, 0.85, 0.11, wTopOff,  0.07 + 0.05 * cos(uSkinTime * 3.3 + 0.7));
  float dWingTop = wTopOff + max(max(wt1, wt2), max(wt3, wt4)) + liveWiggle;
  if (isGripen > 0.5) {
    float gS = clamp((ax - 0.82) / 3.20, 0.0, 1.0);
    float gLE = -2.15 + max(0.0, ax - 0.82) * 1.36;
    float gBase = gLE + 0.82 - max(0.0, ax - 0.82) * 0.14;
    float gOff = rp.z - gBase;
    float gt1 = 0.74 * fpTongue(gS, 0.14, 0.18, gOff, 0.07 + 0.05 * sin(uSkinTime * 2.3));
    float gt2 = 0.64 * fpTongue(gS, 0.48, 0.16, gOff, 0.09 + 0.05 * cos(uSkinTime * 2.8 + 1.0));
    float gt3 = 0.54 * fpTongue(gS, 0.82, 0.15, gOff, 0.08 + 0.05 * sin(uSkinTime * 3.1));
    dWingTop = (gOff + max(gt1, max(gt2, gt3))) * 1.35 + liveWiggle;
  }

  float zWingBotBase = 1.18 + (maxX - 5.0) * 0.48 + max(0.0, 3.55 - maxX) * 2.15;
  float wBotOff = mp.z - zWingBotBase;
  float wb1 = 0.85 * fpTongue(sWing, 0.34, 0.13, wBotOff, 0.06 + 0.05 * sin(uSkinTime * 2.4));
  float wb2 = 0.80 * fpTongue(sWing, 0.62, 0.12, wBotOff, 0.08 + 0.05 * cos(uSkinTime * 2.9));
  float wb3 = 0.72 * fpTongue(sWing, 0.88, 0.11, wBotOff, 0.07 + 0.05 * sin(uSkinTime * 3.3));
  float dWingBot = wBotOff + max(wb1, max(wb2, wb3)) + liveWiggle * 0.9;
  if (isGripen > 0.5) {
    float gS = clamp((ax - 0.82) / 3.20, 0.0, 1.0);
    float gLEb = -1.75 + max(0.0, ax - 0.82) * 1.30 + max(0.0, 1.85 - ax) * 1.90;
    float gOffB = rp.z - (gLEb + 0.75);
    float gb1 = 0.58 * fpTongue(gS, 0.35, 0.16, gOffB, 0.07 + 0.05 * sin(uSkinTime * 2.3));
    float gb2 = 0.52 * fpTongue(gS, 0.75, 0.15, gOffB, 0.08 + 0.05 * cos(uSkinTime * 2.9));
    dWingBot = (gOffB + max(gb1, gb2)) * 1.35 + liveWiggle;
  }
  float dWing = mix(dWingBot, dWingTop, isTop);

  // D) Unified Dorsal Spine, Side LERX Shoulder Tongues, Engine Cowls & True Ventral Belly
  float isVentral = isGripen > 0.5
    ? smoothstep(-0.35, -0.68, rn.y) * (1.0 - smoothstep(-0.42, -0.15, rp.y)) * (1.0 - smoothstep(3.2, 3.8, rp.z))
    : smoothstep(-0.35, -0.68, rn.y) * (1.0 - smoothstep(-0.74, -0.50, rp.y)) * (1.0 - smoothstep(3.9, 4.5, rp.z));

  float spineTongue = 3.05 * exp(-pow(maxX / 0.78, 2.0));
  float sideShoulderMask = smoothstep(0.45, 0.75, abs(rn.x)) * smoothstep(0.60, 1.05, maxX);
  float sideTongue = sideShoulderMask * (2.65 * exp(-pow((mp.y - 0.10) / 0.38, 2.0)) + 1.35 * exp(-pow((mp.y + 0.45) / 0.32, 2.0)));
  float cowlCusps = 0.62 * fpFlameCusps(maxX * 2.55, 0.18 * mp.y, 1.75, 0.8);
  float dFuseTop = mp.z - (0.15 - max(spineTongue, sideTongue) - cowlCusps + liveWiggle * 0.92);
  if (isGripen > 0.5) {
    float gSpine = 2.60 * exp(-pow(ax / 0.52, 2.0));
    float gSide = smoothstep(0.45, 0.75, abs(rn.x)) * 1.85 * exp(-pow((rp.y + 0.05) / 0.28, 2.0));
    dFuseTop = (rp.z - (-0.75 - max(gSpine, gSide))) * 1.35 + liveWiggle * 0.92;
  }
  float dFuseBot = isGripen > 0.5
    ? (rp.z - (2.35 + 0.22 * cos(ax * 2.4))) * 1.35 + liveWiggle * 0.55
    : mp.z - (3.55 + 0.32 * cos(maxX * 2.5) + liveWiggle * 0.6);
  float dFuse = mix(dFuseTop, dFuseBot, isVentral);

  float dFlame = dFuse;
  dFlame = mix(dFlame, dWing, wingZone);
  dFlame = mix(dFlame, dStab, stabZone);
  dFlame = mix(dFlame, dFin, finZone);

  float canopyFrameMask = isSu30 > 0.5
    ? smoothstep(-9.72, -9.45, rp.z) * (1.0 - smoothstep(-4.72, -4.45, rp.z)) * smoothstep(0.74, 0.92, rp.y) * (1.0 - smoothstep(0.58, 0.74, ax))
    : (isGripen > 0.5 ? smoothstep(-5.98, -5.75, rp.z) * (1.0 - smoothstep(-3.45, -3.22, rp.z)) * smoothstep(0.24, 0.36, rp.y) * (1.0 - smoothstep(0.38, 0.52, ax)) : 0.0);

  float aaD = clamp(fwidth(dFlame), 0.004, 0.045);

  // 5. Select Living Skin Colorways (1 = Flame Phantom Solar Flare, 2 = Cherenkov Ion Surge, 3 = Nebula Sovereign Prism, 4 = Solaris Aurora)
  vec3 palPearl = vec3(0.90, 0.915, 0.935);
  vec3 palObsidian = vec3(0.007, 0.009, 0.014);
  vec3 palFireLow = vec3(0.58, 0.020, 0.002);
  vec3 palFireMid = vec3(1.0, 0.13, 0.004);
  vec3 palFireAmber = vec3(1.0, 0.38, 0.018);
  vec3 palFireHot = vec3(1.0, 0.90, 0.54);
  vec3 palNebA = vec3(0.85, 0.22, 0.03);
  vec3 palNebB = vec3(0.24, 0.38, 0.85);
  float filmPhase = 0.08;

  if (uSkinMode > 3.5) {
    // Mode 4: Solaris Aurora Borealis (frost titanium -> jade / teal -> imperial gold curtains on pitch obsidian glass)
    palPearl = vec3(0.86, 0.92, 0.90);
    palObsidian = vec3(0.006, 0.014, 0.016);
    palFireLow = vec3(0.02, 0.48, 0.34);
    palFireMid = vec3(0.06, 0.92, 0.60);
    palFireAmber = vec3(0.98, 0.78, 0.16);
    palFireHot = vec3(0.86, 1.0, 0.86);
    palNebA = vec3(0.06, 0.92, 0.62);
    palNebB = vec3(0.95, 0.72, 0.22);
    filmPhase = 0.42;
  } else if (uSkinMode > 2.5) {
    // Mode 3: Nebula Sovereign Prism (moonstone pearl -> crimson-violet-rose-gold parallax cosmos in deep black void)
    palPearl = vec3(0.90, 0.88, 0.94);
    palObsidian = vec3(0.008, 0.005, 0.018);
    palFireLow = vec3(0.46, 0.04, 0.42);
    palFireMid = vec3(0.96, 0.16, 0.68);
    palFireAmber = vec3(1.0, 0.62, 0.36);
    palFireHot = vec3(1.0, 0.92, 1.0);
    palNebA = vec3(0.88, 0.18, 0.72);
    palNebB = vec3(0.24, 0.72, 1.0);
    filmPhase = 0.74;
  } else if (uSkinMode > 1.5) {
    // Mode 2: Cherenkov Ion Surge (cryo silver-white -> cobalt -> cyan-white electric arc plasma on dark carbon)
    palPearl = vec3(0.88, 0.92, 0.96);
    palObsidian = vec3(0.005, 0.010, 0.022);
    palFireLow = vec3(0.05, 0.14, 0.72);
    palFireMid = vec3(0.10, 0.56, 1.0);
    palFireAmber = vec3(0.46, 0.95, 1.0);
    palFireHot = vec3(0.92, 0.99, 1.0);
    palNebA = vec3(0.14, 0.70, 1.0);
    palNebB = vec3(0.58, 0.32, 1.0);
    filmPhase = 0.56;
  }

  // Blend subtle world-atmosphere chroma strictly into grazing thin-film clearcoat & recessed parallax highlights
  palNebB = mix(palNebB, uWorldTint, 0.42);

  // 6. Asymmetric 3-Layer View-Parallax Obsidian Glass Interior (zero Rorschach spine symmetry!)
  vec2 pOff = viewDir.xz / max(0.34, ndv + 0.26);
  vec2 uvSurface = vec2(mp.x, mp.z);
  vec2 uvDepth1 = uvSurface - pOff * 0.22; // mid depth: plasma/magma/lightning veins
  vec2 uvDepth2 = uvSurface - pOff * 0.52; // deep cosmos: nebula wisps & twinkling stars

  float swirlSpeed = 0.28 + 0.52 * uSkinAB + 0.30 * gNorm;
  vec2 nebFlow = uvDepth2 * 0.36 + vec2(sin(uSkinTime * 0.24 + mp.z * 0.18) * 0.32, -uSkinTime * swirlSpeed);
  float nebGasA = fpFbm2(nebFlow);
  float nebGasB = fpFbm2(nebFlow * 1.55 - vec2(uSkinTime * 0.16, 4.1));
  float auroraCurtain = uSkinMode > 3.5
    ? pow(0.5 + 0.5 * sin(uvDepth1.x * 2.1 + fpFbm2(vec2(uvDepth1.x * 0.7, uvDepth1.y * 0.35 - uSkinTime * 0.85)) * 4.2), 3.4)
    : 0.0;

  float starsLayer1 = fpParallaxStars(uvDepth1 * 1.15, uSkinTime, 2.8);
  float starsLayer2 = fpParallaxStars(uvDepth2 * 1.45 + vec2(3.1, 7.7), uSkinTime * 1.2 + 1.4, 4.2);
  float flakeAngle = max(0.0, dot(normalize(vec3(sin(fpHash2(floor(rp.xz * 28.0)) * 20.0), 1.4, cos(fpHash2(floor(rp.zx * 28.0)) * 20.0))), viewDir));
  float metallicFlake = pow(flakeAngle, 16.0) * 0.45;

  // Razor-thin asymmetric magma / plasma veins branching aft from the flame tongues into deep obsidian glass
  float veinDistDecay = smoothstep(0.05, 0.45, dFlame) * (1.0 - smoothstep(2.0, 5.8, dFlame));
  vec2 veinCoord = vec2(mp.x * 0.95 + warp.x * 0.55 + mp.y * 0.25, advZ * 0.65 + warp.y * 0.42);
  float veinsPrimary = pow(fpVeinRidge(veinCoord * 1.05), 1.65);
  float veinsVolt = uSkinMode > 1.5 && uSkinMode < 2.5
    ? pow(fpVeinRidge(veinCoord * 1.9 + vec2(uSkinTime * 2.1, -uSkinTime * 2.8)), 1.5) * (0.45 + 0.75 * gNorm + 0.55 * uSkinAB)
    : 0.0;
  float aftVeins = clamp((veinsPrimary * (0.55 + 0.60 * uSkinAB + 0.45 * gNorm) + veinsVolt * 0.85) * (0.28 + 0.72 * veinDistDecay), 0.0, 1.0);

  // Detached glowing ember wisps peeling cleanly off asymmetrical flame tips
  float wispField = fpFbm2(vec2(mp.x * 2.1 + mp.y * 1.2 + sin(uSkinTime * 0.8), advZ * 1.8));
  float detachedLicks = smoothstep(0.64, 0.84, wispField) * smoothstep(0.32, 0.68, dFlame) * (1.0 - smoothstep(0.95, 1.95, dFlame));

  // Deep pitch-black obsidian albedo (never muddy grey!) with subtle recessed cosmos & glint
  vec3 parallaxVoid = palObsidian * mix(0.88, 1.15, weave);
  float nebDepthWeight = uSkinMode > 2.5 ? 0.09 : (uSkinMode > 3.5 ? 0.07 : 0.035);
  parallaxVoid += mix(palNebA, palNebB, nebGasB) * smoothstep(0.48, 0.88, nebGasA) * nebDepthWeight;
  parallaxVoid += palNebA * auroraCurtain * 0.06;
  parallaxVoid += mix(vec3(0.88, 0.92, 1.0), palFireAmber, 0.28) * (starsLayer1 * 0.32 + starsLayer2 * 0.55);
  parallaxVoid += mix(uWorldTint, palFireAmber, 0.25) * metallicFlake * 0.08;

  // Crisp pure white pearl forebody (fresnel^4.2 keeps straight-on diamond white!)
  float fresnelRim = pow(1.0 - ndv, 4.2);
  vec3 filmCol = fpThinFilm(ndv, filmPhase + uSkinLightSweep * 0.32 + mp.z * 0.025);
  vec3 worldBounceTint = mix(uWorldTint, filmCol, 0.62);
  vec3 forebodyPaint = palPearl + worldBounceTint * fresnelRim * (uSkinMode > 2.5 ? 0.14 : 0.08);
  forebodyPaint += vec3(0.92, 0.96, 1.0) * metallicFlake * 0.03;

  float flameSpan = 0.56 + 0.16 * uSkinAB + 0.10 * gNorm;
  float blackMask = smoothstep(flameSpan * 0.78 - aaD, flameSpan + 0.14 + aaD, dFlame);
  vec3 basePaint = mix(forebodyPaint, parallaxVoid, smoothstep(-0.02 - aaD, 0.06 + aaD, dFlame));

  // Wide sharp dark charcoal/obsidian outer graphic border separating pearl white from fire
  float rimOuter = smoothstep(-0.095 - aaD, -0.040, dFlame) * (1.0 - smoothstep(0.025, 0.075 + aaD, dFlame));
  basePaint = mix(basePaint, vec3(0.008, 0.008, 0.011), rimOuter * 0.98);

  // Multi-stop living fire + flowing aurora/plasma tongue cores
  float fireTurbulence = fpFbm2(vec2(mp.x * 2.2 + mp.y * 1.8, advZ * 2.1)) * 0.64 + fpNoise2(vec2(mp.x * 4.8, advZ * 4.2)) * 0.36;
  float fireBand = smoothstep(0.015 - aaD, 0.065, dFlame) * (1.0 - smoothstep(flameSpan * 0.80, flameSpan * 1.22 + aaD, dFlame));
  fireBand = clamp(max(fireBand, detachedLicks * 0.68), 0.0, 1.0);
  float tFire = clamp(dFlame / max(flameSpan, 0.05), 0.0, 1.0);
  float coreMask = sin(clamp(tFire * 3.14159265, 0.0, 3.14159265));
  float hotCore = clamp(max(coreMask * (0.38 + 0.72 * fireTurbulence + 0.42 * uSkinAB + 0.28 * gNorm), detachedLicks * 0.78), 0.0, 1.0);

  vec3 fireAlbedo = mix(palFireLow, palFireMid, smoothstep(0.10, 0.46, hotCore));
  fireAlbedo = mix(fireAlbedo, palFireAmber, smoothstep(0.42, 0.82, hotCore));
  float surgeHot = clamp(max(uSkinAB, gNorm * 0.88) - 0.08, 0.0, 1.0);
  fireAlbedo = mix(fireAlbedo, palFireHot, smoothstep(0.72, 0.96, hotCore) * surgeHot);

  fireBand *= (1.0 - canopyFrameMask);
  hotCore *= (1.0 - canopyFrameMask);
  float suppressedVeins = pow(aftVeins, 1.45) * blackMask * (1.0 - canopyFrameMask);

  basePaint = mix(basePaint, fireAlbedo, fireBand);
  basePaint = mix(basePaint, mix(palFireMid, palFireAmber, aftVeins), suppressedVeins * 0.28);
  basePaint = mix(basePaint, palObsidian, canopyFrameMask);
  blackMask = max(blackMask, canopyFrameMask);

  // Subtle world-tinted mirror edge sheen only at sharp grazing angles of dark wings
  basePaint += worldBounceTint * pow(1.0 - ndv, 4.4) * blackMask * 0.05;

  // Aerospace panel-line & rivet shading across white, flame, and black zones
  basePaint *= mix(1.0, 0.74, groove);

  // 7. Continuous Telemetry Heartbeat Sweep + Razor-Crisp Radial Shockwave Ring!
  float sweepZ = -11.5 + fract(uSkinTime * (0.21 + 0.26 * uSkinAB + 0.14 * gNorm)) * 19.5;
  float MachSweep = exp(-pow((mp.z - sweepZ) / 0.36, 2.0)) * (0.22 + 0.45 * uSkinAB + 0.35 * gNorm);
  float shockR = uSkinPulseAge * 26.0;
  float dPulse = length(rp - uSkinPulseOrigin) - shockR;
  float shockRing = exp(-dPulse * dPulse * 18.0) * exp(-uSkinPulseAge * 1.45) * step(uSkinPulseAge, 3.0);
  float totalWave = clamp(MachSweep * (groove * 0.65 + aftVeins * 1.15 + fireBand * 0.55) + shockRing * (0.85 + aftVeins * 1.1), 0.0, 1.85);

  // 8. Indian Air Force Markings: Forward Cheek Roundel + SB-143 + Wing Roundels + Fin Flashes
  float cheekZone = isSu30 > 0.5
    ? smoothstep(0.50, 0.70, abs(rn.x)) * smoothstep(0.28, 0.45, ax) * smoothstep(-10.85, -10.55, rp.z) * (1.0 - smoothstep(-8.65, -8.35, rp.z)) * smoothstep(-0.32, -0.18, rp.y) * (1.0 - smoothstep(0.24, 0.38, rp.y))
    : smoothstep(0.48, 0.68, abs(rn.x)) * smoothstep(0.16, 0.32, ax) * smoothstep(-6.50, -6.25, rp.z) * (1.0 - smoothstep(-4.85, -4.60, rp.z));
  vec4 fwdRnd = fpIafRoundel(rp.zy - rCheekPos, rCheekRad, aaCheekRnd);
  basePaint = mix(basePaint, fwdRnd.rgb, fwdRnd.a * cheekZone);
  float sbInside = step(0.0, uSB) * step(uSB, 1.0) * step(0.0, vSB) * step(vSB, 1.0);
  basePaint = mix(basePaint, sbSample.rgb * 0.18, sbSample.a * cheekZone * sbInside);

  // Wing IAF Tricolor Roundels (TOP & BOTTOM outer wings)
  float wingRndMask = smoothstep(0.45, 0.72, abs(rn.y)) * (1.0 - finZone) * (1.0 - stabZone);
  float yBand = isSu30 > 0.5 ? (1.0 - smoothstep(0.24, 0.36, abs(rp.y))) : 1.0;
  vec4 wRnd = fpIafRoundel(vec2(ax - wCenter.x, rp.z - wCenter.y), wRad, aaWingRnd);
  float wingRndPop = wRnd.a * wingRndMask * yBand;
  basePaint = mix(basePaint, wRnd.rgb, wingRndPop);

  // IAF Tricolor Fin Flash on BOTH vertical fins
  vec4 flash = fpIafFinFlash(fUv, aaFin);
  float finFlashPop = flash.a * finZone * smoothstep(0.50, 0.62, abs(rn.x));
  vec3 finFlashCol = flash.rgb;
  basePaint = mix(basePaint, flash.rgb, finFlashPop);

  // 9. Matte Grey Radome & Titanium Nozzle Shroud Collar
  vec3 radomeGrey = vec3(0.23, 0.26, 0.31) * mix(1.0, 0.80, groove * 0.4);
  basePaint = mix(basePaint, radomeGrey, radomeMask);
  basePaint = mix(basePaint, vec3(0.025, 0.028, 0.032), radomeSeam * 0.85);
  basePaint = mix(basePaint, vec3(0.16, 0.17, 0.20), shroudCollar);

  // 10. Selective Razor-Crisp HDR Glow (keeps pearl-white sharp & black ink deep while sparks/veins/waves ignite!)
  float pulseBeat = 0.80 + 0.20 * sin(uSkinTime * (4.6 + uSkinAB * 7.5 + gNorm * 4.5) - mp.z * 1.45);
  float travelingCore = smoothstep(0.40, 0.95, sin(advZ * 2.1 + mp.x * 1.4)) * 0.65 + 0.35;
  float surgeBoost = clamp(0.55 + uSkinAB * 2.65 + gNorm * 1.55 + uSkinDarkness * 0.60 + clamp(uSkinJerk, 0.0, 1.0) * 0.65, 0.0, 4.8);
  vec3 glowColor = mix(palFireMid, palFireAmber, hotCore);
  glowColor = mix(glowColor, palFireHot, smoothstep(0.65, 1.0, hotCore) * max(surgeHot, travelingCore * 0.38));

  float filamentHdr = pow(clamp(hotCore, 0.0, 1.0), 1.95) * travelingCore;
  vec3 emissive = glowColor * (fireBand * 0.28 + filamentHdr * 1.15) * surgeBoost * pulseBeat * (1.0 - radomeMask) * (1.0 - shroudCollar);
  emissive += mix(palFireMid, palFireHot, 0.52) * suppressedVeins * (0.45 + 1.45 * uSkinAB + 0.95 * gNorm + 0.45 * uSkinDarkness);
  emissive += mix(palNebA, palFireHot, 0.48) * auroraCurtain * blackMask * (0.38 + 0.85 * uSkinDarkness + 0.75 * uSkinAB);
  emissive += mix(palFireMid, palFireHot, 0.72) * totalWave * (0.85 + 1.15 * shockRing) * (1.0 - radomeMask);
  // Crisp national emblem illumination & deep parallax stars inside obsidian glass
  emissive += finFlashCol * finFlashPop * 0.16 + basePaint * wingRndPop * 0.06;
  emissive += mix(vec3(0.75, 0.86, 1.0), palFireAmber, 0.35) * (starsLayer1 * 0.45 + starsLayer2 * 0.92) * blackMask * (0.35 + 0.65 * uSkinDarkness + 0.45 * uSkinAB) * (1.0 - radomeMask);

  // 11. Per-Zone PBR Roughness, Metalness & Clearcoat Modulation
  float paintRough = mix(0.24, 0.08, smoothstep(0.0, 0.2, dFlame));
  paintRough = mix(paintRough, 0.30, fireBand);
  paintRough = clamp(paintRough + groove * 0.14 - suppressedVeins * 0.06, 0.05, 0.92);
  paintRough = mix(paintRough, 0.64, radomeMask);
  paintRough = mix(paintRough, 0.32, shroudCollar);

  float paintMetal = mix(0.14, 0.32, blackMask);
  paintMetal = mix(paintMetal, 0.88, clamp((starsLayer1 + metallicFlake) * blackMask, 0.0, 1.0));
  paintMetal = mix(paintMetal, 0.05, radomeMask);
  paintMetal = mix(paintMetal, 0.86, shroudCollar);

  float ccMul = mix(1.0, 0.04, radomeMask) * (1.0 - shroudCollar * 0.78);

  res.color = basePaint;
  res.roughness = paintRough;
  res.metalness = paintMetal;
  res.clearcoatMul = ccMul;
  res.emissive = emissive;
  return res;
}`,
        )
        .replace(
          '#include <map_fragment>',
          `#include <map_fragment>
FpSkinEval fpSkin = fpEvalSkin(vRestPos, normalize(vRestNormal), diffuseColor.rgb);
if (uSkinMode > 0.5) {
  diffuseColor.rgb = mix(diffuseColor.rgb, fpSkin.color, fpSkin.skinWeight);
}`,
        )
        .replace(
          '#include <roughnessmap_fragment>',
          `#include <roughnessmap_fragment>
if (uSkinMode > 0.5) {
  roughnessFactor = mix(roughnessFactor, fpSkin.roughness, fpSkin.skinWeight);
}`,
        )
        .replace(
          '#include <metalnessmap_fragment>',
          `#include <metalnessmap_fragment>
if (uSkinMode > 0.5) {
  metalnessFactor = mix(metalnessFactor, fpSkin.metalness, fpSkin.skinWeight);
}`,
        )
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
if (uSkinMode > 0.5) {
  totalEmissiveRadiance = mix(totalEmissiveRadiance, fpSkin.emissive, fpSkin.skinWeight);
}`,
        )
        .replace(
          '#include <lights_physical_fragment>',
          `#include <lights_physical_fragment>
#ifdef USE_CLEARCOAT
  if (uSkinMode > 0.5) {
    material.clearcoat *= mix(1.0, fpSkin.clearcoatMul, fpSkin.skinWeight);
  }
#endif`,
        );
    };
    mat.customProgramCacheKey = () => `${prevKey ? `${prevKey.call(mat)}|` : ''}solaris-jet-skin-v3-${isRivetLayer ? 1 : 0}`;
    mat.needsUpdate = true;
    if (!this.hullSkinMats.includes(mat)) this.hullSkinMats.push(mat);
  }

  /** Attach exterior canopy tint shader (Clear / Smoked / Gold Iridium) without obscuring cockpit view. */
  private patchCanopyMaterial(mat: THREE.MeshPhysicalMaterial): void {
    if (mat.userData.solarisCanopyPatched) return;
    mat.userData.solarisCanopyPatched = true;
    const prev = mat.onBeforeCompile;
    const prevKey = mat.customProgramCacheKey;
    mat.onBeforeCompile = (shader, renderer) => {
      prev?.call(mat, shader, renderer);
      Object.assign(shader.uniforms, this.skinU);
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
attribute vec3 aRestPos;
attribute vec3 aRestNormal;
varying vec3 vRestPos;
varying vec3 vRestNormal;`,
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
vRestPos = aRestPos;
vRestNormal = aRestNormal;`,
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
uniform float uCanopyMode;
uniform float uSkinInside;
uniform float uAirframeType;
varying vec3 vRestPos;
varying vec3 vRestNormal;`,
        )
        .replace(
          '#include <map_fragment>',
          `#include <map_fragment>
float fpDomeMask = (uAirframeType < 0.5)
  ? smoothstep(0.62, 0.78, vRestPos.y) * smoothstep(-9.52, -9.25, vRestPos.z) * (1.0 - smoothstep(-4.68, -4.42, vRestPos.z))
  : 1.0;
float fpExtTint = fpDomeMask * (1.0 - uSkinInside);
if (uCanopyMode > 1.5) {
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.76, 0.48, 0.08), fpExtTint);
  diffuseColor.a = mix(diffuseColor.a, 0.72, fpExtTint);
} else if (uCanopyMode > 0.5) {
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.02, 0.025, 0.035), fpExtTint);
  diffuseColor.a = mix(diffuseColor.a, 0.64, fpExtTint);
}
if (uSkinInside > 0.5) {
  diffuseColor.a = min(diffuseColor.a, 0.07);
}`,
        )
        .replace(
          '#include <lights_physical_fragment>',
          `#include <lights_physical_fragment>
if (uCanopyMode > 1.5 && fpExtTint > 0.01) {
  material.specularColor = mix(material.specularColor, vec3(1.0, 0.78, 0.24), fpExtTint * 0.85);
}`,
        );
    };
    mat.customProgramCacheKey = () => `${prevKey ? `${prevKey.call(mat)}|` : ''}solaris-canopy-tint-v1`;
    mat.needsUpdate = true;
    if (!this.canopyMats.includes(mat)) this.canopyMats.push(mat);
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
      turbineRotors: [],
      flameholderMats: [],
      turbineAngleRad: 0,
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
    const titanium = new THREE.MeshStandardMaterial({
      color: 0x262b33, roughness: 0.44, metalness: 0.88, envMapIntensity: 0.85,
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
        side: core > 0.5 ? THREE.DoubleSide : THREE.FrontSide,
      });
    this.plumeMat = plumeMaterial(0);
    const coreMat = plumeMaterial(1);
    this.disposables.push(this.plumeMat, coreMat);
    const shockDiscGeo = new THREE.CircleGeometry(0.26, 20);
    this.disposables.push(shockDiscGeo);
    const shockDiscMats: THREE.ShaderMaterial[] = [];
    for (let k = 0; k < 6; k++) {
      const m = new THREE.ShaderMaterial({
        uniforms: {
          uBoost: plumeUniforms.uBoost,
          uVacuum: plumeUniforms.uVacuum,
          uTime: plumeUniforms.uTime,
          uWeight: { value: Math.pow(1 - k / 6.6, 0.78) },
        },
        vertexShader: SHOCK_DISC_VERT,
        fragmentShader: SHOCK_DISC_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      this.disposables.push(m);
      shockDiscMats.push(m);
    }

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
      this.kestrelRig.irisPetals[i] = this.buildNozzleIris(anchor, 0.44, 0.55, 0.42, titanium, `kestrel_iris_${i}`);
      this.buildTurbineCore(this.kestrelRig, anchor, 0.40, 0.24, `kestrel_turbine_${i}`);

      const faceGeo = new THREE.CircleGeometry(0.42, 48);
      this.disposables.push(faceGeo);
      const face = new THREE.Mesh(faceGeo, this.nozzleGlowMat);
      // Seat combustion glow behind the recessed 18-blade LP turbine rotor (coreZ = 0.24)
      face.position.set(0, 0, 0.14);
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
      c.scale.set(0.76, 0.76, 0.80);
      p.add(c);
      // 6 cross-axial Mach shock diamond discs along the core centerline
      for (let k = 0; k < 6; k++) {
        const disc = new THREE.Mesh(shockDiscGeo, shockDiscMats[k]);
        const sDisc = 1.0 - k * 0.11;
        disc.position.set(0, 0, (0.085 + k * 0.145) * 9 * 0.80);
        disc.scale.set(sDisc, sDisc, 1);
        disc.renderOrder = 7;
        disc.frustumCulled = false;
        p.add(disc);
      }
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
    // Initialize procedural Kestrel hull & canopy with shared rest-pose skin & canopy shaders
    this.stampRestPose(this.body);
    for (const mat of [hull, darkHull]) {
      const pm = this.upgradeToPhysical(mat);
      this.patchHullSkinMaterial(pm);
    }
    const glassPm = this.upgradeToPhysical(glass);
    this.patchCanopyMaterial(glassPm);
    this.setupSkinFX();
    this.skinU.uAirframeType.value = 2;
    this.repositionSkinFX();
    this.setSkin(this.skinId);
    this.setCanopyTint(this.canopyTint);
  }

  /** Clear any previously loaded GLB airframe and free its WebGL buffers/materials/textures. */
  public clearLoadedAirframe(): void {
    if (this.airframe) {
      this.airframe.removeFromParent();
      this.airframe = null;
    }
    if (this.bubble) {
      this.bubble.removeFromParent();
      this.bubble = null;
    }
    if (this.canopyFrame) {
      this.canopyFrame.removeFromParent();
      this.canopyFrame = null;
    }
    this.loadedExtras.clear();
    this.crew.clear();
    this.crewHead = null;
    this.insideMeshes = [];
    this.canopyMesh = null;
    const loadedSet = new Set<THREE.Material>();
    for (const d of this.airframeDisposables) {
      if ((d as THREE.Material).isMaterial) loadedSet.add(d as THREE.Material);
      d.dispose();
    }
    this.airframeDisposables = [];
    this.hullSkinMats = this.hullSkinMats.filter((m) => !loadedSet.has(m));
    this.canopyMats = this.canopyMats.filter((m) => !loadedSet.has(m));
  }

  /**
   * Fly a loaded airframe instead of the procedural one: a glTF model in metres (meshopt
   * compression supported), turned so its nose points down -Z. The exhaust, nozzle glow, lights
   * and the pilot's eye move to the model's own positions (`anchors`, in the turned frame).
   */
  public async loadAirframe(url: string, anchors: AirframeAnchors, forceReplace = false): Promise<void> {
    if (this.airframe && !forceReplace) return;
    const token = ++this.loadToken;
    // Wait for Meshopt WASM decoder readiness before parsing compressed GLB buffers
    if (MeshoptDecoder && 'ready' in MeshoptDecoder && MeshoptDecoder.ready) {
      await MeshoptDecoder.ready;
    }
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    let gltf: Awaited<ReturnType<GLTFLoader['loadAsync']>>;
    if (typeof fetch === 'function') {
      // High-priority fetch prevents 150+ concurrent Google 3D Tile requests from starving/aborting the jet GLB
      const res = await fetch(url, { priority: 'high' } as RequestInit);
      if (!res.ok) throw new Error(`HTTP ${res.status} loading airframe ${url}`);
      const buf = await res.arrayBuffer();
      const head = new Uint8Array(buf, 0, Math.min(4, buf.byteLength));
      if (buf.byteLength < 12 || head[0] !== 0x67 || head[1] !== 0x6c || head[2] !== 0x54 || head[3] !== 0x46) {
        throw new Error(`Invalid glTF binary response for ${url} (${buf.byteLength} bytes)`);
      }
      const basePath = url.slice(0, url.lastIndexOf('/') + 1);
      gltf = await loader.parseAsync(buf, basePath);
    } else {
      gltf = await loader.loadAsync(url);
    }
    if (token !== this.loadToken) return;
    if (this.airframe) this.clearLoadedAirframe();

    const model = gltf.scene;
    if (anchors.noseAlongPositiveZ) model.rotation.y = Math.PI;
    if (anchors.noseAlongPositiveX) model.rotation.y = Math.PI / 2;
    if (anchors.modelScale) model.scale.setScalar(anchors.modelScale);
    const airframeId = anchors.airframeId ?? (anchors.nozzles.length === 1 ? 'gripen' : 'su30');
    const hidden = anchors.hideMaterials ?? [];
    const hullPrefixes = airframeId === 'gripen' ? ['saab_jas39a_aircraft_normal_detail'] : ['0c5b', '1718', 'a04b'];
    const upgradedMats = new Map<THREE.Material, THREE.MeshPhysicalMaterial>();

    // Group all insideClip boxes per material so multi-box clipping never drops subsequent boxes
    const clipsByMat = new Map<string, Array<{ min: [number, number, number]; max: [number, number, number] }>>();
    for (const clip of anchors.insideClip ?? []) {
      let arr = clipsByMat.get(clip.material);
      if (!arr) {
        arr = [];
        clipsByMat.set(clip.material, arr);
      }
      arr.push({ min: clip.min, max: clip.max });
    }
    model.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = false;

      // Upgrade hull & canopy materials cleanly to MeshPhysicalMaterial BEFORE insideClip & carving
      const rawMats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const nextMats = rawMats.map((orig) => {
        const nm = orig?.name ?? '';
        const isHull = hullPrefixes.some((p) => nm.startsWith(p));
        const isCanopy = nm.startsWith(anchors.canopyMaterial);
        if (!isHull && !isCanopy) return orig;
        let up = upgradedMats.get(orig);
        if (!up) {
          up = this.upgradeToPhysical(orig);
          upgradedMats.set(orig, up);
          if (up !== orig) orig.dispose();
        }
        return up;
      });
      mesh.material = Array.isArray(mesh.material) ? nextMats : nextMats[0];

      const mats = nextMats;
      if (hidden.some((h) => mats[0]?.name?.startsWith(h))) mesh.visible = false;
      if (anchors.hideMeshes?.includes(mesh.name)) mesh.visible = false;
      if (anchors.insideHideMeshes?.includes(mesh.name)) this.insideMeshes.push(mesh);

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
          if (tw.envMapIntensity !== undefined && 'envMapIntensity' in sm) sm.envMapIntensity = tw.envMapIntensity;
          if (tw.emissive !== undefined) {
            sm.emissive?.setHex(tw.emissive);
            sm.emissiveIntensity = 1;
          }
          // Refresh stock baseline snapshot after materialTweaks
          if (sm.userData.stockProps) {
            sm.userData.stockProps.color.copy(sm.color);
            sm.userData.stockProps.roughness = sm.roughness;
            sm.userData.stockProps.metalness = sm.metalness;
            sm.userData.stockProps.opacity = sm.opacity;
            sm.userData.stockProps.envMapIntensity = sm.envMapIntensity;
          }
        }

        const boxes = clipsByMat.get(sm.name);
        if (boxes && !sm.userData.canopyClip) {
          sm.userData.canopyClip = true;
          this.addInsideClip(sm, boxes);
        }
        if (hullPrefixes.some((p) => sm.name.startsWith(p))) {
          this.patchHullSkinMaterial(sm as THREE.MeshPhysicalMaterial, sm.name.startsWith('a04b'));
        }
        if (sm.name.startsWith(anchors.canopyMaterial)) {
          this.patchCanopyMaterial(sm as THREE.MeshPhysicalMaterial);
        }

        this.airframeDisposables.push(sm);
        for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap'] as const) {
          const t = sm[key] as THREE.Texture | null | undefined;
          if (t) {
            t.anisotropy = 8;
            this.airframeDisposables.push(t);
          }
        }
      }
      if (mats[0]?.name?.startsWith(anchors.canopyMaterial)) this.canopyMesh = mesh;
      this.airframeDisposables.push(mesh.geometry);
    });
    this.root.add(model);
    this.airframe = model;
    // Stamp jet-local rest-pose coords BEFORE carveAirframeParts splits & shifts pivots
    this.stampRestPose(model);
    if (anchors.canopyProfile) {
      this.bubble = this.buildBubble(anchors.canopyProfile);
      this.root.add(this.bubble);
      this.canopyFrame = this.buildCanopyFrame(anchors.canopyProfile);
      this.root.add(this.canopyFrame);
    }
    this.body.visible = false;
    this.root.visible = true;
    this.airframeId = airframeId;
    this.skinU.uAirframeType.value = airframeId === 'gripen' ? 1 : airframeId === 'kestrel' ? 2 : 0;
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
    this.repositionSkinFX();
    this.setSkin(this.skinId);
    this.setCanopyTint(this.canopyTint);
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

  /**
   * Build a spinning 18-blade low-pressure turbine rotor, central spinner cone, recessed titanium
   * afterburner liner, and twin concentric glowing radial flameholder rings inside each nozzle.
   */
  private buildTurbineCore(
    rig: ArticulatedRig,
    parent: THREE.Group,
    innerR: number,
    coreZ: number,
    hostName?: string,
  ): void {
    const linerMat = new THREE.MeshStandardMaterial({
      color: 0x171a20,
      roughness: 0.72,
      metalness: 0.78,
      side: THREE.BackSide,
    });
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x626975,
      roughness: 0.34,
      metalness: 0.90,
    });
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0x3b3532,
      roughness: 0.52,
      metalness: 0.75,
      emissive: new THREE.Color(0xff7220),
      emissiveIntensity: 0.08,
    });
    this.disposables.push(linerMat, bladeMat, flameMat);
    rig.flameholderMats.push(flameMat);

    const host = new THREE.Group();
    if (hostName) host.name = hostName;
    host.position.set(0, 0, coreZ);
    parent.add(host);

    // Recessed cylindrical titanium liner for realistic deep tailpipe volume
    const linerLen = Math.max(0.32, innerR * 1.15);
    const linerGeo = new THREE.CylinderGeometry(innerR * 0.94, innerR * 0.90, linerLen, 24, 1, true);
    linerGeo.rotateX(Math.PI / 2);
    linerGeo.translate(0, 0, linerLen * 0.35);
    this.disposables.push(linerGeo);
    host.add(new THREE.Mesh(linerGeo, linerMat));

    // Spinning 18-blade LP turbine wheel + bullet spinner cone
    const rotor = new THREE.Group();
    const hubR = innerR * 0.26;
    const coneGeo = new THREE.ConeGeometry(hubR, innerR * 0.65, 16);
    coneGeo.rotateX(Math.PI / 2);
    coneGeo.translate(0, 0, innerR * 0.22);
    this.disposables.push(coneGeo);
    rotor.add(new THREE.Mesh(coneGeo, bladeMat));

    const bladeCount = 18;
    const bladeLen = innerR * 0.66;
    const bladeW = ((Math.PI * 2 * innerR * 0.58) / bladeCount) * 0.82;
    const bladeGeo = new THREE.BoxGeometry(bladeW, bladeLen, 0.018);
    bladeGeo.translate(0, hubR + bladeLen * 0.45, 0);
    this.disposables.push(bladeGeo);

    for (let k = 0; k < bladeCount; k++) {
      const ang = (k / bladeCount) * Math.PI * 2;
      const pivot = new THREE.Group();
      pivot.rotation.z = ang;
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      // Aerodynamic turbine stator/rotor pitch angle so spinning reads sharply from aft chase view
      blade.rotation.y = 0.54;
      pivot.add(blade);
      rotor.add(pivot);
    }
    host.add(rotor);
    rig.turbineRotors.push(rotor);

    // Twin concentric afterburner flameholder V-gutter rings + 8 radial fuel spraybars
    const ringOuterGeo = new THREE.TorusGeometry(innerR * 0.68, Math.max(0.014, innerR * 0.042), 8, 28);
    const ringInnerGeo = new THREE.TorusGeometry(innerR * 0.39, Math.max(0.012, innerR * 0.036), 8, 22);
    const spokeGeo = new THREE.BoxGeometry(Math.max(0.014, innerR * 0.038), innerR * 0.72, 0.022);
    this.disposables.push(ringOuterGeo, ringInnerGeo, spokeGeo);
    const fhGroup = new THREE.Group();
    fhGroup.position.z = innerR * 0.34;
    fhGroup.add(new THREE.Mesh(ringOuterGeo, flameMat), new THREE.Mesh(ringInnerGeo, flameMat));
    for (let s = 0; s < 8; s++) {
      const sp = new THREE.Mesh(spokeGeo, flameMat);
      sp.rotation.z = (s / 8) * Math.PI;
      fhGroup.add(sp);
    }
    host.add(fhGroup);
  }

  /** Build 20 overlapping forged-titanium iris petals (convergent-divergent AB nozzle). */
  private buildNozzleIris(
    parent: THREE.Group,
    innerR: number,
    lengthM: number,
    hingeZ: number,
    mat?: THREE.Material,
    ringName?: string,
  ): THREE.Group[] {
    const petalMat =
      mat ??
      new THREE.MeshStandardMaterial({
        color: 0x24282f,
        roughness: 0.46,
        metalness: 0.86,
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
    if (ringName) ring.name = ringName;
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
      const mat = this.upgradeToPhysical(
        new THREE.MeshPhysicalMaterial({
          color: sp.flapColor,
          roughness: 0.55,
          metalness: 0.38,
          clearcoat: 0.25,
        }),
      );
      this.patchHullSkinMaterial(mat);
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
      this.stampRestPose(pivot);

      const piston = new THREE.Mesh(rodGeo, pistonMat);
      piston.position.set(0, 0.01, sp.size.z * 0.14);
      mount.add(piston);

      rig.airbrakes.push({ mount, pivot, axis: sp.axis.clone().normalize(), maxRad: sp.maxRad, piston: { mesh: piston, baseLen } });
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
      const restPosAttr = geo.attributes.aRestPos;
      const restNorAttr = geo.attributes.aRestNormal;
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
          const p = new THREE.Vector3().fromBufferAttribute(pos, vi).applyMatrix4(m);
          const n = nor
            ? new THREE.Vector3().fromBufferAttribute(nor, vi).applyMatrix3(normalM).normalize()
            : new THREE.Vector3(0, 1, 0);
          tri.push({
            p,
            n,
            u: uv ? new THREE.Vector2(uv.getX(vi), uv.getY(vi)) : new THREE.Vector2(),
            rp: restPosAttr ? new THREE.Vector3().fromBufferAttribute(restPosAttr, vi) : p.clone(),
            rn: restNorAttr ? new THREE.Vector3().fromBufferAttribute(restNorAttr, vi).normalize() : n.clone(),
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
          const outRP: number[] = [];
          const outRN: number[] = [];
          for (const tri of captured) {
            for (let k = 0; k < 3; k++) {
              outP.push(tri[k].p.x - spec.pivot.x, tri[k].p.y - spec.pivot.y, tri[k].p.z - spec.pivot.z);
              outN.push(tri[k].n.x, tri[k].n.y, tri[k].n.z);
              outU.push(tri[k].u.x, tri[k].u.y);
              outRP.push(tri[k].rp.x, tri[k].rp.y, tri[k].rp.z);
              outRN.push(tri[k].rn.x, tri[k].rn.y, tri[k].rn.z);
            }
          }
          const partGeo = new THREE.BufferGeometry();
          partGeo.setAttribute('position', new THREE.Float32BufferAttribute(outP, 3));
          partGeo.setAttribute('normal', new THREE.Float32BufferAttribute(outN, 3));
          partGeo.setAttribute('uv', new THREE.Float32BufferAttribute(outU, 2));
          partGeo.setAttribute('aRestPos', new THREE.Float32BufferAttribute(outRP, 3));
          partGeo.setAttribute('aRestNormal', new THREE.Float32BufferAttribute(outRN, 3));
          if (!nor) partGeo.computeVertexNormals();
          const pm = new THREE.Mesh(partGeo, mesh.material);
          pm.castShadow = pm.receiveShadow = true;
          pm.frustumCulled = false;
          entry.group.add(pm);
          entry.triangleCount += captured.length;
          this.airframeDisposables.push(partGeo);
        }
      }
    }

    // Write back compacted remainder geometries once per touched source mesh
    for (const [mesh, st] of states) {
      if (!st.dirty) continue;
      const outP: number[] = [];
      const outN: number[] = [];
      const outU: number[] = [];
      const outRP: number[] = [];
      const outRN: number[] = [];
      const lp = new THREE.Vector3();
      const ln = new THREE.Vector3();
      for (const tri of st.tris) {
        for (let k = 0; k < 3; k++) {
          lp.copy(tri[k].p).applyMatrix4(st.invM);
          ln.copy(tri[k].n).applyMatrix3(st.invNormalM).normalize();
          outP.push(lp.x, lp.y, lp.z);
          outN.push(ln.x, ln.y, ln.z);
          outU.push(tri[k].u.x, tri[k].u.y);
          outRP.push(tri[k].rp.x, tri[k].rp.y, tri[k].rp.z);
          outRN.push(tri[k].rn.x, tri[k].rn.y, tri[k].rn.z);
        }
      }
      const nextGeo = new THREE.BufferGeometry();
      nextGeo.setAttribute('position', new THREE.Float32BufferAttribute(outP, 3));
      nextGeo.setAttribute('normal', new THREE.Float32BufferAttribute(outN, 3));
      nextGeo.setAttribute('uv', new THREE.Float32BufferAttribute(outU, 2));
      nextGeo.setAttribute('aRestPos', new THREE.Float32BufferAttribute(outRP, 3));
      nextGeo.setAttribute('aRestNormal', new THREE.Float32BufferAttribute(outRN, 3));
      mesh.geometry.dispose();
      mesh.geometry = nextGeo;
      this.airframeDisposables.push(nextGeo);
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

  /**
   * Build a single-draw-call live standby avionics & annunciator cluster (`dynamic_standby` material)
   * fitted flush into the upper glareshield & engine gauge bezels of both JAS 39 Gripen and Su-30MKK.
   *
   * Atlas layout (4x2 tiles, flipY = false -> v=0 top, v=1 bottom):
   *  - (0, 0): Speedometer (IAS knots / km/h + Mach + Vne barber pole)
   *  - (1, 0): Standby Artificial Horizon (ADI pitch/roll ball + slip ball)
   *  - (2, 0): Barometric / Radar Altimeter (dual needles + digital AGL/MSL)
   *  - (3, 0): VSI + G-Meter (climb/sink rate + live G & peak-G bug)
   *  - (0, 1): Engine N1 RPM % + AB Stage
   *  - (1, 1): Engine EGT °C + Fuel %
   *  - (2, 1): AoA Indexer (▼ ○ ▲) + Mach/AoA/FBW strip
   *  - (3, 1): Master Warning / Caution / GPWS / Gear / Airbrake Annunciator Matrix
   */
  private buildStandbyCluster(parent: THREE.Group, id: 'gripen' | 'su30'): void {
    const pos: number[] = [];
    const nor: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];

    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x101317,
      roughness: 0.86,
      metalness: 0.24,
      envMapIntensity: 0.28,
    });
    const faceMat = new THREE.MeshStandardMaterial({
      color: 0x050a08,
      roughness: 0.16,
      emissive: 0x06160e,
      emissiveIntensity: 1,
      envMapIntensity: 0.15,
    });
    faceMat.name = 'dynamic_standby';
    this.disposables.push(bezelMat, faceMat);

    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const n = new THREE.Vector3();
    const ctr = new THREE.Vector3();

    const addDial = (
      cx: number,
      cy: number,
      cz: number,
      radius: number,
      rx: number,
      ry: number,
      col: number,
      row: number,
      addBezelRing: boolean,
    ): void => {
      euler.set(rx, ry, 0, 'YXZ');
      q.setFromEuler(euler);
      n.set(0, 0, 1).applyQuaternion(q).normalize();
      ctr.set(cx, cy, cz);

      if (addBezelRing) {
        const ringGeo = new THREE.TorusGeometry(radius * 1.04, radius * 0.09, 8, 28);
        this.disposables.push(ringGeo);
        const ring = new THREE.Mesh(ringGeo, bezelMat);
        ring.position.copy(ctr).addScaledVector(n, 0.001);
        ring.quaternion.copy(q);
        ring.frustumCulled = false;
        parent.add(ring);
      }

      const segs = 28;
      const base = pos.length / 3;
      const uMid = (col + 0.5) * 0.25;
      const vMid = (row + 0.5) * 0.5;
      // Center vertex
      pos.push(ctr.x, ctr.y, ctr.z);
      nor.push(n.x, n.y, n.z);
      uv.push(uMid, vMid);

      for (let k = 0; k < segs; k++) {
        const a = (k / segs) * Math.PI * 2;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        p.set(ca * radius, sa * radius, 0).applyQuaternion(q).add(ctr);
        pos.push(p.x, p.y, p.z);
        nor.push(n.x, n.y, n.z);
        // flipY = false: +Y (up) maps to smaller v
        uv.push((col + 0.5 + 0.485 * ca) * 0.25, (row + 0.5 - 0.485 * sa) * 0.5);
      }
      for (let k = 0; k < segs; k++) {
        const next = (k + 1) % segs;
        idx.push(base, base + 1 + k, base + 1 + next);
      }
    };

    const addPod = (
      cx: number,
      cy: number,
      cz: number,
      w: number,
      h: number,
      rx: number,
      ry: number,
      col: number,
      row: number,
    ): void => {
      euler.set(rx, ry, 0, 'YXZ');
      q.setFromEuler(euler);
      n.set(0, 0, 1).applyQuaternion(q).normalize();
      ctr.set(cx, cy, cz);

      const bGeo = new THREE.BoxGeometry(w + 0.006, h + 0.006, 0.008);
      this.disposables.push(bGeo);
      const bezel = new THREE.Mesh(bGeo, bezelMat);
      bezel.quaternion.copy(q);
      bezel.position.copy(ctr).addScaledVector(n, -0.0045);
      bezel.frustumCulled = false;
      parent.add(bezel);

      const hw = w * 0.5;
      const hh = h * 0.5;
      const u0 = col * 0.25 + 0.004;
      const u1 = (col + 1) * 0.25 - 0.004;
      const vTop = row * 0.5 + 0.008;
      const vBot = (row + 1) * 0.5 - 0.008;
      const base = pos.length / 3;
      const corners: Array<[number, number, number, number]> = [
        [-hw, hh, u0, vTop],
        [hw, hh, u1, vTop],
        [-hw, -hh, u0, vBot],
        [hw, -hh, u1, vBot],
      ];
      for (const [lx, ly, cu, cv] of corners) {
        p.set(lx, ly, 0).applyQuaternion(q).add(ctr);
        pos.push(p.x, p.y, p.z);
        nor.push(n.x, n.y, n.z);
        uv.push(cu, cv);
      }
      idx.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
    };

    if (id === 'gripen') {
      // Exact jet-space positions measured from gripen.glb sw_gauge_* meshes (rx = -0.142 rad upper, -0.24 rad lower)
      addDial(-0.2125, 0.3027, -5.1745, 0.0298, -0.142, 0, 0, 0, false); // Speedometer (sw_gauge_speed_1400)
      addDial(-0.1438, 0.3027, -5.1725, 0.0285, -0.142, 0, 1, 0, false); // Artificial Horizon (sw_gauge_aviahorizon)
      addDial(0.1453, 0.3027, -5.1745, 0.0298, -0.142, 0, 3, 0, false); // VSI + G-Meter (sw_gauge_gyrocompass)
      addDial(0.2125, 0.3027, -5.1735, 0.0298, -0.142, 0, 2, 0, false); // Baro / Radar Altimeter (sw_gauge_altimeter)
      addDial(0.3025, 0.0562, -5.1165, 0.0195, -0.24, 0, 0, 1, false); // Engine N1 RPM (sw_gauge_rpm)
      addDial(0.3534, 0.0562, -5.1165, 0.0195, -0.24, 0, 1, 1, false); // Engine EGT / Fuel (sw_gauge_exhaust_temp)
      // Left & right glareshield corner pods: AoA Indexer + Master Caution / GPWS Annunciator Matrix
      addPod(-0.272, 0.301, -5.171, 0.036, 0.054, -0.142, 0.06, 2, 1);
      addPod(0.272, 0.301, -5.171, 0.036, 0.054, -0.142, -0.06, 3, 1);
    } else {
      // Su-30MKK upper glareshield standby cluster aligned above buildSu30MfdCluster
      addDial(-0.252, 0.892, -8.444, 0.031, -0.18, 0.1, 0, 0, true); // Speedometer
      addDial(-0.178, 0.892, -8.436, 0.031, -0.18, 0.08, 1, 0, true); // Artificial Horizon
      addDial(0.178, 0.892, -8.436, 0.031, -0.18, -0.08, 3, 0, true); // VSI + G-Meter
      addDial(0.252, 0.892, -8.444, 0.031, -0.18, -0.1, 2, 0, true); // Baro / Radar Altimeter
      addDial(0.326, 0.805, -8.442, 0.024, -0.18, -0.12, 0, 1, true); // Engine N1 RPM
      addDial(0.326, 0.742, -8.430, 0.024, -0.18, -0.12, 1, 1, true); // Engine EGT / Fuel
      // AoA Indexer & Master Caution / Warning Annunciator Matrix flanking HUD combiner
      addPod(-0.118, 0.962, -8.352, 0.038, 0.060, -0.14, 0.08, 2, 1);
      addPod(0.118, 0.962, -8.352, 0.044, 0.060, -0.14, -0.08, 3, 1);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    this.disposables.push(geo);

    const mesh = new THREE.Mesh(geo, faceMat);
    mesh.name = id === 'gripen' ? 'GripenStandbyCluster' : 'Su30StandbyCluster';
    mesh.frustumCulled = false;
    mesh.renderOrder = 3;
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
      const kestrelIris = anchor.getObjectByName(`kestrel_iris_${i}`);
      if (kestrelIris) kestrelIris.visible = false;
      const kestrelTurb = anchor.getObjectByName(`kestrel_turbine_${i}`);
      if (kestrelTurb) kestrelTurb.visible = false;
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
        // Seat inner combustion glow disc cleanly BEHIND the spinning 18-blade turbine rotor so
        // metallic blades and dark titanium liner read with crisp depth during dry cruise!
        f.position.set(0, 0, Math.max(0.02, dz - anchors.nozzleRadiusM * 1.18));
        f.scale.setScalar((anchors.nozzleRadiusM * 0.76) / 0.42);
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
        const fB = new THREE.Vector3(s * 2.03, -0.15, 1.88);
        const flapId = `flap_${side}`;
        specs.push({
          id: flapId,
          pivot: fA.clone().lerp(fB, 0.5),
          planes: [
            makeClipPlaneFromPoints(fA, fB, up, new THREE.Vector3(s * 1.4, -0.15, 2.45)),
            makeAxisPlane('x', s > 0 ? 0.85 : -2.03, true),
            makeAxisPlane('x', s > 0 ? 2.03 : -0.85, false),
            makeAxisPlane('y', -0.37, true),
            makeAxisPlane('y', 0.08, false),
          ],
          materialPrefixes: gMat,
          bounds: new THREE.Box3(
            new THREE.Vector3(s > 0 ? 0.82 : -2.07, -0.4, 1.7),
            new THREE.Vector3(s > 0 ? 2.07 : -0.82, 0.12, 2.68),
          ),
          addHingeSpar: { start: fA, end: fB, radius: 0.018 },
        });
        const fAxis = new THREE.Vector3().subVectors(side === 1 ? fB : fA, side === 1 ? fA : fB).normalize();
        axisBind.set(flapId, { role: 'flap', side, axis: fAxis, sign: 1 });

        const aA = new THREE.Vector3(s * 2.03, -0.16, 1.88);
        const aB = new THREE.Vector3(s * 3.48, -0.18, 2.02);
        const ailId = `aileron_${side}`;
        specs.push({
          id: ailId,
          pivot: aA.clone().lerp(aB, 0.5),
          planes: [
            makeClipPlaneFromPoints(aA, aB, up, new THREE.Vector3(s * 2.75, -0.17, 2.55)),
            makeAxisPlane('x', s > 0 ? 2.03 : -3.48, true),
            makeAxisPlane('x', s > 0 ? 3.48 : -2.03, false),
            makeAxisPlane('y', -0.38, true),
            makeAxisPlane('y', 0.06, false),
          ],
          materialPrefixes: gMat,
          bounds: new THREE.Box3(
            new THREE.Vector3(s > 0 ? 2.0 : -3.52, -0.42, 1.75),
            new THREE.Vector3(s > 0 ? 3.52 : -2.0, 0.1, 2.68),
          ),
          addHingeSpar: { start: aA, end: aB, radius: 0.016 },
        });
        const aAxis = new THREE.Vector3().subVectors(side === 1 ? aB : aA, side === 1 ? aA : aB).normalize();
        axisBind.set(ailId, { role: 'aileron', side, axis: aAxis, sign: 1 });

        pass2Specs.push({
          id: `flex_${side}`,
          pivot: new THREE.Vector3(s * 2.03, -0.16, 1.3),
          planes: [makeAxisPlane('x', s * 2.03, s > 0)],
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

        // Su-30MKK twin vertical fin rudders (measured directly from su30mkk.glb):
        // Fin chord runs z = [2.60..4.53] at y=1.30 to z = [3.89..5.50] at y=3.12 (x = ±2.15).
        // Hinge sits cleanly INSIDE the fin at 74% chord (zero protruding hinge rod in empty sky!).
        const rA = new THREE.Vector3(s * 2.15, 1.30, 4.08);
        const rB = new THREE.Vector3(s * 2.15, 3.12, 5.06);
        const rudId = `rudder_${side}`;
        specs.push({
          id: rudId,
          pivot: rA.clone().lerp(rB, 0.5),
          planes: [
            makeClipPlaneFromPoints(rA, rB, new THREE.Vector3(1, 0, 0), new THREE.Vector3(s * 2.15, 2.2, 5.6)),
            makeAxisPlane('x', s * 2.15 - 0.18, true),
            makeAxisPlane('x', s * 2.15 + 0.18, false),
            makeAxisPlane('y', 1.30, true),
            makeAxisPlane('y', 3.12, false),
          ],
          materialPrefixes: ['0c5b', 'a04b'],
          bounds: new THREE.Box3(
            new THREE.Vector3(s * 2.15 - 0.24, 1.25, 3.95),
            new THREE.Vector3(s * 2.15 + 0.24, 3.18, 5.75),
          ),
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
      // Inset Gripen's inner convergent-divergent iris petals cleanly INSIDE the GLB outer nozzle shroud
      // so zero boxy petals ever poke outside the tailcone lip!
      const irisRadius = id === 'gripen' ? anchors.nozzleRadiusM * 0.78 : anchors.nozzleRadiusM * 0.89;
      const irisLen = id === 'gripen' ? anchors.nozzleRadiusM * 0.66 : anchors.nozzleRadiusM * 0.90;
      const irisHingeZ = Math.max(0.06, dz - anchors.nozzleRadiusM * (id === 'gripen' ? 0.50 : 0.58));
      rig.irisPetals[i] = this.buildNozzleIris(this.tvcAnchors[i], irisRadius, irisLen, irisHingeZ);
      this.buildTurbineCore(
        rig,
        this.tvcAnchors[i],
        anchors.nozzleRadiusM * (id === 'gripen' ? 0.75 : 0.84),
        Math.max(0.04, dz - anchors.nozzleRadiusM * 0.88),
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
      this.buildStandbyCluster(this.loadedExtras, 'gripen');
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
        this.buildStandbyCluster(this.loadedExtras, 'su30');
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

    // Airbrake panels & telescoping hydraulic actuators (hide flush on GLB airframes when stowed)
    for (const ab of rig.airbrakes) {
      if (rig !== this.kestrelRig) ab.mount.visible = sm.airbrake > 0.015;
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
      if (lg.isNose) lg.piston.rotation.y = -sm.rudderRad * 0.45 * strutOut;
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
      const kestrelIris = anchor.getObjectByName(`kestrel_iris_${i}`);
      if (kestrelIris) kestrelIris.visible = true;
      const kestrelTurb = anchor.getObjectByName(`kestrel_turbine_${i}`);
      if (kestrelTurb) kestrelTurb.visible = true;
      this.plumes[i]?.position.set(0, 0, 1.05);
      if (this.plumes[i]) this.plumes[i].visible = true;
      this.nozzleFaces[i]?.position.set(0, 0, 0.14);
      if (this.nozzleFaces[i]) this.nozzleFaces[i].visible = true;
    });
    this.baseWingtips[0].set(-5.45, -0.02, 4.4);
    this.baseWingtips[1].set(5.45, -0.02, 4.4);
    this.skinU.uAirframeType.value = 2;
    this.repositionSkinFX();
    this.syncSkinFXPalette();
  }

  /** Build floating 3D Holo-Aura wing/spine crests & 160-starburst thermal spark field. */
  private setupSkinFX(): void {
    if (this.holoAuraGroup || this.emberPoints) return;

    const HOLO_VERT = /* glsl */ `
      varying vec2 vUv;
      varying vec3 vLocalPos;
      void main() {
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vLocalPos = wp.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const HOLO_FRAG = /* glsl */ `
      uniform float uTime;
      uniform float uAB;
      uniform float uGLoad;
      uniform float uPulseAge;
      uniform float uScale;
      uniform vec3 uAccent;
      uniform vec3 uCore;
      uniform vec3 uWorldTint;
      varying vec2 vUv;
      varying vec3 vLocalPos;

      float ringBand(float r, float radius, float width) {
        return exp(-pow((r - radius) / width, 2.0));
      }

      void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float r = length(p);
        if (r > 1.0) discard;

        float gNorm = clamp((uGLoad - 1.0) / 8.0, 0.0, 1.0);
        float spin = uTime * (0.55 + uAB * 1.45 + gNorm * 1.25);
        float theta = atan(p.y, p.x);

        // Two depth-parallax offset layers for crisp hologram stereo separation
        vec2 pTop = p + vec2(sin(uTime * 0.9) * 0.014, cos(uTime * 0.7) * 0.014);
        float rTop = length(pTop);
        float thTop = atan(pTop.y, pTop.x);

        // Outer precision 24-tick aerospace telemetry dial
        float outerArc = ringBand(r, 0.86, 0.015);
        float ticks24 = smoothstep(0.55, 0.92, cos(theta * 24.0 + spin * 1.4));
        float outerDash = smoothstep(0.15, 0.55, sin(theta * 3.0 - spin * 1.1));

        // Counter-rotating dual middle reticle rings
        float midRingA = ringBand(rTop, 0.66, 0.014) * (0.45 + 0.55 * smoothstep(-0.1, 0.35, cos(thTop * 4.0 + spin * 1.8)));
        float midRingB = ringBand(r, 0.50, 0.012) * (0.45 + 0.55 * smoothstep(-0.2, 0.25, sin(theta * 6.0 - spin * 2.2)));

        // Rotating sweeping radar sector beam
        float sweepDiff = fract((theta - spin * 2.4) / 6.2831853);
        float sweepBeam = smoothstep(0.78, 1.0, sweepDiff) * smoothstep(0.18, 0.86, r) * (1.0 - smoothstep(0.84, 0.94, r));

        // Inner triangular chevron crest
        float tri = max(max(pTop.y * -0.95, abs(pTop.x) * 0.86 - pTop.y * 0.45), 0.0);
        float crest = smoothstep(0.27, 0.255, tri) * smoothstep(0.15, 0.175, tri);
        float centerCore = exp(-r * r * 24.0);

        float pulseFlash = exp(-uPulseAge * 1.6) * step(uPulseAge, 3.0);
        float ringWave = ringBand(r, fract(uTime * 0.32 + uPulseAge * 0.85) * 0.95, 0.032) * (0.30 + 0.70 * pulseFlash);

        float alpha = outerArc * (0.45 + 0.55 * max(ticks24, outerDash))
                    + midRingA * 0.90
                    + midRingB * 0.80
                    + sweepBeam * 0.24
                    + crest * 0.78
                    + centerCore * 0.22
                    + ringWave * 0.55;

        alpha *= (0.58 + 0.42 * uAB + 0.32 * gNorm + 0.48 * pulseFlash) * uScale;
        alpha = clamp(alpha, 0.0, 0.95);
        if (alpha < 0.008) discard;

        vec3 tint = mix(uAccent, uWorldTint, 0.22);
        vec3 col = mix(tint * 1.5, uCore * 2.6, clamp(crest * 0.6 + centerCore * 0.8 + outerArc * ticks24 * 0.4 + pulseFlash * 0.5, 0.0, 1.0));
        gl_FragColor = vec4(col * alpha, alpha);
      }
    `;

    this.holoAuraMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAB: { value: 0 },
        uGLoad: { value: 1 },
        uPulseAge: { value: 99 },
        uScale: { value: 1 },
        uAccent: { value: new THREE.Color(0xff6218) },
        uCore: { value: new THREE.Color(0xffcf54) },
        uWorldTint: { value: new THREE.Color(0x62b6ff) },
      },
      vertexShader: HOLO_VERT,
      fragmentShader: HOLO_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    this.disposables.push(this.holoAuraMat);

    const quadGeo = new THREE.PlaneGeometry(1, 1);
    quadGeo.rotateX(-Math.PI / 2);
    this.disposables.push(quadGeo);

    const group = new THREE.Group();
    group.name = 'jet_holo_aura';
    group.userData.noAO = true;
    for (let i = 0; i < 3; i++) {
      const m = new THREE.Mesh(quadGeo, this.holoAuraMat);
      m.renderOrder = 6;
      m.frustumCulled = false;
      m.userData.noAO = true;
      group.add(m);
      this.holoAuraQuads.push(m);
    }
    this.holoAuraGroup = group;
    this.root.add(group);

    // 160 GPU 4-Point HDR Diamond Starburst & Flowing Ember Particle System (active in Hangar + Flight!)
    const SPARK_COUNT = 160;
    const pos = new Float32Array(SPARK_COUNT * 3);
    const vel = new Float32Array(SPARK_COUNT * 3);
    const age = new Float32Array(SPARK_COUNT);
    const life = new Float32Array(SPARK_COUNT);
    const seed = new Float32Array(SPARK_COUNT);
    const size = new Float32Array(SPARK_COUNT);
    this.emberState = { pos, vel, age, life, seed, size, rng: 42197 };

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aAgeNorm', new THREE.BufferAttribute(age, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    this.disposables.push(g);

    const EMBER_VERT = /* glsl */ `
      attribute float aAgeNorm;
      attribute float aSeed;
      attribute float aSize;
      uniform float uPixelRatio;
      uniform float uAB;
      uniform float uGLoad;
      varying float vAge;
      varying float vSeed;
      void main() {
        vAge = aAgeNorm;
        vSeed = aSeed;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        float dist = max(0.35, -mv.z);
        float swell = 1.0 + uAB * 0.45 + clamp((uGLoad - 1.0) / 8.0, 0.0, 1.0) * 0.35;
        float lifeCurve = sin(clamp(aAgeNorm, 0.0, 1.0) * 3.14159265);
        gl_PointSize = clamp((aSize * swell * lifeCurve * 155.0 * uPixelRatio) / dist, 1.0, 16.0);
      }
    `;
    const EMBER_FRAG = /* glsl */ `
      uniform float uTime;
      uniform float uAB;
      uniform vec3 uAccent;
      uniform vec3 uCore;
      varying float vAge;
      varying float vSeed;
      void main() {
        vec2 p = gl_PointCoord * 2.0 - 1.0;
        float r = length(p);
        if (r > 1.0) discard;

        // Ultra-crisp pinpoint HDR micro-spark + hairline 4-point glint
        float ax = abs(p.x);
        float ay = abs(p.y);
        float starCross = exp(-ax * 14.0) * exp(-ay * 2.0) + exp(-ay * 14.0) * exp(-ax * 2.0);
        float coreBokeh = exp(-r * r * 14.0);
        float twinkle = 0.55 + 0.45 * sin(uTime * (5.0 + vSeed * 8.0) + vSeed * 43.0);

        float mask = (coreBokeh * 0.85 + starCross * 0.52) * twinkle * sin(clamp(vAge, 0.0, 1.0) * 3.14159265);
        if (mask < 0.015) discard;

        vec3 tint = mix(uAccent, uCore, clamp(coreBokeh * 0.85 + uAB * 0.25, 0.0, 1.0));
        float hdr = 1.85 + uAB * 2.0;
        gl_FragColor = vec4(tint * hdr * mask, clamp(mask, 0.0, 1.0));
      }
    `;

    this.emberMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAB: { value: 0 },
        uGLoad: { value: 1 },
        uPixelRatio: { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1 },
        uAccent: { value: new THREE.Color(0xff6218) },
        uCore: { value: new THREE.Color(0xffcf54) },
      },
      vertexShader: EMBER_VERT,
      fragmentShader: EMBER_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.disposables.push(this.emberMat);

    const pts = new THREE.Points(g, this.emberMat);
    pts.name = 'jet_skin_embers';
    pts.frustumCulled = false;
    pts.renderOrder = 7;
    pts.userData.noAO = true;
    this.emberPoints = pts;
    this.root.add(pts);

    for (let i = 0; i < SPARK_COUNT; i++) {
      this.respawnEmber(i, true);
    }
    this.syncSkinFXPalette();
  }

  private nextEmberRand(): number {
    if (!this.emberState) return 0.5;
    this.emberState.rng = (this.emberState.rng * 16807) % 2147483647;
    return this.emberState.rng / 2147483647;
  }

  private respawnEmber(idx: number, staggerAge = false): void {
    const es = this.emberState;
    if (!es) return;
    const isGripen = this.airframeId === 'gripen';
    const isKestrel = this.airframeId === 'kestrel';
    const r1 = this.nextEmberRand();
    const r2 = this.nextEmberRand();
    const r3 = this.nextEmberRand();
    const r4 = this.nextEmberRand();
    const side = idx % 2 === 0 ? -1 : 1;

    let x = 0;
    let y = 0;
    let z = 0;
    if (isGripen) {
      if (r1 < 0.62) {
        const t = r2;
        x = side * (0.95 + t * 3.05);
        y = 0.05 + (r3 - 0.5) * 0.25;
        z = -1.2 + t * 3.6 + (r4 - 0.5) * 0.8;
      } else {
        x = side * (0.04 + r2 * 0.22);
        y = 0.55 + r3 * 1.85;
        z = 1.6 + r4 * 2.4;
      }
    } else if (isKestrel) {
      x = side * (1.2 + r2 * 4.1);
      y = 0.1 + r3 * 1.1;
      z = -0.6 + r4 * 5.2;
    } else {
      // Su-30MKI: wing flame contours + LERX shoulder flames + twin tails + engine nozzles
      if (r1 < 0.55) {
        const t = r2;
        x = side * (1.9 + t * 5.2);
        y = 0.14 + (r3 - 0.5) * 0.35;
        z = -0.3 + t * 2.5 + (r4 - 0.5) * 1.1;
      } else if (r1 < 0.82) {
        // Twin canted tails & dorsal spine
        x = side * (1.95 + (r2 - 0.5) * 0.35);
        y = 0.95 + r3 * 2.55;
        z = 2.4 + r3 * 2.9 + (r4 - 0.5) * 0.5;
      } else {
        // Side LERX & aft engine nacelle cowls
        x = side * (0.65 + r2 * 1.15);
        y = 0.35 + (r3 - 0.5) * 0.55;
        z = -1.8 + r4 * 5.2;
      }
    }

    const o = idx * 3;
    es.pos[o] = x;
    es.pos[o + 1] = y;
    es.pos[o + 2] = z;
    es.vel[o] = side * (0.15 + r2 * 0.45);
    es.vel[o + 1] = 0.32 + r3 * 0.72;
    es.vel[o + 2] = 0.65 + r4 * 1.65;
    es.life[idx] = 0.85 + r4 * 1.35;
    es.age[idx] = staggerAge ? this.nextEmberRand() : 0;
    es.seed[idx] = r2;
    es.size[idx] = 0.22 + r3 * 0.32;
  }

  private repositionSkinFX(): void {
    const q = this.holoAuraQuads;
    if (q.length < 3) return;
    if (this.airframeId === 'gripen') {
      // Crisp gyro-halos around wingtip launchers & over aft delta spine (clear of roundels)
      q[0].position.set(-4.05, 0.06, 2.55);
      q[0].scale.setScalar(1.95);
      q[0].rotation.set(0, 0, 0.06);
      q[1].position.set(4.05, 0.06, 2.55);
      q[1].scale.setScalar(1.95);
      q[1].rotation.set(0, 0, -0.06);
      q[2].position.set(0, 1.15, 0.85);
      q[2].scale.setScalar(2.15);
      q[2].rotation.set(0, 0, 0);
    } else if (this.airframeId === 'kestrel') {
      q[0].position.set(-5.35, 0.14, 3.8);
      q[0].scale.setScalar(2.2);
      q[1].position.set(5.35, 0.14, 3.8);
      q[1].scale.setScalar(2.2);
      q[2].position.set(0, 1.35, 1.2);
      q[2].scale.setScalar(2.35);
    } else {
      // Su-30MKI wingtip tactical gyro-halos + twin-tail crown crest (clear of wing roundels!)
      q[0].position.set(-7.15, 0.16, 2.55);
      q[0].scale.setScalar(2.45);
      q[0].rotation.set(0, 0, 0.05);
      q[1].position.set(7.15, 0.16, 2.55);
      q[1].scale.setScalar(2.45);
      q[1].rotation.set(0, 0, -0.05);
      q[2].position.set(0, 2.05, 2.75);
      q[2].scale.setScalar(3.15);
      q[2].rotation.set(0, 0, 0);
    }
    if (this.emberState) {
      for (let i = 0; i < this.emberState.age.length; i++) {
        this.respawnEmber(i, true);
      }
    }
  }

  private syncSkinFXPalette(): void {
    const spec = JET_SKIN_BY_ID[this.skinId] ?? JET_SKIN_BY_ID.flame_phantom;
    const isCustom = this.skinId !== 'stock' && !this.insideOn;
    if (this.holoAuraMat) {
      this.holoAuraMat.uniforms.uAccent.value.setHex(spec.accentHex);
      this.holoAuraMat.uniforms.uCore.value.setHex(spec.coreHex);
    }
    if (this.emberMat) {
      this.emberMat.uniforms.uAccent.value.setHex(spec.accentHex);
      this.emberMat.uniforms.uCore.value.setHex(spec.coreHex);
    }
    if (this.holoAuraGroup) {
      this.holoAuraGroup.visible = isCustom && this.holoAuraEnabled;
    }
    if (this.emberPoints) {
      this.emberPoints.visible = isCustom;
    }
  }

  private updateSkinFX(dt: number, timeSec: number, abBoost: number, gLoad: number, speedNorm: number): void {
    const isCustom = this.skinId !== 'stock' && !this.insideOn;
    if (this.holoAuraGroup) {
      this.holoAuraGroup.visible = isCustom && this.holoAuraEnabled;
    }
    if (this.emberPoints) {
      this.emberPoints.visible = isCustom;
    }
    if (!isCustom) return;

    if (this.holoAuraMat) {
      const hu = this.holoAuraMat.uniforms;
      hu.uTime.value = timeSec;
      hu.uAB.value = abBoost;
      hu.uGLoad.value = gLoad;
      hu.uPulseAge.value = this.skinU.uSkinPulseAge.value;
      hu.uWorldTint.value.copy(this.skinU.uWorldTint.value);
    }
    for (let i = 0; i < this.holoAuraQuads.length; i++) {
      const bob = Math.sin(timeSec * 1.85 + i * 1.7) * 0.045;
      const baseY = this.airframeId === 'gripen' ? (i === 2 ? 1.15 : 0.06) : this.airframeId === 'kestrel' ? (i === 2 ? 1.35 : 0.14) : (i === 2 ? 2.05 : 0.16);
      this.holoAuraQuads[i].position.y = baseY + bob;
    }

    const es = this.emberState;
    if (es && this.emberPoints && this.emberMat) {
      const eu = this.emberMat.uniforms;
      eu.uTime.value = timeSec;
      eu.uAB.value = abBoost;
      eu.uGLoad.value = gLoad;

      const gNorm = Math.max(0, (gLoad - 1) / 8);
      const speedMul = 1 + abBoost * 3.8 + speedNorm * 2.6 + gNorm * 1.8;
      const riseDamp = Math.max(0.25, 1 - speedNorm * 0.45);
      const n = es.age.length;
      for (let i = 0; i < n; i++) {
        const lifeS = Math.max(0.25, es.life[i] / (1 + abBoost * 0.65));
        es.age[i] += dt / lifeS;
        if (es.age[i] >= 1) {
          this.respawnEmber(i, false);
          continue;
        }
        const o = i * 3;
        const swirl = Math.sin(timeSec * 4.2 + es.seed[i] * 25.0) * (0.45 + abBoost * 0.85);
        es.pos[o] += (es.vel[o] + swirl) * dt;
        es.pos[o + 1] += es.vel[o + 1] * riseDamp * dt;
        es.pos[o + 2] += es.vel[o + 2] * speedMul * dt;
      }
      const geo = this.emberPoints.geometry;
      geo.attributes.position.needsUpdate = true;
      geo.attributes.aAgeNorm.needsUpdate = true;
    }
  }

  /** Diagnostic rig summary for flight-qualification verification & browser QA. */
  public getRigSummary(): {
    airframeId: JetAirframeId;
    turbineRotors: number;
    turbineAngleRad: number;
    irisPetalCount: number;
    canards: number;
    flaps: number;
    ailerons: number;
    slats: number;
    stabs: number;
    rudders: number;
    airbrakes: number;
  } {
    const r = this.rig;
    return {
      airframeId: this.airframeId,
      turbineRotors: r.turbineRotors.length,
      turbineAngleRad: r.turbineAngleRad,
      irisPetalCount: r.irisPetals[0].length + r.irisPetals[1].length,
      canards: r.canards.filter(Boolean).length,
      flaps: r.flaps.filter(Boolean).length,
      ailerons: r.ailerons.filter(Boolean).length,
      slats: r.slats.filter(Boolean).length,
      stabs: r.stabs.filter(Boolean).length,
      rudders: r.rudders.length,
      airbrakes: r.airbrakes.length,
    };
  }

  /** Engines, exhaust, lights, and articulated surfaces/gear/vapor for this frame. */
  public update(timeSec: number, throttle: number, boost: number, vacuum: number, visual?: JetVisualState): void {
    const abBoost = visual?.abStage !== undefined ? Math.max(boost, visual.boost ?? 0, visual.abStage / 3) : Math.max(boost, visual?.boost ?? 0);
    const dt = THREE.MathUtils.clamp(visual?.dt ?? 1 / 60, 0, 0.1);
    // Drive reactive 3D skin uniforms smoothly without recompilation
    const su = this.skinU;
    su.uSkinTime.value = timeSec;
    su.uSkinLightSweep.value = (su.uSkinLightSweep.value + dt * (0.28 + abBoost * 0.55)) % 1000;
    if (su.uSkinPulseAge.value < 50) {
      su.uSkinPulseAge.value += dt;
    }
    if (visual?.worldTintHex !== undefined) {
      su.uWorldTint.value.setHex(visual.worldTintHex);
    }
    const airspeedNorm = THREE.MathUtils.clamp((visual?.airspeedMps ?? 0) / 450, 0, 2.5);
    const kSmooth = dt > 0 ? 1 - Math.exp(-10 * dt) : 1;
    su.uSkinAirspeed.value += (airspeedNorm - su.uSkinAirspeed.value) * kSmooth;
    su.uSkinMach.value += ((visual?.mach ?? 0) - su.uSkinMach.value) * kSmooth;
    su.uSkinGLoad.value += ((visual?.gLoad ?? 1) - su.uSkinGLoad.value) * kSmooth;
    su.uSkinAB.value += (THREE.MathUtils.clamp(abBoost, 0, 1) - su.uSkinAB.value) * kSmooth;
    su.uSkinDarkness.value += (THREE.MathUtils.clamp(visual?.ambientDarkness ?? 0, 0, 1) - su.uSkinDarkness.value) * kSmooth;
    su.uSkinJerk.value += (THREE.MathUtils.clamp(visual?.maneuverJerk ?? 0, 0, 2) - su.uSkinJerk.value) * kSmooth;
    this.updateSkinFX(dt, timeSec, su.uSkinAB.value, su.uSkinGLoad.value, su.uSkinAirspeed.value);

    const u = this.plumeMat.uniforms;
    u.uThrottle.value = throttle;
    u.uBoost.value = abBoost;
    u.uVacuum.value = vacuum;
    u.uTime.value = timeSec;
    // Subtle translucent blue heat shimmer in dry cruise expanding into a vivid 7-10 m Mach-diamond
    // flame jet under Afterburner Zones 1..3
    const dryVis = THREE.MathUtils.smoothstep(throttle, 0.08, 1.0);
    const len = 0.85 + dryVis * 1.75 + abBoost * 6.8 + vacuum * 2.5;
    // Under-expanded in vacuum: a little wider, never a balloon
    const widen = 1 + vacuum * 0.45 * (0.3 + throttle);
    const r = widen * (0.82 + 0.16 * dryVis + abBoost * 0.34) * this.plumeScale;
    for (const p of this.plumes) p.scale.set(r, r, (len / 9) * Math.sqrt(this.plumeScale));
    // Natural recessed turbine glow deep behind spinning LP blades: dark metallic contrast at dry cruise
    // (18 spinning titanium blades read sharply!), exploding into incandescent gold-amber under AB1..3!
    this.nozzleGlowMat.opacity = 0.015 + 0.045 * dryVis + 0.76 * abBoost;
    this.nozzleGlowMat.color.setRGB(1.0, 0.44 + 0.42 * abBoost, 0.12 + 0.40 * abBoost);

    // Spin LP turbine rotors & illuminate radial afterburner flameholder rings proportional to power
    const omegaRadS = 9.0 + throttle * 34.0 + abBoost * 26.0;
    this.rig.turbineAngleRad = (this.rig.turbineAngleRad + omegaRadS * dt) % (Math.PI * 200);
    for (let i = 0; i < this.rig.turbineRotors.length; i++) {
      // Twin-engine jets counter-rotate slightly for balanced visual sheen
      const dir = i % 2 === 0 ? 1 : -1;
      this.rig.turbineRotors[i].rotation.z = this.rig.turbineAngleRad * dir;
    }
    const fhEmissive = 0.02 + 0.08 * dryVis + 3.0 * abBoost;
    for (const fm of this.rig.flameholderMats) {
      fm.emissiveIntensity = fhEmissive;
      fm.emissive.setRGB(1.0, 0.32 + 0.50 * abBoost, 0.05 + 0.42 * abBoost);
    }

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
    this.applyCanopyMaterialProps();
  }

  public dispose(): void {
    this.clearLoadedAirframe();
    this.loadedExtras.clear();
    this.kestrelExtras.clear();
    for (const d of this.disposables) d.dispose();
    this.disposables = [];
  }
}
