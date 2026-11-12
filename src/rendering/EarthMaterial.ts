import * as THREE from 'three';
import { SUN_WORLD } from './RenderOrigin';
import { AERIAL_PERSPECTIVE_GLSL, MOON_DIR, MOON_LIGHT, NIGHT_AIR } from './AerialPerspective';

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
    nightMap?: THREE.Texture,
    cloudsMap?: THREE.Texture
  ): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        uSunWorld: SUN_WORLD,
        // Fraction of the radius the globe is drawn below sea level (see SolarSystemScene's
        // updatePhotoreal: it steps under Google's 3D tiles as their fallback)
        uSink: { value: 0 },
        // Low over Earth, under Google's tiles: the same aerial perspective and water as the tiles
        // (PhotorealEarth), so where the globe shows past them (the open sea to the horizon) it
        // does not stand out as a flat saturated blue. 0 from space: the globe as it always was
        uNearAir: { value: 0 },
        uAirKmPerUnit: { value: 1 },
        uAirCamAltKm: { value: 0 },
        uAirHaze: { value: 1 },
        uNightAir: NIGHT_AIR,
        uMoonLight: MOON_LIGHT,
        uMoonDir: MOON_DIR,
        dayMap: { value: dayMap },
        normalMap: { value: normalMap || null },
        nightMap: { value: nightMap || null },
        cloudsMap: { value: cloudsMap || null },
        hasNormalMap: { value: normalMap ? 1.0 : 0.0 },
        hasNightMap: { value: nightMap ? 1.0 : 0.0 },
        hasCloudsMap: { value: cloudsMap ? 1.0 : 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        uniform float uSink;

        void main() {
          vUv = uv;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vec4 worldPos = modelMatrix * vec4(position * (1.0 - uSink), 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uSunWorld;
        uniform sampler2D dayMap;
        uniform sampler2D normalMap;
        uniform sampler2D nightMap;
        uniform sampler2D cloudsMap;
        uniform float hasNormalMap;
        uniform float hasNightMap;
        uniform float hasCloudsMap;
        uniform float uNearAir;
        uniform float uAirKmPerUnit;
        uniform float uAirCamAltKm;
        uniform float uAirHaze;
        ${AERIAL_PERSPECTIVE_GLSL}

        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec3 geomNormal = normalize(vWorldNormal);
          vec3 sunDir = normalize(uSunWorld - vWorldPosition);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          // Normal mapping perturbation
          vec3 normal = geomNormal;
          vec3 T = vec3(1.0, 0.0, 0.0);
          vec3 B = vec3(0.0, 1.0, 0.0);
          if (hasNormalMap > 0.5) {
            vec3 normalTex = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;
            vec3 dpdx = dFdx(vWorldPosition);
            vec3 dpdy = dFdy(vWorldPosition);
            vec2 duvdx = dFdx(vUv);
            vec2 duvdy = dFdy(vUv);

            vec3 N = geomNormal;
            T = normalize(dpdx * duvdy.y - dpdy * duvdx.y);
            B = -normalize(cross(N, T));
            mat3 TBN = mat3(T, B, N);
            normal = normalize(TBN * normalTex);
          }

          vec4 dayColor = texture2D(dayMap, vUv);

          // 1. Water mask derivation:
          // Earth oceans have low red reflectance (r < 0.25) and dominant blue
          float waterMask = smoothstep(0.30, 0.08, dayColor.r) * smoothstep(0.08, 0.25, dayColor.b);
          // Polar ice caps have high albedo across all channels
          float iceMask = smoothstep(0.55, 0.85, (dayColor.r + dayColor.g + dayColor.b) / 3.0);
          waterMask = waterMask * (1.0 - iceMask); // Ice is matte, not liquid water specular

          // 2. Solar diffuse lighting:
          float NdotL = dot(normal, sunDir);
          float dayFactor = smoothstep(-0.06, 0.22, NdotL);

          // 3. Restrained Ocean Specular reflection (Blinn-Phong lobe):
          vec3 halfVec = normalize(sunDir + viewDir);
          float NdotH = max(0.0, dot(normal, halfVec));
          float specularPower = 64.0;
          float oceanSpecular = pow(NdotH, specularPower) * waterMask * dayFactor * 1.35;

          // 4. Night-side city lights (strictly dark side only):
          float nightFactor = 1.0 - smoothstep(-0.12, 0.02, NdotL);
          vec3 cityLights = vec3(0.0);
          if (hasNightMap > 0.5) {
            vec4 nightTex = texture2D(nightMap, vUv);
            cityLights = nightTex.rgb * vec3(1.25, 1.10, 0.90) * nightFactor * 1.35;
          }

          // 5. Twilight sunset reddening along the terminator:
          float twilightBand = smoothstep(-0.06, 0.02, NdotL) * (1.0 - smoothstep(0.02, 0.20, NdotL));
          vec3 twilightGlow = vec3(0.85, 0.35, 0.12) * twilightBand * 0.35;

          // 6. Direct sunlight illumination with soft ambient fill:
          vec3 sunlightColor = vec3(1.0, 0.98, 0.92) * 1.35;
          vec3 ambientColor = vec3(0.022, 0.025, 0.035); // Deep space starlight fill

          vec3 surfaceColor = dayColor.rgb * (sunlightColor * dayFactor + twilightGlow + ambientColor);

          // 7. Cloud shadows cast onto terrain & ocean:
          if (hasCloudsMap > 0.5) {
            vec2 cloudUVOffset = vec2(dot(T, sunDir), dot(B, sunDir)) * 0.0035;
            float cloudShadow = texture2D(cloudsMap, vUv + cloudUVOffset).r;
            float shadowFactor = 1.0 - smoothstep(0.12, 0.75, cloudShadow) * 0.42 * dayFactor;
            surfaceColor *= shadowFactor;
          }

          surfaceColor += vec3(0.95, 0.98, 1.0) * oceanSpecular; // Crisp specular glint
          surfaceColor += cityLights; // Night cities

          // 8. Low over Earth: the tiles' water and aerial perspective (see PhotorealEarth)
          if (uNearAir > 0.001) {
            vec3 toEye = cameraPosition - vWorldPosition;
            float distKm = length(toEye) * uAirKmPerUnit;
            float sunUp = dot(geomNormal, normalize(uSunWorld - vWorldPosition));
            float dayK = smoothstep(-0.10, 0.16, sunUp);
            vec3 skyCol = apSky(sunUp);
            // The sea reflects the sky (Fresnel), as the tiles' water does
            float nv = max(dot(geomNormal, viewDir), 0.0);
            float fres = 0.02 + 0.98 * pow(1.0 - nv, 5.0);
            vec3 sea = mix(surfaceColor * 0.85, skyCol * (0.25 + 0.75 * dayK), fres);
            vec3 col = mix(surfaceColor, sea, waterMask);
            col = aerialPerspective(col, distKm, max(0.0, uAirCamAltKm * 0.5), uAirHaze, viewDir, sunDir, sunUp);
            surfaceColor = mix(surfaceColor, col, uNearAir);
          }

          gl_FragColor = vec4(surfaceColor, 1.0);

          #include <tonemapping_fragment>
          #include <colorspace_fragment>
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
  /**
   * Tropical cyclones in season, by basin (climatology: where and when they form), drifting west
   * and polewards through the month as real storms track. Up to four at once.
   */
  public static updateCyclones(mat: THREE.ShaderMaterial, utcMs: number, timeSec: number): void {
    const u = mat.uniforms;
    if (!u.uStorms) return;
    const d = new Date(utcMs);
    const month = d.getUTCMonth() + 1;
    const day = d.getUTCDate() + d.getUTCHours() / 24;
    const basins: Array<{ lon: number; lat: number; months: number[]; r: number }> = [
      { lon: -62, lat: 21, months: [8, 9, 10], r: 4.5 },          // North Atlantic hurricanes
      { lon: -112, lat: 15, months: [7, 8, 9], r: 3.8 },          // eastern North Pacific
      { lon: 132, lat: 17, months: [7, 8, 9, 10, 11], r: 5.2 },   // western North Pacific typhoons
      { lon: 88, lat: 15, months: [5, 10, 11], r: 4.0 },          // Bay of Bengal cyclones
      { lon: 68, lat: -16, months: [1, 2, 3], r: 4.4 },           // south Indian Ocean
      { lon: 122, lat: -15, months: [1, 2, 3], r: 4.0 },          // Australian region
      { lon: 175, lat: -17, months: [1, 2, 3], r: 4.2 },          // South Pacific
    ];
    let n = 0;
    for (const b of basins) {
      if (n >= 4 || !b.months.includes(month)) continue;
      const v = (u.uStorms.value as THREE.Vector4[])[n++];
      const pole = b.lat >= 0 ? 1 : -1;
      v.set(b.lon - day * 0.55, b.lat + pole * day * 0.12, b.r, 0.9);
    }
    u.uStormCount.value = n;
    u.uTime.value = timeSec;
  }

  public static createCloudMaterial(cloudsMap: THREE.Texture): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        uSunWorld: SUN_WORLD,
        cloudsMap: { value: cloudsMap },
        uFade: { value: 1.0 },
        uTime: { value: 0 },
        uStorms: { value: [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()] },
        uStormCount: { value: 0 },
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
        uniform vec3 uSunWorld;
        uniform sampler2D cloudsMap;
        uniform float uFade;
        uniform float uTime;
        uniform vec4 uStorms[4];   // (lon deg, lat deg, radius deg, strength)
        uniform int uStormCount;
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        // A tropical cyclone: spiral rain bands wound into a dense core around a clear eye,
        // turning anticlockwise in the north and clockwise in the south
        float cyclone(vec2 lonLat, vec4 s) {
          vec2 d = vec2((lonLat.x - s.x) * cos(radians(lonLat.y)), lonLat.y - s.y);
          if (abs(d.x) > 180.0) d.x -= sign(d.x) * 360.0;
          float r = length(d) / s.z;
          if (r > 1.8) return 0.0;
          float hemi = s.y >= 0.0 ? 1.0 : -1.0;
          float th = atan(d.y, d.x);
          float bands = 0.5 + 0.5 * sin(hemi * th * 2.0 - log(r + 0.04) * 6.5 + uTime * 0.12 * hemi);
          // Ragged convection: the bands break up into cells, borrowed from the cloud map's own detail
          float cells = texture2D(cloudsMap, vec2(th * 0.9 + r * 1.7, r * 2.3 - uTime * 0.01)).r;
          float core = smoothstep(0.5, 0.1, r) * (0.8 + 0.2 * cells);
          float body = smoothstep(1.7, 0.35, r) * mix(0.25, 1.0, bands) * (0.45 + 0.75 * cells);
          float eye = smoothstep(0.035, 0.085, r);
          return clamp(max(body, core) * eye, 0.0, 1.0) * s.w;
        }

        void main() {
          vec4 cloudTex = texture2D(cloudsMap, vUv);
          float cloudDensity = cloudTex.r * 0.92;
          vec2 lonLat = vec2(vUv.x * 360.0 - 180.0, vUv.y * 180.0 - 90.0);
          for (int i = 0; i < 4; i++) {
            if (i >= uStormCount) break;
            cloudDensity = max(cloudDensity, cyclone(lonLat, uStorms[i]) * 0.95);
          }
          if (cloudDensity < 0.025) discard;

          vec3 normal = normalize(vWorldNormal);
          vec3 sunDir = normalize(uSunWorld - vWorldPosition);

          // Sunlight on clouds
          float NdotL = dot(normal, sunDir);
          float dayFactor = smoothstep(-0.06, 0.22, NdotL);

          // Twilight sunset rim on clouds
          float twilight = smoothstep(-0.06, 0.04, NdotL) * (1.0 - smoothstep(0.04, 0.22, NdotL));
          vec3 cloudSunColor = mix(vec3(1.0, 0.98, 0.95), vec3(0.95, 0.48, 0.25), twilight * 0.75);

          vec3 cloudColor = cloudSunColor * (dayFactor * 1.25 + 0.035);

          gl_FragColor = vec4(cloudColor, cloudDensity * (0.35 + dayFactor * 0.55) * uFade);

          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
      transparent: true,
      depthWrite: false,
    });
  }
}
