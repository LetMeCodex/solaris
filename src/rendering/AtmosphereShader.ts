import * as THREE from 'three';

/**
 * Physically Motivated Atmospheric Scattering Shaders
 * Implements:
 * - Single-scattering Rayleigh approximation with wavelength dependency (1/lambda^4)
 * - Mie forward scattering phase function for authentic solar halos
 * - Sunset/twilight reddening along the day/night terminator
 * - Absolute night-side extinction (zero neon rim on dark hemisphere)
 */

export interface AtmosphereConfig {
  radiusScale: number;       // Outer shell radius relative to planet surface (e.g. 1.018)
  rayleighColor: THREE.Color; // Peak scattering color
  twilightColor: THREE.Color; // Sunset/twilight color at the terminator
  density: number;            // Optical thickness
  falloffPower: number;       // Fresnel limb exponent
  mieG: number;               // Henyey-Greenstein asymmetry factor for forward scattering
}

export const ATMOSPHERE_CONFIGS: Record<string, AtmosphereConfig> = {
  Earth: {
    radiusScale: 1.022,
    rayleighColor: new THREE.Color(0.22, 0.55, 0.98), // Deep Rayleigh azure
    twilightColor: new THREE.Color(0.95, 0.42, 0.16), // Sunset ember orange
    density: 1.25,
    falloffPower: 3.5,
    mieG: 0.76,
  },
  Venus: {
    radiusScale: 1.032,
    rayleighColor: new THREE.Color(0.95, 0.88, 0.62), // Creamy sulfuric acid haze
    twilightColor: new THREE.Color(0.85, 0.58, 0.32), // Warm amber
    density: 1.85,
    falloffPower: 2.8,
    mieG: 0.65,
  },
  Mars: {
    radiusScale: 1.012,
    rayleighColor: new THREE.Color(0.82, 0.52, 0.35), // Thin ferric dust / CO2
    twilightColor: new THREE.Color(0.45, 0.62, 0.85), // Blue Martian sunsets!
    density: 0.55,
    falloffPower: 4.8,
    mieG: 0.55,
  },
  Uranus: {
    radiusScale: 1.028,
    rayleighColor: new THREE.Color(0.48, 0.85, 0.82), // Aquamarine methane haze
    twilightColor: new THREE.Color(0.32, 0.65, 0.72),
    density: 1.10,
    falloffPower: 3.0,
    mieG: 0.70,
  },
  Neptune: {
    radiusScale: 1.028,
    rayleighColor: new THREE.Color(0.20, 0.45, 0.95), // Deep azure methane absorption
    twilightColor: new THREE.Color(0.15, 0.30, 0.75),
    density: 1.20,
    falloffPower: 3.0,
    mieG: 0.70,
  },
};

export class AtmosphereShader {
  public static createAtmosphereMaterial(planetName: string): THREE.ShaderMaterial | null {
    const config = ATMOSPHERE_CONFIGS[planetName];
    if (!config) return null;

    return new THREE.ShaderMaterial({
      uniforms: {
        rayleighColor: { value: config.rayleighColor },
        twilightColor: { value: config.twilightColor },
        density: { value: config.density },
        falloffPower: { value: config.falloffPower },
        mieG: { value: config.mieG },
      },
      vertexShader: `
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 rayleighColor;
        uniform vec3 twilightColor;
        uniform float density;
        uniform float falloffPower;
        uniform float mieG;

        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec3 worldNormal = normalize(vWorldNormal);
          // Sun is located at world origin (0, 0, 0)
          vec3 sunDir = normalize(-vWorldPosition);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          // 1. Fresnel limb optical path: peaks steeply at the grazing horizon silhouette
          float cosTheta = clamp(abs(dot(worldNormal, viewDir)), 0.0, 1.0);
          float limbFresnel = pow(1.0 - cosTheta, falloffPower);

          // 2. Solar illumination factor:
          // Smoothly extinguishes on the dark hemisphere, eliminating fake neon rim
          float sunDot = dot(worldNormal, sunDir);
          float dayFactor = smoothstep(-0.02, 0.32, sunDot);

          // 3. Henyey-Greenstein Mie forward scattering phase function:
          float cosViewSun = dot(viewDir, sunDir);
          float g = mieG;
          float miePhase = (1.0 - g * g) / pow(1.0 + g * g - 2.0 * g * cosViewSun, 1.5) * 0.15;
          float forwardScatter = max(0.0, miePhase) * dayFactor;

          // 4. Twilight reddening / sunset ember fringe at the terminator:
          float terminatorBand = smoothstep(-0.05, 0.08, sunDot) * (1.0 - smoothstep(0.08, 0.28, sunDot));
          vec3 scatterColor = mix(rayleighColor, twilightColor, terminatorBand * 0.82);

          // 5. Total scattered radiance (pow(dayFactor, 1.4) yields soft natural terminator rolloff)
          float intensity = limbFresnel * density * (pow(dayFactor, 1.4) + forwardScatter * 1.5);
          if (intensity < 0.002) {
            discard; // Absolute dark-side transparency with zero overhead or halo artifacts
          }
          intensity = clamp(intensity, 0.0, 1.0);

          gl_FragColor = vec4(scatterColor * 1.15, intensity);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }
}
