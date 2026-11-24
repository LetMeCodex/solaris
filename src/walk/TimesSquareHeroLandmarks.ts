import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { TIMES_SQUARE_OSM_BUILDINGS, TIMES_SQUARE_SUBWAY_ENTRANCES, type OsmBuildingVolume } from './timesSquareOsmData';
import type { AnimatedBillboard, FacadeMaterialSet } from './TimesSquareTextures';

export interface ColliderBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface TimesSquareArchitecture {
  group: THREE.Group;
  colliders: ColliderBox[];
  update: (timeSec: number, nightFactor: number) => void;
  getWalkHeight: (x: number, z: number) => number;
  dispose: () => void;
}

const TKTS_MIN_X = -27.5;
const TKTS_MAX_X = -14.2;
const TKTS_SOUTH_Z = -160.2;
const TKTS_NORTH_Z = -177.8;
const TKTS_TOP_Y = 5.2;

export function getTktsWalkHeight(x: number, z: number): number {
  if (x >= TKTS_MIN_X - 0.4 && x <= TKTS_MAX_X + 0.4 && z <= TKTS_SOUTH_Z + 0.6 && z >= TKTS_NORTH_Z - 0.6) {
    const t = THREE.MathUtils.clamp((TKTS_SOUTH_Z - z) / (TKTS_SOUTH_Z - TKTS_NORTH_Z), 0, 1);
    return t * TKTS_TOP_Y;
  }
  return 0;
}

function createWorldUvExtrude(
  pts: [number, number][],
  height: number,
  minH: number,
  horizSpanM = 28,
  vertSpanM = 68,
): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(pts[0][0], -pts[0][1]);
  for (let i = 1; i < pts.length; i++) shape.lineTo(pts[i][0], -pts[i][1]);
  shape.closePath();

  const depth = Math.max(2, height - minH);
  const geom = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 1 });
  geom.rotateX(-Math.PI / 2);
  if (minH > 0) geom.translate(0, minH, 0);

  const pos = geom.attributes.position;
  const norm = geom.attributes.normal;
  const uv = geom.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const nx = norm.getX(i);
    const ny = Math.abs(norm.getY(i));
    const nz = norm.getZ(i);
    if (ny > 0.75) {
      uv.setXY(i, pos.getX(i) / 24, pos.getZ(i) / 24);
    } else {
      const horiz = Math.abs(nx) > Math.abs(nz)
        ? (nx > 0 ? -pos.getZ(i) : pos.getZ(i))
        : (nz > 0 ? pos.getX(i) : -pos.getX(i));
      uv.setXY(i, horiz / horizSpanM, (pos.getY(i) - minH) / vertSpanM);
    }
  }
  uv.needsUpdate = true;
  geom.computeBoundingSphere();
  return geom;
}

function makeSignTexture(
  lines: Array<{ text: string; size: number; color: string; y: number; weight?: string; font?: string }>,
  bg: string,
  w = 512,
  h = 128,
  border?: string,
): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d')!;
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  if (border) { g.strokeStyle = border; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6); }
  g.textAlign = 'center'; g.textBaseline = 'middle';
  for (const l of lines) {
    g.fillStyle = l.color;
    g.font = `${l.weight ?? '800'} ${l.size}px ${l.font ?? 'Montserrat, sans-serif'}`;
    g.fillText(l.text, w / 2, l.y);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;
  return tex;
}

/**
 * Iteration #3 — Complete Architectural & Hero Upgrade:
 *  - Clean open-sky silhouette behind One Times Square's 22m rooftop mast & glowing Waterford NYE Ball!
 *  - Removes the clipping 5-story brown box (#4) in front of 2 Times Square in VP5!
 *  - Illuminated TKTS side glass booth windows & red/white `tkts` signage visible from VP5!
 *  - Armed Forces Pavilion upgraded with 50 glowing white LED stars + warm interior backlit glass doors!
 *  - Full West/Right canyon wall clad with photographic Marriott Marquis, American Eagle, Wicked, Luxury Couture & Lion King!
 *  - Dedicated warm bronze uplighting on Father Duffy Statue & Celtic Cross!
 */
