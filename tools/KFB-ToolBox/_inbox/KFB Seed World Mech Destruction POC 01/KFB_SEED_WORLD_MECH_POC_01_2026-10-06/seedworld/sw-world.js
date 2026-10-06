/* KFB Seed World · POC 01 · chunk streaming, shared clay material, world queries
   RESEARCH PLAYGROUND · NOT WORLD STUDIO · NOT COMBAT ARENA
   Generate richly, render brutally simply: per chunk ONE merged mesh (terrain + roads + building shells + roofs)
   plus instanced windows / doors / chimneys / trunks / crowns, all on ONE shared clay material.
   Worker compiles ahead; finished chunks enter the scene through a queue under an explicit ms budget. */

import * as THREE from 'three';
import { createGen, CHUNK } from './sw-gen.js';
import { compileChunk, proto, TREE_STYLE } from './sw-mesh.js';

const enc = (p) => p.split('/').map(encodeURIComponent).join('/');
export const CLAY_TEX = { repo: 'georg-doc/kayfabizarro', commit: '30558ae3b990352adb4d010278c7a43e6965b0b1', path: 'media/3D_Assets/Textures/clay_floor_001/clay_floor_001_diffuse.jpg' };
export const RINGS = { near: 1, street: 2, district: 3, far: 5 };
export const MAX_PER_FRAME = 3;
const lodFor = (d) => (d <= RINGS.near ? 0 : d <= RINGS.street ? 1 : d <= RINGS.district ? 2 : 3);

/* ---------- one KFB clay material family: microtexture (triplanar, world space) × vertex colour × instance colour ---------- */
export function clayMaterial() {
  const blank = new THREE.DataTexture(new Uint8Array([128, 128, 128, 255]), 1, 1); blank.needsUpdate = true;
  const uni = { uClay: { value: blank }, uScale: { value: 0.3 }, uBump: { value: 0.32 }, uAmt: { value: 0.0 } };
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.84, metalness: 0, side: THREE.DoubleSide });
  m.name = 'KFB_SeedWorld_Clay';
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uni);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vSwP; varying vec3 vSwN;')
      .replace('#include <worldpos_vertex>', `#include <worldpos_vertex>
      vec4 swp = vec4(transformed, 1.0);
      vec3 swn = objectNormal;
      #ifdef USE_INSTANCING
        swp = instanceMatrix * swp; swn = mat3(instanceMatrix) * swn;
      #endif
      swp = modelMatrix * swp; vSwP = swp.xyz; vSwN = normalize(mat3(modelMatrix) * swn);`);
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
      uniform sampler2D uClay; uniform float uScale; uniform float uBump; uniform float uAmt; varying vec3 vSwP; varying vec3 vSwN;
      float clayH(vec3 p, vec3 n){ vec3 w = pow(abs(n), vec3(4.0)); w /= (w.x + w.y + w.z + 1e-5);
        return texture2D(uClay, p.zy * uScale).g * w.x + texture2D(uClay, p.xz * uScale).g * w.y + texture2D(uClay, p.xy * uScale).g * w.z; }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
      float swH = clayH(vSwP, normalize(vSwN));
      diffuseColor.rgb *= mix(1.0, 0.93 + 0.14 * swH, uAmt);`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      { float fade = smoothstep(60.0, 6.0, length(vViewPosition)) * uAmt;
        vec2 dH = vec2(dFdx(swH), dFdy(swH)) * uBump * fade;
        vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition), r1 = cross(sy, normal), r2 = cross(normal, sx);
        float det = dot(sx, r1); vec3 grad = sign(det) * (dH.x * r1 + dH.y * r2);
        normal = normalize(abs(det) * normal - grad); }`);
  };
  m.customProgramCacheKey = () => 'kfb-sw-clay-v1';
  m.userData.uni = uni;
  m.userData.load = () => new Promise((res) => {
    new THREE.TextureLoader().load('https://cdn.jsdelivr.net/gh/' + CLAY_TEX.repo + '@' + CLAY_TEX.commit + '/' + enc(CLAY_TEX.path), (t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.NoColorSpace; t.anisotropy = 4; uni.uClay.value = t; uni.uAmt.value = 1; res(true);
    }, undefined, () => res(false));
  });
  return m;
}

export function geomFrom(a) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(a.pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(a.nrm, 3)); g.setAttribute('color', new THREE.BufferAttribute(a.col, 3));
  g.setIndex(new THREE.BufferAttribute(a.idx, 1)); g.computeBoundingSphere(); return g;
}

