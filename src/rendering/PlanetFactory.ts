import * as THREE from 'three';
import { CelestialBodyDefinition } from '../types/catalogue';
import { TexturePipeline } from './TexturePipeline';

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
    const glowMeshes: THREE.Mesh[] = [];

    if (body.category === 'star') {
      // Sun: Photosphere with high-luminance emission
      surfaceMaterial = new THREE.MeshBasicMaterial({
        map: textures.map,
        color: 0xffffff,
      });
    } else {
      // PBR Standard Material
      const roughness = body.name === 'Earth' ? 0.6 :
                        (body.name === 'Europa' || body.name === 'Enceladus' ? 0.35 :
                        (body.name === 'Venus' ? 0.85 : 0.8));
      const metalness = body.name === 'Psyche' ? 0.6 : 0.05;

      const matParams: THREE.MeshStandardMaterialParameters = {
        map: textures.map,
        roughness: roughness,
        metalness: metalness,
      };

      if (textures.normalMap) {
        matParams.normalMap = textures.normalMap;
        matParams.normalScale = new THREE.Vector2(0.85, 0.85);
      }

      surfaceMaterial = new THREE.MeshStandardMaterial(matParams);
    }

    const surfaceMesh = new THREE.Mesh(sphereGeo, surfaceMaterial);
    surfaceMesh.name = `surface_${body.name}`;
    surfaceMesh.castShadow = body.category !== 'star';
    surfaceMesh.receiveShadow = body.category !== 'star';
    // Single-application scale from unit sphere
    surfaceMesh.scale.set(visualRadius, visualRadius * polarScale, visualRadius);
    bodyGroup.add(surfaceMesh);

    // --- SUN CORONA HALO GLOW ---
    if (body.category === 'star') {
      const innerGlowGeo = new THREE.SphereGeometry(1.06, 32, 32);
      const innerGlowMat = new THREE.MeshBasicMaterial({
        color: 0xffaa33,
        transparent: true,
        opacity: 0.38,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      const innerMesh = new THREE.Mesh(innerGlowGeo, innerGlowMat);
      innerMesh.scale.set(visualRadius, visualRadius, visualRadius);
      bodyGroup.add(innerMesh);
      glowMeshes.push(innerMesh);

      const outerGlowGeo = new THREE.SphereGeometry(1.35, 32, 32);
      const outerGlowMat = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      const outerMesh = new THREE.Mesh(outerGlowGeo, outerGlowMat);
      outerMesh.scale.set(visualRadius, visualRadius, visualRadius);
      bodyGroup.add(outerMesh);
      glowMeshes.push(outerMesh);
    }

    // --- EARTH NIGHT LIGHTS, CLOUDS & RAYLEIGH ATMOSPHERE ---
    if (body.name === 'Earth') {
      // Night-side city lights
      if (textures.nightMap) {
        const nightGeo = new THREE.SphereGeometry(1.002, 64, 48);
        const nightMat = new THREE.ShaderMaterial({
          uniforms: {
            nightMap: { value: textures.nightMap },
          },
          vertexShader: `
            varying vec2 vUv;
            varying vec3 vWorldNormal;
            varying vec3 vWorldPosition;
            void main() {
              vUv = uv;
              vWorldNormal = normalize(mat3(modelMatrix) * normal);
              vec4 worldPos = modelMatrix * vec4(position, 1.0);
              vWorldPosition = worldPos.xyz;
              gl_Position = projectionMatrix * viewMatrix * worldPos;
            }
          `,
          fragmentShader: `
            uniform sampler2D nightMap;
            varying vec2 vUv;
            varying vec3 vWorldNormal;
            varying vec3 vWorldPosition;
            void main() {
              vec3 sunDir = normalize(-vWorldPosition);
              float sunDot = dot(vWorldNormal, sunDir);
              float nightFactor = 1.0 - smoothstep(-0.20, 0.05, sunDot);
              vec4 cityCol = texture2D(nightMap, vUv);
              gl_FragColor = vec4(cityCol.rgb * 1.35 * nightFactor, 1.0);
            }
          `,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        });
        nightMesh = new THREE.Mesh(nightGeo, nightMat);
        nightMesh.name = 'earth_night_lights';
        nightMesh.renderOrder = 1;
        nightMesh.scale.set(visualRadius, visualRadius * polarScale, visualRadius);
        bodyGroup.add(nightMesh);
      }

      // Cloud shell with luminance transparency mask
      if (textures.cloudsMap) {
        const cloudGeo = new THREE.SphereGeometry(1.016, 64, 48);
        const cloudMat = new THREE.MeshStandardMaterial({
          map: textures.cloudsMap,
          alphaMap: textures.cloudsMap,
          transparent: true,
          opacity: 0.88,
          blending: THREE.NormalBlending,
          roughness: 0.9,
          depthWrite: false,
        });
        cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
        cloudMesh.name = 'earth_clouds';
        cloudMesh.renderOrder = 2;
        cloudMesh.scale.set(visualRadius, visualRadius, visualRadius);
        bodyGroup.add(cloudMesh);
      }

      // Rayleigh atmospheric rim glow
      const atmoGeo = new THREE.SphereGeometry(1.034, 48, 36);
      const atmoMat = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPos.xyz;
            gl_Position = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            float rim = 1.0 - clamp(abs(dot(normal, viewDir)), 0.0, 1.0);
            float intensity = pow(rim, 3.2) * 1.35;
            vec3 atmoColor = vec3(0.28, 0.58, 1.0); // Azure Rayleigh blue
            gl_FragColor = vec4(atmoColor, intensity);
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      });
      atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
      atmosphereMesh.name = 'earth_atmosphere';
      atmosphereMesh.renderOrder = 3;
      atmosphereMesh.scale.set(visualRadius, visualRadius, visualRadius);
      bodyGroup.add(atmosphereMesh);
    }

    // --- MARS DELICATE ATMOSPHERIC RIM ---
    if (body.name === 'Mars') {
      const atmoGeo = new THREE.SphereGeometry(1.025, 48, 36);
      const atmoMat = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPos.xyz;
            gl_Position = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            float rim = 1.0 - clamp(abs(dot(normal, viewDir)), 0.0, 1.0);
            float intensity = pow(rim, 3.6) * 0.95;
            vec3 atmoColor = vec3(0.85, 0.45, 0.28); // Amber-tinted thin CO2 haze
            gl_FragColor = vec4(atmoColor, intensity);
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      });
      atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
      atmosphereMesh.name = 'mars_atmosphere';
      atmosphereMesh.renderOrder = 3;
      atmosphereMesh.scale.set(visualRadius, visualRadius, visualRadius);
      bodyGroup.add(atmosphereMesh);
    }

    // --- SATURN ANNULAR RING SYSTEM ---
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
      const ringMat = new THREE.MeshStandardMaterial({
        map: ringTex,
        alphaMap: ringTex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
        roughness: 0.45,
        metalness: 0.1,
        depthWrite: false,
      });

      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.name = 'saturn_rings';
      // Rotate ring into Saturn's equatorial plane
      ringMesh.rotation.x = Math.PI * 0.5;
      ringMesh.renderOrder = 3;
      ringMesh.receiveShadow = true;
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
      orbitLine,
      visualRadius,
      orbitalDistance,
    };
  }
}
