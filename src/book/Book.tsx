import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { PAGES, type PageDef } from './pages';
import { GoContext, LiveContext } from './kit';

gsap.registerPlugin(DrawSVGPlugin);

/**
 * The book. Each sheet of paper is one element with two faces, hinged at the spine, so pages never
 * remount as they turn: a sheet simply swings from the right-hand stack to the left. Only the sheets
 * near the open spread hold their artwork. On a phone the same pages run as one long strip.
 */

const PW = 760;
const PH = 1040;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/** The closed book sits centred: the cover to the right of the spine, the back cover to the left. */
const shift = (s: number) => (s === 0 ? -PW / 2 : s === Math.ceil(PAGES.length / 2) ? PW / 2 : 0);

/** First arrival at a page: lay down the lettering and drawings. */
const SEEN = new Set<string>();
function hide(el: HTMLElement) {
  const q = (s: string) => el.querySelectorAll(s);
  gsap.set(q('.a-b'), { scale: 0.4, autoAlpha: 0 });
  gsap.set(q('.a-s'), { scale: 2.6, autoAlpha: 0 });
  gsap.set(q('.a-d'), { drawSVG: '0%' });
  gsap.set(q('.a-f'), { autoAlpha: 0, y: 14 });
  gsap.set(q('.a-g'), { scale: 0, transformOrigin: '50% 50%' });
}
function play(el: HTMLElement) {
  const q = (s: string) => el.querySelectorAll(s);
  const tl = gsap.timeline();
  tl.to(q('.a-f'), { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out' }, 0)
    .to(q('.a-d'), { drawSVG: '100%', duration: 1.1, stagger: 0.05, ease: 'power2.inOut' }, 0.05)
    .to(q('.a-g'), { scale: 1, duration: 0.45, stagger: 0.03, ease: 'back.out(2.4)' }, 0.25)
    .to(q('.a-b'), { scale: 1, autoAlpha: 1, duration: 0.42, stagger: 0.32, ease: 'back.out(2.2)' }, 0.25)
    .to(q('.a-s'), { scale: 1, autoAlpha: 1, duration: 0.3, stagger: 0.35, ease: 'expo.in' }, 0.5);
}

const Sheet: React.FC<{ page: PageDef | undefined; live: boolean; mounted: boolean }> = ({ page, live, mounted }) => {
  if (!page) return <div className="pg blank" />;
  return (
    <section className={`pg pg-${page.ground ?? 'paper'}`} data-page={page.id}>
      <LiveContext.Provider value={live}>
        {mounted && page.node}
      </LiveContext.Provider>
      {page.tab && <div className="tab">{page.tab}</div>}
      {page.folio !== false && <div className="folio">{page.n}</div>}
      <div className="turnshade" />
    </section>
  );
};

/** The pages laid out as sheets: sheet i carries page 2i on its front and 2i+1 on its back. */
const Spreads: React.FC<{ go: (fn: (id: string) => void) => void }> = ({ go }) => {
  const sheets = useMemo(() => Array.from({ length: Math.ceil(PAGES.length / 2) }, (_, i) => [PAGES[i * 2], PAGES[i * 2 + 1]] as const), []);
  const [spread, setSpread] = useState(() => {
    const m = /p(\d+)/.exec(window.location.hash);
    return m ? Math.ceil((Number(m[1]) - 1) / 2) : 0;
  });
  const [turning, setTurning] = useState(false);
  const busy = useRef(false);
  const stage = useRef<HTMLDivElement>(null);
  const bookEl = useRef<HTMLDivElement>(null);
  const els = useRef<Array<HTMLDivElement | null>>([]);
  const pos = useRef(spread);
  const [scale, setScale] = useState(1);
  const [near, setNear] = useState(spread);

  const layout = useCallback((s: number) => {
    sheets.forEach((_, i) => {
      const el = els.current[i];
      if (!el) return;
      const turned = i < s;
      gsap.set(el, { rotationY: turned ? -180 : 0, zIndex: turned ? i + 1 : sheets.length - i });
    });
    gsap.set(bookEl.current, { x: shift(s) });
  }, [sheets]);

  useEffect(() => { layout(spread); /* the opening position */ }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fit = () => setScale(Math.min((window.innerWidth - 56) / (PW * 2), (window.innerHeight - 92) / PH));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const pagesOf = (s: number) => [PAGES[s * 2 - 1], PAGES[s * 2]].filter(Boolean) as PageDef[];
  const arrive = useCallback((s: number) => {
    for (const p of pagesOf(s)) {
      const el = stage.current?.querySelector<HTMLElement>(`[data-page="${p.id}"]`);
      if (!el || SEEN.has(p.id)) continue;
      SEEN.add(p.id);
      if (!reduced) play(el);
    }
  }, []);

  const to = useCallback((t: number) => {
    const from = pos.current;
    t = Math.max(0, Math.min(sheets.length, t));
    if (busy.current || t === from) return;
    busy.current = true;
    setTurning(true);
    setNear(t);
    const dir = t > from ? 1 : -1;
    window.history.replaceState(null, '', `#p${Math.max(1, t * 2)}`);
    // the artwork mounts on the next frame; hide its lettering before it can be seen
    requestAnimationFrame(() => {
      if (!reduced) for (const p of pagesOf(t)) {
        const el = stage.current?.querySelector<HTMLElement>(`[data-page="${p.id}"]`);
        if (el && !SEEN.has(p.id)) hide(el);
      }
      const list: number[] = [];
      if (dir > 0) for (let i = from; i < t; i++) list.push(i);
      else for (let i = from - 1; i >= t; i--) list.push(i);
      // a long jump riffles the last few sheets
      const shown = list.slice(-6);
      const skipped = list.slice(0, -6);
      for (const i of skipped) gsap.set(els.current[i], { rotationY: dir > 0 ? -180 : 0 });
      const n = sheets.length;
      const tl = gsap.timeline({
        onComplete: () => {
          pos.current = t;
          layout(t);
          setSpread(t);
          setTurning(false);
          busy.current = false;
          arrive(t);
        },
      });
      tl.to(bookEl.current, { x: shift(t), duration: reduced ? 0 : 0.8, ease: 'power2.inOut' }, 0);
      shown.forEach((i, k) => {
        const el = els.current[i]!;
        const shade = el.querySelectorAll<HTMLElement>('.turnshade');
        gsap.set(el, { zIndex: n + 10 + k });
        tl.to(el, {
          rotationY: dir > 0 ? -180 : 0,
          duration: reduced ? 0.01 : shown.length > 1 ? 0.5 : 0.85,
          ease: 'power2.inOut',
          onUpdate() {
            const a = Math.abs(Number(gsap.getProperty(el, 'rotationY')));
            const v = Math.sin((a * Math.PI) / 180) * 0.34;
            shade.forEach((s) => { s.style.opacity = String(v); });
          },
        }, k * 0.08);
      });
    });
  }, [sheets.length, layout, arrive]);

  const toPage = useCallback((id: string) => {
    const i = PAGES.findIndex((p) => p.id === id);
    if (i >= 0) to(Math.ceil(i / 2));
  }, [to]);
  useEffect(() => go(toPage), [go, toPage]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); to(pos.current + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); to(pos.current - 1); }
      else if (e.key === 'Home') to(0);
      else if (e.key === 'End') to(sheets.length);
      else if (e.key === 'f') document.documentElement.requestFullscreen?.();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [to, sheets.length]);

  useEffect(() => { arrive(spread); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // a swipe turns the page on a tablet
  useEffect(() => {
    const el = stage.current!;
    let x0 = 0;
    const down = (e: PointerEvent) => { x0 = e.clientX; };
    const up = (e: PointerEvent) => {
      const dx = e.clientX - x0;
      if (e.pointerType !== 'mouse' && Math.abs(dx) > 60) to(pos.current + (dx < 0 ? 1 : -1));
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    return () => { el.removeEventListener('pointerdown', down); el.removeEventListener('pointerup', up); };
  }, [to]);

  return (
    <div className="desk" ref={stage}>
      <div className="stage" style={{ width: PW * 2, height: PH, transform: `translate(-50%, -50%) scale(${scale})` }}>
        <div className="book" ref={bookEl}>
          {sheets.map(([front, back], i) => {
            const mounted = Math.abs(i - near) <= 1 || Math.abs(i - near + 1) <= 1 || i === spread || i === spread - 1;
            return (
              <div key={i} className="sheet" ref={(e) => { els.current[i] = e; }}>
                <div className="face front"><Sheet page={front} mounted={mounted} live={!turning && i === spread} /></div>
                <div className="face back"><Sheet page={back} mounted={mounted} live={!turning && i === spread - 1} /></div>
              </div>
            );
          })}
        </div>
        <button type="button" className="edge left" aria-label="Previous page" onClick={() => to(pos.current - 1)} style={{ display: spread === 0 ? 'none' : undefined }} />
        <button type="button" className="edge right" aria-label="Next page" onClick={() => to(pos.current + 1)} style={{ display: spread === sheets.length ? 'none' : undefined }} />
      </div>
      <Rail spread={spread} total={sheets.length} to={to} />
    </div>
  );
};

/** The way through the book, as a line on the Metro. */
const Rail: React.FC<{ spread: number; total: number; to: (s: number) => void }> = ({ spread, total, to }) => {
  const stops = useMemo(() => PAGES.map((p, i) => ({ p, s: Math.ceil(i / 2) })).filter((x) => x.p.stop), []);
  return (
    <nav className="rail" aria-label="Chapters">
      <div className="rail-line" />
      <div className="rail-on" style={{ width: `${(spread / total) * 100}%` }} />
      {stops.map(({ p, s }) => (
        <button key={p.id} type="button" className={`stop ${s <= spread ? 'on' : ''}`} style={{ left: `${(s / total) * 100}%` }} onClick={() => to(s)} aria-label={p.stop}>
          <i /><span>{p.stop}</span>
        </button>
      ))}
    </nav>
  );
};

/** On a phone: one long strip, each page drawn as it comes near. */
const Strip: React.FC = () => {
  const [near, setNear] = useState<Set<string>>(() => new Set([PAGES[0].id, PAGES[1].id]));
  const [live, setLive] = useState<Set<string>>(() => new Set());
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const load = new IntersectionObserver((es) => {
      setNear((s) => { const n = new Set(s); es.forEach((e) => { if (e.isIntersecting) n.add((e.target as HTMLElement).dataset.page!); }); return n; });
    }, { rootMargin: '120% 0px' });
    const seen = new IntersectionObserver((es) => {
      setLive((s) => {
        const n = new Set(s);
        es.forEach((e) => { const id = (e.target as HTMLElement).dataset.page!; if (e.isIntersecting) n.add(id); else n.delete(id); });
        return n;
      });
    }, { threshold: 0.15 });
    root.current?.querySelectorAll('.pg').forEach((e) => { load.observe(e); seen.observe(e); });
    return () => { load.disconnect(); seen.disconnect(); };
  }, []);
  const go = useCallback((id: string) => { root.current?.querySelector(`[data-page="${id}"]`)?.scrollIntoView({ behavior: 'smooth' }); }, []);
  return (
    <GoContext.Provider value={go}>
      <div className="strip" ref={root}>
        {PAGES.map((p) => <Sheet key={p.id} page={p} mounted={near.has(p.id)} live={live.has(p.id)} />)}
      </div>
    </GoContext.Provider>
  );
};

export const Book: React.FC = () => {
  const [phone, setPhone] = useState(() => window.innerWidth < 860 || window.innerWidth < window.innerHeight * 0.9);
  const goRef = useRef<(id: string) => void>(() => {});
  useEffect(() => {
    const f = () => setPhone(window.innerWidth < 860 || window.innerWidth < window.innerHeight * 0.9);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  const go = useCallback((id: string) => goRef.current(id), []);
  const set = useCallback((fn: (id: string) => void) => { goRef.current = fn; }, []);
  if (phone) return <Strip />;
  return (
    <GoContext.Provider value={go}>
      <Spreads go={set} />
    </GoContext.Provider>
  );
};
