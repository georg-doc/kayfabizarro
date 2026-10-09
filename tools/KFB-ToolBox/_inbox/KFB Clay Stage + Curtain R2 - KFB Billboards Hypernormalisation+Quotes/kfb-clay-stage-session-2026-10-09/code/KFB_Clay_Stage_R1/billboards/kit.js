// KFB Clay Stage R1 · Billboard-Kit v2 (09.10.2026) · Kopie von KFB_Billboard_Family_v1/kit.js (04.10.2026), v1 bleibt unverändert.
// v2: roundPoly mit Radius je Ecke · strokeOutline (EIN Umriss für Schaft + Spitze, konstante Breite) · 02 neu gebaut ·
// 05 Rahmenradius + Sternkern · Leuchtenkappe ohne Schwarz · 07 Title Belt (Wrestling-Vorlage). Regeln R1–R9 im Bildschirm „Design-Logik".
// Lokal: Ursprung = Bodenmitte, +Z = Vorderseite, 1 Einheit = 1 m. Bildfläche je Familie exakt 12 × 6 m,
// rechteckig, eben (Vertrag CLAY-01). Die Silhouette entsteht nur aus dem Körper um die Fläche herum.
// Körperfarben sind ROLLEN (frame, trim, accent …), keine Farbwerte: die Werte kommen zur Laufzeit aus dem
// Kontext (world-context.js, siehe stage.js) und werden per recolor() in die Vertexfarben geschrieben.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export const FACE = { W: 12, H: 6 };
export const ROLES = ['frame', 'trim', 'accent', 'accent2', 'dark', 'post', 'back', 'ground'];
const UP = new THREE.Vector3(0, 1, 0), _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
export const rngOf = seed => { let h = 2166136261 >>> 0; for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }; };

// ── Handarbeit: weiches Vektorrauschen nach Position. Gleiche Position → gleiche Verschiebung, also bleiben Nähte dicht.
const h3 = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };
function vn(x, y, z) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z), fx = x - ix, fy = y - iy, fz = z - iz, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz);
  const L = (a, b, t) => a + (b - a) * t, c = (i, j, k) => h3(ix + i, iy + j, iz + k);
  return L(L(L(c(0, 0, 0), c(1, 0, 0), u), L(c(0, 1, 0), c(1, 1, 0), u), v), L(L(c(0, 0, 1), c(1, 0, 1), u), L(c(0, 1, 1), c(1, 1, 1), u), v), w);
}
function lump(g, amp, f = 0.85) {
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); p.setXYZ(i, x + amp * (vn(x * f, y * f, z * f) - 0.5), y + amp * (vn(x * f + 17.3, y * f, z * f) - 0.5), z + amp * (vn(x * f, y * f + 31.1, z * f) - 0.5) * 0.7); }
  p.needsUpdate = true;
}
function xform(geo, pos, rot, scl) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone(); geo.dispose();
  _m.compose(_p.set(...pos), rot.isQuaternion ? rot : _q.setFromEuler(_e.set(...rot)), _s.set(...scl)); g.applyMatrix4(_m);
  for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
  if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
  return g;
}

// ── Body: Teile sammeln, verschmelzen, Rollenbereiche merken (für recolor) ─────────────────────────────────
export class Body {
  constructor(rng) { this.L = []; this.rng = rng; }
  add(geo, role, pos = [0, 0, 0], rot = [0, 0, 0], scl = [1, 1, 1], amp = 0.035) {
    const g = xform(geo, pos, rot, scl); if (amp) lump(g, amp);
    g.userData.role = role; g.userData.tint = 1 + (this.rng() - 0.5) * 0.09; this.L.push(g); return g;
  }
  build(mat, pivot = [0, 0, 0]) {
    if (!this.L.length) return null;
    const ranges = []; let start = 0;
    for (const g of this.L) { g.translate(-pivot[0], -pivot[1], -pivot[2]); const n = g.attributes.position.count; ranges.push({ start, n, role: g.userData.role, tint: g.userData.tint }); start += n; }
    const geo = mergeGeometries(this.L, false); this.L.forEach(g => g.dispose()); this.L = [];
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(start * 3), 3));
    const mesh = new THREE.Mesh(geo, mat); mesh.castShadow = mesh.receiveShadow = true; mesh.userData.ranges = ranges; return mesh;
  }
}
const _c = new THREE.Color();
export function recolor(mesh, pal) {
  const a = mesh.geometry.attributes.color;
  for (const r of mesh.userData.ranges) { _c.set(pal[r.role] || '#ff00ff').multiplyScalar(r.tint); for (let i = r.start; i < r.start + r.n; i++) a.setXYZ(i, _c.r, _c.g, _c.b); }
  a.needsUpdate = true;
}

