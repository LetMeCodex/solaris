import * as THREE from 'three';
import type { JetTelemetry } from './JetTelemetry';
import { formatDistance, formatSpeed } from './worlds';

/**
 * Fighter combiner glass HUD: renders collimated horizon ladder, `-o-` flight path marker,
 * gear-down AoA E-bracket, energy/propulsion readouts (`IAS/TAS`, `α`, `G/PEAK`, `T/W`, `Ps`, `FUEL`),
 * and compact FBW/FLAP/BRK/GEAR/AB status pills directly onto the 3D combiner pane.
 */

const W = 512;
const H = 576;
const GREEN = 'rgba(120, 255, 170, 0.96)';
const GREEN_MID = 'rgba(120, 255, 170, 0.72)';
const GREEN_DIM = 'rgba(120, 255, 170, 0.42)';
const AMBER = 'rgba(255, 198, 92, 0.96)';
const CYAN = 'rgba(126, 232, 255, 0.94)';
const RED = 'rgba(255, 108, 108, 0.96)';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

const DEG2RAD = Math.PI / 180;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function wrap360(deg: number): number {
  const r = deg % 360;
  return r < 0 ? r + 360 : r;
}

export class HudGlass {
  public readonly mesh: THREE.Mesh;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private texture: THREE.CanvasTexture;
  private material: THREE.MeshBasicMaterial;
  private readonly widthM: number;
  private readonly heightM: number;
  private readonly baseDist: number;

