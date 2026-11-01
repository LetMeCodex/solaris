import React from 'react';
import { SOLAR_SYSTEM_BODIES } from '../../astronomy/SolarSystemData';
import { REFS } from '../../report/refs';
import { TERMS } from '../../report/terms';
import { Arrow, Band, Ink, Opener, Ref, Roundel, Say, Sfx, Txt, Vela } from '../kit';
import type { PageDef } from './registry';

// ------------------------------------------------------------------------------- the planets, as a catalogue
const MAPS: Record<string, string> = { Mercury: '2k_mercury.jpg', Venus: '2k_venus_atmosphere.jpg', Earth: '2k_earth_daymap.jpg', Mars: '2k_mars.jpg', Jupiter: '2k_jupiter.jpg', Saturn: '2k_saturn.jpg', Uranus: '2k_uranus.jpg', Neptune: '2k_neptune.jpg' };
const PLANETS = SOLAR_SYSTEM_BODIES.filter((b) => b.category === 'planet');
const light = (au: number) => {
  const t = Math.round(au * 499.004784);
  return `${Math.floor(t / 3600)} h ${String(Math.floor((t % 3600) / 60)).padStart(2, '0')} m ${String(t % 60).padStart(2, '0')} s`;
};
const period = (d: number) => (d < 700 ? `${d.toFixed(1)} days` : `${(d / 365.25).toFixed(1)} years`);
const World: React.FC<{ b: (typeof PLANETS)[number]; i: number }> = ({ b, i }) => (
  <div className="wc">
    <div className="wc-art">
      <Ink src={{ kind: 'globe', map: MAPS[b.name], spin: 0.5, tilt: ((b.physical.axialTiltDeg ?? 0) * Math.PI) / 180 * (Math.abs(b.physical.axialTiltDeg ?? 0) > 90 ? 0.4 : 1), ring: b.name === 'Saturn' }} spot={i % 2 ? 'green' : 'orange'} cell={4} gain={1.7} alt={`${b.name}, turning`} />
    </div>
    <div className="wc-b">
      <Band size={25}>{b.name.toUpperCase()}</Band>
      <dl>
        <div><dt>Radius</dt><dd>{Math.round(b.physical.meanRadiusKm).toLocaleString('en-US')} km</dd></div>
        <div><dt>From the Sun</dt><dd>{b.orbit.semiMajorAxisAU?.toFixed(3)} AU</dd></div>
        <div><dt>Sunlight takes</dt><dd>{light(b.orbit.semiMajorAxisAU ?? 0)}</dd></div>
        <div><dt>Year</dt><dd>{period(b.orbit.orbitalPeriodDays)}</dd></div>
        <div><dt>Axial tilt</dt><dd>{(b.physical.axialTiltDeg ?? 0).toFixed(1)}°</dd></div>
      </dl>
    </div>
  </div>
);
const Worlds: React.FC<{ part: 0 | 1 }> = ({ part }) => (
  <>
    {part === 0 && <Txt><p><b>The Catalogue of Worlds.</b> Solaris holds 478 worlds: 8 planets, 2 dwarf planets, 9 asteroids, 22 major moons and 437 minor moons. Here are the eight planets, each on its real surface map, with figures taken straight from the data the site runs on<Ref n={1} /><Ref n={11} />.</p></Txt>}
    <div className="wcs">{PLANETS.slice(part * 4, part * 4 + 4).map((b, i) => <World key={b.name} b={b} i={i + part} />)}</div>
  </>
);

// ------------------------------------------------------------------------------- 15 sources
const C15: React.FC = () => (
  <Opener n="15" kicker="References" title={<>Every source, <em>credited</em></>}>
    <Txt cols={2} style={{ marginTop: 14 }}>
      <p className="lead">Solaris stands on decades of other people’s work: spacecraft, surveys, catalogues and papers. Here is all of it.</p>
      <p>Most of it is public domain (NASA’s data and imagery) or CC BY 4.0 (ESA, ESO and Solar System Scope’s images), which only ask for credit. The star catalogue is non-commercial, so <b>Solaris is free and will stay free</b>.</p>
      <p>The papers in this chapter are cited with their real titles and DOIs, each checked against Crossref. The full provenance, with every file and the processing applied to it, is in ASSETS.md in the repository.</p>
    </Txt>
    <Vela eyes="squint" mouth="smile" arms="hold" costume="glasses" size={150} r={0} b={0} />
    <Say x={120} b={70} w={330} tail="se">Thirty sources, eight of them research papers. <b>I read them all.</b></Say>
  </Opener>
);

