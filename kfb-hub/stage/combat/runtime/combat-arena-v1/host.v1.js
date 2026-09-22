/**
 * host.v1.js — der WIRT der Combat Arena (Gründungsdokument §4, Modulvertrag §3).
 *
 * Liefert, was kein Modul selbst tun darf: EINE three-Instanz, Renderer mit Farbraum, feste
 * Zeitbasis, geseedeten Zufall, Asset-Adressen, Zeiger, Licht und Grund. Module melden an
 * (`static describe().capabilities`) und bekommen NUR das Deklarierte in `init(ctx)`.
 *
 * Herkunft, mit Zeilen (use-what-works Regel 2):
 *   podcast-v1/stage.v1.js   bgGradient          Z. 22–38   verbatim
 *   podcast-v1/stage.v1.js   Renderer/Licht      Z. 94–133  Key/Fill/Ambient, Schattenwerte
 *   assetlab-v4/lighting.js  prepare()           Z. 37–52   Entgrauen der KayKit-Materialien
 *   assetlab-v4/repo-fs.js   RAW, enc, rawUrl    Z. 7, 24–25
 *   assetlab-v4/asset-lab-v4.js frameObject      Z. 330–343 (Kamera/Controls als Parameter)
 * Eigene Arbeit (Naht): Fähigkeiten-Katalog, fester Schritt, Registrierung, Zeiger.
 */

export const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/';
const enc = (p) => p.split('/').map(encodeURIComponent).join('/');
export const rawUrl = (path) => RAW + enc(path);
const SKY = RAW + 'skydome_a.webp';

export const CAPABILITIES = ['three@0.160', 'renderer:webgl', 'clock', 'rng', 'assets', 'pointer', 'pets', 'audio'];

