import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { CatalogueManager } from '../../data/CatalogueManager';
import { PLANET_NARRATIVES } from '../../data/PlanetNarratives';
import { CelestialBodyDefinition } from '../../types/catalogue';
import { systemMoons } from './moonGroups';
import { ExploredGauge } from './Atlas';
import { exploredStats, fmtPct } from './explored';

export interface ShowcaseControls {
  start: (name: string | null, hero?: string | null) => void;
  stop: () => void;
  caption: () => string;
}

interface Props {
  visited: string[];
  current: string;
  showcase: ShowcaseControls;
  onClose: () => void;
}

const WORLDS = ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
const ORDINAL = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];

type Tab = 'worlds' | 'all';
type Filter = 'all' | 'planet' | 'moon' | 'minor';

const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');

function thumb(name: string): string | null {
  const n = PLANET_NARRATIVES[name];
  return n ? base + n.textureThumb : null;
}

const fmtNum = (x: number, d = 0) => x.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 });

function fmtMass(kg?: number): string {
  if (!kg) return '—';
  const e = Math.floor(Math.log10(kg));
  return `${(kg / Math.pow(10, e)).toFixed(2)}×10${String(e).replace(/\d/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c])}`;
}

function fmtHours(h?: number): string {
  if (!h) return '—';
  const a = Math.abs(h);
  return a < 48 ? `${a.toFixed(1)} h` : `${(a / 24).toFixed(1)} d`;
}

function fmtPeriod(days: number): string {
  if (!days) return '—';
  if (days > 700) return `${(days / 365.25).toFixed(1)} yr`;
  if (days > 2) return `${fmtNum(days, 1)} d`;
  return `${(days * 24).toFixed(1)} h`;
}

function sentence(s: string): string {
  const t = s.toLowerCase();
  return t.replace(/(^|[.!?]\s+)([a-z])/g, (_m, a: string, b: string) => a + b.toUpperCase());
}

/** A small sphere wrapped in the world's real map, turning slowly. */
const Globe: React.FC<{ name: string; size: number; color?: string }> = ({ name, size, color }) => {
  const t = thumb(name);
  return (
    <span
      className="cat-globe"
      aria-hidden
      style={{
        width: size,
        height: size,
        backgroundImage: t ? `url(${t})` : undefined,
        backgroundColor: color ?? '#777',
        ['--spin' as string]: `${18 + (name.length % 5) * 4}s`,
      }}
    />
  );
};

/**
 * The Atlas: the HUD steps away and the live scene becomes a cinematic reel of whatever is open.
 * Home shows how much of the known Solar System you have explored and the procession of worlds;
 * a world's page gives its story and numbers on the left and every moon on the right (the ones
 * you have visited glowing), and picking a moon swings the camera to it.
 */
