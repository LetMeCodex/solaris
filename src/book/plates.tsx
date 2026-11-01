import React, { useContext, useEffect, useRef, useState } from 'react';
import { LiveContext } from './kit';

/** Kepler's equation solved live: a ghost at steady speed, a planet that rushes near the Sun. */
export const KeplerLive: React.FC = () => {
  const live = useContext(LiveContext);
  const pl = useRef<SVGCircleElement>(null);
  const gh = useRef<SVGCircleElement>(null);
  const ar = useRef<SVGPathElement>(null);
  const li = useRef<SVGLineElement>(null);
  const [rows, setRows] = useState<Array<[number, number]>>([]);
  const e = 0.55;
  const A = 200;
  const B = A * Math.sqrt(1 - e * e);
  const cx = 234;
  const cy = 218;
  const fx = cx + A * e;
  useEffect(() => {
    if (!live) return;
    let raf = 0;
    let last = 0;
    const t0 = performance.now();
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 83) return;
      last = t;
      const M = (((t - t0) / 1000) * 0.5) % (Math.PI * 2);
      const steps: Array<[number, number]> = [];
      let E = M + e * Math.sin(M) * 0.9;
      for (let i = 0; i < 5; i++) {
        const f = E - e * Math.sin(E) - M;
        steps.push([E, Math.abs(f)]);
        if (Math.abs(f) < 1e-12) break;
        E -= f / (1 - e * Math.cos(E));
      }
      const x = cx + A * Math.cos(E);
      const y = cy - B * Math.sin(E);
      pl.current?.setAttribute('cx', String(x));
      pl.current?.setAttribute('cy', String(y));
      gh.current?.setAttribute('cx', String(cx + A * Math.cos(M)));
      gh.current?.setAttribute('cy', String(cy - A * Math.sin(M)));
      li.current?.setAttribute('x2', String(x));
      li.current?.setAttribute('y2', String(y));
      ar.current?.setAttribute('d', `M${fx} ${cy}L${cx + A} ${cy}A${A} ${B} 0 ${E > Math.PI ? 1 : 0} 0 ${x} ${y}Z`);
      setRows(steps);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [live, B, fx]);
  return (
    <svg viewBox="0 0 680 430" role="img" aria-label="Kepler's equation solved live">
      <circle className="dd" cx={cx} cy={cy} r={A} />
      <path ref={ar} fill="var(--orange)" opacity="0.28" d="" />
      <ellipse className="d" cx={cx} cy={cy} rx={A} ry={B} />
      <line className="d2" x1={cx - A - 16} y1={cy} x2={cx + A + 16} y2={cy} />
      <line ref={li} className="d2" x1={fx} y1={cy} x2={cx + A} y2={cy} />
      <circle cx={fx} cy={cy} r="10" fill="var(--ink)" />
      <text x={fx - 14} y={cy + 26}>SUN</text>
      <circle ref={gh} className="d" cx={cx + A} cy={cy} r="7" strokeDasharray="3 3" fill="none" />
      <circle ref={pl} cx={cx + A} cy={cy} r="9" fill="var(--orange)" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={474} y={30}>DASHED GHOST</text>
      <text x={474} y={48}>time, at a steady pace (M)</text>
      <text x={474} y={74} style={{ fill: 'var(--orange-d)' }}>ORANGE PLANET</text>
      <text x={474} y={92} style={{ fill: 'var(--orange-d)' }}>where it really is (E)</text>
      <g transform="translate(474 150)">
        <text className="big" x="0" y="0">M = E − e sin E</text>
        <text x="0" y="28">NEWTON’S GUESSES</text>
        {rows.map(([E, f], i) => (
          <g key={i} transform={`translate(0 ${54 + i * 24})`}>
            <text x="0" y="0">{i}: E = {E.toFixed(6)}</text>
            <text x="134" y="0" style={{ fill: f < 1e-12 ? 'var(--green-d)' : 'var(--orange-d)' }}>{f < 1e-12 ? 'solved' : f.toExponential(0)}</text>
          </g>
        ))}
      </g>
    </svg>
  );
};

