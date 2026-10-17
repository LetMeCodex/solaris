import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';
import { vela, type Mood } from './vela/bus';
import type { Costume } from './vela/sprite';
import { TERMS } from './terms';
import { REFS } from './refs';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, ScrambleTextPlugin, MotionPathPlugin, useGSAP);

/** A term Vela explains when you hover, focus or tap it. */
export const T: React.FC<{ k: keyof typeof TERMS; children: React.ReactNode }> = ({ k, children }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const timer = useRef(0);
  const ask = (now = false) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => vela.say({ text: TERMS[k], target: ref.current, mood: 'calm', priority: 2 }), now ? 0 : 220);
  };
  return (
    <span
      ref={ref}
      className="term"
      tabIndex={0}
      role="button"
      aria-label={`${typeof children === 'string' ? children : ''}: ask Vela`}
      onPointerEnter={() => ask()}
      onPointerLeave={() => window.clearTimeout(timer.current)}
      onFocus={() => ask()}
      onClick={() => ask(true)}
    >
      {children}
    </span>
  );
};

/** A citation: hover it and Vela names the source; click to jump to the reference list. */
export const Cite: React.FC<{ n: number }> = ({ n }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const r = REFS[n - 1];
  return (
    <a
      ref={ref}
      className="cite"
      href={`#ref-${n}`}
      onPointerEnter={() => r && vela.say({ text: `Source ${n}: ${r.vela ?? r.title}`, target: ref.current, mood: 'thinking', priority: 2, hold: 3.2 })}
    >
      [{n}]
    </a>
  );
};

/**
 * A chapter: a big ghost number, a kicker, a title that assembles itself letter by letter and a
 * gold rule that draws. Entering it, Vela changes costume and introduces it.
 */
export const Chapter: React.FC<{
  id: string;
  n: string;
  kicker: string;
  title: string;
  intro: string;
  costume?: Costume;
  mood?: Mood;
  children: React.ReactNode;
}> = ({ id, n, kicker, title, intro, costume = 'none', mood = 'calm', children }) => {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = root.current!;
      const h = el.querySelector('.ch-title') as HTMLElement;
      const split = SplitText.create(h, { type: 'chars,words', charsClass: 'ch-char' });
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 72%' } });
      tl.from(el.querySelector('.ch-kicker'), { opacity: 0, x: -30, duration: 0.9, ease: 'power3.out' })
        .from(split.chars, { opacity: 0, yPercent: 60, filter: 'blur(12px)', stagger: 0.018, duration: 1.2, ease: 'expo.out' }, 0.1);
      // Paragraphs rise line by line as they come in
      el.querySelectorAll<HTMLElement>('.prose > p').forEach((p) => {
        gsap.from(p, { opacity: 0, y: 26, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 88%' } });
      });
      let said = false;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (!self.isActive) return;
          vela.costume(costume);
          if (!said) {
            said = true;
            vela.say({ text: intro, mood, priority: 1 });
          }
        },
      });
      return () => split.revert();
    },
    { scope: root }
  );
  return (
    <section id={id} ref={root} className="ch">
      <header className="ch-head">
        <div className="ch-kicker"><b>§{n}</b> {kicker}</div>
        <h2 className="ch-title">{emphasise(title)}</h2>
      </header>
      {children}
    </section>
  );
};

/** Titles mark their emphasis with *asterisks*: those words are set in italic. */
export function emphasise(s: string): React.ReactNode {
  return s.split(/(\*[^*]+\*)/).map((part, i) => (part.startsWith('*') ? <em key={i}>{part.slice(1, -1)}</em> : part));
}

/** A figure frame: label, the live figure, a caption, and an "ask Vela" button. */
export const Fig: React.FC<{ n: number; title: string; caption: React.ReactNode; vela: string; wide?: boolean; children: React.ReactNode }> = ({ n, title, caption, vela: line, wide = true, children }) => {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.from(ref.current, { opacity: 0, y: 60, scale: 0.97, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: ref.current, start: 'top 85%' } });
    },
    { scope: ref }
  );
  return (
    <figure ref={ref} className={`fig ${wide ? 'is-wide' : ''}`}>
      <div className="fig-plate">
      <div className="fig-bar">
        <span className="fig-n">Fig. {n}</span>
        <span className="fig-title">{title}</span>
        <button type="button" className="fig-ask" onClick={(e) => vela.say({ text: line, target: e.currentTarget, mood: 'happy', priority: 3 })}>
          <span className="fig-ask-dot" /> Ask Vela
        </button>
      </div>
      <div className="fig-body">{children}</div>
      </div>
      <figcaption className="fig-cap">{caption}</figcaption>
    </figure>
  );
};

/** A number that scrambles up to its value when it scrolls in. */
export const Num: React.FC<{ v: string; className?: string }> = ({ v, className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, {
      duration: 1.6,
      scrambleText: { text: v, chars: '0123456789', revealDelay: 0.3, speed: 0.6 },
      scrollTrigger: { trigger: ref.current, start: 'top 90%' },
    });
  });
  return <span ref={ref} className={className}>{v}</span>;
};

/** A pull-quote line from Vela, set into the text. */
export const VelaNote: React.FC<{ children: string }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="vnote" onPointerEnter={() => vela.say({ text: children, target: ref.current, mood: 'happy', priority: 2 })}>
      <span className="vnote-tag">Vela says</span>
      <p>{children}</p>
    </div>
  );
};

/** A short looping clip from the launch film footage, loaded only when it comes into view. */
export const Loop: React.FC<{ src: string; label?: string; onHover?: string }> = ({ src, label, onHover }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const cell = useRef<HTMLDivElement>(null);
  const base = import.meta.env.BASE_URL;
  React.useEffect(() => {
    const v = ref.current!;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!v.src) v.src = `${base}report/media/${src}.mp4`;
        v.play().catch(() => {});
      } else v.pause();
    }, { rootMargin: '200px' });
    io.observe(v);
    return () => io.disconnect();
  }, [src, base]);
  return (
    <div ref={cell} className="media-cell" onPointerEnter={() => onHover && vela.say({ text: onHover, target: cell.current, mood: 'excited', priority: 2 })}>
      <video ref={ref} poster={`${base}report/media/${src}.jpg`} muted loop playsInline preload="none" />
      {label && <span className="mc-label">{label}</span>}
    </div>
  );
};
