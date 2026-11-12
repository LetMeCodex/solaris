import { FpsCounter } from '../ui/FpsCounter';
import { IconButton, type IconName } from './HudIcons';
import { WORLD_SCALE, WORLD_SCALE_KEY, WORLD_SCALE_OPTIONS } from '../rendering/Scale';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { JetController, JetTelemetry } from './JetController';
import { AIRFRAME_KEY } from './JetModel';
import { DEEP_TIME_SCENES } from '../explorer/DeepTime';
import { JET_RESUME_KEY, formatDistance, formatEta, formatSpeed } from './worlds';
import { searchEarthPlaces } from '../explorer/EarthSearch';
import { placeNameAt } from '../explorer/ReverseGeocode';
import { drawTactical } from './TacticalHud';
import { Landmark, landmarksFor } from '../explorer/Landmarks';
import { CatalogueManager } from '../data/CatalogueManager';

/**
 * The SX-1's head-up display, drawn on a canvas in the same frame the scene renders (so every
 * symbol sits exactly on what it marks). Mint phosphor for flight symbology, amber for the
 * target, red for warnings: the Solaris HUD palette.
 */

const MINT = 'rgba(109, 252, 192, 0.92)';
const MINT_DIM = 'rgba(109, 252, 192, 0.45)';
const AMBER = 'rgba(244, 205, 114, 0.95)';
const AMBER_DIM = 'rgba(244, 205, 114, 0.5)';
const RED = 'rgba(255, 122, 102, 0.98)';
const TEXT_DIM = 'rgba(238, 233, 222, 0.6)';
const MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

function drawFull(ctx: CanvasRenderingContext2D, t: JetTelemetry, dpr: number): void {
  const w = t.width;
  const h = t.height;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(109, 252, 192, 0.55)';
  ctx.shadowBlur = 6;

  const cx = t.nose?.x ?? w / 2;
  const cy = t.nose?.y ?? h / 2;
  const unit = Math.min(w, h);
  const font = (px: number, weight = 500): string => `${weight} ${px}px ${MONO}`;

  // --- Speed vignette (boost): faint radial rays at the edges
  if (t.boost > 0 || t.speedMps > 2.9e7) {
    ctx.save();
    ctx.shadowBlur = 0;
    const g = ctx.createRadialGradient(w / 2, h / 2, unit * 0.35, w / 2, h / 2, unit * 0.85);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, t.boost > 0 ? 'rgba(255,140,60,0.10)' : 'rgba(140,180,255,0.08)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  // --- Pitch ladder against the local horizon
  ctx.strokeStyle = MINT;
  ctx.fillStyle = MINT;
  ctx.lineWidth = 1.4;
  if (t.hasHorizon) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((-t.rollDeg * Math.PI) / 180);
    ctx.beginPath();
    ctx.rect(-unit * 0.32, -unit * 0.3, unit * 0.64, unit * 0.6);
    ctx.clip();
    const ppd = t.pxPerDeg;
    for (let deg = -90; deg <= 90; deg += 5) {
      const y = (t.pitchDeg - deg) * ppd;
      if (Math.abs(y) > unit * 0.3) continue;
      const major = deg % 10 === 0;
      if (!major && deg !== 0) continue;
      const half = deg === 0 ? unit * 0.3 : unit * 0.085;
      const gap = deg === 0 ? unit * 0.05 : unit * 0.035;
      ctx.setLineDash(deg < 0 ? [6, 5] : []);
      ctx.beginPath();
      ctx.moveTo(-half, y);
      ctx.lineTo(-gap, y);
      ctx.moveTo(gap, y);
      ctx.lineTo(half, y);
      if (deg !== 0) {
        const tick = deg > 0 ? 7 : -7;
        ctx.moveTo(-half, y);
        ctx.lineTo(-half, y + tick);
        ctx.moveTo(half, y);
        ctx.lineTo(half, y + tick);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      if (deg !== 0) {
        ctx.font = font(10);
        ctx.textAlign = 'right';
        ctx.fillText(String(Math.abs(deg)), -half - 6, y + 4);
        ctx.textAlign = 'left';
        ctx.fillText(String(Math.abs(deg)), half + 6, y + 4);
      }
    }
    ctx.restore();
  }

  // --- Boresight (where the nose points)
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(cx - 22, cy);
  ctx.lineTo(cx - 9, cy);
  ctx.lineTo(cx - 4, cy + 6);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx + 4, cy + 6);
  ctx.lineTo(cx + 9, cy);
  ctx.lineTo(cx + 22, cy);
  ctx.stroke();

  // --- Flight-path marker (where the jet is actually going)
  if (t.fpv) {
    const { x, y } = t.fpv;
    ctx.beginPath();
    ctx.arc(x, y, 6.5, 0, Math.PI * 2);
    ctx.moveTo(x - 6.5, y);
    ctx.lineTo(x - 18, y);
    ctx.moveTo(x + 6.5, y);
    ctx.lineTo(x + 18, y);
    ctx.moveTo(x, y - 6.5);
    ctx.lineTo(x, y - 13);
    ctx.stroke();
  }

  // --- Heading tape (over a world)
  if (t.hasHorizon) {
    const tapeW = unit * 0.5;
    const y0 = h * 0.12;
    ctx.save();
    ctx.beginPath();
    ctx.rect(w / 2 - tapeW / 2, y0 - 22, tapeW, 40);
    ctx.clip();
    const ppd = tapeW / 60;
    ctx.font = font(10);
    ctx.textAlign = 'center';
    const base = Math.floor(t.headingDeg / 5) * 5;
    for (let d = base - 35; d <= base + 35; d += 5) {
      const x = w / 2 + (d - t.headingDeg) * ppd;
      const dd = ((d % 360) + 360) % 360;
      ctx.beginPath();
      ctx.moveTo(x, y0);
      ctx.lineTo(x, y0 + (dd % 10 === 0 ? 9 : 5));
      ctx.stroke();
      if (dd % 30 === 0) {
        const label = dd === 0 ? 'N' : dd === 90 ? 'E' : dd === 180 ? 'S' : dd === 270 ? 'W' : String(dd / 10).padStart(2, '0');
        ctx.fillText(label, x, y0 - 6);
      }
    }
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(w / 2, y0 + 12);
    ctx.lineTo(w / 2 - 5, y0 + 19);
    ctx.lineTo(w / 2 + 5, y0 + 19);
    ctx.closePath();
    ctx.fill();
  }

  // --- Speed (left) and altitude (right) boxes
  const boxY = h / 2;
  const box = (x: number, label: string, value: string, sub: string, align: 'left' | 'right'): void => {
    ctx.font = font(9, 600);
    ctx.textAlign = align;
    ctx.fillStyle = MINT_DIM;
    ctx.fillText(label, x, boxY - 20);
    ctx.font = font(19, 600);
    ctx.fillStyle = MINT;
    ctx.fillText(value, x, boxY + 2);
    ctx.font = font(10);
    ctx.fillStyle = MINT_DIM;
    ctx.fillText(sub, x, boxY + 20);
    ctx.beginPath();
    const bx = align === 'left' ? x - 10 : x + 10;
    ctx.moveTo(bx, boxY - 30);
    ctx.lineTo(bx, boxY + 28);
    ctx.stroke();
  };
  const leftX = w / 2 - unit * 0.42;
  const rightX = w / 2 + unit * 0.42;
  const speedSub = t.airDensity > 0 ? `M ${t.mach.toFixed(2)}   ${t.gLoad.toFixed(1)} G` : t.closingMps > 1 ? `▲ ${formatSpeed(t.closingMps)}` : 'VACUUM';
  box(leftX, 'SPEED', formatSpeed(t.speedMps), speedSub, 'left');
  box(rightX, t.nearest ? `ALT · ${t.nearest.toUpperCase()}` : 'ALT', formatDistance(t.altKm), t.airWorld ? `AIR ρ ${t.airDensity >= 0.01 ? t.airDensity.toFixed(2) : t.airDensity.toExponential(1)}` : t.anchor ? `RIDING ${t.anchor.toUpperCase()}` : 'HELIOCENTRIC', 'right');

  // --- Throttle and boost gauges (bottom left)
  const gx = leftX;
  const gy = h * 0.8;
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = MINT_DIM;
  ctx.strokeRect(gx, gy - 70, 8, 70);
  ctx.fillStyle = MINT;
  ctx.fillRect(gx, gy - 70 * t.throttle, 8, 70 * t.throttle);
  ctx.strokeRect(gx + 16, gy - 70, 8, 70);
  ctx.fillStyle = t.boost > 0 ? 'rgba(255,160,80,0.95)' : AMBER_DIM;
  ctx.fillRect(gx + 16, gy - 70 * t.boostEnergy, 8, 70 * t.boostEnergy);
  ctx.font = font(9, 600);
  ctx.textAlign = 'left';
  ctx.fillStyle = MINT_DIM;
  ctx.fillText(`THR ${Math.round(t.throttle * 100)}%`, gx, gy + 14);
  ctx.fillText(t.boost > 0 ? 'BOOST' : 'BST', gx, gy + 26);
  ctx.fillStyle = t.assist ? MINT : AMBER;
  ctx.fillText(t.assist ? 'FA ON' : 'FA OFF · INERTIAL', gx + 34, gy - 58);
  ctx.fillStyle = MINT_DIM;
  ctx.fillText(t.view.toUpperCase(), gx + 34, gy - 44);
  if (t.aligning) {
    ctx.fillStyle = AMBER;
    ctx.fillText('ALIGNING', gx + 34, gy - 30);
  }

  // --- Other worlds: small ticks with names
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 4;
  for (const m of t.markers) {
    ctx.strokeStyle = 'rgba(238,233,222,0.55)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(m.x - 4, m.y);
    ctx.lineTo(m.x + 4, m.y);
    ctx.moveTo(m.x, m.y - 4);
    ctx.lineTo(m.x, m.y + 4);
    ctx.stroke();
    ctx.font = font(9.5);
    ctx.textAlign = 'left';
    ctx.fillStyle = TEXT_DIM;
    ctx.fillText(m.name.toUpperCase(), m.x + 8, m.y - 2);
    ctx.fillStyle = 'rgba(238,233,222,0.38)';
    ctx.fillText(formatDistance(m.distKm), m.x + 8, m.y + 9);
  }

  // --- Target: a box on the real world, or an arrow at the edge pointing to it
  ctx.shadowColor = 'rgba(244,205,114,0.5)';
  ctx.shadowBlur = 6;
  ctx.strokeStyle = AMBER;
  ctx.fillStyle = AMBER;
  ctx.lineWidth = 1.5;
  const ts = t.targetScreen;
  const eta = formatEta(t.targetEtaS);
  if (ts && ts.on) {
    const s = 13;
    ctx.beginPath();
    ctx.moveTo(ts.x, ts.y - s);
    ctx.lineTo(ts.x + s, ts.y);
    ctx.lineTo(ts.x, ts.y + s);
    ctx.lineTo(ts.x - s, ts.y);
    ctx.closePath();
    ctx.stroke();
    ctx.font = font(10.5, 600);
    ctx.textAlign = 'left';
    ctx.fillText(t.target.toUpperCase(), ts.x + s + 8, ts.y - 3);
    ctx.font = font(10);
    ctx.fillStyle = AMBER_DIM;
    ctx.fillText(`${formatDistance(t.targetDistKm)} · ETA ${eta}`, ts.x + s + 8, ts.y + 10);
  } else if (ts) {
    const r = unit * 0.36;
    const ax = w / 2 + Math.cos(ts.angle) * r;
    const ay = h / 2 - Math.sin(ts.angle) * r;
    ctx.save();
    ctx.translate(ax, ay);
    ctx.rotate(-ts.angle);
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(-6, -9);
    ctx.lineTo(-2, 0);
    ctx.lineTo(-6, 9);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.font = font(10, 600);
    ctx.textAlign = 'center';
    ctx.fillText(`${t.target.toUpperCase()} ${formatDistance(t.targetDistKm)}`, ax, ay + (Math.sin(ts.angle) > 0 ? 26 : -18));
  }

  // --- Target readout (bottom right)
  ctx.textAlign = 'right';
  ctx.font = font(9, 600);
  ctx.fillStyle = AMBER_DIM;
  ctx.fillText('TARGET', rightX, gy - 58);
  ctx.font = font(13, 600);
  ctx.fillStyle = AMBER;
  ctx.fillText(t.target.toUpperCase(), rightX, gy - 40);
  ctx.font = font(10);
  ctx.fillStyle = AMBER_DIM;
  ctx.fillText(formatDistance(t.targetDistKm), rightX, gy - 24);
  ctx.fillText(`ETA ${eta}`, rightX, gy - 10);

  // --- Warnings
  const blink = Math.floor(t.timeSec * 4) % 2 === 0;
  if (t.warning === 1 && blink) {
    ctx.fillStyle = RED;
    ctx.shadowColor = 'rgba(255,90,70,0.7)';
    ctx.font = font(22, 700);
    ctx.textAlign = 'center';
    ctx.fillText('PULL UP', w / 2, h * 0.68);
  } else if (t.warning === 2) {
    ctx.fillStyle = blink ? RED : AMBER;
    ctx.font = font(16, 700);
    ctx.textAlign = 'center';
    ctx.fillText('HEAT · SOLAR CORONA', w / 2, h * 0.68);
  }
  if (t.heat > 0.15 && t.warning !== 2) {
    ctx.fillStyle = AMBER;
    ctx.font = font(11, 600);
    ctx.textAlign = 'center';
    ctx.fillText(`PLASMA ${Math.round(t.heat * 100)}%`, w / 2, h * 0.72);
  }
}

