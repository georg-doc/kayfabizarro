// KFB Billboard / Media Residency Szene — Claude Design Slice, GATE 1.
// Auftrag: tools/KFB-ToolBox/_handover/CLAUDE_BILLBOARD_MEDIA_DESIGN_2026-09-23/
//          {START_HERE,CLAUDE_DESIGN_BRIEF}.md
//
// Hero-Donor: Kenney Racing Kit Billboard-Familie, registry-gepinnt @378b209355b1
// (registry/assets/v1/packs/kenney-racing-kit.json). Vier echte Varianten stehbar.
//
// WIEDERVERWENDET, nicht nachgebaut:
// - Kartenbild-Technik aus `KFB Cologne Race Option C-2/lab-v9/cologne-props.v1.js`
//   renderCardQuarter(): dieselbe Registry media/kfb/index.json, dieselbe pdf.js-Version,
//   derselbe Viertelseiten-Schnitt. Hier ROUTE-LOS neu geschrieben — das Original braucht
//   eine Fahrstrecke (`route.sampleAt()`), die ein Diorama nicht hat. Algorithmus identisch.
// - buildBillboard()-Messtechnik: Box3 -> Zielhöhe skalieren -> Panel vor der Tafel montieren,
//   ebenfalls route-los nachgezogen.
// - Fels/Busch: über den ECHTEN Owner-Weg dieses Projekts — wd-registry.js (Registry-Shard) +
//   wd-donors.js mountAsset() (atlas.js loadAsset/instance + kit-lab.js repairTextures).
// Kein zweiter Billboard-Owner, kein zweiter PDF-Renderer, kein zweiter ChatterBox.

import * as THREE from 'three';
import { mountAsset, SourceRequired } from './wd-donors.js';
import * as REG from './wd-registry.js';

const PIN = '378b209355b13304e3cff656ec0806ca5b89df28';
const RACE = (f) => 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + PIN +
  '/media/3D_Assets/kenney_racing-kit/Models/GLTF%20format/' + f;

export const HERO_DONORS = [
  { id: 'billboard', file: 'billboard.glb', label: 'billboard.glb' },
  { id: 'double', file: 'billboardDouble_exclusive.glb', label: 'billboardDouble_exclusive.glb' },
  { id: 'low', file: 'billboardLow.glb', label: 'billboardLow.glb' },
  { id: 'lower', file: 'billboardLower.glb', label: 'billboardLower.glb' }
];

// ------------------------------------------------------------- Karte / PDF
const PDFJS = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.min.mjs';
const PDFJS_WORKER = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs';
const CARD_REGISTRY = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/kfb/index.json';

// Dieselbe Beispielauswahl wie im Race-Donor — ein stabiler Seed pro Begegnung, kein Zufallswand.
export const CARD_POOL = [
  { packId: 'forget_utopia', n: 7 },
  { packId: 'embrace_protopia', n: 12 },
  { packId: 'medkayfab_cardiology', n: 5 }
];

let _cardReg = null, _pdfWorkerUrl = null;

