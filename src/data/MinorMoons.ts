import { CelestialBodyDefinition } from '../types/catalogue';
import MOONS from './moons.json';

/**
 * Every other known moon, from src/data/moons.json (built by scripts/build_moon_catalogue.py):
 * JPL Horizons osculating elements around the planet's centre (ecliptic J2000, epoch 2026-10-14
 * TDB), sizes from JPL's physical-parameter table or published estimates, and families/discovery
 * years from the IAU-recognised lists. The 22 large moons keep their hand-written entries in
 * CatalogueData.ts; this adds the remaining ~440.
 */

interface MoonRow {
  id: string;
  name: string;
  parent: string;
  radiusKm: number;
  radiusSource: string;
  axesKm: number[] | null;
  gm: number | null;
  albedo: number | null;
  H: number | null;
  group: string | null;
  year: number | null;
  a: number;
  e: number;
  i: number;
  node: number;
  peri: number;
  M: number;
  n: number;
  jplA?: number | null;
}

const DATA = MOONS as { epochJd: number; moons: MoonRow[] };

const PARENT_ID: Record<string, string> = {
  Earth: '399', Mars: '499', Jupiter: '599', Saturn: '699', Uranus: '799', Neptune: '899', Pluto: '999',
};
const PARENT_ORDER: Record<string, number> = { Earth: 3, Mars: 4, Jupiter: 5, Saturn: 6, Uranus: 7, Neptune: 8, Pluto: 9 };

type Kind = NonNullable<CelestialBodyDefinition['surfaceKind']>;
const KIND_COLOR: Record<Kind, string> = { dark: '#5d5852', grey: '#8f8a84', icy: '#d9dade', red: '#9a7a62' };

