import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { HudViewState } from '../../rendering/SolarSystemScene';

export type ViewStateGetter = () => HudViewState | null | undefined;

/** Run `cb` every animation frame with the latest camera state (no React renders). */
export function useViewFrame(getView: ViewStateGetter | undefined, cb: (v: HudViewState, t: number) => void): void {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    if (!getView) return;
    let raf = 0;
    const loop = (t: number) => {
      const v = getView();
      if (v) cbRef.current(v, t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [getView]);
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================================================
   DECODE TEXT — letters lock in left to right, like a signal resolving
   ========================================================================== */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/+*';

export const DecodeText: React.FC<{ text: string; className?: string; durationMs?: number; style?: React.CSSProperties }> = ({
  text,
  className,
  durationMs = 900,
  style,
}) => {
  const [shown, setShown] = useState(text);
  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(text);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      const locked = Math.floor(p * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (i < locked || ch === ' ') out += ch;
        else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setShown(out);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [text, durationMs]);
  return (
    <span className={className} style={style} aria-label={text}>
      <span aria-hidden>{shown}</span>
    </span>
  );
};

/* ==========================================================================
   ATTITUDE SCOPE — the ecliptic as seen from inside the helmet.
   Rings lie in the ecliptic plane and turn with the camera; Z is ecliptic
   north; the mint vector is where you are travelling; ☉ marks the Sun.
   ========================================================================== */
const SCOPE_W = 210;
const SCOPE_H = 120;

export const AttitudeScope: React.FC<{ getView?: ViewStateGetter; range: string; azimuth: number; elevation: number }> = ({
  getView,
  range,
  azimuth,
  elevation,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scratch = useRef({ q: new THREE.Quaternion(), p: new THREE.Vector3() });

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = SCOPE_W * dpr;
    c.height = SCOPE_H * dpr;
    c.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  useViewFrame(getView, (v, t) => {
    const c = canvasRef.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const { q, p } = scratch.current;
    q.copy(v.quaternion).invert();
    const cx = SCOPE_W / 2;
    const cy = SCOPE_H / 2 + 4;
    const R = 46;
    // Project a world direction into the scope; returns depth too (towards viewer = positive)
    const proj = (x: number, y: number, z: number): [number, number, number] => {
      p.set(x, y, z).applyQuaternion(q);
      const persp = 1 / (1 + p.z * -0.22);
      return [cx + p.x * R * persp, cy - p.y * R * persp, p.z];
    };

    ctx.clearRect(0, 0, SCOPE_W, SCOPE_H);
    ctx.lineWidth = 1;

    // Ecliptic rings, the far half dimmer than the near half
    for (const rr of [0.42, 0.72, 1.0]) {
      let prev: [number, number, number] | null = null;
      for (let i = 0; i <= 72; i++) {
        const a = (i / 72) * Math.PI * 2;
        const pt = proj(Math.cos(a) * rr, 0, Math.sin(a) * rr);
        if (prev) {
          const near = (prev[2] + pt[2]) * 0.5;
          ctx.strokeStyle = `rgba(244, 205, 114, ${near > 0 ? 0.55 : 0.2})`;
          ctx.beginPath();
          ctx.moveTo(prev[0], prev[1]);
          ctx.lineTo(pt[0], pt[1]);
          ctx.stroke();
        }
        prev = pt;
      }
    }

    // Radar sweep across the ecliptic plane
    const sweep = (t * 0.00055) % (Math.PI * 2);
    for (let k = 0; k < 14; k++) {
      const a = sweep - k * 0.045;
      const o = proj(0, 0, 0);
      const e = proj(Math.cos(a), 0, Math.sin(a));
      ctx.strokeStyle = `rgba(109, 252, 192, ${0.28 * (1 - k / 14)})`;
      ctx.beginPath();
      ctx.moveTo(o[0], o[1]);
      ctx.lineTo(e[0], e[1]);
      ctx.stroke();
    }

    // Bearing ticks every 30° on the outer ring
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const a0 = proj(Math.cos(a) * 1.0, 0, Math.sin(a) * 1.0);
      const a1 = proj(Math.cos(a) * 1.1, 0, Math.sin(a) * 1.1);
      ctx.strokeStyle = `rgba(244, 205, 114, ${a0[2] > 0 ? 0.6 : 0.22})`;
      ctx.beginPath();
      ctx.moveTo(a0[0], a0[1]);
      ctx.lineTo(a1[0], a1[1]);
      ctx.stroke();
    }

    // Ecliptic north (Z)
    const o = proj(0, 0, 0);
    const z = proj(0, 1.18, 0);
    ctx.strokeStyle = 'rgba(242, 156, 85, 0.9)';
    ctx.beginPath();
    ctx.moveTo(o[0], o[1]);
    ctx.lineTo(z[0], z[1]);
    ctx.stroke();
    ctx.fillStyle = '#f29c55';
    ctx.font = '600 9px JetBrains Mono, monospace';
    ctx.fillText('Z', z[0] + 4, z[1] + 3);
    ctx.beginPath();
    ctx.arc(z[0], z[1], 1.6, 0, Math.PI * 2);
    ctx.fill();

    // The Sun
    const sl = v.toSun.length();
    if (sl > 1e-6) {
      const s = proj(v.toSun.x / sl, v.toSun.y / sl, v.toSun.z / sl);
      ctx.strokeStyle = `rgba(255, 214, 140, ${s[2] > 0 ? 0.95 : 0.35})`;
      ctx.beginPath();
      ctx.arc(s[0], s[1], 3.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = ctx.strokeStyle;
      ctx.beginPath();
      ctx.arc(s[0], s[1], 0.9, 0, Math.PI * 2);
      ctx.fill();
    }

    // Travel vector
    const speed = v.velocity.length();
    if (speed > 1e-4) {
      const len = THREE.MathUtils.clamp(Math.log10(1 + speed * 4) / 2.2, 0.25, 1.15);
      const e = proj((v.velocity.x / speed) * len, (v.velocity.y / speed) * len, (v.velocity.z / speed) * len);
      ctx.strokeStyle = '#6dfcc0';
      ctx.shadowColor = '#6dfcc0';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(o[0], o[1]);
      ctx.lineTo(e[0], e[1]);
      ctx.stroke();
      const ang = Math.atan2(e[1] - o[1], e[0] - o[0]);
      ctx.beginPath();
      ctx.moveTo(e[0], e[1]);
      ctx.lineTo(e[0] - Math.cos(ang - 0.45) * 6, e[1] - Math.sin(ang - 0.45) * 6);
      ctx.moveTo(e[0], e[1]);
      ctx.lineTo(e[0] - Math.cos(ang + 0.45) * 6, e[1] - Math.sin(ang + 0.45) * 6);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Observer
    ctx.fillStyle = '#6dfcc0';
    ctx.shadowColor = '#6dfcc0';
    ctx.shadowBlur = 8;
    ctx.fillRect(o[0] - 2.5, o[1] - 2.5, 5, 5);
    ctx.shadowBlur = 0;
  });

  return (
    <div className="flex flex-col items-center gap-1">
      <canvas ref={canvasRef} style={{ width: SCOPE_W, height: SCOPE_H }} aria-hidden />
      <div className="hud-label text-center" style={{ color: 'rgba(244,205,114,0.75)' }}>
        J2000 Ecliptic · Range <span className="hud-num" style={{ letterSpacing: '0.06em' }}>{range}</span>
      </div>
      <div className="hud-num text-[9px] text-white/35 tracking-[0.2em]">
        AZ {String(((azimuth % 360) + 360) % 360).padStart(3, '0')}° · EL {elevation >= 0 ? '+' : '−'}
        {String(Math.abs(elevation)).padStart(2, '0')}°
      </div>
    </div>
  );
};

/* ==========================================================================
   TARGET LOCK — brackets that find the destination during a flight and
   let go once it fills the frame
   ========================================================================== */
export const TargetLock: React.FC<{ getView?: ViewStateGetter; name: string }> = ({ getView, name }) => {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ wasTransit: false, lockAt: 0, name: '' });

  useViewFrame(getView, (v, t) => {
    const el = ref.current;
    if (!el) return;
    const s = state.current;
    const inTransit = v.transit !== null;
    // A new lock begins when a flight starts, or the target changes
    if ((inTransit && !s.wasTransit) || name !== s.name) {
      s.lockAt = t;
      s.name = name;
      el.classList.remove('locking');
      void el.offsetWidth; // restart the animation
      el.classList.add('locking');
    }
    s.wasTransit = inTransit;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const r = Math.max(10, v.target.r);
    const tooBig = r > Math.min(vw, vh) * 0.26;
    const age = t - s.lockAt;
    const visible = v.target.visible && !tooBig && (inTransit || age < 5000);
    el.classList.toggle('visible', visible);
    el.classList.toggle('resting', !inTransit && age > 2600);
    if (!visible) return;
    const pad = 10 + r * 0.18;
    const size = (r + pad) * 2;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.transform = `translate3d(${v.target.x - size / 2}px, ${v.target.y - size / 2}px, 0)`;
  });

  return (
    <div ref={ref} className="hud-lock" aria-hidden>
      <i />
      <i />
      <i />
      <i />
      <span className="tag">Target · {name}</span>
    </div>
  );
};

/* ==========================================================================
   TRANSIT — a phosphor bar while the camera is under way
   ========================================================================== */
export const TransitBar: React.FC<{ getView?: ViewStateGetter; destination: string }> = ({ getView, destination }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const pct = useRef<HTMLSpanElement>(null);

  useViewFrame(getView, (v) => {
    const active = v.transit !== null && v.transit.progress < 0.995;
    wrap.current?.classList.toggle('active', active);
    if (!active || !v.transit) return;
    if (bar.current) bar.current.style.transform = `scaleX(${v.transit.progress})`;
    if (pct.current) pct.current.textContent = `${Math.round(v.transit.progress * 100).toString().padStart(2, '0')}%`;
  });

  return (
    <div ref={wrap} className="hud-transit w-[220px]" aria-hidden>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="hud-label" style={{ color: 'var(--sol-mint)' }}>
          <span className="hud-led on pulse inline-block mr-2 align-middle" />
          En route
        </span>
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/85">{destination}</span>
        <span ref={pct} className="hud-num text-[9px] text-white/50">00%</span>
      </div>
      <div className="bar">
        <b ref={bar} style={{ transform: 'scaleX(0)' }} />
      </div>
    </div>
  );
};
