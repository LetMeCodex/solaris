import * as THREE from 'three';

/**
 * Camera and glass optics for the jet: what a real camera and a real canopy do with sunlight.
 *
 * SunFlare: when the Sun is in frame, a starburst (diffraction from the aperture blades), a soft
 * halo, and a string of ghost reflections along the line from the Sun through the frame centre,
 * strongest when the Sun is near the middle. Built from sprites in the jet's metre-scale overlay.
 *
 * CanopyGlints: the fine scratches and polishing swirls every canopy has, invisible until the
 * Sun is ahead through the glass, then catching the light in bright arcs. A second skin on the
 * canopy's own geometry, shaded additively by the angle between the view and the Sun.
 */

function canvasTexture(size: number, draw: (x: CanvasRenderingContext2D, s: number) => void): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const x = c.getContext('2d') as CanvasRenderingContext2D;
  draw(x, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const starburst = (): THREE.CanvasTexture =>
  canvasTexture(512, (x, s) => {
    const c = s / 2;
    x.globalCompositeOperation = 'lighter';
    // Six long spikes (a hexagonal aperture) and twelve faint ones
    for (let i = 0; i < 18; i++) {
      const long = i < 6;
      const a = (i / (long ? 6 : 12)) * Math.PI * 2 + (long ? 0 : Math.PI / 12);
      const len = c * (long ? 0.98 : 0.55);
      const g = x.createLinearGradient(c, c, c + Math.cos(a) * len, c + Math.sin(a) * len);
      g.addColorStop(0, `rgba(255,250,240,${long ? 0.9 : 0.35})`);
      g.addColorStop(1, 'rgba(255,240,220,0)');
      x.strokeStyle = g;
      x.lineWidth = long ? 3 : 1.5;
      x.beginPath();
      x.moveTo(c, c);
      x.lineTo(c + Math.cos(a) * len, c + Math.sin(a) * len);
      x.stroke();
    }
    const r = x.createRadialGradient(c, c, 0, c, c, c * 0.35);
    r.addColorStop(0, 'rgba(255,255,255,1)');
    r.addColorStop(0.15, 'rgba(255,245,230,0.6)');
    r.addColorStop(1, 'rgba(255,230,200,0)');
    x.fillStyle = r;
    x.fillRect(0, 0, s, s);
  });

const halo = (): THREE.CanvasTexture =>
  canvasTexture(256, (x, s) => {
    const c = s / 2;
    const g = x.createRadialGradient(c, c, c * 0.62, c, c, c);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.45, 'rgba(160,200,255,0.18)');
    g.addColorStop(0.6, 'rgba(255,190,140,0.22)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, s, s);
  });

const ghost = (): THREE.CanvasTexture =>
  canvasTexture(128, (x, s) => {
    const c = s / 2;
    // A soft hexagon, as the aperture images itself
    x.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      x.lineTo(c + Math.cos(a) * c * 0.9, c + Math.sin(a) * c * 0.9);
    }
    x.closePath();
    const g = x.createRadialGradient(c, c, 0, c, c, c);
    g.addColorStop(0, 'rgba(255,255,255,0.25)');
    g.addColorStop(0.8, 'rgba(255,255,255,0.45)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g;
    x.fill();
  });

/** A large, faint spectral ring: the rainbow halo a low Sun throws through a lens. */
const rainbow = (): THREE.CanvasTexture =>
  canvasTexture(512, (x, s) => {
    const c = s / 2;
    const g = x.createRadialGradient(c, c, c * 0.6, c, c, c);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(0.5, 'rgba(140,90,255,0.10)');
    g.addColorStop(0.62, 'rgba(70,170,255,0.20)');
    g.addColorStop(0.72, 'rgba(90,255,150,0.20)');
    g.addColorStop(0.8, 'rgba(255,230,90,0.24)');
    g.addColorStop(0.88, 'rgba(255,120,60,0.22)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, s, s);
  });

/** A horizontal anamorphic streak. */
const streak = (): THREE.CanvasTexture =>
  canvasTexture(512, (x, s) => {
    const c = s / 2;
    x.save();
    x.translate(c, c);
    x.scale(1, 0.04);
    const g = x.createRadialGradient(0, 0, 0, 0, 0, c);
    g.addColorStop(0, 'rgba(255,250,240,0.95)');
    g.addColorStop(0.25, 'rgba(255,200,150,0.35)');
    g.addColorStop(1, 'rgba(255,160,100,0)');
    x.fillStyle = g;
    x.beginPath();
    x.arc(0, 0, c, 0, Math.PI * 2);
    x.fill();
    x.restore();
  });

export class SunFlare {
  public readonly group = new THREE.Group();
  private burst: THREE.Sprite;
  private ring: THREE.Sprite;
  private ghosts: Array<{ s: THREE.Sprite; f: number; size: number }> = [];
  private rainbowRing: THREE.Sprite;
  private streakSprite: THREE.Sprite;
  private veil: THREE.Sprite;
  /** 0..1 how warm the light is (a low Sun through air). */
  public warmth = 0;
  private textures: THREE.Texture[] = [];
  private tmp = new THREE.Vector3();

  constructor() {
    const mk = (tex: THREE.Texture, color: THREE.ColorRepresentation): THREE.Sprite => {
      const m = new THREE.SpriteMaterial({ map: tex, color, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, transparent: true });
      const s = new THREE.Sprite(m);
      s.renderOrder = 50;
      s.frustumCulled = false;
      this.group.add(s);
      return s;
    };
    const tb = starburst();
    const th = halo();
    const tg = ghost();
    this.textures.push(tb, th, tg);
    const tr = rainbow();
    const ts = streak();
    this.textures.push(tr, ts);
    this.veil = mk(th, 0xffb070);
    this.rainbowRing = mk(tr, 0xffffff);
    this.streakSprite = mk(ts, 0xffffff);
    this.burst = mk(tb, 0xffffff);
    this.ring = mk(th, 0xffffff);
    const ghosts: Array<[number, number, number]> = [
      [0.55, 0.025, 0x88aaff], [0.25, 0.04, 0xffcc88], [-0.2, 0.02, 0x99ffcc], [-0.45, 0.055, 0xaa88ff], [-0.8, 0.035, 0xffaa77], [-1.25, 0.08, 0x88ccff],
    ];
    for (const [f, size, col] of ghosts) this.ghosts.push({ s: mk(tg, col), f, size });
    this.group.visible = false;
  }

  /**
   * @param camera the overlay camera (at the origin, metres)
   * @param sunDir unit vector to the Sun, world axes
   * @param strength 0 hides; 1 is the Sun in clear space
   */
  /** How much the Sun is in the frame and near its middle (0..1), for auto-exposure. */
  public inView = 0;
  /** The Sun's position on screen (NDC) and whether it is ahead of the camera. */
  public screen = new THREE.Vector3(0, 0, 0);

  public update(camera: THREE.PerspectiveCamera, sunDir: THREE.Vector3, strength: number): void {
    const p = this.tmp.copy(sunDir).multiplyScalar(1000).project(camera);
    this.screen.set(p.x, p.y, p.z < 1 ? 1 : 0);
    const inFront = p.z < 1 && Math.abs(p.x) < 1.25 && Math.abs(p.y) < 1.25;
    this.group.visible = inFront && strength > 0.01;
    this.inView = this.group.visible ? strength * (1 - Math.min(1, Math.hypot(p.x, p.y) / 1.3)) : 0;
    if (!this.group.visible) return;
    const edge = 1 - THREE.MathUtils.smoothstep(Math.max(Math.abs(p.x), Math.abs(p.y)), 0.9, 1.25);
    const centre = 1 - Math.min(1, Math.hypot(p.x, p.y) / 1.2);
    const k = strength * edge;
    const D = 1000;
    const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * D;
    const place = (s: THREE.Sprite, nx: number, ny: number, sizeFrac: number, opacity: number): void => {
      // A point at distance D along the ray through (nx, ny), sized as a fraction of the frame height
      s.position.set(nx * tanH * camera.aspect, ny * tanH, -D).applyQuaternion(camera.quaternion);
      s.scale.setScalar(sizeFrac * 2 * tanH);
      (s.material as THREE.SpriteMaterial).opacity = opacity;
    };
    // Subtle, as real optics are: a tight starburst, a faint halo, ghosts you only just notice
    place(this.burst, p.x, p.y, 0.32, 0.42 * k);
    // The cinematic part: a rainbow halo, a horizontal streak, a warm glare over the frame
    place(this.rainbowRing, p.x, p.y, 0.85, 0.55 * k * (0.35 + 0.65 * centre));
    place(this.streakSprite, p.x, p.y, 1.0, 0.5 * k);
    this.streakSprite.scale.set(this.streakSprite.scale.x * 1.8, this.streakSprite.scale.y, 1);
    place(this.veil, p.x, p.y, 2.2, 0.35 * k * centre);
    (this.veil.material as THREE.SpriteMaterial).color.setRGB(1, 0.75 + 0.25 * (1 - this.warmth), 0.55 + 0.45 * (1 - this.warmth));
    place(this.ring, p.x, p.y, 0.6, 0.12 * k * (0.3 + 0.7 * centre));
    for (const g of this.ghosts) place(g.s, p.x * g.f, p.y * g.f, g.size, 0.1 * k * centre);
  }

  public dispose(): void {
    for (const t of this.textures) t.dispose();
    this.group.traverse((o) => {
      if (o instanceof THREE.Sprite) o.material.dispose();
    });
  }
}

/** Fine scratches, polishing swirls and dust on canopy glass. */
const scratches = (): THREE.CanvasTexture => {
  const t = canvasTexture(1024, (x, s) => {
    x.fillStyle = 'black';
    x.fillRect(0, 0, s, s);
    let seed = 3;
    const rnd = (): number => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    x.lineCap = 'round';
    // Polishing swirls: families of concentric arcs
    for (let f = 0; f < 7; f++) {
      const cx = rnd() * s;
      const cy = rnd() * s;
      for (let i = 0; i < 40; i++) {
        const r = 20 + rnd() * 260;
        const a0 = rnd() * Math.PI * 2;
        x.strokeStyle = `rgba(255,255,255,${0.15 + rnd() * 0.35})`;
        x.lineWidth = 0.6 + rnd() * 0.6;
        x.beginPath();
        x.arc(cx, cy, r, a0, a0 + 0.2 + rnd() * 1.2);
        x.stroke();
      }
    }
    // Long straight wipes and short nicks
    for (let i = 0; i < 160; i++) {
      const x0 = rnd() * s;
      const y0 = rnd() * s;
      const a = rnd() * Math.PI;
      const l = 10 + rnd() * (rnd() > 0.85 ? 400 : 60);
      x.strokeStyle = `rgba(255,255,255,${0.2 + rnd() * 0.6})`;
      x.lineWidth = 0.5 + rnd() * 0.8;
      x.beginPath();
      x.moveTo(x0, y0);
      x.lineTo(x0 + Math.cos(a) * l, y0 + Math.sin(a) * l);
      x.stroke();
    }
    // Dust specks
    for (let i = 0; i < 900; i++) {
      x.fillStyle = `rgba(255,255,255,${0.2 + rnd() * 0.5})`;
      x.fillRect(rnd() * s, rnd() * s, 1 + rnd() * 1.5, 1 + rnd() * 1.5);
    }
  });
  t.colorSpace = THREE.NoColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
};

export class CanopyGlints {
  public readonly mesh: THREE.Mesh;
  private material: THREE.ShaderMaterial;
  private texture: THREE.CanvasTexture;

  /** @param source the canopy glass mesh to skin (its geometry is shared, not copied) */
  constructor(source: THREE.Mesh) {
    this.texture = scratches();
    this.material = new THREE.ShaderMaterial({
      uniforms: { uScratch: { value: this.texture }, uSunDir: { value: new THREE.Vector3(0, 1, 0) }, uSun: { value: 0 } },
      vertexShader: /* glsl */ `
        varying vec3 vObj;
        varying vec3 vN;
        varying vec3 vWorld;
        void main() {
          vObj = position;
          vec4 w = modelMatrix * vec4(position, 1.0);
          vWorld = w.xyz;
          vN = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D uScratch;
        uniform vec3 uSunDir;
        uniform float uSun;
        varying vec3 vObj;
        varying vec3 vN;
        varying vec3 vWorld;
        void main() {
          // Triplanar: the canopy has no UVs suited to a texture
          vec3 n = abs(normalize(vN));
          vec3 w = n / (n.x + n.y + n.z);
          float sc = 0.9;
          float s = texture2D(uScratch, vObj.zy * sc).r * w.x + texture2D(uScratch, vObj.xz * sc).r * w.y + texture2D(uScratch, vObj.xy * sc).r * w.z;
          vec3 view = normalize(vWorld - cameraPosition);
          // Scratches scatter light forwards: brightest with the Sun ahead, through the glass
          float fwd = max(0.0, dot(view, uSunDir));
          float glint = pow(fwd, 10.0) * 0.28 + pow(fwd, 60.0) * 0.7;
          gl_FragColor = vec4(vec3(1.0, 0.97, 0.92) * s * glint * uSun, 1.0);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(source.geometry, this.material);
    this.mesh.renderOrder = 8;
    this.mesh.frustumCulled = false;
    this.mesh.matrixAutoUpdate = false;
    this.mesh.matrix.copy(source.matrix);
    source.parent?.add(this.mesh);
  }

  public update(sunDirWorld: THREE.Vector3, sun: number): void {
    this.material.uniforms.uSunDir.value.copy(sunDirWorld);
    this.material.uniforms.uSun.value = sun;
    this.mesh.visible = sun > 0.01;
  }

  public dispose(): void {
    this.material.dispose();
    this.texture.dispose();
  }
}