// ── Formen ─────────────────────────────────────────────────────────────────────────────────────────────
const rbox = (w, h, d, r = 0.12, seg = 3) => new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2, h / 2, d / 2) * 0.999);
export function roundPoly(pts, r) {
  const s = new THREE.Shape(), n = pts.length, P = pts.map(p => new THREE.Vector2(p[0], p[1]));
  for (let i = 0; i < n; i++) {
    const a = P[(i - 1 + n) % n], b = P[i], c = P[(i + 1) % n], ab = a.clone().sub(b), cb = c.clone().sub(b), ri = Array.isArray(r) ? r[i] : r;
    const p1 = b.clone().add(ab.clone().setLength(Math.min(ri, ab.length() / 2))), p2 = b.clone().add(cb.clone().setLength(Math.min(ri, cb.length() / 2)));
    if (i === 0) s.moveTo(p1.x, p1.y); else s.lineTo(p1.x, p1.y); s.quadraticCurveTo(b.x, b.y, p2.x, p2.y);
  }
  s.closePath(); return s;
}
const roundRect = (w, h, r) => roundPoly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], r);
function stadiumPts(w, h, n = 24, inset = 0) {
  const r = h / 2 - inset, cx = w / 2 - h / 2, out = [];
  for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + Math.PI * i / n; out.push([cx + Math.cos(a) * r, Math.sin(a) * r]); }
  for (let i = 0; i <= n; i++) { const a = Math.PI / 2 + Math.PI * i / n; out.push([-cx + Math.cos(a) * r, Math.sin(a) * r]); }
  return out;
}
const shapeOf = pts => { const s = new THREE.Shape(); pts.forEach(([x, y], i) => i ? s.lineTo(x, y) : s.moveTo(x, y)); s.closePath(); return s; };
function starShape(n, ro, ri, rot = 0) { const pts = []; for (let i = 0; i < n * 2; i++) { const a = rot + Math.PI / 2 + i * Math.PI / n, r = i % 2 ? ri : ro; pts.push([Math.cos(a) * r, Math.sin(a) * r]); } return roundPoly(pts, Math.min(ri, ro) * 0.12); }
// Band entlang einer Mittellinie (Bumerang, Pfeilschaft, Flosse) mit runder Anfangskappe
function band(center, width, n = 40) {
  const sp = new THREE.SplineCurve(center.map(p => new THREE.Vector2(...p))), P = sp.getSpacedPoints(n), L = [], R = [];
  P.forEach((p, i) => { const t = sp.getTangentAt(i / n), nn = new THREE.Vector2(-t.y, t.x), w = width / 2 * (1 - 0.18 * i / n); L.push(p.clone().addScaledVector(nn, w)); R.push(p.clone().addScaledVector(nn, -w)); });
  const t0 = sp.getTangentAt(0), cap = [];
  for (let k = 1; k < 8; k++) { const a = Math.PI * k / 8, nn = new THREE.Vector2(-t0.y, t0.x); cap.push(P[0].clone().addScaledVector(nn, -Math.cos(a) * width / 2).addScaledVector(t0, -Math.sin(a) * width / 2)); }
  const s = new THREE.Shape([...L, ...R.reverse(), ...cap]); return { shape: s, curve: sp, end: P[n], dir: sp.getTangentAt(1) };
}
// v2 · Strich entlang einer Mittellinie, KONSTANTE Breite, runde Anfangskappe; Ende = Pfeilspitze (head) oder runde Kappe.
// Schaft und Spitze sind EIN Umriss (R1), Radien je Ecke (R2): Schaft fein, Spitzenecken 0,3–0,55.
export function strokeOutline(center, w, o = {}) {
  const n = o.n || 140, sp = new THREE.SplineCurve(center.map(p => new THREE.Vector2(...p))), P = sp.getSpacedPoints(n), L = [], R = [];
  P.forEach((p, i) => { const t = sp.getTangentAt(i / n), nn = new THREE.Vector2(-t.y, t.x); L.push(p.clone().addScaledVector(nn, w / 2)); R.push(p.clone().addScaledVector(nn, -w / 2)); });
  const e = P[n], d = sp.getTangentAt(1), nn = new THREE.Vector2(-d.y, d.x), t0 = sp.getTangentAt(0), n0 = new THREE.Vector2(-t0.y, t0.x);
  const cap = (c, t, nv, s) => { const out = []; for (let k = 1; k < 10; k++) { const a = Math.PI * k / 10; out.push(c.clone().addScaledVector(nv, -Math.cos(a) * w / 2 * s).addScaledVector(t, -Math.sin(a) * w / 2)); } return out; };
  let mid, rMid;
  const [rN, rB, rT] = o.r || [0.5, 0.55, 0.6];
  if (o.head) { const [hl, hh] = o.head; mid = [e.clone().addScaledVector(nn, hh), e.clone().addScaledVector(d, hl), e.clone().addScaledVector(nn, -hh)]; rMid = [rB, rT, rB]; }
  else { mid = cap(e, d.clone().negate(), nn, -1); rMid = mid.map(() => 0.06); }
  const Rr = R.slice().reverse(), pts = [...L, ...mid, ...Rr, ...cap(P[0], t0, n0, 1)].map(v => [v.x, v.y]);
  const rr = pts.map(() => 0.06); rMid.forEach((x, k) => { rr[n + 1 + k] = x; }); if (o.head) { rr[n] = rN; rr[n + 1 + mid.length] = rN; }
  return { shape: roundPoly(pts, rr), curve: sp, end: e, dir: d, nrm: nn };
}
// Konstante Kontur (R4): gerundeten Umriss abtasten und entlang der Eckennormalen um o versetzen (o < 0 = nach innen).
// Konkave Radien im Umriss müssen > |o| sein, sonst entsteht eine Schleife; strokeOutline hält Kerben bei 0,5.
export function offsetShape(shape, o, div = 8) {
  const P = shape.getPoints(div).filter((p, i, A) => i === 0 || p.distanceTo(A[i - 1]) > 1e-4); if (P.length > 2 && P[0].distanceTo(P[P.length - 1]) < 1e-4) P.pop();
  const s = THREE.ShapeUtils.area(P) > 0 ? 1 : -1, n = P.length, out = [];
  for (let i = 0; i < n; i++) {
    const a = P[(i - 1 + n) % n], b = P[i], c = P[(i + 1) % n], t1 = b.clone().sub(a).normalize(), t2 = c.clone().sub(b).normalize();
    const n1 = new THREE.Vector2(t1.y, -t1.x).multiplyScalar(s), n2 = new THREE.Vector2(t2.y, -t2.x).multiplyScalar(s), m = n1.clone().add(n2).normalize(), f = Math.min(2.5, 1 / Math.max(0.2, m.dot(n1)));
    out.push(b.clone().addScaledVector(m, o * f));
  }
  return new THREE.Shape(out);
}
export function slab(shape, depth, bevel, front, seg = 36) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelOffset: 0, bevelSegments: 4, curveSegments: seg });
  g.translate(0, 0, front - depth - bevel); return g;
}

