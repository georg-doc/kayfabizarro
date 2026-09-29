/* KFB clay-world r0a (29.09.) — WORLD-CORE-MOBILITY-R0A · Clay World Visual Donor. Design, keine Runtime.
 * EINE Kachel aus lab-world/world-recipe.r0a.json: das Rezept ist die Wahrheit, dieses Modul baut es nur nach.
 * Wiederverwendet statt neu erfunden:
 *   · Knet-Material K2 (clay-material.v10 + clay-relief.v4 + clay-toolmix.v1), Handmaß k = 3 wie T2/T3/T4
 *   · T4-Strang (Querschnitt sideProfile, Fahrbahn exakt aus TD03, Knetflecken Bahn → Straße, Bordlippe) aus lab-track/track-look.v5.js
 *   · Knetflecken-Shader patchify + kfbBlend (transition-atlas.v1 / road-markings.m1), Farben aus road-markings.m2.json
 *   · Biegung der Fassaden (bend) und Platzierung (place) aus transition-atlas.v1 — derselbe »gebogene Cartoon-Rhythmus«
 *   · Dreiergruppe Baum · 2 Büsche · Fels, Kugel-in-Kugel-Kronen und -Wolken aus T4 / H0-How-to §5
 *   · Clay-Partikel clay-vfx.v1 + clay-particle-profiles.v1 (nur Hinweise, kein Gameplay)
 *   · Himmel: TinySkies-Verläufe (sky-core.r0a.js), Licht nach H0 §4
 * Neu in R0A: Gelände als Höhenfeld mit Knetspuren im Mesh (Worley-Stempel, Georg 29.09.), Einbettung der Häuser ohne
 * Bodenplatte (Terrasse, Hangschnitt, Knetwulst), Stadtstraßen im Straßenprofil von T4, Traversal-Masken als Overlay.
 * Besitzt NICHT: Lokomotion, Walk/Auto/Flug-Zustände, [I]-Interaktion, Kollision, Kontaktschatten, Performance → R0B. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { makeClayRelief } from '../lab-clay/clay-relief.v2.js';
import { makeClayUniforms, makeClayMaterial, seedGeometry, makePrintTexture, PROFILES } from '../lab-clay/clay-material.v10.js?r=2';
import { makeToolReliefs } from '../lab-clay/clay-relief.v4.js';
import { TOOLMIX } from '../lab-clay/clay-toolmix.v1.js?r=2';
import { patchify } from '../lab-track/transition-atlas.v1.js?r=14';
import { KFB_BLEND_GLSL } from '../lab-track/road-markings.m1.js?r=4';
import { makeClayVFX } from '../lab-vfx/clay-vfx.v1.js?r=3';
import { SKY_PRESETS, makeSkyDome } from './sky-core.r0a.js?r=1';

const here = f => new URL(f, import.meta.url).href;
const V = a => new THREE.Vector3(a[0], a[1], a[2]);
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const h1 = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const vn1 = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return h1(i) * (1 - u) + h1(i + 1) * u; };
const h2 = (i, j) => { const v = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return v - Math.floor(v); };
const vn2 = (x, z) => { const i = Math.floor(x), j = Math.floor(z), fx = x - i, fz = z - j, u = fx * fx * (3 - 2 * fx), w = fz * fz * (3 - 2 * fz);
  const a = h2(i, j), b = h2(i + 1, j), c = h2(i, j + 1), d = h2(i + 1, j + 1); return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w; };
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
// Segment a→b in XZ: t entlang (m), lat quer (+ = rechts bei Blick entlang a→b, three: Vorwärts × Oben)
const seg = (x, z, a, b) => { const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1, tx = dx / L, tz = dz / L, px = x - a[0], pz = z - a[1];
  return { t: px * tx + pz * tz, lat: pz * tx - px * tz, L, tx, tz }; };
const rectOut = (x, z, a, b, hw) => { const s = seg(x, z, a, b); return Math.hypot(Math.max(0, Math.abs(s.lat) - hw), Math.max(0, -s.t, s.t - s.L)); };
const polyD = (x, z, pts) => { let best = 1e9, bi = 0, bt = 0; for (let k = 0; k < pts.length - 1; k++) { const s = seg(x, z, pts[k], pts[k + 1]), tc = clamp(s.t, 0, s.L), d = Math.hypot(s.lat, s.t - tc); if (d < best) { best = d; bi = k; bt = tc; } } return { d: best, k: bi, t: bt }; };

const ROAD_V = `attribute float aW; attribute float aBio; attribute vec2 aSU; varying float vW; varying float vBio; varying vec2 vSU;\n`;
const ROAD_F = 'uniform vec3 uRoadA, uRoadB, uRoadC; varying float vW; varying float vBio; varying vec2 vSU;\n' + KFB_BLEND_GLSL;
const ROAD_APPLY = /* glsl */`
{ vec3 cO = vBio > 0.5 ? uRoadC : uRoadA; float rim; float sel = kfbBlend(vSU, 1.7, vW, rim); diffuseColor.rgb = mix(cO, uRoadB, sel) * (1.0 - 0.12 * rim); }
`;