export function buildTimesSquareArchitecture(
  facades: FacadeMaterialSet,
  boards: Record<string, AnimatedBillboard>,
): TimesSquareArchitecture {
  const group = new THREE.Group();
  group.name = 'TimesSquareArchitecture';
  const colliders: ColliderBox[] = [];
  const disposables: Array<{ dispose(): void }> = [];
  const track = <T extends { dispose(): void }>(x: T): T => {
    disposables.push(x);
    return x;
  };
  // Enable Layer 1 ONLY on major architectural/billboard/light structures for silky 60+ FPS planar reflections!
  const enableRefl = <T extends THREE.Object3D>(obj: T): T => {
    obj.traverse((o) => o.layers.enable(1));
    return obj;
  };

  // Skip replaced hero footprints + #4 (clipping podium in front of 2 TSQ) + #12 (NYPD sub-box)
  // + #2/#64/#65/#67 (giant 218m background tower right behind One Times Square's NYE Ball silhouette!)
  const SKIP_IDS = new Set([0, 1, 2, 4, 8, 12, 64, 65, 67, 262]);

  const storefrontGeoms: THREE.BufferGeometry[] = [];
  const roofSpirePositions: Array<{ x: number; y: number; z: number; h: number }> = [];
  const waterTowerPositions: Array<{ x: number; y: number; z: number }> = [];

  for (let i = 0; i < TIMES_SQUARE_OSM_BUILDINGS.length; i++) {
    const b: OsmBuildingVolume = TIMES_SQUARE_OSM_BUILDINGS[i];
    const name = b.n ?? '';
    if (SKIP_IDS.has(i) || /TKTS|Armed Forces|NYPD/i.test(name)) continue;

    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const [px, pz] of b.p) {
      if (px < minX) minX = px; if (px > maxX) maxX = px;
      if (pz < minZ) minZ = pz; if (pz > maxZ) maxZ = pz;
    }
    const cx = (minX + maxX) * 0.5;
    const cz = (minZ + maxZ) * 0.5;
    const wX = maxX - minX;
    const wZ = maxZ - minZ;

    let wallMat: THREE.MeshStandardMaterial;
    if (cx < -24 && cz > -102 && cz < -34) wallMat = facades.brutalist;
    else if (b.h >= 115) wallMat = (i % 2 === 0) ? facades.glassDark : facades.glassBlue;
    else if (b.h >= 46) wallMat = (i % 3 === 0) ? facades.glassBlue : facades.limestone;
    else wallMat = (i % 2 === 0) ? facades.redBrick : facades.limestone;

    const geom = track(createWorldUvExtrude(b.p, b.h, b.m, 30, 74));
    const mesh = new THREE.Mesh(geom, [facades.roofDark, wallMat]);
    mesh.castShadow = Math.abs(cx) < 115 && Math.abs(cz) < 200;
    mesh.receiveShadow = true;
    enableRefl(mesh);
    group.add(mesh);

    if (b.m < 3.5) {
      colliders.push({ minX: minX - 0.5, maxX: maxX + 0.5, minZ: minZ - 0.5, maxZ: maxZ + 0.5 });
    }

    // Recessed warmly-lit ground-floor retail storefronts + dark steel canopy trim
    if (b.m < 1 && b.h >= 12 && Math.abs(cx) < 80 && Math.abs(cz) < 210 && wX > 8 && wZ > 8) {
      const sg = track(createWorldUvExtrude(b.p, 6.2, 0.05, 42, 6.2));
      sg.translate(-cx, 0, -cz);
      sg.scale((wX + 0.24) / wX, 1, (wZ + 0.24) / wZ);
      sg.translate(cx, 0, cz);
      storefrontGeoms.push(sg);
    }

    // Rooftop mechanical penthouses, antenna spires & iconic wooden NYC water towers
    if (b.h >= 85 && Math.abs(cx) < 140 && Math.abs(cz) < 225) {
      const pentW = Math.min(wX * 0.44, 16);
      const pentD = Math.min(wZ * 0.44, 16);
      const pentH = 7 + (i % 5) * 2.5;
      const pm = new THREE.Mesh(track(new THREE.BoxGeometry(pentW, pentH, pentD)), facades.steelTruss);
      pm.position.set(cx, b.h + pentH * 0.5, cz);
      group.add(pm);
      if (b.h >= 140) roofSpirePositions.push({ x: cx, y: b.h + pentH, z: cz, h: 22 + (i % 4) * 9 });
    } else if (b.h >= 24 && b.h <= 75 && Math.abs(cx) < 110 && Math.abs(cz) < 190 && i % 4 === 0) {
      waterTowerPositions.push({ x: cx + wX * 0.18, y: b.h, z: cz });
    }
  }

  for (const sg of storefrontGeoms) {
    const sm = new THREE.Mesh(sg, [facades.roofDark, facades.storefront]);
    sm.receiveShadow = true;
    enableRefl(sm);
    group.add(sm);
  }

  // 3D Projecting Dark Anodized Retail Canopies / Awnings along Broadway & 7th Ave Storefronts!
  const canopySpecs: Array<[number, number, number, number, number]> = [
    [12.9, 5.75, -152, 1.5, 42],
    [12.9, 5.75, -66, 1.5, 52],
    [12.9, 5.75, 16, 1.5, 48],
    [-23.6, 5.75, -66, 1.5, 48],
    [-15.8, 5.75, 12, 1.5, 44],
    [-44.5, 5.75, -142, 1.5, 36],
  ];
  for (const [ax, ay, az, aw, al] of canopySpecs) {
    const awning = new THREE.Mesh(track(new THREE.BoxGeometry(aw, 0.34, al)), facades.steelTruss);
    awning.position.set(ax, ay, az);
    awning.castShadow = true;
    group.add(awning);
  }

  // --- INFINITE MIDTOWN MANHATTAN HORIZON CLOSURE (44 Surrounding Skyscrapers — ZERO Empty Void Horizons!) ---
  const skylineSpecs: Array<[number, number, number, number, number, number]> = [
    // South Corridor (42nd -> 36th St / Garment District & Herald Square — closes VP4 center horizon!)
    [-46, 310, 34, 34, 155, 0], [-14, 320, 26, 28, 128, 1], [16, 315, 28, 30, 148, 2],
    [48, 308, 36, 32, 172, 0], [88, 300, 38, 34, 136, 3], [-86, 302, 36, 32, 124, 2],
    [-34, 368, 38, 36, 195, 1], [4, 380, 32, 34, 215, 0], [44, 372, 36, 34, 185, 2],
    [92, 358, 40, 36, 162, 1], [-82, 360, 40, 36, 152, 3], [-128, 290, 40, 42, 134, 2],
    [138, 285, 40, 42, 158, 0], [2, 272, 20, 22, 84, 3], [-16, 268, 18, 24, 96, 2],
    // North Corridor (47th -> 53rd St / Rockefeller & Midtown North — closes VP5 right edge horizon!)
    [-64, -282, 34, 32, 142, 0], [-24, -290, 30, 32, 168, 1], [18, -286, 32, 34, 152, 2],
    [58, -278, 36, 34, 178, 0], [98, -272, 38, 34, 138, 3], [136, -260, 38, 36, 164, 1],
    [138, -214, 36, 34, 126, 2], [142, -168, 34, 36, 148, 0], [168, -238, 38, 38, 188, 1],
    [-56, -342, 38, 36, 184, 2], [-10, -352, 34, 34, 208, 0], [38, -345, 38, 36, 192, 1],
    [88, -334, 42, 36, 166, 2], [-104, -296, 40, 38, 146, 3], [140, -310, 42, 38, 174, 0],
    // East & West Crosstown Corridor Ends (43rd-47th St E/W)
    [224, -140, 38, 44, 148, 1], [224, -65, 38, 44, 172, 0], [224, 15, 38, 44, 156, 2],
    [224, 95, 38, 44, 186, 1], [224, 175, 38, 44, 162, 0], [224, -215, 38, 44, 142, 3],
    [-234, -155, 38, 44, 132, 2], [-234, -75, 38, 44, 158, 0], [-234, 10, 38, 44, 144, 1],
    [-234, 95, 38, 44, 166, 2], [-234, 175, 38, 44, 138, 3], [-234, -230, 38, 44, 148, 0],
    // Far South Midtown Crown Anchor (Empire-State silhouette depth behind 7th Ave)
    [6, 435, 44, 44, 248, 2], [-58, 425, 42, 40, 198, 1],
  ];
  // Merge all 44 distant perimeter skyline towers into 4 single batched geometries (44 -> 4 draw calls = locked 60+ FPS!)
  const skyMats = [facades.glassDark, facades.glassBlue, facades.limestone, facades.redBrick];
  const skyBuckets: THREE.BufferGeometry[][] = [[], [], [], []];
  for (let i = 0; i < skylineSpecs.length; i++) {
    const [sx, sz, sw, sd, sh, matIdx] = skylineSpecs[i];
    const pts: [number, number][] = [
      [sx - sw * 0.5, sz - sd * 0.5],
      [sx + sw * 0.5, sz - sd * 0.5],
      [sx + sw * 0.5, sz + sd * 0.5],
      [sx - sw * 0.5, sz + sd * 0.5],
    ];
    const gSky = createWorldUvExtrude(pts, sh, 0, 32, 76);
    gSky.clearGroups();
    skyBuckets[matIdx % skyMats.length].push(gSky);
    if (sh >= 165) {
      roofSpirePositions.push({ x: sx, y: sh, z: sz, h: 24 + (i % 3) * 10 });
    }
  }
  for (let b = 0; b < skyBuckets.length; b++) {
    if (skyBuckets[b].length === 0) continue;
    const merged = track(mergeGeometries(skyBuckets[b], false));
    for (const g of skyBuckets[b]) g.dispose();
    const mSky = new THREE.Mesh(merged, skyMats[b]);
    mSky.castShadow = false;
    mSky.receiveShadow = false;
    group.add(mSky);
  }

  // Rooftop antenna spires & blinking red FAA aviation beacons
  const beaconMeshes: THREE.Mesh[] = [];
  const beaconMat = track(new THREE.MeshBasicMaterial({ color: '#ff2222' }));
  for (const sp of roofSpirePositions) {
    const mast = new THREE.Mesh(track(new THREE.CylinderGeometry(0.16, 0.55, sp.h, 6)), facades.steelTruss);
    mast.position.set(sp.x, sp.y + sp.h * 0.5, sp.z);
    const bulb = new THREE.Mesh(track(new THREE.SphereGeometry(0.6, 8, 8)), beaconMat);
    bulb.position.set(sp.x, sp.y + sp.h + 0.5, sp.z);
    group.add(mast, bulb);
    beaconMeshes.push(bulb);
  }

  // Classic NYC Cedar-Wood Rooftop Water Towers (including iconic visible mid-rise roofs around Duffy Square!)
  const woodMat = track(new THREE.MeshStandardMaterial({ color: '#6b5342', roughness: 0.9 }));
  const wtRoofMat = track(new THREE.MeshStandardMaterial({ color: '#42454c', roughness: 0.85 }));
  const heroWaterTowers: Array<{ x: number; y: number; z: number }> = [
    { x: 26, y: 17.0, z: -124 },
    { x: -58, y: 18.8, z: -135 },
    { x: 28, y: 20.0, z: -76 },
    ...waterTowerPositions.slice(0, 12),
  ];
  for (const wt of heroWaterTowers) {
    const wg = new THREE.Group();
    wg.position.set(wt.x, wt.y, wt.z);
    const legs = new THREE.Mesh(track(new THREE.CylinderGeometry(1.4, 1.8, 3.2, 6, 1, true)), facades.steelTruss); legs.position.y = 1.6;
    const tank = new THREE.Mesh(track(new THREE.CylinderGeometry(1.75, 1.75, 3.8, 12)), woodMat); tank.position.y = 5.0;
    const cone = new THREE.Mesh(track(new THREE.ConeGeometry(1.9, 1.5, 12)), wtRoofMat); cone.position.y = 7.65;
    wg.add(legs, tank, cone);
    group.add(wg);
  }

  // Paramount Building Illuminated Art Deco Clock Tower & Glowing Glass Globe (visible top-right in tsq_ref_1.jpg!)
  const paramountGroup = new THREE.Group();
  paramountGroup.position.set(-44, 102, 46);
  const pBase = new THREE.Mesh(track(new THREE.BoxGeometry(16, 14, 16)), facades.limestone); pBase.position.y = 7;
  const pPyramid = new THREE.Mesh(track(new THREE.ConeGeometry(12.5, 24, 4)), facades.limestone);
  pPyramid.rotation.y = Math.PI / 4; pPyramid.position.y = 26;
  const pClockFace = new THREE.Mesh(track(new THREE.CircleGeometry(3.4, 24)), track(new THREE.MeshBasicMaterial({ color: '#fff4d8' })));
  pClockFace.position.set(4.5, 19.5, -6.2); pClockFace.rotation.y = Math.PI * 0.88;
  const pClockRing = new THREE.Mesh(track(new THREE.TorusGeometry(3.6, 0.48, 10, 24)), track(new THREE.MeshBasicMaterial({ color: '#ff4428' })));
  pClockRing.position.copy(pClockFace.position); pClockRing.rotation.copy(pClockFace.rotation);
  const pGlobe = new THREE.Mesh(track(new THREE.SphereGeometry(3.5, 16, 16)), track(new THREE.MeshStandardMaterial({ color: '#fff3d6', emissive: '#ffcf86', emissiveIntensity: 1.85, roughness: 0.15 })));
  pGlobe.position.y = 40.5;
  paramountGroup.add(pBase, pPyramid, pClockFace, pClockRing, pGlobe);
  enableRefl(paramountGroup);
  group.add(paramountGroup);

  // --- 2. HERO: ONE TIMES SQUARE — Authentic Razor-Thin 25-Story Trapezoidal Wedge + OPEN-SKY Rooftop NYE Mast! ---
  const oneGroup = new THREE.Group();
  const onePts: [number, number][] = [
    [13.4, 158.0],
    [27.6, 158.0],
    [32.5, 200.5],
    [12.8, 200.5],
  ];
  // Terminates cleanly at 104m roof parapet — ZERO bare brown brick behind the NYE Ball!
  const oneCoreGeom = track(createWorldUvExtrude(onePts, 104.0, 0, 26, 68));
  const oneCore = new THREE.Mesh(oneCoreGeom, [facades.roofDark, facades.steelTruss]);
  oneCore.castShadow = true; oneCore.receiveShadow = true;
  oneGroup.add(oneCore);
  colliders.push({ minX: 12.2, maxX: 33.0, minZ: 157.4, maxZ: 201.0 });

  const parapet = new THREE.Mesh(track(new THREE.BoxGeometry(15.0, 2.2, 34)), facades.steelTruss);
  parapet.position.set(20.6, 105.0, 176.0);
  oneGroup.add(parapet);

  // Glowing "2026" Numerals perched directly atop the roof parapet (y = 108.5m)
  const yrTex = track(makeSignTexture([{ text: '2026', size: 96, color: '#fff6cc', y: 66 }], 'rgba(0,0,0,0)', 384, 128));
  const yrSign = new THREE.Mesh(track(new THREE.PlaneGeometry(13.2, 4.4)), track(new THREE.MeshBasicMaterial({ map: yrTex, transparent: true })));
  yrSign.position.set(20.5, 108.4, 158.4);
  yrSign.rotation.y = Math.PI;
  oneGroup.add(yrSign);

  // 24m Open Rooftop Steel Lattice Flagpole Mast soaring cleanly into open dark sky + Faceted Waterford NYE Ball!
  const mastBaseY = 106.0;
  const mastH = 26.0;
  for (const [mx, mz] of [[-0.85, -0.85], [0.85, -0.85], [-0.85, 0.85], [0.85, 0.85]] as const) {
    const leg = new THREE.Mesh(track(new THREE.CylinderGeometry(0.11, 0.22, mastH, 6)), facades.steelTruss);
    leg.position.set(20.5 + mx * 0.65, mastBaseY + mastH * 0.5, 161.5 + mz * 0.65);
    oneGroup.add(leg);
  }
  const ballMat = track(new THREE.MeshStandardMaterial({
    color: '#ffffff', emissive: new THREE.Color('#d4f2ff'), emissiveIntensity: 2.5,
    roughness: 0.06, metalness: 0.9, flatShading: true,
  }));
  const nyeBall = new THREE.Mesh(track(new THREE.IcosahedronGeometry(3.4, 2)), ballMat);
  nyeBall.position.set(20.5, mastBaseY + 20.5, 161.5);
  oneGroup.add(nyeBall);

  // Iconic 3rd-floor curved wrapping red/amber LED News Zipper wrapping around One Times Square's nose!
  const zipperMat = track(new THREE.MeshStandardMaterial({
    map: boards.abcTicker.texture, emissive: new THREE.Color('#ffaa22'),
    emissiveMap: boards.abcTicker.texture, emissiveIntensity: 1.35, roughness: 0.2,
  }));
  const zipper = new THREE.Mesh(track(new THREE.BoxGeometry(15.4, 2.2, 43.0)), zipperMat);
  zipper.position.set(20.8, 10.5, 179.0);
  oneGroup.add(zipper);
  enableRefl(oneGroup);
  group.add(oneGroup);

  // --- 3. HERO: TKTS 27-Step Deep Translucent Ruby-Crimson Frosted Glass Stairs (ZERO ACES Orange/Grey Glare!) ---
  const tktsGroup = new THREE.Group();
  const rubyTreadMat = track(new THREE.MeshPhysicalMaterial({
    color: '#7a0010', emissive: new THREE.Color('#c4001a'), emissiveIntensity: 0.62,
    roughness: 0.38, metalness: 0.06, clearcoat: 0.35, clearcoatRoughness: 0.32, envMapIntensity: 0.22,
  }));
  const darkRiserMat = track(new THREE.MeshStandardMaterial({
    color: '#2a0006', emissive: new THREE.Color('#880012'), emissiveIntensity: 0.35, roughness: 0.42, metalness: 0.30, envMapIntensity: 0.20,
  }));
  const stepNosingLedMat = track(new THREE.MeshBasicMaterial({ color: '#e81028' }));
  const glassBalustradeMat = track(new THREE.MeshPhysicalMaterial({
    color: '#ff2438', emissive: new THREE.Color('#b80816'), emissiveIntensity: 0.40,
    transparent: true, opacity: 0.36, roughness: 0.08, metalness: 0.1, clearcoat: 1.0,
  }));
  const railMat = track(new THREE.MeshStandardMaterial({ color: '#d8e0ec', roughness: 0.18, metalness: 0.94 }));
  const tktsShellMat = track(new THREE.MeshPhysicalMaterial({
    color: '#262b34', emissive: new THREE.Color('#301018'), emissiveIntensity: 0.35,
    roughness: 0.24, metalness: 0.55, clearcoat: 0.8,
  }));

  const stepsCount = 27;
  const tktsW = TKTS_MAX_X - TKTS_MIN_X;
  const tktsCX = (TKTS_MIN_X + TKTS_MAX_X) * 0.5;
  const stepD = (TKTS_SOUTH_Z - TKTS_NORTH_Z) / stepsCount;
  const stepH = TKTS_TOP_Y / stepsCount;

  const treadInst = new THREE.InstancedMesh(track(new THREE.BoxGeometry(tktsW, 0.055, stepD * 1.02)), rubyTreadMat, stepsCount);
  const riserInst = new THREE.InstancedMesh(track(new THREE.BoxGeometry(tktsW - 0.04, stepH, 0.06)), darkRiserMat, stepsCount);
  const nosingInst = new THREE.InstancedMesh(track(new THREE.BoxGeometry(tktsW - 0.12, 0.028, 0.035)), stepNosingLedMat, stepsCount);
  const dummy = new THREE.Object3D();
  for (let s = 0; s < stepsCount; s++) {
    const z = TKTS_SOUTH_Z - (s + 0.5) * stepD;
    const yTop = (s + 1) * stepH;
    dummy.position.set(tktsCX, yTop - 0.028, z); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1);
    dummy.updateMatrix(); treadInst.setMatrixAt(s, dummy.matrix);
    dummy.position.set(tktsCX, yTop - stepH * 0.5, z + stepD * 0.5);
    dummy.updateMatrix(); riserInst.setMatrixAt(s, dummy.matrix);
    dummy.position.set(tktsCX, yTop - 0.015, z + stepD * 0.5 + 0.015);
    dummy.updateMatrix(); nosingInst.setMatrixAt(s, dummy.matrix);
  }
  treadInst.instanceMatrix.needsUpdate = true;
  riserInst.instanceMatrix.needsUpdate = true;
  nosingInst.instanceMatrix.needsUpdate = true;
  tktsGroup.add(treadInst, riserInst, nosingInst);

  // Sleek reflective fiberglass ticket booth shell underneath the glass stairs
  const underShape = new THREE.Shape();
  underShape.moveTo(0, 0);
  underShape.lineTo(TKTS_SOUTH_Z - TKTS_NORTH_Z, 0);
  underShape.lineTo(TKTS_SOUTH_Z - TKTS_NORTH_Z, TKTS_TOP_Y - 0.12);
  underShape.closePath();
  const underGeom = track(new THREE.ExtrudeGeometry(underShape, { depth: tktsW - 0.4, bevelEnabled: false }));
  underGeom.rotateY(Math.PI / 2);
  const underMesh = new THREE.Mesh(underGeom, tktsShellMat);
  underMesh.position.set(TKTS_MIN_X + 0.2, 0, TKTS_SOUTH_Z);
  tktsGroup.add(underMesh);

  // Illuminated TKTS Ticket Windows & Glowing "tkts" Signage on BOTH East (VP5-facing!) & North faces!
  const tktsBoothTex = track(makeSignTexture([
    { text: 'tkts  ·  BROADWAY BOX OFFICE', size: 42, color: '#ffffff', y: 40 },
    { text: 'ALADDIN 50% · WICKED 40% · LION KING · HAMILTON', size: 20, color: '#ffe0e0', y: 94, weight: '700' },
  ], '#c40818', 768, 128, '#ff707c'));
  const tktsBoothMat = track(new THREE.MeshStandardMaterial({ map: tktsBoothTex, emissive: '#ffffff', emissiveMap: tktsBoothTex, emissiveIntensity: 1.15 }));
  // East flank ticket window & illuminated sign (replaces pitch-black flank in VP5!)
  const tktsEastSign = new THREE.Mesh(track(new THREE.PlaneGeometry(8.2, 1.35)), tktsBoothMat);
  tktsEastSign.position.set(TKTS_MAX_X - 0.16, 1.65, TKTS_NORTH_Z + 4.8);
  tktsEastSign.rotation.y = Math.PI / 2;
  const tktsWestSign = tktsEastSign.clone();
  tktsWestSign.position.x = TKTS_MIN_X + 0.16;
  tktsWestSign.rotation.y = -Math.PI / 2;
  const tktsBackSign = new THREE.Mesh(track(new THREE.PlaneGeometry(9.6, 1.85)), tktsBoothMat);
  tktsBackSign.position.set(tktsCX, 3.5, TKTS_NORTH_Z - 0.16);
  tktsBackSign.rotation.y = Math.PI;
  tktsGroup.add(tktsEastSign, tktsWestSign, tktsBackSign);

  // Translucent laminated glass side balustrades + stainless handrails
  const slopeLen = Math.hypot(TKTS_SOUTH_Z - TKTS_NORTH_Z, TKTS_TOP_Y);
  const slopePitch = Math.atan2(TKTS_TOP_Y, TKTS_SOUTH_Z - TKTS_NORTH_Z);
  for (const sideX of [TKTS_MIN_X - 0.08, TKTS_MAX_X + 0.08]) {
    const glassSide = new THREE.Mesh(track(new THREE.BoxGeometry(0.08, 1.05, slopeLen)), glassBalustradeMat);
    glassSide.position.set(sideX, TKTS_TOP_Y * 0.5 + 0.52, (TKTS_SOUTH_Z + TKTS_NORTH_Z) * 0.5);
    glassSide.rotation.x = slopePitch;
    const topBar = new THREE.Mesh(track(new THREE.CylinderGeometry(0.04, 0.04, slopeLen, 8)), railMat);
    topBar.position.set(sideX, TKTS_TOP_Y * 0.5 + 1.06, (TKTS_SOUTH_Z + TKTS_NORTH_Z) * 0.5);
    topBar.rotation.x = Math.PI / 2 + slopePitch;
    tktsGroup.add(glassSide, topBar);
  }
  const topGlassRail = new THREE.Mesh(track(new THREE.BoxGeometry(tktsW + 0.24, 1.15, 0.08)), glassBalustradeMat);
  topGlassRail.position.set(tktsCX, TKTS_TOP_Y + 0.58, TKTS_NORTH_Z);
  tktsGroup.add(topGlassRail);
  enableRefl(tktsGroup);
  group.add(tktsGroup);

  // --- 4. HERO: Father Duffy Sculpted Bronze Statue, Carved Speckled Granite Celtic Cross & Wrought-Iron Rail ---
  const graniteTex = (() => {
    const c = document.createElement('canvas'); c.width = 256; c.height = 256;
    const g = c.getContext('2d')!;
    g.fillStyle = '#5c5a57'; g.fillRect(0, 0, 256, 256);
    let s = 918273;
    const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    for (let i = 0; i < 6500; i++) {
      const v = r();
      g.fillStyle = v > 0.68 ? 'rgba(218,214,205,0.28)' : v < 0.32 ? 'rgba(22,20,18,0.34)' : 'rgba(128,122,114,0.22)';
      g.fillRect(r() * 256, r() * 256, 2 + r() * 3, 2 + r() * 2);
    }
    g.strokeStyle = 'rgba(26,24,22,0.45)'; g.lineWidth = 2;
    for (let y = 0; y < 256; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); }
    const t = track(new THREE.CanvasTexture(c));
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const graniteMat = track(new THREE.MeshStandardMaterial({
    map: graniteTex, bumpMap: graniteTex, bumpScale: 0.05, color: '#8a8680', roughness: 0.78, metalness: 0.08,
  }));
  const bronzeMat = track(new THREE.MeshStandardMaterial({
    color: '#465448', roughness: 0.34, metalness: 0.84,
  }));
  const ironMat = track(new THREE.MeshStandardMaterial({ color: '#14171c', roughness: 0.42, metalness: 0.88 }));
  const inscriptionTex = track(makeSignTexture([
    { text: 'FATHER DUFFY', size: 42, color: '#e6d8b5', y: 40, font: '"Instrument Serif", Georgia, serif' },
    { text: 'LT. COL. FRANCIS P. DUFFY · 165TH INF.', size: 18, color: '#c8be9e', y: 82, weight: '600' },
    { text: '1871  —  1932', size: 16, color: '#b4aa8e', y: 108, weight: '600' },
  ], '#3a3834', 512, 128, '#7a7262'));
  const plaqueMat = track(new THREE.MeshStandardMaterial({ map: inscriptionTex, roughness: 0.55, metalness: 0.42 }));

  const duffy = new THREE.Group();
  duffy.position.set(-18.6, 0, -135.2);
  // Sleek authentic stepped granite pedestal + carved inscription plaque (NO bloated purple clay slab!)
  const dStep1 = new THREE.Mesh(track(new THREE.BoxGeometry(3.1, 0.32, 3.1)), graniteMat); dStep1.position.y = 0.16; dStep1.castShadow = true; dStep1.receiveShadow = true;
  const dStep2 = new THREE.Mesh(track(new THREE.BoxGeometry(2.3, 0.28, 2.3)), graniteMat); dStep2.position.y = 0.46; dStep2.castShadow = true; dStep2.receiveShadow = true;
  const dPlinth = new THREE.Mesh(track(new THREE.BoxGeometry(1.58, 1.55, 1.38)), graniteMat); dPlinth.position.y = 1.37; dPlinth.castShadow = true; dPlinth.receiveShadow = true;
  const dCap = new THREE.Mesh(track(new THREE.BoxGeometry(1.74, 0.14, 1.54)), graniteMat); dCap.position.y = 2.18; dCap.castShadow = true;
  const dPlaque = new THREE.Mesh(track(new THREE.PlaneGeometry(1.18, 0.46)), plaqueMat); dPlaque.position.set(0, 1.48, 0.70);
  const dPlaqueN = dPlaque.clone(); dPlaqueN.position.set(0, 1.48, -0.70); dPlaqueN.rotation.y = Math.PI;
  // Finely proportioned carved granite Celtic Cross behind Father Duffy (with vertical stone shaft inscription!)
  const crossV = new THREE.Mesh(track(new THREE.BoxGeometry(0.60, 4.15, 0.36)), graniteMat); crossV.position.set(0, 4.25, -0.32); crossV.castShadow = true;
  const crossH = new THREE.Mesh(track(new THREE.BoxGeometry(1.92, 0.54, 0.34)), graniteMat); crossH.position.set(0, 5.20, -0.32); crossH.castShadow = true;
  const crossRing = new THREE.Mesh(track(new THREE.TorusGeometry(0.64, 0.10, 10, 24)), graniteMat); crossRing.position.set(0, 5.20, -0.32); crossRing.castShadow = true;
  const shaftReliefTex = track(makeSignTexture([
    { text: 'P A T R I O T', size: 22, color: '#cbc2b0', y: 42, font: '"Instrument Serif", Georgia, serif' },
    { text: 'P R I E S T', size: 22, color: '#cbc2b0', y: 92, font: '"Instrument Serif", Georgia, serif' },
    { text: 'S O L D I E R', size: 22, color: '#cbc2b0', y: 142, font: '"Instrument Serif", Georgia, serif' },
    { text: '1 6 5 T H  I N F', size: 18, color: '#afa694', y: 204, weight: '600' },
  ], '#52504c', 160, 256, '#7a756c'));
  const shaftRelief = new THREE.Mesh(track(new THREE.PlaneGeometry(0.42, 1.55)), track(new THREE.MeshStandardMaterial({ map: shaftReliefTex, roughness: 0.82 })));
  shaftRelief.position.set(0, 3.65, -0.51); shaftRelief.rotation.y = Math.PI;
  duffy.add(shaftRelief);
  // Detailed 2.25m Verdigris-Patinated Dark Bronze Standing Statue of Father Duffy!
  const fBase = new THREE.Mesh(track(new THREE.BoxGeometry(0.68, 0.16, 0.62)), bronzeMat); fBase.position.set(0, 2.33, 0.36);
  const fCoatLower = new THREE.Mesh(track(new THREE.CylinderGeometry(0.21, 0.30, 0.92, 12)), bronzeMat); fCoatLower.position.set(0, 2.86, 0.36); fCoatLower.castShadow = true;
  const fTorso = new THREE.Mesh(track(new THREE.CylinderGeometry(0.24, 0.19, 0.66, 12)), bronzeMat); fTorso.position.set(0, 3.60, 0.36); fTorso.scale.set(1.18, 1, 0.72); fTorso.castShadow = true;
  const fArmL = new THREE.Mesh(track(new THREE.CylinderGeometry(0.068, 0.055, 0.58, 8)), bronzeMat); fArmL.position.set(-0.24, 3.52, 0.44); fArmL.rotation.set(-0.42, 0, 0.18);
  const fArmR = new THREE.Mesh(track(new THREE.CylinderGeometry(0.068, 0.055, 0.58, 8)), bronzeMat); fArmR.position.set(0.24, 3.52, 0.44); fArmR.rotation.set(-0.42, 0, -0.18);
  const fBook = new THREE.Mesh(track(new THREE.BoxGeometry(0.24, 0.30, 0.08)), bronzeMat); fBook.position.set(0, 3.36, 0.60); fBook.rotation.x = -0.35;
  const fNeck = new THREE.Mesh(track(new THREE.CylinderGeometry(0.075, 0.095, 0.16, 8)), bronzeMat); fNeck.position.set(0, 3.98, 0.36);
  const fHead = new THREE.Mesh(track(new THREE.SphereGeometry(0.145, 12, 12)), bronzeMat); fHead.position.set(0, 4.18, 0.36); fHead.scale.set(0.92, 1.08, 0.96); fHead.castShadow = true;
  // Low Black Wrought-Iron Perimeter Guard Railing (posts + top/bottom rail + pickets)
  const fenceSpan = 1.92;
  for (const [fx, fz] of [[-fenceSpan, -fenceSpan], [fenceSpan, -fenceSpan], [-fenceSpan, fenceSpan], [fenceSpan, fenceSpan]] as const) {
    const post = new THREE.Mesh(track(new THREE.CylinderGeometry(0.04, 0.045, 0.88, 8)), ironMat);
    post.position.set(fx, 0.44, fz);
    duffy.add(post);
  }
  for (const ry of [0.22, 0.82]) {
    const railN = new THREE.Mesh(track(new THREE.BoxGeometry(fenceSpan * 2, 0.04, 0.04)), ironMat); railN.position.set(0, ry, -fenceSpan);
    const railS = railN.clone(); railS.position.z = fenceSpan;
    const railW = new THREE.Mesh(track(new THREE.BoxGeometry(0.04, 0.04, fenceSpan * 2)), ironMat); railW.position.set(-fenceSpan, ry, 0);
    const railE = railW.clone(); railE.position.x = fenceSpan;
    duffy.add(railN, railS, railW, railE);
  }
  for (let p = -1.6; p <= 1.61; p += 0.40) {
    const pN = new THREE.Mesh(track(new THREE.CylinderGeometry(0.015, 0.015, 0.64, 5)), ironMat); pN.position.set(p, 0.52, -fenceSpan);
    const pS = pN.clone(); pS.position.z = fenceSpan;
    const pW = pN.clone(); pW.position.set(-fenceSpan, 0.52, p);
    const pE = pN.clone(); pE.position.set(fenceSpan, 0.52, p);
    duffy.add(pN, pS, pW, pE);
  }
  // Focused museum SpotLight aimed strictly onto Father Duffy plaque & granite cross (ZERO spill onto nearby bystanders!)
  const duffyUplight = new THREE.SpotLight('#ffd28e', 30, 11, 0.44, 0.50, 1.4);
  duffyUplight.position.set(0, 0.85, -1.65);
  duffyUplight.target.position.set(0, 2.8, -0.30);
  duffy.add(dStep1, dStep2, dPlinth, dCap, dPlaque, dPlaqueN, crossV, crossH, crossRing, fBase, fCoatLower, fTorso, fArmL, fArmR, fBook, fNeck, fHead, duffyUplight, duffyUplight.target);
  group.add(duffy);
  colliders.push({ minX: -20.8, maxX: -16.4, minZ: -137.4, maxZ: -133.0 });

  // Twin tall stainless-steel flagpoles with smooth cloth-wave shader (US Flag & NYC Flag)
  const flagUniforms = { uTime: { value: 0 } };
  const makeFlagTex = (isUs: boolean) => {
    const c = document.createElement('canvas'); c.width = 256; c.height = 160;
    const g = c.getContext('2d')!;
    if (isUs) {
      for (let s = 0; s < 13; s++) { g.fillStyle = s % 2 === 0 ? '#a81c2e' : '#eceef2'; g.fillRect(0, (s * 160) / 13, 256, 160 / 13 + 1); }
      g.fillStyle = '#182b66'; g.fillRect(0, 0, 106, (7 * 160) / 13);
      g.fillStyle = '#ffffff';
      for (let r = 0; r < 5; r++) for (let col = 0; col < 6; col++) g.fillRect(10 + col * 16, 8 + r * 15, 4, 4);
    } else {
      g.fillStyle = '#0038a8'; g.fillRect(0, 0, 86, 160);
      g.fillStyle = '#f2f4f8'; g.fillRect(86, 0, 84, 160);
      g.fillStyle = '#f26522'; g.fillRect(170, 0, 86, 160);
      g.strokeStyle = '#0038a8'; g.lineWidth = 4; g.beginPath(); g.arc(128, 80, 24, 0, Math.PI * 2); g.stroke();
    }
    const t = track(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const makeClothMat = (tex: THREE.CanvasTexture) => track(new THREE.ShaderMaterial({
    uniforms: { uMap: { value: tex }, uTime: flagUniforms.uTime },
    side: THREE.DoubleSide,
    vertexShader: /* glsl */ `
      uniform float uTime; varying vec2 vUv; varying float vShade;
      void main() {
        vUv = uv; vec3 p = position;
        float w1 = sin(uv.x * 9.0 - uTime * 4.2 + uv.y * 2.2) * 0.34 * uv.x;
        float w2 = sin(uv.x * 16.0 - uTime * 6.5 - uv.y * 3.5) * 0.12 * uv.x * uv.x;
        p.z += w1 + w2; p.y -= uv.x * uv.x * 0.28;
        vShade = 0.78 + 0.26 * cos(uv.x * 9.0 - uTime * 4.2 + uv.y * 2.2);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap; varying vec2 vUv; varying float vShade;
      void main() { gl_FragColor = vec4(texture2D(uMap, vUv).rgb * vShade * 0.90, 1.0); }
    `,
  }));

  // Twin tall stainless-steel flagpoles positioned cleanly inside Duffy Square granite plaza (ZERO curb clipping!)
  for (const [fx, fz, isUs] of [[-25.2, -145.5, true], [-13.2, -145.5, false]] as const) {
    const pole = new THREE.Mesh(track(new THREE.CylinderGeometry(0.10, 0.20, 22.5, 10)), railMat); pole.position.set(fx, 11.25, fz); pole.castShadow = true;
    const finial = new THREE.Mesh(track(new THREE.SphereGeometry(0.22, 10, 10)), track(new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.9, roughness: 0.2 }))); finial.position.set(fx, 22.65, fz);
    const fBase = new THREE.Mesh(track(new THREE.CylinderGeometry(0.52, 0.72, 1.15, 12)), bronzeMat); fBase.position.set(fx, 0.58, fz); fBase.castShadow = true;
    const flagGeom = track(new THREE.PlaneGeometry(3.9, 2.4, 24, 10)); flagGeom.translate(1.95, 0, 0);
    const flag = new THREE.Mesh(flagGeom, makeClothMat(makeFlagTex(isUs))); flag.position.set(fx, 20.6, fz); flag.rotation.y = 0.38;
    group.add(pole, finial, fBase, flag);
  }

  // --- 5. HERO: Full-Density Photographic & Animated LED Mega-Billboards + 3D Steel Mounting Trusses ---
  function addFlatBillboard(board: AnimatedBillboard, x: number, y: number, z: number, w: number, h: number, rotY: number): void {
    const holder = new THREE.Group();
    holder.position.set(x, y, z); holder.rotation.y = rotY;
    const cabinet = new THREE.Mesh(track(new THREE.BoxGeometry(w + 1.0, h + 1.0, 0.85)), facades.steelTruss);
    cabinet.position.z = -0.52;
    const catTop = new THREE.Mesh(track(new THREE.BoxGeometry(w + 1.4, 0.28, 1.65)), facades.steelTruss);
    catTop.position.set(0, h * 0.5 + 0.55, -0.7);
    const catBot = catTop.clone(); catBot.position.y = -h * 0.5 - 0.55;
    holder.add(cabinet, catTop, catBot);
    const ribs = Math.max(2, Math.floor(w / 8));
    for (let r = 0; r < ribs; r++) {
      const rx = -w * 0.42 + (r / Math.max(1, ribs - 1)) * w * 0.84;
      const rib = new THREE.Mesh(track(new THREE.BoxGeometry(0.32, h + 1.8, 1.5)), facades.steelTruss);
      rib.position.set(rx, 0, -1.1);
      holder.add(rib);
    }
    holder.add(new THREE.Mesh(track(new THREE.PlaneGeometry(w, h)), board.material));
    enableRefl(holder);
    group.add(holder);
  }

  function addCurvedBillboard(board: AnimatedBillboard, cx: number, cy: number, cz: number, radius: number, height: number, thetaStart: number, thetaLength: number): void {
    const segs = 32;
    const mesh = new THREE.Mesh(track(new THREE.CylinderGeometry(radius, radius, height, segs, 1, true, thetaStart, thetaLength)), board.material);
    mesh.position.set(cx, cy, cz);
    const ringTop = new THREE.Mesh(track(new THREE.CylinderGeometry(radius + 0.4, radius + 0.4, 1.0, segs, 1, true, thetaStart, thetaLength)), facades.steelTruss);
    ringTop.position.set(cx, cy + height * 0.5 + 0.45, cz);
    const ringBot = ringTop.clone(); ringBot.position.y = cy - height * 0.5 - 0.45;
    enableRefl(mesh); enableRefl(ringTop); enableRefl(ringBot);
    group.add(mesh, ringTop, ringBot);
  }

  // (A) ONE TIMES SQUARE — Full Edge-to-Edge Stacked North Nose (0..103m) + Side Wraps!
  addFlatBillboard(boards.oneTimesSquare, 20.5, 57.5, 157.4, 14.4, 92, Math.PI);
  addFlatBillboard(boards.cyanVertical, 13.0, 52, 174, 16, 72, -Math.PI / 2);
  addFlatBillboard(boards.luxuryCouture, 28.4, 52, 174, 18, 42, Math.PI / 2);

  // (B) 4 TIMES SQUARE — 7-Story Cylindrical Curved NASDAQ MarketSite Tower
  addCurvedBillboard(boards.nasdaq, 47.2, 27, 144.2, 11.4, 37, Math.PI * 0.92, Math.PI * 0.74);
  addFlatBillboard(boards.prudential, 43.2, 60, 152, 20, 15, -Math.PI * 0.62);

  // (C) WEST / RIGHT CANYON WALL — COMPLETELY PACKED PROUD OF Z=-98.7 WALL (Z=-99.8 = ZERO CLIPPING, ZERO DUPLICATES!)
  // 1) 5 Massive North-Facing Corner Spectaculars mounted 1.1m PROUD of Marriott North Wing (facing straight at Duffy/TKTS!):
  addFlatBillboard(boards.wicked, -36.5, 22, -99.8, 13.5, 23, Math.PI);
  addFlatBillboard(boards.americanEagle, -55.0, 22, -99.8, 22, 20, Math.PI);
  addFlatBillboard(boards.marriottMega, -55.0, 46, -99.8, 34, 22, Math.PI);
  addFlatBillboard(boards.lionKing, -78.5, 34, -99.8, 21, 24, Math.PI);
  addFlatBillboard(boards.prudential, -55.0, 65, -99.8, 30, 11, Math.PI);
  // 2) Flush West Broadway 1551–1567 Corner Screens directly flanking Duffy Square on the West:
  addFlatBillboard(boards.americanEagle, -45.4, 18, -148, 25, 19, Math.PI / 2 - 0.22);
  addFlatBillboard(boards.luxuryCouture, -46.8, 38, -148, 26, 17, Math.PI / 2 - 0.22);
  addFlatBillboard(boards.tsxBroadway, -41.0, 21, -122, 17, 24, Math.PI / 2 - 0.22);
  addFlatBillboard(boards.cyanVertical, -34.0, 24, -91, 12, 26, Math.PI / 2 - 0.18);
  // 3) Marriott Marquis 330-ft Giant Curved Panoramic Screen (X = -24.0, Z = -68) + Crown Header!
  addFlatBillboard(boards.marriottMega, -24.1, 35, -67.5, 58, 24, Math.PI / 2);
  const marriottHdrTex = track(makeSignTexture([{ text: 'M    M A R R I O T T    M A R Q U I S', size: 46, color: '#ffffff', y: 64 }], '#161116', 1024, 128, '#b81734'));
  const marriottHdr = new THREE.Mesh(
    track(new THREE.PlaneGeometry(56, 4.8)),
    track(new THREE.MeshStandardMaterial({ map: marriottHdrTex, emissive: '#ffffff', emissiveMap: marriottHdrTex, emissiveIntensity: 0.95 })),
  );
  marriottHdr.position.set(-23.8, 50.2, -67.5); marriottHdr.rotation.y = Math.PI / 2;
  enableRefl(marriottHdr);
  group.add(marriottHdr);
  // Lower stacked screens beneath Marriott Marquis (unique non-duplicated artwork!)
  addFlatBillboard(boards.americanEagle, -23.7, 15.5, -52, 24, 13, Math.PI / 2);
  addFlatBillboard(boards.luxuryCouture, -23.7, 15.5, -80, 26, 13, Math.PI / 2);

  // (D) EAST / LEFT CANYON WALL — 1540 BROADWAY + TSX BROADWAY + 20 TIMES SQUARE (ZERO DUPLICATES IN SAME VIEW!)
  addFlatBillboard(boards.broadway1540, 13.4, 24, -65, 34, 22, -Math.PI / 2);
  addFlatBillboard(boards.aladdin, 13.4, 24, -90, 16, 23, -Math.PI / 2);
  addFlatBillboard(boards.luxuryCouture, 13.4, 44, -72, 34, 15, -Math.PI / 2);
  addFlatBillboard(boards.cyanVertical, 13.4, 34, -44, 10, 32, -Math.PI / 2);

  addFlatBillboard(boards.tsxBroadway, 13.4, 28, -163, 30, 22, -Math.PI / 2);
  addFlatBillboard(boards.editorialDark, 13.4, 15, -134, 24, 11.5, -Math.PI / 2);
  addFlatBillboard(boards.lionKing, 13.4, 36, -134, 18, 24, -Math.PI / 2);
  addFlatBillboard(boards.cyanVertical, 14.2, 34, -208, 16, 36, -Math.PI / 2);
  addFlatBillboard(boards.tsxBroadway, 28, 28, -196.4, 26, 18, 0);

  // (E) 2 TIMES SQUARE — Unobstructed Iconic Northern Anchor Behind TKTS! (No clipping #4 box!)
  addCurvedBillboard(boards.cocaRed, -24.5, 35, -214, 16, 15, -0.58, 1.16);
  addCurvedBillboard(boards.prudential, -24.5, 53, -214, 16, 14, -0.56, 1.12);
  addCurvedBillboard(boards.oneTimesSquare, -24.5, 76, -214, 14, 26, -0.50, 1.00);
  addCurvedBillboard(boards.tsxBroadway, -24.5, 17, -214, 16.2, 13, -0.56, 1.12);

  // (F) 1515 BROADWAY / VIACOM & MINSKOFF (44th-45th West) — THE LION KING!
  addFlatBillboard(boards.lionKing, -16.3, 25, 10, 22, 28, Math.PI / 2);
  addFlatBillboard(boards.americanEagle, -16.3, 20, -10, 16, 18, Math.PI / 2);
  addFlatBillboard(boards.wicked, -16.3, 21, 31, 18, 18, Math.PI / 2);

  // (G) 1500 BROADWAY / ABC GOOD MORNING AMERICA + 3 TIMES SQUARE
  addFlatBillboard(boards.abcTicker, 42.6, 16, 92, 36, 9.5, -Math.PI / 2);
  addFlatBillboard(boards.broadway1540, 42.6, 34, 92, 30, 20, -Math.PI / 2);
  addFlatBillboard(boards.cyanVertical, -16.0, 44, 154, 16, 48, Math.PI / 2);
  addFlatBillboard(boards.nasdaq, -16.0, 22, 174, 22, 16, Math.PI / 2);

  // --- 6. HERO: Illuminated Architectural U.S. ARMED FORCES Pavilion (50 Glowing Stars + Backlit Glass Doors!) ---
  const afGroup = new THREE.Group();
  afGroup.position.set(10.8, 0, 107.2);
  const darkSteelMat = track(new THREE.MeshStandardMaterial({ color: '#242a36', roughness: 0.38, metalness: 0.82 }));
  const warmGlassMat = track(new THREE.MeshPhysicalMaterial({
    color: '#1b2638', emissive: new THREE.Color('#3b4c68'), emissiveIntensity: 0.45,
    roughness: 0.1, metalness: 0.72, clearcoat: 1.0,
  }));
  const afShell = new THREE.Mesh(track(new THREE.BoxGeometry(4.1, 3.6, 11.4)), warmGlassMat); afShell.position.y = 1.8;
  const afRoof = new THREE.Mesh(track(new THREE.BoxGeometry(5.0, 0.58, 12.6)), darkSteelMat); afRoof.position.y = 3.88;
  afGroup.add(afShell, afRoof);

  // Crisp illuminated horizontal LED American Flag texture with 50 glowing white stars & horizontal light bars!
  const afFlagTex = (() => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 192;
    const g = c.getContext('2d')!;
    g.fillStyle = '#090c14'; g.fillRect(0, 0, 512, 192);
    for (let s = 0; s < 13; s++) {
      g.fillStyle = s % 2 === 0 ? '#ff2436' : '#f4f8ff';
      g.fillRect(4, 4 + s * 14.2, 504, 8.5);
    }
    g.fillStyle = '#0c44cc'; g.fillRect(4, 4, 212, 102);
    g.fillStyle = '#ffffff';
    for (let r = 0; r < 5; r++) for (let col = 0; col < 10; col++) {
      g.beginPath(); g.arc(16 + col * 20, 14 + r * 20, 3.2, 0, Math.PI * 2); g.fill();
    }
    const t = track(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const afFlagLedMat = track(new THREE.MeshStandardMaterial({ map: afFlagTex, emissive: '#ffffff', emissiveMap: afFlagTex, emissiveIntensity: 1.25 }));
  const afFlagW = new THREE.Mesh(track(new THREE.PlaneGeometry(10.8, 3.0)), afFlagLedMat);
  afFlagW.position.set(-2.08, 1.95, 0); afFlagW.rotation.y = -Math.PI / 2;
  const afFlagE = afFlagW.clone(); afFlagE.position.x = 2.08; afFlagE.rotation.y = Math.PI / 2;
  // Illuminated North face (so VP4 sees glowing glass lobby + backlit U.S. ARMED FORCES header, NOT a pitch-black box!)
  const afNorthTex = track(makeSignTexture([
    { text: 'U.S. ARMED FORCES', size: 42, color: '#ffffff', y: 42 },
    { text: 'ARMY · NAVY · AIR FORCE · MARINES', size: 20, color: '#ffd86b', y: 94, weight: '700' },
  ], '#0f2042', 512, 128, '#5ea8ff'));
  const afNorthMat = track(new THREE.MeshStandardMaterial({ map: afNorthTex, emissive: '#dceeff', emissiveMap: afNorthTex, emissiveIntensity: 1.15 }));
  const afNorthFace = new THREE.Mesh(track(new THREE.PlaneGeometry(3.8, 1.25)), afNorthMat);
  afNorthFace.position.set(0, 2.75, -5.74); afNorthFace.rotation.y = Math.PI;
  const afSignW = new THREE.Mesh(track(new THREE.PlaneGeometry(11.8, 0.54)), afNorthMat);
  afSignW.position.set(-2.52, 3.88, 0); afSignW.rotation.y = -Math.PI / 2;
  afGroup.add(afFlagW, afFlagE, afNorthFace, afSignW);
  enableRefl(afGroup);
  group.add(afGroup);
  colliders.push({ minX: 8.1, maxX: 13.5, minZ: 100.8, maxZ: 113.6 });

  // --- 7. HERO: NYPD Times Square Substation ---
  const nypdGroup = new THREE.Group();
  nypdGroup.position.set(14.9, 0, 146.0);
  const nypdBody = new THREE.Mesh(track(new THREE.BoxGeometry(8.0, 3.8, 13.6)), darkSteelMat); nypdBody.position.y = 1.9;
  const nypdGlass = new THREE.Mesh(track(new THREE.BoxGeometry(8.08, 1.8, 12.6)), warmGlassMat); nypdGlass.position.y = 1.65;
  const nypdTex = track(makeSignTexture([{ text: 'N Y P D   ·   T I M E S   S Q U A R E', size: 32, color: '#ffffff', y: 64 }], '#0038a8', 768, 128, '#58c0ff'));
  const nypdMat = track(new THREE.MeshStandardMaterial({ map: nypdTex, emissive: '#4eaaff', emissiveMap: nypdTex, emissiveIntensity: 1.35 }));
  const nypdFront = new THREE.Mesh(track(new THREE.PlaneGeometry(8.05, 1.15)), nypdMat); nypdFront.position.set(0, 3.22, -6.86); nypdFront.rotation.y = Math.PI;
  const nypdSide = new THREE.Mesh(track(new THREE.PlaneGeometry(13.6, 1.15)), nypdMat); nypdSide.position.set(-4.06, 3.22, 0); nypdSide.rotation.y = -Math.PI / 2;
  nypdGroup.add(nypdBody, nypdGlass, nypdFront, nypdSide);
  enableRefl(nypdGroup);
  group.add(nypdGroup);
  colliders.push({ minX: 10.2, maxX: 19.6, minZ: 138.5, maxZ: 153.5 });

  // --- 8. Raised Curbs, Monolithic Snøhetta Benches, Bollards, Cafe Tables, Streetlamps, Signals, Subways & Steam ---
  const curbMat = track(new THREE.MeshStandardMaterial({ color: '#454852', roughness: 0.70, metalness: 0.12 }));
  for (const [z0, z1] of [[-179, -117], [-100, -38], [-20, 42], [60, 121], [139, 196]] as const) {
    const len = z1 - z0; const zc = (z0 + z1) * 0.5;
    for (const cx of [-11.35, 10.35]) {
      const curb = new THREE.Mesh(track(new THREE.BoxGeometry(0.32, 0.17, len)), curbMat);
      curb.position.set(cx, 0.085, zc);
      group.add(curb);
    }
  }

  const benchCoords: Array<[number, number, number]> = [
    [-23.5, -138, 0.18], [-13.5, -132, 0.0], [-20.5, -122, 0.12],
    [-16.5, -82, 0.0], [-14.5, -54, 0.0], [14.5, -62, 0.0], [15.5, 18, 0.0], [18.5, 82, 0.15], [22.5, 124, 0.18],
  ];
  const benchInst = new THREE.InstancedMesh(track(new THREE.BoxGeometry(0.75, 0.48, 4.4)), graniteMat, benchCoords.length);
  benchCoords.forEach(([bx, bz, rot], idx) => {
    dummy.position.set(bx, 0.24, bz); dummy.rotation.set(0, rot, 0); dummy.scale.set(1, 1, 1);
    dummy.updateMatrix(); benchInst.setMatrixAt(idx, dummy.matrix);
  });
  benchInst.instanceMatrix.needsUpdate = true;
  group.add(benchInst);

  const bollardCoords: Array<[number, number]> = [];
  for (let z = -158; z <= -116; z += 4.2) { bollardCoords.push([-11.6, z]); bollardCoords.push([-32 + (z + 160) * 0.22, z]); }
  for (let z = -98; z <= 145; z += 10) {
    if (Math.abs(z + 29) < 9 || Math.abs(z - 51) < 9 || Math.abs(z - 130) < 9) continue;
    bollardCoords.push([-11.55, z]); bollardCoords.push([10.55, z]);
  }
  const bollardInst = new THREE.InstancedMesh(track(new THREE.CylinderGeometry(0.16, 0.19, 1.04, 10)), railMat, bollardCoords.length);
  bollardCoords.forEach(([bx, bz], idx) => {
    dummy.position.set(bx, 0.52, bz); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1);
    dummy.updateMatrix(); bollardInst.setMatrixAt(idx, dummy.matrix);
  });
  bollardInst.instanceMatrix.needsUpdate = true;
  group.add(bollardInst);

  const tableCoords: Array<[number, number]> = [
    [-22, -126], [-17.5, -120], [-14.2, -125], [-21.5, -148], [-15.2, -150], [-25, -152],
    [-19, -86], [-15, -72], [-17, -60], [-14.5, -45], [13.5, -14], [15.5, 4], [14.5, 22], [16, 36], [17, 72], [20, 88], [22, 118],
  ];
  const redCafeMat = track(new THREE.MeshStandardMaterial({ color: '#c41d28', roughness: 0.42, metalness: 0.55 }));
  const tableTopInst = new THREE.InstancedMesh(track(new THREE.CylinderGeometry(0.46, 0.46, 0.05, 14)), redCafeMat, tableCoords.length);
  const tableLegInst = new THREE.InstancedMesh(track(new THREE.CylinderGeometry(0.04, 0.04, 0.74, 8)), railMat, tableCoords.length);
  const chairInst = new THREE.InstancedMesh(track(new THREE.CylinderGeometry(0.22, 0.20, 0.46, 10)), redCafeMat, tableCoords.length * 2);
  tableCoords.forEach(([tx, tz], idx) => {
    dummy.position.set(tx, 0.76, tz); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1);
    dummy.updateMatrix(); tableTopInst.setMatrixAt(idx, dummy.matrix);
    dummy.position.set(tx, 0.37, tz); dummy.updateMatrix(); tableLegInst.setMatrixAt(idx, dummy.matrix);
    for (let c = 0; c < 2; c++) {
      const ang = idx * 1.1 + c * Math.PI;
      dummy.position.set(tx + Math.cos(ang) * 0.76, 0.23, tz + Math.sin(ang) * 0.76);
      dummy.rotation.set(0, ang, 0); dummy.updateMatrix(); chairInst.setMatrixAt(idx * 2 + c, dummy.matrix);
    }
  });
  tableTopInst.instanceMatrix.needsUpdate = true; tableLegInst.instanceMatrix.needsUpdate = true; chairInst.instanceMatrix.needsUpdate = true;
  group.add(tableTopInst, tableLegInst, chairInst);

  const lampCoords: Array<[number, number, number]> = [];
  for (let z = -195; z <= 195; z += 28) { lampCoords.push([-12.2, z, Math.PI / 2]); lampCoords.push([11.2, z, -Math.PI / 2]); }
  const lampPoleMat = track(new THREE.MeshStandardMaterial({ color: '#1b2028', roughness: 0.45, metalness: 0.85 }));
  const lampGlowMat = track(new THREE.MeshBasicMaterial({ color: '#fff0c4' }));
  const poleInst = new THREE.InstancedMesh(track(new THREE.CylinderGeometry(0.1, 0.16, 8.8, 8)), lampPoleMat, lampCoords.length);
  const armInst = new THREE.InstancedMesh(track(new THREE.BoxGeometry(0.14, 0.14, 2.2)), lampPoleMat, lampCoords.length);
  const bulbInst = new THREE.InstancedMesh(track(new THREE.BoxGeometry(0.45, 0.14, 0.85)), lampGlowMat, lampCoords.length);
  const trashInst = new THREE.InstancedMesh(track(new THREE.BoxGeometry(0.62, 1.05, 0.62)), darkSteelMat, lampCoords.length);
  lampCoords.forEach(([lx, lz, rot], idx) => {
    dummy.position.set(lx, 4.4, lz); dummy.rotation.set(0, rot, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix(); poleInst.setMatrixAt(idx, dummy.matrix);
    const dirX = Math.sin(rot);
    dummy.position.set(lx + dirX * 1.0, 8.75, lz); dummy.updateMatrix(); armInst.setMatrixAt(idx, dummy.matrix);
    dummy.position.set(lx + dirX * 1.9, 8.62, lz); dummy.updateMatrix(); bulbInst.setMatrixAt(idx, dummy.matrix);
    dummy.position.set(lx - dirX * 0.65, 0.525, lz + 1.4); dummy.updateMatrix(); trashInst.setMatrixAt(idx, dummy.matrix);
  });
  poleInst.instanceMatrix.needsUpdate = true; armInst.instanceMatrix.needsUpdate = true; bulbInst.instanceMatrix.needsUpdate = true; trashInst.instanceMatrix.needsUpdate = true;
  enableRefl(bulbInst);
  group.add(poleInst, armInst, bulbInst, trashInst);

  // NYC Yellow Traffic Signals + Green Street Signs
  const greenLensMat = track(new THREE.MeshBasicMaterial({ color: '#18ff80' }));
  const redLensMat = track(new THREE.MeshBasicMaterial({ color: '#ff2222' }));
  const walkWhiteMat = track(new THREE.MeshBasicMaterial({ color: '#e8f5ff' }));
  const orangeHandMat = track(new THREE.MeshBasicMaterial({ color: '#ff6614' }));
  const trafficYellowMat = track(new THREE.MeshStandardMaterial({ color: '#f0ad00', roughness: 0.35, metalness: 0.32 }));
  const nsGreenLights: THREE.Mesh[] = [];
  const nsRedLights: THREE.Mesh[] = [];
  const walkSigns: THREE.Mesh[] = [];

  for (const inter of [{ z: -180, st: 'W 47 ST' }, { z: -101, st: 'W 46 ST' }, { z: -21, st: 'W 45 ST' }, { z: 59, st: 'W 44 ST' }, { z: 138, st: 'W 43 ST' }]) {
    const streetSignTex = track(makeSignTexture([{ text: `7 AV  ·  ${inter.st}`, size: 32, color: '#ffffff', y: 42 }], '#0b6632', 384, 84, '#ffffff'));
    const streetSignMat = track(new THREE.MeshStandardMaterial({ map: streetSignTex, emissive: '#66cc88', emissiveMap: streetSignTex, emissiveIntensity: 0.35 }));
    for (const sx of [-11.8, 10.8]) {
      const dir = sx < 0 ? 1 : -1;
      const tp = new THREE.Mesh(track(new THREE.CylinderGeometry(0.13, 0.18, 6.4, 8)), lampPoleMat); tp.position.set(sx, 3.2, inter.z);
      const arm = new THREE.Mesh(track(new THREE.BoxGeometry(3.8, 0.16, 0.16)), lampPoleMat); arm.position.set(sx + dir * 1.9, 6.2, inter.z);
      const stBlade = new THREE.Mesh(track(new THREE.BoxGeometry(1.85, 0.42, 0.06)), streetSignMat); stBlade.position.set(sx + dir * 1.4, 6.65, inter.z);
      const sigHead = new THREE.Mesh(track(new THREE.BoxGeometry(0.42, 1.32, 0.40)), trafficYellowMat); sigHead.position.set(sx + dir * 3.3, 5.62, inter.z);
      const gBulb = new THREE.Mesh(track(new THREE.CircleGeometry(0.15, 10)), greenLensMat); gBulb.position.set(sigHead.position.x, 5.24, inter.z - 0.21); gBulb.rotation.y = Math.PI;
      const rBulb = new THREE.Mesh(track(new THREE.CircleGeometry(0.15, 10)), redLensMat); rBulb.position.set(sigHead.position.x, 6.00, inter.z - 0.21); rBulb.rotation.y = Math.PI;
      nsGreenLights.push(gBulb); nsRedLights.push(rBulb);
      const pedBox = new THREE.Mesh(track(new THREE.BoxGeometry(0.44, 0.44, 0.26)), lampPoleMat); pedBox.position.set(sx, 3.1, inter.z);
      const pedFace = new THREE.Mesh(track(new THREE.PlaneGeometry(0.30, 0.30)), walkWhiteMat); pedFace.position.set(sx, 3.1, inter.z - 0.14); pedFace.rotation.y = Math.PI;
      walkSigns.push(pedFace);
      group.add(tp, arm, stBlade, sigHead, gBulb, rBulb, pedBox, pedFace);
    }
  }

  // Prominent Real-GPS MTA Subway Entrances (Dark Hunter-Green Wrought Iron + Bright Green Entrance Globes!)
  const subwayGreenMat = track(new THREE.MeshStandardMaterial({ color: '#124a2c', roughness: 0.40, metalness: 0.65 }));
  const globeGreenMat = track(new THREE.MeshBasicMaterial({ color: '#64ffa8' }));
  const subwaySignTex = track(makeSignTexture([
    { text: 'SUBWAY   ·   TIMES SQ - 42 ST', size: 28, color: '#ffffff', y: 42 },
    { text: 'N   Q   R   W   ·   1   2   3   7   S', size: 26, color: '#ffd43b', y: 92 },
  ], '#0b0c10', 512, 128, '#28a745'));
  const subwaySignMat = track(new THREE.MeshStandardMaterial({ map: subwaySignTex, emissive: '#ffffff', emissiveMap: subwaySignTex, emissiveIntensity: 1.0 }));
  const subwayLocs = [
    ...TIMES_SQUARE_SUBWAY_ENTRANCES.slice(0, 4),
    { x: 13.4, z: 118, name: '43 St' },
    { x: -14.2, z: -102, name: '46 St' },
    { x: 13.0, z: -116, name: '46 St E' },
    { x: -13.2, z: 64, name: '44 St W' },
  ];
  for (const sw of subwayLocs) {
    const sg = new THREE.Group(); sg.position.set(sw.x, 0, sw.z);
    const rL = new THREE.Mesh(track(new THREE.BoxGeometry(0.1, 1.15, 4.4)), subwayGreenMat); rL.position.set(-1.3, 0.58, 0);
    const rR = rL.clone(); rR.position.x = 1.3;
    const rB = new THREE.Mesh(track(new THREE.BoxGeometry(2.7, 1.15, 0.1)), subwayGreenMat); rB.position.set(0, 0.58, 2.2);
    const pit = new THREE.Mesh(track(new THREE.PlaneGeometry(2.4, 4.2)), track(new THREE.MeshBasicMaterial({ color: '#05070a' }))); pit.rotation.x = -Math.PI / 2; pit.position.y = 0.04;
    for (const px of [-1.3, 1.3]) {
      const post = new THREE.Mesh(track(new THREE.CylinderGeometry(0.06, 0.08, 3.25, 8)), subwayGreenMat); post.position.set(px, 1.62, -2.1);
      const globe = new THREE.Mesh(track(new THREE.SphereGeometry(0.26, 12, 12)), globeGreenMat); globe.position.set(px, 3.38, -2.1);
      sg.add(post, globe);
    }
    const header = new THREE.Mesh(track(new THREE.BoxGeometry(2.9, 0.72, 0.16)), subwaySignMat); header.position.set(0, 2.8, -2.1);
    sg.add(rL, rR, rB, pit, header);
    group.add(sg);
  }

  // Con Edison Orange-and-White Striped Steam Chimneys + Billowing Neon-Lit Volumetric Steam Plumes!
  const conEdTex = (() => {
    const c = document.createElement('canvas'); c.width = 64; c.height = 256;
    const g = c.getContext('2d')!;
    for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 === 0 ? '#ff5510' : '#f2f2f2'; g.fillRect(0, i * 32, 64, 32); }
    const t = track(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const conEdMat = track(new THREE.MeshStandardMaterial({ map: conEdTex, roughness: 0.52, metalness: 0.25 }));
  const steamTex = (() => {
    const c = document.createElement('canvas'); c.width = 128; c.height = 128;
    const g = c.getContext('2d')!;
    const rg = g.createRadialGradient(64, 64, 4, 64, 64, 60);
    rg.addColorStop(0, 'rgba(235, 240, 255, 0.44)'); rg.addColorStop(0.5, 'rgba(210, 222, 248, 0.18)'); rg.addColorStop(1, 'rgba(180, 200, 240, 0.0)');
    g.fillStyle = rg; g.fillRect(0, 0, 128, 128);
    const t = track(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();

  const steamStacks = [
    { x: 9.6, z: -116, tint: new THREE.Color('#ff88cc') },
    { x: -10.6, z: -36, tint: new THREE.Color('#ffbd85') },
    { x: 9.8, z: 44, tint: new THREE.Color('#80dcff') },
    { x: -10.4, z: 122, tint: new THREE.Color('#70d8ff') },
  ];
  interface SteamPuff { sprite: THREE.Sprite; baseX: number; baseZ: number; phase: number; speed: number; }
  const steamPuffs: SteamPuff[] = [];
  for (const st of steamStacks) {
    const chimney = new THREE.Mesh(track(new THREE.CylinderGeometry(0.28, 0.36, 3.0, 12)), conEdMat); chimney.position.set(st.x, 1.5, st.z);
    const collar = new THREE.Mesh(track(new THREE.CylinderGeometry(0.56, 0.64, 0.35, 12)), facades.steelTruss); collar.position.set(st.x, 0.175, st.z);
    group.add(chimney, collar);
    for (let p = 0; p < 14; p++) {
      const sm = track(new THREE.SpriteMaterial({
        map: steamTex, color: st.tint.clone().lerp(new THREE.Color('#ffffff'), 0.52),
        transparent: true, opacity: 0.3, depthWrite: false,
      }));
      const sp = new THREE.Sprite(sm);
      group.add(sp);
      steamPuffs.push({ sprite: sp, baseX: st.x, baseZ: st.z, phase: p / 14, speed: 0.22 + (p % 3) * 0.04 });
    }
  }

  // NYC Halal / Hot Dog / Pretzel Street Food Carts
  const halalTex = track(makeSignTexture([
    { text: 'THE HALAL GUYS  ·  NYC HOT DOGS', size: 26, color: '#fff4b8', y: 44 },
    { text: 'GYROS · PRETZELS · COFFEE · DRINKS', size: 20, color: '#ffffff', y: 92, weight: '600' },
  ], '#b81a14', 512, 128, '#ffd43b'));
  const halalMat = track(new THREE.MeshStandardMaterial({ map: halalTex, emissive: '#ffdca8', emissiveMap: halalTex, emissiveIntensity: 0.9 }));
  const umbrellaMat = track(new THREE.MeshStandardMaterial({ color: '#e6b800', roughness: 0.55 }));
  for (const [cx, cz, rot] of [[-13.5, -112, 0], [13.0, -34, Math.PI], [-13.8, 56, 0], [15.0, 124, Math.PI]] as const) {
    const cg = new THREE.Group(); cg.position.set(cx, 0, cz); cg.rotation.y = rot;
    const body = new THREE.Mesh(track(new THREE.BoxGeometry(1.4, 1.35, 2.5)), railMat); body.position.y = 0.95;
    const canopy = new THREE.Mesh(track(new THREE.BoxGeometry(1.65, 0.55, 2.75)), halalMat); canopy.position.y = 2.45;
    const umbrella = new THREE.Mesh(track(new THREE.ConeGeometry(1.45, 0.55, 8)), umbrellaMat); umbrella.position.set(0, 3.1, 0);
    for (const px of [-0.65, 0.65]) for (const pz of [-1.15, 1.15]) {
      const leg = new THREE.Mesh(track(new THREE.CylinderGeometry(0.03, 0.03, 2.4, 6)), railMat); leg.position.set(px, 1.2, pz); cg.add(leg);
    }
    const counterGlow = new THREE.Mesh(track(new THREE.BoxGeometry(1.25, 0.12, 2.2)), lampGlowMat); counterGlow.position.y = 2.12;
    cg.add(body, canopy, umbrella, counterGlow);
    group.add(cg);
    colliders.push({ minX: cx - 1.1, maxX: cx + 1.1, minZ: cz - 1.6, maxZ: cz + 1.6 });
  }

  return {
    group,
    colliders,
    getWalkHeight: getTktsWalkHeight,
    update: (timeSec: number, nightFactor: number) => {
      flagUniforms.uTime.value = timeSec;
      nyeBall.rotation.y = timeSec * 0.45;
      ballMat.emissiveIntensity = (1.5 + 1.0 * Math.sin(timeSec * 2.2)) * (0.45 + 0.75 * nightFactor);
      duffyUplight.intensity = 6 + 24 * nightFactor;

      const blink = Math.sin(timeSec * 3.1) > 0.15;
      for (const b of beaconMeshes) b.visible = blink && nightFactor > 0.25;

      const isGreen = (timeSec % 18) < 12;
      for (const g of nsGreenLights) g.visible = isGreen;
      for (const r of nsRedLights) r.visible = !isGreen;
      for (const w of walkSigns) w.material = isGreen ? walkWhiteMat : orangeHandMat;

      for (const p of steamPuffs) {
        const life = (timeSec * p.speed + p.phase) % 1;
        const y = 3.1 + life * 11.8;
        const driftX = life * 3.8 + Math.sin(timeSec * 1.1 + p.phase * 10) * 0.65;
        const driftZ = -life * 2.4 + Math.cos(timeSec * 0.9 + p.phase * 8) * 0.55;
        p.sprite.position.set(p.baseX + driftX, y, p.baseZ + driftZ);
        const sc = 1.5 + life * 6.8;
        p.sprite.scale.set(sc, sc, 1);
        (p.sprite.material as THREE.SpriteMaterial).opacity = Math.sin(life * Math.PI) * (0.24 + 0.18 * nightFactor);
      }
    },
    dispose: () => {
      for (const d of disposables) d.dispose();
    },
  };
}
