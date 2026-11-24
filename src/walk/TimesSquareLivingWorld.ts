import * as THREE from 'three';
import { getTktsWalkHeight } from './TimesSquareHeroLandmarks';

export interface LivingWorld {
  group: THREE.Group;
  update: (timeSec: number, dt: number, camPos: THREE.Vector3, rain: number, snow: number, night: number) => void;
  dispose: () => void;
}

interface Vehicle {
  mesh: THREE.Group;
  axis: 'z' | 'x';
  laneCoord: number;
  pos: number;
  dir: number;
  speed: number;
  curSpeed: number;
  minPos: number;
  maxPos: number;
  brakeMat: THREE.MeshBasicMaterial;
}

interface Pedestrian {
  x: number;
  z: number;
  vx: number;
  vz: number;
  speed: number;
  phase: number;
  height: number;
  seated: boolean;
  holdingPhone: boolean;
  yaw: number;
  lean: number;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

function seededRand(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function makeSoftCircleTex(innerRgba: string, outerRgba: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const g = c.getContext('2d')!;
  const rg = g.createRadialGradient(32, 32, 2, 32, 32, 30);
  rg.addColorStop(0, innerRgba);
  rg.addColorStop(1, outerRgba);
  g.fillStyle = rg;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeRainStreakTex(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 16; c.height = 128;
  const g = c.getContext('2d')!;
  const lg = g.createLinearGradient(0, 0, 0, 128);
  lg.addColorStop(0, 'rgba(210, 234, 255, 0.0)');
  lg.addColorStop(0.22, 'rgba(225, 242, 255, 0.58)');
  lg.addColorStop(0.76, 'rgba(246, 250, 255, 0.90)');
  lg.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
  const hg = g.createLinearGradient(0, 0, 16, 0);
  hg.addColorStop(0, 'rgba(255,255,255,0)');
  hg.addColorStop(0.5, 'rgba(255,255,255,1)');
  hg.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = lg;
  g.fillRect(4, 0, 8, 128);
  g.globalCompositeOperation = 'destination-in';
  g.fillStyle = hg;
  g.fillRect(0, 0, 16, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeTourBusBannerTex(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 64;
  const g = c.getContext('2d')!;
  g.fillStyle = '#0e1016'; g.fillRect(0, 0, 512, 64);
  g.fillStyle = '#ffbf2e';
  g.font = '800 32px Montserrat, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('TOP VIEW  ·  NYC SIGHTSEEING', 256, 34);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeTaxiMedallionTex(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 192; c.height = 64;
  const g = c.getContext('2d')!;
  g.fillStyle = '#ffeb82'; g.fillRect(0, 0, 192, 64);
  g.strokeStyle = '#141518'; g.lineWidth = 6; g.strokeRect(3, 3, 186, 58);
  g.fillStyle = '#141518';
  g.font = '900 34px Montserrat, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('NYC TAXI', 96, 34);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeNypdSideTex(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 128;
  const g = c.getContext('2d')!;
  g.fillStyle = '#eef3fa'; g.fillRect(0, 0, 512, 128);
  g.fillStyle = '#0c4ea2'; g.fillRect(0, 54, 512, 34);
  g.fillStyle = '#ffffff';
  g.font = '900 28px Montserrat, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('N Y P D   ·   P O L I C E', 268, 72);
  g.fillStyle = '#0c4ea2';
  g.font = '700 18px Montserrat, sans-serif';
  g.fillText('COURTESY · PROFESSIONALISM · RESPECT', 268, 30);
  // Crisp gold shield emblem on front door
  g.fillStyle = '#d4af37';
  g.beginPath(); g.arc(62, 66, 20, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#0c4ea2'; g.lineWidth = 4; g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeBigBusSideTex(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = '#b81020'; g.fillRect(0, 0, 1024, 256);
  // Warm backlit lower-deck tinted windows with silhouettes
  for (let i = 0; i < 6; i++) {
    const wx = 44 + i * 158;
    const wg = g.createLinearGradient(wx, 18, wx, 134);
    wg.addColorStop(0, '#182436'); wg.addColorStop(0.55, '#584434'); wg.addColorStop(1, '#221c18');
    g.fillStyle = wg; g.fillRect(wx, 18, 138, 114);
    g.strokeStyle = '#12151c'; g.lineWidth = 6; g.strokeRect(wx, 18, 138, 114);
    // Warm overhead interior reading lamp glow + seated tourist head silhouette
    g.fillStyle = 'rgba(255, 224, 168, 0.55)'; g.fillRect(wx + 24, 24, 90, 8);
    g.fillStyle = 'rgba(14, 16, 22, 0.75)';
    g.beginPath(); g.arc(wx + 48, 86, 15, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(wx + 96, 88, 14, 0, Math.PI * 2); g.fill();
  }
  // Iconic gold & white NYC sightseeing tour bus side branding
  g.fillStyle = '#f2c12e'; g.fillRect(0, 144, 1024, 14);
  g.fillStyle = '#ffffff';
  g.font = '900 44px Montserrat, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('BIG BUS  ·  NEW YORK SIGHTSEEING', 512, 198);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/**
 * Smooth anatomically contoured tailored coat/jacket upper-body LatheGeometry
 * (gently sloped rounded human shoulders, full chest, natural waist taper — ZERO 90° flat plank shoulders!).
 */
function createTailoredCoatGeom(): THREE.BufferGeometry {
  const pts = [
    new THREE.Vector2(0.01, -0.44),
    new THREE.Vector2(0.155, -0.43), // Coat skirt bottom hem (y = 0.72)
    new THREE.Vector2(0.150, -0.26), // Hips
    new THREE.Vector2(0.136, -0.06), // Tailored waist
    new THREE.Vector2(0.168, 0.16),  // Full chest
    new THREE.Vector2(0.172, 0.24),  // Rounded outer shoulder curve
    new THREE.Vector2(0.135, 0.29),  // Sloped upper shoulder
    new THREE.Vector2(0.068, 0.31),  // Collar neck base (y = 1.46)
    new THREE.Vector2(0.01, 0.31),
  ];
  const g = new THREE.LatheGeometry(pts, 14);
  g.scale(1.18, 1.0, 0.68);
  g.computeVertexNormals();
  return g;
}

function makeCabStripeTex(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 64;
  const g = c.getContext('2d')!;
  g.fillStyle = '#f7b800';
  g.fillRect(0, 0, 256, 64);
  g.fillStyle = '#141518';
  for (let i = 0; i < 16; i++) g.fillRect(i * 16, i % 2 === 0 ? 40 : 48, 16, 8);
  g.font = '800 22px Montserrat, sans-serif';
  g.textAlign = 'center';
  g.fillStyle = '#111216';
  g.fillText('NYC  TAXI  ·  4B27', 128, 26);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/**
 * Creates a smooth contoured modern sedan/SUV side-profile extrusion (sloped hood, raked windshield,
 * curved roofline, contoured trunk — NO flat LEGO boxes!).
 */
function createContouredCarBody(isSuv: boolean): THREE.BufferGeometry {
  const s = new THREE.Shape();
  if (isSuv) {
    s.moveTo(-2.45, 0.34);
    s.lineTo(2.45, 0.34);
    s.lineTo(2.42, 0.92);
    s.lineTo(1.38, 1.06); // Sloped SUV hood
    s.lineTo(0.84, 1.66); // Raked windshield
    s.lineTo(-1.88, 1.68); // Roofline
    s.lineTo(-2.34, 1.06); // Rear tailgate
    s.lineTo(-2.45, 0.92);
    s.closePath();
  } else {
    s.moveTo(-2.38, 0.32);
    s.lineTo(2.38, 0.32);
    s.lineTo(2.34, 0.82);
    s.lineTo(1.22, 0.96); // Sleek sloped sedan hood
    s.lineTo(0.62, 1.48); // Raked front windshield
    s.lineTo(-0.78, 1.48); // Curved cabin roof
    s.lineTo(-1.42, 0.98); // Fastback rear window
    s.lineTo(-2.28, 0.92); // Trunk deck
    s.lineTo(-2.38, 0.78);
    s.closePath();
  }
  const geom = new THREE.ExtrudeGeometry(s, {
    depth: 1.76,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: 2,
  });
  // Center width along X, align length along +Z front
  geom.translate(0, 0, -0.88);
  geom.rotateY(-Math.PI / 2);
  geom.computeVertexNormals();
  return geom;
}

/**
 * Iteration #3 Living Times Square:
 *  - Smooth contoured clearcoat NYC Yellow Cabs, TLC SUVs, NYPD SUVs, MTA Bus & Red Double-Decker Tour Buses
 *    with forward headlight road pools & crimson brake glow!
 *  - 300 Smooth Organic Multi-Part Pedestrians (CapsuleGeometry coats, rounded shoulders, smooth hair/beanies,
 *    natural varied seated TKTS crowd in colorful NYC outerwear, ~18% holding glowing smartphones, ZERO Minecraft boxes!).
 *  - 2,000 Layered Soft Motion-Blurred Raindrop Streak Quads tinted by Manhattan neon!
 */
export function buildTimesSquareLivingWorld(): LivingWorld {
  const group = new THREE.Group();
  group.name = 'TimesSquareLivingWorld';
  const disposables: Array<{ dispose(): void }> = [];
  const track = <T extends { dispose(): void }>(x: T): T => {
    disposables.push(x);
    return x;
  };
  const rand = seededRand(20261124);

  const shadowDiscTex = track(makeSoftCircleTex('rgba(0,0,0,0.68)', 'rgba(0,0,0,0.0)'));
  const headlightPoolTex = track(makeSoftCircleTex('rgba(255,244,210,0.34)', 'rgba(255,240,200,0.0)'));
  const brakePoolTex = track(makeSoftCircleTex('rgba(255,30,36,0.34)', 'rgba(255,20,24,0.0)'));
  const contactShadowMat = track(new THREE.MeshBasicMaterial({ map: shadowDiscTex, transparent: true, depthWrite: false }));
  const hlPoolMat = track(new THREE.MeshBasicMaterial({ map: headlightPoolTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  const brakePoolMat = track(new THREE.MeshBasicMaterial({ map: brakePoolTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));

  const cabStripeTex = track(makeCabStripeTex());
  const tourBannerTex = track(makeTourBusBannerTex());
  const taxiMedTex = track(makeTaxiMedallionTex());
  const nypdSideTex = track(makeNypdSideTex());
  const bigBusSideTex = track(makeBigBusSideTex());
  const cabYellowMat = track(new THREE.MeshPhysicalMaterial({
    color: '#ffb800', roughness: 0.15, metalness: 0.28, clearcoat: 1.0, clearcoatRoughness: 0.08,
  }));
  const cabSideMat = track(new THREE.MeshPhysicalMaterial({
    map: cabStripeTex, roughness: 0.16, metalness: 0.24, clearcoat: 1.0, clearcoatRoughness: 0.08,
  }));
  const nypdSideMat = track(new THREE.MeshPhysicalMaterial({
    map: nypdSideTex, roughness: 0.18, metalness: 0.25, clearcoat: 1.0, clearcoatRoughness: 0.08,
  }));
  const bigBusSideMat = track(new THREE.MeshPhysicalMaterial({
    map: bigBusSideTex, emissive: '#ffcf9e', emissiveMap: bigBusSideTex, emissiveIntensity: 0.35,
    roughness: 0.24, metalness: 0.25, clearcoat: 0.85,
  }));
  const tourBannerMat = track(new THREE.MeshBasicMaterial({ map: tourBannerTex }));
  const taxiMedMat = track(new THREE.MeshBasicMaterial({ map: taxiMedTex }));
  const amberSignalMat = track(new THREE.MeshBasicMaterial({ color: '#ff9914' }));
  const plateMat = track(new THREE.MeshBasicMaterial({ color: '#f2c844' }));
  const darkTrimMat = track(new THREE.MeshStandardMaterial({ color: '#14171d', roughness: 0.55, metalness: 0.35 }));
  const blackSuvMat = track(new THREE.MeshPhysicalMaterial({
    color: '#222c3c', roughness: 0.14, metalness: 0.65, clearcoat: 1.0, clearcoatRoughness: 0.08, envMapIntensity: 1.65,
  }));
  const nypdWhiteMat = track(new THREE.MeshPhysicalMaterial({
    color: '#ebf0f7', roughness: 0.18, metalness: 0.25, clearcoat: 1.0,
  }));
  const busBlueMat = track(new THREE.MeshPhysicalMaterial({
    color: '#1556ba', roughness: 0.28, metalness: 0.3, clearcoat: 0.75,
  }));
  const tourRedMat = track(new THREE.MeshPhysicalMaterial({
    color: '#cf1224', roughness: 0.24, metalness: 0.28, clearcoat: 0.88,
  }));
  const glassMat = track(new THREE.MeshPhysicalMaterial({
    color: '#08101c', roughness: 0.06, metalness: 0.9, clearcoat: 1.0,
  }));
  const chromeMat = track(new THREE.MeshStandardMaterial({ color: '#d4dce8', roughness: 0.18, metalness: 0.96 }));
  const tireMat = track(new THREE.MeshStandardMaterial({ color: '#141518', roughness: 0.88, metalness: 0.08 }));
  const headLightMat = track(new THREE.MeshBasicMaterial({ color: '#fff9e8' }));
  const taxiSignMat = track(new THREE.MeshBasicMaterial({ color: '#ffec8a' }));
  const policeBlueMat = track(new THREE.MeshBasicMaterial({ color: '#2288ff' }));
  const policeRedMat = track(new THREE.MeshBasicMaterial({ color: '#ff2233' }));

  const sedanBodyGeom = track(createContouredCarBody(false));
  const suvBodyGeom = track(createContouredCarBody(true));
  const wheelGeom = track(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 14));
  wheelGeom.rotateZ(Math.PI / 2);
  const rimGeom = track(new THREE.CylinderGeometry(0.21, 0.21, 0.26, 12));
  rimGeom.rotateZ(Math.PI / 2);

  function createCarMesh(kind: 'cab' | 'suv' | 'nypd' | 'bus' | 'tourbus'): { root: THREE.Group; brakeMat: THREE.MeshBasicMaterial } {
    const root = new THREE.Group();
    const brakeMat = track(new THREE.MeshBasicMaterial({ color: '#ff1c1c' }));
    const isLarge = kind === 'bus' || kind === 'tourbus';

    // Flush dark under-chassis AO contact shadow + TWIN focused forward headlight beams + TWIN rear crimson brake pools!
    const sh = new THREE.Mesh(track(new THREE.PlaneGeometry(isLarge ? 3.3 : 2.35, isLarge ? 12.2 : 5.4)), contactShadowMat);
    sh.rotation.x = -Math.PI / 2; sh.position.y = 0.025;
    root.add(sh);
    const beamOffX = isLarge ? 0.92 : 0.66;
    for (const bx of [-beamOffX, beamOffX]) {
      const hlPool = new THREE.Mesh(track(new THREE.PlaneGeometry(1.35, isLarge ? 7.2 : 5.6)), hlPoolMat);
      hlPool.rotation.x = -Math.PI / 2; hlPool.position.set(bx, 0.032, isLarge ? 8.8 : 5.2);
      const tlPool = new THREE.Mesh(track(new THREE.PlaneGeometry(1.15, 2.8)), brakePoolMat);
      tlPool.rotation.x = -Math.PI / 2; tlPool.position.set(bx, 0.030, isLarge ? -7.0 : -3.4);
      root.add(hlPool, tlPool);
    }

    if (kind === 'bus' || kind === 'tourbus') {
      const isDouble = kind === 'tourbus';
      const bodyMat = isDouble ? tourRedMat : nypdWhiteMat;
      const lower = new THREE.Mesh(track(new THREE.BoxGeometry(2.55, 1.38, 11.4)), bodyMat); lower.position.y = 1.02;
      const midGlass = new THREE.Mesh(track(new THREE.BoxGeometry(2.50, 1.12, 10.9)), glassMat); midGlass.position.y = 2.22;
      const frontBumper = new THREE.Mesh(track(new THREE.BoxGeometry(2.60, 0.28, 0.28)), darkTrimMat); frontBumper.position.set(0, 0.44, 5.74);
      const rearBumper = frontBumper.clone(); rearBumper.position.z = -5.74;
      root.add(lower, midGlass, frontBumper, rearBumper);
      // Vertical steel window mullions breaking up the long bus glass into authentic passenger bays
      for (let m = -4.2; m <= 4.2; m += 1.68) {
        const mullion = new THREE.Mesh(track(new THREE.BoxGeometry(2.56, 1.16, 0.14)), darkTrimMat);
        mullion.position.set(0, 2.22, m);
        root.add(mullion);
      }
      if (isDouble) {
        // Authentic Open-Top Red NYC Double-Decker Sightseeing Bus (backlit lower bay windows + Big Bus livery + open upper deck!)
        const sidePanelL = new THREE.Mesh(track(new THREE.PlaneGeometry(11.1, 2.25)), bigBusSideMat);
        sidePanelL.position.set(-1.29, 1.65, 0); sidePanelL.rotation.y = -Math.PI / 2;
        const sidePanelR = sidePanelL.clone(); sidePanelR.position.x = 1.29; sidePanelR.rotation.y = Math.PI / 2;
        const goldBand = new THREE.Mesh(track(new THREE.BoxGeometry(2.60, 0.26, 11.42)), cabYellowMat); goldBand.position.y = 2.86;
        const deckFloor = new THREE.Mesh(track(new THREE.BoxGeometry(2.54, 0.18, 11.2)), darkTrimMat); deckFloor.position.y = 3.04;
        const sideL = new THREE.Mesh(track(new THREE.BoxGeometry(0.10, 0.82, 11.1)), tourRedMat); sideL.position.set(-1.24, 3.48, 0);
        const sideR = sideL.clone(); sideR.position.x = 1.24;
        const frontGuard = new THREE.Mesh(track(new THREE.BoxGeometry(2.56, 0.82, 0.12)), tourRedMat); frontGuard.position.set(0, 3.48, 5.54);
        const rearGuard = frontGuard.clone(); rearGuard.position.z = -5.54;
        const railTopL = new THREE.Mesh(track(new THREE.BoxGeometry(0.06, 0.06, 11.1)), chromeMat); railTopL.position.set(-1.24, 3.98, 0);
        const railTopR = railTopL.clone(); railTopR.position.x = 1.24;
        root.add(sidePanelL, sidePanelR, goldBand, deckFloor, sideL, sideR, frontGuard, rearGuard, railTopL, railTopR);
        // Amber upper clearance LEDs + open-air upper deck passenger seat rows
        for (const cx of [-1.1, 0, 1.1]) {
          const amb = new THREE.Mesh(track(new THREE.BoxGeometry(0.14, 0.08, 0.08)), amberSignalMat);
          amb.position.set(cx, 3.92, 5.60);
          root.add(amb);
        }
        for (let sz = -4.2; sz <= 4.2; sz += 1.4) {
          const seatL = new THREE.Mesh(track(new THREE.BoxGeometry(0.85, 0.62, 0.36)), darkTrimMat); seatL.position.set(-0.62, 3.40, sz);
          const seatR = seatL.clone(); seatR.position.x = 0.62;
          root.add(seatL, seatR);
        }
        const destGlow = new THREE.Mesh(track(new THREE.PlaneGeometry(2.15, 0.34)), tourBannerMat); destGlow.position.set(0, 2.74, 5.72);
        root.add(destGlow);
      } else {
        const stripe = new THREE.Mesh(track(new THREE.BoxGeometry(2.58, 0.42, 11.42)), busBlueMat); stripe.position.y = 1.18;
        const roof = new THREE.Mesh(track(new THREE.BoxGeometry(2.54, 0.26, 11.3)), nypdWhiteMat); roof.position.y = 2.95;
        const destGlow = new THREE.Mesh(track(new THREE.PlaneGeometry(1.9, 0.36)), taxiSignMat); destGlow.position.set(0, 2.68, 5.72);
        root.add(stripe, roof, destGlow);
      }
      for (const wz of [-3.6, 3.6]) for (const wx of [-1.22, 1.22]) {
        const w = new THREE.Mesh(wheelGeom, tireMat); const r = new THREE.Mesh(rimGeom, chromeMat);
        w.scale.set(1.3, 1.3, 1.3); r.scale.set(1.3, 1.3, 1.3);
        w.position.set(wx, 0.44, wz); r.position.set(wx, 0.44, wz);
        root.add(w, r);
      }
      for (const lx of [-0.95, 0.95]) {
        const hl = new THREE.Mesh(track(new THREE.BoxGeometry(0.38, 0.22, 0.08)), headLightMat); hl.position.set(lx, 0.78, 5.72);
        const tl = new THREE.Mesh(track(new THREE.BoxGeometry(0.42, 0.26, 0.08)), brakeMat); tl.position.set(lx, 0.95, -5.72);
        root.add(hl, tl);
      }
      root.traverse((o) => {
        if (o !== sh) o.layers.enable(1);
      });
      return { root, brakeMat };
    }

    const bodyMat = kind === 'cab' ? cabYellowMat : kind === 'nypd' ? nypdWhiteMat : blackSuvMat;
    const isSuv = kind === 'suv' || kind === 'nypd';
    const len = isSuv ? 4.90 : 4.76;

    // Smooth contoured beveled ExtrudeGeometry sedan/SUV shell + crisp bumpers, chrome window trim, mirrors & plates!
    const shell = new THREE.Mesh(isSuv ? suvBodyGeom : sedanBodyGeom, bodyMat);
    shell.castShadow = true;
    const frontBumper = new THREE.Mesh(track(new THREE.BoxGeometry(1.92, 0.22, 0.16)), darkTrimMat);
    frontBumper.position.set(0, 0.42, len * 0.5 + 0.02);
    const rearBumper = new THREE.Mesh(track(new THREE.BoxGeometry(1.92, 0.22, 0.16)), darkTrimMat);
    rearBumper.position.set(0, 0.42, -len * 0.5 - 0.02);
    const plateR = new THREE.Mesh(track(new THREE.PlaneGeometry(0.34, 0.16)), plateMat);
    plateR.position.set(0, 0.62, -len * 0.5 - 0.09); plateR.rotation.y = Math.PI;
    const mirL = new THREE.Mesh(track(new THREE.BoxGeometry(0.18, 0.10, 0.14)), bodyMat); mirL.position.set(-1.02, 1.02, 0.52);
    const mirR = mirL.clone(); mirR.position.x = 1.02;
    const winTrim = new THREE.Mesh(track(new THREE.BoxGeometry(1.90, 0.05, isSuv ? 2.60 : 1.98)), chromeMat);
    winTrim.position.set(0, isSuv ? 1.08 : 0.96, isSuv ? -0.45 : -0.15);
    root.add(shell, frontBumper, rearBumper, plateR, mirL, mirR, winTrim);

    // Recessed tinted greenhouse side & front/rear windows + dark B-pillar
    const glassWrap = new THREE.Mesh(
      track(new THREE.BoxGeometry(1.86, isSuv ? 0.50 : 0.42, isSuv ? 2.55 : 1.92)),
      glassMat,
    );
    glassWrap.position.set(0, isSuv ? 1.34 : 1.18, isSuv ? -0.45 : -0.15);
    const frontWindshield = new THREE.Mesh(track(new THREE.BoxGeometry(1.66, 0.68, 0.08)), glassMat);
    frontWindshield.position.set(0, isSuv ? 1.34 : 1.21, isSuv ? 1.12 : 0.94);
    frontWindshield.rotation.x = -0.66;
    const rearGlass = new THREE.Mesh(track(new THREE.BoxGeometry(1.64, 0.56, 0.08)), glassMat);
    rearGlass.position.set(0, isSuv ? 1.34 : 1.20, isSuv ? -2.06 : -1.10);
    rearGlass.rotation.x = isSuv ? 0.35 : 0.68;
    const grille = new THREE.Mesh(track(new THREE.BoxGeometry(1.16, 0.24, 0.08)), darkTrimMat);
    grille.position.set(0, 0.62, len * 0.5 + 0.06);
    const grilleBar = new THREE.Mesh(track(new THREE.BoxGeometry(1.10, 0.05, 0.09)), chromeMat);
    grilleBar.position.set(0, 0.65, len * 0.5 + 0.07);
    root.add(glassWrap, frontWindshield, rearGlass, grille, grilleBar);

    if (kind === 'cab') {
      // NYC Taxi checkered door stripe + crisp backlit "NYC TAXI" rooftop medallion + digital ad topper
      const stripeL = new THREE.Mesh(track(new THREE.PlaneGeometry(3.4, 0.44)), cabSideMat);
      stripeL.position.set(-0.97, 0.66, 0); stripeL.rotation.y = -Math.PI / 2;
      const stripeR = stripeL.clone(); stripeR.position.x = 0.97; stripeR.rotation.y = Math.PI / 2;
      const med = new THREE.Mesh(track(new THREE.BoxGeometry(0.72, 0.24, 0.24)), taxiMedMat);
      med.position.set(0, 1.62, 0.14);
      const topper = new THREE.Mesh(track(new THREE.BoxGeometry(0.18, 0.32, 1.05)), taxiSignMat);
      topper.position.set(0, 1.68, -0.44);
      root.add(stripeL, stripeR, med, topper);
    } else if (kind === 'nypd') {
      const nypdL = new THREE.Mesh(track(new THREE.PlaneGeometry(3.8, 0.62)), nypdSideMat);
      nypdL.position.set(-0.97, 0.72, -0.1); nypdL.rotation.y = -Math.PI / 2;
      const nypdR = nypdL.clone(); nypdR.position.x = 0.97; nypdR.rotation.y = Math.PI / 2;
      const barB = new THREE.Mesh(track(new THREE.BoxGeometry(0.56, 0.15, 0.22)), policeBlueMat); barB.position.set(-0.28, 1.80, -0.2);
      const barR = new THREE.Mesh(track(new THREE.BoxGeometry(0.56, 0.15, 0.22)), policeRedMat); barR.position.set(0.28, 1.80, -0.2);
      root.add(nypdL, nypdR, barB, barR);
    }

    for (const wz of [-1.46, 1.46]) for (const wx of [-0.94, 0.94]) {
      const w = new THREE.Mesh(wheelGeom, tireMat); const r = new THREE.Mesh(rimGeom, chromeMat);
      w.position.set(wx, 0.34, wz); r.position.set(wx, 0.34, wz);
      root.add(w, r);
    }

    for (const lx of [-0.68, 0.68]) {
      const hl = new THREE.Mesh(track(new THREE.BoxGeometry(0.38, 0.14, 0.08)), headLightMat);
      hl.position.set(lx, 0.68, len * 0.5 + 0.06);
      const turn = new THREE.Mesh(track(new THREE.BoxGeometry(0.12, 0.12, 0.08)), amberSignalMat);
      turn.position.set(lx * 1.24, 0.68, len * 0.5 + 0.05);
      const tl = new THREE.Mesh(track(new THREE.BoxGeometry(0.50, 0.14, 0.08)), brakeMat);
      tl.position.set(lx, 0.72, -len * 0.5 - 0.06);
      root.add(hl, turn, tl);
    }
    const thirdBrake = new THREE.Mesh(track(new THREE.BoxGeometry(0.46, 0.05, 0.06)), brakeMat);
    thirdBrake.position.set(0, isSuv ? 1.56 : 1.06, isSuv ? -2.26 : -1.42);
    root.add(thirdBrake);

    // Enable Layer 1 on vehicle chassis & lights so cabs, headlights & taillights reflect in wet asphalt!
    root.traverse((o) => {
      if (o !== sh) o.layers.enable(1);
    });
    return { root, brakeMat };
  }

  // Spawn dense 7th Avenue Southbound NYC traffic
  const vehicles: Vehicle[] = [];
  const seventhLanes = [-8.4, -3.2, 2.0, 7.2];
  for (let i = 0; i < 24; i++) {
    const laneIdx = i % seventhLanes.length;
    const kind =
      i === 3 ? 'tourbus' : i === 15 ? 'bus' : i === 11 ? 'tourbus' : i === 9 ? 'nypd' : (i % 3 === 0 ? 'suv' : 'cab');
    const { root, brakeMat } = createCarMesh(kind);
    const zPos = -220 + ((i * 19.5 + laneIdx * 8.5) % 440);
    root.position.set(seventhLanes[laneIdx], 0, zPos);
    group.add(root);
    vehicles.push({
      mesh: root, axis: 'z', laneCoord: seventhLanes[laneIdx], pos: zPos, dir: 1,
      speed: kind === 'bus' || kind === 'tourbus' ? 7.2 : 10.2 + (i % 4) * 1.4,
      curSpeed: 8.5, minPos: -235, maxPos: 235, brakeMat,
    });
  }

  for (let i = 0; i < 6; i++) {
    const is42 = i < 4;
    const dir = is42 ? (i % 2 === 0 ? 1 : -1) : -1;
    const zLane = is42 ? (dir > 0 ? 211 : 204) : -186.5;
    const kind = i % 2 === 0 ? 'cab' : 'suv';
    const { root, brakeMat } = createCarMesh(kind);
    root.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
    const xPos = -130 + i * 48;
    root.position.set(xPos, 0, zLane);
    group.add(root);
    vehicles.push({
      mesh: root, axis: 'x', laneCoord: zLane, pos: xPos, dir,
      speed: 9.5 + (i % 3) * 1.3, curSpeed: 9.0, minPos: -155, maxPos: 155, brakeMat,
    });
  }

  const parkedNypd = createCarMesh('nypd');
  parkedNypd.root.position.set(12.2, 0, 134.8);
  parkedNypd.root.rotation.y = Math.PI * 0.92;
  group.add(parkedNypd.root);

  // --- 2. 300 Smooth Organic Multi-Part NYC Pedestrians (NO Minecraft Square Boxes!) ---
  const PED_COUNT = 300;
  const peds: Pedestrian[] = [];

  const walkZones = [
    { minX: -28.5, maxX: -12.5, minZ: -158, maxZ: -116 }, // Dense Duffy Square Plaza
    { minX: -27.5, maxX: -13.0, minZ: -146, maxZ: -122 }, // Extra core Duffy crowd around Father Duffy!
    { minX: -21.5, maxX: -12.5, minZ: -100, maxZ: -38 },  // West Broadway Plaza (Marriott)
    { minX: 11.5, maxX: 18.0, minZ: -175, maxZ: -115 },   // East Sidewalk (TSX)
    { minX: 11.5, maxX: 18.0, minZ: -95, maxZ: 45 },      // Central Broadway Plaza (1540)
    { minX: 13.0, maxX: 35.0, minZ: 60, maxZ: 155 },      // South Bowtie Plaza (One TSQ)
    { minX: -10.5, maxX: 9.5, minZ: -112, maxZ: -106 },   // 46th St crosswalk
    { minX: -10.5, maxX: 9.5, minZ: -32, maxZ: -26 },     // 45th St crosswalk
  ];

  // 70 seated/chatting spectators safely inside TKTS stair rails (x in -26.2..-15.4, ZERO balustrade/edge leg clips!)
  for (let i = 0; i < 70; i++) {
    const x = -26.0 + rand() * 10.4;
    const z = -171.6 + rand() * 10.8; // Keeps 4.6m clear foreground in front of VP2!
    peds.push({
      x, z, vx: 0, vz: 0, speed: 0, phase: rand() * Math.PI * 2,
      height: 1.56 + rand() * 0.28, seated: true,
      holdingPhone: rand() < 0.18,
      yaw: (rand() - 0.5) * 0.95,
      lean: (rand() - 0.5) * 0.14,
      minX: x, maxX: x, minZ: z, maxZ: z,
    });
  }
  // Strict Father Duffy Monument + Iron Railing exclusion zone (+1.1m outside fence on all 4 sides — ZERO fence clipping!)
  const pushOutsideDuffy = (px: number, pz: number): [number, number] => {
    const minX = -21.8, maxX = -15.4, minZ = -138.4, maxZ = -132.0;
    if (px > minX && px < maxX && pz > minZ && pz < maxZ) {
      const dL = px - minX, dR = maxX - px, dN = pz - minZ, dS = maxZ - pz;
      const m = Math.min(dL, dR, dN, dS);
      if (m === dL) return [minX - 0.35, pz];
      if (m === dR) return [maxX + 0.35, pz];
      if (m === dN) return [px, minZ - 0.35];
      return [px, maxZ + 0.35];
    }
    return [px, pz];
  };

  // 230 lively multi-directional NYC pedestrians (35% walking South, 35% walking North, 30% social pairs/photo groups!)
  for (let i = 70; i < PED_COUNT; i++) {
    const zPick = walkZones[i % walkZones.length];
    let x = zPick.minX + rand() * (zPick.maxX - zPick.minX);
    let z = zPick.minZ + rand() * (zPick.maxZ - zPick.minZ);
    // Keep immediate 5.5m lens pocket around VP1 (-16.8, -142.8) & VP3 (-15.2, -66) clear of photobombing backs
    if (Math.hypot(x + 15.2, z + 64) < 6.0) z -= 8.5;
    if (Math.hypot(x + 16.8, z + 142.8) < 5.2) z += 7.5;
    [x, z] = pushOutsideDuffy(x, z);
    const mode = rand();
    const isStanding = mode < 0.30;
    const ang = isStanding
      ? rand() * Math.PI * 2
      : (mode < 0.65 ? (rand() - 0.5) * 0.65 : Math.PI + (rand() - 0.5) * 0.65);
    const spd = isStanding ? 0 : 0.95 + rand() * 0.78;
    peds.push({
      x, z, vx: Math.sin(ang) * spd, vz: Math.cos(ang) * spd, speed: spd,
      phase: rand() * Math.PI * 2, height: 1.58 + rand() * 0.28, seated: false,
      holdingPhone: isStanding ? rand() < 0.24 : rand() < 0.06,
      yaw: ang,
      lean: 0,
      minX: zPick.minX, maxX: zPick.maxX, minZ: zPick.minZ, maxZ: zPick.maxZ,
    });
  }

  // Anatomically Sculpted Organic Human Figures (Rounded LatheGeometry Coat Shoulders, Sleek Dark Boots, ZERO Air Gaps!)
  const skinMat = track(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.76, metalness: 0.0 }));
  const hairMat = track(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.88, metalness: 0.0 }));
  const jacketMat = track(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.88, metalness: 0.0 }));
  const pantsMat = track(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.90, metalness: 0.0 }));
  const shoeMat = track(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.80, metalness: 0.0 }));
  const bagMat = track(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.84, metalness: 0.05 }));
  const phoneMat = track(new THREE.MeshBasicMaterial({ color: '#ccecff' }));

