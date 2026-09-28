/* KFB CLAY-CITY-MVP-01 · in-browser play probe (Coworker has no local server: this runs in the real page)
   Open the stage with ?probe=1 → runs once after boot, writes window.__clayCityProbe and a <pre id="cc-probe">.
   It only presses the same keys a player presses (W/A/D, E) and uses the existing mode switch; the only
   non-player action is placing the parked car at a test start (physics.body teleport, velocity zeroed). */
import * as THREE from 'three';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const key = (code, down) => dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { code, key: code, bubbles: true }));
const hold = async (code, ms) => { key(code, true); await sleep(ms); key(code, false); };
const release = () => ['KeyW', 'KeyA', 'KeyD', 'KeyS', 'ShiftLeft'].forEach((c) => key(c, false));
const p95 = (a) => { if (!a.length) return null; const s = a.slice().sort((x, y) => x - y); return +s[Math.min(s.length - 1, Math.floor(s.length * 0.95))].toFixed(1); };

function frameMeter() {
  let on = true, last = performance.now(); const d = [];
  const tick = (t) => { if (!on) return; d.push(t - last); last = t; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  return { stop() { on = false; return { frames: d.length, p95Ms: p95(d.slice(2)), meanMs: d.length ? +(d.reduce((a, b) => a + b, 0) / d.length).toFixed(1) : null }; } };
}
function renderInfo(app) { const i = app.renderer.info.render; return { calls: i.calls, triangles: i.triangles }; }

function teleportCar(drive, x, z, heading, y = 0.9) {
  const b = drive.physics.body, h = heading / 2;
  b.setTranslation({ x, y, z }, true); b.setRotation({ x: 0, y: Math.sin(h), z: 0, w: Math.cos(h) }, true);
  b.setLinvel({ x: 0, y: 0, z: 0 }, true); b.setAngvel({ x: 0, y: 0, z: 0 }, true);
}
const carState = (drive) => { const r = drive.report(); return { x: r.position.x, y: r.position.y, z: r.position.z, kmh: r.speedKmh, contacts: r.contacts, yaw: drive.yaw }; };

/* follow a polyline with W + A/D (bang-bang with a dead band); steering sign is learned once */
async function followPath(drive, path, { timeoutMs = 30000, lookM = 11, sign = 1 } = {}) {
  const t0 = performance.now(); let idx = 0, minY = Infinity, minContacts = 4, lowContactFrames = 0, frames = 0;
  key('KeyW', true);
  while (performance.now() - t0 < timeoutMs) {
    await sleep(40); frames++;
    const c = carState(drive); minY = Math.min(minY, c.y); minContacts = Math.min(minContacts, c.contacts); if (c.contacts < 3) lowContactFrames++;
    while (idx < path.length - 1 && Math.hypot(path[idx].x - c.x, path[idx].z - c.z) < lookM) idx++;
    const tg = path[idx], want = Math.atan2(tg.x - c.x, tg.z - c.z);
    let d = want - c.yaw; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const s = d * sign;
    key('KeyA', s > 0.05); key('KeyD', s < -0.05);
    if (idx >= path.length - 1 && Math.hypot(tg.x - c.x, tg.z - c.z) < 6) break;
  }
  release();
  const c = carState(drive);
  return { reachedEnd: idx >= path.length - 1 && Math.hypot(path.at(-1).x - c.x, path.at(-1).z - c.z) < 8, lastIndex: idx, of: path.length - 1, ms: Math.round(performance.now() - t0), minY: +minY.toFixed(3), minContacts, lowContactShare: +(lowContactFrames / Math.max(1, frames)).toFixed(3), end: { x: +c.x.toFixed(1), z: +c.z.toFixed(1), y: +c.y.toFixed(2) } };
}

export async function runProbe({ app, mobility, city }) {
  const R = { schema: 'kfb.clay-city-mvp-01-probe/1', at: new Date().toISOString(), ua: navigator.userAgent, viewport: [innerWidth, innerHeight, devicePixelRatio], checks: {} };
  const drive = mobility.drive, play = app.play, rep = city.report(), ev0 = drive.physics.events.length;
  const pass = (id, ok, data) => { R.checks[id] = { pass: !!ok, ...data }; };
  const modeOf = () => String(mobility.report().mode || '').toLowerCase();

  /* 1 · structure */
  pass('city-structure', rep.district.buildings >= 60 && rep.district.buildings <= 120 && rep.track.status === 'BUILT' && rep.physics?.removedOsmTrimesh >= 1,
    { buildings: rep.district.buildings, floors: rep.district.floors, track: rep.track.status, osmHidden: rep.osmHidden.length, drawCalls: rep.drawCalls });

  /* 2 · ground walk + sprint */
  mobility.setMode('GROUND', { source: 'probe' }); await sleep(600);
  let fm = frameMeter(); const w0 = play.position.clone ? play.position.clone() : new THREE.Vector3(play.position.x, play.position.y, play.position.z);
  await hold('KeyW', 2500); await sleep(150); const w1 = new THREE.Vector3(play.position.x, play.position.y, play.position.z);
  const walk = fm.stop(), walkM = Math.hypot(w1.x - w0.x, w1.z - w0.z);
  pass('ground-walk', walkM > 2.5 && w1.y > -0.3, { metres: +walkM.toFixed(2), mps: +(walkM / 2.5).toFixed(2), y: +w1.y.toFixed(3), frame: walk, render: renderInfo(app) });

  /* 3 · walker vs Kit building: walk straight at the nearest building, must stop outside its footprint */
  {
    const b = city.plan.recipes.slice().sort((a, c) => Math.hypot(a.x - play.position.x, a.z - play.position.z) - Math.hypot(c.x - play.position.x, c.z - play.position.z))[0];
    const fx = Math.sin(b.yaw), fz = Math.cos(b.yaw), sx = b.x + fx * (b.d / 2 + 4), sz = b.z + fz * (b.d / 2 + 4);
    play.place(sx, sz, Math.atan2(-fx, -fz)); await sleep(400);
    const d0 = Math.hypot(play.position.x - b.x, play.position.z - b.z);
    let dMin = d0; key('KeyW', true); for (let k = 0; k < 65; k++) { await sleep(40); dMin = Math.min(dMin, Math.hypot(play.position.x - b.x, play.position.z - b.z)); } key('KeyW', false); await sleep(150);
    const inside = city.coll.at(play.position.x, play.position.z, -0.1);
    pass('walker-kit-collision', !inside && dMin < d0 - 1, { building: b.id, archetype: b.archetype, walkerInsideBody: !!inside, startDistM: +d0.toFixed(2), minDistM: +dMin.toFixed(2), halfDepthM: +(b.d / 2).toFixed(2) });
  }

  /* 4 · direct Auto shortcut */
  const tA = performance.now(); mobility.setMode('DRIVE', { source: 'probe Auto', allowTeleport: true }); await sleep(900);
  pass('auto-direct', modeOf() === 'drive' && drive.active, { ms: Math.round(performance.now() - tA), mode: modeOf(), carDistM: +drive.distanceTo(play.position).toFixed(2) });

  /* 5 · steering sign (learn), then city road drive */
  {
    const s0 = carState(drive); key('KeyW', true); key('KeyA', true); await sleep(900); release(); await sleep(300);
    const s1 = carState(drive); let d = s1.yaw - s0.yaw; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    R.steerSign = d >= 0 ? 1 : -1; R.steerProbeYaw = +d.toFixed(3);
  }
  /* 6 · off-road: open ground away from roads and buildings */
  {
    const tr = city.track?.path, t = app.world.tile; let spot = null;
    for (let k = 0; k < 400 && !spot; k++) { const a = k * 2.399, r = 20 + k * 0.2, x = t.cx + Math.cos(a) * r, z = t.cz + Math.sin(a) * r;
      if (city.road.dDrive(x, z, 50) > 12 && city.road.dFoot(x, z, 50) > 6 && !city.coll.at(x, z, 8) && !(tr || []).some((q) => Math.hypot(q.x - x, q.z - z) < q.hw + 12)) spot = { x, z, a }; }
    if (spot) {
      teleportCar(drive, spot.x, spot.z, spot.a); await sleep(700);
      fm = frameMeter(); const c0 = carState(drive); await hold('KeyW', 3000); await sleep(200); const c1 = carState(drive), fr = fm.stop();
      pass('offroad-drive', Math.hypot(c1.x - c0.x, c1.z - c0.z) > 8 && c1.y > -0.5 && c1.contacts >= 3, { metres: +Math.hypot(c1.x - c0.x, c1.z - c0.z).toFixed(1), y: +c1.y.toFixed(3), contacts: c1.contacts, frame: fr, render: renderInfo(app) });
    } else pass('offroad-drive', false, { reason: 'no open spot found' });
  }
  /* 7 · city road → T4 track → off its end back onto terrain */
  if (city.track?.path) {
    const P = city.track.path, pl = rep.track.placement, back = Math.atan2(P[1].x - P[0].x, P[1].z - P[0].z);
    const sx = P[0].x - Math.sin(back) * 10, sz = P[0].z - Math.cos(back) * 10;   // on the city road, 10 m before the mouth
    teleportCar(drive, sx, sz, back); await sleep(800);
    fm = frameMeter();
    const extra = [1, 2, 3].map((k) => ({ x: P.at(-1).x + (P.at(-1).x - P.at(-2).x) / Math.hypot(P.at(-1).x - P.at(-2).x, P.at(-1).z - P.at(-2).z) * 10 * k, z: P.at(-1).z + (P.at(-1).z - P.at(-2).z) / Math.hypot(P.at(-1).x - P.at(-2).x, P.at(-1).z - P.at(-2).z) * 10 * k }));
    const run = await followPath(drive, [...P, ...extra], { sign: R.steerSign, timeoutMs: 40000 });
    const fr = fm.stop(), resets = drive.physics.events.slice(ev0).filter((e) => e.type === 'recovery').map((e) => e.reason);
    pass('city-track-city', run.reachedEnd && run.minY > -0.6 && !resets.length, { ...run, resets, road: pl.road, frame: fr, render: renderInfo(app) });
  } else pass('city-track-city', false, { reason: 'track not built' });

  /* 8 · flight over the tile */
  mobility.setMode('GROUND', { source: 'probe' }); await sleep(500);
  mobility.setMode('FLIGHT', { source: 'probe' }); await sleep(1200);
  fm = frameMeter(); await hold('KeyW', 2500); const fl = fm.stop();
  pass('flight', modeOf() === 'flight', { mode: modeOf(), frame: fl, render: renderInfo(app), cameraY: +app.camera.position.y.toFixed(1) });
  mobility.setMode('GROUND', { source: 'probe' }); release();

  R.summary = { pass: Object.values(R.checks).filter((c) => c.pass).length, total: Object.keys(R.checks).length };
  window.__clayCityProbe = R;
  let pre = document.getElementById('cc-probe'); if (!pre) { pre = document.createElement('pre'); pre.id = 'cc-probe'; pre.style.cssText = 'position:fixed;left:-9999px;top:0'; document.body.appendChild(pre); }
  pre.textContent = JSON.stringify(R, null, 1);
  return R;
}