/** The three clocks, ticking. */
export const Clocks: React.FC = () => {
  const live = useContext(LiveContext);
  const [t, setT] = useState(() => Date.now());
  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setT(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [live]);
  const jd = t / 864e5 + 2440587.5;
  const rows: Array<[string, string]> = [
    ['UTC · your clock', new Date(t).toISOString().replace('T', ' ').slice(0, 19)],
    ['TDB · the planets’ clock', new Date(t + 69184).toISOString().replace('T', ' ').slice(0, 19)],
    ['Julian Date', jd.toFixed(5)],
    ['Days since J2000 (TDB)', (jd + 69.184 / 86400 - 2451545).toFixed(5)],
  ];
  return (
    <div className="board">
      {rows.map(([k, v]) => <div key={k}><span>{k}</span><b>{v}</b></div>)}
    </div>
  );
};

/** The six elements, drawn as an engineer would. */
export const ElementsPlate: React.FC = () => (
  <svg viewBox="0 0 680 370" role="img" aria-label="The six orbital elements on a tilted orbit">
    <ellipse className="dd a-d" cx="330" cy="205" rx="300" ry="96" />
    <g transform="rotate(-11 330 195)">
      <ellipse className="do a-d" cx="330" cy="190" rx="240" ry="118" />
      <line className="d2 a-d" x1="90" y1="190" x2="570" y2="190" />
    </g>
    <line className="d2 a-d" x1="42" y1="248" x2="622" y2="150" />
    <circle cx="396" cy="186" r="11" fill="var(--ink)" />
    <text x="388" y="214">SUN</text>
    <circle cx="178" cy="108" r="9" fill="var(--orange)" stroke="var(--ink)" strokeWidth="1.5" />
    <path className="d a-d" d="M560 168 a30 30 0 0 1 8 36" />
    {[
      [20, 40, 'a', 'how big: half the long axis'],
      [20, 64, 'e', 'how stretched: 0 is a circle'],
      [20, 88, 'i', 'how tilted from the ecliptic'],
      [390, 40, 'Ω', 'which way the tilt faces'],
      [390, 64, 'ω', 'where the closest point lies'],
      [390, 88, 'M', 'where the planet was at J2000'],
    ].map(([x, y, k, v]) => (
      <g key={String(k)}>
        <text className="big" x={Number(x)} y={Number(y)} style={{ fill: 'var(--orange-d)' }}>{k}</text>
        <text x={Number(x) + 26} y={Number(y)}>{v}</text>
      </g>
    ))}
    <text x="620" y="228" textAnchor="end">PLANE OF THE ECLIPTIC</text>
    <text x="52" y="270">LINE OF NODES</text>
  </svg>
);

/** Accuracy on a log axis, against sizes everyone knows. */
export const AccuracyPlate: React.FC = () => {
  const ax = (d: number) => 20 + ((Math.log10(d) + 2) / 3) * 640;
  const rows: Array<[string, number | null, number]> = [['8 planets', 0.05, 0.25], ['The Moon', 0.7, 2], ['Titan, 26.8 years out', null, 5]];
  return (
    <svg viewBox="0 0 680 240" role="img" aria-label="Accuracy on a logarithmic axis">
      {[[1 / 60, 'the eye’s limit, 1′'], [0.52, 'the full Moon'], [10, 'a fist at arm’s length']].map(([d, l]) => (
        <g key={String(l)}>
          <line className="dd" x1={ax(Number(d))} x2={ax(Number(d))} y1="26" y2="196" />
          <text className="big" x={ax(Number(d))} y="18" textAnchor={Number(d) > 5 ? 'end' : Number(d) < 0.1 ? 'start' : 'middle'} style={{ fontSize: 15 }}>{l}</text>
        </g>
      ))}
      {rows.map(([l, lo, hi], i) => {
        const y = 62 + i * 50;
        return (
          <g key={l}>
            <text x="110" y={y - 12}>{l}</text>
            <line className="d2" x1="20" x2="660" y1={y} y2={y} />
            {lo !== null && <rect className="a-g" x={ax(lo)} y={y - 5} width={ax(hi) - ax(lo)} height="10" fill="var(--orange)" />}
            <circle className="a-g" cx={ax(hi)} cy={y} r="8" fill="var(--ink)" />
          </g>
        );
      })}
      <line className="d" x1="20" x2="660" y1="200" y2="200" />
      {[0.01, 0.1, 1, 10].map((d) => <text key={d} x={ax(d)} y="220" textAnchor={d === 10 ? 'end' : d === 0.01 ? 'start' : 'middle'}>{d}°</text>)}
    </svg>
  );
};