/** Notable small moons: measured shapes and a line about each (NASA / JPL / Cassini results). */
const NOTABLE: Record<string, { axes?: [number, number, number]; kind?: Kind; ridge?: boolean; text: string }> = {
  Amalthea: { axes: [125, 73, 64], kind: 'red', text: 'The reddest object in the Solar System; an elongated, porous rubble pile shepherding Jupiter’s gossamer ring, so heated by tides that it glows faintly in infrared.' },
  Thebe: { axes: [58, 49, 42], kind: 'red', text: 'Small inner moon of Jupiter scarred by a crater 40 km wide, almost as large as the moon itself; it feeds the outer gossamer ring with dust.' },
  Metis: { axes: [30, 20, 17], kind: 'red', text: 'Innermost moon of Jupiter, inside the synchronous orbit; it circles the planet in 7 hours and is slowly spiralling inwards.' },
  Adrastea: { axes: [10, 8, 7], kind: 'red', text: 'Tiny inner moon of Jupiter that sweeps up dust for the main ring; one of the smallest moons Voyager ever photographed.' },
  Himalia: { kind: 'dark', text: 'Largest irregular moon of Jupiter and namesake of its family: a captured asteroid shattered into a swarm of fragments that share its orbit.' },
  Pan: { axes: [17.2, 15.4, 10.4], kind: 'icy', ridge: true, text: 'The “walnut” moon: it orbits inside Saturn’s Encke Gap and has swept ring material onto its equator, building a sharp ridge around its waist.' },
  Daphnis: { axes: [4.6, 4.5, 2.8], kind: 'icy', ridge: true, text: 'A 8-km moon inside the Keeler Gap whose gravity raises waves several kilometres tall on the edges of Saturn’s A ring.' },
  Atlas: { axes: [20.4, 17.7, 9.4], kind: 'icy', ridge: true, text: 'The “flying saucer” moon: a smooth equatorial skirt of accreted ring particles wraps its rocky core, just outside the A ring.' },
  Prometheus: { axes: [68.2, 41.6, 28.2], kind: 'icy', text: 'Shepherd of Saturn’s F ring: each orbit its gravity pulls streamers and channels out of the ring, as Cassini filmed.' },
  Pandora: { axes: [52.2, 40.8, 31.5], kind: 'icy', text: 'Outer shepherd of the F ring, blanketed in fine dust that softens its craters.' },
  Epimetheus: { axes: [64.9, 57.3, 53.0], kind: 'icy', text: 'Shares an orbit with Janus: every four years the two approach and swap places, the inner one moving out and the outer one in.' },
  Janus: { axes: [101.8, 93.0, 74.5], kind: 'icy', text: 'Co-orbital partner of Epimetheus; their orbits differ by only 50 km, so they trade places instead of colliding.' },
  Telesto: { axes: [16.3, 11.8, 9.8], kind: 'icy', text: 'Trojan moon of Tethys, riding 60° ahead of it in the same orbit; unusually smooth, coated in fine ice.' },
  Calypso: { axes: [15.3, 9.3, 6.3], kind: 'icy', text: 'Trojan moon of Tethys trailing it by 60°; one of the brightest objects in the Solar System.' },
  Helene: { axes: [22.6, 19.6, 13.3], kind: 'icy', text: 'Trojan moon of Dione, leading it by 60°; Cassini saw dust flows streaked across its surface.' },
  Polydeuces: { kind: 'icy', text: 'Trojan of Dione at the trailing point, wandering up to 30° around it.' },
  Methone: { axes: [1.94, 1.29, 1.21], kind: 'icy', text: 'An egg-shaped moon with no craters at all: perfectly smooth, probably fluffy ice settled into the shape of its gravity.' },
  Aegaeon: { kind: 'icy', text: 'Half-kilometre moonlet embedded in the G ring arc, its source of dust.' },
  Pallene: { kind: 'icy', text: 'Tiny moon between Mimas and Enceladus that sheds dust into a faint ring along its orbit.' },
  Anthe: { kind: 'icy', text: 'Kilometre-sized moonlet trapped in resonance with Mimas, with its own ring arc.' },
  Phoebe: { axes: [109.4, 108.5, 101.8], kind: 'dark', text: 'Captured from the outer Solar System, Phoebe orbits backwards far from Saturn and sheds dust into the enormous Phoebe ring, which darkens one face of Iapetus.' },
  Paaliaq: { kind: 'red', text: 'Inuit-group irregular moon of Saturn on a highly eccentric, inclined prograde orbit.' },
  Siarnaq: { kind: 'red', text: 'Largest of Saturn’s Inuit group, a reddish captured body about 40 km across.' },
  Kiviuq: { kind: 'red', text: 'Inuit-group moon of Saturn whose very elongated shape makes its brightness flicker as it spins.' },
  Ymir: { kind: 'dark', text: 'Largest of Saturn’s retrograde Norse group after Phoebe.' },
  Puck: { kind: 'dark', text: 'Largest of Uranus’ small inner moons, discovered by Voyager 2 in 1985; dark and heavily cratered.' },
  Cupid: { kind: 'dark', text: 'One of Uranus’ crowded inner moons; its orbit is predicted to collide with Belinda’s within a few million years.' },
  Mab: { kind: 'icy', text: 'Tiny moon that feeds Uranus’ blue outer µ ring with dust knocked off by impacts.' },
  Cordelia: { kind: 'dark', text: 'Inner shepherd of Uranus’ bright ε ring.' },
  Ophelia: { kind: 'dark', text: 'Outer shepherd of Uranus’ ε ring.' },
  Portia: { kind: 'dark', text: 'Largest of the Portia group of small inner moons of Uranus.' },
  Sycorax: { kind: 'red', text: 'Largest irregular moon of Uranus, red and retrograde, orbiting 12 million km out.' },
  Caliban: { kind: 'red', text: 'Second-largest irregular moon of Uranus, a captured reddish body on a backwards orbit.' },
  Proteus: { axes: [218, 208, 201], kind: 'dark', text: 'Neptune’s second-largest moon, as large as a body can be without gravity pulling it round; dark as soot and scarred by the huge Pharos crater.' },
  Larissa: { axes: [108, 102, 84], kind: 'dark', text: 'Inner moon of Neptune, slowly spiralling inwards; it will one day break up into a ring.' },
  Galatea: { kind: 'dark', text: 'Shepherd of Neptune’s Adams ring, whose clumpy arcs it holds in place by resonance.' },
  Despina: { kind: 'dark', text: 'Inner moon of Neptune, shepherd of the Le Verrier ring.' },
  Thalassa: { kind: 'dark', text: 'Inner moon of Neptune, in a dance with Naiad: the two weave around each other every 21 hours.' },
  Naiad: { kind: 'dark', text: 'Innermost moon of Neptune, its orbit tilted 5° so it weaves above and below Thalassa’s.' },
  Hippocamp: { kind: 'dark', text: 'Tiny moon found in Hubble images in 2013; probably a fragment knocked off Proteus by an impact.' },
  Nereid: { kind: 'grey', text: 'One of the most eccentric orbits of any moon: Nereid swings from 1.4 to 9.7 million km from Neptune.' },
  Halimede: { kind: 'dark', text: 'Irregular moon of Neptune, possibly a fragment of Nereid.' },
  Psamathe: { kind: 'dark', text: 'Irregular moon of Neptune orbiting 46 million km out, taking almost 25 years per lap.' },
  Neso: { kind: 'dark', text: 'The farthest known moon from its planet: Neso circles Neptune up to 72 million km away, a 27-year orbit.' },
  Nix: { axes: [25, 17, 16], kind: 'icy', text: 'Small moon of the Pluto–Charon pair, tumbling chaotically; New Horizons found a reddish crater on its bright, icy surface.' },
  Hydra: { axes: [25, 19, 17], kind: 'icy', text: 'Outermost moon of Pluto, coated in nearly pure water ice; it spins every ten hours, faster than any other moon in the system.' },
  Kerberos: { axes: [9, 6, 5], kind: 'grey', text: 'Double-lobed little moon of Pluto, darker than its siblings, between Nix and Hydra.' },
  Styx: { kind: 'icy', text: 'Smallest and innermost of Pluto’s four small moons, found by Hubble in 2012.' },
};

