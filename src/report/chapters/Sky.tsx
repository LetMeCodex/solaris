import React from 'react';
import { Chapter, Fig, T, Cite } from '../kit';
import { StarMap } from '../figures/StarMap';

const GALAXY: Array<[string, string, number]> = [
  ['Sun to the Galactic Centre (R₀)', '8.277 kpc (27,000 ly)', 18],
  ['Sun above the galactic mid-plane', '20.8 pc', 19],
  ['Mass of Sgr A*', '4.297 × 10⁶ suns', 18],
  ['Shadow of Sgr A*', '51.8 ± 2.3 µas', 20],
  ['Large Magellanic Cloud', '49.59 kpc', 21],
  ['Small Magellanic Cloud', '62.44 kpc', 22],
];

export const Sky: React.FC = () => (
  <Chapter
    id="sky"
    n="03"
    kicker="Stars and the galaxy"
    title="A *real* sky, in its real place"
    intro="Chapter three: the sky. Every star behind the planets is a real one, at its real position and colour. Hover the map and I'll tell you who's who."
    mood="love"
  >
    <div className="prose">
      <p className="lead">The stars behind the planets are not wallpaper. They are 12,596 real stars, each where it truly is.</p>
      <p>
        They come from <T k="hipparcos">Hipparcos</T><Cite n={8} />, ESA's star-measuring satellite: every star brighter than magnitude 4.6, plus every star within 120 parsecs, so that when you fly out of the Solar System the nearby stars move past you with real <T k="parallax">parallax</T>. Their positions are carried forward from the catalogue's 1991 epoch using their measured motions, and their colours come from their B−V index, the difference between their blue and visual brightness.
      </p>
      <p>
        Behind them glows the Milky Way from ESA's <T k="gaia">Gaia</T><Cite n={9} />, split into three nested shells around the Solar System so it has depth. Further out, the galaxy itself is 140,000 particles sampled from an artist's face-on map<Cite n={10} />, because nobody has ever photographed our galaxy from outside.
      </p>
    </div>
    <Fig
      n={6}
      title="The whole sky · galactic coordinates"
      vela="This is the actual sky file Solaris loads, laid flat. The centre of our galaxy is in the middle. Move your cursor over any bright star and I'll name it, with its real distance."
      caption={<><b>12,596 Hipparcos stars over the Gaia all-sky map.</b> Each star's ICRS direction is rotated into galactic coordinates (IAU 1958 frame); the mint lines are the nine constellation figures Solaris draws. Hover for names, magnitudes and distances.</>}
    >
      <StarMap />
    </Fig>
    <div className="prose">
      <h3>The galaxy, by the numbers</h3>
      <p>Zoom far enough and you leave the Solar System for the galaxy. Its proportions come from the latest measurements.</p>
    </div>
    <Fig n={7} wide={false} title="Galactic constants used by Solaris" vela="These are all measured numbers, most from 2019 to 2022. The black hole's mass comes from watching stars whip around it for decades." caption="Sources are numbered as in the references.">
      <table className="dtable">
        <thead><tr><th>Quantity</th><th>Value</th><th>Source</th></tr></thead>
        <tbody>
          {GALAXY.map(([q, v, r]) => (
            <tr key={q}><td>{q}</td><td className="num">{v}</td><td><Cite n={r} /></td></tr>
          ))}
        </tbody>
      </table>
    </Fig>
  </Chapter>
);
