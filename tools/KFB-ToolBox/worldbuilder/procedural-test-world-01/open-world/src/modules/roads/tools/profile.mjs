// Ground profile along lines: node src/modules/roads/tools/profile.mjs seed 'x,z,dx,dz,len;...'
// World-only physics rays every 2 cm (off-lattice jitter) + heightAt. Reports per line: max step between adjacent
// samples (2 cm apart), max |heightAt − physics|, min/max height.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const seed = Number(process.argv[2]);
const lines = process.argv[3].split(';').map((l) => l.split(',').map(Number));
const exe = [process.env.CHROME, '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c));
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 360 } });
const errs = [];
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
p.on('pageerror', (e) => errs.push(String(e).slice(0, 200)));
await p.goto(`http://127.0.0.1:5180/?seed=${seed}${process.argv[4] ?? ''}`);
await p.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 300000 });
const res = [];
for (const [x, z, dx, dz, len] of lines) {
  await p.evaluate(([x, z]) => { const P = window.__kfb.engine.ctx.services.get('player'); P.spawn(x, window.__kfb.engine.ctx.world.heightAt(x, z) + 0.5, z, 0); }, [x, z]);
  await p.evaluate(() => window.__kfb.waitIdle(40000));
  await p.waitForTimeout(800);
  res.push(await p.evaluate(([x, z, dx, dz, len]) => {
    const ctx = window.__kfb.engine.ctx, w = ctx.physics.world, R = ctx.rapier;
    const ray = new R.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }), G = (2 << 16) | 1;
    const l = Math.hypot(dx, dz); dx /= l; dz /= l;
    let prev = null, step = 0, stepAt = null, dHA = 0, lo = 1e9, hi = -1e9;
    const prof = [];
    for (let s = 0; s <= len; s += 0.02) {
      const px = x + dx * s + 0.0037, pz = z + dz * s + 0.0013;
      ray.origin = { x: px, y: 50, z: pz };
      const h = w.castRay(ray, 100, true, undefined, G);
      if (!h) continue;
      const y = 50 - h.timeOfImpact, ha = ctx.world.heightAt(px, pz);
      lo = Math.min(lo, y); hi = Math.max(hi, y);
      dHA = Math.max(dHA, Math.abs(ha - y));
      if (prev !== null && Math.abs(y - prev) > Math.abs(step)) { step = y - prev; stepAt = +s.toFixed(2); }
      prev = y;
      if (len <= 3 ? s >= 1.2 && Math.round(s * 50) % 2 === 0 : Math.round(s * 50) % 25 === 0) prof.push(+y.toFixed(3));
    }
    return { line: [x, z, +dx.toFixed(2), +dz.toFixed(2), len], step: +step.toFixed(3), stepAt, heightAtVsPhysics: +dHA.toFixed(3), lo: +lo.toFixed(2), hi: +hi.toFixed(2), prof };
  }, [x, z, dx, dz, len]));
}
console.log(JSON.stringify({ seed, res, errs }));
await b.close();
