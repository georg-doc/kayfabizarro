/* KFB · Scholle v7 · Bank (03.10.2026) — Konzept: KONZEPT_SCHOLLE_v7.md
 * EIN Mesh je Insel, keine Bodenplatte als eigenes Teil:
 *   Oberseite (flach, Farbbänder) → Rand (senkrecht, Oberflächenfarbe) → Felskörper (facettierter, umgedrehter Kegelstumpf) → Hauptspitze.
 * Felskörper = Ringe des Umrisses, um den Schwerpunkt geschrumpft, nach unten weniger Ecken (zipper-Triangulation), Ecken einzeln versetzt.
 * Zacken = Ecken des vorletzten Rings, nach unten gezogen. Nichts angesetzt.
 * Knete: Facetten zuerst, dann unterteilen + Taubin-Glättung (Oberseite fest) → weich über den Facetten. soft = 0 zeigt die rohen Facetten. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const rng = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const lerp = (a, b, t) => a + (b - a) * t, clamp = (x, a, b) => Math.min(b, Math.max(a, x));

/* Vorlagen = Benchmarks, abgelesen in KONZEPT_SCHOLLE_v7 §1. Maße relativ zu Ø = 40 m.
   elev = sin(Blickwinkel) = Höhe/Breite der Oberseiten-Ellipse im Benchmark. depth = WAHRE Tiefe/Ø = (sichtbare Tiefe/Ø + elev/2) / cos — die vordere Kante verdeckt einen Teil.
   depth Tiefe/Ø · rim Randdicke/Ø · inset Körper oben eingerückt · c Schulter (Anteil der linearen Verjüngung, Rest u^4) · zack Zahl der Zacken · zackD Zackenlänge/Tiefe
   off Spitzenversatz/Ø · lobes [Frequenz, Amplitude] des Umrisses · bands Oberseite [bis u, Farbe] von innen nach außen · body Felsfarbe */
