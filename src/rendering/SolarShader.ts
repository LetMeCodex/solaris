import * as THREE from 'three';
import { SUN_WORLD } from './RenderOrigin';

/**
 * The Sun, drawn from solar physics.
 *
 * Photosphere, as the solar observatories show it through their filters: boiling plasma. Convection
 * cells at several scales (the finest are the true ~1,000 km granules and resolve only up close),
 * swirls and bright filaments, differential rotation (the equator turns faster than the poles),
 * sunspots with dark umbrae and filamentary penumbrae in the two activity belts, bright faculae, and
 * limb darkening that cools the edge into deep orange.
 *
 * Limb: a ragged fringe of spicules, flames of chromospheric gas, each tongue its own height.
 * Corona: a hot glow hugging the disk, then streamers fixed to the Sun falling off as r^-3.
 *
 * Activity (SolarActivity): magnetic loops rise from active regions, glow, drain and fade, and now
 * and then one erupts and is flung outward like a coronal mass ejection.
 */

const NOISE = /* glsl */ `
  vec3 hash33(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yxz + 19.19);
    return fract((p.xxy + p.yxx) * p.zyx);
  }
  float vnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = dot(hash33(i) - 0.5, f);
    float n100 = dot(hash33(i + vec3(1, 0, 0)) - 0.5, f - vec3(1, 0, 0));
    float n010 = dot(hash33(i + vec3(0, 1, 0)) - 0.5, f - vec3(0, 1, 0));
    float n110 = dot(hash33(i + vec3(1, 1, 0)) - 0.5, f - vec3(1, 1, 0));
    float n001 = dot(hash33(i + vec3(0, 0, 1)) - 0.5, f - vec3(0, 0, 1));
    float n101 = dot(hash33(i + vec3(1, 0, 1)) - 0.5, f - vec3(1, 0, 1));
    float n011 = dot(hash33(i + vec3(0, 1, 1)) - 0.5, f - vec3(0, 1, 1));
    float n111 = dot(hash33(i + vec3(1, 1, 1)) - 0.5, f - vec3(1, 1, 1));
    return mix(mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
               mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y), f.z) * 2.0;
  }
  float fbm(vec3 p) {
    float s = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; }
    return s;
  }
  // Boiling granulation: distance to the nearest of a lattice of wandering cell centres
  vec2 granules(vec3 p, float t) {
    vec3 pi = floor(p);
    vec3 pf = fract(p);
    float d1 = 8.0, d2 = 8.0;
    for (int x = -1; x <= 1; x++)
    for (int y = -1; y <= 1; y++)
    for (int z = -1; z <= 1; z++) {
      vec3 g = vec3(float(x), float(y), float(z));
      vec3 h = hash33(pi + g);
      vec3 o = 0.5 + 0.42 * sin(t * (0.6 + h * 0.8) + h * 6.2831);
      vec3 d = g + o - pf;
      float dd = dot(d, d);
      if (dd < d1) { d2 = d1; d1 = dd; } else if (dd < d2) { d2 = dd; }
    }
    return vec2(sqrt(d1), sqrt(d2));
  }
`;