// ── Module ─────────────────────────────────────────────────────────────────────────────────────────────
export const M = {
  // Rundpfosten, leicht krumm (drei Segmente mit Gelenkwulst)
  pole(B, A, Z, r0 = 0.3, r1 = 0.24, crook = 0.07, role = 'post') {
    const a = new THREE.Vector3(...A), b = new THREE.Vector3(...Z), pts = [a];
    for (const t of [1 / 3, 2 / 3]) pts.push(a.clone().lerp(b, t).add(new THREE.Vector3((B.rng() - 0.5) * crook * 2, 0, (B.rng() - 0.5) * crook)));
    pts.push(b);
    for (let i = 0; i < 3; i++) { const p = pts[i], q = pts[i + 1], d = q.clone().sub(p), L = d.length(), ra = r0 + (r1 - r0) * i / 3, rb = r0 + (r1 - r0) * (i + 1) / 3; B.add(new THREE.CylinderGeometry(rb, ra, L, 14, 2), role, p.clone().add(q).multiplyScalar(0.5).toArray(), new THREE.Quaternion().setFromUnitVectors(UP, d.normalize()), [1, 1, 1], 0.03); }
    for (const i of [1, 2]) B.add(new THREE.SphereGeometry(r0 * 1.12, 12, 8), role, pts[i].toArray(), [0, 0, 0], [1, 0.7, 1], 0.02);
    if (A[1] <= 0.01) M.foot(B, A[0], A[2], r0 * 3.2);
  },
  foot(B, x, z, s = 1) { B.add(new THREE.SphereGeometry(1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), 'ground', [x, -0.04, z], [0, 0, 0], [s, s * 0.42, s], 0.06); },
  brace(B, A, Z, r = 0.11, role = 'post') { const a = new THREE.Vector3(...A), b = new THREE.Vector3(...Z), d = b.clone().sub(a); B.add(new THREE.CylinderGeometry(r, r, d.length(), 10, 1), role, a.clone().add(b).multiplyScalar(0.5).toArray(), new THREE.Quaternion().setFromUnitVectors(UP, d.normalize()), [1, 1, 1], 0.02); },
  ySupport(B, x, z, yFork, arms, r = 0.3) { M.pole(B, [x, 0, z], [x, yFork, z], r * 1.15, r, 0.05); B.add(new THREE.SphereGeometry(r * 1.4, 14, 10), 'post', [x, yFork, z], [0, 0, 0], [1, 0.8, 1], 0.03); for (const t of arms) M.pole(B, [x, yFork, z], t, r, r * 0.8, 0.04); },
  // Bildschirm-Rahmen: Fase, Öffnung exakt 12 × 6, Rückplatte. Vorderkante z 0,5; Bildfläche liegt bei z 0,035.
  screen(B, cx, fy, o = {}) {
    const { W, H } = FACE, pad = o.pad ?? 0.6, r = o.r ?? 0.6, bv = 0.1, ow = W + 2 * pad, oh = H + 2 * pad, sh = roundRect(ow, oh, r), hw = W / 2 + bv, hh = H / 2 + bv;
    const hole = new THREE.Path(); hole.moveTo(-hw, -hh); hole.lineTo(-hw, hh); hole.lineTo(hw, hh); hole.lineTo(hw, -hh); hole.closePath(); sh.holes.push(hole);
    B.add(slab(sh, 0.28, bv, 0.5, 10), o.role || 'frame', [cx, fy, 0], [0, 0, 0], [1, 1, 1], 0.022);
    B.add(rbox(ow - 0.3, oh - 0.3, 0.44, 0.16), 'back', [cx, fy, -0.22], [0, 0, 0], [1, 1, 1], 0.012);
  },
  // Rückseite: zwei Riegel zwischen den Stützen, Bolzenköpfe, Wartungsklappe
  rear(B, cx, fy, xs, z = -0.62) {
    for (const y of [fy - 1.7, fy + 1.7]) { B.add(rbox(xs[1] - xs[0] + 0.9, 0.36, 0.36, 0.12), 'post', [(xs[0] + xs[1]) / 2, y, z], [0, 0, (B.rng() - 0.5) * 0.02], [1, 1, 1], 0.03); for (const x of xs) B.add(new THREE.SphereGeometry(0.16, 10, 8), 'dark', [x, y, z - 0.2]); }
    B.add(rbox(2.4, 1.6, 0.16, 0.08), 'trim', [cx + 2.6, fy, -0.5], [0, 0, 0.03], [1, 1, 1], 0.02);
    B.add(new THREE.CylinderGeometry(0.1, 0.1, 0.18, 10), 'dark', [cx + 3.6, fy, -0.62], [Math.PI / 2, 0, 0]);
  },
  crown(B, cx, y0, w = 5.2) {
    B.add(rbox(w, 0.72, 0.82, 0.3), 'accent', [cx, y0, 0.15], [0, 0, 0], [1, 1, 1], 0.05);
    const tips = [], hs = [1.5, 2.0, 2.7, 2.0, 1.5];
    hs.forEach((h, i) => { const x = cx + (i - 2) * w / 5.4, lean = (i - 2) * 0.09; B.add(new THREE.ConeGeometry(0.36, h, 12, 2), 'accent', [x + Math.sin(lean) * h / 2, y0 + 0.36 + h / 2, 0.15], [0, 0, -lean], [1, 1, 0.8], 0.05); tips.push([x + Math.sin(lean) * h, y0 + 0.36 + h + 0.18, 0.15]); });
    for (const x of [-1, 0, 1]) B.add(new THREE.SphereGeometry(0.2, 12, 8), 'trim', [cx + x * w / 3.2, y0, 0.58]);
    return tips;
  },
  star(B, cx, cy, ro, ri, n = 5, role = 'accent', z = 0.3) { B.add(slab(starShape(n, ro, ri), 0.3, 0.12, z, 4), role, [cx, cy, 0], [0, 0, 0], [1, 1, 1], 0.03); },
  beacon(B, x, y0, h, z = 0.1) { M.brace(B, [x, y0, z], [x, y0 + h, z], 0.07, 'post'); B.add(new THREE.SphereGeometry(0.42, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), 'trim', [x, y0 + h + 0.1, z], [0, 0, 0], [1, 0.7, 1], 0.02); return [x, y0 + h + 0.45, z]; },
  // Clay-Fernseher mit Druckknopf: der Bildschirm zeigt dieselbe Textur wie die Tafel
  tv(B, x, y, z) {
    B.add(rbox(2.3, 1.5, 1.05, 0.34), 'trim', [x, y, z], [0, 0, 0], [1, 1, 1], 0.03);
    B.add(rbox(1.38, 0.86, 0.16, 0.12), 'dark', [x - 0.33, y + 0.02, z + 0.5]);
    for (const dx of [-0.75, 0.6]) B.add(new THREE.CylinderGeometry(0.07, 0.09, 0.5, 8), 'dark', [x + dx, y - 0.95, z - 0.1], [0, 0, dx * 0.4]);
    B.add(new THREE.CylinderGeometry(0.11, 0.11, 0.16, 12), 'dark', [x + 0.72, y - 0.42, z + 0.52], [Math.PI / 2, 0, 0]);
    return { screen: [x - 0.33, y + 0.02, z + 0.59], screenW: 1.12, button: [x + 0.72, y + 0.2, z + 0.53] };
  }
};
const perim = (cx, cy, w, h, step, z) => { const o = [], nx = Math.max(2, Math.round(w / step)), ny = Math.max(1, Math.round(h / step)); for (let i = 0; i < nx; i++) o.push([cx - w / 2 + i / nx * w, cy + h / 2, z]); for (let i = 0; i < ny; i++) o.push([cx + w / 2, cy + h / 2 - i / ny * h, z]); for (let i = 0; i < nx; i++) o.push([cx + w / 2 - i / nx * w, cy - h / 2, z]); for (let i = 0; i < ny; i++) o.push([cx - w / 2, cy - h / 2 + i / ny * h, z]); return o; };
const row = (x0, x1, y, step, z) => { const o = [], n = Math.max(1, Math.round((x1 - x0) / step)); for (let i = 0; i <= n; i++) o.push([x0 + (x1 - x0) * i / n, y, z]); return o; };
const col = (x, y0, y1, step, z) => { const o = [], n = Math.max(1, Math.round((y1 - y0) / step)); for (let i = 0; i <= n; i++) o.push([x, y0 + (y1 - y0) * i / n, z]); return o; };
const along = (curve, n, z, offY = 0) => curve.getSpacedPoints(n).map(p => [p.x, p.y + offY, z]);

