import * as THREE from 'three';
import { CelestialBodyDefinition } from '../types/catalogue';

export interface MarkerBody {
  definition: CelestialBodyDefinition;
  object: THREE.Object3D;
  /** Globe radius, render units. */
  radius: number;
}

interface Placed {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/**
 * Markers for worlds too small to see. At true scale a planet seen from across the system is a
 * fraction of a pixel, exactly as through a real camera; this layer pins a small ring and a name
 * to each one (as NASA's Eyes does) so it can be found and clicked. A marker fades away as soon
 * as the globe itself is big enough to see.
 *
 * Moons are only marked near their planet, and labels that would overlap a more important one
 * are dropped, so the system view stays clean while hundreds of moons are tracked.
 */
export class BodyMarkers {
  private root: HTMLDivElement;
  private pool: HTMLButtonElement[] = [];
  private used = 0;
  private onPick: (name: string) => void;
  private tmp = new THREE.Vector3();
  private tmpParent = new THREE.Vector3();
  private camPos = new THREE.Vector3();
  private static readonly MAX = 70;

  constructor(container: HTMLElement, onPick: (name: string) => void) {
    this.onPick = onPick;
    this.root = document.createElement('div');
    this.root.className = 'sol-markers';
    container.appendChild(this.root);
  }

  private node(): HTMLButtonElement {
    let n = this.pool[this.used];
    if (!n) {
      n = document.createElement('button');
      n.className = 'sol-marker';
      n.type = 'button';
      n.innerHTML = '<i></i><span></span>';
      n.addEventListener('click', (e) => {
        e.stopPropagation();
        const name = n!.dataset.name;
        if (name) this.onPick(name);
      });
      this.root.appendChild(n);
      this.pool.push(n);
    }
    this.used++;
    return n;
  }

  public setVisible(v: boolean): void {
    this.root.style.display = v ? '' : 'none';
  }

