import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { KeplerSolver } from '../astronomy/KeplerSolver';
import { SOLAR_SYSTEM_BODIES } from '../astronomy/SolarSystemData';
import { CatalogueManager } from '../data/CatalogueManager';

/**
 * The page is printed on the real sky. A telescope view built from Solaris's own data: the Gaia
 * all-sky map (projected exactly, ICRS → galactic, per pixel), the 12,596 Hipparcos stars, and the
 * three photographed nebulae at their true positions. Each chapter points the telescope at a
 * target that belongs to it, and it slews there as you read.
 */

// ---- targets ------------------------------------------------------------------------------------
export interface SkyTarget { id: string; ra: number; dec: number; name: string; note: string }

const DEG = Math.PI / 180;
const OBLIQUITY = 23.4392911 * DEG;
const tdbDays = () => Date.now() / 86400000 + 2440587.5 + 69.184 / 86400 - 2451545;

/** Ecliptic J2000 vector → RA/Dec in degrees. */
function eclToRaDec(x: number, y: number, z: number) {
  const ye = y * Math.cos(OBLIQUITY) - z * Math.sin(OBLIQUITY);
  const ze = y * Math.sin(OBLIQUITY) + z * Math.cos(OBLIQUITY);
  const r = Math.hypot(x, ye, ze);
  return { ra: ((Math.atan2(ye, x) / DEG) + 360) % 360, dec: Math.asin(ze / r) / DEG };
}
function helio(name: string) {
  const b = SOLAR_SYSTEM_BODIES.find((d) => d.name === name)!;
  return KeplerSolver.propagate(b.orbit, tdbDays()).positionKm;
}
function liveSun() {
  const e = helio('Earth');
  return eclToRaDec(-e[0], -e[1], -e[2]);
}
function liveSaturn() {
  const e = helio('Earth');
  const s = helio('Saturn');
  return eclToRaDec(s[0] - e[0], s[1] - e[1], s[2] - e[2]);
}
function liveMoon() {
  try {
    const m = CatalogueManager.getBody('Moon');
    if (!m) throw new Error('no moon');
    const p = KeplerSolver.propagate(m.orbit, tdbDays(), 398600.4418).positionKm;
    return eclToRaDec(p[0], p[1], p[2]);
  } catch {
    return { ra: 30, dec: 10 };
  }
}

export const SKY_TARGETS: Record<string, () => SkyTarget> = {
  start: () => ({ id: 'start', ra: 266.42, dec: -29.0, name: 'Sagittarius', note: 'The heart of the galaxy, where the journey ended' }),
  orbits: () => ({ id: 'orbits', ra: 0, dec: 0, name: 'The March equinox', note: 'Where ecliptic longitude starts' }),
  scale: () => ({ id: 'scale', ra: 10.68, dec: 41.27, name: 'Andromeda', note: '2.5 million light-years away' }),
  sky: () => ({ id: 'sky', ra: 83.82, dec: -5.39, name: 'Orion', note: 'The Orion Nebula, 1,344 light-years' }),
  sun: () => ({ id: 'sun', ...liveSun(), name: 'The Sun, right now', note: 'Computed from Earth’s orbit as you read' }),
  ground: () => ({ id: 'ground', ...liveMoon(), name: 'The Moon, right now', note: 'From JPL’s mean elements, this second' }),
  skies: () => ({ id: 'skies', ...liveSaturn(), name: 'Saturn, right now', note: 'As seen from Earth tonight' }),
  nebulae: () => ({ id: 'nebulae', ra: 159.33, dec: -58.62, name: 'Carina', note: 'Home of the Cosmic Cliffs and Mystic Mountain' }),
  blackhole: () => ({ id: 'blackhole', ra: 266.4168, dec: -29.0078, name: 'Sagittarius A*', note: '27,000 light-years, behind the dust' }),
  vela: () => ({ id: 'vela', ra: 128.84, dec: -45.18, name: 'Vela, the Sails', note: 'Her namesake constellation' }),
  sound: () => ({ id: 'sound', ra: 279.23, dec: 38.78, name: 'Lyra, the Lyre', note: 'Vega, and an instrument in the sky' }),
  interface: () => ({ id: 'interface', ra: 37.95, dec: 89.26, name: 'Polaris', note: 'The navigator’s star' }),
  film: () => ({ id: 'film', ra: 85, dec: -52, name: 'Pictor, the Easel', note: 'A painter’s easel among the stars' }),
  bugs: () => ({ id: 'bugs', ra: 190, dec: -70, name: 'Musca, the Fly', note: 'Yes, there is a bug in the sky' }),
  log: () => ({ id: 'log', ra: 52, dec: -53, name: 'Horologium, the Clock', note: 'For the build log' }),
  refs: () => ({ id: 'refs', ra: 288, dec: -51, name: 'Telescopium', note: 'Where credit is due' }),
  colophon: () => ({ id: 'colophon', ra: 337.41, dec: -20.84, name: 'The Helix', note: 'How our Sun will end, five billion years from now' }),
};

