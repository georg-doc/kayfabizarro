/* KFB Joyride Atlas M01 · Richtung C · Atlas mit Pop-ups (29.09.)
 * Liest EIN Rezept (lab-world/joyride-atlas.m01.json). Das Blatt ist die Welt: bedruckte Wellpappe, Regionen als
 * ausgeschnittene Puzzleteile, Straßen als Kreppband, Rhein als Cellophan. Pockets steigen bei Kameranähe aus dem
 * Blatt (Präsentation am Pivot-Wrapper, Rezept bleibt unberührt). Lesarten A/B/C lesen dasselbe Rezept.
 * Donoren: Free Roam S04 (Kenney-Maßstab ×8, Garage), Road Family Atlas (Rampe, Looping), KayKit BoardGameBits,
 * KayKit City Bits (Auto), K2-Knete lab-clay v10 unverändert, bb-scene.js renderCardQuarter (KFB-Karte).
 * Keine Physik, keine Eingabe-/Kamera-Ownership über diese Vorschau hinaus. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { makeClayRelief } from '../lab-clay/clay-relief.v2.js';
import { makeClayUniforms, makeClayMaterial, seedGeometry } from '../lab-clay/clay-material.v10.js?r=2';

const clamp = (x, a, b) => Math.min(b, Math.max(a, x)), lerp = (a, b, t) => a + (b - a) * t;
const sst = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const inPoly = (x, z, P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, zi] = P[i], [xj, zj] = P[j]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c; } return c; };
const segD = (x, z, A, B) => { const ex = B[0] - A[0], ez = B[1] - A[1], t = clamp(((x - A[0]) * ex + (z - A[1]) * ez) / (ex * ex + ez * ez || 1), 0, 1); return Math.hypot(x - A[0] - ex * t, z - A[1] - ez * t); };
const lineD = (x, z, P) => { let d = Infinity; for (let i = 0; i < P.length - 1; i++) d = Math.min(d, segD(x, z, P[i], P[i + 1])); return d; };
const TAG = { STATIC: '#6d737d', AMBIENT_REACTIVE: '#0e8f73', SCRIPTED_REACTIVE: '#5d4cff', PHYSICS_HERO: '#d9480f' };
const TAGS = { STATIC: 'STATIC', AMBIENT_REACTIVE: 'AMBIENT', SCRIPTED_REACTIVE: 'SCRIPTED', PHYSICS_HERO: 'PHYSICS' };

/* ---------------- Leinwand-Texturen ---------------- */
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function texOf(c, rep) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; } return t; }
function speckle(g, W, H, n, seed, k = 1) { const r = rng(seed); for (let i = 0; i < n; i++) { g.fillStyle = r() < 0.5 ? `rgba(70,50,30,${(0.03 + r() * 0.06) * k})` : `rgba(255,250,240,${(0.04 + r() * 0.07) * k})`; g.fillRect(r() * W, r() * H, 1 + r() * 2.5, 1 + r() * 2.5); } }

function makePrint(R, plain, font) {
  const W = 2048, H = Math.round(W * R.board.size[1] / R.board.size[0]), [c, g] = canvas(W, H), P = R.palette;
  const [BW, BH] = R.board.size, X = x => (x + BW / 2) / BW * W, Y = z => (z + BH / 2) / BH * H, S = m => m / BW * W;
  g.fillStyle = plain ? '#c7a574' : '#eadbbd'; g.fillRect(0, 0, W, H); speckle(g, W, H, 14000, 2);
  const path = pts => { g.beginPath(); pts.forEach(([x, z], i) => i ? g.lineTo(X(x), Y(z)) : g.moveTo(X(x), Y(z))); };
  const smooth = pts => { g.beginPath(); g.moveTo(X(pts[0][0]), Y(pts[0][1])); for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, mz = (pts[i][1] + pts[i + 1][1]) / 2; g.quadraticCurveTo(X(pts[i][0]), Y(pts[i][1]), X(mx), Y(mz)); } const L = pts[pts.length - 1]; g.lineTo(X(L[0]), Y(L[1])); };
  for (const rg of R.regions) { path(rg.poly); g.closePath(); g.globalAlpha = plain ? 1 : 0.78; g.fillStyle = rg.top; g.fill(); g.globalAlpha = 1;
    if (!plain) { g.setLineDash([S(2.4), S(1.6)]); g.lineWidth = S(0.7); g.strokeStyle = 'rgba(43,38,34,.55)'; g.stroke(); g.setLineDash([]); } }
  if (!plain) { g.save(); for (const rg of R.regions) { path(rg.poly); g.closePath(); g.save(); g.clip(); const r = rng(rg.h * 99 + rg.poly.length);
      g.fillStyle = 'rgba(43,38,34,.07)'; for (let x = 0; x < W; x += 9) for (let y = (x / 9) % 2 ? 4 : 0; y < H; y += 9) g.fillRect(x, y, 2.2, 2.2); g.restore(); } g.restore(); }
  for (const w of R.water) { smooth(w.pts); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = plain ? '#3f9fc4' : '#86c7dd'; g.lineWidth = S(w.w + 3); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = S(0.5); g.setLineDash([S(3), S(4)]); for (const o of [-5, 0, 5]) { g.save(); g.translate(S(o * 0.6), 0); smooth(w.pts); g.stroke(); g.restore(); } g.setLineDash([]); }
  // Falzlinien (physisch, auch in A)
  for (const x of R.board.folds.x) { g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(X(x) - 2, 0, 3, H); g.fillStyle = 'rgba(0,0,0,.13)'; g.fillRect(X(x) + 1, 0, 2, H); }
  for (const z of R.board.folds.z) { g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(0, Y(z) - 2, W, 3); g.fillStyle = 'rgba(0,0,0,.13)'; g.fillRect(0, Y(z) + 1, W, 2); }
  if (!plain) {
    g.strokeStyle = 'rgba(43,38,34,.12)'; g.lineWidth = 1.5; for (let x = -BW / 2 + 60; x < BW / 2; x += 60) { g.beginPath(); g.moveTo(X(x), 0); g.lineTo(X(x), H); g.stroke(); }
    for (let z = -BH / 2 + 60; z < BH / 2; z += 60) { g.beginPath(); g.moveTo(0, Y(z)); g.lineTo(W, Y(z)); g.stroke(); }
    g.fillStyle = 'rgba(43,38,34,.5)'; g.font = `800 ${S(4)}px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    [...R.board.grid.cols].forEach((ch, i) => g.fillText(ch, X(-BW / 2 + 30 + i * 60), Y(-BH / 2 + 4)));
    for (let i = 0; i < R.board.grid.rows; i++) g.fillText(String(i + 1), X(-BW / 2 + 4), Y(-BH / 2 + 30 + i * 60));
    // Pocket-Marken: das Blatt zeigt, wo etwas aufsteigt
    R.pockets.forEach((p, i) => { g.beginPath(); g.arc(X(p.at[0]), Y(p.at[1]), S(12), 0, Math.PI * 2); g.setLineDash([S(1.6), S(1.2)]); g.lineWidth = S(0.6); g.strokeStyle = 'rgba(43,38,34,.7)'; g.stroke(); g.setLineDash([]);
      g.beginPath(); g.arc(X(p.at[0] + 9), Y(p.at[1] - 9), S(3.2), 0, Math.PI * 2); g.fillStyle = P.ink; g.fill(); g.fillStyle = '#fff'; g.font = `900 ${S(3.6)}px ${font}`; g.fillText(String(i + 1), X(p.at[0] + 9), Y(p.at[1] - 9) + S(0.2)); });
    for (const L of R.board.labels) { g.save(); g.translate(X(L.at[0]), Y(L.at[1])); g.rotate((L.rot || 0) * Math.PI / 180); g.font = `900 ${S(L.size)}px ${font}`; g.textAlign = L.align || 'center';
      try { g.letterSpacing = S(L.size * 0.12) + 'px'; } catch (e) {} g.fillStyle = 'rgba(43,38,34,.82)'; g.fillText(L.text, 0, 0); g.restore(); }
    // Kompass
    const cx = X(150), cy = Y(-92); g.beginPath(); g.arc(cx, cy, S(8), 0, Math.PI * 2); g.lineWidth = S(0.5); g.strokeStyle = 'rgba(43,38,34,.6)'; g.stroke();
    g.beginPath(); g.moveTo(cx, cy - S(7)); g.lineTo(cx + S(2.2), cy); g.lineTo(cx, cy + S(7)); g.lineTo(cx - S(2.2), cy); g.closePath(); g.fillStyle = 'rgba(43,38,34,.75)'; g.fill();
    g.font = `900 ${S(3.4)}px ${font}`; g.fillText('N', cx, cy - S(10.5));
  }
  return texOf(c);
}
function makeTape(base, line, rim, chevron) {
  const [c, g] = canvas(128, 256), r = rng(chevron ? 5 : 3);
  g.fillStyle = base; g.fillRect(0, 0, 128, 256);
  for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '0,0,0' : '255,255,255'},${0.03 + r() * 0.05})`; g.fillRect(r() * 128, r() * 256, 1, 4 + r() * 18); }
  if (rim) { g.fillStyle = rim; g.fillRect(6, 0, 10, 256); g.fillRect(112, 0, 10, 256); }
  g.fillStyle = line;
  if (chevron) { for (let y = 0; y < 256; y += 64) { g.beginPath(); g.moveTo(40, y + 36); g.lineTo(64, y + 12); g.lineTo(88, y + 36); g.lineTo(88, y + 50); g.lineTo(64, y + 26); g.lineTo(40, y + 50); g.closePath(); g.fill(); } }
  else { g.fillRect(59, 20, 10, 100); g.fillRect(59, 148, 10, 100); }
  for (let y = 0; y < 256; y += 2) { g.clearRect(0, y, 2 + r() * 5, 2); const w = 2 + r() * 5; g.clearRect(128 - w, y, w, 2); }
  return texOf(c, true);
}
function makeWood(tone, seed) { const [c, g] = canvas(256, 256), r = rng(seed); g.fillStyle = tone; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 60; i++) { const y = r() * 256; g.strokeStyle = `rgba(60,35,15,${0.05 + r() * 0.09})`; g.lineWidth = 1 + r() * 2; g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= 256; x += 32) g.lineTo(x, y + Math.sin(x / 40 + i) * 3); g.stroke(); }
  speckle(g, 256, 256, 800, seed + 1, 0.8); return texOf(c, true); }