export async function renderCardQuarter(pick) {
  if (!_cardReg) _cardReg = await (await fetch(CARD_REGISTRY)).json();
  const deck = (_cardReg.decks || []).find((d) => d.packId === pick.packId);
  if (!deck || !deck.pdf) throw new Error('deck not in registry: ' + pick.packId);

  const lib = await import(/* @vite-ignore */ PDFJS);
  if (!_pdfWorkerUrl) {
    const src = await (await fetch(PDFJS_WORKER)).text();
    _pdfWorkerUrl = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
  }
  lib.GlobalWorkerOptions.workerSrc = _pdfWorkerUrl;

  const url = _cardReg.baseUrl + '/' + encodeURIComponent(deck.pdf);
  const doc = await lib.getDocument({ url }).promise;
  const off = deck.coverOffset != null ? deck.coverOffset : 1;
  const num = off + 1 + Math.floor((pick.n - 1) / 4);
  const qi = (pick.n - 1) % 4;
  if (num < 1 || num > doc.numPages) throw new Error('page ' + num + ' of ' + doc.numPages);

  const page = await doc.getPage(num);
  const scale = 1400 / page.getViewport({ scale: 1 }).width;
  const vp = page.getViewport({ scale });
  const cv = document.createElement('canvas');
  cv.width = Math.ceil(vp.width); cv.height = Math.ceil(vp.height);
  await page.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise;

  const cw = Math.floor(cv.width / 2), ch = Math.floor(cv.height / 2);
  const out = document.createElement('canvas');
  out.width = cw; out.height = ch;
  out.getContext('2d').drawImage(cv, (qi % 2) * cw, ((qi / 2) | 0) * ch, cw, ch, 0, 0, cw, ch);

  return {
    canvas: out, ar: cw / ch, page: num, quadrant: qi,
    packId: pick.packId, cardNumber: pick.n, title: deck.title, pdf: deck.pdf, pages: doc.numPages
  };
}

// -------------------------------------------------------- Hero-Billboard
export async function loadHero(GLTFLoader, donorFile, targetHeight = 4.2) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(RACE(donorFile));
  const model = gltf.scene;
  const raw = new THREE.Box3().setFromObject(model);
  const size = raw.getSize(new THREE.Vector3());
  const scale = targetHeight / Math.max(0.001, size.y);
  model.scale.setScalar(scale);
  model.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  model.updateMatrixWorld(true);

  const holder = new THREE.Group();
  holder.name = 'kfb-billboard-hero:' + donorFile;
  holder.add(model);

  // The donor ships as ONE merged mesh (no separate "ad face" node to isolate), with its
  // own placeholder ad art (e.g. "TANKCO") baked onto its front. Rather than guess offsets
  // from the model's local origin — which does NOT sit at the box corner, the bug that
  // used to float the card off to one side — measure the box directly: front face = box.max.z,
  // horizontal centre = box centre.x. Mount our card panel flush there, sized to fully cover
  // that face, with a hair's z-epsilon so it renders in front and occludes the donor art.
  const box = new THREE.Box3().setFromObject(model);
  const bs = box.getSize(new THREE.Vector3());
  const centre = box.getCenter(new THREE.Vector3());
  // Measured directly off this donor's ad-face quad (billboard.glb, "tankco" material):
  // full model width, exactly the top half of model height, flush with the front bezel.
  const panelW = bs.x, panelH = bs.y * 0.5;
  const cx = centre.x, cy = box.max.y - panelH / 2, cz = box.max.z + 0.012;

  const panel = new THREE.Mesh(new THREE.PlaneGeometry(panelW, panelH), new THREE.MeshBasicMaterial({ color: 0x1b2430 }));
  panel.position.set(cx, cy, cz);
  panel.name = 'billboard-card-surface';
  holder.add(panel);
  const back = panel.clone();
  back.material = new THREE.MeshBasicMaterial({ color: 0x2a2019 });
  back.rotation.y = Math.PI;
  holder.add(back);

  return {
    group: holder, model, panel,
    measuredM: { x: +bs.x.toFixed(2), y: +bs.y.toFixed(2), z: +bs.z.toFixed(2) },
    scale: +scale.toFixed(4), panelW, panelH, donor: donorFile,
    path: 'media/3D_Assets/kenney_racing-kit/Models/GLTF format/' + donorFile
  };
}

export async function loadSimple(GLTFLoader, file, targetHeight) {
  const g = await new GLTFLoader().loadAsync(RACE(file));
  const s = g.scene;
  s.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const box = new THREE.Box3().setFromObject(s);
  const size = box.getSize(new THREE.Vector3());
  if (targetHeight) { const sc = targetHeight / Math.max(0.001, size.y); s.scale.setScalar(sc); }
  const b2 = new THREE.Box3().setFromObject(s);
  s.position.y -= b2.min.y;
  return { scene: s, size, path: 'media/3D_Assets/kenney_racing-kit/Models/GLTF format/' + file };
}