  const headInst = new THREE.InstancedMesh(track(new THREE.SphereGeometry(0.102, 10, 10)), skinMat, PED_COUNT);
  const neckInst = new THREE.InstancedMesh(track(new THREE.CylinderGeometry(0.054, 0.064, 0.16, 8)), skinMat, PED_COUNT);
  const hairInst = new THREE.InstancedMesh(track(new THREE.SphereGeometry(0.114, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.64)), hairMat, PED_COUNT);
  // Sculpted rounded-shoulder tailored coat silhouette (kills 90° flat plank shoulders!)
  const torsoInst = new THREE.InstancedMesh(track(createTailoredCoatGeom()), jacketMat, PED_COUNT);
  const hipInst = new THREE.InstancedMesh(track(new THREE.CylinderGeometry(0.142, 0.150, 0.22, 10)), pantsMat, PED_COUNT);
  const armLInst = new THREE.InstancedMesh(track(new THREE.CapsuleGeometry(0.044, 0.44, 4, 8)), jacketMat, PED_COUNT);
  const armRInst = new THREE.InstancedMesh(track(new THREE.CapsuleGeometry(0.044, 0.44, 4, 8)), jacketMat, PED_COUNT);
  const legLInst = new THREE.InstancedMesh(track(new THREE.CylinderGeometry(0.070, 0.050, 0.84, 8)), pantsMat, PED_COUNT);
  const legRInst = new THREE.InstancedMesh(track(new THREE.CylinderGeometry(0.070, 0.050, 0.84, 8)), pantsMat, PED_COUNT);
  // Sleek low-profile dark NYC boots & subtle sneakers (NO glowing white square cinderblocks!)
  const shoeLInst = new THREE.InstancedMesh(track(new THREE.BoxGeometry(0.078, 0.058, 0.175)), shoeMat, PED_COUNT);
  const shoeRInst = new THREE.InstancedMesh(track(new THREE.BoxGeometry(0.078, 0.058, 0.175)), shoeMat, PED_COUNT);
  // Sleek rounded commuter backpack (snug against coat — NO blocky black box sticking out!)
  const bagInst = new THREE.InstancedMesh(track(new THREE.CapsuleGeometry(0.095, 0.14, 4, 8)), bagMat, PED_COUNT);
  const phoneInst = new THREE.InstancedMesh(track(new THREE.BoxGeometry(0.062, 0.118, 0.012)), phoneMat, PED_COUNT);
  const pedShadowInst = new THREE.InstancedMesh(track(new THREE.PlaneGeometry(0.68, 0.68)), contactShadowMat, PED_COUNT);

