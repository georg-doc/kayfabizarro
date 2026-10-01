/* KFB Clay Gate FACADE-A/B-01 · building_A (01.10.)
 * Nach tools/KFB-ToolBox/docs/KFB_CLAYMATION_STYLE_SSOT.md + KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md (Branch work/clay-style-ssot-2026-10-01).
 * Drei Bühnen, gleiche Kamera, gleiches K1-Licht (MOODS.day), gleicher Tisch, gleiche Schatten + GTAO wie clay-catalog.v5:
 *   SOURCE   KayKit building_A unverändert (KayKit-Material)
 *   GOLDEN   exakter K1-Weg: softenGeometry (maxEdge 0,18 · 3 Stufen · 90 000 △) → seedGeometry → clay-material.v8 'house', v8-Uniforms
 *   CANDIDATE clay-material.v10 (K2), zwei Fassungen: »R2A« (wie im Hex-Archipel: Handmaß ×10, Werkzeuge an) und »Parität« (v8-Werte)
 * Quellen 1:1 aus KFB_K1_H0_CODEBASE_2026-09-29 (golden/k1/lab-clay), building_A über denselben PIN wie K1.
 * Abweichung, offen benannt: claySeed = 101 + Mesh-Index statt 101 + o.id (o.id ist je Szene verschieden, sonst wäre der Vergleich nicht fair). */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { makeClayRelief } from './k1/lab-clay/clay-relief.v2.js';
import * as V8 from './k1/lab-clay/clay-material.v8.js';
import { softenGeometry } from './k1/lab-clay/clay-soften.v1.js';
import * as V10 from '../lab-clay/clay-material.v10.js?r=2';
import { makeToolReliefs } from '../lab-clay/clay-relief.v4.js';
import { TOOLMIX } from '../lab-clay/clay-toolmix.v1.js?r=2';
import { fitShadow } from '../lab-world/shadow-fit.v1.js';

const here = f => new URL(f, import.meta.url).href;
const PIN = '2ff8b350beefe02912bbff6eeeead3882e583d08';
const RAW = p => 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + PIN + '/' + p.split('/').map(encodeURIComponent).join('/');
const KIT = 'media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/';
const DAY = { sun: '#fff4e6', sunI: 2.9, el: 32, az: -38, hemiS: '#d6e8f6', hemiG: '#d9a27a', hemiI: 0.95, sky: '#96bede' };   // K1 MOODS.day
const LINE = '#e2d0bc';
const TABLE = { ...V8.PROFILES.terrainBg, scale: 1.6, dent: 0.12, dentSize: 1.4, gouge: 0.1, gougeSize: 1.2 };
export const SOURCES = {
  building_A: { file: 'building_A', height: 3.2, seed: 101 },
  building_E: { file: 'building_E', height: 3.8, seed: 111 }
};

