import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { SOLAR_SYSTEM_BODIES } from '../astronomy/SolarSystemData';
import { KeplerSolver } from '../astronomy/KeplerSolver';
import { applyBitmap, canUseBitmaps, decodeBitmap } from '../rendering/FastTextureLoader';
import './fly.css';

/**
 * The fly page's opening: Solaris's own Solar System, as it is this minute, then Earth, then the
 * place you take off from, rendered live while the world loads (the loading drives the camera).
 *
 *  1. The system from above: the Sun and the eight planets at their true positions today (Solaris's
 *     ephemeris, J2000 elements), with their own maps and their orbits; distances compressed on a
 *     log scale so all of it fits in one look, each named with its true distance from the Sun.
 *  2. The fall from there to Earth, the planets swinging past.
 *  3. Earth itself: Solaris's 8K day map, its night lights and clouds, turned as it truly is now
 *     (the axis's tilt, the Sun overhead where it is noon), approached from the night side round
 *     the limb into the sunrise, ending in orbit over the city, a beacon on it whose ring fills as
 *     the city's 3D tiles arrive.
 * Underneath, the stream log: what is really loading as it loads.
 * Nothing is revealed until all of it has; ENGAGE (the click fullscreen and sound need) dives
 * down through the air and the cloud tops into the live flight.
 */

export interface PreflightItem {
  label: string;
  detail: string;
  done: boolean;
}

const B = import.meta.env.BASE_URL;
const DEG = Math.PI / 180;
const J2000_JD = 2451545.0;
const OBLIQ = 23.4393 * DEG;

/** Direction for a latitude and longitude on Earth, in the frame of three.js's sphere UVs. */
function dirFor(lat: number, lon: number, out = new THREE.Vector3()): THREE.Vector3 {
  const phi = ((lon + 180) / 360) * Math.PI * 2;
  const c = Math.cos(lat * DEG);
  return out.set(-Math.cos(phi) * c, Math.sin(lat * DEG), Math.sin(phi) * c);
}

/** Where the Sun is overhead now. */
function subsolar(now: Date): { lat: number; lon: number } {
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const doy = (now.getTime() - start) / 86400000;
  const lat = 23.44 * Math.sin((2 * Math.PI * (doy - 81)) / 365);
  const lon = (12 - (now.getUTCHours() + now.getUTCMinutes() / 60)) * 15;
  return { lat, lon: ((lon + 540) % 360) - 180 };
}

/** Ecliptic (J2000) to the film's axes: the ecliptic is the XZ plane, its north is +Y. */
const ecl = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, z, -y);
/** Film distance from the Sun for a true distance in AU (log-compressed, Earth at 26). */
const filmR = (au: number): number => 26 * Math.log10(1 + au * 9);

const PLANETS: Array<{ name: string; tex: string; size: number }> = [
  { name: 'Mercury', tex: '2k_mercury.jpg', size: 0.45 },
  { name: 'Venus', tex: '2k_venus_atmosphere.jpg', size: 0.9 },
  { name: 'Mars', tex: '2k_mars.jpg', size: 0.62 },
  { name: 'Jupiter', tex: '2k_jupiter.jpg', size: 2.3 },
  { name: 'Saturn', tex: '2k_saturn.jpg', size: 1.95 },
  { name: 'Uranus', tex: '2k_uranus.jpg', size: 1.25 },
  { name: 'Neptune', tex: '2k_neptune.jpg', size: 1.2 },
];