function kindFor(m: MoonRow): Kind {
  const g = (m.group ?? '').toLowerCase();
  if (m.parent === 'Saturn') {
    if (g.includes('inuit') || g.includes('gallic')) return 'red';
    if (g.includes('norse')) return 'dark';
    return 'icy';
  }
  if (m.parent === 'Jupiter') return g === 'inner' ? 'red' : 'dark';
  if (m.parent === 'Uranus') return m.a > 1e6 ? 'red' : 'dark';
  if (m.parent === 'Neptune') return m.a > 1e6 ? 'dark' : 'dark';
  if (m.parent === 'Pluto') return 'icy';
  return 'grey';
}

const fmt = (x: number) => Math.round(x).toLocaleString('en-US');

function describe(m: MoonRow): string {
  const notable = NOTABLE[m.name];
  if (notable) return notable.text;
  const retro = m.i > 90;
  const irregular = m.a > 3e6 || m.e > 0.15;
  const size = m.radiusKm * 2;
  const sizeText = size < 2 ? 'about a kilometre across' : `about ${size < 10 ? size.toFixed(0) : fmt(size)} km across`;
  const where = m.a >= 1e6 ? `${(m.a / 1e6).toFixed(1)} million km` : `${fmt(m.a)} km`;
  const days = 360 / Math.max(1e-9, Math.abs(m.n));
  const period = days > 365 * 1.5 ? `${(days / 365.25).toFixed(1)} years` : days > 2 ? `${days.toFixed(0)} days` : `${(days * 24).toFixed(1)} hours`;
  const family = m.group && !/^(inner|galilean)$/i.test(m.group) ? ` in the ${m.group.replace(/ group/i, '')} group` : '';
  const kind = irregular ? `${retro ? 'Retrograde' : 'Prograde'} irregular moon of ${m.parent}${family}` : `Small inner moon of ${m.parent}${family}`;
  const found = m.year ? ` Discovered ${m.year}.` : '';
  return `${kind}, ${sizeText}, orbiting ${where} out once every ${period}.${irregular ? ' Probably a captured fragment of an asteroid or comet.' : ''}${found}`;
}

