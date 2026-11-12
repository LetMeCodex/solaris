import type { RadioSpeaker } from './RadioChain';

/**
 * Who says what on the radio, and when: the flight's director.
 *
 * The lines are whole sentences made once (scripts/radio_lines.json, generated into
 * public/voice/radio/), each with a trigger: a moment of the flight (`mach1`, `cloudout`,
 * `karman`), a place (`country:India`, `place:himalaya`, `body:Saturn`), a reaction (`awe`), or
 * long-journey chatter (`cruise`). Each frame the director watches the flight for those moments
 * (edges, with hysteresis so nothing fires twice for one event), and when one comes it picks the
 * line for it heard longest ago (remembered across visits, so a long journey keeps finding new
 * ones) and keys the mic.
 *
 * A call after something beautiful may get an answer from someone else on the frequency (a quiet
 * "are you seeing this?"). Calls keep a gap between them; urgent ones (ground ahead, the Sun
 * too close) go out at once. When nothing has happened for a few minutes, somebody says
 * something, so the silence of a long cruise is company, not emptiness. Mission control far away
 * sounds far away: more hiss and crackle the farther you are from Earth.
 */

export interface RadioLine {
  file: string;
  seconds: number;
  text: string;
  speaker: RadioSpeaker;
  mood: string;
  trigger: string;
}

export interface RadioFlight {
  timeSec: number;
  nearest: string;
  /** Height over the nearest body's surface (km) and its radius (km). */
  altKm: number;
  radiusKm: number;
  speedMps: number;
  mach: number;
  /** Air density relative to Earth's sea level (0 in vacuum). */
  air: number;
  gLoad: number;
  /** 0 none, 1 terrain ahead, 2 heat. */
  warning: number;
  skyEvent: string;
  inCloud: boolean;
  /** Sine of the Sun's height where the jet is. */
  sunUp: number;
  lat: number;
  lon: number;
  /** The country under the jet (Earth, low enough), '' unknown; true over open sea. */
  country: string;
  atSea: boolean;
  /** Distance from Earth's centre (km). */
  earthDistKm: number;
}

export interface RadioOutput {
  /** Plays a call; returns when it ends (seconds from now). */
  speak(buffer: AudioBuffer, speaker: RadioSpeaker, distance: number): number;
  decode(data: ArrayBuffer): Promise<AudioBuffer>;
  subtitle(text: string, seconds: number): void;
  muted(): boolean;
}

const BASE = `${import.meta.env.BASE_URL || '/'}voice/radio/`;
const HEARD_KEY = 'solaris.radio.heard';
const LABEL: Record<RadioSpeaker, string> = { pilot: 'ONE-ONE', wing: 'TWO', control: 'CONTROL', mission: 'SOLARIS CONTROL' };

/** Places worth a word when you fly over them (lat, lon, radius km). */
const PLACES: Array<{ key: string; lat: number; lon: number; km: number }> = [
  { key: 'himalaya', lat: 27.99, lon: 86.93, km: 120 },
  { key: 'eiffel', lat: 48.858, lon: 2.294, km: 12 },
  { key: 'pyramids', lat: 29.979, lon: 31.134, km: 15 },
  { key: 'grandcanyon', lat: 36.1, lon: -112.1, km: 60 },
  { key: 'sahara', lat: 23.4, lon: 9.0, km: 900 },
  { key: 'alps', lat: 45.9, lon: 7.4, km: 140 },
  { key: 'tokyo', lat: 35.68, lon: 139.76, km: 40 },
  { key: 'newyork', lat: 40.758, lon: -73.985, km: 25 },
  { key: 'dubai', lat: 25.197, lon: 55.274, km: 25 },
  { key: 'taj', lat: 27.175, lon: 78.042, km: 12 },
  { key: 'fuji', lat: 35.36, lon: 138.73, km: 40 },
  { key: 'amazon', lat: -3.4, lon: -62.2, km: 700 },
];

/** Nominatim's English names that differ from ours. */
const COUNTRY_ALIAS: Record<string, string> = {
  'Türkiye': 'Turkey',
  'United States of America': 'United States',
  'Republic of Korea': 'South Korea',
  'Russian Federation': 'Russia',
  "People's Republic of China": 'China',
};

function oceanAt(lat: number, lon: number): string {
  if (lat > 66) return 'Arctic';
  if (lon > 20 && lon < 120 && lat < 30) return 'Indian';
  if (lon > -70 && lon < 20) return 'Atlantic';
  return 'Pacific';
}

function distKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const r = Math.PI / 180;
  const a = Math.sin(((lat2 - lat1) * r) / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lon2 - lon1) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Triggers that go out at once, over anything. */
