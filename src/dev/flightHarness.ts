/**
 * Development helper for testing flight over Earth from the browser console (not used by the
 * app). In dev:
 *   const h = await import('/solaris/src/dev/flightHarness.ts'); await h.start();
 *   h.pin(48.86, 2.29, 0.5, 45, -10); h.stats();
 */
import { bodyLatLonToLocal } from '../explorer/TileMath';
import { perf } from '../rendering/Performance';

/* eslint-disable @typescript-eslint/no-explicit-any */
const scene = (): any => (window as any).__solaris;

/** Put the jet over a place: height km, heading and pitch degrees, speed km/s along the nose. */
export function goto(lat: number, lon: number, altKm: number, hdgDeg = 0, pitchDeg = -10, speedKmS = 0): void {
  const s = scene();
  const j = s.jet;
  const b = j.bodyIndex.get('Earth');
  const mesh = b.bundle.surfaceMesh;
  mesh.updateWorldMatrix(true, false);
  const V = b.center.constructor;
  const [x, y, z] = bodyLatLonToLocal('Earth', lat, lon);
  const site = new V(x, y, z).applyMatrix4(mesh.matrixWorld);
  const up = site.clone().sub(b.bundle.bodyGroup.position).normalize();
  const kmN = b.radiusKm / b.radius;
  const [x2, y2, z2] = bodyLatLonToLocal('Earth', lat + 0.01, lon);
  const north = new V(x2, y2, z2).applyMatrix4(mesh.matrixWorld).sub(site);
  north.addScaledVector(up, -north.dot(up)).normalize();
  const east = new V().crossVectors(north, up).normalize();
  const h = (hdgDeg * Math.PI) / 180;
  const p = (pitchDeg * Math.PI) / 180;
  const fwd = north.clone().multiplyScalar(Math.cos(h) * Math.cos(p)).addScaledVector(east, Math.sin(h) * Math.cos(p)).addScaledVector(up, Math.sin(p)).normalize();
  j.flight.position.copy(site).addScaledVector(up, altKm / kmN);
  const M = new s.cameraRig.camera.matrix.constructor();
  M.lookAt(new V(), fwd, up);
  j.flight.quaternion.setFromRotationMatrix(M);
  j.flight.velocity.copy(fwd).multiplyScalar(speedKmS / kmN);
  if (j.chaseQuat) j.chaseQuat.copy(j.flight.quaternion);
}

let pinId = 0;
/** Hold the jet still over a place (call with no arguments to release). */
export function pin(...args: [number, number, number, number?, number?] | []): void {
  window.clearInterval(pinId);
  if (args.length === 0) return;
  const [lat, lon, alt, hdg = 0, pitch = -10] = args as [number, number, number, number?, number?];
  pinId = window.setInterval(() => {
    goto(lat, lon, alt, hdg, pitch, 0);
    scene().jet.throttle = 0;
  }, 30);
}

export function stats(): Record<string, number> {
  const s = scene();
  const T = s.photoreal.tiles;
  const st = T.stats;
  return { vis: st.visible, queued: st.queued, downloading: st.downloading, parsing: st.parsing, err: +T.errorTarget.toFixed(1), ms: +perf.frameMs.toFixed(1) };
}

/** Enter the jet over Earth with the help card closed and clear weather. */
export async function start(utcMs = Date.UTC(2026, 5, 21, 11, 0)): Promise<void> {
  const s = scene();
  if (!s.jet.active) s.enterJet();
  await new Promise((r) => setTimeout(r, 4000));
  s.jet.helpOpen = false;
  s.jet.view = 'chase';
  s.jet.weather.mode = 'clear';
  s.clock.setUtcMs(utcMs);
}

export function setTime(utcMs: number): void {
  scene().clock.setUtcMs(utcMs);
}

/**
 * How much of the ground around a place is real 3D (walls), from Google's tiles on screen: the
 * share of the surface area, within 600 m, in triangles steeper than ~70 degrees. Photogrammetry
 * of buildings has a lot of wall; photographs draped over terrain have almost none.
 */
export async function wallShare(lat: number, lon: number, groundKm: number): Promise<{ walls: number; tris: number }> {
  const s = scene();
  pin(lat, lon, groundKm + 0.5, 0, -89);
  await new Promise((r) => setTimeout(r, 2500));
  const T = s.photoreal.tiles;
  const t0 = performance.now();
  while (performance.now() - t0 < 22000) {
    await new Promise((r) => setTimeout(r, 1000));
    if (T.stats.queued + T.stats.downloading <= 1) break;
  }
  const b = s.jet.bodyIndex.get('Earth');
  const mesh = b.bundle.surfaceMesh;
  const [x, y, z] = bodyLatLonToLocal('Earth', lat, lon);
  const V = b.center.constructor;
  const r = 1 + groundKm / 6378.137;
  const site = new V(x * r, y * r, z * r).applyMatrix4(mesh.matrixWorld);
  const up = site.clone().sub(b.bundle.bodyGroup.position).normalize();
  const kmPerUnit = b.radiusKm / b.radius;
  let wall = 0;
  let all = 0;
  let tris = 0;
  const a = new V(), bb = new V(), c = new V(), n = new V(), e1 = new V(), e2 = new V();
  T.group.traverse((o: any) => {
    if (!o.isMesh || !o.visible) return;
    const g = o.geometry;
    if (!g.boundingSphere) g.computeBoundingSphere();
    const cen = g.boundingSphere.center.clone().applyMatrix4(o.matrixWorld);
    if (cen.distanceTo(site) * kmPerUnit > 0.9) return;
    const pos = g.attributes.position;
    const idx = g.index;
    const count = idx ? idx.count : pos.count;
    for (let i = 0; i < count; i += 3) {
      const ia = idx ? idx.getX(i) : i, ib = idx ? idx.getX(i + 1) : i + 1, ic = idx ? idx.getX(i + 2) : i + 2;
      a.fromBufferAttribute(pos, ia).applyMatrix4(o.matrixWorld);
      bb.fromBufferAttribute(pos, ib).applyMatrix4(o.matrixWorld);
      c.fromBufferAttribute(pos, ic).applyMatrix4(o.matrixWorld);
      if (a.distanceTo(site) * kmPerUnit > 0.6) continue;
      n.crossVectors(e1.subVectors(bb, a), e2.subVectors(c, a));
      const area = n.length();
      if (area === 0) continue;
      tris++;
      all += area;
      if (Math.abs(n.dot(up) / area) < 0.35) wall += area;
    }
  });
  pin();
  return { walls: all > 0 ? wall / all : 0, tris };
}
