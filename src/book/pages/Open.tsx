import React, { useContext, useEffect, useRef } from 'react';
import { Arrow, Band, Cap, Clip, GoContext, Grid, Ink, Lines, Note, P, Roundel, Say, Sfx, Tate, Txt, Vela } from '../kit';
import { NUMBERS, type PageDef } from './registry';

const Cover: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  // the cover is built in layers, and they part slightly as the pointer moves
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      el.style.setProperty('--mx', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
      el.style.setProperty('--my', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);
  return (
    <div className="cv2" ref={ref}>
      <div className="cv2-top"><span>N° 1</span><span>Volume One · Printed in two inks</span><span>Free, as the stars require</span></div>
      <div className="dep1 cv2-burst"><Lines cx={50} cy={44} inner={30} n={110} opacity={0.85} /></div>
      <div className="dep2 cv2-sat"><Ink src={{ kind: 'globe', map: '2k_saturn.jpg', tilt: -0.32, ring: true, spin: 0.5, phase: 1.2 }} look="dots" spot="orange" cell={6} gain={1.75} alt="Saturn, printed in halftone, turning" /></div>
      <div className="cv2-mast"><span>SOLARIS</span></div>
      <div className="dep3 cv2-sat"><Ink src={{ kind: 'globe', map: '2k_saturn.jpg', tilt: -0.32, ring: 'front', spin: 0.5, phase: 1.2 }} look="dots" spot="orange" cell={6} gain={1.75} alt="" /></div>
      <Tate r={20} y={262} size={70} color="var(--orange)">ソラリス</Tate>
      <Sfx jp="ゴゴゴゴ" en="GO-GO-GO · SOMETHING VERY LARGE" x={30} y={262} size={46} rot={-6} tone="green" />
      <div className="dep4 cv2-vela">
        <Vela eyes="happy" mouth="grin" arms="wave1" size={132} x={0} y={0} />
      </div>
      <Say x={26} y={400} w={236} tail="se">Everything here is real. <b>Almost.</b> I’ll tell you where it isn’t.</Say>
      <div className="cv2-sub"><em>The Illustrated</em><br /><em>Catalogue</em></div>
      <Arrow r={34} y={680} len={170} rot={196} />
      <div className="cv2-note">Saturn, as it is on the day you open this book</div>
      <div className="obi">
        <div className="obi-t">
          <h2>You have never seen the sky as it is <em>now.</em></h2>
          <p>478 worlds · 12,596 real stars · 30 sources · 14 bugs, all confessed · one small guide who is afraid of the dark</p>
        </div>
        <div className="obi-free"><span>FREE</span><small>for ever</small></div>
      </div>
    </div>
  );
};

const HowTo: React.FC = () => (
  <>
    <Band tone="orange" size={38}>How to read this book</Band>
    <Txt cols={2}>
      <p>This book is the whole of Solaris on paper: where every number comes from, how each part is computed and drawn, what broke, and who is owed thanks. It is also a story, about a small guide and one question she cannot stop asking.</p>
      <p>The moving panels are not films of a printed page. They are Solaris’s own footage and real planetary maps, pulled through a small press running in your browser, in eight different ways of laying ink on paper. Leave a page open and it keeps printing.</p>
    </Txt>
    <div className="howkeys">
      <div className="key2">
        <h3>Turning the pages</h3>
        <div><Roundel dir={90} size={34} /><span><b>Scroll</b> and the page turns under your hand</span></div>
        <div><Roundel dir={0} size={34} /><span>Right arrow, space, or the right edge</span></div>
        <div><Roundel dir={180} size={34} /><span>Left arrow, or the left edge</span></div>
        <div><Roundel dir={270} size={34} /><span>The Metro line under the book jumps chapters</span></div>
        <div><b className="kk">S</b><span>Read it all as one long scroll instead</span></div>
        <div><b className="kk">F</b><span>Fullscreen, which is how a book should be read</span></div>
      </div>
      <div className="key2">
        <h3>Sound effects</h3>
        <p className="sfxk"><b>ゴゴゴ</b> go-go-go, a looming presence</p>
        <p className="sfxk"><b>ドーン</b> dōn, a heavy arrival</p>
        <p className="sfxk"><b>シーン</b> shīn, the sound of silence</p>
        <p className="sfxk"><b>ビュン</b> byun, something fast going past</p>
        <p className="sfxk"><b>ガーン</b> gān, the shock of bad news</p>
        <p className="sfxk"><b>カチッ</b> kachi, a small click</p>
        <h3 style={{ marginTop: 10 }}>Numbers in brackets</h3>
        <p className="sfxk" style={{ fontFamily: 'var(--text)' }}>A mark like<sup className="cite">[8]</sup> points to the Bibliography.</p>
      </div>
    </div>
    <Note n="0" rot={-1}>I have written notes in the margins. They are not scientific. Please read them anyway. I worked very hard on them.</Note>
    <Vela eyes="open" mouth="smile" arms="point" costume="glasses" size={92} r={44} b={132} />
  </>
);

