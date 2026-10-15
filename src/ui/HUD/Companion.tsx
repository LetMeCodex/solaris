import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CatalogueManager } from '../../data/CatalogueManager';
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
  zoom: (domain: 'inner_system' | 'outer_system' | 'galactic') => void;
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
  constellationsOn: boolean;
  worldsLogged: number;
  timeRate: number;
  lens: string;
  actions: CompanionActions;
  onTalkingChange?: (talking: boolean) => void;
}> = ({ ready, current, inTransit, route, arrival, tourStep, tourOpen, horizon, surfaceActive, orbitsOn, constellationsOn, worldsLogged, timeRate, lens, actions, onTalkingChange }) => {
  const [beat, setBeat] = useState<Beat | null>(null);
  const [shown, setShown] = useState(0);
  const [quiet, setQuiet] = useState(false);
  const quietRef = useRef(false);
  quietRef.current = quiet;
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
  const arrivals = useRef<number[]>([]);
  const sessionStart = useRef(performance.now());
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
      // Clear the ref too, so a say() inside run() starts at once instead of waiting behind a stale beat
      beatRef.current = null;
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
        case 'zoom': act.zoom(a.domain); break;
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
  /** A joke, and she reacts to how you take it. */
  const joke = useCallback((): Beat => {
    const fresh = idsWith('joke.').filter((id) => /^joke\.\d+$/.test(id) && !said.current.has(id));
    const id = pick(fresh.length ? fresh : idsWith('joke.').filter((x) => /^joke\.\d+$/.test(x)));
    said.current.add(id);
    return {
      id,
      choices: [
        { label: 'Haha', run: () => say({ id: 'joke.laugh.1' }) },
        { label: 'Groan', run: () => say({ id: 'joke.groan.1' }) },
      ],
    };
  }, [say]);

  /** Small talk: one of her musings, or a little two-way conversation. */
  const talk = useCallback((): Beat => {
    const convos: Beat[] = [
      { id: 'convo.alone.q', choices: [
        { label: 'I think so', run: () => say({ id: 'convo.alone.yes' }) },
        { label: 'Probably not', run: () => say({ id: 'convo.alone.no' }) },
      ] },
      { id: 'convo.fav.q', choices: [
        { label: 'Saturn', run: () => say({ id: 'convo.fav.saturn' }) },
        { label: 'Earth', run: () => say({ id: 'convo.fav.earth' }) },
        { label: 'Something weird', run: () => say({ id: 'convo.fav.weird' }) },
      ] },
      { id: 'convo.scale.q', choices: [
        { label: 'Tell me', run: () => say({ id: 'convo.scale.a' }) },
        { label: 'Not now', run: () => say({ id: pick(idsWith('decline.')) }) },
      ] },
      { id: 'convo.why.q', choices: [
        { label: 'Curiosity', run: () => say({ id: 'convo.why.curious' }) },
        { label: "We're a bit lost", run: () => say({ id: 'convo.why.lost' }) },
      ] },
      { id: 'convo.home.q', choices: [
        { label: 'Show me Earth', run: () => { say({ id: 'convo.home.go' }); window.setTimeout(() => run({ kind: 'fly', body: 'Earth' }), 600); } },
        { label: 'Not really', run: () => say({ id: 'convo.home.no' }) },
      ] },
    ];
    const fresh = convos.filter((c) => !said.current.has(c.id));
    if (fresh.length && Math.random() < 0.7) {
      const c = pick(fresh);
      said.current.add(c.id);
      return c;
    }
    const feels = idsWith('feel.').filter((id) => !said.current.has(id));
    const f = pick(feels.length ? feels : idsWith('feel.'));
    said.current.add(f);
    return { id: f };
  }, [run, say]);

  const menu = useCallback((): Choice[] => {
    const here = secretsAt(current);
    return [
      { label: 'Tell me something', run: () => { const f = factFor(current) ?? factFor(pick(['Saturn', 'Mars', 'Jupiter', 'Venus'])); if (f) say([{ id: 'menu.something' }, { id: f }]); } },
      { label: 'A joke', run: () => say([{ id: 'menu.joke' }, joke()]) },
      { label: "Let's talk", run: () => say([{ id: 'menu.talk' }, talk()]) },
      { label: 'Show me a secret', run: () => say(offerSecret(here.length ? pick(here) : pick(beautifulPlaces()))) },
      quiet
        ? { label: 'Talk to me again', run: () => { setQuiet(false); say({ id: pick(idsWith('poke.')) }); } }
        : { label: 'Hush for a while', run: () => { say({ id: 'hush', after: () => setQuiet(true) }); } },
    ];
  }, [current, quiet, factFor, offerSecret, say, joke, talk]);

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
        const h = new Date().getHours();
        const tod = h < 5 || h >= 22 ? 'greet.night' : h < 12 ? 'greet.morning' : h < 18 ? 'greet.afternoon' : 'greet.evening';
        say({ id: met ? (Math.random() < 0.5 ? tod : pick(idsWith('greet.back.'))) : 'greet.first.2', choices: menu() });
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
    const now = performance.now();
    arrivals.current = [...arrivals.current.filter((t) => now - t < 45000), now];
    if (arrivals.current.length >= 4 && !said.current.has('hop-recent')) {
      said.current.add('hop-recent');
      window.setTimeout(() => said.current.delete('hop-recent'), 300000);
      window.setTimeout(() => say({ id: pick(idsWith('hop.')) }, true), 900);
      return;
    }
    const first = !visited.current.has(a.name);
    visited.current.add(a.name);
    if (a.name === 'Sun') {
      window.setTimeout(() => say({ id: pick(idsWith('overview.')) }, true), 1100);
      return;
    }
    if (!first && a.name === 'Earth' && Math.random() < 0.6) {
      window.setTimeout(() => say({ id: pick(idsWith('home.')) }, true), 1100);
      return;
    }
    if (!first && Math.random() < 0.3) {
      window.setTimeout(() => say({ id: pick(idsWith('revisit.')) }, true), 1100);
      return;
    }
    const fact = factFor(a.name);
    const secret = first ? secretsAt(a.name)[0] : undefined;
    const beats: Beat[] = [];
    if (fact && (first || Math.random() < 0.5)) beats.push({ id: fact });
    // The hundreds of small moons have no facts of their own: a word about what they are
    else if (!fact && first && CatalogueManager.getBody(a.name)?.minor && !said.current.has('minor-recent')) {
      said.current.add('minor-recent');
      window.setTimeout(() => said.current.delete('minor-recent'), 120000);
      beats.push({ id: pick(idsWith('minor.')) });
    }
    if (secret) beats.push(offerSecret(secret));
    if (beats.length) window.setTimeout(() => say(beats, true), 1100);
  }, [arrival, tourOpen, quiet, surfaceActive, factFor, offerSecret, say]);

  // Little reactions to what you change (not during the tour's own demos)
  const prev = useRef({ orbitsOn, constellationsOn, timeRate, lens, surface: surfaceActive });
  useEffect(() => {
    const was = prev.current;
    prev.current = { orbitsOn, constellationsOn, timeRate, lens, surface: surfaceActive };
    if (!ready || tourOpen || quiet) return;
    const r = (id: string) => say({ id }, true);
    if (was.orbitsOn && !orbitsOn) r('react.orbits-off');
    else if (!was.orbitsOn && orbitsOn) r('react.orbits-on');
    else if (was.constellationsOn && !constellationsOn) r('react.constellations-off');
    else if (!was.constellationsOn && constellationsOn) r('react.constellations-on');
    else if (was.timeRate !== 0 && timeRate === 0) r('react.pause');
    else if (was.timeRate === 0 && timeRate !== 0) r('react.play');
    else if (was.timeRate !== timeRate && timeRate >= 31536000) r('react.year');
    else if (was.timeRate > 1 && timeRate === 1) r('react.realtime');
    else if (was.lens !== lens && lens === 'fisheye') r('react.fisheye');
    else if (was.lens !== lens && lens === 'clean') r('react.clean');
    else if (!was.surface && surfaceActive) {
      const air = ['Earth', 'Mars', 'Venus', 'Titan'].includes(current);
      window.setTimeout(() => say({ id: air ? 'surface.air' : pick(idsWith('surface.').filter((x) => x !== 'surface.air')) }, true), 1500);
    }
  }, [orbitsOn, constellationsOn, timeRate, lens, surfaceActive, current, ready, tourOpen, quiet, say]);

  // Logbook milestones
  const lastLogged = useRef(worldsLogged);
  useEffect(() => {
    const before = lastLogged.current;
    lastLogged.current = worldsLogged;
    if (!ready || worldsLogged <= before) return;
    for (const m of [10, 5, 3]) {
      if (before < m && worldsLogged >= m) {
        window.setTimeout(() => say({ id: `log.${m}` }), 4200);
        break;
      }
    }
  }, [worldsLogged, ready, say]);

  // The black hole, up close
  useEffect(() => {
    const h = horizon;
    if (!h || quiet) return;
    const once = (id: string) => {
      if (said.current.has(id)) return;
      said.current.add(id);
      window.setTimeout(() => say({ id }, true), 600);
    };
    if (h.onShore) {
      once('bh.horizon');
      if (!said.current.has('bh.rock')) window.setTimeout(() => !quietRef.current && once('bh.rock'), 30000);
    } else if (h.rRs < 1.5) once('bh.photon');
    else if (h.rRs < 3) once('bh.deep');
    else if (h.rRs < 9) once('bh.approach');
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
      if (!said.current.has('session.long') && performance.now() - sessionStart.current > 600000) {
        said.current.add('session.long');
        say({ id: 'session.long' });
        return;
      }
      if (performance.now() - lastActivity.current < 75000) return;
      hinted.add(current);
      const roll = Math.random();
      if (roll < 0.4) say({ id: pick(idsWith('idle.')), choices: menu() });
      else if (roll < 0.7) say(talk());
      else say(joke());
    }, 5000);
    return () => {
      window.removeEventListener('pointerdown', onAct);
      window.removeEventListener('keydown', onAct);
      window.clearInterval(id);
    };
  }, [ready, tourOpen, inTransit, current, quiet, menu, say, talk, joke]);

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
            <span className="vela-wave" aria-hidden>
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            Vela
          </span>
          <p className="vela-line">
            <span aria-hidden>“</span>
            {text.slice(0, shown)}
            {typing ? <span className="vela-cursor" aria-hidden /> : <span aria-hidden>”</span>}
          </p>
          <span className="vela-progress" aria-hidden style={{ transform: `scaleX(${text.length ? shown / text.length : 0})` }} />
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
