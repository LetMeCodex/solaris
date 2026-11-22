import * as THREE from 'three';
import {
  SKY_AURORA,
  SKY_CIRRUS,
  SKY_OVERCAST,
  SKY_RAINBOW,
  SKY_STORM_TINT,
  SKY_TIME,
  clearSkyStarVisibility,
  computeAtmosphericStarVisibility,
  setSkyStarVisibility,
} from '../rendering/AerialPerspective';

/**
 * Sky seen from a planet's surface: single-scattering Rayleigh + Mie (Nishita-style), evaluated
 * per pixel on a dome around the observer. Parameters are physical where known (Earth: standard
 * clear-sky coefficients; Mars: CO₂ Rayleigh + suspended dust, τ≈0.5) and approximate for the
 * giant planets. Venus's surface sits under a total overcast. Light scattered more than once is
 * added as a soft isotropic term (it is most of what lights the sky in twilight), and the exposure
 * adapts after sunset as the eye does, so civil twilight is a glowing blue, not black.
 */
export interface AtmosphereModel {
  kind: 'none' | 'scatter' | 'overcast';
  label: string;
  /** Planet radius and atmosphere height (m). */
  radius: number;
  top: number;
  /** Scale heights (m). */
  hr: number;
  hm: number;
  /** Rayleigh scattering, Mie scattering, Mie extinction and extra absorption (1/m, RGB). */
  betaR: [number, number, number];
  betaMs: [number, number, number];
  betaMe: [number, number, number];
  betaA: [number, number, number];
  /** Mie anisotropy per channel (bluer light more forward-peaked for Martian dust). */
  g: [number, number, number];
  sunIntensity: number;
  /** Horizontal visibility near the ground (km), for aerial perspective. */
  visibilityKm: number;
  overcast?: [number, number, number];
}

const NONE: AtmosphereModel = {
  kind: 'none', label: 'No atmosphere — black sky, stars by day', radius: 1, top: 1, hr: 1, hm: 1,
  betaR: [0, 0, 0], betaMs: [0, 0, 0], betaMe: [0, 0, 0], betaA: [0, 0, 0], g: [0.8, 0.8, 0.8], sunIntensity: 0, visibilityKm: 0,
};

