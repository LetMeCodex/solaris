import React from 'react';

/** Places whose sky is worth standing under. The parent world is placed ~40° up, on its sunlit side. */
export const SKY_DESTINATIONS: Array<{ body: string; facing?: string; label: string }> = [
  { body: 'Moon', facing: 'Earth', label: 'Earth from the Moon' },
  { body: 'Enceladus', facing: 'Saturn', label: 'Saturn from Enceladus' },
  { body: 'Mimas', facing: 'Saturn', label: 'Saturn from Mimas' },
  { body: 'Iapetus', facing: 'Saturn', label: 'Open rings from Iapetus' },
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

/** Chips that drop you onto a surface with a remarkable sky. */
export const SkyDestinations: React.FC<Props> = ({ current, onGo }) => (
  <div className="border-t border-white/10 pt-2">
    <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1.5">Look up from…</div>
    <div className="flex flex-wrap gap-1.5">
      {SKY_DESTINATIONS.map((d) => (
        <button
          key={d.label}
          onClick={() => onGo(d.body, d.facing)}
          aria-current={current === d.body ? 'true' : undefined}
          className={`px-2 py-0.5 rounded-full border text-[10px] transition focus-visible:ring-1 focus-visible:ring-white/60 ${
            current === d.body
              ? 'border-amber-300/50 text-amber-100 bg-amber-300/10'
              : 'border-white/15 text-white/65 hover:text-white hover:border-white/35'
          }`}
        >
          {d.label}
        </button>
      ))}
    </div>
  </div>
);

export default SkyDestinations;
