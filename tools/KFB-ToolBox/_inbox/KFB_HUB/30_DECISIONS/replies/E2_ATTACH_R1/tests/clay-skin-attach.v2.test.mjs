// KFB · clay-skin-attach.v2 (R1b) · Node test — all v1 checks against v2, plus eyeForward / forward fit. Node test against the REAL EyeRig v6 (vendor/pet-eye-rig.v6.js, unchanged) and real three.js.
// Run from the folder E2_ATTACH_R1:   node tests/clay-skin-attach.test.mjs
// three.js: KFB_THREE=/path/to/three/build/three.module.js, else bare 'three', else the local kfb-dungeon-poc copy.
// Needs Node >= 22.12 (ES modules with .js suffix, no package.json). No browser, no WebGL: pixels are proof.html work.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { attachClaySkin, lidValuesFromV6, fitScale, LID_SKIN_NAME, eyeDepthReport } from '../clay-skin-attach.v2.js';
import { apertureV6, skinOuterMax, V6 } from '../clay-eyelid.v3.js';
import { meshQA } from '../mesh-qa.v1.js';
import { EyeRig } from '../vendor/pet-eye-rig.v6.js';

async function loadThree() {
  const tries = [process.env.KFB_THREE, 'three', '/Users/georgv.westphalen/Developer/kfb-dungeon-poc/node_modules/three/build/three.module.js'].filter(Boolean);
  for (const t of tries) {
    try { return await import(t.startsWith('/') ? pathToFileURL(t).href : t); } catch (e) { if (t.startsWith('/') && existsSync(t)) throw e; }
  }
  throw new Error('three.js not found (set KFB_THREE=/abs/path/three.module.js)');
}
const THREE = await loadThree();

let pass = 0;
const ok = (cond, label) => { assert.ok(cond, label); console.log('PASS', String(++pass).padStart(3), label); };
const meshesUnder = (o) => { const a = []; o.traverse((n) => { if (n.isMesh) a.push(n); }); return a; };

// Minimal host like proof.html buildEyes(): an invisible proxy box "body" under a group; makeMat = host lidColour, no ×0.72.
function makeRig(lidColour = 0x147663) {
  const host = new THREE.Group();
  const box = new THREE.Mesh(new THREE.BoxGeometry(1.23, 0.8, 0.24), new THREE.MeshBasicMaterial({ visible: false }));
  box.name = 'body'; box.position.set(0, 0.72, 0.12); host.add(box); host.updateMatrixWorld(true);
  const ch = { THREE, inner: host, o: { makeMat: () => new THREE.MeshStandardMaterial({ color: lidColour, roughness: 0.85 }) } };
  const rig = new EyeRig(ch, { anchor: { dx: 0.9378616267028296, dy: 0, ring: 0.3, track: 0.1 }, pupilSize: 0.4, lidFit: 0, gloss: 0.1, lashes: { length: 0, density: 6, width: 1 } });
  return { rig, host };
}
// Drive v6 to a lid state through its public API only (emote), life/kinetics off, gaze fixed, auto-blink parked.
// NOTE v6 runtime: update() uses cu = min(1, max(P.u, blink)) with blink ≥ 0, so the widest lid v6 can SHOW is c = 0
// (edge 63.7°), not the clamp −0.35 (87.3°) of the E2 bench. 'weit' therefore reads back c = 0 here; c = −0.35 is
// covered separately below by writing the shell rotations directly (a host that drives _up/_lo itself).
const STATES = [
  { label: 'weit', u: V6.lidMin, l: V6.lidMin }, { label: 'Ruhe', u: V6.restU, l: V6.restL }, { label: '25 %', u: 0.25, l: 0.25 },
  { label: '50 %', u: 0.5, l: 0.5 }, { label: '75 %', u: 0.75, l: 0.75 }, { label: 'zu', u: 1, l: 1 },
];
function drive(rig, s) {
  rig.applyEmote({ lidUpper: s.u - rig._rest.u, lidLower: s.l - rig._rest.l, slant: 0, pupil: 'normal', gaze: 'center' });
  for (let k = 0; k < 240; k++) { rig._blinkT = 1e9; rig.update(1 / 60); }
}

