// C4c (Steuerung 11.10., LAB PATCH 16 graph): the exit / entry furniture at the hex hub in the J17 look, from Track Core 0.16 graph data 1:1:
//   · gore zones (moduleDeck rows)            → J17 road clay (street skin, as the hub road) + M2 Sperrfläche (frame S, bars B at 45°, pitch 3 m)
//   · uturn nose (moduleDeck furniture)       → J17 strand clay tube at bande height (Track Core 0.16.9: exit + entry; 0.16.8's search window
//                                                put the rows on wrong main samples, fixed by RKIT after the Lab's report)
//   · cushion (moduleDeck furniture)          → clay polster in front of the exit nose (r 1.2, h 1.1 from the data)
//   · arrows (graphMarkings)                  → M2 arrow: length 10, shaft B, head 1.6 × 1.8, turn arm at 42 % with radius 0.9
//   · zebra (V-150 #21, Steuerung: M2 element 1:1, one per branch where the flush street begins) and RKIT bollards (rkit_poller.parts, anchorRule,
//     one wobble seed per post) along both plaza edges of the flush street, with a gate at the zebra (Steuerung 11.10.)
// Everything in track metres inside the J17 track group (the host scales the world by RACE_W).
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
// @ts-ignore plain JSON
import M2J from './vendor/j17/lab-track/road-markings.m2.json';

