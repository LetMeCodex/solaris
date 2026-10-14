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

  /** Show `items` (anything not listed is hidden). Points behind the camera are skipped. */
  public update(items: ScreenLabelItem[], camera: THREE.Camera, width: number, height: number): void {
    const seen = new Set<string>();
    for (const item of items) {
      this.tmp.copy(item.world).project(camera);
      if (this.tmp.z > 1 || this.tmp.z < -1) continue;
      const x = (this.tmp.x * 0.5 + 0.5) * width;
      const y = (-this.tmp.y * 0.5 + 0.5) * height;
      if (x < -50 || y < -20 || x > width + 50 || y > height + 20) continue;
      seen.add(item.id);
      let node = this.nodes.get(item.id);
      if (!node) {
        node = this.createNode(item);
        this.nodes.set(item.id, node);
      }
      const label = node.firstChild!.nextSibling as HTMLSpanElement;
      if (label.textContent !== item.text) label.textContent = item.text;
      const sub = label.nextSibling as HTMLSpanElement;
      const subText = item.sub ?? '';
      if (sub.textContent !== subText) sub.textContent = subText;
      node.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
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