// ── Familien: gestaltete Kombinationen. Jede liefert body/subs/bulbs/glows/face/tv. ──────────────────────
// sub = beweglicher Teil (eigene Mesh, Pivot, Bewegung aus dem Host-Takt), anim ∈ breathe|nod|settle|orbit|spin|pulse|swing|press
function sub(rng, name, pivot, anim, extra = {}) { return { name, B: new Body(rng), pivot, anim, ...extra }; }

function crownMarquee(rng) {
  const B = new Body(rng), fy = 7.6, S = [], bulbs = [], glows = [];
  M.screen(B, 0, fy, { pad: 0.65, r: 0.8 });
  M.pole(B, [-3.4, 0, -0.75], [-3.4, fy + 1.6, -0.75], 0.36, 0.3); M.pole(B, [3.5, 0, -0.75], [3.5, fy + 1.6, -0.75], 0.36, 0.3);
  M.rear(B, 0, fy, [-3.4, 3.5]); M.brace(B, [-3.4, 1.4, -0.75], [3.5, fy - 3.4, -0.75], 0.09); M.brace(B, [3.5, 1.4, -0.75], [-3.4, fy - 3.4, -0.75], 0.09);
  const hy = fy + 3.75, hdr = [[-8.6, 0], [8.6, 0], [6.9, 2.8], [-6.9, 2.8]];
  B.add(slab(roundPoly(hdr, 0.6), 0.42, 0.14, 0.56), 'trim', [0, hy, 0]);
  B.add(slab(roundPoly(hdr.map(([x, y]) => [x * 0.84, 0.35 + y * 0.72]), 0.4), 0.08, 0.06, 0.66), 'accent2', [0, hy, 0]);
  const cr = sub(rng, 'crown', [0, hy + 2.8, 0.15], 'breathe'); glows.push(...M.crown(cr.B, 0, hy + 3.15, 5.4).map(p => ({ p, r: 0.28, sub: 'crown' }))); S.push(cr);
  bulbs.push({ pts: row(-7.9, 7.9, hy + 0.34, 0.46, 0.72), r: 0.13, mode: 'loop' });
  bulbs.push({ pts: perim(0, fy, FACE.W + 0.78, FACE.H + 0.78, 0.5, 0.56), r: 0.11, mode: 'loop' });
  const pl = sub(rng, 'plate', [0, fy - 3.65, 0], 'swing');
  for (const x of [-1.5, 1.5]) M.brace(pl.B, [x, fy - 3.65, 0.05], [x, fy - 4.55, 0.05], 0.05, 'dark');
  pl.B.add(rbox(4.4, 1.3, 0.42, 0.22), 'accent', [0, fy - 5.2, 0.05]); S.push(pl);
  bulbs.push({ pts: perim(0, fy - 5.2, 3.9, 0.85, 0.36, 0.3), r: 0.085, mode: 'loop', sub: 'plate' });
  return { id: 'crown', n: '01', label: 'Crown Marquee', B, S, bulbs, glows, face: { cx: 0, cy: fy }, tv: [3.5, 1.35, 0.25], h: 15.5, w: 17.5,
    why: 'Breites Theaterdach über der Tafel, Krone obendrauf, zwei Glühbirnenreihen. Kleines Schild darunter pendelt leicht.' };
}

