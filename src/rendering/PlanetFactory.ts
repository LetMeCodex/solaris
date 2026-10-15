import * as THREE from 'three';
import { CelestialBodyDefinition } from '../types/catalogue';
import { TexturePipeline } from './TexturePipeline';
import { SolarShader } from './SolarShader';
import { AtmosphereShader, ATMOSPHERE_CONFIGS } from './AtmosphereShader';
import { EarthMaterial } from './EarthMaterial';
import { PlanetMaterial } from './PlanetMaterial';
import { trueRadius } from './Scale';
import { SUN_WORLD } from './RenderOrigin';

export interface PlanetMeshBundle {
  definition: CelestialBodyDefinition;
  bodyGroup: THREE.Group;      // Positioned along the orbit, oriented to the body's equatorial frame
  surfaceMesh: THREE.Mesh;     // Rotates on its own spin axis
  nightMesh?: THREE.Mesh;      // Earth's night city lights
  cloudMesh?: THREE.Mesh;      // Earth's independent rotating clouds
  atmosphereMesh?: THREE.Mesh; // Rayleigh atmospheric limb glow
  ringMesh?: THREE.Mesh;       // Saturn's ring system
  glowMeshes?: THREE.Mesh[];   // Sun corona halos
  prominencesGroup?: THREE.Group; // Solar prominence loops
  visualRadius: number;
}

export class PlanetFactory {
  /** True globe radius in render units (see Scale.ts). */
  public static getVisualRadius(body: CelestialBodyDefinition): number {
    return trueRadius(body);
  }

  /**
   * Small moons and asteroids are not round. The unit sphere is stretched to the body's measured
   * triaxial proportions (when known) and given a lumpy, cratered relief seeded by its name, so no
   * two look alike.
   */
  private static smallBodyGeometries = new Map<string, THREE.BufferGeometry>();

