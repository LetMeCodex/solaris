import * as THREE from 'three';
import type { JetTelemetry } from './JetController';
import { formatDistance, formatEta, formatSpeed } from './worlds';

/**
 * The SX-1's cockpit: panel, glare shield, HUD combiner and three live displays.
 *
 *  - NAV: the Solar System from above (ecliptic), the real positions of the planets now, on a
 *    log-radius scale so Mercury and Neptune both fit, with the jet and the target marked.
 *  - TGT: the target, its range and closing speed, and an attitude ball.
 *  - ENG: throttle, boost energy, speed, drive state.
 *
 * Built in the jet frame (metres, nose -Z), shown only in the cockpit view.
 */

export interface NavPoint {
  name: string;
  /** Heliocentric ecliptic position in render units (x, z used). */
  x: number;
  z: number;
  colour: string;
}

const S = 256;

function screen(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; tex: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { canvas, ctx, tex };
}

const MONO = '"JetBrains Mono", ui-monospace, monospace';
const MINT = '#6dfcc0';
const AMBER = '#f4cd72';

export class Cockpit {
  public readonly group = new THREE.Group();
  private nav = screen();
  private tgt = screen();
  private eng = screen();
  private disposables: Array<{ dispose(): void }> = [];
  private lastDraw = -1;

