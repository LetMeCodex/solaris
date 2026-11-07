/**
 * The jet's sound, synthesised (no recordings), in layers that each follow the flight:
 *
 *  Engine
 *  - Spool: the engine's speed (N2, 0..1) lags the throttle, quicker winding up than running
 *    down, as a turbofan's rotors do. Every engine layer follows the spool, not the lever.
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
 *  - In vacuum nothing carries sound: everything goes through a low-pass that closes to what the
 *    pilot hears through the airframe, and the wind falls silent.
 *
 *  The pilot, under G (inside only)
 *  - Breathing through the oxygen mask: from about 4 g the straining manoeuvre, short hard
 *    inhales and held exhales on a ~3 s cycle, heard muffled through the mask.
 *  - The G-suit: a hiss as the bladders inflate when the load builds, a sigh as they vent.
 *  - Heartbeat: from about 6.5 g a low double thump, quickening with the load.
 *  - Canopy creak: the frame complaining at a hard onset of G.
 *
 *  Warning: a two-tone pulse for terrain and heat. Thunder: delayed by the speed of sound.
 */
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
}

export class JetAudio {
  private ctx: AudioContext | null = null;
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
    this.hull.connect(this.master);
    this.master.connect(ctx.destination);
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
    wg.connect(this.master);
    this.wind = { gain: wg, filter: wf };

    // Cockpit air: the conditioning hiss
    const eg = gain();
    const eb = filter('bandpass', 2200, 0.6);
    const el = filter('lowpass', 4800, 0.5);
    loop(buf).connect(eb);
    eb.connect(el);
    el.connect(eg);
    eg.connect(this.master);
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
    this.engineBus.gain.setTargetAtTime(masking, t, 0.6);

    for (let i = 0; i < this.sub.osc.length; i++) this.sub.osc[i].frequency.setTargetAtTime((32 + 26 * n) * (i === 0 ? 1 : 2.01), t, 0.2);
    this.sub.gain.gain.setTargetAtTime((s.inside ? 0.32 : 0.22) * (0.25 + 0.75 * g) * (1 + 0.4 * s.boost), t, 0.2);

    for (const o of this.turbine.osc) o.frequency.setTargetAtTime(140 + 760 * n, t, 0.2);
    this.turbine.filter.frequency.setTargetAtTime(900 + 2600 * n, t, tc);
    this.turbine.gain.gain.setTargetAtTime((s.inside ? 0.05 : 0.025) * (0.4 + n), t, tc);

    const whineHz = 1900 + 1700 * n;
    this.whine.osc.frequency.setTargetAtTime(whineHz, t, 0.2);
    this.whine.filter.frequency.setTargetAtTime(whineHz, t, 0.2);
    this.whine.gain.gain.setTargetAtTime((s.inside ? 0.012 : 0.02) * (0.3 + 0.7 * g), t, 0.2);

    this.roar.filter.frequency.setTargetAtTime(220 + 1800 * g + 1400 * s.boost, t, tc);
    this.roar.gain.gain.setTargetAtTime((s.inside ? 0.35 : 0.6) * (0.2 + 0.8 * g) * (1 + s.boost * 0.6), t, tc);
    this.rough.gain.gain.setTargetAtTime(0.18 * (0.3 + 0.7 * g + 0.4 * s.boost), t, 0.25);

    this.burner.filter.frequency.setTargetAtTime(110 + 160 * s.boost, t, 0.2);
    this.burner.gain.gain.setTargetAtTime(s.boost * (s.inside ? 0.9 : 1.4), t, 0.08);
    if (s.boost > 0.5 && !this.wasBoosting) this.whump(t);
    this.wasBoosting = s.boost > 0.5;

    const buffet = 1 + 0.25 * Math.sin(timeSec * 23) * Math.sin(timeSec * 7.1) + 0.2 * Math.min(1, Math.max(0, s.gLoad - 5) / 4) * Math.sin(timeSec * 31);
    this.wind.gain.gain.setTargetAtTime(Math.min(0.9, q * 0.9) * buffet * (s.inside ? 0.85 : 1), t, 0.1);
    this.wind.filter.frequency.setTargetAtTime(350 + Math.min(s.speedMps, 1500) * 1.6, t, 0.2);

    this.ecs.gain.gain.setTargetAtTime(s.inside ? 0.035 : 0, t, 0.4);

    this.updatePilot(t, dt, s);

    const pulse = s.warning > 0 && Math.floor(timeSec * (s.warning === 1 ? 6 : 3)) % 2 === 0;
    this.warn.osc.frequency.setTargetAtTime(s.warning === 1 ? 1050 : 620, t, 0.01);
    this.warn.gain.gain.setTargetAtTime(pulse ? 0.06 : 0, t, 0.01);
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
      this.breath(t, 'out', 0.7);
    }
    if (this.straining && t >= this.nextBreath) {
      // A short sharp exhale-inhale, then the held strain
      const outDur = this.breath(t, 'out', 0.7 + 0.3 * strain);
      this.breath(t + outDur, 'in', 0.7 + 0.3 * strain);
      this.nextBreath = t + 2.9 - 0.4 * strain + Math.random() * 0.25;
    }

    // G-suit: inflates with the load, vents as it comes off
    const target = Math.min(1, Math.max(0, (g - 1.8) / 6));
    const prev = this.suitLevel;
    this.suitLevel += (target - this.suitLevel) * Math.min(1, dt * (target > this.suitLevel ? 2.5 : 1.2));
    const flow = Math.abs(this.suitLevel - prev) / Math.max(dt, 1e-3);
    this.suit.gain.gain.setTargetAtTime(Math.min(0.22, flow * 0.5) * (this.suitLevel > prev ? 1 : 0.7), t, 0.08);

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
