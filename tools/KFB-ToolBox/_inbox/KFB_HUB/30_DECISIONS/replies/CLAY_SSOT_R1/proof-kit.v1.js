/* KFB Clay SSOT R1 · proof kit (NOT part of the SSOT API) — shared by golden.html (headless regression) and proof.html.
 * One stage for every image: kfb-stage-light.v1 (WS1, byte-identical vendor copy, blob cd8bda8c), MOODS_MESA day (the WS1 default),
 * applyTone 'aces' exposure 1 (Rule 5), PCF soft sun shadow via fitShadow, figure light (Rule 11), contact AO. No overlays in images.
 * Variants for the audit: 'v1' = kfb-clay.v1 · 'none' = original materials · 'v8ws1' = WS1 clayLook (K1 v8 + Knete R2) ·
 * 'v8proof' = proof/WSB set-up (K1 v8, hand factor 1/0.47, fingerprint texture, seedGeometry). */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createStageLight, createContactAO, applyTone, MOODS_MESA } from './vendor/kfb-stage-light.v1.js';
import { applyClay, removeClay, CLAY_PROFILES } from './kfb-clay.v1.js';

export { THREE, CLAY_PROFILES };
export const FIG_H = 1.8; // staging height of every figure (m); the clay does not care (scale test)
export const ASSETS = {
  fb: { url: 'assets/FB_TEMPLATE_LOOK_v5b.glb', label: 'FrizzleBob v5b', card: { id: 'frizzlebob', material: { clayProfile: 'figure-fine' } }, hide: /^FB_Eye_[LR]$/ },
  goth: { url: 'assets/GothGirl.glb', label: 'GothGirl', card: { id: 'gothgirl', material: { clayProfile: 'figure-fine' } } },
  hunky: { url: 'assets/LordHunky_RigMedium.toolbox.r4.glb', label: 'Lord Hunky r4', card: { id: 'lord_hunky', material: { clayProfile: 'figure-fine' } } },
  stage: { url: 'assets/kfb-meshy-utopia-stage.screen-a.v1.glb', label: 'Meshy Utopia Stage' },
  prop: { url: 'assets/crimson_flame_dragster_browser.v2.glb', label: 'Meshy Dragster' },
};

const loader = new GLTFLoader();
export async function loadGLB(key, bust = '') {
  const A = ASSETS[key], g = await loader.loadAsync(A.url + (bust ? '?reload=' + bust : ''));
  const root = g.scene; root.name = key;
  root.traverse((o) => { if (A.hide && A.hide.test(o.name)) o.visible = false; if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; } });
  return root;
}
/** Figure: height FIG_H, feet on y = 0, centred. scale = extra factor (scale-invariance test). */
export function placeFigure(root, scale = 1) {
  root.updateMatrixWorld(true);
  let b = new THREE.Box3().setFromObject(root, true);
  root.scale.multiplyScalar((FIG_H * scale) / (b.max.y - b.min.y)); root.updateMatrixWorld(true);
  b = new THREE.Box3().setFromObject(root, true);
  root.position.set(root.position.x - (b.min.x + b.max.x) / 2, root.position.y - b.min.y, root.position.z - (b.min.z + b.max.z) / 2); root.updateMatrixWorld(true);
  return root;
}
export function placeWide(root, width) {
  root.updateMatrixWorld(true);
  let b = new THREE.Box3().setFromObject(root);
  root.scale.multiplyScalar(width / Math.max(b.max.x - b.min.x, b.max.z - b.min.z)); root.updateMatrixWorld(true);
  b = new THREE.Box3().setFromObject(root);
  root.position.set(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2); root.updateMatrixWorld(true);
  return root;
}
export function headOf(root) { let h = null; root.traverse((o) => { if (!h && o.isBone && /^head$/i.test(o.name)) h = o; }); return h; }

