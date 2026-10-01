/* KFB · SKY1 · Gate-Bank E0–E3 (standalone). Ein Renderer, eine Scene, eine Schleife, EIN EnvironmentHost. Gates tauschen nur die Bühnengruppe. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createEnvironmentHost, SHELL_LABEL } from './env-host.v1.js';
import * as CF from './cloud-family.v1.js';
import { createSpindleSky, loadCards } from './spindle-sky.v1.js';

const VIEWS = { front: [0, 0.04, 2.1], side: [2.1, 0.04, 0], tq: [1.5, 0.6, 1.5], top: [0, 2.1, 0.01], under: [0.01, -2.0, 0.01] };
const r2 = v => Math.round(v * 100) / 100;

export async function bootGates(box, { onState = () => {}, onNote = () => {} } = {}) {
  const canvas = document.createElement('canvas'); canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'; box.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(1.5, devicePixelRatio || 1)); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.62;
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(32, 16 / 9, 0.05, 6000), controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.dampingFactor = 0.08;
  const ro = new ResizeObserver(() => { const w = canvas.clientWidth || 800, h = canvas.clientHeight || 450; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }); ro.observe(canvas);
  const env = await createEnvironmentHost({ renderer, scene, camera, radius: 1400, minutes: 1.5, onNote });
  const S = { gate: null, view: 'front', wire: false, lobes: false, aoOn: true, notes: [], donor: null, family: null, field: null, perf: { fps: 0, tris: 0, calls: 0, ms: 0 }, results: {}, spindleSee: 'wirbel', busy: '' };
  let stage = null, clayU = null, cloudMat = null, fieldObj = null, raf = 0, last = performance.now(), frames = 0, fT = last, alive = true;
  const neutral = new THREE.MeshStandardMaterial({ color: '#ece7dc', roughness: 0.9, metalness: 0 }), wireMat = new THREE.MeshBasicMaterial({ color: '#1f2022', wireframe: true, transparent: true, opacity: 0.35 });
  const own = []; // Ressourcen der Bühne, die der Gate-Wechsel entsorgt
  const clearStage = () => { if (fieldObj) { fieldObj.dispose(); fieldObj = null; } if (stage) { scene.remove(stage); stage = null; } while (own.length) own.pop().dispose(); };
  const note = t => { S.busy = t; onNote(t); };
  const setCam = (p, target = [0, 0.04, 0]) => { camera.position.set(...p); controls.target.set(...target); controls.update(); };

  async function ensureDonor() { if (!S.donor) { note('Donor wird geladen und per SHA-1 geprüft …'); S.donor = await CF.loadDonor(THREE); } return S.donor; }
  async function ensureFamily(ao = 1) {
    if (!clayU) { note('Knete wird angerührt …'); clayU = await CF.makeClayBase(THREE, renderer); cloudMat = CF.makeCloudMaterial(THREE, clayU); }
    const d = await ensureDonor(); if (!S.family || S.family.ao !== ao) { if (S.family) S.family.dispose(); const t0 = performance.now(); S.family = CF.buildFamily(THREE, d.lobes, { count: 6, seed: 1, ao }); S.family.bakeMs = Math.round(performance.now() - t0); }
    return S.family;
  }
  const mk = (g, m) => { const o = new THREE.Mesh(g, m); o.frustumCulled = false; return o; };

  async function setGate(g) {
    clearStage(); S.gate = g; stage = new THREE.Group(); stage.name = 'stage-' + g; scene.add(stage);
    try {
      if (g === 'E0') { await env.setShell('tiny'); const d = await ensureDonor(); buildDonorView(d); setCam(VIEWS[S.view] || VIEWS.front); }
      else if (g === 'E1') { await env.setShell('travel'); setCam([0, 12, 60], [0, 40, -200]); camera.fov = 60; camera.updateProjectionMatrix(); }
      else if (g === 'E2') { note('sechs Karten werden gerendert …'); await env.setShell('spindle'); camera.fov = 46; camera.updateProjectionMatrix(); api.spindleView('front'); }
      else if (g === 'E3') { await env.setShell('tiny'); await buildSheet(); }
    } catch (e) { S.notes.push(g + ': ' + e.message); console.error(e); }
    if (g !== 'E1' && g !== 'E2') { camera.fov = 32; camera.updateProjectionMatrix(); } note(''); push();
  }
  function buildDonorView(d) {
    const m = mk(d.geometry, neutral); m.name = 'donor-unchanged'; stage.add(m);
    if (S.wire) stage.add(mk(d.geometry, wireMat));
    if (S.lobes) { const g = d.geometry.clone(), n = g.attributes.position.count, col = new Float32Array(n * 3), idx = g.index.array, key = i => Math.round(g.attributes.position.getX(i) * 5000) + ',' + Math.round(g.attributes.position.getY(i) * 5000) + ',' + Math.round(g.attributes.position.getZ(i) * 5000);
      const id = new Map(); d.lobes.forEach(l => id.set(l.id, l)); const c0 = new THREE.Color();
      /* Diagnose-Ansicht: Klon mit Lappenfarbe je Dreieck (Zuordnung über den Schwerpunkt des Dreiecks zum nächsten Lappen-Ellipsoid); der Donor selbst bleibt unverändert */
      const tri = (a, b, c) => { const x = (g.attributes.position.getX(a) + g.attributes.position.getX(b) + g.attributes.position.getX(c)) / 3, y = (g.attributes.position.getY(a) + g.attributes.position.getY(b) + g.attributes.position.getY(c)) / 3, z = (g.attributes.position.getZ(a) + g.attributes.position.getZ(b) + g.attributes.position.getZ(c)) / 3; let best = 0, bs = 1e9; for (const l of d.lobes) { let s = 0; for (let q = 0; q < 3; q++) { const dd = (x - l.c[0]) * l.ax[q][0] + (y - l.c[1]) * l.ax[q][1] + (z - l.c[2]) * l.ax[q][2]; s += (dd / l.half[q]) ** 2; } if (Math.abs(Math.sqrt(s) - 1) < bs) { bs = Math.abs(Math.sqrt(s) - 1); best = l.id; } } return best; };
      for (let i = 0; i < idx.length; i += 3) { const L = tri(idx[i], idx[i + 1], idx[i + 2]); c0.setHSL((L * 0.137) % 1, 0.55, 0.62); for (let v = 0; v < 3; v++) { col[idx[i + v] * 3] = c0.r; col[idx[i + v] * 3 + 1] = c0.g; col[idx[i + v] * 3 + 2] = c0.b; } }
      g.setAttribute('color', new THREE.BufferAttribute(col, 3)); own.push(g); const lm = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }); own.push(lm); const o = mk(g, lm); o.position.set(1.1, 0, 0); stage.add(o); }
  }
  async function buildSheet() {
    const F = await ensureFamily(S.aoOn ? 1 : 0), d = S.donor, X = 1.5, y1 = 0.0, y2 = -1.55;
    const put = (g, m, x, y, s = 1) => { const o = mk(g, m); o.position.set(x, y, 0); o.scale.setScalar(s); stage.add(o); return o; };
    put(d.geometry, neutral, -3 * X, y1).name = 'sheet-donor-unchanged';
    F.variants.forEach((v, i) => put(v.geom[0], cloudMat, (i - 2) * X, y1).name = 'sheet-v' + i + '-near');
    const v = F.variants[1]; [0, 1, 2].forEach(l => put(v.geom[l], cloudMat, (l - 1) * X - 3 * X + 3 * X, y2));
    put(d.geometry, neutral, 2 * X, y2).name = 'sheet-donor-ref'; put(F.variants[1].geom[0], cloudMat, 3 * X, y2);
    setCam([0, -0.7, 15.5], [0, -0.7, 0]);
  }

  function push() {
    const p = env.probe(); onState({ gate: S.gate, probe: p, inventory: S.donor && S.donor.inventory, family: S.family && { version: S.family.version, bakeMs: S.family.bakeMs, ao: S.family.ao, totals: S.family.totals, variants: S.family.variants.map(v => ({ id: v.id, lobes: v.lobes, tris: v.tris, soften: v.soften, width: r2(v.width), sx: r2(v.spec.sx), sy: r2(v.spec.sy), sz: r2(v.spec.sz), mirror: v.spec.mirror })) },
      perf: S.perf, results: S.results, notes: S.notes.slice(-4), busy: S.busy, view: S.view, wire: S.wire, lobes: S.lobes, aoOn: S.aoOn, foot: env.footprint() });
  }
  const loop = () => {
    if (!alive) return; raf = requestAnimationFrame(loop); const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000); last = now;
    controls.update(); env.update(dt); if (fieldObj) fieldObj.update(camera); if (cloudMat) cloudMat.color.copy(env.cloudColor);
    neutral.color.set('#ece7dc').multiply(env.cloudColor.clone().lerp(new THREE.Color(1, 1, 1), 0.5));
    renderer.render(scene, camera); env.after(); frames++;
    if (now - fT > 600) { S.perf = { fps: Math.round(frames * 1000 / (now - fT)), tris: renderer.info.render.triangles, calls: renderer.info.render.calls, ms: 0 }; frames = 0; fT = now; push(); }
  };
  loop();

  const api = {
    S, env, scene, camera, renderer, controls, setGate, push,
    get gate() { return S.gate; },
    view(n) { S.view = n; if (S.gate === 'E0' || S.gate === 'E3') { const v = VIEWS[n]; if (v) setCam(S.gate === 'E3' ? [v[0] * 7.4, v[1] * 7.4 - 0.7, v[2] * 7.4] : v, S.gate === 'E3' ? [0, -0.7, 0] : [0, 0.04, 0]); } else if (S.gate === 'E2') api.spindleView(n); push(); },
    async toggle(k) { S[k] = !S[k]; if (S.gate === 'E0' || S.gate === 'E3') await setGate(S.gate); else push(); },
    setTime: t => { env.setTime(t); push(); }, setWeather: w => { env.setWeather(w); push(); }, setMood: m => { env.setMood(m); push(); }, setAuto: m => env.setAutoMinutes(m),
    async setShell(s) { note('Schale ' + SHELL_LABEL[s] + ' …'); await env.setShell(s); note(''); push(); },
    travelVariant(v) { if (env.shell && env.shell.variant) env.shell.variant(v); push(); },
    spindleSee(v) { S.spindleSee = v; if (env.shell && env.shell.sp) env.shell.sp.setPreset({ see: v }); push(); },
    spindleView(n) {
      const sp = env.shell && env.shell.sp; if (!sp) return; const k = sp.group.scale.x;
      if (n === 'out') { sp.pinned = true; sp.group.position.set(0, 0, 0); camera.near = 1; camera.far = 6000; camera.updateProjectionMatrix(); setCam([0, 40 * k, 330 * k], [0, -5 * k, 0]); }
      else { sp.pinned = false; camera.near = 0.05; camera.updateProjectionMatrix(); const el = { front: -37, side: 0, tq: -37, top: 62, under: -70 }[n] ?? -37; setCam([0, 5.9 * k, 0], [Math.cos(el * Math.PI / 180) * 10 * k * (n === 'side' ? -1 : 0) , 5.9 * k + Math.sin(el * Math.PI / 180) * 10 * k, -Math.cos(el * Math.PI / 180) * 10 * k]); }
    },
    async seamProbe() {
      env.setShell && await env.setShell('travel'); const dome = env.shell.dome; dome.setVariant('watercolor'); await new Promise(r => setTimeout(r, 1800));
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
      await env.setShell('tiny'); const F = await ensureFamily(1), rows = []; clearStage(); stage = new THREE.Group(); scene.add(stage);
      camera.fov = 40; camera.updateProjectionMatrix(); setCam([0, 3.5, 17], [0, 0.5, 0]);
      for (const c of counts) {
        if (fieldObj) { fieldObj.dispose(); fieldObj = null; }
        if (c) { fieldObj = CF.createCloudField({ THREE, family: F, material: cloudMat, parent: stage }); fieldObj.set(CF.scatterClouds({ n: c, center: [0, 0, -2], radius: 11, yRange: [-0.5, 2.5], scale: [1.3, 2.3], seed: 5, spacing: 0.55 })); }
        for (let i = 0; i < 6; i++) { if (fieldObj) fieldObj.update(camera); renderer.render(scene, camera); }
        const gl = renderer.getContext(), t0 = performance.now(); let tris = 0, calls = 0; const N = 40;
        for (let i = 0; i < N; i++) { if (fieldObj) fieldObj.update(camera); renderer.render(scene, camera); tris = renderer.info.render.triangles; calls = renderer.info.render.calls; } gl.finish();
        const ms = (performance.now() - t0) / N, mats = new Set(); scene.traverse(o => o.material && [].concat(o.material).forEach(m => mats.add(m)));
        rows.push({ clouds: fieldObj ? fieldObj.count : 0, tris, calls, materials: mats.size, ms: r2(ms), lod: fieldObj ? fieldObj.lodCounts.join('/') : '–' });
      }
      if (fieldObj) { fieldObj.setLod([1e9, 1e9]); for (let i = 0; i < 6; i++) { fieldObj.update(camera); renderer.render(scene, camera); } const gl = renderer.getContext(), t0 = performance.now(); let tris = 0, calls = 0; for (let i = 0; i < 40; i++) { fieldObj.update(camera); renderer.render(scene, camera); tris = renderer.info.render.triangles; calls = renderer.info.render.calls; } gl.finish();
        rows.push({ clouds: fieldObj.count + ' (alle near)', tris, calls, materials: rows[rows.length - 1].materials, ms: r2((performance.now() - t0) / 40), lod: fieldObj.lodCounts.join('/') }); fieldObj.setLod([3.2, 9]); }
      S.results.field = rows; push(); return rows;
    },
    dispose() { alive = false; cancelAnimationFrame(raf); clearStage(); env.dispose(); if (S.family) S.family.dispose(); neutral.dispose(); wireMat.dispose(); cloudMat && cloudMat.dispose(); controls.dispose(); ro.disconnect(); renderer.dispose(); canvas.remove(); }
  };
  window.__sky1 = api; return api;
}
