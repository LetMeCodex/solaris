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

export class Starfield {
  public group: THREE.Group = new THREE.Group();
  private pointsMesh?: THREE.Points;
  private constellationLines?: THREE.LineSegments;
  private milkyWayMesh?: THREE.Mesh;
  public isLoaded: boolean = false;

  // Sphere radius for stars in Three.js coordinates
  public static readonly SPHERE_RADIUS = 50000.0;

  constructor() {
    this.group.name = 'starfield_hipparcos';
    this.buildMilkyWayBackground();
    this.loadCatalog();
  }

  private buildMilkyWayBackground(): void {
    const geo = new THREE.SphereGeometry(Starfield.SPHERE_RADIUS * 1.6, 64, 48);
    const tex = TexturePipeline.getInstance().getMilkyWayTexture();
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      side: THREE.BackSide,
      depthWrite: false,
      color: 0x909cb0, // Dark calibrated cosmic luminance
    });
    this.milkyWayMesh = new THREE.Mesh(geo, mat);
    this.milkyWayMesh.name = 'milky_way_skybox';
    this.milkyWayMesh.renderOrder = -10;
    // Align Galactic Plane with astronomical orientation
    this.milkyWayMesh.rotation.x = THREE.MathUtils.degToRad(62.87);
    this.milkyWayMesh.rotation.y = THREE.MathUtils.degToRad(122.93);
    this.milkyWayMesh.rotation.z = THREE.MathUtils.degToRad(282.25);
    this.group.add(this.milkyWayMesh);
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
    const stars = data.stars;
    const count = stars.length;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const R = Starfield.SPHERE_RADIUS;

    for (let i = 0; i < count; i++) {
      const star = stars[i];
      // Unit vector on celestial sphere in ICRS (aligned with ICRF)
      const x = star[1];
      const y = star[2];
      const z = star[3];
      const vmag = star[4];
      const bv = star[5];

      // Convert ICRF unit vector to Three.js coordinates (X, Z in ecliptic/equatorial plane, Y up)
      // ICRS to Three.js orientation:
      positions[i * 3] = x * R;
      positions[i * 3 + 1] = z * R; // Celestial North is +Y in Three.js
      positions[i * 3 + 2] = -y * R;

      // Color from B-V index (Planckian blackbody approximation)
      const color = this.bvToRGB(bv, star[8]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Size from apparent magnitude (logarithmic brightness perception)
      // Vmag ranges from -1.44 (Sirius) to 8.0 (faint limit)
      const sizePx = Math.max(1.2, 5.8 - 0.62 * vmag);
      sizes[i] = sizePx;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader for smooth antialiased circular stellar disks
    const vertexShader = `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = clamp(size, 1.2, 9.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;
        // Soft gaussian stellar core and diffraction halo
        float alpha = smoothstep(0.5, 0.05, dist);
        gl_FragColor = vec4(vColor, alpha * 0.95);
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
    this.group.add(this.pointsMesh);
  }

  private buildConstellations(data: RawStarHeader): void {
    // Index star coordinates by Hipparcos ID
    const starMap = new Map<number, [number, number, number]>();
    const R = Starfield.SPHERE_RADIUS * 0.998; // Slightly inside star sphere to avoid z-fighting

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
      color: 0x4fd1c5, // Subtle telemetry cyan
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.constellationLines = new THREE.LineSegments(lineGeo, lineMat);
    this.constellationLines.name = 'constellation_lines';
    this.group.add(this.constellationLines);
  }

  /**
   * Convert astronomical B-V color index or spectral class into physical RGB color.
   */
  private bvToRGB(bv: number | null, spectralClass: string): THREE.Color {
    if (bv !== null) {
      if (bv < -0.1) return new THREE.Color(0x9db4ff); // O / deep blue
      if (bv < 0.15) return new THREE.Color(0xbcd2ff); // B / pale blue
      if (bv < 0.35) return new THREE.Color(0xf0f4ff); // A / diamond white
      if (bv < 0.60) return new THREE.Color(0xfff7e8); // F / creamy white
      if (bv < 0.85) return new THREE.Color(0xffe6a3); // G / warm yellow (Solar)
      if (bv < 1.30) return new THREE.Color(0xffbe75); // K / orange
      return new THREE.Color(0xff8a55);                 // M / deep red-orange
    }

    // Fallback using spectral class
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
    this.group.add(this.pointsMesh);
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
  }
}
