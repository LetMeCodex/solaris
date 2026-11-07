import * as THREE from 'three';
import { glowTexture } from './JetModel';

/**
 * What the sky does on its own while you fly: the phenomena a pilot out here would actually meet.
 * All of it lives in the jet's overlay scene (camera at the origin), placed by direction only, at
 * a fixed distance, the way the eye sees anything very far away.
 *
 * - Eclipses. Any world or moon passing in front of the Sun: the light dims as the disc is
 *   covered, a diamond ring flashes at the last sliver, and at totality the corona stands out
 *   around the black disc, its streamers masked where the world's own disc hides them.
 * - Solar flares. With the Sun in view, now and then it flares: a white flash and a coronal
 *   mass ejection, a faint shell blowing outwards.
 * - Comets. Out in interplanetary space, a comet sometimes hangs in the sky for a while: a bright
 *   coma, a straight blue ion tail and a broad curved dust tail, both pointing away from the Sun.
 * - Meteors. In the air at night, shooting stars, now and then a fireball, sometimes a shower
 *   streaming from one radiant.
 *
 * The random ones are seeded per session, so they come at irregular, natural intervals.
 */

const D = 900; // metres: everything here is "far", past the jet, inside the overlay's far plane

export interface SkyContext {
  /** Unit direction to the Sun from the camera. */
  sunDir: THREE.Vector3;
  /** Angular radius of the Sun's disc, radians. */
  sunAngle: number;
  /** The disc covering the Sun the most, if any. */
  occluder: { dir: THREE.Vector3; angle: number; name: string } | null;
  /** 0 vacuum .. 1 dense air at the jet. */
  air: number;
  /** Local up (away from the nearest world's centre). */
  up: THREE.Vector3;
  /** Height of the Sun above the local horizon, -1..1 (sine of its elevation). */
  sunElevation: number;
  /** Far from every planet (open interplanetary space). */
  deepSpace: boolean;
  /** Low over a world with air, from above it (orbit): meteors burn up in the air below you. */
  overAir?: boolean;
  /** Fraction of the frame-centre the Sun is in (from the flare). */
  sunInView: number;
}