type V3a = number[];
const v = (a: V3a) => new THREE.Vector3(a[0], a[1], a[2]);
const ribbon = (L: THREE.Vector3[], R: THREE.Vector3[]) => { const P: number[] = [], I: number[] = []; for (let k = 0; k < L.length; k++) P.push(L[k].x, L[k].y, L[k].z, R[k].x, R[k].y, R[k].z);
  for (let k = 0; k + 1 < L.length; k++) { const a = 2 * k; I.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setIndex(I); return g; };
const upFacing = (g: THREE.BufferGeometry) => { g.computeVertexNormals(); const n = g.attributes.normal; let sy = 0; for (let i = 0; i < n.count; i++) sy += n.getY(i); if (sy < 0) { const I = Array.from(g.index!.array); for (let t = 0; t < I.length; t += 3) [I[t + 1], I[t + 2]] = [I[t + 2], I[t + 1]]; g.setIndex(I); g.computeVertexNormals(); } return g; };
/** a flat quad strip on the deck: centre line pts, half width w, lifted h along U */
const quadAt = (c: THREE.Vector3, dir: THREE.Vector3, side: THREE.Vector3, len: number, w: number, lift: number) => { const a = c.clone().addScaledVector(dir, -len / 2), b = c.clone().addScaledVector(dir, len / 2);
  return upFacing(ribbon([a.clone().addScaledVector(side, -w / 2), b.clone().addScaledVector(side, -w / 2)].map((p) => p.setY(p.y + lift)), [a.clone().addScaledVector(side, w / 2), b.clone().addScaledVector(side, w / 2)].map((p) => p.setY(p.y + lift)))); };

export async function buildC4cFurniture(o: { G4: any; M: any; seed: (g: THREE.BufferGeometry, n: number) => void; RACE_W: number; poller?: () => Promise<THREE.Object3D | null> }) {
  const { G4, M, seed } = o, grp = new THREE.Group(); grp.name = 'c4c-furniture';
  const walk: THREE.Mesh[] = [], info: any = { gore: 0, hatchBars: 0, noses: 0, cushions: 0, arrows: 0, zebraBars: 0, bollards: 0, gates: 0 };
  const WD = (M2J as any).widths, ZB = (M2J as any).elements.zebra, AR = (M2J as any).elements.arrow, HA = (M2J as any).elements.hatch;
  const add = (g: THREE.BufferGeometry, mat: THREE.Material, name: string, walkable = false, n = 0) => { seed(g, 900 + n); const m = new THREE.Mesh(g, mat); m.name = name; m.receiveShadow = true; m.castShadow = !/markierung/.test(name); grp.add(m); if (walkable) walk.push(m); return m; };
  const zones = (G4.deck?.zones || []).filter((z: any) => z.kind === 'gore'), fur = G4.deck?.furniture || [];
  const noses: { c: THREE.Vector3; from: THREE.Vector3; T: THREE.Vector3; r: number; exit: boolean; module: string }[] = [];
  zones.forEach((z: any, zi: number) => {
    // ---- gore surface: J17 road clay, street skin (aW 0) like the hub road it joins; aSU = (station, lateral)
    const A = z.rows.map((r: V3a[]) => v(r[0]).setY(r[0][1] + 0.006)), B = z.rows.map((r: V3a[]) => v(r[1]).setY(r[1][1] + 0.006)), g = upFacing(ribbon(A, B)), n = g.attributes.position.count;
    g.setAttribute('aW', new THREE.Float32BufferAttribute(new Float32Array(n), 1)); g.setAttribute('aBio', new THREE.Float32BufferAttribute(new Float32Array(n), 1));
    const su = new Float32Array(n * 2); for (let k = 0; k < n; k++) { su[2 * k] = (k >> 1) * 0.5; su[2 * k + 1] = k & 1; } g.setAttribute('aSU', new THREE.Float32BufferAttribute(su, 2));
    add(g, M.road, 'fahrbahn-gore-' + z.module, true, zi); info.gore++;
    // ---- M2 Sperrfläche: frame S along both gore edges, bars B at 45° every `pitch` m where the gore is wider than a bar
    const lift = 0.012, hat: THREE.BufferGeometry[] = [];
    for (const E of [A, B]) { const L: THREE.Vector3[] = [], R: THREE.Vector3[] = []; E.forEach((p: THREE.Vector3, k: number) => { const o2 = (E === A ? B[k] : A[k]).clone().sub(p).setY(0); const w = o2.length(); const d = w > 1e-6 ? o2.multiplyScalar(Math.min(WD.S, w) / w) : new THREE.Vector3(); L.push(p.clone().setY(p.y + lift)); R.push(p.clone().add(d).setY(p.y + lift)); }); hat.push(upFacing(ribbon(L, R))); }
    const wid = z.rows.map((r: V3a[]) => Math.hypot(r[1][0] - r[0][0], r[1][2] - r[0][2])), step = 0.5;
    for (let k = 0; k < z.rows.length; k += Math.round(HA.pitch / step)) { if (wid[k] < 2 * WD.B) continue;   // a bar runs from edge A at row k diagonally (45°) to edge B one gore-width further on
      const k2 = Math.min(z.rows.length - 1, k + Math.round(wid[k] / step)); const p0 = A[k], p1 = B[k2], dir = p1.clone().sub(p0).setY(0), len = dir.length(); if (len < WD.B) continue; dir.normalize();
      const side = new THREE.Vector3(-dir.z, 0, dir.x), c = p0.clone().add(p1).multiplyScalar(0.5); hat.push(quadAt(c, dir, side, len, WD.B, lift - (c.y - (p0.y + p1.y) / 2))); info.hatchBars++; }
    add(mergeGeometries(hat, false)!, M.markH, 'markierung-sperrflaeche-' + z.module, false, 40 + zi);
  });
  for (const f of fur) if (f.kind === 'uturn') noses.push({ c: v(f.c), from: v(f.from), T: v(f.T), r: f.r, exit: false, module: f.module });   // Track Core 0.16.9 moduleDeck (exit + entry)
  const cushions = fur.filter((f: any) => f.kind === 'cushion');
  // ---- noses in the J17 look: Track Core sizes the U for its own barrier (centre shoulderW + gap + T/2 = 3.51 off the road edge); the J17 bead sits
  // ≈ 1.17 off the edge (track-look.v5 sideProfile: e + 0.4 + 0.85 r, r ≈ 0.9), so the U radius grows by 2.34 and the tube takes the bead's section
  // (r 0.85, centre 0.45 over the deck); legs 2 m along the bandes, round end caps (an open tube end read as a loose sheet, Georg live 11.10.)
  const J17_IN = 3.51 - 1.17, TR = 0.85, TY = 0.45;
  noses.forEach((N, ni) => { const r = N.r + J17_IN, from = N.from.clone().setLength(r), leg = N.T.clone().negate().multiplyScalar(2), pts: THREE.Vector3[] = [];
    pts.push(N.c.clone().add(from).add(leg)); for (let k = 0; k <= 20; k++) { const th = (k / 20) * Math.PI; pts.push(N.c.clone().addScaledVector(from, Math.cos(th)).addScaledVector(N.T, r * Math.sin(th))); } pts.push(N.c.clone().sub(from).add(leg));
    pts.forEach((p) => (p.y = N.c.y + TY)); const parts = [new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, TR, 16, false)];
    for (const e of [pts[0], pts[pts.length - 1]]) { const g2 = new THREE.SphereGeometry(TR, 16, 10); g2.translate(e.x, e.y, e.z); parts.push(g2); }
    add(mergeGeometries(parts.map((g) => { const n = g.index ? g.toNonIndexed() : g; n.deleteAttribute('uv'); return n; }), false)!, M.strang, 'bande-nase-' + N.module, true, 60 + ni); info.noses++;
    for (const cu of cushions.filter((c: any) => c.module === N.module)) { const p = v(cu.p).addScaledVector(N.T, J17_IN), prof: THREE.Vector2[] = []; for (let k = 0; k <= 10; k++) { const t = k / 10; prof.push(new THREE.Vector2(cu.r * Math.sin(Math.PI / 2 * Math.min(1, t * 1.6)) * (1 - 0.15 * t * t), cu.h * t)); }
      const g2 = new THREE.LatheGeometry(prof, 28); g2.translate(p.x, N.c.y, p.z); add(g2, M.strang, 'bande-puffer-' + N.module, true, 70 + ni); info.cushions++; } });
  // ---- M2 arrows (graph arrow data: p on the lane, T forward)
  for (const [ai, a] of (G4.arrows || []).entries()) { const p = v(a.p), T = v(a.T).setY(0).normalize(), R = new THREE.Vector3(-T.z, 0, T.x).negate(), L = AR.length, sw = WD.B, lift = 0.012, parts: THREE.BufferGeometry[] = [];
    const head = (tip: THREE.Vector3, dir: THREE.Vector3) => { const sd = new THREE.Vector3(-dir.z, 0, dir.x), b = tip.clone().addScaledVector(dir, -AR.headL), q = (x: THREE.Vector3) => x.clone().setY(x.y + lift);
      const P = [q(tip), q(b.clone().addScaledVector(sd, AR.headW / 2)), q(b.clone().addScaledVector(dir, 0.25)), q(b.clone().addScaledVector(sd, -AR.headW / 2))], g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(P.flatMap((x) => [x.x, x.y, x.z]), 3)); g.setIndex([0, 1, 2, 0, 2, 3]); return upFacing(g); };
    const back = p.clone().addScaledVector(T, -L / 2), front = p.clone().addScaledVector(T, L / 2), sdir = /left/.test(a.shape) ? -1 : 1, turn = /^exit|^split/.test(a.shape), merge = /^merge/.test(a.shape);
    const shaftEnd = merge ? back.clone().addScaledVector(T, L * (1 - AR.turn.branch)) : front.clone().addScaledVector(T, -AR.headL);
    parts.push(quadAt(back.clone().add(shaftEnd).multiplyScalar(0.5), T, R, back.distanceTo(shaftEnd), sw, lift)); if (!merge) parts.push(head(front, T));
    if (turn || merge) { const k0 = merge ? shaftEnd : back.clone().addScaledVector(T, L * AR.turn.branch), side = R.clone().multiplyScalar(sdir), arc: THREE.Vector3[] = [];   // arm: arc radius 0.9 into the side, head across
      for (let k = 0; k <= 8; k++) { const th = (k / 8) * (Math.PI / 4); arc.push(k0.clone().addScaledVector(T, AR.turn.radius * Math.sin(th)).addScaledVector(side, AR.turn.radius * (1 - Math.cos(th)))); }
      const dir45 = T.clone().add(side).normalize(), tip = arc[arc.length - 1].clone().addScaledVector(dir45, 1.4 + AR.headL); arc.push(tip.clone().addScaledVector(dir45, -AR.headL));
      for (let k = 0; k + 1 < arc.length; k++) { const d = arc[k + 1].clone().sub(arc[k]); const l = d.length(); if (l < 1e-6) continue; parts.push(quadAt(arc[k].clone().add(arc[k + 1]).multiplyScalar(0.5), d.normalize(), new THREE.Vector3(-d.z, 0, d.x), l + 0.05, sw, lift)); }
      parts.push(head(tip, dir45)); }
    add(mergeGeometries(parts, false)!, M.markH, 'markierung-pfeil-' + a.id, false, 80 + ai); info.arrows++; }
  // ---- zebra (M2 element 1:1: bars Q, gap Q, length `zebra.length`, symmetric over the road between the edge lines) where the flush street begins,
  // and the RKIT bollard rows along both plaza edges of the flush street, with a gate at the zebra
  const flush: { rid: string; s0: number; s1: number; zebra: number }[] = [];
  // flush = where the branch road lies within 0.12 m of the plaza level (its lowest stretch): the ramps' first / last metres count too
  for (const [rid, r] of Object.entries<any>(G4.routes)) { if (rid === 'ring') continue; const S = r.samples, yF = Math.min(...S.map((q: any) => q.p[1])); let a: number | null = null, b: number | null = null;
    for (const q of S) if (q.p[1] - yF < 0.12) { if (a == null) a = q.s; b = q.s; }
    if (a != null && b != null && b - a > ZB.length + 6) flush.push({ rid, s0: a, s1: b, zebra: rid === 'c4_back' ? b - 2 - ZB.length / 2 : a + 2 + ZB.length / 2 }); }
  const at = (S: any[], s: number) => { let lo = 0, hi = S.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].s < s) lo = m; else hi = m; } const a = S[lo], b = S[hi], t = b.s > a.s ? (s - a.s) / (b.s - a.s) : 0;
    return { p: v(a.p).lerp(v(b.p), t), T: v(a.T).lerp(v(b.T), t).normalize(), R: v(a.R).lerp(v(b.R), t).normalize(), w: a.prm.width + (b.prm.width - a.prm.width) * t, off: a.prm.offset ?? 0 }; };
  const post = o.poller ? await o.poller() : null; const AN = { clear: 1.8, pitch: 2.3, inset: 0.6, endGap: 0.4, d: 0.6 };   // rkit_poller.parts.json anchorRule (lab); d = collar Ø
  flush.forEach((F, fi) => { const S = G4.routes[F.rid].samples, Z = at(S, F.zebra), wR = Z.w, n = Math.floor((wR - 2 * WD.S + WD.Q) / (2 * WD.Q)), zb: THREE.BufferGeometry[] = [];
    for (let k = 0; k < n; k++) { const x = (k - (n - 1) / 2) * 2 * WD.Q; zb.push(quadAt(Z.p.clone().addScaledVector(Z.R, Z.off + x), Z.T, Z.R, ZB.length, WD.Q, 0.012)); info.zebraBars++; }
    if (zb.length) add(mergeGeometries(zb, false)!, M.markH, 'markierung-zebra-' + F.rid, false, 100 + fi);
    if (!post) return; const K = o.RACE_W, pitch = AN.pitch / K, inset = AN.inset / K, endG = (AN.endGap + AN.d / 2) / K, gate = [F.zebra - ZB.length / 2 - pitch * 0.5, F.zebra + ZB.length / 2 + pitch * 0.5];
    info.gates++; for (const sd of [-1, 1]) for (let s = F.s0 + endG; s <= F.s1 - endG + 1e-6; s += pitch) { if (s > gate[0] && s < gate[1]) continue;   // gate: no posts across the zebra
      const q = at(S, s), pos = q.p.clone().addScaledVector(q.R, q.off + sd * (q.w / 2 + inset)), m = post.clone(true); m.scale.setScalar(1 / K); m.position.copy(pos);
      const h = Math.sin(s * 12.9898 + sd * 78.233) * 43758.5453, r = h - Math.floor(h); m.rotation.set((r - 0.5) * 0.06, r * Math.PI * 2, (0.5 - r) * 0.05);   // own wobble per post (seed)
      m.traverse((x: any) => { if (x.isMesh) { x.name = 'bande-poller'; x.castShadow = x.receiveShadow = true; walk.push(x); } }); grp.add(m); info.bollards++; } });
  info.flush = flush.map((F) => ({ rid: F.rid, s0: +F.s0.toFixed(1), s1: +F.s1.toFixed(1), zebra: +F.zebra.toFixed(1) }));
  return { group: grp, walk, info };
}
