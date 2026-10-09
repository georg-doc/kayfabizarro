// KFB Clay Stage R1 · Claymation-Look für Bühne + Vorhang (09.10.2026)
// Kleidet einen UNVERÄNDERTEN createTheatreCurtain()-Kern ein (kfb-curtain-core.js, candidate r1, Issue #372),
// erzeugt mit { proscenium:false, floor:false, hardware:'rings' }. Was hier passiert, liegt im Vertrag:
//   · Material des Stoffs: colorNode/roughnessNode der beiden Bahnen ersetzt, positionNode (Cloth) bleibt, sheen 0.
//     Decals (Flicken mit Naht, Flecken, Greifspur, Kantenabrieb, ausgeblichene Bahnen, Saumband, Staub) liegen im
//     clothUV-Raum (Ruhegitter je Quad) und gehen deshalb mit der Falte. Kein zweiter Renderpfad, keine Textur, keine Normal-Map.
//   · Hardware (Stange, Ringe, Haken, Maskierung): nur Materialien getauscht.
//   · Statische Geometrie in curtain.group: Bodenbretter, Vorderkante, Säulen, Seitenflats, Querbalken, Schild, Wülste
//     mit Quasten, Knet-Laternen. Cloth-Kern, Zustände, Steuerung, Auflösung: unverändert.
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
// Knet-Quader: Ecken in xy gerundet, Kanten in z gefast; Maß = Außenmaß
function rbox(w, h, d, r = 0.03) { const b = Math.min(r, d * 0.45, w * 0.3, h * 0.3); const g = new THREE.ExtrudeGeometry(rrShape(w - 2 * b, h - 2 * b, Math.max(0.0005, r - b)), { depth: Math.max(0.001, d - 2 * b), bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 3, curveSegments: 5 }); g.translate(0, 0, -(d - 2 * b) / 2); return g; }

const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _c = new THREE.Color();
const M4 = (pos = [0, 0, 0], rot = [0, 0, 0], scl = [1, 1, 1]) => new THREE.Matrix4().compose(new THREE.Vector3(...pos), new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)), new THREE.Vector3(...scl));
// Teile sammeln, je Rolle Vertexfarbe, zu EINER Mesh verschmelzen (wie Body in billboards/kit.js, hier für three/webgpu)
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
function clayMat() { const m = new THREE.MeshStandardNodeMaterial({ vertexColors: true, roughness: 0.88, metalness: 0 }); m.colorNode = vec3(n01(positionWorld.mul(4.2)).mul(0.13).add(n01(positionWorld.mul(23.0)).mul(0.05)).add(0.86)); return m; }
// Holz als Knet-Ritzung: dunkle Rillen entlang der Faser; axis 'x' = Rillen wechseln in x (Bretter längs z bzw. senkrecht), 'y' = Balken längs x
function woodMat(axis) {
  const m = new THREE.MeshStandardNodeMaterial({ vertexColors: true, roughness: 0.84, metalness: 0 }), p = positionWorld;
  const a = axis === 'y' ? p.y : p.x, w = mx_noise_float(p.mul(vec3(1.6, 1.6, 0.7))).mul(2.6).add(mx_noise_float(p.mul(9.0)).mul(0.5));
  const groove = float(1).sub(smoothstep(0.0, 0.17, abs(sin(a.mul(46.0).add(w)))));
  m.colorNode = vec3(float(0.97).sub(groove.mul(0.3)).add(n01(p.mul(3.0)).mul(0.07)).sub(n01(p.mul(0.9)).mul(0.05)));
  return m;
}
function solidClay(hex) { const u = uniform(new THREE.Color(hex)), m = new THREE.MeshStandardNodeMaterial({ roughness: 0.82, metalness: 0 }); m.colorNode = u.mul(n01(positionWorld.mul(9.0)).mul(0.12).add(0.9)); m.userData.u = u; return m; }

