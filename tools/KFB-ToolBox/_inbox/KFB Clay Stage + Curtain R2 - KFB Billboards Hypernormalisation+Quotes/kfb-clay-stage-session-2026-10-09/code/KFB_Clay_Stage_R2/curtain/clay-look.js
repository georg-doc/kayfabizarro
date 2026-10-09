// KFB Clay Stage R2 · Claymation-Look für Bühne + Vorhang (09.10.2026) · Kopie von R1/curtain/clay-look.js, R1 bleibt unverändert.
// Kleidet einen UNVERÄNDERTEN createTheatreCurtain()-Kern ein (kfb-curtain-core.js, candidate r1, Issue #372),
// erzeugt mit { proscenium:false, floor:false, hardware:'none' }.
// R2 nach Georgs Review (09.10.2026):
//   · Portal als Pappaufsteller mit Kantenvolumen und Seitenwangen VOR dem Vorhang: Öffnung ±1,42 m, Stoffbahnen reichen bis ±1,51 m,
//     geschlossen sieht man nichts dahinter. Kontur-Wulst um die Öffnung wie der Trim-Rand der Tafeln.
//   · Bretter durchgehend von vorn bis hinter den Vorhang, keine Flicken- oder Überstand-Planke. Bodenoberkante 4,5 cm über
//     DIM.floorY: der Saum steckt im Boden und setzt sauber auf.
//   · Streben, Seitenflats, Kopfbänder, Nägel, Säulenringe, Kordelringe, Stangenhaken entfallen (zu filigran neben den Knet-Körpern).
//   · Säulen klobig und ungleich (Doppelsockel + Kugel / Einzelsockel + Block, leicht schief), Schild aus der Mitte versetzt.
//   · Laibung: Portalkante läuft innen bis 2 cm vor den Stoff, damit auch schräg von vorn nichts hinter der Stoffkante sichtbar ist.
//   · Schmuckvorhang: Bögen wie R1 (Georg: trägt), Seitenschals jetzt aus denselben Falten-Wülsten statt Kapsel-Röhren,
//     Quasten hängen senkrecht. Bögen in der Stofffarbe, damit Bogen und Bahn dasselbe Material erzählen.
import * as THREE from 'three/webgpu';
import { attribute, uniform, float, vec2, vec3, mix, smoothstep, mx_noise_float, positionWorld, abs, max, min, length, sin, fract, step } from 'three/tsl';

const rngOf = seed => { let h = 2166136261 >>> 0; for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }; };
const h3 = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };
function vn(x, y, z) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z), fx = x - ix, fy = y - iy, fz = z - iz, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz);
  const L = (a, b, t) => a + (b - a) * t, c = (i, j, k) => h3(ix + i, iy + j, iz + k);
  return L(L(L(c(0, 0, 0), c(1, 0, 0), u), L(c(0, 1, 0), c(1, 1, 0), u), v), L(L(c(0, 0, 1), c(1, 0, 1), u), L(c(0, 1, 1), c(1, 1, 1), u), v), w);
}
function lump(g, amp, f) { const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); p.setXYZ(i, x + amp * (vn(x * f, y * f, z * f) - 0.5), y + amp * (vn(x * f + 17.3, y * f, z * f) - 0.5), z + amp * (vn(x * f, y * f + 31.1, z * f) - 0.5)); } p.needsUpdate = true; }
function rrShape(w, h, r) { const s = new THREE.Shape(), x = -w / 2, y = -h / 2; r = Math.max(0.0005, Math.min(r, w / 2, h / 2) * 0.999); s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
function rbox(w, h, d, r = 0.03) { const b = Math.min(r, d * 0.45, w * 0.3, h * 0.3); const g = new THREE.ExtrudeGeometry(rrShape(w - 2 * b, h - 2 * b, Math.max(0.0005, r - b)), { depth: Math.max(0.001, d - 2 * b), bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 3, curveSegments: 5 }); g.translate(0, 0, -(d - 2 * b) / 2); return g; }
function roundPoly(pts, r) {
  const s = new THREE.Shape(), n = pts.length, P = pts.map(p => new THREE.Vector2(p[0], p[1]));
  for (let i = 0; i < n; i++) {
    const a = P[(i - 1 + n) % n], b = P[i], c = P[(i + 1) % n], ab = a.clone().sub(b), cb = c.clone().sub(b), ri = Array.isArray(r) ? r[i] : r;
    const p1 = b.clone().add(ab.clone().setLength(Math.min(ri, ab.length() / 2))), p2 = b.clone().add(cb.clone().setLength(Math.min(ri, cb.length() / 2)));
    if (i === 0) s.moveTo(p1.x, p1.y); else s.lineTo(p1.x, p1.y); s.quadraticCurveTo(b.x, b.y, p2.x, p2.y);
  }
  s.closePath(); return s;
}
// Platte mit Vorderseite bei zFront (Publikum = −z), Tiefe nach hinten
function slabF(shape, depth, bevel, zFront, seg = 10) { const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: seg }); g.translate(0, 0, zFront + bevel); return g; }

