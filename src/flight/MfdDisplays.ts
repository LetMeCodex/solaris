import * as THREE from 'three';
import { perf } from '../rendering/Performance';
import {
  createDefaultMfdPages,
  createJetSurfaceState,
  type JetSurfaceState,
  type JetTelemetry,
  type MfdPage,
  type MfdPageMap,
  type MfdSlot,
} from './JetTelemetry';
import { formatDistance, formatEta, formatSpeed } from './worlds';
import { formatAltitudeMeters, resolveAltitudeTelemetry } from './TacticalHud';

/**
 * Interactive 3-screen cockpit MFD atlas (`dynamic_mfd` material on Gripen / Su-30 / cockpit mesh).
 *
 * Each display (`left`, `centre`, `right`) renders any of four pages:
 *  - `PFD`: synthetic-vision HUD underlay with artificial horizon, `-o-` FPM, gear AoA E-bracket,
 *    airspeed/altitude/VSI tapes, heading and waypoint readout.
 *  - `FCS`: live airframe-specific control surface diagram (Gripen canards+elevons, Su-30 twin tails,
 *    slats, flaperons, 3D/2D TVC thrust-vectoring gimbals), stick/pedal box, and live `α / G` envelope.
 *  - `ENG`: N1/AB zones 1-3, thrust & T/W, Specific Excess Power (`Ps`), fuel flow & remaining mass,
 *    supercruise badge, dynamic pressure (`q`), and atmosphere telemetry.
 *  - `NAV`: 3D moving-map underlay with tactical heading rose, range rings, target intercept vector,
 *    landing waypoint, nearby contacts, and world/weather coordinates.
 *
 * Zero `shadowBlur` calls are made anywhere in 2D canvas drawing for predictable frame budgets.
 */

const RES = 2048;
const S = 1024;
const PFD_FOV = 58;
const STANDBY_W = 1024;
const STANDBY_H = 512;

const MINT = '#58ffaa';
const MINT_DIM = 'rgba(88, 255, 170, 0.56)';
const AMBER = '#ffbe4d';
const CYAN = '#6be6ff';
const RED = '#ff5252';
const BG_PANEL = '#050a08';
const BG_SCRIM = 'rgba(4, 9, 7, 0.84)';
const BG_PILL = 'rgba(4, 10, 8, 0.88)';
const GRID_LINE = 'rgba(88, 255, 170, 0.18)';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

const PAGE_ORDER: readonly MfdPage[] = ['PFD', 'FCS', 'ENG', 'NAV'];
const SLOTS: readonly MfdSlot[] = ['left', 'centre', 'right'];

export interface MfdRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const SLOT_RECTS: Record<MfdSlot, MfdRect> = {
  left: { x: 8, y: 66, w: 496, h: 380 },
  centre: { x: 66, y: 520, w: 384, h: 500 },
  right: { x: 520, y: 578, w: 496, h: 380 },
};

const TAB_BAR_H = 32;

const screenVert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const screenFrag = /* glsl */ `
uniform sampler2D tCanvas;
uniform sampler2D tPfd;
uniform sampler2D tNav;
uniform float uViews;
uniform vec3 uModes;
varying vec2 vUv;
vec3 srgbToLinear(vec3 c) { return pow(max(c, vec3(0.0)), vec3(2.2)); }
// Filmic HDR rolloff so sunlit sky/clouds/ocean NEVER bleach the OLED underlay white
vec3 compressHdr(vec3 c, float exposure) {
  vec3 x = max(c, vec3(0.0)) * exposure;
  return x / (vec3(1.0) + x);
}
vec2 local(vec2 uv, vec4 r) {
  vec2 l = (uv - r.xy) / r.zw;
  return (l.x < 0.0 || l.y < 0.0 || l.x > 1.0 || l.y > 1.0) ? vec2(-1.0) : l;
}
vec3 sampleMode(float m, vec2 uv) {
  // Deep anti-glare fighter OLED black base (#050a08 in linear)
  vec3 oledBlack = vec3(0.0035, 0.0075, 0.0055);
  if (m > 1.5) {
    // NAV moving-map underlay: compressed dark tactical satellite grade so mint/amber symbology pops
    vec3 raw = texture2D(tNav, uv).rgb;
    vec3 tm = compressHdr(raw, 0.62);
    float luma = dot(tm, vec3(0.2126, 0.7152, 0.0722));
    vec3 graded = mix(vec3(luma * 0.78, luma * 0.94, luma * 0.88), tm, 0.48);
    return oledBlack + graded * 0.30;
  }
  if (m > 0.5) {
    // PFD synthetic-vision underlay: crisp dark-graded horizon/terrain without sunlit white washout
    vec3 raw = texture2D(tPfd, uv).rgb;
    vec3 tm = compressHdr(raw, 0.72);
    vec3 graded = mix(tm, tm * vec3(0.84, 0.96, 1.04), 0.35);
    return oledBlack + graded * 0.42;
  }
  return oledBlack;
}
void main() {
  vec4 sym = texture2D(tCanvas, vec2(vUv.x, 1.0 - vUv.y));
  vec3 col = vec3(0.0035, 0.0075, 0.0055);
  vec2 screenUv = vec2(0.5);
  if (uViews > 0.5) {
    vec2 lLeft = local(vUv, vec4(0.0078125, 0.564453125, 0.484375, 0.37109375));
    vec2 lCentre = local(vUv, vec4(0.064453125, 0.00390625, 0.375, 0.48828125));
    vec2 lRight = local(vUv, vec4(0.5078125, 0.064453125, 0.484375, 0.37109375));
    if (lLeft.x >= 0.0) { col = sampleMode(uModes.x, lLeft); screenUv = lLeft; }
    else if (lCentre.x >= 0.0) { col = sampleMode(uModes.y, lCentre); screenUv = lCentre; }
    else if (lRight.x >= 0.0) { col = sampleMode(uModes.z, lRight); screenUv = lRight; }
  }
  // Subtle OLED bezel vignette & anti-reflective glass coating (never milky)
  vec2 d = screenUv - 0.5;
  float vig = 1.0 - dot(d, d) * 0.24;
  col *= vig;
  // Crisp high-contrast military OLED emissive symbology
  vec3 symLin = srgbToLinear(sym.rgb) * 1.48;
  col = mix(col, symLin, sym.a);
  gl_FragColor = vec4(col, 1.0);
}`;

const standbyFrag = /* glsl */ `
uniform sampler2D tStandby;
varying vec2 vUv;
vec3 srgbToLinear(vec3 c) { return pow(max(c, vec3(0.0)), vec3(2.2)); }
void main() {
  vec4 tex = texture2D(tStandby, vUv);
  // High-contrast self-luminous anti-glare cockpit instrumentation (zero sunlight washout)
  vec3 col = srgbToLinear(tex.rgb) * 1.32;
  // Ultra-subtle optical glass bezel shading across each tile
  vec2 tileUv = fract(vUv * vec2(4.0, 2.0)) - 0.5;
  float glassSpec = smoothstep(0.62, 0.0, length(tileUv - vec2(-0.18, -0.22))) * 0.012;
  col += vec3(0.004, 0.008, 0.007) + vec3(glassSpec);
  gl_FragColor = vec4(col, 1.0);
}`;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function pageModeValue(page: MfdPage): number {
  return page === 'PFD' ? 1 : page === 'NAV' ? 2 : 0;
}

export class MfdDisplays {
  public readonly texture: THREE.CanvasTexture;
  private canvas = document.createElement('canvas');
  private ctx: CanvasRenderingContext2D;
  private last = -1;

  // Dedicated 60 FPS standby instrument & glareshield annunciator atlas (4x2 tiles = 1024x512)
  private standbyCanvas = document.createElement('canvas');
  private standbyCtx: CanvasRenderingContext2D;
  private standbyTex: THREE.CanvasTexture;
  private standbyMat: THREE.ShaderMaterial;
  private standbyAttached = false;
  private lastStandby = -1;
  private smoothEgtC = 420;
  private smoothVsiMps = 0;
  private smoothG = 1;

  private pfdTarget = new THREE.WebGLRenderTarget(384, 500, { type: THREE.HalfFloatType });
  private navTarget = new THREE.WebGLRenderTarget(496, 380, { type: THREE.HalfFloatType });
  private pfdCam = new THREE.PerspectiveCamera(PFD_FOV, 384 / 500, 1e-6, 2.4e8);
  private navCam = new THREE.PerspectiveCamera(50, 496 / 380, 1e-6, 2.4e8);
  private screenMat: THREE.ShaderMaterial;
  private meshes: THREE.Mesh[] = [];
  private frameNo = 0;
  private tmp = new THREE.Vector3();
  private tmp2 = new THREE.Vector3();

  private pages: MfdPageMap = createDefaultMfdPages();
  private lastExternalPages: MfdPageMap | null = null;
  private forceAllDirty = true;
  private drawnOnce = false;
  private turn = 0;
  private dirty: Array<MfdRect> = [];

  constructor() {
    this.canvas.width = this.canvas.height = RES;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.flipY = false;
    this.texture.anisotropy = 16;
    this.texture.generateMipmaps = true;
    this.texture.minFilter = THREE.LinearMipmapLinearFilter;

    this.standbyCanvas.width = STANDBY_W;
    this.standbyCanvas.height = STANDBY_H;
    this.standbyCtx = this.standbyCanvas.getContext('2d') as CanvasRenderingContext2D;
    this.standbyTex = new THREE.CanvasTexture(this.standbyCanvas);
    this.standbyTex.colorSpace = THREE.SRGBColorSpace;
    this.standbyTex.flipY = false;
    this.standbyTex.anisotropy = 16;
    this.standbyTex.generateMipmaps = true;
    this.standbyTex.minFilter = THREE.LinearMipmapLinearFilter;

    this.standbyMat = new THREE.ShaderMaterial({
      uniforms: {
        tStandby: { value: this.standbyTex },
      },
      vertexShader: screenVert,
      fragmentShader: standbyFrag,
    });
    this.standbyMat.name = 'dynamic_standby_live';

    this.screenMat = new THREE.ShaderMaterial({
      uniforms: {
        tCanvas: { value: this.texture },
        tPfd: { value: this.pfdTarget.texture },
        tNav: { value: this.navTarget.texture },
        uViews: { value: 0 },
        uModes: {
          value: new THREE.Vector3(
            pageModeValue(this.pages.left),
            pageModeValue(this.pages.centre),
            pageModeValue(this.pages.right),
          ),
        },
      },
      vertexShader: screenVert,
      fragmentShader: screenFrag,
    });
    this.screenMat.name = 'dynamic_mfd_live';
  }

  public getPages(): MfdPageMap {
    return { ...this.pages };
  }

  public setSlotPage(slot: MfdSlot, page: MfdPage): void {
    if (this.pages[slot] === page) return;
    this.pages[slot] = page;
    this.syncModeUniforms();
    this.forceAllDirty = true;
    this.last = -1;
  }

  public cycleSlot(slot: MfdSlot = 'centre'): MfdPage {
    const idx = PAGE_ORDER.indexOf(this.pages[slot]);
    const next = PAGE_ORDER[(idx + 1) % PAGE_ORDER.length];
    this.setSlotPage(slot, next);
    return next;
  }

  /**
   * Handle a cockpit raycast click against `dynamic_mfd` meshes.
   * Clicking a bottom bezel tab (`PFD | FCS | ENG | NAV`) selects that page directly;
   * clicking elsewhere on a screen cycles that display's page.
   */
  public handleRayClick(ray: THREE.Raycaster): boolean {
    if (this.meshes.length === 0) return false;
    const hits = ray.intersectObjects(this.meshes, false);
    for (const hit of hits) {
      if (!hit.uv) continue;
      if (this.handleUvClick(hit.uv.x, hit.uv.y)) return true;
    }
    return false;
  }

