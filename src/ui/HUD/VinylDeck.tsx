import React, { useEffect, useRef, useState } from 'react';
import { coverUrl, music, MusicState, TRACKS, trackFor } from '../../audio/music';

/**
 * The record player: a small vinyl turning in 3D at the top right, its tonearm on the record while
 * the soundtrack plays. Tap it for the album: every track, play / skip / seek, volume, and whether
 * the music follows the planets or plays the album through.
 */

function useMusic(): MusicState {
  const [s, setS] = useState(music.state);
  useEffect(() => music.subscribe(setS), []);
  return s;
}

const fmt = (s: number) => (Number.isFinite(s) && s > 0 ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00');

const Record: React.FC<{ track: number; playing: boolean; size: number }> = ({ track, playing, size }) => (
  <span className={`vd-record ${playing ? 'is-playing' : ''}`} style={{ width: size, height: size }}>
    <span className="vd-grooves" />
    <img className="vd-label" src={coverUrl(TRACKS[track])} alt="" draggable={false} />
    <span className="vd-spindle" />
    <span className="vd-sheen" />
  </span>
);

export const VinylDeck: React.FC<{ current: string }> = ({ current }) => {
  const s = useMusic();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const here = trackFor(current);
  const t = TRACKS[s.track];

  // The music moves with you: the moment you choose a new world, its track takes over
  useEffect(() => {
    music.goTo(current);
  }, [current]);

  // Close the album on Escape or a click elsewhere
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  const vol = s.muted ? 0 : s.volume;

  return (
    <div ref={root} className={`vinyl-deck ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className={`vd-launch ${s.playing ? 'is-playing' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        aria-label={`Soundtrack: ${t.title}. Open the album`}
        title="Soundtrack"
      >
        <span className="vd-meta">
          <span className="vd-kicker">
            <span className="vd-bars" aria-hidden>
              <i /><i /><i /><i />
            </span>
            {s.playing ? (s.muted ? 'Muted' : 'Now spinning') : 'Needle lifted'}
          </span>
          <span className="vd-title">{t.title}</span>
        </span>
        <span className="vd-stage" aria-hidden>
          <span className="vd-glow" />
          <span className="vd-platter">
            <Record track={s.track} playing={s.playing} size={34} />
          </span>
          <svg className="vd-arm" viewBox="0 0 40 60">
            <circle cx="31" cy="8" r="5" className="vd-arm-pivot" />
            <path d="M31 8 L27 38 L19 50" className="vd-arm-rod" />
            <rect x="15" y="47" width="7" height="9" rx="1.2" transform="rotate(32 18 51)" className="vd-arm-head" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="vd-panel" role="dialog" aria-label="Solaris soundtrack">
          <div className="vd-head">
            <div className="vd-sleeve">
              <span className="vd-sleeve-record">
                <Record track={s.track} playing={s.playing} size={96} />
              </span>
              <img className="vd-cover" src={coverUrl(t)} alt={`${t.title} cover`} />
            </div>
            <div className="vd-headcopy">
              <span className="vd-edition">Solaris · Slowed + Reverb</span>
              <span className="vd-now">{t.title}</span>
              <span className="vd-mood">{t.mood}</span>
              <span className="vd-world">Side {t.n} · {t.world === 'Sagittarius A*' ? 'The black hole' : t.world}</span>
            </div>
          </div>

          <div className="vd-seek">
            <span>{fmt(s.progress * s.duration)}</span>
            <input
              type="range" min={0} max={1000} value={Math.round(s.progress * 1000)}
              onChange={(e) => music.seek(Number(e.target.value) / 1000)}
              aria-label="Seek" className="vd-range" style={{ ['--fill' as string]: `${s.progress * 100}%` }}
            />
            <span>{fmt(s.duration)}</span>
          </div>

          <div className="vd-transport">
            <button type="button" className="vd-mute" onClick={() => music.setMuted(!s.muted)} aria-label={s.muted ? 'Unmute' : 'Mute'} title={s.muted ? 'Unmute' : 'Mute'}>
              <svg viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 4V5L7 9H3z" />
                {s.muted ? <path d="M16 9l5 6m0-6l-5 6" className="stroke" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" className="stroke" />}
              </svg>
            </button>
            <input
              type="range" min={0} max={100} value={Math.round(vol * 100)}
              onChange={(e) => music.setVolume(Number(e.target.value) / 100)}
              aria-label="Music volume" className="vd-range vd-volume" style={{ ['--fill' as string]: `${vol * 100}%` }}
            />
            <div className="vd-buttons">
              <button type="button" onClick={() => music.next(-1)} aria-label="Previous track"><svg viewBox="0 0 24 24"><path d="M6 5h2v14H6zM20 6v12L9 12z" /></svg></button>
              <button type="button" className="vd-play" onClick={() => music.toggle()} aria-label={s.playing ? 'Pause' : 'Play'}>
                <svg viewBox="0 0 24 24">{s.playing ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="m8 5 12 7-12 7z" />}</svg>
              </button>
              <button type="button" onClick={() => music.next(1)} aria-label="Next track"><svg viewBox="0 0 24 24"><path d="M16 5h2v14h-2zM4 6v12l11-6z" /></svg></button>
            </div>
          </div>

          <label className={`vd-follow ${s.follow ? 'is-on' : ''}`}>
            <input type="checkbox" checked={s.follow} onChange={(e) => music.follow(e.target.checked)} />
            <span className="vd-switch" aria-hidden><i /></span>
            <span>
              Follow the planets
              <em>{s.follow ? 'Each world plays its own track' : 'Playing the album until your next flight'}</em>
            </span>
          </label>

          <ol className="vd-list">
            {TRACKS.map((tr, i) => (
              <li key={tr.slug}>
                <button type="button" className={`vd-row ${i === s.track ? 'is-current' : ''}`} onClick={() => music.pick(i)}>
                  <span className="vd-n">{tr.n}</span>
                  <img src={coverUrl(tr)} alt="" loading="lazy" />
                  <span className="vd-rowcopy">
                    <span className="vd-rowtitle">{tr.title}</span>
                    <span className="vd-rowworld">{tr.world === 'Sagittarius A*' ? 'Black hole' : tr.world}</span>
                  </span>
                  {i === here && <span className="vd-here">Here</span>}
                  {i === s.track && s.playing && (
                    <span className="vd-bars is-small" aria-hidden><i /><i /><i /><i /></span>
                  )}
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

/** With the record player hidden, the music still follows you. */
export const VinylFollower: React.FC<{ current: string }> = ({ current }) => {
  useEffect(() => {
    music.goTo(current);
  }, [current]);
  return null;
};
