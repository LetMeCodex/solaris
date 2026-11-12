import React from 'react';
import './hudIcons.css';

/**
 * The jet's controls as small animated instruments instead of words. Each icon draws its state
 * (the camera you are in, the speed tier, the weather, the era…) and moves when touched: clock hands
 * sweep back or on, rain falls, the hourglass runs, the gyro spins, the sound waves pulse. Hovering
 * shows the name and the state underneath.
 */

export type IconName =
  | 'prev' | 'next' | 'target' | 'land' | 'cancel'
  | 'view-chase' | 'view-cockpit' | 'view-gopro' | 'view-flyby'
  | 'tier-0' | 'tier-1' | 'tier-2' | 'home'
  | 'hour-back' | 'hour-on'
  | 'weather-auto' | 'weather-clear' | 'weather-rain' | 'weather-snow' | 'weather-storm'
  | 'scale' | 'aircraft' | 'era' | 'assist' | 'inertial' | 'sound' | 'muted' | 'help' | 'exit' | 'menu';

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

function glyph(name: IconName): React.ReactNode {
  switch (name) {
    case 'prev':
      return <path {...S} className="ic-nudge-l" d="M14.5 6 8.5 12l6 6" />;
    case 'next':
      return <path {...S} className="ic-nudge-r" d="M9.5 6l6 6-6 6" />;
    case 'target':
      // A world on its orbit, the orbit turning
      return (
        <>
          <circle {...S} cx="12" cy="12" r="4.2" />
          <g className="ic-spin-slow"><ellipse {...S} cx="12" cy="12" rx="9.5" ry="3.6" transform="rotate(-24 12 12)" strokeDasharray="3 2.2" /></g>
          <circle className="ic-fill" cx="12" cy="12" r="1.2" />
        </>
      );
    case 'land':
      // The runway and the glide path, a dot sliding down it
      return (
        <>
          <path {...S} d="M8 21 10.5 13h3L16 21" />
          <path {...S} d="M12 15.2v1.6M12 18.6v1.6" />
          <path {...S} strokeDasharray="1.6 1.8" d="M3 4.5 11 12.5" />
          <circle className="ic-fill ic-glide" cx="3" cy="4.5" r="1.6" />
        </>
      );
    case 'cancel':
      return <path {...S} d="M6.5 6.5l11 11M17.5 6.5l-11 11" />;
    case 'view-chase':
      // The jet seen from behind
      return (
        <g className="ic-bob">
          <path {...S} d="M12 5v12M3.5 14.5 12 11l8.5 3.5M9.5 18.5h5" />
          <circle {...S} cx="12" cy="17.5" r="1.4" />
        </g>
      );
    case 'view-cockpit':
      // The canopy arch and the HUD glass
      return (
        <>
          <path {...S} d="M3.5 18.5C4.5 9.5 19.5 9.5 20.5 18.5" />
          <rect {...S} x="9.3" y="12.6" width="5.4" height="4.4" rx="0.6" />
          <path {...S} className="ic-blink" d="M10.8 14.8h2.4" />
        </>
      );
    case 'view-gopro':
      // An action camera, its iris opening
      return (
        <>
          <rect {...S} x="3.5" y="7" width="17" height="11" rx="2.2" />
          <circle {...S} cx="14" cy="12.5" r="3.4" />
          <circle className="ic-fill ic-iris" cx="14" cy="12.5" r="1.4" />
          <path {...S} d="M6.5 10h2" />
        </>
      );
    case 'view-flyby':
      // An eye watching it pass
      return (
        <>
          <path {...S} d="M2.5 12s3.6-6 9.5-6 9.5 6 9.5 6-3.6 6-9.5 6-9.5-6-9.5-6Z" />
          <circle {...S} className="ic-look" cx="12" cy="12" r="2.6" />
        </>
      );
    case 'tier-0':
    case 'tier-1':
    case 'tier-2': {
      const n = name === 'tier-0' ? 1 : name === 'tier-1' ? 2 : 3;
      return (
        <g className={n > 1 ? 'ic-rush' : undefined}>
          {Array.from({ length: n }, (_, i) => (
            <path key={i} {...S} d={`M${5 + i * 5} 6.5l5 5.5-5 5.5`} opacity={0.45 + 0.55 * ((i + 1) / n)} />
          ))}
          {n === 3 && <path {...S} strokeWidth={1} className="ic-streak" d="M2 12h3" />}
        </g>
      );
    }
    case 'home':
      return (
        <>
          <path {...S} d="M4.5 11.5 12 5l7.5 6.5M6.5 10v8.5h11V10" />
          <path {...S} className="ic-door" d="M10.5 18.5v-4h3v4" />
        </>
      );
    case 'hour-back':
    case 'hour-on':
      return (
        <>
          <circle {...S} cx="12" cy="12" r="8.5" />
          <g className={name === 'hour-on' ? 'ic-hand-on' : 'ic-hand-back'}>
            <path {...S} d="M12 12V6.8" />
          </g>
          <path {...S} d="M12 12l3 1.8" />
          <path {...S} strokeWidth={1.2} d={name === 'hour-on' ? 'M18.6 3.6l1.2 2.6-2.7.6' : 'M5.4 3.6 4.2 6.2l2.7.6'} />
        </>
      );
    case 'weather-auto':
    case 'weather-clear':
    case 'weather-rain':
    case 'weather-snow':
    case 'weather-storm': {
      const cloud = <path {...S} d="M7 17.5h10a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.6-1A4 4 0 0 0 7 17.5Z" />;
      if (name === 'weather-clear') {
        return (
          <g className="ic-spin-slow">
            <circle {...S} cx="12" cy="12" r="4" />
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * Math.PI) / 4;
              return <path key={i} {...S} d={`M${12 + Math.cos(a) * 6.6} ${12 + Math.sin(a) * 6.6}L${12 + Math.cos(a) * 8.8} ${12 + Math.sin(a) * 8.8}`} />;
            })}
          </g>
        );
      }
      if (name === 'weather-auto') {
        return (
          <>
            <g className="ic-sun-peek">
              <circle {...S} cx="16.5" cy="7.5" r="3" />
              <path {...S} d="M16.5 2.6v1M21.4 7.5h-1M20 4l-.7.7" />
            </g>
            <g transform="translate(-1.5 1)">{cloud}</g>
          </>
        );
      }
      return (
        <>
          <g transform="translate(0 -3)">{cloud}</g>
          {name === 'weather-rain' && [8, 12, 16].map((x, i) => <path key={x} {...S} className="ic-drop" style={{ animationDelay: `${i * 0.25}s` }} d={`M${x} 17l-1 3`} />)}
          {name === 'weather-snow' && [8, 12, 16].map((x, i) => <circle key={x} className="ic-fill ic-flake" style={{ animationDelay: `${i * 0.35}s` }} cx={x} cy="18" r="0.9" />)}
          {name === 'weather-storm' && <path {...S} className="ic-bolt" d="M12.5 15.5 10.5 19h3l-2 3.5" />}
        </>
      );
    }
    case 'scale':
      // A world grown to the size of its orbit, breathing between the two
      return (
        <>
          <circle {...S} cx="12" cy="12" r="9" strokeDasharray="2 2.4" />
          <circle {...S} className="ic-breathe" cx="12" cy="12" r="4.2" />
        </>
      );
    case 'aircraft':
      return <path {...S} className="ic-bob" d="M12 3.5v15M12 9 3.5 15.5h17L12 9ZM9.5 20.5h5" />;
    case 'era':
      // An hourglass: sand runs, then it turns
      return (
        <g className="ic-turn">
          <path {...S} d="M7 3.5h10M7 20.5h10M8 3.5c0 5 8 5 8 8.5s-8 3.5-8 8.5M16 3.5c0 5-8 5-8 8.5" />
          <path className="ic-fill ic-sand" d="M9.6 18.8c.6-1.8 4.2-1.8 4.8 0Z" />
          <path {...S} strokeWidth={1} className="ic-stream" d="M12 12.4v4.6" />
        </g>
      );
    case 'assist':
    case 'inertial':
      // A gyro: rings spinning (assist) or a free body drifting (inertial)
      return name === 'assist' ? (
        <>
          <g className="ic-spin"><ellipse {...S} cx="12" cy="12" rx="8.5" ry="3.4" /></g>
          <g className="ic-spin-rev"><ellipse {...S} cx="12" cy="12" rx="3.4" ry="8.5" /></g>
          <circle className="ic-fill" cx="12" cy="12" r="1.6" />
        </>
      ) : (
        <>
          <circle {...S} cx="12" cy="12" r="8.5" strokeDasharray="1.5 2.5" />
          <circle className="ic-fill ic-drift" cx="12" cy="12" r="2" />
        </>
      );
    case 'sound':
    case 'muted':
      return (
        <>
          <path {...S} d="M4 9.5h3.2L12 5.5v13l-4.8-4H4Z" />
          {name === 'sound' ? (
            <>
              <path {...S} className="ic-wave" d="M15.2 9.2a4 4 0 0 1 0 5.6" />
              <path {...S} className="ic-wave ic-wave2" d="M17.8 6.8a7.4 7.4 0 0 1 0 10.4" />
            </>
          ) : (
            <path {...S} d="M15.5 9.5l5 5M20.5 9.5l-5 5" />
          )}
        </>
      );
    case 'help':
      return (
        <>
          <rect {...S} x="2.8" y="6.5" width="18.4" height="11" rx="2" />
          <path {...S} className="ic-keys" d="M6 10h1M9 10h1M12 10h1M15 10h1M18 10h0M7.5 14h9" />
        </>
      );
    case 'exit':
      return (
        <>
          <path {...S} d="M10 4.5H5.5v15H10" />
          <path {...S} className="ic-nudge-r" d="M14.5 8l4 4-4 4M18.5 12H9" />
        </>
      );
    case 'menu':
      return <path {...S} d="M4.5 7h15M4.5 12h15M4.5 17h15" />;
  }
}

export const IconButton: React.FC<{
  icon: IconName;
  label: string;
  state?: string;
  on?: boolean;
  tone?: 'mint' | 'red';
  title?: string;
  onClick: () => void;
  ariaExpanded?: boolean;
}> = ({ icon, label, state, on, tone, title, onClick, ariaExpanded }) => (
  <button
    type="button"
    className={`ib ${on ? 'is-on' : ''} ${tone ? `ib--${tone}` : ''}`}
    title={title}
    aria-label={state ? `${label}: ${state}` : label}
    aria-expanded={ariaExpanded}
    onClick={onClick}
  >
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      {glyph(icon)}
    </svg>
    <span className="ib__tip">
      {label}
      {state ? <em>{state}</em> : null}
    </span>
  </button>
);
