import * as THREE from 'three';

export interface ScreenLabelItem {
  id: string;
  text: string;
  /** Smaller second line (e.g. a distance). */
  sub?: string;
  world: THREE.Vector3;
  /** 'feature' = place name on a globe, 'sky' = an object in the sky. */
  kind?: 'feature' | 'sky';
  /** Optional category so deep-space probes/asteroids are suppressed when close to a surface. */
  category?: 'landmark' | 'body' | 'asteroid' | 'spacecraft' | 'deep-space';
}

/** Minimum vertical clearance reserved for the top navbar and bottom time deck. */
export const MIN_TOP_SAFE_PX = 72;
export const MIN_BOTTOM_SAFE_PX = 68;

interface SafeRect {
  l: number;
  t: number;
  r: number;
  b: number;
}

function isDeepSpaceNonBody(item: ScreenLabelItem): boolean {
  if (item.category === 'asteroid' || item.category === 'spacecraft' || item.category === 'deep-space') {
    return true;
  }
  const id = item.id.toLowerCase();
  return (
    id.startsWith('sc_') ||
    id.startsWith('spacecraft:') ||
    id.startsWith('asteroid:') ||
    id.startsWith('probe:') ||
    id.startsWith('deepspace:')
  );
}

/**
 * Lightweight HTML labels pinned to 3D points (place names on a globe, planets in the sky).
 * Updated every frame without React so they stay glued to the imagery while dragging.
 */
export class ScreenLabels {
  private root: HTMLDivElement;
  private nodes = new Map<string, HTMLButtonElement>();
  private tmp = new THREE.Vector3();
  private onClick: (id: string) => void;
  private surfaceProximity = false;
  private zones: SafeRect[] = [];
  private zonesAt = 0;
  private cachedTopSafe = MIN_TOP_SAFE_PX;
  private cachedBottomSafe = MIN_BOTTOM_SAFE_PX;

  private static readonly HUD_SELECTOR = [
    '.hud-root header',
    '.hud-root nav',
    '.hud-root footer',
    '.hud-root [data-tour="explorer"]',
    '.hud-root [aria-label="Surface view"]',
    '.hud-root [data-tour="plot"]',
    '.sol-landed-pill',
  ].join(', ');

  constructor(container: HTMLElement, onClick: (id: string) => void) {
    this.onClick = onClick;
    this.root = document.createElement('div');
    this.root.className = 'solaris-screen-labels';
    Object.assign(this.root.style, {
      position: 'absolute',
      inset: '0',
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: '15',
    } as CSSStyleDeclaration);
    container.appendChild(this.root);
  }

  /** Indicate whether the camera is landed or zoomed close onto a planetary surface. */
  public setSurfaceProximity(closeOrLanded: boolean): void {
    this.surfaceProximity = closeOrLanded;
  }

