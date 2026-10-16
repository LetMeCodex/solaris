import React, { useEffect, useRef, useState } from 'react';

/**
 * How surface imagery streams in, like a web map: the globe is cut into a pyramid of tiles, each
 * level four times sharper than the last. Only tiles near where you look are fetched, coarse to
 * fine and nearest first, at most six at a time; until a tile arrives its parent stands in.
 */

const W = 1180;
const H = 460;
const SIZE = 380;
const LEVELS = 5;

interface Tile { l: number; x: number; y: number; d: number }

export const TilePyramid: React.FC = () => {
  const [tick, setTick] = useState(0);
  const [focus, setFocus] = useState<[number, number]>([0.62, 0.42]);
  const loaded = useRef(new Map<string, number>());
  const queue = useRef<Tile[]>([]);
  const inFlight = useRef<Array<{ t: Tile; done: number }>>([]);
  const svg = useRef<SVGSVGElement>(null);
  const visible = useRef(true);

  // Plan the requests for a focus point: levels coarse to fine, nearest first
  const plan = (f: [number, number]) => {
    const q: Tile[] = [];
    for (let l = 0; l < LEVELS; l++) {
      const n = 2 ** l;
      const reach = l < 2 ? 99 : 1.6 / n + 0.12;
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        const cx = (x + 0.5) / n;
        const cy = (y + 0.5) / n;
        const d = Math.hypot(cx - f[0], cy - f[1]);
        if (d < reach) q.push({ l, x, y, d });
      }
    }
    q.sort((a, b) => a.l - b.l || a.d - b.d);
    return q.filter((t) => !loaded.current.has(`${t.l}/${t.x}/${t.y}`));
  };

  useEffect(() => {
    queue.current = plan(focus);
    inFlight.current = inFlight.current.filter((r) => queue.current.some((t) => t.l === r.t.l && t.x === r.t.x && t.y === r.t.y));
  }, [focus]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; });
    if (svg.current) io.observe(svg.current);
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible.current) return;
      const now = performance.now();
      // Finish requests, start new ones (six at a time)
      inFlight.current = inFlight.current.filter((r) => {
        if (now < r.done) return true;
        loaded.current.set(`${r.t.l}/${r.t.x}/${r.t.y}`, now);
        return false;
      });
      while (inFlight.current.length < 6 && queue.current.length) {
        const t = queue.current.shift()!;
        if (loaded.current.has(`${t.l}/${t.x}/${t.y}`)) continue;
        inFlight.current.push({ t, done: now + 220 + Math.random() * 380 });
      }
      setTick((k) => (k + 1) % 1000000);
    };
    raf = requestAnimationFrame(loop);
    // Wander the focus around, as if someone were exploring
    const wander = window.setInterval(() => {
      if (!visible.current) return;
      setFocus([0.2 + Math.random() * 0.6, 0.2 + Math.random() * 0.6]);
    }, 5200);
    return () => { cancelAnimationFrame(raf); window.clearInterval(wander); io.disconnect(); };
  }, []);

  const now = performance.now();
  const ox = 120;
  const oy = (H - SIZE) / 2;
  const tiles = drawTiles();
  function drawTiles() {
  const out: React.ReactNode[] = [];
  for (let l = 0; l < LEVELS; l++) {
    const n = 2 ** l;
    const s = SIZE / n;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const key = `${l}/${x}/${y}`;
      const at = loaded.current.get(key);
      const busy = inFlight.current.some((r) => r.t.l === l && r.t.x === x && r.t.y === y);
      if (at === undefined && !busy) continue;
      const fade = at === undefined ? 0 : Math.min(1, (now - at) / 400);
      const hue = 28 + l * 34;
      out.push(
        <rect
          key={key}
          x={ox + x * s + 0.5}
          y={oy + y * s + 0.5}
          width={s - 1}
          height={s - 1}
          fill={busy ? 'none' : `hsla(${hue}, 70%, ${42 + l * 6}%, ${0.18 + 0.16 * l * fade})`}
          stroke={busy ? '#6dfcc0' : `hsla(${hue}, 80%, 70%, ${0.25 + 0.1 * l})`}
          strokeWidth={busy ? 1.6 : 0.6}
          strokeDasharray={busy ? '3 3' : undefined}
        />
      );
    }
  }
  return out;
  }
  const total = loaded.current.size;
  return (
    <div>
      <svg
        ref={svg}
        viewBox={`0 0 ${W} ${H}`}
        className="media"
        role="img"
        aria-label="Tiles streaming in a level-of-detail pyramid"
        onPointerMove={(e) => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width) * W - ox;
          const y = ((e.clientY - r.top) / r.height) * H - oy;
          if (x > 0 && y > 0 && x < SIZE && y < SIZE) setFocus([x / SIZE, y / SIZE]);
        }}
        data-tick={tick}
      >
        <rect x={ox} y={oy} width={SIZE} height={SIZE} fill="#0d0b12" stroke="rgba(243,239,233,0.15)" />
        {tiles}
        <circle cx={ox + focus[0] * SIZE} cy={oy + focus[1] * SIZE} r={10} fill="none" stroke="#fff" strokeWidth={1.5} />
        <circle cx={ox + focus[0] * SIZE} cy={oy + focus[1] * SIZE} r={2.5} fill="#fff" />
        <g transform={`translate(${ox + SIZE + 70}, ${oy + 10})`} fontFamily="JetBrains Mono">
          {Array.from({ length: LEVELS }, (_, l) => {
            const n = 4 ** l;
            const got = [...loaded.current.keys()].filter((k) => k.startsWith(`${l}/`)).length;
            return (
              <g key={l} transform={`translate(0, ${l * 54})`}>
                <text x={0} y={0} fill={`hsl(${28 + l * 34}, 80%, 72%)`} fontSize="15">LEVEL {l}</text>
                <text x={110} y={0} fill="rgba(243,239,233,0.55)" fontSize="13">{got} of {n} tiles</text>
                <rect x={0} y={12} width={420} height={6} fill="rgba(243,239,233,0.08)" />
                <rect x={0} y={12} width={Math.max(2, (420 * got) / n)} height={6} fill={`hsl(${28 + l * 34}, 70%, 60%)`} />
              </g>
            );
          })}
          <text x={0} y={LEVELS * 54 + 26} fill="#6dfcc0" fontSize="13" letterSpacing="2">IN FLIGHT {inFlight.current.length} / 6 · LOADED {total} · QUEUED {queue.current.length}</text>
          <text x={0} y={LEVELS * 54 + 50} fill="rgba(243,239,233,0.4)" fontSize="11" letterSpacing="2">MOVE YOUR CURSOR OVER THE MAP TO LOOK SOMEWHERE ELSE</text>
        </g>
      </svg>
    </div>
  );
};