const PAPERS: Array<{ ref: number; who: string; year: string; title: string; venue: string; doi: string; gave: string }> = [
  { ref: 5, who: 'Archinal, B. A. et al.', year: '2018', title: 'Report of the IAU Working Group on Cartographic Coordinates and Rotational Elements: 2015', venue: 'Celestial Mechanics and Dynamical Astronomy 130, 22', doi: '10.1007/s10569-017-9805-5', gave: 'The pole and spin of the Sun, the planets, Pluto, Ceres, Vesta, Eros, Gaspra and Ida. This is why Earth’s night side is right.' },
  { ref: 6, who: 'Lauretta, D. S. et al.', year: '2019', title: 'The unexpected surface of asteroid (101955) Bennu', venue: 'Nature 568, 55–60', doi: '10.1038/s41586-019-1033-6', gave: 'Bennu’s pole and rotation period, measured by OSIRIS-REx.' },
  { ref: 7, who: 'Watanabe, S. et al.', year: '2019', title: 'Hayabusa2 arrives at the carbonaceous asteroid 162173 Ryugu: A spinning top–shaped rubble pile', venue: 'Science 364, 268–272', doi: '10.1126/science.aav8032', gave: 'Ryugu’s pole and rotation period, measured by Hayabusa2.' },
  { ref: 18, who: 'GRAVITY Collaboration', year: '2022', title: 'Mass distribution in the Galactic Center based on interferometric astrometry of multiple stellar orbits', venue: 'Astronomy & Astrophysics 657, L12', doi: '10.1051/0004-6361/202142465', gave: 'R₀ = 8.277 kpc and M = 4.297 × 10⁶ suns: the distance to the galactic centre and the mass of Sgr A*.' },
  { ref: 19, who: 'Bennett, M. & Bovy, J.', year: '2019', title: 'Vertical waves in the solar neighbourhood in Gaia DR2', venue: 'Monthly Notices of the Royal Astronomical Society 482, 1417–1425', doi: '10.1093/mnras/sty2813', gave: 'The Sun’s height above the galactic mid-plane: 20.8 pc.' },
  { ref: 20, who: 'Event Horizon Telescope Collaboration', year: '2022', title: 'First Sagittarius A* Event Horizon Telescope Results. I. The Shadow of the Supermassive Black Hole in the Center of the Milky Way', venue: 'The Astrophysical Journal Letters 930, L12', doi: '10.3847/2041-8213/ac6674', gave: 'The size of the shadow: 51.8 ± 2.3 microarcseconds.' },
  { ref: 21, who: 'Pietrzyński, G. et al.', year: '2019', title: 'A distance to the Large Magellanic Cloud that is precise to one per cent', venue: 'Nature 567, 200–203', doi: '10.1038/s41586-019-0999-4', gave: 'The distance to the LMC: 49.59 kpc.' },
  { ref: 22, who: 'Graczyk, D. et al.', year: '2020', title: 'A Distance Determination to the Small Magellanic Cloud with an Accuracy of Better than Two Percent Based on Late-type Eclipsing Binary Stars', venue: 'The Astrophysical Journal 904, 13', doi: '10.3847/1538-4357/abbb2b', gave: 'The distance to the SMC: 62.44 kpc.' },
];
const Papers: React.FC = () => (
  <>
    <Band size={30}>THE RESEARCH PAPERS</Band>
    <div className="papers">
      {PAPERS.map((p) => (
        <article key={p.doi} className="paper a-f">
          <div className="pa-y">{p.year}<span>[{p.ref}]</span></div>
          <div>
            <h3><a href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>{p.title}</a></h3>
            <p className="pa-w">{p.who} · <i>{p.venue}</i> · doi:{p.doi}</p>
            <p className="pa-g"><b>Gave Solaris:</b> {p.gave}</p>
          </div>
        </article>
      ))}
    </div>
  </>
);

