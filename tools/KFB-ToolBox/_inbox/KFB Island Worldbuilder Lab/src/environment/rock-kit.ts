// Fels-Bausatz R1 (Steuerung 10.10., Vorlage zuerst freigegeben): a "Large Rock A" built from the Kenney Nature Kit
// rock_largeA (CC0, 80 triangles; public/assets/env/kenney, git blob 40e1365a = sync/lab-rkit-2026-10-09) after Georg's
// favourite sheet docs/golden/candidates/G1_rock_largeA_concept_sheet_1_webchat.png.
// One recipe (parameters + seed) so the same kit can build the island underside, bridge piers and Protopia later.
//  · 5–8 rock_largeA instances, turned and stretched (rocks may be scaled, figures never), sunk 25–45 % of their own
//    height (ETHERINGTON_REGELN_IN_ZAHLEN §2: large rock, "tief im Gelände")
//  · form (Steuerung): big flat fracture faces with softly rounded edges, no potatoes → midpoint subdivision, then a few
//    Taubin passes (a planar region stays planar under the Laplacian, only the edges round), normals split by angle
//  · moss caps: thick clay shells on the upward faces with a geometric drip lip that hugs the rock below (no gradient:
//    per-face colours, top grass.1, lip grass.0)
//  · 3–5 broad-leaf plant tufts from the Lab Environment kit (Quaternius Plant_1, Kenney plant_bushDetailed: the broad-leaf rosettes; Plant_2 is a twig, Plant_3 a grass tuft), pebbles at the foot (≤ 12 % of the rock)
//  · colours only from ENV_ROLES: stone by variant (default = protopia, sandy = kfb_town, dark = protopia one step darker),
//    moss / plants from the recipe palette
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { mergeVertices, toCreasedNormals, mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ENV_ROLES } from '../palettes';
import { clayMaterial, claySeed } from '../clay';
import { loadSpecies, H } from './kits';
import { buildMossCap, MOSS_DEFAULT, type MossOpts } from './moss-cap';

export type RockVariant = 'default' | 'sandy' | 'dark';
export interface RockRecipe {
  seed: number;
  /** rock_largeA instances, 5–8 */
  count: number;
  /** visible size above the ground in H */
  heightH: number; widthH: number; depthH: number;
  /** share of each instance's height below the ground */
  sink: number;
  /** ± non-uniform stretch per axis, max tilt in degrees */
  stretch: number; tiltDeg: number;
  /** midpoint levels for the big rocks (small ones one less), Taubin passes (edge radius), crease angle for normals */
  subdiv: number; round: number; creaseDeg: number;
  moss: { up: number; thick: number; drip: number };
  plants: number; pebbles: number;
  /** plant species (Lab Environment kit ids) */
  plantIds: string[];
  variant: RockVariant;
  /** palette for moss, plants, earth */
  palette: string;
}
export const ROCK_LARGE_A: RockRecipe = {
  seed: 7, count: 7, heightH: 2.6, widthH: 2.2, depthH: 2.0, sink: 0.33, stretch: 0.18, tiltDeg: 8,
  subdiv: 2, round: 3, creaseDeg: 34, moss: { up: 0.6, thick: 0.15, drip: 2.2 }, plants: 5, pebbles: 3, plantIds: ['q:Plant_1', 'kn:plant_bushDetailed'], variant: 'default', palette: 'protopia',
};

const STONE: Record<RockVariant, { pal: string; i: number }> = { default: { pal: 'protopia', i: 0 }, sandy: { pal: 'kfb_town', i: 0 }, dark: { pal: 'protopia', i: 1 } };
/** cluster layout in H (x right, z front, visible height, width, depth, standing): one tall block, flanks, front steps,
 *  low outliers. Kenney rock_largeA is a low boulder (0.79 × 0.26 × 1.02) with a flat top: every block keeps it lying and
 *  is stretched up (a linear stretch keeps the fracture faces planar and the top flat, as on the sheet; standing it on its
 *  long side gave pointed tusks, round 1). `standing` stays available for spires. The cluster is fitted to widthH × depthH. */
const SLOTS: [number, number, number, number, number, boolean][] = [
  [0, -0.2, 2.6, 1.5, 1.3, false], [-0.5, -0.02, 1.8, 1.3, 1.15, false], [0.5, -0.28, 2.0, 1.3, 1.1, false], [-0.32, 0.42, 1.1, 1.15, 1.0, false],
  [0.36, 0.4, 1.35, 1.15, 1.0, false], [-0.82, 0.36, 0.6, 1.0, 0.85, false], [0.82, 0.34, 0.5, 0.9, 0.8, false], [0.7, -0.66, 1.0, 1.0, 0.9, false],
];

const rng = (seed: number) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const h3 = (x: number, y: number, z: number) => { let h = (x * 374761393 + y * 668265263 + z * 1274126177) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const vnoise = (x: number, y: number, z: number) => { const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), fx = x - xi, fy = y - yi, fz = z - zi, s = (t: number) => t * t * (3 - 2 * t), u = s(fx), v = s(fy), w = s(fz), L = (a: number, b: number, t: number) => a + (b - a) * t;
  return L(L(L(h3(xi, yi, zi), h3(xi + 1, yi, zi), u), L(h3(xi, yi + 1, zi), h3(xi + 1, yi + 1, zi), u), v), L(L(h3(xi, yi, zi + 1), h3(xi + 1, yi, zi + 1), u), L(h3(xi, yi + 1, zi + 1), h3(xi + 1, yi + 1, zi + 1), u), v), w); };

