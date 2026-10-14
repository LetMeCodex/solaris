import React, { useMemo, useState } from 'react';
import { ExplorerStatus } from '../../explorer/PlanetaryExplorer';
import { landmarksFor, searchLandmarks } from '../../explorer/Landmarks';

interface ExplorerPanelProps {
  status: ExplorerStatus | undefined;
  onFlyToLandmark: (id: string) => void;
  onDaylight: (on: boolean) => void;
  onSelectBody: (name: string) => void;
  onResetView: () => void;
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

/**
 * Compact Planetary Explorer panel: breadcrumb, imagery source and honesty labels, live streaming
 * state, and landmark navigation/search. Kept small so the globe stays the focus.
 */
export const ExplorerPanel: React.FC<ExplorerPanelProps> = ({ status, onFlyToLandmark, onDaylight, onSelectBody, onResetView }) => {
  // Start collapsed on narrow (phone) screens so the globe stays visible
  const [open, setOpen] = useState(() => typeof window === 'undefined' || window.innerWidth >= 640);
  const [query, setQuery] = useState('');
  const body = status?.body ?? null;

  const bodyLandmarks = useMemo(() => (body ? landmarksFor(body) : []), [body]);
  const results = useMemo(() => searchLandmarks(query).slice(0, 8), [query]);

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
      className="absolute right-3 md:right-6 bottom-20 md:bottom-24 w-[300px] max-w-[calc(100vw-24px)] pointer-events-auto z-30 bg-black/55 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white/80 font-light"
    >
      {/* Breadcrumb */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 text-[10px] uppercase tracking-[0.18em]">
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
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Collapse explorer panel' : 'Expand explorer panel'}
          className="text-white/40 hover:text-white px-1 focus-visible:ring-1 focus-visible:ring-white/60 rounded"
        >
          {open ? '–' : '+'}
        </button>
      </div>

      {open && (
        <div className="px-4 pb-3 flex flex-col gap-2.5 text-[11px]">
          {/* Live state */}
          <div className="flex justify-between font-mono text-[10px] text-amber-200/90" aria-live="polite">
            <span>ALT {fmtDistance(status.altitudeKm)}</span>
            {status.subCamera && <span>{fmtLatLon(status.subCamera.lat, status.subCamera.lon)}</span>}
          </div>
          {status.streaming && status.sunElevationDeg !== null && (
            <div className="flex items-center justify-between text-[10px] text-white/50">
              <span>
                {status.sunElevationDeg > 0
                  ? `Sun ${status.sunElevationDeg.toFixed(0)}° above horizon`
                  : `Night side · Sun ${Math.abs(status.sunElevationDeg).toFixed(0)}° below horizon`}
              </span>
              <button
                onClick={() => onDaylight(!status.daylight)}
                aria-pressed={status.daylight}
                title="Light the imagery evenly instead of by the real Sun angle at this moment"
                className={`px-2 py-0.5 rounded-full border transition ${
                  status.daylight ? 'border-amber-300/50 text-amber-100 bg-amber-300/10' : 'border-white/15 text-white/60 hover:text-white'
                }`}
              >
                Daylight view
              </button>
            </div>
          )}
          <div className="text-[10px] text-white/55">
            {state}
            {status.atZoomLimit && <span className="text-white/40"> · zoom limit of the source data</span>}
          </div>

          {/* Imagery & honesty labels */}
          <div className="border-t border-white/10 pt-2">
            <div className="text-white/85">{img.title}</div>
            <div className="text-[10px] text-white/45 mt-0.5">
              <span className="uppercase tracking-[0.14em] text-white/60">{KIND_LABEL[img.kind]}</span>
              {' · '}best {fmtResolution(img.bestMetresPerPixel)}
            </div>
            <div className="text-[10px] text-white/40 mt-1 leading-snug">{img.coverage}</div>
            {img.note && <div className="text-[10px] text-white/40 mt-1 leading-snug">{img.note}</div>}
            <a
              href={img.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-white/45 underline hover:text-white/80 mt-1 inline-block"
            >
              {img.source}
            </a>
          </div>

          {/* Landmarks */}
          {bodyLandmarks.length > 0 && (
            <div className="border-t border-white/10 pt-2">
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1.5">Landmarks</div>
              <div className="flex flex-wrap gap-1.5">
                {bodyLandmarks.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => onFlyToLandmark(l.id)}
                    title={`${l.description} (${fmtLatLon(l.lat, l.lon)} · ${l.source})`}
                    aria-current={status.landmark?.id === l.id ? 'true' : undefined}
                    className={`px-2 py-0.5 rounded-full border text-[10px] transition ${
                      status.landmark?.id === l.id
                        ? 'border-amber-300/50 text-amber-100 bg-amber-300/10'
                        : 'border-white/15 text-white/65 hover:text-white hover:border-white/35'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {status.landmark && (
            <div className="text-[10px] text-white/55 leading-snug">
              {status.landmark.description}
              <div className="text-white/35 mt-0.5">
                {fmtLatLon(status.landmark.lat, status.landmark.lon)} · {status.landmark.source}
              </div>
            </div>
          )}

          {/* Search across all bodies */}
          <div className="border-t border-white/10 pt-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search landmarks on any world"
              aria-label="Search landmarks"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white placeholder:text-white/30 outline-none focus:border-white/35"
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
                      className="w-full text-left flex justify-between px-2 py-1 rounded-md hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-white/60"
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
    </section>
  );
};

export default ExplorerPanel;
