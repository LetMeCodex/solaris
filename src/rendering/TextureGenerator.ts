import * as THREE from 'three';

/**
 * High-performance procedural planetary texture synthesizer.
 * Creates deterministic, high-resolution textures on HTML5 canvas
 * and caches them as GPU-ready Three.js textures.
 */
export class TextureGenerator {
  private static cache: Map<string, THREE.CanvasTexture> = new Map();

  public static getTexture(name: string): THREE.CanvasTexture {
    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }

    let texture: THREE.CanvasTexture;
    switch (name) {
      case 'Sun':
        texture = this.createSunTexture();
        break;
      case 'Mercury':
        texture = this.createMercuryTexture();
        break;
      case 'Venus':
        texture = this.createVenusTexture();
        break;
      case 'Earth':
        texture = this.createEarthTexture();
        break;
      case 'EarthClouds':
        texture = this.createEarthCloudsTexture();
        break;
      case 'Mars':
        texture = this.createMarsTexture();
        break;
      case 'Jupiter':
        texture = this.createJupiterTexture();
        break;
      case 'Saturn':
        texture = this.createSaturnTexture();
        break;
      case 'SaturnRings':
        texture = this.createSaturnRingsTexture();
        break;
      case 'Uranus':
        texture = this.createUranusTexture();
        break;
      case 'Neptune':
        texture = this.createNeptuneTexture();
        break;
      case 'Moon':
        texture = this.createMoonTexture();
        break;
      case 'Io':
        texture = this.createIoTexture();
        break;
      case 'Europa':
        texture = this.createEuropaTexture();
        break;
      case 'Ganymede':
        texture = this.createGanymedeTexture();
        break;
      case 'Callisto':
        texture = this.createCallistoTexture();
        break;
      case 'Titan':
        texture = this.createTitanTexture();
        break;
      case 'Enceladus':
        texture = this.createEnceladusTexture();
        break;
      case 'Triton':
        texture = this.createTritonTexture();
        break;
      case 'Pluto':
        texture = this.createPlutoTexture();
        break;
      case 'Ceres':
        texture = this.createCeresTexture();
        break;
      default:
        texture = name.startsWith('minor:')
          ? this.createRegolithTexture(name.slice(6) as 'dark' | 'grey' | 'icy' | 'red')
          : this.createRockyCrateredTexture(name);
    }