// -------------------------------------------------------- Natur (echter Owner-Weg)
export async function natureProp(patterns, fallbackColor) {
  try {
    const a = await REG.pick('kaykit-forest-nature-pack-1-0-free', ...patterns);
    if (!a) throw new SourceRequired('kein Treffer in forest-nature-pack für ' + patterns.map(String));
    const r = await mountAsset(a);
    return { node: r.node, source: r.facts.path, rev: r.facts.rev };
  } catch (e) {
    const g = new THREE.IcosahedronGeometry(0.34 + Math.random() * 0.22, 0);
    const m = new THREE.MeshStandardMaterial({ color: fallbackColor || 0x8b8378, roughness: 0.95, flatShading: true });
    return { node: new THREE.Mesh(g, m), source: 'PROCEDURAL_FALLBACK', rev: null, error: e.message };
  }
}

export function weedTuft(s = 1) {
  const g = new THREE.Group();
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0x6f8a4a, roughness: 0.9, side: THREE.DoubleSide });
  for (let i = 0; i < 5; i++) {
    const h = (0.26 + Math.random() * 0.22) * s;
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.028 * s, h, 4), bladeMat);
    blade.position.set((Math.random() - 0.5) * 0.12, h / 2, (Math.random() - 0.5) * 0.12);
    blade.rotation.z = (Math.random() - 0.5) * 0.5;
    g.add(blade);
  }
  return g;
}

// ------------------------------------------------------------------ Boden
function paperTex(hex, { blotches = [], count = 24, r = 70, grain = 0.03, size = 512, repeat = 1 } = {}) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const x = c.getContext('2d');
  x.fillStyle = hex; x.fillRect(0, 0, size, size);
  for (let i = 0; i < count; i++) {
    const col = blotches[i % Math.max(1, blotches.length)] || hex;
    const rr = r * (0.5 + Math.random());
    const gx = Math.random() * size, gy = Math.random() * size;
    const g = x.createRadialGradient(gx, gy, 1, gx, gy, rr);
    g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.globalAlpha = 0.3; x.fillStyle = g;
    x.beginPath(); x.arc(gx, gy, rr, 0, Math.PI * 2); x.fill();
  }
  x.globalAlpha = grain;
  for (let i = 0; i < size * 4; i++) {
    x.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
    x.fillRect(Math.random() * size, Math.random() * size, 1.4, 1.4);
  }
  x.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat, repeat);
  return t;
}

