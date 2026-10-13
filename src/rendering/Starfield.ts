import * as THREE from 'three';
import { TexturePipeline } from './TexturePipeline';

interface RawStarHeader {
  count: number;
  columns: string[];
  stars: Array<[
    number, // hip
    number, // x
    number, // y
    number, // z
    number, // magnitude
    number | null, // bv
    number | null, // distancePc
    string | null, // spectralType
    string // spectralClass
  ]>;
}

// Major IAU Asterisms / Constellation line pairs (HIP_A, HIP_B)
const CONSTELLATION_EDGES: Array<[number, number]> = [
  // --- URSA MAJOR (BIG DIPPER) ---
  [54061, 53910], // Dubhe - Merak (Pointers)
  [53910, 58001], // Merak - Phecda
  [58001, 59774], // Phecda - Megrez
  [59774, 54061], // Megrez - Dubhe (Bowl complete)
  [59774, 62956], // Megrez - Alioth (Handle start)
  [62956, 65378], // Alioth - Mizar
  [65378, 67301], // Mizar - Alkaid

  // --- ORION ---
  [27989, 25336], // Betelgeuse - Bellatrix
  [27989, 27366], // Betelgeuse - Saiph
  [25336, 24436], // Bellatrix - Rigel
  [27366, 24436], // Saiph - Rigel
  [25930, 26311], // Mintaka - Alnilam (Belt)
  [26311, 26727], // Alnilam - Alnitak (Belt)
  [26727, 27989], // Alnitak - Betelgeuse
  [25930, 25336], // Mintaka - Bellatrix

  // --- CASSIOPEIA ('W') ---
  [746, 3179],   // Caph - Schedar
  [3179, 2920],  // Schedar - Navi (Gamma Cas)
  [2920, 6686],  // Navi - Ruchbah
  [6686, 8886],  // Ruchbah - Segin

  // --- CRUX (SOUTHERN CROSS) ---
  [60718, 61084], // Acrux - Gacrux (Major axis)
  [62434, 61932], // Becrux/Mimosa - Imai (Minor axis)

  // --- CYGNUS (NORTHERN CROSS) ---
  [102098, 100453], // Deneb - Sadr
  [100453, 95947],  // Sadr - Albireo
  [102488, 100453], // Gienah - Sadr
  [100453, 97165],  // Sadr - Rukh (Delta Cyg)

  // --- LEO ---
  [49669, 50583], // Regulus - Algieba
  [50583, 50335], // Algieba - Adhafera
  [50335, 48455], // Adhafera - Rasalas (Sickle)
  [50583, 54872], // Algieba - Zosma
  [54872, 57632], // Zosma - Denebola
  [57632, 49669], // Denebola - Regulus

  // --- SCORPIUS ---
  [80763, 78820], // Antares - Dschubba
  [78820, 78401], // Dschubba - Graffias
  [80763, 82396], // Antares - Wei
  [82396, 86228], // Wei - Sargas
  [86228, 85927], // Sargas - Shaula

  // --- CANIS MAJOR ---
  [32349, 30324], // Sirius - Murzim
  [32349, 33579], // Sirius - Adhara
  [33579, 34444], // Adhara - Wezen
  [34444, 35904], // Wezen - Aludra
];

interface Meteor {
  active: boolean;
  startPos: THREE.Vector3;
  dir: THREE.Vector3;
  speed: number;
  length: number;
  progress: number;
  cooldown: number;
  color: THREE.Color;
}

class MeteorSystem {
  public mesh: THREE.LineSegments;
  private meteors: Meteor[] = [];
  private positions: Float32Array;
  private colors: Float32Array;
  private count = 5;

