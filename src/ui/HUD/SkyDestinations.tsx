import React from 'react';

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
}

/** Surfaces with a remarkable sky: pick one to stand there and look up. */
export const SkyDestinations: React.FC<Props> = ({ current, onGo }) => (
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
  </div>
);

export default SkyDestinations;
