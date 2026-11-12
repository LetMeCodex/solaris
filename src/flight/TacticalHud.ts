/**
 * The flight's readouts as a tactical overlay, in the manner of a modern military shooter's
 * mission screens: a location card that decodes itself when the place under you changes (the
 * letters scramble and lock in one by one, a scan line sweeps the card, the grid reference and
 * the coordinates tick), a flight card with an altitude tape, the climb rate and a Mach scale,
 * and a heading tape across the top. The same cards fly with you into space, where they read the
 * world you are near, your range to it, your speed, the distance to the Sun and the light-time
 * back to Earth: all of it real, from the flight.
 *
 * Drawn on the HUD canvas every frame (desktop and tablet; a phone keeps its compact corners).
 */
import type { JetTelemetry } from './JetController';
import { formatDistance, formatSpeed } from './worlds';

const MINT = (a: number): string => `rgba(109, 252, 192, ${a})`;
const WHITE = (a: number): string => `rgba(240, 244, 242, ${a})`;
const AMBER = (a: number): string => `rgba(244, 205, 114, ${a})`;
const CYAN = (a: number): string => `rgba(120, 220, 255, ${a})`;
const HEAD = '"Rajdhani", "Montserrat", system-ui, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/#<>=+';
const AU_KM = 149597870.7;
const C_KMS = 299792.458;

// --------------------------------------------------------------------------------- coordinates

/** Military Grid Reference System (WGS84, 1 m), e.g. "18T WL 83176 06284"; polar caps: UPS. */
export function toMgrs(lat: number, lon: number): string {
  if (lat < -80 || lat > 84) return lat > 0 ? 'UPS NORTH' : 'UPS SOUTH';
  let zone = Math.floor((lon + 180) / 6) + 1;
  if (lon >= 180) zone = 60;
  // Norway and Svalbard's wider zones
  if (lat >= 56 && lat < 64 && lon >= 3 && lon < 12) zone = 32;
  if (lat >= 72 && lat < 84) {
    if (lon >= 0 && lon < 9) zone = 31;
    else if (lon >= 9 && lon < 21) zone = 33;
    else if (lon >= 21 && lon < 33) zone = 35;
    else if (lon >= 33 && lon < 42) zone = 37;
  }
  const bands = 'CDEFGHJKLMNPQRSTUVWX';
  const band = bands[Math.min(19, Math.floor((lat + 80) / 8))];
  // Transverse Mercator
  const a = 6378137;
  const f = 1 / 298.257223563;
  const e2 = f * (2 - f);
  const ep2 = e2 / (1 - e2);
  const k0 = 0.9996;
  const phi = (lat * Math.PI) / 180;
  const lam0 = (((zone - 1) * 6 - 180 + 3) * Math.PI) / 180;
  const lam = (lon * Math.PI) / 180;
  const N = a / Math.sqrt(1 - e2 * Math.sin(phi) ** 2);
  const T = Math.tan(phi) ** 2;
  const C = ep2 * Math.cos(phi) ** 2;
  const A = Math.cos(phi) * (lam - lam0);
  const M = a * ((1 - e2 / 4 - (3 * e2 ** 2) / 64 - (5 * e2 ** 3) / 256) * phi
    - ((3 * e2) / 8 + (3 * e2 ** 2) / 32 + (45 * e2 ** 3) / 1024) * Math.sin(2 * phi)
    + ((15 * e2 ** 2) / 256 + (45 * e2 ** 3) / 1024) * Math.sin(4 * phi)
    - ((35 * e2 ** 3) / 3072) * Math.sin(6 * phi));
  const easting = k0 * N * (A + ((1 - T + C) * A ** 3) / 6 + ((5 - 18 * T + T ** 2 + 72 * C - 58 * ep2) * A ** 5) / 120) + 500000;
  let northing = k0 * (M + N * Math.tan(phi) * (A ** 2 / 2 + ((5 - T + 9 * C + 4 * C ** 2) * A ** 4) / 24 + ((61 - 58 * T + T ** 2 + 600 * C - 330 * ep2) * A ** 6) / 720));
  if (lat < 0) northing += 10000000;
  // The 100 km square's two letters
  const set = ((zone - 1) % 6) + 1;
  const cols = ['ABCDEFGH', 'JKLMNPQR', 'STUVWXYZ'][(set - 1) % 3];
  const rows = 'ABCDEFGHJKLMNPQRSTUV';
  const col = cols[Math.max(0, Math.min(7, Math.floor(easting / 100000) - 1))];
  const row = rows[(Math.floor(northing / 100000) + (set % 2 === 0 ? 5 : 0)) % 20];
  const e5 = String(Math.floor(easting % 100000)).padStart(5, '0');
  const n5 = String(Math.floor(northing % 100000)).padStart(5, '0');
  return `${zone}${band} ${col}${row} ${e5} ${n5}`;
}

/** Degrees, minutes, seconds: 40°43'12.4"N 073°59'48.2"W. */
export function toDms(lat: number, lon: number): string {
  const one = (v: number, pos: string, neg: string, w: number): string => {
    const a = Math.abs(v);
    const d = Math.floor(a);
    const mf = (a - d) * 60;
    const m = Math.floor(mf);
    const s = (mf - m) * 60;
    return `${String(d).padStart(w, '0')}°${String(m).padStart(2, '0')}'${s.toFixed(1).padStart(4, '0')}"${v >= 0 ? pos : neg}`;
  };
  return `${one(lat, 'N', 'S', 2)}  ${one(lon, 'E', 'W', 3)}`;
}

