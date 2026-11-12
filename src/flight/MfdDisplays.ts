import * as THREE from 'three';
import { perf } from '../rendering/Performance';
import type { JetTelemetry } from './JetController';

/**
 * The Gripen's three cockpit displays, alive. The model's display surfaces (material
 * `dynamic_mfd`) share one texture atlas: the left display in its top-left quarter, the centre in
 * the bottom-left, the right in the bottom-right. One canvas is drawn in that layout a few times
 * a second and used as both the colour and the glow of the screens:
 *  - Left, NAV: a heading-up moving map: compass rose, the track ahead, the target or waypoint
 *    with its bearing and distance, the place below.
 *  - Centre, PFD: the attitude (sky and ground, pitch ladder, bank), speed and altitude tapes,
 *    heading, Mach and g.
 *  - Right, SYS: throttle and afterburner, boost energy, Mach, g, speed tier, weather and local time.
 *
 * The left and centre displays are real 3D, live: synthetic vision. The centre shows the world
 * ahead of the nose (the real scene: Google's 3D cities, the terrain, the sky), rendered by a
 * camera on the jet's axis; the left a heading-up 3D moving map, the ground below seen from
 * above. The symbols are drawn over them from the canvas (transparent there). The canvas is drawn
 * at 2048 px for the 1024 layout, so lines and figures stay sharp close up.
 */

const RES = 2048;
const PFD_FOV = 58;

const screenVert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const screenFrag = /* glsl */ `
uniform sampler2D tCanvas;
uniform sampler2D tPfd;
uniform sampler2D tNav;
uniform float uViews;
varying vec2 vUv;
vec3 srgbToLinear(vec3 c) { return pow(c, vec3(2.2)); }
// Inside a display's rectangle (atlas uv), the local coordinate, else -1
vec2 local(vec2 uv, vec4 r) { vec2 l = (uv - r.xy) / r.zw; return (l.x < 0.0 || l.y < 0.0 || l.x > 1.0 || l.y > 1.0) ? vec2(-1.0) : l; }
void main() {
  vec4 sym = texture2D(tCanvas, vec2(vUv.x, 1.0 - vUv.y));
  vec3 col = vec3(0.0);
  vec2 lp = local(vUv, vec4(0.0645, 0.0, 0.375, 0.5));
  vec2 ln = local(vUv, vec4(0.0078, 0.564, 0.4844, 0.371));
  if (uViews > 0.5 && lp.x >= 0.0) col = texture2D(tPfd, lp).rgb * 0.9;
  else if (uViews > 0.5 && ln.x >= 0.0) col = texture2D(tNav, ln).rgb * 0.85;
  // The symbols glow over the picture (a display is emissive)
  col = mix(col, srgbToLinear(sym.rgb) * 1.6, sym.a);
  gl_FragColor = vec4(col, 1.0);
}`;

/** Layout units (the canvas is drawn at RES pixels for these). */
const S = 1024;
const MINT = '#6dfcc0';
const AMBER = '#f4cd72';
const DIM = 'rgba(109,252,192,0.45)';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

/** Each display's rectangle on the canvas (y down), from the atlas UVs. */
const LEFT = { x: 8, y: 66, w: 496, h: 380 };
const CENTRE = { x: 66, y: 520, w: 384, h: 500 };
const RIGHT = { x: 520, y: 578, w: 496, h: 380 };

export class MfdDisplays {
  public readonly texture: THREE.CanvasTexture;
  private canvas = document.createElement('canvas');
  private ctx: CanvasRenderingContext2D;
  private last = -1;

  private pfdTarget = new THREE.WebGLRenderTarget(384, 500, { type: THREE.HalfFloatType });
  private navTarget = new THREE.WebGLRenderTarget(496, 380, { type: THREE.HalfFloatType });
  private pfdCam = new THREE.PerspectiveCamera(PFD_FOV, 384 / 500, 1e-6, 2.4e8);
  private navCam = new THREE.PerspectiveCamera(50, 496 / 380, 1e-6, 2.4e8);
  private screenMat: THREE.ShaderMaterial;
  private frameNo = 0;
  private tmp = new THREE.Vector3();
  private tmp2 = new THREE.Vector3();

