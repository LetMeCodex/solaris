import * as THREE from 'three';
import { TexturePipeline } from './TexturePipeline';
import { SagittariusAStar } from './SagittariusAStar';

export interface GalaxyConfig {
  radius: number;          // Outer radius of galactic disk in scene units (e.g. 28,000)
  coreRadius: number;      // Radius of central bulge (e.g. 4,800)
  sunDistance: number;     // Distance of Sun from Galactic Center (e.g. 15,600, ~26,000 ly)
}

export const DEFAULT_GALAXY_CONFIG: GalaxyConfig = {
  radius: 28000,
  coreRadius: 4800,
  sunDistance: 15600, // 26,000 ly scaled to ~56% of galaxy radius
};

/**
 * Master Photorealistic 3D Milky Way Galaxy Model
 * Grounded in authentic NASA/ESO astrophysics and deep-space astrophotography:
 * 
 * 1. Master High-Definition Galactic Disk: Samples the NASA/ESO master Milky Way map with
 *    grazing-angle depth enhancement, micro-twinkle of OB associations, and HDR tone curves.
 * 2. 3D Volumetric Bulge Spheroid: True 3D ellipsoidal core with incandescent white-hot nucleus
 *    and warm golden Population II halo light scattering that does NOT blow out.
 * 3. 3D Midplane Dust Extinction Layer: Multi-layer absorption sheet that physically silhouettes
 *    and occludes the far side of the core when viewed at oblique angles.
 * 4. 14,000 Real 3D Stars: Dispersed in 3D ellipsoidal bulge, flared disk, and extended halo
 *    with realistic Morgan-Keenan spectral colors and Gaussian point-spread functions.
 * 5. Dwarf Companion Satellite Galaxies: Realistic Large & Small Magellanic Clouds (LMC & SMC)
 *    and Sagittarius Dwarf Spheroidal providing authentic cosmic scale.
 * 6. High-Tech Orion Spur Sun Beacon: Precision astronomical reticle marking the Solar System at
 *    26,000 ly from Sagittarius A*, with vertical altitude stalk to the galactic midplane.
 * 7. Sagittarius A* Relativistic Black Hole: Supermassive black hole at local (0, 0, 0) with
 *    Kerr/Schwarzschild null-geodesic ray tracing, event horizon shadow, photon ring, and accretion disk.
 */
export class MilkyWayGalaxy {
  public group: THREE.Group = new THREE.Group();

  // Sagittarius A* supermassive black hole at Galactic Center (0, 0, 0)
  public sagittariusAStar: SagittariusAStar;

  // Core visual subsystems
  private masterDiskMesh: THREE.Mesh;
  private coreBulgeMesh: THREE.Mesh;
  private dustExtinctionMesh: THREE.Mesh;
  private starPoints: THREE.Points;
  private satelliteGroup: THREE.Group = new THREE.Group();

  // Solar system locator
  private sunBeaconGroup: THREE.Group = new THREE.Group();
  private sunReticleMesh: THREE.Line;
  private sunPulseMesh: THREE.Mesh;
  private sunRadarRing: THREE.Line;

  // Uniform controllers
  private opacityUniform: { value: number } = { value: 0.0 };
  private timeUniform: { value: number } = { value: 0.0 };
  private bulgeFadeUniform: { value: number } = { value: 1.0 };

  public readonly config: GalaxyConfig;
  public readonly sunWorldPosition: THREE.Vector3 = new THREE.Vector3();

