/* KFB clay-tools v1 (K2, 28.09.) — Bühne K2 · Knet-Werkzeuge. Material clay-material.v9 + Werkzeugkarten clay-relief.v3.
 * Drei Teile auf einem O-Town-Tisch (Weltmaß wie T3: Handmaß 1,5 m, k = 3):
 *   · Vergleich: derselbe schiefe Turm zweimal, links v8 (T3 heute), rechts v9 (Kanten repariert, Werkzeuge in Zonen).
 *   · Werkzeugtafel: 6 Werkzeuge × Größe S/M/L, je Platte nur ein Werkzeug, volle Abdeckung.
 *   · Prüfansichten: Kachelzellen, Facetten, Werkzeugzonen (nur v9).
 * v8 und die T3-Bühne bleiben unverändert. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { makeClayRelief } from './clay-relief.v2.js';
import { makeToolReliefs, TOOLS, TOOL_LABELS } from './clay-relief.v5.js';
import * as C8 from './clay-material.v8.js';
import * as C9 from './clay-material.v10.js?r=2';
import { TOOLMIX } from './clay-toolmix.v1.js?r=2';

const here = f => new URL(f, import.meta.url).href;
const QUIET = { print: 0.3, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 0.9, crease: 0.5 };
const prof = (P, key, scale, k, over = {}) => { const p = { ...P[key], ...over }; p.scale = (scale ?? p.scale) * k; p.gougeSize *= k; p.crackSize *= k; p.dentSize *= k; return p; };
export const SIZES = { S: 0.5, M: 1, L: 2 };
// Mischung je Klasse: k Stärke · s Größe (× Handkachel 4,8 m) · c Abdeckung der Zone
export const MIX_HOUSE = TOOLMIX.house;

export async function boot(canvas, onNote = () => {}) {
  const info = { fps: 0, errors: [], reliefMs: 0, toolMs: 0 };
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#a8d8b9');
  const camera = new THREE.PerspectiveCamera(36, 16 / 9, 0.2, 2000);
  const controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.dampingFactor = 0.08;

  onNote('Knete wird angerührt …'); await new Promise(r => setTimeout(r, 30));
  const tex = d => { const t = new THREE.DataTexture(d, 1024, 1024, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); t.needsUpdate = true; return t; };
  const rel = makeClayRelief({ size: 1024, seed: 31 }); info.reliefMs = rel.ms; const relT = tex(rel.data);
  const tools = await makeToolReliefs({ size: 1024, seed: 41, onStep: t => onNote('Werkzeug: ' + TOOL_LABELS[t] + ' …') }); info.toolMs = tools.ms;
  const U8 = C8.makeClayUniforms(THREE, relT), U9 = C9.makeClayUniforms(THREE, relT);
  [U9.uClayToolA.value, U9.uClayToolB.value, U9.uClayToolC.value] = tools.maps.map(tex);
  U9.uClayToolOn.value = 1; U9.uClayLegacyStroke.value = 0;
  let printT = null; try { printT = await C8.makePrintTexture(THREE, here('../ref/clay-joebinns/Fingerprints01_3K.png'), 2048); } catch (e) { info.errors.push('Fingerabdrücke: ' + e.message); }
  for (const U of [U8, U9]) { U.uClayMottle.value = 0.04; U.uClayPrint.value = printT || relT; U.uClayPrintOn.value = printT ? 1 : 0;
    const K = 3; U.uClayHand.value = 0.5 * K; U.uClayTile.value = 1.6 * K; U.uClayPrintTile.value = 4.5 * K; U.uClayMacro.value = 0.5; U.uClayLodK.value = 0.6; U.uClayStroke.value = 0.7; }

  const sun = new THREE.DirectionalLight('#fff4e6', 2.9); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.2;
  Object.assign(sun.shadow.camera, { left: -120, right: 120, top: 120, bottom: -120, near: 10, far: 500 }); sun.position.set(-90, 150, 110); scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight('#eef4fa', '#9a8a78', 1.05)); const back = new THREE.DirectionalLight('#ffe6d6', 0.6); back.position.set(120, 80, -90); scene.add(back);

  const houseP8 = prof(C8.PROFILES, 'house', 0.6, 3, QUIET), houseP9 = { ...prof(C9.PROFILES, 'house', 0.6, 3, QUIET), tools: MIX_HOUSE };
  const mk8 = (color, p) => C8.makeClayMaterial(THREE, U8, { src: new THREE.MeshStandardMaterial({ color }), profile: p });
  const mk9 = (color, p) => C9.makeClayMaterial(THREE, U9, { src: new THREE.MeshStandardMaterial({ color }), profile: p });
  const mesh = (g, m, seed) => { C9.seedGeometry(THREE, g, seed); const o = new THREE.Mesh(g, m); o.castShadow = o.receiveShadow = true; scene.add(o); return o; };

  // Tisch
  { const g = new RoundedBoxGeometry(260, 10, 220, 6, 4); g.translate(0, -5.6, -10); mesh(g, mk9('#3aa596', { ...prof(C9.PROFILES, 'terrainBg', 3.2, 3, { print: 0, dent: 0, gouge: 0, crack: 0, stroke: 0.9, facet: 0.8, crease: 0.4 }), tools: TOOLMIX.terrain }), 77).receiveShadow = true; }

  // Vergleich: derselbe Turm zweimal
  const tower = (x, mat) => { let y = -0.8, w = 17, dx = 0, r = 0;
    const R = (() => { let s = 9; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
    for (let k = 0; k < 3; k++) { const h = w * (0.66 + R() * 0.2), g = new RoundedBoxGeometry(w, h, w * 0.92, 5, Math.min(w, h) * 0.22);
      g.rotateY(0.4 + R() * 0.5); g.rotateZ((R() - 0.5) * 0.14); g.translate(x + dx, y + h / 2, 0); mesh(g, mat, 60 + k); y += h * 0.94; dx += (R() - 0.5) * 3; w *= 0.78; r++; } };
  const matT8 = mk8('#c9508f', houseP8), matT9 = mk9('#c9508f', houseP9);
  tower(-24, matT8); tower(24, matT9);

  // Werkzeugtafel: Zeilen = Werkzeuge, Spalten = S / M / L
  const plateMats = [];
  TOOLS.forEach((t, row) => Object.entries(SIZES).forEach(([sz, s], col) => {
    const m = mk9('#e9b53b', { ...houseP9, facet: 0.4, print: 0.15, tools: { [t]: { k: 1, s, c: 1 } } }); m.userData.plate = { t, s }; plateMats.push(m);
    const g = new RoundedBoxGeometry(11, 11, 2.4, 5, 1.0); g.translate(-15 + col * 15, 6.5 + (5 - row) * 13, -62); mesh(g, m, 200 + row * 3 + col);
  }));

  // Klassen-Proben: je Klasse ihre Mischung (clay-toolmix.v1)
  { const pn = (key, sc, over = {}) => ({ ...prof(C9.PROFILES, key, sc, 3, { ...QUIET, ...over }), tools: TOOLMIX[over.mix || key] });
    const g1 = new THREE.CapsuleGeometry(1.4, 26, 10, 28); g1.rotateZ(Math.PI / 2); g1.scale(1, 0.85, 1); g1.translate(-34, 1.0, 34); mesh(g1, mk9('#e9b53b', pn('house', 0.6, { mix: 'strang' })), 301);
    const g2 = new THREE.SphereGeometry(1, 64, 40); g2.scale(16, 7, 12); g2.translate(0, -2.2, 38); mesh(g2, mk9('#2f8f83', pn('terrainFg', 1.1, { mix: 'terrain', print: 0 })), 302);
    const tr = new THREE.CatmullRomCurve3([new THREE.Vector3(32, -0.5, 36), new THREE.Vector3(33, 5, 36), new THREE.Vector3(36, 10, 35), new THREE.Vector3(35, 14, 36)]);
    mesh(new THREE.TubeGeometry(tr, 24, 0.9, 12), mk9('#6b4a8a', pn('nature', 0.6, { mix: 'trunk' })), 303);
    const leaf = mk9('#f08a2c', pn('nature', 0.6, { mix: 'nature', dent: 0 }));
    [[35, 19, 36, 5.2], [31, 17.5, 37, 3.2], [39, 18, 35, 3.4], [35.5, 22.5, 35.5, 2.8]].forEach(([x, y, z, r], i) => { const g = new THREE.SphereGeometry(r, 48, 32); g.translate(x, y, z); mesh(g, leaf, 310 + i); }); }
  const shots = {
    klassen: { pos: new THREE.Vector3(0, 18, 88), tgt: new THREE.Vector3(0, 6, 36) },
    strangnah: { pos: new THREE.Vector3(-30, 5, 46), tgt: new THREE.Vector3(-34, 1, 34) },
    baumnah: { pos: new THREE.Vector3(30, 18, 56), tgt: new THREE.Vector3(35, 16, 36) },
    vergleich: { pos: new THREE.Vector3(-8, 20, 92), tgt: new THREE.Vector3(6, 14, 0) },
    v8nah: { pos: new THREE.Vector3(-24 + 5, 16, 26), tgt: new THREE.Vector3(-24, 15, 0) },
    v9nah: { pos: new THREE.Vector3(24 + 5, 16, 26), tgt: new THREE.Vector3(24, 15, 0) },
    tafel: { pos: new THREE.Vector3(0, 40, 60), tgt: new THREE.Vector3(0, 40, -62) },
    tafelnah: { pos: new THREE.Vector3(0, 70, -20), tgt: new THREE.Vector3(0, 70, -62) }
  };
  const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
  let ao = null; try { const { GTAOPass } = await import('three/addons/postprocessing/GTAOPass.js'); ao = new GTAOPass(scene, camera, 2, 2);
    ao.updateGtaoMaterial({ radius: 1.2, distanceExponent: 1.4, thickness: 2.0, scale: 1.0, samples: 16 }); ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 }); ao.blendIntensity = 0.8; composer.addPass(ao); } catch (e) { info.errors.push('AO: ' + e.message); }
  composer.addPass(new OutputPass());
  const resize = () => { const w = canvas.clientWidth || 800, h = canvas.clientHeight || 450; renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();
  const shot = id => { const v = shots[id] || shots.vergleich; camera.position.copy(v.pos); controls.target.copy(v.tgt); controls.update(); };
  shot('vergleich');

  const mix = JSON.parse(JSON.stringify(MIX_HOUSE));
  const applyMix = () => matT9.userData.clay.setTools(mix);
  const st = { fix: 'v9', debug: 0, gain: [1, 1, 1, 1, 1, 1] };
  const setFix = v => { st.fix = v; const old = v === 'v8';
    U9.uClayFacetSoft.value = old ? 0 : 0.32; U9.uClayHexK.value = old ? 3 : 1.6; U9.uClayHexRot.value = old ? 1 : 0.12; U9.uClayHexFlow.value = old ? 0 : 1; };
  let raf = 0, frames = 0, fT = performance.now();
  const loop = () => { raf = requestAnimationFrame(loop); controls.update(); composer.render(); frames++; const n = performance.now(); if (n - fT > 1000) { info.fps = Math.round(frames * 1000 / (n - fT)); frames = 0; fT = n; } };
  loop();
  return {
    info, TOOLS, TOOL_LABELS, SIZES, mix, shot,
    set(k, v) {
      if (k === 'fix') setFix(v);
      else if (k === 'facetSoft') U9.uClayFacetSoft.value = v;
      else if (k === 'hexK') U9.uClayHexK.value = v;
      else if (k === 'hexRot') U9.uClayHexRot.value = v;
      else if (k === 'debug') { st.debug = v; U9.uClayDebug.value = v; }
      else if (k === 'zone') U9.uClayZone.value = v;
      else if (k === 'legacy') U9.uClayLegacyStroke.value = v ? 1 : 0;
      else if (k === 'ao' && ao) ao.enabled = !!v;
      else if (k === 'printOn') { U9.uClayPrintOn.value = v && printT ? 1 : 0; }
      else if (k === 'printTile') U9.uClayPrintTile.value = v;
      else if (k === 'printK') U9.uClayPrintK.value = v;
      else if (k === 'grain') U9.uClayGrain.value = v;
      else if (k === 'macro') U9.uClayMacro.value = v;
    },
    setGain(i, v) { st.gain[i] = v; U9.uClayToolGain.value[i] = v; },
    setMix(t, key, v) { mix[t][key] = v; applyMix(); },
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); controls.dispose(); renderer.dispose(); }
  };
}
