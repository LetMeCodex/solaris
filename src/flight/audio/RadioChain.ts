/**
 * The radio: a dry voice line made to sound like it came over a military UHF set and into a
 * flight helmet, built live in Web Audio for each transmission (the recordings are stored clean,
 * see scripts/generate_radio_voice.py, so the radio can change with where you are).
 *
 *   key click      a 700 Hz tick of 18 ms and a breath of noise: the transmit switch
 *   voice          the set's passband, voiced to match a recording of real military radio traffic
 *                  (see RADIO_TUNING): high-passes at 300 Hz, a dip in the boxy low mids, a wide
 *                  nasal presence lift near 2 kHz and a shelf above it; a soft tanh overdrive (the
 *                  crunch of a hard-driven mic and transmitter); a fast compressor (every word as
 *                  loud as the next); then the receiver: a high-pass again (the overdrive puts the
 *                  voice's low fundamental back), the thin, forward earpiece (a lift at 3.3 kHz)
 *                  and a steep wall just under 4 kHz (resonant low-passes and a notch)
 *   carrier        a faint hiss of band-limited noise under the whole call, fluttering a little
 *                  (more, and crackling, the farther away the station: mission control from Mars)
 *   squelch tail   when the carrier drops, the receiver opens for a moment: a burst of noise and
 *                  a click ("ksshh-tk")
 *
 * Each speaker has its own colour: your own calls come back as sidetone, cleaner and closer; the
 * wingman close; a controller on the ground normal; mission control far, hissier and crackly.
 * `transmit` returns when the call will end, so the mix can duck under it and the pilot can hold
 * their breath while it lasts.
 */

export type RadioSpeaker = 'pilot' | 'wing' | 'control' | 'mission';

interface Colour {
  drive: number;
  hiss: number;
  crackle: number;
  flutter: number;
  rate: number;
  gain: number;
}

const COLOURS: Record<RadioSpeaker, Colour> = {
  pilot: { drive: 2.2, hiss: 0.010, crackle: 0, flutter: 0.05, rate: 1, gain: 0.85 },
  wing: { drive: 3.0, hiss: 0.016, crackle: 0, flutter: 0.1, rate: 1, gain: 0.95 },
  control: { drive: 3.4, hiss: 0.02, crackle: 0.15, flutter: 0.15, rate: 1, gain: 1 },
  mission: { drive: 3.8, hiss: 0.026, crackle: 0.5, flutter: 0.3, rate: 0.98, gain: 1 },
};

/**
 * The set's voicing, matched to a recording of real military radio traffic: its energy sits in
 * 250-3700 Hz, the brightness centre (spectral centroid) of each word between 1.3 and 2.4 kHz, and
 * almost nothing is left above 4 kHz. Rendered through `transmit` in an OfflineAudioContext, the
 * radio voices (scripts/generate_radio_voice.py) measure 330-3550 Hz (5-95% of the energy), word
 * centroids 1.2-2.5 kHz, the 4-5 kHz band 21-30 dB and everything above 5 kHz 38-43 dB under the
 * whole. (Exported so it can be re-measured
 * and tuned from the dev console.)
 */
export const RADIO_TUNING = {
  /** the mic and transmitter's high-pass (x2) */
  hp: 300,
  /** the boxy low mids, taken down */
  mudF: 600,
  mudDb: -5,
  /** the nasal presence of a radio voice, and the shelf above it */
  presF: 2000,
  presQ: 0.6,
  presDb: 9,
  shelfF: 2600,
  shelfDb: 8,
  /** before the overdrive: keeps its harmonics from aliasing up */
  lp: 4200,
  pre: 1.4,
  /** the receiver: high-pass (x2) after the overdrive */
  hp2: 250,
  /** the earpiece: forward (a lift near 3.3 kHz; a low shelf to thin it, off) */
  earLowF: 600,
  earLowDb: 0,
  earF: 3300,
  earQ: 1,
  earDb: 8,
  /** the wall: resonant low-passes (x2), one more, and a notch above */
  lp2: 3900,
  lp2Q: 1.5,
  lp3: 4000,
  notchF: 4800,
  notchQ: 0.7,
  post: 0.9,
};
const T = RADIO_TUNING;

