import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { LiveMark } from './Hero';
import { vela } from './vela/bus';

/**
 * The opening: scroll and the camera leaves home. 300 frames rendered from the running Solaris
 * site (on the launch film's virtual clock) take you from Earth's night side, past the Moon, out
 * through the orbits of the planets and the nearby stars, up to the whole Milky Way seen from its
 * north pole. Scroll scrubs through them on a pinned canvas, like a film you hold the reel of.
 */

const FRAMES = 300;
const url = (i: number) => `${import.meta.env.BASE_URL}report/hero/f${String(i).padStart(3, '0')}.webp`;

// Captions along the journey: [from, to, kicker, title, detail]
const STAGES: Array<[number, number, string, string, string]> = [
  [0.04, 0.095, 'Home', 'Earth, tonight', 'City lights on the night side, the Sun just over the edge'],
  [0.105, 0.195, '384,400 km', 'The Moon', 'Light takes 1.3 seconds to cross this gap'],
  [0.215, 0.33, '150 million km', 'The Sun', 'Its light left 8 minutes and 19 seconds ago'],
  [0.38, 0.5, '1.5 AU', 'The inner planets', 'Mercury, Venus, Earth and Mars on their real orbits, today'],
  [0.53, 0.64, '30 AU', 'The giants', 'Jupiter to Neptune. Sunlight takes four hours to reach the last one'],
  [0.66, 0.77, 'Everything we have visited', 'The Solar System', 'Every spacecraft ever launched is inside that small circle'],
  [0.8, 0.89, 'Light-years', 'The nearest stars', 'Real Hipparcos stars, each at its measured distance'],
  [0.92, 1.01, '100,000 light-years across', 'The Milky Way', 'Seen from its north pole. We are 27,000 light-years from its heart'],
];

const VELA_AT: Array<[number, string]> = [
  [0.08, "That's home. Look at all those city lights. Scroll slowly, I want to show you something."],
  [0.12, "There's the Moon! It looks close. It isn't. Thirty Earths would fit in that gap."],
  [0.25, "And there's the Sun. The light you're seeing left it eight minutes ago."],
  [0.42, 'Every orbit here is computed from NASA numbers for today. This is where the planets actually are.'],
  [0.7, "And that tiny circle is everything humans have ever visited. Keep going, it gets bigger. Much bigger."],
  [0.94, 'Hi from out here! That little dot is us. Okay. Now let me tell you how all of this was made.'],
];

