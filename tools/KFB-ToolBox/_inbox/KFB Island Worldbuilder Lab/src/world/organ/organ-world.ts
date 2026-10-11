// Phase C · C1b + C3 (Steuerung 11.10., V-109): the new default world of the hub — Organ-Inseln O1 (v7 ring mode, LAB fork) with the
// Joyride J17 road + clay strand (LAB fork of track-look v5), built into the Lab's ONE renderer / light owner (light.ts) / sky owner
// (sky.ts). This file is the Lab host only:
//   · units: the O1 world is in Track Core metres; its group is scaled by RACE_W (track metre → lab, as the RKIT drive) after the build
//   · J17 track: chunks of CHUNK samples along every drivable run, each a THREE.LOD with three sample strides (performance target
//     ≤ 250k visible triangles, Steuerung); strand + road + lips + boost arrows
//   · organs: the template's own Light tier by default, Hero when the camera comes close (O1 has both tiers); the island cast only near
//   · tunnel lights (O1 v5): positions handed to the light.ts pool (nearest 4)
//   · walk surface: hex hub tiles + the J17 road chunks near the hub; strand = wall; spawn on the hub beside the parked car
import * as THREE from 'three';
// @ts-ignore – LAB fork, plain JS
import { buildOrganWorld, sampField, gradField, surfaceNetsField } from './vendor/lab-organ/organ-world.lab.js';
// @ts-ignore – LAB fork, plain JS
import { makeJ17Materials, prepJ17, buildJ17Chunk, buildJ17Lips, buildJ17Pads, buildJ17Markings } from './vendor/j17/lab-track/j17-track.lab.js';
import { RACE_W } from '../../play/camera';
import { buildSurfaceField } from '../../play/surface';
import type { WorldLight } from '../light';
import { meshCheck, surfaceDistance, keepLargeComponents, farClusters, componentSizes } from './mesh-check';
import { manifoldLib, makeManifold, toManifold, fromManifold, topoCheck } from './tunnel-join';
import { insertTunnelsIntoBody, type TunnelJoinReport } from '../tunnel/tunnel-host';
import { shapeFieldTunnels, fieldTunnelParts } from '../tunnel/tunnel-field';
import { seedGeometry, makeClayMaterial, PROFILES as CLAY_PROFILES } from './vendor/lab-clay/clay-material.v10nb.js';
import { loadRkitParts } from '../../island/rkit-parts';
import { buildC4cFurniture } from './c4c-furniture';
import { claySeed } from '../../clay';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
// @ts-ignore – vendored plain JS
import { hexMetrics, hexToWorld, neighbor } from './vendor/lab-organ/../vendor-hex/hex-grid.js';

/** chunk length in samples (O1 ds 0.5 m → 120 m) and LOD levels [sample stride, from distance in lab] */
export const ORGAN_LOD = { chunk: 240, levels: [[3, 0], [8, 250], [24, 900]] as [number, number][], heroIn: 900, heroOut: 1000, castWithin: 700 };