// Stoff: Knete/Filz statt Samt. Alles im clothUV-Raum (x: 0 Innenkante → 1 Flügel, y: 0 oben → 1 Saum), Maße in m (1,82 × 2,32).
const CW = 1.82, CH = 2.32;
const PATCHES = [
  [{ cx: 0.62, cy: 1.45, hw: 0.14, hh: 0.11, r: 0.03, rot: 0.12, col: 'A' }, { cx: 1.12, cy: 0.62, hw: 0.08, hh: 0.1, r: 0.025, rot: -0.2, col: 'B' }],
  [{ cx: 0.42, cy: 1.05, hw: 0.12, hh: 0.15, r: 0.03, rot: -0.08, col: 'B' }, { cx: 1.25, cy: 1.78, hw: 0.1, hh: 0.07, r: 0.02, rot: 0.25, col: 'A' }]];
const STAINS = [[{ x: 0.35, y: 1.92, r: 0.16 }, { x: 1.3, y: 1.18, r: 0.1 }], [{ x: 0.8, y: 2.06, r: 0.18 }, { x: 0.22, y: 0.5, r: 0.08 }]];
function clothNodes(U, seed, k) {
  const uvc = attribute('clothUV', 'vec2'), x = uvc.x, y = uvc.y, mx = x.mul(CW), my = y.mul(CH);
  const N = (a, b, s) => n01(vec3(a, b, float(s)));
  const n1 = N(x.mul(3.0), y.mul(1.7), seed), n2 = N(x.mul(11.0), y.mul(8.0), seed + 2.1), fib = N(mx.mul(70.0), my.mul(70.0), seed + 9.3), band = N(x.mul(6.5), float(0.37), seed + 5.2);
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
  c = c.mul(fib.mul(0.07).add(0.965)).mul(n2.mul(0.06).add(0.97));
  return { colorNode: c, roughnessNode: float(0.9).add(fadeTop.mul(0.05)) };
}