// ---------- 1 · attach before build (the hook path) ----------
const A = makeRig();
A.rig.setLife({ on: false }); A.rig.setKinetics({ enabled: false });
const H = attachClaySkin(A.rig, THREE);
ok(attachClaySkin(A.rig, THREE) === H, 'attach is idempotent (second call returns the same handle)');
A.rig.build();
ok(A.rig.eyes && A.rig.eyes.length === 2, 'EyeRig v6 built 2 eyes in Node');
for (const [i, e] of A.rig.eyes.entries()) {
  const t = `[eye ${i}]`;
  ok(e._up.visible === false && e._lo.visible === false, `${t} v6 lid shells _up/_lo hidden`);
  const skins = meshesUnder(e).filter((m) => m.name === LID_SKIN_NAME);
  ok(skins.length === 1, `${t} exactly one ${LID_SKIN_NAME} mesh (found ${skins.length})`);
  ok(skins[0].parent === e._lids, `${t} ${LID_SKIN_NAME} is a child of e._lids`);
  ok(skins[0].material === e._up.material, `${t} skin material === e._up.material (host makeMat)`);
  ok(skins[0].material.color.getHex() === 0x147663, `${t} lid colour = host lidColour #147663 (no ×0.72)`);
  ok(skins[0].userData.petOverlay === true && skins[0].frustumCulled === false && skins[0].castShadow === false, `${t} flags petOverlay / frustumCulled false / castShadow false`);
  const hits = []; skins[0].raycast(new THREE.Raycaster(new THREE.Vector3(0, 0, 5), new THREE.Vector3(0, 0, -1)), hits);
  ok(hits.length === 0, `${t} raycast is a no-op`);
  const vis = meshesUnder(e).filter((m) => { let n = m; while (n && n !== e) { if (!n.visible) return false; n = n.parent; } return true; });
  ok(vis.length === 3 && vis.map((m) => m.name || m.geometry.type).sort().join(',') === `SphereGeometry,SphereGeometry,${LID_SKIN_NAME}`,
    `${t} visible meshes = sclera + pupil + ${LID_SKIN_NAME} only (no extra shell): ${vis.map((m) => m.name || m.geometry.type).join(', ')}`);
  ok(meshesUnder(e).length === 5, `${t} mesh count 5 = v6's 4 (sclera, pupil, _up, _lo) + 1 skin`);
  ok(skins[0].geometry.attributes.claySeed && skins[0].geometry.attributes.claySeed.count === skins[0].geometry.attributes.position.count, `${t} claySeed attribute present for clay-material v10`);
  ok(e.scale.x === 1, `${t} no socketInnerR → no scaling (scale ${e.scale.x})`);
}

