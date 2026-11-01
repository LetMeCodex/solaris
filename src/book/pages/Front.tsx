import React, { useContext } from 'react';
import { Arrow, Band, Cap, Clip, GoContext, Grid, Ink, Lines, P, Roundel, Say, Sfx, Txt, Vela } from '../kit';
import { NUMBERS, type PageDef } from './registry';

const Cover: React.FC = () => (
  <div className="cover">
    <div className="cv-top a-f"><span>N° 1</span><span>Volume One · Printed in two inks</span><span>Free, as the stars require</span></div>
    <Band size={124}>SOLARIS</Band>
    <div className="cv-sub a-f">The Illustrated Catalogue</div>
    <div className="cv-art">
      <Lines cx={50} cy={46} inner={38} n={90} opacity={0.9} />
      <Ink src={{ kind: 'globe', map: '2k_saturn.jpg', tilt: -0.32, ring: true, spin: 0.5 }} spot="orange" cell={6} gain={1.8} alt="Saturn, printed in halftone, turning" />
      <Sfx jp="ゴゴゴゴ" en="GO-GO-GO · THE SOUND OF SOMETHING VERY LARGE" x={18} y={22} size={58} rot={-7} tone="orange" />
      <Vela eyes="happy" mouth="grin" arms="wave1" size={150} x={14} b={6} />
      <Say x={148} b={118} w={250} tail="sw">Every world. Every source. Every bug. <b>I counted.</b></Say>
      <Arrow r={30} y={120} len={190} rot={156} />
      <div className="cv-note a-f">Saturn, as it is on the day you open this book</div>
    </div>
    <div className="cv-foot a-f">
      <Roundel dir={0} size={40} />
      <span>How a real-time Solar System was made, with every research paper behind it. Explained by Vela.</span>
    </div>
  </div>
);

const HowTo: React.FC = () => (
  <>
    <Band tone="orange" size={38}>How to read this book</Band>
    <Grid cols="1fr 1fr" rows="auto 1fr" style={{ gap: 16 }}>
      <P c="span 2" bare ar="auto" className="flow" style={{ position: 'relative' }}>
        <Txt cols={2}>
          <p>This book is the whole of Solaris on paper: where every number comes from, how each part is computed and drawn, what broke, and who is owed thanks. Nothing has been left out because it was difficult, and nothing has been made up because it was easier.</p>
          <p>The moving panels are not films of a printed page. They are Solaris’s own footage and real planetary maps, screened live into two inks by a small press running in your browser. Leave a page open and it keeps printing.</p>
        </Txt>
      </P>
      <P ar="1 / 1" bare>
        <div className="key">
          <h3>Turning the pages</h3>
          <div><Roundel dir={0} size={34} /><span>Right arrow, space, or the right edge of the page</span></div>
          <div><Roundel dir={180} size={34} /><span>Left arrow, or the left edge</span></div>
          <div><Roundel dir={90} size={34} /><span>The Metro line under the book jumps between chapters</span></div>
          <div className="k2"><b>F</b><span>Fullscreen, which is how a book should be read</span></div>
        </div>
      </P>
      <P ar="1 / 1" bare>
        <div className="key">
          <h3>Sound effects</h3>
          <p className="sfxk"><b>ゴゴゴ</b> go-go-go, a looming presence</p>
          <p className="sfxk"><b>ドーン</b> dōn, a heavy arrival</p>
          <p className="sfxk"><b>シーン</b> shīn, the sound of silence</p>
          <p className="sfxk"><b>ビュン</b> byun, something fast going past</p>
          <p className="sfxk"><b>ガーン</b> gān, the shock of bad news</p>
          <p className="sfxk"><b>カチッ</b> kachi, a small click</p>
          <h3 style={{ marginTop: 12 }}>Numbers in brackets</h3>
          <p className="sfxk" style={{ fontFamily: 'var(--text)' }}>A mark like<sup className="cite">[8]</sup> points to the Bibliography, where each source is listed with its licence.</p>
        </div>
      </P>
    </Grid>
    <Vela eyes="open" mouth="smile" arms="point" costume="glasses" size={96} r={44} b={46} />
  </>
);

