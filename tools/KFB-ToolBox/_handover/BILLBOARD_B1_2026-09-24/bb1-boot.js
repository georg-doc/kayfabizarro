// KFB Billboard / Media Residency · B1 CONTENT-FIT FACE · 2026-09-24
// [GATE] B1 only. B0 bb-scene.js + bb0-boot.js are copied byte-for-byte beside this file.
// [NAHT] One additive seam: the accepted B0 hero group scales horizontally to the measured
// content aspect. Because model + B0 face are in the SAME holder, posts/frame follow the face.
// No alternate billboard mesh, no replacement branding, no second card owner.
//
// Source-first:
// - B0 loadHero()/renderCardQuarter()/buildStage(): ./bb-scene.js (UNCHANGED B0 blob)
// - YouTube poster/player contract: Travel academy-deck.js + travel-poc.js
// - Cover PDF rendering: same media/kfb/index.json + pdf.js 4.7.76; page.render onContinue hook
//   reused from the existing Combat Arena card builder to avoid hidden-rAF stalls.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HERO_DONORS, loadHero, renderCardQuarter, CARD_POOL, buildStage, BEATS } from './bb-scene.js';

const $ = (id) => document.getElementById(id);
const PDFJS = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.min.mjs';
const PDFJS_WORKER = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs';
const CARD_REGISTRY = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/kfb/index.json';
const VIDEO = {
  id: 'MTCSwppblk0',
  list: 'PLXkttda-5VwFjNvC-pISnrRYw-mFyPZwF',
  index: 10
};
const videoThumb = (v = VIDEO) => 'https://i.ytimg.com/vi/' + v.id + '/mqdefault.jpg';
const videoEmbed = (v = VIDEO) =>
  'https://www.youtube-nocookie.com/embed/' + v.id +
  '?rel=0&modestbranding=1&playsinline=1&autoplay=1' + (v.list ? '&list=' + v.list : '');

const FACE_AR_MIN = 1.10;
const FACE_AR_MAX = 2.20;
const SOURCE_PIN = '378b209355b13304e3cff656ec0806ca5b89df28';
const errors = [];
addEventListener('error', (e) => errors.push(String(e.error && e.error.stack || e.message || e)));
addEventListener('unhandledrejection', (e) => errors.push(String(e.reason && e.reason.stack || e.reason || e)));

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.domElement.style.cssText = 'position:fixed;inset:0;display:block;width:100%;height:100%;z-index:0';
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 16 / 9, 0.1, 200);
buildStage(scene, renderer);

let hero = null;
let panelMesh = null;
let cv = null;
let ctx = null;
let tex = null;
let currentMode = null;
let modeToken = 0;
let sloganIndex = 0;
let sloganTimer = null;
let pointerMoved = false;

const report = {
  slice: 'BILLBOARD_B1_2026-09-24',
  owner: 'KFB ToolBox / Billboard Media Residency',
  donor: 'media/3D_Assets/kenney_racing-kit/Models/GLTF format/billboard.glb',
  donorPin: SOURCE_PIN,
  b0Fork: { bbScene: 'UNCHANGED', bb0Boot: 'UNCHANGED' },
  sourceFace: null,
  baseAspect: null,
  mode: null,
  sourceAspect: null,
  faceAspect: null,
  xScale: 1,
  clamped: false,
  content: null,
  ready: false,
  errors
};
window.__B1_REPORT__ = report;

function setDiag(extra = '') {
  const el = $('b1-diag');
  if (!el) return;
  el.textContent = [
    'slice: ' + report.slice,
    'B0 fork: bb-scene.js UNCHANGED · bb0-boot.js UNCHANGED',
    'donor: ' + report.donor + ' @' + SOURCE_PIN.slice(0, 12),
    'B0 face: ' + (report.sourceFace || 'loading…'),
    'mode: ' + (report.mode || '—'),
    'source AR: ' + (report.sourceAspect == null ? '—' : report.sourceAspect.toFixed(4)),
    'face AR: ' + (report.faceAspect == null ? '—' : report.faceAspect.toFixed(4)),
    'holder x-scale: ' + report.xScale.toFixed(4),
    report.clamped ? 'CLAMPED: source AR outside B1 range' : 'clamp: inactive',
    'content: ' + (report.content || '—'),
    errors.length ? 'errors: ' + errors.length + ' · ' + errors[errors.length - 1].slice(0, 220) : 'errors: 0',
    extra
  ].filter(Boolean).join('\n');
}

