import * as THREE from 'three';
import type { JetTelemetry } from './JetTelemetry';
import { formatDistance, formatSpeed } from './worlds';
import { formatAltitudeMeters, resolveAltitudeTelemetry } from './TacticalHud';

/**
 * Wide-angle collimated military fighter HUD combiner glass (Saab EP-17 / DCS standard):
 *  - Subtle dichroic optical combiner tint + dark contrast backing so military emerald phosphor
 *    (`#38ff8c`) stays razor-sharp against bright sunlit sky & clouds.
 *  - Collimated pitch ladder, roll bank scale, `-o-` flight path marker (velocity vector),
 *    boresight waterline `-W-`, and gear-down AoA E-bracket with eyepoint parallax.
 *  - Scrolling vertical IAS/Mach left tape, scrolling MSL/AGL right altitude tape, top heading tape,
 *    energy/propulsion telemetry (`α`, `G/PK`, `T/W`, `Ps`, `FUEL`), throttle/AB stage bar,
 *    status pills, and flashing GPWS `PULL UP` double chevron cue.
 *  - Zero per-frame heap allocations in the render loop.
 */

const W = 768;
const H = 864;
const SCALE = W / 512; // 1.5x logical-to-backing resolution while keeping 512x576 layout space

const PHOSPHOR = '#38ff8c';
const PHOSPHOR_BRIGHT = '#72ffad';
const PHOSPHOR_MID = 'rgba(56, 255, 140, 0.84)';
const PHOSPHOR_DIM = 'rgba(56, 255, 140, 0.50)';
const AMBER = '#ffc44d';
const CYAN = '#6be8ff';
const RED = '#ff4d4d';
const HALO = 'rgba(2, 12, 8, 0.72)';
const BOX_BG = 'rgba(3, 14, 10, 0.74)';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

const DEG2RAD = Math.PI / 180;
const BANK_TICKS = [-45, -30, -15, 0, 15, 30, 45] as const;

