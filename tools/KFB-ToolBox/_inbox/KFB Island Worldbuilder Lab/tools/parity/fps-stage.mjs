// fps on the game stage (PondLand): N seconds of frame times while walking (W held), per variant of url params.
// node tools/parity/fps-stage.mjs [seconds=6] [variant params …]   e.g. "" "sky=0" "clouds=0"
import { chromium } from 'playwright-core';
const [secArg, ...vars] = process.argv.slice(2), SEC = Number(secArg ?? 6);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: false, args: ['--ignore-gpu-blocklist', '--window-size=1600,1000'] });
for (const v of vars.length ? vars : ['']) {
  const p = await (await b.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 })).newPage();
  await p.goto('http://127.0.0.1:5192/?play=game&sound=0' + (v ? '&' + v : ''));
  await p.waitForFunction(() => window.__kfb?.play?.() && window.__kfb.hud?.(), null, { timeout: 180000 });
  await p.waitForTimeout(4000);
  const r = await p.evaluate((SEC) => new Promise((res) => { const P = window.__kfb.play(); P.keys.fwd = true; const ft = []; let last = performance.now(); const t0 = last;
    const f = (t) => { ft.push(t - last); last = t; if (t - t0 < SEC * 1000) requestAnimationFrame(f); else { P.keys.fwd = false; const s = [...ft].sort((a, b) => a - b), q = (k) => s[Math.min(s.length - 1, Math.floor(k * s.length))];
      res({ frames: ft.length, medianFps: +(1000 / q(0.5)).toFixed(1), p5Fps: +(1000 / q(0.95)).toFixed(1), worstMs: +s[s.length - 1].toFixed(1), stats: window.__kfb.stats?.() }); } }; requestAnimationFrame(f); }), SEC);
  console.log(JSON.stringify({ variant: v || 'default', ...r }));
  await p.context().close();
}
await b.close();