  public handleUvClick(u: number, v: number): boolean {
    const ax = u * S;
    const ay = (1 - v) * S;
    for (const slot of SLOTS) {
      const r = SLOT_RECTS[slot];
      if (ax < r.x - 10 || ax > r.x + r.w + 10 || ay < r.y - 10 || ay > r.y + r.h + 10) continue;
      if (ay >= r.y + r.h - TAB_BAR_H - 8) {
        const idx = clamp(Math.floor(((ax - r.x) / r.w) * PAGE_ORDER.length), 0, PAGE_ORDER.length - 1);
        this.setSlotPage(slot, PAGE_ORDER[idx]);
      } else {
        this.cycleSlot(slot);
      }
      return true;
    }
    return false;
  }

  private syncModeUniforms(): void {
    const vec = this.screenMat.uniforms.uModes.value as THREE.Vector3;
    vec.set(
      pageModeValue(this.pages.left),
      pageModeValue(this.pages.centre),
      pageModeValue(this.pages.right),
    );
  }

  public renderViews(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    forward: THREE.Vector3,
    up: THREE.Vector3,
    vertical: THREE.Vector3,
    unitsPerKm: number,
    altKm: number,
    near: number,
    on: boolean,
  ): void {
    this.flush(renderer);
    this.screenMat.uniforms.uViews.value = on ? 1 : 0;
    if (!on) return;

    const needPfd = this.pages.left === 'PFD' || this.pages.centre === 'PFD' || this.pages.right === 'PFD';
    const needNav = this.pages.left === 'NAV' || this.pages.centre === 'NAV' || this.pages.right === 'NAV';
    if (!needPfd && !needNav) return;

    const period = (perf.tier === 'high' ? 8 : 12) * (perf.scale < 0.85 ? 2 : 1);
    const slot = this.frameNo++ % period;
    let which = -1;
    if (slot === 0 && needPfd) which = 0;
    else if (slot === Math.floor(period / 2) && needNav) which = 2;
    else if (slot === 0 && needNav && !needPfd) which = 2;
    if (which < 0) return;

    const target = renderer.getRenderTarget();
    const autoClear = renderer.autoClear;
    try {
      renderer.autoClear = true;
      if (which === 0) {
        const c = this.pfdCam;
        c.position.set(0, 0, 0);
        c.up.copy(up);
        c.lookAt(forward);
        c.near = near;
        c.updateProjectionMatrix();
        c.updateMatrixWorld(true);
        renderer.setRenderTarget(this.pfdTarget);
        renderer.render(scene, c);
      } else {
        const hKm = THREE.MathUtils.clamp(altKm * 5 + 4, 5, 600);
        const head = this.tmp.copy(forward).addScaledVector(vertical, -forward.dot(vertical));
        if (head.lengthSq() < 1e-8) head.copy(up);
        head.normalize();
        const c = this.navCam;
        const half = hKm * Math.tan(THREE.MathUtils.degToRad(25));
        c.position
          .copy(vertical)
          .multiplyScalar(hKm * unitsPerKm)
          .addScaledVector(head, half * 0.24 * unitsPerKm);
        c.up.copy(head);
        c.lookAt(this.tmp2.copy(c.position).addScaledVector(vertical, -1));
        c.near = Math.max(1e-6, hKm * unitsPerKm * 0.02);
        c.updateProjectionMatrix();
        c.updateMatrixWorld(true);
        renderer.setRenderTarget(this.navTarget);
        renderer.render(scene, c);
      }
    } finally {
      renderer.setRenderTarget(target);
      renderer.autoClear = autoClear;
    }
  }

  public dispose(): void {
    this.meshes = [];
    this.standbyAttached = false;
    this.pfdTarget.dispose();
    this.navTarget.dispose();
    this.screenMat.dispose();
    this.texture.dispose();
    this.standbyMat.dispose();
    this.standbyTex.dispose();
  }