const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _c = new THREE.Color();
const M4 = (pos = [0, 0, 0], rot = [0, 0, 0], scl = [1, 1, 1]) => new THREE.Matrix4().compose(new THREE.Vector3(...pos), new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)), new THREE.Vector3(...scl));
class Kit {
  constructor(seed) { this.L = []; this.rng = rngOf(seed); }
  add(geo, role, pos, rot, scl, amp = 0.006, parent = null, f = 7) {
    let g = geo.index ? geo.toNonIndexed() : geo; if (g !== geo) geo.dispose();
    for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal') g.deleteAttribute(k);
    g.applyMatrix4(_m.compose(_p.set(...(pos || [0, 0, 0])), _q.setFromEuler(_e.set(...(rot || [0, 0, 0]))), _s.set(...(scl || [1, 1, 1]))));
    if (parent) g.applyMatrix4(parent);
    if (amp) lump(g, amp, f);
    g.userData = { role, tint: 1 + (this.rng() - 0.5) * 0.08 }; this.L.push(g); return g;
  }
  build(mat, name) {
    let n = 0; for (const g of this.L) n += g.attributes.position.count;
    const P = new Float32Array(n * 3), N = new Float32Array(n * 3), ranges = []; let o = 0;
    for (const g of this.L) { const c = g.attributes.position.count; P.set(g.attributes.position.array, o * 3); N.set(g.attributes.normal.array, o * 3); ranges.push({ start: o, n: c, role: g.userData.role, tint: g.userData.tint }); o += c; g.dispose(); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(P, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(N, 3)); geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    geo.computeBoundingSphere(); this.L = [];
    const mesh = new THREE.Mesh(geo, mat); mesh.name = name; mesh.castShadow = mesh.receiveShadow = true; mesh.userData.ranges = ranges; return mesh;
  }
}
function recolor(mesh, pal) { const a = mesh.geometry.attributes.color; for (const r of mesh.userData.ranges) { _c.set(pal[r.role] || '#ff00ff').multiplyScalar(r.tint); for (let i = r.start; i < r.start + r.n; i++) a.setXYZ(i, _c.r, _c.g, _c.b); } a.needsUpdate = true; }

// ── Materialien ──────────────────────────────────────────────────────────────────────────────────────
const n01 = p => mx_noise_float(p).mul(0.5).add(0.5);
function clayMat() { const m = new THREE.MeshStandardNodeMaterial({ vertexColors: true, roughness: 0.9, metalness: 0 }); m.colorNode = vec3(n01(positionWorld.mul(4.2)).mul(0.13).add(n01(positionWorld.mul(23.0)).mul(0.05)).add(0.86)); return m; }
function woodMat(axis) {
  const m = new THREE.MeshStandardNodeMaterial({ vertexColors: true, roughness: 0.84, metalness: 0 }), p = positionWorld;
  const a = axis === 'y' ? p.y : p.x, w = mx_noise_float(p.mul(vec3(1.6, 1.6, 0.7))).mul(2.6).add(mx_noise_float(p.mul(9.0)).mul(0.5));
  const groove = float(1).sub(smoothstep(0.0, 0.17, abs(sin(a.mul(46.0).add(w)))));
  m.colorNode = vec3(float(0.97).sub(groove.mul(0.3)).add(n01(p.mul(3.0)).mul(0.07)).sub(n01(p.mul(0.9)).mul(0.05)));
  return m;
}

// Stoff: Knete/Filz. clothUV-Raum (x: 0 Innenkante → 1 Flügel, y: 0 oben → 1 Saum), Maße in m (1,82 × 2,32).
// R2: Faserstreifen schwächer (0,07 → 0,03), dafür dieselbe Knet-Marmorierung wie die Bögen (gleiche Frequenzen wie clayMat, im clothUV-Raum).
const CW = 1.82, CH = 2.32;
const PATCHES = [
  [{ cx: 0.62, cy: 1.45, hw: 0.14, hh: 0.11, r: 0.03, rot: 0.12, col: 'A' }, { cx: 1.12, cy: 0.62, hw: 0.08, hh: 0.1, r: 0.025, rot: -0.2, col: 'B' }],
  [{ cx: 0.42, cy: 1.05, hw: 0.12, hh: 0.15, r: 0.03, rot: -0.08, col: 'B' }, { cx: 1.25, cy: 1.78, hw: 0.1, hh: 0.07, r: 0.02, rot: 0.25, col: 'A' }]];
const STAINS = [[{ x: 0.35, y: 1.92, r: 0.16 }, { x: 1.3, y: 1.18, r: 0.1 }], [{ x: 0.8, y: 2.06, r: 0.18 }, { x: 0.22, y: 0.5, r: 0.08 }]];
function clothNodes(U, seed, k) {
  const uvc = attribute('clothUV', 'vec2'), x = uvc.x, y = uvc.y, mx = x.mul(CW), my = y.mul(CH);
  const N = (a, b, s) => n01(vec3(a, b, float(s)));
  const n1 = N(x.mul(3.0), y.mul(1.7), seed), n2 = N(x.mul(11.0), y.mul(8.0), seed + 2.1), fib = N(mx.mul(70.0), my.mul(70.0), seed + 9.3), band = N(x.mul(6.5), float(0.37), seed + 5.2);
  const clayMot = N(mx.mul(4.2), my.mul(4.2), seed + 3.3).mul(0.13).add(N(mx.mul(23.0), my.mul(23.0), seed + 4.4).mul(0.05)).add(0.86);
  const fadeTop = float(1).sub(smoothstep(0.04, 0.5, y)).mul(smoothstep(0.3, 0.75, band).mul(0.65).add(0.35));
  let c = mix(U.cloth, U.fade, fadeTop.mul(0.62).add(smoothstep(0.58, 0.88, n1).mul(0.22)).mul(U.age));
  c = mix(c, U.hem, smoothstep(0.8, 0.97, y).mul(0.75));
  const grip = float(1).sub(smoothstep(0.0, 0.1, x)).mul(smoothstep(0.36, 0.46, y)).mul(float(1).sub(smoothstep(0.6, 0.72, y)));
  c = mix(c, U.wear, grip.mul(n2.mul(0.5).add(0.5)).mul(0.7).mul(U.age));
  c = mix(c, U.wear, float(1).sub(smoothstep(0.0, 0.022, x)).mul(0.5).mul(U.age));
  c = mix(c, U.dust, smoothstep(0.92, 1.0, y).mul(n1.mul(0.6).add(0.4)).mul(0.6).mul(U.age));
  for (const s of STAINS[k]) { const d = length(vec2(mx.sub(s.x), my.sub(s.y))); const st = float(1).sub(smoothstep(s.r * 0.35, s.r, d)).mul(N(mx.mul(9.0), my.mul(9.0), seed + s.x).mul(0.7).add(0.3)); c = mix(c, U.stain, st.mul(0.5).mul(U.decal)); }
  for (const p of PATCHES[k]) {
    const cs = Math.cos(p.rot), sn = Math.sin(p.rot), px = mx.sub(p.cx), py = my.sub(p.cy), rx = px.mul(cs).sub(py.mul(sn)), ry = px.mul(sn).add(py.mul(cs));
    const q = vec2(abs(rx), abs(ry)).sub(vec2(p.hw - p.r, p.hh - p.r)), d = length(max(q, vec2(0.0, 0.0))).add(min(max(q.x, q.y), float(0.0))).sub(p.r);
    const fill = float(1).sub(smoothstep(-0.002, 0.003, d)).mul(U.decal), shade = smoothstep(-0.002, 0.004, d).mul(float(1).sub(smoothstep(0.004, 0.022, d))).mul(U.decal);
    c = mix(c, c.mul(0.7), shade.mul(0.6));
    c = mix(c, (p.col === 'A' ? U.patchA : U.patchB).mul(n2.mul(0.12).add(0.92)), fill);
    const stitch = float(1).sub(smoothstep(0.0025, 0.006, abs(d.add(0.022)))).mul(step(0.5, fract(rx.add(ry).mul(30.0)))).mul(U.decal);
    c = mix(c, U.stitch, stitch);
  }
  const hemLine = float(1).sub(smoothstep(0.0012, 0.0035, abs(y.sub(0.952)))).mul(step(0.45, fract(mx.mul(26.0))));
  c = mix(c, U.stitch, hemLine.mul(0.85));
  c = c.mul(clayMot).mul(fib.mul(0.03).add(0.985));
  return { colorNode: c, roughnessNode: float(0.9) };
}

// ── Maße ─────────────────────────────────────────────────────────────────────────────────────────────
export const STAGE = { floorLift: 0.045, XO: 2.3, XI: 1.42, OT: 1.62, PT: 2.05, PZ: -0.52, Z0: -1.62, Z1: 2.0 };

// ── Look ─────────────────────────────────────────────────────────────────────────────────────────────
export function dressClay(curtain, pal) {
  const D = curtain.DIM, g = curtain.group, FT = D.floorY + STAGE.floorLift, { XO, XI, OT, PT, PZ, Z0, Z1 } = STAGE;
  const U = { cloth: uniform(new THREE.Color()), fade: uniform(new THREE.Color()), hem: uniform(new THREE.Color()), wear: uniform(new THREE.Color()), dust: uniform(new THREE.Color()), patchA: uniform(new THREE.Color()), patchB: uniform(new THREE.Color()), stitch: uniform(new THREE.Color()), stain: uniform(new THREE.Color()), decal: uniform(1), age: uniform(1) };
  curtain.panels.forEach((pn, k) => { const m = pn.material; Object.assign(m, clothNodes(U, k ? 7.9 : 1.3, k)); m.sheen = 0; m.needsUpdate = true; });
  const mask = g.children.find(o => o.isMesh && o.geometry && o.geometry.type === 'PlaneGeometry');

  const clay = new Kit('stage-clay-r2'), woodX = new Kit('stage-woodX-r2'), woodY = new Kit('stage-woodY-r2'), V3 = THREE.Vector3;

  // Boden: 19 durchgehende Bretter längs z, von der Vorderkante bis hinter den Prospekt. Nur Tönung variiert.
  const PW = 0.26, GAP = 0.014, TH = 0.09, nP = 19, X0 = -(nP * (PW + GAP) - GAP) / 2, halfW = -X0;
  for (let i = 0; i < nP; i++) {
    const x = X0 + i * (PW + GAP) + PW / 2, za = Z0 + (clay.rng() - 0.5) * 0.012, zb = Z1, dy = (clay.rng() - 0.5) * 0.006;
    woodX.add(rbox(PW, zb - za, TH, 0.04), 'wood', [x, FT - TH / 2 + dy, (za + zb) / 2], [-Math.PI / 2, 0, 0], [1, 1, 1], 0.005, null, 6);
  }
  woodY.add(rbox(2 * halfW + 0.06, 0.43, 0.06, 0.025), 'woodDark', [0, FT - 0.215 - 0.005, Z0 - 0.03], [0, 0, 0], [1, 1, 1], 0.006, null, 5);
  for (const s of [-1, 1]) woodY.add(rbox(0.06, 0.43, Z1 - Z0, 0.025), 'woodDark', [s * (halfW + 0.03), FT - 0.215 - 0.005, (Z0 + Z1) / 2], [0, 0, 0], [1, 1, 1], 0.006, null, 5);

  // Portal: Pappaufsteller mit Kante (portalEdge), aufgesetzter Frontplatte (portal) 8 cm eingerückt, Kontur-Wulst um die Öffnung,
  // Seitenwangen nach hinten. U-Form: Öffnung unten offen, Fuß steckt im Boden.
  const U_ = (xo, xi, yb, ot, pt) => [[-xo, yb], [-xi, yb], [-xi, ot], [xi, ot], [xi, yb], [xo, yb], [xo, pt], [-xo, pt]];
  clay.add(slabF(roundPoly(U_(XO, XI, FT - 0.08, OT, PT), [0.03, 0.03, 0.42, 0.42, 0.03, 0.03, 0.3, 0.3]), 0.14, 0.05, PZ), 'portalEdge', null, null, null, 0.008, null, 3);
  const ins = 0.08, xe = XI + ins, ye = OT + ins, rc = 0.5;
  clay.add(slabF(roundPoly(U_(XO - ins, xe, FT + 0.05, ye, PT - ins), [0.03, 0.03, rc, rc, 0.03, 0.03, 0.22, 0.22]), 0.01, 0.025, PZ - 0.035), 'portal', null, null, null, 0.005, null, 3);
  const tp = [], tz = PZ - 0.04;
  for (let y = FT - 0.03; y < ye - rc - 0.02; y += 0.12) tp.push(new V3(-xe, y, tz));
  for (let k = 0; k <= 10; k++) { const a = Math.PI - k * Math.PI / 20; tp.push(new V3(-xe + rc + Math.cos(a) * rc, ye - rc + Math.sin(a) * rc, tz)); }
  for (let x = -xe + rc + 0.14; x < xe - rc - 0.07; x += 0.14) tp.push(new V3(x, ye, tz));
  for (let k = 0; k <= 10; k++) { const a = Math.PI / 2 - k * Math.PI / 20; tp.push(new V3(xe - rc + Math.cos(a) * rc, ye - rc + Math.sin(a) * rc, tz)); }
  for (let y = ye - rc - 0.12; y > FT - 0.03; y -= 0.12) tp.push(new V3(xe, y, tz));
  clay.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tp, false, 'centripetal'), 220, 0.055, 10, false), 'portalLine', null, null, null, 0.006, null, 9);
  const wz0 = PZ + 0.24, wz1 = 0.7;
  for (const s of [-1, 1]) clay.add(rbox(0.12, PT - FT + 0.06, wz1 - wz0, 0.04), 'portalEdge', [s * (XO - 0.07), (PT + FT) / 2, (wz0 + wz1) / 2], [0, 0, 0], [1, 1, 1], 0.008, null, 3);
  // Laibung: Portalkante läuft innen bis kurz vor den Stoff (z −0,02). Sonst sieht man schräg von vorn hinter der Stoffkante vorbei.
  const lz0 = PZ + 0.2, lz1 = -0.02;
  for (const s of [-1, 1]) clay.add(rbox(0.07, OT + 0.12 - FT + 0.04, lz1 - lz0, 0.02), 'portalEdge', [s * (XI + 0.015), (OT + 0.12 + FT - 0.04) / 2, (lz0 + lz1) / 2], [0, 0, 0], [1, 1, 1], 0.004, null, 3);

  // Säulen vor den Portalbeinen, klobig und ungleich
  const CZ = -0.86;
  const cols = [
    { s: -1, lean: 0.012, plinths: [[0.62, 0.2, 0.56, 0.05], [0.5, 0.17, 0.46, -0.07]], top: 1.92, prof: [[0.22, 0], [0.25, 0.09], [0.18, 0.24], [0.16, 0.62], [0.21, 0.98], [0.22, 1.12], [0.17, 1.4], [0.15, 2.05], [0.19, 2.4], [0.2, 1]] , cap: 'ball' },
    { s: 1, lean: -0.02, plinths: [[0.64, 0.27, 0.58, -0.03]], top: 1.98, prof: [[0.23, 0], [0.26, 0.1], [0.19, 0.3], [0.17, 0.9], [0.2, 1.5], [0.165, 1.9], [0.16, 2.3], [0.21, 2.6], [0.22, 1]], cap: 'block' }];
  for (const c of cols) {
    const cx = c.s * 1.88; let y = FT;
    for (const [w, h, d, t] of c.plinths) { clay.add(rbox(w, h, d, 0.08), 'stone', [cx, y + h / 2, CZ], [0, t, 0], [1, 1, 1], 0.014, null, 8); y += h; }
    const H = c.top - y, prof = c.prof.map(([r, v], i) => new THREE.Vector2(r, i === c.prof.length - 1 ? H : Math.min(v, H - 0.05)));
    const P = M4([cx, y - 0.01, CZ], [0, 0, c.lean]);
    clay.add(new THREE.LatheGeometry(prof, 24), 'column', null, null, null, 0.008, P, 8);
    if (c.cap === 'ball') { clay.add(rbox(0.5, 0.15, 0.5, 0.06), 'capital', [0, H + 0.07, 0], [0, 0.08, 0], [1, 1, 1], 0.008, P); clay.add(new THREE.SphereGeometry(0.2, 18, 14), 'capital', [0, H + 0.33, 0], [0, 0, 0], [1, 0.92, 1], 0.01, P); }
    else { clay.add(rbox(0.54, 0.2, 0.54, 0.07), 'capital', [0, H + 0.1, 0], [0, -0.06, 0.02], [1, 1, 1], 0.008, P); woodY.add(rbox(0.6, 0.07, 0.6, 0.025), 'wood', [0, H + 0.235, 0], [0, -0.1, 0], [1, 1, 1], 0.004, P); }
  }

  // Schild auf dem Portal, aus der Mitte versetzt und leicht gekippt
  const SX = -0.38, SY = PT + 0.2 + 0.25, SZ = PZ + 0.1;
  for (const dx of [-0.5, 0.5]) woodY.add(rbox(0.1, 0.26, 0.08, 0.03), 'woodDark', [SX + dx, PT + 0.12, SZ], [0, 0, 0], [1, 1, 1], 0.004);
  clay.add(rbox(1.5, 0.5, 0.08, 0.12), 'signBoard', [SX, SY, SZ], [0, 0, -0.035], [1, 1, 1], 0.006);
  const signCv = document.createElement('canvas'); signCv.width = 768; signCv.height = 192; const signTex = new THREE.CanvasTexture(signCv); signTex.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.34, 0.335), new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.9 })); sign.position.set(SX, SY, SZ - 0.045); sign.rotation.set(0, Math.PI, 0.035); sign.name = 'painted-sign'; sign.receiveShadow = true;

  // Schmuckvorhang hinter dem Portalkopf: Blendbrett (verdeckt Stoffoberkante), Wulst unten, drei Bogen-Reihen,
  // Seitenschals aus vier Falten-Wülsten (außen am längsten), Rosetten, zwei senkrechte Quasten unterschiedlicher Länge
  const VZ = -0.17, VB = 1.1;
  clay.add(rbox(2.95, OT + 0.12 - VB, 0.05, 0.02), 'valanceDark', [0, (OT + 0.12 + VB) / 2, -0.15], [0, 0, 0], [1, 1, 1], 0.004);
  clay.add(new THREE.CapsuleGeometry(0.05, 2.8, 6, 12), 'valance', [0, VB, VZ - 0.02], [0, 0, Math.PI / 2], [1, 1, 0.8], 0.006, null, 11);
  const xs = [-XI, -0.47, 0.47, XI];
  for (let k = 0; k < 3; k++) for (let j = 0; j < 3; j++) {
    const a = xs[k], b = xs[k + 1], sag = 0.12 + j * 0.075, rad = 0.075 - j * 0.006, y0 = OT - 0.02 - j * 0.045, pts = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push(new V3(a + (b - a) * t, y0 - sag * 4 * t * (1 - t), VZ - 0.04 - j * 0.02 - 0.05 * Math.sin(Math.PI * t))); }
    clay.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 36, rad, 12, false), 'valance', null, null, null, 0.01, null, 11);
  }
  for (const s of [-1, 1]) {
    const lens = s < 0 ? [1.14, 0.96, 0.8, 0.64] : [1.08, 0.92, 0.78, 0.6], top = OT - 0.03;
    lens.forEach((L, i) => { const r = 0.078 - i * 0.004; clay.add(new THREE.CapsuleGeometry(r, L - 2 * r, 6, 14), 'valance', [s * (1.36 - i * 0.12), top - L / 2, VZ - 0.1 - (i % 2 ? 0.05 : 0)], [0, 0, 0], [1, 1, 0.75], 0.01, null, 11); });
    clay.add(new THREE.SphereGeometry(0.1, 16, 12), 'tassel', [s * 1.3, OT - 0.05, VZ - 0.2], [0, 0, 0], [1, 1, 0.6], 0.006);
  }
  for (const [x, L] of [[-0.47, 0.24], [0.47, 0.34]]) {
    const y0 = OT - 0.06;
    clay.add(new THREE.SphereGeometry(0.09, 16, 12), 'tassel', [x, y0, VZ - 0.13], [0, 0, 0], [1, 1, 0.6], 0.006);
    clay.add(new THREE.CylinderGeometry(0.016, 0.016, L, 8), 'cord', [x, y0 - L / 2, VZ - 0.16], [0, 0, 0], [1, 1, 1], 0);
    clay.add(new THREE.SphereGeometry(0.058, 14, 10), 'tassel', [x, y0 - L - 0.03, VZ - 0.16], [0, 0, 0], [1, 1, 1], 0.004);
    clay.add(new THREE.CylinderGeometry(0.05, 0.05, 0.045, 14), 'cord', [x, y0 - L - 0.09, VZ - 0.16], [0, 0, 0], [1, 1, 1], 0.003);
    clay.add(new THREE.ConeGeometry(0.078, 0.18, 14, 2), 'tassel', [x, y0 - L - 0.2, VZ - 0.16], [0, 0, 0], [1, 1, 1], 0.006);
  }

  // Rampenlicht: vier Knet-Laternen, ungleich gesetzt
  const lampMats = [], lamps = new THREE.Group(); lamps.name = 'clay-lanterns';
  for (const [x, t] of [[-1.22, 0.07], [-0.44, -0.05], [0.36, 0.09], [1.2, -0.08]]) {
    const z = -1.36;
    clay.add(rbox(0.26, 0.08, 0.17, 0.035), 'nail', [x, FT + 0.04, z], [0, t, 0], [1, 1, 1], 0.004);
    clay.add(rbox(0.28, 0.13, 0.06, 0.03), 'lantern', [x, FT + 0.13, z - 0.08], [0.25, t, 0], [1, 1, 1], 0.005);
    const m = new THREE.MeshBasicMaterial({ color: pal.bulbOn }); lampMats.push(m);
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), m); b.position.set(x, FT + 0.16, z + 0.01); lamps.add(b);
  }

  const look = new THREE.Group(); look.name = 'clay-look';
  const cM = clayMat(), wX = woodMat('x'), wY = woodMat('y'), mats = [cM, wX, wY];
  const meshes = [clay.build(cM, 'clay-parts'), woodX.build(wX, 'clay-boards'), woodY.build(wY, 'clay-beams')];
  look.add(...meshes, lamps, sign); g.add(look);

  function paintSign(P) {
    const x = signCv.getContext('2d'), W = signCv.width, H = signCv.height, cx = W / 2, cy = H * 0.98;
    x.fillStyle = P.skyBottom; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 18; i++) { const a0 = Math.PI + i * Math.PI / 18, a1 = a0 + Math.PI / 18; x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, W, a0, a1); x.closePath(); x.fillStyle = i % 2 ? P.trim : P.accent; x.globalAlpha = i % 2 ? 0.9 : 0.55; x.fill(); }
    x.globalAlpha = 1;
    const star = (sx, sy, ro) => { x.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? ro * 0.45 : ro; x.lineTo(sx + Math.cos(a) * rr, sy + Math.sin(a) * rr); } x.closePath(); x.fillStyle = P.trim; x.fill(); x.lineWidth = 7; x.lineJoin = 'round'; x.strokeStyle = P.dark; x.stroke(); };
    star(cx, H * 0.47, 62); star(cx - 190, H * 0.56, 38); star(cx + 190, H * 0.56, 38);
    x.lineWidth = 14; x.strokeStyle = P.dark; x.strokeRect(7, 7, W - 14, H - 14);
    signTex.needsUpdate = true;
  }
  let P = pal, level = 1;
  function setPalette(p) {
    P = p; for (const m of meshes) recolor(m, p);
    U.cloth.value.set(p.cloth); U.fade.value.set(p.clothFade); U.hem.value.set(p.clothHem); U.wear.value.set(p.clothWear); U.dust.value.set(p.dust);
    U.patchA.value.set(p.patchA); U.patchB.value.set(p.patchB); U.stitch.value.set(p.stitch); U.stain.value.set(p.stain);
    if (mask && mask.material.color) mask.material.color.set(p.valanceDark).multiplyScalar(0.35);
    lampMats.forEach(m => m.color.set(p.bulbOn).multiplyScalar(0.35 + 0.65 * level));
    paintSign(p);
  }
  setPalette(pal);
  const tris = meshes.reduce((a, m) => a + m.geometry.attributes.position.count / 3, 0);
  return {
    group: look, setPalette, floorTop: FT,
    measure: { opening: [-XI, XI], clothWing: D.railGap + D.Wspan, clothOverlapEachSide: +(D.railGap + D.Wspan - XI).toFixed(3), clothRestBottom: +(D.topY - D.H).toFixed(3), floorTop: +FT.toFixed(3), hemBuried: +(FT - (D.topY - D.H)).toFixed(3) },
    setFootlights(l) { level = l; curtain.setFootlights(l); lampMats.forEach(m => m.color.set(P.bulbOn).multiplyScalar(0.35 + 0.65 * l)); },
    setDecals(b) { U.decal.value = b ? 1 : 0; }, setAge(a) { U.age.value = a; }, setSign(b) { sign.visible = b; },
    stats: { tris: Math.round(tris), parts: meshes.map(m => m.userData.ranges.length).reduce((a, b) => a + b, 0), meshes: meshes.length + 2 },
    dispose() { meshes.forEach(m => m.geometry.dispose()); mats.forEach(m => m.dispose()); lampMats.forEach(m => m.dispose()); signTex.dispose(); }
  };
}