  const skinTones = ['#f0cbb0', '#d8a684', '#b8825e', '#825438', '#ecc4a8', '#c6906c'];
  const hairColors = ['#141111', '#2f2018', '#523826', '#1e2c45', '#7a252e', '#997c5a', '#443228', '#30343c'];
  const jacketPalette = [
    '#202530', '#384b68', '#8a2838', '#25523d', '#b89468',
    '#4d3d5e', '#b5343c', '#4a6278', '#c8bba6', '#1d3258', '#783b68', '#c97838', '#2e333c', '#7c8694',
  ];
  const pantsPalette = ['#1a2232', '#263348', '#2c2927', '#181a20', '#363d4a', '#48433d'];
  const shoePalette = ['#1e2026', '#38261a', '#16181d', '#282f3a', '#6e6a62', '#1c1a18'];
  const bagPalette = ['#1a1e26', '#5e242c', '#263e34', '#4e3c28', '#2a364c'];

  const tmpColor = new THREE.Color();
  for (let i = 0; i < PED_COUNT; i++) {
    headInst.setColorAt(i, tmpColor.set(skinTones[i % skinTones.length]));
    neckInst.setColorAt(i, tmpColor.set(skinTones[i % skinTones.length]));
    hairInst.setColorAt(i, tmpColor.set(hairColors[i % hairColors.length]));
    torsoInst.setColorAt(i, tmpColor.set(jacketPalette[i % jacketPalette.length]));
    hipInst.setColorAt(i, tmpColor.set(pantsPalette[i % pantsPalette.length]));
    armLInst.setColorAt(i, tmpColor.set(jacketPalette[i % jacketPalette.length]));
    armRInst.setColorAt(i, tmpColor.set(jacketPalette[i % jacketPalette.length]));
    legLInst.setColorAt(i, tmpColor.set(pantsPalette[i % pantsPalette.length]));
    legRInst.setColorAt(i, tmpColor.set(pantsPalette[i % pantsPalette.length]));
    shoeLInst.setColorAt(i, tmpColor.set(shoePalette[i % shoePalette.length]));
    shoeRInst.setColorAt(i, tmpColor.set(shoePalette[i % shoePalette.length]));
    bagInst.setColorAt(i, tmpColor.set(bagPalette[i % bagPalette.length]));
  }
  for (const inst of [headInst, neckInst, hairInst, torsoInst, hipInst, armLInst, armRInst, legLInst, legRInst, shoeLInst, shoeRInst, bagInst]) {
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
    inst.castShadow = inst === torsoInst || inst === legLInst || inst === legRInst;
  }
  group.add(headInst, neckInst, hairInst, torsoInst, hipInst, armLInst, armRInst, legLInst, legRInst, shoeLInst, shoeRInst, bagInst, phoneInst, pedShadowInst);