  private refreshSafeZones(): void {
    const now = typeof performance !== 'undefined' ? performance.now() : 0;
    if (now - this.zonesAt < 500 && this.zonesAt > 0) return;
    this.zonesAt = now;
    this.zones = [];
    this.cachedTopSafe = MIN_TOP_SAFE_PX;
    this.cachedBottomSafe = MIN_BOTTOM_SAFE_PX;

    if (typeof document === 'undefined' || typeof getComputedStyle === 'undefined') return;
    const rootStyle = getComputedStyle(document.documentElement);
    const headerVar = parseFloat(rootStyle.getPropertyValue('--hud-header-h'));
    if (Number.isFinite(headerVar) && headerVar > 0) {
      this.cachedTopSafe = Math.max(MIN_TOP_SAFE_PX, Math.ceil(headerVar) + 8);
    }
    const footerVar = parseFloat(rootStyle.getPropertyValue('--hud-footer-h'));
    if (Number.isFinite(footerVar) && footerVar > 0) {
      this.cachedBottomSafe = Math.max(MIN_BOTTOM_SAFE_PX, Math.ceil(footerVar) + 8);
    }

    if (typeof this.root.getBoundingClientRect !== 'function' || typeof document.querySelectorAll !== 'function') return;
    const host = this.root.getBoundingClientRect();
    document.querySelectorAll<HTMLElement>(ScreenLabels.HUD_SELECTOR).forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.05) return;
      const rect: SafeRect = {
        l: r.left - host.left - 6,
        t: r.top - host.top - 4,
        r: r.right - host.left + 6,
        b: r.bottom - host.top + 4,
      };
      this.zones.push(rect);
      if (el.tagName === 'HEADER') {
        this.cachedTopSafe = Math.max(this.cachedTopSafe, Math.ceil(rect.b) + 4);
      }
      if (el.tagName === 'FOOTER') {
        this.cachedBottomSafe = Math.max(this.cachedBottomSafe, Math.ceil(host.height - rect.t) + 4);
      }
    });
  }

  /**
   * Show `items` (anything not listed is hidden). Points behind the camera or inside the top
   * navbar / bottom footer safe zones are skipped. Earlier items win: a later sky label whose point
   * falls right on an earlier one merges into it ("Earth · Moon"), one that would overlap steps
   * below or above within the safe viewport, and one with no room left is hidden.
   */
  public update(items: ScreenLabelItem[], camera: THREE.Camera, width: number, height: number): void {
    this.refreshSafeZones();
    const topSafe = Math.max(MIN_TOP_SAFE_PX, this.cachedTopSafe);
    const bottomSafe = Math.max(MIN_BOTTOM_SAFE_PX, this.cachedBottomSafe);
    const minY = topSafe + 10;
    const maxY = Math.max(minY, height - bottomSafe - 10);

    // Suppress deep-space asteroid/probe labels whenever landed or zoomed close onto a planet surface
    const suppressDeepSpace =
      this.surfaceProximity ||
      items.some((it) => it.kind === 'feature' || it.id.startsWith('sky:'));

    const placed: Array<{ item: ScreenLabelItem; x: number; y: number; dy: number; text: string; sub: string; w: number; merged: boolean }> = [];
    const box = (p: { x: number; y: number; dy: number; w: number }): SafeRect => ({
      l: p.x - 6,
      r: p.x + p.w + 6,
      t: p.y + p.dy - 10,
      b: p.y + p.dy + 10,
    });
    const hit = (a: SafeRect, b: SafeRect) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
    const widthOf = (text: string, sub: string) => text.length * 7.2 + (sub ? sub.length * 5.8 + 8 : 0) + 14;

    for (const item of items) {
      if (suppressDeepSpace && isDeepSpaceNonBody(item)) continue;
      this.tmp.copy(item.world).project(camera);
      if (this.tmp.z > 1 || this.tmp.z < -1) continue;
      const x = (this.tmp.x * 0.5 + 0.5) * width;
      const y = (-this.tmp.y * 0.5 + 0.5) * height;
      // Strict top navbar (>= 72px) and viewport bounds enforcement
      if (x < 12 || x > width - 24 || y < minY || y > maxY) continue;

      // Practically the same point as a label already placed: say both names on one label
      const twin = item.kind === 'sky' ? placed.find((p) => !p.merged && Math.hypot(p.x - x, p.y - y) < 26) : undefined;
      if (twin) {
        twin.text = `${twin.text} · ${item.text}`;
        twin.sub = '';
        twin.w = widthOf(twin.text, '');
        continue;
      }
      const text = item.text;
      const sub = item.sub ?? '';
      const w = widthOf(text, sub);
      const spot = [0, 18, -18, 36]
        .map((dy) => ({ x, y, dy, w }))
        .find((c) => {
          const b = box(c);
          if (b.t < topSafe || b.b > height - bottomSafe || b.r > width - 8 || b.l < 8) return false;
          if (this.zones.some((z) => hit(b, z))) return false;
          return !placed.some((p) => hit(b, box(p)));
        });
      if (!spot) continue;
      placed.push({ item, x, y, dy: spot.dy, text, sub, w, merged: false });
    }
    const seen = new Set<string>();
    for (const p of placed) {
      seen.add(p.item.id);
      let node = this.nodes.get(p.item.id);
      if (!node) {
        node = this.createNode(p.item);
        this.nodes.set(p.item.id, node);
      }
      const label = node.firstChild!.nextSibling as HTMLSpanElement;
      if (label.textContent !== p.text) label.textContent = p.text;
      const sub = label.nextSibling as HTMLSpanElement;
      if (sub.textContent !== p.sub) sub.textContent = p.sub;
      node.style.transform = `translate(${p.x.toFixed(1)}px, ${(p.y + p.dy).toFixed(1)}px)`;
      node.style.display = 'flex';
    }
    for (const [id, node] of this.nodes) {
      if (!seen.has(id)) node.style.display = 'none';
    }
  }

  public clear(): void {
    for (const node of this.nodes.values()) node.style.display = 'none';
  }

  private createNode(item: ScreenLabelItem): HTMLButtonElement {
    const node = document.createElement('button');
    node.type = 'button';
    node.setAttribute('aria-label', item.text);
    const isSky = item.kind === 'sky';
    Object.assign(node.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginLeft: '-4px',
      marginTop: '-10px',
      padding: isSky ? '1px 5px' : '2px 8px 2px 5px',
      borderRadius: '999px',
      background: isSky ? 'rgba(4, 6, 12, 0.42)' : 'rgba(5, 8, 14, 0.58)',
      border: isSky ? '1px solid rgba(255, 236, 200, 0.14)' : '1px solid rgba(255, 255, 255, 0.16)',
      backdropFilter: 'blur(4px)',
      cursor: 'pointer',
      pointerEvents: 'auto',
      color: isSky ? 'rgba(255,236,200,0.95)' : 'rgba(255,255,255,0.96)',
      font: '500 11.5px/1.15 Inter, system-ui, sans-serif',
      letterSpacing: '0.02em',
      textShadow: '0 1px 4px rgba(0,0,0,0.9)',
      whiteSpace: 'nowrap',
      willChange: 'transform',
    } as CSSStyleDeclaration);
    const dot = document.createElement('span');
    Object.assign(dot.style, {
      width: isSky ? '0' : '6px',
      height: isSky ? '0' : '6px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.95)',
      boxShadow: '0 0 0 1.5px rgba(0,0,0,0.6)',
      flex: 'none',
    } as CSSStyleDeclaration);
    const text = document.createElement('span');
    const sub = document.createElement('span');
    Object.assign(sub.style, { fontSize: '10px', opacity: '0.72', fontWeight: '400' } as CSSStyleDeclaration);
    node.append(dot, text, sub);
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      this.onClick(item.id);
    });
    // Do not start a globe drag from a label
    node.addEventListener('mousedown', (e) => e.stopPropagation());
    this.root.appendChild(node);
    return node;
  }

  public dispose(): void {
    this.root.remove();
    this.nodes.clear();
  }
}
