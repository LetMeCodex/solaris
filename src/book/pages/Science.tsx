import React from 'react';
import { Arrow, Band, Cap, Clip, Grid, Ink, Opener, P, Plate, Ref, Say, Sfx, Txt, Vela } from '../kit';
import { AirPlate, BendPlate, FloatPlate, MoonPlate, ShellsPlate, StandPlate, SunPlate, TilesPlate } from '../plates2';
import type { PageDef } from './registry';

const base = import.meta.env.BASE_URL;

// ------------------------------------------------------------------------------- 02 scale
const C2: React.FC = () => (
  <Opener n="02" tone="orange" kicker="Scale and precision" title={<>Space is too <em>big</em> for a screen</>}>
    <div className="op-art">
      <Ink src={{ kind: 'globe', map: '2k_earth_daymap.jpg', spin: 0.3, tilt: 0.41 }} spot="green" cell={5} gain={1.9} alt="Earth, turning" />
    </div>
    <p className="op-lead a-f">The Sun is 1.4 million kilometres across. Neptune is 4.5 billion kilometres away. Draw both honestly and every planet becomes smaller than a pixel.</p>
  </Opener>
);

const C2Scale: React.FC = () => (
  <>
    <Grid cols="1fr 1fr" rows="248px" style={{ flex: 'none' }}>
      <P tone="ink" ar="4 / 3">
        <Sfx jp="シーン" en="SHĪN · SILENCE" x={20} y={20} size={46} rot={-4} tone="paper" />
        <div style={{ position: 'absolute', left: 180, top: 150, width: 3, height: 3, background: 'var(--paper)' }} />
        <Cap x={12} b={12} w={300} tone="paper">At true scale, the Solar System is a black screen with a few specks.</Cap>
      </P>
      <P tone="green" ar="4 / 3">
        <Vela eyes="squint" mouth="smile" arms="point" size={120} x={18} b={12} />
        <Say r={12} y={12} w={232} tail="sw">So here’s how we cheat. And <b>how honestly.</b></Say>
      </P>
    </Grid>
    <Band size={27}>DISTANCES TRUE, WORLDS ENLARGED</Band>
    <Plate n="IV" title="Drawn distance = scale · min(d, 4R) + max(0, d − 4R). The same function as moonDistanceKm() in Solaris.">
      <MoonPlate />
    </Plate>
    <Txt cols={2}>
      <p>Solaris keeps every <i>distance</i> true and enlarges the <i>worlds</i>. By default each planet and moon is drawn 30 times its real size, the world scale, so you can feel how big Jupiter is next to Earth instead of hunting for dots. Settings offers 1× for purists and 60× for drama; the Sun is enlarged less, at most 8×, so it never swallows Mercury.</p>
      <p>Enlarging a planet creates a new problem: its moons end up inside it. The Moon orbits 60 Earth radii away, and at 30× Earth would reach halfway there. So moons are pushed out by a rule: the first four parent radii of their distance are scaled with the planet, and the rest is kept true.</p>
    </Txt>
  </>
);

const C2Float: React.FC = () => (
  <>
    <p className="px-eyebrow a-f">The precision problem</p>
    <div className="px-num a-f">512 km</div>
    <p className="px-sub a-f">Near Neptune, a graphics card’s 32-bit numbers can only land every 512 km.</p>
    <div className="px-card">
      <Plate n="V" title="The same small orbit, 2,000 km from a planet 4.5 billion km from the Sun, computed here with real 32-bit rounding.">
        <FloatPlate />
      </Plate>
    </div>
    <Txt cols={2}>
      <p>Graphics cards store positions as 32-bit floating-point numbers, with about seven significant digits. Measured from the Sun, a point near Neptune has a ten-digit coordinate, and the last digits are simply lost. A moon there can only stand on a grid, so it jitters as it moves.</p>
      <p>Solaris uses a <b>floating origin</b>. Every frame the whole universe is shifted so that the camera sits at zero. The things near you get small coordinates and all seven digits; the distant stars, which nobody can see to the kilometre, absorb the error. And each zoom level has its own scale, so the readout always converts with the scale on screen.</p>
    </Txt>
  </>
);