// v2 (09.10.2026): v1 bestand aus vier losen Teilen in drei Formsprachen (Band, scharfes Dreieck, Flügel, Leuchten mit
// schwarzer Kappe), Schaft lag in der Rahmenebene, Schrägpfosten kippte. Jetzt: EIN Pfeilumriss mit Spitze und Trim-Kontur
// ganz HINTER der Tafel (R5), zwei Streben mit Manschetten (R6), zwei senkrechte Pfosten (R7), Lauflicht auf der Mittellinie (R3).
function boomerangArrow(rng) {
  const B = new Body(rng), fy = 7.2, S = [], bulbs = [], glows = [];
  M.screen(B, 0, fy, { pad: 0.6, r: 0.7 });
  M.pole(B, [-3.2, 0, -0.75], [-3.2, fy + 1.4, -0.75], 0.36, 0.3, 0.06); M.pole(B, [3.2, 0, -0.75], [3.2, fy + 1.4, -0.75], 0.36, 0.3, 0.06);
  M.rear(B, 0, fy, [-3.2, 3.2]);
  bulbs.push({ pts: perim(0, fy, FACE.W + 0.62, FACE.H + 0.62, 0.5, 0.56), r: 0.11, mode: 'loop' });
  const C = [[-4.6, fy + 2.9], [-1.4, fy + 5.5], [4.2, fy + 6.1], [9.6, fy + 4.0], [11.7, fy - 0.2], [10.9, fy - 3.4]];
  const ar = sub(rng, 'arrow', [6.8, fy + 1.0, -0.8], 'nod', { amp: 0.01 });
  // Körper (accent) · Kontur (trim, exakt 0,32 m versetzt) · Lichtkanal (accent2) auf der Mittellinie · Einlage in der Spitze (blinkt)
  const HL = 2.6, HH = 2.1, body = strokeOutline(C, 1.9, { head: [HL, HH] }), rimShape = offsetShape(body.shape, 0.32), chan = strokeOutline(C, 0.66);
  ar.B.add(slab(body.shape, 0.4, 0.14, -0.55, 6), 'accent', [0, 0, 0], [0, 0, 0], [1, 1, 1], 0.01);
  ar.B.add(slab(rimShape, 0.26, 0.1, -0.9, 2), 'trim', [0, 0, 0], [0, 0, 0], [1, 1, 1], 0.008);
  ar.B.add(slab(chan.shape, 0.04, 0.05, -0.47, 6), 'accent2', [0, 0, 0], [0, 0, 0], [1, 1, 1], 0.004);
  // Streben: kommen hinter der Tafel hervor und tauchen seitlich in den Pfeilkörper; keine sichtbaren Enden
  const sp = body.curve.getSpacedPoints(240);
  for (const y of [fy + 1.6, fy - 1.4]) {
    const p = sp.filter(q => q.x > 8).reduce((a, q) => Math.abs(q.y - y) < Math.abs(a.y - y) ? q : a), xi = p.x - 0.3;
    M.brace(ar.B, [5.9, y, -0.72], [xi, y, -0.9], 0.17, 'post');
  }
  S.push(ar);
  bulbs.push({ pts: along(body.curve, 26, -0.36).slice(1, -1), r: 0.14, mode: 'dir', sub: 'arrow' });
  // Einlage = Spitzendreieck um 0,45 m nach innen (Inkreis-Skalierung): gleichmäßiger Rand rundum
  const e = body.end, d = body.dir, nn = body.nrm, P2 = (a, b) => [e.x + d.x * a + nn.x * b, e.y + d.y * a + nn.y * b];
  const legs = Math.hypot(HH, HL), rin = (HH * HL) / (HH + legs), kk = (rin - 0.45) / rin, base = rin * (1 - kk), tip = rin + kk * (HL - rin);
  const blink = { shape: roundPoly([P2(tip, 0), P2(base, HH * kk), P2(base, -HH * kk)], [0.32, 0.3, 0.3]), depth: 0.05, bevel: 0.05, front: -0.43, sub: 'arrow' };
  return { id: 'arrow', n: '02', label: 'Boomerang Arrow', B, S, bulbs, glows, blink, face: { cx: 0, cy: fy }, tv: [-3.2, 1.35, 0.25], h: 15, w: 20,
    why: 'v2: ein durchgehender Bumerang-Pfeil steigt hinter der Tafel auf und zeigt rechts hinunter zur Einfahrt. Schaft und Spitze sind ein Körper mit Trim-Kontur, zwei Streben halten ihn. Lauflicht zur Spitze, die Einlage blinkt.' };
}