const coronaMaterial = (): THREE.ShaderMaterial =>
  new THREE.ShaderMaterial({
    uniforms: {
      uOpacity: { value: 0 },
      uTime: { value: 0 },
      uBodyDir: { value: new THREE.Vector3(0, 0, -1) },
      uBodyCos: { value: 1 },
      uEdge: { value: 0.001 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vDir;
      void main() {
        vUv = uv;
        vec4 w = modelMatrix * vec4(position, 1.0);
        vDir = normalize(w.xyz);
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      uniform float uTime;
      uniform vec3 uBodyDir;
      uniform float uBodyCos;
      uniform float uEdge;
      varying vec2 vUv;
      varying vec3 vDir;
      // The plane spans 10 solar radii across: r is in solar radii
      void main() {
        vec2 p = (vUv - 0.5) * 10.0;
        float r = length(p);
        if (r < 0.98) discard;
        float a = atan(p.y, p.x);
        // K-corona: smooth, falling steeply; streamers: long petals, brighter towards the equator
        float k = pow(max(r, 1.0), -3.2);
        float petals = 0.55 + 0.45 * sin(a * 3.0 + 0.6) * sin(a * 5.0 + 1.9 + uTime * 0.02);
        float equator = 0.6 + 0.4 * pow(abs(cos(a)), 2.0);
        float streamers = pow(max(r, 1.0), -1.8) * petals * equator * 0.35;
        float fine = 0.85 + 0.15 * sin(a * 41.0) * sin(a * 23.0 + 1.0);
        float inner = smoothstep(0.98, 1.03, r);
        float glow = (k * 2.2 + streamers * fine) * inner;
        // Prominences: pink flecks just off the limb
        float prom = smoothstep(1.06, 1.0, r) * smoothstep(0.7, 1.0, sin(a * 9.0 + 2.0)) * 1.4;
        vec3 col = vec3(0.92, 0.95, 1.0) * glow + vec3(1.0, 0.35, 0.5) * prom;
        // The covering world's disc hides whatever is behind it
        float behind = smoothstep(uBodyCos - uEdge, uBodyCos + uEdge, dot(vDir, uBodyDir));
        float a2 = (1.0 - behind) * uOpacity * smoothstep(5.0, 3.0, r);
        gl_FragColor = vec4(col * a2, 1.0);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

const tailTexture = (colour: [number, number, number], curve: number): THREE.CanvasTexture => {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 128;
  const x = c.getContext('2d') as CanvasRenderingContext2D;
  for (let i = 0; i < 512; i++) {
    const u = i / 511;
    const w = 6 + u * 54;
    const yc = 64 + curve * u * u * 40;
    const g = x.createLinearGradient(0, yc - w, 0, yc + w);
    const a = Math.pow(1 - u, 1.6) * 0.9;
    const [r, gg, b] = colour;
    g.addColorStop(0, `rgba(${r},${gg},${b},0)`);
    g.addColorStop(0.5, `rgba(${r},${gg},${b},${a})`);
    g.addColorStop(1, `rgba(${r},${gg},${b},0)`);
    x.fillStyle = g;
    x.fillRect(i, yc - w, 1, w * 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

interface Meteor {
  start: THREE.Vector3;
  end: THREE.Vector3;
  age: number;
  life: number;
  bright: number;
  fireball: boolean;
}

const METEORS = 24;

export class SkyEvents {
  public readonly group = new THREE.Group();
  /** Fraction of the Sun's disc still showing (1 = uncovered): dims the light and the flare. */
  public sunVisible = 1;
  /** Extra brightness of the Sun's flare during a solar flare. */
  public flareBoost = 0;
  /** What is happening right now, for the HUD (empty when nothing). */
  public label = '';

  private corona: THREE.Mesh;
  private coronaMat = coronaMaterial();
  private diamond: THREE.Sprite;
  private cme: THREE.Sprite;
  private comet = new THREE.Group();
  private coma: THREE.Sprite;
  private ionTail: THREE.Mesh;
  private dustTail: THREE.Mesh;
  private meteorLines: THREE.LineSegments;
  private meteorPos = new Float32Array(METEORS * 6);
  private meteorCol = new Float32Array(METEORS * 6);
  private fireGlow: THREE.Sprite;
  private meteors: Meteor[] = [];
  private textures: THREE.Texture[] = [];
  private seed = (Date.now() % 100000) + 7;

  // Timers (seconds)
  private time = 0;
  private nextFlare = 30;
  private flareAge = -1;
  private nextComet = 25;
  /** A comet storm (the deep-time era): one comet after another, anywhere, quickly. */
  public storm = false;
  private camFwd = new THREE.Vector3(0, 0, -1);
  private cometAge = -1;
  private cometLife = 50;
  private cometDir = new THREE.Vector3();
  private cometName = '';
  private nextMeteor = 2;
  private showerUntil = -1;
  private radiant = new THREE.Vector3();
  private v = new THREE.Vector3();
  private w = new THREE.Vector3();

  constructor() {
    this.corona = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.coronaMat);
    this.corona.frustumCulled = false;
    this.corona.renderOrder = 1;
    const glow = glowTexture();
    this.textures.push(glow);
    const sprite = (color: number): THREE.Sprite => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 }));
      s.frustumCulled = false;
      s.renderOrder = 1;
      return s;
    };
    this.diamond = sprite(0xffffff);
    this.cme = sprite(0xffe0c0);
    this.coma = sprite(0xc8f0ff);
    this.fireGlow = sprite(0xffb070);

    const ion = tailTexture([120, 180, 255], 0);
    const dust = tailTexture([255, 235, 200], 1);
    this.textures.push(ion, dust);
    const tail = (map: THREE.Texture): THREE.Mesh => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1).translate(0.5, 0, 0),
        new THREE.MeshBasicMaterial({ map, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, opacity: 0 })
      );
      m.frustumCulled = false;
      return m;
    };
    this.ionTail = tail(ion);
    this.dustTail = tail(dust);
    this.comet.add(this.ionTail, this.dustTail, this.coma);
    this.comet.visible = false;

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.meteorPos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('color', new THREE.BufferAttribute(this.meteorCol, 3).setUsage(THREE.DynamicDrawUsage));
    this.meteorLines = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    this.meteorLines.frustumCulled = false;

    this.group.add(this.corona, this.diamond, this.cme, this.comet, this.meteorLines, this.fireGlow);
  }

  private rand(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  }

  private randomDir(out: THREE.Vector3): THREE.Vector3 {
    const z = this.rand() * 2 - 1;
    const a = this.rand() * Math.PI * 2;
    const r = Math.sqrt(1 - z * z);
    return out.set(r * Math.cos(a), r * Math.sin(a), z);
  }

  /** Point a sprite/plane at a direction, `angle` radians across (half-width). */
  private place(o: THREE.Object3D, dir: THREE.Vector3, halfAngle: number, dist = D): void {
    o.position.copy(dir).multiplyScalar(dist);
    const s = 2 * dist * Math.tan(Math.min(halfAngle, 1.4));
    o.scale.set(s, s, 1);
  }

  public update(dt: number, camera: THREE.Camera, ctx: SkyContext): void {
    this.time += dt;
    camera.getWorldDirection(this.camFwd);
    const labels: string[] = [];
    this.updateEclipse(camera, ctx, labels);
    this.updateFlare(dt, ctx, labels);
    this.updateComet(dt, ctx, labels);
    this.updateMeteors(dt, ctx, labels);
    this.label = labels[0] ?? '';
  }

  // ---------------------------------------------------------------- eclipses

  private updateEclipse(camera: THREE.Camera, ctx: SkyContext, labels: string[]): void {
    const oc = ctx.occluder;
    let corona = 0;
    let diamond = 0;
    this.sunVisible = 1;
    if (oc) {
      const sep = oc.dir.angleTo(ctx.sunDir);
      // How deep the Sun is behind the disc's edge, in solar radii (1 = just covered)
      const t = (oc.angle - sep) / Math.max(ctx.sunAngle, 1e-6);
      this.sunVisible = THREE.MathUtils.clamp((1 - t) / 2, 0, 1);
      // A disc smaller than the Sun (a transit) cannot make totality
      const canBeTotal = oc.angle > ctx.sunAngle * 0.98;
      if (canBeTotal) {
        corona = THREE.MathUtils.smoothstep(t, 0.75, 1.15) * (1 - ctx.air * 0.6);
        diamond = Math.exp(-Math.pow((t - 0.9) / 0.14, 2));
      }
      if (t > 0.9 && canBeTotal) labels.push(`TOTAL ECLIPSE · ${oc.name.toUpperCase()} COVERS THE SUN`);
      else if (t > -1 && canBeTotal) labels.push(`ECLIPSE · ${Math.round((1 - this.sunVisible) * 100)}% OF THE SUN COVERED`);
      else if (t > -1) labels.push(`TRANSIT · ${oc.name.toUpperCase()} CROSSES THE SUN`);

      // The corona plane faces the camera, ten solar radii across; the world's disc masks it
      this.place(this.corona, ctx.sunDir, ctx.sunAngle * 5);
      this.corona.quaternion.copy(camera.quaternion);
      const u = this.coronaMat.uniforms;
      u.uOpacity.value = corona;
      u.uTime.value = this.time;
      u.uBodyDir.value.copy(oc.dir);
      u.uBodyCos.value = Math.cos(oc.angle);
      u.uEdge.value = Math.max(1e-6, (1 - Math.cos(ctx.sunAngle * 0.15)));

      // The diamond: the last sliver of photosphere, on the side away from the disc's centre
      this.v.copy(ctx.sunDir).sub(this.w.copy(oc.dir).multiplyScalar(oc.dir.dot(ctx.sunDir)));
      if (this.v.lengthSq() > 1e-12) this.v.normalize();
      this.w.copy(ctx.sunDir).addScaledVector(this.v, Math.tan(ctx.sunAngle)).normalize();
      this.place(this.diamond, this.w, Math.max(ctx.sunAngle * 2.4, 0.03));
    }
    this.corona.visible = corona > 0.002;
    (this.diamond.material as THREE.SpriteMaterial).opacity = diamond * 0.95;
    this.diamond.visible = diamond > 0.01;
  }

  // ---------------------------------------------------------------- solar flares

  private updateFlare(dt: number, ctx: SkyContext, labels: string[]): void {
    const canSee = ctx.sunInView > 0.05 && this.sunVisible > 0.5 && ctx.air < 0.3;
    if (this.flareAge < 0) {
      if (canSee) this.nextFlare -= dt;
      if (this.nextFlare <= 0) {
        this.flareAge = 0;
        this.nextFlare = 45 + this.rand() * 90;
        this.flareClass = `${this.rand() < 0.3 ? 'X' : 'M'}${(1 + this.rand() * 8).toFixed(1)}`;
      }
    }
    let boost = 0;
    let cme = 0;
    let cmeSize = 1;
    if (this.flareAge >= 0) {
      this.flareAge += dt;
      const a = this.flareAge;
      boost = a < 0.6 ? a / 0.6 : Math.exp(-(a - 0.6) / 1.8);
      cmeSize = 1.2 + a * 0.9;
      cme = THREE.MathUtils.smoothstep(a, 0.3, 1.5) * Math.exp(-a / 4);
      if (a < 8) labels.push(`SOLAR FLARE · ${this.flareClass} CLASS`);
      if (a > 10) this.flareAge = -1;
    }
    this.flareBoost = boost * 1.4;
    this.place(this.cme, ctx.sunDir, ctx.sunAngle * cmeSize * 2.2);
    (this.cme.material as THREE.SpriteMaterial).opacity = cme * 0.35;
    this.cme.visible = cme > 0.01;
  }

  private flareClass = 'M1.0';

  // ---------------------------------------------------------------- comets

  private updateComet(dt: number, ctx: SkyContext, labels: string[]): void {
    if (this.cometAge < 0) {
      if ((ctx.deepSpace || this.storm) && ctx.air === 0) this.nextComet -= dt * (this.storm ? 12 : 1);
      if (this.nextComet <= 0) {
        this.cometAge = 0;
        this.cometLife = this.storm ? 14 + this.rand() * 10 : 40 + this.rand() * 30;
        this.nextComet = this.storm ? 30 + this.rand() * 40 : 70 + this.rand() * 110;
        // Somewhere clear of the Sun's glare
        // In a storm they come into view ahead (within ~35 degrees of where you look), clear of the Sun
        let tries = 0;
        do {
          this.randomDir(this.cometDir);
          if (this.storm) this.cometDir.multiplyScalar(0.6).add(this.camFwd).normalize();
        } while (this.cometDir.angleTo(ctx.sunDir) < 0.6 && ++tries < 20);
        const letter = 'ABCDEFGHJKLMNOPQRSTUVWXY'[Math.floor(this.rand() * 24)];
        this.cometName = `C/${new Date().getUTCFullYear()} ${letter}${1 + Math.floor(this.rand() * 9)}`;
      }
    }
    if (this.cometAge < 0) {
      this.comet.visible = false;
      return;
    }
    this.cometAge += dt;
    const a = this.cometAge;
    const fade = THREE.MathUtils.smoothstep(a, 0, 5) * (1 - THREE.MathUtils.smoothstep(a, this.cometLife - 6, this.cometLife));
    if (a > this.cometLife) this.cometAge = -1;
    this.comet.visible = fade > 0.005;
    labels.push(`COMET ${this.cometName} · TAIL AWAY FROM THE SUN`);

    const pos = this.v.copy(this.cometDir).multiplyScalar(D);
    this.comet.position.copy(pos);
    this.coma.position.set(0, 0, 0);
    this.coma.scale.setScalar(D * 0.05);
    (this.coma.material as THREE.SpriteMaterial).opacity = fade;
    // Tails: along the anti-solar direction, turned to face the eye as well as they can
    const anti = this.w.copy(ctx.sunDir).negate();
    const toEye = pos.clone().negate().normalize();
    const side = new THREE.Vector3().crossVectors(anti, toEye);
    if (side.lengthSq() < 1e-8) side.set(0, 1, 0);
    side.normalize();
    const normal = new THREE.Vector3().crossVectors(anti, side).normalize(); // right-handed: x × y = z
    const basis = new THREE.Matrix4().makeBasis(anti, side, normal);
    const len = D * 0.8;
    this.ionTail.quaternion.setFromRotationMatrix(basis);
    this.ionTail.scale.set(len, len * 0.07, 1);
    (this.ionTail.material as THREE.MeshBasicMaterial).opacity = fade * 0.75;
    // The dust tail lags the comet's motion: a broader, curved fan a little off the ion tail
    this.dustTail.quaternion.setFromRotationMatrix(basis).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0.16));
    this.dustTail.scale.set(len * 0.8, len * 0.3, 1);
    (this.dustTail.material as THREE.MeshBasicMaterial).opacity = fade * 0.7;
  }

  // ---------------------------------------------------------------- meteors

  private updateMeteors(dt: number, ctx: SkyContext, labels: string[]): void {
    const dark = 1 - THREE.MathUtils.smoothstep(ctx.sunElevation, -0.12, 0.02);
    // From the ground at night, or from orbit over the night side (looking down on the air)
    const can = (ctx.air > 0.02 && dark > 0.3) || (!!ctx.overAir && dark > 0.3);
    if (can) {
      this.nextMeteor -= dt;
      const shower = this.time < this.showerUntil;
      if (shower) labels.push('METEOR SHOWER');
      if (this.nextMeteor <= 0) {
        if (!shower && this.rand() < 0.12) {
          this.showerUntil = this.time + 25;
          // The radiant: somewhere up the sky
          this.randomDir(this.radiant);
          if (this.radiant.dot(ctx.up) < 0.3) this.radiant.addScaledVector(ctx.up, 0.8).normalize();
        }
        this.spawnMeteor(ctx, shower);
        this.nextMeteor = shower ? 0.25 + this.rand() * 0.6 : 1.5 + this.rand() * 4;
      }
    }

    let fire = 0;
    const firePos = this.v;
    for (let i = 0; i < METEORS; i++) {
      const m = this.meteors[i];
      const o = i * 6;
      if (!m) {
        this.meteorCol.fill(0, o, o + 6);
        continue;
      }
      m.age += dt;
      const k = m.age / m.life;
      if (k >= 1) {
        this.meteors[i] = undefined as unknown as Meteor;
        this.meteorCol.fill(0, o, o + 6);
        continue;
      }
      const head = this.w.copy(m.start).lerp(m.end, k).normalize();
      const tailK = Math.max(0, k - 0.35);
      const tail = new THREE.Vector3().copy(m.start).lerp(m.end, tailK).normalize();
      const env = Math.sin(Math.PI * Math.min(1, k * 1.15)) * m.bright * dark;
      this.meteorPos[o] = tail.x * D;
      this.meteorPos[o + 1] = tail.y * D;
      this.meteorPos[o + 2] = tail.z * D;
      this.meteorPos[o + 3] = head.x * D;
      this.meteorPos[o + 4] = head.y * D;
      this.meteorPos[o + 5] = head.z * D;
      this.meteorCol[o] = 0;
      this.meteorCol[o + 1] = 0;
      this.meteorCol[o + 2] = 0;
      this.meteorCol[o + 3] = (m.fireball ? 1.0 : 0.85) * env;
      this.meteorCol[o + 4] = (m.fireball ? 0.75 : 1.0) * env;
      this.meteorCol[o + 5] = (m.fireball ? 0.45 : 0.9) * env;
      if (m.fireball && env > fire) {
        fire = env;
        firePos.copy(head);
      }
    }
    this.meteorLines.geometry.attributes.position.needsUpdate = true;
    this.meteorLines.geometry.attributes.color.needsUpdate = true;
    this.fireGlow.visible = fire > 0.02;
    if (this.fireGlow.visible) {
      this.place(this.fireGlow, firePos, 0.012);
      (this.fireGlow.material as THREE.SpriteMaterial).opacity = fire;
    }
  }

  private spawnMeteor(ctx: SkyContext, shower: boolean): void {
    const slot = this.meteors.findIndex((m) => !m);
    const i = slot >= 0 ? slot : this.meteors.length < METEORS ? this.meteors.length : -1;
    if (i < 0) return;
    // Start somewhere above the horizon (from orbit: below it, in the air under you)
    const start = new THREE.Vector3();
    const below = !!ctx.overAir && ctx.air <= 0.02;
    for (let n = 0; n < 8; n++) {
      this.randomDir(start);
      const k = start.dot(ctx.up);
      if (below ? k < -0.15 && k > -0.8 : k > 0.25) break;
    }
    if (!below && start.dot(ctx.up) < 0.1) start.addScaledVector(ctx.up, 0.6).normalize();
    if (below && start.dot(ctx.up) > -0.1) start.addScaledVector(ctx.up, -0.6).normalize();
    // Its path: away from the radiant in a shower, else any direction, 6..25 degrees long
    const away = shower ? start.clone().sub(this.radiant) : this.randomDir(new THREE.Vector3());
    away.sub(start.clone().multiplyScalar(away.dot(start))).normalize();
    const len = THREE.MathUtils.degToRad(6 + this.rand() * 19);
    const end = start.clone().addScaledVector(away, Math.tan(len)).normalize();
    const fireball = this.rand() < (below ? 0.25 : 0.08);
    this.meteors[i] = { start, end, age: 0, life: 0.35 + this.rand() * 0.9 + (fireball ? 1.2 : 0), bright: fireball ? 2.2 : 0.5 + this.rand() * 0.8, fireball };
  }

  public dispose(): void {
    this.group.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | undefined;
      mat?.dispose();
    });
    for (const t of this.textures) t.dispose();
  }
}