  // --- 3. 2,400 Crisp Neon-Backlit Silver Rain Streaks (Clearly Visible Downpour + 2.4m Camera Clearance!) ---
  const RAIN_N = 2400;
  const rainSeeds = new Float32Array(RAIN_N * 3);
  for (let i = 0; i < RAIN_N; i++) {
    const near = i < 850;
    const span = near ? 18 : 48;
    let rx = (rand() - 0.5) * span;
    let rz = (rand() - 0.5) * span;
    if (Math.hypot(rx, rz) < 2.4) {
      const ang = rand() * Math.PI * 2;
      rx = Math.cos(ang) * (2.6 + rand() * 7.8);
      rz = Math.sin(ang) * (2.6 + rand() * 7.8);
    }
    rainSeeds[i * 3] = rx;
    rainSeeds[i * 3 + 1] = rand() * (near ? 14 : 25);
    rainSeeds[i * 3 + 2] = rz;
  }
  const rainTex = track(makeRainStreakTex());
  const rainMat = track(new THREE.MeshBasicMaterial({
    map: rainTex,
    color: '#e0f0ff',
    transparent: true,
    opacity: 0.54,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  }));
  const rainInst = new THREE.InstancedMesh(track(new THREE.PlaneGeometry(0.020, 0.92)), rainMat, RAIN_N);
  rainInst.frustumCulled = false;
  rainInst.visible = false;
  group.add(rainInst);