const Biblio: React.FC<{ from: number; to: number; first?: boolean }> = ({ from, to, first }) => (
  <>
    {first && (
      <div className="press-h a-f">
        <span className="ph-a">Aujourd’hui,</span>
        <span className="ph-b">Consult the<br />complete list of</span>
        <span className="ph-c">SOURCES</span>
        <span className="ph-d">30</span>
        <Arrow x={392} y={118} len={210} rot={-30} />
      </div>
    )}
    <div className="press">
      {REFS.slice(from, to).map((r, i) => {
        // a research paper is cited by its published title, and links to its DOI
        const paper = PAPERS.find((p) => p.ref === from + i + 1);
        const title = paper?.title ?? r.title;
        const url = paper ? `https://doi.org/${paper.doi}` : r.url;
        const who = paper ? `${paper.who}, ${paper.venue} (${paper.year})` : r.who;
        return (
          <p key={r.title} className="pr a-f">
            <b>[{from + i + 1}]</b> {url ? <a href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>{title}</a> : <span className="pr-t">{title}</span>}. {who}. <i>{r.use}.</i> <span className="lic">{r.licence}</span>
          </p>
        );
      })}
    </div>
  </>
);

const LICENCES: Array<[string, string, string]> = [
  ['Public domain', 'No rights reserved: NASA’s own data and images are works of the US government.', 'var(--green)'],
  ['CC BY 4.0', 'Use for anything, with credit. ESA, ESO and Solar System Scope images; the Sentinel-2 2016 edition (later years are not CC BY, so they are not used).', 'var(--orange)'],
  ['CC BY-NC 3.0 IGO', 'Non-commercial only. The Hipparcos stars carry this, which is why Solaris must stay free.', 'var(--ink)'],
  ['CC BY-SA 3.0 IGO', 'Credit and share alike: the Gaia sky map, re-encoded for depth.', 'var(--green-d)'],
  ['CC BY-SA 4.0', 'Credit and share alike: the Wikipedia coordinate records for landmarks.', 'var(--green-d)'],
  ['MIT', 'Open source: Chatterbox, and three.js’s Earth normal map and city lights.', 'var(--orange-d)'],
  ['Published paper', 'Cited for its measured values.', 'var(--ink-2)'],
  ['Public service', 'Served by NASA Trek for public use, with the credit each product asks for.', 'var(--ink-2)'],
  ['Original work', 'The soundtrack, made for the site.', 'var(--ink-2)'],
];
const Licences: React.FC = () => {
  const count = (l: string) => REFS.filter((r) => r.licence === l).length;
  return (
    <>
      <Band tone="orange" size={30}>THE LICENCES</Band>
      <div className="lics">
        {LICENCES.map(([l, d, c]) => (
          <div key={l} className="lic-r a-f">
            <b style={{ color: c }}>{count(l)}</b>
            <div><h3>{l}</h3><p>{d}</p></div>
            <span>{Array.from({ length: count(l) }, (_, i) => <i key={i} style={{ background: c }} />)}</span>
          </div>
        ))}
      </div>
      <Band size={24}>STREAMED AT RUNTIME, CREDITED ON SCREEN</Band>
      <Txt cols={2} style={{ fontSize: 15 }}>
        <p><b>Earth:</b> “Sentinel-2 cloudless by EOX IT Services GmbH (contains modified Copernicus Sentinel data 2016)”. <b>Moon:</b> JAXA/SELENE via NASA Solar System Treks. <b>Mercury:</b> NASA/JHUAPL/Carnegie Institution of Washington via NASA Solar System Treks.</p>
        <p><b>Mars:</b> NASA/JPL/MSSS, The Murray Lab, CTX mosaic. <b>Venus:</b> NASA/JPL Magellan; USGS Astrogeology Science Center. Endpoints and CORS headers were probed from GitHub Actions on 14 October 2026; see docs/research.</p>
      </Txt>
      <Txt style={{ fontSize: 15 }}><p>The asteroid belt’s 3,200 rocks are synthetic: seeded random elements between 2.12 and 3.28 AU, with Kirkwood gaps at the 3:1, 5:2, 7:3 and 2:1 resonances. The bodies without a real map use procedural textures, and say so.</p></Txt>
    </>
  );
};