export class SolarShader {
  /** The photosphere. `sunTexture` (a full-disk solar map) only seeds the active regions' pattern. */
  public static createPhotosphereMaterial(sunTexture: THREE.Texture): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        sunTexture: { value: sunTexture },
        time: { value: 0.0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        varying vec3 vLocal;
        void main() {
          vUv = uv;
          vLocal = normalize(position);
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D sunTexture;
        uniform float time;
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        varying vec3 vLocal;
        ${NOISE}

        void main() {
          vec3 n = normalize(vWorldNormal);
          vec3 v = normalize(cameraPosition - vWorldPosition);
          float mu = clamp(dot(n, v), 0.0, 1.0);
          float om = 1.0 - mu;
          vec3 p = vLocal;
          float t = time;

          // Differential rotation: the equator turns faster than the poles
          float rot = t * 0.004 * (1.0 - 0.3 * p.y * p.y);
          vec3 q = vec3(p.x * cos(rot) - p.z * sin(rot), p.y, p.x * sin(rot) + p.z * cos(rot));
          // Boiling plasma: convection churned by a slowly evolving warp
          vec3 w = vec3(fbm(q * 2.6 + t * 0.010), fbm(q * 2.6 + 5.2 - t * 0.012), fbm(q * 2.6 + 9.1 + t * 0.008));
          vec3 qw = q + w * 0.28;
          float big = fbm(qw * 5.5 + t * 0.012);
          float mid = fbm(qw * 17.0 - t * 0.025);
          // Convection cells at scales you can see, and granules that resolve as you come close
          vec2 g1 = granules(qw * 55.0, t * 0.22);
          vec2 g2 = granules(q * 180.0, t * 0.35);
          vec2 g3 = granules(q * 520.0, t * 0.5);
          float cellA = smoothstep(0.0, 0.55, g1.y - g1.x);
          float cellB = smoothstep(0.0, 0.5, g2.y - g2.x);
          float cellC = smoothstep(0.0, 0.45, g3.y - g3.x);
          float fadeA = 1.0 - smoothstep(0.35, 0.9, length(fwidth(q * 55.0)));
          float fadeB = 1.0 - smoothstep(0.35, 0.9, length(fwidth(q * 180.0)));
          float fadeC = 1.0 - smoothstep(0.35, 0.9, length(fwidth(q * 520.0)));
          float heat = 0.62 + big * 0.62 + mid * 0.22 + (cellA - 0.5) * 0.16 * fadeA + (cellB - 0.5) * 0.12 * fadeB + (cellC - 0.5) * 0.1 * fadeC;
          // Bright plasma filaments threading the surface
          float ridge = 1.0 - abs(fbm(qw * 8.0 + vec3(0.0, t * 0.02, 0.0)) * 2.2);
          heat += pow(clamp(ridge, 0.0, 1.0), 8.0) * 0.22;

          // Active regions in the two activity belts: sunspots (umbra, penumbra) and bright faculae
          float lat = asin(clamp(q.y, -1.0, 1.0));
          float belt = smoothstep(0.08, 0.2, abs(lat)) * (1.0 - smoothstep(0.45, 0.62, abs(lat)));
          float tex = dot(texture2D(sunTexture, vUv).rgb, vec3(0.333));
          float region = belt * smoothstep(0.1, 0.35, vnoise(q * 4.0 + vec3(3.0, t * 0.002, 1.0)) + tex * 0.2 - 0.1);
          float spotField = vnoise(q * 30.0 + 11.0) + 0.45 * vnoise(q * 80.0);
          float umbra = region * smoothstep(0.44, 0.54, spotField);
          float penumbra = region * smoothstep(0.26, 0.44, spotField) * (1.0 - umbra);
          // Penumbral filaments
          penumbra *= 0.75 + 0.25 * vnoise(q * 260.0);
          float faculae = region * smoothstep(0.1, 0.5, spotField) * (1.0 - smoothstep(0.48, 0.6, spotField));
          heat *= 1.0 - umbra * 0.82 - penumbra * 0.38;
          heat += faculae * (0.12 + 0.5 * om);

          // Limb darkening (the edge is cooler gas higher up): dimmer and redder towards the rim
          float limb = 1.0 - 0.62 * om - 0.22 * (1.0 - mu * mu);
          float h = heat * mix(0.5, 1.0, clamp(limb, 0.0, 1.0));

          // Plasma colours, from the dark cool lanes to the white-hot cell tops
          vec3 c0 = vec3(0.32, 0.03, 0.0);
          vec3 c1 = vec3(0.86, 0.24, 0.02);
          vec3 c2 = vec3(1.0, 0.56, 0.1);
          vec3 c3 = vec3(1.0, 0.82, 0.38);
          vec3 c4 = vec3(1.0, 0.96, 0.82);
          vec3 col = h < 0.35 ? mix(c0, c1, h / 0.35)
                   : h < 0.62 ? mix(c1, c2, (h - 0.35) / 0.27)
                   : h < 0.9 ? mix(c2, c3, (h - 0.62) / 0.28)
                   : mix(c3, c4, clamp((h - 0.9) / 0.35, 0.0, 1.0));
          // Spots are cooler: deep red-brown cores
          col = mix(col, vec3(0.16, 0.035, 0.01), umbra * 0.85);
          // The rim glows: hot gas seen edge-on, blending into the chromosphere
          float rim = smoothstep(0.82, 1.0, om);
          col = mix(col, vec3(1.0, 0.38, 0.06), rim * 0.55);
          col += vec3(1.0, 0.3, 0.05) * pow(rim, 3.0) * 0.5;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }

  /** The corona: streamers fixed to the Sun, falling off steeply with distance. */
  public static createCoronaMaterial(sunRadius: number = 14.0): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        sunCenter: SUN_WORLD,
        sunRadius: { value: sunRadius },
        time: { value: 0.0 },
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorldPosition;
        varying vec3 vPole;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          // The Sun's rotation axis (the corona mesh rides in its body frame, +Y = north)
          vPole = normalize(mat3(modelMatrix) * vec3(0.0, 1.0, 0.0));
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 sunCenter;
        uniform float sunRadius;
        uniform float time;
        varying vec3 vWorldPosition;
        varying vec3 vPole;
        ${NOISE}

        void main() {
          vec3 ray = normalize(vWorldPosition - cameraPosition);
          vec3 toSun = sunCenter - cameraPosition;
          float tc = dot(toSun, ray);
          if (tc <= 0.0) discard;
          vec3 closest = cameraPosition + ray * tc;
          vec3 off = closest - sunCenter;
          float r = length(off) / sunRadius;
          if (r < 0.995) discard; // behind the disk

          vec3 dir = off / max(1e-6, length(off));
          vec3 pole = normalize(vPole);
          float latc = abs(dot(dir, pole));
          float equator = 1.0 - smoothstep(0.25, 0.85, latc);
          float h = max(r - 1.0, 0.0);

          // Spicules and flames: a ragged fringe of burning gas right at the limb, each tongue its
          // own height, flickering
          float tongue = fbm(dir * 34.0 + vec3(0.0, time * 0.06, 0.0)) * 0.5 + 0.5;
          float tongue2 = vnoise(dir * 120.0 + vec3(time * 0.15, 0.0, 0.0)) * 0.5 + 0.5;
          float reach = 0.006 + 0.05 * pow(tongue, 3.0) + 0.018 * tongue2;
          float flame = (1.0 - smoothstep(0.0, reach, h)) * (0.65 + 0.35 * tongue2);

          // Coronal streamers: fixed to the Sun, strongest over the equator, polar plumes thinner
          float az = atan(dir.z, dir.x);
          float streak = fbm(vec3(cos(az) * 3.0, sin(az) * 3.0, latc * 2.0) + vec3(0.0, time * 0.01, 0.0));
          float fine = vnoise(vec3(cos(az) * 26.0, sin(az) * 26.0, latc * 9.0 + time * 0.02));
          float rays = clamp(0.3 + streak * 1.9 + fine * 0.5, 0.0, 2.8) * mix(0.45, 1.35, equator);

          // A hot golden glow hugging the disk, the K-corona falling as r^-3, and long streamers
          float glow = exp(-h * 7.0);
          float halo = exp(-h * 1.6);
          float body = pow(max(r, 1.0), -3.0) * mix(1.0, rays, smoothstep(0.03, 0.4, h));
          vec3 col = vec3(1.0, 0.42, 0.08) * flame * 1.1
                   + vec3(1.0, 0.62, 0.22) * glow * 0.55
                   + vec3(1.0, 0.78, 0.5) * halo * 0.12
                   + mix(vec3(1.0, 0.9, 0.75), vec3(0.9, 0.92, 1.0), smoothstep(0.2, 2.0, h)) * body * 0.3;
          col *= 1.0 - smoothstep(4.0, 7.5, r);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }

  /** Material for one magnetic loop: hot plasma draining along the field, with a lifecycle. */
  public static createLoopMaterial(): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        uAge: { value: 0 }, // 0..1 through the loop's life
        uFlash: { value: 0 },
        uSeed: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          vUv = uv;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vN = normalize(mat3(modelMatrix) * normal);
          vV = normalize(cameraPosition - wp.xyz);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float time;
        uniform float uAge;
        uniform float uFlash;
        uniform float uSeed;
        varying vec2 vUv;
        varying vec3 vN;
        varying vec3 vV;
        float h1(float n) { return fract(sin(n) * 43758.5453); }
        float n2(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = h1(dot(i, vec2(1.0, 57.0)));
          float b = h1(dot(i + vec2(1.0, 0.0), vec2(1.0, 57.0)));
          float c = h1(dot(i + vec2(0.0, 1.0), vec2(1.0, 57.0)));
          float d = h1(dot(i + vec2(1.0, 1.0), vec2(1.0, 57.0)));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        void main() {
          float u = vUv.x; // along the loop
          // A thick, soft tube of plasma: brightest through its middle, ragged at the edges
          float facing = abs(dot(normalize(vN), normalize(vV)));
          float core = pow(facing, 0.7);
          // Turbulent knots and threads streaming down both legs
          float flow = n2(vec2(abs(u - 0.5) * 11.0 - time * 0.9 + uSeed * 40.0, vUv.y * 2.0 + uSeed * 7.0));
          float knots = n2(vec2(u * 26.0 + uSeed * 13.0 - time * 0.5, vUv.y * 3.0));
          float threads = n2(vec2(u * 60.0 + uSeed * 5.0, vUv.y * 9.0 + time * 0.3));
          float plasma = smoothstep(0.25, 0.95, flow * 0.5 + knots * 0.35 + threads * 0.25) * smoothstep(0.05, 0.6, core);
          float life = smoothstep(0.0, 0.15, uAge) * (1.0 - smoothstep(0.7, 1.0, uAge));
          // Feet fade into the surface
          float feet = smoothstep(0.0, 0.08, u) * smoothstep(1.0, 0.92, u);
          vec3 cool = vec3(1.0, 0.22, 0.05);
          vec3 hot = vec3(1.0, 0.72, 0.3);
          vec3 col = mix(cool, hot, clamp(plasma * 0.7 + uFlash * 0.8, 0.0, 1.0));
          float a = plasma * life * feet;
          gl_FragColor = vec4(col * a * (0.8 + uFlash * 3.5), 1.0);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    });
  }

  /** The Sun's magnetic activity (see SolarActivity). Returned group is animated by update(). */
  public static createProminencesGroup(visualRadius: number): THREE.Group {
    const activity = new SolarActivity(visualRadius);
    return activity.group;
  }
}

interface Loop {
  mesh: THREE.Mesh;
  mat: THREE.ShaderMaterial;
  born: number;
  life: number;
  erupts: boolean;
  flashAt: number;
}

/**
 * Magnetic loops above active regions. Each one rises, glows and drains over tens of seconds, then
 * fades; a new one appears somewhere else in the activity belts. About one in five erupts: it
 * flashes (a flare) and its arch is flung outward and dissolves, like a coronal mass ejection.
 * Lifetimes are sped up from hours to seconds so the activity can be watched.
 */
export class SolarActivity {
  public group = new THREE.Group();
  private loops: Loop[] = [];
  private radius: number;
  private seed = 1;

