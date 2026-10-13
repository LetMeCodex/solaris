import * as THREE from 'three';

export interface GalaxyConfig {
  radius: number;          // Outer radius of galactic disk in scene units (e.g. 24,000)
  coreRadius: number;      // Radius of central bulge (e.g. 4,200)
  sunDistance: number;     // Distance of Sun from Galactic Center (e.g. 14,500, ~26,000 ly)
  starCount: number;       // Number of instanced stars (e.g. 18,000)
  numArms: number;         // 4 major spiral arms
  armPitchAngleDeg: number;// 12 degrees
}

export const DEFAULT_GALAXY_CONFIG: GalaxyConfig = {
  radius: 26000,
  coreRadius: 4600,
  sunDistance: 15600, // 26,000 ly scaled to ~60% of galaxy radius
  starCount: 22000,
  numArms: 4,
  armPitchAngleDeg: 12.0,
};

/**
 * 3D Procedural Milky Way Galaxy Model
 * Features:
 * 1. Dense central bulge with Population II warm golden stars & supermassive black hole marker.
 * 2. Four logarithmic spiral arms (Scutum-Centaurus, Sagittarius, Perseus, Outer) with 12° pitch.
 * 3. Realistic stellar populations: blue-white OB stars, golden dwarfs, and pink H II starbirth knots.
 * 4. Dark dust absorption lanes along inner spiral arm boundaries.
 * 5. Orion Spur / Solar System locator beacon with pulsing reticle and telemetry callout.
 * 6. Smooth GPU crossfade opacity control as observer moves between local space and galactic exterior.
 */
export class MilkyWayGalaxy {
  public group: THREE.Group = new THREE.Group();
  private starPoints: THREE.Points;
  private coreGlowMesh: THREE.Mesh;
  private dustPoints: THREE.Points;
  private sunBeaconGroup: THREE.Group = new THREE.Group();
  private sunReticleMesh: THREE.Line;
  private sunPulseMesh: THREE.Mesh;
  private opacityUniform: { value: number } = { value: 0.0 };
  private timeUniform: { value: number } = { value: 0.0 };

  public readonly config: GalaxyConfig;
  public readonly sunWorldPosition: THREE.Vector3 = new THREE.Vector3();

  constructor(config: GalaxyConfig = DEFAULT_GALAXY_CONFIG) {
    this.config = config;
    this.group.name = 'milky_way_external_galaxy';
    this.group.position.set(0, 0, 0);

    // Astronomical tilt: Milky Way galactic plane inclined relative to solar ecliptic
    this.group.rotation.x = THREE.MathUtils.degToRad(62.87);
    this.group.rotation.y = THREE.MathUtils.degToRad(122.93);
    this.group.rotation.z = THREE.MathUtils.degToRad(282.25);

    // 1. Build Galactic Core Glow
    this.coreGlowMesh = this.createCoreGlow();
    this.group.add(this.coreGlowMesh);

    // 2. Build 3D Galactic Stars (Bulge + Spiral Arms)
    this.starPoints = this.createGalacticStars();
    this.group.add(this.starPoints);

    // 3. Build Interstellar Dust Lanes
    this.dustPoints = this.createDustLanes();
    this.group.add(this.dustPoints);

    // 4. Build Orion Spur / Solar System Locator Beacon
    const { beaconGroup, reticleMesh, pulseMesh, sunPos } = this.createSunBeacon();
    this.sunBeaconGroup = beaconGroup;
    this.sunReticleMesh = reticleMesh;
    this.sunPulseMesh = pulseMesh;
    this.sunWorldPosition.copy(sunPos);
    this.group.add(this.sunBeaconGroup);

    // Initially transparent (fades in when zooming past interstellar boundary)
    this.setOpacity(0.0);
  }