// ------------------------------------------------------------------------------- 16 honesty
const NOT_REAL: Array<[string, string]> = [
  ['World size', 'Planets and moons are drawn 30× their real size by default (1× in Settings). Distances are true.'],
  ['The asteroid belt', '3,200 rocks with random orbits that follow the belt’s real structure, including the Kirkwood gaps. Statistical, not catalogued.'],
  ['Six of the nine nebulae', 'Procedural figures, placed near nebulae of their kind and enlarged. Three are real photographs.'],
  ['The galaxy from outside', 'Built on an artist’s impression; no one has photographed the Milky Way from outside.'],
  ['The black hole', 'Real mass, distance and shadow size; the light bending is an approximate ray-march, not full general relativity.'],
  ['The black-hole sea', 'An imagined world, made for a postcard. Labelled as such.'],
  ['Poster skies', 'Planets in some postcards are drawn 10× to 1000× larger, and the screen says so whenever they are.'],
  ['The giants’ skies', 'Rough models, labelled approximate. They have no ground: you stand on their cloud tops.'],
];
const C16: React.FC = () => (
  <>
    <div className="op-k a-f"><b>Chapter 16</b><span>Honesty</span></div>
    <h2 className="op-t a-f" style={{ fontSize: 76, marginTop: 8 }}>What <em>isn’t</em> real</h2>
    <Txt><p className="lead">A model is only trustworthy if it tells you where it cheats. Here is every place Solaris does.</p></Txt>
    <div className="nots">
      {NOT_REAL.map(([t, d], i) => (
        <div key={t} className="not a-f"><b>{String(i + 1).padStart(2, '0')}</b><h3>{t}</h3><p>{d}</p></div>
      ))}
    </div>
    <Vela eyes="closed" mouth="smile" arms="down" size={84} r={44} b={46} />
  </>
);

const LABEL: Record<string, string> = {
  jpl: 'JPL', elements: 'Orbital elements', kepler: 'Kepler’s equation', newton: 'Newton–Raphson', eccentricity: 'Eccentricity', tdb: 'TDB', j2000: 'J2000', julian: 'Julian Date', horizons: 'JPL Horizons', sbdb: 'Small-Body Database', iau: 'IAU WGCCRE', barycentre: 'Barycentre', float32: 'Float32', floating: 'Floating origin', worldscale: 'World scale', hipparcos: 'Hipparcos', gaia: 'Gaia', parallax: 'Parallax', wmts: 'WMTS', lod: 'Level of detail', cors: 'CORS', rayleigh: 'Rayleigh and Mie', multiscatter: 'Multiple scattering', magnitude: 'Magnitude', shader: 'Shader', fbm: 'Fractal Brownian motion', granulation: 'Granulation', limb: 'Limb darkening', prominence: 'Prominence', premultiplied: 'Premultiplied alpha', geodesic: 'Null geodesic', eht: 'Event Horizon Telescope', gravity: 'GRAVITY', chatterbox: 'Chatterbox', lufs: 'LUFS', virtualclock: 'Virtual clock', remotion: 'Remotion', vite: 'Vite', threejs: 'three.js', ccby: 'CC BY 4.0', ccbync: 'CC BY-NC', publicdomain: 'Public domain', kirkwood: 'Kirkwood gaps', lighttime: 'Light-time',
};
const ENTRIES = Object.entries(TERMS).sort((a, b) => (LABEL[a[0]] ?? a[0]).localeCompare(LABEL[b[0]] ?? b[0]));
const Glossary: React.FC<{ part: 0 | 1 }> = ({ part }) => {
  const half = 24;
  const list = part === 0 ? ENTRIES.slice(0, half) : ENTRIES.slice(half);
  return (
    <>
      {part === 0 && <Band size={30}>GLOSSARY, IN VELA’S WORDS</Band>}
      <div className="gloss">
        {list.map(([k, v]) => <p key={k}><b>{LABEL[k] ?? k}.</b> {v}</p>)}
      </div>
    </>
  );
};