const URGENT = new Set(['terrain', 'body:Sun']);
/** Moments after which someone may answer, and the reaction they give. */
const ANSWERED: Record<string, string> = { cloudout: 'awe', sunrise: 'awe', orbit: 'awe', karman: 'awe', aurora: 'awe', mach1: 'joy', lowfly: 'joy' };
/** How long (s) before the same trigger may speak again. */
const COOLDOWN: Record<string, number> = {
  highg: 150, gafter: 150, terrain: 25, terrainafter: 60, cloudin: 120, cloudout: 120, storm: 200, lowfly: 300,
  sunrise: 600, sunset: 600, night: 900, reentry: 180, aurora: 1800, climb: 600, mach1: 400, mach2: 600, hyper: 600,
};

export class RadioDirector {
  private lines: Record<string, RadioLine> = {};
  private byTrigger = new Map<string, string[]>();
  private buffers = new Map<string, Promise<AudioBuffer | null>>();
  private heard: Record<string, number> = {};
  private lastFired = new Map<string, number>();
  private queue: Array<{ trigger: string; at: number; replyTo?: RadioSpeaker }> = [];
  private busyUntil = 0;
  private lastTalk = 0;
  private nextCruise = 200;
  private started = false;
  private loaded = false;
  // Edge state
  private armed = new Set<string>(['climb', 'mach1', 'mach2', 'hyper', 'karman', 'orbit', 'leaveearth']);
  private gHigh = 0;
  private gWasHigh = false;
  private terrainT = 0;
  private cloudT = 0;
  private wasCloud = false;
  private lowT = 0;
  private wasGround = false;
  private airborneT = 0;
  private approachSaid = false;
  private lastSunUp = NaN;
  private lastNearest = '';
  private lastSky = '';
  private country = '';
  private countryCandidate = '';
  private countrySince = 0;
  private seaSince = 0;
  private wasFarFromEarth = false;
  private placeSaid = new Map<string, number>();