let rockSrc: Promise<{ large: THREE.BufferGeometry; small: THREE.BufferGeometry; standing: THREE.BufferGeometry }> | null = null;
/** the rock primitive of a Kenney rock (material 'dirt'; the 9-triangle grass cap is left out), positions only, foot at y 0 */
function loadRocks() {
  if (!rockSrc) {
    // both primitives welded: Kenney's rock body is an open shell whose top caps are the 'grass' primitive (9 triangles);
    // the caps become rock here (our moss replaces Kenney's grass colour); winding checked so face normals point outward
    const one = async (f: string) => { const g = await new GLTFLoader().loadAsync('/assets/env/kenney/' + f); const parts: THREE.BufferGeometry[] = [];
      g.scene.updateMatrixWorld(true);
      g.scene.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; const c = new THREE.BufferGeometry(); c.setAttribute('position', m.geometry.attributes.position.clone()); if (m.geometry.index) c.setIndex(m.geometry.index.clone()); c.applyMatrix4(m.matrixWorld); parts.push(c.index ? c : mergeVertices(c)); });
      const out = mergeVertices(mergeGeometries(parts)!, 1e-3); out.computeBoundingBox(); const b = out.boundingBox!; out.translate(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2); out.computeBoundingBox();
      const P = out.attributes.position, I = out.index!.array as Uint16Array | Uint32Array, ctr = out.boundingBox!.getCenter(new THREE.Vector3()), a = new THREE.Vector3(), b2 = new THREE.Vector3(), c2 = new THREE.Vector3(); let vol = 0;
      for (let t = 0; t < I.length; t += 3) { a.fromBufferAttribute(P, I[t]).sub(ctr); b2.fromBufferAttribute(P, I[t + 1]).sub(ctr); c2.fromBufferAttribute(P, I[t + 2]).sub(ctr); vol += a.dot(b2.cross(c2)); }
      if (vol < 0) { const J = Array.from(I); for (let t = 0; t < J.length; t += 3) [J[t + 1], J[t + 2]] = [J[t + 2], J[t + 1]]; out.setIndex(J); }
      return out; };
    rockSrc = Promise.all([one('rock_largeA.glb'), one('rock_smallA.glb')]).then(([large, small]) => {
      const standing = large.clone(); standing.rotateX(-Math.PI / 2); standing.computeBoundingBox(); const b = standing.boundingBox!; standing.translate(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2); standing.computeBoundingBox();
      return { large, small, standing }; });
  }
  return rockSrc;
}

/** midpoint subdivision on an indexed mesh (1 → 4), shared edge midpoints */
function subdivide(g: THREE.BufferGeometry, levels: number) {
  let P = Array.from(g.attributes.position.array as Float32Array), I = Array.from(g.index!.array);
  for (let l = 0; l < levels; l++) {
    const mid = new Map<string, number>(), NI: number[] = [];
    const m = (a: number, b: number) => { const k = a < b ? a + '_' + b : b + '_' + a; let i = mid.get(k); if (i === undefined) { i = P.length / 3; P.push((P[a * 3] + P[b * 3]) / 2, (P[a * 3 + 1] + P[b * 3 + 1]) / 2, (P[a * 3 + 2] + P[b * 3 + 2]) / 2); mid.set(k, i); } return i; };
    for (let t = 0; t < I.length; t += 3) { const a = I[t], b = I[t + 1], c = I[t + 2], ab = m(a, b), bc = m(b, c), ca = m(c, a); NI.push(a, ab, ca, ab, b, bc, ca, bc, c, ab, bc, ca); }
    I = NI;
  }
  const o = new THREE.BufferGeometry(); o.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); o.setIndex(I); return o;
}

/** Taubin λ/μ passes: rounds the edges, a planar region stays planar; open-boundary vertices stay put */
function roundEdges(g: THREE.BufferGeometry, iters: number) {
  const pos = g.attributes.position as THREE.BufferAttribute, n = pos.count, I = g.index!.array, nb: Set<number>[] = Array.from({ length: n }, () => new Set());
  const edge = new Map<string, number>();
  for (let t = 0; t < I.length; t += 3) for (const [a, b] of [[I[t], I[t + 1]], [I[t + 1], I[t + 2]], [I[t + 2], I[t]]]) { nb[a].add(b); nb[b].add(a); const k = a < b ? a + '_' + b : b + '_' + a; edge.set(k, (edge.get(k) ?? 0) + 1); }
  const fixed = new Uint8Array(n); for (const [k, c] of edge) if (c === 1) { const [a, b] = k.split('_').map(Number); fixed[a] = fixed[b] = 1; }
  const P = pos.array as Float32Array, D = new Float32Array(n * 3);
  const pass = (k: number) => { for (let i = 0; i < n; i++) { if (fixed[i] || !nb[i].size) { D[i * 3] = D[i * 3 + 1] = D[i * 3 + 2] = 0; continue; } let x = 0, y = 0, z = 0; for (const j of nb[i]) { x += P[j * 3]; y += P[j * 3 + 1]; z += P[j * 3 + 2]; } const s = nb[i].size; D[i * 3] = x / s - P[i * 3]; D[i * 3 + 1] = y / s - P[i * 3 + 1]; D[i * 3 + 2] = z / s - P[i * 3 + 2]; }
    for (let i = 0; i < n * 3; i++) P[i] += k * D[i]; };
  for (let it = 0; it < iters; it++) { pass(0.5); pass(-0.53); }
  pos.needsUpdate = true;
}

const colOf = (pal: string, role: string, i: number) => new THREE.Color(((ENV_ROLES[pal] ?? ENV_ROLES.protopia) as any)[role][i]);
const paint = (g: THREE.BufferGeometry, c: THREE.Color) => { const n = g.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; } g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g; };