/* Aquarell-Grund, 1:1 aus stage.v1.js Z. 22–38. */
function bgGradient(THREE, hex) {
  const base = new THREE.Color(hex);
  const top = base.clone().multiplyScalar(1.5).offsetHSL(0, -0.04, 0.04);
  const bot = base.clone().multiplyScalar(0.5);
  const c = document.createElement('canvas'); c.width = 16; c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, '#' + top.getHexString());
  grd.addColorStop(0.62, '#' + base.getHexString());
  grd.addColorStop(1, '#' + bot.getHexString());
  g.fillStyle = grd; g.fillRect(0, 0, 16, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* mulberry32 — geseedet, determinism: seeded. */
function makeRng(seed) {
  let a = seed >>> 0;
  const rng = () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  rng.seed = seed;
  return rng;
}

export function createHost(o) {
  const THREE = o.THREE, canvas = o.canvas;
  const { OrbitControls, RoomEnvironment, GLTFLoader } = o.deps || {};
  const log = o.log || ((s) => console.info('[arena-host] ' + s));

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  /* KALIBRIERT 06.09. (Bildpuffer, 9×9 px auf dem Körper, Ziel Kanon #f2c93c = 242,201,60):
       ACES  exp 1,06 env 0,8 → 245,236,185  (Creme — Georgs »überstrahlt«; ACES entfaerbt Gelb im Highlight)
       ACES  exp 0,72 env 0,3 → 218,196,103  (dunkler, aber Blau bleibt zu hoch)
       None  exp 1,0  env 0,3 → 255,222,81   (clippt)
       AgX   exp 0,9  env 0,3 → 205,183,125  (grau)
       LINEAR  exp 0,8 env 0,3 → 239–243,198–201,72–80  ← ΔE ≈ 4, Boden B1 (≤ 8) bestanden
     (Die Messreihe lief zuerst mit `NeutralToneMapping` — das gibt es in r160 NICHT (r162), three fiel still
      auf Linear zurück. Also steht hier Linear ausdrücklich, kein undefined.)
     Also Linear. Der Farbton ist jetzt eine Eigenschaft der Datei (assets/models/FrizzleBob_Yellow*.gltf),
     das Licht liest ihn, statt ihn zu überschreiben. Zahlen in docs/CONTRACT.md §0. */
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.toneMappingExposure = 0.8;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const bgGrad = bgGradient(THREE, o.bg || '#b9c6bd');
  scene.background = bgGrad;
  const texLoader = new THREE.TextureLoader(); texLoader.setCrossOrigin('anonymous');
  let skyTex = null;
  /* Hintergrund-Wahl (CA-2): 'skydome' (Aquarell-Kuppel aus dem Repo), 'halftone' (prozeduraler
     Rasterpunkt-Grund wie Boxel Blitz), 'url' (eigenes PNG, flach), 'gradient'. */
  function halftone() {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 576; const g = c.getContext('2d');
    const grd = g.createLinearGradient(0, 0, 0, 576); grd.addColorStop(0, '#5f9fb4'); grd.addColorStop(1, '#2c6b84');
    g.fillStyle = grd; g.fillRect(0, 0, 1024, 576);
    g.strokeStyle = 'rgba(210,235,240,0.35)'; g.lineWidth = 26; g.lineCap = 'round';
    for (let i = 0; i < 9; i++) { g.beginPath(); for (let x = -50; x <= 1080; x += 20) { const y = 40 + i * 64 + Math.sin(x / 120 + i * 1.7) * 26 + Math.sin(x / 47 + i) * 8; if (x === -50) g.moveTo(x, y); else g.lineTo(x, y); } g.stroke(); }
    g.fillStyle = 'rgba(20,50,70,0.55)';
    for (let y = 0; y < 576; y += 9) for (let x = (y / 9) % 2 ? 4 : 0; x < 1024; x += 9) { const r = 1.2 + 2.2 * (y / 576); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  let halftoneTex = null;
  function setBackground(mode, url) {
    if (mode === 'gradient') { scene.background = bgGrad; return log('background: gradient'); }
    if (mode === 'halftone') { scene.background = halftoneTex || (halftoneTex = halftone()); return log('background: halftone'); }
    if (mode === 'url' && url) { texLoader.load(url, (t) => { t.colorSpace = THREE.SRGBColorSpace; scene.background = t; log('background: url ' + url); }, undefined, () => log('background url failed: ' + url)); return; }
    if (skyTex) { scene.background = skyTex; return log('background: skydome'); }
    texLoader.load(SKY, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.mapping = THREE.EquirectangularReflectionMapping; skyTex = t; scene.background = t; log('skydome loaded'); }, undefined, () => log('skydome unreachable — gradient stays'));
  }
  if (o.sky !== false) setBackground(o.background || 'skydome', o.backgroundUrl);

  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.05, 120);
  camera.position.set(0, 1.4, 4.2);
  const controls = OrbitControls ? new OrbitControls(camera, canvas) : null;
  if (controls) { controls.enableDamping = true; controls.dampingFactor = 0.08; controls.target.set(0, 0.9, 0); controls.maxPolarAngle = Math.PI * 0.52; controls.zoomSpeed = 0.55; controls.rotateSpeed = 0.7; controls.minDistance = 1.2; controls.maxDistance = 60; controls.enablePan = false; }   // Georg 06.09.: »zu sensibel«

  const pmrem = new THREE.PMREMGenerator(renderer);
  if (RoomEnvironment) scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.06).texture;
  /* Licht aus stage.v1.js Z. 108–133: Key von oben-links, Schatten nach rechts-unten. */
  const key = new THREE.DirectionalLight(0xfff3dc, 1.55);
  key.position.set(-1.9, 7.2, 3.0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0005;
  key.shadow.radius = 4;
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 0.5, far: 24 });
  key.shadow.camera.updateProjectionMatrix();
  scene.add(key, key.target);
  const fill = new THREE.DirectionalLight(0xcfe0ff, 0.42); fill.position.set(4.2, 2.4, 3.0); scene.add(fill);
  scene.add(new THREE.AmbientLight(0xffffff, 0.22));

  /* Grund: Schattenfänger + leise Scheibe. Der Ring der Arena ersetzt ihn in CA-2. */
  const ground = new THREE.Group();
  const shadowCatcher = new THREE.Mesh(new THREE.CircleGeometry(6, 64), new THREE.ShadowMaterial({ opacity: 0.32 }));
  shadowCatcher.rotation.x = -Math.PI / 2; shadowCatcher.receiveShadow = true;
  const disc = new THREE.Mesh(new THREE.CircleGeometry(2.2, 64), new THREE.MeshStandardMaterial({ color: 0xe9dfc6, roughness: 0.96, metalness: 0 }));
  disc.rotation.x = -Math.PI / 2; disc.position.y = -0.004; disc.receiveShadow = true;
  ground.add(disc, shadowCatcher);
  scene.add(ground);

  /* Entgrauen 1:1 aus lighting.js Z. 37–52 — mit EINER benannten Abweichung: dort wird envMapIntensity
     auf 0 gesetzt, weil das Lab kein Umgebungsbild hatte. Dieser Wirt HAT eins (RoomEnvironment), und
     ohne Umgebungslicht las das Kanon-Gelb als Oliv (Georg 05.09.: »das gelb funktioniert nicht, egal
     welcher ton«) — die Lider des EyeRigs daneben, mit Umgebungslicht, waren heller als der Körper.
     Also bleibt die Umgebung an (0,8), und die Zahl steht hier. */
  function prepare(root) {
    let n = 0;
    root.traverse((m) => {
      if (!m.isMesh && !m.isSkinnedMesh) return;
      m.castShadow = true; m.receiveShadow = false;
      [].concat(m.material).forEach((mat) => {
        if (!mat) return;
        if (mat.metalness !== undefined && mat.metalness > 0) { mat.metalness = 0; n++; }
        mat.envMapIntensity = 0.3;   // kalibriert 06.09. (war 0,8): mit Linear-Tonemapping liest der Körper bei 0,3 als Kanon-Gelb
        if (mat.roughness !== undefined) mat.roughness = Math.min(1, Math.max(0.55, mat.roughness));
        mat.needsUpdate = true;
      });
    });
    log('degrayed: ' + n + ' materials');
    return n;
  }

  /* frameObject aus asset-lab-v4.js Z. 330–343, Kamera/Controls sind hier bekannt. */
  function frame(root, o2 = {}) {
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
    const d = Math.max(size.x, size.y, size.z) || 1;
    const dist = d * (o2.dist || 1.9);
    camera.position.set(center.x + dist * 0.75, center.y + d * 0.35, center.z + dist);
    if (controls) controls.target.copy(center);
    camera.near = Math.max(0.01, d / 100); camera.far = Math.max(60, d * 30);
    camera.updateProjectionMatrix();
    return { center, size: d };
  }

  /* Zeiger: normiert −1…1, für den Blick der Augen. */
  const pointer = { x: 0, y: 0, active: false, listeners: new Set(), on(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); } };
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    pointer.active = true;
    pointer.listeners.forEach((f) => f(pointer));
  });
  canvas.addEventListener('pointerleave', () => { pointer.active = false; });
  /* 360°-Kamera mit CURSOR-FOKUS-ZOOM (CA-2): OrbitControls zoomt auf sein Ziel; hier wandert das Ziel
     beim Hineinzoomen zum Punkt unter dem Zeiger (Schnitt mit der Bodenebene der aktuellen Etage).
     Herauszoomen lässt das Ziel stehen — sonst driftet die Szene. */
  const focus = { plane: new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), ray: new THREE.Raycaster(), hit: new THREE.Vector3(), setY(y) { this.plane.constant = -y; } };
  canvas.addEventListener('wheel', (e) => {
    if (!controls || e.deltaY >= 0) return;
    focus.ray.setFromCamera({ x: pointer.x, y: pointer.y }, camera);
    if (focus.ray.ray.intersectPlane(focus.plane, focus.hit)) controls.target.lerp(focus.hit, 0.07);   // war 0,18: das Ziel sprang unter dem Zeiger weg
  }, { passive: true });

  const rng = makeRng(o.seed || 20260905);
  const clock = { step: 1 / 60, t: 0, frames: 0, acc: 0, last: null, maxSteps: 5 };
  const assets = { RAW, raw: rawUrl, enc };
  const gltfLoader = GLTFLoader ? new GLTFLoader() : null;
  const modules = [];

  /** Ein Modul anmelden: Fähigkeiten prüfen, ctx NUR aus dem Deklarierten bauen. */
  async function register(mod, extra = {}) {
    const d = (mod.constructor.describe && mod.constructor.describe()) || {};
    const caps = d.capabilities || [];
    const missing = caps.filter((c) => !CAPABILITIES.includes(c.split(' ')[0]));
    if (missing.length) throw new Error('Modul verlangt Unbekanntes: ' + missing.join(', '));
    const ctx = {};
    const has = (c) => caps.some((x) => x.startsWith(c));
    if (has('three')) ctx.three = THREE;
    if (has('renderer')) ctx.renderer = renderer;
    if (has('clock')) ctx.clock = { step: clock.step, now: () => clock.t };
    if (has('rng')) ctx.rng = rng;
    if (has('assets')) { ctx.assets = assets; ctx.gltfLoader = gltfLoader; }
    if (has('pointer')) ctx.pointer = pointer;
    if (has('pets')) { ctx.eyeRigModule = extra.eyeRigModule || null; ctx.mouthModule = extra.mouthModule || null; }
    ctx.camera = camera; ctx.prepare = prepare; ctx.log = log;
    await mod.init(ctx);
    modules.push(mod);
    log('module registered: ' + (d.name || mod.constructor.name) + ' · ' + caps.join(' '));
    return mod;
  }
  function unregister(mod) { const i = modules.indexOf(mod); if (i >= 0) modules.splice(i, 1); }

  function resize() {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(2, Math.round(r.width)), h = Math.max(2, Math.round(r.height));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }

  /** Ein Bild: feste Schritte für die Module, dann rendern. Die Bildrate ist kein Zeitgeber. */
  function frameTick(nowMs) {
    if (clock.last == null) clock.last = nowMs;
    clock.acc += Math.min(0.25, (nowMs - clock.last) / 1000);
    clock.last = nowMs;
    let steps = 0;
    while (clock.acc >= clock.step && steps < clock.maxSteps) {
      for (const m of modules) if (m.update) m.update(clock.step, camera);
      clock.t += clock.step; clock.acc -= clock.step; steps++; clock.frames++;
    }
    if (steps === clock.maxSteps) clock.acc = 0;
    for (const m of modules) m.flushFrame?.();
    if (controls) controls.update();
    renderer.render(scene, camera);
  }

  function dispose() {
    for (const m of modules.slice()) { try { m.dispose(); } catch (e) {} }
    modules.length = 0;
    if (controls) controls.dispose();
    pmrem.dispose();
    renderer.dispose();
  }

  return { THREE, renderer, scene, camera, controls, key, ground, focus, setBackground, clock, rng, assets, pointer, gltfLoader, modules, prepare, frame, register, unregister, resize, frameTick, dispose, log, capabilities: CAPABILITIES.slice() };
}