interface HudPill {
  text: string;
  color: string;
  active: boolean;
}

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
  // Pre-allocated reusable structs for zero-GC 60 FPS draws
  private readonly vecAngles = { dxDeg: 0, dyDeg: 0 };
  private readonly pills: HudPill[] = [
    { text: '', color: PHOSPHOR, active: false },
    { text: '', color: PHOSPHOR_DIM, active: false },
    { text: '', color: PHOSPHOR_DIM, active: false },
    { text: '', color: PHOSPHOR_DIM, active: false },
    { text: '', color: PHOSPHOR_DIM, active: false },
  ];

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
    this.texture.anisotropy = 16;
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      blending: THREE.NormalBlending,
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
    x.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    x.clearRect(0, 0, 512, 576);
    x.shadowBlur = 0;
    x.lineCap = 'round';
    x.lineJoin = 'round';

    const LW = 512;
    const LH = 576;

    // Subtle dichroic holographic combiner glass tint so phosphor pops against bright clouds
    x.fillStyle = 'rgba(4, 22, 14, 0.14)';
    x.fillRect(6, 4, LW - 12, LH - 8);
    x.strokeStyle = 'rgba(56, 255, 140, 0.20)';
    x.lineWidth = 1.2;
    x.strokeRect(6.5, 4.5, LW - 13, LH - 9);

    x.strokeStyle = PHOSPHOR;
    x.fillStyle = PHOSPHOR;
    x.lineWidth = 2.1;

    const cx = LW * 0.5;
    const cy = LH * 0.45;

    // Collimation parallax from head displacement relative to nominal eyepoint
    const hx = clamp(t.headOffset?.x ?? 0, -this.widthM * 0.22, this.widthM * 0.22);
    const hy = clamp(t.headOffset?.y ?? 0, -this.heightM * 0.22, this.heightM * 0.22);
    const hz = clamp(t.headOffset?.z ?? 0, -0.18, 0.28);
    const liveDist = Math.max(0.2, this.baseDist + hz);
    const degAcross = THREE.MathUtils.radToDeg(2 * Math.atan((this.widthM * 0.5) / liveDist));
    const ppd = LW / degAcross;

    const bx = cx + hx * (LW / this.widthM);
    const by = cy - hy * (LH / this.heightM);

    // Combiner inner aperture bounds for collimated symbols
    const clipL = 104;
    const clipR = LW - 104;
    const clipT = 56;
    const clipB = LH - 84;

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

    // Fixed boresight waterline `-W-` (dark optical halo + bright emerald phosphor)
    this.strokePathWithHalo(x, PHOSPHOR_BRIGHT, 2.3, () => {
      x.beginPath();
      x.moveTo(bx - 26, by);
      x.lineTo(bx - 11, by);
      x.lineTo(bx - 5.5, by + 8.5);
      x.lineTo(bx, by);
      x.lineTo(bx + 5.5, by + 8.5);
      x.lineTo(bx + 11, by);
      x.lineTo(bx + 26, by);
    });

    // Flight Path Marker `-o-` and E-Bracket
    this.resolveFlightVectorAngles(t);
    const fpmX = bx + this.vecAngles.dxDeg * ppd;
    const fpmY = by + this.vecAngles.dyDeg * ppd;
    const drawX = clamp(fpmX, clipL + 16, clipR - 16);
    const drawY = clamp(fpmY, clipT + 16, clipB - 16);
    const clamped = Math.abs(drawX - fpmX) > 0.5 || Math.abs(drawY - fpmY) > 0.5;
    const distFromNose = Math.hypot(drawX - bx, drawY - by);

    if (clamped || distFromNose > ppd * 4.5) {
      x.save();
      x.strokeStyle = clamped ? AMBER : PHOSPHOR_DIM;
      x.lineWidth = 1.4;
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

    // 3. Left Scrolling IAS Tape & Speed / Mach / Alpha / G Column
    this.drawLeftColumn(x, t, cy);

    // 4. Right Scrolling Altitude Tape (AGL/MSL) & Energy / Fuel Column
    this.drawRightColumn(x, t, cy);

    // 5. Warnings & Cautions (GPWS PULL UP chevrons, SPIN, OVER-G, HIGH AOA, Maneuver)
    this.drawCautions(x, t, cx, cy);

    // 6. Throttle / AB Stage bar & bottom status pills
    this.drawFooter(x, t, cx, LW, LH);

    this.texture.needsUpdate = true;
  }

  private strokePathWithHalo(
    x: CanvasRenderingContext2D,
    color: string,
    width: number,
    buildPath: () => void,
  ): void {
    buildPath();
    x.strokeStyle = HALO;
    x.lineWidth = width + 2.4;
    x.stroke();
    x.strokeStyle = color;
    x.lineWidth = width;
    x.stroke();
  }

  private drawCrispText(
    x: CanvasRenderingContext2D,
    text: string,
    tx: number,
    ty: number,
    color: string,
  ): void {
    x.strokeStyle = HALO;
    x.lineWidth = 3.0;
    x.strokeText(text, tx, ty);
    x.fillStyle = color;
    x.fillText(text, tx, ty);
  }

  private resolveFlightVectorAngles(t: JetTelemetry): void {
    if (t.aoaDeg !== undefined || t.aosDeg !== undefined) {
      this.vecAngles.dxDeg = clamp(t.aosDeg ?? 0, -85, 85);
      this.vecAngles.dyDeg = clamp(t.aoaDeg ?? 0, -85, 110);
      return;
    }
    if (t.fpv && t.nose && t.pxPerDeg > 0.5) {
      const dxScr = (t.fpv.x - t.nose.x) / t.pxPerDeg;
      const dyScr = (t.fpv.y - t.nose.y) / t.pxPerDeg;
      const r = t.rollDeg * DEG2RAD;
      const cr = Math.cos(r);
      const sr = Math.sin(r);
      this.vecAngles.dxDeg = clamp(dxScr * cr + dyScr * sr, -85, 85);
      this.vecAngles.dyDeg = clamp(-dxScr * sr + dyScr * cr, -85, 110);
      return;
    }
    this.vecAngles.dxDeg = 0;
    this.vecAngles.dyDeg = 0;
  }

  private drawHeadingTape(x: CanvasRenderingContext2D, headingDeg: number, cx: number): void {
    const hdg = wrap360(headingDeg);
    const tapeY = 44;
    const tapeHalf = 134;
    const pxPerHdgDeg = 4.2;

    x.save();
    x.fillStyle = 'rgba(3, 14, 10, 0.44)';
    x.fillRect(cx - tapeHalf, 26, tapeHalf * 2, 22);
    x.beginPath();
    x.rect(cx - tapeHalf, 6, tapeHalf * 2, 44);
    x.clip();

    x.strokeStyle = PHOSPHOR_MID;
    x.lineWidth = 1.6;
    x.font = `700 12px ${MONO}`;
    x.textAlign = 'center';

    const startDeg = Math.floor((hdg - 34) / 5) * 5;
    const endDeg = Math.ceil((hdg + 34) / 5) * 5;
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
        const lbl =
          labelVal === 0
            ? 'N'
            : labelVal === 9
              ? 'E'
              : labelVal === 18
                ? 'S'
                : labelVal === 27
                  ? 'W'
                  : String(labelVal).padStart(2, '0');
        this.drawCrispText(x, lbl, px, tapeY - 10, PHOSPHOR);
      }
    }
    x.restore();

    // Lubber chevron & high-contrast digital heading box
    x.fillStyle = BOX_BG;
    x.strokeStyle = PHOSPHOR_BRIGHT;
    x.lineWidth = 1.8;
    x.fillRect(cx - 26, 5, 52, 21);
    x.strokeRect(cx - 26, 5, 52, 21);
    x.font = `700 15px ${MONO}`;
    x.textAlign = 'center';
    x.fillStyle = PHOSPHOR_BRIGHT;
    x.fillText(String(Math.round(hdg) % 360).padStart(3, '0'), cx, 21);

    x.strokeStyle = PHOSPHOR_BRIGHT;
    x.lineWidth = 1.8;
    x.beginPath();
    x.moveTo(cx - 6, 50);
    x.lineTo(cx, 43);
    x.lineTo(cx + 6, 50);
    x.stroke();
  }

  private drawBankArc(
    x: CanvasRenderingContext2D,
    rollDeg: number,
    bx: number,
    by: number,
  ): void {
    const r = 132;
    x.save();
    x.translate(bx, by);
    x.strokeStyle = PHOSPHOR_MID;
    x.lineWidth = 1.5;
    x.beginPath();
    x.arc(0, 0, r, -Math.PI * 0.5 - 45 * DEG2RAD, -Math.PI * 0.5 + 45 * DEG2RAD);
    x.stroke();

    for (let i = 0; i < BANK_TICKS.length; i++) {
      const deg = BANK_TICKS[i];
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
    x.strokeStyle = PHOSPHOR_BRIGHT;
    x.fillStyle = PHOSPHOR_BRIGHT;
    x.lineWidth = 1.9;
    x.beginPath();
    x.moveTo(0, -(r - 2));
    x.lineTo(-5.5, -(r - 11));
    x.lineTo(5.5, -(r - 11));
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
    x.font = `700 12.5px ${MONO}`;

    for (let deg = -90; deg <= 90; deg += 5) {
      const y = (pitchDeg - deg) * ppd;
      if (Math.abs(y) > 360) continue;
      const isHorizon = deg === 0;
      const half = isHorizon ? 136 : deg % 10 === 0 ? 58 : 38;
      const gap = isHorizon ? 28 : 22;
      const dir = deg > 0 ? 1 : -1;

      // Dark halo pass for crisp sky contrast
      x.setLineDash(deg < 0 ? [8, 5] : []);
      x.strokeStyle = HALO;
      x.lineWidth = isHorizon ? 4.4 : 3.8;
      x.beginPath();
      x.moveTo(-half, y);
      x.lineTo(-gap, y);
      x.moveTo(gap, y);
      x.lineTo(half, y);
      x.stroke();

      // Luminous emerald phosphor pass
      x.strokeStyle = isHorizon ? PHOSPHOR_BRIGHT : PHOSPHOR;
      x.lineWidth = isHorizon ? 2.3 : 1.9;
      x.beginPath();
      x.moveTo(-half, y);
      x.lineTo(-gap, y);
      x.moveTo(gap, y);
      x.lineTo(half, y);
      x.stroke();
      x.setLineDash([]);

      if (!isHorizon) {
        // End ticks point toward horizon
        x.strokeStyle = PHOSPHOR;
        x.lineWidth = 1.9;
        x.beginPath();
        x.moveTo(-half, y);
        x.lineTo(-half, y + dir * 7);
        x.moveTo(half, y);
        x.lineTo(half, y + dir * 7);
        x.stroke();
      }

      if (deg !== 0 && deg % 10 === 0) {
        const txt = String(Math.abs(deg));
        x.textAlign = 'right';
        this.drawCrispText(x, txt, -half - 6, y + 4, PHOSPHOR_BRIGHT);
        x.textAlign = 'left';
        this.drawCrispText(x, txt, half + 6, y + 4, PHOSPHOR_BRIGHT);
      }
    }
    x.restore();
  }

  private drawFpm(x: CanvasRenderingContext2D, fx: number, fy: number, ghost: boolean): void {
    const col = ghost ? AMBER : PHOSPHOR_BRIGHT;
    x.save();
    // Circle with halo
    if (ghost) x.setLineDash([4, 3]);
    x.strokeStyle = HALO;
    x.lineWidth = 4.6;
    x.beginPath();
    x.arc(fx, fy, 8, 0, Math.PI * 2);
    x.stroke();
    x.strokeStyle = col;
    x.lineWidth = 2.3;
    x.beginPath();
    x.arc(fx, fy, 8, 0, Math.PI * 2);
    x.stroke();
    x.setLineDash([]);

    // Wings & fin
    this.strokePathWithHalo(x, col, 2.3, () => {
      x.beginPath();
      x.moveTo(fx - 19, fy);
      x.lineTo(fx - 8, fy);
      x.moveTo(fx + 8, fy);
      x.lineTo(fx + 19, fy);
      x.moveTo(fx, fy - 8);
      x.lineTo(fx, fy - 16);
    });
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
    const color = onSpeed ? PHOSPHOR_BRIGHT : aoaDeg > 13 ? AMBER : CYAN;
    const eY = clamp(unclampedFpmY + (12 - aoaDeg) * ppd, clipT + 18, clipB - 18);
    const eX = clamp(drawFpmX - 24, clipL + 10, clipR - 14);

    x.save();
    this.strokePathWithHalo(x, color, 2.2, () => {
      x.beginPath();
      x.moveTo(eX - 7, eY - 13);
      x.lineTo(eX, eY - 13);
      x.lineTo(eX, eY + 13);
      x.lineTo(eX - 7, eY + 13);
      x.moveTo(eX - 6, eY);
      x.lineTo(eX, eY);
    });

    x.font = `700 10.5px ${MONO}`;
    x.textAlign = 'right';
    const tag = onSpeed ? 'ON SPD' : aoaDeg > 13 ? 'SLOW' : 'FAST';
    this.drawCrispText(x, tag, eX - 9, eY + 3, color);
    x.restore();
  }

  private drawLeftColumn(x: CanvasRenderingContext2D, t: JetTelemetry, cy: number): void {
    const inAir = t.airDensity > 0;
    const ias = inAir && t.iasMps !== undefined ? t.iasMps : t.speedMps;
    const tas = t.tasMps ?? t.speedMps;
    const iasKt = ias * 1.943844;
    const spdTag = inAir ? 'IAS KT' : 'SPD';
    const boxW = 92;
    const boxH = 30;
    const bx = 10;
    const by = cy - 15;

    x.save();
    // Vertical scrolling airspeed scale ticks (right edge of left box, x = 102)
    const tapeX = bx + boxW;
    const tapeTop = cy - 110;
    const tapeBot = cy + 105;
    x.save();
    x.fillStyle = 'rgba(3, 14, 10, 0.34)';
    x.fillRect(tapeX - 26, tapeTop, 26, tapeBot - tapeTop);
    x.beginPath();
    x.rect(tapeX - 38, tapeTop, 42, tapeBot - tapeTop);
    x.clip();
    x.strokeStyle = PHOSPHOR_MID;
    x.lineWidth = 1.5;
    x.beginPath();
    x.moveTo(tapeX, tapeTop);
    x.lineTo(tapeX, tapeBot);
    x.stroke();

    if (inAir) {
      const pxPerKt = 1.1;
      const step = 20;
      const minKt = Math.max(0, Math.floor((iasKt - 110) / step) * step);
      const maxKt = Math.ceil((iasKt + 110) / step) * step;
      x.font = `700 10px ${MONO}`;
      x.textAlign = 'right';
      for (let kt = minKt; kt <= maxKt; kt += step) {
        const ty = cy - (kt - iasKt) * pxPerKt;
        if (ty < tapeTop || ty > tapeBot || Math.abs(ty - cy) < 19) continue;
        const major = kt % 100 === 0;
        x.strokeStyle = PHOSPHOR;
        x.lineWidth = major ? 1.8 : 1.2;
        x.beginPath();
        x.moveTo(tapeX, ty);
        x.lineTo(tapeX - (major ? 10 : 6), ty);
        x.stroke();
        if (major) {
          this.drawCrispText(x, String(kt), tapeX - 12, ty + 3.5, PHOSPHOR_MID);
        }
      }
    }
    x.restore();

    // Boxed digital speed readout with pointer caret
    x.fillStyle = BOX_BG;
    x.strokeStyle = PHOSPHOR_BRIGHT;
    x.lineWidth = 1.9;
    x.beginPath();
    x.moveTo(bx, by);
    x.lineTo(bx + boxW - 7, by);
    x.lineTo(bx + boxW + 2, cy);
    x.lineTo(bx + boxW - 7, by + boxH);
    x.lineTo(bx, by + boxH);
    x.closePath();
    x.fill();
    x.stroke();

    x.font = `700 10px ${MONO}`;
    x.textAlign = 'left';
    this.drawCrispText(x, spdTag, bx + 2, by - 5, PHOSPHOR_MID);

    x.fillStyle = PHOSPHOR_BRIGHT;
    x.font = `700 18px ${MONO}`;
    x.textAlign = 'right';
    x.fillText(inAir ? String(Math.round(iasKt)) : formatSpeed(ias), bx + boxW - 10, by + 21);

    // Secondary speed / Mach / Alpha / G readouts below box
    x.textAlign = 'left';
    x.font = `700 12.5px ${MONO}`;
    let rowY = by + 48;

    if (inAir) {
      this.drawCrispText(x, `${Math.round(ias * 3.6)} KMH`, bx + 2, rowY, PHOSPHOR_MID);
      rowY += 16;
      if (Math.abs(tas - ias) > 6) {
        this.drawCrispText(x, `TAS ${Math.round(tas * 1.943844)}KT`, bx + 2, rowY, PHOSPHOR_DIM);
        rowY += 16;
      }
      this.drawCrispText(x, `M ${t.mach.toFixed(2)}`, bx + 2, rowY, t.mach >= 1 ? CYAN : PHOSPHOR_BRIGHT);
      rowY += 16;
      const aoa = t.aoaDeg ?? 0;
      this.drawCrispText(x, `α ${aoa.toFixed(1)}°`, bx + 2, rowY, t.alphaWarning ? AMBER : PHOSPHOR);
      rowY += 16;
    } else {
      this.drawCrispText(x, 'VACUUM', bx + 2, rowY, PHOSPHOR_DIM);
      rowY += 16;
    }

    const gPeak = t.gPeak ?? t.gLoad;
    this.drawCrispText(x, `G ${t.gLoad.toFixed(1)}`, bx + 2, rowY, t.overGWarning ? RED : PHOSPHOR_BRIGHT);
    rowY += 15;
    x.font = `600 11px ${MONO}`;
    this.drawCrispText(x, `PK ${gPeak.toFixed(1)}G`, bx + 2, rowY, PHOSPHOR_MID);
    x.restore();
  }

  private drawRightColumn(x: CanvasRenderingContext2D, t: JetTelemetry, cy: number): void {
    const altInfo = resolveAltitudeTelemetry(t);
    const inAir = Boolean(t.airWorld);
    const altM = inAir ? altInfo.aglM : t.altKm * 1000;
    const pull = inAir && (altInfo.gpwsMode === 'pull-up' || t.warning === 1);
    const caut = inAir && altInfo.gpwsMode === 'caution';
    const altColor = pull ? RED : caut ? AMBER : PHOSPHOR_BRIGHT;

    const boxW = 92;
    const boxH = 30;
    const rx = 512 - 10;
    const bx = rx - boxW;
    const by = cy - 15;

    x.save();
    // Vertical scrolling altitude scale ticks (left edge of right box, x = bx)
    const tapeTop = cy - 110;
    const tapeBot = cy + 105;
    x.save();
    x.fillStyle = 'rgba(3, 14, 10, 0.34)';
    x.fillRect(bx, tapeTop, 26, tapeBot - tapeTop);
    x.beginPath();
    x.rect(bx - 4, tapeTop, 42, tapeBot - tapeTop);
    x.clip();
    x.strokeStyle = PHOSPHOR_MID;
    x.lineWidth = 1.5;
    x.beginPath();
    x.moveTo(bx, tapeTop);
    x.lineTo(bx, tapeBot);
    x.stroke();

    if (inAir && altM < 45000) {
      const step = altM < 2500 ? 100 : 500;
      const pxPerM = step === 100 ? 0.22 : 0.044;
      const span = step * 5;
      const minA = Math.max(0, Math.floor((altM - span) / step) * step);
      const maxA = Math.ceil((altM + span) / step) * step;
      x.font = `700 10px ${MONO}`;
      x.textAlign = 'left';
      for (let a = minA; a <= maxA; a += step) {
        const ty = cy - (a - altM) * pxPerM;
        if (ty < tapeTop || ty > tapeBot || Math.abs(ty - cy) < 19) continue;
        const major = a % (step * 2) === 0;
        x.strokeStyle = PHOSPHOR;
        x.lineWidth = major ? 1.8 : 1.2;
        x.beginPath();
        x.moveTo(bx, ty);
        x.lineTo(bx + (major ? 10 : 6), ty);
        x.stroke();
        if (major) {
          const lbl = a >= 1000 ? `${(a / 1000).toFixed(1)}K` : String(a);
          this.drawCrispText(x, lbl, bx + 12, ty + 3.5, PHOSPHOR_MID);
        }
      }
    }
    x.restore();

    // Boxed digital AGL / ALT readout with pointer caret
    x.fillStyle = BOX_BG;
    x.strokeStyle = altColor;
    x.lineWidth = 1.9;
    x.beginPath();
    x.moveTo(rx, by);
    x.lineTo(bx + 7, by);
    x.lineTo(bx - 2, cy);
    x.lineTo(bx + 7, by + boxH);
    x.lineTo(rx, by + boxH);
    x.closePath();
    x.fill();
    x.stroke();

    x.font = `700 10px ${MONO}`;
    x.textAlign = 'right';
    const altHdr = inAir ? (altM < 1500 ? 'R-AGL' : 'AGL') : 'ALT';
    this.drawCrispText(x, altHdr, rx - 2, by - 5, pull ? RED : PHOSPHOR_MID);

    x.fillStyle = altColor;
    x.font = `700 17px ${MONO}`;
    x.fillText(inAir ? formatAltitudeMeters(altM) : formatDistance(t.altKm), rx - 6, by + 21);

    // Secondary MSL / VSI / T/W / Ps / Fuel readouts
    x.font = `700 12.5px ${MONO}`;
    let rowY = by + 48;

    if (inAir) {
      this.drawCrispText(x, `MSL ${formatAltitudeMeters(altInfo.mslM)}`, rx - 2, rowY, CYAN);
      rowY += 16;
    }

    const vsi = Math.round(t.verticalSpeedMps ?? 0);
    this.drawCrispText(x, `VS ${vsi >= 0 ? '+' : ''}${vsi}`, rx - 2, rowY, vsi >= 0 ? PHOSPHOR : AMBER);
    rowY += 16;

    const tw = t.twRatio ?? 0;
    this.drawCrispText(x, `T/W ${tw.toFixed(2)}`, rx - 2, rowY, tw >= 1 ? CYAN : PHOSPHOR_MID);
    rowY += 16;

    if (t.specificExcessPowerMps !== undefined) {
      const ps = Math.round(t.specificExcessPowerMps);
      const arrow = ps >= 2 ? '▲' : ps <= -2 ? '▼' : '·';
      this.drawCrispText(x, `Ps ${ps >= 0 ? '+' : ''}${ps}${arrow}`, rx - 2, rowY, ps >= 0 ? PHOSPHOR : AMBER);
      rowY += 16;
    }

    const fuelPct = Math.round(clamp((t.fuelFrac ?? t.boostEnergy) * 100, 0, 100));
    this.drawCrispText(
      x,
      `FUEL ${fuelPct}%`,
      rx - 2,
      rowY,
      fuelPct <= 15 ? RED : fuelPct <= 30 ? AMBER : PHOSPHOR_MID,
    );
    rowY += 15;

    x.font = `600 11px ${MONO}`;
    this.drawCrispText(x, t.nearest.toUpperCase(), rx - 2, rowY, PHOSPHOR_DIM);
    x.restore();
  }

  private drawCautions(
    x: CanvasRenderingContext2D,
    t: JetTelemetry,
    cx: number,
    cy: number,
  ): void {
    const blink = Math.floor(t.timeSec * 4) % 2 === 0;
    const altInfo = resolveAltitudeTelemetry(t);
    const pullUp = t.warning === 1 || (Boolean(t.airWorld) && altInfo.gpwsMode === 'pull-up');
    const terrainCaut = Boolean(t.airWorld) && altInfo.gpwsMode === 'caution';

    x.save();
    x.textAlign = 'center';

    if (pullUp && blink) {
      // Flashing fighter GPWS break-X / double pull-up chevron cue
      this.strokePathWithHalo(x, RED, 3.2, () => {
        x.beginPath();
        x.moveTo(cx - 44, cy + 58);
        x.lineTo(cx, cy + 32);
        x.lineTo(cx + 44, cy + 58);
        x.moveTo(cx - 32, cy + 72);
        x.lineTo(cx, cy + 52);
        x.lineTo(cx + 32, cy + 72);
      });
      x.fillStyle = 'rgba(64, 6, 8, 0.86)';
      x.strokeStyle = RED;
      x.lineWidth = 2;
      x.fillRect(cx - 88, cy + 78, 176, 32);
      x.strokeRect(cx - 88, cy + 78, 176, 32);
      x.fillStyle = RED;
      x.font = `700 24px ${MONO}`;
      x.fillText('PULL UP', cx, cy + 102);
    } else if (t.spinWarning && blink) {
      x.fillStyle = 'rgba(64, 6, 8, 0.84)';
      x.strokeStyle = RED;
      x.lineWidth = 1.8;
      x.fillRect(cx - 140, cy + 74, 280, 26);
      x.strokeRect(cx - 140, cy + 74, 280, 26);
      x.fillStyle = RED;
      x.font = `700 15px ${MONO}`;
      x.fillText('SPIN · STICK FWD + OPP RUDDER', cx, cy + 92);
    } else if (t.overGWarning && blink) {
      x.fillStyle = 'rgba(54, 28, 4, 0.84)';
      x.strokeStyle = AMBER;
      x.lineWidth = 1.8;
      x.fillRect(cx - 84, cy + 74, 168, 26);
      x.strokeRect(cx - 84, cy + 74, 168, 26);
      x.fillStyle = AMBER;
      x.font = `700 16px ${MONO}`;
      x.fillText(`OVER-G ${t.gLoad.toFixed(1)}G`, cx, cy + 92);
    } else if (terrainCaut && blink) {
      x.fillStyle = 'rgba(54, 32, 4, 0.82)';
      x.strokeStyle = AMBER;
      x.lineWidth = 1.8;
      x.fillRect(cx - 94, cy + 74, 188, 26);
      x.strokeRect(cx - 94, cy + 74, 188, 26);
      x.fillStyle = AMBER;
      x.font = `700 15px ${MONO}`;
      x.fillText('TERRAIN · CAUTION', cx, cy + 92);
    } else if (t.alphaWarning && blink) {
      x.font = `700 15px ${MONO}`;
      this.drawCrispText(x, `HIGH AOA ${(t.aoaDeg ?? 0).toFixed(0)}°`, cx, cy + 92, AMBER);
    }

    if (t.maneuver && t.maneuver !== 'none') {
      x.font = `700 13px ${MONO}`;
      this.drawCrispText(x, t.maneuver.toUpperCase(), cx, 70, CYAN);
    }
    x.restore();
  }

  private drawFooter(x: CanvasRenderingContext2D, t: JetTelemetry, cx: number, LW: number, LH: number): void {
    const barW = 248;
    const bx = cx - barW * 0.5;
    const by = LH - 66;
    const abStage = t.abStage ?? (t.boost > 0.66 ? 3 : t.boost > 0.33 ? 2 : t.boost > 0 ? 1 : 0);

    // Throttle + AB Z1-Z3 segmented bar
    x.save();
    x.fillStyle = BOX_BG;
    x.fillRect(bx - 2, by - 2, barW + 4, 19);

    const milW = barW * 0.72;
    const abW = barW * 0.28;
    x.lineWidth = 1.4;
    x.strokeStyle = PHOSPHOR_MID;
    x.strokeRect(bx, by, milW - 3, 9);
    x.fillStyle = abStage > 0 ? AMBER : PHOSPHOR_BRIGHT;
    x.fillRect(bx + 1, by + 1, (milW - 5) * clamp(t.throttle, 0, 1), 7);

    const segW = (abW - 2) / 3;
    for (let z = 1; z <= 3; z++) {
      const sx = bx + milW + (z - 1) * segW;
      const lit = abStage >= z;
      x.strokeStyle = lit ? AMBER : PHOSPHOR_DIM;
      x.strokeRect(sx, by, segW - 2, 9);
      if (lit) {
        x.fillStyle = AMBER;
        x.fillRect(sx + 1, by + 1, segW - 4, 7);
      }
    }

    const fuelOrBoost = t.fuelFrac ?? t.boostEnergy;
    x.fillStyle = fuelOrBoost <= 0.15 ? RED : abStage > 0 ? AMBER : PHOSPHOR_MID;
    x.fillRect(bx, by + 12, barW * clamp(fuelOrBoost, 0, 1), 3);

    // Reuse pre-allocated status pill array (zero GC)
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

    this.pills[0].text = `FBW ${fbwLbl}`;
    this.pills[0].color = fbw === 'PSM' ? CYAN : fbw === 'HIGH-G' ? AMBER : PHOSPHOR;
    this.pills[0].active = fbw !== 'NORM' || Boolean(t.tvcActive);

    this.pills[1].text = `FLP ${flp === 'COMBAT' ? 'CMB' : flp === 'LAND' ? 'LND' : 'AUTO'}`;
    this.pills[1].color = flp !== 'AUTO' ? CYAN : PHOSPHOR_MID;
    this.pills[1].active = flp !== 'AUTO';

    this.pills[2].text = t.wheelBrakeActive ? 'W-BRK' : 'BRK';
    this.pills[2].color = brkOn ? AMBER : PHOSPHOR_MID;
    this.pills[2].active = brkOn;

    this.pills[3].text = t.gearDown ? 'GEAR DN' : 'GEAR UP';
    this.pills[3].color = t.gearDown ? PHOSPHOR_BRIGHT : PHOSPHOR_MID;
    this.pills[3].active = t.gearDown;

    this.pills[4].text = abLbl;
    this.pills[4].color = t.supercruise ? CYAN : abStage > 0 ? AMBER : t.abArmed ? PHOSPHOR : PHOSPHOR_MID;
    this.pills[4].active = Boolean(t.supercruise || abStage > 0 || t.abArmed);

    x.font = `700 11px ${MONO}`;
    x.textAlign = 'center';
    const gap = 6;
    const totalW = LW - 28 - gap * (this.pills.length - 1);
    const pillW = totalW / this.pills.length;
    const py = LH - 38;
    const pillH = 23;

    for (let i = 0; i < this.pills.length; i++) {
      const p = this.pills[i];
      const px = 14 + i * (pillW + gap);
      x.fillStyle = p.active ? 'rgba(6, 30, 20, 0.84)' : 'rgba(3, 12, 9, 0.68)';
      x.strokeStyle = p.color;
      x.lineWidth = p.active ? 1.8 : 1.1;
      x.fillRect(px, py, pillW, pillH);
      x.strokeRect(px, py, pillW, pillH);
      x.fillStyle = p.color;
      x.fillText(p.text, px + pillW * 0.5, py + 15.5);
    }
    x.restore();
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.texture.dispose();
  }
}
