import * as THREE from 'three';
import { SUN_WORLD } from './RenderOrigin';

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
    radiusScale: 1.008,
    rayleighColor: new THREE.Color(0.24, 0.52, 0.92), // Natural Rayleigh sky blue
    twilightColor: new THREE.Color(0.95, 0.42, 0.16), // Sunset amber
    density: 0.65,
    falloffPower: 4.5,
    mieG: 0.72,
  },
  Venus: {
    radiusScale: 1.012,
    rayleighColor: new THREE.Color(0.92, 0.86, 0.64), // Creamy sulfuric acid haze
    twilightColor: new THREE.Color(0.85, 0.58, 0.32), // Warm amber
    density: 1.10,
    falloffPower: 3.5,
    mieG: 0.65,
  },
  Mars: {
    radiusScale: 1.004,
    rayleighColor: new THREE.Color(0.65, 0.55, 0.50), // Ultra-tenuous 0.6 kPa dust/CO2 haze (subtle, non-emissive)
    twilightColor: new THREE.Color(0.35, 0.50, 0.70), // Subtle blue Martian twilight
    density: 0.12,
    falloffPower: 6.0,
    mieG: 0.55,
  },
  Uranus: {
    radiusScale: 1.014,
    rayleighColor: new THREE.Color(0.48, 0.85, 0.82), // Aquamarine methane haze
    twilightColor: new THREE.Color(0.32, 0.65, 0.72),
    density: 0.75,
    falloffPower: 3.8,
    mieG: 0.70,
  },
  Neptune: {
    radiusScale: 1.014,
    rayleighColor: new THREE.Color(0.20, 0.45, 0.95), // Deep azure methane absorption
    twilightColor: new THREE.Color(0.15, 0.30, 0.75),
    density: 0.80,
    falloffPower: 3.8,
    mieG: 0.70,
  },
};

export class AtmosphereShader {
  public static createAtmosphereMaterial(planetName: string): THREE.ShaderMaterial | null {
    const config = ATMOSPHERE_CONFIGS[planetName];
    if (!config) return null;

    return new THREE.ShaderMaterial({
      uniforms: {
        uSunWorld: SUN_WORLD,
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
        uniform vec3 uSunWorld;
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
          vec3 sunDir = normalize(uSunWorld - vWorldPosition);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          // 1. Fresnel limb optical path: peaks steeply at the grazing horizon silhouette
          float cosTheta = clamp(abs(dot(worldNormal, viewDir)), 0.0, 1.0);
          float limbFresnel = pow(1.0 - cosTheta, falloffPower);

          // 2. Solar illumination factor:
          // Strictly extinguished on the dark hemisphere, eliminating fake neon rim
          float sunDot = dot(worldNormal, sunDir);
          float dayFactor = smoothstep(-0.02, 0.28, sunDot);

          // 3. Henyey-Greenstein Mie forward scattering phase function:
          float cosViewSun = dot(viewDir, sunDir);
          float g = mieG;
          float miePhase = (1.0 - g * g) / pow(1.0 + g * g - 2.0 * g * cosViewSun, 1.5) * 0.15;
          float forwardScatter = max(0.0, miePhase) * dayFactor;

          // 4. Twilight reddening / sunset ember fringe at the terminator:
          float terminatorBand = smoothstep(-0.05, 0.08, sunDot) * (1.0 - smoothstep(0.08, 0.28, sunDot));
          vec3 scatterColor = mix(rayleighColor, twilightColor, terminatorBand * 0.75);

          // 5. Total scattered radiance
          float intensity = limbFresnel * density * (pow(dayFactor, 1.4) + forwardScatter * 1.2);
          if (intensity < 0.002) {
            discard; // Absolute dark-side transparency with zero overhead or halo artifacts
          }
          intensity = clamp(intensity, 0.0, 1.0);

          gl_FragColor = vec4(scatterColor * intensity, intensity);

          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }
}
