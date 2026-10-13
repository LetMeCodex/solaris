import * as THREE from 'three';
import { CelestialBodyDefinition } from '../types/catalogue';
import { TexturePipeline } from './TexturePipeline';
import { SolarShader } from './SolarShader';
import { AtmosphereShader } from './AtmosphereShader';
import { EarthMaterial } from './EarthMaterial';
import { PlanetMaterial } from './PlanetMaterial';

export interface PlanetMeshBundle {
  definition: CelestialBodyDefinition;
  pivot: THREE.Group;          // Rotates around the Sun (orbital plane)
  bodyGroup: THREE.Group;      // Positioned along the orbit, tilted by axial tilt
  surfaceMesh: THREE.Mesh;     // Rotates on its own spin axis
  nightMesh?: THREE.Mesh;      // Earth's night city lights
  cloudMesh?: THREE.Mesh;      // Earth's independent rotating clouds
  atmosphereMesh?: THREE.Mesh; // Rayleigh atmospheric limb glow
  ringMesh?: THREE.Mesh;       // Saturn's ring system
  glowMeshes?: THREE.Mesh[];   // Sun corona halos
  prominencesGroup?: THREE.Group; // Solar prominence loops
  orbitLine?: THREE.Line;      // Visual Keplerian orbital path
  visualRadius: number;
  orbitalDistance: number;
}

export class PlanetFactory {
  /**
   * Exploration scale visual sizing.
   * Compresses the Sun's 695,700 km to a prominent star anchor,
   * while magnifying terrestrial worlds so they remain legible without clipping.
   */
  public static getVisualRadius(body: CelestialBodyDefinition): number {
    if (body.category === 'star') {
      return 14.0; // Sun visual radius
    }
    if (body.category === 'moon') {
      const km = body.physical.meanRadiusKm;
      if (km < 100) return 0.22;
      if (km < 600) return 0.45;
      if (km < 1500) return 0.70;
      return 0.95; // Large moons (Ganymede, Titan, Callisto, Io, Moon, Europa, Triton)
    }
    if (body.category === 'dwarf_planet') {
      return body.name === 'Pluto' ? 1.1 : 0.75;
    }
    if (body.category === 'asteroid') {
      const km = body.physical.meanRadiusKm;
      if (km < 5) return 0.20;
      if (km < 50) return 0.30;
      return 0.55; // Ceres, Vesta, Pallas, Hygiea
    }
    // Major planets
    const km = body.physical.meanRadiusKm;
    if (km < 3000) return 1.6;        // Mercury
    if (km < 7000) return 2.8;        // Venus, Earth, Mars
    if (km < 30000) return 5.5;       // Uranus, Neptune
    return 8.2;                       // Jupiter, Saturn
  }

  /**
   * Exploration scale distance mapping.
   * Compresses astronomical AU distances (0.38 to 30 AU) into a navigable 3D range.
   */
  public static getVisualDistance(body: CelestialBodyDefinition): number {
    if (body.orderFromSun === 0) return 0;
    const au = body.orbit.semiMajorAxisAU;
    return 30.0 + Math.sqrt(au) * 65.0;
  }

  public static createPlanet(body: CelestialBodyDefinition): PlanetMeshBundle {
    const pivot = new THREE.Group();
    pivot.name = `orbit_pivot_${body.name}`;

    const bodyGroup = new THREE.Group();
    bodyGroup.name = `body_group_${body.name}`;
    pivot.add(bodyGroup);

    const visualRadius = this.getVisualRadius(body);
    const orbitalDistance = this.getVisualDistance(body);

    // Initial position along the orbital circle
    bodyGroup.position.set(orbitalDistance, 0, 0);

    // Apply planetary axial tilt
    const tiltRad = THREE.MathUtils.degToRad(body.physical.axialTiltDeg || 0);
    bodyGroup.rotation.z = tiltRad;

    // Oblateness scaling (flattening f = (a - b) / a)
    const flattening = body.physical.flattening || 0;
    const polarScale = 1.0 - flattening;

    // Create unit surface sphere (R = 1.0)
    const isSmallBody = body.category === 'moon' || body.category === 'asteroid';
    const sphereGeo = new THREE.SphereGeometry(
      1.0,
      isSmallBody ? 36 : 64,
      isSmallBody ? 24 : 48
    );

    // Irregular asteroid/minor moon mesh deformation for realistic non-spherical shape
    if (body.category === 'asteroid' || (body.category === 'moon' && body.physical.meanRadiusKm < 200)) {
      const pos = sphereGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vy = pos.getY(i);
        const vz = pos.getZ(i);
        // Deterministic low-frequency perturbation on unit sphere
        const noise = 1.0 + 0.18 * Math.sin(vx * 4.0) * Math.cos(vy * 4.0 + vz * 3.0);
        pos.setXYZ(i, vx * noise, vy * noise, vz * noise);
      }
      sphereGeo.computeVertexNormals();
    }

