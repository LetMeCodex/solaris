import * as THREE from 'three';
import { NebulaSky } from './NebulaSky';
import { COSMIC_SCALE } from './Scale';
import { MilkyWayGalaxy } from './MilkyWayGalaxy';
import { MilkyWayVolume } from './MilkyWayVolume';
import { TravelParticles } from './TravelParticles';
import { CoordinateFrames } from '../astronomy/CoordinateFrames';
import { CatalogueStars } from './CatalogueStars';
import { CONSTELLATION_EDGES } from '../data/constellations';

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


export class Starfield {
  public group: THREE.Group = new THREE.Group();
  private celestialGroup: THREE.Group = new THREE.Group();
  /**
   * Everything beyond the Solar System, drawn on stylised scales laid out for a system ~700 units
   * across, enlarged by COSMIC_SCALE so the true-scale planets fit inside (see Scale.ts).
   */
  public cosmos: THREE.Group = new THREE.Group();
  private pointsMesh?: THREE.Points;
  public catalogueStars?: CatalogueStars;
  private localInterstellarStars?: THREE.Points;
  private constellationLines?: THREE.LineSegments;
  private stardustMesh?: THREE.Points;
  public milkyWay: MilkyWayVolume;
  public externalGalaxy: MilkyWayGalaxy;
  public travelParticles: TravelParticles;
  public nebulae: NebulaSky;
  public isLoaded: boolean = false;

  // Sphere radius for stars (× COSMIC_SCALE in space, see celestialGroup)
  public static readonly SPHERE_RADIUS = 8500.0;
  /** Side of the box of dust motes tiled around the camera (render units). */
  private static readonly DUST_BOX = 640.0;
  private dustWrap = { value: new THREE.Vector3() };

  // 3D local-neighbourhood stars (< 120 pc): radial offset and parsec scale (render units)
  public static readonly LOCAL_STAR_OFFSET = 700.0;
  private static readonly CONSTELLATION_OPACITY = 0.38;
  public static readonly LOCAL_UNITS_PER_PC = 38.0;
  private localStarsOpacity: { value: number } = { value: 0.0 };

  constructor() {
    this.group.name = 'starfield_hipparcos';
    this.group.add(this.celestialGroup);
    this.celestialGroup.name = 'celestial_infinite_sphere';
    this.celestialGroup.scale.setScalar(COSMIC_SCALE);
    this.cosmos.name = 'cosmos_beyond_the_solar_system';
    this.cosmos.scale.setScalar(COSMIC_SCALE);
    this.group.add(this.cosmos);

    this.build3DCosmicStardust();

    // Nebulae on the sky: just beyond the stars, which shine through them
    this.nebulae = new NebulaSky(Starfield.SPHERE_RADIUS * 1.03);
    this.celestialGroup.add(this.nebulae.group);

    // The Milky Way itself: a 3D volume of stars, glow and dust around the Solar System
    // (real galactic orientation, Sun at the origin) that the camera can fly out of
    this.milkyWay = new MilkyWayVolume();
    this.milkyWay.unitScale = COSMIC_SCALE;
    this.cosmos.add(this.milkyWay.group);

    // External 3D Milky Way Galaxy model
    // (oriented to the real galactic frame and offset so its Sun locator sits at the scene origin)
    this.externalGalaxy = new MilkyWayGalaxy();
    this.cosmos.add(this.externalGalaxy.group);
    // The black hole keeps its own (r_s-based) size in world units: every close-up, the horizon
    // world and the infall were built for it. Only its position moves out with the galaxy.
    this.externalGalaxy.sagittariusAStar.group.scale.setScalar(1 / COSMIC_SCALE);

    // Velocity-aware travel streak particles
    this.travelParticles = new TravelParticles();
    this.group.add(this.travelParticles.mesh);

    this.loadCatalog();
  }

  private build3DCosmicStardust(): void {
    const count = 800; // Rare, delicate motes that give subtle 3D depth without cluttering overview
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);

    const B = Starfield.DUST_BOX;
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * B;
      positions[i * 3 + 1] = (Math.random() - 0.5) * B;
      positions[i * 3 + 2] = (Math.random() - 0.5) * B;

      const colorType = Math.random();
      if (colorType < 0.50) {
        // Subtle diamond starlight
        colors[i * 3] = 0.90;
        colors[i * 3 + 1] = 0.92;
        colors[i * 3 + 2] = 0.98;
      } else if (colorType < 0.80) {
        // Warm solar stardust
        colors[i * 3] = 0.98;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 0.60;
      } else {
        // Faint deep space ice cyan
        colors[i * 3] = 0.65;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 0.98;
      }

