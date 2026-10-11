// V-112 / V-127 · host side of the tunnel insertion, for ANY closed island body mesh: builds the TC1 parts of the given tunnels, moves them
// into the body frame, joins them (tunnel-insert.ts), checks the union (topology on the index) and replaces the body mesh by one mesh per
// material over the SAME closed union (body keeps its vertex colours + normals; TC1 parts get TC1's clay materials and creased normals).
import * as THREE from 'three';
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';
import { tunnelParts, partToLocal, joinTunnels, findMouths, type InsertOpts, type TunnelSpec } from './tunnel-insert';
import { sdPoly as sdPolyH } from './tunnel-field';

/** TC1 race_tube / stone / mine material keys (tunnel-clay.tc1.js TUNNEL_KITS.mats) per part tag; [a, b] alternate per module / arc */
const MAT_OF: Record<string, string | [string, string]> = { shell: 'body', head: 'body', interior: ['strang', 'cloud'], band: 'pad', rim: ['strang', 'cloud'], gantry: 'tower1', rib: 'tower1', stone: 'rock', key: 'tower0', timber: 'trunk' };

export type TunnelJoinReport = { compSmall: any[]; crumbsDropped: number; floatingParts: number; specksDropped: number; components: number; bodyComponents: number; q5: { sharpEdges: number; chainsOver0_2H: number; longestChain_m: number; byTags: Record<string, number> }; tunnels: { i0: number; i1: number; mouth: number[]; mouthFound: boolean[]; style: string; modules: number; booleanMs: number; lamps: number }[]; ms: number; tris: number; topo: { open: number; multi: number; flipped: number }; status: string | null; parts: Record<string, number> };

/** the shell (filler between the tube and the body) is body clay: its vertices take the colour of the nearest body vertex */
function fillColours(P: number[], C: number[], src: THREE.BufferGeometry) {
  const sp = src.attributes.position, sc = src.attributes.color; if (!sc) return; const bb = new THREE.Box3().setFromBufferAttribute(sp as THREE.BufferAttribute), cs = Math.max(1e-6, bb.getSize(new THREE.Vector3()).length() / 200), H = new Map<string, number[]>();
  const key = (x: number, y: number, z: number) => Math.floor(x / cs) + ',' + Math.floor(y / cs) + ',' + Math.floor(z / cs);
  for (let i = 0; i < sp.count; i++) { const k = key(sp.getX(i), sp.getY(i), sp.getZ(i)); let L = H.get(k); if (!L) H.set(k, (L = [])); L.push(i); }
  for (let v = 0; v < P.length / 3; v++) { if (C[v * 3] + C[v * 3 + 1] + C[v * 3 + 2] > 0.01) continue; const x = P[v * 3], y = P[v * 3 + 1], z = P[v * 3 + 2], cx = Math.floor(x / cs), cy = Math.floor(y / cs), cz = Math.floor(z / cs); let best = -1, bd = Infinity;
    for (let r = 1; r <= 12 && best < 0; r++) for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) for (let c = -r; c <= r; c++) { if (Math.max(Math.abs(a), Math.abs(b), Math.abs(c)) !== r && r > 1) continue; for (const i of H.get((cx + a) + ',' + (cy + b) + ',' + (cz + c)) ?? []) { const d = (sp.getX(i) - x) ** 2 + (sp.getY(i) - y) ** 2 + (sp.getZ(i) - z) ** 2; if (d < bd) { bd = d; best = i; } } }
    if (best >= 0) { C[v * 3] = sc.getX(best); C[v * 3 + 1] = sc.getY(best); C[v * 3 + 2] = sc.getZ(best); } } }

/** pre (Prototyp „Tunnel im Feld“): the tunnel is already in the body (field); `pre.built` brings only TC1's fine parts and the tube wall
 *  contour per tunnel — body triangles on that wall (± 0.7 m) get TC1's band colours per module, on the SAME vertices (no seam) */
