// Phase C · C1b+C3 · V-112 / V-114: tunnels modelled into the island body. The O1 v7 bore stays 1:1 in the SDF; the Joyride TC1 portal,
// inner shell and lamps (per style) are joined to the organ body by an EXACT mesh boolean union with manifold-3d (Apache-2.0, 3.5.4,
// WASM local), so body and tunnel are ONE closed manifold mesh (no portal in front, no overlap, no plug, no z-fighting).
// This file: (1) manifold repair of the Surface-Nets body — touching sheets share edges / vertices (non-manifold); every vertex is split
// into its fan components connected through manifold edges (topology only, no vertex moves), (2) the manifold-3d bridge.
import * as THREE from 'three';
// @ts-ignore – manifold-3d ships its own d.ts; the wasm is served by Vite from node_modules (offline)
import Module from 'manifold-3d';
// @ts-ignore – Vite asset url
import wasmUrl from 'manifold-3d/manifold.wasm?url';

let MF: Promise<any> | null = null;
/** manifold-3d, loaded once (local wasm) */
export const manifoldLib = () => (MF ??= (Module as any)({ locateFile: () => wasmUrl }).then((w: any) => { w.setup(); return w; }));

/** weld by position, then split every vertex into the fan components of its triangles connected through 2-triangle (manifold) edges.
 *  Returns an indexed geometry (same attributes) whose edges each have ≤ 2 triangles and whose vertex fans are single components. */
export function makeManifold(geo: THREE.BufferGeometry, eps = 1e-5) {
  const pos = geo.attributes.position, col = geo.attributes.color as THREE.BufferAttribute | undefined, n = pos.count, q = 1 / eps;
  const weld = new Int32Array(n), map = new Map<string, number>(), rep: number[] = [];
  for (let i = 0; i < n; i++) { const k = Math.round(pos.getX(i) * q) + ',' + Math.round(pos.getY(i) * q) + ',' + Math.round(pos.getZ(i) * q);
    let id = map.get(k); if (id === undefined) { id = map.size; map.set(k, id); rep.push(i); } weld[i] = id; }
  const idx = geo.index ? geo.index.array : null, T0 = (idx ? idx.length : n) / 3, tri: number[] = [];
  for (let t = 0; t < T0; t++) { const a = weld[idx ? idx[t * 3] : t * 3], b = weld[idx ? idx[t * 3 + 1] : t * 3 + 1], c = weld[idx ? idx[t * 3 + 2] : t * 3 + 2]; if (a !== b && b !== c && a !== c) tri.push(a, b, c); }
  const T = tri.length / 3, V = map.size, ek = (u: number, v: number) => (u < v ? u * V + v : v * V + u);
  const edgeTris = new Map<number, number[]>();
  for (let t = 0; t < T; t++) for (let e = 0; e < 3; e++) { const k = ek(tri[t * 3 + e], tri[t * 3 + (e + 1) % 3]); let L = edgeTris.get(k); if (!L) edgeTris.set(k, (L = [])); L.push(t); }
  // vertex → incident triangles
  const vt: number[][] = Array.from({ length: V }, () => []); for (let t = 0; t < T; t++) for (let e = 0; e < 3; e++) vt[tri[t * 3 + e]].push(t);
  const newId = new Int32Array(T * 3).fill(-1), srcOf: number[] = []; let splitVerts = 0;
  for (let v = 0; v < V; v++) {
    const ts = vt[v], comp = new Map<number, number>(); let nc = 0;
    for (const t0 of ts) { if (comp.has(t0)) continue; const c = nc++; const st = [t0]; comp.set(t0, c);
      while (st.length) { const t = st.pop()!; for (let e = 0; e < 3; e++) { const a = tri[t * 3 + e], b = tri[t * 3 + (e + 1) % 3]; if (a !== v && b !== v) continue;
        const L = edgeTris.get(ek(a, b))!; if (L.length !== 2) continue; const o = L[0] === t ? L[1] : L[0]; if (!comp.has(o)) { comp.set(o, c); st.push(o); } } } }
    if (nc > 1) splitVerts += nc - 1;
    const base = srcOf.length; for (let c = 0; c < nc; c++) srcOf.push(v);
    for (const t of ts) for (let e = 0; e < 3; e++) if (tri[t * 3 + e] === v) newId[t * 3 + e] = base + comp.get(t)!;
  }
  const P = new Float32Array(srcOf.length * 3), C = col ? new Float32Array(srcOf.length * 3) : null;
  srcOf.forEach((v, i) => { const s = rep[v]; P[i * 3] = pos.getX(s); P[i * 3 + 1] = pos.getY(s); P[i * 3 + 2] = pos.getZ(s); if (C && col) { C[i * 3] = col.getX(s); C[i * 3 + 1] = col.getY(s); C[i * 3 + 2] = col.getZ(s); } });
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(P, 3)); if (C) g.setAttribute('color', new THREE.BufferAttribute(C, 3));
  g.setIndex(Array.from(newId)); g.computeVertexNormals();
  return { geometry: g, splitVerts, tris: T };
}

