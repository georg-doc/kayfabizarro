// Dump rendered triangles near a point: node src/modules/roads/tools/tridump.mjs seed x z [radius] [meshName]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [seed, X, Z, RR = 1.5] = process.argv.slice(2, 6).map(Number);
const NAME = process.argv[6] ?? 'roads-tiles';
const exe = [process.env.CHROME, '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c));
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 360 } });
await p.goto(`http://127.0.0.1:5180/?seed=${seed}`);
await p.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 300000 });
await p.evaluate(([x, z]) => { const P = window.__kfb.engine.ctx.services.get('player'); P.spawn(x + 3, window.__kfb.engine.ctx.world.heightAt(x + 3, z + 3) + 0.5, z + 3, 0); }, [X, Z]);
await p.evaluate(() => window.__kfb.waitIdle(60000));
const o = await p.evaluate(([X, Z, RR, NAME]) => {
  const scene = window.__kfb.engine.ctx.scene, out = [];
  scene.updateMatrixWorld(true);
  const V3 = scene.position.constructor, v = [new V3(), new V3(), new V3()];
  scene.traverse((o) => {
    if (!o.isMesh || o.name !== NAME) return;
    const P = o.geometry.attributes.position, I = o.geometry.index, n = I ? I.count : P.count;
    for (let t = 0; t + 2 < n; t += 3) {
      for (let j = 0; j < 3; j++) v[j].fromBufferAttribute(P, I ? I.getX(t + j) : t + j).applyMatrix4(o.matrixWorld);
      const ins = (() => { const [a, b, c] = v; const d = (b.z - c.z) * (a.x - c.x) + (c.x - b.x) * (a.z - c.z); if (Math.abs(d) < 1e-9) return false; const l1 = ((b.z - c.z) * (X - c.x) + (c.x - b.x) * (Z - c.z)) / d, l2 = ((c.z - a.z) * (X - c.x) + (a.x - c.x) * (Z - c.z)) / d; return l1 >= -1e-4 && l2 >= -1e-4 && 1 - l1 - l2 >= -1e-4; })();
      if (!ins && !v.some((q) => Math.hypot(q.x - X, q.z - Z) < RR)) continue;
      out.push(v.map((q) => [+(q.x - X).toFixed(2), +q.y.toFixed(2), +(q.z - Z).toFixed(2)]));
    }
  });
  return out;
}, [X, Z, RR, NAME]);
console.log(JSON.stringify(o));
await b.close();