    const texPipeline = TexturePipeline.getInstance();
    const textures = texPipeline.getPlanetTextures(body.name);

    let surfaceMaterial: THREE.Material;
    let nightMesh: THREE.Mesh | undefined;
    let cloudMesh: THREE.Mesh | undefined;
    let atmosphereMesh: THREE.Mesh | undefined;
    let ringMesh: THREE.Mesh | undefined;
    let prominencesGroup: THREE.Group | undefined;
    const glowMeshes: THREE.Mesh[] = [];

    if (body.category === 'star') {
      // 1. Photosphere with convection boiling, granulation & Eddington limb darkening
      surfaceMaterial = SolarShader.createPhotosphereMaterial(textures.map);

      // 2. Exponential Corona (true exponential decay, dynamic streamers, zero opaque shell)
      const coronaGeo = new THREE.SphereGeometry(2.45, 64, 48);
      const coronaMat = SolarShader.createCoronaMaterial(visualRadius);
      const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
      coronaMesh.name = 'sun_corona';
      coronaMesh.scale.set(visualRadius, visualRadius, visualRadius);
      bodyGroup.add(coronaMesh);
      glowMeshes.push(coronaMesh);

      // 3. Dynamic Magnetic Prominence Loops (H-alpha 656.3 nm plasma)
      prominencesGroup = SolarShader.createProminencesGroup(visualRadius);
      bodyGroup.add(prominencesGroup);
    } else if (body.name === 'Earth') {
      // Earth: PBR Surface with Ocean Specular Mask, Normal Mapping & Night Lights
      surfaceMaterial = EarthMaterial.createSurfaceMaterial(
        textures.map,
        textures.normalMap,
        textures.nightMap
      );

      // Independent Rotating Clouds with Directional Shading & Soft Translucency
      if (textures.cloudsMap) {
        const cloudGeo = new THREE.SphereGeometry(1.016, 64, 48);
        const cloudMat = EarthMaterial.createCloudMaterial(textures.cloudsMap);
        cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
        cloudMesh.name = 'earth_clouds';
        cloudMesh.renderOrder = 2;
        cloudMesh.scale.set(visualRadius, visualRadius, visualRadius);
        bodyGroup.add(cloudMesh);
      }

      // Physically Grounded Rayleigh & Mie Scattering Atmosphere (zero dark-side neon rim)
      const atmoMat = AtmosphereShader.createAtmosphereMaterial('Earth');
      if (atmoMat) {
        const atmoGeo = new THREE.SphereGeometry(1.022, 64, 48);
        atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
        atmosphereMesh.name = 'earth_atmosphere';
        atmosphereMesh.renderOrder = 3;
        atmosphereMesh.scale.set(visualRadius, visualRadius, visualRadius);
        bodyGroup.add(atmosphereMesh);
      }
    } else {
      // All other celestial bodies (Jupiter, Saturn, Uranus, Neptune, Mars, Venus, Mercury, Moons, Asteroids)
      surfaceMaterial = PlanetMaterial.createMaterial({
        name: body.name,
        category: body.category,
        map: textures.map,
        normalMap: textures.normalMap,
      });

      // Atmospheric limb scattering for worlds with substantial atmospheres (Venus, Mars, Uranus, Neptune)
      const atmoMat = AtmosphereShader.createAtmosphereMaterial(body.name);
      if (atmoMat) {
        const atmoGeo = new THREE.SphereGeometry(1.018, 48, 36);
        atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
        atmosphereMesh.name = `${body.name.toLowerCase()}_atmosphere`;
        atmosphereMesh.renderOrder = 3;
        atmosphereMesh.scale.set(visualRadius, visualRadius, visualRadius);
        bodyGroup.add(atmosphereMesh);
      }
    }

