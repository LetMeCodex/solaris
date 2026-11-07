import React from 'react';
import { DEEP_TIME_SCENES } from '../../explorer/DeepTime';

/** Places whose sky is worth standing under. The parent world is placed ~40° up, on its sunlit side. */
export const SKY_DESTINATIONS: Array<{ body: string; facing?: string; label: string }> = [
  { body: 'Moon', facing: 'Earth', label: 'Earth from the Moon' },
  { body: 'Enceladus', facing: 'Saturn', label: 'Saturn from Enceladus' },
  { body: 'Mimas', facing: 'Saturn', label: 'Saturn from Mimas' },
  { body: 'Iapetus', facing: 'Saturn', label: 'Open rings from Iapetus' },
  { body: 'Pan', facing: 'Saturn', label: 'Inside the rings, from Pan' },
  { body: 'Europa', facing: 'Jupiter', label: 'Jupiter from Europa' },
  { body: 'Io', facing: 'Jupiter', label: 'Jupiter from Io' },
  { body: 'Phobos', facing: 'Mars', label: 'Mars from Phobos' },
  { body: 'Miranda', facing: 'Uranus', label: 'Uranus from Miranda' },
  { body: 'Triton', facing: 'Neptune', label: 'Neptune from Triton' },
  { body: 'Charon', facing: 'Pluto', label: 'Pluto from Charon' },
  { body: 'Mars', label: 'Mars sky' },
  { body: 'Titan', label: "Titan's haze" },
];

interface Props {
  current?: string | null;
  onGo: (body: string, facing?: string) => void;
  /** Stand under the sky of a future era (the deep-time scenes); the list shows when given. */
  onDeepTime?: (id: string) => void;
  deepCurrent?: string | null;
}

/** Surfaces with a remarkable sky: pick one to stand there and look up. */
export const SkyDestinations: React.FC<Props> = ({ current, onGo, onDeepTime, deepCurrent }) => (
  <div>
    <div className="hud-label mb-2 px-1">Stand on a world · look up</div>
    <ul className="flex flex-col gap-0.5">
      {SKY_DESTINATIONS.map((d, i) => (
        <li key={d.label}>
          <button
            onClick={() => onGo(d.body, d.facing)}
            aria-current={current === d.body ? 'true' : undefined}
            className="hud-row hud-rise group w-full flex items-center gap-3 px-2 py-1.5 text-left"
            style={{ ['--d' as string]: `${i * 30}ms` }}
          >
            <span className="w-4 text-center text-[color:var(--sol-amber)] opacity-70 group-hover:opacity-100 transition">{d.facing ? '◐' : '◌'}</span>
            <span className="flex-1 text-[11px] text-white/80 group-hover:text-white">{d.label}</span>
            <span className="text-[10px] text-white/30 group-hover:text-[color:var(--sol-mint)] group-hover:-translate-y-0.5 transition">↑</span>
          </button>
        </li>
      ))}
    </ul>
    {onDeepTime && (
      <>
        <div className="hud-label mt-3 mb-2 px-1">Deep time · the future sky</div>
        <ul className="flex flex-col gap-0.5">
          {DEEP_TIME_SCENES.map((d, i) => (
            <li key={d.id}>
              <button
                onClick={() => onDeepTime(d.id)}
                aria-current={deepCurrent === d.id ? 'true' : undefined}
                title={d.blurb}
                className="hud-row hud-rise group w-full flex items-center gap-3 px-2 py-1.5 text-left"
                style={{ ['--d' as string]: `${(SKY_DESTINATIONS.length + i) * 30}ms` }}
              >
                <span className="w-4 text-center text-[color:var(--sol-mint)] opacity-70 group-hover:opacity-100 transition">✦</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[11px] text-white/80 group-hover:text-white truncate">{d.title}</span>
                  <span className="block text-[9px] text-white/40 truncate">{d.when}</span>
                </span>
                <span className="text-[10px] text-white/30 group-hover:text-[color:var(--sol-mint)] group-hover:-translate-y-0.5 transition">↑</span>
              </button>
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
);

export default SkyDestinations;