let shared = null;
async function getShared(onNote, key) {
  if (shared && shared.key === key) return shared;
  const S = SOURCES[key], t0 = performance.now();
  onNote('Lade ' + S.file + ' (PIN ' + PIN.slice(0, 8) + ') …');
  const gltf = await new GLTFLoader().loadAsync(RAW(KIT + S.file + '.gltf'));
  onNote('Relief und Fingerabdrücke …'); await new Promise(r => setTimeout(r, 0));
  const rel = makeClayRelief({ size: 1024, seed: 11 });
  let print = null, printErr = null; try { print = await V8.makePrintTexture(THREE, 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/external/Fingerprints01_3K.png', 2048); } catch (e) { printErr = e.message; }
  onNote('Vorstufe softenGeometry …'); await new Promise(r => setTimeout(r, 0));
  const ts = performance.now(), soft = new Map(); let srcTris = 0, softTris = 0;
  gltf.scene.traverse(o => { if (!o.isMesh) return; if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
    const g0 = o.geometry; srcTris += (g0.index ? g0.index.count : g0.attributes.position.count) / 3;
    const g = softenGeometry(THREE, g0, {}).geometry; soft.set(g0, g); softTris += (g.index ? g.index.count : g.attributes.position.count) / 3; });
  shared = { key, S, gltf, rel, print, printErr, soft, softMs: Math.round(performance.now() - ts), loadMs: Math.round(ts - t0), srcTris: Math.round(srcTris), softTris: Math.round(softTris), tools: null };
  return shared; }
async function getTools(onNote) { if (shared.tools) return shared.tools;
  const _st = window.setTimeout, mc = new MessageChannel(), mq = []; mc.port1.onmessage = () => { const f = mq.shift(); f && f(); };
  window.setTimeout = (f, d, ...a) => (d ? _st(f, d, ...a) : (mq.push(() => f(...a)), mc.port2.postMessage(0), 0));
  try { shared.tools = await makeToolReliefs({ size: 1024, seed: 41, onStep: s => onNote('Werkzeug ' + s + ' …') }); } finally { window.setTimeout = _st; mc.port1.close(); }
  return shared.tools; }

const dataTex = (renderer, d, size) => { const t = new THREE.DataTexture(d, size, size, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); t.needsUpdate = true; return t; };

/* variant: 'source' | 'golden' | 'r2a' | 'parity' */
export async function makeStage(canvas, variant, onNote = () => {}, opts = {}) {
  const sh = await getShared(onNote, opts.source || 'building_A'), info = { variant, tris: 0, calls: 0, frameMs: 0, errors: sh.printErr ? ['Fingerabdrücke: ' + sh.printErr] : [] };
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.info.autoReset = false;
  const scene = new THREE.Scene(); scene.background = new THREE.Color(DAY.sky);
  const camera = new THREE.PerspectiveCamera(34, 4 / 3, 0.05, 400);
  // K1-Licht
  const sun = new THREE.DirectionalLight(DAY.sun, DAY.sunI); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 5, far: 120 }); sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.03; scene.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight(DAY.hemiS, DAY.hemiG, DAY.hemiI); scene.add(hemi);
  const fill = new THREE.DirectionalLight('#ffe6d6', DAY.sunI * 0.15); scene.add(fill);
  { const el = THREE.MathUtils.degToRad(DAY.el), az = THREE.MathUtils.degToRad(DAY.az); sun.position.set(Math.sin(az) * Math.cos(el) * 60, Math.sin(el) * 60, Math.cos(az) * Math.cos(el) * 60); fill.position.copy(sun.position).multiplyScalar(-1).setY(20); }
  // v8-Uniforms (Tisch in allen Bühnen, Haus in GOLDEN)
  const tex8 = dataTex(renderer, sh.rel.data, sh.rel.size), U8 = V8.makeClayUniforms(THREE, tex8);
  if (sh.print) { U8.uClayPrint.value = sh.print; U8.uClayPrintOn.value = 1; } else U8.uClayPrint.value = tex8;
  // Tisch wie K1
  { let g = new THREE.BoxGeometry(34, 0.8, 26, 68, 2, 52); g.translate(0, -0.4, 0); g = softenGeometry(THREE, g, { maxLevels: 0, iters: 14, lambda: 0.55, mu: -0.57, lump: 0.0015, lumpFreq: 1.1 }).geometry; g.computeVertexNormals();
    V8.seedGeometry(THREE, g, 3); const m = new THREE.Mesh(g, V8.makeClayMaterial(THREE, U8, { src: new THREE.MeshStandardMaterial({ color: LINE }), profile: TABLE })); m.receiveShadow = true; scene.add(m); }
  // Haus
  let U10 = null;
  if (variant === 'r2a' || variant === 'parity') { const t10 = dataTex(renderer, sh.rel.data, sh.rel.size); U10 = V10.makeClayUniforms(THREE, t10);
    if (sh.print) { U10.uClayPrint.value = sh.print; U10.uClayPrintOn.value = 1; } else U10.uClayPrint.value = t10;
    if (variant === 'parity') { Object.assign(U10, {}); U10.uClayHexK.value = 3; U10.uClayHexRot.value = 1; U10.uClayHexFlow.value = 0; U10.uClayFacetSoft.value = 0; U10.uClayToolOn.value = 0; U10.uClayLegacyStroke.value = 1; }
    else { const K = 10, trl = await getTools(onNote); [U10.uClayToolA.value, U10.uClayToolB.value, U10.uClayToolC.value] = trl.maps.map(d => dataTex(renderer, d, trl.size)); U10.uClayToolOn.value = 1; U10.uClayLegacyStroke.value = 0;
      U10.uClayPrintOn.value = 0; U10.uClayMacro.value = 0.45; U10.uClayLodK.value = 0.6; U10.uClayStroke.value = 0.75; U10.uClayHand.value = 0.5 * K; U10.uClayTile.value = 1.6 * K; U10.uClayPrintTile.value = 4.5 * K; } }
  const root = sh.gltf.scene.clone(true); let mi = 0; const mc = new Map();
  root.traverse(o => { if (!o.isMesh) return; o.castShadow = o.receiveShadow = true; const src = o.material;
    if (variant === 'source') return;
    const conv = s => { if (mc.has(s)) return mc.get(s); let m;
      if (variant === 'golden') m = V8.makeClayMaterial(THREE, U8, { src: s, profile: V8.PROFILES.house });
      else if (variant === 'parity') m = V10.makeClayMaterial(THREE, U10, { src: s, profile: { ...V10.PROFILES.house, legacy: 1 } });
      else { const K = 10, p = { ...V10.PROFILES.house }; p.scale *= K; p.gougeSize *= K; p.crackSize *= K; p.dentSize *= K; m = V10.makeClayMaterial(THREE, U10, { src: s, profile: { ...p, tools: TOOLMIX.house, legacy: 0 } }); }
      mc.set(s, m); return m; };
    o.material = Array.isArray(src) ? src.map(conv) : conv(src);
    const g = sh.soft.get(o.geometry) || o.geometry; o.geometry = V8.seedGeometry(THREE, g.clone(), sh.S.seed + (mi++)); });
  // footed wie K1
  root.updateMatrixWorld(true); const box = new THREE.Box3().setFromObject(root), size = box.getSize(new THREE.Vector3()), s = sh.S.height / size.y;
  const mid = new THREE.Group(); mid.add(root); root.position.set(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2); mid.scale.setScalar(s); scene.add(mid);
  mid.updateMatrixWorld(true); const hb = new THREE.Box3().setFromObject(mid);
  // Ansichten: Gate 6 m / 30°, Dachkante, Sockel/Kontakt
  const dirAz = new THREE.Vector3(0.25, 0, 1).normalize();
  const VIEWS = { gate: { t: new THREE.Vector3(0, sh.S.height / 2, 0), d: 6, el: 30 },
    dach: { t: new THREE.Vector3(hb.max.x * 0.55, hb.max.y * 0.9, hb.max.z * 0.9), d: 2.0, el: 22 },
    sockel: { t: new THREE.Vector3(hb.max.x * 0.4, 0.22, hb.max.z), d: 1.8, el: 14 },
    fern: { t: new THREE.Vector3(0, sh.S.height / 2, 0), d: 26, el: 30 } };
  const setView = id => { const V = VIEWS[id] || VIEWS.gate, el = THREE.MathUtils.degToRad(V.el), dir = dirAz.clone().multiplyScalar(Math.cos(el)).setY(Math.sin(el));
    camera.position.copy(V.t).addScaledVector(dir, V.d); camera.lookAt(V.t); };
  // Nachbearbeitung wie K1 (roh) und mit MSAA-Ziel (Rezept): ohne Multisampling zeichnet der Composer Treppenkanten an jeder Silhouette
  const mkComposer = msaa => { const c = msaa ? new EffectComposer(renderer, new THREE.WebGLRenderTarget(4, 4, { samples: 4, type: THREE.HalfFloatType })) : new EffectComposer(renderer); c.addPass(new RenderPass(scene, camera));
    try { const ao = new GTAOPass(scene, camera, 2, 2); ao.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1.4, thickness: 1.2, scale: 1.0, samples: 16 }); ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 }); ao.blendIntensity = 0.9; c.addPass(ao); }
    catch (e) { info.errors.push('AO: ' + e.message); } c.addPass(new OutputPass()); return c; };
  const CMP = { raw: mkComposer(false), fix: mkComposer(true) };
  // Schatten: K1 roh (40 m Feld, feste Biases) gegen LESSONS_SHADOWS-Rezept (auf das Haus gepasst, gerastet, Texel-Bias)
  const K1SH = { pos: sun.position.clone(), tgt: sun.target.position.clone() }, lightDir = sun.position.clone().normalize();
  let fix = opts.fix !== false, fit = null;
  const applyFix = () => { if (fix) { const sb = hb.clone(), L = lightDir; for (const x of [hb.min.x, hb.max.x]) for (const z of [hb.min.z, hb.max.z]) { const p = new THREE.Vector3(x, hb.max.y, z); sb.expandByPoint(p.addScaledVector(L, -hb.max.y / L.y)); }
      fit = fitShadow(renderer, sun, lightDir, sb, { pad: 1.08 }); }
    else { sun.position.copy(K1SH.pos); sun.target.position.copy(K1SH.tgt); sun.target.updateMatrixWorld(); Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 5, far: 120 }); sun.shadow.camera.updateProjectionMatrix(); sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.03; fit = null; }
    sun.shadow.needsUpdate = true; info.shadow = fix ? `Rezept · Feld ±${fit.r} m · Texel ${(fit.texel * 1000).toFixed(1)} mm · normalBias ${fit.normalBias.toFixed(4)} · MSAA 4` : 'K1 roh · Feld ±20 m · normalBias 0,03 · ohne MSAA'; };
  const resize = () => { const w = canvas.clientWidth || 4, h = canvas.clientHeight || 3; renderer.setSize(w, h, false); CMP.raw.setSize(w, h); CMP.fix.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const gl = renderer.getContext(), px = new Uint8Array(4);
  const render = () => { renderer.info.reset(); const a = performance.now(); (fix ? CMP.fix : CMP.raw).render(); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); info.frameMs = +(performance.now() - a).toFixed(1);
    info.tris = renderer.info.render.triangles; info.calls = renderer.info.render.calls; };
  let houseTris = 0; mid.traverse(o => { if (o.isMesh) houseTris += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3; });
  Object.assign(info, { houseTris: Math.round(houseTris), softMs: variant === 'source' ? 0 : sh.softMs, loadMs: sh.loadMs, srcTris: sh.srcTris, meshes: mi || 0 });
  applyFix(); resize(); setView(opts.view || 'gate'); render();
  return { info, canvas, setView(id) { setView(id); render(); }, resize() { resize(); render(); }, render, setFix(v) { fix = !!v; applyFix(); render(); },
    dispose() { CMP.raw.dispose && CMP.raw.dispose(); CMP.fix.dispose && CMP.fix.dispose(); renderer.dispose(); } };
}

