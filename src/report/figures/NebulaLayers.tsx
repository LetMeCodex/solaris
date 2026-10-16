import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { vela } from '../vela/bus';

/**
 * How a flat photograph becomes a nebula you can fly around: it is cut into brightness bands
 * (faint outer haze to bright cores) and each band is placed at its own depth. Scroll and the
 * stack swings round and comes apart; together, from the front, they are the picture again.
 */

const BANDS = ['faintest haze', 'outer haze', 'dust edges', 'cloud body', 'bright folds', 'ionised rims', 'hottest cores'];

export const NebulaLayers: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const base = import.meta.env.BASE_URL;
  useGSAP(
    () => {
      const layers = gsap.utils.toArray<HTMLElement>('.nl-layer');
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 75%', end: 'bottom 25%', scrub: 0.8 } });
      tl.to('.nl-stack', { rotateY: -38, rotateX: 14, duration: 1, ease: 'power2.inOut' }, 0)
        .to(layers, { z: (i) => (i - 3) * 95, duration: 1, ease: 'power2.inOut' }, 0)
        .to('.nl-tag', { opacity: 1, x: 0, stagger: 0.05, duration: 0.4 }, 0.45)
        .to('.nl-stack', { rotateY: -8, rotateX: 4, duration: 0.6, ease: 'power2.inOut' }, 1.2)
        .to(layers, { z: 0, duration: 0.6, ease: 'power2.inOut' }, 1.2)
        .to('.nl-tag', { opacity: 0, duration: 0.3 }, 1.2);
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className="nl">
      <div className="nl-stage">
        <div className="nl-stack">
          {BANDS.map((b, i) => (
            <div
              key={b}
              className="nl-layer"
              onPointerEnter={(e) => vela.say({ text: `Layer ${i + 1}: the ${b}. In Solaris this band sits at its own depth and moves its own way, so the nebula has parallax when you swing around it.`, target: e.currentTarget, mood: 'excited', priority: 2, hold: 2.4 })}
            >
              <img src={`${base}report/media/neb-band-${i}.webp`} alt="" draggable={false} />
              <span className="nl-tag">{String(i + 1).padStart(2, '0')} · {b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