  constructor() {
    this.canvas.width = this.canvas.height = RES;
    // Drawn in main memory (a few ms), so a rectangle of it can be sent to the GPU on its own
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    // Stored as drawn (row 0 the canvas's top), as the rectangle uploads write it; the screens'
    // v runs up, so the shader reads it at 1 - v
    this.texture.flipY = false;
    this.texture.anisotropy = 16;
    this.texture.generateMipmaps = true;
    this.texture.minFilter = THREE.LinearMipmapLinearFilter;
    this.screenMat = new THREE.ShaderMaterial({
      uniforms: { tCanvas: { value: this.texture }, tPfd: { value: this.pfdTarget.texture }, tNav: { value: this.navTarget.texture }, uViews: { value: 0 } },
      vertexShader: screenVert,
      fragmentShader: screenFrag,
    });
    this.screenMat.name = 'dynamic_mfd_live';
  }

  /**
   * Render the two 3D views (inside the floating-origin draw: the eye at the origin), small
   * targets, each a few times a second: every one of them draws the whole world again (every 3D
   * tile in view), and on alternate frames they had cost as much as half the frame's draw calls.
   * Real displays refresh their 3D pages slower than the eye's frame anyway. Slower still when the
   * frame rate is already struggling (the governor has lowered the resolution).
   * `forward` and `up`: the jet's nose and roof; `vertical`: away from the world's centre;
   * `unitsPerKm` at the jet; `altKm` above ground.
   */
  public renderViews(renderer: THREE.WebGLRenderer, scene: THREE.Scene, forward: THREE.Vector3, up: THREE.Vector3, vertical: THREE.Vector3, unitsPerKm: number, altKm: number, near: number, on: boolean): void {
    this.flush(renderer);
    this.screenMat.uniforms.uViews.value = on ? 1 : 0;
    if (!on) return;
    const period = (perf.tier === 'high' ? 8 : 12) * (perf.scale < 0.85 ? 2 : 1);
    const slot = this.frameNo++ % period;
    const which = slot === 0 ? 0 : slot === period / 2 ? 2 : -1;
    if (which < 0) return;
    const target = renderer.getRenderTarget();
    const autoClear = renderer.autoClear;
    try {
      renderer.autoClear = true;
      if (which === 0) {
        // Synthetic vision: straight down the jet's axis
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
        // Moving map: above the jet looking down, heading up, the jet a little below the centre
        const hKm = THREE.MathUtils.clamp(altKm * 5 + 4, 5, 600);
        const head = this.tmp.copy(forward).addScaledVector(vertical, -forward.dot(vertical));
        if (head.lengthSq() < 1e-8) head.copy(up);
        head.normalize();
        const c = this.navCam;
        const half = hKm * Math.tan(THREE.MathUtils.degToRad(25));
        c.position.copy(vertical).multiplyScalar(hKm * unitsPerKm).addScaledVector(head, half * 0.24 * unitsPerKm);
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
    this.pfdTarget.dispose();
    this.navTarget.dispose();
    this.screenMat.dispose();
    this.texture.dispose();
  }

  /** Give the model's display surfaces this live picture. */
  public attach(root: THREE.Object3D): number {
    let n = 0;
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m, i) => {
        if (m.name !== 'dynamic_mfd') return;
        if (Array.isArray(mesh.material)) mesh.material[i] = this.screenMat;
        else mesh.material = this.screenMat;
        n++;
      });
    });
    return n;
  }

  /**
   * Redraw the displays: one of the three every 40 ms (each still refreshes every 0.12 s), and
   * only its rectangle sent to the GPU (see flush). Redrawing the whole 2048 px atlas and sending
   * it all (16 MB, with its mipmaps) held every fifth frame for 50-70 ms.
   */
  public update(t: JetTelemetry, timeSec: number): void {
    if (timeSec - this.last < 0.04) return;
    this.last = timeSec;
    const c = this.ctx;
    c.setTransform(RES / S, 0, 0, RES / S, 0, 0);
    if (!this.drawnOnce) {
      // Transparent where the 3D views show through (left and centre), dark elsewhere
      c.clearRect(0, 0, S, S);
      this.drawNav(c, t);
      this.drawPfd(c, t);
      this.drawSys(c, t);
      this.texture.needsUpdate = true;
      this.drawnOnce = true;
      return;
    }
    const k = this.turn++ % 3;
    const r = k === 0 ? LEFT : k === 1 ? CENTRE : RIGHT;
    c.clearRect(r.x - 2, r.y - 2, r.w + 4, r.h + 4);
    if (k === 0) this.drawNav(c, t);
    else if (k === 1) this.drawPfd(c, t);
    else this.drawSys(c, t);
    const px = RES / S;
    const x0 = Math.max(0, Math.floor((r.x - 2) * px));
    const y0 = Math.max(0, Math.floor((r.y - 2) * px));
    this.dirty.push({ x: x0, y: y0, w: Math.min(RES, Math.ceil((r.x + r.w + 2) * px)) - x0, h: Math.min(RES, Math.ceil((r.y + r.h + 2) * px)) - y0 });
  }

  private drawnOnce = false;
  private turn = 0;
  private dirty: Array<{ x: number; y: number; w: number; h: number }> = [];

  /** Send the redrawn rectangles to the GPU texture (a sub-rectangle upload, then its mipmaps). */
  private flush(renderer: THREE.WebGLRenderer): void {
    if (this.dirty.length === 0) return;
    const props = renderer.properties.get(this.texture) as { __webglTexture?: WebGLTexture; __version?: number };
    // Not on the GPU yet, or a whole upload already due: three.js sends it all
    if (!props.__webglTexture || props.__version !== this.texture.version) {
      this.dirty.length = 0;
      return;
    }
    const gl = renderer.getContext() as WebGL2RenderingContext;
    renderer.state.bindTexture(gl.TEXTURE_2D, props.__webglTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    for (const d of this.dirty) {
      gl.pixelStorei(gl.UNPACK_SKIP_PIXELS, d.x);
      gl.pixelStorei(gl.UNPACK_SKIP_ROWS, d.y);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, d.x, d.y, d.w, d.h, gl.RGBA, gl.UNSIGNED_BYTE, this.canvas);
    }
    gl.pixelStorei(gl.UNPACK_SKIP_PIXELS, 0);
    gl.pixelStorei(gl.UNPACK_SKIP_ROWS, 0);
    gl.generateMipmap(gl.TEXTURE_2D);
    this.dirty.length = 0;
  }

  private frame(c: CanvasRenderingContext2D, r: { x: number; y: number; w: number; h: number }, title: string, opaque = true): void {
    const g = c.createRadialGradient(r.x + r.w / 2, r.y + r.h / 2, 10, r.x + r.w / 2, r.y + r.h / 2, r.w * 0.8);
    g.addColorStop(0, opaque ? 'rgba(14,40,30,1)' : 'rgba(0,0,0,0)');
    g.addColorStop(1, opaque ? 'rgba(2,8,6,1)' : 'rgba(0,0,0,0.55)');
    c.fillStyle = g;
    c.fillRect(r.x, r.y, r.w, r.h);
    c.strokeStyle = 'rgba(109,252,192,0.25)';
    c.lineWidth = 2;
    c.strokeRect(r.x + 6, r.y + 6, r.w - 12, r.h - 12);
    c.font = `600 22px ${MONO}`;
    c.fillStyle = MINT;
    c.textAlign = 'left';
    c.fillText(title, r.x + 16, r.y + 34);
  }

  private drawNav(c: CanvasRenderingContext2D, t: JetTelemetry): void {
    const r = LEFT;
    this.frame(c, r, 'NAV', false);
    const cx = r.x + r.w / 2;
    const cy = r.y + r.h * 0.62;
    const rad = r.h * 0.42;
    c.save();
    c.beginPath();
    c.rect(r.x + 8, r.y + 44, r.w - 16, r.h - 52);
    c.clip();
    // Compass rose, heading up
    c.strokeStyle = DIM;
    c.lineWidth = 2;
    c.beginPath();
    c.arc(cx, cy, rad, 0, Math.PI * 2);
    c.stroke();
    for (let d = 0; d < 360; d += 10) {
      const a = ((d - t.headingDeg) * Math.PI) / 180 - Math.PI / 2;
      const l = d % 30 === 0 ? 18 : 9;
      c.beginPath();
      c.moveTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
      c.lineTo(cx + Math.cos(a) * (rad - l), cy + Math.sin(a) * (rad - l));
      c.stroke();
      if (d % 90 === 0) {
        c.fillStyle = MINT;
        c.font = `600 20px ${MONO}`;
        c.textAlign = 'center';
        c.fillText(['N', 'E', 'S', 'W'][d / 90], cx + Math.cos(a) * (rad - 34), cy + Math.sin(a) * (rad - 34) + 7);
      }
    }
    // Track ahead and the jet
    c.setLineDash([8, 8]);
    c.beginPath();
    c.moveTo(cx, cy);
    c.lineTo(cx, cy - rad);
    c.stroke();
    c.setLineDash([]);
    c.fillStyle = MINT;
    c.beginPath();
    c.moveTo(cx, cy - 14);
    c.lineTo(cx - 11, cy + 10);
    c.lineTo(cx + 11, cy + 10);
    c.closePath();
    c.fill();
    // Waypoint (or the world targeted): bearing on the rose, distance and name
    const wp = t.waypoint;
    if (wp) {
      const a = ((wp.bearingDeg - t.headingDeg) * Math.PI) / 180 - Math.PI / 2;
      const d = Math.min(1, Math.log10(1 + wp.distKm) / 4) * rad;
      const x = cx + Math.cos(a) * d;
      const y = cy + Math.sin(a) * d;
      c.strokeStyle = '#78dcff';
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(x, y - 12);
      c.lineTo(x + 12, y);
      c.lineTo(x, y + 12);
      c.lineTo(x - 12, y);
      c.closePath();
      c.stroke();
      c.beginPath();
      c.moveTo(cx, cy);
      c.lineTo(x, y);
      c.stroke();
    }
    c.restore();
    c.font = `500 20px ${MONO}`;
    c.textAlign = 'right';
    c.fillStyle = MINT;
    c.fillText(`HDG ${String(Math.round(t.headingDeg) % 360).padStart(3, '0')}`, r.x + r.w - 16, r.y + 34);
    c.textAlign = 'left';
    c.fillStyle = wp ? '#78dcff' : DIM;
    const line = wp ? `${wp.name.slice(0, 18).toUpperCase()}  ${Math.round(wp.distKm).toLocaleString('en-US')} KM` : `TGT ${t.target.toUpperCase()}`;
    c.fillText(line, r.x + 16, r.y + r.h - 18);
  }

  private drawPfd(c: CanvasRenderingContext2D, t: JetTelemetry): void {
    const r = CENTRE;
    const cx = r.x + r.w / 2;
    const cy = r.y + r.h * 0.48;
    const pxDeg = r.h / PFD_FOV;
    c.save();
    c.beginPath();
    c.rect(r.x, r.y, r.w, r.h);
    c.clip();
    // Sky and ground, rolled and pitched
    c.translate(cx, cy);
    c.rotate((-t.rollDeg * Math.PI) / 180);
    const off = t.pitchDeg * pxDeg;
    // A dark halo under the white so it reads over the picture: drawn as a wider dark stroke first
    // (a blurred canvas shadow on each line cost ~50 ms of GPU raster per display update)
    const halo = 'rgba(0,0,0,0.55)';
    const line = (x0: number, y0: number, x1: number, y1: number, width: number): void => {
      c.beginPath();
      c.moveTo(x0, y0);
      c.lineTo(x1, y1);
      c.strokeStyle = halo;
      c.lineWidth = width + 4;
      c.stroke();
      c.strokeStyle = '#ffffff';
      c.lineWidth = width;
      c.stroke();
    };
    line(-600, off, 600, off, 3);
    // Pitch ladder
    c.font = `500 16px ${MONO}`;
    c.fillStyle = '#ffffff';
    c.lineJoin = 'round';
    for (let p = -30; p <= 30; p += 5) {
      if (p === 0) continue;
      const y = off - p * pxDeg;
      const w = p % 10 === 0 ? 70 : 36;
      line(-w, y, w, y, 2);
      if (p % 10 === 0) {
        c.textAlign = 'left';
        c.strokeStyle = halo;
        c.lineWidth = 4;
        c.strokeText(String(Math.abs(p)), w + 6, y + 6);
        c.fillText(String(Math.abs(p)), w + 6, y + 6);
      }
    }
    c.restore();
    // Aircraft symbol
    c.strokeStyle = AMBER;
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(cx - 70, cy);
    c.lineTo(cx - 24, cy);
    c.lineTo(cx - 12, cy + 12);
    c.moveTo(cx + 70, cy);
    c.lineTo(cx + 24, cy);
    c.lineTo(cx + 12, cy + 12);
    c.stroke();
    // Tapes: speed (left), altitude (right)
    const box = (x: number, label: string, value: string): void => {
      c.fillStyle = 'rgba(0,0,0,0.65)';
      c.fillRect(x, cy - 26, 112, 52);
      c.strokeStyle = MINT;
      c.lineWidth = 2;
      c.strokeRect(x, cy - 26, 112, 52);
      c.fillStyle = MINT;
      c.font = `600 26px ${MONO}`;
      c.textAlign = 'center';
      c.fillText(value, x + 56, cy + 9);
      c.font = `500 15px ${MONO}`;
      c.fillText(label, x + 56, cy - 34);
    };
    box(r.x + 6, 'KM/H', String(Math.round(t.speedMps * 3.6)));
    const altM = t.altKm * 1000;
    box(r.x + r.w - 118, 'ALT M', altM < 99999 ? String(Math.round(altM)) : `${Math.round(t.altKm)}K`);
    // Heading and the numbers that matter in a turn
    c.fillStyle = 'rgba(0,0,0,0.6)';
    c.fillRect(r.x, r.y, r.w, 44);
    c.fillRect(r.x, r.y + r.h - 46, r.w, 46);
    c.fillStyle = MINT;
    c.font = `600 24px ${MONO}`;
    c.textAlign = 'center';
    c.fillText(String(Math.round(t.headingDeg) % 360).padStart(3, '0') + '°', cx, r.y + 31);
    c.font = `500 20px ${MONO}`;
    c.textAlign = 'left';
    c.fillText(`M ${t.mach.toFixed(2)}`, r.x + 12, r.y + r.h - 16);
    c.textAlign = 'right';
    c.fillStyle = t.gLoad > 7 ? '#ff7a6b' : MINT;
    c.fillText(`${t.gLoad.toFixed(1)} G`, r.x + r.w - 12, r.y + r.h - 16);
  }

  private drawSys(c: CanvasRenderingContext2D, t: JetTelemetry): void {
    const r = RIGHT;
    this.frame(c, r, 'SYS');
    const bar = (i: number, label: string, v: number, color: string, text: string): void => {
      const x = r.x + 20;
      const y = r.y + 64 + i * 58;
      c.fillStyle = DIM;
      c.font = `500 18px ${MONO}`;
      c.textAlign = 'left';
      c.fillText(label, x, y);
      c.fillStyle = 'rgba(109,252,192,0.12)';
      c.fillRect(x, y + 8, r.w - 160, 18);
      c.fillStyle = color;
      c.fillRect(x, y + 8, (r.w - 160) * THREE.MathUtils.clamp(v, 0, 1), 18);
      c.fillStyle = MINT;
      c.textAlign = 'right';
      c.font = `600 20px ${MONO}`;
      c.fillText(text, r.x + r.w - 20, y + 24);
    };
    bar(0, 'THROTTLE', t.throttle, t.boost > 0 ? '#ff9a3c' : MINT, `${Math.round(t.throttle * 100)}%${t.boost > 0 ? ' AB' : ''}`);
    bar(1, 'BOOST', t.boostEnergy, AMBER, `${Math.round(t.boostEnergy * 100)}%`);
    bar(2, 'MACH', Math.min(1, t.mach / 25), MINT, t.mach.toFixed(2));
    bar(3, 'LOAD', Math.min(1, Math.max(0, t.gLoad) / 9), t.gLoad > 7 ? '#ff7a6b' : MINT, `${t.gLoad.toFixed(1)} G`);
    c.fillStyle = AMBER;
    c.font = `500 19px ${MONO}`;
    c.textAlign = 'left';
    const h = Math.floor(t.localTime);
    const m = Math.floor((t.localTime - h) * 60);
    c.fillText(`${t.speedTier.toUpperCase()}  ·  ${t.weather.toUpperCase()}  ·  ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, r.x + 20, r.y + r.h - 22);
  }
}