export function buildStage(scene, renderer) {
  const SKY = '#e9d8ad';
  scene.background = new THREE.Color(SKY);
  scene.fog = new THREE.Fog(new THREE.Color(SKY), 9, 26);
  renderer.setClearColor(new THREE.Color(SKY), 1);

  const hemi = new THREE.HemisphereLight(new THREE.Color(SKY), new THREE.Color('#5f4a34'), 2.3);
  const dir = new THREE.DirectionalLight(0xffe3a8, 1.7);
  dir.position.set(-6, 8, 5);
  dir.castShadow = true;
  dir.shadow.mapSize.set(1024, 1024);
  dir.shadow.camera.near = 1; dir.shadow.camera.far = 30;
  dir.shadow.camera.left = -10; dir.shadow.camera.right = 10;
  dir.shadow.camera.top = 10; dir.shadow.camera.bottom = -10;
  const amb = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(hemi, dir, amb);

  const dirtTex = paperTex('#5f4a34', { blotches: ['#6b5642', '#513c28'], count: 30, r: 90, repeat: 5 });
  const ground = new THREE.Mesh(new THREE.CircleGeometry(13, 48), new THREE.MeshStandardMaterial({ map: dirtTex, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const apronTex = paperTex('#8f8571', { blotches: ['#a89d86'], count: 18, r: 60, repeat: 2 });
  const apron = new THREE.Mesh(new THREE.CircleGeometry(2.4, 24), new THREE.MeshStandardMaterial({ map: apronTex, roughness: 0.96 }));
  apron.rotation.x = -Math.PI / 2; apron.position.set(0, 0.01, 0.3);
  apron.receiveShadow = true;
  scene.add(apron);

  return { ground, apron, lights: { hemi, dir, amb } };
}

// ----------------------------------------------------- Inhalt auf der Tafel
const BEATS = [
  { key: 'POV', line: 'YOU, DRIVING BY.', bg: '#2c5c56' },
  { key: 'SHOW IT', line: "UNCLE FRIZZLEBOB'S TRAVELING SIDESHOW", bg: '#c1502e' },
  { key: 'SPIN IT', line: 'NOBODY WINS. NOBODY LOSES.', bg: '#dba233' },
  { key: 'SELL IT', line: 'STAY FLUFFY.', bg: '#231a13' }
];

function paperGrain(ctx, W, H) {
  ctx.save();
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
    ctx.fillRect(Math.random() * W, Math.random() * H, 1.6, 1.6);
  }
  ctx.restore();
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(20,12,6,0.24)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

function tag(ctx, text, x, y, opts = {}) {
  ctx.save();
  const size = opts.size || 15;
  ctx.font = size + "px 'JetBrains Mono', monospace";
  const pad = 8;
  const w = ctx.measureText(text).width + pad * 2;
  ctx.fillStyle = opts.bg || 'rgba(35,26,19,0.82)';
  ctx.fillRect(x, y, w, size + 10);
  ctx.fillStyle = opts.fg || '#f2e6c9';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + pad, y + size / 2 + 5);
  ctx.restore();
  return w;
}

function wrapCenterText(ctx, text, cx, cy, maxW, lh) {
  const words = text.split(' ');
  let lines = [], cur = '';
  ctx.textAlign = 'center';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; }
    else cur = test;
  }
  lines.push(cur);
  const startY = cy - (lines.length - 1) * lh / 2;
  lines.forEach((l, i) => ctx.fillText(l, cx, startY + i * lh));
  ctx.textAlign = 'left';
}

function tornClip(ctx, x, y, w, h, jitter = 6, seg = 7) {
  const pts = [];
  const edges = [[x, y, x + w, y], [x + w, y, x + w, y + h], [x + w, y + h, x, y + h], [x, y + h, x, y]];
  for (const [x1, y1, x2, y2] of edges) {
    for (let i = 0; i <= seg; i++) {
      const t = i / seg;
      const px = x1 + (x2 - x1) * t, py = y1 + (y2 - y1) * t;
      const nx = -(y2 - y1), ny = (x2 - x1);
      const len = Math.hypot(nx, ny) || 1;
      const j = (Math.random() - 0.5) * jitter * (i > 0 && i < seg ? 1 : 0.15);
      pts.push([px + (nx / len) * j, py + (ny / len) * j]);
    }
  }
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}

function drawCardFace(ctx, W, H, result, error, crop, revealed) {
  ctx.fillStyle = '#c1502e'; ctx.fillRect(0, 0, W, H);
  if (!result) {
    ctx.fillStyle = '#8a6a3a';
    ctx.fillRect(W * 0.08, H * 0.14, W * 0.84, H * 0.72);
    ctx.fillStyle = '#f2e6c9';
    ctx.textAlign = 'center';
    ctx.font = "700 26px 'JetBrains Mono', monospace";
    ctx.fillText('CARD SOURCE UNAVAILABLE', W / 2, H * 0.44);
    ctx.font = "13px 'JetBrains Mono', monospace";
    ctx.fillText('media/kfb/index.json · pdf.js — ' + (error || 'lädt…').slice(0, 58), W / 2, H * 0.52);
    ctx.textAlign = 'left';
    paperGrain(ctx, W, H);
    return;
  }
  const img = result.canvas, iw = img.width, ih = img.height;
  if (crop === 'FIT_CARD') {
    const s = Math.min(W / iw, H / ih) * 0.94, dw = iw * s, dh = ih * s;
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
  } else if (crop === 'COVER_CROP') {
    const s = Math.max(W / iw, H / ih), dw = iw * s, dh = ih * s;
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
  } else {
    const s = Math.max(W / iw, H / ih) * 1.9, dw = iw * s, dh = ih * s;
    ctx.drawImage(img, (W - dw) / 2 - dw * 0.08, (H - dh) / 2, dw, dh);
  }
  paperGrain(ctx, W, H);
  tag(ctx, crop, 14, H - 34);
  tag(ctx, result.title + ' · #' + result.cardNumber, 14, 14, { bg: 'rgba(35,26,19,0.72)' });
  if (revealed) tag(ctx, 'p.' + result.page + ' q' + result.quadrant + ' · ' + result.pdf.slice(0, 38), 14, 46, { bg: 'rgba(44,92,86,0.9)' });
}