const Title: React.FC = () => (
  <div className="title">
    <svg viewBox="0 0 680 330" className="tt-draw" role="img" aria-label="Three-view drawing of the Solar System, plan and elevation">
      {[34, 58, 78, 104, 170, 214, 262, 300].map((r) => <ellipse key={r} className="d2 a-d" cx="340" cy="150" rx={r} ry={r * 0.42} />)}
      <circle className="d" cx="340" cy="150" r="13" />
      <circle cx="340" cy="150" r="5" fill="var(--ink)" />
      <line className="dd a-d" x1="10" y1="150" x2="670" y2="150" />
      <line className="dd a-d" x1="340" y1="6" x2="340" y2="294" />
      <circle cx="510" cy="150" r="9" fill="var(--ink)" />
      <circle cx="554" cy="150" r="7.5" fill="var(--ink)" />
      <ellipse className="d2" cx="554" cy="150" rx="15" ry="4" />
      <text x="346" y="24">NORTH ECLIPTIC POLE</text>
      <text x="14" y="142">VERNAL EQUINOX</text>
      <text x="340" y="322" textAnchor="middle">GENERAL ARRANGEMENT · LOG DISTANCES · NOT TO SCALE, FOR REASONS GIVEN IN CHAPTER 2</text>
    </svg>
    <div style={{ textAlign: 'center' }}><Band size={92}>SOLARIS</Band></div>
    <div className="tt-txt a-f">
      <p>A real-time model of the Solar System and the Milky Way, which runs in a web browser. Every planet, moon and small body is placed from published <b>NASA JPL</b> orbital elements for the current moment, turned by the <b>International Astronomical Union’s</b> rotation models, and set against the real sky of 12,596 <b>Hipparcos</b> stars and the <b>Gaia</b> Milky Way.</p>
      <p>You may stand on any of them and look up, fly out to photographed nebulae, and fall towards the black hole at the centre of the galaxy. A companion, Vela, guides you in her own recorded voice. <b>Entièrement réel</b>: wholly real, except where the book says otherwise.</p>
    </div>
    <div style={{ textAlign: 'center' }}><Band size={34}>THE ILLUSTRATED CATALOGUE</Band></div>
    <div className="tt-imp a-f">
      <span>Volume One, November 2026</span>
      <span>Made by Anish Jha</span>
      <span>solarises.vercel.app</span>
    </div>
  </div>
);

const STATIONS: Array<[string, string, string]> = [
  ['01', 'Where everything is', 'c1'], ['02', 'Scale and precision', 'c2'], ['03', 'Stars and the galaxy', 'c3'], ['04', 'The Sun', 'c4'],
  ['05', 'Surface imagery', 'c5'], ['06', 'Other skies', 'c6'], ['07', 'Nebulae', 'c7'], ['08', 'Sagittarius A*', 'c8'],
  ['09', 'Vela', 'c9'], ['10', 'The soundtrack', 'c10'], ['11', 'The interface', 'c11'], ['12', 'The launch film', 'c12'],
  ['13', 'What broke', 'c13'], ['14', 'Build log', 'c14'], ['15', 'Every source', 'c15'], ['16', 'What isn’t real', 'c16'],
];
const NOTES: Record<string, string> = {
  c1: 'Six numbers per planet, and Kepler’s equation', c2: 'Why worlds are enlarged, and how a universe moves', c3: 'Hipparcos, Gaia, and a galaxy nobody has seen', c4: 'A star with no picture',
  c5: 'From a planet to ten metres a pixel', c6: 'Standing on worlds, under true skies', c7: 'Flying into a photograph', c8: 'The heart of the galaxy, and the thing she fears',
  c9: 'A guide with a borrowed voice', c10: 'A song for every world', c11: 'An observatory, not a game', c12: 'Filming a website, frame by frame',
  c13: 'Fourteen real bugs', c14: 'Five days, forty-six commits', c15: 'The papers, the data, the licences', c16: 'Where Solaris cheats, and what built it',
};

