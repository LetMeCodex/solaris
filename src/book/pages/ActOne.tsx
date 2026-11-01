import React from 'react';
import { Arrow, Band, Cap, Clip, Grid, Ink, Lines, Note, Opener, P, Plate, Ref, Say, Sfx, Tate, Txt, Vela } from '../kit';
import { AccuracyPlate, Clocks, ElementsPlate, KeplerLive } from '../plates';
import { FloatPlate, MoonPlate, ShellsPlate } from '../plates2';
import type { PageDef } from './registry';

const base = import.meta.env.BASE_URL;

// ------------------------------------------------------------------------------- 01 where everything is
const C1: React.FC = () => (
  <Opener n="01" kicker="Ephemerides" title={<>Where everything <em>is</em>, right now</>}>
    <div className="op-art">
      <Ink src={{ kind: 'globe', map: '2k_mars.jpg', spin: 0.4, tilt: 0.44 }} look="engrave" spot="orange" cell={6} gain={1.7} alt="Mars, engraved, turning" />
    </div>
    <p className="op-lead a-f">When you open Solaris, Mars is not placed where it looks nice. It is placed where it actually is, at the moment you opened the page.</p>
  </Opener>
);

const Six: React.FC = () => (
  <>
    <Band size={34}>SIX NUMBERS PER PLANET</Band>
    <Plate n="I" title="The orbital elements: the size, shape and tilt of an orbit, and where the planet was on it at J2000."><ElementsPlate /></Plate>
    <Txt cols={2}>
      <p>A position comes from six numbers called <b>orbital elements</b>, published by NASA’s Jet Propulsion Laboratory<Ref n={1} />. They describe an orbit at a reference moment, J2000: noon on 1 January 2000, Terrestrial Time.</p>
      <p>Each element also drifts a tiny amount every century, and JPL publishes those rates too, so one table stays accurate from 1800 to 2050.</p>
      <p>The Moon comes from JPL’s mean satellite elements<Ref n={2} />, with its 6.0-year apsidal and 18.6-year nodal precession. Twenty-one major moons come from JPL Horizons<Ref n={3} />, taken on 14 October 2026. Pluto, Ceres and the asteroids come from the Small-Body Database<Ref n={4} />.</p>
      <p>Every element block in the code carries a <i>source</i> field saying exactly which table it came from.</p>
    </Txt>
    <div style={{ flex: 1 }} />
    <Note n="2" rot={-0.7}>Six numbers. That’s all a world needs in order to be found. I find this very comforting, and I don’t know why.</Note>
  </>
);

const Kepler: React.FC = () => (
  <>
    <Grid cols="1fr 1fr" rows="176px" style={{ flex: 'none' }}>
      <P tone="ink" ar="4 / 3">
        <Lines tone="#ece1ca" inner={22} n={60} seed={5} />
        <Vela eyes="wide" mouth="o" arms="up" size={104} x={118} y={30} still />
      </P>
      <P tone="green" ar="4 / 3">
        <Say x={14} y={18} w={302} tail="none">Time passes evenly. Planets don’t. They rush past the Sun and crawl far from it!</Say>
      </P>
    </Grid>
    <Plate n="II" title="Kepler’s equation, solving itself as you watch. The orange area grows at a constant rate: Kepler’s second law.">
      <div className="plate-box"><KeplerLive /></div>
    </Plate>
    <Txt cols={2}>
      <p>The link between “how much time has passed” and “where along the ellipse” is Kepler’s equation, and it has no algebraic solution. So Solaris guesses, and corrects.</p>
      <p>It uses Newton–Raphson iteration, with a starting guess tuned for eccentricity, and stops when the error is below 10⁻¹². For a nearly circular orbit like Earth’s, that takes two or three steps.</p>
    </Txt>
    <div style={{ flex: 1 }} />
    <Note n="3" rot={0.8}>Guess. Measure how wrong you are. Guess again. It isn’t a trick for planets. It is how anybody has ever known anything.</Note>
  </>
);