const STACK: Array<[string, string]> = [
  ['three.js r170', 'WebGL rendering'], ['React 18 + TypeScript 5', 'Interface and logic'], ['Vite 5', 'Build and dev server'], ['Vitest', '142 tests, run on every push'],
  ['GSAP 3.15', 'The report’s motion, and this book’s page turns'], ['Chatterbox (Resemble AI)', 'Vela’s voice'], ['Remotion 4 + Playwright + ffmpeg', 'The launch film'], ['librosa', 'Beat tracking for the film edit'], ['GitHub Actions → Pages, and Vercel', 'Deployment'],
];
const Colophon: React.FC = () => (
  <>
    <Band tone="ink" size={30}>COLOPHON</Band>
    <table className="spec a-f">
      <thead><tr><th>Built with</th><th>For</th></tr></thead>
      <tbody>{STACK.map(([t, d]) => <tr key={t}><td><b>{t}</b></td><td>{d}</td></tr>)}</tbody>
    </table>
    <Txt cols={2}>
      <p><b>This book</b> is a web page pretending to be a printed object. Its paper is generated noise; its two inks, vermilion and green, are borrowed from Bob Noorda’s signage for the Milan Metro and the bands of a 1930s French aircraft catalogue, whose manners it also borrows, with the press collage of 1937.</p>
      <p>The moving panels are Solaris’s own footage and planet maps, halftoned live by a WebGL shader in two screens at 45° and 15°, the second plate a hair out of register, and redrawn twelve times a second, as limited animation is.</p>
      <p>Set in Alfa Slab One, Bodoni Moda, Archivo, Newsreader, Shantell Sans and Dela Gothic One, all under the SIL Open Font Licence. Every plate is drawn from the real numbers; the Float32 plate does its own rounding.</p>
      <p>Solaris’s code is MIT licensed. Third-party data, imagery and textures keep their own licences, listed in the Bibliography and in ASSETS.md.</p>
    </Txt>
    <div style={{ flex: 1 }} />
    <div className="last a-f">
      <Vela eyes="happy" mouth="grin" arms="wave1" size={120} />
      <p>That’s everything. Go and open Solaris, stand somewhere nobody has ever stood, and look up. I’ll be there. I’ll be the one talking.</p>
    </div>
  </>
);

const BackCover: React.FC = () => (
  <div className="cover">
    <div className="cv-art" style={{ flex: 1 }}>
      <Ink src={{ kind: 'globe', map: '2k_sun.jpg', spin: 0.25 }} spot="orange" cell={7} gain={1.5} alt="The Sun, turning" style={{ inset: '40px 0 0 0', height: 'calc(100% - 40px)' }} />
      <Sfx jp="ドーン" en="DŌN" x={8} y={8} size={82} rot={-6} tone="orange" />
    </div>
    <div style={{ textAlign: 'center' }}><Band size={92}>SOLARIS</Band></div>
    <div className="cv-foot">
      <Roundel dir={0} size={40} />
      <span>Every light you see has already left. solarises.vercel.app</span>
    </div>
  </div>
);

export const WORLDS: PageDef[] = [
  { id: 'worlds-a', node: <Worlds part={0} />, tab: 'The Catalogue', stop: 'Catalogue of worlds' },
  { id: 'worlds-b', node: <Worlds part={1} />, tab: 'The Catalogue' },
];

export const BACK: PageDef[] = [
  { id: 'c15', node: <C15 />, tab: 'References', stop: '15 Every source' },
  { id: 'c15-papers', node: <Papers />, tab: 'References' },
  { id: 'c15-b1', node: <Biblio from={0} to={13} first />, tab: 'The Press' },
  { id: 'c15-b2', node: <Biblio from={13} to={30} />, tab: 'The Press' },
  { id: 'c15-lic', node: <Licences />, tab: 'Licences' },
  { id: 'c16', node: <C16 />, tab: 'Honesty', stop: '16 What isn’t real' },
  { id: 'gloss-a', node: <Glossary part={0} />, tab: 'Glossary', stop: 'Glossary' },
  { id: 'gloss-b', node: <Glossary part={1} />, tab: 'Glossary' },
  { id: 'colophon', node: <Colophon />, tab: 'Colophon', stop: 'Colophon' },
  { id: 'back', node: <BackCover />, folio: false },
];
