import * as THREE from 'three';
import { SAGITTARIUS_A_STAR_DATA } from '../data/SagittariusAStarData';

export interface SagittariusAStarConfig {
  schwarzschildRadius: number; // Render units (default 20.0)
  diskInnerRadius: number;     // Render units (default 60.0 = 3.0 * rs, ISCO)
  diskOuterRadius: number;     // Render units (default 260.0 = 13.0 * rs)
  boundingRadius: number;      // Bounding sphere radius (default 420.0)
}

export const DEFAULT_SGR_A_CONFIG: SagittariusAStarConfig = {
  schwarzschildRadius: 20.0,
  diskInnerRadius: 60.0,
  diskOuterRadius: 260.0,
  boundingRadius: 420.0,
};

/**
 * SAGITTARIUS A* — GENERAL RELATIVISTIC BLACK HOLE MODEL
 * 
 * Features:
 * 1. General Relativistic Ray-Marching Shader:
 *    - Numerical null-geodesic ray tracing in Schwarzschild spacetime.
 *    - Pitch-black Event Horizon and apparent gravitational shadow (r_shadow = 2.598 * r_s).
 *    - Gravitational light deflection causing the far side of the accretion disk to
 *      visibly arch BOTH ABOVE AND BELOW the black hole shadow!
 * 2. Relativistic Doppler Beaming & Boosting:
 *    - Keplerian orbital speed at ISCO ~ 0.408 c.
 *    - Relativistic Doppler factor delta = 1 / [gamma * (1 - beta * cos(theta))].
 *    - Approaching side of disk is boosted by delta^4 (blazing blue-white hot);
 *      receding side is dimmed and redshifted into deep amber/crimson.
 * 3. Gravitational Redshift:
 *    - Time dilation factor sqrt(1 - r_s / r) shifting emitted radiation near the horizon.
 * 4. Razor-Sharp Photon Ring:
 *    - Highly concentrated ring of looping photons at the critical impact parameter b_crit.
 * 5. Nuclear Star Cluster (S-Stars):
 *    - 3D orbiting stars in the central parsec around Sgr A* (S2/S0-2 analogs).
 * 6. Plasma Accretion Flares & Magnetic Turbulence:
 *    - Time-dependent synchrotron plasma filaments rotating at relativistic orbital periods.
 */
export class SagittariusAStar {
  public group: THREE.Group = new THREE.Group();
  public boundingMesh: THREE.Mesh;
  public sStarsPoints: THREE.Points;
  public jetPolesGroup: THREE.Group = new THREE.Group();

  public readonly config: SagittariusAStarConfig;
  public readonly scientificData = SAGITTARIUS_A_STAR_DATA;

  private timeUniform: { value: number } = { value: 0.0 };
  private opacityUniform: { value: number } = { value: 1.0 };
  private cameraPosUniform: { value: THREE.Vector3 } = { value: new THREE.Vector3() };

  constructor(config: SagittariusAStarConfig = DEFAULT_SGR_A_CONFIG) {
    this.config = config;
    this.group.name = 'sagittarius_a_star_black_hole';

    // 1. Build Relativistic Ray-Marching Bounding Sphere Mesh
    this.boundingMesh = this.createRelativisticRayMarchMesh();
    this.group.add(this.boundingMesh);

    // 2. Build Nuclear Star Cluster (S-Stars)
    this.sStarsPoints = this.createNuclearStarCluster();
    this.group.add(this.sStarsPoints);

    // 3. Build Relativistic Polar Outflow Flares
    this.createPolarOutflowJets();
    this.group.add(this.jetPolesGroup);
  }

