import * as THREE from 'three';
import { NEBULAE, nebulaBasis, nebulaDirection } from './NebulaSky';

/**
 * A nebula you can fly to. Where its picture hangs on the sky, far out along the same direction,
 * stands a 3D version just as wide to the eye from the Solar System, so flying towards it it grows
 * from the sky picture into something enormous. It is built from the picture split by brightness
 * into layers at different depths (orbit around it and they separate, like the gas and dust really
 * do), and it moves the way that kind of nebula moves: gas boiling off the cliffs, jets firing from
 * the peaks, shells expanding from a dying star, a pulsar flickering at the heart of a remnant.
 */

export type NebulaName = (typeof NEBULAE)[number]['name'];

const LAYERS = 7;
const KIND = { drift: 0, evaporate: 1, jets: 2, expand: 3, pulsar: 4 } as const;

const layerVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vec3 n = normalize(mat3(modelMatrix) * vec3(0.0, 0.0, 1.0));
    vFacing = abs(dot(n, normalize(cameraPosition - wp.xyz)));
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const layerFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uKind;
  uniform float uBand;     // which brightness band this layer carries (0 dim … 1 bright)
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vFacing;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }

  void main() {
    vec2 uv = vUv;
    float t = uTime;
    vec2 c = vec2(0.5);
    // Expanding shells: the whole picture breathes outward from the centre
    if (uKind > 2.5 && uKind < 3.5) uv = c + (uv - c) * (1.0 - 0.018 * (0.5 + 0.5 * sin(t * 0.12)));
    // Flowing gas (rising where light is eating the clouds away)
    vec2 flowDir = uKind > 0.5 && uKind < 1.5 ? vec2(0.0, -1.0) : vec2(0.6, 0.2);
    vec2 q = vec2(fbm(uv * 3.0 + flowDir * t * 0.02), fbm(uv * 3.0 + 7.3 + flowDir * t * 0.02)) - 0.5;
    vec4 col = texture2D(uMap, uv + q * 0.008);

    float l = max(col.r, max(col.g, col.b));
    // This layer's share of the light: brightness bands sum to one, so head-on the picture is exact
    float w = 0.0, tot = 0.0;
    for (int i = 0; i < ${LAYERS}; i++) {
      float b = (float(i) + 0.5) / float(${LAYERS});
      float g = exp(-pow((l - b) / 0.16, 2.0));
      tot += g;
      if (abs(b - uBand) < 0.001) w = g;
    }
    w /= max(tot, 1e-4);
    col *= w;

    // Photoevaporation: wisps lifting off the tops of the clouds
    if (uKind > 0.5 && uKind < 1.5) {
      float below = texture2D(uMap, uv - vec2(0.0, 0.025)).a;
      float here = texture2D(uMap, uv).a;
      float edge = clamp(below * 2.0 - here * 1.5, 0.0, 1.0);
      float wisp = smoothstep(0.45, 0.9, fbm(vec2(uv.x * 9.0, uv.y * 4.0 - t * 0.05)));
      col.rgb += edge * wisp * vec3(1.0, 0.72, 0.5) * 0.55 / float(${LAYERS});
    }
    // Shells: streaks of gas running outward
    if (uKind > 2.5 && uKind < 3.5) {
      vec2 d = uv - c;
      float a = atan(d.y, d.x);
      float r = length(d);
      float s = smoothstep(0.6, 0.95, noise(vec2(a * 22.0, r * 10.0 - t * 0.08)));
      col.rgb += col.a * s * vec3(1.0, 0.75, 0.55) * 0.5;
    }
    // Bright stars in the picture twinkle
    float star = smoothstep(0.6, 0.95, l);
    float ph = hash(floor(uv * 700.0)) * 6.2831;
    col.rgb *= 1.0 + star * 0.4 * sin(t * (1.4 + ph * 0.4) + ph);

    // Edge-on, flat layers would show as lines: they fade as you swing round to the side
    float face = smoothstep(0.12, 0.45, vFacing);
    gl_FragColor = vec4(col.rgb, col.a * 0.6 * w) * uOpacity * face;
  }