  constructor(config: GalaxyConfig = DEFAULT_GALAXY_CONFIG) {
    this.config = config;
    this.group.name = 'milky_way_external_galaxy';
    this.group.position.set(0, 0, 0);

    // Astronomical tilt: Milky Way galactic plane inclined relative to solar ecliptic (~63 deg)
    this.group.rotation.x = THREE.MathUtils.degToRad(62.87);
    this.group.rotation.y = THREE.MathUtils.degToRad(122.93);
    this.group.rotation.z = THREE.MathUtils.degToRad(282.25);

    // 1. Build Master High-Definition Galactic Disk
    this.masterDiskMesh = this.createMasterDisk();
    this.group.add(this.masterDiskMesh);

    // 2. Build 3D Volumetric Bulge Spheroid
    this.coreBulgeMesh = this.createVolumetricCore();
    this.group.add(this.coreBulgeMesh);

    // 3. Build Midplane Dust Extinction Layer
    this.dustExtinctionMesh = this.createDustExtinction();
    this.group.add(this.dustExtinctionMesh);

    // 4. Build 3D Galactic Stars (Bulge + Disk + Halo)
    this.starPoints = this.create3DStars();
    this.group.add(this.starPoints);

    // 5. Build Satellite Dwarf Galaxies (LMC, SMC, Sagittarius Dwarf)
    this.buildSatelliteGalaxies();
    this.group.add(this.satelliteGroup);

    // 6. Build Orion Spur / Solar System Locator Beacon
    const { beaconGroup, reticleMesh, pulseMesh, radarRing, sunPos } = this.createSunBeacon();
    this.sunBeaconGroup = beaconGroup;
    this.sunReticleMesh = reticleMesh;
    this.sunPulseMesh = pulseMesh;
    this.sunRadarRing = radarRing;
    this.sunWorldPosition.copy(sunPos);
    this.group.add(this.sunBeaconGroup);

    // 7. Build Sagittarius A* Supermassive Black Hole at Galactic Center (0, 0, 0)
    this.sagittariusAStar = new SagittariusAStar();
    this.group.add(this.sagittariusAStar.group);

    // Initially transparent (crossfades in when camera pulls out into interstellar space)
    this.setOpacity(0.0);
  }

