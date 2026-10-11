// Lauf 03 (Steuerung: arch chain Town–Protopia): measured bridge axis for RKIT: rim/pier ends along the axis, spans,
// deck heights and plate thickness at the roots (ray down onto the top, ray up onto the body). node tools/stage1/bridge-axis.mjs [out.json]
import fs from 'node:fs';
import { openLab } from './browser.mjs';
const { page, close } = await openLab('world=mvp1&shot=1');
const r = await page.evaluate(async () => {
  const THREE = await import('/node_modules/.vite/deps/three.js');
  const k = window.__kfb, T = k.app.islands.get('kfb_town'), P = k.app.islands.get('protopia');
  for (const i of [T, P]) i.group.updateMatrixWorld(true);
  const tp = T.spec.pos, pp = P.spec.pos, ta = T.spec.anchors.find((a) => a.id === 'kfb_town.rim.protopia').p, pa = P.spec.anchors.find((a) => a.id === 'protopia.rim.town').p;
  const A = [ta[0] + tp[0], ta[1] + tp[2]], B = [pa[0] + pp[0], pa[1] + pp[2]], L = Math.hypot(B[0] - A[0], B[1] - A[1]), ux = (B[0] - A[0]) / L, uz = (B[1] - A[1]) / L;
  const bodies = [{ id: 'kfb_town', g: T.group }, { id: 'protopia', g: P.group.children.find((c) => c.name !== 'fragments') ? P.group : P.group }];
  const meshes = (root, pred) => { const a = []; root.traverse((o) => { if (o.isMesh && pred(o)) a.push(o); }); return a; };
  const fr = P.fragments, piers = fr.subs.map((s, i) => ({ id: fr.specs[i].id, top: meshes(s, (o) => o.name === 'fragment-ground'), under: meshes(s, (o) => o.name === 'fragment-under') }));
  const islTop = (isl) => meshes(isl.group, (o) => o.name === 'ground'), islUnder = (isl) => meshes(isl.group, (o) => o.name === 'under');
  const ray = new THREE.Raycaster();
  const down = (x, z, ms) => { ray.set(new THREE.Vector3(x, 200, z), new THREE.Vector3(0, -1, 0)); const h = ray.intersectObjects(ms, false)[0]; return h ? h.point.y : null; };
  const up = (x, z, ms) => { ray.set(new THREE.Vector3(x, -400, z), new THREE.Vector3(0, 1, 0)); const h = ray.intersectObjects(ms, false)[0]; return h ? h.point.y : null; };
  const runs = (ms) => { const out = []; let cur = null; for (let s = -20; s <= L + 20; s += 0.25) { const x = A[0] + ux * s, z = A[1] + uz * s, y = down(x, z, ms); if (y != null) { if (!cur) cur = [s, s]; else cur[1] = s; } else if (cur) { out.push(cur); cur = null; } } if (cur) out.push(cur); return out; };
  const at = (s) => [A[0] + ux * s, A[1] + uz * s];
  // thickness top → body at axis distance s, minimum over the bridge width ±11.6 (RKIT: rock to springer + 1.1 across)
  const thick1 = (s, lat, top, under) => { const [x0, z0] = at(s), x = x0 - uz * lat, z = z0 + ux * lat, yt = down(x, z, top), yb = up(x, z, under); return yt != null && yb != null ? yt - yb : null; };
  const thick = (s, top, under) => { const v = [-11.6, -5.8, 0, 5.8, 11.6].map((l) => thick1(s, l, top, under)); return v.some((q) => q == null) ? null : +Math.min(...v).toFixed(2); };
  const tRun = runs(islTop(T)), pRun = runs(islTop(P)), pierRuns = piers.map((p) => ({ id: p.id, run: runs(p.top), p }));
  const townEnd = Math.max(...tRun.map((r) => r[1])), protStart = Math.min(...pRun.map((r) => r[0]));
  const ps = pierRuns.map((q) => { const [s0, s1] = q.run.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]))[0];
    return { id: q.id, s0, s1, length: +(s1 - s0).toFixed(2), deckY: [down(...at(s0 + 0.5), q.p.top), down(...at(s1 - 0.5), q.p.top)].map((v) => +v.toFixed(2)),
      thickness: { townSide: { at1: thick(s0 + 1, q.p.top, q.p.under), at3: thick(s0 + 3, q.p.top, q.p.under), at6: thick(s0 + 6, q.p.top, q.p.under) }, protopiaSide: { at1: thick(s1 - 1, q.p.top, q.p.under), at3: thick(s1 - 3, q.p.top, q.p.under), at6: thick(s1 - 6, q.p.top, q.p.under) } } }; }).sort((a, b) => a.s0 - b.s0);
  const ends = [townEnd, ...ps.flatMap((p) => [p.s0, p.s1]), protStart];
  const spans = []; for (let i = 0; i < ends.length; i += 2) spans.push(+(ends[i + 1] - ends[i]).toFixed(2));
  const P0 = P.spec.pos;
  return { protopiaPos: P0, axis: { from: 'kfb_town.rim.protopia', to: 'protopia.rim.town', A, B, length: +L.toFixed(2), dir: [+ux.toFixed(4), +uz.toFixed(4)] },
    townRim: { s: townEnd, deckY: +down(...at(townEnd - 0.5), islTop(T)).toFixed(2), thickness: { at1: thick(townEnd - 1, islTop(T), islUnder(T)), at3: thick(townEnd - 3, islTop(T), islUnder(T)), at6: thick(townEnd - 6, islTop(T), islUnder(T)) } },
    protopiaRim: { s: protStart, deckY: +down(...at(protStart + 0.5), islTop(P)).toFixed(2), thickness: { at1: thick(protStart + 1, islTop(P), islUnder(P)), at3: thick(protStart + 3, islTop(P), islUnder(P)), at6: thick(protStart + 6, islTop(P), islUnder(P)) } },
    piers: ps, spans, grade: null };
});
r.grade = +(((r.protopiaRim.deckY - r.townRim.deckY) / r.axis.length) * 100).toFixed(1);
console.log(JSON.stringify(r, null, 1));
if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(r, null, 1));
await close();
