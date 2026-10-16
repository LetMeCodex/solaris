import React, { useEffect, useMemo, useState } from 'react';
import { Postcard, POSTCARDS, postcardImage } from '../../data/Postcards';
import { deleteShot, downloadShot, listShots, Shot, SHOTS_CHANGED } from './shots';

/**
 * The Gallery: postcards from the Solar System. Every picture was taken inside Solaris, from a real
 * place at a real moment, and "Take me there" puts you in that exact frame. Below them, the pictures
 * you take yourself (P), kept in this browser.
 */

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const sizeLabel = (m: number) => (m >= 1000 ? 'Poster sizes' : m > 1 ? `Sizes ×${m}` : 'True sizes');

interface Item {
  key: string;
  src: string;
  thumb: string;
  title: string;
  place: string;
  caption: string;
  meta: string[];
  view: Postcard | null;
  shot?: Shot;
}

function useShots(): Shot[] {
  const [shots, setShots] = useState<Shot[]>([]);
  useEffect(() => {
    let alive = true;
    const load = () => void listShots().then((s) => alive && setShots(s));
    load();
    window.addEventListener(SHOTS_CHANGED, load);
    return () => {
      alive = false;
      window.removeEventListener(SHOTS_CHANGED, load);
    };
  }, []);
  return shots;
}

export const Gallery: React.FC<{ onVisit: (p: Postcard) => void }> = ({ onVisit }) => {
  const shots = useShots();
  const [open, setOpen] = useState<number | null>(null);
  // Object URLs for your own shots, released when they change
  const urls = useMemo(() => shots.map((s) => URL.createObjectURL(s.blob)), [shots]);
  useEffect(() => () => urls.forEach((u) => URL.revokeObjectURL(u)), [urls]);

  const items: Item[] = useMemo(
    () => [
      ...POSTCARDS.map((p) => ({
        key: p.id,
        src: postcardImage(p),
        thumb: postcardImage(p, true),
        title: p.title,
        place: p.place,
        caption: p.caption,
        meta: p.body === 'Sagittarius A*' ? ['Sagittarius A*', 'Galactic Centre'] : [p.body, fmtDate(p.utc), sizeLabel(p.magnification)],
        view: p,
      })),
      ...shots.map((s, i) => ({
        key: s.id,
        src: urls[i],
        thumb: urls[i],
        title: s.where,
        place: 'Your picture',
        caption: s.view ? 'Taken by you. Step back in to stand exactly where you were.' : 'Taken by you.',
        meta: [new Date(s.at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })],
        view: s.view,
        shot: s,
      })),
    ],
    [shots, urls]
  );

  // Keys in the viewer: ← → to browse, Esc to close it (before the Atlas sees Esc)
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        setOpen(null);
      } else if (e.key === 'ArrowRight') setOpen((o) => (o === null ? o : (o + 1) % items.length));
      else if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? o : (o - 1 + items.length) % items.length));
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, items.length]);

  const cur = open !== null ? items[open] : null;
  const mine = items.filter((i) => i.shot);

  const card = (it: Item, i: number, hero = false) => (
    <button key={it.key} className={`gal-card ${hero ? 'is-hero' : ''}`} onClick={() => setOpen(i)} style={{ ['--d' as string]: `${Math.min(i, 10) * 70}ms` }}>
      <img src={hero ? it.src : it.thumb} alt={it.title} loading="lazy" draggable={false} />
      <span className="gal-shade" />
      <span className="gal-copy">
        <span className="gal-place">{it.place}</span>
        <span className="gal-title">{it.title}</span>
      </span>
      <span className="gal-step">Step inside</span>
    </button>
  );

  return (
    <section className="gal" aria-label="Gallery">
      <header className="gal-head">
        <span className="gal-kicker">Postcards from the Solar System</span>
        <h2 className="gal-h">Real places. Real moments. <em>Step into any of them.</em></h2>
        <p className="gal-sub">
          Every picture here was taken inside Solaris, from the true sky of a real world at a real time. Open one and
          you will be standing in it. Press <kbd>P</kbd> anywhere to take your own.
        </p>
      </header>

      <div className="gal-grid">{POSTCARDS.map((_, i) => card(items[i], i, i === 0))}</div>

      <header className="gal-head gal-head-mine">
        <span className="gal-kicker">Your pictures · {mine.length}</span>
      </header>
      {mine.length ? (
        <div className="gal-grid gal-grid-mine">{items.map((it, i) => (it.shot ? card(it, i) : null))}</div>
      ) : (
        <p className="gal-empty">
          <span className="gal-empty-shutter" aria-hidden />
          Nothing yet. Stand on a world, look up, wait for the right light, and press <kbd>P</kbd>. Your best
          frames live here, in this browser.
        </p>
      )}

      {cur && (
        <div className="gal-view" role="dialog" aria-label={cur.title} onClick={() => setOpen(null)}>
          <figure className="gal-figure" onClick={(e) => e.stopPropagation()}>
            <img src={cur.src} alt={cur.title} />
            <figcaption>
              <span className="gal-place">{cur.place}</span>
              <span className="gal-view-title">{cur.title}</span>
              <span className="gal-caption">{cur.caption}</span>
              <span className="gal-meta">{cur.meta.map((m) => <i key={m}>{m}</i>)}</span>
              <span className="gal-actions">
                {cur.view && (
                  <button className="gal-go" onClick={() => onVisit(cur.view!)}>
                    Take me there <span aria-hidden>→</span>
                  </button>
                )}
                {cur.shot && (
                  <>
                    <button className="gal-ghost" onClick={() => downloadShot(cur.shot!)}>Download</button>
                    <button className="gal-ghost" onClick={() => { void deleteShot(cur.shot!.id); setOpen(null); }}>Delete</button>
                  </>
                )}
              </span>
            </figcaption>
            <button className="gal-nav gal-prev" aria-label="Previous picture" onClick={() => setOpen((open! - 1 + items.length) % items.length)}>‹</button>
            <button className="gal-nav gal-next" aria-label="Next picture" onClick={() => setOpen((open! + 1) % items.length)}>›</button>
          </figure>
        </div>
      )}
    </section>
  );
};