function drawTripletFace(ctx, W, H, idx, revealed) {
  const b = BEATS[idx];
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate((idx % 2 === 0 ? -1 : 1) * 0.012);
  ctx.translate(-W / 2, -H / 2);
  ctx.fillStyle = b.bg; ctx.fillRect(-20, -20, W + 40, H + 40);
  ctx.strokeStyle = 'rgba(242,230,201,0.35)'; ctx.lineWidth = 10;
  ctx.strokeRect(14, 14, W - 28, H - 28);
  ctx.fillStyle = '#f2e6c9';
  ctx.font = "20px 'JetBrains Mono', monospace";
  ctx.fillText('UNCLE FRIZZLEBOB · ROADSIDE MEDIA', 34, 46);
  ctx.font = '700 ' + Math.min(60, Math.max(30, (W * 0.86) / (b.line.length * 0.34))) + "px 'Anton', sans-serif";
  wrapCenterText(ctx, b.line, W / 2, H * 0.56, W * 0.86, 60);
  ctx.font = "16px 'JetBrains Mono', monospace";
  ctx.textAlign = 'right';
  ctx.fillText(b.key + '  ' + (idx + 1) + '/4', W - 34, H - 30);
  ctx.textAlign = 'left';
  if (revealed) {
    ctx.font = "italic 20px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText('EVERYBODY LEAVES SLIGHTLY CHANGED.', W / 2, H * 0.82);
    ctx.textAlign = 'left';
  }
  ctx.restore();
  paperGrain(ctx, W, H);
}

function drawCollageFace(ctx, W, H, cardResult, t, revealed) {
  ctx.fillStyle = '#231a13'; ctx.fillRect(0, 0, W, H);
  const frags = [
    { x: W * 0.04, y: H * 0.08, w: W * 0.46, h: H * 0.5, rot: -0.04, speed: 0.6, phase: 0 },
    { x: W * 0.42, y: H * 0.34, w: W * 0.42, h: H * 0.48, rot: 0.05, speed: 0.5, phase: 1.4 },
    { x: W * 0.18, y: H * 0.5, w: W * 0.36, h: H * 0.42, rot: -0.02, speed: 0.7, phase: 2.6 }
  ];
  frags.forEach((f, i) => {
    const alpha = revealed ? 0.94 : Math.max(0.4, 0.6 + 0.3 * Math.sin(t * f.speed + f.phase));
    const drift = revealed ? 0 : Math.sin(t * 0.3 + f.phase) * 6;
    ctx.save();
    ctx.globalAlpha = Math.min(1, alpha);
    ctx.translate(f.x + f.w / 2 + drift, f.y + f.h / 2);
    ctx.rotate(f.rot);
    tornClip(ctx, -f.w / 2, -f.h / 2, f.w, f.h, 7, 7);
    ctx.clip();
    if (cardResult && cardResult.canvas) {
      const img = cardResult.canvas;
      const s = Math.max(f.w / img.width, f.h / img.height) * (1 + i * 0.15);
      ctx.drawImage(img, -img.width * s / 2, -img.height * s / 2, img.width * s, img.height * s);
      ctx.fillStyle = 'rgba(35,26,19,0.18)'; ctx.fillRect(-f.w / 2, -f.h / 2, f.w, f.h);
    } else {
      ctx.fillStyle = i % 2 ? '#dba233' : '#2c5c56';
      ctx.fillRect(-f.w / 2, -f.h / 2, f.w, f.h);
      ctx.fillStyle = '#f2e6c9';
      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.fillText('FRAGMENT — awaiting KFB card art', 0, 0);
      ctx.textAlign = 'left';
    }
    ctx.restore();
  });
  ctx.save();
  ctx.globalAlpha = revealed ? 1 : 0.5;
  ctx.fillStyle = '#f2e6c9';
  ctx.font = '700 ' + (revealed ? 150 : 128) + "px 'Anton', sans-serif";
  ctx.textAlign = 'center';
  ctx.translate(W * 0.62, H * 0.72);
  ctx.rotate(-0.05);
  ctx.fillText(revealed ? 'FLUFFY' : 'STAY', 0, 0);
  ctx.restore();
  paperGrain(ctx, W, H);
  tag(ctx, 'COLLAGE LOOP · HyperNormalisation cut', 14, 14);
}

