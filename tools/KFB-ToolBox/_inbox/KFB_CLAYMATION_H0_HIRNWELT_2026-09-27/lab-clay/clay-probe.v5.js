/* KFB Knet-Probe v5 (D1) — v5: alles auf dem Modelle-Weg (Stempelkarte, Facetten, Abdrücke), Maßstab je Objekt passend, gestreut je Instanz (clay-material.v4).
 * KFB Knet-Probe v4 (D1) — v4: Kissenziegel wieder mit Stempelkarte wie v2 (Georg: vorher besser); Deckel, Würste, Tafelberge prozedural.
 * KFB Knet-Probe v3 (D1) — v3: große Flächen prozedural (clay-material.v3), Modelle wie v2.
 * KFB Knet-Probe v2 (D1) — v2: Saat je Objekt, Druckfacetten, Fingerabdrücke (clay-material.v2).
 * KFB Knet-Probe v1 (D1) — ein Streckenstück, zwei Gebäude, ein Auto, ein Kid, eine Wolke und
 * eine knetbare Masse unter einem Licht. Jede Schicht des Looks ist einzeln schaltbar, damit die
 * Kernfrage (Licht + Textur oder Geometrie?) an UNSEREN Modellen beantwortet wird.
 *
 * Modelle byteweise geprüft @2ff8b350 (Status 200, Länge > 0):
 *   KayKit City Builder building_A / building_E (.gltf + .bin + citybits_texture.png)
 *   KayKit Mystery Series 6 CapsuleCarl player.gltf · Kenney Racing roadStraight, raceCarOrange
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { makeClayRelief } from './clay-relief.v2.js';
import { makeClayUniforms, makeClayMaterial, setPalette, PALETTES, seedGeometry, makePrintTexture } from './clay-material.v4.js';
import { softenGeometry } from './clay-soften.v1.js';

const PIN = '2ff8b350beefe02912bbff6eeeead3882e583d08';
const RAW = p => 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + PIN + '/' + p.split('/').map(encodeURIComponent).join('/');
const KIT = 'media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/';
const KEN = 'media/3D_Assets/kenney_racing-kit/Models/GLTF format/';

const MOODS = {
  day:    { sun: '#fff4e6', sunI: 2.9, el: 30, az: -38, hemiS: '#d6e8f6', hemiG: '#d9a27a', hemiI: 0.95, fog: [26, 75], sky: null, point: 0 },
  golden: { sun: '#ffd2a1', sunI: 2.6, el: 13, az: -62, hemiS: '#f0b49a', hemiG: '#6b3e5a', hemiI: 0.8, fog: [22, 70], sky: '#e9a07c', point: 0 },
  cave:   { sun: '#9fb4d8', sunI: 0.5, el: 55, az: 20, hemiS: '#2e4262', hemiG: '#0f131b', hemiI: 0.55, fog: [14, 45], sky: '#1b2533', point: 9 }
};

export async function boot(canvas, onNote = () => {}) {
  const state = { relief: true, soften: true, palette: 'claybound', mood: 'day', ao: true, cam: 'wide' };
  const info = { tris: 0, fps: 0, reliefMs: 0, softenMs: 0, models: [], ao: 'aus', errors: [] };

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  const CAMS = {
    wide: { p: [0.4, 5.2, 16.5], t: [0.4, 3.1, -0.6] },
    close: { p: [-3.4, 3.35, 4.6], t: [-2.6, 2.35, 0.2] },
    brick: { p: [1.6, 1.6, 4.4], t: [1.2, 1.3, 1.5] }
  };
  const setCam = k => { const c = CAMS[k] || CAMS.wide; camera.position.set(...c.p); controls.target.set(...c.t); controls.update(); };
  setCam('wide');

  // Relief
  onNote('Knete wird angerührt …');
  await new Promise(r => setTimeout(r, 30));
  const rel = makeClayRelief({ size: 1024, seed: 11 });
  info.reliefMs = rel.ms; info.relief = rel.count;
  const tex = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true; tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  tex.needsUpdate = true;
  const U = makeClayUniforms(THREE, tex);
  try {
    onNote('Fingerabdrücke werden gelesen …');
    U.uClayPrint.value = await makePrintTexture(THREE, 'ref/clay-joebinns/Fingerprints01_3K.png', 2048);
    U.uClayPrintOn.value = 1; info.prints = 'cgbookcase Fingerprints 01';
  } catch (e) { info.errors.push('prints: ' + e.message); U.uClayPrint.value = tex; }

  // Licht
  const sun = new THREE.DirectionalLight('#fff', 3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -11, right: 11, top: 9, bottom: -6, near: 1, far: 60 });
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
  scene.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight('#fff', '#888', 1);
  scene.add(hemi);
  const lamp = new THREE.PointLight('#7fd7ff', 0, 12, 1.6);
  lamp.position.set(3.4, 3.4, 2.4);
  scene.add(lamp);
  scene.fog = new THREE.Fog('#96bede', 26, 75);

  // Rollen → Knet-Materialien, Farben kommen aus der aktiven Palette
  const authored = [];   // { mat, key }
  const mat = (key, role = 'world', extra = {}) => {
    const m = makeClayMaterial(THREE, U, { role, proc: false, ...extra });
    authored.push({ mat: m, key });
    return m;
  };
  const softTargets = [];   // { mesh, raw, soft, opt }
  const addSoft = (mesh, opt) => { softTargets.push({ mesh, raw: mesh.geometry, soft: null, opt }); };

  const world = new THREE.Group(); scene.add(world);

  // Plateau aus Kissenziegeln, wie Referenz 05
  const stoneMat = [mat('ground'), mat('ground2')];
  const capMat = mat('ground', 'world', { scale: 1.4 });
  const rollMat = mat('ground2', 'world', { scale: 0.45 });
  const pillow = (w, h, d, m, x, y, z, seed) => {
    const seg = v => Math.max(2, Math.ceil(v / 0.14));
    const g = new THREE.BoxGeometry(w, h, d, seg(w), seg(h), seg(d));
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(x, y, z); mesh.castShadow = mesh.receiveShadow = true;
    world.add(mesh);
    addSoft(mesh, { maxLevels: 0, iters: 14, lambda: 0.55, mu: -0.57, lump: 0.02, lumpFreq: 1.1, seed });
    return mesh;
  };
  const W = 2.16, rows = [0.55, 1.62], cols = 6;
  rows.forEach((y, r) => {
    for (let c = 0; c < cols; c++) {
      const off = r % 2 ? W / 2 : 0;
      const x = -((cols - 1) * W) / 2 + c * W + off - (r % 2 ? W / 4 : 0);
      const w = W - 0.08 - ((c * 7 + r * 3) % 3) * 0.05;
      pillow(w, 1.02, 4.4, stoneMat[(c + r) % 2], x, y, -0.9, c * 5 + r * 13 + 1);
    }
  });
  const cap = pillow(13.4, 0.42, 4.9, capMat, 0, 2.3, -0.85, 77);
  // gerollte Würste an der Vorderkante
  for (let i = 0; i < 9; i++) {
    const len = 0.7 + ((i * 37) % 5) * 0.12;
    const g = new THREE.CapsuleGeometry(0.075, len, 6, 14);
    g.rotateZ(Math.PI / 2);
    const m = new THREE.Mesh(g, rollMat);
    m.position.set(-5.8 + i * 1.45 + ((i * 13) % 3) * 0.1, 2.12, 1.62);
    m.castShadow = m.receiveShadow = true;
    world.add(m);
    addSoft(m, { maxLevels: 0, iters: 2, lump: 0.05, lumpFreq: 2.2, seed: i + 40 });
  }
  const TOP = 2.51;

  // Knetbare Masse: glatter, glänzender, flacheres Relief (Claybound PR #7)
  {
    const g = new THREE.SphereGeometry(1, 72, 48);
    g.scale(1.9, 1.05, 1.7);
    const m = new THREE.Mesh(g, mat('knetbar', 'knetbar', { scale: 0.9 }));
    m.position.set(5.6, TOP + 0.18, 0.2);
    m.castShadow = m.receiveShadow = true;
    world.add(m);
    addSoft(m, { maxLevels: 0, iters: 1, lump: 0.07, lumpFreq: 0.9, seed: 9 });
  }
  // Knetwolke
  {
    const parts = [[0, 0, 0, 1.0], [1.05, -0.15, 0.1, 0.78], [-1.0, -0.2, 0, 0.72], [0.45, 0.45, -0.2, 0.7], [-0.45, 0.35, 0.15, 0.62], [1.8, -0.35, 0, 0.5], [-1.7, -0.35, 0.05, 0.48]];
    const cloud = new THREE.Group();
    const cm = mat('cloud', 'soft', { scale: 0.75 });
    parts.forEach(([x, y, z, r], i) => {
      const g = new THREE.IcosahedronGeometry(r, 6); g.scale(1, 0.82, 0.8);
      const m = new THREE.Mesh(g, cm); m.position.set(x, y, z); m.castShadow = true;
      cloud.add(m); addSoft(m, { maxLevels: 0, iters: 1, lump: 0.06, lumpFreq: 1.4, seed: 60 + i });
    });
    cloud.position.set(4.6, 6.4, -5.5);
    world.add(cloud);
  }
  // Tafelberge im Dunst
  const farMat = mat('far', 'world', { scale: 3.2 });
  [[-16, 5.5, -30, 6, 11], [-5, 3.5, -38, 8, 7], [9, 6.5, -32, 5, 13], [19, 4.2, -40, 9, 8.4]].forEach(([x, y, z, w, h], i) => {
    const g = new THREE.BoxGeometry(w, h, 5, 10, 14, 6);
    const m = new THREE.Mesh(g, farMat); m.position.set(x, y - 3, z);
    world.add(m); addSoft(m, { maxLevels: 0, iters: 10, lump: 0.05, lumpFreq: 1.3, seed: 90 + i });
  });

  // Modelle
  const loader = new GLTFLoader();
  const loadModel = async (path, { height = null, width = null, pal = true, role = 'world', soften = true, softOpt = {} } = {}) => {
    const g = await loader.loadAsync(RAW(path));
    const root = g.scene;
    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const s = height ? height / size.y : width ? width / size.x : 1;
    root.scale.setScalar(s);
    const matCache = new Map(), names = [];
    root.traverse(o => {
      if (!o.isMesh) return;
      o.castShadow = o.receiveShadow = true;
      const conv = src => {
        if (!matCache.has(src)) { matCache.set(src, makeClayMaterial(THREE, U, { src, role, palMap: pal })); names.push(src.name || '—'); }
        return matCache.get(src);
      };
      o.material = Array.isArray(o.material) ? o.material.map(conv) : conv(o.material);
      if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
      if (soften) addSoft(o, softOpt);
    });
    info.models.push({ path: path.split('/').pop(), scale: +s.toFixed(4), size: size.toArray().map(v => +(v * s).toFixed(3)), materials: names });
    return { root, size: size.clone().multiplyScalar(s), box };
  };
  const place = (m, x, z, rotY = 0) => {
    m.root.rotation.y = rotY;
    m.root.updateMatrixWorld(true);
    const b = new THREE.Box3().setFromObject(m.root);
    m.root.position.set(x - (b.min.x + b.max.x) / 2, TOP - b.min.y, z - (b.min.z + b.max.z) / 2);
    world.add(m.root);
  };
  const tasks = [
    ['road', () => loadModel(KEN + 'roadStraight.glb', { width: 2.6, softOpt: { maxEdge: 0.16, iters: 4, lump: 0.01 } })],
    ['building_A', () => loadModel(KIT + 'building_A.gltf', { height: 3.1 })],
    ['building_E', () => loadModel(KIT + 'building_E.gltf', { height: 3.6 })],
    ['car', () => loadModel(KEN + 'raceCarOrange.glb', { width: 1.5, softOpt: { maxEdge: 0.12, iters: 4, lump: 0.008 } })],
    ['carl', () => loadModel('media/3D_Assets/KayKit_Mystery_Series6/CapsuleCarl/gltf/player.gltf', { height: 1.25, pal: false, role: 'soft', softOpt: { maxLevels: 0, iters: 2, lump: 0.006 } })]
  ];
  const got = {};
  for (const [k, fn] of tasks) {
    onNote('Lade ' + k + ' …');
    try { got[k] = await fn(); } catch (e) { info.errors.push(k + ': ' + e.message); }
  }
  if (got.road) {
    const roads = [got.road];
    for (let i = 1; i < 5; i++) { const c = got.road.root.clone(true); roads.push({ root: c }); }
    roads.forEach((r, i) => place(r, -5.2 + i * 2.6, -0.2, Math.PI / 2));
    roads.slice(1).forEach(r => r.root.traverse(o => { if (o.isMesh) addSoft(o, { maxEdge: 0.16, iters: 4, lump: 0.01 }); }));
  }
  if (got.building_A) place(got.building_A, -3.0, -2.55);
  if (got.building_E) place(got.building_E, 1.4, -2.55);
  if (got.car) { place(got.car, 1.2, -0.2, Math.PI / 2); got.car.root.position.y += 0.02; }
  if (got.carl) place(got.carl, -2.7, 1.05, 0.35);

  // Vorstufe rechnen (einmal, dann nur noch Tauschen)
  onNote('Knete wird gedrückt …');
  await new Promise(r => setTimeout(r, 20));
  const t1 = performance.now();
  const softCache = new Map();
  for (const t of softTargets) {
    if (softCache.has(t.raw)) { t.soft = softCache.get(t.raw); continue; }
    try { const r = softenGeometry(THREE, t.raw, t.opt); t.soft = r.geometry; t.stat = r; }
    catch (e) { t.soft = t.raw; info.errors.push('soften: ' + e.message); }
    softCache.set(t.raw, t.soft);
  }
  info.softenMs = Math.round(performance.now() - t1);
  // Saat je Instanz: geteilte Geometrie klonen, damit jede Kopie ihre eigene Musterlage trägt
  softTargets.forEach((t, i) => {
    t.raw = seedGeometry(THREE, t.raw.clone(), i + 1);
    t.soft = seedGeometry(THREE, t.soft.clone(), i + 1);
  });

  // Nachbearbeitung
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  let aoPass = null;
  try {
    const { GTAOPass } = await import('three/addons/postprocessing/GTAOPass.js');
    aoPass = new GTAOPass(scene, camera, 2, 2);
    aoPass.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1.4, thickness: 1.2, scale: 1.0, samples: 16 });
    aoPass.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
    aoPass.blendIntensity = 0.9;
    composer.addPass(aoPass);
    info.ao = 'GTAO';
  } catch (e) { info.ao = 'nicht verfügbar'; }
  composer.addPass(new OutputPass());

  // Anwenden
  const apply = () => {
    const pal = PALETTES[state.palette] || PALETTES.claybound;
    const mix = state.palette === 'original' ? 0 : 1;
    setPalette(THREE, U, pal, mix);
    const P = state.palette === 'original' ? PALETTES.claybound : pal;
    authored.forEach(a => a.mat.color.set(P[a.key] || '#ccc'));
    U.uClayOn.value = state.relief ? 1 : 0;
    for (const t of softTargets) t.mesh.geometry = state.soften ? t.soft : t.raw;
    const M = MOODS[state.mood];
    const el = THREE.MathUtils.degToRad(M.el), az = THREE.MathUtils.degToRad(M.az);
    sun.position.set(Math.sin(az) * Math.cos(el) * 30, Math.sin(el) * 30, Math.cos(az) * Math.cos(el) * 30);
    sun.target.position.set(0, 1.5, -0.8);
    sun.color.set(M.sun); sun.intensity = M.sunI;
    hemi.color.set(M.hemiS); hemi.groundColor.set(M.hemiG); hemi.intensity = M.hemiI;
    lamp.intensity = M.point;
    const sky = new THREE.Color(M.sky || P.sky);
    scene.background = sky; scene.fog.color.copy(sky); scene.fog.near = M.fog[0]; scene.fog.far = M.fog[1];
    if (aoPass) aoPass.enabled = state.ao;
    let tris = 0;
    scene.traverse(o => { if (o.isMesh && o.visible) { const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3; } });
    info.tris = Math.round(tris);
  };
  apply();

  // Größe
  const resize = () => {
    const w = canvas.clientWidth || 800, h = canvas.clientHeight || 450;
    renderer.setSize(w, h, false); composer.setSize(w, h);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

  let last = performance.now(), acc = 0, frames = 0, alive = true;
  const loop = () => {
    if (!alive) return;
    requestAnimationFrame(loop);
    const now = performance.now(); acc += now - last; last = now; frames++;
    if (acc > 1000) { info.fps = Math.round(frames * 1000 / acc); acc = 0; frames = 0; }
    controls.update();
    composer.render();
  };
  loop();
  onNote('');

  return {
    info,
    get state() { return { ...state }; },
    set(k, v) {
      if (k === 'cam') { state.cam = v; setCam(v); return; }
      if (k in state) { state[k] = v; apply(); return; }
      if (k === 'stroke') U.uClayStroke.value = v;
      else if (k === 'grain') U.uClayGrain.value = v;
      else if (k === 'macro') U.uClayMacro.value = v;
      else if (k === 'tile') U.uClayTile.value = v;
      else if (k === 'exposure') renderer.toneMappingExposure = v;
      else if (k === 'facet') U.uClayFacet.value = v;
      else if (k === 'crease') U.uClayCrease.value = v;
      else if (k === 'facetSize') U.uClayFacetSize.value = v;
      else if (k === 'print') U.uClayPrintK.value = v;
      else if (k === 'printTile') U.uClayPrintTile.value = v;
      else if (k === 'oil') U.uClayOil.value = v;
      else if (k === 'pStri') U.uClayProcStri.value = v;
      else if (k === 'pSmear') U.uClayProcSmear.value = v;
      else if (k === 'pLine') U.uClayProcLine.value = v;
    },
    uniforms: U,
    dispose() { alive = false; ro.disconnect(); renderer.dispose(); },
    THREE, scene, camera, renderer
  };
}
