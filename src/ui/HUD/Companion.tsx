import React, { useCallback, useEffect, useRef, useState } from 'react';
import { beautifulPlaces, CompanionAction, factIds, idsWith, lineText, pick, Secret, secretsAt } from '../../companion/knowledge';
import { voice } from '../../companion/voice';
import type { FlightRoute } from '../../rendering/SolarSystemScene';
import { tourSeen } from './Tour';

/**
 * VELA — a companion, not a chatbot. She starts conversations, teases, reacts to what you do and
 * offers to show you things. Every line is a real recording (Kokoro neural voice) shown as a
 * minimal dialogue box; you answer by picking one of her choices (click or keys 1–4).
 */

export interface CompanionActions {
  fly: (body: string) => void;
  sky: (body: string, facing?: string) => void;
  landmark: (id: string) => void;
  horizon: (on: boolean) => void;
  lens: (name: 'cinematic' | 'fisheye' | 'clean') => void;
  scale: (mode: 'exploration' | 'scientific') => void;
  time: (rate: number) => void;
  tour: () => void;
}

interface Choice {
  label: string;
  run: () => void;
}

interface Beat {
  id: string;
  choices?: Choice[];
  /** Called when this beat finishes without a choice. */
  after?: () => void;
}

const SEEN_KEY = 'solaris.vela.met';

