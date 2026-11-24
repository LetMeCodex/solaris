import * as THREE from 'three';

/**
 * Iteration #3 — Photorealistic PBR Facades, Real Photographic + Animated LED Billboards,
 * and True Real-Time Planar Mirror Reflection Wet Asphalt / Puddle Shader for 1:1 Times Square.
 */

export interface FacadeMaterialSet {
  glassDark: THREE.MeshStandardMaterial;
  glassBlue: THREE.MeshStandardMaterial;
  limestone: THREE.MeshStandardMaterial;
  redBrick: THREE.MeshStandardMaterial;
  brutalist: THREE.MeshStandardMaterial;
  storefront: THREE.MeshStandardMaterial;
  steelTruss: THREE.MeshStandardMaterial;
  roofDark: THREE.MeshStandardMaterial;
  setDaylightMode: (dayFactor: number) => void;
  dispose: () => void;
}

export interface AnimatedBillboard {
  id: string;
  texture: THREE.Texture;
  material: THREE.MeshStandardMaterial;
  draw?: (timeSec: number) => void;
  glowColor: THREE.Color;
}

function seededRand(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function configureTex(tex: THREE.Texture, repeatX = 1, repeatY = 1, srgb = true): THREE.Texture {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 16;
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates 5 distinct high-density Manhattan architectural PBR facade sets with crisp daylight albedo,
 * deep recessed window bump relief, reflective curtain-wall glass, and 8-brand recessed retail storefronts.
 */
export function createFacadeMaterials(): FacadeMaterialSet {
  const disposables: Array<{ dispose(): void }> = [];
  const track = <T extends { dispose(): void }>(x: T): T => {
    disposables.push(x);
    return x;
  };

  function makeBuildingTex(
    kind: 'glassDark' | 'glassBlue' | 'limestone' | 'redBrick' | 'brutalist',
    seed: number,
  ): THREE.MeshStandardMaterial {
    const W = 512;
    const H = 1024;
    const cAlb = document.createElement('canvas');
    const cEmi = document.createElement('canvas');
    const cRgh = document.createElement('canvas');
    const cMet = document.createElement('canvas');
    const cBmp = document.createElement('canvas');
    cAlb.width = cEmi.width = cRgh.width = cMet.width = cBmp.width = W;
    cAlb.height = cEmi.height = cRgh.height = cMet.height = cBmp.height = H;
    const gAlb = cAlb.getContext('2d')!;
    const gEmi = cEmi.getContext('2d')!;
    const gRgh = cRgh.getContext('2d')!;
    const gMet = cMet.getContext('2d')!;
    const gBmp = cBmp.getContext('2d')!;
    const rand = seededRand(seed);

    // Rich weathered Manhattan daylight-capable albedos (sculpted cleanly by Golden Hour sun without plastic white-out!)
    const baseColors = {
      glassDark: '#172233',
      glassBlue: '#1f354e',
      limestone: '#9c8f7b',
      redBrick: '#844334',
      brutalist: '#7a7368',
    };
    gAlb.fillStyle = baseColors[kind];
    gAlb.fillRect(0, 0, W, H);
    gEmi.fillStyle = '#000000';
    gEmi.fillRect(0, 0, W, H);
    gRgh.fillStyle = kind.startsWith('glass') ? '#262626' : '#dcdcdc';
    gRgh.fillRect(0, 0, W, H);
    gMet.fillStyle = kind.startsWith('glass') ? '#969696' : '#141414';
    gMet.fillRect(0, 0, W, H);
    gBmp.fillStyle = '#dcdcdc';
    gBmp.fillRect(0, 0, W, H);

    // Masonry / brick / weathered limestone surface texture + subtle floor-by-floor tonal banding
    if (!kind.startsWith('glass')) {
      for (let f = 0; f < 24; f++) {
        const shade = (rand() - 0.5) * 18;
        gAlb.fillStyle = shade > 0 ? `rgba(255,244,226,${shade / 260})` : `rgba(24,18,14,${-shade / 220})`;
        gAlb.fillRect(0, f * (H / 24), W, H / 24);
      }
      for (let i = 0; i < 7200; i++) {
        const x = rand() * W;
        const y = rand() * H;
        const delta = (rand() - 0.5) * 42;
        gAlb.fillStyle = delta > 0 ? `rgba(255,248,236,${delta / 240})` : `rgba(18,12,8,${-delta / 180})`;
        gAlb.fillRect(x, y, kind === 'redBrick' ? 10 : 6, 3);
      }
      if (kind === 'redBrick') {
        gBmp.fillStyle = 'rgba(36,36,36,0.55)';
        for (let y = 0; y < H; y += 6) gBmp.fillRect(0, y, W, 1);
      }
    }

    const floors = 24;
    const cols = kind === 'brutalist' ? 14 : 12;
    const cellW = W / cols;
    const cellH = H / floors;
    const padX = kind.startsWith('glass') ? 2.2 : kind === 'brutalist' ? 5.5 : 6.5;
    const padTop = kind.startsWith('glass') ? 6 : 8;
    const padBot = kind.startsWith('glass') ? 8 : 9;

    for (let f = 0; f < floors; f++) {
      const fy = f * cellH;
      const isMechFloor = kind.startsWith('glass') && (f === 11 || f === 23);

      // Spandrel / carved stone cornice belt course
      if (kind.startsWith('glass')) {
        const sp = gAlb.createLinearGradient(0, fy, 0, fy + padTop + 3);
        sp.addColorStop(0, '#131a26');
        sp.addColorStop(1, '#2d3f58');
        gAlb.fillStyle = sp;
        gAlb.fillRect(0, fy, W, padTop);
      } else {
        gAlb.fillStyle = f % 6 === 0 ? '#dcd2c0' : 'rgba(20,16,12,0.20)';
        gAlb.fillRect(0, fy, W, f % 6 === 0 ? padTop : 3);
        gBmp.fillStyle = '#ffffff';
        gBmp.fillRect(0, fy, W, f % 6 === 0 ? padTop : 3);
      }

      if (isMechFloor) {
        gAlb.fillStyle = '#1b2330';
        gAlb.fillRect(0, fy + padTop, W, cellH - padTop);
        gAlb.fillStyle = '#090d14';
        for (let ly = fy + padTop; ly < fy + cellH; ly += 3) gAlb.fillRect(0, ly, W, 1.5);
        continue;
      }

      const suiteBusy = rand() < 0.28 ? 0.50 : 0.15;
      for (let c = 0; c < cols; c++) {
        const wx = c * cellW + padX;
        const wy = fy + padTop;
        const ww = cellW - padX * 2;
        const wh = cellH - padTop - padBot;

        gBmp.fillStyle = '#202020';
        gBmp.fillRect(wx, wy, ww, wh);
        // Mirror-gloss reflective window glass contrasted sharply against matte stone/concrete mullions!
        gRgh.fillStyle = '#080808';
        gRgh.fillRect(wx, wy, ww, wh);
        gMet.fillStyle = '#e0e0e0';
        gMet.fillRect(wx, wy, ww, wh);

        // Deep sky-reflective architectural glass pane (bright enough to shimmer golden-cobalt sky in daylight!)
        const wg = gAlb.createLinearGradient(wx, wy, wx, wy + wh);
        const isBlue = kind === 'glassBlue';
        wg.addColorStop(0, isBlue ? '#4876a8' : '#2e4c70');
        wg.addColorStop(0.50, isBlue ? '#284a6e' : '#1b3048');
        wg.addColorStop(1, isBlue ? '#38628c' : '#264262');
        gAlb.fillStyle = wg;
        gAlb.fillRect(wx, wy, ww, wh);
        // Subtle interior ceiling shadow & venetian blind depth inside recessed glass
        gAlb.fillStyle = 'rgba(10, 16, 26, 0.32)';
        gAlb.fillRect(wx, wy, ww, wh * (0.16 + rand() * 0.22));

        if (!kind.startsWith('glass')) {
          gAlb.fillStyle = '#b4a894';
          gAlb.fillRect(wx - 1.5, wy - 2.5, ww + 3, 2.5);
          gAlb.fillRect(wx - 1.5, wy + wh, ww + 3, 2.5);
          // Crisp dark recessed window lintel shadow
          gAlb.fillStyle = 'rgba(12, 10, 8, 0.55)';
          gAlb.fillRect(wx, wy, ww, 3.5);
        }

        if (rand() < suiteBusy) {
          const t = rand();
          const hi = t < 0.50 ? '#ffe5bd' : t < 0.85 ? '#d4edff' : '#ffd296';
          const lo = t < 0.50 ? '#6e4c28' : t < 0.85 ? '#3e5c7a' : '#5e3c1c';
          const alpha = 0.28 + rand() * 0.56;
          const eg = gEmi.createLinearGradient(wx, wy, wx, wy + wh);
          eg.addColorStop(0, hi);
          eg.addColorStop(0.24, hi);
          eg.addColorStop(0.75, lo);
          eg.addColorStop(1, '#181410');
          gEmi.save();
          gEmi.globalAlpha = alpha;
          gEmi.fillStyle = eg;
          gEmi.fillRect(wx + 1, wy + 1, ww - 2, wh - 2);
          if (rand() < 0.45) {
            gEmi.fillStyle = 'rgba(10,12,18,0.62)';
            gEmi.fillRect(wx + 1, wy + 1, ww - 2, wh * (0.25 + rand() * 0.35));
          }
          gEmi.restore();
        }

        gAlb.fillStyle = kind.startsWith('glass') ? '#303e52' : '#181b22';
        gAlb.fillRect(wx + ww * 0.5 - 0.6, wy, 1.2, wh);
        gEmi.fillStyle = '#000000';
        gEmi.fillRect(wx + ww * 0.5 - 0.6, wy, 1.2, wh);
      }
    }

    for (let c = 0; c < cols; c++) {
      const cx = c * cellW;
      const pierW = kind === 'brutalist' ? 4.5 : kind.startsWith('glass') ? 2.4 : 4.2;
      gBmp.fillStyle = '#ffffff';
      gBmp.fillRect(cx, 0, pierW, H);
      gAlb.fillStyle = kind === 'brutalist' ? '#aba294' : kind.startsWith('glass') ? '#344459' : 'rgba(255,250,240,0.12)';
      gAlb.fillRect(cx, 0, pierW, H);
    }

    const map = track(configureTex(new THREE.CanvasTexture(cAlb), 1, 1, true));
    const emissiveMap = track(configureTex(new THREE.CanvasTexture(cEmi), 1, 1, true));
    const roughnessMap = track(configureTex(new THREE.CanvasTexture(cRgh), 1, 1, false));
    const metalnessMap = track(configureTex(new THREE.CanvasTexture(cMet), 1, 1, false));
    const bumpMap = track(configureTex(new THREE.CanvasTexture(cBmp), 1, 1, false));

    return track(new THREE.MeshStandardMaterial({
      map,
      emissive: new THREE.Color('#ffffff'),
      emissiveMap,
      emissiveIntensity: 0.9,
      roughnessMap,
      metalnessMap,
      roughness: 1.0,
      metalness: 1.0,
      envMapIntensity: kind.startsWith('glass') ? 1.85 : 1.35,
      bumpMap,
      bumpScale: kind.startsWith('glass') ? 0.14 : 0.42,
    }));
  }

  // Ground-floor flagship retail strip with recessed warmly-lit shop interiors behind reflective plate glass!
  function makeStorefrontMat(): THREE.MeshStandardMaterial {
    const W = 2048;
    const H = 256;
    const cAlb = document.createElement('canvas');
    const cEmi = document.createElement('canvas');
    cAlb.width = cEmi.width = W;
    cAlb.height = cEmi.height = H;
    const g = cAlb.getContext('2d')!;
    const ge = cEmi.getContext('2d')!;

    g.fillStyle = '#181c24';
    g.fillRect(0, 0, W, H);
    ge.fillStyle = '#000000';
    ge.fillRect(0, 0, W, H);

    const shops = [
      { label: 'SEPHORA', bg: '#0c0c10', fg: '#ffffff', accent: '#ffffff', wall: '#2a1c28', warm: '#ffd4eb', merch: ['#ff4a9e', '#ffffff', '#e6b8ff', '#ff85a2'] },
      { label: 'AMERICAN EAGLE', bg: '#0f1c32', fg: '#ffffff', accent: '#62b0ff', wall: '#36281c', warm: '#ffe6c2', merch: ['#365a8a', '#c99764', '#e8e0d4', '#1d3658'] },
      { label: 'PELÉ SOCCER', bg: '#092616', fg: '#80ff70', accent: '#ffe142', wall: '#122c1b', warm: '#d8ffde', merch: ['#ffd62e', '#1ea850', '#ffffff', '#0077cc'] },
      { label: 'EXPRESS', bg: '#16161c', fg: '#ffffff', accent: '#dcdce8', wall: '#2c2826', warm: '#fff0d8', merch: ['#c83848', '#1f232c', '#e6dcd0', '#8c6b52'] },
      { label: "HERSHEY'S", bg: '#3e180c', fg: '#ffdf9e', accent: '#ff9e38', wall: '#4a2210', warm: '#ffd89e', merch: ['#ff9d1c', '#d41c2c', '#ffd63a', '#7c3214'] },
      { label: 'T · MOBILE', bg: '#c40064', fg: '#ffffff', accent: '#ff52b0', wall: '#3a0e28', warm: '#ffd0ec', merch: ['#ff2498', '#ffffff', '#222634', '#ff82c8'] },
      { label: "LEVI'S", bg: '#c21022', fg: '#ffffff', accent: '#ff4252', wall: '#36241e', warm: '#ffe4cc', merch: ['#28487a', '#c82032', '#e4d4be', '#182b48'] },
      { label: 'STARBUCKS', bg: '#0a3622', fg: '#ebfff4', accent: '#22c472', wall: '#2c2218', warm: '#ffe2b0', merch: ['#1e7a48', '#c68c52', '#f2e8d8', '#3c2a1e'] },
    ];
    const sw = W / shops.length;
    shops.forEach((s, i) => {
      const x = i * sw;
      // Dark anodized aluminum storefront column & granite kickplate
      g.fillStyle = '#1b1f28';
      g.fillRect(x, 0, 10, H);
      g.fillStyle = s.bg;
      g.fillRect(x + 10, 6, sw - 14, 52);
      ge.fillStyle = s.bg;
      ge.fillRect(x + 10, 6, sw - 14, 52);
      g.fillStyle = s.accent;
      g.fillRect(x + 10, 56, sw - 14, 3);
      ge.fillStyle = s.accent;
      ge.fillRect(x + 10, 56, sw - 14, 3);

      g.font = '800 24px Montserrat, sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillStyle = s.fg;
      g.fillText(s.label, x + sw / 2, 33);
      ge.font = '800 24px Montserrat, sans-serif';
      ge.textAlign = 'center'; ge.textBaseline = 'middle';
      ge.fillStyle = s.fg;
      ge.fillText(s.label, x + sw / 2, 33);

      // Rich recessed architectural retail interior (NO blank white frosted shower-glass!)
      const wy = 66;
      const wh = H - 78;
      const paintInterior = (ctx: CanvasRenderingContext2D, isEmit: boolean) => {
        ctx.save();
        if (isEmit) ctx.globalAlpha = 0.88;
        // Deep shadowed shop ceiling -> warm back wall -> wooden/stone floor perspective
        const bg = ctx.createLinearGradient(x, wy, x, wy + wh);
        bg.addColorStop(0, '#141216');
        bg.addColorStop(0.20, s.wall);
        bg.addColorStop(0.76, s.wall);
        bg.addColorStop(0.78, '#30261e');
        bg.addColorStop(1, '#121014');
        ctx.fillStyle = bg;
        ctx.fillRect(x + 14, wy, sw - 22, wh);

        // Warm track-lighting spotlight cones illuminating back merchandise wall
        for (let sp = 0; sp < 3; sp++) {
          const sx = x + 46 + sp * ((sw - 84) / 2);
          const cg = ctx.createRadialGradient(sx, wy + 22, 4, sx, wy + 74, 62);
          cg.addColorStop(0, s.warm);
          cg.addColorStop(0.5, 'rgba(255,220,175,0.38)');
          cg.addColorStop(1, 'rgba(255,210,160,0.0)');
          ctx.fillStyle = cg;
          ctx.fillRect(x + 14, wy, sw - 22, wh * 0.82);
        }

        // Backlit store display bays, colorful merchandise rows & product shelves
        for (let bay = 0; bay < 3; bay++) {
          const bx = x + 22 + bay * ((sw - 38) / 3);
          const bw = (sw - 54) / 3;
          ctx.fillStyle = 'rgba(10, 10, 16, 0.55)';
          ctx.fillRect(bx, wy + 24, bw, wh - 42);
          for (let row = 0; row < 3; row++) {
            const ry = wy + 34 + row * 34;
            // Warm LED shelf under-glow strip
            ctx.fillStyle = s.warm;
            ctx.fillRect(bx + 3, ry - 2, bw - 6, 2);
            // Colorful merchandise boxes / folded denim / cosmetics bottles
            for (let item = 0; item < 4; item++) {
              ctx.fillStyle = s.merch[(bay + row + item) % s.merch.length];
              ctx.fillRect(bx + 5 + item * ((bw - 10) / 4), ry + 6, (bw - 18) / 4, 18);
            }
          }
        }

        // Stylized display mannequin / cafe counter silhouettes in foreground bays
        ctx.fillStyle = 'rgba(14, 14, 20, 0.72)';
        for (const mx of [x + sw * 0.24, x + sw * 0.78]) {
          ctx.beginPath(); ctx.arc(mx, wy + 72, 7, 0, Math.PI * 2); ctx.fill();
          ctx.fillRect(mx - 10, wy + 80, 20, 44);
          ctx.fillRect(mx - 7, wy + 124, 14, 42);
        }

        // Subtle glass window reflection streak across upper plate glass
        const glint = ctx.createLinearGradient(x + 14, wy, x + sw - 14, wy + 46);
        glint.addColorStop(0, 'rgba(160, 205, 255, 0.14)');
        glint.addColorStop(0.5, 'rgba(255, 255, 255, 0.04)');
        glint.addColorStop(1, 'rgba(120, 175, 255, 0.10)');
        ctx.fillStyle = glint;
        ctx.fillRect(x + 14, wy, sw - 22, 48);

        // Dark anodized glass mullions & double entrance doorway frame
        ctx.fillStyle = '#0c0e14';
        ctx.fillRect(x + sw * 0.36, wy, 5, wh);
        ctx.fillRect(x + sw * 0.64, wy, 5, wh);
        ctx.fillRect(x + 14, wy + wh - 12, sw - 22, 12);
        // Chrome door handles
        ctx.fillStyle = '#cfd8e4';
        ctx.fillRect(x + sw * 0.48, wy + wh * 0.50, 2, 22);
        ctx.fillRect(x + sw * 0.52, wy + wh * 0.50, 2, 22);
        ctx.restore();
      };
      paintInterior(g, false);
      paintInterior(ge, true);
    });

    const map = track(configureTex(new THREE.CanvasTexture(cAlb), 1, 1, true));
    const emissiveMap = track(configureTex(new THREE.CanvasTexture(cEmi), 1, 1, true));
    return track(new THREE.MeshStandardMaterial({
      map,
      emissive: new THREE.Color('#ffffff'),
      emissiveMap,
      emissiveIntensity: 1.05,
      roughness: 0.12,
      metalness: 0.42,
    }));
  }

  const glassDark = makeBuildingTex('glassDark', 101);
  const glassBlue = makeBuildingTex('glassBlue', 202);
  const limestone = makeBuildingTex('limestone', 303);
  const redBrick = makeBuildingTex('redBrick', 404);
  const brutalist = makeBuildingTex('brutalist', 505);
  const storefront = makeStorefrontMat();
  const steelTruss = track(new THREE.MeshStandardMaterial({ color: '#1b202a', roughness: 0.48, metalness: 0.85 }));
  const roofDark = track(new THREE.MeshStandardMaterial({ color: '#1f232b', roughness: 0.9, metalness: 0.1 }));

  return {
    glassDark,
    glassBlue,
    limestone,
    redBrick,
    brutalist,
    storefront,
    steelTruss,
    roofDark,
    // Adjust material brightness & golden sky reflection intensity dynamically between Golden Hour & Midnight!
    setDaylightMode: (dayFactor: number) => {
      const mColor = 0.62 + 0.38 * dayFactor;
      limestone.color.setRGB(mColor, mColor, mColor);
      redBrick.color.setRGB(mColor, mColor, mColor);
      brutalist.color.setRGB(mColor, mColor, mColor);
      glassDark.color.setRGB(0.70 + 0.30 * dayFactor, 0.72 + 0.28 * dayFactor, 0.76 + 0.24 * dayFactor);
      glassBlue.color.setRGB(0.70 + 0.30 * dayFactor, 0.74 + 0.26 * dayFactor, 0.80 + 0.20 * dayFactor);
      limestone.envMapIntensity = 0.85 + 1.15 * dayFactor;
      redBrick.envMapIntensity = 0.75 + 0.95 * dayFactor;
      brutalist.envMapIntensity = 0.80 + 1.05 * dayFactor;
      glassDark.envMapIntensity = 1.15 + 1.35 * dayFactor;
      glassBlue.envMapIntensity = 1.20 + 1.40 * dayFactor;
    },
    dispose: () => {
      for (const d of disposables) d.dispose();
    },
  };
}

/**
 * Injects physical RGB LED subpixel dot-grid & modular panel cabinet seams onto ANY billboard material
 * (both real generated photographic posters AND live animated canvas tickers!) via `onBeforeCompile`.
 */
function attachLedPixelShader(mat: THREE.MeshStandardMaterial): void {
  mat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      /* glsl */ `
      #include <emissivemap_fragment>
      // Physical Times Square LED subpixel matrix & cabinet panel seams (sharp up close, seamless at distance)
      vec2 ledUv = vMapUv;
      float pxGrid = (0.90 + 0.10 * sin(ledUv.y * 720.0)) * (0.94 + 0.06 * sin(ledUv.x * 520.0));
      vec2 modSeam = abs(fract(ledUv * vec2(8.0, 6.0)) - 0.5);
      float seam = smoothstep(0.492, 0.478, max(modSeam.x, modSeam.y));
      float ledMask = pxGrid * mix(0.72, 1.0, seam);
      totalEmissiveRadiance *= ledMask;
      diffuseColor.rgb *= ledMask;
      `,
    );
  };
}

