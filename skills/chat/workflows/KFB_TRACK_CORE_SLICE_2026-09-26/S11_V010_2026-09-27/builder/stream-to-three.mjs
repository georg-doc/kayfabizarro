// Reference loader: Track Core stream (kfb.track-core.stream/0.3, core v0.3 .. v0.8.1) -> three.js meshes.
// v2 (S4 brief v2): tunnel tubes / halls from stream.tunnels + tunnelRings (core v0.7+), and loadStream() for .json.gz.
// v3 (core v0.10): graph.deck = { zones, furniture } of the junction modules (gore fill, box apron, pit wall, cushions,
// garages, box marks, barrier caps, Weiche U barrier). Preview colours only; the look belongs to the design pass.
// Mirrors the Blender importer (b1_import_stream.py). The stream is the only input; nothing is re-solved here.
// Stream frame = three.js frame: right-handed, +Y up, heading 0 -> +Z. No axis swap needed.
//
//   import * as THREE from 'three';
//   import { buildTrack } from './stream-to-three.mjs';
//   const stream = await (await fetch('td03.stream.json')).json();
//   scene.add(buildTrack(THREE, stream));   // Group: body + markings mesh per route, vertex colours = stream paint
//
// Face roles (between slot i and i+1, ring closes under_R -> under_L). A skin assigns one colour per role.
export const FACE_ROLE = ['barrier_side', 'barrier_side', 'barrier_cap', 'barrier_side', 'shoulder', 'shoulder', 'road',
  'shoulder', 'shoulder', 'barrier_side', 'barrier_cap', 'barrier_side', 'barrier_side', 'underside'];
export const MARK_COLOUR = { edges: [0.992, 0.765, 0.282], centre: [0.957, 0.945, 0.910], bars: [0.498, 0.831, 1.0] };

// Stream colours are sRGB 0..1; three.js vertex colours are linear.
const lin = (c) => c.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));

const slotWorld = (q, i) => {
  const [lat, lift] = q.slots[i];
  return [0, 1, 2].map((k) => q.p[k] + q.R[k] * lat + q.U[k] * lift);
};