function ovalOrbit(rng) {
  const B = new Body(rng), fy = 8.3, S = [], bulbs = [], glows = [];
  const hd = sub(rng, 'head', [0, fy, 0], 'settle');
  const st = stadiumPts(18.6, 9.6, 26);
  hd.B.add(slab(roundPoly(st, 0.2), 0.5, 0.16, -0.06, 4), 'frame', [0, fy, 0], [0, 0, 0], [1, 1, 1], 0.04);
  const ring = roundPoly(stadiumPts(19.4, 10.4, 26), 0.2); ring.holes.push(new THREE.Path(stadiumPts(18.3, 9.3, 26).map(p => new THREE.Vector2(...p)).reverse()));
  hd.B.add(slab(ring, 0.16, 0.08, 0.16, 4), 'accent', [0, fy, 0], [0, 0, 0], [1, 1, 1], 0.03);
  M.screen(hd.B, 0, fy, { pad: 0.42, r: 0.42, role: 'dark' });
  [[-5.4, 1.1], [-2.0, 2.1], [2.6, 1.5]].forEach(([x, h], i) => { M.brace(hd.B, [x, fy + 4.55, 0], [x, fy + 4.6 + h, 0], 0.06); hd.B.add(new THREE.SphereGeometry(0.42, 14, 10), i === 1 ? 'trim' : 'accent2', [x, fy + 4.75 + h, 0]); });
  M.star(hd.B, 8.6, fy + 3.4, 1.15, 0.38, 4, 'trim', 0.3);
  S.push(hd);
  bulbs.push({ pts: stadiumPts(18.6, 9.6, 14, 0.55).map(([x, y]) => [x, y + fy, 0.14]), r: 0.12, mode: 'loop', sub: 'head' });
  M.pole(B, [-1.6, 0, -0.75], [-1.6, fy - 2.4, -0.75], 0.2, 0.17, 0.05);
  M.ySupport(B, 4.4, -0.75, 2.9, [[2.8, fy - 3.6, -0.75], [6.2, fy - 3.4, -0.75]], 0.2);
  M.brace(B, [-1.6, 2.1, -0.75], [4.4, 2.9, -0.75], 0.08);
  const ob = sub(rng, 'orbit', [0, fy + 3.4, 0], 'orbit'); ob.B.add(new THREE.TorusGeometry(11.4, 0.13, 8, 96), 'trim', [0, fy + 3.4, 0], [1.22, 0.18, 0.12], [1, 0.62, 1], 0.02); S.push(ob);
  glows.push({ p: [11.4, fy + 3.4, 0], r: 0.55, sub: 'orbit', rider: { R: 11.4, sy: 0.62, rot: [1.22, 0.18, 0.12] } });
  return { id: 'oval', n: '03', label: 'Oval Orbit', B, S, bulbs, glows, face: { cx: 0, cy: fy, sub: 'head' }, tv: [-1.6, 1.35, 0.15], h: 16, w: 24,
    why: 'Flache Kapsel mit Kontrastring, dünne versetzte Stützen, eine Umlaufbahn mit wanderndem Licht. Der Kopf dreht beim Phasenwechsel ein paar Grad und pendelt aus.' };
}

function letterTower(rng, font) {
  const B = new Body(rng), fy = 6.9, cx = 1.4, S = [], bulbs = [], glows = [];
  B.add(rbox(2.5, 19.5, 1.5, 0.45), 'frame', [-7.4, 9.75, -0.25], [0, 0, 0.012], [1, 1, 1], 0.05);
  B.add(rbox(1.5, 17.6, 0.14, 0.07), 'accent2', [-7.32, 9.8, 0.56], [0, 0, 0.012]);
  M.foot(B, -7.4, -0.25, 2.4);
  M.screen(B, cx, fy, { pad: 0.6, r: 0.5 });
  M.pole(B, [6.6, 0, -0.75], [6.6, fy + 1.0, -0.75], 0.32, 0.27, 0.08);
  M.rear(B, cx, fy, [-6.6, 6.6]);
  bulbs.push({ pts: col(-8.25, 1.6, 18.4, 0.5, 0.58), r: 0.12, mode: 'dir' }, { pts: col(-6.45, 1.6, 18.4, 0.5, 0.58), r: 0.12, mode: 'dir' });
  const letters = 'KFB'.split(''), slabsX = [-3.0, 1.4, 5.6], hs = [1.4, 2.7, 0.8];
  letters.forEach((ch, i) => {
    const x = slabsX[i], y = fy + 3.7 + hs[i], tilt = (rng() - 0.5) * 0.08;
    M.brace(B, [x, fy + 3.6, -0.1], [x, y, -0.1], 0.08);
    B.add(rbox(2.7, 3.1, 0.72, 0.38), i === 1 ? 'accent2' : 'accent', [x, y + 1.55, -0.1], [0, 0, tilt], [1, 1, 1], 0.05);
    if (font) { const g = new TextGeometry(ch, { font, size: 2.05, depth: 0.28, curveSegments: 6, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.06, bevelSegments: 3 }); g.computeBoundingBox(); const bb = g.boundingBox; g.translate(-(bb.max.x + bb.min.x) / 2, -(bb.max.y + bb.min.y) / 2, 0); B.add(g, 'trim', [x, y + 1.55, 0.22], [0, 0, tilt], [1, 1, 1], 0.03); }
  });
  const sp = sub(rng, 'star', [-7.4, 20.6, 0], 'spin'); M.star(sp.B, -7.4, 20.6, 1.7, 0.72, 5, 'accent', 0.2); M.brace(sp.B, [-7.4, 19.4, 0], [-7.4, 20.0, 0], 0.1, 'dark'); S.push(sp);
  glows.push({ p: [-7.4, 20.6, 0.42], r: 0.36, sub: 'star' });
  bulbs.push({ pts: row(cx - 6.2, cx + 6.2, fy + 3.52, 0.5, 0.56), r: 0.1, mode: 'loop' }, { pts: row(cx - 6.2, cx + 6.2, fy - 3.52, 0.5, 0.56), r: 0.1, mode: 'loop' });
  return { id: 'tower', n: '04', label: 'Letter Tower', B, S, bulbs, glows, face: { cx, cy: fy }, tv: [6.6, 1.35, 0.25], h: 22, w: 17, needsFont: true, lettersOk: !!font,
    why: 'Hoher Pylon links mit Lauflicht nach oben und drehendem Stern, drei Buchstabenblöcke K · F · B auf Stielen in drei Höhen.' };
}

