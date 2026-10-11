// C1b+C3 · O1 field resolution per organ (hero cell = h × mm in Track Core metres), grid size, tunnel ring outline of the stream
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 800, height: 500 } });
await p.goto('http://127.0.0.1:5192/organ-test.html'); await p.waitForFunction(() => window.__organ?.done, null, { timeout: 600000 });
console.log(JSON.stringify(await p.evaluate(() => { const W = window.__organ.W, td = W.stream;
  return { organs: W.built.map((B) => ({ id: B.id, mm: B.spec.mm, h: B.h, cellM: +(B.h * B.spec.mm).toFixed(3), grid: [B.G0.nx, B.G0.ny, B.G0.nz], cells: B.G0.nx * B.G0.ny * B.G0.nz })),
    tunnels: (td.tunnels || []).map((t) => ({ id: t.id, host: t.host, kind: t.kind, len: Math.round(t.length), shapes: t.shapes })), rings: (td.tunnelRings || []).map((r) => ({ n: r.length, ys: [Math.min(...r.map((p) => p[1])), Math.max(...r.map((p) => p[1]))].map((v) => +v.toFixed(2)), xs: [Math.min(...r.map((p) => p[0])), Math.max(...r.map((p) => p[0]))].map((v) => +v.toFixed(2)) })), wall: td.samples.find((q) => q.tunnel)?.tunnel }; }), null, 1));
await b.close();
