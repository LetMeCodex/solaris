import * as THREE from 'three';
import type { JetModel } from './JetModel';

/**
 * Working cockpit controls.
 *
 *  - The airframe's own control stick and throttle grip, cut out of its merged meshes, move with
 *    the pilot's inputs: the stick tilts with pitch and roll, the throttle slides with the power.
 *  - A landing-gear lever and a guarded afterburner-arm switch on the left console, clickable.
 *  - A destination display on the console: the worlds, or the landmarks of the world below; a
 *    click on a row sets the target (or starts the landing autopilot).
 */

export interface CockpitLayout {
  /** Boxes (jet frame) holding the stick and throttle triangles, and the pivots they turn on. */
  stickBox: THREE.Box3;
  stickPivot: THREE.Vector3;
  throttleBox: THREE.Box3;
  throttlePivot: THREE.Vector3;
  /** A flat spot on the left console for the added controls and display. */
  console: THREE.Vector3;
}

export interface DestinationRow {
  label: string;
  sub: string;
  active: boolean;
}

export type CockpitAction = { kind: 'gear' } | { kind: 'arm' } | { kind: 'row'; index: number };

const S = 512;
const ROWS = 9;
const MONO = '"JetBrains Mono", ui-monospace, monospace';

export class CockpitControls {
  public readonly group = new THREE.Group();
  private stick: THREE.Group | null;
  private throttle: THREE.Group | null;
  private gearLever: THREE.Group;
  private armGuard: THREE.Mesh;
  private gearLamp: THREE.MeshBasicMaterial;
  private armLamp: THREE.MeshBasicMaterial;
  private display: THREE.Mesh;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private texture: THREE.CanvasTexture;
  private pickables: THREE.Object3D[] = [];
  private disposables: Array<{ dispose(): void }> = [];
  private lastDraw = -1;
  private gearAngle = 0;
  private guardAngle = 0;
  private stickRest = new THREE.Euler();
  private throttleRest = new THREE.Euler();