function starburstFin(rng) {
  const B = new Body(rng), fy = 7.2, S = [], bulbs = [], glows = [];
  M.screen(B, 0, fy, { pad: 0.5, r: 0.5 });
  M.ySupport(B, 0, -0.75, 2.7, [[-3.9, fy - 3.4, -0.75], [3.9, fy - 3.4, -0.75]], 0.32);
  M.rear(B, 0, fy, [-3.9, 3.9]);
  // v2: Flosse als gerundetes Polygon ganz HINTER der Tafel (R5), Ecken 0,5 (R2), Trim-Kontur 0,3 (R4)
  const V = (x, y) => new THREE.Vector2(x, y), qa = new THREE.QuadraticBezierCurve(V(8.9, fy - 3.7), V(11.4, fy + 2.4), V(13.7, fy + 8.4)).getPoints(14), qb = new THREE.QuadraticBezierCurve(V(13.7, fy + 8.4), V(9.4, fy + 5.6), V(5.4, fy + 3.2)).getPoints(14);
  const finPts = [[4.6, fy - 3.7], ...qa.map(p => [p.x, p.y]), ...qb.slice(1).map(p => [p.x, p.y])], frr = finPts.map(() => 0.05); frr[0] = 0.5; frr[1] = 0.5; frr[15] = 0.6; frr[finPts.length - 1] = 0.5;
  const fin = roundPoly(finPts, frr);
  B.add(slab(fin, 0.42, 0.15, -0.5, 4), 'accent', [0, 0, 0], [0, 0, 0], [1, 1, 1], 0.012);
  B.add(slab(offsetShape(fin, 0.3), 0.2, 0.08, -0.85, 2), 'trim', [0, 0, 0], [0, 0, 0], [1, 1, 1], 0.008);
  const edge = new THREE.QuadraticBezierCurve(new THREE.Vector2(8.9, fy - 3.4), new THREE.Vector2(11.0, fy + 2.4), new THREE.Vector2(13.2, fy + 7.8));
  bulbs.push({ pts: edge.getSpacedPoints(16).map(p => [p.x - 0.35, p.y, -0.36]), r: 0.12, mode: 'dir' });
  const s1 = sub(rng, 'burst', [13.7, fy + 8.6, -0.3], 'pulse'); M.star(s1.B, 13.7, fy + 8.6, 2.7, 1.15, 12, 'trim', -0.2); s1.B.add(new THREE.SphereGeometry(0.8, 16, 10), 'accent2', [13.7, fy + 8.6, -0.2], [0, 0, 0], [1, 1, 0.5]); S.push(s1);
  glows.push({ p: [13.7, fy + 8.6, 0.08], r: 0.62, sub: 'burst' });
  const s2 = sub(rng, 'burst2', [-7.4, fy + 4.1, 0.3], 'pulse', { phase: 1.7 }); M.star(s2.B, -7.4, fy + 4.1, 1.6, 0.66, 8, 'accent2', 0.42); S.push(s2);
  glows.push({ p: [-7.4, fy + 4.1, 0.62], r: 0.34, sub: 'burst2' });
  M.brace(B, [-6.5, fy + 3.3, -0.1], [-7.4, fy + 4.1, -0.1], 0.09);
  bulbs.push({ pts: row(-6.0, 6.0, fy + 3.45, 0.5, 0.56), r: 0.1, mode: 'loop' });
  return { id: 'burst', n: '05', label: 'Starburst Fin', B, S, bulbs, glows, face: { cx: 0, cy: fy }, tv: [1.1, 1.35, 0.15], h: 18.5, w: 23,
    why: 'Atomzeit-Flosse steigt hinten rechts auf, an der Spitze ein zwölfzackiger Stern, der pulsiert. Y-Stütze. v2: Rahmenradius wie die übrigen Teile, Sternkern in accent2 statt Schwarz.' };
}

function motelTotem(rng) {
  const B = new Body(rng), fy = 10.8, S = [], bulbs = [], glows = [];
  B.add(rbox(1.9, 23.6, 1.4, 0.4), 'back', [0, 11.8, -0.95], [0, 0, -0.01], [1, 1, 1], 0.05); M.foot(B, 0, -0.95, 2.6);
  M.screen(B, 0, fy, { pad: 0.6, r: 0.65 });
  M.rear(B, 0, fy, [-1.6, 1.6], -0.5);
  const roof = [[-7.6, 0], [7.6, 0], [6.0, 1.7], [-6.0, 1.7]];
  B.add(slab(roundPoly(roof, 0.5), 0.36, 0.13, 0.52), 'trim', [0, fy + 3.7, 0]);
  bulbs.push({ pts: row(-6.8, 6.8, fy + 4.05, 0.46, 0.66), r: 0.12, mode: 'loop' }, { pts: perim(0, fy, FACE.W + 0.76, FACE.H + 0.76, 0.52, 0.56), r: 0.1, mode: 'loop' });
  M.brace(B, [0, fy + 5.4, -0.3], [0, fy + 8.4, -0.3], 0.13, 'dark');
  const at = sub(rng, 'atom', [0, fy + 9.6, -0.2], 'spin');
  at.B.add(new THREE.SphereGeometry(1.25, 22, 14), 'accent', [0, fy + 9.6, -0.2], [0, 0, 0], [1, 1, 1], 0.05);
  for (const r of [[1.1, 0, 0], [1.1, 1.05, 0], [1.1, -1.05, 0]]) at.B.add(new THREE.TorusGeometry(2.2, 0.1, 8, 64), 'trim', [0, fy + 9.6, -0.2], r, [1, 1, 1], 0.015);
  S.push(at); glows.push({ p: [0, fy + 11.1, -0.2], r: 0.32, sub: 'atom' });
  const pl = sub(rng, 'plate', [0, fy - 3.6, 0.1], 'swing');
  for (const x of [-2.4, 2.4]) M.brace(pl.B, [x, fy - 3.6, 0.1], [x, fy - 5.2, 0.1], 0.05, 'dark');
  pl.B.add(slab(roundPoly([[-3.9, 0.95], [2.8, 0.95], [4.3, 0], [2.8, -0.95], [-3.9, -0.95]], 0.3), 0.36, 0.12, 0.3), 'accent2', [0, fy - 6.2, 0]);
  S.push(pl); bulbs.push({ pts: row(-3.3, 3.1, fy - 6.2, 0.42, 0.42), r: 0.1, mode: 'dir', sub: 'plate' });
  return { id: 'totem', n: '06', label: 'Motel Totem', B, S, bulbs, glows, face: { cx: 0, cy: fy }, tv: [1.6, 1.35, 0.1], h: 23, w: 16,
    why: 'Drei Massen übereinander: Atom-Ornament, Tafel mit Dach, kleines Pfeilschild an Ketten. Eine zentrale Säule, eine Bildfläche.' };
}