    const surfaceMesh = new THREE.Mesh(sphereGeo, surfaceMaterial);
    surfaceMesh.name = `surface_${body.name}`;
    surfaceMesh.castShadow = body.category !== 'star';
    surfaceMesh.receiveShadow = body.category !== 'star';
    // Single-application scale from unit sphere
    surfaceMesh.scale.set(visualRadius, visualRadius * polarScale, visualRadius);
    bodyGroup.add(surfaceMesh);

    // --- SATURN ANNULAR RING SYSTEM WITH PLANETARY SHADOW ---
    if (body.name === 'Saturn') {
      const innerR = 1.32;
      const outerR = 2.65;
      const ringGeo = new THREE.RingGeometry(innerR, outerR, 128, 8);
      
      // Remap UVs so U goes radially from inner to outer radius
      const pos = ringGeo.attributes.position;
      const uvs = ringGeo.attributes.uv;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const r = Math.sqrt(x * x + y * y);
        const u = (r - innerR) / (outerR - innerR);
        uvs.setXY(i, u, 0.5);
      }
      uvs.needsUpdate = true;

      const ringTex = textures.ringAlphaMap || textures.map;
      const ringMat = new THREE.ShaderMaterial({
        uniforms: {
          ringMap: { value: ringTex },
          saturnCenter: { value: new THREE.Vector3() },
          saturnRadius: { value: visualRadius },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vWorldPosition;
          varying vec3 vWorldNormal;
          void main() {
            vUv = uv;
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPos.xyz;
            vWorldNormal = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `,
        fragmentShader: `
          uniform sampler2D ringMap;
          uniform vec3 saturnCenter;
          uniform float saturnRadius;
          varying vec2 vUv;
          varying vec3 vWorldPosition;
          varying vec3 vWorldNormal;

          void main() {
            vec4 ringTexCol = texture2D(ringMap, vUv);
            if (ringTexCol.a < 0.02) discard;

            // Sun sits at origin (0, 0, 0) in world coordinates
            vec3 sunDir = normalize(-vWorldPosition);
            vec3 normal = normalize(vWorldNormal);

            // Double-sided lighting: sunlight illuminates ring from both top and bottom
            float lightDot = max(0.12, abs(dot(normal, sunDir)));

            // Analytical spherical shadow cast by Saturn's globe onto its rings:
            vec3 saturnToSun = normalize(-saturnCenter);
            vec3 d = vWorldPosition - saturnCenter;
            float t = dot(d, saturnToSun);

            float shadowFactor = 1.0;
            // The shadow falls behind Saturn on the anti-sunward side (t < 0)
            if (t < 0.0) {
              vec3 d_perp = d - t * saturnToSun;
              float distToAxis = length(d_perp);
              // Soft penumbra edge at Saturn's limb
              shadowFactor = smoothstep(saturnRadius * 0.985, saturnRadius * 1.015, distToAxis);
            }

            // Direct sunlight + soft ambient for dark-side silhouette visibility
            vec3 directIllum = vec3(1.0, 0.97, 0.90) * 1.85 * lightDot * shadowFactor;
            vec3 ambientIllum = vec3(0.045, 0.048, 0.06);

            vec3 color = ringTexCol.rgb * (directIllum + ambientIllum);
            gl_FragColor = vec4(color, ringTexCol.a * 0.96);
          }
        `,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
      });

      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.name = 'saturn_rings';
      // Rotate ring into Saturn's equatorial plane
      ringMesh.rotation.x = Math.PI * 0.5;
      ringMesh.renderOrder = 3;
      ringMesh.scale.set(visualRadius, visualRadius, visualRadius);
      bodyGroup.add(ringMesh);
    }

    // --- ORBITAL GUIDE TRAIL ---
    let orbitLine: THREE.Line | undefined;
    if (orbitalDistance > 0) {
      const points: THREE.Vector3[] = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(
          Math.cos(theta) * orbitalDistance,
          0,
          Math.sin(theta) * orbitalDistance
        ));
      }
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
      const orbitMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(body.physical.colorHex || '#555566'),
        transparent: true,
        opacity: 0.22,
      });
      orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orbitLine.name = `orbit_line_${body.name}`;
      pivot.add(orbitLine);
    }

    return {
      definition: body,
      pivot,
      bodyGroup,
      surfaceMesh,
      nightMesh,
      cloudMesh,
      atmosphereMesh,
      ringMesh,
      glowMeshes: glowMeshes.length > 0 ? glowMeshes : undefined,
      prominencesGroup,
      orbitLine,
      visualRadius,
      orbitalDistance,
    };
  }
}
