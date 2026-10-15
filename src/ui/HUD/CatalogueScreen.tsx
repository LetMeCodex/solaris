import React, { useEffect, useMemo, useState } from 'react';
import { CatalogueManager } from '../../data/CatalogueManager';
import { PLANET_NARRATIVES } from '../../data/PlanetNarratives';
import { CelestialBodyDefinition } from '../../types/catalogue';
import { systemMoons } from './moonGroups';

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
  onFly: (name: string) => void;
  onSkyFrom: (body: string, facing?: string) => void;
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
  return `${(kg / Math.pow(10, e)).toFixed(2)} × 10${String(e).replace(/\d/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c])} kg`;
}

function fmtHours(h?: number): string {
  if (!h) return '—';
  const a = Math.abs(h);
  if (a < 48) return `${a.toFixed(1)} h${h < 0 ? ' (retrograde)' : ''}`;
  return `${(a / 24).toFixed(1)} days${h < 0 ? ' (retrograde)' : ''}`;
}

function fmtPeriod(days: number): string {
  if (!days) return '—';
  if (days > 700) return `${(days / 365.25).toFixed(1)} years`;
  if (days > 2) return `${fmtNum(days, 1)} days`;
  return `${(days * 24).toFixed(1)} hours`;
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
 * The catalogue as a place, not a list: the HUD steps away and the live scene behind it becomes a
 * cinematic reel of whatever is open (the inner Solar System, a planet with its moons, or one moon
 * with its planet beyond). Pick a world for its page: its story, its numbers, every known moon
 * (the ones you have visited marked), and a way to fly there or stand on it.
 */
export const CatalogueScreen: React.FC<Props> = ({ visited, current, showcase, onClose, onFly, onSkyFrom }) => {
  const [tab, setTab] = useState<Tab>('worlds');
  const [system, setSystem] = useState<string | null>(null);
  const [moon, setMoon] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [caption, setCaption] = useState('');
  const visitedSet = useMemo(() => new Set(visited), [visited]);

  // The reel: the inner system on the home page, the open world (and moon) on its page
  useEffect(() => {
    showcase.start(system, moon);
  }, [system, moon, showcase]);
  useEffect(() => () => showcase.stop(), [showcase]);
  useEffect(() => {
    const id = window.setInterval(() => setCaption(showcase.caption()), 600);
    return () => window.clearInterval(id);
  }, [showcase]);

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
    } else if (WORLDS.includes(def.name)) {
      setSystem(def.name);
      setMoon(null);
    } else {
      onFly(def.name);
      onClose();
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
  const narrative = system ? PLANET_NARRATIVES[system] : undefined;
  const moons = system ? systemMoons(system) : null;
  const moonsVisited = moons ? moons.groups.reduce((n, [, l]) => n + l.filter((m) => visitedSet.has(m.name)).length, 0) : 0;

  return (
    <div className="cat-screen" role="dialog" aria-label="Catalogue">
      <div className="cat-shade" aria-hidden />

      {/* Top bar */}
      <header className="cat-top">
        <div className="flex items-baseline gap-4">
          <span className="cat-kicker">Index · NASA JPL</span>
          <span className="cat-title">Catalogue</span>
        </div>
        <nav className="cat-tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'worlds' && !system} onClick={() => { setTab('worlds'); setSystem(null); setMoon(null); }}>Worlds</button>
          <button role="tab" aria-selected={tab === 'all' && !system} onClick={() => { setTab('all'); setSystem(null); setMoon(null); }}>All {CatalogueManager.getAllBodies().length}</button>
        </nav>
        <button className="cat-close" onClick={onClose} aria-label="Close catalogue">
          <span>Esc</span> ✕
        </button>
      </header>

      {/* Home: the worlds */}
      {!system && tab === 'worlds' && (
        <section className="cat-worlds" aria-label="Worlds">
          {WORLDS.map((name, i) => {
            const b = CatalogueManager.getBody(name)!;
            const count = CatalogueManager.getMoonsOf(name).filter((m) => m.category === 'moon').length;
            const seen = visitedSet.has(name) || name === 'Sun';
            return (
              <button key={name} className="cat-world" onClick={() => setSystem(name)} style={{ ['--d' as string]: `${i * 60}ms` }}>
                <Globe name={name} size={name === 'Sun' ? 78 : 64} color={b.physical.colorHex} />
                <span className="cat-world-name">{name}</span>
                <span className="cat-world-sub">
                  {name === 'Sun' ? 'G2V star' : `${count} moon${count === 1 ? '' : 's'}`}
                  {seen ? <i className="cat-seen" title="Visited">◆</i> : <i className="cat-unseen" title="Not visited yet">◇</i>}
                </span>
              </button>
            );
          })}
        </section>
      )}

      {/* Home: everything */}
      {!system && tab === 'all' && (
        <aside className="cat-panel cat-panel-all">
          <input autoFocus className="hud-input" placeholder={`Search ${CatalogueManager.getAllBodies().length} worlds, moons and minor bodies`} value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search the catalogue" />
          <div className="cat-filters">
            {(['all', 'planet', 'moon', 'minor'] as Filter[]).map((f) => (
              <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'planet' ? 'Planets' : f === 'moon' ? 'Moons' : 'Minor'}
              </button>
            ))}
          </div>
          <ol className="cat-list">
            {list.slice(0, 400).map((b) => (
              <li key={b.name}>
                <button onClick={() => open(b)} className="cat-row">
                  <span className="cat-dot" style={{ background: b.physical.colorHex || '#999' }} />
                  <span className="cat-row-name">{b.name}</span>
                  <span className="cat-row-sub">{b.category.replace('_', ' ')}{b.parentName ? ` · ${b.parentName}` : ''}</span>
                  {visitedSet.has(b.name) && <i className="cat-seen" title="Visited">◆</i>}
                </button>
              </li>
            ))}
          </ol>
        </aside>
      )}

      {/* A world's page */}
      {system && def && (
        <aside className="cat-panel cat-panel-world" key={system}>
          <button className="cat-back" onClick={() => (moon ? setMoon(null) : setSystem(null))}>
            ‹ {moon ? system : 'All worlds'}
          </button>
          {!moonDef && (
            <>
              <div className="cat-eyebrow">
                {def.category === 'star' ? 'Star · the centre of everything' : `${def.category === 'dwarf_planet' ? 'Dwarf planet' : 'Planet'} · ${ORDINAL[def.orderFromSun] ?? ''} from the Sun`}
              </div>
              <h2 className="cat-name">{def.name}</h2>
              {narrative && <p className="cat-lede">{narrative.monographText.toLowerCase().replace(/(^|\. )([a-z])/g, (m) => m.toUpperCase())}</p>}
              <dl className="cat-data">
                <div><dt>Radius</dt><dd>{fmtNum(def.physical.meanRadiusKm)} km</dd></div>
                <div><dt>Mass</dt><dd>{fmtMass(def.physical.massKg)}</dd></div>
                <div><dt>Day</dt><dd>{fmtHours(def.physical.rotationPeriodHours)}</dd></div>
                <div><dt>Year</dt><dd>{def.category === 'star' ? '—' : fmtPeriod(def.orbit.orbitalPeriodDays)}</dd></div>
                <div><dt>From the Sun</dt><dd>{def.category === 'star' ? '—' : `${def.orbit.semiMajorAxisAU.toFixed(2)} AU`}</dd></div>
                <div><dt>Moons</dt><dd>{moons?.count ?? 0}{moons && moons.count > 0 ? <span className="cat-dim"> · {moonsVisited} visited</span> : null}</dd></div>
              </dl>
              {narrative && <p className="cat-lore">{narrative.extendedLore}</p>}
              <div className="cat-actions">
                <button className="cat-cta" onClick={() => { onFly(def.name); onClose(); }}>Fly there</button>
                {def.category !== 'star' && !['Jupiter', 'Saturn', 'Uranus', 'Neptune'].includes(def.name) && (
                  <button className="cat-ghost" onClick={() => { onSkyFrom(def.name); onClose(); }}>Stand on it · look up</button>
                )}
              </div>
              {narrative && narrative.missions.length > 0 && (
                <div className="cat-missions">
                  <span className="cat-h">Missions</span>
                  {narrative.missions.slice(0, 4).map((m) => (
                    <div key={m.name} className="cat-mission"><b>{m.name}</b> <span>{m.year} · {m.agency}</span><em>{m.role}</em></div>
                  ))}
                </div>
              )}
            </>
          )}

          {moonDef && (
            <>
              <div className="cat-eyebrow">Moon of {moonDef.parentName}{moonDef.group ? ` · ${moonDef.group}` : ''}</div>
              <h2 className="cat-name cat-name-sm">{moonDef.name}</h2>
              <p className="cat-lede">{moonDef.description}</p>
              <dl className="cat-data">
                <div><dt>Diameter</dt><dd>{fmtNum(moonDef.physical.meanRadiusKm * 2, moonDef.physical.meanRadiusKm < 5 ? 1 : 0)} km</dd></div>
                <div><dt>Orbit</dt><dd>{fmtNum(moonDef.orbit.semiMajorAxisKm)} km</dd></div>
                <div><dt>Goes round in</dt><dd>{fmtPeriod(moonDef.orbit.orbitalPeriodDays)}</dd></div>
                <div><dt>Direction</dt><dd>{moonDef.orbit.inclinationDeg > 90 ? 'Retrograde' : 'Prograde'}</dd></div>
                {moonDef.discoveryYear && <div><dt>Discovered</dt><dd>{moonDef.discoveryYear}</dd></div>}
                <div><dt>You</dt><dd>{visitedSet.has(moonDef.name) ? 'Visited ◆' : 'Not visited yet ◇'}</dd></div>
              </dl>
              <div className="cat-actions">
                <button className="cat-cta" onClick={() => { onFly(moonDef.name); onClose(); }}>Fly there</button>
                <button className="cat-ghost" onClick={() => { onSkyFrom(moonDef.name, moonDef.parentName); onClose(); }}>Stand on it · look up</button>
              </div>
            </>
          )}

          {moons && moons.count > 0 && (
            <div className="cat-moons">
              <span className="cat-h">Every known moon · {moons.count}</span>
              {moons.groups.map(([label, ms]) => (
                <div key={label} className="cat-moon-group">
                  <span className="cat-moon-label">{label} · {ms.length}</span>
                  <div className="cat-moon-chips">
                    {ms.map((m) => (
                      <button
                        key={m.name}
                        className={`cat-chip ${visitedSet.has(m.name) ? 'is-seen' : ''} ${moon === m.name ? 'is-on' : ''}`}
                        onClick={() => setMoon(m.name)}
                        title={`${m.name} · ${fmtNum(m.physical.meanRadiusKm * 2, 1)} km`}
                      >
                        {visitedSet.has(m.name) ? '◆ ' : ''}{m.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      )}

      {/* The reel's caption */}
      <footer className="cat-caption" aria-live="off">
        <span className="cat-live" /> Live · real positions · 1 h per second{caption ? ` · ${caption}` : ''}
        {current && !system ? <span className="cat-dim"> · you are at {current}</span> : null}
      </footer>
    </div>
  );
};

export default CatalogueScreen;
