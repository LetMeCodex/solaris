import * as THREE from 'three';
import type { JetTelemetry } from './JetController';
import { formatDistance, formatSpeed } from './worlds';

/**
 * The jet's own head-up display: symbology drawn on the HUD combiner glass in the cockpit, the
 * way a real fighter's HUD works, instead of on the screen. A canvas texture on a pane just in
 * front of the combiner, emissive green, scaled so that one degree on the glass covers one degree
 * of the view from the pilot's eye (the pitch ladder sits on the real horizon).
 */

const W = 512;
const H = 576;
const GREEN = 'rgba(120,255,170,0.95)';
const GREEN_DIM = 'rgba(120,255,170,0.55)';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

export class HudGlass {
  public readonly mesh: THREE.Mesh;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private texture: THREE.CanvasTexture;
  private material: THREE.MeshBasicMaterial;
  /** Pixels on the canvas per degree seen from the eye. */
  private pxPerDeg: number;

  /**
   * @param centre centre of the glass, jet frame (metres)
   * @param eye the pilot's eye, jet frame
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
      map: this.texture, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide,
    });
    const heightM = (widthM * H) / W;
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(widthM, heightM), this.material);
    this.mesh.position.copy(centre);
    this.mesh.renderOrder = 20;
    this.mesh.frustumCulled = false;
    const dist = Math.max(0.2, eye.distanceTo(centre));
    const degAcross = THREE.MathUtils.radToDeg(2 * Math.atan(widthM / 2 / dist));
    this.pxPerDeg = W / degAcross;
  }

  public update(t: JetTelemetry, visible: boolean): void {
    this.mesh.visible = visible;
    if (!visible) return;
    const x = this.ctx;
    x.clearRect(0, 0, W, H);
    x.lineCap = 'round';
    x.lineJoin = 'round';
    x.strokeStyle = GREEN;
    x.fillStyle = GREEN;
    x.lineWidth = 2.2;
    x.shadowColor = 'rgba(120,255,170,0.8)';
    x.shadowBlur = 6;
    const cx = W / 2;
    const cy = H * 0.46;
    const ppd = this.pxPerDeg;

    // Pitch ladder on the real horizon
    if (t.hasHorizon) {
      x.save();
      x.beginPath();
      x.rect(30, 40, W - 60, H - 120);
      x.clip();
      x.translate(cx, cy);
      x.rotate((-t.rollDeg * Math.PI) / 180);
      for (let deg = -90; deg <= 90; deg += 5) {
        const y = (t.pitchDeg - deg) * ppd;
        if (Math.abs(y) > H * 0.6) continue;
        const half = deg === 0 ? W * 0.42 : W * 0.13;
        const gap = deg === 0 ? 40 : 34;
        x.setLineDash(deg < 0 ? [10, 7] : []);
        x.beginPath();
        x.moveTo(-half, y);
        x.lineTo(-gap, y);
        x.moveTo(gap, y);
        x.lineTo(half, y);
        x.stroke();
        x.setLineDash([]);
        if (deg !== 0 && deg % 10 === 0) {
          x.font = `500 18px ${MONO}`;
          x.textAlign = 'right';
          x.fillText(String(Math.abs(deg)), -half - 8, y + 6);
        }
      }
      x.restore();
    }

    // Waterline (where the nose points) and the flight-path marker
    x.beginPath();
    x.moveTo(cx - 34, cy);
    x.lineTo(cx - 14, cy);
    x.lineTo(cx - 7, cy + 10);
    x.lineTo(cx, cy);
    x.lineTo(cx + 7, cy + 10);
    x.lineTo(cx + 14, cy);
    x.lineTo(cx + 34, cy);
    x.stroke();

    // Speed (left) and altitude (right) as plain numbers, the way modern HUDs do
    x.font = `600 26px ${MONO}`;
    x.textAlign = 'left';
    x.fillText(formatSpeed(t.speedMps), 34, cy + 8);
    x.textAlign = 'right';
    x.fillText(formatDistance(t.altKm), W - 34, cy + 8);
    x.font = `500 16px ${MONO}`;
    x.fillStyle = GREEN_DIM;
    x.textAlign = 'left';
    x.fillText(t.airDensity > 0 ? `M ${t.mach.toFixed(2)}  ${t.gLoad.toFixed(1)}G` : 'VAC', 34, cy + 32);
    x.textAlign = 'right';
    x.fillText(t.nearest.toUpperCase(), W - 34, cy + 32);

    // Heading
    if (t.hasHorizon) {
      x.fillStyle = GREEN;
      x.font = `600 22px ${MONO}`;
      x.textAlign = 'center';
      x.fillText(String(Math.round(t.headingDeg)).padStart(3, '0'), cx, 34);
    }

    // Throttle and boost, a thin bar at the foot of the glass
    const by = H - 46;
    x.lineWidth = 1.6;
    x.strokeStyle = GREEN_DIM;
    x.strokeRect(cx - 120, by, 240, 8);
    x.fillStyle = GREEN;
    x.fillRect(cx - 120, by, 240 * t.throttle, 8);
    x.fillStyle = t.boost > 0 ? 'rgba(255,190,110,0.95)' : GREEN_DIM;
    x.fillRect(cx - 120, by + 14, 240 * t.boostEnergy, 3);

    // Warnings
    if (t.warning === 1 && Math.floor(t.timeSec * 4) % 2 === 0) {
      x.fillStyle = GREEN;
      x.font = `700 34px ${MONO}`;
      x.textAlign = 'center';
      x.fillText('PULL UP', cx, cy + 120);
    }
    this.texture.needsUpdate = true;
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.texture.dispose();
  }
}
