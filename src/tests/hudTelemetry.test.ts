import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as THREE from 'three';
import {
  createDefaultJetTelemetry,
  createDefaultMfdPages,
  createJetSurfaceState,
} from '../flight/JetTelemetry';
import { describePlace, drawTactical, resetTactical } from '../flight/TacticalHud';
import { HudGlass } from '../flight/HudGlass';
import { MfdDisplays } from '../flight/MfdDisplays';

function createMockCtx() {
  const calls: Array<{ fn: string; args: unknown[] }> = [];
  const shadowBlurs: number[] = [];
  let shadowBlurVal = 0;

  const grad = { addColorStop: () => {} };
  const target: Record<string, unknown> = {
    canvas: null,
    fillStyle: '#000',
    strokeStyle: '#000',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    lineDashOffset: 0,
    font: '12px monospace',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    letterSpacing: '0px',
    globalAlpha: 1,
    shadowColor: 'transparent',
    setLineDash: () => {},
    measureText: (txt: string) => ({ width: String(txt).length * 7 }),
    createLinearGradient: () => grad,
    createRadialGradient: () => grad,
    getImageData: (_x: number, _y: number, w: number, h: number) => ({
      data: new Uint8ClampedArray(Math.max(1, Math.round(w) * Math.round(h) * 4)),
    }),
    fillText: (text: string, x: number, y: number) => {
      calls.push({ fn: 'fillText', args: [text, x, y] });
    },
  };

  Object.defineProperty(target, 'shadowBlur', {
    get: () => shadowBlurVal,
    set: (v: number) => {
      shadowBlurVal = v;
      shadowBlurs.push(v);
    },
  });

  const ctx = new Proxy(target, {
    get(obj, prop) {
      if (prop in obj) return obj[prop as string];
      return (...args: unknown[]) => {
        calls.push({ fn: String(prop), args });
      };
    },
  }) as unknown as CanvasRenderingContext2D;

  return { ctx, calls, shadowBlurs };
}

function installMockCanvas(ctx: CanvasRenderingContext2D) {
  const prevDoc = (globalThis as { document?: unknown }).document;
  (globalThis as { document?: unknown }).document = {
    createElement: (tag: string) => {
      if (tag !== 'canvas') return {};
      return {
        width: 512,
        height: 576,
        style: {},
        getContext: () => ctx,
      };
    },
  };
  return () => {
    (globalThis as { document?: unknown }).document = prevDoc;
  };
}

describe('JetTelemetry defaults & HUD instrumentation', () => {
  let restoreDoc: (() => void) | null = null;

  beforeEach(() => {
    resetTactical();
  });

  afterEach(() => {
    restoreDoc?.();
    restoreDoc = null;
  });

  it('creates clean default telemetry and surface states', () => {
    const t = createDefaultJetTelemetry();
    const s = createJetSurfaceState();
    const pages = createDefaultMfdPages();
    expect(t.fbwMode).toBe('norm');
    expect(t.flapMode).toBe('auto');
    expect(s.nozzleIris).toBeCloseTo(0.25);
    expect(pages).toEqual({ left: 'NAV', centre: 'PFD', right: 'ENG' });
  });

  it('draws TacticalHud with partial and full Phase 2 telemetry using zero shadowBlur', () => {
    const { ctx, calls, shadowBlurs } = createMockCtx();
    const t = createDefaultJetTelemetry({
      active: true,
      speedMps: 310,
      iasMps: 265,
      tasMps: 310,
      mach: 1.05,
      altKm: 6.4,
      airDensity: 0.63,
      aoaDeg: 12.1,
      twRatio: 1.18,
      specificExcessPowerMps: 84,
      fbwMode: 'high-g',
      flapMode: 'combat',
      airbrakeActive: true,
      supercruise: true,
      spinWarning: false,
      maneuver: 'high-g-drift',
      lat: 40.75,
      lon: -73.98,
    });
    const place = describePlace(t, { title: 'MANHATTAN', subtitle: 'New York' });
    expect(place.tag).toBe('LOC');

    drawTactical(ctx, t, { title: 'MANHATTAN', subtitle: 'New York' }, 20);
    expect(Math.max(0, ...shadowBlurs)).toBe(0);
    const texts = calls.filter((c) => c.fn === 'fillText').map((c) => String(c.args[0]));
    expect(texts.some((s) => s.includes('T/W 1.18'))).toBe(true);
    expect(texts.some((s) => s.includes('SUPERCRUISE'))).toBe(true);
  });

  it('renders HudGlass with gear E-bracket, Cobra FPM clamp, headOffset parallax, and zero shadowBlur', () => {
    const { ctx, calls, shadowBlurs } = createMockCtx();
    restoreDoc = installMockCanvas(ctx);
    const glass = new HudGlass(
      new THREE.Vector3(0, 0.3, -0.7),
      new THREE.Vector3(0, 0.3, -0.15),
      0.24,
    );
    const t = createDefaultJetTelemetry({
      active: true,
      speedMps: 145,
      iasMps: 145,
      airDensity: 1.22,
      aoaDeg: 78,
      aosDeg: 6,
      gearDown: true,
      fbwMode: 'psm',
      tvcActive: true,
      maneuver: 'cobra',
      headOffset: { x: 0.015, y: -0.01, z: 0.02 },
      twRatio: 1.08,
      specificExcessPowerMps: -24,
      fuelFrac: 0.72,
    });
    glass.update(t, true);
    expect(Math.max(0, ...shadowBlurs)).toBe(0);
    const texts = calls.filter((c) => c.fn === 'fillText').map((c) => String(c.args[0]));
    expect(texts.some((s) => s.includes('FBW PSM'))).toBe(true);
    expect(texts.some((s) => s.includes('SLOW'))).toBe(true);
    expect(texts.some((s) => s.includes('FUEL 72%'))).toBe(true);
    glass.dispose();
  });

  it('switches MfdDisplays pages cleanly via bezel UV tabs & slot cycling with zero shadowBlur', () => {
    const { ctx, shadowBlurs } = createMockCtx();
    restoreDoc = installMockCanvas(ctx);
    const mfd = new MfdDisplays();
    expect(mfd.getPages()).toEqual({ left: 'NAV', centre: 'PFD', right: 'ENG' });

    // Click centre bezel tab #1 ('FCS') -> centre slot x:[66..450], y:[520..1020]
    // Canvas y near 1005 -> v = 1 - 1005/1024 ≈ 0.0185, x for tab idx 1 ('FCS') ≈ (66 + 384*0.35)/1024 ≈ 0.195
    expect(mfd.handleUvClick(0.195, 0.0185)).toBe(true);
    expect(mfd.getPages().centre).toBe('FCS');

    // Click right body (non-tab area) -> cycles ENG -> NAV
    expect(mfd.handleUvClick(0.7, 0.25)).toBe(true);
    expect(mfd.getPages().right).toBe('NAV');

    // Update draws all 3 slots without any shadowBlur
    mfd.update(
      createDefaultJetTelemetry({
        active: true,
        airframeId: 'su30',
        airframeName: 'SU-30MKK',
        fbwMode: 'psm',
        tvcActive: true,
        surfaces: createJetSurfaceState(),
      }),
      1.0,
    );
    expect(Math.max(0, ...shadowBlurs)).toBe(0);
    mfd.dispose();
  });
});
