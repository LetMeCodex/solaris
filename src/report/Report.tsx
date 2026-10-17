import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useGSAP } from '@gsap/react';
import { Abstract } from './Hero';
import { ScrollHero } from './ScrollHero';
import { Mascot } from './vela/Mascot';
import { vela } from './vela/bus';
import { CHAPTERS } from './chapters';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// The reading-progress light-clock: a photon travelling from the Sun as you read
const TRACK: Array<[string, number]> = [
  ['Mercury', 193], ['Venus', 361], ['Earth', 499], ['Mars', 760], ['Jupiter', 2595], ['Saturn', 4781], ['Uranus', 9577], ['Neptune', 15007], ['Pluto', 19703],
];
const L0 = Math.log(120);
const L1 = Math.log(19703);
const at = (s: number) => (Math.log(s) - L0) / (L1 - L0);

const LightClock: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const dot = ref.current!.querySelector('.lc-dot') as HTMLElement;
      const fill = ref.current!.querySelector('.lc-fill') as HTMLElement;
      const label = ref.current!.querySelector('.lc-where') as HTMLElement;
      const time = ref.current!.querySelector('.lc-time') as HTMLElement;
      const ticks = [...ref.current!.querySelectorAll<HTMLElement>('.lc-tick')];
      let lastWorld = '';
      let cheered = false;
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const p = self.progress;
          // Light time from the Sun at this point of reading (log scale out to Pluto)
          const s = Math.exp(L0 + p * (L1 - L0));
          const x = p * 100;
          dot.style.left = `${x}%`;
          fill.style.width = `${x}%`;
          let w = 'the Sun';
          for (const [n, t] of TRACK) if (s >= t) w = n;
          ticks.forEach((t, i) => t.classList.toggle('on', s >= TRACK[i][1]));
          const h = Math.floor(s / 3600);
          const m = Math.floor((s % 3600) / 60);
          const sec = Math.floor(s % 60);
          time.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
          if (w !== lastWorld) {
            lastWorld = w;
            label.textContent = w === 'the Sun' ? 'leaving the Sun' : `light has reached ${w}`;
          }
          if (p > 0.995 && !cheered) { cheered = true; vela.cheer(); }
        },
      });
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className="lc" aria-hidden>
      <div className="lc-meta"><span className="lc-time">00:00:00</span><span className="lc-where">leaving the Sun</span></div>
      <div className="lc-track">
        <div className="lc-fill" />
        {TRACK.map(([n, s]) => (
          <span key={n} className="lc-tick" style={{ left: `${at(s) * 100}%` }} title={n} />
        ))}
        <div className="lc-dot" />
      </div>
    </div>
  );
};

/** The table of contents that slides along the left edge. */
const Toc: React.FC = () => (
  <nav className="toc" aria-label="Contents">
    {CHAPTERS.map((c) => (
      <a key={c.id} href={`#${c.id}`} className="toc-i" data-id={c.id} onClick={(e) => { e.preventDefault(); ScrollSmoother.get()?.scrollTo(`#${c.id}`, true, 'top 80px'); }}>
        <span className="toc-n">{c.n}</span>
        <span className="toc-t">{c.short}</span>
      </a>
    ))}
  </nav>
);

export const Report: React.FC = () => {
  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: reduced ? 0 : 1.15, effects: true, smoothTouch: 0.1 });
    // Highlight the chapter being read in the contents
    CHAPTERS.forEach((c) => {
      ScrollTrigger.create({
        trigger: `#${c.id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        toggleClass: { targets: `.toc-i[data-id="${c.id}"]`, className: 'on' },
      });
    });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    const late = window.setTimeout(refresh, 2500);
    gsap.from('.toc', { opacity: 0, x: -20, duration: 1, scrollTrigger: { trigger: '.abstract', start: 'top 60%', toggleActions: 'play none none reverse' } });
    return () => {
      window.removeEventListener('load', refresh);
      window.clearTimeout(late);
    };
  });
  return (
    <>
      <LightClock />
      <Toc />
      <Mascot />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <ScrollHero />
          <Abstract />
          <main className="chapters">
            {CHAPTERS.map((c) => (
              <c.Component key={c.id} />
            ))}
          </main>
          <footer className="colophon-end">
            <div>SOLARIS · A technical report · 2026</div>
            <a href="../">Open Solaris ↗</a>
          </footer>
        </div>
      </div>
    </>
  );
};