/* Bildvergleich: mittlere RGB-Abweichung (0–255) und Detailmenge (Laplace-Energie) im Hausbereich */
export function compare(srcCv, aCv, bCv) {
  const W = Math.min(aCv.width, bCv.width, srcCv.width), H = Math.min(aCv.height, bCv.height, srcCv.height);
  const grab = cv => { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(cv, 0, 0, W, H); return x.getImageData(0, 0, W, H).data; };
  const S = grab(srcCv), A = grab(aCv), B = grab(bCv), bg = [S[0], S[1], S[2]];
  const mask = new Uint8Array(W * H); let n = 0;
  for (let i = 0; i < W * H; i++) { const d = Math.abs(S[i * 4] - bg[0]) + Math.abs(S[i * 4 + 1] - bg[1]) + Math.abs(S[i * 4 + 2] - bg[2]); if (d > 24) { mask[i] = 1; n++; } }
  const L = (D, i) => 0.2126 * D[i * 4] + 0.7152 * D[i * 4 + 1] + 0.0722 * D[i * 4 + 2];
  let dsum = 0, ea = 0, eb = 0;
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x; if (!mask[i]) continue;
    dsum += (Math.abs(A[i * 4] - B[i * 4]) + Math.abs(A[i * 4 + 1] - B[i * 4 + 1]) + Math.abs(A[i * 4 + 2] - B[i * 4 + 2])) / 3;
    const la = 4 * L(A, i) - L(A, i - 1) - L(A, i + 1) - L(A, i - W) - L(A, i + W), lb = 4 * L(B, i) - L(B, i - 1) - L(B, i + 1) - L(B, i - W) - L(B, i + W); ea += la * la; eb += lb * lb; }
  const delta = n ? dsum / n : 0, detail = ea ? eb / ea : 0;
  const verdict = delta < 4 && detail > 0.9 && detail < 1.1 ? 'MATCH' : delta < 10 && detail > 0.7 && detail < 1.4 ? 'TUNE' : 'FAIL';
  return { delta: +delta.toFixed(1), detail: +detail.toFixed(2), px: n, verdict };
}