const raDecVec = (ra: number, dec: number) => new THREE.Vector3(Math.cos(dec * DEG) * Math.cos(ra * DEG), Math.cos(dec * DEG) * Math.sin(ra * DEG), Math.sin(dec * DEG));

// ICRS → galactic (rows)
const GAL = new THREE.Matrix3().set(
  -0.0548755604162154, -0.873437090234885, -0.483835015548713,
  0.494109427875584, -0.444829629960011, 0.746982244497219,
  -0.867666149019005, -0.198076373431201, 0.455983776175067
);

const SKY_VERT = /* glsl */ `
  varying vec2 vNdc;
  void main() { vNdc = position.xy; gl_Position = vec4(position.xy, 0.9999, 1.0); }
`;
const SKY_FRAG = /* glsl */ `
  uniform sampler2D uSky;
  uniform mat4 uInvProj;
  uniform mat4 uCamWorld;
  uniform mat3 uGal;
  uniform float uExposure;
  varying vec2 vNdc;
  const float PI = 3.141592653589793;
  void main() {
    vec4 v = uInvProj * vec4(vNdc, 1.0, 1.0);
    vec3 dirCam = normalize(v.xyz / v.w);
    vec3 d = normalize((uCamWorld * vec4(dirCam, 0.0)).xyz);
    vec3 g = uGal * d;
    float l = atan(g.y, g.x);
    float b = asin(clamp(g.z, -1.0, 1.0));
    vec2 uv = vec2(0.5 - l / (2.0 * PI), 0.5 + b / PI);
    // a fixed, slightly soft level: Gaia's star counts become a glow (the real stars are drawn on top),
    // and a fixed level has no seam where the longitude wraps
    vec3 c = textureLod(uSky, uv, 0.0).rgb;
    // lift the faint glow a little, keep the blacks deep
    c = pow(c, vec3(0.92)) * uExposure;
    gl_FragColor = vec4(c, 1.0);
  }
`;
const STAR_VERT = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPx;
  varying vec3 vColor;
  varying float vTw;
  void main() {
    vColor = aColor;
    vTw = 0.78 + 0.22 * sin(uTime * (1.3 + aSeed * 2.1) + aSeed * 40.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPx;
  }
`;
const STAR_FRAG = /* glsl */ `
  uniform float uExposure;
  varying vec3 vColor;
  varying float vTw;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float r = length(p);
    float core = smoothstep(0.5, 0.0, r);
    float a = pow(core, 2.2) * vTw;
    gl_FragColor = vec4(vColor * a * (0.6 + 0.4 * uExposure), a);
  }