  /** Attach live MFD and standby-gauge shader materials to `dynamic_mfd` and `dynamic_standby` meshes. */
  public attach(root: THREE.Object3D): number {
    this.meshes = [];
    this.standbyAttached = false;
    let n = 0;
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      let matchedMfd = false;
      mats.forEach((m, i) => {
        if (m.name === 'dynamic_mfd') {
          if (Array.isArray(mesh.material)) mesh.material[i] = this.screenMat;
          else mesh.material = this.screenMat;
          matchedMfd = true;
          n++;
        } else if (m.name === 'dynamic_standby') {
          if (Array.isArray(mesh.material)) mesh.material[i] = this.standbyMat;
          else mesh.material = this.standbyMat;
          this.standbyAttached = true;
        }
      });
      if (matchedMfd && !this.meshes.includes(mesh)) {
        this.meshes.push(mesh);
      }
    });
    this.forceAllDirty = true;
    this.drawnOnce = false;
    this.lastStandby = -1;
    return n;
  }

  public update(t: JetTelemetry, timeSec: number): void {
    // Allow external key shortcuts updating `t.mfdPages` without clobbering cockpit clicks
    if (t.mfdPages) {
      const ext = t.mfdPages;
      if (
        !this.lastExternalPages ||
        ext.left !== this.lastExternalPages.left ||
        ext.centre !== this.lastExternalPages.centre ||
        ext.right !== this.lastExternalPages.right
      ) {
        this.pages = { ...ext };
        this.lastExternalPages = { ...ext };
        this.syncModeUniforms();
        this.forceAllDirty = true;
      }
    }

    // Update live 60 FPS standby instruments (speedometer, ADI, altimeter, VSI/G, RPM, EGT, AoA, Annunciators)
    if (this.standbyAttached && (this.lastStandby < 0 || timeSec - this.lastStandby >= 0.016)) {
      const dtS = this.lastStandby < 0 ? 0.016 : clamp(timeSec - this.lastStandby, 0.001, 0.1);
      this.lastStandby = timeSec;
      this.drawStandbyCluster(t, dtS);
    }

    if (!this.forceAllDirty && timeSec - this.last < 0.028) return;
    this.last = timeSec;

    const c = this.ctx;
    c.setTransform(RES / S, 0, 0, RES / S, 0, 0);
    c.shadowBlur = 0;

    if (!this.drawnOnce || this.forceAllDirty) {
      c.clearRect(0, 0, S, S);
      for (const slot of SLOTS) {
        this.drawSlot(c, slot, SLOT_RECTS[slot], this.pages[slot], t);
      }
      this.texture.needsUpdate = true;
      this.drawnOnce = true;
      this.forceAllDirty = false;
      this.dirty.length = 0;
      return;
    }

    const slot = SLOTS[this.turn++ % SLOTS.length];
    const r = SLOT_RECTS[slot];
    c.clearRect(r.x - 2, r.y - 2, r.w + 4, r.h + 4);
    this.drawSlot(c, slot, r, this.pages[slot], t);

    const px = RES / S;
    const x0 = Math.max(0, Math.floor((r.x - 2) * px));
    const y0 = Math.max(0, Math.floor((r.y - 2) * px));
    this.dirty.push({
      x: x0,
      y: y0,
      w: Math.min(RES, Math.ceil((r.x + r.w + 2) * px)) - x0,
      h: Math.min(RES, Math.ceil((r.y + r.h + 2) * px)) - y0,
    });
  }

  private flush(renderer: THREE.WebGLRenderer): void {
    if (this.dirty.length === 0) return;
    const props = renderer.properties.get(this.texture) as {
      __webglTexture?: WebGLTexture;
      __version?: number;
    };
    if (!props.__webglTexture || props.__version !== this.texture.version) {
      this.dirty.length = 0;
      return;
    }
    const gl = renderer.getContext() as WebGL2RenderingContext;
    const prevUnpack = gl.getParameter(gl.UNPACK_ALIGNMENT) as number;
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    gl.bindTexture(gl.TEXTURE_2D, props.__webglTexture);
    for (const d of this.dirty) {
      if (d.w <= 0 || d.h <= 0) continue;
      // Extract cropped ImageData aligned to full backing resolution
      const img = this.ctx.getImageData(d.x, d.y, d.w, d.h);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, d.x, d.y, d.w, d.h, gl.RGBA, gl.UNSIGNED_BYTE, img.data);
    }
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, prevUnpack);
    this.dirty.length = 0;
  }

  private drawSlot(
    c: CanvasRenderingContext2D,
    _slot: MfdSlot,
    r: MfdRect,
    page: MfdPage,
    t: JetTelemetry,
  ): void {
    const contentRect: MfdRect = { x: r.x, y: r.y, w: r.w, h: r.h - TAB_BAR_H };
    c.save();
    c.beginPath();
    c.rect(r.x, r.y, r.w, r.h);
    c.clip();

    if (page === 'PFD') this.drawPfdPage(c, contentRect, t);
    else if (page === 'FCS') this.drawFcsPage(c, contentRect, t);
    else if (page === 'ENG') this.drawEngPage(c, contentRect, t);
    else this.drawNavPage(c, contentRect, t);

    this.drawBezelTabs(c, r, page);

    // Outer display bezel border
    c.strokeStyle = MINT_DIM;
    c.lineWidth = 1.5;
    c.strokeRect(r.x + 1, r.y + 1, r.w - 2, r.h - 2);
    c.restore();
  }

  private drawBezelTabs(
    c: CanvasRenderingContext2D,
    r: MfdRect,
    activePage: MfdPage,
  ): void {
    const y = r.y + r.h - TAB_BAR_H;
    const w = r.w / PAGE_ORDER.length;
    c.fillStyle = BG_PANEL;
    c.fillRect(r.x, y, r.w, TAB_BAR_H);

    c.strokeStyle = MINT_DIM;
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(r.x, y);
    c.lineTo(r.x + r.w, y);
    c.stroke();

    c.font = `700 12px ${MONO}`;
    c.textAlign = 'center';
    PAGE_ORDER.forEach((p, idx) => {
      const tx = r.x + idx * w;
      const isAct = p === activePage;
      if (isAct) {
        c.fillStyle = 'rgba(109, 252, 192, 0.22)';
        c.fillRect(tx + 2, y + 3, w - 4, TAB_BAR_H - 6);
        c.strokeStyle = MINT;
        c.lineWidth = 1.4;
        c.strokeRect(tx + 2, y + 3, w - 4, TAB_BAR_H - 6);
      }
      c.fillStyle = isAct ? MINT : MINT_DIM;
      c.fillText(p, tx + w * 0.5, y + 20);
    });
  }

  // ===========================================================================
  // PAGE 1: PFD (Synthetic Vision + Attitude + Tapes + FPM + E-Bracket)
  // ===========================================================================
  private drawPfdPage(c: CanvasRenderingContext2D, r: MfdRect, t: JetTelemetry): void {
    const cx = r.x + r.w * 0.5;
    const cy = r.y + r.h * 0.48;
    const ppd = r.h / PFD_FOV;

    // Top scrim bar for HDG & status
    c.fillStyle = BG_SCRIM;
    c.fillRect(r.x, r.y, r.w, 34);
    c.fillRect(r.x, r.y + r.h - 28, r.w, 28);

    // Side tape scrims
    const tapeW = clamp(Math.round(r.w * 0.2), 78, 96);
    c.fillRect(r.x, r.y + 34, tapeW, r.h - 62);
    c.fillRect(r.x + r.w - tapeW, r.y + 34, tapeW, r.h - 62);

    // Attitude ladder clipped to central viewport
    c.save();
    c.beginPath();
    c.rect(r.x + tapeW + 2, r.y + 36, r.w - (tapeW + 2) * 2, r.h - 66);
    c.clip();

    if (t.hasHorizon) {
      c.save();
      c.translate(cx, cy);
      c.rotate((-t.rollDeg * Math.PI) / 180);
      c.strokeStyle = MINT;
      c.fillStyle = MINT;
      c.lineWidth = 1.8;
      c.font = `600 12px ${MONO}`;
      for (let deg = -60; deg <= 60; deg += 10) {
        const y = (t.pitchDeg - deg) * ppd;
        if (Math.abs(y) > r.h * 0.52) continue;
        const half = deg === 0 ? 92 : 42;
        const gap = 18;
        c.setLineDash(deg < 0 ? [6, 5] : []);
        c.beginPath();
        c.moveTo(-half, y);
        c.lineTo(-gap, y);
        c.moveTo(gap, y);
        c.lineTo(half, y);
        c.stroke();
        c.setLineDash([]);
        if (deg !== 0) {
          c.textAlign = 'right';
          c.fillText(String(Math.abs(deg)), -half - 4, y + 4);
        }
      }
      c.restore();
    }

    // Waterline `-W-`
    c.strokeStyle = AMBER;
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(cx - 22, cy);
    c.lineTo(cx - 9, cy);
    c.lineTo(cx - 4, cy + 7);
    c.lineTo(cx, cy);
    c.lineTo(cx + 4, cy + 7);
    c.lineTo(cx + 9, cy);
    c.lineTo(cx + 22, cy);
    c.stroke();

    // FPM `-o-` & gear E-bracket
    const aoa = t.aoaDeg ?? 0;
    const aos = t.aosDeg ?? 0;
    const fpmX = clamp(cx + aos * ppd, r.x + tapeW + 16, r.x + r.w - tapeW - 16);
    const fpmY = clamp(cy + aoa * ppd, r.y + 48, r.y + r.h - 42);
    c.strokeStyle = MINT;
    c.lineWidth = 2;
    c.beginPath();
    c.arc(fpmX, fpmY, 6, 0, Math.PI * 2);
    c.moveTo(fpmX - 13, fpmY);
    c.lineTo(fpmX - 6, fpmY);
    c.moveTo(fpmX + 6, fpmY);
    c.lineTo(fpmX + 13, fpmY);
    c.moveTo(fpmX, fpmY - 6);
    c.lineTo(fpmX, fpmY - 12);
    c.stroke();

    if (t.gearDown && t.airDensity > 0) {
      const eY = clamp(cy + 12 * ppd, r.y + 52, r.y + r.h - 44);
      const onSpd = aoa >= 11 && aoa <= 13;
      c.strokeStyle = onSpd ? MINT : AMBER;
      c.beginPath();
      c.moveTo(fpmX - 24, eY - 9);
      c.lineTo(fpmX - 18, eY - 9);
      c.lineTo(fpmX - 18, eY + 9);
      c.lineTo(fpmX - 24, eY + 9);
      c.moveTo(fpmX - 23, eY);
      c.lineTo(fpmX - 18, eY);
      c.stroke();
    }
    c.restore();

    // Top Header: HDG, Bank, FBW Mode
    c.fillStyle = MINT;
    c.font = `700 16px ${MONO}`;
    c.textAlign = 'center';
    c.fillText(t.hasHorizon ? `HDG ${String(Math.round(((t.headingDeg % 360) + 360) % 360)).padStart(3, '0')}°` : 'INERTIAL', cx, r.y + 22);

    c.font = `600 11px ${MONO}`;
    c.fillStyle = MINT_DIM;
    c.textAlign = 'left';
    c.fillText((t.airframeName ?? 'JAS 39').slice(0, 12), r.x + 8, r.y + 21);
    c.textAlign = 'right';
    c.fillStyle = (t.fbwMode ?? 'norm') === 'psm' ? CYAN : MINT;
    c.fillText(`FBW ${(t.fbwMode ?? 'norm').toUpperCase()}`, r.x + r.w - 8, r.y + 21);

    // Left Tape: Speed (IAS + kt), Mach, Alpha, G
    const lx = r.x + 8;
    const ias = t.airDensity > 0 && t.iasMps !== undefined ? t.iasMps : t.speedMps;
    const iasKt = Math.round(ias * 1.943844);
    c.fillStyle = BG_PILL;
    c.strokeStyle = MINT;
    c.lineWidth = 1.2;
    c.fillRect(r.x + 4, cy - 23, tapeW - 8, 24);
    c.strokeRect(r.x + 4, cy - 23, tapeW - 8, 24);
    c.textAlign = 'left';
    c.fillStyle = MINT_DIM;
    c.font = `600 10px ${MONO}`;
    c.fillText(t.airDensity > 0 ? 'IAS' : 'SPD', lx, cy - 28);
    c.fillStyle = MINT;
    c.font = `700 14px ${MONO}`;
    c.fillText(formatSpeed(ias), lx, cy - 6);
    c.font = `600 11px ${MONO}`;
    if (t.airDensity > 0) {
      c.fillStyle = MINT_DIM;
      c.fillText(`${iasKt} KT`, lx, cy + 14);
      c.fillStyle = t.mach >= 1 ? CYAN : MINT;
      c.fillText(`M ${t.mach.toFixed(2)}`, lx, cy + 31);
      c.fillStyle = t.alphaWarning ? AMBER : MINT;
      c.fillText(`α ${aoa.toFixed(1)}°`, lx, cy + 48);
    } else {
      c.fillStyle = MINT_DIM;
      c.fillText('VAC', lx, cy + 16);
    }
    c.fillStyle = t.overGWarning ? RED : MINT;
    c.fillText(`G ${t.gLoad.toFixed(1)}`, lx, cy + 65);

    // Right Tape: AGL, MSL, VSI, Ps, T/W
    const altInfo = resolveAltitudeTelemetry(t);
    const rx = r.x + r.w - 8;
    const inAir = !!t.airWorld;
    const altCol = inAir && altInfo.gpwsMode === 'pull-up' ? RED : inAir && altInfo.gpwsMode === 'caution' ? AMBER : MINT;
    c.fillStyle = BG_PILL;
    c.strokeStyle = altCol;
    c.lineWidth = 1.2;
    c.fillRect(r.x + r.w - tapeW + 4, cy - 23, tapeW - 8, 24);
    c.strokeRect(r.x + r.w - tapeW + 4, cy - 23, tapeW - 8, 24);
    c.textAlign = 'right';
    c.fillStyle = inAir && altInfo.terrainWarning ? RED : MINT_DIM;
    c.font = `600 10px ${MONO}`;
    c.fillText(inAir ? 'AGL' : 'ALT', rx, cy - 28);
    c.fillStyle = altCol;
    c.font = `700 14px ${MONO}`;
    c.fillText(inAir ? formatDistance(altInfo.aglM / 1000) : formatDistance(t.altKm), rx, cy - 6);
    c.font = `600 10.5px ${MONO}`;
    if (inAir) {
      c.fillStyle = CYAN;
      c.fillText(`MSL ${formatAltitudeMeters(altInfo.mslM)}`, rx, cy + 14);
    }
    c.font = `600 11px ${MONO}`;
    const vsi = Math.round(t.verticalSpeedMps ?? 0);
    c.fillStyle = vsi >= 0 ? MINT : AMBER;
    c.fillText(`VS ${vsi >= 0 ? '+' : ''}${vsi}`, rx, cy + 31);
    const ps = Math.round(t.specificExcessPowerMps ?? 0);
    c.fillStyle = ps >= 0 ? MINT : AMBER;
    c.fillText(`Ps ${ps >= 0 ? '+' : ''}${ps}`, rx, cy + 48);
    c.fillStyle = MINT_DIM;
    c.fillText(`T/W ${(t.twRatio ?? 0).toFixed(2)}`, rx, cy + 65);

    // PFD central GPWS banner when terrain warning triggers
    if (inAir && altInfo.terrainWarning) {
      const pull = altInfo.gpwsMode !== 'caution';
      const bw = Math.min(r.w - tapeW * 2 - 14, 176);
      const bx = cx - bw * 0.5;
      const by = r.y + r.h - 62;
      c.fillStyle = pull ? 'rgba(64, 8, 8, 0.88)' : 'rgba(54, 36, 6, 0.86)';
      c.fillRect(bx, by, bw, 24);
      c.strokeStyle = pull ? RED : AMBER;
      c.lineWidth = 1.4;
      c.strokeRect(bx, by, bw, 24);
      c.fillStyle = pull ? RED : AMBER;
      c.font = `700 12px ${MONO}`;
      c.textAlign = 'center';
      c.fillText(pull ? 'TERRAIN · PULL UP' : 'CAUTION · TERRAIN', cx, by + 16);
    }

    // Bottom Strip: Target / Waypoint summary
    c.fillStyle = MINT;
    c.font = `600 11px ${MONO}`;
    c.textAlign = 'left';
    c.fillText(`TGT ${t.target.toUpperCase()} · ${formatDistance(t.targetDistKm)}`, r.x + 8, r.y + r.h - 10);
    c.textAlign = 'right';
    c.fillStyle = t.gearDown ? AMBER : MINT_DIM;
    c.fillText(t.gearDown ? 'GEAR DN · APPROACH' : t.nearest.toUpperCase(), r.x + r.w - 8, r.y + r.h - 10);
  }

  // ===========================================================================
  // PAGE 2: FCS (Live Deflecting Control Surfaces, TVC Vectors & α/G Envelope)
  // ===========================================================================
  private drawFcsPage(c: CanvasRenderingContext2D, r: MfdRect, t: JetTelemetry): void {
    c.fillStyle = BG_PANEL;
    c.fillRect(r.x, r.y, r.w, r.h);

    const s: JetSurfaceState = t.surfaces ?? createJetSurfaceState();
    const af = t.airframeId ?? 'gripen';
    const fbw = (t.fbwMode ?? 'norm').toUpperCase();
    const flp = (t.flapMode ?? 'auto').toUpperCase();

    // Header bar
    c.fillStyle = 'rgba(109, 252, 192, 0.1)';
    c.fillRect(r.x, r.y, r.w, 30);
    c.font = `700 13px ${MONO}`;
    c.fillStyle = MINT;
    c.textAlign = 'left';
    c.fillText(`FCS · ${af.toUpperCase()}`, r.x + 10, r.y + 20);
    c.textAlign = 'right';
    c.fillStyle = fbw === 'PSM' ? CYAN : fbw === 'HIGH-G' ? AMBER : MINT;
    c.fillText(`${fbw}${t.tvcActive ? '+TVC' : ''} · FLP ${flp}`, r.x + r.w - 10, r.y + 20);

    // Split left (planform) and right (stick box + α/G envelope)
    const splitX = r.x + Math.round(r.w * 0.56);
    const bodyTop = r.y + 34;
    const bodyH = r.h - 38;

    // 1. Airframe Planform & Live Control Surface Diagram
    this.drawFcsPlanform(c, { x: r.x + 6, y: bodyTop, w: splitX - r.x - 10, h: bodyH }, af, s, t);

    // 2. Right Column: Stick/Rudder Crosshair + Alpha/G Envelope
    const rx = splitX + 4;
    const rw = r.x + r.w - rx - 8;
    const stickH = Math.round(bodyH * 0.42);
    this.drawStickBox(c, { x: rx, y: bodyTop + 4, w: rw, h: stickH }, s);
    this.drawEnvelopePlot(c, { x: rx, y: bodyTop + stickH + 10, w: rw, h: bodyH - stickH - 16 }, t);
  }

  private drawFcsPlanform(
    c: CanvasRenderingContext2D,
    box: MfdRect,
    af: string,
    s: JetSurfaceState,
    t: JetTelemetry,
  ): void {
    const cx = box.x + box.w * 0.5;
    const cy = box.y + box.h * 0.52;
    const scale = Math.min(box.w / 180, box.h / 240);

    c.save();
    c.translate(cx, cy);
    c.scale(scale, scale);

    // Subtle fuselage outline
    c.strokeStyle = MINT_DIM;
    c.lineWidth = 1.6;
    c.beginPath();
    c.moveTo(0, -108); // nose
    c.lineTo(11, -68);
    if (af === 'gripen') {
      c.lineTo(18, -32);
      c.lineTo(74, 48); // delta wing tip
      c.lineTo(74, 62);
      c.lineTo(14, 66);
      c.lineTo(12, 92); // exhaust
      c.lineTo(-12, 92);
      c.lineTo(-14, 66);
      c.lineTo(-74, 62);
      c.lineTo(-74, 48);
      c.lineTo(-18, -32);
    } else if (af === 'su30') {
      c.lineTo(20, -30);
      c.lineTo(80, 32); // swept main wing
      c.lineTo(80, 46);
      c.lineTo(28, 44);
      c.lineTo(54, 78); // horizontal stab
      c.lineTo(24, 94);
      c.lineTo(10, 94);
      c.lineTo(0, 74); // stinger
      c.lineTo(-10, 94);
      c.lineTo(-24, 94);
      c.lineTo(-54, 78);
      c.lineTo(-28, 44);
      c.lineTo(-80, 46);
      c.lineTo(-80, 32);
      c.lineTo(-20, -30);
    } else {
      // Kestrel
      c.lineTo(16, -24);
      c.lineTo(76, 30);
      c.lineTo(76, 48);
      c.lineTo(22, 52);
      c.lineTo(44, 78);
      c.lineTo(14, 92);
      c.lineTo(-14, 92);
      c.lineTo(-44, 78);
      c.lineTo(-22, 52);
      c.lineTo(-76, 48);
      c.lineTo(-76, 30);
      c.lineTo(-16, -24);
    }
    c.lineTo(-11, -68);
    c.closePath();
    c.stroke();

    const drawSurfaceBar = (
      x0: number,
      y0: number,
      w: number,
      h: number,
      rad: number,
      label: string,
    ): void => {
      const deg = THREE.MathUtils.radToDeg(rad);
      const norm = clamp(deg / 25, -1, 1);
      const fill = Math.abs(norm) > 0.15 ? (norm > 0 ? CYAN : AMBER) : MINT;
      c.fillStyle = Math.abs(norm) > 0.15 ? 'rgba(122, 232, 255, 0.25)' : 'rgba(109, 252, 192, 0.16)';
      c.strokeStyle = fill;
      c.lineWidth = 1.4;
      c.fillRect(x0, y0, w, h);
      c.strokeRect(x0, y0, w, h);
      c.fillStyle = fill;
      c.font = `600 9px ${MONO}`;
      c.textAlign = 'center';
      c.fillText(`${label}${deg >= 0 ? '+' : ''}${Math.round(deg)}`, x0 + w * 0.5, y0 + h + 10);
    };

    // Canards on Gripen, Slats on Su-30 / Kestrel
    if (af === 'gripen') {
      drawSurfaceBar(-44, -46, 26, 10, s.canardRad, 'CN');
      drawSurfaceBar(18, -46, 26, 10, s.canardRad, 'CN');
      drawSurfaceBar(-64, 58, 42, 11, s.elevonLeftRad, 'EL');
      drawSurfaceBar(22, 58, 42, 11, s.elevonRightRad, 'ER');
    } else {
      // Slats
      if (s.slat > 0.02) {
        c.strokeStyle = CYAN;
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(-24, -22);
        c.lineTo(-76, 28);
        c.moveTo(24, -22);
        c.lineTo(76, 28);
        c.stroke();
      }
      drawSurfaceBar(-68, 42, 34, 10, s.flapLeftRad, 'FL');
      drawSurfaceBar(34, 42, 34, 10, s.flapRightRad, 'FR');
      drawSurfaceBar(-50, 74, 24, 11, s.elevonLeftRad, 'SL');
      drawSurfaceBar(26, 74, 24, 11, s.elevonRightRad, 'SR');
    }

    // Rudder bar
    const rudDeg = THREE.MathUtils.radToDeg(s.rudderRad);
    c.strokeStyle = Math.abs(rudDeg) > 2 ? CYAN : MINT;
    c.lineWidth = 2.6;
    c.beginPath();
    c.moveTo(0, 62);
    c.lineTo(clamp(rudDeg * 0.45, -12, 12), 88);
    c.stroke();

    // Dorsal Airbrake highlight
    if (s.airbrake > 0.05) {
      c.fillStyle = `rgba(244, 205, 114, ${0.25 + s.airbrake * 0.6})`;
      c.strokeStyle = AMBER;
      c.lineWidth = 1.4;
      c.fillRect(-10, -2, 20, 26);
      c.strokeRect(-10, -2, 20, 26);
      c.fillStyle = AMBER;
      c.font = `700 9px ${MONO}`;
      c.textAlign = 'center';
      c.fillText('BRK', 0, 14);
    }

    // TVC Vector Arrows
    const drawNozzle = (nx: number, ny: number, pitchRad: number, yawRad: number, hasTvc: boolean): void => {
      const irisR = 6 + s.nozzleIris * 4;
      c.strokeStyle = t.abStage && t.abStage > 0 ? AMBER : MINT;
      c.lineWidth = 1.6;
      c.beginPath();
      c.arc(nx, ny, irisR, 0, Math.PI * 2);
      c.stroke();
      if (hasTvc) {
        const vx = clamp(THREE.MathUtils.radToDeg(yawRad), -20, 20) * 1.1;
        const vy = clamp(THREE.MathUtils.radToDeg(pitchRad), -20, 20) * 1.1;
        c.strokeStyle = t.tvcActive ? CYAN : MINT_DIM;
        c.lineWidth = 2.2;
        c.beginPath();
        c.moveTo(nx, ny);
        c.lineTo(nx + vx, ny + 18 - vy * 0.65);
        c.stroke();
      }
    };

    if (af === 'su30') {
      drawNozzle(-16, 98, s.tvcPitchLeftRad, s.tvcYawLeftRad, true);
      drawNozzle(16, 98, s.tvcPitchRightRad, s.tvcYawRightRad, true);
    } else if (af === 'kestrel') {
      drawNozzle(0, 98, s.tvcPitchLeftRad, 0, true);
    } else {
      drawNozzle(0, 98, 0, 0, false);
    }

    c.restore();

    // Bottom status bar under schematic
    c.font = `600 10px ${MONO}`;
    c.textAlign = 'center';
    c.fillStyle = t.tvcActive ? CYAN : MINT_DIM;
    const tvcTxt =
      af === 'gripen'
        ? 'NO TVC · CANARD-DELTA'
        : `TVC P:${Math.round(THREE.MathUtils.radToDeg(s.tvcPitchLeftRad))}° Y:${Math.round(THREE.MathUtils.radToDeg(s.tvcYawLeftRad))}°`;
    c.fillText(tvcTxt, box.x + box.w * 0.5, box.y + box.h - 4);
  }

  private drawStickBox(c: CanvasRenderingContext2D, box: MfdRect, s: JetSurfaceState): void {
    c.strokeStyle = MINT_DIM;
    c.lineWidth = 1;
    c.strokeRect(box.x, box.y, box.w, box.h);

    const plotSize = Math.min(box.w - 22, box.h - 32);
    const px = box.x + (box.w - plotSize) * 0.5;
    const py = box.y + 18;
    const cx = px + plotSize * 0.5;
    const cy = py + plotSize * 0.5;

    c.fillStyle = MINT_DIM;
    c.font = `600 10px ${MONO}`;
    c.textAlign = 'center';
    c.fillText('STICK / RUD', box.x + box.w * 0.5, box.y + 12);

    // Crosshair lines
    c.strokeStyle = GRID_LINE;
    c.strokeRect(px, py, plotSize, plotSize);
    c.beginPath();
    c.moveTo(cx, py);
    c.lineTo(cx, py + plotSize);
    c.moveTo(px, cy);
    c.lineTo(px + plotSize, cy);
    c.stroke();

    // Live stick position dot
    const sx = cx + clamp(s.cmdRoll, -1, 1) * (plotSize * 0.44);
    const sy = cy + clamp(s.cmdPitch, -1, 1) * (plotSize * 0.44);
    c.fillStyle = CYAN;
    c.beginPath();
    c.arc(sx, sy, 4.5, 0, Math.PI * 2);
    c.fill();

    // Rudder bar below stick square
    const ry = py + plotSize + 5;
    c.strokeStyle = MINT_DIM;
    c.strokeRect(px, ry, plotSize, 6);
    const rxPos = cx + clamp(s.cmdYaw, -1, 1) * (plotSize * 0.45);
    c.fillStyle = AMBER;
    c.fillRect(rxPos - 4, ry + 1, 8, 4);
  }

  private drawEnvelopePlot(c: CanvasRenderingContext2D, box: MfdRect, t: JetTelemetry): void {
    c.strokeStyle = MINT_DIM;
    c.lineWidth = 1;
    c.strokeRect(box.x, box.y, box.w, box.h);

    c.fillStyle = MINT_DIM;
    c.font = `600 10px ${MONO}`;
    c.textAlign = 'center';
    c.fillText('α / G ENVELOPE', box.x + box.w * 0.5, box.y + 12);

    const px = box.x + 16;
    const py = box.y + 20;
    const pw = box.w - 24;
    const ph = box.h - 40;

    // Axes: alpha [-10..95], G [-3..12]
    const mapX = (aoa: number): number => px + (clamp(aoa, -10, 95) + 10) / 105 * pw;
    const mapY = (g: number): number => py + ph - (clamp(g, -3, 12) + 3) / 15 * ph;

    // Normal FBW envelope box (+9/-3G, 28 deg)
    c.strokeStyle = GRID_LINE;
    c.strokeRect(mapX(-10), mapY(9), mapX(28) - mapX(-10), mapY(-3) - mapY(9));

    // High-G / PSM expanded border
    c.strokeStyle = (t.fbwMode ?? 'norm') === 'psm' ? CYAN : AMBER;
    c.setLineDash([4, 3]);
    const maxAoa = (t.fbwMode ?? 'norm') === 'psm' ? 95 : 35;
    const maxG = (t.fbwMode ?? 'norm') === 'norm' ? 9 : 11.5;
    c.strokeRect(mapX(-10), mapY(maxG), mapX(maxAoa) - mapX(-10), mapY(-3) - mapY(maxG));
    c.setLineDash([]);

    // Zero G horizontal & 0 deg vertical
    c.strokeStyle = MINT_DIM;
    c.beginPath();
    c.moveTo(px, mapY(0));
    c.lineTo(px + pw, mapY(0));
    c.moveTo(mapX(0), py);
    c.lineTo(mapX(0), py + ph);
    c.stroke();

    // Current flight state dot
    const aoa = t.aoaDeg ?? 0;
    const curX = mapX(aoa);
    const curY = mapY(t.gLoad);
    c.fillStyle = t.overGWarning || t.spinWarning ? RED : t.alphaWarning ? AMBER : MINT;
    c.beginPath();
    c.arc(curX, curY, 4.5, 0, Math.PI * 2);
    c.fill();

    c.font = `600 10px ${MONO}`;
    c.fillStyle = MINT;
    c.textAlign = 'center';
    c.fillText(`α ${aoa.toFixed(1)}° · ${t.gLoad.toFixed(1)}G`, box.x + box.w * 0.5, box.y + box.h - 6);
  }

  // ===========================================================================
  // PAGE 3: ENG (AB Zones 1-3, Supercruise, T/W, Ps, Mass/Fuel, Aero Telemetry)
  // ===========================================================================
  private drawEngPage(c: CanvasRenderingContext2D, r: MfdRect, t: JetTelemetry): void {
    c.fillStyle = BG_PANEL;
    c.fillRect(r.x, r.y, r.w, r.h);

    const af = t.airframeId ?? 'gripen';
    const abStage = t.abStage ?? (t.boost > 0.66 ? 3 : t.boost > 0.33 ? 2 : t.boost > 0 ? 1 : 0);

    // Header bar
    c.fillStyle = 'rgba(109, 252, 192, 0.1)';
    c.fillRect(r.x, r.y, r.w, 30);
    c.font = `700 13px ${MONO}`;
    c.fillStyle = MINT;
    c.textAlign = 'left';
    c.fillText(`ENG / FUEL · ${(t.airframeName ?? af).toUpperCase()}`, r.x + 10, r.y + 20);
    c.textAlign = 'right';
    if (t.supercruise) {
      c.fillStyle = CYAN;
      c.fillText('SUPERCRUISE', r.x + r.w - 10, r.y + 20);
    } else if (abStage > 0) {
      c.fillStyle = AMBER;
      c.fillText(`AFTERBURNER Z${abStage}`, r.x + r.w - 10, r.y + 20);
    } else {
      c.fillStyle = t.abArmed ? MINT : MINT_DIM;
      c.fillText(t.abArmed ? 'AB ARMED' : 'MIL POWER', r.x + r.w - 10, r.y + 20);
    }

    const pad = 12;
    let y = r.y + 42;

    // 1. Throttle & AB Zone 1-3 segmented gauge
    const barW = r.w - pad * 2;
    const thr = clamp(t.throttle, 0, 1);
    const rpmPct = Math.round(52 + thr * 48 + (abStage > 0 ? 3 : 0));

    c.fillStyle = MINT_DIM;
    c.font = `600 11px ${MONO}`;
    c.textAlign = 'left';
    c.fillText(`N1 ${rpmPct}% · THROTTLE ${Math.round(thr * 100)}%`, r.x + pad, y);
    c.textAlign = 'right';
    const thrustKn = t.thrustN !== undefined ? (t.thrustN / 1000).toFixed(1) : '—';
    const maxKn = t.maxWetThrustN !== undefined ? Math.round(t.maxWetThrustN / 1000) : '—';
    c.fillStyle = abStage > 0 ? AMBER : MINT;
    c.fillText(`${thrustKn} / ${maxKn} kN`, r.x + r.w - pad, y);

    y += 8;
    // Main throttle bar (MIL = 70%, AB1-3 = 30%)
    const milW = barW * 0.7;
    const abW = barW * 0.3;
    c.strokeStyle = MINT_DIM;
    c.lineWidth = 1.2;
    c.strokeRect(r.x + pad, y, milW - 3, 14);
    c.fillStyle = MINT;
    c.fillRect(r.x + pad + 1, y + 1, (milW - 5) * thr, 12);

    for (let z = 1; z <= 3; z++) {
      const zw = (abW - 4) / 3;
      const zx = r.x + pad + milW + (z - 1) * zw;
      const lit = abStage >= z;
      c.strokeStyle = lit ? AMBER : MINT_DIM;
      c.strokeRect(zx, y, zw - 2, 14);
      if (lit) {
        c.fillStyle = AMBER;
        c.fillRect(zx + 1, y + 1, zw - 4, 12);
      }
      c.fillStyle = lit ? '#081016' : MINT_DIM;
      c.font = `700 9px ${MONO}`;
      c.textAlign = 'center';
      c.fillText(`Z${z}`, zx + zw * 0.5 - 1, y + 10);
    }

    // 2. Fuel Bar
    y += 32;
    const fuelFrac = clamp(t.fuelFrac ?? t.boostEnergy, 0, 1);
    const fuelPct = Math.round(fuelFrac * 100);
    c.textAlign = 'left';
    c.font = `600 11px ${MONO}`;
    c.fillStyle = fuelPct <= 15 ? RED : fuelPct <= 30 ? AMBER : MINT;
    const fuelTxt =
      t.fuelKg !== undefined && t.maxFuelKg !== undefined
        ? `FUEL ${Math.round(t.fuelKg)} / ${Math.round(t.maxFuelKg)} kg (${fuelPct}%)`
        : `FUEL / ENERGY ${fuelPct}%`;
    c.fillText(fuelTxt, r.x + pad, y);
    if (t.fuelFlowKgS !== undefined) {
      c.textAlign = 'right';
      c.fillStyle = MINT_DIM;
      c.fillText(`FF ${t.fuelFlowKgS.toFixed(1)} kg/s`, r.x + r.w - pad, y);
    }
    y += 7;
    c.strokeStyle = MINT_DIM;
    c.strokeRect(r.x + pad, y, barW, 12);
    c.fillStyle = fuelPct <= 15 ? RED : fuelPct <= 30 ? AMBER : MINT;
    c.fillRect(r.x + pad + 1, y + 1, (barW - 2) * fuelFrac, 10);

    // 3. Key Readout Grid (2x3)
    y += 26;
    const cellW = (barW - 10) * 0.5;
    const cellH = clamp(Math.floor((r.y + r.h - y - 34) / 3), 38, 56);
    const cells: Array<{ k: string; v: string; color: string }> = [
      {
        k: 'T/W RATIO',
        v: (t.twRatio ?? 0).toFixed(2),
        color: (t.twRatio ?? 0) >= 1 ? CYAN : MINT,
      },
      {
        k: 'SPEC EXCESS PWR (Ps)',
        v:
          t.specificExcessPowerMps !== undefined
            ? `${t.specificExcessPowerMps >= 0 ? '+' : ''}${Math.round(t.specificExcessPowerMps)} m/s`
            : '—',
        color: (t.specificExcessPowerMps ?? 0) >= 0 ? MINT : AMBER,
      },
      {
        k: 'MASS / GRAVITY',
        v: `${t.massKg ? Math.round(t.massKg).toLocaleString('en-US') + ' kg' : '—'} · ${(t.gravityMps2 ?? 9.81).toFixed(1)}g₀`,
        color: MINT,
      },
      {
        k: 'IAS / MACH',
        v: `${formatSpeed(t.iasMps ?? t.speedMps)} · ${t.airDensity > 0 ? 'M ' + t.mach.toFixed(2) : 'VAC'}`,
        color: t.mach >= 1 ? CYAN : MINT,
      },
      {
        k: 'DYN PRESS (q̄)',
        v:
          t.dynamicPressurePa !== undefined
            ? `${(t.dynamicPressurePa / 1000).toFixed(1)} kPa`
            : `${t.airDensity.toFixed(3)} kg/m³`,
        color: MINT_DIM,
      },
      {
        k: 'G LOAD / PEAK',
        v: `${t.gLoad.toFixed(1)}G · PK ${(t.gPeak ?? t.gLoad).toFixed(1)}G`,
        color: t.overGWarning ? RED : MINT,
      },
    ];

    cells.forEach((cell, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const cx = r.x + pad + col * (cellW + 10);
      const cy = y + row * (cellH + 6);
      c.strokeStyle = GRID_LINE;
      c.strokeRect(cx, cy, cellW, cellH);
      c.textAlign = 'left';
      c.fillStyle = MINT_DIM;
      c.font = `600 10px ${MONO}`;
      c.fillText(cell.k, cx + 6, cy + 14);
      c.fillStyle = cell.color;
      c.font = `700 13px ${MONO}`;
      c.fillText(cell.v, cx + 6, cy + cellH - 8);
    });

    // Footer status line
    c.textAlign = 'left';
    c.fillStyle = MINT_DIM;
    c.font = `600 11px ${MONO}`;
    c.fillText(`TIER ${t.speedTier.toUpperCase()}`, r.x + pad, r.y + r.h - 10);
    c.textAlign = 'right';
    c.fillText(`${t.weather.toUpperCase()} · ${t.airWorld.toUpperCase()}`, r.x + r.w - pad, r.y + r.h - 10);
  }

  // ===========================================================================
  // PAGE 4: NAV (Moving Map Underlay + Tactical PPI Compass + Intercept Vector)
  // ===========================================================================
  private drawNavPage(c: CanvasRenderingContext2D, r: MfdRect, t: JetTelemetry): void {
    // Scrim bands top and bottom, leaving center transparent for tNav 3D map
    c.fillStyle = BG_SCRIM;
    c.fillRect(r.x, r.y, r.w, 34);
    c.fillRect(r.x, r.y + r.h - 46, r.w, 46);

    const cx = r.x + r.w * 0.5;
    const cy = r.y + r.h * 0.56;
    const radius = Math.min(r.w, r.h - 70) * 0.42;

    // Range rings & compass rose
    c.save();
    c.strokeStyle = MINT_DIM;
    c.lineWidth = 1.2;
    c.beginPath();
    c.arc(cx, cy, radius, 0, Math.PI * 2);
    c.stroke();

    c.strokeStyle = GRID_LINE;
    c.beginPath();
    c.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
    c.stroke();

    const hdgRad = (t.headingDeg * Math.PI) / 180;
    const dirs = [
      { l: 'N', a: 0 },
      { l: 'E', a: Math.PI * 0.5 },
      { l: 'S', a: Math.PI },
      { l: 'W', a: Math.PI * 1.5 },
    ];
    c.font = `700 11px ${MONO}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6 - hdgRad - Math.PI * 0.5;
      c.strokeStyle = MINT_DIM;
      c.beginPath();
      c.moveTo(cx + Math.cos(a) * (radius - 5), cy + Math.sin(a) * (radius - 5));
      c.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
      c.stroke();
    }
    for (const d of dirs) {
      const a = d.a - hdgRad - Math.PI * 0.5;
      c.fillStyle = d.l === 'N' ? AMBER : MINT;
      c.fillText(d.l, cx + Math.cos(a) * (radius - 15), cy + Math.sin(a) * (radius - 15));
    }
    c.textBaseline = 'alphabetic';

    // Own-ship symbol + track vector line
    c.strokeStyle = MINT;
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(cx, cy - 10);
    c.lineTo(cx - 7, cy + 7);
    c.lineTo(cx, cy + 3);
    c.lineTo(cx + 7, cy + 7);
    c.closePath();
    c.stroke();

    c.strokeStyle = MINT_DIM;
    c.setLineDash([4, 4]);
    c.beginPath();
    c.moveTo(cx, cy - 12);
    c.lineTo(cx, cy - radius + 12);
    c.stroke();
    c.setLineDash([]);

    // Target intercept diamond (relative to view / waypoint)
    if (t.targetScreen) {
      const a = t.targetScreen.angle - Math.PI * 0.5;
      const distNorm = clamp(Math.log10(Math.max(1, t.targetDistKm) + 1) / 5, 0.25, 0.94);
      const tx = cx + Math.cos(a) * radius * distNorm;
      const ty = cy + Math.sin(a) * radius * distNorm;
      c.strokeStyle = AMBER;
      c.lineWidth = 1.6;
      c.beginPath();
      c.moveTo(cx, cy);
      c.lineTo(tx, ty);
      c.stroke();

      c.fillStyle = AMBER;
      c.beginPath();
      c.moveTo(tx, ty - 6);
      c.lineTo(tx + 6, ty);
      c.lineTo(tx, ty + 6);
      c.lineTo(tx - 6, ty);
      c.closePath();
      c.fill();
    }

    // Waypoint / landing runway marker
    if (t.waypoint) {
      const a = ((t.waypoint.bearingDeg - t.headingDeg) * Math.PI) / 180 - Math.PI * 0.5;
      const d = radius * 0.86;
      const wx = cx + Math.cos(a) * d;
      const wy = cy + Math.sin(a) * d;
      c.strokeStyle = CYAN;
      c.lineWidth = 1.8;
      c.strokeRect(wx - 4, wy - 4, 8, 8);
    }
    c.restore();

    // Header
    c.fillStyle = MINT;
    c.font = `700 13px ${MONO}`;
    c.textAlign = 'left';
    c.fillText(`NAV · ${t.anchor.toUpperCase()}`, r.x + 10, r.y + 22);
    c.textAlign = 'right';
    c.fillStyle = t.hasHorizon ? MINT : MINT_DIM;
    c.fillText(t.hasHorizon ? `HDG ${String(Math.round(((t.headingDeg % 360) + 360) % 360)).padStart(3, '0')}°` : 'DEEP SPACE', r.x + r.w - 10, r.y + 22);

    // Bottom Intercept / Waypoint Data Strip
    const by = r.y + r.h - 28;
    c.textAlign = 'left';
    c.font = `700 11px ${MONO}`;
    c.fillStyle = AMBER;
    c.fillText(
      `TGT ${t.target.toUpperCase()} · ${formatDistance(t.targetDistKm)} · ${formatEta(t.targetEtaS)}`,
      r.x + 10,
      by,
    );
    if (t.waypoint) {
      c.fillStyle = CYAN;
      c.font = `600 10px ${MONO}`;
      c.fillText(
        `WPT ${t.waypoint.name.toUpperCase()} · ${formatDistance(t.waypoint.distKm)} · BRG ${String(Math.round(t.waypoint.bearingDeg)).padStart(3, '0')}°`,
        r.x + 10,
        by + 16,
      );
    } else if (t.lat !== undefined && t.lon !== undefined) {
      c.fillStyle = MINT_DIM;
      c.font = `600 10px ${MONO}`;
      c.fillText(
        `${Math.abs(t.lat).toFixed(2)}°${t.lat >= 0 ? 'N' : 'S'} ${Math.abs(t.lon).toFixed(2)}°${t.lon >= 0 ? 'E' : 'W'}`,
        r.x + 10,
        by + 16,
      );
    }

    c.textAlign = 'right';
    c.fillStyle = MINT_DIM;
    c.font = `600 10px ${MONO}`;
    c.fillText(`CLS ${formatSpeed(t.closingMps)}`, r.x + r.w - 10, by);
    c.fillText(t.weather.toUpperCase(), r.x + r.w - 10, by + 16);
  }

  // ===========================================================================
  // LIVE 60 FPS STANDBY INSTRUMENTS & GLARESHIELD ANNUNCIATOR CLUSTER (4x2 ATLAS)
  // ===========================================================================
  private drawStandbyCluster(t: JetTelemetry, dt: number): void {
    const c = this.standbyCtx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.shadowBlur = 0;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.fillStyle = '#050a08';
    c.fillRect(0, 0, STANDBY_W, STANDBY_H);

    // Smooth needle response for engine EGT, VSI and G-load (zero jitter, real-instrument inertia)
    const kFast = 1 - Math.exp(-16 * dt);
    const kEgt = 1 - Math.exp(-3.5 * dt);
    const thr = clamp(t.throttle, 0, 1);
    const abStage = t.abStage ?? (t.boost > 0.66 ? 3 : t.boost > 0.33 ? 2 : t.boost > 0 ? 1 : 0);
    const targetEgt = 360 + thr * 410 + abStage * 78 + (t.supercruise ? 55 : 0);
    this.smoothEgtC += (targetEgt - this.smoothEgtC) * kEgt;
    this.smoothVsiMps += ((t.verticalSpeedMps ?? 0) - this.smoothVsiMps) * kFast;
    this.smoothG += (t.gLoad - this.smoothG) * kFast;

    // Row 0: Primary standby gauges (Speedometer, Artificial Horizon, Altimeter, VSI + G-Meter)
    this.drawStandbySpeedometer(c, 128, 128, 118, t);
    this.drawStandbyAdi(c, 384, 128, 118, t);
    this.drawStandbyAltimeter(c, 640, 128, 118, t);
    this.drawStandbyVsiG(c, 896, 128, 118, t);

    // Row 1: Engine N1 RPM, Engine EGT/Fuel, AoA Indexer Pod, Master Caution/GPWS Annunciator Pod
    this.drawStandbyRpm(c, 128, 384, 118, thr, abStage, Boolean(t.supercruise));
    this.drawStandbyEgtFuel(c, 384, 384, 118, t);
    this.drawStandbyAoaIndexer(c, 512, 256, 256, 256, t);
    this.drawStandbyAnnunciators(c, 768, 256, 256, 256, t, abStage);

    this.standbyTex.needsUpdate = true;
  }

  private drawDialBackdrop(c: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
    c.fillStyle = '#070b0d';
    c.beginPath();
    c.arc(cx, cy, r, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#2a3338';
    c.lineWidth = 4;
    c.stroke();
    c.strokeStyle = 'rgba(109, 252, 192, 0.22)';
    c.lineWidth = 1.5;
    c.beginPath();
    c.arc(cx, cy, r - 4, 0, Math.PI * 2);
    c.stroke();
  }

  private drawNeedle(
    c: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    angRad: number,
    len: number,
    tail: number,
    color: string,
    width = 5,
  ): void {
    const cs = Math.cos(angRad);
    const sn = Math.sin(angRad);
    c.strokeStyle = color;
    c.lineWidth = width;
    c.beginPath();
    c.moveTo(cx - cs * tail, cy - sn * tail);
    c.lineTo(cx + cs * len, cy + sn * len);
    c.stroke();

    // Luminous tip accent
    c.strokeStyle = '#ffffff';
    c.lineWidth = Math.max(2, width - 2);
    c.beginPath();
    c.moveTo(cx + cs * (len * 0.68), cy + sn * (len * 0.68));
    c.lineTo(cx + cs * len, cy + sn * len);
    c.stroke();

    // Center pivot cap
    c.fillStyle = '#1b2024';
    c.strokeStyle = '#6c7780';
    c.lineWidth = 2;
    c.beginPath();
    c.arc(cx, cy, 9, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  }

  /** Tile (0,0): Live Speedometer (IAS 0..1400 km/h + digital KT & Mach window). */
  private drawStandbySpeedometer(c: CanvasRenderingContext2D, cx: number, cy: number, r: number, t: JetTelemetry): void {
    this.drawDialBackdrop(c, cx, cy, r);
    const iasMps = t.airDensity > 0 && t.iasMps !== undefined ? t.iasMps : t.speedMps;
    const kmh = iasMps * 3.6;
    const kt = Math.round(iasMps * 1.943844);

    // Scale 0..1400 km/h mapped from 135 deg (bottom-left) clockwise 300 deg to 75 deg
    const aStart = (135 * Math.PI) / 180;
    const aSweep = (300 * Math.PI) / 180;

    // Redline Vne arc (1200..1400 km/h)
    c.strokeStyle = RED;
    c.lineWidth = 6;
    c.beginPath();
    c.arc(cx, cy, r - 11, aStart + (1200 / 1400) * aSweep, aStart + aSweep);
    c.stroke();

    // Green normal flight arc (250..1200 km/h)
    c.strokeStyle = 'rgba(88, 255, 170, 0.35)';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(cx, cy, r - 11, aStart + (250 / 1400) * aSweep, aStart + (1200 / 1400) * aSweep);
    c.stroke();

    // Major & minor ticks every 50 / 100 / 200 km/h
    c.font = `700 17px ${MONO}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    for (let v = 0; v <= 1400; v += 50) {
      const a = aStart + (v / 1400) * aSweep;
      const cs = Math.cos(a);
      const sn = Math.sin(a);
      const major = v % 200 === 0;
      const mid = v % 100 === 0;
      const inner = r - (major ? 26 : mid ? 19 : 14);
      c.strokeStyle = v >= 1200 ? RED : major ? '#eef4f0' : 'rgba(210, 226, 218, 0.6)';
      c.lineWidth = major ? 2.6 : 1.4;
      c.beginPath();
      c.moveTo(cx + cs * (r - 8), cy + sn * (r - 8));
      c.lineTo(cx + cs * inner, cy + sn * inner);
      c.stroke();
      if (major) {
        c.fillStyle = v >= 1200 ? RED : '#e6f5ee';
        c.fillText(String(v / 100), cx + cs * (r - 40), cy + sn * (r - 40));
      }
    }
    c.textBaseline = 'alphabetic';

    // Top label
    c.fillStyle = MINT_DIM;
    c.font = `700 12px ${MONO}`;
    c.fillText('IAS KM/H ×100', cx, cy - 30);

    // Digital KT + Mach drum box (lower center)
    c.fillStyle = '#030706';
    c.strokeStyle = 'rgba(88, 255, 170, 0.55)';
    c.lineWidth = 1.6;
    c.fillRect(cx - 52, cy + 28, 104, 46);
    c.strokeRect(cx - 52, cy + 28, 104, 46);
    c.fillStyle = MINT;
    c.font = `700 19px ${MONO}`;
    c.fillText(`${Math.min(9999, kt)} KT`, cx, cy + 48);
    c.fillStyle = t.mach >= 1 ? CYAN : AMBER;
    c.font = `700 15px ${MONO}`;
    c.fillText(t.airDensity > 0 ? `M ${t.mach.toFixed(2)}` : 'VACUUM', cx, cy + 68);

    // Live sweeping airspeed needle
    const frac = clamp(kmh / 1400, 0, 1.03);
    const needleAng = aStart + frac * aSweep;
    this.drawNeedle(c, cx, cy, needleAng, r - 20, 24, kmh >= 1200 ? RED : MINT, 5);
  }

  /** Tile (1,0): Live Standby Artificial Horizon (ADI pitch/roll sphere + slip indicator). */
  private drawStandbyAdi(c: CanvasRenderingContext2D, cx: number, cy: number, r: number, t: JetTelemetry): void {
    this.drawDialBackdrop(c, cx, cy, r);
    const innerR = r - 10;

    c.save();
    c.beginPath();
    c.arc(cx, cy, innerR, 0, Math.PI * 2);
    c.clip();

    // Rotate & shift horizon sphere
    c.save();
    c.translate(cx, cy);
    c.rotate((-t.rollDeg * Math.PI) / 180);
    const pitchPx = clamp(t.pitchDeg, -65, 65) * 2.2;

    // Sky & ground hemispheres
    c.fillStyle = '#12497a';
    c.fillRect(-innerR * 2, -innerR * 3, innerR * 4, innerR * 3 + pitchPx);
    c.fillStyle = '#4a2e16';
    c.fillRect(-innerR * 2, pitchPx, innerR * 4, innerR * 3);

    // Crisp horizon line
    c.strokeStyle = '#ffffff';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(-innerR * 1.4, pitchPx);
    c.lineTo(innerR * 1.4, pitchPx);
    c.stroke();

    // Pitch ladder bars (-30..+30 deg)
    c.strokeStyle = 'rgba(235, 250, 242, 0.9)';
    c.fillStyle = '#eafaf2';
    c.font = `700 12px ${MONO}`;
    c.textAlign = 'center';
    for (let deg = -30; deg <= 30; deg += 10) {
      if (deg === 0) continue;
      const y = pitchPx - deg * 2.2;
      const hw = deg % 20 === 0 ? 34 : 20;
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(-hw, y);
      c.lineTo(hw, y);
      c.stroke();
      if (deg % 20 === 0) {
        c.fillText(String(Math.abs(deg)), -hw - 14, y + 4);
        c.fillText(String(Math.abs(deg)), hw + 14, y + 4);
      }
    }
    c.restore();

    // Bank angle scale along upper perimeter
    c.strokeStyle = '#eef4f0';
    c.lineWidth = 2;
    const bankTicks = [-60, -45, -30, -15, 0, 15, 30, 45, 60];
    for (const deg of bankTicks) {
      const a = -Math.PI * 0.5 + (deg * Math.PI) / 180;
      const len = deg % 30 === 0 ? 12 : 7;
      c.beginPath();
      c.moveTo(cx + Math.cos(a) * (innerR - 2), cy + Math.sin(a) * (innerR - 2));
      c.lineTo(cx + Math.cos(a) * (innerR - 2 - len), cy + Math.sin(a) * (innerR - 2 - len));
      c.stroke();
    }

    // Rotating roll sky-pointer triangle
    c.save();
    c.translate(cx, cy);
    c.rotate((-clamp(t.rollDeg, -65, 65) * Math.PI) / 180);
    c.fillStyle = AMBER;
    c.beginPath();
    c.moveTo(0, -(innerR - 14));
    c.lineTo(-7, -(innerR - 26));
    c.lineTo(7, -(innerR - 26));
    c.closePath();
    c.fill();
    c.restore();

    // Fixed amber miniature aircraft waterline `-v-`
    c.strokeStyle = AMBER;
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(cx - 52, cy);
    c.lineTo(cx - 16, cy);
    c.lineTo(cx - 8, cy + 9);
    c.moveTo(cx + 52, cy);
    c.lineTo(cx + 16, cy);
    c.lineTo(cx + 8, cy + 9);
    c.stroke();
    c.fillStyle = AMBER;
    c.beginPath();
    c.arc(cx, cy, 4.5, 0, Math.PI * 2);
    c.fill();

    // Bottom slip / skid ball
    const slipY = cy + innerR - 20;
    c.fillStyle = 'rgba(4, 9, 10, 0.85)';
    c.strokeStyle = 'rgba(220, 235, 228, 0.55)';
    c.lineWidth = 1.5;
    c.fillRect(cx - 34, slipY - 8, 68, 16);
    c.strokeRect(cx - 34, slipY - 8, 68, 16);
    const ballX = cx + clamp((t.aosDeg ?? 0) * 2.2, -24, 24);
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.arc(ballX, slipY, 5.5, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = AMBER;
    c.beginPath();
    c.moveTo(cx - 8, slipY - 8);
    c.lineTo(cx - 8, slipY + 8);
    c.moveTo(cx + 8, slipY - 8);
    c.lineTo(cx + 8, slipY + 8);
    c.stroke();
    c.restore();
  }

  /** Tile (2,0): Live Barometric / Radar Altimeter (dual pointers + digital AGL/MSL + GPWS flag). */
  private drawStandbyAltimeter(c: CanvasRenderingContext2D, cx: number, cy: number, r: number, t: JetTelemetry): void {
    this.drawDialBackdrop(c, cx, cy, r);
    const altInfo = resolveAltitudeTelemetry(t);
    const altM = t.airWorld ? altInfo.aglM : t.altKm * 1000;
    const mslM = t.airWorld ? altInfo.mslM : t.altKm * 1000;

    // 0..9 circular scale (1 revolution = 1000 m)
    c.font = `700 20px ${MONO}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    for (let i = 0; i < 50; i++) {
      const a = -Math.PI * 0.5 + (i / 50) * Math.PI * 2;
      const cs = Math.cos(a);
      const sn = Math.sin(a);
      const major = i % 5 === 0;
      c.strokeStyle = major ? '#eef4f0' : 'rgba(205, 224, 215, 0.55)';
      c.lineWidth = major ? 2.6 : 1.4;
      c.beginPath();
      c.moveTo(cx + cs * (r - 8), cy + sn * (r - 8));
      c.lineTo(cx + cs * (r - (major ? 24 : 15)), cy + sn * (r - (major ? 24 : 15)));
      c.stroke();
      if (major) {
        c.fillStyle = '#e8f7f0';
        c.fillText(String(i / 5), cx + cs * (r - 39), cy + sn * (r - 39));
      }
    }
    c.textBaseline = 'alphabetic';

    c.fillStyle = MINT_DIM;
    c.font = `700 12px ${MONO}`;
    c.fillText('ALT · METERS', cx, cy - 32);

    // Digital drum window (AGL & MSL)
    const warn = Boolean(t.airWorld && altInfo.terrainWarning);
    const pull = altInfo.gpwsMode === 'pull-up' || t.warning === 1;
    const boxCol = pull ? RED : warn ? AMBER : MINT;
    c.fillStyle = '#030706';
    c.strokeStyle = boxCol;
    c.lineWidth = 1.8;
    c.fillRect(cx - 56, cy + 22, 112, 50);
    c.strokeRect(cx - 56, cy + 22, 112, 50);
    c.fillStyle = boxCol;
    c.font = `700 19px ${MONO}`;
    c.fillText(altM < 10000 ? `${Math.round(altM)}M` : `${(altM / 1000).toFixed(1)}K`, cx, cy + 44);
    c.fillStyle = CYAN;
    c.font = `600 13px ${MONO}`;
    c.fillText(`MSL ${mslM < 10000 ? Math.round(mslM) + 'M' : (mslM / 1000).toFixed(1) + 'K'}`, cx, cy + 64);

    if (warn && Math.floor(t.timeSec * 4) % 2 === 0) {
      c.fillStyle = pull ? RED : AMBER;
      c.fillRect(cx - 28, cy - 60, 56, 18);
      c.fillStyle = '#050a08';
      c.font = `700 12px ${MONO}`;
      c.fillText(pull ? 'PULL!' : 'LOW', cx, cy - 47);
    }

    // 10,000m broad short pointer + 1,000m crisp long pointer
    const ang10k = -Math.PI * 0.5 + (((altM / 10000) % 1 + 1) % 1) * Math.PI * 2;
    const ang1k = -Math.PI * 0.5 + (((altM / 1000) % 1 + 1) % 1) * Math.PI * 2;
    this.drawNeedle(c, cx, cy, ang10k, r - 48, 16, AMBER, 7);
    this.drawNeedle(c, cx, cy, ang1k, r - 18, 22, '#eef8f2', 4);
  }

  /** Tile (3,0): Live VSI (±60 m/s) + G-Load Meter (-3..+10 G with peak bug). */
  private drawStandbyVsiG(c: CanvasRenderingContext2D, cx: number, cy: number, r: number, t: JetTelemetry): void {
    this.drawDialBackdrop(c, cx, cy, r);

    // Outer VSI scale: 0 at 9 o'clock (PI), +60 m/s clockwise to 3 o'clock (2*PI - 0.35), -60 counter-clockwise
    const vsiClamped = clamp(this.smoothVsiMps, -60, 60);
    const maxAngle = (150 * Math.PI) / 180;
    c.font = `700 14px ${MONO}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    const vsiMarks = [-60, -40, -20, -10, 0, 10, 20, 40, 60];
    for (const v of vsiMarks) {
      const a = Math.PI + (v / 60) * maxAngle;
      const cs = Math.cos(a);
      const sn = Math.sin(a);
      c.strokeStyle = v === 0 ? AMBER : v > 0 ? MINT : '#e8b97c';
      c.lineWidth = v % 20 === 0 ? 2.6 : 1.6;
      c.beginPath();
      c.moveTo(cx + cs * (r - 8), cy + sn * (r - 8));
      c.lineTo(cx + cs * (r - 22), cy + sn * (r - 22));
      c.stroke();
      if (v % 20 === 0) {
        c.fillStyle = v > 0 ? MINT : v < 0 ? AMBER : '#ffffff';
        c.fillText(String(Math.abs(v)), cx + cs * (r - 36), cy + sn * (r - 36));
      }
    }
    c.textBaseline = 'alphabetic';

    c.fillStyle = MINT_DIM;
    c.font = `700 12px ${MONO}`;
    c.fillText('VSI m/s · G-LOAD', cx, cy - 30);

    // Inner digital G-meter & peak G pill + live G arc bar
    const gPeak = t.gPeak ?? t.gLoad;
    const gCol = t.overGWarning ? RED : this.smoothG > 6.5 ? AMBER : CYAN;
    c.fillStyle = '#030706';
    c.strokeStyle = gCol;
    c.lineWidth = 1.8;
    c.fillRect(cx - 52, cy + 20, 104, 48);
    c.strokeRect(cx - 52, cy + 20, 104, 48);
    c.fillStyle = gCol;
    c.font = `700 20px ${MONO}`;
    c.fillText(`${this.smoothG.toFixed(1)} G`, cx, cy + 42);
    c.fillStyle = AMBER;
    c.font = `600 13px ${MONO}`;
    c.fillText(`PK ${gPeak.toFixed(1)}G`, cx, cy + 61);

    // VSI live needle
    const vsiAng = Math.PI + (vsiClamped / 60) * maxAngle;
    this.drawNeedle(c, cx, cy, vsiAng, r - 18, 22, vsiClamped >= 0 ? MINT : AMBER, 4.5);
  }

  /** Tile (0,1): Live Engine N1 RPM % + Afterburner Zone badge. */
  private drawStandbyRpm(
    c: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    thr: number,
    abStage: number,
    supercruise: boolean,
  ): void {
    this.drawDialBackdrop(c, cx, cy, r);
    const rpm = clamp(50 + thr * 48 + abStage * 3.5, 0, 110);
    const aStart = (135 * Math.PI) / 180;
    const aSweep = (270 * Math.PI) / 180;

    // Green MIL arc (50..96%) & amber/red AB arc (96..110%)
    c.strokeStyle = MINT;
    c.lineWidth = 7;
    c.beginPath();
    c.arc(cx, cy, r - 14, aStart + (50 / 110) * aSweep, aStart + (96 / 110) * aSweep);
    c.stroke();
    c.strokeStyle = AMBER;
    c.beginPath();
    c.arc(cx, cy, r - 14, aStart + (96 / 110) * aSweep, aStart + aSweep);
    c.stroke();

    c.font = `700 16px ${MONO}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    for (let v = 0; v <= 110; v += 10) {
      const a = aStart + (v / 110) * aSweep;
      const cs = Math.cos(a);
      const sn = Math.sin(a);
      const major = v % 20 === 0;
      c.strokeStyle = v >= 100 ? AMBER : '#e6f5ee';
      c.lineWidth = major ? 2.5 : 1.4;
      c.beginPath();
      c.moveTo(cx + cs * (r - 9), cy + sn * (r - 9));
      c.lineTo(cx + cs * (r - (major ? 25 : 18)), cy + sn * (r - (major ? 25 : 18)));
      c.stroke();
      if (major) {
        c.fillStyle = v >= 100 ? AMBER : '#e6f5ee';
        c.fillText(String(v), cx + cs * (r - 40), cy + sn * (r - 40));
      }
    }
    c.textBaseline = 'alphabetic';

    c.fillStyle = MINT_DIM;
    c.font = `700 14px ${MONO}`;
    c.fillText('N1 RPM %', cx, cy - 28);

    c.fillStyle = '#030706';
    c.strokeStyle = abStage > 0 ? AMBER : supercruise ? CYAN : MINT;
    c.lineWidth = 1.8;
    c.fillRect(cx - 46, cy + 32, 92, 46);
    c.strokeRect(cx - 46, cy + 32, 92, 46);
    c.fillStyle = abStage > 0 ? AMBER : MINT;
    c.font = `700 20px ${MONO}`;
    c.fillText(`${Math.round(rpm)}%`, cx, cy + 54);
    c.fillStyle = supercruise ? CYAN : abStage > 0 ? AMBER : MINT_DIM;
    c.font = `700 13px ${MONO}`;
    c.fillText(supercruise ? 'SUPR' : abStage > 0 ? `AB Z${abStage}` : 'MIL', cx, cy + 72);

    this.drawNeedle(c, cx, cy, aStart + (rpm / 110) * aSweep, r - 20, 20, abStage > 0 ? AMBER : MINT, 5);
  }

  /** Tile (1,1): Live Engine EGT °C + Fuel % bar. */
  private drawStandbyEgtFuel(c: CanvasRenderingContext2D, cx: number, cy: number, r: number, t: JetTelemetry): void {
    this.drawDialBackdrop(c, cx, cy, r);
    const egt = clamp(this.smoothEgtC, 200, 1050);
    const aStart = (145 * Math.PI) / 180;
    const aSweep = (250 * Math.PI) / 180;

    // EGT arc: normal mint, high amber, hot red
    c.strokeStyle = MINT;
    c.lineWidth = 7;
    c.beginPath();
    c.arc(cx, cy, r - 14, aStart, aStart + 0.65 * aSweep);
    c.stroke();
    c.strokeStyle = AMBER;
    c.beginPath();
    c.arc(cx, cy, r - 14, aStart + 0.65 * aSweep, aStart + 0.84 * aSweep);
    c.stroke();
    c.strokeStyle = RED;
    c.beginPath();
    c.arc(cx, cy, r - 14, aStart + 0.84 * aSweep, aStart + aSweep);
    c.stroke();

    c.font = `700 14px ${MONO}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    for (let v = 200; v <= 1000; v += 100) {
      const a = aStart + ((v - 200) / 850) * aSweep;
      const cs = Math.cos(a);
      const sn = Math.sin(a);
      const major = v % 200 === 0;
      c.strokeStyle = v >= 900 ? RED : '#e6f5ee';
      c.lineWidth = major ? 2.4 : 1.4;
      c.beginPath();
      c.moveTo(cx + cs * (r - 9), cy + sn * (r - 9));
      c.lineTo(cx + cs * (r - (major ? 24 : 17)), cy + sn * (r - (major ? 24 : 17)));
      c.stroke();
      if (major) {
        c.fillStyle = v >= 900 ? RED : '#e6f5ee';
        c.fillText(String(v / 100), cx + cs * (r - 38), cy + sn * (r - 38));
      }
    }
    c.textBaseline = 'alphabetic';

    c.fillStyle = MINT_DIM;
    c.font = `700 13px ${MONO}`;
    c.fillText('EGT °C ×100', cx, cy - 28);

    // Digital EGT + Fuel bar box
    const fuelFrac = clamp(t.fuelFrac ?? t.boostEnergy, 0, 1);
    const fuelPct = Math.round(fuelFrac * 100);
    const fuelCol = fuelPct <= 15 ? RED : fuelPct <= 30 ? AMBER : MINT;
    c.fillStyle = '#030706';
    c.strokeStyle = egt >= 900 ? RED : 'rgba(88, 255, 170, 0.55)';
    c.lineWidth = 1.6;
    c.fillRect(cx - 52, cy + 28, 104, 52);
    c.strokeRect(cx - 52, cy + 28, 104, 52);
    c.fillStyle = egt >= 900 ? RED : egt >= 760 ? AMBER : MINT;
    c.font = `700 18px ${MONO}`;
    c.fillText(`${Math.round(egt)}°C`, cx, cy + 48);

    // Fuel gauge bar
    c.fillStyle = '#0d1a14';
    c.fillRect(cx - 44, cy + 56, 88, 8);
    c.fillStyle = fuelCol;
    c.fillRect(cx - 44, cy + 56, 88 * fuelFrac, 8);
    c.fillStyle = fuelCol;
    c.font = `700 12px ${MONO}`;
    c.fillText(`FUEL ${fuelPct}%`, cx, cy + 76);

    const egtAng = aStart + ((egt - 200) / 850) * aSweep;
    this.drawNeedle(c, cx, cy, egtAng, r - 20, 20, egt >= 900 ? RED : egt >= 760 ? AMBER : MINT, 5);
  }

  /** Tile (2,1): Live Military AoA Indexer (▼ ○ ▲) + Mach / α / FBW digital strip. */
  private drawStandbyAoaIndexer(
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    t: JetTelemetry,
  ): void {
    c.fillStyle = '#050908';
    c.fillRect(x, y, w, h);
    c.strokeStyle = 'rgba(88, 255, 170, 0.35)';
    c.lineWidth = 3;
    c.strokeRect(x + 6, y + 6, w - 12, h - 12);

    const cx = x + w * 0.5;
    const aoa = t.aoaDeg ?? 0;
    const highAoa = Boolean(t.alphaWarning || aoa > (t.gearDown ? 13.5 : 18));
    const onSpeed = t.gearDown ? aoa >= 10.5 && aoa <= 13.5 : !highAoa && aoa >= -2;
    const fastLow = t.gearDown ? aoa < 10.5 : aoa < -2;

    c.textAlign = 'center';
    c.fillStyle = MINT_DIM;
    c.font = `700 16px ${MONO}`;
    c.fillText('AOA INDEX', cx, y + 28);

    // Upper chevron ▼ (FAST / LOW AOA — amber)
    c.fillStyle = fastLow ? AMBER : '#1f1a0d';
    c.strokeStyle = fastLow ? '#ffe49e' : '#3b331d';
    c.lineWidth = 2.5;
    c.beginPath();
    c.moveTo(cx - 42, y + 44);
    c.lineTo(cx + 42, y + 44);
    c.lineTo(cx, y + 84);
    c.closePath();
    c.fill();
    c.stroke();

    // Center ring ○ (ON SPEED / NOMINAL — emerald)
    c.fillStyle = onSpeed ? MINT : '#0b2117';
    c.strokeStyle = onSpeed ? '#d2ffe9' : '#1b3d2d';
    c.lineWidth = 4;
    c.beginPath();
    c.arc(cx, y + 114, 22, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    // Lower chevron ▲ (SLOW / HIGH AOA — red/amber)
    const blinkHigh = !t.alphaWarning || Math.floor(t.timeSec * 5) % 2 === 0;
    c.fillStyle = highAoa && blinkHigh ? RED : '#240d0d';
    c.strokeStyle = highAoa && blinkHigh ? '#ffabab' : '#401b1b';
    c.lineWidth = 2.5;
    c.beginPath();
    c.moveTo(cx, y + 144);
    c.lineTo(cx + 42, y + 184);
    c.lineTo(cx - 42, y + 184);
    c.closePath();
    c.fill();
    c.stroke();

    // Digital α & Mach readout bar
    c.fillStyle = highAoa ? RED : MINT;
    c.font = `700 22px ${MONO}`;
    c.fillText(`α ${aoa.toFixed(1)}°`, cx, y + 216);
    c.fillStyle = t.mach >= 1 ? CYAN : AMBER;
    c.font = `700 18px ${MONO}`;
    c.fillText(`M ${t.mach.toFixed(2)} · ${(t.fbwMode ?? 'norm').toUpperCase()}`, cx, y + 242);
  }

  /** Tile (3,1): Live Master Caution / Warning / GPWS / Systems Annunciator Matrix. */
  private drawStandbyAnnunciators(
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    t: JetTelemetry,
    abStage: number,
  ): void {
    c.fillStyle = '#050809';
    c.fillRect(x, y, w, h);
    c.strokeStyle = 'rgba(120, 145, 138, 0.35)';
    c.lineWidth = 3;
    c.strokeRect(x + 6, y + 6, w - 12, h - 12);

    const blink = Math.floor(t.timeSec * 4) % 2 === 0;
    const altInfo = resolveAltitudeTelemetry(t);
    const pullUp = Boolean(t.warning === 1 || (t.airWorld && altInfo.gpwsMode === 'pull-up'));
    const terrain = Boolean(t.airWorld && altInfo.terrainWarning);
    const lowFuel = clamp(t.fuelFrac ?? t.boostEnergy, 0, 1) <= 0.2;
    const masterWarn = Boolean(pullUp || t.spinWarning || t.overGWarning);
    const masterCaut = Boolean(terrain || t.alphaWarning || lowFuel);

    const pad = 12;
    const gap = 8;
    const cellW = (w - pad * 2 - gap) * 0.5;
    const cellH = (h - pad * 2 - gap * 3) / 4;

    const drawLamp = (
      col: number,
      row: number,
      label: string,
      lit: boolean,
      onBg: string,
      onFg: string,
      offFg: string,
    ): void => {
      const lx = x + pad + col * (cellW + gap);
      const ly = y + pad + row * (cellH + gap);
      c.fillStyle = lit ? onBg : '#0b0f10';
      c.fillRect(lx, ly, cellW, cellH);
      c.strokeStyle = lit ? onFg : '#1f282a';
      c.lineWidth = lit ? 2.4 : 1.2;
      c.strokeRect(lx, ly, cellW, cellH);
      c.fillStyle = lit ? onFg : offFg;
      c.font = `700 15px ${MONO}`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(label, lx + cellW * 0.5, ly + cellH * 0.5 + 1);
      c.textBaseline = 'alphabetic';
    };

    drawLamp(0, 0, 'MSTR WARN', masterWarn && blink, '#6e0d12', '#ff6464', '#2e1618');
    drawLamp(1, 0, 'CAUTION', masterCaut, '#593d08', '#ffd266', '#2b2210');
    drawLamp(0, 1, 'PULL UP', pullUp && blink, '#7a0a0e', '#ff5252', '#2d1416');
    drawLamp(1, 1, 'TERRAIN', terrain, '#523407', '#ffbe4d', '#281f10');
    drawLamp(0, 2, 'OVER-G', Boolean(t.overGWarning), '#690c10', '#ff6060', '#2b1517');
    drawLamp(1, 2, 'HIGH α', Boolean(t.alphaWarning), '#4f3307', '#ffbe4d', '#261e10');
    drawLamp(0, 3, abStage > 0 ? `A/B Z${abStage}` : 'A/B OFF', abStage > 0, '#4f2c06', '#ffaa3b', '#221c12');
    drawLamp(
      1,
      3,
      t.airbrakeActive ? 'SPDBRK' : t.gearDown ? 'GEAR DN' : 'LOW FUEL',
      Boolean(t.airbrakeActive || t.gearDown || lowFuel),
      t.airbrakeActive ? '#4f3307' : t.gearDown ? '#0b4527' : '#631010',
      t.airbrakeActive ? AMBER : t.gearDown ? MINT : RED,
      '#17241e',
    );
  }
}
