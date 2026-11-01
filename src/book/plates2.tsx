import React, { useEffect, useMemo, useRef, useState } from 'react';
import COMMITS from '../report/commits.json';
import { Vela } from './kit';

const base = import.meta.env.BASE_URL;

/** Moons are pushed out of their swollen parents: scale · min(d, 4R) + max(0, d − 4R). */
export const MoonPlate: React.FC = () => {
  const R = 6371;
  const D = 384400;
  const moved = (s: number) => s * Math.min(D, 4 * R) + Math.max(0, D - 4 * R);
  const k = 520 / 1.2e6; // px per km
  const x0 = 104;
  const row = (y: number, s: number, label: string) => {
    const md = moved(s);
    return (
      <g key={s}>
        <text x={s > 1 ? x0 + 104 : 10} y={s > 1 ? y - 74 : y - 30}>{label}</text>
        <circle className="a-g" cx={x0 + 4} cy={y} r={Math.max(2, R * s * k)} fill="var(--green)" stroke="var(--ink)" />
        <circle className="a-g" cx={x0 + md * k} cy={y} r={Math.max(1.6, 1737 * s * k)} fill="var(--ink)" />
        <line className="d2" x1={x0} x2={x0 + md * k} y1={y + 62} y2={y + 62} />
        <line className="d2" x1={x0 + md * k} x2={x0 + md * k} y1={y + 56} y2={y + 68} />
        <text x={x0 + (md * k) / 2} y={y + 56} textAnchor="middle">{Math.round(md).toLocaleString('en-US')} km</text>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 680 330" role="img" aria-label="The Earth and Moon at true size and at thirty times">
      {row(44, 1, 'TRUE SIZE: TWO SPECKS')}
      {row(214, 30, '30×: THE SOLARIS DEFAULT')}
    </svg>
  );
};

/** The same small orbit, stored from the Sun in 32-bit floats, and from the camera. */
export const FloatPlate: React.FC = () => {
  const paths = useMemo(() => {
    const D = 4.5e9;
    const O = 2000;
    let a = '';
    let b = '';
    const k = 110 / O;
    for (let i = 0; i <= 400; i++) {
      const t = (i / 400) * Math.PI * 2;
      const ox = O * Math.cos(t);
      const oy = O * Math.sin(t);
      const nx = Math.fround(Math.fround(D + ox) - Math.fround(D));
      const ny = Math.fround(Math.fround(D + oy) - Math.fround(D));
      a += `${i ? 'L' : 'M'}${(150 + nx * k).toFixed(1)} ${(140 - ny * k).toFixed(1)}`;
      b += `${i ? 'L' : 'M'}${(500 + ox * k).toFixed(1)} ${(140 - oy * k).toFixed(1)}`;
    }
    return [a, b];
  }, []);
  return (
    <svg viewBox="0 0 680 290" role="img" aria-label="A moon's orbit jittering in 32-bit floats, and smooth from a floating origin">
      <text x="150" y="16" textAnchor="middle">MEASURED FROM THE SUN</text>
      <text x="500" y="16" textAnchor="middle">MEASURED FROM THE CAMERA</text>
      <circle cx="150" cy="140" r="16" fill="var(--ink)" />
      <circle cx="500" cy="140" r="16" fill="var(--ink)" />
      <path className="do a-d" d={paths[0]} />
      <path className="dg a-d" d={paths[1]} />
      <text x="150" y="282" textAnchor="middle">the orbit snaps to a 512 km grid</text>
      <text x="500" y="282" textAnchor="middle">smooth, at every distance</text>
    </svg>
  );
};

/** A section through the sky, as an engineer draws a tunnel. */
export const ShellsPlate: React.FC = () => (
  <svg viewBox="0 0 680 280" role="img" aria-label="Section through the sky: shells of Gaia light around the Solar System">
    {[300, 214, 130].map((rx, i) => <ellipse key={rx} className={i === 0 ? 'd a-d' : 'd2 a-d'} cx="340" cy="150" rx={rx} ry={rx * 0.4} />)}
    <ellipse className="do a-d" cx="340" cy="150" rx="52" ry="20" />
    <circle cx="340" cy="150" r="5" fill="var(--orange)" />
    {Array.from({ length: 70 }, (_, i) => {
      const a = i * 2.399;
      const r = 40 + (i * 7) % 240;
      return <circle key={i} className="a-g" cx={340 + Math.cos(a) * r * 1.02} cy={150 + Math.sin(a) * r * 0.4} r={i % 5 === 0 ? 2 : 1.1} fill="var(--ink)" />;
    })}
    <line className="d2" x1="340" y1="150" x2="590" y2="34" />
    <text x="596" y="30" textAnchor="end">≈ 13,000 UNITS</text>
    <text x="20" y="24">THREE NESTED SHELLS OF GAIA LIGHT</text>
    <text x="20" y="42">54,000 STARS BETWEEN THEM</text>
    <text x="340" y="196" textAnchor="middle" style={{ fill: 'var(--orange-d)' }}>SOLAR SYSTEM</text>
    <text x="340" y="270" textAnchor="middle">SECTION A–A: FLATTENED ALONG THE GALACTIC PLANE. MOVE, AND THE SHELLS SLIDE PAST EACH OTHER.</text>
  </svg>
);

/** The Sun, cut away like a machine, with the six layers of its shader. */
export const SunPlate: React.FC<{ layers: string[] }> = ({ layers }) => {
  const r = 170;
  const cx = 214;
  const cy = 205;
  return (
    <svg viewBox="0 18 680 374" role="img" aria-label="Cutaway of the Sun's six shader layers">
      <circle className="d a-d" cx={cx} cy={cy} r={r} />
      {[0.8, 0.86, 0.92].map((k) => <circle key={k} className="d2 a-d" cx={cx} cy={cy} r={r * k} />)}
      <circle className="dd a-d" cx={cx} cy={cy} r={r * 1.1} />
      <path className="do a-d" d={`M${cx + r} ${cy - 40}C${cx + r + 46} ${cy - 110} ${cx + r - 10} ${cy - 150} ${cx + r * 0.72} ${cy - r * 0.72}`} />
      <path className="do a-d" d={`M${cx + r * 0.7} ${cy + r * 0.72}C${cx + r + 30} ${cy + 150} ${cx + r + 34} ${cy + 80} ${cx + r} ${cy + 46}`} />
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i / 60) * Math.PI * 2;
        return <line key={i} stroke="var(--ink)" strokeWidth="1" x1={cx + Math.cos(a) * r} y1={cy + Math.sin(a) * r} x2={cx + Math.cos(a) * (r + 6 + (i % 3) * 3)} y2={cy + Math.sin(a) * (r + 6 + (i % 3) * 3)} />;
      })}
      {layers.map((l, i) => {
        const y = 36 + i * 64;
        const a = -1 + i * 0.4;
        const px = cx + Math.cos(a) * r * (0.72 + i * 0.05);
        const py = cy + Math.sin(a) * r * (0.72 + i * 0.05);
        return (
          <g key={l}>
            <path className="d2 a-d" d={`M${px} ${py}L440 ${y}H456`} />
            <circle cx={px} cy={py} r="3.5" fill="var(--ink)" />
            <text className="big" x="462" y={y + 6} style={{ fontSize: 15.5 }}>{i + 1}. {l}</text>
          </g>
        );
      })}
    </svg>
  );
};

