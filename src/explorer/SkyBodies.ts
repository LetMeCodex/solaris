import * as THREE from 'three';
import { CoordinateFrames } from '../astronomy/CoordinateFrames';
import { apparentMagnitude } from './SkyAstronomy';
import { AtmosphereModel, transmittance } from './SkyAtmosphere';

type Vec3 = [number, number, number];

export interface SkyBodySource {
  name: string;
  radiusKm: number;
  positionKm: Vec3; // heliocentric J2000 ecliptic
  map?: THREE.Texture | null;
  ringMap?: THREE.Texture | null;
  /** World orientation of the body's textured globe (IAU frame + spin). */
  orientation?: THREE.Quaternion;
  colorHex?: string;
}

export interface SkyObjectInfo {
  name: string;
  altDeg: number;
  azDeg: number;
  magnitude: number;
  /** True angular diameter (arcseconds). */
  diameterArcsec: number;
  distanceKm: number;
  /** Shown (above horizon and bright enough, or resolved as a disc). */
  visible: boolean;
  /** Where to pin a label (render space). */
  labelWorld: THREE.Vector3;
}

const bodyVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const bodyFragment = /* glsl */ `
  uniform sampler2D map;
  uniform float uHasMap;
  uniform vec3 uColor;
  uniform vec3 uSunDir;   // from the body towards the Sun
  uniform vec3 uTint;     // atmospheric extinction
  uniform float uAlpha;
  uniform float uEmissive;
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    vec3 base = uHasMap > 0.5 ? texture2D(map, vUv).rgb : uColor;
    vec3 col;
    if (uEmissive > 0.0) {
      // Photosphere far brighter than white so the bloom pass gives it glare
      col = vec3(1.0, 0.95, 0.86) * uEmissive;
    } else {
      float ndl = dot(normalize(vNormalW), uSunDir);
      col = base * (smoothstep(-0.03, 0.25, ndl) * 1.15 + 0.012);
    }
    gl_FragColor = vec4(col * uTint, uAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const ringVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ringFragment = /* glsl */ `
  uniform sampler2D ringMap;
  uniform vec3 uSunDir;
  uniform vec3 uTint;
  uniform float uAlpha;
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    vec4 c = texture2D(ringMap, vUv);
    if (c.a < 0.02) discard;
    float lit = max(0.08, abs(dot(normalize(vNormalW), uSunDir)));
    gl_FragColor = vec4(c.rgb * lit * 1.6 * uTint, c.a * 0.95 * uAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const pointVertex = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    gl_PointSize = aSize;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const pointFragment = /* glsl */ `
  varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c) * 2.0;
    float a = exp(-r * r * 3.5);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor * a, 1.0);
  }
`;

function makeGlowTexture(): THREE.Texture {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, 'rgba(255,250,235,1)');
  grd.addColorStop(0.08, 'rgba(255,240,210,0.55)');
  grd.addColorStop(0.3, 'rgba(255,220,170,0.12)');
  grd.addColorStop(1, 'rgba(255,200,150,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

interface Entry {
  mesh: THREE.Mesh;
  mat: THREE.ShaderMaterial;
  ring?: THREE.Mesh;
  ringMat?: THREE.ShaderMaterial;
}

const MAX_POINTS = 64;
const MAX_DISPLAY_RADIUS = 0.13; // rad (≈7.5°) — the largest a magnified body is drawn

/**
 * The Sun, planets and moons as seen from a surface: true directions (topocentric, from the
 * real heliocentric positions), true angular sizes (optionally magnified for a "poster" view),
 * phases lit by the Sun, extinction near the horizon, and star-like points when too small to
 * resolve. Drawn on a shell around the camera, inside the far plane.
 */
export class SkyBodies {
  public readonly group = new THREE.Group();
  private sphereGeo = new THREE.SphereGeometry(1, 64, 32);
  private ringGeo: THREE.RingGeometry;
  private entries = new Map<string, Entry>();
  private points: THREE.Points;
  private pointPos = new Float32Array(MAX_POINTS * 3);
  private pointSize = new Float32Array(MAX_POINTS);
  private pointColor = new Float32Array(MAX_POINTS * 3);
  private sunGlow: THREE.Sprite;
  private tmp = new THREE.Vector3();

  constructor() {
    this.group.name = 'surface_sky_bodies';
    this.group.visible = false;
    // Saturn's ring system in units of Saturn's radius (same as the globe model)
    this.ringGeo = new THREE.RingGeometry(1.32, 2.65, 128, 4);
    const pos = this.ringGeo.attributes.position;
    const uvs = this.ringGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const r = Math.hypot(pos.getX(i), pos.getY(i));
      uvs.setXY(i, (r - 1.32) / (2.65 - 1.32), 0.5);
    }
    uvs.needsUpdate = true;

    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(this.pointPos, 3));
    pg.setAttribute('aSize', new THREE.BufferAttribute(this.pointSize, 1));
    pg.setAttribute('aColor', new THREE.BufferAttribute(this.pointColor, 3));
    pg.setDrawRange(0, 0);
    this.points = new THREE.Points(
      pg,
      new THREE.ShaderMaterial({
        vertexShader: pointVertex,
        fragmentShader: pointFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    this.points.frustumCulled = false;
    this.points.renderOrder = 46;
    this.group.add(this.points);

    this.sunGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: makeGlowTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })
    );
    this.sunGlow.renderOrder = 47;
    this.group.add(this.sunGlow);
  }

  private entryFor(src: SkyBodySource): Entry {
    let e = this.entries.get(src.name);
    if (e) return e;
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: src.map ?? null },
        uHasMap: { value: src.map ? 1 : 0 },
        uColor: { value: new THREE.Color(src.colorHex ?? '#b0a89a') },
        uSunDir: { value: new THREE.Vector3(1, 0, 0) },
        uTint: { value: new THREE.Vector3(1, 1, 1) },
        uAlpha: { value: 1 },
        uEmissive: { value: src.name === 'Sun' ? 40 : 0 },
      },
      vertexShader: bodyVertex,
      fragmentShader: bodyFragment,
      transparent: true,
      depthWrite: true,
    });
    const mesh = new THREE.Mesh(this.sphereGeo, mat);
    mesh.name = `sky_${src.name}`;
    mesh.renderOrder = 45;
    mesh.frustumCulled = false;
    this.group.add(mesh);
    e = { mesh, mat };
    if (src.ringMap) {
      const ringMat = new THREE.ShaderMaterial({
        uniforms: {
          ringMap: { value: src.ringMap },
          uSunDir: { value: new THREE.Vector3(1, 0, 0) },
          uTint: { value: new THREE.Vector3(1, 1, 1) },
          uAlpha: { value: 1 },
        },
        vertexShader: ringVertex,
        fragmentShader: ringFragment,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(this.ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.renderOrder = 45.5;
      ring.frustumCulled = false;
      mesh.add(ring);
      e.ring = ring;
      e.ringMat = ringMat;
    }
    this.entries.set(src.name, e);
    return e;
  }

  /**
   * @param observerKm observer position, heliocentric ecliptic km (surface point + eye height)
   * @param frame local horizon frame (render axes)
   * @param shellRadius distance of the sky shell from the camera (render units)
   * @param magnification angular-size multiplier for everything but the Sun (1 = real)
   * @param limitingMagnitude faintest point source drawn (day sky ≈ −4, dark sky ≈ 6)
   */
  public update(p: {
    camera: THREE.PerspectiveCamera;
    observerKm: Vec3;
    observerBody: string;
    sources: SkyBodySource[];
    frame: { east: THREE.Vector3; north: THREE.Vector3; up: THREE.Vector3 };
    shellRadius: number;
    pixelsPerRadian: number;
    magnification: number;
    limitingMagnitude: number;
    atmosphere: AtmosphereModel | null;
    hideAll?: boolean;
  }): SkyObjectInfo[] {
    const out: SkyObjectInfo[] = [];
    let nPoints = 0;
    const cam = p.camera.position;
    const right = new THREE.Vector3().setFromMatrixColumn(p.camera.matrixWorld, 0).normalize();
    this.sunGlow.visible = false;
    const seen = new Set<string>();

    // Farther bodies sit slightly farther out on the shell so nearer ones occlude them
    const sorted = p.sources
      .filter((s) => s.name !== p.observerBody)
      .map((s) => {
        const rel: Vec3 = [s.positionKm[0] - p.observerKm[0], s.positionKm[1] - p.observerKm[1], s.positionKm[2] - p.observerKm[2]];
        return { s, rel, dist: Math.hypot(rel[0], rel[1], rel[2]) };
      })
      .sort((a, b) => a.dist - b.dist);

    sorted.forEach(({ s, rel, dist }, rank) => {
      const t = CoordinateFrames.eclipticToThree(rel);
      const dir = this.tmp.set(t[0], t[1], t[2]).normalize().clone();
      const alt = (Math.asin(THREE.MathUtils.clamp(dir.dot(p.frame.up), -1, 1)) * 180) / Math.PI;
      let az = (Math.atan2(dir.dot(p.frame.east), dir.dot(p.frame.north)) * 180) / Math.PI;
      if (az < 0) az += 360;
      const angR = Math.asin(Math.min(1, s.radiusKm / Math.max(dist, s.radiusKm * 1.0001)));
      const isSun = s.name === 'Sun';
      // Magnified bodies are capped (a ×1000 Moon would fill the sky); real sizes are never shrunk
      const shownR = isSun ? angR : Math.max(angR, Math.min(MAX_DISPLAY_RADIUS, angR * p.magnification));
      const discPx = shownR * p.pixelsPerRadian;
      const mag = apparentMagnitude(s.name, s.radiusKm, s.positionKm, p.observerKm);
      const ext = p.atmosphere ? transmittance(p.atmosphere, alt) : [1, 1, 1];
      const aboveHorizon = alt > -1.5 - (shownR * 180) / Math.PI;
      const shell = p.shellRadius * (1 + 0.25 * (rank / Math.max(1, sorted.length)));
      const centre = new THREE.Vector3().copy(cam).addScaledVector(dir, shell);
      const info: SkyObjectInfo = {
        name: s.name, altDeg: alt, azDeg: az, magnitude: mag,
        diameterArcsec: angR * 2 * 206264.8, distanceKm: dist, visible: false,
        labelWorld: centre.clone().addScaledVector(p.frame.up, 0),
      };

      const pointVisible = !p.hideAll && aboveHorizon && mag < p.limitingMagnitude;
      const discVisible = !p.hideAll && aboveHorizon && discPx >= 1.0 && (mag < p.limitingMagnitude + 3 || isSun || discPx > 6);

      // Resolved disc
      if (discVisible || isSun) {
        const e = this.entryFor(s);
        e.mesh.visible = !p.hideAll && aboveHorizon;
        if (e.mesh.visible) {
          seen.add(s.name);
          e.mesh.position.copy(centre);
          e.mesh.scale.setScalar(shell * Math.tan(shownR));
          if (s.orientation) e.mesh.quaternion.copy(s.orientation);
          const toSun = CoordinateFrames.eclipticToThree([-s.positionKm[0], -s.positionKm[1], -s.positionKm[2]]);
          e.mat.uniforms.uSunDir.value.set(toSun[0], toSun[1], toSun[2]).normalize();
          e.mat.uniforms.uTint.value.set(ext[0], ext[1], ext[2]);
          const fade = isSun ? 1 : THREE.MathUtils.smoothstep(discPx, 1.0, 3.0);
          e.mat.uniforms.uAlpha.value = fade;
          if (e.ringMat) {
            e.ringMat.uniforms.uSunDir.value.copy(e.mat.uniforms.uSunDir.value);
            e.ringMat.uniforms.uTint.value.set(ext[0], ext[1], ext[2]);
            e.ringMat.uniforms.uAlpha.value = fade;
          }
          info.visible = true;
          // Label beside the disc (rings reach 2.65 radii)
          info.labelWorld = centre.clone().addScaledVector(right, shell * Math.tan(shownR) * (e.ring ? 2.75 : 1.2) + shell * 0.004);
          if (isSun) {
            this.sunGlow.visible = true;
            this.sunGlow.position.copy(centre);
            const glowR = shell * Math.tan(Math.max(shownR * 9, 0.06));
            this.sunGlow.scale.setScalar(glowR * 2);
            const lum = (ext[0] + ext[1] + ext[2]) / 3;
            (this.sunGlow.material as THREE.SpriteMaterial).color.setRGB(ext[0], ext[1], ext[2]);
            (this.sunGlow.material as THREE.SpriteMaterial).opacity = Math.min(1, 0.25 + lum);
          }
        }
      }

      // Unresolved: a star-like point whose size and brightness follow the magnitude
      if (pointVisible && discPx < 3 && nPoints < MAX_POINTS && !isSun) {
        const fade = 1 - THREE.MathUtils.smoothstep(discPx, 1.0, 3.0);
        const flux = Math.pow(10, -0.4 * (mag - 1.0));
        const size = THREE.MathUtils.clamp(2.2 + 1.3 * Math.log10(1 + flux * 3), 1.6, 9);
        const bright = THREE.MathUtils.clamp(0.35 + 0.45 * Math.log10(1 + flux * 4), 0.25, 2.2) * fade;
        const c = new THREE.Color(s.colorHex ?? '#fff6e8');
        const pp = centre.clone().sub(cam); // points live in the group, which follows the camera
        this.pointPos.set([pp.x, pp.y, pp.z], nPoints * 3);
        this.pointSize[nPoints] = size * Math.min(2, window.devicePixelRatio || 1);
        this.pointColor.set([
          (0.6 + 0.4 * c.r) * bright * ext[0],
          (0.6 + 0.4 * c.g) * bright * ext[1],
          (0.6 + 0.4 * c.b) * bright * ext[2],
        ], nPoints * 3);
        nPoints++;
        info.visible = true;
        info.labelWorld = centre.clone().addScaledVector(right, shell * 0.006);
      }
      out.push(info);
    });

    for (const [name, e] of this.entries) if (!seen.has(name)) e.mesh.visible = false;
    this.points.position.copy(cam);
    const g = this.points.geometry;
    g.setDrawRange(0, nPoints);
    (g.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (g.attributes.aSize as THREE.BufferAttribute).needsUpdate = true;
    (g.attributes.aColor as THREE.BufferAttribute).needsUpdate = true;
    return out;
  }

  public dispose(): void {
    for (const e of this.entries.values()) {
      e.mat.dispose();
      e.ringMat?.dispose();
    }
    this.sphereGeo.dispose();
    this.ringGeo.dispose();
    this.points.geometry.dispose();
    (this.points.material as THREE.Material).dispose();
    (this.sunGlow.material as THREE.SpriteMaterial).map?.dispose();
    this.sunGlow.material.dispose();
  }
}
