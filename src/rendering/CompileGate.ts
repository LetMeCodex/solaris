import * as THREE from 'three';

/**
 * Nothing is drawn before it is on the GPU: its shaders compiled and its images uploaded.
 *
 * WebGL compiles a shader on first draw and the page waits for it: measured on the fly page,
 * ~120 programs (the jet, the 3D tiles, the cockpit, the cloud and lens passes) froze it for
 * 0.3-0.9 s at a time, and a big image uploaded inside a draw did the same (the jet's 4K maps, the
 * worlds' 8K ones). Here new things are found before each draw and asked for without waiting on
 * them: shaders created with `renderer.compile` (the driver compiles them on its own threads,
 * KHR_parallel_shader_compile, and `isReady()` says when), images uploaded a few milliseconds'
 * worth a frame. Until something is ready:
 *
 *  - 'hold' (behind a loading screen): the draw is skipped;
 *  - 'hide' (live): just that thing is left out of the draw (it appears a few frames later)
 *    instead of the whole page freezing. A full-screen pass cannot be left out: it is drawn.
 *
 * Also covered: the shadow map's depth shader for each new shadow caster, a scene's override
 * material (the cockpit's ambient-occlusion normals), and hidden objects (their shaders compile in
 * the background, so the cockpit's parts are ready before you first look at them).
 *
 * Only new things are prepared (a tile streaming in, the jet): preparing every material for every
 * draw cost ~20 ms a draw on the full scene. Only outermost draws are gated: compile() resets the
 * renderer's state, which a draw in progress needs.
 */
export type GateMode = 'off' | 'hold' | 'hide';

export interface CompileGate {
  mode: GateMode;
  /** Draws skipped ('hold') and objects left out of a draw ('hide') so far (diagnostics). */
  readonly skips: number;
  readonly hidden: number;
  /** Call once a frame before drawing: the frame's allowance for uploading images. */
  beginFrame(uploadBudgetMs?: number): void;
}

type ProgramLike = { isReady(): boolean };
type Known = WeakMap<object, number>;