/* Ziel-Silhouetten der Benchmarks (benchmark-silhouetten.json): dv = sichtbare Tiefe/Breite, prof = Breite je Zehntel der sichtbaren Tiefe */
export const TARGET = {"I":{"top":0.149,"body":0.294,"prof":[0.78,0.73,0.69,0.63,0.59,0.54,0.5,0.44,0.38,0.26,0.01],"est":"wie C (Kante im Bild nicht trennbar)"},"D":{"top":0.152,"body":0.259,"prof":[0.75,0.67,0.61,0.56,0.5,0.44,0.41,0.34,0.28,0.19,0.04],"est":null},"C":{"top":0.149,"body":0.294,"prof":[0.78,0.73,0.69,0.63,0.59,0.54,0.5,0.44,0.38,0.26,0.01],"est":null},"B":{"top":0.138,"body":0.217,"prof":[0.63,0.56,0.49,0.43,0.4,0.34,0.3,0.26,0.22,0.16,0.01],"est":null},"A":{"top":0.117,"body":0.305,"prof":[0.78,0.7,0.64,0.57,0.51,0.44,0.38,0.32,0.26,0.18,0.04],"est":null},"E":{"top":0.163,"body":0.264,"prof":[0.78,0.7,0.63,0.58,0.51,0.46,0.41,0.37,0.28,0.18,0.01],"est":null},"F":{"top":0.153,"body":0.213,"prof":[0.61,0.54,0.49,0.44,0.39,0.35,0.31,0.27,0.22,0.14,0.03],"est":null},"G":{"top":0.15,"body":0.25,"prof":[0.78,0.7,0.64,0.57,0.51,0.44,0.38,0.32,0.26,0.18,0.04],"est":"geschätzt (Eisband = Körperfarbe)"}};
export const PRESETS = [
  { id: 'I', label: 'Hütte', ref: 'uploads/DioramaScenes I - 0c4d0f79-b02d-4a85-9811-1ca307f8974b.webp', elev: 0.34, depth: 0.50, prof: [1, 0.94, 0.88, 0.81, 0.76, 0.69, 0.64, 0.56, 0.49, 0.33, 0.01], rim: 0.025, inset: 0.03, c: 0.45, saw: 0.05, zack: 4, zackD: 0.38, off: 0.04, lobes: [[5, 0.03], [9, 0.02]], bands: [[1, '#79cf31']], body: '#d9852c', seed: 11 },
  { id: 'D', label: 'Food Point', ref: 'uploads/DioramaScenes  D - 5e276cfd-5eda-469d-9652-af266a222d3f.webp', elev: 0.25, depth: 0.45, prof: [1, 0.89, 0.81, 0.75, 0.67, 0.59, 0.55, 0.45, 0.37, 0.25, 0.05], rim: 0.025, inset: 0.02, c: 0.85, saw: 0.05, zack: 3, zackD: 0.32, off: 0.05, lobes: [[4, 0.05], [7, 0.05]], bands: [[1, '#5fbf2b']], body: '#8f5524', seed: 23 },
  { id: 'C', label: 'Garten', ref: 'uploads/DioramaScenes C - f407e0ec-6a50-4d05-922f-4fe6a3a7bbe5.webp', elev: 0.32, depth: 0.48, prof: [1, 0.94, 0.88, 0.81, 0.76, 0.69, 0.64, 0.56, 0.49, 0.33, 0.01], rim: 0.028, inset: 0.05, c: 0.5, saw: 0.05, zack: 5, zackD: 0.32, off: 0.03, lobes: [[3, 0.05], [8, 0.035]], bands: [[1, '#6ccb35']], body: '#7c4a26', seed: 37 },
  { id: 'B', label: 'Wald', ref: 'uploads/DioramaScenes B - d896911c-fe15-4513-a6c0-39acb566b525.webp', elev: 0.25, depth: 0.39, prof: [1, 0.89, 0.78, 0.68, 0.63, 0.54, 0.48, 0.41, 0.35, 0.25, 0.02], rim: 0.015, inset: 0.03, c: 0.55, saw: 0.05, zack: 6, zackD: 0.42, off: 0.02, lobes: [[5, 0.06], [11, 0.04]], bands: [[1, '#2fbf69']], body: '#ea9238', seed: 41 },
  { id: 'A', label: 'Leuchtturm', ref: 'uploads/DioramaScenes A - 02140151-94ad-40d7-8692-e490ba476193.webp', elev: 0.26, depth: 0.46, prof: [1, 0.9, 0.82, 0.73, 0.65, 0.56, 0.49, 0.41, 0.33, 0.23, 0.05], rim: 0.05, inset: 0.06, c: 0.9, saw: 0.05, zack: 2, zackD: 0.22, off: 0.03, lobes: [[3, 0.04], [7, 0.03]], bands: [[0.45, '#4f8a4a'], [0.72, '#efe7d1'], [1, '#7e8481']], body: '#3b2b21', seed: 53 },
  { id: 'E', label: 'Strand', ref: 'uploads/DioramaScenes E - 8d2407f5-d595-4539-922e-b892c50ba8c6.webp', elev: 0.36, depth: 0.47, prof: [1, 0.9, 0.81, 0.74, 0.65, 0.59, 0.53, 0.47, 0.36, 0.23, 0.01], rim: 0.05, inset: 0.05, c: 0.95, saw: 0.05, zack: 2, zackD: 0.22, off: 0.05, lobes: [[2, 0.04], [6, 0.02]], bands: [[0.35, '#8fd247'], [0.5, '#c79a6c'], [1, '#86dcc8']], body: '#b78849', seed: 67 },
  { id: 'F', label: 'Wüste', ref: 'uploads/DioramaScenes F - 405f6e29-dbfb-483b-8bad-41f0eb82a117.webp', elev: 0.32, depth: 0.41, prof: [1, 0.89, 0.8, 0.72, 0.64, 0.57, 0.51, 0.44, 0.36, 0.23, 0.05], rim: 0.02, inset: 0.25, c: 1, saw: 0.05, zack: 3, zackD: 0.28, off: 0.06, lobes: [[3, 0.06], [9, 0.04]], bands: [[0.62, '#ecd49a'], [1, '#6fb6e6']], body: '#b9492a', seed: 79 },
  { id: 'G', label: 'Schnee', ref: 'uploads/DioramaScenes G - 2454417d-2ac4-45e6-a875-5f08a00118b9.webp', elev: 0.3, depth: 0.45, prof: [1, 0.9, 0.82, 0.73, 0.65, 0.56, 0.49, 0.41, 0.33, 0.23, 0.05], rim: 0.06, inset: 0.08, c: 0.85, saw: 0.05, zack: 4, zackD: 0.45, off: 0.04, lobes: [[3, 0.05], [8, 0.03]], bands: [[0.7, '#eef2f6'], [1, '#43c6dd']], body: '#8ea6cf', seed: 97 }
];

