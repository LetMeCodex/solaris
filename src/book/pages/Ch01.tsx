import React from 'react';
import { Band, Grid, Ink, Lines, Opener, P, Plate, Ref, Say, Sfx, Txt, Vela } from '../kit';
import { AccuracyPlate, Clocks, ElementsPlate, KeplerLive } from '../plates';
import type { PageDef } from './registry';

const TAB = 'Ephemerides';

const Open: React.FC = () => (
  <Opener n="01" kicker="Ephemerides" title={<>Where everything <em>is</em>, right now</>}>
    <div className="op-art">
      <Ink src={{ kind: 'globe', map: '2k_mars.jpg', spin: 0.4, tilt: 0.44 }} spot="orange" cell={5} gain={1.6} alt="Mars, turning" />
    </div>
    <p className="op-lead a-f">When you open Solaris, Mars is not placed where it looks nice. It is placed where it actually is, at the moment you opened the page.</p>
    <Vela eyes="happy" mouth="grin" arms="point" size={104} r={0} b={0} />
  </Opener>
);

const Six: React.FC = () => (
  <>
    <Band size={34}>SIX NUMBERS PER PLANET</Band>
    <Grid cols="1fr 1fr" rows="auto 1fr" style={{ flex: 'none', gap: 14 }}>
      <P c="span 2" bare ar="auto" className="flow" style={{ position: 'relative' }}>
        <Plate n="I" title="The orbital elements: the size, shape and tilt of an orbit, and where the planet was on it at J2000.">
          <ElementsPlate />
        </Plate>
      </P>
    </Grid>
    <Txt cols={2}>
      <p>A position comes from six numbers called <b>orbital elements</b>, published by NASA’s Jet Propulsion Laboratory<Ref n={1} />. They describe an orbit at a reference moment, J2000: noon on 1 January 2000, Terrestrial Time.</p>
      <p>Each element also drifts a tiny amount every century, and JPL publishes those rates too, so one table stays accurate from 1800 to 2050.</p>
      <p>The Moon comes from JPL’s mean satellite elements<Ref n={2} />, with its 6.0-year apsidal and 18.6-year nodal precession. Twenty-one major moons come from JPL Horizons<Ref n={3} />, taken on 14 October 2026. Pluto, Ceres and the asteroids come from the Small-Body Database<Ref n={4} />.</p>
      <p>Every element block in the code carries a <i>source</i> field saying exactly which table it came from.</p>
    </Txt>
  </>
);

const Kepler: React.FC = () => (
  <Grid cols="1fr 1fr" rows="196px 452px 1fr">
    <P tone="ink" ar="4 / 3">
      <Lines tone="#ece1ca" inner={22} n={60} seed={5} />
      <Vela eyes="wide" mouth="o" arms="up" size={108} x={110} y={40} />
    </P>
    <P tone="green" ar="4 / 3">
      <Say x={14} y={16} w={300} tail="none">Time passes evenly. Planets don’t. They rush past the Sun and crawl far from it!</Say>
    </P>
    <P c="span 2" ar="680 / 430" className="flow">
      <div style={{ padding: '6px 10px' }}><KeplerLive /></div>
    </P>
    <P c="span 2" bare ar="auto" className="flow" style={{ position: 'relative' }}>
      <Txt cols={2}>
        <h3>Plate II · Kepler’s equation, solved as you watch</h3>
        <p>The link between “how much time has passed” and “where along the ellipse” is Kepler’s equation, and it has no algebraic solution. So Solaris guesses, and corrects.</p>
        <p>It uses Newton–Raphson iteration, with a starting guess tuned for eccentricity, and stops when the error is below 10⁻¹². For a nearly circular orbit like Earth’s, that takes two or three steps. The orange area grows at a constant rate: Kepler’s second law.</p>
      </Txt>
    </P>
  </Grid>
);

const Time: React.FC = () => (
  <>
    <Band tone="orange" size={34}>WHICH TIME?</Band>
    <Grid cols="1fr 150px" rows="100px" style={{ flex: 'none' }}>
      <P c="1" tone="paper" ar="16 / 5">
        <Vela eyes="squint" mouth="flat" arms="hold" costume="glasses" size={76} x={16} b={6} still />
        <Say x={108} y={12} w={380} tail="none">Your phone’s clock is <b>not</b> the planets’ clock.</Say>
      </P>
      <P tone="ink" ar="4 / 3">
        <Sfx jp="カチッ" en="KACHI" x={14} y={14} size={38} rot={-9} tone="paper" />
      </P>
    </Grid>
    <Clocks />
    <Txt cols={2}>
      <p>Your clock is UTC, which jumps by a leap second now and then to stay in step with Earth’s wobbling spin. The planets follow <b>TDB</b>, Barycentric Dynamical Time: a smooth scale that today runs 69.184 seconds ahead.</p>
      <p>Solaris converts at every frame and counts days from J2000, on a Julian Date: a plain count of days since 4713 BC, with no months or time zones to trip over. Get it wrong by an hour and the Moon slides its own width across the sky.</p>
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

export const CH01: PageDef[] = [
  { id: 'c1', node: <Open />, tab: TAB, stop: '01 Where everything is' },
  { id: 'c1-six', node: <Six />, tab: TAB },
  { id: 'c1-kepler', node: <Kepler />, tab: TAB },
  { id: 'c1-time', node: <Time />, tab: TAB },
];