/** A tanh curve for the overdrive, normalised so full scale stays full scale. */
function driveCurve(k: number): Float32Array {
  const n = 1024;
  const c = new Float32Array(n);
  const norm = Math.tanh(k);
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    c[i] = Math.tanh(k * x) / norm;
  }
  return c;
}

export class RadioChain {
  private readonly noise: AudioBuffer;
  private readonly curves = new Map<number, Float32Array>();

  /** `out`: where the finished radio goes (a bus that bypasses the cockpit and G filters). */
  constructor(private readonly ctx: AudioContext, private readonly out: AudioNode) {
    const len = ctx.sampleRate * 2;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }

  private curve(k: number): Float32Array {
    const key = Math.round(k * 10);
    let c = this.curves.get(key);
    if (!c) {
      c = driveCurve(key / 10);
      this.curves.set(key, c);
    }
    return c;
  }

  private filt(type: BiquadFilterType, f: number, q = 0.707, gainDb = 0): BiquadFilterNode {
    const n = this.ctx.createBiquadFilter();
    n.type = type;
    n.frequency.value = f;
    n.Q.value = q;
    n.gain.value = gainDb;
    return n;
  }

  private noiseSrc(at: number, dur: number): AudioBufferSourceNode {
    const s = this.ctx.createBufferSource();
    s.buffer = this.noise;
    s.loop = true;
    s.start(at, Math.random() * 1.5);
    s.stop(at + dur + 0.05);
    return s;
  }

