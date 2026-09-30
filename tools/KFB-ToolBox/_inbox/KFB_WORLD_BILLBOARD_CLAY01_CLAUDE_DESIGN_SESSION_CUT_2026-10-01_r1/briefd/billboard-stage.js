// KFB Billboard Clay · Prüfstand (CD-ISLAND-BILLBOARD-CLAY-01)
// Insel: Geländeformeln, Straße und Biome wortgleich aus briefd/bench.js (gleicher Seed = gleiche Insel). Billboard: briefd/billboard-clay.js.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Billboard, BillboardScheduler, makeClayFamily, loadContent, resolveAnchor, SOURCE_COMMIT, CONTENT_PIN, LAYOUT, rng, ss } from './billboard-clay.js';

const BIOMES = [
  { name: 'Senf-Plateau', top: '#e9c14a', rock: '#a8643a', road: '#3a342a', accent: '#c2412c', paper: '#f3ead3' },
  { name: 'Moos-Insel', top: '#9aab62', rock: '#6f4e37', road: '#3a342a', accent: '#d97c3a', paper: '#ece1c0' },
  { name: 'Violett-Mesa', top: '#a48bb4', rock: '#6b4e7d', road: '#2c2733', accent: '#e9c14a', paper: '#f3ead3' },
  { name: 'Klinik-Riff', top: '#86b8b1', rock: '#3e6a83', road: '#2b3236', accent: '#a64670', paper: '#ece1c0' },
  { name: 'Heroic-Canyon', top: '#e3a066', rock: '#a64670', road: '#3a2a26', accent: '#4f8a85', paper: '#f3ead3' }
];
const R_ISLAND = 46, ROAD_W = 5, N_ROAD = 480;
const med = a => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const pct = (a, p) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };
const rd = (v, d = 1) => v == null || !isFinite(v) ? null : Math.round(v * 10 ** d) / 10 ** d;
const ORDER = ['O0', 'O5', 'I0', 'I3', 'O2', 'O7', 'I1', 'I4', 'O1', 'O6', 'I2', 'I5', 'O3', 'O8', 'O4', 'O9'];

