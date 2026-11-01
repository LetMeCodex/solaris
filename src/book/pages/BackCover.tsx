import React, { useContext, useEffect, useRef, useState } from 'react';
import { Arrow, Ink, LiveContext, Say, Vela } from '../kit';

const base = import.meta.env.BASE_URL;

/** Fraunhofer's lines: wavelength in nm, what made it, drawn width in px, and whether it is Earth's air and not the Sun. */
const LINES: Array<[number, string, number, boolean?]> = [
  [393.366, 'Calcium', 15], [396.847, 'Calcium', 13], [404.58, 'Iron', 3], [406.36, 'Iron', 2], [407.17, 'Iron', 3], [410.175, 'Hydrogen', 7],
  [422.67, 'Calcium', 5], [425.01, 'Iron', 2], [426.05, 'Iron', 3], [427.18, 'Iron', 3], [430.79, 'Iron', 6], [432.58, 'Iron', 3], [434.047, 'Hydrogen', 8],
  [438.355, 'Iron', 4], [440.48, 'Iron', 3], [441.51, 'Iron', 2], [445.48, 'Calcium', 2], [455.4, 'Barium', 3], [466.814, 'Iron', 3],
  [486.134, 'Hydrogen', 11], [489.15, 'Iron', 2], [492.05, 'Iron', 3], [495.761, 'Iron', 3], [501.21, 'Iron', 2],
  [516.733, 'Magnesium', 4], [517.27, 'Magnesium', 5], [518.362, 'Magnesium', 6], [522.72, 'Iron', 2], [527.039, 'Iron', 4], [532.8, 'Iron', 3],
  [537.15, 'Iron', 2], [539.71, 'Iron', 2], [540.58, 'Iron', 2], [544.69, 'Iron', 2], [561.56, 'Iron', 2], [585.75, 'Calcium', 2],
  [588.995, 'Sodium', 6], [589.592, 'Sodium', 6], [612.22, 'Calcium', 2], [616.22, 'Calcium', 2], [643.91, 'Calcium', 2], [649.96, 'Calcium', 2], [656.281, 'Hydrogen', 14],
  [686.719, 'Oxygen', 7, true], [688.4, 'Oxygen', 3, true], [690.2, 'Oxygen', 2, true], [691.9, 'Oxygen', 2, true],
  [759.37, 'Oxygen', 10, true], [761.3, 'Oxygen', 3, true], [763.2, 'Oxygen', 3, true], [765.2, 'Oxygen', 2, true],
];
const GUARDS = [393.366, 588.995, 759.37];
const TAGS: Array<[string, number, number, boolean?]> = [
  ['O₂', 759.37, 34, true], ['O₂', 686.719, 92, true], ['H', 656.281, 24], ['Na', 589.3, 110], ['Mg', 517.8, 30], ['H', 486.134, 104], ['Fe', 430.79, 26], ['Ca', 395.1, 92],
];
const CODE = [759, 687, 656, 589, 518, 486, 434, 395];
const RED = 780;
const VIOLET = 380;
const at = (nm: number) => (RED - nm) / (RED - VIOLET);
const nearest = (nm: number) => LINES.reduce<(typeof LINES)[number] | null>((b, l) => (Math.abs(l[0] - nm) < (b ? Math.abs(b[0] - nm) : 3) ? l : b), null);

/** The scanner: it sweeps by itself, and follows the pointer when there is one. */
const useScan = () => {
  const live = useContext(LiveContext);
  const [nm, setNm] = useState(656.281);
  const beam = useRef<HTMLDivElement>(null);
  const hand = useRef({ p: 0, until: 0 });
  const show = (p: number) => {
    if (beam.current) beam.current.style.left = `${(p * 100).toFixed(2)}%`;
    const was = RED - p * (RED - VIOLET);
    const hit = nearest(was);
    setNm(hit ? hit[0] : Math.round(was));
  };
  useEffect(() => {
    if (!live || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let id = 0;
    const tick = (t: number) => {
      id = requestAnimationFrame(tick);
      show(performance.now() < hand.current.until ? hand.current.p : 0.5 - 0.5 * Math.cos((t / 16000) * Math.PI * 2));
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [live]);
  const point = (e: React.PointerEvent<HTMLDivElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    hand.current = { p: Math.min(1, Math.max(0, (e.clientX - b.left) / b.width)), until: performance.now() + 2600 };
    show(hand.current.p);
  };
  return { nm, beam, point };
};

export const BackCover: React.FC = () => {
  const { nm, beam, point } = useScan();
  const line = LINES.find((l) => l[0] === nm);
  return (
    <div className="bc" onPointerMove={point}>
      <div className="cv2-top"><span>Printed by the Sun</span><b className="bc-name">SOLARIS</b><span>Read by you</span></div>
      <div className="bc-field">
        <div className="bc-sky"><Ink src={{ kind: 'image', url: `${base}book/spectrum.webp` }} look="dots" spot="both" cell={4.5} gain={1.55} drift={0} alt="Sunlight spread into its colours, from red to violet" /></div>
        <svg className="bc-bars" viewBox="0 0 760 100" preserveAspectRatio="none" role="img" aria-label="The dark absorption lines of the Sun's spectrum, drawn as a barcode">
          {LINES.map(([n, , w]) => <rect key={n} x={at(n) * 760 - (w * 0.7 + 0.8)} y={0} width={w * 1.4 + 1.6} height={GUARDS.includes(n) ? 95.6 : 93.4} />)}
        </svg>
        <div className="bc-code" aria-hidden="true">{CODE.map((c) => <span key={c} style={{ left: `${at(c === 395 ? 395.1 : c) * 100}%` }}>{c}</span>)}</div>
        {TAGS.map(([t, n, y, ours]) => (
          <i key={`${t}${n}`} className={`bc-tag ${ours ? 'ours' : ''} ${(ours ? nm >= n - 3 && nm < n + 8 : Math.abs(n - nm) < 3) ? 'on' : ''}`} style={{ left: `${at(n) * 100}%`, top: y }}>{t}</i>
        ))}
        <div className="bc-beam" ref={beam}><span className={at(nm) > 0.62 ? 'flip' : ''}>{line ? `${line[1]} · ${nm.toFixed(2)} nm · ${line[3] ? 'your air' : 'the Sun'}` : `${nm} nm`}</span></div>
      </div>
      <Arrow x={96} y={262} len={150} rot={286} />
      <Say x={30} y={352} w={318} tail="sw">Those first two <b>aren’t the Sun’s.</b> That’s oxygen, in the air you’re breathing. You’re in the barcode too.</Say>
      <Vela eyes="happy" mouth="grin" arms="up" size={112} x={44} y={512} />
      <div className="bc-blurb">
        <p><b>This barcode was printed by the Sun.</b> Spread sunlight out and dark lines appear. Each one is an element in the Sun’s atmosphere, taking one exact colour as the light leaves. It is how we know what stars are made of without touching one. Fraunhofer mapped over 570 of them in 1814.</p>
        <small>Positions are real. Widths are exaggerated so you can see them.</small>
      </div>
      <div className="obi">
        <div className="obi-t">
          <h2>“I’ll keep the Sun on for you. <em>Always.</em>”</h2>
          <p>Vela, at 100%. Made by Anish Jha · solarises.vercel.app</p>
        </div>
        <div className="obi-free"><span>100%</span><small>explored</small></div>
      </div>
    </div>
  );
};
