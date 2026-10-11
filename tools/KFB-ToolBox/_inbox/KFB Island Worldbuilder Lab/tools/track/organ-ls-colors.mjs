// V-116 pale patch cause: body vertex colours + O1 depth near a spot, SN vs LS, nearest-vertex comparison.
// node tools/track/organ-ls-colors.mjs <out.json> <organ> <x,y,z> <tier> <radius lab> [lsQuery]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, organ, at, tier, rad, lsq = ''] = process.argv.slice(2), A = at.split(',').map(Number);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const R = {};
for (const [m, q] of [['sn', 'mesher=sn'], ['ls', lsq]]) { const p = await b.newPage({ viewport: { width: 600, height: 400 } });
  await p.goto(`http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&${q}`); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
  R[m] = await p.evaluate(({ organ, A, tier, rad }) => { const O = window.__kfb.organ(), T = window.__kfb.three(), B = O.W.built.find((x) => x.id === organ), Tr = B.tiers[tier], ms = []; Tr.g.traverse((x) => { if (x.isMesh) ms.push(x); });
    const body = ms[0], pos = body.geometry.attributes.position, col = body.geometry.attributes.color, mw = body.matrixWorld, a = new T.Vector3(...A), v = new T.Vector3(), out = [];
    for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i).applyMatrix4(mw); if (v.distanceTo(a) > rad) continue; out.push([+v.x.toFixed(2), +v.y.toFixed(2), +v.z.toFixed(2), +col.getX(i).toFixed(3), +col.getY(i).toFixed(3), +col.getZ(i).toFixed(3), +(Tr.SN.depth[i] ?? NaN).toFixed(2)]); }
    return out; }, { organ, A, tier, rad: +rad }); await p.close(); }
await b.close();
const lum = (c) => 0.3 * c[3] + 0.59 * c[4] + 0.11 * c[5], cmp = R.ls.map((v) => { let best = null, bd = 1e9; for (const s of R.sn) { const d = Math.hypot(s[0] - v[0], s[1] - v[1], s[2] - v[2]); if (d < bd) { bd = d; best = s; } } return { v, s: best, d: bd, dl: lum(v) - lum(best) }; });
cmp.sort((x, y) => y.dl - x.dl);
const st = (a) => ({ n: a.length, mean: +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(3) });
console.log('SN verts', R.sn.length, 'LS verts', R.ls.length, 'lum SN', st(R.sn.map(lum)), 'lum LS', st(R.ls.map(lum)));
console.log('depth SN', st(R.sn.map((x) => x[6])), 'depth LS', st(R.ls.map((x) => x[6])));
console.log('worst LS (brighter than nearest SN):'); for (const c of cmp.slice(0, 8)) console.log(JSON.stringify(c.v), 'SN', JSON.stringify(c.s), 'dist', c.d.toFixed(2), 'dLum', c.dl.toFixed(3));
fs.writeFileSync(out, JSON.stringify(R));