  /**
   * @param project scene point → CSS pixel position on screen (handles the lens warp), or null if
   *   it is behind the camera or off screen
   */
  public update(
    bodies: MarkerBody[],
    camera: THREE.PerspectiveCamera,
    focused: string | null,
    height: number,
    project: (world: THREE.Vector3) => { x: number; y: number } | null
  ): void {
    this.used = 0;
    camera.getWorldPosition(this.camPos);
    const pxPerRad = height / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const focusedDef = bodies.find((b) => b.definition.name === focused)?.definition;
    const focusSystem = focusedDef?.category === 'moon' ? focusedDef.parentName : focused;

    type Cand = { b: MarkerBody; x: number; y: number; prio: number; alpha: number; label: boolean };
    const cands: Cand[] = [];
    const parents = new Map<string, MarkerBody>();
    for (const b of bodies) if (b.definition.category !== 'moon') parents.set(b.definition.name, b);

    for (const b of bodies) {
      const def = b.definition;
      if (def.category === 'star') continue;
      b.object.getWorldPosition(this.tmp);
      const dist = this.tmp.distanceTo(this.camPos);
      const globePx = (b.radius / Math.max(1e-9, dist)) * pxPerRad;
      // The globe is visible: no marker needed
      const alpha = 1 - THREE.MathUtils.smoothstep(globePx, 2.5, 7);
      if (alpha <= 0.02) continue;

      let prio = def.category === 'planet' ? 100 : def.category === 'dwarf_planet' ? 70 : def.category === 'asteroid' ? 30 : 0;
      // Bigger worlds win a crowded spot (Jupiter over Mercury in the whole-system view)
      if (def.category !== 'moon') prio += Math.log10(def.physical.meanRadiusKm + 1) * 6;
      if (def.category === 'moon') {
        const parent = def.parentName ? parents.get(def.parentName) : undefined;
        if (!parent) continue;
        parent.object.getWorldPosition(this.tmpParent);
        // Only near their planet: within ~40 orbits' worth of distance (minor moons: 12)
        const orbit = this.tmp.distanceTo(this.tmpParent);
        const reach = orbit * (def.minor ? 12 : 40);
        if (this.tmpParent.distanceTo(this.camPos) > reach && focusSystem !== def.parentName && focused !== def.name) continue;
        prio = (def.minor ? 10 : 50) + Math.log10(def.physical.meanRadiusKm + 1) * 4;
        // Nearer (relative to its orbit) ranks higher: the moons around you, not the far irregulars
        if (def.minor) prio += 6 * Math.max(-2, 1 - Math.log10(Math.max(1e-6, dist / Math.max(1e-6, orbit))));
        if (def.parentName === focusSystem) prio += 15;
      }
      if (def.name === focused) prio += 200;
      const p = project(this.tmp);
      if (!p) continue;
      cands.push({ b, x: p.x, y: p.y, prio, alpha, label: true });
    }

    // Declutter: most important first; drop markers sitting on top of a placed one, and never
    // draw one over the interface (header, world list, time bar, panels)
    cands.sort((a, b) => b.prio - a.prio);
    const placed: Placed[] = [...this.hudZones()];
    let minor = 0;
    for (const c of cands) {
      if (this.used >= BodyMarkers.MAX) break;
      // A few small moons at a time, or hundreds of names would carpet the sky
      if (c.b.definition.minor && c.b.definition.name !== focused && ++minor > 14) continue;
      // The marker's footprint: the ring plus its name to the right
      const def0 = c.b.definition;
      const charW = def0.category === 'moon' ? 6.4 : 7.2;
      const box = { x0: c.x - 7, y0: c.y - 7, x1: c.x + 12 + def0.name.length * charW, y1: c.y + 7 };
      let crowded = false;
      for (const p of placed) {
        if (box.x0 < p.x1 && box.x1 > p.x0 && box.y0 < p.y1 && box.y1 > p.y0) {
          crowded = true;
          break;
        }
      }
      if (crowded) continue;
      placed.push(box);
      const n = this.node();
      const def = c.b.definition;
      if (n.dataset.name !== def.name) {
        n.dataset.name = def.name;
        (n.lastChild as HTMLSpanElement).textContent = def.name;
        n.style.setProperty('--c', def.physical.colorHex || '#cfd8d4');
        n.setAttribute('aria-label', `Fly to ${def.name}`);
        n.className = `sol-marker is-${def.category}${def.minor ? ' is-minor' : ''}`;
      }
      n.classList.toggle('is-focus', def.name === focused);
      n.style.opacity = c.alpha.toFixed(2);
      n.style.transform = `translate(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px)`;
      n.style.display = '';
    }
    for (let i = this.used; i < this.pool.length; i++) {
      if (this.pool[i].style.display !== 'none') {
        this.pool[i].style.display = 'none';
        this.pool[i].dataset.name = '';
      }
    }
  }

  private zones: Placed[] = [];
  private zonesAt = 0;

  /** Screen boxes of the interface panels (re-read twice a second; they rarely move). */
  private hudZones(): Placed[] {
    const now = performance.now();
    if (now - this.zonesAt < 500) return this.zones;
    this.zonesAt = now;
    const host = this.root.getBoundingClientRect();
    this.zones = [];
    document.querySelectorAll<HTMLElement>(BodyMarkers.HUD_SELECTOR).forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || getComputedStyle(el).visibility === 'hidden') return;
      this.zones.push({ x0: r.left - host.left - 6, y0: r.top - host.top - 4, x1: r.right - host.left + 6, y1: r.bottom - host.top + 4 });
    });
    return this.zones;
  }

  /** Interface panels markers must stay clear of. */
  public static readonly HUD_SELECTOR = [
    '.hud-root header > *',
    '.hud-root nav',
    '.hud-root footer',
    '.hud-root [data-tour="plot"]',
    '.hud-root .hud-frame',
    '.vela-orb',
    '.vela-dialog',
    '.neb-visit',
  ].join(', ');

  public dispose(): void {
    this.root.remove();
  }
}