  constructor(model: JetModel, layout: CockpitLayout) {
    this.stick = model.extractPart(layout.stickBox, layout.stickPivot);
    this.throttle = model.extractPart(layout.throttleBox, layout.throttlePivot);
    if (this.stick) this.stickRest.copy(this.stick.rotation);
    if (this.throttle) this.throttleRest.copy(this.throttle.rotation);

    const metal = new THREE.MeshStandardMaterial({ color: 0x8a8f96, metalness: 0.8, roughness: 0.35 });
    const black = new THREE.MeshStandardMaterial({ color: 0x15171a, roughness: 0.7 });
    const white = new THREE.MeshStandardMaterial({ color: 0xe8e8e0, roughness: 0.5 });
    const redPaint = new THREE.MeshStandardMaterial({ color: 0xb4141a, roughness: 0.45 });
    this.gearLamp = new THREE.MeshBasicMaterial({ color: 0x33ff66, toneMapped: false });
    this.armLamp = new THREE.MeshBasicMaterial({ color: 0xffaa22, toneMapped: false });
    this.disposables.push(metal, black, white, redPaint, this.gearLamp, this.armLamp);
    const add = <T extends THREE.BufferGeometry>(g: T): T => {
      this.disposables.push(g);
      return g;
    };
    const c = layout.console;
    this.group.position.copy(c);

    // Gear lever: a short arm with the wheel-shaped knob pilots know by feel, and a gear lamp
    const plate = new THREE.Mesh(add(new THREE.BoxGeometry(0.11, 0.008, 0.16)), black);
    plate.position.set(-0.01, 0, 0.05);
    this.gearLever = new THREE.Group();
    this.gearLever.position.set(-0.03, 0.004, 0.03);
    const shaft = new THREE.Mesh(add(new THREE.CylinderGeometry(0.005, 0.005, 0.07, 10)), metal);
    shaft.position.y = 0.035;
    const knob = new THREE.Mesh(add(new THREE.TorusGeometry(0.014, 0.006, 10, 20)), white);
    knob.position.y = 0.072;
    knob.rotation.y = Math.PI / 2;
    const knobHit = new THREE.Mesh(add(new THREE.SphereGeometry(0.03, 8, 6)), new THREE.MeshBasicMaterial({ visible: false }));
    knobHit.position.y = 0.06;
    knobHit.userData.action = 'gear';
    this.gearLever.add(shaft, knob, knobHit);
    const gearLampMesh = new THREE.Mesh(add(new THREE.CircleGeometry(0.006, 12)), this.gearLamp);
    gearLampMesh.rotation.x = -Math.PI / 2;
    gearLampMesh.position.set(-0.03, 0.0045, 0.09);

    // Afterburner arm: a toggle under a hinged red guard, and an amber lamp
    const toggle = new THREE.Mesh(add(new THREE.CylinderGeometry(0.003, 0.004, 0.025, 8)), metal);
    toggle.position.set(0.025, 0.012, 0.03);
    const guardPivot = new THREE.Group();
    guardPivot.position.set(0.025, 0.004, 0.012);
    this.armGuard = new THREE.Mesh(add(new THREE.BoxGeometry(0.026, 0.024, 0.036)), redPaint);
    this.armGuard.position.set(0, 0.012, 0.018);
    this.armGuard.userData.action = 'arm';
    guardPivot.add(this.armGuard);
    const armLampMesh = new THREE.Mesh(add(new THREE.CircleGeometry(0.006, 12)), this.armLamp);
    armLampMesh.rotation.x = -Math.PI / 2;
    armLampMesh.position.set(0.025, 0.0045, 0.09);
    (this.group.userData as { guardPivot?: THREE.Group }).guardPivot = guardPivot;

    // Destination display, set into the console ahead of the controls, tilted to the pilot
    this.canvas = document.createElement('canvas');
    this.canvas.width = S;
    this.canvas.height = Math.round(S * 0.75);
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = 8;
    const screenMat = new THREE.MeshBasicMaterial({ map: this.texture, toneMapped: false });
    this.disposables.push(this.texture, screenMat);
    this.display = new THREE.Mesh(add(new THREE.PlaneGeometry(0.15, 0.1125)), screenMat);
    this.display.position.set(0.0, 0.03, -0.11);
    this.display.rotation.x = -0.75;
    this.display.userData.action = 'display';
    const bezel = new THREE.Mesh(add(new THREE.BoxGeometry(0.162, 0.124, 0.008)), black);
    bezel.position.copy(this.display.position);
    bezel.rotation.copy(this.display.rotation);
    bezel.translateZ(-0.0045);

    this.group.add(plate, this.gearLever, gearLampMesh, toggle, guardPivot, armLampMesh, bezel, this.display);
    this.group.traverse((o) => {
      o.frustumCulled = false;
      if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).receiveShadow = true;
    });
    this.pickables = [knobHit, this.armGuard, this.display];
    model.root.add(this.group);
  }

  /** What a click at this ray would operate, if anything. */
  public pick(ray: THREE.Raycaster): CockpitAction | null {
    const hit = ray.intersectObjects(this.pickables, false)[0];
    if (!hit) return null;
    const a = hit.object.userData.action as string;
    if (a === 'gear') return { kind: 'gear' };
    if (a === 'arm') return { kind: 'arm' };
    if (a === 'display' && hit.uv) {
      const y = (1 - hit.uv.y) * this.canvas.height;
      const row = Math.floor((y - 70) / ((this.canvas.height - 82) / ROWS));
      return row >= 0 && row < ROWS ? { kind: 'row', index: row } : null;
    }
    return null;
  }

  public update(dt: number, timeSec: number, pitch: number, roll: number, throttle: number, gearDown: boolean, abArmed: boolean, title: string, rows: DestinationRow[], visible: boolean): void {
    this.group.visible = visible;
    const k = 1 - Math.exp(-14 * dt);
    if (this.stick) {
      // Pull back to climb: the grip comes towards the pilot; roll right: it leans right
      this.stick.rotation.x += (this.stickRest.x + pitch * 0.24 - this.stick.rotation.x) * k;
      this.stick.rotation.z += (this.stickRest.z - roll * 0.24 - this.stick.rotation.z) * k;
    }
    if (this.throttle) this.throttle.rotation.x += (this.throttleRest.x - (throttle - 0.4) * 0.7 - this.throttle.rotation.x) * k;
    this.gearAngle += ((gearDown ? 0.5 : -0.35) - this.gearAngle) * k;
    this.gearLever.rotation.x = this.gearAngle;
    this.gearLamp.color.setHex(gearDown ? 0x33ff66 : 0x113318);
    const gp = (this.group.userData as { guardPivot?: THREE.Group }).guardPivot;
    this.guardAngle += ((abArmed ? -1.9 : 0) - this.guardAngle) * k;
    if (gp) gp.rotation.x = this.guardAngle;
    this.armLamp.color.setHex(abArmed ? 0xffaa22 : 0x332208);
    if (visible && timeSec - this.lastDraw > 0.2) {
      this.lastDraw = timeSec;
      this.drawDisplay(title, rows);
    }
  }

  private drawDisplay(title: string, rows: DestinationRow[]): void {
    const x = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    x.fillStyle = '#020604';
    x.fillRect(0, 0, W, H);
    x.strokeStyle = 'rgba(109,252,192,0.35)';
    x.strokeRect(4.5, 4.5, W - 9, H - 9);
    x.fillStyle = '#6dfcc0';
    x.font = `600 22px ${MONO}`;
    x.textAlign = 'left';
    x.fillText('DEST', 16, 34);
    x.fillStyle = 'rgba(238,233,222,0.6)';
    x.font = `500 16px ${MONO}`;
    x.fillText(title, 90, 34);
    const rowH = (H - 82) / ROWS;
    rows.slice(0, ROWS).forEach((r, i) => {
      const y = 70 + i * rowH;
      if (r.active) {
        x.fillStyle = 'rgba(244,205,114,0.16)';
        x.fillRect(10, y, W - 20, rowH - 3);
      }
      x.fillStyle = r.active ? '#f4cd72' : 'rgba(238,233,222,0.88)';
      x.font = `500 19px ${MONO}`;
      x.fillText(r.label.slice(0, 22), 18, y + rowH * 0.62);
      x.fillStyle = 'rgba(238,233,222,0.45)';
      x.font = `400 15px ${MONO}`;
      x.textAlign = 'right';
      x.fillText(r.sub, W - 18, y + rowH * 0.62);
      x.textAlign = 'left';
    });
    this.texture.needsUpdate = true;
  }

  public dispose(): void {
    for (const d of this.disposables) d.dispose();
    this.disposables = [];
  }
}
