// KFB Billboard Context R11 · 2026-10-02
// Stacked on HUMAN_ACCEPTED B2a / PR #199. H13 is a frozen content donor.
// This file keeps one Billboard runtime owner. H13 runs only as a same-origin 1024x512 content source.
// KFB Billboard / Media Residency · B2a INLINE YOUTUBE / CSS3D · 2026-09-24
// Base: accepted B1 @78f09f5e9b28b606a121bda1b43dcd8c8aff5f1a.
// Protected B0/B1 sources are copied beside this file unchanged.
//
// [DONOR COPY]
// mrdoob/three.js r160 examples/css3d_youtube.html
// commit d04539a76736ff500cae883d6a38b3dd8643c548
// copied pattern: CSS3DRenderer + CSS3DObject + iframe + drag blocker.
//
// [NAHT]
// B2a does only one new thing: the donor CSS3D YouTube plane copies the accepted B1 panel's
// world transform and measured face dimensions. CARD/COVER/SLOGAN stay on the B1 CanvasTexture path.
// No modal player, no second billboard body, no second video/content owner.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { HERO_DONORS, loadHero, renderCardQuarter, CARD_POOL, buildStage, BEATS } from '../BILLBOARD_B2A_CSS3D_2026-09-24/bb-scene.js';
import * as K2 from './worldlook-k2/clay-material.v10.js';
import { makeClayRelief } from './worldlook-k2/clay-relief.v2.js';
import { makeToolReliefs } from './worldlook-k2/clay-relief.v5.js';
import { TOOLMIX } from './worldlook-k2/clay-toolmix.v1.js';

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
  '?rel=0&modestbranding=1&playsinline=1' + (v.list ? '&list=' + v.list : '');

const FACE_AR_MIN = 1.10;
const FACE_AR_MAX = 2.20;
const SOURCE_PIN = '378b209355b13304e3cff656ec0806ca5b89df28';
const CSS_VIDEO_W = 1280;
const CSS_VIDEO_H = 720;
const THREE_DONOR = 'mrdoob/three.js@d04539a76736ff500cae883d6a38b3dd8643c548/examples/css3d_youtube.html';
const H13_URL = './h13/KFB Billboard Kaleidoscope H13.dc.html';
const CONTEXT_STATES = ['idle', 'approach', 'focus', 'interact', 'media'];
const DEFAULT_CONTEXT = Object.freeze({
  islandId: null,
  residentId: null,
  packId: 'forget_utopia',
  selectedCard: 7,
  paletteSource: 'CARDS',
  kfbShare: 0.65
});

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

const cssRenderer = new CSS3DRenderer();
cssRenderer.domElement.id = 'b2a-css3d-layer';
cssRenderer.domElement.style.cssText = 'position:fixed;inset:0;z-index:2;pointer-events:none;overflow:hidden;';
document.body.appendChild(cssRenderer.domElement);

const scene = new THREE.Scene();
const cssScene = new THREE.Scene();
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

let videoObject = null;
let videoSurface = null;
let videoIframe = null;
let videoBlocker = null;
let videoModeActive = false;

let contextState = 'idle';
const context = { ...DEFAULT_CONTEXT };
let h13Frame = null;
let h13Face = null;
let h13Ready = false;
let liveH13 = false;

let physicalBodyRoot = null;
let clayU = null;
let clayReady = null;
let worldLookSourcePanelMaterialUuid = null;
const WORLDLOOK_K2 = Object.freeze({
  materialBlob: 'd994a9b656131be3b7a13d45edcb4253d34f3620',
  profilesBlob: 'af57b88ae382a36514f9fa50beed5ab6ca18647a',
  reliefLegacyBlob: '2bb843d29e9f2571f87d9e6210f34240b1a0a1a9',
  reliefToolsBlob: '1dfd171e08b14f996601189a7f2c108101f84132',
  toolmixBlob: 'b9a039ccfb90ea04910db3cf05928817d92e9399',
  integrationDonorBlob: 'fc31353ede12696717fa4943200f89e4b7eb67a0'
});

