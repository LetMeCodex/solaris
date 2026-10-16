import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { draw, W, H, type Arms, type Costume, type Eyes, type Face, type Mouth } from './sprite';
import { vela, type Line, type Mood } from './bus';

gsap.registerPlugin(Draggable, InertiaPlugin);

/**
 * Vela, the report's guide. She floats at the side of the page, explains every section, term,
 * figure and source in her own words, flies to whatever she is talking about and points at it.
 * She watches your cursor, giggles when clicked, can be thrown about (and gets dizzy if shaken),
 * falls asleep when left alone, and dresses for the occasion.
 */

const SCALE = 4; // screen pixels per sprite pixel
const SIZE_W = W * SCALE;
const SIZE_H = H * SCALE;

const MOOD_FACE: Record<Mood, { eyes: Eyes; mouth: Mouth; cheeks?: boolean; sweat?: boolean; arms?: Arms }> = {
  calm: { eyes: 'open', mouth: 'smile' },
  happy: { eyes: 'happy', mouth: 'grin', cheeks: true },
  excited: { eyes: 'wide', mouth: 'grin', cheeks: true, arms: 'up' },
  thinking: { eyes: 'squint', mouth: 'flat', arms: 'hold' },
  surprised: { eyes: 'wide', mouth: 'o' },
  scared: { eyes: 'wide', mouth: 'wobble', sweat: true },
  love: { eyes: 'heart', mouth: 'smile', cheeks: true },
  proud: { eyes: 'happy', mouth: 'smile', cheeks: true, arms: 'up' },
  sleepy: { eyes: 'closed', mouth: 'flat' },
};

const POKES = [
  'Hehe. That tickles.',
  "Hi! I'm Vela. I usually live inside Solaris, but today I'm your guide.",
  'Want a secret? Every number on this page is real. I checked.',
  "You can throw me, you know. I'll come back.",
  "I have 572 things to say in Solaris. Here I only get to type. It's fine. I'm fine.",
  'Hover anything with a dotted line and I will explain it.',
  "I'm made of 23 × 21 pixels and a lot of feelings.",
];

const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function home() {
  const small = window.innerWidth < 760;
  return small
    ? { x: window.innerWidth - SIZE_W * 0.75 - 12, y: window.innerHeight - SIZE_H * 0.75 - 18 }
    : { x: window.innerWidth - SIZE_W - 34, y: window.innerHeight * 0.76 - SIZE_H / 2 };
}

