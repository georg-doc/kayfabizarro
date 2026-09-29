/* KFB Joyride J05 · Georgs Fixes (29.09. spät) · J04 + K2 (Q/E, Flug über den Kicker), Schatten-Kanon PR #290 (Follow, 1,2 × Texel),
 *   FACE_NORMALS auf den Fassaden, Knetgummi-Bande federt sichtbar, Clay-VFX am Spielerauto.
 * KFB Joyride J04 · Knet-Strecke fahren · KFB-Fahrphysik (29.09.)
 * Basis J03 (Leicht-Pass, Fassaden, Gelände, Tafeln). Neu: Ammo raus, KFB-Fahrphysik K1 (Race v0.8 FLOW/FEEL aus Cologne
 * Option C-3, im Streckenrahmen) mit Spurhilfe + Knetgummi-Bande, Kamera auf der Streckenschiene (Verfahren railClamp),
 * T4-Dichte-Schalter (window.__KFB_T4_LEAN). Rezept: lab-drive/joyride.j04.json. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { boot as bootT4 } from '../lab-track/track-look.v5.js?r=23';
import { makeClayMaterial, seedGeometry } from '../lab-clay/clay-material.v10.js?r=2';
import { softenGeometry } from '../lab-clay/clay-soften.v1.js';
import { chunkify, thinNoCast, clayLite, makeShadowFollow, faceNormals, makeWobble } from './lean-pass.l2.js?r=1';
import { makeFrame, createDriver, stepDriver, pose, FLOW, ASSIST } from './kfb-drive.k2.js?r=1';

const clamp = (x, a, b) => Math.min(b, Math.max(a, x)), lerp = (a, b, t) => a + (b - a) * t;
const sst = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const h2 = (i, j) => { const v = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return v - Math.floor(v); };
const vn2 = (x, z) => { const i = Math.floor(x), j = Math.floor(z), fx = x - i, fz = z - j, u = fx * fx * (3 - 2 * fx), w = fz * fz * (3 - 2 * fz);
  return lerp(lerp(h2(i, j), h2(i + 1, j), u), lerp(h2(i, j + 1), h2(i + 1, j + 1), u), w); };
const fbm = (x, z) => 0.55 * vn2(x, z) + 0.3 * vn2(x * 2.1 + 5.3, z * 2.1 - 1.7) + 0.15 * vn2(x * 4.3 - 2.2, z * 4.3 + 7.1);
const V = a => new THREE.Vector3(a[0], a[1], a[2]);

export async function boot(canvas, onNote = () => {}, opts = {}) {
  const t0 = performance.now();
  const RC = await fetch(new URL('./joyride.j05.json', import.meta.url).href + '?r=' + Date.now()).then(r => r.json());
  window.__KFB_T4_LEAN = (opts.profile || 'leicht') === 'leicht' ? RC.lean.t4 : null;   // vor dem Bau: Dichte gilt ab Aufbau
  const T = await bootT4(canvas, onNote);
  const { scene, camera, st, S, N, root, GY, ctr, ext, M, U } = T;
  const info = { speed: 0, fps: 0, calls: 0, frameTris: 0, loadMs: 0, errors: [], vehicle: null, air: false, s: 0, terrainTris: 0, draped: 0, colTris: 0, boards: [] };
  const W3 = (q, l, h) => [q.p[0] + q.R[0] * l + q.U[0] * h, q.p[1] + q.R[1] * l + q.U[1] * h, q.p[2] + q.R[2] * l + q.U[2] * h];
  T.karts.forEach(k => k.obj.g.visible = false);

  /* ---------- Rollendes Knet-Gelände ---------- */
  onNote('Knet-Gelände wird ausgerollt …'); await new Promise(r => setTimeout(r, 0));
  const TR = RC.terrain, TW = ext.x + 420, TD = ext.z + 420, NG = TR.grid, x0 = ctr.x - TW / 2, z0 = ctr.z - TD / 2, dx = TW / NG, dz = TD / NG;
  const tpts = []; for (let i = 0; i < N; i += 3) tpts.push(S[i].p[0], S[i].p[2]);
  const CELL = 24, tg = new Map(); for (let k = 0; k < tpts.length; k += 2) { const key = Math.floor(tpts[k] / CELL) + ',' + Math.floor(tpts[k + 1] / CELL); if (!tg.has(key)) tg.set(key, []); tg.get(key).push(tpts[k], tpts[k + 1]); }
  const dTrack = (x, z) => { const ci = Math.floor(x / CELL), cj = Math.floor(z / CELL); let best = Infinity;
    for (let r = 0; r <= 6; r++) { for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) { if (Math.max(Math.abs(a), Math.abs(b)) !== r) continue; const L = tg.get((ci + a) + ',' + (cj + b)); if (!L) continue;
        for (let k = 0; k < L.length; k += 2) { const d = (L[k] - x) ** 2 + (L[k + 1] - z) ** 2; if (d < best) best = d; } }
      if (best < ((r) * CELL) ** 2) break; } return Math.sqrt(best); };
  const rr = 90, sdRR = (x, z) => { const qx = Math.abs(x - ctr.x) - (TW / 2 - rr), qz = Math.abs(z - ctr.z) - (TD / 2 - rr); return Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0) - rr; };
  const HOFF = new Float32Array((NG + 1) * (NG + 1)), HY = new Float32Array((NG + 1) * (NG + 1));
  for (let j = 0; j <= NG; j++) for (let i = 0; i <= NG; i++) { const x = x0 + i * dx, z = z0 + j * dz, d = dTrack(x, z), sd = sdRR(x, z);
    const roll = (TR.base + TR.amp * fbm(x / TR.noiseScale, z / TR.noiseScale)) * sst(TR.flatInside, TR.riseTo, d) * (1 - sst(-TR.edge * 2.2, -TR.edge * 0.4, sd));
    HOFF[j * (NG + 1) + i] = roll; HY[j * (NG + 1) + i] = GY + roll - TR.edgeDrop * sst(-TR.edge, 4, sd); }
  const sampleGrid = (A, x, z) => { const fx = clamp((x - x0) / dx, 0, NG - 1e-4), fz = clamp((z - z0) / dz, 0, NG - 1e-4), i = Math.floor(fx), j = Math.floor(fz), u = fx - i, w = fz - j, R1 = NG + 1;
    return lerp(lerp(A[j * R1 + i], A[j * R1 + i + 1], u), lerp(A[(j + 1) * R1 + i], A[(j + 1) * R1 + i + 1], u), w); };
  const groundAt = (x, z) => sampleGrid(HY, x, z), offAt = (x, z) => sampleGrid(HOFF, x, z);
  const tgeo = new THREE.PlaneGeometry(TW, TD, NG, NG); tgeo.rotateX(-Math.PI / 2); tgeo.translate(ctr.x, 0, ctr.z);
  { const p = tgeo.attributes.position; for (let k = 0; k < p.count; k++) { const i = Math.round((p.getX(k) - x0) / dx), j = Math.round((p.getZ(k) - z0) / dz); p.setY(k, HY[clamp(j, 0, NG) * (NG + 1) + clamp(i, 0, NG)]); } p.needsUpdate = true; tgeo.computeVertexNormals(); }
  seedGeometry(THREE, tgeo, 77); const terrain = new THREE.Mesh(tgeo, M.table); terrain.name = 'j02-gelaende'; terrain.receiveShadow = true; scene.add(terrain); info.terrainTris = NG * NG * 2;
  // T4-Tisch aus, T4-Deko aufs Gelände legen (nur Weltkoordinaten-Meshes, jede Geometrie einmal)
  { const done = new Set(), I = new THREE.Matrix4(); root.updateMatrixWorld(true);
    root.traverse(o => { if (o.name === 'tisch') { o.visible = false; return; } if (!o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || !o.geometry?.attributes?.position) return;
      if (!o.matrixWorld.equals(I) || done.has(o.geometry)) return; done.add(o.geometry); const p = o.geometry.attributes.position; let moved = false;
      for (let k = 0; k < p.count; k++) { const off = offAt(p.getX(k), p.getZ(k)); if (off > 0.02) { p.setY(k, p.getY(k) + off); moved = true; } }
      if (moved) { p.needsUpdate = true; o.geometry.computeBoundingSphere(); o.geometry.computeBoundingBox(); info.draped++; } }); }
  /* Fassaden: Vorstufe aus H0/D1 (clay-soften.v1, HOWTO §2) + feineres Relief. Gemergt, deshalb absolute Maße statt objektrelativ. */
  { const FS = RC.facade; if (FS.on && T.M.kk) { onNote('Fassaden werden geknetet …'); await new Promise(r => setTimeout(r, 0)); const t1 = performance.now();
      root.traverse(o => { if (!o.isMesh || o.material !== T.M.kk || o.userData.softened) return; o.geometry.computeBoundingBox(); const diag = o.geometry.boundingBox.getSize(new THREE.Vector3()).length();
        const r = softenGeometry(THREE, o.geometry, { relative: false, maxEdge: FS.maxEdge, maxLevels: FS.maxLevels, iters: FS.iters, lambda: 0.5, mu: -0.53, lump: FS.lumpM / diag, lumpFreq: diag / (3 * FS.lumpWaveM), maxTris: FS.maxTris, seed: 5 });
        const gN = FS.faceNormalsDeg ? faceNormals(r.geometry, FS.faceNormalsDeg) : r.geometry; seedGeometry(THREE, gN, 811); o.geometry.dispose(); o.geometry = gN; o.userData.softened = true; info.facade = { tris: Math.round(r.tris), levels: r.levels, ms: Math.round(performance.now() - t1) }; });
      if (T.M.kk.userData.clay) T.M.kk.userData.clay.S.value *= FS.reliefK; } }
  /* Leicht-Pass L1 */
  onNote('Welt wird in Kacheln geteilt …'); await new Promise(r => setTimeout(r, 0));
  info.chunks = chunkify(scene, RC.lean.chunk); info.noCast = thinNoCast(scene);
  const SH = RC.lean.shadow, shadowFit = makeShadowFollow(T.renderer, T.sun, SH); info.shadow = shadowFit.state;
  const WOB = makeWobble(); WOB.patch(T.M.strangT); WOB.patch(T.M.strang); st.run = false;   // T4-Karts ruhen: sonst streuen unsichtbare Karts VFX
  const setProfile = p => { info.profile = p; const lean = p === 'leicht'; st.fast = lean; T.renderer.setPixelRatio(lean ? 1 : Math.min(2, window.devicePixelRatio || 1)); if (T.info.guard) T.info.guard.level = 3;
    if (lean) info.sheenOff = clayLite(scene, U, { lodK: RC.lean.lodK }); else if (U.uClayLodK) U.uClayLodK.value = 1; window.dispatchEvent(new Event('resize')); };
  setProfile(opts.profile || 'leicht');

  /* ---------- KFB-Fahrphysik K1 im Streckenrahmen ---------- */
  const D = RC.drive, FR = makeFrame(S, T.ds), drv = createDriver(RC.drive.startS ?? 60); let assist = opts.assist ?? D.assist, motorK = opts.motorK ?? D.motorK;
  const reset = () => { const s0 = drv.s; Object.assign(drv, createDriver(Math.max(4, s0 - 4))); };

  /* ---------- KayKit-Fahrzeuge in Knete ---------- */
  const loader = new GLTFLoader(), carG = new THREE.Group(); carG.name = 'j02-auto'; scene.add(carG);
  const cars = {}; let carId = null, wheelNodes = [];
  const loadCar = async id => { if (cars[id]) return cars[id]; const Vd = RC.vehicles.list.find(v => v.id === id); const g = await loader.loadAsync(RC.vehicles.base + Vd.file);
    const holder = new THREE.Group(), model = g.scene; holder.add(model); model.updateMatrixWorld(true);
    let box = new THREE.Box3().setFromObject(model), sz = box.getSize(new THREE.Vector3()); if (sz.x > sz.z) { model.rotation.y = Math.PI / 2; model.updateMatrixWorld(true); box = new THREE.Box3().setFromObject(model); sz = box.getSize(sz); }
    const k = RC.vehicles.len / Math.max(sz.x, sz.z); model.scale.multiplyScalar(k); model.updateMatrixWorld(true); box = new THREE.Box3().setFromObject(model); const c = box.getCenter(new THREE.Vector3());
    model.position.x -= c.x; model.position.z -= c.z; model.position.y -= box.min.y; let seed = 3100 + Object.keys(cars).length * 40; const wheels = [];
    model.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; try { seedGeometry(THREE, o.geometry, seed++); const wrap = mm => makeClayMaterial(THREE, U, { src: mm, profile: 'vehicle' }); o.material = Array.isArray(o.material) ? o.material.map(wrap) : wrap(o.material); } catch (e) { info.errors.push('Knete Auto: ' + e.message); } }
      if (/wheel/i.test(o.name) && o !== model && o.isMesh) { o.geometry.computeBoundingBox(); const bb = o.geometry.boundingBox, cc = bb.getCenter(new THREE.Vector3()), ss = bb.getSize(new THREE.Vector3()); if (cc.length() < 0.2 * Math.max(ss.y, ss.z)) wheels.push(o); } });
    return (cars[id] = { id, label: Vd.label, file: Vd.file, holder, wheels: wheels.filter(w => !wheels.some(p => p !== w && w.parent === p)) }); };
  const setCar = async id => { try { const c = await loadCar(id); carG.clear(); carG.add(c.holder); c.holder.position.set(0, 0, 0); carId = id; wheelNodes = c.wheels; fitWheels(c); info.vehicle = c.label + ' · ' + c.file; } catch (e) { info.errors.push('Auto ' + id + ': ' + e.message); } };
  /* Radkontakt gemessen: Physik-Räder sitzen dort, wo das Modell seine Räder hat, mit dessen Radius; das Modell folgt den Radmitten der Physik. */
  const vis = { wy: 0 }, _Y = new THREE.Vector3(0, 1, 0), _X = new THREE.Vector3(1, 0, 0), _qs = new THREE.Quaternion();
  const fitWheels = c => { c.holder.updateMatrixWorld(true); const inv = new THREE.Matrix4().copy(c.holder.matrixWorld).invert(), pts = [];
    for (const w of c.wheels) { const b = new THREE.Box3().setFromObject(w).applyMatrix4(inv), ctr = b.getCenter(new THREE.Vector3()), sz = b.getSize(new THREE.Vector3()); pts.push({ w, x: ctr.x, y: ctr.y, z: ctr.z, r: Math.max(sz.y, sz.z) / 2 }); w.userData.spin = 0; w.userData.front = ctr.z > 0; }
    const box = new THREE.Box3().setFromObject(c.holder).applyMatrix4(inv); c.halfW = (box.max.x - box.min.x) / 2;
    c.wr = pts.length ? pts.reduce((a, p) => a + p.r, 0) / pts.length : 0.33; vis.wy = 0;   // Modell steht mit Radunterkante auf y = 0 (loadCar), die Fahrbahn ist die Bezugsfläche
    info.wheelFit = pts.length ? pts.length + ' Räder · r ' + c.wr.toFixed(2) + ' m · Breite ' + (2 * c.halfW).toFixed(2) + ' m' : 'Räder nicht getrennt'; };
  onNote('KayKit-Auto wird geknetet …'); await setCar(opts.vehicle || RC.vehicles.list[0].id);

  /* ---------- Tafeln: B0-Billboard, knetig, als Holz-/Pappaufsteller ---------- */
  const BB = RC.billboards, boards = [];
  const bbMod = import('../bb-scene.js').catch(e => { info.errors.push('bb-scene: ' + e.message); return null; });
  const woodMat = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color: '#c99a64' }), profile: 'nature' });
  const kraftMat = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color: '#b98d5c' }), profile: 'prop' });
  const bagMat = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color: '#e2d0bc' }), profile: 'figure' });
  const spots = []; { const L = S[N - 1].s;
    for (let s = 120; s < L - 120 && spots.length < BB.boards.length; s += 20) { const i = Math.round(s / T.ds), q = S[i]; if (Math.abs(q.kappa || 0) > 0.02 || q.tags.some(t => /LOOP|SPIRAL|KICKER|HAIRPIN/.test(t)) || (q.prm.surface ?? 1) < 1) continue;
      if (spots.some(sp => Math.abs(sp.s - s) < BB.minGapS)) continue;
      for (const side of [1, -1]) { const p = V(W3(q, (q.prm.offset || 0) + side * BB.lateral, 0)); if (dTrack(p.x, p.z) < BB.lateral - 4 || offAt(p.x, p.z) > 0.3) continue;
        spots.push({ s, p, face: V(q.R).multiplyScalar(-side).setY(0).normalize() }); break; } } }
  info.spots = spots.length;
  const loadPD = id => new Promise((res, rej) => { const P = BB.pd.pool[id]; if (!P) return rej(new Error('PD ' + id)); const im = new Image(); im.crossOrigin = 'anonymous';
    im.onload = () => { const c = document.createElement('canvas'); c.width = im.naturalWidth || 800; c.height = im.naturalHeight || 600; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); res({ canvas: c, ...P, id }); }; im.onerror = () => rej(new Error('PD load ' + id)); im.src = BB.pd.base + P.path; });
  (async () => { const bb = await bbMod; if (!bb) return;
    for (let n = 0; n < spots.length; n++) { const bd = BB.boards[n], sp = spots[n];
      try { const faceW0 = Math.sqrt(BB.faceArea * 2), hero = await bb.loadHero(GLTFLoader, 'billboard.glb', faceW0), holder = hero.group, meshes = [], panels = []; holder.updateMatrixWorld(true);
        const bake = []; hero.model.traverse(o => { if (o.isMesh) bake.push(o); });
        for (const o of bake) { const g = o.geometry.clone().applyMatrix4(o.matrixWorld), p = g.attributes.position;   // leicht gebogen: Kenney-Kanten weich
          for (let k = 0; k < p.count; k++) { const x = p.getX(k), y = p.getY(k), z = p.getZ(k); p.setXYZ(k, x * (1 + 0.025 * Math.sin(y * 0.9 + n)), y, z + 0.06 * Math.sin(x * 0.55) * (y / (hero.measuredM.y || 1))); }
          g.computeVertexNormals(); seedGeometry(THREE, g, 9700 + n * 20 + meshes.length); const nm = new THREE.Mesh(g, woodMat); nm.userData.src = Float32Array.from(p.array); nm.castShadow = nm.receiveShadow = true; meshes.push(nm); }
        holder.remove(hero.model); meshes.forEach(m => holder.add(m)); holder.traverse(o => { if (o.isMesh && o.name === 'billboard-card-surface') panels.push(o); });
        if (panels[1]) panels[1].material = kraftMat;
        const B = { id: bd.id, holder, meshes, panels, area: BB.faceArea, w0: hero.panelW, h0: hero.panelH, fb: panels[0].position.y - hero.panelH / 2, cx: panels[0].position.x, status: 'Körper ok', src: '' };
        const fit = ar => { const w = Math.sqrt(B.area * ar), h = Math.sqrt(B.area / ar), sx = w / B.w0, sy = h / B.h0;
          for (const m of B.meshes) { const p = m.geometry.attributes.position, s = m.userData.src; for (let k = 0; k < p.count; k++) { const x = s[k * 3], y = s[k * 3 + 1]; p.setXYZ(k, B.cx + (x - B.cx) * sx, y < B.fb ? y : B.fb + (y - B.fb) * sy, s[k * 3 + 2]); } p.needsUpdate = true; m.geometry.computeVertexNormals(); m.geometry.computeBoundingSphere(); }
          for (const pnl of B.panels) { pnl.geometry.dispose(); pnl.geometry = new THREE.PlaneGeometry(w, h); pnl.position.set(B.cx, B.fb + h / 2, pnl.position.z); }
          B.w = w; B.h = h; strut.scale.set(Math.max(1, w / 10), (B.fb + h) / 10, 1); };
        const pz = panels[0].position.z - Math.max(0.6, hero.measuredM.z);
        const strut = new THREE.Group(); { const g = new RoundedBoxGeometry(3.2, 10, 0.5, 2, 0.2); g.translate(0, 5, 0); seedGeometry(THREE, g, 9790 + n); const m = new THREE.Mesh(g, kraftMat); m.rotation.x = -0.42; m.position.z = pz - 0.2; m.castShadow = true; strut.add(m); } holder.add(strut);
        for (const sx of [-1, 1]) { const g = new THREE.SphereGeometry(1, 18, 12); g.scale(1.5, 0.75, 1.1); seedGeometry(THREE, g, 9795 + n * 2 + sx); const m = new THREE.Mesh(g, bagMat); m.position.set(B.cx + sx * (hero.panelW * 0.32), 0.45, pz + 0.6); m.castShadow = true; holder.add(m); }
        const content = new bb.BillboardContent(panels[0], { fetch: false }); B.content = content;
        holder.position.set(sp.p.x, groundAt(sp.p.x, sp.p.z) - 0.1, sp.p.z); holder.rotation.y = Math.atan2(sp.face.x, sp.face.z); scene.add(holder); boards.push(B); info.boards.push(B);
        const c = bd.content;
        try { if (c.kind === 'card') { const r = await bb.renderCardQuarter({ packId: c.packId, n: c.n }); content.setSource(r.canvas, { ar: r.ar }); fit(r.ar); B.src = r.title + ' · Karte ' + c.n + ' · S. ' + r.page; }
          else if (c.kind === 'cover') { const r = await bb.renderDeckPage(c.packId, c.page || 1); content.setSource(r.canvas, { ar: r.ar }); fit(r.ar); B.src = r.title + ' · Cover'; }
          else if (c.kind === 'pd-still') { const r = await loadPD(c.id); content.setSource(r.canvas, { ar: r.canvas.width / r.canvas.height }); fit(r.canvas.width / r.canvas.height); B.src = r.title + ' · ' + r.rights; }
          B.status = c.kind; } catch (e) { B.status = 'Inhalt fehlt: ' + e.message; info.errors.push(bd.id + ': ' + e.message); }
        B.shot = { pos: holder.position.clone().addScaledVector(sp.face, 26).add(new THREE.Vector3(0, 6, 0)), tgt: holder.position.clone().add(new THREE.Vector3(0, B.fb + (B.h || 5) / 2, 0)) };
      } catch (e) { info.errors.push('Tafel ' + bd.id + ': ' + e.message); } } })();

  /* ---------- Eingabe (Race v0.8 CONTROLS) ---------- */
  const K = { gas: 0, brake: 0, left: 0, right: 0, driftL: 0, driftR: 0, boost: 0, jump: 0 }, KEYS = D.keys;
  const keyOf = code => Object.keys(KEYS).find(k => KEYS[k].includes(code));
  const onKey = down => e => { const k = keyOf(e.code); if (!k) return; if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
    if (k === 'reset') { if (down) reset(); return; } K[k] = down ? 1 : 0; };
  const kd = onKey(true), ku = onKey(false); window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
  const blur = () => Object.keys(K).forEach(k => K[k] = 0); window.addEventListener('blur', blur);
  const ALIAS = { fwd: 'gas', back: 'brake', hop: 'jump' };

  /* ---------- Kamera auf der Streckenschiene (Verfahren railClamp, Cologne C-3) ---------- */
  const CAM = D.camera, camPos = new THREE.Vector3(), camUp = new THREE.Vector3(0, 1, 0), camInit = { v: false };
  let mode = opts.mode || 'fahren'; const setMode = m => { mode = m; if (m === 'fahren') { st.cam = 'extern'; T.controls.enabled = false; camInit.v = false; }
    else if (m === 'tafel') { const B = boards.find(b => b.shot); if (!B) { mode = 'totale'; camera.fov = 38; camera.updateProjectionMatrix(); T.shot('totale'); return; } st.cam = 'extern'; T.controls.enabled = true; camera.fov = 45; camera.up.set(0, 1, 0); camera.updateProjectionMatrix(); camera.position.copy(B.shot.pos); T.controls.target.copy(B.shot.tgt); T.controls.update(); }
    else { camera.fov = 38; camera.up.set(0, 1, 0); camera.updateProjectionMatrix(); T.shot(m); } };
  setMode(mode);

  /* ---------- Takt ---------- */
  const pk = { s: 0, lat: 0, v: 0 };
  const mB = new THREE.Matrix4(), vX = new THREE.Vector3(), vU = new THREE.Vector3(), vF = new THREE.Vector3(), qSq = new THREE.Quaternion(), qTilt = new THREE.Quaternion(), eT = new THREE.Euler();
  let fr = 0, fT = performance.now();
  T.hooks.push((dt, t) => {
    const halfW = cars[carId]?.halfW || FLOW.proxyHalfWidth;
    const q = stepDriver(drv, FR, K, dt, { assist, motorK, halfWidth: halfW });
    const P = pose(drv, q); vX.fromArray(P.X); vU.fromArray(P.U); vF.fromArray(P.F);
    mB.makeBasis(vX, vU, vF); carG.position.fromArray(P.P); carG.quaternion.setFromRotationMatrix(mB);
    if (!P.fly) carG.quaternion.multiply(qTilt.setFromEuler(eT.set(drv.pitch, 0, -drv.roll)));
    const sq = drv.squash, holder = cars[carId]?.holder; if (holder) holder.scale.set(1 + 0.12 * sq, 1 - 0.18 * sq, 1 + 0.06 * sq);
    info.speed = Math.abs(drv.fly ? Math.hypot(drv.fly.V[0], drv.fly.V[1], drv.fly.V[2]) : drv.speed) * 3.6; info.air = !!drv.fly || !drv.onGround; info.fly = !!drv.fly; info.s = drv.s; info.hits = drv.hits; info.wall = drv.atWall; st.moodS = drv.s;
    const wr = cars[carId]?.wr || 0.33, spinD = drv.speed * dt / wr;
    for (const w of wheelNodes) { w.userData.spin = (w.userData.spin || 0) + spinD; const q0 = w.userData.q0 || (w.userData.q0 = w.quaternion.clone());
      w.quaternion.setFromAxisAngle(_Y, w.userData.front ? drv.steerAngle * 0.8 : 0).multiply(q0).multiply(_qs.setFromAxisAngle(_X, w.userData.spin)); }
    if (mode === 'fahren') shadowFit(carG.position.clone().addScaledVector(vF, SH.ahead), SH.rDrive);
    else shadowFit(T.controls.target, clamp(camera.position.distanceTo(T.controls.target) * SH.rK, SH.rMin, SH.rMax));
    WOB.tick(t);
    /* Clay-VFX am Spielerauto: T4-Fahrer (Rollen, Kurven-Drift, Boost-Pads, Landung) + eigene Ereignisse (Bande, Drift, Aufsetzen) */
    const VX = T.VFX; pk.s = drv.s; pk.lat = q.c + drv.lat; pk.v = Math.abs(drv.speed); if (!drv.fly) T.KD.tick([pk], dt, true);
    const mix = T.AT.vfxBiome(drv.s), bio = mix.w > 0.5 ? mix.b : mix.a, gy = q.p[1];
    for (const ev of drv.events) { if (ev.type === 'hit') { const side = ev.side, cp = new THREE.Vector3(q.p[0] + q.R[0] * (q.c + side * (q.half + 0.5)) + q.U[0] * 0.8, q.p[1] + q.R[1] * (q.c + side * (q.half + 0.5)) + q.U[1] * 0.8, q.p[2] + q.R[2] * (q.c + side * (q.half + 0.5)) + q.U[2] * 0.8);
        WOB.hit(cp, RC.drive.wall.wobble * ev.energy, t); VX.emit('scrape', T.AT.barrierBiome(drv.s, side), { pos: cp, dir: vF.clone().multiplyScalar(0.7).add(vU.clone().multiplyScalar(0.5)), groundY: gy, energy: ev.energy, carry: vF.clone().multiplyScalar(pk.v * 0.35) }); }
      if (ev.type === 'land') VX.emit('landing', bio, { pos: carG.position.clone(), dir: new THREE.Vector3(0, 1, 0), groundY: gy, energy: clamp(ev.energy, 0.4, 1) }); }
    if (drv.drift > 0.3 && !drv.fly) { pk.dAcc = (pk.dAcc || 0) + dt * 26 * drv.drift; while (pk.dAcc >= 1) { pk.dAcc -= 1; const out = drv.driftDir || 1, pos = carG.position.clone().addScaledVector(vF, -1.5).addScaledVector(vX, out * 0.8);
      VX.emit('drift', bio, { pos, dir: vX.clone().multiplyScalar(out).addScaledVector(vF, -0.5).addScaledVector(vU, 0.35), groundY: gy, count: 1, carry: vF.clone().multiplyScalar(pk.v * 0.3) }); } }
    if (mode === 'fahren') { const sp = Math.abs(drv.speed) / FLOW.maxForward, boom = CAM.boom + sp * CAM.boomSpeed;
      if (drv.fly) { const fh = new THREE.Vector3(vF.x, 0, vF.z).normalize(), want = carG.position.clone().addScaledVector(fh, -boom).add(new THREE.Vector3(0, CAM.height + 1.2, 0)); camPos.lerp(want, 1 - Math.exp(-dt * CAM.follow)); camUp.lerp(new THREE.Vector3(0, 1, 0), 1 - Math.exp(-dt * 4)).normalize(); camera.up.copy(camUp); camera.position.copy(camPos); camera.lookAt(carG.position.x + fh.x * 10, carG.position.y, carG.position.z + fh.z * 10); }
      else {
      const qc = FR.at(drv.s - boom), latC = clamp(q.c + drv.lat * CAM.latFollow, qc.c - qc.half - CAM.side, qc.c + qc.half + CAM.side), hC = CAM.height + sp * 0.9;
      const want = new THREE.Vector3(qc.p[0] + qc.R[0] * latC + qc.U[0] * hC, qc.p[1] + qc.R[1] * latC + qc.U[1] * hC, qc.p[2] + qc.R[2] * latC + qc.U[2] * hC);
      if (!camInit.v || camPos.distanceTo(want) > 55) { camPos.copy(want); camUp.fromArray(qc.U); camInit.v = true; } else camPos.lerp(want, 1 - Math.exp(-dt * CAM.follow));
      camUp.lerp(vU, 1 - Math.exp(-dt * 4)).normalize(); camera.up.copy(camUp); camera.position.copy(camPos);
      camera.lookAt(carG.position.x + vF.x * 11 + vU.x * 1.2, carG.position.y + vF.y * 11 + vU.y * 1.2, carG.position.z + vF.z * 11 + vU.z * 1.2);
      }
      const fov = CAM.fov + sp * 14 + (drv.boosting ? 7 : 0); if (Math.abs(camera.fov - fov) > 0.05) { camera.fov += (fov - camera.fov) * Math.min(1, dt * 4); camera.updateProjectionMatrix(); } }
    else if (mode === 'tafel') T.controls.update();
    for (const B of boards) B.content && B.content.update(dt);
    fr++; const now = performance.now(); if (now - fT > 1000) { info.fps = Math.round(fr * 1000 / (now - fT)); fr = 0; fT = now; }
    info.calls = T.info.calls; info.frameTris = T.info.frameTris; });
  info.loadMs = Math.round(performance.now() - t0);

  return { info, T, RC, cars, drv,
    setCar, setMode, setProfile, reset, get mode() { return mode; }, get vehicleId() { return carId; },
    key(name, down) { name = ALIAS[name] || name; if (name === 'reset') { if (down) reset(); return; } if (name in K) K[name] = down ? 1 : 0; },
    set(k, v) { if (k === 'world') T.set('world', v); else if (k === 'vfx') T.set('vfx', v); else if (k === 'karts') { T.karts.forEach(kk => kk.obj.g.visible = !!v); st.run = !!v; } else if (k === 'motorK') motorK = +v; else if (k === 'assist') assist = +v; },
    dispose() { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); window.removeEventListener('blur', blur); T.dispose(); } };
}
