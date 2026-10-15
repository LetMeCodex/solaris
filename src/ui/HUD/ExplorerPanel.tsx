import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ExplorerStatus } from '../../explorer/PlanetaryExplorer';
import { landmarksFor, searchLandmarks } from '../../explorer/Landmarks';
import { SkyDestinations } from './SkyDestinations';
import { systemMoons } from './moonGroups';

interface ExplorerPanelProps {
  status: ExplorerStatus | undefined;
  onFlyToLandmark: (id: string) => void;
  onDaylight: (on: boolean) => void;
  onStandHere: () => void;
  onSkyFrom: (body: string, facing?: string) => void;
  onSelectBody: (name: string) => void;
  onResetView: () => void;
  /** Open by itself when the camera is down near the surface. */
  autoOpen?: boolean;
}

const KIND_LABEL: Record<string, string> = {
  visible: 'Visible light',
  monochrome: 'Monochrome mosaic',
  radar: 'Radar (not visible light)',
  atmosphere: 'Cloud tops',
};

function fmtDistance(km: number): string {
  if (km >= 10000) return `${Math.round(km).toLocaleString('en-US')} km`;
  if (km >= 10) return `${km.toFixed(0)} km`;
  return `${km.toFixed(1)} km`;
}

function fmtResolution(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(m >= 10000 ? 0 : 1)} km/px` : `${Math.round(m)} m/px`;
}

function fmtLatLon(lat: number, lon: number): string {
  return `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`;
}


/** Altitude as a 0..1 position on a log tape from 10 km to 10 million km. */
function altFraction(km: number): number {
  return Math.min(1, Math.max(0, (Math.log10(Math.max(10, km)) - 1) / 6));
}

type SlateTab = 'survey' | 'waypoints' | 'moons' | 'skies';

function fmtSize(radiusKm: number): string {
  const d = radiusKm * 2;
  return d >= 100 ? `${Math.round(d).toLocaleString('en-US')} km` : d >= 10 ? `${d.toFixed(0)} km` : `${d.toFixed(1)} km`;
}

function fmtOrbit(km: number): string {
  return km >= 1e6 ? `${(km / 1e6).toFixed(1)}M km` : `${Math.round(km / 1000).toLocaleString('en-US')}k km`;
}

/** Tab bar whose underline glides to the chosen tab. */
const SlateTabs: React.FC<{ tab: SlateTab; onTab: (t: SlateTab) => void; counts: { waypoints: number; moons: number } }> = ({ tab, onTab, counts }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const [ink, setInk] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  useLayoutEffect(() => {
    const el = wrap.current?.querySelector<HTMLButtonElement>('button[aria-selected="true"]');
    if (el) setInk({ left: el.offsetLeft + 14, width: el.offsetWidth - 28 });
  }, [tab, counts.moons]);
  const tabs: Array<[SlateTab, string]> = [
    ['survey', 'Survey'],
    ['waypoints', `Places${counts.waypoints ? ` ${counts.waypoints}` : ''}`],
    ...(counts.moons ? ([['moons', `Moons ${counts.moons}`]] as Array<[SlateTab, string]>) : []),
    ['skies', 'Skies'],
  ];
  return (
    <div ref={wrap} className="hud-tabs" role="tablist">
      {tabs.map(([id, label]) => (
        <button key={id} role="tab" aria-selected={tab === id} onClick={() => onTab(id)}>
          {label}
        </button>
      ))}
      <span className="ink" style={{ left: ink.left, width: ink.width }} />
    </div>
  );
};

/**
 * Compact Planetary Explorer panel: breadcrumb, imagery source and honesty labels, live streaming
 * state, and landmark navigation/search. Kept small so the globe stays the focus.
 */
export const ExplorerPanel: React.FC<ExplorerPanelProps> = ({ status, onFlyToLandmark, onDaylight, onStandHere, onSkyFrom, onSelectBody, onResetView, autoOpen = false }) => {
  // Collapsed to a slim altimeter until the camera is near the ground (or the user opens it);
  // phones stay collapsed so the globe keeps the screen
  const [userOpen, setUserOpen] = useState<boolean | null>(null);
  const wide = typeof window === 'undefined' || window.innerWidth >= 640;
  const open = userOpen ?? (autoOpen && wide);
  const setOpen = (fn: (o: boolean) => boolean) => setUserOpen(fn(open));
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<SlateTab>('survey');
  const body = status?.body ?? null;

  const bodyLandmarks = useMemo(() => (body ? landmarksFor(body) : []), [body]);
  const moons = useMemo(() => (body ? systemMoons(body) : null), [body]);
  const [moonQuery, setMoonQuery] = useState('');
  const results = useMemo(() => searchLandmarks(query).slice(0, 8), [query]);
  // A new world starts from the automatic behaviour again
  useEffect(() => setUserOpen(null), [body]);

  if (!status || !body || !status.imagery) return null;
  const img = status.imagery;
  const layer = status.layer;

  let state: string;
  if (!status.streaming) {
    state = img.note && !layer ? 'Global map only' : 'Zoom in to stream detail';
  } else if (layer?.state === 'unavailable') {
    state = 'Imagery server unreachable — showing globe map';
  } else if (layer && (layer.inFlight > 0 || layer.queued > 0)) {
    state = `Loading ${layer.inFlight + layer.queued} tiles · level ${Math.max(0, layer.deepestLevel)}/${status.maxLevel}`;
  } else if (layer) {
    state = `Level ${Math.max(0, layer.deepestLevel)}/${status.maxLevel}${layer.state === 'degraded' ? ' · some tiles failed' : ''}`;
  } else {
    state = 'Global map only';
  }

  return (
    <section
      aria-label="Planetary explorer"
      className={`hud-frame hud-slide-in absolute right-3 md:right-7 top-[76px] md:top-[92px] ${open ? 'w-[300px]' : 'w-auto'} max-w-[calc(100vw-24px)] max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-480px)] [@media(max-height:620px)]:max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden hud-scroll pointer-events-auto z-30 text-white/80 font-light`}
    >
      {/* Breadcrumb */}
      <div className={`flex items-center justify-between gap-3 px-4 ${open ? 'pt-3 pb-2' : 'py-2'} text-[10px] uppercase tracking-[0.18em]`}>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0">
          <button onClick={onResetView} className="text-white/45 hover:text-white focus-visible:ring-1 focus-visible:ring-white/60 rounded">
            Solar System
          </button>
          <span className="text-white/25">›</span>
          <button onClick={() => onSelectBody(body)} className="text-white/80 hover:text-white focus-visible:ring-1 focus-visible:ring-white/60 rounded">
            {body}
          </button>
          {status.landmark && (
            <>
              <span className="text-white/25">›</span>
              <span className="text-amber-200/90 truncate">{status.landmark.name}</span>
            </>
          )}
        </nav>
        {!open && (
          <span className="hud-num text-[9.5px] tracking-[0.08em] text-[color:var(--sol-amber)] ml-auto mr-2 whitespace-nowrap">ALT {fmtDistance(status.altitudeKm)}</span>
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Collapse explorer panel' : 'Expand explorer panel'}
          className="hud-icon-btn !w-5 !h-5 text-[11px] leading-none"
        >
          <span className={`inline-block transition-transform duration-500 ${open ? 'rotate-45' : ''}`}>+</span>
        </button>
      </div>

      {open && (
        <div className="flex flex-col text-[11px]">
          <SlateTabs tab={tab} onTab={setTab} counts={{ waypoints: bodyLandmarks.length, moons: moons?.count ?? 0 }} />

          {tab === 'survey' && (
            <div key="survey" className="px-4 py-3 flex flex-col gap-3 hud-rise">
              {/* Altimeter: a log tape from 10 km to 10 million km */}
              <div aria-live="polite">
                <div className="flex items-baseline justify-between">
                  <span className="hud-label">Altitude</span>
                  {status.subCamera && <span className="hud-num text-[9.5px] text-white/50">{fmtLatLon(status.subCamera.lat, status.subCamera.lon)}</span>}
                </div>
                <div className="hud-num text-[20px] font-light text-[color:var(--sol-amber)] leading-tight mt-0.5">{fmtDistance(status.altitudeKm)}</div>
                <div className="hud-tape mt-1.5">
                  <span className="scale" />
                  <span className="needle" style={{ left: `${altFraction(status.altitudeKm) * 100}%` }} />
                </div>
                <div className="flex justify-between hud-num text-[7.5px] text-white/30 tracking-[0.1em]">
                  <span>10 km</span><span>1k</span><span>100k</span><span>10M km</span>
                </div>
              </div>

              <button onClick={onStandHere} className="hud-btn is-on w-full justify-between !py-2 !text-amber-50 group">
                <span>Stand {status.landmark ? `at ${status.landmark.name}` : 'here'} · look up</span>
                <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
              </button>

              {status.streaming && status.sunElevationDeg !== null && (
                <div className="flex items-center justify-between text-[10px] text-white/50">
                  <span>
                    {status.sunElevationDeg > 0
                      ? `☀ ${status.sunElevationDeg.toFixed(0)}° above horizon`
                      : `☾ Night side · Sun ${Math.abs(status.sunElevationDeg).toFixed(0)}° below`}
                  </span>
                  <button
                    onClick={() => onDaylight(status.lighting === 'sun')}
                    aria-current={status.lighting === 'sun' ? 'true' : undefined}
                    title="Auto lights the map evenly near the ground, like a web map; Real sun keeps the true day and night"
                    className="hud-chip"
                  >
                    Real sunlight
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 text-[10px] text-white/55">
                <span className={`hud-led ${layer && (layer.inFlight > 0 || layer.queued > 0) ? 'amber pulse' : status.streaming ? 'on' : ''}`} />
                <span>
                  {state}
                  {status.atZoomLimit && <span className="text-white/40"> · zoom limit of the source data</span>}
                </span>
              </div>

              {/* Imagery & honesty labels */}
              <div className="border-t border-white/10 pt-2.5">
                <div className="text-white/85">{img.title}</div>
                <div className="text-[10px] text-white/45 mt-0.5">
                  <span className="uppercase tracking-[0.14em] text-[color:var(--sol-ice)]">{KIND_LABEL[img.kind]}</span>
                  {' · '}best {fmtResolution(img.bestMetresPerPixel)}
                </div>
                <div className="text-[10px] text-white/40 mt-1 leading-snug">{img.coverage}</div>
                {img.note && <div className="text-[10px] text-white/40 mt-1 leading-snug">{img.note}</div>}
                <div className="text-[9px] text-white/35 mt-1 leading-snug">
                  {img.attribution} ·{' '}
                  <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">
                    {img.source}
                  </a>
                </div>
              </div>
            </div>
          )}

          {tab === 'waypoints' && (
            <div key="waypoints" className="px-3 py-3 flex flex-col gap-2 hud-rise">
              {bodyLandmarks.length === 0 && <p className="text-[10px] text-white/40 px-1">No surveyed waypoints on {body} yet.</p>}
              <ol className="flex flex-col gap-0.5">
                {bodyLandmarks.map((l, i) => (
                  <li key={l.id}>
                    <button
                      onClick={() => onFlyToLandmark(l.id)}
                      title={`${l.description} (${l.source})`}
                      aria-current={status.landmark?.id === l.id ? 'true' : undefined}
                      className="hud-row hud-rise w-full flex items-center gap-3 px-2 py-1.5 text-left"
                      style={{ ['--d' as string]: `${i * 40}ms` }}
                    >
                      <span className="hud-num text-[9px] text-[color:var(--sol-amber)] w-9 shrink-0">WP-{String(i + 1).padStart(2, '0')}</span>
                      <span className="flex-1 text-white/85 truncate">{l.name}</span>
                      <span className="hud-num text-[8.5px] text-white/35 shrink-0">{fmtLatLon(l.lat, l.lon)}</span>
                    </button>
                  </li>
                ))}
              </ol>
              {status.landmark && (
                <p className="text-[10px] text-white/55 leading-snug px-1 border-l border-[color:var(--sol-amber)] ml-1 pl-2">{status.landmark.description}</p>
              )}
              <div className="pt-1">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search waypoints on any world"
                  aria-label="Search landmarks"
                  className="hud-input"
                />
                {results.length > 0 && (
                  <ul className="mt-1.5 flex flex-col gap-0.5" role="list">
                    {results.map((l) => (
                      <li key={l.id}>
                        <button
                          onClick={() => {
                            onFlyToLandmark(l.id);
                            setQuery('');
                          }}
                          className="hud-row w-full text-left flex justify-between px-2 py-1"
                        >
                          <span className="text-white/80">{l.name}</span>
                          <span className="text-white/35">{l.body}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {tab === 'moons' && moons && moons.count > 0 && (
            <div key="moons" className="px-3 py-3 flex flex-col gap-2 hud-rise">
              <p className="text-[10px] text-white/45 px-1 leading-snug">
                Every known moon of {moons.system}, at its real distance and size (JPL). Fly to one, or stand on it and look up.
              </p>
              {moons.count > 12 && (
                <input
                  type="search"
                  value={moonQuery}
                  onChange={(e) => setMoonQuery(e.target.value)}
                  placeholder={`Search ${moons.count} moons`}
                  aria-label={`Search the moons of ${moons.system}`}
                  className="hud-input"
                />
              )}
              {moons.groups.map(([label, list]) => {
                const q = moonQuery.trim().toLowerCase();
                const shown = q ? list.filter((m) => m.name.toLowerCase().includes(q)) : list;
                if (shown.length === 0) return null;
                return (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="hud-label px-1 pt-1">
                      {label} · {list.length}
                    </span>
                    <ol className="flex flex-col gap-0.5">
                      {shown.map((m) => (
                        <li key={m.name} className="flex items-center gap-1">
                          <button
                            onClick={() => onSelectBody(m.name)}
                            title={m.description}
                            aria-current={body === m.name ? 'true' : undefined}
                            className="hud-row flex-1 min-w-0 flex items-center gap-2 px-2 py-1 text-left"
                          >
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: m.physical.colorHex || '#999' }} />
                            <span className="flex-1 text-white/85 truncate">{m.name}</span>
                            <span className="hud-num text-[8.5px] text-white/35 shrink-0">{fmtSize(m.physical.meanRadiusKm)}</span>
                            <span className="hud-num text-[8.5px] text-white/25 shrink-0 w-14 text-right">{fmtOrbit(m.orbit.semiMajorAxisKm)}</span>
                          </button>
                          <button
                            onClick={() => onSkyFrom(m.name, moons.system)}
                            title={`Stand on ${m.name} and look up at ${moons.system}`}
                            aria-label={`Stand on ${m.name} and look up`}
                            className="hud-icon-btn !w-6 !h-6 shrink-0 text-[11px]"
                          >
                            ↑
                          </button>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'skies' && (
            <div key="skies" className="px-3 py-3 hud-rise">
              <SkyDestinations current={null} onGo={onSkyFrom} />
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ExplorerPanel;