  /**
   * 1. Master High-Definition Galactic Disk Mesh
   */
  private createMasterDisk(): THREE.Mesh {
    const geo = new THREE.PlaneGeometry(this.config.radius * 2.0, this.config.radius * 2.0, 64, 64);
    // Align with galactic X-Z midplane: rotate around X so normal faces +Y
    geo.rotateX(-Math.PI * 0.5);

    const tex = TexturePipeline.getInstance().getMilkyWayDiskTexture();
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uGalaxyMap: { value: tex },
        uOpacity: this.opacityUniform,
        uTime: this.timeUniform,
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying vec3 vViewDir;
        varying vec3 vNormalVec;

        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          vNormalVec = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D uGalaxyMap;
        uniform float uOpacity;
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vViewDir;
        varying vec3 vNormalVec;

        void main() {
          vec4 tex = texture2D(uGalaxyMap, vUv);
          if (tex.a < 0.005) discard;

          // Glancing angle depth enhancement:
          // Viewing at an oblique angle increases line-of-sight optical depth
          float cosView = clamp(abs(dot(vNormalVec, vViewDir)), 0.22, 1.0);
          float depthFactor = 1.0 + 0.25 * (1.0 - cosView);

          // Subtle organic micro-scintillation in OB star-forming clusters
          float isBlueStar = max(0.0, tex.b - tex.r * 0.92);
          float twinkle = 1.0 + isBlueStar * 0.18 * sin(uTime * 3.0 + vUv.x * 50.0 + vUv.y * 65.0);

          // Clear out innermost void for 3D Sagittarius A* relativistic system
          float distFromCenter = length(vUv - vec2(0.5)) * 2.0;
          float innerDiskMask = smoothstep(0.012, 0.045, distFromCenter);

          vec3 rgb = tex.rgb * 1.25 * depthFactor * twinkle;
          float alpha = clamp(tex.a * 1.10, 0.0, 1.0) * uOpacity * innerDiskMask;

          gl_FragColor = vec4(rgb, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = 'milky_way_master_disk';
    mesh.renderOrder = -8;
    return mesh;
  }

  /**
   * 2. 3D Volumetric Bulge Spheroid
   * Calibrated with incandescent white-hot nucleus and warm golden-amber Population II halo.
   */
  private createVolumetricCore(): THREE.Mesh {
    const geo = new THREE.SphereGeometry(this.config.coreRadius, 32, 24);
    // Flatten into ellipsoidal barred bulge (X=1.0, Y=0.42, Z=0.82)
    geo.scale(1.0, 0.42, 0.82);

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: this.opacityUniform,
        uBulgeFade: this.bulgeFadeUniform,
        uTime: this.timeUniform,
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        uniform float uBulgeFade;
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vViewDir;

        void main() {
          float rim = max(0.0, dot(vNormal, vViewDir));
          
          // Concentrated pinhead nucleus (innermost 5%)
          float nucleus = pow(rim, 6.5);
          // Luminous golden Population II core halo
          float halo = pow(rim, 2.8);
          
          vec3 nucleusCol = vec3(1.20, 1.15, 1.05);
          vec3 goldenBulgeCol = vec3(1.0, 0.78, 0.42);
          vec3 amberHaloCol = vec3(0.85, 0.45, 0.18);

          vec3 rgb = mix(amberHaloCol, goldenBulgeCol, halo);
          rgb = mix(rgb, nucleusCol, nucleus);

          float alpha = (nucleus * 0.50 + halo * 0.22) * uOpacity * uBulgeFade;
          gl_FragColor = vec4(rgb * 1.05, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = 'galactic_volumetric_core';
    mesh.renderOrder = -7;
    return mesh;
  }

  /**
   * 3. 3D Midplane Dust Extinction Layer
   */
  private createDustExtinction(): THREE.Mesh {
    const geo = new THREE.PlaneGeometry(this.config.radius * 1.85, this.config.radius * 1.85, 48, 48);
    geo.rotateX(-Math.PI * 0.5);

    const tex = TexturePipeline.getInstance().getMilkyWayDiskTexture();

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uGalaxyMap: { value: tex },
        uOpacity: this.opacityUniform,
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uGalaxyMap;
        uniform float uOpacity;
        varying vec2 vUv;

        void main() {
          vec4 tex = texture2D(uGalaxyMap, vUv);
          // Detect dark dust lanes: high red/amber relative to blue with moderate luminance
          float dustMask = clamp((tex.r * 1.1 - tex.b) * 1.8, 0.0, 1.0) * (1.0 - tex.b * 0.6);
          float distFromCenter = length(vUv - vec2(0.5)) * 2.0;
          float innerMask = smoothstep(0.012, 0.045, distFromCenter);
          float alpha = dustMask * 0.38 * uOpacity * innerMask;
          if (alpha < 0.01) discard;

          // Deep interstellar coal-dust absorption tone
          gl_FragColor = vec4(0.04, 0.02, 0.012, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = 'galactic_dust_extinction_sheet';
    mesh.position.y = 80.0; // Slightly above midplane to occlude far-side core
    mesh.renderOrder = -6;
    return mesh;
  }

  /**
   * 4. 14,000 Real 3D Galactic Stars (Bulge + Disk + Halo)
   * Calibrated with delicate point sizes and realistic Morgan-Keenan spectral classes.
   */
  private create3DStars(): THREE.Points {
    const count = 14000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const R = this.config.radius;
    const Rc = this.config.coreRadius;

    let ptr = 0;

    // A. 3D Bulge Stars (4,000 stars)
    const bulgeCount = 4000;
    for (let i = 0; i < bulgeCount; i++) {
      const u = Math.random();
      const r = Math.pow(u, 1.6) * Rc;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      const x = r * Math.cos(theta) * Math.cos(phi) * 1.15;
      const z = r * Math.sin(theta) * Math.cos(phi) * 0.85;
      const y = (r * Math.sin(phi)) * 0.42;

      positions[ptr * 3] = x;
      positions[ptr * 3 + 1] = y;
      positions[ptr * 3 + 2] = z;

      // Population II golden-amber stars
      const s = Math.random();
      if (s < 0.6) {
        colors[ptr * 3] = 1.0;
        colors[ptr * 3 + 1] = 0.85;
        colors[ptr * 3 + 2] = 0.60;
      } else {
        colors[ptr * 3] = 0.98;
        colors[ptr * 3 + 1] = 0.70;
        colors[ptr * 3 + 2] = 0.40;
      }

      sizes[ptr] = 1.0 + Math.random() * 1.5;
      ptr++;
    }

    // B. Disk Stars (8,000 stars)
    const diskCount = 8000;
    for (let i = 0; i < diskCount; i++) {
      const u = Math.random();
      const r = Rc * 0.8 + Math.pow(u, 1.1) * (R * 0.9 - Rc * 0.8);
      const theta = Math.random() * Math.PI * 2;

      // Flared vertical thin-disk distribution
      const thickness = 550.0 + (r / R) * 450.0;
      const y = (Math.random() - 0.5 + (Math.random() - 0.5)) * thickness;

      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      positions[ptr * 3] = x;
      positions[ptr * 3 + 1] = y;
      positions[ptr * 3 + 2] = z;

      // Morgan-Keenan spectral classification:
      const spec = Math.random();
      if (spec < 0.28) {
        // Young OB stars (cyan-blue)
        colors[ptr * 3] = 0.75;
        colors[ptr * 3 + 1] = 0.88;
        colors[ptr * 3 + 2] = 1.0;
        sizes[ptr] = 1.4 + Math.random() * 1.8;
      } else if (spec < 0.38) {
        // H II knots (pink)
        colors[ptr * 3] = 1.0;
        colors[ptr * 3 + 1] = 0.52;
        colors[ptr * 3 + 2] = 0.78;
        sizes[ptr] = 1.6 + Math.random() * 1.6;
      } else if (spec < 0.72) {
        // Solar-type G/F stars (white/yellow)
        colors[ptr * 3] = 0.98;
        colors[ptr * 3 + 1] = 0.96;
        colors[ptr * 3 + 2] = 0.92;
        sizes[ptr] = 0.9 + Math.random() * 1.2;
      } else {
        // Golden K-dwarfs
        colors[ptr * 3] = 1.0;
        colors[ptr * 3 + 1] = 0.82;
        colors[ptr * 3 + 2] = 0.52;
        sizes[ptr] = 1.0 + Math.random() * 1.4;
      }

      ptr++;
    }

    // C. Extended Halo Stars (2,000 stars)
    const haloCount = 2000;
    for (let i = 0; i < haloCount; i++) {
      const u = Math.random();
      const r = Math.pow(u, 1.4) * (R * 1.35);
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[ptr * 3] = r * Math.cos(theta) * Math.cos(phi);
      positions[ptr * 3 + 1] = r * Math.sin(phi) * 0.7;
      positions[ptr * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);

      colors[ptr * 3] = 0.92;
      colors[ptr * 3 + 1] = 0.90;
      colors[ptr * 3 + 2] = 0.95;
      sizes[ptr] = 0.8 + Math.random() * 1.0;

      ptr++;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: this.opacityUniform,
        uTime: this.timeUniform,
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float uOpacity;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float dist = -mvPosition.z;
          gl_PointSize = clamp(size * (36000.0 / max(dist, 100.0)), 0.8, 4.5);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform float uOpacity;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float d = length(coord);
          if (d > 0.5) discard;

          float core = exp(-d * d * 18.0);
          float halo = smoothstep(0.5, 0.05, d) * 0.22;
          float alpha = clamp(core + halo, 0.0, 1.0) * uOpacity * 0.65;

          gl_FragColor = vec4(vColor * 1.3, alpha);
        }
      `,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geo, mat);
    points.name = 'galactic_3d_stars';
    points.renderOrder = -5;
    return points;
  }

  /**
   * 5. Satellite Dwarf Galaxies (LMC, SMC, Sagittarius Dwarf)
   */
  private buildSatelliteGalaxies(): void {
    // Large Magellanic Cloud (LMC)
    const lmcGroup = this.createDwarfGalaxy(
      'large_magellanic_cloud',
      new THREE.Vector3(-9500, -13500, 11800),
      3600,
      new THREE.Color(0xd2e8ff),
      450
    );
    this.satelliteGroup.add(lmcGroup);

    // Small Magellanic Cloud (SMC)
    const smcGroup = this.createDwarfGalaxy(
      'small_magellanic_cloud',
      new THREE.Vector3(-14800, -18200, 7800),
      2100,
      new THREE.Color(0xe0eeff),
      220
    );
    this.satelliteGroup.add(smcGroup);

    // Sagittarius Dwarf Spheroidal
    const sgrGroup = this.createDwarfGalaxy(
      'sagittarius_dwarf_spheroidal',
      new THREE.Vector3(-1600, -6200, 3200),
      2400,
      new THREE.Color(0xffe6c4),
      280
    );
    this.satelliteGroup.add(sgrGroup);
  }

  private createDwarfGalaxy(
    name: string,
    pos: THREE.Vector3,
    radius: number,
    color: THREE.Color,
    starCount: number
  ): THREE.Group {
    const group = new THREE.Group();
    group.name = name;
    group.position.copy(pos);

    // Soft volumetric cloud glow
    const geo = new THREE.SphereGeometry(radius, 24, 16);
    geo.scale(1.25, 0.55, 0.95);

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: this.opacityUniform,
        uColor: { value: color },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          float rim = max(0.0, dot(vNormal, vViewDir));
          float alpha = pow(rim, 2.5) * 0.38 * uOpacity;
          gl_FragColor = vec4(uColor * 1.15, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
    });
    const cloud = new THREE.Mesh(geo, mat);
    cloud.renderOrder = -9;
    group.add(cloud);

    // Embedded star cluster motes
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const r = Math.pow(u, 1.8) * radius;
      const th = Math.random() * Math.PI * 2;
      const ph = (Math.random() - 0.5) * Math.PI;

      starPos[i * 3] = r * Math.cos(th) * Math.cos(ph) * 1.25;
      starPos[i * 3 + 1] = (r * Math.sin(ph)) * 0.55;
      starPos[i * 3 + 2] = r * Math.sin(th) * Math.cos(ph);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));

    const starMat = new THREE.PointsMaterial({
      color: color,
      size: 1.2,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    group.add(stars);

    return group;
  }

  /**
   * 6. High-Tech Orion Spur / Solar System Locator Beacon
   */
  private createSunBeacon(): {
    beaconGroup: THREE.Group;
    reticleMesh: THREE.Line;
    pulseMesh: THREE.Mesh;
    radarRing: THREE.Line;
    sunPos: THREE.Vector3;
  } {
    const beaconGroup = new THREE.Group();
    beaconGroup.name = 'sun_orion_spur_beacon';

    // Place Sun in the Orion Spur at radius ~15,600 (scaled ~26,000 ly)
    // Angle in galactic plane: bottom-left sector matching NASA map (~215 deg)
    const sunR = this.config.sunDistance;
    const sunTheta = THREE.MathUtils.degToRad(215.0);
    const sunY = 55.0; // Sun sits slightly above the galactic midplane (~20 pc)

    const sunPos = new THREE.Vector3(
      Math.cos(sunTheta) * sunR,
      sunY,
      Math.sin(sunTheta) * sunR
    );

    beaconGroup.position.copy(sunPos);

    // 1. Concentric Target Reticle Ring
    const ringGeo = new THREE.BufferGeometry();
    const segs = 64;
    const ringPts: THREE.Vector3[] = [];
    const reticleRadius = 450.0;
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      ringPts.push(new THREE.Vector3(Math.cos(a) * reticleRadius, 0, Math.sin(a) * reticleRadius));
    }
    ringGeo.setFromPoints(ringPts);

    const reticleMat = new THREE.LineBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.9,
    });
    const reticleMesh = new THREE.Line(ringGeo, reticleMat);
    beaconGroup.add(reticleMesh);

    // 2. Dashed Outer Radar Ring
    const radarGeo = new THREE.BufferGeometry();
    const radarPts: THREE.Vector3[] = [];
    const radarRadius = 750.0;
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      radarPts.push(new THREE.Vector3(Math.cos(a) * radarRadius, 0, Math.sin(a) * radarRadius));
    }
    radarGeo.setFromPoints(radarPts);
    const radarMat = new THREE.LineDashedMaterial({
      color: 0xffea78,
      dashSize: 40,
      gapSize: 25,
      transparent: true,
      opacity: 0.65,
    });
    const radarRing = new THREE.Line(radarGeo, radarMat);
    radarRing.computeLineDistances();
    beaconGroup.add(radarRing);

    // 3. Pulsing Golden Core Marker
    const pulseGeo = new THREE.SphereGeometry(180.0, 16, 12);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0xffeb88,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    beaconGroup.add(pulseMesh);

    // 4. Vertical Stalk connecting to galactic midplane
    const stalkGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -sunY, 0),
      new THREE.Vector3(0, 0, 0),
    ]);
    const stalkMat = new THREE.LineDashedMaterial({
      color: 0xffe072,
      dashSize: 22,
      gapSize: 15,
      transparent: true,
      opacity: 0.55,
    });
    const stalk = new THREE.Line(stalkGeo, stalkMat);
    stalk.computeLineDistances();
    beaconGroup.add(stalk);

    return { beaconGroup, reticleMesh, pulseMesh, radarRing, sunPos };
  }

  /**
   * Retrieves world-space coordinates of Sagittarius A* / Galactic Center.
   */
  public getGalacticCenterWorldPosition(target: THREE.Vector3 = new THREE.Vector3()): THREE.Vector3 {
    this.group.updateWorldMatrix(true, false);
    return this.group.getWorldPosition(target);
  }

  /**
   * Updates opacity of 3D galaxy and central Sagittarius A* based on camera distance.
   */
  public setOpacity(opacity: number): void {
    const clamped = Math.max(0.0, Math.min(1.0, opacity));
    this.opacityUniform.value = clamped;
    this.group.visible = clamped > 0.005;

    // Synchronize relativistic black hole opacity
    if (this.sagittariusAStar) {
      this.sagittariusAStar.setOpacity(clamped);
    }

    // Scale beacon visibility
    if (this.sunReticleMesh) {
      (this.sunReticleMesh.material as THREE.LineBasicMaterial).opacity = clamped * 0.9;
    }
    if (this.sunRadarRing) {
      (this.sunRadarRing.material as THREE.LineDashedMaterial).opacity = clamped * 0.65;
    }
    if (this.sunPulseMesh) {
      (this.sunPulseMesh.material as THREE.MeshBasicMaterial).opacity = clamped * 0.95;
    }
  }

  public update(timeSec: number, camera?: THREE.Camera): void {
    this.timeUniform.value = timeSec;

    // Update Sagittarius A* ray-marching shader and S-stars cluster
    if (this.sagittariusAStar && camera) {
      this.sagittariusAStar.update(camera, timeSec);

      // Smoothly fade out the low-resolution macro bulge when entering the central black hole realm
      const camGalLocal = camera.position.clone();
      this.group.worldToLocal(camGalLocal);
      const distToGalCenter = camGalLocal.length();
      const bulgeFade = THREE.MathUtils.clamp((distToGalCenter - 450.0) / 2200.0, 0.0, 1.0);
      this.bulgeFadeUniform.value = bulgeFade;
    }

    // Gentle pulsing effect for the Sun beacon
    if (this.sunPulseMesh && this.group.visible) {
      const pulse = 1.0 + 0.22 * Math.sin(timeSec * 3.5);
      this.sunPulseMesh.scale.set(pulse, pulse, pulse);
    }
    if (this.sunReticleMesh && this.group.visible) {
      this.sunReticleMesh.rotation.y = timeSec * 0.35;
    }
    if (this.sunRadarRing && this.group.visible) {
      this.sunRadarRing.rotation.y = -timeSec * 0.22;
    }
  }

  public dispose(): void {
    this.sagittariusAStar.dispose();
    this.masterDiskMesh.geometry.dispose();
    (this.masterDiskMesh.material as THREE.Material).dispose();

    this.coreBulgeMesh.geometry.dispose();
    (this.coreBulgeMesh.material as THREE.Material).dispose();

    this.dustExtinctionMesh.geometry.dispose();
    (this.dustExtinctionMesh.material as THREE.Material).dispose();

    this.starPoints.geometry.dispose();
    (this.starPoints.material as THREE.Material).dispose();

    this.sunReticleMesh.geometry.dispose();
    (this.sunReticleMesh.material as THREE.Material).dispose();

    this.sunRadarRing.geometry.dispose();
    (this.sunRadarRing.material as THREE.Material).dispose();

    this.sunPulseMesh.geometry.dispose();
    (this.sunPulseMesh.material as THREE.MeshBasicMaterial).dispose();

    this.satelliteGroup.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
  }
}
