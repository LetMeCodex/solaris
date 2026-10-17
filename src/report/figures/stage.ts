import * as THREE from 'three';

/**
 * Shared pieces for the report's 3D figures: one texture cache, real planet maps (the same 2k maps
 * Solaris itself uses), a Saturn ring cut from its real alpha map, a Sun with a glow, and a small
 * stage that sizes itself to its canvas and only draws while it is on screen.
 */

const base = import.meta.env.BASE_URL;
const loader = new THREE.TextureLoader();
const cache = new Map<string, THREE.Texture>();

export function tex(file: string, srgb = true): THREE.Texture {
  let t = cache.get(file);
  if (!t) {
    t = loader.load(`${base}textures/${file}`);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    cache.set(file, t);
  }
  return t;
}

export const MAPS: Record<string, string> = {
  Mercury: '2k_mercury.jpg',
  Venus: '2k_venus_atmosphere.jpg',
  Earth: '2k_earth_daymap.jpg',
  Moon: '2k_moon.jpg',
  Mars: '2k_mars.jpg',
  Jupiter: '2k_jupiter.jpg',
  Saturn: '2k_saturn.jpg',
  Uranus: '2k_uranus.jpg',
  Neptune: '2k_neptune.jpg',
  Pluto: '2k_pluto.jpg',
};

/** A lit, textured world. Its tilt is applied to a parent so the spin stays about its own pole. */
export function world(name: string, radius: number, tiltDeg = 0): { group: THREE.Group; body: THREE.Mesh } {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 64, 40),
    new THREE.MeshStandardMaterial({ map: tex(MAPS[name] ?? '2k_moon.jpg'), roughness: 1, metalness: 0 })
  );
  body.name = name;
  group.rotation.z = THREE.MathUtils.degToRad(tiltDeg);
  group.add(body);
  if (name === 'Saturn') group.add(saturnRing(radius));
  return { group, body };
}

/** Saturn's rings from the real radial alpha map, inner edge 1.24 R, outer 2.27 R. */
export function saturnRing(r: number): THREE.Mesh {
  const inner = r * 1.24;
  const outer = r * 2.27;
  const g = new THREE.RingGeometry(inner, outer, 128, 1);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
  }
  const ring = new THREE.Mesh(
    g,
    new THREE.MeshBasicMaterial({ map: tex('2k_saturn_ring_alpha.png'), side: THREE.DoubleSide, transparent: true, depthWrite: false, opacity: 0.95 })
  );
  ring.rotation.x = -Math.PI / 2;
  return ring;
}

let glowTexture: THREE.CanvasTexture | null = null;
function glow(): THREE.CanvasTexture {
  if (glowTexture) return glowTexture;
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, 'rgba(255,244,220,1)');
  grd.addColorStop(0.12, 'rgba(255,214,150,0.85)');
  grd.addColorStop(0.32, 'rgba(255,150,70,0.28)');
  grd.addColorStop(0.6, 'rgba(255,110,40,0.07)');
  grd.addColorStop(1, 'rgba(255,90,30,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  glowTexture = new THREE.CanvasTexture(c);
  glowTexture.colorSpace = THREE.SRGBColorSpace;
  return glowTexture;
}

/** The Sun: its real photosphere map, self-lit, inside a soft corona sprite. */
export function sun(radius: number): THREE.Group {
  const g = new THREE.Group();
  const map = tex('2k_sun.jpg');
  g.add(new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 32), new THREE.MeshBasicMaterial({ map, color: new THREE.Color(1.25, 1.1, 0.95) })));
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  halo.scale.setScalar(radius * 7);
  g.add(halo);
  return g;
}

/** A thin rim of atmosphere: brightest at the limb, where the line of sight grazes the air. */
export function atmosphere(radius: number, color: string, power = 3.2): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.035, 64, 40),
    new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(color) }, uPow: { value: power } },
      vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform vec3 uColor; uniform float uPow; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1. - abs(dot(vN, vV)), uPow); gl_FragColor = vec4(uColor * f * 1.6, f); }',
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
}

export interface Stage {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  /** Size in CSS pixels. */
  size: { w: number; h: number };
  dispose: () => void;
}

/**
 * Make a renderer on a canvas and run `frame` every animation frame while the canvas is on screen.
 * The canvas is sized by CSS; the stage follows it.
 */
export function stage(canvas: HTMLCanvasElement, fov: number, frame: (dt: number, s: Stage) => void, ortho?: { width: number }): Stage {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  const scene = new THREE.Scene();
  // an orthographic stage keeps a fixed width in world units, so sizes on it can be read off a ruler
  const camera = ortho ? new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 5000) : new THREE.PerspectiveCamera(fov, 1, 0.01, 5000);
  const s: Stage = { renderer, scene, camera, size: { w: 1, h: 1 }, dispose: () => {} };

  const fit = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    s.size = { w, h };
    renderer.setSize(w, h, false);
    if (camera instanceof THREE.OrthographicCamera && ortho) {
      camera.left = -ortho.width / 2;
      camera.right = ortho.width / 2;
      camera.top = (ortho.width / 2) * (h / w);
      camera.bottom = -camera.top;
    } else if (camera instanceof THREE.PerspectiveCamera) camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  fit();
  const ro = new ResizeObserver(fit);
  ro.observe(canvas);

  let on = false;
  const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; }, { rootMargin: '120px' });
  io.observe(canvas);

  let raf = 0;
  let last = performance.now();
  const loop = () => {
    raf = requestAnimationFrame(loop);
    const t = performance.now();
    const dt = Math.min(0.1, (t - last) / 1000);
    last = t;
    if (!on) return;
    frame(dt, s);
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(loop);

  s.dispose = () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
    renderer.dispose();
  };
  return s;
}