const report = {
  slice: 'BILLBOARD_CONTEXT_R11_2026-10-02',
  owner: 'KFB ToolBox / Billboard Media Residency',
  donor: 'media/3D_Assets/kenney_racing-kit/Models/GLTF format/billboard.glb',
  donorPin: SOURCE_PIN,
  b0Fork: { bbScene: 'UNCHANGED', bb0Boot: 'UNCHANGED' },
  b1Fork: { bb1Boot: 'UNCHANGED_REFERENCE', acceptedHead: '78f09f5e9b28b606a121bda1b43dcd8c8aff5f1a' },
  css3dDonor: THREE_DONOR,
  sourceFace: null,
  baseAspect: null,
  mode: null,
  sourceAspect: null,
  faceAspect: null,
  xScale: 1,
  clamped: false,
  content: null,
  sourceStats: null,
  ready: false,
  css3d: {
    visible: false,
    iframeSrc: 'about:blank',
    objectWorldWidth: null,
    objectWorldHeight: null,
    panelWorldWidth: null,
    panelWorldHeight: null,
    syncCount: 0,
    blockerActive: false,
    modalPresent: false,
    frontOnly: true,
    modeActive: false,
    frontFacing: null,
    facingDot: null,
    renderVisible: false
  },
  context: {
    state: contextState,
    islandId: context.islandId,
    residentId: context.residentId,
    packId: context.packId,
    selectedCard: context.selectedCard,
    paletteSource: context.paletteSource,
    physicalPaletteApplied: false
  },
  worldLook: {
    owner: 'K2 clay-material.v10 + Travel WorldContext accent',
    applied: false,
    accent: null,
    seed: null,
    bodyMeshes: 0,
    clayMaterials: 0,
    sourceMaterialsPreserved: false,
    contentPlaneUntouched: true,
    sourceBox: null,
    adaptedBox: null,
    k2: WORLDLOOK_K2,
    profile: 'prop + TOOLMIX.vehicle · WK=3 · QUIET',
    fingerprints: 'disabled in isolated proof; no external print texture required',
    clayBuildMs: null
  },
  h13: {
    frozen: true,
    source: H13_URL,
    ready: false,
    rootName: null,
    face: null,
    propSeam: '__dcSetProps',
    audioOwner: 'H13 existing Analyser/song-form; no second audio clock'
  },
  errors
};
window.__B2A_REPORT__ = report;
window.__R11_REPORT__ = report;

function canvasStats(source) {
  try {
    const probe = document.createElement('canvas');
    probe.width = 32; probe.height = 32;
    const p = probe.getContext('2d', { willReadFrequently: true });
    p.drawImage(source, 0, 0, 32, 32);
    const d = p.getImageData(0, 0, 32, 32).data;
    let sum = 0, min = 255, max = 0, opaque = 0;
    for (let i = 0; i < d.length; i += 4) {
      const y = (d[i] + d[i + 1] + d[i + 2]) / 3;
      sum += y; min = Math.min(min, y); max = Math.max(max, y);
      if (d[i + 3] > 0) opaque++;
    }
    return { mean: +(sum / (d.length / 4)).toFixed(2), min: +min.toFixed(2), max: +max.toFixed(2), opaque };
  } catch (e) {
    return { error: e.message };
  }
}

function setPanelTexture(source) {
  report.sourceStats = canvasStats(source);
  if (tex) tex.dispose();
  tex = new THREE.CanvasTexture(source);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  panelMesh.material.map = tex;
  panelMesh.material.color.set(0xffffff);
  panelMesh.material.needsUpdate = true;
}

