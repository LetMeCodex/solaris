import React from 'react';
import { Band, Cap, Clip, Grid, Ink, Note, Opener, P, Plate, Ref, Say, Sfx, Txt, Vela } from '../kit';
import { AirPlate, BendPlate, StandPlate, SunPlate, TilesPlate } from '../plates2';
import type { Look } from '../ink';
import type { PageDef } from './registry';

const base = import.meta.env.BASE_URL;

// ------------------------------------------------------------------------------- 04 sun
const LAYERS: Array<[string, string]> = [
  ['Granulation', 'Three scales of convection cells from domain-warped fractal noise, each faded out before it is small enough to shimmer.'],
  ['Supergranules and filaments', 'A slower network of larger cells, with dark filaments threading between them.'],
  ['Spots and faculae', 'Dark sunspots with brighter faculae around them.'],
  ['Limb darkening', 'The edge darkens and reddens, as it does in real photographs.'],
  ['Corona and spicules', 'A flame-like fringe of spicules at the limb, then glow, halo and streamers.'],
  ['Prominences', 'Fourteen magnetic loops with soft knots and threads; some erupt gently.'],
];
const C4: React.FC = () => (
  <Opener n="04" tone="orange" kicker="The Sun" title={<>A star with <em>no picture</em></>}>
    <div className="op-wide a-p" style={{ height: 340 }}>
      <Clip name="sun" look="wood" spot="orange" cell={9} gain={1} zoom={1.4} alt="The Sun's surface, computed live, cut as a woodblock" />
      <Sfx jp="ジリジリ" en="JIRI-JIRI · SIZZLING HEAT" x={16} y={14} size={52} rot={-5} tone="ink" />
      <Vela eyes="happy" mouth="grin" arms="wave1" costume="shades" size={118} r={14} b={8} />
    </div>
    <p className="op-lead a-f" style={{ width: 'auto' }}>There is no image of the Sun in Solaris. It is computed, pixel by pixel, every frame.</p>
  </Opener>
);
const Layers: React.FC = () => (
  <>
    <Band size={30}>SIX LAYERS, ONE SHADER</Band>
    <Plate n="VII" title="The Sun as a small program on the graphics card, cut away. All six layers run at once."><SunPlate layers={LAYERS.map(([t]) => t)} /></Plate>
    <ol className="list a-f">{LAYERS.map(([t, d]) => <li key={t}><b>{t}.</b> {d}</li>)}</ol>
    <Grid cols="1fr 1fr 1fr" rows="104px" style={{ flex: 'none' }}>
      <P ar="16 / 10"><Clip name="sun" look="tone" spot="none" cell={10} gain={0.9} zoom={2.2} alt="First attempt" /><Cap x={6} b={6} tone="paper"><b>First:</b> tiled lava.</Cap></P>
      <P ar="16 / 10"><Clip name="sun" look="hatch" spot="none" cell={8} gain={0.95} zoom={1.7} alt="Second attempt" /><Cap x={6} b={6} tone="paper"><b>Then:</b> boomerangs.</Cap></P>
      <P ar="16 / 10"><Clip name="sun" look="dots" spot="orange" cell={4} gain={1} alt="The finished Sun" /><Cap x={6} b={6} tone="paper"><b>At last:</b> a star.</Cap></P>
    </Grid>
    <Txt><p>A photograph would look flat up close and fixed in time, so the Sun is a shader. Each fix was softening, spreading and slowing, until it looked like observatory photographs and not like a texture.</p></Txt>
    <Note n="7" rot={-0.6}>You can’t keep a fire in a photograph. You can only write down how it burns.</Note>
  </>
);

