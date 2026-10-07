// Bridge walkway probe: node src/modules/roads/tools/bprobe.mjs seed [radiusCells]
// For every bridge cell within the radius: spawn the player beside it (chunks load), then sample the deck slabs' tops
// (central 60 % of the slab width) plus 1.5 m of the approach beyond both ends, and test a knight-sized capsule there
// against PLAYER-ONLY colliders (group 0x0008). Prints blocked samples and the offending colliders per bridge.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const seed = Number(process.argv[2] ?? 1), RAD = Number(process.argv[3] ?? 40);
const exe = [process.env.CHROME, '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c));
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 360 } });
const errs = [];
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
p.on('pageerror', (e) => errs.push(String(e).slice(0, 200)));
await p.goto(`http://127.0.0.1:5180/?seed=${seed}`);
await p.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 180000 });
const bridges = await p.evaluate((RAD) => {
  const out = [];
  for (let q = -RAD; q <= RAD; q++) for (let r = Math.max(-RAD, -q - RAD); r <= Math.min(RAD, -q + RAD); r++) {
    const c = window.__kfb.cell(q, r);
    if (c.bridge && c.riverMask && c.roadMask) out.push([q, r]);
  }
  return out;
}, RAD);
const res = [];
for (const [q, r] of bridges) {
  const x = 15 * (q + r / 2), z = 12.990381 * r;
  await p.evaluate(([x, z]) => { const P = window.__kfb.engine.ctx.services.get('player'); P.spawn(x + 9, window.__kfb.engine.ctx.world.heightAt(x + 9, z + 9) + 0.3, z + 9, 0); }, [x, z]);
  await p.evaluate(() => window.__kfb.waitIdle(30000));
  await p.waitForTimeout(600);
  const o = await p.evaluate(([x, z]) => {
    const ctx = window.__kfb.engine.ctx, w = ctx.physics.world, R = ctx.rapier;
    const slabs = [];
    w.intersectionsWithShape({ x, y: ctx.world.heightAt(x, z), z }, { x: 0, y: 0, z: 0, w: 1 }, new R.Cuboid(12, 8, 12), (c) => {
      const s = c.shape;
      if ((c.collisionGroups() >>> 16) !== 1 || !s.vertices || s.vertices.length !== 24) return true;
      const t = c.translation(), v = s.vertices, pts = [];
      for (let i = 0; i < 24; i += 3) pts.push([v[i] + t.x, v[i + 1] + t.y, v[i + 2] + t.z]);
      // top corner per xz column
      const cols = [];
      for (const P of pts) { const k = cols.find((q) => Math.hypot(q[0] - P[0], q[2] - P[2]) < 0.01); if (!k) cols.push(P.slice()); else k[1] = Math.max(k[1], P[1]); }
      if (cols.length === 4) slabs.push(cols);
      return true;
    });
    // order each slab: corners [a0-, a0+, a1-, a1+] as emitted (pairs along); emitted order is (a0,-),(a0,+),(a1,-),(a1,+)
    const cap = new R.Capsule(0.45, 0.3);
    const hits = new Map(); let n = 0, blocked = 0; const cat = {};
    const test = (px, py, pz, k = 'deck') => {
      n++; cat[k] ??= [0, 0]; cat[k][0]++;
      let hit = false;
      w.intersectionsWithShape({ x: px, y: py + 0.8, z: pz }, { x: 0, y: 0, z: 0, w: 1 }, cap, (c) => {
        if ((c.collisionGroups() >>> 16) !== 8) return true;
        hit = true;
        const t = c.translation(), s = c.shape;
        const key = c.handle;
        if (!hits.has(key)) hits.set(key, { type: s.type, at: [+t.x.toFixed(2), +t.y.toFixed(2), +t.z.toFixed(2)], he: s.halfExtents ? [s.halfExtents.x, s.halfExtents.y, s.halfExtents.z].map((n) => +n.toFixed(2)) : null, nv: s.vertices ? s.vertices.length / 3 : 0, n: 0, sample: [+px.toFixed(2), +py.toFixed(2), +pz.toFixed(2)] });
        hits.get(key).n++;
        return true;
      });
      if (hit) { blocked++; cat[k][1]++; }
    };
    const lerp = (A, B, f) => A.map((a, i) => a + (B[i] - a) * f);
    // slab chain ends: corners that no other slab shares
    for (const S of slabs) {
      const [A0, A1, B0, B1] = S;
      for (let u = 0.1; u < 0.95; u += 0.2) for (const vv of [0.2, 0.5, 0.8]) {
        const P = lerp(lerp(A0, A1, vv), lerp(B0, B1, vv), u);
        test(P[0], P[1], P[2]);
      }
      // approach beyond a free end (no other slab within 0.3 m of this end's midpoint)
      for (const [E0, E1, F0, F1] of [[A0, A1, B0, B1], [B0, B1, A0, A1]]) {
        const m = lerp(E0, E1, 0.5);
        const shared = slabs.some((T) => T !== S && T.some((C) => Math.hypot(C[0] - m[0], C[2] - m[2]) < 1.6 && Math.abs(Math.hypot(C[0] - E0[0], C[2] - E0[2]) + Math.hypot(C[0] - E1[0], C[2] - E1[2]) - Math.hypot(E0[0] - E1[0], E0[2] - E1[2])) < 0.05));
        if (shared) continue;
        const fm = lerp(F0, F1, 0.5), dx = m[0] - fm[0], dz = m[2] - fm[2], L = Math.hypot(dx, dz);
        // the road approach (road strip ±1.6 m wide, 0.5–2.5 m beyond the deck end) and the strip beside the end slab
        // (a knight walking up the outer part of the road meets whatever stands there head-on)
        const ux = (E1[0] - E0[0]), uz = (E1[2] - E0[2]), W = Math.hypot(ux, uz);
        for (const d of [-1.3, -0.9, -0.5, 0.5, 1.0, 1.5, 2.0, 2.5]) for (const ac of [-1.6, -1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2, 1.6]) {
          if (d < 0 && Math.abs(ac) < W / 2 + 0.35) continue; // on the slab itself (sampled above)
          const px = m[0] + (dx / L) * d + (ux / W) * ac, pz = m[2] + (dz / L) * d + (uz / W) * ac;
          test(px, ctx.world.heightAt(px, pz), pz, d < 0 ? 'besideFoot' : Math.abs(ac) <= 0.4 ? 'approachCentre' : 'approachOuter');
        }
      }
    }
    return { slabs: slabs.length, n, blocked, cat, colliders: [...hits.values()] };
  }, [x, z]);
  res.push({ q, r, ...o });
}
console.log(JSON.stringify({ seed, bridges: bridges.length, blockedTotal: res.reduce((s, o) => s + o.blocked, 0), samples: res.reduce((s, o) => s + o.n, 0), errs, res }));
await b.close();