const Time: React.FC = () => (
  <>
    <Band tone="orange" size={32}>WHICH TIME?</Band>
    <Clocks />
    <Txt cols={2}>
      <p>Your clock is UTC, which jumps by a leap second now and then to stay in step with Earth’s wobbling spin. The planets follow <b>TDB</b>, Barycentric Dynamical Time: a smooth scale that today runs 69.184 seconds ahead.</p>
      <p>Solaris converts at every frame and counts days from J2000, on a Julian Date: a plain count of days since 4713 BC. Get it wrong by an hour and the Moon slides its own width across the sky.</p>
    </Txt>
    <Band size={30}>HOW ACCURATE IS IT?</Band>
    <Plate n="III" title="Checked accuracy. The axis is logarithmic: each step is ten times larger. From src/tests/ephemerisAccuracy.test.ts.">
      <AccuracyPlate />
    </Plate>
    <Txt cols={2}>
      <p>A model you can’t check is a guess. The planets are compared against a VSOP87-based ephemeris in 2026 and 2040, and stay under 0.25°, typically under 0.05°. The Moon stays under 2° of JPL Horizons (0.7° on 14 October 2026).</p>
      <p>Solaris is an explorer, not a navigation-grade ephemeris. A spacecraft needs metres; a visitor needs to see Jupiter in the right part of the sky. If an edit ever moved the planets further, the build would fail.</p>
    </Txt>
  </>
);

// ------------------------------------------------------------------------------- 02 scale
const C2: React.FC = () => (
  <Opener n="02" tone="orange" kicker="Scale and precision" title={<>Space is too <em>big</em> for a screen</>}>
    <div className="op-art">
      <Ink src={{ kind: 'globe', map: '2k_earth_daymap.jpg', spin: 0.3, tilt: 0.41 }} look="dots" spot="green" cell={6} gain={2.8} alt="Earth, in green halftone, turning" />
    </div>
    <p className="op-lead a-f">The Sun is 1.4 million kilometres across. Neptune is 4.5 billion kilometres away. Draw both honestly and every planet becomes smaller than a pixel.</p>
  </Opener>
);

const Scale: React.FC = () => (
  <>
    <Grid cols="1fr 1fr" rows="226px" style={{ flex: 'none' }}>
      <P tone="ink" ar="4 / 3">
        <Sfx jp="シーン" en="SHĪN" x={20} y={18} size={46} rot={-4} tone="paper" />
        <div style={{ position: 'absolute', left: 180, top: 120, width: 3, height: 3, background: 'var(--paper)' }} />
        <Cap x={12} b={12} w={300} tone="paper">This panel is the Solar System at true scale. That dot is the Sun. You’re welcome.</Cap>
      </P>
      <P tone="green" ar="4 / 3">
        <Vela eyes="squint" mouth="smile" arms="point" size={112} x={18} b={10} />
        <Say r={12} y={12} w={232} tail="sw">So here’s how we cheat. And <b>how honestly.</b></Say>
      </P>
    </Grid>
    <Band size={27}>DISTANCES TRUE, WORLDS ENLARGED</Band>
    <Plate n="IV" title="Drawn distance = scale · min(d, 4R) + max(0, d − 4R). The same function as moonDistanceKm() in Solaris."><MoonPlate /></Plate>
    <Txt cols={2}>
      <p>Solaris keeps every <i>distance</i> true and enlarges the <i>worlds</i>. By default each planet and moon is drawn 30 times its real size. Settings offers 1× for purists and 60× for drama; the Sun is enlarged less, at most 8×, so it never swallows Mercury.</p>
      <p>Enlarging a planet creates a new problem: its moons end up inside it. So moons are pushed out by a rule: the first four parent radii of their distance are scaled with the planet, and the rest is kept true.</p>
    </Txt>
    <Note n="4" rot={-0.6}>To show you the truth I had to lie about the size of everything. So I tell you. That is the whole difference between a lie and a map.</Note>
  </>
);