// ------------------------------------------------------------------------------- 03 sky
const C3: React.FC = () => (
  <Opener n="03" kicker="Stars and the galaxy" title={<>A <em>real</em> sky, in its real place</>}>
    <div className="op-wide a-p"><Ink src={{ kind: 'image', url: `${base}textures/milky_way_disk.webp` }} spot="orange" cell={5} gain={2} alt="The artist’s face-on Milky Way that Solaris samples for its 3D disk" /></div>
    <p className="op-lead a-f" style={{ width: 'auto' }}>The stars behind the planets are not wallpaper. They are 12,596 real stars, each where it truly is.</p>
  </Opener>
);

const C3Stars: React.FC = () => (
  <>
    <Band size={30}>THE WHOLE SKY, LAID FLAT</Band>
    <Grid cols="1fr" rows="250px" style={{ flex: 'none' }}>
      <P tone="ink" ar="2 / 1">
        <Ink src={{ kind: 'image', url: `${base}report/sky.webp` }} spot="orange" cell={3.6} gain={3.2} alt="The Gaia all-sky map in galactic coordinates" />
        <Cap x={12} y={12} w={270} tone="paper">The actual sky file, with the centre of our galaxy in the middle.</Cap>
        <Arrow x={330} y={92} len={130} rot={8} />
      </P>
    </Grid>
    <Txt cols={2}>
      <p>The stars come from <b>Hipparcos</b><Ref n={8} />, ESA’s star-measuring satellite: every star brighter than magnitude 4.6, plus every star within 120 parsecs, so that when you fly out of the Solar System the nearby stars move past you with real parallax.</p>
      <p>Positions are carried forward from the catalogue’s 1991 epoch using each star’s measured motion. Colours come from its B−V index, the difference between its blue and visual brightness. Nine constellation figures are drawn from hand-curated star pairs.</p>
      <p>Behind them glows the Milky Way from ESA’s <b>Gaia</b><Ref n={9} />, split into three nested shells around the Solar System so it has depth. Further out, the galaxy is 140,000 particles sampled from an artist’s face-on map<Ref n={10} />, because nobody has ever photographed our galaxy from outside.</p>
    </Txt>
    <Plate n="VI" title="The sky is built in layers, so it shifts like real depth as you fly.">
      <ShellsPlate />
    </Plate>
  </>
);

const GAL: Array<[string, string, number]> = [
  ['Sun to the Galactic Centre (R₀)', '8.277 kpc (27,000 ly)', 18], ['Sun above the galactic mid-plane', '20.8 pc', 19], ['Mass of Sgr A*', '4.297 × 10⁶ suns', 18],
  ['Shadow of Sgr A*', '51.8 ± 2.3 µas', 20], ['Large Magellanic Cloud', '49.59 kpc', 21], ['Small Magellanic Cloud', '62.44 kpc', 22],
];
const C3Gal: React.FC = () => (
  <>
    <Grid cols="1fr 1fr" rows="330px" style={{ flex: 'none' }}>
      <P tone="ink" ar="4 / 3" shape="c">
        <Clip name="warp" spot="orange" cell={5} gain={2.6} alt="The warp through the Milky Way" />
        <Sfx jp="ビュン" en="BYUN" x={20} y={20} size={70} rot={-10} tone="paper" />
      </P>
      <P tone="paper" ar="4 / 3">
        <Vela eyes="wide" mouth="open" arms="up" size={130} x={100} b={14} />
        <Say x={10} y={12} w={320} tail="sw">Zoom far enough and you leave the Solar System for the <b>whole galaxy.</b></Say>
      </P>
    </Grid>
    <Band tone="orange" size={30}>THE GALAXY, BY THE NUMBERS</Band>
    <table className="spec a-f">
      <thead><tr><th>Quantity</th><th>Value</th><th>Source</th></tr></thead>
      <tbody>{GAL.map(([q, v, r]) => <tr key={q}><td>{q}</td><td><b>{v}</b></td><td><Ref n={r} /></td></tr>)}</tbody>
    </table>
    <Txt cols={2}>
      <p>All of these are measured values, most from 2019 to 2022. The black hole’s mass comes from watching stars whip around it for decades. The galactic frame is the IAU 1958 system in ICRS: north galactic pole at RA 192.85948°, Dec +27.12825°.</p>
      <p>Outside the local disk, the 3D particles hand over to an artist’s disk and 14,000 procedurally placed stars. The LMC, the SMC and the Sagittarius dwarf sit at their measured positions. Each tier is drawn on its own scale: 1,320 units per kiloparsec for the Milky Way.</p>
    </Txt>
  </>
);