  // Soft Glowing Winter Snowflakes
  const SNOW_N = 850;
  const snowPos = new Float32Array(SNOW_N * 3);
  for (let i = 0; i < SNOW_N; i++) {
    snowPos[i * 3] = (rand() - 0.5) * 48;
    snowPos[i * 3 + 1] = rand() * 26;
    snowPos[i * 3 + 2] = (rand() - 0.5) * 48;
  }
  const snowTex = track(makeSoftCircleTex('rgba(255,255,255,0.95)', 'rgba(220,235,255,0.0)'));
  const snowGeom = track(new THREE.BufferGeometry());
  snowGeom.setAttribute('position', new THREE.BufferAttribute(snowPos, 3).setUsage(THREE.DynamicDrawUsage));
  const snowMat = track(new THREE.PointsMaterial({
    map: snowTex, color: '#f2f7ff', size: 0.16, transparent: true, opacity: 0.85, depthWrite: false,
  }));
  const snowMesh = new THREE.Points(snowGeom, snowMat);
  snowMesh.frustumCulled = false;
  snowMesh.visible = false;
  group.add(snowMesh);

  const dummy = new THREE.Object3D();
  // CRITICAL: YXZ Euler order ensures yaw applies FIRST before local arm/leg forward pitch (kills sideways T-pose broomstick arms!)
  dummy.rotation.order = 'YXZ';
  const stopLinesZ = [-188, -109, -29, 51, 130];