function withTimeout(p, ms, label) {
  return Promise.race([p, new Promise((_, reject) => setTimeout(() => reject(new Error(label)), ms))]);
}

function setBusy(label) {
  report.ready = false;
  report.content = 'loading ' + label;
  document.documentElement.dataset.b1Ready = '0';
  setDiag();
}

function ensureAspect(ar) {
  if (!Number.isFinite(ar) || ar <= 0) throw new Error('invalid content aspect ' + ar);
  const target = Math.max(FACE_AR_MIN, Math.min(FACE_AR_MAX, ar));
  const clamped = Math.abs(target - ar) > 0.0005;
  // B1 supports only media that fit the face range without sacrificing content.
  // Fail closed rather than stretch/crop/letterbox a future unsupported medium.
  if (clamped) throw new Error('content AR ' + ar.toFixed(3) + ' outside B1 face clamp ' + FACE_AR_MIN + '…' + FACE_AR_MAX);
  hero.group.scale.x = target / report.baseAspect;
  report.sourceAspect = ar;
  report.faceAspect = target;
  report.xScale = hero.group.scale.x;
  report.clamped = false;
  return target;
}

function resizeCanvas(ar) {
  const W = 1280;
  cv.width = W;
  cv.height = Math.max(1, Math.round(W / ar));
  ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
}

function showCanvas(source, ar, label) {
  const faceAR = ensureAspect(ar);
  resizeCanvas(faceAR);
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.drawImage(source, 0, 0, cv.width, cv.height);
  tex.needsUpdate = true;
  report.content = label;
  report.ready = true;
  document.documentElement.dataset.b1Ready = '1';
  setDiag();
}

async function renderCover(packId) {
  const reg = await (await fetch(CARD_REGISTRY, { cache: 'no-store' })).json();
  const deck = (reg.decks || []).find((d) => d.packId === packId);
  if (!deck || !deck.pdf) throw new Error('deck not in registry: ' + packId);

  const lib = await import(/* @vite-ignore */ PDFJS);
  try {
    const workerSrc = await (await fetch(PDFJS_WORKER)).text();
    lib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(new Blob([workerSrc], { type: 'text/javascript' }));
  } catch (_) {
    lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
  }

  const url = reg.baseUrl + '/' + encodeURIComponent(deck.pdf);
  const pdfResp = await fetch(url);
  if (!pdfResp.ok) throw new Error('PDF ' + pdfResp.status);
  const data = await pdfResp.arrayBuffer();
  const doc = await lib.getDocument({ data: data.slice(0) }).promise;
  const page = await doc.getPage(1); // registry contract: coverOffset=1 => page 1 is cover
  const scale = 1600 / page.getViewport({ scale: 1 }).width;
  const vp = page.getViewport({ scale });
  const out = document.createElement('canvas');
  out.width = Math.ceil(vp.width);
  out.height = Math.ceil(vp.height);
  const task = page.render({ canvasContext: out.getContext('2d'), viewport: vp });
  task.onContinue = (next) => next();
  await task.promise;
  return { canvas: out, ar: out.width / out.height, title: deck.title, pdf: deck.pdf, page: 1 };
}