export const ATMOSPHERES: Record<string, AtmosphereModel> = {
  Earth: {
    kind: 'scatter', label: 'Rayleigh + aerosol scattering (clear sky)',
    radius: 6371e3, top: 80e3, hr: 8e3, hm: 1.2e3,
    betaR: [5.802e-6, 13.558e-6, 33.1e-6], betaMs: [3.996e-6, 3.996e-6, 3.996e-6], betaMe: [4.4e-6, 4.4e-6, 4.4e-6],
    betaA: [0.65e-6, 1.881e-6, 0.085e-6], // ozone (Hillaire 2020)
    g: [0.8, 0.8, 0.8], sunIntensity: 22, visibilityKm: 60,
  },
  Mars: {
    kind: 'scatter', label: 'Thin CO₂ + suspended dust (τ≈0.5): butterscotch day, blue sunset',
    radius: 3389.5e3, top: 80e3, hr: 11.1e3, hm: 11.1e3,
    betaR: [0.24e-6, 0.56e-6, 1.38e-6],
    betaMs: [4.3e-5, 3.4e-5, 2.2e-5], betaMe: [4.5e-5, 4.5e-5, 4.6e-5], betaA: [0, 0, 0],
    g: [0.68, 0.76, 0.88], sunIntensity: 9, visibilityKm: 35,
  },
  Venus: {
    ...NONE, kind: 'overcast', label: 'Total overcast: the clouds hide the sky (dim orange daylight)',
    overcast: [0.55, 0.36, 0.16], visibilityKm: 12,
  },
  Titan: {
    // Optical depth of the haze is ~5: from the ground Saturn, the Sun's disc and the stars are lost
    ...NONE, kind: 'overcast', label: 'Thick nitrogen–methane haze: Saturn and the stars are hidden from the ground',
    overcast: [0.36, 0.22, 0.08], visibilityKm: 10,
  },
  Jupiter: {
    kind: 'scatter', label: 'H₂/He Rayleigh sky above the clouds (approximate)',
    radius: 69911e3, top: 400e3, hr: 27e3, hm: 8e3,
    betaR: [1.7e-6, 4.0e-6, 9.8e-6], betaMs: [1.2e-6, 1.2e-6, 1.1e-6], betaMe: [1.6e-6, 1.6e-6, 1.6e-6], betaA: [0.4e-6, 0.3e-6, 0.6e-6],
    g: [0.75, 0.75, 0.75], sunIntensity: 22, visibilityKm: 400,
  },
  Saturn: {
    kind: 'scatter', label: 'H₂/He Rayleigh sky above the haze (approximate)',
    radius: 58232e3, top: 500e3, hr: 59e3, hm: 15e3,
    betaR: [0.8e-6, 1.9e-6, 4.6e-6], betaMs: [1.4e-6, 1.3e-6, 1.1e-6], betaMe: [1.8e-6, 1.8e-6, 1.8e-6], betaA: [0.2e-6, 0.25e-6, 0.5e-6],
    g: [0.75, 0.75, 0.75], sunIntensity: 22, visibilityKm: 500,
  },
  Uranus: {
    kind: 'scatter', label: 'H₂ Rayleigh with methane absorbing red light (approximate)',
    radius: 25362e3, top: 300e3, hr: 28e3, hm: 10e3,
    betaR: [1.2e-6, 2.9e-6, 7.1e-6], betaMs: [0.4e-6, 0.4e-6, 0.4e-6], betaMe: [0.5e-6, 0.5e-6, 0.5e-6], betaA: [6e-6, 0.8e-6, 0.2e-6],
    g: [0.75, 0.75, 0.75], sunIntensity: 22, visibilityKm: 300,
  },
  Neptune: {
    kind: 'scatter', label: 'H₂ Rayleigh with methane absorbing red light (approximate)',
    radius: 24622e3, top: 300e3, hr: 20e3, hm: 10e3,
    betaR: [1.4e-6, 3.4e-6, 8.3e-6], betaMs: [0.4e-6, 0.4e-6, 0.4e-6], betaMe: [0.5e-6, 0.5e-6, 0.5e-6], betaA: [7e-6, 1.0e-6, 0.2e-6],
    g: [0.75, 0.75, 0.75], sunIntensity: 22, visibilityKm: 300,
  },
};

export function atmosphereFor(body: string): AtmosphereModel {
  return ATMOSPHERES[body] ?? NONE;
}