  constructor(private readonly out: RadioOutput) {
    try {
      this.heard = JSON.parse(localStorage.getItem(HEARD_KEY) || '{}') as Record<string, number>;
    } catch {
      this.heard = {};
    }
    void fetch(`${BASE}manifest.json`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((m: Record<string, RadioLine>) => {
        this.lines = m;
        for (const [id, l] of Object.entries(m)) {
          const list = this.byTrigger.get(l.trigger) ?? [];
          list.push(id);
          this.byTrigger.set(l.trigger, list);
        }
        this.loaded = true;
      })
      .catch(() => undefined);
  }

  /** Something the flight knows directly (thunder close by, an era change). */
  public event(trigger: string): void {
    this.fire(trigger, this.nowT);
  }

  /** The flight clock at the last update. */
  private nowT = 0;

  private buffer(id: string): Promise<AudioBuffer | null> {
    let p = this.buffers.get(id);
    if (!p) {
      p = fetch(BASE + this.lines[id].file)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
        .then((d) => this.out.decode(d))
        .catch(() => null);
      this.buffers.set(id, p);
    }
    return p;
  }

  /** The line for a trigger heard longest ago (never heard first), optionally not by `notBy`. */
  private pick(trigger: string, notBy?: RadioSpeaker): string | null {
    const ids = (this.byTrigger.get(trigger) ?? []).filter((id) => !notBy || this.lines[id].speaker !== notBy);
    if (ids.length === 0) return null;
    let best: string[] = [];
    let bestT = Infinity;
    for (const id of ids) {
      const t = this.heard[id] ?? 0;
      if (t < bestT - 1) {
        bestT = t;
        best = [id];
      } else if (Math.abs(t - bestT) <= 1) best.push(id);
    }
    return best[Math.floor(Math.random() * best.length)];
  }

  private fire(trigger: string, timeSec: number, replyTo?: RadioSpeaker): void {
    if (!this.loaded || !this.byTrigger.has(trigger)) return;
    const cd = COOLDOWN[trigger] ?? 0;
    const last = this.lastFired.get(trigger);
    if (cd > 0 && last !== undefined && timeSec - last < cd) return;
    this.lastFired.set(trigger, timeSec);
    if (URGENT.has(trigger)) this.queue.unshift({ trigger, at: timeSec, replyTo });
    else if (this.queue.length < 3) this.queue.push({ trigger, at: timeSec, replyTo });
  }

  private play(item: { trigger: string; at: number; replyTo?: RadioSpeaker }, timeSec: number, farFromEarth: number): void {
    const id = this.pick(item.trigger, item.replyTo);
    if (!id) return;
    const line = this.lines[id];
    this.heard[id] = Date.now();
    try {
      localStorage.setItem(HEARD_KEY, JSON.stringify(this.heard));
    } catch {
      /* private window: remembered for this visit only */
    }
    // Reserve the frequency now (the take may still be downloading)
    this.busyUntil = timeSec + line.seconds + 1.5;
    void this.buffer(id).then((buf) => {
      if (!buf || this.out.muted()) return;
      const distance = line.speaker === 'mission' ? farFromEarth : line.speaker === 'control' ? 0.1 : 0;
      const secs = this.out.speak(buf, line.speaker, distance);
      this.busyUntil = this.lastTalk = performance.now() / 1000 - this.clockOffset + secs;
      this.out.subtitle(`${LABEL[line.speaker]} · ${line.text}`, secs + 0.8);
      // Someone answers a beautiful moment, now and then
      const reaction = ANSWERED[item.trigger] ?? (/^(place|body|sky):/.test(item.trigger) && line.speaker !== 'mission' ? 'awe' : '');
      if (reaction && !item.replyTo && Math.random() < 0.4) {
        this.queue.unshift({ trigger: reaction, at: this.busyUntil, replyTo: line.speaker });
      }
    });
  }

  /** The flight clock against performance.now (the takes arrive asynchronously). */
  private clockOffset = 0;

  public update(f: RadioFlight): void {
    const t = f.timeSec;
    this.nowT = t;
    this.clockOffset = performance.now() / 1000 - t;
    if (!this.loaded) return;
    if (!this.started) {
      this.started = true;
      this.lastTalk = t;
      this.wasGround = f.altKm < 0.08;
      this.queue.push({ trigger: 'start', at: t + 2.5 });
    }
    this.watch(f);

    // Long quiet: somebody says something
    if (t - this.lastTalk > this.nextCruise && this.queue.length === 0 && t > this.busyUntil) {
      this.fire('cruise', t);
      this.lastTalk = t;
      this.nextCruise = 160 + Math.random() * 120;
    }

    // Key the mic for the next call when the frequency is free (urgent ones at once)
    const head = this.queue[0];
    if (!head || head.at > t) return;
    if (t - head.at > 25 && !URGENT.has(head.trigger)) {
      this.queue.shift();
      return;
    }
    const gap = head.replyTo ? 0.9 + Math.random() * 1.2 : 6;
    if (!URGENT.has(head.trigger) && t < this.busyUntil + gap) return;
    this.queue.shift();
    const far = Math.min(1, Math.max(0, Math.log10(Math.max(f.earthDistKm, 1) / 4e5) / 3));
    this.play(head, t, far);
  }

  private watch(f: RadioFlight): void {
    const t = f.timeSec;
    const earth = f.nearest === 'Earth';
    const inAir = f.air > 0.005;

    // Edges with hysteresis: fire going up, re-arm well below
    const edge = (key: string, value: number, up: number, rearm: number, trigger = key): void => {
      if (this.armed.has(key) && value > up) {
        this.armed.delete(key);
        this.fire(trigger, t);
      } else if (!this.armed.has(key) && value < rearm) this.armed.add(key);
    };
    if (inAir) {
      edge('mach1', f.mach, 1.0, 0.9);
      edge('mach2', f.mach, 2.0, 1.8);
      edge('hyper', f.mach, 5.0, 4.5);
    }
    if (earth) {
      edge('climb', f.altKm, 3, 1.5);
      edge('karman', f.altKm, 100, 80);
      edge('orbit', f.altKm, 400, 200);
    }
    edge('leaveearth', f.earthDistKm, 60000, 25000);
    const far = f.earthDistKm > 100000;
    if (this.wasFarFromEarth && earth && f.earthDistKm < 40000) {
      this.fire('body:Earth', t);
      this.wasFarFromEarth = false;
    } else if (far) this.wasFarFromEarth = true;

    // Ground, takeoff, approach, landing
    const ground = f.altKm < 0.03 && f.speedMps < 120;
    if (this.wasGround && f.altKm > 0.2 && f.speedMps > 70) {
      this.wasGround = false;
      this.airborneT = t;
      this.approachSaid = false;
      this.fire('takeoff', t);
    }
    if (!this.wasGround && !ground && f.altKm < 0.4 && f.speedMps < 110 && inAir && !this.approachSaid && t - this.airborneT > 30) {
      this.approachSaid = true;
      this.fire('approach', t);
    }
    if (!this.wasGround && ground && t - this.airborneT > 30) this.fire('touchdown', t);
    if (ground) this.wasGround = true;

    // G: the strain, then the relief
    this.gHigh = f.gLoad > 6 ? this.gHigh + 1 / 60 : 0;
    if (this.gHigh > 1.2 && !this.gWasHigh) {
      this.gWasHigh = true;
      this.fire('highg', t);
    } else if (this.gWasHigh && f.gLoad < 3) {
      this.gWasHigh = false;
      if (Math.random() < 0.6) this.queue.push({ trigger: 'gafter', at: t + 1 });
    }

    // Ground ahead, then the shaky relief; heat
    if (f.warning === 1) {
      if (this.terrainT === 0) this.fire('terrain', t);
      this.terrainT += 1 / 60;
    } else if (this.terrainT > 0) {
      if (this.terrainT > 0.8) this.queue.push({ trigger: 'terrainafter', at: t + 1.2 });
      this.terrainT = 0;
    }
    if (f.warning === 2 && inAir) this.fire('reentry', t);

    // Cloud: in, and out on top after a while inside
    if (f.inCloud && !this.wasCloud) {
      this.cloudT = t;
      if (Math.random() < 0.5) this.fire('cloudin', t);
    } else if (!f.inCloud && this.wasCloud && t - this.cloudT > 6) this.fire('cloudout', t);
    this.wasCloud = f.inCloud;

    // Low and fast
    this.lowT = inAir && f.altKm < 0.15 && f.speedMps > 120 ? this.lowT + 1 / 60 : 0;
    if (this.lowT > 5) this.fire('lowfly', t);

    // The Sun coming up and going down (in the air, low enough to see the horizon change)
    if (inAir && f.altKm < 80) {
      if (Number.isFinite(this.lastSunUp)) {
        if (this.lastSunUp < 0.02 && f.sunUp >= 0.02) this.fire('sunrise', t);
        if (this.lastSunUp > 0.02 && f.sunUp <= 0.02) this.fire('sunset', t);
      }
      if (f.sunUp < -0.12 && Math.random() < 0.002) this.fire('night', t);
      if (earth && Math.abs(f.lat) > 62 && f.sunUp < -0.12 && Math.random() < 0.0015) this.fire('aurora', t);
    }
    this.lastSunUp = f.sunUp;

    // Arriving at another world
    if (f.nearest !== this.lastNearest) {
      if (this.lastNearest && f.nearest !== 'Earth' && f.altKm < f.radiusKm * 8) this.fire(`body:${f.nearest}`, t);
      else if (this.lastNearest && f.nearest !== 'Earth') this.pendingBody = f.nearest;
      this.lastNearest = f.nearest;
    }
    if (this.pendingBody === f.nearest && f.altKm < f.radiusKm * 8) {
      this.fire(`body:${f.nearest}`, t);
      this.pendingBody = '';
    }

    // The sky (eclipse, flare, comet, meteors) and the belt
    if (f.skyEvent !== this.lastSky) {
      const s = f.skyEvent.toUpperCase();
      if (s.includes('ECLIPSE')) this.fire('sky:eclipse', t);
      else if (s.includes('FLARE')) this.fire('sky:flare', t);
      else if (s.includes('COMET')) this.fire('sky:comet', t);
      else if (s.includes('METEOR')) this.fire('sky:meteors', t);
      else if (s.includes('ROCKS')) this.fire('belt', t);
      this.lastSky = f.skyEvent;
    }
    if (f.earthDistKm > 4.5e9 && Math.random() < 0.0008) this.fire('deep', t);

    // Earth: countries, oceans and famous places under the jet
    if (earth && f.altKm < 80) {
      const name = COUNTRY_ALIAS[f.country] ?? f.country;
      if (name && name !== this.country) {
        if (name !== this.countryCandidate) {
          this.countryCandidate = name;
          this.countrySince = t;
        } else if (t - this.countrySince > 3) {
          this.country = name;
          this.fire(`country:${name}`, t);
        }
      }
      if (f.atSea) {
        if (this.seaSince === 0) this.seaSince = t;
        else if (t - this.seaSince > 20 && this.country !== '~sea') {
          this.country = '~sea';
          this.fire(`ocean:${oceanAt(f.lat, f.lon)}`, t);
        }
      } else this.seaSince = 0;
      if (f.altKm < 30) {
        for (const p of PLACES) {
          const said = this.placeSaid.get(p.key) ?? -1e9;
          if (t - said > 1200 && distKm(f.lat, f.lon, p.lat, p.lon) < p.km) {
            this.placeSaid.set(p.key, t);
            this.fire(`place:${p.key}`, t);
          }
        }
      }
    }
  }

  private pendingBody = '';
}