  /**
   * Plays `voice` as a transmission from `speaker`, starting at `at` (context time). `distance`
   * 0..1 adds hiss, flutter and crackle (a weak signal). Returns the time the call ends (after
   * the squelch tail).
   */
  public transmit(voice: AudioBuffer, speaker: RadioSpeaker, at: number, distance = 0): number {
    const ctx = this.ctx;
    const c = COLOURS[speaker];
    const far = Math.min(1, Math.max(0, distance));
    const t0 = Math.max(at, ctx.currentTime + 0.02);

    // The finished call: one gain per transmission, into the radio bus
    const call = ctx.createGain();
    call.gain.value = c.gain;
    call.connect(this.out);

    // --- Key click: a short 700 Hz tick plus a breath of noise
    const tick = ctx.createOscillator();
    tick.frequency.value = 700;
    const tg = ctx.createGain();
    tg.gain.setValueAtTime(0, t0);
    tg.gain.linearRampToValueAtTime(0.16, t0 + 0.002);
    tg.gain.setTargetAtTime(0, t0 + 0.004, 0.004);
    tick.connect(tg);
    tg.connect(call);
    tick.start(t0);
    tick.stop(t0 + 0.03);
    const kn = this.noiseSrc(t0, 0.02);
    const knf = this.filt('bandpass', 2400, 1.2);
    const kng = ctx.createGain();
    kng.gain.setValueAtTime(0.05, t0);
    kng.gain.setTargetAtTime(0, t0 + 0.003, 0.004);
    kn.connect(knf);
    knf.connect(kng);
    kng.connect(call);

    // --- The voice through the set
    const v0 = t0 + 0.06;
    const src = ctx.createBufferSource();
    src.buffer = voice;
    src.playbackRate.value = c.rate;
    const dur = voice.duration / c.rate;
    const chain: AudioNode[] = [
      src,
      // the mic and the transmitter's audio stage: nothing under ~300 Hz
      this.filt('highpass', T.hp),
      this.filt('highpass', T.hp),
      this.filt('peaking', T.mudF, 1.0, T.mudDb),
      // the nasal, forward bite of a radio voice
      this.filt('peaking', T.presF, T.presQ, T.presDb),
      this.filt('highshelf', T.shelfF, 0.707, T.shelfDb),
      this.filt('lowpass', T.lp),
    ];
    const pre = ctx.createGain();
    pre.gain.value = T.pre;
    const shaper = ctx.createWaveShaper();
    shaper.curve = this.curve(c.drive + 1.2 * far) as Float32Array<ArrayBuffer>;
    shaper.oversample = '2x';
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -24;
    comp.knee.value = 6;
    comp.ratio.value = 6;
    comp.attack.value = 0.003;
    comp.release.value = 0.12;
    const post = ctx.createGain();
    post.gain.value = T.post;
    chain.push(
      pre,
      shaper,
      comp,
      // the overdrive's intermodulation puts the voice's fundamental back (~120 Hz) and its
      // harmonics reach past the channel: the receiver's IF filter takes both off again, steeply
      this.filt('highpass', T.hp2),
      this.filt('highpass', T.hp2),
      // the earpiece: thin and forward, the body of the voice gone
      this.filt('lowshelf', T.earLowF, 0.707, T.earLowDb),
      this.filt('peaking', T.earF, T.earQ, T.earDb),
      this.filt('lowpass', T.lp2, T.lp2Q),
      this.filt('lowpass', T.lp2, T.lp2Q),
      this.filt('lowpass', T.lp3),
      this.filt('notch', T.notchF, T.notchQ),
      post,
      call,
    );
    for (let i = 0; i < chain.length - 1; i++) chain[i].connect(chain[i + 1]);
    // A weak signal fades in and out a little (flutter), under the voice too
    const flutterDepth = c.flutter + 0.35 * far;
    if (flutterDepth > 0.02) {
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 3 + Math.random() * 4;
      const lg = ctx.createGain();
      lg.gain.value = 0.18 * flutterDepth;
      lfo.connect(lg);
      lg.connect(post.gain);
      lfo.start(v0);
      lfo.stop(v0 + dur + 0.1);
    }
    src.start(v0);

    // --- Carrier hiss under the whole call
    const end = v0 + dur;
    const hiss = this.noiseSrc(t0, end - t0 + 0.02);
    const hb = this.filt('bandpass', 1400, 0.5);
    const hl = this.filt('lowpass', 2600);
    const hg = ctx.createGain();
    const hissLevel = c.hiss * (1 + 2.2 * far);
    hg.gain.setValueAtTime(0, t0);
    hg.gain.linearRampToValueAtTime(hissLevel, t0 + 0.03);
    hg.gain.setValueAtTime(hissLevel, end);
    hg.gain.linearRampToValueAtTime(0, end + 0.02);
    hiss.connect(hb);
    hb.connect(hl);
    hl.connect(hg);
    hg.connect(call);

    // --- Crackle: sparse sharp pops (a far station, a flare, the edge of range)
    const crackle = c.crackle + 1.5 * far;
    if (crackle > 0.05) {
      const pops = Math.floor(crackle * dur * 5);
      for (let i = 0; i < pops; i++) {
        const pt = t0 + Math.random() * (end - t0);
        const p = this.noiseSrc(pt, 0.03);
        // (through the receiver's own passband, like everything it plays)
        const pf = this.filt('bandpass', 1800, 0.8);
        const pg = ctx.createGain();
        pg.gain.setValueAtTime(0.06 + Math.random() * 0.1, pt);
        pg.gain.setTargetAtTime(0, pt + 0.002, 0.006);
        p.connect(pf);
        pf.connect(pg);
        pg.connect(call);
      }
    }

    // --- Squelch tail: the receiver opens as the carrier drops ("ksshh-tk")
    const sq = end + 0.03;
    const sqLen = 0.07 + Math.random() * 0.05 + 0.08 * far;
    const sn = this.noiseSrc(sq, sqLen);
    const sf = this.filt('bandpass', 2200, 0.7);
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0, sq);
    sg.gain.linearRampToValueAtTime(0.13, sq + 0.006);
    sg.gain.setValueAtTime(0.11, sq + sqLen * 0.6);
    sg.gain.linearRampToValueAtTime(0, sq + sqLen);
    sn.connect(sf);
    sf.connect(sg);
    sg.connect(call);
    const snap = ctx.createOscillator();
    snap.type = 'square';
    snap.frequency.value = 1800;
    const spg = ctx.createGain();
    spg.gain.setValueAtTime(0, sq + sqLen);
    spg.gain.linearRampToValueAtTime(0.05, sq + sqLen + 0.001);
    spg.gain.setTargetAtTime(0, sq + sqLen + 0.002, 0.003);
    snap.connect(spg);
    spg.connect(call);
    snap.start(sq + sqLen);
    snap.stop(sq + sqLen + 0.03);

    const finish = sq + sqLen + 0.05;
    // Let the graph go once the call is over
    window.setTimeout(() => call.disconnect(), (finish - ctx.currentTime + 0.5) * 1000);
    return finish;
  }
}
