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
import type { JetTelemetry } from './JetTelemetry';
import { formatDistance, formatSpeed } from './worlds';

const MINT = (a: number): string => `rgba(109, 252, 192, ${a})`;
const WHITE = (a: number): string => `rgba(240, 244, 242, ${a})`;
const AMBER = (a: number): string => `rgba(244, 205, 114, ${a})`;
const CYAN = (a: number): string => `rgba(120, 220, 255, ${a})`;
const RED = (a: number): string => `rgba(255, 108, 96, ${a})`;
const HEAD = '"Rajdhani", "Montserrat", system-ui, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
const AU_KM = 149597870.7;
const C_KMS = 299792.458;

export type GpwsMode = 'none' | 'caution' | 'pull-up';

export interface AltitudeTelemetry {
  aglM: number;
  mslM: number;
  terrainM: number;
  hasSeparateMsl: boolean;
  terrainWarning: boolean;
  gpwsMode: GpwsMode;
}

/**
 * Resolve AGL/MSL altitude and GPWS terrain warning telemetry cleanly, falling back safely
 * to `altKm` / `warning` when older partial telemetry fixtures omit the terrain fields.
 */
export function resolveAltitudeTelemetry(t: JetTelemetry): AltitudeTelemetry {
  const fallbackM = Math.max(0, t.altKm * 1000);
  const aglM = typeof t.altitudeAglM === 'number' && Number.isFinite(t.altitudeAglM)
    ? Math.max(0, t.altitudeAglM)
    : fallbackM;
  const terrainM = typeof t.terrainElevationM === 'number' && Number.isFinite(t.terrainElevationM)
    ? t.terrainElevationM
    : 0;
  const mslM = typeof t.altitudeMslM === 'number' && Number.isFinite(t.altitudeMslM)
    ? t.altitudeMslM
    : aglM + terrainM;
  const hasSeparateMsl =
    (typeof t.altitudeMslM === 'number' && Number.isFinite(t.altitudeMslM)) ||
    (typeof t.terrainElevationM === 'number' && Number.isFinite(t.terrainElevationM));
  const gpwsMode: GpwsMode =
    t.gpwsMode ?? (t.warning === 1 ? 'pull-up' : t.terrainWarning ? 'pull-up' : 'none');
  const terrainWarning = Boolean(t.terrainWarning) || gpwsMode !== 'none' || t.warning === 1;
  return { aglM, mslM, terrainM, hasSeparateMsl, terrainWarning, gpwsMode };
}

/** Format an altitude in metres cleanly (metres below 100 km, km above). */
export function formatAltitudeMeters(meters: number): string {
  const rounded = Math.round(meters);
  if (Math.abs(rounded) < 100_000) return `${rounded.toLocaleString('en-US')} M`;
  return `${(meters / 1000).toFixed(1)} KM`;
}

/** Measure string width under a font + letter-spacing (defensive when mock ctx ignores letterSpacing). */
function measureSpacedText(ctx: CanvasRenderingContext2D, s: string, font: string, spacing = 0): number {
  ctx.font = font;
  ctx.letterSpacing = `${spacing}px`;
  const w = ctx.measureText(s).width;
  ctx.letterSpacing = '0px';
  return w;
}