  constructor() {
    this.positions = new Float32Array(this.count * 2 * 3);
    this.colors = new Float32Array(this.count * 2 * 3);

    for (let i = 0; i < this.count; i++) {
      this.meteors.push({
        active: false,
        startPos: new THREE.Vector3(),
        dir: new THREE.Vector3(),
        speed: 380 + Math.random() * 260,
        length: 28 + Math.random() * 24,
        progress: 0,
        cooldown: 2.0 + Math.random() * 8.0,
        color: new THREE.Color(
          Math.random() > 0.35 ? 0xdaf0ff : 0xffe8c2
        ),
      });
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.mesh = new THREE.LineSegments(geo, mat);
    this.mesh.name = 'meteor_streaks';
    this.mesh.renderOrder = -1;
  }

  public update(deltaSec: number, cameraPos: THREE.Vector3): void {
    const posAttr = this.mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
    const colAttr = this.mesh.geometry.getAttribute('color') as THREE.BufferAttribute;

    for (let i = 0; i < this.count; i++) {
      const m = this.meteors[i];
      const i0 = i * 6;
      const i1 = i * 6 + 3;

      if (!m.active) {
        m.cooldown -= deltaSec;
        if (m.cooldown <= 0) {
          m.active = true;
          m.progress = 0;
          m.speed = 360 + Math.random() * 320;
          m.length = 26 + Math.random() * 26;

          const angle = Math.random() * Math.PI * 2;
          const height = (Math.random() - 0.5) * 180;
          const dist = 160 + Math.random() * 240;
          m.startPos.set(
            cameraPos.x + Math.cos(angle) * dist,
            cameraPos.y + height,
            cameraPos.z + Math.sin(angle) * dist
          );

          const dirAngle = angle + Math.PI * 0.5 + (Math.random() - 0.5) * 1.2;
          m.dir.set(
            Math.cos(dirAngle),
            (Math.random() - 0.5) * 0.45,
            Math.sin(dirAngle)
          ).normalize();
        } else {
          this.positions[i0] = 0; this.positions[i0 + 1] = 0; this.positions[i0 + 2] = 0;
          this.positions[i1] = 0; this.positions[i1 + 1] = 0; this.positions[i1 + 2] = 0;
          this.colors[i0] = 0; this.colors[i0 + 1] = 0; this.colors[i0 + 2] = 0;
          this.colors[i1] = 0; this.colors[i1 + 1] = 0; this.colors[i1 + 2] = 0;
          continue;
        }
      }

      m.progress += (m.speed * deltaSec) / 260.0;
      if (m.progress >= 1.0) {
        m.active = false;
        m.cooldown = 4.0 + Math.random() * 9.0;
        this.positions[i0] = 0; this.positions[i0 + 1] = 0; this.positions[i0 + 2] = 0;
        this.positions[i1] = 0; this.positions[i1 + 1] = 0; this.positions[i1 + 2] = 0;
        this.colors[i0] = 0; this.colors[i0 + 1] = 0; this.colors[i0 + 2] = 0;
        this.colors[i1] = 0; this.colors[i1 + 1] = 0; this.colors[i1 + 2] = 0;
        continue;
      }

      const currentTravel = m.progress * 260.0;
      const headX = m.startPos.x + m.dir.x * currentTravel;
      const headY = m.startPos.y + m.dir.y * currentTravel;
      const headZ = m.startPos.z + m.dir.z * currentTravel;

      const tailTravel = Math.max(0, currentTravel - m.length);
      const tailX = m.startPos.x + m.dir.x * tailTravel;
      const tailY = m.startPos.y + m.dir.y * tailTravel;
      const tailZ = m.startPos.z + m.dir.z * tailTravel;

      this.positions[i0] = headX;
      this.positions[i0 + 1] = headY;
      this.positions[i0 + 2] = headZ;

      this.positions[i1] = tailX;
      this.positions[i1 + 1] = tailY;
      this.positions[i1 + 2] = tailZ;

      const alpha = Math.sin(m.progress * Math.PI) * 0.95;
      this.colors[i0] = m.color.r * alpha * 1.6;
      this.colors[i0 + 1] = m.color.g * alpha * 1.6;
      this.colors[i0 + 2] = m.color.b * alpha * 1.6;

      this.colors[i1] = m.color.r * alpha * 0.12;
      this.colors[i1 + 1] = m.color.g * alpha * 0.12;
      this.colors[i1 + 2] = m.color.b * alpha * 0.12;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}

export class Starfield {
  public group: THREE.Group = new THREE.Group();
  private celestialGroup: THREE.Group = new THREE.Group();
  private pointsMesh?: THREE.Points;
  private constellationLines?: THREE.LineSegments;
  private milkyWayMesh?: THREE.Mesh;
  private stardustMesh?: THREE.Points;
  private meteorSystem?: MeteorSystem;
  public isLoaded: boolean = false;

  // Sphere radius for stars in Three.js coordinates
  public static readonly SPHERE_RADIUS = 8500.0;

  constructor() {
    this.group.name = 'starfield_hipparcos';
    this.group.add(this.celestialGroup);
    this.celestialGroup.name = 'celestial_infinite_sphere';

    this.buildMilkyWayBackground();
    this.build3DCosmicStardust();
    this.meteorSystem = new MeteorSystem();
    this.group.add(this.meteorSystem.mesh);

    this.loadCatalog();
  }

  private buildMilkyWayBackground(): void {
    const geo = new THREE.SphereGeometry(Starfield.SPHERE_RADIUS * 1.05, 64, 48);
    const tex = TexturePipeline.getInstance().getMilkyWayTexture();

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        milkyWayMap: { value: tex },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D milkyWayMap;
        varying vec2 vUv;

        void main() {
          vec4 tex = texture2D(milkyWayMap, vUv);

          // Gentle gamma lift: pulls faint galactic dust and star lanes out of the dark toe of ACESFilmic
          vec3 baseColor = pow(tex.rgb, vec3(0.82));
          float lum = dot(baseColor, vec3(0.299, 0.587, 0.114));

          // Warm golden core enhancement for the galactic bulge
          vec3 coreWarmth = vec3(1.22, 1.08, 0.88);
          float coreMask = smoothstep(0.10, 0.60, lum);

          // Deep interstellar dust enhancement: accentuate dark absorption silhouettes (Great Rift)
          float dustContrast = smoothstep(0.02, 0.22, lum);

          // Subtle H-alpha ionized hydrogen emission nebular wisps (656.3 nm deep ruby/crimson)
          vec3 hAlpha = vec3(0.68, 0.18, 0.32) * smoothstep(0.22, 0.68, tex.r) * 0.42;

          // Subtle O-III oxygen emission teal/cyan wisps
          vec3 oiii = vec3(0.12, 0.46, 0.62) * smoothstep(0.28, 0.78, tex.b) * 0.24;

          // Balanced cosmic color grading
          vec3 cosmicColor = baseColor * mix(vec3(0.96, 0.98, 1.04), coreWarmth, coreMask) * (0.90 + 0.48 * dustContrast) + hAlpha + oiii;

          // Maintain subtle atmospheric depth across deep space void (never crushed to flat black)
          cosmicColor = max(cosmicColor, vec3(0.003, 0.004, 0.008));

          gl_FragColor = vec4(cosmicColor * 1.35, 1.0);

          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    });

    this.milkyWayMesh = new THREE.Mesh(geo, mat);
    this.milkyWayMesh.name = 'milky_way_skybox';
    this.milkyWayMesh.renderOrder = -10;
    // Align Galactic Plane with astronomical orientation
    this.milkyWayMesh.rotation.x = THREE.MathUtils.degToRad(62.87);
    this.milkyWayMesh.rotation.y = THREE.MathUtils.degToRad(122.93);
    this.milkyWayMesh.rotation.z = THREE.MathUtils.degToRad(282.25);
    this.celestialGroup.add(this.milkyWayMesh);
  }

  private build3DCosmicStardust(): void {
    const count = 2800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Toroidal cosmic distribution across the solar system disk
      const r = 25.0 + Math.pow(Math.random(), 0.65) * 850.0;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * (120.0 + r * 0.15);

      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * r;

      // Color variation: Planckian stardust (soft warm amber, diamond white, pale cyan)
      const colorType = Math.random();
      if (colorType < 0.40) {
        // Diamond white
        colors[i * 3] = 0.95;
        colors[i * 3 + 1] = 0.97;
        colors[i * 3 + 2] = 1.0;
      } else if (colorType < 0.70) {
        // Warm solar stardust
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.88;
        colors[i * 3 + 2] = 0.65;
      } else {
        // Deep space ice cyan
        colors[i * 3] = 0.72;
        colors[i * 3 + 1] = 0.90;
        colors[i * 3 + 2] = 1.0;
      }

      scales[i] = 1.8 + Math.random() * 2.6;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        attribute float aScale;
        attribute float aPhase;
        uniform float time;
        varying vec3 vColor;
        varying float vTwinkle;

        void main() {
          vColor = color;
          vTwinkle = 0.65 + 0.35 * sin(time * 1.8 + aPhase);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float dist = -mvPosition.z;
          gl_PointSize = clamp(aScale * (220.0 / dist), 1.2, 5.5);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vTwinkle;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float d = length(coord);
          if (d > 0.5) discard;

          float core = exp(-d * d * 22.0);
          float alpha = core * vTwinkle * 0.75;

          gl_FragColor = vec4(vColor * 1.3, alpha);
        }
      `,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.stardustMesh = new THREE.Points(geo, mat);
    this.stardustMesh.name = 'cosmic_stardust_motes';
    this.stardustMesh.renderOrder = -2;
    this.group.add(this.stardustMesh);
  }

  private async loadCatalog(): Promise<void> {
    try {
      const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
      const response = await fetch(`${baseUrl}data/stars.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch stars.json: HTTP ${response.status}`);
      }
      const data: RawStarHeader = await response.json();
      this.buildStarfieldMesh(data);
      this.buildConstellations(data);
      this.isLoaded = true;
    } catch (err) {
      console.warn('Could not stream Hipparcos stars dataset, using procedural fallback:', err);
      this.buildProceduralFallback();
    }
  }

  private buildStarfieldMesh(data: RawStarHeader): void {
    // Render naked-eye observable stars (Vmag <= 6.2) so the photographic
    // Gaia Milky Way panorama provides the deep interstellar background without speckle noise
    const stars = data.stars.filter((s) => s[4] <= 6.2);
    const count = stars.length;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const R = Starfield.SPHERE_RADIUS;

    for (let i = 0; i < count; i++) {
      const star = stars[i];
      const x = star[1];
      const y = star[2];
      const z = star[3];
      const vmag = star[4];
      const bv = star[5];

      positions[i * 3] = x * R;
      positions[i * 3 + 1] = z * R;
      positions[i * 3 + 2] = -y * R;

      const color = this.bvToRGB(bv, star[8]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Crisp pinpoint scaling: brightest stars stand out with subtle glare
      const sizePx = Math.max(0.8, 4.4 - 0.58 * vmag);
      sizes[i] = sizePx;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const vertexShader = `
      attribute float size;
      varying vec3 vColor;
      varying float vBrightness;

      void main() {
        vColor = color;
        vBrightness = size;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = clamp(size, 0.8, 8.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      varying float vBrightness;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        float core = exp(-dist * dist * 38.0);
        float halo = smoothstep(0.5, 0.05, dist) * 0.18;

        float spikes = 0.0;
        if (vBrightness > 3.6) {
          float crossX = exp(-abs(coord.y) * 45.0) * max(0.0, 1.0 - abs(coord.x) * 2.0);
          float crossY = exp(-abs(coord.x) * 45.0) * max(0.0, 1.0 - abs(coord.y) * 2.0);
          spikes = max(crossX, crossY) * 0.35;
        }

        float alpha = clamp(core + halo + spikes, 0.0, 1.0) * clamp(vBrightness * 0.28, 0.2, 0.95);
        gl_FragColor = vec4(vColor * 1.25, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.pointsMesh = new THREE.Points(geometry, material);
    this.pointsMesh.renderOrder = 0;
    this.celestialGroup.add(this.pointsMesh);
  }

  private buildConstellations(data: RawStarHeader): void {
    const starMap = new Map<number, [number, number, number]>();
    const R = Starfield.SPHERE_RADIUS * 0.998;

    for (const star of data.stars) {
      const hip = star[0];
      const x = star[1] * R;
      const y = star[3] * R;
      const z = -star[2] * R;
      starMap.set(hip, [x, y, z]);
    }

    const linePositions: number[] = [];
    for (const [hipA, hipB] of CONSTELLATION_EDGES) {
      const posA = starMap.get(hipA);
      const posB = starMap.get(hipB);
      if (posA && posB) {
        linePositions.push(posA[0], posA[1], posA[2]);
        linePositions.push(posB[0], posB[1], posB[2]);
      }
    }

    if (linePositions.length === 0) return;

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    );

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x4fd1c5,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.constellationLines = new THREE.LineSegments(lineGeo, lineMat);
    this.constellationLines.name = 'constellation_lines';
    this.celestialGroup.add(this.constellationLines);
  }

  private bvToRGB(bv: number | null, spectralClass: string): THREE.Color {
    if (bv !== null) {
      if (bv < -0.1) return new THREE.Color(0x9db4ff);
      if (bv < 0.15) return new THREE.Color(0xbcd2ff);
      if (bv < 0.35) return new THREE.Color(0xf0f4ff);
      if (bv < 0.60) return new THREE.Color(0xfff7e8);
      if (bv < 0.85) return new THREE.Color(0xffe6a3);
      if (bv < 1.30) return new THREE.Color(0xffbe75);
      return new THREE.Color(0xff8a55);
    }

    switch (spectralClass) {
      case 'O': return new THREE.Color(0x9db4ff);
      case 'B': return new THREE.Color(0xbcd2ff);
      case 'A': return new THREE.Color(0xf0f4ff);
      case 'F': return new THREE.Color(0xfff7e8);
      case 'G': return new THREE.Color(0xffe6a3);
      case 'K': return new THREE.Color(0xffbe75);
      case 'M': return new THREE.Color(0xff8a55);
      default: return new THREE.Color(0xffffff);
    }
  }

  private buildProceduralFallback(): void {
    const starCount = 6000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const R = Starfield.SPHERE_RADIUS;
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i * 3] = R * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = R * Math.cos(phi);
      positions[i * 3 + 2] = R * Math.sin(phi) * Math.sin(theta);

      colors[i * 3] = 0.9;
      colors[i * 3 + 1] = 0.92;
      colors[i * 3 + 2] = 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    this.pointsMesh = new THREE.Points(geometry, material);
    this.celestialGroup.add(this.pointsMesh);
  }

  public update(cameraPosition: THREE.Vector3, deltaSec: number): void {
    // Keep infinite celestial sphere and real Hipparcos stars centered on camera
    this.celestialGroup.position.copy(cameraPosition);

    // Update 3D cosmic stardust twinkling
    if (this.stardustMesh) {
      const mat = this.stardustMesh.material as THREE.ShaderMaterial;
      if (mat.uniforms?.time) {
        mat.uniforms.time.value += deltaSec;
      }
    }

    // Update dynamic shooting star streaks
    if (this.meteorSystem) {
      this.meteorSystem.update(deltaSec, cameraPosition);
    }
  }

  public setConstellationsVisible(visible: boolean): void {
    if (this.constellationLines) {
      this.constellationLines.visible = visible;
    }
  }

  public toggleConstellations(): boolean {
    if (this.constellationLines) {
      this.constellationLines.visible = !this.constellationLines.visible;
      return this.constellationLines.visible;
    }
    return false;
  }

  public areConstellationsVisible(): boolean {
    return this.constellationLines?.visible ?? true;
  }

  public dispose(): void {
    if (this.milkyWayMesh) {
      this.milkyWayMesh.geometry.dispose();
      (this.milkyWayMesh.material as THREE.Material).dispose();
    }
    if (this.pointsMesh) {
      this.pointsMesh.geometry.dispose();
      (this.pointsMesh.material as THREE.Material).dispose();
    }
    if (this.constellationLines) {
      this.constellationLines.geometry.dispose();
      (this.constellationLines.material as THREE.Material).dispose();
    }
    if (this.stardustMesh) {
      this.stardustMesh.geometry.dispose();
      (this.stardustMesh.material as THREE.Material).dispose();
    }
    if (this.meteorSystem) {
      this.meteorSystem.dispose();
    }
  }
}
