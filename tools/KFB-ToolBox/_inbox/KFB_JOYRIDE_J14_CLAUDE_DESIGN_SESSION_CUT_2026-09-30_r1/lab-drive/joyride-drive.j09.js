/* J09 (30.09., J14 Travel Modes): wörtlich j08 + (1) Fahrphysik wählbar k2b | k2 statt K5, (2) Einhängepunkte für die Travel-Schicht
 *   (Eingabefilter, Nachlauf, Kamera, Orbit/Zoom zu Fuß, Schattenfokus, R gesperrt zu Fuß), (3) placeCar/syncChase für Proben. Kein neuer Bewegungs-Owner. */
/* J07 (29.09. abends, P1): wörtlich j06, nur Fahrphysik K3 (Kante hält bei zu wenig Tempo, geschlossene Streams) + Frame mit closed. */
/* KFB Joyride J06 (29.09. nachts) · J05 + Staub aus den Hinterrädern (klein, nach hinten), stärkere Landehilfe,
 *   S5-Quellen-Gate für die T4-Fassaden (Quelle | Knete | nah | Straße, Vorstufe umschaltbar), Schatten-Prüfung #247 (6 Ansichten).
 * KFB Joyride J05 · Georgs Fixes (29.09. spät) · J04 + K2 (Q/E, Flug über den Kicker), Schatten-Kanon PR #290 (Follow, 1,2 × Texel),
 *   FACE_NORMALS auf den Fassaden, Knetgummi-Bande federt sichtbar, Clay-VFX am Spielerauto.
 * KFB Joyride J04 · Knet-Strecke fahren · KFB-Fahrphysik (29.09.)
 * Basis J03 (Leicht-Pass, Fassaden, Gelände, Tafeln). Neu: Ammo raus, KFB-Fahrphysik K1 (Race v0.8 FLOW/FEEL aus Cologne
 * Option C-3, im Streckenrahmen) mit Spurhilfe + Knetgummi-Bande, Kamera auf der Streckenschiene (Verfahren railClamp),
 * T4-Dichte-Schalter (window.__KFB_T4_LEAN). Rezept: lab-drive/joyride.j04.json. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { boot as bootT4 } from '../lab-track/track-look.v5.js?r=38';
import { makeClayMaterial, seedGeometry } from '../lab-clay/clay-material.v10.js?r=2';
import { softenGeometry } from '../lab-clay/clay-soften.v1.js';
import * as K1M from '../lab-clay/clay-material.v8.js';   // J08: K1/H0 laden v8 (KFB_K1_H0_CODEBASE_2026-09-29), nicht v10
import { makeClayRelief } from '../lab-clay/clay-relief.v2.js';
import { chunkify, thinNoCast, clayLite, makeShadowFollow, faceNormals, makeWobble } from './lean-pass.l2.js?r=1';
let makeFrame, createDriver, stepDriver, pose, FLOW, ASSIST;   // J14: Fahrphysik wählbar (opts.drive 'k2b' Arbeitskandidat | 'k2' Rückfall), sonst wörtlich j08   // J13b: K5 Heck-Drift   // J13: K4 (K3 + Zentrifugal aus Δpsi, Driftrichtung, Drift ohne Rückrichtung)

const clamp = (x, a, b) => Math.min(b, Math.max(a, x)), lerp = (a, b, t) => a + (b - a) * t;
const sst = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const h2 = (i, j) => { const v = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return v - Math.floor(v); };
const vn2 = (x, z) => { const i = Math.floor(x), j = Math.floor(z), fx = x - i, fz = z - j, u = fx * fx * (3 - 2 * fx), w = fz * fz * (3 - 2 * fz);
  return lerp(lerp(h2(i, j), h2(i + 1, j), u), lerp(h2(i, j + 1), h2(i + 1, j + 1), u), w); };
const fbm = (x, z) => 0.55 * vn2(x, z) + 0.3 * vn2(x * 2.1 + 5.3, z * 2.1 - 1.7) + 0.15 * vn2(x * 4.3 - 2.2, z * 4.3 + 7.1);
const V = a => new THREE.Vector3(a[0], a[1], a[2]);

export async function boot(canvas, onNote = () => {}, opts = {}) {
  const t0 = performance.now();
  const DRIVE_ID = opts.drive === 'k2' ? 'k2' : 'k2b', DM = await import(DRIVE_ID === 'k2' ? './kfb-drive.k2.js?r=1' : './kfb-drive.k2b.js?r=1');
  ({ makeFrame, createDriver, stepDriver, pose, FLOW, ASSIST } = DM); let TV = null;   // J14: Travel-Schicht hängt sich über setTravel() ein
  const RC = await fetch(new URL('./joyride.j06.json', import.meta.url).href + '?r=' + Date.now()).then(r => r.json());
  window.__KFB_T4_LEAN = { ...((opts.profile || 'leicht') === 'leicht' ? RC.lean.t4 : {}), softenHouse: { fn: softenGeometry, opt: RC.facade.h0 }, houseK1: !!RC.facade.houseK1 };   // J07: H0-Vorstufe je Quelle, vor T4-Biegung   // vor dem Bau: Dichte gilt ab Aufbau
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
  const facadeMeshes = [];
  { const FS = RC.facade; if (FS.on && FS.postMerge && T.M.kk) { onNote('Fassaden werden geknetet …'); await new Promise(r => setTimeout(r, 0)); const t1 = performance.now();
      root.traverse(o => { if (!o.isMesh || o.material !== T.M.kk || o.userData.softened) return; o.geometry.computeBoundingBox(); const diag = o.geometry.boundingBox.getSize(new THREE.Vector3()).length();
        const r = softenGeometry(THREE, o.geometry, { relative: false, maxEdge: FS.maxEdge, maxLevels: FS.maxLevels, iters: FS.iters, lambda: 0.5, mu: -0.53, lump: FS.lumpM / diag, lumpFreq: diag / (3 * FS.lumpWaveM), maxTris: FS.maxTris, seed: 5 });
        const gN = FS.faceNormalsDeg ? faceNormals(r.geometry, FS.faceNormalsDeg) : r.geometry; seedGeometry(THREE, gN, 811); o.userData.geoSrc = o.geometry; o.userData.geoClay = gN; facadeMeshes.push(o); o.geometry = gN; o.userData.softened = true; info.facade = { tris: Math.round(r.tris), levels: r.levels, ms: Math.round(performance.now() - t1) }; });
      } if (T.M.kk?.userData.clay && FS.reliefK) T.M.kk.userData.clay.S.value *= FS.reliefK; }
  /* J08 · Häuser wie K1/H0: clay-material.v8, Profil house, K1-Uniforms (Hand 0,5 · Kachel 1,6 · Abdruck 4,5) umgerechnet auf die T4-Hausgröße, Fingerabdrücke an */
  const K1S = RC.facade.k1; let M8 = null;
  if (K1S && T.AT.src?.building_A) { const rel = makeClayRelief({ size: 1024, seed: 11 }), tx = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat); tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.magFilter = THREE.LinearFilter; tx.minFilter = THREE.LinearMipmapLinearFilter; tx.generateMipmaps = true; tx.needsUpdate = true;
    const U8 = K1M.makeClayUniforms(THREE, tx); try { U8.uClayPrint.value = await K1M.makePrintTexture(THREE, new URL('../ref/clay-joebinns/Fingerprints01_3K.png', import.meta.url).href, 2048); U8.uClayPrintOn.value = 1; } catch (e) { info.errors.push('K1 Abdrücke: ' + e.message); U8.uClayPrint.value = tx; }
    const hNat = T.AT.src.building_A.size.y, hT4 = hNat * 4.1 * (window.__KFB_T4_FIX?.k1ScaleFix ? 1 : 1.15), hk = hT4 / K1S.refHeight; info.k1Scale = +hk.toFixed(2);   // J13 k1ScaleFix: houseK1 streckt nicht (ysc 1) → der 1,15-Faktor machte die Knetspur 15 % zu grob
    U8.uClayHand.value = 0.5 * hk; U8.uClayTile.value = 1.6 * hk; U8.uClayPrintTile.value = 4.5 * hk; if (U8.uClayFacetSize) U8.uClayFacetSize.value = 0.65 * hk;
    M8 = K1M.makeClayMaterial(THREE, U8, { src: T.AT.src.building_A.mat, profile: 'house', scale: 0.5 * hk }); info.U8 = U8;
    /* J13 houseLOD: v8 dreht die Relief-Normale nur mit modelMatrix. Bei Instanzen fehlt die Instanzdrehung → Beulen falsch beleuchtet.
       Eigene Materialkopie für die Instanzen, v8-Datei bleibt unverändert: Instanz-Basis als Varying, einmal in die Umrechnung. */
    let M8i = null;
    if (T.AT.houseLOD) { M8i = K1M.makeClayMaterial(THREE, U8, { src: T.AT.src.building_A.mat, profile: 'house', scale: 0.5 * hk }); const ob = M8i.onBeforeCompile, ck = M8i.customProgramCacheKey;
      M8i.onBeforeCompile = (sh, r) => { ob.call(M8i, sh, r); const D = 'varying vec3 vIM0;\nvarying vec3 vIM1;\nvarying vec3 vIM2;\n';
        sh.vertexShader = D + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n#ifdef USE_INSTANCING\n vIM0 = instanceMatrix[0].xyz; vIM1 = instanceMatrix[1].xyz; vIM2 = instanceMatrix[2].xyz;\n#else\n vIM0 = vec3(1.0,0.0,0.0); vIM1 = vec3(0.0,1.0,0.0); vIM2 = vec3(0.0,0.0,1.0);\n#endif');
        sh.fragmentShader = D + sh.fragmentShader.replace('mat3(modelMatrix) * dN', 'mat3(modelMatrix) * mat3(vIM0, vIM1, vIM2) * dN'); info.instNormalPatch = sh.fragmentShader.includes('mat3(vIM0, vIM1, vIM2)'); };
      M8i.customProgramCacheKey = () => (ck ? ck.call(M8i) : '') + '-inst1'; }
    let n = 0; root.traverse(o => { if (o.isMesh && o.material === T.M.kk) { o.material = (o.isInstancedMesh && M8i) ? M8i : M8; n++; } }); info.k1Houses = n; }
  /* S5-Quellen-Gate: echte KayKit-Quelle unverändert neben derselben Datei in Knete (Vorstufe + FACE_NORMALS + K2), auf freier Fläche */
  const gate = { views: {} };
  { const FS = RC.facade, SRC = T.AT.src || {}, names = ['building_A', 'building_E'].filter(n => SRC[n]);
    if (names.length) { const R = new THREE.Vector3(0, 0, -1), Tv = new THREE.Vector3(1, 0, 0), base = new THREE.Vector3(ctr.x, GY - 2, ctr.z + ext.z / 2 + 270);   // Werkbank außerhalb der Welt: Quelle wirklich isoliert
      { const g = new RoundedBoxGeometry(76, 3, 34, 4, 1.2); seedGeometry(THREE, g, 879); const m = new THREE.Mesh(g, T.M.table); m.position.copy(base).add(new THREE.Vector3(0, -1.5, 0)); m.receiveShadow = true; m.name = 's5-werkbank'; scene.add(m); }
      const G = new THREE.Group(); G.name = 's5-quellen-gate'; scene.add(G); const face = Math.atan2(-R.x, -R.z);
      const pad = (x) => { const g = new RoundedBoxGeometry(10, 0.8, 10, 3, 0.3); seedGeometry(THREE, g, 880 + x); const m = new THREE.Mesh(g, T.M.plate || T.M.table); m.receiveShadow = true; return m; };
      names.forEach((nm, n) => { for (const [side, dz] of [['src', -6.5], ['clay', 6.5]]) { const at = base.clone().addScaledVector(Tv, (n - 0.5) * 28 + dz), gy = base.y;
          const p = pad(n * 2 + (side === 'clay')); p.position.set(at.x, gy + 0.2, at.z); G.add(p);
          const o = SRC[nm].scene.clone(true); o.scale.setScalar(4.1); o.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(o);
          const h = new THREE.Group(); h.position.set(at.x, gy + 0.6, at.z); h.rotation.y = face; G.add(h);
          if (side === 'src') { o.position.set(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2); o.traverse(m => { if (m.isMesh) { m.castShadow = m.receiveShadow = true; } }); h.add(o); }
          else { o.traverse(m => { if (!m.isMesh) return; const g = m.geometry.clone().applyMatrix4(m.matrixWorld); g.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2); g.computeBoundingBox();
              const diag = g.boundingBox.getSize(new THREE.Vector3()).length(), r = softenGeometry(THREE, g, { ...FS.h0, maxTris: 30000, seed: 7 + n });
              const gN = faceNormals(r.geometry, FS.faceNormalsDeg || 42); seedGeometry(THREE, gN, 890 + n); const mm = new THREE.Mesh(gN, M8 || T.M.kk); mm.castShadow = mm.receiveShadow = true; h.add(mm); }); }
          if (n === 0 && side === 'clay') gate.nah = { pos: at.clone().addScaledVector(R, -9).add(new THREE.Vector3(0, gy + 3.5 - at.y, 0)).addScaledVector(Tv, 3), tgt: at.clone().add(new THREE.Vector3(0, gy + 3 - at.y, 0)) }; } });
      const mid = base.clone(); 
      gate.quelle = { pos: mid.clone().addScaledVector(R, -40).add(new THREE.Vector3(0, 14, 0)), tgt: mid.clone().add(new THREE.Vector3(0, 4, 0)) };
      gate.haus = { pos: gate.nah.tgt.clone().addScaledVector(R, -6).addScaledVector(Tv, 5).add(new THREE.Vector3(0, -1.6, 0)), tgt: gate.nah.tgt.clone().add(new THREE.Vector3(0, -2.2, 0)) };
      info.gate = names.join(' + ') + ' · Quelle | Knete'; } else info.gate = 'SOURCE_REQUIRED · T4-Quellen nicht geladen'; }
  /* Leicht-Pass L1 */
  onNote('Welt wird in Kacheln geteilt …'); await new Promise(r => setTimeout(r, 0));
  /* J09 · Kontakt-AO in die Kronen gebacken: Unterseiten der Knetkugeln dunkel (K1 macht das per GTAO; hier je Vertex, kostet nichts) */
  { const AO = RC.lean.foliageAO, mats = new Set([T.M.leaf0, T.M.leaf1, T.M.leaf2, T.M.trunk].filter(Boolean)); let n = 0;
    root.traverse(o => { if (!o.isMesh || !mats.has(o.material)) return; const g = o.geometry, nr = g.attributes.normal, c = new Float32Array(nr.count * 3), old = g.attributes.color;   // J13: gebackene Kronen-Verdeckung (crown-ao) bleibt, Normalen-AO multipliziert
      for (let i = 0; i < nr.count; i++) { const ny = nr.getY(i), k = AO.min + (1 - AO.min) * Math.min(1, Math.max(0, (ny - AO.lo) / (AO.hi - AO.lo))); for (let j = 0; j < 3; j++) c[i * 3 + j] = k * (old ? old.getComponent(i, j) : 1); }
      g.setAttribute('color', new THREE.BufferAttribute(c, 3)); n++; });
    mats.forEach(m => { m.vertexColors = true; m.needsUpdate = true; }); info.foliageAO = n; }
  info.chunks = chunkify(scene, RC.lean.chunk); info.noCast = thinNoCast(scene);
  /* J13 flatNoCast: bodennahe Massen (Gehweg, Bordstein, Sockel, Markierung, Fahrbahn, Gelände) werfen keinen sichtbaren Schatten, kosteten aber den ganzen Schattendurchgang */
  if (window.__KFB_T4_FIX?.flatNoCast) { const FLAT = /^(t4-gehweg|t4-bordstein|t4-stadtsockel|m2-markierung|m1-|fahrbahn|j02-gelaende|boost)/; /* boost: Pfeilplatten warfen im Looping (Streiflicht) dunkle Doppel-Pfeile */ let n = 0; scene.traverse(o => { if (o.isMesh && o.castShadow && FLAT.test(o.name || '')) { o.castShadow = false; n++; } }); info.flatNoCast = n; }
  const SH = RC.lean.shadow, shadowFit = makeShadowFollow(T.renderer, T.sun, SH); info.shadow = shadowFit.state;
  /* J13 houseLOD: Häuser als Instanzen je Quelle. Im Bild und < hiDist = K1-Vorstufe (maxTris 90 000), sonst bisherige Vorstufe; beide werfen ihren eigenen Schatten.
     Häuser außerhalb des Bildes, aber im Schattenkasten: nur die Rohform auf Ebene 1 (sieht nur die Sonnenkamera). Sonst: nichts. */
  const HL = T.AT.houseLOD || null, FXJ = window.__KFB_T4_FIX || {}; let hlT = -1;
  const FRU = new THREE.Frustum(), PM4 = new THREE.Matrix4(), SPH = new THREE.Sphere();
  if (HL) { T.sun.shadow.camera.layers.enable(1); for (const E of Object.values(HL)) for (const h of E.L) { const o = offAt(h.m.elements[12], h.m.elements[14]); if (o > 0.02) { h.m.elements[13] += o; h.c.y += o; } } }
  const updHouses = () => { camera.updateMatrixWorld(); PM4.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse); FRU.setFromProjectionMatrix(PM4);
    const sc = T.sun.target.position, sr = (shadowFit.state.r || 150) * 1.42, hiD = FXJ.hiDist || 55; let nH = 0, nL = 0, nS = 0, tri = 0;
    for (const E of Object.values(HL)) { let a = 0, b = 0, c = 0; const sA = E.hi.geometry.attributes.claySeed, sB = E.lo.geometry.attributes.claySeed;
      for (const h of E.L) { SPH.center.copy(h.c); SPH.radius = E.r; const inV = FRU.intersectsSphere(SPH), inS = Math.hypot(h.c.x - sc.x, h.c.z - sc.z) < sr + E.r; if (!inV && !inS) continue;
        if (!inV) { E.sh.setMatrixAt(c++, h.m); continue; }
        if (camera.position.distanceTo(h.c) - E.r < hiD) { E.hi.setMatrixAt(a, h.m); sA.setXYZ(a, h.seed[0], h.seed[1], h.seed[2]); a++; }
        else { E.lo.setMatrixAt(b, h.m); sB.setXYZ(b, h.seed[0], h.seed[1], h.seed[2]); b++; } }
      E.hi.count = a; E.lo.count = b; E.sh.count = c; E.hi.instanceMatrix.needsUpdate = E.lo.instanceMatrix.needsUpdate = E.sh.instanceMatrix.needsUpdate = true; sA.needsUpdate = sB.needsUpdate = true;
      nH += a; nL += b; nS += c; tri += a * E.triHi + b * E.triLo + c * E.triSh; }
    info.houseLOD = { nah: nH, fern: nL, schatten: nS, hausTris: Math.round(tri) }; };
  /* J13 dprAuto: Pixelverhältnis nach gemessener Bildrate (1 … min(Gerät, 2)), statt fest 1 im Leicht-Profil */
  let dprT = 0;
  const dprStep = t => { if (!FXJ.dprAuto || t - dprT < 2.5 || !info.fps) return; dprT = t; const cap = Math.min(window.devicePixelRatio || 1, 2), cur = T.renderer.getPixelRatio();
    let nx = cur; if (info.fps < 27 && cur > 1) nx = Math.max(1, cur - 0.25); else if (info.fps > 48 && cur < cap) nx = Math.min(cap, cur + 0.25); if (nx !== cur) T.renderer.setPixelRatio(nx); info.dpr = nx; };
  info.facadeOn = true; const WOB = makeWobble(); WOB.patch(T.M.strangT); WOB.patch(T.M.strang); st.run = false;   // T4-Karts ruhen: sonst streuen unsichtbare Karts VFX
  const setProfile = p => { info.profile = p; const lean = p === 'leicht'; st.fast = lean && !RC.lean.contactAO; T.set('ao', !lean || !!RC.lean.contactAO); T.renderer.setPixelRatio(lean ? 1 : Math.min(2, window.devicePixelRatio || 1)); if (T.info.guard) T.info.guard.level = 3;
    if (lean) info.sheenOff = clayLite(scene, U, { lodK: RC.lean.lodK }); else if (U.uClayLodK) U.uClayLodK.value = 1; window.dispatchEvent(new Event('resize')); };
  setProfile(opts.profile || 'leicht');

  /* ---------- KFB-Fahrphysik K1 im Streckenrahmen ---------- */
  const D = RC.drive, FR = makeFrame(S, T.ds, !!(T.td && T.td.closed)), drv = createDriver(RC.drive.startS ?? 60); let assist = opts.assist ?? D.assist, motorK = opts.motorK ?? D.motorK;
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
    const box = new THREE.Box3().setFromObject(c.holder).applyMatrix4(inv); c.halfW = (box.max.x - box.min.x) / 2; c.rear = pts.filter(p => p.z < 0).map(p => ({ x: p.x, z: p.z })); c.rearZ = box.min.z;
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
  /* J13b · Eingabe robust: gedrückte Tasten als Menge, K wird daraus berechnet. Links/Rechts und Drift: zuletzt gedrückt gewinnt
     (eine hängende Taste lässt sich immer übersteuern). Alles los bei Fensterwechsel, Kontextmenü (Rechtsklick schluckt keyup), Cmd-Loslassen, Esc. */
  const keyOf = code => Object.keys(KEYS).find(k => KEYS[k].includes(code)), HELD = new Map(), VIRT = {}; let ord = 0;
  const last = k => Math.max(-1, ...(KEYS[k] || []).map(c => HELD.has(c) ? HELD.get(c) : -1));
  const recompute = () => { for (const k of Object.keys(K)) K[k] = (VIRT[k] || (KEYS[k] || []).some(c => HELD.has(c))) ? 1 : 0;
    for (const [a, b] of [['left', 'right'], ['driftL', 'driftR']]) if (K[a] && K[b] && !VIRT[a] && !VIRT[b]) { if (last(a) > last(b)) K[b] = 0; else K[a] = 0; } };
  const blur = () => { HELD.clear(); for (const k in VIRT) VIRT[k] = 0; recompute(); };
  const onKey = down => e => { if (e.code === 'Escape' || (!down && /^Meta/.test(e.code))) { blur(); return; }
    if (down && e.code === 'KeyC' && !e.repeat) { camCycle(); return; }
    const k = keyOf(e.code); if (!k) return; if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
    { const ae = document.activeElement; if (ae && ae !== document.body && /^(BUTTON|INPUT|SELECT)$/.test(ae.tagName)) { if (ae.type !== 'text') ae.blur(); } }   // J13: HUD-Knopf/Regler mit Fokus schluckte Leertaste/Pfeile
    if (k === 'reset') { if (down && !TV?.blockReset?.()) reset(); return; } if (down) { if (!HELD.has(e.code)) HELD.set(e.code, ++ord); } else HELD.delete(e.code); recompute(); };
  const kd = onKey(true), ku = onKey(false); window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
  window.__kfbKeys = K; window.addEventListener('blur', blur); window.addEventListener('contextmenu', blur); document.addEventListener('visibilitychange', () => { if (document.hidden) blur(); });
  const ALIAS = { fwd: 'gas', back: 'brake', hop: 'jump' };

  /* ---------- Kamera auf der Streckenschiene (Verfahren railClamp, Cologne C-3) ---------- */
  const CAM = D.camera, camPos = new THREE.Vector3(), camUp = new THREE.Vector3(0, 1, 0), camInit = { v: false };
  const CHK = { t0: 0 }, shotAt = id => T.shots[id] || T.shots.uebersicht;
  let mode = opts.mode || 'fahren'; const setMode = m => { mode = m; CHK.t0 = performance.now() / 1000;
    if (m === 'fahren') { st.cam = 'extern'; T.controls.enabled = false; camInit.v = false; }
    else if (m === 'orbit' || m === 'kontakt') { st.cam = 'extern'; T.controls.enabled = false; camera.fov = 40; camera.up.set(0, 1, 0); camera.updateProjectionMatrix(); }
    else if (m === 'fs-quelle' || m === 'fs-nah' || m === 'haus') { const v = m === 'fs-quelle' ? gate.quelle : m === 'fs-nah' ? gate.nah : gate.haus; st.cam = 'extern'; T.controls.enabled = true; camera.fov = m === 'haus' ? 34 : 38; camera.up.set(0, 1, 0); camera.updateProjectionMatrix();
      if (v) { camera.position.copy(v.pos); T.controls.target.copy(v.tgt); T.controls.update(); } }
    else if (m === 'fs-strasse') { camera.fov = 38; camera.up.set(0, 1, 0); camera.updateProjectionMatrix(); T.shot('stadt'); st.cam = 'extern'; T.controls.enabled = true; }
    else if (m === 'tafel') { const B = boards.find(b => b.shot); if (!B) { mode = 'totale'; camera.fov = 38; camera.updateProjectionMatrix(); T.shot('totale'); return; } st.cam = 'extern'; T.controls.enabled = true; camera.fov = 45; camera.up.set(0, 1, 0); camera.updateProjectionMatrix(); camera.position.copy(B.shot.pos); T.controls.target.copy(B.shot.tgt); T.controls.update(); }
    else { camera.fov = 38; camera.up.set(0, 1, 0); camera.updateProjectionMatrix(); T.shot(m); } };
  setMode(mode);

  /* J10 · Freie Orbit-Kamera beim Fahren: Ziehen dreht um das Auto, Rad zoomt, Doppelklick = zurück zur Verfolgerkamera */
  /* J13b · Orbit beim Fahren: erst ab 6 px Ziehen (Klick tut nichts). Winkel relativ zur Fahrtrichtung, die Kamera bleibt, wo man sie hinzieht,
     und fährt mit (auch seitlich). Kein Zurückspringen beim Loslassen; Doppelklick oder C = zurück/weiter. Häuser und Gelände schieben die Kamera heran. */
  const FO = { on: false, rel: 0, pitch: 0.35, dist: 12, dCur: 12, drag: null, back: 0, hd: null, pos: new THREE.Vector3(), init: false };
  const hdg = () => { const f = new THREE.Vector3(0, 0, 1).applyQuaternion(carG.quaternion); return Math.atan2(f.x, f.z); };
  const wrapA = a => Math.atan2(Math.sin(a), Math.cos(a));
  const PRESET = [null, { rel: Math.PI / 2, pitch: 0.22, dist: 9 }, { rel: -Math.PI / 2, pitch: 0.22, dist: 9 }, { rel: Math.PI * 0.8, pitch: 0.5, dist: 14 }, { rel: 0, pitch: 0.28, dist: 9 }]; let preI = 0;
  const toChase = () => { if (FO.on) { FO.on = false; FO.back = 1; camPos.copy(camera.position); } };
  const camCycle = () => { if (mode !== 'fahren') return; preI = (preI + 1) % PRESET.length; const P = PRESET[preI]; if (!P) { toChase(); return; }
    if (!FO.on) { FO.on = true; FO.hd = hdg(); FO.init = false; FO.dCur = P.dist; } FO.rel = P.rel; FO.pitch = P.pitch; FO.dist = P.dist; };
  { const el = T.renderer.domElement;
    el.style.touchAction = 'none'; el.style.userSelect = 'none'; el.setAttribute('draggable', 'false'); el.tabIndex = el.tabIndex >= 0 ? el.tabIndex : 0;
    el.addEventListener('contextmenu', e => e.preventDefault());
    el.addEventListener('pointerdown', e => { if (mode !== 'fahren') return; e.preventDefault(); try { el.setPointerCapture(e.pointerId); } catch (_) {} el.focus({ preventScroll: true }); FO.drag = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, live: false }; });
    el.addEventListener('pointermove', e => { const g = FO.drag; if (!g) return;
      if (TV?.walking?.()) { if (!g.live) { if (Math.hypot(e.clientX - g.x0, e.clientY - g.y0) < 6) return; g.live = true; g.x = e.clientX; g.y = e.clientY; } TV.orbit(e.clientX - g.x, e.clientY - g.y); g.x = e.clientX; g.y = e.clientY; return; }   // J14: zu Fuß dreht der Walker-Orbit
      if (!g.live) { if (Math.hypot(e.clientX - g.x0, e.clientY - g.y0) < 6) return; g.live = true; g.x = e.clientX; g.y = e.clientY;
        if (!FO.on) { const off = camera.position.clone().sub(carG.position), L = off.length() || 1; FO.on = true; FO.back = 0; FO.hd = hdg(); FO.rel = wrapA(Math.atan2(off.x, off.z) - FO.hd); FO.dist = FO.dCur = Math.min(40, L); FO.pitch = Math.asin(clamp(off.y / L, -0.1, 0.95)); FO.init = false; } }
      FO.rel = wrapA(FO.rel - (e.clientX - g.x) * 0.006); FO.pitch = clamp(FO.pitch + (e.clientY - g.y) * 0.005, -0.1, 1.35); g.x = e.clientX; g.y = e.clientY; });
    const rel = () => { FO.drag = null; };
    el.addEventListener('pointerup', rel); el.addEventListener('pointercancel', rel); el.addEventListener('lostpointercapture', rel); el.addEventListener('dragstart', e => e.preventDefault());
    el.addEventListener('wheel', e => { if (TV?.walking?.()) { e.preventDefault(); TV.zoom(Math.sign(e.deltaY)); return; } if (mode !== 'fahren' || !FO.on) return; e.preventDefault(); FO.dist = clamp(FO.dist * (1 + Math.sign(e.deltaY) * 0.1), 4, 60); }, { passive: false });
    el.addEventListener('dblclick', () => { if (TV?.walking?.()) { TV.recenter?.(); return; } preI = 0; toChase(); }); }
  /* Sichtlinie: Strahl Auto → Kamera gegen Haus-Kugeln (Instanzen je Quelle, Radius ×0,72) und Gelände */
  const HOUSE = HL ? Object.values(HL).flatMap(E => E.L.map(h => ({ c: h.c, r: E.r * 0.72 }))) : [];
  const clearDist = (O, dir, want) => { let best = want;
    for (const h of HOUSE) { const cx = h.c.x - O.x, cy = h.c.y - O.y, cz = h.c.z - O.z, cc = cx * cx + cy * cy + cz * cz, rr = h.r * h.r; if (cc > (want + h.r) * (want + h.r)) continue;
      if (cc < rr) continue;   // Auto steht im Kugelrand: nicht zählen
      const tt = cx * dir.x + cy * dir.y + cz * dir.z; if (tt < 0) continue; const d2 = cc - tt * tt; if (d2 >= rr) continue; const hit = tt - Math.sqrt(rr - d2); if (hit < best) best = hit; }
    for (let n = 1; n <= 6; n++) { const u = best * n / 6, x = O.x + dir.x * u, y = O.y + dir.y * u, z = O.z + dir.z * u; if (y < groundAt(x, z) + 0.5) { best = Math.max(2.5, u - best / 6); break; } }
    return Math.max(2.5, best - 0.6); };
  /* ---------- Takt ---------- */
  const pk = { s: 0, lat: 0, v: 0 };
  const mB = new THREE.Matrix4(), vX = new THREE.Vector3(), vU = new THREE.Vector3(), vF = new THREE.Vector3(), qSq = new THREE.Quaternion(), qTilt = new THREE.Quaternion(), eT = new THREE.Euler();
  let fr = 0, fT = performance.now();
  T.hooks.push((dt, t) => {
    if (HL && (hlT < 0 || t - hlT > 0.15)) { hlT = t; updHouses(); } dprStep(t);
    const halfW = cars[carId]?.halfW || FLOW.proxyHalfWidth;
    const q = stepDriver(drv, FR, TV?.input ? TV.input(K, drv, dt) : K, dt, { assist, motorK, halfWidth: halfW });   // J14: Travel filtert nur die Eingabe (geparkt = Bremse, Leertaste < 0,5 m/s = kein Hüpfen)
    const P = pose(drv, q); TV?.post?.(dt, t, drv, P, q); vX.fromArray(P.X); vU.fromArray(P.U); vF.fromArray(P.F);
    mB.makeBasis(vX, vU, vF); carG.position.fromArray(P.P); carG.quaternion.setFromRotationMatrix(mB);
    if (!P.fly) carG.quaternion.multiply(qTilt.setFromEuler(eT.set(drv.pitch, 0, -drv.roll)));
    const sq = drv.squash, holder = cars[carId]?.holder; if (holder) holder.scale.set(1 + 0.12 * sq, 1 - 0.18 * sq, 1 + 0.06 * sq);
    info.speed = Math.abs(drv.fly ? Math.hypot(drv.fly.V[0], drv.fly.V[1], drv.fly.V[2]) : drv.speed) * 3.6; info.air = !!drv.fly || !drv.onGround; info.fly = !!drv.fly; info.s = drv.s; info.hits = drv.hits; info.wall = drv.atWall; st.moodS = drv.s;
    const wr = cars[carId]?.wr || 0.33, spinD = drv.speed * dt / wr;
    for (const w of wheelNodes) { w.userData.spin = (w.userData.spin || 0) + spinD; const q0 = w.userData.q0 || (w.userData.q0 = w.quaternion.clone());
      w.quaternion.setFromAxisAngle(_Y, w.userData.front ? drv.steerAngle * 0.8 : 0).multiply(q0).multiply(_qs.setFromAxisAngle(_X, w.userData.spin)); }
    const TF = TV?.focus?.(); if (mode === 'fahren' && TF) { const vd = new THREE.Vector3(); camera.getWorldDirection(vd); vd.y = 0; vd.normalize(); shadowFit(TF.clone().addScaledVector(vd, SH.ahead * 0.3), SH.rActor); }
    else if (mode === 'fahren') { const vd = new THREE.Vector3(); camera.getWorldDirection(vd); vd.y = 0; vd.normalize(); shadowFit(carG.position.clone().addScaledVector(vd, SH.ahead), SH.rDrive); }
    else if (mode === 'orbit' || mode === 'kontakt') shadowFit(carG.position, SH.rActor);
    else shadowFit(T.controls.target, clamp(camera.position.distanceTo(T.controls.target) * SH.rK, SH.rMin, SH.rMax));
    WOB.tick(t);
    /* Clay-VFX am Spielerauto: T4-Fahrer (Rollen, Kurven-Drift, Boost-Pads, Landung) + eigene Ereignisse (Bande, Drift, Aufsetzen) */
    /* Clay-VFX: Staub aus den Hinterrad-Aufstandspunkten des Modells, nach hinten, klein (Georg 29.09.: kam von der Seite, zu grob) */
    const VX = T.VFX, VP = RC.vfx, mix = T.AT.vfxBiome(drv.s), bio = mix.w > 0.5 ? mix.b : mix.a, gy = q.p[1], v = Math.abs(drv.speed), e = clamp(v / 30, 0, 1);
    const rearW = cars[carId]?.rear || [], carry = vF.clone().multiplyScalar(v * VP.carry);
    const wheelPos = (w) => carG.localToWorld(new THREE.Vector3(w.x, 0.08, w.z - 0.1));
    if (!drv.fly && drv.onGround && v > 3 && rearW.length) {
      pk.rAcc = (pk.rAcc || 0) + dt * VP.rollRate * e; while (pk.rAcc >= 1) { pk.rAcc -= 1; pk.side = 1 - (pk.side || 0); const p = wheelPos(rearW[pk.side % rearW.length]);
        VX.emit('roll', bio, { pos: p, dir: vF.clone().multiplyScalar(-1).addScaledVector(vU, 0.45), groundY: gy, count: 1, carry, sizeK: VP.rollSize, speedK: VP.rollSpeed }); }
      if (drv.drift > 0.2) { pk.dAcc = (pk.dAcc || 0) + dt * VP.driftRate * drv.drift; while (pk.dAcc >= 1) { pk.dAcc -= 1; const out = -(drv.driftDir || 1); for (const w of rearW) { const p = wheelPos(w);
        VX.emit('drift', bio, { pos: p, dir: vF.clone().multiplyScalar(-1).addScaledVector(vX, out * 0.25).addScaledVector(vU, 0.3), groundY: gy, count: 1, carry, sizeK: VP.driftSize, speedK: VP.driftSpeed }); } } }
      if (drv.boosting) { pk.bAcc = (pk.bAcc || 0) + dt * VP.boostRate; while (pk.bAcc >= 1) { pk.bAcc -= 1; const p = carG.localToWorld(new THREE.Vector3(0, 0.45, (cars[carId]?.rearZ ?? -2) - 0.2));
        VX.emit('boost', bio, { pos: p, dir: vF.clone().multiplyScalar(-1).addScaledVector(vU, 0.06), groundY: gy, count: 1, carry: vF.clone().multiplyScalar(v * 0.5), sizeK: VP.boostSize, jitter: 0.05 }); } } }
    for (const ev of drv.events) { if (ev.type === 'hit') { const side = ev.side, cp = new THREE.Vector3(q.p[0] + q.R[0] * (q.c + side * (q.half + 0.5)) + q.U[0] * 0.8, q.p[1] + q.R[1] * (q.c + side * (q.half + 0.5)) + q.U[1] * 0.8, q.p[2] + q.R[2] * (q.c + side * (q.half + 0.5)) + q.U[2] * 0.8);
        WOB.hit(cp, RC.drive.wall.wobble * ev.energy, t); VX.emit('scrape', T.AT.barrierBiome(drv.s, side), { pos: cp, dir: vF.clone().multiplyScalar(0.6).add(vU.clone().multiplyScalar(0.4)), groundY: gy, energy: ev.energy * 0.7, carry: vF.clone().multiplyScalar(v * 0.35), sizeK: VP.scrapeSize }); }
      if (ev.type === 'land') for (const w of rearW) VX.emit('landing', bio, { pos: wheelPos(w), dir: new THREE.Vector3(0, 1, 0), groundY: gy, energy: clamp(ev.energy, 0.4, 1) * 0.7, sizeK: VP.landSize }); }
    if (mode === 'fahren' && TV?.camera?.(dt, t)) { /* J14: Fuß-Kamera bzw. Kamera-Übergabe gehört der Travel-Schicht */ }
    else if (mode === 'fahren' && FO.on) { const c = carG.position, h = hdg(); FO.hd = FO.hd == null ? h : FO.hd + wrapA(h - FO.hd) * (1 - Math.exp(-dt * 4));
      const a = FO.hd + FO.rel, dir = new THREE.Vector3(Math.sin(a) * Math.cos(FO.pitch), Math.sin(FO.pitch), Math.cos(a) * Math.cos(FO.pitch)), O = new THREE.Vector3(c.x, c.y + 0.9, c.z);
      const dd = clearDist(O, dir, FO.dist); FO.dCur += (dd - FO.dCur) * (1 - Math.exp(-dt * (dd < FO.dCur ? 16 : 2.5)));
      const want = O.clone().addScaledVector(dir, FO.dCur); if (!FO.init) { FO.pos.copy(camera.position); FO.init = true; } FO.pos.lerp(want, 1 - Math.exp(-dt * 10));
      camera.up.set(0, 1, 0); camera.position.copy(FO.pos); camera.lookAt(c.x, c.y + 0.8, c.z); camPos.copy(camera.position); }
    else if (mode === 'fahren') { const sp = Math.abs(drv.speed) / FLOW.maxForward, boom = CAM.boom + sp * CAM.boomSpeed;
      if (drv.fly) { const fh = new THREE.Vector3(vF.x, 0, vF.z).normalize(), want = carG.position.clone().addScaledVector(fh, -boom).add(new THREE.Vector3(0, CAM.height + 1.2, 0)); camPos.lerp(want, 1 - Math.exp(-dt * CAM.follow)); camUp.lerp(new THREE.Vector3(0, 1, 0), 1 - Math.exp(-dt * 4)).normalize(); camera.up.copy(camUp); camera.position.copy(camPos); camera.lookAt(carG.position.x + fh.x * 10, carG.position.y, carG.position.z + fh.z * 10); }
      else {
      const qc = FR.at(drv.s - boom), latC = clamp(q.c + drv.lat * CAM.latFollow, qc.c - qc.half - CAM.side, qc.c + qc.half + CAM.side), hC = CAM.height + sp * 0.9;
      const want = new THREE.Vector3(qc.p[0] + qc.R[0] * latC + qc.U[0] * hC, qc.p[1] + qc.R[1] * latC + qc.U[1] * hC, qc.p[2] + qc.R[2] * latC + qc.U[2] * hC);
      if (!camInit.v || (camPos.distanceTo(want) > 55 && FO.back <= 0)) { camPos.copy(want); camUp.fromArray(qc.U); camInit.v = true; } else camPos.lerp(want, 1 - Math.exp(-dt * (FO.back > 0 ? 3.2 : CAM.follow)));
      camUp.lerp(vU, 1 - Math.exp(-dt * 4)).normalize(); camera.up.copy(camUp); camera.position.copy(camPos);
      const lk = new THREE.Vector3(carG.position.x + vF.x * 11 + vU.x * 1.2, carG.position.y + vF.y * 11 + vU.y * 1.2, carG.position.z + vF.z * 11 + vU.z * 1.2);
      if (FO.back > 0) { FO.back = Math.max(0, FO.back - dt / 1.2); const e2 = FO.back * FO.back * (3 - 2 * FO.back); lk.lerp(new THREE.Vector3(carG.position.x, carG.position.y + 0.8, carG.position.z), e2); }
      camera.lookAt(lk.x, lk.y, lk.z);
      }
      const fov = CAM.fov + sp * 14 + (drv.boosting ? 7 : 0); if (Math.abs(camera.fov - fov) > 0.05) { camera.fov += (fov - camera.fov) * Math.min(1, dt * 4); camera.updateProjectionMatrix(); } }
    else if (mode === 'orbit') { const a = (t - CHK.t0) * 0.35, c = carG.position; camera.position.set(c.x + Math.sin(a) * 9, c.y + 3.2, c.z + Math.cos(a) * 9); camera.lookAt(c.x, c.y + 0.8, c.z); }
    else if (mode === 'kontakt') { const c = carG.position, p = carG.localToWorld(new THREE.Vector3(2.6, 0.55, -1.6)); camera.position.copy(p); camera.lookAt(carG.localToWorld(new THREE.Vector3(0.6, 0.2, -1.0))); }
    else T.controls.update();
    for (const B of boards) B.content && B.content.update(dt);
    fr++; const now = performance.now(); if (now - fT > 1000) { info.fps = Math.round(fr * 1000 / (now - fT)); fr = 0; fT = now; }
    info.calls = T.info.calls; info.frameTris = T.info.frameTris; });
  info.loadMs = Math.round(performance.now() - t0);

  info.drive = DRIVE_ID;
  return { info, T, RC, cars, drv, FR, carG, K, camera, driveId: DRIVE_ID, driveModule: DM, get halfW() { return cars[carId]?.halfW || FLOW.proxyHalfWidth; },
    setTravel(tv) { TV = tv; }, syncChase() { camPos.copy(camera.position); camUp.set(0, 1, 0); camInit.v = true; FO.on = false; FO.back = 0; },
    placeCar(s, v = 0, lat = 0) { Object.assign(drv, createDriver(s)); drv.speed = v; drv.lat = lat; camInit.v = false; },
    setCar, setMode, setProfile, reset, facade(on) { for (const o of facadeMeshes) o.geometry = on ? o.userData.geoClay : o.userData.geoSrc; info.facadeOn = !!on; }, get mode() { return mode; }, get vehicleId() { return carId; },
    key(name, down) { name = ALIAS[name] || name; if (name === 'reset') { if (down) reset(); return; } if (name in K) { VIRT[name] = down ? 1 : 0; recompute(); } },
    set(k, v) { if (k === 'world') T.set('world', v); else if (k === 'vfx') T.set('vfx', v); else if (k === 'karts') { T.karts.forEach(kk => kk.obj.g.visible = !!v); st.run = !!v; } else if (k === 'motorK') motorK = +v; else if (k === 'assist') assist = +v; },
    dispose() { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); window.removeEventListener('blur', blur); window.removeEventListener('contextmenu', blur); T.dispose(); } };
}
