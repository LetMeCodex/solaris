import { afterEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { CameraRig } from '../navigation/CameraRig';
import { ExplorerBody, PlanetaryExplorer } from '../explorer/PlanetaryExplorer';
import { BODY_IMAGERY } from '../explorer/ImageryRegistry';
import { PlanetElevation } from '../explorer/PlanetElevation';
import { SurfaceTileLayer, TileImageLoader } from '../explorer/SurfaceTileLayer';
import { ProceduralCity } from '../explorer/ProceduralCity';
import { PhotorealEarth } from '../rendering/PhotorealEarth';

function makeDomElement(): HTMLDivElement {
  return {
    clientWidth: 1920,
    clientHeight: 1080,
    addEventListener: () => {},
    removeEventListener: () => {},
  } as unknown as HTMLDivElement;
}

describe('PlanetaryExplorer and CameraRig 1x 60 Hz co-rotation', () => {
  it('accumulates sub-microradian 60 Hz Earth spin without dropping delta.w near 1', () => {
    const rig = new CameraRig(makeDomElement());
    const bodyGroup = new THREE.Group();
    const surfaceMesh = new THREE.Mesh();
    bodyGroup.add(surfaceMesh);
    const body: ExplorerBody = {
      name: 'Earth',
      bodyGroup,
      surfaceMesh,
      visualRadius: 2.4,
      radiusKm: 6371,
    };
    const cam = new THREE.PerspectiveCamera(45, 16 / 9, 0.0001, 100);
    const rigPriv = rig as unknown as {
      spherical: THREE.Spherical;
      targetSpherical: THREE.Spherical;
      transition: { targetTheta: number; onComplete?: () => void } | null;
    };
    // Stand near Manhattan (~1.8 km altitude => ~1.00028 radii)
    cam.position.set(2.4007, 0, 0);
    rig.focusCinematic(surfaceMesh, 2.4, 'Earth', 0);
    rig.update();
    rigPriv.spherical.set(2.4007, Math.PI / 2, 0.5);
    rigPriv.targetSpherical.copy(rigPriv.spherical);

    const dummyLoader: TileImageLoader = {
      load: () => ({} as HTMLImageElement),
    };
    const explorer = new PlanetaryExplorer(rig, (name) => (name === 'Earth' ? body : null), dummyLoader);
    explorer.hideGround = true;

    // 1x sidereal Earth rotation at 60 Hz: dTheta = 7.2921e-5 / 60 rad/frame (~1.215e-6 rad, 1 - |w| ~ 1.8e-13)
    const dTheta = 7.2921e-5 / 60;
    const frames = 120; // 2 seconds
    explorer.update('Earth', cam, 1080);
    const startTheta = rigPriv.spherical.theta;

    for (let i = 0; i < frames; i++) {
      surfaceMesh.rotation.y += dTheta;
      bodyGroup.updateMatrixWorld(true);
      explorer.update('Earth', cam, 1080);
    }

    const expectedDelta = frames * dTheta;
    expect(rigPriv.spherical.theta - startTheta).toBeCloseTo(expectedDelta, 6);
  });

  it('rotates an active focusSurfacePoint transition target alongside the planet', () => {
    const rig = new CameraRig(makeDomElement());
    const rigPriv = rig as unknown as {
      spherical: THREE.Spherical;
      targetSpherical: THREE.Spherical;
      transition: { targetTheta: number; onComplete?: () => void } | null;
    };
    const surfaceMesh = new THREE.Mesh();
    surfaceMesh.updateMatrixWorld(true);

    // Position the camera at theta = 0, equator (phi = pi/2), radius 2.41
    rig.focusCinematic(surfaceMesh, 2.4, 'Earth', 0);
    rigPriv.spherical.set(2.41, Math.PI / 2, 0);
    rigPriv.targetSpherical.copy(rigPriv.spherical);

    // Fly towards equator at +Z (worldDir = (0, 0, 1) -> theta = 0)
    rig.focusSurfacePoint(surfaceMesh, 2.4, new THREE.Vector3(0, 0, 1), 0.002, 2200);
    expect(rigPriv.transition).not.toBeNull();

    const stepRot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.05);
    rig.applyFrameRotation(stepRot);
    expect(rigPriv.transition!.targetTheta).toBeCloseTo(0.05, 5);

    rigPriv.transition!.onComplete?.();
    expect(rigPriv.spherical.theta).toBeCloseTo(0.05, 5);
    expect(rigPriv.targetSpherical.theta).toBeCloseTo(0.05, 5);
  });
});