/** The tile pyramid, as stacked sheets. */
export const TilesPlate: React.FC = () => {
  const levels = [0, 1, 2, 3, 4];
  return (
    <svg viewBox="0 0 680 330" role="img" aria-label="A pyramid of map tiles, each level four times sharper">
      {levels.map((l) => {
        const n = 2 ** l;
        const y = 30 + l * 58;
        const w = 180 + l * 70;
        const cx = 260;
        const skew = 46;
        const cells: React.ReactNode[] = [];
        for (let i = 1; i < Math.min(n, 16); i++) {
          const t = i / n;
          cells.push(<line key={`a${i}`} className="d2" x1={cx - w / 2 + skew * t + w * t * 0} y1={y} x2={cx - w / 2 - skew + skew * 0 + w * t + skew} y2={y} />);
          cells.push(<line key={`b${i}`} className="d2" x1={cx - w / 2 + w * t + skew} y1={y} x2={cx - w / 2 + w * t} y2={y + 40} />);
          cells.push(<line key={`c${i}`} className="d2" x1={cx - w / 2 + skew * (1 - t)} y1={y + 40 * t} x2={cx + w / 2 + skew * (1 - t)} y2={y + 40 * t} />);
        }
        return (
          <g key={l}>
            <path d={`M${cx - w / 2 + skew} ${y}h${w}l${-skew} 40h${-w}z`} fill={l === 4 ? 'var(--orange)' : l === 3 ? 'var(--green)' : 'var(--paper)'} stroke="var(--ink)" strokeWidth="1.6" />
            {cells}
            <text x="520" y={y + 26}>LEVEL {l === 4 ? '13' : l}  ·  {l === 4 ? '≈ 9.5 m a pixel' : `${(4 ** l).toLocaleString('en-US')} tile${l ? 's' : ''}`}</text>
          </g>
        );
      })}
    </svg>
  );
};

