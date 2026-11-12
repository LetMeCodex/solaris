import * as THREE from 'three';
import { perf } from '../rendering/Performance';
import { bodyLatLonToLocal, bodyLocalToLatLon } from '../explorer/TileMath';

/**
 * Trees where the photographs show trees: a real forest to fly low over.
 *
 * Google's 3D tiles are photographs draped over the ground: from a jet a few hundred metres up the
 * woods are flat colour, and nothing stands up to rush past. Every second and a half, while the jet
 * is low, a small camera straight above it renders the real tiles around it twice: once as they
 * look (colour), once as where every pixel is in space. Wherever the photograph is vegetation
 * (green over red and blue, not bright like a road or a roof) on ground that is not steep and has
 * settled (the same height in two captures in a row), a tree stands at that pixel's true position.
 *
 * The trees: conifers in four drooping tiers and broadleaves with a clustered crown, each with
 * soft rounded light (normals bent outward from the trunk, darker low in the crown), swaying in
 * the wind, and following the season where they are (the date and the latitude): a fresh green in
 * spring, autumn colours stand by stand, bare broadleaves and snow on the conifers in winter.
 * The forest thins out towards the edge of the area, so there is no line where it stops.
 * Near the ground (standing, or a few hundred metres up at most) shrubs stand round the eye too,
 * waist to head high: along the edges of green (hedges and borders by a path or a lawn), thick
 * where the green is dark (shrubberies, the undergrowth of a wood), one here and there on a lawn.
 * Stored in Earth's own frame (children of its surface), they stay put as you fly over them.
 */

const HIGH = perf.tier === 'high';
const RES = HIGH ? 512 : 384;
const SPAN_KM = HIGH ? 4.0 : 3.0;
/** One candidate tree per this many pixels each way (~16 m on a strong GPU, ~24 m otherwise). */
const CELL = HIGH ? 2 : 3;
const MAX_TREES = HIGH ? 24000 : 8000;
const METRE = 1 / 6378137; // Earth's surface frame: a unit sphere
/** Shrubs: out to this far from the eye (m), one candidate per this many metres each way. */
const SHRUB_REACH_M = HIGH ? 140 : 100;
const SHRUB_STEP_M = 3.5;
const MAX_SHRUBS = HIGH ? 7000 : 3000;
/** Shrubs only while the eye is at most this high over the ground (km). */
const SHRUB_MAX_AGL_KM = 0.3;

/**
 * Broadleaves in winter: the leaves fall away (the crown shrinks into its middle, `midY` m up, by
 * `drop`), the limbs remain.
 */
const bareInWinter = (midY: number, drop: number): string => /* glsl */ `
vec3 crownMid = vec3(0.0, ${midY.toFixed(2)}, 0.0);
transformed = mix(transformed, crownMid + (transformed - crownMid) * (1.0 - ${drop.toFixed(2)} * uWinter), aCrown);`;