const Station: React.FC<{ s: [string, string, string]; x: number; y: number }> = ({ s, x, y }) => {
  const go = useContext(GoContext);
  return (
    <button type="button" className="st a-f" style={{ left: x, top: y }} onClick={(e) => { e.stopPropagation(); go(s[2]); }} aria-label={`Chapter ${s[0]}: ${s[1]}`}>
      <i />
      <span>{s[1]}</span>
    </button>
  );
};

const Contents: React.FC<{ part: 0 | 1 }> = ({ part }) => {
  const list = STATIONS.slice(part * 8, part * 8 + 8);
  const go = useContext(GoContext);
  // the line runs off one page and on to the next at the same height
  const line = part === 0 ? 'M0 300H112L212 200H660L760 300' : 'M0 300H100L200 200H648L748 300';
  const xs = part === 0 ? [44, 196, 260, 332, 404, 476, 548, 620] : [68, 184, 248, 320, 392, 464, 536, 608];
  const ys = [300, 216, 200, 200, 200, 200, 200, 200];
  return (
    <>
      {part === 0 ? <div className="ct-h a-f"><Roundel dir={0} size={56} /><h2>Contents</h2><span>Line 1</span></div> : <div className="ct-h a-f"><h2>Sesto Solare</h2><span>direction</span><Roundel dir={0} size={56} /></div>}
      <div className="ct-map">
        <svg viewBox="0 0 760 340" aria-hidden><path className="a-d" d={line} fill="none" stroke="var(--orange)" strokeWidth="20" strokeLinejoin="round" /></svg>
        {list.map((s, i) => <Station key={s[0]} s={s} x={xs[i]} y={ys[i]} />)}
      </div>
      <div className="ct-list">
        {list.map((s) => (
          <button key={s[0]} type="button" className="ct-row a-f" onClick={(e) => { e.stopPropagation(); go(s[2]); }}>
            <b>{s[0]}</b>
            <span><strong>{s[1]}</strong><em>{NOTES[s[2]]}</em></span>
            <i>{NUMBERS.get(s[2])}</i>
          </button>
        ))}
      </div>
    </>
  );
};

/** 01:38. An empty folder. */
const Midnight: React.FC = () => (
  <>
    <div className="flap a-f"><span>0</span><span>1</span><i>:</i><span>3</span><span>8</span></div>
    <p className="night-l a-f">13 October 2026. Everyone sensible is asleep.</p>
    <div className="term a-f">
      <p><span>$</span> mkdir solaris</p>
      <p><span>$</span> git commit -m “initial release of SOLARIS”</p>
      <p className="dim">The planets: not yet. The stars: not yet. Me: definitely not yet.</p>
      <p><span>$</span> <i className="cur" /></p>
    </div>
    <p className="night-b a-f">Before there was a universe,<br />there was an empty folder.</p>
    <p className="night-s a-f">It is a strange thing to decide, at that hour: to take the whole sky, and start typing.</p>
    <Sfx jp="カチッ" en="KACHI · A KEY IS PRESSED" r={40} b={64} size={46} rot={-5} tone="orange" />
  </>
);

/** She wakes, in three small panels. */
const Wakes: React.FC = () => (
  <Grid cols="1fr 1fr 1fr" rows="440px 150px 1fr">
    <P c="span 3" ar="4 / 3" shape="a">
      <Clip name="sun" look="wood" spot="orange" cell={7} gain={1} x={0.5} zoom={1.1} alt="The Sun, cut as a woodblock" />
      <Sfx jp="ドーン" en="DŌN" r={24} y={18} size={96} rot={6} tone="ink" />
      <Cap x={16} y={16} w={260} tone="paper">The first thing it drew was the Sun.</Cap>
    </P>
    <P tone="ink" ar="1 / 1"><Vela eyes="closed" mouth="flat" size={92} x={70} y={32} still /></P>
    <P tone="ink" ar="1 / 1"><Vela eyes="blink" mouth="flat" size={92} x={70} y={32} still /><Say r={8} y={6} w={84} tail="none">…?</Say></P>
    <P tone="ink" ar="1 / 1"><Lines tone="#ece1ca" inner={20} n={50} seed={7} /><Vela eyes="wide" mouth="o" arms="up" size={92} x={70} y={32} still /></P>
    <P c="span 3" tone="green" ar="16 / 8">
      <Vela eyes="happy" mouth="grin" arms="wave1" size={170} x={30} b={16} />
      <Say x={226} y={18} w={430} tail="sw" shout>Oh! Oh! You opened it! Hi!</Say>
      <Say r={22} b={18} w={420} tail="nw">I’m Vela. I’m the part of this that talks. I live in a Solar System where <b>everything is where it really is, right now.</b></Say>
    </P>
  </Grid>
);

