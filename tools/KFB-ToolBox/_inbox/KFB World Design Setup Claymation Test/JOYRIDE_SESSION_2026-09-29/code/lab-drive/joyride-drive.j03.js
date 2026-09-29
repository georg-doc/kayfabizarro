/* KFB Joyride J03 · Knet-Strecke fahren, Leicht-Pass (29.09.) · Basis J02, Änderungen: lean-pass.l1 (Chunks, Schatten-Rezept, GTAO aus), Fassaden-Vorstufe, gemessene Radkontakte.
 * KFB Joyride J02 · Knet-Strecke fahren (29.09.)
 * Welt = T4 (lab-track/track-look.v5.js) unverändert: TD03, K2, M2, Übergänge, Clay-VFX.
 * Dazu: rollendes Knet-Gelände (ersetzt den flachen Tisch außerhalb der Strecke), Ammo-RaycastVehicle aus Georgs
 * PlayCanvas-Fork (vehicle.mjs / follow-camera.mjs, Werte aus scenes.json), KayKit-Autos in Knete, B0-Tafeln.
 * Ein Renderer (three), eine Welt, ein Fahrer. Rezept: lab-drive/joyride.j02.json. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { boot as bootT4 } from '../lab-track/track-look.v5.js?r=20';
import { makeClayMaterial, seedGeometry } from '../lab-clay/clay-material.v10.js?r=2';
import { softenGeometry } from '../lab-clay/clay-soften.v1.js';
import { chunkify, makeFitShadow, thinNoCast, clayLite } from './lean-pass.l1.js?r=1';

const clamp = (x, a, b) => Math.min(b, Math.max(a, x)), lerp = (a, b, t) => a + (b - a) * t;
const sst = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const h2 = (i, j) => { const v = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return v - Math.floor(v); };
const vn2 = (x, z) => { const i = Math.floor(x), j = Math.floor(z), fx = x - i, fz = z - j, u = fx * fx * (3 - 2 * fx), w = fz * fz * (3 - 2 * fz);
  return lerp(lerp(h2(i, j), h2(i + 1, j), u), lerp(h2(i, j + 1), h2(i + 1, j + 1), u), w); };
const fbm = (x, z) => 0.55 * vn2(x, z) + 0.3 * vn2(x * 2.1 + 5.3, z * 2.1 - 1.7) + 0.15 * vn2(x * 4.3 - 2.2, z * 4.3 + 7.1);
const V = a => new THREE.Vector3(a[0], a[1], a[2]);

async function loadAmmo() {
  if (!window.Ammo) await new Promise((res, rej) => { const s = document.createElement('script'); s.src = new URL('./ammo.js', import.meta.url).href; s.onload = res; s.onerror = () => rej(new Error('ammo.js')); document.head.appendChild(s); });
  if (window.__kfbAmmo) return window.__kfbAmmo;
  const lib = await new Promise(res => window.Ammo().then(m => { try { m.then = undefined; } catch (e) {} res(m); }));
  return (window.__kfbAmmo = lib);
}

export async function boot(canvas, onNote = () => {}, opts = {}) {
  const t0 = performance.now();
  const RC = await fetch(new URL('./joyride.j03.json', import.meta.url).href + '?r=' + Date.now()).then(r => r.json());
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
        seedGeometry(THREE, r.geometry, 811); o.geometry.dispose(); o.geometry = r.geometry; o.userData.softened = true; info.facade = { tris: Math.round(r.tris), levels: r.levels, ms: Math.round(performance.now() - t1) }; });
      if (T.M.kk.userData.clay) T.M.kk.userData.clay.S.value *= FS.reliefK; } }
  /* Leicht-Pass L1 */
  onNote('Welt wird in Kacheln geteilt …'); await new Promise(r => setTimeout(r, 0));
  info.chunks = chunkify(scene, RC.lean.chunk); info.noCast = thinNoCast(scene);
  const LEAN = { fit: makeFitShadow(T.renderer, T.sun, RC.lean.shadow) };
  const setProfile = p => { info.profile = p; const lean = p === 'leicht'; st.fast = lean; T.renderer.setPixelRatio(lean ? 1 : Math.min(2, window.devicePixelRatio || 1)); if (T.info.guard) T.info.guard.level = 3;
    if (lean) info.sheenOff = clayLite(scene, U, { lodK: RC.lean.lodK }); else if (U.uClayLodK) U.uClayLodK.value = 1; window.dispatchEvent(new Event('resize')); };
  setProfile(opts.profile || 'leicht');

  /* ---------- Physik: Ammo aus dem Fork ---------- */
  onNote('Fahrphysik (Ammo, PlayCanvas-Fork) …');
  const A = await loadAmmo(), D = RC.drive;
  const cfg = new A.btDefaultCollisionConfiguration(), disp = new A.btCollisionDispatcher(cfg), bp = new A.btDbvtBroadphase(), solver = new A.btSequentialImpulseConstraintSolver();
  const world = new A.btDiscreteDynamicsWorld(disp, bp, solver, cfg); world.setGravity(new A.btVector3(0, D.gravity, 0));
  const tv = [new A.btVector3(), new A.btVector3(), new A.btVector3()];
  const staticMesh = (pos, idx, friction = 0.8) => { const tm = new A.btTriangleMesh(true, true); for (let k = 0; k < idx.length; k += 3) { for (let c = 0; c < 3; c++) { const b = idx[k + c] * 3; tv[c].setValue(pos[b], pos[b + 1], pos[b + 2]); } tm.addTriangle(tv[0], tv[1], tv[2], false); }
    const sh = new A.btBvhTriangleMeshShape(tm, true, true), tr = new A.btTransform(); tr.setIdentity(); const ms = new A.btDefaultMotionState(tr), ci = new A.btRigidBodyConstructionInfo(0, ms, sh, new A.btVector3(0, 0, 0));
    const body = new A.btRigidBody(ci); body.setFriction(friction); body.setRestitution(0.2); world.addRigidBody(body); info.colTris += idx.length / 3; return body; };
  { const pos = [], idx = [], NR = 14; let base = -1, prevOk = false;   // Streckenkörper aus den Stream-Slots: Fahrbahn, Schultern, Banden, Unterseite
    for (let i = 0; i < N; i += 2) { const q = S[i], ok = (q.prm.surface ?? 1) >= 0.5 && !q.brk; if (!ok) { prevOk = false; continue; }
      const b = pos.length / 3; for (const sl of q.slots) pos.push(...W3(q, sl[0], sl[1]));
      if (prevOk) for (let j = 0; j < NR; j++) { const j2 = (j + 1) % NR; idx.push(base + j, b + j, base + j2, base + j2, b + j, b + j2); }
      base = b; prevOk = true; }
    staticMesh(pos, idx, 0.9); }
  { const st2 = TR.physicsStep, n = Math.floor(NG / st2), pos = [], idx = [];   // Gelände gröber
    for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) pos.push(x0 + i * st2 * dx, HY[(j * st2) * (NG + 1) + i * st2], z0 + j * st2 * dz);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const a = j * (n + 1) + i, b = a + 1, c = a + n + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
    staticMesh(pos, idx, 0.8); }

  const C = D.chassis, WH = D.wheel, EG = D.engine2, JY = D.joyride;
  const comp = new A.btCompoundShape(), trL = new A.btTransform();
  trL.setIdentity(); trL.setOrigin(new A.btVector3(...C.capsuleZ.at)); comp.addChildShape(trL, new A.btCapsuleShapeZ(C.capsuleZ.r, C.capsuleZ.h));
  trL.setIdentity(); trL.setOrigin(new A.btVector3(...C.box.at)); comp.addChildShape(trL, new A.btBoxShape(new A.btVector3(...C.box.half)));
  const inertia = new A.btVector3(0, 0, 0); comp.calculateLocalInertia(C.mass, inertia);
  const startTr = new A.btTransform(); startTr.setIdentity();
  const chMS = new A.btDefaultMotionState(startTr), chassis = new A.btRigidBody(new A.btRigidBodyConstructionInfo(C.mass, chMS, comp, inertia));
  chassis.setFriction(C.friction); chassis.setRestitution(C.restitution); chassis.setActivationState(4); world.addRigidBody(chassis);
  const tuning = new A.btVehicleTuning(), vehicle = new A.btRaycastVehicle(tuning, chassis, new A.btDefaultVehicleRaycaster(world)); vehicle.setCoordinateSystem(0, 1, 2);
  { const axle = new A.btVector3(-1, 0, 0), dir = new A.btVector3(0, -1, 0), con = new A.btVector3();
    for (const w of D.wheels) { con.setValue(...w.at); const wi = vehicle.addWheel(con, dir, axle, WH.suspensionRestLength, WH.radius, tuning, w.front);
      wi.set_m_suspensionStiffness(WH.suspensionStiffness); wi.set_m_wheelsDampingRelaxation(WH.suspensionDamping); wi.set_m_wheelsDampingCompression(WH.suspensionCompression); wi.set_m_frictionSlip(WH.frictionSlip); wi.set_m_rollInfluence(WH.rollInfluence); } }
  world.addAction(vehicle);
  const placeCar = (s, lift = 1.2) => { const i = clamp(Math.round(s / T.ds), 0, N - 1), q = S[i], R = V(q.R), Uv = V(q.U), Tv = V(q.T), m = new THREE.Matrix4().makeBasis(R.clone().negate(), Uv, Tv), qt = new THREE.Quaternion().setFromRotationMatrix(m);
    const p = V(W3(q, (q.prm.offset || 0) - 3.2, 0)).addScaledVector(Uv, lift), tr = new A.btTransform(); tr.setIdentity(); tr.setOrigin(new A.btVector3(p.x, p.y, p.z)); tr.setRotation(new A.btQuaternion(qt.x, qt.y, qt.z, qt.w));
    chassis.setWorldTransform(tr); chMS.setWorldTransform(tr); chassis.setLinearVelocity(new A.btVector3(0, 0, 0)); chassis.setAngularVelocity(new A.btVector3(0, 0, 0)); vehicle.resetSuspension(); };
  const startS = S[(RC.startIndex ?? 0) || Math.round(60 / T.ds)].s; placeCar(startS);

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
  const setCar = async id => { try { const c = await loadCar(id); carG.clear(); carG.add(c.holder); c.holder.position.set(0, 0, 0); carId = id; wheelNodes = c.wheels; fitWheels(c); info.vehicle = c.label + ' · ' + c.file + (c.wheels.length ? ' · ' + c.wheels.length + ' Räder gemessen, r ' + c.wr.toFixed(2) + ' m' : ' · Räder nicht getrennt'); } catch (e) { info.errors.push('Auto ' + id + ': ' + e.message); } };
  /* Radkontakt gemessen: Physik-Räder sitzen dort, wo das Modell seine Räder hat, mit dessen Radius; das Modell folgt den Radmitten der Physik. */
  const vis = { wy: 0 }, _Y = new THREE.Vector3(0, 1, 0), _X = new THREE.Vector3(1, 0, 0), _qs = new THREE.Quaternion();
  const fitWheels = c => { c.holder.updateMatrixWorld(true); const inv = new THREE.Matrix4().copy(c.holder.matrixWorld).invert(), pts = [];
    for (const w of c.wheels) { const b = new THREE.Box3().setFromObject(w).applyMatrix4(inv), ctr = b.getCenter(new THREE.Vector3()), sz = b.getSize(new THREE.Vector3()); pts.push({ w, x: ctr.x, y: ctr.y, z: ctr.z, r: Math.max(sz.y, sz.z) / 2 }); w.userData.spin = 0; }
    if (pts.length === 4) { const r = pts.reduce((a, p) => a + p.r, 0) / 4, cy = pts.reduce((a, p) => a + p.y, 0) / 4; c.wr = r; vis.wy = cy;
      D.wheels.forEach((dw, i) => { const [sx, , sz] = dw.at, p = pts.find(q => Math.sign(q.x) === Math.sign(sx) && Math.sign(q.z) === Math.sign(sz)) || pts[i]; const wi = vehicle.getWheelInfo(i);
        wi.set_m_chassisConnectionPointCS(new A.btVector3(p.x, cy + WH.suspensionRestLength, p.z)); wi.set_m_wheelsRadius(r); p.w.userData.front = dw.front; });
      info.wheelFit = pts.map(p => [p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2)].join('/')).join(' · '); }
    else { c.wr = WH.radius; vis.wy = WH.radius; } vehicle.resetSuspension(); };
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
        // Stoßkörper: Pfosten + Tafel als eine Box, das Auto prallt ab
        const half = new A.btVector3(Math.max(2, (B.w || hero.panelW) / 2), (B.fb + (B.h || hero.panelH)) / 2, 0.8), sh = new A.btBoxShape(half), tr = new A.btTransform(); tr.setIdentity();
        const hq = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, holder.rotation.y, 0)); tr.setOrigin(new A.btVector3(holder.position.x, holder.position.y + half.y(), holder.position.z)); tr.setRotation(new A.btQuaternion(hq.x, hq.y, hq.z, hq.w));
        const body = new A.btRigidBody(new A.btRigidBodyConstructionInfo(0, new A.btDefaultMotionState(tr), sh, new A.btVector3(0, 0, 0))); body.setRestitution(0.6); world.addRigidBody(body);
        B.shot = { pos: holder.position.clone().addScaledVector(sp.face, 26).add(new THREE.Vector3(0, 6, 0)), tgt: holder.position.clone().add(new THREE.Vector3(0, B.fb + (B.h || 5) / 2, 0)) };
      } catch (e) { info.errors.push('Tafel ' + bd.id + ': ' + e.message); } } })();

  /* ---------- Eingabe (Fork: vehicle.mjs VehicleControls) ---------- */
  const K = { left: 0, right: 0, fwd: 0, back: 0, boost: 0, hop: 0 }, KEYS = D.keys;
  const keyOf = code => Object.keys(KEYS).find(k => KEYS[k].includes(code));
  const onKey = down => e => { const k = keyOf(e.code); if (!k) return; if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
    if (k === 'reset') { if (down) reset(); return; } K[k] = down ? 1 : 0; };
  const kd = onKey(true), ku = onKey(false); window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
  const blur = () => Object.keys(K).forEach(k => K[k] = 0); window.addEventListener('blur', blur);
  const nearestS = p => { let best = Infinity, bs = 0; for (let i = 0; i < N; i += 4) { const q = S[i].p, d = (q[0] - p.x) ** 2 + (q[1] - p.y) ** 2 * 0.3 + (q[2] - p.z) ** 2; if (d < best) { best = d; bs = S[i].s; } } return bs; };
  const reset = () => placeCar(nearestS(carG.position) - 6);
  let steering = 0, hopCool = 0, lastContacts = 4;

  /* ---------- Kamera (Fork: follow-camera.mjs) ---------- */
  const CAM = D.camera, camPos = new THREE.Vector3(), camInit = { v: false };
  let mode = opts.mode || 'fahren'; const setMode = m => { mode = m; if (m === 'fahren') { st.cam = 'extern'; T.controls.enabled = false; camera.fov = CAM.fov; camera.updateProjectionMatrix(); camInit.v = false; }
    else if (m === 'tafel') { const B = boards.find(b => b.shot); if (!B) { mode = 'totale'; camera.fov = 38; camera.updateProjectionMatrix(); T.shot('totale'); return; } st.cam = 'extern'; T.controls.enabled = true; camera.fov = 45; camera.updateProjectionMatrix(); camera.position.copy(B.shot.pos); T.controls.target.copy(B.shot.tgt); T.controls.update(); }
    else { camera.fov = 38; camera.updateProjectionMatrix(); T.shot(m); } };
  setMode(mode);

  /* ---------- Takt ---------- */
  const trOut = new A.btTransform(), q3 = new THREE.Quaternion(), fwd = new THREE.Vector3(), tmpM = new THREE.Matrix4(), rayFrom = new A.btVector3(), rayTo = new A.btVector3();
  let fr = 0, fT = performance.now(), moodT = 0;
  T.hooks.push((dt, t) => {
    const throttle = K.fwd - K.back, steer = K.left - K.right, mk = JY.motorK * (K.boost && throttle > 0 ? JY.boostK : 1);
    steering = lerp(steering, steer * EG.maxSteering, EG.steerLerp);
    let eng = 0, brk = 0; if (throttle > 0) eng = EG.maxEngineForce * mk; else if (throttle < 0) eng = -EG.maxEngineForce * JY.motorK * 0.7; else brk = EG.maxBrakingForce;
    vehicle.setSteeringValue(steering, 0); vehicle.setSteeringValue(steering, 1);
    for (const w of [2, 3]) { vehicle.applyEngineForce(eng, w); vehicle.setBrake(brk, w); }
    hopCool -= dt;
    if (K.hop && lastContacts >= 2 && hopCool <= 0) { chassis.applyCentralImpulse(new A.btVector3(0, C.mass * JY.hopImpulse, 0)); hopCool = 0.8; }
    world.stepSimulation(dt, 3, 1 / 60);
    let contacts = 0; for (let i = 0; i < 4; i++) if (vehicle.getWheelInfo(i).get_m_raycastInfo().get_m_isInContact()) contacts++;   // direkt nach dem Schritt lesen: updateWheelTransform setzt isInContact zurück
    lastContacts = contacts; info.air = contacts === 0; info.contacts = contacts;
    chMS.getWorldTransform(trOut); const o = trOut.getOrigin(), r = trOut.getRotation();
    carG.position.set(o.x(), o.y(), o.z()); carG.quaternion.set(r.x(), r.y(), r.z(), r.w());
    info.speed = Math.abs(vehicle.getCurrentSpeedKmHour());
    { let ly = 0; const wr = cars[carId]?.wr || WH.radius, iq = carG.quaternion.clone().invert(), tmp = new THREE.Vector3();
      for (let i = 0; i < 4; i++) { const o2 = vehicle.getWheelTransformWS(i).getOrigin(); tmp.set(o2.x() - carG.position.x, o2.y() - carG.position.y, o2.z() - carG.position.z).applyQuaternion(iq); ly += tmp.y / 4; }
      const holder = cars[carId]?.holder; if (holder) holder.position.y = lerp(holder.position.y, ly - vis.wy, 0.35);
      const spinD = vehicle.getCurrentSpeedKmHour() / 3.6 * dt / wr; for (const w of wheelNodes) { w.userData.spin = (w.userData.spin || 0) + spinD; const q0 = w.userData.q0 || (w.userData.q0 = w.quaternion.clone());
        w.quaternion.setFromAxisAngle(_Y, w.userData.front ? steering : 0).multiply(q0).multiply(_qs.setFromAxisAngle(_X, w.userData.spin)); } }
    if (carG.position.y < GY - 40) reset();
    if (st.fast || mode === 'fahren') { const ahead = new THREE.Vector3(0, 0, 1).applyQuaternion(carG.quaternion).setY(0); LEAN.fit(carG.position.clone().addScaledVector(ahead, RC.lean.shadow.ahead)); }
    moodT -= dt; if (moodT <= 0) { moodT = 0.5; info.s = nearestS(carG.position); st.moodS = info.s; }
    if (mode === 'fahren') { fwd.set(0, 0, 1).applyQuaternion(carG.quaternion).setY(0); if (fwd.lengthSq() < 1e-4) fwd.set(0, 0, 1); fwd.normalize();
      const yaw = Math.atan2(fwd.x, fwd.z); q3.setFromEuler(new THREE.Euler(0, yaw, 0)); tmpM.compose(carG.position, q3, new THREE.Vector3(1, 1, 1));
      const want = new THREE.Vector3(...CAM.offset).applyMatrix4(tmpM); const gy = groundAt(want.x, want.z) + 1.6; if (want.y < gy) want.y = gy;
      { rayFrom.setValue(carG.position.x, carG.position.y + 2.2, carG.position.z); rayTo.setValue(want.x, want.y, want.z); const cb = new A.ClosestRayResultCallback(rayFrom, rayTo); world.rayTest(rayFrom, rayTo, cb);
        if (cb.hasHit()) { const hp = cb.get_m_hitPointWorld(), from = new THREE.Vector3(carG.position.x, carG.position.y + 2.2, carG.position.z), h = new THREE.Vector3(hp.x(), hp.y(), hp.z()), d = h.distanceTo(from); want.lerpVectors(from, h, Math.max(0.15, (d - 0.8) / Math.max(d, 0.01))); } A.destroy(cb); }
      if (!camInit.v) { camPos.copy(want); camInit.v = true; } else camPos.lerp(want, 1 - Math.pow(1 - CAM.lerpAmount, dt));
      camera.up.set(0, 1, 0); camera.position.copy(camPos); camera.lookAt(carG.position.x, carG.position.y + 1.2, carG.position.z); }
    else if (mode === 'tafel') T.controls.update();
    for (const B of boards) B.content && B.content.update(dt);
    fr++; const now = performance.now(); if (now - fT > 1000) { info.fps = Math.round(fr * 1000 / (now - fT)); fr = 0; fT = now; }
    info.calls = T.info.calls; info.frameTris = T.info.frameTris; });
  info.loadMs = Math.round(performance.now() - t0);

  return { info, T, RC, cars,
    setCar, setMode, setProfile, reset, get mode() { return mode; }, get vehicleId() { return carId; },
    key(name, down) { if (name === 'reset') { if (down) reset(); return; } if (name in K) K[name] = down ? 1 : 0; },
    set(k, v) { if (k === 'world') T.set('world', v); else if (k === 'vfx') T.set('vfx', v); else if (k === 'karts') T.karts.forEach(kk => kk.obj.g.visible = !!v); else if (k === 'motorK') JY.motorK = +v; },
    dispose() { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); window.removeEventListener('blur', blur); T.dispose(); } };
}