  return {
    group,
    update: (timeSec: number, dt: number, camPos: THREE.Vector3, rain: number, snow: number, night: number) => {
      const clampedDt = Math.min(dt, 0.06);
      const isGreenNS = (timeSec % 18) < 12;

      for (let i = 0; i < vehicles.length; i++) {
        const v = vehicles[i];
        let shouldStop = false;
        if (v.axis === 'z' && !isGreenNS) {
          for (let s = 0; s < stopLinesZ.length; s++) {
            const distToStop = (stopLinesZ[s] - 11) - v.pos;
            if (distToStop > 0 && distToStop < 16) { shouldStop = true; break; }
          }
        }
        const targetSpd = shouldStop ? 0 : v.speed;
        v.curSpeed += (targetSpd - v.curSpeed) * Math.min(1, clampedDt * 4.2);
        v.pos += v.dir * v.curSpeed * clampedDt;
        if (v.pos > v.maxPos) v.pos = v.minPos;
        if (v.pos < v.minPos) v.pos = v.maxPos;

        if (v.axis === 'z') v.mesh.position.set(v.laneCoord, 0, v.pos);
        else v.mesh.position.set(v.pos, 0, v.laneCoord);

        v.brakeMat.color.setRGB(shouldStop ? 1.65 : 1.05, shouldStop ? 0.14 : 0.08, 0.08);
      }

      const policeFlash = Math.sin(timeSec * 9.0) > 0;
      policeBlueMat.color.setRGB(policeFlash ? 0.16 : 0.04, policeFlash ? 0.58 : 0.12, policeFlash ? 1.6 : 0.4);
      policeRedMat.color.setRGB(policeFlash ? 0.4 : 1.6, 0.08, 0.1);

      for (let i = 0; i < PED_COUNT; i++) {
        const p = peds[i];
        const sc = p.height / 1.72;
        let baseY = 0;
        let swing = 0;

        if (p.seated) {
          baseY = getTktsWalkHeight(p.x, p.z) - 0.72 * sc;
        } else if (p.speed > 0.01) {
          p.x += p.vx * clampedDt;
          p.z += p.vz * clampedDt;
          // Dynamic personal-space steering around the camera so nobody walks straight through the lens!
          const cdx = p.x - camPos.x;
          const cdz = p.z - camPos.z;
          const cDist = Math.hypot(cdx, cdz);
          if (cDist < 3.6 && cDist > 0.01) {
            const push = (3.6 - cDist) * 0.65;
            p.x += (cdx / cDist) * push;
            p.z += (cdz / cDist) * push;
          }
          const [ox, oz] = pushOutsideDuffy(p.x, p.z);
          if (ox !== p.x || oz !== p.z) {
            p.x = ox; p.z = oz;
            p.vx = -p.vx; p.vz = -p.vz;
            p.yaw = Math.atan2(p.vx, p.vz);
          }
          if (p.x < p.minX) { p.x = p.minX; p.vx = Math.abs(p.vx); p.yaw = Math.atan2(p.vx, p.vz); }
          else if (p.x > p.maxX) { p.x = p.maxX; p.vx = -Math.abs(p.vx); p.yaw = Math.atan2(p.vx, p.vz); }
          if (p.z < p.minZ) { p.z = p.minZ; p.vz = Math.abs(p.vz); p.yaw = Math.atan2(p.vx, p.vz); }
          else if (p.z > p.maxZ) { p.z = p.maxZ; p.vz = -Math.abs(p.vz); p.yaw = Math.atan2(p.vx, p.vz); }
          swing = Math.sin(timeSec * 5.2 * p.speed + p.phase) * 0.36;
        } else {
          // Subtle natural staggered standing stance on stationary crowd (NO stiff parallel robot feet!)
          swing = Math.sin(p.phase) * 0.09;
        }

        const bob = p.speed > 0.01 ? Math.abs(Math.sin(timeSec * 5.2 * p.speed + p.phase)) * 0.028 : 0;
        const cYaw = Math.cos(p.yaw);
        const sYaw = Math.sin(p.yaw);

        // 1. Sculpted Rounded-Shoulder Coat/Jacket Torso (LatheGeometry spanning y = 0.72..1.46 — ZERO flat plank shoulders!)
        dummy.position.set(p.x, baseY + (1.15 + bob) * sc, p.z);
        dummy.rotation.set(p.lean, p.yaw, 0);
        dummy.scale.set(sc, sc, sc);
        dummy.updateMatrix();
        torsoInst.setMatrixAt(i, dummy.matrix);

        // 2. Seamless Hip / Trouser-Waist Bridge (y = 0.72..0.94 — 100% eliminates waist gap!)
        dummy.position.set(p.x, baseY + (0.83 + bob) * sc, p.z);
        dummy.rotation.set(0, p.yaw, 0);
        dummy.scale.set(sc * 1.12, sc, sc * 0.72);
        dummy.updateMatrix();
        hipInst.setMatrixAt(i, dummy.matrix);

        // 3. Solid Neck + Oval Head + Hair/Beanie Cap (ZERO floating head gap!)
        dummy.scale.set(sc, sc, sc);
        dummy.position.set(p.x, baseY + (1.46 + bob) * sc, p.z);
        dummy.rotation.set(0, p.yaw, 0);
        dummy.updateMatrix();
        neckInst.setMatrixAt(i, dummy.matrix);

        dummy.scale.set(sc * 0.92, sc * 1.08, sc * 0.98);
        dummy.position.set(p.x, baseY + (1.58 + bob) * sc, p.z);
        dummy.rotation.set(0, p.yaw, 0);
        dummy.updateMatrix();
        headInst.setMatrixAt(i, dummy.matrix);

        dummy.scale.set(sc, sc, sc);
        dummy.position.set(p.x, baseY + (1.60 + bob) * sc, p.z);
        dummy.rotation.set(-0.18, p.yaw, 0);
        dummy.updateMatrix();
        hairInst.setMatrixAt(i, dummy.matrix);

        // 4. Connected Rounded Left Sleeve (tucked naturally inside shoulder socket)
        dummy.position.set(p.x - cYaw * 0.175 * sc, baseY + (1.12 + bob) * sc, p.z + sYaw * 0.175 * sc);
        dummy.rotation.set(-swing * 0.68, p.yaw, 0.08);
        dummy.updateMatrix();
        armLInst.setMatrixAt(i, dummy.matrix);

        // 5. Connected Right Sleeve + Natural Relaxed Chest-Level Phone Hold (YXZ Euler = ZERO sideways T-pose!)
        if (p.holdingPhone) {
          dummy.position.set(p.x + cYaw * 0.16 * sc + sYaw * 0.12 * sc, baseY + (1.19 + bob) * sc, p.z - sYaw * 0.16 * sc + cYaw * 0.12 * sc);
          dummy.rotation.set(-0.62, p.yaw, -0.06);
          dummy.updateMatrix();
          armRInst.setMatrixAt(i, dummy.matrix);
          dummy.position.set(p.x + cYaw * 0.13 * sc + sYaw * 0.28 * sc, baseY + (1.33 + bob) * sc, p.z - sYaw * 0.13 * sc + cYaw * 0.28 * sc);
          dummy.rotation.set(-0.28, p.yaw, 0);
          dummy.updateMatrix();
          phoneInst.setMatrixAt(i, dummy.matrix);
        } else {
          dummy.position.set(p.x + cYaw * 0.175 * sc, baseY + (1.12 + bob) * sc, p.z - sYaw * 0.175 * sc);
          dummy.rotation.set(swing * 0.68, p.yaw, -0.08);
          dummy.updateMatrix();
          armRInst.setMatrixAt(i, dummy.matrix);
          dummy.scale.set(0, 0, 0);
          dummy.updateMatrix();
          phoneInst.setMatrixAt(i, dummy.matrix);
          dummy.scale.set(sc, sc, sc);
        }

        // 6. Optional Snug Rounded Commuter Backpack (~30% of crowd)
        if (!p.seated && i % 3 === 0) {
          dummy.position.set(p.x - sYaw * 0.115 * sc, baseY + (1.15 + bob) * sc, p.z - cYaw * 0.115 * sc);
          dummy.rotation.set(0.06, p.yaw, 0);
          dummy.scale.set(sc * 1.15, sc, sc * 0.68);
          dummy.updateMatrix();
          bagInst.setMatrixAt(i, dummy.matrix);
          dummy.scale.set(sc, sc, sc);
        } else {
          dummy.scale.set(0, 0, 0);
          dummy.updateMatrix();
          bagInst.setMatrixAt(i, dummy.matrix);
          dummy.scale.set(sc, sc, sc);
        }

        // 7. Seamless Tapered Trousers & Sleek Boots (Seated TKTS thighs neatly tucked — ZERO black planks sticking out!)
        if (p.seated) {
          dummy.position.set(p.x - cYaw * 0.085 * sc + sYaw * 0.14 * sc, baseY + 0.80 * sc, p.z + sYaw * 0.085 * sc + cYaw * 0.14 * sc);
          dummy.rotation.set(-1.52, p.yaw, 0);
          dummy.scale.set(sc * 0.92, sc * 0.42, sc * 0.92);
          dummy.updateMatrix();
          legLInst.setMatrixAt(i, dummy.matrix);

          dummy.position.set(p.x + cYaw * 0.085 * sc + sYaw * 0.14 * sc, baseY + 0.80 * sc, p.z - sYaw * 0.085 * sc + cYaw * 0.14 * sc);
          dummy.updateMatrix();
          legRInst.setMatrixAt(i, dummy.matrix);

          dummy.scale.set(0, 0, 0);
          dummy.updateMatrix();
          shoeLInst.setMatrixAt(i, dummy.matrix);
          shoeRInst.setMatrixAt(i, dummy.matrix);
          pedShadowInst.setMatrixAt(i, dummy.matrix);
        } else {
          const strideL = Math.sin(swing) * 0.22 * sc;
          const strideR = Math.sin(-swing) * 0.22 * sc;
          dummy.scale.set(sc, sc, sc);
          dummy.position.set(p.x - cYaw * 0.088 * sc, baseY + 0.44 * sc, p.z + sYaw * 0.088 * sc);
          dummy.rotation.set(swing, p.yaw, 0);
          dummy.updateMatrix();
          legLInst.setMatrixAt(i, dummy.matrix);

          dummy.position.set(p.x + cYaw * 0.088 * sc, baseY + 0.44 * sc, p.z - sYaw * 0.088 * sc);
          dummy.rotation.set(-swing, p.yaw, 0);
          dummy.updateMatrix();
          legRInst.setMatrixAt(i, dummy.matrix);

          dummy.position.set(p.x - cYaw * 0.088 * sc + sYaw * (0.03 * sc + strideL), baseY + 0.03 * sc, p.z + sYaw * 0.088 * sc + cYaw * (0.03 * sc + strideL));
          dummy.rotation.set(0, p.yaw, 0);
          dummy.updateMatrix();
          shoeLInst.setMatrixAt(i, dummy.matrix);

          dummy.position.set(p.x + cYaw * 0.088 * sc + sYaw * (0.03 * sc + strideR), baseY + 0.03 * sc, p.z - sYaw * 0.088 * sc + cYaw * (0.03 * sc + strideR));
          dummy.updateMatrix();
          shoeRInst.setMatrixAt(i, dummy.matrix);

          dummy.position.set(p.x, 0.015, p.z);
          dummy.rotation.set(-Math.PI / 2, 0, 0);
          dummy.updateMatrix();
          pedShadowInst.setMatrixAt(i, dummy.matrix);
        }
      }
      headInst.instanceMatrix.needsUpdate = true;
      neckInst.instanceMatrix.needsUpdate = true;
      hairInst.instanceMatrix.needsUpdate = true;
      torsoInst.instanceMatrix.needsUpdate = true;
      hipInst.instanceMatrix.needsUpdate = true;
      armLInst.instanceMatrix.needsUpdate = true;
      armRInst.instanceMatrix.needsUpdate = true;
      legLInst.instanceMatrix.needsUpdate = true;
      legRInst.instanceMatrix.needsUpdate = true;
      shoeLInst.instanceMatrix.needsUpdate = true;
      shoeRInst.instanceMatrix.needsUpdate = true;
      bagInst.instanceMatrix.needsUpdate = true;
      phoneInst.instanceMatrix.needsUpdate = true;
      pedShadowInst.instanceMatrix.needsUpdate = true;

      // 2,400 Crisp Neon-Backlit Translucent Silver Rain Streaks (Clearly Visible Downpour!)
      rainInst.visible = rain > 0.05;
      if (rainInst.visible) {
        rainMat.opacity = 0.44 + 0.22 * rain * (0.55 + 0.45 * night);
        for (let i = 0; i < RAIN_N; i++) {
          const maxH = i < 850 ? 14 : 25;
          let ry = rainSeeds[i * 3 + 1] - clampedDt * 23.0;
          if (ry < 0) ry += maxH;
          rainSeeds[i * 3 + 1] = ry;
          const rx = camPos.x + rainSeeds[i * 3];
          const rz = camPos.z + rainSeeds[i * 3 + 2];
          dummy.position.set(rx, ry, rz);
          dummy.rotation.set(0, Math.atan2(camPos.x - rx, camPos.z - rz), 0.14);
          dummy.scale.set(1, 0.85 + (i % 4) * 0.24, 1);
          dummy.updateMatrix();
          rainInst.setMatrixAt(i, dummy.matrix);
        }
        rainInst.instanceMatrix.needsUpdate = true;
      }

      snowMesh.visible = snow > 0.05;
      if (snowMesh.visible) {
        snowMat.opacity = 0.45 + 0.4 * snow;
        for (let i = 0; i < SNOW_N; i++) {
          let sy = snowPos[i * 3 + 1] - clampedDt * (1.8 + (i % 5) * 0.22);
          if (sy < 0) sy += 26;
          const sx = ((snowPos[i * 3] - camPos.x + Math.sin(timeSec + i) * clampedDt * 0.9 + 72) % 48) - 24 + camPos.x;
          const sz = ((snowPos[i * 3 + 2] - camPos.z + Math.cos(timeSec * 0.8 + i) * clampedDt * 0.7 + 72) % 48) - 24 + camPos.z;
          snowPos[i * 3] = sx; snowPos[i * 3 + 1] = sy; snowPos[i * 3 + 2] = sz;
        }
        snowGeom.attributes.position.needsUpdate = true;
      }
    },
    dispose: () => {
      for (const d of disposables) d.dispose();
    },
  };
}

