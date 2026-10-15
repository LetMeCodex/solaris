import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, Send, Volume2, VolumeX, X } from 'lucide-react';
import { answer, arrivalLine, BodyInfo, Chip, CompanionAction, HELP_CHIPS, Reply } from '../../companion/knowledge';
import { chime, listen, recognitionSupported, voice } from '../../companion/voice';
import type { FlightRoute } from '../../rendering/SolarSystemScene';
import { tourSeen } from './Tour';

/**
 * VELA — a companion who travels with the user. She speaks (browser speech synthesis), types her
 * lines beside a living orb, offers one-tap actions, answers questions typed or spoken, reacts to
 * arrivals, long journeys and idling, and narrates the guided tour.
 */

export interface CompanionActions {
  fly: (body: string) => void;
  sky: (body: string, facing?: string) => void;
  landmark: (id: string) => void;
  horizon: (on: boolean) => void;
  lens: (name: 'cinematic' | 'fisheye' | 'clean') => void;
  scale: (mode: 'exploration' | 'scientific') => void;
  time: (rate: number) => void;
  toggleOrbits: () => void;
  tour: () => void;
  overview: () => void;
}

interface Msg {
  id: number;
  from: 'vela' | 'you';
  text: string;
  chips?: Chip[];
}

const SEEN_KEY = 'solaris.vela.met';