// Body: one quad strip per face role, per-sample colour from q.paint[role] (already blended across seams by the core).
// Runs break where the stream says so: no surface (air), or a break sample (brk) at split/merge topology changes.
export function buildBody(THREE, S) {
  const n = FACE_ROLE.length, pos = [], col = [], idx = [];
  const drawn = (a) => !(S[a].prm.surface < 0.5 || S[a + 1].prm.surface < 0.5 || S[a + 1].brk);
  // flat-coloured quads: 4 own vertices per face so colours do not bleed between roles
  const quad = (A, B, C, D, cA, cB) => {
    const b = pos.length / 3;
    for (const [p, c] of [[A, cA], [B, cA], [C, cB], [D, cB]]) { pos.push(...p); col.push(...lin(c)); }
    idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
  };
  // v3: the end face is triangulated as a real polygon in the section plane (the ring is not convex: a fan made a sail
  // across the road at mid-track breaks). Collapsed slots (side 0) are dropped first.
  const cap = (q, reverse) => {
    const pts2 = [], ids = [];
    for (let i = 0; i < n; i++) { const v = q.slots[i]; const l = pts2[pts2.length - 1]; if (l && Math.hypot(l.x - v[0], l.y - v[1]) < 1e-4) continue; pts2.push(new THREE.Vector2(v[0], v[1])); ids.push(i); }
    if (pts2.length > 2 && Math.hypot(pts2[0].x - pts2[pts2.length - 1].x, pts2[0].y - pts2[pts2.length - 1].y) < 1e-4) { pts2.pop(); ids.pop(); }
    if (pts2.length < 3) return;
    const tris = THREE.ShapeUtils.triangulateShape(pts2, []);
    const b = pos.length / 3; const c = lin(q.paint.underside);
    for (const i of ids) { pos.push(...slotWorld(q, i)); col.push(...c); }
    push3(tris, b, reverse ? q.T.map((v) => -v) : q.T);
  };
  // each end-face triangle is wound so it faces out of the body (start: -T, end: +T)
  const push3 = (tris, b, want) => { for (const [x, y, z] of tris) {
    const P = (k) => pos.slice(3 * (b + k), 3 * (b + k) + 3), A = P(x), B = P(y), C = P(z);
    const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], v = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) ? idx.push(b + x, b + y, b + z) : idx.push(b + x, b + z, b + y); } };
  // v3: an internal break (same position, new profile: a barrier run ends or starts mid-track) gets no full end face
  // across the road; only the side that changes is closed, from the larger of the two sections.
  const inner = (i) => i > 0 && i < S.length && S[i].brk && Math.hypot(S[i].p[0] - S[i - 1].p[0], S[i].p[1] - S[i - 1].p[1], S[i].p[2] - S[i - 1].p[2]) < 1e-3;
  const sideCaps = (qa, qb) => {   // qa ends a run, qb starts the next one at the same place
    for (const [lo, hi, rd] of [[0, 6, 6], [7, 13, 7]]) {
      const ext = (q) => Math.abs(q.slots[lo === 0 ? 0 : 13][0] - q.slots[rd][0]);
      const ea = ext(qa), eb = ext(qb); if (Math.abs(ea - eb) < 1e-3) continue;
      const q = ea > eb ? qa : qb, forward = ea > eb;
      const pts2 = [], ids = [];
      for (let i = lo; i <= hi; i++) { const v = q.slots[i]; pts2.push(new THREE.Vector2(v[0], v[1])); ids.push(i); }
      const under = q.slots[lo === 0 ? 0 : 13][1]; pts2.push(new THREE.Vector2(q.slots[rd][0], under)); ids.push(-1);
      const tris = THREE.ShapeUtils.triangulateShape(pts2, []), b = pos.length / 3, c = lin(q.paint.underside);
      for (let k = 0; k < ids.length; k++) { const [l, h] = [pts2[k].x, pts2[k].y]; pos.push(...[0, 1, 2].map((j) => q.p[j] + q.R[j] * l + q.U[j] * h)); col.push(...c); }
      push3(tris, b, forward ? q.T : q.T.map((v) => -v));
    }
  };
  for (let a = 0; a < S.length - 1; a++) {
    if (!drawn(a)) continue;
    const q0 = S[a], q1 = S[a + 1];
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, role = FACE_ROLE[i];
      quad(slotWorld(q0, i), slotWorld(q0, j), slotWorld(q1, j), slotWorld(q1, i), q0.paint[role], q1.paint[role]);
    }
    if (a === 0 || !drawn(a - 1)) { if (a > 0 && inner(a)) sideCaps(S[a - 1], q0); else cap(q0, true); }
    if (a === S.length - 2 || !drawn(a + 1)) { if (!inner(a + 2)) cap(q1, false); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));  // linear
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