function setDiag(extra = '') {
  const el = $('b2a-diag');
  if (!el) return;
  el.textContent = [
    'slice: ' + report.slice,
    'B0: bb-scene.js + bb0-boot.js UNCHANGED',
    'B1: accepted source fork retained',
    'CSS3D donor: three r160 @ d04539a76736',
    'B0 face: ' + (report.sourceFace || 'loading…'),
    'mode: ' + (report.mode || '—'),
    'source AR: ' + (report.sourceAspect == null ? '—' : report.sourceAspect.toFixed(4)),
    'face AR: ' + (report.faceAspect == null ? '—' : report.faceAspect.toFixed(4)),
    'holder x-scale: ' + report.xScale.toFixed(4),
    'CSS3D visible: ' + report.css3d.visible,
    report.css3d.panelWorldWidth == null ? '' :
      'CSS3D/world: ' + report.css3d.objectWorldWidth.toFixed(4) + '×' + report.css3d.objectWorldHeight.toFixed(4)
      + ' · panel ' + report.css3d.panelWorldWidth.toFixed(4) + '×' + report.css3d.panelWorldHeight.toFixed(4),
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
  document.documentElement.dataset.b2aReady = '0';
  setDiag();
}

function ensureAspect(ar) {
  if (!Number.isFinite(ar) || ar <= 0) throw new Error('invalid content aspect ' + ar);
  const target = Math.max(FACE_AR_MIN, Math.min(FACE_AR_MAX, ar));
  const clamped = Math.abs(target - ar) > 0.0005;
  if (clamped) throw new Error('content AR ' + ar.toFixed(3) + ' outside B1 face clamp ' + FACE_AR_MIN + '…' + FACE_AR_MAX);
  hero.group.scale.x = target / report.baseAspect;
  report.sourceAspect = ar;
  report.faceAspect = target;
  report.xScale = hero.group.scale.x;
  report.clamped = false;
  hero.group.updateMatrixWorld(true);
  syncInlineVideoTransform();
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
  ensureAspect(ar);
  setPanelTexture(source);
  report.content = label;
  report.ready = true;
  document.documentElement.dataset.b2aReady = '1';
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
  const page = await doc.getPage(1);
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
  out.width = CSS_VIDEO_W;
  out.height = CSS_VIDEO_H;
  const x = out.getContext('2d');
  x.drawImage(bitmap, 0, 0, out.width, out.height);
  return { canvas: out, ar: 16 / 9 };
}

function createInlineVideo() {
  videoSurface = document.createElement('div');
  videoSurface.id = 'b2a-inline-video-surface';
  videoSurface.style.cssText =
    'width:' + CSS_VIDEO_W + 'px;height:' + CSS_VIDEO_H + 'px;background:#000;position:relative;'
    + 'display:none;pointer-events:auto;overflow:hidden;'
    + 'backface-visibility:hidden;-webkit-backface-visibility:hidden;transform-style:preserve-3d;';

  videoIframe = document.createElement('iframe');
  videoIframe.id = 'b2a-inline-youtube';
  videoIframe.title = 'KFB inline YouTube';
  videoIframe.style.cssText =
    'width:100%;height:100%;border:0;display:block;background:#000;'
    + 'backface-visibility:hidden;-webkit-backface-visibility:hidden;';
  videoIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture';
  videoIframe.setAttribute('allowfullscreen', '');
  videoIframe.src = 'about:blank';

  // Official donor rule: block iframe interaction while camera drag is active.
  videoBlocker = document.createElement('div');
  videoBlocker.id = 'b2a-video-blocker';
  videoBlocker.style.cssText =
    'position:absolute;inset:0;display:none;background:transparent;pointer-events:auto;z-index:2;';

  videoSurface.append(videoIframe, videoBlocker);
  videoObject = new CSS3DObject(videoSurface);
  videoObject.name = 'b2a-inline-youtube-css3d';
  // B2a human-tune: CSS3D has no WebGL depth/backface culling. Make the media plane
  // explicitly front-only so orbiting behind the billboard reveals the donor's real rear body
  // instead of a mirrored iframe. This is the seam; the Kenney body is not remodelled.
  videoSurface.style.backfaceVisibility = 'hidden';
  videoSurface.style.webkitBackfaceVisibility = 'hidden';
  videoIframe.style.backfaceVisibility = 'hidden';
  videoIframe.style.webkitBackfaceVisibility = 'hidden';
  // CSS3DRenderer owns the DOM display state. Object3D.visible is the real visibility seam.
  // Using element.style.display here is overwritten by the renderer and left an opaque black
  // CSS plane over CARD/COVER/SLOGAN in the first integration candidate.
  videoObject.visible = false;
  cssScene.add(videoObject);
  syncInlineVideoTransform();
}

function setVideoBlock(on) {
  if (!videoBlocker) return;
  videoBlocker.style.display = on && report.css3d.visible ? 'block' : 'none';
  report.css3d.blockerActive = !!(on && videoObject?.visible);
}

function showInlineVideo() {
  if (!videoSurface) createInlineVideo();
  videoIframe.src = videoEmbed();
  videoModeActive = true;
  report.css3d.modeActive = true;
  report.css3d.iframeSrc = videoIframe.src;
  syncInlineVideoTransform();
  setDiag();
}

function hideInlineVideo() {
  if (!videoSurface || !videoIframe) return;
  setVideoBlock(false);
  videoIframe.src = 'about:blank';
  videoModeActive = false;
  videoObject.visible = false;
  report.css3d.modeActive = false;
  report.css3d.visible = false;
  report.css3d.renderVisible = false;
  report.css3d.iframeSrc = 'about:blank';
  setDiag();
}

function syncInlineVideoTransform() {
  if (!hero || !panelMesh || !videoObject) return;
  panelMesh.updateWorldMatrix(true, false);
  const p = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  panelMesh.matrixWorld.decompose(p, q, s);

  videoObject.position.copy(p);
  videoObject.quaternion.copy(q);
  videoObject.scale.set(
    hero.panelW * s.x / CSS_VIDEO_W,
    hero.panelH * s.y / CSS_VIDEO_H,
    1
  );

  // CSS3D has no WebGL depth/back-face culling. Explicitly gate the DOM object by the
  // accepted billboard panel's world normal: front hemisphere = visible; rear = hidden.
  // This leaves the Kenney billboard body's real backside as the only rear-facing geometry.
  const panelNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(q).normalize();
  const toCamera = camera.position.clone().sub(p).normalize();
  const facingDot = panelNormal.dot(toCamera);
  const frontFacing = facingDot > 0.01;
  videoObject.visible = !!(videoModeActive && frontFacing);
  videoObject.updateMatrixWorld(true);

  report.css3d.panelWorldWidth = hero.panelW * s.x;
  report.css3d.panelWorldHeight = hero.panelH * s.y;
  report.css3d.objectWorldWidth = CSS_VIDEO_W * videoObject.scale.x;
  report.css3d.objectWorldHeight = CSS_VIDEO_H * videoObject.scale.y;
  report.css3d.frontFacing = frontFacing;
  report.css3d.facingDot = facingDot;
  report.css3d.renderVisible = videoObject.visible;
  report.css3d.visible = videoObject.visible;
  report.css3d.syncCount++;
}



function vecBox(root) {
  if (!root) return null;
  const b = new THREE.Box3().setFromObject(root);
  return {
    min: b.min.toArray().map(v => +v.toFixed(6)),
    max: b.max.toArray().map(v => +v.toFixed(6))
  };
}

function sameBox(a, b, eps = 1e-5) {
  if (!a || !b) return false;
  const A = [...a.min, ...a.max], B = [...b.min, ...b.max];
  return A.every((v, i) => Math.abs(v - B[i]) <= eps);
}

function k2Texture(data, size) {
  const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}

function k2PropProfile() {
  const WK = 3;
  const QUIET = { print: 0.3, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 0.9, crease: 0.5 };
  const p = { ...K2.PROFILES.prop, ...QUIET };
  p.scale *= WK;
  p.gougeSize *= WK;
  p.crackSize *= WK;
  p.dentSize *= WK;
  p.tools = TOOLMIX.vehicle;
  return p;
}

async function ensureK2Clay() {
  if (clayReady) return clayReady;
  clayReady = (async () => {
    const t0 = performance.now();
    const size = 1024;
    const rel = makeClayRelief({ size, seed: 31 });
    const relT = k2Texture(rel.data, rel.size);
    const tools = await makeToolReliefs({ size, seed: 41 });
    const U = K2.makeClayUniforms(THREE, relT);
    [U.uClayToolA.value, U.uClayToolB.value, U.uClayToolC.value] = tools.maps.map(d => k2Texture(d, tools.size));
    U.uClayToolOn.value = 1;
    U.uClayLegacyStroke.value = 0;
    U.uClayMottle.value = 0.04;
    U.uClayHand.value = 1.5;
    U.uClayTile.value = 4.8;
    U.uClayPrintTile.value = 13.5;
    U.uClayMacro.value = 0.5;
    U.uClayLodK.value = 0.6;
    U.uClayStroke.value = 0.7;
    clayU = U;
    report.worldLook.clayBuildMs = Math.round(performance.now() - t0);
    return U;
  })();
  return clayReady;
}

async function setWorldLook({ accent, seed } = {}) {
  if (!physicalBodyRoot) throw new Error('physical billboard donor body unavailable');

  // Measure the exact current B1-fitted source state immediately before K2 adaptation.
  // H13 may already have changed the accepted content-fit scale and panel material by now.
  const preAdaptBox = vecBox(physicalBodyRoot);
  const preAdaptPanelMaterialUuid = panelMesh?.material?.uuid || null;
  report.worldLook.sourceBox = preAdaptBox;

  const U = await ensureK2Clay();
  const color = String(accent || '#ffb27a');
  const worldSeed = Number.isFinite(Number(seed)) ? Number(seed) : 1985738440;
  const profile = k2PropProfile();
  let bodyMeshes = 0, clayMaterials = 0, preserved = true, meshIndex = 0;

  physicalBodyRoot.traverse((o) => {
    if (!o.isMesh || !o.material) return;
    bodyMeshes++;
    if (!o.userData.worldLookSourceMaterial) o.userData.worldLookSourceMaterial = o.material;
    const src = o.userData.worldLookSourceMaterial;
    preserved = preserved && !!src;

    if (!o.userData.worldLookSeededGeometry) {
      o.geometry = K2.seedGeometry(THREE, o.geometry.clone(), worldSeed + meshIndex * 131);
      o.userData.worldLookSeededGeometry = true;
    }
    meshIndex++;

    const sourceList = Array.isArray(src) ? src : [src];
    const out = sourceList.map((m) => {
      if (!m) return m;
      const cm = K2.makeClayMaterial(THREE, U, {
        src: m,
        color,
        profile,
        objSize: 0
      });
      cm.userData.worldContextAccent = color;
      cm.userData.worldContextSeed = worldSeed;
      clayMaterials++;
      return cm;
    });
    o.material = Array.isArray(src) ? out : out[0];
  });

  physicalBodyRoot.updateMatrixWorld(true);
  report.worldLook.applied = true;
  report.worldLook.accent = color.toLowerCase();
  report.worldLook.seed = worldSeed;
  report.worldLook.bodyMeshes = bodyMeshes;
  report.worldLook.clayMaterials = clayMaterials;
  report.worldLook.sourceMaterialsPreserved = preserved;
  report.worldLook.adaptedBox = vecBox(physicalBodyRoot);
  report.worldLook.geometryUnchanged = sameBox(preAdaptBox, report.worldLook.adaptedBox);
  report.worldLook.contentPlaneUntouched =
    !!panelMesh && !!preAdaptPanelMaterialUuid && panelMesh.material.uuid === preAdaptPanelMaterialUuid;
  return structuredClone(report.worldLook);
}

function activeCard() {
  return { packId: context.packId, n: Number(context.selectedCard) || 1 };
}

function updateContextReport() {
  Object.assign(report.context, {
    state: contextState,
    islandId: context.islandId ?? null,
    residentId: context.residentId ?? null,
    packId: context.packId,
    selectedCard: context.selectedCard,
    paletteSource: context.paletteSource,
    physicalPaletteApplied: false
  });
}

function applyH13Props() {
  if (!h13Frame?.contentWindow || !h13Ready) return;
  const w = h13Frame.contentWindow;
  const root = w.__dcRootName?.();
  if (!root || typeof w.__dcSetProps !== 'function') return;
  w.__dcSetProps(root, {
    palSource: context.paletteSource || 'CARDS',
    kfbShare: Number.isFinite(Number(context.kfbShare)) ? Number(context.kfbShare) : 0.65
  });
  report.h13.rootName = root;
}

async function ensureH13() {
  if (h13Ready && h13Face?.isConnected) {
    applyH13Props();
    return h13Face;
  }
  if (!h13Frame) {
    h13Frame = document.createElement('iframe');
    h13Frame.id = 'r11-h13-source';
    h13Frame.title = 'Frozen H13 Hypernormalization source';
    h13Frame.src = encodeURI(H13_URL);
    h13Frame.style.cssText =
      'position:fixed;left:-1600px;top:0;width:1280px;height:900px;border:0;opacity:0;pointer-events:none;z-index:-1;';
    document.body.appendChild(h13Frame);
  }
  const started = performance.now();
  while (performance.now() - started < 90000) {
    const w = h13Frame.contentWindow;
    const d = h13Frame.contentDocument;
    if (w && d && typeof w.__dcRootName === 'function' && typeof w.__dcSetProps === 'function') {
      const face = d.querySelector('canvas[width="1024"][height="512"]');
      if (face && face.width === 1024 && face.height === 512) {
        h13Face = face;
        h13Ready = true;
        report.h13.ready = true;
        report.h13.rootName = w.__dcRootName();
        report.h13.face = { width: face.width, height: face.height };
        applyH13Props();
        return face;
      }
    }
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error('H13 source did not expose its 1024x512 face in 90s');
}

async function showHypernormalization() {
  const face = await ensureH13();
  liveH13 = true;
  ensureAspect(2);
  setPanelTexture(face);
  report.content = 'H13 Hypernormalization · ' + context.packId + ' context';
  report.ready = true;
  document.documentElement.dataset.b2aReady = '1';
  setDiag('context: ' + contextState + ' · palette: ' + context.paletteSource);
}

function setContext(patch = {}) {
  const allowed = ['islandId', 'residentId', 'packId', 'selectedCard', 'paletteSource', 'kfbShare'];
  for (const k of allowed) if (Object.prototype.hasOwnProperty.call(patch, k)) context[k] = patch[k];
  updateContextReport();
  applyH13Props();
  return structuredClone(context);
}

async function setContextState(next) {
  if (!CONTEXT_STATES.includes(next)) throw new Error('unknown context state ' + next);
  contextState = next;
  updateContextReport();
  setActive(next);
  if (next === 'idle') return setMode('hyper');
  if (next === 'approach') return setMode('cover');
  if (next === 'focus' || next === 'interact') return setMode('quarter');
  return setMode('video');
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
  setPanelTexture(cv);
  report.content = 'CHATTERBOX ' + beat.key;
  report.ready = true;
  document.documentElement.dataset.b2aReady = '1';
  setDiag();
}

function setActive(state) {
  document.querySelectorAll('[data-state]').forEach((b) => b.classList.toggle('active', b.dataset.state === state));
  $('b2a-video-hint').style.display = state === 'media' ? 'block' : 'none';
}

async function setMode(mode) {
  if (!['hyper', 'quarter', 'cover', 'video', 'slogan'].includes(mode)) mode = 'hyper';
  const token = ++modeToken;
  currentMode = mode;
  report.mode = mode;
  setActive(contextState);
  clearInterval(sloganTimer);
  liveH13 = false;
  hideInlineVideo();
  setBusy(mode);

  try {
    if (mode === 'hyper') {
      await showHypernormalization();
    } else if (mode === 'quarter') {
      const result = await withTimeout(
        renderCardQuarter(activeCard()), 15000,
        'unchanged B0 renderCardQuarter() did not resolve in 15s'
      );
      if (token !== modeToken) return;
      showCanvas(result.canvas, result.ar, result.title + ' #' + result.cardNumber + ' · measured quarter AR');
    } else if (mode === 'cover') {
      const result = await withTimeout(renderCover(context.packId), 15000, 'cover render did not resolve in 15s');
      if (token !== modeToken) return;
      showCanvas(result.canvas, result.ar, result.title + ' · cover page 1');
    } else if (mode === 'video') {
      const poster = await withTimeout(loadPoster(), 10000, 'YouTube poster did not resolve in 10s');
      if (token !== modeToken) return;
      showCanvas(poster.canvas, poster.ar, 'Travel VIDEO ' + VIDEO.id + ' · CSS3D inline');
      showInlineVideo();
      report.ready = true;
      document.documentElement.dataset.b2aReady = '1';
      setDiag();
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
    document.documentElement.dataset.b2aReady = '0';
    setDiag();
    console.error('[B2a]', e);
  }
}

async function mountHero() {
  const donorFile = HERO_DONORS[0].file;
  hero = await loadHero(GLTFLoader, donorFile, 4.2);
  hero.group.position.set(0, 0, 0);

  // Literal accepted B0/B1 framing step.
  const box0 = new THREE.Box3().setFromObject(hero.group);
  const c0 = box0.getCenter(new THREE.Vector3());
  hero.group.position.x -= c0.x;
  hero.group.position.z -= c0.z;
  hero.group.position.y -= box0.min.y;
  scene.add(hero.group);

  panelMesh = hero.panel;
  physicalBodyRoot = hero.group.children[0] || null;
  worldLookSourcePanelMaterialUuid = panelMesh.material.uuid;
  report.worldLook.sourceBox = vecBox(physicalBodyRoot);
  report.baseAspect = hero.panelW / hero.panelH;
  report.sourceFace = hero.panelW.toFixed(2) + ' × ' + hero.panelH.toFixed(2) + ' world units';
  console.info('[B2a source-isolate] B1 panel', report.sourceFace, 'AR', report.baseAspect.toFixed(4));

  cv = document.createElement('canvas');
  resizeCanvas(report.baseAspect);
  panelMesh.material.dispose();
  panelMesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff });

  createInlineVideo();
  const q = new URLSearchParams(location.search);
  if (q.get('packId')) context.packId = q.get('packId');
  if (q.get('card')) context.selectedCard = Number(q.get('card')) || context.selectedCard;
  updateContextReport();
  const queryState = q.get('state') || 'idle';
  await setContextState(CONTEXT_STATES.includes(queryState) ? queryState : 'idle');
}

mountHero().catch((e) => {
  errors.push(String(e && e.stack || e));
  report.content = 'BOOT FAILED · ' + e.message;
  setDiag();
  console.error('[B2a boot]', e);
});

// Accepted B1 camera/orbit contract.
const CAMS = {
  FRONT: { yaw: 0.0, pitch: 0.14, dist: 6.4 },
  LEFT34: { yaw: -0.62, pitch: 0.20, dist: 7.2 },
  RIGHT34: { yaw: 0.62, pitch: 0.20, dist: 7.2 },
  BACK34: { yaw: Math.PI - 0.62, pitch: 0.20, dist: 7.2 },
  BACK: { yaw: Math.PI, pitch: 0.14, dist: 6.4 },
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
  dragging = true; pointerMoved = false; px = e.clientX; py = e.clientY;
  setVideoBlock(true);
  el.setPointerCapture(e.pointerId);
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
  dragging = false; setVideoBlock(false);
  try { el.releasePointerCapture(e.pointerId); } catch (_) {}
});
el.addEventListener('pointercancel', () => { dragging = false; setVideoBlock(false); });
el.addEventListener('wheel', (e) => {
  S.dist = Math.max(2.6, Math.min(20, S.dist * (1 + Math.sign(e.deltaY) * 0.07)));
}, { passive: true });