function clock(hours: number): string {
  const h = ((hours % 24) + 24) % 24;
  const hh = Math.floor(h);
  const mm = Math.floor((h - hh) * 60);
  const ss = Math.floor(((h - hh) * 60 - mm) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

function elapsed(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  return `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function lightTime(km: number): string {
  const s = km / C_KMS;
  if (s < 60) return `${s.toFixed(2)} S`;
  if (s < 3600) return `${Math.floor(s / 60)}M ${String(Math.floor(s % 60)).padStart(2, '0')}S`;
  return `${Math.floor(s / 3600)}H ${String(Math.floor(s / 60) % 60).padStart(2, '0')}M`;
}

// --------------------------------------------------------------------------------- animation state

interface Card {
  title: string;
  shownAt: number;
}
const loc: Card = { title: '', shownAt: -10 };
let climb = { lastAlt: NaN, lastT: 0, rate: 0 };
let startT = -1;
/** The centre-screen title (a new country, a new world): what it says and when it began. */
const reveal = { key: '', candidate: '', candidateAt: 0, shownAt: -10, tag: '', title: '', line: '' };
/** Breaking the sound barrier: when, and the Mach last frame. */
const mach = { last: 0, burstAt: -10 };
/** The load factor's peak, decaying slowly back. */
const gPeak = { value: 1, at: 0 };

/** The text decoding: characters lock in left to right; until then they cycle through glyphs. */
function decode(text: string, age: number, perChar = 0.035, delay = 0.12): string {
  if (age > delay + text.length * perChar + 0.05) return text;
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === ' ' || age > delay + i * perChar) out += ch;
    else if (age > delay + i * perChar - 0.25) out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    else out += ' ';
  }
  return out;
}

const ease = (x: number): number => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

/**
 * A number drawn like an odometer, right-aligned at `right`: every digit is a drum, the units one
 * turning continuously, each higher one turning over only as the one below passes from 9 to 0.
 * Digits sit on a fixed advance (tabular), separators stay put. Returns the width drawn.
 */
function rollingNumber(ctx: CanvasRenderingContext2D, value: number, right: number, y: number, size: number, colour: string): number {
  const v = Math.max(0, value);
  const digits = Math.max(1, Math.floor(Math.log10(Math.max(1, v))) + 1);
  ctx.font = `700 ${size}px ${HEAD}`;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '0px';
  const adv = ctx.measureText('0').width * 1.08;
  const sepW = adv * 0.45;
  let x = right;
  ctx.save();
  ctx.beginPath();
  ctx.rect(right - (digits + Math.floor((digits - 1) / 3)) * adv - 4, y - size * 0.95, (digits + 1) * adv + 8, size * 1.15);
  ctx.clip();
  ctx.fillStyle = colour;
  for (let i = 0; i < digits; i++) {
    if (i > 0 && i % 3 === 0) {
      x -= sepW;
      ctx.fillText(',', x + sepW / 2, y);
    }
    const p = Math.pow(10, i);
    const whole = Math.floor(v / p);
    const below = v - whole * p; // what the lower drums show
    // This drum turns only while the ones below roll from 9..9 over to 0..0
    // (held square on its figure most of the way, rolling over in the last stretch: readable
    // while it still turns like a drum)
    const raw = i === 0 ? v - Math.floor(v) : Math.max(0, below - (p - 1));
    const q = Math.min(1, Math.max(0, (raw - 0.85) / 0.15));
    const turn = q * q * (3 - 2 * q);
    const d = whole % 10;
    const cx = x - adv / 2;
    const off = turn * size * 1.05;
    ctx.fillText(String(d), cx, y - off);
    if (turn > 0.001) ctx.fillText(String((d + 1) % 10), cx, y - off + size * 1.05);
    x -= adv;
  }
  ctx.restore();
  return right - x;
}

// --------------------------------------------------------------------------------- drawing helpers

function chamferPanel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, cut: number, flip: boolean): void {
  ctx.beginPath();
  if (!flip) {
    ctx.moveTo(x, y);
    ctx.lineTo(x + w - cut, y);
    ctx.lineTo(x + w, y + cut);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
  } else {
    ctx.moveTo(x + w, y);
    ctx.lineTo(x + cut, y);
    ctx.lineTo(x, y + cut);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + w, y + h);
  }
  ctx.closePath();
}

function panelBg(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, flip: boolean): void {
  ctx.save();
  chamferPanel(ctx, x, y, w, h, 14, flip);
  const g = ctx.createLinearGradient(flip ? x + w : x, y, flip ? x : x + w, y);
  g.addColorStop(0, 'rgba(4, 10, 12, 0.46)');
  g.addColorStop(0.7, 'rgba(4, 10, 12, 0.22)');
  g.addColorStop(1, 'rgba(4, 10, 12, 0.0)');
  ctx.fillStyle = g;
  ctx.fill();
  // Fine scanlines over the panel
  ctx.clip();
  ctx.fillStyle = 'rgba(255,255,255,0.025)';
  for (let yy = y; yy < y + h; yy += 3) ctx.fillRect(x, yy, w, 1);
  ctx.restore();
}

/** Corner brackets that open out from the centre when the card appears. */
function brackets(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, k: number, colour: string): void {
  const len = 10 + 4 * k;
  const ox = (1 - k) * w * 0.35;
  ctx.strokeStyle = colour;
  ctx.lineWidth = 1.3;
  const corners: Array<[number, number, number, number]> = [[x + ox, y, 1, 1], [x + w - ox, y, -1, 1], [x + ox, y + h, 1, -1], [x + w - ox, y + h, -1, -1]];
  for (const [cx, cy, sx, sy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + sy * len);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + sx * len, cy);
    ctx.stroke();
  }
}

function text(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, font: string, colour: string, align: CanvasTextAlign = 'left', spacing = 0): number {
  ctx.font = font;
  ctx.fillStyle = colour;
  ctx.textAlign = align;
  ctx.letterSpacing = `${spacing}px`;
  ctx.fillText(s, x, y);
  const w = ctx.measureText(s).width;
  ctx.letterSpacing = '0px';
  return w;
}

// --------------------------------------------------------------------------------- the cards

interface Place {
  title: string;
  subtitle: string;
  /** Grid line (MGRS on Earth, a heliocentric fix in space). */
  grid: string;
  coords: string;
  /** Tag in the card's header. */
  tag: string;
}

/** What the location card says: the place under you on Earth, or the world you are near. */
export function describePlace(t: JetTelemetry, earth: { title: string; subtitle: string } | null): Place {
  if (t.nearest === 'Earth' && t.lat !== undefined && t.lon !== undefined && earth) {
    return { title: earth.title, subtitle: earth.subtitle, grid: `GRID ${toMgrs(t.lat, t.lon)}`, coords: toDms(t.lat, t.lon), tag: 'LOC' };
  }
  const world = t.nearest || 'DEEP SPACE';
  const ratio = t.altKm / Math.max(1, 6000);
  const phase = t.airWorld ? `IN ${world.toUpperCase()}'S AIR` : t.altKm < 2000 ? 'LOW ORBIT' : ratio < 30 ? 'HIGH ORBIT' : ratio < 3000 ? 'APPROACH' : 'DEEP SPACE';
  const coords = t.bodyLat !== undefined && t.bodyLon !== undefined && t.altKm < 200000
    ? `${toDms(t.bodyLat, t.bodyLon)}  PLANETOCENTRIC`
    : `RANGE ${formatDistance(t.altKm).toUpperCase()}`;
  return {
    title: world.toUpperCase(),
    subtitle: `${phase}  ·  ${formatDistance(t.altKm).toUpperCase()} ABOVE`,
    grid: `SOL ${(t.sunDistKm / AU_KM).toFixed(4)} AU`,
    coords,
    tag: 'NAV',
  };
}

function locationCard(ctx: CanvasRenderingContext2D, t: JetTelemetry, p: Place, now: number, x: number, bottom: number, maxW: number): void {
  if (p.title !== loc.title) {
    loc.title = p.title;
    loc.shownAt = now;
  }
  const age = now - loc.shownAt;
  const k = ease(age / 0.5);
  ctx.font = `700 30px ${HEAD}`;
  ctx.letterSpacing = '3px';
  const titleW = ctx.measureText(p.title).width;
  ctx.letterSpacing = '0px';
  const w = Math.max(300, Math.min(560, maxW, titleW + 70));
  const h = 122;
  const y = bottom - h;
  ctx.save();
  ctx.globalAlpha = 0.35 + 0.65 * k;
  panelBg(ctx, x, y, w, h, false);
  brackets(ctx, x, y, w, h, k, MINT(0.55));
  // Accent bar on the left, pulsing softly
  ctx.fillStyle = MINT(0.55 + 0.35 * Math.sin(now * 2.2) ** 2);
  ctx.fillRect(x - 6, y + 10, 2, h - 20);

  // Header: tag chip, a rule that draws itself out, the grid reference
  const hy = y + 18;
  ctx.fillStyle = MINT(0.9);
  ctx.fillRect(x + 12, hy - 9, 34, 12);
  text(ctx, p.tag, x + 29, hy + 1, `700 9px ${MONO}`, 'rgba(4,12,10,0.95)', 'center', 1.5);
  const blink = Math.floor(now * 2) % 2 === 0;
  if (blink) {
    ctx.fillStyle = age < 1.5 ? AMBER(0.95) : MINT(0.9);
    ctx.fillRect(x + 52, hy - 6, 5, 5);
  }
  const grid = decode(p.grid, age, 0.02, 0.3);
  const gw = text(ctx, grid, x + w - 12, hy + 1, `500 11px ${MONO}`, WHITE(0.8), 'right', 1);
  ctx.strokeStyle = MINT(0.3);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 64, hy - 3);
  ctx.lineTo(x + 64 + (w - 64 - gw - 26) * k, hy - 3);
  ctx.stroke();

  // Title, decoding, with a block cursor while it does
  const title = decode(p.title, age);
  const tw = text(ctx, title, x + 12, y + 58, `700 30px ${HEAD}`, WHITE(0.97), 'left', 3);
  if (age < 1.4 || blink) {
    ctx.fillStyle = MINT(age < 1.4 ? 0.9 : 0.5);
    ctx.fillRect(x + 16 + tw, y + 36, 11, 24);
  }
  text(ctx, decode(p.subtitle.toUpperCase(), age, 0.012, 0.45), x + 12, y + 78, `600 13px ${HEAD}`, WHITE(0.68), 'left', 2);
  // Coordinates: the last figures tick (the fix updating)
  text(ctx, decode(p.coords, age, 0.015, 0.6), x + 12, y + 97, `500 12px ${MONO}`, MINT(0.92), 'left', 0.5);
  // Footer: signal bars, local solar time, mission elapsed
  const fy = y + 113;
  for (let i = 0; i < 6; i++) {
    const on = i < 4 + Math.round(Math.sin(now * 1.3 + i) * 0.5 + 0.5);
    ctx.fillStyle = on ? MINT(0.75) : WHITE(0.15);
    ctx.fillRect(x + 12 + i * 5, fy - 2 - i * 1.2, 3, 3 + i * 1.2);
  }
  const lst = t.nearest ? `LST ${clock(t.localTime)}` : '';
  // While the card decodes, the footer streams the fix coming in
  const footer = age < 1.6
    ? Array.from({ length: 7 }, () => Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0')).join(' ')
    : `${lst}${lst ? '   ' : ''}T+${elapsed(now - startT)}`;
  text(ctx, footer, x + 48, fy, `500 10px ${MONO}`, age < 1.6 ? MINT(0.55) : WHITE(0.55), 'left', 1);
  // A position reticle on the card's corner: a dashed ring turning, locking in as the card lands
  {
    const rx = x + w + 26;
    const ry = y + 22;
    const r = 11 + 10 * (1 - k);
    ctx.strokeStyle = MINT(0.75);
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.lineDashOffset = -now * 12;
    ctx.beginPath();
    ctx.arc(rx, ry, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      ctx.moveTo(rx + dx * (r + 3), ry + dy * (r + 3));
      ctx.lineTo(rx + dx * (r + 8), ry + dy * (r + 8));
    }
    ctx.stroke();
    ctx.fillStyle = age < 1.5 && Math.floor(now * 8) % 2 === 0 ? AMBER(0.95) : MINT(0.95);
    ctx.fillRect(rx - 2, ry - 2, 4, 4);
  }

  // Scan line sweeping down the card as it appears
  if (age < 0.9) {
    const sy = y + h * ease(age / 0.9);
    const g = ctx.createLinearGradient(0, sy - 16, 0, sy + 2);
    g.addColorStop(0, MINT(0));
    g.addColorStop(1, MINT(0.28));
    ctx.fillStyle = g;
    ctx.fillRect(x, sy - 16, w, 18);
    ctx.fillStyle = MINT(0.7);
    ctx.fillRect(x, sy, w, 1);
  }
  ctx.restore();
}

function flightCard(ctx: CanvasRenderingContext2D, t: JetTelemetry, now: number, right: number, bottom: number): number {
  const w = 320;
  const h = 140;
  const x = right - w;
  const y = bottom - h;
  const space = !t.airWorld;
  // Climb rate from the altitude's change (smoothed), m/min
  if (Number.isFinite(climb.lastAlt) && now > climb.lastT) {
    const r = ((t.altKm - climb.lastAlt) * 1000 * 60) / (now - climb.lastT);
    if (Math.abs(r) < 1e7) climb.rate += (r - climb.rate) * Math.min(1, (now - climb.lastT) * 2);
  }
  climb.lastAlt = t.altKm;
  climb.lastT = now;

  // Through the sound barrier: the card flashes, a shock ring runs out, SUPERSONIC slides in
  if (!space && mach.last < 1 && t.mach >= 1) mach.burstAt = now;
  mach.last = t.mach;
  const burst = now - mach.burstAt;
  // The boot: the card builds itself in the first second of the flight
  const boot = ease((now - startT - 0.35) / 0.8);

  ctx.save();
  ctx.globalAlpha = 0.2 + 0.8 * boot;
  panelBg(ctx, x, y, w, h, true);
  brackets(ctx, x, y, w, h, boot, burst < 0.6 ? WHITE(0.95 - burst) : MINT(0.5));
  ctx.fillStyle = MINT(0.55 + 0.35 * Math.sin(now * 2.2 + 1) ** 2);
  ctx.fillRect(right + 4, y + 10, 2, h - 20);
  if (burst < 0.5) {
    ctx.fillStyle = WHITE(0.22 * (1 - burst / 0.5));
    chamferPanel(ctx, x, y, w, h, 14, true);
    ctx.fill();
  }
  // Load factor, and its peak (held a few seconds, then easing back)
  const g = Math.abs(t.gLoad);
  if (g >= gPeak.value) {
    gPeak.value = g;
    gPeak.at = now;
  } else if (now - gPeak.at > 4) gPeak.value += (g - gPeak.value) * 0.02;
  if (!space) {
    const gc = g > 7 ? AMBER(0.95) : g > 4 ? WHITE(0.9) : WHITE(0.55);
    text(ctx, `G ${t.gLoad.toFixed(1)}`, x + 16, y + 14, `600 10px ${MONO}`, gc, 'left', 1);
    text(ctx, `PEAK ${gPeak.value.toFixed(1)}`, x + 66, y + 14, `500 10px ${MONO}`, WHITE(0.4), 'left', 1);
  }

  // Altitude tape on the right edge: ticks scroll with the height
  const tapeX = right - 34;
  const tapeTop = y + 12;
  const tapeH = h - 24;
  const altM = t.altKm * 1000;
  const step = altM < 20000 ? 100 : altM < 2e6 ? 10000 : 1e6;
  const pxPer = 9 / step;
  ctx.save();
  ctx.beginPath();
  ctx.rect(tapeX - 4, tapeTop, 30, tapeH);
  ctx.clip();
  const midY = tapeTop + tapeH / 2;
  const base = Math.floor(altM / step) * step;
  for (let i = -8; i <= 8; i++) {
    const v = base + i * step;
    const ty = midY - (v - altM) * pxPer;
    const major = Math.round(v / step) % 5 === 0;
    // Fading out towards the tape's ends
    const edge = 1 - Math.min(1, Math.abs(ty - midY) / (tapeH / 2)) ** 2;
    ctx.fillStyle = WHITE((major ? 0.65 : 0.3) * edge);
    ctx.fillRect(tapeX, ty, major ? 12 : 6, 1);
  }
  ctx.restore();
  // The caret on the tape
  ctx.fillStyle = MINT(0.95);
  ctx.beginPath();
  ctx.moveTo(tapeX - 2, midY);
  ctx.lineTo(tapeX - 8, midY - 4);
  ctx.lineTo(tapeX - 8, midY + 4);
  ctx.closePath();
  ctx.fill();
  // Climb arrow by the tape
  const rising = climb.rate > 30;
  const falling = climb.rate < -30;
  if (rising || falling) {
    const len = Math.min(tapeH / 2 - 6, 6 + Math.log10(Math.abs(climb.rate)) * 9);
    ctx.fillStyle = rising ? MINT(0.8) : AMBER(0.85);
    ctx.fillRect(tapeX + 18, rising ? midY - len : midY, 2, len);
  }

  const vx = tapeX - 16;
  // A row: label, then the value (rolling drums when it is a plain count) and its unit
  const row = (label: string, value: string | number, unit: string, yy: number, size: number, colour: string): void => {
    text(ctx, label, x + 16, yy, `600 12px ${HEAD}`, WHITE(0.58), 'left', 2.5);
    const uw = unit ? text(ctx, unit, vx, yy, `600 12px ${HEAD}`, WHITE(0.62), 'right', 1.5) + 5 : 0;
    if (typeof value === 'number') rollingNumber(ctx, value, vx - uw, yy, size, colour);
    else text(ctx, value, vx - uw, yy, `700 ${size}px ${HEAD}`, colour, 'right', 1);
  };
  if (t.altKm < 100) row(space ? 'RANGE' : 'ALT', altM, 'M', y + 36, 25, WHITE(0.97));
  else {
    const alt = formatDistance(t.altKm).toUpperCase().split(' ');
    row(space ? 'RANGE' : 'ALT', alt[0], alt[1] ?? '', y + 36, 25, WHITE(0.97));
  }
  const vs = Math.abs(climb.rate) < 1e5 ? `${climb.rate >= 0 ? '+' : '−'}${Math.round(Math.abs(climb.rate)).toLocaleString('en-US')} M/MIN` : '';
  if (vs && !space) text(ctx, `VS ${vs}`, vx, y + 50, `500 10px ${MONO}`, climb.rate >= 0 ? MINT(0.75) : AMBER(0.8), 'right', 0.5);
  if (space) {
    const [num, unit] = formatSpeed(t.speedMps).toUpperCase().split(' ');
    row('VEL', num, unit ?? '', y + 74, 25, WHITE(0.97));
    text(ctx, `SUN ${(t.sunDistKm / AU_KM).toFixed(3)} AU`, x + 16, y + 102, `500 11px ${MONO}`, AMBER(0.88), 'left', 0.5);
    text(ctx, t.earthDistKm > 50000 ? `LIGHT-TIME TO EARTH ${lightTime(t.earthDistKm)}` : `EARTH ${formatDistance(t.earthDistKm).toUpperCase()}`, x + 16, y + 122, `500 11px ${MONO}`, CYAN(0.88), 'left', 0.5);
  } else {
    row('SPD', t.speedMps * 3.6, 'KM/H', y + 74, 25, WHITE(0.97));
    text(ctx, `${Math.round(t.speedMps * 1.94384).toLocaleString('en-US')} KT`, vx, y + 89, `500 10px ${MONO}`, WHITE(0.55), 'right', 0.5);
    // Mach: a segmented scale to 3, marks at 1 and 2; green once supersonic
    const segs = 30;
    const sx = x + 16;
    const sw = vx - sx - 70;
    const filled = Math.min(segs, Math.round((t.mach / 3) * segs));
    for (let i = 0; i < segs; i++) {
      const on = i < filled;
      const sup = i >= 10;
      ctx.fillStyle = on ? (sup ? MINT(0.9) : WHITE(0.85)) : WHITE(0.12);
      const hh = i % 10 === 9 ? 9 : 6;
      ctx.fillRect(sx + (i * sw) / segs, y + 124 - hh, sw / segs - 2, hh);
    }
    text(ctx, 'MACH', sx, y + 109, `600 12px ${HEAD}`, WHITE(0.58), 'left', 2.5);
    text(ctx, t.mach.toFixed(2), vx, y + 127, `700 30px ${HEAD}`, t.mach >= 1 ? MINT(0.98) : WHITE(0.97), 'right', 1);
    if (burst < 2.4) {
      // The shock ring from the Mach figure, and the word sliding out above the card
      const r = 10 + burst * 260;
      ctx.strokeStyle = WHITE(Math.max(0, 0.7 - burst * 0.9));
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(vx - 30, y + 117, r, Math.PI * 0.95, Math.PI * 1.55);
      ctx.stroke();
      const a = burst < 0.2 ? burst / 0.2 : burst > 1.8 ? (2.4 - burst) / 0.6 : 1;
      const slide = (1 - ease(burst / 0.35)) * 40;
      ctx.save();
      ctx.globalAlpha = a;
      text(ctx, 'SUPERSONIC', right + slide, y - 14, `700 22px ${HEAD}`, MINT(0.98), 'right', 8);
      text(ctx, decode(`MACH 1  ·  ${Math.round(t.speedMps * 3.6).toLocaleString('en-US')} KM/H`, burst, 0.02, 0.2), right, y - 40, `500 10px ${MONO}`, WHITE(0.75), 'right', 2);
      ctx.restore();
    }
  }
  ctx.restore();
  return burst < 2.4 && !space ? y - 50 : y;
}

/** The heading tape across the top: 5° ticks, every 15° a number or a cardinal, the waypoint. */
function headingTape(ctx: CanvasRenderingContext2D, t: JetTelemetry, cx: number, top: number): void {
  const span = 90;
  const w = 420;
  const pxPer = w / span;
  const hdg = ((t.headingDeg % 360) + 360) % 360;
  // A dark band behind the tape, fading at its ends (readable over a white sky)
  const band = ctx.createLinearGradient(cx - w / 2 - 40, 0, cx + w / 2 + 40, 0);
  band.addColorStop(0, 'rgba(4,10,12,0)');
  band.addColorStop(0.25, 'rgba(4,10,12,0.42)');
  band.addColorStop(0.75, 'rgba(4,10,12,0.42)');
  band.addColorStop(1, 'rgba(4,10,12,0)');
  ctx.save();
  ctx.shadowBlur = 0;
  ctx.fillStyle = band;
  ctx.fillRect(cx - w / 2 - 40, top - 6, w + 80, 34);
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.rect(cx - w / 2, top - 6, w, 36);
  ctx.clip();
  const names: Record<number, string> = { 0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SW', 270: 'W', 315: 'NW' };
  for (let d = Math.floor((hdg - span / 2) / 5) * 5; d <= hdg + span / 2; d += 5) {
    const x = cx + (d - hdg) * pxPer;
    const dd = ((d % 360) + 360) % 360;
    const edge = 1 - Math.min(1, Math.abs(x - cx) / (w / 2)) ** 2;
    const major = dd % 15 === 0;
    ctx.fillStyle = WHITE((major ? 0.7 : 0.35) * edge);
    ctx.fillRect(x, top + 14, 1, major ? 8 : 4);
    if (major || names[dd]) {
      const label = names[dd] ?? String(dd).padStart(3, '0');
      text(ctx, label, x, top + 9, `${names[dd] ? 700 : 500} ${names[dd] ? 14 : 10}px ${names[dd] ? HEAD : MONO}`, names[dd] ? MINT(0.95 * edge) : WHITE(0.7 * edge), 'center', 1);
    }
  }
  // The waypoint's bearing, a diamond on the tape
  if (t.waypoint) {
    let rel = t.waypoint.bearingDeg - hdg;
    rel = ((rel + 540) % 360) - 180;
    const x = cx + Math.max(-span / 2, Math.min(span / 2, rel)) * pxPer;
    ctx.fillStyle = CYAN(0.95);
    ctx.beginPath();
    ctx.moveTo(x, top + 18);
    ctx.lineTo(x + 5, top + 23);
    ctx.lineTo(x, top + 28);
    ctx.lineTo(x - 5, top + 23);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  // Rule, caret and the heading box
  ctx.fillStyle = WHITE(0.25);
  ctx.fillRect(cx - w / 2, top + 22, w, 1);
  ctx.fillStyle = MINT(0.95);
  ctx.beginPath();
  ctx.moveTo(cx, top + 22);
  ctx.lineTo(cx - 5, top + 29);
  ctx.lineTo(cx + 5, top + 29);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = MINT(0.7);
  ctx.lineWidth = 1.2;
  chamferPanel(ctx, cx - 26, top + 32, 52, 18, 5, false);
  ctx.fillStyle = 'rgba(4,10,12,0.5)';
  ctx.fill();
  ctx.stroke();
  text(ctx, `${String(Math.round(hdg) % 360).padStart(3, '0')}°`, cx, top + 46, `700 15px ${HEAD}`, WHITE(0.97), 'center', 1.5);
}

/**
 * The centre-screen title, as a mission opens: a rule draws out from the middle, a small tag line
 * types above it, the name decodes large across it, a line of detail below; held, then lifted and
 * faded. Shown on arriving in a new country (held under the jet for a few seconds) or at a new
 * world, and once as the flight begins.
 */
function centreReveal(ctx: CanvasRenderingContext2D, t: JetTelemetry, place: Place, earth: { title: string; subtitle: string } | null, now: number, centreY: number): void {
  const w = t.width;
  const h = t.height;
  let key = '';
  let tag = '';
  let title = '';
  let line = '';
  if (t.nearest === 'Earth' && earth) {
    const parts = earth.subtitle.split(',').map((s) => s.trim()).filter(Boolean);
    const country = (parts[parts.length - 1] || earth.title).toUpperCase();
    key = `earth:${country}`;
    tag = t.altKm > 100 ? 'ORBITAL PASS' : 'ENTERING AIRSPACE';
    title = country;
    line = `${place.title}  ·  LST ${clock(t.localTime)}  ·  ${place.grid.replace('GRID ', '')}`;
  } else if (t.nearest) {
    key = `world:${t.nearest}`;
    tag = t.airWorld ? 'ATMOSPHERIC ENTRY' : 'ORBITAL APPROACH';
    title = t.nearest.toUpperCase();
    line = `${formatDistance(t.altKm).toUpperCase()} ABOVE  ·  SOL ${(t.sunDistKm / AU_KM).toFixed(3)} AU  ·  LIGHT-TIME ${lightTime(t.earthDistKm)}`;
  }
  // Hold a new key for a moment before it counts (borders flicker under a fast jet)
  if (key && key !== reveal.key) {
    if (key !== reveal.candidate) {
      reveal.candidate = key;
      reveal.candidateAt = now;
    } else if (now - reveal.candidateAt > (reveal.key ? 2.5 : 1.2)) {
      reveal.key = key;
      reveal.shownAt = now;
      reveal.tag = tag;
      reveal.title = title;
      reveal.line = line;
    }
  }
  const age = now - reveal.shownAt;
  const DUR = 5;
  if (age < 0 || age > DUR || !reveal.title) return;
  // The detail line keeps updating (the clock runs) while the title holds
  if (key === reveal.key) reveal.line = line;
  const cx = w / 2;
  const cy = centreY;
  const fs = Math.min(64, w / 14, h / 12);
  // The tag sits clear above the title's capitals
  const tagY = cy - 12 - fs * 0.72 - 14;
  const out = age > DUR - 0.9 ? ease((age - (DUR - 0.9)) / 0.9) : 0;
  ctx.save();
  ctx.globalAlpha = 1 - out;
  ctx.translate(0, -out * 18);
  // Backdrop: a soft dark band so the title reads over a bright sky
  const band = ctx.createLinearGradient(0, tagY - 30, 0, cy + 50);
  band.addColorStop(0, 'rgba(4,10,12,0)');
  band.addColorStop(0.5, `rgba(4,10,12,${0.38 * ease(age / 0.4)})`);
  band.addColorStop(1, 'rgba(4,10,12,0)');
  ctx.fillStyle = band;
  ctx.fillRect(0, tagY - 30, w, cy + 50 - (tagY - 30));
  // The rule drawing out from the centre, with end ticks
  const half = Math.min(w * 0.36, 460) * ease(age / 0.45);
  ctx.fillStyle = MINT(0.8);
  ctx.fillRect(cx - half, cy, half * 2, 1);
  ctx.fillRect(cx - half, cy - 4, 1, 9);
  ctx.fillRect(cx + half, cy - 4, 1, 9);
  // Tag line, typed
  const tagAge = age - 0.25;
  if (tagAge > 0) {
    const typed = reveal.tag.slice(0, Math.floor(tagAge / 0.03));
    const tw = text(ctx, `◢  ${typed}`, cx, tagY, `600 12px ${MONO}`, AMBER(0.95), 'center', 6);
    if (typed.length < reveal.tag.length || Math.floor(now * 3) % 2 === 0) {
      ctx.fillStyle = AMBER(0.95);
      ctx.fillRect(cx + tw / 2 + 4, tagY - 10, 7, 12);
    }
  }
  // The title: a chromatic split as it lands, then clean
  const tAge = age - 0.4;
  if (tAge > 0) {
    const shown = decode(reveal.title, tAge, 0.045, 0.0);
    const font = `700 ${fs}px ${HEAD}`;
    const glitch = Math.max(0, 1 - tAge / 0.35);
    if (glitch > 0) {
      text(ctx, shown, cx - 6 * glitch, cy - 12, font, `rgba(255, 80, 90, ${0.5 * glitch})`, 'center', 14);
      text(ctx, shown, cx + 6 * glitch, cy - 12, font, `rgba(80, 220, 255, ${0.5 * glitch})`, 'center', 14);
    }
    text(ctx, shown, cx, cy - 12, font, WHITE(0.98), 'center', 14);
  }
  // Detail line under the rule
  const lAge = age - 0.9;
  if (lAge > 0) text(ctx, decode(reveal.line, lAge, 0.012, 0), cx, cy + 22, `500 12px ${MONO}`, WHITE(0.78), 'center', 2);
  ctx.restore();
}

/** Ground ahead / heat: a tactical warning box, hazard-striped, pulsing. Returns whether drawn. */
function warning(ctx: CanvasRenderingContext2D, t: JetTelemetry, now: number): boolean {
  if (!t.warning) return false;
  const w = t.width;
  const h = t.height;
  const label = t.warning === 1 ? 'PULL UP' : 'HEAT  ·  SOLAR CORONA';
  const pulse = 0.55 + 0.45 * Math.abs(Math.sin(now * (t.warning === 1 ? 9 : 5)));
  const cx = w / 2;
  const cy = h * 0.64;
  ctx.save();
  ctx.font = `700 26px ${HEAD}`;
  ctx.letterSpacing = '10px';
  const tw = ctx.measureText(label).width + 60;
  ctx.letterSpacing = '0px';
  const bx = cx - tw / 2;
  const by = cy - 26;
  ctx.fillStyle = `rgba(40, 6, 6, ${0.55 * pulse})`;
  chamferPanel(ctx, bx, by, tw, 40, 10, false);
  ctx.fill();
  ctx.strokeStyle = `rgba(255, 90, 80, ${pulse})`;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Hazard stripes along the top and bottom edges
  ctx.save();
  ctx.beginPath();
  ctx.rect(bx, by - 8, tw, 5);
  ctx.rect(bx, by + 43, tw, 5);
  ctx.clip();
  ctx.fillStyle = `rgba(255, 90, 80, ${0.85 * pulse})`;
  const shift = (now * 30) % 12;
  for (let sx = bx - 20 + shift; sx < bx + tw + 20; sx += 12) {
    ctx.beginPath();
    ctx.moveTo(sx, by + 50);
    ctx.lineTo(sx + 6, by + 50);
    ctx.lineTo(sx + 26, by - 10);
    ctx.lineTo(sx + 20, by - 10);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  text(ctx, label, cx + 5, cy + 2, `700 26px ${HEAD}`, `rgba(255, 120, 105, ${0.6 + 0.4 * pulse})`, 'center', 10);
  // Chevrons closing in from both sides
  const k = (now * 1.6) % 1;
  for (const s of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const off = tw / 2 + 24 + ((i + 1 - k) % 3) * 16;
      const ax = cx + s * off;
      ctx.strokeStyle = `rgba(255, 90, 80, ${0.25 + 0.25 * i})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ax + s * 8, cy - 16);
      ctx.lineTo(ax, cy - 6);
      ctx.lineTo(ax + s * 8, cy + 4);
      ctx.stroke();
    }
  }
  ctx.restore();
  return true;
}

/**
 * Draws the tactical overlay (desktop and tablet). `earth` is the place name under the jet when
 * over Earth (null elsewhere). Returns the top of the flight card (for anything stacked above).
 */
/**
 * The layout for a screen: how much the cards are scaled (1 at 1280x720; smaller on a small
 * window or tablet, larger on a big monitor), their margin, and whether they sit at the top (a
 * touch screen keeps its bottom corners for the thumbs: the stick and the throttle are there).
 */
export function tacticalLayout(w: number, h: number, touch: boolean): { k: number; pad: number; top: boolean; tape: boolean } {
  // By the screen's size; but on a narrow or upright screen, as large as the two cards still fit
  // side by side (they are ~640 px wide together at 1x, plus margins), so text stays readable
  const byScreen = Math.min(w / 1280, h / 720);
  const byFit = Math.min(0.9, (w - 120) / 640, h / 600);
  const k = Math.max(0.58, Math.min(1.35, Math.max(byScreen, byFit)));
  return { k, pad: Math.max(14, Math.round(34 * k)), top: touch, tape: w >= 700 };
}

let touchScreen: boolean | null = null;
function isTouch(): boolean {
  if (touchScreen === null && typeof window !== 'undefined') {
    touchScreen = !!(window.matchMedia?.('(pointer: coarse)').matches || navigator.maxTouchPoints > 0) && !window.matchMedia?.('(pointer: fine)').matches;
  }
  return !!touchScreen;
}

/**
 * Draws the tactical overlay (desktop and tablet). `earth` is the place name under the jet when
 * over Earth (null elsewhere); `bottomInset` the height of the map credits; `travel` a line of
 * travel status (a transit, the speed tier) shown by the flight card, or ''.
 */
export function drawTactical(ctx: CanvasRenderingContext2D, t: JetTelemetry, earth: { title: string; subtitle: string } | null, bottomInset: number, travel = ''): void {
  const now = performance.now() / 1000;
  if (startT < 0) startT = now;
  const w = t.width;
  const h = t.height;
  const L = tacticalLayout(w, h, isTouch());
  ctx.save();
  // No canvas shadows: blurred text shadows are the costliest thing a 2D canvas draws, and the
  // cards' own dark panels give the contrast
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
  const place = describePlace(t, earth);
  // Each card is drawn about its own anchor corner, scaled
  const LOC_H = 122;
  const FLT_H = 140;
  const tapeTop = 58 * Math.max(0.8, Math.min(1.2, L.k));
  const topY = (L.tape ? tapeTop + 64 * L.k : 70) + 8;
  const locBottom = L.top ? topY + LOC_H * L.k : h - Math.max(40, bottomInset + 12);
  const fltBottom = L.top ? topY + (FLT_H + 20) * L.k : locBottom;
  ctx.save();
  ctx.translate(L.pad, locBottom);
  ctx.scale(L.k, L.k);
  locationCard(ctx, t, place, now, 0, 0, (w / 2 - L.pad - 170 * L.k) / L.k);
  ctx.restore();
  ctx.save();
  ctx.translate(w - L.pad, fltBottom);
  ctx.scale(L.k, L.k);
  const cardTop = flightCard(ctx, t, now, 0, 0);
  if (travel) text(ctx, travel, 0, L.top ? 20 : cardTop - 12, `600 10px ${MONO}`, AMBER(0.92), 'right', 1.5);
  ctx.restore();
  if (L.tape) {
    ctx.save();
    ctx.translate(w / 2, tapeTop);
    ctx.scale(L.k, L.k);
    headingTape(ctx, t, 0, 0);
    ctx.restore();
  }
  // The title sits in the upper third, or under the cards when they are at the top
  centreReveal(ctx, t, place, earth, now, L.top ? Math.max(h * 0.4, fltBottom + 150) : h * 0.3);
  warning(ctx, t, now);
  ctx.restore();
}

/** Forget the animation state (leaving the flight). */
export function resetTactical(): void {
  loc.title = '';
  loc.shownAt = -10;
  climb = { lastAlt: NaN, lastT: 0, rate: 0 };
  startT = -1;
  reveal.key = '';
  reveal.candidate = '';
  reveal.shownAt = -10;
  mach.last = 0;
  mach.burstAt = -10;
  gPeak.value = 1;
}
