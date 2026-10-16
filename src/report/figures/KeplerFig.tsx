import React, { useEffect, useRef, useState } from 'react';
import { KeplerSolver } from '../../astronomy/KeplerSolver';
import { vela } from '../vela/bus';

/**
 * Kepler's equation, solved in front of you. Time passes uniformly (the mean anomaly M, a ghost
 * going round the circle at constant speed); the planet on the ellipse speeds up near the Sun and
 * slows far away, sweeping equal areas in equal times. Newton's method finds E from M; each guess
 * is listed with its error.
 */

const W = 1180;
const H = 480;
const A = 190;

function iterate(M: number, e: number) {
  // The same starter Solaris uses, then Newton–Raphson, recording each step
  let E = e < 0.18 ? M + e * Math.sin(M) : M + (M < 0 ? -1 : 1) * 0.85 * e;
  const steps: Array<{ E: number; err: number }> = [];
  for (let i = 0; i < 8; i++) {
    const f = E - e * Math.sin(E) - M;
    steps.push({ E, err: Math.abs(f) });
    if (Math.abs(f) < 1e-12) break;
    E -= f / (1 - e * Math.cos(E));
  }
  return steps;
}

export const KeplerFig: React.FC = () => {
  const [e, setE] = useState(0.55);
  const [M, setM] = useState(0.6);
  const [run, setRun] = useState(true);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!run) return;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    if (ref.current) io.observe(ref.current);
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const t = performance.now();
      if (!visible) { last = t; return; }
      setM((m) => {
        const next = m + ((t - last) / 1000) * 0.55;
        return next > 2 * Math.PI ? next - 2 * Math.PI : next;
      });
      last = t;
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [run]);

  const steps = iterate(M, e);
  const E = KeplerSolver.solveKepler(M, e);
  const b = A * Math.sqrt(1 - e * e);
  const cx = 300;
  const cy = H / 2;
  const fx = cx + A * e; // the Sun sits at a focus
  const px = cx + A * Math.cos(E);
  const py = cy - b * Math.sin(E);
  const ex = cx + A * Math.cos(E);
  const ey = cy - A * Math.sin(E);
  const mx = cx + A * Math.cos(M);
  const my = cy - A * Math.sin(M);
  // Swept area from periapsis (Kepler's second law): sector at the focus
  const n = 60;
  let sector = `M${fx} ${cy} L${cx + A} ${cy}`;
  const E0 = 0;
  const E1 = E < 0 ? E + 2 * Math.PI : E;
  for (let i = 1; i <= n; i++) {
    const t = E0 + ((E1 - E0) * i) / n;
    sector += ` L${(cx + A * Math.cos(t)).toFixed(1)} ${(cy - b * Math.sin(t)).toFixed(1)}`;
  }
  sector += ' Z';
  const r = A * (1 - e * Math.cos(E));
  const speedRel = Math.sqrt((2 / (r / A)) - 1); // vis-viva, in units of the circular speed

  const explain = (what: string) => {
    const lines: Record<string, string> = {
      ghost: "The ghost goes round at a perfectly steady pace. That's the mean anomaly, M: time, really. If orbits were circles, the planet would be right on it.",
      planet: `The real planet. It's ${speedRel > 1 ? 'faster' : 'slower'} than average right now (${speedRel.toFixed(2)}× the circular speed) because it's ${r < A ? 'close to' : 'far from'} the Sun.`,
      sun: "The Sun sits at a focus of the ellipse, not the centre. That's Kepler's first law.",
      area: "This shaded area grows by the same amount every second, fast near the Sun and slow far away. Kepler's second law, live.",
    };
    vela.say({ text: lines[what], target: ref.current, mood: 'thinking', priority: 2 });
  };

  return (
    <div>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="media" role="img" aria-label="Kepler's equation solved live">
        <circle cx={cx} cy={cy} r={A} fill="none" stroke="rgba(243,239,233,0.14)" strokeDasharray="3 5" />
        <path d={sector} fill="rgba(220,171,118,0.14)" stroke="none" onPointerEnter={() => explain('area')} />
        <ellipse cx={cx} cy={cy} rx={A} ry={b} fill="none" stroke="#dcab76" strokeWidth={1.6} />
        <line x1={cx - A - 20} y1={cy} x2={cx + A + 20} y2={cy} stroke="rgba(243,239,233,0.1)" />
        <line x1={ex} y1={ey} x2={px} y2={py} stroke="rgba(109,252,192,0.5)" strokeDasharray="2 3" />
        <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="rgba(109,252,192,0.35)" />
        <line x1={fx} y1={cy} x2={px} y2={py} stroke="rgba(255,217,166,0.6)" />
        <g onPointerEnter={() => explain('sun')}>
          <circle cx={fx} cy={cy} r={18} fill="rgba(255,190,110,0.18)" />
          <circle cx={fx} cy={cy} r={8} fill="#ffd28a" />
        </g>
        <g onPointerEnter={() => explain('ghost')}>
          <circle cx={mx} cy={my} r={12} fill="transparent" />
          <circle cx={mx} cy={my} r={5} fill="none" stroke="#f3efe9" strokeOpacity={0.6} strokeDasharray="2 2" />
        </g>
        <circle cx={ex} cy={ey} r={3.5} fill="#6dfcc0" />
        <g onPointerEnter={() => explain('planet')}>
          <circle cx={px} cy={py} r={14} fill="transparent" />
          <circle cx={px} cy={py} r={8} fill="#7fb6ff" stroke="#fff" strokeWidth={1.2} />
        </g>
        <text x={cx - A} y={34} fill="rgba(243,239,233,0.45)" fontFamily="JetBrains Mono" fontSize="11" letterSpacing="2">ELLIPSE e = {e.toFixed(2)} · HOVER THE PIECES</text>

        {/* Newton's method, step by step */}
        <g transform="translate(640, 60)">
          <text x={0} y={0} fill="#6dfcc0" fontFamily="JetBrains Mono" fontSize="12" letterSpacing="3">SOLVING  M = E − e·sin E</text>
          <text x={0} y={34} fill="#f3efe9" fontFamily="JetBrains Mono" fontSize="15">M = {M.toFixed(6)} rad   (time)</text>
          {steps.map((s, i) => (
            <g key={i} transform={`translate(0, ${70 + i * 38})`}>
              <text x={0} y={0} fill="rgba(243,239,233,0.5)" fontFamily="JetBrains Mono" fontSize="13">guess {i}</text>
              <text x={90} y={0} fill="#ffd9a6" fontFamily="JetBrains Mono" fontSize="15">E = {s.E.toFixed(12)}</text>
              <rect x={330} y={-11} width={Math.max(2, Math.min(120, 120 + Math.log10(Math.max(1e-16, s.err)) * 7.5))} height={12} fill={s.err < 1e-12 ? '#6dfcc0' : '#dcab76'} opacity={0.8} />
              <text x={460} y={0} fill={s.err < 1e-12 ? '#6dfcc0' : 'rgba(243,239,233,0.6)'} fontFamily="JetBrains Mono" fontSize="12">{s.err < 1e-12 ? 'solved' : `error ${s.err.toExponential(1)}`}</text>
            </g>
          ))}
          <text x={0} y={70 + steps.length * 38 + 16} fill="rgba(243,239,233,0.45)" fontFamily="JetBrains Mono" fontSize="12">
            {steps.length - 1} Newton steps to 12 decimal places
          </text>
        </g>
      </svg>
      <div className="ctrl">
        <span>Eccentricity</span>
        <input type="range" min={0} max={0.95} step={0.01} value={e} onChange={(ev) => setE(Number(ev.target.value))} aria-label="Eccentricity" />
        <span className="val">e = {e.toFixed(2)} {e < 0.02 ? '(Earth-like)' : e < 0.25 ? '(Mercury-like)' : e > 0.8 ? '(comet-like)' : ''}</span>
        <button type="button" className={run ? 'on' : ''} onClick={() => setRun((r) => !r)}>{run ? 'Pause time' : 'Run time'}</button>
      </div>
    </div>
  );
};