/* ---------- Geometrie ---------- */
export function buildScholle(pr, { soft = 2, Dm = 40 } = {}) {
  const t0 = performance.now(), R = rng(pr.seed * 7919 + 3), R0 = Dm / 2;
  const ph = pr.lobes.map(() => R() * Math.PI * 2);
  const rOut = th => R0 * (1 + pr.lobes.reduce((s, [f, a], k) => s + a * Math.sin(th * f + ph[k]), 0));
  const P = [], C = [], idx = [], pin = [];
  const v = (x, y, z, col, pinned = false) => { P.push(x, y, z); C.push(col); pin.push(pinned); return P.length / 3 - 1; };
  const n0 = 32, ang = [...Array(n0).keys()].map(i => (i + (R() - 0.5) * 0.35) / n0 * Math.PI * 2);
  // Oberseite: Mitte + Bänder (je Band zwei Ringe dicht beieinander → klare Farbgrenze)
  const bandCol = u => { for (const [lim, c] of pr.bands) if (u <= lim + 1e-6) return c; return pr.bands[pr.bands.length - 1][1]; };
  const us = []; pr.bands.forEach(([lim], k) => { if (k < pr.bands.length - 1) us.push([lim - 0.012, pr.bands[k][1]], [lim + 0.012, pr.bands[k + 1][1]]); });
  const topU = [[0.3, bandCol(0.3)], [0.65, bandCol(0.65)], ...us].sort((a, b) => a[0] - b[0]).filter((x, i, a) => !i || x[0] - a[i - 1][0] > 0.005);
  topU.push([1, pr.bands[pr.bands.length - 1][1]]);
  const centre = v(0, 0, 0, bandCol(0), true), ringIdx = [];
  for (const [u, col] of topU) ringIdx.push(ang.map(a => v(Math.cos(a) * rOut(a) * u, 0, Math.sin(a) * rOut(a) * u, col, u < 0.999)));
  for (let i = 0; i < n0; i++) idx.push(centre, ringIdx[0][(i + 1) % n0], ringIdx[0][i]);
  const strip = (A, B) => { for (let i = 0; i < n0; i++) { const j = (i + 1) % n0; idx.push(A[i], A[j], B[i], A[j], B[j], B[i]); } };
  for (let k = 0; k < ringIdx.length - 1; k++) strip(ringIdx[k], ringIdx[k + 1]);
  // Rand: senkrecht in Oberflächenfarbe
  const rimT = pr.rim * Dm, edgeCol = pr.bands[pr.bands.length - 1][1], top = ringIdx[ringIdx.length - 1];
  const rimB = ang.map(a => v(Math.cos(a) * rOut(a) * 1.005, -rimT, Math.sin(a) * rOut(a) * 1.005, edgeCol)); strip(top, rimB);
  // Felskörper: Ringe mit abnehmender Eckzahl, Zentrum wandert vom Schwerpunkt zur Spitze
  const D = pr.depth * Dm, oa = R() * Math.PI * 2, apexXZ = [Math.cos(oa) * pr.off * Dm, Math.sin(oa) * pr.off * Dm];
  /* Profil: KEINE Formel mehr. Breite je Tiefe aus den Benchmark-Silhouetten gemessen → V-förmig, leicht hohl (schnell schmal, dann langer Zapfen).
     Meine erste Ablesung (breite Schulter) war falsch. Tiefe D/Ø = sichtbare Tiefe / cos(Blickwinkel). */
  // GEMESSEN (benchmark-silhouetten.json): Silhouettenbreite je Zehntel der Tiefe, aus dem Benchmark-Bild freigestellt (Flood-Fill vom Hintergrund)
  const shape = u => { const f = clamp(u, 0, 1) * 10, i = Math.min(9, Math.floor(f)); return Math.max(0.03, lerp(pr.prof[i], pr.prof[i + 1], f - i)); };
  const rings = [{ n: n0, u: 0 }, { n: 16, u: 0.1 }, { n: 13, u: 0.25 }, { n: 10, u: 0.42 }, { n: 8, u: 0.6 }, { n: 6, u: 0.76 }, { n: 4, u: 0.9 }];
  const bodyCol = u => { const c = new THREE.Color(pr.body); c.multiplyScalar(1 - 0.12 * u); return '#' + c.getHexString(); };
  let prev = rimB, prevA = ang; const ringV = [];
  rings.forEach((rg, k) => { const s = k === 0 ? 1 - pr.inset * 0.3 : shape(rg.u), cx = apexXZ[0] * rg.u, cz = apexXZ[1] * rg.u;
    const A = k === 0 ? ang : [...Array(rg.n).keys()].map(i => (i + 0.5 * k + (R() - 0.5) * 0.5) / rg.n * Math.PI * 2);
    const low = rg.u > 0.5, jr = k === 0 ? 0.02 : low ? 0.18 : 0.07, jy = k === 0 ? 0.01 : low ? 0.1 : 0.04;
    const ids = A.map((a, i) => { const sw = rg.u > 0.6 ? pr.saw * (i % 2 ? 0.35 + 0.3 * R() : 0.75 + 0.5 * R()) * (rg.u > 0.8 ? 1 : 0.6) : 0;   // Sägezahn: lange und kurze Zacken im Wechsel
      const r = rOut(a) * s * (1 + (R() - 0.5) * 2 * jr) * (1 - 0.35 * sw), y = -rimT - (k === 0 ? 0.04 * D : rg.u * D) + (R() - 0.5) * 2 * jy * D - sw * D;
      return v(cx + Math.cos(a) * r, y, cz + Math.sin(a) * r, bodyCol(rg.u)); });
    if (k === 0) strip(prev, ids); else zip(prev, prevA, ids, A);
    ringV.push({ ids, A }); prev = ids; prevA = A; });
  // Zacken: Ecken des vorletzten und letzten Rings nach unten ziehen, nach innen etwas einziehen (Spitze zeigt senkrecht)
  const zr = [...ringV[ringV.length - 1].ids, ...ringV[ringV.length - 2].ids].sort(() => R() - 0.5).slice(0, pr.zack);
  const apexY = -rimT - D; for (const id of zr) { P[id * 3 + 1] = Math.max(apexY + 0.05 * D, P[id * 3 + 1] - pr.zackD * D * (0.7 + 0.6 * R())); /* Hauptspitze bleibt am tiefsten */ P[id * 3] = lerp(P[id * 3], apexXZ[0], -0.04); P[id * 3 + 2] = lerp(P[id * 3 + 2], apexXZ[1], -0.04); pin[id] = 'z'; }
  const apex = v(apexXZ[0], -rimT - D, apexXZ[1], bodyCol(1)); const L = ringV[ringV.length - 1].ids; for (let i = 0; i < L.length; i++) idx.push(L[i], L[(i + 1) % L.length], apex);
  function zip(Aid, Aa, Bid, Ba) {   // zwei Ringe mit unterschiedlicher Eckzahl, nach Winkel verzahnt
    const norm = a => ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2), a0 = Aa.map(norm), b0 = Ba.map(norm);
    const oA = [...a0.keys()].sort((p, q) => a0[p] - a0[q]), oB = [...b0.keys()].sort((p, q) => b0[p] - b0[q]);
    let i = 0, j = 0; const nA = oA.length, nB = oB.length;
    while (i < nA || j < nB) { const ai = Aid[oA[i % nA]], bj = Bid[oB[j % nB]], an = a0[oA[(i + 1) % nA]] + (i + 1 >= nA ? Math.PI * 2 : 0), bn = b0[oB[(j + 1) % nB]] + (j + 1 >= nB ? Math.PI * 2 : 0);
      if (j >= nB || (i < nA && an <= bn)) { idx.push(ai, Aid[oA[(i + 1) % nA]], bj); i++; } else { idx.push(ai, Bid[oB[(j + 1) % nB]], bj); j++; } } }
  let geo = toGeo(P, C, idx), facets = idx.length / 3;
  if (soft > 0) geo = soften(geo, pin, soft);
  geo.computeBoundingBox(); const bb = geo.boundingBox;
  return { geo, info: { id: pr.id, D: +(bb.max.y - bb.min.y - rimT).toFixed(1), Dm, ratio: +((bb.max.y - bb.min.y - rimT) / Dm).toFixed(2), facets, tris: (geo.index ? geo.index.count : geo.attributes.position.count) / 3, zack: pr.zack, off: +(Math.hypot(...apexXZ) / Dm * 100).toFixed(1), ms: +(performance.now() - t0).toFixed(1) } };
}
function toGeo(P, C, idx) { const g = new THREE.BufferGeometry(), col = new Float32Array(C.length * 3), c = new THREE.Color();
  C.forEach((h, i) => { c.set(h); col.set([c.r, c.g, c.b], i * 3); }); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setIndex(idx); return g; }

