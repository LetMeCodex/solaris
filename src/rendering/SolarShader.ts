import * as THREE from 'three';
import { SUN_WORLD } from './RenderOrigin';

/**
 * The Sun, drawn from solar physics.
 *
 * Photosphere
 * - True colour: a 5,772 K blackbody is white with the faintest warmth; the yellow/orange of most
 *   renderings is atmospheric or artistic. Brightness is HDR so it reads as blinding.
 * - Limb darkening per colour channel (stronger in blue than in red, as measured), so the edge of
 *   the disk turns dimmer and warmer: I(μ)/I₀ = 1 − u(1 − μ) − v(1 − μ²).
 * - Convection: granules (bright upwelling cells, dark cooler lanes) whose centres wander so the
 *   surface boils, on top of larger supergranular mottling.
 * - Active regions: sunspot groups (dark umbra, filamentary penumbra) in the two activity belts
 *   (±5–35° latitude), with bright faculae that show up towards the limb.
 * - A thin pink-red chromosphere rim (H-α) at the very edge.
 *
 * Corona: streamers fixed to the Sun (a 3D pattern, not a screen-space flare) falling off roughly
 * as r⁻³, out to several solar radii.
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

          // Limb darkening per channel (quadratic law; blue darkens most)
          vec3 u1 = vec3(0.36, 0.45, 0.56);
          vec3 u2 = vec3(0.16, 0.16, 0.14);
          vec3 limb = clamp(1.0 - u1 * om - u2 * (1.0 - mu * mu), 0.05, 1.0);

          vec3 p = vLocal;
          float t = time;
          // Supergranulation and mottling (slow)
          float mottle = fbm(p * 7.0 + vec3(0.0, t * 0.004, 0.0)) * 0.6 + fbm(p * 45.0 + t * 0.01) * 0.4;
          // Granules, two scales, boiling. Fade the finest detail when it is smaller than a pixel.
          // Granules are rounded bright cells (hot gas rising) fading into soft dark lanes
          // True size: granules are ~1,000 km, about 1/1,400 of the disk, so they only resolve in
          // close-ups (and fade out where they would be smaller than a pixel)
          vec2 g1 = granules(p * 520.0, t * 0.35);
          vec2 g2 = granules(p * 1400.0, t * 0.55);
          float cell1 = smoothstep(0.0, 0.5, g1.y - g1.x) * (1.0 - smoothstep(0.1, 0.75, g1.x));
          float cell2 = smoothstep(0.0, 0.45, g2.y - g2.x) * (1.0 - smoothstep(0.1, 0.75, g2.x));
          float px1 = length(fwidth(p * 520.0));
          float px2 = length(fwidth(p * 1400.0));
          float mid = 1.0 - smoothstep(0.3, 0.9, px1);
          float fine = 1.0 - smoothstep(0.3, 0.9, px2);
          float gran = (cell1 - 0.45) * 0.16 * mid + (cell2 - 0.45) * 0.08 * fine;

          // Active regions in the activity belts, seeded by the solar map and slow noise
          float lat = asin(clamp(p.y, -1.0, 1.0));
          float belt = smoothstep(0.08, 0.2, abs(lat)) * (1.0 - smoothstep(0.45, 0.62, abs(lat)));
          float tex = dot(texture2D(sunTexture, vUv).rgb, vec3(0.333));
          // A handful of active regions per hemisphere, drifting slowly
          float region = belt * smoothstep(0.1, 0.35, vnoise(p * 4.0 + vec3(3.0, t * 0.002, 1.0)) + tex * 0.2 - 0.1);
          // Sunspots: small dark umbrae with a penumbra inside active regions
          float spotField = vnoise(p * 34.0 + 11.0) + 0.45 * vnoise(p * 90.0);
          float umbra = region * smoothstep(0.42, 0.52, spotField);
          float penumbra = region * smoothstep(0.24, 0.42, spotField) * (1.0 - umbra);
          // Faculae: bright magnetic patches, visible mostly near the limb
          float faculae = region * smoothstep(0.1, 0.5, spotField) * (1.0 - smoothstep(0.48, 0.6, spotField)) * pow(om, 1.5);

          // Colour (written straight to the display): the disk centre is the white-gold of a
          // 5,772 K photosphere seen through a solar filter; limb darkening is stronger in blue,
          // so the edge deepens through gold to orange
          float lum = dot(limb, vec3(0.2126, 0.7152, 0.0722));
          vec3 centre = vec3(1.0, 0.975, 0.9);
          vec3 edge = vec3(1.0, 0.56, 0.2);
          vec3 base = mix(edge, centre, smoothstep(0.25, 1.0, pow(mu, 0.55)));
          float I = 1.0 + mottle * 0.05 + gran + faculae * 0.3;
          I *= 1.0 - penumbra * 0.5 - umbra * 0.85;
          vec3 col = base * I * mix(0.62, 1.0, lum);
          // Spots are cooler and redder
          col *= mix(vec3(1.0), vec3(0.9, 0.55, 0.3), clamp(umbra + penumbra * 0.5, 0.0, 1.0));

          // Chromosphere: a thin pink-red H-alpha rim right at the edge
          float rim = smoothstep(0.86, 1.0, om);
          col += vec3(1.0, 0.32, 0.36) * rim * rim * 0.9;

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
          if (r < 1.0) discard; // behind the disk

          // Direction of this sightline's closest point, in the Sun's own frame: streamers are
          // fixed structures, brightest over the equatorial belt, polar plumes thinner
          vec3 dir = off / max(1e-6, length(off));
          float latc = abs(dot(dir, normalize(vPole)));
          float equator = 1.0 - smoothstep(0.25, 0.85, latc);
          float az = atan(dir.z, dir.x);
          float streak = fbm(vec3(cos(az) * 3.0, sin(az) * 3.0, latc * 2.0) + vec3(0.0, time * 0.01, 0.0));
          float fine = vnoise(vec3(cos(az) * 22.0, sin(az) * 22.0, latc * 9.0 + time * 0.02));
          float rays = clamp(0.25 + streak * 1.8 + fine * 0.45, 0.0, 2.6) * mix(0.4, 1.35, equator);

          // K-corona brightness ~ r^-3, extended with distance for streamers
          float h = r - 1.0;
          float inner = exp(-h * 9.0);
          float body = pow(r, -3.0) * mix(1.0, rays, smoothstep(0.02, 0.4, h));
          // The corona is a million times fainter than the disk: a soft pearly halo, not a wall
          float I = inner * 0.35 + body * 0.24;
          // Fade to nothing at the shell
          I *= 1.0 - smoothstep(4.0, 7.5, r);

          vec3 col = mix(vec3(1.0, 0.95, 0.88), vec3(0.92, 0.93, 1.0), smoothstep(0.1, 1.5, h));
          gl_FragColor = vec4(col * I, 1.0);
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
        void main() {
          float u = vUv.x; // along the loop
          // Brighter at the rim of the tube (optically thin plasma seen edge-on)
          float edge = 1.0 - abs(dot(normalize(vN), normalize(vV)));
          float thick = 0.35 + 0.65 * pow(edge, 1.5);
          // Knots of plasma sliding down both legs
          float flow = 0.6 + 0.4 * sin((abs(u - 0.5) * 28.0) - time * 3.0 + uSeed * 6.28);
          float life = smoothstep(0.0, 0.15, uAge) * (1.0 - smoothstep(0.7, 1.0, uAge));
          vec3 halpha = vec3(1.0, 0.36, 0.28);
          vec3 hot = vec3(1.0, 0.9, 0.8);
          vec3 col = mix(halpha, hot, uFlash * 0.8 + (1.0 - abs(u - 0.5) * 2.0) * 0.15);
          float a = thick * flow * life;
          gl_FragColor = vec4(col * a * (0.9 + uFlash * 4.0), 1.0);
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
    for (let i = 0; i < 9; i++) this.loops.push(this.makeLoop(-Math.random() * 30));
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
    const span = 0.035 + this.rnd() * 0.07;
    const height = span * (0.7 + this.rnd() * 0.9);
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
    loop.mesh.geometry = new THREE.TubeGeometry(curve, 48, R * span * (0.018 + this.rnd() * 0.02), 8, false);
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
      // The arch is flung out radially and swells as it goes
      s *= 1 + e * e * 6;
      const c = loop.mesh.userData.center as THREE.Vector3;
      loop.mesh.position.copy(loop.mesh.userData.base as THREE.Vector3).addScaledVector(c, this.radius * e * e * 1.5);
    }
    loop.mesh.scale.setScalar(s);
    loop.mat.uniforms.uFlash.value = flash;
  }
}