// ---------- 2 · six lid states: constant topology, χ = 2, aperture follows v6 ----------
const runs = [];
for (const s of STATES) {
  drive(A.rig, s);
  const e = A.rig.eyes[0], g = e._claySkin.geometry;
  const { cu, cl } = lidValuesFromV6(e);
  const pos = g.attributes.position.array.slice(), idx = g.index.array.slice();
  const q = meshQA(pos, idx, { eyeRadius: A.rig._R, selfIntersection: s.label === 'Ruhe' || s.label === 'zu' });
  runs.push({ s, pos, idx, q, cu, cl, ap: e._claySkinAp });
  const t = `[${s.label}]`;
  ok(Math.abs(cu - Math.max(0, s.u)) < 2e-3 && Math.abs(cl - Math.max(0, s.l)) < 2e-3, `${t} lid values read back from v6 rotations: cu ${cu.toFixed(4)} cl ${cl.toFixed(4)}`);
  const exp = apertureV6(cu, cl);
  ok(Math.abs(exp.U - e._claySkinAp.U) < 1e-3 && Math.abs(exp.L - e._claySkinAp.L) < 1e-3, `${t} skin aperture = apertureV6(cu, cl): U ${e._claySkinAp.U.toFixed(3)} L ${e._claySkinAp.L.toFixed(3)} A ${e._claySkinAp.A.toFixed(3)}`);
  ok(q.closed && q.euler === 2 && q.components === 1, `${t} χ = 2, closed, 1 body (χ ${q.euler})`);
  ok(q.raw.boundary === 0 && q.welded.nonManifold === 0 && q.raw.winding === 0, `${t} boundary 0 · non-manifold 0 · winding 0`);
  if (q.self) ok(q.self.hits === 0, `${t} self-intersection 0 hits (${q.self.tests} pairs)`);
  for (const [i, e2] of A.rig.eyes.entries()) {
    ok(meshesUnder(e2).filter((m) => m.name === LID_SKIN_NAME).length === 1 && !e2._up.visible && !e2._lo.visible, `${t} [eye ${i}] still 1 skin, shells hidden`);
  }
}
const ref = runs[0];
for (const r of runs.slice(1)) {
  ok(r.pos.length === ref.pos.length && Buffer.compare(Buffer.from(r.idx.buffer), Buffer.from(ref.idx.buffer)) === 0,
    `[${r.s.label}] vertex count ${r.pos.length / 3} and index buffer byte-equal to [weit]`);
}
ok(Buffer.compare(Buffer.from(runs[0].pos.buffer), Buffer.from(runs[5].pos.buffer)) !== 0, 'positions [weit] ≠ [zu] (the lid really moves)');
{ // c = −0.35 (E2 bench 'weit'), written straight into the v6 shells, then sync()
  const e = A.rig.eyes[0];
  e._up.rotation.x = -(1.30 - V6.lidMin * 1.18); e._lo.rotation.x = (1.30 - V6.lidMin * 1.18); H.sync();
  const g = e._claySkin.geometry, q = meshQA(g.attributes.position.array, g.index.array, { eyeRadius: A.rig._R, selfIntersection: true });
  ok(Math.abs(e._claySkinAp.U - 87.348) < 0.01, `[c −0.35 direct] upper edge ${e._claySkinAp.U.toFixed(3)}° (plan §6: 87.348)`);
  ok(q.closed && q.euler === 2 && q.self.hits === 0 && Buffer.compare(Buffer.from(g.index.array.buffer), Buffer.from(ref.idx.buffer)) === 0, `[c −0.35 direct] χ ${q.euler}, self-hits ${q.self.hits}, index byte-equal`);
}
ok(runs[5].ap.U < 0.1 && runs[5].ap.L < 0.1, `[zu] aperture closed: U ${runs[5].ap.U.toFixed(3)}° L ${runs[5].ap.L.toFixed(3)}°`);

// ---------- 3 · blink through v6 (blinkNow) reaches the skin ----------
drive(A.rig, STATES[1]);
A.rig._blinkT = 1e9; A.rig.blinkNow();
let minU = 1e9; for (let k = 0; k < 20; k++) { A.rig.update(1 / 120); minU = Math.min(minU, A.rig.eyes[0]._claySkinAp.U); }
ok(minU < 5, `v6 blinkNow() drives the skin (min U during blink ${minU.toFixed(2)}°)`);

// ---------- 4 · rebuild + reskin ----------
const oldGeo = A.rig.eyes.map((e) => e._claySkin.geometry);
let disposed = 0; oldGeo.forEach((g) => g.addEventListener('dispose', () => disposed++));
A.rig.setEye({ pupilSize: 0.45 });                                       // v6 setEye → build()
ok(A.rig.eyes.every((e) => meshesUnder(e).filter((m) => m.name === LID_SKIN_NAME).length === 1 && !e._up.visible && !e._lo.visible), 'after rebuild: still exactly one skin per eye, shells hidden');
ok(disposed === 2, `after rebuild: the 2 old skin geometries were disposed (${disposed})`);
A.rig.reskinLids(); A.rig.update(1 / 60);
ok(A.rig.eyes.every((e) => e._claySkin.material === e._up.material), 'reskinLids(): skin follows the new e._up.material');
ok(meshesUnder(A.rig.rig).length === 10, `whole rig: 10 meshes = 2 × (4 v6 + 1 skin), no stray shells (${meshesUnder(A.rig.rig).length})`);

