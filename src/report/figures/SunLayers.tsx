import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Loop } from '../kit';
import { vela } from '../vela/bus';

/** The Sun's shader, layer by layer, beside the real thing. Layers light up as you scroll. */

const LAYERS: Array<[string, string, string]> = [
  ['Granulation', 'Three scales of convection cells from domain-warped fractal noise, each faded out before it is small enough to shimmer.', "The surface boils in cells about a thousand kilometres wide. Three sizes of noise, stacked, and each fades out before it gets small enough to flicker."],
  ['Supergranules and filaments', 'A slower network of larger cells, with dark filaments threading between them.', 'Bigger, slower cells on top, with dark threads of plasma lying between them. Real photos show this lace.'],
  ['Spots and faculae', 'Dark sunspots with brighter faculae around them.', 'Sunspots are cooler, so darker. Faculae, the bright patches near them, are hotter. Both drift with the rotation.'],
  ['Limb darkening', 'The edge darkens and reddens, as it does in real photographs.', "The edge looks darker because you're seeing higher, cooler gas there. Without this the Sun looks like a flat sticker."],
  ['Corona and spicules', 'A flame-like fringe of spicules at the limb, then glow, halo and streamers.', 'Around the edge, a fringe of little jets called spicules, then the glowing corona fading out into space.'],
  ['Prominences', 'Fourteen magnetic loops, including great arching prominences, with soft knots and threads; some erupt gently.', 'Fourteen loops of plasma held up by magnetism, some bigger than ten Earths. Now and then one lets go.'],
];

export const SunLayers: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>('.sl-item');
      items.forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0.25, x: -12 }, {
          opacity: 1, x: 0, duration: 0.6,
          scrollTrigger: { trigger: ref.current, start: `top+=${i * 70} 70%`, toggleActions: 'play none none reverse' },
        });
      });
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className="sun-layers">
      <div className="sl-media">
        <Loop src="sun" label="The Sun · rendered live in Solaris" />
      </div>
      <ol className="sl-list">
        {LAYERS.map(([t, d, v], i) => (
          <li key={t} className="sl-item" tabIndex={0} onPointerEnter={(e) => vela.say({ text: v, target: e.currentTarget, mood: 'happy', priority: 2 })}>
            <span className="sl-n">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <b>{t}</b>
              <p>{d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
