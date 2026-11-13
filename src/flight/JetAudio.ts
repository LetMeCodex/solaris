/**
 * The jet's sound, in layers that each follow the flight: real recordings where a real one exists
 * (public/audio/jet/, cut and levelled by scripts/build_cockpit_sounds.py), synthesised around them.
 *
 *  Engine
 *  - Spool: the engine's speed (N2, 0..1) lags the throttle, quicker winding up than running
 *    down, as a turbofan's rotors do. Every engine layer follows the spool, not the lever.
 *  - Recorded engine: two seamless loops of real jet engines, one idling and one wound up near full
 *    power, crossfaded by the spool and played faster as it winds up (the turbine's pitch rises).
 *  - Sub: two low sines an octave apart, the body of the sound you feel more than hear.
 *  - Turbine: two detuned saws through a low-pass, plus a thin compressor whine a fifth above.
 *  - Roar: filtered noise opening up with the spool.
 *  - Roughness: band-passed noise, amplitude-modulated, the grain of a running engine.
 *  - Afterburner: a deep band that opens with the burner, and the "whump" of light-off (a low
 *    sine dropping in pitch under a burst of noise).
 *  - From inside, with speed the engine sinks under the wind (the airflow over the canopy is the
 *    loudest thing in a fast cockpit).
 *
 *  Air
 *  - Wind: band-passed noise scaled by dynamic pressure, with buffet.
 *  - Cockpit air (the environmental control system): a steady soft hiss inside.
 *  - Canopy: the airframe's rumble through the sealed cockpit (a recorded loop), louder with speed.
 *  - In vacuum nothing carries sound: everything goes through a low-pass that closes to what the
 *    pilot hears through the airframe, and the wind falls silent.
 *
 *  The pilot, under G (inside only)
 *  - Breathing through the oxygen mask (recorded breaths, a different one each time, a little
 *    higher or lower and louder or softer): every ~4.3 s, heavier after a hard pull or on full
 *    power, held while the radio talks. From about 4 g the straining manoeuvre: a grunt against
 *    the load and a snatched breath on a ~3 s cycle.
 *  - The G-suit: its valve bangs air into the bladders as the load builds past ~2 g, a hiss as
 *    they fill further, the vent as the load comes off.
 *  - Heartbeat: from about 6.5 g a low double thump, quickening with the load.
 *  - Canopy creak: the frame complaining at a hard onset of G.
 *
 *  Warning: a two-tone pulse and Betty, the cockpit's voice ("Altitude, altitude", then "Pull up,
 *  pull up" for terrain; "Warning, overheat" for heat). Thunder: delayed by the speed of sound.
 */
import { RadioChain, type RadioSpeaker } from './audio/RadioChain';

export interface JetAudioState {
  throttle: number;
  boost: number;
  /** Air density relative to sea level. */
  air: number;
  speedMps: number;
  /** Inside the canopy (cockpit and GoPro views). */
  inside: boolean;
  /** 0 none, 1 terrain, 2 heat. */
  warning: number;
  /** Load factor, g. */
  gLoad: number;
  /** Height over the ground (km): the engine sinks away as you climb. */
  altKm?: number;
  /** The pilot's grey-out (0..1): the world's sound narrows and dims. */
  greyOut?: number;
  /** Inside a cloud: the outside sound is muffled. */
  inCloud?: boolean;
}

// Levels of the recordings in the mix (they are levelled to about -20..-26 LUFS when cut)
/** Breaths against the synthesised breaths' level scale (0.32 a calm breath on the ground). */
const BREATH_GAIN = 0.45;
const STRAIN_GAIN = 0.7;
const SUIT_GAIN = 0.8;
/** The engine loops, from inside the canopy and outside. */
const ENGINE_IN = 0.55;
const ENGINE_OUT = 0.9;
const CANOPY = 0.4;