// ── Look ─────────────────────────────────────────────────────────────────────────────────────────────
export function dressClay(curtain, pal, opts = {}) {
  const D = curtain.DIM, FY = D.floorY, g = curtain.group;
  const U = { cloth: uniform(new THREE.Color()), fade: uniform(new THREE.Color()), hem: uniform(new THREE.Color()), wear: uniform(new THREE.Color()), dust: uniform(new THREE.Color()), patchA: uniform(new THREE.Color()), patchB: uniform(new THREE.Color()), stitch: uniform(new THREE.Color()), stain: uniform(new THREE.Color()), decal: uniform(1), age: uniform(1) };
  curtain.panels.forEach((pn, k) => { const m = pn.material; Object.assign(m, clothNodes(U, k ? 7.9 : 1.3, k)); m.sheen = 0; m.needsUpdate = true; });
  // Hardware: Stange + Endkugeln Holz, Ringe/Haken Knet-Blech, Maskierung in der Palette
  const railM = solidClay(pal.woodDark), ringM = solidClay(pal.nail), mats = [railM, ringM];
  const hw = g.getObjectByName('hardware');
  if (hw) hw.children.forEach(o => { o.material = (o.isInstancedMesh ? ringM : railM); o.castShadow = true; });
  const mask = g.children.find(o => o.isMesh && o.geometry && o.geometry.type === 'PlaneGeometry');

  const clay = new Kit('stage-clay'), woodX = new Kit('stage-woodX'), woodY = new Kit('stage-woodY'), r = clay.rng;
  // Bodenbretter: längs z, Vorderkante zum Publikum (−z). Fugen, Höhenversatz, eine Planke steht vor, ein Flickenbrett.
  const PW = 0.24, GAP = 0.016, TH = 0.09, Z0 = -1.56, Z1 = 2.0, nP = 21, X0 = -(nP * (PW + GAP) - GAP) / 2, nails = [];
  const plank = (x, za, zb, role, dy) => { const len = zb - za; woodX.add(rbox(PW, len, TH, 0.04), role, [x, FY - TH / 2 + dy, (za + zb) / 2], [-Math.PI / 2, (r() - 0.5) * 0.02, (r() - 0.5) * 0.008], [1, 1, 1], 0.006, null, 6); };
  for (let i = 0; i < nP; i++) {
    const x = X0 + i * (PW + GAP) + PW / 2, over = i === 13 ? 0.08 : 0, dy = (r() - 0.5) * 0.014, za = Z0 - over + (i === 13 ? 0 : r() * 0.025), zb = Z1 - r() * 0.04;
    if (i === 6) { plank(x, -0.32, zb, 'wood', dy); plank(x, za, -0.34, 'woodPatch', dy + 0.006); nails.push([x, -0.4, dy + 0.006], [x, -0.26, dy]); }
    else plank(x, za, zb, 'wood', dy);
    nails.push([x, za + 0.07, dy], [x, zb - 0.07, dy]);
  }
  for (const [x, z, dy] of nails) for (const s of [-1, 1]) clay.add(new THREE.SphereGeometry(0.014, 8, 6), 'nail', [x + s * 0.065, FY + dy + 0.001, z], [0, 0, 0], [1, 0.45, 1], 0);
  const halfW = -X0;
  woodY.add(rbox(2 * halfW + 0.04, 0.3, 0.05, 0.02), 'woodDark', [0, FY - TH - 0.15, Z0 + 0.07], [0, 0, 0], [1, 1, 1], 0.006, null, 5);
  for (const s of [-1, 1]) woodY.add(rbox(0.05, 0.3, Z1 - Z0 - 0.1, 0.02), 'woodDark', [s * (halfW + 0.02), FY - TH - 0.15, (Z0 + Z1) / 2 + 0.04], [0, 0, 0], [1, 1, 1], 0.006, null, 5);
  // Rampenlichter als Knet-Laternen: Sockel, Schirm zum Publikum, Glühbirne in der Palette, Knopf obenauf
  const lampMats = [], lamps = new THREE.Group(); lamps.name = 'clay-lanterns';
  for (const x of [-1.7, -0.85, 0, 0.85, 1.7]) {
    const z = -1.36, t = (r() - 0.5) * 0.12;
    clay.add(rbox(0.2, 0.06, 0.13, 0.025), 'nail', [x, FY + 0.03, z], [0, t, 0], [1, 1, 1], 0.004);
    clay.add(rbox(0.22, 0.09, 0.045, 0.028), 'lantern', [x, FY + 0.095, z - 0.07], [0.22, t, 0], [1, 1, 1], 0.005);
    for (const dx of [-0.09, 0.09]) clay.add(new THREE.SphereGeometry(0.02, 10, 8), 'trim', [x + dx, FY + 0.142, z - 0.075], [0, 0, 0], [1, 1, 1], 0);
    const m = new THREE.MeshBasicMaterial({ color: pal.bulbOn }); lampMats.push(m);
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 10), m); b.position.set(x, FY + 0.15, z + 0.01); lamps.add(b);
  }
  // Säulen: Knetstein-Sockel (Mauerwerk-Familie A, rund gestapelt), gedrechselter Schaft bemalt, leicht schief
  const colTop = 1.55, base = FY + 0.3, shaftH = colTop - base;
  const prof = [[0.15, 0], [0.175, 0.05], [0.13, 0.13], [0.12, 0.32], [0.15, 0.56], [0.162, 0.7], [0.13, 0.9], [0.112, 1.4], [0.13, 1.8], [0.158, 2.0], [0.12, 2.16], [0.165, 2.3], [0.15, shaftH]].map(([a, b]) => new THREE.Vector2(a, b));
  const ringR = y => { for (let i = 1; i < prof.length; i++) if (prof[i].y >= y) { const a = prof[i - 1], b = prof[i]; return a.x + (b.x - a.x) * (y - a.y) / (b.y - a.y); } return 0.15; };
  for (const s of [-1, 1]) {
    const cx = s * 1.8, cz = -0.36, lean = s > 0 ? -0.016 : 0.012;
    clay.add(rbox(0.52, 0.16, 0.46, 0.07), 'stone', [cx, FY + 0.08, cz], [0, s * 0.05, 0], [1, 1, 1], 0.014, null, 9);
    clay.add(rbox(0.43, 0.14, 0.39, 0.06), 'stone', [cx + s * 0.01, FY + 0.23, cz], [0, -s * 0.09, 0.02], [1, 1, 1], 0.012, null, 9);
    const P = M4([cx, base, cz], [0, 0, lean]);
    clay.add(new THREE.LatheGeometry(prof, 20), 'column', [0, 0, 0], [0, 0, 0], [1, 1, 1], 0.006, P, 9);
    for (const y of [0.7, 2.0]) clay.add(new THREE.TorusGeometry(ringR(y) + 0.004, 0.02, 8, 26), 'colRing', [0, y, 0], [Math.PI / 2, 0, 0], [1, 1, 1], 0.003, P);
    clay.add(rbox(0.44, 0.13, 0.4, 0.05), 'capital', [0, shaftH + 0.065, 0], [0, 0, 0], [1, 1, 1], 0.008, P);
    woodY.add(rbox(0.52, 0.05, 0.46, 0.02), 'wood', [0, shaftH + 0.155, 0], [0, 0, 0], [1, 1, 1], 0.004, P);
    for (const dx of [-0.13, 0.13]) clay.add(new THREE.SphereGeometry(0.016, 8, 6), 'nail', [dx, shaftH + 0.065, -0.205], [0, 0, 0], [1, 1, 0.5], 0, P);
    // Seitenflats: Bretterwand hinter der Säule, maskiert die Flügel; Z-Strebe vorne
    let x = 1.58; [0.24, 0.22, 0.25, 0.23].forEach((w, i) => { const top = 1.52 + r() * 0.1; woodX.add(rbox(w, top - FY, 0.05, 0.025), i === 2 ? 'flat2' : 'flat', [s * (x + w / 2), (FY + top) / 2, -0.14], [0, 0, (r() - 0.5) * 0.014], [1, 1, 1], 0.005, null, 6); x += w + 0.012; });
    const a = new THREE.Vector3(s * 1.66, FY + 0.35, -0.18), b = new THREE.Vector3(s * 2.44, 1.05, -0.18), d = b.clone().sub(a);
    woodY.add(rbox(d.length(), 0.08, 0.03, 0.015), 'woodDark', a.clone().add(b).multiplyScalar(0.5).toArray(), [0, 0, Math.atan2(d.y, d.x)], [1, 1, 1], 0.004);
  }
  // Querbalken auf den Kapitellen, Kopfbänder, Nägel; Schild obenauf
  const beamY = colTop + 0.18 + 0.13;
  woodY.add(rbox(5.1, 0.26, 0.2, 0.06), 'wood', [0, beamY, -0.4], [0, 0, 0.006], [1, 1, 1], 0.008, null, 5);
  for (const s of [-1, 1]) { woodY.add(rbox(0.38, 0.08, 0.12, 0.03), 'wood', [s * 1.52, colTop + 0.05, -0.4], [0, 0, -s * 0.78], [1, 1, 1], 0.004); for (const dy of [-0.06, 0.06]) clay.add(new THREE.SphereGeometry(0.018, 8, 6), 'nail', [s * 2.38, beamY + dy, -0.502], [0, 0, 0], [1, 1, 0.5], 0); }
  const signY = beamY + 0.13 + 0.3;
  for (const s of [-1, 1]) woodY.add(rbox(0.05, 0.22, 0.04, 0.015), 'woodDark', [s * 0.5, beamY + 0.2, -0.41], [0, 0, s * 0.03], [1, 1, 1], 0.003);
  clay.add(rbox(1.5, 0.48, 0.06, 0.1), 'signBoard', [0, signY, -0.42], [0, 0, -0.02], [1, 1, 1], 0.006);
  const signCv = document.createElement('canvas'); signCv.width = 768; signCv.height = 192; const signTex = new THREE.CanvasTexture(signCv); signTex.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.34, 0.335), new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.9 })); sign.position.set(0, signY, -0.455); sign.rotation.set(0, Math.PI, 0.02); sign.name = 'painted-sign'; sign.receiveShadow = true;
  // Schmuckvorhang: Rückenbrett, drei Wülste je Bogen (Knet-Würste), Ohren an den Enden, Rosetten, Knetkugel-Quasten, eine lose
  const vz = -0.2, vTop = colTop + 0.13;
  clay.add(rbox(3.34, 0.42, 0.06, 0.03), 'valanceDark', [0, vTop - 0.17, -0.15], [0, 0, 0], [1, 1, 1], 0.004);
  const xs = [-1.62, -0.54, 0.54, 1.62];
  for (let k = 0; k < 3; k++) for (let j = 0; j < 3; j++) {
    const a = xs[k], b = xs[k + 1], sag = 0.13 + j * 0.07, rad = 0.072 - j * 0.008, y0 = vTop - 0.04 - j * 0.035, pts = [];
    for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push(new THREE.Vector3(a + (b - a) * t, y0 - sag * 4 * t * (1 - t), vz - j * 0.018 - 0.04 * Math.sin(Math.PI * t))); }
    clay.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 30, rad, 10, false), 'valance', [0, 0, 0], [0, 0, 0], [1, 1, 1], 0.01, null, 11);
  }
  for (const s of [-1, 1]) clay.add(new THREE.CapsuleGeometry(0.075, 0.42, 6, 12), 'valance', [s * 1.6, vTop - 0.38, vz - 0.02], [0, 0, s * 0.07], [1, 1, 0.65], 0.012, null, 11);
  for (const x of xs) { clay.add(new THREE.SphereGeometry(0.075, 14, 10), 'tassel', [x, vTop - 0.05, vz - 0.07], [0, 0, 0], [1, 1, 0.6], 0.006); clay.add(new THREE.TorusGeometry(0.08, 0.017, 8, 20), 'cord', [x, vTop - 0.05, vz - 0.075], [0, 0, 0], [1, 1, 1], 0.003); }
  for (const [x, L, tilt] of [[-0.54, 0.3, 0], [0.54, 0.42, 0.34]]) {
    const P = M4([x, vTop - 0.1, vz - 0.09], [0, 0, tilt]);
    clay.add(new THREE.CylinderGeometry(0.008, 0.008, L, 6), 'cord', [0, -L / 2, 0], [0, 0, 0], [1, 1, 1], 0, P);
    clay.add(new THREE.SphereGeometry(0.042, 12, 10), 'tassel', [0, -L - 0.02, 0], [0, 0, 0], [1, 1, 1], 0.004, P);
    clay.add(new THREE.ConeGeometry(0.048, 0.11, 12, 2), 'tassel', [0, -L - 0.095, 0], [0, 0, 0], [1, 1, 1], 0.006, P);
    clay.add(new THREE.TorusGeometry(0.03, 0.009, 6, 14), 'cord', [0, -L - 0.045, 0], [Math.PI / 2, 0, 0], [1, 1, 1], 0, P);
  }

  const look = new THREE.Group(); look.name = 'clay-look';
  const cM = clayMat(), wX = woodMat('x'), wY = woodMat('y');
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
    railM.userData.u.value.set(p.woodDark); ringM.userData.u.value.set(p.nail);
    if (mask && mask.material.color) mask.material.color.set(p.valanceDark).multiplyScalar(0.35);
    lampMats.forEach(m => m.color.set(p.bulbOn).multiplyScalar(0.35 + 0.65 * level));
    paintSign(p);
  }
  setPalette(pal);
  const tris = meshes.reduce((a, m) => a + m.geometry.attributes.position.count / 3, 0);
  return {
    group: look, setPalette,
    setFootlights(l) { level = l; curtain.setFootlights(l); lampMats.forEach(m => m.color.set(P.bulbOn).multiplyScalar(0.35 + 0.65 * l)); },
    setDecals(b) { U.decal.value = b ? 1 : 0; }, setAge(a) { U.age.value = a; }, setSign(b) { sign.visible = b; },
    stats: { tris: Math.round(tris), parts: meshes.map(m => m.userData.ranges.length).reduce((a, b) => a + b, 0), meshes: meshes.length + 2 },
    dispose() { meshes.forEach(m => m.geometry.dispose()); mats.forEach(m => m.dispose()); signTex.dispose(); }
  };
}