  /**
   * Shapes are shared: bodies with measured axes get their own, the hundreds of kilometre-sized
   * irregular moons draw from 24 sculpted variants (memory stays flat however many moons exist).
   */
  private static smallBodyGeometry(body: CelestialBodyDefinition): THREE.BufferGeometry {
    let h = 0;
    for (const ch of body.name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const sizeClass = body.physical.meanRadiusKm < 30 ? 's' : body.physical.meanRadiusKm < 120 ? 'm' : 'l';
    const key = body.physical.shapeAxesKm ? `axes:${body.name}` : `v${h % 24}${sizeClass}`;
    let geo = this.smallBodyGeometries.get(key);
    if (!geo) {
      const g = new THREE.SphereGeometry(1.0, 56, 36);
      this.shapeSmallBody(g, body, key);
      geo = g;
      this.smallBodyGeometries.set(key, geo);
    }
    return geo;
  }

  private static shapeSmallBody(geo: THREE.SphereGeometry, body: CelestialBodyDefinition, key: string): void {
    let seed = 0;
    for (const ch of key) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const r = body.physical.meanRadiusKm;
    const axes = body.physical.shapeAxesKm;
    // Measured axes, else a typical elongation for a body this size (smaller → lumpier)
    const elong = r < 30 ? 0.28 : r < 120 ? 0.18 : 0.08;
    let ax = 1 + elong * rnd();
    let ay = 1 - elong * 0.6 * rnd();
    let az = 1 - elong * 0.3 * rnd();
    if (axes) {
      const m = Math.cbrt(axes[0] * axes[1] * axes[2]);
      ax = axes[0] / m;
      az = axes[1] / m;
      ay = axes[2] / m; // shortest axis along the spin pole (+Y)
    } else {
      const m = Math.cbrt(ax * ay * az);
      ax /= m;
      ay /= m;
      az /= m;
    }
    // Low-order lumps plus a scatter of shallow craters
    const lumps = Array.from({ length: 5 }, () => ({
      d: new THREE.Vector3(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).normalize(),
      k: 1.5 + rnd() * 3.5,
      a: (rnd() - 0.4) * (r < 50 ? 0.16 : 0.07),
    }));
    const craters = Array.from({ length: r < 50 ? 14 : 8 }, () => ({
      d: new THREE.Vector3(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).normalize(),
      size: 0.12 + rnd() * 0.32,
      depth: 0.03 + rnd() * 0.06,
    }));
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.set(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize();
      let h = 1;
      for (const l of lumps) h += l.a * Math.pow(Math.max(0, v.dot(l.d)), l.k);
      for (const c of craters) {
        const ang = Math.acos(Math.min(1, v.dot(c.d)));
        const x = ang / c.size;
        if (x < 1.3) h += x < 1 ? -c.depth * (1 - x * x) : c.depth * 0.6 * (1 - (x - 1) / 0.3);
      }
      // Ring material swept onto the equator (Pan's "walnut", Atlas's "flying saucer")
      if (body.ridge) h += 0.2 * Math.pow(Math.max(0, 1 - Math.abs(v.y) / 0.2), 1.6);
      pos.setXYZ(i, v.x * h * ax, v.y * h * ay, v.z * h * az);
    }
    geo.computeVertexNormals();
  }

  public static createPlanet(body: CelestialBodyDefinition): PlanetMeshBundle {
    // bodyGroup: positioned along the orbit each frame and oriented to the body's equatorial frame
    // (local +Y = north pole, see BodyOrientation.ts); surfaceMesh spins about local +Y.
    const bodyGroup = new THREE.Group();
    bodyGroup.name = `body_group_${body.name}`;

    const visualRadius = this.getVisualRadius(body);

    // Oblateness scaling (flattening f = (a - b) / a)
    const flattening = body.physical.flattening || 0;
    const polarScale = 1.0 - flattening;

    // Create unit surface sphere (R = 1.0)
    // High subdivision count for major worlds guarantees seamless spherical silhouette without visible facets
    const isSmallBody = body.category === 'moon' || body.category === 'asteroid';
    const isMajorWorld = body.category === 'planet' || body.category === 'star';

    // Irregular small bodies: measured or typical triaxial shape, lumps and craters
    const irregular = body.category === 'asteroid' || (body.category === 'moon' && body.physical.meanRadiusKm < 200);
    const sphereGeo = irregular ? this.smallBodyGeometry(body) : new THREE.SphereGeometry(
      1.0,
      isMajorWorld ? 96 : (isSmallBody ? 36 : 64),
      isMajorWorld ? 64 : (isSmallBody ? 24 : 48)
    );

    const texPipeline = TexturePipeline.getInstance();
    const textures = texPipeline.getPlanetTextures(body.name, body.minor ? body.surfaceKind : undefined);

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
      const coronaGeo = new THREE.SphereGeometry(7.6, 96, 64); // streamers reach several radii out
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
        textures.nightMap,
        textures.cloudsMap
      );

      // Independent Rotating Clouds (Troposphere shell at 1.004)
      if (textures.cloudsMap) {
        const cloudGeo = new THREE.SphereGeometry(1.004, 96, 64);
        const cloudMat = EarthMaterial.createCloudMaterial(textures.cloudsMap);
        cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
        cloudMesh.name = 'earth_clouds';
        cloudMesh.renderOrder = 2;
        cloudMesh.scale.set(visualRadius, visualRadius, visualRadius);
        bodyGroup.add(cloudMesh);
      }

      // Physically Grounded Rayleigh & Mie Scattering Atmosphere (Exosphere shell at 1.012 encompassing clouds)
      const atmoMat = AtmosphereShader.createAtmosphereMaterial('Earth');
      if (atmoMat) {
        const atmoGeo = new THREE.SphereGeometry(1.012, 96, 64);
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
        const rScale = ATMOSPHERE_CONFIGS[body.name]?.radiusScale || 1.012;
        const atmoGeo = new THREE.SphereGeometry(rScale, 48, 36);
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
          uSunWorld: SUN_WORLD,
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
          uniform vec3 uSunWorld;
          uniform vec3 saturnCenter;
          uniform float saturnRadius;
          varying vec2 vUv;
          varying vec3 vWorldPosition;
          varying vec3 vWorldNormal;

          void main() {
            vec4 ringTexCol = texture2D(ringMap, vUv);
            if (ringTexCol.a < 0.02) discard;

            vec3 sunDir = normalize(uSunWorld - vWorldPosition);
            vec3 normal = normalize(vWorldNormal);

            // Double-sided lighting: sunlight illuminates ring from both top and bottom
            float lightDot = max(0.12, abs(dot(normal, sunDir)));

            // Analytical spherical shadow cast by Saturn's globe onto its rings:
            vec3 saturnToSun = normalize(uSunWorld - saturnCenter);
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

            #include <tonemapping_fragment>
            #include <colorspace_fragment>
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
      // Saturn's centre in the frame actually being drawn (the scene is shifted per frame)
      ringMesh.onBeforeRender = () => {
        ringMat.uniforms.saturnCenter.value.setFromMatrixPosition(bodyGroup.matrixWorld);
      };
      bodyGroup.add(ringMesh);
    }

    return {
      definition: body,
      bodyGroup,
      surfaceMesh,
      nightMesh,
      cloudMesh,
      atmosphereMesh,
      ringMesh,
      glowMeshes: glowMeshes.length > 0 ? glowMeshes : undefined,
      prominencesGroup,
      visualRadius,
    };
  }
}