function makeFlute() { const [c, g] = canvas(64, 64); g.fillStyle = '#b8925f'; g.fillRect(0, 0, 64, 64); g.fillStyle = 'rgba(80,55,25,.35)'; for (let x = 0; x < 64; x += 8) g.fillRect(x, 0, 3, 64);
  g.fillStyle = '#d5b688'; g.fillRect(0, 0, 64, 6); g.fillRect(0, 58, 64, 6); return texOf(c, true); }

/* ---------------- Silhouetten der Pop-ups ---------------- */
const SIL = {
  dom: [[-20,0],[-20,44],[-18,46],[-14,64],[-10,46],[-8,44],[-8,32],[0,38],[8,32],[8,44],[10,46],[14,64],[18,46],[20,44],[20,0]],
  colonius: [[-2,0],[-1.2,33],[-6,34],[-6.5,37],[-3,40],[-0.6,40.5],[-0.4,50],[0.4,50],[0.6,40.5],[3,40],[6.5,37],[6,34],[1.2,33],[2,0]],
  knapsack: [[-13,0],[-13,14],[-10,14],[-9.5,38],[-7.5,38],[-7,14],[-2,14],[-1.5,34],[0.5,34],[1,14],[6,14],[6.5,30],[8.5,30],[9,14],[13,14],[13,0]]
};
function silTexture(kind, font) {
  const pts = SIL[kind], xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), h = Math.max(...ys), w = x1 - x0;
  const PX = 16, [c, g] = canvas(Math.ceil(w * PX), Math.ceil(h * PX)), X = x => (x - x0) * PX, Y = y => (h - y) * PX;
  g.fillStyle = kind === 'dom' ? '#e9dcc4' : kind === 'colonius' ? '#dfe6e6' : '#e6d6c6'; g.fillRect(0, 0, c.width, c.height); speckle(g, c.width, c.height, 2500, 17);
  g.strokeStyle = 'rgba(43,38,34,.85)'; g.lineWidth = PX * 0.35; g.lineJoin = 'round';
  g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(X(x), Y(y)) : g.moveTo(X(x), Y(y))); g.closePath(); g.save(); g.clip();
  if (kind === 'dom') {
    g.fillStyle = 'rgba(89,131,172,.18)'; g.fillRect(0, 0, c.width, c.height);
    const arch = (cx, by, ww, hh) => { g.beginPath(); g.moveTo(X(cx - ww / 2), Y(by)); g.lineTo(X(cx - ww / 2), Y(by + hh * 0.6)); g.quadraticCurveTo(X(cx - ww / 2), Y(by + hh), X(cx), Y(by + hh)); g.quadraticCurveTo(X(cx + ww / 2), Y(by + hh), X(cx + ww / 2), Y(by + hh * 0.6)); g.lineTo(X(cx + ww / 2), Y(by)); g.stroke(); };
    g.lineWidth = PX * 0.22; for (const tx of [-14, 14]) { for (const [by, hh] of [[4, 10], [17, 9], [29, 8], [39, 5]]) { arch(tx - 2.2, by, 2.4, hh); arch(tx + 2.2, by, 2.4, hh); }
      g.beginPath(); for (let y = 46; y < 62; y += 3) { const k = (64 - y) / 18 * 4; g.moveTo(X(tx - k), Y(y)); g.lineTo(X(tx + k), Y(y)); } g.stroke(); }
    arch(0, 0, 7, 16); arch(0, 0, 4.5, 12); g.beginPath(); g.arc(X(0), Y(24.5), PX * 3.2, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(X(0), Y(24.5), PX * 1.6, 0, Math.PI * 2); g.stroke();
    g.lineWidth = PX * 0.16; for (const x of [-20, -8, 8, 20, -17, -11, 11, 17]) { g.beginPath(); g.moveTo(X(x), 0); g.lineTo(X(x), c.height); g.stroke(); }
  } else if (kind === 'colonius') {
    g.fillStyle = 'rgba(239,90,34,.55)'; g.fillRect(0, Y(40), c.width, PX * 2); g.fillRect(0, Y(47), c.width, PX * 1); g.fillStyle = 'rgba(89,131,172,.35)'; g.fillRect(0, Y(37.4), c.width, PX * 1.6);
    g.lineWidth = PX * 0.14; for (let y = 2; y < 33; y += 2.5) { g.beginPath(); g.moveTo(0, Y(y)); g.lineTo(c.width, Y(y)); g.stroke(); }
  } else {
    g.fillStyle = 'rgba(139,104,199,.22)'; g.fillRect(0, Y(14), c.width, PX * 14); g.lineWidth = PX * 0.16;
    for (let y = 2; y < 13; y += 3) for (let x = -12; x < 12; x += 2.5) g.strokeRect(X(x), Y(y + 1.6), PX * 1.4, PX * 1.6);
    g.fillStyle = 'rgba(239,90,34,.6)'; for (const [cx, top] of [[-8.5, 38], [-0.5, 34], [7.5, 30]]) g.fillRect(X(cx - 1.4), Y(top - 1), PX * 2.8, PX * 2.2);
  }
  g.restore(); g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(X(x), Y(y)) : g.moveTo(X(x), Y(y))); g.closePath(); g.lineWidth = PX * 0.45; g.stroke();
  const t = texOf(c); t.repeat.set(1 / w, 1 / h); t.offset.set(-x0 / w, 0); return { tex: t, w, h };
}
function silGeometry(kind, depth) { const sh = new THREE.Shape(SIL[kind].map(([x, y]) => new THREE.Vector2(x, y))); const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: false }); g.translate(0, 0, -depth / 2); return g; }

/* ---------------- Quell-GLB → Teile ---------------- */
function bake(scene) { scene.updateMatrixWorld(true); const parts = []; scene.traverse(o => { if (o.isMesh) { const g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld); parts.push({ geo: g, mat: o.material, name: o.name }); } }); return parts; }
function bboxOf(parts) { const b = new THREE.Box3(); parts.forEach(p => { p.geo.computeBoundingBox(); b.union(p.geo.boundingBox); }); return b; }
function xform(parts, m) { parts.forEach(p => p.geo.applyMatrix4(m)); return parts; }
/* stand: längste Achse → y, mittlere → x, kürzeste → z (Domino/Karte aufrecht, Dicke in Fahrtrichtung) */
function normalize(parts, o = {}) {
  let b = bboxOf(parts), s = b.getSize(new THREE.Vector3());
  if (o.stand) { const a = [s.x, s.y, s.z], idx = [0, 1, 2].sort((i, j) => a[j] - a[i]), L = idx[0], M = idx[1], Sx = idx[2];
    const cols = [null, null, null]; cols[L] = new THREE.Vector3(0, 1, 0); cols[M] = new THREE.Vector3(1, 0, 0); cols[Sx] = new THREE.Vector3(0, 0, 1);
    const m = new THREE.Matrix4().makeBasis(cols[0], cols[1], cols[2]); if (m.determinant() < 0) { cols[M].negate(); m.makeBasis(cols[0], cols[1], cols[2]); } xform(parts, m); b = bboxOf(parts); s = b.getSize(s); }
  if (o.longZ && s.x > s.z) { xform(parts, new THREE.Matrix4().makeRotationY(Math.PI / 2)); b = bboxOf(parts); s = b.getSize(s); }
  const k = o.scale ?? (o.h ? o.h / s.y : o.len ? o.len / Math.max(s.x, s.z) : o.w ? o.w / Math.max(s.x, s.z) : 1);
  xform(parts, new THREE.Matrix4().makeScale(k, k, k)); b = bboxOf(parts); const c = b.getCenter(new THREE.Vector3());
  xform(parts, new THREE.Matrix4().makeTranslation(-c.x, -b.min.y, -c.z)); parts.size = bboxOf(parts).getSize(new THREE.Vector3()); parts.k = k; return parts;
}
function byGroup(g) { const out = []; for (const gr of g.groups) { const ng = new THREE.BufferGeometry(); for (const k in g.attributes) { const a = g.attributes[k]; ng.setAttribute(k, new THREE.BufferAttribute(a.array.slice(gr.start * a.itemSize, (gr.start + gr.count) * a.itemSize), a.itemSize)); } (out[gr.materialIndex] ||= []).push(ng); } return out; }
function twoMat(gs, mats, name) { const buckets = [[], []]; gs.forEach(g => byGroup(g).forEach((arr, i) => arr && buckets[i].push(...arr))); const grp = new THREE.Group(); grp.name = name;
  buckets.forEach((b, i) => { if (!b.length) return; const m = new THREE.Mesh(mergeGeometries(b), mats[i]); m.castShadow = m.receiveShadow = true; m.name = name + (i ? '.side' : '.top'); grp.add(m); }); return grp; }
function tris(g) { return (g.index ? g.index.count : g.attributes.position.count) / 3; }

