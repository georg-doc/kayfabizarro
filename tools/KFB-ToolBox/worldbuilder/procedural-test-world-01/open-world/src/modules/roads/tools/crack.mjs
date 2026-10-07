// Road-tile seam check: node src/modules/roads/tools/crack.mjs seed q0 r0 [radiusCells]
// Along every shared edge of a road/river cell with a non-road, non-river neighbour where heightAt is continuous
// (|Δ| < 0.35 m), compare the rendered top surfaces 6 cm inside each side (roads-tiles vs terrain meshes) at 17 points.
// Reports edges whose surfaces disagree by > 8 cm (terrain's crack criterion).
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [seed, q0, r0, RAD = 6] = process.argv.slice(2, 6).map(Number);
const exe = [process.env.CHROME, '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c));
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 360 } });
const errs = [];
p.on('pageerror', (e) => errs.push(String(e).slice(0, 200)));
await p.goto(`http://127.0.0.1:5180/?seed=${seed}${process.argv[6] ?? ''}`);
await p.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 300000 });
const X0 = 15 * (q0 + r0 / 2), Z0 = 12.990381 * r0;
// Vite reloads / HMR swaps while other builders save files: retry until a measurement covers edges (≤ 6 tries)
let o = null;
for (let attempt = 0; attempt < 6; attempt++) {
  try {
    await p.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 300000 });
    await p.evaluate(([x, z]) => { const P = window.__kfb.engine.ctx.services.get('player'); P.spawn(x, window.__kfb.engine.ctx.world.heightAt(x, z) + 0.5, z, 0); }, [X0, Z0]);
    await p.evaluate(() => window.__kfb.waitIdle(60000));
    await p.waitForTimeout(1500);
    o = await measure();
  } catch (err) { o = null; }
  if (o && o.edges > 0) break;
  await p.reload().catch(() => {});
}
async function measure() { return p.evaluate(([q0, r0, RAD]) => {
  const ctx = window.__kfb.engine.ctx, scene = ctx.scene, world = ctx.world;
  const names = new Set();
  const G = 2, grid = new Map(), T = [];
  scene.updateMatrixWorld(true);
  const V3 = scene.position.constructor, v = [new V3(), new V3(), new V3()];
  scene.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh || !o.visible) return;
    const nm = o.name || '';
    if (!(nm.startsWith('terrain') || nm === 'roads-tiles')) return;
    names.add(nm);
    const P = o.geometry.attributes.position; if (!P) return;
    const I = o.geometry.index, n = I ? I.count : P.count, M = o.matrixWorld;
    for (let t = 0; t + 2 < n; t += 3) {
      for (let j = 0; j < 3; j++) v[j].fromBufferAttribute(P, I ? I.getX(t + j) : t + j).applyMatrix4(M);
      const [a, bb, c] = v;
      const ux = bb.x - a.x, uz = bb.z - a.z, wx = c.x - a.x, wz = c.z - a.z;
      const ny = uz * wx - ux * wz; // y of (u × w) for the xz plane
      const len = Math.hypot((bb.y - a.y) * wz - uz * (c.y - a.y), ny, ux * (c.y - a.y) - (bb.y - a.y) * wx) || 1;
      if (Math.abs(ny) / len < 0.25) continue; // up/down facing only
      const id = T.length; T.push([a.x, a.y, a.z, bb.x, bb.y, bb.z, c.x, c.y, c.z, nm === 'roads-tiles' ? 1 : 0]);
      for (let gx = Math.floor(Math.min(a.x, bb.x, c.x) / G); gx <= Math.floor(Math.max(a.x, bb.x, c.x) / G); gx++)
        for (let gz = Math.floor(Math.min(a.z, bb.z, c.z) / G); gz <= Math.floor(Math.max(a.z, bb.z, c.z) / G); gz++) {
          const k = gx * 100000 + gz; let l = grid.get(k); if (!l) grid.set(k, (l = [])); l.push(id);
        }
    }
  });
  const top = (x, z, road) => {
    const l = grid.get(Math.floor(x / G) * 100000 + Math.floor(z / G)); let h = -1e9;
    if (!l) return h;
    for (const id of l) {
      const t = T[id]; if (t[9] !== road) continue;
      const d = (t[5] - t[8]) * (t[0] - t[6]) + (t[6] - t[3]) * (t[2] - t[8]); if (Math.abs(d) < 1e-9) continue;
      const l1 = ((t[5] - t[8]) * (x - t[6]) + (t[6] - t[3]) * (z - t[8])) / d, l2 = ((t[8] - t[2]) * (x - t[6]) + (t[0] - t[6]) * (z - t[8])) / d, l3 = 1 - l1 - l2;
      if (l1 < -1e-4 || l2 < -1e-4 || l3 < -1e-4) continue;
      h = Math.max(h, l1 * t[1] + l2 * t[4] + l3 * t[7]);
    }
    return h;
  };
  const DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
  const W = (q, r) => [15 * (q + r / 2), 12.990381 * r];
  const bad = []; let edges = 0;
  for (let q = q0 - RAD; q <= q0 + RAD; q++) for (let r = r0 - RAD; r <= r0 + RAD; r++) {
    const c = window.__kfb.cell(q, r);
    if (!c.roadMask && !c.riverMask) continue;
    const [cx, cz] = W(q, r);
    for (let d = 0; d < 6; d++) {
      const n = window.__kfb.cell(q + DIRS[d][0], r + DIRS[d][1]);
      if (n.roadMask || n.riverMask || n.water) continue;
      const [nx, nz] = W(q + DIRS[d][0], r + DIRS[d][1]);
      const ex = (nx - cx) / 15, ez = (nz - cz) / 15; // unit normal toward n (|centre distance| = 15)
      const mx = (cx + nx) / 2, mz = (cz + nz) / 2, tx = -ez, tz = ex;
      let worst = 0, at = null, cont = 0;
      for (let k = -8; k <= 8; k++) {
        const s = (k / 8) * 4.2;
        const px = mx + tx * s, pz = mz + tz * s;
        const h0 = world.heightAt(px - ex * 0.06, pz - ez * 0.06), h1 = world.heightAt(px + ex * 0.06, pz + ez * 0.06);
        if (Math.abs(h0 - h1) > 0.35) continue;
        cont++;
        const a = top(px - ex * 0.06, pz - ez * 0.06, 1), bq = top(px + ex * 0.06, pz + ez * 0.06, 0);
        if (a < -1e8 || bq < -1e8) continue;
        const dd = a - bq;
        if (Math.abs(dd) > Math.abs(worst)) { worst = dd; at = [+px.toFixed(2), +pz.toFixed(2), +a.toFixed(2), +bq.toFixed(2), +s.toFixed(2)]; }
      }
      if (!cont) continue;
      edges++;
      if (Math.abs(worst) > 0.08) bad.push({ q, r, d, nq: q + DIRS[d][0], nr: r + DIRS[d][1], worst: +worst.toFixed(3), at, road: !!c.roadMask, slope: !!c.slope, nslope: !!n.slope, emb: (n.tags || []).includes('embankment'), lv: [c.level, n.level] });
    }
  }
  return { names: [...names], edges, bad };
}, [q0, r0, RAD]); }
console.log(JSON.stringify({ seed, ...o, errs }));
await b.close();