// ---------- 5 · attach after build + fit path A (socket 1.10 R) ----------
const B = makeRig(0xfb650e);
B.rig.setLife({ on: false }); B.rig.setKinetics({ enabled: false });
B.rig.build();
B.rig.eyes.forEach((e) => e.scale.setScalar(0.99823));                   // host place(): eyes[i].scale
const HB = attachClaySkin(B.rig, THREE, { socketInnerR: 1.10 });
const sExp = (1.10 - 0.006) / skinOuterMax();
ok(Math.abs(skinOuterMax() - 1.124) < 1e-12, `skin outer max = ${skinOuterMax().toFixed(4)} R (plan §5: 1.124)`);
ok(Math.abs(HB.fit[0] - sExp) < 1e-12 && HB.fit[0] < 0.9734, `fit s = ${HB.fit[0].toFixed(5)} (plan: s ≤ 0.973 for 1.10 R, 0.006 R play)`);
ok(B.rig.eyes.every((e) => Math.abs(e.scale.x - 0.99823 * sExp) < 1e-9), `eye scaled host·s = ${(0.99823 * sExp).toFixed(5)} (eye + skin together, both under e)`);
for (const s of STATES) {
  drive(B.rig, s);
  const e = B.rig.eyes[0]; e.updateMatrixWorld(true);
  const g = e._claySkin.geometry, p = g.attributes.position, v = new THREE.Vector3(), c = e.position;
  let rMax = 0; for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(e._claySkin.matrix).applyMatrix4(e._lids.matrix).applyMatrix4(e.matrix); rMax = Math.max(rMax, v.distanceTo(c)); }
  const rR = rMax / (B.rig._R * 0.99823);
  ok(rR <= 1.10 - 0.006 + 1e-6, `[fit ${s.label}] skin outer radius ${rR.toFixed(4)} R (host R) ≤ 1.094 R → inside a 1.10 R socket shell`);
}
B.rig.eyes[0].scale.setScalar(0.99823); B.rig.update(1 / 60);              // host re-places after we applied s
ok(Math.abs(B.rig.eyes[0].scale.x - 0.99823 * sExp) < 1e-9, 'host overwrote e.scale → fit is re-applied on the next update');
ok(Math.abs(fitScale(null) - 1) < 1e-12 && Math.abs(fitScale(1.5) - 1) < 1e-12, 'fitScale: no socket → 1, roomy socket → 1 (never enlarges)');

// ---------- 6 · detach restores v6 ----------
HB.detach();
ok(B.rig.eyes.every((e) => e._up.visible && e._lo.visible && !meshesUnder(e).some((m) => m.name === LID_SKIN_NAME) && Math.abs(e.scale.x - 0.99823) < 1e-9), 'detach(): shells visible again, skin gone, host scale restored');
B.rig.build();
ok(B.rig.eyes.every((e) => !meshesUnder(e).some((m) => m.name === LID_SKIN_NAME)), 'detach(): build hook removed');