/** Truncate `raw` with a trailing ellipsis so it never overflows `maxW` pixels. */
function fitCanvasText(
  ctx: CanvasRenderingContext2D,
  raw: string,
  maxW: number,
  font: string,
  spacing = 0,
): string {
  if (!raw || maxW <= 8) return '';
  ctx.font = font;
  ctx.letterSpacing = `${spacing}px`;
  if (ctx.measureText(raw).width <= maxW) {
    ctx.letterSpacing = '0px';
    return raw;
  }
  let s = raw;
  while (s.length > 1 && ctx.measureText(`${s}…`).width > maxW) {
    s = s.slice(0, -1);
  }
  ctx.letterSpacing = '0px';
  return `${s.trimEnd()}…`;
}

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
  const titleW30 = measureSpacedText(ctx, p.title, `700 30px ${HEAD}`, 3);
  const safeMaxW = Math.max(210, Math.min(500, maxW));
  const w = Math.max(Math.min(300, safeMaxW), Math.min(safeMaxW, titleW30 + 62));
  const h = 122;
  const y = bottom - h;
  const innerW = Math.max(120, w - 24);
  const titleBudget = Math.max(100, innerW - 18);

  // Pick the largest display font size that lets long names (e.g. KHUMBU PASANGLAMHU) fit cleanly inside the box
  const titleTiers: Array<[number, number]> = [
    [30, 3],
    [26, 2.4],
    [23, 1.8],
    [20, 1.3],
    [18, 0.9],
  ];
  let titlePx = 18;
  let titleSpace = 0.9;
  for (const [px, sp] of titleTiers) {
    if (measureSpacedText(ctx, p.title, `700 ${px}px ${HEAD}`, sp) <= titleBudget) {
      titlePx = px;
      titleSpace = sp;
      break;
    }
  }
  const titleFont = `700 ${titlePx}px ${HEAD}`;

  ctx.save();
  ctx.globalAlpha = 0.35 + 0.65 * k;
  panelBg(ctx, x, y, w, h, false);
  brackets(ctx, x, y, w, h, k, MINT(0.55));
  // Accent bar on the left, pulsing softly
  ctx.fillStyle = MINT(0.55 + 0.35 * Math.sin(now * 2.2) ** 2);
  ctx.fillRect(x - 6, y + 10, 2, h - 20);

  // Clip all interior copy strictly inside the panel bounds so text can never overflow the right border
  ctx.save();
  ctx.beginPath();
  ctx.rect(x + 2, y + 2, w - 4, h - 4);
  ctx.clip();

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
  const gridFont = `500 11px ${MONO}`;
  const gridRaw = decode(p.grid, age, 0.018, 0.2);
  const grid = fitCanvasText(ctx, gridRaw, Math.max(60, w - 76), gridFont, 0.8);
  const gw = text(ctx, grid, x + w - 12, hy + 1, gridFont, WHITE(0.8), 'right', 0.8);
  const ruleSpan = Math.max(0, w - 64 - gw - 24);
  if (ruleSpan > 4) {
    ctx.strokeStyle = MINT(0.3);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 64, hy - 3);
    ctx.lineTo(x + 64 + ruleSpan * k, hy - 3);
    ctx.stroke();
  }

  // Title, decoding cleanly within `titleBudget`, with an inset block cursor
  const rawTitle = decode(p.title, age, 0.025, 0.08);
  const shownTitle = fitCanvasText(ctx, rawTitle, titleBudget, titleFont, titleSpace);
  const titleBaselineY = y + 58 - Math.round((30 - titlePx) * 0.2);
  const tw = text(ctx, shownTitle, x + 12, titleBaselineY, titleFont, WHITE(0.97), 'left', titleSpace);
  const cursorW = Math.max(7, Math.round(titlePx * 0.34));
  const cursorH = Math.max(15, Math.round(titlePx * 0.78));
  const cursorX = x + 15 + tw;
  if ((age < 1.4 || blink) && cursorX + cursorW <= x + w - 8) {
    ctx.fillStyle = MINT(age < 1.4 ? 0.9 : 0.5);
    ctx.fillRect(cursorX, titleBaselineY - cursorH + 2, cursorW, cursorH);
  }

  const subFont = `600 13px ${HEAD}`;
  const shownSub = fitCanvasText(ctx, decode(p.subtitle.toUpperCase(), age, 0.01, 0.3), innerW, subFont, 1.6);
  text(ctx, shownSub, x + 12, y + 78, subFont, WHITE(0.72), 'left', 1.6);

  // Coordinates: the last figures tick (the fix updating)
  const coordsFont = `500 11.5px ${MONO}`;
  const shownCoords = fitCanvasText(ctx, decode(p.coords, age, 0.012, 0.4), innerW, coordsFont, 0.4);
  text(ctx, shownCoords, x + 12, y + 97, coordsFont, MINT(0.92), 'left', 0.4);

  // Footer: signal bars, local solar time, mission elapsed
  const fy = y + 113;
  for (let i = 0; i < 6; i++) {
    const on = i < 4 + Math.round(Math.sin(now * 1.3 + i) * 0.5 + 0.5);
    ctx.fillStyle = on ? MINT(0.75) : WHITE(0.15);
    ctx.fillRect(x + 12 + i * 5, fy - 2 - i * 1.2, 3, 3 + i * 1.2);
  }
  const lst = t.nearest ? `LST ${clock(t.localTime)}` : '';
  const footerRaw = age < 1.1
    ? Array.from({ length: 6 }, () => Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0')).join(' ')
    : `${lst}${lst ? '   ' : ''}T+${elapsed(now - startT)}`;
  const footerFont = `500 10px ${MONO}`;
  const footer = fitCanvasText(ctx, footerRaw, Math.max(60, w - 58), footerFont, 0.8);
  text(ctx, footer, x + 48, fy, footerFont, age < 1.1 ? MINT(0.55) : WHITE(0.58), 'left', 0.8);
  ctx.restore();

  // A compact position reticle on the card's corner: a dashed ring turning, locking in as the card lands
  {
    const rx = x + w + 20;
    const ry = y + 20;
    const r = 9 + 8 * (1 - k);
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
      ctx.moveTo(rx + dx * (r + 2.5), ry + dy * (r + 2.5));
      ctx.lineTo(rx + dx * (r + 6.5), ry + dy * (r + 6.5));
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
  const w = 342;
  const h = 176;
  const x = right - w;
  const y = bottom - h;
  const space = !t.airWorld;
  const altInfo = resolveAltitudeTelemetry(t);

  // Climb rate (m/s): prefer authoritative verticalSpeedMps when supplied, else barometric MSL derivative
  if (typeof t.verticalSpeedMps === 'number' && Number.isFinite(t.verticalSpeedMps)) {
    const targetRate = t.verticalSpeedMps;
    climb.rate += (targetRate - climb.rate) * Math.min(1, now > climb.lastT ? (now - climb.lastT) * 6 : 1);
  } else if (Number.isFinite(climb.lastAlt) && now > climb.lastT) {
    const r = ((altInfo.mslM / 1000 - climb.lastAlt) * 1000) / (now - climb.lastT);
    if (Math.abs(r) < 1e5) climb.rate += (r - climb.rate) * Math.min(1, (now - climb.lastT) * 2);
  }
  climb.lastAlt = altInfo.mslM / 1000;
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
  const frameColour = altInfo.gpwsMode === 'pull-up'
    ? RED(0.92)
    : altInfo.gpwsMode === 'caution'
      ? AMBER(0.85)
      : burst < 0.6
        ? WHITE(0.95 - burst)
        : MINT(0.5);
  brackets(ctx, x, y, w, h, boot, frameColour);
  ctx.fillStyle = altInfo.terrainWarning
    ? RED(0.6 + 0.35 * Math.sin(now * 8) ** 2)
    : MINT(0.55 + 0.35 * Math.sin(now * 2.2 + 1) ** 2);
  ctx.fillRect(right + 4, y + 10, 2, h - 20);
  if (burst < 0.5) {
    ctx.fillStyle = WHITE(0.22 * (1 - burst / 0.5));
    chamferPanel(ctx, x, y, w, h, 14, true);
    ctx.fill();
  }
  // Load factor, peak G, AoA & T/W in header bar
  const g = Math.abs(t.gLoad);
  const livePeak = t.gPeak !== undefined ? Math.max(gPeak.value, t.gPeak) : gPeak.value;
  if (g >= livePeak) {
    gPeak.value = g;
    gPeak.at = now;
  } else if (now - gPeak.at > 4) {
    gPeak.value += (g - gPeak.value) * 0.02;
  } else {
    gPeak.value = livePeak;
  }
  if (!space) {
    const gc = g > 9 ? 'rgba(255, 108, 108, 0.96)' : g > 7 ? AMBER(0.95) : g > 4 ? WHITE(0.9) : WHITE(0.62);
    text(ctx, `G ${t.gLoad.toFixed(1)}`, x + 16, y + 15, `600 10px ${MONO}`, gc, 'left', 1);
    text(ctx, `PK ${gPeak.value.toFixed(1)}`, x + 64, y + 15, `500 10px ${MONO}`, WHITE(0.48), 'left', 1);
    if (t.aoaDeg !== undefined) {
      text(ctx, `α ${t.aoaDeg.toFixed(1)}°`, x + 124, y + 15, `600 10px ${MONO}`, t.alphaWarning ? AMBER(0.95) : MINT(0.85), 'left', 0.5);
    }
    if (t.twRatio !== undefined) {
      text(ctx, `T/W ${t.twRatio.toFixed(2)}`, right - 50, y + 15, `600 10px ${MONO}`, t.twRatio >= 1 ? CYAN(0.92) : WHITE(0.55), 'right', 0.5);
    }
  }

  // Altitude tape on the right edge: barometric MSL above transition (1,500 m AGL), radar AGL low-level
  const highAltMode = !space && altInfo.aglM >= 1500 && altInfo.gpwsMode === 'none';
  const tapeX = right - 34;
  const tapeTop = y + 16;
  const tapeH = h - 44;
  const altM = space ? t.altKm * 1000 : highAltMode ? altInfo.mslM : altInfo.aglM;
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
    const edge = 1 - Math.min(1, Math.abs(ty - midY) / (tapeH / 2)) ** 2;
    ctx.fillStyle = WHITE((major ? 0.65 : 0.3) * edge);
    ctx.fillRect(tapeX, ty, major ? 12 : 6, 1);
  }
  ctx.restore();
  // The caret on the tape
  ctx.fillStyle = altInfo.gpwsMode === 'pull-up' ? RED(0.98) : altInfo.gpwsMode === 'caution' ? AMBER(0.95) : MINT(0.95);
  ctx.beginPath();
  ctx.moveTo(tapeX - 2, midY);
  ctx.lineTo(tapeX - 8, midY - 4);
  ctx.lineTo(tapeX - 8, midY + 4);
  ctx.closePath();
  ctx.fill();
  // Climb arrow by the tape (m/s)
  const rising = climb.rate > 0.6;
  const falling = climb.rate < -0.6;
  if (rising || falling) {
    const len = Math.min(tapeH / 2 - 6, 6 + Math.log10(1 + Math.abs(climb.rate)) * 14);
    ctx.fillStyle = rising ? MINT(0.8) : AMBER(0.85);
    ctx.fillRect(tapeX + 18, rising ? midY - len : midY, 2, len);
  }

  const vx = tapeX - 16;
  const row = (label: string, value: string | number, unit: string, yy: number, size: number, colour: string, labelColour = WHITE(0.62)): void => {
    text(ctx, label, x + 16, yy, `600 12px ${HEAD}`, labelColour, 'left', 2.2);
    const uw = unit ? text(ctx, unit, vx, yy, `600 12px ${HEAD}`, WHITE(0.62), 'right', 1.5) + 5 : 0;
    if (typeof value === 'number') rollingNumber(ctx, value, vx - uw, yy, size, colour);
    else text(ctx, value, vx - uw, yy, `700 ${size}px ${HEAD}`, colour, 'right', 1);
  };

  // Primary altitude: barometric MSL above transition (1,500 m AGL, e.g. mountain peaks & cruise),
  // radar AGL below transition (urban / low-level terrain clearance), RANGE in space.
  const aglColour =
    !space && altInfo.gpwsMode === 'pull-up'
      ? RED(0.98)
      : !space && (altInfo.gpwsMode === 'caution' || (altInfo.aglM < 120 && !t.onGround))
        ? AMBER(0.96)
        : WHITE(0.97);
  if (space) {
    if (t.altKm < 100) row('RANGE', t.altKm * 1000, 'M', y + 40, 24, WHITE(0.97));
    else {
      const alt = formatDistance(t.altKm).toUpperCase().split(' ');
      row('RANGE', alt[0], alt[1] ?? '', y + 40, 24, WHITE(0.97));
    }
  } else {
    const primaryLabel = highAltMode ? 'MSL' : 'AGL';
    const primaryM = highAltMode ? altInfo.mslM : altInfo.aglM;
    const primaryKm = primaryM / 1000;
    const primaryLabelCol = altInfo.terrainWarning ? RED(0.95) : highAltMode ? CYAN(0.9) : MINT(0.86);
    if (primaryKm < 100) row(primaryLabel, primaryM, 'M', y + 40, 24, aglColour, primaryLabelCol);
    else {
      const alt = formatDistance(primaryKm).toUpperCase().split(' ');
      row(primaryLabel, alt[0], alt[1] ?? '', y + 40, 24, aglColour, primaryLabelCol);
    }
    // Secondary row: paired AGL/MSL (left) + explicit vertical speed in M/S & Ps (right)
    const secTxt = highAltMode
      ? `AGL ${formatAltitudeMeters(altInfo.aglM)}`
      : `MSL ${formatAltitudeMeters(altInfo.mslM)}`;
    text(ctx, secTxt, x + 16, y + 56, `600 10px ${MONO}`, highAltMode ? MINT(0.88) : CYAN(0.9), 'left', 0.4);
    const absVs = Math.abs(climb.rate);
    const roundedVs = Math.round(absVs);
    const vsNum = roundedVs === 0 ? '0' : `${climb.rate >= 0 ? '+' : '−'}${roundedVs.toLocaleString('en-US')}`;
    const vs = absVs < 1e4 ? `VS ${vsNum} M/S` : '';
    const psStr =
      t.specificExcessPowerMps !== undefined
        ? `${vs ? ' · ' : ''}Ps ${t.specificExcessPowerMps >= 0 ? '+' : ''}${Math.round(t.specificExcessPowerMps)}${t.specificExcessPowerMps >= 2 ? '▲' : t.specificExcessPowerMps <= -2 ? '▼' : ''}`
        : '';
    if (vs || psStr) {
      const vsCol = absVs < 0.45 ? WHITE(0.68) : climb.rate >= 0 ? MINT(0.82) : AMBER(0.86);
      text(ctx, `${vs}${psStr}`, vx, y + 56, `500 9.5px ${MONO}`, vsCol, 'right', 0.3);
    }
  }

  if (space) {
    const [num, unit] = formatSpeed(t.speedMps).toUpperCase().split(' ');
    row('VEL', num, unit ?? '', y + 82, 24, WHITE(0.97));
    text(ctx, `SUN ${(t.sunDistKm / AU_KM).toFixed(3)} AU`, x + 16, y + 112, `500 11px ${MONO}`, AMBER(0.88), 'left', 0.5);
    text(ctx, t.earthDistKm > 50000 ? `LIGHT-TIME TO EARTH ${lightTime(t.earthDistKm)}` : `EARTH ${formatDistance(t.earthDistKm).toUpperCase()}`, x + 16, y + 132, `500 11px ${MONO}`, CYAN(0.88), 'left', 0.5);
  } else {
    const shownSpdMps = t.iasMps ?? t.speedMps;
    row(t.iasMps !== undefined ? 'IAS' : 'SPD', shownSpdMps * 3.6, 'KM/H', y + 84, 24, WHITE(0.97));
    const kt = Math.round(shownSpdMps * 1.94384).toLocaleString('en-US');
    const tasTxt = t.tasMps !== undefined && Math.abs(t.tasMps - shownSpdMps) > 5 ? `TAS ${Math.round(t.tasMps)} M/S · ` : '';
    text(ctx, `${tasTxt}${kt} KT`, vx, y + 99, `500 10px ${MONO}`, WHITE(0.58), 'right', 0.4);
    // Mach scale to 3
    const segs = 30;
    const sx = x + 16;
    const sw = vx - sx - 70;
    const filled = Math.min(segs, Math.round((t.mach / 3) * segs));
    for (let i = 0; i < segs; i++) {
      const on = i < filled;
      const sup = i >= 10;
      ctx.fillStyle = on ? (sup ? MINT(0.9) : WHITE(0.85)) : WHITE(0.12);
      const hh = i % 10 === 9 ? 9 : 6;
      ctx.fillRect(sx + (i * sw) / segs, y + 138 - hh, sw / segs - 2, hh);
    }
    text(ctx, t.supercruise ? 'SUPERCRUISE' : 'MACH', sx, y + 123, `600 11px ${HEAD}`, t.supercruise ? CYAN(0.92) : WHITE(0.58), 'left', 2);
    text(ctx, t.mach.toFixed(2), vx, y + 141, `700 28px ${HEAD}`, t.mach >= 1 ? MINT(0.98) : WHITE(0.97), 'right', 1);
    if (burst < 2.4) {
      const r = 10 + burst * 260;
      ctx.strokeStyle = WHITE(Math.max(0, 0.7 - burst * 0.9));
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(vx - 30, y + 130, r, Math.PI * 0.95, Math.PI * 1.55);
      ctx.stroke();
      const a = burst < 0.2 ? burst / 0.2 : burst > 1.8 ? (2.4 - burst) / 0.6 : 1;
      const slide = (1 - ease(burst / 0.35)) * 40;
      const regime = t.mach >= 1.2 ? 'SUPERSONIC' : 'TRANSONIC';
      const speedKmh = Math.round(t.speedMps * 3.6).toLocaleString('en-US');
      ctx.save();
      ctx.globalAlpha = a;
      const bannerSub = `MACH ${t.mach.toFixed(2)}  ·  ${regime}  ·  ${speedKmh} KM/H`;
      const bannerW = Math.max(220, measureSpacedText(ctx, bannerSub, `600 10px ${MONO}`, 1.6) + 28);
      const bg = ctx.createLinearGradient(right - bannerW, y - 54, right, y - 54);
      bg.addColorStop(0, 'rgba(4, 10, 14, 0)');
      bg.addColorStop(0.25, 'rgba(4, 10, 14, 0.56)');
      bg.addColorStop(1, 'rgba(4, 10, 14, 0.72)');
      ctx.fillStyle = bg;
      ctx.fillRect(right - bannerW, y - 54, bannerW, 48);
      text(ctx, 'SUPERSONIC', right + slide, y - 14, `700 22px ${HEAD}`, MINT(0.98), 'right', 8);
      text(
        ctx,
        bannerSub,
        right,
        y - 40,
        `600 10px ${MONO}`,
        WHITE(0.92),
        'right',
        1.6,
      );
      ctx.restore();
    }
  }

  // Bottom FBW / Flaps / Brake / AB / Fuel telemetry strip inside the card
  const fy = y + h - 10;
  const fbw = (t.fbwMode ?? 'norm').toUpperCase();
  const flp = (t.flapMode ?? 'auto').toUpperCase();
  const ab = t.abStage ?? (t.boost > 0.66 ? 3 : t.boost > 0.33 ? 2 : t.boost > 0 ? 1 : 0);
  const fuelPct = Math.round(Math.max(0, Math.min(1, t.fuelFrac ?? t.boostEnergy)) * 100);
  const pills = [
    `${fbw}${t.tvcActive ? '+TVC' : ''}`,
    `FLP ${flp === 'COMBAT' ? 'CMB' : flp === 'LAND' ? 'LND' : 'AUTO'}`,
    t.airbrakeActive ? 'BRK' : t.wheelBrakeActive ? 'W-BRK' : '',
    t.supercruise ? 'SUPR' : ab > 0 ? `AB${ab}` : t.abArmed ? 'ARM' : '',
    t.maneuver && t.maneuver !== 'none' ? t.maneuver.toUpperCase() : '',
    `FUEL ${fuelPct}%`,
  ].filter(Boolean);
  ctx.fillStyle = WHITE(0.08);
  ctx.fillRect(x + 14, y + h - 24, w - 28, 1);
  const pillFont = `600 10px ${MONO}`;
  const pillText = fitCanvasText(ctx, pills.join(' · '), w - 32, pillFont, 0.8);
  text(ctx, pillText, x + 16, fy, pillFont, t.maneuver && t.maneuver !== 'none' ? CYAN(0.92) : fuelPct <= 15 ? AMBER(0.95) : MINT(0.82), 'left', 0.8);

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
    const sub = earth.subtitle.trim();
    const isPlaceSub = sub.length > 0 && sub.length <= 40 && sub.includes(',') && !sub.endsWith('.');
    const parts = (isPlaceSub ? sub : earth.title).split(',').map((s) => s.trim()).filter(Boolean);
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

/** Ground ahead / GPWS terrain / heat: a tactical warning box, hazard-striped, pulsing. Returns whether drawn. */
function warning(ctx: CanvasRenderingContext2D, t: JetTelemetry, now: number): boolean {
  const altInfo = resolveAltitudeTelemetry(t);
  const gpwsPullUp =
    altInfo.gpwsMode === 'pull-up' ||
    (altInfo.terrainWarning && altInfo.gpwsMode !== 'caution') ||
    t.warning === 1;
  const gpwsCaution = !gpwsPullUp && altInfo.gpwsMode === 'caution';
  if (!gpwsPullUp && !gpwsCaution && !t.warning && !t.spinWarning) return false;
  const w = t.width;
  const h = t.height;
  const label = gpwsPullUp
    ? 'TERRAIN  ·  PULL UP'
    : gpwsCaution
      ? 'CAUTION  ·  TERRAIN'
      : t.warning === 2
        ? 'HEAT  ·  SOLAR CORONA'
        : 'SPIN  ·  STICK FWD + OPP Q/E';
  const subLabel =
    gpwsPullUp || gpwsCaution
      ? `AGL ${formatAltitudeMeters(altInfo.aglM)}  ·  MSL ${formatAltitudeMeters(altInfo.mslM)}`
      : '';
  const urgent = gpwsPullUp || t.spinWarning;
  const isAmberOnly = gpwsCaution;
  const pulse = 0.55 + 0.45 * Math.abs(Math.sin(now * (urgent ? 9 : 5)));
  const cx = w / 2;
  const cy = h * 0.62;
  const strokeRgb = isAmberOnly ? '244, 205, 114' : '255, 90, 80';
  const bgRgb = isAmberOnly ? '38, 26, 4' : '42, 6, 6';
  const fgRgb = isAmberOnly ? '250, 218, 134' : '255, 126, 110';
  ctx.save();
  const labelFont = `700 ${w < 960 ? 21 : 25}px ${HEAD}`;
  const labelSpacing = w < 960 ? 6 : 9;
  const tw = Math.min(w - 64, measureSpacedText(ctx, label, labelFont, labelSpacing) + 54);
  const bx = cx - tw / 2;
  const by = cy - 26;
  ctx.fillStyle = `rgba(${bgRgb}, ${0.68 * pulse})`;
  chamferPanel(ctx, bx, by, tw, 40, 10, false);
  ctx.fill();
  ctx.strokeStyle = `rgba(${strokeRgb}, ${pulse})`;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Hazard stripes along the top and bottom edges
  ctx.save();
  ctx.beginPath();
  ctx.rect(bx, by - 8, tw, 5);
  ctx.rect(bx, by + 43, tw, 5);
  ctx.clip();
  ctx.fillStyle = `rgba(${strokeRgb}, ${0.85 * pulse})`;
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
  text(ctx, label, cx + labelSpacing * 0.5, cy + 2, labelFont, `rgba(${fgRgb}, ${0.65 + 0.35 * pulse})`, 'center', labelSpacing);
  if (subLabel) {
    const subFont = `600 10.5px ${MONO}`;
    const subW = measureSpacedText(ctx, subLabel, subFont, 1.2) + 20;
    ctx.fillStyle = 'rgba(6, 10, 14, 0.78)';
    ctx.fillRect(cx - subW / 2, by + 52, subW, 18);
    ctx.strokeStyle = `rgba(${strokeRgb}, ${0.45 * pulse})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - subW / 2, by + 52, subW, 18);
    text(ctx, subLabel, cx, by + 64, subFont, WHITE(0.94), 'center', 1.2);
  }
  // Chevrons closing in from both sides
  const k = (now * 1.6) % 1;
  for (const s of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const off = tw / 2 + 20 + ((i + 1 - k) % 3) * 14;
      const ax = cx + s * off;
      ctx.strokeStyle = `rgba(${strokeRgb}, ${0.25 + 0.25 * i})`;
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
 * The layout for a screen: how much the cards are scaled (1 at 1280x720; smaller on a small
 * window or tablet, larger on a big monitor), their margin, and whether they sit at the top (a
 * touch screen keeps its bottom corners for the thumbs: the stick and the throttle are there).
 */
export function tacticalLayout(w: number, h: number, touch: boolean): { k: number; pad: number; top: boolean; tape: boolean } {
  // By the screen's size; but on a narrow or upright screen, as large as the two cards still fit
  // side by side (they are ~660 px wide together at 1x, plus margins), so text stays readable
  const byScreen = Math.min(w / 1280, h / 720);
  const byFit = Math.min(0.9, (w - 120) / 660, h / 600);
  const k = Math.max(0.58, Math.min(1.35, Math.max(byScreen, byFit)));
  return { k, pad: Math.max(14, Math.round(34 * k)), top: touch, tape: w >= 700 };
}

/** Bottom Y coordinate (CSS px) of the top heading tape & readout box, used to place radio subtitles safely underneath. */
export function tacticalHeadingBottom(w: number, h: number, touch: boolean, topInset = 0): number {
  const L = tacticalLayout(w, h, touch);
  const tapeTop = (L.top ? Math.max(58, topInset + 50) : 58) * Math.max(0.8, Math.min(1.2, L.k));
  return L.tape ? Math.ceil(tapeTop + 52 * L.k) : Math.ceil(topInset + 54);
}

export interface HudRect {
  l: number;
  t: number;
  r: number;
  b: number;
}

/**
 * Screen-space rectangles occupied by tactical HUD panels (`LOC` card, `FLT` card, bottom-center
 * throttle & PSM hint lane, top-left airframe status, top-right controls, and heading tape) so
 * floating sky markers (`SATURN`, `JWST`, `ARTEMIS II`, etc.) never draw over/inside HUD boxes.
 */
export function tacticalExclusionZones(
  w: number,
  h: number,
  bottomInset: number,
  topInset = 0,
  touch = isTouch(),
): HudRect[] {
  const L = tacticalLayout(w, h, touch);
  const LOC_H = 122;
  const FLT_H = 176;
  const FLT_W = 342;
  const tapeTop = (L.top ? Math.max(58, topInset + 50) : 58) * Math.max(0.8, Math.min(1.2, L.k));
  const topClear = L.top ? Math.max(topInset + (w < 820 ? 132 : 96), (L.tape ? tapeTop + 62 * L.k : 70) + 12) : 0;
  const locBottom = L.top ? topClear + LOC_H * L.k : h - Math.max(40, bottomInset + 12);
  const fltBottom = L.top ? topClear + (FLT_H + 16) * L.k : locBottom;
  const centerMarginPx = Math.max(130, 175 * L.k);
  const byCenter = (w / 2 - L.pad - centerMarginPx) / L.k - 36;
  const byFlightCard = (w - 2 * L.pad - FLT_W * L.k - 56) / L.k;
  const locMaxW = Math.max(210, Math.min(500, Math.min(byCenter, byFlightCard)));

  const zones: HudRect[] = [
    // Bottom-left (or top-left on touch) LOC card + accent bar + corner reticle
    {
      l: Math.max(0, L.pad - 16),
      t: locBottom - LOC_H * L.k - 14,
      r: L.pad + (locMaxW + 42) * L.k,
      b: locBottom + 16,
    },
    // Bottom-right (or top-right on touch) FLT card + right accent bar
    {
      l: w - L.pad - FLT_W * L.k - 14,
      t: fltBottom - FLT_H * L.k - 18,
      r: w,
      b: fltBottom + 16,
    },
    // Bottom-center throttle bar, mode strip, PSM ENVELOPE / maneuver hint bar & map credits
    {
      l: Math.max(0, w / 2 - 240),
      t: h - Math.max(114, bottomInset + 100),
      r: Math.min(w, w / 2 + 240),
      b: h,
    },
    // Top-left airframe status box
    {
      l: 0,
      t: 0,
      r: Math.min(w * 0.45, 348),
      b: topInset + 132,
    },
    // Top-right icon controls bar
    {
      l: Math.max(0, w - 580),
      t: 0,
      r: w,
      b: topInset + 64,
    },
  ];

  if (L.tape) {
    zones.push({
      l: w / 2 - 245 * L.k,
      t: Math.max(0, tapeTop - 12),
      r: w / 2 + 245 * L.k,
      b: tapeTop + 62 * L.k,
    });
  }
  if (w < 560 || h < 500) {
    zones.push({
      l: 0,
      t: h - Math.max(96, bottomInset + 86),
      r: w,
      b: h,
    });
  }
  return zones;
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
export function drawTactical(ctx: CanvasRenderingContext2D, t: JetTelemetry, earth: { title: string; subtitle: string } | null, bottomInset: number, travel = '', topInset = 0): void {
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
  const FLT_H = 176;
  const FLT_W = 342;
  const tapeTop = (L.top ? Math.max(58, topInset + 50) : 58) * Math.max(0.8, Math.min(1.2, L.k));
  const topClear = L.top ? Math.max(topInset + (w < 820 ? 132 : 96), (L.tape ? tapeTop + 62 * L.k : 70) + 12) : 0;
  const locBottom = L.top ? topClear + LOC_H * L.k : h - Math.max(40, bottomInset + 12);
  const fltBottom = L.top ? topClear + (FLT_H + 16) * L.k : locBottom;
  // Keep LOC card + its right reticle strictly clear of both the center throttle/prompt lane and the flight card
  const centerMarginPx = Math.max(130, 175 * L.k);
  const byCenter = (w / 2 - L.pad - centerMarginPx) / L.k - 36;
  const byFlightCard = (w - 2 * L.pad - FLT_W * L.k - 56) / L.k;
  const locMaxW = Math.max(210, Math.min(byCenter, byFlightCard));
  ctx.save();
  ctx.translate(L.pad, locBottom);
  ctx.scale(L.k, L.k);
  locationCard(ctx, t, place, now, 0, 0, locMaxW);
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
  // The title sits clearly below the top heading tape + radio comms lane, or below the top cards on tablets
  centreReveal(ctx, t, place, earth, now, L.top ? Math.min(h * 0.62, Math.max(h * 0.44, fltBottom + 96)) : h * 0.35);
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