// Where each pixel is, and in alpha 1 + the tile's geometric error (m): how far that tile may lie
// from the true ground. Trees only go on fine tiles: a coarse one can be far off the real ground,
// and trees planted on it were left floating once it was replaced
const posFrag = /* glsl */ `
uniform float uErr;
varying vec3 vW;
void main() { gl_FragColor = vec4(vW, 1.0 + uErr); }`;
/** Trees only on tiles at most this far (m) from the true ground. */
const MAX_TILE_ERROR_M = 15;
const posVert = /* glsl */ `
varying vec3 vW;
void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;

/** Geometry with per-vertex colour and a crown flag (1 foliage, 0 wood). */
interface Part {
  geo: THREE.BufferGeometry;
  colour: THREE.Color;
  crown: number;
  /** Bend the normals out from this point (soft, rounded foliage light); null keeps them. */
  bendFrom: THREE.Vector3 | null;
}

function merge(parts: Part[]): THREE.BufferGeometry {
  const pos: number[] = [];
  const nor: number[] = [];
  const col: number[] = [];
  const crown: number[] = [];
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  const out = new THREE.Vector3();
  let minY = Infinity;
  let maxY = -Infinity;
  for (const part of parts) {
    if (part.crown < 0.5) continue;
    part.geo.computeBoundingBox();
    minY = Math.min(minY, part.geo.boundingBox!.min.y);
    maxY = Math.max(maxY, part.geo.boundingBox!.max.y);
  }
  for (const part of parts) {
    const g = part.geo.index ? part.geo.toNonIndexed() : part.geo;
    g.computeVertexNormals();
    const P = g.getAttribute('position');
    const N = g.getAttribute('normal');
    for (let k = 0; k < P.count; k++) {
      p.fromBufferAttribute(P, k);
      n.fromBufferAttribute(N, k);
      if (part.bendFrom) {
        out.copy(p).sub(part.bendFrom).normalize();
        n.lerp(out, 0.65).normalize();
      }
      // Self-shade: foliage darker deep and low in the crown, lighter at the top
      const lowK = part.crown > 0.5 ? THREE.MathUtils.clamp((p.y - minY) / Math.max(maxY - minY, 1e-3), 0, 1) : 0.5;
      const shade = part.crown > 0.5 ? 0.62 + 0.5 * lowK : 1;
      pos.push(p.x, p.y, p.z);
      nor.push(n.x, n.y, n.z);
      col.push(part.colour.r * shade, part.colour.g * shade, part.colour.b * shade);
      crown.push(part.crown);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setAttribute('aCrown', new THREE.Float32BufferAttribute(crown, 1));
  return geo;
}

/** A spruce or fir: four tiers, each drooping at its rim, narrowing to a spire. */
function conifer(): THREE.BufferGeometry {
  const parts: Part[] = [];
  const green = new THREE.Color(0x203d24);
  const tiers = [
    { y: 2.6, r: 2.9, h: 4.2 },
    { y: 4.9, r: 2.3, h: 3.8 },
    { y: 7.0, r: 1.7, h: 3.4 },
    { y: 8.9, r: 1.05, h: 3.2 },
  ];
  for (const t of tiers) {
    const cone = new THREE.ConeGeometry(t.r, t.h, 12, 2, true);
    // The rim droops a little and is ragged, not a clean circle
    const P = cone.getAttribute('position');
    for (let i = 0; i < P.count; i++) {
      const y = P.getY(i);
      if (y < -t.h * 0.49) {
        const a = Math.atan2(P.getZ(i), P.getX(i));
        const rag = 1 + 0.16 * Math.sin(a * 5 + t.y) + 0.08 * Math.sin(a * 11);
        P.setX(i, P.getX(i) * rag);
        P.setZ(i, P.getZ(i) * rag);
        P.setY(i, y - 0.35 * rag);
      }
    }
    cone.translate(0, t.y + t.h / 2, 0);
    parts.push({ geo: cone, colour: green, crown: 1, bendFrom: new THREE.Vector3(0, t.y + t.h * 0.2, 0) });
  }
  const trunk = new THREE.CylinderGeometry(0.16, 0.34, 4.0, 5).translate(0, 2.0, 0);
  parts.push({ geo: trunk, colour: new THREE.Color(0x3a2a1d), crown: 0, bendFrom: null });
  return merge(parts);
}

/** An oak, beech or lime: a clustered crown of overlapping lobes on a forked trunk. */
function broadleaf(): THREE.BufferGeometry {
  const parts: Part[] = [];
  const green = new THREE.Color(0x35532a);
  const centre = new THREE.Vector3(0, 6.6, 0);
  const lobes: Array<[number, number, number, number]> = [
    [0, 6.8, 0, 2.7],
    [1.7, 6.0, 0.6, 1.9],
    [-1.5, 6.2, -0.8, 2.0],
    [0.4, 8.1, -1.2, 1.7],
    [-0.6, 7.9, 1.3, 1.6],
    [1.2, 5.3, -1.5, 1.4],
  ];
  for (const [x, y, z, r] of lobes) {
    const lobe = new THREE.IcosahedronGeometry(r, 1).scale(1, 0.84, 1).translate(x, y, z);
    parts.push({ geo: lobe, colour: green, crown: 1, bendFrom: centre });
  }
  const bark = new THREE.Color(0x45321f);
  parts.push({ geo: new THREE.CylinderGeometry(0.22, 0.42, 4.6, 6).translate(0, 2.3, 0), colour: bark, crown: 0, bendFrom: null });
  // Two main limbs: what is left to see when the leaves are gone
  const limb = (ax: number, az: number, len: number): THREE.BufferGeometry => {
    const g = new THREE.CylinderGeometry(0.08, 0.17, len, 4).translate(0, len / 2, 0);
    g.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(ax, 0, az)));
    return g.translate(0, 4.2, 0);
  };
  parts.push({ geo: limb(0.25, 0.55, 3.6), colour: bark, crown: 0, bendFrom: null });
  parts.push({ geo: limb(-0.35, -0.5, 3.4), colour: bark, crown: 0, bendFrom: null });
  parts.push({ geo: limb(0.6, -0.1, 3.0), colour: bark, crown: 0, bendFrom: null });
  return merge(parts);
}

/** A shrub: a low mound of overlapping leafy lobes, about 1.1 m high and 1.7 m across. */
function shrub(): THREE.BufferGeometry {
  const parts: Part[] = [];
  const green = new THREE.Color(0x3b5a2b);
  const centre = new THREE.Vector3(0, 0.3, 0);
  const lobes: Array<[number, number, number, number]> = [
    [0, 0.55, 0, 0.6],
    [0.52, 0.4, 0.18, 0.44],
    [-0.46, 0.42, -0.24, 0.47],
    [0.14, 0.8, -0.28, 0.36],
    [-0.22, 0.36, 0.46, 0.4],
    [0.3, 0.3, -0.5, 0.34],
  ];
  for (const [x, y, z, r] of lobes) {
    const lobe = new THREE.IcosahedronGeometry(r, 1).scale(1, 0.82, 1).translate(x, y, z);
    // A ragged surface, not smooth balls: each vertex in or out a little
    const P = lobe.getAttribute('position');
    for (let i = 0; i < P.count; i++) {
      const k = 1 + 0.13 * Math.sin(P.getX(i) * 23 + P.getZ(i) * 17) * Math.sin(P.getY(i) * 19 + x * 7);
      P.setXYZ(i, x + (P.getX(i) - x) * k, y + (P.getY(i) - y) * k, z + (P.getZ(i) - z) * k);
    }
    parts.push({ geo: lobe, colour: green, crown: 1, bendFrom: centre });
  }
  return merge(parts);
}

function hash(a: number, b: number): number {
  let h = (a * 374761393 + b * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** The season at a place: 0..1 weights for spring, autumn, winter (summer is all zero). */
export function seasonAt(dayOfYear: number, latDeg: number): { spring: number; autumn: number; winter: number } {
  // Mirror the date in the southern hemisphere
  const d = latDeg >= 0 ? dayOfYear : (dayOfYear + 182.6) % 365.25;
  const absLat = Math.abs(latDeg);
  // Seasons are weak in the tropics and strongest in the mid and high latitudes
  const k = THREE.MathUtils.smoothstep(absLat, 22, 38);
  const bump = (centre: number, width: number): number => {
    let x = Math.abs(d - centre);
    x = Math.min(x, 365.25 - x);
    return Math.exp(-(x / width) * (x / width));
  };
  return {
    spring: bump(120, 28) * k,
    autumn: bump(290, 24) * k,
    winter: Math.max(bump(20, 42), bump(380, 42)) * k,
  };
}

export class GroundCover {
  public readonly group = new THREE.Group();
  private kinds: THREE.InstancedMesh[];
  private colourTarget = new THREE.WebGLRenderTarget(RES, RES, { type: THREE.UnsignedByteType, colorSpace: THREE.SRGBColorSpace });
  private posTarget = new THREE.WebGLRenderTarget(RES, RES, { type: THREE.FloatType });
  private colourBuf = new Uint8Array(RES * RES * 4);
  private posBuf = new Float32Array(RES * RES * 4);
  private cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.001, 10);
  private posMat = new THREE.ShaderMaterial({ uniforms: { uErr: { value: 0 } }, vertexShader: posVert, fragmentShader: posFrag });
  private last = -1e9;
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private v = new THREE.Vector3();
  private s = new THREE.Vector3();
  private inv = new THREE.Matrix4();
  private yAxis = new THREE.Vector3(0, 1, 0);
  private t = new THREE.Vector3();
  /** Ground height (m from Earth's centre) per 40 m cell at the last capture. */
  private heights = new Map<string, number>();
  /** Shared by both kinds of tree: wind time, season, the fade-out distance. */
  private readonly u = {
    uWindT: { value: 0 },
    uSpring: { value: 0 },
    uAutumn: { value: 0 },
    uWinter: { value: 0 },
    uFadeFar: { value: 1 },
    uSnowLine: { value: 1 },
    uTreeSky: { value: new THREE.Color(0.25, 0.3, 0.4) },
  };

  // The forest seen from the Sun: its depth, for the trees' shadows on the ground (the tiles read
  // it, see PhotorealEarth.setTreeShadow). Re-rendered every few frames; between renders it stays
  // right, being kept in Earth's frame (the floating origin only moves the world, not the forest)
  private shadowTarget: THREE.WebGLRenderTarget;
  private shadowCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.001, 10);
  private shadowDepthMat = new THREE.MeshBasicMaterial({ colorWrite: false });
  /** Earth's surface frame -> the shadow map's clip space, at the last shadow render. */
  private shadowFromLocal = new THREE.Matrix4();
  private shadowFrame = 0;
  private hasShadow = false;
  /** World -> shadow map texture space (and depth), for this frame's draw. */
  public readonly shadowMatrix = new THREE.Matrix4();

  constructor() {
    const size = HIGH ? 2048 : 1024;
    this.shadowTarget = new THREE.WebGLRenderTarget(size, size, { depthBuffer: true });
    this.shadowTarget.depthTexture = new THREE.DepthTexture(size, size, THREE.UnsignedIntType);
    this.kinds = [conifer(), broadleaf(), shrub()].map((g, kind) => {
      const max = kind === 2 ? MAX_SHRUBS : MAX_TREES;
      const im = new THREE.InstancedMesh(g, this.material(kind === 0 ? null : kind === 1 ? 'tree' : 'shrub'), max);
      im.count = 0;
      im.frustumCulled = false;
      im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3);
      this.group.add(im);
      return im;
    });
    this.group.name = 'ground_cover';
  }

  /** `broadleaf`: null for a conifer, else a broadleaf tree or a shrub (they lose their leaves). */
  private material(broadleaf: 'tree' | 'shrub' | null): THREE.MeshStandardMaterial {
    const deciduous = broadleaf !== null;
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0 });
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.u);
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
attribute float aCrown;
uniform float uWindT;
uniform float uFadeFar;
uniform float uWinter;
uniform float uSnowLine;
varying float vCrown;
varying float vTreeSeed;
varying float vUpN;
varying float vSnowy;`,
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
vCrown = aCrown;
// Each tree its own phase and stand colour, from where it stands
vec3 treeAt = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
// (brought into 0..1 first: sin() of a huge argument loses its precision on many GPUs)
vec3 seedP = fract(treeAt * vec3(1.0e5, 1.3e5, 0.7e5));
vTreeSeed = fract(sin(dot(seedP, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
// Wind: a slow sway growing with height, with a quicker flutter in the crown
float hgt = max(position.y, 0.0);
float sway = sin(uWindT * 1.1 + vTreeSeed * 40.0) * 0.010 + sin(uWindT * 2.7 + vTreeSeed * 17.0) * 0.004 * aCrown;
transformed.x += sway * hgt * hgt;
transformed.z += sway * 0.6 * hgt * hgt;
vUpN = normal.y;
// Snow on the trees above the winter snow line: the tree's height from its place on the surface
// frame (a unit sphere at the ellipsoid)
vSnowy = smoothstep(uSnowLine - 0.25, uSnowLine + 0.25, (length(treeAt) - 1.0) * 6378.137);
// Thinner towards the edge of the planted area: trees shrink away instead of stopping in a line
vec4 treeW = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
float edge = 1.0 - smoothstep(uFadeFar * 0.72, uFadeFar, length(treeW.xyz - cameraPosition));
transformed *= edge;
${broadleaf === 'tree' ? bareInWinter(6.6, 0.94) : broadleaf === 'shrub' ? bareInWinter(0.4, 0.6) : ''}`,
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
uniform float uSpring;
uniform float uAutumn;
uniform float uWinter;
uniform vec3 uTreeSky;
varying float vCrown;
varying float vTreeSeed;
varying float vUpN;
varying float vSnowy;`,
        )
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
if (vCrown > 0.5) {
  float lumC = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
  // Spring: a fresh, lighter green
  diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.95, 1.28, 0.78), uSpring * 0.7);
  ${
    deciduous
      ? `// Autumn: stand by stand, yellow, orange, red, some still green
  vec3 fall = vTreeSeed < 0.33 ? vec3(0.95, 0.62, 0.12) : vTreeSeed < 0.66 ? vec3(0.85, 0.34, 0.08) : vTreeSeed < 0.85 ? vec3(0.62, 0.16, 0.06) : diffuseColor.rgb / max(lumC, 1e-3) * 0.3;
  diffuseColor.rgb = mix(diffuseColor.rgb, fall * (0.55 + 1.1 * lumC), uAutumn * smoothstep(0.08, 0.3, fract(vTreeSeed * 7.3)));
  // The last leaves in winter: brown
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.32, 0.22, 0.14) * (0.5 + lumC), uWinter);`
      : `// Snow on the upper side of the branches in winter
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.86, 0.9, 0.95), uWinter * vSnowy * smoothstep(0.15, 0.7, vUpN) * 0.85);`
  }
}`,
        );
    };
    // (and after the lights) the sky's own light: the scene has only the Sun and a faint ambient,
    // so a tree with the Sun behind it was a black cut-out; in the open the whole sky lights its
    // shaded side a dark green-grey, more on the upper side
    const prev = mat.onBeforeCompile;
    mat.onBeforeCompile = (shader, r) => {
      prev.call(mat, shader, r);
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <lights_fragment_end>',
        `#include <lights_fragment_end>
  reflectedLight.indirectDiffuse += diffuseColor.rgb * uTreeSky * (0.55 + 0.45 * vUpN);`,
      );
    };
    mat.customProgramCacheKey = () => (broadleaf === 'shrub' ? 'solaris-shrub-sky' : deciduous ? 'solaris-tree-broadleaf-sky' : 'solaris-tree-conifer-sky');
    return mat;
  }

  /** The depth of the forest from the Sun, once there is one to read. */
  public get shadowTexture(): THREE.Texture | null {
    return this.hasShadow ? this.shadowTarget.depthTexture : null;
  }

  /**
   * The trees from the Sun (inside the floating-origin draw): re-rendered every few frames, and
   * `shadowMatrix` brought up to date for this frame. `sunDir`: unit, world; `surface`: Earth's
   * surface mesh; `unitsPerKm` at the jet. Off with the Sun down or no trees.
   */
  public renderShadow(renderer: THREE.WebGLRenderer, surface: THREE.Object3D, sunDir: THREE.Vector3, up: THREE.Vector3, unitsPerKm: number, sunUp: number): void {
    const trees = this.kinds[0].count + this.kinds[1].count + this.kinds[2].count;
    if (sunUp < 0.02 || trees === 0 || !this.group.visible) {
      this.hasShadow = false;
      return;
    }
    surface.updateWorldMatrix(true, false);
    if (this.shadowFrame++ % 6 === 0 || !this.hasShadow) {
      // Over the planted area round the eye (the eye is at the origin in the draw), from the Sun.
      // Low Suns throw long shadows: the box is made deep enough for them
      const half = (SPAN_KM / 2) * unitsPerKm;
      const cam = this.shadowCam;
      const back = 3 * unitsPerKm;
      cam.left = -half;
      cam.right = half;
      cam.top = half;
      cam.bottom = -half;
      cam.position.copy(sunDir).multiplyScalar(back);
      cam.up.copy(up);
      if (Math.abs(up.dot(sunDir)) > 0.999) cam.up.set(up.y, up.z, up.x);
      cam.lookAt(0, 0, 0);
      cam.near = 0.5 * unitsPerKm;
      cam.far = back + 1.5 * unitsPerKm;
      cam.updateProjectionMatrix();
      cam.updateMatrixWorld(true);
      const saved = this.kinds.map((im) => im.material);
      const target = renderer.getRenderTarget();
      const autoClear = renderer.autoClear;
      try {
        for (const im of this.kinds) im.material = this.shadowDepthMat;
        renderer.autoClear = true;
        renderer.setRenderTarget(this.shadowTarget);
        renderer.clear(true, true, false);
        renderer.render(this.group, cam);
      } finally {
        this.kinds.forEach((im, k) => (im.material = saved[k]));
        renderer.setRenderTarget(target);
        renderer.autoClear = autoClear;
      }
      // Kept in Earth's frame: clip = P * V * (world from local)
      this.shadowFromLocal.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse).multiply(surface.matrixWorld);
      this.hasShadow = true;
    }
    // This frame: world -> local -> shadow clip -> texture space (0..1)
    this.inv.copy(surface.matrixWorld).invert();
    this.shadowMatrix.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1).multiply(this.shadowFromLocal).multiply(this.inv);
  }

  /** Under Earth's surface mesh, so the trees ride with the planet. */
  public attach(surface: THREE.Object3D): void {
    if (this.group.parent !== surface) surface.add(this.group);
  }

  /** The sky's light on the trees for the Sun's height there (sine): blue by day, warm low, dark by night. */
  public setSky(sunUp: number): void {
    const day = THREE.MathUtils.smoothstep(sunUp, -0.12, 0.05);
    const high = THREE.MathUtils.smoothstep(sunUp, 0.02, 0.3);
    this.u.uTreeSky.value.setRGB(0.5 + (0.36 - 0.5) * high, 0.42 + (0.46 - 0.42) * high, 0.4 + (0.62 - 0.4) * high).multiplyScalar(0.06 + 0.64 * day);
  }

  public setVisible(on: boolean): void {
    this.group.visible = on;
  }

  /** The season and the wind where the jet is (each frame): day of year, latitude, time in s. */
  public setSeason(dayOfYear: number, latDeg: number, timeSec: number): void {
    const s = seasonAt(dayOfYear, latDeg);
    this.u.uSpring.value = s.spring;
    this.u.uAutumn.value = s.autumn;
    this.u.uWinter.value = s.winter;
    // Where the trees hold snow in winter: ~1.6 km up at 40 degrees, down to the ground by 62
    this.u.uSnowLine.value = THREE.MathUtils.lerp(1.6, -0.5, THREE.MathUtils.smoothstep(Math.abs(latDeg), 40, 62));
    this.u.uWindT.value = timeSec;
  }

  /**
   * Capture and plant (inside the floating-origin draw: the eye is at the origin). `up`: away from
   * Earth's centre at the jet; `unitsPerKm` at the jet; `surface`: Earth's surface mesh; `tiles`:
   * the 3D tiles group.
   */
  /** Each frame: the planted area's reach at the eye (the forest thins out towards its edge). */
  public setArea(unitsPerKm: number): void {
    this.u.uFadeFar.value = (SPAN_KM / 2) * 0.98 * unitsPerKm;
  }

  /** Whether a capture would run now (every 1.5 s, one readback at a time). */
  public get captureDue(): boolean {
    return performance.now() - this.last >= 1500 && !this.reading;
  }

  public capture(renderer: THREE.WebGLRenderer, tiles: THREE.Object3D, surface: THREE.Object3D, up: THREE.Vector3, unitsPerKm: number, aglKm: number, tileErrors?: Map<THREE.Object3D, number>): void {
    this.setArea(unitsPerKm);
    if (!this.captureDue) return;
    this.last = performance.now();
    this.captureAgl = aglKm;
    // The floating origin has just moved the scene: bring the tiles' world matrices up to date
    // (in the chase view nothing has drawn the scene yet this frame)
    tiles.updateWorldMatrix(true, true);
    const half = (SPAN_KM / 2) * unitsPerKm;
    const cam = this.cam;
    cam.left = -half;
    cam.right = half;
    cam.top = half;
    cam.bottom = -half;
    const above = (aglKm + 2.5) * unitsPerKm;
    cam.position.copy(up).multiplyScalar(above);
    cam.up.set(up.y, up.z, up.x);
    cam.lookAt(0, 0, 0);
    cam.near = 0.2 * unitsPerKm;
    cam.far = above + 4 * unitsPerKm;
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld(true);
    const target = renderer.getRenderTarget();
    const autoClear = renderer.autoClear;
    const clear = renderer.getClearColor(new THREE.Color());
    const clearA = renderer.getClearAlpha();
    try {
      renderer.autoClear = true;
      renderer.setClearColor(0x000000, 0);
      renderer.setRenderTarget(this.colourTarget);
      renderer.render(tiles, cam);
      // Read back later, without waiting for the GPU (see below)
      // Positions: every tile drawn with a material that writes where it is
      const saved: Array<[THREE.Mesh, THREE.Material | THREE.Material[], THREE.Mesh['onBeforeRender']]> = [];
      const posMat = this.posMat;
      tiles.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        // The tile's geometric error, from the nearest tile scene above this mesh (unknown: coarse)
        let err = 1e4;
        if (tileErrors) {
          for (let p: THREE.Object3D | null = mesh; p; p = p.parent) {
            const e = tileErrors.get(p);
            if (e !== undefined) {
              err = e;
              break;
            }
          }
        } else {
          err = 0;
        }
        saved.push([mesh, mesh.material, mesh.onBeforeRender]);
        mesh.material = posMat;
        mesh.onBeforeRender = () => {
          posMat.uniforms.uErr.value = err;
          posMat.uniformsNeedUpdate = true;
        };
      });
      renderer.setRenderTarget(this.posTarget);
      renderer.render(tiles, cam);
      for (const [mesh, mat, before] of saved) {
        mesh.material = mat;
        mesh.onBeforeRender = before;
      }
    } finally {
      renderer.setRenderTarget(target);
      renderer.setClearColor(clear, clearA);
      renderer.autoClear = autoClear;
    }
    // The positions are in this frame's (floating-origin) world: Earth's frame as of now goes
    // with them
    surface.updateWorldMatrix(true, false);
    this.captureInv.copy(surface.matrixWorld).invert();
    this.captureVP.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse).multiply(surface.matrixWorld);
    // Read back asynchronously (a fence, then a copy when the GPU is done): reading straight away
    // made the page wait for the GPU, a 10-40 ms hitch every 1.5 s
    this.reading = true;
    Promise.all([
      renderer.readRenderTargetPixelsAsync(this.colourTarget, 0, 0, RES, RES, this.colourBuf),
      renderer.readRenderTargetPixelsAsync(this.posTarget, 0, 0, RES, RES, this.posBuf),
    ])
      .then(() => this.plant())
      .catch(() => undefined)
      .finally(() => {
        this.reading = false;
      });
  }

  /** A readback in flight (no new capture until it has landed). */
  private reading = false;
  /** Earth's frame at the moment of the capture being read back. */
  private captureInv = new THREE.Matrix4();
  /** Earth's surface frame -> the capture's clip space, at that moment. */
  private captureVP = new THREE.Matrix4();
  /** The eye's height over the ground (km) at that capture. */
  private captureAgl = 1;
  /** Ground height (m from Earth's centre) per shrub spot at the last capture. */
  private shrubHeights = new Map<string, number>();
  private shrubUp = new THREE.Vector3();

  private plant(): void {
    const C = this.colourBuf;
    const P = this.posBuf;
    const counts = [0, 0, 0];
    const heights = new Map<string, number>();
    const cell = CELL;
    const step = 2; // neighbour offset (pixels) for the slope and 3D tests
    const tint = new THREE.Color();
    const metresPerPx = (SPAN_KM * 1000) / RES;
    const cellM = Math.max(16, metresPerPx * cell);
    for (let y = 0; y < RES; y += cell) {
      for (let x = 0; x < RES; x += cell) {
        // A stable pick inside the cell (by where it is on Earth, so it does not jump between captures)
        const i0 = (y * RES + x) * 4;
        if (P[i0 + 3] < 0.5) continue;
        this.v.set(P[i0], P[i0 + 1], P[i0 + 2]).applyMatrix4(this.captureInv);
        const kx = Math.floor(this.v.x / (cellM * METRE));
        const kz = Math.floor(this.v.z / (cellM * METRE));
        const jx = Math.min(RES - 1, x + Math.floor(hash(kx, kz) * cell));
        const jy = Math.min(RES - 1, y + Math.floor(hash(kz, kx + 7) * cell));
        const i = (jy * RES + jx) * 4;
        if (P[i + 3] < 0.5) continue;
        // Only on fine tiles (see posFrag)
        if (P[i + 3] - 1 > MAX_TILE_ERROR_M) continue;
        const r = C[i] / 255;
        const g = C[i + 1] / 255;
        const b = C[i + 2] / 255;
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        // Vegetation: green over red and blue, not bright (roads, roofs, sand), not near black (water, shade)
        const green = g - Math.max(r, b);
        if (green < 0.012 || lum > 0.42 || lum < 0.04) continue;
        // Steep ground (cliffs, walls): the neighbours' heights differ too much
        const iR = (jy * RES + Math.min(RES - 1, jx + step)) * 4;
        const iU = (Math.min(RES - 1, jy + step) * RES + jx) * 4;
        this.s.set(P[i], P[i + 1], P[i + 2]);
        const dR = this.s.distanceTo(this.v.set(P[iR], P[iR + 1], P[iR + 2]));
        const dU = this.s.distanceTo(this.v.set(P[iU], P[iU + 1], P[iU + 2]));
        const local = this.v.set(P[i], P[i + 1], P[i + 2]).applyMatrix4(this.captureInv);
        const radial = local.length();
        if (!(radial > 0)) continue;
        // Already 3D there (Google's own trees or a building stand above the ground around): skip
        let ground = radial;
        for (let oy = -4; oy <= 4; oy += 2) {
          for (let ox = -4; ox <= 4; ox += 2) {
            const qx = Math.min(RES - 1, Math.max(0, jx + ox));
            const qy = Math.min(RES - 1, Math.max(0, jy + oy));
            const k = (qy * RES + qx) * 4;
            if (P[k + 3] < 0.5) continue;
            ground = Math.min(ground, this.t.set(P[k], P[k + 1], P[k + 2]).applyMatrix4(this.captureInv).length());
          }
        }
        if ((radial - ground) / METRE > 3) continue;
        if (Math.abs(dR - dU) / Math.max(dR, dU, 1e-12) > 0.6) continue;
        // Only on ground that has settled: the same height (within 3 m) in the last capture too.
        // While finer tiles stream in, the coarse ones they replace are still drawn (cross-fade),
        // and a coarse tile can lie tens to hundreds of metres off the real ground: trees planted
        // on it were left floating in the air once it faded away
        const key = `${kx},${kz}`;
        const heightM = radial / METRE;
        heights.set(key, heightM);
        const before = this.heights.get(key);
        if (before === undefined || Math.abs(before - heightM) > 3) continue;
        const h = hash(kx * 3 + 1, kz * 5 + 2);
        // Bluer, darker greens are mostly conifer; brighter, yellower ones broadleaf
        const coniferLike = b > r * 1.0 && lum < 0.2;
        const kind = coniferLike ? (h < 0.72 ? 0 : 1) : h < 0.28 ? 0 : 1;
        const im = this.kinds[kind];
        const n = counts[kind];
        if (n >= MAX_TREES) continue;
        const size = (0.75 + hash(kx + 11, kz) * 0.9) * METRE;
        this.q.setFromUnitVectors(this.yAxis, this.s.copy(local).divideScalar(radial));
        const spin = new THREE.Quaternion().setFromAxisAngle(this.yAxis, hash(kx, kz + 3) * Math.PI * 2);
        this.q.multiply(spin);
        // A little into the ground so the trunk never floats on a slope
        local.multiplyScalar(1 - 0.6 * METRE);
        // Slightly irregular: not every tree perfectly round or upright
        this.s.set(size * (0.9 + hash(kz, kx) * 0.2), size * (0.85 + hash(kx + 5, kz + 9) * 0.35), size * (0.9 + hash(kz + 2, kx) * 0.2));
        this.m.compose(local, this.q, this.s);
        im.setMatrixAt(n, this.m);
        // The photograph's own green, so the trees match the wood they stand in
        const shade = 0.8 + hash(kz + 5, kx) * 0.4;
        tint.setRGB(shade * (0.82 + r * 0.6), shade * (0.9 + g * 0.45), shade * (0.82 + b * 0.4));
        im.setColorAt(n, tint);
        counts[kind] = n + 1;
      }
    }
    this.heights = heights;
    counts[2] = this.plantShrubs();
    this.kinds.forEach((im, k) => {
      im.count = counts[k];
      im.instanceMatrix.needsUpdate = true;
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
    });
  }

  /**
   * Shrubs round the eye, from the capture just read back (see plant()): on a grid fixed to the
   * ground (latitude and longitude steps of SHRUB_STEP_M, each spot jittered), so they stay put as
   * the eye moves; each spot looks up its pixel in the capture. On vegetation only, not under
   * anything 3D, on ground that is not steep and has settled; most likely along the edges of green
   * and where it is dark, rarely on an open lawn. Smaller towards the edge of the reach.
   */
  private plantShrubs(): number {
    const im = this.kinds[2];
    if (this.captureAgl > SHRUB_MAX_AGL_KM) {
      this.shrubHeights.clear();
      return 0;
    }
    const C = this.colourBuf;
    const P = this.posBuf;
    const mid = ((RES >> 1) * RES + (RES >> 1)) * 4;
    if (P[mid + 3] < 0.5) return 0;
    const eye = new THREE.Vector3(P[mid], P[mid + 1], P[mid + 2]).applyMatrix4(this.captureInv);
    const ll = bodyLocalToLatLon('Earth', eye.x, eye.y, eye.z);
    const stepLat = SHRUB_STEP_M / 111320;
    const stepLon = SHRUB_STEP_M / (111320 * Math.max(Math.cos((ll.lat * Math.PI) / 180), 0.05));
    const i0 = Math.round(ll.lat / stepLat);
    const j0 = Math.round(ll.lon / stepLon);
    const n = Math.ceil(SHRUB_REACH_M / SHRUB_STEP_M);
    const heights = new Map<string, number>();
    const tint = new THREE.Color();
    const ndc = new THREE.Vector3();
    const spot = new THREE.Vector3();
    const up = this.shrubUp;
    const veg = (k: number): boolean => {
      const r = C[k] / 255;
      const g = C[k + 1] / 255;
      const b = C[k + 2] / 255;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return g - Math.max(r, b) > 0.01 && lum < 0.45 && lum > 0.035;
    };
    const near = [
      [2, 0],
      [-2, 0],
      [0, 2],
      [0, -2],
    ];
    let count = 0;
    for (let a = -n; a <= n && count < MAX_SHRUBS; a++) {
      for (let c = -n; c <= n && count < MAX_SHRUBS; c++) {
        const ia = i0 + a;
        const jc = j0 + c;
        const h = hash(ia * 7 + 3, jc * 13 + 5);
        if (h > 0.45) continue; // (above the likeliest case: never a shrub)
        const lat = (ia + (hash(ia, jc + 17) - 0.5) * 0.8) * stepLat;
        const lon = (jc + (hash(jc, ia + 29) - 0.5) * 0.8) * stepLon;
        const [x, y, z] = bodyLatLonToLocal('Earth', lat, lon);
        spot.set(x, y, z);
        const distM = spot.distanceTo(eye) / METRE;
        if (distM > SHRUB_REACH_M) continue;
        ndc.copy(spot).applyMatrix4(this.captureVP);
        const px = Math.floor((ndc.x * 0.5 + 0.5) * RES);
        const py = Math.floor((ndc.y * 0.5 + 0.5) * RES);
        if (px < 3 || py < 3 || px >= RES - 3 || py >= RES - 3) continue;
        const k = (py * RES + px) * 4;
        if (P[k + 3] < 0.5 || P[k + 3] - 1 > MAX_TILE_ERROR_M || !veg(k)) continue;
        const r = C[k] / 255;
        const g = C[k + 1] / 255;
        const b = C[k + 2] / 255;
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        let edge = false;
        for (const [ox, oy] of near) {
          const q = ((py + oy) * RES + px + ox) * 4;
          if (P[q + 3] >= 0.5 && !veg(q)) {
            edge = true;
            break;
          }
        }
        if (h > (lum < 0.15 ? 0.3 : edge ? 0.45 : 0.03)) continue;
        // The ground there: nothing 3D standing above it nearby (Google's own trees, a wall), not steep
        const here = this.t.set(P[k], P[k + 1], P[k + 2]).applyMatrix4(this.captureInv);
        const radial = here.length();
        if (!(radial > 0)) continue;
        let ground = radial;
        let top = radial;
        for (let oy = -2; oy <= 2; oy += 2) {
          for (let ox = -2; ox <= 2; ox += 2) {
            const q = ((py + oy) * RES + px + ox) * 4;
            if (P[q + 3] < 0.5) continue;
            const rq = this.v.set(P[q], P[q + 1], P[q + 2]).applyMatrix4(this.captureInv).length();
            ground = Math.min(ground, rq);
            top = Math.max(top, rq);
          }
        }
        if ((radial - ground) / METRE > 1.5 || (top - ground) / METRE > 6) continue;
        const key = `${ia},${jc}`;
        const heightM = radial / METRE;
        heights.set(key, heightM);
        const before = this.shrubHeights.get(key);
        if (before === undefined || Math.abs(before - heightM) > 2) continue;
        up.copy(spot).normalize();
        spot.copy(up).multiplyScalar(radial - 0.2 * METRE);
        const fade = 1 - THREE.MathUtils.smoothstep(distM, SHRUB_REACH_M * 0.7, SHRUB_REACH_M);
        // Bigger and denser in the dark green (shrubberies), smaller on a lawn
        const size = (lum < 0.15 ? 0.85 : 0.65) * (0.75 + hash(ia + 3, jc + 1) * 0.7) * fade * METRE;
        if (size < 0.05 * METRE) continue;
        this.q.setFromUnitVectors(this.yAxis, up);
        this.q.multiply(new THREE.Quaternion().setFromAxisAngle(this.yAxis, hash(jc, ia + 3) * Math.PI * 2));
        this.s.set(size * (0.85 + hash(jc, ia) * 0.4), size * (0.75 + hash(ia + 5, jc + 9) * 0.5), size * (0.85 + hash(jc + 2, ia) * 0.4));
        this.m.compose(spot, this.q, this.s);
        im.setMatrixAt(count, this.m);
        const shade = 0.85 + hash(jc + 5, ia) * 0.35;
        tint.setRGB(shade * (0.8 + r * 0.7), shade * (0.92 + g * 0.5), shade * (0.8 + b * 0.4));
        im.setColorAt(count, tint);
        count++;
      }
    }
    this.shrubHeights = heights;
    return count;
  }

  public dispose(): void {
    this.group.removeFromParent();
    this.colourTarget.dispose();
    this.posTarget.dispose();
    this.shadowTarget.depthTexture?.dispose();
    this.shadowTarget.dispose();
    this.shadowDepthMat.dispose();
    this.posMat.dispose();
    for (const im of this.kinds) {
      im.geometry.dispose();
      (im.material as THREE.Material).dispose();
    }
  }
}