function buildIsland(seed, fam) {
  const R = rng(seed), biome = BIOMES[Math.floor(R() * BIOMES.length)];
  const hills = Array.from({ length: 5 + Math.floor(R() * 4) }, () => { const a = R() * 6.283, d = R() * 38; return { x: Math.cos(a) * d, z: Math.sin(a) * d, s: 5 + R() * 9, h: 1.5 + R() * 6 }; });
  const phase = R() * 6.283, wob = 3 + R() * 3, lobes = 2 + Math.floor(R() * 3);
  const roadR = t => 25 + wob * Math.sin(lobes * t + phase);
  const rawH = (x, z) => { let h = 0; for (const k of hills) h += k.h * Math.exp(-((x - k.x) ** 2 + (z - k.z) ** 2) / (k.s * k.s)); return h + 0.6 * Math.sin(x * 0.23 + phase) * Math.cos(z * 0.19); };
  const roadY = new Float32Array(N_ROAD);
  { const tmp = []; for (let i = 0; i < N_ROAD; i++) { const t = i / N_ROAD * 6.283, r = roadR(t); tmp.push(rawH(Math.cos(t) * r, Math.sin(t) * r)); } for (let i = 0; i < N_ROAD; i++) { let s = 0; for (let k = -18; k <= 18; k++) s += tmp[(i + k + N_ROAD) % N_ROAD]; roadY[i] = s / 37; } }
  const roadYAt = t => { const f = ((t / 6.283) % 1 + 1) % 1 * N_ROAD, i = Math.floor(f), u = f - i; return roadY[i % N_ROAD] * (1 - u) + roadY[(i + 1) % N_ROAD] * u; };
  const H = (x, z) => { const rho = Math.hypot(x, z), t = Math.atan2(z, x), d = Math.abs(rho - roadR(t)); const w = ss(ROAD_W * 0.6, ROAD_W * 1.6, d); return (roadYAt(t) * (1 - w) + rawH(x, z) * w) * (1 - ss(R_ISLAND - 3, R_ISLAND, rho) * 0.5); };
  const root = new THREE.Group(), rings = 110, sec = 300, pos = [], idx = []; pos.push(0, H(0, 0), 0);
  for (let r = 1; r <= rings; r++) { const rho = R_ISLAND * r / rings; for (let s = 0; s < sec; s++) { const a = s / sec * 6.283; pos.push(Math.cos(a) * rho, H(Math.cos(a) * rho, Math.sin(a) * rho), Math.sin(a) * rho); } }
  for (let s = 0; s < sec; s++) idx.push(0, 1 + (s + 1) % sec, 1 + s);
  for (let r = 1; r < rings; r++) for (let s = 0; s < sec; s++) { const a = 1 + (r - 1) * sec + s, b = 1 + (r - 1) * sec + (s + 1) % sec, c = a + sec, d = b + sec; idx.push(a, b, c, b, d, c); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
  const top = new THREE.Mesh(geo, fam.std(biome.top)); top.receiveShadow = true; top.name = 'terrain'; root.add(top);
  const prof = []; for (let i = 0; i <= 14; i++) { const t = i / 14; prof.push(new THREE.Vector2(R_ISLAND * (1 - t) ** 1.4 * (1 + 0.04 * Math.sin(i * 2.1)), -t * 30 - 0.5)); }
  root.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 96), fam.std(biome.rock)));
  const rpos = [], ridx = [];
  for (let i = 0; i <= N_ROAD; i++) { const t = i / N_ROAD * 6.283, r = roadR(t), y = roadYAt(t) + 0.08; for (const o of [-ROAD_W / 2, ROAD_W / 2]) rpos.push(Math.cos(t) * (r + o), y, Math.sin(t) * (r + o)); if (i < N_ROAD) { const a = i * 2; ridx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } }
  const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(rpos, 3)); rg.setIndex(ridx); rg.computeVertexNormals();
  const road = new THREE.Mesh(rg, fam.std(biome.road, 0.93)); road.receiveShadow = true; root.add(road);
  for (const o of [-ROAD_W / 2 - 0.25, ROAD_W / 2 + 0.25]) { const c = new THREE.CatmullRomCurve3(Array.from({ length: 96 }, (_, i) => { const t = i / 96 * 6.283, r = roadR(t) + o; return new THREE.Vector3(Math.cos(t) * r, roadYAt(t) + 0.18, Math.sin(t) * r); }), true); root.add(new THREE.Mesh(new THREE.TubeGeometry(c, 400, 0.3, 8, true), fam.std(biome.accent))); }
  return { seed, biome, H, roadR, roadYAt, ROAD_W, R_ISLAND, root };
}

