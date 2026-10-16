import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CatalogueManager } from '../../data/CatalogueManager';
import { beautifulPlaces, CompanionAction, factIds, idsWith, lineText, pick, Secret, secretsAt } from '../../companion/knowledge';
import { voice } from '../../companion/voice';
import type { FlightRoute } from '../../rendering/SolarSystemScene';
import { tourSeen } from './Tour';
import { settings, useSettings } from '../settings';
import type { ExploredStats } from './explored';

/**
 * VELA — a companion, not a chatbot. She starts conversations, teases, reacts to what you do and
 * offers to show you things. Every line is a real recording in her own voice (sounds like her giggle,
 * a gasp or a sniffle are part of the recordings), shown as a minimal dialogue box; you answer by
 * picking one of her choices (click or keys 1–4). She keeps count of how much of the Solar System
 * you have explored, looks after you on long nights, gets scared like anyone would, and when every
 * world is in the logbook she says goodbye.
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
const MEMORY_KEY = 'solaris.vela.memory';

/** What Vela remembers between visits (kept in this browser only). */
interface VelaMemory {
  sessions: number;
  lastBody: string | null;
  lastAt: number;
  /** The last thing you did was stand on a world and look up. */
  lastStood: boolean;
  moons: string[];
  /** Highest exploration milestone (percent) she has already celebrated. */
  pct: number;
  /** Planets whose every moon you have visited, already celebrated. */
  systems: string[];
  allPlanets: boolean;
  /** She said goodbye at 100%. */
  farewell: boolean;
}

function loadMemory(): VelaMemory {
  try {
    const m = JSON.parse(localStorage.getItem(MEMORY_KEY) || 'null') as Partial<VelaMemory> | null;
    return {
      sessions: m?.sessions ?? 0, lastBody: m?.lastBody ?? null, lastAt: m?.lastAt ?? 0, lastStood: !!m?.lastStood, moons: m?.moons ?? [],
      pct: m?.pct ?? 0, systems: m?.systems ?? [], allPlanets: !!m?.allPlanets, farewell: !!m?.farewell,
    };
  } catch {
    return { sessions: 0, lastBody: null, lastAt: 0, lastStood: false, moons: [], pct: 0, systems: [], allPlanets: false, farewell: false };
  }
}

function saveMemory(m: VelaMemory): void {
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify({ ...m, lastAt: Date.now() }));
  } catch {
    /* private mode: she simply forgets */
  }
}

const AU_KM = 149597870.7;

/** Percentages of the known worlds she celebrates (each has a line explore.p<N>). */
export const EXPLORE_MILESTONES = [1, 5, 10, 20, 25, 33, 40, 50, 60, 66, 75, 80, 90, 95, 99];

/** Her answer to "how far have we come?" for a percentage. */
export function exploreStatusId(pct: number): string {
  const step = pct < 2 ? 0 : pct < 10 ? 1 : pct < 25 ? 2 : pct < 50 ? 3 : pct < 75 ? 4 : pct < 95 ? 5 : 6;
  return `explore.status.${step}`;
}

/** The goodbye, in order. */
export const FAREWELL = Array.from({ length: 10 }, (_, i) => `farewell.${i + 1}`);