export async function boot(canvasEl, host, onNote, opts = {}) {
  const t0 = performance.now(), info = { fps: 0, calls: 0, tris: 0, geoms: 0, textures: 0, programs: 0, loadMs: 0, errors: [] };
  const R = await (await fetch(new URL('./joyride-atlas.m01.json', import.meta.url).href + '?r=' + Date.now())).json();
  const P = R.palette, FONT = '"Nunito Sans", ui-sans-serif, system-ui, sans-serif';
  try { await Promise.race([document.fonts.load('900 64px "Nunito Sans"'), new Promise(r => setTimeout(r, 1500))]); } catch (e) {}

  const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.info.autoReset = false;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#e9dccb'); scene.fog = new THREE.Fog('#e9dccb', 700, 1500);
  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 1.5, 3000);
  const controls = new OrbitControls(camera, canvasEl); controls.enableDamping = true; controls.dampingFactor = 0.08; controls.zoomToCursor = true; controls.maxPolarAngle = Math.PI * 0.49;
  const hemi = new THREE.HemisphereLight('#fff6ea', '#b89a78', 1.15); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff2df', 2.3); sun.position.set(-160, 260, 140); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -210, right: 210, top: 160, bottom: -160, near: 50, far: 700 }); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.6; scene.add(sun);
  const fill = new THREE.DirectionalLight('#dfe8ff', 0.45); fill.position.set(200, 120, -160); scene.add(fill);

  const W = new THREE.Group(); W.name = 'world'; scene.add(W);
  const BENCH = new THREE.Group(); BENCH.name = 'werkbank'; BENCH.visible = false; scene.add(BENCH);
  const [BW, BH] = R.board.size;
  const heightAt = (x, z) => { let h = 0; for (const rg of R.regions) if (inPoly(x, z, rg.poly)) h = Math.max(h, rg.h); return h; };

  /* ---------- Knete K2 (nur Held) ---------- */
  onNote('Knete für die Helden …'); await new Promise(r => setTimeout(r, 0));
  const rel = makeClayRelief({ size: 512, seed: 31 }), ctex = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat);
  ctex.wrapS = ctex.wrapT = THREE.RepeatWrapping; ctex.magFilter = THREE.LinearFilter; ctex.minFilter = THREE.LinearMipmapLinearFilter; ctex.generateMipmaps = true; ctex.needsUpdate = true;
  const U = makeClayUniforms(THREE, ctex); U.uClayMottle.value = 0.05; U.uClayHand.value = 0.35; U.uClayTile.value = 1.2;
  const clayMats = new Map();
  const clayOf = (src, profile) => { const key = (src && src.uuid) + profile; if (!clayMats.has(key)) clayMats.set(key, makeClayMaterial(THREE, U, { src, profile })); return clayMats.get(key); };

  /* ---------- Materialfamilien ---------- */
  onNote('Atlasblatt wird gedruckt …'); await new Promise(r => setTimeout(r, 0));
  const printTex = makePrint(R, false, FONT), plainTex = makePrint(R, true, FONT), flute = makeFlute(); flute.repeat.set(0.25, 1);
  const woodT = makeWood('#c99a64', 3), stickT = makeWood('#e3c08a', 8), tableT = makeWood('#a77a4d', 13); tableT.repeat.set(10, 7);
  const M = {
    print: new THREE.MeshStandardMaterial({ map: printTex, roughness: 0.93 }),
    side: new THREE.MeshStandardMaterial({ map: flute, roughness: 0.95, color: '#ffffff' }),
    boardSide: new THREE.MeshStandardMaterial({ map: flute, roughness: 0.95 }),
    kraft: new THREE.MeshStandardMaterial({ color: P.kraftDark, roughness: 0.95 }),
    table: new THREE.MeshStandardMaterial({ map: tableT, roughness: 0.7 }),
    tapeC: new THREE.MeshStandardMaterial({ map: makeTape(P.track, P.trackLine, null, false), alphaTest: 0.5, roughness: 0.85, side: THREE.DoubleSide }),
    tapeS: new THREE.MeshStandardMaterial({ map: makeTape(P.knetbar, P.accent, P.accent, true), alphaTest: 0.5, roughness: 0.85, side: THREE.DoubleSide }),
    water: new THREE.MeshStandardMaterial({ color: '#58b8da', transparent: true, opacity: 0.62, roughness: 0.08, metalness: 0.1, depthWrite: false }),
    felt: new THREE.MeshStandardMaterial({ roughness: 1, color: '#ffffff' }),
    dowel: new THREE.MeshStandardMaterial({ map: woodT, roughness: 0.8 }),
    block: new THREE.MeshStandardMaterial({ map: woodT, roughness: 0.78, color: '#ffffff' }),
    stick: new THREE.MeshStandardMaterial({ map: stickT, roughness: 0.75 }),
    terrCap: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }),
    tape: new THREE.MeshStandardMaterial({ color: '#efe4c9', roughness: 0.9, transparent: true, opacity: 0.9 })
  };
  M.water.emissive = new THREE.Color('#ffffff'); { const [c, g] = canvas(64, 256); g.fillStyle = '#000'; g.fillRect(0, 0, 64, 256); g.fillStyle = 'rgba(255,255,255,.22)'; for (let y = 0; y < 256; y += 32) g.fillRect(8 + (y % 64) / 4, y, 20, 3); M.water.emissiveMap = texOf(c, true); M.water.emissiveIntensity = 1; }
  const craft = (mat, fam) => { const m = mat.clone(); m.roughness = fam === 'toy.plastic' ? 0.55 : 0.88; m.metalness = 0; if (m.map) m.map.anisotropy = 8; return m; };
  const craftMats = new Map(); const craftOf = (mat, fam) => { const k = mat.uuid + fam; if (!craftMats.has(k)) craftMats.set(k, craft(mat, fam)); return craftMats.get(k); };

  /* ---------- Tisch + Blatt ---------- */
  const table = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1100), M.table); table.rotation.x = -Math.PI / 2; table.position.y = -R.board.thickness; table.receiveShadow = true; table.name = 'table'; W.add(table);
  const boardBox = new THREE.Mesh(new THREE.BoxGeometry(BW, R.board.thickness, BH), [M.boardSide, M.boardSide, M.kraft, M.kraft, M.boardSide, M.boardSide]);
  boardBox.position.y = -R.board.thickness / 2 - 0.3; boardBox.receiveShadow = true; boardBox.castShadow = true; boardBox.name = 'board.box'; W.add(boardBox);
  const sheetG = new THREE.PlaneGeometry(BW, BH); sheetG.rotateX(-Math.PI / 2); const sheet = new THREE.Mesh(sheetG, M.print); sheet.receiveShadow = true; sheet.name = 'board.print'; W.add(sheet);
  { const s = R.board.dogEar.size, x = BW / 2, z = BH / 2; // Eselsohr: umgeklappte Ecke, Rückseite Kraft
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([x - s, 0.24, z, x, 0.24, z - s, x - s * 0.92, 3.2, z - s * 0.92], 3)); g.computeVertexNormals();
    const e = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: '#c09a68', roughness: 0.95, side: THREE.DoubleSide })); e.castShadow = true; e.name = 'board.dogear'; W.add(e);
    const hole = new THREE.Mesh(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([x - s, 0.18, z, x, 0.18, z, x, 0.18, z - s], 3)), M.kraft); hole.geometry.computeVertexNormals(); hole.name = 'board.dogear.under'; W.add(hole); }

  /* Regionen = ausgeschnittene Puzzleteile mit demselben Druck */
  const uvWorld = g => { const p = g.attributes.position, uv = new Float32Array(p.count * 2); for (let i = 0; i < p.count; i++) { uv[i * 2] = (p.getX(i) + BW / 2) / BW; uv[i * 2 + 1] = (-p.getZ(i) + BH / 2) / BH; } g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); };
  { const gs = R.regions.map(rg => { const sh = new THREE.Shape(rg.poly.map(([x, z]) => new THREE.Vector2(x, -z))); const g = new THREE.ExtrudeGeometry(sh, { depth: rg.h, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.25, bevelSegments: 1 }); g.rotateX(-Math.PI / 2); uvWorld(g); return g; });
    W.add(twoMat(gs, [M.print, M.side], 'board.regions')); }

  /* Terrassen: Konturkarton, Filz obenauf */
  const terr = new THREE.Group(); terr.name = 'relief'; W.add(terr);
  { const gs = []; const step = R.terraceStep;
    for (const T of R.terraces) { const r = rng(T.seed), base = heightAt(T.at[0], T.at[1]), ph = [0, 1, 2].map(() => r() * 6.28);
      for (let k = 0; k < T.layers; k++) { const rad = T.R * (1 - k / (T.layers + 0.7)), pts = [], n = 22;
        for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, rr = rad * (1 + 0.13 * Math.sin(a * 2 + ph[0]) + 0.08 * Math.sin(a * 3 + ph[1] + k) + 0.05 * Math.sin(a * 5 + ph[2])); pts.push(new THREE.Vector2(T.at[0] + Math.cos(a) * rr + k * 1.2, -(T.at[1] + Math.sin(a) * rr - k * 0.8))); }
        const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts), { depth: step, bevelEnabled: false }); g.rotateX(-Math.PI / 2); g.translate(0, base + k * step, 0);
        const c = new THREE.Color('#6f9a52').lerp(new THREE.Color('#c9c26a'), k / Math.max(1, T.layers - 1)), col = new Float32Array(g.attributes.position.count * 3); for (let i = 0; i < col.length; i += 3) { col[i] = c.r; col[i + 1] = c.g; col[i + 2] = c.b; }
        g.setAttribute('color', new THREE.BufferAttribute(col, 3)); gs.push(g); } }
    terr.add(twoMat(gs, [M.terrCap, M.side], 'relief.terraces')); }

  /* ---------- Bänder: Straße (Kreppband) + Rhein (Cellophan) ---------- */
  const curve2 = pts => new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal', 0.5);
  function ribbon(pts, w, lift, vLen) { const cv = curve2(pts), L = cv.getLength(), n = Math.max(2, Math.ceil(L / 1.2)), pos = [], uv = [], idx = [];
    for (let i = 0; i <= n; i++) { const t = i / n, p = cv.getPointAt(t), tg = cv.getTangentAt(t), nx = -tg.z, nz = tg.x, ln = Math.hypot(nx, nz) || 1;
      for (const s of [-1, 1]) { const x = p.x + nx / ln * w / 2 * s, z = p.z + nz / ln * w / 2 * s; pos.push(x, heightAt(x, z) + lift, z); uv.push(s < 0 ? 0 : 1, t * L / vLen); } }
    for (let i = 0; i < n; i++) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g; }
  const roadById = {}; R.roads.forEach(r => roadById[r.id] = r);
  { const gc = [], gs = []; for (const r of R.roads) (r.family === 'tape.stunt' ? gs : gc).push(ribbon(r.pts, r.w, 0.14, 12));
    for (const p of R.plazas) { const a = (p.rot || 0) * Math.PI / 180, [sx, sz] = p.size, c = Math.cos(a), s = Math.sin(a), q = [[-1, 0], [1, 0]].map(([u]) => [p.at[0] + c * u * sx / 2, p.at[1] - s * u * sx / 2]);
      gc.push(ribbon(q, sz, 0.13, 12)); }
    const mc = new THREE.Mesh(mergeGeometries(gc), M.tapeC), ms = new THREE.Mesh(mergeGeometries(gs), M.tapeS); mc.receiveShadow = ms.receiveShadow = true; mc.name = 'road.tape.cruise'; ms.name = 'road.tape.stunt'; W.add(mc, ms); }
  for (const w of R.water) { const m = new THREE.Mesh(ribbon(w.pts, w.w, 0.2, 40), M.water); m.name = 'water.' + w.id; m.renderOrder = 2; W.add(m); }

  /* ---------- Bastelstab-Brücke ---------- */
  const bridge = new THREE.Group(); bridge.name = 'bridge'; W.add(bridge);
  const B0 = R.structures[0], bA = new THREE.Vector3(B0.from[0], 0, B0.from[1]), bB = new THREE.Vector3(B0.to[0], 0, B0.to[1]), bL = bA.distanceTo(bB), bDir = bB.clone().sub(bA).normalize(), bSide = new THREE.Vector3(-bDir.z, 0, bDir.x);
  const deckY = t => 0.6 + B0.rise * Math.sin(Math.PI * t);
  { const nS = Math.ceil(bL / 1.25), im = new THREE.InstancedMesh(new THREE.BoxGeometry(B0.w + 0.8, 0.32, 1.05), M.stick, nS + 2 * 3); const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), yaw = Math.atan2(bDir.x, bDir.z);
    for (let i = 0; i < nS; i++) { const t = (i + 0.5) / nS, p = bA.clone().lerp(bB, t), sl = Math.atan2((deckY(t + 0.01) - deckY(t - 0.01)), 0.02 * bL); q.setFromEuler(new THREE.Euler(-sl, yaw, 0, 'YXZ'));
      m4.compose(new THREE.Vector3(p.x, deckY(t), p.z), q, new THREE.Vector3(1, 1, 1)); im.setMatrixAt(i, m4); }
    let k = nS; for (const s of [-1, 1]) for (const seg of [0, 1, 2]) { const t = (seg + 0.5) / 3, p = bA.clone().lerp(bB, t).addScaledVector(bSide, s * (B0.w / 2 + 0.2)); q.setFromEuler(new THREE.Euler(0, yaw, 0));
      m4.compose(new THREE.Vector3(p.x, deckY(t) + 0.5, p.z), q, new THREE.Vector3(0.25 / (B0.w + 0.8), 1.5, bL / 3 / 1.05)); im.setMatrixAt(k++, m4); }
    im.count = k; im.castShadow = im.receiveShadow = true; im.name = 'bridge.sticks'; bridge.add(im);
    const tubes = []; for (const s of [-1, 1]) for (let a = 0; a < B0.arches; a++) { const pts = []; for (let i = 0; i <= 16; i++) { const u = i / 16, t = (a + u) / B0.arches, p = bA.clone().lerp(bB, t).addScaledVector(bSide, s * (B0.w / 2 + 0.2)); p.y = deckY(t) + Math.sin(Math.PI * u) * B0.archH; pts.push(p); }
      tubes.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.42, 5, false));
      for (let j = 1; j < 6; j++) { const u = j / 6, t = (a + u) / B0.arches, p = bA.clone().lerp(bB, t).addScaledVector(bSide, s * (B0.w / 2 + 0.2)), hh = Math.sin(Math.PI * u) * B0.archH; const g = new THREE.BoxGeometry(0.28, hh, 0.28); g.translate(p.x, deckY(t) + hh / 2, p.z); tubes.push(g.toNonIndexed()); } }
    const tm = new THREE.Mesh(mergeGeometries(tubes.map(g => g.index ? g.toNonIndexed() : g)), M.stick); tm.castShadow = true; tm.name = 'bridge.arches'; bridge.add(tm); }

  /* ---------- Blockiert-Test für Streuung ---------- */
  const blockers = [];
  R.roads.forEach(r => blockers.push({ line: r.pts, r: r.w / 2 })); R.water.forEach(w => blockers.push({ line: w.pts, r: w.w / 2 + 2 }));
  blockers.push({ line: [B0.from, B0.to], r: B0.w / 2 + 2 });
  R.plazas.forEach(p => blockers.push({ c: p.at, r: Math.max(...p.size) / 2 + 2 }));
  R.pockets.forEach(p => blockers.push({ c: p.at, r: p.id === 'pocket.chaos' ? 30 : 20 }));
  R.pockets.forEach(p => p.items.forEach(it => it.at && blockers.push({ c: it.at, r: 9 })));
  blockers.push({ c: [56, 30], r: 12 }, { c: [112, 30], r: 12 }, { c: R.landmarks[0].at, r: 28 });
  R.terraces.forEach(T => blockers.push({ c: T.at, r: T.R * 1.25 }));
  R.standees.forEach(s => blockers.push({ line: [s.at, [s.at[0] - Math.sin(s.yaw) * s.h, s.at[1] - Math.cos(s.yaw) * s.h]], r: s.w / 2 + 2 }));
  const blocked = (x, z, pad) => blockers.some(b => b.line ? lineD(x, z, b.line) < b.r + pad : Math.hypot(x - b.c[0], z - b.c[1]) < b.r + pad) || Math.abs(x) > BW / 2 - 6 || Math.abs(z) > BH / 2 - 6;

  /* ---------- Filzbäume (instanziert, wiegen) ---------- */
  const trees = []; { const S = R.scatter.find(s => s.kind === 'feltTree'), r = rng(S.seed), regs = R.regions.filter(g => S.in.includes(g.id)); let tries = 0;
    while (trees.length < S.n && tries++ < 20000) { const x = (r() - 0.5) * BW, z = (r() - 0.5) * BH; if (!regs.some(g => inPoly(x, z, g.poly))) continue; if (blocked(x, z, 3)) continue; if (trees.some(t => Math.hypot(t.x - x, t.z - z) < 6)) continue;
      trees.push({ x, z, y: heightAt(x, z), h: 1.6 + r() * 2.2, rad: 2 + r() * 1.8, ph: r() * 6.28, c: [P.leaf, P.lime, '#2f8f55', '#4f9a3c', r() < 0.12 ? P.ground2 : '#3c8a48'][Math.floor(r() * 5)] }); } }
  const ballI = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), M.felt, trees.length), dowelI = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.28, 0.32, 1, 5), M.dowel, trees.length);
  ballI.castShadow = dowelI.castShadow = true; ballI.name = 'flora.felt.balls'; dowelI.name = 'flora.felt.dowels'; trees.forEach((t, i) => ballI.setColorAt(i, new THREE.Color(t.c))); W.add(ballI, dowelI);
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3();
  const setTrees = (time, amp) => { trees.forEach((t, i) => { const a = Math.sin(time * 1.3 + t.ph) * 0.06 * amp, b = Math.cos(time * 1.1 + t.ph * 1.7) * 0.05 * amp; _q.setFromEuler(_e.set(a, 0, b));
      _m.compose(_v.set(t.x, t.y + t.h / 2, t.z), _q, _s.set(1, t.h, 1)); dowelI.setMatrixAt(i, _m); const top = new THREE.Vector3(0, t.h, 0).applyQuaternion(_q);
      _m.compose(_v.set(t.x + top.x * 1.4, t.y + t.h + t.rad * 0.78, t.z + top.z * 1.4), _q, _s.set(t.rad, t.rad * 0.92, t.rad)); ballI.setMatrixAt(i, _m); });
    ballI.instanceMatrix.needsUpdate = dowelI.instanceMatrix.needsUpdate = true; };
  setTrees(0, 1);

  /* ---------- Köln als Bauklötze ---------- */
  { const S = R.scatter.find(s => s.kind === 'woodBlock'), r = rng(S.seed), reg = R.regions.find(g => g.id === 'de.nrw.koeln'), out = []; let tries = 0;
    const cols = [P.wall, P.ground, P.accent, P.trackLine, P.knetbar, P.ground2, '#e2d0bc'];
    while (out.length < S.n && tries++ < 15000) { const x = (r() - 0.5) * BW, z = (r() - 0.5) * BH; if (!inPoly(x, z, reg.poly)) continue; const w = 4.5 + r() * 4, d = 4.5 + r() * 4, pad = Math.max(w, d) * 0.6;
      if (blocked(x, z, pad)) continue; if (out.some(o => Math.hypot(o.x - x, o.z - z) < (Math.max(o.w, o.d) + Math.max(w, d)) * 0.55)) continue;
      const dd = Math.hypot(x - R.landmarks[0].at[0], z - R.landmarks[0].at[1]); out.push({ x, z, w, d, h: 3 + r() * (dd < 50 ? 5 : 12), yaw: (r() - 0.5) * 0.5, c: cols[Math.floor(r() * cols.length)] }); }
    const im = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), M.block, out.length); out.forEach((o, i) => { _q.setFromEuler(_e.set(0, o.yaw, 0)); _m.compose(_v.set(o.x, heightAt(o.x, o.z) + o.h / 2, o.z), _q, _s.set(o.w, o.h, o.d)); im.setMatrixAt(i, _m); im.setColorAt(i, new THREE.Color(o.c)); });
    im.castShadow = im.receiveShadow = true; im.name = 'city.blocks'; W.add(im); }

  /* ---------- Pop-up-Landmarke + Aufsteller ---------- */
  const pops = [];
  function popupPanel(kind, depth, parent) { const { tex } = silTexture(kind, FONT), face = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }), m = new THREE.Mesh(silGeometry(kind, depth), [face, M.kraft]); m.castShadow = m.receiveShadow = true; m.name = 'popup.' + kind; parent.add(m); return m; }
  const dom = new THREE.Group(); dom.name = 'landmark.dom'; W.add(dom);
  { const L = R.landmarks[0]; dom.position.set(L.at[0], heightAt(L.at[0], L.at[1]), L.at[1]); dom.rotation.y = L.yaw;
    for (const s of [-1, 1]) { const pn = popupPanel('dom', 0.9, dom); pn.rotation.y = s * L.fold * Math.PI / 180; }
    const tab = new THREE.Mesh(new THREE.BoxGeometry(46, 0.3, 14), M.kraft); tab.position.y = 0.15; tab.receiveShadow = true; dom.add(tab);
    const tp = new THREE.Mesh(new THREE.BoxGeometry(3, 0.12, 30), M.tape); tp.position.set(0, 0.34, 0); dom.add(tp); }
  const standees = R.standees.map(S => { const outer = new THREE.Group(), hinge = new THREE.Group(); outer.name = S.id; outer.position.set(S.at[0], heightAt(S.at[0], S.at[1]) + 0.05, S.at[1]); outer.rotation.y = S.yaw; outer.add(hinge); W.add(outer);
    popupPanel(S.silhouette, 0.6, hinge); const strut = new THREE.Mesh(new THREE.BoxGeometry(Math.min(6, S.w * 0.4), S.h * 0.42, 0.4), M.kraft); strut.position.set(0, S.h * 0.18, -S.h * 0.1); strut.rotation.x = 0.45; strut.castShadow = true; hinge.add(strut);
    const p = { id: S.id, kind: 'standee', obj: hinge, at: S.at, R: S.R, x: 1, v: 0, first: true }; pops.push(p); return outer; });

  /* ---------- Donoren laden ---------- */
  const loader = new GLTFLoader(), donors = {};
  const urlOf = path => R.assets.base + path.split('/').map(encodeURIComponent).join('/');
  async function src(key) { if (donors[key]?.p) return donors[key].p; const a = R.assets[key], d = donors[key] = { key, path: a.path, pack: a.pack, donor: a.donor || '', ok: false, ms: 0, tris: 0 }; const t = performance.now();
    d.p = loader.loadAsync(urlOf(a.path)).then(g => { d.ok = true; d.ms = Math.round(performance.now() - t); d.scene = g.scene; g.scene.traverse(o => { if (o.isMesh) d.tris += tris(o.geometry); }); return g.scene; })
      .catch(e => { d.err = String(e.message || e).slice(0, 80); info.errors.push(key + ': ' + d.err); return null; }); return d.p; }
  const meshOf = (parts, matFn, name) => { const g = new THREE.Group(); g.name = name; parts.forEach(p => { const geo = p.geo; const mat = matFn(p, geo); const m = new THREE.Mesh(geo, mat); m.castShadow = m.receiveShadow = true; m.name = name; g.add(m); }); return g; };
  const instOf = (parts, n, matFn, name) => parts.map(p => { const im = new THREE.InstancedMesh(p.geo, matFn(p), n); im.castShadow = im.receiveShadow = true; im.name = name; return im; });
  onNote('Brettspielteile und Strecken holen …');
  const keys = Object.keys(R.assets).filter(k => R.assets[k].path && /\.(gltf|glb)$/.test(R.assets[k].path)); await Promise.all(keys.map(src));

  /* Pockets: jeder Pocket ist EIN Pivot-Wrapper (Präsentation), Kinder in Weltkoordinaten */
  const pocketG = {}, labels = [], anim = { chaos: null };
  for (const pk of R.pockets) { const g = new THREE.Group(); g.name = pk.id; W.add(g); pocketG[pk.id] = g; pops.push({ id: pk.id, kind: 'pocket', obj: g, at: pk.at, R: pk.R, x: 1, v: 0, first: true }); }
  const place = (obj, x, z, yaw = 0, y = null) => { obj.position.set(x, y ?? heightAt(x, z), z); obj.rotation.y = yaw; return obj; };
  const item = id => { for (const pk of R.pockets) for (const it of pk.items) if (it.id === id) return [it, pk]; return [null, null]; };
  const cloneParts = scene => bake(scene);

  // Garage (S04 ×8) + Fahnen
  { const [it, pk] = item('garage.pits'), s = donors['racing.pitsGarage'].scene; if (s) pocketG[pk.id].add(place(meshOf(normalize(cloneParts(s), { scale: it.scale }), p => craftOf(p.mat, 'paint.wood'), it.id), it.at[0], it.at[1], it.yaw)); }
  const flags = []; for (const id of ['garage.flag.a', 'garage.flag.b']) { const [it, pk] = item(id), s = donors['bgb.flagB'].scene; if (!s) continue; const f = place(meshOf(normalize(cloneParts(s), { h: it.h }), p => craftOf(p.mat, 'toy.plastic'), id), it.at[0], it.at[1], 0.6); pocketG[pk.id].add(f); flags.push(f); }

  // Rampen + Knet-Böschung
  const ramps = {};
  for (const id of ['stunt.kicker', 'stunt.landing']) { const [it, pk] = item(id), s = donors['racing.rampLong'].scene; if (!s) continue; const parts = normalize(cloneParts(s), { scale: it.scale, longZ: true });
    let maxY = -1, lipZ = 1; parts.forEach(p => { const a = p.geo.attributes.position; for (let i = 0; i < a.count; i++) if (a.getY(i) > maxY + 1e-4) { maxY = a.getY(i); lipZ = Math.sign(a.getZ(i)) || 1; } });
    const yaw = Math.atan2(lipZ * it.dir[0], lipZ * it.dir[1]), m = place(meshOf(parts, p => craftOf(p.mat, 'paint.wood'), id), it.at[0], it.at[1], yaw); pocketG[pk.id].add(m);
    const len = parts.size.z, hgt = parts.size.y, base = heightAt(it.at[0], it.at[1]); ramps[id] = { at: it.at, dir: it.dir, len, h: hgt, base };
    if (it.berm) { const bg = new THREE.BoxGeometry(parts.size.x * 1.15, 1, len * 1.02, 6, 1, 12), a = bg.attributes.position, r = rng(id.length * 7);
      for (let i = 0; i < a.count; i++) { const z = a.getZ(i), t = clamp(lipZ * z / len + 0.5, 0, 1), top = a.getY(i) > 0; const yy = top ? Math.max(0.2, t * hgt * 0.86 - 0.7) + (r() - 0.5) * 0.3 : -0.2; a.setXYZ(i, a.getX(i) * (top ? 0.8 : 1.12) + (r() - 0.5) * 0.3, yy, z); }
      bg.computeVertexNormals(); seedGeometry(THREE, bg, id.length); const bm = new THREE.Mesh(bg, clayOf(null, 'terrainFg')); bm.material.color.set(P.ground2); bm.castShadow = bm.receiveShadow = true; bm.name = id + '.berm';
      place(bm, it.at[0], it.at[1], yaw, base); pocketG[pk.id].add(bm); } }
  // Looping
  let loopInfo = null; { const [it, pk] = item('stunt.loop'), s = donors['toy.loopNarrow'].scene; if (s) { const parts = normalize(cloneParts(s), { scale: it.scale, longZ: true }), yaw = Math.atan2(it.dir[0], it.dir[1]);
      pocketG[pk.id].add(place(meshOf(parts, p => craftOf(p.mat, 'toy.plastic'), it.id), it.at[0], it.at[1], yaw)); loopInfo = { at: it.at, dir: it.dir, len: parts.size.z, h: parts.size.y, w: parts.size.x, base: heightAt(it.at[0], it.at[1]) }; } }

  // Chaos-Ecke: Dominokette, Kartenhaus, Würfelturm, Münzen, Pappschild
  const poseSets = [];
  function poseSet(name, parts, poses, group, delayK) { // poses: [{A:Matrix4,B:Matrix4,delay}]
    const ims = instOf(parts, poses.length, p => craftOf(p.mat, 'toy.plastic'), name); ims.forEach(im => group.add(im));
    const dec = poses.map(p => { const a = [new THREE.Vector3(), new THREE.Quaternion(), new THREE.Vector3()], b = [new THREE.Vector3(), new THREE.Quaternion(), new THREE.Vector3()]; p.A.decompose(...a); p.B.decompose(...b); return { a, b, delay: p.delay }; });
    const ps = { name, ims, dec, p: 0, set(u) { const m = new THREE.Matrix4(), v = new THREE.Vector3(), q = new THREE.Quaternion(); dec.forEach((d, i) => { const k = sst(0, 1, (u - d.delay) / 0.5); v.lerpVectors(d.a[0], d.b[0], k); if (d.arc) v.y += Math.sin(k * Math.PI) * d.arc; q.slerpQuaternions(d.a[1], d.b[1], k); m.compose(v, q, d.a[2]); ims.forEach(im => im.setMatrixAt(i, m)); }); ims.forEach(im => im.instanceMatrix.needsUpdate = true); } };
    ps.set(0); poseSets.push(ps); return ps; }
  const chaosG = pocketG['pocket.chaos'], M4 = (x, y, z, rx = 0, ry = 0, rz = 0, order = 'YXZ') => new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz, order)), new THREE.Vector3(1, 1, 1));
  { const [it] = item('chaos.domino'); const cv = curve2(it.pts), L = cv.getLength(), n = Math.floor(L / it.gap); const sets = [[], []]; let thick = 0.5;
    for (const [si, key] of [[0, 'bgb.dominoA'], [1, 'bgb.dominoB']]) { const s = donors[key].scene; if (!s) continue; const parts = normalize(cloneParts(s), { stand: true, h: it.h }); thick = parts.size.z; sets[si].parts = parts; }
    for (let i = 0; i <= n; i++) { const t = i / n, p = cv.getPointAt(t), tg = cv.getTangentAt(t), yaw = Math.atan2(tg.x, tg.z), y = heightAt(p.x, p.z) + 0.02;
      const A = M4(p.x, y, p.z, 0, yaw), piv = new THREE.Matrix4().makeTranslation(0, 0, thick / 2), B = A.clone().multiply(piv).multiply(new THREE.Matrix4().makeRotationX(1.18)).multiply(piv.clone().invert());
      sets[i % 2].push({ A, B, delay: i * 0.09 }); }
    sets.forEach((ss, si) => ss.parts && ss.length && poseSet('chaos.domino.' + si, ss.parts, ss, chaosG)); }
  { const [it] = item('chaos.cardhouse'); const cp = []; for (const key of ['bgb.cardA', 'bgb.cardB']) { const s = donors[key].scene; if (s) cp.push(normalize(cloneParts(s), { stand: true, h: it.h })); }
    if (cp.length) { const cw = cp[0].size.x, lean = 0.34, hh = it.h * Math.cos(lean), foot = it.h * Math.sin(lean), r = rng(4), poses = [[], []]; let k = 0;
      for (let lv = 0; lv < it.levels; lv++) { const nA = it.levels - lv, y0 = heightAt(it.at[0], it.at[1]) + lv * (hh + 0.12);
        for (let a = 0; a < nA; a++) { const cx = it.at[0] + (a - (nA - 1) / 2) * (foot * 2 + 0.4), cz = it.at[1];
          for (const s of [-1, 1]) { const A = M4(cx, y0, cz + s * foot, -s * lean, 0), fx = cx + (r() - 0.5) * 16, fz = cz + (r() - 0.5) * 16, B = M4(fx, heightAt(fx, fz) + 0.1, fz, -Math.PI / 2, r() * 6.28, 0, 'YXZ');
            poses[k++ % cp.length].push({ A, B, delay: (it.levels - lv) * 0.12 + r() * 0.2 }); }
          if (lv < it.levels - 1 && a < nA - 1) { const A = M4(cx + foot + 0.2 + it.h / 2, y0 + hh + 0.06, cz, -Math.PI / 2, Math.PI / 2), fx = cx + (r() - 0.5) * 14, fz = cz + (r() - 0.5) * 14, B = M4(fx, heightAt(fx, fz) + 0.12, fz, -Math.PI / 2, r() * 6.28);
            poses[k++ % cp.length].push({ A, B, delay: (it.levels - lv) * 0.12 }); } } }
      poses.forEach((ps, i) => ps.length && poseSet('chaos.cardhouse.' + i, cp[i], ps, chaosG)); } }
  { const [it] = item('chaos.dicetower'); const dp = []; for (const key of ['bgb.d6A', 'bgb.d6B']) { const s = donors[key].scene; if (s) dp.push(normalize(cloneParts(s), { h: it.h })); }
    if (dp.length) { const r = rng(12), poses = [[], []], y0 = heightAt(it.at[0], it.at[1]), hh = dp[0].size.y;
      for (let i = 0; i < it.n; i++) { const A = M4(it.at[0] + (r() - 0.5) * 0.3, y0 + i * hh, it.at[1] + (r() - 0.5) * 0.3, 0, r() * 1.2), a = r() * 6.28, d = 6 + i * 3, fx = it.at[0] + Math.cos(a) * d, fz = it.at[1] + Math.sin(a) * d;
        const B = M4(fx, heightAt(fx, fz), fz, Math.PI / 2 * Math.floor(r() * 4), r() * 6.28, Math.PI / 2 * Math.floor(r() * 4)); poses[i % dp.length].push({ A, B, delay: (it.n - i) * 0.1 }); }
      poses.forEach((ps, i) => { if (!ps.length) return; const s = poseSet('chaos.dice.' + i, dp[i], ps, chaosG); s.dec.forEach(d => d.arc = 3); s.set(0); }); } }
  const coinStacks = []; { const [it] = item('chaos.coins'), s = donors['bgb.coin'].scene; if (s) { const parts = normalize(cloneParts(s), { w: it.h }), th = parts.size.y, r = rng(21), mats = [];
      for (let k = 0; k < it.n; k++) { const n = 6 + Math.floor(r() * 7), x = it.at[0] + (k - (it.n - 1) / 2) * 3.4, z = it.at[1] + (r() - 0.5) * 3; for (let i = 0; i < n; i++) mats.push({ x: x + (r() - 0.5) * 0.25, z: z + (r() - 0.5) * 0.25, y: heightAt(x, z) + i * th, k, i, yaw: r() * 6 }); }
      const ims = instOf(parts, mats.length, p => craftOf(p.mat, 'toy.plastic'), 'chaos.coins'); ims.forEach(im => chaosG.add(im)); coinStacks.push({ ims, mats }); } }
  const setCoins = (time, wave) => coinStacks.forEach(cs => { cs.mats.forEach((c, i) => { const hop = wave > 0 ? Math.max(0, Math.sin((time - wave) * 9 - c.k * 0.9 - c.i * 0.25)) * Math.exp(-(time - wave) * 1.6) * (0.6 + c.i * 0.35) : 0;
    _q.setFromEuler(_e.set(0, c.yaw, 0)); _m.compose(_v.set(c.x, c.y + hop, c.z), _q, _s.set(1, 1, 1)); cs.ims.forEach(im => im.setMatrixAt(i, _m)); }); cs.ims.forEach(im => im.instanceMatrix.needsUpdate = true); });
  setCoins(0, 0);
  let sign = null; { const [it] = item('chaos.sign'), g = new THREE.Group(), hinge = new THREE.Group(); g.name = it.id; hinge.position.y = 0.3; g.add(hinge);
    const [c, x] = canvas(512, 256); x.fillStyle = '#e9d6b2'; x.fillRect(0, 0, 512, 256); speckle(x, 512, 256, 1200, 4); x.fillStyle = P.ground; x.fillRect(0, 0, 512, 34); x.fillRect(0, 222, 512, 34);
    x.fillStyle = P.ink; x.font = `900 78px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(it.text, 256, 132);
    const panel = new THREE.Mesh(new THREE.BoxGeometry(7, 3.5, 0.3), [M.kraft, M.kraft, M.kraft, M.kraft, new THREE.MeshStandardMaterial({ map: texOf(c), roughness: 0.9 }), M.kraft]); panel.position.y = 3.6; panel.castShadow = true; hinge.add(panel);
    for (const s of [-1, 1]) { const post = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5.3, 6), M.dowel); post.position.set(s * 2.6, 2.65, -0.25); post.castShadow = true; hinge.add(post); }
    chaosG.add(place(g, it.at[0], it.at[1], it.yaw)); sign = { hinge, a: 0, v: 0 }; }

  // Büdchen: Kiosk, Knet-Meeple (Resident-Sockel), KFB-Karte auf Staffelei (Karten-Sockel)
  { const [it, pk] = item('buedchen.kiosk'), s = donors['bgb.building'].scene; if (s) pocketG[pk.id].add(place(meshOf(normalize(cloneParts(s), { h: it.h }), p => craftOf(p.mat, 'toy.plastic'), it.id), it.at[0], it.at[1], it.yaw)); }
  let resident = null; { const [it, pk] = item('buedchen.resident'), s = donors['bgb.meeple'].scene; if (s) { const parts = normalize(cloneParts(s), { h: it.h }); parts.forEach((p, i) => seedGeometry(THREE, p.geo, 40 + i));
      resident = place(meshOf(parts, p => { const m = clayOf(p.mat, 'figure'); return m; }, it.id), it.at[0], it.at[1], it.yaw); pocketG[pk.id].add(resident); } }
  const cardInfo = { ok: false, note: '' };
  { const [it, pk] = item('buedchen.card'), g = new THREE.Group(); g.name = it.id; const cw = it.h * 0.62, ch = it.h * 0.86;
    const [c0, x0] = canvas(256, 356); x0.fillStyle = '#efe4cf'; x0.fillRect(0, 0, 256, 356); x0.strokeStyle = P.ink; x0.setLineDash([10, 8]); x0.lineWidth = 4; x0.strokeRect(14, 14, 228, 328); x0.fillStyle = P.ink; x0.font = `800 22px ${FONT}`; x0.textAlign = 'center'; x0.fillText('KFB-KARTE', 128, 170); x0.font = `700 15px ${FONT}`; x0.fillText('lädt …', 128, 196);
    const cardMat = new THREE.MeshStandardMaterial({ map: texOf(c0), roughness: 0.85 });
    const card = new THREE.Mesh(new THREE.BoxGeometry(cw, ch, 0.12), [M.kraft, M.kraft, M.kraft, M.kraft, cardMat, M.kraft]); card.position.set(0, 1.4 + ch / 2, 0.15); card.rotation.x = -0.12; card.castShadow = true; g.add(card);
    const back = new THREE.Mesh(new THREE.BoxGeometry(cw + 0.5, ch + 0.5, 0.25), M.kraft); back.position.set(0, 1.4 + ch / 2, 0); back.rotation.x = -0.12; g.add(back);
    for (const [lx, lz, rx] of [[-cw * 0.35, 0.4, -0.12], [cw * 0.35, 0.4, -0.12], [0, -1.6, 0.42]]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 1.4 + ch * 0.9, 6), M.dowel); leg.position.set(lx, (1.4 + ch * 0.9) / 2, lz); leg.rotation.x = rx; leg.castShadow = true; g.add(leg); }
    pocketG[pk.id].add(place(g, it.at[0], it.at[1], it.yaw));
    import('../bb-scene.js').then(m => m.renderCardQuarter(it.card)).then(res => { const t = texOf(res.canvas); cardMat.map = t; cardMat.needsUpdate = true; cardInfo.ok = true; cardInfo.note = res.title + ' #' + res.cardNumber + ' · S. ' + res.page; })
      .catch(e => { cardInfo.note = 'SOURCE_REQUIRED · ' + String(e.message || e).slice(0, 60); const [c1, x1] = canvas(256, 356); x1.fillStyle = '#efe4cf'; x1.fillRect(0, 0, 256, 356); x1.strokeStyle = P.ground; x1.lineWidth = 5; x1.setLineDash([10, 8]); x1.strokeRect(14, 14, 228, 328); x1.fillStyle = P.ink; x1.font = `800 20px ${FONT}`; x1.textAlign = 'center'; x1.fillText('KARTEN-SOCKEL', 128, 168); x1.font = `700 14px ${FONT}`; x1.fillText('Karte nicht geladen', 128, 194); cardMat.map = texOf(c1); cardMat.needsUpdate = true; }); }

  // Held-Fahrzeug in Knete
  let car = null; { const V = R.vehicle, s = donors[V.asset].scene; if (s) { const parts = normalize(cloneParts(s), { len: V.len, longZ: true }); parts.forEach((p, i) => seedGeometry(THREE, p.geo, 70 + i));
      car = meshOf(parts, p => clayOf(p.mat, 'vehicle'), V.id); car.userData.h = parts.size.y; W.add(car); } }
  const carHome = () => { if (!car) return; const a = new THREE.Vector3(R.vehicle.at[0], heightAt(R.vehicle.at[0], R.vehicle.at[1]) + 0.15, R.vehicle.at[1]), b = new THREE.Vector3(-44, 0, 58); car.position.copy(a); car.up.set(0, 1, 0); car.lookAt(b.x, a.y, b.z); };
  carHome();

  /* ---------- Werkbank: Quelle | Übersetzung | eingebaut (Donor-Beweis) ---------- */
  const benchRows = []; { const Z = 168; let x = -165; const lab = (txt, sub, pos) => benchRows.push({ txt, sub, pos });
    const pair = (key, o, fam, prof) => { const s = donors[key]?.scene; if (!s) { lab(key, 'nicht geladen', new THREE.Vector3(x, 6, Z)); x += 26; return; }
      const a = meshOf(normalize(cloneParts(s), o), p => p.mat, key + '.src'); place(a, x, Z, 0.5, 0.02); BENCH.add(a);
      const pb = normalize(cloneParts(s), o); if (prof) pb.forEach((p, i) => seedGeometry(THREE, p.geo, 90 + i)); const b = meshOf(pb, p => prof ? clayOf(p.mat, prof) : craftOf(p.mat, fam), key + '.tr'); place(b, x + 11, Z, 0.5, 0.02); BENCH.add(b);
      lab('QUELLE · ' + R.assets[key].path.split('/').pop(), R.assets[key].pack, new THREE.Vector3(x, a.children.length ? pb.size.y + 2.5 : 6, Z)); lab('ÜBERSETZT · ' + (prof ? 'K2 Knete ' + prof : fam), '', new THREE.Vector3(x + 11, pb.size.y + 2.5, Z)); x += 30; };
    pair('kk.carSedan', { len: 4.4, longZ: true }, null, 'vehicle'); pair('bgb.meeple', { h: 3.4 }, null, 'figure'); pair('bgb.dominoA', { h: 3.4 }, 'toy.plastic'); pair('bgb.cardA', { h: 4.2 }, 'paper.card');
    pair('bgb.building', { h: 7 }, 'toy.plastic'); pair('racing.rampLong', { scale: 8, longZ: true }, 'paint.wood'); pair('toy.loopNarrow', { scale: 5, longZ: true }, 'toy.plastic'); pair('racing.pitsGarage', { scale: 8 }, 'paint.wood');
    // prozedurale Konstruktionsproben
    const Z2 = 196; let x2 = -150; const probe = (obj, t, sub) => { BENCH.add(obj); lab(t, sub, new THREE.Vector3(x2, 9, Z2)); x2 += 36; };
    { const g = new THREE.Group(), r = ribbon([[-12, 0], [0, 3], [12, 0]], 9, 0.02, 12), s2 = ribbon([[-12, 0], [0, 3], [12, 0]], 9, 0.02, 12); const a = new THREE.Mesh(r, M.tapeC), b = new THREE.Mesh(s2, M.tapeS); b.position.z = 12; g.add(a, b); g.position.set(x2, 0.02, Z2 - 6); probe(g, 'KREPPBAND · Landstraße / Stuntlinie', 'ein Band je Spline'); }
    { const g = new THREE.Group(), d = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 3, 5), M.dowel), b = new THREE.Mesh(new THREE.IcosahedronGeometry(2.6, 1), M.felt); d.position.y = 1.5; b.position.y = 5.2; b.material = M.felt.clone(); b.material.color.set(P.leaf); g.add(d, b); g.position.set(x2, 0, Z2); probe(g, 'FILZKUGEL · Baum', 'Ikosaeder + Dübel, instanziert'); }
    { const g = new THREE.Group(); for (let k = 0; k < 3; k++) { const m = new THREE.Mesh(new THREE.CylinderGeometry(9 - k * 2.6, 9 - k * 2.6, R.terraceStep, 18), [M.side, M.terrCap.clone(), M.side]); m.material[1].vertexColors = false; m.material[1].color.set(new THREE.Color('#6f9a52').lerp(new THREE.Color('#c9c26a'), k / 2)); m.position.y = R.terraceStep * (k + 0.5); g.add(m); } g.position.set(x2, 0, Z2); probe(g, 'KONTURKARTON · Relief', 'D6-Stufe ' + R.terraceStep + ' m'); }
    { const g = new THREE.Group(); for (const s of [-1, 1]) { const pn = popupPanel('dom', 0.9, g); pn.rotation.y = s * 0.6; } g.scale.setScalar(0.25); g.position.set(x2, 0, Z2); probe(g, 'POP-UP · Dom im V', 'zwei Silhouetten, bedruckte Pappe'); }
    { const w = new THREE.Mesh(ribbon([[-12, 0], [12, 0]], 10, 0.05, 40), M.water); w.position.set(x2, 0.05, Z2); probe(w, 'CELLOPHAN · Rhein', 'ein Band, Streifen wandern'); } }

  /* ---------- Beschriftungen + Sockel ---------- */
  const lab = document.createElement('div'); lab.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:2;font-family:' + FONT; host.appendChild(lab);
  const mkLabel = (html, pos, kind, grp) => { const el = document.createElement('div'); el.innerHTML = html; el.style.cssText = 'position:absolute;left:0;top:0;transform:translate(-50%,-100%);white-space:nowrap;will-change:transform'; lab.appendChild(el); labels.push({ el, pos, kind, grp }); };
  const chip = (txt, bg, fg = '#fff') => `<span style="display:inline-block;padding:3px 7px;border-radius:7px;background:${bg};color:${fg};font-size:10.5px;font-weight:800;letter-spacing:.04em;box-shadow:0 4px 12px rgba(20,20,30,.14)">${txt}</span>`;
  R.pockets.forEach((pk, i) => mkLabel(chip((i + 1) + ' · ' + pk.label, '#17191d'), new THREE.Vector3(pk.at[0], 16, pk.at[1]), 'name', pocketG[pk.id]));
  mkLabel(chip('Dom · Pop-up-Landmarke', '#17191d'), new THREE.Vector3(R.landmarks[0].at[0], 68, R.landmarks[0].at[1]), 'name');
  mkLabel(chip('Hohenzollernbrücke · Bastelstäbe', '#17191d'), new THREE.Vector3((B0.from[0] + B0.to[0]) / 2, 20, B0.from[1]), 'name');
  mkLabel(chip('Gabel · Landstraße ↑  Stuntlinie →', '#17191d'), new THREE.Vector3(-4, 8, 14), 'name');
  const sock = (id, pos, react, extra = '') => mkLabel(`<div style="display:flex;flex-direction:column;align-items:center;gap:3px">${chip(TAGS[react], TAG[react])}<span style="font-size:10px;font-weight:700;color:#17191d;background:rgba(255,255,255,.9);padding:2px 6px;border-radius:6px">${id}${extra}</span></div>`, pos, 'sock');
  for (const pk of R.pockets) for (const it of pk.items) { const at = it.at || it.pts[Math.floor(it.pts.length / 2)]; sock(it.id, new THREE.Vector3(at[0], (it.h || 5) + 4, at[1]), it.react, it.socket ? ' · ' + it.socket.toUpperCase() + '-SOCKEL' : ''); }
  sock('landmark.dom', new THREE.Vector3(R.landmarks[0].at[0] + 24, 30, R.landmarks[0].at[1] + 8), R.landmarks[0].react); R.standees.forEach(s => sock(s.id, new THREE.Vector3(s.at[0], 10, s.at[1]), s.react));
  sock('flora.felt', new THREE.Vector3(trees[0].x, 9, trees[0].z), 'AMBIENT_REACTIVE'); sock('bridge.hohenzollern', new THREE.Vector3(B0.to[0] + 14, 10, B0.to[1]), B0.react); sock('river.rhein', new THREE.Vector3(80, 4, 60), 'AMBIENT_REACTIVE');
  sock('hero.car', new THREE.Vector3(R.vehicle.at[0], 6, R.vehicle.at[1]), R.vehicle.react);
  benchRows.forEach(b => mkLabel(`<div style="display:flex;flex-direction:column;align-items:center;gap:2px">${chip(b.txt, '#fff', '#17191d')}${b.sub ? `<span style="font-size:9.5px;font-weight:700;color:#4a515c">${b.sub}</span>` : ''}</div>`, b.pos, 'bench', BENCH));

  /* ---------- Fahrlinien ---------- */
  function drivePath(name) { const out = [], add = v => { if (!out.length || out[out.length - 1].distanceTo(v) > 0.6) out.push(v); };
    const road = id => { const cv = curve2(roadById[id].pts), L = cv.getLength(), n = Math.ceil(L / 3); for (let i = 0; i <= n; i++) { const p = cv.getPointAt(i / n); add(new THREE.Vector3(p.x, heightAt(p.x, p.z) + 0.2, p.z)); } };
    for (const seg of R.drives[name]) {
      if (seg.startsWith('@jump')) { const k = ramps['stunt.kicker'], l = ramps['stunt.landing']; if (!k || !l) continue; const dx = k.dir[0], dz = k.dir[1];
        const kF = [k.at[0] - dx * k.len / 2, k.at[1] - dz * k.len / 2], kL = [k.at[0] + dx * k.len / 2, k.at[1] + dz * k.len / 2], lL = [l.at[0] + l.dir[0] * l.len / 2, l.at[1] + l.dir[1] * l.len / 2], lF = [l.at[0] - l.dir[0] * l.len / 2, l.at[1] - l.dir[1] * l.len / 2];
        for (let i = 0; i <= 6; i++) { const t = i / 6; add(new THREE.Vector3(lerp(kF[0], kL[0], t), k.base + 0.2 + k.h * t, lerp(kF[1], kL[1], t))); }
        const gap = Math.hypot(lL[0] - kL[0], lL[1] - kL[1]), apex = 9; for (let i = 1; i < 18; i++) { const t = i / 18; add(new THREE.Vector3(lerp(kL[0], lL[0], t), k.base + k.h + 0.2 + 4 * apex * t * (1 - t), lerp(kL[1], lL[1], t))); }
        for (let i = 0; i <= 6; i++) { const t = i / 6; add(new THREE.Vector3(lerp(lL[0], lF[0], t), l.base + 0.2 + l.h * (1 - t), lerp(lL[1], lF[1], t))); } }
      else if (seg.startsWith('@loop')) { const L = loopInfo; if (!L) continue; const f = new THREE.Vector3(L.dir[0], 0, L.dir[1]), c = new THREE.Vector3(L.at[0], 0, L.at[1]), rad = L.h / 2 - 1.2, side = new THREE.Vector3(-f.z, 0, f.x);
        for (let i = 0; i <= 5; i++) add(c.clone().addScaledVector(f, -L.len / 2 + (L.len / 2) * i / 5).setY(L.base + 0.4));
        for (let i = 1; i < 40; i++) { const a = i / 40 * Math.PI * 2, p = c.clone().addScaledVector(f, Math.sin(a) * rad).addScaledVector(side, (i / 40) * L.w * 0.35); p.y = L.base + 0.4 + rad - Math.cos(a) * rad; add(p); }
        for (let i = 0; i <= 5; i++) add(c.clone().addScaledVector(f, (L.len / 2) * i / 5).addScaledVector(side, L.w * 0.35).setY(L.base + 0.4)); }
      else if (seg.startsWith('@bridge')) { for (let i = 0; i <= 24; i++) { const t = i / 24, p = bA.clone().lerp(bB, t); p.y = deckY(t) + 0.35; add(p); } }
      else road(seg); }
    return new THREE.CatmullRomCurve3(out, false, 'centripetal', 0.5); }
  const drive = { on: false, name: null, curve: null, L: 1, s: 0, up: new THREE.Vector3(0, 1, 0), camP: new THREE.Vector3(), speed: 22, chaosFired: false };

  /* ---------- Präsentation / Lesarten ---------- */
  let lesart = opts.lesart || 'C', showNames = opts.labels ?? true, showSock = opts.sockets ?? false, view = opts.view || 'tisch';
  const applyLesart = () => { const L = R.presentations[lesart]; M.print.map = L.print === 'plain' ? plainTex : printTex; M.print.needsUpdate = true; terr.userData.target = L.terraceK; };
  applyLesart(); terr.scale.y = terr.userData.target;
  const popTarget = p => { const L = R.presentations[lesart], mode = p.kind === 'standee' ? L.standees : L.pops; if (mode === 'all') return 1; if (mode === 'flat') return 0.04;
    const d = camera.position.distanceTo(_v.set(p.at[0], 0, p.at[1])); return Math.max(0.04, 1 - sst(p.R[0], p.R[1], d)); };

  /* ---------- Kamera-Rollen ---------- */
  const VIEWS = {
    tisch: { pos: [-70, 110, 190], tg: [-10, 0, 10] }, karte: { pos: [0, 470, 0.1], tg: [0, 0, 0] },
    anfahrt: { pos: [-72, 9, 8], tg: [28, 26, -80] }, stunt: { pos: [30, 13, 40], tg: [96, 5, 26] }, loop: { pos: [116, 12, 10], tg: [140, 9, -16] },
    chaos: { pos: [0, 17, 66], tg: [28, 2, 28] }, buedchen: { pos: [-32, 9, -30], tg: [-58, 3, -56] }, garage: { pos: [-28, 12, 100], tg: [-62, 3, 80] },
    werkbank: { pos: [-30, 78, 300], tg: [-30, 2, 180] }
  };
  let tween = null;
  const shot = id => { view = id; const isDrive = id.startsWith('fahrt'); BENCH.visible = id === 'werkbank';
    if (isDrive) { drive.name = id === 'fahrt-stunt' ? 'stunt' : 'landstrasse'; drive.curve = drivePath(drive.name); drive.L = drive.curve.getLength(); drive.s = 0; drive.on = true; drive.up.set(0, 1, 0); drive.chaosFired = false; drive.first = true; controls.enabled = false; tween = null; return; }
    if (drive.on) { drive.on = false; controls.enabled = true; camera.up.set(0, 1, 0); carHome(); }
    const V = VIEWS[id] || VIEWS.tisch; tween = { t0: performance.now(), p0: camera.position.clone(), g0: controls.target.clone(), p1: new THREE.Vector3(...V.pos), g1: new THREE.Vector3(...V.tg), first: !camera.userData.set }; camera.userData.set = 1; };
  shot(view);

  /* ---------- Anstoßen (Präsentations-Vorschau, keine Physik) ---------- */
  const poke = () => { anim.chaos = performance.now() / 1000; };

  /* ---------- Kosten ---------- */
  const report = () => { const rows = new Map(); W.traverse(o => { if (!(o.isMesh && o.visible)) return; let vis = true, q = o; while (q) { if (!q.visible) { vis = false; break; } q = q.parent; } if (!vis) return;
      const base = o.name || 'mesh', n = o.isInstancedMesh ? o.count : 1, t = tris(o.geometry) * n, r = rows.get(base) || { id: base, tris: 0, draws: 0, inst: 0 }; r.tris += t; r.draws += Array.isArray(o.material) ? (o.geometry.groups.length || o.material.length) : 1; r.inst += n; rows.set(base, r); });
    const all = [...rows.values()].sort((a, b) => b.tris - a.tris), mats = new Set(); W.traverse(o => { if (o.isMesh) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => mats.add(m.uuid)); });
    let inst = 0; W.traverse(o => { if (o.isInstancedMesh) inst += o.count; });
    return { top: all.slice(0, 7), meshes: all.length, materials: mats.size, instances: inst, glb: Object.values(donors).filter(d => d.ok).length, glbAll: Object.keys(donors).length }; };

  /* ---------- Schleife ---------- */
  let inset = opts.inset || 0, alive = true, frames = 0, fpsT = performance.now(), last = performance.now(), lastDraw = 0;
  const resize = () => { const w = canvasEl.clientWidth || 1, h = canvasEl.clientHeight || 1; renderer.setSize(w, h, false); camera.aspect = w / h; if (inset > 0 && w > 720) camera.setViewOffset(w + inset, h, 0, 0, w, h); else camera.clearViewOffset(); camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(resize); ro.observe(canvasEl); resize();
  const _p = new THREE.Vector3();
  const drawLabels = () => { const w = canvasEl.clientWidth, h = canvasEl.clientHeight, off = inset > 0 && w > 720 ? 0 : 0;
    for (const L of labels) { let show = L.kind === 'bench' ? BENCH.visible && showNames : L.kind === 'sock' ? showSock && !BENCH.visible : showNames && !BENCH.visible; if (show && L.grp && L.kind === 'name') show = L.grp.scale.y > 0.35 || view === 'karte' || view === 'tisch';
      if (!show || drive.on) { L.el.style.display = 'none'; continue; } _p.copy(L.pos).project(camera); if (_p.z > 1 || _p.z < -1) { L.el.style.display = 'none'; continue; }
      L.el.style.display = 'block'; L.el.style.transform = `translate(${((_p.x + 1) / 2 * w + off).toFixed(1)}px,${((1 - _p.y) / 2 * h).toFixed(1)}px) translate(-50%,-100%)`; } };
  const draw = () => { const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000), T = now / 1000; last = now; lastDraw = now;
    if (tween) { const k = tween.first ? 1 : sst(0, 1, (now - tween.t0) / 900); camera.position.lerpVectors(tween.p0, tween.p1, k); controls.target.lerpVectors(tween.g0, tween.g1, k); if (k >= 1) tween = null; }
    if (drive.on && drive.curve && car) { drive.s = (drive.s + drive.speed * dt) % drive.L; if (drive.s < drive.speed * dt * 1.5) { drive.up.set(0, 1, 0); drive.chaosFired = false; }
      const u = drive.s / drive.L, p = drive.curve.getPointAt(u), F = drive.curve.getTangentAt(u).normalize(); const right = new THREE.Vector3().crossVectors(F, drive.up).normalize(); const up = new THREE.Vector3().crossVectors(right, F).normalize(); drive.up.copy(up);
      const xA = new THREE.Vector3().crossVectors(up, F); car.matrixAutoUpdate = true; car.position.copy(p); car.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xA, up, F));
      const Fh = _s.set(F.x, 0, F.z); if (Fh.length() > 0.3) Fh.normalize(); else Fh.copy(F);
      let want = p.clone().addScaledVector(Fh, -12).add(new THREE.Vector3(0, 4.6, 0)).addScaledVector(up, 0), look = p.clone().addScaledVector(Fh, 12).add(new THREE.Vector3(0, 1.2, 0)), wantUp = up;
      if (loopInfo && Math.hypot(p.x - loopInfo.at[0], p.z - loopInfo.at[1]) < loopInfo.len * 0.95) { const sd = new THREE.Vector3(loopInfo.dir[1], 0, -loopInfo.dir[0]); want = new THREE.Vector3(loopInfo.at[0], loopInfo.base + loopInfo.h * 0.8, loopInfo.at[1]).addScaledVector(sd, 40); look = p.clone(); wantUp = _v.set(0, 1, 0); }
      if (drive.first) { camera.position.copy(want); drive.first = false; } else camera.position.lerp(want, 1 - Math.exp(-dt * 6));
      camera.up.lerp(wantUp, 1 - Math.exp(-dt * 5)).normalize(); camera.lookAt(look);
      if (!drive.chaosFired && Math.hypot(p.x - 24, p.z - 29) < 12) { drive.chaosFired = true; poke(); } }
    else controls.update();
    // Präsentation: Pop-ups federn (Pivot-Wrapper)
    for (const p of pops) { const tg = popTarget(p); if (p.first) { p.x = tg; p.first = false; } p.v += ((tg - p.x) * 70 - p.v * 10) * dt; p.x += p.v * dt;
      if (p.kind === 'pocket') { const k = Math.max(0.04, p.x), sx = 1 + (1 - clamp(p.x, 0, 1)) * 0.06; p.obj.scale.set(sx, k, sx); }
      else p.obj.rotation.x = -(1 - clamp(p.x, 0.02, 1.15)) * Math.PI / 2; }
    terr.scale.y = lerp(terr.scale.y, terr.userData.target, 1 - Math.exp(-dt * 5));
    // Ambient
    setTrees(T, 1); M.water.emissiveMap.offset.y = -T * 0.05; flags.forEach((f, i) => f.rotation.y = 0.6 + Math.sin(T * 3 + i) * 0.12);
    if (resident) resident.scale.set(1, 1 + Math.sin(T * 2.2) * 0.03, 1);
    dom.rotation.z = Math.sin(T * 0.7) * 0.004;
    // Chaos-Vorschau
    if (anim.chaos) { const t = T - anim.chaos, u = t < 3.4 ? t : t < 6.4 ? 3.4 : Math.max(0, 3.4 - (t - 6.4) * 1.2); poseSets.forEach(ps => ps.set(u)); setCoins(T, anim.chaos);
      if (sign) { if (t < 0.1) sign.v = 5; } if (t > 10) { anim.chaos = null; poseSets.forEach(ps => ps.set(0)); setCoins(T, 0); } }
    if (sign) { sign.v += (-sign.a * 60 - sign.v * 5) * dt; sign.a += sign.v * dt; sign.hinge.rotation.x = -sign.a * 0.5; }
    renderer.info.reset(); renderer.render(scene, camera); drawLabels();
    frames++; if (now - fpsT > 1000) { info.fps = Math.round(frames * 1000 / (now - fpsT)); frames = 0; fpsT = now; }
    info.calls = renderer.info.render.calls; info.tris = renderer.info.render.triangles; info.geoms = renderer.info.memory.geometries; info.textures = renderer.info.memory.textures; info.programs = (renderer.info.programs || []).length; };
  const loop = () => { if (!alive) return; draw(); requestAnimationFrame(loop); }; requestAnimationFrame(loop);
  const iv = setInterval(() => { if (alive && performance.now() - lastDraw > 250) draw(); }, 120);
  info.loadMs = Math.round(performance.now() - t0);

  const api = { recipe: R, info, donors, cardInfo, report, draw, scene, camera, renderer,
    shot, poke,
    set(k, v) { if (k === 'lesart') { lesart = v; applyLesart(); } else if (k === 'labels') showNames = !!v; else if (k === 'sockets') showSock = !!v; else if (k === 'speed') drive.speed = +v; else if (k === 'inset') { inset = +v || 0; resize(); } },
    get state() { return { lesart, view, showNames, showSock, drive: drive.on ? drive.name : null, pops: pops.map(p => ({ id: p.id, x: +p.x.toFixed(2) })) }; },
    dispose() { alive = false; clearInterval(iv); ro.disconnect(); controls.dispose(); renderer.dispose(); lab.remove(); } };
  return api;
}
