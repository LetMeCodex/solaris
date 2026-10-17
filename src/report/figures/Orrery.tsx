import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { KeplerSolver } from '../../astronomy/KeplerSolver';
import { SOLAR_SYSTEM_BODIES } from '../../astronomy/SolarSystemData';
import { vela } from '../vela/bus';
import { stage, sun, world } from './stage';

/**
 * A live orrery running Solaris's own Kepler solver on the JPL elements, drawn in 3D with the real
 * planet maps. Distances are on a log scale so Mercury and Neptune fit in one view; the inclinations
 * are real, so the orbits tilt as they do. Scrub through 1800–2050 (the range the elements are valid
 * for) or let time run. Drag to turn it.
 */

const PLANETS = SOLAR_SYSTEM_BODIES.filter((b) => b.category === 'planet');
type Planet = (typeof PLANETS)[number];
const DAY_MS = 86400000;
const tdbDays = (utcMs: number) => utcMs / DAY_MS + 2440587.5 + 69.184 / 86400 - 2451545.0;
const MIN_MS = Date.UTC(1800, 0, 1);
const MAX_MS = Date.UTC(2050, 0, 1);

const RMAX = 10;
const rU = (au: number) => (RMAX * Math.log(1 + au / 0.18)) / Math.log(1 + 31 / 0.18);
const size = (km: number) => 0.19 * Math.pow(km / 6371, 0.38);

/** J2000 ecliptic (km) to the scene: log distance, ecliptic plane horizontal, north up. */
function place(p: [number, number, number], out: THREE.Vector3) {
  const r = Math.hypot(p[0], p[1], p[2]);
  const k = rU(r / KeplerSolver.AU_KM) / Math.max(1e-9, r);
  return out.set(p[0] * k, p[2] * k, -p[1] * k);
}

const SPEEDS: Array<[string, number]> = [['Pause', 0], ['1 day / s', 1], ['1 month / s', 30.44], ['1 year / s', 365.25]];