      scales[i] = 1.0 + Math.random() * 1.5;
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
        uWrap: this.dustWrap,
        uBox: { value: Starfield.DUST_BOX },
      },
      vertexShader: `
        attribute float aScale;
        attribute float aPhase;
        uniform float time;
        uniform vec3 uWrap;
        uniform float uBox;
        varying vec3 vColor;
        varying float vTwinkle;

        void main() {
          vColor = color;
          // No scintillation in vacuum: twinkling is an atmospheric effect
          vTwinkle = 0.8;
          // The mesh rides with the camera; wrapping by the camera's position keeps each mote fixed
          // in space, so the field is endless and slides past with true parallax
          vec3 p = mod(position - uWrap + 0.5 * uBox, uBox) - 0.5 * uBox;
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          float dist = -mvPosition.z;
          // Distance falloff: motes naturally vanish beyond 300 units so overview stays clean
          float fade = clamp(1.0 - (dist - 100.0) / 220.0, 0.0, 1.0);
          gl_PointSize = clamp(aScale * (120.0 / max(dist, 10.0)) * fade, 0.0, 3.5);
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

          float core = exp(-d * d * 26.0);
          float alpha = core * vTwinkle * 0.40;

          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.stardustMesh = new THREE.Points(geo, mat);
    this.stardustMesh.frustumCulled = false;
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
    // Every catalogue star, drawn from its measured magnitude and colour (see CatalogueStars)
    this.catalogueStars = new CatalogueStars(data.stars, Starfield.SPHERE_RADIUS);
    this.pointsMesh = this.catalogueStars.points;
    this.celestialGroup.add(this.pointsMesh);

    // Point sprite for the 3D neighbourhood stars (soft core, faint spikes on the brightest)
    const fragmentShader = `
      varying vec3 vColor;
      varying float vBrightness;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        float core = exp(-dist * dist * 40.0);
        float halo = smoothstep(0.5, 0.05, dist) * 0.12;

        float spikes = 0.0;
        if (vBrightness > 2.4) {
          float crossX = exp(-abs(coord.y) * 45.0) * max(0.0, 1.0 - abs(coord.x) * 2.0);
          float crossY = exp(-abs(coord.x) * 45.0) * max(0.0, 1.0 - abs(coord.y) * 2.0);
          spikes = max(crossX, crossY) * 0.30;
        }

        float alpha = clamp(core + halo + spikes, 0.0, 1.0) * clamp(vBrightness * 0.20, 0.12, 0.60);
        gl_FragColor = vec4(vColor, alpha);
      }
    `;

    // 3D Local Interstellar Neighborhood: real stars with measured Hipparcos distance (distancePc < 120 pc)
    const localStars = data.stars.filter((s) => s[6] !== null && s[6]! > 0 && s[6]! < 120);
    if (localStars.length > 0) {
      const localPos = new Float32Array(localStars.length * 3);
      const localCol = new Float32Array(localStars.length * 3);
      const localSizes = new Float32Array(localStars.length);

      for (let j = 0; j < localStars.length; j++) {
        const s = localStars[j];
        // Radial placement: LOCAL_STAR_OFFSET + 38 units per parsec, so even Alpha Centauri sits
        // beyond the exploration-scale Solar System (Pluto's aphelion ≈ 680 units) while relative
        // distances between stars are preserved. Directions are exact (ICRF → ecliptic).
        const distUnits = Starfield.LOCAL_STAR_OFFSET + (s[6] as number) * Starfield.LOCAL_UNITS_PER_PC;
        const p = CoordinateFrames.icrfToThree([s[1], s[2], s[3]]);
        localPos[j * 3] = p[0] * distUnits;
        localPos[j * 3 + 1] = p[1] * distUnits;
        localPos[j * 3 + 2] = p[2] * distUnits;

        const col = this.bvToRGB(s[5], s[8]);
        localCol[j * 3] = col.r;
        localCol[j * 3 + 1] = col.g;
        localCol[j * 3 + 2] = col.b;

        const vmag = s[4];
        localSizes[j] = Math.max(0.8, 2.6 - 0.30 * vmag);
      }

      const localGeo = new THREE.BufferGeometry();
      localGeo.setAttribute('position', new THREE.BufferAttribute(localPos, 3));
      localGeo.setAttribute('color', new THREE.BufferAttribute(localCol, 3));
      localGeo.setAttribute('size', new THREE.BufferAttribute(localSizes, 1));

      const localMat = new THREE.ShaderMaterial({
        vertexShader: `
          attribute float size;
          varying vec3 vColor;
          varying float vBrightness;

          void main() {
            vColor = color;
            vBrightness = size;
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            float dist = -mvPos.z;
            gl_PointSize = clamp(size * (750.0 / max(dist, 10.0)), 1.0, 5.5);
            gl_Position = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: 'uniform float uOpacity;\n' + fragmentShader.replace(
          'gl_FragColor = vec4(vColor, alpha);',
          'gl_FragColor = vec4(vColor, alpha * uOpacity);'
        ),
        uniforms: { uOpacity: this.localStarsOpacity },
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      this.localInterstellarStars = new THREE.Points(localGeo, localMat);
      this.localInterstellarStars.visible = false;
      this.localInterstellarStars.name = 'local_interstellar_3d_stars';
      this.localInterstellarStars.renderOrder = 1;
      this.cosmos.add(this.localInterstellarStars);
    }
  }

  private buildConstellations(data: RawStarHeader): void {
    const starMap = new Map<number, [number, number, number]>();
    const R = Starfield.SPHERE_RADIUS * 0.998;

    for (const star of data.stars) {
      const p = CoordinateFrames.icrfToThree([star[1], star[2], star[3]]);
      starMap.set(star[0], [p[0] * R, p[1] * R, p[2] * R]);
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
      opacity: Starfield.CONSTELLATION_OPACITY,
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

  /** Surface view: shrink the sky sphere inside a short far plane and hide in-space effects. */
  private groundMode = false;

  public setGroundMode(on: boolean, skyRadius: number = 3): void {
    this.groundMode = on;
    this.celestialGroup.scale.setScalar(on ? skyRadius / (Starfield.SPHERE_RADIUS * 1.06) : COSMIC_SCALE);
    // The galaxy is hidden on the ground, but the Milky Way sky is drawn from the Sun's vantage on a
    // shell around the camera at unit scale
    this.cosmos.scale.setScalar(on ? 1 : COSMIC_SCALE);
    this.milkyWay.unitScale = on ? 1 : COSMIC_SCALE;
    if (this.stardustMesh) this.stardustMesh.visible = !on;
    this.travelParticles.mesh.visible = !on;
    this.externalGalaxy.group.visible = !on;
    this.milkyWay.setGroundMode(on, skyRadius);
  }

  public update(
    cameraPosition: THREE.Vector3,
    deltaSec: number,
    cameraVelocity?: THREE.Vector3,
    zoomRate?: number,
    camera?: THREE.Camera,
    viewportHeightPx: number = 1000
  ): void {
    // Keep infinite celestial sphere and real Hipparcos distant stars centered on camera
    this.celestialGroup.position.copy(cameraPosition);
    if (this.stardustMesh) {
      this.stardustMesh.position.copy(cameraPosition);
      const B = Starfield.DUST_BOX;
      const m = (v: number) => v - Math.floor(v / B) * B;
      this.dustWrap.value.set(m(cameraPosition.x), m(cameraPosition.y), m(cameraPosition.z));
    }

    // Distance from camera to Solar System barycenter (0, 0, 0)
    const distToSun = cameraPosition.length();

    // Proximity to Galactic Center / Sagittarius A*
    const galCenterPos = this.externalGalaxy.getGalacticCenterWorldPosition();
    const distToGalCenter = cameraPosition.distanceTo(galCenterPos);

    // The 3D Milky Way volume is always there: inside the Solar System it is the band across the
    // sky, further out the camera leaves the disk and sees it whole.
    if (camera) this.milkyWay.update(camera, viewportHeightPx);

    // The face-on disk artwork, bulge and satellites of the galaxy model only fade in once the
    // camera is well outside the local disk (a flat plane seen from inside would look wrong), and
    // always when inspecting the Galactic Centre / Sagittarius A*
    const K = COSMIC_SCALE;
    const tSun = THREE.MathUtils.clamp((distToSun - 20000.0 * K) / (30000.0 * K), 0.0, 1.0);
    const tGal = distToGalCenter < 8000.0 * K ? THREE.MathUtils.clamp((8000.0 * K - distToGalCenter) / (4000.0 * K), 0.0, 1.0) : 0.0;
    const t = Math.max(tSun, tGal);
    const smoothT = t * t * (3.0 - 2.0 * t);
    this.externalGalaxy.setOpacity(smoothT);

    // Constellation figures and the nebulae on the sky only make sense from the Sun's vantage point
    const leaving = Math.max(THREE.MathUtils.smoothstep(distToSun, 3500.0 * K, 22000.0 * K), smoothT);
    this.nebulae.update(deltaSec, cameraVelocity || new THREE.Vector3(), this.groundMode ? 0 : leaving, zoomRate || 0);
    if (this.constellationLines) {
      (this.constellationLines.material as THREE.LineBasicMaterial).opacity = Starfield.CONSTELLATION_OPACITY * (1.0 - leaving);
    }

    // 3D neighbourhood stars only appear once the whole Solar System is in view, and hand over
    // to the galaxy model as it fades in (the two use different stylised scales).
    if (this.localInterstellarStars) {
      const fadeIn = THREE.MathUtils.smoothstep(distToSun, 700.0 * K, 1600.0 * K);
      const fadeOut = 1.0 - THREE.MathUtils.smoothstep(distToSun, 9000.0 * K, 20000.0 * K);
      const o = fadeIn * fadeOut;
      this.localStarsOpacity.value = o;
      this.localInterstellarStars.visible = o > 0.005;
    }

    this.externalGalaxy.update(performance.now() * 0.001, camera);

    this.catalogueStars?.update(performance.now() * 0.001, cameraVelocity || new THREE.Vector3(), !this.groundMode);

    if (this.groundMode) return;
    // Update velocity-aware travel streak particles
    this.travelParticles.update(
      cameraPosition,
      cameraVelocity || new THREE.Vector3(),
      zoomRate || 0,
      deltaSec
    );

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
    this.nebulae.dispose();
    this.externalGalaxy.dispose();
    this.travelParticles.dispose();
    if (this.localInterstellarStars) {
      this.localInterstellarStars.geometry.dispose();
      (this.localInterstellarStars.material as THREE.Material).dispose();
    }
    this.milkyWay.dispose();
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
  }
}