/** Choosing where to stand. */
export const StandPlate: React.FC = () => (
  <svg viewBox="0 0 680 322" role="img" aria-label="How the standing point on a moon is chosen">
    <circle className="d a-d" cx="180" cy="196" r="96" />
    <circle className="d a-d" cx="540" cy="110" r="64" />
    <circle cx="36" cy="40" r="20" fill="var(--orange)" />
    <text x="62" y="44">SUN</text>
    <path className="d2 a-d" d="M180 196L246 126" />
    <path className="dd a-d" d="M246 126L480 118" />
    <path className="dd a-d" d="M246 126L56 48" />
    <path className="d a-d" d="M246 126L300 68" />
    <path className="do a-d" d="M288 80A62 62 0 0 1 306 124" />
    <circle cx="246" cy="126" r="6" fill="var(--orange)" stroke="var(--ink)" />
    <text x="256" y="148">YOU</text>
    <text x="304" y="62">ZENITH</text>
    <text x="316" y="100" style={{ fill: 'var(--orange-d)' }}>≈ 40° UP, ON THE LIT SIDE</text>
    <text x="180" y="316" textAnchor="middle">THE MOON YOU STAND ON</text>
    <text x="540" y="192" textAnchor="middle">ITS PLANET</text>
  </svg>
);

/** One bounce of light, and many. */
export const AirPlate: React.FC = () => (
  <svg viewBox="0 0 680 200" role="img" aria-label="Single scattering leaves twilight black; multiple scattering lights it">
    {[0, 1].map((k) => {
      const x = k * 346;
      return (
        <g key={k} transform={`translate(${x} 0)`}>
          <path className="d" d="M10 170Q165 120 320 170" />
          <path className="d2" d="M10 110Q165 60 320 110" />
          <circle cx="24" cy="66" r="12" fill="var(--orange)" />
          <circle cx="240" cy="147" r="5" fill="var(--ink)" />
          <path className="do a-d" d={k ? 'M34 72L120 96L176 84L206 112L240 142' : 'M34 72L200 84'} />
          <text x="160" y="196" textAnchor="middle">{k ? 'MANY BOUNCES: TWILIGHT GLOWS' : 'ONE BOUNCE: TWILIGHT GOES BLACK'}</text>
        </g>
      );
    })}
  </svg>
);

