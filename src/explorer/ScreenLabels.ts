import * as THREE from 'three';

export interface ScreenLabelItem {
  id: string;
  text: string;
  /** Smaller second line (e.g. a distance). */
  sub?: string;
  world: THREE.Vector3;
  /** 'feature' = place name on a globe, 'sky' = an object in the sky. */
  kind?: 'feature' | 'sky';
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

  /**
   * Show `items` (anything not listed is hidden). Points behind the camera are skipped. Earlier
   * items win: a later label whose point falls right on an earlier one merges into it ("Earth ·
   * Moon"), one that would overlap steps below or above, and one with no room left is hidden.
   */
  public update(items: ScreenLabelItem[], camera: THREE.Camera, width: number, height: number): void {
    const placed: Array<{ item: ScreenLabelItem; x: number; y: number; dy: number; text: string; sub: string; w: number; merged: boolean }> = [];
    const box = (p: { x: number; y: number; dy: number; w: number }) => ({ l: p.x - 4, r: p.x + p.w, t: p.y + p.dy - 9, b: p.y + p.dy + 9 });
    const hit = (a: ReturnType<typeof box>, b: ReturnType<typeof box>) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
    const widthOf = (text: string, sub: string) => text.length * 7 + (sub ? sub.length * 5.6 + 6 : 0) + 6;
    for (const item of items) {
      this.tmp.copy(item.world).project(camera);
      if (this.tmp.z > 1 || this.tmp.z < -1) continue;
      const x = (this.tmp.x * 0.5 + 0.5) * width;
      const y = (-this.tmp.y * 0.5 + 0.5) * height;
      if (x < -50 || y < -20 || x > width + 50 || y > height + 20) continue;
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
      const spot = [0, 16, -16, 32].map((dy) => ({ x, y, dy, w })).find((c) => !placed.some((p) => hit(box(c), box(p))));
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
    Object.assign(node.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginLeft: '-4px',
      marginTop: '-4px',
      padding: '0',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      pointerEvents: 'auto',
      color: item.kind === 'sky' ? 'rgba(255,236,200,0.92)' : 'rgba(255,255,255,0.95)',
      font: '500 12px/1.1 Inter, system-ui, sans-serif',
      letterSpacing: '0.02em',
      textShadow: '0 0 3px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.75)',
      whiteSpace: 'nowrap',
      willChange: 'transform',
    } as CSSStyleDeclaration);
    const dot = document.createElement('span');
    Object.assign(dot.style, {
      width: item.kind === 'sky' ? '0' : '7px',
      height: item.kind === 'sky' ? '0' : '7px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.95)',
      boxShadow: '0 0 0 1.5px rgba(0,0,0,0.6)',
      flex: 'none',
    } as CSSStyleDeclaration);
    const text = document.createElement('span');
    const sub = document.createElement('span');
    Object.assign(sub.style, { fontSize: '10px', opacity: '0.65', fontWeight: '400' } as CSSStyleDeclaration);
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