async function loadPoster() {
  const resp = await fetch(videoThumb(), { cache: 'force-cache' });
  if (!resp.ok) throw new Error('YouTube poster ' + resp.status);
  const blob = await resp.blob();
  const bitmap = await createImageBitmap(blob);
  const out = document.createElement('canvas');
  out.width = 1280;
  out.height = 720;
  const x = out.getContext('2d');
  x.drawImage(bitmap, 0, 0, out.width, out.height);
  x.fillStyle = 'rgba(18,13,9,.34)';
  x.beginPath(); x.arc(out.width / 2, out.height / 2, 78, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#f7f0dd';
  x.beginPath();
  x.moveTo(out.width / 2 - 24, out.height / 2 - 42);
  x.lineTo(out.width / 2 + 50, out.height / 2);
  x.lineTo(out.width / 2 - 24, out.height / 2 + 42);
  x.closePath(); x.fill();
  return { canvas: out, ar: 16 / 9 };
}

function drawSlogan() {
  const triplet = BEATS.filter((b) => b.key === 'SHOW IT' || b.key === 'SPIN IT' || b.key === 'SELL IT');
  const beat = triplet[sloganIndex % triplet.length];
  const ar = 2;
  ensureAspect(ar);
  resizeCanvas(ar);
  ctx.fillStyle = beat.bg;
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = '#f2e6c9';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = "400 230px 'Anton', Impact, sans-serif";
  ctx.fillText(beat.key, cv.width / 2, cv.height / 2 + 4);
  tex.needsUpdate = true;
  report.content = 'CHATTERBOX ' + beat.key;
  report.ready = true;
  document.documentElement.dataset.b1Ready = '1';
  setDiag();
}

function setActive(mode) {
  document.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));
  $('b1-video-hint').style.display = mode === 'video' ? 'block' : 'none';
}

async function setMode(mode) {
  if (!['quarter', 'cover', 'video', 'slogan'].includes(mode)) mode = 'quarter';
  const token = ++modeToken;
  currentMode = mode;
  report.mode = mode;
  setActive(mode);
  clearInterval(sloganTimer);
  closeVideo();
  setBusy(mode);

  try {
    if (mode === 'quarter') {
      const result = await withTimeout(
        renderCardQuarter(CARD_POOL[0]),
        15000,
        'unchanged B0 renderCardQuarter() did not resolve in 15s'
      );
      if (token !== modeToken) return;
      showCanvas(result.canvas, result.ar, result.title + ' #' + result.cardNumber + ' · measured quarter AR');
    } else if (mode === 'cover') {
      const result = await withTimeout(renderCover(CARD_POOL[0].packId), 15000, 'cover render did not resolve in 15s');
      if (token !== modeToken) return;
      showCanvas(result.canvas, result.ar, result.title + ' · cover page 1');
    } else if (mode === 'video') {
      const result = await withTimeout(loadPoster(), 10000, 'YouTube poster did not resolve in 10s');
      if (token !== modeToken) return;
      showCanvas(result.canvas, result.ar, 'Travel VIDEO ' + VIDEO.id + ' · 16:9 poster');
    } else {
      sloganIndex = 0;
      drawSlogan();
      sloganTimer = setInterval(() => {
        if (currentMode !== 'slogan') return;
        sloganIndex = (sloganIndex + 1) % 3;
        drawSlogan();
      }, 2600);
    }
  } catch (e) {
    errors.push(String(e && e.stack || e));
    report.content = 'FAILED · ' + e.message;
    report.ready = false;
    document.documentElement.dataset.b1Ready = '0';
    setDiag();
    console.error('[B1]', e);
  }
}

function openVideo() {
  if (currentMode !== 'video') return;
  const box = $('b1-video');
  const f = box.querySelector('iframe');
  f.src = videoEmbed();
  box.classList.add('open');
  box.setAttribute('aria-hidden', 'false');
}
function closeVideo() {
  const box = $('b1-video');
  if (!box) return;
  const f = box.querySelector('iframe');
  if (f) f.src = 'about:blank';
  box.classList.remove('open');
  box.setAttribute('aria-hidden', 'true');
}

async function mountHero() {
  const donorFile = HERO_DONORS[0].file;
  hero = await loadHero(GLTFLoader, donorFile, 4.2);
  hero.group.position.set(0, 0, 0);

  // Literal B0 framing step: recenter the entire donor + accepted card plane together.
  const box0 = new THREE.Box3().setFromObject(hero.group);
  const c0 = box0.getCenter(new THREE.Vector3());
  hero.group.position.x -= c0.x;
  hero.group.position.z -= c0.z;
  hero.group.position.y -= box0.min.y;
  scene.add(hero.group);

  panelMesh = hero.panel;
  report.baseAspect = hero.panelW / hero.panelH;
  report.sourceFace = hero.panelW.toFixed(2) + ' × ' + hero.panelH.toFixed(2) + ' world units';
  console.info('[B1 source-isolate] B0 face', report.sourceFace, 'AR', report.baseAspect.toFixed(4));

  cv = document.createElement('canvas');
  resizeCanvas(report.baseAspect);
  tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  panelMesh.material.dispose();
  panelMesh.material = new THREE.MeshBasicMaterial({ map: tex });

  const queryMode = new URLSearchParams(location.search).get('mode') || 'quarter';
  await setMode(queryMode);
}

