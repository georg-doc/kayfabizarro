// Road riser probe (walkable surfaces as the colliders/heightAt use them; no chunk loading needed):
//   node src/modules/roads/tools/risers.mjs seed [radiusCells=60]
// (a) inside every flat road cell: walk-surface triangles steeper than 35° spanning > 0.15 m of height;
//     road-ramp cells: walk() sampled on a 0.1 m grid over the strip + bevel corridor, steps > 35° summing > 0.15 m;
// (b) on every road-cell edge (17 points): heightAt 3 cm inside vs 3 cm outside differs by 0.15–1.5 m (a vertical
//     riser; ≥ 1.5 m are cliffs = intended walls). Prints counts and the first offenders.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const seed = Number(process.argv[2] ?? 1), RAD = Number(process.argv[3] ?? 60);
const exe = [process.env.CHROME, '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c));
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 320, height: 180 } });
const errs = [];
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
p.on('pageerror', (e) => errs.push(String(e).slice(0, 200)));
await p.goto(`http://127.0.0.1:5180/?seed=${seed}${process.argv[4] ?? ''}`);
await p.waitForFunction(() => window.__kfb && window.__kfb.ready && window.__roads, null, { timeout: 300000 });
const o = await p.evaluate((RAD) => {
  const r = window.__roads.renderer(), w = window.__kfb.engine.ctx.world;
  const TAN = Math.tan((35 * Math.PI) / 180);
  const sink = (x, z) => window.__roadsApi ? 0 : 0;
  const dr = (c, lx, lz) => { let m = Infinity; for (let d = 0; d < 6; d++) { if (!((c.roadMask >> d) & 1)) continue; const ex = Math.cos(d * Math.PI / 3) * 7.5, ez = -Math.sin(d * Math.PI / 3) * 7.5; const t = Math.max(0, Math.min(1, (lx * ex + lz * ez) / (ex * ex + ez * ez))); m = Math.min(m, Math.hypot(lx - t * ex, lz - t * ez)); } return m; };
  const DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
  let cells = 0, ramps = 0;
  const tri = [], edge = [], rampSteep = []; let other = 0;
  for (let q = -RAD; q <= RAD; q++) for (let rr = Math.max(-RAD, -q - RAD); rr <= Math.min(RAD, -q + RAD); rr++) {
    const c = window.__kfb.cell(q, rr);
    if (!c.roadMask || c.bridge || c.riverMask || c.water) continue;
    cells++;
    const cx = 15 * (q + rr / 2), cz = 12.990381 * rr;
    if (c.slope) {
      ramps++;
      const F = r.rampFns(c), lim = F.BEV + F.WIDEN + 0.1, A = 7.5;
      let worst = null;
      for (let xa = -A + 0.05; xa < A; xa += 0.1)
        for (let za = -lim; za < lim; za += 0.1) {
          for (const [dx, dz] of [[0.1, 0], [0, 0.1]]) {
            const h0 = F.walk(xa, za), h1 = F.walk(xa + dx, za + dz);
            if (Math.abs(h1 - h0) > TAN * 0.1) {
              // rise of the steep run in this direction
              let rise = 0, x = xa, z = za;
              for (let k = 0; k < 20; k++) { const a = F.walk(x, z), bb = F.walk(x + dx, z + dz); if (Math.abs(bb - a) <= TAN * 0.1) break; rise += Math.abs(bb - a); x += dx; z += dz; }
              if (rise > 0.15 && (!worst || rise > worst.rise)) worst = { rise: +rise.toFixed(3), at: [+xa.toFixed(2), +za.toFixed(2)] };
            }
          }
        }
      if (worst) rampSteep.push({ q, r: rr, ...worst });
    } else {
      const f = r.flatTile(c);
      const wt = f && (f.fade.length ? null : r.walkTris(f));
      if (wt) {
        let worst = null;
        for (let t = 0; t < wt.length; t += 9) {
          const ux = wt[t + 3] - wt[t], uy = wt[t + 4] - wt[t + 1], uz = wt[t + 5] - wt[t + 2], vx = wt[t + 6] - wt[t], vy = wt[t + 7] - wt[t + 1], vz = wt[t + 8] - wt[t + 2];
          const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
          const deg = (Math.atan2(Math.hypot(nx, nz), Math.abs(ny)) * 180) / Math.PI;
          const span = Math.max(wt[t + 1], wt[t + 4], wt[t + 7]) - Math.min(wt[t + 1], wt[t + 4], wt[t + 7]);
          const ccx = (wt[t] + wt[t + 3] + wt[t + 6]) / 3, ccz = (wt[t + 2] + wt[t + 5] + wt[t + 8]) / 3;
          // the road corridor only (strip, bevel, verge ≤ 3 m from the centre lines); kept drop rims are cliff edges
          if (deg > 35 && span > 0.15 && dr(c, ccx, ccz) <= 3 && (!worst || deg > worst.deg)) worst = { deg: +deg.toFixed(1), span: +span.toFixed(2), at: [+((wt[t] + wt[t + 3] + wt[t + 6]) / 3).toFixed(2), +((wt[t + 2] + wt[t + 5] + wt[t + 8]) / 3).toFixed(2)] };
        }
        if (worst) tri.push({ q, r: rr, id: f.id.split('/').pop(), mask: c.roadMask, ...worst });
      }
    }
    for (let d = 0; d < 6; d++) {
      const n = window.__kfb.cell(q + DIRS[d][0], rr + DIRS[d][1]);
      if (n.water) continue;
      const nx = 15 * (q + DIRS[d][0] + (rr + DIRS[d][1]) / 2), nz = 12.990381 * (rr + DIRS[d][1]);
      const ex = (nx - cx) / 15, ez = (nz - cz) / 15, mx = (cx + nx) / 2, mz = (cz + nz) / 2, tx = -ez, tz = ex;
      let worst = 0, at = null;
      for (let k = -8; k <= 8; k++) {
        const s = (k / 8) * 4.1, px = mx + tx * s, pz = mz + tz * s;
        const hi = w.heightAt(px - ex * 0.03, pz - ez * 0.03), ho = w.heightAt(px + ex * 0.03, pz + ez * 0.03);
        const dd = Math.abs(hi - ho);
        // strip meets non-sunk: our side is in the road corridor at a sunk height (below the cell's grass level)
        const lx = px - cx, lz = pz - cz;
        const sk = c.slope ? r.rampSink(c, lx - ex * 0.03, lz - ez * 0.03) : -r.roadSurfaceOffset(c, lx - ex * 0.03, lz - ez * 0.03);
        const sunk = sk > 0.01;
        if (dd > 0.15 && dd < 1.5 && sunk && dd > worst) { worst = dd; at = [+px.toFixed(2), +pz.toFixed(2), +hi.toFixed(2), +ho.toFixed(2), +sk.toFixed(2)]; }
        if (dd > 0.15 && dd < 1.5 && !sunk) other++;
      }
      if (at) edge.push({ q, r: rr, d, n: [n.level, n.roadMask, n.slope ? n.slope.dir : null, n.village ? 'v' : '', (n.tags || []).slice(0, 3).join('+')], dh: +worst.toFixed(3), at });
    }
  }
  return { otherEdgeSamples: other, cells, ramps, triRisers: tri.length, rampRisers: rampSteep.length, edgeRisers: edge.length, tri: tri.slice(0, 12), ramp: rampSteep.slice(0, 6), edge: edge.slice(0, 12) };
}, RAD);
console.log(JSON.stringify({ seed, ...o, errs }));
await b.close();