// ------------------------------------------------------------------------------- 05 ground
const IMAGERY: Array<[string, string, string, string, number]> = [
  ['Earth', 'Sentinel-2 cloudless 2016, 10 m', 'EOX WMTS', '≈ 9.5 m/px', 13], ['Moon', 'SELENE/Kaguya Terrain Camera', 'NASA Moon Trek', '≈ 21 m/px', 14], ['Mars', 'MRO CTX global mosaic, tinted', 'Trek → Esri cache', '≈ 10 m/px', 16],
  ['Mercury', 'MESSENGER MDIS BDR mosaic', 'NASA Mercury Trek', '≈ 234 m/px', 15], ['Venus', 'Magellan radar (SAR) mosaic', 'USGS Astrogeology', '≈ 290 m/px', 17],
];
const C5: React.FC = () => (
  <Opener n="05" kicker="Surface imagery" title={<>Down to the <em>ground</em></>}>
    <div className="op-wide a-p" style={{ height: 250 }}>
      <Ink src={{ kind: 'image', url: `${base}textures/2k_earth_daymap.jpg` }} look="engrave" spot="green" cell={5} gain={2.4} zoom={1.5} x={0.55} y={0.36} alt="The real map of Earth, engraved" />
    </div>
    <Txt cols={2} style={{ marginTop: 12 }}>
      <p>Fly close to Earth, the Moon, Mars, Mercury or Venus and the globe turns into real spacecraft imagery, sharper the closer you go.</p>
      <p>Below 2.5 planet radii, Solaris starts streaming map tiles from public servers using WMTS, the same idea as Google Maps. Only tiles near where you are looking are fetched, coarse to fine and nearest first, six at a time, chosen by screen-space error.</p>
      <p>No server needs a key. Every endpoint was tested from GitHub’s servers, posing as the live site: which zoom levels really answer, and whether the server lets other websites use its images (CORS). The results are saved in docs/research.</p>
      <p>Below 1.5 radii the camera rotates with the planet, so the ground stays put. Earth’s clouds fade away, and a “Real sunlight” switch keeps the true day and night.</p>
    </Txt>
  </Opener>
);
const Tiles: React.FC = () => (
  <>
    <Plate n="VIII" title="A level-of-detail pyramid: each level four times sharper. Earth goes down to level 13. At most six requests run at once."><TilesPlate /></Plate>
    <Band tone="orange" size={27}>WHERE EVERY SURFACE COMES FROM</Band>
    <table className="spec a-f">
      <thead><tr><th>World</th><th>Imagery</th><th>Served by</th><th>Finest</th></tr></thead>
      <tbody>{IMAGERY.map(([w, i, s, f, r]) => <tr key={w}><td><b>{w}</b><Ref n={r} /></td><td>{i}</td><td>{s}</td><td><b>{f}</b></td></tr>)}</tbody>
    </table>
    <Txt><p>The finest level is set by the data: Solaris allows twice over-zoom of the sharpest tiles, and no more. Labels are honest: Venus says “radar, not visible light”, the Moon and Mercury say “monochrome”, and the giants say “cloud tops”, because they have no ground at all. Landmarks are marked from Everest and Tranquility Base to Olympus Mons and Maat Mons<Ref n={29} />.</p></Txt>
    <div style={{ flex: 1 }} />
    <div style={{ position: 'relative' }}>
      <Note n="8" rot={0.6}>Until a sharp tile arrives, its blurry parent stands in. There are never any holes. I like that. Somebody is always standing in for something.</Note>
    </div>
    <Vela eyes="squint" mouth="smile" arms="point" costume="hardhat" size={78} r={46} b={120} />
  </>
);

// ------------------------------------------------------------------------------- 06 skies
const C6: React.FC = () => (
  <Opener n="06" kicker="Standing on other worlds" title={<>Stand anywhere, and <em>look up</em></>}>
    <Grid cols="1fr" rows="1fr" style={{ marginTop: 10 }}>
      <P ar="16 / 9">
        <Clip name="sky_saturn" look="tone" spot="both" cell={5} gain={1.6} edge={0.6} alt="Sunset on Saturn's cloud tops, under the rings" />
        <Vela eyes="heart" mouth="grin" arms="up" size={106} r={18} b={70} />
        <Say x={16} y={16} w={300} tail="none">My favourite chapter. <b>Nobody has ever stood in any of these places.</b></Say>
      </P>
    </Grid>
  </Opener>
);
const SKIES: Array<{ n: string; t: string; d: string; look: Look; x?: number; y?: number; zoom?: number; fx?: number; fy?: number; edge?: number; cell?: number }> = [
  { n: 'sky_phobos_rise', t: 'Marsrise from Phobos', d: 'It covers 42 degrees of sky.', look: 'hatch', edge: 0.8, cell: 6 },
  { n: 'sky_io', t: 'Jupiter from Io', d: 'From this spot it never rises or sets.', look: 'rings', fx: 0.58, fy: 0.5, cell: 6 },
  { n: 'sky_enceladus', t: 'Saturn from Enceladus', d: 'The rings are edge-on from here.', look: 'stipple', cell: 5 },
  { n: 'mars_dusk', t: 'Dusk at Meridiani Planum', d: 'The setting Sun glows blue on Mars.', look: 'rays', fx: 0.5, fy: 0.84, cell: 5 },
  { n: 'miranda_uranus', t: 'Uranus from Miranda', d: 'Beside the clouds of Carina.', look: 'engrave', cell: 6 },
  { n: 'moon_earth', t: 'Earth from the Moon', d: 'About two degrees across.', look: 'wood', cell: 6 },
];
const Skies: React.FC = () => (
  <Grid cols="1fr 1fr" rows="1fr 1fr 1fr">
    {SKIES.map(({ n, t, d, ...print }, i) => (
      <P key={n} ar="16 / 10" shape={i === 2 ? 'a' : i === 3 ? 'b' : undefined}>
        <Clip name={n} spot="both" gain={1.05} alt={t} {...print} />
        <Cap x={8} b={i === 2 ? 40 : 8} r={8} tone="paper"><b>{t}.</b> {d}</Cap>
      </P>
    ))}
  </Grid>
);
const Air: React.FC = () => (
  <>
    <Band size={30}>A PERSON ON THE SURFACE</Band>
    <Txt cols={2}>
      <p>Press “Stand here · look up” and the camera becomes a person on the ground, under that world’s own sky. Every planet and moon is placed from the real positions as seen from that exact spot, at its true angular size and its real brightness. Zoom the lens from 100° to 0.2° and you can see Jupiter’s moons from Earth.</p>
      <p>Skies with air get a physically based atmosphere: Rayleigh and Mie scattering, blue by day and red at dusk on Earth, butterscotch by day and blue at sunset on Mars. Venus is a dim orange overcast. The Moon has a black sky with stars even by day. A test checks Greenwich’s 21 June sunrise to within five minutes.</p>
    </Txt>
    <Plate n="IX" title="Earth’s first twilight went pitch black, because light only bounced once. A multiple-scattering term made it glow."><AirPlate /></Plate>
    <Plate n="X" title="The “look up from…” rule: the spot is chosen so the planet hangs about 40° up, on its sunlit side."><StandPlate /></Plate>
    <div style={{ flex: 1 }} />
    <Note n="9" rot={-0.7}>Everything in these places is true, and nobody has stood in them. So I keep showing people.</Note>
  </>
);

