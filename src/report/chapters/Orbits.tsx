import React, { useEffect, useState } from 'react';
import { Chapter, Fig, T, Cite, VelaNote } from '../kit';
import { Orrery } from '../figures/Orrery';
import { KeplerFig } from '../figures/KeplerFig';

/** A clock that shows the three times Solaris juggles, ticking. */
const Clocks: React.FC = () => {
  const [t, setT] = useState(Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setT(Date.now()), 87);
    return () => window.clearInterval(id);
  }, []);
  const jdUtc = t / 86400000 + 2440587.5;
  const tdb = new Date(t + 69184);
  return (
    <div className="clocks">
      <div><span>UTC · your clock</span><b>{new Date(t).toISOString().replace('T', ' ').slice(0, 23)}</b></div>
      <div><span>TDB · the planets' clock</span><b>{tdb.toISOString().replace('T', ' ').slice(0, 23)}</b></div>
      <div><span>Julian Date (UTC)</span><b>{jdUtc.toFixed(6)}</b></div>
      <div><span>Days since J2000 (TDB)</span><b>{(jdUtc + 69.184 / 86400 - 2451545).toFixed(6)}</b></div>
    </div>
  );
};

const ACCURACY: Array<[string, string, string]> = [
  ['8 planets', 'JPL secular-rate elements (Standish), valid 1800–2050', '< 0.25° vs a VSOP87-based ephemeris in 2026 and 2040, typically < 0.05°'],
  ["Earth's Moon", 'JPL mean elements with 6.0 yr apsidal and 18.6 yr nodal precession', '< 2° vs JPL Horizons (0.7° on 2026-10-14)'],
  ['21 major moons', 'JPL Horizons osculating elements, 2026-10-14 TDB', 'exact at the epoch; Titan within 5° propagated back 26.8 years'],
  ['Pluto, Ceres, 9 asteroids', 'JPL Small-Body Database osculating elements', 'two-body; degrades slowly away from each epoch'],
];

export const Orbits: React.FC = () => (
  <Chapter
    id="orbits"
    n="01"
    kicker="Ephemerides"
    title="Where everything is, right now"
    intro="Chapter one: where everything is. Every planet you see in Solaris is where NASA says it is, this second. Let me show you how."
    mood="excited"
  >
    <div className="prose">
      <p className="lead">
        When you open Solaris, Mars is not placed where it looks nice. It is placed where it actually is, at the moment you opened the page.
      </p>
      <p>
        That position comes from six numbers per planet, called <T k="elements">orbital elements</T>, published by NASA's <T k="jpl">Jet Propulsion Laboratory</T>
        <Cite n={1} />. They describe the size, shape and tilt of each orbit, and where the planet was on it at a reference moment, <T k="j2000">J2000</T>. Each also drifts a tiny amount every century, and JPL publishes those rates too, so the same table stays accurate from 1800 to 2050.
      </p>
      <p>
        Moons come from <T k="horizons">JPL Horizons</T><Cite n={3} />, the Moon from JPL's mean satellite elements<Cite n={2} />, and Pluto, Ceres and the asteroids from the <T k="sbdb">Small-Body Database</T><Cite n={4} />. Every element block in the code carries a <code>source</code> field saying exactly which table it came from.
      </p>
    </div>

    <Fig
      n={1}
      title="Live orrery · Solaris's own solver, running in this page"
      vela="This isn't an animation. It's the same Kepler solver that runs Solaris, fed NASA's elements, recomputed every frame. Drag the slider back to 1800 if you like, the numbers hold."
      caption={<><b>The eight planets, computed in your browser.</b> Top-down on the ecliptic, distances on a log scale so Mercury and Neptune fit on one screen. Drag the slider anywhere between 1800 and 2050, the range the elements are valid for. Hover a planet for its distance, speed and light-time.</>}
    >
      <Orrery />
    </Fig>

    <div className="prose">
      <h3>Turning elements into a position</h3>
      <p>
        Elements tell you the orbit; you still have to find the planet on it. Time passes evenly, but planets don't move evenly: they rush past the Sun and crawl far from it. The link between "how much time has passed" and "where along the ellipse" is <T k="kepler">Kepler's equation</T>, and it has no algebraic solution.
      </p>
      <p>
        So Solaris guesses, and corrects. It uses <T k="newton">Newton–Raphson</T> iteration with a starting guess tuned for <T k="eccentricity">eccentricity</T>, stopping when the error is below 10⁻¹². For a nearly circular orbit like Earth's that takes two or three steps. Push the slider below towards a comet and watch it work harder.
      </p>
    </div>

    <Fig
      n={2}
      title="Kepler's equation · solved live"
      vela="The dashed ghost is time, going round at a steady pace. The blue planet is reality, rushing near the Sun. The list on the right is me guessing where it is, and getting it right to twelve decimals in a few tries."
      caption={<><b>Time is uniform; motion is not.</b> The ghost circles at constant speed (the mean anomaly M). Newton's method finds the eccentric anomaly E, which places the planet on the ellipse. The gold area grows at a constant rate: Kepler's second law.</>}
    >
      <KeplerFig />
    </Fig>

    <div className="prose">
      <h3>Which time?</h3>
      <p>
        Planets don't run on the clock on your phone. Your clock is <code>UTC</code>, which jumps by a leap second now and then to stay in step with Earth's wobbling spin. The planets follow <T k="tdb">TDB</T>, a smooth time scale that today runs 69.184 seconds ahead. Solaris converts at every frame and counts days from <T k="j2000">J2000</T>, on a <T k="julian">Julian Date</T>. Get it wrong by an hour and the Moon slides its own width across the sky.
      </p>
    </div>
    <Clocks />

    <div className="prose">
      <h3>How accurate is it?</h3>
      <p>
        A model you can't check is a guess. Solaris's test suite compares its positions against independent references, and the numbers are below. This is an explorer, not a navigation-grade ephemeris: a spacecraft needs metres, a visitor needs to see Jupiter in the right part of the sky.
      </p>
    </div>
    <Fig n={3} wide={false} title="Accuracy, checked by the test suite" vela="Every one of these numbers is enforced by a test. If an edit ever moved the planets more than this, the build would fail before it reached you." caption={<>From <code>src/tests/ephemerisAccuracy.test.ts</code>. Directions are heliocentric (planets) or parent-centred (moons).</>}>
      <table className="dtable">
        <thead><tr><th>Bodies</th><th>Elements</th><th>Checked accuracy</th></tr></thead>
        <tbody>
          {ACCURACY.map(([a, b, c]) => (
            <tr key={a}><td>{a}</td><td>{b}</td><td className="num">{c}</td></tr>
          ))}
        </tbody>
      </table>
    </Fig>
    <VelaNote>Fun fact: Earth's day and night in Solaris match the real ones, because Earth's spin comes from the IAU rotation model too. Go check your own city.</VelaNote>
  </Chapter>
);