/** Light bent around the hole, which is why the disc shows above and below it. */
export const BendPlate: React.FC = () => (
  <svg viewBox="0 0 680 280" role="img" aria-label="Light paths bending around a black hole">
    <ellipse className="dd" cx="340" cy="150" rx="230" ry="26" />
    <circle cx="340" cy="150" r="58" fill="var(--paper)" stroke="var(--paper)" />
    <circle cx="340" cy="150" r="40" fill="var(--ink)" />
    <circle className="dd" cx="340" cy="150" r="60" />
    {[[-1, 96, 1], [-1, 72, 1], [1, 96, 0], [1, 72, 0]].map(([s, h, o], i) => (
      <path key={i} className={o ? 'do a-d' : 'dg a-d'} d={`M20 ${150 + s * 30}C200 ${150 + s * 30} ${250 + (o ? 20 : 0)} ${150 + s * h} 340 ${150 + s * h}S${500} ${150 + s * 26} 660 ${150 + s * 12}`} />
    ))}
    <text x="340" y="24" textAnchor="middle">NULL GEODESICS: LIGHT FROM THE FAR SIDE OF THE DISC COMES OVER THE TOP</text>
    <text x="30" y="270">TO THE VIEWER →</text>
    <text x="340" y="154" textAnchor="middle" style={{ fill: 'var(--paper)' }}>SHADOW</text>
  </svg>
);

/** A general arrangement drawing of Vela. */
export const VelaPlate: React.FC = () => (
  <div className="ga">
    <Vela eyes="open" mouth="smile" arms="down" size={276} still />
    <svg viewBox="0 0 330 290" aria-hidden className="ga-dim">
      <line className="d2" x1="10" x2="286" y1="272" y2="272" />
      <line className="d2" x1="10" x2="10" y1="262" y2="282" />
      <line className="d2" x1="286" x2="286" y1="262" y2="282" />
      <line className="d2" x1="300" x2="300" y1="0" y2="252" />
      <line className="d2" x1="290" x2="310" y1="0" y2="0" />
      <line className="d2" x1="290" x2="310" y1="252" y2="252" />
      <text x="148" y="288" textAnchor="middle">23 PIXELS</text>
      <text x="326" y="130" textAnchor="middle" transform="rotate(90 326 130)">21 PIXELS</text>
    </svg>
  </div>
);

/** One square, one recorded line. */
export const LineUnits: React.FC<{ rows: Array<[string, number]> }> = ({ rows }) => (
  <div className="units">
    {rows.map(([l, n], i) => (
      <div key={l} className={`u-row ${i === rows.length - 1 ? 'other' : ''}`}>
        <span>{l}</span>
        <div>{Array.from({ length: n }, (_, k) => <i key={k} className="a-g" />)}</div>
        <b>{n}</b>
      </div>
    ))}
  </div>
);