export class TimesSquareAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private muted = false;
  private stepAcc = 0;
  private nextHonk = 6;

  public start(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = this.muted ? 0 : 0.30;
    master.connect(ctx.destination);
    this.master = master;

    const len = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + w * 0.029;
      b1 = 0.985 * b1 + w * 0.032;
      b2 = 0.950 * b2 + w * 0.048;
      data[i] = (b0 + b1 + b2 + w * 0.08) * 0.35;
    }

    const citySrc = ctx.createBufferSource();
    citySrc.buffer = buf; citySrc.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 340;
    const cityGain = ctx.createGain(); cityGain.gain.value = 0.55;
    citySrc.connect(lp).connect(cityGain).connect(master);
    citySrc.start();

    const rainSrc = ctx.createBufferSource();
    rainSrc.buffer = buf; rainSrc.loop = true;
    const hp = ctx.createBiquadFilter(); hp.type = 'bandpass'; hp.frequency.value = 2600; hp.Q.value = 0.7;
    const rainGain = ctx.createGain(); rainGain.gain.value = 0;
    rainSrc.connect(hp).connect(rainGain).connect(master);
    rainSrc.start();
    this.rainGain = rainGain;
  }

  public setMuted(m: boolean): void {
    this.muted = m;
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.30, this.ctx.currentTime, 0.08);
  }

  public update(dt: number, moveSpeed: number, rain: number, wet: number): void {
    if (!this.ctx || !this.master || this.muted) return;
    const now = this.ctx.currentTime;
    if (this.rainGain) this.rainGain.gain.setTargetAtTime(rain * 0.45, now, 0.25);
    if (moveSpeed > 0.4) {
      this.stepAcc += dt * (moveSpeed > 5.5 ? 2.8 : 1.9);
      if (this.stepAcc >= 1) { this.stepAcc -= 1; this.playFootstep(wet > 0.5); }
    } else {
      this.stepAcc = 0.6;
    }
    this.nextHonk -= dt;
    if (this.nextHonk <= 0) {
      this.nextHonk = 9 + Math.random() * 14;
      this.playDistantCabHorn();
    }
  }

  private playFootstep(wet: boolean): void {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(wet ? 210 + Math.random() * 50 : 120 + Math.random() * 25, now);
    osc.frequency.exponentialRampToValueAtTime(48, now + 0.065);
    g.gain.setValueAtTime(0.11, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
    osc.connect(g).connect(this.master);
    osc.start(now); osc.stop(now + 0.08);
  }

  private playDistantCabHorn(): void {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    const dur = 0.22 + Math.random() * 0.18;
    const lp = ctxFilter(this.ctx);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.045, now + 0.03);
    g.gain.setValueAtTime(0.045, now + dur - 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    lp.connect(g).connect(this.master);
    for (const freq of [415, 518]) {
      const o = this.ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(freq, now);
      o.connect(lp); o.start(now); o.stop(now + dur + 0.02);
    }
  }

  public dispose(): void {
    if (this.ctx) { void this.ctx.close(); this.ctx = null; }
  }
}

function ctxFilter(ctx: AudioContext): BiquadFilterNode {
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 950;
  return lp;
}
