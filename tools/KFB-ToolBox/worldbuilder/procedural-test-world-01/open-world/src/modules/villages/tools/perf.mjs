// Villages perf + identity harness (headless Chrome, dev server):
//   node src/modules/villages/tools/perf.mjs digest 123,1337,42,7   → identity digest of stage-3 output over R=60
//   node src/modules/villages/tools/perf.mjs boot [runs]            → ready time + layerMs on '/'
import fs from 'node:fs';
import { chromium } from 'playwright-core';
import { spawnSync } from 'node:child_process';
const [mode, arg] = process.argv.slice(2);
const exe = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c) && spawnSync(c, ['--version'], { timeout: 15000 }).status === 0);
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--use-angle=metal'] });
const DIGEST = (R) => {
  const w = window.__kfb.engine.world;
  let h = 2166136261 >>> 0;
  const mix = (s) => { for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0; };
  const t0 = performance.now();
  let n = 0;
  for (let q = -R; q <= R; q++)
    for (let r = Math.max(-R, -q - R); r <= Math.min(R, -q + R); r++) {
      const c = w.cellAt(4, q, r);
      const v = c.village ? c.village.id + c.village.color + c.village.role : '-';
      const b = c.building ? c.building.asset + c.building.rotY.toFixed(6) : '-';
      if (c.village || c.building || c.tags.includes('flattened')) n++;
      mix(q + ',' + r + ':' + c.level + v + b + (c.reserved ? 'R' : '') + c.tags.join('|') + ';');
    }
  const ms = performance.now() - t0;
  const vs = window.__villages.villagesNear(0, 0, R + 6);
  for (const v of vs) {
    mix(v.id + v.kind + v.color + JSON.stringify(v.spawn) + JSON.stringify(v.plaza) + JSON.stringify(v.doors.map((d) => [d.q, d.r, d.d, d.type, d.world.x.toFixed(4), d.world.z.toFixed(4)])));
    for (const c of v.cells) mix(JSON.stringify([c.q, c.r, c.role, c.field, c.garden, c.square, c.plaza, c.fences, c.items.map((i) => [i.asset, i.world.x.toFixed(4), i.world.z.toFixed(4), i.world.y, i.rotY.toFixed(6), i.door, i.face])]));
  }
  return { digest: h.toString(16), cells: n, villages: vs.length, ms: Math.round(ms), layerMs: window.__kfb.stats().layerMs };
};
try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  if (mode === 'digest') {
    for (const seed of (arg ?? '1337').split(',')) {
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:5180/?showcase=villages&seed=${seed}`);
      await page.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 240000 });
      const res = await page.evaluate(DIGEST, 60);
      console.log(seed, JSON.stringify(res));
      await page.close();
    }
  } else if (mode === 'prof') {
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Profiler.enable');
    await cdp.send('Profiler.setSamplingInterval', { interval: 200 });
    await cdp.send('Profiler.start');
    await page.goto('http://127.0.0.1:5180/' + (arg ?? ''));
    await page.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 240000 });
    const { profile: p } = await cdp.send('Profiler.stop');
    const byId = new Map(p.nodes.map((n) => [n.id, n]));
    const parent = new Map();
    for (const n of p.nodes) for (const c of n.children ?? []) parent.set(c, n.id);
    const self = new Map(), incl = new Map();
    const name = (n) => n.callFrame.functionName + ' ' + n.callFrame.url.split('/').slice(-2).join('/').replace(/\?.*/, '') + ':' + n.callFrame.lineNumber;
    p.samples.forEach((s, i) => {
      const dt = p.timeDeltas[i] ?? 0;
      const n = byId.get(s);
      self.set(name(n), (self.get(name(n)) ?? 0) + dt);
      const seen = new Set();
      let id = s;
      while (id !== undefined) { const nn = byId.get(id); const k = name(nn); if (!seen.has(k)) { seen.add(k); incl.set(k, (incl.get(k) ?? 0) + dt); } id = parent.get(id); }
    });
    const top = (m, f) => [...m].filter(([k]) => f(k)).sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, t]) => (t / 1000).toFixed(0) + 'ms ' + k).join('\n');
    console.log('SELF (villages files)\n' + top(self, (k) => /villages\//.test(k)));
    console.log('INCL (villages files)\n' + top(incl, (k) => /villages\//.test(k)));
    console.log('SELF all\n' + top(self, () => true));
  } else {
    for (let i = 0; i < Number(arg ?? 2) * 2; i++) {
      const page = await ctx.newPage();
      const t0 = Date.now();
      const legacy = i % 2 === 0;
      await page.goto('http://127.0.0.1:5180/' + (legacy ? '?vlegacy=1' : ''));
      await page.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 240000 });
      const st = await page.evaluate(() => ({ nav: Math.round(performance.now()), layerMs: window.__kfb.stats().layerMs, err: window.__kfb.errors.length }));
      console.log(legacy ? 'before' : 'after ', JSON.stringify({ wallMs: Date.now() - t0, ...st }));
      await page.close();
    }
  }
} finally { await browser.close(); }