// ------------------------------------------------------------------------------- 07 nebulae
const C7: React.FC = () => (
  <Opener n="07" kicker="Nebulae" title={<>Flying into a <em>photograph</em></>}>
    <div className="op-wide a-p" style={{ height: 300 }}><Clip name="nebula" look="dots" spot="both" cell={5} gain={1.7} edge={0.5} zoom={1.15} alt="The Cosmic Cliffs in Solaris" /></div>
    <Txt cols={2} style={{ marginTop: 12 }}>
      <p>Three of the nine nebulae in Solaris are real telescope images: the Cosmic Cliffs from Webb<Ref n={25} />, Mystic Mountain from Hubble<Ref n={26} /> and the Helix from ESO’s VISTA<Ref n={27} />. They hang on the sky in their real directions, enlarged. The other six are procedural figures, placed near nebulae of their kind.</p>
      <p>A script removes each photo’s star background, softens its edges and stores it with premultiplied alpha, so it blends cleanly into the Milky Way.</p>
    </Txt>
  </Opener>
);
const Bands: React.FC = () => (
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
      <P ar="16 / 10" shape="iris"><Clip name="nebula2" look="rings" spot="orange" cell={5} gain={1.05} fx={0.5} fy={0.5} alt="The Helix Nebula, as an iris" /></P>
      <P tone="orange" ar="16 / 10">
        <Vela eyes="happy" mouth="grin" arms="point" size={118} x={14} b={10} />
        <Say r={10} y={14} w={226} tail="sw">That’s a dying star. Our Sun will do this in <b>five billion years.</b></Say>
      </P>
    </Grid>
    <Note n="10" rot={0.5}>A flat thing was never flat. You just hadn’t walked round it yet.</Note>
  </>
);