export const Orrery: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const labels = useRef<HTMLDivElement>(null);
  const dateEl = useRef<HTMLDivElement>(null);
  const dayEl = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const t0 = useRef(Date.now());
  const offset = useRef(0); // days from now
  const speedRef = useRef(30.44);
  const [speed, setSpeedState] = useState(30.44);
  const setSpeed = (v: number) => { speedRef.current = v; setSpeedState(v); };

  useEffect(() => {
    const cv = canvas.current!;
    const lab = labels.current!;
    const worlds: Array<{ b: Planet; group: THREE.Group; body: THREE.Mesh; orbit: THREE.Line; el: HTMLDivElement }> = [];
    let orbitEpoch = Number.NaN;
    const v = new THREE.Vector3();
    const sph = { r: 25, theta: 0.35, phi: 0.18 }; // phi from the pole: 0.18 is nearly top-down
    let userTurned = false;

    const s = stage(cv, 34, (dt, st) => {
      offset.current += speedRef.current * dt;
      if (t0.current + offset.current * DAY_MS > MAX_MS) offset.current = (MIN_MS - t0.current) / DAY_MS;
      const ms = t0.current + offset.current * DAY_MS;
      const days = tdbDays(ms);

      // the orbits drift too slowly to matter here: resample them once a decade of model time
      if (!(Math.abs(days - orbitEpoch) < 3650)) {
        orbitEpoch = days;
        for (const w of worlds) {
          const n = 256;
          const pos = w.orbit.geometry.attributes.position as THREE.BufferAttribute;
          for (let i = 0; i <= n; i++) {
            place(KeplerSolver.propagate(w.b.orbit, days + (w.b.orbit.orbitalPeriodDays * i) / n).positionKm, v);
            pos.setXYZ(i, v.x, v.y, v.z);
          }
          pos.needsUpdate = true;
        }
      }

      for (const w of worlds) {
        place(KeplerSolver.propagate(w.b.orbit, days).positionKm, w.group.position);
        w.body.rotation.y += dt * 0.35;
      }

      if (!userTurned) {
        // on a narrow screen, step back until Neptune's orbit fits across
        const aspect = st.size.w / st.size.h;
        st.camera.position.setFromSphericalCoords(sph.r * Math.max(1, 1.3 / aspect), sph.phi, sph.theta);
        st.camera.lookAt(0, 0, 0);
      }
      controls.update();

      // labels follow their planets on screen
      const { w: W, h: H } = st.size;
      for (const w of worlds) {
        v.copy(w.group.position).project(st.camera);
        const x = (v.x * 0.5 + 0.5) * W;
        const y = (-v.y * 0.5 + 0.5) * H;
        w.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        w.el.style.opacity = v.z < 1 ? '1' : '0';
        // near the right edge, the label goes on the planet's left
        w.el.classList.toggle('flip', x > W - 110);
      }

      const d = new Date(ms);
      if (dateEl.current) dateEl.current.textContent = d.toISOString().slice(0, 10);
      if (dayEl.current) dayEl.current.textContent = `TDB day ${days.toFixed(2)} since J2000`;
      if (slider.current && document.activeElement !== slider.current) slider.current.value = String(offset.current);
    });

    const { scene, camera } = s;
    scene.add(new THREE.AmbientLight(0xb8c4ff, 0.32));
    scene.add(new THREE.PointLight(0xfff1dd, 3.2, 0, 0));
    scene.add(sun(0.55));

    // faint reference circles in the ecliptic plane, at 1, 5, 10 and 30 AU
    for (const au of [1, 5, 10, 30]) {
      const pts = Array.from({ length: 181 }, (_, i) => {
        const a = (i / 180) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(a) * rU(au), 0, Math.sin(a) * rU(au));
      });
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: 0xf3e7d3, transparent: true, opacity: 0.1, dashSize: 0.08, gapSize: 0.16 }));
      line.computeLineDistances();
      scene.add(line);
    }
    // the direction of the March equinox, the zero of ecliptic longitude
    const eq = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.7, 0, 0), new THREE.Vector3(RMAX + 1.2, 0, 0)]), new THREE.LineDashedMaterial({ color: 0x8fa8ff, transparent: true, opacity: 0.45, dashSize: 0.15, gapSize: 0.12 }));
    eq.computeLineDistances();
    scene.add(eq);

    for (const b of PLANETS) {
      const { group, body } = world(b.name, size(b.physical.meanRadiusKm), b.physical.axialTiltDeg ?? 0);
      scene.add(group);
      const orbit = new THREE.Line(
        new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(257 * 3), 3)),
        new THREE.LineBasicMaterial({ color: new THREE.Color(b.physical.colorHex ?? '#ffffff'), transparent: true, opacity: 0.42 })
      );
      scene.add(orbit);
      const el = document.createElement('div');
      el.className = 'or-label';
      el.innerHTML = `<i></i><span>${b.name}</span>`;
      lab.appendChild(el);
      worlds.push({ b, group, body, orbit, el });
    }

    const controls = new OrbitControls(camera, cv);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minPolarAngle = 0.05;
    controls.maxPolarAngle = 1.45;
    cv.style.touchAction = 'pan-y';
    controls.addEventListener('start', () => { userTurned = true; });

    // scrolling in tilts the view from straight down to the plane of the planets
    const tw = gsap.to(sph, { phi: 1.1, theta: -0.5, r: 22.5, ease: 'none', scrollTrigger: { trigger: cv, start: 'top 85%', end: 'bottom 25%', scrub: 0.8 } });

    // hover: nearest planet on screen within 26 px
    const explain = (b: Planet, x: number, y: number) => {
      const ms = t0.current + offset.current * DAY_MS;
      const st = KeplerSolver.propagate(b.orbit, tdbDays(ms));
      const lt = st.distanceKm / 299792.458;
      const m = Math.floor(lt / 60);
      const sec = Math.round(lt % 60);
      const anchor = document.createElement('div');
      anchor.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:1px;height:1px`;
      lab.appendChild(anchor);
      vela.say({
        text: `${b.name}, on ${new Date(ms).toISOString().slice(0, 10)}: ${(st.distanceKm / KeplerSolver.AU_KM).toFixed(3)} AU from the Sun, moving at ${st.speedKmPerSec.toFixed(1)} km/s. Sunlight takes ${m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min ${sec} s`} to reach it. Computed just now, from NASA's elements.`,
        target: anchor,
        mood: 'excited',
        priority: 2,
      });
      setTimeout(() => anchor.remove(), 8000);
    };
    let lastHover: Planet | null = null;
    const pick = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      let best: { w: (typeof worlds)[number]; d: number; x: number; y: number } | null = null;
      for (const w of worlds) {
        v.copy(w.group.position).project(camera);
        const x = (v.x * 0.5 + 0.5) * r.width;
        const y = (-v.y * 0.5 + 0.5) * r.height;
        const d = Math.hypot(x - px, y - py);
        if (d < 26 && (!best || d < best.d)) best = { w, d, x, y };
      }
      worlds.forEach((w) => w.el.classList.toggle('on', w === best?.w));
      cv.style.cursor = best ? 'pointer' : 'grab';
      if (best && best.w.b !== lastHover) explain(best.w.b, best.x, best.y);
      lastHover = best?.w.b ?? null;
    };
    cv.addEventListener('pointermove', pick);

    return () => {
      cv.removeEventListener('pointermove', pick);
      tw.scrollTrigger?.kill();
      tw.kill();
      controls.dispose();
      s.dispose();
      lab.innerHTML = '';
    };
  }, []);

  return (
    <div className="orrery">
      <div className="or-stage">
        <canvas ref={canvas} aria-label="Live 3D orrery of the eight planets, drawn with their real surface maps" />
        <div ref={labels} className="or-labels" />
        <div className="or-hud">
          <div ref={dateEl} className="or-date" />
          <div ref={dayEl} className="or-day" />
        </div>
        <div className="or-foot">Log distance scale · real inclinations · drag to turn · hover a planet</div>
      </div>
      <div className="ctrl">
        {SPEEDS.map(([l, sp]) => (
          <button key={l} type="button" className={speed === sp ? 'on' : ''} onClick={() => setSpeed(sp)}>{l}</button>
        ))}
        <input
          ref={slider}
          type="range"
          min={(MIN_MS - t0.current) / DAY_MS}
          max={(MAX_MS - t0.current) / DAY_MS}
          step={0.25}
          defaultValue={0}
          onChange={(e) => { setSpeed(0); offset.current = Number(e.target.value); }}
          aria-label="Date, 1800 to 2050"
        />
        <button type="button" onClick={() => { offset.current = 0; }}>Now</button>
      </div>
    </div>
  );
};