/* Knete: Mittelpunkt-Unterteilung (Kanten geteilt) + Taubin λ/μ. Oberseite (pin) bleibt eben. */
function soften(g, pin, levels) {
  let pos = Array.from(g.attributes.position.array), col = Array.from(g.attributes.color.array), idx = Array.from(g.index.array), pn = pin.slice();
  for (let l = 0; l < levels; l++) { const mid = new Map(), ni = [];
    const m = (a, b) => { const k = a < b ? a + '_' + b : b + '_' + a; if (mid.has(k)) return mid.get(k); const n = pos.length / 3;
      for (let d = 0; d < 3; d++) { pos.push((pos[a * 3 + d] + pos[b * 3 + d]) / 2); col.push((col[a * 3 + d] + col[b * 3 + d]) / 2); } pn.push(pn[a] === true && pn[b] === true); mid.set(k, n); return n; };
    for (let t = 0; t < idx.length; t += 3) { const a = idx[t], b = idx[t + 1], c = idx[t + 2], ab = m(a, b), bc = m(b, c), ca = m(c, a); ni.push(a, ab, ca, ab, b, bc, ca, bc, c, ab, bc, ca); } idx = ni; }
  const n = pos.length / 3, nb = Array.from({ length: n }, () => new Set());
  for (let t = 0; t < idx.length; t += 3) for (let e = 0; e < 3; e++) { const a = idx[t + e], b = idx[t + (e + 1) % 3]; nb[a].add(b); nb[b].add(a); }
  const N = nb.map(s => [...s]), step = f => { const o = pos.slice(); for (let i = 0; i < n; i++) { if (pn[i] === true) continue; const ns = N[i], w = pn[i] === 'z' ? 0.35 : 1; let x = 0, y = 0, z = 0; for (const j of ns) { x += o[j * 3]; y += o[j * 3 + 1]; z += o[j * 3 + 2]; } const k = ns.length || 1;
    pos[i * 3] += w * f * (x / k - o[i * 3]); pos[i * 3 + 1] += w * f * (y / k - o[i * 3 + 1]); pos[i * 3 + 2] += w * f * (z / k - o[i * 3 + 2]); } };
  for (let it = 0; it < 1 + levels; it++) { step(0.5); step(-0.53); }   // wenig glätten: Facetten bleiben lesbar, Kanten werden rund
  const out = new THREE.BufferGeometry(); out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); out.setIndex(idx); out.computeVertexNormals(); return out; }