  constructor() {
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x15181d, roughness: 0.85, metalness: 0.2 });
    const shieldMat = new THREE.MeshStandardMaterial({ color: 0x0b0c0f, roughness: 0.95 });
    const bezelMat = new THREE.MeshStandardMaterial({ color: 0x23272e, roughness: 0.6, metalness: 0.4 });
    this.disposables.push(panelMat, shieldMat, bezelMat, this.nav.tex, this.tgt.tex, this.eng.tex);

    // Panel: tilted back towards the pilot, below the eye line
    const panelGeo = new THREE.BoxGeometry(1.0, 0.34, 0.08);
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(0, 0.7, -5.02);
    panel.rotation.x = -0.32;
    this.group.add(panel);
    // Glare shield over it
    const shieldGeo = new THREE.BoxGeometry(0.92, 0.04, 0.3);
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.position.set(0, 0.875, -5.12);
    this.group.add(shield);
    // Side consoles
    const consoleGeo = new THREE.BoxGeometry(0.16, 0.12, 0.9);
    for (const side of [-1, 1]) {
      const c = new THREE.Mesh(consoleGeo, panelMat);
      c.position.set(side * 0.38, 0.68, -4.45);
      this.group.add(c);
    }
    this.disposables.push(panelGeo, shieldGeo, consoleGeo);

    // Displays
    const faceGeo = new THREE.PlaneGeometry(0.25, 0.25);
    const bezelGeo = new THREE.BoxGeometry(0.28, 0.28, 0.02);
    this.disposables.push(faceGeo, bezelGeo);
    const xs = [-0.31, 0, 0.31];
    const screens = [this.nav, this.tgt, this.eng];
    for (let i = 0; i < 3; i++) {
      const holder = new THREE.Group();
      holder.position.set(xs[i], 0.71, -4.975);
      holder.rotation.x = -0.32;
      const bezel = new THREE.Mesh(bezelGeo, bezelMat);
      const mat = new THREE.MeshBasicMaterial({ map: screens[i].tex, toneMapped: false });
      this.disposables.push(mat);
      const face = new THREE.Mesh(faceGeo, mat);
      face.position.z = 0.012;
      holder.add(bezel, face);
      this.group.add(holder);
    }

    this.group.traverse((o) => (o.frustumCulled = false));
    this.group.visible = false;
  }

  /** Redraw the displays (a few times a second is plenty). */
  public update(t: JetTelemetry, planets: NavPoint[], jet: { x: number; z: number }, target: { x: number; z: number } | null): void {
    if (!this.group.visible) return;
    if (t.timeSec - this.lastDraw < 0.15) return;
    this.lastDraw = t.timeSec;
    this.drawNav(planets, jet, target, t);
    this.drawTarget(t);
    this.drawEngine(t);
    this.nav.tex.needsUpdate = true;
    this.tgt.tex.needsUpdate = true;
    this.eng.tex.needsUpdate = true;
  }

  private frame(ctx: CanvasRenderingContext2D, title: string): void {
    ctx.fillStyle = '#020604';
    ctx.fillRect(0, 0, S, S);
    const g = ctx.createRadialGradient(S / 2, S / 2, 10, S / 2, S / 2, S * 0.75);
    g.addColorStop(0, 'rgba(30,70,55,0.35)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    ctx.font = `600 13px ${MONO}`;
    ctx.fillStyle = MINT;
    ctx.textAlign = 'left';
    ctx.fillText(title, 10, 20);
    ctx.strokeStyle = 'rgba(109,252,192,0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(4.5, 4.5, S - 9, S - 9);
  }

  private drawNav(planets: NavPoint[], jet: { x: number; z: number }, target: { x: number; z: number } | null, t: JetTelemetry): void {
    const ctx = this.nav.ctx;
    this.frame(ctx, 'NAV · SYSTEM');
    const cx = S / 2;
    const cy = S / 2 + 8;
    // Log radius: 0.3 AU → 10 px, 40 AU → 110 px (1 AU = 56,355 units)
    const AU = 56355;
    const map = (x: number, z: number): [number, number] => {
      const r = Math.hypot(x, z) / AU;
      const rr = 10 + (Math.log(Math.max(r, 0.3) / 0.3) / Math.log(40 / 0.3)) * 100;
      const a = Math.atan2(z, x);
      return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
    };
    ctx.strokeStyle = 'rgba(109,252,192,0.14)';
    for (const p of planets) {
      const [px, py] = map(p.x, p.z);
      ctx.beginPath();
      ctx.arc(cx, cy, Math.hypot(px - cx, py - cy), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = AMBER;
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = `10px ${MONO}`;
    for (const p of planets) {
      const [px, py] = map(p.x, p.z);
      ctx.fillStyle = p.colour;
      ctx.beginPath();
      ctx.arc(px, py, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(238,233,222,0.55)';
      ctx.fillText(p.name.slice(0, 3).toUpperCase(), px + 4, py - 3);
    }
    if (target) {
      const [tx, ty] = map(target.x, target.z);
      ctx.strokeStyle = AMBER;
      ctx.strokeRect(tx - 5, ty - 5, 10, 10);
    }
    const [jx, jy] = map(jet.x, jet.z);
    ctx.fillStyle = MINT;
    ctx.beginPath();
    ctx.moveTo(jx, jy - 6);
    ctx.lineTo(jx + 4, jy + 4);
    ctx.lineTo(jx - 4, jy + 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(238,233,222,0.6)';
    ctx.fillText(`${(Math.hypot(jet.x, jet.z) / AU).toFixed(3)} AU FROM SUN`, 10, S - 12);
    ctx.fillText(t.anchor ? `FRAME ${t.anchor.toUpperCase()}` : 'FRAME SUN', 10, S - 26);
  }

  private drawTarget(t: JetTelemetry): void {
    const ctx = this.tgt.ctx;
    this.frame(ctx, 'TGT');
    ctx.font = `600 22px ${MONO}`;
    ctx.fillStyle = AMBER;
    ctx.fillText(t.target.toUpperCase(), 12, 54);
    ctx.font = `14px ${MONO}`;
    ctx.fillStyle = 'rgba(238,233,222,0.8)';
    ctx.fillText(`RNG ${formatDistance(t.targetDistKm)}`, 12, 80);
    ctx.fillText(`CLS ${formatSpeed(Math.max(0, t.closingMps))}`, 12, 100);
    ctx.fillText(`ETA ${formatEta(t.targetEtaS)}`, 12, 120);
    // Attitude ball
    const cx = S / 2;
    const cy = 188;
    const r = 50;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.translate(cx, cy);
    ctx.rotate((-t.rollDeg * Math.PI) / 180);
    const off = (t.pitchDeg / 90) * r;
    ctx.fillStyle = '#1b3a5a';
    ctx.fillRect(-r * 2, -r * 2, r * 4, r * 2 + off);
    ctx.fillStyle = '#4a3420';
    ctx.fillRect(-r * 2, off, r * 4, r * 2);
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(-r, off);
    ctx.lineTo(r, off);
    ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = MINT;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 24, cy);
    ctx.lineTo(cx - 8, cy);
    ctx.moveTo(cx + 8, cy);
    ctx.lineTo(cx + 24, cy);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(109,252,192,0.5)';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  private drawEngine(t: JetTelemetry): void {
    const ctx = this.eng.ctx;
    this.frame(ctx, 'ENG · DRIVE');
    const bar = (x: number, label: string, v: number, colour: string): void => {
      ctx.strokeStyle = 'rgba(109,252,192,0.5)';
      ctx.strokeRect(x, 40, 34, 150);
      ctx.fillStyle = colour;
      ctx.fillRect(x + 3, 40 + 147 * (1 - v), 28, 147 * v);
      ctx.fillStyle = 'rgba(238,233,222,0.7)';
      ctx.font = `11px ${MONO}`;
      ctx.textAlign = 'center';
      ctx.fillText(label, x + 17, 208);
      ctx.fillText(`${Math.round(v * 100)}`, x + 17, 224);
      ctx.textAlign = 'left';
    };
    bar(18, 'THR', t.throttle, MINT);
    bar(64, 'BST', t.boostEnergy, t.boost > 0 ? '#ff9a50' : AMBER);
    ctx.font = `600 15px ${MONO}`;
    ctx.fillStyle = MINT;
    ctx.fillText(formatSpeed(t.speedMps), 112, 60);
    ctx.font = `12px ${MONO}`;
    ctx.fillStyle = 'rgba(238,233,222,0.7)';
    ctx.fillText(t.airWorld ? `AIR  M ${t.mach.toFixed(2)}` : 'VACUUM', 112, 84);
    ctx.fillText(`G    ${t.gLoad.toFixed(1)}`, 112, 104);
    ctx.fillText(`FA   ${t.assist ? 'ON' : 'OFF'}`, 112, 124);
    ctx.fillText(`ALT  ${formatDistance(t.altKm)}`, 112, 144);
    if (t.warning) {
      ctx.fillStyle = '#ff7a66';
      ctx.font = `700 14px ${MONO}`;
      ctx.fillText(t.warning === 1 ? 'PULL UP' : 'HEAT', 112, 176);
    }
  }

  public dispose(): void {
    for (const d of this.disposables) d.dispose();
    this.disposables = [];
  }
}
