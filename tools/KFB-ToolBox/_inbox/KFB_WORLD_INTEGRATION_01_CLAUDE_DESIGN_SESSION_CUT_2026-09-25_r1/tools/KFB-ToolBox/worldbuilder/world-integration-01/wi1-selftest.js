/* KFB WorldBuilder · WORLD-INTEGRATION-01 · self-test (?selftest=wi1 or Scene drawer button)
   Every assertion runs on the live WorldBuilder state (window.__wb2d) — the same terrainHeightAt,
   sculpt layer, scene objects, save/reload and walker the human uses. The player's own step() is
   driven deterministically at 60 Hz. The user's saved world is backed up and restored. */
import * as THREE from 'three';
import { makeStroke, addStrokePoint } from '../wb2-terrain-sculpt-01/terrain-sculpt.js';

export async function run(A) {
  const W = A.world, P = A.play, rep = [];
  if (!W || !P) throw new Error('world/play not ready');
  const ok = (n, c, x = '') => { if (!c) throw new Error('WI1 SELFTEST FAIL · ' + n + (x ? ' · ' + x : '')); rep.push('PASS · ' + n + (x ? ' · ' + x : '')); };
  const r2 = (v) => (+v).toFixed(2);
  const backup = localStorage.getItem(A.STORAGE_KEY), docBefore = JSON.stringify(A.doc), wasOn = P.on, inkWas = W.inkOn;
  document.body.dataset.wi1Selftest = 'RUNNING';
  const sp = W.spawn, h = sp.heading, f = { x: Math.sin(h), z: Math.cos(h) };
  const pt = (d) => ({ x: sp.x + f.x * d, z: sp.z + f.z * d });
  const flat = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
  try {
    A.setPlay(false);
    const S = A.sculptState(); S.strokes = []; A.buildTerrain(); A.refreshDoc();
    /* 1 · the world is the zone, in the WorldBuilder's own terrain */
    ok('zone through wd1-seam', W.zone.buildings.length > 100, W.zone.id + ' · ' + W.zone.buildings.length + ' buildings');
    ok('city layer = every zone building', W.city.stats.buildings === W.zone.counts.buildings, W.city.stats.buildings + '/' + W.zone.counts.buildings);
    ok('WB2 terrain mesh is the world tile', A.terrain && A.terrain.geometry.parameters.width === W.tile.size, W.tile.size + ' m @ ' + (W.tile.size / W.tile.seg) + ' m');
    ok('scene document is a WB2 document', A.doc.format === 'kfb-worldbuilder-scene' && A.doc.version === 1 && A.doc.id === W.docId && !!A.doc.world);
    /* 2 · actor + motion states */
    const act = P.actor.actions;
    ok('semantic states bound', ['Idle', 'Walk', 'Run', 'JumpStart', 'JumpLand'].every((s) => act[s]) && (act.JumpAir || act.JumpStart), Object.keys(act).join(' '));
    ok('walker walk speed = measured walk clip × cadence', Math.abs(P.params.speed - (P.actor.native('Walk') || 0) * P.speeds.cadence) < 1e-9, r2(P.actor.native('Walk')) + ' × ' + r2(P.speeds.cadence) + ' = ' + r2(P.params.speed) + ' m/s');
    const fb = P.actor.report.face;
    ok('one face owner (graft) · no second eye rig', !fb || (fb.eyeRig === 1 && fb.mouth <= 1), fb ? 'eyeRig ' + fb.eyeRig + ' · donor eyes stripped ' + fb.donorEyesStripped : 'fallback actor');
    /* 3 · walk / run: distance = speed × time, planted feet stay planted */
    for (const [name, sprint] of [['Walk', false], ['Run', true]]) {
      P.place(sp.x, sp.z, h); P.drive({}, 0.4); P.drive({ iy: 1, sprint }, 0.5); P.resetSlip();   // steady state: after the Idle→Walk crossfade
      const p0 = P.position.clone(); P.drive({ iy: 1, sprint }, 1.6);
      const v = flat(P.position, p0) / 1.6, want = P.params.speed * (sprint ? P.params.sprintMul : 1);
      ok(name + ' covers speed × time', Math.abs(v - want) < want * 0.12, r2(v) + ' vs ' + r2(want) + ' m/s');
      ok(name + ' state from movement', P.motion.state === name, P.motion.state + ' · clip ×' + r2(P.motion.ts));
      const s = P.slipReport()[name];
      ok(name + ' planted-foot skate < 25 % of body speed', s && s.steps >= 2 && s.skateMs < 0.25 * s.bodySpeedMs, s ? r2(s.skateMs) + ' / ' + r2(s.bodySpeedMs) + ' m/s over ' + s.steps + ' contacts' : 'no contact samples');
    }
    /* 4 · jump start / air / land + ground contact */
    P.place(sp.x, sp.z, h); P.drive({}, 0.4);
    const y0 = P.position.y, seen = new Set(); let top = y0;
    P.walker.jump();
    for (let i = 0; i < 90; i++) { P.drive({}, 1 / 60); seen.add(P.motion.state); top = Math.max(top, P.position.y); }
    const apex = P.params.jumpV * P.params.jumpV / (2 * P.params.gravity);
    ok('jump passes JumpStart → JumpAir → JumpLand', seen.has('JumpStart') && (seen.has('JumpAir') || !act.JumpAir) && seen.has('JumpLand'), [...seen].join(' → '));
    ok('jump apex in metres', Math.abs(top - y0 - apex) < 0.12, r2(top - y0) + ' m (controller ' + r2(apex) + ')');
    ok('back on the ground', P.walker.state.onGround && Math.abs(P.position.y - A.terrainHeightAt(P.position.x, P.position.z)) < 0.03);
    /* 5 · EDIT changes the state the world uses: raise ahead, walk over it */
    const T = pt(4.5), base = A.terrainHeightAt(T.x, T.z);
    const st = makeStroke('raise', 3.2, 0.12);
    for (let i = 0; i < 9; i++) addStrokePoint(st, T.x + f.x * (i - 4) * 0.35, T.z + f.z * (i - 4) * 0.35, 0);
    S.strokes.push(st); A.buildTerrain(); A.refreshDoc();
    const raised = A.terrainHeightAt(T.x, T.z);
    ok('Raise changes terrain truth', raised > base + 0.6, r2(base) + ' → ' + r2(raised) + ' m');
    const ray = new THREE.Raycaster(new THREE.Vector3(T.x, 50, T.z), new THREE.Vector3(0, -1, 0)).intersectObject(A.terrain, false)[0];
    ok('terrain mesh = terrain truth', ray && Math.abs(ray.point.y - raised) < 0.05, ray ? r2(ray.point.y) : 'no hit');
    const walkOnto = () => { P.place(sp.x, sp.z, h); P.drive({}, 0.3); P.drive({ iy: 1 }, 4.5 / P.params.speed); return P.position.y; };
    let y = walkOnto();
    ok('walker rides the raised terrain', y > base + 0.5 && Math.abs(y - A.terrainHeightAt(P.position.x, P.position.z)) < 0.1, 'y ' + r2(y) + ' at ' + r2(flat(P.position, T)) + ' m from the stroke');
    /* 6 · save / reload → the world keeps the edit, play continues on it */
    A.saveDoc();
    S.strokes = []; A.buildTerrain();
    ok('clear in memory restores base', Math.abs(A.terrainHeightAt(T.x, T.z) - base) < 1e-6);
    await A.reloadDoc();
    ok('reload restores the sculpt', Math.abs(A.terrainHeightAt(T.x, T.z) - raised) < 1e-4, r2(A.terrainHeightAt(T.x, T.z)) + ' m');
    y = walkOnto();
    ok('play after reload walks the changed place', y > base + 0.5, 'y ' + r2(y));
    /* 7 · object edit → obstacle in play, and persisted */
    const prop = A.sceneObjects.get('landmark-boulder');
    ok('boulder present', !!prop);
    const M = pt(2);
    prop.position.set(M.x, A.terrainHeightAt(M.x, M.z), M.z); prop.updateMatrixWorld(true); A.updateRecordFromRoot(prop); A.refreshDoc(); P.refreshObstacles();
    ok('moved object is solid for the walker', P.ground(M.x, M.z) > A.terrainHeightAt(M.x, M.z) + 0.3, r2(P.ground(M.x, M.z) - A.terrainHeightAt(M.x, M.z)) + ' m above ground');
    A.saveDoc(); const saved = prop.position.clone();
    await A.reloadDoc();
    const prop2 = A.sceneObjects.get('landmark-boulder');
    ok('object move survives reload', prop2 && flat(prop2.position, saved) < 1e-3);
    /* 8 · ink only around drawn geometry */
    W.setInk(true); for (let i = 0; i < 2; i++) W.render(0, A.renderer, A.scene, A.camera);
    const ir = W.inkReport;
    ok('ink excludes invisible geometry', ir && ir.excludedInvisible >= (P.actor.graft ? 1 : 0), ir ? ir.excludedInvisible + ' · ' + ir.names.join(', ') : 'no report');
    document.body.dataset.wi1Selftest = 'PASS';
    document.body.dataset.wi1SelftestCount = rep.length + '/' + rep.length;
  } catch (e) {
    document.body.dataset.wi1Selftest = 'FAIL'; rep.push(String(e.message || e)); throw Object.assign(e, { report: rep });
  } finally {
    W.setInk(inkWas);
    try { localStorage.setItem(A.STORAGE_KEY, docBefore); await A.reloadDoc(); } catch (e) { console.warn(e); }
    if (backup == null) localStorage.removeItem(A.STORAGE_KEY); else localStorage.setItem(A.STORAGE_KEY, backup);
    A.setPlay(wasOn);
    window.__wi1SelftestReport = rep;
  }
  return rep;
}