/** moss shell on the upward faces of one rounded rock (indexed, asset frame) + drip lip hugging the rock below */
function mossCap(g: THREE.BufferGeometry, rock: THREE.Mesh, r: RockRecipe, R: () => number, top: THREE.Color, lip: THREE.Color) {
  g.computeVertexNormals();
  const P = g.attributes.position as THREE.BufferAttribute, VN = g.attributes.normal as THREE.BufferAttribute, I = g.index!.array;
  const v = (i: number) => new THREE.Vector3().fromBufferAttribute(P, i), vn = (i: number) => new THREE.Vector3().fromBufferAttribute(VN, i);
  const sel: number[] = [], fn = new THREE.Vector3(), e1 = new THREE.Vector3(), e2 = new THREE.Vector3();
  for (let t = 0; t < I.length; t += 3) { const a = v(I[t]), b = v(I[t + 1]), c = v(I[t + 2]); fn.crossVectors(e1.subVectors(b, a), e2.subVectors(c, a)).normalize(); if (fn.y > r.moss.up && (a.y + b.y + c.y) / 3 > 0.15 * H) sel.push(t); }
  if (!sel.length) return null;
  const edges = new Map<string, [number, number, number]>();   // key → [a, b, face t] in face order
  for (const t of sel) for (const [a, b] of [[I[t], I[t + 1]], [I[t + 1], I[t + 2]], [I[t + 2], I[t]]]) { const k = a < b ? a + '_' + b : b + '_' + a; if (edges.has(k)) edges.delete(k); else edges.set(k, [a, b, t]); }
  const S = (r.seed % 97) * 3.1, th = r.moss.thick;
  const outward = new Map<number, THREE.Vector3>();
  for (const [a, b, t] of edges.values()) { const pa = v(a), pb = v(b), pc = v(I[t] === a || I[t] === b ? (I[t + 1] === a || I[t + 1] === b ? I[t + 2] : I[t + 1]) : I[t]); const n = new THREE.Vector3().crossVectors(e1.subVectors(pb, pa), e2.subVectors(pc, pa)).normalize(); const o = new THREE.Vector3().crossVectors(e1.subVectors(pb, pa), n).normalize();
    for (const i of [a, b]) outward.set(i, (outward.get(i) ?? new THREE.Vector3()).add(o)); }
  const verts: number[] = [], tri: number[] = [], lipTri = new Set<number>();
  const topId = new Map<number, number>(), lipId = new Map<number, number>(), tuckId = new Map<number, number>();
  const push = (p: THREE.Vector3) => { verts.push(p.x, p.y, p.z); return verts.length / 3 - 1; };
  const lump = (p: THREE.Vector3) => vnoise(p.x * 0.9 + S, p.y * 0.9, p.z * 0.9);
  const topOf = (i: number) => { let id = topId.get(i); if (id === undefined) { const p = v(i), k = outward.has(i) ? 0.7 : 1; id = push(p.addScaledVector(vn(i), th * k * (0.7 + 0.6 * lump(p)))); topId.set(i, id); } return id; };
  // drip length per rim vertex: drops where a noise along the rim is high, then smoothed along the rim (2 passes) so
  // neighbouring lip points do not jump (round 1: jagged shards)
  const rimNb = new Map<number, number[]>(); for (const [a, b] of edges.values()) { (rimNb.get(a) ?? rimNb.set(a, []).get(a)!).push(b); (rimNb.get(b) ?? rimNb.set(b, []).get(b)!).push(a); }
  let drip = new Map<number, number>(); for (const i of rimNb.keys()) { const p = v(i), n = vnoise(p.x * 1.6 + S, p.y * 0.9, p.z * 1.6); drip.set(i, r.moss.drip * (0.15 + 1.0 * Math.max(0, n - 0.3) / 0.7) * (0.85 + 0.3 * R())); }
  for (let pass = 0; pass < 2; pass++) { const nx = new Map<number, number>(); for (const [i, nb] of rimNb) nx.set(i, (2 * drip.get(i)! + nb.reduce((acc, j) => acc + drip.get(j)!, 0)) / (2 + nb.length)); drip = nx; }
  const rc = new THREE.Raycaster(), down = new THREE.Vector3();
  const lipOf = (i: number) => { if (lipId.has(i)) return [lipId.get(i)!, tuckId.get(i)!];
    const p = v(i), o = outward.get(i)!.setY(0); if (o.lengthSq() < 1e-6) o.set(1, 0, 0); o.normalize();
    const d = drip.get(i)!;
    const q = p.clone().addScaledVector(o, 0.1).add(down.set(0, -d, 0));
    rc.set(q.clone().addScaledVector(o, 2.5), o.clone().negate()); rc.far = 4.5; const hit = rc.intersectObject(rock, false)[0];
    let L: THREE.Vector3, K: THREE.Vector3;
    if (hit && hit.face) { const nh = hit.face.normal.clone(); L = hit.point.clone().addScaledVector(nh, th * 0.55); K = hit.point.clone().addScaledVector(nh, -th * 0.4); }
    else { L = p.clone().addScaledVector(o, th * 0.45).add(down.set(0, -Math.min(d, th * 1.5), 0)); K = p.clone().addScaledVector(o, -th * 0.3).add(down.set(0, -Math.min(d, th * 1.5) - th * 0.3, 0)); }
    const a = push(L), b = push(K); lipId.set(i, a); tuckId.set(i, b); return [a, b]; };
  for (const t of sel) tri.push(topOf(I[t]), topOf(I[t + 1]), topOf(I[t + 2]));
  const quad = (a: number, b: number, c: number, d: number, out: THREE.Vector3) => {   // a-b top edge, d-c lower edge; orient the face outward
    const pa = new THREE.Vector3(verts[a * 3], verts[a * 3 + 1], verts[a * 3 + 2]), pb = new THREE.Vector3(verts[b * 3], verts[b * 3 + 1], verts[b * 3 + 2]), pd = new THREE.Vector3(verts[d * 3], verts[d * 3 + 1], verts[d * 3 + 2]);
    const n = new THREE.Vector3().crossVectors(e1.subVectors(pd, pa), e2.subVectors(pb, pa));
    const f = n.dot(out) >= 0 ? [a, d, b, b, d, c] : [a, b, d, b, c, d]; for (const x of f) tri.push(x); lipTri.add(tri.length / 3 - 1); lipTri.add(tri.length / 3 - 2); };
  for (const [a, b] of edges.values()) { const [la, ka] = lipOf(a), [lb, kb] = lipOf(b), o = outward.get(a)!.clone().add(outward.get(b)!).normalize();
    quad(topOf(a), topOf(b), lb, la, o); quad(la, lb, kb, ka, o.clone().add(new THREE.Vector3(0, -1, 0))); }
  const m = new THREE.BufferGeometry(); m.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3)); m.setIndex(tri); m.computeVertexNormals();
  const flat = m.toNonIndexed(), cols = new Float32Array(flat.attributes.position.count * 3);
  for (let f = 0; f < flat.attributes.position.count / 3; f++) { const c = lipTri.has(f) ? lip : top; for (let k = 0; k < 3; k++) { cols[(f * 3 + k) * 3] = c.r; cols[(f * 3 + k) * 3 + 1] = c.g; cols[(f * 3 + k) * 3 + 2] = c.b; } }
  flat.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  const tops = sel.map((t) => { const a = v(I[t]), b = v(I[t + 1]), c = v(I[t + 2]); return { c: a.add(b).add(c).divideScalar(3), area: e1.subVectors(b, a).cross(e2.subVectors(c, a)).length() / 2 }; });
  return { geo: flat, tops };
}

