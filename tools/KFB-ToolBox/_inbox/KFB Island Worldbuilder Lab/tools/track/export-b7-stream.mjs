// V-138 (b): export the hex hub's B7 bay stream for RKIT (Bord + Gehweg + Kantensteine built against it, Q1–Q9 as Gehweg Lauf 03).
// Samples of isle_HX over the bay ± transitions ± 10 m, in TRACK METRES (the Lab draws the O1 world scaled: lab = m × 1.46, no offset),
// plus the Lab's B7 section per sample (LAB PATCH G: road edge, gutter end g1, kerb end k1, platform end pEnd, heights) and the hex tile
// surface height beside the bay. node tools/track/export-b7-stream.mjs <out.json>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0'); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
const R = await p.evaluate(async () => { const O = window.__kfb.organ(), T = window.__kfb.three(), td = O.td, S = td.samples, J = td.joints, hx = J.find((j) => j.piece === 'isle_HX'), hxS = S[hx.index].s;
  const bay = { side: 1, s0: hxS + 102, s1: hxS + 126, L: 19.2 / 1.46 }, K = 1.46, sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const uAt = (s) => Math.min(1, Math.max(0, s < bay.s0 ? (s - (bay.s0 - bay.L)) / bay.L : s > bay.s1 ? (bay.s1 + bay.L - s) / bay.L : 1));
  const hubG = O.W.world.getObjectByName('hub-tiles'), rc = new T.Raycaster(); O.W.world.updateMatrixWorld(true); const toW = O.W.world.matrixWorld, inv = toW.clone().invert(), V = (a) => new T.Vector3(...a);
  const out = []; for (let i = Math.round((bay.s0 - bay.L - 10) / td.ds); i <= Math.round((bay.s1 + bay.L + 10) / td.ds); i++) { const q = S[i], u = uAt(q.s), wG = sstep(0.15, 0.85, u), wK = sstep(0.55, 1, u), wW = sstep(0.35, 1, u), e = q.slots[7][0] - (q.prm.offset || 0);
    const g1 = e + 3.0 / K * wG, k1 = g1 + 0.3 / K * Math.max(wK, 0.02), pEnd = k1 + 6.4 / K * wW;
    const tile = []; for (const d of [pEnd + 0.5, pEnd + 3, pEnd + 6]) { const o = V(q.p).addScaledVector(V(q.R), d).addScaledVector(V(q.U), 6).applyMatrix4(toW); rc.set(o, new T.Vector3(0, -1, 0)); rc.far = 40; const h = hubG ? rc.intersectObject(hubG, true)[0] : null; tile.push(h ? +h.point.clone().applyMatrix4(inv).sub(V(q.p)).dot(V(q.U)).toFixed(3) : null); }
    out.push({ i, s: +q.s.toFixed(3), p: q.p.map((v) => +v.toFixed(4)), T: q.T.map((v) => +v.toFixed(6)), U: q.U.map((v) => +v.toFixed(6)), R: q.R.map((v) => +v.toFixed(6)), slots: q.slots, prm: q.prm, skin: q.skin,
      b7: { u: +u.toFixed(4), bande: +(1 - Math.min(1, u / 0.3)).toFixed(4), gutter: +wG.toFixed(4), kerb: +wK.toFixed(4), walk: +wW.toFixed(4), roadEdgeLat: +e.toFixed(3), gutterEndLat: +g1.toFixed(3), kerbEndLat: +k1.toFixed(3), walkEndLat: +pEnd.toFixed(3), kerbH: +(0.12 / K * wK).toFixed(4), walkY: +(0.12 / K * wK).toFixed(4) }, tileUpBesideWalk: tile }); }
  return { schema: 'kfb.lab.b7-stream/0.1', at: new Date().toISOString(), source: 'Lab organ world (O1 v7 ring, Track Core v0.12, bitgleich 0.16.1 laut RKIT Teil 0), piece isle_HX', units: 'track metres; Lab draws ×1.46 (lab = m × 1.46), W.world position 0, rotation 0',
    bay: { ...bay, catalogue: 'Track Core 0.16.1 B7 HIGHWAY|TOWN_BAY', windows: { bande: [0, 0.3], gutter: [0.15, 0.85], kerb: [0.55, 1], walk: [0.35, 1], foot: [0, 1] }, measuresLab: { gw: 3.0, kh: 0.12, kw: 0.3, ww: 6.4, wy: 0.12 } },
    note: 'b7.* = the Lab section today (LAB PATCH G, j17-track.lab.js): the orange platform between kerbEndLat and walkEndLat goes away with V-138; RKIT builds Bord + Gehweg + Kantensteine from roadEdge/gutterEnd outwards. Lateral = along R from p, height = along U. tileUpBesideWalk = hex tile top beside the walk (metres along U, relative to the road surface).', samples: out }; });
fs.writeFileSync(out, JSON.stringify(R)); console.log(out, R.samples.length, 'samples', (fs.statSync(out).size / 1024).toFixed(0) + ' KB'); await b.close();