const Float: React.FC = () => (
  <>
    <p className="px-eyebrow a-f">The precision problem</p>
    <div className="px-num a-f">512 km</div>
    <p className="px-sub a-f">Near Neptune, a graphics card’s 32-bit numbers can only land every 512 km.</p>
    <div className="px-card">
      <Plate n="V" title="The same small orbit, 2,000 km from a planet 4.5 billion km from the Sun, computed here with real 32-bit rounding."><FloatPlate /></Plate>
    </div>
    <Txt cols={2}>
      <p>Graphics cards store positions as 32-bit floats, with about seven significant digits. Measured from the Sun, a point near Neptune has a ten-digit coordinate, and the last digits are simply lost. A moon there can only stand on a grid, so it jitters as it moves.</p>
      <p>Solaris uses a <b>floating origin</b>. Every frame the whole universe is shifted so that the camera sits at zero. The things near you get small coordinates and all seven digits; the distant stars absorb the error.</p>
    </Txt>
    <Note n="5" rot={0.6}>Every frame, the whole universe moves so that you can stand at the centre of it. Precision is only ever spent where you are looking. Everything far away absorbs the error. I think about this more than I should.</Note>
  </>
);

// ------------------------------------------------------------------------------- 03 sky
const C3: React.FC = () => (
  <Opener n="03" kicker="Stars and the galaxy" title={<>A <em>real</em> sky, in its real place</>}>
    <div className="op-wide a-p"><Ink src={{ kind: 'image', url: `${base}textures/milky_way_disk.webp` }} look="rings" spot="orange" cell={6} gain={1.9} fx={0.5} fy={0.5} zoom={1.25} alt="The artist’s face-on Milky Way that Solaris samples for its 3D disk" /></div>
    <p className="op-lead a-f" style={{ width: 'auto' }}>The stars behind the planets are not wallpaper. They are 12,596 real stars, each where it truly is.</p>
  </Opener>
);

const Stars: React.FC = () => (
  <>
    <Band size={30}>THE WHOLE SKY, LAID FLAT</Band>
    <Grid cols="1fr" rows="236px" style={{ flex: 'none' }}>
      <P ar="2 / 1">
        <Ink src={{ kind: 'image', url: `${base}report/sky.webp` }} look="stipple" spot="orange" cell={4} gain={2.6} zoom={1.05} alt="The Gaia all-sky map in galactic coordinates" />
        <Cap x={12} y={12} w={258} tone="paper">The actual sky file, with the centre of our galaxy in the middle.</Cap>
        <Arrow x={300} y={84} len={120} rot={8} />
      </P>
    </Grid>
    <Txt cols={2}>
      <p>The stars come from <b>Hipparcos</b><Ref n={8} />, ESA’s star-measuring satellite: every star brighter than magnitude 4.6, plus every star within 120 parsecs, so that when you fly out of the Solar System the nearby stars move past you with real parallax.</p>
      <p>Positions are carried forward from the catalogue’s 1991 epoch using each star’s measured motion. Colours come from its B−V index. Nine constellation figures are drawn from hand-curated star pairs.</p>
      <p>Behind them glows the Milky Way from ESA’s <b>Gaia</b><Ref n={9} />, split into three nested shells so it has depth. Further out, the galaxy is 140,000 particles sampled from an artist’s face-on map<Ref n={10} />, because nobody has ever photographed our galaxy from outside.</p>
    </Txt>
    <Plate n="VI" title="The sky is built in layers, so it shifts like real depth as you fly."><ShellsPlate /></Plate>
  </>
);