export async function boot(canvas, onNote = () => {}) {
  const tBoot = performance.now();
  const info = { fps: 0, calls: 0, frameTris: 0, tris: 0, loadMs: 0, buildMs: 0, errors: [], donors: 0, donorMs: 0, stamps: {}, buildings: 0, props: 0, clusters: 0, fence: 0, terrainVerts: 0, cam: 'overview', sky: 'tiny-tag', guard: null };
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.info.autoReset = false; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.12, 9000);
  const controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.dampingFactor = 0.08; controls.zoomToCursor = true;

  onNote('Rezept wird gelesen …');
  const [RC, td, PP] = await Promise.all([
    fetch(here('world-recipe.r0a.json?r=6')).then(r => r.json()),
    fetch(here('../lab-track/data/td03.stream.json')).then(r => r.json()),
    fetch(here('../lab-vfx/clay-particle-profiles.v1.json?r=2')).then(r => r.json())]);
  const PAL = RC.biome.palette, MATR = RC.material, K = MATR.handK, QUIET = MATR.QUIET, TILE = RC.tile, TR = RC.terrain;

  // ---------- Spender: jeder einzeln geladen, Fußpunkt auf 0, Grundriss mittig (Messung wie DONOR_ISOLATION) ----------
  onNote('Spender werden geladen (KayKit, Kenney, Tiny Treats) …');
  const loader = new GLTFLoader(), DON = {}, tD = performance.now();
  const geoOf = gl => { gl.scene.updateMatrixWorld(true); const parts = []; let mat = null;
    gl.scene.traverse(o => { if (!o.isMesh) return; let g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld); if (g.index) g = g.toNonIndexed();
      for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
      if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
      if (!g.attributes.normal) g.computeVertexNormals(); parts.push(g); mat = mat || (Array.isArray(o.material) ? o.material[0] : o.material); });
    const g = parts.length > 1 ? mergeGeometries(parts) : parts[0]; g.computeBoundingBox(); const b = g.boundingBox, c = b.getCenter(new THREE.Vector3());
    g.translate(-c.x, -b.min.y, -c.z); g.computeBoundingBox(); return { g, mat, size: g.boundingBox.getSize(new THREE.Vector3()), scene: gl.scene, meshes: parts.length, tris: g.attributes.position.count / 3 }; };
  const donorP = Promise.all(RC.donors.map(async d => { try { const gl = await loader.loadAsync(RC.donorPin + d.path.split('/').map(encodeURIComponent).join('/'));
    DON[d.id] = { ...d, ...geoOf(gl) }; info.donors++; } catch (e) { info.errors.push('SOURCE_REQUIRED ' + d.id + ': ' + e.message); } }));

  // ---------- Knete anrühren (wie T4 v5: MessageChannel gegen gedrosselte 0-ms-Timer) ----------
  onNote('Knete wird angerührt …');
  await new Promise(r => setTimeout(r, 0));
  const rel = makeClayRelief({ size: 1024, seed: 31 });
  const tex = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.generateMipmaps = true; tex.needsUpdate = true;
  const U = makeClayUniforms(THREE, tex); U.uClayMottle.value = MATR.mottle;
  const _st = window.setTimeout, mc = new MessageChannel(), mq = []; mc.port1.onmessage = () => { const f = mq.shift(); f && f(); };
  window.setTimeout = (f, d, ...a) => (d ? _st(f, d, ...a) : (mq.push(() => f(...a)), mc.port2.postMessage(0), 0));
  let trl; try { trl = await makeToolReliefs({ size: 1024, seed: 41, onStep: t => onNote('Werkzeug ' + t + ' …') }); } finally { window.setTimeout = _st; mc.port1.close(); }
  { const mk = d => { const t = new THREE.DataTexture(d, trl.size, trl.size, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); t.needsUpdate = true; return t; };
    [U.uClayToolA.value, U.uClayToolB.value, U.uClayToolC.value] = trl.maps.map(mk); U.uClayToolOn.value = 1; U.uClayLegacyStroke.value = 0; }
  try { U.uClayPrint.value = await makePrintTexture(THREE, here('../ref/clay-joebinns/Fingerprints01_3K.png'), 2048); U.uClayPrintOn.value = 1; }
  catch (e) { info.errors.push('Fingerabdrücke: Karte nicht im Projekt (external/NOT_EXPORTED)'); U.uClayPrint.value = tex; U.uClayPrintOn.value = 0; }
  U.uClayHand.value = 0.5 * K; U.uClayTile.value = 1.6 * K; U.uClayPrintTile.value = 4.5 * K; U.uClayMacro.value = MATR.macro; U.uClayLodK.value = MATR.lodK; U.uClayStroke.value = MATR.stroke;

  // ---------- Licht (H0 §4) + Himmel ----------
  const sun = new THREE.DirectionalLight('#fff4e6', 2.9); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.bias = -0.00003; sun.shadow.normalBias = 0; scene.add(sun, sun.target);
  const SHADOW = { profile: 'KFB_SHARED_SHADOW_CONTACT_V1_R0A', dir: new THREE.Vector3(), half: 0, mapX: 0, report: null };
  const hemi = new THREE.HemisphereLight('#eef4fa', '#9a8a78', 1.05); scene.add(hemi);
  const back = new THREE.DirectionalLight('#ffe6d6', 0.6); scene.add(back);
  const SKY = makeSkyDome(THREE); scene.add(SKY.mesh);
  const CX = (TILE.x0 + TILE.x1) / 2, CZ = (TILE.z0 + TILE.z1) / 2;
  { const el = 42 * Math.PI / 180, az = 128 * Math.PI / 180, d = new THREE.Vector3(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
    SHADOW.dir.copy(d).normalize();
    sun.position.set(CX, 0, CZ).addScaledVector(d, 700); sun.target.position.set(CX, 0, CZ);
    back.position.set(CX, 0, CZ).addScaledVector(new THREE.Vector3(-d.x, 0.45, -d.z), 300); }
  const shadowFollow = (focus, forcedHalf = null) => {
    const sh = sun.shadow, cam = sh.camera, SUN_D = 700;
    const dist = camera.position.distanceTo(focus);
    const half = forcedHalf == null ? THREE.MathUtils.clamp(Math.round(dist * 1.6 / 10) * 10, 90, 260) : forcedHalf;
    const texel = 2 * half / Math.max(1, sh.mapSize.x);
    if (half !== SHADOW.half || sh.mapSize.x !== SHADOW.mapX) {
      SHADOW.half = half; SHADOW.mapX = sh.mapSize.x;
      Object.assign(cam, { left: -half, right: half, top: half, bottom: -half, near: SUN_D - Math.max(half * 1.2, 380), far: SUN_D + half * 1.2 + 80 });
      cam.updateProjectionMatrix();
      sh.normalBias = texel * 1.2; sh.bias = -0.00003;
    }
    const sd = SHADOW.dir, e1 = new THREE.Vector3(0, 1, 0).cross(sd).normalize(), e2 = sd.clone().cross(e1).normalize();
    const a = Math.round(focus.dot(e1) / texel) * texel, b = Math.round(focus.dot(e2) / texel) * texel;
    const f = e1.multiplyScalar(a).addScaledVector(e2, b).addScaledVector(sd, focus.dot(sd));
    sun.target.position.copy(f); sun.position.copy(f).addScaledVector(sd, SUN_D); sun.target.updateMatrixWorld();
    SHADOW.report = { profile: SHADOW.profile, halfM: half, texelM: +texel.toFixed(5), normalBias: +sh.normalBias.toFixed(5), normalBiasTexels: 1.2, bias: sh.bias, mapSize: [sh.mapSize.x, sh.mapSize.y], focus: focus.toArray().map(v => +v.toFixed(2)) };
  };

  // ---------- Materialien je Klasse (Rezept material.classes) ----------
  const M = {};
  const prof = (key, scale, over = {}) => { const p = { ...PROFILES[key], ...over }; p.scale = (scale ?? p.scale) * K; p.gougeSize *= K; p.crackSize *= K; p.dentSize *= K; return p; };
  const clay = (key, color, pkey, scale, mix, over = {}, extra = {}) => { const p = { ...prof(pkey, scale, over), tools: mix ? TOOLMIX[mix] : null, legacy: mix ? 0 : 1 };
    return (M[key] = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color, vertexColors: !!extra.vc, side: extra.side ?? THREE.FrontSide }), profile: p, role: extra.role })); };
  const GROUND = { print: 0, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 1, crease: 0.6 };
  clay('terrain', '#ffffff', 'terrainFg', 1.1, 'terrain', GROUND, { vc: true });
  const TPU = patchify(M.terrain, 'r0a-terrain', RC.biome.patchRules.slope.cell); TPU.uPB.value.set(PAL.slope); TPU.uPC.value.set(PAL.city);
  clay('bg', PAL.grass, 'terrainBg', 3.2, 'terrain', { print: 0, dent: 0, gouge: 0, crack: 0, stroke: 0.9, facet: 0.8, crease: 0.4 });
  clay('bgHill0', PAL.slope, 'terrainFg', 1.1, 'terrain', GROUND); clay('bgHill1', '#a582d9', 'terrainFg', 1.1, 'terrain', GROUND);
  clay('strang', PAL.strang, 'house', 0.6, 'strang', QUIET); const SPU = patchify(M.strang, 'r0a-strang', 1.7); SPU.uPB.value.set(PAL.curb);
  clay('strangPlain', PAL.strang, 'house', 0.6, 'strang', QUIET);
  const RU = { uRoadA: { value: new THREE.Color(PAL.roadStreet) }, uRoadB: { value: new THREE.Color(PAL.roadTrack) }, uRoadC: { value: new THREE.Color(PAL.path) } };
  { const m = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color: '#ffffff' }), profile: { ...prof('road', 0.5), legacy: 1 } }), prev = m.onBeforeCompile;
    m.onBeforeCompile = (sh, r) => { prev(sh, r); Object.assign(sh.uniforms, RU);
      sh.vertexShader = ROAD_V + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vW = aW; vBio = aBio; vSU = aSU;');
      sh.fragmentShader = ROAD_F + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n' + ROAD_APPLY); };
    m.customProgramCacheKey = () => 'kfb-clay-v10-road7-r0a'; M.road = m; }
  clay('walk', PAL.walk, 'prop', 0.5, 'rock', QUIET); clay('curb', PAL.curb, 'prop', 0.5, 'rock', QUIET);
  clay('path', PAL.path, 'terrainFg', 1.1, 'terrain', GROUND);
  clay('markH', PAL.markHell, 'water', 0.9, null, { print: 0.2, dent: 0 }, { role: 'knetbar' });
  clay('markS', PAL.markSignal, 'water', 0.9, null, { print: 0.2, dent: 0 }, { role: 'knetbar' });
  clay('water', PAL.water, 'water', 0.9, null, { print: 0.1, dent: 0 }, { role: 'knetbar' });
  clay('skirtWalk', PAL.walk, 'terrainFg', 1.1, 'terrain', GROUND); clay('skirtGrass', '#ffffff', 'terrainFg', 1.1, 'terrain', GROUND, { vc: true });
  PAL.leaf.forEach((c, i) => clay('leaf' + i, c, 'nature', 0.6, 'nature', { print: 0.4, dent: 0 }));
  clay('trunk', PAL.trunk, 'nature', 0.6, 'trunk', { print: 0.4, dent: 0 }); clay('rock', PAL.rock, 'prop', 0.5, 'rock', QUIET);
  clay('cloud', PAL.cloud, 'cloud', 0.75, 'cloud', { dent: 0 }); clay('bridge', PAL.bridge, 'nature', 0.6, 'trunk', { print: 0.3, dent: 0 });
  clay('mouth', '#2b2436', 'terrainFg', 1.1, 'terrain', GROUND);
  PAL.kart.forEach((c, i) => clay('kart' + i, c, 'vehicle', 0.5 / K, 'vehicle', { dent: 0 }));
  clay('tyre', '#2e2c3a', 'vehicle', 0.5 / K, 'vehicle', { dent: 0 });
  clay('eye', '#fbf6ec', 'figure', 0.5 / K, null, { dent: 0 }, { role: 'knetbar' }); clay('pupil', '#17151d', 'figure', 0.5 / K, null, { dent: 0 }, { role: 'knetbar' });
  clay('skin', '#f2b48c', 'figure', 0.5 / K, 'vehicle', { dent: 0 });

  const root = new THREE.Group(); scene.add(root);
  const addMesh = (g, mat, { cast = true, recv = true, name = '', par = root } = {}) => { const o = new THREE.Mesh(g, mat); o.castShadow = cast; o.receiveShadow = recv; o.name = name; par.add(o); info.tris += (g.index ? g.index.count : g.attributes.position.count) / 3; return o; };
  const faceUp = g => { if (!g.attributes.normal) g.computeVertexNormals(); const n = g.attributes.normal.array; let u = 0; for (let k = 1; k < n.length; k += 3) u += n[k];
    if (u < 0 && g.index) { const ix = g.index.array; for (let k = 0; k < ix.length; k += 3) { const t = ix[k + 1]; ix[k + 1] = ix[k + 2]; ix[k + 2] = t; } g.computeVertexNormals(); } return g; };
  const bakeKeep = parts => mergeGeometries(parts.map(g => (g.index ? g.toNonIndexed() : g)), false);
  const bins = {}; const put = (key, g, seed) => { seedGeometry(THREE, g, seed); (bins[key] = bins[key] || []).push(g); };
  const R = rng(RC.seed); const pick = arr => arr[Math.floor(R() * arr.length)];

  await donorP; info.donorMs = Math.round(performance.now() - tD);
  const t0 = performance.now();

  // ---------- Track: TD03-Ausschnitt, unverändert im Stream-Rahmen ----------
  const S = td.samples, N = S.length, ds = td.ds, [sA, sB] = RC.track.sRange;
  const iA = clamp(Math.round(sA / ds), 1, N - 1), iB = Math.min(N - 1, Math.round(sB / ds));
  const at = s => { const x = clamp(s / ds, 0, N - 1.001), i = Math.floor(x), f = x - i, a = S[i], b = S[i + 1];
    const l = (u, w) => V(u).lerp(V(w), f); return { p: l(a.p, b.p), T: l(a.T, b.T).normalize(), U: l(a.U, b.U).normalize(), R: l(a.R, b.R).normalize(), i, q: a }; };
  const W3 = (q, l, h) => [q.p[0] + q.R[0] * l + q.U[0] * h, q.p[1] + q.R[1] * l + q.U[1] * h, q.p[2] + q.R[2] * l + q.U[2] * h];
  const surf = i => (S[i].prm.surface ?? 1) > 0.5;
  const [kb0, kb1] = RC.track.kerbTransition, [rb0, rb1] = RC.track.roadBlend;
  const btS = s => sstep(kb0, kb1, s), wRoad = s => 1 - sstep(rb0, rb1, s);
  const ks = new Float32Array(N);
  { const kr = new Float32Array(N); for (let i = Math.max(4, iA - 40); i <= Math.min(N - 5, iB + 40); i++) { const a = S[i - 4], b = S[i + 4], q = S[i];
      kr[i] = ((b.T[0] - a.T[0]) * q.R[0] + (b.T[1] - a.T[1]) * q.R[1] + (b.T[2] - a.T[2]) * q.R[2]) / Math.max(0.5, b.s - a.s); }
    for (let i = iA; i <= iB; i++) { let v = 0, n = 0; for (let j = Math.max(0, i - 16); j <= Math.min(N - 1, i + 16); j++) { v += kr[j]; n++; } ks[i] = v / n; } }
  const runs = []; { let a = -1; for (let i = iA; i <= iB + 1; i++) { const on = i <= iB && surf(i); if (on && a < 0) a = i; if (!on && a >= 0) { if (i - a > 2) runs.push([a, i - 1]); a = -1; } } }
  const airAdj = i => (i > 0 && !surf(i - 1)) || (i < N - 1 && !surf(i + 1));

  // ---------- Gelände: Höhenfeld nach Rezept ----------
  onNote('Gelände wird geknetet …');
  const G = TILE.grid, nx = Math.round((TILE.x1 - TILE.x0) / G) + 1, nz = Math.round((TILE.z1 - TILE.z0) / G) + 1, NV = nx * nz;
  const H = new Float32Array(NV), PROT = new Float32Array(NV), CITY = new Float32Array(NV), BED = new Float32Array(NV), HILLW = new Float32Array(NV), DISP = new Float32Array(NV);
  const XV = i => TILE.x0 + i * G, ZV = j => TILE.z0 + j * G;
  const each = (x0, z0, x1, z1, fn) => { const i0 = clamp(Math.floor((x0 - TILE.x0) / G), 0, nx - 1), i1 = clamp(Math.ceil((x1 - TILE.x0) / G), 0, nx - 1), j0 = clamp(Math.floor((z0 - TILE.z0) / G), 0, nz - 1), j1 = clamp(Math.ceil((z1 - TILE.z0) / G), 0, nz - 1);
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) fn(j * nx + i, XV(i), ZV(j)); };
  const Hat = (x, z, arr = H) => { const fx = clamp((x - TILE.x0) / G, 0, nx - 1.001), fz = clamp((z - TILE.z0) / G, 0, nz - 1.001), i = Math.floor(fx), j = Math.floor(fz), u = fx - i, w = fz - j, k = j * nx + i;
    return lerp(lerp(arr[k], arr[k + 1], u), lerp(arr[k + nx], arr[k + nx + 1], u), w); };
  // 1 Grundwelle + Hügel
  const B = TR.base;
  each(TILE.x0, TILE.z0, TILE.x1, TILE.z1, (v, x, z) => {
    let h = B.amp * (vn2(x * B.freq, z * B.freq) - 0.5) * 2 + B.amp2 * (vn2(x * B.freq2 + 5.3, z * B.freq2 + 9.1) - 0.5) * 2, hw = 0;
    for (const hl of TR.hills) { const d = Math.hypot(x - hl.x, z - hl.z) / hl.r; if (d >= 1) continue;
      const lx = (hl.lean?.[0] || 0) * (x - hl.x) / hl.r, lz = (hl.lean?.[1] || 0) * (z - hl.z) / hl.r;
      const y = hl.h * Math.pow(1 - d * d, 1.35 * (hl.squash || 1)) * (1 + lx + lz) * (1 + 0.14 * (vn2(x / 13 + hl.x, z / 13 - hl.z) - 0.5) * 2); h += y; hw = Math.max(hw, y / Math.max(4, hl.h)); }
    H[v] = h; HILLW[v] = hw; });
  // 2 T4-Grat: der Strang liegt auf Knete, keine Stützen. Kern = Schnitt/Füllung, außen Böschung mit Nase an den Laufenden
  const RG = TR.trackRidge, RIDGE = new Float32Array(NV).fill(-1e9), CUT = new Float32Array(NV).fill(1e9);
  const TRK = []; for (let i = iA; i <= iB; i += 2) if (surf(i)) TRK.push(i);
  for (let n = 0; n < TRK.length; n++) { const i = TRK[n], q = S[i], bt = btS(q.s), y = q.p[1];
    const Th = Math.hypot(q.T[0], q.T[2]) || 1, Tx = q.T[0] / Th, Tz = q.T[2] / Th;
    const core = lerp(Math.max(-q.slots[0][0], q.slots[13][0]) + 0.6, (q.slots[7][0] - q.slots[6][0]) / 2 + 1.0, bt), under = lerp(RG.under, RG.coreLift, bt);
    const prevGap = n === 0 || TRK[n - 1] !== i - 2 || !surf(i - 1), nextGap = n === TRK.length - 1 || TRK[n + 1] !== i + 2 || !surf(i + 1);
    const noseS = prevGap && i > iA + 2, noseE = nextGap && i < iB - 2, rad = core + Math.max(0, y + 3) / RG.slope + 6;
    each(q.p[0] - rad, q.p[2] - rad, q.p[0] + rad, q.p[2] + rad, (v, x, z) => {
      const dx = x - q.p[0], dz = z - q.p[2], t = dx * Tx + dz * Tz, lat = Math.abs(-dx * Tz + dz * Tx); let te = 0;
      let cutOnly = false;
      if (t > 1.3) { if (!nextGap) return; if (!noseE) return; te = t - 1.3; } else if (t < -1.3) { if (!prevGap) return; if (n === 0 && t > -1.3 - (RC.track.portal.cutBack || 0)) cutOnly = true; else if (!noseS) return; else te = -1.3 - t; }
      if (cutOnly) { const ex0 = Math.max(0, lat - core); CUT[v] = Math.min(CUT[v], y - RG.coreLift + ex0 * RG.cutSlope); return; }
      const ex = Math.max(0, lat - core), dd = Math.hypot(ex, te);
      RIDGE[v] = Math.max(RIDGE[v], y - under - dd * RG.slope);
      if (te === 0) { CUT[v] = Math.min(CUT[v], y - RG.coreLift + ex * RG.cutSlope); PROT[v] = Math.max(PROT[v], 1 - sstep(core, core + 6, lat)); } }); }
  for (let v = 0; v < NV; v++) { if (RIDGE[v] > H[v]) H[v] = RIDGE[v]; if (CUT[v] < H[v]) H[v] = CUT[v]; }
  // 3 Knetbach
  const CR = TR.creek;
  each(TILE.x0, TILE.z0, TILE.x1, TILE.z1, (v, x, z) => { const pd = polyD(x, z, CR.pts); if (pd.d > CR.w / 2 + CR.bank) return; if (PROT[v] > 0.6) return;
    const bedY = CR.bed + 0.35 * (vn1(pd.t / 9 + pd.k * 3.7) - 0.5), k = sstep(CR.w / 2 * 0.5, CR.w / 2 + CR.bank, pd.d); H[v] = Math.min(H[v], lerp(bedY, H[v], k));
    BED[v] = 1 - sstep(CR.w / 2 * 0.7, CR.w / 2 + 1.8, pd.d); });
  // 4 Stadt: Straßen, Gehwege, Platz → Niveau 0; Schutz und Stadtfarbe
  const FLAT = TR.roadFlat.blend;
  const cityRect = (a, b, hw) => { const pad = hw + FLAT + 2; each(Math.min(a[0], b[0]) - pad, Math.min(a[1], b[1]) - pad, Math.max(a[0], b[0]) + pad, Math.max(a[1], b[1]) + pad, (v, x, z) => {
    const d = rectOut(x, z, a, b, hw); if (d > FLAT + 0.5) return; H[v] = lerp(-0.06, H[v], sstep(0, FLAT, d));
    PROT[v] = Math.max(PROT[v], 1 - sstep(2.5, 7, d)); CITY[v] = Math.max(CITY[v], 1 - sstep(RC.biome.patchRules.city.inner, RC.biome.patchRules.city.outer, d)); }); };
  for (const r of RC.roads) cityRect(r.a, r.b, r.w / 2 + 0.3);
  for (const w of RC.sidewalks) cityRect(w.a, w.b, w.w / 2 + 0.2);
  for (const p of RC.plazas) { const pad = p.r + FLAT + 2; each(p.x - pad, p.z - pad, p.x + pad, p.z + pad, (v, x, z) => { const d = Math.max(0, Math.hypot(x - p.x, z - p.z) - p.r - 0.3); if (d > FLAT + 0.5) return;
      H[v] = lerp(-0.06, H[v], sstep(0, FLAT, d)); PROT[v] = Math.max(PROT[v], 1 - sstep(2.5, 7, d)); CITY[v] = Math.max(CITY[v], 1 - sstep(0, 9, d)); }); if (p.link) cityRect(p.link.a, p.link.b, p.link.w / 2); }
  // Pfad und Offroad: teilweise geschützt (Knetspuren bleiben leise)
  for (const pth of RC.paths) each(TILE.x0, TILE.z0, TILE.x1, TILE.z1, (v, x, z) => { const pd = polyD(x, z, pth.pts); if (pd.d < pth.w / 2 + 3) PROT[v] = Math.max(PROT[v], 0.75 * (1 - sstep(pth.w / 2, pth.w / 2 + 3, pd.d))); });
  const inPoly = (x, z, P) => { let c = false; for (let a = 0, b = P.length - 1; a < P.length; b = a++) if (((P[a][1] > z) !== (P[b][1] > z)) && (x < (P[b][0] - P[a][0]) * (z - P[a][1]) / (P[b][1] - P[a][1]) + P[a][0])) c = !c; return c; };
  for (const o of RC.masks.drive.offroad) each(TILE.x0, TILE.z0, TILE.x1, TILE.z1, (v, x, z) => { if (inPoly(x, z, o.poly)) PROT[v] = Math.max(PROT[v], 0.45); });
  for (const nb of RC.masks.noBuild) { const b = nb.box; each(b.x0, b.z0, b.x1, b.z1, v => { PROT[v] = Math.max(PROT[v], 0.6); }); }
  // 5 Häuser: Terrasse (pad) oder Hangschnitt (slope), keine Bodenplatte
  const FP = RC.buildings.map(bd => { const d = DON[bd.donor]; if (!d) return null; const f = new THREE.Vector2(bd.face[0], bd.face[1]).normalize();
    return { ...bd, fx: f.x, fz: f.y, hu: d.size.x * d.scale / 2, hv: d.size.z * d.scale / 2 }; }).filter(Boolean);
  const loc = (b, x, z) => { const dx = x - b.x, dz = z - b.z; return { u: dx * b.fz - dz * b.fx, v: dx * b.fx + dz * b.fz }; };
  const PD = TR.pads;
  for (const b of FP) {
    b.padY = b.embed === 'slope' ? Hat(b.x + b.fx * (b.hv + 1.5), b.z + b.fz * (b.hv + 1.5)) : (Hat(b.x, b.z) > 0.8 ? Hat(b.x, b.z) : 0);
    const rr = Math.hypot(b.hu, b.hv) + PD.apron + PD.blend + 2;
    each(b.x - rr, b.z - rr, b.x + rr, b.z + rr, (v, x, z) => { const l = loc(b, x, z), du = Math.max(0, Math.abs(l.u) - b.hu), dv = Math.max(0, Math.abs(l.v) - b.hv), d = Math.hypot(du, dv);
      PROT[v] = Math.max(PROT[v], 1 - sstep(1.5, 5, d));
      if (b.embed === 'slope') { const inner = Math.abs(l.u) < b.hu - 0.35 && Math.abs(l.v) < b.hv - 0.35;
        if (inner) { H[v] = b.padY; return; }
        if (l.v > b.hv - 0.35) { H[v] = d <= PD.apron ? b.padY : lerp(b.padY, H[v], sstep(PD.apron, PD.apron + PD.blend, d)); return; }
        if (H[v] < b.padY) H[v] = lerp(b.padY, H[v], sstep(0, PD.blend, d)); return; }
      H[v] = d <= PD.apron ? b.padY : lerp(b.padY, H[v], sstep(PD.apron, PD.apron + PD.blend, d)); }); }
  // 6 Rand der Kachel senkt sich unter die Hintergrundplatte
  each(TILE.x0, TILE.z0, TILE.x1, TILE.z1, (v, x, z) => { const e = Math.min(x - TILE.x0, TILE.x1 - x, z - TILE.z0, TILE.z1 - z); const k = sstep(0, TILE.edgeFade, e); if (k < 1) H[v] = lerp(-0.45, H[v], k); if (e < 4) PROT[v] = 1; });

  // 7 Knetspuren im Mesh (Georg 29.09.): Worley-Zellen, eine Spur je Zelle, Größe nach Potenzgesetz × Klassenmaß
  const MT = RC.meshTools, ST = MT.stamps, R2 = rng(RC.seed + 77);
  const gradAt = (x, z, arr = H) => [(Hat(x + 1.5, z, arr) - Hat(x - 1.5, z, arr)) / 3, (Hat(x, z + 1.5, arr) - Hat(x, z - 1.5, arr)) / 3];
  const range = (r, u) => r[0] + (r[1] - r[0]) * u, pw = u => Math.pow(u, 1.8);
  const stampList = [];
  { const CS = MT.cell || 4.2;
    for (let cz = TILE.z0; cz < TILE.z1; cz += CS) for (let cx = TILE.x0; cx < TILE.x1; cx += CS) {
      const x = cx + R2() * CS, z = cz + R2() * CS, pr = Hat(x, z, PROT), hw = Hat(x, z, HILLW), g = gradAt(x, z), sl = Math.hypot(g[0], g[1]);
      const u0 = R2(), u1 = R2(), u2 = R2(), u3 = R2(), u4 = R2(), u5 = R2();
      if (pr > 0.97) continue;
      const cls = pr > 0.05 && pr < 0.75 ? 'seam' : (hw > 0.3 || sl > 0.35 || Hat(x, z) > 4.5 ? 'hill' : 'meadow'), C = MT.classes[cls];
      const dens = (0.3 + 0.7 * vn2(x / 65 + 3.3, z / 65 - 1.7)) * C.density; if (u0 > dens) continue;
      let acc = 0, type = 'thumb'; for (const [k, w] of Object.entries(C.weights)) { acc += w; if (u1 <= acc) { type = k; break; } }
      let th = vn2(x / 90 + 17, z / 90 - 4) * Math.PI * 2.6;
      if (cls === 'seam') { const gp = gradAt(x, z, PROT); if (Math.hypot(gp[0], gp[1]) > 1e-4) th = Math.atan2(gp[0], -gp[1]) + (u5 - 0.5) * 0.5; }   // parallel zur geschützten Kante
      else if (sl > 0.2) { const con = Math.atan2(g[0], -g[1]); th = lerp(th, con + (u5 - 0.5) * 0.9, 0.6); }                              // am Hang entlang der Höhenlinie
      const sc = C.scale * (0.78 + 0.44 * u4);
      stampList.push({ x, z, type, cls, th, sc, u2, u3, u4 }); info.stamps[type] = (info.stamps[type] || 0) + 1; } }
  for (const st of stampList) {
    const c = Math.cos(st.th), s = Math.sin(st.th), sc = st.sc; let rad, fn;
    if (st.type === 'thumb') { const r = range(ST.thumb.r, pw(st.u2)) * sc, dp = range(ST.thumb.depth, st.u3) * sc, asp = range(ST.thumb.aspect, st.u4), rim = ST.thumb.rim; rad = r * 1.7;
      fn = (a, b) => { const q = Math.hypot(a / r, b / (r * asp)); let d = 0; if (q < 1) d -= dp * (1 - q * q) * (1 - q * q); const push = 1 + 0.7 * clamp(a / r, -1, 1); if (q < 1.7) d += rim * dp * push * Math.exp(-(((q - 1.05) / 0.24) ** 2)); return d; }; }
    else if (st.type === 'spatula') { const L = range(ST.spatula.len, pw(st.u2)) * sc, w = range(ST.spatula.w, st.u4) * sc, dp = range(ST.spatula.depth, st.u3) * sc, hw = w / 2; rad = L + w;
      fn = (a, b) => { if (a < -w || a > L + w) return 0; const along = sstep(-0.2 * w, L * 0.28, a) * (1 - sstep(L * 0.9, L * 1.0, a)), cross = 1 - sstep(hw * 0.55, hw, Math.abs(b));
        const ridge = ST.spatula.ridge * dp * Math.exp(-(((b - hw * 1.15) / (w * 0.2)) ** 2)) * sstep(0, L * 0.3, a) * (1 - sstep(L * 0.95, L * 1.05, a));
        const lift = ST.spatula.lift * dp * Math.exp(-(((a - L) / (w * 0.35)) ** 2)) * (1 - sstep(hw * 0.6, hw * 1.2, Math.abs(b))); return -dp * cross * along + ridge + lift; }; }
    else if (st.type === 'notch') { const L = range(ST.notch.len, pw(st.u2)) * sc, w = range(ST.notch.w, st.u4) * sc, dp = range(ST.notch.depth, st.u3) * sc; rad = L / 2 + w;
      fn = (a, b) => { const al = 1 - (2 * a / L) ** 2; if (al <= 0) return 0; const cr = Math.max(0, 1 - Math.abs(b) / (w / 2)); return -dp * cr * Math.sqrt(al) + 0.25 * dp * Math.exp(-(((Math.abs(b) - w * 0.62) / (w * 0.16)) ** 2)) * al; }; }
    else { const r = range(ST.pinch.r, pw(st.u2)) * sc, hh = range(ST.pinch.h, st.u3) * sc; rad = r * 1.2; fn = (a, b) => { const q = Math.hypot(a, b * 1.25) / r; return q < 1 ? hh * (1 - q * q) * (1 - q * q) : 0; }; }
    each(st.x - rad, st.z - rad, st.x + rad, st.z + rad, (v, x, z) => { const dx = x - st.x, dz = z - st.z, a = dx * c + dz * s, b = -dx * s + dz * c; const d = fn(a, b); if (d) DISP[v] += d; }); }
  const AMP = new Float32Array(NV); for (let v = 0; v < NV; v++) { AMP[v] = 1 - PROT[v]; DISP[v] = clamp(DISP[v], MT.clamp[0] * 1.55, MT.clamp[1] * 1.55); }
  info.stampsTotal = stampList.length;

  // Gelände-Mesh: Farbe je Vertex (Grün, Höhe, Bachbett), Knetflecken Hang (violett) / Stadt (Platte)
  const tPos = new Float32Array(NV * 3), tCol = new Float32Array(NV * 3), tPW = new Float32Array(NV), tPB = new Float32Array(NV), tPS = new Float32Array(NV * 2);
  const cG = new THREE.Color(PAL.grass), cGH = new THREE.Color(PAL.grassHigh), cBed = new THREE.Color(PAL.bed), cc = new THREE.Color(), TT = RC.biome.patchRules.tint;
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) { const v = j * nx + i, x = XV(i), z = ZV(j);
    tPos[v * 3] = x; tPos[v * 3 + 1] = H[v]; tPos[v * 3 + 2] = z; tPS[v * 2] = x; tPS[v * 2 + 1] = z;
    cc.copy(cG).lerp(cGH, sstep(TT.highFrom, TT.highTo, H[v]) * (1 - CITY[v])).lerp(cBed, BED[v] * 0.85).multiplyScalar(1 + TT.amp * (vn2(x / TT.lowFreq * 3, z / TT.lowFreq * 3) - 0.5) * 2);
    tCol[v * 3] = cc.r; tCol[v * 3 + 1] = cc.g; tCol[v * 3 + 2] = cc.b; }
  const tIdx = []; for (let j = 0; j < nz - 1; j++) for (let i = 0; i < nx - 1; i++) { const a = j * nx + i, b = a + 1, c2 = a + nx, d = c2 + 1; tIdx.push(a, c2, b, b, c2, d); }
  const tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.BufferAttribute(tPos, 3)); tg.setAttribute('color', new THREE.BufferAttribute(tCol, 3));
  tg.setAttribute('aPW', new THREE.BufferAttribute(tPW, 1)); tg.setAttribute('aPBio', new THREE.BufferAttribute(tPB, 1)); tg.setAttribute('aPS', new THREE.BufferAttribute(tPS, 2)); tg.setIndex(tIdx);
  seedGeometry(THREE, tg, 1301);
  const SR = RC.biome.patchRules.slope;
  let patchDone = false;   // Knetflecken aus der Grundform, nicht aus den Knetspuren (sonst sprenkelt jede Delle violett)
  const applyDisp = on => { const p = tg.attributes.position; for (let v = 0; v < NV; v++) p.array[v * 3 + 1] = H[v] + (on && patchDone ? DISP[v] * AMP[v] : 0); p.needsUpdate = true; tg.computeVertexNormals();
    if (patchDone) { tg.computeBoundingSphere(); return; } patchDone = true;
    const n = tg.attributes.normal; for (let v = 0; v < NV; v++) { const ny = n.array[v * 3 + 1], sn = Math.sqrt(Math.max(0, 1 - ny * ny)), sw = sstep(SR.from, SR.to, sn) * (1 - CITY[v]) * (1 - BED[v]), cw = CITY[v];
      tPW[v] = Math.max(sw, cw); tPB[v] = cw >= sw ? 1 : 0; } tg.attributes.aPW.needsUpdate = true; tg.attributes.aPBio.needsUpdate = true; applyDisp(on); };
  applyDisp(true); info.terrainVerts = NV;
  const CR3 = [0, 1, 2].map(c => { const a = new Float32Array(NV); for (let v = 0; v < NV; v++) a[v] = tCol[v * 3 + c]; return a; });
  const colAt = (x, z) => CR3.map(a => Hat(x, z, a));
  const terrainMesh = addMesh(tg, M.terrain, { name: 'gelaende' });
  const GH = (x, z) => { const inT = x >= TILE.x0 && x <= TILE.x1 && z >= TILE.z0 && z <= TILE.z1; if (!inT) return -0.35; return Hat(x, z) + Hat(x, z, DISP) * Hat(x, z, AMP); };

  // Hintergrund: Platte + Ring aus Knetbuckeln (T4-Hügelgrammatik), außerhalb der Kachel
  { const g = new THREE.CircleGeometry(TILE.background.plane, 96); g.rotateX(-Math.PI / 2); g.translate(CX, TILE.background.y, CZ); addMesh(g, M.bg, { cast: false, name: 'hintergrund' });
    const RB = rng(RC.seed + 5); let n = 0, tries = 0;
    while (n < TILE.background.ringHills && tries++ < 400) { const a = RB() * Math.PI * 2, rr = 300 + RB() * 380, x = CX + Math.cos(a) * rr * 1.15, z = CZ + Math.sin(a) * rr, rx = 38 + RB() * 50, ry = 26 + RB() * 42, rz = rx * (0.7 + RB() * 0.4);
      if (x > TILE.x0 - rx - 30 && x < TILE.x1 + rx + 30 && z > TILE.z0 - rx - 30 && z < TILE.z1 + rx + 30) continue;
      const hg = new THREE.SphereGeometry(1, 48, 28), p = hg.attributes.position, lean = (RB() - 0.5) * 0.6;
      for (let k = 0; k < p.count; k++) { const X = p.getX(k), Y = p.getY(k), Z = p.getZ(k); p.setXYZ(k, X * rx + lean * rx * Y * Y, Y * ry, Z * rz); }
      hg.computeVertexNormals(); hg.rotateY(RB() * Math.PI); hg.translate(x, -ry * 0.18, z); put(n % 3 === 0 ? 'bgHill1' : (n % 3 === 1 ? 'bgHill0' : 'bg'), hg, 40 + n); n++; } }

  // ---------- T4-Strang über dem Grat ----------
  onNote('Strang wird gerollt …');
  const SIDE = { 1: { road: 7, sh: 8, ib: 9, it: 10, ot: 11, un: 13 }, [-1]: { road: 6, sh: 5, ib: 4, it: 3, ot: 2, un: 0 } }, RIB = 3.5;
  const sideProfile = (q, i, sd) => { const I = SIDE[sd], sl = q.slots, o = q.prm.offset || 0;
    const e = sd * (sl[I.road][0] - o), ib = sd * (sl[I.ib][0] - o), Hh = sl[I.it][1], drop = Math.max(0, -sl[I.sh][1]), D = sl[I.un][1];
    const bt = btS(q.s), Hx = lerp(Hh, 0.32, bt), ibx = lerp(ib, e + 0.35, bt);
    const inner = sstep(0.008, 0.022, ks[i] * sd) * (1 - bt), outer = sstep(0.014, 0.04, -ks[i] * sd) * (1 - bt), wave = 0.06 * (vn1(q.s / 9 + (sd > 0 ? 3.1 : 7.7)) - 0.5) * 2;
    const r = clamp(0.55 * (Hx + drop), 0.14, 1.25) * (1 + wave) * (1 + 0.32 * outer), rX = r;
    const cx = Math.max(ibx, e + 0.4) + 0.85 * rX + 0.12 * outer, top = Hx + 0.3 * outer, cy = top - r;
    const pts = [[e - 0.14, -0.03]], xa = cx - 0.94 * rX, ya = cy - 0.34 * r, rib = 0.5 + 0.5 * Math.cos(2 * Math.PI * q.s / RIB);
    for (let n = 1; n <= 6; n++) { const t = n / 7; let y = lerp(0, ya, t * t) - drop * Math.sin(Math.PI * t); y += inner * 0.26 * rib * Math.sin(Math.PI * Math.min(1, t * 1.3)); pts.push([e + t * (xa - e), y]); }
    for (let n = 0; n <= 14; n++) { const th = (200 - n * (240 / 14)) * Math.PI / 180, rr = r * (1 + inner * 0.12 * rib * Math.max(0, 1 - n / 3)); pts.push([cx + rr * Math.cos(th), cy + rr * Math.sin(th)]); }
    const y0 = cy - 0.64 * r, b = 0.14 * r, Dm = Math.min(D, y0 - 0.1, -0.7);
    pts.push([cx + 0.95 * rX + b, lerp(y0, Dm, 0.4)], [cx + 0.86 * rX + b, lerp(y0, Dm, 0.78)], [cx + 0.5 * rX, Dm + 0.06], [cx * 0.55, Dm - 0.02], [0, Dm - 0.04]);
    return pts; };
  const ringOf = (q, i) => { const L = sideProfile(q, i, -1), Rr = sideProfile(q, i, 1), o = q.prm.offset || 0;
    const pts = L.map(([x, y]) => W3(q, o - x, y)); for (let n = Rr.length - 1; n >= 0; n--) pts.push(W3(q, o + Rr[n][0], Rr[n][1])); return pts; };
  const lips = [];
  { const sp = [], si = [], rp = [], rw = [], rsu = [], ri = [], spw = [], spb = [], sps = [], rbio = []; let sBase = 0, rBase = 0;
    for (const [a, b] of runs) { let nr = 0;
      for (let i = a; i <= b; i++) { const q = S[i], ring = ringOf(q, i); nr = ring.length; let arc = 0;
        ring.forEach((p, k) => { if (k) arc += Math.hypot(p[0] - ring[k - 1][0], p[1] - ring[k - 1][1], p[2] - ring[k - 1][2]); sp.push(...p); spw.push(btS(q.s)); spb.push(0); sps.push(q.s, arc); });
        const L = q.slots[6], Rr = q.slots[7];
        for (let n = 0; n <= 6; n++) { const lat = lerp(L[0], Rr[0], n / 6), h = lerp(L[1], Rr[1], n / 6); rp.push(...W3(q, lat, h)); rw.push(wRoad(q.s)); rbio.push(0); rsu.push(q.s, lat); }
        if (i > a) { const A = sBase + (i - a - 1) * nr, Bq = sBase + (i - a) * nr; for (let k = 0; k < nr - 1; k++) si.push(A + k, Bq + k, A + k + 1, A + k + 1, Bq + k, Bq + k + 1);
          const C = rBase + (i - a - 1) * 7, E = rBase + (i - a) * 7; for (let k = 0; k < 6; k++) ri.push(C + k, C + k + 1, E + k, C + k + 1, E + k + 1, E + k); } }
      for (const [i, dir] of [[a, -1], [b, 1]]) { const base = sBase + (i - a) * nr, c = [0, 0, 0];
        for (let k = 0; k < nr; k++) for (let j = 0; j < 3; j++) c[j] += sp[(base + k) * 3 + j] / nr;
        const ci = sp.length / 3; sp.push(...c); spw.push(btS(S[i].s)); spb.push(0); sps.push(S[i].s, 0); const T = V(S[i].T), cV = V(c);
        for (let k = 0; k < nr - 1; k++) { const p0 = V(sp.slice((base + k) * 3, (base + k) * 3 + 3)), p1 = V(sp.slice((base + k + 1) * 3, (base + k + 1) * 3 + 3));
          const nrm = p0.clone().sub(cV).cross(p1.clone().sub(cV)); if (nrm.dot(T) * dir > 0) si.push(ci, base + k, base + k + 1); else si.push(ci, base + k + 1, base + k); } }
      sBase = sp.length / 3; rBase = rp.length / 3;
      for (const i of [a, b]) { if (!airAdj(i)) continue; const q = S[i], w = q.slots[13][0] - q.slots[0][0], g = new THREE.CapsuleGeometry(0.48, Math.max(0.5, w - 0.96), 8, 18);   // Querwulst nur an der Luft
        g.rotateZ(Math.PI / 2); g.applyMatrix4(new THREE.Matrix4().makeBasis(V(q.R), V(q.U), V(q.T).negate())); const c = W3(q, (q.slots[0][0] + q.slots[13][0]) / 2, -0.5); g.translate(c[0], c[1], c[2]); seedGeometry(THREE, g, 700 + i); lips.push(g); } }
    const gs = new THREE.BufferGeometry(); gs.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
    gs.setAttribute('aPW', new THREE.Float32BufferAttribute(spw, 1)); gs.setAttribute('aPBio', new THREE.Float32BufferAttribute(spb, 1)); gs.setAttribute('aPS', new THREE.Float32BufferAttribute(sps, 2)); gs.setIndex(si); gs.computeVertexNormals(); seedGeometry(THREE, gs, 11);
    addMesh(gs, M.strang, { name: 't4-strang' }); if (lips.length) addMesh(bakeKeep(lips), M.strangPlain, { name: 't4-lippen' });
    const gr = new THREE.BufferGeometry(); gr.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3)); gr.setAttribute('aW', new THREE.Float32BufferAttribute(rw, 1)); gr.setAttribute('aBio', new THREE.Float32BufferAttribute(rbio, 1));
    gr.setAttribute('aSU', new THREE.Float32BufferAttribute(rsu, 2)); gr.setIndex(ri); gr.computeVertexNormals(); seedGeometry(THREE, gr, 5); addMesh(gr, M.road, { name: 't4-fahrbahn' }); }
  // Markierung aus dem Stream (edges/centre), Farben M2
  { const parts = { markH: [] };
    const band = (s0, s1, latFn, w, key) => { const pts = []; for (let s = s0; s <= s1 + 1e-6; s += 0.5) { const a = at(s), q = S[a.i]; if (!surf(a.i)) { flush(); continue; } const l = latFn(q); pts.push([W3(q, l - w / 2, 0.03), W3(q, l + w / 2, 0.03)]); } flush();
      function flush() { if (pts.length < 2) { pts.length = 0; return; } const pos = [], idx = []; pts.forEach(([L, Rr], k) => { pos.push(...L, ...Rr); if (k) { const o = (k - 1) * 2; idx.push(o, o + 2, o + 1, o + 1, o + 2, o + 3); } });
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); faceUp(g); parts[key].push(g); pts.length = 0; } };
    for (const mk of td.markings) { if (mk.s1 < sA || mk.s0 > sB || mk.at === 'bars') continue; const s0 = Math.max(sA, mk.s0), s1 = Math.min(sB, mk.s1);
      if (mk.at === 'edges') band(s0, s1, q => mk.side * ((mk.side > 0 ? q.slots[7][0] : -q.slots[6][0]) - mk.inset - mk.w / 2), mk.w, 'markH');
      else band(s0, s1, q => q.prm.offset || 0, mk.w, 'markH'); }
    if (parts.markH.length) addMesh(bakeKeep(parts.markH), M.markH, { cast: false, name: 't4-markierung' }); }
  // Portal im Knetberg
  { const P = RC.track.portal, a = at(P.s), g = new THREE.TorusGeometry(P.r, P.tube, 16, 44, Math.PI); const Rn = a.R.clone().negate(); g.applyMatrix4(new THREE.Matrix4().makeBasis(Rn, a.U, a.T)); g.translate(a.p.x, a.p.y - 0.6, a.p.z);
    seedGeometry(THREE, g, 1401); addMesh(g, M.strangPlain, { name: 't4-portal' });
    const m = new THREE.CircleGeometry(P.r - P.tube * 0.6, 40, 0, Math.PI); m.applyMatrix4(new THREE.Matrix4().makeBasis(Rn, a.U, a.T)); m.translate(a.p.x - a.T.x * 0.35, a.p.y - 0.4, a.p.z - a.T.z * 0.35); addMesh(m, M.mouth, { name: 't4-tunnelmund' });
    for (const sd of [-1, 1]) { const f = new THREE.IcosahedronGeometry(P.tube * 1.7, 3); f.scale(1.2, 0.7, 1.2); const c = a.p.clone().addScaledVector(a.R, sd * P.r); f.translate(c.x, c.y - 0.4, c.z); seedGeometry(THREE, f, 1410 + sd); addMesh(f, M.strangPlain, { name: 't4-portal-fuss' }); } }
  // Stream-Ende → Stadt: kleine Kappe statt Querwulst
  { const q = S[iB]; for (const sd of [-1, 1]) { const g = new THREE.SphereGeometry(0.42, 16, 12); g.scale(1, 0.7, 1); const p = W3(q, sd * (q.slots[7][0] + 0.55), 0.1); g.translate(p[0], p[1], p[2]); addMesh(g, M.strangPlain, { name: 't4-ende' }); } }

  // ---------- Stadtstraßen: dasselbe Straßenprofil, dieselben Knetsteine ----------
  onNote('Stadtstraßen werden gelegt …');
  { const rp = [], rw = [], rb = [], rsu = [], ri = [];
    for (const r of RC.roads) { const s = seg(0, 0, r.a, r.b), L = s.L, n = Math.max(2, Math.ceil(L / 2)), hw = r.w / 2, base = rp.length / 3, Rx = -s.tz, Rz = s.tx;
      for (let k = 0; k <= n; k++) { const t = L * k / n, cx = r.a[0] + s.tx * t, cz = r.a[1] + s.tz * t;
        for (let m = 0; m <= 4; m++) { const lat = -hw + r.w * m / 4; rp.push(cx + Rx * lat, 0.0, cz + Rz * lat); rw.push(0); rb.push(0); rsu.push(t + (r.a[0] + r.a[1]) * 0.37, lat); } }
      for (let k = 0; k < n; k++) for (let m = 0; m < 4; m++) { const A = base + k * 5 + m, Bq = A + 5; ri.push(A, A + 1, Bq, A + 1, Bq + 1, Bq); } }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3)); g.setAttribute('aW', new THREE.Float32BufferAttribute(rw, 1)); g.setAttribute('aBio', new THREE.Float32BufferAttribute(rb, 1));
    g.setAttribute('aSU', new THREE.Float32BufferAttribute(rsu, 2)); g.setIndex(ri); faceUp(g);
    seedGeometry(THREE, g, 1501); addMesh(g, M.road, { name: 'stadtstrassen', cast: false }); }
  // Gehwegplatten (je 2,4 m, Fugen, leichte Schiefe) und Bordsteine (Knetsteine)
  const onWalk = (x, z) => RC.sidewalks.some(w => rectOut(x, z, w.a, w.b, w.w / 2) < 0.01) || RC.plazas.some(p => Math.hypot(x - p.x, z - p.z) < p.r || (p.link && rectOut(x, z, p.link.a, p.link.b, p.link.w / 2) < 0.01));
  { const slabs = [], stones = [], RS = rng(RC.seed + 11);
    const slabRun = (a, b, w, round) => { const s = seg(0, 0, a, b), n = Math.max(1, Math.round(s.L / 2.4)), len = s.L / n, yaw = Math.atan2(s.tx, s.tz);
      for (let k = 0; k < n; k++) { const t = (k + 0.5) * len, rad = round && k === 0 ? Math.min(1.3, w * 0.45) : 0.06, g = new RoundedBoxGeometry(w - 0.1, 0.2, len - 0.07, 1, rad);
        g.rotateX((RS() - 0.5) * 0.012); g.rotateZ((RS() - 0.5) * 0.012); g.rotateY(yaw); g.translate(a[0] + s.tx * t, 0.05 + (RS() - 0.5) * 0.02, a[1] + s.tz * t); seedGeometry(THREE, g, 2000 + slabs.length); slabs.push(g); } };
    for (const w of RC.sidewalks) slabRun(w.a, w.b, w.w, !!w.roundStart);
    for (const p of RC.plazas) { const g = new THREE.CylinderGeometry(p.r, p.r + 0.12, 0.22, 56, 1); g.translate(p.x, 0.04, p.z); seedGeometry(THREE, g, 2600); slabs.push(g);
      if (p.link) slabRun(p.link.a, p.link.b, p.link.w, false); }
    for (const kb of RC.kerbs) { const s = seg(0, 0, kb.a, kb.b), n = Math.max(1, Math.round(s.L / 1.4)), len = s.L / n, yaw = Math.atan2(s.tx, s.tz);
      for (let k = 0; k < n; k++) { const t = (k + 0.5) * len, g = new RoundedBoxGeometry(0.34, 0.3, len - 0.05, 1, 0.08); g.rotateY(yaw + (RS() - 0.5) * 0.03); g.rotateZ((RS() - 0.5) * 0.02);
        g.translate(kb.a[0] + s.tx * t, 0.06 + (RS() - 0.5) * 0.02, kb.a[1] + s.tz * t); seedGeometry(THREE, g, 3000 + stones.length); stones.push(g); } }
    addMesh(bakeKeep(slabs.map(g => { g.deleteAttribute('uv'); return g; })), M.walk, { name: 'gehwege' }); addMesh(bakeKeep(stones.map(g => { g.deleteAttribute('uv'); return g; })), M.curb, { name: 'bordsteine' }); info.slabs = slabs.length; info.kerbStones = stones.length; }
  // Stadtmarkierung nach M2 (alles hell: keine Gegenrichtungs-Trennung in dieser Kachel)
  { const q = [], quad = (cx, cz, along, across, yaw) => { const g = new THREE.PlaneGeometry(across, along); g.rotateX(-Math.PI / 2); g.rotateY(yaw); g.translate(cx, 0.028, cz); q.push(g); };
    for (const mk of RC.cityMarkings.items) {
      if (mk.kind === 'zebra') { const yaw = Math.atan2(mk.along[0], mk.along[1]), n = Math.floor(mk.across / (mk.stripe + mk.gap)); for (let k = 0; k < n; k++) { const off = -mk.across / 2 + (k + 0.5) * (mk.stripe + mk.gap) + mk.gap / 2;
        quad(mk.at[0] + Math.cos(yaw) * off, mk.at[1] - Math.sin(yaw) * off, mk.len, mk.stripe, yaw); } continue; }
      const s = seg(0, 0, mk.a, mk.b), yaw = Math.atan2(s.tx, s.tz), ax = (t, L) => [mk.a[0] + s.tx * t, mk.a[1] + s.tz * t];
      const inSkip = (t, list, coord) => (list || []).some(([u0, u1]) => { const c = coord(t); return c >= u0 && c <= u1; });
      const coordZ = t => (Math.abs(s.tz) > 0.5 ? mk.a[1] + s.tz * t : mk.a[0] + s.tx * t);
      if (mk.kind === 'dash') { for (let t = 0; t + mk.on <= s.L; t += mk.on + mk.off) { if (inSkip(t, mk.skip, coordZ) || inSkip(t + mk.on, mk.skip, coordZ)) continue; const c = ax(t + mk.on / 2); quad(c[0], c[1], mk.on, mk.w, yaw); } }
      else if (mk.kind === 'line') { let t = 0; while (t < s.L) { const dashed = inSkip(t + 0.01, mk.dashIn, coordZ); const len = dashed ? 1.5 : Math.min(3, s.L - t); if (!dashed || Math.floor(t / 1.5) % 2 === 0) { const c = ax(t + len / 2); quad(c[0], c[1], len - 0.02, mk.w, yaw); } t += dashed ? 1.5 : len; } }
      else if (mk.kind === 'warte') { for (let t = 0; t + 0.5 <= s.L + 0.01; t += 0.75) { const c = ax(t + 0.25); quad(c[0], c[1], 0.5, mk.w, yaw); } } }
    addMesh(bakeKeep(q.map(g => { g.deleteAttribute('uv'); return g; })), M.markH, { cast: false, name: 'stadtmarkierung' }); }

  // ---------- Knetbach, Pfad, Brücke ----------
  { const pos = [], idx = [], P = CR.pts, samples = []; for (let k = 0; k < P.length - 1; k++) { const s = seg(0, 0, P[k], P[k + 1]); for (let t = 0; t < s.L; t += 1.5) samples.push([P[k][0] + s.tx * t, P[k][1] + s.tz * t, s.tx, s.tz]); }
    samples.forEach(([x, z, tx, tz], k) => { const hw = CR.w * 0.42 * (1 + 0.18 * (vn1(k / 7) - 0.5) * 2); for (let m = 0; m <= 4; m++) { const l = -hw + 2 * hw * m / 4; pos.push(x - tz * l, CR.water, z + tx * l); }
      if (k) { const o = (k - 1) * 5; for (let m = 0; m < 4; m++) idx.push(o + m, o + m + 5, o + m + 1, o + m + 1, o + m + 5, o + m + 6); } });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); faceUp(g);
    seedGeometry(THREE, g, 1601); addMesh(g, M.water, { cast: false, name: 'knetbach' }); }
  for (const pth of RC.paths) {
    const br = pth.bridge, pts = []; for (let k = 0; k < pth.pts.length - 1; k++) { const s = seg(0, 0, pth.pts[k], pth.pts[k + 1]); for (let t = 0; t < s.L; t += 1) pts.push([pth.pts[k][0] + s.tx * t, pth.pts[k][1] + s.tz * t, s.tx, s.tz]); }
    const inBr = (x, z) => br && rectOut(x, z, br.a, br.b, br.w / 2) < 0.8;
    const pos = [], idx = []; let run = 0;
    const flush = () => { if (run > 1) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos.splice(0), 3)); g.setIndex(idx.splice(0)); faceUp(g); seedGeometry(THREE, g, 1700 + run); addMesh(g, M.path, { name: 'pfad', cast: false }); } else { pos.length = 0; idx.length = 0; } run = 0; };
    pts.forEach(([x, z, tx, tz], k) => { if (inBr(x, z)) { flush(); return; } const hw = pth.w / 2 * (1 + 0.12 * (vn1(k / 5 + 3) - 0.5) * 2), wob = 0.25 * (vn1(k / 11) - 0.5) * 2;
      for (let m = 0; m <= 4; m++) { const l = -hw + 2 * hw * m / 4 + wob, px = x - tz * l, pz = z + tx * l; pos.push(px, GH(px, pz) + 0.06 + 0.05 * Math.sin(Math.PI * m / 4), pz); }
      if (run) { const o = (run - 1) * 5; for (let m = 0; m < 4; m++) idx.push(o + m, o + m + 1, o + m + 5, o + m + 1, o + m + 6, o + m + 5); } run++; });
    flush();
    if (br) { const s = seg(0, 0, br.a, br.b), yA = GH(br.a[0], br.a[1]) + 0.1, yB = GH(br.b[0], br.b[1]) + 0.1, rise = 1.3, parts = [];
      const curve = off => new THREE.CatmullRomCurve3([0, 0.25, 0.5, 0.75, 1].map(u => { const x = br.a[0] + s.tx * s.L * u - s.tz * off, z = br.a[1] + s.tz * s.L * u + s.tx * off; return new THREE.Vector3(x, lerp(yA, yB, u) + rise * Math.sin(Math.PI * u), z); }));
      const n = 18; for (let k = 0; k < n; k++) { const u = (k + 0.5) / n, c = curve(0).getPointAt(u), tg2 = curve(0).getTangentAt(u), g = new RoundedBoxGeometry(br.w, 0.32, s.L / n * 0.94 * 1.04, 1, 0.1);
        g.applyMatrix4(new THREE.Matrix4().lookAt(new THREE.Vector3(), tg2, new THREE.Vector3(0, 1, 0))); g.translate(c.x, c.y, c.z); seedGeometry(THREE, g, 1800 + k); parts.push(g); }
      for (const off of [-br.w / 2 + 0.15, br.w / 2 - 0.15]) { const cv = curve(off), rail = new THREE.CatmullRomCurve3(cv.getPoints(12).map(p => p.clone().add(new THREE.Vector3(0, 1.05, 0))));
        parts.push(new THREE.TubeGeometry(rail, 24, 0.11, 8, false)); for (let k = 0; k <= 4; k++) { const p = cv.getPointAt(k / 4), g = new THREE.CapsuleGeometry(0.13, 0.95, 4, 8); g.translate(p.x, p.y + 0.55, p.z); parts.push(g); } }
      parts.forEach((g, k) => seedGeometry(THREE, g, 1850 + k));
      addMesh(bakeKeep(parts.map(g => { if (g.attributes.uv) g.deleteAttribute('uv'); return g.index ? g.toNonIndexed() : g; })), M.bridge, { name: 'bruecke' }); } }

  // ---------- Häuser: gebogen (transition-atlas bend), eingesenkt, Knetwulst statt Platte ----------
  onNote('Häuser werden gebogen und eingesetzt …');
  const bend = (base, sc, ysc, bnd, dir, twist) => { const g = base.g.clone(); g.scale(sc, sc * ysc, sc); const p = g.attributes.position, n = g.attributes.normal, Hh = base.size.y * sc * ysc;
    for (let i = 0; i < p.count; i++) { const t = clamp(p.getY(i) / Hh, 0, 1), b = bnd * Hh * t * t, a = twist * t, c = Math.cos(a), s = Math.sin(a), x = p.getX(i), z = p.getZ(i);
      p.setXYZ(i, x * c - z * s + b * dir[0], p.getY(i), x * s + z * c + b * dir[1]); if (n) { const nx2 = n.getX(i), nz2 = n.getZ(i); n.setXYZ(i, nx2 * c - nz2 * s, n.getY(i), nx2 * s + nz2 * c); } }
    return g; };
  const place = (g, pos, fwd, yaw = 0) => { const Zv = new THREE.Vector3(fwd[0], 0, fwd[2]).normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw), Y = new THREE.Vector3(0, 1, 0), X = new THREE.Vector3().crossVectors(Y, Zv);
    g.applyMatrix4(new THREE.Matrix4().makeBasis(X, Y, Zv).setPosition(pos[0], pos[1], pos[2])); return g; };
  const famMat = {}, mkSrc = (d, cls) => { const key = (d.mat ? d.mat.uuid : d.id) + '|' + cls; if (famMat[key]) return famMat[key];
    const m = makeClayMaterial(THREE, U, { src: d.mat, profile: { ...prof(cls === 'trunk' || cls === 'nature' ? 'nature' : 'house', 0.6, cls === 'house' ? QUIET : { print: 0.3, dent: 0 }), tools: TOOLMIX[cls], legacy: 0 } });
    m.userData.kfbClayClass = cls; return (famMat[key] = m); };
  const dBins = new Map(); const dPut = (mat, g, seed) => { seedGeometry(THREE, g, seed); if (!dBins.has(mat)) dBins.set(mat, []); dBins.get(mat).push(g); };
  const skirts = { walk: [], grass: [] };
  for (const b of FP) { const d = DON[b.donor], rh = b.rhythm, dirA = rh.dir * Math.PI / 180;
    const g = bend(d, d.scale, rh.ysc, rh.bend, [Math.cos(dirA), Math.sin(dirA)], rh.twist); place(g, [b.x, b.padY - b.sink, b.z], [b.fx, 0, b.fz]);
    dPut(mkSrc(d, 'house'), g, 4000 + info.buildings); info.buildings++;
    // Knetwulst: gedrückte Knetnaht um den Grundriss, in Bodenfarbe (liest als hochgedrückter Boden, nicht als Sockel)
    const pos = [], idx = [], hu = b.hu + 0.12, hv = b.hv + 0.12, cr = 0.9, per = [];
    const corner = (cx, cz, a0) => { for (let k = 0; k <= 5; k++) { const a = a0 + k / 5 * Math.PI / 2; per.push([cx + Math.cos(a) * cr, cz + Math.sin(a) * cr, Math.cos(a), Math.sin(a)]); } };
    const edge = (x0, z0, x1, z1, nxv, nzv) => { const L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.round(L / 0.5)); for (let k = 1; k < n; k++) per.push([lerp(x0, x1, k / n), lerp(z0, z1, k / n), nxv, nzv]); };
    corner(hu - cr, hv - cr, 0); edge(hu - cr, hv, -hu + cr, hv, 0, 1); corner(-hu + cr, hv - cr, Math.PI / 2); edge(-hu, hv - cr, -hu, -hv + cr, -1, 0);
    corner(-hu + cr, -hv + cr, Math.PI); edge(-hu + cr, -hv, hu - cr, -hv, 0, -1); corner(hu - cr, -hv + cr, Math.PI * 1.5); edge(hu, -hv + cr, hu, hv - cr, 1, 0);
    const NP = per.length, NS = 7;
    per.forEach(([u, v, nu, nv], k) => { const wob = 1 + 0.35 * (vn1(k / 6 + b.x) - 0.5) * 2, wd = 0.95 * wob, ht = 0.42 * (1 + 0.3 * (vn1(k / 4 + b.z) - 0.5) * 2);
      for (let m = 0; m < NS; m++) { const a = Math.PI * m / (NS - 1), out = -0.25 + wd * (1 - Math.cos(a)) / 2, up = ht * Math.sin(a);
        const lu = u + nu * out, lv = v + nv * out, x = b.x + lu * b.fz + lv * b.fx, z = b.z - lu * b.fx + lv * b.fz; pos.push(x, Math.max(b.padY, GH(x, z)) - 0.12 + up, z); } });
    for (let k = 0; k < NP; k++) { const k2 = (k + 1) % NP; for (let m = 0; m < NS - 1; m++) { const A = k * NS + m, Bq = k2 * NS + m; idx.push(A, Bq, A + 1, A + 1, Bq, Bq + 1); } }
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); sg.setIndex(idx); sg.computeVertexNormals();
    if (b.skirt !== 'walk') { const col = []; for (let k = 0; k < pos.length; k += 3) col.push(...colAt(pos[k], pos[k + 2]).map(c => c * 0.97)); sg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); }
    { const n = sg.attributes.normal.array; let up = 0; for (let k = 1; k < n.length; k += 3) up += n[k]; if (up < 0) { const ix = sg.index.array; for (let k = 0; k < ix.length; k += 3) { const t = ix[k + 1]; ix[k + 1] = ix[k + 2]; ix[k + 2] = t; } sg.computeVertexNormals(); } }
    seedGeometry(THREE, sg, 4500 + info.buildings); (b.skirt === 'walk' ? skirts.walk : skirts.grass).push(sg); }
  if (skirts.walk.length) addMesh(bakeKeep(skirts.walk), M.skirtWalk, { name: 'knetwulst-stadt' }); if (skirts.grass.length) addMesh(bakeKeep(skirts.grass), M.skirtGrass, { name: 'knetwulst-hang' });

  // Requisiten (unverbogen wie in T4), Zaun, Briefkasten
  const propY = (x, z) => (onWalk(x, z) ? 0.15 : GH(x, z) - 0.05);
  for (const p of RC.props) { const d = DON[p.donor]; if (!d) continue; const g = d.g.clone(); g.scale(d.scale, d.scale, d.scale);
    place(g, [p.x, p.socket ? 0.0 : propY(p.x, p.z), p.z], [p.face[0], 0, p.face[1]]); const cls = p.donor === 'tt-tree' || p.donor === 'tt-bush' ? 'nature' : (d.kind === 'vehicle' ? 'vehicle' : 'trunk');
    dPut(mkSrc(d, d.pack.startsWith('KayKit') && cls !== 'vehicle' ? 'rock' : cls), g, 5000 + info.props); info.props++; }
  for (const f of RC.fences || []) { const d = DON[f.donor], dp = DON[f.post]; if (!d) continue; const FS = d.scale, seglen = d.size.x * FS - 0.05;
    for (const line of [f.pts, f.pts2].filter(Boolean)) for (let k = 0; k < line.length - 1; k++) { const s = seg(0, 0, line[k], line[k + 1]), n = Math.max(1, Math.round(s.L / seglen)), len = s.L / n;
      for (let m = 0; m < n; m++) { const t = (m + 0.5) * len, x = line[k][0] + s.tx * t, z = line[k][1] + s.tz * t, g = d.g.clone(); g.scale(len / d.size.x, FS * (0.96 + 0.08 * h1(m + k * 7)), FS);
        place(g, [x, GH(x, z) - 0.12, z], [-s.tz, 0, s.tx], (h1(m * 3 + k) - 0.5) * 0.05); dPut(mkSrc(d, 'trunk'), g, 5500 + info.fence); info.fence++;
        if (dp) { const pg = dp.g.clone(); pg.scale(FS, FS, FS); const px = line[k][0] + s.tx * m * len, pz = line[k][1] + s.tz * m * len; place(pg, [px, GH(px, pz) - 0.12, pz], [-s.tz, 0, s.tx]); dPut(mkSrc(dp, 'trunk'), pg, 5600 + info.fence); } }
      if (dp) { const pg = dp.g.clone(); pg.scale(FS, FS, FS); const e = line[k + 1]; place(pg, [e[0], GH(e[0], e[1]) - 0.12, e[1]], [-s.tz, 0, s.tx]); dPut(mkSrc(dp, 'trunk'), pg, 5700 + info.fence); } } }
  for (const [mat, list] of dBins) { const cls = mat.userData?.kfbClayClass || 'prop';
    addMesh(bakeKeep(list.map(g => (g.index ? g.toNonIndexed() : g))), mat, { name: 'spender:' + cls, recv: cls !== 'nature' }); }

  // ---------- Dreiergruppen, Felsen, Wolken (T4-Grammatik, Detail je Masse reduziert) ----------
  const blob = (r, detail = 3, lumpK = 0.12, seed = 1) => { let g = new THREE.IcosahedronGeometry(r, detail); g.deleteAttribute('normal'); g.deleteAttribute('uv'); g = mergeVertices(g); const p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = v.clone().normalize(); const f = 1 + lumpK * (Math.sin(n.x * 3.1 + seed) * Math.sin(n.y * 2.7 + seed * 1.7) * Math.sin(n.z * 3.3 + seed * 0.3)); v.copy(n.multiplyScalar(r * f)); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals(); return g; };
  const tree = (x, z, sc, seed, y0) => { const h = (11 + R() * 9) * sc, bnd = (R() - 0.5) * 0.5 * h, bnd2 = (R() - 0.5) * 0.35 * h, ang = R() * Math.PI * 2, c = Math.cos(ang), s = Math.sin(ang);
    const pts = [[0, 0], [bnd * 0.15, h * 0.3], [bnd, h * 0.62], [bnd + bnd2, h]].map(([u, y]) => new THREE.Vector3(x + u * c, y0 - 0.3 + y, z + u * s));
    const cv = new THREE.CatmullRomCurve3(pts), rT = (0.75 + R() * 0.4) * sc; const g = new THREE.TubeGeometry(cv, 20, rT, 10, false); g.deleteAttribute('uv'); put('trunk', g, seed);
    const foot = blob(rT * 1.9, 2, 0.08, seed); foot.scale(1, 0.45, 1); foot.translate(x, y0 - 0.1, z); put('trunk', foot, seed + 1);
    const tp = pts[3], cr = (4.2 + R() * 2.6) * sc, key = pick(['leaf0', 'leaf0', 'leaf1', 'leaf2']);
    const main = blob(cr, 4, 0.1, seed); main.scale(1, 0.9, 1); main.translate(tp.x, tp.y + cr * 0.55, tp.z); put(key, main, seed + 2);
    const nb = 2 + Math.floor(R() * 3); for (let k = 0; k < nb; k++) { const a = R() * Math.PI * 2, rr = cr * (0.45 + R() * 0.25), g2 = blob(rr, 3, 0.1, seed + k);
      g2.translate(tp.x + Math.cos(a) * cr * 0.75, tp.y + cr * (0.3 + R() * 0.7), tp.z + Math.sin(a) * cr * 0.75); put(R() < 0.25 ? pick(['leaf0', 'leaf1', 'leaf2']) : key, g2, seed + 3 + k); } };
  const bush = (x, z, sc, seed) => { const key = pick(['leaf0', 'leaf1', 'leaf2']), n = 2 + Math.floor(R() * 2);
    for (let k = 0; k < n; k++) { const r = (2.0 + R() * 1.4) * sc, bx = x + (R() - 0.5) * r * 1.6, bz = z + (R() - 0.5) * r * 1.6, g = blob(r, 3, 0.12, seed + k); g.scale(1, 0.78, 1); g.translate(bx, GH(bx, bz) + r * 0.3, bz); put(key, g, seed + k); } };
  const rock = (x, z, sc, seed) => { const r = (2.2 + R() * 2.0) * sc, g = blob(r, 3, 0.25, seed); g.scale(1, 0.62, 1.1); g.rotateY(R() * 3); g.translate(x, GH(x, z) + r * 0.12, z); put('rock', g, seed); };
  RC.clusters.items.forEach((c, n) => { const ang = h1(n * 7 + 1) * Math.PI * 2, sc = c.sc; tree(c.x, c.z, sc, 6000 + n * 20, GH(c.x, c.z));
    for (let k = 0; k < 2; k++) { const bx = c.x + Math.cos(ang + k * 1.4) * (6 + R() * 3) * sc, bz = c.z + Math.sin(ang + k * 1.4) * (6 + R() * 3) * sc; bush(bx, bz, sc, 6000 + n * 20 + 8 + k * 3); }
    rock(c.x + Math.cos(ang - 1.6) * 8 * sc, c.z + Math.sin(ang - 1.6) * 8 * sc, sc * 0.9, 6000 + n * 20 + 16); info.clusters++; });
  RC.clusters.rocks.forEach((r, n) => rock(r.x, r.z, r.sc, 6800 + n));
  { const RCl = rng(RC.seed + 21), C = RC.sky.clouds; for (let n = 0; n < C.count; n++) { const x = TILE.x0 - 60 + RCl() * (TILE.x1 - TILE.x0 + 120), z = TILE.z0 - 60 + RCl() * (TILE.z1 - TILE.z0 + 120), y = C.yMin + RCl() * (C.yMax - C.yMin), sc = 7 + RCl() * 7, k = 4 + Math.floor(RCl() * 3);
    for (let j = 0; j < k; j++) { const r = sc * (0.6 + RCl() * 0.55) * (j === 0 ? 1.3 : 1), g = blob(r, 3, 0.07, n * 10 + j); g.scale(1, 0.82, 1); g.translate(x + (j - k / 2) * sc * 0.95, y + (RCl() - 0.2) * sc * 0.4, z + (RCl() - 0.5) * sc * 0.8); put('cloud', g, 3000 + n * 10 + j); } } }
  for (const [key, list] of Object.entries(bins)) {
    const foliage = key.startsWith('leaf');
    addMesh(bakeKeep(list.map(g => { if (g.attributes.uv) g.deleteAttribute('uv'); return g.index ? g.toNonIndexed() : g; })), M[key], { name: key, cast: key !== 'cloud' && !key.startsWith('bg'), recv: key !== 'cloud' && !foliage });
  }

  // ---------- Karts (T4 mkKart), Maßfigur ----------
  const mkKart = ci => { const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
    const add = (geo, mat, x, y, z, par = body) => { seedGeometry(THREE, geo, 4000 + ci * 30 + par.children.length); const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; par.add(m); return m; };
    add(new RoundedBoxGeometry(2.3, 0.75, 3.7, 4, 0.34), M['kart' + ci], 0, 0.78, 0); add(new RoundedBoxGeometry(1.7, 0.5, 1.3, 4, 0.24), M['kart' + ci], 0, 1.05, 1.55); add(new RoundedBoxGeometry(1.4, 1.0, 0.4, 4, 0.18), M['kart' + ci], 0, 1.55, -1.05);
    const head = add(new THREE.SphereGeometry(0.72, 28, 20), M.skin, 0, 2.2, -0.35);
    for (const sx of [-0.27, 0.27]) { add(new THREE.SphereGeometry(0.26, 18, 14), M.eye, sx, 2.38, 0.22); add(new THREE.SphereGeometry(0.12, 12, 10), M.pupil, sx * 1.05, 2.4, 0.46); }
    add(new THREE.SphereGeometry(0.2, 14, 10), M.skin, 0, 2.12, 0.38);
    const wheels = []; for (const [x, z] of [[-1.25, 1.25], [1.25, 1.25], [-1.25, -1.2], [1.25, -1.2]]) wheels.push(add(new THREE.CylinderGeometry(0.62, 0.62, 0.62, 22).rotateZ(Math.PI / 2), M.tyre, x, 0.62, z, g));
    root.add(g); return { g, body, wheels, head }; };
  const demo = { k: mkKart(0), s: sA + 10, v: 24, lat: 2.8, prev: sA }, sockB = RC.sockets.find(s => s.id === 'car-B');
  const parked = mkKart(1); parked.g.position.set(sockB.x, 0, sockB.z); parked.g.rotation.y = sockB.yaw * Math.PI / 180;
  const sw = RC.sockets.find(s => s.id === 'spawn-walk');
  { const f = new THREE.Group(), add = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; f.add(m); return m; };
    add(new THREE.CapsuleGeometry(0.34, 0.85, 8, 16), M.kart1, 0, 0.78, 0); add(new THREE.SphereGeometry(0.3, 24, 16), M.skin, 0, 1.55, 0);
    for (const sx of [-0.11, 0.11]) { add(new THREE.SphereGeometry(0.085, 12, 10), M.eye, sx, 1.62, 0.24); add(new THREE.SphereGeometry(0.04, 10, 8), M.pupil, sx, 1.63, 0.31); }
    f.scale.setScalar(1.85 / 1.86); f.position.set(sw.x, 0.15, sw.z); f.rotation.y = sw.yaw * Math.PI / 180; f.name = 'massfigur-1.85m'; root.add(f); }
  const placeKart = (st, t) => { const a = at(st.s), m = new THREE.Matrix4().makeBasis(a.R.clone().negate(), a.U, a.T), p = a.p.clone().addScaledVector(a.R, st.lat); m.setPosition(p);
    const g = st.k.g; g.matrixAutoUpdate = false; g.matrix.copy(m); g.matrixWorldNeedsUpdate = true;
    st.k.body.scale.set(1 - 0.03 * Math.sin(t * 9), 1 + 0.05 * Math.sin(t * 9), 1); st.k.head.position.y = 2.2 + 0.08 * Math.sin(t * 7); st.k.wheels.forEach(w => { w.rotation.x = st.s / 0.62; }); return a; };

  // ---------- Clay-VFX (Hinweise: Krümel beim Rollen, Landung, Skin-Wechsel) ----------
  const VFX = makeClayVFX(root, PP, { camera, accent: () => PAL.kart[0] }); const up = new THREE.Vector3(0, 1, 0), vPos = new THREE.Vector3(), vDir = new THREE.Vector3();
  const landS = S[td.joints.find(j => j.piece === 'landing').index].s + 2, skinS = rb1 - 4; let rollAcc = 0;
  const vfxTick = (dt, a) => { const q = S[a.i], s = demo.s, bio = q.skin === 'street' ? 'city' : 'canyon';
    if (surf(a.i)) { rollAcc += dt * 9; while (rollAcc >= 1) { rollAcc -= 1; vPos.copy(a.p).addScaledVector(a.R, demo.lat + (R() > 0.5 ? 1.2 : -1.2)).addScaledVector(a.T, -1.4).addScaledVector(a.U, 0.25);
      vDir.copy(a.T).multiplyScalar(-1).addScaledVector(a.U, 0.6); VFX.emit('roll', bio, { pos: vPos.clone(), dir: vDir.clone(), groundY: a.p.y, count: 1 }); } }
    if (demo.prev < landS && s >= landS) VFX.emit('landing', 'canyon', { pos: a.p.clone().addScaledVector(a.R, demo.lat).addScaledVector(a.U, 0.2), dir: up, groundY: a.p.y, energy: 0.9, mix: { biome: 'meadow', w: 0.35 } });
    if (demo.prev < skinS && s >= skinS) VFX.emit('biome', 'canyon', { pos: a.p.clone().addScaledVector(a.R, demo.lat).addScaledVector(a.U, 0.3), dir: a.T.clone().multiplyScalar(-1).add(up), groundY: a.p.y, energy: 0.7, mix: { biome: 'city', w: 0.5 } });
    demo.prev = s; };

  // ---------- Traversal-Masken (Overlay, aus dem Rezept) ----------
  const maskG = new THREE.Group(); maskG.name = 'masken'; maskG.visible = false; scene.add(maskG);
  { const mat = c => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.42, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, side: THREE.DoubleSide });
    const mW = mat('#ffd23c'), mD = mat('#3aa0ff'), mO = mat('#7fd0ff'), mS = mat('#ff4fa3');
    const strip = (a, b, w, m, y = null) => { const s = seg(0, 0, a, b), n = Math.max(1, Math.ceil(s.L / 2)), pos = [], idx = [];
      for (let k = 0; k <= n; k++) { const t = s.L * k / n, x = a[0] + s.tx * t, z = a[1] + s.tz * t; for (const l of [-w / 2, w / 2]) { const px = x - s.tz * l, pz = z + s.tx * l; pos.push(px, (y ?? GH(px, pz)) + 0.3, pz); } if (k) { const o = (k - 1) * 2; idx.push(o, o + 1, o + 2, o + 1, o + 3, o + 2); } }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); maskG.add(new THREE.Mesh(g, m)); };
    for (const w of RC.sidewalks) strip(w.a, w.b, w.w, mW, 0.15);
    for (const p of RC.paths) for (let k = 0; k < p.pts.length - 1; k++) strip(p.pts[k], p.pts[k + 1], p.w, mW);
    for (const p of RC.plazas) { const g = new THREE.CircleGeometry(p.r, 40); g.rotateX(-Math.PI / 2); g.translate(p.x, 0.45, p.z); maskG.add(new THREE.Mesh(g, mW)); if (p.link) strip(p.link.a, p.link.b, p.link.w, mW, 0.15); }
    { const z = RC.cityMarkings.items.find(m => m.kind === 'zebra'); strip([z.at[0], z.at[1] - z.len / 2], [z.at[0], z.at[1] + z.len / 2], z.across, mW, 0.05); }
    for (const r of RC.roads) strip(r.a, r.b, r.w, mD, 0.02);
    { const pos = [], idx = []; let n = 0; for (let i = iA; i <= iB; i += 2) { const q = S[i]; for (const sd of [6, 7]) pos.push(...W3(q, q.slots[sd][0], 0.35)); if (n) { const o = (n - 1) * 2; idx.push(o, o + 1, o + 2, o + 1, o + 3, o + 2); } n++; }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); maskG.add(new THREE.Mesh(g, mD)); }
    for (const o of RC.masks.drive.offroad) { const shp = new THREE.Shape(o.poly.map(([x, z]) => new THREE.Vector2(x, z))), g = new THREE.ShapeGeometry(shp, 6); const p = g.attributes.position;
      for (let k = 0; k < p.count; k++) { const x = p.getX(k), z = p.getY(k); p.setXYZ(k, x, GH(x, z) + 0.4, z); } g.computeVertexNormals(); maskG.add(new THREE.Mesh(g, mO)); }
    for (const nb of RC.masks.noBuild) { const b = nb.box, g = new THREE.BoxGeometry(b.x1 - b.x0, b.y1 - b.y0, b.z1 - b.z0); g.translate((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, (b.z0 + b.z1) / 2); maskG.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), new THREE.LineBasicMaterial({ color: '#ff4fa3' }))); }
    { const F = RC.masks.flight, b = F.box, g = new THREE.BoxGeometry(b.x1 - b.x0, F.band[1] - F.band[0], b.z1 - b.z0); g.translate((b.x0 + b.x1) / 2, (F.band[0] + F.band[1]) / 2, (b.z0 + b.z1) / 2); maskG.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), new THREE.LineBasicMaterial({ color: '#b98cff' }))); }
    for (const s of RC.sockets) { if (s.x == null) continue; const r = s.kind === 'vehicle' ? 3.2 : 1.6, g = new THREE.RingGeometry(r - 0.25, r, 40); g.rotateX(-Math.PI / 2); g.translate(s.x, (s.y ?? (s.kind === 'vehicle' ? 0 : propY(s.x, s.z))) + 0.5, s.z); maskG.add(new THREE.Mesh(g, mS)); } }

  // ---------- Spenderbank: jeder Spender einzeln, links Quelle, rechts Knete (+ Biegung bei Häusern) ----------
  const bench = new THREE.Group(); bench.name = 'spenderbank'; scene.add(bench); const benchShots = [];
  { const BZ = 215, parts = []; let x = -60;
    for (const d0 of RC.donors) { const d = DON[d0.id]; if (!d) continue; const sz = d.size.clone().multiplyScalar(d.scale), gap = Math.max(4, sz.x * 0.6), span = sz.x * 2 + gap + 8;
      const cx = x + span / 2, xs = cx + (sz.x + gap) / 2, xc = cx - (sz.x + gap) / 2;   // Kamera blickt nach +Z: größeres x = links im Bild
      const o = d.scene.clone(true); o.scale.setScalar(d.scale); o.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(o), c = bb.getCenter(new THREE.Vector3());
      o.position.set(xs - c.x, 0.3 - bb.min.y, BZ - c.z); o.traverse(m => { if (m.isMesh) m.castShadow = m.receiveShadow = true; }); bench.add(o);
      const rh = RC.buildings.find(b => b.donor === d0.id)?.rhythm, g = d.kind === 'building' && rh ? bend(d, d.scale, rh.ysc, rh.bend, [Math.cos(rh.dir * Math.PI / 180), Math.sin(rh.dir * Math.PI / 180)], rh.twist) : (() => { const g2 = d.g.clone(); g2.scale(d.scale, d.scale, d.scale); return g2; })();
      place(g, [xc, 0.3, BZ], [0, 0, 1]); const cls = d.kind === 'building' ? 'house' : (d0.id === 'tt-tree' || d0.id === 'tt-bush' ? 'nature' : (d.kind === 'vehicle' ? 'vehicle' : (d.pack.startsWith('KayKit') ? 'rock' : 'trunk')));
      seedGeometry(THREE, g, 7000 + benchShots.length); addMesh(g, mkSrc(d, cls), { name: 'bank-' + d0.id, par: bench });
      const pl = new RoundedBoxGeometry(span - 2, 0.6, Math.max(sz.z, 3) + 6, 2, 0.25); pl.translate(cx, 0, BZ); pl.deleteAttribute('uv'); seedGeometry(THREE, pl, 7100 + benchShots.length); parts.push(pl);
      const hmax = Math.max(sz.y * (rh ? rh.ysc : 1), 1.5), dist = Math.max(8, Math.max(span * 0.95, hmax * 2.1));
      benchShots.push({ id: d0.id, label: d0.id + ' · ' + d0.path.split('/').pop(), pack: d0.pack, path: d0.path, scale: d.scale, kind: d.kind, tris: Math.round(d.tris), meshes: d.meshes, size: [+sz.x.toFixed(2), +sz.y.toFixed(2), +sz.z.toFixed(2)],
        pos: new THREE.Vector3(cx, hmax * 0.55 + 1.2, BZ - dist), tgt: new THREE.Vector3(cx, hmax * 0.42, BZ) }); x += span; }
    if (parts.length) addMesh(bakeKeep(parts), M.walk, { name: 'bank-platten', par: bench }); }

  // ---------- Kameras ----------
  const CAM = RC.cameras, shots = {};
  for (const [k, c] of Object.entries(CAM)) shots[k] = { pos: V(c.pos), tgt: V(c.tgt), fov: c.fov || 40 };
  shots.drive.pos.y = at(1494).p.y + 2.4;
  benchShots.forEach(b => { shots['donor:' + b.id] = { pos: b.pos, tgt: b.tgt, fov: 38 }; });
  info.buildMs = Math.round(performance.now() - t0);

  // ---------- Nachbearbeitung, Himmel, Takt ----------
  const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
  let aoPass = null;
  try { const { GTAOPass } = await import('three/addons/postprocessing/GTAOPass.js'); aoPass = new GTAOPass(scene, camera, 2, 2);
    aoPass.updateGtaoMaterial({ radius: 1.2, distanceExponent: 1.4, thickness: 1.6, scale: 1.0, samples: 16 }); aoPass.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
    aoPass.blendIntensity = 0.75; composer.addPass(aoPass); } catch (e) { info.errors.push('AO: ' + e.message); }
  composer.addPass(new OutputPass());
  const resize = () => { const w = canvas.clientWidth || 800, h = canvas.clientHeight || 450; renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();
  const setSky = key => { const P = SKY_PRESETS[key] || SKY_PRESETS['tiny-tag']; info.sky = key; SKY.paint(P); scene.fog = new THREE.Fog(P.fog, P.fogNear, P.fogFar); scene.background = new THREE.Color(P.fog);
    sun.color.set(P.sun[0]); sun.intensity = P.sun[1]; hemi.color.set(P.hemi[0]); hemi.groundColor.set(P.hemi[1]); hemi.intensity = P.hemi[2]; back.color.set(P.back[0]); back.intensity = P.back[1]; renderer.toneMappingExposure = P.expo; };
  setSky(RC.sky.default);

  const st = { cam: 'overview', run: true, chase: false, tools: true, paused: false };
  const shot = id => { info.cam = id; if (id === 'chase') { st.chase = true; controls.enabled = false; return; } st.chase = false; controls.enabled = true;
    const v = shots[id] || shots.overview; camera.fov = v.fov; camera.near = id === 'overview' || id === 'flight' ? 0.5 : 0.12; camera.updateProjectionMatrix();
    camera.position.copy(v.pos); controls.target.copy(v.tgt); controls.update(); bench.visible = id.startsWith('donor:'); };
  shot('overview');

  let raf = 0, last = performance.now(), frames = 0, fpsT = last, tAll = 0; const cP = new THREE.Vector3(), cT = new THREE.Vector3(); let cInit = false;
  const step = fixed => { const now = performance.now(), dt = fixed ?? Math.min(0.05, (now - last) / 1000); last = now; tAll += dt;
    if (st.run) { demo.s += demo.v * dt; if (demo.s > sB - 2) { demo.s = sA + 10; demo.prev = demo.s; } }
    const a = placeKart(demo, tAll); if (st.run) vfxTick(dt, a);
    if (st.chase) { const a1 = at(demo.s - 11), b1 = at(demo.s + 12), p = a1.p.clone().addScaledVector(a1.U, 4.4).addScaledVector(a1.R, demo.lat * 0.6), t = b1.p.clone().addScaledVector(b1.U, 1).addScaledVector(b1.R, demo.lat * 0.4);
      if (!cInit) { cP.copy(p); cT.copy(t); cInit = true; } cP.lerp(p, 0.2); cT.lerp(t, 0.2); camera.up.set(0, 1, 0); camera.position.copy(cP); camera.lookAt(cT); } else { cInit = false; controls.update(); }
    SKY.mesh.position.copy(camera.position); VFX.update(dt);
    const shFocus = st.chase ? cT.clone().addScaledVector(a.U, 70) : controls.target;
    shadowFollow(shFocus, st.chase ? 150 : null);
    renderer.info.reset(); composer.render(); info.calls = renderer.info.render.calls; info.frameTris = renderer.info.render.triangles; frames++; if (now - fpsT > 1000) { info.fps = Math.round(frames * 1000 / (now - fpsT)); frames = 0; fpsT = now; } };
  const GD = { level: 0, avg: 16, skip: 0, n: 0 }; info.guard = GD;
  const guard = ms => { GD.avg = GD.avg * 0.85 + ms * 0.15; GD.n++; if (GD.n > 12 && GD.avg > 70 && GD.level < 3) { GD.level++; GD.n = 0;
    if (GD.level === 1) renderer.setPixelRatio(1); if (GD.level === 2 && aoPass) aoPass.enabled = false; if (GD.level === 3) { sun.shadow.map?.dispose(); sun.shadow.map = null; sun.shadow.mapSize.set(2048, 2048); } resize(); } };
  const loop = () => { raf = requestAnimationFrame(loop); if (st.paused) return; if (GD.skip > 0) { GD.skip--; return; } const t1 = performance.now(); step(); const c = performance.now() - t1; guard(c); if (c > 100) GD.skip = Math.min(10, Math.floor(c / 50)); };
  info.loadMs = Math.round(performance.now() - tBoot);
  raf = requestAnimationFrame(loop);

  return {
    info, recipe: RC, shots, benchShots, scene, renderer, camera, controls, GH,
    SKIES: Object.fromEntries(Object.entries(SKY_PRESETS).map(([k, v]) => [k, v.label])),
    shot, frame(n = 1, dt = 1 / 60) { for (let k = 0; k < n; k++) step(dt); },
    set(k, v) { if (k === 'sky') setSky(v); else if (k === 'masks') maskG.visible = !!v; else if (k === 'vfx') VFX.setQuality(v); else if (k === 'run') st.run = !!v;
      else if (k === 'ao' && aoPass) aoPass.enabled = !!v; else if (k === 'shadows') sun.castShadow = !!v; else if (k === 'pause') st.paused = !!v; else if (k === 'tools') { st.tools = !!v; applyDisp(st.tools); } else if (k === 'grey') canvas.style.filter = v ? 'grayscale(1)' : ''; },
    shadowReport() { const foliage = []; scene.traverse(o => { if (o.isMesh && (/^leaf\d/.test(o.name) || o.name === 'spender:nature')) foliage.push({ name: o.name, cast: o.castShadow, receive: o.receiveShadow }); }); return { ...SHADOW.report, mapType: renderer.shadowMap.type === THREE.PCFSoftShadowMap ? 'PCFSoftShadowMap' : renderer.shadowMap.type, foliage }; },
    meshReport() { const out = []; scene.traverse(o => { if (!o.isMesh) return; const g = o.geometry; out.push({ name: o.name || '(ohne Name)', tris: Math.round((g.index ? g.index.count : g.attributes.position.count) / 3), cast: !!o.castShadow, receive: !!o.receiveShadow }); }); return out.sort((a, b) => b.tris - a.tris); },
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); controls.dispose(); renderer.dispose(); }
  };
}