/** THREE geometry (indexed, manifold) → manifold-3d Manifold; properties = position (+ colour) */
export function toManifold(w: any, geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position, col = geo.attributes.color, np = col ? 6 : 3, vp = new Float32Array(pos.count * np);
  for (let i = 0; i < pos.count; i++) { vp[i * np] = pos.getX(i); vp[i * np + 1] = pos.getY(i); vp[i * np + 2] = pos.getZ(i); if (col) { vp[i * np + 3] = col.getX(i); vp[i * np + 4] = col.getY(i); vp[i * np + 5] = col.getZ(i); } }
  const mesh = new w.Mesh({ numProp: np, vertProperties: vp, triVerts: new Uint32Array(geo.index!.array as ArrayLike<number>) });
  return new w.Manifold(mesh);
}

/** Manifold → THREE geometry; one group per original input (runOriginalID) so every source keeps its own material */
export function fromManifold(m: any, ids: number[]) {
  const mesh = m.getMesh(), np = mesh.numProp, vp = mesh.vertProperties, nv = vp.length / np;
  const P = new Float32Array(nv * 3), C = np >= 6 ? new Float32Array(nv * 3) : null;
  for (let i = 0; i < nv; i++) { P[i * 3] = vp[i * np]; P[i * 3 + 1] = vp[i * np + 1]; P[i * 3 + 2] = vp[i * np + 2]; if (C) { C[i * 3] = vp[i * np + 3]; C[i * 3 + 1] = vp[i * np + 4]; C[i * 3 + 2] = vp[i * np + 5]; } }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(P, 3)); if (C) g.setAttribute('color', new THREE.BufferAttribute(C, 3));
  g.setIndex(Array.from(mesh.triVerts as Uint32Array));
  const runIndex = mesh.runIndex as Uint32Array, runOrig = mesh.runOriginalID as Uint32Array;
  for (let r = 0; r < runOrig.length; r++) { const mat = Math.max(0, ids.indexOf(runOrig[r])); g.addGroup(runIndex[r], runIndex[r + 1] - runIndex[r], mat); }
  g.computeVertexNormals();
  return g;
}

/** topology check on the INDEX (no welding): edges with 1 / > 2 triangles, and 2-triangle edges walked in the same direction (orientation) */
export function topoCheck(geo: THREE.BufferGeometry) {
  const idx = geo.index!.array, T = idx.length / 3, V = geo.attributes.position.count, use = new Map<number, number[]>();
  for (let t = 0; t < T; t++) for (let e = 0; e < 3; e++) { const a = idx[t * 3 + e], b = idx[t * 3 + (e + 1) % 3], k = a < b ? a * V + b : b * V + a; let L = use.get(k); if (!L) use.set(k, (L = [])); L.push(a < b ? 1 : -1); }
  let open = 0, multi = 0, flipped = 0; for (const L of use.values()) { if (L.length === 1) open++; else if (L.length > 2) multi++; else if (L[0] === L[1]) flipped++; }
  return { open, multi, flipped };
}