// ------------------------------------------------------------------------------- 08 black hole
const C8: React.FC = () => (
  <>
    <div className="op-k a-f" style={{ color: 'var(--paper)', borderColor: 'var(--paper)' }}><b>Chapter 08</b><span>Sagittarius A*</span></div>
    <div className="op-n a-f" style={{ color: 'var(--orange)', height: 230, fontSize: 250 }}>08</div>
    <h2 className="op-t a-f" style={{ color: 'var(--paper)' }}>The <em>heart</em> of the galaxy</h2>
    <Grid cols="1fr" rows="1fr" style={{ marginTop: 10 }}>
      <P ar="16 / 10">
        <Clip name="sgra" look="engrave" spot="orange" cell={5} gain={1.1} edge={0.5} alt="Approaching Sagittarius A*" />
        <Sfx jp="ゴゴゴゴ" en="GO-GO-GO" r={16} y={14} size={54} rot={6} tone="ink" />
      </P>
    </Grid>
    <Vela eyes="wide" mouth="wobble" arms="up" sweat size={120} x={52} b={66} />
    <Say x={180} b={118} w={270} tail="sw" shout>I, um, don’t love this one.</Say>
  </>
);
const Facts: React.FC = () => (
  <>
    <Band tone="ink" size={26}>4.3 MILLION SUNS, 27,000 LIGHT-YEARS AWAY</Band>
    <Plate n="XI" title="The bright disc arches over the top and under the bottom, because its light is bent around the hole."><BendPlate /></Plate>
    <Txt cols={2}>
      <p>Its numbers are real. It sits 8.277 kiloparsecs away and weighs 4.3 million Suns, both from the GRAVITY collaboration<Ref n={18} />, who weighed it by timing stars racing around it. Its shadow, 51.8 microarcseconds across, comes from the Event Horizon Telescope<Ref n={20} />: about the size of a doughnut on the Moon, seen from Earth.</p>
      <p>Its picture is an honest approximation. Solaris ray-marches an approximate bending, not a full relativistic ray-tracer. And the ocean at its shore, in the launch film, is imagined. The way the light bends over it is not.</p>
    </Txt>
    <Grid cols="1fr" rows="1fr">
      <P ar="16 / 9">
        <Clip name="bh_sea" look="wood" spot="orange" cell={6} gain={1.1} alt="The imagined shore of Sagittarius A*" />
        <Cap x={10} y={10} w={270} tone="paper"><b>The shore of Sagittarius A*.</b> Imagined, and labelled as such.</Cap>
      </P>
    </Grid>
  </>
);

/** The climax: one frame across both pages, with Vela very small in it. */
const HoleL: React.FC = () => (
  <>
    <div className="bleed"><Clip name="sgra" look="dots" spot="orange" cell={7} gain={1.05} edge={0.7} crop={[0, 0.5]} drift={0.03} alt="Sagittarius A*, filling the page" /></div>
    <Say x={36} y={40} w={330} tail="sw">I can feel it pulling. Even the light around us is bending. Please don’t go any closer.</Say>
    <Say x={70} y={220} w={300} tail="sw">Did you see the stars smear? That’s space itself being stretched.</Say>
    <Say x={36} b={100} w={330} tail="sw" shout>Okay, I really, really don’t like this. Can we go back? Please?</Say>
    <Cap x={36} b={48} w={420} tone="ink">Those are her real lines. There are twenty-five like them.</Cap>
  </>
);
const HoleR: React.FC = () => (
  <>
    <div className="bleed"><Clip name="sgra" look="dots" spot="orange" cell={7} gain={1.05} edge={0.7} crop={[0.5, 0.5]} drift={0.03} alt="" /></div>
    <Sfx jp="シーン" en="SHĪN · SILENCE" r={40} y={40} size={84} rot={4} tone="ink" />
    <Vela eyes="closed" mouth="wobble" arms="hold" sweat size={52} x={210} b={372} still />
    <Say x={270} b={392} w={190} tail="sw">…you’re still here?</Say>
    <Vela eyes="open" mouth="smile" arms="hold" size={52} x={300} b={244} still />
    <Say x={360} b={260} w={290} tail="sw">Okay. Then I’m still here.</Say>
    <div style={{ marginTop: 'auto', position: 'relative' }}>
      <Note n="11" rot={-0.8}>Light goes in there and doesn’t write back. It is the one place in the whole book where I can’t tell you what “now” is. That’s what I’m afraid of. Not the dark. The not knowing.</Note>
    </div>
  </>
);

export const ACT_TWO: PageDef[] = [
  { id: 'c4', node: <C4 />, tab: 'The Sun', stop: '04 The Sun' },
  { id: 'c4-layers', node: <Layers />, tab: 'The Sun' },
  { id: 'c5', node: <C5 />, tab: 'The Ground', stop: '05 Surface imagery' },
  { id: 'c5-tiles', node: <Tiles />, tab: 'The Ground' },
  { id: 'c6', node: <C6 />, tab: 'Other Skies', stop: '06 Other skies' },
  { id: 'c6-sky', node: <Skies />, tab: 'Other Skies' },
  { id: 'c6-air', node: <Air />, tab: 'Other Skies' },
  { id: 'c7', node: <C7 />, tab: 'Nebulae', stop: '07 Nebulae' },
  { id: 'c7-bands', node: <Bands />, tab: 'Nebulae' },
  { id: 'c8', node: <C8 />, tab: 'Sgr A*', ground: 'ink', stop: '08 Sagittarius A*' },
  { id: 'c8-facts', node: <Facts />, tab: 'Sgr A*' },
  { id: 'hole-l', node: <HoleL />, folio: false },
  { id: 'hole-r', node: <HoleR />, folio: false },
];