  private createCoreGlow(): THREE.Mesh {
    const geo = new THREE.SphereGeometry(this.config.coreRadius, 32, 24);
    // Flatten into ellipsoidal galactic bulge (flattened along Z/Y)
    geo.scale(1.0, 0.45, 1.0);

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: this.opacityUniform,
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
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vViewDir;

        void main() {
          float rim = max(0.0, dot(vNormal, vViewDir));
          float coreIntensity = pow(rim, 2.5);
          
          // Warm golden/amber galactic core color (Population II old stars)
          vec3 coreCol = vec3(1.0, 0.88, 0.62) * 1.8;
          vec3 haloCol = vec3(0.95, 0.65, 0.35) * 0.9;
          vec3 rgb = mix(haloCol, coreCol, coreIntensity);

          float alpha = coreIntensity * 0.75 * uOpacity;
          gl_FragColor = vec4(rgb, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = 'galactic_core_glow';
    return mesh;
  }

  private createGalacticStars(): THREE.Points {
    const count = this.config.starCount;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const R = this.config.radius;
    const Rc = this.config.coreRadius;
    const B = 1.0 / Math.tan(THREE.MathUtils.degToRad(this.config.armPitchAngleDeg));
    const armOffsets = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5]; // 4 logarithmic arms

    let ptr = 0;

    // A. Central Bulge Stars (30% of total)
    const bulgeCount = Math.floor(count * 0.30);
    for (let i = 0; i < bulgeCount; i++) {
      // Exponential density falloff towards core
      const u = Math.random();
      const r = Math.pow(u, 1.8) * Rc;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      const x = r * Math.cos(theta) * Math.cos(phi);
      const z = r * Math.sin(theta) * Math.cos(phi);
      // Flattened vertical bulge
      const y = (r * Math.sin(phi)) * 0.40;

      positions[ptr * 3] = x;
      positions[ptr * 3 + 1] = y;
      positions[ptr * 3 + 2] = z;

      // Golden core population
      const tempVar = Math.random();
      if (tempVar < 0.6) {
        colors[ptr * 3] = 1.0;
        colors[ptr * 3 + 1] = 0.88;
        colors[ptr * 3 + 2] = 0.65;
      } else {
        colors[ptr * 3] = 0.98;
        colors[ptr * 3 + 1] = 0.72;
        colors[ptr * 3 + 2] = 0.42;
      }

      sizes[ptr] = 1.5 + Math.random() * 2.0;
      ptr++;
    }

    // B. Spiral Arm Stars (70% of total)
    const armStarCount = count - bulgeCount;
    for (let i = 0; i < armStarCount; i++) {
      const armIdx = i % this.config.numArms;
      const baseArmAngle = armOffsets[armIdx];

      // Radius along spiral arm from core edge to outer disc
      const t = Math.pow(Math.random(), 0.85);
      const r = Rc * 0.85 + t * (R - Rc * 0.85);

      // Logarithmic spiral formula: theta = theta0 + B * ln(r / r0)
      const armAngle = baseArmAngle + B * Math.log(r / (Rc * 0.85));

      // Gaussian dispersion perpendicular to spiral arm
      const dispersion = (Math.random() - 0.5 + (Math.random() - 0.5)) * (r * 0.18 + 400.0);
      const finalAngle = armAngle + (dispersion / r);

      // Vertical Gaussian thickness (thin disc ~ 800-1200 ly)
      const zScale = (1.0 - (r / R) * 0.5) * 850.0;
      const y = (Math.random() - 0.5 + (Math.random() - 0.5)) * zScale;

      const x = Math.cos(finalAngle) * r;
      const z = Math.sin(finalAngle) * r;

      positions[ptr * 3] = x;
      positions[ptr * 3 + 1] = y;
      positions[ptr * 3 + 2] = z;

      // Color based on stellar type in spiral arms:
      // - Young hot OB stars (blue-white)
      // - H II emission nebulae knots (pink/magenta)
      // - Intermediate solar-type stars (white-cream)
      const randType = Math.random();
      if (randType < 0.35) {
        // Luminous OB associations (young blue giants)
        colors[ptr * 3] = 0.72;
        colors[ptr * 3 + 1] = 0.84;
        colors[ptr * 3 + 2] = 1.0;
        sizes[ptr] = 2.0 + Math.random() * 2.2;
      } else if (randType < 0.50) {
        // H II star-forming regions (ionized hydrogen pink)
        colors[ptr * 3] = 1.0;
        colors[ptr * 3 + 1] = 0.55;
        colors[ptr * 3 + 2] = 0.78;
        sizes[ptr] = 2.4 + Math.random() * 2.0;
      } else {
        // Field Population I stars (white/yellow)
        colors[ptr * 3] = 0.95;
        colors[ptr * 3 + 1] = 0.94;
        colors[ptr * 3 + 2] = 0.90;
        sizes[ptr] = 1.2 + Math.random() * 1.5;
      }

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
          // Scale point size cleanly with distance across galactic depths
          gl_PointSize = clamp(size * (42000.0 / max(dist, 100.0)), 1.2, 8.5);
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

          // Luminous Gaussian point glow with soft celestial halo
          float core = exp(-d * d * 18.0);
          float halo = smoothstep(0.5, 0.05, d) * 0.25;
          float alpha = clamp(core + halo, 0.0, 1.0) * uOpacity;

          gl_FragColor = vec4(vColor * 1.45, alpha);
        }
      `,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geo, mat);
    points.name = 'galactic_spiral_stars';
    return points;
  }

  private createDustLanes(): THREE.Points {
    // Dark absorption dust motes along the inner edges of spiral arms
    const count = 4500;
    const positions = new Float32Array(count * 3);
    const R = this.config.radius * 0.85;
    const Rc = this.config.coreRadius * 0.9;
    const B = 1.0 / Math.tan(THREE.MathUtils.degToRad(this.config.armPitchAngleDeg));
    const armOffsets = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];

    for (let i = 0; i < count; i++) {
      const armIdx = i % 4;
      // Offset slightly to inner concave edge of arm
      const baseArmAngle = armOffsets[armIdx] - 0.14;
      const t = Math.pow(Math.random(), 0.8);
      const r = Rc + t * (R - Rc);
      const armAngle = baseArmAngle + B * Math.log(r / Rc);
      const disp = (Math.random() - 0.5) * (r * 0.12 + 200.0);
      const finalAngle = armAngle + (disp / r);

      const x = Math.cos(finalAngle) * r;
      const z = Math.sin(finalAngle) * r;
      const y = (Math.random() - 0.5) * 450.0;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: this.opacityUniform,
      },
      vertexShader: `
        uniform float uOpacity;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float dist = -mvPosition.z;
          gl_PointSize = clamp(2.8 * (24000.0 / max(dist, 100.0)), 1.5, 7.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float d = length(coord);
          if (d > 0.5) discard;
          // Subtly absorb background (dark dust reddish tint)
          float alpha = exp(-d * d * 18.0) * 0.40 * uOpacity;
          gl_FragColor = vec4(0.06, 0.03, 0.02, alpha);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geo, mat);
    points.name = 'galactic_dust_lanes';
    return points;
  }

  private createSunBeacon(): {
    beaconGroup: THREE.Group;
    reticleMesh: THREE.Line;
    pulseMesh: THREE.Mesh;
    sunPos: THREE.Vector3;
  } {
    const beaconGroup = new THREE.Group();
    beaconGroup.name = 'sun_orion_spur_beacon';

    // Place Sun in the Orion Spur at radius ~15,600 (scaled ~26,000 ly)
    // Angle in galactic plane: between Sagittarius and Perseus arm
    const sunR = this.config.sunDistance;
    const sunTheta = THREE.MathUtils.degToRad(72.0);
    const sunY = 55.0; // Sun sits slightly above the galactic midplane (~20 pc)

    const sunPos = new THREE.Vector3(
      Math.cos(sunTheta) * sunR,
      sunY,
      Math.sin(sunTheta) * sunR
    );

    beaconGroup.position.copy(sunPos);

    // 1. Concentric Target Reticle Ring
    const ringGeo = new THREE.BufferGeometry();
    const segs = 48;
    const ringPts: THREE.Vector3[] = [];
    const reticleRadius = 450.0;
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      ringPts.push(new THREE.Vector3(Math.cos(a) * reticleRadius, 0, Math.sin(a) * reticleRadius));
    }
    ringGeo.setFromPoints(ringPts);

    const reticleMat = new THREE.LineBasicMaterial({
      color: 0xffdb6b,
      transparent: true,
      opacity: 0.85,
    });
    const reticleMesh = new THREE.Line(ringGeo, reticleMat);
    beaconGroup.add(reticleMesh);

    // 2. Pulsing Golden Core Marker
    const pulseGeo = new THREE.SphereGeometry(180.0, 16, 12);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0xffeb88,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    beaconGroup.add(pulseMesh);

    // 3. Vertical Stalk connecting to galactic midplane
    const stalkGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -sunY, 0),
      new THREE.Vector3(0, 0, 0),
    ]);
    const stalkMat = new THREE.LineDashedMaterial({
      color: 0xffe072,
      dashSize: 30,
      gapSize: 20,
      transparent: true,
      opacity: 0.5,
    });
    const stalk = new THREE.Line(stalkGeo, stalkMat);
    stalk.computeLineDistances();
    beaconGroup.add(stalk);

    return { beaconGroup, reticleMesh, pulseMesh, sunPos };
  }

  /**
   * Updates opacity of 3D galaxy based on camera distance.
   * Smoothly crossfades in as camera pulls out past the solar system.
   */
  public setOpacity(opacity: number): void {
    const clamped = Math.max(0.0, Math.min(1.0, opacity));
    this.opacityUniform.value = clamped;
    this.group.visible = clamped > 0.005;

    // Scale beacon visibility
    if (this.sunReticleMesh) {
      (this.sunReticleMesh.material as THREE.LineBasicMaterial).opacity = clamped * 0.9;
    }
    if (this.sunPulseMesh) {
      (this.sunPulseMesh.material as THREE.MeshBasicMaterial).opacity = clamped * 0.95;
    }
  }

  public update(timeSec: number): void {
    this.timeUniform.value = timeSec;

    // Gentle pulsing effect for the Sun beacon
    if (this.sunPulseMesh && this.group.visible) {
      const pulse = 1.0 + 0.25 * Math.sin(timeSec * 3.5);
      this.sunPulseMesh.scale.set(pulse, pulse, pulse);
    }
    if (this.sunReticleMesh && this.group.visible) {
      this.sunReticleMesh.rotation.y = timeSec * 0.3;
    }
  }

  public dispose(): void {
    this.starPoints.geometry.dispose();
    (this.starPoints.material as THREE.Material).dispose();

    this.coreGlowMesh.geometry.dispose();
    (this.coreGlowMesh.material as THREE.Material).dispose();

    this.dustPoints.geometry.dispose();
    (this.dustPoints.material as THREE.Material).dispose();

    this.sunReticleMesh.geometry.dispose();
    (this.sunReticleMesh.material as THREE.Material).dispose();

    this.sunPulseMesh.geometry.dispose();
    (this.sunPulseMesh.material as THREE.Material).dispose();
  }
}