export const CatalogueScreen: React.FC<Props> = ({ visited, current, showcase, onClose }) => {
  const [tab, setTab] = useState<Tab>('worlds');
  const [system, setSystem] = useState<string | null>(null);
  const [moon, setMoon] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [caption, setCaption] = useState('');
  const [lore, setLore] = useState(false);
  const visitedSet = useMemo(() => new Set(visited), [visited]);
  const stats = useMemo(() => exploredStats(visited), [visited]);

  useEffect(() => {
    showcase.start(system, moon);
  }, [system, moon, showcase]);
  useEffect(() => () => showcase.stop(), [showcase]);
  useEffect(() => {
    const id = window.setInterval(() => setCaption(showcase.caption()), 600);
    return () => window.clearInterval(id);
  }, [showcase]);
  useEffect(() => setLore(false), [system, moon]);

  // Esc: moon → world → home → close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Ours first: the HUD's own Esc handler must not also close everything
      e.stopImmediatePropagation();
      if (moon) setMoon(null);
      else if (system) setSystem(null);
      else onClose();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [moon, system, onClose]);

  const open = (def: CelestialBodyDefinition) => {
    if (def.category === 'moon' && def.parentName) {
      setSystem(def.parentName);
      setMoon(def.name);
    } else {
      setSystem(def.name);
      setMoon(null);
    }
  };

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CatalogueManager.getAllBodies().filter((b) => {
      if (filter === 'planet' && b.category !== 'planet' && b.category !== 'star') return false;
      if (filter === 'moon' && b.category !== 'moon') return false;
      if (filter === 'minor' && b.category !== 'asteroid' && b.category !== 'dwarf_planet') return false;
      if (!q) return true;
      return b.name.toLowerCase().includes(q) || (b.parentName ?? '').toLowerCase().includes(q) || (b.group ?? '').toLowerCase().includes(q);
    });
  }, [query, filter]);

  const def = system ? CatalogueManager.getBody(system) : undefined;
  const moonDef = moon ? CatalogueManager.getBody(moon) : undefined;
  const subject = moonDef ?? def;
  const narrative = subject ? PLANET_NARRATIVES[subject.name] : undefined;
  const moons = system ? systemMoons(system) : null;
  const moonsVisited = moons ? moons.groups.reduce((n, [, l]) => n + l.filter((m) => visitedSet.has(m.name)).length, 0) : 0;
  const biggestMoon = moons ? Math.max(1, ...moons.groups.flatMap(([, l]) => l.map((m) => m.physical.meanRadiusKm))) : 1;
  const leftToFind = stats.total - stats.done;

  const ui = (
    <div className="cat-screen" role="dialog" aria-label="Atlas">
      <div className="cat-shade" aria-hidden />
      <div className="cat-grain" aria-hidden />

      <header className="cat-top">
        <button className="cat-brand" onClick={() => { setTab('worlds'); setSystem(null); setMoon(null); }}>
          <span className="cat-kicker">Atlas</span>
          <span className="cat-title">Every known world</span>
        </button>
        <nav className="cat-tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'worlds' && !system} onClick={() => { setTab('worlds'); setSystem(null); setMoon(null); }}>Worlds</button>
          <button role="tab" aria-selected={tab === 'all' && !system} onClick={() => { setTab('all'); setSystem(null); setMoon(null); }}>Index · {CatalogueManager.getAllBodies().length}</button>
        </nav>
        <div className="cat-mini">
          <span className="cat-mini-pct">{fmtPct(stats.pct)}%</span>
          <span className="cat-mini-bar"><i style={{ width: `${Math.max(1.5, stats.pct)}%` }} /></span>
        </div>
        <button className="cat-close" onClick={onClose} aria-label="Close the Atlas">
          <span>Esc</span>
        </button>
      </header>

      {/* Home: how far you have come, and the worlds */}
      {!system && tab === 'worlds' && (
        <>
          <section className="cat-hero" aria-label="Explored">
            <ExploredGauge stats={stats} size={176} />
            <p className="cat-hero-line">
              {stats.done === 0
                ? <>Nowhere yet. <b>{stats.total}</b> worlds are waiting.</>
                : <>You have been to <b>{stats.done}</b> of the <b>{stats.total}</b> known worlds. <b>{leftToFind}</b> still waiting.</>}
            </p>
          </section>
          <section className="cat-worlds" aria-label="Worlds">
            {WORLDS.map((name, i) => {
              const b = CatalogueManager.getBody(name)!;
              const count = CatalogueManager.getMoonsOf(name).filter((m) => m.category === 'moon').length;
              const seen = visitedSet.has(name);
              const seenMoons = CatalogueManager.getMoonsOf(name).filter((m) => visitedSet.has(m.name)).length;
              return (
                <button key={name} className={`cat-world ${seen ? 'is-seen' : ''}`} onClick={() => setSystem(name)} style={{ ['--d' as string]: `${i * 60}ms` }}>
                  <span className="cat-world-orbit" aria-hidden>
                    <Globe name={name} size={name === 'Sun' ? 74 : 60} color={b.physical.colorHex} />
                  </span>
                  <span className="cat-world-name">{name}</span>
                  <span className="cat-world-sub">
                    {name === 'Sun' ? 'our star' : count ? `${seenMoons}/${count} moons` : seen ? 'visited' : 'not yet'}
                  </span>
                </button>
              );
            })}
          </section>
        </>
      )}

      {/* Index of everything */}
      {!system && tab === 'all' && (
        <aside className="cat-panel cat-panel-all">
          <input autoFocus className="cat-search" placeholder={`Search ${CatalogueManager.getAllBodies().length} worlds, moons and small bodies`} value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search the Atlas" />
          <div className="cat-filters">
            {(['all', 'planet', 'moon', 'minor'] as Filter[]).map((f) => (
              <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'planet' ? 'Planets' : f === 'moon' ? 'Moons' : 'Small'}
              </button>
            ))}
            <span className="cat-count">{list.length}</span>
          </div>
          <ol className="cat-list">
            {list.slice(0, 480).map((b) => (
              <li key={b.name}>
                <button onClick={() => open(b)} className={`cat-row ${visitedSet.has(b.name) ? 'is-seen' : ''}`}>
                  <span className="cat-dot" style={{ background: b.physical.colorHex || '#999' }} />
                  <span className="cat-row-name">{b.name}</span>
                  <span className="cat-row-sub">{b.category === 'dwarf_planet' ? 'dwarf' : b.category}{b.parentName ? ` · ${b.parentName}` : ''}</span>
                </button>
              </li>
            ))}
          </ol>
        </aside>
      )}

      {/* A world (or one of its moons) */}
      {system && subject && (
        <>
          <aside className="cat-dossier" key={subject.name}>
            <button className="cat-back" onClick={() => (moon ? setMoon(null) : setSystem(null))}>
              <span aria-hidden>←</span> {moon ? system : 'All worlds'}
            </button>
            <div className="cat-eyebrow">
              {subject.category === 'star'
                ? 'Star · the centre of everything'
                : subject.category === 'moon'
                  ? `Moon of ${subject.parentName}${subject.group ? ` · ${subject.group}` : ''}`
                  : `${subject.category === 'dwarf_planet' ? 'Dwarf planet' : 'Planet'} · ${ORDINAL[subject.orderFromSun] ?? ''} from the Sun`}
              {visitedSet.has(subject.name) ? <span className="cat-badge">◆ Visited</span> : subject.category !== 'star' ? <span className="cat-badge is-off">◇ Not yet</span> : null}
            </div>
            <h2 className="cat-name" data-name={subject.name}>{subject.name}</h2>
            <p className="cat-lede">{narrative ? sentence(narrative.monographText) : subject.description}</p>

            <dl className="cat-spec">
              {subject.category === 'moon' ? (
                <>
                  <div><dt>Diameter</dt><dd>{fmtNum(subject.physical.meanRadiusKm * 2, subject.physical.meanRadiusKm < 5 ? 1 : 0)}<small>km</small></dd></div>
                  <div><dt>Orbit</dt><dd>{subject.orbit.semiMajorAxisKm >= 1e6 ? `${(subject.orbit.semiMajorAxisKm / 1e6).toFixed(2)}` : fmtNum(subject.orbit.semiMajorAxisKm / 1000, 0)}<small>{subject.orbit.semiMajorAxisKm >= 1e6 ? 'M km' : 'k km'}</small></dd></div>
                  <div><dt>Lap</dt><dd>{fmtPeriod(subject.orbit.orbitalPeriodDays)}</dd></div>
                  <div><dt>Direction</dt><dd>{subject.orbit.inclinationDeg > 90 ? 'Backwards' : 'Forwards'}</dd></div>
                  <div><dt>Found</dt><dd>{subject.discoveryYear ?? '—'}</dd></div>
                  <div><dt>Moon of</dt><dd>{subject.parentName}</dd></div>
                </>
              ) : (
                <>
                  <div><dt>Radius</dt><dd>{fmtNum(subject.physical.meanRadiusKm)}<small>km</small></dd></div>
                  <div><dt>Mass</dt><dd>{fmtMass(subject.physical.massKg)}<small>kg</small></dd></div>
                  <div><dt>Day</dt><dd>{fmtHours(subject.physical.rotationPeriodHours)}</dd></div>
                  <div><dt>Year</dt><dd>{subject.category === 'star' ? '—' : fmtPeriod(subject.orbit.orbitalPeriodDays)}</dd></div>
                  <div><dt>From Sun</dt><dd>{subject.category === 'star' ? '—' : subject.orbit.semiMajorAxisAU.toFixed(2)}{subject.category === 'star' ? null : <small>AU</small>}</dd></div>
                  <div><dt>Moons</dt><dd>{moons?.count ?? 0}</dd></div>
                </>
              )}
            </dl>

            {narrative && (
              <div className={`cat-lore ${lore ? 'is-open' : ''}`}>
                <p>{narrative.extendedLore}</p>
                <button onClick={() => setLore((v) => !v)}>{lore ? 'Less' : 'More'}</button>
              </div>
            )}

            {narrative && narrative.missions.length > 0 && (
              <div className="cat-missions">
                <span className="cat-h">Who has been there</span>
                <ol className="cat-timeline">
                  {narrative.missions.slice(0, 5).map((m) => (
                    <li key={m.name} title={m.role}>
                      <i aria-hidden />
                      <span className="cat-tl-year">{m.year}</span>
                      <span className="cat-tl-name">{m.name}</span>
                      <span className="cat-tl-agency">{m.agency}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </aside>

          {moons && moons.count > 0 && (
            <aside className="cat-moonrail" aria-label={`Moons of ${moons.system}`}>
              <div className="cat-moonrail-head">
                <ExploredGauge
                  size={64}
                  legend={false}
                  stats={{ done: moonsVisited, total: moons.count, pct: (moonsVisited / moons.count) * 100, parts: { worlds: { label: '', done: 0, total: 0 }, moons: { label: 'Moons', done: moonsVisited, total: moons.count }, minor: { label: '', done: 0, total: 0 } } }}
                />
                <div>
                  <span className="cat-h !m-0">Moons of {moons.system}</span>
                  <span className="cat-moonrail-count"><b>{moonsVisited}</b> of {moons.count} visited</span>
                </div>
              </div>
              <div className="cat-moonrail-list">
                {moons.groups.map(([label, ms]) => (
                  <div key={label} className="cat-moon-group">
                    <span className="cat-moon-label">{label}<em>{ms.length}</em></span>
                    {ms.map((m) => {
                      const dot = 3 + 9 * Math.sqrt(m.physical.meanRadiusKm / biggestMoon);
                      return (
                        <button
                          key={m.name}
                          className={`cat-moonrow ${visitedSet.has(m.name) ? 'is-seen' : ''} ${moon === m.name ? 'is-on' : ''}`}
                          onClick={() => setMoon(m.name)}
                        >
                          <span className="cat-moondot" style={{ width: dot, height: dot, background: m.physical.colorHex || '#999' }} />
                          <span className="cat-moonname">{m.name}</span>
                          <span className="cat-moonsize">{fmtNum(m.physical.meanRadiusKm * 2, m.physical.meanRadiusKm < 5 ? 1 : 0)} km</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </aside>
          )}
        </>
      )}

      <footer className="cat-caption" aria-live="off">
        <span className="cat-live" /> Live · real positions · 1 h per second{caption ? ` · ${caption}` : ''}
        {current && !system ? <span className="cat-dim"> · you are at {current}</span> : null}
      </footer>
    </div>
  );
  return createPortal(ui, document.body);
};

export default CatalogueScreen;
