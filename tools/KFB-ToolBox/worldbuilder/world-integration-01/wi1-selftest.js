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
    { const c = W.city.stats, lm = (c.base || 0) + (c.base2 || 0), miss = W.zone.counts.buildings - c.buildings - lm; ok('city layer = zone buildings (ordinary + protected landmark bases)', miss <= Math.ceil(W.zone.counts.buildings * 0.015), c.buildings + ' ordinary + ' + lm + ' landmark-base parts / ' + W.zone.counts.buildings + (miss ? ' · ' + miss + ' not built (degenerate ring / shell failed ' + (c.failed || 0) + ')' : '')); }
    ok('WB2 terrain mesh is the world tile', A.terrain && A.terrain.geometry.parameters.width === W.tile.size, W.tile.size + ' m @ ' + (W.tile.size / W.tile.seg) + ' m');
    ok('scene document is a WB2 document', A.doc.format === 'kfb-worldbuilder-scene' && A.doc.version === 1 && A.doc.id === W.docId && !!A.doc.world);
    /* 2 · actor + consumed locomotion profile (KayKit 1.1 canon) */
    const act = P.actor.actions, V = P.speeds;
    const need = ['idle', 'walk', 'run', 'backward', 'strafe.left', 'strafe.right', 'jump.start', 'jump.air', 'jump.land', 'crouch', 'sneak', 'crawl'];
    ok('KayKit semantic states bound', need.every((s) => act[s]), need.filter((s) => !act[s]).join(' ') || need.length + ' states');
    ok('source-backed clips only (variants labelled)', P.profile().rows.every((r) => r.sourceClip && (r.variant == null || /no .* clip/.test(r.variant))), P.profile().rows.filter((r) => r.variant).map((r) => r.state).join(' · ') + ' = playback variants');
    const fb = P.actor.report.face;
    ok('one face owner (graft) · no second eye rig', !fb || (fb.eyeRig === 1 && fb.mouth <= 1), fb ? 'eyeRig ' + fb.eyeRig : 'fallback actor');
    /* 3 · tier chain idle → walk → walk.fast → run → sprint → back down → idle (states from movement) */
    P.place(sp.x, sp.z, h); P.drive({}, 0.4);
    const seq = []; const rec = (m) => { if (seq[seq.length - 1] !== m.state) seq.push(m.state); };
    P.drive({ iy: 1 }, 2.6, 1 / 60, rec); P.drive({ iy: 1, sprint: true }, 2.8, 1 / 60, rec); P.drive({ iy: 1 }, 0.9, 1 / 60, rec); P.drive({}, 1.2, 1 / 60, rec);
    const order = ['idle', 'walk', 'walk.fast', 'run', 'sprint', 'walk', 'idle']; let oi = 0; for (const q of seq) if (q === order[oi]) oi++;
    ok('tier chain up and down', oi === order.length, seq.join(' → '));
    const flicker = seq.length <= order.length + 3;
    ok('no state flicker (hysteresis)', flicker, seq.length + ' state changes');
    /* 4 · each tier: distance = commanded speed × time, planted feet stay planted */
    const tiers = [['walk', { iy: 1 }, 0.9], ['walk.fast', { iy: 1 }, 1.9], ['run', { iy: 1, sprint: true }, 0.9], ['sprint', { iy: 1, sprint: true }, 1.9], ['backward', { iy: -1 }, 0.9], ['strafe.walk', { ix: 1 }, 0.9]];
    const tune0 = { ...P.tune };
    for (const [name, inp, warm] of tiers) {
      P.tune.paceUp = name !== 'walk'; P.tune.sprint = name !== 'run';   // hold-to-pace-up would change the tier mid-measurement
      P.place(sp.x, sp.z, h); P.drive({}, 0.3); P.drive(inp, warm); P.resetSlip();
      const p0 = P.position.clone(); P.drive(inp, 1.4);
      const v = flat(P.position, p0) / 1.4, want = V[name];
      ok(name + ' covers tier speed × time', Math.abs(v - want) < want * 0.12, r2(v) + ' vs ' + r2(want) + ' m/s');
      ok(name + ' state from movement', P.motion.state === name, P.motion.state + ' · ' + P.motion.clip + ' ×' + r2(P.motion.ts));
      const sr = P.slipReport()[name], ck = P.motion.clip, src = P.actor.measured(ck), own = src ? src.residualSkateMs * Math.abs(P.motion.ts) : 0;
      /* floor = 25 % of body speed, or the source clip's OWN residual skate at this playback rate + 0.05 m/s (named, not hidden) */
      const lim = Math.max(0.25 * (sr ? sr.bodySpeedMs : 0), own + 0.05);
      ok(name + ' planted-foot skate within floor', sr && sr.steps >= 2 && sr.skateMs < lim, sr ? r2(sr.skateMs) + ' m/s at ' + r2(sr.bodySpeedMs) + ' m/s over ' + sr.steps + ' contacts · floor ' + r2(lim) + (own + 0.05 > 0.25 * sr.bodySpeedMs ? ' (source residual ' + r2(src.residualSkateMs) + ' m/s × ' + r2(P.motion.ts) + ')' : '') : 'no contact samples');
    }
    Object.assign(P.tune, tune0);
    /* posture: crouch / sneak / crawl travel with their own source clips */
    for (const p of ['crouch', 'sneak', 'crawl']) {
      P.place(sp.x, sp.z, h); P.setPosture(p); P.drive({}, 0.3); const p0 = P.position.clone(); P.drive({ iy: 1 }, 1.2);
      const moved = flat(P.position, p0);
      ok(p + ' posture from source clip', V[p] > 0 ? P.motion.state === p && moved > 0.3 * V[p] : P.motion.clip === p || P.motion.posture === p, P.motion.state + ' · ' + r2(V[p]) + ' m/s' + (V[p] > 0 ? '' : ' (in-place clip)'));
      P.drive({}, 0.5); ok(p + ' hold when stopping', P.motion.state === p + '.hold' || V[p] === 0, P.motion.state);
      P.setPosture('stand');
    }
    /* jump start / air / land + ground contact */
    P.place(sp.x, sp.z, h); P.drive({}, 0.4);
    const y0 = P.position.y, seen = new Set(); let top = y0;
    P.walker.jump();
    for (let i = 0; i < 90; i++) { P.drive({}, 1 / 60); seen.add(P.motion.state); top = Math.max(top, P.position.y); }
    const apex = P.params.jumpV * P.params.jumpV / (2 * P.params.gravity);
    ok('jump passes jump.start → jump.air → jump.land', seen.has('jump.start') && seen.has('jump.air') && seen.has('jump.land'), [...seen].join(' → '));
    ok('jump apex in metres (physics owns vertical travel)', Math.abs(top - y0 - apex) < 0.12, r2(top - y0) + ' m (controller ' + r2(apex) + ')');
    P.drive({}, 0.6);
    ok('back on the ground · idle', P.walker.state.onGround && Math.abs(P.position.y - A.terrainHeightAt(P.position.x, P.position.z)) < 0.03 && P.motion.state === 'idle', P.motion.state);
    /* outline follows visible geometry only (pixel proof around the head graft) */
    if (P.actor.graft) {
      const hb = new THREE.Box3(); let head = null; P.actor.holder.traverse((o) => { if (!head && o.name === 'kfb-head') head = o; });
      const c = head ? hb.setFromObject(head).getCenter(new THREE.Vector3()) : null;
      const pr = W.inkGhostProbe(A.renderer, A.scene, P.actor.holder, { center: c, dist: 1.4 });
      ok('ink pass ⊆ visible geometry (head graft)', pr.colourPx > 1000 && pr.ghostShare < 0.01, pr.ghostPx + ' ghost px / ' + pr.colourPx + ' visible px · excluded ' + pr.excluded.join(', '));
    }
    /* presenter rules on this zone */
    const cs = W.city.stats;
    ok('FACADE_RULE v1 on every ordinary building', cs.facade.rule === 'kfb-facade-rule-v1' && cs.facade.bare <= Math.ceil(cs.buildings * 0.005), cs.facade.windows + ' windows · ' + cs.facade.doors + ' doors · bare ' + cs.facade.bare);
    ok('wall normals from wall faces only (no bright band under the roof)', cs.wallNormalsOnly >= cs.buildings, cs.wallNormalsOnly + ' shells (' + cs.buildings + ' ordinary)');
    {
      /* counterfactual measured while building: top-ring mean n.y with the lid averaged in vs wall faces only */
      const q = cs.topRing, full = q ? q.full / q.n : 0, wall = q ? q.wall / q.n : 0;
      ok('top wall row no longer bent up by the lid', q && q.n >= cs.buildings && full - wall > 0.1, 'mean top-ring n.y ' + r2(full) + ' (lid-averaged) → ' + r2(wall) + ' (walls only) over ' + (q ? q.n : 0) + ' shells');
    }
    /* 5 · EDIT changes the state the world uses: raise ahead, walk over it */
    const T = pt(4.5), base = A.terrainHeightAt(T.x, T.z);
    const st = makeStroke('raise', 3.2, 0.12);
    for (let i = 0; i < 9; i++) addStrokePoint(st, T.x + f.x * (i - 4) * 0.35, T.z + f.z * (i - 4) * 0.35, 0);
    S.strokes.push(st); A.buildTerrain(); A.refreshDoc();
    const raised = A.terrainHeightAt(T.x, T.z);
    ok('Raise changes terrain truth', raised > base + 0.6, r2(base) + ' → ' + r2(raised) + ' m');
    const ray = new THREE.Raycaster(new THREE.Vector3(T.x, 50, T.z), new THREE.Vector3(0, -1, 0)).intersectObject(A.terrain, false)[0];
    ok('terrain mesh = terrain truth', ray && Math.abs(ray.point.y - raised) < 0.05, ray ? r2(ray.point.y) : 'no hit');
    const walkOnto = () => { P.place(sp.x, sp.z, h); P.drive({}, 0.3); for (let i = 0; i < 900 && flat(P.position, sp) < 4.5; i++) P.drive({ iy: 1 }, 1 / 60); return P.position.y; };
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
    /* 7b · buildings sit on the host terrain: raise, then lower under a house → no floating, no plate */
    {
      const recs = W.city.support.records, T0 = W.tile, inTile = (r) => r.x0 > T0.cx - T0.size / 2 + 8 && r.x1 < T0.cx + T0.size / 2 - 8 && r.z0 > T0.cz - T0.size / 2 + 8 && r.z1 < T0.cz + T0.size / 2 - 8;
      const maxD = (r) => Math.max(...r.samples.map(([x, z]) => Math.hypot(x - r.samples[0][0], z - r.samples[0][1])));
      let rb = null; for (const r of recs) if (inTile(r) && maxD(r) < 15 && (!rb || Math.hypot(r.samples[0][0] - sp.x, r.samples[0][1] - sp.z) < Math.hypot(rb.samples[0][0] - sp.x, rb.samples[0][1] - sp.z))) rb = r;
      ok('a building on the edit tile', !!rb, rb ? rb.id : 'none');
      const S = A.sculptState();   // reloadDoc replaced the document: fetch the live sculpt layer
      const [bx, bz] = rb.samples[0], minUnder = () => Math.min(...rb.samples.map(([x, z]) => A.terrainHeightAt(x, z)));
      const RAD = 2 * maxD(rb) + 5;
      const up = makeStroke('raise', RAD, 0.25); for (let i = 0; i < 8; i++) addStrokePoint(up, bx, bz, 0); S.strokes.push(up); A.buildTerrain(); A.refreshDoc();
      ok('building rides raised terrain (lowest support point)', Math.abs(W.city.support.offsetOf(rb.id) - minUnder()) < 1e-3 && minUnder() > 0.3, 'offset ' + r2(W.city.support.offsetOf(rb.id)) + ' m = min terrain ' + r2(minUnder()));
      const dn = makeStroke('lower', RAD, 0.25); for (let i = 0; i < 20; i++) addStrokePoint(dn, bx, bz, 0); S.strokes.push(dn); A.buildTerrain(); A.refreshDoc();
      ok('building follows lowered terrain (never floats)', Math.abs(W.city.support.offsetOf(rb.id) - minUnder()) < 1e-3 && minUnder() < -0.3, 'offset ' + r2(W.city.support.offsetOf(rb.id)) + ' m = min terrain ' + r2(minUnder()));
      ok('walker ground = roof on its support', Math.abs(P.ground(bx, bz) - Math.max(A.terrainHeightAt(bx, bz), W.city.support.offsetOf(rb.id) + W.buildingAt(bx, bz).top)) < 1e-3 || !W.buildingAt(bx, bz));
      A.sculptState().strokes.splice(-2, 2); A.buildTerrain(); A.refreshDoc();
      ok('support resets with the sculpt', Math.abs(W.city.support.offsetOf(rb.id)) < 1e-3);
    }
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