const GAL: Array<[string, string, number]> = [
  ['Sun to the Galactic Centre (R₀)', '8.277 kpc (27,000 ly)', 18], ['Sun above the galactic mid-plane', '20.8 pc', 19], ['Mass of Sgr A*', '4.297 × 10⁶ suns', 18],
  ['Shadow of Sgr A*', '51.8 ± 2.3 µas', 20], ['Large Magellanic Cloud', '49.59 kpc', 21], ['Small Magellanic Cloud', '62.44 kpc', 22],
];
const Galaxy: React.FC = () => (
  <>
    <Grid cols="1.2fr 1fr" rows="300px" style={{ flex: 'none' }}>
      <P ar="4 / 3" shape="c">
        <Clip name="warp" look="rays" spot="orange" cell={5} gain={1.1} fx={0.42} fy={0.72} alt="The warp through the Milky Way" />
        <Sfx jp="ビュン" en="BYUN" x={18} y={16} size={66} rot={-10} tone="ink" />
      </P>
      <P tone="paper" ar="4 / 3">
        <Vela eyes="wide" mouth="open" arms="up" size={122} x={84} b={10} />
        <Say x={10} y={12} w={270} tail="sw">Zoom far enough and you leave the Solar System for <b>the whole galaxy.</b></Say>
      </P>
    </Grid>
    <Band tone="orange" size={30}>THE GALAXY, BY THE NUMBERS</Band>
    <table className="spec a-f">
      <thead><tr><th>Quantity</th><th>Value</th><th>Source</th></tr></thead>
      <tbody>{GAL.map(([q, v, r]) => <tr key={q}><td>{q}</td><td><b>{v}</b></td><td><Ref n={r} /></td></tr>)}</tbody>
    </table>
    <Txt cols={2}>
      <p>All of these are measured values, most from 2019 to 2022. The black hole’s mass comes from watching stars whip around it for decades. The galactic frame is the IAU 1958 system in ICRS: north galactic pole at RA 192.85948°, Dec +27.12825°.</p>
      <p>Outside the local disk, the 3D particles hand over to an artist’s disk and 14,000 procedurally placed stars. The LMC, the SMC and the Sagittarius dwarf sit at their measured positions, at 1,320 units per kiloparsec.</p>
    </Txt>
    <div style={{ flex: 1 }} />
    <Note n="6" rot={-0.7}>Somebody built a satellite in the 1980s to measure these stars one by one. They had never heard of you. They measured them anyway.</Note>
  </>
);

/** Interlude: the night sky is a photograph of many different years. */
const OldLight: React.FC = () => (
  <>
    <div className="bleed"><Clip name="nebula2" look="dots" spot="orange" cell={7} gain={1.05} zoom={1.2} alt="The Helix Nebula" /></div>
    <Tate r={30} y={46} size={58} color="var(--paper)">古い光</Tate>
    <div className="old">
      <small>Interlude · Old light</small>
      <h2>The night sky is not a place. It is a <em>calendar.</em></h2>
      <div className="oldrow"><b>Sirius</b><span>8.6 light-years away. This light left in 2018.</span></div>
      <div className="oldrow"><b>Vega</b><span>25 light-years. This light left in 2001.</span></div>
      <div className="oldrow"><b>Polaris</b><span>About 430 light-years. This light left around 1590.</span></div>
      <p>Look up tonight and you are looking at hundreds of different years, all arriving at once, in your eye, for the first time. Nobody alive has ever seen the Polaris of today.</p>
    </div>
  </>
);

export const ACT_ONE: PageDef[] = [
  { id: 'c1', node: <C1 />, tab: 'Ephemerides', stop: '01 Where everything is' },
  { id: 'c1-six', node: <Six />, tab: 'Ephemerides' },
  { id: 'c1-kepler', node: <Kepler />, tab: 'Ephemerides' },
  { id: 'c1-time', node: <Time />, tab: 'Ephemerides' },
  { id: 'c2', node: <C2 />, tab: 'Scale', stop: '02 Scale and precision' },
  { id: 'c2-scale', node: <Scale />, tab: 'Scale' },
  { id: 'c2-float', node: <Float />, tab: 'Scale', ground: 'orange' },
  { id: 'c3', node: <C3 />, tab: 'The Sky', stop: '03 Stars and the galaxy' },
  { id: 'c3-stars', node: <Stars />, tab: 'The Sky' },
  { id: 'c3-gal', node: <Galaxy />, tab: 'The Sky' },
  { id: 'old-light', node: <OldLight />, tab: 'Interlude', folio: false },
];