function applyLedCanvasBorder(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.save();
  ctx.strokeStyle = 'rgba(8, 10, 14, 0.92)';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, w - 8, h - 8);
  ctx.restore();
}

/**
 * Loads our 6 generated photographic/cinematic Times Square posters (`public/textures/tsq/bb_*.png`)
 * AND pairs them with live animated LED displays (Nasdaq ticker, Coca-Cola kinetic ribbon, Prudential,
 * TSX Broadway, ABC GMA news ticker, One Times Square stack, Vision Zero PSA) — ZERO clipart, ZERO duplicates!
 */
export function createTimesSquareBillboards(): {
  boards: Record<string, AnimatedBillboard>;
  update: (timeSec: number) => void;
  dispose: () => void;
} {
  const boards: Record<string, AnimatedBillboard> = {};
  const loader = new THREE.TextureLoader();
  const base = `${import.meta.env.BASE_URL}textures/tsq/`;

  function regPhoto(id: string, filename: string, glowHex: string, emissiveIntensity: number): void {
    const tex = loader.load(`${base}${filename}`);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    const material = new THREE.MeshStandardMaterial({
      map: tex,
      emissive: new THREE.Color('#ffffff'),
      emissiveMap: tex,
      emissiveIntensity,
      roughness: 0.16,
      metalness: 0.1,
    });
    attachLedPixelShader(material);
    boards[id] = { id, texture: tex, material, glowColor: new THREE.Color(glowHex) };
  }

  function regAnim(
    id: string,
    w: number,
    h: number,
    glowHex: string,
    emissiveIntensity: number,
    drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void,
  ): void {
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 16;
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      emissive: new THREE.Color('#ffffff'),
      emissiveMap: texture,
      emissiveIntensity,
      roughness: 0.16,
      metalness: 0.12,
    });
    attachLedPixelShader(material);
    const draw = (t: number) => {
      drawFn(ctx, w, h, t);
      applyLedCanvasBorder(ctx, w, h);
      texture.needsUpdate = true;
    };
    draw(0);
    boards[id] = { id, texture, material, draw, glowColor: new THREE.Color(glowHex) };
  }

  // --- 6 Museum-Grade Photographic / Theatrical Billboard Assets ---
  regPhoto('marriottMega', 'bb_marriott.jpg', '#f5b848', 1.28);
  regPhoto('lionKing', 'bb_lionking.jpg', '#ff9d00', 1.28);
  regPhoto('aladdin', 'bb_aladdin.jpg', '#c429ff', 1.28);
  regPhoto('wicked', 'bb_wicked.jpg', '#00e676', 1.26);
  regPhoto('americanEagle', 'bb_fashion_ae.jpg', '#ff708a', 1.28);
  regPhoto('luxuryCouture', 'bb_luxury.jpg', '#e02868', 1.30);

  // --- 8 Crisp Live Animated Times Square Displays ---
  // 1. NASDAQ 7-Story Cylindrical MarketSite Tower
  regAnim('nasdaq', 1024, 512, '#009eff', 1.38, (ctx, w, h, t) => {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#01122e'); g.addColorStop(0.45, '#004994');
    g.addColorStop(0.78, '#0082d4'); g.addColorStop(1, '#021a42');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(105, 225, 255, 0.28)'; ctx.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 28) {
        const y = h * 0.50 + Math.sin(x * 0.0085 + t * 1.3 + i * 0.52) * (34 + i * 9);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    ctx.fillStyle = '#ffffff'; ctx.font = '800 98px Montserrat, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Nasdaq', w * 0.5, 152);
    ctx.fillStyle = '#75e8ff'; ctx.font = '600 26px "JetBrains Mono", monospace';
    ctx.fillText('MARKETSITE · 4 TIMES SQUARE · NEW YORK', w * 0.5, 204);

    const indices = [['NDX', '21,842.60', '+1.48%'], ['SPX', '6,128.15', '+0.92%'], ['NVDA', '154.30', '+3.85%'], ['AAPL', '242.10', '+1.24%']];
    indices.forEach(([sym, px, chg], i) => {
      const bx = 48 + i * 238;
      ctx.fillStyle = 'rgba(1, 14, 38, 0.78)'; ctx.fillRect(bx, 238, 218, 138);
      ctx.strokeStyle = 'rgba(0, 215, 255, 0.6)'; ctx.lineWidth = 2; ctx.strokeRect(bx, 238, 218, 138);
      ctx.textAlign = 'left';
      ctx.fillStyle = '#8eeaff'; ctx.font = '700 24px "JetBrains Mono", monospace'; ctx.fillText(sym, bx + 16, 274);
      ctx.fillStyle = '#ffffff'; ctx.font = '700 30px "JetBrains Mono", monospace'; ctx.fillText(px, bx + 16, 316);
      ctx.fillStyle = '#47ff9c'; ctx.font = '700 22px "JetBrains Mono", monospace'; ctx.fillText(chg, bx + 16, 354);
    });

    ctx.fillStyle = '#020b1a'; ctx.fillRect(0, h - 76, w, 76);
    ctx.fillStyle = '#00d8ff'; ctx.fillRect(0, h - 78, w, 3);
    const tape = 'MSFT 468.50 ▲0.8%   ·   AMZN 224.80 ▲2.1%   ·   GOOGL 198.40 ▲2.1%   ·   NVDA 154.30 ▲3.9%   ·   META 615.20 ▲1.5%   ·   ';
    ctx.font = '700 30px "JetBrains Mono", monospace'; ctx.textAlign = 'left';
    ctx.fillStyle = '#ebf8ff'; ctx.fillText(tape + tape, -((t * 105) % 1750), h - 26);
  });

  // 2. One Times Square Authentic 6-Tier Stacked North Facade
  regAnim('oneTimesSquare', 512, 1024, '#00c8ff', 1.38, (ctx, w, h, t) => {
    ctx.fillStyle = '#060910'; ctx.fillRect(0, 0, w, h);

    // Tier 1: Samsung Galaxy Blue
    const g1 = ctx.createLinearGradient(0, 8, w, 198);
    g1.addColorStop(0, '#001a4d'); g1.addColorStop(0.55, '#0056c7'); g1.addColorStop(1, '#00a8ff');
    ctx.fillStyle = g1; ctx.fillRect(8, 8, w - 16, 188);
    ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(w / 2, 102, 62 + Math.sin(t * 2) * 4, 0, Math.PI * 2); ctx.stroke();
    ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.font = '800 56px Montserrat, sans-serif';
    ctx.fillText('SAMSUNG', w / 2, 112);
    ctx.fillStyle = '#b8e8ff'; ctx.font = '600 22px Montserrat, sans-serif';
    ctx.fillText('GALAXY STUDIO · NEW YORK', w / 2, 156);

    // Tier 2: Crimson L'Oréal Paris
    const g2 = ctx.createLinearGradient(0, 206, w, 396);
    g2.addColorStop(0, '#8c0014'); g2.addColorStop(0.5, '#d60024'); g2.addColorStop(1, '#ff3d3d');
    ctx.fillStyle = g2; ctx.fillRect(8, 206, w - 16, 188);
    ctx.fillStyle = '#ffffff'; ctx.font = '800 66px "Instrument Serif", Georgia, serif';
    ctx.fillText('L’ORÉAL', w / 2, 294);
    ctx.font = '600 26px Montserrat, sans-serif'; ctx.fillStyle = '#ffe5c4';
    ctx.fillText('P A R I S   ·   N E W   Y O R K', w / 2, 344);

    // Tier 3: Spotify Emerald Soundwave
    const g3 = ctx.createLinearGradient(0, 404, w, 594);
    g3.addColorStop(0, '#072116'); g3.addColorStop(0.5, '#128a46'); g3.addColorStop(1, '#1ed760');
    ctx.fillStyle = g3; ctx.fillRect(8, 404, w - 16, 188);
    for (let i = 0; i < 18; i++) {
      const bh = 24 + Math.abs(Math.sin(t * 3.2 + i * 0.65)) * 74;
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.fillRect(34 + i * 25, 592 - bh, 14, bh);
    }
    ctx.fillStyle = '#ffffff'; ctx.font = '800 58px Montserrat, sans-serif'; ctx.fillText('Spotify', w / 2, 492);
    ctx.font = '700 24px Montserrat, sans-serif'; ctx.fillText('TOP HITS LIVE · TIMES SQUARE', w / 2, 540);

    // Tier 4: Citizen Watch Gold/Black + Live NY Clock
    ctx.fillStyle = '#0d1016'; ctx.fillRect(8, 602, w - 16, 184);
    ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 3; ctx.strokeRect(22, 616, w - 44, 156);
    ctx.fillStyle = '#f5d77f'; ctx.font = '700 54px "Instrument Serif", Georgia, serif';
    ctx.fillText('CITIZEN', w / 2, 694);
    ctx.fillStyle = '#ffffff'; ctx.font = '600 24px "JetBrains Mono", monospace';
    const nyTime = new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/New_York' });
    ctx.fillText(`NEW YORK  ${nyTime} EST`, w / 2, 742);

    // Tier 5: Breaking News Red/Amber Zipper
    ctx.fillStyle = '#14080c'; ctx.fillRect(8, 796, w - 16, 218);
    ctx.fillStyle = '#e01b24'; ctx.fillRect(8, 796, w - 16, 56);
    ctx.fillStyle = '#ffffff'; ctx.font = '800 32px Montserrat, sans-serif'; ctx.fillText('ONE TIMES SQUARE', w / 2, 834);
    ctx.fillStyle = '#ffcc29'; ctx.font = '700 34px "JetBrains Mono", monospace'; ctx.textAlign = 'left';
    const zip = 'CROSSROADS OF THE WORLD  ·  42ND ST & BROADWAY  ·  NEW YORK CITY  ·  ';
    ctx.fillText(zip + zip, -((t * 95) % 1180), 920);
    ctx.fillStyle = '#00a8ff'; ctx.fillRect(8, 960, w - 16, 54);
    ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.font = '700 24px Montserrat, sans-serif';
    ctx.fillText('42ND ST · SUBWAY N Q R W 1 2 3 7 S', w / 2, 995);
  });

  // 3. TSX Broadway Giant Corner Wraparound LED
  regAnim('tsxBroadway', 1024, 512, '#ff1e84', 1.38, (ctx, w, h, t) => {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#120526'); g.addColorStop(0.5, '#590b7d'); g.addColorStop(1, '#e61266');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 7; i++) {
      const y = 55 + i * 68;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(0, 238, 255, 0.24)' : 'rgba(255, 200, 60, 0.22)';
      ctx.fillRect(((t * (75 + i * 22)) % (w + 420)) - 210, y, 380, 22);
    }
    ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.font = '800 138px Montserrat, sans-serif';
    ctx.fillText('TSX', w * 0.5, 224);
    ctx.fillStyle = '#7ef4ff'; ctx.font = '700 40px Montserrat, sans-serif';
    ctx.fillText('BROADWAY  ·  PALACE THEATRE', w * 0.5, 304);
    ctx.fillStyle = '#ffd4ea'; ctx.font = '600 24px "JetBrains Mono", monospace';
    ctx.fillText('1568 BROADWAY · LIVE STAGE OVER TIMES SQUARE', w * 0.5, 378);
  });

  // 4. 2 Times Square — Iconic Coca-Cola 3D Red Kinetic Ribbon
  regAnim('cocaRed', 768, 384, '#ff1424', 1.44, (ctx, w, h, t) => {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#96000c'); g.addColorStop(0.5, '#e60016'); g.addColorStop(1, '#9e0010');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.92)'; ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(-20, h * 0.72);
    ctx.bezierCurveTo(w * 0.3, h * 0.44 + Math.sin(t * 1.5) * 20, w * 0.7, h * 0.94, w + 20, h * 0.56);
    ctx.stroke();
    ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.font = 'italic 700 132px "Instrument Serif", Georgia, serif';
    ctx.fillText('Coca-Cola', w / 2, 186);
    ctx.font = '700 24px Montserrat, sans-serif'; ctx.fillText('TASTE THE FEELING · TIMES SQUARE', w / 2, 326);
  });

  // 5. 1540 Broadway — Iconic Red Header + T-Mobile Magenta 5G Spectacular
  regAnim('broadway1540', 768, 512, '#ec22ff', 1.35, (ctx, w, h, t) => {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#1a0726'); g.addColorStop(0.45, '#e80e7a'); g.addColorStop(1, '#3219e8');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.save(); ctx.translate(w * 0.5, h * 0.58);
    for (let i = 0; i < 20; i++) {
      ctx.rotate((Math.PI * 2) / 20);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(0,255,235,0.09)';
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-14, -400); ctx.lineTo(14, -400); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle = '#d40e24'; ctx.fillRect(0, 0, w, 66);
    ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.font = '800 34px Montserrat, sans-serif';
    ctx.fillText('1 5 4 0   B R O A D W A Y', w / 2, 44);
    ctx.fillStyle = '#ffffff'; ctx.font = '800 86px Montserrat, sans-serif'; ctx.fillText('T · MOBILE', w / 2, 232);
    ctx.fillStyle = '#92f9ff'; ctx.font = '700 38px Montserrat, sans-serif';
    ctx.globalAlpha = 0.85 + 0.15 * Math.sin(t * 2.4);
    ctx.fillText('5G FLAGSHIP EXPERIENCE', w / 2, 306);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff'; ctx.font = '600 24px "JetBrains Mono", monospace';
    ctx.fillText('45TH STREET & BROADWAY · NEW YORK', w / 2, 424);
  });

  // 6. Fixed-Kerning Bold Black/White/Gold NYC PSA ("Text OR Drive. There Is No AND.")
  regAnim('editorialDark', 768, 384, '#ffda59', 1.28, (ctx, w, h, _t) => {
    ctx.fillStyle = '#0c0d12'; ctx.fillRect(0, 0, w, h);
    ctx.textBaseline = 'middle';
    // Line 1: "Text OR Drive." with exact measured kerning!
    ctx.font = '800 72px Montserrat, sans-serif';
    ctx.textAlign = 'left';
    const l1 = [{ t: 'Text ', c: '#ffffff' }, { t: 'OR', c: '#ffbe0b' }, { t: ' Drive.', c: '#ffffff' }];
    let tot1 = 0; for (const seg of l1) tot1 += ctx.measureText(seg.t).width;
    let x1 = (w - tot1) * 0.5;
    for (const seg of l1) {
      ctx.fillStyle = seg.c; ctx.fillText(seg.t, x1, 128);
      if (seg.t === 'OR') ctx.fillRect(x1, 166, ctx.measureText(seg.t).width, 7);
      x1 += ctx.measureText(seg.t).width;
    }
    // Line 2: "There Is No AND." with exact measured kerning!
    ctx.font = '800 62px Montserrat, sans-serif';
    const l2 = [{ t: 'There Is No ', c: '#ffffff' }, { t: 'AND', c: '#ffbe0b' }, { t: '.', c: '#ffffff' }];
    let tot2 = 0; for (const seg of l2) tot2 += ctx.measureText(seg.t).width;
    let x2 = (w - tot2) * 0.5;
    for (const seg of l2) {
      ctx.fillStyle = seg.c; ctx.fillText(seg.t, x2, 232);
      if (seg.t === 'AND') ctx.fillRect(x2, 266, ctx.measureText(seg.t).width, 6);
      x2 += ctx.measureText(seg.t).width;
    }
    ctx.textAlign = 'center'; ctx.fillStyle = '#9aa8c2'; ctx.font = '600 22px "JetBrains Mono", monospace';
    ctx.fillText('NYC DOT · VISION ZERO · MIDTOWN', w / 2, 330);
  });

  // 7. ABC Good Morning America Live Studio Ticker (1500 Broadway)
  regAnim('abcTicker', 1024, 256, '#ffc82e', 1.38, (ctx, w, h, t) => {
    ctx.fillStyle = '#0b1428'; ctx.fillRect(0, 0, w, h);
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, '#ff8800'); g.addColorStop(0.5, '#ffcc00'); g.addColorStop(1, '#ff6600');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, 92);
    ctx.textAlign = 'center'; ctx.fillStyle = '#0a1020'; ctx.font = '800 48px Montserrat, sans-serif';
    ctx.fillText('GOOD MORNING AMERICA  ·  TIMES SQUARE STUDIOS', w / 2, 60);
    ctx.fillStyle = '#ffffff'; ctx.font = '700 36px "JetBrains Mono", monospace'; ctx.textAlign = 'left';
    const news = 'LIVE FROM 1500 BROADWAY   ·   MIDTOWN MANHATTAN   ·   NEW YORK CITY   ·   BROADWAY MATINEE TICKETS AT TKTS   ·   ';
    ctx.fillText(news + news, -((t * 125) % 1880), 178);
    ctx.fillStyle = '#ff3347'; ctx.fillRect(0, h - 22, w, 22);
  });

  // 8. Thomson Reuters Cyan Vertical Financial Spectacular (3 Times Square)
  regAnim('cyanVertical', 512, 1024, '#00e6bd', 1.32, (ctx, w, h, t) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#003647'); g.addColorStop(0.45, '#00a896'); g.addColorStop(0.82, '#028090'); g.addColorStop(1, '#022030');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 8; i++) {
      ctx.strokeStyle = 'rgba(255,255,255,0.20)'; ctx.lineWidth = 4;
      const r = 55 + ((i * 55 + t * 32) % 400);
      ctx.beginPath(); ctx.arc(w / 2, h * 0.44, r, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.font = '800 58px Montserrat, sans-serif';
    ctx.fillText('THOMSON', w / 2, 200);
    ctx.fillStyle = '#ffab2e'; ctx.font = '800 64px Montserrat, sans-serif'; ctx.fillText('REUTERS', w / 2, 276);
    ctx.fillStyle = '#e0fff9'; ctx.font = '700 28px "JetBrains Mono", monospace';
    ctx.fillText('3 TIMES SQUARE · NYC', w / 2, 860); ctx.fillText('WORLD MARKETS LIVE', w / 2, 908);
  });

  // 9. Prudential Classic Blue Tower Sign (2 Times Square above Coca-Cola)
  regAnim('prudential', 768, 384, '#1488ff', 1.34, (ctx, w, h, _t) => {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#042459'); g.addColorStop(0.55, '#005eb8'); g.addColorStop(1, '#003875');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(155, h / 2, 72, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.beginPath(); ctx.moveTo(105, h / 2 + 40); ctx.lineTo(155, h / 2 - 42); ctx.lineTo(205, h / 2 + 40); ctx.closePath(); ctx.fill();
    ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff'; ctx.font = '700 84px "Instrument Serif", Georgia, serif';
    ctx.fillText('Prudential', 265, h / 2 + 24);
  });

  let lastDraw = -1;
  const boardList = Object.values(boards);

  return {
    boards,
    update: (timeSec: number) => {
      if (timeSec - lastDraw < 0.09) return;
      lastDraw = timeSec;
      for (const b of boardList) b.draw?.(timeSec);
    },
    dispose: () => {
      for (const b of boardList) {
        b.texture.dispose();
        b.material.dispose();
      }
    },
  };
}