describe('PhotorealEarth detailedTilesVisible metric', () => {
  it('counts city leaf tiles around geometricError 32.1 as detailed while excluding coarse tiles', () => {
    const mockEarth = Object.create(PhotorealEarth.prototype) as PhotorealEarth;
    Object.defineProperty(mockEarth, 'showing', { value: true, configurable: true });
    Object.assign(mockEarth as unknown as Record<string, unknown>, {
      tiles: {
        visibleTiles: new Set([
          { geometricError: 4109 },
          { geometricError: 1027 },
          { geometricError: 32.1 },
          { geometricError: 16.05 },
        ]),
      },
    });
    expect(mockEarth.detailedTilesVisible).toBe(2);
  });
});

describe('SurfaceTileLayer validation and hybrid fallback routing', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('rejects corrupt/truncated HTMLImageElements via createImageBitmap before GPU upload and falls back per tile', async () => {
    class FakeHTMLImageElement {
      public complete = true;
      public naturalWidth = 512;
      public naturalHeight = 512;
      public width = 512;
      public height = 512;
      public onload: (() => void) | null = null;
      public onerror: (() => void) | null = null;
      constructor(public src: string) {}
    }

    const requested: string[] = [];
    const pending: Array<{ url: string; finish: () => void }> = [];
    const loader: TileImageLoader = {
      load(url, onLoad) {
        requested.push(url);
        const img = new FakeHTMLImageElement(url) as unknown as HTMLImageElement;
        pending.push({ url, finish: () => onLoad(img) });
        return img;
      },
    };

    const closed = vi.fn();
    vi.stubGlobal('HTMLImageElement', FakeHTMLImageElement);
    vi.stubGlobal('createImageBitmap', (img: { src: string }) => {
      if (img.src.includes('primary') && img.src.includes('/5/')) {
        return Promise.reject(new Error('InvalidStateError: truncated PNG'));
      }
      return Promise.resolve({ close: closed });
    });

    const grid = { tileSize: 256, level0TileDeg: 180, minLevel: 0, maxLevel: 7 };
    const layer = new SurfaceTileLayer(
      {
        ...grid,
        kind: 'wmts',
        template: 'https://primary.invalid/{z}/{y}/{x}.png',
        minLevel: 5,
        maxLevel: 12,
        fallback: {
          ...grid,
          kind: 'wmts',
          template: 'https://fallback.example/{z}/{y}/{x}.jpg',
          maxLevel: 7,
        },
      },
      loader
    );

    const cam = { position: [1.04, 0, 0] as [number, number, number], pixelsPerRadian: 1400 };
    layer.update(cam);

    // Coarse z < 5 ancestors queue first and route straight to fallback.
    expect(requested.some((u) => u.startsWith('https://fallback.example/') && /\/[0-4]\//.test(u))).toBe(true);

    // Drain initial fallback + primary loads and flush createImageBitmap microtasks.
    for (let round = 0; round < 8; round++) {
      for (const item of pending.splice(0)) item.finish();
      await Promise.resolve();
      await Promise.resolve();
    }

    // Primary z=5 requests fired, rejected via createImageBitmap, and fell back to fallback.example/5/...
    expect(requested.some((u) => u.startsWith('https://primary.invalid/5/'))).toBe(true);
    expect(requested.some((u) => u.startsWith('https://fallback.example/5/'))).toBe(true);
    expect(closed).toHaveBeenCalled();
    layer.update(cam);
    expect(layer.getStatus().cached).toBeGreaterThan(0);
    expect(layer.getStatus().failures).toBe(0);
    layer.dispose();
  });

  it('steps Mars MDEM200M elevation down past skipped CORS-500 zoom levels (z=3, z=4 -> z=2)', async () => {
    const marsDem = BODY_IMAGERY.Mars.provider!;
    expect(marsDem.minLevel).toBe(5);
    expect(marsDem.fallback?.maxLevel).toBe(7);

    const elevation = new PlanetElevation(
      'Mars-test',
      [
        {
          url: (z, y, x) => `mock://${z}/${y}/${x}`,
          format: 'lerc1',
          tileSize: 512,
          maxZ: 7,
          south: -90,
          north: 90,
          skipZ: [3, 4],
        },
      ],
      8.3
    );
    const fetchedUrls: string[] = [];
    const priv = elevation as unknown as {
      fetchTileOnce: (layer: unknown, url: string) => Promise<{ heights: Float32Array; w: number; h: number }>;
    };
    vi.spyOn(priv, 'fetchTileOnce').mockImplementation(async (_layer, url) => {
      fetchedUrls.push(url);
      return { heights: new Float32Array([1, 1, 1, 1]), w: 2, h: 2 };
    });

    await elevation.ensure(10, 10, 12, 12, 4);
    expect(fetchedUrls.some((u) => u.startsWith('mock://3/') || u.startsWith('mock://4/'))).toBe(false);
    expect(fetchedUrls.some((u) => u.startsWith('mock://2/'))).toBe(true);
    expect(elevation.heightKm(11, 11, 4)).toBeCloseTo(9.3, 4);
  });
});

describe('ProceduralCity 3D iconic skylines and landmarks', () => {
  it('recognizes Manhattan, San Francisco, Paris, and major metros and builds terrain-snapped 3D landmark meshes immediately', () => {
    expect(ProceduralCity.regionAt(40.7484, -73.9857)?.name).toBe('New York');
    expect(ProceduralCity.regionAt(37.8199, -122.4783)?.name).toBe('San Francisco');
    expect(ProceduralCity.regionAt(48.8584, 2.2945)?.name).toBe('Paris');

    const prevCurrent = PhotorealEarth.current;
    PhotorealEarth.current = null;
    try {
      const surface = new THREE.Mesh();
      surface.updateMatrixWorld(true);
      const camPos = new THREE.Vector3(0, 0, 2.5);
      const city = new ProceduralCity();
      city.dataGroundKm = () => 0.04;

      for (const [lat, lon, expectedMeshName] of [
        [37.8199, -122.4783, 'hero_city_san_francisco'],
        [40.7484, -73.9857, 'hero_city_new_york'],
        [48.8584, 2.2945, 'hero_city_paris'],
      ] as const) {
        city.update(surface, camPos, lat, lon, 1.5, 2654);
        expect(city.group.visible).toBe(true);
        const hero = city.group.getObjectByName(expectedMeshName) as THREE.Mesh | undefined;
        expect(hero).toBeDefined();
        expect(hero!.visible).toBe(true);
        const pos = hero!.geometry.attributes.position as THREE.BufferAttribute;
        const nor = hero!.geometry.attributes.normal as THREE.BufferAttribute;
        expect(pos.count).toBeGreaterThan(500);
        expect([...pos.array].every(Number.isFinite)).toBe(true);
        expect([...nor.array].every(Number.isFinite)).toBe(true);
        // Anchor sits at exact 1.0 + 0.04 / 6371 (no +637m floating offset)
        expect(Math.abs(hero!.position.length() - (1 + 0.04 / 6371)) * 6371_000).toBeLessThan(1.0);
      }

      // When Google Photorealistic 3D Tiles are actively showing, photorealFallbackOnly metros hide automatically
      PhotorealEarth.current = { showing: true } as unknown as PhotorealEarth;
      city.update(surface, camPos, 40.7484, -73.9857, 1.5, 2654);
      expect(city.group.visible).toBe(false);
      city.dispose();
    } finally {
      PhotorealEarth.current = prevCurrent;
    }
  });
});