    this.cache.set(name, texture);
    return texture;
  }

  // --- 1. SUN PHOTOSPHERE ---
  private static createSunTexture(): THREE.CanvasTexture {
    const w = 1024, h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Base fiery gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#fff4cc');
    grad.addColorStop(0.5, '#ffbb33');
    grad.addColorStop(1, '#ff8800');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Convective granules
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % w;
      const y = Math.floor((i / 4) / w);
      // Simplex-like noise approximation
      const n1 = Math.sin(x * 0.05) * Math.cos(y * 0.05);
      const n2 = Math.sin(x * 0.12 + 1.2) * Math.cos(y * 0.12 + 0.8);
      const n3 = Math.sin(x * 0.25) * Math.sin(y * 0.25);
      const granule = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);

      data[i] = Math.min(255, Math.max(180, 245 + granule * 35));     // R
      data[i + 1] = Math.min(240, Math.max(120, 180 + granule * 55)); // G
      data[i + 2] = Math.min(180, Math.max(20, 60 + granule * 40));   // B
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    // Sunspots / active regions
    ctx.fillStyle = 'rgba(120, 30, 0, 0.6)';
    for (let s = 0; s < 12; s++) {
      const sx = (s * 85 + 40) % w;
      const sy = 160 + ((s * 37) % 180);
      const r = 6 + (s % 5) * 3;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
      // Umbra center
      ctx.fillStyle = 'rgba(60, 10, 0, 0.85)';
      ctx.beginPath();
      ctx.arc(sx, sy, r * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 2. MERCURY CRATERED SURFACE ---
  private static createMercuryTexture(): THREE.CanvasTexture {
    const w = 1024, h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#78736d';
    ctx.fillRect(0, 0, w, h);

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % w;
      const y = Math.floor((i / 4) / w);
      const noise = (Math.sin(x * 0.08) * Math.cos(y * 0.08) + Math.sin(x * 0.2) * Math.sin(y * 0.2)) * 18;
      const base = 120 + noise;
      data[i] = base * 0.95;
      data[i + 1] = base * 0.93;
      data[i + 2] = base * 0.90;
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    // Impact craters with rim highlights
    for (let c = 0; c < 120; c++) {
      const cx = (c * 79 + 33) % w;
      const cy = 20 + ((c * 47) % (h - 40));
      const cr = 4 + (c % 15) * 2;
      
      // Shadow interior
      ctx.fillStyle = 'rgba(40, 38, 36, 0.4)';
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();

      // Rim highlight
      ctx.strokeStyle = 'rgba(210, 205, 200, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, Math.PI * 0.8, Math.PI * 1.8);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 3. VENUS CLOUD ENVELOPE ---
  private static createVenusTexture(): THREE.CanvasTexture {
    const w = 1024, h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#f0d8a8');
    grad.addColorStop(0.2, '#ecd096');
    grad.addColorStop(0.5, '#e5c483');
    grad.addColorStop(0.8, '#ecd096');
    grad.addColorStop(1, '#f0d8a8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Swirling atmospheric bands
    ctx.fillStyle = 'rgba(215, 180, 110, 0.25)';
    for (let b = 0; b < 18; b++) {
      const y = b * (h / 18);
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= w; x += 30) {
        const offset = Math.sin(x * 0.015 + b) * 12 + Math.cos(x * 0.03) * 6;
        ctx.lineTo(x, y + offset);
      }
      ctx.lineTo(w, y + 20);
      ctx.lineTo(0, y + 20);
      ctx.closePath();
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 4. EARTH SURFACE (OCEANS & CONTINENTS) ---
  private static createEarthTexture(): THREE.CanvasTexture {
    const w = 1024, h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Deep blue ocean baseline
    ctx.fillStyle = '#0f274a';
    ctx.fillRect(0, 0, w, h);

    // Ocean depth variation
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
    oceanGrad.addColorStop(0, 'rgba(25, 65, 115, 0.4)');
    oceanGrad.addColorStop(0.5, 'rgba(10, 35, 75, 0.1)');
    oceanGrad.addColorStop(1, 'rgba(25, 65, 115, 0.4)');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, w, h);

    // Continents (approximate continental landmasses)
    ctx.fillStyle = '#2d5930'; // Vegetated land

    // Eurasia / Africa block
    ctx.beginPath();
    ctx.ellipse(w * 0.58, h * 0.38, 140, 85, 0.1, 0, Math.PI * 2);
    ctx.ellipse(w * 0.53, h * 0.62, 70, 95, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // Americas
    ctx.beginPath();
    ctx.ellipse(w * 0.22, h * 0.32, 95, 75, -0.2, 0, Math.PI * 2);
    ctx.ellipse(w * 0.30, h * 0.65, 60, 90, 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Australia
    ctx.beginPath();
    ctx.ellipse(w * 0.82, h * 0.72, 45, 35, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Arid / Desert belts (Sahara, Australia, Middle East)
    ctx.fillStyle = '#9e8548';
    ctx.beginPath();
    ctx.ellipse(w * 0.52, h * 0.45, 65, 30, 0, 0, Math.PI * 2);
    ctx.ellipse(w * 0.82, h * 0.72, 28, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Polar ice caps
    ctx.fillStyle = '#f0f6ff';
    // North pole
    ctx.beginPath();
    ctx.rect(0, 0, w, 28);
    ctx.fill();
    // South pole (Antarctica)
    ctx.beginPath();
    ctx.rect(0, h - 36, w, 36);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 4B. EARTH CLOUD OVERLAY ---
  private static createEarthCloudsTexture(): THREE.CanvasTexture {
    const w = 1024, h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';

    // Swirling cloud bands
    for (let c = 0; c < 28; c++) {
      const cx = (c * 65 + 15) % w;
      const cy = 60 + ((c * 42) % (h - 120));
      const rx = 55 + (c % 7) * 15;
      const ry = 18 + (c % 4) * 6;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, (c % 5) * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 5. MARS REGOLITH & ICE CAPS ---
  private static createMarsTexture(): THREE.CanvasTexture {
    const w = 1024, h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Rust baseline
    ctx.fillStyle = '#bd532b';
    ctx.fillRect(0, 0, w, h);

    // Dark volcanic basalt provinces (Acidalia, Syrtis Major)
    ctx.fillStyle = 'rgba(68, 38, 25, 0.45)';
    ctx.beginPath();
    ctx.ellipse(w * 0.45, h * 0.52, 90, 45, 0.2, 0, Math.PI * 2);
    ctx.ellipse(w * 0.75, h * 0.42, 70, 50, -0.1, 0, Math.PI * 2);
    ctx.ellipse(w * 0.15, h * 0.58, 60, 35, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Olympus Mons & Tharsis volcanic shields
    ctx.fillStyle = 'rgba(165, 80, 45, 0.8)';
    ctx.beginPath();
    ctx.arc(w * 0.28, h * 0.45, 24, 0, Math.PI * 2);
    ctx.fill();
    // Caldera summit
    ctx.fillStyle = '#3a2015';
    ctx.beginPath();
    ctx.arc(w * 0.28, h * 0.45, 6, 0, Math.PI * 2);
    ctx.fill();

    // Polar ice caps
    ctx.fillStyle = '#f8f4f0';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, 12, 110, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h - 14, 85, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 6. JUPITER ZONAL JET STREAMS & GREAT RED SPOT ---
  private static createJupiterTexture(): THREE.CanvasTexture {
    const w = 1024, h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Alternating belts and zones
    const bands = [
      '#a88460', '#dec8aa', '#8f5c35', '#f2e2ce', '#9e673d',
      '#ebd5be', '#82522e', '#f5e8da', '#916139', '#e6cfb8'
    ];

    const bandH = h / bands.length;
    for (let b = 0; b < bands.length; b++) {
      ctx.fillStyle = bands[b];
      ctx.fillRect(0, b * bandH, w, bandH);
    }

    // Micro-eddies and turbulence along shear interfaces
    for (let b = 0; b < bands.length; b++) {
      const y = b * bandH;
      ctx.fillStyle = b % 2 === 0 ? 'rgba(80, 45, 20, 0.35)' : 'rgba(255, 245, 235, 0.35)';
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= w; x += 25) {
        const wave = Math.sin(x * 0.03 + b * 2) * 5 + Math.cos(x * 0.08) * 3;
        ctx.lineTo(x, y + wave);
      }
      ctx.lineTo(w, y + bandH * 0.5);
      ctx.lineTo(0, y + bandH * 0.5);
      ctx.closePath();
      ctx.fill();
    }

    // Great Red Spot (Southern Tropical Zone: latitude ~22° S)
    const grsX = w * 0.65;
    const grsY = h * 0.62;
    const grsGrad = ctx.createRadialGradient(grsX, grsY, 5, grsX, grsY, 32);
    grsGrad.addColorStop(0, '#c43d22');
    grsGrad.addColorStop(0.6, '#b5482e');
    grsGrad.addColorStop(1, '#8f5c35');
    ctx.fillStyle = grsGrad;
    ctx.beginPath();
    ctx.ellipse(grsX, grsY, 36, 20, -0.08, 0, Math.PI * 2);
    ctx.fill();

    // White turbulent storm wake
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(grsX + 45, grsY - 4, 18, 9, 0.1, 0, Math.PI * 2);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 7. SATURN ATMOSPHERIC BANDS ---
  private static createSaturnTexture(): THREE.CanvasTexture {
    const w = 1024, h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Golden-ochre atmospheric gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#757c6b');   // North polar hexagon (bluish-gray)
    grad.addColorStop(0.2, '#ccb98d');
    grad.addColorStop(0.4, '#e8dcba');
    grad.addColorStop(0.5, '#f4ebd2'); // Bright equatorial zone
    grad.addColorStop(0.6, '#e8dcba');
    grad.addColorStop(0.8, '#ccb98d');
    grad.addColorStop(1, '#80806a');   // South pole
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle fine latitude banding
    for (let i = 0; i < 30; i++) {
      const y = (i / 30) * h;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(120, 100, 70, 0.08)' : 'rgba(255, 250, 240, 0.08)';
      ctx.fillRect(0, y, w, h / 30);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 7B. SATURN RINGS (A, B, C RINGS, CASSINI DIVISION, ENCKE GAP) ---
  private static createSaturnRingsTexture(): THREE.CanvasTexture {
    const w = 1024, h = 64;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, w, h);

    // 1D radial ring profile (left = inner radius, right = outer radius)
    // Inner radius: ~66,900 km, Outer radius: ~140,180 km
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    // C Ring (faint, transparent inner ring: 66,900 - 74,500 km)
    grad.addColorStop(0.00, 'rgba(140, 130, 115, 0.0)');
    grad.addColorStop(0.05, 'rgba(150, 140, 125, 0.25)');
    grad.addColorStop(0.18, 'rgba(160, 150, 130, 0.35)');
    
    // B Ring (brightest, densest ring: 92,000 - 117,500 km)
    grad.addColorStop(0.20, 'rgba(225, 215, 185, 0.85)');
    grad.addColorStop(0.35, 'rgba(240, 230, 205, 0.95)');
    grad.addColorStop(0.55, 'rgba(230, 220, 195, 0.90)');

    // Cassini Division (major gap: 117,500 - 122,200 km, ~4,700 km wide)
    grad.addColorStop(0.57, 'rgba(40, 35, 30, 0.02)');
    grad.addColorStop(0.63, 'rgba(40, 35, 30, 0.02)');

    // A Ring (outer bright ring: 122,200 - 136,800 km)
    grad.addColorStop(0.65, 'rgba(215, 205, 180, 0.75)');
    grad.addColorStop(0.80, 'rgba(225, 215, 190, 0.80)');
    // Encke Gap (fine gap in A Ring)
    grad.addColorStop(0.83, 'rgba(40, 35, 30, 0.05)');
    grad.addColorStop(0.85, 'rgba(220, 210, 185, 0.70)');

    // Outer edge falloff
    grad.addColorStop(0.95, 'rgba(180, 170, 150, 0.35)');
    grad.addColorStop(1.00, 'rgba(140, 130, 115, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 8. URANUS PALE CYAN METHANE ---
  private static createUranusTexture(): THREE.CanvasTexture {
    const w = 512, h = 256;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#75c8d6');
    grad.addColorStop(0.5, '#8ee0ed');
    grad.addColorStop(1, '#75c8d6');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  // --- 9. NEPTUNE AZURE & STORMS ---
  private static createNeptuneTexture(): THREE.CanvasTexture {
    const w = 1024, h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Azure methane gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#2d4aa0');
    grad.addColorStop(0.3, '#3a62cb');
    grad.addColorStop(0.5, '#4a75e6');
    grad.addColorStop(0.7, '#3a62cb');
    grad.addColorStop(1, '#2d4aa0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Dark storm band
    ctx.fillStyle = 'rgba(25, 40, 110, 0.35)';
    ctx.fillRect(0, h * 0.55, w, 40);

    // Great Dark Spot (latitude ~20° S)
    ctx.fillStyle = '#1b2c75';
    ctx.beginPath();
    ctx.ellipse(w * 0.45, h * 0.58, 45, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // White companion methane cirrus clouds
    ctx.fillStyle = 'rgba(235, 245, 255, 0.8)';
    ctx.beginPath();
    ctx.ellipse(w * 0.45 + 50, h * 0.58 - 10, 22, 6, 0.1, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 10. EARTH'S MOON (LUNA) ---
  private static createMoonTexture(): THREE.CanvasTexture {
    const w = 512, h = 256;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Anorthosite cratered highlands base
    ctx.fillStyle = '#aba8a2';
    ctx.fillRect(0, 0, w, h);

    // Subtle noise speckling
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = (Math.random() - 0.5) * 24;
      data[i] = Math.max(0, Math.min(255, data[i] + v));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + v));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + v));
    }
    ctx.putImageData(imgData, 0, 0);

    // Lunar Maria (dark basalt plains: Imbrium, Serenitatis, Tranquillitatis, Oceanus Procellarum)
    const maria = [
      { x: w * 0.35, y: h * 0.35, rx: 55, ry: 45, color: '#4a4844' }, // Imbrium
      { x: w * 0.48, y: h * 0.38, rx: 35, ry: 30, color: '#4d4a46' }, // Serenitatis
      { x: w * 0.55, y: h * 0.48, rx: 40, ry: 32, color: '#494743' }, // Tranquillitatis
      { x: w * 0.22, y: h * 0.42, rx: 65, ry: 60, color: '#52504b' }, // Oceanus Procellarum
      { x: w * 0.42, y: h * 0.55, rx: 38, ry: 28, color: '#4b4844' }, // Nubium
      { x: w * 0.65, y: h * 0.45, rx: 30, ry: 25, color: '#504d49' }, // Crisium
    ];

    for (const m of maria) {
      const grad = ctx.createRadialGradient(m.x, m.y, 5, m.x, m.y, m.rx);
      grad.addColorStop(0, m.color);
      grad.addColorStop(0.85, m.color);
      grad.addColorStop(1, 'rgba(171, 168, 162, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(m.x, m.y, m.rx, m.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tycho and Copernicus bright ray impact craters
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(w * 0.42, h * 0.72, 4, 0, Math.PI * 2); // Tycho crater
    ctx.fill();
    // Radial bright rays from Tycho
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    for (let a = 0; a < Math.PI * 2; a += 0.35) {
      ctx.beginPath();
      ctx.moveTo(w * 0.42, h * 0.72);
      ctx.lineTo(w * 0.42 + Math.cos(a) * 75, h * 0.72 + Math.sin(a) * 75);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 11. IO (VOLCANIC SULFUR WORLD) ---
  private static createIoTexture(): THREE.CanvasTexture {
    const w = 512, h = 256;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Yellow-orange sulfur & silicate base
    ctx.fillStyle = '#e5c158';
    ctx.fillRect(0, 0, w, h);

    // Sulfur patches & frost
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 10 + Math.random() * 25;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(215, 140, 30, 0.45)' : 'rgba(245, 230, 150, 0.4)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Volcanic calderas (Pele, Loki, Prometheus, Tvashtar)
    const calderas = [
      { x: w * 0.25, y: h * 0.45, r: 10, color: '#7a1800' },
      { x: w * 0.65, y: h * 0.35, r: 14, color: '#2b1005' },
      { x: w * 0.45, y: h * 0.60, r: 8, color: '#8c2505' },
      { x: w * 0.80, y: h * 0.55, r: 11, color: '#541505' },
      { x: w * 0.15, y: h * 0.70, r: 7, color: '#882200' },
    ];

    for (const c of calderas) {
      // Ejecta ring halo
      ctx.strokeStyle = 'rgba(200, 50, 0, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r * 2.2, 0, Math.PI * 2);
      ctx.stroke();

      // Dark volcanic pit
      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 12. EUROPA (FRACTURED ICE OCEAN) ---
  private static createEuropaTexture(): THREE.CanvasTexture {
    const w = 1024, h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Clean, high-albedo crystalline water ice crust (geometric albedo ~0.67)
    ctx.fillStyle = '#f4f6fa';
    ctx.fillRect(0, 0, w, h);

    // Subtle polar frost mottling (delicate cool cyan-white sheen)
    const northFrost = ctx.createLinearGradient(0, 0, 0, h * 0.25);
    northFrost.addColorStop(0, 'rgba(230, 240, 250, 0.6)');
    northFrost.addColorStop(1, 'rgba(244, 246, 250, 0.0)');
    ctx.fillStyle = northFrost;
    ctx.fillRect(0, 0, w, h * 0.25);

    const southFrost = ctx.createLinearGradient(0, h, 0, h * 0.75);
    southFrost.addColorStop(0, 'rgba(230, 240, 250, 0.6)');
    southFrost.addColorStop(1, 'rgba(244, 246, 250, 0.0)');
    ctx.fillStyle = southFrost;
    ctx.fillRect(0, h * 0.75, w, h * 0.25);

    // Subtle equatorial mottled ice variations
    for (let i = 0; i < 35; i++) {
      const cx = (i * 37) % w;
      const cy = h * 0.3 + ((i * 29) % (h * 0.4));
      const rad = 25 + (i % 5) * 12;
      const patchGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, rad);
      patchGrad.addColorStop(0, 'rgba(225, 232, 240, 0.25)');
      patchGrad.addColorStop(1, 'rgba(244, 246, 250, 0.0)');
      ctx.fillStyle = patchGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    // Chaos terrain patches (disrupted ice raft plates with subtle mineral salts, e.g. Conamara Chaos)
    const chaosRegions = [
      { x: w * 0.28, y: h * 0.45, rx: 42, ry: 28 },
      { x: w * 0.62, y: h * 0.52, rx: 36, ry: 24 },
      { x: w * 0.45, y: h * 0.35, rx: 30, ry: 20 },
      { x: w * 0.82, y: h * 0.42, rx: 38, ry: 25 },
    ];
    for (const cr of chaosRegions) {
      const grad = ctx.createRadialGradient(cr.x, cr.y, 5, cr.x, cr.y, cr.rx);
      grad.addColorStop(0, 'rgba(175, 135, 105, 0.16)');
      grad.addColorStop(0.7, 'rgba(160, 125, 98, 0.10)');
      grad.addColorStop(1, 'rgba(244, 246, 250, 0.0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cr.x, cr.y, cr.rx, cr.ry, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Deterministic pseudo-random seed helper for consistent fractures
    let seed = 42;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    // Primary tectonic cycloidal fractures (double ridges)
    for (let i = 0; i < 32; i++) {
      const sx = rnd() * w;
      const sy = h * 0.15 + rnd() * h * 0.7;
      const len = 80 + rnd() * 160;
      const angle = (rnd() - 0.5) * Math.PI * 1.4;

      const cpx = sx + Math.cos(angle) * (len * 0.5) + (rnd() - 0.5) * 40;
      const cpy = sy + Math.sin(angle) * (len * 0.5) + (rnd() - 0.5) * 40;
      const ex = sx + Math.cos(angle) * len;
      const ey = sy + Math.sin(angle) * len;

      // 1. Faint mineral stain halo
      ctx.strokeStyle = 'rgba(155, 115, 90, 0.14)';
      ctx.lineWidth = 4.0;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(cpx, cpy, ex, ey);
      ctx.stroke();

      // 2. Main central fracture line
      ctx.strokeStyle = 'rgba(115, 80, 65, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(cpx, cpy, ex, ey);
      ctx.stroke();

      // 3. Flanking bright crystalline ice ridge highlights
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(sx + 1, sy + 1);
      ctx.quadraticCurveTo(cpx + 1, cpy + 1, ex + 1, ey + 1);
      ctx.stroke();
    }

    // Secondary intricate micro-fractures (fine tensile crackle network)
    ctx.strokeStyle = 'rgba(130, 95, 78, 0.22)';
    ctx.lineWidth = 0.7;
    for (let i = 0; i < 50; i++) {
      const sx = rnd() * w;
      const sy = rnd() * h;
      const len = 30 + rnd() * 60;
      const angle = rnd() * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 13. GANYMEDE (GROOVED TERRAIN) ---
  private static createGanymedeTexture(): THREE.CanvasTexture {
    const w = 512, h = 256;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Ancient dark furrowed terrain
    ctx.fillStyle = '#6e655c';
    ctx.fillRect(0, 0, w, h);

    // Light grooved terrain bands
    ctx.fillStyle = '#9c9288';
    for (let i = 0; i < 14; i++) {
      const y = (i * 20 + 10) % h;
      ctx.fillRect(0, y, w, 8 + (i % 4) * 3);
    }

    // Parallel micro-grooves
    ctx.strokeStyle = 'rgba(230, 230, 230, 0.35)';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 6) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y + (Math.sin(y * 0.1) * 8));
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 14. CALLISTO (INTENSELY CRATERED) ---
  private static createCallistoTexture(): THREE.CanvasTexture {
    const w = 512, h = 256;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Dark ancient ice-silicate regolith
    ctx.fillStyle = '#4e4741';
    ctx.fillRect(0, 0, w, h);

    // Heavily packed impact craters
    for (let i = 0; i < 180; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 2 + Math.random() * 8;
      // Dark pit
      ctx.fillStyle = '#2f2a26';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      // Bright icy rim
      ctx.strokeStyle = 'rgba(220, 225, 235, 0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI);
      ctx.stroke();
    }

    // Valhalla multi-ring basin concentric impact structure
    const vx = w * 0.45, vy = h * 0.4;
    ctx.strokeStyle = 'rgba(200, 210, 220, 0.4)';
    for (let r = 8; r <= 55; r += 7) {
      ctx.beginPath();
      ctx.arc(vx, vy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 15. TITAN (NITROGEN-METHANE HAZE) ---
  private static createTitanTexture(): THREE.CanvasTexture {
    const w = 512, h = 256;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Warm dense photochemical smog
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#c78028');     // North polar hood
    grad.addColorStop(0.2, '#dba046');
    grad.addColorStop(0.5, '#e8b258');   // Equatorial smog
    grad.addColorStop(0.8, '#dba046');
    grad.addColorStop(1, '#c07820');     // South polar hood
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle atmospheric zonal bands
    ctx.fillStyle = 'rgba(210, 130, 40, 0.2)';
    ctx.fillRect(0, h * 0.35, w, 25);
    ctx.fillRect(0, h * 0.60, w, 25);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 16. ENCELADUS (PRISTINE ICE) ---
  private static createEnceladusTexture(): THREE.CanvasTexture {
    const w = 512, h = 256;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Ultra-reflective pure water-ice crust
    ctx.fillStyle = '#f6f8fb';
    ctx.fillRect(0, 0, w, h);

    // South polar "Tiger Stripes" (Damascus, Baghdad, Alexandria, Cairo Sulci)
    ctx.strokeStyle = '#68a0c8';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const y = h * 0.85 + i * 5;
      ctx.beginPath();
      ctx.moveTo(w * 0.3, y);
      ctx.bezierCurveTo(w * 0.45, y + 4, w * 0.55, y - 4, w * 0.7, y);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 17. TRITON (PINK NITROGEN ICE) ---
  private static createTritonTexture(): THREE.CanvasTexture {
    const w = 512, h = 256;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Pinkish-tinted nitrogen & methane ice
    ctx.fillStyle = '#decac0';
    ctx.fillRect(0, 0, w, h);

    // Cantaloupe terrain dimples
    ctx.fillStyle = 'rgba(165, 135, 125, 0.35)';
    for (let x = 10; x < w; x += 16) {
      for (let y = 10; y < h * 0.6; y += 14) {
        ctx.beginPath();
        ctx.arc(x + (y % 8), y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Nitrogen cryovolcanic dark geyser wind streaks
    ctx.fillStyle = 'rgba(50, 40, 35, 0.6)';
    for (let i = 0; i < 8; i++) {
      const gx = w * 0.2 + i * 45;
      const gy = h * 0.75 + (i % 3) * 8;
      ctx.beginPath();
      ctx.ellipse(gx, gy, 12, 3, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 18. PLUTO (THOLINS & NITROGEN HEART) ---
  private static createPlutoTexture(): THREE.CanvasTexture {
    const w = 512, h = 256;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Brownish-red tholin organic baseline
    ctx.fillStyle = '#8f4f35';
    ctx.fillRect(0, 0, w, h);

    // Dark equatorial maculae (Cthulhu Macula)
    ctx.fillStyle = '#421f14';
    ctx.fillRect(0, h * 0.5, w * 0.45, 45);

    // Tombaugh Regio (The bright nitrogen ice Heart / Sputnik Planitia)
    const hx = w * 0.62, hy = h * 0.42;
    ctx.fillStyle = '#f0e6dc';
    ctx.beginPath();
    // Heart lobe 1
    ctx.ellipse(hx - 16, hy, 28, 35, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Heart lobe 2
    ctx.ellipse(hx + 16, hy, 26, 32, 0.2, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 19. CERES (CARBONACEOUS & OCCATOR SALT) ---
  private static createCeresTexture(): THREE.CanvasTexture {
    const w = 512, h = 256;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Dark carbonaceous silicate regolith
    ctx.fillStyle = '#6e6962';
    ctx.fillRect(0, 0, w, h);

    // Impact cratering
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 2 + Math.random() * 6;
      ctx.fillStyle = '#48443e';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Occator Crater bright sodium-carbonate faculae (Cerealia Facula)
    const ox = w * 0.52, oy = h * 0.44;
    // Crater depression
    ctx.fillStyle = '#3a3630';
    ctx.beginPath();
    ctx.arc(ox, oy, 14, 0, Math.PI * 2);
    ctx.fill();
    // Central brilliant salt spot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ox, oy, 3.5, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // --- 20. GENERIC CRATERED ASTEROID / MINOR MOON ---
  private static createRockyCrateredTexture(name: string): THREE.CanvasTexture {
    const w = 256, h = 128;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Distinct base tint depending on object
    const isDark = name === 'Bennu' || name === 'Ryugu' || name === 'Hygiea';
    const isMetal = name === 'Psyche';
    ctx.fillStyle = isDark ? '#323232' : (isMetal ? '#948a7e' : '#7a746d');
    ctx.fillRect(0, 0, w, h);

    // Surface cratering
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 2 + Math.random() * 5;
      ctx.fillStyle = isDark ? '#1a1a1a' : '#4e4842';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // Rim highlight
      ctx.strokeStyle = isDark ? '#505050' : 'rgba(200, 195, 185, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  /**
   * Regolith of a small airless body: fractal albedo mottling, a saturated crater field (bowls
   * shaded from one side, bright rims, a few rayed young craters) and grooves. Shared by every
   * small moon of a given surface type, so it is generated once per type.
   */
  private static createRegolithTexture(kind: 'dark' | 'grey' | 'icy' | 'red'): THREE.CanvasTexture {
    const w = 1024, h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    const base: Record<string, [number, number, number]> = {
      dark: [74, 70, 66], grey: [128, 124, 118], icy: [214, 216, 220], red: [150, 112, 86],
    };
    const [br, bg, bb] = base[kind];
    let seed = kind.length * 7919 + kind.charCodeAt(0);
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    // Value noise lattice (wraps horizontally)
    const N = 64;
    const lattice = new Float32Array(N * N).map(() => rnd());
    const noise = (x: number, y: number) => {
      const xi = Math.floor(x), yi = Math.floor(y);
      const fx = x - xi, fy = y - yi;
      const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      const at = (i: number, j: number) => lattice[(((j % N) + N) % N) * N + (((i % N) + N) % N)];
      const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1);
      return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
    };
    const img = ctx.createImageData(w, h);
    const px = img.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let n = 0, amp = 0.5, f = 4 / w;
        for (let o = 0; o < 5; o++) {
          n += amp * noise(x * f * 16, y * f * 16);
          amp *= 0.5;
          f *= 2;
        }
        const k = 0.72 + 0.56 * n;
        const i = (y * w + x) * 4;
        px[i] = br * k;
        px[i + 1] = bg * k;
        px[i + 2] = bb * k;
        px[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    // Craters, many small and few large; latitude-squeezed so they stay round on the sphere
    const light = kind === 'icy' ? 'rgba(255,255,255,0.32)' : 'rgba(255,240,225,0.22)';
    const shade = kind === 'icy' ? 'rgba(70,80,95,0.32)' : 'rgba(0,0,0,0.38)';
    for (let c = 0; c < 900; c++) {
      const r = 1.5 + Math.pow(rnd(), 3.2) * 46;
      const x = rnd() * w;
      const y = h * 0.08 + rnd() * h * 0.84;
      const stretch = 1 / Math.max(0.25, Math.cos(((y / h) - 0.5) * Math.PI));
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(stretch, 1);
      const g = ctx.createRadialGradient(-r * 0.25, -r * 0.2, r * 0.1, 0, 0, r);
      g.addColorStop(0, shade);
      g.addColorStop(0.75, 'rgba(0,0,0,0.08)');
      g.addColorStop(0.92, light);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      // A few fresh craters splash bright rays
      if (r > 8 && rnd() < 0.08) {
        ctx.strokeStyle = kind === 'dark' ? 'rgba(200,190,175,0.12)' : 'rgba(255,255,255,0.14)';
        ctx.lineWidth = 1.2;
        for (let k = 0; k < 14; k++) {
          const a = rnd() * Math.PI * 2;
          const len = r * (2 + rnd() * 4);
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
          ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
    // Grooves and fractures (as on Phobos and many irregular moons)
    ctx.strokeStyle = 'rgba(0,0,0,0.16)';
    ctx.lineWidth = 1.5;
    for (let gI = 0; gI < 18; gI++) {
      let x = rnd() * w, y = h * 0.2 + rnd() * h * 0.6;
      const a = (rnd() - 0.5) * 0.6;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let s = 0; s < 12; s++) {
        x += Math.cos(a) * 18;
        y += Math.sin(a) * 18 + (rnd() - 0.5) * 4;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.anisotropy = 4;
    return tex;
  }

  public static createGenericTexture(colorHex: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = colorHex;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }
}
