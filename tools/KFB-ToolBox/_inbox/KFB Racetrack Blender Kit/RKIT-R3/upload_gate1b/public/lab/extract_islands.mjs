// RKIT R3 · read the Island Worldbuilder Lab's islands (no lab source change): outline, centre, radius, connector,
// building pads, footpaths, plazas, and a 2 m ground-height grid (downward raycast on the island ground meshes) -> JSON.
// This is the Surface-Truth stand-in for planning roads that rest on islands.  Run: node extract_islands.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const LAB = '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Island Worldbuilder Lab';
const require = createRequire(path.join(LAB, 'package.json'));
const { chromium } = require('playwright-core');
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const page = await browser.newPage({ viewport: { width: 800, height: 450 } });
await page.goto('http://127.0.0.1:5192/?shot=1', { waitUntil: 'load' });
await page.waitForFunction(() => window.__kfb?.ready, null, { timeout: 120000 });
await page.waitForTimeout(2000);
const HUB = JSON.parse(fs.readFileSync(new URL('./hub_spec.json', import.meta.url)));
await page.evaluate(async (spec) => { await window.__kfb.app.addIsland(spec, false); }, HUB);   // runtime only: not pushed into the lab world
await page.waitForTimeout(1500);
const data = await page.evaluate(async () => {
  const T = await import('/node_modules/three/build/three.module.js');
  const app = window.__kfb.app, rc = new T.Raycaster(), out = {};
  for (const [k, isl] of app.islands) {
    const f = isl.field, g = isl.group; g.updateMatrixWorld(true);
    const W = (x, z) => { const v = new T.Vector3(x, 0, z).applyMatrix4(g.matrixWorld); return [+v.x.toFixed(3), +v.z.toFixed(3)]; };
    const gy = (x, z) => { rc.set(new T.Vector3(x, 400, z), new T.Vector3(0, -1, 0)); const h = rc.intersectObjects(isl.groundMeshes, true)[0]; return h ? +h.point.y.toFixed(3) : null; };
    const c = W(f.c[0], f.c[1]), R = f.radius, grid = [];
    for (let x = c[0] - R - 6; x <= c[0] + R + 6; x += 2) for (let z = c[1] - R - 6; z <= c[1] + R + 6; z += 2) { const y = gy(x, z); if (y !== null) grid.push([+x.toFixed(2), +z.toFixed(2), y]); }
    const cn = f.connector, cw = W(cn.x, cn.z);
    out[k] = { runtimeOnly: k === 'rkit_hub', center: c, radius: +R.toFixed(2), groupY: g.position.y, poly: f.poly.map((p) => W(p[0], p[1])),
      connector: { p: [cw[0], gy(cw[0], cw[1]), cw[1]], dir: [cn.dx, cn.dz] },
      buildings: isl.spec.buildings.map((b) => ({ p: W(b.x, b.z), pad: b.pad, kind: b.asset ?? b.kind ?? b.id ?? null })),
      landmark: W(f.landmark[0], f.landmark[1]), paths: f.paths.map((P) => P.map((p) => W(p[0], p[1]))), plazas: f.plazas.map((p) => ({ c: W(p.x, p.z), r: p.r })),
      grid };
  }
  return out;
});
fs.writeFileSync(new URL('../trackcore/out/islands.lab.json', import.meta.url), JSON.stringify(data));
console.log(Object.entries(data).map(([k, v]) => `${k}: c ${v.center} r ${v.radius} y ${Math.min(...v.grid.map((q) => q[2])).toFixed(2)}..${Math.max(...v.grid.map((q) => q[2])).toFixed(2)} grid ${v.grid.length} bld ${v.buildings.length} plazas ${v.plazas.length}`).join('\n'));
await browser.close();