const Question: React.FC = () => (
  <Grid cols="1fr 1fr" rows="196px 470px 1fr">
    <P c="span 2" tone="orange" ar="16 / 6">
      <Sfx jp="シーン" en="SHĪN" r={22} y={14} size={42} rot={4} tone="paper" />
      <div className="bigq a-f">Where is Mars right now?</div>
    </P>
    <P c="span 2" ar="16 / 10" shape="b">
      <Clip name="sky_phobos_rise" look="hatch" spot="orange" cell={6} gain={1.15} edge={0.9} zoom={1.15} x={0.5} y={0.42} alt="Mars rising, seen from Phobos" />
      <Cap r={14} b={14} w={300}>Go on. Point at it. Somewhere through your ceiling, it is really there.</Cap>
    </P>
    <P ar="4 / 3" tone="paper">
      <Vela eyes="squint" mouth="smile" arms="point" costume="glasses" size={118} x={16} b={12} />
      <Say r={10} y={12} w={196} tail="sw">Good. Now the bad news.</Say>
    </P>
    <P ar="4 / 3" tone="ink">
      <Lines tone="#ece1ca" inner={26} n={60} seed={3} />
      <Sfx jp="ガーン" en="GĀN" x={40} y={40} size={84} rot={-8} tone="orange" />
      <Say r={12} b={14} w={254} tail="none" shout>You’re not wrong. You’re late.</Say>
    </P>
  </Grid>
);

/** The thesis of the whole book. */
const Late: React.FC = () => (
  <>
    <div className="lates">
      <div className="late a-p">
        <Clip name="sun" look="stipple" spot="orange" cell={5} gain={1.05} alt="The Sun" />
        <b>8 min 19 s</b><span>ago</span><em>The Sun</em>
      </div>
      <div className="late a-p">
        <Clip name="saturn" look="rings" spot="orange" cell={7} gain={1.1} fx={0.45} fy={0.55} zoom={1.3} alt="Saturn" />
        <b>1 h 19 min</b><span>ago</span><em>Saturn</em>
      </div>
      <div className="late a-p">
        <Clip name="triton_neptune" look="rays" spot="green" cell={6} gain={1.15} fx={0.5} fy={0.5} alt="Neptune from Triton" />
        <b>4 h 10 min</b><span>ago</span><em>Neptune</em>
      </div>
    </div>
    <p className="thesis a-f">Light is the fastest thing there is, and it is still late. You have never seen the sky. You have only ever read its post.</p>
    <Txt cols={2}>
      <p>No telescope, anywhere, has ever shown every planet as it is <i>now</i>. Each one arrives from a different hour of the past. There is no window you could stand at to see them all at once.</p>
      <p>There is exactly one place where the whole Solar System is “now” at the same moment: inside a calculation. That is what Solaris is. This book is about that calculation, and the small guide who lives in it.</p>
    </Txt>
    <Note n="1" rot={0.7}>So I have a job I can’t actually do. I show people “now”. Nobody has ever seen it. Not even me. I just work it out, and hope.</Note>
  </>
);

export const OPEN: PageDef[] = [
  { id: 'cover', node: <Cover />, folio: false, stop: 'Cover' },
  { id: 'howto', node: <HowTo />, tab: 'The Catalogue', folio: false },
  { id: 'title', node: <Title />, folio: false },
  { id: 'contents-a', node: <Contents part={0} />, tab: 'Contents', stop: 'Contents' },
  { id: 'contents-b', node: <Contents part={1} />, tab: 'Contents' },
  { id: 'pro-1', node: <Midnight />, tab: 'Prologue', ground: 'ink', stop: 'Prologue' },
  { id: 'pro-2', node: <Wakes />, tab: 'Prologue' },
  { id: 'pro-3', node: <Question />, tab: 'Prologue' },
  { id: 'pro-4', node: <Late />, tab: 'Prologue' },
];