/** Smallest and largest heliocentric distance (AU) along a straight route. */
function routeSpan(r: FlightRoute): [number, number] {
  let lo = Infinity, hi = 0;
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const d = Math.hypot(...[0, 1, 2].map((k) => r.fromKm[k] + (r.toKm[k] - r.fromKm[k]) * t)) / AU_KM;
    lo = Math.min(lo, d);
    hi = Math.max(hi, d);
  }
  return [lo, hi];
}

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
  explored: ExploredStats;
  atlasOpen: boolean;
  /** Very close to the Sun's surface. */
  sunClose: boolean;
  timeRate: number;
  lens: string;
  actions: CompanionActions;
  onTalkingChange?: (talking: boolean) => void;
}> = ({ ready, current, inTransit, route, arrival, tourStep, tourOpen, horizon, surfaceActive, orbitsOn, constellationsOn, worldsLogged, explored, atlasOpen, sunClose, timeRate, lens, actions, onTalkingChange }) => {
  const [beat, setBeat] = useState<Beat | null>(null);
  const [shown, setShown] = useState(0);
  const prefs = useSettings();
  const [quiet, setQuiet] = useState(() => !settings.get().velaChatty);
  const quietRef = useRef(false);
  quietRef.current = quiet;
  // Settings: whether she starts conversations on her own
  useEffect(() => setQuiet(!prefs.velaChatty), [prefs.velaChatty]);
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
  const memory = useRef<VelaMemory | null>(null);
  if (memory.current === null) memory.current = loadMemory();
  const usedFacts = useRef(new Set<string>());
  const said = useRef(new Set<string>());
  const pendingHorizon = useRef(false);
  const lastActivity = useRef(performance.now());
  const arrivals = useRef<number[]>([]);
  const sessionStart = useRef(performance.now());
  const beatRef = useRef<Beat | null>(null);
  beatRef.current = beat;
  const exploredRef = useRef(explored);
  exploredRef.current = explored;
  /** The goodbye is playing: the screen dims and nothing else interrupts her. */
  const [farewell, setFarewell] = useState<'off' | 'on' | 'done'>('off');
  const farewellRef = useRef(farewell);
  farewellRef.current = farewell;
  const pokes = useRef<number[]>([]);

  /** A line from a pool she has not said yet this visit (falls back to any of them). */
  const fresh = useCallback((prefix: string, filter: (id: string) => boolean = () => true): string => {
    const all = idsWith(prefix).filter(filter);
    const left = all.filter((id) => !said.current.has(id));
    const id = pick(left.length ? left : all);
    said.current.add(id);
    return id;
  }, []);

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
      // Nothing interrupts the goodbye
      if (farewellRef.current === 'on' && !list[0]?.id.startsWith('farewell.')) return;
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
      }, beat.id.startsWith('farewell.') ? 1400 : 2200);
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
    const id = fresh('joke.', (x) => /^joke\.\d+$/.test(x));
    return {
      id,
      choices: [
        // You laughed: so does she, and sometimes she can't stop giggling
        { label: 'Haha', run: () => say([{ id: pick(idsWith('joke.laugh.')) }, ...(Math.random() < 0.35 ? [{ id: fresh('giggle.') }] : [])]) },
        { label: 'Groan', run: () => say({ id: pick(idsWith('joke.groan.')) }) },
      ],
    };
  }, [say, fresh]);

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
      { id: 'convo.dream.q', choices: [
        { label: 'Mars', run: () => say({ id: 'convo.dream.mars' }) },
        { label: 'Titan', run: () => say({ id: 'convo.dream.titan' }) },
        { label: 'The Moon', run: () => say({ id: 'convo.dream.moon' }) },
      ] },
      { id: 'convo.space.q', choices: [
        { label: 'In a heartbeat', run: () => say({ id: 'convo.space.yes' }) },
        { label: "I'll stay here", run: () => say({ id: 'convo.space.no' }) },
      ] },
      { id: 'convo.me.q', choices: [
        { label: 'You are to me', run: () => say({ id: 'convo.me.yes' }) },
        { label: "I'm not sure", run: () => say({ id: 'convo.me.no' }) },
      ] },
      { id: 'convo.night.q', choices: [
        { label: 'All the time', run: () => say({ id: 'convo.night.yes' }) },
        { label: 'Not really', run: () => say({ id: 'convo.night.no' }) },
      ] },
      { id: 'convo.friend.q', choices: [
        { label: 'Of course', run: () => say({ id: 'convo.friend.yes' }) },
        { label: 'Getting there', run: () => say({ id: 'convo.friend.no' }) },
      ] },
      { id: 'convo.home.q', choices: [
        { label: 'Show me Earth', run: () => { say({ id: 'convo.home.go' }); window.setTimeout(() => run({ kind: 'fly', body: 'Earth' }), 600); } },
        { label: 'Not really', run: () => say({ id: 'convo.home.no' }) },
      ] },
    ];
    const unsaid = convos.filter((c) => !said.current.has(c.id));
    if (unsaid.length && Math.random() < 0.7) {
      const c = pick(unsaid);
      said.current.add(c.id);
      return c;
    }
    return { id: fresh('feel.') };
  }, [run, say, fresh]);

  const menu = useCallback((): Choice[] => {
    const here = secretsAt(current);
    return [
      { label: 'Tell me something', run: () => {
        // Sometimes about the system itself (comets, meteor streams, Trojans, scale), else about here
        const wide = [...idsWith('space.'), ...(current === 'Jupiter' ? ['cross.trojans'] : [])].filter((id) => !said.current.has(id));
        const here = factFor(current);
        if (wide.length && (!here || Math.random() < 0.35)) {
          const id = pick(wide);
          said.current.add(id);
          say([{ id: 'menu.something' }, { id }]);
          return;
        }
        const f = here ?? factFor(pick(['Saturn', 'Mars', 'Jupiter', 'Venus']));
        if (f) say([{ id: 'menu.something' }, { id: f }]);
      } },
      { label: 'A joke', run: () => say([{ id: 'menu.joke' }, joke()]) },
      { label: "Let's talk", run: () => say([{ id: 'menu.talk' }, talk()]) },
      { label: 'How far have we come?', run: () => say([{ id: 'menu.progress' }, { id: exploreStatusId(exploredRef.current.pct) }]) },
      { label: 'Show me a secret', run: () => say(offerSecret(here.length ? pick(here) : pick(beautifulPlaces()))) },
      quiet
        ? { label: 'Talk to me again', run: () => { settings.set({ velaChatty: true }); say({ id: pick(idsWith('poke.')) }); } }
        : { label: 'Hush for a while', run: () => { say({ id: 'hush', after: () => settings.set({ velaChatty: false }) }); } },
    ];
  }, [current, quiet, factFor, offerSecret, say, joke, talk]);

  const poke = () => {
    lastActivity.current = performance.now();
    if (farewell === 'on') return;
    if (beat && typing) {
      setShown(text.length);
      return;
    }
    // Poke her three times in a row and she giggles
    const now = performance.now();
    pokes.current = [...pokes.current.filter((t) => now - t < 8000), now];
    if (pokes.current.length >= 3) {
      pokes.current = [];
      say({ id: pick(['giggle.7', 'giggle.3', 'giggle.1']), choices: menu() }, true);
      return;
    }
    const opener = Math.random() < 0.15 ? 'giggle.6' : pick(idsWith('poke.'));
    say({ id: opener, choices: menu() }, true);
  };

  /** Something she remembers from your last visits, or null. */
  const recallLine = (): string | null => {
    const m = memory.current!;
    const days = m.lastAt ? (Date.now() - m.lastAt) / 86400000 : 0;
    if (days > 4) return 'memory.away';
    if (m.lastStood && Math.random() < 0.6) return 'memory.stood';
    if (m.moons.length >= 8 && Math.random() < 0.3) return 'memory.moons';
    if (m.sessions >= 6 && Math.random() < 0.25) return 'memory.many';
    if (m.lastBody && Math.random() < 0.75) {
      if (lineText(`memory.last.${m.lastBody}`)) return `memory.last.${m.lastBody}`;
      if (CatalogueManager.getBody(m.lastBody)?.category === 'moon') return 'memory.last.anymoon'; // not '.moon': it would clash with '.Moon' on case-insensitive disks
    }
    return null;
  };

  // Count this visit once
  useEffect(() => {
    if (!ready) return;
    const m = memory.current!;
    m.sessions += 1;
    saveMemory(m);
  }, [ready]);

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
        const m = memory.current!;
        if (m.farewell) {
          say({ id: fresh('after.'), choices: menu() });
          return;
        }
        const recall = met ? recallLine() : null;
        const greeting = recall ?? (met ? (Math.random() < 0.5 ? pick(idsWith(tod)) : pick(idsWith('greet.back.'))) : 'greet.first.2');
        const pct = exploredRef.current.pct;
        // Sometimes she tells you where the logbook stands
        if (met && pct >= 2 && Math.random() < 0.35) say([{ id: greeting }, { id: 'explore.comeback' }, { id: exploreStatusId(pct), choices: menu() }]);
        else say({ id: greeting, choices: menu() });
      }
    }, 900);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  /* ------------------------------------------------------------------ how far you have come */
  const startFarewell = useCallback(() => {
    setQuiet(false);
    setFarewell('on');
    farewellRef.current = 'on';
    const beats: Beat[] = FAREWELL.map((id) => ({ id }));
    beats[beats.length - 1].after = () => {
      setFarewell('done');
      const m = memory.current!;
      m.farewell = true;
      saveMemory(m);
    };
    say(beats, true);
  }, [say]);

  const offerFarewell = useCallback(() => {
    say({
      id: 'farewell.choice',
      choices: [
        { label: "I'm listening", run: startFarewell },
        { label: 'Not yet', run: () => say({ id: 'farewell.later' }) },
      ],
    }, true);
  }, [say, startFarewell]);

  // Percent milestones, a planet's whole family of moons, all eight planets, and at 100%: goodbye
  const lastDone = useRef(-1);
  useEffect(() => {
    if (!ready) return;
    const s = explored;
    const before = lastDone.current;
    lastDone.current = s.done;
    const m = memory.current!;
    // Everything explored and she has not said goodbye yet (also when you come back after "Not yet")
    if (s.total > 0 && s.done >= s.total && !m.farewell) {
      if (before !== s.done) window.setTimeout(offerFarewell, before < 0 ? 6500 : 3800);
      return;
    }
    if (before < 0 || s.done <= before) return; // first reading, or nothing new
    const beats: Beat[] = [];
    const crossed = EXPLORE_MILESTONES.filter((p) => p > m.pct && s.pct >= p);
    if (crossed.length) {
      const p = crossed[crossed.length - 1];
      m.pct = p;
      beats.push({ id: `explore.p${p}` });
    } else if (m.pct === 0 && !said.current.has('explore.first')) {
      said.current.add('explore.first');
      beats.push({ id: 'explore.first' });
    }
    if (!m.allPlanets && s.parts.worlds.done >= s.parts.worlds.total) {
      m.allPlanets = true;
      beats.push({ id: 'explore.planets.done' });
    }
    // Every moon of the planet you are at
    const here = CatalogueManager.getBody(current);
    const parent = here?.category === 'moon' ? here.parentName : here?.category === 'planet' ? here.name : null;
    if (parent && !m.systems.includes(parent)) {
      const family = CatalogueManager.getAllBodies().filter((b) => b.category === 'moon' && b.parentName === parent);
      const seen = new Set(m.moons);
      if (family.length >= 2 && family.every((b) => seen.has(b.name) || b.name === current)) {
        m.systems.push(parent);
        beats.push({ id: 'explore.system.done' });
      }
    }
    saveMemory(m);
    if (beats.length && !quietRef.current) window.setTimeout(() => say(beats), 4600);
  }, [explored, ready, current, say, offerFarewell]);

  // Opening the Atlas: she loves that page
  const atlasWas = useRef(false);
  useEffect(() => {
    const was = atlasWas.current;
    atlasWas.current = atlasOpen;
    if (!ready || !atlasOpen || was || quiet || tourOpen) return;
    if (said.current.has('atlas-recent')) return;
    said.current.add('atlas-recent');
    window.setTimeout(() => said.current.delete('atlas-recent'), 600000);
    window.setTimeout(() => say({ id: fresh('explore.atlas.') }, true), 900);
  }, [atlasOpen, ready, quiet, tourOpen, say, fresh]);

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
    const beats: Beat[] = [];
    const to = CatalogueManager.getBody(route.to);
    const from = CatalogueManager.getBody(route.from);
    const sameSystem = to?.category === 'moon' && (to.parentName === route.from || to.parentName === from?.parentName);
    const id = sameSystem ? 'journey.hop' : `journey.${route.to}`;
    if (lineText(id) && !said.current.has(id)) {
      said.current.add(id);
      beats.push({ id });
    }
    // Real distances: a long flight really crosses the belts
    const [lo, hi] = routeSpan(route);
    if (lo < 2.2 && hi > 3.2 && !said.current.has('cross.belt')) {
      said.current.add('cross.belt');
      beats.push({ id: 'cross.belt' });
    } else if (hi > 38 && lo < 34 && !said.current.has('cross.kuiper')) {
      said.current.add('cross.kuiper');
      beats.push({ id: 'cross.kuiper' });
    }
    // Big jumps and the dark frighten her a little
    const toAu = Math.hypot(...route.toKm) / AU_KM;
    if (route.to === 'Sagittarius A*' && !said.current.has('fright.galaxy')) {
      said.current.add('fright.galaxy');
      beats.push({ id: fresh('fright.galaxy.') });
    } else if (toAu > 28 && toAu < 5000 && !said.current.has('fright-dark')) {
      said.current.add('fright-dark');
      beats.push({ id: fresh('fright.dark.') });
    } else if (hi - lo > 15 && Math.random() < 0.3 && !said.current.has('fright-speed')) {
      said.current.add('fright-speed');
      window.setTimeout(() => said.current.delete('fright-speed'), 240000);
      beats.unshift({ id: fresh('fright.speed.') });
    }
    if (beats.length) say(beats, true);
  }, [route, tourOpen, quiet, say, fresh]);

  // Arrivals
  const rememberedArrival = useRef(-1);
  useEffect(() => {
    const a = arrival;
    if (!a) return;
    // Remember where you went, even while she is quiet or the tour is running (once per arrival:
    // this effect also re-runs when the tour, hush or surface state changes)
    if (rememberedArrival.current !== a.nonce) {
      rememberedArrival.current = a.nonce;
      const m = memory.current!;
      m.lastBody = a.name;
      m.lastStood = false;
      if (CatalogueManager.getBody(a.name)?.category === 'moon' && !m.moons.includes(a.name)) m.moons.push(a.name);
      saveMemory(m);
    }
    if (tourOpen) return;
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
      const beats: Beat[] = [{ id: pick(idsWith('overview.')) }];
      // The first whole-system view: what the little rings are
      if (!said.current.has('space.markers')) {
        said.current.add('space.markers');
        beats.push({ id: 'space.markers' });
      }
      window.setTimeout(() => say(beats, true), 1100);
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
      beats.push({ id: Math.random() < 0.4 ? fresh('explore.newmoon.') : pick(idsWith('minor.')) });
    }
    if (secret) beats.push(offerSecret(secret));
    if (beats.length) window.setTimeout(() => say(beats, true), 1100);
  }, [arrival, tourOpen, quiet, surfaceActive, factFor, offerSecret, say, fresh]);

  // Little reactions to what you change (not during the tour's own demos)
  const prev = useRef({ orbitsOn, constellationsOn, timeRate, lens, surface: surfaceActive });
  useEffect(() => {
    const was = prev.current;
    prev.current = { orbitsOn, constellationsOn, timeRate, lens, surface: surfaceActive };
    if (!ready || tourOpen || quiet) return;
    const r = (id: string) => say({ id }, true);
    if (was.orbitsOn && !orbitsOn) r(pick(idsWith('react.orbits-off')));
    else if (!was.orbitsOn && orbitsOn) r('react.orbits-on');
    else if (was.constellationsOn && !constellationsOn) r('react.constellations-off');
    else if (!was.constellationsOn && constellationsOn) r('react.constellations-on');
    else if (was.timeRate !== 0 && timeRate === 0) r(pick(idsWith('react.pause')));
    else if (was.timeRate === 0 && timeRate !== 0) r('react.play');
    else if (was.timeRate !== timeRate && timeRate >= 31536000) r(Math.random() < 0.4 ? 'fright.time.1' : pick(idsWith('react.year')));
    else if (was.timeRate > 1 && timeRate === 1) r('react.realtime');
    else if (was.lens !== lens && lens === 'fisheye') r(pick(idsWith('react.fisheye')));
    else if (was.lens !== lens && lens === 'clean') r(pick(idsWith('react.clean')));
    else if (!was.surface && surfaceActive) {
      const air = ['Earth', 'Mars', 'Venus', 'Titan'].includes(current);
      const def = CatalogueManager.getBody(current);
      const tiny = !!def && def.physical.meanRadiusKm < 60;
      const line = air ? 'surface.air' : tiny ? pick(idsWith('surface.tiny')) : pick(['surface.1', 'surface.2', 'surface.3', 'surface.4']);
      // The first landing of a visit is a little scary
      const first = !said.current.has('fright-surface');
      said.current.add('fright-surface');
      window.setTimeout(() => say(first && Math.random() < 0.6 ? [{ id: fresh('fright.surface.') }, { id: line }] : { id: line }, true), 1500);
      const m = memory.current!;
      m.lastBody = current;
      m.lastStood = true;
      saveMemory(m);
    }
  }, [orbitsOn, constellationsOn, timeRate, lens, surfaceActive, current, ready, tourOpen, quiet, say, fresh]);

  // Logbook milestones
  const lastLogged = useRef(worldsLogged);
  useEffect(() => {
    const before = lastLogged.current;
    lastLogged.current = worldsLogged;
    if (!ready || worldsLogged <= before) return;
    for (const m of [10, 7, 5, 3]) {
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
    } else if (h.rRs < 1.25) once('fright.bh.3');
    else if (h.rRs < 1.5) {
      once('bh.photon');
      if (!said.current.has('fright.bh.2')) window.setTimeout(() => !quietRef.current && once('fright.bh.2'), 14000);
    } else if (h.rRs < 3) {
      once('bh.deep');
      if (!said.current.has('fright.bh.1')) window.setTimeout(() => !quietRef.current && once('fright.bh.1'), 16000);
    } else if (h.rRs < 9) once('bh.approach');
  }, [horizon, quiet, say]);

  // Back out of danger: she breathes again
  const scared = useRef(false);
  useEffect(() => {
    const close = (!!horizon && !horizon.onShore && horizon.rRs < 3) || sunClose;
    if (close) scared.current = true;
    else if (scared.current) {
      scared.current = false;
      if (!quiet) window.setTimeout(() => say({ id: fresh('fright.calm.') }), 1200);
    }
  }, [horizon, sunClose, quiet, say, fresh]);

  // Right down by the Sun's surface
  useEffect(() => {
    if (!ready || !sunClose || quiet || tourOpen || inTransit || said.current.has('sun-close')) return;
    said.current.add('sun-close');
    window.setTimeout(() => said.current.delete('sun-close'), 180000);
    window.setTimeout(() => say([{ id: fresh('fright.sun.') }, ...(Math.random() < 0.4 ? [{ id: 'fright.flare.1' }] : [])], true), 800);
  }, [sunClose, ready, quiet, tourOpen, inTransit, say, fresh]);

  // Idle: once per world, after a quiet stretch, she says something
  useEffect(() => {
    if (!ready) return;
    const onAct = () => (lastActivity.current = performance.now());
    window.addEventListener('pointerdown', onAct);
    window.addEventListener('keydown', onAct);
    const hinted = new Set<string>();
    const id = window.setInterval(() => {
      if (quiet || tourOpen || inTransit || beatRef.current || farewellRef.current === 'on') return;
      // She looks after you: water, eyes, breaks, and bed when it is very late
      const minutes = (performance.now() - sessionStart.current) / 60000;
      const hour = new Date().getHours();
      const care = (key: string, when: boolean, id: () => string): boolean => {
        if (!when || said.current.has(key)) return false;
        said.current.add(key);
        say({ id: id() });
        return true;
      };
      if (
        care('care-late', hour >= 0 && hour < 5 && minutes > 12, () => fresh('care.late.')) ||
        care('session.long', minutes > 10, () => pick(idsWith('session.long'))) ||
        care('care-water', minutes > 25, () => fresh('care.water.')) ||
        care('care-eyes', minutes > 38, () => pick(['care.eyes.1', 'care.posture.1'])) ||
        care('care-break', minutes > 55, () => fresh('care.break.')) ||
        care('care-long', minutes > 95, () => fresh('care.long.'))
      )
        return;
      if (hinted.has(current) || performance.now() - lastActivity.current < 75000) return;
      hinted.add(current);
      const roll = Math.random();
      // Little human sounds: a sigh, humming, a half-remembered joke
      if (roll < 0.18) say({ id: fresh('noise.') });
      else if (roll < 0.42) say({ id: fresh('idle.'), choices: menu() });
      else if (roll < 0.52) say({ id: fresh(exploredRef.current.pct < 90 ? 'explore.tease.' : 'care.thanks.') });
      else if (roll < 0.6) say({ id: fresh('care.', (id) => /^care\.(proud|sad|thanks|night)/.test(id)) });
      else if (roll < 0.82) say(talk());
      else say(joke());
    }, 5000);
    return () => {
      window.removeEventListener('pointerdown', onAct);
      window.removeEventListener('keydown', onAct);
      window.clearInterval(id);
    };
  }, [ready, tourOpen, inTransit, current, quiet, menu, say, talk, joke, fresh]);

  // Test hooks (development only): window.__vela.farewell(), window.__vela.say('giggle.1')
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    (window as unknown as { __vela: unknown }).__vela = { farewell: startFarewell, offer: offerFarewell, say: (id: string) => say({ id }, true) };
  }, [startFarewell, offerFarewell, say]);

  if (!ready || !prefs.showVela) return null;
  const showBox = beat !== null && !tourOpen;
  const farewellOn = farewell === 'on' || (farewell === 'done' && beat !== null);

  return (
    <>
      {farewell !== 'off' && (
        <div className={`vela-veil ${farewellOn ? 'is-on' : 'is-leaving'}`} aria-hidden onAnimationEnd={(e) => !farewellOn && e.target === e.currentTarget && setFarewell('off')}>
          <div className="vela-veil-count">
            <b>{explored.done}</b> / {explored.total} worlds
            <span>every one of them, together</span>
          </div>
        </div>
      )}
      {showBox && (
        <div
          ref={boxRef}
          key={beat.id + (beat.choices ? 'c' : '')}
          className={`vela-dialog ${inTransit ? 'in-transit' : ''} ${farewellOn ? 'is-farewell' : ''}`}
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
        className={`vela-orb ${farewellOn ? 'is-farewell' : ''} ${speaking ? 'speaking' : ''} ${quiet ? 'quiet' : ''} ${surfaceActive ? 'on-surface' : ''}`}
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