export const Companion: React.FC<{
  ready: boolean;
  current: string;
  lightFromEarthSec: number | null;
  inTransit: boolean;
  route: FlightRoute | null;
  arrival: { name: string; nonce: number } | null;
  narration: { id: number; text: string } | null;
  tourOpen: boolean;
  inHorizon: boolean;
  info: (name: string) => BodyInfo | null;
  actions: CompanionActions;
}> = ({ ready, current, lightFromEarthSec, inTransit, route, arrival, narration, tourOpen, inHorizon, info, actions }) => {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [bubble, setBubble] = useState<Msg | null>(null);
  const [typed, setTyped] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceOn, setVoiceOn] = useState(voice.enabled);
  const orbRef = useRef<HTMLButtonElement>(null);
  const stopListening = useRef<(() => void) | null>(null);
  const nextId = useRef(1);
  const visited = useRef(new Set<string>());
  const pendingHorizon = useRef(false);
  const lastActivity = useRef(performance.now());
  const idleHinted = useRef(new Set<string>());
  const scrollRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  // Voice → orb
  useEffect(() => {
    voice.init();
    const onSpeak = (s: boolean) => setSpeaking(s);
    const onWord = () => {
      const el = orbRef.current;
      if (!el) return;
      el.classList.remove('word');
      void el.offsetWidth;
      el.classList.add('word');
    };
    voice.listeners.add(onSpeak);
    voice.wordListeners.add(onWord);
    return () => {
      voice.listeners.delete(onSpeak);
      voice.wordListeners.delete(onWord);
    };
  }, []);

  /** Vela says something: transcript, bubble, typewriter, voice. */
  const say = useCallback((reply: Reply, opts: { silent?: boolean } = {}) => {
    const m: Msg = { id: nextId.current++, from: 'vela', text: reply.text, chips: reply.chips };
    setMsgs((x) => [...x.slice(-40), m]);
    setBubble(m);
    if (!opts.silent) {
      chime('arrive');
      void voice.say(reply.text);
    }
  }, []);

  // Typewriter for the bubble, roughly at speaking pace
  useEffect(() => {
    if (!bubble) return;
    let i = 0;
    setTyped('');
    const id = window.setInterval(() => {
      i += 2;
      setTyped(bubble.text.slice(0, i));
      if (i >= bubble.text.length) window.clearInterval(id);
    }, 45);
    return () => window.clearInterval(id);
  }, [bubble]);

  // Bubble steps aside a while after its line has finished
  useEffect(() => {
    if (!bubble || speaking || panelOpen) return;
    const t = setTimeout(() => setBubble((b) => (b?.id === bubble.id ? null : b)), bubble.chips?.length ? 16000 : 9000);
    return () => clearTimeout(t);
  }, [bubble, speaking, panelOpen]);

  /* ---------------------------------------------------------------- actions */
  const run = useCallback(
    (a: CompanionAction) => {
      const act = actionsRef.current;
      lastActivity.current = performance.now();
      switch (a.kind) {
        case 'fly':
          act.fly(a.body);
          break;
        case 'sky':
          act.sky(a.body, a.facing);
          break;
        case 'landmark':
          act.landmark(a.id);
          break;
        case 'horizon':
          if (current === 'Sagittarius A*' && !inTransit) act.horizon(true);
          else {
            pendingHorizon.current = true;
            act.fly('Sagittarius A*');
          }
          break;
        case 'lens':
          act.lens(a.name);
          break;
        case 'scale':
          act.scale(a.mode);
          break;
        case 'time':
          act.time(a.rate);
          break;
        case 'orbits':
          act.toggleOrbits();
          break;
        case 'tour':
          setPanelOpen(false);
          act.tour();
          break;
        case 'overview':
          act.overview();
          break;
      }
    },
    [current, inTransit]
  );

  const ask = useCallback(
    (text: string) => {
      lastActivity.current = performance.now();
      setMsgs((x) => [...x.slice(-40), { id: nextId.current++, from: 'you', text }]);
      const r = answer(text, { current, lightFromEarthSec, info });
      say(r);
      if (r.action) setTimeout(() => run(r.action!), 500);
    },
    [current, lightFromEarthSec, info, say, run]
  );

  const tapChip = useCallback(
    (c: Chip) => {
      if (c.action) {
        setMsgs((x) => [...x.slice(-40), { id: nextId.current++, from: 'you', text: c.label }]);
        voice.stop();
        run(c.action);
        setBubble(null);
      } else if (c.ask) ask(c.ask);
    },
    [ask, run]
  );

  /* ---------------------------------------------------------------- reactions */
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
    const briefing = !tourSeen();
    let poll = 0;
    const t = setTimeout(() => {
      say(
        briefing
          ? { text: `Hello. You made it… I'm Vela. That is ${current}, exactly where it is in the sky right now. Everything you'll see here is real. Let me show you around.` }
          : met
            ? { text: `Welcome back, traveller. We're at ${current}. Where shall we go?`, chips: HELP_CHIPS }
            : { text: `Hello. I'm Vela, your companion out here. Ask me anything, or tap me whenever you want me.`, chips: HELP_CHIPS }
      );
      if (briefing) {
        // Start the briefing once she has finished speaking (or after a few seconds in silence)
        const start = performance.now();
        const wait = () => {
          const el = performance.now() - start;
          if ((!voice.speaking && el > (voice.enabled ? 2500 : 6500)) || el > 16000) {
            setBubble(null);
            actionsRef.current.tour();
          } else poll = window.setTimeout(wait, 300);
        };
        poll = window.setTimeout(wait, 1200);
      }
    }, 900);
    return () => {
      clearTimeout(t);
      clearTimeout(poll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Long journeys
  const lastRoute = useRef<number>(-1);
  useEffect(() => {
    if (!route || route.id === lastRoute.current || tourOpen) return;
    lastRoute.current = route.id;
    const ly = route.distanceKm / 9.4607e12;
    if (ly > 0.05) {
      say({ text: `Twenty seven thousand light years. Light that left there when the last ice age began is only arriving at Earth now. Hold on.` });
    } else if (route.distanceKm > 1.5e9) {
      const hours = route.distanceKm / 299792.458 / 3600;
      say({ text: `${(route.distanceKm / 1e9).toFixed(1)} billion kilometres to ${route.to}. Even light needs ${hours >= 1 ? `${hours.toFixed(1)} hours` : `${Math.round(hours * 60)} minutes`} for this.` });
    }
  }, [route, tourOpen, say]);

  // Arrivals: a fact, and on the first visit the world's secret
  useEffect(() => {
    if (!arrival || tourOpen) return;
    lastActivity.current = performance.now();
    if (pendingHorizon.current && arrival.name === 'Sagittarius A*') {
      pendingHorizon.current = false;
      setTimeout(() => actionsRef.current.horizon(true), 800);
      say({ text: 'Here. Now, the shore. Drag to look around. When you are ready, fly towards it with W.' });
      return;
    }
    const first = !visited.current.has(arrival.name);
    visited.current.add(arrival.name);
    const r = arrivalLine(arrival.name, first);
    if (r) setTimeout(() => say(r), 1200);
  }, [arrival, tourOpen, say]);

  // The horizon itself
  const wasHorizon = useRef(false);
  useEffect(() => {
    if (inHorizon && !wasHorizon.current) {
      setTimeout(
        () =>
          say({
            text: 'This world circles at twenty Schwarzschild radii. Any closer, and the black hole\'s tides would tear it apart. Time runs a little slower here. Every hour you spend on this shore, about an hour and two minutes pass back home.',
          }),
        1500
      );
    }
    wasHorizon.current = inHorizon;
  }, [inHorizon, say]);

  // Tour narration: voice only, the briefing card already shows the words
  useEffect(() => {
    if (!narration) return;
    setBubble(null);
    void voice.say(narration.text);
  }, [narration]);

  // Idle: once per world, after a quiet minute, offer something
  useEffect(() => {
    if (!ready) return;
    const onAct = () => (lastActivity.current = performance.now());
    window.addEventListener('pointerdown', onAct);
    window.addEventListener('keydown', onAct);
    const id = window.setInterval(() => {
      if (tourOpen || inTransit || voice.speaking || panelOpen) return;
      if (performance.now() - lastActivity.current < 60000 || idleHinted.current.has(current)) return;
      idleHinted.current.add(current);
      const r = answer('show me something hidden', { current, lightFromEarthSec, info });
      say({ text: `Still here? ${r.text}`, chips: r.chips });
    }, 5000);
    return () => {
      window.removeEventListener('pointerdown', onAct);
      window.removeEventListener('keydown', onAct);
      window.clearInterval(id);
    };
  }, [ready, tourOpen, inTransit, panelOpen, current, lightFromEarthSec, info, say]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, panelOpen]);

  /* ---------------------------------------------------------------- UI */
  const toggleVoice = () => {
    voice.enabled = !voice.enabled;
    if (!voice.enabled) voice.stop();
    setVoiceOn(voice.enabled);
  };

  const mic = () => {
    if (listening) {
      stopListening.current?.();
      return;
    }
    setListening(true);
    stopListening.current = listen(
      (t) => ask(t),
      () => setListening(false)
    );
  };

  if (!ready) return null;

  return (
    <div className="vela-root pointer-events-auto" data-tour="vela">
      {/* Speech bubble */}
      {bubble && !panelOpen && (
        <div key={bubble.id} className="vela-bubble hud-frame">
          <button className="vela-x" onClick={() => setBubble(null)} aria-label="Dismiss">
            <X size={11} />
          </button>
          <p className="text-[12px] leading-relaxed text-white/85 pr-4">
            {typed}
            {typed.length < bubble.text.length && <span className="vela-caret" />}
          </p>
          {bubble.chips && typed.length >= bubble.text.length && (
            <div className="flex flex-wrap gap-1.5 mt-2.5 hud-rise">
              {bubble.chips.map((c) => (
                <button key={c.label} className="vela-chip" onClick={() => tapChip(c)}>
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chat panel */}
      {panelOpen && (
        <div className="vela-panel hud-frame hud-menu">
          <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/10">
            <div>
              <div className="text-[12px] tracking-[0.4em] uppercase text-white font-light">Vela</div>
              <div className="hud-label !text-[8px]">Your companion · {voiceOn ? voice.voiceName : 'voice off'}</div>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="hud-icon-btn !w-7 !h-7" onClick={toggleVoice} aria-label={voiceOn ? 'Mute Vela' : 'Unmute Vela'} title={voiceOn ? 'Mute voice' : 'Voice on'}>
                {voiceOn ? <Volume2 size={12} /> : <VolumeX size={12} />}
              </button>
              <button className="hud-icon-btn !w-7 !h-7" onClick={() => setPanelOpen(false)} aria-label="Close">
                <X size={12} />
              </button>
            </div>
          </div>
          <div ref={scrollRef} className="vela-log hud-scroll">
            {msgs.map((m) => (
              <div key={m.id} className={`vela-msg ${m.from}`}>
                <p>{m.text}</p>
                {m.from === 'vela' && m.chips && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.chips.map((c) => (
                      <button key={c.label} className="vela-chip" onClick={() => tapChip(c)}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form
            className="flex items-center gap-2 p-3 border-t border-white/10"
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim()) return;
              ask(input.trim());
              setInput('');
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={listening ? 'Listening…' : 'Ask Vela anything…'}
              className="hud-input !py-2"
              aria-label="Ask Vela"
            />
            {recognitionSupported() && (
              <button type="button" onClick={mic} className={`hud-icon-btn !w-8 !h-8 shrink-0 ${listening ? 'vela-listening' : ''}`} aria-label="Speak to Vela">
                <Mic size={13} />
              </button>
            )}
            <button type="submit" className="hud-icon-btn !w-8 !h-8 shrink-0" aria-label="Send">
              <Send size={12} />
            </button>
          </form>
        </div>
      )}

      {/* The orb */}
      <button
        ref={orbRef}
        className={`vela-orb ${speaking ? 'speaking' : ''} ${listening ? 'listening' : ''}`}
        onClick={() => {
          setPanelOpen((o) => !o);
          if (!msgs.length) say({ text: 'I\'m here. Ask me anything about where we are.', chips: HELP_CHIPS }, { silent: true });
        }}
        aria-label={panelOpen ? 'Close Vela' : 'Talk to Vela'}
        title="Vela · your companion"
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
    </div>
  );
};

export default Companion;