  constructor(radius: number) {
    this.radius = radius;
    this.group.name = 'solar_prominences';
    for (let i = 0; i < 14; i++) this.loops.push(this.makeLoop(-Math.random() * 30));
    this.group.userData.activity = this;
  }

  private rnd(): number {
    this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
    return this.seed / 4294967296;
  }

  private makeLoop(born: number): Loop {
    const mat = SolarShader.createLoopMaterial();
    mat.uniforms.uSeed.value = Math.random();
    const mesh = new THREE.Mesh(new THREE.BufferGeometry(), mat);
    mesh.frustumCulled = false;
    const loop: Loop = { mesh, mat, born, life: 22 + Math.random() * 26, erupts: Math.random() < 0.22, flashAt: 0.35 + Math.random() * 0.2 };
    this.place(loop);
    this.group.add(mesh);
    // Keep its uniforms in step with the scene clock (SolarSystemScene sets uniforms.time)
    mesh.onBeforeRender = () => this.animate(loop, mat.uniforms.time.value as number);
    return loop;
  }

  /** New footpoints in an activity belt and a fresh arch. */
  private place(loop: Loop): void {
    const R = this.radius;
    const lat = (8 + this.rnd() * 26) * (this.rnd() < 0.5 ? -1 : 1) * (Math.PI / 180);
    const lon = this.rnd() * Math.PI * 2;
    const c = new THREE.Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon));
    // Footpoint separation and height (×R): a few percent of the radius, like real loops
    // A few great prominences (a fifth of the radius high) among smaller loops
    const great = this.rnd() < 0.3;
    const span = great ? 0.12 + this.rnd() * 0.12 : 0.04 + this.rnd() * 0.07;
    const height = span * (great ? 1.1 + this.rnd() * 0.9 : 0.7 + this.rnd() * 0.9);
    const east = new THREE.Vector3(0, 1, 0).cross(c).normalize();
    const north = c.clone().cross(east).normalize();
    const tilt = this.rnd() * Math.PI;
    const axis = east.clone().multiplyScalar(Math.cos(tilt)).addScaledVector(north, Math.sin(tilt));
    // Built around its base point on the surface, so scaling grows it out of the photosphere
    const base = c.clone().multiplyScalar(R);
    const a = c.clone().addScaledVector(axis, -span / 2).normalize().multiplyScalar(R).sub(base);
    const b = c.clone().addScaledVector(axis, span / 2).normalize().multiplyScalar(R).sub(base);
    const top = c.clone().multiplyScalar(R * height * 1.6);
    const curve = new THREE.QuadraticBezierCurve3(a, top, b);
    loop.mesh.geometry.dispose();
    loop.mesh.geometry = new THREE.TubeGeometry(curve, 64, R * span * (0.07 + this.rnd() * 0.06), 12, false);
    loop.mesh.userData.center = c;
    loop.mesh.userData.base = base;
    loop.mesh.position.copy(base);
  }

  private animate(loop: Loop, now: number): void {
    let age = (now - loop.born) / loop.life;
    if (age >= 1 || age < -0.01) {
      loop.born = now;
      loop.life = 22 + this.rnd() * 26;
      loop.erupts = this.rnd() < 0.22;
      loop.flashAt = 0.35 + this.rnd() * 0.2;
      loop.mesh.scale.setScalar(1);
      this.place(loop);
      age = 0;
    }
    loop.mat.uniforms.uAge.value = age;
    // Rising out of the surface over the first part of its life
    const rise = THREE.MathUtils.smoothstep(age, 0, 0.25);
    let s = 0.55 + 0.45 * rise;
    let flash = 0;
    if (loop.erupts && age > loop.flashAt) {
      const e = (age - loop.flashAt) / (1 - loop.flashAt);
      flash = Math.exp(-e * 10) * 1.5;
      // The arch is flung out radially, swells and thins away as it goes
      s *= 1 + e * e * 1.8;
      const c = loop.mesh.userData.center as THREE.Vector3;
      loop.mesh.position.copy(loop.mesh.userData.base as THREE.Vector3).addScaledVector(c, this.radius * e * e * 0.45);
      loop.mat.uniforms.uAge.value = Math.max(age, loop.flashAt + (1 - loop.flashAt) * Math.min(1, e * 1.6));
    }
    loop.mesh.scale.setScalar(s);
    loop.mat.uniforms.uFlash.value = flash;
  }
}