`;

const sparkVertex = /* glsl */ `
  attribute vec3 aStart;
  attribute vec3 aDir;
  attribute float aSeed;
  uniform float uTime;
  uniform float uSize;
  uniform float uSpeed;
  varying float vFade;
  varying float vSeed;
  void main() {
    float ph = fract(aSeed * 7.13 + uTime * uSpeed * (0.6 + aSeed * 0.8));
    vec3 p = aStart + aDir * ph;
    vFade = sin(3.14159 * ph);
    vSeed = aSeed;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (0.5 + aSeed) * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const sparkFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vFade;
  varying float vSeed;
  void main() {
    vec2 d = gl_PointCoord - 0.5;
    float r = length(d);
    if (r > 0.5) discard;
    float a = exp(-r * r * 18.0) * vFade * uOpacity;
    gl_FragColor = vec4(uColor * a, a * 0.5);
  }
`;

const premultiplied = {
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  blending: THREE.CustomBlending,
  blendEquation: THREE.AddEquation,
  blendSrc: THREE.OneFactor,
  blendDst: THREE.OneMinusSrcAlphaFactor,
} as const;

export class NebulaStage {
  public readonly group = new THREE.Group();
  public readonly spec: (typeof NEBULAE)[number];
  /** Half its width, render units: what the camera frames. */
  public readonly radius: number;
  private time = { value: 0 };
  private opacity = { value: 0 };
  private disposables: Array<{ dispose(): void }> = [];

  /**
   * @param distance how far from the Sun it stands (render units)
   */
  constructor(name: string, tex: THREE.Texture, aspect: number, distance: number) {
    this.spec = NEBULAE.find((n) => n.name === name)!;
    const dir = nebulaDirection(this.spec);
    const { e, n } = nebulaBasis(dir, this.spec.roll);
    const width = 2 * distance * Math.tan(THREE.MathUtils.degToRad(this.spec.width / 2));
    const height = width / aspect;
    this.radius = width / 2;
    this.group.name = `nebula_stage_${name}`;
    this.group.position.copy(dir).multiplyScalar(distance);
    // The same orientation as its picture on the sky; the front (+z) faces the Sun
    const basis = new THREE.Matrix4().makeBasis(e, n, dir.clone().negate());
    this.group.quaternion.setFromRotationMatrix(basis);
    this.group.visible = false;

    // The layers, spread through a depth a fifth of the width; front layers a touch smaller
    const depth = width * 0.2;
    const geo = new THREE.PlaneGeometry(width, height, 1, 1);
    this.disposables.push(geo);
    for (let i = 0; i < LAYERS; i++) {
      const band = (i + 0.5) / LAYERS;
      const mat = new THREE.ShaderMaterial({
        uniforms: { uMap: { value: tex }, uTime: this.time, uKind: { value: KIND[this.spec.kind] }, uBand: { value: band }, uOpacity: this.opacity },
        vertexShader: layerVertex,
        fragmentShader: layerFragment,
        ...premultiplied,
      });
      this.disposables.push(mat);
      const m = new THREE.Mesh(geo, mat);
      // Bright gas sits nearer the Sun (local +z), faint gas further back
      const z = (band - 0.5) * depth * 0.9 + (Math.sin(i * 12.9898) * 0.5) * depth * 0.15;
      m.position.z = z;
      m.scale.setScalar(1 + (0.5 - band) * 0.08);
      m.renderOrder = 5 + i;
      m.frustumCulled = false;
      this.group.add(m);
    }

    this.addSparks(tex, width, height, depth);
  }

  /** Moving light: gas boiling off, jets, outward-racing knots, or a pulsar's flicker. */
  private addSparks(tex: THREE.Texture, width: number, height: number, depth: number): void {
    const kind = this.spec.kind;
    const starts: number[] = [], dirs: number[] = [], seeds: number[] = [];
    const toLocal = (u: number, v: number, z = 0) => [(u - 0.5) * width, (v - 0.5) * height, z];
    const rnd = (() => {
      let x = 12345;
      return () => ((x = (x * 16807) % 2147483647) / 2147483647);
    })();
    let color = new THREE.Color(1.0, 0.78, 0.55);
    let size = width * 0.0016;
    let speed = 0.035;

    if (kind === 'jets' && this.spec.jets) {
      color = new THREE.Color(0.75, 0.9, 1.0);
      size = width * 0.0011;
      speed = 0.09;
      for (const j of this.spec.jets) {
        for (let k = 0; k < 220; k++) {
          const [x, y, z] = toLocal(j.at[0], j.at[1], depth * 0.3);
          const spread = (rnd() - 0.5) * 0.12;
          starts.push(x, y, z);
          dirs.push((j.dir[0] - j.dir[1] * spread) * width, (j.dir[1] + j.dir[0] * spread) * height, (rnd() - 0.5) * depth * 0.05);
          seeds.push(rnd());
        }
      }
    } else if (kind === 'expand' || kind === 'pulsar') {
      // Knots racing outward from the centre
      for (let k = 0; k < 700; k++) {
        const a = rnd() * Math.PI * 2;
        const r0 = 0.08 + rnd() * 0.12;
        const [x, y] = toLocal(0.5 + Math.cos(a) * r0, 0.5 + Math.sin(a) * r0 * (width / height));
        starts.push(x, y, (rnd() - 0.5) * depth * 0.6);
        dirs.push(Math.cos(a) * width * 0.22, Math.sin(a) * width * 0.22, (rnd() - 0.5) * depth * 0.2);
        seeds.push(rnd());
      }
      speed = 0.02;
      size = width * 0.0012;
    } else {
      // Wisps lifting off bright edges: find them in the picture itself
      const img = tex.image as HTMLImageElement | ImageBitmap | undefined;
      const pts = img ? edgePoints(img) : [];
      for (let k = 0; k < 900 && pts.length; k++) {
        const [u, v] = pts[Math.floor(rnd() * pts.length)];
        const [x, y] = toLocal(u, v);
        starts.push(x, y, (rnd() - 0.2) * depth * 0.5);
        dirs.push((rnd() - 0.5) * width * 0.02, height * (0.04 + rnd() * 0.06), (rnd() - 0.5) * depth * 0.1);
        seeds.push(rnd());
      }
      speed = kind === 'drift' ? 0.012 : 0.03;
    }
    if (!seeds.length) return;

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(starts, 3));
    g.setAttribute('aStart', new THREE.Float32BufferAttribute(starts, 3));
    g.setAttribute('aDir', new THREE.Float32BufferAttribute(dirs, 3));
    g.setAttribute('aSeed', new THREE.Float32BufferAttribute(seeds, 1));
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: this.time, uSize: { value: size }, uSpeed: { value: speed }, uColor: { value: color }, uOpacity: this.opacity },
      vertexShader: sparkVertex,
      fragmentShader: sparkFragment,
      ...premultiplied,
    });
    const pts = new THREE.Points(g, mat);
    pts.frustumCulled = false;
    pts.renderOrder = 20;
    this.group.add(pts);
    this.disposables.push(g, mat);

    // The central star: the Helix's white dwarf, or a pulsar flickering thirty times a second
    if (kind === 'expand' || kind === 'pulsar') {
      const cg = new THREE.BufferGeometry();
      cg.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
      const cm = new THREE.ShaderMaterial({
        uniforms: { uTime: this.time, uOpacity: this.opacity, uSize: { value: width * (kind === 'pulsar' ? 0.03 : 0.02) }, uPulsar: { value: kind === 'pulsar' ? 1 : 0 } },
        vertexShader: /* glsl */ `
          uniform float uSize; uniform float uTime; uniform float uPulsar; varying float vI;
          void main() {
            vI = uPulsar > 0.5 ? 0.55 + 0.45 * step(0.5, fract(uTime * 30.0)) : 0.85 + 0.15 * sin(uTime * 0.9);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = uSize * (300.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          uniform float uOpacity; varying float vI;
          void main() {
            float r = length(gl_PointCoord - 0.5);
            float a = (exp(-r * r * 60.0) + 0.25 * exp(-r * r * 8.0)) * vI * uOpacity;
            gl_FragColor = vec4(vec3(0.85, 0.92, 1.0) * a, a * 0.3);
          }`,
        ...premultiplied,
      });
      const star = new THREE.Points(cg, cm);
      star.frustumCulled = false;
      star.renderOrder = 21;
      this.group.add(star);
      this.disposables.push(cg, cm);
    }
  }

  public setVisible(v: boolean): void {
    this.group.visible = v || this.opacity.value > 0.01;
    this.target = v ? 1 : 0;
  }

  private target = 0;

  public update(dt: number, brightness: number): void {
    this.time.value += dt;
    this.opacity.value += (this.target * brightness - this.opacity.value) * (1 - Math.exp(-dt * 1.5));
    this.group.visible = this.target > 0 || this.opacity.value > 0.01;
  }

  public dispose(): void {
    this.group.removeFromParent();
    this.disposables.forEach((d) => d.dispose());
  }
}

/** Points along the top edges of bright gas in a picture (u, v with v up), for rising wisps. */
function edgePoints(img: HTMLImageElement | ImageBitmap): Array<[number, number]> {
  const W = 160;
  const H = Math.max(8, Math.round((W * img.height) / img.width));
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');
  if (!ctx) return [];
  ctx.drawImage(img, 0, 0, W, H);
  const d = ctx.getImageData(0, 0, W, H).data;
  const a = (x: number, y: number) => d[(y * W + x) * 4 + 3] / 255;
  const out: Array<[number, number]> = [];
  for (let y = 3; y < H; y++) {
    for (let x = 0; x < W; x++) {
      // Dense here, thin just above: the sunlit top of a cloud
      if (a(x, y) > 0.3 && a(x, y - 3) < 0.18) out.push([(x + 0.5) / W, 1 - (y + 0.5) / H]);
    }
  }
  return out;
}