// ---------- 7 · v2: eyeForward + fit with a forward eye (socket 1.10 R, opening 66°) ----------
{
  const C = makeRig(0xfb650e);
  C.rig.setLife({ on: false }); C.rig.setKinetics({ enabled: false });
  const hostPlace = () => C.rig.eyes.forEach((e, i) => { e.position.set(i ? 0.37484 : -0.37484, 0.72647, 0.21564); e.scale.setScalar(0.99823); e.quaternion.identity(); });
  const b0 = C.rig.build.bind(C.rig); C.rig.build = (...a) => { const r = b0(...a); hostPlace(); return r; };
  const HC = attachClaySkin(C.rig, THREE, { socketInnerR: 1.10, eyeForward: 0.05, socketOpeningDeg: 66 });
  C.rig.build(); C.rig.update(1 / 60);
  const Rh = C.rig._R * 0.99823, bq = 1.10 - 0.006, aMax = Math.sqrt(bq * bq - 2 * bq * 0.05 * Math.cos(66 * Math.PI / 180) + 0.05 * 0.05);
  ok(Math.abs(HC.fit[0] - aMax / skinOuterMax()) < 1e-12, `forward fit s = ${HC.fit[0].toFixed(5)} = √(b'² − 2b'f·cos66° + f²)/1.124`);
  ok(Math.abs(fitScale(1.10, 0.006, {}, 0, 66) - (1.10 - 0.006) / skinOuterMax()) < 1e-12, 'eyeForward 0 → path A exactly (v1 value)');
  ok(Math.abs(fitScale(1.10, 0.006, {}, 0.05, null) - (bq - 0.05) / skinOuterMax()) < 1e-12, 'eyeForward without opening → conservative closed-shell fit (b′ − f)/1.124');
  ok(C.rig.eyes.every((e) => Math.abs(e.position.z - (0.21564 + 0.05 * Rh)) < 1e-9 && Math.abs(e.position.y - 0.72647) < 1e-9), `eye moved +${(0.05 * Rh).toFixed(5)} along its gaze (0.05 R_host)`);
  for (const s of STATES) {
    drive(C.rig, s);
    const e = C.rig.eyes[0]; e.updateMatrix(); e._lids.updateMatrix(); e._claySkin.updateMatrix();
    const O = new THREE.Vector3(-0.37484, 0.72647, 0.21564), p = e._claySkin.geometry.attributes.position, v = new THREE.Vector3();
    let worst = 0, back = 0;
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(e._claySkin.matrix).applyMatrix4(e._lids.matrix).applyMatrix4(e.matrix).sub(O);
      const r = v.length() / Rh, th = Math.acos(v.z / v.length()) * 180 / Math.PI; if (th >= 66) { worst = Math.max(worst, r); back++; } }
    ok(worst <= bq + 1e-6, `[fwd ${s.label}] skin behind the 66° opening edge: max ${worst.toFixed(4)} R ≤ 1.094 R (no poke through the 1.10 R shell, ${back} verts)`);
    ok(meshesUnder(e).filter((m) => m.name === LID_SKIN_NAME).length === 1 && !e._up.visible && !e._lo.visible, `[fwd ${s.label}] still 1 skin, shells hidden`);
  }
  hostPlace(); C.rig.update(1 / 60);                                      // host re-places every frame (dangle-like)
  ok(Math.abs(C.rig.eyes[0].position.z - (0.21564 + 0.05 * Rh)) < 1e-9 && Math.abs(C.rig.eyes[0].scale.x - 0.99823 * HC.fit[0]) < 1e-9, 'host re-placed position + scale → forward and fit re-applied');
  const e0 = C.rig.eyes[0]; e0.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.3); C.rig.update(1 / 60);   // host turns the eye only
  ok(Math.abs(e0.position.x - (-0.37484 + Math.sin(0.3) * 0.05 * Rh)) < 1e-9 && Math.abs(e0.position.z - (0.21564 + Math.cos(0.3) * 0.05 * Rh)) < 1e-9, 'host turned the eye → offset follows the new gaze from the same base');
  HC.detach();
  ok(Math.abs(e0.position.x + 0.37484) < 1e-9 && Math.abs(e0.position.z - 0.21564) < 1e-9 && Math.abs(e0.scale.x - 0.99823) < 1e-9, 'detach(): host position and scale restored');
  const D = makeRig(); D.rig.build(); const HD = attachClaySkin(D.rig, THREE, { eyeForward: [0.05, 0] });
  ok(HD.forward[0] === 0.05 && HD.forward[1] === 0 && HD.fit.every((x) => x === 1), 'eyeForward per eye (array); no socket → no scaling');
  const dr = eyeDepthReport({ s: HC.fit[0], eyeForward: 0.05, socketInnerR: 1.10, socketOpeningDeg: 66, rimRadius: 0.04 });
  ok(dr.frontCoverOfEyeRadius === 0 && dr.protrusion > 0.5, `eyeDepthReport(66°, f 0.05): protrusion ${dr.protrusion.toFixed(3)} R, front cover ${dr.frontCoverOfEyeRadius}`);
}

console.log(`\nTOTAL ${pass}/${pass} PASS`);