export const Mascot: React.FC = () => {
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const fx = useRef<HTMLDivElement>(null);

  const [face, setFace] = useState<Face>({ eyes: 'open', mouth: 'smile', arms: 'wave1', costume: 'none', gaze: [0, 0], cheeks: true, sweat: false, star: 1 });
  const [text, setText] = useState('');
  const [shown, setShown] = useState(false);
  const [flip, setFlip] = useState(false);

  // Everything the animation loop needs, without re-rendering
  const s = useRef({
    x: 0, y: 0, mood: 'calm' as Mood, talking: false, line: null as Line | null, typed: 0, holdUntil: 0,
    dragging: false, parkedUntil: 0, lastActive: performance.now(), sleeping: false, blinkAt: 0, blinkOpen: true,
    spin: 0, dizzyUntil: 0, lastScrollY: 0, lastScrollT: 0, fastCool: 0, waveUntil: performance.now() + 2200, costume: 'none' as Costume,
    pointer: [window.innerWidth / 2, window.innerHeight / 2] as [number, number], overBubble: false,
  });

  const pixels = useMemo(() => draw(face), [face]);

  // Particles: hearts, sparkles, zzz
  const burst = (kind: 'heart' | 'spark' | 'z' | 'star', n: number) => {
    const layer = fx.current;
    if (!layer || reduced) return;
    const st = s.current;
    for (let i = 0; i < n; i++) {
      const d = document.createElement('div');
      d.className = `vm-p vm-${kind}`;
      d.textContent = kind === 'z' ? 'z' : '';
      layer.appendChild(d);
      const x0 = st.x + SIZE_W / 2 + (Math.random() - 0.5) * 30;
      const y0 = st.y + SIZE_H * (kind === 'z' ? 0.3 : 0.45);
      gsap.fromTo(
        d,
        { x: x0, y: y0, scale: 0.4, opacity: 1, rotate: (Math.random() - 0.5) * 40 },
        {
          x: x0 + (kind === 'z' ? 30 + i * 8 : (Math.random() - 0.5) * 140),
          y: y0 - (kind === 'z' ? 70 + i * 18 : 60 + Math.random() * 80),
          scale: kind === 'z' ? 1 + i * 0.25 : 1,
          opacity: 0,
          duration: kind === 'z' ? 2.4 : 1.1 + Math.random() * 0.5,
          delay: kind === 'z' ? i * 0.5 : i * 0.03,
          ease: 'power2.out',
          onComplete: () => d.remove(),
        }
      );
    }
  };

  const setMood = (m: Mood) => {
    s.current.mood = m;
    const f = MOOD_FACE[m];
    setFace((p) => ({ ...p, eyes: f.eyes, mouth: f.mouth, cheeks: !!f.cheeks, sweat: !!f.sweat, arms: f.arms ?? (s.current.line?.target ? 'point' : 'down') }));
  };

  useEffect(() => {
    const el = root.current!;
    const st = s.current;
    const h = home();
    st.x = h.x;
    st.y = h.y;
    gsap.set(el, { x: h.x, y: h.y + 160, opacity: 0 });
    gsap.to(el, { y: h.y, opacity: 1, duration: 1.1, delay: 0.8, ease: 'back.out(1.6)' });
    // A fresh tween per move (Draggable cancels running tweens when she is grabbed)
    let lastTx = NaN;
    let lastTy = NaN;
    const moveTo = (x: number, y: number) => {
      if (Math.abs(x - lastTx) < 0.5 && Math.abs(y - lastTy) < 0.5 && gsap.isTweening(el)) return;
      lastTx = x;
      lastTy = y;
      gsap.to(el, { x, y, duration: reduced ? 0.01 : 0.95, ease: 'power3.out', overwrite: 'auto' });
    };

    let typer = 0;
    const endLine = () => {
      window.clearInterval(typer);
      st.line = null;
      st.talking = false;
      setShown(false);
      setMood(st.sleeping ? 'sleepy' : 'calm');
      setFace((p) => ({ ...p, arms: 'down' }));
    };

    const place = () => {
      if (st.dragging) return;
      const now = performance.now();
      let tx: number, ty: number;
      const t = st.line?.target;
      if (t) {
        const r = t.getBoundingClientRect();
        if (r.bottom < 40 || r.top > window.innerHeight - 40) {
          endLine();
          return;
        }
        const roomRight = window.innerWidth - r.right;
        if (roomRight > SIZE_W + 60) { tx = r.right + 22; setFlip(true); }
        else if (r.left > SIZE_W + 60) { tx = r.left - SIZE_W - 22; setFlip(false); }
        else { tx = Math.min(window.innerWidth - SIZE_W - 16, r.left + r.width * 0.75); setFlip(false); }
        ty = Math.max(70, Math.min(window.innerHeight - SIZE_H - 30, r.top + Math.min(r.height / 2, 90) - SIZE_H / 2));
      } else if (now < st.parkedUntil) {
        return;
      } else {
        const h2 = home();
        tx = h2.x;
        ty = h2.y;
        setFlip(false);
      }
      st.x = tx;
      st.y = ty;
      moveTo(tx, ty);
    };

    const sayLine = (line: Line) => {
      const pr = line.priority ?? 1;
      if (st.line && (st.line.priority ?? 1) > pr && st.talking) return;
      window.clearInterval(typer);
      st.line = line;
      st.typed = 0;
      st.talking = true;
      st.lastActive = performance.now();
      if (st.sleeping) { st.sleeping = false; }
      setMood(line.mood ?? 'calm');
      setFace((p) => ({ ...p, arms: line.target ? 'point' : p.arms }));
      setText('');
      setShown(true);
      place();
      const full = line.text;
      const speed = reduced ? 1 : 26;
      typer = window.setInterval(() => {
        st.typed = Math.min(full.length, st.typed + (reduced ? full.length : 1 + (full[st.typed] === ' ' ? 1 : 0)));
        setText(full.slice(0, st.typed));
        if (st.typed >= full.length) {
          window.clearInterval(typer);
          st.talking = false;
          const words = full.split(' ').length;
          st.holdUntil = performance.now() + 1000 * (line.hold ?? Math.max(2.8, words * 0.34));
        }
      }, speed);
    };

    const off = vela.on((e) => {
      if (e.type === 'say') sayLine(e.line);
      else if (e.type === 'costume') { st.costume = e.costume; setFace((p) => ({ ...p, costume: e.costume })); }
      else if (e.type === 'hush') endLine();
      else if (e.type === 'cheer') { setMood('excited'); burst('star', 16); gsap.fromTo(body.current, { y: 0 }, { y: -40, duration: 0.3, yoyo: true, repeat: 3, ease: 'power2.out' }); }
    });

    // ---- the loop: bob, blink, twinkle, talk, follow, sleep -------------------------------------
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;

      // Bob and sway (more while talking)
      if (body.current && !reduced) {
        const amp = st.talking ? 5 : 4;
        const dizzy = now < st.dizzyUntil;
        const shake = st.mood === 'scared' ? Math.sin(t * 60) * 1.6 : 0;
        gsap.set(body.current, {
          y: Math.sin(t * 2.1) * amp,
          rotate: (dizzy ? Math.sin(t * 9) * 14 : Math.sin(t * 1.3) * 3) + st.spin,
          x: shake,
        });
      }

      // Blink every few seconds
      if (now > st.blinkAt && st.mood !== 'sleepy' && now > st.dizzyUntil) {
        if (st.blinkOpen) {
          st.blinkOpen = false;
          st.blinkAt = now + 120;
          setFace((p) => (p.eyes === 'open' ? { ...p, eyes: 'blink' } : p));
        } else {
          st.blinkOpen = true;
          st.blinkAt = now + 2200 + Math.random() * 3800;
          setFace((p) => (p.eyes === 'blink' ? { ...p, eyes: MOOD_FACE[st.mood].eyes } : p));
        }
      }

      // Talking mouth
      const talkFrame = st.talking && Math.floor(t * 9) % 2 === 0;
      // Star twinkle and gaze, at most ~10 updates a second
      if (Math.floor(t * 10) !== Math.floor((t - dt) * 10)) {
        const cx = st.x + SIZE_W / 2;
        const cy = st.y + SIZE_H / 2;
        let gx = (st.pointer[0] - cx) / 220;
        const gy = (st.pointer[1] - cy) / 220;
        if (flipRef.current) gx = -gx;
        setFace((p) => {
          const mouth: Mouth = st.talking ? (talkFrame ? 'open' : MOOD_FACE[st.mood].mouth) : MOOD_FACE[st.mood].mouth;
          const star = (Math.floor(t * 2.5) % 4 === 0 ? 0 : 1) as 0 | 1;
          let arms = p.arms;
          if (now < st.waveUntil) arms = Math.floor(t * 5) % 2 ? 'wave1' : 'wave2';
          else if (arms === 'wave1' || arms === 'wave2') arms = st.line?.target ? 'point' : (MOOD_FACE[st.mood].arms ?? 'down');
          const gaze: [number, number] = st.line?.target ? [1, 0] : [gx, gy];
          if (p.mouth === mouth && p.star === star && p.arms === arms && Math.round(p.gaze[0]) === Math.round(gaze[0]) && Math.round(p.gaze[1]) === Math.round(gaze[1])) return p;
          return { ...p, mouth, star, arms, gaze };
        });
      }

      // Keep beside her subject as the page scrolls; finish lines
      if (st.line) {
        if (Math.floor(t * 8) !== Math.floor((t - dt) * 8)) place();
        if (!st.talking && now > st.holdUntil && !st.overBubble) endLine();
      }

      // Scrolling much too fast
      const sy = window.scrollY;
      if (st.lastScrollT) {
        const v = Math.abs(sy - st.lastScrollY) / Math.max(0.001, (now - st.lastScrollT) / 1000);
        if (v > 5200 && now > st.fastCool && !st.line) {
          st.fastCool = now + 30000;
          sayLine({ text: 'Whoa, whoa! Slow down, you will fly past the good bits.', mood: 'surprised', priority: 1, hold: 2.2 });
        }
      }
      st.lastScrollY = sy;
      st.lastScrollT = now;

      // Falling asleep when left alone
      if (!st.sleeping && !st.line && now - st.lastActive > 38000) {
        st.sleeping = true;
        setMood('sleepy');
      }
      if (st.sleeping && Math.floor(t / 2.6) !== Math.floor((t - dt) / 2.6)) burst('z', 3);
    };
    gsap.ticker.add(tick);

    const wake = () => {
      st.lastActive = performance.now();
      if (st.sleeping) {
        st.sleeping = false;
        sayLine({ text: "Mm? I'm up, I'm up! I was just... resting my pixels.", mood: 'surprised', priority: 2, hold: 2.4 });
      }
    };
    const onMove = (e: PointerEvent) => { st.pointer = [e.clientX, e.clientY]; wake(); };
    const onScroll = () => wake();
    const onResize = () => place();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('wheel', onScroll, { passive: true });
    window.addEventListener('keydown', onScroll);
    window.addEventListener('resize', onResize);

    // ---- throwing her about ---------------------------------------------------------------------
    let reversals: number[] = [];
    let lastVx = 0;
    const drag = Draggable.create(el, {
      type: 'x,y',
      inertia: true,
      bounds: { minX: 0, minY: 0, maxX: window.innerWidth - SIZE_W, maxY: window.innerHeight - SIZE_H },
      edgeResistance: 0.8,
      dragClickables: true,
      onPress(this: Draggable) {
        st.lastActive = performance.now();
        // She lives in the viewport, whatever the page's scroll
        this.applyBounds({ minX: 0, minY: 0, maxX: window.innerWidth - SIZE_W, maxY: window.innerHeight - SIZE_H });
        lastTx = NaN;
      },
      onDragStart() {
        st.dragging = true;
        gsap.killTweensOf(el);
        // Grabbed mid-explanation: let go of the topic rather than snapping back to it
        if (st.line?.target) endLine();
        setMood('surprised');
        setFace((p) => ({ ...p, arms: 'up' }));
        reversals = [];
        lastVx = 0;
      },
      onDrag(this: Draggable) {
        const vx = (this as unknown as { deltaX: number }).deltaX;
        if (vx * lastVx < 0 && Math.abs(vx) > 6) reversals.push(performance.now());
        lastVx = vx;
        reversals = reversals.filter((r) => performance.now() - r < 900);
        if (reversals.length >= 4 && performance.now() > st.dizzyUntil) {
          st.dizzyUntil = performance.now() + 2600;
          setFace((p) => ({ ...p, eyes: 'x', mouth: 'wobble' }));
        }
      },
      onRelease() {
        st.dragging = false;
      },
      onThrowComplete() {
        st.x = gsap.getProperty(el, 'x') as number;
        st.y = gsap.getProperty(el, 'y') as number;
        st.parkedUntil = performance.now() + 9000;
        if (performance.now() < st.dizzyUntil) {
          sayLine({ text: 'Everything is spinning... is this what Uranus feels like?', mood: 'scared', priority: 3, hold: 2.6 });
        } else {
          setMood('happy');
          burst('spark', 8);
          window.setTimeout(() => !st.line && setMood('calm'), 1200);
        }
      },
      onDragEnd() {
        st.x = gsap.getProperty(el, 'x') as number;
        st.y = gsap.getProperty(el, 'y') as number;
        st.parkedUntil = performance.now() + 9000;
      },
      onClick() {
        st.lastActive = performance.now();
        burst('heart', 7);
        gsap.fromTo(body.current, { scaleY: 0.8, scaleX: 1.15 }, { scaleY: 1, scaleX: 1, duration: 0.6, ease: 'elastic.out(1.2, 0.35)' });
        sayLine({ text: POKES[Math.floor(Math.random() * POKES.length)], mood: 'happy', priority: 3 });
      },
    })[0];

    const onDbl = () => {
      gsap.to(st, { spin: st.spin + 360, duration: 0.9, ease: 'back.out(1.4)', onComplete: () => { st.spin = 0; } });
      burst('star', 10);
      sayLine({ text: 'Wheee! Do it again!', mood: 'excited', priority: 3, hold: 1.8 });
    };
    el.addEventListener('dblclick', onDbl);

    // A first hello
    const hello = window.setTimeout(() => {
      sayLine({ text: "Hi, I'm Vela! I'll walk you through how Solaris was made. Hover anything with a dotted line and I'll explain it. And yes, you can throw me.", mood: 'happy', priority: 1, hold: 6 });
    }, 2600);

    return () => {
      off();
      gsap.ticker.remove(tick);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('wheel', onScroll);
      window.removeEventListener('keydown', onScroll);
      window.removeEventListener('resize', onResize);
      el.removeEventListener('dblclick', onDbl);
      drag.kill();
      window.clearInterval(typer);
      window.clearTimeout(hello);
    };
  }, []);

  const flipRef = useRef(flip);
  flipRef.current = flip;

  // The bubble sits on the side with more room
  const [bubbleSide, setBubbleSide] = useState<'left' | 'right' | 'top'>('top');
  useEffect(() => {
    const id = window.setInterval(() => {
      const st = s.current;
      // Docked at the side, the bubble sits above her so it never covers the text column
      const docked = !st.line?.target && performance.now() > st.parkedUntil && !st.dragging;
      const wide = window.innerWidth > 760;
      if (docked && wide) { setBubbleSide('top'); return; }
      const t = st.line?.target?.getBoundingClientRect();
      if (t && wide) {
        // Open away from what she is explaining, so the bubble never covers it
        const targetLeft = t.left + t.width / 2 < st.x + SIZE_W / 2;
        const roomRight = window.innerWidth - (st.x + SIZE_W) > 340;
        const roomLeft = st.x > 340;
        setBubbleSide(targetLeft ? (roomRight ? 'right' : 'top') : roomLeft ? 'left' : 'top');
        return;
      }
      setBubbleSide(st.x > window.innerWidth / 2 ? 'left' : 'right');
    }, 200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <div ref={fx} className="vm-fx" aria-hidden />
      <div ref={root} className="vm-root" role="img" aria-label="Vela, your guide. Click, drag or double-click her.">
        <div ref={body} className="vm-body" style={{ width: SIZE_W, height: SIZE_H }}>
          <svg width={SIZE_W} height={SIZE_H} viewBox={`0 0 ${W} ${H}`} shapeRendering="crispEdges" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
            {pixels.map(([x, y, c]) => (
              <rect key={y * W + x} x={x} y={y} width={1.02} height={1.02} fill={c} />
            ))}
          </svg>
        </div>
        <div
          ref={bubble}
          className={`vm-bubble ${shown ? 'is-on' : ''} side-${bubbleSide}`}
          aria-live="polite"
          onPointerEnter={() => { s.current.overBubble = true; }}
          onPointerLeave={() => { s.current.overBubble = false; }}
        >
          <div className="vm-bubble-head">
            <span className="vm-dot" /> VELA
            <button type="button" className="vm-x" aria-label="Close" onClick={(e) => { e.stopPropagation(); vela.hush(); }}>×</button>
          </div>
          <div className="vm-bubble-text">
            {text}
            {shown && s.current.talking && <span className="vm-caret" />}
          </div>
        </div>
      </div>
    </>
  );
};
