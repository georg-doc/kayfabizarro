/* KFB · SKY1 · Gate-Bank v2 (standalone). Ein Renderer, eine Scene, eine Schleife, EIN EnvironmentHost (v2). Gates tauschen nur die Bühnengruppe.
 * Neu gegen v1: E0 zeigt Donor | Knet-Kandidat (A/B, gleiche Kamera/Licht) · E2 mit Polkappen · E3 mit Familie v2 und v1 zum Vergleich · P Planeten-Inventar
 * · Himmelswolken (Clay-Feld um die Kamera) und Planeten in jeder Schale · Feldmessung v1 gegen v2 bei gleicher Kamera. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createEnvironmentHost, SHELL_LABEL } from './env-host.v2.js?r=2';
import * as CF1 from './cloud-family.v1.js';
import * as CF from './cloud-family.v2.js?r=3';
import { createSpindleSky, loadCards } from './spindle-sky.v2.js?r=2';
import { PLANETS, loadPlanet, clayGeometry } from './planets.v1.js';
import * as C from '../lab-clay/clay-material.v10.js';

const VIEWS = { front: [0, 0.04, 2.7], side: [2.7, 0.04, 0], tq: [1.9, 0.75, 1.9], top: [0, 2.7, 0.01], under: [0.01, -2.6, 0.01] };
const r2 = v => Math.round(v * 100) / 100;

export async function bootGates(box, { onState = () => {}, onNote = () => {} } = {}) {
  const canvas = document.createElement('canvas'); canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none'; box.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(1.5, devicePixelRatio || 1)); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.62;
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(32, 16 / 9, 0.05, 6000), controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.dampingFactor = 0.08;
  const ro = new ResizeObserver(() => { const w = canvas.clientWidth || 800, h = canvas.clientHeight || 450; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }); ro.observe(canvas);
  let clayU = null, clayP = null;
  const ensureClay = () => clayP || (clayP = CF.makeClayBase(THREE, renderer).then(u => (clayU = u)));
  const env = await createEnvironmentHost({ renderer, scene, camera, radius: 1400, minutes: 1.5, onNote, getClayU: ensureClay });
  const S = { gate: null, view: 'front', wire: false, lobes: false, aoOn: true, donor: null, family: null, family1: null, perf: { fps: 0, tris: 0, calls: 0 }, results: {}, spindleSee: 'wirbel', busy: '', notes: [],
    skyClouds: 0, planetMode: 'off', planetSet: 3, caps: true, planetInv: [] };
  let stage = null, cloudMat = null, fieldObj = null, skyField = null, raf = 0, last = performance.now(), frames = 0, fT = last, alive = true;
  const neutral = new THREE.MeshStandardMaterial({ color: '#ece7dc', roughness: 0.9, metalness: 0 }), wireMat = new THREE.MeshBasicMaterial({ color: '#1f2022', wireframe: true, transparent: true, opacity: 0.35 });
  const own = [];
  const clearStage = () => { if (fieldObj) { fieldObj.dispose(); fieldObj = null; } if (stage) { scene.remove(stage); stage = null; } while (own.length) own.pop().dispose(); };
  const note = t => { S.busy = t; onNote(t); };
  const setCam = (p, target = [0, 0.04, 0]) => { camera.position.set(...p); controls.target.set(...target); controls.update(); };
  const mk = (g, m) => { const o = new THREE.Mesh(g, m); o.frustumCulled = false; return o; };

  async function ensureDonor() { if (!S.donor) { note('Donor wird geladen und per SHA-1 geprüft …'); S.donor = await CF.loadDonor(THREE); } return S.donor; }
  async function ensureFamily(ao = 1) {
    if (!cloudMat) { note('Knete wird angerührt …'); await ensureClay(); cloudMat = CF.makeCloudMaterial(THREE, clayU); }
    const d = await ensureDonor();
    if (!S.family || S.family.ao !== ao) { note('Knetwolken werden geformt …'); await new Promise(r => setTimeout(r, 30)); if (S.family) S.family.dispose(); const t0 = performance.now(); S.family = CF.buildFamily(THREE, d.lobes, { count: 6, seed: 1, ao }); S.family.bakeMs = Math.round(performance.now() - t0); }
    return S.family;
  }
  async function ensureFamily1() { const d = await ensureDonor(); if (!S.family1) { note('v1 zum Vergleich …'); await new Promise(r => setTimeout(r, 30)); S.family1 = CF1.buildFamily(THREE, d.lobes, { count: 6, seed: 1, ao: 1 }); S.mat1 = CF1.makeCloudMaterial(THREE, clayU); } return S.family1; }

  async function setGate(g) {
    clearStage(); S.gate = g; stage = new THREE.Group(); stage.name = 'stage-' + g; scene.add(stage);
    try {
      if (g === 'E0') { await env.setShell('tiny'); const d = await ensureDonor(); await buildDonorView(d); setCam(VIEWS[S.view] || VIEWS.front); }
      else if (g === 'E1') { await env.setShell('travel'); camera.fov = 60; camera.updateProjectionMatrix(); setCam([0, 12, 60], [0, 40, -200]); }
      else if (g === 'E2') { note('sechs Karten werden gerendert …'); await env.setShell('spindle'); camera.fov = 46; camera.updateProjectionMatrix(); api.spindleView('front'); }
      else if (g === 'E3') { await env.setShell('tiny'); await buildSheet(); }
      else if (g === 'P') { await buildPlanetSheet(); }
    } catch (e) { S.notes.push(g + ': ' + e.message); console.error(e); }
    if (g !== 'E1' && g !== 'E2') { camera.fov = 32; camera.updateProjectionMatrix(); }
    await applySkyClouds(); note(''); push();
  }
  async function buildDonorView(d) {
    const F = await ensureFamily(S.aoOn ? 1 : 0), X = 0.62;
    const m = mk(d.geometry, neutral); m.name = 'donor-unchanged'; m.position.x = -X; stage.add(m);
    if (S.wire) { const w = mk(d.geometry, wireMat); w.position.x = -X; stage.add(w); }
    /* Kandidat: V0 = die größte Donor-Wolke als Knetstück; der Donor-Dreierpack bleibt links unverändert. Maßstab: V0 hat Breite 1, der Donor 0,888 — gleiche Breite der Quell-Wolke. */
    const v0 = F.variants[0], src = d.lobes.clouds[0], bx = [1e9, -1e9]; for (const k of src) { const l = d.lobes[k]; bx[0] = Math.min(bx[0], l.c[0] - l.half[0]); bx[1] = Math.max(bx[1], l.c[0] + l.half[0]); }
    const c = mk(v0.geom[0], cloudMat); c.name = 'clay-v2-V0'; c.position.x = X; c.scale.setScalar(Math.max(0.3, bx[1] - bx[0])); stage.add(c);
    if (S.wire) { const w = mk(v0.geom[0], wireMat); w.position.copy(c.position); w.scale.copy(c.scale); stage.add(w); }
    if (S.lobes) { const g = d.geometry.clone(), n = g.attributes.position.count, col = new Float32Array(n * 3), idx = g.index.array, c0 = new THREE.Color();
      const tri = (a, b, cc) => { const P = g.attributes.position, x = (P.getX(a) + P.getX(b) + P.getX(cc)) / 3, y = (P.getY(a) + P.getY(b) + P.getY(cc)) / 3, z = (P.getZ(a) + P.getZ(b) + P.getZ(cc)) / 3; let best = 0, bs = 1e9; for (const l of d.lobes) { let s = 0; for (let q = 0; q < 3; q++) { const dd = (x - l.c[0]) * l.ax[q][0] + (y - l.c[1]) * l.ax[q][1] + (z - l.c[2]) * l.ax[q][2]; s += (dd / l.half[q]) ** 2; } if (Math.abs(Math.sqrt(s) - 1) < bs) { bs = Math.abs(Math.sqrt(s) - 1); best = l.id; } } return best; };
      for (let i = 0; i < idx.length; i += 3) { const L = tri(idx[i], idx[i + 1], idx[i + 2]); c0.setHSL((L * 0.137) % 1, 0.55, 0.62); for (let v = 0; v < 3; v++) { col[idx[i + v] * 3] = c0.r; col[idx[i + v] * 3 + 1] = c0.g; col[idx[i + v] * 3 + 2] = c0.b; } }
      g.setAttribute('color', new THREE.BufferAttribute(col, 3)); own.push(g); const lm = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }); own.push(lm); const o = mk(g, lm); o.position.set(-X, -0.62, 0); stage.add(o); }
  }
  async function buildSheet() {
    const F = await ensureFamily(S.aoOn ? 1 : 0), F1 = await ensureFamily1(), d = S.donor, X = 1.5, y1 = 0.0, y2 = -1.55;
    const put = (g, m, x, y, s = 1, name = '') => { const o = mk(g, m); o.position.set(x, y, 0); o.scale.setScalar(s); o.name = name; stage.add(o); return o; };
    put(d.geometry, neutral, -3 * X, y1, 1, 'sheet-donor-unchanged');
    F.variants.forEach((v, i) => put(v.geom[0], cloudMat, (i - 2) * X, y1, 1, 'sheet-v2-' + i + '-near'));
    const v = F.variants[1]; [0, 1, 2].forEach(l => put(v.geom[l], cloudMat, (l - 3) * X, y2, 1, 'sheet-v2-1-lod' + l));
    put(d.geometry, neutral, 1 * X, y2, 1, 'sheet-donor-ref'); put(F1.variants[1].geom[0], S.mat1, 2 * X, y2, 1, 'sheet-v1-1-near'); put(F.variants[1].geom[0], cloudMat, 3 * X, y2, 1, 'sheet-v2-1-near-b');
    setCam([0, -0.7, 15.5], [0, -0.7, 0]);
  }
  async function buildPlanetSheet() {
    await env.setShell('tiny'); note('Planeten werden geladen (11 × gltf) …'); await ensureClay();
    const list = await Promise.all(PLANETS.map(p => loadPlanet(THREE, p.id).catch(e => ({ id: p.id, err: e.message }))));
    S.planetInv = list.map(P => P.err ? { id: P.id, err: P.err } : P.inv);
    const X = 1.15;
    list.forEach((P, i) => { if (P.err) return; const x = (i - 5) * X, s = 0.5 / P.inv.r;
      const a = mk(P.geometry, P.material); a.name = 'planet-src-' + P.id; a.position.set(x, 0.62, 0); a.scale.setScalar(s); stage.add(a);
      const U = { ...clayU, uClayHand: { value: 0.55 }, uClayTile: { value: 1.75 }, uClayPrintTile: { value: 4.9 } }, m = C.makeClayMaterial(THREE, U, { src: P.material, profile: 'nature' }); own.push(m);
      const b = mk(clayGeometry(THREE, P), m); b.name = 'planet-clay-' + P.id; b.position.set(x, -0.62, 0); b.scale.setScalar(s); stage.add(b);
      S.planetInv[i].clay = P.clayInfo; });
    setCam([0, 0, 12.5], [0, 0, 0]);
  }
  async function applySkyClouds() {
    if (skyField) { skyField.dispose(); skyField = null; }
    const n = S.skyClouds; if (!n || S.gate === 'E0' || S.gate === 'E3' || S.gate === 'P') return;
    const F = await ensureFamily(1), p = camera.position, R = env.radius * 0.1;
    if (!S.skyMat) { S.skyMat = CF.makeCloudMaterial(THREE, clayU); S.skyMat.fog = false; S.skyMat.name = 'kfb-cloud-clay-v2-sky'; }
    skyField = CF.createCloudField({ THREE, family: F, material: S.skyMat, parent: scene, lodAt: [5, 14] });
    skyField.set(CF.scatterClouds({ n, center: [p.x, p.y, p.z], radius: R * 1.6, rMin: 0.45, yRange: [R * 0.05, R * 0.6], scale: [R * 0.16, R * 0.32], seed: 7, spacing: 0.5 }));
  }

  function push() {
    const p = env.probe(), fam = f => f && { version: f.version, bakeMs: f.bakeMs, ao: f.ao, params: f.params, totals: f.totals, variants: f.variants.map(v => ({ id: v.id, lobes: v.lobes, tris: v.tris, grids: v.grids, soften: v.soften, width: r2(v.width), sx: r2(v.spec.sx), sy: r2(v.spec.sy), sz: r2(v.spec.sz), mirror: v.spec.mirror })) };
    onState({ gate: S.gate, probe: p, inventory: S.donor && S.donor.inventory, family: fam(S.family), perf: S.perf, results: S.results, notes: S.notes.slice(-4), busy: S.busy, view: S.view, wire: S.wire, lobes: S.lobes, aoOn: S.aoOn,
      skyClouds: S.skyClouds, planetMode: S.planetMode, planetSet: S.planetSet, caps: S.caps, planetInv: S.planetInv, skyField: skyField ? { n: skyField.count, lod: skyField.lodCounts.join('/'), ...skyField.last } : null });
  }
  const loop = () => {
    if (!alive) return; raf = requestAnimationFrame(loop); const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000); last = now;
    controls.update(); env.update(dt); if (fieldObj) fieldObj.update(camera); if (skyField) skyField.update(camera); if (cloudMat) cloudMat.color.copy(env.cloudColor); if (S.mat1) S.mat1.color.copy(env.cloudColor); if (S.skyMat) S.skyMat.color.copy(env.cloudColor);
    neutral.color.set('#ece7dc').multiply(env.cloudColor.clone().lerp(new THREE.Color(1, 1, 1), 0.5));
    renderer.render(scene, camera); env.after(); frames++;
    if (now - fT > 600) { S.perf = { fps: Math.round(frames * 1000 / (now - fT)), tris: renderer.info.render.triangles, calls: renderer.info.render.calls }; frames = 0; fT = now; push(); }
  };
  loop();

  const measure = async (fam, mat, counts, rows, label) => {
    for (const c of counts) {
      if (fieldObj) { fieldObj.dispose(); fieldObj = null; }
      if (c) { fieldObj = CF.createCloudField({ THREE, family: fam, material: mat, parent: stage }); fieldObj.set(CF.scatterClouds({ n: c, center: [0, 0, -2], radius: 11, yRange: [-0.5, 2.5], scale: [1.3, 2.3], seed: 5, spacing: 0.55 })); }
      for (let i = 0; i < 6; i++) { if (fieldObj) fieldObj.update(camera); renderer.render(scene, camera); }
      const gl = renderer.getContext(), t0 = performance.now(); let tris = 0, calls = 0; const N = 40;
      for (let i = 0; i < N; i++) { if (fieldObj) fieldObj.update(camera); renderer.render(scene, camera); tris = renderer.info.render.triangles; calls = renderer.info.render.calls; } gl.finish();
      rows.push({ fam: label, clouds: fieldObj ? fieldObj.count : 0, tris, calls, ms: r2((performance.now() - t0) / N), lod: fieldObj ? fieldObj.lodCounts.join('/') : '–' });
      await new Promise(r => setTimeout(r, 0));
    }
  };

  const api = {
    S, env, scene, camera, renderer, controls, setGate, push,
    get gate() { return S.gate; },
    view(n) { S.view = n; if (S.gate === 'E0' || S.gate === 'E3') { const v = VIEWS[n]; if (v) setCam(S.gate === 'E3' ? [v[0] * 5.8, v[1] * 5.8 - 0.7, v[2] * 5.8] : v, S.gate === 'E3' ? [0, -0.7, 0] : [0, 0.04, 0]); } else if (S.gate === 'E2') api.spindleView(n); push(); },
    async toggle(k) { S[k] = !S[k]; if (S.gate === 'E0' || S.gate === 'E3') await setGate(S.gate); else push(); },
    setTime: t => { env.setTime(t); push(); }, setWeather: w => { env.setWeather(w); push(); }, setMood: m => { env.setMood(m); push(); }, setAuto: m => env.setAutoMinutes(m),
    async setShell(s) { note('Schale ' + SHELL_LABEL[s] + ' …'); await env.setShell(s); await applySkyClouds(); note(''); push(); },
    async setSkyClouds(n) { S.skyClouds = n; note(n ? 'Himmelswolken ' + n + ' …' : ''); await applySkyClouds(); note(''); push(); },
    async setPlanets(mode, set) { S.planetMode = mode; if (set) S.planetSet = set; note(mode === 'off' ? '' : 'Planeten ' + mode + ' …'); await env.setPlanets(mode, S.planetSet); note(''); push(); },
    setCaps(on) { S.caps = !!on; env.setCaps(S.caps); push(); },
    travelVariant(v) { if (env.shell && env.shell.variant) env.shell.variant(v); push(); },
    spindleSee(v) { S.spindleSee = v; if (env.shell && env.shell.sp) env.shell.sp.setPreset({ see: v }); push(); },
    spindleView(n) {
      const sp = env.shell && env.shell.sp; if (!sp) return; const k = sp.group.scale.x;
      if (n === 'out') { sp.pinned = true; sp.group.position.set(0, 0, 0); camera.near = 1; camera.far = 6000; camera.updateProjectionMatrix(); setCam([0, 40 * k, 330 * k], [0, -5 * k, 0]); }
      else { sp.pinned = false; camera.near = 0.05; camera.updateProjectionMatrix(); const el = { front: -37, side: 0, tq: -37, top: 70, under: -72 }[n] ?? -37; setCam([0, 5.9 * k, 0], [0, 5.9 * k + Math.sin(el * Math.PI / 180) * 10 * k, -Math.cos(el * Math.PI / 180) * 10 * k]); }
    },
    async seamProbe() {
      await env.setShell('travel'); const dome = env.shell.dome; dome.setVariant('watercolor'); await new Promise(r => setTimeout(r, 1800));
      const out = {}; const cv = document.createElement('canvas'); cv.width = canvas.width; cv.height = canvas.height; const ctx = cv.getContext('2d', { willReadFrequently: true });
      for (const [name, yaw] of [['Vorwärts', 0], ['Naht (±90°)', Math.PI / 2], ['Rückwärts', Math.PI]]) {
        setCam([0, 12, 60], [Math.sin(yaw) * 100, 40, -Math.cos(yaw) * 100]); camera.fov = 60; camera.updateProjectionMatrix(); controls.update(); env.update(0.016); renderer.render(scene, camera);
        ctx.drawImage(canvas, 0, 0); const w = cv.width, h = cv.height, y0 = Math.floor(h * 0.35), hh = Math.floor(h * 0.3), px = ctx.getImageData(0, y0, w, hh).data; const colMean = x => { let s = 0; for (let y = 0; y < hh; y++) { const i = (y * w + x) * 4; s += px[i] + px[i + 1] + px[i + 2]; } return s / hh; };
        const d = []; for (let x = 1; x < w; x++) d.push(Math.abs(colMean(x) - colMean(x - 1))); const mid = d.slice(Math.floor(w * 0.48), Math.floor(w * 0.52)), med = d.slice().sort((a, b) => a - b)[Math.floor(d.length / 2)];
        out[name] = { mitte: r2(Math.max(...mid)), median: r2(med), maxGesamt: r2(Math.max(...d)) };
      }
      S.results.seam = out; setCam([0, 12, 60], [0, 40, -200]); push(); return out;
    },
    async lifecycle(n = 10) {
      note('Spindel-Lebenszyklus ×' + n); await env.setShell('tiny'); const cards = await loadCards({ onNote: note }), a = env.footprint(), rows = [];
      for (let i = 0; i < n; i++) { const sp = createSpindleSky({ THREE }); await sp.mount(scene, { cards, scale: 8 }); sp.update(1 / 60, { brightness: 1 }); renderer.render(scene, camera); const pr = sp.probe(); rows.push({ i: i + 1, ok: pr.tor.pass, text: pr.tor.text }); sp.dispose(); }
      await new Promise(r => setTimeout(r, 30)); const b = env.footprint(), d = Object.fromEntries(Object.keys(a).map(k => [k, (b[k] ?? 0) - (a[k] ?? 0)]));
      S.results.lifecycle = { cycles: n, before: a, after: b, delta: d, allPass: rows.every(r => r.ok), rows: rows.slice(0, 3).concat(rows.slice(-1)), ok: d.objects === 0 && d.materials === 0 && d.geometries === 0 && d.gpuGeoms === 0 && d.gpuTextures === 0 };
      note(''); push(); return S.results.lifecycle;
    },
    async leak(n = 10) { note('Schalen-Wechsel ×' + n); const r = await env.leakTest(n); S.results.leak = { ...r, perCycle: r.perCycle.slice(0, 2).concat(r.perCycle.slice(-1)) }; note(''); push(); return S.results.leak; },
    async fieldTest(counts = [0, 4, 12, 24]) {
      note('Feldmessung v1 / v2 …'); const sc = S.skyClouds; S.skyClouds = 0; await applySkyClouds();
      await env.setShell('tiny'); const F = await ensureFamily(1), F1 = await ensureFamily1(), rows = []; clearStage(); stage = new THREE.Group(); scene.add(stage);
      camera.fov = 40; camera.updateProjectionMatrix(); setCam([0, 3.5, 17], [0, 0.5, 0]);
      await measure(F1, S.mat1, counts, rows, 'v1 Hüllen'); await measure(F, cloudMat, counts.filter(c => c), rows, 'v2 Knetstück');
      const allNear = async (fam, mat, label) => { if (fieldObj) { fieldObj.dispose(); fieldObj = null; } fieldObj = CF.createCloudField({ THREE, family: fam, material: mat, parent: stage, lodAt: [1e9, 1e9] }); fieldObj.set(CF.scatterClouds({ n: 24, center: [0, 0, -2], radius: 11, yRange: [-0.5, 2.5], scale: [1.3, 2.3], seed: 5, spacing: 0.55 }));
        for (let i = 0; i < 6; i++) { fieldObj.update(camera); renderer.render(scene, camera); } const gl = renderer.getContext(), t0 = performance.now(); let tris = 0, calls = 0; for (let i = 0; i < 40; i++) { fieldObj.update(camera); renderer.render(scene, camera); tris = renderer.info.render.triangles; calls = renderer.info.render.calls; } gl.finish();
        rows.push({ fam: label, clouds: fieldObj.count, tris, calls, ms: r2((performance.now() - t0) / 40), lod: fieldObj.lodCounts.join('/') }); };
      await allNear(F1, S.mat1, 'v1 alle near'); await allNear(F, cloudMat, 'v2 alle near');
      S.results.field = rows; S.skyClouds = sc; note(''); push(); return rows;
    },
    dispose() { alive = false; cancelAnimationFrame(raf); clearStage(); if (skyField) skyField.dispose(); env.dispose(); if (S.family) S.family.dispose(); if (S.family1) S.family1.dispose(); neutral.dispose(); wireMat.dispose(); cloudMat && cloudMat.dispose(); S.mat1 && S.mat1.dispose(); S.skyMat && S.skyMat.dispose(); controls.dispose(); ro.disconnect(); renderer.dispose(); canvas.remove(); }
  };
  window.__sky1 = api; return api;
}