export async function createOrganWorld(o: { scene: THREE.Scene; renderer: THREE.WebGLRenderer; light: WorldLight; onNote?: (n: string) => void }) {
  const t0 = performance.now();
  // V-116: organ BODIES meshed with manifold-3d levelSet on O1's own field (guaranteed manifold, oriented); ?mesher=sn = O1 Surface Nets.
  // Grid = O1's own cell (lsK 1, same lattice: thin walls kept) → manifold-3d simplify (lsTol 0.25 cell) → refineToLength 1.5 cells (long triangles
  // stretched colour and light: pale patches, straight edges; Steuerung V-116 A.2) ≈ SN △ count; normals from O1's field gradient (as SN)
  const qs = new URLSearchParams(location.search), LS = qs.get('mesher') !== 'sn', LS_K = Number(qs.get('lsK') ?? 1), LS_TOL = Number(qs.get('lsTol') ?? 0.25), LS_EPS = Number(qs.get('lsEps') ?? -1), LS_PROJ = qs.get('lsProj') !== '0', LS_LEVEL = Number(qs.get('lsLevel') ?? 0), LS_SPECK = Number(qs.get('lsSpeck') ?? 24), LS_REFINE = Number(qs.get('lsRefine') ?? 1.5), LS_LFH = qs.get('lsLight') !== 'own', heroCache = new Map<string, any>(), meshStats: any[] = [];
  const mesher = LS ? async (G: any, tk: string, spec: any) => { const w = await manifoldLib(), { nx, ny, nz, o: go, h } = G, t0 = performance.now();
    // O1's island rule decided on O1's own Surface-Nets topology (dropIslands 200 △ / 2 %): the cells of dropped SN parts are set outside in a
    // copy of the field, so levelSet cannot keep them by a thin bridge (Herz: the free „Truncus-Rest“, v7 Befund C2). Corners shared with kept
    // cells stay untouched (kept surface unchanged).
    const sn = (surfaceNetsField as any)(G, 1), nV = sn.P.length / 3, par = new Int32Array(nV); for (let i = 0; i < nV; i++) par[i] = i;
    const fr = (x: number) => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
    for (let t = 0; t < sn.idx.length; t += 3) { const a = fr(sn.idx[t]), b = fr(sn.idx[t + 1]), c = fr(sn.idx[t + 2]); par[a] = b; par[fr(c)] = fr(b); }
    const cnt = new Map<number, number>(); for (let t = 0; t < sn.idx.length; t += 3) { const r = fr(sn.idx[t]); cnt.set(r, (cnt.get(r) ?? 0) + 1); }
    const big = Math.max(0, ...cnt.values()), lim = Math.max(200, big * 0.02), used = new Int8Array(nV);   // 1 kept, 2 dropped
    for (let t = 0; t < sn.idx.length; t += 3) { const keep = (cnt.get(fr(sn.idx[t])) ?? 0) >= lim ? 1 : 2; for (let e = 0; e < 3; e++) used[sn.idx[t + e]] = keep; }
    const cellOf = (v: number) => [Math.min(nx - 2, Math.max(0, Math.floor((sn.P[v * 3] - go[0]) / h))), Math.min(ny - 2, Math.max(0, Math.floor((sn.P[v * 3 + 1] - go[1]) / h))), Math.min(nz - 2, Math.max(0, Math.floor((sn.P[v * 3 + 2] - go[2]) / h)))];
    // removal (Steuerung V-116 A.1): mask = the corners of the dropped SN part's cells, widened by ½ cell (+ their 6-neighbours); an inside
    // corner of the mask is set outside only if it lies nearer to the dropped part's SN surface than to the kept SN surface → the part goes,
    // a thin wall it leans on keeps its inside corners (no hole)
    const keptCorner = new Set<number>(), dropBy = new Map<number, number[]>();
    for (let v = 0; v < nV; v++) { if (!used[v]) continue; const [i, j, k] = cellOf(v), r = fr(v); for (let c = 0; c < 8; c++) { const q = (i + (c & 1)) + nx * ((j + ((c >> 1) & 1)) + ny * (k + (c >> 2)));
      if (used[v] === 1) keptCorner.add(q); else { let L = dropBy.get(r); if (!L) dropBy.set(r, (L = [])); L.push(q); } } }
    let G2 = G, cleared = 0, keptBridged = 0; const dropSolid: number[] = [], dropVoid: number[] = [];
    if (dropBy.size && qs.get('lsClear') !== '0') { G2 = { ...G, V: Float32Array.from(G.V) };
      const hash = new Map<string, number[]>(), hk = (x: number, y: number, z: number) => Math.floor(x / (2 * h)) + ',' + Math.floor(y / (2 * h)) + ',' + Math.floor(z / (2 * h));
      for (let v = 0; v < nV; v++) if (used[v]) { const k = hk(sn.P[v * 3], sn.P[v * 3 + 1], sn.P[v * 3 + 2]); let L = hash.get(k); if (!L) hash.set(k, (L = [])); L.push(v); }
      const nearest = (x: number, y: number, z: number, kind: number) => { let best = Infinity; const ci = Math.floor(x / (2 * h)), cj = Math.floor(y / (2 * h)), ck = Math.floor(z / (2 * h));
        for (let a = -2; a <= 2; a++) for (let b2 = -2; b2 <= 2; b2++) for (let c = -2; c <= 2; c++) for (const v of hash.get((ci + a) + ',' + (cj + b2) + ',' + (ck + c)) ?? []) if (used[v] === kind) { const d = Math.hypot(sn.P[v * 3] - x, sn.P[v * 3 + 1] - y, sn.P[v * 3 + 2] - z); if (d < best) best = d; }
        return best; };
      for (const L of dropBy.values()) { const mask = new Set<number>(L); for (const q of L) { const i = q % nx, j = Math.floor(q / nx) % ny, k = Math.floor(q / (nx * ny));
          for (const [di, dj, dk] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) { const a = i + di, b2 = j + dj, c = k + dk; if (a >= 0 && b2 >= 0 && c >= 0 && a < nx && b2 < ny && c < nz) mask.add(a + nx * (b2 + ny * c)); } }
        // solid piece or enclosed void? field gradient (outward) vs. direction from the part's centre: a void is filled, a solid piece cleared
        const vs: number[] = []; for (let v = 0; v < nV; v++) if (used[v] === 2 && dropBy.get(fr(v)) === L) vs.push(v);
        const cx = vs.reduce((a, v) => a + sn.P[v * 3], 0) / vs.length, cy = vs.reduce((a, v) => a + sn.P[v * 3 + 1], 0) / vs.length, cz = vs.reduce((a, v) => a + sn.P[v * 3 + 2], 0) / vs.length;
        const gv = new THREE.Vector3(); let out = 0; for (const v of vs) { (gradField as any)(G, sn.P[v * 3], sn.P[v * 3 + 1], sn.P[v * 3 + 2], gv); out += gv.x * (sn.P[v * 3] - cx) + gv.y * (sn.P[v * 3 + 1] - cy) + gv.z * (sn.P[v * 3 + 2] - cz); }
        const solid = out > 0; let n = 0;
        for (const q of mask) { if ((G.V[q] < 0) !== solid) continue; const x = go[0] + (q % nx) * h, y = go[1] + (Math.floor(q / nx) % ny) * h, z = go[2] + Math.floor(q / (nx * ny)) * h;
          if (nearest(x, y, z, 2) < nearest(x, y, z, 1)) { G2.V[q] = solid ? 0.5 * h : -0.5 * h; n++; } }
        cleared += n; (solid ? dropSolid : dropVoid).push(vs.length); if (!n) keptBridged++; } }
    // V-116 local pinch fix (Steuerung: only where a hole appears): Surface Nets joins sub-cell-thin parts through NON-MANIFOLD edges (> 2 △);
    // levelSet would cut them apart (holes in thin vessel walls, Herz/Niere). At every such SN edge the outside corners of its two cells that lie
    // within ½ cell of the surface are set just inside: a bridge of ≤ ½ cell keeps O1's connectivity. Nothing else in the field changes.
    let pinchFix = 0;
    if (qs.get('lsPinch') !== '0') { const E = new Map<number, number>(), K = (a: number, b: number) => (a < b ? a * nV + b : b * nV + a);
      for (let t = 0; t < sn.idx.length; t += 3) for (let e = 0; e < 3; e++) { const k = K(sn.idx[t + e], sn.idx[t + (e + 1) % 3]); E.set(k, (E.get(k) ?? 0) + 1); }
      for (const [k, n] of E) { if (n <= 2) continue; for (const v of [Math.floor(k / nV), k % nV]) { if (used[v] !== 1) continue; const [i, j, kk] = cellOf(v);
        for (let c = 0; c < 8; c++) { const q = (i + (c & 1)) + nx * ((j + ((c >> 1) & 1)) + ny * (kk + (c >> 2))), V2 = G2 === G ? (G2 = { ...G, V: Float32Array.from(G.V) }).V : G2.V; if (V2[q] > 0 && V2[q] < 0.5 * h) { V2[q] = -0.05 * h; pinchFix++; } } } } }
    // V-116 thin walls (Light Aorta perforated): Surface Nets puts ONE vertex in every sign-change cell, so the inside corners of a cell always
    // act as one piece; levelSet connects them only along cube edges. Per cell: while its inside corners form > 1 piece (cube-edge connected),
    // the outside corner nearest to zero that joins two pieces is set just inside (only corners < ½ cell from zero; local, ≤ ½ cell)
    let ambFix = 0;
    if (qs.get('lsAmb') !== '0') { if (G2 === G) G2 = { ...G, V: Float32Array.from(G.V) }; const V2 = G2.V, OFF = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
      const NB = OFF.map((_, c) => [c ^ 1, c ^ 2, c ^ 4]), q8 = new Int32Array(8), lab = new Int8Array(8);
      const pieces = () => { lab.fill(-1); let n = 0; for (let c = 0; c < 8; c++) { if (V2[q8[c]] >= 0 || lab[c] >= 0) continue; const st = [c]; lab[c] = n; while (st.length) { const x = st.pop()!; for (const y of NB[x]) if (V2[q8[y]] < 0 && lab[y] < 0) { lab[y] = n; st.push(y); } } n++; } return n; };
      for (let k = 0; k < nz - 1; k++) for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
        for (let c = 0; c < 8; c++) q8[c] = (i + OFF[c][0]) + nx * ((j + OFF[c][1]) + ny * (k + OFF[c][2]));
        let guard = 0; while (pieces() > 1 && guard++ < 4) { let best = -1, bv = 0.5 * h;
          for (let c = 0; c < 8; c++) { if (V2[q8[c]] < 0) continue; const ls = new Set<number>(); for (const y of NB[c]) if (lab[y] >= 0) ls.add(lab[y]); if (ls.size > 1 && V2[q8[c]] < bv) { bv = V2[q8[c]]; best = c; } }
          if (best < 0) break; V2[q8[best]] = -0.02 * h; ambFix++; } } }
    // V-116 sub-cell slits (Light Aorta: field hovers ±0.2 cell inside the tube, levelSet shows it as foam with holes; Surface Nets' one vertex per
    // cell closes it): an outside corner within lsGap cell of zero with inside neighbours on BOTH sides along an axis is set just inside (2 passes)
    let gapFix = 0; const LS_GAP = Number(qs.get('lsGap') ?? 0.35);
    if (LS_GAP > 0) { if (G2 === G) G2 = { ...G, V: Float32Array.from(G.V) }; const V2 = G2.V, sx = 1, sy = nx, sz = nx * ny;
      for (let pass = 0; pass < 2; pass++) { const add: number[] = [];
        for (let k = 1; k < nz - 1; k++) for (let j = 1; j < ny - 1; j++) for (let i = 1; i < nx - 1; i++) { const q = i + nx * (j + ny * k), v = V2[q]; if (v <= 0 || v >= LS_GAP * h) continue;
          if ((V2[q - sx] < 0 && V2[q + sx] < 0) || (V2[q - sy] < 0 && V2[q + sy] < 0) || (V2[q - sz] < 0 && V2[q + sz] < 0)) add.push(q); }
        for (const q of add) V2[q] = -0.02 * h; gapFix += add.length; if (!add.length) break; } }
    // V-116 flat foam (Light Aorta: the field hovers within ±0.35 cell of zero over whole regions; Surface Nets' per-cell vertices draw it as
    // one smooth skin, levelSet as a box foam with square holes): a corner whose 26 neighbours all lie within lsFoam cell of zero is set inside
    let foamFix = 0; const LS_FOAM = Number(qs.get('lsFoam') ?? 0);
    if (LS_FOAM > 0) { if (G2 === G) G2 = { ...G, V: Float32Array.from(G.V) }; const V2 = G2.V, lim = LS_FOAM * h, add: number[] = [];
      for (let k = 1; k < nz - 1; k++) for (let j = 1; j < ny - 1; j++) for (let i = 1; i < nx - 1; i++) { const q = i + nx * (j + ny * k); if (V2[q] <= 0 || V2[q] >= lim) continue; let flat = true;
        for (let c = -1; c <= 1 && flat; c++) for (let b2 = -1; b2 <= 1 && flat; b2++) for (let a = -1; a <= 1; a++) if (Math.abs(V2[q + a + nx * (b2 + ny * c)]) >= lim) { flat = false; break; }
        if (flat) add.push(q); }
      for (const q of add) V2[q] = -0.02 * h; foamFix = add.length; }
    // the grid border: points beyond O1's grid are OUTSIDE (padding 2 cells, same lattice) → a closed cap where the field reaches the border
    // instead of manifold-3d's egg-crate closing
    const inG = (x: number, y: number, z: number) => x >= go[0] && y >= go[1] && z >= go[2] && x <= go[0] + (nx - 1) * h && y <= go[1] + (ny - 1) * h && z <= go[2] + (nz - 1) * h;
    // V-116 Light from the Hero body (?lsLight=own = O1's Light field): O1's Light field (down2 + carve) has sub-cell walls (Aorta: square
    // holes in levelSet at every grid size); the Light body is the Hero levelSet body simplified to the Light tolerance, projected on the Hero field
    const HC = tk === 'light' && LS_LFH ? heroCache.get(spec.id) : null, Gp = HC ? HC.G : G2, hp = HC ? HC.h : h;
    const m0 = HC ? HC.m1 : w.Manifold.levelSet((p: number[]) => (inG(p[0], p[1], p[2]) ? -(sampField as any)(G2, p[0], p[1], p[2]) : -h), { min: [go[0] - 2 * h, go[1] - 2 * h, go[2] - 2 * h], max: [go[0] + (nx + 1) * h, go[1] + (ny + 1) * h, go[2] + (nz + 1) * h] }, h * LS_K, -LS_LEVEL * h, LS_EPS > 0 ? h * LS_EPS : -1);
    // ?lsTol = manifold-3d simplify (surfaces move < lsTol cells, stays manifold): fine grid for thin walls, then back to the triangle budget
    // levelSet-only specks (< lsSpeck △ on the fine grid, before simplify) are dropped; larger parts stay: they lie on O1's kept surface and are
    // only separate because Surface Nets joined them through a pinch (O1's free parts were already removed in the field above);
    // O1's own dropIslands is skipped for the mesher (LAB PATCH 9c): after simplify a kept part could fall under 200 △ (Niere light)
    const parts = m0.decompose(), keepP = parts.filter((x: any) => x.numTri() >= LS_SPECK);
    const m1 = keepP.length === parts.length ? m0 : w.Manifold.compose(keepP), lsDropped = parts.length - keepP.length;
    if (tk === 'hero') heroCache.set(spec.id, { m1, G: G2, h });
    // ?lsRefine = refineToLength (cells) after simplify: long simplified triangles split again (colour / normal sampling density)
    const ms0 = LS_TOL > 0 ? m1.simplify(h * LS_TOL) : m1, m = LS_REFINE > 0 ? ms0.refineToLength(h * LS_REFINE) : ms0, trisGrid = m0.numTri();
    const mesh = m.getMesh(), np = mesh.numProp, vp = mesh.vertProperties, nv = vp.length / np, P = new Float32Array(nv * 3), N = new Float32Array(nv * 3), g = new THREE.Vector3();
    // projection onto the isosurface as Surface Nets does (O1 „Projektion trilinear“): two Newton steps x −= f·∇f/|∇f|², each ≤ ½ cell
    for (let i = 0; i < nv; i++) { let x = vp[i * np], y = vp[i * np + 1], z = vp[i * np + 2];
      for (let it = 0; it < (LS_PROJ ? 2 : 0); it++) { const f = (sampField as any)(Gp, x, y, z); (gradField as any)(Gp, x, y, z, g); const gl2 = g.lengthSq() / (hp * hp); if (gl2 < 1e-10) break;
        let sx = (f * g.x / hp) / gl2, sy = (f * g.y / hp) / gl2, sz = (f * g.z / hp) / gl2; const sl = Math.hypot(sx, sy, sz), cap = 0.5 * hp; if (sl > cap) { sx *= cap / sl; sy *= cap / sl; sz *= cap / sl; } x -= sx; y -= sy; z -= sz; }
      P[i * 3] = x; P[i * 3 + 1] = y; P[i * 3 + 2] = z; (gradField as any)(Gp, x, y, z, g); g.normalize(); N[i * 3] = g.x; N[i * 3 + 1] = g.y; N[i * 3 + 2] = g.z; }
    // the projection can put two distinct levelSet vertices on one spot (a pinch between two lobes): drawn and welded that edge has 4 faces.
    // Each copy moves 0.002 cell towards the centroid of its own faces (invisible; the manifold's topology is unchanged). Prototype bodies only (no rollout before OK)
    let pinchSplit = 0; if (FIELD_IDS.has(spec.id)) { const tvA = mesh.triVerts as Uint32Array, key = new Map<string, number[]>(); for (let i = 0; i < nv; i++) { const k = Math.round(P[i * 3] * 1e5) + ',' + Math.round(P[i * 3 + 1] * 1e5) + ',' + Math.round(P[i * 3 + 2] * 1e5); let L = key.get(k); if (!L) key.set(k, (L = [])); L.push(i); }
      const dup = new Set<number>(); for (const L of key.values()) if (L.length > 1) L.forEach((i) => dup.add(i));
      if (dup.size) { const acc = new Float64Array(nv * 4); for (let t = 0; t < tvA.length; t += 3) { const cx = (P[tvA[t] * 3] + P[tvA[t + 1] * 3] + P[tvA[t + 2] * 3]) / 3, cy = (P[tvA[t] * 3 + 1] + P[tvA[t + 1] * 3 + 1] + P[tvA[t + 2] * 3 + 1]) / 3, cz = (P[tvA[t] * 3 + 2] + P[tvA[t + 1] * 3 + 2] + P[tvA[t + 2] * 3 + 2]) / 3;
          for (let e = 0; e < 3; e++) { const v = tvA[t + e]; if (!dup.has(v)) continue; acc[v * 4] += cx; acc[v * 4 + 1] += cy; acc[v * 4 + 2] += cz; acc[v * 4 + 3]++; } }
        for (const v of dup) { if (!acc[v * 4 + 3]) continue; const dx = acc[v * 4] / acc[v * 4 + 3] - P[v * 3], dy = acc[v * 4 + 1] / acc[v * 4 + 3] - P[v * 3 + 1], dz = acc[v * 4 + 2] / acc[v * 4 + 3] - P[v * 3 + 2], l = Math.hypot(dx, dy, dz) || 1;
          P[v * 3] += dx / l * h * 0.002; P[v * 3 + 1] += dy / l * h * 0.002; P[v * 3 + 2] += dz / l * h * 0.002; pinchSplit++; } } }
    meshStats.push({ pinchSplit, id: spec.id, tier: tk, ms: Math.round(performance.now() - t0), tris: mesh.triVerts.length / 3, trisGrid, fromHero: !!HC, snDropped: [...cnt.values()].filter((n) => n < lim).length, cellsCleared: cleared, ambFix, gapFix, foamFix, dropSolid, dropVoid, keptBridged, pinchFix, lsDropped, status: m.status ? m.status() : null });
    if (qs.get('lsNorm') === 'mesh') { const g2 = new THREE.BufferGeometry(); g2.setAttribute('position', new THREE.BufferAttribute(P, 3)); g2.setIndex(Array.from(mesh.triVerts as Uint32Array)); g2.computeVertexNormals(); N.set(g2.attributes.normal.array as Float32Array); }
    // LAB PATCH 9d: O1 paints the kept Surface-Nets vertices of this field; levelSet vertices take their neighbour mean (same colour field)
    const ref: number[] = []; for (let v = 0; v < nV; v++) if (used[v] === 1) ref.push(sn.P[v * 3], sn.P[v * 3 + 1], sn.P[v * 3 + 2]);
    return { P, N, idx: Array.from(mesh.triVerts as Uint32Array), islandsDone: true, ref: qs.get('lsPaint') === 'own' ? null : new Float32Array(ref) }; } : null;
  const TC1 = qs.get('tc1') !== '0';   // V-112: TC1 tunnels joined into the bodies (?tc1=0 = O1 bore + collars only)
  // Prototyp „Tunnel im Feld“ (Konzept C1b_C3 R1 (a), Steuerung 11.10.: ein Körper + race_tube): ?tunnelField=hirn shapes that body's field
  // (tunnel interior + deck socket) before its levelSet; its TC1 parts are only the projected band beads / lamp domes
  const FIELD_IDS = new Set((qs.get('tunnelField') ?? '').split(',').filter(Boolean)), fieldTun = new Map<string, Record<string, { ft: any[]; G: any; M: THREE.Matrix4 }>>();
  const fieldHook = FIELD_IDS.size && LS ? (B: any, G: any, tk: string, stream: any) => { if (!FIELD_IDS.has(B.id) || !stream) return;
    const J = stream.joints || [], pieceAt = (i: number) => { let pc = ''; for (const j of J) if (j.index <= i) pc = j.piece; return pc; };
    const segs = (stream.tunnels || []).filter((t: any) => pieceAt(t.i0).includes(B.id)); if (!segs.length) return;
    B.fieldTunnel = true; B.root.updateMatrixWorld(true); const M = B.root.matrixWorld.clone(), ft = shapeFieldTunnels(G, M, stream, segs);
    const e = fieldTun.get(B.id) ?? {}; e[tk] = { ft, G, M }; fieldTun.set(B.id, e); } : null;
  const W: any = await (buildOrganWorld as any)({ scene: o.scene, renderer: o.renderer, onNote: o.onNote ?? (() => {}), mesher, collars: !TC1, fieldHook });
  // C4a (Steuerung 11.10.): Track Core 0.16.1 B7 Haltebucht on the hex side of the hub straight (LAB PATCH G in j17-track.lab.js): bay
  // 24 m on the right, centred 114 m into isle_HX, where one hex tile lies under the whole bay + both 13.2 m transitions (3 MC = 19.2 lab);
  // the car parks beside it, the figure spawns on its platform. ?bay=0 = the former closed hub straight
  const td = W.stream, hxJ = td.joints.find((j: any) => j.piece === 'isle_HX'), hxS = td.samples[hxJ.index].s, BAY = qs.get('bay') === '0' ? null : { side: 1, s0: hxS + 102, s1: hxS + 126, L: 19.2 / RACE_W };
  const BAY_RKIT = !!BAY && qs.get('bayParts') !== '0';   // V-138: RKIT kerb + sidewalk + edge stones (public/roadbeds/hex_b7.parts.glb); ?bayParts=0 = the C4a clay platform
  // C4c (LAB PATCH I): open bande spans from Track Core's edge ends (EXIT _div, ENTRY _conv, the plaza) → the J17 bande ends in the B7 head and dives
  // under; on the ring only the ends at the hub (the ring's other edge ends — tunnels, air gaps — keep today's look)
  const G4: any = (td as any).graph, HEAD_L = 19.2 / RACE_W;
  // an end at a nose (Track Core uturn within 12 m) ends in the nose tube: head length 0.6 instead of the B7 13 m (else the U stands alone)
  const noseCs = ((G4?.deck?.furniture) || []).filter((f: any) => f.kind === 'uturn').map((f: any) => f.c), atNose = (e: any) => noseCs.some((c: number[]) => Math.hypot(c[0] - e.p[0], c[2] - e.p[2]) < 12);
  const openSpans = (rid: string, within?: (s: number) => boolean) => { const out: any[] = [], ends = (G4?.edgeEnds || []).filter((e: any) => e.route === rid && (!within || within(e.s)));
    for (const sd of ['L', 'R']) { const E = ends.filter((e: any) => e.side === sd).sort((a: any, b: any) => a.s - b.s); let o: number | null = E.length && E[0].end === 'start' ? -1e9 : null;
      let oe: any = null; for (const e of E) { if (e.end === 'stop') { o = e.s; oe = e; } else if (o != null) { out.push({ side: sd === 'R' ? 1 : -1, s0: o, s1: e.s, L: HEAD_L, L0: oe && atNose(oe) ? 0.6 : HEAD_L, L1: atNose(e) ? 0.6 : HEAD_L, open: true }); o = null; oe = null; } }
      if (o != null) out.push({ side: sd === 'R' ? 1 : -1, s0: o, s1: 1e9, L: HEAD_L, L0: oe && atNose(oe) ? 0.6 : HEAD_L, open: true }); }
    return out; };
  const ringOpen = G4 ? openSpans('ring', (s) => s < 400 || s > td.samples[td.samples.length - 1].s - 400) : [];
  const pre: any = prepJ17(td, { bays: [...(BAY ? [BAY] : []), ...ringOpen], bayK: RACE_W, bayRkit: BAY_RKIT }), M: any = makeJ17Materials(W.U, 3);
  // V-053 near band (Steuerung 11.10.: accepted, difference < 1/255, default in this world); ?nearband=0 = clay v10 exactly
  W.U.uClayNearBand.value = new URLSearchParams(location.search).get('nearband') === '0' ? 0 : 1;
  const track = new THREE.Group(); track.name = 'j17-track'; W.world.add(track);
  const chunks: { lod: THREE.LOD; i0: number; i1: number; near: THREE.Group }[] = [];
  const S = td.samples, N = S.length, CH = ORGAN_LOD.chunk;
  let trisNear = 0, trisAll = 0;
  for (const [a, b] of pre.runs) {
    for (let i0 = a; i0 < b; i0 += CH) {
      const i1 = Math.min(b, i0 + CH), mid = S[(i0 + i1) >> 1].p, origin = new THREE.Vector3(mid[0], mid[1], mid[2]);
      const capStart = i0 === a && !(pre.joinSeam && a === 0), capEnd = i1 === b && !(pre.joinSeam && b === N - 1), wrapTo = pre.joinSeam && i1 === N - 1 ? 0 : -1;
      const lod = new THREE.LOD(); lod.position.copy(origin); lod.name = `j17-chunk-${i0}`; let near: THREE.Group | null = null;
      for (const [stride, dist] of ORGAN_LOD.levels) {
        const g = buildJ17Chunk(pre, i0, i1, stride, origin, { capStart, capEnd, wrapTo }), lvl = new THREE.Group();
        const ms = new THREE.Mesh(g.strang, M.strangT); ms.name = 'bande-strang'; const mr = new THREE.Mesh(g.road, M.road); mr.name = 'fahrbahn';
        for (const m of [ms, mr]) { m.castShadow = stride <= 2; m.receiveShadow = true; lvl.add(m); }
        lod.addLevel(lvl, dist); trisAll += g.tris; if (!near) { near = lvl; trisNear += g.tris; }
      }
      track.add(lod); chunks.push({ lod, i0, i1, near: near! });
    }
  }
  const lips = buildJ17Lips(pre); if (lips) { const m = new THREE.Mesh(lips, M.strang); m.name = 'bande-lippen'; m.castShadow = m.receiveShadow = true; track.add(m); }
  // J17 road markings M2, J17's track zone (bio −1, measured against p1b.v2 11.10.; ?m2zone=city = the former city zone) (LAB PATCH F; Steuerung 11.10.)
  // split into 200 m cells (frustum culling) and drawn only within 900 lab of the camera (like the road's far LOD: a 0.3 m line is sub-pixel there)
  let markInfo: any = null; const markCells: THREE.Mesh[] = [];
  try { const MK: any = (buildJ17Markings as any)(td, qs.get('m2zone') === 'city' ? 'city' : 'track'); markInfo = { ...MK.info, tris: 0, cells: 0 };
    for (const [role, mat] of [['hell', M.markH], ['signal', M.markS]] as const) { const g: THREE.BufferGeometry = MK[role]; if (!g) continue; const pos = g.attributes.position, idx = g.index!.array, cellsM = new Map<string, number[]>();
      for (let t = 0; t < idx.length; t += 3) { const a = idx[t] * 3, k = Math.floor((pos.array as any)[a] / 200) + ',' + Math.floor((pos.array as any)[a + 2] / 200); let L = cellsM.get(k); if (!L) cellsM.set(k, (L = [])); L.push(idx[t], idx[t + 1], idx[t + 2]); }
      for (const L of cellsM.values()) { const cg = new THREE.BufferGeometry(); for (const [n, at] of Object.entries(g.attributes)) cg.setAttribute(n, at); cg.setIndex(L);   /* attributes shared (one upload) */ const m = new THREE.Mesh(cg, mat); m.name = 'markierung-' + role; m.receiveShadow = true; { const bb = new THREE.Box3(), v = new THREE.Vector3(); for (const ix of L) bb.expandByPoint(v.fromBufferAttribute(pos as THREE.BufferAttribute, ix)); cg.boundingBox = bb; cg.boundingSphere = bb.getBoundingSphere(new THREE.Sphere()); }   /* own triangles only: the shared attribute spans the whole ring */ track.add(m); markCells.push(m); markInfo.tris += L.length / 3; markInfo.cells++; } } }
  catch (e: any) { markInfo = { error: String(e?.message ?? e) }; }
  const pads = buildJ17Pads(td); if (pads) { const m = new THREE.Mesh(pads, M.pad); m.name = 'boost'; m.receiveShadow = true; track.add(m); }
  // ---- C4c (LAB PATCH 16 graph, Steuerung 11.10.): the branch routes (exit → plaza → entry) drawn in the J17 look like the ring, one stream each
  const branchMeshes: THREE.Mesh[] = [], branchInfo: any[] = [];
  if (G4) for (const [rid, r] of Object.entries<any>(G4.routes)) { if (rid === 'ring') continue;
    for (const q of r.samples) { q.prm = q.prm || {}; if (!q.slots) q.slots = W.TC.profileSlots(q.prm); }
    const preB: any = prepJ17(r, { bays: openSpans(rid), bayK: RACE_W }), SB = r.samples, grp = new THREE.Group(); grp.name = 'c4-' + rid; track.add(grp);
    for (const [a, b] of preB.runs) { const mid = SB[(a + b) >> 1].p, origin = new THREE.Vector3(mid[0], mid[1], mid[2]), g = buildJ17Chunk(preB, a, b, 1, origin, { capStart: true, capEnd: true });
      for (const [geo, mat, nm] of [[g.strang, M.strangT, 'bande-strang'], [g.road, M.road, 'fahrbahn']] as any) { const m = new THREE.Mesh(geo, mat); m.name = nm; m.position.copy(origin); m.castShadow = m.receiveShadow = true; grp.add(m); branchMeshes.push(m); } }
    branchInfo.push({ id: rid, samples: SB.length, runs: preB.runs.length, open: preB.bays.length, length: +(SB[SB.length - 1].s - SB[0].s).toFixed(1) }); }
  // C4c furniture: gore + M2 Sperrfläche, noses, cushion, M2 arrows, zebra, RKIT bollards with a gate at the zebra (c4c-furniture.ts)
  let c4Info: any = null;
  if (G4) { try { const F = await buildC4cFurniture({ G4, M, seed: (g, n) => seedGeometry(THREE, g, n), RACE_W, poller: async () => (await loadRkitParts('/roadbeds/rkit_poller.parts.json', 'canyon')).group });
    track.add(F.group); for (const m of F.walk) branchMeshes.push(m); c4Info = F.info; } catch (e: any) { c4Info = { error: String(e?.message ?? e) }; } }
  // units: Track Core metres → lab
  W.world.scale.setScalar(RACE_W); W.world.updateMatrixWorld(true);
  // ---- V-112 / V-114 / V-127: TC1 tunnels (style ?tunnel=race_tube|stone_arch|stone_rect|mine, V-100 standard race_tube) joined into every
  // organ body and tier by exact booleans. O1 does not bore them (LAB PATCH 11); shell = ring + wall; the tube runs out to
  // the body's own face (findMouths: where the crown leaves the v7 Mündung sleeve) + 0.3 m, so the TC1 portal sits on the sleeve's face.
  const tunnelReports: any[] = []; let tunLightsTC1: THREE.Vector3[] = [];
  if (TC1 && LS) { o.onNote?.('Tunnel (TC1) werden eingesetzt …'); await new Promise((r) => setTimeout(r, 0)); const w = await manifoldLib(), lampMat = new THREE.MeshStandardMaterial({ color: 0xfff2c8, emissive: 0xffc15a, emissiveIntensity: 2.2, roughness: 0.5 }), J = td.joints || [];
    const pieceAt = (i: number) => { let pc = ''; for (const j of J) if (j.index <= i) pc = j.piece; return pc; }, style = qs.get('tunnel') ?? 'race_tube';
    W.world.updateMatrixWorld(true); const worldInv = W.world.matrixWorld.clone().invert();
    for (const B of W.built) { const segs = (td.tunnels || []).filter((t: any) => pieceAt(t.i0).includes(B.id)); if (!segs.length) continue;
      for (const [tk, T] of Object.entries<any>(B.tiers)) { const ms: THREE.Mesh[] = []; T.g.traverse((m: any) => { if (m.isMesh) ms.push(m); }); const body = ms[0];
        const toTrack = worldInv.clone().multiply(body.matrixWorld), t0 = performance.now();
        /* Light from the Hero body (V-116): its wall is the Hero field's, so bands, lamps and wall colour come from the Hero field tunnel */ const FT = fieldTun.get(B.id)?.[tk === 'light' && LS_LFH ? 'hero' : tk], pre = FT ? { built: FT.ft.map((f: any) => { const r = fieldTunnelParts(FT.G, FT.M, td, f); return { ...r, a0: r.a, a1: r.b, style: 'race_tube', wallPoly: f.grown }; }), mouths: FT.ft.map((f: any) => ({ mouthIn: f.mouthIn, mouthOut: f.mouthOut, found: [true, true] })) } : undefined;
        try { const r = insertTunnelsIntoBody(w, body, toTrack.clone().invert(), td, segs, { style, outer: { kind: 'wall' }, mouthExt: 12.5 }   /* LAB PATCH 11: O1 no longer bores TC1 tunnels → shell = ring + wall, ends at the face */, M, lampMat, (g, s2) => seedGeometry(THREE, g, s2), 11 + (B.spec.ang ?? 0), pre);
          tunnelReports.push({ id: B.id, tier: tk, ...r.report, totalMs: Math.round(performance.now() - t0) }); if (tk === 'hero') tunLightsTC1 = tunLightsTC1.concat(r.lights);
        } catch (e: any) { tunnelReports.push({ id: B.id, tier: tk, error: String(e?.message ?? e) }); } } } }
  // V-127 placeholder bodies (Steuerung 11.10., V-115): the organ bodies (not the TC1 parts) are drawn with a plain MeshStandardMaterial on
  // their vertex colours (no clay shader) while they are placeholders; ?organMat=clay = the clay material
  if (qs.get('organMat') !== 'clay') { const std = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0 });
    for (const B of W.built) for (const T of Object.values<any>(B.tiers)) T.g.traverse((m: any) => { if (m.isMesh && !/^tc1-|water|harnleiter/.test(m.name) && m.geometry.attributes.color) m.material = std; }); }
  W.setTier('light');
  // tunnel lights (O1 v5: 260 at metre scale, decay 2) → lab: positions × RACE_W, distance × RACE_W, intensity × RACE_W² (same light on the deck)
  // tunnel lights: TC1 lamp lights (one per module) where TC1 tunnels stand, otherwise O1 v5 (V-112); same light per lamp as O1 v5
  const tl = tunLightsTC1.length ? tunLightsTC1.map((p) => ({ position: p, color: W.TUN.color, intensity: W.TUN.intensity * 0.35, distance: 30, decay: 2 })) : W.tunLights;
  o.light.tunnelsAt?.(tl.map((l: any) => ({ p: l.position.clone().multiplyScalar(RACE_W), color: l.color, intensity: l.intensity * RACE_W * RACE_W, distance: l.distance * RACE_W })));
  // ---- the hub: hex tiles + the road / strand chunks over it are the walk surface (cells 4 lab)
  const hub = W.hub, hubC = new THREE.Vector3(hub.c[0], hub.y, hub.c[1]).multiplyScalar(RACE_W), hubR = (hub.HM.W * 2.2) * RACE_W;
  const walk: THREE.Mesh[] = [];
  W.world.traverse((m: any) => { if (!m.isMesh) return; for (let x: any = m; x; x = x.parent) if (x.name === 'hub-tiles') { m.name = m.name || 'hex'; walk.push(m); return; } });
  if (!walk.length) W.world.children.forEach((g: any) => { if (g.isGroup && Math.hypot(g.position.x - hub.c[0], g.position.z - hub.c[1]) < 1) g.traverse((m: any) => { if (m.isMesh) { m.name = m.name || 'hex'; walk.push(m); } }); });
  for (const c of chunks) { const p = c.lod.getWorldPosition(new THREE.Vector3()); if (p.distanceTo(hubC) < hubR * 1.6) c.near.children.forEach((m) => walk.push(m as THREE.Mesh)); }
  for (const m of branchMeshes) walk.push(m);   // C4c: the branch road on the hub is walk surface too (bande = wall by role)
  // ---- V-138: RKIT's kerb + sidewalk + edge stones at the B7 bay (world frame, lab units) and the Lab's clay slope onto the hex tiles
  let bayInfo: any = null;
  if (BAY && BAY_RKIT) { try {
    const { group: rk, colours } = await loadRkitParts('/roadbeds/hex_b7.parts.json', 'canyon'); rk.name = 'rkit-hex-b7'; o.scene.add(rk); rk.updateMatrixWorld(true); rk.traverse((m: any) => { if (m.isMesh) walk.push(m); });
    // the slope: from the edge stones' bed edge (sidewalk outer edge + 0.06, top − 0.15 lab) — or, where no kerb stands yet (B7 transition
    // between the bande head and RKIT's kerb head), from the gutter edge — down onto the tile top, embedded 0.15 m; outer rim irregular
    // (noise in run length) with clay drops along it (V-011: no straight line); colour = the hex tile under it
    const sst = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }, K = RACE_W;
    const uAt = (sv: number) => Math.min(1, Math.max(0, sv < BAY.s0 ? (sv - (BAY.s0 - BAY.L)) / BAY.L : sv > BAY.s1 ? (BAY.s1 + BAY.L - sv) / BAY.L : 1));
    const nz = (x: number) => Math.sin(x * 0.61) * 0.5 + Math.sin(x * 1.37 + 1.3) * 0.3 + Math.sin(x * 2.91 + 0.4) * 0.2;
    const hubT = W.world.getObjectByName('hub-tiles'), rc = new THREE.Raycaster(), V3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]); W.world.updateMatrixWorld(true);
    const toW = W.world.matrixWorld, invW = toW.clone().invert(), floor = -0.6, NP = 9, rows: THREE.Vector3[][] = [], rowP: { q: any; xin: number; yin: number; run: number }[] = []; let tileCol: THREE.Color | null = null;
    const i0 = Math.round((BAY.s0 - BAY.L) / td.ds), i1 = Math.round((BAY.s1 + BAY.L) / td.ds);
    for (let i = i0; i <= i1; i++) { const q = S[i], u = uAt(q.s); if (u < 0.3) continue; const wG = sst(0.15, 0.85, u), wK = sst(0.55, 1, u), e = q.slots[7][0] - (q.prm.offset || 0), g1 = e + 3.0 / K * wG;
      const walkOn = sst(0.78, 0.86, wK), xin = g1 - 0.06 + walkOn * (0.3 + 6.4 + 0.02) / K,   /* RKIT: kerb 0.3 + sidewalk 6.4 incl. the edge-stone row; the slope starts just under the stones' bedded lip */ yin = -0.015 + walkOn * ((0.12 - 0.15) / K + 0.015), run = 4.4 + 0.8 * nz(q.s * 0.35) + 0.35 * nz(q.s * 1.7 + 3);   /* ≥ 3.25 m for ≈ 0.75 m: walkable (the walker's step probe refused the 27° of a 2.3 m run) */
      const row: THREE.Vector3[] = []; for (let k = 0; k <= NP; k++) { const t = k / NP, x = xin + run * t, y = yin + (floor - 0.15 - yin) * (0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, t * 1.08))) + (k === 0 ? 0 : 0.05 * Math.sin(Math.PI * t));
        row.push(V3(q.p).addScaledVector(V3(q.R), x).addScaledVector(V3(q.U), y)); }
      rows.push(row); rowP.push({ q, xin, yin, run });
      if (!tileCol && hubT) { const o2 = V3(q.p).addScaledVector(V3(q.R), xin + run + 3).addScaledVector(V3(q.U), 4).applyMatrix4(toW); rc.set(o2, new THREE.Vector3(0, -1, 0)); rc.far = 20; const h: any = rc.intersectObject(hubT, true)[0]; const mm: any = h ? (Array.isArray(h.object.material) ? h.object.material[0] : h.object.material) : null; if (mm?.color) tileCol = mm.color.clone(); } }
    const pos: number[] = [], idx: number[] = []; rows.forEach((r) => r.forEach((v) => pos.push(v.x, v.y, v.z)));
    for (let a = 0; a + 1 < rows.length; a++) for (let k = 0; k < NP; k++) { const A = a * (NP + 1) + k, B = (a + 1) * (NP + 1) + k; idx.push(A, A + 1, B, A + 1, B + 1, B); }   /* faces up (was culled from above) */
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); sg.setIndex(idx); sg.computeVertexNormals(); seedGeometry(THREE, sg, 1381);
    const slopeMat = (makeClayMaterial as any)(THREE, W.U, { src: new THREE.MeshStandardMaterial({ color: new THREE.Color('#a3bd3a') }),   /* the hex grass as rendered (KayKit tiles take their colour from a texture; the material colour is white) */ profile: { ...CLAY_PROFILES.terrainFg, print: 0, dent: 0, gouge: 0, crack: 0 } });
    const slope = new THREE.Mesh(sg, slopeMat); slope.name = 'bay-knet-uebergang'; slope.receiveShadow = true; track.add(slope); walk.push(slope);
    // clay drops along the outer rim. V-138 TUNE (Georg: „lesen sich als flache Scheiben“): plastic — domed (height 0.55–0.8 × radius),
    // clusters of one big drop and 0–2 small ones, each smeared into the ground: the dome profile meets the ground tangentially
    // and drags a tail downhill (thumb-smear; dome = round cap (1 − ρ³)^1.6, tangent at the rim), the rim ring dives just under the slope / tile surface (no hard contact line)
    const hsh = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
    const gyAt = (r: { xin: number; yin: number; run: number }, x: number) => { const t = (x - r.xin) / r.run; if (t >= 1) return floor; const y = t <= 0 ? r.yin : r.yin + (floor - 0.15 - r.yin) * (0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, t * 1.08))) + 0.05 * Math.sin(Math.PI * t); return Math.max(y, floor); };
    const dome = (r: { q: any; xin: number; yin: number; run: number }, cu: number, cv: number, ru: number, rv: number, h: number, tailA: number, tail: number, seed: number) => {
      const NR = 9, NA = 28, P4: number[] = [], I4: number[] = [], T = V3(r.q.T), R = V3(r.q.R), U = V3(r.q.U), O = V3(r.q.p);
      const put = (u: number, v: number, y: number) => { const w = O.clone().addScaledVector(T, u).addScaledVector(R, v).addScaledVector(U, y); P4.push(w.x, w.y, w.z); };
      put(cu, cv, gyAt(r, cv) + h);
      for (let k = 1; k <= NR + 1; k++) { const rho = k <= NR ? k / NR : 1.12;
        for (let j = 0; j < NA; j++) { const th = (j / NA) * Math.PI * 2, rr = 1 + tail * Math.pow(Math.max(0, Math.cos(th - tailA)), 2), lump = 1 + Math.min(1, rho * 1.5) * (0.1 * Math.sin(th * 3 + seed) + 0.06 * Math.sin(th * 5 + seed * 1.7));   /* no lump at the crown (it pinched a tip) */
          const u = cu + ru * rho * rr * Math.cos(th), v = cv + rv * rho * rr * Math.sin(th), f = rho <= 1 ? Math.pow(1 - rho * rho * rho, 1.6) * lump : 0;
          put(u, v, gyAt(r, v) + h * f - (rho <= 1 ? 0.035 * Math.pow(rho, 6) : 0.07)); } }
      for (let j = 0; j < NA; j++) I4.push(0, 1 + j, 1 + ((j + 1) % NA));
      for (let k = 0; k < NR; k++) for (let j = 0; j < NA; j++) { const A = 1 + k * NA + j, B = 1 + k * NA + ((j + 1) % NA), C = A + NA, D = B + NA; I4.push(A, C, B, B, C, D); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P4, 3)); g.setIndex(I4); g.computeVertexNormals();
      if (V3([g.attributes.normal.getX(0), g.attributes.normal.getY(0), g.attributes.normal.getZ(0)]).dot(U) < 0) { g.setIndex(I4.map((_, i) => I4[i - (i % 3) + [0, 2, 1][i % 3]])); g.computeVertexNormals(); }
      seedGeometry(THREE, g, 1400 + Math.round(seed * 97)); const m = new THREE.Mesh(g, slopeMat); m.name = 'bay-knet-klecks'; m.receiveShadow = true; m.castShadow = true; track.add(m); return m; };
    let dropN = 0; for (let a = 2; a < rowP.length - 2; a += 3 + Math.floor(hsh(a) * 3)) { const r = rowP[a]; if (hsh(a + 9) < 0.25) continue;
      const rad = 0.45 + 0.4 * hsh(a + 1), cv = r.xin + r.run * (0.6 + 0.45 * hsh(a + 2)), cu = (hsh(a + 5) - 0.5) * td.ds * 2, tA = Math.PI / 2 + (hsh(a + 6) - 0.5) * 1.2;   /* tail outward (+R) ± 35° */
      dome(r, cu, cv, rad * (0.85 + 0.3 * hsh(a + 7)), rad, rad * (0.55 + 0.25 * hsh(a + 3)), tA, 0.3 + 0.3 * hsh(a + 8), a); dropN++;
      for (let n2 = 0; n2 < Math.floor(hsh(a + 4) * 3); n2++) { const rs = rad * (0.25 + 0.3 * hsh(a * 3 + n2)), an = hsh(a * 5 + n2) * Math.PI * 2, dd = rad * (1.15 + 0.5 * hsh(a * 7 + n2));
        dome(r, cu + Math.cos(an) * dd, cv + Math.sin(an) * dd, rs, rs * (0.85 + 0.3 * hsh(a * 11 + n2)), rs * (0.65 + 0.25 * hsh(a * 13 + n2)), tA, 0.2 + 0.3 * hsh(a * 17 + n2), a + n2 * 0.37 + 0.5); dropN++; } }
    // the sidewalk's two ends (cross row) stand ≈ 0.7 m over the tiles: a clay ramp in front of each, across the sidewalk width, down onto the tiles
    let ramps = 0, stones = 0; { const kerbS: number[] = []; let prev = false; for (let i = i0; i <= i1; i++) { const u = uAt(S[i].s), on = sst(0.55, 1, u) >= 0.83; if (on !== prev) kerbS.push(i); prev = on; }
      for (let n = 0; n < kerbS.length; n++) { const iE = kerbS[n], q = S[iE], dir = n % 2 === 0 ? -1 : 1, e = q.slots[7][0] - (q.prm.offset || 0), g1 = e + 3.0 / K;
        // heap: at the sidewalk end as high as the sidewalk (top − 0.02) across its width, falling over ≈ 3.2 m onto the transition slope surface
        // (from −0.015 at the gutter edge down to the tile top − 0.15), tapering beside the sidewalk — no straight edge, no wall
        const x0 = g1 - 0.06, x1 = g1 + (0.3 + 6.4 + 0.1) / K, xo = x1 + 1.8, top = 0.12 / K - 0.02, runS = 4.4, NX = 14, NZ = 9, P2: number[] = [], I2: number[] = [];
        const base = (x: number) => { const t = Math.min(1, Math.max(0, (x - x0) / runS)); return -0.015 + (floor - 0.15 + 0.015) * (0.5 - 0.5 * Math.cos(Math.PI * t)); };
        // V-138 TUNE (Georg: „Gehweg-Ende läuft als gerade Linie ins Gras“): the heap does not start at the pavers' straight end line — a clay
        // tongue creeps back over the last pavers by an irregular 0.15–1.8 lab (lobed edge, its tip pressed just under the paver top), and a few
        // loose edge stones lie embedded in the heap beyond the end, smaller and deeper the further out (V-011: no straight line, no hard cut)
        const NB = 4, xoAt = (a: number) => x1 + 2.6 + 1.0 * nz(a * 1.7 + n * 3), latAt = (x: number, xe = xo) => (x > x1 ? 1 - sst(0, xe - x1, x - x1) : 1), lenAt = (x: number) => 4.4 * (1 + 0.15 * nz(x * 1.3 + n * 5));
        const hy = (x: number, t: number, a: number, xe = xo) => { const hk = (1 - sst(0, 1, t)) * latAt(x, xe); return base(x) + (Math.max(base(x), top) - base(x)) * hk + 0.03 * Math.sin(Math.PI * t) * nz(x * 2.2 + a); };
        for (let a = 0; a <= NZ + NB; a++) for (let k = 0; k <= NX; k++) { const xe = xoAt(a), x = x0 + (xe - x0) * k / NX; let along: number, y: number;   /* the side beside the sidewalk falls over 1.6–3.6 lab, wavy (it read as a straight dark flank) */
          if (a < NB) { const sB = a / NB, lobe = Math.pow(Math.abs(nz(x * 4.3 + n * 7)), 0.6), creep = (0.1 + 1.1 * lobe) * latAt(x, xe) + 0.02;   /* lobed tongues 0.15–1.8 lab: some end stones vanish under clay, some stay */ along = dir * (-creep * (1 - sB) - 0.02 * sB); y = hy(x, 0, 0, xe) + ((0.04 + 0.1 * lobe) * Math.sin(Math.PI * Math.pow(sB, 0.7)) - (a === 0 ? 0.015 : 0)) * latAt(x, xe); }
          else { const t = (a - NB) / NZ; along = dir * (-0.02 + lenAt(x) * t); y = hy(x, t, a - NB, xe); }
          const v = V3(q.p).addScaledVector(V3(q.T), along).addScaledVector(V3(q.R), x).addScaledVector(V3(q.U), y); P2.push(v.x, v.y, v.z); }
        { const stoneMat = (rk.getObjectByName('rkit:stone_t0') as THREE.Mesh | undefined)?.material ?? slopeMat;
          for (let m2 = 0; m2 < 5; m2++) { const hS = n * 31 + m2 * 7, d = 0.35 + m2 * 0.62 + 0.25 * hsh(hS), x = g1 + 0.6 / K + (x1 - g1 - 1.2 / K) * hsh(hS + 1), t = Math.min(1, (d + 0.02) / lenAt(x)), sc = 1 - m2 * 0.13;
            const L2 = (0.95 + 0.25 * hsh(hS + 2)) / K * sc, H2 = 0.3 / K * sc, D2 = (0.5 + 0.12 * hsh(hS + 3)) / K * sc, sink = H2 * (0.5 + 0.1 * m2);
            const bg = claySeed(new RoundedBoxGeometry(L2, H2, D2, 2, Math.min(H2, D2) * 0.32), 1700 + hS);   /* the RKIT parts' clay (src/clay), same as their edge stones */
            const st = new THREE.Mesh(bg, stoneMat); st.name = 'bay-kantenstein-lose'; st.castShadow = st.receiveShadow = true;
            const T4 = V3(q.T), R4 = V3(q.R), U4 = V3(q.U); st.position.copy(V3(q.p).addScaledVector(T4, dir * d).addScaledVector(R4, x).addScaledVector(U4, hy(x, t, 0) + H2 / 2 - sink));
            st.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(T4, U4, R4)); st.rotateY((hsh(hS + 4) - 0.5) * 0.9); st.rotateX((hsh(hS + 5) - 0.5) * 0.25); st.rotateZ((hsh(hS + 6) - 0.5) * 0.3);
            track.add(st); stones++; } }
        for (let a = 0; a < NZ + NB; a++) for (let k = 0; k < NX; k++) { const A = a * (NX + 1) + k, B = (a + 1) * (NX + 1) + k; if (dir < 0) I2.push(A, B, A + 1, A + 1, B, B + 1); else I2.push(A, A + 1, B, A + 1, B + 1, B); }
        const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(P2, 3)); rg.setIndex(I2); rg.computeVertexNormals(); seedGeometry(THREE, rg, 1500 + n);
        const rm = new THREE.Mesh(rg, slopeMat); rm.name = 'bay-knet-rampe'; rm.receiveShadow = true; track.add(rm); walk.push(rm); ramps++; } }
    // V-138: the KayKit hex tiles meet in a bevelled notch (a step line in view) → a flat clay bead fills each inner seam (2.6 m wide,
    // flush: ≤ 0.06 m over the tile top measured on both sides, ends tapered), tile clay colour; under the road deck it stays hidden in the deck
    let seams = 0; { const HM = W.hub.HM, hm = hexMetrics([HM.W, 0, HM.H]), Rc = HM.H / 2, cells: number[][] = [[0, 0]]; for (let d = 0; d < 6; d++) cells.push(neighbor(0, 0, d));
      const has = new Set(cells.map((c) => c[0] + ',' + c[1])), done = new Set<string>(), up = new THREE.Vector3(0, 1, 0);
      for (const [c0, r0] of cells) { const pw = hexToWorld(c0, r0, hm); for (let d = 0; d < 6; d++) { const [nc, nr] = neighbor(c0, r0, d); if (!has.has(nc + ',' + nr)) continue;
        const a0 = (d * 60 - 30) * Math.PI / 180, a1 = (d * 60 + 30) * Math.PI / 180, p0 = [W.hub.c[0] + pw[0] + Math.cos(a0) * Rc, W.hub.c[1] + pw[2] + Math.sin(a0) * Rc], p1 = [W.hub.c[0] + pw[0] + Math.cos(a1) * Rc, W.hub.c[1] + pw[2] + Math.sin(a1) * Rc];
        const key = [Math.round((p0[0] + p1[0]) * 5), Math.round((p0[1] + p1[1]) * 5)].join(','); if (done.has(key)) continue; done.add(key);
        const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz), tx = dx / L, tz = dz / L, nx2 = -tz, nz2 = tx, NS = Math.max(8, Math.round(L / 1.5)), NW = 8, P3: number[] = [], I3: number[] = [];
        const topAt = (x: number, z: number) => { let best = -1e9; for (const off of [-3.2, 3.2]) {   /* the tile top beside the notch (the V is ≈ 2.5 m wide) */ const o4 = new THREE.Vector3(x + nx2 * off, W.hub.y + 8, z + nz2 * off).applyMatrix4(toW); rc.set(o4, new THREE.Vector3(0, -1, 0)); rc.far = 30 * K; const h: any = hubT ? rc.intersectObject(hubT, true)[0] : null; if (h) best = Math.max(best, h.point.clone().applyMatrix4(invW).y); } return best > -1e8 ? best : W.hub.y - 0.6; };
        for (let a = 0; a <= NS; a++) { const t = a / NS, x = p0[0] + dx * t, z = p0[1] + dz * t, y0 = topAt(x, z), taper = Math.min(1, Math.min(t, 1 - t) * NS / 2);
          for (let k = 0; k <= NW; k++) { const w = -1 + 2 * k / NW, aw = Math.abs(w), hgt = (0.02 + 0.02 * taper) - 0.25 * Math.pow(Math.max(0, (aw - 0.6) / 0.4), 2);   /* fills the notch flush (tile top + 2–4 cm) over ±1.2 m, edges dive 0.25 under the tile at ±2 m */ P3.push(x + nx2 * w * 2.0, y0 + hgt, z + nz2 * w * 2.0); } }
        for (let a = 0; a < NS; a++) for (let k = 0; k < NW; k++) { const A = a * (NW + 1) + k, B = (a + 1) * (NW + 1) + k; I3.push(A, A + 1, B, A + 1, B + 1, B); }
        const g5 = new THREE.BufferGeometry(); g5.setAttribute('position', new THREE.Float32BufferAttribute(P3, 3)); g5.setIndex(I3); g5.computeVertexNormals(); if ((g5.attributes.normal as any).getY(Math.floor(P3.length / 6)) < 0) { g5.setIndex(I3.map((_, i) => I3[i - (i % 3) + [0, 2, 1][i % 3]])); g5.computeVertexNormals(); }
        seedGeometry(THREE, g5, 1600 + seams); const sm = new THREE.Mesh(g5, slopeMat); sm.name = 'hex-naht-knete'; sm.receiveShadow = true; W.world.add(sm); walk.push(sm); seams++; } } }
    bayInfo = { parts: colours, slopeRows: rows.length, drops: dropN, ramps, looseStones: stones, seams };
  } catch (e: any) { bayInfo = { error: String(e?.message ?? e) }; } }
  // ---- trail foot test (V-157 / V-158, RKIT Track Core 0.16.7 trailStairs anchors): ?trailTest=1 builds RKIT's test route (ramp 6 % · 9 steps
  // 0.444 / 0.889 · ramp 3.3 %, width 6.4 lab) on the hex tiles 40 lab beside the bay, as plain clay solids in the walk surface. Test only.
  let trailInfo: any = null;
  if (qs.get('trailTest') === '1' && BAY) { try {
    const v2 = qs.get('trailFile') === 'v2', J0 = await (await fetch(`/docs/handoff/rkit_trail_stairs_foottest_${v2 ? 'v2' : 'v1'}.json`)).json(), J = v2 ? J0.routes[Number(qs.get('trailRoute') || 0)] : J0, q = S[Math.round((BAY.s0 + BAY.s1) / 2 / td.ds)];
    const Tw = new THREE.Vector3(q.T[0], 0, q.T[2]).normalize(), Uw = new THREE.Vector3(0, 1, 0), Rw = new THREE.Vector3().crossVectors(Tw, Uw), Rr = new THREE.Vector3(...q.R);
    const hr = (q.slots[7][0] - q.slots[6][0]) / 2 * RACE_W, O = new THREE.Vector3(...q.p).multiplyScalar(RACE_W).addScaledVector(Rr, BAY.side * (hr + 40)).addScaledVector(Tw, -15);
    const hubT2 = W.world.getObjectByName('hub-tiles'), rc2 = new THREE.Raycaster(new THREE.Vector3(O.x, O.y + 40, O.z), new THREE.Vector3(0, -1, 0)); rc2.far = 120; const hit: any = hubT2 ? rc2.intersectObject(hubT2, true)[0] : null; O.y = hit ? hit.point.y : O.y;
    const basis = new THREE.Matrix4().makeBasis(Rw, Uw, Tw).setPosition(O), mat = (makeClayMaterial as any)(THREE, W.U, { src: new THREE.MeshStandardMaterial({ color: new THREE.Color('#c9c1b2') }), profile: { ...CLAY_PROFILES.terrainFg, print: 0, dent: 0, gouge: 0, crack: 0 } });
    const prism = (z0: number, z1: number, y0: number, y1: number, name: string) => { const g = new THREE.BoxGeometry(6.4, 1, z1 - z0), p = g.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) { const z = p.getZ(i) + (z1 - z0) / 2, top = p.getY(i) > 0; p.setXYZ(i, p.getX(i), top ? y0 + (y1 - y0) * z / (z1 - z0) : -0.3, z0 + z); }
      g.computeVertexNormals(); g.applyMatrix4(basis); seedGeometry(THREE, g, 1800 + walk.length); const m = new THREE.Mesh(g, mat); m.name = 'trail-test:' + name; m.castShadow = m.receiveShadow = true; o.scene.add(m); walk.push(m); };
    const pts = J.route.pts, st = J.profile.parts.find((x: any) => x.kind === 'stairs');
    // sweep (minTread measurement): ?trailH=&trailTread= replace RKIT's steps by n = round(4.0 / h) steps of that size, same ramps around them
    const hO = Number(qs.get('trailH') || 0), tO = Number(qs.get('trailTread') || 0), steps = hO > 0 && tO > 0 ? Array.from({ length: Math.round(4.0 / hO) }, (_, i) => ({ i, p: [0, pts[1][1] + (i + 1) * hO, pts[1][2] + i * tO], tread: tO })) : st.steps;
    const top = steps[steps.length - 1], z2 = top.p[2] + top.tread, y2 = top.p[1];
    prism(pts[0][2], pts[1][2], pts[0][1], pts[1][1], 'ramp_in');
    for (const s2 of steps) prism(s2.p[2], s2.p[2] + s2.tread, s2.p[1], s2.p[1], 'step_' + s2.i);
    for (const L of (hO ? [] : st.landings || [])) prism(L.p[2], L.p[2] + L.len, L.p[1], L.p[1], 'landing');   // v2: Podest between the flights
    prism(z2, z2 + 12, y2, y2 + 0.4, 'ramp_out');
    trailInfo = { origin: O.toArray(), T: Tw.toArray(), R: Rw.toArray(), y0: O.y, steps: steps.length, h: hO || st.h, tread: tO || st.tread, landings: hO ? 0 : (st.landings || []).length, stairsZ: [pts[1][2], z2], topZ: z2 + 10, source: hO ? 'sweep' : `rkit ${J0.core} ${v2 ? 'v2 ' + J.route.id : 'v1'}` };
  } catch (e: any) { trailInfo = { error: String(e?.message ?? e) }; } }
  const surface = buildSurfaceField(walk, 4);
  // ---- car on the hub straight (isle_HX), spawn beside it on the hex tiles, facing the car
  const jHX = td.joints.findIndex((j: any) => j.piece === 'isle_HX'), iA = td.joints[jHX].index, iB = td.joints[jHX + 1]?.index ?? iA + 200;
  const sCar = BAY ? (BAY.s0 + BAY.s1) / 2 : S[Math.round(iA + (iB - iA) * 0.45)].s;
  const qC = S[Math.round(sCar / td.ds)], P = new THREE.Vector3(...qC.p).multiplyScalar(RACE_W), R = new THREE.Vector3(...qC.R);
  const halfRoad = (qC.slots[7][0] - qC.slots[6][0]) / 2 * RACE_W;
  // spawn on the hub deck beside the car: the stream puts barriers on both sides of the hub straight (barrierVis 1, as O1 drew its
  // strand there), so the hex tiles behind them are not reachable on foot — that is C4 (exit onto the island floor, V-110), not bent here
  const T3 = new THREE.Vector3(...qC.T); let spawn: [number, number, number] | null = null;
  // C4a: with the bay the spawn is on its platform (B7 gutter 3.0 + kerb 0.3 + half the 6.4 walk, lab units), 6 lab behind the car
  // V-138: on the hex tiles beyond the sidewalk + clay slope (+ 16.5 lab from the road edge, clear of the slope drops): the way to the car
  // crosses slope, edge stones, sidewalk and kerb; the parity run (turned away from the car) stays on flat tile
  if (BAY) { const latB = halfRoad + (BAY_RKIT ? 16.5 : 3.0 + 0.3 + 3.2), x = P.x + R.x * BAY.side * latB - T3.x * 6, z = P.z + R.z * BAY.side * latB - T3.z * 6, h = surface.at(x, z); if (h && !h.wall) spawn = [x, z, Math.atan2(P.x - x, P.z - z)]; }
  for (const side of [1, -1]) for (const lat of [0.55, 0.45, 0.65]) { if (spawn) break; const x = P.x + R.x * side * halfRoad * lat - T3.x * 6, z = P.z + R.z * side * halfRoad * lat - T3.z * 6, h = surface.at(x, z);
    if (h && !h.wall) spawn = [x, z, Math.atan2(P.x - x, P.z - z)]; }
  // ---- organs: Hero tier near the camera, Light otherwise (template tiers; checked twice a second)
  let tierT = 0; const cW = W.built.map((B: any) => ({ B, c: B.I.Cw.clone().multiplyScalar(RACE_W) }));
  // tunnel share of a point (lab): 1 deep inside a tube, 0 outside; soft over the first 25 m behind each mouth (TC1 mouths from the join
  // reports, else the Track Core range). Points every 4 samples, brute force (≈ 1 200 points).
  const tunPts: { p: THREE.Vector3; depth: number }[] = [];
  (td.tunnels || []).forEach((t: any) => { const rep = tunnelReports.flatMap((r: any) => r.tunnels || []).find((x: any) => x.i0 === t.i0), m = rep?.mouth ?? [12.5, 12.5], a = t.i0 - Math.round(m[0] / td.ds), b = t.i1 + Math.round(m[1] / td.ds);
    for (let i = a; i <= b; i += 4) { const q = td.samples[((i % S.length) + S.length) % S.length]; tunPts.push({ p: new THREE.Vector3(q.p[0], q.p[1] + 4, q.p[2]).multiplyScalar(RACE_W), depth: Math.min(i - a, b - i) * td.ds }); } });
  const tunnelWeight = (pt: THREE.Vector3) => { let best = Infinity, d = 0; for (const x of tunPts) { const q = x.p.distanceToSquared(pt); if (q < best) { best = q; d = x.depth; } }
    if (!isFinite(best) || Math.sqrt(best) > 16 * RACE_W) return 0; const u = Math.min(1, Math.max(0, d / 25)); return u * u * (3 - 2 * u); };
  const tierAt = (id: string) => (W.built.find((B: any) => B.id === id)?.heroOn ? 'hero' : 'light');
  const tierLock = qs.get('organTier');   // probes only: ?organTier=hero|light pins the tier (stills of one tier at any distance)
  const mc = new THREE.Vector3();
  const update = (dt: number, cam: THREE.Camera) => {
    W.update(dt);
    for (const m of markCells) { mc.copy(m.geometry.boundingSphere!.center).multiplyScalar(RACE_W); m.visible = mc.distanceTo(cam.position) - m.geometry.boundingSphere!.radius * RACE_W < 900; }
    // Hero tier within heroIn of the organ centre, back to Light beyond heroOut (hysteresis: no flicker at the boundary; Steuerung lever 2)
    if ((tierT -= dt) <= 0) { tierT = 0.5; for (const { B, c } of cW) { const d = cam.position.distanceTo(c); B.heroOn = tierLock ? tierLock === 'hero' : B.heroOn ? d < ORGAN_LOD.heroOut : d < ORGAN_LOD.heroIn; const hero = B.heroOn; for (const [k, T] of Object.entries<any>(B.tiers)) T.g.visible = (k === 'hero') === hero;
      // the island cast (KayKit figures, ≈ 89k △ for all four) is a few pixels from afar: drawn only within castWithin (LAB performance LOD)
      for (const f of B.figs) { f.vis0 ??= f.obj.visible; f.obj.visible = f.vis0 && d < ORGAN_LOD.castWithin; } } }
  };
  const box = new THREE.Box3().setFromObject(W.world);
  return {
    W, td, track, chunks, surface, tierAt, walk, tunnelWeight, fieldTun, bayInfo, trailTest: trailInfo, c4c: { branches: branchInfo, graph: !!G4, ringOpen, furniture: c4Info }, mats: M as Record<string, THREE.Material>,   /* V-128: race VFX (barrier wobble on strang, accent = pad) */
    /** V-112 pipeline test: repair the body (fan split), manifold-3d, union with a test box at the first portal, checks + ms */
    testJoin: async (id: string, tier = 'hero') => { const w = await manifoldLib(), B = W.built.find((x: any) => x.id === id), T = B.tiers[tier]; const ms: any[] = []; T.g.traverse((m: any) => { if (m.isMesh) ms.push(m); });
      const t0 = performance.now(), fix = makeManifold(ms[0].geometry), t1 = performance.now(), chk = meshCheck(fix.geometry); let mf: any, err = null;
      try { mf = toManifold(w, fix.geometry); } catch (e) { err = String(e); }
      const t2 = performance.now(); if (!mf) return { id, tier, before: meshCheck(ms[0].geometry), fixedTopo: topoCheck(fix.geometry), splitVerts: fix.splitVerts, err, ms: { fix: Math.round(t1 - t0) } };
      const st = mf.status ? mf.status() : null, P = B.portals?.[0]?.p ? B.portals[0].p.clone().applyMatrix4(B.root.matrixWorld.clone().invert()) : new THREE.Vector3();
      const box = w.Manifold.cube([20 / B.spec.mm, 20 / B.spec.mm, 20 / B.spec.mm], true).translate([P.x, P.y, P.z]), t3 = performance.now(), u = mf.add(box), t4 = performance.now();
      const g = fromManifold(u, [mf.originalID(), box.originalID()]), after = meshCheck(g);
      return { id, tier, before: meshCheck(ms[0].geometry), fixed: chk, splitVerts: fix.splitVerts, status: st, union: after, groups: g.groups.length, ms: { fix: Math.round(t1 - t0), toManifold: Math.round(t2 - t1), union: Math.round(t4 - t3) } }; },
    /** V-112 alternative: mesh the SAME O1 field (tier GT) with manifold-3d levelSet (guaranteed manifold); ms, triangles, checks */
    testLevelSet: async (id: string, tier = 'light', k = 1) => { const w = await manifoldLib(), B = W.built.find((x: any) => x.id === id), G = B.tiers[tier].TT.GT, { V, nx, ny, nz, o, h } = G;
      const at = (x: number, y: number, z: number) => { const fx = Math.min(nx - 1.001, Math.max(0, (x - o[0]) / h)), fy = Math.min(ny - 1.001, Math.max(0, (y - o[1]) / h)), fz = Math.min(nz - 1.001, Math.max(0, (z - o[2]) / h));
        const i = Math.floor(fx), j = Math.floor(fy), l = Math.floor(fz), u = fx - i, v = fy - j, t = fz - l, I = (a: number, b: number, c: number) => V[a + nx * (b + ny * c)];
        const c00 = I(i, j, l) * (1 - u) + I(i + 1, j, l) * u, c10 = I(i, j + 1, l) * (1 - u) + I(i + 1, j + 1, l) * u, c01 = I(i, j, l + 1) * (1 - u) + I(i + 1, j, l + 1) * u, c11 = I(i, j + 1, l + 1) * (1 - u) + I(i + 1, j + 1, l + 1) * u;
        return (c00 * (1 - v) + c10 * v) * (1 - t) + (c01 * (1 - v) + c11 * v) * t; };
      const t0 = performance.now(), m = w.Manifold.levelSet((p: number[]) => -at(p[0], p[1], p[2]), { min: [o[0], o[1], o[2]], max: [o[0] + (nx - 1) * h, o[1] + (ny - 1) * h, o[2] + (nz - 1) * h] }, h * k, 0), t1 = performance.now();
      const g = fromManifold(m, [m.originalID()]); return { id, tier, cell: h, k, ms: Math.round(t1 - t0), status: m.status ? m.status() : null, check: meshCheck(g), topo: topoCheck(g), snTris: B.tiers[tier].tris }; },
    meshStats,
    tunnelReports,
    /** probes only: O1's field sampling (field coords) */
    debugField: { samp: sampField, grad: gradField },
    /** V-116 shape equality: |field| at the vertices of the body mesh in use and of a Surface-Nets reference on the same field, in cells
     *  (distance of each mesh to the field's isosurface; both approximate the same surface) */
    shapeCheck: () => W.built.map((B: any) => ({ id: B.id, tiers: Object.fromEntries(Object.entries<any>(B.tiers).map(([k, T]) => { const ms: any[] = []; T.g.traverse((m: any) => { if (m.isMesh) ms.push(m); });
      // direct surface distance in BOTH directions, exact point-to-triangle (spatial hash), in cells of the tier
      const G = T.TT.GT, h = G.h, sn = (surfaceNetsField as any)(G, 1), body = ms[0].geometry, LP = body.attributes.position.array, LI = body.index.array;
      // the Surface-Nets reference gets O1's own island rule (components < 2 % of the largest dropped, as dropIslands does for the body)
      const snK = keepLargeComponents(sn.P, sn.idx, 0.02, 200);
      const r = (x: any) => ({ mean: +(x.mean / h).toFixed(4), p99: +(x.p99 / h).toFixed(3), max: +(x.max / h).toFixed(3), over05: Array.from(x.ds as Float32Array).filter((d) => d > 0.5 * h).length });
      const a = surfaceDistance(LP, sn.P, snK.idx, h * 2), b = surfaceDistance(snK.keptPoints, LP, LI, h * 2), mw = ms[0].matrixWorld, wp = (c: number[]) => new THREE.Vector3(c[0], c[1], c[2]).applyMatrix4(mw).toArray().map((q) => +q.toFixed(1));
      const fc = (P: ArrayLike<number>, x: any) => farClusters(P, x.ds, 0.5 * h, h * 4).map((c) => ({ world: wp(c.c), n: c.n, max: +(c.max / h).toFixed(2) }));
      return [k, { cell: h, lsToSn: r(a), snToLs: r(b), lsVerts: LP.length / 3, trisUsed: LI.length / 3, trisSN: snK.idx.length / 3, farLS: fc(LP, a), farSN: fc(snK.keptPoints, b),
        compLS: componentSizes(LI, LP.length / 3).slice(0, 6), compSN: componentSizes(sn.idx, sn.P.length / 3).slice(0, 8) }]; })) })),
    /** V-112 mesh checks per organ and tier: body (terrain) and water sheet separately (water is an open sheet by design) */
    checkMeshes: () => W.built.map((B: any) => ({ id: B.id, tiers: Object.fromEntries(Object.entries<any>(B.tiers).map(([k, T]) => { const ms: any[] = []; T.g.traverse((m: any) => { if (m.isMesh) ms.push(m); });
      return [k, { body: ms[0] ? meshCheck(ms[0].geometry) : null, bodyTopo: ms[0]?.geometry.index ? topoCheck(ms[0].geometry) : 'not indexed', water: ms[1] ? meshCheck(ms[1].geometry) : null }]; })) })), spawn: spawn ?? [hubC.x, hubC.z, 0] as [number, number, number], sCar, hubCentre: hubC, box, update,
    info: { buildMs: Math.round(performance.now() - t0), chunks: chunks.length, trackTrisNear: trisNear, trackTrisAll: trisAll, markings: markInfo, track: W.trackInfo, islands: W.built.map((B: any) => ({ id: B.id, hits: B.hits, tiers: Object.fromEntries(Object.entries<any>(B.tiers).map(([k, T]) => [k, T.tris])) })), errors: W.info.errors, walkMeshes: walk.length, spawnFound: !!spawn },
  };
}
export type OrganWorld = Awaited<ReturnType<typeof createOrganWorld>>;
