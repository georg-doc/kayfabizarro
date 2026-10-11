// C1b+C3 delivery camera set (blind critic: no text in the images, HUD off). node tools/track/delivery-stills.mjs <outDir> <set> [query]
//   set "main": overview, drive_curve, drive_straight, drive_tunnel (race_tube, car in the tube), spawn_foot (game camera at boot),
//               near_portal_join (mouth sleeve ↔ organ), near_hub_underside, near_dock_join (track onto the hub deck), tunnel_inside
//   set "<style>": portal_near_<style> (+ portal_far_<style>) for the tunnel style given in the query (?tunnel=…)
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, set = 'main', q = ''] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&' + q); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(3000);
await p.evaluate(() => { for (const id of ['panel', 'showPanel', 'toast', 'hud']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } document.querySelectorAll('.wb-panel,#wb').forEach((e) => (e.style.display = 'none')); });
const shot = async (name, wait = 1800) => { await p.waitForTimeout(wait); const f = `${out}/${name}.jpg`; await p.screenshot({ path: f, type: 'jpeg', quality: 90 }); console.log(f); };
// camera from track frame values (metres): at sample index i, offsets along T / U / R; look at a point along the frame
const camAt = (i, back, up, side, lookAhead, lookUp = 1.5) => p.evaluate(({ i, back, up, side, lookAhead, lookUp }) => { const O = window.__kfb.organ(), T = window.__kfb.three(), S = O.td.samples, N = S.length, q = S[((i % N) + N) % N], V = (a) => new T.Vector3(a[0], a[1], a[2]);
  const P = V(q.p), cam = P.clone().addScaledVector(V(q.T), -back).addScaledVector(V(q.U), up).addScaledVector(V(q.R), side), look = P.clone().addScaledVector(V(q.T), lookAhead).addScaledVector(V(q.U), lookUp);
  window.__kfb.camOverride(cam.multiplyScalar(1.46).toArray(), look.multiplyScalar(1.46).toArray()); }, { i, back, up, side, lookAhead, lookUp });
// put the game car on the track at sample i (driver s, centred, rolling) so drive shots show the car (J17 chase framing: boom ≈ 9 m, 3.2 m up)
const carAt = (i) => p.evaluate((i) => { const t = window.__kfb.travel(), d = t.drive.driver, O = window.__kfb.organ(); d.s = O.td.samples[i].s; d.lat = 0; d.psi = 0; d.speed = 30; t.drive.update(1 / 60, {}); }, i);
const info = await p.evaluate(() => { const O = window.__kfb.organ(), td = O.td, S = td.samples, N = S.length, tun = td.tunnels, inT = (i) => tun.some((t) => i >= t.i0 - 60 && i <= t.i1 + 60);
  // curve: largest heading change in the HORIZONTAL plane over ±10 m on a level, upright deck (no loop / helix); straight: the smallest
  let bestC = 0, bc = -1, bestS = 0, bs = 1e9; for (let i = 200; i < N - 200; i += 10) { if (inT(i)) continue; const a = S[i - 20].T, c = S[i + 20].T, U = S[i].U; if (U[1] < 0.97 || Math.abs(a[1]) > 0.08 || Math.abs(c[1]) > 0.08) continue;
    const k = Math.abs(Math.atan2(a[0] * c[2] - a[2] * c[0], a[0] * c[0] + a[2] * c[2])); if (k > bc && (S[i].prm?.surface ?? 1) !== 0) { bc = k; bestC = i; } if (k < bs && Math.hypot(S[i].p[0] * 1.46 - O.hubCentre.x, S[i].p[2] * 1.46 - O.hubCentre.z) > 600) { bs = k; bestS = i; } }
  return { curve: bestC, straight: bestS, tunnels: tun.map((t) => [t.i0, t.i1]), hub: O.hubCentre.toArray(), sCar: O.sCar, N }; });