const Title: React.FC = () => (
  <div className="title">
    <svg viewBox="0 0 680 330" className="tt-draw" role="img" aria-label="Three-view drawing of the Solar System, plan and elevation">
      <g className="a-d-wrap">
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
      </g>
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
      <span>Made from the running site at solarises.vercel.app</span>
      <span>Words checked against the source code</span>
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
  c5: 'From a planet to ten metres a pixel', c6: 'Standing on worlds, under true skies', c7: 'Flying into a photograph', c8: 'The heart of the galaxy',
  c9: 'A guide with an hour of voice', c10: 'A song for every world', c11: 'An observatory, not a game', c12: 'Filming a website, frame by frame',
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
  const ys = part === 0 ? [300, 216, 200, 200, 200, 200, 200, 200] : [300, 216, 200, 200, 200, 200, 200, 200];
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

const Pro1: React.FC = () => (
  <Grid cols="1fr 1fr 1fr" rows="330px 250px 1fr">
    <P c="span 3" tone="ink" ar="16 / 9">
      <Clip name="sun" spot="orange" cell={6} gain={1.1} alt="The surface of the Sun, moving" />
      <Sfx jp="ドーン" en="DŌN" r={22} y={18} size={92} rot={6} tone="paper" />
      <Cap x={14} y={14} w={290} tone="paper">8 minutes and 19 seconds ago, the light on your face left this.</Cap>
    </P>
    <P c="span 2" shape="c" ar="16 / 9" tone="paper">
      <Lines cx={46} cy={50} inner={40} n={60} seed={4} opacity={0.5} />
      <Ink src={{ kind: 'globe', map: '2k_earth_daymap.jpg', spin: 0.4, tilt: 0.41 }} spot="green" cell={5} gain={1.9} alt="Earth, turning" style={{ left: -60 }} />
    </P>
    <P ar="4 / 3" bare>
      <Lines inner={30} n={46} seed={8} opacity={0.75} />
      <Vela eyes="wide" mouth="o" arms="up" size={150} x={28} y={62} />
      <Say x={0} y={0} w={190} tail="sw" shout>Oh! You opened it!</Say>
    </P>
    <P c="span 3" ar="16 / 8" tone="green">
      <Vela eyes="happy" mouth="grin" arms="wave1" size={170} x={34} b={18} />
      <Say x={214} y={20} w={460} tail="sw">Hi! I’m Vela. I live inside Solaris. It’s a Solar System you can fly through, and <b>everything in it is where it really is, right now.</b></Say>
      <Say r={26} b={22} w={300} tail="nw">Don’t believe me? Good. This book shows the working.</Say>
    </P>
  </Grid>
);

const Pro2: React.FC = () => (
  <Grid cols="1fr 1fr" rows="212px 400px 1fr">
    <P c="span 2" tone="orange" ar="16 / 6">
      <Sfx jp="シーン" en="SHĪN · SILENCE" r={18} y={12} size={42} rot={4} tone="paper" />
      <div className="bigq a-f">Where is Mars right now?</div>
    </P>
    <P c="span 2" ar="16 / 10" tone="ink">
      <Clip name="sky_phobos_rise" spot="orange" cell={5} gain={2.2} alt="Mars rising, seen from Phobos" />
      <Cap x={14} b={14} w={420}>Open Solaris and Mars is not placed where it looks nice. It is placed where it actually is, at the moment you opened the page.</Cap>
    </P>
    <P ar="4 / 3" tone="paper">
      <Vela eyes="squint" mouth="flat" arms="point" costume="glasses" size={118} x={16} b={12} />
      <Say r={12} y={14} w={200} tail="sw">Every planet. Every moon. 478 worlds.</Say>
    </P>
    <P ar="4 / 3" tone="paper">
      <Clip name="ui_atlas" spot="green" cell={3.4} gain={2} neg alt="The Atlas in Solaris, printed as a negative" />
      <Say x={14} y={14} w={260} tail="sw">Shall we start with how I know that?</Say>
    </P>
  </Grid>
);

export const FRONT: PageDef[] = [
  { id: 'cover', node: <Cover />, folio: false, stop: 'Cover' },
  { id: 'howto', node: <HowTo />, tab: 'The Catalogue', folio: false },
  { id: 'title', node: <Title />, folio: false },
  { id: 'contents-a', node: <Contents part={0} />, tab: 'Contents', stop: 'Contents' },
  { id: 'contents-b', node: <Contents part={1} />, tab: 'Contents' },
  { id: 'pro-1', node: <Pro1 />, tab: 'Prologue', stop: 'Prologue' },
  { id: 'pro-2', node: <Pro2 />, tab: 'Prologue' },
];
