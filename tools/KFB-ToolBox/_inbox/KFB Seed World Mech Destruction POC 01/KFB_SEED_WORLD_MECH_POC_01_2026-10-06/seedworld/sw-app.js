/* KFB Seed World · POC 01 · playground host: renderer, loop, metrics, source gates, checks, bench
   RESEARCH PLAYGROUND · NOT WORLD STUDIO · NOT COMBAT ARENA */

import * as THREE from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { createGen, hash32, CHUNK, GEN_VERSION } from './sw-gen.js';
import { cellsFor, shell, GB, proto } from './sw-mesh.js';
import { createWorld, clayMaterial, geomFrom, RINGS, CLAY_TEX, MAX_PER_FRAME } from './sw-world.js';
import { createDestruct, CAPS, pack2 } from './sw-destruct.js';
import { loadSources, createMech, SOURCES, GUN_SRC, WCAPS, LOCO } from './sw-mech.js';

export async function mount(host, opts = {}) {
  const status = (s) => opts.onStatus && opts.onStatus(s);
  let seed = (opts.seed ?? 20261005) >>> 0;
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!opts.capture });
  renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.05; renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.info.autoReset = false;
  host.appendChild(renderer.domElement); const canvas = renderer.domElement; canvas.style.display = 'block'; canvas.tabIndex = 0;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, 1, 0.15, 900);
  const hemi = new THREE.HemisphereLight('#e8eef2', '#8a7a60', 1.15), sun = new THREE.DirectionalLight('#fff1d6', 2.5);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -95, right: 95, top: 95, bottom: -95, near: 1, far: 420 }); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.6;
  scene.add(hemi, sun, sun.target);
  const material = clayMaterial(); material.userData.load().then((ok) => status(ok ? null : 'clay microtexture did not load (vertex colour only)'));
  const world = createWorld({ scene, seed, material, budgetMs: opts.budgetMs ?? 4 });
  const destruct = createDestruct({ scene, world, material, winGeo: geomFrom(proto('win')), doorGeo: geomFrom(proto('door')) });
  function applyType() { const T = world.gen.type; scene.background = new THREE.Color(T.sky); scene.fog = new THREE.Fog(T.fog, 170, 430); }
  applyType();

  /* ---------- mech (both real sources) ---------- */
  status('loading Combat Mech sources …');
  const assets = await loadSources((n) => status('loaded ' + n));
  if (assets.errors.length) status('source errors: ' + assets.errors.join(' · '));
  let flightState = {};
  const hooks = {
    raycast: (o, d, far) => destruct.raycast(o, d, far),
    bullet: (h, o, d) => destruct.bullet(h, o, d),
    rocket: (p, d) => destruct.rocket(p, d),
    trail: (p, big) => destruct.trail(p, big), muzzle: (p) => destruct.muzzle(p),
    ground: (x, z) => world.groundAt(x, z),
    collide: (p, r) => world.collideSphere(p, r).add(destruct.collideSphere(p, r)),
    shake: () => destruct.shake
  };
  const mech = createMech({ scene, camera, canvas, assets, hooks, height: opts.mechHeight ?? 2.6, onState: (s) => { flightState = s; opts.onFlight && opts.onFlight(s); } });
  if (opts.source && mech.actors[opts.source]) mech.useSource(opts.source);
  // warm every shader variant once (cells, debris, FX, both mechs) so the first rocket does not stall on compilation
  try { for (const m of destruct.meshes) m.count = 1; for (const a of Object.values(mech.actors)) a.holder.visible = true; await renderer.compileAsync(scene, camera); } catch (e) { /* older drivers: compile lazily */ }
  for (const m of destruct.meshes) m.count = 0; for (const a of Object.values(mech.actors)) a.holder.visible = false;
  status(null);

  /* ---------- loop ---------- */
  let orbit = 0, raf = 0, last = performance.now(), ft = 16, frameNo = 0, perfOn = opts.perfOn ?? true, gatesOn = false, lastPerf = 0, disposed = false;
  const frameWaiters = [], frameLog = [];
  const frustum = new THREE.Frustum(), PM = new THREE.Matrix4();
  function resize() { const w = host.clientWidth || 1, h = host.clientHeight || 1; renderer.setSize(w, h, false); canvas.style.width = w + 'px'; canvas.style.height = h + 'px'; camera.aspect = w / h; camera.updateProjectionMatrix(); }
  const ro = new ResizeObserver(resize); ro.observe(host); resize();
  function focus() { return mech.active ? mech.position : new THREE.Vector3(Math.sin(orbit) * 40, 0, Math.cos(orbit) * 40); }
  let tickTok = 0, rft = 16, lastReal = performance.now();
  function schedule() { const my = ++tickTok; raf = requestAnimationFrame(() => { if (my === tickTok) frame(); }); setTimeout(() => { if (my === tickTok) frame(); }, 80); }
  function frame(fixed) {
    if (disposed) return;
    if (!fixed) schedule();
    const now = performance.now(), real = fixed ? 1 / 60 : Math.min(0.05, (now - last) / 1000); ft = ft * 0.9 + (now - last) * 0.1; if (!fixed) { rft = rft * 0.8 + (now - lastReal) * 0.2; lastReal = now; } last = now; frameNo++;
    const dt = real * (destruct.hitStop > 0 ? 0.08 : 1);
    if (!mech.active && !bench.running) {
      orbit += real * 0.05;
      const cx = Math.sin(orbit) * 40, cz = Math.cos(orbit) * 40, g = world.groundAt(cx, cz);
      camera.position.set(cx + Math.sin(orbit + 2.2) * 165, g + 105, cz + Math.cos(orbit + 2.2) * 165); camera.lookAt(cx, g + 8, cz);
    }
    mech.tick(dt);
    const f = focus(); world.update(f.x, f.z);
    destruct.update(dt, mech.active ? mech.position : null);
    sun.position.set(f.x + 90, f.y + 160, f.z + 60); sun.target.position.set(f.x, f.y, f.z);
    renderer.info.reset();
    if (gatesOn) gates.render(real); else renderer.render(scene, camera);
    frameLog.push(now - (frameLog.t || now)); frameLog.t = now; if (frameLog.length > 600) frameLog.shift();
    if (bench.running) bench.sample(now);
    while (frameWaiters.length && frameWaiters[0].n <= frameNo) frameWaiters.shift().res();
    if (now - lastPerf > 250) { lastPerf = now; opts.onPerf && opts.onPerf(perf()); }
  }
  const yieldMC = () => new Promise((r) => { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); });
  async function pump(ms = 1000) { const end = performance.now() + ms; while (performance.now() < end && !disposed) { frame(true); await yieldMC(); } }
  const throttled = () => rft > 150 || document.hidden;
  const frames = async (n = 1) => { if (throttled()) { for (let i = 0; i < n; i++) { frame(true); await yieldMC(); } return; } return new Promise((res) => { frameWaiters.push({ n: frameNo + n, res }); frameWaiters.sort((a, b) => a.n - b.n); }); };
  function perf() {
    PM.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse); frustum.setFromProjectionMatrix(PM);
    const wi = world.info(frustum), ds = destruct.stats, ws = world.stats;
    const vfx = ds.chips + ds.dust + ds.fire, vfxMax = CAPS.chips + CAPS.dust + CAPS.fire;
    return {
      fps: Math.round(1000 / ft), ms: ft, calls: renderer.info.render.calls, tris: renderer.info.render.triangles,
      chunks: wi.active, visible: wi.visible, near: wi.near, queued: wi.queued + wi.jobs,
      promoted: ds.promoted, promotedMax: CAPS.promoted, debris: ds.debris, debrisMax: CAPS.debris, rubble: ds.rubble, rubbleMax: CAPS.rubble,
      proj: mech.roundsActive() + mech.rocketsActive(), projMax: WCAPS.rounds + WCAPS.rockets, vfx, vfxMax,
      genMs: ws.genMs, integMs: ws.integMs, integFrame: ws.integMaxFrame, maxPerFrame: ws.maxPerFrame, worker: ws.worker,
      seed, type: world.gen.type.name, typeNote: world.gen.type.note, source: mech.source, rocketMode: mech.rocketMode, active: mech.active, stored: world.damage.size,
      peaks: { debris: ds.debrisPeak, vfx: ds.vfxPeak, promoted: ds.promotedPeak, rounds: mech.stats.roundsPeak, rockets: mech.stats.rocketsPeak, cascades: ds.cascades, cellsLost: ds.cellsLost, reconstructed: ds.reconstructed }
    };
  }

  function startPoint() { const g = world.groundAt(6, 34); return new THREE.Vector3(6, g + 16, 34); }
  function fly() { canvas.focus(); mech.start(startPoint(), 0); }
  function regenerate(newSeed) {
    if (newSeed !== undefined) seed = newSeed >>> 0;
    destruct.reset(); world.regenerate(seed); applyType(); gates.reset();
    if (mech.active) mech.script.teleport(startPoint(), 0);
    opts.onPerf && opts.onPerf(perf());
  }
  const onKey = (e) => {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.type !== 'keydown') return;
    if (e.code === 'F1' || e.code === 'Backquote') { e.preventDefault(); perfOn = !perfOn; opts.onPerfToggle && opts.onPerfToggle(perfOn); }
    else if (e.code === 'KeyR' && !e.metaKey && !e.ctrlKey) regenerate();
    else if (e.code === 'KeyN' && !e.metaKey && !e.ctrlKey) regenerate((Math.random() * 1e9) >>> 0);
    else if (e.code === 'KeyM') { mech.useSource(mech.source === 'flight' ? 'atlas' : 'flight'); }
    else if (e.code === 'KeyG') { gatesOn = !gatesOn; opts.onGates && opts.onGates(gatesOn ? gates.labels() : null); }
    else if (e.code === 'Enter' && !mech.active) fly();
    else if (e.code === 'KeyT' && !mech.active) mech.toggleRockets();
  };
  window.addEventListener('keydown', onKey);

  /* ---------- source-isolation gates (§27) ---------- */
  const gates = (() => {
    let built = null; const spin = { a: 0 };
    function sample() {
      const g = world.gen; for (const [cx, cz] of [[0, 0], [-1, 0], [0, -1], [-1, -1], [1, 0], [0, 1]]) { const r = g.chunkRecipe(cx, cz).buildings.filter((b) => b.floors >= 3 && b.sides[0].bays >= 3).sort((a, b) => (b.roof.h > 0) - (a.roof.h > 0) || Math.abs(b.deform.twist) - Math.abs(a.deform.twist))[0]; if (r) return r; }
      return g.chunkRecipe(0, 0).buildings[0];
    }
    function stage(obj, label, src) {
      const s = new THREE.Scene(); s.background = new THREE.Color('#1b1822');
      s.add(new THREE.HemisphereLight('#ffffff', '#5a5060', 1.4)); const d = new THREE.DirectionalLight('#fff4e0', 2.2); d.position.set(4, 8, 6); s.add(d);
      s.add(obj); obj.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(obj), c = box.getCenter(new THREE.Vector3()), sz = box.getSize(new THREE.Vector3()), r = Math.max(sz.x, sz.y, sz.z) * 0.95 + 0.2;
      const disc = new THREE.Mesh(new THREE.CircleGeometry(r * 1.1, 48).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#2a2633', roughness: 1 })); disc.position.set(c.x, box.min.y - 0.01, c.z); s.add(disc);
      const cam = new THREE.PerspectiveCamera(35, 1, 0.05, 400);
      return { s, cam, c, r, label, src, obj };
    }
    function build() {
      const st = [];
      if (assets.atlas) { const o = SkeletonUtils.clone(assets.atlas.gltf.scene); st.push(stage(o, '1 · CombatMech.glb · unchanged bind pose', SOURCES.atlas.mech.path.split('/').pop() + ' @ ' + SOURCES.atlas.mech.commit.slice(0, 8))); }
      else st.push(stage(new THREE.Group(), '1 · CombatMech.glb · NOT LOADED', ''));
      const gun = assets.gun.scene.clone(true); st.push(stage(gun, '2 · CombatMech_Minigun.gltf · unchanged', 'CombatMech_Minigun.gltf @ ' + GUN_SRC.commit.slice(0, 8)));
      const b0 = assets.gun.scene.getObjectByName('CombatMech_Minigun_Barrel'); const bar = b0 ? b0.clone(true) : new THREE.Group(); bar.position.set(0, 0, 0); const holder = new THREE.Group(); holder.add(bar);
      const g3 = stage(holder, '3 · CombatMech_Minigun_Barrel · isolated, spinning', b0 ? 'node CombatMech_Minigun_Barrel · axis z' : 'barrel node missing'); g3.barrel = bar; st.push(g3);
      const rec = sample(), local = (r) => { const o = { ...r, baseY: 0 }; return o; };
      const plain = { ...local(rec), deform: { twist: 0, lean: [0, 0], wob: 0, ph: 0 } };
      const instOf = () => ({ win: { m: [], c: [] }, door: { m: [], c: [] }, chim: { m: [], c: [] } });
      const instGroup = (inst, mat, offs) => { const grp = new THREE.Group(); for (const k of ['win', 'door', 'chim']) { const l = inst[k], n = l.c.length / 3; if (!n) continue; const im = new THREE.InstancedMesh(world.protos[k], mat, n); im.instanceMatrix = new THREE.InstancedBufferAttribute(new Float32Array(l.m), 16); im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(l.c), 3); im.count = n; im.frustumCulled = false; grp.add(im); } grp.position.copy(offs); return grp; };
      const gp = new GB(), iP = instOf(); shell(gp, plain, 0, iP);
      const ga = gp.arrays(), geoP = geomFrom(ga); geoP.deleteAttribute('color');
      const plainMat = new THREE.MeshStandardMaterial({ color: '#b9b4ac', roughness: 0.9, side: THREE.DoubleSide });
      const mP = new THREE.Mesh(geoP, plainMat); const offs = new THREE.Vector3(-rec.centroid[0], 0, -rec.centroid[1]); mP.position.copy(offs);
      const w4 = new THREE.Group(); w4.add(mP, instGroup(iP, new THREE.MeshStandardMaterial({ color: '#8d877f', roughness: 0.9 }), offs)); st.push(stage(w4, '4 · plain procedural shell (grammar only)', rec.id.split('/').pop()));
      const gk = new GB(), iK = instOf(); shell(gk, local(rec), 0, iK); const mK = new THREE.Mesh(geomFrom(gk.arrays()), material); mK.position.copy(offs);
      const w5 = new THREE.Group(); w5.add(mK, instGroup(iK, material, offs)); st.push(stage(w5, '5 · same recipe · KFB clay + grotesque torsion', 'twist ' + rec.deform.twist.toFixed(1) + '° · shared clay material'));
      const cells = cellsFor(local(rec)), gc = new GB(), [cx, cz] = rec.centroid;
      for (const c of cells) { const k = 1.05; const p = [cx + (c.p[0] - cx) * k, c.p[1] * 1.03, cz + (c.p[2] - cz) * k]; const col = c.kind === 'corner' ? [0.25, 0.22, 0.3] : c.kind === 'slab' ? [0.5, 0.48, 0.45] : c.col; gc.box(p, c.X, c.Y, c.Z, [c.s[0] * 0.94, c.s[1] * 0.94, c.s[2] * 0.94], col); }
      const mC = new THREE.Mesh(geomFrom(gc.arrays()), material); mC.position.copy(offs);
      const w6 = new THREE.Group(); w6.add(mC); st.push(stage(w6, '6 · same recipe · destructible-local cells', cells.length + ' cells · ' + cells.filter((c) => c.kind === 'wall').length + ' wall · ' + cells.filter((c) => c.kind === 'roof').length + ' roof'));
      built = { st, rec };
    }
    function render(dt) {
      if (!built) build();
      spin.a += dt;
      const w = canvas.width, h = canvas.height, cols = 3, rows = 2, cw = Math.floor(w / cols), ch = Math.floor(h / rows);
      renderer.setScissorTest(true);
      built.st.forEach((g, i) => {
        const x = (i % cols) * cw, y = h - (Math.floor(i / cols) + 1) * ch;
        renderer.setViewport(x / renderer.getPixelRatio(), y / renderer.getPixelRatio(), cw / renderer.getPixelRatio(), ch / renderer.getPixelRatio());
        renderer.setScissor(x / renderer.getPixelRatio(), y / renderer.getPixelRatio(), cw / renderer.getPixelRatio(), ch / renderer.getPixelRatio());
        const a = spin.a * 0.35 + i; g.cam.aspect = cw / ch; g.cam.updateProjectionMatrix();
        const dist = g.r / Math.tan((g.cam.fov * Math.PI) / 360) * 1.05;
        g.cam.position.set(g.c.x + Math.sin(a) * dist, g.c.y + dist * 0.35, g.c.z + Math.cos(a) * dist); g.cam.lookAt(g.c);
        if (g.barrel) g.barrel.rotation.z = spin.a * 2.4 * Math.PI * 2;
        renderer.render(g.s, g.cam);
      });
      renderer.setScissorTest(false); renderer.setViewport(0, 0, w / renderer.getPixelRatio(), h / renderer.getPixelRatio());
    }
    return { render, labels: () => { if (!built) build(); return built.st.map((g) => ({ label: g.label, src: g.src })); }, reset: () => { built = null; } };
  })();

  /* ---------- automated checks (§29) ---------- */
  function targetBuilding(minFloors = 2) {
    const c = world.chunks.get(world.key(0, 0)) || [...world.chunks.values()].find((x) => x.lod === 0);
    const list = [...world.chunks.values()].filter((x) => x.lod === 0).flatMap((x) => x.blds.map((b) => b.rec)).filter((r) => r.floors >= minFloors && !world.damage.has(r.id));
    list.sort((a, b) => Math.hypot(a.centroid[0], a.centroid[1]) - Math.hypot(b.centroid[0], b.centroid[1]));
    void c; return list[0];
  }
  function viewpoint(rec, back = 26) {
    const [c0, c1] = rec.corners, [cx, cz] = rec.centroid, mx = (c0[0] + c1[0]) / 2, mz = (c0[1] + c1[1]) / 2, l = Math.hypot(mx - cx, mz - cz) || 1;
    const x = cx + ((mx - cx) / l) * back, z = cz + ((mz - cz) / l) * back;
    return { p: new THREE.Vector3(x, world.groundAt(x, z) + 5, z), aim: new THREE.Vector3(mx, rec.baseY + Math.min(rec.height * 0.5, 5), mz), yaw: Math.atan2(-(cx - x), -(cz - z)) };
  }
  async function waitFor(fn, maxFrames = 600) { for (let i = 0; i < maxFrames; i++) { if (fn()) return true; await frames(1); } return !!fn(); }
  async function ensureFlying(p, yaw) { if (!mech.active) mech.start(p, yaw); else mech.script.teleport(p, yaw); await frames(2); }
  async function runChecks(onStep) {
    const out = [], add = (id, name, pass, detail) => { out.push({ id, name, pass, detail }); onStep && onStep([...out]); };
    const gA = createGen(seed), gB = createGen(seed), s0 = gA.settlement(0, 0);
    const ra = gA.streetIds(s0), rb = gB.streetIds(gB.settlement(0, 0));
    add('T1', 'same seed → same road IDs', JSON.stringify(ra) === JSON.stringify(rb), ra.length + ' street ids · hash ' + hash32(ra.join()).toString(16));
    const parcels = (g) => { const l = []; for (let z = -2; z <= 2; z++) for (let x = -2; x <= 2; x++) for (const b of g.chunkRecipe(x, z).buildings) l.push(b.parcel); return l; };
    const pa = parcels(gA), pb = parcels(createGen(seed));
    add('T2', 'same seed → same parcels', JSON.stringify(pa) === JSON.stringify(pb), pa.length + ' parcels in 5×5 chunks');
    const recs = (g) => { const l = []; for (let z = -2; z <= 2; z++) for (let x = -2; x <= 2; x++) l.push(...g.chunkRecipe(x, z).buildings); return l; };
    const strip = (r) => JSON.stringify(r, (k, v) => (typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v));
    const ha = hash32(recs(gA).map(strip).join()), hb = hash32(recs(createGen(seed)).map(strip).join());
    add('T3', 'same seed → same BuildingRecipes', ha === hb, 'hash ' + ha.toString(16) + ' / ' + hb.toString(16));
    const sampleR = recs(gA).slice(0, 25), sampleR2 = recs(createGen(seed)).slice(0, 25);
    const ida = sampleR.flatMap((r) => cellsFor(r).map((c) => c.id)), idb = sampleR2.flatMap((r) => cellsFor(r).map((c) => c.id));
    add('T4', 'same BuildingRecipe → same destruction cell IDs', JSON.stringify(ida) === JSON.stringify(idb), ida.length + ' cell ids over ' + sampleR.length + ' recipes');
    await waitFor(() => world.pending() === 0, 900);
    const objCount = () => { let n = 0; scene.traverse(() => n++); let w = 0; world.root.traverse(() => w++); return { all: n, dyn: n - w, world: w }; };
    const rec = targetBuilding(3) || targetBuilding(1);
    if (!rec) { add('T5', 'Minigun 2 min · bounded', false, 'no near building'); return out; }
    const vp = viewpoint(rec); await ensureFlying(vp.p, vp.yaw); mech.script.aimAt(vp.aim);
    const o0 = objCount(), g0 = renderer.info.memory.geometries;
    mech.script.trigger = true;
    const dt = 1 / 60; let maxD = 0, maxV = 0, maxR = 0;
    for (let s = 0; s < 7200; s++) {
      if (s % 120 === 0) mech.script.aimAt(vp.aim);
      mech.tick(dt); destruct.update(dt, mech.position); world.update(mech.position.x, mech.position.z);
      maxD = Math.max(maxD, destruct.debrisActive()); maxV = Math.max(maxV, destruct.stats.chips + destruct.stats.dust + destruct.stats.fire); maxR = Math.max(maxR, mech.roundsActive());
      if (s % 600 === 599) await frames(1);
    }
    mech.script.trigger = false;
    const o1 = objCount(), g1 = renderer.info.memory.geometries, slotCap = (2 * RINGS.far + 3) ** 2;
    add('T5', 'Minigun 2 min (7200 steps) → no unbounded object growth', o1.dyn === o0.dyn && world.stats.slotsMade <= slotCap && destruct.stats.chips <= CAPS.chips,
      `non-world objects ${o0.dyn} → ${o1.dyn} (pools only) · chunk objects ${o0.world} → ${o1.world} (recompiled with damage, slots made ${world.stats.slotsMade} ≤ ${slotCap}) · GPU geometries ${g0} → ${g1} · shots ${mech.stats.shots}`);
    for (let k = 0; k < 10; k++) { const nb = world.buildingsNear(rec.centroid[0], rec.centroid[1], 22).map((b) => b.rec); const t = nb[k % nb.length]; mech.script.aimAt(new THREE.Vector3(t.centroid[0], t.baseY + 3, t.centroid[1])); mech.script.rocket(); for (let s = 0; s < 30; s++) { mech.tick(dt); destruct.update(dt, mech.position); maxD = Math.max(maxD, destruct.debrisActive()); maxV = Math.max(maxV, destruct.stats.chips + destruct.stats.dust + destruct.stats.fire); } }
    add('T6', 'debris never exceeds pool cap', maxD <= CAPS.debris && destruct.stats.debrisPeak <= CAPS.debris, `peak ${Math.max(maxD, destruct.stats.debrisPeak)} / ${CAPS.debris} · retired ${destruct.stats.retired}`);
    add('T7', 'projectiles never exceed pool cap', mech.stats.roundsPeak <= WCAPS.rounds && mech.stats.rocketsPeak <= WCAPS.rockets, `rounds peak ${mech.stats.roundsPeak}/${WCAPS.rounds} · rockets peak ${mech.stats.rocketsPeak}/${WCAPS.rockets}`);
    add('T8', 'VFX never grows unbounded', maxV <= CAPS.chips + CAPS.dust + CAPS.fire, `peak ${maxV} / ${CAPS.chips + CAPS.dust + CAPS.fire}`);
    for (let s = 0; s < 600; s++) { mech.tick(dt); destruct.update(dt, mech.position); }
    await frames(2);
    const B = destruct.byId.get(rec.id) || null;
    const before = B ? destruct.snapshot(B) : null, chunkKey = world.key(rec.chunk[0], rec.chunk[1]);
    const far = new THREE.Vector3(rec.centroid[0] + 900, 60, rec.centroid[1]); mech.script.teleport(far, 0);
    const released = await waitFor(() => !world.chunks.has(chunkKey), 600);
    const stored = world.damage.get(rec.id);
    add('T9', 'leaving active radius releases dynamic destruction state', released && !destruct.byId.has(rec.id) && destruct.owned(rec.id) === 0 && !!stored,
      `chunk released ${released} · promoted ${destruct.P.length} · owned debris ${destruct.owned(rec.id)} · stored ${stored ? stored.bits.length + ' bytes for ' + stored.n + ' cells' : 'none'}`);
    mech.script.teleport(vp.p, vp.yaw);
    const back = await waitFor(() => { const c = world.chunks.get(chunkKey); return c && c.lod === 0 && c.byId.get(rec.id) && c.byId.get(rec.id).meta.damaged; }, 900);
    let same = false, detail = 'chunk not back';
    if (back) {
      const B2 = destruct.promote(rec); const now = Array.from(B2.st), was = before ? Array.from(before.state) : Array.from(stored.state);
      same = JSON.stringify(now) === JSON.stringify(was);
      detail = `reconstructed ${now.filter((v) => v === 2).length}/${now.length} gone cells · equal ${same} · bits ${pack2(B2.st).length} B`;
    }
    add('T10', 'returning reconstructs damaged state', back && same, detail);
    const mats = new Set(); let chunkMeshes = 0, shared = 0; scene.traverse((o) => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => mats.add(m)); if (o.isMesh && o.parent && o.parent.parent === world.root) { chunkMeshes++; if (o.material === material) shared++; } });
    const wi = world.info();
    add('T11', 'no material created per house', chunkMeshes === shared && mats.size < 40, `${mats.size} materials in scene (mech + FX + 1 clay) · ${shared}/${chunkMeshes} chunk meshes on the shared clay material · ${wi.visible} buildings loaded`);
    const ws = world.stats;
    add('T12', 'queued chunks are not all integrated in one frame', ws.maxPerFrame <= MAX_PER_FRAME, `max ${ws.maxPerFrame} per frame (cap ${MAX_PER_FRAME}, budget ${opts.budgetMs ?? 4} ms) · queue was at ${ws.queuedAtMax} then · ${ws.bigQueueFrames} frames held back a queue larger than the cap · worst frame ${ws.integMaxFrame.toFixed(2)} ms`);
    {
      // T13 locomotion ladder: ↓ lands → walk, W runs at the measured speed, Space jumps and lands, Space×2 takes off
      const S = mech.script, dt = 1 / 60, gx = 6, gz = 34, alt = () => mech.position.y - world.groundAt(mech.position.x, mech.position.z);
      const run = (n, f) => { for (let i = 0; i < n; i++) { mech.tick(dt); f && f(); } };
      // pick an open heading: a short real walk per heading (land, hold W 40 steps), farthest wins
      let yaw0 = Math.PI, best = -1;
      S.driving = true;
      for (const y of [Math.PI, Math.PI / 2, -Math.PI / 2, 0, Math.PI / 4, -Math.PI / 4, 3 * Math.PI / 4, -3 * Math.PI / 4]) {
        await ensureFlying(new THREE.Vector3(gx, world.groundAt(gx, gz) + 1, gz), y);
        S.keys.add('ArrowDown'); for (let i = 0; i < 120 && mech.mode === 'flight'; i++) mech.tick(dt); S.keys.delete('ArrowDown');
        const p0 = mech.position.clone(); S.keys.add('KeyW'); run(40); S.keys.delete('KeyW');
        const d = Math.hypot(mech.position.x - p0.x, mech.position.z - p0.z); if (d > best) { best = d; yaw0 = y; }
      }
      await ensureFlying(new THREE.Vector3(gx, world.groundAt(gx, gz) + 4, gz), yaw0); run(20);
      S.keys.add('ArrowDown'); let n = 0; while (mech.mode === 'flight' && n++ < 600) mech.tick(dt); S.keys.delete('ArrowDown');
      const landed = mech.mode === 'walk'; run(50);
      const idleRole = mech.role, sc = mech.actors[mech.source].scale, runExp = LOCO.roles.run[1] * sc;
      S.keys.add('KeyW'); run(80); const runV = Math.hypot(mech.velocity.x, mech.velocity.z), runRole = mech.role; S.keys.delete('KeyW'); run(60);
      S.press('Space'); let peak = 0, air = false; run(110, () => { peak = Math.max(peak, alt()); if (mech.mode === 'air') air = true; });
      const down = mech.mode === 'walk'; run(30);
      S.press('Space'); S.press('Space'); run(40); const up = mech.mode === 'flight' && alt() > 1; S.driving = false;
      add('T13', 'locomotion: land → walk → run → jump → double-Space take-off', landed && idleRole === 'idle' && runRole === 'run' && Math.abs(runV - runExp) < 0.15 * runExp && air && down && peak > 0.8 && up,
        `heading ${yaw0.toFixed(2)} (${best.toFixed(1)} m in 40 test steps) · landed ${landed} after ${n} steps · idle role ${idleRole} · W → ${runRole} at ${runV.toFixed(2)} m/s (ladder ${runExp.toFixed(2)} = 3.177 × scale ${sc.toFixed(3)}) · jump peak ${peak.toFixed(2)} m, landed ${down} · take-off ${up} (alt ${alt().toFixed(1)} m)`);
    }
    return out;
  }

  /* ---------- stress bench (§25 A–E, real time, rendered) ---------- */
  const bench = {
    running: false, phase: null, rows: [], cur: null,
    sample(now) {
      if (!this.cur) return; const c = this.cur, p = perf();
      if (c.last) c.ms.push(now - c.last); c.last = now;
      c.calls = Math.max(c.calls, renderer.info.render.calls); c.callsSum += renderer.info.render.calls; c.n++; c.tris = Math.max(c.tris, renderer.info.render.triangles);
      c.visible = Math.max(c.visible, p.visible); c.debris = Math.max(c.debris, p.debris); c.proj = Math.max(c.proj, p.proj); c.vfx = Math.max(c.vfx, p.vfx); c.promoted = Math.max(c.promoted, p.promoted); c.chunks = Math.max(c.chunks, p.chunks);
    },
    begin(id, name) { this.cur = { id, name, ms: [], last: 0, calls: 0, callsSum: 0, n: 0, tris: 0, visible: 0, debris: 0, proj: 0, vfx: 0, promoted: 0, chunks: 0 }; },
    end(extra = {}) { const c = this.cur; this.cur = null; const ms = c.ms.slice().sort((a, b) => a - b), avg = ms.reduce((a, v) => a + v, 0) / Math.max(1, ms.length); const row = { id: c.id, name: c.name, mode: this.mode, frames: ms.length, fps: Math.round(1000 / avg), avgMs: +avg.toFixed(2), p95Ms: +(ms[Math.floor(ms.length * 0.95)] || 0).toFixed(2), maxMs: +(ms[ms.length - 1] || 0).toFixed(2), drawCallsAvg: Math.round(c.callsSum / Math.max(1, c.n)), drawCallsMax: c.calls, trianglesMax: c.tris, visibleBuildings: c.visible, chunks: c.chunks, debrisPeak: c.debris, projectilesPeak: c.proj, vfxPeak: c.vfx, promotedPeak: c.promoted, ...extra }; this.rows.push(row); return row; }
  };
  const sleepS = (s) => (throttled() ? pump(s * 1000) : new Promise((r) => setTimeout(r, s * 1000)));
  async function runBench(onStep) {
    if (bench.running) return bench.rows; bench.running = true; bench.rows = []; bench.mode = throttled() ? 'pumped (background tab: fixed 1/60 s steps, wall time = CPU + GPU submit, no vsync)' : 'requestAnimationFrame (vsync)';
    try {
      await waitFor(() => world.pending() === 0, 600);
      const top = new THREE.Vector3(0, world.groundAt(0, 0) + 75, 95);
      await ensureFlying(top, 0); mech.script.aim(0, -0.55); await frames(30);
      bench.begin('A', 'world baseline · above the intact settlement'); await sleepS(4); onStep && onStep(bench.end());
      const rec = targetBuilding(3) || targetBuilding(1), vp = viewpoint(rec);
      mech.script.teleport(vp.p, vp.yaw); mech.script.aimAt(vp.aim); await frames(20);
      bench.begin('B', 'Minigun · sustained on one façade'); mech.script.trigger = true;
      for (let i = 0; i < 16; i++) { mech.script.aimAt(vp.aim); await sleepS(0.5); }
      mech.script.trigger = false; onStep && onStep(bench.end({ shots: mech.stats.shots }));
      bench.begin('C', 'Rockets · 2–3 neighbouring buildings');
      const nb = world.buildingsNear(rec.centroid[0], rec.centroid[1], 24).map((b) => b.rec).slice(0, 3);
      for (let i = 0; i < 6; i++) { const t = nb[i % nb.length]; mech.script.aimAt(new THREE.Vector3(t.centroid[0], t.baseY + 2.5 + (i % 2) * 2, t.centroid[1])); mech.script.rocket(); await sleepS(0.6); }
      await sleepS(3); onStep && onStep(bench.end({ cascades: destruct.stats.cascades, cellsLost: destruct.stats.cellsLost }));
      bench.begin('D', 'streaming during destruction · fly away across chunk boundaries');
      const ck = world.key(rec.chunk[0], rec.chunk[1]);
      for (let i = 1; i <= 30; i++) { mech.script.teleport(new THREE.Vector3(rec.centroid[0] + i * 30, world.groundAt(rec.centroid[0] + i * 30, rec.centroid[1]) + 40, rec.centroid[1]), -Math.PI / 2); await frames(3); }
      await waitFor(() => !world.chunks.has(ck), 400);
      onStep && onStep(bench.end({ released: !world.chunks.has(ck), promotedAfter: destruct.P.length, storedBuildings: world.damage.size }));
      bench.begin('E', 'return · destroyed buildings reconstructed');
      mech.script.teleport(vp.p, vp.yaw); mech.script.aimAt(vp.aim);
      await waitFor(() => { const c = world.chunks.get(ck); return c && c.lod === 0; }, 600); await sleepS(2.5);
      const c = world.chunks.get(ck); onStep && onStep(bench.end({ reconstructed: c ? c.blds.filter((b) => b.meta.damaged).length : 0 }));
    } finally { bench.running = false; }
    return bench.rows;
  }

  frame();
  const api = {
    renderer, scene, camera, world, destruct, mech, gates, material, perf, fly, regenerate, runChecks, runBench, frames, pump,
    get seed() { return seed; }, toggleGates(on = !gatesOn) { gatesOn = on; opts.onGates && opts.onGates(gatesOn ? gates.labels() : null); },
    setSource: (k) => mech.useSource(k), toggleRockets: () => mech.toggleRockets(),
    targetBuilding, viewpoint, ensureFlying, waitFor,
    sources: () => ({
      generator: { gen: GEN_VERSION, chunk: CHUNK, rings: RINGS, donor: 'p-schulz/osm_building_grammar@81f1b50eae048645b2e620056a7cb2c84709bcfa (Apache-2.0, concept + default_config values)' },
      clay: CLAY_TEX, mech: [SOURCES.flight.mech, SOURCES.atlas.mech, ...SOURCES.atlas.clips], gun: GUN_SRC,
      loco: { commit: LOCO.commit, dir: LOCO.sets[0].replace(/[^/]+$/, ''), profile: LOCO.profile, missing: assets.loco ? assets.loco.missing : ['not loaded'], samePin: assets.loco ? assets.loco.samePin : null, cover: Object.values(mech.actors).map((a) => a.kind + ' ' + a.loco.bones).join(' · ') },
      actors: Object.values(mech.actors).map((a) => ({ kind: a.kind, mount: a.mountName, barrel: !!a.barrel, clips: a.clips, scale: +a.scale.toFixed(3), rawHeight: +a.raw.y.toFixed(3), chest: a.act.__chest || null })),
      errors: assets.errors
    }),
    dispose() { disposed = true; cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('keydown', onKey); mech.dispose(); world.dispose(); renderer.dispose(); host.innerHTML = ''; }
  };
  return api;
}