const earthVert = /* glsl */ `
varying vec3 vN; varying vec3 vP; varying vec2 vUv;
void main() {
  vUv = uv;
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vP = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const earthFrag = /* glsl */ `
uniform sampler2D tDay; uniform sampler2D tNight; uniform sampler2D tClouds;
uniform vec3 uSun; uniform float uCloudShift;
varying vec3 vN; varying vec3 vP; varying vec2 vUv;
void main() {
  vec3 n = normalize(vN);
  vec3 V = normalize(cameraPosition - vP);
  float l = dot(n, uSun);
  float dayK = smoothstep(-0.12, 0.22, l);
  vec3 day = texture2D(tDay, vUv).rgb;
  vec3 night = texture2D(tNight, vUv).rgb;
  float cl = texture2D(tClouds, vUv + vec2(uCloudShift, 0.0)).r;
  float clShadow = texture2D(tClouds, vUv + vec2(uCloudShift - 0.0015, 0.001)).r;
  float ocean = smoothstep(0.22, 0.06, day.r) * smoothstep(0.04, 0.16, day.b - day.r * 0.5);
  vec3 col = day * (1.0 - clShadow * 0.35) * max(l, 0.0) * 1.55;
  vec3 H = normalize(uSun + V);
  col += vec3(1.0, 0.9, 0.75) * pow(max(dot(n, H), 0.0), 70.0) * ocean * 1.6 * dayK;
  col = mix(col, vec3(1.02, 1.02, 1.0) * max(l + 0.05, 0.0) * 1.35, cl * 0.9);
  float lights = dot(night, vec3(0.4, 0.4, 0.2));
  col += vec3(1.0, 0.68, 0.36) * pow(lights, 1.4) * 2.6 * (1.0 - dayK) * (1.0 - cl * 0.75);
  col += vec3(1.0, 0.42, 0.12) * exp(-(((l - 0.02) / 0.04) * ((l - 0.02) / 0.04))) * 0.08 * (1.0 - cl * 0.6);
  float fres = pow(1.0 - max(dot(n, V), 0.0), 2.6);
  col = mix(col, vec3(0.32, 0.58, 1.0) * (0.15 + 1.1 * dayK), fres * 0.75);
  gl_FragColor = vec4(col, 1.0);
}`;

const atmoVert = /* glsl */ `
varying vec3 vN; varying vec3 vP;
void main() {
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vP = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const atmoFrag = /* glsl */ `
uniform vec3 uSun;
varying vec3 vN; varying vec3 vP;
void main() {
  vec3 n = normalize(vN);
  vec3 V = normalize(cameraPosition - vP);
  float rim = pow(clamp(1.0 - abs(dot(n, V)), 0.0, 1.0), 5.0);
  float l = dot(n, uSun);
  vec3 blue = vec3(0.28, 0.55, 1.0);
  vec3 dusk = vec3(1.0, 0.45, 0.16);
  vec3 col = mix(dusk, blue, smoothstep(-0.05, 0.35, l)) * smoothstep(-0.35, 0.1, l);
  float fwd = pow(max(dot(-V, uSun), 0.0), 6.0);
  col += dusk * fwd * smoothstep(-0.4, 0.05, l) * 2.5;
  gl_FragColor = vec4(col * rim * 2.6, rim);
}`;

const beaconFrag = /* glsl */ `
uniform float uTime; uniform float uOn; uniform float uFill;
varying vec2 vUv;
void main() {
  vec2 p = vUv - 0.5;
  float r = length(p) * 2.0;
  float a = atan(p.y, p.x) / 6.2831853 + 0.5;
  float core = exp(-r * r * 90.0);
  float ring = 0.0;
  for (int i = 0; i < 3; i++) {
    float t = fract(uTime * 0.45 + float(i) / 3.0);
    ring += exp(-(((r - t) / 0.02) * ((r - t) / 0.02))) * (1.0 - t);
  }
  // The world streaming in: an arc that fills as the city's tiles arrive
  float arc = exp(-(((r - 0.62) / 0.012) * ((r - 0.62) / 0.012))) * step(a, uFill);
  vec3 col = vec3(1.0, 0.82, 0.45) * core * 3.0 + vec3(0.45, 1.0, 0.8) * (ring * 0.9 + arc * 2.2);
  gl_FragColor = vec4(col * uOn, 1.0);
}`;

function glowSprite(inner: string, outer: string, scale: number, intensity: THREE.Color): THREE.Sprite {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d') as CanvasRenderingContext2D;
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner);
  g.addColorStop(0.08, inner);
  g.addColorStop(0.22, outer);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, color: intensity }));
  s.scale.setScalar(scale);
  return s;
}

