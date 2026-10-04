// KFB Billboard / Media Residency — B0 SOURCE PROOF. Recovery pass 2026-09-24.
// Scope per recovery brief: real Kenney billboard donor + real KFB card through
// renderCardQuarter() + real CanvasTexture surface + orbitable view. Nothing else.
// No Triplet/Collage/Reveal/ChatterBox/media-controls/measurement-dashboard/source-inspector.
// Reuses bb-scene.js — same owner, no second billboard/PDF/registry path.
//
// NOTE ON PROVENANCE: the recovery prompt named local paths (skills/session-entry-use-what-works_v1.md,
// tools/KFB-ToolBox/_handover/CLAUDE_BILLBOARD_MEDIA_DESIGN_2026-09-23/*, and the donor source
// tools/KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/lab-v9/cologne-props.v1.js) that do not
// exist in the attached local folder for this session. This boot file uses the equivalent code
// already committed to this project (bb-scene.js), whose header documents the same lineage:
// renderCardQuarter()/buildBillboard() measuring technique reused route-less from that exact
// cologne-props.v1.js file, hero donor pinned to registry/assets/v1/packs/kenney-racing-kit.json
// @378b209355b1. See github.md for the sync record.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HERO_DONORS, loadHero, renderCardQuarter, CARD_POOL, buildStage } from './bb-scene.js';

const $ = (id) => document.getElementById(id);

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
renderer.domElement.style.cssText = 'position:fixed;inset:0;display:block;width:100%;height:100%;z-index:0';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 16 / 9, 0.1, 200);
buildStage(scene, renderer); // ground + lights only — no decor, per brief (decor is post-B0)

const diag = { donor: null, cardStatus: 'loading…', cardError: null };
function setDiag() {
  const el = $('b0-diag-body');
  if (!el) return;
  el.textContent = [
    'donor: ' + (diag.donor || '—'),
    'card: ' + diag.cardStatus,
    diag.cardError ? 'error: ' + diag.cardError : ''
  ].filter(Boolean).join('\n');
}

let panelMesh = null, tex = null, cv = null, ctx = null;

function drawFailed(msg) {
  ctx.fillStyle = '#8a1f14'; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = '#f2e6c9';
  ctx.textAlign = 'center';
  ctx.font = "700 40px 'JetBrains Mono', monospace";
  ctx.fillText('SOURCE CARD FAILED', cv.width / 2, cv.height * 0.42);
  ctx.font = "16px 'JetBrains Mono', monospace";
  ctx.fillText((msg || '').slice(0, 90), cv.width / 2, cv.height * 0.54);
  ctx.textAlign = 'left';
  tex.needsUpdate = true;
}

function drawCard(result) {
  // Flush on the ad face, no border: cover-crop fills the panel edge to edge — crop the
  // image rather than pad it, and no metadata stamped over the art per the brief.
  const img = result.canvas, iw = img.width, ih = img.height;
  const s = Math.max(cv.width / iw, cv.height / ih);
  const dw = iw * s, dh = ih * s;
  ctx.drawImage(img, (cv.width - dw) / 2, (cv.height - dh) / 2, dw, dh);
  tex.needsUpdate = true;
}

