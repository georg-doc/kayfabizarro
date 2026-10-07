// List colliders around a point: node src/modules/roads/tools/colat.mjs seed x z [half]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [seed, x, z, H = 2] = process.argv.slice(2).map(Number);
const exe = [process.env.CHROME, '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c));
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 360 } });
await p.goto(`http://127.0.0.1:5180/?seed=${seed}`);
await p.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 180000 });
await p.evaluate(([x, z]) => { const P = window.__kfb.engine.ctx.services.get('player'); P.spawn(x + 9, window.__kfb.engine.ctx.world.heightAt(x + 9, z + 9) + 0.3, z + 9, 0); }, [x, z]);
await p.evaluate(() => window.__kfb.waitIdle(30000));
const o = await p.evaluate(([x, z, H]) => {
  const ctx = window.__kfb.engine.ctx, w = ctx.physics.world, R = ctx.rapier, out = [];
  w.intersectionsWithShape({ x, y: ctx.world.heightAt(x, z), z }, { x: 0, y: 0, z: 0, w: 1 }, new R.Cuboid(H, 6, H), (c) => {
    const s = c.shape, t = c.translation();
    let bb = null;
    if (s.vertices) { const v = s.vertices; const mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9]; for (let i = 0; i < v.length; i += 3) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], v[i + k] + [t.x, t.y, t.z][k]); mx[k] = Math.max(mx[k], v[i + k] + [t.x, t.y, t.z][k]); } bb = [mn, mx]; }
    out.push({ g: c.collisionGroups() >>> 16, type: s.type, nv: s.vertices ? s.vertices.length / 3 : 0, at: [t.x, t.y, t.z].map((n) => +n.toFixed(2)), he: s.halfExtents ? [s.halfExtents.x, s.halfExtents.y, s.halfExtents.z].map((n) => +n.toFixed(2)) : null, bb: bb && bb.map((v) => v.map((n) => +n.toFixed(2))), verts: s.vertices && s.vertices.length <= 24 ? Array.from(s.vertices).map((n, i) => +(n + [t.x, t.y, t.z][i % 3]).toFixed(2)) : null });
    return true;
  });
  return { h: ctx.world.heightAt(x, z), cell: (() => { const r = Math.round(z / 12.990381); return null; })(), out };
}, [x, z, H]);
console.log(JSON.stringify(o));
await b.close();