/** Split a formatted speed ("422 m/s", "0.37 c") into its number and unit. */
function splitValue(s: string): [string, string] {
  const i = s.indexOf(' ');
  return i < 0 ? [s, ''] : [s.slice(0, i), s.slice(i + 1)];
}

/**
 * The default, minimal overlay: one large speed figure with a single line of context, thin
 * corner brackets on the real target world, a quiet throttle/boost gauge. In the cockpit and the
 * GoPro views the flight symbology is on the jet's own HUD glass instead (HudGlass).
 */
function getEarthLocation(lat?: number, lon?: number, altKm = 1): { title: string; subtitle: string; coords: string } {
  if (lat === undefined || lon === undefined) {
    return { title: 'EARTH', subtitle: 'Global Flight', coords: '' };
  }
  const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? 'E' : 'W'}`;
  const coords = `${latStr}, ${lonStr}`;

  const earthLms = landmarksFor('Earth');
  let closestDist = Infinity;
  let closestLm: Landmark | null = null;
  for (const lm of earthLms) {
    const dLat = (lat - lm.lat) * 111.0;
    const dLon = (lon - lm.lon) * 111.0 * Math.cos((lat * Math.PI) / 180);
    const distKm = Math.hypot(dLat, dLon);
    if (distKm < closestDist) {
      closestDist = distKm;
      closestLm = lm;
    }
  }

  // A landmark's name only when you are really at it (within a few km, low); otherwise the name
  // of the real place under the jet (OpenStreetMap reverse geocoding)
  const near = closestLm && closestDist < Math.min(6, 2 + altKm * 2) && altKm < 8;
  const place = placeNameAt(lat, lon, altKm);
  if (place && !near) return { title: place.title.toUpperCase(), subtitle: place.subtitle, coords };
  if (closestLm && near) {
    if (closestLm.id === 'earth-eiffel-tower') {
      return { title: 'PARIS', subtitle: 'Île-de-France, France', coords };
    }
    if (closestLm.id === 'earth-chamonix-mont-blanc') {
      return { title: 'CHAMONIX', subtitle: 'Haute-Savoie, France', coords };
    }
    if (closestLm.id === 'earth-manhattan') {
      return { title: 'NEW YORK', subtitle: 'New York, United States', coords };
    }
    if (closestLm.id === 'earth-golden-gate') {
      return { title: 'SAN FRANCISCO', subtitle: 'California, United States', coords };
    }
    if (closestLm.id === 'earth-london-tower-bridge') {
      return { title: 'LONDON', subtitle: 'Greater London, United Kingdom', coords };
    }
    if (closestLm.id === 'earth-colosseum') {
      return { title: 'ROME', subtitle: 'Lazio, Italy', coords };
    }
    if (closestLm.id === 'earth-grand-canyon') {
      return { title: 'GRAND CANYON', subtitle: 'Arizona, United States', coords };
    }
    if (closestLm.id === 'earth-everest') {
      return { title: 'MOUNT EVEREST', subtitle: 'Himalayas, Nepal / Tibet', coords };
    }
    if (closestLm.id === 'earth-matterhorn') {
      return { title: 'MATTERHORN', subtitle: 'Pennine Alps, Switzerland', coords };
    }
    if (closestLm.id === 'earth-fuji') {
      return { title: 'MOUNT FUJI', subtitle: 'Honshu, Japan', coords };
    }
    return { title: closestLm.name.toUpperCase(), subtitle: closestLm.description.slice(0, 40), coords };
  }

  let region = 'Stratosphere';
  if (lat > 35 && lat < 70 && lon > -10 && lon < 35) region = 'Europe';
  else if (lat > 25 && lat < 50 && lon > -125 && lon < -65) region = 'North America';
  else if (lat > 10 && lat < 55 && lon > 60 && lon < 145) region = 'Asia';
  else if (lat > -35 && lat < 37 && lon > -20 && lon < 50) region = 'Africa';
  else if (lat > -55 && lat < 15 && lon > -85 && lon < -35) region = 'South America';
  else if (lat > -45 && lat < -10 && lon > 110 && lon < 155) region = 'Oceania';
  else if (lat < -60) region = 'Antarctica';
  else if (lat > 65) region = 'Arctic Ocean';
  else region = 'Earth Orbit';

  return { title: region.toUpperCase(), subtitle: 'Planet Earth', coords };
}

function drawMinimal(ctx: CanvasRenderingContext2D, t: JetTelemetry, dpr: number): void {
  const w = t.width;
  const h = t.height;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.lineCap = 'round';
  const inside = t.view === 'cockpit' || t.view === 'gopro';
  const SANS = '"Montserrat", system-ui, sans-serif';
  const soft = 'rgba(255,255,255,0.92)';
  const faint = 'rgba(255,255,255,0.55)';

  // Other worlds: a dot and a name, nothing more
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 6;
  for (const m of t.markers) {
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.arc(m.x, m.y, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = `500 9px ${SANS}`;
    ctx.letterSpacing = '2px';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'left';
    ctx.fillText(m.name.toUpperCase(), m.x + 7, m.y + 3);
  }

  // Target: four thin corner brackets on the world itself, or a chevron at the edge
  const ts = t.targetScreen;
  ctx.strokeStyle = AMBER;
  ctx.fillStyle = AMBER;
  ctx.lineWidth = 1.2;
  ctx.shadowColor = 'rgba(244,205,114,0.45)';
  if (ts && ts.on) {
    const r = 15;
    const c = 6;
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      ctx.beginPath();
      ctx.moveTo(ts.x + sx * r, ts.y + sy * (r - c));
      ctx.lineTo(ts.x + sx * r, ts.y + sy * r);
      ctx.lineTo(ts.x + sx * (r - c), ts.y + sy * r);
      ctx.stroke();
    }
    ctx.font = `600 9.5px ${SANS}`;
    ctx.letterSpacing = '2.5px';
    ctx.textAlign = 'center';
    ctx.fillText(t.target.toUpperCase(), ts.x, ts.y + r + 15);
    ctx.font = `400 9.5px ${SANS}`;
    ctx.letterSpacing = '1px';
    ctx.fillStyle = AMBER_DIM;
    ctx.fillText(`${formatDistance(t.targetDistKm)}  ·  ${formatEta(t.targetEtaS)}`, ts.x, ts.y + r + 28);
  } else if (ts) {
    const unit = Math.min(w, h);
    const ax = w / 2 + Math.cos(ts.angle) * unit * 0.42;
    // Kept below the speed readout at the top of the frame
    const ay = Math.max(118, h / 2 - Math.sin(ts.angle) * unit * 0.42);
    ctx.save();
    ctx.translate(ax, ay);
    ctx.rotate(-ts.angle);
    ctx.beginPath();
    ctx.moveTo(-5, -7);
    ctx.lineTo(4, 0);
    ctx.lineTo(-5, 7);
    ctx.stroke();
    ctx.restore();
    ctx.font = `600 9px ${SANS}`;
    ctx.letterSpacing = '2px';
    ctx.textAlign = 'center';
    ctx.fillText(t.target.toUpperCase(), ax, ay + (Math.sin(ts.angle) > 0 ? 22 : -14));
  }

  // Waypoint on Earth (a landmark chosen as the target): a diamond over the place with a pin to
  // the ground, its name, distance and time; a chevron at the edge when it is out of view
  const wp = t.waypoint;
  if (wp) {
    const WP = 'rgba(120, 220, 255, 0.95)';
    const WP_DIM = 'rgba(120, 220, 255, 0.6)';
    ctx.strokeStyle = WP;
    ctx.fillStyle = WP;
    ctx.lineWidth = 1.4;
    ctx.shadowColor = 'rgba(120, 220, 255, 0.5)';
    const dist = `${formatDistance(wp.distKm)}  ·  ${formatEta(wp.etaS)}`;
    if (wp.on) {
      const r = 9;
      ctx.beginPath();
      ctx.moveTo(wp.x, wp.y - r - 14);
      ctx.lineTo(wp.x + r, wp.y - 14);
      ctx.lineTo(wp.x, wp.y + r - 14);
      ctx.lineTo(wp.x - r, wp.y - 14);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(wp.x, wp.y + r - 14);
      ctx.lineTo(wp.x, wp.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(wp.x, wp.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = `600 9.5px ${SANS}`;
      ctx.letterSpacing = '2.5px';
      ctx.textAlign = 'center';
      ctx.fillText(wp.name.toUpperCase(), wp.x, wp.y - r - 24);
      ctx.font = `400 9.5px ${SANS}`;
      ctx.letterSpacing = '1px';
      ctx.fillStyle = WP_DIM;
      ctx.fillText(dist, wp.x, wp.y + 16);
    } else {
      const unit = Math.min(w, h);
      const ax = w / 2 + Math.cos(wp.angle) * unit * 0.36;
      const ay = Math.max(118, h / 2 - Math.sin(wp.angle) * unit * 0.36);
      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(-wp.angle);
      ctx.beginPath();
      ctx.moveTo(-6, -8);
      ctx.lineTo(5, 0);
      ctx.lineTo(-6, 8);
      ctx.stroke();
      ctx.restore();
      ctx.font = `600 9px ${SANS}`;
      ctx.letterSpacing = '2px';
      ctx.textAlign = 'center';
      const below = Math.sin(wp.angle) > 0 ? 22 : -24;
      ctx.fillText(wp.name.toUpperCase(), ax, ay + below);
      ctx.fillStyle = WP_DIM;
      ctx.font = `400 9px ${SANS}`;
      ctx.fillText(dist, ax, ay + below + 12);
    }
  }

  // Flight-path marker, outside only (inside, the HUD glass carries it), and not over the fly-by's
  // film shots
  if (!inside && t.view !== 'flyby') {
    const cx = t.fpv?.x ?? t.nose?.x ?? w / 2;
    const cy = t.fpv?.y ?? t.nose?.y ?? h / 2;
    ctx.shadowColor = 'rgba(109, 252, 192, 0.55)';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = 'rgba(109, 252, 192, 0.75)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy); ctx.lineTo(cx - 22, cy);
    ctx.moveTo(cx + 22, cy); ctx.lineTo(cx + 30, cy);
    ctx.moveTo(cx, cy - 30); ctx.lineTo(cx, cy - 22);
    ctx.moveTo(cx, cy + 22); ctx.lineTo(cx, cy + 30);
    ctx.stroke();
    ctx.fillStyle = 'rgba(109, 252, 192, 0.9)';
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!isPhone(w, h)) {
    // The tactical overlay: location and flight cards, heading tape (Earth and space alike)
    const earth = t.nearest === 'Earth' ? getEarthLocation(t.lat, t.lon, t.altKm) : null;
    const travel = t.transitName
      ? `TRANSIT · ${t.transitName.toUpperCase()} · ${Math.round(t.transitKm).toLocaleString('en-US')} KM`
      : t.speedTier !== 'Jet'
        ? t.speedTier.toUpperCase()
        : t.destinationName
          ? `P · TRANSIT TO ${t.destinationName.toUpperCase()}`
          : '';
    drawTactical(ctx, t, earth, creditsHeight(), travel);
  } else if (t.nearest === 'Earth') {
    // ── Phone: compact readouts in the bottom corners ──
    const loc = getEarthLocation(t.lat, t.lon, t.altKm);
    // On a phone (upright or on its side) the readouts sit in the bottom corners as on a big
    // screen, smaller, just above the map credits; the stick and buttons stand above them
    const phone = isPhone(w, h);
    const side = phone && w >= 560;
    const altStr = t.altKm < 100
      ? `${Math.round(t.altKm * 1000).toLocaleString('en-US')} M`
      : `${Math.round(t.altKm).toLocaleString('en-US')} KM`;
    const speedKmh = Math.round(t.speedMps * 3.6);
    let padR = w - 14;
    let botR = h - 20;
    if (phone) {
      const base = h - Math.max(side ? 12 : 20, creditsHeight()) - 8;
      const padL = 14;
      padR = w - 14;
      botR = base;
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 6;
      ctx.strokeStyle = 'rgba(109, 252, 192, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, base - 42);
      ctx.lineTo(padL, base + 2);
      ctx.lineTo(padL + 46, base + 2);
      ctx.moveTo(padR, base - 42);
      ctx.lineTo(padR, base + 2);
      ctx.lineTo(padR - 46, base + 2);
      ctx.stroke();
      ctx.textAlign = 'left';
      ctx.font = `700 12.5px ${MONO}`;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(fitText(ctx, loc.title, w / 2 - padL - 30), padL + 9, base - 28);
      ctx.font = `500 10px ${SANS}`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.fillText(fitText(ctx, loc.subtitle, w / 2 - padL - 30), padL + 9, base - 15);
      if (loc.coords) {
        ctx.font = `500 9px ${MONO}`;
        ctx.fillStyle = 'rgba(109, 252, 192, 0.85)';
        ctx.fillText(loc.coords, padL + 9, base - 3);
      }
      // Value, then its label to the left of it, right-aligned to the bracket
      const row = (label: string, value: string, y: number, size: number, colour: string): void => {
        ctx.textAlign = 'right';
        ctx.font = `600 ${size}px ${MONO}`;
        ctx.fillStyle = colour;
        ctx.fillText(value, padR - 9, y);
        const vw = ctx.measureText(value).width;
        ctx.font = `600 8px ${MONO}`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fillText(label, padR - 9 - vw - 6, y);
      };
      row('ALT', altStr, base - 29, 12, '#ffffff');
      row('SPD', `${speedKmh.toLocaleString('en-US')} KM/H`, base - 16, 12, '#ffffff');
      row('MACH', t.mach.toFixed(2), base - 1, 14, t.mach >= 1.0 ? 'rgba(109, 252, 192, 0.95)' : '#ffffff');
      botR = base + 34;
    }
    // Travel: the speed tier (J), and a transit under way (P)
    ctx.font = `600 9.5px ${MONO}`;
    ctx.fillStyle = 'rgba(244, 205, 114, 0.9)';
    const travel = t.transitName
      ? `TRANSIT · ${t.transitName.toUpperCase()} · ${Math.round(t.transitKm).toLocaleString('en-US')} KM`
      : t.speedTier !== 'Jet'
        ? t.speedTier.toUpperCase()
        : t.destinationName
          ? `P · TRANSIT TO ${t.destinationName.toUpperCase()}`
          : '';
    if (travel) ctx.fillText(travel, padR - 12, botR - 88);
  } else {
    const [num, unitTxt] = splitValue(formatSpeed(t.speedMps));
  
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 12;
    ctx.textAlign = 'center';
    ctx.fillStyle = soft;
    const narrow = w < 820 || h < 480;
    ctx.font = `200 ${narrow ? 30 : inside ? 34 : 44}px ${SANS}`;
    ctx.letterSpacing = '1px';
    const top = narrow ? 76 : inside ? 54 : 62;
    ctx.fillText(num, w / 2, top);
    ctx.font = `500 9px ${SANS}`;
    ctx.letterSpacing = '3.5px';
    ctx.fillStyle = faint;
    const context = `${unitTxt.toUpperCase()}  ·  ${formatDistance(t.altKm).toUpperCase()} FROM ${t.nearest.toUpperCase()}`;
    ctx.fillText(context, w / 2, top + 20);
  }

  // Throttle and boost: twenty quiet segments and a hairline (a phone has its throttle slider,
  // and the bottom of its screen belongs to the thumbs)
  ctx.shadowBlur = 0;
  if (!isPhone(w, h)) {
    const segW = 7;
    const gap = 3;
    const n = 20;
    const total = n * segW + (n - 1) * gap;
    const bx = w / 2 - total / 2;
    const by = h - 34;
    for (let i = 0; i < n; i++) {
      const on = (i + 0.5) / n <= t.throttle;
      ctx.fillStyle = on ? (t.boost > 0 ? 'rgba(255,170,90,0.95)' : 'rgba(255,255,255,0.85)') : 'rgba(255,255,255,0.16)';
      ctx.fillRect(bx + i * (segW + gap), by, segW, 3);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(bx, by + 8, total, 1);
    ctx.fillStyle = t.boost > 0 ? 'rgba(255,170,90,0.95)' : AMBER_DIM;
    ctx.fillRect(bx, by + 8, total * t.boostEnergy, 1);
    ctx.font = `500 8px ${SANS}`;
    ctx.letterSpacing = '3px';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.textAlign = 'center';
    ctx.fillText(`${t.assist ? 'ASSIST' : 'INERTIAL'}  ·  ${t.view.toUpperCase()}${t.aligning ? '  ·  ALIGNING' : ''}`, w / 2, by + 22);
    ctx.letterSpacing = '0px';
  }

  // Warnings
  const blink = Math.floor(t.timeSec * 4) % 2 === 0;
  // (on a big screen the tactical overlay draws its own warning box)
  const small = isPhone(w, h);
  if (small && t.warning === 1 && blink) {
    ctx.fillStyle = RED;
    ctx.font = `600 13px ${SANS}`;
    ctx.letterSpacing = '6px';
    ctx.textAlign = 'center';
    ctx.fillText('PULL UP', w / 2, h * 0.66);
  } else if (small && t.warning === 2) {
    ctx.fillStyle = blink ? RED : AMBER;
    ctx.font = `600 12px ${SANS}`;
    ctx.letterSpacing = '5px';
    ctx.textAlign = 'center';
    ctx.fillText('HEAT  ·  SOLAR CORONA', w / 2, h * 0.66);
  }
  ctx.letterSpacing = '0px';
}

/** A phone (narrow, or on its side and short) with a touch screen: the on-screen controls take the bottom of it. */
function isPhone(w: number, h = Infinity): boolean {
  if ((w >= 560 && h >= 500) || typeof window === 'undefined') return false;
  // The same test as the on-screen controls (useScreen): a touch screen without a mouse
  return !!(window.matchMedia?.('(pointer: coarse)').matches || navigator.maxTouchPoints > 0) && !window.matchMedia?.('(pointer: fine)').matches;
}

/**
 * Height of the map credits along the bottom (Google's list changes with the place and wraps on a
 * narrow screen), read at most twice a second; 0 when none are shown.
 */
let creditsH = 0;
let creditsAt = 0;
function creditsHeight(): number {
  const now = performance.now();
  if (now - creditsAt > 500 && typeof document !== 'undefined') {
    creditsAt = now;
    const el = document.querySelector<HTMLElement>('.photoreal-attribution');
    creditsH = el && el.style.display !== 'none' ? el.offsetHeight : 0;
  }
  return creditsH;
}

/** The text, cut with an ellipsis to fit `maxW` pixels in the current font. */
function fitText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
  if (ctx.measureText(text).width <= maxW) return text;
  let s = text;
  while (s.length > 1 && ctx.measureText(`${s}…`).width > maxW) s = s.slice(0, -1);
  return `${s.trimEnd()}…`;
}

function draw(ctx: CanvasRenderingContext2D, t: JetTelemetry, dpr: number): void {
  if (t.fullHud) drawFull(ctx, t, dpr);
  else drawMinimal(ctx, t, dpr);
}

interface JetHUDProps {
  controller: JetController;
  onExit: () => void;
}

export const JetHUD: React.FC<JetHUDProps> = ({ controller, onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [slow, setSlow] = useState({ target: controller.target, view: controller.view, assist: controller.assist, help: controller.helpOpen, status: '', muted: false, nearest: '', landMenu: false, landing: '', landingKm: 0, weather: 'Clear', weatherMode: 'auto', time: '', sky: '' });
  const [listOpen, setListOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { compact, touch } = useScreen();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let lastSlow = 0;
    const unsub = controller.subscribe((t) => {
      if (!t.active) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = Math.round(t.width * dpr);
      const H = Math.round(t.height * dpr);
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W;
        canvas.height = H;
      }
      draw(ctx, t, dpr);
      // The DOM bits only need a few updates a second
      if (t.timeSec - lastSlow > 0.25) {
        lastSlow = t.timeSec;
        const status = t.airWorld
          ? `IN ${t.airWorld.toUpperCase()}'S AIR`
          : t.anchor && t.anchor !== 'Sun'
            ? `NEAR ${t.anchor.toUpperCase()}`
            : 'INTERPLANETARY SPACE';
        const landingKm = Math.round(t.landingDistKm);
        const hh = Math.floor(t.localTime);
        const time = t.nearest && t.nearest !== 'Sun' && t.hasHorizon ? `${String(hh).padStart(2, '0')}:${String(Math.floor((t.localTime - hh) * 60)).padStart(2, '0')}` : '';
        setSlow((s) =>
          s.target === t.target && s.view === t.view && s.assist === t.assist && s.help === t.helpOpen && s.status === status && s.muted === t.muted &&
          s.nearest === t.nearest && s.landMenu === t.landMenu && s.landing === t.landingName && s.landingKm === landingKm &&
          s.weather === t.weather && s.weatherMode === t.weatherMode && s.time === time && s.sky === t.skyEvent
            ? s
            : { target: t.target, view: t.view, assist: t.assist, help: t.helpOpen, status, muted: t.muted, nearest: t.nearest, landMenu: t.landMenu, landing: t.landingName, landingKm, weather: t.weather, weatherMode: t.weatherMode, time, sky: t.skyEvent }
        );
      }
    });
    return unsub;
  }, [controller]);

  // The controls card greets the pilot, then gets out of the way (H brings it back)
  useEffect(() => {
    controller.helpOpen = true;
    const id = window.setTimeout(() => {
      controller.helpOpen = false;
    }, 14000);
    return () => window.clearTimeout(id);
  }, [controller]);

  const names = controller.bodyNames();
  const spacecraftCatalog = useMemo(() => CatalogueManager.getSpacecraftCatalog(), []);
  const spacecraftNames = useMemo(() => new Set(spacecraftCatalog.map((c) => c.name)), [spacecraftCatalog]);
  const worldTargetNames = useMemo(() => names.filter((n) => !spacecraftNames.has(n)), [names, spacecraftNames]);
  const [targetTab, setTargetTab] = useState<'worlds' | 'craft'>(() =>
    spacecraftNames.has(controller.target) ? 'craft' : 'worlds'
  );
  const [craftQuery, setCraftQuery] = useState('');
  const filteredCraft = useMemo(() => {
    const q = craftQuery.trim().toLowerCase();
    if (!q) return spacecraftCatalog;
    return spacecraftCatalog.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.hostBody.toLowerCase().includes(q) ||
        c.agency.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.missionGroup.toLowerCase().includes(q)
    );
  }, [spacecraftCatalog, craftQuery]);
  const [landQuery, setLandQuery] = useState('');
  const [landHits, setLandHits] = useState<Landmark[]>([]);
  const [searchingLand, setSearchingLand] = useState(false);
  useEffect(() => {
    const q = landQuery.trim();
    if (q.length < 2) {
      setLandHits([]);
      setSearchingLand(false);
      return;
    }
    const ctrl = new AbortController();
    setSearchingLand(true);
    const timer = window.setTimeout(() => {
      searchEarthPlaces(q, ctrl.signal)
        .then((hits) => {
          if (!ctrl.signal.aborted) {
            setLandHits(hits);
            setSearchingLand(false);
          }
        })
        .catch(() => {
          if (!ctrl.signal.aborted) setSearchingLand(false);
        });
    }, 260);
    return () => {
      ctrl.abort();
      window.clearTimeout(timer);
    };
  }, [landQuery]);
  const stop = (e: React.SyntheticEvent): void => e.stopPropagation();
  // Everything that is not the target, landing, camera or exit: inline on wide screens, behind a
  // menu button on narrow ones (where one row of them ran into the status and the speed)
  const extras = (
    <>
        <TravelButtons controller={controller} />
        <IconButton icon="hour-back" label="Earlier" state="−1 h" title="Earlier: one hour back ([)" onClick={() => controller.shiftTime(-1)} />
        <IconButton icon="hour-on" label="Later" state="+1 h" title="Later: one hour on (])" onClick={() => controller.shiftTime(1)} />
        <IconButton
          icon={(`weather-${slow.weatherMode === 'auto' ? 'auto' : slow.weatherMode}`) as IconName}
          label="Weather"
          state={slow.weatherMode === 'auto' ? `live · ${slow.weather}` : slow.weatherMode}
          on={slow.weatherMode !== 'auto'}
          title="Weather (Y): auto follows each world's climate"
          onClick={() => controller.cycleWeather()}
        />
        <IconButton
          icon="scale"
          label="World size"
          state={WORLD_SCALE === 1 ? 'true scale' : `×${WORLD_SCALE}`}
          on={WORLD_SCALE === 1}
          title="World size: true scale, or the worlds drawn 30 or 60 times larger (distances always true). Reloads and puts you back in the cockpit."
          onClick={() => {
            const i = WORLD_SCALE_OPTIONS.findIndex((o) => o.value === WORLD_SCALE);
            const next = WORLD_SCALE_OPTIONS[(i + 1) % WORLD_SCALE_OPTIONS.length].value;
            try {
              localStorage.setItem(WORLD_SCALE_KEY, String(next));
              sessionStorage.setItem(JET_RESUME_KEY, controller.target);
            } catch {
              return;
            }
            window.location.reload();
          }}
        />
        <IconButton
          icon="aircraft"
          label="Aircraft"
          state={controller.airframeId === 'gripen' ? 'Gripen' : 'Su-30'}
          title="Switch aircraft: the Gripen (detailed cockpit) or the Su-30MKK. Reloads and puts you back in the cockpit."
          onClick={() => {
            try {
              localStorage.setItem(AIRFRAME_KEY, controller.airframeId === 'gripen' ? 'su30' : 'gripen');
              sessionStorage.setItem(JET_RESUME_KEY, controller.target);
            } catch {
              return;
            }
            window.location.reload();
          }}
        />
        <EraButton controller={controller} />
        <IconButton icon={slow.assist ? 'assist' : 'inertial'} label="Flight assist" state={slow.assist ? 'on' : 'inertial'} on={!slow.assist} title="Flight assist (G): off for pure Newtonian drift" onClick={() => controller.toggleAssist()} />
        <IconButton icon={slow.muted ? 'muted' : 'sound'} label="Sound" state={slow.muted ? 'muted' : 'on'} title="Engine sound (N)" onClick={() => { controller.audio.muted = !controller.audio.muted; }} />
        <IconButton icon="help" label="Controls" on={slow.help} title="Controls (H)" onClick={() => { controller.helpOpen = !controller.helpOpen; }} />
    </>
  );

  return (
    <div className="hud-root" style={{ pointerEvents: 'none' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <EraTitle controller={controller} />
      <LandingFade controller={controller} />
      <EraHint controller={controller} />
      <RadioSubtitle controller={controller} />
      <PitchQuestion controller={controller} />
      {touch && <TouchControls controller={controller} />}

      {/* Where you are, top left: quiet */}
      <div
        style={
          // Up out of the view: on a phone just under the buttons, on its side beside them
          compact && typeof window !== 'undefined' && window.innerWidth < 560
            ? { position: 'absolute', top: 46, left: 12, right: 12, textAlign: 'center', fontFamily: 'Montserrat, system-ui, sans-serif', pointerEvents: 'none' }
            : compact
              ? { position: 'absolute', top: typeof window !== 'undefined' && window.innerHeight < 500 ? 8 : 44, left: 12, maxWidth: '40vw', fontFamily: 'Montserrat, system-ui, sans-serif', pointerEvents: 'none' }
            : { position: 'absolute', top: 18, left: 22, maxWidth: 'calc(50vw - 160px)', fontFamily: 'Montserrat, system-ui, sans-serif', pointerEvents: 'none' }
        }
      >
        <div style={{ fontSize: 9, letterSpacing: '0.42em', color: 'rgba(244,205,114,0.85)' }}>{controller.airframe.anchors.name}</div>
        <div style={{ fontSize: 9, letterSpacing: '0.32em', color: 'rgba(255,255,255,0.55)', marginTop: 5 }}>{slow.status}</div>
        {slow.time && (
          <div style={{ fontSize: 9, letterSpacing: '0.32em', color: 'rgba(255,255,255,0.42)', marginTop: 5 }}>
            LOCAL {slow.time}
            {slow.weather !== 'Clear' || slow.weatherMode !== 'auto' ? ` · ${slow.weather.toUpperCase()}` : ''}
          </div>
        )}
        {slow.sky && (
          <div style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(244,205,114,0.9)', marginTop: 5 }}>{slow.sky}</div>
        )}
        {slow.landing && (
          <div style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--sol-mint)', marginTop: 5 }}>
            LANDING · {slow.landing.toUpperCase()} · {slow.landingKm.toLocaleString('en-US')} KM
          </div>
        )}
        <FpsCounter style={{ marginTop: 5 }} />
      </div>

      {/* Controls, top right: small and dim until used */}
      <div
        onMouseDown={stop}
        className="jet-controls"
        style={{
          position: 'absolute', top: compact ? 6 : 12, right: compact ? 6 : 14, left: compact ? 6 : undefined, display: 'flex', gap: 2,
          pointerEvents: 'auto', alignItems: 'center', justifyContent: 'flex-end', flexWrap: compact ? 'nowrap' : 'wrap', opacity: compact ? 0.9 : 0.72,
          maxWidth: compact ? undefined : 'calc(100vw - 260px)',
        }}
      >
        <IconButton icon="prev" label="Previous target" title="Previous target (Shift+T)" onClick={() => controller.cycleTarget(-1)} />
        <IconButton icon="target" label="Target" state={slow.target} on={listOpen} title="Choose a target (T cycles)" onClick={() => { setListOpen((o) => !o); controller.landMenu = false; }} />
        <IconButton icon="next" label="Next target" title="Next target (T)" onClick={() => controller.cycleTarget(1)} />
        <IconButton
          icon={slow.landing ? 'cancel' : 'land'}
          label={slow.landing ? 'Cancel landing' : 'Land'}
          state={slow.landing ? slow.landing : slow.nearest || undefined}
          on={slow.landMenu || !!slow.landing}
          tone="mint"
          title="Land at a landmark on the world you are near (L)"
          onClick={() => { if (slow.landing) controller.cancelLanding(); else controller.landMenu = !controller.landMenu; setListOpen(false); }}
        />
        <IconButton icon={`view-${controller.view}` as IconName} label="Camera" state={String(slow.view)} title="Camera: chase, cockpit, GoPro, fly-by (C)" onClick={() => controller.cycleView()} />
        {compact ? (
          <IconButton icon="menu" label="More" on={menuOpen} ariaExpanded={menuOpen} title="More controls" onClick={() => { setMenuOpen((o) => !o); setListOpen(false); controller.landMenu = false; }} />
        ) : (
          extras
        )}
        <IconButton icon="exit" label="Exit" tone="red" title="Back to the observatory (Esc)" onClick={onExit} />
      </div>

      {menuOpen && compact && (
        <div
          onMouseDown={stop}
          className="jet-menu"
          style={{
            position: 'absolute', top: 44, right: 6, left: 6, pointerEvents: 'auto', padding: 8, display: 'flex', flexWrap: 'wrap', gap: 4,
            justifyContent: 'center', background: 'rgba(5,4,10,0.82)', border: '1px solid var(--sol-line-soft)', backdropFilter: 'blur(10px)', zIndex: 5,
          }}
          onClick={(e) => { if ((e.target as HTMLElement).tagName === 'BUTTON') setMenuOpen(false); }}
        >
          {extras}
        </div>
      )}

      {listOpen && (
        <div
          onMouseDown={stop}
          style={{
            position: 'absolute', top: 48, right: compact ? 6 : 14, pointerEvents: 'auto', padding: 10, width: compact ? 'calc(100vw - 12px)' : 460,
            maxHeight: '66vh', overflowY: 'auto', zIndex: 5,
            background: 'rgba(5,4,10,0.88)', border: '1px solid var(--sol-line-soft)', backdropFilter: 'blur(12px)',
            fontFamily: 'Montserrat, system-ui, sans-serif',
          }}
        >
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <button
              type="button"
              className={`hud-btn ${targetTab === 'worlds' ? 'is-on' : ''}`}
              style={{ flex: 1 }}
              onClick={() => setTargetTab('worlds')}
            >
              Worlds & Comets ({worldTargetNames.length})
            </button>
            <button
              type="button"
              className={`hud-btn ${targetTab === 'craft' ? 'is-on' : ''}`}
              style={{ flex: 1, color: targetTab === 'craft' ? '#6ee7ff' : undefined }}
              onClick={() => setTargetTab('craft')}
            >
              NASA Spacecraft ({spacecraftCatalog.length})
            </button>
          </div>
          {targetTab === 'worlds' ? (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compact ? 3 : 4}, 1fr)`, gap: 2 }}>
              {worldTargetNames.map((n) => (
                <button key={n} type="button" className={`hud-btn ${n === slow.target ? 'is-on' : ''}`} onClick={() => { controller.setTarget(n); setListOpen(false); }}>
                  {n}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <input
                type="search"
                value={craftQuery}
                onChange={(e) => setCraftQuery(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
                placeholder={`Search ${spacecraftCatalog.length} NASA missions (JWST, ISS, Voyager, Mars)...`}
                className="hud-input"
                style={{ width: '100%', marginBottom: 8 }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {filteredCraft.map((sc) => (
                  <div
                    key={sc.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px',
                      border: `1px solid ${sc.name === slow.target ? 'rgba(110,231,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
                      background: sc.name === slow.target ? 'rgba(110,231,255,0.09)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.95)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {sc.name}
                      </div>
                      <div style={{ fontSize: 9.5, color: 'rgba(155,215,255,0.68)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {sc.agency} · {sc.hostBody} · {sc.physicalSpanM}m
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`hud-btn ${sc.name === slow.target ? 'is-on' : ''}`}
                      title="Set as HUD radar target (compass & T/Z aim)"
                      onClick={() => { controller.setTarget(sc.name); }}
                    >
                      Lock
                    </button>
                    <button
                      type="button"
                      className="hud-btn is-on"
                      style={{ color: '#6dfcc0', borderColor: 'rgba(109,252,192,0.45)' }}
                      title="Warp jet directly into sunlit close formation to orbit and inspect this spacecraft"
                      onClick={() => {
                        controller.rendezvousTarget(sc.name);
                        setListOpen(false);
                      }}
                    >
                      Fly Beside
                    </button>
                  </div>
                ))}
                {filteredCraft.length === 0 && (
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', padding: 8 }}>No NASA craft matches "{craftQuery}".</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {slow.landMenu && (
        <div
          onMouseDown={stop}
          style={{
            position: 'absolute', top: 48, right: compact ? 6 : 14, pointerEvents: 'auto', padding: '12px 12px 8px', width: compact ? 'calc(100vw - 12px)' : 380, maxHeight: '62vh', overflowY: 'auto', zIndex: 5,
            background: 'rgba(5,4,10,0.76)', border: '1px solid var(--sol-line-soft)', backdropFilter: 'blur(10px)', fontFamily: 'Montserrat, system-ui, sans-serif',
          }}
        >
          <div style={{ fontSize: 9, letterSpacing: '0.38em', color: 'var(--sol-mint)', marginBottom: 8 }}>
            LAND ON {slow.nearest.toUpperCase() || '…'}
            <div style={{ marginTop: 8, letterSpacing: 'normal' }}>
              <input
                type="search"
                value={landQuery}
                onChange={(e) => setLandQuery(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
                placeholder="Search any city or place on Earth (3D)…"
                className="hud-input"
                style={{ width: '100%' }}
              />
              {searchingLand && landHits.length === 0 && (
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>Searching Earth locations…</div>
              )}
              {landHits.map((lm) => (
                <div
                  key={lm.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '7px 6px', borderBottom: '1px solid rgba(109,252,192,0.18)', background: 'rgba(109,252,192,0.06)' }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: 'var(--sol-mint)', letterSpacing: '0.04em' }}>{lm.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lm.description}</div>
                  </div>
                  <button
                    type="button"
                    className="hud-btn is-on"
                    title="Transit there: climb, cross at up to 300,000 km/h, come down over it (P)"
                    onClick={() => {
                      setLandQuery('');
                      controller.setEarthDestination(lm.name, lm.lat, lm.lon);
                      controller.startTransit(lm.name, lm.lat, lm.lon);
                      controller.landMenu = false;
                    }}
                  >
                    Fly there
                  </button>
                  <button
                    type="button"
                    className="hud-btn"
                    title="Make it the target and fly there yourself: a marker shows the way, Z turns towards it"
                    onClick={() => {
                      setLandQuery('');
                      controller.setWaypoint(lm.name, lm.lat, lm.lon);
                    }}
                  >
                    Target
                  </button>
                  <button
                    type="button"
                    className="hud-btn"
                    title="Land there and stand on the ground"
                    onClick={() => {
                      setLandQuery('');
                      controller.startLanding(lm);
                    }}
                  >
                    Land
                  </button>
                </div>
              ))}
            </div>
          </div>
          {controller.landmarksHere().length === 0 && (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              No landmarks on {slow.nearest || 'this world'} yet. Fly close to Earth, the Moon, Mars, the big moons or Pluto.
            </div>
          )}
          {controller.waypoint && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 6px 10px', fontSize: 11, color: 'rgba(120,220,255,0.95)' }}>
              <span style={{ flex: 1 }}>Target · {controller.waypoint.name}</span>
              <button type="button" className="hud-btn" onClick={() => { controller.clearWaypoint(); controller.landMenu = false; }}>Clear target</button>
            </div>
          )}
          {controller.landmarksHere().map((lm) => (
            <div
              key={lm.id}
              style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '8px 6px', borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <button
                type="button"
                title="Fly there on autopilot and land"
                onClick={() => controller.startLanding(lm)}
                style={{ flex: 1, minWidth: 0, textAlign: 'left', background: 'transparent', cursor: 'pointer', padding: 0 }}
              >
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.92)', letterSpacing: '0.04em' }}>{lm.name}</div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)', marginTop: 3, lineHeight: 1.45 }}>{lm.scene ?? lm.description}</div>
              </button>
              {lm.body === 'Earth' && (
                <button
                  type="button"
                  className="hud-btn"
                  title="Make it the target and fly there yourself: a marker shows the way, Z turns towards it"
                  onClick={() => controller.setWaypoint(lm.name, lm.lat, lm.lon)}
                >
                  Target
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {slow.help && (
        <div
          onMouseDown={stop}
          style={{
            position: 'absolute', left: compact ? 6 : 18, right: compact ? 6 : undefined, top: compact ? 48 : 56, pointerEvents: 'auto', padding: '12px 14px', maxWidth: compact ? undefined : 330,
            maxHeight: compact ? '58vh' : undefined, overflowY: 'auto', zIndex: 4,
            background: 'rgba(5,4,10,0.62)', border: '1px solid var(--sol-line-soft)', backdropFilter: 'blur(8px)',
            fontFamily: 'var(--sol-mono)', fontSize: 10.5, lineHeight: 1.7, color: 'var(--sol-text)',
          }}
        >
          <div style={{ color: 'var(--sol-amber)', letterSpacing: '0.2em', fontSize: 9.5, marginBottom: 6 }}>FLYING THE {controller.airframe.anchors.name}</div>
          {touch && (
            <div style={{ color: 'var(--sol-mint)' }}>
              <b>Touch</b> · left stick steers (up/down pitch, sideways roll) · right slider throttle · hold <b>Boost</b> · hold <b>Aim</b> (shown once a place is set as Target in the L menu) to turn to it · tap ☰ for more
            </div>
          )}
          {/* The keys, for a keyboard: on a phone they are a wall of text about keys it has not got */}
          {!touch && (
            <>
              <div><b>Drag</b> (left mouse) · steer: up/down pitch, sideways roll</div>
              <div><b>W S / ↑ ↓</b> pitch · <b>A D / ← →</b> roll · <b>Q E</b> yaw</div>
              <div><b>R F</b> or <b>wheel</b> throttle · <b>1–0</b> set · <b>X</b> idle</div>
              <div><b>Space</b> boost · <b>Z</b> (hold) turn to target (a landmark you set as Target in the L menu first) · <b>T</b> next target</div>
              <div><b>C</b> chase / cockpit / GoPro / fly-by · <b>right drag</b> look · <b>G</b> assist</div>
              <div><b>O</b> next time of day (sunrise, noon, golden hour, sunset, blue hour, night) · <b>Home</b> fly home</div>
              <div><b>J</b> Earth speed tier (jet · Mach 6 · Mach 25) · <b>M</b> search a place · <b>P</b> transit there (up to 300,000 km/h)</div>
              <div><b>L</b> land at a landmark on the world below · <b>U</b> full HUD</div>
              <div><b>[ ]</b> time of day · <b>Y</b> weather (auto follows each world's climate)</div>
              <div><b>B</b> landing gear · <b>K</b> afterburner arm · in the cockpit, click the gear lever, the red guard and the DEST screen</div>
              <div><b>V</b> cobra (post-stall, below ~450 m/s in air) · <b>I</b> invert pitch · <b>N</b> sound · <b>H</b> this help · <b>Esc</b> exit</div>
            </>
          )}
          <div style={{ color: 'var(--sol-dim)', marginTop: 6 }}>
            In air the engines set your top speed; out of it the drive's top speed scales with your height above the nearest surface: skim a moon at jet speed, cross an AU in a minute.
            Every world is where it really is right now.
          </div>
          <div style={{ color: 'var(--sol-faint)', marginTop: 6, fontSize: 9.5 }}>
            Aircraft:{' '}
            <a href={controller.airframe.anchors.credit.url} target="_blank" rel="noreferrer" style={{ color: 'var(--sol-dim)' }}>
              {controller.airframe.anchors.credit.title}
            </a>{' '}
            by {controller.airframe.anchors.credit.author},{' '}
            <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" style={{ color: 'var(--sol-dim)' }}>
              CC BY 4.0
            </a>{' '}
            (optimised)
          </div>
          {touch && (
            <button type="button" className="hud-btn is-on" style={{ marginTop: 10, width: '100%', padding: '9px 0', color: 'var(--sol-mint)' }} onClick={() => { controller.helpOpen = false; }}>
              Got it
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/** Fly under the sky of another era: today, or any of the deep-time skies (a supernova, the comet storm, Andromeda, the red giant…). */
const ERA_IDS = DEEP_TIME_SCENES.filter((d) => d.body !== 'Sagittarius A*').map((d) => d.id);
const EraButton: React.FC<{ controller: JetController }> = ({ controller }) => {
  const [, force] = useState(0);
  const era = controller.era ? DEEP_TIME_SCENES.find((d) => d.id === controller.era) : null;
  return (
    <IconButton
      icon="era"
      label="Era"
      state={era ? era.title : 'today'}
      on={!!era}
      title={era ? `${era.when}: ${era.blurb}` : 'Fly under the sky of another era: a supernova, the comet storm, Andromeda, the red giant Sun…'}
      onClick={() => {
        controller.cycleEra(ERA_IDS);
        force((n) => n + 1);
      }}
    />
  );
};

/**
 * When you change era, its title fills the frame for a few seconds, the way the film announces
 * each moment ("VIEW ON EARTH, in 1.3 million years"), then fades: the era's name, when it is, and
 * one line about what you are seeing.
 */
const EraTitle: React.FC<{ controller: JetController }> = ({ controller }) => {
  const [shown, setShown] = useState<{ id: string; t: number } | null>(null);
  const last = useRef<string | null>(controller.era);
  useEffect(() => {
    const id = window.setInterval(() => {
      if (controller.era !== last.current) {
        last.current = controller.era;
        setShown(controller.era ? { id: controller.era, t: Date.now() } : null);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [controller]);
  useEffect(() => {
    if (!shown) return;
    const id = window.setTimeout(() => setShown(null), 9000);
    return () => window.clearTimeout(id);
  }, [shown]);
  const era = shown ? DEEP_TIME_SCENES.find((d) => d.id === shown.id) : null;
  if (!era) return null;
  return (
    <div
      key={shown!.t}
      style={{
        position: 'absolute', left: '6%', top: '16%', maxWidth: 'min(720px, 88vw)', pointerEvents: 'none',
        animation: 'eraTitle 9s ease-in-out forwards', textShadow: '0 2px 18px rgba(0,0,0,0.65)',
      }}
    >
      <style>{'@keyframes eraTitle { 0% { opacity: 0; transform: translateY(8px) } 10% { opacity: 1; transform: none } 80% { opacity: 1 } 100% { opacity: 0 } }'}</style>
      <div style={{ fontFamily: 'Montserrat, system-ui, sans-serif', fontWeight: 300, fontSize: 'clamp(26px, 4.6vw, 54px)', letterSpacing: '0.04em', color: '#fff', textTransform: 'uppercase', lineHeight: 1.05 }}>
        {era.title}
      </div>
      <div style={{ fontFamily: 'ui-monospace, Menlo, Consolas, monospace', fontSize: 'clamp(13px, 1.5vw, 18px)', color: 'rgba(255,255,255,0.88)', marginTop: 6 }}>
        {era.when.charAt(0).toLowerCase() + era.when.slice(1)}
      </div>
      <div style={{ fontFamily: 'Montserrat, system-ui, sans-serif', fontSize: 'clamp(11px, 1.15vw, 14px)', color: 'rgba(255,255,255,0.72)', marginTop: 14, maxWidth: 560, lineHeight: 1.5 }}>
        {era.blurb}
      </div>
    </div>
  );
};

/**
 * An era is seen from the ground of one world. The prompt says where, aims you there, and once you
 * have arrived lands you to look up at it.
 */
const EraHint: React.FC<{ controller: JetController }> = ({ controller }) => {
  const [state, setState] = useState<{ id: string; title: string; body: string; place: string; arrived: boolean; km: number } | null>(null);
  const { compact } = useScreen();
  useEffect(() => {
    const id = window.setInterval(() => {
      const era = controller.era ? DEEP_TIME_SCENES.find((d) => d.id === controller.era) : null;
      if (!era) return setState(null);
      const arrived = controller.eraArrived();
      const km = controller.telemetry.target === era.body ? controller.telemetry.targetDistKm : 0;
      setState((prev) =>
        prev && prev.id === era.id && prev.arrived === arrived && Math.abs(prev.km - km) < Math.max(1, km * 0.02)
          ? prev
          : { id: era.id, title: era.title, body: era.body, place: era.place, arrived, km }
      );
    }, 300);
    return () => window.clearInterval(id);
  }, [controller]);
  if (!state) return null;
  return (
    <div
      style={{
        position: 'absolute', left: '50%', bottom: compact ? undefined : 86, top: compact ? 170 : undefined, transform: 'translateX(-50%)', pointerEvents: 'auto',
        display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px 8px 16px', borderRadius: 999, maxWidth: '92vw',
        background: 'rgba(6,8,14,0.6)', border: '1px solid rgba(255,255,255,0.14)', backdropFilter: 'blur(6px)',
        fontFamily: 'Montserrat, system-ui, sans-serif', fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.85)',
      }}
    >
      <span style={{ textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {state.arrived
          ? `${state.title} · you are at ${state.body}: land and look up`
          : `${state.title} · seen from ${state.place}${state.km > 0 ? ` · ${formatDistance(state.km)}` : ''}`}
      </span>
      {state.arrived ? (
        <button type="button" className="hud-btn is-on" onClick={() => controller.onLookUp?.(state.id)} title="Land here and look up at it">
          Look up
        </button>
      ) : (
        <button type="button" className="hud-btn is-on" onClick={() => controller.pointAtTarget()} title={`Turn the nose to ${state.body} (any stick input cancels)`}>
          Point at it
        </button>
      )}
    </div>
  );
};

/** The landing cutscene ends in a fade to black before the surface view takes over. */
const LandingFade: React.FC<{ controller: JetController }> = ({ controller }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let id = 0;
    const tick = (): void => {
      if (ref.current) ref.current.style.opacity = String(controller.fade);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [controller]);
  return <div ref={ref} style={{ position: 'absolute', inset: 0, background: '#000', opacity: 0, pointerEvents: 'none', zIndex: 50 }} />;
};

/** Narrow screens (phones, small windows) get the compact HUD; touch screens get on-screen controls. */
function useScreen(): { compact: boolean; touch: boolean } {
  const read = (): { compact: boolean; touch: boolean } => ({
    compact: typeof window !== 'undefined' && (window.innerWidth < 820 || window.innerHeight < 480),
    touch:
      typeof window !== 'undefined' &&
      !!(window.matchMedia?.('(pointer: coarse)').matches || navigator.maxTouchPoints > 0) &&
      !window.matchMedia?.('(pointer: fine)').matches,
  });
  const [v, setV] = useState(read);
  useEffect(() => {
    const on = (): void =>
      setV((p) => {
        const n = read();
        return n.compact === p.compact && n.touch === p.touch ? p : n;
      });
    window.addEventListener('resize', on);
    window.addEventListener('orientationchange', on);
    return () => {
      window.removeEventListener('resize', on);
      window.removeEventListener('orientationchange', on);
    };
  }, []);
  return v;
}

/**
 * On-screen flight controls for touch screens: a stick on the left (pitch and roll, springs back
 * when let go), a throttle slider on the right, and two held buttons: Boost, and Aim (turn the
 * nose to the target). Pointer events, so several fingers work at once.
 */
function aimUseful(controller: JetController): boolean {
  return controller.waypoint !== null || (controller.telemetry.nearest !== '' && controller.telemetry.nearest !== 'Earth');
}

const TouchControls: React.FC<{ controller: JetController }> = ({ controller }) => {
  const stickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const thrRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const R = 52;
  // AIM turns the nose to the target: over Earth that is a place set as Target (L menu, or search),
  // in space the world picked as target. Over Earth with no place set it would swing the nose up at
  // a planet in the sky, so it is only there when it has something to aim at
  const [showAim, setShowAim] = useState(() => aimUseful(controller));

  // Keep the throttle fill in step with the throttle (keys and the cockpit can change it too)
  useEffect(() => {
    let id = 0;
    const tick = (): void => {
      if (fillRef.current) fillRef.current.style.height = `${Math.round(controller.throttle * 100)}%`;
      const aim = aimUseful(controller);
      const ch = creditsHeight();
      setCredits((prev) => (Math.abs(prev - ch) < 2 ? prev : ch));
      setShowAim((prev) => {
        if (prev && !aim) controller.touchAlign = false;
        return prev === aim ? prev : aim;
      });
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(id);
      controller.touchSteer.set(0, 0);
      controller.touchBoost = false;
      controller.touchAlign = false;
    };
  }, [controller]);

  const stickMove = (e: React.PointerEvent): void => {
    const el = stickRef.current;
    if (!el || !el.hasPointerCapture(e.pointerId)) return;
    const r = el.getBoundingClientRect();
    let x = (e.clientX - (r.left + r.width / 2)) / R;
    let y = (e.clientY - (r.top + r.height / 2)) / R;
    const len = Math.hypot(x, y);
    if (len > 1) {
      x /= len;
      y /= len;
    }
    // A small dead zone, then a gentle curve: fine corrections near the centre
    const curve = (v: number): number => Math.sign(v) * Math.pow(Math.max(0, Math.abs(v) - 0.08) / 0.92, 1.4);
    controller.touchSteer.set(curve(x), curve(y));
    if (knobRef.current) knobRef.current.style.transform = `translate(${x * R}px, ${y * R}px)`;
  };
  const stickEnd = (): void => {
    controller.touchSteer.set(0, 0);
    if (knobRef.current) knobRef.current.style.transform = 'translate(0px, 0px)';
  };
  const thrMove = (e: React.PointerEvent): void => {
    const el = thrRef.current;
    if (!el || !el.hasPointerCapture(e.pointerId)) return;
    const r = el.getBoundingClientRect();
    controller.throttle = Math.min(1, Math.max(0, 1 - (e.clientY - r.top) / r.height));
  };
  const capture = (e: React.PointerEvent): void => {
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const ring = 'rgba(255,255,255,0.22)';
  const hold = (set: (on: boolean) => void): React.HTMLAttributes<HTMLDivElement> => ({
    onPointerDown: (e) => {
      capture(e);
      set(true);
    },
    onPointerUp: () => set(false),
    onPointerCancel: () => set(false),
    onLostPointerCapture: () => set(false),
  });
  const btn: React.CSSProperties = {
    width: 62, height: 62, borderRadius: '50%', border: `1px solid ${ring}`, background: 'rgba(8,10,16,0.35)', color: 'rgba(255,255,255,0.85)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, system-ui, sans-serif', fontSize: 10,
    letterSpacing: '0.18em', userSelect: 'none', touchAction: 'none', pointerEvents: 'auto',
  };
  // Above the readouts in the bottom corners (~50 px) and the map credits under them (their height
  // read live, see creditsHeight)
  const [credits, setCredits] = useState(0);
  const bottom = `max(${credits + 60}px, calc(env(safe-area-inset-bottom) + ${credits + 54}px))`;
  return (
    <>
      <div
        ref={stickRef}
        className="jet-touch-stick"
        onPointerDown={(e) => {
          capture(e);
          stickMove(e);
        }}
        onPointerMove={stickMove}
        onPointerUp={stickEnd}
        onPointerCancel={stickEnd}
        onLostPointerCapture={stickEnd}
        style={{
          position: 'absolute', left: 'max(18px, env(safe-area-inset-left))', bottom,
          width: R * 2 + 24, height: R * 2 + 24, borderRadius: '50%', border: `1px solid ${ring}`, background: 'rgba(8,10,16,0.22)',
          touchAction: 'none', pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        aria-label="Flight stick"
      >
        <div ref={knobRef} style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.45)', pointerEvents: 'none' }} />
      </div>
      <div style={{ position: 'absolute', right: 'max(18px, env(safe-area-inset-right))', bottom, display: 'flex', alignItems: 'flex-end', gap: 14, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {showAim && <div style={btn} {...hold((on) => { controller.touchAlign = on; })} aria-label="Aim at the target (hold)">AIM</div>}
          <div style={{ ...btn, color: 'rgba(255,190,120,0.95)' }} {...hold((on) => { controller.touchBoost = on; })} aria-label="Boost (hold)">BOOST</div>
        </div>
        <div
          ref={thrRef}
          className="jet-touch-throttle"
          onPointerDown={(e) => {
            capture(e);
            thrMove(e);
          }}
          onPointerMove={thrMove}
          style={{ position: 'relative', width: 46, height: 150, borderRadius: 10, border: `1px solid ${ring}`, background: 'rgba(8,10,16,0.3)', overflow: 'hidden', touchAction: 'none', pointerEvents: 'auto' }}
          aria-label="Throttle"
        >
          <div ref={fillRef} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.22)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 6, textAlign: 'center', fontFamily: 'Montserrat, system-ui, sans-serif', fontSize: 8, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }}>
            THR
          </div>
        </div>
      </div>
    </>
  );
};

/** Earth travel: the speed tier (J) and fly home. Shown only near Earth. */
const TravelButtons: React.FC<{ controller: JetController }> = ({ controller }) => {
  const [, force] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => force((n) => n + 1), 500);
    return () => window.clearInterval(id);
  }, []);
  if (controller.telemetry.nearest !== 'Earth') return null;
  const tiers = ['Jet', 'Mach 6', 'Mach 25'];
  return (
    <>
      <IconButton
        icon={`tier-${Math.min(2, controller.speedTier)}` as IconName}
        label="Speed"
        state={tiers[controller.speedTier] ?? 'Jet'}
        on={controller.speedTier > 0}
        title="Speed tier in Earth's air (J): jet, hypersonic Mach 6, scramjet Mach 25"
        onClick={() => {
          controller.cycleSpeedTier();
          force((n) => n + 1);
        }}
      />
      {controller.home && (
        <IconButton icon="home" label="Fly home" state={controller.home.name} title="Transit back to where you first came into Earth's air" onClick={() => controller.flyHome()} />
      )}
    </>
  );
};

/** Radio calls as a subtitle near the bottom of the frame (transit, arrival, speed tier, cloud). */
const RadioSubtitle: React.FC<{ controller: JetController }> = ({ controller }) => {
  const [text, setText] = useState('');
  useEffect(() => {
    const id = window.setInterval(() => setText(controller.telemetry.radio), 150);
    return () => window.clearInterval(id);
  }, [controller]);
  if (!text) return null;
  return (
    <div
      style={{
        position: 'absolute', left: '50%', bottom: 120, transform: 'translateX(-50%)', maxWidth: 'min(640px, 90vw)', pointerEvents: 'none',
        textAlign: 'center', fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.92)',
        textShadow: '0 1px 8px rgba(0,0,0,0.8)', letterSpacing: '0.02em',
      }}
    >
      <div style={{ fontFamily: 'Montserrat, system-ui, sans-serif', fontStyle: 'normal', fontSize: 8.5, letterSpacing: '0.4em', color: 'rgba(244,205,114,0.85)', marginBottom: 4 }}>RADIO</div>
      “{text}”
    </div>
  );
};

/** Asked once, on the first flight: which way should W move the nose? */
const PitchQuestion: React.FC<{ controller: JetController }> = ({ controller }) => {
  const [ask, setAsk] = useState(false);
  useEffect(() => {
    const id = window.setInterval(() => setAsk(controller.telemetry.askPitch), 400);
    return () => window.clearInterval(id);
  }, [controller]);
  useEffect(() => {
    if (!ask) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === '1' || e.key === '2') {
        e.stopPropagation();
        e.preventDefault();
        controller.setPitchPreference(e.key === '1');
        setAsk(false);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [ask, controller]);
  if (!ask) return null;
  const card: React.CSSProperties = {
    flex: 1, padding: '18px 14px', border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(8,10,16,0.55)', color: '#fff', cursor: 'pointer',
    fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 22, textAlign: 'center',
  };
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)', pointerEvents: 'auto', zIndex: 20 }}>
      <div style={{ width: 'min(560px, 92vw)', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Montserrat, system-ui, sans-serif', fontSize: 9, letterSpacing: '0.45em', color: 'rgba(255,255,255,0.7)' }}>BEFORE YOU FLY</div>
        <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 30, color: '#fff', margin: '10px 0 18px' }}>Flown a flight sim before?</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="button" style={card} onClick={() => { controller.setPitchPreference(true); setAsk(false); }}>
            New to this
            <div style={{ fontFamily: 'Montserrat, system-ui, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 8 }}>1 · W nose up · S nose down</div>
          </button>
          <button type="button" style={card} onClick={() => { controller.setPitchPreference(false); setAsk(false); }}>
            Yes, I have
            <div style={{ fontFamily: 'Montserrat, system-ui, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 8 }}>2 · W nose down · S nose up (stick)</div>
          </button>
        </div>
        <div style={{ fontFamily: 'Montserrat, system-ui, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 12 }}>Change it any time with I</div>
      </div>
    </div>
  );
};