async function mountHero() {
  const donorFile = HERO_DONORS[0].file; // billboard.glb — the base hero
  diag.donor = 'media/3D_Assets/kenney_racing-kit/Models/GLTF format/' + donorFile + ' @378b209355b1';
  setDiag();
  const info = await loadHero(GLTFLoader, donorFile, 4.2);
  info.group.position.set(0, 0, 0);
  // loadHero() (bb-scene.js, shared owner) scales in place but does not recentre the raw
  // donor's own pivot — billboard.glb's origin sits off to one side. Recentre the whole
  // assembly (model + card panel, moved together) so the hero actually sits at world origin;
  // this is a boot-time framing step, not a change to the shared loader.
  const box0 = new THREE.Box3().setFromObject(info.group);
  const c0 = box0.getCenter(new THREE.Vector3());
  info.group.position.x -= c0.x;
  info.group.position.z -= c0.z;
  info.group.position.y -= box0.min.y;
  scene.add(info.group);
  panelMesh = info.panel;
  cv = document.createElement('canvas');
  cv.width = 1024; cv.height = Math.round(1024 / (info.panelW / info.panelH));
  ctx = cv.getContext('2d');
  tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  panelMesh.material.dispose();
  panelMesh.material = new THREE.MeshBasicMaterial({ map: tex });

  try {
    const withTimeout = (p, ms, label) => Promise.race([
      p, new Promise((_, rej) => setTimeout(() => rej(new Error(label)), ms))
    ]);
    const result = await withTimeout(
      renderCardQuarter(CARD_POOL[0]), 12000,
      'pdf.js page.render() did not resolve in 12s (measured: getDocument/getPage succeed, ' +
      'the render-to-canvas call itself hangs in this preview sandbox — reproduced against ' +
      'both the KFB registry PDF and a known-good jsDelivr-hosted test PDF, so this is an ' +
      'environment constraint on PDF-worker rendering, not a bad donor path)'
    );
    diag.cardStatus = 'OK — ' + result.title + ' #' + result.cardNumber;
    drawCard(result);
  } catch (e) {
    diag.cardStatus = 'FAILED';
    diag.cardError = e.message;
    drawFailed(e.message);
  }
  setDiag();
}

mountHero().catch((e) => {
  diag.cardStatus = 'BOOT FAILED';
  diag.cardError = e.message;
  setDiag();
  console.error('[b0]', e);
});

// ── Camera: free orbit + FRONT/LEFT34/RIGHT34 presets, no visible switcher required ──
const CAMS = {
  FRONT: { yaw: 0.0, pitch: 0.14, dist: 6.4 },
  LEFT34: { yaw: -0.62, pitch: 0.20, dist: 7.2 },
  RIGHT34: { yaw: 0.62, pitch: 0.20, dist: 7.2 }
};
const S = { ...CAMS.FRONT };
const centre = new THREE.Vector3(0, 1.9, 0);
function applyCamera() {
  const h = Math.cos(S.pitch), v = Math.sin(S.pitch);
  camera.position.set(centre.x + Math.sin(S.yaw) * h * S.dist, v * S.dist + centre.y, centre.z + Math.cos(S.yaw) * h * S.dist);
  camera.lookAt(centre);
}
CAMS.WIDE = { yaw: 0.5, pitch: 0.42, dist: 16 };
window.__b0 = { setView: (name) => { const p = CAMS[name]; if (p) { Object.assign(S, p); applyCamera(); renderer.render(scene, camera); } }, S };

let dragging = false, px = 0, py = 0;
const el = renderer.domElement;
el.style.touchAction = 'none';
el.addEventListener('pointerdown', (e) => { dragging = true; px = e.clientX; py = e.clientY; el.setPointerCapture(e.pointerId); });
el.addEventListener('pointerup', (e) => { dragging = false; try { el.releasePointerCapture(e.pointerId); } catch (_) {} });
el.addEventListener('pointercancel', () => { dragging = false; });
el.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  S.yaw -= (e.clientX - px) * 0.006;
  S.pitch = Math.max(0.02, Math.min(1.1, S.pitch + (e.clientY - py) * 0.004));
  px = e.clientX; py = e.clientY;
});
el.addEventListener('wheel', (e) => { S.dist = Math.max(2.6, Math.min(20, S.dist * (1 + Math.sign(e.deltaY) * 0.07))); }, { passive: true });

$('b0-reset') && $('b0-reset').addEventListener('click', () => { Object.assign(S, CAMS.FRONT); applyCamera(); renderer.render(scene, camera); });
$('b0-diag-toggle') && $('b0-diag-toggle').addEventListener('click', () => {
  const p = $('b0-diag-body');
  if (p) p.style.display = p.style.display === 'none' ? 'block' : 'none';
});

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / Math.max(1, h);
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();
applyCamera();

// Takt: rAF FÜHRT, ein Intervall fängt auf (owner pattern, wm-boot.js) — rAF stalls in
// unfocused/background preview frames, a bare interval gets throttled to ~1/s when hidden.
let lastTick = performance.now();
function tick() { lastTick = performance.now(); applyCamera(); renderer.render(scene, camera); }
(function loop() { requestAnimationFrame(loop); tick(); })();
setInterval(() => { if (performance.now() - lastTick > 120) tick(); }, 60);

window.__b0dbg = { scene, camera, renderer, diag };