function stars(count: number): THREE.Points {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const band = Math.random() < 0.45;
    v.set(Math.random() * 2 - 1, band ? (Math.random() - 0.5) * 0.25 : Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
    v.applyAxisAngle(new THREE.Vector3(1, 0, 0.4).normalize(), 1.1).multiplyScalar(1500);
    pos.set([v.x, v.y, v.z], i * 3);
    const t = Math.random();
    const b = Math.pow(Math.random(), 4) * 0.95 + 0.08;
    col.set([b * (t < 0.2 ? 0.75 : 1), b * (t < 0.2 ? 0.85 : t > 0.85 ? 0.85 : 1), b * (t > 0.85 ? 0.7 : 1)], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ size: 1.05, sizeAttenuation: false, vertexColors: true, depthWrite: false }));
}

const ease = (x: number): number => x * x * (3 - 2 * x);

export const FlyPreloader: React.FC<{
  progress: number;
  items: PreflightItem[];
  log: string[];
  /** 0..1: how much of the start's 3D city has arrived. */
  tiles: number;
  ready: boolean;
  startName: string;
  startLatLon?: { lat: number; lon: number } | null;
  onEngage: () => void;
  onFinished: () => void;
}> = ({ progress, items, log, tiles, ready, startName, startLatLon, onEngage, onFinished }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'dive' | 'gone'>('loading');
  const [elapsed, setElapsed] = useState(0);
  const live = useRef({ progress: 0, tiles: 0, start: null as { lat: number; lon: number } | null, phase: 'loading' as string, diveT0: 0 });
  live.current.progress = progress;
  live.current.tiles = tiles;
  live.current.start = startLatLon ?? null;
  live.current.phase = phase;
  const reduced = useMemo(() => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, []);

  useEffect(() => {
    if (ready && phase === 'loading') setPhase('ready');
  }, [ready, phase]);

  useEffect(() => {
    const t0 = performance.now();
    const id = window.setInterval(() => setElapsed((performance.now() - t0) / 1000), 250);
    return () => window.clearInterval(id);
  }, []);

  // --- The film
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', logarithmicDepthBuffer: true });
    renderer.setPixelRatio(Math.min(1.15, window.devicePixelRatio || 1));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010103);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.002, 5000);
    // Images decoded off the main thread (see FastTextureLoader: the 8K Earth as an <img> froze the
    // film for 0.4 s on upload), then sent to the GPU one a frame as they arrive, never together
    const loader = new THREE.TextureLoader();
    const textures: THREE.Texture[] = [];
    const arrived: Array<[THREE.Texture, ImageBitmap]> = [];
    const tex = (f: string, srgb = true): THREE.Texture => {
      const url = `${B}textures/${f}`;
      let t: THREE.Texture;
      if (canUseBitmaps) {
        t = new THREE.Texture();
        // Held until its turn in the frame loop
        decodeBitmap(url).then((bmp) => arrived.push([t, bmp])).catch(() => undefined);
      } else {
        t = loader.load(url);
      }
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      textures.push(t);
      return t;
    };

    // --- The true geometry now: heliocentric positions (J2000 ecliptic), Earth at the origin
    const now = new Date();
    const jd = now.getTime() / 86400000 + 2440587.5;
    const helio = (name: string): THREE.Vector3 | null => {
      const b = SOLAR_SYSTEM_BODIES.find((x) => x.name === name);
      if (!b) return null;
      const p = KeplerSolver.propagate(b.orbit, jd - J2000_JD).positionKm;
      return ecl(p[0], p[1], p[2]).divideScalar(KeplerSolver.AU_KM);
    };
    const toFilm = (h: THREE.Vector3): THREE.Vector3 => h.clone().normalize().multiplyScalar(filmR(h.length()));
    const earthH = helio('Earth') ?? new THREE.Vector3(1, 0, 0);
    const earthF = toFilm(earthH);
    const sunPos = earthF.clone().negate();
    const sunDir = sunPos.clone().normalize();

    // Earth turned as it really is: the Sun overhead where it is noon, the pole tilted 23.4 degrees
    const ss = subsolar(now);
    const basis = (a: THREE.Vector3, b: THREE.Vector3): THREE.Matrix4 => {
      const e1 = a.clone().normalize();
      const e2 = b.clone().addScaledVector(e1, -b.dot(e1)).normalize();
      const e3 = new THREE.Vector3().crossVectors(e1, e2);
      return new THREE.Matrix4().makeBasis(e1, e2, e3);
    };
    const poleFilm = new THREE.Vector3(0, Math.cos(OBLIQ), -Math.sin(OBLIQ));
    const R = basis(sunDir, poleFilm).multiply(basis(dirFor(ss.lat, ss.lon), new THREE.Vector3(0, 1, 0)).transpose());
    const earthQ = new THREE.Quaternion().setFromRotationMatrix(R);

    const clouds = tex('hires/earth_clouds_4k.webp', false);
    clouds.wrapS = THREE.RepeatWrapping;
    const earthU = { tDay: { value: tex('hires/earth_day_8k.webp') }, tNight: { value: tex('hires/earth_night_4k.webp') }, tClouds: { value: clouds }, uSun: { value: sunDir.clone() }, uCloudShift: { value: 0 } };
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 144, 96), new THREE.ShaderMaterial({ uniforms: earthU, vertexShader: earthVert, fragmentShader: earthFrag }));
    earth.quaternion.copy(earthQ);
    scene.add(earth);
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.028, 128, 80),
      new THREE.ShaderMaterial({ uniforms: { uSun: earthU.uSun }, vertexShader: atmoVert, fragmentShader: atmoFrag, side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    ));

    // The Sun and its light
    const sun = new THREE.Mesh(new THREE.SphereGeometry(2.4, 64, 32), new THREE.MeshBasicMaterial({ map: tex('2k_sun.jpg'), color: new THREE.Color(2.2, 1.9, 1.5) }));
    sun.position.copy(sunPos);
    scene.add(sun);
    const corona = glowSprite('rgba(255,250,235,1)', 'rgba(255,190,110,0.32)', 26, new THREE.Color(3, 2.6, 2.1));
    corona.position.copy(sunPos);
    scene.add(corona);
    const sunLight = new THREE.PointLight(0xffffff, 3.2, 0, 0);
    sunLight.position.copy(sunPos);
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0x223044, 0.06));

    // The planets where they are now, with their orbits (circles at their mean distance)
    const labelEls: Array<{ el: HTMLDivElement; obj: THREE.Object3D }> = [];
    const labelHost = labelsRef.current;
    const orbitMat = new THREE.LineBasicMaterial({ color: 0xf4cd72, transparent: true, opacity: 0.16, depthWrite: false });
    const orbitLines: THREE.Line[] = [];
    const addOrbit = (au: number): void => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 256; i++) {
        const a = (i / 256) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * filmR(au), 0, Math.sin(a) * filmR(au)).add(sunPos));
      }
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), orbitMat);
      scene.add(line);
      orbitLines.push(line);
    };
    const label = (obj: THREE.Object3D, text: string): void => {
      if (!labelHost) return;
      const el = document.createElement('div');
      el.className = 'flyfilm__planet';
      el.textContent = text;
      labelHost.appendChild(el);
      labelEls.push({ el, obj });
    };
    for (const p of PLANETS) {
      const h = helio(p.name);
      const b = SOLAR_SYSTEM_BODIES.find((x) => x.name === p.name);
      if (!h || !b) continue;
      const m = new THREE.Mesh(new THREE.SphereGeometry(p.size, 64, 32), new THREE.MeshStandardMaterial({ map: tex(p.tex), roughness: 1, metalness: 0 }));
      m.position.copy(toFilm(h)).add(sunPos);
      scene.add(m);
      if (p.name === 'Saturn') {
        const ring = new THREE.Mesh(new THREE.RingGeometry(p.size * 1.25, p.size * 2.3, 128), new THREE.MeshBasicMaterial({ map: tex('2k_saturn_ring_alpha.png'), color: 0xe8d8b0, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
        ring.rotation.x = -Math.PI / 2 + 0.47;
        m.add(ring);
      }
      addOrbit(b.orbit.semiMajorAxisAU || h.length());
      label(m, `${p.name.toUpperCase()}  ${h.length().toFixed(2)} AU`);
    }
    addOrbit(earthH.length());
    const earthTag = new THREE.Object3D();
    scene.add(earthTag);
    label(earthTag, `EARTH  ${earthH.length().toFixed(3)} AU`);
    const sunTag = new THREE.Object3D();
    sunTag.position.copy(sunPos);
    scene.add(sunTag);
    label(sunTag, 'SUN');

    const moon = new THREE.Mesh(new THREE.SphereGeometry(0.273, 96, 64), new THREE.MeshStandardMaterial({ map: tex('2k_moon.jpg'), roughness: 1, metalness: 0 }));
    scene.add(moon);

    const sky = stars(6000);
    scene.add(sky);

    const beaconU = { uTime: { value: 0 }, uOn: { value: 0 }, uFill: { value: 0 } };
    const beacon = new THREE.Mesh(
      new THREE.PlaneGeometry(0.16, 0.16),
      new THREE.ShaderMaterial({ uniforms: beaconU, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }', fragmentShader: beaconFrag, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    scene.add(beacon);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.85, 0.6, 0.75);
    bloom.resolution.set(256, 256);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    // Development only: the film's parts, for inspecting it from the console
    if (import.meta.env.DEV) (window as unknown as { __flyfilm?: object }).__flyfilm = { renderer, scene, camera, composer, bloom };

    const resize = (): void => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      // The glow at full size: at half size its smallest level was 16 x 10 pixels and bright
      // points glowed as squares round the globe (measured: still ~95 fps at full size)
      bloom.setSize(w, h);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    // Act 3, the Earth approach: from the night side round the limb to over the city
    const target = dirFor(20, -30).applyQuaternion(earthQ);
    const targetGoal = target.clone();
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(sunDir, up).normalize();
    const startDir = sunDir.clone().negate().addScaledVector(side, 0.55).addScaledVector(up, 0.25).normalize();
    // Act 1: high over the Sun with the whole system in view; act 2 falls along a curve to Earth
    const toEarthFlat = earthF.clone().setY(0).normalize();
    const c0 = sunPos.clone().addScaledVector(toEarthFlat, -24).add(new THREE.Vector3(0, 74, 0));
    const c1 = startDir.clone().multiplyScalar(18.85);
    const ctrl = sunPos.clone().lerp(c1, 0.6).add(new THREE.Vector3(0, 34, 0));
    const look0 = sunPos.clone().lerp(new THREE.Vector3(), 0.3);
    const look1 = new THREE.Vector3().crossVectors(up, startDir).normalize().multiplyScalar(1.6);
    const dir = new THREE.Vector3();
    const look = new THREE.Vector3();
    const tmp = new THREE.Vector3();
    const tmp2 = new THREE.Vector3();
    const proj = new THREE.Vector3();
    let shown = 0;
    const t0 = performance.now();
    let last = t0;
    let raf = 0;
    const slerp = (a: THREE.Vector3, b: THREE.Vector3, f: number, out: THREE.Vector3): THREE.Vector3 => {
      const d = THREE.MathUtils.clamp(a.dot(b), -1, 1);
      const om = Math.acos(d);
      if (om < 1e-5) return out.copy(a);
      const s = Math.sin(om);
      return out.copy(a).multiplyScalar(Math.sin((1 - f) * om) / s).addScaledVector(b, Math.sin(f * om) / s);
    };
    const ACT1 = 0.34;

    const frame = (time2: number): void => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      const dt = Math.min(0.05, (time2 - last) / 1000);
      last = time2;
      const time = (time2 - t0) / 1000;
      const L = live.current;
      if (L.start) targetGoal.copy(dirFor(L.start.lat, L.start.lon)).applyQuaternion(earthQ);
      target.lerp(targetGoal, Math.min(1, dt * 1.5)).normalize();
      // At least 12 s of film even when everything is cached; loading drives it on from there
      const minRun = Math.min(1, time / 12);
      const want = Math.min(L.progress, 0.2 + 0.8 * minRun, 1);
      shown += (Math.max(shown, want) - shown) * Math.min(1, dt * 1.4);
      const p = L.phase === 'loading' ? Math.min(shown, 0.985) : Math.min(1, shown + dt * 0.4);
      if (L.phase !== 'loading') shown = p;
      let diveK = 0;
      if (p < ACT1) {
        const a = ease(p / ACT1);
        const u = 1 - a;
        camera.position.set(0, 0, 0).addScaledVector(c0, u * u).addScaledVector(ctrl, 2 * u * a).addScaledVector(c1, a * a);
        look.copy(look0).lerp(look1, ease(a));
        camera.fov = 42 - 4 * a;
      } else {
        const q = (p - ACT1) / (1 - ACT1);
        const e = ease(q);
        slerp(startDir, target, ease(Math.min(1, q * 1.08)), dir);
        let dist = 1.0 + 17.0 * Math.pow(1 - e, 2.2) + 0.85;
        if (L.phase === 'dive') {
          diveK = Math.min(1, (time2 - L.diveT0) / 2100);
          dist = THREE.MathUtils.lerp(dist, 1.004, Math.pow(diveK, 2.4));
        }
        const drift = tmp.crossVectors(dir, up).normalize().multiplyScalar(0.06 * Math.sin(time * 0.21) * (1 - diveK));
        camera.position.copy(dir).add(drift).normalize().multiplyScalar(dist);
        look.copy(target).multiplyScalar(THREE.MathUtils.lerp(0.0, 0.92, e));
        look.addScaledVector(tmp2.crossVectors(up, dir).normalize(), (1 - e) * 1.6);
        camera.fov = 38 + diveK * 34;
      }
      camera.up.copy(up);
      camera.lookAt(look);
      camera.updateProjectionMatrix();
      slerp(startDir, target, 0.3, tmp);
      moon.position.copy(tmp).multiplyScalar(9.5).addScaledVector(tmp2.crossVectors(tmp, up).normalize(), 1.3);
      earthU.uCloudShift.value = time * 0.0009;
      beacon.position.copy(target).multiplyScalar(1.006);
      beacon.lookAt(tmp.copy(target).multiplyScalar(3));
      beaconU.uTime.value = time;
      beaconU.uOn.value = THREE.MathUtils.smoothstep(p, 0.75, 0.95) * (1 - diveK);
      beaconU.uFill.value += (L.tiles - beaconU.uFill.value) * Math.min(1, dt * 3);
      // The system's orbits and names fade as the camera leaves it
      const sysK = 1 - THREE.MathUtils.smoothstep(p, ACT1 * 0.8, ACT1 + 0.12);
      orbitMat.opacity = 0.16 * sysK;
      for (const o of orbitLines) o.visible = sysK > 0.01;
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (const { el, obj } of labelEls) {
        obj.getWorldPosition(proj).project(camera);
        const on = sysK > 0.02 && proj.z < 1 && Math.abs(proj.x) < 1.1 && Math.abs(proj.y) < 1.1;
        el.style.opacity = on ? String(sysK) : '0';
        if (on) el.style.transform = `translate(${((proj.x + 1) / 2) * w + 10}px, ${((1 - proj.y) / 2) * h - 6}px)`;
      }
      bloom.strength = 0.85 + diveK * 1.2;
      renderer.toneMappingExposure = 1.0 + diveK * 2.5;
      sky.rotation.y = time * 0.002;
      const next = arrived.shift();
      if (next) {
        applyBitmap(next[0], next[1]);
        renderer.initTexture(next[0]);
      }
      composer.render(dt);
    };
    // Shaders compiled in parallel by the driver first (a blocking compile froze the first frame)
    let stopped = false;
    renderer
      .compileAsync(scene, camera)
      .catch(() => undefined)
      .then(() => {
        if (!stopped) raf = requestAnimationFrame(frame);
      });

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      for (const { el } of labelEls) el.remove();
      composer.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      for (const t of textures) t.dispose();
      renderer.dispose();
    };
  }, []);

  const engage = (): void => {
    if (phase !== 'ready') return;
    onEngage();
    live.current.diveT0 = performance.now();
    setPhase('dive');
    window.setTimeout(() => {
      setPhase('gone');
      onFinished();
    }, reduced ? 500 : 2900);
  };

  useEffect(() => {
    if (phase !== 'ready') return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        engage();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  });

  if (phase === 'gone') return null;
  const pct = Math.round(Math.min(1, progress) * 100);
  const mm = Math.floor(elapsed / 60);
  const ss = Math.floor(elapsed % 60);
  const ll = startLatLon;

  return (
    <div className={`flyfilm flyfilm--${phase}`} onMouseDown={(e) => e.stopPropagation()}>
      <canvas ref={canvasRef} className="flyfilm__canvas" />
      <div ref={labelsRef} className="flyfilm__labels" aria-hidden />
      <div className="flyfilm__vignette" aria-hidden />
      <div className="flyfilm__bars" aria-hidden />

      <div className="flyfilm__top">
        <span className="flyfilm__brand">SOLARIS <b>/</b> FLY</span>
        <span className="flyfilm__clock">{new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC · T+{String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}</span>
      </div>

      {(phase === 'ready' || phase === 'dive') && startName && (
        <div className="flyfilm__dest">
          <span className="flyfilm__dest-k">TAKE-OFF</span>
          <span className="flyfilm__dest-name">{startName}</span>
          {ll && <span className="flyfilm__dest-ll">{Math.abs(ll.lat).toFixed(2)}° {ll.lat >= 0 ? 'N' : 'S'} · {Math.abs(ll.lon).toFixed(2)}° {ll.lon >= 0 ? 'E' : 'W'}</span>}
        </div>
      )}

      <div className="flyfilm__bottom">
        <div className="flyfilm__stream">
          <div className="flyfilm__stream-head">
            {items.map((it) => (
              <span key={it.label} className={it.done ? 'is-done' : ''}><i />{it.label}</span>
            ))}
          </div>
          <ol className="flyfilm__log">
            {log.map((line, i) => (
              <li key={`${i}-${line}`} style={{ opacity: 0.35 + 0.65 * ((i + 1) / Math.max(1, log.length)) }}>{line}</li>
            ))}
          </ol>
        </div>
        <div className="flyfilm__pct">
          <span>{String(pct).padStart(2, '0')}</span>
          <small>{phase === 'loading' ? 'streaming the world' : 'ready'}</small>
        </div>
      </div>
      <div className="flyfilm__line" aria-hidden><div style={{ transform: `scaleX(${Math.min(1, progress)})` }} /></div>

      {phase === 'ready' && (
        <button type="button" className="flyfilm__engage" onClick={engage} autoFocus>
          <span className="flyfilm__engage-ring" />
          <span className="flyfilm__engage-ring flyfilm__engage-ring--2" />
          <span className="flyfilm__engage-label">ENGAGE</span>
          <span className="flyfilm__engage-hint">fullscreen · Enter</span>
        </button>
      )}
      <div className="flyfilm__flash" aria-hidden />
    </div>
  );
};