// ------------------------------------------------------------------------------- 04 sun
const LAYERS: Array<[string, string]> = [
  ['Granulation', 'Three scales of convection cells from domain-warped fractal noise, each faded out before it is small enough to shimmer.'],
  ['Supergranules and filaments', 'A slower network of larger cells, with dark filaments threading between them.'],
  ['Spots and faculae', 'Dark sunspots with brighter faculae around them.'],
  ['Limb darkening', 'The edge darkens and reddens, as it does in real photographs.'],
  ['Corona and spicules', 'A flame-like fringe of spicules at the limb, then glow, halo and streamers.'],
  ['Prominences', 'Fourteen magnetic loops, including great arching prominences, with soft knots and threads; some erupt gently.'],
];
const C4: React.FC = () => (
  <Opener n="04" tone="orange" kicker="The Sun" title={<>A star with <em>no picture</em></>}>
    <div className="op-wide a-p" style={{ height: 300 }}>
      <Clip name="sun" spot="orange" cell={6} gain={1.05} alt="The Sun's surface, computed live" />
      <Vela eyes="happy" mouth="grin" arms="wave1" costume="shades" size={118} r={14} b={8} />
      <Sfx jp="ジリジリ" en="JIRI-JIRI · SIZZLING HEAT" x={16} y={14} size={50} rot={-5} tone="paper" />
    </div>
    <p className="op-lead a-f" style={{ width: 'auto' }}>There is no image of the Sun in Solaris. It is computed, pixel by pixel, every frame.</p>
  </Opener>
);
const C4Layers: React.FC = () => (
  <>
    <Band size={30}>SIX LAYERS, ONE SHADER</Band>
    <Plate n="VII" title="The Sun as a small program on the graphics card, cut away. All six layers run at once.">
      <SunPlate layers={LAYERS.map(([t]) => t)} />
    </Plate>
    <ol className="list a-f">
      {LAYERS.map(([t, d]) => <li key={t}><b>{t}.</b> {d}</li>)}
    </ol>
    <Txt cols={2}>
      <p>A photograph would look flat up close and fixed in time, so the Sun is a shader: its surface is layers of fractal noise, warped and stacked, with limb darkening at the edge.</p>
      <p>It took several attempts. The first version looked like tiled lava. The prominences came out as hard boomerangs. Each fix was softening, spreading and slowing, until it looked like observatory photographs and not like a texture.</p>
    </Txt>
  </>
);