/** One real take: the recording decoded here, its waveform drawn, and a button to hear it. */
export const Take: React.FC = () => {
  const cv = useRef<HTMLCanvasElement>(null);
  const [info, setInfo] = useState('');
  const [on, setOn] = useState(false);
  const au = useRef<HTMLAudioElement | null>(null);
  const url = `${base}voice/vela/joke.2.mp3`;
  useEffect(() => {
    let dead = false;
    const AC = window.AudioContext;
    const ctx = new AC();
    fetch(url).then((r) => r.arrayBuffer()).then((b) => ctx.decodeAudioData(b)).then((buf) => {
      if (dead || !cv.current) return;
      const d = buf.getChannelData(0);
      const c = cv.current;
      c.width = c.clientWidth * 2;
      c.height = c.clientHeight * 2;
      const g = c.getContext('2d')!;
      const N = 150;
      const step = Math.floor(d.length / N);
      let pk = 0;
      const p: number[] = [];
      for (let i = 0; i < N; i++) { let m = 0; for (let j = i * step; j < (i + 1) * step; j++) m = Math.max(m, Math.abs(d[j])); p.push(m); pk = Math.max(pk, m); }
      g.fillStyle = '#15120e';
      p.forEach((v, i) => { const h = Math.max(3, (v / pk) * c.height * 0.94); g.fillRect((i / N) * c.width, (c.height - h) / 2, (c.width / N) * 0.62, h); });
      setInfo(`${buf.duration.toFixed(2)} s · peak ${(20 * Math.log10(pk)).toFixed(1)} dBFS, measured just now in your browser`);
    }).catch(() => {});
    return () => { dead = true; au.current?.pause(); ctx.close().catch(() => {}); };
  }, [url]);
  const play = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (on) { au.current?.pause(); setOn(false); return; }
    const a = au.current ?? new Audio(url);
    au.current = a;
    a.currentTime = 0;
    a.onended = () => setOn(false);
    a.play().catch(() => {});
    setOn(true);
  };
  return (
    <div className="take">
      <button type="button" onClick={play} aria-label={on ? 'Stop' : 'Play Vela’s recording'}>{on ? '❚❚' : '▶'}</button>
      <div>
        <p>“How do you organise a party in space? You planet. <em>[laugh]</em> Sorry, I’ve been alone out here a long time.”</p>
        <canvas ref={cv} aria-label="Waveform of the recording" />
        <small>joke.2.mp3 · {info}</small>
      </div>
    </div>
  );
};

/** Real time per frame varies; the time the page is told never does. */
export const ClockPlate: React.FC = () => {
  const frames = [0.31, 0.42, 0.27, 0.55, 0.38, 0.29, 0.61, 0.33, 0.44, 0.36];
  let x = 96;
  let v = 96;
  return (
    <svg viewBox="0 0 680 190" role="img" aria-label="Real time versus the virtual clock">
      <text x="0" y="52">REAL TIME</text>
      <text x="0" y="132">FILM TIME</text>
      {frames.map((f, i) => {
        const w = f * 133;
        const el = <rect key={i} className="a-g" x={x} y={32} width={w - 3} height={30} fill="var(--orange)" />;
        x += w;
        return el;
      })}
      {frames.map((_, i) => {
        const el = <rect key={i} className="a-g" x={v} y={112} width={55} height={30} fill="var(--green)" />;
        v += 58;
        return el;
      })}
      <text x="96" y="84">each frame took 0.2–0.6 s to draw on the graphics card…</text>
      <text x="96" y="164">…but the page was told exactly 1/30 s had passed, every time.</text>
    </svg>
  );
};

/** Every commit. */
export const CommitPlate: React.FC = () => {
  const rows = COMMITS as Array<{ t: string; s: string }>;
  const t0 = Date.parse('2026-10-13T00:00:00+05:30');
  const span = 5 * 86400000;
  const lanes: number[] = [];
  return (
    <svg viewBox="0 0 680 210" role="img" aria-label="Forty-six commits over five days">
      {[0, 1, 2, 3, 4].map((d) => (
        <g key={d}>
          <line className="d2" x1={10 + d * 132} x2={10 + d * 132} y1="168" y2="178" />
          <text x={14 + d * 132} y="196">{13 + d} Oct</text>
        </g>
      ))}
      <line className="d" x1="10" x2="670" y1="168" y2="168" />
      {rows.map((c, i) => {
        const x = Math.max(0, Math.min(1, (Date.parse(c.t) - t0) / span));
        let lane = 0;
        while (lanes[lane] !== undefined && x - lanes[lane] < 0.016) lane++;
        lanes[lane] = x;
        const big = /^feat/.test(c.s);
        return <circle key={i} className="a-g" cx={10 + x * 660} cy={154 - lane * 16} r={big ? 7 : 4.5} fill={big ? 'var(--orange)' : 'var(--ink)'} />;
      })}
    </svg>
  );
};