/** Daphnis has no Horizons trajectory outside the Cassini era: mean elements in Pan's ring plane. */
function daphnis(rows: MoonRow[]): MoonRow | null {
  const pan = rows.find((r) => r.name === 'Pan');
  if (!pan || rows.some((r) => r.name === 'Daphnis')) return null;
  const a = 136505.5;
  return { ...pan, id: '635', name: 'Daphnis', radiusKm: 3.8, radiusSource: 'JPL SSD physical parameters', a, e: 0.0000331, M: (pan.M + 117) % 360, n: pan.n * Math.pow(pan.a / a, 1.5), year: 2005, group: 'ring-embedded' };
}

/**
 * A moon announced too recently for a usable Horizons orbit (the osculating set comes back
 * hyperbolic): keep JPL's mean distance on a circular orbit in the plane of its nearest regular
 * neighbour, with the period from Kepler's third law scaled from that neighbour.
 */
function repairUnbound(rows: MoonRow[]): MoonRow[] {
  return rows.map((m) => {
    if (m.a > 0 && m.e < 1) return m;
    const a = m.jplA ?? 0;
    const siblings = rows.filter((r) => r.parent === m.parent && r.a > 0 && r.e < 0.1 && r !== m);
    if (!a || siblings.length === 0) return { ...m, a: -1 };
    const near = siblings.reduce((b, r) => (Math.abs(r.a - a) < Math.abs(b.a - a) ? r : b));
    return { ...m, a, e: 0, i: near.i, node: near.node, peri: 0, n: near.n * Math.pow(near.a / a, 1.5), group: m.group ?? 'inner' };
  }).filter((m) => m.a > 0);
}

export function buildMinorMoons(existing: CelestialBodyDefinition[]): CelestialBodyDefinition[] {
  const have = new Set(existing.map((b) => b.name.toLowerCase()));
  const haveIds = new Set(existing.map((b) => b.id));
  const rows = repairUnbound([...DATA.moons]);
  const d = daphnis(rows);
  if (d) rows.push(d);
  const out: CelestialBodyDefinition[] = [];
  for (const m of rows) {
    if (have.has(m.name.toLowerCase()) || haveIds.has(m.id)) continue;
    const parentId = PARENT_ID[m.parent];
    if (!parentId) continue;
    const notable = NOTABLE[m.name];
    const kind = notable?.kind ?? kindFor(m);
    const axes = notable?.axes ?? (m.axesKm && m.axesKm.length === 3 ? (m.axesKm as [number, number, number]) : undefined);
    const period = 360 / Math.max(1e-9, Math.abs(m.n));
    out.push({
      id: m.id,
      name: m.name,
      category: 'moon',
      orderFromSun: PARENT_ORDER[m.parent] ?? 9,
      parentId,
      parentName: m.parent,
      physical: {
        meanRadiusKm: Math.max(0.25, m.radiusKm),
        ...(axes ? { shapeAxesKm: axes } : {}),
        ...(m.gm ? { gmKm3S2: m.gm } : {}),
        rotationPeriodHours: period * 24,
        axialTiltDeg: 0,
        colorHex: KIND_COLOR[kind],
      },
      orbit: {
        semiMajorAxisKm: m.a,
        semiMajorAxisAU: m.a / 149597870.7,
        eccentricity: m.e,
        inclinationDeg: m.i,
        longitudeAscendingNodeDeg: m.node,
        argumentPeriapsisDeg: m.peri,
        meanAnomalyAtEpochDeg: m.M,
        orbitalPeriodDays: period,
        epochJd: DATA.epochJd,
        meanMotionDegPerDay: m.n,
        source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
      },
      description: describe(m),
      group: m.group ?? undefined,
      discoveryYear: m.year ?? undefined,
      minor: true,
      surfaceKind: kind,
      ridge: notable?.ridge,
    });
  }
  return out;
}