// 07 · Wrestling-Vorlage: Gürtel-Mittelplatte um die Tafel, zwei Seitenplatten, Riemen hängt über und fällt an beiden Enden,
// Nieten statt Ornament, Sternkranz dahinter. Gebaut nach R1–R9 (ein Umriss je Teil, Kontur, Licht auf dem Rand, Ebenen).
function titleBelt(rng) {
  const B = new Body(rng), fy = 8.0, S = [], bulbs = [], glows = [];
  const strapC = [[-17.2, fy + 0.15], [0, fy + 0.5], [17.2, fy + 0.15]];
  const strap = strokeOutline(strapC, 3.4, { n: 72 });
  B.add(slab(strap.shape, 0.3, 0.12, -0.7, 8), 'back', [0, 0, 0], [0, 0, 0], [1, 1, 1], 0.04);
  strap.curve.getSpacedPoints(46).forEach((p, i, A) => { if (Math.abs(p.x) < 9.6 || i === 0 || i === A.length - 1) return; const t = strap.curve.getTangentAt(i / (A.length - 1)), nx = -t.y, ny = t.x; for (const s of [-0.85, 0.85]) B.add(new THREE.SphereGeometry(0.17, 10, 8), 'trim', [p.x + nx * s, p.y + ny * s, -0.62], [0, 0, 0], [1, 1, 0.6], 0.01); });
  const plate = [[-8.6, -4.6], [8.6, -4.6], [9.8, -1.6], [9.8, 1.8], [8.2, 4.6], [3.6, 5.6], [0, 7.0], [-3.6, 5.6], [-8.2, 4.6], [-9.8, 1.8], [-9.8, -1.6]];
  const scl = (P, sx, sy) => P.map(([x, y]) => [x * sx, 1.2 + (y - 1.2) * sy]);
  B.add(slab(roundPoly(plate, 0.7), 0.36, 0.14, -0.02, 10), 'accent', [0, fy, 0], [0, 0, 0], [1, 1, 1], 0.04);
  B.add(slab(offsetShape(roundPoly(plate, 0.7), 0.34), 0.2, 0.08, -0.4, 2), 'trim', [0, fy, 0], [0, 0, 0], [1, 1, 1], 0.03);
  M.screen(B, 0, fy, { pad: 0.6, r: 0.6 });
  const rimPts = roundPoly(scl(plate, 0.935, 0.9), 0.6).getSpacedPoints(64).map(p => [p.x, p.y + fy, 0.1]);
  bulbs.push({ pts: rimPts.filter(p => !(Math.abs(p[0]) < 6.9 && Math.abs(p[1] - fy) < 3.9)), r: 0.13, mode: 'loop' });
  for (const s of [-1, 1]) {
    const cx = s * 12.6, cy = fy + 0.4;
    B.add(slab(roundPoly([[-2.2, -2.5], [2.2, -2.5], [2.2, 2.5], [-2.2, 2.5]], 1.1), 0.3, 0.12, 0.0, 8), 'accent', [cx, cy, 0], [0, 0, 0], [1, 1, 1], 0.04);
    B.add(slab(offsetShape(roundPoly([[-2.2, -2.5], [2.2, -2.5], [2.2, 2.5], [-2.2, 2.5]], 1.1), 0.3), 0.16, 0.06, -0.3, 2), 'trim', [cx, cy, 0], [0, 0, 0], [1, 1, 1], 0.03);
    M.star(B, cx, cy, 1.25, 0.55, 5, 'accent2', 0.26);
    for (const [dx, dy] of [[-1.55, -1.85], [1.55, -1.85], [-1.55, 1.85], [1.55, 1.85]]) B.add(new THREE.SphereGeometry(0.2, 12, 8), 'trim', [cx + dx, cy + dy, 0.08], [0, 0, 0], [1, 1, 0.6], 0.01);
    glows.push({ p: [cx, cy, 0.42], r: 0.3 });
  }
  M.star(B, 0, fy + 5.25, 1.15, 0.5, 5, 'trim', 0.32); for (const s of [-1, 1]) M.star(B, s * 3.7, fy + 4.4, 0.6, 0.27, 5, 'accent2', 0.3);
  const bs = sub(rng, 'burst', [0, fy + 4.6, -0.8], 'pulse'); M.star(bs.B, 0, fy + 4.6, 5.0, 3.3, 16, 'accent2', -0.8); S.push(bs);
  M.pole(B, [-5.6, 0, -0.75], [-5.6, fy + 1.2, -0.75], 0.38, 0.32, 0.05); M.pole(B, [5.6, 0, -0.75], [5.6, fy + 1.2, -0.75], 0.38, 0.32, 0.05);
  M.rear(B, 0, fy, [-5.6, 5.6]);
  return { id: 'belt', n: '07', label: 'Title Belt', B, S, bulbs, glows, face: { cx: 0, cy: fy }, tv: [5.6, 1.35, 0.25], h: 17, w: 36,
    why: 'Wrestling-Vorlage: Gürtel-Mittelplatte um die Tafel, zwei Seitenplatten mit Stern und Nieten, der Riemen läuft dahinter durch und endet in runden Laschen mit Nieten. Lauflicht auf dem Plattenrand, Sternkranz dahinter pulsiert.' };
}

export const FAMILIES = [crownMarquee, boomerangArrow, ovalOrbit, letterTower, starburstFin, motelTotem, titleBelt];
export { perim, row, col };