export interface RockKit { group: THREE.Group; tris: { rock: number; moss: number; plants: number; pebbles: number; total: number }; size: { heightH: number; widthH: number; depthH: number; belowH: number }; recipe: RockRecipe;
  /** ground circles of the instances at y 0 (asset frame), for placement / footprints */ foot: { x: number; z: number; r: number }[] }

/** build one rock formation; asset frame: ground at y 0, front = +z */
export async function buildRockKit(over: Partial<RockRecipe> = {}): Promise<RockKit> {
  const r: RockRecipe = { ...ROCK_LARGE_A, ...over, moss: { ...ROCK_LARGE_A.moss, ...(over.moss ?? {}) } };
  const R = rng(r.seed * 7919 + 13), src = await loadRocks();
  const st = STONE[r.variant], stoneL = colOf(st.pal, 'stone', st.i), stoneM = colOf(st.pal, 'stone', st.i + 1);
  const mossTop = colOf(r.palette, 'grass', 1), mossLip = colOf(r.palette, 'grass', 0);
  const rocks: THREE.BufferGeometry[] = [], moss: THREE.BufferGeometry[] = [], tops: { c: THREE.Vector3; area: number }[] = [], foot: RockKit['foot'] = [];
  const slots = SLOTS.slice(0, Math.max(5, Math.min(8, r.count)));
  // pass 1: instance transforms; pass 2: fit the visible part (y ≥ 0) to widthH × depthH
  const inst = slots.map(([sx, sz, vh, wk, dk, stand]) => { const g0 = stand ? src.standing : src.large, b = g0.boundingBox!, jitter = 0.06 * H;
    const ht = (vh * (0.94 + 0.12 * R()) / (1 - r.sink)) * H, ys = ht / b.max.y, xs = (wk * H / (b.max.x - b.min.x)) * (1 + r.stretch * (R() * 2 - 1)), zs = (dk * H / (b.max.z - b.min.z)) * (1 + r.stretch * (R() * 2 - 1));
    const tilt = (r.tiltDeg * Math.PI) / 180;
    const M = new THREE.Matrix4().compose(new THREE.Vector3(sx * H + (R() * 2 - 1) * jitter, -r.sink * ht, sz * H + (R() * 2 - 1) * jitter),
      new THREE.Quaternion().setFromEuler(new THREE.Euler((R() * 2 - 1) * tilt, R() * Math.PI * 2, (R() * 2 - 1) * tilt)), new THREE.Vector3(xs, ys, zs));
    return { g0, M, vh }; });
  const vis = new THREE.Box3(), tv = new THREE.Vector3();
  for (const { g0, M } of inst) { const p = g0.attributes.position; for (let i = 0; i < p.count; i++) { tv.fromBufferAttribute(p, i).applyMatrix4(M); if (tv.y >= 0) vis.expandByPoint(tv); } }
  const ctr = vis.getCenter(new THREE.Vector3()), fit = new THREE.Matrix4().makeScale(r.widthH * H / (vis.max.x - vis.min.x), 1, r.depthH * H / (vis.max.z - vis.min.z)).multiply(new THREE.Matrix4().makeTranslation(-ctr.x, 0, -ctr.z));
  for (let k = 0; k < inst.length; k++) {
    const { g0, M, vh } = inst[k];
    const g = subdivide(g0, vh > 1.2 ? r.subdiv : Math.max(1, r.subdiv - 1)); g.applyMatrix4(fit.clone().multiply(M)); roundEdges(g, r.round);
    const probe = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
    const mc = mossCap(g, probe, r, R, mossTop, mossLip); if (mc) { moss.push(mc.geo); tops.push(...mc.tops); }
    const flat = toCreasedNormals(g, (r.creaseDeg * Math.PI) / 180); paint(flat, k === 5 || k === 6 ? stoneM : stoneL); rocks.push(flat);
    // ground circle: widest horizontal reach of the vertices near the ground line
    const p = g.attributes.position; let cx = 0, cz = 0, n = 0; for (let i = 0; i < p.count; i++) if (Math.abs(p.getY(i)) < 0.4) { cx += p.getX(i); cz += p.getZ(i); n++; }
    if (n) { cx /= n; cz /= n; let rr = 0; for (let i = 0; i < p.count; i++) if (Math.abs(p.getY(i)) < 0.4) rr = Math.max(rr, Math.hypot(p.getX(i) - cx, p.getZ(i) - cz)); foot.push({ x: cx, z: cz, r: rr }); }
  }
  // pebbles: chipped bits at the foot, front side (downhill on a slope), ≤ 12 % of the rock height
  const pebbles: THREE.BufferGeometry[] = [], psb = src.small.boundingBox!, outside = (x: number, z: number, m: number) => foot.every((f) => Math.hypot(x - f.x, z - f.z) > f.r + m);
  const ringPoint = (a: number, m: number) => { for (let d = 0.5; d < 4 * H; d += 0.1) { const x = Math.sin(a) * d, z = Math.cos(a) * d; if (outside(x, z, m)) return new THREE.Vector3(x, 0, z); } return new THREE.Vector3(Math.sin(a) * 4 * H, 0, Math.cos(a) * 4 * H); };
  for (let k = 0; k < r.pebbles; k++) {
    const a = (k - (r.pebbles - 1) / 2) * 0.45 + (R() - 0.5) * 0.2 + 0.35, s = (0.12 + 0.12 * R()) * H / (psb.max.y || 1), p = ringPoint(a, 0.1 + 0.25 * R());
    const g = subdivide(src.small, 1); g.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(p.x, -0.3 * s * psb.max.y, p.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, R() * 6.28, 0)), new THREE.Vector3(s * (1 + 0.3 * R()), s, s * (1 + 0.3 * R()))));
    roundEdges(g, 2); const f = toCreasedNormals(g, (r.creaseDeg * Math.PI) / 180); paint(f, stoneM); pebbles.push(f);
  }
  // plants (Lab Environment kit, broad leaves): a nest of 3 at the foot (shady front-left), the rest on the highest moss ledges
  const plantGeos: THREE.BufferGeometry[] = [], leaf = colOf(r.palette, 'leaf', 1), leafD = colOf(r.palette, 'leaf', 2);
  const ids = r.plantIds;
  const ledges = tops.filter((t) => t.c.y > 0.9 * H).sort((p, q) => q.area - p.area);
  const onLedge = Math.max(0, r.plants - 3), atFoot = r.plants - onLedge;
  for (let k = 0; k < r.plants; k++) {
    const sp = await loadSpecies(ids[k % ids.length], 'bush'), g = sp.geo.clone(), hT = (k < atFoot ? 0.3 + 0.1 * R() : 0.26 + 0.08 * R()) * H, s = hT / sp.height;
    let pos: THREE.Vector3;
    if (k < atFoot) pos = ringPoint(-0.75 + (k - 1) * 0.42 + (R() - 0.5) * 0.15, -0.15 * H);   // tucked against the rock foot
    else { const t = ledges[Math.min(ledges.length - 1, (k - atFoot) * 3)]; pos = t ? t.c.clone().setY(t.c.y + r.moss.thick * 0.6) : ringPoint(1.2 + k, 0); }
    g.applyMatrix4(new THREE.Matrix4().compose(pos.setY(pos.y - 0.06 * hT), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, R() * 6.28, 0)), new THREE.Vector3(s, s, s)));
    const slot = g.attributes.envSlot, shade = g.attributes.envShade, c = new Float32Array(g.attributes.position.count * 3);
    for (let i = 0; i < g.attributes.position.count; i++) { const base = slot && slot.getX(i) === 1 ? leafD : leaf, sh = shade ? Math.max(0.7, Math.min(1.25, shade.getX(i))) : 1; c[i * 3] = base.r * sh; c[i * 3 + 1] = base.g * sh; c[i * 3 + 2] = base.b * sh; }
    for (const k2 of Object.keys(g.attributes)) if (!['position', 'normal'].includes(k2)) g.deleteAttribute(k2);
    g.setAttribute('color', new THREE.BufferAttribute(c, 3)); plantGeos.push(g);
  }
  const strip = (g: THREE.BufferGeometry) => { for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'color'].includes(k)) g.deleteAttribute(k); return g.index ? g.toNonIndexed() : g; };
  const rockGeo = mergeGeometries([...rocks, ...pebbles].map(strip))!, mossGeo = moss.length ? mergeGeometries(moss.map(strip))! : null, plantGeo = plantGeos.length ? mergeGeometries(plantGeos.map(strip))! : null;
  const group = new THREE.Group(); group.name = 'rock-kit:' + r.variant + ':' + r.seed;
  const add = (g: THREE.BufferGeometry | null, cls: 'rock' | 'nature', name: string, seed: number) => { if (!g) return; claySeed(g, seed); const m = new THREE.Mesh(g, clayMaterial(cls, new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, roughness: 0.9 }))); m.name = name; m.castShadow = m.receiveShadow = true; group.add(m); };
  add(rockGeo, 'rock', 'rock', r.seed); add(mossGeo, 'nature', 'moss', r.seed + 1); add(plantGeo, 'nature', 'plants', r.seed + 2);
  const t = (g: THREE.BufferGeometry | null) => (g ? g.attributes.position.count / 3 : 0), pebT = pebbles.reduce((a, g) => a + g.attributes.position.count / 3, 0);
  const box = new THREE.Box3().setFromObject(group), vb = new THREE.Box3();
  for (const g of [rockGeo, mossGeo, plantGeo]) if (g) { const p = g.attributes.position; for (let i = 0; i < p.count; i++) { tv.fromBufferAttribute(p, i); if (tv.y >= 0) vb.expandByPoint(tv); } }
  return { group, recipe: r, foot, tris: { rock: t(rockGeo) - pebT, moss: t(mossGeo), plants: t(plantGeo), pebbles: pebT, total: t(rockGeo) + t(mossGeo) + t(plantGeo) },
    size: { heightH: +(vb.max.y / H).toFixed(2), widthH: +((vb.max.x - vb.min.x) / H).toFixed(2), depthH: +((vb.max.z - vb.min.z) / H).toFixed(2), belowH: +(-box.min.y / H).toFixed(2) } };
}

