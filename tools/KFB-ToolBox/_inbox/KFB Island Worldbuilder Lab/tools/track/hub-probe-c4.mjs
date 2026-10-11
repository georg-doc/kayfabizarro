// C4a measure: the hub straight isle_HX (joints, length, road half width, slot heights) and the hex tile surface beside the road on both
// sides (rays down onto the hub group, track metres relative to the road surface), every 2 m along the straight, out to 16 m from the edge
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0'); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
console.log(JSON.stringify(await p.evaluate(() => { const O = window.__kfb.organ(), T = window.__kfb.three(), td = O.td, S = td.samples, J = td.joints, k = J.findIndex((j) => j.piece === 'isle_HX'), iA = J[k].index, iB = J[k + 1].index, W = O.W, hub = W.hub;
  const hubG = W.world.children.find((g) => g.isGroup && Math.hypot(g.position.x - hub.c[0], g.position.z - hub.c[1]) < 1), rc = new T.Raycaster(), V = (a) => new T.Vector3(...a);
  W.world.updateMatrixWorld(true); const toW = W.world.matrixWorld, inv = toW.clone().invert(), q0 = S[Math.round((iA + iB) / 2)];
  const rows = []; for (let i = iA; i <= iB; i += Math.round(2 / td.ds)) { const q = S[i], half = (q.slots[7][0] - q.slots[6][0]) / 2, row = { s: +(q.s - S[iA].s).toFixed(1) };
    for (const sd of [-1, 1]) { const hs = []; for (let d = 0.5; d <= 16; d += 1.5) { const o = V(q.p).addScaledVector(V(q.R), sd * (half + d)).addScaledVector(V(q.U), 6).applyMatrix4(toW); rc.set(o, new T.Vector3(0, -1, 0)); rc.far = 30 * 1.46; const h = rc.intersectObject(hubG, true)[0]; hs.push(h ? +((h.point.clone().applyMatrix4(inv).sub(V(q.p))).dot(V(q.U))).toFixed(2) : null); } row[sd < 0 ? 'L' : 'R'] = hs; }
    rows.push(row); }
  return { iA, iB, len: +(S[iB].s - S[iA].s).toFixed(2), ds: td.ds, half: +((q0.slots[7][0] - q0.slots[6][0]) / 2).toFixed(2), slotsMid: q0.slots.map((s) => s.map((v) => +v.toFixed(2))), skin: q0.skin, prm: q0.prm, hub: { c: hub.c, y: hub.y, r: hub.r, HM: hub.HM, d: hub.d }, sCar: O.sCar - S[iA].s, rows, dLat: 'half + 0.5, 2, 3.5 … 15.5' }; })));
await b.close();