// Markings: flat bands lifted 3 cm over the road. 'edges' follow road edge minus inset; 'centre' and 'bars' sit on the
// road offset. Bar width = road width x band.span (the arrow taper lives in span; the core already tapers it).
export function buildMarkings(THREE, S, bands, lift = 0.03) {
  const pos = [], col = [], idx = []; const sArr = S.map((q) => q.s);
  const lo = (x) => { let a = 0, b = sArr.length; while (a < b) { const m = (a + b) >> 1; if (sArr[m] < x) a = m + 1; else b = m; } return a; };
  for (const bd of bands) {
    const seg = []; for (let i = Math.max(0, lo(bd.s0) - 1); i < S.length && S[i].s <= bd.s1 + 1e-6; i++) if (S[i].s >= bd.s0 - 1e-6) seg.push(S[i]);
    if (seg.length < 2) continue;
    const c = lin(MARK_COLOUR[bd.at] ?? [1, 1, 1]), base = pos.length / 3;
    for (const q of seg) {
      const half = q.prm.width / 2, lat = bd.at === 'edges' ? q.prm.offset + bd.side * (half - bd.inset) : q.prm.offset;
      const w = bd.at === 'bars' ? q.prm.width * bd.span : bd.w;
      for (const d of [-w / 2, w / 2]) { for (let k = 0; k < 3; k++) pos.push(q.p[k] + q.R[k] * (lat + d) + q.U[k] * lift); col.push(...c); }
    }
    for (let k = 0; k < seg.length - 1; k++) { const a = base + 2 * k; idx.push(a, a + 1, a + 3, a, a + 3, a + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

// Tunnels (core v0.7+): stream.tunnels = segments {id, host, kind: 'tube'|'hall', i0, i1, shapes}; every sample inside
// carries tunnel {ringId, wall}; stream.tunnelRings[ringId] = closed inner ring of [lateral, lift] in the sample frame.
// Mirrors blender/s8_tunnel_site.py tube_mesh: inner wall, outer shell (ring pushed out by `wall`), end rims.
// Preview colours per host (inner, outer, rim); the look is yours to replace.
export const TUNNEL_HOST = {
  mountain: [0xf0dcc0, 0xa0714a, 0xf4f1e8], building: [0xf6e0da, 0xd0453a, 0xf4f1e8], shaft: [0xe4dcf4, 0x6a3fb0, 0xf4f1e8],
  labyrinth: [0xd6f2e8, 0x1f8a70, 0xf4f1e8], earth: [0xeeeeee, 0x8a8580, 0xf4f1e8], bunker: [0xd9d6c8, 0x6b6f5a, 0xf2d24a],
  alien: [0xc8f7e8, 0x3fd6a8, 0xb07cf0], toy: [0xfff0e0, 0xff7a1a, 0x4f9be8], hangar: [0xe6e8ee, 0x8d96a8, 0xf2d24a] };
const hexRGB = (h) => [(h >> 16) & 255, (h >> 8) & 255, h & 255].map((v) => v / 255);
const outerRing = (ring, w) => ring.map((p, j) => { const a = ring[(j - 1 + ring.length) % ring.length], b = ring[(j + 1) % ring.length];
  const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1; return [p[0] + ty / l * w, p[1] - tx / l * w]; });
export function buildTunnels(THREE, stream, step = 2) {
  const S = stream.samples, rings = stream.tunnelRings, pos = [], col = [], idx = [];
  if (!rings || !stream.tunnels) return null;
  const at = (q, lat, lift) => [0, 1, 2].map((k) => q.p[k] + q.R[k] * lat + q.U[k] * lift);
  for (const seg of stream.tunnels) {
    const ids = []; for (let i = seg.i0; i <= seg.i1; i += step) ids.push(i); if (ids[ids.length - 1] !== seg.i1) ids.push(seg.i1);
    const [ci, co, cr] = (TUNNEL_HOST[seg.host] ?? TUNNEL_HOST.earth).map((h) => lin(hexRGB(h)));
    const wall = S[seg.i0].tunnel?.wall ?? 1.2;
    const RI = ids.map((i) => rings[S[i].tunnel.ringId]), RO = RI.map((r) => outerRing(r, wall)), N = RI[0].length;
    const ring = (k, R, c) => { const b = pos.length / 3; for (const [l, h] of R[k]) { pos.push(...at(S[ids[k]], l, h)); col.push(...c); } return b; };
    for (let k = 0; k < ids.length - 1; k++) for (const [R, c] of [[RI, ci], [RO, co]]) {
      const a = ring(k, R, c), b = ring(k + 1, R, c);
      for (let j = 0; j < N; j++) { const j1 = (j + 1) % N; idx.push(a + j, a + j1, b + j1, a + j, b + j1, b + j); } }
    for (const k of [0, ids.length - 1]) { const a = ring(k, RI, cr), b = ring(k, RO, cr);   // end rims (annulus)
      for (let j = 0; j < N; j++) { const j1 = (j + 1) % N; idx.push(a + j, a + j1, b + j1, a + j, b + j1, b + j); } }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

// Fetch a stream; .json.gz is inflated in the browser (DecompressionStream).
export async function loadStream(url) {
  const r = await fetch(url);
  if (!url.endsWith('.gz')) return r.json();
  return new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).json();
}

// ---------------------------------------------------------------- v3 deck layer (core v0.10 junction modules)
export const DECK_COLOUR = { gore: 0xe9dcc3, hatch: 0xe0703a, apron: 0xa7adb3, deckSide: 0xcfc6b6, cushion: 0xe0703a, garage: 0xe6d9bf, door: 0x55606b, roof: 0xcdbd9c, mark: 0xf4f1e8 };
const V = (a) => ({ x: a[0], y: a[1], z: a[2] });
const vadd = (a, b) => a.map((v, i) => v + b[i]), vsub = (a, b) => a.map((v, i) => v - b[i]), vmul = (a, k) => a.map((v) => v * k);
const vlen = (a) => Math.hypot(...a), vnorm = (a) => vmul(a, 1 / (vlen(a) || 1)), vcross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
function hatchTexture(THREE) {
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  g.fillStyle = '#' + DECK_COLOUR.gore.toString(16).padStart(6, '0'); g.fillRect(0, 0, 64, 64);
  g.strokeStyle = '#' + DECK_COLOUR.hatch.toString(16).padStart(6, '0'); g.lineWidth = 9;
  for (const o of [-64, 0, 64]) { g.beginPath(); g.moveTo(o, 64); g.lineTo(o + 64, 0); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
// strip from rows [[a, b], ...]: top face (with uv in metres / 2.4), underside, optional side wall on the b edge
function zoneGeometry(THREE, z, sideB) {
  const U = z.U ?? [0, 1, 0], d = z.depth ?? 2.25, pos = [], uv = [], idx = [];
  let along = 0;
  const rows = z.rows; let want = U;
  const quad = (A, B, C, D, ua) => {   // wound so its normal points along `want`
    const n = vcross(vsub(B, A), vsub(C, A)), n2 = vcross(vsub(C, A), vsub(D, A)), nn = vlen(n) > vlen(n2) ? n : n2;
    if (nn[0] * want[0] + nn[1] * want[1] + nn[2] * want[2] < 0) { [A, B, C, D] = [D, C, B, A]; ua = [ua[6], ua[7], ua[4], ua[5], ua[2], ua[3], ua[0], ua[1]]; }
    const b = pos.length / 3; for (const p of [A, B, C, D]) pos.push(...p); uv.push(...ua); idx.push(b, b + 1, b + 2, b, b + 2, b + 3); };
  for (let k = 0; k < rows.length - 1; k++) {
    const [a0, b0] = rows[k], [a1, b1] = rows[k + 1], w0 = vlen(vsub(b0, a0)), w1 = vlen(vsub(b1, a1)), step = vlen(vsub(vmul(vadd(a1, b1), 0.5), vmul(vadd(a0, b0), 0.5)));
    const t = 1 / 2.4; want = U; quad(a0, b0, b1, a1, [0, along * t, w0 * t, along * t, w1 * t, (along + step) * t, 0, (along + step) * t]);
    const dn = (p) => vsub(p, vmul(U, d)); want = vmul(U, -1); quad(dn(a1), dn(b1), dn(b0), dn(a0), [0, 0, 0, 0, 0, 0, 0, 0]);
    if (sideB) { want = vsub(b0, a0); quad(b0, dn(b0), dn(b1), b1, [0, 0, 0, 0, 0, 0, 0, 0]); }
    along += step;
  }
  for (const k of [0, rows.length - 1]) { const [a, b] = rows[k]; if (vlen(vsub(b, a)) < 0.2) continue; const dn = (p) => vsub(p, vmul(U, d));
    const o = rows[k === 0 ? 1 : rows.length - 2]; want = vsub(vmul(vadd(a, b), 0.5), vmul(vadd(o[0], o[1]), 0.5)); quad(a, b, dn(b), dn(a), [0, 0, 0, 0, 0, 0, 0, 0]); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals(); return g;
}
function extrudeAlong(THREE, pts, U, w, h) {   // slim wall along a centre polyline, rounded top edge
  const pos = [], idx = [], prof = [[-w / 2, 0], [-w / 2, h - w / 2], [-w * 0.35, h - w * 0.15], [0, h], [w * 0.35, h - w * 0.15], [w / 2, h - w / 2], [w / 2, 0]];
  pts.forEach((p, i) => { const T = vnorm(vsub(pts[Math.min(i + 1, pts.length - 1)], pts[Math.max(i - 1, 0)])), R = vnorm(vcross(T, U));
    for (const [l, y] of prof) pos.push(...vadd(vadd(p, vmul(R, l)), vmul(U, y))); });
  const n = prof.length;
  for (let i = 0; i < pts.length - 1; i++) for (let j = 0; j < n - 1; j++) { const a = i * n + j, b = a + n; idx.push(a, b, b + 1, a, b + 1, a + 1); }
  for (const i of [0, pts.length - 1]) for (let j = 1; j < n - 1; j++) { const o = i * n; if (i) idx.push(o, o + j, o + j + 1); else idx.push(o, o + j + 1, o + j); }
  let g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g = g.toNonIndexed(); g.computeVertexNormals(); return g;
}
function place(THREE, mesh, p, T, U) {   // local +Y = U, local +Z = T
  const Y = new THREE.Vector3(...U).normalize(), Z = new THREE.Vector3(...T).normalize(), X = new THREE.Vector3().crossVectors(Y, Z).normalize(); Z.crossVectors(X, Y);
  mesh.matrix.makeBasis(X, Y, Z).setPosition(...p); mesh.matrixAutoUpdate = false; return mesh;
}
export function buildDeck(THREE, deck, barrierColour = [0.55, 0.36, 0.29]) {
  const group = new THREE.Group(); if (!deck) return group;
  const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, ...o });
  const barMat = std(new THREE.Color().setRGB(...barrierColour, THREE.SRGBColorSpace), { side: THREE.DoubleSide, flatShading: true });
  const hatch = std(0xffffff, { map: hatchTexture(THREE), polygonOffset: true, polygonOffsetFactor: 1 });
  for (const z of deck.zones ?? []) {
    const m = z.kind === 'gore' ? hatch : z.kind === 'plinth' ? std(DECK_COLOUR.deckSide) : std(DECK_COLOUR.apron);
    group.add(new THREE.Mesh(zoneGeometry(THREE, z, z.kind !== 'gore'), m));
  }
  for (const f of deck.furniture ?? []) {
    if (f.kind === 'wall') group.add(new THREE.Mesh(extrudeAlong(THREE, f.pts, f.U, f.w, f.h), barMat));
    else if (f.kind === 'cushion') { const m = new THREE.Mesh(new THREE.CylinderGeometry(f.r, f.r * 1.04, f.h, 28), std(DECK_COLOUR.cushion)); m.position.set(f.p[0], f.p[1] + f.h / 2, f.p[2]); group.add(m);
      const t = new THREE.Mesh(new THREE.CylinderGeometry(f.r * 1.01, f.r * 1.01, f.h * 0.22, 28), std(DECK_COLOUR.mark)); t.position.set(f.p[0], f.p[1] + f.h * 0.55, f.p[2]); group.add(t); }
    else if (f.kind === 'cap') {   // half cylinder in front of a barrier end
      const g = new THREE.CylinderGeometry(f.r, f.r, f.h, 20, 1, false, -Math.PI / 2, Math.PI); g.translate(0, f.h / 2, 0);
      group.add(place(THREE, new THREE.Mesh(g, barMat), f.p, f.T, f.U));
    } else if (f.kind === 'uturn') {
      const pos = [], idx = [], N = 32, a = vnorm(f.from), b = vnorm(f.T), U = f.U, ri = f.r - f.t / 2, ro = f.r + f.t / 2;
      for (let k = 0; k <= N; k++) { const th = Math.PI * k / N, d = vadd(vmul(a, Math.cos(th)), vmul(b, Math.sin(th)));
        for (const [r, y] of [[ri, f.base], [ri, f.hOut], [ro, f.hIn], [ro, f.base]]) pos.push(...vadd(vadd(f.c, vmul(d, r)), vmul(U, y))); }
      for (let k = 0; k < N; k++) for (let j = 0; j < 3; j++) { const p0 = k * 4 + j, p1 = p0 + 4; idx.push(p0, p1, p1 + 1, p0, p1 + 1, p0 + 1); }
      let g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g = g.toNonIndexed(); g.computeVertexNormals();
      group.add(new THREE.Mesh(g, barMat));
    } else if (f.kind === 'garage') {
      const [A, B, C, D] = f.base, U = f.U, up = (p, h) => vadd(p, vmul(U, h)), pos = [], idx = [];
      const box = [A, B, C, D, up(A, f.h), up(B, f.h), up(C, f.h), up(D, f.h)]; for (const p of box) pos.push(...p);
      idx.push(0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7, 4, 5, 6, 4, 6, 7);
      let g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g = g.toNonIndexed(); g.computeVertexNormals();
      group.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: DECK_COLOUR.garage, roughness: 0.9, side: THREE.DoubleSide, flatShading: true })));
      // door on the lane side (A-B), inset, 80 % wide, 4.2 m high
      const m = vmul(vadd(A, B), 0.5), ab = vsub(B, A), dw = vlen(ab) * 0.4, n = vnorm(vsub(A, D)), dh = 4.2, u = vnorm(ab);
      const q = [vadd(vsub(m, vmul(u, dw)), vmul(n, 0.02)), vadd(vadd(m, vmul(u, dw)), vmul(n, 0.02))];
      const dp = [...q[0], ...q[1], ...up(q[1], dh), ...up(q[0], dh)]; const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.Float32BufferAttribute(dp, 3)); dg.setIndex([0, 1, 2, 0, 2, 3]); dg.computeVertexNormals();
      group.add(new THREE.Mesh(dg, new THREE.MeshStandardMaterial({ color: DECK_COLOUR.door, roughness: 0.9, side: THREE.DoubleSide })));
    } else if (f.kind === 'boxmark') {
      const pos = [], idx = [], L = 0.25, lift = 0.03, U = [0, 1, 0], Q = f.quad;
      const seg = (p, q) => { const d = vnorm(vsub(q, p)), n = vmul(vnorm(vcross(U, d)), L / 2), b = pos.length / 3;
        for (const v of [vsub(p, n), vadd(p, n), vadd(q, n), vsub(q, n)]) pos.push(...vadd(v, vmul(U, lift))); idx.push(b, b + 2, b + 1, b, b + 3, b + 2); };
      seg(Q[0], Q[3]); seg(Q[1], Q[2]); seg(Q[3], Q[2]);
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      group.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: DECK_COLOUR.mark, roughness: 0.8, side: THREE.DoubleSide })));
    }
  }
  return group;
}

// A single-route stream has `samples`; a graph stream has `routes: {id: stream}`.
export function buildTrack(THREE, stream, material) {
  const routes = stream.routes ? Object.values(stream.routes) : [stream];
  const group = new THREE.Group(); const mat = material ?? new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 });
  for (const r of routes) {
    group.add(new THREE.Mesh(buildBody(THREE, r.samples), mat));
    group.add(new THREE.Mesh(buildMarkings(THREE, r.samples, r.markings), mat));
    const tg = buildTunnels(THREE, r);   // double-sided: seen from inside and outside
    if (tg) group.add(new THREE.Mesh(tg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, side: THREE.DoubleSide })));
  }
  if (stream.deck) { const q = routes[0].samples[0]; group.add(buildDeck(THREE, stream.deck, q?.paint?.barrier_side)); }
  return group;
}