/** The recordings in public/audio/jet/ (made by scripts/build_cockpit_sounds.py). */
export const JET_RECORDINGS = [
  ...Array.from({ length: 10 }, (_, i) => `breath_calm_${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `breath_deep_${i + 1}`),
  ...Array.from({ length: 4 }, (_, i) => `strain_${i + 1}`),
  'gsuit_in', 'gsuit_out', 'betty_pullup', 'betty_altitude', 'betty_overheat',
  'engine_idle', 'engine_high', 'canopy',
];

const smooth01 = (x: number): number => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
};

export class JetAudio {
  private ctx: AudioContext | null = null;
  /** Everything outside the pilot's mask and helmet passes through here (grey-out, cloud, ducking). */
  private world!: BiquadFilterNode;
  private duck!: GainNode;
  private radioBus!: GainNode;
  private radioChain: RadioChain | null = null;
  /** The radio is talking until then (context time): the pilot holds their breath. */
  private radioUntil = 0;
  private nextCalm = 0;
  private startPlayed = false;
  private master!: GainNode;
  private hull!: BiquadFilterNode;
  private engineBus!: GainNode;
  private pilotBus!: GainNode;
  private sub!: { osc: OscillatorNode[]; gain: GainNode };
  private turbine!: { osc: OscillatorNode[]; gain: GainNode; filter: BiquadFilterNode };
  private whine!: { osc: OscillatorNode; gain: GainNode; filter: BiquadFilterNode };
  private roar!: { gain: GainNode; filter: BiquadFilterNode };
  private rough!: { gain: GainNode };
  private burner!: { gain: GainNode; filter: BiquadFilterNode };
  private wind!: { gain: GainNode; filter: BiquadFilterNode };
  private ecs!: { gain: GainNode };
  private suit!: { gain: GainNode };
  private warn!: { osc: OscillatorNode; gain: GainNode };
  private mask!: BiquadFilterNode;
  private noise: AudioBuffer | null = null;
  private brown: AudioBuffer | null = null;
  private wasBoosting = false;
  public muted = false;
  /** The recordings (public/audio/jet/), by name, once loaded. */
  private rec = new Map<string, AudioBuffer>();
  private engineRec: { idle: AudioBufferSourceNode; high: AudioBufferSourceNode; idleGain: GainNode; highGain: GainNode } | null = null;
  private canopy: GainNode | null = null;
  /** The pilot's own recorded sounds: through the mask mic into the headset. */
  private maskRec!: BiquadFilterNode;
  private lastTake = '';
  private breathGain: GainNode | null = null;
  private lastGain: GainNode | null = null;
  private strainEnd = -100;
  private suitFull = false;
  private lastSuitBang = -10;
  private betty!: GainNode;
  private warnSince = -1;
  private warnKind = 0;
  private nextBetty = 0;

  // Spool and the pilot's state
  private spool = 0.35;
  private lastT = -1;
  private straining = false;
  private nextBreath = 0;
  private lastG = 1;
  private gRate = 0;
  private suitLevel = 0;
  private nextBeat = 0;
  private lastCreak = -10;

  /** Must be called from a user gesture (browsers start audio suspended). */
  public start(): void {
    if (this.ctx) {
      void this.ctx.resume();
      return;
    }
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.hull = ctx.createBiquadFilter();
    this.hull.type = 'lowpass';
    this.hull.frequency.value = 600;
    this.hull.Q.value = 0.4;
    // The world outside the mask: one low-pass (open; it closes under G and in cloud) and the
    // ducking gain the radio pulls down while it talks. The radio and the pilot's own breathing
    // and body go straight to the master: they are the sounds closest to the head
    this.world = ctx.createBiquadFilter();
    this.world.type = 'lowpass';
    this.world.frequency.value = 20000;
    this.world.Q.value = 0.5;
    this.duck = ctx.createGain();
    this.world.connect(this.duck);
    this.duck.connect(this.master);
    this.hull.connect(this.world);
    // A gentle master compressor: holds the peaks without lifting the quiet floor
    const glue = ctx.createDynamicsCompressor();
    glue.threshold.value = -10;
    glue.ratio.value = 2.5;
    glue.attack.value = 0.01;
    glue.release.value = 0.3;
    this.master.connect(glue);
    // and a fast catch after it, so a radio call over a loud burner never clips the output
    const limit = ctx.createDynamicsCompressor();
    limit.threshold.value = -3;
    limit.knee.value = 0;
    limit.ratio.value = 20;
    limit.attack.value = 0.002;
    limit.release.value = 0.12;
    glue.connect(limit);
    limit.connect(ctx.destination);
    this.radioBus = ctx.createGain();
    // Measured live in the cockpit: with the world ducked to 0.4, speech sits ~6-7 dB over it
    this.radioBus.gain.value = 1.0;
    this.radioBus.connect(this.master);
    this.radioChain = new RadioChain(ctx, this.radioBus);
    this.engineBus = ctx.createGain();
    this.engineBus.connect(this.hull);
    // The pilot's own sounds: close, inside the helmet, never through the hull filter
    this.pilotBus = ctx.createGain();
    this.pilotBus.gain.value = 0;
    this.pilotBus.connect(this.master);
    this.mask = ctx.createBiquadFilter();
    this.mask.type = 'lowpass';
    this.mask.frequency.value = 1300;
    this.mask.Q.value = 0.5;
    const maskBody = ctx.createBiquadFilter();
    maskBody.type = 'lowshelf';
    maskBody.frequency.value = 220;
    maskBody.gain.value = 4;
    this.mask.connect(maskBody);
    maskBody.connect(this.pilotBus);
    // Recorded breaths come through the mask's microphone: no deep lows, a little forward
    this.maskRec = ctx.createBiquadFilter();
    this.maskRec.type = 'highpass';
    this.maskRec.frequency.value = 140;
    const maskPresence = ctx.createBiquadFilter();
    maskPresence.type = 'peaking';
    maskPresence.frequency.value = 1400;
    maskPresence.Q.value = 0.8;
    maskPresence.gain.value = 2;
    const maskTop = ctx.createBiquadFilter();
    maskTop.type = 'lowpass';
    maskTop.frequency.value = 6000;
    this.maskRec.connect(maskPresence);
    maskPresence.connect(maskTop);
    maskTop.connect(this.pilotBus);
    // Betty speaks on the intercom, straight into the helmet (never ducked or greyed out)
    this.betty = ctx.createGain();
    // (measured live: her words land ~5 dB over the cockpit bed, so a warning always cuts through)
    this.betty.gain.value = 2.0;
    const bettyBand = ctx.createBiquadFilter();
    bettyBand.type = 'highpass';
    bettyBand.frequency.value = 280;
    const bettyTop = ctx.createBiquadFilter();
    bettyTop.type = 'lowpass';
    bettyTop.frequency.value = 5200;
    this.betty.connect(bettyBand);
    bettyBand.connect(bettyTop);
    bettyTop.connect(this.master);
    this.loadRecordings(ctx);

    // Noise beds: 4 s pink-ish, 4 s brown
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + w * 0.099046;
      b1 = 0.963 * b1 + w * 0.2965164;
      b2 = 0.57 * b2 + w * 1.0526913;
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.18;
    }
    this.noise = buf;
    const bbuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const bd = bbuf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      bd[i] = last * 3.5;
    }
    this.brown = bbuf;

    const loop = (b: AudioBuffer): AudioBufferSourceNode => {
      const s = ctx.createBufferSource();
      s.buffer = b;
      s.loop = true;
      s.start(0, Math.random() * 3);
      return s;
    };
    const gain = (v = 0): GainNode => {
      const g = ctx.createGain();
      g.gain.value = v;
      return g;
    };
    const filter = (type: BiquadFilterType, f: number, q = 0.7): BiquadFilterNode => {
      const n = ctx.createBiquadFilter();
      n.type = type;
      n.frequency.value = f;
      n.Q.value = q;
      return n;
    };

    // Sub: the body
    const sg = gain();
    const subOsc = [1, 2.01].map((m) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = 40 * m;
      o.connect(sg);
      o.start();
      return o;
    });
    sg.connect(this.engineBus);
    this.sub = { osc: subOsc, gain: sg };

    // Turbine
    const tg = gain();
    const tf = filter('lowpass', 1800);
    tf.connect(tg);
    tg.connect(this.engineBus);
    const osc = [0, 7].map((detune) => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = 220;
      o.detune.value = detune;
      o.connect(tf);
      o.start();
      return o;
    });
    this.turbine = { osc, gain: tg, filter: tf };

    // Compressor whine: thin, high, a fifth above, through a narrow band
    const wgain = gain();
    const wfil = filter('bandpass', 3000, 8);
    const wosc = ctx.createOscillator();
    wosc.type = 'sawtooth';
    wosc.frequency.value = 3000;
    wosc.connect(wfil);
    wfil.connect(wgain);
    wgain.connect(this.engineBus);
    wosc.start();
    this.whine = { osc: wosc, gain: wgain, filter: wfil };

    // Roar
    const rg = gain();
    const rf = filter('lowpass', 400);
    loop(buf).connect(rf);
    rf.connect(rg);
    rg.connect(this.engineBus);
    this.roar = { gain: rg, filter: rf };

    // Roughness: band-passed brown noise, amplitude-modulated by a slow noise
    const roughOut = gain();
    const roughAm = gain(0.5);
    const roughBand = filter('bandpass', 260, 1.1);
    loop(bbuf).connect(roughBand);
    roughBand.connect(roughAm);
    const mod = loop(bbuf);
    const modLp = filter('lowpass', 12);
    const modDepth = gain(0.6);
    mod.connect(modLp);
    modLp.connect(modDepth);
    modDepth.connect(roughAm.gain);
    roughAm.connect(roughOut);
    roughOut.connect(this.engineBus);
    this.rough = { gain: roughOut };

    // Afterburner rumble
    const bg = gain();
    const bf = filter('lowpass', 140, 1.2);
    loop(bbuf).connect(bf);
    bf.connect(bg);
    bg.connect(this.engineBus);
    this.burner = { gain: bg, filter: bf };

    // Wind (outside air on the canopy: not through the hull filter)
    const wg = gain();
    const wf = filter('bandpass', 700, 0.6);
    loop(buf).connect(wf);
    wf.connect(wg);
    wg.connect(this.world);
    this.wind = { gain: wg, filter: wf };

    // Cockpit air: the conditioning hiss
    const eg = gain();
    const eb = filter('bandpass', 2200, 0.6);
    const el = filter('lowpass', 4800, 0.5);
    loop(buf).connect(eb);
    eb.connect(el);
    el.connect(eg);
    eg.connect(this.world);
    this.ecs = { gain: eg };

    // G-suit bladders: a hiss through the suit's hose
    const sgn = gain();
    const sb = filter('bandpass', 1500, 0.6);
    loop(buf).connect(sb);
    sb.connect(sgn);
    sgn.connect(this.pilotBus);
    this.suit = { gain: sgn };

    // Warning tone
    const wo = ctx.createOscillator();
    wo.type = 'square';
    wo.frequency.value = 880;
    const wgn = gain();
    const wlp = filter('lowpass', 2400);
    wo.connect(wlp);
    wlp.connect(wgn);
    wgn.connect(this.master);
    wo.start();
    this.warn = { osc: wo, gain: wgn };

    this.master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.6);
  }

  public update(timeSec: number, s: JetAudioState): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const t = ctx.currentTime;
    const dt = this.lastT < 0 ? 0 : Math.min(0.25, Math.max(0, t - this.lastT));
    this.lastT = t;
    const tc = 0.12;
    this.master.gain.setTargetAtTime(this.muted ? 0 : 0.9, t, 0.15);

    const atmos = Math.min(1, s.air * 6);
    this.hull.frequency.setTargetAtTime(500 + 9000 * atmos, t, 0.3);

    // --- Spool: the rotors lag the lever (about 1.6 s up, 2.4 s down)
    const want = 0.35 + 0.65 * s.throttle + 0.08 * s.boost;
    const tau = want > this.spool ? 1.6 : 2.4;
    this.spool += (want - this.spool) * (1 - Math.exp(-dt / tau));
    const n = this.spool;
    const g = (n - 0.35) / 0.73; // 0 idle .. 1 full

    // From inside at speed the airflow drowns the engine
    const q = s.air * Math.min(s.speedMps, 1500) ** 2 / 1.0e6; // ~dynamic pressure, normalised
    const masking = s.inside ? 1 - 0.45 * Math.min(1, q * 2.5) : 1;
    // Inside, the engine is felt more than heard, and sinks further as you climb (about -9 dB by
    // 5 km): behind a sealed canopy and a helmet's earcups the jet is a texture, not a roar
    const high = s.inside ? 1 - 0.65 * smooth01((s.altKm ?? 0) / 5) : 1;
    this.engineBus.gain.setTargetAtTime(masking * high, t, 0.6);
    // Grey-out: the world slides down to ~280 Hz and loses 6 dB; in cloud it closes to ~900 Hz.
    // While the radio talks, the world ducks 6 dB (quick down, slow back)
    const grey = Math.min(1, Math.max(0, s.greyOut ?? 0));
    const openHz = s.inCloud ? 900 : 20000;
    this.world.frequency.setTargetAtTime(Math.exp(Math.log(openHz) + (Math.log(280) - Math.log(openHz)) * grey), t, 0.25);
    const talking = t < this.radioUntil;
    this.duck.gain.setTargetAtTime((talking ? 0.4 : 1) * (1 - 0.5 * grey), t, talking ? 0.1 : 0.45);
    if (!this.startPlayed) {
      this.startPlayed = true;
      if ((s.altKm ?? 1) < 0.1 && s.speedMps < 30) this.playStart();
    }

    for (let i = 0; i < this.sub.osc.length; i++) this.sub.osc[i].frequency.setTargetAtTime((32 + 26 * n) * (i === 0 ? 1 : 2.01), t, 0.2);
    this.sub.gain.gain.setTargetAtTime((s.inside ? 0.32 : 0.22) * (0.25 + 0.75 * g) * (1 + 0.4 * s.boost), t, 0.2);

    // The recorded engine: idle and high loops crossfaded by the spool, sped up as it winds (the
    // synthesised turbine, whine and roar stay under it, thinner, for the throttle's fine moves)
    const synth = this.engineRec ? 0.5 : 1;
    if (this.engineRec) {
      const x = smooth01(g + 0.25 * s.boost);
      const e = this.engineRec;
      const level = s.inside ? ENGINE_IN : ENGINE_OUT;
      e.idleGain.gain.setTargetAtTime(level * Math.cos((x * Math.PI) / 2), t, 0.3);
      e.highGain.gain.setTargetAtTime(level * Math.sin((x * Math.PI) / 2) * (1 + 0.3 * s.boost), t, 0.3);
      e.idle.playbackRate.setTargetAtTime(0.86 + 0.4 * n, t, 0.3);
      e.high.playbackRate.setTargetAtTime(0.8 + 0.2 * n, t, 0.3);
    }
    for (const o of this.turbine.osc) o.frequency.setTargetAtTime(140 + 760 * n, t, 0.2);
    this.turbine.filter.frequency.setTargetAtTime(900 + 2600 * n, t, tc);
    this.turbine.gain.gain.setTargetAtTime((s.inside ? 0.05 : 0.025) * (0.4 + n) * synth, t, tc);

    const whineHz = 1900 + 1700 * n;
    this.whine.osc.frequency.setTargetAtTime(whineHz, t, 0.2);
    this.whine.filter.frequency.setTargetAtTime(whineHz, t, 0.2);
    this.whine.gain.gain.setTargetAtTime((s.inside ? 0.012 : 0.02) * (0.3 + 0.7 * g) * synth, t, 0.2);

    this.roar.filter.frequency.setTargetAtTime(220 + 1800 * g + 1400 * s.boost, t, tc);
    this.roar.gain.gain.setTargetAtTime((s.inside ? 0.35 : 0.6) * (0.2 + 0.8 * g) * (1 + s.boost * 0.6) * (0.4 + 0.6 * synth), t, tc);
    this.rough.gain.gain.setTargetAtTime(0.18 * (0.3 + 0.7 * g + 0.4 * s.boost), t, 0.25);

    this.burner.filter.frequency.setTargetAtTime(110 + 160 * s.boost, t, 0.2);
    this.burner.gain.gain.setTargetAtTime(s.boost * (s.inside ? 0.9 : 1.4), t, 0.08);
    if (s.boost > 0.5 && !this.wasBoosting) this.whump(t);
    this.wasBoosting = s.boost > 0.5;

    const buffet = 1 + 0.25 * Math.sin(timeSec * 23) * Math.sin(timeSec * 7.1) + 0.2 * Math.min(1, Math.max(0, s.gLoad - 5) / 4) * Math.sin(timeSec * 31);
    this.wind.gain.gain.setTargetAtTime(Math.min(0.9, q * 0.9) * buffet * (s.inside ? 0.85 : 1), t, 0.1);
    this.wind.filter.frequency.setTargetAtTime(350 + Math.min(s.speedMps, 1500) * 1.6, t, 0.2);

    this.ecs.gain.gain.setTargetAtTime(s.inside ? 0.035 : 0, t, 0.4);
    // The canopy's rumble: the airframe in the airstream (a hum of the systems in vacuum)
    this.canopy?.gain.setTargetAtTime(s.inside ? CANOPY * (0.12 + atmos * (0.35 + 0.65 * Math.min(1, q * 2))) : 0, t, 0.5);

    this.updatePilot(t, dt, s);

    const pulse = s.warning > 0 && Math.floor(timeSec * (s.warning === 1 ? 6 : 3)) % 2 === 0;
    this.warn.osc.frequency.setTargetAtTime(s.warning === 1 ? 1050 : 620, t, 0.01);
    this.warn.gain.gain.setTargetAtTime(pulse ? (this.rec.has('betty_pullup') ? 0.035 : 0.06) : 0, t, 0.01);
    this.updateBetty(t, s.warning);
  }

  /** The afterburner lighting: a low thump dropping in pitch under a burst of noise. */
  private whump(t: number): void {
    const ctx = this.ctx;
    if (!ctx || !this.brown) return;
    this.burner.gain.gain.cancelScheduledValues(t);
    this.burner.gain.gain.setValueAtTime(2.4, t);
    this.burner.gain.gain.setTargetAtTime(1.2, t + 0.05, 0.25);
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(70, t);
    o.frequency.exponentialRampToValueAtTime(32, t + 0.6);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.9, t + 0.03);
    g.gain.setTargetAtTime(0, t + 0.08, 0.25);
    o.connect(g);
    g.connect(this.hull);
    o.start(t);
    o.stop(t + 2);
  }

  // ------------------------------------------------------------------ the pilot

  private updatePilot(t: number, dt: number, s: JetAudioState): void {
    const g = s.air > 1e-4 ? s.gLoad : 1;
    if (dt > 0) this.gRate += ((g - this.lastG) / dt - this.gRate) * Math.min(1, dt / 0.1);
    this.lastG = g;
    this.pilotBus.gain.setTargetAtTime(s.inside ? 1 : 0, t, 0.3);
    if (!s.inside) {
      this.straining = false;
      return;
    }

    // Straining manoeuvre: in at about 4 g, out below 3.5
    const strain = Math.min(1, Math.max(0, (g - 4) / 4));
    if (!this.straining && g > 4.2) {
      this.straining = true;
      this.nextBreath = t;
    } else if (this.straining && g < 3.5) {
      this.straining = false;
      this.strainEnd = t;
      // the long breath out after the strain
      if (!this.playBreath(t, 'deep', 1.1)) this.breath(t, 'out', 0.7);
      this.nextCalm = t + 3.2;
    }
    // Calm breathing through the mask the rest of the time: the demand valve's hiss in, the
    // rubber exhale valve out, every ~4.3 s on the ground, slower and softer up high, quicker on
    // full power; held while the radio talks, and a slightly deeper one after
    if (!this.straining && t >= this.nextCalm && t > this.radioUntil) {
      const busy = Math.min(1, s.throttle * 0.6 + s.boost * 0.6 + Math.max(0, g - 1.5) / 3);
      const up = smooth01((s.altKm ?? 0) / 8);
      const deep = t - this.radioUntil < 1.5 ? 1.25 : 1;
      const level = (0.32 - 0.08 * up + 0.12 * busy) * deep;
      // Heavier breaths on full power and for a while after a hard pull
      const kind = busy > 0.55 || t - this.strainEnd < 12 ? 'deep' : 'calm';
      const len = this.playBreath(t, kind, level / 0.32);
      if (!len) {
        const inDur = this.maskBreath(t, 'in', level);
        this.maskBreath(t + inDur + 0.25 + Math.random() * 0.2, 'out', level);
      }
      this.nextCalm = t + Math.max(len + 0.9, (4.3 + 0.8 * up - 0.9 * busy) * (0.9 + Math.random() * 0.2));
    }
    if (this.straining && t >= this.nextBreath) {
      // The straining manoeuvre: a grunt against the load (a closed throat, the chest tensed),
      // then a snatched breath, every ~3 s
      const grunt = this.playRec(this.take('strain', 4), t, STRAIN_GAIN * (0.75 + 0.35 * strain), this.maskRec, 0.96 + Math.random() * 0.08);
      if (grunt) {
        this.breath(t + grunt * 0.95, 'in', 0.6 + 0.3 * strain);
      } else {
        const outDur = this.breath(t, 'out', 0.7 + 0.3 * strain);
        this.breath(t + outDur, 'in', 0.7 + 0.3 * strain);
      }
      this.nextBreath = t + 2.9 - 0.4 * strain + Math.random() * 0.25;
    }

    // G-suit: inflates with the load, vents as it comes off
    const target = Math.min(1, Math.max(0, (g - 1.8) / 6));
    const prev = this.suitLevel;
    this.suitLevel += (target - this.suitLevel) * Math.min(1, dt * (target > this.suitLevel ? 2.5 : 1.2));
    const flow = Math.abs(this.suitLevel - prev) / Math.max(dt, 1e-3);
    this.suit.gain.gain.setTargetAtTime(Math.min(0.22, flow * 0.5) * (this.suitLevel > prev ? 1 : 0.7) * (this.rec.has('gsuit_in') ? 0.6 : 1), t, 0.08);
    // The valve opening as the load passes ~2 g, and the vent when it is all off again
    if (!this.suitFull && g > 2.1 && target > this.suitLevel && t - this.lastSuitBang > 1.5) {
      this.suitFull = true;
      this.lastSuitBang = t;
      this.playRec(this.rec.get('gsuit_in'), t, SUIT_GAIN, this.pilotBus);
    } else if (this.suitFull && this.suitLevel < 0.03 && g < 1.6) {
      this.suitFull = false;
      this.playRec(this.rec.get('gsuit_out'), t, SUIT_GAIN * 0.7, this.pilotBus);
    }

    // Heartbeat from ~6.5 g, quickening
    const heart = Math.min(1, Math.max(0, (g - 6.5) / 2.5));
    if (heart > 0.02) {
      if (this.nextBeat < t) this.nextBeat = t + 0.05;
      while (this.nextBeat < t + 0.1) {
        this.beat(this.nextBeat, heart);
        this.nextBeat += 60 / (105 + 25 * heart);
      }
    } else {
      this.nextBeat = 0;
    }

    // Canopy creak at a hard onset (or holding over 7 g)
    if ((g > 4.5 && this.gRate > 2.5 && t - this.lastCreak > 3.5) || (g > 7 && t - this.lastCreak > 5 + Math.random() * 3)) {
      this.creak(t + 0.05, 0.6 + 0.4 * Math.min(1, (g - 4.5) / 3.5));
      this.lastCreak = t;
    }
  }

  /** Fetches the recordings; each sound uses its recording as soon as it has arrived. */
  private loadRecordings(ctx: AudioContext): void {
    const base = `${import.meta.env.BASE_URL || '/'}audio/jet/`;
    for (const name of JET_RECORDINGS) {
      void fetch(`${base}${name}.mp3`)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(name))))
        .then((d) => ctx.decodeAudioData(d))
        .then((buf) => {
          if (this.ctx !== ctx) return;
          this.rec.set(name, buf);
          this.onRecording(ctx, name);
        })
        .catch(() => undefined);
    }
  }

  /** Starts a loop when its recording arrives (the engine once both halves are in). */
  private onRecording(ctx: AudioContext, name: string): void {
    const loop = (buf: AudioBuffer, to: AudioNode): { src: AudioBufferSourceNode; gain: GainNode } => {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      src.connect(gain);
      gain.connect(to);
      src.start(0, Math.random() * buf.duration);
      return { src, gain };
    };
    const idle = this.rec.get('engine_idle');
    const high = this.rec.get('engine_high');
    if ((name === 'engine_idle' || name === 'engine_high') && idle && high && !this.engineRec) {
      const a = loop(idle, this.engineBus);
      const b = loop(high, this.engineBus);
      this.engineRec = { idle: a.src, high: b.src, idleGain: a.gain, highGain: b.gain };
    }
    const canopy = this.rec.get('canopy');
    if (name === 'canopy' && canopy) this.canopy = loop(canopy, this.world).gain;
  }

  /** A random take of `prefix_1..count`, never the same one twice running. */
  private take(prefix: string, count: number): AudioBuffer | undefined {
    const have = Array.from({ length: count }, (_, i) => `${prefix}_${i + 1}`).filter((n) => this.rec.has(n) && n !== this.lastTake);
    if (!have.length) return undefined;
    const name = have[Math.floor(Math.random() * have.length)];
    this.lastTake = name;
    return this.rec.get(name);
  }

  /** Plays a recording once; returns how long it lasts (0 if it has not arrived). */
  private playRec(buf: AudioBuffer | undefined, t: number, level: number, to: AudioNode, rate = 1): number {
    const ctx = this.ctx;
    if (!ctx || !buf) return 0;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = rate;
    const g = ctx.createGain();
    g.gain.value = level;
    src.connect(g);
    g.connect(to);
    src.start(t);
    this.lastGain = g;
    return buf.duration / rate;
  }

  /**
   * One recorded breath through the mask, in and out: a different take each time, a few percent
   * higher or lower and a little louder or softer, so no two in a row sound alike. Returns its
   * length (0 when the recordings are not in yet).
   */
  private playBreath(t: number, kind: 'calm' | 'deep', level: number): number {
    const buf = kind === 'calm' ? this.take('breath_calm', 10) : this.take('breath_deep', 5);
    const rate = 0.94 + Math.random() * 0.12;
    const len = this.playRec(buf, t, BREATH_GAIN * level * (0.85 + Math.random() * 0.3), this.maskRec, rate);
    // (kept, so a radio call can cut it short: the pilot holds the breath to listen)
    if (len) this.breathGain = this.lastGain;
    return len;
  }

  /** Betty: "Altitude, altitude" when the ground comes up, "Pull up" if it keeps coming; "Overheat". */
  private updateBetty(t: number, warning: number): void {
    if (warning !== this.warnKind) {
      this.warnKind = warning;
      this.warnSince = t;
      this.nextBetty = t + 0.15;
    }
    if (!warning || t < this.nextBetty) return;
    const name = warning === 2 ? 'betty_overheat' : t - this.warnSince < 2.5 ? 'betty_altitude' : 'betty_pullup';
    const len = this.playRec(this.rec.get(name), t, 1, this.betty);
    this.nextBetty = t + (len ? len + (warning === 2 ? 2.5 : 0.6) : 1);
  }

  /** One breath through the mask: in is quick and high, out longer and lower. Returns its length. */
  private breath(t: number, kind: 'in' | 'out', level: number): number {
    const ctx = this.ctx;
    if (!ctx || !this.noise) return 0.3;
    const dur = kind === 'in' ? 0.34 + Math.random() * 0.06 : 0.42 + Math.random() * 0.08;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(kind === 'in' ? 900 : 650, t);
    bp.frequency.linearRampToValueAtTime(kind === 'in' ? 1500 : 480, t + dur);
    const g = ctx.createGain();
    const peak = (kind === 'in' ? 0.55 : 0.45) * level;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + (kind === 'in' ? 0.04 : 0.015));
    g.gain.setValueAtTime(peak * 0.85, t + dur * 0.7);
    g.gain.linearRampToValueAtTime(0, t + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.mask);
    src.start(t, Math.random() * 3);
    src.stop(t + dur + 0.05);
    return dur * 0.85;
  }

  /** The heart: a lub-dub of two low falling thumps. */
  private beat(t: number, level: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 160;
    lp.connect(this.pilotBus);
    for (const [dtb, f0, f1, a] of [[0, 62, 42, 1], [0.27, 74, 50, 0.6]] as const) {
      const at = t + dtb;
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(f0, at);
      o.frequency.exponentialRampToValueAtTime(f1, at + 0.09);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(0.75 * a * level, at + 0.012);
      g.gain.setTargetAtTime(0, at + 0.03, 0.045);
      o.connect(g);
      g.connect(lp);
      o.start(at);
      o.stop(at + 0.4);
    }
  }

  /** The canopy frame under load: a few dry ticks over a low groan. */
  private creak(t: number, level: number): void {
    const ctx = this.ctx;
    if (!ctx || !this.noise) return;
    const groan = ctx.createOscillator();
    groan.type = 'sawtooth';
    groan.frequency.setValueAtTime(95 + Math.random() * 30, t);
    groan.frequency.linearRampToValueAtTime(70 + Math.random() * 20, t + 0.5);
    const gl = ctx.createBiquadFilter();
    gl.type = 'bandpass';
    gl.frequency.value = 420;
    gl.Q.value = 3;
    const gg = ctx.createGain();
    gg.gain.setValueAtTime(0, t);
    gg.gain.linearRampToValueAtTime(0.08 * level, t + 0.08);
    gg.gain.linearRampToValueAtTime(0, t + 0.55);
    groan.connect(gl);
    gl.connect(gg);
    gg.connect(this.master);
    groan.start(t);
    groan.stop(t + 0.6);
    for (let i = 0; i < 4; i++) {
      const at = t + 0.05 + i * (0.06 + Math.random() * 0.08);
      const src = ctx.createBufferSource();
      src.buffer = this.noise;
      const hp = ctx.createBiquadFilter();
      hp.type = 'bandpass';
      hp.frequency.value = 2400 + Math.random() * 1600;
      hp.Q.value = 4;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.25 * level, at);
      g.gain.setTargetAtTime(0, at + 0.004, 0.01);
      src.connect(hp);
      hp.connect(g);
      g.connect(this.master);
      src.start(at, Math.random() * 3);
      src.stop(at + 0.05);
    }
  }

  /**
   * One calm breath through the oxygen mask. In: the demand regulator opens with a small metallic
   * tick and hisses (bright, a faint whistle in it). Out: a softer, lower breath into the rubber,
   * the exhale valve fluttering as it lifts and clicking shut at the end. Returns its length.
   */
  private maskBreath(t: number, kind: 'in' | 'out', level: number): number {
    const ctx = this.ctx;
    if (!ctx || !this.noise) return 1;
    const g = ctx.createGain();
    g.connect(this.pilotBus);
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    if (kind === 'in') {
      const dur = 0.9 + Math.random() * 0.3;
      bp.Q.value = 0.9;
      bp.frequency.setValueAtTime(1800, t);
      bp.frequency.linearRampToValueAtTime(2600, t + dur);
      const whistle = ctx.createBiquadFilter();
      whistle.type = 'bandpass';
      whistle.frequency.value = 3100 + Math.random() * 300;
      whistle.Q.value = 14;
      const wg = ctx.createGain();
      wg.gain.value = 0.5;
      src.connect(bp);
      bp.connect(g);
      src.connect(whistle);
      whistle.connect(wg);
      wg.connect(g);
      const peak = 1.25 * level;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(peak, t + 0.12);
      g.gain.setValueAtTime(peak * 0.9, t + dur * 0.75);
      g.gain.linearRampToValueAtTime(0, t + dur);
      src.start(t, Math.random() * 3);
      src.stop(t + dur + 0.05);
      this.valveTick(t, (0.4 * level) / 0.32, 3800);
      return dur;
    }
    const dur = 1.1 + Math.random() * 0.4;
    bp.Q.value = 1.1;
    bp.frequency.setValueAtTime(900, t);
    bp.frequency.linearRampToValueAtTime(560, t + dur);
    // The flap of the exhale valve: a fast flutter in the air as it lifts
    const flutter = ctx.createGain();
    flutter.gain.value = 0.75;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 26 + Math.random() * 8;
    const lg = ctx.createGain();
    lg.gain.value = 0.25;
    lfo.connect(lg);
    lg.connect(flutter.gain);
    src.connect(bp);
    bp.connect(flutter);
    flutter.connect(g);
    const peak = 0.95 * level;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.08);
    g.gain.setTargetAtTime(0, t + dur * 0.45, dur * 0.22);
    lfo.start(t);
    lfo.stop(t + dur);
    src.start(t, Math.random() * 3);
    src.stop(t + dur + 0.1);
    this.valveTick(t + dur * 0.92, (0.28 * level) / 0.32, 1600);
    return dur;
  }

  /** A valve's tick: a very short band of noise. */
  private valveTick(t: number, level: number, hz: number): void {
    const ctx = this.ctx;
    if (!ctx || !this.noise) return;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = hz;
    bp.Q.value = 3;
    const g = ctx.createGain();
    g.gain.setValueAtTime(level, t);
    g.gain.setTargetAtTime(0, t + 0.002, 0.005);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.pilotBus);
    src.start(t, Math.random() * 3);
    src.stop(t + 0.04);
  }

  /** The engines being started on the ground (a recording), heard through the canopy. */
  private playStart(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    void fetch(`${import.meta.env.BASE_URL || '/'}audio/jet/engine_start.mp3`)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error('no start'))))
      .then((d) => ctx.decodeAudioData(d))
      .then((buf) => {
        const t = ctx.currentTime + 0.05;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.55, t + 0.3);
        g.gain.setValueAtTime(0.55, t + Math.max(1, buf.duration - 4));
        g.gain.linearRampToValueAtTime(0, t + buf.duration);
        src.connect(g);
        g.connect(this.hull);
        src.start(t);
      })
      .catch(() => undefined);
  }

  /** The radio: plays a call through the set; returns its length (s). The mix ducks under it. */
  public speak(buffer: AudioBuffer, speaker: RadioSpeaker, distance: number): number {
    const ctx = this.ctx;
    if (!ctx || !this.radioChain || this.muted) return 0;
    const at = ctx.currentTime + 0.15;
    const end = this.radioChain.transmit(buffer, speaker, at, distance);
    this.radioUntil = Math.max(this.radioUntil, end);
    // A breath already under way is cut short: the pilot holds it to listen
    if (this.breathGain) this.breathGain.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
    this.breathGain = null;
    return end - ctx.currentTime;
  }

  /** Whether the audio has been started (it needs a user gesture first). */
  public get started(): boolean {
    return !!this.ctx;
  }

  public decode(data: ArrayBuffer): Promise<AudioBuffer> {
    if (!this.ctx) return Promise.reject(new Error('audio not started'));
    return this.ctx.decodeAudioData(data);
  }

  /**
   * Thunder from a strike `distanceKm` away: it arrives at the speed of sound (about 3 s per km),
   * a sharp crack close by, a long low rumble from far off.
   */
  public thunder(distanceKm: number): void {
    const ctx = this.ctx;
    if (!ctx || !this.noise || this.muted) return;
    const delay = Math.min(12, distanceKm * 2.9);
    const t0 = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = distanceKm < 2 ? 1400 : 380;
    const g = ctx.createGain();
    const peak = Math.min(1.4, 2.2 / (0.6 + distanceKm));
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + (distanceKm < 2 ? 0.02 : 0.25));
    g.gain.setTargetAtTime(0, t0 + 0.3, 1.2 + distanceKm * 0.15);
    src.connect(lp);
    lp.connect(g);
    g.connect(this.master);
    src.start(t0, Math.random() * 2);
    src.stop(t0 + 6);
  }

  public suspend(): void {
    if (!this.ctx) return;
    this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
    const ctx = this.ctx;
    window.setTimeout(() => {
      if (ctx.state === 'running') void ctx.suspend();
    }, 600);
  }

  public resume(): void {
    if (this.ctx) void this.ctx.resume();
  }

  public dispose(): void {
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
  }
}