/* Deterministic terrain (integer hash, fixed seed): 90 m x 90 m, rolling clay hills, vertex colours. */
function ih(x, y, s) { let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function vn(x, y, s) { const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = ih(xi, yi, s), b = ih(xi + 1, yi, s), c = ih(xi, yi + 1, s), d = ih(xi + 1, yi + 1, s); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
export function makeTerrain() {
  const g = new THREE.PlaneGeometry(90, 90, 240, 240).rotateX(-Math.PI / 2), P = g.attributes.position, col = new Float32Array(P.count * 3);
  const lo = new THREE.Color('#b9874f'), mid = new THREE.Color('#8fa257'), hi = new THREE.Color('#c9a46a'), c = new THREE.Color();
  for (let i = 0; i < P.count; i++) {
    const x = P.getX(i), z = P.getZ(i);
    const h = 3.2 * (vn(x / 14, z / 14, 3) - 0.5) + 1.3 * (vn(x / 5.5, z / 5.5, 4) - 0.5) + 0.35 * (vn(x / 2.1, z / 2.1, 5) - 0.5) + Math.max(0, -z - 10) * 0.08;
    P.setY(i, h);
    const t = Math.min(1, Math.max(0, (h + 1.5) / 4)); c.copy(lo).lerp(mid, Math.min(1, t * 1.6)); if (t > 0.62) c.lerp(hi, (t - 0.62) * 2.2); c.toArray(col, i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, name: 'terrain' })); m.name = 'terrain'; m.receiveShadow = true; m.castShadow = true;
  const root = new THREE.Group(); root.name = 'terrain'; root.add(m); root.updateMatrixWorld(true); return root;
}

export function makeRenderer(w, h) {
  const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  r.setPixelRatio(1); r.setSize(w, h, false);
  r.outputColorSpace = THREE.SRGBColorSpace; r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  applyTone(r, 'aces', 1);
  return r;
}

/** Stage = scene + one WS1 light rig. figures: roots that get the figure light and contact AO. */
export function makeStage({ figures = [], fit = { center: { x: 0, y: 1, z: 0 }, radius: 4 }, ground = true, scale = 1, sky = '#c9dcea' } = {}) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color(sky);
  const mods = figures.map((o) => ({ object3d: o, status: () => ({ status: 'OK', shown: true }) }));
  const rig = createStageLight({ moods: MOODS_MESA, tod: () => 1, groundColor: () => '#cdb48c', fit: () => fit, figures: () => mods, figureLight: { distance: 3.4 * scale, up: 2.2 * scale } });
  scene.add(rig.object3d);
  let ao = null;
  if (mods.length) { ao = createContactAO({ targets: () => mods, strength: 0.42 }); scene.add(ao.object3d); }
  if (ground) {
    const gm = new THREE.Mesh(new THREE.PlaneGeometry(400 * scale, 400 * scale).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#cdb48c', roughness: 1 }));
    gm.name = 'ground'; gm.receiveShadow = true; scene.add(gm);
  }
  figures.forEach((o) => scene.add(o));
  return { scene, rig, ao, render(renderer, camera) { rig.update(0, { camera }); ao?.update(0, { camera }); renderer.render(scene, camera); } };
}

export function camera(w, h, fov, pos, target) {
  const c = new THREE.PerspectiveCamera(fov, w / h, 0.05, 600); c.position.set(...pos); c.lookAt(new THREE.Vector3(...target)); c.updateMatrixWorld(true); return c;
}
export function readRGBA(renderer) {
  const gl = renderer.getContext(), w = gl.drawingBufferWidth, h = gl.drawingBufferHeight, px = new Uint8Array(w * h * 4);
  gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
  const out = new Uint8ClampedArray(w * h * 4), row = w * 4;
  for (let y = 0; y < h; y++) out.set(px.subarray((h - 1 - y) * row, (h - y) * row), y * row); // flip to top-down
  return { w, h, data: out };
}
export function toPNG(img) {
  const c = document.createElement('canvas'); c.width = img.w; c.height = img.h;
  c.getContext('2d').putImageData(new ImageData(img.data, img.w, img.h), 0, 0); return c.toDataURL('image/png');
}

/* ---------------- clay variants ---------------- */
let V8 = null;
async function v8Kit() {
  if (V8) return V8;
  const [CM, CR] = await Promise.all([import('../E2_ATTACH_R1/vendor/clay-material.v8.js'), import('../E2_ATTACH_R1/vendor/clay-relief.v2.js')]);
  const rel = CR.makeClayRelief({ size: 1024, seed: 11 });
  const tex = () => { const t = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.needsUpdate = true; return t; };
  let print = null; try { print = await CM.makePrintTexture(THREE, new URL('../E2_ATTACH_R1/vendor/Fingerprints01_3K.png', import.meta.url).href, 2048); } catch (e) { print = null; }
  V8 = { CM, tex, print };
  return V8;
}
const V8_SKIP = /eye|pupil|iris|(^|[^a-z])lid|mouth|teeth|tongue|lash|brow|nose|moust|beard|kfb-lid|clay-lid|eyerig|faceHost|face-host|decal/i;
const pathOf = (o, root) => { const a = []; for (let n = o; n && n !== root; n = n.parent) a.push(n.name || ''); return a.join('/'); };
const v8convertible = (m) => m && !m.isShaderMaterial && !m.userData?.clay && (m.isMeshStandardMaterial || m.isMeshPhongMaterial || m.isMeshLambertMaterial) && !(m.transparent && (m.opacity == null || m.opacity < 0.98));

/** Apply a clay variant to root. Returns { setRelief(on), info } (setRelief toggles the relief/normal part only). */
export async function clayVariant(variant, root, { profile = 'character', seed, scaleRef, palette, pull } = {}) {
  if (variant === 'none') return { setRelief() {}, info: { variant } };
  if (variant === 'v1') { const h = applyClay(root, THREE, { profile, seed, scaleRef, palette, pull }); return { setRelief: h.setRelief, info: { variant, ...h.info() }, handle: h }; }
  const K = await v8Kit(), CM = K.CM;
  if (variant === 'v8ws1') {
    // exact copy of WS1 modules/clayLook.js @ gh/ws1/m3-fahrhilfe (blob ac568be4): K1 v8 + Knete R2, FIG_TUNE sheen 0.04, no claySeed attribute, no hand factor
    const U = CM.makeClayUniforms(THREE, K.tex()); U.uClayPrint.value = U.uClayRelief.value; U.uClayOil.value = 0.08;
    const FACE = { ...CM.PROFILES.figure, stroke: 0.35, print: 0.25, dent: 0.1, facet: 0.6, crease: 0.4 }, PF = { ...CM.PROFILES.figure, dent: 0.55 };
    const cache = new Map();
    root.traverse((o) => { if (!o.isMesh || V8_SKIP.test(pathOf(o, root))) return; const head = /(^|_)head$/i.test(o.name || ''), pf = head ? FACE : PF;
      const conv = (m) => { if (!v8convertible(m)) return m; const key = m.uuid + (head ? '|f' : ''); if (!cache.has(key)) { const c = CM.makeClayMaterial(THREE, U, { src: m, profile: pf }); c.roughness = Math.max(c.roughness, 0.95); c.sheen = 0.04; cache.set(key, c); } return cache.get(key); };
      o.material = Array.isArray(o.material) ? o.material.map(conv) : conv(o.material); });
    return { setRelief: (on) => { U.uClayOn.value = on ? 1 : 0; }, info: { variant, note: 'WS1 clayLook R2 replica' } };
  }
  if (variant === 'v8proof') {
    // copy of the proof/WSB set-up (E2_ATTACH_R1/proof_r1e.html, 50_BLENDER/B1/proof/b1.html): HK = 1/0.47, fingerprints on, seedGeometry(layer*50 + n), sheen <= 0.04
    const HK = 1 / 0.47, U = CM.makeClayUniforms(THREE, K.tex());
    if (K.print) { U.uClayPrint.value = K.print; U.uClayPrintOn.value = 1; } else U.uClayPrint.value = U.uClayRelief.value;
    U.uClayHand.value = 0.5 * HK; U.uClayTile.value = 1.6 * HK; U.uClayPrintTile.value = 4.5 * HK; U.uClayFacetSize.value = 0.65 * HK;
    const mc = new Map(); let n = 0;
    root.traverse((o) => { if (!o.isMesh || V8_SKIP.test(pathOf(o, root))) return;
      const conv = (m) => { if (!v8convertible(m)) return m; if (!mc.has(m)) { const c = CM.makeClayMaterial(THREE, U, { src: m, profile: 'figure', scale: CM.PROFILES.figure.scale * HK }); if (c.sheen > 0.04) c.sheen = 0.04; mc.set(m, c); } return mc.get(m); };
      o.material = Array.isArray(o.material) ? o.material.map(conv) : conv(o.material);
      if (!o.geometry.attributes.claySeed) CM.seedGeometry(THREE, o.geometry, 0 + (n++)); });
    return { setRelief: (on) => { U.uClayOn.value = on ? 1 : 0; }, info: { variant, note: 'proof/WSB replica', print: !!K.print } };
  }
  throw new Error('unknown variant ' + variant);
}
export { removeClay };

/* Mask render: figure meshes white on black (for colour metrics). */
export function renderMask(renderer, stage, camera, roots) {
  const keep = new Map(), white = new THREE.MeshBasicMaterial({ color: 0xffffff }), bg = stage.scene.background, vis = [];
  stage.scene.traverse((o) => { if ((o.isMesh || o.isSprite) && !roots.some((r) => isUnder(o, r))) { vis.push([o, o.visible]); o.visible = false; } });
  roots.forEach((r) => r.traverse((o) => { if (o.isMesh) { keep.set(o, o.material); o.material = white; } }));
  stage.scene.background = new THREE.Color(0, 0, 0);
  const tm = renderer.toneMapping; renderer.toneMapping = THREE.NoToneMapping;
  renderer.render(stage.scene, camera);
  const img = readRGBA(renderer);
  renderer.toneMapping = tm; stage.scene.background = bg; keep.forEach((m, o) => { o.material = m; }); vis.forEach(([o, v]) => { o.visible = v; }); white.dispose();
  return img;
}
function isUnder(o, r) { for (let n = o; n; n = n.parent) if (n === r) return true; return false; }