// ======================================================================================================================
// Runde 3 (Steuerung 10.10., Georg: KayKit first): a stepped pyramid of 12–15 broad, thick KayKit Forest blocks
// (Rock_2_C/D) on a base mass (Rock_2_E–H), moss as swollen cushions (moss-cap.ts), Tiny Treats succulent rosettes,
// KayKit Rock_3 pebbles. Every upper block rests on what lies below it (support height under its footprint).

export interface FormationRecipe {
  seed: number; heightH: number; widthH: number; depthH: number;
  /** share of the ground tier sunk into the terrain */
  sink: number;
  /** blocks per tier (ground ring incl. the base mass, middle, top) */
  tiers: [number, number, number];
  blockIds: string[]; baseIds: string[]; pebbleIds: string[]; plantIds: string[];
  stretch: number; tiltDeg: number; subdiv: number; round: number; creaseDeg: number;
  moss: Partial<Omit<MossOpts, 'top' | 'lip' | 'seed'>>;
  plants: number; plantDiaH: [number, number]; pebbles: number;
  variant: RockVariant; palette: string;
}
export const ROCK_LARGE_A_R3: FormationRecipe = {
  seed: 11, heightH: 2.6, widthH: 2.2, depthH: 2.0, sink: 0.3, tiers: [8, 4, 2],
  blockIds: ['Rock_2_C', 'Rock_2_D'], baseIds: ['Rock_2_E', 'Rock_2_F', 'Rock_2_G', 'Rock_2_H'], pebbleIds: ['Rock_3_A', 'Rock_3_B', 'Rock_3_C', 'Rock_3_D', 'Rock_3_E', 'Rock_3_F'],
  plantIds: ['tt:house-plants/succulent_A', 'tt:house-plants/succulent_C'],
  stretch: 0.12, tiltDeg: 4, subdiv: 1, round: 1, creaseDeg: 30, moss: {}, plants: 4, plantDiaH: [0.3, 0.45], pebbles: 3, variant: 'default', palette: 'protopia',
};
const STONE_R3: Record<RockVariant, { pal: string; i: [number, number] }> = { default: { pal: 'protopia', i: [0, 1] }, sandy: { pal: 'wueste', i: [1, 2] }, dark: { pal: 'protopia', i: [2, 2] } };