// ------------------------------------------------------------------------------- 05 ground
const IMAGERY: Array<[string, string, string, string, number]> = [
  ['Earth', 'Sentinel-2 cloudless 2016, 10 m', 'EOX WMTS', '≈ 9.5 m/px', 13], ['Moon', 'SELENE/Kaguya Terrain Camera', 'NASA Moon Trek', '≈ 21 m/px', 14], ['Mars', 'MRO CTX global mosaic, tinted', 'Trek → Esri cache', '≈ 10 m/px', 16],
  ['Mercury', 'MESSENGER MDIS BDR mosaic', 'NASA Mercury Trek', '≈ 234 m/px', 15], ['Venus', 'Magellan radar (SAR) mosaic', 'USGS Astrogeology', '≈ 290 m/px', 17],
];
const C5: React.FC = () => (
  <>
    <Opener n="05" kicker="Surface imagery" title={<>Down to the <em>ground</em></>}>
      <div className="op-wide a-p" style={{ height: 250 }}>
        <Ink src={{ kind: 'image', url: `${base}textures/2k_earth_daymap.jpg` }} spot="green" cell={3.6} gain={2.8} alt="The real map of Earth" />
      </div>
      <Txt cols={2} style={{ marginTop: 12 }}>
        <p>Fly close to Earth, the Moon, Mars, Mercury or Venus and the globe turns into real spacecraft imagery, sharper the closer you go.</p>
        <p>Below 2.5 planet radii, Solaris starts streaming map tiles from public servers using WMTS, the same idea as Google Maps. Only tiles near where you are looking are fetched, coarse to fine and nearest first, six at a time, chosen by screen-space error. Until a tile arrives, its blurrier parent stands in, so there are never holes.</p>
        <p>No server needs a key. Every endpoint was tested from GitHub’s servers, posing as the live site: which zoom levels really answer, and whether the server lets other websites use its images (CORS). The results are saved in docs/research.</p>
        <p>Below 1.5 radii the camera rotates with the planet, so the ground stays put. Earth’s clouds fade away, and a “Real sunlight” switch keeps the true day and night.</p>
      </Txt>
    </Opener>
  </>
);
const C5Tiles: React.FC = () => (
  <>
    <Plate n="VIII" title="A level-of-detail pyramid: each level four times sharper. Earth goes down to level 13. At most six requests run at once.">
      <TilesPlate />
    </Plate>
    <Band tone="orange" size={27}>WHERE EVERY SURFACE COMES FROM</Band>
    <table className="spec a-f">
      <thead><tr><th>World</th><th>Imagery</th><th>Served by</th><th>Finest</th></tr></thead>
      <tbody>{IMAGERY.map(([w, i, s, f, r]) => <tr key={w}><td><b>{w}</b><Ref n={r} /></td><td>{i}</td><td>{s}</td><td><b>{f}</b></td></tr>)}</tbody>
    </table>
    <Grid cols="170px 1fr" rows="1fr" style={{ gap: 10 }}>
      <P bare ar="1 / 1"><Vela eyes="squint" mouth="flat" arms="point" costume="hardhat" size={140} x={10} b={2} /></P>
      <P tone="green" ar="16 / 9">
        <Say x={14} y={14} w={470} tail="none" shout>Honest labels matter. Venus says “radar, not visible light”. The Moon and Mercury say “monochrome”. The giants say <b>“cloud tops”</b>, because they have no ground at all.</Say>
      </P>
    </Grid>
    <Txt><p>The finest level is set by the data: Solaris allows twice over-zoom of the sharpest tiles, and no more. Landmarks are marked on five worlds, from Everest and Tranquility Base to Olympus Mons, Caloris and Maat Mons, with coordinates saved from Wikipedia’s records<Ref n={29} />.</p></Txt>
  </>
);

// ------------------------------------------------------------------------------- 06 skies
const C6: React.FC = () => (
  <>
    <Opener n="06" kicker="Standing on other worlds" title={<>Stand anywhere, and <em>look up</em></>}>
      <Grid cols="1fr" rows="1fr" style={{ marginTop: 10 }}>
        <P tone="ink" ar="16 / 9"><Clip name="sky_saturn" spot="orange" cell={5} gain={3} alt="Sunset on Saturn's cloud tops, under the rings" />
          <Vela eyes="heart" mouth="grin" arms="up" size={110} r={18} b={70} />
          <Say x={16} y={16} w={300} tail="none">My favourite chapter. <b>Nobody has ever stood in any of these places.</b></Say>
        </P>
      </Grid>
    </Opener>
  </>
);
const SKIES: Array<[string, string, string]> = [
  ['sky_phobos_rise', 'Marsrise from Phobos', 'It is 6,000 km below your feet and covers 42 degrees of sky.'],
  ['sky_io', 'Jupiter from Io', 'Io always shows Jupiter the same face, so from this spot it never rises or sets.'],
  ['sky_enceladus', 'Saturn from Enceladus', 'The rings are edge-on, because Enceladus orbits in their plane.'],
  ['mars_dusk', 'Dusk at Meridiani Planum', 'The glow around the setting Sun is blue on Mars.'],
  ['miranda_uranus', 'Uranus from Miranda', 'Beside the Milky Way and the clouds of Carina.'],
  ['moon_earth', 'Earth from the Moon', 'About two degrees across, lit from where the Sun really is.'],
];
const C6Sky: React.FC = () => (
  <Grid cols="1fr 1fr" rows="1fr 1fr 1fr">
    {SKIES.map(([n, t, d], i) => (
      <P key={n} tone="ink" ar="16 / 10" shape={i === 2 ? 'a' : undefined}>
        <Clip name={n} spot={i % 2 ? 'orange' : 'green'} cell={4.5} gain={2.8} alt={t} />
        <Cap x={8} b={i === 2 ? 40 : 8} r={8} tone="paper"><b>{t}.</b> {d}</Cap>
      </P>
    ))}
  </Grid>
);
const C6Air: React.FC = () => (
  <>
    <Band size={30}>A PERSON ON THE SURFACE</Band>
    <Txt cols={2}>
      <p>Press “Stand here · look up” and the camera becomes a person on the ground, under that world’s own sky. Every planet and moon is placed from the real positions as seen from that exact spot, at its true angular size and its real brightness in magnitudes, worked out from its reflectivity and phase. Crescents are real crescents. Zoom the lens from 100° to 0.2° and you can see Jupiter’s moons from Earth.</p>
      <p>Skies with air get a physically based atmosphere: Rayleigh and Mie scattering, blue by day and red at dusk on Earth, butterscotch by day and blue at sunset on Mars. Venus is a dim orange overcast, and “Hide air” shows what its clouds hide. The Moon and Mercury have black skies with stars even by day. Rise and set use the almanac altitude of −0.833°, and a test checks Greenwich’s 21 June sunrise to within five minutes.</p>
    </Txt>
    <Plate n="IX" title="Earth’s first twilight went pitch black, because light only bounced once. A multiple-scattering term made it glow.">
      <AirPlate />
    </Plate>
    <Plate n="X" title="The “look up from…” rule: the spot is computed from the moon’s real orientation so the planet hangs about 40° up, on its sunlit side.">
      <StandPlate />
    </Plate>
  </>
);