export const ScrollHero: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {
      const c = canvas.current!;
      const ctx = c.getContext('2d')!;
      const imgs: Array<HTMLImageElement | null> = new Array(FRAMES).fill(null);
      const ok = new Array(FRAMES).fill(false);
      let current = 0;
      let drawn = -1;
      let count = 0;

      const fit = () => {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        c.width = Math.round(window.innerWidth * dpr);
        c.height = Math.round(window.innerHeight * dpr);
        drawn = -1;
        draw();
      };
      // The nearest loaded frame to the one we want (so a fast scroll never shows black)
      const nearest = (i: number) => {
        for (let d = 0; d < FRAMES; d++) {
          if (ok[i - d]) return i - d;
          if (ok[i + d]) return i + d;
        }
        return -1;
      };
      const draw = () => {
        const i = nearest(current);
        if (i < 0 || i === drawn) return;
        drawn = i;
        const img = imgs[i]!;
        // Cover the screen; on tall phone screens show more of the frame instead (space is black anyway)
        const cover = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
        const s = c.height > c.width ? Math.min(cover, (c.width / img.naturalWidth) * 1.7) : cover;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, c.width, c.height);
        const w = img.naturalWidth * s;
        const h = img.naturalHeight * s;
        ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
      };
      const load = (i: number) =>
        new Promise<void>((res) => {
          if (imgs[i]) return res();
          const im = new Image();
          im.decoding = 'async';
          im.src = url(i);
          imgs[i] = im;
          const done = () => {
            ok[i] = !!im.naturalWidth;
            count++;
            setLoaded(count);
            if (Math.abs(i - current) < 6 || drawn < 0) { drawn = -1; draw(); }
            res();
          };
          im.onload = () => (im.decode ? im.decode().then(done, done) : done());
          im.onerror = done;
        });

      // Keyframes first (every tenth), then everything else nearest the scroll position first
      let alive = true;
      (async () => {
        const keys = Array.from({ length: FRAMES / 10 }, (_, k) => k * 10);
        for (let k = 0; k < keys.length; k += 6) await Promise.all(keys.slice(k, k + 6).map(load));
        if (!alive) return;
        setReady(true);
        const rest = Array.from({ length: FRAMES }, (_, i) => i).filter((i) => i % 10);
        while (rest.length && alive) {
          rest.sort((a, b) => Math.abs(a - current) - Math.abs(b - current));
          await Promise.all(rest.splice(0, 6).map(load));
        }
      })();

      fit();
      window.addEventListener('resize', fit);

      const said = new Set<number>();
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: '.sh-pin',
        pinSpacing: false,
        onUpdate: (self) => {
          const p = self.progress;
          current = Math.min(FRAMES - 1, Math.round(p * (FRAMES - 1)));
          draw();
          for (const [at, line] of VELA_AT) {
            if (p >= at && !said.has(at)) {
              said.add(at);
              vela.say({ text: line, mood: at > 0.9 ? 'love' : at > 0.6 ? 'excited' : 'happy', priority: 1, hold: 3.2 });
            }
          }
        },
      });

      // Title and captions, scrubbed with the same scroll
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
      tl.to('.sh-title', { opacity: 0, y: -60, filter: 'blur(10px)', duration: 0.07, ease: 'power2.in' }, 0.03);
      tl.to('.sh-cue', { opacity: 0, duration: 0.03 }, 0.01);
      STAGES.forEach((s, i) => {
        const el = `.sh-stage-${i}`;
        tl.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.025, ease: 'power3.out' }, s[0]);
        if (i < STAGES.length - 1) tl.to(el, { opacity: 0, y: -30, duration: 0.025, ease: 'power2.in' }, s[1] - 0.025);
      });
      tl.fromTo('.sh-here', { opacity: 0, scale: 2.4 }, { opacity: 1, scale: 1, duration: 0.04, ease: 'back.out(2)' }, 0.95);
      tl.fromTo('.sh-scale-fill', { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'none' }, 0);
      tl.set({}, {}, 1);

      // Title entrance (after the preloader)
      const split = SplitText.create('.sh-name', { type: 'chars' });
      gsap.from(split.chars, { opacity: 0, letterSpacing: '1.2em', filter: 'blur(14px)', stagger: 0.06, duration: 1.4, ease: 'expo.out', delay: 1.0 });
      gsap.from('.sh-sub, .sh-lede, .sh-by, .sh-cue', { opacity: 0, y: 20, stagger: 0.12, duration: 1, ease: 'power3.out', delay: 1.6 });

      return () => {
        alive = false;
        window.removeEventListener('resize', fit);
        st.kill();
        split.revert();
      };
    },
    { scope: root }
  );

  const pct = Math.round((loaded / FRAMES) * 100);
  return (
    <section ref={root} className="sh" aria-label="From Earth to the Milky Way">
      <div className="sh-pin">
        <canvas ref={canvas} className="sh-canvas" aria-hidden />
        <div className="sh-vignette" />

        <div className="sh-title">
          <LiveMark size={150} delay={0.6} />
          <h1 className="sh-name">SOLARIS</h1>
          <p className="sh-sub">Putting the real Solar System in a browser</p>
          <p className="sh-lede">A technical report on the data, the physics, the rendering, the companion and the film behind it, and everything that broke along the way.</p>
          <p className="sh-by">LetMeCodex · with Vela, who will be explaining everything</p>
        </div>

        {STAGES.map(([, , k, t, d], i) => (
          <div key={t} className={`sh-stage sh-stage-${i}`}>
            <span className="sh-k">{k}</span>
            <span className="sh-t">{t}</span>
            <span className="sh-d">{d}</span>
          </div>
        ))}
        <div className="sh-here" aria-hidden>
          <i />
          <span>You are here</span>
        </div>

        <div className="sh-cue">
          <span>Scroll to leave home</span>
          <i />
        </div>
        <div className="sh-scale" aria-hidden>
          <span>Earth</span>
          <div className="sh-scale-track"><div className="sh-scale-fill" /></div>
          <span>The Milky Way</span>
        </div>

        <div className={`sh-pre ${ready ? 'is-done' : ''}`} aria-hidden={ready}>
          <div className="sh-pre-name">SOLARIS</div>
          <div className="sh-pre-sub">Loading the Solar System<span className="sh-dots" /></div>
          <div className="sh-pre-track"><div className="sh-pre-fill" style={{ transform: `scaleX(${Math.min(1, loaded / (FRAMES / 10))})` }} /></div>
          <div className="sh-pre-n">{Math.min(100, Math.round((loaded / (FRAMES / 10)) * 100))}%</div>
        </div>
        {ready && pct < 100 && <div className="sh-stream">frames {pct}%</div>}
      </div>
    </section>
  );
};