export type PreBuilt = { built: { parts: any[]; lights: THREE.Vector3[]; a: number; b: number; nMod: number; mLen: number; s0: number; style: string; wallPoly: [number, number][]; edge?: number }[]; mouths: { mouthIn: number; mouthOut: number; found: boolean[] }[] };
export function insertTunnelsIntoBody(w: any, body: THREE.Mesh, trackToLocal: THREE.Matrix4, td: any, tunnels: TunnelSpec[], opts: InsertOpts, mats: Record<string, THREE.Material>, lampMat: THREE.Material, seedFn: (g: THREE.BufferGeometry, s: number) => void, seed = 11, pre?: PreBuilt) {
  // each tube ends at the body's own face (findMouths) + 0.3 m, unless the caller fixes the extension (mouthExt) and no face is found
  const mouths = pre ? pre.mouths : tunnels.map((t) => findMouths(w, body.geometry, td, t, trackToLocal, opts.mouthExt ?? 12.5));
  const built: any[] = pre ? pre.built : tunnels.map((t, k) => tunnelParts(td, t, { ...opts, mouthIn: mouths[k].mouthIn + 0.3, mouthOut: mouths[k].mouthOut + 0.3 })), localParts = built.map((b: any) => b.parts.map((p: any) => partToLocal(p, trackToLocal)));
  const J = joinTunnels(w, body.geometry, localParts), mesh = J.M.getMesh(), np = mesh.numProp, localToTrack = trackToLocal.clone().invert();
  let vp = mesh.vertProperties as Float32Array, tv = mesh.triVerts as Uint32Array, runIndex = mesh.runIndex as Uint32Array; const runOrig = mesh.runOriginalID as Uint32Array;
  // property seams (colour / normal) split vertices in the MeshGL; mergeFromVert → mergeToVert gives the manifold's own vertex
  let rep = new Uint32Array(vp.length / np); for (let i = 0; i < rep.length; i++) rep[i] = i; { const mf = mesh.mergeFromVert as Uint32Array, mt = mesh.mergeToVert as Uint32Array; for (let i = 0; i < (mf?.length ?? 0); i++) rep[mf[i]] = mt[i]; }
  // field tunnels: the body ↔ wall colour seam lies exactly in the plane of each mouth band (triangles crossing it are split, conforming)
  if (pre) { const S = td.samples, N = S.length, kL = trackToLocal.getMaxScaleOnAxis(), planes: { p: THREE.Vector3; n: THREE.Vector3; r: number }[] = [];
    for (const b of built) { if (b.edge == null) continue; const reach = (Math.max(...b.wallPoly.map((q: number[]) => Math.hypot(q[0], q[1]))) + 4) * kL;
      for (const i of [b.a + Math.round(b.edge / td.ds), b.b - Math.round(b.edge / td.ds)]) { const q = S[((i % N) + N) % N]; planes.push({ p: new THREE.Vector3(q.p[0], q.p[1], q.p[2]).applyMatrix4(trackToLocal), n: new THREE.Vector3(q.T[0], q.T[1], q.T[2]).transformDirection(trackToLocal), r: reach }); } }
    // TC1 race_rim: 14 arcs alternating strang / cloud (by angle about the axis point up 2 m) → the 7 arc-boundary planes through the tube axis
    // split the rim (and the body around the portal) conformingly, so each stripe ends on a straight radial line, not on triangle teeth
    for (const b of built) { if (b.style !== 'race_tube' || !b.parts.some((pp: any) => pp.tag === 'rim')) continue;
      for (const i of [b.a0 ?? b.a, b.a1 ?? b.b]) { const q = S[((i % N) + N) % N], c = new THREE.Vector3(q.p[0], q.p[1], q.p[2]).addScaledVector(new THREE.Vector3(q.U[0], q.U[1], q.U[2]), 2), Tq = new THREE.Vector3(q.T[0], q.T[1], q.T[2]);
        for (let k = 0; k < 7; k++) { const th = k * Math.PI / 7, d = new THREE.Vector3(q.R[0], q.R[1], q.R[2]).multiplyScalar(Math.cos(th)).addScaledVector(new THREE.Vector3(q.U[0], q.U[1], q.U[2]), Math.sin(th)), n = Tq.clone().cross(d).normalize();
          planes.push({ p: c.clone().applyMatrix4(trackToLocal), n: n.transformDirection(trackToLocal), r: 22 * kL }); } } }
    for (const pl of planes) ({ vp, tv, runIndex, rep } = splitAtPlane(vp, tv, np, runIndex, rep, pl)); }
  const T = tv.length / 3;
  // module parity for shell / interior faces: nearest tunnel sample (every 2nd) → s → module of that tunnel
  const probes: { p: THREE.Vector3; R: THREE.Vector3; U: THREE.Vector3; T: THREE.Vector3; s: number; k: number; m: number }[] = [];
  built.forEach((b, k) => { const S = td.samples, N = S.length; for (let i = b.a0; i <= b.a1; i += 2) { const q = S[((i % N) + N) % N]; let s = q.s - b.s0; if (s < 0) s += td.length ?? 0; probes.push({ p: new THREE.Vector3(q.p[0], q.p[1], q.p[2]), R: new THREE.Vector3(q.R[0], q.R[1], q.R[2]), U: new THREE.Vector3(q.U[0], q.U[1], q.U[2]), T: new THREE.Vector3(q.T[0], q.T[1], q.T[2]), s, k, m: Math.floor(s / b.mLen) }); } });
  const cell = 8, grid = new Map<string, number[]>(), key = (v: THREE.Vector3) => Math.floor(v.x / cell) + ',' + Math.floor(v.y / cell) + ',' + Math.floor(v.z / cell);
  probes.forEach((q, i) => { const k = key(q.p); let L = grid.get(k); if (!L) grid.set(k, (L = [])); L.push(i); });
  const nearest = (v: THREE.Vector3) => { let best = -1, bd = Infinity; const cx = Math.floor(v.x / cell), cy = Math.floor(v.y / cell), cz = Math.floor(v.z / cell);
    for (let r = 1; r <= 4 && best < 0; r++) for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) for (let c = -r; c <= r; c++) for (const i of grid.get((cx + a) + ',' + (cy + b) + ',' + (cz + c)) ?? []) { const d = probes[i].p.distanceToSquared(v); if (d < bd) { bd = d; best = i; } }
    return best; };
  const tri2key: string[] = new Array(T), cen = new THREE.Vector3(), parts: Record<string, number> = {};
  for (let r = 0; r < runOrig.length; r++) { const tag = J.tags.get(runOrig[r]) ?? 'body', mk = MAT_OF[tag];
    // TC1 wall per kit: race_tube bands alternate strang / cloud per module; stone kits = rock, mine = tower1 (TUNNEL_KITS.mats.wall)
    const mkI = tag === 'interior' ? ({ race_tube: ['strang', 'cloud'], stone_arch: 'rock', stone_rect: 'rock', mine: 'tower1' } as Record<string, string | [string, string]>)[built[0]?.style ?? 'race_tube'] ?? mk : mk;
    for (let t = runIndex[r] / 3; t < runIndex[r + 1] / 3; t++) { let k = tag === 'body' || mk === 'body' ? 'body' : tag === 'lamp' ? 'lamp' : typeof mkI === 'string' ? mkI : 'strang';
      if (pre && tag === 'body') { cen.set(0, 0, 0); for (let e = 0; e < 3; e++) { const v = tv[t * 3 + e] * np; cen.x += vp[v] / 3; cen.y += vp[v + 1] / 3; cen.z += vp[v + 2] / 3; } cen.applyMatrix4(localToTrack);
        const i = nearest(cen); if (i >= 0) { const P0 = probes[i], d = cen.clone().sub(P0.p), lat = d.dot(P0.R), upv = d.dot(P0.U), B0 = built[P0.k], sAl = P0.s + d.dot(P0.T);
          /* wall colour only between the mouth bands (edge; default 1.5 m clear of the lip, so the mouth face keeps the body skin) and only on faces looking into the bore */
          if (sAl >= (B0.edge ?? 1.5) && sAl <= (B0.b - B0.a) * td.ds - (B0.edge ?? 1.5) && upv > -0.75 && Math.abs(sdPolyH(B0.wallPoly, lat, upv)) < 0.9) {
            const v0 = tv[t * 3] * np, v1 = tv[t * 3 + 1] * np, v2 = tv[t * 3 + 2] * np, e1 = new THREE.Vector3(vp[v1] - vp[v0], vp[v1 + 1] - vp[v0 + 1], vp[v1 + 2] - vp[v0 + 2]), e2 = new THREE.Vector3(vp[v2] - vp[v0], vp[v2 + 1] - vp[v0 + 1], vp[v2 + 2] - vp[v0 + 2]), n = e1.cross(e2).transformDirection(localToTrack);
            n.normalize(); if (Math.abs(n.dot(P0.T)) < 0.5 && n.dot(P0.R) * lat + n.dot(P0.U) * (upv - 4) < 0) k = B0.style === 'stone_arch' || B0.style === 'stone_rect' ? 'rock' : B0.style === 'mine' ? 'tower1' : ['strang', 'cloud'][((Math.floor((sAl - (B0.edge ?? 0)) / B0.mLen) % 2) + 2) % 2]; } } }   // TC1 mats.wall per look
      if (Array.isArray(mkI)) { cen.set(0, 0, 0); for (let e = 0; e < 3; e++) { const v = tv[t * 3 + e] * np; cen.x += vp[v] / 3; cen.y += vp[v + 1] / 3; cen.z += vp[v + 2] / 3; } cen.applyMatrix4(localToTrack);
        const i = nearest(cen), m = i >= 0 ? Math.floor((probes[i].s + cen.clone().sub(probes[i].p).dot(probes[i].T)) / built[probes[i].k].mLen) : 0;   // s of the centroid along the track
        let arc = 0; if (tag === 'rim' && i >= 0) { const d = cen.clone().sub(probes[i].p); arc = Math.floor(Math.atan2(d.dot(probes[i].U) - 2, d.dot(probes[i].R)) * 7 / Math.PI); }   // TC1 race_rim: 14 arcs, alternating
        k = (mkI as [string, string])[((tag === 'rim' ? arc : m) % 2 + 2) % 2]; }
      tri2key[t] = k; parts[k] = (parts[k] ?? 0) + 1; } }
  // one mesh per material over the union's vertices
  const parent = body.parent!, outMeshes: THREE.Mesh[] = [];
  for (const k of Object.keys(parts)) { const remap = new Map<number, number>(), P: number[] = [], C: number[] = [], Nn: number[] = [], I: number[] = [];
    for (let t = 0; t < T; t++) { if (tri2key[t] !== k) continue; for (let e = 0; e < 3; e++) { const v = tv[t * 3 + e]; let j = remap.get(v); if (j === undefined) { j = remap.size; remap.set(v, j); P.push(vp[v * np], vp[v * np + 1], vp[v * np + 2]); C.push(vp[v * np + 3], vp[v * np + 4], vp[v * np + 5]); Nn.push(vp[v * np + 6], vp[v * np + 7], vp[v * np + 8]); } I.push(j); } }
    let g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setIndex(I);
    if (k === 'body') { fillColours(P, C, body.geometry); g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3)); const nA = new THREE.Float32BufferAttribute(Nn, 3); for (let i = 0; i < nA.count; i++) { const l = Math.hypot(nA.getX(i), nA.getY(i), nA.getZ(i)); if (l > 1e-6) nA.setXYZ(i, nA.getX(i) / l, nA.getY(i) / l, nA.getZ(i) / l); } g.setAttribute('normal', nA);
      // vertices made by the boolean on a part's face carry interpolated part props (normal 0): recompute those from the faces
      if ([...Array(nA.count).keys()].some((i) => Math.hypot(nA.getX(i), nA.getY(i), nA.getZ(i)) < 0.5)) { const g2 = g.clone(); g2.computeVertexNormals(); for (let i = 0; i < nA.count; i++) if (Math.hypot(nA.getX(i), nA.getY(i), nA.getZ(i)) < 0.5) nA.setXYZ(i, g2.attributes.normal.getX(i), g2.attributes.normal.getY(i), g2.attributes.normal.getZ(i)); } }
    else { g = toCreasedNormals(g, Math.PI / 4); g.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 3).fill(1), 3)); }
    seedFn(g, seed + outMeshes.length);
    const m = new THREE.Mesh(g, k === 'body' ? body.material : k === 'lamp' ? lampMat : (mats[k] ?? mats.strang)); m.name = k === 'body' ? body.name || 'body' : 'tc1-' + k; m.castShadow = k !== 'lamp'; m.receiveShadow = k === 'body';   // TC1 interior lit like J17's race tube (no sun shadow from its own shell)
    m.position.copy(body.position); m.quaternion.copy(body.quaternion); m.scale.copy(body.scale); m.renderOrder = body.renderOrder; outMeshes.push(m); }
  const at = parent.children.indexOf(body); parent.remove(body); outMeshes.forEach((m, i) => { parent.add(m); if (i === 0 && at >= 0) { parent.children.splice(parent.children.indexOf(m), 1); parent.children.splice(at, 0, m); } });
  // topology of the union on its own index (the meshes above only split it by material; rep = the manifold's own vertex)
  const nv = vp.length / np;
  const E = new Map<number, number[]>(); for (let t = 0; t < T; t++) for (let e = 0; e < 3; e++) { const a = rep[tv[t * 3 + e]], b = rep[tv[t * 3 + (e + 1) % 3]], k2 = a < b ? a * nv + b : b * nv + a; let L = E.get(k2); if (!L) E.set(k2, (L = [])); L.push(a < b ? 1 : -1); }
  let open = 0, multi = 0, flipped = 0; for (const L of E.values()) { if (L.length === 1) open++; else if (L.length > 2) multi++; else if (L[0] === L[1]) flipped++; }
  // Q5 (QA_CRITIC_PROTOCOL_R1 §1b): sharp edges = dihedral > 60° in ONE segment; chains of such edges longer than 0.2 H (0.498 m) count
  const mPerUnit = localToTrack.getMaxScaleOnAxis(), fn = new Float32Array(T * 3), a3 = new THREE.Vector3(), b3 = new THREE.Vector3(), c3 = new THREE.Vector3();
  const thin = new Uint8Array(T);   // boolean slivers (min altitude < 1 cm) have no reliable normal: their edges are not judged
  for (let t = 0; t < T; t++) { a3.fromArray(vp, tv[t * 3] * np); b3.fromArray(vp, tv[t * 3 + 1] * np); c3.fromArray(vp, tv[t * 3 + 2] * np);
    const e0 = b3.distanceTo(a3), e1 = c3.distanceTo(b3), e2 = a3.distanceTo(c3); const n = b3.clone().sub(a3).cross(c3.clone().sub(a3)), area2 = n.length(); n.normalize(); fn[t * 3] = n.x; fn[t * 3 + 1] = n.y; fn[t * 3 + 2] = n.z;
    if ((area2 / Math.max(e0, e1, e2, 1e-9)) * mPerUnit < 0.01) thin[t] = 1; }
  const ET = new Map<number, number[]>(); for (let t = 0; t < T; t++) for (let e = 0; e < 3; e++) { const a = rep[tv[t * 3 + e]], b = rep[tv[t * 3 + (e + 1) % 3]], k2 = a < b ? a * nv + b : b * nv + a; let L = ET.get(k2); if (!L) ET.set(k2, (L = [])); L.push(t); }
  const sharpBy: Record<string, number> = {}, runOf = (t: number) => { let r = 0; while (r + 1 < runIndex.length && runIndex[r + 1] / 3 <= t) r++; return r; };
  const sharp: [number, number, number][] = [], sharpTag: string[] = []; for (const [k2, L] of ET) { if (L.length !== 2 || (tri2key[L[0]] === 'body' && tri2key[L[1]] === 'body') || thin[L[0]] || thin[L[1]]) continue; const d = fn[L[0] * 3] * fn[L[1] * 3] + fn[L[0] * 3 + 1] * fn[L[1] * 3 + 1] + fn[L[0] * 3 + 2] * fn[L[1] * 3 + 2]; if (d < 0.499) {   /* > 60° strictly; edges inside the placeholder body (V-127) not counted */ const a = Math.floor(k2 / nv), b = k2 % nv, pk = [J.tags.get(runOrig[runOf(L[0])]), J.tags.get(runOrig[runOf(L[1])])].sort().join('|'); sharpBy[pk] = (sharpBy[pk] ?? 0) + 1; sharpTag.push(pk); sharp.push([a, b, Math.hypot(vp[a * np] - vp[b * np], vp[a * np + 1] - vp[b * np + 1], vp[a * np + 2] - vp[b * np + 2]) * mPerUnit]); } }
  const par = new Map<number, number>(), fd = (x: number): number => { let r = x; while (par.has(r) && par.get(r) !== r) r = par.get(r)!; return r; }; for (const [a, b] of sharp) { if (!par.has(a)) par.set(a, a); if (!par.has(b)) par.set(b, b); par.set(fd(a), fd(b)); }
  const chain = new Map<number, number>(); for (const [a, , l] of sharp) chain.set(fd(a), (chain.get(fd(a)) ?? 0) + l);
  const chains = [...chain.values()].sort((x, y) => y - x), q5: any = { sharpEdges: sharp.length, chainsOver0_2H: chains.filter((l) => l > 0.498).length, longestChain_m: +(chains[0] ?? 0).toFixed(2), byTags: sharpBy };
  { const info = new Map<number, { l: number; tags: Record<string, number>; at: number[] }>(); sharp.forEach(([a, , l], i) => { const r = fd(a); let x = info.get(r); if (!x) info.set(r, (x = { l: 0, tags: {}, at: new THREE.Vector3(vp[a * np], vp[a * np + 1], vp[a * np + 2]).applyMatrix4(localToTrack).toArray().map((v) => +v.toFixed(1)) })); x.l += l; x.tags[sharpTag[i]] = (x.tags[sharpTag[i]] ?? 0) + 1; });
    q5.top = [...info.values()].sort((x, y) => y.l - x.l).slice(0, 6).map((x) => ({ m: +x.l.toFixed(2), tags: x.tags, at: x.at })); }
  const compList = J.M.decompose(), components = compList.length, compSmall = compList.length > 1 ? compList.map((c: any) => { const bb = c.boundingBox(), ctr = new THREE.Vector3((bb.min[0] + bb.max[0]) / 2, (bb.min[1] + bb.max[1]) / 2, (bb.min[2] + bb.max[2]) / 2).applyMatrix4(localToTrack); const mg = c.getMesh(); const ids = [...new Set(Array.from(mg.runOriginalID as Uint32Array).map((x) => J.tags.get(x)))]; return { tris: c.numTri(), at: ctr.toArray().map((v) => +v.toFixed(1)), tags: ids }; }).sort((a: any, b: any) => b.tris - a.tris).slice(1, 9) : [];
  const report: TunnelJoinReport = { tunnels: built.map((b, k) => ({ i0: tunnels[k].i0, i1: tunnels[k].i1, mouth: [+mouths[k].mouthIn.toFixed(1), +mouths[k].mouthOut.toFixed(1)], mouthFound: mouths[k].found, style: b.style, modules: b.nMod, booleanMs: J.times[k], lamps: b.lights.length })), ms: J.ms, tris: T, topo: { open, multi, flipped }, status: J.status, parts, components, compSmall, bodyComponents: J.bodyComponents, crumbsDropped: J.crumbs, floatingParts: J.floating, specksDropped: J.specks, q5 };
  return { report, meshes: outMeshes, lights: built.flatMap((b) => b.lights), union: J.M, built };
}