export async function boot(canvas, opt, emit) {
  const T0 = performance.now(), marks = {}, mark = k => { if (marks[k] == null) marks[k] = Math.round(performance.now() - T0); };
  const spec0 = await (await fetch(new URL('../billboard.embed-spec.v1.json', import.meta.url))).json(); mark('spec');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.info.autoReset = false;
  const gl = renderer.getContext(); let gpuName = '–'; try { const d = gl.getExtension('WEBGL_debug_renderer_info'); gpuName = d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER); } catch (e) {}
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy()), px1 = new Uint8Array(4), sync = () => gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px1);
  mark('renderer');
  try { await Promise.all(['KFBDisplay', 'KFBHand'].map(f => document.fonts.load('64px ' + f))); } catch (e) {}
  const pool = await loadContent(spec0.contentAsset); mark('content');

  const famT = makeClayFamily('T', { uClayNear: { value: 9 }, uClayFar: { value: 24 }, uClayScale: { value: 2.2 }, uClayAmt: { value: 0.55 } });
  const famB = makeClayFamily('B', { uClayNear: { value: spec0.lod.clay.nearM }, uClayFar: { value: spec0.lod.clay.farM }, uClayScale: { value: 2.6 }, uClayAmt: { value: 0.4 } });
  const bodyMat = famB.std('#ffffff', 0.88, { vertexColors: true });
  const isl = buildIsland(spec0.islandAnchor.islandSeed, famT), biome = isl.biome; mark('island');
  const neutral = { seed: 'neutral', biome, H: () => 0, roadR: () => 25, roadYAt: () => 0, ROAD_W, R_ISLAND };

  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(52, 1, 0.3, 900);
  scene.add(new THREE.HemisphereLight(0xfff4e0, 0x6b5a70, 1.25));
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.3); sun.position.set(52, 90, 40); scene.add(sun, sun.target);
  const SH = 64; Object.assign(sun.shadow.camera, { left: -SH, right: SH, top: SH, bottom: -SH, near: 1, far: 300 }); sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.mapSize.set(2048, 2048); sun.shadow.normalBias = 1.2 * (2 * SH / 2048); sun.shadow.bias = -0.0002; sun.castShadow = true;
  scene.add(isl.root);
  const nRoot = new THREE.Group(); { const disc = new THREE.Mesh(new THREE.CircleGeometry(44, 64).rotateX(-Math.PI / 2), famT.std('#ece1c0', 0.95)); disc.receiveShadow = true; nRoot.add(disc); } nRoot.visible = false; scene.add(nRoot);
  const bbRoot = new THREE.Group(); scene.add(bbRoot);
  const controls = new OrbitControls(camera, canvas); controls.enableDamping = false; controls.maxPolarAngle = Math.PI * 0.495; controls.minDistance = 2; controls.maxDistance = 420;
  const sched = new BillboardScheduler();

  let sceneName = 'island', bbs = [], count = 0, measuring = null, disposed = false, view = 'nah';
  const cur = () => sceneName === 'island' ? isl : neutral;
  function slotSpec(i) {
    const s = JSON.parse(JSON.stringify(spec0)); s.id = 'bb-' + String(i + 1).padStart(2, '0'); if (i > 0) s.seed = spec0.seed + '-' + i;
    if (sceneName === 'neutral') { s.islandAnchor = { mode: 'xz', x: 0, z: 0, yawDeg: 0, groundSnap: { mode: 'flat' } }; return s; }
    if (i > 0) { const k = ORDER[i], side = k[0] === 'O' ? 1 : -1, n = +k.slice(1); s.islandAnchor.side = side; s.islandAnchor.t = (side > 0 ? 0.03 + n * 0.1 : 0.07 + n / 6) % 1; s.islandAnchor.offsetFromKerb = side > 0 ? 9 : 8; }
    return s;
  }
  function rebuild(n) {
    const t0 = performance.now(); for (const b of bbs) b.dispose(); bbs = []; sched.clear();
    for (let i = 0; i < n; i++) { const b = new Billboard(slotSpec(i), { parent: bbRoot, island: cur(), pool, bodyMat, aniso }); bbs.push(b); sched.list.push(b); }
    count = n; sched.prime(performance.now()); renderOnce(performance.now()); sync(); return Math.round(performance.now() - t0);
  }
  const heroPose = () => resolveAnchor(slotSpec(0), cur());

  // ── Ansichten (relativ zur Pose des ersten Billboards) ───────────────────────────────────────────
  function viewFor(name) {
    const P = heroPose(), s = spec0.scale || 1, W = spec0.faceSize.w * s, Hh = spec0.faceSize.h * s, y = Math.sin(P.yaw), c = Math.cos(P.yaw);
    const O = new THREE.Vector3(P.x, P.y, P.z), n = new THREE.Vector3(y, 0, c), r = new THREE.Vector3(c, 0, -y), up = new THREE.Vector3(0, 1, 0), fc = O.clone().add(new THREE.Vector3(0, (LAYOUT.gb + spec0.faceSize.h / 2) * s, 0));
    const at = (...t) => { const v = O.clone(); for (const [k, m] of t) v.addScaledVector(k, m); return v; };
    const V = {
      nah: { pos: at([n, 17], [r, 4], [up, 3.2]), look: fc, fov: 52 },
      mittel: { pos: at([n, 44], [r, 16], [up, 11]), look: fc, fov: 52 },
      fern: { pos: at([n, 118], [r, 40], [up, 32]), look: new THREE.Vector3(O.x * 0.5, 4, O.z * 0.5), fov: 50 },
      rueck: { pos: at([n, -24], [r, -9], [up, 7.5]), look: fc, fov: 52 },
      boden: { pos: at([n, -7], [r, -7.5], [up, 1.9]), look: at([r, -W * 0.27], [n, LAYOUT.pz * s], [up, 0.6]), fov: 55 },
      schraeg: { pos: at([n, 25], [r, -19], [up, 6]), look: fc, fov: 50 },
      gesamt: { pos: new THREE.Vector3(0, 82, 118), look: new THREE.Vector3(0, 3, 0), fov: 52 }
    };
    if (name === 'ausricht') { const fov = 26, t = Math.tan(fov * Math.PI / 360), a = camera.aspect, d = Math.max((Hh / 2 + 0.8 * s) / t, (W / 2 + 0.8 * s) / (t * a)); return { pos: fc.clone().addScaledVector(n, d), look: fc, fov }; }
    return V[name] || V.nah;
  }
  function setView(name) { const v = viewFor(name); view = name; v.pos.y = Math.max(v.pos.y, cur().H(v.pos.x, v.pos.z) + (name === 'boden' ? 1.6 : 3)); camera.fov = v.fov; camera.updateProjectionMatrix(); camera.position.copy(v.pos); controls.target.copy(v.look); camera.lookAt(v.look); controls.update(); renderOnce(performance.now()); return name; }
  function setScene(name) { sceneName = name; isl.root.visible = name === 'island'; nRoot.visible = name === 'neutral'; scene.background = new THREE.Color(name === 'island' ? '#b9cfdc' : '#d8cfb6'); scene.fog = name === 'island' ? new THREE.Fog('#b9cfdc', 200, 560) : null; const n = name === 'neutral' ? 1 : count; const ms = rebuild(n); setView(view === 'gesamt' && name === 'neutral' ? 'schraeg' : view); return ms; }

  // ── Bild ─────────────────────────────────────────────────────────────────────────────────────────
  const samples = []; let lastRaf = 0, rafId = 0; const rafTicks = []; let frameNo = 0, pumped = 0; const errs = [];
  function renderOnce(now) { controls.update(); sched.tick(now, camera); renderer.info.reset(); renderer.render(scene, camera); }
  let prevT = 0;
  function frame(isRaf) {
    if (disposed || measuring) return; const now = performance.now(), t0 = now; renderOnce(now); const cpu = performance.now() - t0;
    samples.push({ at: now, raf: isRaf, interval: prevT ? now - prevT : 16.7, cpu, calls: renderer.info.render.calls, tris: renderer.info.render.triangles }); prevT = now; if (samples.length > 240) samples.shift(); frameNo++;
  }
  const raf = t => { if (disposed) return; lastRaf = performance.now(); rafTicks.push(lastRaf); while (rafTicks[0] < lastRaf - 1000) rafTicks.shift(); frame(true); rafId = requestAnimationFrame(raf); };
  rafId = requestAnimationFrame(raf);
  let lastPump = 0; const ch = new MessageChannel();
  ch.port1.onmessage = () => { if (disposed) return; const n = performance.now(); try { if (n - lastPump >= 16 && n - lastRaf > 120 && !measuring) { lastPump = n; pumped++; frame(false); } } catch (e) { errs.push(String(e.message || e).slice(0, 140)); } ch.port2.postMessage(0); };
  ch.port2.postMessage(0);
  const resize = () => { const w = canvas.clientWidth || 800, h = canvas.clientHeight || 500; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(() => { resize(); if (!measuring) renderOnce(performance.now()); }); ro.observe(canvas); resize();

  // ── Erstes Billboard und Startansicht ────────────────────────────────────────────────────────────
  const tB = performance.now(); const coldBuildMs = rebuild(1); mark('billboard'); marks.coldBuildMs = coldBuildMs; count = 1; setScene('island');

  // ── Prüfprotokoll ────────────────────────────────────────────────────────────────────────────────
  function checks() {
    const b = bbs[0]; if (!b) return null; b.group.updateMatrixWorld(true);
    const cw = (x, y) => new THREE.Vector3(x, y, 0).applyMatrix4(b.face.matrixWorld), c0 = cw(-b.W / 2, -b.H / 2), fw = c0.distanceTo(cw(b.W / 2, -b.H / 2)), fh = c0.distanceTo(cw(-b.W / 2, b.H / 2));
    const nrm = new THREE.Vector3(0, 0, 1).transformDirection(b.face.matrixWorld);
    const toward = sceneName === 'island' ? new THREE.Vector3(-b.pose.x, 0, -b.pose.z).normalize() : new THREE.Vector3(0, 0, 1);
    const geos = new Set(bbs.map(x => x.body.geometry.uuid)), mats = new Set(bbs.map(x => x.body.material.uuid));
    let bodyTris = 0; { const g = b.body.geometry; bodyTris = g.index ? g.index.count / 3 : g.attributes.position.count / 3; }
    return {
      faceWorld: [rd(fw, 3), rd(fh, 3)], faceAspect: rd(fw / fh, 4),
      canvasPx: [b.cv.width, b.cv.height], texelPerM: rd(b.cv.width / (b.W * b.s), 1), faceMaterial: 'MeshBasicMaterial · ungelit · toneMapped=false · kein Clay-Shader', faceSide: 'FrontSide (Rückseite zeigt Rückplatte)',
      frontDotInward: rd(nrm.dot(toward), 3), bodyTris: Math.round(bodyTris), bodiesShareGeometry: geos.size === 1, bodiesShareMaterial: mats.size === 1, bodies: bbs.length, ground: b.pose.ground, nudge: b.pose.nudge, colliders: b.group.userData.colliders.length, palette: b.pal.name, pose: { x: rd(b.pose.x, 2), y: rd(b.pose.y, 2), z: rd(b.pose.z, 2), yawDeg: rd(b.pose.yaw * 180 / Math.PI, 1) }
    };
  }
  const liveLine = () => { const S = samples.slice(-60), rs = S.filter(x => x.raf); return { fps: rs.length > 20 ? rd(1000 / med(rs.map(x => x.interval)), 0) : S.length > 20 ? rd(1000 / med(S.map(x => x.interval)), 0) : null, cpuMs: rd(med(S.map(x => x.cpu)), 2), calls: S.length ? S[S.length - 1].calls : null, tris: S.length ? S[S.length - 1].tris : null, visible: sched.visible, updPerS: sched.rate(), lods: { ...sched.lods } }; };

  // ── Messlauf: Baseline, 1, 4, 8, 16. Jede Stufe gleiche Kamerafahrt (Bildnummer → Winkel), GPU-synchron gemessen ──
  const table = {};
  const tick0 = () => new Promise(r => { const c = new MessageChannel(); c.port1.onmessage = () => { c.port1.close(); r(); }; c.port2.postMessage(0); });
  async function measureRow(n, path = 'orbit', N = 180, warm = 24) {
    const valid0 = document.visibilityState === 'visible'; if (!valid0) { N = 60; warm = 6; }
    measuring = { n, path, phase: 'bauen' }; push(); await tick0();
    const buildMs = rebuild(n), upd0 = sched.total, fr = [], vis = [], calls = [], tris = [], pos = new THREE.Vector3(), look = new THREE.Vector3(0, 6, 0);
    camera.fov = 52; camera.updateProjectionMatrix(); controls.enabled = false;
    measuring.phase = 'messen'; const w0 = performance.now(); let updStart = 0;
    for (let i = -warm; i < N; i++) {
      const a = Math.max(0, i) / N * Math.PI * 2;
      if (path === 'drive') { const ra = isl.roadR(a), rb = isl.roadR(a + 0.14); camera.fov = 62; camera.updateProjectionMatrix(); camera.position.set(Math.cos(a) * ra, isl.roadYAt(a) + 2.6, Math.sin(a) * ra); look.set(Math.cos(a + 0.14) * rb, isl.roadYAt(a + 0.14) + 4.5, Math.sin(a + 0.14) * rb); camera.lookAt(look); }
      else { camera.position.set(Math.sin(a) * 82, 34, Math.cos(a) * 82); look.set(0, 6, 0); camera.lookAt(look); }
      if (i === 0) { updStart = sched.total; var wStart = performance.now(); }
      const t0 = performance.now(); sched.tick(t0, camera); renderer.info.reset(); renderer.render(scene, camera); sync(); const dt = performance.now() - t0;
      if (i >= 0) { fr.push(dt); vis.push(sched.visible); calls.push(renderer.info.render.calls); tris.push(renderer.info.render.triangles); }
      if (i % 12 === 0) await tick0();
    }
    const wall = (performance.now() - wStart) / 1000, upd = sched.total - updStart;
    controls.enabled = true;
    const row = { n, path, timingValid: valid0 && document.visibilityState === 'visible', buildMs, medFps: rd(1000 / med(fr), 1), medMs: rd(med(fr), 2), p95Ms: rd(pct(fr, 0.95), 2), calls: rd(med(calls), 0), tris: rd(med(tris), 0), texMB: rd(bbs.reduce((u, b) => u + b.texBytes, 0) / 1048576, 1), texObjs: renderer.info.memory.textures, geos: renderer.info.memory.geometries, progs: renderer.info.programs ? renderer.info.programs.length : null, visMean: rd(vis.reduce((u, v) => u + v, 0) / vis.length, 1), visMax: Math.max(...vis), updPerS: rd(upd / wall, 1), frames: N, wallS: rd(wall, 1) };
    table[path + n] = row; measuring = null; setView(view); push(); return row;
  }
  let queue = Promise.resolve(); const enqueue = f => (queue = queue.then(f).catch(e => { console.error(e); measuring = null; errs.push(String(e.message || e)); push(); }));
  function measureAll(counts = [0, 1, 4, 8, 16]) { return enqueue(async () => { const keep = sceneName; if (keep !== 'island') setScene('island'); for (const k of Object.keys(table)) delete table[k]; await measureRow(1, 'orbit', 30, 6); delete table.orbit1; for (const path of ['orbit', 'drive']) for (const n of counts) await measureRow(n, path); rebuild(Math.max(1, count)); if (keep !== 'island') setScene(keep); }); }
  function setCount(n) { return enqueue(async () => { if (sceneName === 'neutral') n = 1; rebuild(n); push(); }); }

  function snapshot() {
    return { ready: true, marks, gpu: gpuName, dpr: renderer.getPixelRatio(), canvas: canvas.clientWidth + '×' + canvas.clientHeight, scene: sceneName, view, count, biome: biome.name, seed: isl.seed, live: liveLine(), checks: checks(), table, measuring, pool: { ok: pool.imgs.map(x => ({ path: x.path, origin: x.origin, w: x.w, h: x.h })), skipped: pool.skipped, ms: pool.ms }, errs: [...errs], rafHz: rafTicks.length, pumped, spec: spec0 };
  }
  function push() { emit(snapshot()); }
  const ev = setInterval(push, 500); push();
  return {
    setScene: n => enqueue(async () => { setScene(n); push(); }), setCount, setView: n => { setView(n); push(); }, measureAll, snapshot, get spec() { return spec0; }, get bbs() { return bbs; }, THREE, camera, renderer, scene, sched, controls,
    get results() { return { schema: 'kfb.billboard-bench/v1', job: 'CD-ISLAND-BILLBOARD-CLAY-01', sourceCommit: SOURCE_COMMIT, contentPin: CONTENT_PIN, island: { seed: isl.seed, biome: biome.name }, gpu: gpuName, dpr: renderer.getPixelRatio(), canvas: canvas.clientWidth + '×' + canvas.clientHeight, method: 'GPU-synchron (readPixels-Sync je Bild), 180 Bilder je Stufe (bei verborgenem Tab 60, Zeiten dann ungültig), identische Kamerafahrt je Pfad (orbit = Kreis um die Insel, r 82 m; drive = Fahrt auf der Straße, Blick voraus), 24 Aufwärmbilder', marks, rows: Object.values(table), checks: checks(), at: new Date().toISOString() }; },
    dispose() { disposed = true; cancelAnimationFrame(rafId); clearInterval(ev); ro.disconnect(); ch.port1.onmessage = null; controls.dispose(); renderer.dispose(); }
  };
}