export const Companion: React.FC<{
  ready: boolean;
  current: string;
  inTransit: boolean;
  route: FlightRoute | null;
  arrival: { name: string; nonce: number } | null;
  tourStep: { index: number; nonce: number } | null;
  tourOpen: boolean;
  horizon: { rRs: number; onShore: boolean } | null;
  surfaceActive: boolean;
  orbitsOn: boolean;
  timeRate: number;
  lens: string;
  scaleMode: string;
  actions: CompanionActions;
  onTalkingChange?: (talking: boolean) => void;
}> = ({ ready, current, inTransit, route, arrival, tourStep, tourOpen, horizon, surfaceActive, orbitsOn, timeRate, lens, scaleMode, actions, onTalkingChange }) => {
  const [beat, setBeat] = useState<Beat | null>(null);
  const [shown, setShown] = useState(0);
  const [quiet, setQuiet] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => {
    const l = (s: boolean) => setSpeaking(s);
    voice.listeners.add(l);
    return () => {
      voice.listeners.delete(l);
    };
  }, []);
  const queue = useRef<Beat[]>([]);
  const orbRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef(actions);
  actionsRef.current = actions;
  const visited = useRef(new Set<string>());
  const usedFacts = useRef(new Set<string>());
  const said = useRef(new Set<string>());
  const pendingHorizon = useRef(false);
  const lastActivity = useRef(performance.now());
  const beatRef = useRef<Beat | null>(null);
  beatRef.current = beat;

  const text = beat ? lineText(beat.id) : '';
  const typing = beat !== null && shown < text.length;

  useEffect(() => onTalkingChange?.(beat !== null && !tourOpen), [beat, tourOpen, onTalkingChange]);

  /* ------------------------------------------------------------------ the voice → the orb */
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const a = voice.amplitude();
      orbRef.current?.style.setProperty('--amp', a.toFixed(3));
      boxRef.current?.style.setProperty('--amp', a.toFixed(3));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ------------------------------------------------------------------ dialogue engine */
  const next = useCallback(() => {
    const b = queue.current.shift() ?? null;
    setShown(0);
    setBeat(b);
  }, []);

  /** Queue lines. `now` interrupts whatever she is saying. */
  const say = useCallback(
    (beats: Beat | Beat[], now = false) => {
      const list = Array.isArray(beats) ? beats : [beats];
      if (now) {
        voice.stop();
        queue.current = [...list];
        next();
      } else {
        queue.current.push(...list);
        if (!beatRef.current) next();
      }
      voice.preload(list.map((b) => b.id));
    },
    [next]
  );

  // Play the current beat and type it out at the pace of the recording
  useEffect(() => {
    if (!beat) return;
    let cancelled = false;
    const t = lineText(beat.id);
    const seconds = voice.seconds(beat.id) ?? Math.max(1.6, t.length * 0.055);
    const perChar = Math.max(14, (seconds * 900) / Math.max(1, t.length));
    let i = 0;
    const typer = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= t.length) window.clearInterval(typer);
    }, perChar);
    let hold = 0;
    const finish = () => {
      if (cancelled || beat.choices?.length) return;
      hold = window.setTimeout(() => {
        if (cancelled) return;
        beat.after?.();
        next();
      }, 2200);
    };
    if (voice.enabled) {
      void voice.play(beat.id).then(finish);
    } else {
      hold = window.setTimeout(finish, seconds * 1000);
    }
    // Choices wait a while, then she lets it go
    const giveUp = beat.choices?.length ? window.setTimeout(() => !cancelled && next(), 22000) : 0;
    return () => {
      cancelled = true;
      window.clearInterval(typer);
      window.clearTimeout(hold);
      window.clearTimeout(giveUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat]);

  const choose = useCallback(
    (c: Choice) => {
      lastActivity.current = performance.now();
      voice.stop();
      queue.current = [];
      setBeat(null);
      c.run();
    },
    []
  );

  // Keys 1–4 answer; Space/Enter finishes the line
  useEffect(() => {
    if (!beat) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || tourOpen) return;
      const n = Number(e.key);
      if (beat.choices && n >= 1 && n <= beat.choices.length && !typing) {
        e.preventDefault();
        choose(beat.choices[n - 1]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [beat, typing, choose, tourOpen]);

  /* ------------------------------------------------------------------ what she can do */
  const run = useCallback(
    (a: CompanionAction) => {
      const act = actionsRef.current;
      switch (a.kind) {
        case 'fly': act.fly(a.body); break;
        case 'sky': act.sky(a.body, a.facing); break;
        case 'landmark': act.landmark(a.id); break;
        case 'horizon':
          if (current === 'Sagittarius A*' && !inTransit) act.horizon(true);
          else {
            pendingHorizon.current = true;
            act.fly('Sagittarius A*');
          }
          break;
        case 'lens': act.lens(a.name); break;
        case 'scale': act.scale(a.mode); break;
        case 'time': act.time(a.rate); break;
        case 'tour': act.tour(); break;
      }
    },
    [current, inTransit]
  );

  const offerSecret = useCallback(
    (s: Secret): Beat => ({
      id: `secret.${s.id}`,
      choices: [
        { label: s.label, run: () => { say({ id: pick(idsWith('accept.')) }); setTimeout(() => run(s.action), 350); } },
        { label: 'Not now', run: () => say({ id: pick(idsWith('decline.')) }) },
      ],
    }),
    [run, say]
  );

  const factFor = useCallback((body: string): string | null => {
    const fresh = factIds(body).filter((id) => !usedFacts.current.has(id));
    const pool = fresh.length ? fresh : factIds(body);
    if (!pool.length) return null;
    const id = pick(pool);
    usedFacts.current.add(id);
    return id;
  }, []);

  /** Her menu when you tap the orb. */
  const menu = useCallback((): Choice[] => {
    const here = secretsAt(current);
    return [
      { label: 'Tell me something', run: () => { const f = factFor(current) ?? factFor(pick(['Saturn', 'Mars', 'Jupiter', 'Venus'])); if (f) say({ id: f }); } },
      { label: 'Show me a secret', run: () => say(offerSecret(here.length ? pick(here) : pick(beautifulPlaces()))) },
      { label: 'Somewhere beautiful', run: () => { const s = pick(beautifulPlaces()); say({ id: pick(idsWith('accept.')) }); setTimeout(() => run(s.action), 400); } },
      quiet
        ? { label: 'Talk to me again', run: () => { setQuiet(false); say({ id: pick(idsWith('poke.')) }); } }
        : { label: 'Hush for a while', run: () => { say({ id: 'hush', after: () => setQuiet(true) }); } },
    ];
  }, [current, quiet, factFor, offerSecret, run, say]);

  const poke = () => {
    lastActivity.current = performance.now();
    if (beat && typing) {
      setShown(text.length);
      return;
    }
    say({ id: pick(idsWith('poke.')), choices: menu() }, true);
  };

  /* ------------------------------------------------------------------ she reacts */
  // First words
  useEffect(() => {
    if (!ready) return;
    let met = false;
    try {
      met = localStorage.getItem(SEEN_KEY) === '1';
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* ignore */
    }
    visited.current.add(current);
    const t = window.setTimeout(() => {
      if (!tourSeen()) {
        say([{ id: 'greet.first.1' }, { id: 'greet.first.2' }, { id: 'greet.first.3', after: () => actionsRef.current.tour() }]);
      } else {
        say({ id: met ? pick(idsWith('greet.back.')) : 'greet.first.2', choices: menu() });
      }
    }, 900);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Tour: she narrates each step in her own words (voice only; the card shows the details)
  useEffect(() => {
    if (!tourStep) return;
    const id = `tour.${tourStep.index}`;
    if (lineText(id)) say({ id }, true);
  }, [tourStep, say]);
  useEffect(() => {
    if (!tourOpen && beatRef.current?.id.startsWith('tour.')) {
      voice.stop();
      queue.current = [];
      setBeat(null);
    }
  }, [tourOpen]);

  // Long journeys
  const lastRoute = useRef(-1);
  useEffect(() => {
    if (!route || route.id === lastRoute.current || tourOpen || quiet) return;
    lastRoute.current = route.id;
    const id = `journey.${route.to}`;
    if (lineText(id) && !said.current.has(id)) {
      said.current.add(id);
      say({ id }, true);
    }
  }, [route, tourOpen, quiet, say]);

  // Arrivals
  useEffect(() => {
    const a = arrival;
    if (!a || tourOpen) return;
    lastActivity.current = performance.now();
    if (pendingHorizon.current && a.name === 'Sagittarius A*') {
      pendingHorizon.current = false;
      window.setTimeout(() => actionsRef.current.horizon(true), 700);
      return;
    }
    // Standing on a surface, the sky is the point: she says "look up" instead (see reactions)
    if (quiet || surfaceActive) return;
    const first = !visited.current.has(a.name);
    visited.current.add(a.name);
    const fact = factFor(a.name);
    const secret = first ? secretsAt(a.name)[0] : undefined;
    const beats: Beat[] = [];
    if (fact && (first || Math.random() < 0.5)) beats.push({ id: fact });
    if (secret) beats.push(offerSecret(secret));
    if (beats.length) window.setTimeout(() => say(beats, true), 1100);
  }, [arrival, tourOpen, quiet, surfaceActive, factFor, offerSecret, say]);

  // Little reactions to what you change (not during the tour's own demos)
  const prev = useRef({ orbitsOn: orbitsOn, timeRate: timeRate, lens: lens, scaleMode: scaleMode, surface: surfaceActive });
  useEffect(() => {
    const was = prev.current;
    prev.current = { orbitsOn: orbitsOn, timeRate: timeRate, lens: lens, scaleMode: scaleMode, surface: surfaceActive };
    if (!ready || tourOpen || quiet) return;
    if (was.orbitsOn && !orbitsOn) say({ id: 'react.orbits-off' }, true);
    else if (was.timeRate !== timeRate && timeRate >= 31536000) say({ id: 'react.year' }, true);
    else if (was.lens !== lens && lens === 'fisheye') say({ id: 'react.fisheye' }, true);
    else if (was.scaleMode !== scaleMode && scaleMode === 'scientific') say({ id: 'react.true-scale' }, true);
    else if (!was.surface && surfaceActive) window.setTimeout(() => say({ id: pick(idsWith('surface.')) }, true), 1500);
  }, [orbitsOn, timeRate, lens, scaleMode, surfaceActive, ready, tourOpen, quiet, say]);

  // The black hole, up close
  useEffect(() => {
    const h = horizon;
    if (!h || quiet) return;
    const once = (id: string) => {
      if (said.current.has(id)) return;
      said.current.add(id);
      window.setTimeout(() => say({ id }, true), 600);
    };
    if (h.onShore) once('bh.horizon');
    else if (h.rRs < 1.5) once('bh.photon');
    else if (h.rRs < 3) once('bh.deep');
  }, [horizon, quiet, say]);

  // Idle: once per world, after a quiet stretch, she says something
  useEffect(() => {
    if (!ready) return;
    const onAct = () => (lastActivity.current = performance.now());
    window.addEventListener('pointerdown', onAct);
    window.addEventListener('keydown', onAct);
    const hinted = new Set<string>();
    const id = window.setInterval(() => {
      if (quiet || tourOpen || inTransit || beatRef.current || hinted.has(current)) return;
      if (performance.now() - lastActivity.current < 75000) return;
      hinted.add(current);
      say({ id: pick(idsWith('idle.')), choices: menu() });
    }, 5000);
    return () => {
      window.removeEventListener('pointerdown', onAct);
      window.removeEventListener('keydown', onAct);
      window.clearInterval(id);
    };
  }, [ready, tourOpen, inTransit, current, quiet, menu, say]);

  if (!ready) return null;
  const showBox = beat !== null && !tourOpen;

  return (
    <>
      {showBox && (
        <div
          ref={boxRef}
          key={beat.id + (beat.choices ? 'c' : '')}
          className={`vela-dialog ${inTransit ? 'in-transit' : ''}`}
          role="dialog"
          aria-live="polite"
          aria-label={`Vela says: ${text}`}
          onClick={() => (typing ? setShown(text.length) : !beat.choices && next())}
        >
          <span className="vela-tag">
            <i aria-hidden /> Vela
          </span>
          <p className="vela-line">
            <span aria-hidden>“</span>
            {text.slice(0, shown)}
            {typing ? <span className="vela-cursor" aria-hidden /> : <span aria-hidden>”</span>}
          </p>
          {beat.choices && !typing && (
            <ol className="vela-choices">
              {beat.choices.map((c, i) => (
                <li key={c.label}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      choose(c);
                    }}
                  >
                    <span className="k">{i + 1}</span> {c.label}
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      <button
        ref={orbRef}
        className={`vela-orb ${speaking ? 'speaking' : ''} ${quiet ? 'quiet' : ''} ${surfaceActive ? 'on-surface' : ''}`}
        onClick={poke}
        aria-label="Talk to Vela"
        title="Vela · tap to talk"
        data-tour="vela"
      >
        <svg viewBox="0 0 64 64" aria-hidden>
          <circle className="ring r1" cx="32" cy="32" r="29" />
          <circle className="ring r2" cx="32" cy="32" r="23" />
          <circle className="sat" cx="32" cy="3" r="1.6" />
          <circle className="core-glow" cx="32" cy="32" r="15" />
          <circle className="core" cx="32" cy="32" r="7" />
        </svg>
        <span className="vela-name">Vela</span>
      </button>
    </>
  );
};

export default Companion;