/** split every triangle that crosses the plane (point p, unit normal n; only edges whose midpoint lies within r of p) at the crossing points.
 *  Conforming: a crossing point belongs to the undirected edge (keyed by the manifold's own vertices `rep`), so both neighbours of an edge split
 *  at the same position and the body stays closed; property seams get one vertex per side (same position, rep → the first one). Runs are kept. */
function splitAtPlane(vp: Float32Array, tv: Uint32Array, np: number, runIndex: Uint32Array, rep: Uint32Array, pl: { p: THREE.Vector3; n: THREE.Vector3; r: number }) {
  const nv0 = vp.length / np, f = new Float64Array(nv0), V: number[] = [], R: number[] = [], made = new Map<string, number>(), madeRep = new Map<string, number>(), r2 = pl.r * pl.r;
  for (let i = 0; i < nv0; i++) f[i] = (vp[i * np] - pl.p.x) * pl.n.x + (vp[i * np + 1] - pl.p.y) * pl.n.y + (vp[i * np + 2] - pl.p.z) * pl.n.z;
  const side = (i: number) => f[rep[i]] >= 0;
  const EPS = 1e-3, cuts = (i: number, j: number) => { if (side(i) === side(j) || Math.abs(f[rep[i]]) < EPS || Math.abs(f[rep[j]]) < EPS) return false;   /* a vertex within 1 mm of the plane is on it: no new vertex beside it (the mouth band's own profile ring lies in the plane) */ const a = rep[i], b = rep[j], mx = (vp[a * np] + vp[b * np]) / 2 - pl.p.x, my = (vp[a * np + 1] + vp[b * np + 1]) / 2 - pl.p.y, mz = (vp[a * np + 2] + vp[b * np + 2]) / 2 - pl.p.z; return mx * mx + my * my + mz * mz < r2; };
  const at = (i: number, j: number) => { const k = i < j ? i + ',' + j : j + ',' + i; let v = made.get(k); if (v !== undefined) return v;
    const a = Math.min(rep[i], rep[j]), b = Math.max(rep[i], rep[j]), t = f[a] / (f[a] - f[b]), lo = rep[i] === a ? i : j, hi = lo === i ? j : i;   // position from the rep pair: bit-identical on both sides of a seam
    v = nv0 + V.length / np; for (let c = 0; c < np; c++) V.push(c < 3 ? vp[a * np + c] + (vp[b * np + c] - vp[a * np + c]) * t : vp[lo * np + c] + (vp[hi * np + c] - vp[lo * np + c]) * t);
    const kr = a + ',' + b; let rv = madeRep.get(kr); if (rv === undefined) { rv = v; madeRep.set(kr, v); } R.push(rv); made.set(k, v); return v; };
  const out: number[] = [], runs: number[] = [0];
  for (let r = 0; r + 1 < runIndex.length; r++) { for (let t = runIndex[r] / 3; t < runIndex[r + 1] / 3; t++) { const q = [tv[t * 3], tv[t * 3 + 1], tv[t * 3 + 2]], c = [cuts(q[0], q[1]), cuts(q[1], q[2]), cuts(q[2], q[0])], nC = +c[0] + +c[1] + +c[2];
      if (nC === 0) { out.push(q[0], q[1], q[2]); continue; }
      if (nC === 1) { const e = c.indexOf(true), A = q[e], B = q[(e + 1) % 3], C = q[(e + 2) % 3], m = at(A, B); out.push(A, m, C, m, B, C); continue; }
      const e = c.indexOf(false), A = q[(e + 2) % 3], B = q[e], C = q[(e + 1) % 3], m1 = at(A, B), m2 = at(C, A);   // A alone: edges A-B and C-A are cut, B-C not
      out.push(A, m1, m2, m1, B, C, m1, C, m2); }
    runs.push(out.length); }
  const vp2 = new Float32Array(vp.length + V.length); vp2.set(vp); vp2.set(V, vp.length); const rep2 = new Uint32Array(nv0 + R.length); rep2.set(rep); rep2.set(R, nv0);
  return { vp: vp2, tv: Uint32Array.from(out), runIndex: Uint32Array.from(runs), rep: rep2 };
}