/* ---------- Bühne: ein Renderer, 8 Kacheln per Scissor, Fokus = eine Kachel groß mit Orbit ---------- */
export function boot(canvas, getTiles, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true }); renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setScissorTest(true); renderer.shadowMap.enabled = false;
  let soft = opts.soft ?? 2, spin = opts.spin ?? true, focus = -1, items = [];
  // Licht wie die Benchmarks: Schlüssel von vorn oben, warmes Gegenlicht von unten (die Unterseite leuchtet, sie säuft nicht ab)
  const mkScene = () => { const s = new THREE.Scene(); s.add(new THREE.HemisphereLight('#f4efe6', '#c79066', 0.75)); const d = new THREE.DirectionalLight('#fff3e2', 2.1); d.position.set(25, 45, 60); s.add(d);
    const b = new THREE.DirectionalLight('#ffc89a', 1.3); b.position.set(-10, -40, 30); s.add(b); const f = new THREE.DirectionalLight('#dfe8ff', 0.5); f.position.set(-50, 10, -20); s.add(f); return s; };
  const build = () => { items.forEach(it => it.mesh.geometry.dispose()); items = PRESETS.map(pr => { const { geo, info } = buildScholle(pr, { soft }); if (items._sil && items._sil[pr.id]) info.sil = items._sil[pr.id]; const scene = mkScene();
      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82, metalness: 0, flatShading: soft === 0 })); scene.add(mesh);
      const cam = new THREE.PerspectiveCamera(30, 1, 0.5, 500); return { pr, info, scene, mesh, cam }; }); };
  build();
  const ctl = new OrbitControls(new THREE.PerspectiveCamera(30, 1, 0.5, 500), canvas); ctl.enabled = false; ctl.target.set(10, -12, 0); ctl.object.position.set(10, 14, 100);   // Ziel nach rechts versetzt: links bleibt frei, die Info steht unten rechts
  const resize = () => { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();
  let raf = 0; const t0 = performance.now();
  const loop = () => { raf = requestAnimationFrame(loop); const cr = canvas.getBoundingClientRect(), H = canvas.clientHeight, tiles = getTiles(), t = (performance.now() - t0) / 1000;
    renderer.setScissor(0, 0, canvas.clientWidth, H); renderer.setViewport(0, 0, canvas.clientWidth, H); renderer.setClearColor('#3b3f45'); renderer.clear();
    const draw = (it, r, cam) => { const x = r.left - cr.left, y = H - (r.bottom - cr.top), w = r.width, h = r.height; if (w < 2 || h < 2) return; renderer.setScissor(x, y, w, h); renderer.setViewport(x, y, w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); renderer.render(it.scene, cam); };
    if (focus >= 0 && items[focus]) { ctl.update(); draw(items[focus], cr, ctl.object); return; }
    items.forEach((it, i) => { const el = tiles[i]; if (!el) return; const a = (spin ? t * 0.25 : 0) + 0.6, e = Math.asin(clamp(it.pr.elev, 0.05, 0.9)), dd = 112, ty = -it.info.D * 0.28; it.cam.position.set(Math.sin(a) * dd * Math.cos(e), ty + Math.sin(e) * dd, Math.cos(a) * dd * Math.cos(e)); it.cam.lookAt(0, ty, 0);   // gleicher Blickwinkel wie der Benchmark
      draw(it, el.getBoundingClientRect(), it.cam); }); };
  loop();
  /* Messen statt glauben: eigene Insel mit Benchmark-Kamera rendern, Silhouette genauso freistellen wie im Benchmark, vergleichen, nachführen. */
  const rt = new THREE.WebGLRenderTarget(480, 270), buf = new Uint8Array(480 * 270 * 4);
  /* Gleiche Messung wie an den Benchmark-Bildern: yW = breiteste Zeile, yF = Vorderkante (erste Zeile in Körperfarbe, Median über 13 Spalten), yB = Spitze.
     top = (yF − yW)/W ergibt den Blickwinkel · body = (yB − yF)/W ergibt die Tiefe · prof = Breite je Zehntel des Körpers. */
  const camFor = (it, cam) => { const a = 0.6, e = Math.asin(clamp(it.pr.elev, 0.05, 0.9)), dd = 112, ty = -it.info.D * 0.28; cam.position.set(Math.sin(a) * dd * Math.cos(e), ty + Math.sin(e) * dd, Math.cos(a) * dd * Math.cos(e)); cam.lookAt(0, ty, 0); };
  // Eigene Messung über Masken-Material (Oberseite+Rand weiß, Körper rot) statt Farbsuche: eindeutig, kein Rückkopplungsfehler
  const maskMat = new THREE.ShaderMaterial({ uniforms: { uCut: { value: 0 } }, vertexShader: 'varying float vy; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vy = w.y; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: 'uniform float uCut; varying float vy; void main(){ gl_FragColor = vy > uCut ? vec4(1.0) : vec4(1.0, 0.0, 0.0, 1.0); }', side: THREE.DoubleSide });
  const silhouette = it => { const cam = it.cam.clone(); maskMat.uniforms.uCut.value = -it.pr.rim * 40 - 0.25; it.scene.overrideMaterial = maskMat; cam.aspect = 16 / 9; cam.updateProjectionMatrix(); camFor(it, cam);
    renderer.setRenderTarget(rt); renderer.setScissorTest(false); renderer.setViewport(0, 0, 480, 270); renderer.setClearColor('#000000', 0); renderer.clear(); renderer.render(it.scene, cam); it.scene.overrideMaterial = null; renderer.readRenderTargetPixels(rt, 0, 0, 480, 270, buf); renderer.setRenderTarget(null); renderer.setScissorTest(true);
    const W = 480, H = 270, o = (x, y) => ((H - 1 - y) * W + x) * 4, on = (x, y) => buf[o(x, y) + 3] > 0, red = (x, y) => { const p = o(x, y); return buf[p + 3] > 0 && buf[p + 1] < 80; }, rows = [];
    for (let y = 0; y < H; y++) { let l = -1, r = -1; for (let x = 0; x < W; x++) if (on(x, y)) { if (l < 0) l = x; r = x; } rows.push(l < 0 ? null : [l, r]); }
    let wMax = 0, yW = 0, yB = 0; rows.forEach((r, y) => { if (r && r[1] - r[0] > wMax) { wMax = r[1] - r[0]; yW = y; } if (r) yB = y; });
    const xc = Math.round((rows[yW][0] + rows[yW][1]) / 2), fr = [];
    for (let k = -6; k <= 6; k++) { const x = xc + Math.round(k * wMax * 0.025); for (let y = yW; y <= yB; y++) if (red(x, y)) { fr.push(y); break; } }
    fr.sort((p, q) => p - q); const yF = fr.length ? fr[Math.floor(fr.length / 2)] : yW, prof = [];
    for (let k = 0; k <= 10; k++) { const r = rows[Math.round(yF + (yB - yF) * k / 10)]; prof.push(r ? (r[1] - r[0]) / wMax : 0); }
    return { top: (yF - yW) / wMax, body: (yB - yF) / wMax, prof }; };
  const calibrate = (rounds = 5) => { for (let n = 0; n < rounds; n++) { items.forEach(it => { const t = TARGET[it.pr.id]; if (!t) return; const m = silhouette(it);
      it.pr.elev = clamp(it.pr.elev * clamp(t.top / Math.max(0.02, m.top), 0.8, 1.25), 0.08, 0.7);
      it.pr.depth *= clamp(t.body / Math.max(0.03, m.body), 0.75, 1.35);
      for (let k = 1; k < 10; k++) it.pr.prof[k] = clamp(it.pr.prof[k] * clamp((t.prof[k] + 0.03) / (m.prof[k] + 0.03), 0.75, 1.3), 0.03, 1); }); build(); }
    items.forEach(it => { const t = TARGET[it.pr.id], m = silhouette(it); it.info.sil = { top: +m.top.toFixed(3), topT: t.top, body: +m.body.toFixed(3), bodyT: t.body, err: +(m.prof.reduce((q, v, k) => q + Math.abs(v - t.prof[k]), 0) / 11).toFixed(3), elev: Math.round(Math.asin(it.pr.elev) * 180 / Math.PI), est: t.est }; }); };
  calibrate(0);   // Nachführung AUS: lief nicht zusammen (siehe RETURN 15). Messwerte werden nur angezeigt.
  return { infos: () => items.map(it => it.info), calibrate, setSoft(v) { const keep = Object.fromEntries(items.map(it => [it.pr.id, it.info.sil])); soft = v; build(); items._sil = keep; items.forEach(it => it.info.sil = keep[it.pr.id]); }, setSpin(v) { spin = v; },
    setFocus(i) { focus = i; ctl.enabled = i >= 0; }, dispose() { cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); } };
}