/**
 * Iteration #3 Photorealistic Wet Asphalt & Snøhetta Pedestrian Plaza Shader with
 * TRUE REAL-TIME PLANAR MIRROR REFLECTIONS (`uReflMap` + `uReflMatrix`)!!
 *
 * Every billboard, Coca-Cola red ribbon, electric-blue Nasdaq tower, TKTS ruby stairs,
 * moving Yellow Cab, red taillight, and skyscraper literally reflects upside-down inside
 * dark glossy rain puddles with raindrop splash ripples — ZERO milky snow patches, ZERO bloom blow-out!
 */
export function createTimesSquareGroundMaterial(): {
  material: THREE.ShaderMaterial;
  uniforms: {
    uTime: { value: number };
    uWetness: { value: number };
    uRain: { value: number };
    uSnow: { value: number };
    uNight: { value: number };
    uSunDir: { value: THREE.Vector3 };
    uSkyColor: { value: THREE.Color };
    uFogColor: { value: THREE.Color };
    uFogDensity: { value: number };
    uReflMap: { value: THREE.Texture | null };
    uReflMatrix: { value: THREE.Matrix4 };
    uHasRefl: { value: number };
    uShadowMap: { value: THREE.Texture | null };
    uShadowMatrix: { value: THREE.Matrix4 };
    uHasShadow: { value: number };
  };
} {
  const uniforms = {
    uTime: { value: 0 },
    uWetness: { value: 0.85 },
    uRain: { value: 0.0 },
    uSnow: { value: 0.0 },
    uNight: { value: 1.0 },
    uSunDir: { value: new THREE.Vector3(0.4, 0.7, -0.5).normalize() },
    uSkyColor: { value: new THREE.Color('#0c1428') },
    uFogColor: { value: new THREE.Color('#090d1a') },
    uFogDensity: { value: 0.0019 },
    uReflMap: { value: null as THREE.Texture | null },
    uReflMatrix: { value: new THREE.Matrix4() },
    uHasRefl: { value: 0 },
    uShadowMap: { value: null as THREE.Texture | null },
    uShadowMatrix: { value: new THREE.Matrix4() },
    uHasShadow: { value: 0 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      uniform mat4 uReflMatrix;
      uniform mat4 uShadowMatrix;
      varying vec3 vWorldPos;
      varying vec4 vReflClip;
      varying vec4 vShadowCoord;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        vReflClip = uReflMatrix * wp;
        vShadowCoord = uShadowMatrix * vec4(wp.xyz + vec3(0.0, 0.14, 0.0), 1.0);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uWetness;
      uniform float uRain;
      uniform float uSnow;
      uniform float uNight;
      uniform vec3 uSunDir;
      uniform vec3 uSkyColor;
      uniform vec3 uFogColor;
      uniform float uFogDensity;
      uniform sampler2D uReflMap;
      uniform float uHasRefl;
      uniform sampler2D uShadowMap;
      uniform float uHasShadow;
      varying vec3 vWorldPos;
      varying vec4 vReflClip;
      varying vec4 vShadowCoord;

      float unpackShadowDepth(vec4 v) {
        const float UnpackDownscale = 255.0 / 256.0;
        const vec4 UnpackFactors4 = vec4(UnpackDownscale / vec3(1.0, 256.0, 65536.0), 1.0 / 16777216.0);
        return dot(v, UnpackFactors4);
      }

      float sampleSunShadow() {
        if (uHasShadow < 0.5) return 1.0;
        vec3 sc = vShadowCoord.xyz / max(vShadowCoord.w, 1e-4);
        if (sc.x < 0.002 || sc.x > 0.998 || sc.y < 0.002 || sc.y > 0.998 || sc.z < 0.0 || sc.z > 1.0) return 1.0;
        float bias = 0.0007;
        float tx = 1.0 / 2048.0;
        float sum = 0.0;
        for (int ox = -1; ox <= 1; ox++) {
          for (int oy = -1; oy <= 1; oy++) {
            float d = unpackShadowDepth(texture2D(uShadowMap, sc.xy + vec2(float(ox), float(oy)) * tx * 1.4));
            sum += (sc.z - bias <= d) ? 1.0 : 0.0;
          }
        }
        return sum / 9.0;
      }

      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float vnoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
          mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
        for (int i = 0; i < 4; i++) {
          v += a * vnoise(p);
          p = m * p * 2.03 + vec2(7.3, 11.9);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 p = vWorldPos.xz;
        vec3 V = normalize(cameraPosition - vWorldPos);

        // Exact Manhattan Commissioners' Grid zones
        float in7th = step(-11.2, p.x) * step(p.x, 10.2);
        float xBway = -1.5 + p.y * 0.225;
        float distBway = abs(p.x - xBway);

        float d47 = abs(p.y + 188.0);
        float d46 = abs(p.y + 109.0);
        float d45 = abs(p.y + 29.0);
        float d44 = abs(p.y - 51.0);
        float d43 = abs(p.y - 130.0);
        float d42 = abs(p.y - 208.0);
        float minCross = min(min(min(d47, d46), min(d45, d44)), min(d43, d42));
        float inCross = step(minCross, 7.6);
        float in42nd = step(d42, 11.5);

        float inDuffy = step(-180.0, p.y) * step(p.y, -116.5) * step(xBway - 11.5, p.x) * step(p.x, -11.2);
        float inBwayPlaza = step(-180.0, p.y) * step(p.y, 196.0) * step(distBway, 11.5) * (1.0 - in7th) * (1.0 - inCross);
        float inSouthIsland = step(59.0, p.y) * step(p.y, 158.0) * step(8.5, p.x) * step(p.x, xBway + 10.0) * (1.0 - inCross);

        float isRoad = clamp(max(in7th, max(inCross, in42nd)), 0.0, 1.0);
        float isPlaza = clamp(max(inDuffy, max(inBwayPlaza, inSouthIsland)), 0.0, 1.0);

        // High-frequency NYC aggregate, tar cracks, grime & tire wear
        float aggHi = vnoise(p * 38.0) * 0.55 + vnoise(p * 86.0) * 0.45;
        float aggMid = vnoise(p * 11.0);
        float grime = fbm(p * 0.28 + vec2(3.1, 8.7));
        float crackField = abs(fbm(p * 0.78 + vec2(12.4, -4.2)) - 0.5);
        float cracks = 1.0 - smoothstep(0.0, 0.015, crackField);
        float tireLane = min(min(abs(p.x + 8.4), abs(p.x + 3.2)), min(abs(p.x - 2.0), abs(p.x - 7.2)));
        float tireWear = in7th * exp(-tireLane * 1.15);

        // Deep realistic NYC charcoal asphalt
        vec3 asphaltCol = vec3(0.068, 0.070, 0.075) * (0.76 + 0.42 * aggHi) * (0.76 + 0.36 * grime);
        asphaltCol *= 1.0 - 0.16 * tireWear;
        asphaltCol = mix(asphaltCol, vec3(0.020, 0.021, 0.024), cracks * 0.75);

        // Snøhetta Pre-Cast Dark Granite Plaza Pavers + Recessed Nickel-Steel Discs
        vec2 paverUv = fract(p * vec2(0.85, 1.45));
        float paverJoint = smoothstep(0.022, 0.052, paverUv.x) * smoothstep(0.022, 0.052, paverUv.y)
                         * smoothstep(0.022, 0.052, 1.0 - paverUv.x) * smoothstep(0.022, 0.052, 1.0 - paverUv.y);
        float paverTone = 0.84 + 0.24 * hash21(floor(p * vec2(0.85, 1.45)));
        float studD = length(fract(p * 1.7) - 0.5);
        float steelStud = (1.0 - smoothstep(0.026, 0.048, studD)) * step(0.64, hash21(floor(p * 1.7))) * isPlaza;
        vec3 plazaCol = vec3(0.135, 0.138, 0.146) * paverTone * (0.84 + 0.28 * aggHi) * mix(0.48, 1.0, paverJoint);
        plazaCol = mix(plazaCol, vec3(0.55, 0.58, 0.64), steelStud * 0.68);

        // NYC Concrete Sidewalk Slabs
        vec2 swUv = fract(p * 0.62);
        float swJoint = smoothstep(0.014, 0.038, swUv.x) * smoothstep(0.014, 0.038, swUv.y);
        vec3 sidewalkCol = vec3(0.165, 0.162, 0.158) * (0.80 + 0.28 * aggHi) * mix(0.55, 1.0, swJoint) * (0.78 + 0.34 * grime);

        vec3 baseCol = mix(sidewalkCol, plazaCol, isPlaza);
        baseCol = mix(baseCol, asphaltCol, isRoad);

        // Road markings, crosswalks, yellow curb lines & cast-iron Con Edison manholes
        if (isRoad > 0.5) {
          float paintWear = smoothstep(0.20, 0.58, grime * 0.65 + aggMid * 0.42);
          float laneX = min(min(abs(p.x + 5.8), abs(p.x + 0.6)), abs(p.x - 4.6));
          float dashZ = step(0.46, fract(p.y * 0.11));
          float laneMark = (1.0 - smoothstep(0.065, 0.11, laneX)) * dashZ * in7th * (1.0 - inCross);
          baseCol = mix(baseCol, vec3(0.70, 0.70, 0.66), laneMark * 0.86 * paintWear);

          float curbLine = (1.0 - smoothstep(0.07, 0.13, abs(p.x + 10.6))) * in7th * (1.0 - inCross);
          baseCol = mix(baseCol, vec3(0.78, 0.56, 0.06), curbLine * 0.84 * paintWear);

          float cwBand = step(6.4, minCross) * step(minCross, 10.4) * in7th;
          float zebraX = step(0.42, fract(p.x * 0.85));
          float crosswalk = cwBand * zebraX;
          float cwSide = step(10.4, abs(p.x + 0.5)) * step(abs(p.x + 0.5), 14.2) * step(minCross, 6.2);
          float zebraZ = step(0.42, fract(p.y * 0.85));
          crosswalk = max(crosswalk, cwSide * zebraZ);
          baseCol = mix(baseCol, vec3(0.76, 0.76, 0.73), crosswalk * 0.88 * paintWear);

          vec2 mhCell = floor(p * 0.085);
          vec2 mhOff = fract(p * 0.085) - vec2(0.35 + 0.3 * hash21(mhCell), 0.35 + 0.3 * hash21(mhCell + 9.1));
          float mhDist = length(mhOff) / 0.085;
          if (mhDist < 0.46 && hash21(mhCell + 3.7) > 0.65) {
            float ring = smoothstep(0.37, 0.43, mhDist);
            float waffle = step(0.5, fract(p.x * 16.0)) * step(0.5, fract(p.y * 16.0));
            baseCol = mix(vec3(0.09, 0.085, 0.08) * (0.85 + 0.3 * waffle), vec3(0.03, 0.03, 0.035), ring);
          }
        }

        float edge7th = exp(-min(abs(p.x + 11.2), abs(p.x - 10.2)) * 2.4);
        baseCol *= 1.0 - 0.42 * edge7th;
        float adaRamp = (1.0 - isRoad) * step(minCross, 10.8) * step(6.0, minCross) * step(0.25, edge7th);
        baseCol = mix(baseCol, vec3(0.80, 0.64, 0.08), adaRamp * 0.74);

        // Winter snow dusting (leaving wet dark tire tracks)
        float snowNoise = fbm(p * 0.24 + vec2(4.2, -9.1));
        float snowMask = uSnow * smoothstep(0.28, 0.72, snowNoise + uSnow * 0.35) * (1.0 - tireWear * 0.80);
        baseCol = mix(baseCol, vec3(0.72, 0.76, 0.82), snowMask * 0.84);

        // --- Patchy Realistic Wet NYC Asphalt Puddles (~38% road pools, ~20% granite plaza, NOT a flooded lake!) ---
        float pField = fbm(p * 0.085 + vec2(17.3, -6.2)) * 0.65 + fbm(p * 0.28 - vec2(4.1, 2.9)) * 0.35;
        float pThresh = mix(0.61, 0.51, isRoad) - 0.055 * edge7th - 0.055 * uRain;
        float puddle = smoothstep(pThresh, pThresh + 0.095, pField)
                     * smoothstep(0.08, 0.35, uWetness) * (1.0 - snowMask * 0.9);
        float damp = clamp(uWetness * 0.66 + puddle, 0.0, 1.0) * (1.0 - snowMask * 0.85);

        // Wet surfaces darken richly into NYC charcoal; dry Golden Hour granite keeps rich warm carved grain!
        baseCol *= mix(1.0, 0.36, damp * 0.88);

        // Surface micro-normal + crisp multi-cell expanding raindrop splash ripples inside puddles!
        float nx = (vnoise(p * 32.0 + vec2(0.032, 0.0)) - vnoise(p * 32.0 - vec2(0.032, 0.0))) * (1.0 - puddle * 0.94);
        float nz = (vnoise(p * 32.0 + vec2(0.0, 0.032)) - vnoise(p * 32.0 - vec2(0.0, 0.032))) * (1.0 - puddle * 0.94);

        vec2 rippleN = vec2(0.0);
        float rippleRingSpec = 0.0;
        if (uRain > 0.05 && damp > 0.15) {
          float rMask = clamp(puddle * 1.1 + damp * 0.35, 0.0, 1.0);
          for (int k = 0; k < 3; k++) {
            float fk = float(k);
            vec2 rp = p * (1.15 + fk * 0.78) + fk * 17.3;
            vec2 ri = floor(rp);
            vec2 rf = fract(rp) - 0.5;
            float rt = fract(uTime * (1.15 + fk * 0.35) + hash21(ri) * 6.283);
            float rd = length(rf);
            float radius = rt * 0.48;
            float ring = exp(-abs(rd - radius) * 26.0) * (1.0 - rt);
            float wave = sin((rd - radius) * 52.0) * ring;
            rippleN += normalize(rf + 1e-4) * wave * uRain * rMask * 0.11;
            rippleRingSpec += ring * uRain * rMask;
          }
        }
        vec3 N = normalize(vec3(nx * 0.55 + rippleN.x, 1.0, nz * 0.55 + rippleN.y));
        float NdV = max(dot(N, V), 0.0);
        float fresnel = mix(0.14, 0.86, pow(1.0 - NdV, 2.8));

        // Blazing Warm Manhattanhenge Golden Hour Sun + High-Contrast 9-Tap PCF Cast Shadows + Moody Night Canyon Ambient!
        float day = 1.0 - uNight;
        float NdL = max(dot(N, uSunDir), 0.0);
        float sunShadow = day > 0.05 ? sampleSunShadow() : 1.0;
        vec3 warmSun = mix(vec3(1.38, 0.78, 0.36), vec3(1.08, 0.96, 0.84), smoothstep(0.24, 0.58, uSunDir.y));
        vec3 sunLit = warmSun * (0.04 + 2.65 * NdL * sunShadow) * day;
        vec3 nightBounce = mix(vec3(0.15, 0.13, 0.22), vec3(0.26, 0.14, 0.22), 0.5 + 0.5 * sin(p.x * 0.05 + p.y * 0.03)) * uNight;
        vec3 ambSky = mix(vec3(0.22, 0.24, 0.34), uSkyColor * 0.32, uNight);

        vec3 col = baseCol * (sunLit + ambSky + nightBounce);

        // --- TRUE REAL-TIME LAYERED PLANAR REFLECTIONS (Patchy Puddles + Soft Wet Asphalt Sheen, ZERO Curb Seams!) ---
        if (uHasRefl > 0.5 && damp > 0.02) {
          vec2 reflUv = (vReflClip.xy / max(vReflClip.w, 1e-4)) * 0.5 + 0.5;
          // Liquid puddle ripple distortion + heavier roughness distortion on damp asphalt!
          vec2 distort = vec2(nx, nz) * mix(0.036, 0.0045, puddle) + rippleN * 0.15;
          vec2 rUv = clamp(reflUv + distort, vec2(0.004), vec2(0.996));

          // Smooth 4-tap kernel everywhere (2.2px liquid sheen inside puddles, 8.5px diffused sheen on rough wet asphalt)
          float blurR = mix(0.0085, 0.0022, puddle);
          vec3 mirrorCol = (
            texture2D(uReflMap, rUv).rgb * 0.40 +
            texture2D(uReflMap, clamp(rUv + vec2(blurR, 0.0), 0.004, 0.996)).rgb * 0.15 +
            texture2D(uReflMap, clamp(rUv - vec2(blurR, 0.0), 0.004, 0.996)).rgb * 0.15 +
            texture2D(uReflMap, clamp(rUv + vec2(0.0, blurR), 0.004, 0.996)).rgb * 0.15 +
            texture2D(uReflMap, clamp(rUv - vec2(0.0, blurR), 0.004, 0.996)).rgb * 0.15
          );

          // Rich neon reflection saturation + filmic compression strictly <= 0.88
          float rLum = dot(mirrorCol, vec3(0.2126, 0.7152, 0.0722));
          mirrorCol = mix(vec3(rLum), mirrorCol, 1.24);
          mirrorCol = mirrorCol / (1.0 + mirrorCol * 0.38);
          mirrorCol = clamp(mirrorCol, 0.0, 0.88);

          // Patchy puddle reflection vs restrained granite plaza sheen (prevents raised-curb reflection seams!)
          float plazaScale = mix(1.0, 0.46, isPlaza);
          float reflMask = clamp(fresnel * mix(0.18 * damp, 0.78, puddle) * plazaScale + steelStud * 0.38, 0.0, 0.82);
          col = mix(col, mirrorCol, reflMask);
          // Sparkling neon-lit concentric raindrop splash rings on wet asphalt & puddles!
          col += (mirrorCol * 0.65 + vec3(0.28, 0.36, 0.48)) * rippleRingSpec * 0.38;
        }

        // Crisp warm golden-hour granite & asphalt specular (masked by real building cast shadows!)
        vec3 H = normalize(V + uSunDir);
        float sunSpec = pow(max(dot(N, H), 0.0), mix(36.0, 180.0, puddle)) * day * sunShadow * (0.26 + 0.55 * damp + steelStud * 0.85);
        col += vec3(1.0, 0.76, 0.44) * sunSpec * 0.52;

        // Atmospheric distance haze
        float dist = length(cameraPosition - vWorldPos);
        float fogT = 1.0 - exp(-dist * uFogDensity);
        col = mix(col, uFogColor, clamp(fogT, 0.0, 0.80));

        // Strict anti-blowout clamp below UnrealBloomPass threshold (1.22)
        col = min(col, vec3(0.92));

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

  return { material, uniforms };
}
