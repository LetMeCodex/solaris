import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { vela } from '../vela/bus';
import { atmosphere, stage, tex, world } from './stage';

/**
 * The Earth and the Moon, drawn to scale with their real surface maps, then enlarged the way Solaris
 * enlarges worlds. Scroll through it (or drag the slider) from true size to 30×. Moons are pushed
 * outward with the same formula the site uses so they never end up inside their swollen parent:
 *   distance = scale · min(d, 4R) + max(0, d − 4R)
 * The camera is orthographic, so every length in the frame can be read off one ruler.
 */

const U = 10000; // km per scene unit
const X0 = -22; // left edge of the frame, in units
const SPAN = 142; // frame width, in units
const R_E = 6371;
const R_M = 1737.4;
const D = 384400;

const moonDistance = (s: number) => s * Math.min(D, 4 * R_E) + Math.max(0, D - 4 * R_E);
/** Horizontal position in the frame, as a percentage of its width. */
const pct = (km: number) => ((km / U - X0) / SPAN) * 100;

export const ScaleFig: React.FC = () => {
  const [s, setS] = useState(1);
  const sRef = useRef(1);
  const user = useRef(false);
  const canvas = useRef<HTMLCanvasElement>(null);
    const set = (v: number) => { sRef.current = v; setS(v); };

  useEffect(() => {
    const cv = canvas.current!;
    const earth = world('Earth', R_E / U, 23.44);
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry((R_E / U) * 1.008, 64, 40),
      new THREE.MeshStandardMaterial({ color: 0xffffff, alphaMap: tex('2k_earth_clouds.jpg', false), transparent: true, depthWrite: false, roughness: 1 })
    );
    earth.body.add(clouds);
    earth.group.add(atmosphere(R_E / U, '#6fa8ff'));
    const moon = world('Moon', R_M / U);
    moon.body.rotation.y = Math.PI; // the near side faces the Earth
    const st = stage(
      cv,
      0,
      (dt, x) => {
        const k = sRef.current;
        earth.group.scale.setScalar(k);
        moon.group.scale.setScalar(k);
        moon.group.position.x = moonDistance(k) / U;
        earth.body.rotation.y += dt * 0.08;
        clouds.rotation.y += dt * 0.095;
        const cam = x.camera as THREE.OrthographicCamera;
        cam.position.set(X0 + SPAN / 2, -(cam.top - cam.bottom) * 0.06, 400);
        cam.lookAt(cam.position.x, cam.position.y, 0);
      },
      { width: SPAN }
    );
    const { scene } = st;
    const sunLight = new THREE.DirectionalLight(0xfff4e6, 3.4);
    sunLight.position.set(-1, 0.25, 0.32);
    scene.add(sunLight, new THREE.AmbientLight(0x8fa8ff, 0.08));

    scene.add(earth.group, moon.group);

    const o = { s: 1 };
    const tw = gsap.to(o, {
      s: 30,
      ease: 'power1.inOut',
      scrollTrigger: { trigger: cv, start: 'top 75%', end: 'bottom 15%', scrub: 0.6 },
      onUpdate: () => { if (!user.current) set(o.s); },
    });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); st.dispose(); };
  }, []);

  const md = moonDistance(s);
  const earthW = (((2 * R_E * s) / U) / SPAN) * 100;
  const moonW = (((2 * R_M * s) / U) / SPAN) * 100;
  const trueEarthPx = ((2 * R_E) / U / SPAN) * 1180;

  return (
    <div className="scale">
      <div className="sc-stage">
        <canvas ref={canvas} aria-label="The Earth and Moon from true scale to thirty times, with their real surface maps" />
        <div
          className="sc-hit"
          style={{ left: `${pct(0)}%`, width: `${Math.max(3, earthW)}%` }}
          onPointerEnter={(e) => vela.say({ text: `Earth, drawn ${s.toFixed(0)} times its real size. At true scale it would be about ${trueEarthPx.toFixed(0)} pixels wide on this figure. Space is mostly empty.`, target: e.currentTarget, mood: 'calm', priority: 2 })}
        />
        <div className="sc-tag" style={{ left: `${pct(0)}%`, top: `calc(44% - ${(earthW / 2).toFixed(3)}cqw - 30px)` }}>Earth</div>
        <div className="sc-tag" style={{ left: `${pct(md)}%`, top: `calc(44% - ${Math.max(moonW / 2, 0.8).toFixed(3)}cqw - 30px)` }}>Moon</div>
        {s < 3 && <div className="sc-ring" style={{ left: `${pct(md)}%` }} />}
        <div className="sc-scale">
          <b>{s.toFixed(1)}×</b>
          <span>world scale</span>
        </div>
        <div className="sc-bars">
          <div className="sc-bar true" style={{ left: `${pct(0)}%`, width: `${pct(D) - pct(0)}%` }}>
            <span>true distance · 384,400 km</span>
          </div>
          <div className="sc-bar drawn" style={{ left: `${pct(0)}%`, width: `${pct(md) - pct(0)}%` }}>
            <span>drawn distance · {Math.round(md).toLocaleString('en-US')} km</span>
          </div>
        </div>
      </div>
      <div className="ctrl">
        <span>World scale</span>
        <input type="range" min={1} max={30} step={0.1} value={s} onChange={(e) => { user.current = true; set(Number(e.target.value)); }} aria-label="World scale" />
        <span className="val">{s < 1.05 ? 'true size: two specks' : s > 29.5 ? 'Solaris default: 30×' : `${s.toFixed(1)}× larger`}</span>
      </div>
    </div>
  );
};