// ------------------------------------------------------------------------------- 07 nebulae
const C7: React.FC = () => (
  <Opener n="07" kicker="Nebulae" title={<>Flying into a <em>photograph</em></>}>
    <div className="op-wide a-p" style={{ height: 300 }}><Clip name="nebula" spot="orange" cell={5} gain={1.7} alt="The Cosmic Cliffs in Solaris" /></div>
    <Txt cols={2} style={{ marginTop: 12 }}>
      <p>Three of the nine nebulae in Solaris are real telescope images: the Cosmic Cliffs from Webb<Ref n={25} />, Mystic Mountain from Hubble<Ref n={26} /> and the Helix from ESO’s VISTA<Ref n={27} />. They hang on the sky in their real directions, enlarged. The other six are procedural figures, placed near nebulae of their kind.</p>
      <p>A script removes each photo’s star background, softens its edges and stores it with premultiplied alpha, so it blends cleanly into the Milky Way.</p>
    </Txt>
  </Opener>
);
const C7Bands: React.FC = () => (
  <>
    <Band size={30}>ONE PHOTOGRAPH, SEVEN DEPTHS</Band>
    <div className="stack a-f" role="img" aria-label="The Cosmic Cliffs split into seven brightness bands, stacked at seven depths">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <div key={i} style={{ left: 16 + i * 62, top: 8 + i * 30, zIndex: i }}><img src={`${base}book/band-${i}.webp`} alt="" /></div>)}
      <span className="st-a">faint haze at the back</span>
      <span className="st-b">hot cores at the front</span>
    </div>
    <Txt cols={2}>
      <p>Up close a nebula is not a flat picture. It is split into seven brightness bands, each placed at its own depth and moving its own way. Some evaporate, some fire jets, and the Helix expands. Swing the camera and the layers slide past each other.</p>
      <p>The first flight to a nebula came out mirrored and upside down. The fix was one line of maths: which way is “right” when you are facing a picture in the sky.</p>
    </Txt>
    <Grid cols="1fr 1fr" rows="1fr">
      <P tone="ink" ar="16 / 10"><Clip name="nebula2" spot="orange" cell={4.5} gain={2.4} alt="The Helix Nebula" />
        <Cap x={8} b={8} tone="paper"><b>The Helix.</b> A dying star shedding its shell.</Cap></P>
      <P tone="orange" ar="16 / 10">
        <Vela eyes="happy" mouth="grin" arms="point" size={118} x={14} b={10} />
        <Say r={10} y={14} w={226} tail="sw">Our Sun will do this in <b>five billion years.</b></Say>
      </P>
    </Grid>
  </>
);

