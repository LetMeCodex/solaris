import * as THREE from 'three';

/**
 * Photorealistic Earth Surface Shader Material
 * - PBR-quality multi-layer synthesis:
 *   - Day albedo map (continents, vegetation, deserts)
 *   - Normal map for mountain and continental topography
 *   - Restrained ocean specular reflection (water mask derived from albedo reflectance)
 *   - Night city lights dynamically masked by solar terminator (strictly dark side only)
 *   - Twilight sunset reddening along the day/night boundary
 */
export class EarthMaterial {
  public static createSurfaceMaterial(
    dayMap: THREE.Texture,
    normalMap?: THREE.Texture,
    nightMap?: THREE.Texture
  ): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayMap: { value: dayMap },
        normalMap: { value: normalMap || null },
        nightMap: { value: nightMap || null },
        hasNormalMap: { value: normalMap ? 1.0 : 0.0 },
        hasNightMap: { value: nightMap ? 1.0 : 0.0 },
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
        uniform sampler2D dayMap;
        uniform sampler2D normalMap;
        uniform sampler2D nightMap;
        uniform float hasNormalMap;
        uniform float hasNightMap;

        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec3 geomNormal = normalize(vWorldNormal);
          vec3 sunDir = normalize(-vWorldPosition); // Sun at (0, 0, 0)
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          // Normal mapping perturbation
          vec3 normal = geomNormal;
          if (hasNormalMap > 0.5) {
            vec3 normalTex = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;
            // Simplified tangent-space reconstruction on sphere
            vec3 dpdx = dFdx(vWorldPosition);
            vec3 dpdy = dFdy(vWorldPosition);
            vec2 duvdx = dFdx(vUv);
            vec2 duvdy = dFdy(vUv);

            vec3 N = geomNormal;
            vec3 T = normalize(dpdx * duvdy.y - dpdy * duvdx.y);
            vec3 B = -normalize(cross(N, T));
            mat3 TBN = mat3(T, B, N);
            normal = normalize(TBN * normalTex);
          }

          vec4 dayColor = texture2D(dayMap, vUv);

          // 1. Water mask derivation:
          // Earth oceans have low red reflectance (r < 0.22) and dominant blue (b > r + 0.05)
          // Land/vegetation/deserts have high red/green components
          float waterMask = smoothstep(0.32, 0.08, dayColor.r) * smoothstep(0.08, 0.25, dayColor.b);
          // Polar ice caps have high albedo across all channels (r > 0.6, g > 0.6, b > 0.6)
          float iceMask = smoothstep(0.55, 0.85, (dayColor.r + dayColor.g + dayColor.b) / 3.0);
          waterMask = waterMask * (1.0 - iceMask); // Ice is matte, not liquid water specular

          // 2. Solar diffuse lighting:
          float NdotL = dot(normal, sunDir);
          float dayFactor = smoothstep(-0.06, 0.18, NdotL);

          // 3. Restrained Ocean Specular reflection (Blinn-Phong lobe):
          vec3 halfVec = normalize(sunDir + viewDir);
          float NdotH = max(0.0, dot(normal, halfVec));
          float specularPower = 48.0;
          float oceanSpecular = pow(NdotH, specularPower) * waterMask * dayFactor * 1.85;

          // 4. Night-side city lights:
          // Strictly extinguished in daylight; smoothly fades in across twilight
          float nightFactor = 1.0 - smoothstep(-0.14, 0.04, NdotL);
          vec3 cityLights = vec3(0.0);
          if (hasNightMap > 0.5) {
            vec4 nightTex = texture2D(nightMap, vUv);
            // Boost warm incandescent city radiance on the dark hemisphere
            cityLights = nightTex.rgb * vec3(1.3, 1.15, 0.95) * nightFactor * 1.6;
          }

          // 5. Twilight sunset reddening along the terminator:
          float twilightBand = smoothstep(-0.08, 0.02, NdotL) * (1.0 - smoothstep(0.02, 0.22, NdotL));
          vec3 twilightGlow = vec3(0.85, 0.35, 0.12) * twilightBand * 0.45;

          // 6. Direct sunlight illumination with soft ambient fill for dark-side features:
          vec3 sunlightColor = vec3(1.0, 0.98, 0.92) * 1.45;
          vec3 ambientColor = vec3(0.025, 0.028, 0.038); // Deep space starlight fill

          vec3 surfaceColor = dayColor.rgb * (sunlightColor * dayFactor + twilightGlow + ambientColor);
          surfaceColor += vec3(0.95, 0.98, 1.0) * oceanSpecular; // White-hot specular glint on oceans
          surfaceColor += cityLights; // Twinkling night cities

          gl_FragColor = vec4(surfaceColor, 1.0);
        }
      `,
    });
  }

  /**
   * Atmospheric Cloud Layer Shader
   * - Realistic alpha derivation
   * - Directional sunlight shading
   * - Soft daytime translucency
   */
  public static createCloudMaterial(cloudsMap: THREE.Texture): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        cloudsMap: { value: cloudsMap },
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
        uniform sampler2D cloudsMap;
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec4 cloudTex = texture2D(cloudsMap, vUv);
          // Derive opacity from cloud texture brightness
          float cloudDensity = cloudTex.r * 0.92;
          if (cloudDensity < 0.03) discard;

          vec3 normal = normalize(vWorldNormal);
          vec3 sunDir = normalize(-vWorldPosition);

          // Sunlight on clouds
          float NdotL = dot(normal, sunDir);
          float dayFactor = smoothstep(-0.08, 0.22, NdotL);

          // Twilight sunset rim on high-altitude cirrus clouds
          float twilight = smoothstep(-0.06, 0.04, NdotL) * (1.0 - smoothstep(0.04, 0.25, NdotL));
          vec3 cloudSunColor = mix(vec3(1.0, 0.98, 0.95), vec3(0.95, 0.52, 0.28), twilight * 0.85);

          vec3 cloudColor = cloudSunColor * (dayFactor * 1.25 + 0.03);

          gl_FragColor = vec4(cloudColor, cloudDensity * (0.45 + dayFactor * 0.45));
        }
      `,
      transparent: true,
      depthWrite: false,
    });
  }
}
