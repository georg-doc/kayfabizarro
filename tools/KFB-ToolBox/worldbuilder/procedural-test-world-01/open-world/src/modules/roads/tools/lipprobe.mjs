// Road-edge lip probe: node src/modules/roads/tools/lipprobe.mjs seed q0 r0 [radiusCells] [extraQuery]
// Spawns the player at cell (q0,r0), then over every road / ramp cell within the radius (+1 m margin) casts rays down
// against WORLD colliders on a 0.25 m grid. A grid edge is a "lip" when it is steeper than 35° but not a cliff
// (0.175 m < |dh| ≤ 0.45 m per 0.25 m). Counts lips by the hit collider's shape type of the higher sample.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [seed, q0, r0, RAD = 6] = process.argv.slice(2, 6).map(Number);
const extra = process.argv[6] ?? '';
const exe = [process.env.CHROME, '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c));
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 360 } });
const errs = [];
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
p.on('pageerror', (e) => errs.push(String(e).slice(0, 200)));
await p.goto(`http://127.0.0.1:5180/?seed=${seed}${extra}`);
await p.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 180000 });
const X0 = 15 * (q0 + r0 / 2), Z0 = 12.990381 * r0;
await p.evaluate(([x, z]) => { const P = window.__kfb.engine.ctx.services.get('player'); P.spawn(x, window.__kfb.engine.ctx.world.heightAt(x, z) + 0.5, z, 0); }, [X0, Z0]);
await p.evaluate(() => window.__kfb.waitIdle(40000));
await p.waitForTimeout(1500);
const o = await p.evaluate(([q0, r0, RAD]) => {
  const ctx = window.__kfb.engine.ctx, w = ctx.physics.world, R = ctx.rapier;
  const G = (2 << 16) | 1; // query as player membership, world only
  const ray = new R.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 });
  const D = 0.25;
  const lips = {}, at = [];
  let cells = 0, n = 0;
  for (let q = q0 - RAD; q <= q0 + RAD; q++) for (let r = r0 - RAD; r <= r0 + RAD; r++) {
    const c = window.__kfb.cell(q, r);
    if (!c.roadMask || c.bridge || c.riverMask) continue;
    cells++;
    const cx = 15 * (q + r / 2), cz = 12.990381 * r;
    const N = Math.ceil(9.7 / D);
    const H = new Float32Array((2 * N + 1) ** 2).fill(NaN), T = new Int8Array((2 * N + 1) ** 2);
    const idx = (i, j) => (j + N) * (2 * N + 1) + (i + N);
    for (let j = -N; j <= N; j++) for (let i = -N; i <= N; i++) {
      const x = cx + i * D + 0.0137, z = cz + j * D + 0.0071; // off the lattice lines (ray-on-edge misses)
      ray.origin = { x, y: 60, z };
      const h = w.castRay(ray, 120, true, undefined, G);
      if (!h) continue;
      n++;
      H[idx(i, j)] = 60 - h.timeOfImpact;
      T[idx(i, j)] = h.collider.shape.type;
    }
    for (let j = -N; j < N; j++) for (let i = -N; i < N; i++) {
      // keep samples within ~1 m of this hex (inner radius 7.5 → corner 8.66)
      const lx = i * D, lz = j * D;
      if (Math.max(Math.abs(lx), Math.abs(lx / 2 + lz * 0.866), Math.abs(-lx / 2 + lz * 0.866)) > 8.5) continue;
      const a = H[idx(i, j)];
      for (const [di, dj] of [[1, 0], [0, 1]]) {
        const bb = H[idx(i + di, j + dj)];
        if (Number.isNaN(a) || Number.isNaN(bb)) continue;
        const dh = Math.abs(a - bb);
        if (dh > 0.175 && dh <= 0.45) {
          const hi = a > bb ? T[idx(i, j)] : T[idx(i + di, j + dj)];
          lips[hi] = (lips[hi] ?? 0) + 1;
          if (at.length < 2000) at.push([+(cx + lx).toFixed(2), +(cz + lz).toFixed(2), +a.toFixed(2), +bb.toFixed(2), hi, q, r, c.slope ? 's' : '']);
        }
      }
    }
  }
  return { cells, n, lips, at };
}, [q0, r0, RAD]);
console.log(JSON.stringify({ seed, ...o, errs }));
await b.close();
