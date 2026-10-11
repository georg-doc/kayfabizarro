// Contract rule B (Steuerung 10.10.): ground at hw (key 6, the outer support point) per station and side against RKIT's
// bedTarget ('sectionTop-0.10' | 'roadY-0.35'): deviation (ground − target) and the visible step (section top − ground).
// node tools/stage1/bed-ruleb.mjs [out.json]
import fs from 'node:fs';
import { openLab } from './browser.mjs';
const { page, close } = await openLab('shot=1&hub=1&solo=rkit_hub');
await page.evaluate(() => new Promise((r) => setTimeout(r, 2000)));
const r = await page.evaluate(async () => {
  const THREE = await import('/node_modules/.vite/deps/three.js');
  const isl = window.__kfb.app.islands.get('rkit_hub'), spec = isl.roadSpec, top = isl.group.getObjectByName('ground'), M = isl.group.matrixWorld, inv = M.clone().invert();
  isl.group.updateMatrixWorld(true);
  const rc = new THREE.Raycaster();
  const gy = (x, z) => { rc.set(new THREE.Vector3(x, 60, z).applyMatrix4(M), new THREE.Vector3(0, -1, 0)); const h = rc.intersectObject(top, false)[0]; return h ? h.point.applyMatrix4(inv).y : null; };
  const heads = spec.bridgeHeads ?? [];
  const out = [];
  spec.roads.forEach((road, ri) => {
    const s0 = ri === 0 && heads.length ? Math.max(...heads.map((h) => h.s)) : -Infinity;
    for (const S of road.sections) {
      if (S.s < s0) continue;
      const ax = (S.L[0][0] + S.R[0][0]) / 2, az = (S.L[0][2] + S.R[0][2]) / 2, roadY = (S.L[0][1] + S.R[0][1]) / 2;
      for (const k of ['L', 'R']) {
        const t = S.bedTarget?.[k]; if (!t) continue;
        const o = S[k][6], dx = o[0] - ax, dz = o[2] - az, l = Math.hypot(dx, dz) || 1, x = o[0] + (dx / l) * 0.05, z = o[2] + (dz / l) * 0.05;
        const g = gy(x, z); if (g == null) continue;
        const want = t === 'sectionTop-0.10' ? o[1] - 0.1 : roadY - 0.35;
        out.push({ road: road.id, s: S.s, side: k, rule: t, ground: +g.toFixed(3), target: +want.toFixed(3), dev: +(g - want).toFixed(3), stepBelowTop: +(o[1] - g).toFixed(3) });
      }
    }
  });
  return out;
});
const by = {};
for (const x of r) { const k = x.road + ' ' + x.side + ' ' + x.rule; (by[k] ??= []).push(x); }
const sum = Object.fromEntries(Object.entries(by).map(([k, v]) => [k, { n: v.length, devAbsMax: Math.max(...v.map((x) => Math.abs(x.dev))), devMedian: v.map((x) => Math.abs(x.dev)).sort((a, b) => a - b)[v.length >> 1], stepMin: Math.min(...v.map((x) => x.stepBelowTop)), stepMax: Math.max(...v.map((x) => x.stepBelowTop)) }]));
console.log(JSON.stringify(sum, null, 1));
if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify({ summary: sum, stations: r }, null, 1));
await close();
