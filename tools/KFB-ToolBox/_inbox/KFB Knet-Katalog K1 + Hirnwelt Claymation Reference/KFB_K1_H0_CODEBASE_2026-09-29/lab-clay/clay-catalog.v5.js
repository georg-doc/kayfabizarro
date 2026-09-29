/* KFB Knet-Katalog K1 · clay-catalog v5 (v5: Beschriftung nur für das Muster unter dem Zeiger und das gewählte, »alle« als Schalter · v4: Material v8 mit Handmaß · Blasen als Knetplatte (Fläche), voll zur Kamera gedreht,
 *   Spitze und Perlen zeigen jedes Bild auf den Kopfknochen der Figur · Weg im Geländestück weich eingedrückt statt Treppenkante ·
 *   v3: Kamera schaut immer von vorn, hintere Reihe steiler, sonst verdecken die Häuser · v2: Tisch mit eigenem, ruhigem Profil — große Druckstellen lasen auf der Fläche als Krater ·
 *   Blasen auf 0,55 zur Figur · Denkblase Tuschrand der Perlen repariert)
 * Ein Tisch, auf dem je Asset-Klasse ein oder zwei Muster in Weltmaß stehen (Figur ≈ 1,2 Einheiten).
 * Material clay-material.v7 + Profile clay-profiles.v2, Vorstufe clay-soften.v1, Relief clay-relief.v2 — unverändert importiert.
 * Weltmaß ist Absicht: nur so zeigen die Entfernungsbänder (nah · mittel · fern) dasselbe wie in einer Welt.
 * Neu hier: Sprech- und Denkblasen als Knetmodelle, ohne Schatten, mit Tuschrand (umgedrehte Hülle).
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { makeClayRelief } from './clay-relief.v2.js';
import { makeClayUniforms, makeClayMaterial, seedGeometry, makePrintTexture, PROFILES } from './clay-material.v8.js';
import { PROFILE_LABELS } from './clay-profiles.v2.js';
import { softenGeometry } from './clay-soften.v1.js';

const here = f => new URL(f, import.meta.url).href;
const PIN = '2ff8b350beefe02912bbff6eeeead3882e583d08';
const RAW = p => 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + PIN + '/' + p.split('/').map(encodeURIComponent).join('/');
const KIT = 'media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/';
const MS = 'media/3D_Assets/KayKit_Mystery_Series6/';
const ANIM = 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/';
const KS = 0.47;

// Blasen: eigenes Profil, hier als Objekt (Profile-Datei bleibt v2)
const BUBBLE = { role: 'soft', scale: 0.5, stroke: 0.8, grain: 1.0, facet: 0.8, crease: 0.5, print: 1.0, gouge: 0.0, crack: 0.0, dent: 0.45, gougeSize: 0.3, crackSize: 0.2, dentSize: 0.3, soften: null };
const TABLE = { ...PROFILES.terrainBg, scale: 1.6, dent: 0.12, dentSize: 1.4, gouge: 0.1, gougeSize: 1.2 };   // Bühne, kein Katalogeintrag
export const ALL_PROFILES = { ...PROFILES, bubble: BUBBLE };
delete ALL_PROFILES.default;
export const ALL_LABELS = { ...PROFILE_LABELS, bubble: 'Blasen' };

const C = { track: '#5d6f86', line: '#e2d0bc', wall: '#5983ac', roof: '#ef5a22', accent: '#f2b632', cloud: '#e2d0bc', leaf: '#1f7a3e', lime: '#cdc666', trunk: '#8b5a3c', mesa: '#f0a27c', white: '#f4f1ea', ink: '#26303b' };
const MOODS = {
  day:    { sun: '#fff4e6', sunI: 2.9, el: 32, az: -38, hemiS: '#d6e8f6', hemiG: '#d9a27a', hemiI: 0.95, sky: '#96bede' },
  golden: { sun: '#ffd2a1', sunI: 2.6, el: 13, az: -64, hemiS: '#f0b49a', hemiG: '#6b3e5a', hemiI: 0.8, sky: '#e9a07c' },
  studio: { sun: '#ffffff', sunI: 2.2, el: 55, az: -20, hemiS: '#f4f1ea', hemiG: '#c9b9a6', hemiI: 1.2, sky: '#e2d0bc' }
};
const DIST = { fern: 26, mittel: 9, nah: 3.2 };
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

export async function boot(canvas, onNote = () => {}) {
  const state = { mood: 'day', relief: true, ao: true, shadows: true, labels: false, life: true, outline: true, turn: false, dist: 'mittel', sel: null };
  const info = { fps: 0, tris: 0, errors: [], loaded: 0 };

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.minDistance = 1; controls.maxDistance = 90; controls.maxPolarAngle = Math.PI * 0.49;
  camera.position.set(0, 20, 30); controls.target.set(0, 0.5, 1); controls.update();

  onNote('Knete wird angerührt …');
  await new Promise(r => setTimeout(r, 30));
  const rel = makeClayRelief({ size: 1024, seed: 11 });
  const tex = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true; tex.anisotropy = renderer.capabilities.getMaxAnisotropy(); tex.needsUpdate = true;
  const U = makeClayUniforms(THREE, tex);
  try { U.uClayPrint.value = await makePrintTexture(THREE, here('../ref/clay-joebinns/Fingerprints01_3K.png'), 2048); U.uClayPrintOn.value = 1; }
  catch (e) { info.errors.push('Fingerabdrücke: ' + e.message); U.uClayPrint.value = tex; }
  const pf = k => ALL_PROFILES[k] || PROFILES.default;
  const clay = (color, profile, extra = {}) => makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color, vertexColors: !!extra.vc }), profile: pf(profile), ...extra });

  const sun = new THREE.DirectionalLight('#fff', 3); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 5, far: 120 });
  sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.03; scene.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight('#fff', '#888', 1); scene.add(hemi);
  const fill = new THREE.DirectionalLight('#ffe6d6', 0.6); scene.add(fill);

  const mesh = (g, m, { cast = true, recv = true, seed = 1 } = {}) => { seedGeometry(THREE, g, seed); const o = new THREE.Mesh(g, m); o.castShadow = cast; o.receiveShadow = recv; return o; };
  const vcol = (g, f) => { const p = g.attributes.position, c = new Float32Array(p.count * 3), col = new THREE.Color(); for (let i = 0; i < p.count; i++) { f(p.getX(i), p.getY(i), p.getZ(i), col, i); c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b; } g.setAttribute('color', new THREE.BufferAttribute(c, 3)); return g; };
  const soft = (g, o) => { try { return softenGeometry(THREE, g, o).geometry; } catch (e) { info.errors.push('Vorstufe: ' + e.message); return g; } };
  const ni = g => g.index ? g.toNonIndexed() : g;
  const strip = g => { for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'color'].includes(k)) g.deleteAttribute(k); return g; };

  // Tisch: ein Kissen aus Knete
  {
    let g = new THREE.BoxGeometry(34, 0.8, 26, 68, 2, 52); g.translate(0, -0.4, 0);
    g = soft(g, { maxLevels: 0, iters: 14, lambda: 0.55, mu: -0.57, lump: 0.0015, lumpFreq: 1.1 });
    g.computeVertexNormals();
    scene.add(mesh(g, clay(C.line, TABLE), { cast: false, seed: 3 }));
  }

  // ---------- Loader ----------
  const loader = new GLTFLoader(); const gltfCache = new Map();
  const loadG = p => { if (!gltfCache.has(p)) gltfCache.set(p, loader.loadAsync(RAW(p)).then(g => { info.loaded++; return g; })); return gltfCache.get(p); };
  const softCache = new Map();
  const clayify = (root, { profile = 'prop', soften = true, softOpt = {}, seed = 1 } = {}) => {
    const mc = new Map();
    root.traverse(o => {
      if (!o.isMesh) return; o.castShadow = o.receiveShadow = true;
      const conv = s => { if (!mc.has(s)) mc.set(s, makeClayMaterial(THREE, U, { src: s, profile: pf(profile) })); return mc.get(s); };
      o.material = Array.isArray(o.material) ? o.material.map(conv) : conv(o.material);
      if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
      if (o.isSkinnedMesh) return;
      let g = o.geometry;
      if (soften) { g = softCache.get(o.geometry); if (!g) { g = soft(o.geometry, softOpt); softCache.set(o.geometry, g); } }
      o.geometry = seedGeometry(THREE, g.clone(), seed + o.id);
    });
  };
  const footed = (inner, { height = null, length = null, scale = null } = {}) => {
    inner.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(inner), size = box.getSize(new THREE.Vector3());
    const s = scale ?? (height ? height / size.y : length ? length / Math.max(size.x, size.z) : 1);
    const wrap = new THREE.Group(), mid = new THREE.Group(); mid.add(inner);
    inner.position.set(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2);
    mid.scale.setScalar(s); wrap.add(mid); return wrap;
  };
  const prop = async (file, opt = {}) => { const g = await loadG(KIT + file + '.gltf'); const sc = g.scene.clone(true); clayify(sc, opt); return footed(sc, opt); };
  const clean = c => new THREE.AnimationClip(c.name, c.duration, c.tracks.filter(t => { const i = t.name.lastIndexOf('.'), node = t.name.slice(0, i), pr = t.name.slice(i + 1); return pr !== 'scale' && (pr !== 'position' || /^(root|hips|pelvis)$/i.test(node)); }));
  const rigClips = {};
  const clipsFor = async rig => rigClips[rig] || (rigClips[rig] = (async () => {
    const [gen, mov] = await Promise.all([loadG(ANIM + 'Rig_' + rig + '/Rig_' + rig + '_General.glb'), loadG(ANIM + 'Rig_' + rig + '/Rig_' + rig + '_MovementBasic.glb')]);
    const all = [...gen.animations, ...mov.animations].map(clean); const by = n => all.find(c => c.name === n);
    return { idle: by('Idle_A') || all[0], idle2: by('Idle_B') || by('Idle_A') || all[0] };
  })());
  const mixers = [];
  const figure = async (path, rig, clip, seed) => {
    const [g, clips] = await Promise.all([loadG(MS + path), clipsFor(rig)]);
    const sc = g.scene; clayify(sc, { profile: 'figure', soften: false, seed });
    sc.traverse(o => { if (o.isMesh) o.frustumCulled = false; });
    const mixer = new THREE.AnimationMixer(sc); const a = mixer.clipAction(clips[clip]); a.play(); a.time = hash(seed) * 3; mixers.push(mixer);
    return footed(sc, { scale: KS });
  };

  // ---------- Formen ----------
  const shape = {
    terrain() {
      const g = new THREE.PlaneGeometry(7, 7, 150, 150); g.rotateX(-Math.PI / 2);
      const p = g.attributes.position; const cA = new THREE.Color(C.lime), cB = new THREE.Color(C.leaf), cR = new THREE.Color(C.line);
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), z = p.getZ(i), e = THREE.MathUtils.smoothstep(3.45 - Math.max(Math.abs(x), Math.abs(z)), 0, 0.9);
        const h = e * (0.1 + 0.38 * (0.5 + 0.5 * Math.sin(x * 1.05 + 0.3) * Math.cos(z * 0.85 - 0.6)) + 0.1 * Math.sin(x * 2.6 + z * 1.9) + 0.04 * Math.sin(x * 5.3 - z * 4.1));
        const pk = THREE.MathUtils.smoothstep(0.3 - Math.abs(z - 0.9 * Math.sin(x * 0.7)), 0, 0.11);
        p.setY(i, h - 0.035 * pk * e);   // Weg: flach eingedrückt
      }
      vcol(g, (x, y, z, c) => { const pk = THREE.MathUtils.smoothstep(0.3 - Math.abs(z - 0.9 * Math.sin(x * 0.7)), 0, 0.11); c.copy(cA).lerp(cB, THREE.MathUtils.clamp((y - 0.1 + 0.035 * pk) / 0.45, 0, 1)).lerp(cR, 0.85 * pk); });
      g.computeVertexNormals();
      const o = new THREE.Group(); o.add(mesh(g, clay('#ffffff', 'terrainFg', { vc: true }), { seed: 5 })); return o;
    },
    mesa() {
      let g = new THREE.CylinderGeometry(3.0, 4.0, 4.4, 44, 8, false); g.translate(0, 2.2, 0);
      g = soft(strip(ni(g)), { maxEdge: 0.5, iters: 10, lump: 0.025, lumpFreq: 1.3 }); g.computeVertexNormals();
      const o = new THREE.Group(); o.add(mesh(g, clay(C.mesa, 'terrainBg'), { seed: 7 })); return o;
    },
    tree() {
      const o = new THREE.Group(); const cr = [];
      const tr = new THREE.CylinderGeometry(0.1, 0.16, 1.0, 12); tr.translate(0, 0.5, 0);
      const cA = new THREE.Color(C.leaf), cB = new THREE.Color(C.lime);
      for (let b = 0; b < 6; b++) {
        const r = 0.38 + hash(b * 3.1) * 0.24, a = b * 1.9, off = b ? 0.34 : 0;
        const g = new THREE.IcosahedronGeometry(r, 4); g.translate(Math.cos(a) * off, 1.15 + r * 0.5 + (b ? hash(b) * 0.4 : 0.15), Math.sin(a) * off);
        const t = cA.clone().lerp(cB, 0.25 + 0.1 * b); vcol(g, (x, y, z, c) => c.copy(t)); cr.push(strip(ni(g)));
      }
      o.add(mesh(mergeGeometries(cr), clay('#ffffff', 'nature', { vc: true }), { seed: 11 }));
      o.add(mesh(tr, clay(C.trunk, 'nature', { role: 'world', scale: 0.5 }), { seed: 12 }));
      return o;
    },
    rock() {
      const g = new THREE.IcosahedronGeometry(0.6, 5); const p = g.attributes.position, v = new THREE.Vector3();
      for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).normalize(); const k = 1 + 0.16 * Math.sin(v.x * 3.1 + 1) * Math.cos(v.z * 2.7) + 0.07 * Math.sin(v.y * 6.3 + v.x * 4.1); v.multiplyScalar(0.6 * k); v.y *= 0.68; p.setXYZ(i, v.x, v.y + 0.3, v.z); }
      g.computeVertexNormals();
      const o = new THREE.Group(); o.add(mesh(g, clay(new THREE.Color(C.track).lerp(new THREE.Color(C.line), 0.35), 'nature', { role: 'world' }), { seed: 13 })); return o;
    },
    road() {
      const HW = 0.45, prof = [[-1, -0.04], [-1, 0.03], [-0.86, 0.1], [-0.74, 0.02], [-0.05, 0.02], [0.05, 0.02], [0.74, 0.02], [0.86, 0.1], [1, 0.03], [1, -0.04]];
      const cT = new THREE.Color(C.track), cL = new THREE.Color(C.line); const pos = [], col = []; const N = 120;
      const P = t => new THREE.Vector3(-4 + 8 * t, 0, 0.9 * Math.sin((t - 0.5) * 3.4));
      const frame = t => { const a = P(t), b = P(Math.min(1, t + 0.004)), f = b.sub(a).normalize(); return { p: P(t), s: new THREE.Vector3(-f.z, 0, f.x) }; };
      for (let i = 0; i < N; i++) {
        const A = frame(i / N), B = frame((i + 1) / N);
        for (let k = 0; k < prof.length - 1; k++) {
          const c = (k <= 2 || (k >= 6 && k <= 8)) ? cL : k === 4 ? ((i % 8) < 4 ? cL : cT) : cT;
          const v = (F, q) => F.p.clone().addScaledVector(F.s, prof[q][0] * HW).setY(prof[q][1]);
          const a = v(A, k), b = v(A, k + 1), cc = v(B, k + 1), d = v(B, k);
          pos.push(a.x, a.y, a.z, cc.x, cc.y, cc.z, d.x, d.y, d.z, a.x, a.y, a.z, b.x, b.y, b.z, cc.x, cc.y, cc.z);
          for (let q = 0; q < 6; q++) col.push(c.r, c.g, c.b);
        }
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
      const o = new THREE.Group(); o.add(mesh(g, clay('#ffffff', 'road', { vc: true }), { seed: 17 })); return o;
    },
    pond() {
      const o = new THREE.Group();
      const w = new THREE.SphereGeometry(1, 64, 16); w.scale(2.3, 0.07, 1.6);
      const rim = new THREE.TorusGeometry(1, 0.16, 14, 72); rim.rotateX(Math.PI / 2); rim.scale(2.35, 1, 1.66); rim.translate(0, 0.04, 0);
      o.add(mesh(w, clay(C.wall, 'water'), { cast: false, seed: 19 }), mesh(rim, clay(C.line, 'prop'), { seed: 20 }));
      return o;
    },
    cloud() {
      const o = new THREE.Group(); const m = clay(C.cloud, 'cloud');
      for (let b = 0; b < 6; b++) { const r = (0.5 + hash(b * 13) * 0.45) * (b ? 0.85 : 1.2); const g = new THREE.IcosahedronGeometry(r, 4); g.scale(1, 0.8, 0.85); const s = mesh(g, m, { recv: false, seed: 30 + b }); s.position.set((b - 2.5) * 0.55, (hash(b * 3) - 0.35) * 0.4, (hash(b + 1) - 0.5) * 0.7); o.add(s); }
      return o;
    }
  };
  // Blasen: Knetplatten (Fläche), Tuschrand als etwas größere Platte dahinter, kein Schatten.
  // Spitze (Sprechblase) und Perlen (Denkblase) sind eigene Teile und werden jedes Bild auf den Kopf gerichtet.
  const outlines = [];
  const inkMat = new THREE.MeshBasicMaterial({ color: C.ink, side: THREE.DoubleSide });
  const BW = 0.05;   // Tuschrand (lokal)
  const slab = (sh, depth, bev, seedN, mat) => {
    let g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelThickness: bev, bevelSize: bev * 0.9, bevelSegments: 4, curveSegments: 40, steps: 1 });
    g.translate(0, 0, -depth / 2); g = soft(strip(ni(g)), { maxLevels: 0, iters: 2, lump: 0.012, lumpFreq: 1.4 }); g.computeVertexNormals();
    return mesh(g, mat, { cast: false, recv: false, seed: seedN });
  };
  const ink = (sh, z) => { const o = new THREE.Mesh(new THREE.ShapeGeometry(sh, 40), inkMat); o.position.z = z; o.castShadow = o.receiveShadow = false; outlines.push(o); return o; };
  const ellipseShape = (a, b) => { const s = new THREE.Shape(); s.absellipse(0, 0, a, b, 0, Math.PI * 2, false, 0); return s; };
  const polyShape = pts => new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  const CA = 1.0, CB = 0.58, CK = 9;   // Denkblase: Ellipse mit 9 Bögen
  const cloudPts = d => { const pts = []; for (let i = 0; i < 270; i++) { const t = i / 270 * Math.PI * 2, f = t / (Math.PI * 2) * CK + 0.3, kk = Math.floor(f), s = (f - kk) * 2 - 1; const bh = 0.2 + 0.08 * hash(kk * 3.7 + 1); const bump = bh * Math.sqrt(Math.max(0, 1 - s * s)); const ex = Math.cos(t) * CA, ey = Math.sin(t) * CB, nx = Math.cos(t) * CB, ny = Math.sin(t) * CA, nl = Math.hypot(nx, ny); pts.push([ex + nx / nl * (bump + d), ey + ny / nl * (bump + d)]); } return pts; };
  const tailPts = d => { const pts = [], hw = 0.24 + d, N = 24; for (let i = 0; i <= N; i++) { const u = i / N, y = -u * (1 + d * 0.4), w = hw * Math.pow(1 - u, 1.25), bend = 0.1 * Math.sin(u * Math.PI); pts.push([-w + bend, y]); } for (let i = N; i >= 0; i--) { const u = i / N, y = -u * (1 + d * 0.4), w = hw * Math.pow(1 - u, 1.25), bend = 0.1 * Math.sin(u * Math.PI); pts.push([w + bend, y]); } return pts; };
  const edgeR = (ux, uy, a, b) => 1 / Math.sqrt((ux / a) ** 2 + (uy / b) ** 2);
  shape.speech = () => {
    const A = 1.2, B = 0.72, dep = 0.16, bev = 0.07, zi = -(dep / 2 + bev) - 0.02;
    const white = clay(C.white, 'bubble');
    const o = new THREE.Group();
    o.add(slab(ellipseShape(A, B), dep, bev, 41, white), ink(ellipseShape(A + bev + BW, B + bev + BW), zi));
    const tail = new THREE.Group();
    tail.add(slab(polyShape(tailPts(0)), 0.07, 0.04, 42, white), ink(polyShape(tailPts(0.04 + BW)), zi - 0.005));
    o.add(tail);
    const dm = clay(C.ink, 'bubble', { role: 'knetbar', scale: 0.3 });
    [-0.36, 0, 0.36].forEach((x, i) => { const d = new THREE.SphereGeometry(0.1, 20, 14); d.scale(1, 1, 0.45); const q = mesh(d, dm, { cast: false, recv: false, seed: 44 + i }); q.position.set(x, 0, dep / 2 + bev); o.add(q); });
    o.userData.aim = (h) => {   // h = Kopf im lokalen Raum der Blase
      const L = Math.hypot(h.x, h.y) || 1, ux = h.x / L, uy = h.y / L, e = edgeR(ux, uy, A, B), s0 = e * 0.55;
      tail.position.set(ux * s0, uy * s0, 0); tail.rotation.z = Math.atan2(ux, -uy);
      tail.scale.set(1, Math.max(0.5, L - s0 - 0.45), 1);
    };
    return o;
  };
  shape.thought = () => {
    const dep = 0.16, bev = 0.07, zi = -(dep / 2 + bev) - 0.02;
    const white = clay(C.white, 'bubble');
    const o = new THREE.Group();
    o.add(slab(polyShape(cloudPts(0)), dep, bev, 51, white), ink(polyShape(cloudPts(bev + BW)), zi));
    const R = [0.2, 0.14, 0.095], dots = R.map((r, i) => { const d = new THREE.Group(); d.add(slab(ellipseShape(r, r * 0.9), 0.08, 0.04, 55 + i, white), ink(ellipseShape(r + 0.04 + BW, r * 0.9 + 0.04 + BW), -0.1)); o.add(d); return d; });
    o.userData.aim = (h) => {
      const L = Math.hypot(h.x, h.y) || 1, ux = h.x / L, uy = h.y / L, e = edgeR(ux, uy, CA, CB) + 0.22;
      const span = Math.max(0.6, L - 0.5 - e);
      [0.2, 0.55, 0.86].forEach((f, i) => { const s = e + R[i] + span * f * 0.85; dots[i].position.set(ux * s, uy * s, 0); });
    };
    return o;
  };

  // ---------- Katalog ----------
  // x/z auf dem Tisch; bubble: schwebt über einer Figur
  const ITEMS = [
    { id: 'terrain', n: 'Geländestück', cls: 'terrainFg', at: [-11.5, -6.5], make: () => shape.terrain() },
    { id: 'road', n: 'Fahrbahn', cls: 'road', at: [-1.5, -7.5], make: () => shape.road() },
    { id: 'pond', n: 'Teich', cls: 'water', at: [7, -7.5], make: () => shape.pond() },
    { id: 'mesa', n: 'Tafelberg', cls: 'terrainBg', at: [13, -8], make: () => shape.mesa() },
    { id: 'houseA', n: 'Haus A', cls: 'house', at: [-12.5, 1.5], make: () => prop('building_A', { height: 3.2, profile: 'house', seed: 101 }) },
    { id: 'houseE', n: 'Haus E', cls: 'house', at: [-8.5, 1.5], make: () => prop('building_E', { height: 3.8, profile: 'house', seed: 111 }) },
    { id: 'tree', n: 'Baum', cls: 'nature', at: [-4.5, 1.5], make: () => shape.tree() },
    { id: 'bush', n: 'Busch', cls: 'nature', at: [-2.4, 1.5], make: () => prop('bush', { height: 0.7, profile: 'nature', seed: 121 }) },
    { id: 'rock', n: 'Felsen', cls: 'nature', at: [-0.5, 1.5], make: () => shape.rock() },
    { id: 'lamp', n: 'Laterne', cls: 'prop', at: [2.3, 1.5], make: () => prop('streetlight', { height: 2.2, profile: 'prop', seed: 131 }) },
    { id: 'signal', n: 'Ampel', cls: 'prop', at: [4.1, 1.5], make: () => prop('trafficlight_A', { height: 2.2, profile: 'prop', seed: 141 }) },
    { id: 'hydrant', n: 'Hydrant', cls: 'prop', at: [5.7, 1.5], make: () => prop('firehydrant', { height: 0.45, profile: 'prop', seed: 151 }) },
    { id: 'bench', n: 'Bank', cls: 'prop', at: [7.4, 1.5], make: () => prop('bench', { length: 1.3, profile: 'prop', seed: 161 }) },
    { id: 'cloud', n: 'Wolke', cls: 'cloud', at: [12, 1.5], lift: 2.6, make: () => shape.cloud() },
    { id: 'knight', n: 'Black Knight', sub: 'Rig_Large', cls: 'figure', at: [-11, 8], make: () => figure('3 - September 2024 - Black Knight/characters/BlackKnight.glb', 'Large', 'idle', 201) },
    { id: 'farmer', n: 'Farmer A', sub: 'Rig_Medium', cls: 'figure', at: [-7, 8], make: () => figure('12 - June 2026 - Farmers/Farmer_A.glb', 'Medium', 'idle2', 211) },
    { id: 'thought', n: 'Denkblase', cls: 'bubble', at: [-10.4, 8], lift: 3.05, s: 0.55, bub: true, to: 'knight', make: () => shape.thought() },
    { id: 'speech', n: 'Sprechblase', cls: 'bubble', at: [-6.4, 8], lift: 1.9, s: 0.55, bub: true, to: 'farmer', make: () => shape.speech() },
    { id: 'taxi', n: 'Taxi', cls: 'vehicle', at: [-1, 8], make: () => prop('car_taxi', { length: 2.1, profile: 'vehicle', softOpt: { maxEdge: 0.03, iters: 4, lump: 0.002 }, seed: 221 }) },
    { id: 'police', n: 'Polizei', cls: 'vehicle', at: [2.6, 8], make: () => prop('car_police', { length: 2.1, profile: 'vehicle', softOpt: { maxEdge: 0.03, iters: 4, lump: 0.002 }, seed: 231 }) }
  ];
  const items = [];
  onNote('Muster werden geknetet …');
  await Promise.all(ITEMS.map(async (it, k) => {
    try {
      const o = await it.make(); o.position.set(it.at[0], it.lift || 0, it.at[1]); if (it.s) o.scale.setScalar(it.s);
      if (!it.bub && !it.lift) o.rotation.y = (hash(k * 7) - 0.5) * 0.9;
      scene.add(o); o.updateMatrixWorld(true);
      const mats = new Set(); o.traverse(m => { if (m.isMesh) (Array.isArray(m.material) ? m.material : [m.material]).forEach(x => x.userData && x.userData.clay && mats.add(x)); m.userData.itemId = it.id; });
      const box = new THREE.Box3().setFromObject(o);
      items.push({ ...it, obj: o, mats: [...mats], box, center: box.getCenter(new THREE.Vector3()), radius: box.getSize(new THREE.Vector3()).length() / 2, profile: it.cls, base: o.position.clone(), phase: hash(k * 3.3) * 6.28 });
    } catch (e) { info.errors.push(it.n + ': ' + e.message); }
  }));
  items.sort((a, b) => ITEMS.findIndex(x => x.id === a.id) - ITEMS.findIndex(x => x.id === b.id));
  const byId = id => items.find(i => i.id === id);
  // Kopf je Figur: Knochen »head«, sonst Oberkante
  for (const it of items) { if (it.cls !== 'figure') continue; let hb = null; it.obj.traverse(o => { if (!hb && o.isBone && /head/i.test(o.name)) hb = o; }); it.head = hb; }
  const headPos = new THREE.Vector3(), headOf = it => { if (it.head) { it.head.getWorldPosition(headPos); headPos.y += 0.12; } else headPos.set(it.center.x, it.box.max.y, it.center.z); return headPos; };

  // ---------- Beschriftung ----------
  const host = canvas.parentElement; const layer = document.createElement('div');
  Object.assign(layer.style, { position: 'absolute', inset: '0', pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }); host.appendChild(layer);
  items.forEach(it => {
    const el = document.createElement('div');
    Object.assign(el.style, { position: 'absolute', left: '0', top: '0', background: 'rgba(255,255,255,.94)', border: '1px solid #dfe3e8', borderRadius: '10px', padding: '4px 8px', boxShadow: '0 8px 22px rgba(19,25,35,.10)', whiteSpace: 'nowrap', fontFamily: 'Inter,ui-sans-serif,system-ui,sans-serif', lineHeight: '1.2', transition: 'opacity .18s' });
    el.innerHTML = '<div style="font-weight:800;font-size:12px;color:#17191d"></div><div style="font-size:10.5px;color:#6d737d"></div>';
    el.children[0].textContent = it.n; layer.appendChild(el); it.el = el;
  });
  const updLabels = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight, taken = [];
    const order = items.map(it => [it, camera.position.distanceTo(it.center)]).sort((a, b) => a[1] - b[1]).map(x => x[0]);
    for (const it of order) {
      it.el.children[1].textContent = (ALL_LABELS[it.profile] || it.profile) + (it.sub ? ' · ' + it.sub : '');
      const p = new THREE.Vector3(it.center.x, it.box.max.y + 0.25, it.center.z).project(camera);
      const sx = (p.x + 1) / 2 * w, sy = (1 - p.y) / 2 * h, lw = it.el.offsetWidth || 110;
      let vis = (state.labels || it.id === hoverId || it.id === state.sel) && p.z < 1 && Math.abs(p.x) < 1.05 && Math.abs(p.y) < 1.05;
      if (vis && taken.some(r => Math.abs(r[0] - sx) < (r[2] + lw) / 2 + 4 && Math.abs(r[1] - sy) < 36)) vis = false;
      if (vis) taken.push([sx, sy, lw]);
      it.el.style.opacity = vis ? (state.sel && state.sel !== it.id ? '0.55' : '1') : '0';
      it.el.style.border = state.sel === it.id ? '1px solid #5d4cff' : '1px solid #dfe3e8';
      if (vis) it.el.style.transform = `translate(${sx.toFixed(1)}px,${sy.toFixed(1)}px) translate(-50%,-100%)`;
    }
  };

  // ---------- Nachbearbeitung ----------
  const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
  let aoPass = null;
  try {
    const { GTAOPass } = await import('three/addons/postprocessing/GTAOPass.js');
    aoPass = new GTAOPass(scene, camera, 2, 2);
    aoPass.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1.4, thickness: 1.2, scale: 1.0, samples: 16 });
    aoPass.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
    aoPass.blendIntensity = 0.9; composer.addPass(aoPass);
  } catch (e) { info.errors.push('AO: ' + e.message); }
  composer.addPass(new OutputPass());

  const apply = () => {
    const M = MOODS[state.mood], el = THREE.MathUtils.degToRad(M.el), az = THREE.MathUtils.degToRad(M.az);
    sun.position.set(Math.sin(az) * Math.cos(el) * 60, Math.sin(el) * 60, Math.cos(az) * Math.cos(el) * 60);
    fill.position.copy(sun.position).multiplyScalar(-1).setY(20); fill.intensity = M.sunI * 0.15;
    sun.color.set(M.sun); sun.intensity = M.sunI; hemi.color.set(M.hemiS); hemi.groundColor.set(M.hemiG); hemi.intensity = M.hemiI;
    scene.background = new THREE.Color(M.sky);
    U.uClayOn.value = state.relief ? 1 : 0; sun.castShadow = state.shadows;
    if (aoPass) aoPass.enabled = state.ao;
    outlines.forEach(o => o.visible = state.outline);
    let tris = 0; scene.traverse(o => { if (o.isMesh && o.visible) { const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3; } }); info.tris = Math.round(tris);
  };
  apply();
  const resize = () => { const w = canvas.clientWidth || 800, h = canvas.clientHeight || 450; renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

  // ---------- Kamera ----------
  let fly = null;
  const flyTo = (p, t) => { fly = { p0: camera.position.clone(), t0: controls.target.clone(), p, t, k: 0 }; };
  const frameSel = () => {
    if (!state.sel) { flyTo(new THREE.Vector3(0, 20, 30), new THREE.Vector3(0, 0.5, 1)); return; }
    const it = byId(state.sel); if (!it) return;
    const t = it.center.clone(), d = DIST[state.dist] + it.radius * 0.6;
    const dir = new THREE.Vector3(0.25, 0, 1).normalize();
    const elev = (state.dist === 'fern' ? 0.7 : state.dist === 'mittel' ? 0.5 : 0.3) + (it.at[1] < -3 ? 0.25 : 0);
    dir.multiplyScalar(Math.cos(elev)).setY(Math.sin(elev));
    flyTo(t.clone().addScaledVector(dir, d), t);
  };

  // Auswahl per Klick
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let down = null, hoverId = null, hoverT = 0;
  canvas.addEventListener('pointermove', e => {
    const now = performance.now(); if (now - hoverT < 60) return; hoverT = now;
    const r = canvas.getBoundingClientRect(); ptr.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
    ray.setFromCamera(ptr, camera); const hit = ray.intersectObjects(items.map(i => i.obj), true)[0];
    hoverId = hit ? hit.object.userData.itemId : null; canvas.style.cursor = hoverId ? 'pointer' : '';
  });
  canvas.addEventListener('pointerleave', () => { hoverId = null; });
  canvas.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', e => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
    const r = canvas.getBoundingClientRect(); ptr.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const hit = ray.intersectObjects(items.map(i => i.obj), true)[0];
    const id = hit && hit.object.userData.itemId; if (id) { state.sel = id; frameSel(); api.onSelect && api.onSelect(id); }
  });

  let last = performance.now(), acc = 0, frames = 0, alive = true, T = 0;
  const loop = () => {
    if (!alive) return; requestAnimationFrame(loop);
    const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; T += dt;
    acc += dt; frames++; if (acc > 1) { info.fps = Math.round(frames / acc); acc = 0; frames = 0; }
    mixers.forEach(m => m.update(dt));
    for (const it of items) {
      if (it.bub) {
        const o = it.obj; o.quaternion.copy(camera.quaternion);
        const b = state.life ? Math.sin(T * 2.2 + it.phase) : 0;
        const k = it.s || 1; o.position.y = it.base.y + 0.04 * b; o.scale.set(k * (1 + 0.03 * b), k * (1 - 0.03 * b), k);
        const tgt = it.to && byId(it.to); if (tgt && o.userData.aim) { o.updateMatrixWorld(true); o.userData.aim(o.worldToLocal(headOf(tgt).clone())); }
      } else if (it.id === 'cloud') { const b = state.life ? Math.sin(T * 0.9 + it.phase) : 0; it.obj.position.y = it.base.y + 0.15 * b; it.obj.rotation.y = state.life ? T * 0.05 : 0; }
    }
    if (fly) { fly.k = Math.min(1, fly.k + dt / 1.3); const e = fly.k * fly.k * (3 - 2 * fly.k); camera.position.lerpVectors(fly.p0, fly.p, e); controls.target.lerpVectors(fly.t0, fly.t, e); if (fly.k >= 1) fly = null; }
    controls.autoRotate = state.turn && !fly; controls.autoRotateSpeed = 1.2;
    controls.update(); updLabels(); composer.render();
  };
  loop(); onNote('');

  const api = {
    info, THREE, scene, camera, renderer, U,
    items: items.map(i => ({ id: i.id, n: i.n, cls: i.cls })),
    profiles: Object.keys(ALL_PROFILES).map(k => ({ key: k, label: ALL_LABELS[k] || k })),
    get state() { return { ...state }; },
    profileOf: id => { const it = byId(id); return it ? it.profile : null; },
    profileValues: key => ALL_PROFILES[key],
    select(id) { state.sel = id; frameSel(); },
    setDist(d) { state.dist = d; frameSel(); },
    setItemProfile(id, key) { const it = byId(id); if (!it) return; it.profile = key; it.mats.forEach(m => m.userData.clay.setProfile(ALL_PROFILES[key])); },
    resetProfiles() { items.forEach(it => api.setItemProfile(it.id, it.cls)); },
    set(k, v) {
      if (k in state) { state[k] = v; apply(); return; }
      const map = { stroke: 'uClayStroke', grain: 'uClayGrain', print: 'uClayPrintK', facet: 'uClayFacet', crease: 'uClayCrease', oil: 'uClayOil', gouge: 'uClayGouge', crack: 'uClayCrack', dent: 'uClayDent', mottle: 'uClayMottle', lodK: 'uClayLodK', hand: 'uClayHand' };
      if (map[k]) U[map[k]].value = v; else if (k === 'lodDebug') U.uClayDebug.value = v ? 1 : 0;
    },
    dispose() { alive = false; ro.disconnect(); layer.remove(); renderer.dispose(); }
  };
  return api;
}