// ------------------------------------------------------------------------------- 08 black hole
const C8: React.FC = () => (
  <>
    <div className="op-k a-f" style={{ color: 'var(--paper)', borderColor: 'var(--paper)' }}><b>Chapter 08</b><span>Sagittarius A*</span></div>
    <div className="op-n a-f" style={{ color: 'var(--orange)', height: 230, fontSize: 250 }}>08</div>
    <h2 className="op-t a-f" style={{ color: 'var(--paper)' }}>The <em>heart</em> of the galaxy</h2>
    <Grid cols="1fr" rows="1fr" style={{ marginTop: 10 }}>
      <P tone="ink" ar="16 / 10" style={{ ['--bd' as string]: 'var(--paper)' }}>
        <Clip name="sgra" spot="orange" cell={5} gain={2.8} alt="Approaching Sagittarius A*" />
        <Sfx jp="ゴゴゴゴ" en="GO-GO-GO" r={16} y={14} size={54} rot={6} tone="paper" />
      </P>
    </Grid>
    <Vela eyes="wide" mouth="wobble" arms="up" sweat size={120} x={52} b={66} />
    <Say x={180} b={118} w={250} tail="sw" shout>I, um, don’t love this one.</Say>
  </>
);
const C8Facts: React.FC = () => (
  <>
    <Band tone="ink" size={26}>4.3 MILLION SUNS, 27,000 LIGHT-YEARS AWAY</Band>
    <Plate n="XI" title="The bright disc arches over the top and under the bottom, because its light is bent around the hole.">
      <BendPlate />
    </Plate>
    <Txt cols={2}>
      <p>Its numbers are real. It sits 8.277 kiloparsecs away and weighs 4.3 million Suns, both from the GRAVITY collaboration<Ref n={18} />, who weighed it by timing stars racing around it. Its shadow, 51.8 microarcseconds across, comes from the Event Horizon Telescope<Ref n={20} />: about the size of a doughnut on the Moon, seen from Earth.</p>
      <p>Its picture is an honest approximation. Solaris ray-marches an approximate bending, not a full relativistic ray-tracer. And the ocean at its shore, in the launch film, is imagined. The way the light bends over it is not.</p>
    </Txt>
    <Grid cols="1fr" rows="1fr">
      <P tone="ink" ar="16 / 9">
        <Clip name="bh_sea" spot="orange" cell={5} gain={3.4} alt="The imagined shore of Sagittarius A*" />
        <Cap x={10} y={10} w={270} tone="paper"><b>The shore of Sagittarius A*.</b> Imagined, and labelled as such.</Cap>
      </P>
    </Grid>
  </>
);

export const SCIENCE: PageDef[] = [
  { id: 'c2', node: <C2 />, tab: 'Scale', stop: '02 Scale and precision' },
  { id: 'c2-scale', node: <C2Scale />, tab: 'Scale' },
  { id: 'c2-float', node: <C2Float />, tab: 'Scale', ground: 'orange' },
  { id: 'c3', node: <C3 />, tab: 'The Sky', stop: '03 Stars and the galaxy' },
  { id: 'c3-stars', node: <C3Stars />, tab: 'The Sky' },
  { id: 'c3-gal', node: <C3Gal />, tab: 'The Sky' },
  { id: 'c4', node: <C4 />, tab: 'The Sun', stop: '04 The Sun' },
  { id: 'c4-layers', node: <C4Layers />, tab: 'The Sun' },
  { id: 'c5', node: <C5 />, tab: 'The Ground', stop: '05 Surface imagery' },
  { id: 'c5-tiles', node: <C5Tiles />, tab: 'The Ground' },
  { id: 'c6', node: <C6 />, tab: 'Other Skies', stop: '06 Other skies' },
  { id: 'c6-sky', node: <C6Sky />, tab: 'Other Skies' },
  { id: 'c6-air', node: <C6Air />, tab: 'Other Skies' },
  { id: 'c7', node: <C7 />, tab: 'Nebulae', stop: '07 Nebulae' },
  { id: 'c7-bands', node: <C7Bands />, tab: 'Nebulae' },
  { id: 'c8', node: <C8 />, tab: 'Sgr A*', ground: 'ink', stop: '08 Sagittarius A*' },
  { id: 'c8-facts', node: <C8Facts />, tab: 'Sgr A*' },
];