mountHero().catch((e) => {
  errors.push(String(e && e.stack || e));
  report.content = 'BOOT FAILED · ' + e.message;
  setDiag();
  console.error('[B1 boot]', e);
});

// Camera = B0 orbit contract, unchanged values.
const CAMS = {
  FRONT: { yaw: 0.0, pitch: 0.14, dist: 6.4 },
  LEFT34: { yaw: -0.62, pitch: 0.20, dist: 7.2 },
  RIGHT34: { yaw: 0.62, pitch: 0.20, dist: 7.2 },
  WIDE: { yaw: 0.5, pitch: 0.42, dist: 16 }
};
const S = { ...CAMS.FRONT };
const centre = new THREE.Vector3(0, 1.9, 0);
function applyCamera() {
  const h = Math.cos(S.pitch), v = Math.sin(S.pitch);
  camera.position.set(
    centre.x + Math.sin(S.yaw) * h * S.dist,
    v * S.dist + centre.y,
    centre.z + Math.cos(S.yaw) * h * S.dist
  );
  camera.lookAt(centre);
}

let dragging = false, px = 0, py = 0;
const el = renderer.domElement;
el.style.touchAction = 'none';
el.addEventListener('pointerdown', (e) => {
  dragging = true; pointerMoved = false; px = e.clientX; py = e.clientY; el.setPointerCapture(e.pointerId);
});
el.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - px, dy = e.clientY - py;
  if (Math.abs(dx) + Math.abs(dy) > 3) pointerMoved = true;
  S.yaw -= dx * 0.006;
  S.pitch = Math.max(0.02, Math.min(1.1, S.pitch + dy * 0.004));
  px = e.clientX; py = e.clientY;
});
el.addEventListener('pointerup', (e) => {
  dragging = false;
  try { el.releasePointerCapture(e.pointerId); } catch (_) {}
  if (!pointerMoved && currentMode === 'video' && panelMesh) {
    const rect = el.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    const ray = new THREE.Raycaster();
    ray.setFromCamera(ndc, camera);
    if (ray.intersectObject(panelMesh, false).length) openVideo();
  }
});
el.addEventListener('pointercancel', () => { dragging = false; });
el.addEventListener('wheel', (e) => {
  S.dist = Math.max(2.6, Math.min(20, S.dist * (1 + Math.sign(e.deltaY) * 0.07)));
}, { passive: true });

document.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => {
  if (b.dataset.mode === 'slogan' && currentMode === 'slogan') {
    sloganIndex = (sloganIndex + 1) % 3; drawSlogan(); return;
  }
  setMode(b.dataset.mode);
}));
$('b1-reset').addEventListener('click', () => { Object.assign(S, CAMS.FRONT); applyCamera(); renderer.render(scene, camera); });
$('b1-diag-toggle').addEventListener('click', () => {
  const p = $('b1-diag'); p.style.display = p.style.display === 'none' ? 'block' : 'none';
});
$('b1-video-close').addEventListener('click', closeVideo);
$('b1-video').addEventListener('click', (e) => { if (e.target === $('b1-video')) closeVideo(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeVideo(); });

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / Math.max(1, h);
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();
applyCamera();

let lastTick = performance.now();
function tick() { lastTick = performance.now(); applyCamera(); renderer.render(scene, camera); }
(function loop() { requestAnimationFrame(loop); tick(); })();
setInterval(() => { if (performance.now() - lastTick > 120) tick(); }, 60);

window.__b1 = {
  setMode,
  setView(name) { const p = CAMS[name]; if (p) { Object.assign(S, p); applyCamera(); renderer.render(scene, camera); } },
  report,
  VIDEO
};