const hideFig = (h) => p.evaluate((h) => { window.__kfb.travel().walk.root.visible = !h; }, h);
if (set === 'main') {
  await p.evaluate(() => window.__kfb.camOverride(null)); await shot('spawn_foot', 2500);
  await p.evaluate((h) => window.__kfb.camOverride([h[0] * 0.2 - 3400, 2600, 3400], [0, 150, 0]), info.hub); await shot('overview');
  await hideFig(true); await carAt(info.curve); await camAt(info.curve, 9, 3.4, 0, 18); await shot('drive_curve');
  await carAt(info.straight); await camAt(info.straight, 9, 3.4, 0, 18); await shot('drive_straight');
  const tm = Math.round((info.tunnels[0][0] + info.tunnels[0][1]) / 2); await carAt(tm); await camAt(tm, 9, 3.4, 0, 18); await shot('drive_tunnel');
  await camAt(tm + 160, 0, 3, 0, 30, 3); await shot('tunnel_inside'); await hideFig(false);
  const i0 = info.tunnels[1][0] - 25; await camAt(i0, 28, 6, 26, 8, 4); await shot('near_portal_join');
  await p.evaluate((h) => window.__kfb.camOverride([h[0] + 420, h[1] - 90, h[2] + 300], [h[0], h[1] - 40, h[2]]), info.hub); await shot('near_hub_underside');
  // the track leaves the hub: first sample > 60 m from the hub centre along the ring from the car
  // the dock edge: first sample after the car where no hub tile lies under the deck (ray down 30 lab)
  const dock = await p.evaluate(() => { const O = window.__kfb.organ(), T = window.__kfb.three(), S = O.td.samples, rc = new T.Raycaster(), hub = O.walk.filter((m) => !/fahrbahn|bande|strang/.test(m.name)); let i = Math.round(O.sCar / O.td.ds);
    for (let k = 0; k < 4000; k++, i++) { const q = S[i % S.length], o = new T.Vector3(q.p[0], q.p[1], q.p[2]).multiplyScalar(1.46); o.y += 2; rc.set(o, new T.Vector3(0, -1, 0)); rc.far = 30; if (!rc.intersectObjects(hub, false).length) return i % S.length; } return 0; });
  await camAt(dock, -2, 7, 24, 6, -2); await shot('near_dock_join'); await camAt(dock, 14, 16, 0, 2, 0); await shot('near_dock_top');
} else if (/tunnelField=/.test(q)) {
  // field-tunnel prototype: the first field tunnel; mouths from the field scan (ft.mouthIn / mouthOut, metres outside i0 / i1)
  const f = await p.evaluate(() => { const O = window.__kfb.organ(), [, e] = [...O.fieldTun.entries()][0], t = (e.hero ?? Object.values(e)[0]).ft[0]; return { i0: t.i0, i1: t.i1, mIn: Math.round(t.i0 - t.mouthIn / O.td.ds), mOut: Math.round(t.i1 + t.mouthOut / O.td.ds), ds: O.td.ds }; });
  const n = (m) => Math.round(m / f.ds);
  await camAt(f.mIn, 30, 5, 0, 0, 5); await shot(`portal_near_${set}`);
  await camAt(f.mIn, 70, 12, 30, 0, 5); await shot(`portal_far_${set}`);
  await hideFig(true); await carAt(f.mIn - n(24)); await camAt(f.mIn - n(24), 9, 3.4, 0, 18); await shot(`mouth_road_${set}`); await hideFig(false);   // J17 chase framing, car 24 m before the mouth: road runs into the mouth
  await camAt(f.mIn, 22, 9, -24, 4, 2); await shot(`mouth_side_${set}`);
  await camAt(f.mIn + n(20), 0, 3, 0, 30, 3); await shot(`inside_${set}`);
  await camAt(Math.round((f.i0 + f.i1) / 2), 0, 3, 0, 30, 3); await shot(`inside_mid_${set}`);
  await camAt(f.mOut + n(30), -30, 5, 0, -40, 5); await shot(`portal_out_${set}`);
  const at = await p.evaluate(() => { const O = window.__kfb.organ(), B = O.W.built.find((x) => x.id === [...O.fieldTun.keys()][0]), bb = new (window.__kfb.three().Box3)().setFromObject(B.tiers.hero.g), c = bb.getCenter(new (window.__kfb.three().Vector3)()), r = bb.getSize(new (window.__kfb.three().Vector3)()).length() * 0.62; return [c.toArray(), r]; });
  await p.evaluate(([c, r]) => window.__kfb.camOverride([c[0] + r * 0.8, c[1] + r * 0.35, c[2] + r * 0.6], c), at); await shot(`body_${set}`);
} else {
  const i0 = info.tunnels[0][0] - 25; await camAt(i0, 30, 5, 0, 0, 5); await shot(`portal_near_${set}`);
  await camAt(i0, 70, 12, 30, 0, 5); await shot(`portal_far_${set}`);
  await camAt(Math.round((info.tunnels[0][0] + info.tunnels[0][1]) / 2), 0, 3, 0, 30, 3); await shot(`inside_${set}`);
}
await b.close();