const kkCache = new Map<string, Promise<THREE.BufferGeometry>>();
/** a KayKit Forest model as one welded geometry (positions only), foot at y 0, centred */
function loadKK(name: string) {
  let p = kkCache.get(name);
  if (!p) { p = new GLTFLoader().loadAsync('/assets/env/kaykit-forest/' + name + '_Color1.gltf').then((g) => { const parts: THREE.BufferGeometry[] = []; g.scene.updateMatrixWorld(true);
      g.scene.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; const c = new THREE.BufferGeometry(); c.setAttribute('position', m.geometry.attributes.position.clone()); if (m.geometry.index) c.setIndex(m.geometry.index.clone()); c.applyMatrix4(m.matrixWorld); parts.push(c.index ? c : mergeVertices(c)); });
      const out = mergeVertices(mergeGeometries(parts)!, 1e-3); out.computeBoundingBox(); const b = out.boundingBox!; out.translate(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2); out.computeBoundingBox(); return out; });
    kkCache.set(name, p); }
  return p;
}

export async function buildRockFormation(over: Partial<FormationRecipe> = {}): Promise<RockKit & { blocks: number; mossLoops: number }> {
  const r: FormationRecipe = { ...ROCK_LARGE_A_R3, ...over, moss: { ...ROCK_LARGE_A_R3.moss, ...(over.moss ?? {}) } };
  const R = rng(r.seed * 7919 + 29), st = STONE_R3[r.variant], stoneA = colOf(st.pal, 'stone', st.i[0]), stoneB = colOf(st.pal, 'stone', st.i[1]);
  const tilt = (r.tiltDeg * Math.PI) / 180, placed: { g: THREE.BufferGeometry; mesh: THREE.Mesh; col: THREE.Color }[] = [];
  const tv = new THREE.Vector3();
  /** highest rock point under a footprint (centre x,z, radius) among the blocks placed so far, or null */
  const support = (x: number, z: number, rad: number, below = placed.length) => { let y: number | null = null; for (const { g } of placed.slice(0, below)) { const p = g.attributes.position; for (let i = 0; i < p.count; i++) { if (Math.hypot(p.getX(i) - x, p.getZ(i) - z) < rad) y = Math.max(y ?? -Infinity, p.getY(i)); } } return y; };
  const place = async (name: string, x: number, z: number, w: number, h: number, d: number, onGround: boolean, col: THREE.Color, lvl: number, below = placed.length) => {
    const g0 = await loadKK(name), b = g0.boundingBox!, sy = support(x, z, Math.min(w, d) * 0.3, below);
    let base = onGround || sy == null ? -r.sink * h : sy - 0.1 * h;   // stacked blocks sit 10 % into the block below (contact)
    if (!onGround && sy != null) {   // no overhang into the air: reach down to the lowest support under the whole footprint (ground if none), top stays
      const top = base + h, lows = [[0, 0], [0.38, 0], [-0.38, 0], [0, 0.38], [0, -0.38], [0.3, 0.3], [-0.3, 0.3], [0.3, -0.3], [-0.3, -0.3]].map(([u, v]) => support(x + u * w, z + v * d, Math.min(w, d) * 0.12, below));
      const lo = Math.min(...lows.map((y) => (y == null ? -r.sink * h : y - 0.1 * h))); base = Math.min(base, lo); h = top - base; }
    const M = new THREE.Matrix4().compose(new THREE.Vector3(x, base, z), new THREE.Quaternion().setFromEuler(new THREE.Euler((R() * 2 - 1) * tilt, R() * Math.PI * 2, (R() * 2 - 1) * tilt)),
      new THREE.Vector3(w / (b.max.x - b.min.x) * (1 + r.stretch * (R() * 2 - 1)), h / b.max.y, d / (b.max.z - b.min.z) * (1 + r.stretch * (R() * 2 - 1))));
    const g = subdivide(g0, lvl); g.applyMatrix4(M); roundEdges(g, r.round);
    const mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })); mesh.updateMatrixWorld(true); placed.push({ g, mesh, col }); };
  // ---- layout in H (centre of the formation at 0,0; front = +z), then fitted to width × depth
  const Hh = H, [n0, n1, n2] = r.tiers;
  await place(r.baseIds[Math.floor(R() * r.baseIds.length)], 0, -0.15 * Hh, 1.55 * Hh, 1.15 * Hh, 1.4 * Hh, true, stoneB, 0);   // base mass (mostly hidden behind the ring: no subdivision, budget)
  for (let k = 0; k < n0 - 1; k++) { const a = -Math.PI + (2 * Math.PI * (k + 0.5)) / (n0 - 1) + (R() - 0.5) * 0.25,   // the ground ring all round (round 3: the back was one tall wall)
    rad = (0.72 + 0.12 * R()) * Hh, w = (0.8 + 0.25 * R()) * Hh;
    await place(r.blockIds[k % r.blockIds.length], Math.sin(a) * rad, Math.cos(a) * rad * 0.9, w, (0.7 + 0.3 * R()) * Hh, w * (0.85 + 0.2 * R()), true, k % 3 === 2 ? stoneB : stoneA, 1); }
  const below1 = placed.length;
  for (let k = 0; k < n1; k++) { const a = -2.2 + (4.4 * (k + 0.5)) / n1 + (R() - 0.5) * 0.3, rad = (0.4 + 0.08 * R()) * Hh, w = (0.78 + 0.15 * R()) * Hh;
    await place(r.blockIds[(k + 1) % r.blockIds.length], Math.sin(a) * rad, Math.cos(a) * rad * 0.8 - 0.1 * Hh, w, (0.8 + 0.2 * R()) * Hh, w * (0.9 + 0.15 * R()), false, k % 2 ? stoneB : stoneA, 1, below1); }
  const below2 = placed.length;
  for (let k = 0; k < n2; k++) { const x = (k - (n2 - 1) / 2) * 0.32 * Hh + (R() - 0.5) * 0.1 * Hh, z = -0.12 * Hh + (R() - 0.5) * 0.15 * Hh, w = (0.66 + 0.1 * R()) * Hh, sy = support(x, z, w * 0.3, below2) ?? 0;
    const h = Math.max(0.7 * Hh, ((k === 0 ? r.heightH : r.heightH - 0.35) * Hh - sy) / 0.9);   // base = sy − 0.1 h: the top block ends at the target height
    await place(r.blockIds[k % r.blockIds.length], x, z, w, h, w * 0.95, false, stoneA, 1, below2); }
  // ---- fit the visible part to width × depth (xz only; heights and contacts stay)
  const vis = new THREE.Box3(); for (const { g } of placed) { const p = g.attributes.position; for (let i = 0; i < p.count; i++) { tv.fromBufferAttribute(p, i); if (tv.y >= 0) vis.expandByPoint(tv); } }
  const ctr = vis.getCenter(new THREE.Vector3()), fit = new THREE.Matrix4().makeScale(r.widthH * Hh / (vis.max.x - vis.min.x), 1, r.depthH * Hh / (vis.max.z - vis.min.z)).multiply(new THREE.Matrix4().makeTranslation(-ctr.x, 0, -ctr.z));
  for (const q of placed) { q.g.applyMatrix4(fit); q.g.computeBoundingSphere(); q.g.computeBoundingBox(); q.mesh.updateMatrixWorld(true); }
  // ---- moss cushions on every block, drops hugging all blocks
  const hug = placed.map((q) => q.mesh), mossOpt = { ...MOSS_DEFAULT, ...r.moss }, up = new THREE.Raycaster(), Yv = new THREE.Vector3(0, 1, 0);
  // no moss where another block sits right on top (hidden, and it would poke out between the blocks)
  const covered = (own: THREE.Mesh) => (p: THREE.Vector3) => { up.set(p.clone().addScaledVector(Yv, 0.05), Yv); up.far = 1.2 * Hh; return up.intersectObjects(hug.filter((m) => m !== own), false).length > 0; };
  const rocks: THREE.BufferGeometry[] = [], moss: THREE.BufferGeometry[] = [], tops: { c: THREE.Vector3; area: number }[] = [], foot: RockKit['foot'] = []; let loops = 0;
  for (let k = 0; k < placed.length; k++) {
    const { g, col } = placed[k];
    const mc = buildMossCap(g, hug, { ...mossOpt, seed: r.seed * 31 + k, covered: covered(placed[k].mesh), top: colOf(r.palette, 'grass', 1), lip: colOf(r.palette, 'grass', 0) });
    if (mc) { moss.push(mc.geo); tops.push(...mc.tops); loops += mc.loops; }
    const flat = toCreasedNormals(g, (r.creaseDeg * Math.PI) / 180); paint(flat, col); rocks.push(flat);
    const p = g.attributes.position; let cx = 0, cz = 0, n = 0; for (let i = 0; i < p.count; i++) if (Math.abs(p.getY(i)) < 0.4) { cx += p.getX(i); cz += p.getZ(i); n++; }
    if (n) { cx /= n; cz /= n; let rr = 0; for (let i = 0; i < p.count; i++) if (Math.abs(p.getY(i)) < 0.4) rr = Math.max(rr, Math.hypot(p.getX(i) - cx, p.getZ(i) - cz)); foot.push({ x: cx, z: cz, r: rr }); }
  }
  const outside = (x: number, z: number, m: number) => foot.every((f) => Math.hypot(x - f.x, z - f.z) > f.r + m);
  const ringPoint = (a: number, m: number) => { for (let d = 0.5; d < 4 * Hh; d += 0.08) { const x = Math.sin(a) * d, z = Math.cos(a) * d; if (outside(x, z, m)) return new THREE.Vector3(x, 0, z); } return new THREE.Vector3(Math.sin(a) * 4 * Hh, 0, Math.cos(a) * 4 * Hh); };
  // ---- pebbles (KayKit Rock_3: rounded), chipped off at the front foot
  const pebbles: THREE.BufferGeometry[] = [];
  for (let k = 0; k < r.pebbles; k++) { const g0 = await loadKK(r.pebbleIds[Math.floor(R() * r.pebbleIds.length)]), b = g0.boundingBox!, s = (0.16 + 0.1 * R()) * Hh / b.max.y, p = ringPoint((k - (r.pebbles - 1) / 2) * 0.5 + 0.3 + (R() - 0.5) * 0.2, 0.15 + 0.3 * R());
    const g = g0.clone(); g.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(p.x, -0.3 * s * b.max.y, p.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, R() * 6.28, 0)), new THREE.Vector3(s, s, s)));
    roundEdges(g, 1); const f = toCreasedNormals(g, (r.creaseDeg * Math.PI) / 180); paint(f, stoneB); pebbles.push(f); }
  // ---- succulent rosettes: a nest of 3 at the shady front-left foot, the rest on mossy ledges (not the top)
  const plantGeos: THREE.BufferGeometry[] = [], leaf = colOf(r.palette, 'leaf', 1);
  const ledges = tops.filter((t) => t.c.y > 0.7 * Hh && t.c.y < (r.heightH - 0.4) * Hh).sort((p, q) => q.area - p.area);
  const onLedge = Math.max(0, r.plants - 3), atFoot = r.plants - onLedge;
  for (let k = 0; k < r.plants; k++) {
    const sp = await loadSpecies(r.plantIds[k % r.plantIds.length], 'bush'), g = sp.geo.clone(); g.computeBoundingBox(); const bb = g.boundingBox!, dia = Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z);
    const s = ((r.plantDiaH[0] + (r.plantDiaH[1] - r.plantDiaH[0]) * R()) * Hh) / dia;
    let pos: THREE.Vector3;
    if (k < atFoot) pos = ringPoint(-0.7 + (k - 1) * 0.38 + (R() - 0.5) * 0.12, 0.05 * Hh);   // just outside the foot line, against the rock
    else { const t = ledges[Math.min(ledges.length - 1, (k - atFoot) * 4)]; pos = t ? t.c.clone() : ringPoint(1.4 + k, 0); }
    g.applyMatrix4(new THREE.Matrix4().compose(pos.setY(pos.y - 0.1 * s * (bb.max.y - bb.min.y)), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, R() * 6.28, 0)), new THREE.Vector3(s, s, s)));
    const shade = g.attributes.envShade, c = new Float32Array(g.attributes.position.count * 3);
    for (let i = 0; i < g.attributes.position.count; i++) { const sh = shade ? Math.max(0.7, Math.min(1.3, shade.getX(i))) : 1; c[i * 3] = leaf.r * sh; c[i * 3 + 1] = leaf.g * sh; c[i * 3 + 2] = leaf.b * sh; }
    for (const k2 of Object.keys(g.attributes)) if (!['position', 'normal'].includes(k2)) g.deleteAttribute(k2);
    g.setAttribute('color', new THREE.BufferAttribute(c, 3)); plantGeos.push(g);
  }
  const strip = (g: THREE.BufferGeometry) => { for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'color'].includes(k)) g.deleteAttribute(k); return g.index ? g.toNonIndexed() : g; };
  const rockGeo = mergeGeometries([...rocks, ...pebbles].map(strip))!, mossGeo = moss.length ? mergeGeometries(moss.map(strip))! : null, plantGeo = plantGeos.length ? mergeGeometries(plantGeos.map(strip))! : null;
  const group = new THREE.Group(); group.name = 'rock-formation:' + r.variant + ':' + r.seed;
  const add = (g: THREE.BufferGeometry | null, cls: 'rock' | 'nature', name: string, seed: number) => { if (!g) return; claySeed(g, seed); const m = new THREE.Mesh(g, clayMaterial(cls, new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, roughness: 0.9 }))); m.name = name; m.castShadow = m.receiveShadow = true; group.add(m); };
  add(rockGeo, 'rock', 'rock', r.seed); add(mossGeo, 'nature', 'moss', r.seed + 1); add(plantGeo, 'nature', 'plants', r.seed + 2);
  const t = (g: THREE.BufferGeometry | null) => (g ? g.attributes.position.count / 3 : 0), pebT = pebbles.reduce((a, g) => a + g.attributes.position.count / 3, 0);
  const box = new THREE.Box3().setFromObject(group), vb = new THREE.Box3();
  for (const g of [rockGeo, mossGeo, plantGeo]) if (g) { const p = g.attributes.position; for (let i = 0; i < p.count; i++) { tv.fromBufferAttribute(p, i); if (tv.y >= 0) vb.expandByPoint(tv); } }
  return { group, recipe: r as any, foot, blocks: placed.length, mossLoops: loops,
    tris: { rock: t(rockGeo) - pebT, moss: t(mossGeo), plants: t(plantGeo), pebbles: pebT, total: t(rockGeo) + t(mossGeo) + t(plantGeo) },
    size: { heightH: +(vb.max.y / H).toFixed(2), widthH: +((vb.max.x - vb.min.x) / H).toFixed(2), depthH: +((vb.max.z - vb.min.z) / H).toFixed(2), belowH: +(-box.min.y / H).toFixed(2) } };
}