document.querySelectorAll('[data-state]').forEach((b) => b.addEventListener('click', () => {
  setContextState(b.dataset.state);
}));
$('b2a-reset').addEventListener('click', () => { Object.assign(S, CAMS.FRONT); });
$('b2a-diag-toggle').addEventListener('click', () => {
  const p = $('b2a-diag'); p.style.display = p.style.display === 'none' ? 'block' : 'none';
});
addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contextState === 'media') setContextState('approach');
});

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  cssRenderer.setSize(w, h);
  camera.aspect = w / Math.max(1, h);
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();
applyCamera();

let lastTick = performance.now();
function tick() {
  lastTick = performance.now();
  applyCamera();
  syncInlineVideoTransform();
  if (liveH13 && tex) tex.needsUpdate = true;
  renderer.render(scene, camera);
  cssRenderer.render(cssScene, camera);
}
(function loop() { requestAnimationFrame(loop); tick(); })();
setInterval(() => { if (performance.now() - lastTick > 120) tick(); }, 60);

function snapshot() {
  const surfaceRect = videoSurface ? videoSurface.getBoundingClientRect() : null;
  return {
    ...structuredClone(report),
    dom: {
      inlineSurfaceExists: !!videoSurface,
      iframeExists: !!videoIframe,
      iframeSrc: videoIframe?.src || null,
      inlineDisplay: videoSurface?.style.display || null,
      objectVisible: videoObject?.visible ?? null,
      surfaceBackfaceVisibility: videoSurface ? getComputedStyle(videoSurface).backfaceVisibility : null,
      iframeBackfaceVisibility: videoIframe ? getComputedStyle(videoIframe).backfaceVisibility : null,
      surfaceRect: surfaceRect ? { x: surfaceRect.x, y: surfaceRect.y, w: surfaceRect.width, h: surfaceRect.height } : null,
      cssTransform: videoSurface?.style.transform || '',
      modalElementExists: !!document.querySelector('#b1-video, #b2a-video-modal')
    }
  };
}

window.__b2a = {
  setMode,
  setView(name) { const p = CAMS[name]; if (p) { Object.assign(S, p); tick(); } },
  snapshot,
  report,
  VIDEO
};
window.__r11 = {
  setState: setContextState,
  setContext,
  setWorldLook,
  setView(name) { const p = CAMS[name]; if (p) { Object.assign(S, p); tick(); } },
  snapshot() { return { ...snapshot(), context: structuredClone(report.context), h13: structuredClone(report.h13) }; },
  context,
  states: [...CONTEXT_STATES]
};