  /**
   * @param centre centre of the glass, jet frame (metres)
   * @param eye the pilot's nominal eye, jet frame (metres)
   * @param widthM width of the glass, metres
   */
  constructor(centre: THREE.Vector3, eye: THREE.Vector3, widthM: number) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = W;
    this.canvas.height = H;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = 8;
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
    });
    this.widthM = Math.max(0.05, widthM);
    this.heightM = (this.widthM * H) / W;
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(this.widthM, this.heightM),
      this.material,
    );
    this.mesh.position.copy(centre);
    this.mesh.renderOrder = 20;
    this.mesh.frustumCulled = false;
    this.baseDist = Math.max(0.2, eye.distanceTo(centre));
  }

  public update(t: JetTelemetry, visible: boolean): void {
    this.mesh.visible = visible;
    if (!visible) return;

    const x = this.ctx;
    x.clearRect(0, 0, W, H);
    x.shadowBlur = 0;
    x.lineCap = 'round';
    x.lineJoin = 'round';
    x.strokeStyle = GREEN;
    x.fillStyle = GREEN;
    x.lineWidth = 2;

    const cx = W * 0.5;
    const cy = H * 0.45;

    // Collimation parallax from head displacement relative to nominal eyepoint
    const hx = clamp(t.headOffset?.x ?? 0, -this.widthM * 0.22, this.widthM * 0.22);
    const hy = clamp(t.headOffset?.y ?? 0, -this.heightM * 0.22, this.heightM * 0.22);
    const hz = clamp(t.headOffset?.z ?? 0, -0.18, 0.28);
    const liveDist = Math.max(0.2, this.baseDist + hz);
    const degAcross = THREE.MathUtils.radToDeg(2 * Math.atan((this.widthM * 0.5) / liveDist));
    const ppd = W / degAcross;

    const bx = cx + hx * (W / this.widthM);
    const by = cy - hy * (H / this.heightM);

    // Combiner inner aperture bounds for collimated symbols
    const clipL = 62;
    const clipR = W - 62;
    const clipT = 56;
    const clipB = H - 82;

    // 1. Top Heading Tape
    if (t.hasHorizon) {
      this.drawHeadingTape(x, t.headingDeg, cx);
    }

    // 2. Roll Bank Arc + Collimated Pitch Ladder + FPM + AoA E-Bracket
    x.save();
    x.beginPath();
    x.rect(clipL, clipT, clipR - clipL, clipB - clipT);
    x.clip();

    if (t.hasHorizon) {
      this.drawBankArc(x, t.rollDeg, bx, by);
      this.drawPitchLadder(x, t.pitchDeg, t.rollDeg, bx, by, ppd);
    }

    // Fixed boresight waterline `-W-`
    x.strokeStyle = GREEN;
    x.lineWidth = 2.1;
    x.beginPath();
    x.moveTo(bx - 28, by);
    x.lineTo(bx - 12, by);
    x.lineTo(bx - 6, by + 9);
    x.lineTo(bx, by);
    x.lineTo(bx + 6, by + 9);
    x.lineTo(bx + 12, by);
    x.lineTo(bx + 28, by);
    x.stroke();

    // Flight Path Marker `-o-` and E-Bracket
    const { dxDeg, dyDeg } = this.resolveFlightVectorAngles(t);
    const fpmX = bx + dxDeg * ppd;
    const fpmY = by + dyDeg * ppd;
    const drawX = clamp(fpmX, clipL + 16, clipR - 16);
    const drawY = clamp(fpmY, clipT + 16, clipB - 16);
    const clamped = Math.abs(drawX - fpmX) > 0.5 || Math.abs(drawY - fpmY) > 0.5;
    const distFromNose = Math.hypot(drawX - bx, drawY - by);

    if (clamped || distFromNose > ppd * 4.5) {
      x.save();
      x.strokeStyle = clamped ? AMBER : GREEN_DIM;
      x.lineWidth = 1.3;
      x.setLineDash([5, 5]);
      x.beginPath();
      x.moveTo(bx, by);
      x.lineTo(drawX, drawY);
      x.stroke();
      x.restore();
    }

    this.drawFpm(x, drawX, drawY, clamped);

    if (t.gearDown && t.airDensity > 0) {
      const aoa = t.aoaDeg ?? 12;
      this.drawAoABracket(x, drawX, fpmY, aoa, ppd, clipL, clipR, clipT, clipB);
    }

    x.restore();

    // 3. Left Column: Airspeed (IAS/TAS), Mach, Alpha, G / Peak
    this.drawLeftColumn(x, t, cy);

    // 4. Right Column: Altitude, T/W, Ps energy chevron, Fuel %, Nearest body
    this.drawRightColumn(x, t, cy);

    // 5. Warnings & Cautions (SPIN, HIGH ALPHA, OVER-G, PULL UP, Maneuver tag)
    this.drawCautions(x, t, cx, cy);

    // 6. Throttle / AB bar & bottom status pills
    this.drawFooter(x, t, cx);

    this.texture.needsUpdate = true;
  }

  private resolveFlightVectorAngles(t: JetTelemetry): { dxDeg: number; dyDeg: number } {
    if (t.aoaDeg !== undefined || t.aosDeg !== undefined) {
      return {
        dxDeg: clamp(t.aosDeg ?? 0, -85, 85),
        dyDeg: clamp(t.aoaDeg ?? 0, -85, 110),
      };
    }
    if (t.fpv && t.nose && t.pxPerDeg > 0.5) {
      const dxScr = (t.fpv.x - t.nose.x) / t.pxPerDeg;
      const dyScr = (t.fpv.y - t.nose.y) / t.pxPerDeg;
      const r = t.rollDeg * DEG2RAD;
      const cr = Math.cos(r);
      const sr = Math.sin(r);
      return {
        dxDeg: clamp(dxScr * cr + dyScr * sr, -85, 85),
        dyDeg: clamp(-dxScr * sr + dyScr * cr, -85, 110),
      };
    }
    return { dxDeg: 0, dyDeg: 0 };
  }

  private drawHeadingTape(x: CanvasRenderingContext2D, headingDeg: number, cx: number): void {
    const hdg = wrap360(headingDeg);
    const tapeY = 40;
    const tapeHalf = 128;
    const pxPerHdgDeg = 4.2;

    x.save();
    x.beginPath();
    x.rect(cx - tapeHalf, 6, tapeHalf * 2, 42);
    x.clip();

    x.strokeStyle = GREEN_MID;
    x.fillStyle = GREEN_MID;
    x.lineWidth = 1.4;
    x.font = `600 12px ${MONO}`;
    x.textAlign = 'center';

    const startDeg = Math.floor((hdg - 32) / 5) * 5;
    const endDeg = Math.ceil((hdg + 32) / 5) * 5;
    for (let d = startDeg; d <= endDeg; d += 5) {
      const diff = d - hdg;
      const px = cx + diff * pxPerHdgDeg;
      const major = ((d % 10) + 10) % 10 === 0;
      x.beginPath();
      x.moveTo(px, tapeY);
      x.lineTo(px, tapeY - (major ? 8 : 4));
      x.stroke();
      if (major) {
        const labelVal = Math.round(wrap360(d) / 10) % 36;
        const lbl = labelVal === 0 ? 'N' : labelVal === 9 ? 'E' : labelVal === 18 ? 'S' : labelVal === 27 ? 'W' : String(labelVal).padStart(2, '0');
        x.fillText(lbl, px, tapeY - 11);
      }
    }
    x.restore();

    // Lubber chevron & digital readout box
    x.fillStyle = 'rgba(4, 14, 10, 0.65)';
    x.strokeStyle = GREEN;
    x.lineWidth = 1.5;
    x.fillRect(cx - 24, 6, 48, 20);
    x.strokeRect(cx - 24, 6, 48, 20);
    x.fillStyle = GREEN;
    x.font = `700 15px ${MONO}`;
    x.textAlign = 'center';
    x.fillText(String(Math.round(hdg) % 360).padStart(3, '0'), cx, 21);

    x.beginPath();
    x.moveTo(cx - 5, 45);
    x.lineTo(cx, 39);
    x.lineTo(cx + 5, 45);
    x.stroke();
  }

  private drawBankArc(
    x: CanvasRenderingContext2D,
    rollDeg: number,
    bx: number,
    by: number,
  ): void {
    const r = 136;
    x.save();
    x.translate(bx, by);
    x.strokeStyle = GREEN_DIM;
    x.lineWidth = 1.4;
    x.beginPath();
    x.arc(0, 0, r, -Math.PI * 0.5 - 45 * DEG2RAD, -Math.PI * 0.5 + 45 * DEG2RAD);
    x.stroke();

    const bankTicks = [-45, -30, -15, 0, 15, 30, 45];
    for (const deg of bankTicks) {
      const a = -Math.PI * 0.5 + deg * DEG2RAD;
      const len = deg % 30 === 0 ? 8 : 5;
      x.beginPath();
      x.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      x.lineTo(Math.cos(a) * (r + len), Math.sin(a) * (r + len));
      x.stroke();
    }

    // Rotating sky pointer triangle
    const clampedRoll = clamp(rollDeg, -65, 65) * DEG2RAD;
    x.rotate(-clampedRoll);
    x.strokeStyle = GREEN;
    x.lineWidth = 1.7;
    x.beginPath();
    x.moveTo(0, -(r - 2));
    x.lineTo(-5, -(r - 10));
    x.lineTo(5, -(r - 10));
    x.closePath();
    x.stroke();
    x.restore();
  }

  private drawPitchLadder(
    x: CanvasRenderingContext2D,
    pitchDeg: number,
    rollDeg: number,
    bx: number,
    by: number,
    ppd: number,
  ): void {
    x.save();
    x.translate(bx, by);
    x.rotate(-rollDeg * DEG2RAD);
    x.strokeStyle = GREEN;
    x.fillStyle = GREEN;
    x.font = `600 13px ${MONO}`;
    x.lineWidth = 1.8;

    for (let deg = -90; deg <= 90; deg += 5) {
      const y = (pitchDeg - deg) * ppd;
      if (Math.abs(y) > H * 0.65) continue;
      const isHorizon = deg === 0;
      const half = isHorizon ? 148 : deg % 10 === 0 ? 64 : 44;
      const gap = isHorizon ? 32 : 24;
      const dir = deg > 0 ? 1 : -1;

      x.setLineDash(deg < 0 ? [8, 6] : []);
      x.beginPath();
      x.moveTo(-half, y);
      x.lineTo(-gap, y);
      x.moveTo(gap, y);
      x.lineTo(half, y);
      x.stroke();
      x.setLineDash([]);

      if (!isHorizon) {
        // End ticks point toward horizon
        x.beginPath();
        x.moveTo(-half, y);
        x.lineTo(-half, y + dir * 6);
        x.moveTo(half, y);
        x.lineTo(half, y + dir * 6);
        x.stroke();
      }

      if (deg !== 0 && deg % 10 === 0) {
        x.textAlign = 'right';
        x.fillText(String(Math.abs(deg)), -half - 6, y + 4);
        x.textAlign = 'left';
        x.fillText(String(Math.abs(deg)), half + 6, y + 4);
      }
    }
    x.restore();
  }

  private drawFpm(x: CanvasRenderingContext2D, fx: number, fy: number, ghost: boolean): void {
    x.save();
    x.strokeStyle = ghost ? AMBER : GREEN;
    x.lineWidth = 2.1;
    if (ghost) x.setLineDash([4, 3]);
    x.beginPath();
    x.arc(fx, fy, 7.5, 0, Math.PI * 2);
    x.stroke();
    x.setLineDash([]);
    x.beginPath();
    x.moveTo(fx - 17, fy);
    x.lineTo(fx - 7.5, fy);
    x.moveTo(fx + 7.5, fy);
    x.lineTo(fx + 17, fy);
    x.moveTo(fx, fy - 7.5);
    x.lineTo(fx, fy - 15);
    x.stroke();
    x.restore();
  }

  private drawAoABracket(
    x: CanvasRenderingContext2D,
    drawFpmX: number,
    unclampedFpmY: number,
    aoaDeg: number,
    ppd: number,
    clipL: number,
    clipR: number,
    clipT: number,
    clipB: number,
  ): void {
    const onSpeed = aoaDeg >= 11 && aoaDeg <= 13;
    const color = onSpeed ? GREEN : aoaDeg > 13 ? AMBER : CYAN;
    const eY = clamp(unclampedFpmY + (12 - aoaDeg) * ppd, clipT + 18, clipB - 18);
    const eX = clamp(drawFpmX - 24, clipL + 10, clipR - 14);

    x.save();
    x.strokeStyle = color;
    x.fillStyle = color;
    x.lineWidth = 2.0;
    x.beginPath();
    // Vertical spine of `]` facing right toward `-o-`
    x.moveTo(eX - 6, eY - 12);
    x.lineTo(eX, eY - 12);
    x.lineTo(eX, eY + 12);
    x.lineTo(eX - 6, eY + 12);
    // Center tine (12 deg on-speed reference)
    x.moveTo(eX - 5, eY);
    x.lineTo(eX, eY);
    x.stroke();

    x.font = `600 10px ${MONO}`;
    x.textAlign = 'right';
    const tag = onSpeed ? 'ON SPD' : aoaDeg > 13 ? 'SLOW' : 'FAST';
    x.fillText(tag, eX - 8, eY + 3);
    x.restore();
  }

  private drawLeftColumn(x: CanvasRenderingContext2D, t: JetTelemetry, cy: number): void {
    const ias = t.airDensity > 0 && t.iasMps !== undefined ? t.iasMps : t.speedMps;
    const tas = t.tasMps ?? t.speedMps;
    const spdTag = t.airDensity > 0 ? 'IAS' : 'SPD';
    const boxW = 104;
    const boxH = 30;
    const bx = 14;
    const by = cy - 15;

    x.save();
    x.fillStyle = 'rgba(4, 14, 10, 0.55)';
    x.strokeStyle = GREEN;
    x.lineWidth = 1.6;
    x.fillRect(bx, by, boxW, boxH);
    x.strokeRect(bx, by, boxW, boxH);

    x.fillStyle = GREEN_DIM;
    x.font = `600 10px ${MONO}`;
    x.textAlign = 'left';
    x.fillText(spdTag, bx + 4, by - 4);

    x.fillStyle = GREEN;
    x.font = `700 19px ${MONO}`;
    x.textAlign = 'right';
    x.fillText(formatSpeed(ias), bx + boxW - 6, by + 21);

    x.textAlign = 'left';
    x.font = `600 13px ${MONO}`;
    let rowY = by + 48;

    if (t.airDensity > 0 && Math.abs(tas - ias) > 4) {
      x.fillStyle = GREEN_MID;
      x.fillText(`TAS ${formatSpeed(tas)}`, bx, rowY);
      rowY += 17;
    }

    if (t.airDensity > 0) {
      x.fillStyle = t.mach >= 1 ? CYAN : GREEN_MID;
      x.fillText(`M ${t.mach.toFixed(2)}`, bx, rowY);
      rowY += 17;

      const aoa = t.aoaDeg ?? 0;
      x.fillStyle = t.alphaWarning ? AMBER : GREEN_MID;
      x.fillText(`α ${aoa.toFixed(1)}°`, bx, rowY);
      rowY += 17;
    } else {
      x.fillStyle = GREEN_DIM;
      x.fillText('VACUUM', bx, rowY);
      rowY += 17;
    }

    const gPeak = t.gPeak ?? t.gLoad;
    x.fillStyle = t.overGWarning ? RED : GREEN_MID;
    x.fillText(`G ${t.gLoad.toFixed(1)}`, bx, rowY);
    rowY += 15;
    x.fillStyle = GREEN_DIM;
    x.font = `500 11px ${MONO}`;
    x.fillText(`PK ${gPeak.toFixed(1)}G`, bx, rowY);
    x.restore();
  }

  private drawRightColumn(x: CanvasRenderingContext2D, t: JetTelemetry, cy: number): void {
    const boxW = 104;
    const boxH = 30;
    const rx = W - 14;
    const bx = rx - boxW;
    const by = cy - 15;

    x.save();
    x.fillStyle = 'rgba(4, 14, 10, 0.55)';
    x.strokeStyle = GREEN;
    x.lineWidth = 1.6;
    x.fillRect(bx, by, boxW, boxH);
    x.strokeRect(bx, by, boxW, boxH);

    x.fillStyle = GREEN_DIM;
    x.font = `600 10px ${MONO}`;
    x.textAlign = 'right';
    x.fillText('ALT', rx - 4, by - 4);

    x.fillStyle = GREEN;
    x.font = `700 19px ${MONO}`;
    x.fillText(formatDistance(t.altKm), rx - 6, by + 21);

    x.font = `600 13px ${MONO}`;
    let rowY = by + 48;

    const tw = t.twRatio ?? 0;
    x.fillStyle = tw >= 1 ? CYAN : GREEN_MID;
    x.fillText(`T/W ${tw.toFixed(2)}`, rx, rowY);
    rowY += 17;

    if (t.specificExcessPowerMps !== undefined) {
      const ps = Math.round(t.specificExcessPowerMps);
      const arrow = ps >= 2 ? '▲' : ps <= -2 ? '▼' : '·';
      x.fillStyle = ps >= 0 ? GREEN : AMBER;
      x.fillText(`Ps ${ps >= 0 ? '+' : ''}${ps}${arrow}`, rx, rowY);
      rowY += 17;
    }

    const fuelPct = Math.round(clamp((t.fuelFrac ?? t.boostEnergy) * 100, 0, 100));
    x.fillStyle = fuelPct <= 15 ? RED : fuelPct <= 30 ? AMBER : GREEN_MID;
    x.fillText(`FUEL ${fuelPct}%`, rx, rowY);
    rowY += 16;

    x.fillStyle = GREEN_DIM;
    x.font = `500 11px ${MONO}`;
    x.fillText(t.nearest.toUpperCase(), rx, rowY);
    x.restore();
  }

  private drawCautions(
    x: CanvasRenderingContext2D,
    t: JetTelemetry,
    cx: number,
    cy: number,
  ): void {
    const blink = Math.floor(t.timeSec * 4) % 2 === 0;
    x.save();
    x.textAlign = 'center';

    if (t.warning === 1 && blink) {
      x.fillStyle = RED;
      x.font = `700 28px ${MONO}`;
      x.fillText('PULL UP', cx, cy + 92);
    } else if (t.spinWarning && blink) {
      x.fillStyle = RED;
      x.font = `700 16px ${MONO}`;
      x.fillText('SPIN · STICK FWD + OPP RUDDER', cx, cy + 90);
    } else if (t.overGWarning && blink) {
      x.fillStyle = AMBER;
      x.font = `700 17px ${MONO}`;
      x.fillText(`OVER-G ${t.gLoad.toFixed(1)}G`, cx, cy + 90);
    } else if (t.alphaWarning && blink) {
      x.fillStyle = AMBER;
      x.font = `700 15px ${MONO}`;
      x.fillText(`HIGH AOA ${(t.aoaDeg ?? 0).toFixed(0)}°`, cx, cy + 90);
    }

    if (t.maneuver && t.maneuver !== 'none') {
      x.fillStyle = CYAN;
      x.font = `700 13px ${MONO}`;
      x.fillText(t.maneuver.toUpperCase(), cx, 66);
    }
    x.restore();
  }

  private drawFooter(x: CanvasRenderingContext2D, t: JetTelemetry, cx: number): void {
    const barW = 240;
    const bx = cx - barW * 0.5;
    const by = H - 64;

    // Throttle + AB/Energy bars
    x.save();
    x.lineWidth = 1.4;
    x.strokeStyle = GREEN_DIM;
    x.strokeRect(bx, by, barW, 8);
    x.fillStyle = t.abStage && t.abStage > 0 ? AMBER : GREEN;
    x.fillRect(bx, by, barW * clamp(t.throttle, 0, 1), 8);

    const abStage = t.abStage ?? (t.boost > 0.66 ? 3 : t.boost > 0.33 ? 2 : t.boost > 0 ? 1 : 0);
    const fuelOrBoost = t.fuelFrac ?? t.boostEnergy;
    x.fillStyle = abStage > 0 ? AMBER : GREEN_DIM;
    x.fillRect(bx, by + 12, barW * clamp(fuelOrBoost, 0, 1), 3);

    // Status Pills Row
    const fbw = (t.fbwMode ?? 'norm').toUpperCase();
    const fbwLbl = t.tvcActive ? `${fbw}·TVC` : fbw;
    const flp = (t.flapMode ?? 'auto').toUpperCase();
    const brkOn = Boolean(t.airbrakeActive || t.wheelBrakeActive);
    const abLbl = t.supercruise
      ? 'SUPR'
      : abStage > 0
        ? `AB${abStage}`
        : t.abArmed
          ? 'AB ARM'
          : 'MIL';

    const pills: Array<{ text: string; color: string; active: boolean }> = [
      {
        text: `FBW ${fbwLbl}`,
        color: fbw === 'PSM' ? CYAN : fbw === 'HIGH-G' ? AMBER : GREEN,
        active: fbw !== 'NORM' || Boolean(t.tvcActive),
      },
      {
        text: `FLP ${flp === 'COMBAT' ? 'CMB' : flp === 'LAND' ? 'LND' : 'AUTO'}`,
        color: flp !== 'AUTO' ? CYAN : GREEN_DIM,
        active: flp !== 'AUTO',
      },
      {
        text: t.wheelBrakeActive ? 'W-BRK' : 'BRK',
        color: brkOn ? AMBER : GREEN_DIM,
        active: brkOn,
      },
      {
        text: t.gearDown ? 'GEAR DN' : 'GEAR UP',
        color: t.gearDown ? GREEN : GREEN_DIM,
        active: t.gearDown,
      },
      {
        text: abLbl,
        color: t.supercruise ? CYAN : abStage > 0 ? AMBER : t.abArmed ? GREEN_MID : GREEN_DIM,
        active: Boolean(t.supercruise || abStage > 0 || t.abArmed),
      },
    ];

    x.font = `600 11px ${MONO}`;
    x.textAlign = 'center';
    const gap = 6;
    const totalW = W - 28 - gap * (pills.length - 1);
    const pillW = totalW / pills.length;
    const py = H - 36;
    const pillH = 22;

    pills.forEach((p, i) => {
      const px = 14 + i * (pillW + gap);
      x.fillStyle = p.active ? 'rgba(12, 36, 28, 0.72)' : 'rgba(4, 12, 9, 0.42)';
      x.strokeStyle = p.color;
      x.lineWidth = p.active ? 1.5 : 1.0;
      x.fillRect(px, py, pillW, pillH);
      x.strokeRect(px, py, pillW, pillH);
      x.fillStyle = p.color;
      x.fillText(p.text, px + pillW * 0.5, py + 15);
    });
    x.restore();
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.texture.dispose();
  }
}