`;

type Row = [number, number, number, number, number, number | null, number | null, unknown, string];

function bv(c: number | null): [number, number, number] {
  const b = Math.max(-0.4, Math.min(2, c ?? 0.6));
  if (b < 0) return [0.72, 0.8, 1];
  if (b < 0.4) return [0.95, 0.96, 1];
  if (b < 0.8) return [1, 0.94, 0.84];
  if (b < 1.3) return [1, 0.82, 0.63];
  return [1, 0.7, 0.5];
}

export const SkyBackground: React.FC = () => {
  const mount = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
    const dpr = Math.min(1.25, window.devicePixelRatio || 1);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.up.set(0, 0, 1); // north celestial pole up
    const base = import.meta.env.BASE_URL;

    // The Gaia sky, sampled per pixel
    const skyTex = new THREE.TextureLoader().load(`${base}report/sky.webp`);
    skyTex.colorSpace = THREE.NoColorSpace;
    skyTex.minFilter = THREE.LinearMipmapLinearFilter;
    skyTex.wrapS = THREE.RepeatWrapping;
    const skyMat = new THREE.ShaderMaterial({
      vertexShader: SKY_VERT,
      fragmentShader: SKY_FRAG,
      depthWrite: false,
      depthTest: false,
      uniforms: { uSky: { value: skyTex }, uInvProj: { value: new THREE.Matrix4() }, uCamWorld: { value: new THREE.Matrix4() }, uGal: { value: GAL }, uExposure: { value: 0.7 } },
    });
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), skyMat);
    sky.frustumCulled = false;
    sky.renderOrder = -10;
    scene.add(sky);

    // Nebulae: the three photographs, at their real positions (enlarged)
    const neb = (file: string, ra: number, dec: number, sizeDeg: number, roll: number) => {
      const t = new THREE.TextureLoader().load(`${base}textures/nebulae/${file}`);
      t.colorSpace = THREE.NoColorSpace;
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, depthTest: false, opacity: 0.95 })
      );
      const dir = raDecVec(ra, dec);
      m.position.copy(dir.clone().multiplyScalar(100));
      const s = 2 * 100 * Math.tan((sizeDeg / 2) * DEG);
      m.scale.set(s, s, 1);
      m.up.set(0, 0, 1);
      m.lookAt(0, 0, 0);
      m.rotateZ(roll * DEG);
      m.renderOrder = -5;
      scene.add(m);
      return m;
    };
    const nebulae = [
      neb('cosmic-cliffs.webp', 159.33, -58.62, 12, 0),
      neb('mystic-mountain.webp', 162.4, -61.2, 7, 20),
      neb('helix.webp', 337.41, -20.84, 9, 0),
    ];

    // Hipparcos stars
    const starMat = new THREE.ShaderMaterial({
      vertexShader: STAR_VERT,
      fragmentShader: STAR_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPx: { value: dpr }, uExposure: { value: 0.7 } },
    });
    let stars: THREE.Points | null = null;
    let alive = true;
    fetch(`${base}data/stars.json`)
      .then((r) => r.json())
      .then((d: { stars: Row[] }) => {
        if (!alive) return;
        const rows = d.stars.filter((s) => s[4] < 6.8);
        const pos = new Float32Array(rows.length * 3);
        const col = new Float32Array(rows.length * 3);
        const size = new Float32Array(rows.length);
        const seed = new Float32Array(rows.length);
        rows.forEach((s, i) => {
          pos.set([s[1] * 100, s[2] * 100, s[3] * 100], i * 3);
          col.set(bv(s[5]), i * 3);
          size[i] = Math.max(2.2, 11.5 - 1.55 * (s[4] + 1.5));
          seed[i] = Math.random();
        });
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
        g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
        g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
        stars = new THREE.Points(g, starMat);
        stars.frustumCulled = false;
        scene.add(stars);
      });

    // ---- pointing ------------------------------------------------------------------------------
    const q = new THREE.Quaternion();
    const look = (ra: number, dec: number, out: THREE.Quaternion) => {
      const m = new THREE.Matrix4().lookAt(new THREE.Vector3(0, 0, 0), raDecVec(ra, dec), new THREE.Vector3(0, 0, 1));
      // near the poles "up" degenerates; nudge it
      if (Math.abs(dec) > 85) m.lookAt(new THREE.Vector3(0, 0, 0), raDecVec(ra, dec), new THREE.Vector3(1, 0, 0));
      return out.setFromRotationMatrix(m);
    };
    let target = SKY_TARGETS.start();
    look(target.ra, target.dec, q);
    camera.quaternion.copy(q);
    const from = new THREE.Quaternion();
    const to = new THREE.Quaternion();
    const slew = { k: 1 };
    let drift = 0;

    const setHud = (t: SkyTarget, moving: boolean) => {
      const h = hud.current;
      if (!h) return;
      const ra = ((t.ra % 360) + 360) % 360 / 15;
      const rh = Math.floor(ra);
      const rm = Math.round((ra - rh) * 60);
      const dec = t.dec;
      h.querySelector('.sky-name')!.textContent = t.name;
      h.querySelector('.sky-note')!.textContent = t.note;
      h.querySelector('.sky-coord')!.textContent = `RA ${String(rh).padStart(2, '0')}h ${String(rm).padStart(2, '0')}m · Dec ${dec >= 0 ? '+' : '−'}${Math.abs(dec).toFixed(1)}°`;
      h.classList.toggle('is-slewing', moving);
    };
    setHud(target, false);

    const pointAt = (id: string) => {
      const make = SKY_TARGETS[id];
      if (!make) return;
      const t = make();
      if (t.id === target.id) return;
      target = t;
      from.copy(camera.quaternion);
      look(t.ra, t.dec, to);
      drift = 0;
      setHud(t, true);
      gsap.killTweensOf(slew);
      slew.k = 0;
      gsap.to(slew, { k: 1, duration: reduced ? 0.01 : 2.6, ease: 'power3.inOut', onComplete: () => setHud(t, false) });
    };

    // Exposure: the sky brightens at chapter openings, and dims for reading
    const expo = { v: 0.0 };
    const triggers: ScrollTrigger[] = [];
    const setup = () => {
      triggers.forEach((t) => t.kill());
      triggers.length = 0;
      triggers.push(
        ScrollTrigger.create({
          trigger: '.sh',
          start: 'bottom 85%',
          onEnter: () => { pointAt('start'); gsap.to(expo, { v: 0.62, duration: 1.6 }); },
          onLeaveBack: () => gsap.to(expo, { v: 0, duration: 0.8 }),
        })
      );
      document.querySelectorAll<HTMLElement>('.ch').forEach((ch) => {
        triggers.push(
          ScrollTrigger.create({ trigger: ch, start: 'top 60%', end: 'bottom 40%', onToggle: (s) => s.isActive && pointAt(ch.id) })
        );
        const head = ch.querySelector('.ch-head');
        if (head) {
          triggers.push(
            ScrollTrigger.create({
              trigger: head,
              start: 'top 85%',
              end: 'bottom 20%',
              onToggle: (s) => {
                gsap.to(expo, { v: s.isActive ? 1 : 0.55, duration: 1.2, ease: 'sine.inOut' });
                // the pointing readout belongs to the chapter openings; it steps aside for reading
                hud.current?.classList.toggle('is-reading', !s.isActive);
              },
            })
          );
        }
      });
    };
    const late = window.setTimeout(setup, 300);
    const late2 = window.setTimeout(() => { setup(); ScrollTrigger.refresh(); }, 3000);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    let raf = 0;
    const t0 = performance.now();
    const tmp = new THREE.Quaternion();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (expo.v < 0.01) return; // hidden behind the hero
      const t = (performance.now() - t0) / 1000;
      if (slew.k < 1) camera.quaternion.slerpQuaternions(from, to, slew.k);
      else if (!reduced) {
        // the sky keeps turning, very slowly, like a telescope tracking
        drift += 0.0006;
        tmp.setFromAxisAngle(new THREE.Vector3(0, 0, 1), drift);
        camera.quaternion.copy(to.clone().premultiply(tmp));
      }
      camera.updateMatrixWorld();
      skyMat.uniforms.uInvProj.value.copy(camera.projectionMatrixInverse);
      skyMat.uniforms.uCamWorld.value.copy(camera.matrixWorld);
      skyMat.uniforms.uExposure.value = 0.42 + 0.58 * expo.v;
      starMat.uniforms.uExposure.value = expo.v;
      starMat.uniforms.uTime.value = t;
      nebulae.forEach((n) => ((n.material as THREE.MeshBasicMaterial).opacity = 0.55 + 0.45 * expo.v));
      renderer.render(scene, camera);
    };
    to.copy(q);
    raf = requestAnimationFrame(loop);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(late);
      window.clearTimeout(late2);
      triggers.forEach((t) => t.kill());
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      skyTex.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div ref={mount} className="sky-bg" aria-hidden />
      <div className="sky-veil" aria-hidden />
      <div ref={hud} className="sky-hud" aria-live="polite">
        <span className="sky-reticle" aria-hidden><i /></span>
        <span className="sky-lines">
          <span className="sky-k">Telescope pointing</span>
          <span className="sky-name" />
          <span className="sky-coord" />
          <span className="sky-note" />
        </span>
      </div>
    </>
  );
};