export function installCompileGate(renderer: THREE.WebGLRenderer): CompileGate {
  const r = renderer;
  const draw = r.render.bind(r);
  // Without the extension a program reports ready at once: nothing is ever held back
  const parallel = r.extensions.has('KHR_parallel_shader_compile');
  const state = { mode: 'off' as GateMode, skips: 0, hidden: 0, depth: 0, uploadUntil: 0, uploads: 0 };

  // What a scene (or an override material) has had prepared, and at which version: a material
  // changed since (a reflection map assigned, a define switched) needs a new program. A scene's
  // programs also depend on its environment and fog and on whether it is drawn to the screen or
  // into a target (tone mapping, colour space): a change there starts it afresh
  const knownMaterials = new WeakMap<object, Known>();
  const compiledHidden = new WeakMap<object, Known>();
  const knownObjects = new WeakMap<object, Known>();
  const knownCasters = new WeakMap<object, Known>();
  const signature = new WeakMap<object, string>();
  const ids = new WeakMap<object, number>();
  let nextId = 1;
  const idOf = (o: object | null | undefined): number => {
    if (!o) return 0;
    let id = ids.get(o);
    if (id === undefined) ids.set(o, (id = nextId++));
    return id;
  };
  const setFor = (map: WeakMap<object, Known>, key: object, sig: string): Known => {
    let s = map.get(key);
    if (!s || signature.get(s) !== sig) {
      map.set(key, (s = new WeakMap()));
      signature.set(s, sig);
    }
    return s;
  };

  // compile() walks its first argument for materials: handed just these objects this way
  let batch: THREE.Object3D[] = [];
  const subset = {
    traverse: (cb: (o: THREE.Object3D) => void) => batch.forEach(cb),
    traverseVisible: (cb: (o: THREE.Object3D) => void) => batch.forEach(cb),
  } as unknown as THREE.Scene;
  const compileObjects = (objects: THREE.Object3D[], scene: THREE.Scene, camera: THREE.Camera, evenIfNone = false): void => {
    if (objects.length === 0 && !evenIfNone) return;
    batch = objects;
    try {
      r.compile(subset, camera, scene);
    } finally {
      batch = [];
    }
  };

  const drawable = (o: THREE.Object3D): boolean => {
    const x = o as THREE.Object3D & { isMesh?: boolean; isPoints?: boolean; isLine?: boolean; isSprite?: boolean };
    return !!(x.isMesh || x.isPoints || x.isLine || x.isSprite);
  };
  const materialsOf = (o: THREE.Object3D): THREE.Material[] => {
    const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
    return !m ? [] : Array.isArray(m) ? m : [m];
  };
  const texturesOf = (m: THREE.Material): THREE.Texture[] => {
    const out: THREE.Texture[] = [];
    const rec = m as unknown as Record<string, unknown>;
    for (const key in rec) {
      const v = rec[key];
      if (v instanceof THREE.Texture) out.push(v);
    }
    const uniforms = (m as THREE.ShaderMaterial).uniforms;
    if (uniforms) {
      for (const u of Object.values(uniforms)) {
        const v = u?.value as unknown;
        if (v instanceof THREE.Texture) out.push(v);
        else if (Array.isArray(v)) for (const x of v) if (x instanceof THREE.Texture) out.push(x);
      }
    }
    return out;
  };
  // Render-target textures are drawn, not uploaded; version 0 has nothing to upload yet
  // Only a first upload is waited for: a texture already on the GPU and changed since (a canvas
  // or a sky table redrawn every frame) is an update, and waiting on it held its object back for
  // good (the look-up view's sky stayed hidden: a black sky by day)
  const isUploaded = (t: THREE.Texture): boolean =>
    (t as THREE.Texture & { isRenderTargetTexture?: boolean }).isRenderTargetTexture === true ||
    !t.image ||
    t.version === 0 ||
    (r.properties.get(t) as { __version?: number }).__version !== undefined;
  // A material that never reports ready (a driver quirk) must not hold the page forever: after
  // ~300 looks (5 s at 60 fps) it is let through and three.js compiles it as it always did
  const tries = new WeakMap<THREE.Material, number>();
  const programsReady = (m: THREE.Material): boolean => {
    const progs = (r.properties.get(m) as { programs?: Map<string, ProgramLike> }).programs;
    let ready = !!progs;
    if (progs) for (const p of progs.values()) if (!p.isReady()) ready = false;
    if (ready) return true;
    const n = (tries.get(m) ?? 0) + 1;
    tries.set(m, n);
    return n > 300;
  };
  /** Upload what the material shows, within the frame's allowance; true once all are up. */
  const uploadFor = (m: THREE.Material): boolean => {
    for (const t of texturesOf(m)) {
      if (isUploaded(t)) continue;
      if (state.uploads > 0 && performance.now() > state.uploadUntil) return false;
      r.initTexture(t);
      state.uploads++;
    }
    return true;
  };

  // The shadow map's depth material as three.js sets it up for each caster (WebGLShadowMap
  // .getDepthMaterial copies these from the caster's own material, and they change the shader:
  // a textured caster's depth shader samples its map). Same parameters, same program
  const depthStandIns = new WeakMap<THREE.Material, THREE.MeshDepthMaterial>();
  const shadowSideOf = (m: THREE.Material): THREE.Side =>
    m.shadowSide !== null && m.shadowSide !== undefined ? m.shadowSide : m.side === THREE.FrontSide ? THREE.BackSide : m.side === THREE.BackSide ? THREE.FrontSide : THREE.DoubleSide;
  const depthFor = (m: THREE.Material): THREE.MeshDepthMaterial => {
    let d = depthStandIns.get(m);
    if (!d) {
      d = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
      depthStandIns.set(m, d);
    }
    const src = m as THREE.Material & Partial<THREE.MeshStandardMaterial>;
    d.side = shadowSideOf(m);
    d.wireframe = src.wireframe ?? false;
    d.alphaMap = src.alphaMap ?? null;
    d.alphaTest = m.alphaTest;
    d.map = src.map ?? null;
    d.clipShadows = m.clipShadows;
    d.clippingPlanes = m.clippingPlanes;
    d.clipIntersection = m.clipIntersection;
    d.displacementMap = src.displacementMap ?? null;
    d.displacementScale = src.displacementScale ?? 1;
    d.displacementBias = src.displacementBias ?? 0;
    return d;
  };
  /** Compile `objects` each with a stand-in material, then put theirs back; the stand-ins used. */
  const compileAs = (objects: THREE.Object3D[], standIn: (o: THREE.Object3D) => THREE.Material, scene: THREE.Scene, camera: THREE.Camera): Map<THREE.Object3D, THREE.Material> => {
    const saved = objects.map((o) => (o as THREE.Mesh).material);
    const used = new Map<THREE.Object3D, THREE.Material>();
    objects.forEach((o) => {
      const s = standIn(o);
      used.set(o, s);
      (o as THREE.Mesh).material = s;
    });
    try {
      compileObjects(objects, scene, camera);
    } finally {
      objects.forEach((o, i) => ((o as THREE.Mesh).material = saved[i]));
    }
    return used;
  };

  interface Verdict {
    /** Everything visible is ready. */
    ok: boolean;
    /** Visible things not ready yet (left out in 'hide' mode). */
    notReady: THREE.Object3D[];
    /** Shadow casters whose depth shader is not ready yet. */
    castersNotReady: THREE.Object3D[];
    /** A shadow-casting light is in the scene. */
    shadowLight: boolean;
    /** Everything shown in this draw. */
    shown: THREE.Object3D[];
  }

  // Things drawn before: in 'hide' mode only what appears for the first time is held back (a
  // change of lights recompiles everything already on screen; that is drawn, not blanked)
  const drawnBefore = new WeakSet<THREE.Object3D>();
  // How many draws each object has been held back: never more than a third of a second or so
  const heldFor = new WeakMap<THREE.Object3D, number>();
  const MAX_HELD = 20;

  const examine = (scene: THREE.Scene, camera: THREE.Camera): Verdict => {
    const override = scene.isScene ? scene.overrideMaterial : null;
    // One walk, knowing what is shown (a hidden parent hides its children); the lights counted, as
    // their number by kind is part of every lit shader
    const shownDrawables: THREE.Object3D[] = [];
    const hiddenDrawables: THREE.Object3D[] = [];
    let shadowLight = false;
    const lights: string[] = [];
    const walk = (o: THREE.Object3D, shown: boolean): void => {
      const vis = shown && o.visible;
      if (vis && (o as THREE.Light).isLight && o.layers.test(camera.layers)) {
        lights.push(o.castShadow ? `${o.type}+shadow` : o.type);
        if (o.castShadow) shadowLight = true;
      }
      if (drawable(o)) (vis ? shownDrawables : hiddenDrawables).push(o);
      const kids = o.children;
      for (let i = 0; i < kids.length; i++) walk(kids[i], vis);
    };
    walk(scene, true);
    const sig = `${idOf(scene.environment)}:${idOf(scene.fog)}:${r.getRenderTarget() === null ? 's' : 't'}:${r.toneMapping}:${r.outputColorSpace}:${lights.sort().join('|')}`;
    const seenMats = setFor(knownMaterials, scene, sig);
    const hiddenDone = setFor(compiledHidden, scene, sig);
    const seenObjs = override ? setFor(knownObjects, override, `${sig}:${override.version}`) : null;
    const seenCasters = setFor(knownCasters, scene, sig);
    const fresh: THREE.Object3D[] = [];
    const freshHidden: THREE.Object3D[] = [];
    const casters: THREE.Object3D[] = [];
    for (const o of shownDrawables) {
      if (seenObjs) {
        if (!seenObjs.has(o)) fresh.push(o);
      } else if (materialsOf(o).some((m) => seenMats.get(m) !== m.version)) {
        fresh.push(o);
      }
      const own = (o as THREE.Mesh).material;
      if (o.castShadow && (o as THREE.Mesh).isMesh && own && !Array.isArray(own) && seenCasters.get(o) !== (own as THREE.Material).version) casters.push(o);
    }
    if (!override) {
      for (const o of hiddenDrawables) {
        if (materialsOf(o).some((m) => seenMats.get(m) !== m.version && hiddenDone.get(m) !== m.version)) freshHidden.push(o);
      }
    }

    const notReady: THREE.Object3D[] = [];
    const castersNotReady: THREE.Object3D[] = [];
    // Hidden things: their shaders started now, in the background; ready when they are shown
    if (freshHidden.length > 0) {
      compileObjects(freshHidden, scene, camera);
      for (const o of freshHidden) for (const m of materialsOf(o)) hiddenDone.set(m, m.version);
    }
    if (fresh.length > 0) {
      if (override && seenObjs) {
        compileAs(fresh, () => override, scene, camera);
        if (programsReady(override)) fresh.forEach((o) => seenObjs.set(o, 1));
        else notReady.push(...fresh);
      } else {
        compileObjects(fresh, scene, camera);
        for (const o of fresh) {
          let ready = true;
          for (const m of materialsOf(o)) {
            if (seenMats.get(m) === m.version) continue;
            if (programsReady(m) && uploadFor(m)) seenMats.set(m, m.version);
            else ready = false;
          }
          if (!ready) notReady.push(o);
        }
      }
    }
    if (shadowLight && r.shadowMap.enabled && casters.length > 0) {
      const used = compileAs(casters, (o) => depthFor(materialsOf(o)[0]), scene, camera);
      for (const o of casters) {
        const d = used.get(o);
        if (d && programsReady(d)) seenCasters.set(o, materialsOf(o)[0].version);
        else castersNotReady.push(o);
      }
    }
    return { ok: notReady.length === 0 && castersNotReady.length === 0, notReady, castersNotReady, shadowLight, shown: shownDrawables };
  };

  r.render = (scene: THREE.Object3D, camera: THREE.Camera): void => {
    if (state.mode === 'off' || !parallel || state.depth > 0) {
      state.depth++;
      try {
        draw(scene, camera);
      } finally {
        state.depth--;
      }
      return;
    }
    let v: Verdict;
    try {
      v = examine(scene as THREE.Scene, camera);
    } catch {
      // A material three.js could not prepare outside a draw (a shader swapped mid-flight): drawn
      // as three.js always would, rather than throwing every frame
      state.depth++;
      try {
        draw(scene, camera);
      } finally {
        state.depth--;
      }
      return;
    }
    if (!v.ok && state.mode === 'hold') {
      state.skips++;
      return;
    }
    // 'hide': what is not ready yet is left out of this draw (a full-screen pass, being the whole
    // draw, cannot be: drawn as three.js would)
    const restoreVisible: THREE.Object3D[] = [];
    const restoreCast: THREE.Object3D[] = [];
    for (const o of v.notReady) {
      if (o === scene || !o.visible || drawnBefore.has(o)) continue;
      const n = (heldFor.get(o) ?? 0) + 1;
      heldFor.set(o, n);
      if (n > MAX_HELD) {
        drawnBefore.add(o);
        continue;
      }
      o.visible = false;
      restoreVisible.push(o);
    }
    for (const o of v.castersNotReady) {
      if (!o.castShadow || drawnBefore.has(o)) continue;
      o.castShadow = false;
      restoreCast.push(o);
    }
    state.hidden += restoreVisible.length;
    // three.js draws the shadows before it sets up this draw's lights (WebGLRenderer.render): the
    // shadow pass sees the light setup the scene's previous draw left behind (another camera's, or
    // none the first time), and compiled a depth shader for it on the spot (0.33-0.77 s). Set up
    // here for this draw first (compile() with nothing to compile does just that)
    if (v.shadowLight && r.shadowMap.enabled) compileObjects([], scene as THREE.Scene, camera, true);
    state.depth++;
    try {
      draw(scene, camera);
    } finally {
      state.depth--;
      for (const o of restoreVisible) o.visible = true;
      for (const o of restoreCast) o.castShadow = true;
    }
    // What was in this draw has been drawn (and anything still compiling gets its turn next time)
    const held = new Set(restoreVisible);
    for (const o of v.shown) if (!held.has(o)) drawnBefore.add(o);
  };

  return {
    get mode() {
      return state.mode;
    },
    set mode(m: GateMode) {
      state.mode = m;
    },
    get skips() {
      return state.skips;
    },
    get hidden() {
      return state.hidden;
    },
    beginFrame(uploadBudgetMs = 6) {
      state.uploadUntil = performance.now() + uploadBudgetMs;
      state.uploads = 0;
    },
  };
}