export class BillboardContent {
  constructor(panelMesh) {
    this.panel = panelMesh;
    this.cv = document.createElement('canvas');
    this.cv.width = 1024; this.cv.height = 676;
    this.ctx = this.cv.getContext('2d');
    this.tex = new THREE.CanvasTexture(this.cv);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    panelMesh.material.dispose();
    panelMesh.material = new THREE.MeshBasicMaterial({ map: this.tex });
    this.mode = 'TRIPLET'; this.crop = 'FIT_CARD'; this.inspect = 'DEFAULT';
    this.cardIdx = 0; this.cardResult = null; this.cardError = null;
    this.beat = 0; this.beatT = 0; this.autoAdvance = true;
    this.collageT = 0; this.dirty = true;
    this._fetchCard();
  }
  static clone(mesh, prev) {
    const c = new BillboardContent(mesh);
    if (prev) Object.assign(c, {
      mode: prev.mode, crop: prev.crop, inspect: prev.inspect, cardIdx: prev.cardIdx,
      cardResult: prev.cardResult, cardError: prev.cardError, beat: prev.beat,
      autoAdvance: prev.autoAdvance
    });
    c.dirty = true;
    return c;
  }
  async _fetchCard() {
    this.cardResult = null; this.cardError = null; this.dirty = true;
    try { this.cardResult = await renderCardQuarter(CARD_POOL[this.cardIdx]); }
    catch (e) { this.cardError = e.message; }
    this.dirty = true;
  }
  setMode(m) { this.mode = m; this.dirty = true; }
  setCrop(c) { this.crop = c; this.dirty = true; }
  cycleCard() { this.cardIdx = (this.cardIdx + 1) % CARD_POOL.length; this._fetchCard(); }
  setInspect(s) { this.inspect = s; this.dirty = true; }
  update(dt) {
    let need = this.dirty; this.dirty = false;
    if (this.mode === 'TRIPLET' && this.autoAdvance && this.inspect !== 'REVEAL') {
      this.beatT += dt;
      if (this.beatT > 2.6) { this.beatT = 0; this.beat = (this.beat + 1) % 4; need = true; }
    }
    if (this.mode === 'COLLAGE') { this.collageT += dt; need = true; }
    if (need) this._draw();
  }
  _draw() {
    const { ctx, cv } = this, W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    if (this.mode === 'CARD') drawCardFace(ctx, W, H, this.cardResult, this.cardError, this.crop, this.inspect === 'REVEAL');
    else if (this.mode === 'TRIPLET') drawTripletFace(ctx, W, H, this.beat, this.inspect === 'REVEAL');
    else drawCollageFace(ctx, W, H, this.cardResult, this.collageT, this.inspect === 'REVEAL');
    this.tex.needsUpdate = true;
  }
}

export { BEATS };