export function createWorld({ scene, seed, material, budgetMs = 4, useWorker = true }) {
  let gen = createGen(seed);
  const protos = {};
  function buildProtos() {
    for (const k in protos) protos[k].dispose();
    protos.win = geomFrom(proto('win')); protos.win1 = geomFrom(proto('win1')); protos.door = geomFrom(proto('door')); protos.chim = geomFrom(proto('chim'));
    protos.trunk = geomFrom(proto('trunk')); protos.crown = geomFrom(proto('crown', gen.type.tree));
  }
  buildProtos();
  const root = new THREE.Group(); root.name = 'seed-world'; scene.add(root);
  const chunks = new Map(), slots = [], jobs = new Map(), queue = [];
  const damage = new Map(), damageByChunk = new Map(), hidden = new Set();
  const listeners = { integrate: [], release: [] };
  let jobId = 1, inFlight = 0, center = [1e9, 1e9], lastScan = 0;
  const stats = { genMs: 0, integMs: 0, integMaxFrame: 0, perFrame: 0, maxPerFrame: 0, queuedAtMax: 0, allInOneFrame: 0, bigQueueFrames: 0, frames: 0, compiled: 0, dropped: 0, worker: false, slotsMade: 0 };

  /* ---------- worker (falls back to main-thread compile, one per frame) ---------- */
  let worker = null, workerTry = 0, firstSent = 0, gotAny = false;
  const workerUrls = [
    () => new Worker(new URL('./sw-worker.js', import.meta.url), { type: 'module' }),
    () => { const src = `import { createGen } from '${new URL('./sw-gen.js', import.meta.url).href}'; import { compileChunk, transferables } from '${new URL('./sw-mesh.js', import.meta.url).href}'; let gen = null, seed = null; self.onmessage = (e) => { const { id, seed: s, cx, cz, lod, damage, hidden } = e.data; if (!gen || seed !== s) { gen = createGen(s); seed = s; } const r = compileChunk(gen, cx, cz, lod, damage, hidden); r.id = id; r.seed = s; self.postMessage(r, transferables(r)); };`; return new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })), { type: 'module' }); }
  ];
  function giveUpWorker() { if (worker) worker.terminate(); worker = null; stats.worker = false; for (const j of jobs.values()) j.sent = false; inFlight = 0; firstSent = 0; tryWorker(); }
  function tryWorker() {
    while (useWorker && workerTry < workerUrls.length) {
      try { worker = workerUrls[workerTry++](); worker.onmessage = (e) => { gotAny = true; onResult(e.data); }; worker.onerror = () => giveUpWorker(); stats.worker = true; stats.workerKind = workerTry; return; } catch (e) { worker = null; }
    }
  }
  tryWorker();
  const key = (cx, cz) => cx + ',' + cz;

  function damageFor(cx, cz) {
    const ids = damageByChunk.get(key(cx, cz)); if (!ids) return null;
    const o = {}; for (const id of ids) o[id] = Array.from(damage.get(id).state); return o;
  }
  function hiddenFor(cx, cz) { const out = []; for (const id of hidden) { const r = recById.get(id); if (r && r.chunk[0] === cx && r.chunk[1] === cz) out.push(id); } return out; }
  const recById = new Map();

  function request(cx, cz, lod, pri) {
    const k = key(cx, cz), j = jobs.get(k);
    if (j && j.lod === lod && !j.stale) { j.pri = Math.min(j.pri, pri); return; }
    jobs.set(k, { id: jobId++, cx, cz, lod, pri, sent: false, seed: gen.seed });
  }
  function dispatch() {
    const max = worker ? 3 : 0;
    if (!worker) {
      // main-thread fallback: compile at most one job per frame
      let best = null; for (const j of jobs.values()) if (!j.sent && (!best || j.pri < best.pri)) best = j;
      if (best) { best.sent = true; const r = compileChunk(gen, best.cx, best.cz, best.lod, damageFor(best.cx, best.cz), hiddenFor(best.cx, best.cz)); r.id = best.id; r.seed = gen.seed; onResult(r); }
      return;
    }
    if (!gotAny && firstSent && performance.now() - firstSent > 2500) { giveUpWorker(); return; }
    while (inFlight < max) {
      let best = null; for (const j of jobs.values()) if (!j.sent && (!best || j.pri < best.pri)) best = j;
      if (!best) break;
      best.sent = true; inFlight++; if (!firstSent) firstSent = performance.now();
      worker.postMessage({ id: best.id, seed: gen.seed, cx: best.cx, cz: best.cz, lod: best.lod, damage: damageFor(best.cx, best.cz), hidden: hiddenFor(best.cx, best.cz) });
    }
  }
  function onResult(r) {
    if (worker && r.seed !== undefined) inFlight = Math.max(0, inFlight - 1);
    const k = key(r.cx, r.cz), j = jobs.get(k);
    if (r.seed !== gen.seed || !j || j.id !== r.id) { stats.dropped++; return; }
    jobs.delete(k); stats.genMs = r.genMs; stats.compiled++;
    queue.push({ r, pri: j.pri }); queue.sort((a, b) => a.pri - b.pri);
  }

  function slot() {
    let s = slots.pop();
    if (!s) { s = { group: new THREE.Group(), mesh: new THREE.Mesh(new THREE.BufferGeometry(), material), inst: {} }; s.mesh.castShadow = true; s.mesh.receiveShadow = true; s.group.add(s.mesh); stats.slotsMade++; }
    return s;
  }
  function release(c, replaced) {
    root.remove(c.slot.group);
    c.slot.mesh.geometry.dispose(); c.slot.mesh.geometry = new THREE.BufferGeometry();
    for (const n in c.slot.inst) { const im = c.slot.inst[n]; c.slot.group.remove(im); im.dispose(); }
    c.slot.inst = {};
    slots.push(c.slot);
    if (!replaced) for (const f of listeners.release) f(c);
  }
  function instMesh(geo, l) {
    const n = l.c.length / 3; if (!n) return null;
    const im = new THREE.InstancedMesh(geo, material, n);
    im.instanceMatrix = new THREE.InstancedBufferAttribute(l.m, 16); im.instanceColor = new THREE.InstancedBufferAttribute(l.c, 3);
    im.count = n; im.castShadow = true; im.receiveShadow = true; im.computeBoundingSphere(); return im;
  }
  function integrate(r) {
    const k = key(r.cx, r.cz), old = chunks.get(k), s = slot();
    s.mesh.geometry.dispose(); s.mesh.geometry = geomFrom(r);
    const seg = [40, 24, 12, 6][r.lod], hs = new Float32Array((seg + 1) * (seg + 1)); for (let i = 0; i < hs.length; i++) hs[i] = r.pos[i * 3 + 1];
    s.inst = {};
    const add = (n, geo) => { const im = instMesh(geo, r.inst[n]); if (im) { s.inst[n] = im; s.group.add(im); } };
    add('win', r.lod === 0 ? protos.win : protos.win1); add('door', protos.door); add('chim', protos.chim); add('trunk', protos.trunk); add('crown', protos.crown);
    const byId = new Map((r.recipes || gen.chunkRecipe(r.cx, r.cz).buildings).map((b) => [b.id, recById.get(b.id) || b]));
    const blds = r.meta.map((m) => { const b = byId.get(m.id); recById.set(b.id, b); return { rec: b, meta: m, obb: obbOf(b) }; });
    for (const b of blds) if (b.meta.damaged) b.obb.y1 = damagedTop(b.rec);
    const c = { cx: r.cx, cz: r.cz, lod: r.lod, slot: s, seg, hs, blds, byId: new Map(blds.map((b) => [b.rec.id, b])), trees: r.trees, buildings: r.buildings, sphere: s.mesh.geometry.boundingSphere };
    root.add(s.group); if (old) release(old, true); chunks.set(k, c);
    for (const b of blds) if (hidden.has(b.rec.id)) hideIn(c, b, true);
    for (const f of listeners.integrate) f(c);
  }

  /* ---------- coarse building bounds ---------- */
  function obbOf(rec) {
    const [c0, c1] = rec.corners; let L = [c1[0] - c0[0], c1[1] - c0[1]]; const l = Math.hypot(L[0], L[1]) || 1; L = [L[0] / l, L[1] / l]; const F = [-L[1], L[0]];
    const [cx, cz] = rec.centroid; let hx = 0, hz = 0;
    for (const [x, z] of rec.corners) { hx = Math.max(hx, Math.abs((x - cx) * L[0] + (z - cz) * L[1])); hz = Math.max(hz, Math.abs((x - cx) * F[0] + (z - cz) * F[1])); }
    const H = rec.height + rec.roof.h, tw = Math.abs(rec.deform.twist) * Math.PI / 180, m = 0.35 + Math.max(hx, hz) * Math.sin(tw) * 0.6 + rec.roof.ov;
    return { cx, cz, L, F, hx: hx + m, hz: hz + m, y0: rec.baseY - 0.5, y1: rec.baseY + H + 0.3 };
  }
  function damagedTop(rec) {
    const st = damage.get(rec.id); if (!st) return rec.baseY + rec.height + rec.roof.h;
    return st.top ?? rec.baseY + rec.height + rec.roof.h;
  }

  /* ---------- hide / show one building inside its compiled chunk (promotion) ---------- */
  function hideIn(c, b, on) {
    const g = c.slot.mesh.geometry, pos = g.attributes.position, [v0, n] = b.meta.v;
    if (n) {
      if (on) { if (!b.backup) b.backup = pos.array.slice(v0 * 3, (v0 + n) * 3); const x = pos.array[v0 * 3], y = pos.array[v0 * 3 + 1] - 50, z = pos.array[v0 * 3 + 2]; for (let i = v0; i < v0 + n; i++) { pos.array[i * 3] = x; pos.array[i * 3 + 1] = y; pos.array[i * 3 + 2] = z; } }
      else if (b.backup) pos.array.set(b.backup, v0 * 3);
      pos.clearUpdateRanges(); pos.addUpdateRange(v0 * 3, n * 3); pos.needsUpdate = true;
    }
    for (const kind of ['win', 'door', 'chim']) {
      const im = c.slot.inst[kind], [i0, cnt] = b.meta[kind]; if (!im || !cnt) continue;
      const arr = im.instanceMatrix.array;
      if (on) { if (!b['bk' + kind]) b['bk' + kind] = arr.slice(i0 * 16, (i0 + cnt) * 16); for (let i = i0; i < i0 + cnt; i++) arr.fill(0, i * 16, i * 16 + 15); }
      else if (b['bk' + kind]) arr.set(b['bk' + kind], i0 * 16);
      im.instanceMatrix.clearUpdateRanges(); im.instanceMatrix.addUpdateRange(i0 * 16, cnt * 16); im.instanceMatrix.needsUpdate = true;
    }
    b.hidden = on;
  }
  function setHidden(rec, on) {
    if (on) hidden.add(rec.id); else hidden.delete(rec.id);
    const c = chunks.get(key(rec.chunk[0], rec.chunk[1])); const b = c && c.byId.get(rec.id); if (b) hideIn(c, b, on);
  }
  function setDamage(rec, state, top) {
    const k = key(rec.chunk[0], rec.chunk[1]);
    damage.set(rec.id, { state: Uint8Array.from(state), top });
    if (!damageByChunk.has(k)) damageByChunk.set(k, new Set()); damageByChunk.get(k).add(rec.id);
  }
  function rebuild(rec) {
    const c = chunks.get(key(rec.chunk[0], rec.chunk[1])); if (!c) return false;
    jobs.delete(key(c.cx, c.cz)); request(c.cx, c.cz, c.lod, -1); return true;
  }

  /* ---------- per-frame streaming ---------- */
  function update(px, pz, now = performance.now()) {
    const pcx = Math.floor(px / CHUNK), pcz = Math.floor(pz / CHUNK);
    if (pcx !== center[0] || pcz !== center[1] || now - lastScan > 400) {
      center = [pcx, pcz]; lastScan = now;
      const want = new Set();
      for (let dz = -RINGS.far; dz <= RINGS.far; dz++) for (let dx = -RINGS.far; dx <= RINGS.far; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dz)), cx = pcx + dx, cz = pcz + dz, k = key(cx, cz), lod = lodFor(d), c = chunks.get(k);
        want.add(k);
        if (!c || c.lod !== lod) request(cx, cz, lod, d + (c ? 0.5 : 0));
        else { const j = jobs.get(k); if (j && !j.sent && j.pri >= 0) jobs.delete(k); }
      }
      for (const [k, c] of chunks) { const d = Math.max(Math.abs(c.cx - pcx), Math.abs(c.cz - pcz)); if (d > RINGS.far + 1) { release(c); chunks.delete(k); } }
      for (const [k, j] of jobs) if (!want.has(k) && !j.sent) jobs.delete(k);
    }
    dispatch();
    const t0 = performance.now(); let n = 0; const queued = queue.length;
    while (queue.length && n < MAX_PER_FRAME && (n === 0 || performance.now() - t0 < budgetMs)) {
      const { r } = queue.shift(), d = Math.max(Math.abs(r.cx - pcx), Math.abs(r.cz - pcz));
      if (d > RINGS.far + 1) continue;
      integrate(r); n++;
    }
    const ms = performance.now() - t0;
    stats.frames++; stats.perFrame = n; if (n) stats.integMs = ms / n;
    if (n > stats.maxPerFrame) { stats.maxPerFrame = n; stats.queuedAtMax = queued; }
    if (queued >= 3 && n === queued) stats.allInOneFrame++;
    if (queued > MAX_PER_FRAME) stats.bigQueueFrames++;
    stats.integMaxFrame = Math.max(stats.integMaxFrame * 0.995, ms);
  }

  /* ---------- queries ---------- */
  function groundAt(x, z) {
    const cx = Math.floor(x / CHUNK), cz = Math.floor(z / CHUNK), c = chunks.get(key(cx, cz));
    if (!c) return gen.height(x, z);
    const st = CHUNK / c.seg, fx = (x - cx * CHUNK) / st, fz = (z - cz * CHUNK) / st, i = Math.min(c.seg - 1, Math.floor(fx)), j = Math.min(c.seg - 1, Math.floor(fz)), tx = fx - i, tz = fz - j, R = c.seg + 1;
    const a = c.hs[j * R + i], b = c.hs[j * R + i + 1], d = c.hs[(j + 1) * R + i], e = c.hs[(j + 1) * R + i + 1];
    return a + (b - a) * tx + (d - a) * tz + (a - b - d + e) * tx * tz;
  }
  function rayOBB(o, d, b, tmax) {
    const ox = o.x - b.cx, oz = o.z - b.cz;
    const lo = [ox * b.L[0] + oz * b.L[1], o.y, ox * b.F[0] + oz * b.F[1]], ld = [d.x * b.L[0] + d.z * b.L[1], d.y, d.x * b.F[0] + d.z * b.F[1]];
    const mn = [-b.hx, b.y0, -b.hz], mx = [b.hx, b.y1, b.hz];
    let t0 = 0, t1 = tmax, ax = -1, sg = 0;
    for (let k = 0; k < 3; k++) {
      if (Math.abs(ld[k]) < 1e-9) { if (lo[k] < mn[k] || lo[k] > mx[k]) return null; continue; }
      let ta = (mn[k] - lo[k]) / ld[k], tb = (mx[k] - lo[k]) / ld[k], s = -1; if (ta > tb) { const t = ta; ta = tb; tb = t; s = 1; }
      if (ta > t0) { t0 = ta; ax = k; sg = s; } if (tb < t1) t1 = tb; if (t0 > t1) return null;
    }
    if (ax < 0) return { t: 0, n: new THREE.Vector3(-d.x, -d.y, -d.z) };
    const n = ax === 1 ? new THREE.Vector3(0, sg, 0) : ax === 0 ? new THREE.Vector3(b.L[0] * sg, 0, b.L[1] * sg) : new THREE.Vector3(b.F[0] * sg, 0, b.F[1] * sg);
    return { t: t0, n };
  }
  function eachChunkOnSegment(o, d, far, fn) {
    const x0 = Math.min(o.x, o.x + d.x * far), x1 = Math.max(o.x, o.x + d.x * far), z0 = Math.min(o.z, o.z + d.z * far), z1 = Math.max(o.z, o.z + d.z * far);
    for (let cz = Math.floor(z0 / CHUNK) - 1; cz <= Math.floor(z1 / CHUNK) + 1; cz++) for (let cx = Math.floor(x0 / CHUNK) - 1; cx <= Math.floor(x1 / CHUNK) + 1; cx++) { const c = chunks.get(key(cx, cz)); if (c) fn(c); }
  }
  function raycast(o, d, far, skipHidden = true) {
    let best = null;
    eachChunkOnSegment(o, d, far, (c) => {
      for (const b of c.blds) {
        if (skipHidden && hidden.has(b.rec.id)) continue;
        const h = rayOBB(o, d, b.obb, best ? best.t : far);
        if (h && (!best || h.t < best.t)) best = { t: h.t, normal: h.n, kind: 'building', rec: b.rec, chunk: c };
      }
    });
    // terrain: conservative march
    let t = 0, prev = 0; const lim = best ? best.t : far;
    while (t < lim) {
      const x = o.x + d.x * t, y = o.y + d.y * t, z = o.z + d.z * t, gap = y - groundAt(x, z);
      if (gap < 0) {
        let a = prev, b = t; for (let k = 0; k < 6; k++) { const m = (a + b) / 2; if (o.y + d.y * m - groundAt(o.x + d.x * m, o.z + d.z * m) < 0) b = m; else a = m; }
        best = { t: b, normal: new THREE.Vector3(0, 1, 0), kind: 'terrain' }; break;
      }
      prev = t; t += Math.max(0.6, gap * 0.5);
    }
    if (best) best.point = new THREE.Vector3(o.x + d.x * best.t, o.y + d.y * best.t, o.z + d.z * best.t);
    return best;
  }
  function buildingsNear(x, z, r, includeHidden = true) {
    const out = [];
    for (let cz = Math.floor((z - r) / CHUNK) - 1; cz <= Math.floor((z + r) / CHUNK) + 1; cz++) for (let cx = Math.floor((x - r) / CHUNK) - 1; cx <= Math.floor((x + r) / CHUNK) + 1; cx++) {
      const c = chunks.get(key(cx, cz)); if (!c) continue;
      for (const b of c.blds) { if (!includeHidden && hidden.has(b.rec.id)) continue; const o = b.obb, dx = x - o.cx, dz = z - o.cz, lx = Math.abs(dx * o.L[0] + dz * o.L[1]) - o.hx, lz = Math.abs(dx * o.F[0] + dz * o.F[1]) - o.hz; if (Math.hypot(Math.max(0, lx), Math.max(0, lz)) < r) out.push({ rec: b.rec, obb: o, chunk: c }); }
    }
    return out;
  }
  function collideSphere(p, r) {
    const push = new THREE.Vector3();
    for (const { obb: o, rec } of buildingsNear(p.x, p.z, r + 1, false)) {
      if (p.y - r > o.y1 || p.y + r < o.y0) continue;
      const dx = p.x - o.cx, dz = p.z - o.cz, lx = dx * o.L[0] + dz * o.L[1], lz = dx * o.F[0] + dz * o.F[1];
      const qx = Math.max(-o.hx, Math.min(o.hx, lx)), qz = Math.max(-o.hz, Math.min(o.hz, lz)), qy = Math.max(o.y0, Math.min(o.y1, p.y));
      let ex = lx - qx, ez = lz - qz, ey = p.y - qy, dist = Math.hypot(ex, ey, ez);
      if (dist >= r) continue;
      if (dist < 1e-4) { const pen = [o.hx - Math.abs(lx), o.y1 - p.y, o.hz - Math.abs(lz)]; const m = Math.min(...pen); if (m === pen[1]) { push.y += pen[1] + r; continue; } if (m === pen[0]) { ex = Math.sign(lx); ez = 0; } else { ez = Math.sign(lz); ex = 0; } ey = 0; dist = 0; }
      const k = (r - dist) / (Math.hypot(ex, ey, ez) || 1);
      push.x += (ex * o.L[0] + ez * o.F[0]) * k; push.z += (ex * o.L[1] + ez * o.F[1]) * k; push.y += ey * k;
      void rec;
    }
    return push;
  }
  function info(frustum) {
    let visible = 0, active = 0, near = 0; const S = new THREE.Sphere();
    for (const c of chunks.values()) { active++; if (c.lod === 0) near += c.buildings; S.copy(c.sphere); if (!frustum || frustum.intersectsSphere(S)) visible += c.buildings; }
    return { active, visible, near, queued: queue.length, jobs: jobs.size };
  }
  function regenerate(newSeed) {
    for (const c of chunks.values()) release(c); chunks.clear(); jobs.clear(); queue.length = 0; inFlight = 0;
    damage.clear(); damageByChunk.clear(); hidden.clear(); recById.clear();
    gen = createGen(newSeed); buildProtos(); center = [1e9, 1e9];
  }
  return {
    get gen() { return gen; }, root, chunks, damage, hidden, stats, recById, protos, on: (n, f) => listeners[n].push(f),
    update, groundAt, raycast, rayOBB, buildingsNear, collideSphere, setHidden, setDamage, rebuild, info, regenerate, obbOf, key,
    chunkOf: (rec) => chunks.get(key(rec.chunk[0], rec.chunk[1])),
    pending: () => jobs.size + queue.length,
    dispose() { regenerate(gen.seed); scene.remove(root); worker && worker.terminate(); }
  };
}
export { TREE_STYLE };
