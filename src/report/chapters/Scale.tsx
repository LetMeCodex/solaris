import React from 'react';
import { Chapter, Fig, T, VelaNote } from '../kit';
import { ScaleFig } from '../figures/ScaleFig';
import { PrecisionFig } from '../figures/PrecisionFig';

export const Scale: React.FC = () => (
  <Chapter
    id="scale"
    n="02"
    kicker="Scale and precision"
    title="Space is too big for a screen"
    intro="Chapter two: the size problem. At true scale the Solar System is a black screen with a few specks. Here's how Solaris cheats, and how honestly."
    mood="thinking"
  >
    <div className="prose">
      <p className="lead">The Sun is 1.4 million kilometres across. Neptune is 4.5 billion kilometres away. Draw both honestly and every planet becomes smaller than a pixel.</p>
      <p>
        Solaris keeps every <em>distance</em> true and enlarges the <em>worlds</em>. By default each planet and moon is drawn 30 times its real size, the <T k="worldscale">world scale</T>, so you can feel how big Jupiter is next to Earth instead of hunting for dots. Settings offers 1× for purists and 60× for drama; the Sun is enlarged less, at most 8×, so it never swallows Mercury.
      </p>
      <p>
        Enlarging a planet creates a new problem: its moons end up inside it. The Moon orbits 60 Earth radii away; at 30× Earth would reach halfway there. So moons are pushed out with a rule: the first four parent radii of their distance are scaled with the planet, the rest is kept true.
      </p>
    </div>
    <Fig
      n={4}
      title="True size to 30× · the Earth and the Moon"
      vela="Scroll and watch Earth grow. At true size the Moon is a speck 60 Earth-widths away. At 30× I push it out just far enough that it stays clear of the bigger Earth."
      caption={<><b>Drawn distance = scale · min(d, 4R) + max(0, d − 4R).</b> The same function as <code>moonDistanceKm()</code> in Solaris. The grey bar is the true distance; the gold one is where the Moon is drawn.</>}
    >
      <ScaleFig />
    </Fig>

    <div className="prose">
      <h3>The precision problem</h3>
      <p>
        Graphics cards store positions as <T k="float32">32-bit floating-point numbers</T>, with about seven significant digits. Measured from the Sun, a point near Neptune has a ten-digit coordinate, and the last three digits are simply lost. A moon there can only stand on a grid hundreds of kilometres apart, so it jitters as it moves.
      </p>
      <p>
        Solaris uses a <T k="floating">floating origin</T>. Every frame the whole universe is shifted so that the camera sits at zero. The things near you get small coordinates and all seven digits of precision, while the distant stars, which nobody can see to the kilometre, absorb the error.
      </p>
    </div>
    <Fig
      n={5}
      title="Float32 jitter versus a floating origin"
      vela="Both panels show the same little moon. The left one stores its position from the Sun, like a naive engine. See it snap to a grid? The right one measures from the camera. Smooth."
      caption={<><b>The same orbit, two ways.</b> A body circling 2,000 km from a planet 4.5 billion km from the Sun. Left: positions as float32 measured from the Sun, then subtracted, as a GPU would. Right: measured from the camera.</>}
    >
      <PrecisionFig />
    </Fig>
    <VelaNote>There's a third trick too: each zoom level gets its own scale. Close to a planet, one unit is its radius; in the Solar System view, distances are compressed; in the galaxy, one unit is a fraction of a light-year. The readout always converts with the scale actually on screen.</VelaNote>
  </Chapter>
);