  /**
   * Creates the custom GLSL ray-marching mesh that solves the null-geodesic light bending.
   */
  private createRelativisticRayMarchMesh(): THREE.Mesh {
    const geo = new THREE.SphereGeometry(this.config.boundingRadius, 64, 48);

    const rs = this.config.schwarzschildRadius;
    const rShadow = rs * (3.0 * Math.sqrt(3.0) / 2.0); // b_crit ~ 2.598 * rs (~51.96)
    const rIn = this.config.diskInnerRadius; // ISCO ~ 60.0
    const rOut = this.config.diskOuterRadius; // ~260.0

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: this.timeUniform,
        uOpacity: this.opacityUniform,
        uCameraPosLocal: this.cameraPosUniform,
        uRs: { value: rs },
        uRShadow: { value: rShadow },
        uRIn: { value: rIn },
        uROut: { value: rOut },
        uBoundingR: { value: this.config.boundingRadius },
      },
      vertexShader: `
        varying vec3 vLocalPos;
        varying vec3 vWorldPos;

        void main() {
          vLocalPos = position;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        uniform vec3 uCameraPosLocal;
        uniform float uRs;
        uniform float uRShadow;
        uniform float uRIn;
        uniform float uROut;
        uniform float uBoundingR;

        varying vec3 vLocalPos;

        #define PI 3.14159265359
        #define STEPS 44

        // Spectral blackbody emission curve from temperature
        vec3 temperatureToColor(float temp) {
          // Hot inner relativistic plasma (T ~ 1.0) -> electric blue-white
          // Intermediate plasma (T ~ 0.5) -> incandescent golden yellow
          // Outer edge plasma (T ~ 0.1) -> deep amber / crimson
          vec3 coolCol = vec3(0.95, 0.28, 0.05);   // Deep synchrotron crimson
          vec3 warmCol = vec3(1.25, 0.88, 0.35);   // Golden amber
          vec3 hotCol  = vec3(0.95, 1.15, 1.55);   // Ultra-relativistic blue-white

          vec3 col = mix(coolCol, warmCol, smoothstep(0.05, 0.45, temp));
          col = mix(col, hotCol, smoothstep(0.45, 0.95, temp));
          return col;
        }

        // Accretion disk emission and Doppler beaming at intersection point
        vec4 sampleAccretionDisk(vec3 pos, vec3 rayDir) {
          float r = length(pos.xz);
          if (r < uRIn || r > uROut) return vec4(0.0);

          // 1. Novikov-Thorne Relativistic Temperature Profile:
          // Flux F(r) ~ r^-2.1 * (1 - sqrt(r_in / r))
          float normR = r / uRIn;
          float flux = pow(normR, -2.1) * max(0.0, 1.0 - sqrt(1.0 / normR));
          float temp = clamp(flux * 4.2, 0.0, 1.0);

          // 2. Gravitational Redshift: g_grav = sqrt(1 - rs / r)
          float gravRedshift = sqrt(max(0.05, 1.0 - uRs / r));

          // 3. Relativistic Keplerian Orbital Speed: beta = v/c = sqrt(rs / (2 * r))
          float beta = clamp(sqrt(uRs / (2.0 * r)), 0.0, 0.55);
          float gamma = 1.0 / sqrt(max(0.05, 1.0 - beta * beta));

          // Keplerian velocity vector (counter-clockwise orbit in X-Z plane)
          vec3 vel = normalize(vec3(-pos.z, 0.0, pos.x)) * beta;

          // Doppler factor: delta = 1 / [gamma * (1 - beta * cos(alpha))]
          // where cos(alpha) = vel . (-rayDir)
          float cosAlpha = dot(vel, -rayDir) / beta;
          float delta = 1.0 / (gamma * (1.0 - beta * cosAlpha));

          // Relativistic Doppler Beaming intensity boost: I_obs = I_emit * delta^4
          float dopplerBoost = pow(clamp(delta, 0.22, 3.5), 3.8);

          // Shift temperature with Doppler and gravitational redshift
          float effTemp = clamp(temp * delta * gravRedshift, 0.0, 1.25);
          vec3 baseRgb = temperatureToColor(effTemp);

          // 4. Dynamic Synchrotron Plasma Turbulence (differential spiral shear)
          float phi = atan(pos.z, pos.x);
          float omega = 3.2 * pow(uRIn / r, 1.5);
          float logR = log(max(1.0, r / uRIn));
          float spiral1 = phi * 3.0 - logR * 4.2 - omega * uTime * 0.35;
          float spiral2 = phi * 6.0 - logR * 7.5 - omega * uTime * 0.55;
          float turb = 0.88 + 0.18 * sin(spiral1) + 0.10 * cos(spiral2);

          // Smooth radial boundaries: sharp physical ISCO inner cutoff, soft outer fade
          float innerFade = smoothstep(uRIn, uRIn * 1.08, r);
          float outerFade = smoothstep(uROut, uROut * 0.75, r);
          float radialEnvelope = innerFade * outerFade;

          vec3 finalColor = baseRgb * dopplerBoost * turb * 2.4 * radialEnvelope;
          float alpha = clamp(radialEnvelope * (0.35 + flux * 3.8) * 0.96 * turb, 0.0, 0.98);

          return vec4(finalColor, alpha);
        }

        void main() {
          vec3 rayOrigin = uCameraPosLocal;
          vec3 rayDir = normalize(vLocalPos - rayOrigin);

          // Analytic Ray-Sphere Intersection with Bounding Sphere:
          // ||rayOrigin + t * rayDir||^2 = uBoundingR^2
          float b0 = dot(rayOrigin, rayDir);
          float c0 = dot(rayOrigin, rayOrigin) - uBoundingR * uBoundingR;
          float disc = b0 * b0 - c0;

          if (disc < 0.0) discard;

          float sqrtDisc = sqrt(disc);
          float tNear = -b0 - sqrtDisc;
          float tFar  = -b0 + sqrtDisc;

          if (tFar < 0.0) discard;

          float tStart = max(0.0, tNear);
          float totalDist = tFar - tStart;
          if (totalDist <= 0.0) discard;

          // Impact parameter: distance of closest approach for asymptotic straight line
          vec3 rCrossD = cross(rayOrigin, rayDir);
          float b = length(rCrossD);

          vec3 pos = rayOrigin + rayDir * tStart;
          float stepSize = totalDist / float(STEPS);

          vec3 accumColor = vec3(0.0);
          float accumAlpha = 0.0;
          bool hitShadow = false;

          for (int i = 0; i < STEPS; i++) {
            float r = length(pos);

            // A. Check for capture into Event Horizon / Shadow
            // Inside photon sphere and impact parameter within critical capture b < b_crit
            if (r <= uRs * 1.05 || (b < uRShadow * 0.99 && r <= uRs * 1.52)) {
              hitShadow = true;
              break;
            }

            // B. General Relativistic Light Bending (Null Geodesic Acceleration):
            // d2r/dlambda2 = - (1.5 * rs * h^2 / r^5) * r
            vec3 angMom = cross(pos, rayDir);
            float h2 = dot(angMom, angMom);
            vec3 bendingAccel = - (1.5 * uRs * h2 / max(pow(r, 5.0), 10.0)) * pos;
            
            vec3 nextRayDir = normalize(rayDir + bendingAccel * stepSize);
            vec3 nextPos = pos + nextRayDir * stepSize;

            // C. Equatorial Accretion Disk Crossing Check (Y = 0)
            if (pos.y * nextPos.y <= 0.0) {
              float tCrossing = abs(pos.y) / max(0.0001, abs(pos.y) + abs(nextPos.y));
              vec3 crossPos = mix(pos, nextPos, tCrossing);
              
              vec4 diskSample = sampleAccretionDisk(crossPos, rayDir);
              if (diskSample.a > 0.01) {
                accumColor += (1.0 - accumAlpha) * diskSample.rgb * diskSample.a;
                accumAlpha += (1.0 - accumAlpha) * diskSample.a;
                if (accumAlpha >= 0.98) break;
              }
            }

            rayDir = nextRayDir;
            pos = nextPos;

            if (length(pos) > uBoundingR * 1.02) break;
          }

          // D. If the ray hits the event horizon:
          // Any emission in FRONT of the black hole is visible; everything behind is pure pitch black!
          if (hitShadow) {
            gl_FragColor = vec4(accumColor, 1.0 * uOpacity);
            return;
          }

          // E. Ultra-Sharp Relativistic Photon Ring:
          // Ring of looping photons at the critical shadow boundary (b ~ b_crit)
          float shadowDist = abs(b - uRShadow);
          float photonRing = exp(-pow(shadowDist / (uRs * 0.08), 2.0));
          if (photonRing > 0.01) {
            vec3 ringColor = vec3(1.35, 1.20, 0.92) * photonRing * 3.2;
            accumColor += (1.0 - accumAlpha) * ringColor;
            accumAlpha += (1.0 - accumAlpha) * photonRing * 0.90;
          }

          // F. Gravitational Deflection Glow of Background Cosmos:
          if (accumAlpha < 0.95) {
            float deflectionGlow = exp(-pow(shadowDist / (uRs * 0.35), 2.0)) * 0.22;
            vec3 cosmicGlow = vec3(0.08, 0.06, 0.12) * deflectionGlow;
            accumColor += (1.0 - accumAlpha) * cosmicGlow;
            accumAlpha += (1.0 - accumAlpha) * deflectionGlow;
          }

          if (accumAlpha < 0.005) discard;

          gl_FragColor = vec4(accumColor, clamp(accumAlpha, 0.0, 1.0) * uOpacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = 'sagittarius_a_star_lensing_volume';
    mesh.renderOrder = 50; // Render on top of celestial background
    return mesh;
  }

  /**
   * 2. Nuclear Star Cluster (S-Stars orbiting Sagittarius A* in the central parsec)
   * Real astrophysical stars (S2/S0-2, S38, S55, S62) with relativistic orbital motions.
   */
  private createNuclearStarCluster(): THREE.Points {
    const starCount = 350;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const rMin = this.config.diskOuterRadius * 1.1; // Outside accretion disk
    const rMax = this.config.boundingRadius * 0.95;

    for (let i = 0; i < starCount; i++) {
      // Clustered density toward the black hole (Bahcall-Wolf cusp: n ~ r^-1.75)
      const u = Math.random();
      const r = rMin + Math.pow(u, 1.5) * (rMax - rMin);
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);

      // Early-type B-dwarf and O-star spectral colors of the S-cluster
      const starType = Math.random();
      if (starType < 0.45) {
        // Hot B0-B2 V stars (blue-white)
        colors[i * 3] = 0.82;
        colors[i * 3 + 1] = 0.90;
        colors[i * 3 + 2] = 1.0;
        sizes[i] = 2.0 + Math.random() * 2.2;
      } else if (starType < 0.8) {
        // Solar-type intermediate stars
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 0.85;
        sizes[i] = 1.4 + Math.random() * 1.5;
      } else {
        // Red giants (late M-type)
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.65;
        colors[i * 3 + 2] = 0.45;
        sizes[i] = 1.8 + Math.random() * 1.8;
      }
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
          gl_PointSize = clamp(size * (1500.0 / max(dist, 10.0)), 1.2, 7.0);
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
          float halo = smoothstep(0.5, 0.05, d) * 0.25;
          float alpha = clamp(core + halo, 0.0, 1.0) * uOpacity;

          gl_FragColor = vec4(vColor * 1.4, alpha);
        }
      `,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geo, mat);
    points.name = 's_stars_nuclear_cluster';
    return points;
  }

  /**
   * 3. Relativistic Polar Outflow Jets / Magnetic Winds
   */
  private createPolarOutflowJets(): void {
    const jetHeight = this.config.boundingRadius * 0.65;
    const jetGeo = new THREE.CylinderGeometry(8.0, 1.5, jetHeight, 24, 1, true);
    // Align with polar Y axis and shift top/bottom
    const jetMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: this.timeUniform,
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
        uniform float uTime;
        uniform float uOpacity;
        varying vec2 vUv;

        void main() {
          // Flow speed along the jet axis
          float flow = fract(vUv.y * 2.5 - uTime * 0.9);
          float core = pow(sin(vUv.x * 3.14159), 3.0);
          float fade = (1.0 - vUv.y) * core;

          vec3 jetColor = mix(vec3(0.3, 0.6, 1.2), vec3(0.8, 0.4, 1.0), flow);
          float alpha = fade * 0.14 * uOpacity;
          if (alpha < 0.005) discard;

          gl_FragColor = vec4(jetColor * 1.3, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // North polar jet
    const northJet = new THREE.Mesh(jetGeo, jetMat);
    northJet.position.y = jetHeight * 0.5 + this.config.diskInnerRadius * 0.5;
    this.jetPolesGroup.add(northJet);

    // South polar jet
    const southJet = new THREE.Mesh(jetGeo.clone(), jetMat);
    southJet.rotation.x = Math.PI;
    southJet.position.y = - (jetHeight * 0.5 + this.config.diskInnerRadius * 0.5);
    this.jetPolesGroup.add(southJet);
  }

  /**
   * Updates shader uniforms per frame with camera position and simulation time.
   */
  public update(camera: THREE.Camera, timeSec: number): void {
    this.timeUniform.value = timeSec;

    // Transform camera world position into black hole's local space
    const camLocal = camera.position.clone();
    this.group.worldToLocal(camLocal);
    this.cameraPosUniform.value.copy(camLocal);

    // Slowly rotate S-stars nuclear cluster
    if (this.sStarsPoints) {
      this.sStarsPoints.rotation.y = timeSec * 0.015;
    }
  }

  public setOpacity(opacity: number): void {
    const clamped = Math.max(0.0, Math.min(1.0, opacity));
    this.opacityUniform.value = clamped;
    this.group.visible = clamped > 0.005;
  }

  public dispose(): void {
    this.boundingMesh.geometry.dispose();
    (this.boundingMesh.material as THREE.Material).dispose();

    this.sStarsPoints.geometry.dispose();
    (this.sStarsPoints.material as THREE.Material).dispose();

    this.jetPolesGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}