const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize((modelMatrix * vec4(position, 0.0)).xyz);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uEast;
  uniform vec3 uUp;
  uniform vec3 uNorth;
  uniform vec3 uSunDir;
  uniform float uRadius;
  uniform float uTop;
  uniform float uHr;
  uniform float uHm;
  uniform vec3 uBetaR;
  uniform vec3 uBetaMs;
  uniform vec3 uBetaMe;
  uniform vec3 uBetaA;
  uniform vec3 uG;
  uniform float uSunI;
  uniform float uEye;
  uniform float uMode;      // 1 scatter · 2 overcast
  uniform vec3 uOvercast;
  uniform float uSunElev;   // sine of the solar elevation (overcast brightness)
  uniform float uExposure;
  uniform float uStarDim;   // 0 at night … 1 in daylight: the sky drowns the stars
  uniform float uMulti;     // strength of the multiple-scattering term
  uniform float uWeatherOvercast; // 0 clear … 1 storm deck (Earth weather coupling)
  uniform float uIsEarth;
  uniform float uCirrus;
  uniform float uAurora;
  uniform float uRainbow;
  uniform float uStormTint;
  uniform float uTime;
  varying vec3 vDir;

  const float PI = 3.14159265;

  float skyHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float skyNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(skyHash(i), skyHash(i + vec2(1.0, 0.0)), f.x),
      mix(skyHash(i + vec2(0.0, 1.0)), skyHash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  float skyFbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 4; i++) {
      v += a * skyNoise(p);
      p = rot * p * 2.04 + vec2(13.1, 7.7);
      a *= 0.5;
    }
    return v;
  }

  // Physically-inspired rainbow spectral dispersion for wavelength parameter t in [0..1] (violet -> red)
  vec3 rainbowSpectrum(float t) {
    vec3 c = clamp(abs(mod(t * 5.2 + vec3(4.6, 2.8, 0.9), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c * c * (3.0 - 2.0 * c);
  }

  // Jorge Jimenez Interleaved Gradient Noise with triangular PDF to eliminate 8-bit sky banding
  float ign(vec2 p) {
    return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
  }
  vec3 ditherLinearSky(vec3 col) {
    float peak = max(col.r, max(col.g, col.b));
    if (peak < 0.0002) return col;
    vec2 p = gl_FragCoord.xy;
    vec3 n1 = vec3(ign(p), ign(p + vec2(17.0, 31.0)), ign(p + vec2(47.0, 11.0)));
    vec3 n2 = vec3(ign(p + vec2(5.5, 13.5)), ign(p + vec2(29.5, 7.5)), ign(p + vec2(61.5, 23.5)));
    vec3 tri = (n1 + n2) - 1.0;
    vec3 lsb = max(vec3(0.00035), pow(max(col, vec3(0.0002)), vec3(0.55)) * (1.8 / 255.0));
    float mask = smoothstep(0.0002, 0.0025, peak);
    return max(vec3(0.0), col + tri * lsb * mask);
  }

  vec2 raySphere(vec3 o, vec3 d, float r) {
    float b = dot(o, d);
    float c = dot(o, o) - r * r;
    float h = b * b - c;
    if (h < 0.0) return vec2(1e30, -1e30);
    h = sqrt(h);
    return vec2(-b - h, -b + h);
  }

  vec3 phaseM(float mu) {
    vec3 g = uG;
    vec3 g2 = g * g;
    return 3.0 / (8.0 * PI) * ((1.0 - g2) * (1.0 + mu * mu)) / ((2.0 + g2) * pow(1.0 + g2 - 2.0 * g * mu, vec3(1.5)));
  }

  void main() {
    vec3 dw = normalize(vDir);
    vec3 d = vec3(dot(dw, uEast), dot(dw, uUp), dot(dw, uNorth));
    vec3 s = vec3(dot(uSunDir, uEast), dot(uSunDir, uUp), dot(uSunDir, uNorth));

    if (uMode > 1.5) {
      // Venus: diffuse light through ~90 bar of cloud and CO₂; no direct sky
      float day = smoothstep(-0.12, 0.25, uSunElev);
      float grad = 0.75 + 0.25 * clamp(d.y, 0.0, 1.0);
      vec3 col = ditherLinearSky(uOvercast * (0.04 + 0.6 * day) * grad * uExposure);
      gl_FragColor = vec4(col, 0.0);
      return;
    }

    vec3 o = vec3(0.0, uRadius + uEye, 0.0);
    // Below the horizon the ground is drawn by the terrain: where it is not drawn (yet), the dome
    // shows the air just above the horizon, a bright haze, rather than a dark band of planet
    float dipY = -sqrt(max(0.0, 1.0 - pow(uRadius / (uRadius + uEye), 2.0)));
    if (d.y < dipY + 0.002) {
      vec2 hz = normalize(d.xz + vec2(1e-6));
      float y = dipY + 0.002;
      d = vec3(hz.x * sqrt(1.0 - y * y), y, hz.y * sqrt(1.0 - y * y));
    }
    vec2 at = raySphere(o, d, uRadius + uTop);
    vec2 gr = raySphere(o, d, uRadius);
    float tEnd = at.y;
    if (gr.x > 0.0) tEnd = min(tEnd, gr.x);
    const int N = 16;
    const int M = 6;
    float seg = tEnd / float(N);
    vec3 sumR = vec3(0.0);
    vec3 sumM = vec3(0.0);
    float odR = 0.0;
    float odM = 0.0;
    for (int i = 0; i < N; i++) {
      vec3 p = o + d * (seg * (float(i) + 0.5));
      float h = length(p) - uRadius;
      float hrr = exp(-h / uHr) * seg;
      float hmm = exp(-h / uHm) * seg;
      odR += hrr;
      odM += hmm;
      // Light path to the Sun
      vec2 ls = raySphere(p, s, uRadius);
      if (ls.y > ls.x && ls.x > 0.0) continue; // in the planet's shadow
      float lseg = raySphere(p, s, uRadius + uTop).y / float(M);
      float lR = 0.0;
      float lM = 0.0;
      for (int j = 0; j < M; j++) {
        vec3 q = p + s * (lseg * (float(j) + 0.5));
        float hq = length(q) - uRadius;
        lR += exp(-hq / uHr) * lseg;
        lM += exp(-hq / uHm) * lseg;
      }
      vec3 tau = uBetaR * (odR + lR) + uBetaMe * (odM + lM) + uBetaA * (odR + lR);
      vec3 att = exp(-tau);
      sumR += att * hrr;
      sumM += att * hmm;
    }
    float mu = dot(d, s);
    float pr = 3.0 / (16.0 * PI) * (1.0 + mu * mu);
    vec3 single = sumR * uBetaR * pr + sumM * uBetaMs * phaseM(mu);
    // Multiple scattering (approx.): light already scattered once, spread evenly over the sky
    vec3 multi = (sumR * uBetaR + sumM * uBetaMs) * (uMulti / (4.0 * PI));
    vec3 col = uSunI * (single + multi);
    // The long, low paths near the horizon are lit by the whole sky above them, not only by the
    // direct sunlight that reaches them (reddened on the way): with the Sun well up the horizon is
    // the pale, whitened colour of the world's own sky (blue-white on Earth, a warm white on Mars),
    // not the yellow band single scattering leaves. Brightness is kept; low Suns keep their glow
    vec3 skyTint = pow(uBetaR / max(max(uBetaR.r, uBetaR.g), uBetaR.b), vec3(0.15));
    skyTint /= dot(skyTint, vec3(0.2126, 0.7152, 0.0722));
    float thick = 1.0 - exp(-(uBetaR.g * odR + uBetaMe.g * odM) * 0.9);
    float msK = thick * smoothstep(0.06, 0.3, s.y) * 0.7;
    col = mix(col, dot(col, vec3(0.2126, 0.7152, 0.0722)) * skyTint, msK);
    vec3 trans = exp(-(uBetaR * odR + uBetaMe * odM + uBetaA * odR));
    col *= uExposure;
    // Couple Earth rain/snow/storm weather to an actual overcast cloud deck so precipitation
    // never falls out of a bright clear blue sky.
    float belowCloud = 1.0 - smoothstep(6000.0, 14000.0, uEye);
    float weatherOv = clamp(uWeatherOvercast * uIsEarth * belowCloud, 0.0, 1.0);
    if (weatherOv > 0.001) {
      float dayLit = smoothstep(-0.14, 0.28, s.y);
      float zenithShade = mix(0.88, 0.46, clamp(d.y, 0.0, 1.0));
      vec3 ovDay = vec3(0.24, 0.28, 0.34) * zenithShade;
      // Severe supercell thunderstorm hail-core teal-green horizon tint (@RiadEtm Beauce supercell)
      vec3 supercellTint = vec3(0.14, 0.27, 0.26) * zenithShade * (1.0 - smoothstep(0.05, 0.45, d.y));
      ovDay = mix(ovDay, ovDay * 0.72 + supercellTint * 0.85, clamp(uStormTint, 0.0, 1.0));
      vec3 ovTwilight = vec3(0.09, 0.10, 0.14) * zenithShade;
      vec3 ovNight = vec3(0.012, 0.015, 0.022) * zenithShade;
      vec3 ovCol = mix(ovNight, mix(ovTwilight, ovDay, smoothstep(0.0, 0.35, s.y)), dayLit) * uExposure;
      col = mix(col, ovCol, weatherOv * 0.90);
    }

    // --- High-Altitude Backlit Cirrus & Banner Wisps (9-12 km MSL: Uluru, Mt. Fuji, Khumbu) ---
    if (uIsEarth > 0.5 && uCirrus > 0.01 && d.y > 0.025 && uEye < 18000.0) {
      float cirrusAltFade = 1.0 - smoothstep(10500.0, 17500.0, uEye);
      float projR = 1.0 / (d.y + 0.14);
      vec2 cuv = d.xz * projR * 1.35 + vec2(uTime * 0.0038, uTime * 0.0014);
      // Wind-sheared domain-warped filaments
      float warp = skyFbm(cuv * 1.4 + vec2(3.2, -1.7));
      vec2 sheared = vec2(cuv.x * 0.55 + warp * 0.85, cuv.y * 2.15 + warp * 0.55);
      float wisp = skyFbm(sheared * 1.75) * 0.65 + skyFbm(sheared * 3.8 - vec2(uTime * 0.006, 0.0)) * 0.35;
      float thresh = mix(0.68, 0.36, clamp(uCirrus, 0.0, 1.0));
      float cAlpha = smoothstep(thresh, thresh + 0.28, wisp) * smoothstep(0.025, 0.18, d.y) * cirrusAltFade * (1.0 - weatherOv * 0.78);
      // Vibrant backlit peach-coral-amber at sunrise/sunset/alpenglow; crisp white by day
      float golden = (1.0 - smoothstep(0.02, 0.32, s.y)) * smoothstep(-0.12, 0.02, s.y);
      float dayC = smoothstep(-0.08, 0.16, s.y);
      float fwdSun = pow(max(mu, 0.0), 4.0);
      vec3 cDay = vec3(0.95, 0.97, 1.0) * (0.78 + 0.35 * fwdSun);
      vec3 cGold = mix(vec3(1.0, 0.44, 0.28), vec3(1.0, 0.72, 0.46), fwdSun) * 1.35;
      vec3 cNight = vec3(0.025, 0.035, 0.06);
      vec3 cCol = mix(cNight, mix(cDay, cGold, golden), dayC) * uExposure;
      col = mix(col, cCol, clamp(cAlpha * 0.62, 0.0, 0.78));
    }

    // --- Physically-Based 42° Primary & 51° Secondary Double Rainbow + Alexander's Band ---
    if (uIsEarth > 0.5 && uRainbow > 0.01 && d.y > 0.0 && s.y > 0.01 && uEye < 8000.0) {
      float antiAngleDeg = degrees(acos(clamp(dot(d, -s), -1.0, 1.0)));
      // Primary bow: 40.2° (violet) -> 42.4° (red); Secondary bow: 50.3° (red) -> 53.1° (violet)
      float p1 = (antiAngleDeg - 40.2) / 2.2;
      float w1 = smoothstep(0.0, 0.18, p1) * (1.0 - smoothstep(0.82, 1.0, p1));
      float p2 = (53.1 - antiAngleDeg) / 2.8;
      float w2 = smoothstep(0.0, 0.22, p2) * (1.0 - smoothstep(0.78, 1.0, p2));
      // Alexander's dark band (43°..50°) + brighter supernumerary interior (< 40°)
      float alexDark = smoothstep(42.5, 44.5, antiAngleDeg) * (1.0 - smoothstep(48.5, 50.5, antiAngleDeg));
      float innerBright = 1.0 - smoothstep(38.0, 41.0, antiAngleDeg);
      float rbFade = uRainbow * smoothstep(0.0, 0.09, d.y) * (1.0 - smoothstep(4500.0, 7500.0, uEye));
      col *= 1.0 - 0.10 * alexDark * rbFade + 0.06 * innerBright * rbFade;
      vec3 bowCol = rainbowSpectrum(clamp(p1, 0.0, 1.0)) * w1 * 0.24
                  + rainbowSpectrum(clamp(p2, 0.0, 1.0)) * w2 * 0.095;
      col += bowCol * rbFade * uExposure * smoothstep(0.01, 0.14, s.y);
    }

    // --- Volumetric Shimmering Aurora Borealis & Australis Curtains (NOAA SWPC Kp Oval) ---
    // Sweeping vertical magnetic curtains visible right above the polar horizon (d.y 0.04..0.72)
    // matching @RiadEtm Lofoten: emerald 557.7 nm core + crimson/magenta 630 nm lower fringe.
    if (uIsEarth > 0.5 && uAurora > 0.01 && d.y > 0.025) {
      float aurFade = uAurora * smoothstep(0.025, 0.14, d.y) * (1.0 - smoothstep(0.65, 0.96, d.y)) * (1.0 - weatherOv * 0.80);
      if (aurFade > 0.005) {
        float az = atan(d.x, d.z);
        vec3 aurSum = vec3(0.0);
        // 3 sweeping concentric auroral arcs across the horizon-to-mid sky with 5 vertical ray slices
        for (int arc = 0; arc < 3; arc++) {
          float fa = float(arc);
          float baseElev = 0.13 + fa * 0.11;
          float azFreq = 2.1 + fa * 0.75;
          float phase = uTime * (0.14 + fa * 0.05) + fa * 2.1;
          float sway = sin(az * azFreq + phase) * 0.07 + cos(az * (azFreq * 1.7) - phase * 0.8) * 0.04;
          float arcElev = baseElev + sway;
          // Vertical curtain height above the lower magnetic edge
          float relH = (d.y - arcElev) / (0.16 + fa * 0.05);
          if (relH > -0.15 && relH < 1.35) {
            // Sharp luminous lower border tapering softly upward along geomagnetic field lines
            float vertEnv = smoothstep(-0.12, 0.12, relH) * exp(-max(relH, 0.0) * 2.1);
            // Fine shimmering vertical rays along the magnetic curtain
            float rayCoord = az * (14.0 + fa * 5.0) + sin(uTime * 0.25 + fa) * 1.5;
            float rays = 0.35 + 0.65 * skyFbm(vec2(rayCoord, relH * 1.15 - uTime * 0.12 + fa * 3.7));
            float fineRays = 0.55 + 0.45 * skyNoise(vec2(az * 42.0 + sway * 12.0, uTime * 0.35 + fa * 5.0));
            // Physical O(1S) 557.7 nm emerald green core, N2+ crimson/magenta lower fringe, O(1D) violet top
            vec3 crimsonCol = vec3(0.92, 0.14, 0.54);
            vec3 emeraldCol = vec3(0.08, 1.00, 0.50);
            vec3 violetTop  = vec3(0.42, 0.16, 0.82);
            vec3 curCol = relH < 0.18
              ? mix(crimsonCol, emeraldCol, smoothstep(-0.05, 0.18, relH))
              : mix(emeraldCol, violetTop, smoothstep(0.32, 1.15, relH));
            aurSum += curCol * vertEnv * rays * fineRays * (0.68 - fa * 0.14);
          }
        }
        col += aurSum * aurFade * (1.55 + 0.18 * uExposure);
      }
    }

    float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
    // Background (stars) is dimmed by extinction and drowned by a bright sky or overcast deck
    float through = dot(trans, vec3(0.333)) * (1.0 - smoothstep(0.012, 0.30, lum)) * (1.0 - uStarDim) * (1.0 - weatherOv * 0.94);
    col = ditherLinearSky(col);
    gl_FragColor = vec4(col, max(0.0, through));
  }
`;

/** Full-sky dome around the camera; draws over the stars and under the sky bodies. */
export class SkyAtmosphere {
  public readonly mesh: THREE.Mesh;
  private material: THREE.ShaderMaterial;
  public model: AtmosphereModel = NONE;
  private static readonly EXPOSURE = 1.15;

  constructor() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uEast: { value: new THREE.Vector3(1, 0, 0) },
        uUp: { value: new THREE.Vector3(0, 1, 0) },
        uNorth: { value: new THREE.Vector3(0, 0, -1) },
        uSunDir: { value: new THREE.Vector3(0, 1, 0) },
        uRadius: { value: 6371e3 },
        uTop: { value: 80e3 },
        uHr: { value: 8e3 },
        uHm: { value: 1.2e3 },
        uBetaR: { value: new THREE.Vector3() },
        uBetaMs: { value: new THREE.Vector3() },
        uBetaMe: { value: new THREE.Vector3() },
        uBetaA: { value: new THREE.Vector3() },
        uG: { value: new THREE.Vector3(0.8, 0.8, 0.8) },
        uSunI: { value: 22 },
        uEye: { value: 400 },
        uMode: { value: 1 },
        uOvercast: { value: new THREE.Vector3() },
        uSunElev: { value: 0 },
        uExposure: { value: 1.15 },
        uStarDim: { value: 0 },
        uMulti: { value: 0.1 },
        uWeatherOvercast: SKY_OVERCAST,
        uIsEarth: { value: 0 },
        uCirrus: SKY_CIRRUS,
        uAurora: SKY_AURORA,
        uRainbow: SKY_RAINBOW,
        uStormTint: SKY_STORM_TINT,
        uTime: SKY_TIME,
      },
      vertexShader,
      fragmentShader,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: true,
      transparent: true,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.SrcAlphaFactor,
    });
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), this.material);
    this.mesh.name = 'surface_sky_atmosphere';
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 40;
    this.mesh.visible = false;
  }

  public setModel(model: AtmosphereModel): void {
    this.model = model;
    const u = this.material.uniforms;
    u.uRadius.value = model.radius;
    u.uTop.value = model.top;
    u.uHr.value = model.hr;
    u.uHm.value = model.hm;
    u.uBetaR.value.fromArray(model.betaR);
    u.uBetaMs.value.fromArray(model.betaMs);
    u.uBetaMe.value.fromArray(model.betaMe);
    u.uBetaA.value.fromArray(model.betaA);
    u.uG.value.fromArray(model.g);
    u.uSunI.value = model.sunIntensity;
    u.uMode.value = model.kind === 'overcast' ? 2 : 1;
    u.uIsEarth.value = model === ATMOSPHERES.Earth ? 1 : 0;
    if (model.overcast) u.uOvercast.value.fromArray(model.overcast);
  }

  /**
   * @param centre camera position (the dome is centred on it)
   * @param radius dome radius in render units (inside the far plane, outside the ground near by)
   */
  public update(
    centre: THREE.Vector3,
    radius: number,
    frame: { east: THREE.Vector3; north: THREE.Vector3; up: THREE.Vector3 },
    sunDir: THREE.Vector3,
    eyeHeightM: number,
    enabled: boolean
  ): void {
    this.mesh.visible = enabled && this.model.kind !== 'none';
    if (!this.mesh.visible) {
      clearSkyStarVisibility('surface');
      return;
    }
    this.mesh.position.copy(centre);
    this.mesh.scale.setScalar(radius);
    const u = this.material.uniforms;
    u.uEast.value.copy(frame.east);
    u.uUp.value.copy(frame.up);
    u.uNorth.value.copy(frame.north);
    u.uSunDir.value.copy(sunDir);
    // Keep camera altitude strictly below atmosphere top so outer sky rays stay valid even at high relief/vantage
    u.uEye.value = Math.min(Math.max(2, eyeHeightM), Math.max(100, this.model.top * 0.95));
    u.uSunElev.value = sunDir.dot(frame.up);
    // Stars fade from nautical/civil twilight through sunrise, and re-emerge in upper stratosphere/space
    const sunAlt = (Math.asin(THREE.MathUtils.clamp(u.uSunElev.value, -1, 1)) * 180) / Math.PI;
    const isEarth = u.uIsEarth.value > 0.5;
    const starVis = this.model.kind === 'overcast'
      ? 0
      : computeAtmosphericStarVisibility({
          altKm: eyeHeightM / 1000,
          scaleHeightKm: this.model.hr / 1000,
          topKm: this.model.top / 1000,
          sunUp: u.uSunElev.value,
          overcast: isEarth ? SKY_OVERCAST.value : 0,
        });
    setSkyStarVisibility('surface', starVis, () => this.mesh.visible);
    const thin = 1 - THREE.MathUtils.smoothstep(eyeHeightM, 20000, 55000);
    const legacyDim = this.model.kind === 'scatter' ? THREE.MathUtils.smoothstep(sunAlt, -10, -1) * this.starDimScale * thin : 1;
    u.uStarDim.value = Math.max(legacyDim, 1 - starVis);
    // The eye adapts after sunset: twilight reads as a lit sky, not the black of a daytime exposure
    const dusk = THREE.MathUtils.smoothstep(-sunAlt, -1, 5);
    u.uExposure.value = SkyAtmosphere.EXPOSURE * (1 + 7 * dusk);
    // By day single scattering already looks right; in twilight most of the light is multiply scattered
    u.uMulti.value = 0.1 + 1.1 * dusk;
  }

  /** Thin atmospheres (giants' upper air in dim sunlight) dim the stars less. */
  private get starDimScale(): number {
    return this.model.radius > 2e7 ? 0.6 : 1;
  }

  public dispose(): void {
    clearSkyStarVisibility('surface');
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}

/**
 * Colour of sunlight after passing through the atmosphere at a given solar elevation (RGB
 * transmittance, Kasten–Young air mass). Used to redden the Sun, Moon and planets near the
 * horizon and to tint the ground light.
 */
export function transmittance(model: AtmosphereModel, altitudeDeg: number): [number, number, number] {
  if (model.kind === 'none') return [1, 1, 1];
  if (model.kind === 'overcast') return [0, 0, 0];
  if (altitudeDeg < -2) return [0, 0, 0];
  const a = Math.max(altitudeDeg, -1.5);
  const airmass = 1 / (Math.sin((a * Math.PI) / 180) + 0.50572 * Math.pow(a + 6.07995, -1.6364));
  const out: [number, number, number] = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    const tau = (model.betaR[i] + model.betaA[i]) * model.hr + model.betaMe[i] * model.hm;
    out[i] = Math.exp(-tau * Math.min(airmass, 40));
  }
  return out;
}
